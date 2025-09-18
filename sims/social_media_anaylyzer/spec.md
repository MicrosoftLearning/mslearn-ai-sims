This is a specification for a web app that analyzes real-time social media posts for the "Blue Yonder Airlines" airline company. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

On the left side of the page, include a button labelled "Start capturing" and a list in which we'll load social media posts. When this is clicked, the app should start loading social media posts from the social_media_posts.json file at random between 1 and 3 seconds and add them to the list. For each post, display the current date and time, the poster name, the first 27 characters of the post and "...", and an emoji to indicate the sentiment. The posts should be added in the order in which they appear in the JON file and be added to the top of the list. When the "Start capturing" button is clicked, its label should change to "Stop capturing" and when clicked, the process of loading the posts should stop. It should start again where it left off if the "Start capturing" button clicked again. When last post in the file has been added, start again from the beginning until the "Stop capturing" button is clicked..

On the right-hand side of the page, display a visualization of gauge with a value between -1 and 1 to indicate average sentiment from the posts that have been loaded so far, This should be updated with each post. Beside the gauge, keep a running total of the number of posts that have been loaded.

When the user select a post in the list, on the right under the gauge and total, display:

- The post date and time
- -The poster name
- The full text of the post
- The sentiment (both the text and an emoji)
- The key phrases in the post
