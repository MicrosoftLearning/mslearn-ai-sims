// Toggle sample data section
const toggleBtn = document.getElementById('toggle-sample-data');
const sampleDataSection = document.getElementById('sample-data');
if (toggleBtn && sampleDataSection) {
    toggleBtn.addEventListener('click', () => {
        if (sampleDataSection.style.display === 'none') {
            sampleDataSection.style.display = 'block';
            toggleBtn.textContent = 'Hide sample data';
        } else {
            sampleDataSection.style.display = 'none';
            toggleBtn.textContent = 'Show sample data';
        }
    });
}
// Seed Identifier App
const seedLength = document.getElementById('seed-length');
const seedWidth = document.getElementById('seed-width');
const grooveLength = document.getElementById('groove-length');
const seedLengthValue = document.getElementById('seed-length-value');
const seedWidthValue = document.getElementById('seed-width-value');
const grooveLengthValue = document.getElementById('groove-length-value');
const predictBtn = document.getElementById('predict-btn');
const outputPanel = document.getElementById('output-panel');

seedLength.addEventListener('input', () => {
    seedLengthValue.textContent = seedLength.value;
});
seedWidth.addEventListener('input', () => {
    seedWidthValue.textContent = seedWidth.value;
});
grooveLength.addEventListener('input', () => {
    grooveLengthValue.textContent = grooveLength.value;
});

predictBtn.addEventListener('click', () => {
    const length = parseFloat(seedLength.value);
    const width = parseFloat(seedWidth.value);
    const groove = parseFloat(grooveLength.value);
    if (length <= groove) {
        outputPanel.innerHTML = `<p style='color:#d32f2f;font-weight:bold;'>Please check your measurements: Seed length must be greater than groove length.</p>`;
        return;
    }
    let className = '';
    let imageFile = '';
    if (groove > 5.5) {
        className = 'Rosa Wheat';
        imageFile = 'rosa-wheat.png';
    } else if (width < 3.1) {
        className = 'Canadian Wheat';
        imageFile = 'canadian-wheat.png';
    } else {
        className = 'Kama Wheat';
        imageFile = 'kama-wheat.png';
    }
    outputPanel.innerHTML = `
        <h2>${className}</h2>
        <img src="images/${imageFile}" alt="${className}" class="result-image">
        <p class="disclaimer">AI generated content can include mistakes</p>
    `;
});
