// Cell counter for unique IDs
let cellCounter = 0;
let uploadedFileContent = null;
let uploadedFileName = null;
let pyScriptReady = false;

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
    document.getElementById('addCellBtn').addEventListener('click', addCell);
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    document.getElementById('saveBtn').addEventListener('click', saveNotebook);
    document.getElementById('loadFile').addEventListener('change', loadNotebook);
    
    const closeBtn = document.getElementById('terminalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTerminal);
        console.log('Terminal close button listener attached');
    } else {
        console.error('Terminal close button not found!');
    }
    
    // Monitor for terminal appearance
    monitorTerminal();
    
    // Make closeTerminal available globally for onclick
    window.closeTerminal = closeTerminal;
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
            <button class="btn-toggle" onclick="toggleCodePane('${cellId}')" aria-label="Toggle code visibility">👁</button>
            <button class="btn-delete" onclick="deleteCell('${cellId}')" aria-label="Delete this cell">✖</button>
        </div>
        <textarea class="cell-input" placeholder="Enter Python code or Markdown..." aria-label="Cell input code or text"># Write your code here</textarea>
        <div class="cell-output" role="region" aria-label="Cell output" aria-live="polite"></div>
    `;
    
    notebook.appendChild(cellDiv);
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
        cell.remove();
    }
}

// Run a specific cell
async function runCell(cellId) {
    const cell = document.getElementById(cellId);
    const input = cell.querySelector('.cell-input');
    const output = cell.querySelector('.cell-output');
    const cellType = cell.querySelector('.cell-type-selector').value;
    const code = input.value;
    
    // Clear previous output
    output.innerHTML = '';
    output.className = 'cell-output';
    
    if (!code.trim()) {
        return;
    }
    
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
            await runPythonCode(code, output);
            // Ensure Python cells stay expanded
            input.classList.remove('collapsed');
        }
    } catch (error) {
        output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Run Python code using PyScript
async function runPythonCode(code, outputElement) {
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
        scriptTag.innerHTML = `
import sys
from io import StringIO
import js

output_id = "${outputId}"
old_stdout = sys.stdout
sys.stdout = StringIO()

output_text = ""
figures = []
error_msg = None

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
    
    output_text = sys.stdout.getvalue()
    
    try:
        import matplotlib.pyplot as plt
        import base64
        from io import BytesIO
        
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

html_output = ""
if error_msg:
    import html
    html_output = f'<div class="error">{html.escape(error_msg)}</div>'
else:
    if output_text:
        import html
        html_output += f'<pre class="text-output">{html.escape(output_text)}</pre>'
    
    for img_data in figures:
        html_output += f'<img src="data:image/png;base64,{img_data}" class="plot-output" alt="Plot">'
    
    if not html_output:
        html_output = '<div class="no-output">Code executed successfully (no output)</div>'

element = js.document.getElementById(output_id)
if element:
    element.innerHTML = html_output
`;
        
        document.body.appendChild(scriptTag);
        
        // Clean up after a delay
        setTimeout(() => {
            if (scriptTag.parentNode) {
                scriptTag.parentNode.removeChild(scriptTag);
            }
        }, 1000);
        
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

// Close the terminal
function closeTerminal() {
    console.log('Closing terminal...');
    
    let totalFound = 0;
    
    // Method 1: Try specific selectors
    const selectors = [
        'py-terminal',
        'py-repl', 
        '.py-terminal',
        '.py-repl',
        '[data-pyscript-terminal]',
        '#pyscript-terminal'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        totalFound += elements.length;
        
        elements.forEach(terminal => {
            hideElement(terminal);
        });
    });
    
    // Method 2: Find ANY element at bottom of page
    const allElements = Array.from(document.body.querySelectorAll('*'));
    
    allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // Check if element is near the bottom of viewport
        if (rect.bottom > window.innerHeight - 100 && rect.top > window.innerHeight - 400) {
            // If it's not our close button and has substantial content
            if (el.id !== 'terminalCloseBtn' && 
                !el.classList.contains('terminal-close-btn') &&
                rect.height > 30) {
                hideElement(el);
                totalFound++;
            }
        }
    });
    
    // Hide the close button too
    document.getElementById('terminalCloseBtn').classList.remove('visible');
    
    console.log('Terminal closed. Found and hid', totalFound, 'element(s)');
}

// Helper function to hide an element
function hideElement(el) {
    el.style.setProperty('display', 'none', 'important');
    el.style.setProperty('visibility', 'hidden', 'important');
    el.style.setProperty('height', '0', 'important');
    el.style.setProperty('max-height', '0', 'important');
    el.style.setProperty('overflow', 'hidden', 'important');
    el.style.setProperty('opacity', '0', 'important');
    el.style.setProperty('position', 'absolute', 'important');
    el.style.setProperty('bottom', '-9999px', 'important');
}

// Monitor for terminal to show/hide close button
function monitorTerminal() {
    setInterval(() => {
        // Look for elements at the bottom that might be terminals
        const allElements = Array.from(document.body.querySelectorAll('*'));
        let hasTerminal = false;
        
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);
            
            // Check if element is at the bottom of the viewport
            // and is actually visible
            if (rect.bottom > window.innerHeight - 50 && 
                rect.height > 80 &&
                rect.width > 200 &&
                styles.display !== 'none' &&
                styles.visibility !== 'hidden' &&
                el.id !== 'terminalCloseBtn' &&
                !el.classList.contains('terminal-close-btn')) {
                
                const text = el.textContent || '';
                
                // Exclude elements that are clearly part of the notebook UI
                const isNotebookElement = el.closest('.cell') || 
                                         el.closest('.toolbar') || 
                                         el.id === 'addCellBtn' ||
                                         el.classList.contains('btn-add');
                
                // Check if it looks like an error terminal
                // Must have error keywords OR be positioned at very bottom with substantial content
                if (!isNotebookElement && 
                    ((text.includes('Traceback') || text.includes('Error:') || text.includes('Exception')) ||
                    (rect.top > window.innerHeight - 250 && text.length > 100))) {
                    hasTerminal = true;
                }
            }
        });
        
        const closeBtn = document.getElementById('terminalCloseBtn');
        if (closeBtn) {
            if (hasTerminal) {
                closeBtn.classList.add('visible');
            } else {
                closeBtn.classList.remove('visible');
            }
        }
    }, 300);
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
