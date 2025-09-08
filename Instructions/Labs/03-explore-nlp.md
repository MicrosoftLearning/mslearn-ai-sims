---
lab:
    title: 'Explore a natural language processing scenario'
    description: 'Explore an application that demonstrates how AI natural language processing capabilities can be used to transcribe and analyze spoken anecdotes to compile and catalog a social history archive.'
---

# Explore a natural language processing scenario

In this exercise you will use an application that simulates an AI-powered social history project site. The goal of the site is to collect and catalog personal reminiscences of ordinary people based on audio recordings.

This exercise should take approximately **15** minutes to complete.

## Analyze recordings

People from all over the world have submitted short recordings of anecdotes about memorable moments in their life. You need to transcribe and analyze these recordings to help catalog them as part of the *StoryBridge* social history project.

1. In a web browser, open the [StoryBridge app](https://aka.ms/story-bridge){:target="_blank"} app at `https://aka.ms/story-bridge`.
1. Use the **Upload File** button to open **story-1.wav**. When the file opens, you can use the media player to listen to it. After a few seconds, the app will transcribe and analyze the recorded anecdote, identifying key entities (such as names, places, and dates) it mentions and evaluating the overall *sentiment* of the anecdote.
1. Repeat the process for stories 2 and 3, reviewing the analysis that is generated.

## Translate a story

Since *StoryBridge* is a global project, submitted recordings can be in one of multiple languages.

1. Open **story-4.wav**, listen to the recording, and view the analysis.
1. Observe that the app translates the anecdote into English.

> **Note**: The application used in this exercise is a *simulation* - there's no actual AI speech or language service behind it. However, it's based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"}; and in particular, the [Azure AI Speech](https://azure.microsoft.com/products/ai-services/ai-speech/){:target="_blank"}, [Azure AI Language](https://azure.microsoft.com/products/ai-services/ai-language){:target="_blank"}, and [Azure AI Translator](https://azure.microsoft.com/products/ai-services/ai-translator){:target="_blank"} services.
