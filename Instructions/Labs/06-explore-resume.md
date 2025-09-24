---
lab:
    title: 'Explore an Resume App'
    description: 'Explore an application that demonstrates how AI can be used to create a resume app.'
---

# Explore an AI resume matching scenario
 
In this exercise you will use an application that simulates an AI-powered job board with resume matching capabilities. The application analyzes how well a candidate's resume matches job requirements and generates personalized cover letters.
 
This exercise should take approximately 15 minutes to complete.
 
## Match resumes to job requirements
 
Suppose an organization needs to streamline their hiring process by automatically matching candidate resumes to job openings. One requirement for such an application might be to analyze skills compatibility and generate match scores between resumes and job descriptions.
 
1. In a web browser, open the **index.html** file from your project folder.
 
2. Use the **Choose Resume** button to open the resume selection modal. Select **Sarah Chen - Senior Software Developer** from the available profiles. When selected, review the resume preview that appears - which should include her name, title, experience, and key skills.
 
3. Note that the app displays the selected resume information including filename and a preview of qualifications.
 
4. Scroll down to the job listings and click the **Compare with Resume** button for the **Full Stack Developer** position at TechCorp Solutions. When the analysis modal opens, wait for the matching to complete and review the compatibility score - which should show a high match percentage due to overlapping technical skills.
 
5. Note that the app has calculated both an overall match percentage and individual skill scores; which are displayed in a visual chart showing matched skills in green and missing skills in red.
 
6. Review the automatically generated cover letter that appears for this strong match, noting how it incorporates Sarah's specific skills and experience relevant to the job.
 
7. Repeat the process by clicking **Change Resume** and selecting **Michael Rodriguez - Marketing Manager**. Then compare him against the **Digital Marketing Specialist** position, noting that the right compatibility score is calculated even though the skill sets are completely different from the previous technical match.
 
8. Try one more comparison by selecting **Emily Johnson - Data Analyst** and comparing her against the **Senior Data Scientist** role; observing how the system identifies both matching skills (Python, SQL) and missing requirements (Deep Learning).
 
**Note:** The application used in this exercise is a simulation - there's no actual AI model or service behind it. However, it's based on real capabilities you can implement with Azure AI services; and in particular, Azure AI Language and Azure OpenAI services for text analysis and content generation.
