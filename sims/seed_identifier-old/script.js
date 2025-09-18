// Simple robust script to support the Seed Identifier UI

// Toggle sample data section
var toggleBtn = document.getElementById('toggle-sample-data');
var sampleDataSection = document.getElementById('sample-data');
if (toggleBtn && sampleDataSection) {
    toggleBtn.addEventListener('click', function () {
        if (sampleDataSection.style.display === 'none') {
            sampleDataSection.style.display = 'block';
            toggleBtn.textContent = 'Hide sample data';
        } else {
            sampleDataSection.style.display = 'none';
            toggleBtn.textContent = 'Show sample data';
        }
    });
}

// Seed Identifier App elements
var seedLength = document.getElementById('seed-length');
var seedWidth = document.getElementById('seed-width');
var grooveLength = document.getElementById('groove-length');
var seedLengthValue = document.getElementById('seed-length-value');
var seedWidthValue = document.getElementById('seed-width-value');
var grooveLengthValue = document.getElementById('groove-length-value');
var predictBtn = document.getElementById('predict-btn');
var outputPanel = document.getElementById('output-panel');

if (seedLength && seedLengthValue) {
    seedLength.addEventListener('input', function () {
        seedLengthValue.textContent = seedLength.value;
    });
}
if (seedWidth && seedWidthValue) {
    seedWidth.addEventListener('input', function () {
        seedWidthValue.textContent = seedWidth.value;
    });
}
if (grooveLength && grooveLengthValue) {
    grooveLength.addEventListener('input', function () {
        grooveLengthValue.textContent = grooveLength.value;
    });
}

if (predictBtn) {
    predictBtn.addEventListener('click', function () {
        var length = parseFloat(seedLength.value);
        var width = parseFloat(seedWidth.value);
        var groove = parseFloat(grooveLength.value);
        if (isNaN(length) || isNaN(width) || isNaN(groove)) {
            if (outputPanel) outputPanel.innerHTML = '<p style="color:#d32f2f;font-weight:bold;">Invalid measurements</p>';
            return;
        }
        if (length <= groove) {
            if (outputPanel) outputPanel.innerHTML = '<p style="color:#d32f2f;font-weight:bold;">Please check your measurements: Seed length must be greater than groove length.</p>';
            return;
        }
        var className = '';
        var imageFile = '';
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
        if (outputPanel) {
            outputPanel.innerHTML = '<h2>' + className + '</h2>' +
                '<img src="images/' + imageFile + '" alt="' + className + '" class="result-image">' +
                '<p class="disclaimer">AI generated content can include mistakes</p>';
        }
    });
}

// Model details modal and confusion matrix (basic, robust code)
var viewModelBtn = document.getElementById('view-model-details');
var modelModal = document.getElementById('model-details-modal');
var closeModalBtn = null;
if (modelModal) closeModalBtn = modelModal.querySelector('.close-modal');
var explicitCloseBtn = document.getElementById('close-modal-btn');
var cmCanvas = document.getElementById('confusion-matrix-canvas');
var modelMetrics = document.getElementById('model-metrics');

function openModelModal() {
    if (!modelModal) return;
    modelModal.setAttribute('aria-hidden', 'false');
    drawConfusionMatrix();
}
function closeModelModal() {
    if (!modelModal) return;
    modelModal.setAttribute('aria-hidden', 'true');
}
if (viewModelBtn) viewModelBtn.addEventListener('click', openModelModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModelModal);
if (explicitCloseBtn) explicitCloseBtn.addEventListener('click', closeModelModal);
if (modelModal) {
    modelModal.addEventListener('click', function (e) {
        if (e.target === modelModal) closeModelModal();
    });
}

function drawConfusionMatrix() {
    if (!cmCanvas || !modelMetrics) return;
    var ctx = cmCanvas.getContext('2d');
    var width = cmCanvas.width;
    var height = cmCanvas.height;
    ctx.clearRect(0, 0, width, height);

    var matrix = [
        [45, 2, 1],
        [3, 50, 2],
        [1, 4, 48]
    ];
    var n = matrix.length;
    var padding = 60;
    var gridSize = Math.min((width - padding) / n, (height - padding) / n) * 0.7; // make the matrix smaller
    var startX = (width - gridSize * n) / 2 + 20; // center with slight left offset for axis labels
    var startY = (height - gridSize * n) / 2 + 10;

    var maxVal = -Infinity;
    var minVal = Infinity;
    var total = 0;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var cell = matrix[i][j];
            if (cell > maxVal) maxVal = cell;
            if (cell < minVal) minVal = cell;
            total += cell;
        }
    }

    for (var ii = 0; ii < n; ii++) {
        for (var jj = 0; jj < n; jj++) {
            var val = matrix[ii][jj];
            var intensity = Math.max(0.08, val / maxVal);
            var color;
            // Color: explicitly map min->white and max->button-blue, others interpolate
            var darkR = 0, darkG = 120, darkB = 212; // button color
            var midR = 200, midG = 200, midB = 230; // gray-blue mid tone
            if (maxVal === minVal) {
                // degenerate case: all cells equal -> use button color
                color = '#0078d4';
            } else if (val === maxVal) {
                color = '#0078d4';
            } else if (val === minVal) {
                color = '#ffffff';
            } else {
                var scaled = (val - minVal) / (maxVal - minVal); // 0..1
                // bias diagonal cells slightly toward the button color (stronger blue)
                var scaledNorm = (ii === jj) ? Math.min(1, scaled * 1.1 + 0.05) : scaled;
                // interpolate between white (255,255,255) and mid color, then slightly toward button via scaledNorm
                var rComp = Math.round(255 * (1 - scaledNorm) + midR * scaledNorm);
                var gComp = Math.round(255 * (1 - scaledNorm) + midG * scaledNorm);
                var bComp = Math.round(255 * (1 - scaledNorm) + midB * scaledNorm);
                color = 'rgb(' + rComp + ', ' + gComp + ', ' + bComp + ')';
            }
            var x = startX + jj * gridSize;
            var y = startY + ii * gridSize;
            // If this is a max-value cell we want it to fill the full cell (no white gap)
            if (val === maxVal) {
                ctx.fillStyle = '#0078d4';
                ctx.fillRect(x, y, gridSize, gridSize);
                // draw a single-pixel stroke to ensure crisp edges matching the button color
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#0078d4';
                ctx.strokeRect(x + 0.5, y + 0.5, gridSize - 1, gridSize - 1);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, gridSize - 4, gridSize - 4);
            }

            // text — use black for improved readability per request
            ctx.fillStyle = '#000';
            // larger font for cell values for readability
            ctx.font = Math.max(14, Math.floor(gridSize / 2.2)) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var textX = x + (val === maxVal ? gridSize / 2 : (gridSize - 4) / 2);
            var textY = y + (val === maxVal ? gridSize / 2 : (gridSize - 4) / 2);
            ctx.fillText(String(val), textX, textY);
        }
    }

    // Labels: class numbers on top (predicted) and left (actual)
    ctx.fillStyle = '#222';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    // Predicted class numbers (top)
    for (var p = 0; p < n; p++) {
        var x2 = startX + p * gridSize + (gridSize - 4) / 2;
        ctx.fillText(String(p), x2, startY - 24);
    }
    // Axis title for Predicted
    ctx.font = '20px Arial';
    ctx.fillText('Predicted', startX + (gridSize * n) / 2, startY - 48);

    // Actual class numbers (left)
    ctx.textAlign = 'right';
    ctx.font = '18px Arial';
    for (var q = 0; q < n; q++) {
        var y2 = startY + q * gridSize + (gridSize - 4) / 2;
        ctx.fillText(String(q), startX - 28, y2);
    }
    // Axis title for Actual: rotated bottom-to-top
    ctx.save();
    ctx.font = '20px Arial';
    ctx.fillStyle = '#222';
    // position to left-center of the grid
    ctx.translate(startX - 70, startY + (gridSize * n) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Actual', 0, 0);
    ctx.restore();

    var correct = 0;
    var rowSums = [];
    var colSums = [];
    for (var m = 0; m < n; m++) { rowSums[m] = 0; colSums[m] = 0; }
    for (var aa = 0; aa < n; aa++) {
        for (var bb = 0; bb < n; bb++) {
            rowSums[aa] += matrix[aa][bb];
            colSums[bb] += matrix[aa][bb];
            if (aa === bb) correct += matrix[aa][bb];
        }
    }
    var accuracy = (correct / total) * 100;
    var metricsHtml = '<p><strong>Overall accuracy:</strong> ' + accuracy.toFixed(1) + '%</p>';
    metricsHtml += '<ul style="text-align:left; padding-left:18px; margin:6px 0;">';
    for (var kk = 0; kk < n; kk++) {
        var tp = matrix[kk][kk];
        var precision = colSums[kk] > 0 ? (tp / colSums[kk]) * 100 : 0;
        var recall = rowSums[kk] > 0 ? (tp / rowSums[kk]) * 100 : 0;
        var f1 = (precision + recall) === 0 ? 0 : (2 * precision * recall) / (precision + recall);
        metricsHtml += '<li><strong>Class ' + kk + ':</strong> Precision ' + precision.toFixed(1) + '%, Recall ' + recall.toFixed(1) + '%, F1 ' + f1.toFixed(1) + '%</li>';
    }
    metricsHtml += '</ul>';
    modelMetrics.innerHTML = metricsHtml;
}

if (modelModal) modelModal.setAttribute('aria-hidden', 'true');
