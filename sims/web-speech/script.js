class SpeechApp {
    constructor() {
        this.speakButton = document.getElementById('speakButton');
        this.transcriptionDiv = document.getElementById('transcription');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        
        this.init();
    }
    
    init() {
        // Check if Web Speech API is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.transcriptionDiv.textContent = 'Speech recognition not supported in this browser.';
            this.speakButton.disabled = true;
            return;
        }
        
        if (!this.synthesis) {
            this.transcriptionDiv.textContent = 'Speech synthesis not supported in this browser.';
            this.speakButton.disabled = true;
            return;
        }
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load voices
        this.loadVoices();
        
        // Initial message
        this.transcriptionDiv.textContent = 'Click the button to start speaking';
    }
    
    setupEventListeners() {
        this.speakButton.addEventListener('click', () => this.handleSpeakClick());
        this.voiceSelect.addEventListener('change', () => this.handleVoiceChange());
        
        // Listen for voices changed event (some browsers load voices asynchronously)
        this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
        
        this.recognition.onstart = () => {
            console.log('Speech recognition started');
            this.transcriptionDiv.textContent = 'Listening...';
            this.transcriptionDiv.classList.add('listening');
        };
        
        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                } else {
                    transcript += event.results[i][0].transcript;
                }
            }
            this.transcriptionDiv.textContent = transcript || 'No speech detected';
        };
        
        this.recognition.onend = () => {
            console.log('Speech recognition ended');
            this.transcriptionDiv.classList.remove('listening');
            this.speakButton.disabled = false;
            this.speakButton.textContent = 'Click to speak';
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.transcriptionDiv.classList.remove('listening');
            this.transcriptionDiv.textContent = `Error: ${event.error}`;
            this.speakButton.disabled = false;
            this.speakButton.textContent = 'Click to speak';
        };
    }
    
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        if (this.voices.length === 0) {
            // Voices might not be loaded yet, try again after a short delay
            setTimeout(() => this.loadVoices(), 100);
            return;
        }
        
        // Clear existing options
        this.voiceSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Default Voice';
        this.voiceSelect.appendChild(defaultOption);
        
        // Add voice options
        this.voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            
            // Mark default voice for the browser's language
            if (voice.default) {
                option.textContent += ' - Default';
            }
            
            this.voiceSelect.appendChild(option);
        });
        
        console.log(`Loaded ${this.voices.length} voices`);
    }
    
    handleVoiceChange() {
        const selectedIndex = this.voiceSelect.value;
        if (selectedIndex === '') {
            this.selectedVoice = null;
        } else {
            this.selectedVoice = this.voices[parseInt(selectedIndex)];
            console.log('Selected voice:', this.selectedVoice.name);
        }
    }
    
    handleSpeakClick() {
        this.speakButton.disabled = true;
        this.speakButton.textContent = 'Processing...';
        this.transcriptionDiv.textContent = 'Getting ready...';
        
        // Step 1: Speak the prompt
        this.speak('Speak after the tone')
            .then(() => {
                // Step 2: Play beep sound
                return this.playBeep();
            })
            .then(() => {
                // Step 3: Start listening
                this.startListening();
            })
            .catch((error) => {
                console.error('Error in speech process:', error);
                this.transcriptionDiv.textContent = 'Error occurred. Please try again.';
                this.speakButton.disabled = false;
                this.speakButton.textContent = 'Click to speak';
            });
    }
    
    speak(text) {
        return new Promise((resolve, reject) => {
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            // Use selected voice if available
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            
            utterance.onend = () => {
                console.log('Finished speaking');
                resolve();
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                reject(event);
            };
            
            this.synthesis.speak(utterance);
        });
    }
    
    playBeep() {
        return new Promise((resolve) => {
            // Create a beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz tone
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            
            oscillator.onended = () => {
                console.log('Beep finished');
                resolve();
            };
        });
    }
    
    startListening() {
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.transcriptionDiv.textContent = 'Error starting speech recognition. Please try again.';
            this.speakButton.disabled = false;
            this.speakButton.textContent = 'Click to speak';
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeechApp();
});