This is a specification for a web app called Home Rentals. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

Start by creating a CSV file containing 100 records with the following fields:

- property_id - a unique integer identifier for a property record.
- address - a fictitious street address in the town of "Dataville"
- postal_code - one of five fictitious zip codes
- size - the size of property in square feet, ranging from 800 to 6000
- bedrooms - the number of bedrooms in the property, ranging from 0 to 5
- rent_amount - the monthly rent amount, which should be based on the size, number of bedrooms, and the postal_code - assuming that each postal_code adds a specific premium to the rent so that some postal_codes are more expensive than others.

Then, use a linear regression algorithm to define a function that calculates the rent_amount based on the postal_code, size, and bedrooms. Use 70 randomly selected rows of the data to determine the function, and then use the remaining 30 rows to test it; calculating the mean absolute error, mean squared error, root mean squared error, and coefficient of determination metrics. Create constants for those metrics, because we'll need them again later.

Now that you have a function, create the user interface for an application that allows the user to select a postal_code from a drop-down liat, a size from a slider, and the number of bedrooms from a horizontal list of radio buttons. Under these user interface elements, provide a button that the user can click to calculate the rent_amount for their selected values using the function you created; and display the result below the button, formatted as US dollars.

Under the result field, add a button labelled "Show sample data", which when clicked displays a random selection of 10 rows of the data in the CSV file. Next to this button, add another button labelled "Show model details" that when clicked displays a modal dialog box containing details of the model used to predict the rent amount. The details should include the model algorithm (linear regression) and the metrics calculated from the test data.