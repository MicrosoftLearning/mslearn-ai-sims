This is a specification for a web app called Seed Identifier. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

Start by using logistic regression to define a function that predicts a class (0, 1, or 2) based on the seed_length, seed_width, and groove_width values in the seeds_data.csv file. Use a randomly selected 70% of the data to calculate the logistic regression function, and then test it with the remaining 30% of the data. When testing, calculate the metrics necessary to construct a confusion matrix and also the overall accuracy, recall, precision, and F1 score for the model as well as the recall and precision for each class.

When the model is trained and the function is ready, display the UI; which should consist of:

- Three sliders on the left side of the page, labelled "Seed Length", "Seed Width", and "Groove Length" with the corresponding images from the /images folder.
- A button under the sliders labelled "Predict Wheat Species", which when clicked, uses the logistic regression function to predict the appropriate class. The classes correspond to the following wheat species labels:
    - 0: Kama Wheat
    - 1: Rosa Wheat
    - 2: Canadian Wheat
- A "Predicted Species" area on the right, next to the sliders and button in which the results of the prediction should be displayed. The results should consist of the species name and the corresponding image from the /images folder.
- Under the sliders and results area, add another button labelled "Show Sample Data"; which when clicked displays a random selection of 10 rows from the training data.
- Next to the "Show Sample Data" button, add another button that when clicked displays a modal dialog box containing details of the model used to predict the species. The details should include the model algorithm (logistic regression), a confusion matrix that uses shades between white and blue to indicate the number of predictions in each cell, and the metrics calculated from the test data.