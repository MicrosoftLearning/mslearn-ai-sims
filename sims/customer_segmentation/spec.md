This is a specification for a web app named Customer Segmentation. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

The web page should include the following elements:

- An "Upload Data" button that displays a simulated "Open File" interface listing the files in the \data folder. This should not be a real "Open file" dialog box, but it should look like the user is uploading a local file".
- When the user selects a file, the page should display its contents in a table on the left side of the page.
- After the data is loaded and displayed, on the right side of the page, a button labelled "Analyze" should be displayed. When this button is clicked:
    - Display a status caption saying "Analyzing data..."
    - Under the caption, display a scatter plot showing the customer data plotted with AverageSpend on the Y axis and AverageFrequency on the X axis.
    - Use a K-Means clustering algorithm to cluster the data based on AverageSpend and AverageFrequency using K values of 2 to 5, calculating the silhouette score for the clusters each time.
    - Finally, assign the customer data to clusters based on the K value with the best silhouette score, add a "Cluster" column to the table of data indicating the cluster to which each customer belongs, and replace the scatterplot with the same plot but with the data points color-coded to indicate the clusters.