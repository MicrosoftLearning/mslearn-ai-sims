This is a specification for a seed identifier app. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

The user can use the app to predict which type of wheat a seed will grow based on its measurements. The possible species of wheat are identified as three classes:

- Class 1: Kama Wheat
- Class 2: Rosa Wheat
- Class 3: Canadian Wheat

The app should show, on the left side of the screen an area where the user can set the following seed measurements:

- Seed length
- Seed width
- Groove length

 Each measurement should have a label, the relevant image from the /images folder, and a slider control with a range of values from 0.1 to 7.0.

Under the sliders, display a button labeled "Predict wheat species".

When the "Predict wheat species" button is clicked, calculate the predicted class for the wheat species as follows:

    - If the groove length is greater than 5.5, predict class 2
    - Otherwise, if the seed width is less than 3.1, predict class 3
    - Otherwise, predict class 1

After calculating the class, on the right side of the screen display the following:

- A heading that reflects the name of the predicted wheat type
- The relevant image for the predicted wheat type from the /images folder
- A muted disclaimer saying "AI generated content can include mistakes"
