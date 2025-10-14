This is a specification for a browser-based Python notebook. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

The app should include the following features:

- Use PyScript to write and run Python code in one or more "cells". The notebook app should open with a single cell, and users can add more as required. Each cell should consists of:
    - An editable area where the user can type Python code or Markdown code
    - A results area where the output from the code or rendered markdown is displayed. Code can produce both text-based output and images.
    - An option above the code cell where the user can select whether the cell contains Python or Markdown
    - A "Run" button that executes the Python code or renders the markdown.
- At the top of the page, there should be buttons to "Run All" cells *which runs the cells in order from top to bottom) and to "Clear All" cells (which) removes all cells other than the original first one, and removes its code and output)
- Import the PyScript module when the app starts, and add support for Python the following Python packages:
    - Numpy
    - Pandas
    - Matplotlib
    - scikit-learn
- Users should be able to upload a local text file (.txt or .csv format), and use Python code to refer to it (so it can be loaded into a dataframe for example)