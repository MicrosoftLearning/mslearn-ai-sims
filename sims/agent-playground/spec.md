This is a specification for a web chat app. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

The web page should include a chat pane in which the user can enter questions and see responses.

The app should use WebLLM with a SmolLM2-135M-Instruct model to support the chat functionality. The model should be given the system message "You are a friendly and helpful AI chat assistant" and whatever user prompt the user enters. The model's responses should be revealed as though they are being typed. With each chat iteration, the system message and up to ten of the previous user prompts and responses should be added to the conversation thread to provide context.