// Simulated .wav files in the stories folder
const storyFiles = [
    {
        name: 'story-1.wav',
        transcript: "I was in Tokyo when the earthquake struck in 2011. I remember how the ground shook violently, and buildings swayed like trees in the wind. We spent the night in a shelter, unsure of what tomorrow would bring.",
        entities: "Tokyo, earthquake, 2011, buildings, night, shelter, tomorrow",
        sentiment: "Negative",
        language: "English"
    },
    {
        name: 'story-2.wav',
        transcript: "When the Apollo 11 landing was broadcast, my mother sat with her father in their living room in São Paulo. They watched in awe as Neil Armstrong stepped onto the Moon. She said it was a moment of wonder and possibility.",
        entities: "Apollo 11 landing, mother, Neil Armstrong, Moon, father, São Paulo, living room",
        sentiment: "Neutral",
        language: "English"
    },
    {
        name: 'story-3.wav',
        transcript: "During the famine in Gujarat, my family survived on rice and water for weeks. My father traded his watch for a sack of grain. We were hungry, but together.",
        entities: "famine, Gujarat, rice, weeks, father, watch",
        sentiment: "Negative",
        language: "English"
    },
    {
        name: 'story-4.wav',
        transcript: "Estaba en la Ciudad de México en 1968, viendo a Bob Beamon romper el récord mundial de salto de longitud. El estadio estalló, se sintió como si hubiéramos presenciado algo sobrehumano. Nunca olvidaré ese salto.",
        translation: "I was in Mexico City in 1968, watching Bob Beamon break the long jump world record. The stadium erupted—it felt like we had witnessed something superhuman. I’ll never forget that leap.",
        entities: "Mexico City, 1968, Bob Beamon, stadium, leap",
        sentiment: "Mixed",
        language: "Spanish"
    }
];

const uploadBtn = document.getElementById('uploadBtn');
const fileDialog = document.getElementById('fileDialog');
const audioContainer = document.getElementById('audioContainer');
const audioPlayer = document.getElementById('audioPlayer');
const analyzingDiv = document.getElementById('analyzing');
const infoTable = document.getElementById('infoTable');

uploadBtn.onclick = function() {
    // Modal dialog with blue title bar, file icons, sizes, open/cancel buttons
    const fileSizes = ["1.2 MB", "2.0 MB", "1.5 MB", "1.8 MB"];
    fileDialog.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="dialog-box modal windows-dialog">
            <div class="dialog-header blue-bar" style="background:#1976d2;color:#fff;padding:6px 12px;border-top-left-radius:8px;border-top-right-radius:8px;display:flex;align-items:center;">
                <span class="folder-icon" style="font-size:20px;margin-right:8px;">📁</span>
                <span class="dialog-title" style="font-weight:bold;">Open</span>
            </div>
            <div class="dialog-toolbar">
            </div>
            <div class="dialog-body">
                <ul class="dialog-list">
                    ${storyFiles.map((file, idx) => `
                        <li class="dialog-list-item" data-idx="${idx}" style="cursor:pointer;">
                            <span class="file-icon">${getFileIcon(file.name)}</span>
                            <span class="file-label">
                                ${file.name}
                                <span class="file-size">${fileSizes[idx] || "1.0 MB"}</span>
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="dialog-fields">
                <label for="dialogFileName" class="field-label">File name:</label>
                <input id="dialogFileName" class="field-input" type="text" readonly>
            </div>
            <div class="dialog-footer">
                <button id="dialogOpenBtn" class="dialog-action" disabled>Open</button>
                <button id="dialogCancelBtn" class="dialog-action">Cancel</button>
            </div>
        </div>
    `;
    fileDialog.style.display = 'block';
    // Modal overlay disables background
    fileDialog.querySelector('.modal-overlay').onclick = function(e) { e.stopPropagation(); };
    // Cancel button functionality
    const cancelBtn = document.getElementById('dialogCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hideDialog;
    function hideDialog() { fileDialog.style.display = 'none'; }
    // File selection logic
    let selectedIdx = null;
    const fileItems = fileDialog.querySelectorAll('.dialog-list-item');
    const fileNameInput = document.getElementById('dialogFileName');
    const openBtn = document.getElementById('dialogOpenBtn');
    fileItems.forEach(item => {
        item.onclick = function() {
            fileItems.forEach(i => i.style.background = '');
            item.style.background = '#e3f2fd';
            selectedIdx = item.getAttribute('data-idx');
            fileNameInput.value = storyFiles[selectedIdx].name;
            openBtn.disabled = false;
        };
    });
    // Open button functionality
    if (openBtn) {
        openBtn.onclick = function() {
            if (selectedIdx !== null) {
                const file = storyFiles[selectedIdx];
                audioPlayer.src = `stories/${file.name}`;
                audioContainer.style.display = 'block';
                fileDialog.style.display = 'none';
                infoTable.style.display = 'none';
                analyzingDiv.style.display = 'block';
                setTimeout(() => {
                    analyzingDiv.style.display = 'none';
                    showInfoTable(file);
                }, 3000);
            }
        };
    }
    // Helper for file icon
    function getFileIcon(name) {
        if (name.endsWith('.wav')) return '🎵';
        return '📄';
    }
};

fileDialog.onclick = function(e) {
    if (e.target.classList.contains('file-select-btn')) {
        const idx = e.target.getAttribute('data-idx');
        const file = storyFiles[idx];
        // Display audio player
    audioPlayer.src = `stories/${file.name}`;
    audioContainer.style.display = 'block';
    audioContainer.style.position = 'fixed';
    audioContainer.style.top = '50%';
    audioContainer.style.left = '50%';
    audioContainer.style.transform = 'translate(-50%, -50%)';
    audioContainer.style.zIndex = '1000';
        fileDialog.style.display = 'none';
        infoTable.style.display = 'none';
        analyzingDiv.style.display = 'block';
        // Show analyzing for 3 seconds
        setTimeout(() => {
            analyzingDiv.style.display = 'none';
            showInfoTable(file);
        }, 3000);
    }
};

function showInfoTable(file) {
    let tableHtml = `<table class="info-table">
        <tr><th>Selected file</th><td>${file.name}</td></tr>
        <tr><th>Transcript</th><td id="typedTranscript"></td></tr>
        <tr><th>Language</th><td>${file.language || 'Unknown'}</td></tr>`;
        // Show transcript and language first
        infoTable.innerHTML = `<table class="info-table">
            <tr><th>Transcript</th><td id="typedTranscript"></td></tr>
            <tr><th>Language</th><td>${file.language || 'Unknown'}</td></tr>
        </table>`;
        infoTable.style.display = 'block';
        typeTranscript(file.transcript, () => {
            // After typing, show the rest of the table
            let sentimentEmoji = '';
            switch ((file.sentiment || '').toLowerCase()) {
                case 'positive': sentimentEmoji = '😊'; break;
                case 'negative': sentimentEmoji = '😞'; break;
                case 'neutral': sentimentEmoji = '😐'; break;
                case 'mixed': sentimentEmoji = '😶‍🌫️'; break;
                default: sentimentEmoji = '';
            }
            let transcriptHtml = file.transcript;
            let translationHtml = file.translation;
            if (file.entities) {
                const entities = file.entities.split(',').map(e => e.trim()).filter(e => e);
                if ((file.language || '').toLowerCase() === 'english') {
                    entities.forEach(entity => {
                        const re = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                        transcriptHtml = transcriptHtml.replace(re, '<span style="text-decoration:underline; text-decoration-color:#007bff;">$&</span>');
                    });
                } else if (file.translation) {
                    entities.forEach(entity => {
                        const re = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                        translationHtml = translationHtml.replace(re, '<span style="text-decoration:underline; text-decoration-color:#007bff;">$&</span>');
                    });
                }
            }
            let tableHtml = `<table class="info-table">
                <tr><th>Selected file</th><td>${file.name}</td></tr>
                <tr><th>Transcript</th><td id="typedTranscript">${transcriptHtml}</td></tr>
                <tr><th>Language</th><td>${file.language || 'Unknown'}</td></tr>`;
            if (file.language && file.language.toLowerCase() !== 'english' && file.translation) {
                tableHtml += `<tr><th>Translation</th><td>${translationHtml}</td></tr>`;
            }
            tableHtml += `<tr><th>Named Entities</th><td>${file.entities}</td></tr>
                <tr><th>Sentiment</th><td>${file.sentiment} ${sentimentEmoji}</td></tr>
            </table>`;
            infoTable.innerHTML = tableHtml;
        });
}

function typeTranscript(text) {
    const transcriptTd = document.getElementById('typedTranscript');
    transcriptTd.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            transcriptTd.textContent += text[i];
            i++;
            setTimeout(type, 30);
        }
    }
    type();
}
    function typeTranscript(text, callback) {
        const transcriptTd = document.getElementById('typedTranscript');
        transcriptTd.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                transcriptTd.textContent += text[i];
                i++;
                setTimeout(type, 30);
            } else if (typeof callback === 'function') {
                callback();
            }
        }
        type();
    }
