// Global variables - Updated: 2025-10-16 15:40:00 - Fixed PyScript to use proper training with ALL metrics
let currentStep = 1;
let maxSteps = 5;
let uploadedFiles = [];
let currentJobData = {};
let trainedModels = {};
let deployedModels = {};
let currentData = null;
let currentTarget = null;
let selectedModel = null;

// Job management
let jobHistory = [];
let jobCounter = 1;

// Workspace management
let existingWorkspaceNames = [];

// PyScript status (keeping for future use)
let pyScriptReady = false;

// Utility functions
function getMetricDisplayName(metric, taskType) {
    const metricNames = {
        // Classification metrics
        'auc': 'AUC',
        'accuracy': 'Accuracy',
        'precision': 'Precision',
        'recall': 'Recall',
        'f1': 'F1 Score',
        // Regression metrics
        'mae': 'Mean Absolute Error',
        'rmse': 'Root Mean Squared Error',
        'r2': 'R² Score'
    };
    
    // Return the display name if found, otherwise use the original value or fallback
    return metricNames[metric] || metric || (taskType === 'classification' ? 'AUC' : 'Mean Absolute Error');
}

// Start PyScript initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Disable the new job button initially
    disableNewJobButton();
    // Update initial status with specific message
    updatePyScriptStatus('Loading PyScript ML libraries (pandas, numpy, scikit-learn)...', false);
    
    // Check for PyScript readiness periodically
    checkPyScriptStatus();
});

function checkPyScriptStatus(attempts = 0) {
    const maxAttempts = 120; // 60 seconds total (500ms * 120)
    
    // Check if PyScript has set the global flag
    if (window.pyScriptReady) {
        notifyPyScriptReady();
        return;
    }
    
    // Check for timeout
    if (attempts >= maxAttempts) {
        console.error('PyScript loading timeout - ML training not available');
        updatePyScriptStatus('✗ ML libraries failed to load - Please refresh the page', false);
        // Keep button disabled - no fallback mode
        return;
    }
    
    // Try again in 500ms
    setTimeout(() => checkPyScriptStatus(attempts + 1), 500);
}

// Data management
let uploadedDataFiles = [];

// Header mode preference (true = use first row as headers, false = use custom headers)
let useFirstRowAsHeaders = true;

// Track if current dataset is saved
let isDataSaved = false;

// Sidebar management
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Page Navigation
function showMyAccountPage() {
    // Hide all pages and show ML App page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('my-account-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showMyAccountPage()"]').classList.add('active');
}

function createWorkspace() {
    // Show the create workspace flyout panel
    document.getElementById('create-workspace-flyout').classList.add('active');
    
    // Set up input validation for the Create button
    const nameInput = document.getElementById('workspace-name');
    const createButton = document.querySelector('.flyout-actions .btn-primary');
    
    // Initially disable the Create button
    createButton.disabled = true;
    createButton.classList.add('disabled');
    
    // Add input listener to enable/disable Create button
    const validateInput = () => {
        const workspaceName = nameInput.value.trim();
        const errorDiv = document.getElementById('workspace-name-error');
        
        // Clear previous error
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        
        if (!workspaceName) {
            // Empty name
            createButton.disabled = true;
            createButton.classList.add('disabled');
        } else if (existingWorkspaceNames.includes(workspaceName)) {
            // Duplicate name
            errorDiv.textContent = 'A workspace with this name already exists';
            errorDiv.style.display = 'block';
            createButton.disabled = true;
            createButton.classList.add('disabled');
        } else {
            // Valid name
            createButton.disabled = false;
            createButton.classList.remove('disabled');
        }
    };
    
    // Remove existing listeners to avoid duplicates
    nameInput.removeEventListener('input', validateInput);
    nameInput.addEventListener('input', validateInput);
    
    // Initial validation
    validateInput();
    
    // Focus the name input after a short delay to ensure the flyout is visible
    setTimeout(() => {
        nameInput.focus();
    }, 100);
}

function closeCreateWorkspaceFlyout() {
    // Hide the create workspace flyout panel
    document.getElementById('create-workspace-flyout').classList.remove('active');
    
    // Reset the form
    document.getElementById('workspace-name').value = '';
    document.getElementById('resource-group').value = 'ResourceGroup1';
    
    // Clear error message
    const errorDiv = document.getElementById('workspace-name-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
    
    // Re-disable the Create button
    const createButton = document.querySelector('.flyout-actions .btn-primary');
    createButton.disabled = true;
    createButton.classList.add('disabled');
}

function createNewWorkspace() {
    // Get the form values
    const workspaceName = document.getElementById('workspace-name').value;
    const resourceGroup = document.getElementById('resource-group').value;
    
    // Basic validation (should not be needed due to button being disabled)
    if (!workspaceName.trim()) {
        return;
    }
    
    // Check for duplicate names (extra safety check)
    if (existingWorkspaceNames.includes(workspaceName)) {
        console.error('Attempted to create workspace with duplicate name:', workspaceName);
        return;
    }
    
    // Add to existing workspace names list
    existingWorkspaceNames.push(workspaceName);
    
    // Simulate workspace creation
    console.log('Creating workspace:', { name: workspaceName, resourceGroup: resourceGroup });
    
    // Create workspace button in the workspaces list
    addWorkspaceButton(workspaceName);
    
    // Close the flyout
    closeCreateWorkspaceFlyout();
    
    // Clear the form for next use
    document.getElementById('workspace-name').value = '';
    document.getElementById('resource-group').value = 'ResourceGroup1';
    
    // Stay on the ML App page (no navigation needed)
}

function addWorkspaceButton(workspaceName) {
    // Get the workspaces list container
    const workspacesList = document.getElementById('workspaces-list');
    
    // Create the workspace button
    const workspaceButton = document.createElement('button');
    workspaceButton.className = 'workspace-button';
    workspaceButton.textContent = workspaceName;
    workspaceButton.onclick = function() {
        // Show full navigation and rename ML App when workspace is clicked
        showFullNavigationAndRename();
        
        // Set the current workspace and navigate to Home page
        setCurrentWorkspace(workspaceName);
        showHomePage();
    };
    
    // Add the button to the workspaces list
    workspacesList.appendChild(workspaceButton);
    
    // Note: Navigation changes happen only when user clicks the workspace button, not when it's created
}

function setCurrentWorkspace(workspaceName) {
    // Store the current workspace name
    window.currentWorkspaceName = workspaceName;
    
    // Update the workspace title on the Home page
    const workspaceTitle = document.getElementById('workspace-title');
    if (workspaceTitle) {
        workspaceTitle.textContent = workspaceName;
    }
}

// Simple navigation management
function initializeNavigation() {
    // Hide all navigation sections except ML App
    hideAllNavigationExceptMLApp();
}



function hideAllNavigationExceptMLApp() {
    // Hide Home section
    const homeSection = document.getElementById('home-nav-section');
    if (homeSection) {
        homeSection.style.display = 'none';
    }
    
    // Hide Authoring section
    const authoringSections = document.querySelectorAll('.nav-section');
    authoringSections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading && heading.textContent === 'Authoring') {
            section.style.display = 'none';
        }
    });
    
    // Hide Assets section
    const assetsSections = document.querySelectorAll('.nav-section');
    assetsSections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading && heading.textContent === 'Assets') {
            section.style.display = 'none';
        }
    });
}

function showFullNavigationAndRename() {
    // Rename ML App to All Workspaces
    const mlAppNavText = document.querySelector('.nav-item[onclick="showMyAccountPage()"] .nav-text');
    if (mlAppNavText) {
        mlAppNavText.textContent = 'All Workspaces';
    }
    
    // Show Home section
    const homeSection = document.getElementById('home-nav-section');
    if (homeSection) {
        homeSection.style.display = 'block';
    }
    
    // Show Authoring section
    const authoringSections = document.querySelectorAll('.nav-section');
    authoringSections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading && heading.textContent === 'Authoring') {
            section.style.display = 'block';
        }
    });
    
    // Show Assets section
    const assetsSections = document.querySelectorAll('.nav-section');
    assetsSections.forEach(section => {
        const heading = section.querySelector('h3');
        if (heading && heading.textContent === 'Assets') {
            section.style.display = 'block';
        }
    });
}

function showHomePage() {
    // Hide all pages and show Home page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('home-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showHomePage()"]').classList.add('active');
    
    // Update workspace title if a workspace is selected
    if (window.currentWorkspaceName) {
        const workspaceTitle = document.getElementById('workspace-title');
        if (workspaceTitle) {
            workspaceTitle.textContent = window.currentWorkspaceName;
        }
    }
}

function showAutoMLPage() {
    // Hide all pages and show AutoML page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('automl-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showAutoMLPage()"]').classList.add('active');
}

function showDataPage() {
    // Hide all pages and show Data page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('data-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showDataPage()"]').classList.add('active');
    
    // Update data files list
    updateDataFilesList();
}

function showJobsPage() {
    // Hide all pages and show Jobs page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('jobs-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showJobsPage()"]').classList.add('active');
    
    // Update jobs list for the Jobs page
    updateJobsPageList();
}

function showModelsPage() {
    // Hide all pages and show Models page
    document.querySelectorAll('.page-content').forEach(page => page.style.display = 'none');
    document.getElementById('models-page').style.display = 'block';
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[onclick="showModelsPage()"]').classList.add('active');
    
    // Update deployed models list
    updateDeployedModelsList();
}

// Wizard management
function openNewJobWizard() {
    document.getElementById('job-wizard-modal').style.display = 'flex';
    resetWizard();
}

function closeJobWizard() {
    document.getElementById('job-wizard-modal').style.display = 'none';
    resetWizard();
}

function resetWizard() {
    currentStep = 1;
    updateWizardStep();
    
    // Set default values with incrementing counters
    document.getElementById('job-name').value = `ML-Job-${jobCounter}`;
    
    // Reset other form data
    document.getElementById('task-type').value = '';
    const taskTypeSelected = document.getElementById('task-type-selected');
    taskTypeSelected.innerHTML = '<span class="placeholder">Select task type</span><span class="dropdown-arrow">▼</span>';
    document.querySelectorAll('.task-type-option').forEach(option => option.classList.remove('selected'));
    document.getElementById('data-file').value = '';
    document.getElementById('uploaded-files').innerHTML = '';
    document.getElementById('target-column').innerHTML = '<option value="">Select target column</option>';
    document.getElementById('target-column-group').style.display = 'none';
    document.getElementById('job-description').value = '';
    
    // Clear dataset name if it exists
    const datasetNameInput = document.getElementById('dataset-name');
    if (datasetNameInput) {
        datasetNameInput.value = '';
    }
    
    // Clear any error messages
    const errorDiv = document.getElementById('dataset-name-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
    
    currentJobData = {};
    currentData = null;
    currentTarget = null;
    
    // Hide file upload group initially
    document.getElementById('file-upload-group').style.display = 'none';
    
    // Populate dataset list
    populateDatasetList();
}

// Data source selection functions
function selectDataSource(source) {
    const existingGroup = document.getElementById('existing-dataset-group');
    const uploadGroup = document.getElementById('file-upload-group');
    const existingRadio = document.getElementById('data-source-existing');
    const uploadRadio = document.getElementById('data-source-upload');
    
    if (source === 'existing') {
        existingRadio.checked = true;
        uploadRadio.checked = false;
        existingGroup.style.display = 'block';
        uploadGroup.style.display = 'none';
        
        // Populate existing datasets dropdown
        populateExistingDatasets();
        
        // Clear any current data from file upload
        currentData = null;
        document.getElementById('uploaded-files').innerHTML = '';
        document.getElementById('data-file').value = '';
    } else {
        uploadRadio.checked = true;
        existingRadio.checked = false;
        existingGroup.style.display = 'none';
        uploadGroup.style.display = 'block';
        
        // Clear existing dataset selection
        document.getElementById('existing-dataset').value = '';
    }
}

function populateExistingDatasets() {
    const select = document.getElementById('existing-dataset');
    select.innerHTML = '<option value="">Choose a dataset</option>';
    
    // Filter for saved datasets only
    const savedDatasets = uploadedDataFiles.filter(file => file.isSaved);
    
    savedDatasets.forEach(dataset => {
        const option = document.createElement('option');
        option.value = dataset.filename;
        option.textContent = `${dataset.filename} (${dataset.shape ? dataset.shape[0] + ' rows, ' + dataset.shape[1] + ' cols' : 'Unknown size'})`;
        select.appendChild(option);
    });
    
    if (savedDatasets.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No saved datasets available';
        option.disabled = true;
        select.appendChild(option);
    }
}

function handleExistingDatasetSelection(filename) {
    if (!filename) {
        currentData = null;
        return;
    }
    
    // Find the selected dataset
    const selectedDataset = uploadedDataFiles.find(file => file.filename === filename && file.isSaved);
    
    if (selectedDataset) {
        // Set as current data
        currentData = { ...selectedDataset };
        
        // Update target column dropdown
        const targetSelect = document.getElementById('target-column');
        targetSelect.innerHTML = '<option value="">Select target column</option>';
        
        console.log('Loading existing dataset:', selectedDataset);
        console.log('Columns:', selectedDataset.finalColumns || selectedDataset.columns);
        
        const columnsToUse = selectedDataset.finalColumns || selectedDataset.columns || [];
        columnsToUse.forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            // Use dtypes if available, otherwise default
            const dtype = selectedDataset.dtypes && selectedDataset.dtypes[column] ? selectedDataset.dtypes[column] : 'unknown';
            option.textContent = `${column} (${dtype})`;
            targetSelect.appendChild(option);
        });

        document.getElementById('target-column-group').style.display = 'block';
        
        // Show success message
        const rows = selectedDataset.shape ? selectedDataset.shape[0] : 'Unknown';
        const cols = selectedDataset.shape ? selectedDataset.shape[1] : 'Unknown';
        console.log(`Selected existing dataset: ${filename}: ${rows} rows, ${cols} columns`);
        
        // Display the dataset info in the uploaded files area
        displayExistingDatasetInfo(selectedDataset);
    }
}

function displayExistingDatasetInfo(dataset) {
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    
    const fileDisplay = `
        <div class="uploaded-file">
            <span>📊 ${dataset.filename} (existing dataset)</span>
            <div style="margin-top: 5px; font-size: 12px; color: #666;">
                ${dataset.shape ? `${dataset.shape[0]} rows, ${dataset.shape[1]} columns` : 'Size unknown'} • 
                Saved: ${dataset.savedAt ? new Date(dataset.savedAt).toLocaleDateString() : 'Unknown'}
            </div>
        </div>
        <div class="data-preview" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e1e4e8;">
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                Using saved dataset configuration
            </div>
            <div style="font-size: 11px; color: #28a745;">
                ✓ Dataset is ready for training
            </div>
        </div>
    `;
    
    uploadedFilesDiv.innerHTML = fileDisplay;
}

// New dataset list management functions
function showCreateDatasetInterface() {
    console.log('Showing create dataset interface');
    // Show the file upload group
    document.getElementById('file-upload-group').style.display = 'block';
    
    // Clear previous values
    document.getElementById('dataset-name').value = '';
    document.getElementById('data-file').value = '';
    document.getElementById('uploaded-files').innerHTML = '';
    
    // Hide any previous error messages
    const errorDiv = document.getElementById('dataset-name-error');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}

function validateDatasetName() {
    const nameInput = document.getElementById('dataset-name');
    const datasetName = nameInput.value.trim();
    const errorDiv = document.getElementById('dataset-name-error');
    
    // Clear previous error
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    if (!datasetName) {
        return false; // Don't show error for empty name yet
    }
    
    // Check for duplicate custom names only (not filenames)
    const existingDatasets = uploadedDataFiles.filter(file => file.isSaved);
    const isDuplicate = existingDatasets.some(dataset => 
        dataset.customName === datasetName
    );
    
    if (isDuplicate) {
        errorDiv.textContent = 'A dataset with this name already exists. Please choose a different name.';
        errorDiv.style.display = 'block';
        return false;
    }
    
    return true;
}

function populateDatasetList() {
    const datasetList = document.getElementById('dataset-list');
    
    // Filter for saved datasets only
    const savedDatasets = uploadedDataFiles.filter(file => file.isSaved);
    
    if (savedDatasets.length === 0) {
        datasetList.innerHTML = `
            <div class="no-datasets">
                <p>No datasets available. Create a dataset using the button above.</p>
            </div>
        `;
    } else {
        datasetList.innerHTML = '';
        
        savedDatasets.forEach((dataset, index) => {
            const datasetItem = document.createElement('div');
            datasetItem.className = 'dataset-item';
            const displayName = dataset.customName || dataset.filename;
            const datasetId = dataset.customName || dataset.filename;
            datasetItem.innerHTML = `
                <label class="dataset-option">
                    <input type="radio" name="selected-dataset" value="${datasetId}" onchange="selectExistingDataset('${datasetId}')">
                    <span class="dataset-name">${displayName}</span>
                </label>
            `;
            datasetList.appendChild(datasetItem);
        });
    }
}

function selectExistingDataset(datasetId) {
    // Find the selected dataset by custom name or filename
    const selectedDataset = uploadedDataFiles.find(file => 
        file.isSaved && ((file.customName && file.customName === datasetId) || file.filename === datasetId)
    );
    
    if (selectedDataset) {
        // Set as current data
        currentData = { ...selectedDataset };
        
        // Update target column dropdown
        const targetSelect = document.getElementById('target-column');
        targetSelect.innerHTML = '<option value="">Select target column</option>';
        
        console.log('Loading existing dataset:', selectedDataset);
        console.log('Columns:', selectedDataset.finalColumns || selectedDataset.columns);
        
        const columnsToUse = selectedDataset.finalColumns || selectedDataset.columns || [];
        columnsToUse.forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            // Use dtypes if available, otherwise default
            const dtype = selectedDataset.dtypes && selectedDataset.dtypes[column] ? selectedDataset.dtypes[column] : 'unknown';
            option.textContent = `${column} (${dtype})`;
            targetSelect.appendChild(option);
        });

        document.getElementById('target-column-group').style.display = 'block';
        
        // Show success message
        const rows = selectedDataset.shape ? selectedDataset.shape[0] : 'Unknown';
        const cols = selectedDataset.shape ? selectedDataset.shape[1] : 'Unknown';
        console.log(`Selected existing dataset: ${filename}: ${rows} rows, ${cols} columns`);
        
        // Display the dataset info in the uploaded files area
        displayExistingDatasetInfo(selectedDataset);
        
        // Clear file input since we're using existing dataset
        document.getElementById('data-file').value = '';
    }
}

function updateWizardStep() {
    // Update vertical step indicators
    document.querySelectorAll('.step-vertical').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Show/hide wizard steps
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < maxSteps ? 'block' : 'none';
    submitBtn.style.display = currentStep === maxSteps ? 'block' : 'none';
    
    // Disable Next button on step 2 if data is not saved
    if (currentStep === 2 && nextBtn) {
        if (currentData && !currentData.isSaved) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
            nextBtn.title = 'Save your dataset configuration first';
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
            nextBtn.title = 'Continue to next step';
        }
    }
    
    // Update dataset list if on step 2
    if (currentStep === 2) {
        populateDatasetList();
    }
    
    // Update review summary if on step 5
    if (currentStep === 5) {
        updateJobSummary();
    }
    
    // Re-enable file input when returning to step 1
    if (currentStep === 1) {
        const fileInput = document.getElementById('data-file');
        if (fileInput && fileInput.disabled) {
            fileInput.disabled = false;
        }
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < maxSteps) {
            currentStep++;
            updateWizardStep();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateWizardStep();
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            const jobName = document.getElementById('job-name').value.trim();
            
            if (!jobName) {
                alert('Please enter a job name.');
                return false;
            }
            
            currentJobData.jobName = jobName;
            return true;
            
        case 2:
            const taskType = document.getElementById('task-type').value;
            
            if (!taskType) {
                alert('Please select a task type.');
                return false;
            }
            
            // Validate that a dataset is selected (either uploaded or from existing list)
            if (!currentData) {
                alert('Please create a new dataset or select an existing one.');
                return false;
            }
            
            if (!currentData.isSaved) {
                alert('Please save your dataset configuration before proceeding.');
                return false;
            }
            
            currentJobData.taskType = taskType;
            return true;
            
        case 3:
            // Task settings step - validate target column
            const targetColumn = document.getElementById('target-column').value;
            
            if (!targetColumn) {
                alert('Please select a target column.');
                return false;
            }
            
            // Capture limits data (optional fields)
            const metricThreshold = document.getElementById('metric-threshold').value;
            const experimentTimeout = document.getElementById('experiment-timeout').value;
            
            // Validate experiment timeout if provided
            if (experimentTimeout && parseInt(experimentTimeout) < 15) {
                alert('Experiment timeout must be at least 15 minutes.');
                return false;
            }
            
            // Validate metric threshold if provided
            if (metricThreshold) {
                const threshold = parseFloat(metricThreshold);
                const currentMetric = currentJobData.primaryMetric || (document.getElementById('task-type').value === 'classification' ? 'auc' : 'mae');
                
                // Define valid ranges for different metrics
                const metricRanges = {
                    // Classification metrics (0-1 range, higher is better)
                    'auc': { min: 0, max: 1, name: 'AUC' },
                    'accuracy': { min: 0, max: 1, name: 'Accuracy' },
                    'precision': { min: 0, max: 1, name: 'Precision' },
                    'recall': { min: 0, max: 1, name: 'Recall' },
                    'f1': { min: 0, max: 1, name: 'F1 Score' },
                    // Regression metrics (lower is better, no practical upper bound)
                    'mae': { min: 0, max: null, name: 'Mean Absolute Error' },
                    'rmse': { min: 0, max: null, name: 'Root Mean Squared Error' },
                    'r2': { min: null, max: 1, name: 'R² Score' }
                };
                
                const range = metricRanges[currentMetric];
                if (range) {
                    if (range.min !== null && threshold < range.min) {
                        alert(`Metric score threshold for ${range.name} must be at least ${range.min}.`);
                        return false;
                    }
                    if (range.max !== null && threshold > range.max) {
                        alert(`Metric score threshold for ${range.name} must be at most ${range.max}.`);
                        return false;
                    }
                }
            }
            
            currentJobData.targetColumn = targetColumn;
            currentJobData.metricThreshold = metricThreshold ? parseFloat(metricThreshold) : null;
            currentJobData.experimentTimeout = experimentTimeout ? parseInt(experimentTimeout) : null;
            return true;
            
        case 4:
            // Compute step - validate compute type selection
            const computeType = document.getElementById('compute-type').value;
            
            if (!computeType) {
                alert('Please select a compute type.');
                return false;
            }
            
            currentJobData.computeType = computeType;
            return true;
            
        case 5:
            // Review step - all validations done
            return true;
            
        default:
            return true;
    }
}

// Custom dropdown functionality
function toggleTaskTypeDropdown() {
    const dropdown = document.getElementById('task-type-options');
    const selected = document.getElementById('task-type-selected');
    
    dropdown.classList.toggle('show');
    selected.classList.toggle('active');
}

function selectTaskType(value) {
    const hiddenInput = document.getElementById('task-type');
    const selected = document.getElementById('task-type-selected');
    const dropdown = document.getElementById('task-type-options');
    const options = document.querySelectorAll('.task-type-option');
    
    // Update hidden input value
    hiddenInput.value = value;
    
    // Update selected display
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    const icon = selectedOption.querySelector('.task-type-icon').cloneNode(true);
    const text = selectedOption.querySelector('span').textContent;
    
    selected.innerHTML = `
        <div class="selected-option">
            ${icon.outerHTML}
            <span>${text}</span>
        </div>
        <span class="dropdown-arrow">▼</span>
    `;
    
    // Update option states
    options.forEach(option => option.classList.remove('selected'));
    selectedOption.classList.add('selected');
    
    // Close dropdown
    dropdown.classList.remove('show');
    selected.classList.remove('active');
    
    // Call the update function
    updateTaskType(value);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.custom-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        document.getElementById('task-type-options').classList.remove('show');
        document.getElementById('task-type-selected').classList.remove('active');
    }
});

// File upload handling
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Check file type
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a valid CSV file.');
        input.value = '';
        return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File is too large. Please select a CSV file smaller than 10MB.');
        input.value = '';
        return;
    }
    
    // Allow multiple datasets from the same file with different custom names
    // The unique validation will be handled by the custom name check during save
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        
        // Basic validation of CSV content
        if (!csvContent || csvContent.trim().length === 0) {
            alert('The CSV file appears to be empty.');
            input.value = '';
            return;
        }
        
        // Check if it looks like CSV (has commas or line breaks)
        if (!csvContent.includes(',') && !csvContent.includes('\n')) {
            alert('The file does not appear to be a valid CSV format.');
            input.value = '';
            return;
        }
        
        parseCSVData(csvContent, file.name);
        
        // Disable the file input after successful upload
        input.disabled = true;
    };
    
    reader.onerror = function() {
        alert('Error reading the file. Please try again.');
        input.value = '';
    };
    
    reader.readAsText(file);
}

function parseCSVData(csvContent, fileName) {
    try {
        // Check if PyScript is available
        if (!pyScriptReady) {
            console.log('PyScript not ready, using fallback parser');
            // Use fallback JavaScript CSV parsing
            const useHeaders = useFirstRowAsHeaders;
            const fallbackData = parseCSVFallback(csvContent, fileName, useHeaders);
            if (fallbackData) {
                handleParsedData(JSON.stringify(fallbackData));
            } else {
                // Even fallback failed, create error data
                const errorData = {
                    success: false,
                    error: 'Unable to parse CSV file. Please check the file format.',
                    filename: fileName,
                    columns: [],
                    parser: 'failed'
                };
                handleParsedData(JSON.stringify(errorData));
            }
            return;
        }

        // Try PyScript parsing with proper error handling
        try {
            console.log('Attempting PyScript CSV parsing...');
            // Store data in window for PyScript access
            window.csvContentForParsing = csvContent;
            window.fileNameForParsing = fileName;

            // Call PyScript function if available
            if (typeof window.parse_csv_with_pyscript === 'function') {
                console.log('Calling PyScript CSV parser...');
                // Use the global variable to determine header behavior
                const useHeaders = useFirstRowAsHeaders;
                console.log('Using first row as headers:', useHeaders);
                window.parse_csv_with_pyscript(csvContent, fileName, useHeaders);
                return;
            } else {
                console.log('PyScript CSV parser not available, using fallback');
                throw new Error('PyScript CSV parser not available');
            }
        } catch (pyScriptError) {
            console.log('PyScript parsing failed, using fallback:', pyScriptError.message);
            // Use fallback JavaScript CSV parsing
            const useHeaders = useFirstRowAsHeaders;
            const fallbackData = parseCSVFallback(csvContent, fileName, useHeaders);
            if (fallbackData) {
                console.log('Fallback parsing successful:', fallbackData);
                handleParsedData(JSON.stringify(fallbackData));
            } else {
                console.error('Both PyScript and fallback parsing failed');
                // Create error data structure and still show the interface
                const errorData = {
                    success: false,
                    error: 'Unable to parse CSV file. Please check the file format and try again.',
                    filename: fileName,
                    columns: [],
                    parser: 'failed'
                };
                handleParsedData(JSON.stringify(errorData));
            }
            return;
        }

        // Store file data for Data page
        const fileData = {
            id: Date.now(),
            name: fileName,
            content: csvContent,
            uploadTime: new Date(),
            size: csvContent.length
        };
        
        // Add to uploaded files if not already exists
        if (!uploadedDataFiles.find(f => f.name === fileName)) {
            uploadedDataFiles.push(fileData);
        }
        
    } catch (error) {
        console.error('Error parsing CSV:', error);
        alert(`Error parsing CSV file: ${error.message}. Please check the file format.`);
        
        // Try fallback JavaScript CSV parsing
        try {
            const useHeaders = useFirstRowAsHeaders;
            const fallbackData = parseCSVFallback(csvContent, fileName, useHeaders);
            if (fallbackData) {
                handleParsedData(JSON.stringify(fallbackData));
                return;
            }
        } catch (fallbackError) {
            console.error('Fallback parsing also failed:', fallbackError);
        }
        
        // Clear the file input on error
        document.getElementById('data-file').value = '';
    }
}

// Fallback CSV parser using JavaScript
function parseCSVFallback(csvContent, fileName, useFirstRowAsHeaders = true) {
    try {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 1) {
            throw new Error('CSV must have at least one row');
        }
        
        let headers;
        let dataStartIndex;
        
        if (useFirstRowAsHeaders) {
            // Use first row as headers (original behavior)
            if (lines.length < 2) {
                throw new Error('CSV must have at least a header and one data row');
            }
            
            headers = parseCSVLine(lines[0]);
            dataStartIndex = 1;
            
            // Validate headers
            const headerValidation = validateCSVHeaders(headers, lines);
            if (!headerValidation.valid) {
                return {
                    success: false,
                    needsHeaders: true,
                    error: headerValidation.reason,
                    filename: fileName,
                    parser: 'javascript',
                    rawData: lines.slice(0, 4), // First 4 rows for preview
                    suggestedHeaders: headerValidation.suggestedHeaders
                };
            }
        } else {
            // Generate column headers, treat first row as data
            const firstRowCells = parseCSVLine(lines[0]);
            headers = firstRowCells.map((_, index) => `Column${index + 1}`);
            dataStartIndex = 0;
        }
        
        // Parse a few sample rows to determine data types
        const sampleRows = lines.slice(dataStartIndex, Math.min(dataStartIndex + 10, lines.length));
        const dtypes = {};
        
        headers.forEach((header, index) => {
            // Improved type detection - check more samples and handle edge cases
            let isNumeric = true;
            let hasDecimals = false;
            let validValues = 0;
            
            for (let row of sampleRows) {
                const cells = parseCSVLine(row);
                if (index < cells.length) {
                    const value = cells[index].trim();
                    if (value && value !== '' && value.toLowerCase() !== 'nan' && value.toLowerCase() !== 'null') {
                        validValues++;
                        const numValue = parseFloat(value);
                        if (isNaN(numValue)) {
                            isNumeric = false;
                            break;
                        } else {
                            if (value.includes('.') || value.includes('e') || value.includes('E')) {
                                hasDecimals = true;
                            }
                        }
                    }
                }
            }
            
            // Only consider it numeric if we have enough valid values to determine
            if (isNumeric && validValues > 0) {
                dtypes[header] = hasDecimals ? 'float64' : 'int64';
            } else {
                dtypes[header] = 'object';
            }
        });
        
        // Create preview data (first 5 data rows)
        const previewRows = lines.slice(dataStartIndex, Math.min(dataStartIndex + 5, lines.length));
        const preview = previewRows.map(row => {
            const cells = parseCSVLine(row);
            const rowObj = {};
            headers.forEach((header, index) => {
                let value = index < cells.length ? cells[index] : '';
                // Handle empty values and potential NaN-like strings
                if (value === '' || value.toLowerCase() === 'nan' || value.toLowerCase() === 'null') {
                    value = '';
                }
                rowObj[header] = value;
            });
            return rowObj;
        });
        
        return {
            columns: headers,
            dtypes: dtypes,
            shape: [lines.length - dataStartIndex, headers.length],
            filename: fileName,
            preview: preview,
            success: true,
            parser: 'javascript'
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            filename: fileName,
            parser: 'javascript'
        };
    }
}

// Validate CSV headers
function validateCSVHeaders(headers, lines) {
    // Check for empty or missing headers
    const hasEmptyHeaders = headers.some(h => !h || h.trim() === '');
    
    // Check if headers look like data (all numbers)
    const allNumeric = headers.every(h => !isNaN(parseFloat(h.trim())) && h.trim() !== '');
    
    // Check for generic headers like "Column1", "Field1", etc.
    const hasGenericHeaders = headers.some(h => 
        /^(column|field|col|var)\s*\d*$/i.test(h.trim())
    );
    
    // Check if first row looks like data compared to second row
    let firstRowLooksLikeData = false;
    if (lines.length > 1) {
        const firstRow = parseCSVLine(lines[0]);
        const secondRow = parseCSVLine(lines[1]);
        
        // If first row has more numbers than text, and similar pattern to second row
        const firstRowNumbers = firstRow.filter(cell => !isNaN(parseFloat(cell.trim()))).length;
        const secondRowNumbers = secondRow.filter(cell => !isNaN(parseFloat(cell.trim()))).length;
        
        if (firstRowNumbers > firstRow.length * 0.7 && Math.abs(firstRowNumbers - secondRowNumbers) <= 1) {
            firstRowLooksLikeData = true;
        }
    }
    
    let reason = '';
    let suggestedHeaders = [];
    
    if (hasEmptyHeaders) {
        reason = 'Some column headers are empty or missing';
    } else if (allNumeric) {
        reason = 'Column headers appear to be numeric data rather than descriptive names';
    } else if (firstRowLooksLikeData) {
        reason = 'First row appears to contain data rather than column headers';
    } else if (hasGenericHeaders) {
        reason = 'Column headers appear to be generic placeholders';
    }
    
    if (reason) {
        // Generate suggested headers
        for (let i = 0; i < headers.length; i++) {
            suggestedHeaders.push(`Column_${i + 1}`);
        }
        
        return {
            valid: false,
            reason: reason,
            suggestedHeaders: suggestedHeaders
        };
    }
    
    return { valid: true };
}

// Helper function to parse a CSV line handling quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result.map(cell => cell.replace(/^"|"$/g, '')); // Remove surrounding quotes
}

function handleParsedData(columnDataJson) {
    const columnData = JSON.parse(columnDataJson);
    
    // Check if header validation is needed
    if (!columnData.success && columnData.needsHeaders) {
        showHeaderValidationInterface(columnData);
        return;
    }
    
    // Always set currentData so we can show the file interface
    currentData = columnData;
    
    // Reset saved state for new data
    currentData.isSaved = false;
    isDataSaved = false;
    
    // Check if parsing was successful
    if (!columnData.success) {
        console.log(`Parsing failed: ${columnData.error}`);
        // Still display the file interface with error message and header options
        displayUploadedFile(columnData.filename || 'uploaded file');
        return;
    }

    // Update target column dropdown
    const targetSelect = document.getElementById('target-column');
    targetSelect.innerHTML = '<option value="">Select target column</option>';
    
    console.log('Populating target column dropdown with columns:', columnData.columns);
    
    columnData.columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column;
        option.textContent = `${column} (${columnData.dtypes[column]})`;
        targetSelect.appendChild(option);
    });

    document.getElementById('target-column-group').style.display = 'block';
    
    console.log('Target column dropdown populated. Options:', Array.from(targetSelect.options).map(opt => opt.value));
    
    // Show success message with file info
    const rows = columnData.shape[0];
    const cols = columnData.shape[1];
    const parser = columnData.parser || 'unknown';
    console.log(`Successfully loaded ${columnData.filename}: ${rows} rows, ${cols} columns (using ${parser} parser)`);
    
    // Display the uploaded file with data preview now that parsing is complete
    displayUploadedFile(columnData.filename);
    
    // Update wizard button states since we have new data that isn't saved yet
    updateWizardStep();
}

function displayUploadedFile(fileName) {
    const uploadedFilesDiv = document.getElementById('uploaded-files');
    
    // Basic uploaded file display
    let fileDisplay = `
        <div class="uploaded-file">
            <span>📄 ${fileName}</span>
            <button type="button" onclick="removeUploadedFile()" style="margin-left: 10px; color: #d13438;">✕</button>
        </div>
    `;
    
    // Always add header validation interface for CSV files
    if (currentData) {
        console.log('Displaying file interface for:', currentData);
        
        const hasValidData = currentData.success && currentData.preview && currentData.preview.length > 0;
        const columns = currentData.columns || [];
        const previewRows = hasValidData ? currentData.preview.slice(0, 3) : [];
        
        fileDisplay += `
            <div class="data-preview" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e1e4e8;">
                ${hasValidData ? `
                    <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                        Data Preview (${currentData.shape ? currentData.shape[0] : 0} rows, ${currentData.shape ? currentData.shape[1] : 0} columns)
                    </div>
                ` : `
                    <div style="font-size: 12px; color: #d73a49; margin-bottom: 8px;">
                        ${currentData.error ? `Parse Error: ${currentData.error}` : 'File uploaded - configure headers below'}
                    </div>
                `}
                
                <!-- Custom headers input -->
                <div id="custom-headers-section" style="${hasValidData ? 'display: none;' : 'display: block;'} margin-bottom: 15px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
                    <div style="font-size: 11px; color: #666; margin-bottom: 5px;">Enter column names:</div>
                    <div id="header-inputs" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${columns.length > 0 ? columns.map((col, index) => `
                            <input type="text" 
                                   id="custom-header-${index}" 
                                   value="${hasValidData ? col : `Column${index + 1}`}" 
                                   placeholder="Column ${index + 1}"
                                   style="flex: 1; min-width: 80px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; font-size: 11px;"
                                   onchange="updateCustomHeaders()"
                                   ${currentData.isSaved ? 'disabled' : ''}>
                        `).join('') : `
                            <div style="color: #666; font-size: 11px;">
                                Please ensure the file is a valid CSV format to detect columns.
                                <br><button onclick="retryParsing()" style="margin-top: 5px; padding: 4px 8px; font-size: 11px;">Retry Parsing</button>
                            </div>
                        `}
                    </div>
                </div>
                
                ${hasValidData ? `
                    <!-- Header checkbox and Save button - positioned above table, aligned left -->
                    <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 15px;">
                        <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;">
                            <input type="checkbox" id="first-row-headers" ${useFirstRowAsHeaders ? 'checked' : ''} onchange="toggleHeaderMode()" style="margin: 0;" ${currentData.isSaved ? 'disabled' : ''}>
                            <span>First row contains column headers</span>
                        </label>
                        <button type="button" id="save-data-btn" onclick="saveDataset()" 
                                style="padding: 6px 12px; font-size: 12px; background: #0366d6; color: white; border: none; border-radius: 4px; cursor: pointer; ${currentData.isSaved ? 'background: #28a745;' : ''}" 
                                ${currentData.isSaved ? 'disabled' : ''}>
                            ${currentData.isSaved ? '✓ Created' : 'Create'}
                        </button>
                    </div>
                    
                    <div style="overflow-x: auto; max-width: 100%;">
                        <table id="data-preview-table" style="border-collapse: collapse; font-size: 11px; min-width: 100%;">
                            <thead>
                                <tr id="header-row">
                                    ${columns.map(col => `<th style="padding: 6px 8px; border: 1px solid #ddd; background: #f1f3f4; text-align: left; white-space: nowrap; font-weight: 600;">${col}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${previewRows.map(row => `
                                    <tr>
                                        ${columns.map(col => {
                                            let value = row[col];
                                            if (value === null || value === undefined) {
                                                value = '';
                                            } else {
                                                value = String(value);
                                            }
                                            // Truncate very long values but show more characters
                                            if (value.length > 30) {
                                                value = value.substring(0, 27) + '...';
                                            }
                                            return `<td style="padding: 6px 8px; border: 1px solid #ddd; white-space: nowrap; max-width: 200px;">${value}</td>`;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <!-- Header checkbox - positioned above placeholder, aligned left -->
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;">
                            <input type="checkbox" id="first-row-headers" ${useFirstRowAsHeaders ? 'checked' : ''} onchange="toggleHeaderMode()" style="margin: 0;">
                            <span>First row contains column headers</span>
                        </label>
                    </div>
                    
                    <div style="padding: 20px; text-align: center; background: #f8f9fa; border: 1px dashed #ddd; border-radius: 4px;">
                        <div style="color: #666; font-size: 12px;">
                            Data preview will appear here once parsing is successful.
                            <br>Configure headers above and click "Retry Parsing" if needed.
                        </div>
                    </div>
                `}
            </div>
        `;
    } else {
        console.log('No data available for preview');
    }
    
    uploadedFilesDiv.innerHTML = fileDisplay;
}

function removeUploadedFile() {
    document.getElementById('uploaded-files').innerHTML = '';
    const fileInput = document.getElementById('data-file');
    fileInput.value = '';
    fileInput.disabled = false; // Re-enable the file input
    document.getElementById('target-column-group').style.display = 'none';
    currentData = null;
}

// Header management functions
function toggleHeaderMode() {
    const checkbox = document.getElementById('first-row-headers');
    const customHeadersSection = document.getElementById('custom-headers-section');
    const headerRow = document.getElementById('header-row');
    
    if (!checkbox || !customHeadersSection || !currentData) return;
    
    // If data is already saved, don't allow changes
    if (currentData.isSaved) {
        checkbox.checked = !checkbox.checked; // Revert the change
        alert('Dataset is already saved. To make changes, please remove and re-upload the file.');
        return;
    }
    
    // Update the global variable to track user preference
    useFirstRowAsHeaders = checkbox.checked;
    
    if (checkbox.checked) {
        // Use first row as headers - restore original headers
        customHeadersSection.style.display = 'none';
        if (currentData.originalColumns) {
            // Restore original data structure
            currentData.columns = [...currentData.originalColumns];
            currentData.usingCustomHeaders = false;
            delete currentData.customHeaders;
            
            // Restore original preview data
            if (currentData.preview && currentData.originalColumns) {
                // Re-parse or request fresh data - for now just update display
                console.log('Restored to original headers:', currentData.originalColumns);
            }
        }
        updatePreviewTableHeaders(currentData.columns);
        
        // Trigger a reparse to get the original data structure back
        retryParsing();
    } else {
        // Show custom header inputs and trigger reparse with first row as data
        customHeadersSection.style.display = 'block';
        
        // Trigger reparse
        retryParsing();
    }
}

function updateCustomHeaders() {
    if (!currentData) return;
    
    // Prevent changes if data is already saved
    if (currentData.isSaved) {
        return;
    }
    
    const customHeaders = [];
    const numColumns = currentData.columns.length;
    
    // Get values from custom header inputs
    for (let i = 0; i < numColumns; i++) {
        const input = document.getElementById(`custom-header-${i}`);
        if (input) {
            const value = input.value.trim();
            customHeaders.push(value || `Column${i + 1}`);
        } else {
            customHeaders.push(`Column${i + 1}`);
        }
    }
    
    // Update the preview table headers
    updatePreviewTableHeaders(customHeaders);
    
    // Update currentData with new headers for processing
    const checkbox = document.getElementById('first-row-headers');
    if (checkbox && !checkbox.checked) {
        // Store the original columns and create a mapping
        if (!currentData.originalColumns) {
            currentData.originalColumns = [...currentData.columns];
        }
        
        // Update columns in currentData
        currentData.columns = [...customHeaders];
        currentData.customHeaders = customHeaders;
        currentData.usingCustomHeaders = true;
        
        // Update the preview data to use new headers
        if (currentData.preview) {
            // When using custom headers, we need to treat the first row as data, not headers
            // So we need to get the raw data and reprocess it
            const originalFirstRowAsData = {};
            
            // If we have original columns, create a data row from the first row that was treated as headers
            if (currentData.originalColumns) {
                currentData.originalColumns.forEach((originalCol, index) => {
                    originalFirstRowAsData[customHeaders[index]] = originalCol; // The original "header" becomes data
                });
            }
            
            // Map existing preview data to new headers
            const mappedPreviewData = currentData.preview.map(row => {
                const newRow = {};
                currentData.originalColumns.forEach((oldCol, index) => {
                    newRow[customHeaders[index]] = row[oldCol];
                });
                return newRow;
            });
            
            // Prepend the original first row as data when using custom headers
            currentData.preview = [originalFirstRowAsData, ...mappedPreviewData];
            
            // Update the display immediately
            displayUploadedFile(currentData.filename);
        }
        
        // Update dtypes mapping
        if (currentData.dtypes) {
            const newDtypes = {};
            currentData.originalColumns.forEach((oldCol, index) => {
                newDtypes[customHeaders[index]] = currentData.dtypes[oldCol];
            });
            currentData.dtypes = newDtypes;
        }
        
        console.log('Updated currentData with custom headers:', currentData);
    }
}

function saveDataset() {
    if (!currentData || !currentData.success) {
        alert('No valid dataset to save');
        return;
    }
    
    // Validate dataset name
    const datasetNameInput = document.getElementById('dataset-name');
    const customName = datasetNameInput ? datasetNameInput.value.trim() : '';
    
    if (!customName) {
        alert('Please provide a dataset name.');
        return;
    }
    
    if (!validateDatasetName()) {
        alert('Please provide a valid, unique dataset name.');
        return;
    }
    
    // Use custom name if provided, otherwise use filename
    const datasetName = customName || currentData.filename;
    
    // Create a finalized copy of the current data
    const finalizedData = {
        ...currentData,
        isSaved: true,
        savedAt: new Date().toISOString(),
        uploadTime: new Date(), // Add uploadTime for data list compatibility
        finalColumns: [...currentData.columns],
        finalHeaders: currentData.usingCustomHeaders ? [...currentData.customHeaders] : [...currentData.columns],
        name: datasetName, // Use the custom name or filename
        customName: customName, // Store the custom name separately
        filename: currentData.filename // Keep original filename
    };
    
    // Update the uploadedDataFiles array with the finalized data
    // Only update if the exact same custom name exists, otherwise create new
    const existingIndex = uploadedDataFiles.findIndex(f => 
        f.customName && f.customName === customName
    );
    if (existingIndex >= 0) {
        uploadedDataFiles[existingIndex] = finalizedData;
    } else {
        uploadedDataFiles.push(finalizedData);
    }
    
    // Mark current data as saved
    currentData.isSaved = true;
    isDataSaved = true;
    
    // Update the UI to reflect saved state
    displayUploadedFile(currentData.filename);
    
    // Enable the Next button now that data is saved
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Update the data page to show this dataset
    updateDataFilesList();
    
    // Also update the dataset list in the wizard
    populateDatasetList();
    
    // Hide the file upload form after saving
    document.getElementById('file-upload-group').style.display = 'none';
    
    // Automatically select the newly created dataset in the list
    setTimeout(() => {
        const radioButton = document.querySelector(`input[name="selected-dataset"][value="${datasetName}"]`);
        if (radioButton) {
            radioButton.checked = true;
            // Trigger the onchange event to set it as current data
            selectExistingDataset(datasetName);
        }
    }, 100);
    
    console.log('Dataset saved successfully:', finalizedData);
}

function updatePreviewTableHeaders(headers) {
    const headerRow = document.getElementById('header-row');
    if (!headerRow) return;
    
    headerRow.innerHTML = headers.map(header => 
        `<th style="padding: 6px 8px; border: 1px solid #ddd; background: #f1f3f4; text-align: left; white-space: nowrap; font-weight: 600;">${header}</th>`
    ).join('');
    
    // Also update the target column dropdown if visible
    updateTargetColumnDropdown(headers);
}

function updateTargetColumnDropdown(headers) {
    const targetSelect = document.getElementById('target-column');
    if (!targetSelect || !currentData) return;
    
    // Save current selection
    const currentSelection = targetSelect.value;
    
    // Update options
    targetSelect.innerHTML = '<option value="">Select target column</option>';
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        targetSelect.appendChild(option);
    });
    
    // Restore selection if it still exists
    if (currentSelection && headers.includes(currentSelection)) {
        targetSelect.value = currentSelection;
    }
}

function retryParsing() {
    // Get the current file
    const fileInput = document.getElementById('data-file');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('No file selected. Please upload a CSV file first.');
        return;
    }
    
    const file = fileInput.files[0];
    console.log('Retrying parsing for file:', file.name);
    
    // Re-read and parse the file
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        parseCSVData(csvContent, file.name);
    };
    
    reader.onerror = function() {
        alert('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
}

// Task type handling
function updateTaskType(taskType) {
    currentJobData.taskType = taskType;
    
    // Set default configuration based on task type if not already set
    if (!currentJobData.primaryMetric) {
        currentJobData.primaryMetric = taskType === 'classification' ? 'auc' : 'mae';
    }
    
    if (!currentJobData.algorithms) {
        currentJobData.algorithms = taskType === 'classification' 
            ? ['logistic_regression', 'decision_tree', 'random_forest']
            : ['linear_regression', 'decision_tree', 'lasso'];
    }
    
    if (currentJobData.normalizeFeatures === undefined) {
        currentJobData.normalizeFeatures = false;
    }
    
    if (!currentJobData.missingDataStrategy) {
        currentJobData.missingDataStrategy = 'remove';
    }
    
    if (!currentJobData.categoricalSettings) {
        currentJobData.categoricalSettings = {};
    }
    
    // Update metric threshold constraints based on task type's default metric
    updateMetricThresholdConstraints(currentJobData.primaryMetric);
    
    console.log('Updated currentJobData with task type defaults:', currentJobData);
    
    // Update categorical columns display if data is loaded
    if (currentData) {
        updateCategoricalColumnsDisplay();
    }
}

function updateCategoricalColumnsDisplay() {
    if (!currentData) return;
    
    const categoricalDiv = document.getElementById('categorical-columns');
    const categoricalGroup = document.getElementById('categorical-columns-group');
    
    // Find non-numeric columns
    const nonNumericColumns = [];
    Object.entries(currentData.dtypes).forEach(([column, dtype]) => {
        if (dtype === 'object' || dtype.includes('string')) {
            nonNumericColumns.push(column);
        }
    });
    
    if (nonNumericColumns.length > 0) {
        categoricalGroup.style.display = 'block';
        categoricalDiv.innerHTML = '';
        
        nonNumericColumns.forEach(column => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="column-name">${column}</td>
                <td>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="categorical-${column}" value="categorize" checked>
                            <span>Categorize</span>
                        </label>
                        <label>
                            <input type="radio" name="categorical-${column}" value="ignore">
                            <span>Ignore</span>
                        </label>
                    </div>
                </td>
            `;
            categoricalDiv.appendChild(row);
        });
    } else {
        categoricalGroup.style.display = 'none';
    }
}

// Configuration flyouts
function openConfigFlyout() {
    const taskType = currentJobData.taskType || document.querySelector('input[name="task-type"]:checked')?.value;
    
    if (!taskType) {
        alert('Please select a task type first.');
        return;
    }
    
    populateConfigModal(taskType);
    
    // Ensure the save button is enabled and clickable
    const saveBtn = document.getElementById('config-save-btn');
    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.removeAttribute('disabled');
        
        // Remove any existing event listeners and add fresh one
        saveBtn.onclick = null;
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Save button clicked via event listener');
            saveConfig();
        });
        
        console.log('Config save button enabled and event listener added'); // Debug log
    }
    
    document.getElementById('config-flyout').classList.add('open');
    document.getElementById('flyout-overlay').classList.add('show');
}

function closeConfigFlyout() {
    document.getElementById('config-flyout').classList.remove('open');
    document.getElementById('flyout-overlay').classList.remove('show');
}

function populateConfigModal(taskType) {
    const metricSelect = document.getElementById('primary-metric');
    const algorithmsDiv = document.getElementById('algorithms-list');
    
    metricSelect.innerHTML = '';
    algorithmsDiv.innerHTML = '';
    
    if (taskType === 'classification') {
        // Classification metrics
        ['auc', 'accuracy', 'precision', 'recall', 'f1'].forEach(metric => {
            const option = document.createElement('option');
            option.value = metric;
            option.textContent = metric === 'auc' ? 'AUC' : metric.charAt(0).toUpperCase() + metric.slice(1);
            if (metric === 'auc') option.selected = true;
            metricSelect.appendChild(option);
        });
        
        // Classification algorithms
        ['logistic_regression', 'decision_tree', 'random_forest'].forEach(algo => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${algo}" checked>
                ${algo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            `;
            algorithmsDiv.appendChild(label);
        });
    } else {
        // Regression metrics
        ['mae', 'rmse', 'r2'].forEach(metric => {
            const option = document.createElement('option');
            option.value = metric;
            option.textContent = metric.toUpperCase();
            if (metric === 'mae') option.selected = true;
            metricSelect.appendChild(option);
        });
        
        // Regression algorithms
        ['linear_regression', 'decision_tree', 'lasso'].forEach(algo => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${algo}" checked>
                ${algo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            `;
            algorithmsDiv.appendChild(label);
        });
    }
}

function saveConfig() {
    console.log('saveConfig() called'); // Debug log
    const primaryMetric = document.getElementById('primary-metric').value;
    const selectedAlgorithms = Array.from(document.querySelectorAll('#algorithms-list input:checked'))
        .map(cb => cb.value);
    
    console.log('Primary metric:', primaryMetric, 'Algorithms:', selectedAlgorithms); // Debug log
    
    currentJobData.primaryMetric = primaryMetric;
    currentJobData.algorithms = selectedAlgorithms;
    
    // Update metric threshold constraints based on selected primary metric
    updateMetricThresholdConstraints(primaryMetric);
    
    closeConfigFlyout();
}

// Featurization flyout
function openFeaturizationFlyout() {
    if (currentData) {
        updateCategoricalColumnsDisplay();
    }
    document.getElementById('featurization-flyout').classList.add('open');
    document.getElementById('flyout-overlay').classList.add('show');
}

function closeFeaturizationFlyout() {
    document.getElementById('featurization-flyout').classList.remove('open');
    document.getElementById('flyout-overlay').classList.remove('show');
}

function saveFeaturization() {
    const normalizeFeatures = document.getElementById('normalize-features').checked;
    currentJobData.normalizeFeatures = normalizeFeatures;
    
    // Save missing data strategy
    const missingDataStrategy = document.querySelector('input[name="missing-data-strategy"]:checked').value;
    currentJobData.missingDataStrategy = missingDataStrategy;
    
    // Save categorical column settings
    const categoricalSettings = {};
    document.querySelectorAll('#categorical-columns input:checked').forEach(radio => {
        const name = radio.name;
        const column = name.replace('categorical-', '');
        categoricalSettings[column] = radio.value;
    });
    currentJobData.categoricalSettings = categoricalSettings;
    
    closeFeaturizationFlyout();
}

// Job summary
function updateJobSummary() {
    const summaryDiv = document.getElementById('job-summary');
    
    const config = {
        primaryMetric: currentJobData.primaryMetric || 'auc',
        algorithms: currentJobData.algorithms || ['logistic_regression', 'decision_tree', 'random_forest'],
        normalizeFeatures: currentJobData.normalizeFeatures || false,
        missingDataStrategy: currentJobData.missingDataStrategy || 'remove',
        categoricalSettings: currentJobData.categoricalSettings || {}
    };
    
    summaryDiv.innerHTML = `
        <div class="summary-section">
            <h4>Job Configuration</h4>
            <p><strong>Job Name:</strong> ${currentJobData.jobName}</p>
            <p><strong>Task Type:</strong> ${currentJobData.taskType}</p>
            <p><strong>Target Column:</strong> ${currentJobData.targetColumn}</p>
            <p><strong>Compute Type:</strong> ${currentJobData.computeType}</p>
            <p><strong>Primary Metric:</strong> ${config.primaryMetric}</p>
            <p><strong>Algorithms:</strong> ${config.algorithms.join(', ')}</p>
            <p><strong>Normalize Features:</strong> ${config.normalizeFeatures ? 'Yes' : 'No'}</p>
            <p><strong>Missing Data:</strong> ${config.missingDataStrategy === 'remove' ? 'Remove rows' : 'Fill missing values'}</p>
            ${Object.keys(config.categoricalSettings).length > 0 ? 
                `<p><strong>Categorical Columns:</strong> ${JSON.stringify(config.categoricalSettings)}</p>` : ''}
            ${currentJobData.metricThreshold ? 
                `<p><strong>Metric Score Threshold:</strong> ${currentJobData.metricThreshold}</p>` : ''}
            ${currentJobData.experimentTimeout ? 
                `<p><strong>Experiment Timeout:</strong> ${currentJobData.experimentTimeout} minutes</p>` : ''}
        </div>
    `;
}

// Job submission and training
function submitJob() {
    if (!validateCurrentStep()) return;
    
    // Capture ALL form data before wizard is closed and form is reset
    const capturedJobData = {
        jobName: document.getElementById('job-name').value.trim(),
        taskType: document.getElementById('task-type').value,
        targetColumn: document.getElementById('target-column') ? document.getElementById('target-column').value : null,
        computeType: document.getElementById('compute-type') ? document.getElementById('compute-type').value : null,
        metricThreshold: document.getElementById('metric-threshold') ? 
            (document.getElementById('metric-threshold').value ? parseFloat(document.getElementById('metric-threshold').value) : null) : null,
        experimentTimeout: document.getElementById('experiment-timeout') ? 
            (document.getElementById('experiment-timeout').value ? parseInt(document.getElementById('experiment-timeout').value) : null) : null,
        // Use currentJobData for configuration that was set through modals
        primaryMetric: currentJobData.primaryMetric,
        algorithms: currentJobData.algorithms,
        normalizeFeatures: currentJobData.normalizeFeatures,
        missingDataStrategy: currentJobData.missingDataStrategy,
        categoricalSettings: currentJobData.categoricalSettings
    };
    
    // Validate required fields
    if (!capturedJobData.jobName) {
        alert('Job name is missing. Please go back and enter a job name.');
        return;
    }
    
    if (!capturedJobData.taskType) {
        alert('Please select a task type before submitting the job.');
        return;
    }
    
    if (!capturedJobData.targetColumn) {
        alert('Please select a target column before submitting the job.');
        return;
    }
    
    if (!capturedJobData.computeType) {
        alert('Please select a compute type before submitting the job.');
        return;
    }
    
    // Additional validation for training requirements
    if (!currentData) {
        alert('No data available for training. Please upload a CSV file first.');
        return;
    }
    
    if (!pyScriptReady) {
        alert('PyScript libraries are still loading. Please wait for the libraries to finish loading and try again.');
        return;
    }
    
    console.log('Job submission validation passed:', capturedJobData);
    
    // Set default configuration if not already set in captured data
    if (!capturedJobData.primaryMetric) {
        capturedJobData.primaryMetric = capturedJobData.taskType === 'classification' ? 'auc' : 'mae';
    }
    if (!capturedJobData.algorithms) {
        capturedJobData.algorithms = capturedJobData.taskType === 'classification' 
            ? ['logistic_regression', 'decision_tree', 'random_forest']
            : ['linear_regression', 'decision_tree', 'lasso'];
    }
    if (capturedJobData.normalizeFeatures === undefined) {
        capturedJobData.normalizeFeatures = false;
    }
    if (!capturedJobData.missingDataStrategy) {
        capturedJobData.missingDataStrategy = 'remove';
    }
    if (!capturedJobData.categoricalSettings) {
        capturedJobData.categoricalSettings = {};
    }

    closeJobWizard();
    
    // Pass the complete captured job data to training
    startTrainingJob(capturedJobData);
}

function startTrainingJob(capturedJobData) {
    // Update currentJobData with all captured values
    currentJobData = { ...currentJobData, ...capturedJobData };
    
    console.log('Starting training job with complete data:', currentJobData);
    
    // Add job to history
    const job = {
        id: Date.now(),
        name: currentJobData.jobName,
        status: 'running',
        taskType: currentJobData.taskType,
        targetColumn: currentJobData.targetColumn,
        startTime: new Date(),
        models: [],
        // Store all configuration settings
        primaryMetric: currentJobData.primaryMetric,
        algorithms: currentJobData.algorithms,
        normalizeFeatures: currentJobData.normalizeFeatures,
        missingDataStrategy: currentJobData.missingDataStrategy,
        categoricalSettings: currentJobData.categoricalSettings
    };
    
    jobHistory.push(job);
    
    // Increment counters for next job
    jobCounter++;
    
    refreshJobs();
    
    // Navigate to job details page instead of showing modal
    showJobDetails(job);
    
    // Start training with PyScript
    setTimeout(() => {
        trainModels(job);
    }, 1000);
}

function trainModels(job) {
    try {
        // Check if PyScript is ready
        if (!pyScriptReady) {
            throw new Error('PyScript ML libraries are still loading. Please wait and try again.');
        }

        // Check if PyScript training function is available
        if (typeof window.train_ml_models_pyscript !== 'function') {
            throw new Error('PyScript ML training function is not available. Please refresh the page.');
        }

        // Prepare job data for Python function
        const jobDataForPython = {
            ...currentJobData,
            id: job.id,
            jobName: job.name
        };

        console.log('DEBUG: jobDataForPython.targetColumn =', jobDataForPython.targetColumn);
        console.log('DEBUG: currentJobData.targetColumn =', currentJobData.targetColumn);

        // Validate required fields
        if (!jobDataForPython.targetColumn) {
            throw new Error('Target column is not set. Please go back and select a target column.');
        }
        
        if (!jobDataForPython.taskType) {
            throw new Error('Task type is not set. Please go back and select a task type.');
        }

        console.log('Starting PyScript ML training with real algorithms...');
        console.log('Training job data:', jobDataForPython);
        console.log('Current job data state:', currentJobData);
        console.log('🔍 CRITICAL SETTINGS CHECK:');
        console.log('  normalizeFeatures:', jobDataForPython.normalizeFeatures);
        console.log('  algorithms:', jobDataForPython.algorithms);
        console.log('  primaryMetric:', jobDataForPython.primaryMetric);
        console.log('  categoricalSettings:', jobDataForPython.categoricalSettings);

        // Apply custom headers to PyScript DataFrame if needed
        if (currentData && currentData.usingCustomHeaders && currentData.customHeaders) {
            console.log('Applying custom headers to PyScript DataFrame:', currentData.customHeaders);
            if (typeof window.update_dataframe_headers === 'function') {
                const success = window.update_dataframe_headers(currentData.customHeaders);
                if (!success) {
                    throw new Error('Failed to apply custom headers to DataFrame');
                }
            } else {
                console.warn('update_dataframe_headers function not available');
            }
        }

        // Use PyScript for real ML training - PyScript has the DataFrame stored globally
        window.train_ml_models_pyscript(JSON.stringify(jobDataForPython), {});

    } catch (error) {
        console.error('Training error:', error);
        document.getElementById('training-progress').innerHTML += 
            `<div class="progress-item error">✗ Training failed: ${error.message}</div>`;
    }
}

function updateTrainingProgress(progressHtml) {
    // Update both the old modal (for backwards compatibility) and new job details page
    const progressDiv = document.getElementById('training-progress');
    if (progressDiv) {
        progressDiv.innerHTML += progressHtml;
    }
    
    // Update job details progress section
    updateJobTrainingProgress(progressHtml);
}

function completeTraining(modelResults, jobId) {
    console.log('Completing training for job:', jobId, 'with results:', modelResults);
    
    // Get the job to access the primary metric
    const job = jobHistory.find(j => j.id === jobId);
    if (!job) {
        console.error('Job not found for ID:', jobId);
        return;
    }
    
    const primaryMetric = job.primaryMetric || 'auc';
    console.log('Using primary metric for best model selection:', primaryMetric);
    
    // modelResults should be an array from Python
    let modelArray = [];
    
    if (Array.isArray(modelResults)) {
        // Results come directly from Python as array
        console.log('🔍 DEBUG: Raw model results from Python:', modelResults);
        
        modelArray = modelResults.map(result => {
            const pythonPrimaryScore = result.primary_score;
            const calculatedScore = result.metrics[primaryMetric] ? result.metrics[primaryMetric].toFixed(4) : '0.0000';
            const finalScore = pythonPrimaryScore || calculatedScore;
            
            console.log(`🔍 DEBUG: Model ${result.name}:`);
            console.log(`  - Python primary_score: ${pythonPrimaryScore}`);
            console.log(`  - Calculated score: ${calculatedScore}`);
            console.log(`  - Final score used: ${finalScore}`);
            console.log(`  - Primary metric '${primaryMetric}' from metrics:`, result.metrics[primaryMetric]);
            console.log(`  - All metrics:`, result.metrics);
            
            return {
                name: result.display_name || result.name,
                primary_score: finalScore,
                metrics: result.metrics,
                is_best: result.is_best || false,
                created_at: result.created_at || new Date().toISOString()
            };
        });
    } else if (typeof modelResults === 'object') {
        // Handle legacy format (object) - convert object to array and find best model
        let bestScore = -1;
        let bestModelName = '';
        
        Object.entries(modelResults).forEach(([modelName, metrics]) => {
            const score = metrics.score || 0;
            if (score > bestScore) {
                bestScore = score;
                bestModelName = modelName;
            }
            
            modelArray.push({
                name: modelName,
                primary_score: score.toFixed(4),
                metrics: metrics,
                is_best: false, // Will be set below
                created_at: new Date().toISOString() // Add timestamp for legacy format
            });
        });
        
        // Mark the best model
        const bestModel = modelArray.find(m => m.name === bestModelName);
        if (bestModel) {
            bestModel.is_best = true;
        }
    }
    
    console.log('Processed model results:', modelArray);
    console.log('Primary metric being used:', primaryMetric);
    
    // Update job status
    if (job) {
        console.log('Updating job status to completed for job:', jobId);
        job.status = 'completed';
        job.models = modelArray;
        job.endTime = new Date();
        
        console.log('Job after update:', job);
        
        // Update current job details if this is the active job
        if (currentJobDetails && currentJobDetails.id === jobId) {
            console.log('Updating current job details');
            currentJobDetails = job;
            updateJobDetailsContent(job);
        } else {
            console.log('No active job details to update, currentJobDetails:', currentJobDetails);
        }
        
        // Force refresh the jobs list
        console.log('Calling refreshJobs()');
        refreshJobs();
    } else {
        console.error('Job object is null/undefined');
    }
    
    // Display model results in old modal (for backwards compatibility)
    const resultsDiv = document.getElementById('model-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '<h4>Training Results:</h4>';
        
        modelArray.forEach(result => {
            const modelDiv = document.createElement('div');
            modelDiv.className = `model-result ${result.is_best ? 'best-model' : ''}`;
            modelDiv.onclick = () => showModelDetails(result);
            
            modelDiv.innerHTML = `
                <div class="model-header">
                    <span class="model-name">${result.name}${result.is_best ? ' (Best Model)' : ''}</span>
                    <span class="model-score">${result.primary_score}</span>
                </div>
                <div class="model-info">
                    Primary metric: ${Object.keys(result.metrics).join(', ')}
                </div>
            `;
            
            resultsDiv.appendChild(modelDiv);
        });
    }
    
    // Show close button in modal
    const closeBtn = document.getElementById('training-close-btn');
    if (closeBtn) {
        closeBtn.style.display = 'block';
    }
    
    // Update training progress in job details
    updateJobTrainingProgress('<div class="progress-item success">✅ Training completed successfully!</div>');
    
    // Store models globally
    trainedModels[jobId] = modelArray;
    
    // Show close button
    document.getElementById('training-close-btn').style.display = 'block';
    
    // Update jobs list
    console.log('About to call refreshJobs() from completeTraining');
    refreshJobs();
    console.log('Finished calling refreshJobs()');
}

function closeTrainingModal() {
    document.getElementById('training-modal').style.display = 'none';
}

// Model details and management
function showModelDetails(model) {
    selectedModel = model;
    
    document.getElementById('model-title').textContent = `${model.name} Details`;
    
    // Display metrics
    const metricsDiv = document.getElementById('model-metrics');
    metricsDiv.innerHTML = '<h4>Metrics:</h4>';
    
    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'metrics-grid';
    
    Object.entries(model.metrics).forEach(([metric, value]) => {
        const metricCard = document.createElement('div');
        metricCard.className = 'metric-card';
        metricCard.innerHTML = `
            <div class="metric-label">${metric.toUpperCase()}</div>
            <div class="metric-value">${value}</div>
        `;
        metricsGrid.appendChild(metricCard);
    });
    
    metricsDiv.appendChild(metricsGrid);
    
    // Display visualization
    const vizDiv = document.getElementById('model-visualization');
    vizDiv.innerHTML = '<h4>Visualization:</h4>';
    
    if (model.visualization.type === 'confusion_matrix') {
        displayConfusionMatrix(vizDiv, model.visualization.data, model.visualization.labels);
    } else if (model.visualization.type === 'scatter_plot') {
        displayScatterPlot(vizDiv, model.visualization.data);
    }
    
    // Update buttons
    const deployBtn = document.getElementById('deploy-btn');
    const testBtn = document.getElementById('test-btn');
    
    const isDeployed = model.isDeployed || Object.values(deployedModels).some(m => 
        m.name === model.name && m.jobId === (selectedModel.jobId || 'current')
    );
    
    if (isDeployed) {
        deployBtn.style.display = 'none';
        testBtn.style.display = 'block';
    } else {
        deployBtn.style.display = 'block';
        testBtn.style.display = 'none';
    }
    
    document.getElementById('model-details-modal').style.display = 'block';
}

function closeModelDetails() {
    document.getElementById('model-details-modal').style.display = 'none';
    selectedModel = null;
}

function displayConfusionMatrix(container, matrix, labels) {
    const vizContainer = document.createElement('div');
    vizContainer.className = 'visualization-container';
    
    let html = '<table style="border-collapse: collapse; margin: 0 auto;">';
    html += '<tr><th></th>';
    labels.forEach(label => {
        html += `<th style="padding: 8px; border: 1px solid #ccc; background: #f0f0f0;">Predicted ${label}</th>`;
    });
    html += '</tr>';
    
    matrix.forEach((row, i) => {
        html += `<tr><th style="padding: 8px; border: 1px solid #ccc; background: #f0f0f0;">Actual ${labels[i]}</th>`;
        row.forEach(cell => {
            html += `<td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    
    vizContainer.innerHTML = html;
    container.appendChild(vizContainer);
}

function displayScatterPlot(container, data) {
    const vizContainer = document.createElement('div');
    vizContainer.className = 'visualization-container';
    
    // Simple text-based scatter plot representation
    let html = '<div style="font-family: monospace; font-size: 12px;">';
    html += '<p>Predicted vs Actual Values (first 20 points):</p>';
    html += '<table style="border-collapse: collapse;">';
    html += '<tr><th style="padding: 4px; border: 1px solid #ccc;">Actual</th><th style="padding: 4px; border: 1px solid #ccc;">Predicted</th><th style="padding: 4px; border: 1px solid #ccc;">Difference</th></tr>';
    
    for (let i = 0; i < Math.min(20, data.actual.length); i++) {
        const actual = data.actual[i].toFixed(3);
        const predicted = data.predicted[i].toFixed(3);
        const diff = Math.abs(data.actual[i] - data.predicted[i]).toFixed(3);
        html += `<tr><td style="padding: 4px; border: 1px solid #ccc;">${actual}</td><td style="padding: 4px; border: 1px solid #ccc;">${predicted}</td><td style="padding: 4px; border: 1px solid #ccc;">${diff}</td></tr>`;
    }
    
    html += '</table></div>';
    vizContainer.innerHTML = html;
    container.appendChild(vizContainer);
}

function deployModel() {
    if (!selectedModel) return;
    
    try {
        // Save model using PyScript
        pyodide.runPython(`
import pickle
import json
from js import selectedModel

# Get the model name
model_name = selectedModel.name.to_py()
model_key = model_name.lower().replace(" ", "_")

# Get the trained model
model = globals().get(f'trained_model_{model_key}')

if model:
    # Save model as pickle
    model_filename = f"{model_key}_model.pkl"
    
    # Serialize model
    model_data = pickle.dumps(model)
    
    # Store in deployed models
    deployed_info = {
        'name': model_name,
        'filename': model_filename,
        'data': model_data,
        'jobId': selectedModel.get('jobId', 'current')
    }
    
    # Add to global deployed models
    if 'deployed_models' not in globals():
        globals()['deployed_models'] = {}
    
    globals()['deployed_models'][model_key] = deployed_info
    
    js.modelDeploymentComplete(model_name, model_filename)
else:
    js.modelDeploymentError("Model not found")
        `);
    } catch (error) {
        console.error('Deployment error:', error);
        alert('Failed to deploy model: ' + error.message);
    }
}

function modelDeploymentComplete(modelName, filename) {
    // Store more detailed information about the deployed model
    const jobModels = Object.values(trainedModels).flat();
    const trainingModel = jobModels.find(m => m.name === modelName);
    
    deployedModels[modelName] = {
        name: modelName,
        filename: filename,
        jobId: selectedModel.jobId || 'current',
        deployTime: new Date(),
        metrics: trainingModel ? trainingModel.metrics : {},
        primaryScore: trainingModel ? trainingModel.primary_score : 'N/A',
        taskType: currentJobData.taskType || 'unknown'
    };
    
    alert(`Model "${modelName}" deployed successfully as ${filename}`);
    
    // Update buttons in model details modal
    document.getElementById('deploy-btn').style.display = 'none';
    document.getElementById('test-btn').style.display = 'block';
    
    // Update Models page if it's currently visible
    if (document.getElementById('models-page').style.display === 'block') {
        updateDeployedModelsList();
    }
}

function modelDeploymentError(error) {
    alert('Failed to deploy model: ' + error);
}

function testModel() {
    if (!selectedModel) return;
    
    // Generate example features based on the training data
    try {
        pyodide.runPython(`
import json
from js import selectedModel

# Get feature names from training data
if 'X_train' in globals():
    X_train = globals()['X_train']
    feature_names = X_train.columns.tolist()
    
    # Create example features with sample values
    example_features = {}
    for col in feature_names:
        if X_train[col].dtype in ['int64', 'int32', 'float64', 'float32']:
            example_features[col] = float(X_train[col].mean())
        else:
            example_features[col] = X_train[col].mode().iloc[0] if len(X_train[col].mode()) > 0 else 0
    
    js.showTestModelModal(json.dumps(example_features, indent=2))
else:
    js.showTestModelModal('{"feature1": 0, "feature2": 0}')
        `);
    } catch (error) {
        console.error('Error generating example features:', error);
        showTestModelModal('{"feature1": 0, "feature2": 0}');
    }
}

function showTestModelModal(exampleFeatures) {
    document.getElementById('test-features').value = exampleFeatures;
    document.getElementById('prediction-result').innerHTML = '';
    document.getElementById('test-model-modal').style.display = 'block';
}

function closeTestModel() {
    document.getElementById('test-model-modal').style.display = 'none';
}

function makePrediction() {
    const featuresText = document.getElementById('test-features').value;
    const resultDiv = document.getElementById('prediction-result');
    
    try {
        const features = JSON.parse(featuresText);
        
        pyodide.runPython(`
import json
import pickle
import pandas as pd
import numpy as np
from js import features, selectedModel

try:
    # Get features
    feature_data = features.to_py()
    model_name = selectedModel.name.to_py()
    model_key = model_name.lower().replace(" ", "_")
    
    # Get deployed model
    if 'deployed_models' in globals() and model_key in globals()['deployed_models']:
        model_info = globals()['deployed_models'][model_key]
        model = pickle.loads(model_info['data'])
        
        # Convert features to DataFrame
        X_pred = pd.DataFrame([feature_data])
        
        # Make prediction
        prediction = model.predict(X_pred)[0]
        
        # Get prediction probability if classification
        try:
            if hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba(X_pred)[0]
                js.showPredictionResult(f"Prediction: {prediction}, Probabilities: {probabilities.tolist()}")
            else:
                js.showPredictionResult(f"Prediction: {prediction}")
        except:
            js.showPredictionResult(f"Prediction: {prediction}")
    else:
        js.showPredictionError("Model not found or not deployed")

except Exception as e:
    js.showPredictionError(f"Prediction error: {str(e)}")
        `);
    } catch (error) {
        showPredictionError('Invalid JSON format: ' + error.message);
    }
}

function showPredictionResult(result) {
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.className = 'prediction-result success';
    resultDiv.innerHTML = `<strong>Result:</strong> ${result}`;
}

function showPredictionError(error) {
    const resultDiv = document.getElementById('prediction-result');
    resultDiv.className = 'prediction-result error';
    resultDiv.innerHTML = `<strong>Error:</strong> ${error}`;
}

// Jobs list management
function updateJobsList() {
    const jobsListDiv = document.getElementById('jobs-list');
    
    if (jobHistory.length === 0) {
        jobsListDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-content">
                    <h3>No recent Automated ML jobs to display.</h3>
                    <p>Click "New Automated ML job" to create your first job.</p>
                    <a href="https://aka.ms/mslearn-azure-ml-intro" target="_blank" class="learn-more-link">📚 Learn more about creating Automated ML jobs</a>
                </div>
            </div>
        `;
        return;
    }
    
    jobsListDiv.innerHTML = '';
    
    jobHistory.slice().reverse().forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job-item';
        jobDiv.onclick = () => navigateToJobDetails(job);
        
        const statusClass = job.status === 'completed' ? 'completed' : 'running';
        const duration = job.endTime ? 
            Math.round((job.endTime - job.startTime) / 1000) + 's' : 
            'Running...';
        
        jobDiv.innerHTML = `
            <div class="job-header">
                <span class="job-name">${job.name}</span>
                <span class="job-status ${statusClass}">${job.status}</span>
            </div>
            <div class="job-info">
                Task: ${job.taskType} | Target: ${job.targetColumn} | Duration: ${duration}
                ${job.models && job.models.length > 0 ? ` | Models: ${job.models.length}` : ''}
            </div>
        `;
        
        jobsListDiv.appendChild(jobDiv);
    });
}

function updateJobsPageList() {
    const jobsPageListDiv = document.getElementById('jobs-page-list');
    
    if (jobHistory.length === 0) {
        jobsPageListDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-content">
                    <h3>No jobs yet.</h3>
                    <p>Create jobs from the Automated ML page to see them here.</p>
                </div>
            </div>
        `;
        return;
    }
    
    jobsPageListDiv.innerHTML = '';
    
    jobHistory.slice().reverse().forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job-item';
        jobDiv.onclick = () => navigateToJobDetails(job);
        
        const statusClass = job.status === 'completed' ? 'completed' : 'running';
        const duration = job.endTime ? 
            Math.round((job.endTime - job.startTime) / 1000) + 's' : 
            'Running...';
        
        jobDiv.innerHTML = `
            <div class="job-header">
                <span class="job-name">${job.name}</span>
                <span class="job-status ${statusClass}">${job.status}</span>
            </div>
            <div class="job-info">
                Task: ${job.taskType} | Target: ${job.targetColumn} | Duration: ${duration}
                ${job.models && job.models.length > 0 ? ` | Models: ${job.models.length}` : ''}
            </div>
        `;
        
        jobsPageListDiv.appendChild(jobDiv);
    });
}

function navigateToJobDetails(job) {
    // This function navigates to the job details page when clicking a job in the list
    showJobDetails(job);
}

function refreshJobs() {
    updateJobsList();
    updateJobsPageList();
}

// Data page management
function updateDataFilesList() {
    const dataFilesListDiv = document.getElementById('data-files-list');
    
    if (uploadedDataFiles.length === 0) {
        dataFilesListDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-content">
                    <h3>No data files uploaded yet.</h3>
                    <p>Upload CSV files through the Automated ML job wizard to see them here.</p>
                </div>
            </div>
        `;
        return;
    }
    
    dataFilesListDiv.innerHTML = '';
    
    uploadedDataFiles.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'data-file-item';
        fileDiv.onclick = () => showDataFileContent(file);
        
        const formatFileSize = (bytes) => {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
            return Math.round(bytes / (1024 * 1024)) + ' MB';
        };
        
        const uploadTime = file.uploadTime.toLocaleString();
        
        fileDiv.innerHTML = `
            <div class="data-file-info">
                <span class="data-file-icon">📊</span>
                <div class="data-file-details">
                    <h4>${file.name}</h4>
                    <div class="data-file-meta">Uploaded: ${uploadTime}</div>
                </div>
            </div>
            <div class="data-file-size">${formatFileSize(file.size)}</div>
        `;
        
        dataFilesListDiv.appendChild(fileDiv);
    });
}

function showDataFileContent(file) {
    // Open the modal
    document.getElementById('data-content-modal').style.display = 'flex';
    
    // Set modal title
    document.getElementById('data-file-title').textContent = `${file.name || file.filename} - Contents`;
    
    // Display file content using the already parsed data
    try {
        // Create result object from existing file data
        const result = {
            info: {
                rows: file.shape ? file.shape[0] : 0,
                columns: file.shape ? file.shape[1] : 0,
                size: file.size || 0,
                filename: file.name || file.filename || 'Unknown'
            },
            columns: [],
            preview: file.preview || [],
            column_names: file.finalColumns || file.columns || []
        };
        
        // Create column info from available data
        const columns = file.finalColumns || file.columns || [];
        const dtypes = file.dtypes || {};
        
        columns.forEach(col => {
            const col_data = {
                name: col,
                type: dtypes[col] || 'unknown',
                non_null: file.shape ? file.shape[0] : 0, // Approximate
                null: 0 // Not available without re-parsing
            };
            result.columns.push(col_data);
        });
        
        // Display the content
        displayDataFileContent(JSON.stringify(result));
        
    } catch (error) {
        console.error('Error displaying file content:', error);
        
        // Fallback display with basic info
        const basicResult = {
            info: {
                rows: file.shape ? file.shape[0] : 'Unknown',
                columns: file.shape ? file.shape[1] : 'Unknown',
                size: file.size || 'Unknown',
                filename: file.name || file.filename || 'Unknown'
            },
            columns: (file.finalColumns || file.columns || []).map(col => ({
                name: col,
                type: 'unknown',
                non_null: 'Unknown',
                null: 'Unknown'
            })),
            preview: file.preview || [],
            column_names: file.finalColumns || file.columns || []
        };
        
        displayDataFileContent(JSON.stringify(basicResult));
    }
}

function displayDataFileContent(resultJson) {
    const result = JSON.parse(resultJson);
    
    // Display file info
    const infoDiv = document.getElementById('data-file-info');
    infoDiv.innerHTML = `
        <div class="data-info-grid">
            <div class="data-info-card">
                <div class="data-info-label">Rows</div>
                <div class="data-info-value">${result.info.rows}</div>
            </div>
            <div class="data-info-card">
                <div class="data-info-label">Columns</div>
                <div class="data-info-value">${result.info.columns}</div>
            </div>
            <div class="data-info-card">
                <div class="data-info-label">File Size</div>
                <div class="data-info-value">${Math.round(result.info.size / 1024)} KB</div>
            </div>
        </div>
    `;
    
    // Display preview
    const previewDiv = document.getElementById('data-file-preview');
    previewDiv.innerHTML = `
        <div class="data-preview-note">
            <strong>Preview:</strong> Showing first ${Math.min(10, result.info.rows)} rows of ${result.info.rows} total rows
        </div>
    `;
    
    // Create table
    let tableHtml = '<table class="data-preview-table"><thead><tr>';
    result.column_names.forEach(col => {
        tableHtml += `<th>${col}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    
    result.preview.forEach(row => {
        tableHtml += '<tr>';
        result.column_names.forEach(col => {
            const value = row[col];
            const displayValue = value === null || value === undefined ? '<em>null</em>' : String(value);
            tableHtml += `<td>${displayValue}</td>`;
        });
        tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    previewDiv.innerHTML += tableHtml;
    
    // Show modal
    document.getElementById('data-content-modal').style.display = 'block';
}

function closeDataContentModal() {
    document.getElementById('data-content-modal').style.display = 'none';
}

// Models page management
function updateDeployedModelsList() {
    const modelsListDiv = document.getElementById('deployed-models-list');
    
    if (Object.keys(deployedModels).length === 0) {
        modelsListDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-content">
                    <h3>No models deployed yet.</h3>
                    <p>Deploy models from Automated ML training results to see them here.</p>
                </div>
            </div>
        `;
        return;
    }
    
    modelsListDiv.innerHTML = '';
    
    Object.values(deployedModels).forEach(model => {
        const modelDiv = document.createElement('div');
        modelDiv.className = 'deployed-model-item';
        
        // Get model metrics if available from training results
        const jobModels = Object.values(trainedModels).flat();
        const trainingModel = jobModels.find(m => m.name === model.name);
        const metrics = trainingModel ? trainingModel.metrics : {};
        const primaryScore = trainingModel ? trainingModel.primary_score : 'N/A';
        
        // Format deployment time
        const deployTime = model.deployTime ? model.deployTime.toLocaleString() : 'Unknown';
        
        modelDiv.innerHTML = `
            <div class="deployed-model-info">
                <div class="deployed-model-icon">⚙</div>
                <div class="deployed-model-details">
                    <h4>${model.name}</h4>
                    <div class="deployed-model-meta">Deployed: ${deployTime}</div>
                    <div class="deployed-model-meta">File: ${model.filename}</div>
                    <div class="deployed-model-metrics">
                        ${Object.entries(metrics).map(([key, value]) => 
                            `<span class="metric-badge">${key}: ${value}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            <div class="deployed-model-status">
                <span class="model-status-badge">Deployed</span>
                <div class="deployed-model-actions">
                    <button class="model-action-btn" onclick="viewDeployedModelDetails('${model.name}')">View Details</button>
                    <button class="model-action-btn primary" onclick="testDeployedModel('${model.name}')">Test</button>
                </div>
            </div>
        `;
        
        modelsListDiv.appendChild(modelDiv);
    });
}

function viewDeployedModelDetails(modelName) {
    // Find the deployed model and its training data
    const deployedModel = deployedModels[modelName];
    if (!deployedModel) return;
    
    // Find the original training model data
    const jobModels = Object.values(trainedModels).flat();
    const trainingModel = jobModels.find(m => m.name === modelName);
    
    if (trainingModel) {
        // Set the selected model and show details
        selectedModel = { ...trainingModel, jobId: deployedModel.jobId, isDeployed: true };
        showModelDetails(selectedModel);
    } else {
        alert('Model training details not available.');
    }
}

function testDeployedModel(modelName) {
    // Find the deployed model and its training data
    const deployedModel = deployedModels[modelName];
    if (!deployedModel) return;
    
    // Find the original training model data
    const jobModels = Object.values(trainedModels).flat();
    const trainingModel = jobModels.find(m => m.name === modelName);
    
    if (trainingModel) {
        // Set the selected model and show test modal
        selectedModel = { ...trainingModel, jobId: deployedModel.jobId, isDeployed: true };
        testModel();
    } else {
        alert('Model training details not available for testing.');
    }
}

// Modal close on outside click
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateJobsList();
    // Show ML App page by default
    showMyAccountPage();
    // Initialize navigation - hide all except ML App
    initializeNavigation();
    // Initialize PyScript status checking (this might be called twice, but that's safe)
    disableNewJobButton();
    // Update initial status with specific message
    updatePyScriptStatus('Loading PyScript ML libraries (pandas, numpy, scikit-learn)...', false);
    
    // Check for PyScript readiness periodically
    checkPyScriptStatus();
});

// Header validation interface
function showHeaderValidationInterface(columnData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Create preview table
    const previewTable = document.createElement('table');
    previewTable.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 14px;
    `;
    
    // Add rows from raw data
    columnData.rawData.forEach((row, index) => {
        const tr = document.createElement('tr');
        const cells = row.split(','); // Simple split for preview
        
        cells.forEach(cell => {
            const td = document.createElement('td');
            td.style.cssText = `
                border: 1px solid #ddd;
                padding: 4px 8px;
                ${index === 0 ? 'background-color: #f5f5f5; font-weight: bold;' : ''}
            `;
            td.textContent = cell.trim();
            tr.appendChild(td);
        });
        
        previewTable.appendChild(tr);
    });
    
    // Create header input table
    const headerInputTable = document.createElement('table');
    headerInputTable.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
    `;
    
    const headerRow = document.createElement('tr');
    const headerInputRow = document.createElement('tr');
    
    const numColumns = columnData.suggestedHeaders.length;
    for (let i = 0; i < numColumns; i++) {
        // Header cell
        const headerCell = document.createElement('td');
        headerCell.style.cssText = `
            border: 1px solid #ddd;
            padding: 4px;
            background-color: #f0f8ff;
            font-weight: bold;
            text-align: center;
        `;
        headerCell.textContent = `Column ${i + 1}`;
        headerRow.appendChild(headerCell);
        
        // Input cell
        const inputCell = document.createElement('td');
        inputCell.style.cssText = `
            border: 1px solid #ddd;
            padding: 4px;
        `;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = columnData.suggestedHeaders[i];
        input.style.cssText = `
            width: 100%;
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
        `;
        input.id = `header-input-${i}`;
        
        inputCell.appendChild(input);
        headerInputRow.appendChild(inputCell);
    }
    
    headerInputTable.appendChild(headerRow);
    headerInputTable.appendChild(headerInputRow);
    
    dialog.innerHTML = `
        <h3>Column Headers Need Specification</h3>
        <p><strong>Issue:</strong> ${columnData.error}</p>
        <p>Please review the data preview below and specify appropriate column headers:</p>
        <h4>Data Preview:</h4>
    `;
    
    dialog.appendChild(previewTable);
    
    const headerSection = document.createElement('div');
    headerSection.innerHTML = '<h4>Specify Column Headers:</h4>';
    headerSection.appendChild(headerInputTable);
    dialog.appendChild(headerSection);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
        cursor: pointer;
    `;
    cancelButton.onclick = () => {
        document.body.removeChild(modal);
        document.getElementById('data-file').value = '';
    };
    
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Headers';
    applyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        background: #0078d4;
        color: white;
        border-radius: 4px;
        cursor: pointer;
    `;
    applyButton.onclick = () => {
        applyCustomHeaders(columnData, numColumns);
        document.body.removeChild(modal);
    };
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(applyButton);
    dialog.appendChild(buttonContainer);
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
}

function applyCustomHeaders(columnData, numColumns) {
    // Collect new headers
    const newHeaders = [];
    for (let i = 0; i < numColumns; i++) {
        const input = document.getElementById(`header-input-${i}`);
        newHeaders.push(input.value.trim() || `Column_${i + 1}`);
    }
    
    // Reparse the CSV with new headers
    const lines = columnData.rawData;
    const dataLines = lines.slice(1); // Skip original first row
    
    // Create new CSV content with proper headers
    const newCsvContent = [
        newHeaders.join(','),
        ...dataLines
    ].join('\n');
    
    // Parse again with new headers
    parseCSVData(newCsvContent, columnData.filename);
}

// PyScript Initialization System
function notifyPyScriptReady() {
    pyScriptReady = true;
    updatePyScriptStatus('✓ Ready - PyScript ML training available', true);
    enableNewJobButton();
    console.log('PyScript ML libraries loaded successfully - real scikit-learn training available');
}

function updatePyScriptStatus(message, isReady) {
    // Update global status indicator with subtle approach
    const globalStatus = document.getElementById('global-pyscript-status');
    if (globalStatus) {
        if (isReady) {
            // Hide the entire status indicator when ready
            globalStatus.style.display = 'none';
        } else {
            // Show subtle loading with spinner
            globalStatus.style.display = 'flex';
            globalStatus.className = 'status-loading';
            // Update the text while keeping the spinner
            const textSpan = globalStatus.querySelector('span');
            if (textSpan) {
                textSpan.textContent = message;
            }
        }
    }
    
    // Update any remaining pyscript-status elements (though we removed them from wizard)
    const statusElements = document.querySelectorAll('.pyscript-status');
    statusElements.forEach(element => {
        if (isReady) {
            element.style.display = 'none';
        } else {
            element.innerHTML = `<small>⏳ ${message}</small>`;
            element.style.display = 'block';
        }
    });
}

function enableNewJobButton() {
    const newJobButton = document.querySelector('button[onclick="openNewJobWizard()"]');
    if (newJobButton) {
        newJobButton.disabled = false;
        newJobButton.title = 'Start a new Automated ML training job';
    }
}

function disableNewJobButton() {
    const newJobButton = document.querySelector('button[onclick="openNewJobWizard()"]');
    if (newJobButton) {
        newJobButton.disabled = true;
        newJobButton.title = 'Please wait for libraries to load...';
    }
}

// Handle training completion from PyScript
function handleTrainingComplete(resultsJson) {
    console.log('Received training results:', typeof resultsJson, resultsJson);
    
    try {
        // Check if it's already an object or needs parsing
        let results;
        if (typeof resultsJson === 'string') {
            results = JSON.parse(resultsJson);
        } else if (typeof resultsJson === 'object' && resultsJson !== null) {
            results = resultsJson;
        } else {
            throw new Error(`Unexpected data type: ${typeof resultsJson}`);
        }
        
        if (results.success) {
            console.log('Training completed successfully:', results.results);
            
            // Store results
            trainedModels[results.job_id] = results.results;
            
            // Update job status
            const job = jobHistory.find(j => j.id === results.job_id);
            if (job) {
                job.status = 'Completed';
                job.models = results.results;
                updateJobsList();
            }
            
            // Complete the training process
            completeTraining(results.results, results.job_id);
            
        } else {
            console.error('Training failed:', results.error);
            alert(`Training failed: ${results.error}`);
            
            // Update job status to failed
            const job = jobHistory.find(j => j.id === results.job_id);
            if (job) {
                job.status = 'Failed';
                job.error = results.error;
                updateJobsList();
            }
        }
    } catch (error) {
        console.error('Error handling training results:', error);
        alert(`Error processing training results: ${error.message}`);
    }
}

// Job Details Page Functions
let currentJobDetails = null;

function showJobDetails(job) {
    currentJobDetails = job;
    
    // Hide all other pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show job details page
    document.getElementById('job-details-page').style.display = 'block';
    
    // Update job details content
    updateJobDetailsContent(job);
    
    // Show overview tab by default
    showJobTab('overview');
}

function updateJobDetailsContent(job) {
    try {
        // Update header information
        document.getElementById('job-details-title').textContent = job.name;
        
        // Update status badge
        const statusBadge = document.getElementById('job-status-badge');
        const statusText = document.getElementById('job-status-text');
        statusText.textContent = job.status.charAt(0).toUpperCase() + job.status.slice(1);
        
        // Update status badge classes
        statusBadge.className = `job-status-badge ${job.status}`;
        
        // Update properties section
        document.getElementById('properties-status').innerHTML = `
            <span class="status-icon">●</span>
            <span>${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
        `;
        
        const createdDate = job.startTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('properties-created-on').textContent = createdDate;
        document.getElementById('properties-start-time').textContent = createdDate;
        document.getElementById('properties-name').textContent = job.name;
    
    // Update inputs section - get dataset name (prefer custom name over filename)
    let datasetName = 'training_data.csv';
    
    // Try to get dataset name from various sources, prioritizing custom names
    if (typeof selectedDataset !== 'undefined' && selectedDataset) {
        // Use custom name if available, otherwise use filename
        datasetName = selectedDataset.customName || selectedDataset.name || selectedDataset.filename;
    } else if (typeof currentData !== 'undefined' && currentData) {
        // Use custom name if available, otherwise use name or filename
        datasetName = currentData.customName || currentData.name || currentData.filename;
    } else if (typeof uploadedDataFiles !== 'undefined' && uploadedDataFiles && uploadedDataFiles.length > 0) {
        // Get the most recently uploaded file and use its custom name
        const lastFile = uploadedDataFiles[uploadedDataFiles.length - 1];
        if (lastFile) {
            datasetName = lastFile.customName || lastFile.name || lastFile.filename;
        }
    }
    
    // Safely update input data asset element
    const inputDataAssetElement = document.getElementById('input-data-asset');
    if (inputDataAssetElement) {
        inputDataAssetElement.textContent = datasetName;
    } else {
        console.warn('input-data-asset element not found');
    }
    
    // Update run summary
    const summaryTaskTypeElement = document.getElementById('summary-task-type');
    if (summaryTaskTypeElement) {
        summaryTaskTypeElement.textContent = job.taskType.charAt(0).toUpperCase() + job.taskType.slice(1);
    } else {
        console.warn('summary-task-type element not found');
    }
    
    // Update primary metric - use the actual stored value
    const primaryMetric = job.primaryMetric;
    const primaryMetricDisplay = getMetricDisplayName(primaryMetric, job.taskType);
    const primaryMetricElement = document.getElementById('summary-primary-metric');
    if (primaryMetricElement) {
        primaryMetricElement.textContent = primaryMetricDisplay;
    } else {
        console.warn('summary-primary-metric element not found');
    }
    
    // Update featurization based on user's settings
    let featurizationText = 'Auto';
    if (job.normalizeFeatures || job.missingDataStrategy !== 'remove' || 
        (job.categoricalSettings && Object.keys(job.categoricalSettings).length > 0)) {
        featurizationText = 'Custom';
    }
    const featurizationElement = document.getElementById('summary-featurization');
    if (featurizationElement) {
        featurizationElement.textContent = featurizationText;
    } else {
        console.warn('summary-featurization element not found');
    }
    
    // Update best model section if training is complete
    updateBestModelSection(job);
    
    // Add training progress section if job is running
    if (job.status === 'running') {
        addTrainingProgressSection();
    }
    
    } catch (error) {
        console.error('Error updating job details content:', error);
        console.error('Job object:', job);
    }
}

function updateBestModelSection(job) {
    const bestModelContent = document.getElementById('best-model-content');
    
    if (job.status === 'completed' && job.models && job.models.length > 0) {
        const bestModel = job.models.find(m => m.is_best);
        if (bestModel) {
            // Get the proper display name for the primary metric
            const primaryMetricDisplay = getMetricDisplayName(job.primaryMetric, job.taskType);
            
            console.log('🔍 DEBUG: Best model display values:');
            console.log('  - Primary metric:', job.primaryMetric);
            console.log('  - Primary metric display name:', primaryMetricDisplay);
            console.log('  - Best model name:', bestModel.name);
            console.log('  - Best model primary_score:', bestModel.primary_score);
            console.log('  - Best model metrics:', bestModel.metrics);
            console.log('  - Direct metric value:', bestModel.metrics[job.primaryMetric]);
            
            bestModelContent.innerHTML = `
                <div class="best-model-display">
                    <div class="best-model-header">
                        <span class="best-model-badge">Best Model</span>
                    </div>
                    <div class="best-model-algorithm">Algorithm name: ${bestModel.name}</div>
                    <div class="best-model-score">${bestModel.primary_score.toFixed(4)}</div>
                    <div class="best-model-metric">Primary metric: ${primaryMetricDisplay}</div>
                </div>
            `;
        }
    } else {
        bestModelContent.innerHTML = `
            <div class="no-data-message">
                <span class="no-data-icon">ℹ</span>
                <span>No data</span>
            </div>
        `;
    }
}

function addTrainingProgressSection() {
    const overviewTab = document.getElementById('overview-tab');
    let progressSection = document.getElementById('training-progress-section');
    
    if (!progressSection) {
        progressSection = document.createElement('div');
        progressSection.id = 'training-progress-section';
        progressSection.className = 'training-progress-section';
        progressSection.innerHTML = `
            <h4>Training Progress</h4>
            <div id="training-progress-content">
                <div class="progress-item info">🔄 Preparing data and starting model training...</div>
            </div>
        `;
        overviewTab.appendChild(progressSection);
    }
}

function updateJobTrainingProgress(progressHtml) {
    const progressContent = document.getElementById('training-progress-content');
    if (progressContent) {
        progressContent.innerHTML += progressHtml;
    }
}

function showJobTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
        selectedPanel.classList.add('active');
    }
    
    // Add active class to selected tab button
    const selectedButton = document.querySelector(`[onclick="showJobTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Update models tab content if showing models
    if (tabName === 'models' && currentJobDetails) {
        updateModelsTabContent();
    }
}

function updateModelsTabContent() {
    const modelsResults = document.getElementById('job-model-results');
    
    if (currentJobDetails.status === 'completed' && currentJobDetails.models && currentJobDetails.models.length > 0) {
        // Get the primary metric name for the column header
        const primaryMetric = currentJobDetails.primaryMetric || 'auc';
        const primaryMetricDisplayName = getMetricDisplayName(primaryMetric, currentJobDetails.taskType);
        
        // Create table structure
        modelsResults.innerHTML = `
            <div class="models-table-container">
                <table class="models-table">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>${primaryMetricDisplayName}</th>
                            <th>Created on</th>
                        </tr>
                    </thead>
                    <tbody id="models-table-body">
                    </tbody>
                </table>
            </div>
        `;
        
        const tableBody = document.getElementById('models-table-body');
        
        currentJobDetails.models.forEach(model => {
            const row = document.createElement('tr');
            row.className = model.is_best ? 'best-model-row' : '';
            
            // Get the primary metric value
            const primaryMetricValue = model.primary_score || model.metrics[primaryMetric] || 'N/A';
            const formattedValue = typeof primaryMetricValue === 'number' ? primaryMetricValue.toFixed(4) : primaryMetricValue;
            
            // Format the created date
            let createdDate = 'N/A';
            console.log('Model data for', model.name, ':', model); // Debug log
            console.log('Created at value:', model.created_at); // Debug log
            
            if (model.created_at) {
                try {
                    const date = new Date(model.created_at);
                    console.log('Parsed date:', date); // Debug log
                    createdDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                } catch (e) {
                    console.error('Error parsing date:', e); // Debug log
                    createdDate = 'N/A';
                }
            } else {
                console.log('No created_at field found for model:', model.name); // Debug log
            }
            
            row.innerHTML = `
                <td class="algorithm-cell">
                    <span class="algorithm-name">${model.display_name || model.name}</span>
                    ${model.is_best ? '<span class="best-model-badge">Best Model</span>' : ''}
                </td>
                <td class="metric-cell">${formattedValue}</td>
                <td class="created-cell">${createdDate}</td>
            `;
            
            tableBody.appendChild(row);
        });
    } else if (currentJobDetails.status === 'running') {
        modelsResults.innerHTML = '<div class="no-data-message"><span class="no-data-icon">⏳</span><span>Training in progress...</span></div>';
    } else {
        modelsResults.innerHTML = '<div class="no-data-message"><span class="no-data-icon">ℹ</span><span>No models available</span></div>';
    }
}

function navigateToAutoML() {
    // Hide job details page
    document.getElementById('job-details-page').style.display = 'none';
    
    // Show automl page using the standard navigation function
    showAutoMLPage();
}

// Job action functions (placeholder implementations)
function refreshJob() {
    // Do nothing - refresh functionality disabled
}

function editAndResubmit() {
    alert('Edit and resubmit functionality will be implemented in a future version.');
}

function registerModel() {
    if (currentJobDetails && currentJobDetails.status === 'completed') {
        const bestModel = currentJobDetails.models?.find(m => m.is_best);
        if (bestModel) {
            alert(`Model "${bestModel.name}" registration will be implemented in a future version.`);
        } else {
            alert('No best model found to register.');
        }
    } else {
        alert('Job must be completed to register a model.');
    }
}

function cancelJob() {
    if (currentJobDetails && currentJobDetails.status === 'running') {
        alert('Job cancellation will be implemented in a future version.');
    } else {
        alert('Only running jobs can be cancelled.');
    }
}

function deleteJob() {
    if (currentJobDetails) {
        const confirmDelete = confirm(`Are you sure you want to delete job "${currentJobDetails.name}"?`);
        if (confirmDelete) {
            alert('Job deletion will be implemented in a future version.');
        }
    }
}

function compareModels() {
    if (currentJobDetails && currentJobDetails.models && currentJobDetails.models.length > 1) {
        alert('Model comparison will be implemented in a future version.');
    } else {
        alert('Need at least 2 models to compare.');
    }
}

function viewConfigSettings() {
    if (currentJobDetails) {
        showConfigSettingsModal();
    }
}

function showConfigSettingsModal() {
    const flyout = document.getElementById('config-settings-flyout');
    const overlay = document.getElementById('flyout-overlay');
    const content = document.getElementById('config-settings-content');
    
    if (flyout && overlay && content && currentJobDetails) {
        // Get configuration from the job details directly (not from a nested config object)
        
        content.innerHTML = `
            <div class="config-section">
                <h4>Job Information</h4>
                <div class="config-item">
                    <label>Job Name:</label>
                    <span>${currentJobDetails.name || 'N/A'}</span>
                </div>
                <div class="config-item">
                    <label>Task Type:</label>
                    <span>${currentJobDetails.taskType || 'N/A'}</span>
                </div>
                <div class="config-item">
                    <label>Target Column:</label>
                    <span>${currentJobDetails.targetColumn || 'N/A'}</span>
                </div>
            </div>
            
            <div class="config-section">
                <h4>Training Configuration</h4>
                <div class="config-item">
                    <label>Primary Metric:</label>
                    <span>${currentJobDetails.primaryMetric || 'auc'}</span>
                </div>
                <div class="config-item">
                    <label>Algorithms:</label>
                    <span>${currentJobDetails.algorithms ? currentJobDetails.algorithms.join(', ') : 'logistic_regression, decision_tree, random_forest'}</span>
                </div>
            </div>
            
            <div class="config-section">
                <h4>Featurization Settings</h4>
                <div class="config-item">
                    <label>Normalize Features:</label>
                    <span>${currentJobDetails.normalizeFeatures ? 'Yes' : 'No'}</span>
                </div>
                <div class="config-item">
                    <label>Missing Data Strategy:</label>
                    <span>${currentJobDetails.missingDataStrategy === 'remove' ? 'Remove rows with missing values' : 'Fill missing values (mean for numeric, most frequent for categorical)'}</span>
                </div>
                ${currentJobDetails.categoricalSettings && Object.keys(currentJobDetails.categoricalSettings).length > 0 ? `
                <div class="config-item">
                    <label>Categorical Column Settings:</label>
                    <div class="categorical-settings">
                        ${Object.entries(currentJobDetails.categoricalSettings).map(([column, action]) => 
                            `<div class="categorical-item">${column}: ${action}</div>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Show overlay and flyout
        overlay.classList.add('show');
        flyout.classList.add('open');
    }
}

function closeConfigSettingsModal() {
    const flyout = document.getElementById('config-settings-flyout');
    const overlay = document.getElementById('flyout-overlay');
    
    if (flyout && overlay) {
        flyout.classList.remove('open');
        overlay.classList.remove('show');
    }
}

function closeAllFlyouts() {
    // Close all flyouts and the overlay
    const flyouts = ['config-settings-flyout', 'config-flyout', 'featurization-flyout'];
    const overlay = document.getElementById('flyout-overlay');
    
    flyouts.forEach(flyoutId => {
        const flyout = document.getElementById(flyoutId);
        if (flyout) {
            flyout.classList.remove('open');
        }
    });
    
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// Close flyout when clicking outside of it (handled by overlay click)
// No need for window click listener since we have the overlay

// Close flyout when pressing Escape
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const overlay = document.getElementById('flyout-overlay');
        if (overlay && overlay.classList.contains('show')) {
            closeAllFlyouts();
        }
    }
});

// Update metric threshold input constraints based on selected primary metric
function updateMetricThresholdConstraints(primaryMetric) {
    const metricThresholdInput = document.getElementById('metric-threshold');
    if (!metricThresholdInput) return;
    
    // Define valid ranges for different metrics
    const metricRanges = {
        // Classification metrics (0-1 range, higher is better)
        'auc': { min: 0, max: 1, placeholder: 'e.g., 0.85' },
        'accuracy': { min: 0, max: 1, placeholder: 'e.g., 0.90' },
        'precision': { min: 0, max: 1, placeholder: 'e.g., 0.85' },
        'recall': { min: 0, max: 1, placeholder: 'e.g., 0.80' },
        'f1': { min: 0, max: 1, placeholder: 'e.g., 0.85' },
        // Regression metrics (lower is better)
        'mae': { min: 0, max: null, placeholder: 'e.g., 5.0' },
        'rmse': { min: 0, max: null, placeholder: 'e.g., 10.0' },
        'r2': { min: null, max: 1, placeholder: 'e.g., 0.95' }
    };
    
    const range = metricRanges[primaryMetric];
    if (range) {
        metricThresholdInput.min = range.min !== null ? range.min : '';
        metricThresholdInput.max = range.max !== null ? range.max : '';
        metricThresholdInput.placeholder = range.placeholder;
        
        // Clear any existing value that might be out of range
        const currentValue = parseFloat(metricThresholdInput.value);
        if (metricThresholdInput.value && !isNaN(currentValue)) {
            if ((range.min !== null && currentValue < range.min) || 
                (range.max !== null && currentValue > range.max)) {
                metricThresholdInput.value = '';
            }
        }
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.select();
        element.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(element.value).then(() => {
            // Could show a toast notification here
            console.log('Copied to clipboard:', element.value);
        });
    }
}

// Expandable section toggle function
function toggleLimitsSection() {
    const content = document.getElementById('limits-content');
    const header = event.target.closest('.expandable-header');
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        header.classList.remove('expanded');
    } else {
        content.classList.add('show');
        header.classList.add('expanded');
    }
}

// Make functions available globally for PyScript
window.handleParsedData = handleParsedData;
window.handleTrainingComplete = handleTrainingComplete;
window.updateTrainingProgress = updateTrainingProgress;
window.completeTraining = completeTraining;
window.modelDeploymentComplete = modelDeploymentComplete;
window.modelDeploymentError = modelDeploymentError;
window.showTestModelModal = showTestModelModal;
window.showPredictionResult = showPredictionResult;
window.showPredictionError = showPredictionError;
window.displayDataFileContent = displayDataFileContent;
window.notifyPyScriptReady = notifyPyScriptReady;