// Cell counter for unique IDs
let cellCounter = 0;
let uploadedFileContent = null;
let uploadedFileName = null;
let pyScriptReady = false;

// Track running cells and their script tags
const runningCells = new Map();

// Wait for PyScript to be ready
window.addEventListener('py:ready', () => {
    pyScriptReady = true;
    console.log('PyScript is ready');
});

// Initialize the notebook with one cell
document.addEventListener('DOMContentLoaded', () => {
    addCell();
    
    // Event listeners for toolbar buttons
    document.getElementById('runAllBtn').addEventListener('click', runAllCells);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllCells);
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    document.getElementById('saveBtn').addEventListener('click', saveNotebook);
    document.getElementById('loadFile').addEventListener('change', loadNotebook);
});

// Add a new cell to the notebook
function addCell() {
    const cellId = `cell-${cellCounter++}`;
    const notebook = document.getElementById('notebook');
    
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.id = cellId;
    cellDiv.setAttribute('role', 'article');
    cellDiv.setAttribute('aria-label', `Notebook cell ${cellCounter}`);
    
    cellDiv.innerHTML = `
        <div class="cell-header" role="toolbar" aria-label="Cell controls">
            <select class="cell-type-selector" aria-label="Select cell type">
                <option value="python">Python</option>
                <option value="markdown">Markdown</option>
            </select>
            <button class="btn-run" onclick="runCell('${cellId}')" aria-label="Run this cell">▶ Run</button>
            <button class="btn-stop" onclick="stopCell('${cellId}')" aria-label="Stop cell execution" style="display: none;">⏹ Stop</button>
            <button class="btn-toggle" onclick="toggleCodePane('${cellId}')" aria-label="Toggle code visibility">👁</button>
            <button class="btn-delete" onclick="deleteCell('${cellId}')" aria-label="Delete this cell">✖</button>
        </div>
        <textarea class="cell-input" placeholder="Enter Python code or Markdown..." aria-label="Cell input code or text"># Write your code here</textarea>
        <div class="cell-output" role="region" aria-label="Cell output" aria-live="polite"></div>
    `;
    
    // Add Tab key handler to insert 4 spaces
    const textarea = cellDiv.querySelector('.cell-input');
    textarea.addEventListener('keydown', handleTabKey);
    
    // Add hover zone before the cell
    const hoverZoneBefore = document.createElement('div');
    hoverZoneBefore.className = 'cell-hover-zone';
    hoverZoneBefore.innerHTML = '<div class="add-cell-button">+ Add Cell</div>';
    hoverZoneBefore.querySelector('.add-cell-button').onclick = () => {
        insertCellBefore(cellId);
    };
    
    notebook.appendChild(hoverZoneBefore);
    notebook.appendChild(cellDiv);
    
    // Update hover zones
    updateHoverZones();
}

// Insert a cell before a specific cell
function insertCellBefore(beforeCellId) {
    const newCellId = `cell-${cellCounter++}`;
    const notebook = document.getElementById('notebook');
    const beforeCell = document.getElementById(beforeCellId);
    
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.id = newCellId;
    cellDiv.setAttribute('role', 'article');
    cellDiv.setAttribute('aria-label', `Notebook cell ${cellCounter}`);
    
    cellDiv.innerHTML = `
        <div class="cell-header" role="toolbar" aria-label="Cell controls">
            <select class="cell-type-selector" aria-label="Select cell type">
                <option value="python">Python</option>
                <option value="markdown">Markdown</option>
            </select>
            <button class="btn-run" onclick="runCell('${newCellId}')" aria-label="Run this cell">▶ Run</button>
            <button class="btn-stop" onclick="stopCell('${newCellId}')" aria-label="Stop cell execution" style="display: none;">⏹ Stop</button>
            <button class="btn-toggle" onclick="toggleCodePane('${newCellId}')" aria-label="Toggle code visibility">👁</button>
            <button class="btn-delete" onclick="deleteCell('${newCellId}')" aria-label="Delete this cell">✖</button>
        </div>
        <textarea class="cell-input" placeholder="Enter Python code or Markdown..." aria-label="Cell input code or text"># Write your code here</textarea>
        <div class="cell-output" role="region" aria-label="Cell output" aria-live="polite"></div>
    `;
    
    // Add Tab key handler to insert 4 spaces
    const textarea = cellDiv.querySelector('.cell-input');
    textarea.addEventListener('keydown', handleTabKey);
    
    // Find the hover zone before the target cell
    const hoverZone = beforeCell.previousElementSibling;
    
    // Create hover zone for new cell
    const newHoverZone = document.createElement('div');
    newHoverZone.className = 'cell-hover-zone';
    newHoverZone.innerHTML = '<div class="add-cell-button">+ Add Cell</div>';
    newHoverZone.querySelector('.add-cell-button').onclick = () => {
        insertCellBefore(newCellId);
    };
    
    // Insert before the hover zone
    notebook.insertBefore(newHoverZone, hoverZone);
    notebook.insertBefore(cellDiv, hoverZone);
    
    updateHoverZones();
}

// Update hover zones (add one at the end)
function updateHoverZones() {
    const notebook = document.getElementById('notebook');
    
    // Remove existing end hover zone
    const existingEndZone = notebook.querySelector('.cell-hover-zone-end');
    if (existingEndZone) {
        existingEndZone.remove();
    }
    
    // Add hover zone at the end
    const hoverZoneEnd = document.createElement('div');
    hoverZoneEnd.className = 'cell-hover-zone cell-hover-zone-end';
    hoverZoneEnd.innerHTML = '<div class="add-cell-button">+ Add Cell</div>';
    hoverZoneEnd.querySelector('.add-cell-button').onclick = addCell;
    
    notebook.appendChild(hoverZoneEnd);
}

// Handle Tab key in textareas to insert 4 spaces
function handleTabKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // Insert 4 spaces at cursor position
        const spaces = '    ';
        textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
        
        // Move cursor after the inserted spaces
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
    }
}

// Stop a running cell
function stopCell(cellId) {
    const cell = document.getElementById(cellId);
    const output = cell.querySelector('.cell-output');
    const runBtn = cell.querySelector('.btn-run');
    const stopBtn = cell.querySelector('.btn-stop');
    
    // Get the running cell info
    const runningInfo = runningCells.get(cellId);
    
    if (runningInfo) {
        // Clear the timeout
        if (runningInfo.timeoutId) {
            clearTimeout(runningInfo.timeoutId);
        }
        
        // Remove the script tag to stop execution
        if (runningInfo.scriptTag && runningInfo.scriptTag.parentNode) {
            runningInfo.scriptTag.parentNode.removeChild(runningInfo.scriptTag);
        }
        
        // Update output to show it was stopped
        output.innerHTML = '<div class="error">Execution stopped by user</div>';
        
        // Clean up tracking
        runningCells.delete(cellId);
    }
    
    // Restore buttons
    runBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

// Toggle code pane visibility
function toggleCodePane(cellId) {
    const cell = document.getElementById(cellId);
    const input = cell.querySelector('.cell-input');
    input.classList.toggle('collapsed');
}

// Delete a cell
function deleteCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        // Also remove the hover zone before this cell
        const hoverZone = cell.previousElementSibling;
        if (hoverZone && hoverZone.classList.contains('cell-hover-zone')) {
            hoverZone.remove();
        }
        cell.remove();
        updateHoverZones();
    }
}

// Run a specific cell
async function runCell(cellId) {
    const cell = document.getElementById(cellId);
    const input = cell.querySelector('.cell-input');
    const output = cell.querySelector('.cell-output');
    const runBtn = cell.querySelector('.btn-run');
    const stopBtn = cell.querySelector('.btn-stop');
    const cellType = cell.querySelector('.cell-type-selector').value;
    const code = input.value;
    
    // Show stop button, hide run button IMMEDIATELY (before any async operations)
    runBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    // Force a reflow to ensure UI updates
    stopBtn.offsetHeight;
    
    // Clear previous output
    output.innerHTML = '';
    output.className = 'cell-output';
    
    if (!code.trim()) {
        // Restore buttons if no code
        runBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        return;
    }
    
    // Use setTimeout to ensure UI updates before starting execution
    await new Promise(resolve => setTimeout(resolve, 0));
    
    try {
        if (cellType === 'markdown') {
            // Render markdown (simple implementation)
            output.innerHTML = renderMarkdown(code);
            output.classList.add('markdown-output');
            // Collapse the code pane for markdown cells
            input.classList.add('collapsed');
        } else {
            // Run Python code
            output.innerHTML = '<div class="loading">Running...</div>';
            await runPythonCode(code, output, cellId);
            // Ensure Python cells stay expanded
            input.classList.remove('collapsed');
        }
    } catch (error) {
        output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
        // Restore buttons
        runBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
    }
}

// Run Python code using PyScript
async function runPythonCode(code, outputElement, cellId) {
    try {
        // Wait for PyScript to be ready
        if (!pyScriptReady) {
            outputElement.innerHTML = '<div class="loading">Waiting for PyScript to initialize...</div>';
            await waitForPyScript();
        }
        
        outputElement.innerHTML = '<div class="loading">Running...</div>';
        
        // Generate unique IDs
        const outputId = 'output-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        outputElement.id = outputId;
        
        // Store reference globally so Python can access it
        window.currentOutputElement = outputElement;
        
        // Create inline script tag
        const scriptTag = document.createElement('script');
        scriptTag.type = 'py';
        // Note: Not using worker attribute because it requires secure context (HTTPS + proper headers)
        // Without workers, Stop button works for I/O-bound code but not pure compute loops
        
        // Add error handler
        scriptTag.addEventListener('error', (e) => {
            console.error('PyScript tag error:', e);
            outputElement.innerHTML = '<div class="error">PyScript failed to execute. Check console for details.</div>';
        });
        
        scriptTag.innerHTML = `
import js
import sys
from io import StringIO
import warnings

# Suppress all warnings including matplotlib backend warnings
warnings.filterwarnings('ignore')

output_id = "${outputId}"
old_stdout = sys.stdout
old_stderr = sys.stderr
sys.stdout = StringIO()
sys.stderr = StringIO()

output_text = ""
stderr_text = ""
figures = []
error_msg = None

# User code as a string to handle syntax errors
user_code = """${code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"""

try:
    # Try to compile first to catch syntax errors
    compiled_code = compile(user_code, '<cell>', 'exec')
    # Execute the compiled code
    exec(compiled_code)
    
    output_text = sys.stdout.getvalue()
    stderr_text = sys.stderr.getvalue()
    
    # Handle matplotlib figures
    try:
        import matplotlib.pyplot as plt
        import base64
        from io import BytesIO
        
        plt.ioff()
        
        for i in plt.get_fignums():
            fig = plt.figure(i)
            buf = BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode()
            figures.append(img_str)
            plt.close(fig)
    except Exception:
        pass
    
except Exception as e:
    import traceback
    error_msg = traceback.format_exc()

finally:
    sys.stdout = old_stdout
    sys.stderr = old_stderr
    
    # Build HTML output
    html_output = ""
    if error_msg:
        import html
        html_output = f'<div class="error">{html.escape(error_msg)}</div>'
    else:
        if output_text:
            import html
            html_output += f'<pre class="text-output">{html.escape(output_text)}</pre>'
        
        if stderr_text and not error_msg:
            import html
            html_output += f'<pre class="text-output stderr">{html.escape(stderr_text)}</pre>'
        
        for img_data in figures:
            html_output += f'<img src="data:image/png;base64,{img_data}" class="plot-output" alt="Plot">'
        
        if not html_output:
            html_output = '<div class="no-output">Code executed successfully (no output)</div>'
    
    # Update the element
    element = js.document.getElementById(output_id)
    if element:
        element.innerHTML = html_output
        js.console.log(f"Updated element {output_id}")
    else:
        js.console.error(f"Could not find element {output_id}")
`;
        
        console.log(`Appended PyScript tag for cell ${outputId}`);
        document.body.appendChild(scriptTag);
        
        // Track this running cell
        runningCells.set(cellId, { scriptTag, outputId });
        
        // Add a timeout to check if output was updated (in case of error)
        const timeoutId = setTimeout(() => {
            const elem = document.getElementById(outputId);
            if (elem && elem.innerHTML.includes('Running...')) {
                // Output wasn't updated, likely due to an error
                console.error('Cell output still shows "Running..." after 5 seconds. PyScript may have failed silently.');
                elem.innerHTML = '<div class="error">An error occurred during execution. The Python code did not complete. Check the browser console for details.</div>';
                // Clean up tracking
                runningCells.delete(cellId);
            }
        }, 5000);  // Increased to 5 seconds
        
        // Store timeout ID so we can cancel it if stopped manually
        runningCells.get(cellId).timeoutId = timeoutId;
        
        // Clean up after a delay
        setTimeout(() => {
            if (scriptTag.parentNode) {
                scriptTag.parentNode.removeChild(scriptTag);
            }
            // Clean up tracking
            runningCells.delete(cellId);
        }, 6000);
        
    } catch (error) {
        console.error('Execution error:', error);
        outputElement.innerHTML = `<div class="error">Error: ${escapeHtml(error.toString())}</div>`;
    }
}

// Wait for PyScript to be ready
function waitForPyScript() {
    return new Promise((resolve) => {
        if (pyScriptReady) {
            resolve();
        } else {
            window.addEventListener('py:ready', () => resolve(), { once: true });
        }
    });
}

// Run all cells in order
async function runAllCells() {
    const cells = document.querySelectorAll('.cell');
    for (const cell of cells) {
        await runCell(cell.id);
        // Small delay to ensure sequential execution
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Clear all cells
function clearAllCells() {
    const notebook = document.getElementById('notebook');
    notebook.innerHTML = '';
    cellCounter = 0;
    addCell();
    uploadedFileContent = null;
    uploadedFileName = null;
    document.getElementById('uploadedFileName').textContent = '';
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    uploadedFileName = file.name;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        uploadedFileContent = e.target.result;
        document.getElementById('uploadedFileName').textContent = `Uploaded: ${uploadedFileName}`;
        
        // Store file in PyScript environment
        const scriptElement = document.createElement('script');
        scriptElement.type = 'py';
        scriptElement.textContent = `
with open("${uploadedFileName}", 'w') as f:
    f.write("""${uploadedFileContent.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
import js
js.console.log("File uploaded: ${uploadedFileName}")
        `;
        document.body.appendChild(scriptElement);
        
        setTimeout(() => {
            scriptElement.remove();
        }, 100);
    };
    
    reader.readAsText(file);
}

// Simple markdown renderer
function renderMarkdown(text) {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    return html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save notebook to .pysb file
function saveNotebook() {
    const cells = document.querySelectorAll('.cell');
    const notebookData = {
        version: '1.0',
        cells: []
    };
    
    cells.forEach(cell => {
        const cellType = cell.querySelector('.cell-type-selector').value;
        const cellContent = cell.querySelector('.cell-input').value;
        
        notebookData.cells.push({
            type: cellType,
            content: cellContent
        });
    });
    
    // Convert to JSON
    const json = JSON.stringify(notebookData, null, 2);
    
    // Create blob and download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notebook.pysb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Notebook saved successfully');
}

// Load notebook from .pysb file
function loadNotebook(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const notebookData = JSON.parse(e.target.result);
            
            // Clear existing cells
            const notebook = document.getElementById('notebook');
            notebook.innerHTML = '';
            cellCounter = 0;
            
            // Load cells from file
            if (notebookData.cells && notebookData.cells.length > 0) {
                notebookData.cells.forEach(cellData => {
                    addCell();
                    
                    // Get the newly added cell
                    const cells = document.querySelectorAll('.cell');
                    const cell = cells[cells.length - 1];
                    
                    // Set cell type
                    const typeSelector = cell.querySelector('.cell-type-selector');
                    typeSelector.value = cellData.type || 'python';
                    
                    // Set cell content
                    const input = cell.querySelector('.cell-input');
                    input.value = cellData.content || '';
                });
            } else {
                // If no cells in file, add one empty cell
                addCell();
            }
            
            console.log('Notebook loaded successfully');
        } catch (error) {
            alert('Error loading notebook: ' + error.message);
            console.error('Error loading notebook:', error);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}
