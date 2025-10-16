This is a specification for an Automated Machine Learning app. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

When the app opens, it should import the PyScript module with support Numpy, Pandas, Matplotlib, and Scikit-learn

The app should use a wizard-based approach that gets users to:
- Specify a job name for a model training job.
- Select either "Classification" or "Regression" as the task type, and upload a .csv file containing data (or select one they previously uploaded in the current session).
- Select the the "target column" to be used as a label that the task will train a model to predict (which should be an appropriate numeric data type for either a regression model or a classification model). On this page of the wizard, the user should be able to click icons that open modals enabling them to:
    - Choose additional configuration settings - specifically, the "Primary metric" to be used to evaluate model performance (Accuracy, Recall, Precision, or F1Score for classification, MAE, RMSE, or R-squared for regression) and which algorithms should be tried in the training task (logistic regression, decision trees, or random forest for classification; linear regression, decision trees, or lasso for regression)
    - Featurization settings  - specifically, which (if any) non-numeric columns should be encoded as numeric categories or ignored; and whether or not to normalize numeric features.
- Review a summary of the job settings and start the training job

When the training job is started, the app should use PyScript to train a model with each selected algorithm, using a 70/30 data split for training and validation and using the featurization settings they selected for non-numeric column encoding and numeric normalization. The models should be evaluated based on the Primary metric chosen by the user (though all metrics should be calculated).

As each model is trained, it should be shown in the output along with its primary metric score. When all of the models are trained, the one with the best score should be highlighted as the "Best model". Users can then click any model to open a modal showing all of the model metrics and an appropriate visualization (a confusion matrix for classification; a scatter plot of predicted vs actual labels for regression)

When viewing any model (not just the best one), the user can choose to "Deploy" it; in which case the model should be saved as a .pkl file. Once a model has been deployed, the user can select it and choose to "Test" it; in which case a modal with an editable JSON representation of example features is shown along with a "Predict" button. When the Predict button is clicked, the model should be used to predict a label based on the features in the JSOn and display it.