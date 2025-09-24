# Project Specification

Create a simple web app demo for a job board with resume matching capabilities. 

## Core Requirements:

1. **Resume Selection**: 
   - Provide a simulated file upload button that displays predefined resumes instead of accessing local files
   - When clicked, show a modal with 5-10 diverse resume profiles (e.g., Software Developer, Marketing Manager, Data Analyst, Project Manager, etc.)
   - Display selected resume filename and preview after selection
   - Include visual feedback to simulate a real upload experience

2. **Job Listings**: Display a list of available job positions with:
   - Job title
   - Company name
   - Job description
   - Required skills and qualifications
   - Experience requirements

3. **Resume-to-Job Matching**: 
   - Compare selected resume content against selected job requirements
   - Calculate a match percentage or score
   - Highlight matching skills and qualifications
   - Identify gaps or missing requirements
   - Display a simple skills chart showing:
     - Each required skill from the job description
     - Graded scores (e.g., 0-100% or 1-5 stars) indicating proficiency level
     - Visual indicators for skills the candidate has vs. skills they lack

4. **Cover Letter Generation**:
   - For candidates with a good match (e.g., >70% compatibility), automatically generate a personalized cover letter
   - Include relevant skills and experiences from their resume
   - Tailor the content to the specific job and company

5. **User Interface**:
   - Clean, intuitive design
   - Clear feedback on match results
   - Easy-to-understand visualization of compatibility
   - Download option for generated cover letter

## Technical Considerations:
- Use modern web technologies (React/Vue/Angular for frontend)
- Pre-load sample resume data in JSON or similar format
- Include sample job data for demonstration purposes
- Ensure responsive design for mobile and desktop