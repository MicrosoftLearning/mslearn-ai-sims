// Home Rental Prediction App
class RentPredictor {
    constructor() {
        this.data = [];
        this.trainData = [];
        this.testData = [];
        this.model = null;
        this.metrics = {};
        this.postalCodes = ['12345', '23456', '34567', '45678', '56789'];
        this.isSampleDataVisible = false;
        this.init();
    }

    async init() {
        console.log('Initializing RentPredictor...');
        
        // Show loading message
        this.showLoadingMessage();
        
        await this.loadData();
        
        // Train model regardless of whether data came from CSV or fallback
        if (this.data.length > 0) {
            this.prepareData();
            this.trainModel();
            console.log('Model trained successfully');
            this.setupUI();
            this.enableUI();
            console.log('UI setup complete and enabled');
        } else {
            console.error('No data available for training - both CSV and fallback failed');
            this.showErrorMessage('Unable to load data for model training. Please refresh the page to try again.');
        }
    }

    async loadData() {
        try {
            console.log('Attempting to load data from CSV file...');
            const response = await fetch('data.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            this.parseCSV(csvText);
            console.log('Data loaded successfully from CSV:', this.data.length, 'records');
        } catch (error) {
            console.error('Error loading CSV data:', error);
            console.log('Falling back to embedded data...');
            // Fallback to embedded data if CSV fails to load
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        // Embedded sample data as fallback
        const csvData = `property_id,address,postal_code,size,bedrooms,rent_amount
1,123 Oak Street,12345,1200,2,1680
2,456 Pine Avenue,23456,1800,3,2590
3,789 Maple Drive,34567,950,1,1520
4,321 Elm Boulevard,45678,2200,4,3240
5,654 Cedar Lane,56789,1450,2,2030
6,987 Birch Road,12345,3200,5,4180
7,147 Spruce Court,23456,1050,1,1590
8,258 Willow Street,34567,2800,4,4100
9,369 Aspen Way,45678,1600,3,2320
10,741 Poplar Circle,56789,2400,3,3360
11,852 Hickory Drive,12345,1100,1,1550
12,963 Walnut Avenue,23456,2600,4,3730
13,159 Chestnut Road,34567,1350,2,2040
14,267 Sycamore Lane,45678,1950,3,2820
15,378 Cottonwood Street,56789,2100,3,2940
16,486 Magnolia Court,12345,1750,3,2450
17,597 Dogwood Way,23456,1400,2,2010
18,615 Redwood Circle,34567,3000,4,4380
19,728 Sequoia Drive,45678,1250,2,1810
20,839 Fir Avenue,56789,2700,4,3780
21,941 Juniper Road,12345,1150,1,1620
22,162 Cypress Lane,23456,2300,3,3300
23,273 Pine Street,34567,1550,2,2340
24,384 Oak Court,45678,2950,5,4280
25,495 Maple Way,56789,1850,3,2590
26,516 Elm Circle,12345,2050,3,2870
27,627 Cedar Drive,23456,1300,2,1870
28,738 Birch Avenue,34567,2450,4,3590
29,849 Spruce Road,45678,1700,3,2460
30,951 Willow Lane,56789,3100,5,4340
31,172 Aspen Street,12345,1000,1,1420
32,283 Poplar Court,23456,2150,3,3080
33,394 Hickory Way,34567,1650,2,2490
34,415 Walnut Circle,45678,2750,4,3970
35,526 Chestnut Drive,56789,1900,3,2660
36,637 Sycamore Avenue,12345,2350,4,3280
37,748 Cottonwood Road,23456,1200,2,1720
38,859 Magnolia Lane,34567,2600,4,3800
39,961 Dogwood Street,45678,1500,2,2170
40,182 Redwood Court,56789,2900,4,4060
41,293 Sequoia Way,12345,1350,2,1890
42,314 Fir Circle,23456,2000,3,2860
43,425 Juniper Drive,34567,1750,3,2640
44,536 Cypress Avenue,45678,3200,5,4640
45,647 Pine Road,56789,1600,2,2240
46,758 Oak Lane,12345,2500,4,3490
47,869 Maple Street,23456,1450,2,2080
48,971 Elm Court,34567,2800,4,4100
49,192 Cedar Way,45678,1150,1,1670
50,213 Birch Circle,56789,2200,3,3080`;
        
        this.parseCSV(csvData);
        console.log('Fallback data loaded:', this.data.length, 'records');
    }

    showLoadingMessage() {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="text-align: center; color: #667eea;">
                    <h3>🤖 Training Model...</h3>
                    <p>Please wait while we prepare the rent prediction system</p>
                    <div style="margin: 20px 0;">
                        <div style="display: inline-block; width: 40px; height: 4px; background: #667eea; border-radius: 2px; animation: loading 1.5s ease-in-out infinite;"></div>
                    </div>
                </div>
                <style>
                    @keyframes loading {
                        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                        40% { transform: scale(1); opacity: 1; }
                    }
                </style>
            `;
        }
        
        // Disable all interactive elements initially
        this.disableUI();
    }

    showErrorMessage(message) {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="text-align: center; color: #e53e3e;">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                    <p style="font-size: 0.9em; margin-top: 15px;">Please refresh the page to try again.</p>
                </div>
            `;
        }
    }

    disableUI() {
        // Disable form elements
        const postalSelect = document.getElementById('postalCode');
        const sizeSlider = document.getElementById('size');
        const calculateBtn = document.getElementById('calculateBtn');
        const sampleDataBtn = document.getElementById('sampleDataBtn');
        const modelDetailsBtn = document.getElementById('modelDetailsBtn');

        if (postalSelect) postalSelect.disabled = true;
        if (sizeSlider) sizeSlider.disabled = true;
        if (calculateBtn) {
            calculateBtn.disabled = true;
            calculateBtn.style.opacity = '0.5';
            calculateBtn.style.cursor = 'not-allowed';
        }
        if (sampleDataBtn) {
            sampleDataBtn.disabled = true;
            sampleDataBtn.style.opacity = '0.5';
            sampleDataBtn.style.cursor = 'not-allowed';
        }
        if (modelDetailsBtn) {
            modelDetailsBtn.disabled = true;
            modelDetailsBtn.style.opacity = '0.5';
            modelDetailsBtn.style.cursor = 'not-allowed';
        }

        // Disable bedroom radio buttons
        const bedroomRadios = document.querySelectorAll('input[name="bedrooms"]');
        bedroomRadios.forEach(radio => {
            radio.disabled = true;
        });
    }

    enableUI() {
        // Enable form elements
        const postalSelect = document.getElementById('postalCode');
        const sizeSlider = document.getElementById('size');
        const calculateBtn = document.getElementById('calculateBtn');
        const sampleDataBtn = document.getElementById('sampleDataBtn');
        const modelDetailsBtn = document.getElementById('modelDetailsBtn');

        if (postalSelect) postalSelect.disabled = false;
        if (sizeSlider) sizeSlider.disabled = false;
        if (calculateBtn) {
            calculateBtn.disabled = false;
            calculateBtn.style.opacity = '1';
            calculateBtn.style.cursor = 'pointer';
        }
        if (sampleDataBtn) {
            sampleDataBtn.disabled = false;
            sampleDataBtn.style.opacity = '1';
            sampleDataBtn.style.cursor = 'pointer';
        }
        if (modelDetailsBtn) {
            modelDetailsBtn.disabled = false;
            modelDetailsBtn.style.opacity = '1';
            modelDetailsBtn.style.cursor = 'pointer';
        }

        // Enable bedroom radio buttons
        const bedroomRadios = document.querySelectorAll('input[name="bedrooms"]');
        bedroomRadios.forEach(radio => {
            radio.disabled = false;
        });

        // Clear loading message and show ready status
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="text-align: center; color: #48bb78;">
                    <h3>✅ Model Ready</h3>
                    <p>Select your property details above and click "Calculate Rent" to get a prediction</p>
                </div>
            `;
        }

        console.log('UI enabled - model is ready for predictions');
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const record = {};
            
            headers.forEach((header, index) => {
                const value = values[index];
                if (header === 'property_id' || header === 'size' || header === 'bedrooms' || header === 'rent_amount') {
                    record[header] = parseFloat(value);
                } else {
                    record[header] = value;
                }
            });
            
            this.data.push(record);
        }
    }

    prepareData() {
        // Shuffle data
        const shuffled = [...this.data].sort(() => 0.5 - Math.random());
        
        // Split into training (70%) and testing (30%)
        const splitIndex = Math.floor(shuffled.length * 0.7);
        this.trainData = shuffled.slice(0, splitIndex);
        this.testData = shuffled.slice(splitIndex);
    }

    trainModel() {
        // Prepare training data with features
        const X = this.trainData.map(record => this.extractFeatures(record));
        const y = this.trainData.map(record => record.rent_amount);
        
        // Simple multiple linear regression using normal equation
        const XMatrix = this.addBiasColumn(X);
        const XTranspose = this.transpose(XMatrix);
        const XTX = this.multiply(XTranspose, XMatrix);
        const XTXInverse = this.inverse(XTX);
        const XTy = this.multiplyVector(XTranspose, y);
        
        this.model = this.multiplyVector(XTXInverse, XTy);
        
        // Calculate metrics on test data
        this.calculateMetrics();
    }

    extractFeatures(record) {
        // Convert postal code to numerical feature
        const postalCodeIndex = this.postalCodes.indexOf(record.postal_code);
        return [
            record.size,
            record.bedrooms,
            postalCodeIndex
        ];
    }

    addBiasColumn(X) {
        return X.map(row => [1, ...row]);
    }

    transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    multiply(A, B) {
        const result = [];
        for (let i = 0; i < A.length; i++) {
            result[i] = [];
            for (let j = 0; j < B[0].length; j++) {
                result[i][j] = 0;
                for (let k = 0; k < B.length; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    }

    multiplyVector(matrix, vector) {
        return matrix.map(row => 
            row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
        );
    }

    inverse(matrix) {
        const n = matrix.length;
        const identity = Array(n).fill().map((_, i) => 
            Array(n).fill().map((_, j) => i === j ? 1 : 0)
        );
        
        const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
        
        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            // Make diagonal element 1
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        return augmented.map(row => row.slice(n));
    }

    predict(size, bedrooms, postalCode) {
        const postalCodeIndex = this.postalCodes.indexOf(postalCode);
        const features = [1, size, bedrooms, postalCodeIndex];
        
        return features.reduce((sum, feature, idx) => sum + feature * this.model[idx], 0);
    }

    calculateMetrics() {
        const predictions = this.testData.map(record => {
            const features = this.extractFeatures(record);
            return this.predict(features[0], features[1], this.postalCodes[features[2]]);
        });
        
        const actual = this.testData.map(record => record.rent_amount);
        
        // Mean Absolute Error
        const mae = predictions.reduce((sum, pred, idx) => 
            sum + Math.abs(pred - actual[idx]), 0) / predictions.length;
        
        // Mean Squared Error
        const mse = predictions.reduce((sum, pred, idx) => 
            sum + Math.pow(pred - actual[idx], 2), 0) / predictions.length;
        
        // Root Mean Squared Error
        const rmse = Math.sqrt(mse);
        
        // R-squared (coefficient of determination)
        const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
        const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0);
        const residualSumSquares = predictions.reduce((sum, pred, idx) => 
            sum + Math.pow(actual[idx] - pred, 2), 0);
        const r2 = 1 - (residualSumSquares / totalSumSquares);
        
        this.metrics = { mae, mse, rmse, r2 };
    }

    setupUI() {
        console.log('Setting up UI elements...');
        
        // Set up postal code dropdown
        const postalSelect = document.getElementById('postalCode');
        if (postalSelect) {
            this.postalCodes.forEach(code => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code;
                postalSelect.appendChild(option);
            });
            console.log('Postal codes added to dropdown');
        } else {
            console.error('Postal code dropdown not found');
        }

        // Set up bedroom radio buttons
        const bedroomContainer = document.getElementById('bedroomOptions');
        if (bedroomContainer) {
            for (let i = 0; i <= 5; i++) {
                const label = document.createElement('label');
                const bedroomText = i === 0 ? 'Studio (0 bedrooms)' : i === 1 ? '1 bedroom' : `${i} bedrooms`;
                label.innerHTML = `
                    <input type="radio" name="bedrooms" value="${i}" ${i === 1 ? 'checked' : ''} disabled
                           aria-describedby="bedroom-help" aria-label="${bedroomText}">
                    <span aria-hidden="true">${i}</span>
                `;
                bedroomContainer.appendChild(label);
            }
            console.log('Bedroom radio buttons created (initially disabled)');
        } else {
            console.error('Bedroom options container not found');
        }

        // Set up event listeners
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateRent());
            console.log('Calculate button event listener added');
        }

        const sampleDataBtn = document.getElementById('sampleDataBtn');
        if (sampleDataBtn) {
            sampleDataBtn.addEventListener('click', () => this.showSampleData());
            console.log('Sample data button event listener added');
        }

        const modelDetailsBtn = document.getElementById('modelDetailsBtn');
        if (modelDetailsBtn) {
            modelDetailsBtn.addEventListener('click', () => this.showModelDetails());
            console.log('Model details button event listener added');
        }

        // Update size display
        const sizeSlider = document.getElementById('size');
        const sizeDisplay = document.getElementById('sizeDisplay');
        if (sizeSlider && sizeDisplay) {
            sizeSlider.addEventListener('input', () => {
                const value = sizeSlider.value;
                sizeDisplay.textContent = value;
                sizeSlider.setAttribute('aria-valuenow', value);
                sizeSlider.setAttribute('aria-valuetext', `${value} square feet`);
            });
            // Initialize display
            const initialValue = sizeSlider.value;
            sizeDisplay.textContent = initialValue;
            sizeSlider.setAttribute('aria-valuenow', initialValue);
            sizeSlider.setAttribute('aria-valuetext', `${initialValue} square feet`);
            console.log('Size slider initialized (initially disabled)');
        }

        console.log('UI elements created but disabled until model training completes');
    }

    calculateRent() {
        console.log('Calculating rent...');
        
        try {
            // Check if model is ready
            if (!this.model || this.model.length === 0) {
                alert('Model is not ready yet. Please wait for training to complete.');
                return;
            }
            
            const postalCodeSelect = document.getElementById('postalCode');
            const sizeSlider = document.getElementById('size');
            const bedroomRadio = document.querySelector('input[name="bedrooms"]:checked');
            
            if (!postalCodeSelect || !sizeSlider || !bedroomRadio) {
                throw new Error('Missing form elements');
            }
            
            const postalCode = postalCodeSelect.value;
            const size = parseInt(sizeSlider.value);
            const bedrooms = parseInt(bedroomRadio.value);
            
            if (!postalCode) {
                alert('Please select a postal code');
                return;
            }
            
            console.log(`Calculating for: ${postalCode}, ${size} sq ft, ${bedrooms} bedrooms`);
            
            const predictedRent = this.predict(size, bedrooms, postalCode);
            const rentAmount = Math.round(predictedRent);
            
            document.getElementById('result').innerHTML = `
                <h3>Predicted Monthly Rent</h3>
                <div class="rent-amount" aria-label="Predicted monthly rent: $${rentAmount.toLocaleString()} dollars">$${rentAmount.toLocaleString()}</div>
            `;
            
            console.log('Rent calculated:', predictedRent);
        } catch (error) {
            console.error('Error calculating rent:', error);
            document.getElementById('result').innerHTML = `
                <h3>Error</h3>
                <p>Unable to calculate rent. Please try again.</p>
            `;
        }
    }

    showSampleData() {
        const sampleDataBtn = document.getElementById('sampleDataBtn');
        const sampleDataDiv = document.getElementById('sampleData');
        
        // Toggle visibility
        if (this.isSampleDataVisible) {
            // Hide the data
            console.log('Hiding sample data...');
            sampleDataDiv.innerHTML = '';
            sampleDataBtn.textContent = 'Show Sample Data';
            sampleDataBtn.setAttribute('aria-describedby', 'sample-help');
            this.isSampleDataVisible = false;
            console.log('Sample data hidden');
        } else {
            // Show the data
            console.log('Showing sample data...');
            
            try {
                if (!this.data || this.data.length === 0) {
                    sampleDataDiv.innerHTML = `
                        <h3>Sample Data</h3>
                        <p>No data available to display. Model may still be training.</p>
                    `;
                    return;
                }
                
                const sampleSize = Math.min(10, this.data.length);
                const randomSample = [];
                const usedIndices = new Set();
                
                while (randomSample.length < sampleSize) {
                    const randomIndex = Math.floor(Math.random() * this.data.length);
                    if (!usedIndices.has(randomIndex)) {
                        usedIndices.add(randomIndex);
                        randomSample.push(this.data[randomIndex]);
                    }
                }

                let tableHTML = `
                    <h3>Sample Data</h3>
                    <table role="table" aria-label="Sample rental property data">
                        <thead>
                            <tr>
                                <th scope="col" aria-label="Property address">Address</th>
                                <th scope="col" aria-label="Postal code area">Postal Code</th>
                                <th scope="col" aria-label="Property size in square feet">Size (sq ft)</th>
                                <th scope="col" aria-label="Number of bedrooms">Bedrooms</th>
                                <th scope="col" aria-label="Monthly rent amount">Rent</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                randomSample.forEach(record => {
                    tableHTML += `
                        <tr>
                            <td aria-label="Address: ${record.address}">${record.address}</td>
                            <td aria-label="Postal code: ${record.postal_code}">${record.postal_code}</td>
                            <td aria-label="Size: ${record.size} square feet">${record.size}</td>
                            <td aria-label="Bedrooms: ${record.bedrooms}">${record.bedrooms}</td>
                            <td aria-label="Monthly rent: $${record.rent_amount.toLocaleString()}">$${record.rent_amount.toLocaleString()}</td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                sampleDataDiv.innerHTML = tableHTML;
                sampleDataBtn.textContent = 'Hide Sample Data';
                sampleDataBtn.setAttribute('aria-describedby', 'sample-help-hide');
                this.isSampleDataVisible = true;
                console.log('Sample data displayed');
            } catch (error) {
                console.error('Error showing sample data:', error);
                sampleDataDiv.innerHTML = `
                    <h3>Sample Data</h3>
                    <p>Error loading sample data.</p>
                `;
            }
        }
    }

    showModelDetails() {
        console.log('Showing model details...');
        
        try {
            const modal = document.getElementById('modelModal');
            const modalContent = document.getElementById('modalContent');
            
            if (!modal || !modalContent) {
                console.error('Modal elements not found');
                return;
            }
            
            let metricsHTML = '';
            if (this.metrics && Object.keys(this.metrics).length > 0) {
                metricsHTML = `
                    <section aria-labelledby="metrics-heading">
                        <h3 id="metrics-heading">Model Performance Metrics</h3>
                        <div class="metrics" role="list" aria-label="Performance metrics">
                            <div class="metric" role="listitem">
                                <span class="metric-label">Mean Absolute Error:</span>
                                <span class="metric-value" aria-label="Mean absolute error: $${Math.round(this.metrics.mae).toLocaleString()}">$${Math.round(this.metrics.mae).toLocaleString()}</span>
                            </div>
                            <div class="metric" role="listitem">
                                <span class="metric-label">Mean Squared Error:</span>
                                <span class="metric-value" aria-label="Mean squared error: ${Math.round(this.metrics.mse).toLocaleString()}">${Math.round(this.metrics.mse).toLocaleString()}</span>
                            </div>
                            <div class="metric" role="listitem">
                                <span class="metric-label">Root Mean Squared Error:</span>
                                <span class="metric-value" aria-label="Root mean squared error: $${Math.round(this.metrics.rmse).toLocaleString()}">$${Math.round(this.metrics.rmse).toLocaleString()}</span>
                            </div>
                            <div class="metric" role="listitem">
                                <span class="metric-label">R-squared (R²):</span>
                                <span class="metric-value" aria-label="R-squared coefficient: ${this.metrics.r2.toFixed(4)}">${this.metrics.r2.toFixed(4)}</span>
                            </div>
                        </div>
                    </section>
                `;
            } else {
                metricsHTML = `
                    <section aria-labelledby="metrics-heading">
                        <h3 id="metrics-heading">Model Performance Metrics</h3>
                        <p>Model metrics are not available (model may still be training).</p>
                    </section>
                `;
            }
            
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2 id="modal-title">Model Details</h2>
                    <button class="close-btn" onclick="rentPredictor.closeModal()" aria-label="Close model details dialog">Close</button>
                </div>
                <div class="model-info" id="modal-body" role="main">
                    <section aria-labelledby="algorithm-heading">
                        <h3 id="algorithm-heading">Algorithm</h3>
                        <p>Multiple Linear Regression</p>
                    </section>
                    
                    <section aria-labelledby="features-heading">
                        <h3 id="features-heading">Features</h3>
                        <ul role="list">
                            <li>Property Size (square feet)</li>
                            <li>Number of Bedrooms</li>
                            <li>Postal Code (location premium)</li>
                        </ul>
                    </section>
                    
                    ${metricsHTML}
                    
                    <section aria-labelledby="training-heading">
                        <h3 id="training-heading">Training Data</h3>
                        <p>70% of data (${this.trainData ? this.trainData.length : 'N/A'} records) used for training</p>
                    </section>
                    
                    <section aria-labelledby="test-heading">
                        <h3 id="test-heading">Test Data</h3>
                        <p>30% of data (${this.testData ? this.testData.length : 'N/A'} records) used for evaluation</p>
                    </section>
                    
                    <section aria-labelledby="status-heading">
                        <h3 id="status-heading">Data Status</h3>
                        <p>Total records loaded: ${this.data ? this.data.length : 0}</p>
                    </section>
                </div>
            `;
            
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            // Focus the close button for keyboard accessibility
            setTimeout(() => {
                const closeBtn = modal.querySelector('.close-btn');
                if (closeBtn) closeBtn.focus();
            }, 100);
            console.log('Model details modal opened');
        } catch (error) {
            console.error('Error showing model details:', error);
            alert('Error displaying model details. Please check the console for more information.');
        }
    }

    closeModal() {
        try {
            const modal = document.getElementById('modelModal');
            if (modal) {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                // Return focus to the button that opened the modal
                const modelDetailsBtn = document.getElementById('modelDetailsBtn');
                if (modelDetailsBtn) modelDetailsBtn.focus();
                console.log('Modal closed');
            }
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }
}

// Global reference for the app instance
let rentPredictor;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing RentPredictor...');
    try {
        rentPredictor = new RentPredictor();
    } catch (error) {
        console.error('Error initializing RentPredictor:', error);
        // Show error message to user
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML += `
                <div style="background: #fee; border: 2px solid #fcc; padding: 20px; margin: 20px; border-radius: 8px; color: #c00;">
                    <h3>Application Error</h3>
                    <p>There was an error starting the application. Please check the console for details.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
});