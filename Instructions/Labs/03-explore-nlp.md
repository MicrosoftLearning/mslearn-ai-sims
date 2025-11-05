---
lab:
    title: 'Explore natural language processing scenarios'
    description: 'Explore applications that demonstrates how AI natural language processing capabilities can be used to transcribe and analyze spoken and written text.'
---

# Explore natural language processing scenarios

In this exercise you will explore applications that simulates an AI-powered social history project site and a social media analysis site.

This exercise should take approximately **15** minutes to complete.

## Analyze recorded interviews

The goal of the *StoryBridge* application is to collect and catalog personal reminiscences of ordinary people based on audio recordings. People from all over the world have submitted short recordings of anecdotes about memorable moments in their life. You need to transcribe and analyze these recordings to help catalog them as part of the *StoryBridge* social history project.

1. In a web browser, open the [StoryBridge app](https://aka.ms/story-bridge){:target="_blank"} app at `https://aka.ms/story-bridge`.
1. Use the **Upload File** button to open **story-1.wav**. When the file opens, you can use the media player to listen to it. After a few seconds, the app will transcribe and analyze the recorded anecdote, identifying key entities (such as names, places, and dates) it mentions and evaluating the overall *sentiment* of the anecdote.
1. Repeat the process for stories 2 and 3, reviewing the analysis that is generated.
1. Open **story-4.wav**, listen to the recording, and view the analysis.
1. Observe that the app translates the anecdote into English.

## Analyze social media posts

Blue Yonder Airlines wants to analyze social media posts that mention the company using the hashtag *#BlueYonderAirlines*. In this application, you'll see how they capture social media posts and analyze the sentiment and key phrases they contain.

1. In a  web browser, open the [Blue Yonder Airlines social media analyser](https://aka.ms/blue_yonder_social){:target="_blank"} app at `https://aka.ms/blue_yonder_social`.
1. Use the **Start capturing** button to start capturing social media messages that mention the tag *#BlueYonderAirlines*.
1. As each post is captured, select it and view the details in the **Post Details** pane. Note that the sentiment and key phrases of the post have been determined using AI.
1. At the top of the page, observe that the AI analysis is used to keep a running metric of sentiment for social media posts in real-time.
1. Use the **Stop capturing** button to stop capturing social media posts.

> **Note**: The applications used in this exercise are *simulations* - there are no actual AI speech or language service behind them. However, they're based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"}; and in particular, the [Azure AI Speech](https://azure.microsoft.com/products/ai-services/ai-speech/){:target="_blank"}, [Azure AI Language](https://azure.microsoft.com/products/ai-services/ai-language){:target="_blank"}, and [Azure AI Translator](https://azure.microsoft.com/products/ai-services/ai-translator){:target="_blank"} services.
