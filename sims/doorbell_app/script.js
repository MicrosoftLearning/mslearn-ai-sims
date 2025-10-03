// Image data based on spec mapping
const images = [
    {
        item: `10:15`,
        originalPath: "images/door-image-2.png",
        objectsPath: "images/door-image-2-objects.png",
        detectedObjects: "One person"
    },
    {
        item: `11:30`,
        originalPath: "images/door-image-3.png",
        objectsPath: "images/door-image-3-objects.png",
        detectedObjects: "One person"
    },
    {
        item: `15:45`,
        originalPath: "images/door-image-4.png",
        objectsPath: "images/door-image-4-objects.png",
        detectedObjects: "Two dogs"
    }
];

// DOM elements
const thumbnailGrid = document.getElementById('thumbnailGrid');
const imageDisplay = document.getElementById('imageDisplay');
const imageInfo = document.getElementById('imageInfo');
const itemNumber = document.getElementById('itemNumber');
const buttonContainer = document.getElementById('buttonContainer');
const analyzeButton = document.getElementById('analyzeButton');
const analyzingMessage = document.getElementById('analyzingMessage');
const detectedObjects = document.getElementById('detectedObjects');
const objectsList = document.getElementById('objectsList');

// Current selection
let currentSelection = null;
let analysisTimeout = null;

// Initialize the app
function init() {
    loadThumbnails();
}

// Load thumbnails in the left panel
function loadThumbnails() {
    thumbnailGrid.innerHTML = '';
    
    images.forEach((image, index) => {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = 'thumbnail-item';
        thumbnailItem.dataset.index = index;
        thumbnailItem.dataset.item = image.item;
        thumbnailItem.setAttribute('role', 'listitem');
        thumbnailItem.setAttribute('tabindex', '0');
        thumbnailItem.setAttribute('aria-label', `Doorbell photo from ${image.item} containing ${image.detectedObjects.toLowerCase()}`);
        thumbnailItem.setAttribute('aria-selected', 'false');
        
        thumbnailItem.innerHTML = `
            <img src="${image.originalPath}" alt="Doorbell photo from ${image.item} showing ${image.detectedObjects.toLowerCase()}" class="thumbnail-image">
            <div class="thumbnail-label">TimeStamp ${image.item}</div>
        `;
        
        thumbnailItem.addEventListener('click', () => selectImage(index));
        thumbnailItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectImage(index);
            }
        });
        thumbnailGrid.appendChild(thumbnailItem);
    });
}

// Current image state
let isAnalyzed = false;

// Screen reader announcement utility
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after a short delay
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Select and display an image
function selectImage(index) {
    // Update selection in the thumbnail grid
    if (currentSelection !== null) {
        const prevSelected = thumbnailGrid.querySelector(`[data-index="${currentSelection}"]`);
        if (prevSelected) {
            prevSelected.classList.remove('selected');
            prevSelected.setAttribute('aria-selected', 'false');
        }
    }
    
    currentSelection = index;
    const selectedItem = thumbnailGrid.querySelector(`[data-index="${index}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        selectedItem.setAttribute('aria-selected', 'true');
    }
    
    // Update all other thumbnails to not be selected
    const allThumbnails = thumbnailGrid.querySelectorAll('.thumbnail-item');
    allThumbnails.forEach((item, i) => {
        if (i !== index) {
            item.setAttribute('aria-selected', 'false');
        }
    });
    
    const image = images[index];
    
    // Clear any pending analysis timeout
    if (analysisTimeout) {
        clearTimeout(analysisTimeout);
        analysisTimeout = null;
    }
    
    // Hide the analyze button since analysis will happen automatically
    buttonContainer.style.display = 'none';
    detectedObjects.style.display = 'none';
    imageInfo.style.display = 'none';
    
    // Hide AI disclaimer
    const aiDisclaimer = document.getElementById('aiDisclaimer');
    aiDisclaimer.style.display = 'none';
    
    // Announce image selection to screen readers
    announceToScreenReader(`Loading doorbell photo from ${image.item}`);
    
    // Show analyzing message immediately
    imageDisplay.innerHTML = `
        <div class="analyzing-message-inline" role="status" aria-live="assertive">
            <div class="spinner" aria-hidden="true"></div>
            <p>Analyzing image...</p>
        </div>
    `;
    imageDisplay.setAttribute('aria-label', `Analyzing doorbell photo from ${image.item}`);
    
    // After 2 seconds, show the objects image and detected objects
    analysisTimeout = setTimeout(() => {
        // Switch to objects image
        imageDisplay.innerHTML = `
            <img src="${image.objectsPath}" alt="Doorbell photo from ${image.item} with detected objects highlighted, showing ${image.detectedObjects.toLowerCase()}" class="main-image">
        `;
        imageDisplay.setAttribute('aria-label', `Analysis complete for doorbell photo from ${image.item}`);
        
        // Show detected objects text
        itemNumber.textContent = `What's in the photo: ${image.detectedObjects}`;
        imageInfo.style.display = 'block';
        
        // Show AI disclaimer
        const aiDisclaimer = document.getElementById('aiDisclaimer');
        aiDisclaimer.style.display = 'block';
        
        // Announce completion to screen readers
        announceToScreenReader(`Analysis complete. Detected objects: ${image.detectedObjects}`);
        
        analysisTimeout = null;
    }, 2000);
}

// Analyze the selected image
function analyzeImage() {
    if (currentSelection === null) return;
    
    const image = images[currentSelection];
    
    if (!isAnalyzed) {
        // Announce analysis start
        announceToScreenReader('Starting image analysis');
        
        // Replace the original image with analyzing message
        imageDisplay.innerHTML = `
            <div class="analyzing-message-inline" role="status" aria-live="assertive">
                <div class="spinner" aria-hidden="true"></div>
                <p>Analyzing image...</p>
            </div>
        `;
        detectedObjects.style.display = 'none';
        
        // Disable button during analysis
        analyzeButton.disabled = true;
        analyzeButton.textContent = 'Analyzing...';
        analyzeButton.setAttribute('aria-label', 'Analysis in progress');
        
        // After 2 seconds, show the objects image and detected objects
        analysisTimeout = setTimeout(() => {
            // Switch to objects image
            imageDisplay.innerHTML = `
                <img src="${image.objectsPath}" alt="Doorbell photo from ${image.item} with detected objects highlighted, showing ${image.detectedObjects.toLowerCase()}" class="main-image">
            `;
            
            // Show detected objects text
            itemNumber.textContent = `What's in the photo: ${image.detectedObjects}`;
            imageInfo.style.display = 'block';
            
            // Show AI disclaimer
            const aiDisclaimer = document.getElementById('aiDisclaimer');
            aiDisclaimer.style.display = 'block';
            
            // Update button state
            isAnalyzed = true;
            analyzeButton.disabled = false;
            analyzeButton.textContent = 'Show Original';
            analyzeButton.setAttribute('aria-label', `Show original image from ${image.item}`);
            updateImageStatus();
            
            // Announce completion
            announceToScreenReader(`Analysis complete. Detected objects: ${image.detectedObjects}`);
            
            analysisTimeout = null;
        }, 2000);
        
    } else {
        // Switch back to original image
        imageDisplay.innerHTML = `
            <img src="${image.originalPath}" alt="Original doorbell photo from ${image.item} showing ${image.detectedObjects.toLowerCase()}" class="main-image">
        `;
        
        // Hide detected objects text and disclaimer
        detectedObjects.style.display = 'none';
        const aiDisclaimer = document.getElementById('aiDisclaimer');
        aiDisclaimer.style.display = 'none';
        
        isAnalyzed = false;
        analyzeButton.textContent = 'Analyze Image';
        analyzeButton.setAttribute('aria-label', `Analyze doorbell photo from ${image.item}`);
        updateImageStatus();
        
        // Announce change
        announceToScreenReader('Showing original image');
    }
}

// Update the image status indicator
function updateImageStatus() {
    const imageStatus = document.getElementById('imageStatus');
    
    if (isAnalyzed) {
        imageStatus.textContent = 'Showing: Objects Analysis';
        imageStatus.className = 'image-status analyzed';
    } else {
        imageStatus.textContent = 'Showing: Original Image';
        imageStatus.className = 'image-status original';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Add event listener for analyze button
    const analyzeButton = document.getElementById('analyzeButton');
    analyzeButton.addEventListener('click', analyzeImage);
    
    // Add keyboard navigation for thumbnail grid
    thumbnailGrid.addEventListener('keydown', (e) => {
        const thumbnails = Array.from(thumbnailGrid.querySelectorAll('.thumbnail-item'));
        const currentIndex = thumbnails.findIndex(item => item === document.activeElement);
        
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                newIndex = (currentIndex + 1) % thumbnails.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = thumbnails.length - 1;
                break;
        }
        
        if (newIndex !== currentIndex && thumbnails[newIndex]) {
            thumbnails[newIndex].focus();
        }
    });
});