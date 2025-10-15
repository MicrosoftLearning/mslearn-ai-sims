import * as webllm from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

class ChatApp {
    constructor() {
        this.engine = null;
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
        this.isGenerating = false;
        this.currentModelId = null;
        this.fileSearchEnabled = false;
        this.uploadedFileContent = null;
        this.uploadedFileName = null;
        
        this.initializeElements();
        this.setupEventListeners();
        
        // Skip the progress bar test and go straight to model discovery
        this.checkAvailableModels();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.modelSelect = document.getElementById('modelSelect');
        this.modelProgressContainer = document.getElementById('modelProgressContainer');
        this.modelProgressFill = document.getElementById('modelProgressFill');
        this.modelProgressText = document.getElementById('modelProgressText');
        this.fileSearchToggle = document.getElementById('fileSearchToggle');
        this.fileUploadSection = document.getElementById('fileUploadSection');
        this.fileUploadLink = document.getElementById('fileUploadLink');
        this.fileInput = document.getElementById('fileInput');
        this.uploadedFileInfo = document.getElementById('uploadedFileInfo');
        this.fileInfoText = document.getElementById('fileInfoText');
        this.fileRemoveBtn = document.getElementById('fileRemoveBtn');
        this.fileLimitNote = document.getElementById('fileLimitNote');
        this.fileContentModal = document.getElementById('fileContentModal');
        this.modalFileName = document.getElementById('modalFileName');
        this.modalFileContent = document.getElementById('modalFileContent');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmModalTitle = document.getElementById('confirmModalTitle');
        this.confirmModalMessage = document.getElementById('confirmModalMessage');
        this.confirmCancelBtn = document.getElementById('confirmCancelBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.statusAnnouncements = document.getElementById('statusAnnouncements');
        
        console.log('Elements initialized:', {
            modelSelect: !!this.modelSelect,
            modelProgressContainer: !!this.modelProgressContainer,
            modelProgressFill: !!this.modelProgressFill,
            modelProgressText: !!this.modelProgressText,
            fileSearchToggle: !!this.fileSearchToggle,
            statusAnnouncements: !!this.statusAnnouncements
        });
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.modelSelect.addEventListener('change', (e) => {
            if (e.target.value && e.target.value !== this.currentModelId) {
                this.switchModel(e.target.value);
            }
        });

        // Listen for changes to the Instructions textarea
        const instructionsTextarea = document.querySelector('.instruction-box textarea');
        if (instructionsTextarea) {
            instructionsTextarea.addEventListener('input', () => {
                this.resetConversationHistory();
            });
        }

        // File search toggle functionality
        if (this.fileSearchToggle) {
            this.fileSearchToggle.addEventListener('click', () => {
                this.toggleFileSearch();
            });
            
            // Add keyboard support for toggle
            this.fileSearchToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFileSearch();
                }
            });
        }

        // File upload link functionality
        if (this.fileUploadLink) {
            this.fileUploadLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.fileInput.click();
            });
        }

        // File input change handler
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }

        // File remove button functionality
        if (this.fileRemoveBtn) {
            this.fileRemoveBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the file info click
                this.confirmRemoveFile();
            });
        }

        // Modal functionality
        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => {
                this.closeFileContentModal();
            });
        }

        // Close modal when clicking outside
        if (this.fileContentModal) {
            this.fileContentModal.addEventListener('click', (e) => {
                if (e.target === this.fileContentModal) {
                    this.closeFileContentModal();
                }
            });
        }

        // Confirmation modal event listeners
        if (this.confirmCancelBtn) {
            this.confirmCancelBtn.addEventListener('click', () => {
                this.closeConfirmModal();
            });
        }

        if (this.confirmDeleteBtn) {
            this.confirmDeleteBtn.addEventListener('click', () => {
                this.handleConfirmDelete();
            });
        }

        // Close confirmation modal when clicking outside
        if (this.confirmModal) {
            this.confirmModal.addEventListener('click', (e) => {
                if (e.target === this.confirmModal) {
                    this.closeConfirmModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.confirmModal.style.display !== 'none') {
                    this.closeConfirmModal();
                } else if (this.fileContentModal.style.display !== 'none') {
                    this.closeFileContentModal();
                }
            }
        });
    }

    async initializeWebLLM() {
        try {
            this.updateStatus('Initializing AI model...', 'loading');
            this.showProgressBar();
            
            console.log('Starting WebLLM initialization...');
            
            // Try different model names that are known to work with WebLLM
            const modelNames = [
                "Llama-3.2-1B-Instruct-q4f32_1-MLC",
                "Phi-3.5-mini-instruct-q4f16_1-MLC", 
                "Llama-3.2-3B-Instruct-q4f32_1-MLC",
                "gemma-2-2b-it-q4f16_1-MLC"
            ];
            
            let engineCreated = false;
            
            for (const modelName of modelNames) {
                try {
                    console.log(`Trying model: ${modelName}`);
                    this.updateStatus(`Trying model: ${modelName.split('-')[0]}...`, 'loading');
                    
                    this.engine = await webllm.CreateMLCEngine(
                        modelName,
                        {
                            initProgressCallback: (progress) => {
                                console.log('Progress:', progress);
                                const percentage = Math.round(progress.progress * 100);
                                this.updateProgress(percentage);
                                this.updateStatus(`Loading ${modelName.split('-')[0]} model... ${percentage}%`, 'loading');
                            }
                        }
                    );
                    
                    console.log(`Successfully loaded model: ${modelName}`);
                    engineCreated = true;
                    break;
                } catch (modelError) {
                    console.log(`Failed to load ${modelName}:`, modelError.message);
                    continue;
                }
            }
            
            if (!engineCreated) {
                throw new Error('None of the available models could be loaded');
            }
            
            console.log('WebLLM engine created successfully');
            this.hideProgressBar();
            this.updateStatus('Ready to chat!', 'ready');
            this.enableInput();
        } catch (error) {
            console.error('Failed to initialize WebLLM:', error);
            this.hideProgressBar();
            this.updateStatus(`Failed to load AI model: ${error.message}. Please refresh the page.`, 'error');
        }
    }

    updateStatus(message, type = '') {
        // Update console for debugging
        console.log(`Status: ${message} (${type})`);
        
        // Announce status changes to screen readers
        if (this.statusAnnouncements) {
            this.statusAnnouncements.textContent = message;
        }
    }

    hideProgressBar() {
        // Legacy method - now points to model progress bar
        this.hideModelProgressBar();
    }

    updateProgress(percentage) {
        // Legacy method - now points to model progress bar
        this.updateModelProgress(percentage);
    }

    showModelProgressBar() {
        console.log('Showing model progress bar');
        this.modelProgressContainer.classList.add('visible');
        this.updateModelProgress(0);
        
        // Add a small delay to ensure the progress bar is visible
        setTimeout(() => {
            this.updateModelProgress(5); // Show some initial progress
        }, 100);
    }

    hideModelProgressBar() {
        console.log('Hiding model progress bar');
        this.modelProgressContainer.classList.remove('visible');
    }

    updateModelProgress(percentage, modelName = null) {
        console.log(`Updating model progress: ${percentage}%`);
        this.modelProgressFill.style.width = `${percentage}%`;
        
        // Include model name in progress text if provided
        if (modelName) {
            this.modelProgressText.textContent = `Loading ${this.formatModelName(modelName)} ${percentage}%`;
        } else if (this.currentModelId) {
            this.modelProgressText.textContent = `Loading ${this.formatModelName(this.currentModelId)} ${percentage}%`;
        } else {
            this.modelProgressText.textContent = `Loading ${percentage}%`;
        }
    }

    // Legacy methods redirected to model progress bar
    hideProgressBar() {
        this.hideModelProgressBar();
    }

    updateProgress(percentage) {
        this.updateModelProgress(percentage);
    }

    async checkAvailableModels() {
        try {
            console.log('Starting model discovery...');
            this.updateStatus('Discovering available models...', 'loading');
            
            // Check if WebLLM is available first
            if (!webllm || !webllm.prebuiltAppConfig) {
                throw new Error('WebLLM not properly loaded');
            }
            
            // Get available models from WebLLM
            const models = webllm.prebuiltAppConfig.model_list;
            console.log('All available models:', models.map(m => m.model_id));
            
            // Filter for Phi models
            const phiModels = models.filter(model => 
                model.model_id.toLowerCase().includes('phi')
            );
            
            console.log('All Phi models found:', phiModels.map(m => m.model_id));
            
            // Remove duplicates and keep only latest versions
            const uniquePhiModels = this.getLatestModelVersions(phiModels);
            
            console.log('Unique Phi models (latest versions):', uniquePhiModels.map(m => m.model_id));
            
            if (uniquePhiModels.length === 0) {
                throw new Error('No Phi models found in WebLLM configuration');
            }
            
            // Populate the dropdown
            this.populateModelDropdown(uniquePhiModels);
            
            // Select the preferred model
            let preferredModel = uniquePhiModels.find(m => m.model_id === 'phi-2-q4f16_1-MLC') || uniquePhiModels[0];
            
            this.modelSelect.value = preferredModel.model_id;
            this.currentModelId = preferredModel.model_id;
            
            console.log(`Selected model: ${preferredModel.model_id}`);
            this.updateStatus('Loading selected model...', 'loading');
            
            // Load the default model
            await this.loadSelectedModel(preferredModel.model_id);
            
        } catch (error) {
            console.error('Error in checkAvailableModels:', error);
            this.updateStatus(`Failed to discover models: ${error.message}`, 'error');
            
            // Enable dropdown even if model discovery fails
            this.modelSelect.disabled = false;
            this.modelSelect.innerHTML = '<option value="">Error loading models</option>';
        }
    }

    async loadSelectedModel(modelId) {
        try {
            this.updateStatus(`Loading ${this.formatModelName(modelId)}...`, 'loading');
            this.showModelProgressBar();
            
            await this.initializeWebLLMWithModel(modelId);
            this.currentModelId = modelId;
            
        } catch (error) {
            console.error(`Failed to load model ${modelId}:`, error);
            this.hideModelProgressBar();
            this.updateStatus(`Failed to load model: ${error.message}`, 'error');
        }
    }

    populateModelDropdown(phiModels) {
        // Clear existing options
        this.modelSelect.innerHTML = '';
        
        if (phiModels.length === 0) {
            this.modelSelect.innerHTML = '<option value="">No Phi models available</option>';
            return;
        }
        
        // Add Phi models to dropdown
        phiModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.model_id;
            option.textContent = this.formatModelName(model.model_id);
            this.modelSelect.appendChild(option);
        });
        
        // Enable the dropdown
        this.modelSelect.disabled = false;
    }

    getLatestModelVersions(models) {
        // Group models by base name (without version suffixes)
        const modelGroups = {};
        
        models.forEach(model => {
            const baseName = this.getModelBaseName(model.model_id);
            if (!modelGroups[baseName]) {
                modelGroups[baseName] = [];
            }
            modelGroups[baseName].push(model);
        });
        
        // For each group, select the latest/best version
        const latestModels = [];
        for (const baseName in modelGroups) {
            const group = modelGroups[baseName];
            const latestModel = this.selectBestModelFromGroup(group);
            latestModels.push(latestModel);
        }
        
        return latestModels;
    }

    getModelBaseName(modelId) {
        // Extract base model name by removing version numbers, quantization info, etc.
        let baseName = modelId.toLowerCase();
        
        // Remove common suffixes
        baseName = baseName
            .replace(/-q4f16_1(-mlc)?.*$/, '')
            .replace(/-q4f32_1(-mlc)?.*$/, '')
            .replace(/-q0f16(-mlc)?.*$/, '')
            .replace(/-q0f32(-mlc)?.*$/, '')
            .replace(/-mlc.*$/, '')
            .replace(/-instruct.*$/, '')
            .replace(/-chat.*$/, '')
            .replace(/\d+k$/, '')  // Remove context length like "1k", "4k"
            .replace(/_\d+$/, ''); // Remove trailing numbers
        
        return baseName;
    }

    selectBestModelFromGroup(models) {
        // Preference order: q4f16 > q4f32 > others, instruct versions preferred
        const priorityOrder = [
            (m) => m.model_id.includes('instruct') && m.model_id.includes('q4f16'),
            (m) => m.model_id.includes('q4f16'),
            (m) => m.model_id.includes('instruct') && m.model_id.includes('q4f32'),
            (m) => m.model_id.includes('q4f32'),
            (m) => m.model_id.includes('instruct'),
            (m) => true // fallback
        ];
        
        for (const priorityCheck of priorityOrder) {
            const candidates = models.filter(priorityCheck);
            if (candidates.length > 0) {
                // If multiple candidates, prefer the one with shortest name (usually means latest/simplified)
                return candidates.sort((a, b) => a.model_id.length - b.model_id.length)[0];
            }
        }
        
        return models[0]; // fallback
    }

    formatModelName(modelId) {
        // Make model names more user-friendly
        return modelId
            .replace('-q4f16_1-MLC', '')
            .replace('-q4f32_1-MLC', '')
            .replace('phi-', 'Phi ')
            .replace('Phi-', 'Phi ')
            .toUpperCase();
    }

    async switchModel(modelId) {
        if (this.isGenerating) {
            console.log('Cannot switch model while generating response');
            // Reset dropdown to current model
            this.modelSelect.value = this.currentModelId;
            return;
        }
        
        try {
            this.updateStatus(`Switching to ${this.formatModelName(modelId)}...`, 'loading');
            this.showModelProgressBar();
            this.disableInput();
            
            await this.loadSelectedModel(modelId);
            
            // Reset conversation when switching models
            this.resetConversationHistory();
            
        } catch (error) {
            console.error(`Failed to switch to model ${modelId}:`, error);
            this.updateStatus(`Failed to switch model: ${error.message}`, 'error');
            this.hideModelProgressBar();
            // Reset dropdown to current model
            this.modelSelect.value = this.currentModelId;
        }
    }

    async initializeWebLLMWithModel(modelId) {
        try {
            console.log(`Initializing with model: ${modelId}`);
            this.updateStatus(`Loading ${modelId}...`, 'loading');
            
            this.engine = await webllm.CreateMLCEngine(
                modelId,
                {
                    initProgressCallback: (progress) => {
                        console.log('Progress:', progress);
                        const percentage = Math.round(progress.progress * 100);
                        this.updateModelProgress(percentage, modelId);
                        this.updateStatus(`Loading model... ${percentage}%`, 'loading');
                    }
                }
            );
            
            console.log('WebLLM engine created successfully');
            this.hideModelProgressBar();
            this.updateStatus('Ready to chat!', 'ready');
            this.enableInput();
        } catch (error) {
            console.error(`Failed to load model ${modelId}:`, error);
            this.hideModelProgressBar();
            this.updateStatus(`Failed to load model: ${error.message}`, 'error');
        }
    }

    enableInput() {
        this.userInput.disabled = false;
        this.sendButton.disabled = false;
        this.userInput.focus();
    }

    disableInput() {
        this.userInput.disabled = true;
        this.sendButton.disabled = true;
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isGenerating) {
            console.log('Message blocked:', { message: message, isGenerating: this.isGenerating });
            return;
        }

        console.log('Starting sendMessage for:', message);

        // Add user message to chat
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        // Disable input while generating
        this.isGenerating = true;
        this.disableInput();
        this.updateStatus('Thinking...', 'loading');

        try {
            // Add user message to conversation history
            this.conversationHistory.push({ role: 'user', content: message });
            console.log('Conversation history length:', this.conversationHistory.length);
            
            // Prepare messages for the model
            const messages = this.buildMessageHistory();
            console.log('Messages to send to model:', messages);
            
            // Create assistant message element for streaming
            const assistantMessageElement = this.addMessage('', 'assistant', true);
            const messageTextElement = assistantMessageElement.querySelector('.message-text');
            
            // Show typing indicator
            this.showTypingIndicator(messageTextElement);
            
            // Generate response
            console.log('Creating chat completion...');
            const asyncChunkGenerator = await this.engine.chat.completions.create({
                messages: messages,
                temperature: 0.7,
                max_tokens: 512,
                stream: true,
            });

            console.log('Chat completion created, processing chunks...');
            
            // Start streaming response immediately
            let fullResponse = '';
            let displayedResponse = '';
            let firstChunkReceived = false;
            
            // Process chunks as they arrive for immediate display
            for await (const chunk of asyncChunkGenerator) {
                const delta = chunk.choices[0]?.delta?.content || '';
                if (delta) {
                    // Clear typing indicator on first actual content and start immediate display
                    if (!firstChunkReceived) {
                        this.clearTypingIndicator(messageTextElement);
                        firstChunkReceived = true;
                        console.log('First chunk received, cleared typing indicator');
                    }
                    
                    fullResponse += delta;
                    
                    // Display each character with a small delay for typing effect
                    for (let char of delta) {
                        displayedResponse += char;
                        messageTextElement.textContent = displayedResponse;
                        this.scrollToBottom();
                        // Small delay for typing animation effect
                        await new Promise(resolve => setTimeout(resolve, 20));
                    }
                }
            }

            console.log('Response complete. Full response length:', fullResponse.length);

            // Add assistant response to conversation history
            this.conversationHistory.push({ role: 'assistant', content: fullResponse });
            
            // Add file reference if file search is enabled and file is uploaded
            if (this.fileSearchEnabled && this.uploadedFileName) {
                this.addFileReference(assistantMessageElement, this.uploadedFileName);
            }
            
            // Trim conversation history if needed
            this.trimConversationHistory();
            
            console.log('Final conversation history length:', this.conversationHistory.length);
            
        } catch (error) {
            console.error('Error generating response:', error);
            console.error('Error stack:', error.stack);
            
            // Clear typing indicator if messageTextElement exists
            if (typeof messageTextElement !== 'undefined') {
                this.clearTypingIndicator(messageTextElement);
            }
            
            this.addMessage('Sorry, I encountered an error while processing your request. Please try again.', 'assistant');
        } finally {
            console.log('Sendmessage finally block - resetting state');
            this.isGenerating = false;
            this.enableInput();
            this.updateStatus('Ready to chat!', 'ready');
        }
    }

    buildMessageHistory() {
        // Get the system instructions from the UI
        const instructionsTextarea = document.querySelector('.instruction-box textarea');
        let systemInstructions = instructionsTextarea ? instructionsTextarea.value.trim() : 'You are a friendly and helpful AI assistant who answers questions.';
        
        console.log('Building message history - fileSearchEnabled:', this.fileSearchEnabled, 'uploadedFileContent exists:', !!this.uploadedFileContent);
        
        // Augment system instructions with file content if file search is enabled and file is uploaded
        if (this.fileSearchEnabled && this.uploadedFileContent) {
            systemInstructions += `\n\nAnswer only questions that are asked by the user. Use this data to answer questions:\n---\n${this.uploadedFileContent}\n---`;
            console.log('File content added to system instructions');
        } else {
            console.log('File content NOT added - fileSearchEnabled:', this.fileSearchEnabled, 'uploadedFileContent exists:', !!this.uploadedFileContent);
        }
        
        const messages = [
            { role: 'system', content: systemInstructions }
        ];
        
        // Add conversation history (up to last 10 exchanges)
        messages.push(...this.conversationHistory);
        
        return messages;
    }

    trimConversationHistory() {
        // Keep only the last maxHistoryLength exchanges (user-assistant pairs)
        const pairs = [];
        for (let i = 0; i < this.conversationHistory.length; i += 2) {
            if (i + 1 < this.conversationHistory.length) {
                pairs.push([this.conversationHistory[i], this.conversationHistory[i + 1]]);
            }
        }
        
        if (pairs.length > this.maxHistoryLength) {
            const trimmedPairs = pairs.slice(-this.maxHistoryLength);
            this.conversationHistory = trimmedPairs.flat();
        }
    }

    resetConversationHistory() {
        console.log('Resetting conversation history due to instructions change');
        this.conversationHistory = [];
        
        // Clear all messages except the initial welcome message
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep only the first welcome message
            const messages = chatMessages.querySelectorAll('.message');
            for (let i = 1; i < messages.length; i++) {
                messages[i].remove();
            }
        }
        
        console.log('Conversation history reset complete');
    }

    addFileReference(messageElement, fileName) {
        if (!fileName || !messageElement) return;
        
        const messageContent = messageElement.querySelector('.message-content');
        if (!messageContent) return;
        
        // Check if file reference already exists
        if (messageContent.querySelector('.file-reference')) return;
        
        const fileRef = document.createElement('div');
        fileRef.className = 'file-reference';
        fileRef.textContent = `ref: ${fileName}`;
        fileRef.setAttribute('aria-label', `Reference: ${fileName}`);
        messageContent.appendChild(fileRef);
    }

    addMessage(content, sender, isStreaming = false, fileName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.setAttribute('role', 'article');
        messageDiv.setAttribute('aria-label', `${sender === 'user' ? 'User' : 'Assistant'} message`);
        
        // Add avatar for both user and assistant
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        avatar.setAttribute('aria-hidden', 'true');
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = content;
        
        messageContent.appendChild(messageText);
        
        // Add file reference if this is an assistant message based on an uploaded file
        if (sender === 'assistant' && fileName) {
            const fileRef = document.createElement('div');
            fileRef.className = 'file-reference';
            fileRef.textContent = `ref: ${fileName}`;
            fileRef.setAttribute('aria-label', `Reference: ${fileName}`);
            messageContent.appendChild(fileRef);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    showTypingIndicator(element) {
        console.log('Showing typing indicator');
        console.log('Element:', element);
        const thinkingHTML = `
            <span class="thinking-text">Thinking</span>
            <span class="typing-indicator"></span>
            <span class="typing-indicator"></span>
            <span class="typing-indicator"></span>
        `;
        element.innerHTML = thinkingHTML;
        console.log('Element innerHTML after setting:', element.innerHTML);
        console.log('Element is visible:', element.offsetWidth > 0 && element.offsetHeight > 0);
    }

    clearTypingIndicator(element) {
        console.log('Clearing typing indicator');
        console.log('Element before clearing:', element.innerHTML);
        element.textContent = '';
    }

    toggleFileSearch() {
        this.fileSearchEnabled = !this.fileSearchEnabled;
        console.log('File search toggled:', this.fileSearchEnabled);
        
        if (this.fileSearchEnabled) {
            this.fileSearchToggle.classList.add('enabled');
            this.fileSearchToggle.setAttribute('aria-checked', 'true');
            this.fileUploadSection.style.display = 'block';
            
            // Reset conversation if file is already uploaded to ensure file content is included
            if (this.uploadedFileContent) {
                console.log('File search enabled with existing file - resetting conversation');
                this.resetConversationHistory();
            }
        } else {
            this.fileSearchToggle.classList.remove('enabled');
            this.fileSearchToggle.setAttribute('aria-checked', 'false');
            this.fileUploadSection.style.display = 'none';
            // Clear uploaded file data and reset UI
            this.clearUploadedFile();
            this.resetConversationHistory();
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        console.log('File selected:', file.name, 'Size:', file.size);

        // Check file size (5KB = 5120 bytes)
        if (file.size > 5120) {
            alert('File is too large. Please select a file smaller than 5KB.');
            event.target.value = ''; // Clear the file input
            return;
        }

        try {
            const text = await this.readFileAsText(file);
            this.uploadedFileContent = text;
            this.uploadedFileName = file.name;
            
            // Show file info and make it clickable
            this.fileInfoText.textContent = `📄 ${file.name} (${Math.round(file.size / 1024 * 10) / 10}KB)`;
            this.uploadedFileInfo.style.display = 'block';
            this.uploadedFileInfo.setAttribute('aria-label', `View contents of uploaded file: ${file.name}`);
            this.fileRemoveBtn.style.display = 'inline-block';
            this.fileLimitNote.style.display = 'block';
            
            // Disable the "+ File" link
            this.fileUploadLink.classList.add('disabled');
            this.fileUploadLink.setAttribute('aria-disabled', 'true');
            
            // Add click handler to show file contents (only to the text part)
            this.fileInfoText.onclick = () => {
                this.showFileContentModal();
            };
            
            // Add keyboard support for file info (only to the text part)
            this.fileInfoText.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showFileContentModal();
                }
            };
            
            // Reset conversation when new file is uploaded
            this.resetConversationHistory();
            
            console.log('File uploaded successfully:', file.name);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
        }

        // Clear the file input so the same file can be selected again if needed
        event.target.value = '';
    }

    confirmRemoveFile() {
        if (!this.uploadedFileName) return;
        
        this.showConfirmModal(this.uploadedFileName);
    }

    showConfirmModal(fileName) {
        // Store the element that had focus before opening modal
        this.lastFocusedElement = document.activeElement;
        
        this.confirmModalMessage.textContent = `Are you sure you want to remove "${fileName}"?`;
        this.confirmModal.style.display = 'flex';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus the cancel button by default (safer option)
        setTimeout(() => {
            this.confirmCancelBtn.focus();
        }, 100);
        
        console.log('Confirmation modal opened for:', fileName);
    }

    closeConfirmModal() {
        this.confirmModal.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
        
        // Return focus to the element that opened the modal
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
        
        console.log('Confirmation modal closed');
    }

    handleConfirmDelete() {
        this.closeConfirmModal();
        this.clearUploadedFile();
        this.resetConversationHistory();
        console.log('File removed by user:', this.uploadedFileName);
    }

    clearUploadedFile() {
        // Clear file data
        this.uploadedFileContent = null;
        this.uploadedFileName = null;
        
        // Hide file info, remove button, and limit note
        this.uploadedFileInfo.style.display = 'none';
        this.fileRemoveBtn.style.display = 'none';
        this.fileLimitNote.style.display = 'none';
        
        // Re-enable the "+ File" link
        this.fileUploadLink.classList.remove('disabled');
        this.fileUploadLink.setAttribute('aria-disabled', 'false');
        
        // Remove click handlers
        if (this.fileInfoText) {
            this.fileInfoText.onclick = null;
            this.fileInfoText.onkeydown = null;
        }
        
        // Turn off file search when file is removed
        if (this.fileSearchEnabled) {
            this.fileSearchEnabled = false;
            this.fileSearchToggle.classList.remove('enabled');
            this.fileSearchToggle.setAttribute('aria-checked', 'false');
            this.fileUploadSection.style.display = 'none';
            console.log('File search toggled off due to file removal');
        }
        
        console.log('File upload state cleared');
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    showFileContentModal() {
        if (!this.uploadedFileContent || !this.uploadedFileName) return;
        
        // Store the element that had focus before opening modal
        this.lastFocusedElement = document.activeElement;
        
        this.modalFileName.textContent = this.uploadedFileName;
        this.modalFileContent.textContent = this.uploadedFileContent;
        this.fileContentModal.style.display = 'flex';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for keyboard accessibility
        setTimeout(() => {
            this.modalCloseBtn.focus();
        }, 100);
        
        console.log('File content modal opened for:', this.uploadedFileName);
    }

    closeFileContentModal() {
        this.fileContentModal.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
        
        // Return focus to the element that opened the modal
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
        
        console.log('File content modal closed');
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking WebLLM availability...');
    
    // Add a small delay to ensure WebLLM has time to load
    setTimeout(() => {
        // Check if WebLLM is available
        if (typeof webllm === 'undefined') {
            console.error('WebLLM is not available!');
            document.getElementById('modelSelect').innerHTML = '<option value="">WebLLM not loaded</option>';
            return;
        }
        
        console.log('WebLLM is available, creating ChatApp...');
        new ChatApp();
    }, 500); // Give WebLLM time to load
});