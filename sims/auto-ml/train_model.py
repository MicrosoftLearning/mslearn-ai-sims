# Machine Learning Training Module for PyScript
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression, LinearRegression, Lasso
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import json

def train_ml_models(job_data_json, current_data_dict):
    """Train machine learning models based on job configuration"""
    try:
        # Parse job data
        job_data = json.loads(job_data_json)
        
        # Convert data back to DataFrame
        df = pd.DataFrame(current_data_dict)
        
        # Get training parameters
        target_column = job_data['targetColumn']
        task_type = job_data['taskType']
        algorithms = job_data.get('algorithms', [])
        primary_metric = job_data.get('primaryMetric', 'accuracy' if task_type == 'classification' else 'mae')
        normalize_features = job_data.get('normalizeFeatures', False)
        categorical_settings = job_data.get('categoricalSettings', {})
        
        # Prepare features and target
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Handle categorical columns
        for col in X.columns:
            if col in categorical_settings:
                if categorical_settings[col] == 'categorize':
                    if X[col].dtype == 'object':
                        le = LabelEncoder()
                        X[col] = le.fit_transform(X[col].astype(str))
                elif categorical_settings[col] == 'ignore':
                    X = X.drop(columns=[col])
        
        # Convert remaining object columns to numeric
        for col in X.columns:
            if X[col].dtype == 'object':
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str))
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print(f"📈 Training data shape: X_train={X_train.shape}, y_train={y_train.shape}")
        print(f"📊 Test data shape: X_test={X_test.shape}, y_test={y_test.shape}")
        print(f"🎯 Target column '{target_column}' - unique values in y_test: {sorted(y_test.unique())}")
        print(f"🔧 Task type: {task_type}, Primary metric: {primary_metric}")
        print(f"⚙️  Selected algorithms: {algorithms}")
        
        # Normalize features if requested
        if normalize_features:
            print("🔄 Applying feature normalization...")
            scaler = StandardScaler()
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)
        else:
            print("➡️  No feature normalization applied")
        
        # Define models based on task type
        if task_type == 'classification':
            model_map = {
                'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
                'decision_tree': DecisionTreeClassifier(random_state=42),
                'random_forest': RandomForestClassifier(random_state=42, n_estimators=10)
            }
            metric_funcs = {
                'accuracy': accuracy_score,
                'precision': lambda y_true, y_pred: precision_score(y_true, y_pred, average='weighted'),
                'recall': lambda y_true, y_pred: recall_score(y_true, y_pred, average='weighted'),
                'f1': lambda y_true, y_pred: f1_score(y_true, y_pred, average='weighted')
            }
        else:
            model_map = {
                'linear_regression': LinearRegression(),
                'lasso': Lasso(random_state=42),
                'decision_tree': DecisionTreeRegressor(random_state=42),
                'random_forest': RandomForestRegressor(random_state=42, n_estimators=10)
            }
            metric_funcs = {
                'mae': mean_absolute_error,
                'mse': mean_squared_error,
                'r2': r2_score
            }
        
        # Train models
        model_results = []
        best_score = float('-inf') if primary_metric == 'r2' else float('inf')
        best_model_name = None
        
        for algo in algorithms:
            if algo in model_map:
                try:
                    print(f"\n🚀 Training {algo.replace('_', ' ').title()}...")
                    
                    # Train model
                    model = model_map[algo]
                    print(f"  Model: {type(model).__name__}")
                    print(f"  Training on {X_train.shape[0]} samples with {X_train.shape[1]} features")
                    
                    model.fit(X_train, y_train)
                    print(f"  ✅ Model training completed")
                    
                    # Make predictions
                    y_pred = model.predict(X_test)
                    print(f"  📊 Predictions shape: {y_pred.shape}")
                    print(f"  📋 First 10 actual values: {list(y_test.iloc[:10])}")
                    print(f"  📋 First 10 predicted values: {list(y_pred[:10])}")
                    
                    # Show prediction distribution
                    if task_type == 'classification':
                        print(f"  📈 Actual class distribution: {dict(pd.Series(y_test).value_counts().sort_index())}")
                        print(f"  📈 Predicted class distribution: {dict(pd.Series(y_pred).value_counts().sort_index())}")
                    else:
                        print(f"  📈 Actual values range: {y_test.min():.3f} to {y_test.max():.3f}")
                        print(f"  📈 Predicted values range: {y_pred.min():.3f} to {y_pred.max():.3f}")
                    
                    # Calculate ALL metrics for this task type to ensure authenticity
                    metrics = {}
                    
                    if task_type == 'classification':
                        # Calculate all classification metrics
                        try:
                            metrics['accuracy'] = float(accuracy_score(y_test, y_pred))
                            print(f"  Raw accuracy_score result: {accuracy_score(y_test, y_pred)}")
                        except Exception as e:
                            print(f"  Error calculating accuracy: {e}")
                            metrics['accuracy'] = 0.0
                            
                        try:
                            metrics['precision'] = float(precision_score(y_test, y_pred, average='weighted', zero_division=0))
                            print(f"  Raw precision_score result: {precision_score(y_test, y_pred, average='weighted', zero_division=0)}")
                        except Exception as e:
                            print(f"  Error calculating precision: {e}")
                            metrics['precision'] = 0.0
                            
                        try:
                            metrics['recall'] = float(recall_score(y_test, y_pred, average='weighted', zero_division=0))
                            print(f"  Raw recall_score result: {recall_score(y_test, y_pred, average='weighted', zero_division=0)}")
                        except Exception as e:
                            print(f"  Error calculating recall: {e}")
                            metrics['recall'] = 0.0
                            
                        try:
                            metrics['f1'] = float(f1_score(y_test, y_pred, average='weighted', zero_division=0))
                            print(f"  Raw f1_score result: {f1_score(y_test, y_pred, average='weighted', zero_division=0)}")
                        except Exception as e:
                            print(f"  Error calculating f1: {e}")
                            metrics['f1'] = 0.0
                    else:
                        # Calculate all regression metrics
                        try:
                            metrics['mae'] = float(mean_absolute_error(y_test, y_pred))
                            print(f"  Raw mean_absolute_error result: {mean_absolute_error(y_test, y_pred)}")
                        except Exception as e:
                            print(f"  Error calculating MAE: {e}")
                            metrics['mae'] = float('inf')
                            
                        try:
                            metrics['mse'] = float(mean_squared_error(y_test, y_pred))
                            print(f"  Raw mean_squared_error result: {mean_squared_error(y_test, y_pred)}")
                        except Exception as e:
                            print(f"  Error calculating MSE: {e}")
                            metrics['mse'] = float('inf')
                            
                        try:
                            metrics['rmse'] = float(np.sqrt(mean_squared_error(y_test, y_pred)))
                            print(f"  Raw RMSE calculation: sqrt({mean_squared_error(y_test, y_pred)}) = {np.sqrt(mean_squared_error(y_test, y_pred))}")
                        except Exception as e:
                            print(f"  Error calculating RMSE: {e}")
                            metrics['rmse'] = float('inf')
                            
                        try:
                            metrics['r2'] = float(r2_score(y_test, y_pred))
                            print(f"  Raw r2_score result: {r2_score(y_test, y_pred)}")
                        except Exception as e:
                            print(f"  Error calculating R2: {e}")
                            metrics['r2'] = -float('inf')
                    
                    print(f"  📊 ALL METRICS for {algo.replace('_', ' ').title()}:")
                    for metric_name, metric_value in metrics.items():
                        print(f"    {metric_name}: {metric_value:.6f}")
                    
                    # Verify the primary metric exists
                    if primary_metric not in metrics:
                        print(f"  ⚠️  WARNING: Primary metric '{primary_metric}' not found in calculated metrics!")
                        print(f"  Available metrics: {list(metrics.keys())}")
                        # Use first available metric as fallback
                        primary_metric = list(metrics.keys())[0] if metrics else 'accuracy'
                        print(f"  Using fallback primary metric: {primary_metric}")
                    
                    current_score = metrics[primary_metric]
                    print(f"  🎯 Primary metric '{primary_metric}' value: {current_score:.6f}")
                    is_better = (primary_metric == 'r2' and current_score > best_score) or \
                               (primary_metric != 'r2' and current_score < best_score)
                    
                    if is_better:
                        best_score = current_score
                        best_model_name = algo
                    
                    # Store results
                    model_results.append({
                        'name': algo,
                        'display_name': algo.replace('_', ' ').title(),
                        'metrics': metrics,
                        'is_best': False  # Will be updated later
                    })
                    
                    print(f"✅ Completed {algo.replace('_', ' ').title()} - Primary metric ({primary_metric}): {metrics[primary_metric]:.6f}")
                    
                except Exception as e:
                    print(f"❌ Failed to train {algo.replace('_', ' ').title()}: {str(e)}")
                    import traceback
                    print(f"   Full error: {traceback.format_exc()}")
            else:
                print(f"⚠️  Algorithm '{algo}' not found in model_map. Available: {list(model_map.keys())}")
        
        print(f"\n🏆 TRAINING SUMMARY:")
        print(f"   Total models trained: {len(model_results)}")
        if model_results:
            print(f"   Primary metric used for comparison: {primary_metric}")
            print(f"   Best model selection criteria: {'Higher is better' if primary_metric in ['accuracy', 'precision', 'recall', 'f1', 'r2'] else 'Lower is better'}")
        
        # Mark best model
        for result in model_results:
            result['is_best'] = result['name'] == best_model_name
        
        # Create job info
        job_info = {
            'id': job_data.get('id', 'unknown'),
            'name': job_data.get('jobName', 'ML Job'),
            'task_type': task_type,
            'target_column': target_column,
            'primary_metric': primary_metric
        }
        
        return json.dumps(model_results), json.dumps(job_info)
        
    except Exception as e:
        print(f"✗ Training failed: {str(e)}")
        return "[]", "{}"