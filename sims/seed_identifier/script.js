// Global variables
let trainingData = [];
let testData = [];
let model = null;
let modelMetrics = null;

// Wheat species mapping
const speciesMap = {
    0: { name: 'Kama Wheat', image: 'images/kama-wheat.png' },
    1: { name: 'Rosa Wheat', image: 'images/rosa-wheat.png' },
    2: { name: 'Canadian Wheat', image: 'images/canadian-wheat.png' }
};

// Matrix operations utilities
class Matrix {
    constructor(rows, cols, data = null) {
        this.rows = rows;
        this.cols = cols;
        this.data = data || Array(rows).fill().map(() => Array(cols).fill(0));
    }

    static multiply(a, b) {
        if (a.cols !== b.rows) {
            throw new Error('Matrix dimensions incompatible for multiplication');
        }
        const result = new Matrix(a.rows, b.cols);
        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < b.cols; j++) {
                for (let k = 0; k < a.cols; k++) {
                    result.data[i][j] += a.data[i][k] * b.data[k][j];
                }
            }
        }
        return result;
    }

    static transpose(matrix) {
        const result = new Matrix(matrix.cols, matrix.rows);
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                result.data[j][i] = matrix.data[i][j];
            }
        }
        return result;
    }

    add(scalar) {
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] + scalar;
            }
        }
        return result;
    }

    multiply(scalar) {
        const result = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[i][j] = this.data[i][j] * scalar;
            }
        }
        return result;
    }
}

// Logistic Regression implementation
class LogisticRegression {
    constructor(learningRate = 0.1, maxIterations = 2000, regularization = 0.01) {
        this.learningRate = learningRate;
        this.maxIterations = maxIterations;
        this.regularization = regularization;
        this.weights = {};
        this.bias = {};
        this.classes = [];
        this.featureMeans = [];
        this.featureStds = [];
    }

    // Feature normalization
    normalizeFeatures(X, fit = false) {
        if (fit) {
            // Calculate means and standard deviations
            this.featureMeans = [];
            this.featureStds = [];
            const numFeatures = X[0].length;
            
            for (let j = 0; j < numFeatures; j++) {
                const values = X.map(row => row[j]);
                const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
                const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                const std = Math.sqrt(variance);
                
                this.featureMeans.push(mean);
                this.featureStds.push(std > 0 ? std : 1); // Prevent division by zero
            }
        }
        
        // Apply normalization
        return X.map(row => 
            row.map((val, j) => (val - this.featureMeans[j]) / this.featureStds[j])
        );
    }

    sigmoid(z) {
        return z.map(row => row.map(val => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, val))))));
    }

    fit(X, y) {
        // Normalize features
        const XNorm = this.normalizeFeatures(X, true);
        
        // Get unique classes
        this.classes = [...new Set(y)].sort();
        const numClasses = this.classes.length;
        const numFeatures = XNorm[0].length;
        const numSamples = XNorm.length;

        // Initialize weights with Xavier initialization and bias for each class
        this.classes.forEach(cls => {
            const scale = Math.sqrt(2.0 / numFeatures);
            this.weights[cls] = Array(numFeatures).fill(0).map(() => (Math.random() - 0.5) * 2 * scale);
            this.bias[cls] = 0;
        });

        // Train one-vs-rest classifiers
        this.classes.forEach(cls => {
            // Create binary labels (1 for current class, 0 for others)
            const binaryY = y.map(label => label === cls ? 1 : 0);
            
            // Gradient descent with momentum
            let prevWeightGradients = Array(numFeatures).fill(0);
            let prevBiasGradient = 0;
            const momentum = 0.9;
            
            for (let iter = 0; iter < this.maxIterations; iter++) {
                // Forward pass
                const z = XNorm.map(row => 
                    row.reduce((sum, val, idx) => sum + val * this.weights[cls][idx], 0) + this.bias[cls]
                );
                
                const predictions = z.map(val => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, val)))));
                
                // Compute gradients
                const errors = predictions.map((pred, idx) => pred - binaryY[idx]);
                
                // Update weights with L2 regularization and momentum
                for (let j = 0; j < numFeatures; j++) {
                    let gradient = 0;
                    for (let i = 0; i < numSamples; i++) {
                        gradient += errors[i] * XNorm[i][j];
                    }
                    gradient = gradient / numSamples + this.regularization * this.weights[cls][j]; // L2 regularization
                    
                    // Apply momentum
                    const momentumGradient = momentum * prevWeightGradients[j] + (1 - momentum) * gradient;
                    this.weights[cls][j] -= this.learningRate * momentumGradient;
                    prevWeightGradients[j] = momentumGradient;
                }
                
                // Update bias with momentum
                const biasGradient = errors.reduce((sum, error) => sum + error, 0) / numSamples;
                const momentumBiasGradient = momentum * prevBiasGradient + (1 - momentum) * biasGradient;
                this.bias[cls] -= this.learningRate * momentumBiasGradient;
                prevBiasGradient = momentumBiasGradient;
            }
        });
    }

    predict(X) {
        const XNorm = this.normalizeFeatures(X, false);
        return XNorm.map(row => this.predictSingleNormalized(row));
    }

    predictSingle(x) {
        // Normalize the input features
        const xNorm = x.map((val, j) => (val - this.featureMeans[j]) / this.featureStds[j]);
        return this.predictSingleNormalized(xNorm);
    }

    predictSingleNormalized(x) {
        // Calculate scores for each class
        const scores = {};
        this.classes.forEach(cls => {
            const z = x.reduce((sum, val, idx) => sum + val * this.weights[cls][idx], 0) + this.bias[cls];
            scores[cls] = 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
        });

        // Return class with highest score
        return parseInt(Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b));
    }

    predictProba(x) {
        // Normalize the input features
        const xNorm = x.map((val, j) => (val - this.featureMeans[j]) / this.featureStds[j]);
        
        const scores = {};
        this.classes.forEach(cls => {
            const z = xNorm.reduce((sum, val, idx) => sum + val * this.weights[cls][idx], 0) + this.bias[cls];
            scores[cls] = 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
        });
        
        // Normalize probabilities
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        Object.keys(scores).forEach(cls => {
            scores[cls] = scores[cls] / total;
        });
        
        return scores;
    }
}

// Utility functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function calculateMetrics(yTrue, yPred) {
    const classes = [0, 1, 2];
    const metrics = {
        confusionMatrix: {},
        accuracy: 0,
        precision: {},
        recall: {},
        f1Score: {},
        overallPrecision: 0,
        overallRecall: 0,
        overallF1Score: 0
    };

    // Initialize confusion matrix
    classes.forEach(i => {
        metrics.confusionMatrix[i] = {};
        classes.forEach(j => {
            metrics.confusionMatrix[i][j] = 0;
        });
    });

    // Fill confusion matrix
    for (let i = 0; i < yTrue.length; i++) {
        metrics.confusionMatrix[yTrue[i]][yPred[i]]++;
    }

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] === yPred[i]) correct++;
    }
    metrics.accuracy = correct / yTrue.length;

    // Calculate precision, recall, and F1 for each class
    classes.forEach(cls => {
        let tp = metrics.confusionMatrix[cls][cls];
        let fp = 0, fn = 0;
        
        classes.forEach(other => {
            if (other !== cls) {
                fp += metrics.confusionMatrix[other][cls];
                fn += metrics.confusionMatrix[cls][other];
            }
        });

        metrics.precision[cls] = tp + fp > 0 ? tp / (tp + fp) : 0;
        metrics.recall[cls] = tp + fn > 0 ? tp / (tp + fn) : 0;
        metrics.f1Score[cls] = metrics.precision[cls] + metrics.recall[cls] > 0 
            ? 2 * (metrics.precision[cls] * metrics.recall[cls]) / (metrics.precision[cls] + metrics.recall[cls]) 
            : 0;
    });

    // Calculate overall metrics (macro average)
    metrics.overallPrecision = classes.reduce((sum, cls) => sum + metrics.precision[cls], 0) / classes.length;
    metrics.overallRecall = classes.reduce((sum, cls) => sum + metrics.recall[cls], 0) / classes.length;
    metrics.overallF1Score = classes.reduce((sum, cls) => sum + metrics.f1Score[cls], 0) / classes.length;

    return metrics;
}

// Hard-coded fallback data (sample from the CSV file)
const fallbackData = [
    {seedLength: 5.763, seedWidth: 3.312, grooveWidth: 5.22, class: 0},
    {seedLength: 5.554, seedWidth: 3.333, grooveWidth: 4.956, class: 0},
    {seedLength: 5.291, seedWidth: 3.337, grooveWidth: 4.825, class: 0},
    {seedLength: 5.324, seedWidth: 3.379, grooveWidth: 4.805, class: 0},
    {seedLength: 5.658, seedWidth: 3.562, grooveWidth: 5.175, class: 0},
    {seedLength: 5.386, seedWidth: 3.312, grooveWidth: 4.956, class: 0},
    {seedLength: 5.563, seedWidth: 3.259, grooveWidth: 5.219, class: 0},
    {seedLength: 5.42, seedWidth: 3.302, grooveWidth: 5, class: 0},
    {seedLength: 6.053, seedWidth: 3.465, grooveWidth: 5.877, class: 0},
    {seedLength: 5.884, seedWidth: 3.505, grooveWidth: 5.533, class: 0},
    {seedLength: 5.714, seedWidth: 3.242, grooveWidth: 5.314, class: 0},
    {seedLength: 5.438, seedWidth: 3.201, grooveWidth: 5.001, class: 0},
    {seedLength: 5.439, seedWidth: 3.199, grooveWidth: 4.738, class: 0},
    {seedLength: 5.479, seedWidth: 3.156, grooveWidth: 4.872, class: 0},
    {seedLength: 5.482, seedWidth: 3.114, grooveWidth: 4.825, class: 0},
    {seedLength: 5.351, seedWidth: 3.333, grooveWidth: 4.781, class: 0},
    {seedLength: 5.119, seedWidth: 3.383, grooveWidth: 4.781, class: 0},
    {seedLength: 5.527, seedWidth: 3.514, grooveWidth: 5.046, class: 0},
    {seedLength: 5.205, seedWidth: 3.466, grooveWidth: 4.649, class: 0},
    {seedLength: 5.226, seedWidth: 3.049, grooveWidth: 4.914, class: 0},
    {seedLength: 5.658, seedWidth: 3.129, grooveWidth: 5.176, class: 0},
    {seedLength: 5.52, seedWidth: 3.168, grooveWidth: 5.219, class: 0},
    {seedLength: 5.618, seedWidth: 3.507, grooveWidth: 5.091, class: 0},
    {seedLength: 5.099, seedWidth: 2.936, grooveWidth: 4.961, class: 0},
    {seedLength: 5.789, seedWidth: 3.245, grooveWidth: 5.001, class: 0},
    {seedLength: 5.833, seedWidth: 3.421, grooveWidth: 5.307, class: 0},
    {seedLength: 5.395, seedWidth: 3.026, grooveWidth: 4.825, class: 0},
    {seedLength: 5.395, seedWidth: 2.956, grooveWidth: 4.869, class: 0},
    {seedLength: 5.541, seedWidth: 3.221, grooveWidth: 5.038, class: 0},
    {seedLength: 5.516, seedWidth: 3.065, grooveWidth: 5.097, class: 0},
    {seedLength: 5.454, seedWidth: 2.975, grooveWidth: 5.056, class: 0},
    {seedLength: 5.757, seedWidth: 3.371, grooveWidth: 5.228, class: 0},
    {seedLength: 5.717, seedWidth: 3.186, grooveWidth: 5.299, class: 0},
    {seedLength: 5.585, seedWidth: 3.15, grooveWidth: 5.012, class: 0},
    {seedLength: 5.712, seedWidth: 3.328, grooveWidth: 5.36, class: 0},
    {seedLength: 5.709, seedWidth: 3.485, grooveWidth: 5.443, class: 0},
    {seedLength: 5.826, seedWidth: 3.464, grooveWidth: 5.527, class: 0},
    {seedLength: 5.832, seedWidth: 3.683, grooveWidth: 5.484, class: 0},
    {seedLength: 5.656, seedWidth: 3.288, grooveWidth: 5.309, class: 0},
    {seedLength: 5.397, seedWidth: 3.298, grooveWidth: 5.001, class: 0},
    {seedLength: 5.348, seedWidth: 3.156, grooveWidth: 5.178, class: 0},
    {seedLength: 5.351, seedWidth: 3.158, grooveWidth: 5.176, class: 0},
    {seedLength: 5.138, seedWidth: 3.201, grooveWidth: 4.783, class: 0},
    {seedLength: 5.877, seedWidth: 3.396, grooveWidth: 5.528, class: 0},
    {seedLength: 5.579, seedWidth: 3.462, grooveWidth: 5.18, class: 0},
    {seedLength: 5.376, seedWidth: 3.155, grooveWidth: 4.961, class: 0},
    {seedLength: 5.701, seedWidth: 3.393, grooveWidth: 5.132, class: 0},
    {seedLength: 5.57, seedWidth: 3.377, grooveWidth: 5.175, class: 0},
    {seedLength: 5.545, seedWidth: 3.291, grooveWidth: 5.111, class: 0},
    {seedLength: 5.678, seedWidth: 3.258, grooveWidth: 5.351, class: 0},
    {seedLength: 5.585, seedWidth: 3.272, grooveWidth: 5.144, class: 0},
    {seedLength: 5.674, seedWidth: 3.434, grooveWidth: 5.136, class: 0},
    {seedLength: 5.715, seedWidth: 3.113, grooveWidth: 5.396, class: 0},
    {seedLength: 5.504, seedWidth: 3.199, grooveWidth: 5.224, class: 0},
    {seedLength: 5.741, seedWidth: 3.113, grooveWidth: 5.487, class: 0},
    {seedLength: 5.702, seedWidth: 3.212, grooveWidth: 5.439, class: 0},
    {seedLength: 5.388, seedWidth: 3.377, grooveWidth: 5.044, class: 0},
    {seedLength: 5.384, seedWidth: 3.412, grooveWidth: 5.088, class: 0},
    {seedLength: 5.662, seedWidth: 3.419, grooveWidth: 5.222, class: 0},
    {seedLength: 5.159, seedWidth: 3.032, grooveWidth: 4.519, class: 0},
    {seedLength: 5.008, seedWidth: 2.85, grooveWidth: 4.607, class: 0},
    {seedLength: 4.902, seedWidth: 2.879, grooveWidth: 4.703, class: 0},
    {seedLength: 5.076, seedWidth: 3.042, grooveWidth: 4.605, class: 0},
    {seedLength: 5.395, seedWidth: 3.07, grooveWidth: 5.088, class: 0},
    {seedLength: 5.262, seedWidth: 3.026, grooveWidth: 4.782, class: 0},
    {seedLength: 5.139, seedWidth: 3.119, grooveWidth: 4.607, class: 0},
    {seedLength: 5.63, seedWidth: 3.19, grooveWidth: 5.15, class: 0},
    {seedLength: 5.609, seedWidth: 3.158, grooveWidth: 5.132, class: 0},
    {seedLength: 5.569, seedWidth: 3.153, grooveWidth: 5.3, class: 0},
    {seedLength: 5.412, seedWidth: 2.882, grooveWidth: 5.067, class: 0},
    {seedLength: 6.191, seedWidth: 3.561, grooveWidth: 6.06, class: 1},
    {seedLength: 5.998, seedWidth: 3.484, grooveWidth: 5.877, class: 1},
    {seedLength: 5.978, seedWidth: 3.594, grooveWidth: 5.791, class: 1},
    {seedLength: 6.154, seedWidth: 3.93, grooveWidth: 6.079, class: 1},
    {seedLength: 6.017, seedWidth: 3.486, grooveWidth: 5.841, class: 1},
    {seedLength: 5.927, seedWidth: 3.438, grooveWidth: 5.795, class: 1},
    {seedLength: 6.064, seedWidth: 3.403, grooveWidth: 5.922, class: 1},
    {seedLength: 6.579, seedWidth: 3.814, grooveWidth: 6.451, class: 1},
    {seedLength: 6.445, seedWidth: 3.639, grooveWidth: 6.362, class: 1},
    {seedLength: 5.85, seedWidth: 3.566, grooveWidth: 5.746, class: 1},
    {seedLength: 5.875, seedWidth: 3.467, grooveWidth: 5.88, class: 1},
    {seedLength: 6.006, seedWidth: 3.857, grooveWidth: 5.879, class: 1},
    {seedLength: 6.285, seedWidth: 3.864, grooveWidth: 6.187, class: 1},
    {seedLength: 6.384, seedWidth: 3.772, grooveWidth: 6.273, class: 1},
    {seedLength: 6.366, seedWidth: 3.801, grooveWidth: 6.185, class: 1},
    {seedLength: 6.173, seedWidth: 3.651, grooveWidth: 6.197, class: 1},
    {seedLength: 6.084, seedWidth: 3.764, grooveWidth: 6.109, class: 1},
    {seedLength: 6.549, seedWidth: 3.67, grooveWidth: 6.498, class: 1},
    {seedLength: 6.573, seedWidth: 4.033, grooveWidth: 6.231, class: 1},
    {seedLength: 6.45, seedWidth: 4.032, grooveWidth: 6.321, class: 1},
    {seedLength: 6.581, seedWidth: 3.785, grooveWidth: 6.449, class: 1},
    {seedLength: 6.172, seedWidth: 3.796, grooveWidth: 6.053, class: 1},
    {seedLength: 6.272, seedWidth: 3.693, grooveWidth: 6.053, class: 1},
    {seedLength: 6.037, seedWidth: 3.86, grooveWidth: 5.877, class: 1},
    {seedLength: 6.666, seedWidth: 3.485, grooveWidth: 6.448, class: 1},
    {seedLength: 6.139, seedWidth: 3.463, grooveWidth: 5.967, class: 1},
    {seedLength: 6.341, seedWidth: 3.81, grooveWidth: 6.238, class: 1},
    {seedLength: 6.449, seedWidth: 3.552, grooveWidth: 6.453, class: 1},
    {seedLength: 6.271, seedWidth: 3.512, grooveWidth: 6.273, class: 1},
    {seedLength: 6.219, seedWidth: 3.684, grooveWidth: 6.097, class: 1},
    {seedLength: 5.718, seedWidth: 3.525, grooveWidth: 5.618, class: 1},
    {seedLength: 5.89, seedWidth: 3.694, grooveWidth: 5.837, class: 1},
    {seedLength: 6.113, seedWidth: 3.892, grooveWidth: 6.009, class: 1},
    {seedLength: 6.369, seedWidth: 3.681, grooveWidth: 6.229, class: 1},
    {seedLength: 6.248, seedWidth: 3.755, grooveWidth: 6.148, class: 1},
    {seedLength: 6.037, seedWidth: 3.786, grooveWidth: 5.879, class: 1},
    {seedLength: 6.152, seedWidth: 3.806, grooveWidth: 6.2, class: 1},
    {seedLength: 6.033, seedWidth: 3.573, grooveWidth: 5.929, class: 1},
    {seedLength: 6.675, seedWidth: 3.763, grooveWidth: 6.55, class: 1},
    {seedLength: 6.153, seedWidth: 3.674, grooveWidth: 5.894, class: 1},
    {seedLength: 6.107, seedWidth: 3.769, grooveWidth: 5.794, class: 1},
    {seedLength: 6.303, seedWidth: 3.791, grooveWidth: 5.965, class: 1},
    {seedLength: 6.183, seedWidth: 3.902, grooveWidth: 5.924, class: 1},
    {seedLength: 6.259, seedWidth: 3.737, grooveWidth: 6.053, class: 1},
    {seedLength: 6.563, seedWidth: 3.991, grooveWidth: 6.316, class: 1},
    {seedLength: 6.416, seedWidth: 3.719, grooveWidth: 6.163, class: 1},
    {seedLength: 6.051, seedWidth: 3.897, grooveWidth: 5.75, class: 1},
    {seedLength: 6.245, seedWidth: 3.815, grooveWidth: 6.185, class: 1},
    {seedLength: 6.227, seedWidth: 3.769, grooveWidth: 5.966, class: 1},
    {seedLength: 6.493, seedWidth: 3.857, grooveWidth: 6.32, class: 1},
    {seedLength: 6.315, seedWidth: 3.962, grooveWidth: 6.188, class: 1},
    {seedLength: 6.059, seedWidth: 3.563, grooveWidth: 6.011, class: 1},
    {seedLength: 5.762, seedWidth: 3.387, grooveWidth: 5.703, class: 1},
    {seedLength: 5.98, seedWidth: 3.771, grooveWidth: 5.905, class: 1},
    {seedLength: 5.363, seedWidth: 3.582, grooveWidth: 5.144, class: 1},
    {seedLength: 6.111, seedWidth: 3.869, grooveWidth: 5.992, class: 1},
    {seedLength: 6.285, seedWidth: 3.594, grooveWidth: 6.102, class: 1},
    {seedLength: 5.979, seedWidth: 3.687, grooveWidth: 5.919, class: 1},
    {seedLength: 6.513, seedWidth: 3.773, grooveWidth: 6.185, class: 1},
    {seedLength: 5.791, seedWidth: 3.69, grooveWidth: 5.661, class: 1},
    {seedLength: 5.979, seedWidth: 3.755, grooveWidth: 5.962, class: 1},
    {seedLength: 6.144, seedWidth: 3.825, grooveWidth: 5.949, class: 1},
    {seedLength: 5.884, seedWidth: 3.268, grooveWidth: 5.795, class: 1},
    {seedLength: 5.845, seedWidth: 3.395, grooveWidth: 5.795, class: 1},
    {seedLength: 5.776, seedWidth: 3.408, grooveWidth: 5.847, class: 1},
    {seedLength: 5.477, seedWidth: 3.465, grooveWidth: 5.439, class: 1},
    {seedLength: 6.145, seedWidth: 3.574, grooveWidth: 5.971, class: 1},
    {seedLength: 5.92, seedWidth: 3.231, grooveWidth: 5.879, class: 1},
    {seedLength: 5.832, seedWidth: 3.286, grooveWidth: 5.752, class: 1},
    {seedLength: 5.872, seedWidth: 3.472, grooveWidth: 5.922, class: 1},
    {seedLength: 5.472, seedWidth: 2.994, grooveWidth: 5.395, class: 2},
    {seedLength: 5.541, seedWidth: 3.073, grooveWidth: 5.44, class: 2},
    {seedLength: 5.389, seedWidth: 3.074, grooveWidth: 5.307, class: 2},
    {seedLength: 5.224, seedWidth: 2.967, grooveWidth: 5.221, class: 2},
    {seedLength: 5.314, seedWidth: 2.777, grooveWidth: 5.178, class: 2},
    {seedLength: 5.279, seedWidth: 2.687, grooveWidth: 5.275, class: 2},
    {seedLength: 5.176, seedWidth: 2.719, grooveWidth: 5.132, class: 2},
    {seedLength: 5.267, seedWidth: 2.967, grooveWidth: 5.002, class: 2},
    {seedLength: 5.386, seedWidth: 2.911, grooveWidth: 5.316, class: 2},
    {seedLength: 5.317, seedWidth: 2.648, grooveWidth: 5.194, class: 2},
    {seedLength: 5.263, seedWidth: 2.84, grooveWidth: 5.307, class: 2},
    {seedLength: 5.405, seedWidth: 2.776, grooveWidth: 5.27, class: 2},
    {seedLength: 5.408, seedWidth: 2.833, grooveWidth: 5.36, class: 2},
    {seedLength: 5.22, seedWidth: 2.693, grooveWidth: 5.001, class: 2},
    {seedLength: 5.175, seedWidth: 2.755, grooveWidth: 5.263, class: 2},
    {seedLength: 5.25, seedWidth: 2.675, grooveWidth: 5.219, class: 2},
    {seedLength: 5.053, seedWidth: 2.849, grooveWidth: 5.003, class: 2},
    {seedLength: 5.394, seedWidth: 2.745, grooveWidth: 5.22, class: 2},
    {seedLength: 5.444, seedWidth: 2.678, grooveWidth: 5.31, class: 2},
    {seedLength: 5.304, seedWidth: 2.695, grooveWidth: 5.31, class: 2},
    {seedLength: 5.451, seedWidth: 2.879, grooveWidth: 5.491, class: 2},
    {seedLength: 5.35, seedWidth: 2.81, grooveWidth: 5.308, class: 2},
    {seedLength: 5.267, seedWidth: 2.847, grooveWidth: 5.046, class: 2},
    {seedLength: 5.333, seedWidth: 2.968, grooveWidth: 5.176, class: 2},
    {seedLength: 5.011, seedWidth: 2.794, grooveWidth: 5.049, class: 2},
    {seedLength: 5.105, seedWidth: 2.941, grooveWidth: 5.056, class: 2},
    {seedLength: 5.319, seedWidth: 2.897, grooveWidth: 5.27, class: 2},
    {seedLength: 5.417, seedWidth: 2.837, grooveWidth: 5.338, class: 2},
    {seedLength: 5.176, seedWidth: 2.668, grooveWidth: 5.132, class: 2},
    {seedLength: 5.09, seedWidth: 2.715, grooveWidth: 5.088, class: 2},
    {seedLength: 5.325, seedWidth: 2.701, grooveWidth: 5.163, class: 2},
    {seedLength: 5.167, seedWidth: 2.845, grooveWidth: 4.956, class: 2},
    {seedLength: 5.088, seedWidth: 2.763, grooveWidth: 5, class: 2},
    {seedLength: 5.136, seedWidth: 2.763, grooveWidth: 5.089, class: 2},
    {seedLength: 5.278, seedWidth: 2.641, grooveWidth: 5.185, class: 2},
    {seedLength: 4.981, seedWidth: 2.821, grooveWidth: 5.063, class: 2},
    {seedLength: 5.186, seedWidth: 2.71, grooveWidth: 5.092, class: 2},
    {seedLength: 5.145, seedWidth: 2.642, grooveWidth: 4.963, class: 2},
    {seedLength: 5.18, seedWidth: 2.758, grooveWidth: 5.002, class: 2},
    {seedLength: 5.357, seedWidth: 2.893, grooveWidth: 5.178, class: 2},
    {seedLength: 5.09, seedWidth: 2.775, grooveWidth: 4.825, class: 2},
    {seedLength: 5.236, seedWidth: 3.017, grooveWidth: 5.147, class: 2},
    {seedLength: 5.24, seedWidth: 2.909, grooveWidth: 5.158, class: 2},
    {seedLength: 5.108, seedWidth: 2.85, grooveWidth: 5.135, class: 2},
    {seedLength: 5.495, seedWidth: 3.026, grooveWidth: 5.316, class: 2},
    {seedLength: 5.363, seedWidth: 2.683, grooveWidth: 5.182, class: 2},
    {seedLength: 5.413, seedWidth: 2.716, grooveWidth: 5.352, class: 2},
    {seedLength: 5.088, seedWidth: 2.675, grooveWidth: 4.956, class: 2},
    {seedLength: 5.089, seedWidth: 2.821, grooveWidth: 4.957, class: 2},
    {seedLength: 4.899, seedWidth: 2.787, grooveWidth: 4.794, class: 2},
    {seedLength: 5.046, seedWidth: 2.717, grooveWidth: 5.045, class: 2},
    {seedLength: 5.091, seedWidth: 2.804, grooveWidth: 5.001, class: 2},
    {seedLength: 5.132, seedWidth: 2.953, grooveWidth: 5.132, class: 2},
    {seedLength: 5.18, seedWidth: 2.63, grooveWidth: 5.089, class: 2},
    {seedLength: 5.236, seedWidth: 2.975, grooveWidth: 5.012, class: 2},
    {seedLength: 5.16, seedWidth: 3.126, grooveWidth: 4.914, class: 2},
    {seedLength: 5.224, seedWidth: 3.054, grooveWidth: 4.958, class: 2},
    {seedLength: 5.32, seedWidth: 3.128, grooveWidth: 5.091, class: 2},
    {seedLength: 5.41, seedWidth: 2.911, grooveWidth: 5.231, class: 2},
    {seedLength: 5.073, seedWidth: 3.155, grooveWidth: 4.83, class: 2},
    {seedLength: 5.219, seedWidth: 2.989, grooveWidth: 5.045, class: 2},
    {seedLength: 4.984, seedWidth: 3.135, grooveWidth: 4.745, class: 2},
    {seedLength: 5.009, seedWidth: 2.81, grooveWidth: 4.828, class: 2},
    {seedLength: 5.183, seedWidth: 3.091, grooveWidth: 5, class: 2},
    {seedLength: 5.204, seedWidth: 2.96, grooveWidth: 5.001, class: 2},
    {seedLength: 5.137, seedWidth: 2.981, grooveWidth: 4.87, class: 2},
    {seedLength: 5.14, seedWidth: 2.795, grooveWidth: 5.003, class: 2},
    {seedLength: 5.236, seedWidth: 3.232, grooveWidth: 5.056, class: 2},
    {seedLength: 5.175, seedWidth: 2.836, grooveWidth: 5.044, class: 2},
    {seedLength: 5.243, seedWidth: 2.974, grooveWidth: 5.063, class: 2}
];

// Data loading and preprocessing
async function loadData() {
    try {
        console.log('Attempting to load CSV file...');
        const response = await fetch('seeds_data.csv');
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
                seedLength: parseFloat(values[0]),
                seedWidth: parseFloat(values[1]),
                grooveWidth: parseFloat(values[2]),
                class: parseInt(values[3])
            };
        });

        // Shuffle data
        const shuffledData = shuffleArray(data);
        
        // Split into 70% training and 30% testing
        const splitIndex = Math.floor(shuffledData.length * 0.7);
        trainingData = shuffledData.slice(0, splitIndex);
        testData = shuffledData.slice(splitIndex);

        console.log(`Loaded ${data.length} samples from CSV file`);
        console.log(`Training: ${trainingData.length}, Testing: ${testData.length}`);
        
        return true;
    } catch (error) {
        console.warn('Error loading CSV file (likely CORS issue):', error.message);
        console.log('Using fallback hard-coded data...');
        
        // Use fallback data
        const shuffledData = shuffleArray(fallbackData);
        
        // Split into 70% training and 30% testing
        const splitIndex = Math.floor(shuffledData.length * 0.7);
        trainingData = shuffledData.slice(0, splitIndex);
        testData = shuffledData.slice(splitIndex);
        
        console.log(`Using fallback data: ${fallbackData.length} samples`);
        console.log(`Training: ${trainingData.length}, Testing: ${testData.length}`);
        
        return true;
    }
}

// Model training
async function trainModel() {
    if (trainingData.length === 0) {
        console.error('No training data available');
        return false;
    }

    // Prepare training data
    const XTrain = trainingData.map(row => [row.seedLength, row.seedWidth, row.grooveWidth]);
    const yTrain = trainingData.map(row => row.class);

    // Log data ranges for debugging
    const seedLengths = XTrain.map(x => x[0]);
    const seedWidths = XTrain.map(x => x[1]);
    const grooveWidths = XTrain.map(x => x[2]);
    
    console.log('Training data ranges:');
    console.log(`Seed Length: ${Math.min(...seedLengths).toFixed(2)} - ${Math.max(...seedLengths).toFixed(2)}`);
    console.log(`Seed Width: ${Math.min(...seedWidths).toFixed(2)} - ${Math.max(...seedWidths).toFixed(2)}`);
    console.log(`Groove Width: ${Math.min(...grooveWidths).toFixed(2)} - ${Math.max(...grooveWidths).toFixed(2)}`);
    
    // Create and train model with improved parameters
    model = new LogisticRegression(0.1, 2000, 0.01); // Higher learning rate, more iterations, L2 regularization
    model.fit(XTrain, yTrain);

    // Test the model
    const XTest = testData.map(row => [row.seedLength, row.seedWidth, row.grooveWidth]);
    const yTest = testData.map(row => row.class);
    const predictions = model.predict(XTest);

    // Calculate metrics
    modelMetrics = calculateMetrics(yTest, predictions);
    
    console.log('Model trained successfully');
    console.log('Accuracy:', (modelMetrics.accuracy * 100).toFixed(2) + '%');
    console.log('Predictions distribution:', predictions.reduce((acc, pred) => {
        acc[pred] = (acc[pred] || 0) + 1;
        return acc;
    }, {}));
    
    return true;
}

// UI Functions
function updateSliderValues() {
    const seedLength = parseFloat(document.getElementById('seedLength').value);
    const seedWidth = parseFloat(document.getElementById('seedWidth').value);
    const grooveLength = parseFloat(document.getElementById('grooveLength').value);
    
    // Update display values
    document.getElementById('seedLengthValue').textContent = seedLength.toFixed(2);
    document.getElementById('seedWidthValue').textContent = seedWidth.toFixed(2);
    document.getElementById('grooveLengthValue').textContent = grooveLength.toFixed(2);
    
    // Check constraint and update UI
    checkConstraintAndUpdateUI();
}

function makePrediction() {
    if (!model) {
        alert('Model not trained yet. Please wait for training to complete.');
        return;
    }

    const seedLength = parseFloat(document.getElementById('seedLength').value);
    const seedWidth = parseFloat(document.getElementById('seedWidth').value);
    const grooveLength = parseFloat(document.getElementById('grooveLength').value);

    // Since button is disabled when constraint is violated, this should not be needed
    // But keeping as a safety check
    if (grooveLength > seedLength) {
        alert('Invalid measurement detected. Please adjust sliders.');
        return;
    }

    const features = [seedLength, seedWidth, grooveLength];
    console.log('Making prediction with features:', features);
    
    const prediction = model.predictSingle(features);
    const probabilities = model.predictProba(features);
    
    console.log('Prediction result:', prediction);
    console.log('Probabilities:', probabilities);

    const species = speciesMap[prediction];
    const resultDiv = document.getElementById('predictionResult');
    
    // Create probability display for all classes
    let probabilityHTML = '<div class="all-probabilities"><h4>Species Probabilities:</h4>';
    
    // Get all class keys and sort them to ensure consistent order (0, 1, 2)
    const classKeys = Object.keys(probabilities).map(Number).sort();
    
    for (let classKey of classKeys) {
        const speciesName = speciesMap[classKey].name;
        const probability = (probabilities[classKey] * 100).toFixed(2);
        const isHighest = classKey === prediction;
        
        probabilityHTML += `
            <div class="probability-item ${isHighest ? 'highest-probability' : ''}">
                <span class="species-label">${speciesName}:</span>
                <span class="probability-value ${isHighest ? 'bold' : ''}">${probability}%</span>
            </div>
        `;
    }
    probabilityHTML += '</div>';
    
    resultDiv.className = 'prediction-result has-result';
    resultDiv.innerHTML = `
        <div class="species-result">
            <div class="species-name">${species.name}</div>
            <img src="${species.image}" alt="${species.name}" class="species-image">
        </div>
        <div class="prediction-confidence">
            ${probabilityHTML}
        </div>
    `;
}

function showSampleData() {
    const container = document.getElementById('sampleDataContainer');
    const tableDiv = document.getElementById('sampleDataTable');
    
    if (container.style.display === 'none') {
        // Show sample data
        const sampleData = shuffleArray(trainingData).slice(0, 10);
        
        let tableHTML = `
            <table class="sample-table">
                <thead>
                    <tr>
                        <th>Seed Length</th>
                        <th>Seed Width</th>
                        <th>Groove Length</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        sampleData.forEach(row => {
            tableHTML += `
                <tr>
                    <td>${row.seedLength.toFixed(3)}</td>
                    <td>${row.seedWidth.toFixed(3)}</td>
                    <td>${row.grooveWidth.toFixed(3)}</td>
                    <td>${row.class}</td>
                </tr>
            `;
        });
        
        tableHTML += '</tbody></table>';
        tableDiv.innerHTML = tableHTML;
        container.style.display = 'block';
        document.getElementById('showSampleBtn').textContent = 'Hide Sample Data';
    } else {
        // Hide sample data
        container.style.display = 'none';
        document.getElementById('showSampleBtn').textContent = 'Show Sample Data';
    }
}

function showModelDetails() {
    if (!modelMetrics) {
        alert('Model not trained yet. Please wait for training to complete.');
        return;
    }

    const modal = document.getElementById('modelModal');
    const confusionDiv = document.getElementById('confusionMatrix');
    const metricsDiv = document.getElementById('metricsTable');
    const datasetDiv = document.getElementById('datasetInfo');

    // Display dataset information
    const totalDataPoints = trainingData.length + testData.length;
    const trainingPercentage = ((trainingData.length / totalDataPoints) * 100).toFixed(1);
    const testingPercentage = ((testData.length / totalDataPoints) * 100).toFixed(1);
    
    datasetDiv.innerHTML = `
        <p><strong>Training Dataset:</strong> <span class="count">${trainingData.length} rows</span></p>
        <p><strong>Validation Dataset:</strong> <span class="count">${testData.length} rows</span></p>
        <p><strong>Total Dataset:</strong> <span class="count">${totalDataPoints} rows</span></p>
        <hr style="margin: 15px 0; border: 1px solid #e9ecef;">
        <p><strong>Training Split:</strong> <span class="count">${trainingPercentage}%</span></p>
        <p><strong>Validation Split:</strong> <span class="count">${testingPercentage}%</span></p>
    `;

    // Create confusion matrix
    const classes = [0, 1, 2];
    
    // Find max value for color scaling
    let maxValue = 0;
    classes.forEach(i => {
        classes.forEach(j => {
            maxValue = Math.max(maxValue, modelMetrics.confusionMatrix[i][j]);
        });
    });

    let confusionHTML = `
        <table>
            <tr>
                <th></th>
                <th></th>
                <th colspan="3">Predicted</th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                ${classes.map(classNum => `<th>${classNum}</th>`).join('')}
            </tr>
    `;

    classes.forEach((i, index) => {
        confusionHTML += '<tr>';
        if (index === 0) {
            confusionHTML += `<th class="actual-label" rowspan="3">Actual</th>`;
        }
        confusionHTML += `<th>${i}</th>`;
        classes.forEach(j => {
            const value = modelMetrics.confusionMatrix[i][j];
            const intensity = maxValue > 0 ? value / maxValue : 0;
            const blueValue = Math.round(255 - (intensity * 155)); // Scale from blue (100) to white (255)
            const backgroundColor = `rgb(${blueValue}, ${blueValue}, 255)`;
            confusionHTML += `<td class="matrix-cell" style="background-color: ${backgroundColor}">${value}</td>`;
        });
        confusionHTML += '</tr>';
    });

    confusionHTML += '</table>';
    confusionDiv.innerHTML = confusionHTML;

    // Create metrics table
    let metricsHTML = `
        <table>
            <tr>
                <th>Metric</th>
                <th>Overall</th>
                <th>Class 0</th>
                <th>Class 1</th>
                <th>Class 2</th>
            </tr>
            <tr>
                <td><strong>Accuracy</strong></td>
                <td>${(modelMetrics.accuracy * 100).toFixed(2)}%</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
            <tr>
                <td><strong>Precision</strong></td>
                <td>${(modelMetrics.overallPrecision * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.precision[0] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.precision[1] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.precision[2] * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td><strong>Recall</strong></td>
                <td>${(modelMetrics.overallRecall * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.recall[0] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.recall[1] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.recall[2] * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td><strong>F1 Score</strong></td>
                <td>${(modelMetrics.overallF1Score * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.f1Score[0] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.f1Score[1] * 100).toFixed(2)}%</td>
                <td>${(modelMetrics.f1Score[2] * 100).toFixed(2)}%</td>
            </tr>
        </table>
    `;

    metricsDiv.innerHTML = metricsHTML;
    modal.style.display = 'block';
}

// Initialize the application
async function initializeApp() {
    // Show loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    loadingIndicator.innerHTML = '<p>Loading data and training model, please wait...</p>';
    
    try {
        // Load data
        const dataLoaded = await loadData();
        if (!dataLoaded) {
            throw new Error('Failed to load data');
        }

        // Update loading message
        loadingIndicator.innerHTML = '<p>Training logistic regression model...</p>';
        
        // Train model
        const modelTrained = await trainModel();
        if (!modelTrained) {
            throw new Error('Failed to train model');
        }

        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        console.log('Application initialized successfully');
        
        // Now that model is ready, initialize constraint checking
        checkConstraintAndUpdateUI();
        
        // Show a success message briefly
        const resultDiv = document.getElementById('predictionResult');
        resultDiv.innerHTML = '<p style="color: green;">✓ Model trained successfully! Use the sliders to make predictions.</p>';
        setTimeout(() => {
            // Only clear the message if there's no actual prediction result
            if (!resultDiv.classList.contains('has-result')) {
                resultDiv.innerHTML = '<p>Make a prediction to see results</p>';
            }
        }, 3000);
        
    } catch (error) {
        console.error('Error initializing application:', error);
        loadingIndicator.innerHTML = 
            '<p style="color: red;">Error loading the application. Please refresh the page.</p>';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider display values only (without constraint check)
    const seedLength = parseFloat(document.getElementById('seedLength').value);
    const seedWidth = parseFloat(document.getElementById('seedWidth').value);
    const grooveLength = parseFloat(document.getElementById('grooveLength').value);
    
    document.getElementById('seedLengthValue').textContent = seedLength.toFixed(2);
    document.getElementById('seedWidthValue').textContent = seedWidth.toFixed(2);
    document.getElementById('grooveLengthValue').textContent = grooveLength.toFixed(2);
    
    // Slider event listeners
    document.getElementById('seedLength').addEventListener('input', updateSliderValues);
    document.getElementById('seedWidth').addEventListener('input', updateSliderValues);
    document.getElementById('grooveLength').addEventListener('input', updateSliderValues);
    
    // Button event listeners
    document.getElementById('predictBtn').addEventListener('click', makePrediction);
    document.getElementById('showSampleBtn').addEventListener('click', showSampleData);
    document.getElementById('showModelBtn').addEventListener('click', showModelDetails);
    
    // Modal event listeners
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('modelModal').style.display = 'none';
    });
    
    document.getElementById('modelModal').addEventListener('click', function(event) {
        if (event.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Initialize the application
    initializeApp();
});

// Function to check constraint and update UI accordingly
function checkConstraintAndUpdateUI() {
    const seedLength = parseFloat(document.getElementById('seedLength').value);
    const grooveLength = parseFloat(document.getElementById('grooveLength').value);
    const predictBtn = document.getElementById('predictBtn');
    const grooveLengthGroup = document.getElementById('grooveLength').closest('.slider-group');
    const constraintMessage = document.getElementById('grooveConstraintMessage');
    
    // Check if constraint is violated
    const isConstraintViolated = grooveLength > seedLength;
    
    if (isConstraintViolated) {
        // Disable prediction button
        predictBtn.disabled = true;
        predictBtn.textContent = 'Invalid Measurement - Adjust Sliders';
        predictBtn.style.backgroundColor = '#e74c3c';
        predictBtn.style.cursor = 'not-allowed';
        
        // Show visual warning
        grooveLengthGroup.style.borderLeft = '4px solid #e74c3c';
        constraintMessage.style.display = 'block';
        constraintMessage.textContent = 'Groove length cannot exceed seed length';
    } else {
        // Enable prediction button
        predictBtn.disabled = false;
        predictBtn.textContent = 'Predict Wheat Species';
        predictBtn.style.backgroundColor = '#27ae60';
        predictBtn.style.cursor = 'pointer';
        
        // Remove visual warning
        grooveLengthGroup.style.borderLeft = '';
        constraintMessage.style.display = 'none';
    }
}