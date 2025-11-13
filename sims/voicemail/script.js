// Message data based on the specification
const messageData = {
    message1: {
        audioFile: "messages/Message1.wav",
        summary: "Jenny from Coho Cafe called to request an addition of an extra box of dark roast coffee to their order for next month. She asked for confirmation via phone call.",
        caller: "Jenny",
        company: "Coho Cafe",
        sentiment: "Neutral",
        tasks: [
            "Call Jenny to confirm the addition of an extra box of dark roast coffee to the order."
        ],
        contactDetails: {
            tel: "555-867-5309"
        }
    },
    message2: {
        audioFile: "messages/Message2.wav",
        summary: "Mike from an auto dealership called to report that their coffee machine has stopped working. He requested immediate assistance to fix the issue.",
        caller: "Mike",
        company: "None",
        sentiment: "Negative",
        tasks: [
            "Visit the auto dealership to inspect and repair the coffee machine."
        ],
        contactDetails: null
    },
    message3: {
        audioFile: "messages/Message3.wav",
        summary: "Pete from Northwind Traders called to express interest in acquiring a new coffee machine and provided contact details for further communication or to receive a quote.",
        caller: "Pete",
        company: "Northwind Traders",
        sentiment: "Positive",
        tasks: [
            "Send a quote for a new coffee machine to Pete at Northwind Traders."
        ],
        contactDetails: {
            tel: "555-101-8080",
            email: "pete@northwind.com"
        }
    }
};

// DOM elements
let analysisContent;
let messageItems;

// Security utility function to escape HTML
function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    analysisContent = document.getElementById('analysisContent');
    messageItems = document.querySelectorAll('.message-item');
    
    // Initialize accessibility attributes
    messageItems.forEach(item => {
        item.setAttribute('aria-selected', 'false');
        item.setAttribute('role', 'button');
    });
    
    // Add click and keyboard event listeners to message items
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            const messageId = this.getAttribute('data-message');
            selectMessage(messageId, this);
        });
        
        // Add keyboard navigation support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const messageId = this.getAttribute('data-message');
                selectMessage(messageId, this);
            }
        });
    });

    // Add fallback for missing coffee image
    const coffeeImage = document.getElementById('coffeeImage');
    if (coffeeImage) {
        coffeeImage.addEventListener('error', function() {
            // If image fails to load, replace with a text placeholder
            this.style.display = 'none';
            const textPlaceholder = document.createElement('div');
            textPlaceholder.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--cream);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: var(--coffee-medium);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            `;
            textPlaceholder.textContent = '☕';
            this.parentNode.insertBefore(textPlaceholder, this);
        });
    }
});

// Function to select and display a message
function selectMessage(messageId, element) {
    // Remove active class and aria-selected from all message items
    messageItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });
    
    // Add active class and aria-selected to selected message
    element.classList.add('active');
    element.setAttribute('aria-selected', 'true');
    
    // Get message data
    const message = messageData[messageId];
    if (!message) {
        console.error('Message data not found for:', messageId);
        return;
    }
    
    // Display the analysis
    displayAnalysis(message, messageId);
}

// Function to display the AI analysis
function displayAnalysis(message, messageId) {
    const sentimentClass = getSentimentClass(message.sentiment);
    const messageNumber = messageId.replace('message', '');
    
    const analysisHTML = `
        <h3 id="analysis-heading">AI Analysis for Message ${escapeHtml(messageNumber)}</h3>
        
        <div class="audio-player">
            <audio controls aria-label="Voicemail audio player for message ${escapeHtml(messageNumber)} from ${escapeHtml(message.caller)}">
                <source src="${escapeHtml(message.audioFile)}" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
        
        <div class="analysis-section">
            <h4 id="summary-heading">Summary:</h4>
            <p aria-labelledby="summary-heading">${escapeHtml(message.summary)}</p>
        </div>
        
        <div class="analysis-section">
            <h4 id="caller-heading">Caller:</h4>
            <p aria-labelledby="caller-heading">${escapeHtml(message.caller)}</p>
        </div>
        
        <div class="analysis-section">
            <h4 id="company-heading">Company:</h4>
            <p aria-labelledby="company-heading">${escapeHtml(message.company)}</p>
        </div>
        
        <div class="analysis-section">
            <h4 id="sentiment-heading">Sentiment:</h4>
            <p class="${escapeHtml(sentimentClass)}" aria-labelledby="sentiment-heading" aria-describedby="sentiment-description">${escapeHtml(message.sentiment)}</p>
            <span id="sentiment-description" class="sr-only">Sentiment analysis indicates ${escapeHtml(message.sentiment.toLowerCase())} tone in the voicemail</span>
        </div>
        
        <div class="analysis-section">
            <h4 id="tasks-heading">Tasks:</h4>
            <ul aria-labelledby="tasks-heading" role="list">
                ${message.tasks.map((task, index) => `<li role="listitem">Task ${index + 1}: ${escapeHtml(task)}</li>`).join('')}
            </ul>
        </div>
        
        <div class="analysis-section">
            <h4 id="contact-heading">Contact Details:</h4>
            <div aria-labelledby="contact-heading">
                ${formatContactDetails(message.contactDetails)}
            </div>
        </div>
    `;
    
    analysisContent.innerHTML = analysisHTML;
    
    // Announce to screen readers that content has been updated
    // Escape data for screen reader announcement (even though textContent is used internally)
    const announcement = `AI analysis loaded for message ${escapeHtml(messageNumber)} from ${escapeHtml(message.caller)}. ${escapeHtml(message.sentiment)} sentiment detected.`;
    announceToScreenReader(announcement);
}

// Function to get CSS class for sentiment
function getSentimentClass(sentiment) {
    switch (sentiment.toLowerCase()) {
        case 'positive':
            return 'sentiment-positive';
        case 'negative':
            return 'sentiment-negative';
        case 'neutral':
            return 'sentiment-neutral';
        default:
            return '';
    }
}

// Function to format contact details
function formatContactDetails(contactDetails) {
    if (!contactDetails) {
        return '<p>None available</p>';
    }
    
    let html = '';
    if (contactDetails.tel) {
        html += `<p><span aria-label="Telephone number">${escapeHtml(contactDetails.tel)}</span></p>`;
    }
    if (contactDetails.email) {
        html += `<p><span aria-label="Email address">${escapeHtml(contactDetails.email)}</span></p>`;
    }
    
    return html || '<p>None available</p>';
}

// Function to announce messages to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after it's been read
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}