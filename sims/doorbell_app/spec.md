# Doorbell Photo Viewer - Specification

## Overview
This is a specification for a web app that identifies the objects in photos from their front door. The user can view the photos, and the app will list the objects in the photo.

## File Structure
The web app simulates object detection. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

## Image Mapping and Responses

|Item|Original Image|Objects Image |Detected objects |
|--|--|--|--|
|1|images/door-image-1.png | images/door-image-1-objects.png | image 1 objects list.|
|2|images/door-image-2.png | images/door-image-2-objects.png | image 2 objects list.|
|3|images/door-image-3.png | images/door-image-3-objects.png | image 3 objects list.|
|4|images/door-image-4.png | images/door-image-4-objects.png | image 4 objects list.|

## Features
The web page should include the following elements:

- Use the path listed in the "Original Image" column to populate the left section of the page with thumbnails.
- When the user clicks on a thumbnail, the page displays it in a larger size to the right of the thumbnails. 
- The page also displays the "Item" number that is associated with the "Original Image" that is clicked.

## User Interface Layout
- Left panel: Display thumbnails of all the items in the "Original Image" column 
- Right panel: When a user clicks on a thumnail, display a larger version of the image to the right of the thumbnails. 
