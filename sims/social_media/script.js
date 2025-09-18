// Blue Yonder Airlines - Social Media Analysis Dashboard JavaScript

class SocialMediaAnalyzer {
    constructor() {
        this.posts = [];
        this.loadedPosts = [];
        this.currentPostIndex = 0;
        this.isCapturing = false;
        this.captureInterval = null;
        this.selectedPostId = null;
        
        this.initializeEventListeners();
        this.loadSocialMediaPosts();
        this.drawSentimentGauge(0);
    }

    async loadSocialMediaPosts() {
        try {
            const response = await fetch('social_media_posts.json');
            const data = await response.json();
            this.posts = data.posts;
        } catch (error) {
            console.error('Error loading social media posts:', error);
        }
    }

    initializeEventListeners() {
        const captureBtn = document.getElementById('captureBtn');
        captureBtn.addEventListener('click', () => this.toggleCapture());
        
        // Add keyboard navigation for posts list
        const postsList = document.getElementById('postsList');
        postsList.addEventListener('keydown', (e) => this.handlePostsListKeyboard(e));
    }

    handlePostsListKeyboard(event) {
        const posts = document.querySelectorAll('.post-item');
        const currentSelected = document.querySelector('.post-item.selected');
        let currentIndex = Array.from(posts).indexOf(currentSelected);
        
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentIndex = Math.min(currentIndex + 1, posts.length - 1);
                if (posts[currentIndex]) {
                    posts[currentIndex].click();
                    posts[currentIndex].focus();
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                if (posts[currentIndex]) {
                    posts[currentIndex].click();
                    posts[currentIndex].focus();
                }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (currentSelected) {
                    currentSelected.click();
                }
                break;
        }
    }

    toggleCapture() {
        if (this.isCapturing) {
            this.stopCapture();
        } else {
            this.startCapture();
        }
    }

    startCapture() {
        this.isCapturing = true;
        const captureBtn = document.getElementById('captureBtn');
        captureBtn.textContent = 'Stop capturing';
        captureBtn.classList.add('stop');
        captureBtn.setAttribute('aria-pressed', 'true');
        captureBtn.setAttribute('aria-label', 'Stop capturing social media posts');
        
        this.scheduleNextPost();
    }

    stopCapture() {
        this.isCapturing = false;
        const captureBtn = document.getElementById('captureBtn');
        captureBtn.textContent = 'Start capturing';
        captureBtn.classList.remove('stop');
        captureBtn.setAttribute('aria-pressed', 'false');
        captureBtn.setAttribute('aria-label', 'Start capturing social media posts');
        
        if (this.captureInterval) {
            clearTimeout(this.captureInterval);
            this.captureInterval = null;
        }
    }

    scheduleNextPost() {
        if (!this.isCapturing || this.posts.length === 0) return;

        // Random delay between 1-3 seconds
        const delay = Math.random() * 2000 + 1000;
        
        this.captureInterval = setTimeout(() => {
            this.addNextPost();
            this.scheduleNextPost();
        }, delay);
    }

    addNextPost() {
        if (this.posts.length === 0) return;

        // Get the next post (cycle through if at the end)
        const post = this.posts[this.currentPostIndex];
        this.currentPostIndex = (this.currentPostIndex + 1) % this.posts.length;

        // Add timestamp
        const postWithTimestamp = {
            ...post,
            timestamp: new Date()
        };

        this.loadedPosts.unshift(postWithTimestamp); // Add to beginning
        this.updatePostsList();
        this.updateStatistics();
        this.updateSentimentGauge();
    }

    updatePostsList() {
        const postsList = document.getElementById('postsList');
        
        // Clear and rebuild the list
        postsList.innerHTML = '';
        
        this.loadedPosts.forEach((post, index) => {
            const postElement = this.createPostElement(post);
            postsList.appendChild(postElement);
        });
        
        // Update accessibility attributes for the list
        const totalPosts = this.loadedPosts.length;
        postsList.setAttribute('aria-label', `List of ${totalPosts} social media posts. Use arrow keys to navigate.`);
        
        // Announce new post to screen readers
        if (totalPosts > 0) {
            const latestPost = this.loadedPosts[0];
            const announcement = `New post added by ${latestPost.username} with ${latestPost.sentiment} sentiment. Total posts: ${totalPosts}`;
            this.announceToScreenReader(announcement);
        }
    }

    createPostElement(post) {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        postItem.dataset.postId = post.id;
        postItem.setAttribute('role', 'option');
        postItem.setAttribute('tabindex', '0');
        
        const sentimentEmoji = this.getSentimentEmoji(post.sentiment);
        const sentimentText = post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1);
        const previewText = post.text.length > 27 ? post.text.substring(0, 27) + '...' : post.text;
        
        // Create comprehensive aria-label for the post
        const ariaLabel = `Post by ${post.username} at ${this.formatDateTime(post.timestamp)}. ${sentimentText} sentiment. ${previewText}`;
        postItem.setAttribute('aria-label', ariaLabel);
        
        postItem.innerHTML = `
            <div class="post-meta">
                <div class="post-datetime" aria-hidden="true">${this.formatDateTime(post.timestamp)}</div>
                <div class="post-username" aria-hidden="true">${post.username}</div>
                <div class="post-preview" aria-hidden="true">${previewText}</div>
            </div>
            <div class="post-sentiment" aria-hidden="true" title="${sentimentText} sentiment">${sentimentEmoji}</div>
        `;
        
        postItem.addEventListener('click', () => this.selectPost(post));
        postItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectPost(post);
            }
        });
        
        return postItem;
    }

    selectPost(post) {
        // Update selected post ID
        this.selectedPostId = post.id;
        
        // Update visual selection and accessibility attributes
        document.querySelectorAll('.post-item').forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });
        
        const selectedItem = document.querySelector(`[data-post-id="${post.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            selectedItem.setAttribute('aria-selected', 'true');
            selectedItem.focus();
        }
        
        // Display post details
        this.displayPostDetails(post);
        
        // Announce selection to screen readers
        const announcement = `Selected post by ${post.username} with ${post.sentiment} sentiment`;
        this.announceToScreenReader(announcement);
    }

    displayPostDetails(post) {
        const postDetails = document.getElementById('postDetails');
        const sentimentEmoji = this.getSentimentEmoji(post.sentiment);
        const sentimentText = post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1);
        
        postDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Date & Time:</div>
                <div class="detail-value" aria-label="Posted on ${this.formatDateTime(post.timestamp)}">${this.formatDateTime(post.timestamp)}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">Poster:</div>
                <div class="detail-value" aria-label="Posted by ${post.username}">${post.username}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">Full Text:</div>
                <div class="detail-value" aria-label="Post content: ${post.text}">${post.text}</div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">Sentiment:</div>
                <div class="detail-value">
                    <div class="sentiment-display" aria-label="${sentimentText} sentiment">
                        <span>${sentimentText}</span>
                        <span aria-hidden="true" title="${sentimentText} sentiment">${sentimentEmoji}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-item">
                <div class="detail-label">Key Phrases:</div>
                <div class="detail-value">
                    <div class="key-phrases" aria-label="Key phrases: ${post.keyPhrases.join(', ')}">
                        ${post.keyPhrases.map(phrase => `<span class="key-phrase" aria-hidden="true">${phrase}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    updateStatistics() {
        const total = this.loadedPosts.length;
        const positive = this.loadedPosts.filter(post => post.sentiment === 'positive').length;
        const negative = this.loadedPosts.filter(post => post.sentiment === 'negative').length;
        const neutral = this.loadedPosts.filter(post => post.sentiment === 'neutral').length;
        
        document.getElementById('totalPosts').textContent = total;
        document.getElementById('positivePosts').textContent = positive;
        document.getElementById('negativePosts').textContent = negative;
        document.getElementById('neutralPosts').textContent = neutral;
        
        // Update ARIA labels for screen readers
        document.getElementById('totalPosts').setAttribute('aria-label', `${total} total posts loaded`);
        document.getElementById('positivePosts').setAttribute('aria-label', `${positive} positive sentiment posts`);
        document.getElementById('negativePosts').setAttribute('aria-label', `${negative} negative sentiment posts`);
        document.getElementById('neutralPosts').setAttribute('aria-label', `${neutral} neutral sentiment posts`);
    }

    updateSentimentGauge() {
        const averageSentiment = this.calculateAverageSentiment();
        this.drawSentimentGauge(averageSentiment);
        
        const sentimentValueElement = document.getElementById('sentimentValue');
        sentimentValueElement.textContent = averageSentiment.toFixed(2);
        
        // Update accessibility description
        let sentimentDescription = 'neutral';
        if (averageSentiment > 0.1) sentimentDescription = 'positive';
        else if (averageSentiment < -0.1) sentimentDescription = 'negative';
        
        sentimentValueElement.setAttribute('aria-label', 
            `Current average sentiment: ${averageSentiment.toFixed(2)}, which is ${sentimentDescription}`);
        
        // Update canvas accessibility
        const canvas = document.getElementById('sentimentGauge');
        canvas.setAttribute('aria-label', 
            `Sentiment gauge showing ${averageSentiment.toFixed(2)} on a scale from negative 1 to positive 1. Current sentiment is ${sentimentDescription}.`);
    }

    calculateAverageSentiment() {
        if (this.loadedPosts.length === 0) return 0;
        
        const sentimentValues = this.loadedPosts.map(post => {
            switch (post.sentiment) {
                case 'positive': return 1;
                case 'negative': return -1;
                case 'neutral': return 0;
                default: return 0;
            }
        });
        
        const sum = sentimentValues.reduce((a, b) => a + b, 0);
        return sum / sentimentValues.length;
    }

    drawSentimentGauge(value) {
        const canvas = document.getElementById('sentimentGauge');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height - 20;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gauge background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#e0e6ff';
        ctx.stroke();
        
        // Draw colored segments
        this.drawGaugeSegment(ctx, centerX, centerY, radius, Math.PI, Math.PI * 4/3, '#f44336', 18); // Negative (red)
        this.drawGaugeSegment(ctx, centerX, centerY, radius, Math.PI * 4/3, Math.PI * 5/3, '#ffc107', 18); // Neutral (yellow)
        this.drawGaugeSegment(ctx, centerX, centerY, radius, Math.PI * 5/3, 0, '#4CAF50', 18); // Positive (green)
        
        // Draw needle
        const angle = Math.PI + (Math.PI * (value + 1) / 2);
        this.drawNeedle(ctx, centerX, centerY, radius - 10, angle);
        
        // Draw scale labels
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('-1', centerX - radius * 0.8, centerY + 15);
        ctx.fillText('0', centerX, centerY + 25);
        ctx.fillText('+1', centerX + radius * 0.8, centerY + 15);
    }

    drawGaugeSegment(ctx, centerX, centerY, radius, startAngle, endAngle, color, lineWidth) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    drawNeedle(ctx, centerX, centerY, length, angle) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * length,
            centerY + Math.sin(angle) * length
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2c3e50';
        ctx.stroke();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();
    }

    getSentimentEmoji(sentiment) {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'negative': return '😞';
            case 'neutral': return '😐';
            default: return '😐';
        }
    }

    formatDateTime(date) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    announceToScreenReader(message) {
        // Create a temporary element for screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove the element after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SocialMediaAnalyzer();
});