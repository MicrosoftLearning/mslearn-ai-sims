---
title: A Simulations
permalink: index.html
layout: home
---

The following exercises explore common artificial intelligence workloads in a variety of simulated applications.

> **Note**: There are no setup requirements; all you need is a modern web browser, and you can dive right in to see the kinds of solution that AI enables.

## Exercises

{% assign labs = site.pages | where_exp:"page", "page.url contains '/Instructions/Labs'" %}
{% for activity in labs  %}
<hr>
### [{{ activity.lab.title }}]({{ site.github.url }}{{ activity.url }})

{{activity.lab.description}}

{% endfor %}

## Simulations

If you'd rather explore the simulations for yourself, without the prescribed lab instructions, you can use the following links:

- [Home Rental App (Machine Learning)](https://aka.ms/mslearn-ml-sim)
- [Expenses chat assistant (Generative AI Agent)](https://aka.ms/mslearn-agent-sim)
- [StoryBridge social history project (Natural Language Processing)](https://aka.ms/mslearn-nlp-sim)
- [Photo Tagger (Computer Vision)](https://aka.ms/mslearn-vision-sim)
- [Receipt Analyzer (Information Extraction)](https://aka.ms/mslearn-ai-info-sim)

> **Note**: These applications are *simulations* - there are no actual AI models or services behind them. However, they're based on real capabilities that you can implement using [Microsoft Azure AI technologies](https://azure.microsoft.com/solutions/ai/).