---
lab:
    title: 'Explore a generative AI agent scenario'
    description: 'Explore an application that demonstrates how an AI agent can use generative AI to engage in conversation and assist employees with expense claims.'
---

# Explore a generative AI agent scenario

In this exercise you will use an application that simulates an AI agent. The agent is designed to support employees with expense claims.

This exercise should take approximately **15** minutes to complete.

## Engage in a conversation with the agent

Suppose you work for the fictional *Contoso* organization, and you need to submit an expense claim for a recent business trip.

1. In a web browser, open the [Expense chat assistant](https://aka.ms/mslearn-agent-sim){:target="_blank"} app at `https://aka.ms/mslearn-agent-sim`.
1. In the chat interface, enter a prompt, such as `Hello`, and review the response.
1. Try another prompt, such as `What can you do?`, and review the response.
1. Try selecting one of the sample prompts, such as `How much can I spend on a meal?` and entering it. Then review the response.
1. Try entering a variation on that prompt - for example, `What's the limit for food?` and note that the agent can interpret your input appropriately as meaning the same thing as asking how much you can spend on a meal.
1. Carry on asking questions about expense limits for things like hotels, airfares, and taxis.

    > **Note**: In this simulated app, the agent's understanding is limited.

## Get the agent to initiate a task

AI agents are more than just generative AI enabled chatbots. They can also perform actions on your behalf, using access to data and tools to complete tasks.

1. Enter a prompt asking how to submit an expense claim (for example, `How do I submit a claim?`).
1. When the agent asks if you'd like it to submit a claim on your behalf, enter `yes` (or `OK`, `sure`, or similar).
1. When asked for details of the claim, enter some details like `I need to claim $70 for dinner and $25 for a taxi ride.`.

    The agent should respond indicating that it has taken action on your behalf.

> **Note**: The application used in this exercise is a *simulation* - there's no actual AI agent or generative AI model behind it. However, it's based on real capabilities you can implement with [Azure AI Foundry Agent Service](https://azure.microsoft.com/products/ai-agent-service/){:target="_blank"}.
