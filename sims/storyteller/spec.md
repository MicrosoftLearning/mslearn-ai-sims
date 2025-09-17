This is a specification for a web app called StoryBridge. It is a storytelling platform for sharing oral histories across cultures. The web app simulates audio file transcription. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.
 
The web page should include an "Upload File" button. When this button is clicked, the app should display a simulated "Open File" interface listing the .wav files in the stories folder. This should not be a real "Open file" dialog box, but it should look like the user is uploading a local file from Windows. The .wav files in the stories folder should be listed in the Open File dialog with an appropriate icon.
 
When the user selects a file, the page should display an audio player that can be used to play the audio file. Under the audio player, display the message "Analyzing audio..." for three seconds. Then display the following information for the selected file:
 
| Selected file | Transcript | Named Entities | Sentiment |
| -- | -- | -- | -- |
| story-1.wav | I was in Tokyo when the earthquake struck in 2011. I remember how the ground shook violently, and buildings swayed like trees in the wind. We spent the night in a shelter, unsure of what tomorrow would bring. | Tokyo, earthquake, 2011, shelter, tomorrow | Negative – fear, uncertainty, trauma |
|story-2.wav | When the Apollo 11 landing was broadcast, my mother sat with her father in their living room in São Paulo. They watched in awe as Neil Armstrong stepped onto the Moon. She said it was a moment of wonder and possibility. | Apollo 11, Neil Armstrong, Moon, father, São Paulo, living room | Positive – awe, inspiration, hope |
|story-3.wav | During the famine in Gujarat, my family survived on rice and water for weeks. My father traded his watch for a sack of grain. We were hungry, but together. | famine, Gujarat, family, father, watch, grain | Mixed – hardship and resilience |
 
Show the file information by making the transcript appear as if being typed. Then list the named entities, and finally show the sentiment.