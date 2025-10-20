// Image Analyzer JavaScript
class ImageAnalyzer {
    constructor() {
        this.model = null;
        this.imageInput = document.getElementById('imageInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.imagePreview = document.getElementById('imagePreview');
        this.resultsSection = document.getElementById('resultsSection');
        this.loading = document.getElementById('loading');
        this.predictions = document.getElementById('predictions');
        
        this.init();
    }

    async init() {
        // Load the MobileNetV3 model
        try {
            console.log('Loading MobileNetV3 model...');
            // Use version 2 (MobileNetV3) with smaller size and better efficiency
            this.model = await mobilenet.load({
                version: 2,
                alpha: 1.0,  // Model width multiplier
                modelUrl: undefined,  // Use default CDN
                inputRange: [0, 1]
            });
            console.log('MobileNetV3 model loaded successfully');
            this.showModelStatus(true);
        } catch (error) {
            console.error('Error loading model:', error);
            this.showModelStatus(false);
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Upload button click
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        // File input change
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Analyze button click
        this.analyzeBtn.addEventListener('click', () => {
            this.analyzeImage();
        });

        // Drag and drop functionality
        this.imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imagePreview.classList.add('drag-over');
        });

        this.imagePreview.addEventListener('dragleave', () => {
            this.imagePreview.classList.remove('drag-over');
        });

        this.imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imagePreview.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.displayImage(files[0]);
            }
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.displayImage(file);
        }
    }

    displayImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Selected image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.objectFit = 'contain';
            
            this.imagePreview.innerHTML = '';
            this.imagePreview.appendChild(img);
            
            // Enable analyze button if model is loaded
            if (this.model) {
                this.analyzeBtn.disabled = false;
            }
            
            // Clear previous results
            this.predictions.innerHTML = '';
        };
        reader.readAsDataURL(file);
    }

    async analyzeImage() {
        if (!this.model) {
            alert('Model not loaded yet. Please wait...');
            return;
        }

        const img = this.imagePreview.querySelector('img');
        if (!img) {
            alert('Please select an image first.');
            return;
        }

        // Show loading state
        this.loading.style.display = 'block';
        this.predictions.innerHTML = '';
        this.analyzeBtn.disabled = true;

        try {
            // Make predictions with MobileNetV3
            // Get top 5 predictions instead of default 3 for better results
            const predictions = await this.model.classify(img, 5);
            
            // Hide loading state
            this.loading.style.display = 'none';
            this.analyzeBtn.disabled = false;
            
            // Display results
            this.displayResults(predictions);
            
        } catch (error) {
            console.error('Error analyzing image:', error);
            this.loading.style.display = 'none';
            this.analyzeBtn.disabled = false;
            this.predictions.innerHTML = '<div class="error">Error analyzing image. Please try again.</div>';
        }
    }

    displayResults(predictions) {
        if (!predictions || predictions.length === 0) {
            this.predictions.innerHTML = '<div class="no-results">No predictions available.</div>';
            return;
        }

        const resultsHTML = predictions.map((prediction, index) => {
            const confidence = (prediction.probability * 100).toFixed(2);
            const confidenceClass = this.getConfidenceClass(prediction.probability);
            
            return `
                <div class="prediction-item ${confidenceClass}">
                    <div class="prediction-rank">#${index + 1}</div>
                    <div class="prediction-details">
                        <div class="prediction-class">${prediction.className}</div>
                        <div class="prediction-confidence">
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${confidence}%"></div>
                            </div>
                            <span class="confidence-text">${confidence}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.predictions.innerHTML = resultsHTML;
    }

    getConfidenceClass(probability) {
        if (probability > 0.7) return 'high-confidence';
        if (probability > 0.4) return 'medium-confidence';
        return 'low-confidence';
    }

    showModelStatus(loaded) {
        const status = document.createElement('div');
        status.className = `model-status ${loaded ? 'success' : 'error'}`;
        status.innerHTML = loaded 
            ? '✅ MobileNetV3 Ready' 
            : '❌ Model Loading Failed';
        
        // Remove any existing status
        const existingStatus = document.querySelector('.model-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Add status to header
        const header = document.querySelector('header');
        header.appendChild(status);
        
        // Remove status after 3 seconds if successful
        if (loaded) {
            setTimeout(() => {
                if (status.parentNode) {
                    status.remove();
                }
            }, 3000);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageAnalyzer();
});