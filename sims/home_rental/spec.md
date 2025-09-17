This is a specification for a web app that supports a home rental business. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

The web page should include the following elements:

- A drop-down list from which the user can select a Postal Code. The available values should be "0001", "0002", and "0003".
- A slider in which the user can select the size of their apartment in square feet between a range of 500 to 3000.
- A set of option buttons in which the user can select the number of bedrooms, with the options 0, 1, 2, 3, 4, and 5.
- A button that the user can click to predict a monthly rental amount. The rental should be calculated using the the following logic:
    - Multiply the apartment size by 1 if the postal code is 0001, 1.2 if the postal code is 0002, and 1.5 if the postal code is 0003.
    - Add 300 for each bedroom.

After calculating the rental amount, display it under the button formatted as US dollars.
