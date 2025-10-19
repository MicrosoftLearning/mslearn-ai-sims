This is a specification for speech-enabled app. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

When the app opens, it should import necessary Web Speech modules for text to speech and speech to text

The app should display a button with the label "Click to speak". When clicked, the app should generate speech from the text "Speak after the tone" and then play a single "beep" noise. Then the app should listen for the user's spoken input until the stop talking, and transcribe their speech to a label under the button.