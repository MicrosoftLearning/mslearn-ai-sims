import * as webllm from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

class ChatPlayground {
    constructor() {
        this.engine = null;
        this.isModelLoaded = false;
        this.conversationHistory = [];
        this.isGenerating = false;
        this.currentSystemMessage = "You are an AI assistant that helps people find information.";
        this.currentModelId = null;
        
        // Model parameters
        this.modelParameters = {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
            repetition_penalty: 1.1
        };
        
        // File upload
        this.uploadedFileContent = null;
        this.uploadedFileName = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeParameterControls();
        this.initializeFileUpload();
        this.initializeModel();
    }
    
    initializeElements() {
        this.progressContainer = document.getElementById('progress-container');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.modelSelect = document.getElementById('model-select');
        this.systemMessage = document.getElementById('system-message');
        this.applyBtn = document.getElementById('apply-btn');
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.stopBtn = document.getElementById('stop-btn');
    }
    
    initializeParameterControls() {
        // Initialize all parameter sliders
        const parameterSliders = [
            { id: 'temperature-slider', valueId: 'temperature-value', param: 'temperature' },
            { id: 'top-p-slider', valueId: 'top-p-value', param: 'top_p' },
            { id: 'max-tokens-slider', valueId: 'max-tokens-value', param: 'max_tokens' },
            { id: 'repetition-penalty-slider', valueId: 'repetition-penalty-value', param: 'repetition_penalty' }
        ];
        
        parameterSliders.forEach(({ id, valueId, param }) => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(valueId);
            
            if (slider && valueDisplay) {
                // Set initial value
                slider.value = this.modelParameters[param];
                valueDisplay.textContent = this.modelParameters[param];
                
                // Add event listener for real-time updates
                slider.addEventListener('input', (e) => {
                    const value = param === 'max_tokens' ? parseInt(e.target.value) : parseFloat(e.target.value);
                    this.modelParameters[param] = value;
                    valueDisplay.textContent = value;
                    
                    // Show toast notification for parameter change
                    this.showToast(`${this.formatParameterName(param)}: ${value}`);
                });
            }
        });
    }
    
    formatParameterName(param) {
        const names = {
            'temperature': 'Temperature',
            'top_p': 'Top P',
            'max_tokens': 'Max Tokens',
            'repetition_penalty': 'Repetition Penalty'
        };
        return names[param] || param;
    }
    
    initializeFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.txt')) {
            alert('Please select a text file (.txt)');
            event.target.value = '';
            return;
        }
        
        // Validate file size (3KB = 3072 bytes)
        if (file.size > 3072) {
            alert('File size must be 3KB or smaller');
            event.target.value = '';
            return;
        }
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedFileContent = e.target.result;
            this.uploadedFileName = file.name;
            this.displayFileInfo(file);
            this.showToast(`File "${file.name}" uploaded successfully`);
        };
        
        reader.onerror = () => {
            alert('Error reading file');
            event.target.value = '';
        };
        
        reader.readAsText(file);
    }
    
    displayFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const addDataBtn = document.getElementById('add-data-btn');
        
        if (fileInfo && fileName && fileSize && addDataBtn) {
            fileName.textContent = file.name;
            fileSize.textContent = `${(file.size / 1024).toFixed(1)}KB`;
            fileInfo.style.display = 'flex';
            addDataBtn.textContent = '📁 Replace data source';
        }
    }
    
    removeFile() {
        this.uploadedFileContent = null;
        this.uploadedFileName = null;
        
        const fileInfo = document.getElementById('file-info');
        const fileInput = document.getElementById('file-input');
        const addDataBtn = document.getElementById('add-data-btn');
        
        if (fileInfo && fileInput && addDataBtn) {
            fileInfo.style.display = 'none';
            fileInput.value = '';
            addDataBtn.textContent = '📁 Add data source';
        }
        
        this.showToast('File removed');
    }
    
    getEffectiveSystemMessage() {
        let systemMessage = this.currentSystemMessage;
        
        // Append uploaded file content if available
        if (this.uploadedFileContent) {
            systemMessage += '\n\n---\nUse this data to answer questions:\n' + this.uploadedFileContent;
        }
        
        return systemMessage;
    }
    
    attachEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        
        this.applyBtn.addEventListener('click', () => {
            this.currentSystemMessage = this.systemMessage.value;
            this.showToast('System message updated');
        });
        
        this.stopBtn.addEventListener('click', () => this.stopGeneration());
        
        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = Math.min(this.userInput.scrollHeight, 120) + 'px';
        });
        
        // Clear chat button
        document.querySelector('.chat-controls .icon-btn').addEventListener('click', () => {
            this.clearChat();
        });
    }
    
    async initializeModel() {
        try {
            this.updateProgress(0, 'Discovering available models...');
            console.log('Starting WebLLM initialization...');
            
            // Check if WebLLM is available
            if (!webllm || !webllm.CreateMLCEngine || !webllm.prebuiltAppConfig) {
                throw new Error('WebLLM not properly loaded');
            }
            
            // Get available models from WebLLM
            const models = webllm.prebuiltAppConfig.model_list;
            console.log('All available models:', models.map(m => m.model_id));
            
            // Filter for Phi models first
            let availableModels = models.filter(model => 
                model.model_id.toLowerCase().includes('phi')
            );
            
            // If no Phi models, try other small models
            if (availableModels.length === 0) {
                availableModels = models.filter(model => 
                    model.model_id.toLowerCase().includes('llama-3.2-1b') ||
                    model.model_id.toLowerCase().includes('gemma-2-2b')
                );
            }
            
            if (availableModels.length === 0) {
                throw new Error('No compatible models found');
            }
            
            console.log('Available models for loading:', availableModels.map(m => m.model_id));
            
            this.updateProgress(10, 'Loading model...');
            
            // Try to load the first available model
            let engineCreated = false;
            
            for (const model of availableModels) {
                try {
                    console.log(`Trying to load model: ${model.model_id}`);
                    this.updateProgress(15, `Loading ${model.model_id}...`);
                    
                    this.engine = await webllm.CreateMLCEngine(
                        model.model_id,
                        {
                            initProgressCallback: (progress) => {
                                console.log('Progress:', progress);
                                const percentage = Math.max(15, Math.round(progress.progress * 85) + 15);
                                this.updateProgress(percentage, `Loading ${model.model_id}: ${Math.round(progress.progress * 100)}%`);
                            }
                        }
                    );
                    
                    console.log(`Successfully loaded model: ${model.model_id}`);
                    this.currentModelId = model.model_id;
                    engineCreated = true;
                    break;
                    
                } catch (modelError) {
                    console.error(`Failed to load ${model.model_id}:`, modelError);
                    continue;
                }
            }
            
            if (!engineCreated) {
                throw new Error('Failed to load any available models. Please check your internet connection and try again.');
            }
            
            console.log('WebLLM engine created successfully');
            this.updateProgress(100, 'Model ready!');
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.enableUI();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to initialize WebLLM:', error);
            this.updateProgress(0, `Error: ${error.message}`);
            
            // Don't create mock engine - show error instead
            setTimeout(() => {
                this.updateProgress(0, 'Failed to load AI model. Please refresh the page and check your internet connection.');
            }, 3000);
        }
    }
    
    updateProgress(percentage, text) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = text;
    }
    
    enableUI() {
        this.isModelLoaded = true;
        this.modelSelect.disabled = false;
        this.systemMessage.disabled = false;
        this.applyBtn.disabled = false;
        this.userInput.disabled = false;
        this.sendBtn.disabled = false;
        this.userInput.focus();
        
        // Populate model dropdown with available models
        this.populateModelDropdown();
    }
    
    populateModelDropdown() {
        // Clear existing options
        this.modelSelect.innerHTML = '';
        
        if (!webllm || !webllm.prebuiltAppConfig) {
            this.modelSelect.innerHTML = '<option value="">No models available</option>';
            return;
        }
        
        // Get all available models
        const allModels = webllm.prebuiltAppConfig.model_list;
        
        // Filter for suitable models (smaller ones that work well)
        const suitableModels = allModels.filter(model => {
            const modelId = model.model_id.toLowerCase();
            return modelId.includes('phi') || 
                   modelId.includes('llama-3.2-1b') ||
                   modelId.includes('llama-3.2-3b') ||
                   modelId.includes('gemma-2-2b') ||
                   modelId.includes('qwen2.5-0.5b') ||
                   modelId.includes('qwen2.5-1.5b');
        });
        
        // Sort models by preference (Phi first, then by size)
        suitableModels.sort((a, b) => {
            const aId = a.model_id.toLowerCase();
            const bId = b.model_id.toLowerCase();
            
            // Phi models first
            if (aId.includes('phi') && !bId.includes('phi')) return -1;
            if (!aId.includes('phi') && bId.includes('phi')) return 1;
            
            // Then by model name
            return aId.localeCompare(bId);
        });
        
        // Add models to dropdown
        suitableModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.model_id;
            option.textContent = this.formatModelName(model.model_id);
            
            // Mark current model as selected
            if (model.model_id === this.currentModelId) {
                option.selected = true;
                option.textContent += ' (Current)';
            }
            
            this.modelSelect.appendChild(option);
        });
        
        // Add event listener for model changes
        this.modelSelect.addEventListener('change', (e) => {
            if (e.target.value && e.target.value !== this.currentModelId) {
                this.switchModel(e.target.value);
            }
        });
    }
    
    formatModelName(modelId) {
        // Convert model ID to friendly display name
        let name = modelId.replace(/-/g, ' ').replace(/_/g, ' ');
        
        // Capitalize each word
        name = name.replace(/\b\w/g, l => l.toUpperCase());
        
        // Clean up common patterns
        name = name.replace(/Mlc$/i, '');
        name = name.replace(/Q4f\d+/i, '');
        name = name.replace(/Instruct/i, '');
        name = name.replace(/\s+/g, ' ').trim();
        
        // Add specific formatting for known models
        if (name.toLowerCase().includes('phi')) {
            name = name.replace(/Phi\s*3/i, 'Microsoft Phi-3');
        } else if (name.toLowerCase().includes('llama')) {
            name = name.replace(/Llama/i, 'Meta Llama');
        } else if (name.toLowerCase().includes('gemma')) {
            name = name.replace(/Gemma/i, 'Google Gemma');
        } else if (name.toLowerCase().includes('qwen')) {
            name = name.replace(/Qwen/i, 'Alibaba Qwen');
        }
        
        return name;
    }
    
    async switchModel(newModelId) {
        if (this.isGenerating) {
            alert('Please wait for the current response to complete before switching models.');
            this.modelSelect.value = this.currentModelId;
            return;
        }
        
        try {
            // Show progress
            this.progressContainer.style.display = 'block';
            this.updateProgress(0, `Switching to ${this.formatModelName(newModelId)}...`);
            
            // Disable UI
            this.modelSelect.disabled = true;
            this.userInput.disabled = true;
            this.sendBtn.disabled = true;
            
            console.log(`Switching to model: ${newModelId}`);
            
            // Create new engine with selected model
            this.engine = await webllm.CreateMLCEngine(
                newModelId,
                {
                    initProgressCallback: (progress) => {
                        console.log('Switch progress:', progress);
                        const percentage = Math.round(progress.progress * 100);
                        this.updateProgress(percentage, `Loading ${this.formatModelName(newModelId)}: ${percentage}%`);
                    }
                }
            );
            
            this.currentModelId = newModelId;
            console.log(`Successfully switched to model: ${newModelId}`);
            
            // Clear conversation history when switching models
            this.clearChat();
            
            this.updateProgress(100, 'Model switched successfully!');
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.enableUI();
                this.showToast(`Switched to ${this.formatModelName(newModelId)} - Conversation restarted`);
            }, 1000);
            
        } catch (error) {
            console.error(`Failed to switch to model ${newModelId}:`, error);
            this.updateProgress(0, `Failed to switch model: ${error.message}`);
            
            // Revert dropdown selection
            this.modelSelect.value = this.currentModelId;
            
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.enableUI();
                alert(`Failed to switch to ${this.formatModelName(newModelId)}. Please try a different model.`);
            }, 3000);
        }
    }
    
    async handleSendMessage() {
        if (!this.isModelLoaded || this.isGenerating) return;
        
        const userMessage = this.userInput.value.trim();
        if (!userMessage) return;
        
        // Add user message to chat
        this.addMessage('user', userMessage);
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        
        // Show typing indicator
        const typingIndicator = this.addTypingIndicator();
        
        this.isGenerating = true;
        this.updateUIForGeneration(true);
        
        try {
            // Prepare conversation history
            const messages = [
                { role: "system", content: this.getEffectiveSystemMessage() }
            ];
            
            // Add last 10 conversation pairs
            const recentHistory = this.conversationHistory.slice(-20); // 10 pairs = 20 messages
            messages.push(...recentHistory);
            messages.push({ role: "user", content: userMessage });
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add assistant message container
            const assistantMessageEl = this.addMessage('assistant', '');
            const contentEl = assistantMessageEl.querySelector('.message-content');
            
            let fullResponse = '';
            
            // Stream the response
            const completion = await this.engine.chat.completions.create({
                messages: messages,
                temperature: this.modelParameters.temperature,
                top_p: this.modelParameters.top_p,
                max_tokens: this.modelParameters.max_tokens,
                repetition_penalty: this.modelParameters.repetition_penalty,
                stream: true
            });
            
            for await (const chunk of completion) {
                if (!this.isGenerating) break; // Check if generation was stopped
                
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullResponse += content;
                    contentEl.textContent = fullResponse;
                    
                    // Auto-scroll to bottom
                    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                    
                    // Small delay to simulate typing effect - reduced for faster typing
                    await new Promise(resolve => setTimeout(resolve, 8));
                }
            }
            
            // Add to conversation history
            this.conversationHistory.push({ role: "user", content: userMessage });
            this.conversationHistory.push({ role: "assistant", content: fullResponse });
            
            // Update token count (approximate)
            this.updateTokenCount();
            
        } catch (error) {
            console.error('Error generating response:', error);
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            this.addMessage('assistant', 'Sorry, I encountered an error while generating a response. Please try again.');
        } finally {
            this.isGenerating = false;
            this.updateUIForGeneration(false);
        }
    }
    
    addMessage(role, content) {
        // Hide welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}-message`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        const roleName = role === 'user' ? 'You' : 'Assistant';
        
        messageEl.innerHTML = `
            <div class="message-header">
                <div class="message-avatar ${role}-avatar">${avatar}</div>
                <div class="message-role">${roleName}</div>
            </div>
            <div class="message-content">${content}</div>
        `;
        
        this.chatMessages.appendChild(messageEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        return messageEl;
    }
    
    addTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'message assistant-message';
        typingEl.innerHTML = `
            <div class="message-header">
                <div class="message-avatar assistant-avatar">🤖</div>
                <div class="message-role">Assistant</div>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        return typingEl;
    }
    
    updateUIForGeneration(isGenerating) {
        this.sendBtn.disabled = isGenerating;
        this.userInput.disabled = isGenerating;
        this.stopBtn.style.display = isGenerating ? 'block' : 'none';
        
        if (isGenerating) {
            this.sendBtn.textContent = '⏳';
        } else {
            this.sendBtn.textContent = '➤';
        }
    }
    
    stopGeneration() {
        this.isGenerating = false;
        this.updateUIForGeneration(false);
    }
    
    clearChat() {
        this.conversationHistory = [];
        this.chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="chat-icon">💬</div>
                <h3>Start with a prompt</h3>
            </div>
        `;
        this.updateTokenCount();
    }
    
    updateTokenCount() {
        // Approximate token count (rough estimate: 1 token ≈ 4 characters)
        const totalChars = this.conversationHistory.reduce((acc, msg) => acc + msg.content.length, 0);
        const approxTokens = Math.ceil(totalChars / 4);
        
        const tokenCountEl = document.querySelector('.token-count');
        if (tokenCountEl) {
            tokenCountEl.textContent = `*${approxTokens}/128000 tokens in thread`;
        }
    }
    
    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0078d4;
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Global functions for UI interactions
window.toggleSetup = function() {
    const setupPanel = document.querySelector('.setup-panel');
    const hideBtn = document.querySelector('.hide-btn');
    
    if (setupPanel.classList.contains('collapsed')) {
        setupPanel.classList.remove('collapsed');
        hideBtn.textContent = '📦 Hide';
    } else {
        setupPanel.classList.add('collapsed');
        hideBtn.textContent = '📦 Show';
    }
};

window.toggleSection = function(sectionId) {
    const content = document.getElementById(sectionId);
    const button = content.previousElementSibling;
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        button.textContent = button.textContent.replace('▼', '▶');
    } else {
        content.style.display = 'block';
        button.textContent = button.textContent.replace('▶', '▼');
    }
};

window.resetParameters = function() {
    // Get the app instance (we'll need to store it globally)
    if (window.chatPlaygroundApp) {
        // Reset to default values
        const defaults = {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
            repetition_penalty: 1.1
        };
        
        // Update app parameters
        window.chatPlaygroundApp.modelParameters = { ...defaults };
        
        // Update sliders and displays
        const updates = [
            { slider: 'temperature-slider', value: 'temperature-value', param: 'temperature' },
            { slider: 'top-p-slider', value: 'top-p-value', param: 'top_p' },
            { slider: 'max-tokens-slider', value: 'max-tokens-value', param: 'max_tokens' },
            { slider: 'repetition-penalty-slider', value: 'repetition-penalty-value', param: 'repetition_penalty' }
        ];
        
        updates.forEach(({ slider, value, param }) => {
            const sliderEl = document.getElementById(slider);
            const valueEl = document.getElementById(value);
            if (sliderEl && valueEl) {
                sliderEl.value = defaults[param];
                valueEl.textContent = defaults[param];
            }
        });
        
        window.chatPlaygroundApp.showToast('Parameters reset to defaults');
    }
};

window.triggerFileUpload = function() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.click();
    }
};

window.removeFile = function() {
    if (window.chatPlaygroundApp) {
        window.chatPlaygroundApp.removeFile();
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatPlaygroundApp = new ChatPlayground();
});