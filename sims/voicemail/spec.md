This is a specification for a web app that supports Fourth Coffee Company, a coffee vending business. The app should be a HTML 5 web site with a single HTML file supported by a single JavaScript file for code and a single CSS file for visual themes.

# Page layout

On the left side of the page, show a list of voicemail messages - one for each .wav file in the \messages folder. For each message, list the telephone number and time from the list below (but do not display the file name):

- Message1.wav:
    - telephone number: "Number withheld"
    - time: 8:17am
- Message2.wav:
    - telephone number: 555-316-5150
    - time: 09:39am
- Message3.wav
    - telephone number: 555-101-8181
    - time: 10:06am

When a message is selected, display the AI Analysis on the right side of the page. This should include:

- An audio player that the user can use to listen to the .wav file.
- The following information from the call as described below:
    - Message1.wav:
        - Summary: Jenny from Coho Cafe called to request an addition of an extra box of dark roast coffee to their order for next month. She asked for confirmation via phone call.
        - Caller: Jenny
        - Company: Coho Cafe
        - Sentiment: Neutral
        - Tasks:
            - Call Jenny to confirm the addition of an extra box of dark roast coffee to the order.
        - Contact Details:
            - Tel: 555-867-5309
    - Message2.wav:
        - Summary: Mike from an auto dealership called to report that their coffee machine has stopped working. He requested immediate assistance to fix the issue.
        - Caller: Mike
        - Company: None
        - Sentiment: Negative
        - Tasks:
            - Visit the auto dealership to inspect and repair the coffee machine.
        - Contact Details: None
    - Message3.wav:
        - Summary: Pete from Northwind Traders called to express interest in acquiring a new coffee machine and provided contact details for further communication or to receive a quote.
        - Caller: Pete
        - Company: Northwind Traders
        - Sentiment: Positive
        - Tasks:
            - Send a quote for a new coffee machine to Pete at Northwind Traders.
        - Contact Details:
            - Tel: 555-101-8080
            - Email: pete@northwind.com
- A subdued note at the bottom saying "AI-generated information may contain mistakes"

# Visual style

- The main page should be in a central area with a margin on each side.
- The page should have the title "Fourth Coffee Co." with a suitable image, such as a cup of hot coffee.
- The color scheme should reflect a coffee based theme, with light brown and cream shades.
