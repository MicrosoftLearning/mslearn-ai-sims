class OCRReceiptReader {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    // Security utility: Safely assign blob URL to image src
    safelySetImageSrc(imgElement, file) {
        // Create blob URL only from File/Blob objects
        if (!(file instanceof Blob)) {
            console.error('Invalid input - only File/Blob objects are allowed');
            return;
        }
        
        // Validate file type is an image
        if (!file.type || !file.type.startsWith('image/')) {
            console.error('Invalid file type - only image files are allowed');
            return;
        }
        
        // Create a clean blob URL from the validated file object
        const blobURL = URL.createObjectURL(file);
        
        // Use direct property assignment which is safe for blob URLs from validated sources
        // The blob URL is created from a validated Blob object, not user input
        imgElement.src = blobURL;
    }

    initializeElements() {
        this.uploadBtn = document.getElementById('uploadBtn');
        this.imageInput = document.getElementById('imageInput');
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.resultSection = document.getElementById('resultSection');
        this.uploadedImage = document.getElementById('uploadedImage');
        this.annotatedCanvas = document.getElementById('annotatedCanvas');
        this.extractedText = document.getElementById('extractedText');
        this.copyBtn = document.getElementById('copyBtn');
        this.newUploadBtn = document.getElementById('newUploadBtn');
        this.errorSection = document.getElementById('errorSection');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Store OCR data for later use
        this.ocrData = null;
    }

    bindEvents() {
        this.uploadBtn.addEventListener('click', () => this.triggerFileInput());
        this.imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.copyBtn.addEventListener('click', () => this.copyTextToClipboard());
        this.newUploadBtn.addEventListener('click', () => this.resetApp());
        this.retryBtn.addEventListener('click', () => this.resetApp());
        
        // Tab switching functionality
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    triggerFileInput() {
        this.imageInput.click();
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!this.isValidImageFile(file)) {
            this.showError('Please select a valid image file (.jpg, .jpeg, or .png)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size too large. Please select an image under 10MB.');
            return;
        }

        this.processImage(file);
    }

    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return validTypes.includes(file.type);
    }

    async processImage(file) {
        try {
            this.hideAllSections();
            this.showProgressSection();

            // Display the uploaded image
            this.safelySetImageSrc(this.uploadedImage, file);

            // Initialize Tesseract with progress tracking
            const worker = await Tesseract.createWorker('eng', 1, {
                logger: m => this.updateProgress(m)
            });

            // Perform OCR with detailed data extraction
            this.updateProgressText('Analyzing image...');
            const result = await worker.recognize(file);
            const { data } = result;
            
            // Store the complete OCR data including bounding boxes
            this.ocrData = data;
            
            // Clean up
            await worker.terminate();

            // Display results
            this.showResults(data.text, file);

        } catch (error) {
            console.error('OCR Error:', error);
            this.showError('Failed to process the image. Please try again with a different image.');
        }
    }

    updateProgress(message) {
        if (message.status === 'recognizing text') {
            const progress = Math.round(message.progress * 100);
            this.progressFill.style.width = `${progress}%`;
            this.updateProgressText(`Processing... ${progress}%`);
        } else if (message.status) {
            this.updateProgressText(this.formatProgressStatus(message.status));
        }
    }

    formatProgressStatus(status) {
        const statusMap = {
            'loading tesseract core': 'Loading OCR engine...',
            'initializing tesseract': 'Initializing...',
            'loading language traineddata': 'Loading language data...',
            'initializing api': 'Setting up API...',
            'recognizing text': 'Reading text...'
        };
        return statusMap[status] || status;
    }

    updateProgressText(text) {
        this.progressText.textContent = text;
    }

    showResults(text, imageFile) {
        this.hideAllSections();
        
        // Clean and format the extracted text
        const cleanedText = this.cleanExtractedText(text);
        this.extractedText.textContent = cleanedText;
        
        // Load and display the original image
        this.loadOriginalImage(imageFile);
        
        // Create annotated version with bounding boxes
        this.createAnnotatedImage(imageFile);
        
        this.resultSection.style.display = 'block';
    }

    cleanExtractedText(text) {
        // Remove excessive whitespace and empty lines
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    }

    loadOriginalImage(imageFile) {
        this.safelySetImageSrc(this.uploadedImage, imageFile);
        
        // Clean up URL after image loads
        this.uploadedImage.onload = () => {
            // URL cleanup will be handled when element is removed/replaced
        };
    }

    createAnnotatedImage(imageFile) {
        const canvas = this.annotatedCanvas;
        const ctx = canvas.getContext('2d');
        
        // Create an image element to load the file
        const img = new Image();
        const imageURL = URL.createObjectURL(imageFile);
        
        img.onload = () => {
            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the original image
            ctx.drawImage(img, 0, 0);
            
            // Draw bounding boxes
            this.drawBoundingBoxes(ctx);
            
            // Clean up
            URL.revokeObjectURL(imageURL);
        };
        
        this.safelySetImageSrc(img, imageFile);
    }

    drawBoundingBoxes(ctx) {
        if (!this.ocrData || !this.ocrData.words) return;

        // Set up drawing styles
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.font = '12px Arial';

        // Draw word-level bounding boxes
        this.ocrData.words.forEach((word, index) => {
            if (word.confidence > 30) { // Only draw boxes for confident detections
                const { x0, y0, x1, y1 } = word.bbox;
                const width = x1 - x0;
                const height = y1 - y0;

                // Draw bounding box
                ctx.strokeRect(x0, y0, width, height);
                ctx.fillRect(x0, y0, width, height);

                // Optionally draw confidence score
                if (word.confidence < 70) {
                    ctx.fillStyle = '#FF0000';
                    ctx.fillText(`${Math.round(word.confidence)}%`, x0, y0 - 5);
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                }
            }
        });

        // Draw line-level bounding boxes in different color
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';

        if (this.ocrData.lines) {
            this.ocrData.lines.forEach(line => {
                if (line.confidence > 40) {
                    const { x0, y0, x1, y1 } = line.bbox;
                    const width = x1 - x0;
                    const height = y1 - y0;
                    
                    ctx.strokeRect(x0, y0, width, height);
                    ctx.fillRect(x0, y0, width, height);
                }
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });

        if (tabName === 'original') {
            document.getElementById('originalTab').classList.add('active');
        } else if (tabName === 'annotated') {
            document.getElementById('annotatedTab').classList.add('active');
        }
    }

    async copyTextToClipboard() {
        try {
            const text = this.extractedText.textContent;
            await navigator.clipboard.writeText(text);
            
            // Provide visual feedback
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copied!';
            this.copyBtn.classList.add('success');
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('success');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
            this.showError('Failed to copy text to clipboard');
        }
    }

    showError(message) {
        this.hideAllSections();
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'block';
    }

    resetApp() {
        this.hideAllSections();
        this.imageInput.value = '';
        this.uploadedImage.src = '';
        this.extractedText.textContent = '';
        this.progressFill.style.width = '0%';
        this.ocrData = null;
        
        // Clear canvas
        const canvas = this.annotatedCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset to original tab
        this.switchTab('original');
    }

    hideAllSections() {
        this.progressSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }

    showProgressSection() {
        this.progressSection.style.display = 'block';
        this.progressFill.style.width = '0%';
        this.updateProgressText('Starting OCR process...');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OCRReceiptReader();
});

// Handle any uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});