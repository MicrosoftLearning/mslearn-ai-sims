---
title: Home
permalink: index.html
layout: home
---

The following exercises explore common artificial intelligence workloads in a variety of applications. The goal of these exercises is to experience some of the capabilities of AI, and to learn about the kinds of solutions AI makes possible. You don't need to be a developer or a technical expert. There are no setup requirements. All you need is a modern web browser, and you can dive right in to see some of the cool things you can do with AI!

{% assign labs = site.pages | where_exp:"page", "page.url contains '/Instructions/Labs'" %}
{% for activity in labs  %}
<hr>
### [{{ activity.lab.title }}]({{ site.github.url }}{{ activity.url }})

{{activity.lab.description}}

{% endfor %}

<hr>

## AI Applications

If you'd rather explore the applications for yourself, without the prescribed lab instructions, you can use the following links:

- [Home rental predictor (Machine Learning - Regression)](https://aka.ms/rent-predictor){:target="_blank"}
- [Wheat seed identifier (Machine Learning - Classification)](https://aka.ms/seed-identifier){:target="_blank"}
- [Customer segmentation (Machine Learning - Clustering)](https://aka.ms/customer-segmentation){:target="_blank"}
- [Expenses chat assistant (Generative AI Agent)](https://aka.ms/expenses-agent){:target="_blank"}
- [StoryBridge social history project (Natural Language Processing)](https://aka.ms/story-bridge){:target="_blank"}
- [Blue Yonder Airlines social media analyzer (Natural Language Processing](https://aka.ms/blue_yonder_social){:target="_blank"}
- [Photo Tagger (Computer Vision)](https://aka.ms/photo-tagger){:target="_blank"}
- [Receipt Analyzer (Information Extraction)](https://aka.ms/receipt-analyzer){:target="_blank"}

> **Note**: These applications are *simulations* - with simple models and no Azure AI services behind them. However, they're based on real capabilities that you can implement using [Microsoft Azure AI technologies](https://azure.microsoft.com/solutions/ai/){:target="_blank"}.