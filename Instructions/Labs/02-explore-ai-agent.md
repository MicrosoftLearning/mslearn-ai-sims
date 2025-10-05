---
lab:
    title: 'Explore generative AI and agent scenarios'
    description: 'Explore applications that demonstrate how Generative AI agents can reason over input and data, and generate intelligent responses.'
---

# Explore generative AI and agent scenarios

In this exercise you will explore applications that demonstrate how Generative AI agents can reason over input and data, and generate intelligent responses.

This exercise should take approximately **15** minutes to complete.

## Engage in a conversation with an AI agent

Suppose you work for the fictional *Contoso* organization, and you need to submit an expense claim for a recent business trip. The company has created an AI Agent to help employees with expense policies and claims. AI agents are more than just generative AI enabled chatbots. They can also perform actions on your behalf, using access to data and tools to complete tasks. In this case, the agent can generate and submit an expense claim on your behalf.

> **Note**: In this simulated app, the agent's understanding is limited. A real generative AI agent typically has *much* more versatility in understanding and generating language.

1. In a web browser, open the [Expense chat assistant](https://aka.ms/expenses-agent){:target="_blank"} app at `https://aka.ms/expenses-agent`.
1. In the chat interface, enter a prompt, such as `Hello`, and review the response.
1. Try another prompt, such as `What can you do?`, and review the response.
1. Try selecting one of the sample prompts, such as `How much can I spend on a meal?` and entering it. Then review the response.
1. Try entering a variation on that prompt - for example, `What's the limit for food?` or `What about a taxi?` and note that the agent can interpret your input appropriately as meaning the same thing as asking how much you can spend on a meal or cab ride.
1. Carry on asking questions about expense limits for things like hotels and airfares.
1. Enter a prompt asking how to submit an expense claim (for example, `How do I submit a claim?`).
1. When the agent asks if you'd like it to submit a claim on your behalf, enter `yes` (or `OK`, `sure`, or similar).
1. When asked for details of the claim, enter some details like `I need to claim $70 for dinner and $25 for a taxi ride.`.

    The agent should respond indicating that it has taken action on your behalf.

## Use generative AI to summarize, evaluate, and generate content

Suppose a recruitment organization needs to streamline their process by automatically matching candidate resumes to job openings. One requirement for such an application might be to compare resumes to job descriptions, both of which may be in a variety of formats. A generative AI model is a great way to perform the content analysis, summarization, and generation required for this kind of task.

1. In a web browser, open the [Recruiter Dashboard](https://aka.ms/resume-app){:target="_blank"} app at `https://aka.ms/resume-app`.

1. Use the **Browse Candidate Pool** button to select any resume from the available profiles. When selected, review the resume summary that is generated - which should include the candidate's name, title, experience, and key skills.

    Note that you can view the full resume from which the agent generated a summary.

1. Scroll down to the job listings and use the **Analyze Match** button to compare the selected resume with any of the available jobs. The app compares the skills in the selected resume with the job requirements, and calculates a score based on how good a match the candidate is for the job - both as an overall percentage and based on scores for individual skills. The app also generates some recommendations to help maximize the candidate's chances of getting the job.

1. Continue comparing jobs with the resume. When you find a job that is a good match, generate an outreach email to send to the candidate. The email is dynamically generated based on the candidate resume and how well it matches the job requirements.

    After the email is generated, you can edit it, and then send it or download the text.

1. Repeat the process by using **Change Candidate** to select a different resume, and compare it against the available jobs.

> **Note**: The applications used in this exercise are *simulations* - there are no actual AI agents or generative AI models behind them. However, they're based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"} - in particular the [Azure AI Foundry Agent Service](https://azure.microsoft.com/products/ai-agent-service/){:target="_blank"}.
