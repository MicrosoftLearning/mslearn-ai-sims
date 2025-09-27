---
lab:
    title: 'Explore generative AI scenarios'
    description: 'Explore applications that demonstrate how Generative AI agents can reason over input and data, and generate intelligent responses.'
---

# Explore generative AI scenarios

In this exercise you will explore applications that demonstrate how Generative AI agents can reason over input and data, and generate intelligent responses.

This exercise should take approximately **15** minutes to complete.

## Use generative AI to summarize, evaluate, and generate content

Suppose a recruitment organization needs to streamline their process by automatically matching candidate resumes to job openings. One requirement for such an application might be to analyze skills compatibility and generate match scores between resumes and job descriptions.
 
1. In a web browser, open the [Resume Matcher](https://aka.ms/resume-app){:target="_blank"} app at `https://aka.ms/resume-app`.
1. Use the **Choose Resume** button to select any resume from the available profiles. When selected, review the resume preview that appears - which should include the candidate's name, title, experience, and key skills. These details have been summarized from the resume using a generative AI model.
1. Scroll down to the job listings and use the **Compare with Resume** button to compare the selected resume with any of the available jobs. The generative AI model compares the skills in the selected resume with the job requirements, and calculates a score based on how good a match the candidate is for the job. Note that the model calculates both an overall match percentage and individual skill scores; which are displayed in a visual chart showing matched skills in green and missing skills in red.
1. Continue comparing jobs with the resume. When you find a job that is a good match, the generative AI model can create a suitable cover letter for the candidate to use, as well as some advice for maximizing their chances of getting the job.
1. Repeat the process by using **Change Resume** to select a different resume, and compare it against the available jobs.

## Engage in a conversation with an AI agent

Suppose you work for the fictional *Contoso* organization, and you need to submit an expense claim for a recent business trip. The company has created an AI Agent to help employees with expense policies and claims. AI agents are more than just generative AI enabled chatbots. They can also perform actions on your behalf, using access to data and tools to complete tasks.

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

> **Note**: The application used in this exercise is a *simulation* - there's no actual AI agent or generative AI model behind it. However, it's based on real capabilities you can implement with [Azure AI Foundry Agent Service](https://azure.microsoft.com/products/ai-agent-service/){:target="_blank"}.
