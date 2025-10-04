const resumes = [
    {
        id: 1,
        name: "Sarah Chen",
        title: "Senior Software Developer",
        filename: "sarah_chen_resume.pdf",
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Git", "Agile"],
        experience: 8,
        summary: "Experienced software developer with 8+ years building scalable web applications.",
        email: "sarah.chen@email.com"
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        title: "Marketing Manager", 
        filename: "michael_rodriguez_resume.pdf",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Google Analytics", "HubSpot", "Brand Management", "Budget Management"],
        experience: 6,
        summary: "Results-driven marketing professional with proven track record in digital marketing and brand management.",
        email: "m.rodriguez@email.com"
    },
    {
        id: 3,
        name: "Emily Johnson",
        title: "Data Analyst",
        filename: "emily_johnson_resume.pdf",
        skills: ["Python", "R", "SQL", "Tableau", "Excel", "Statistical Analysis", "Machine Learning", "Data Visualization"],
        experience: 4,
        summary: "Detail-oriented data analyst skilled in transforming complex data into actionable insights.",
        email: "emily.j@email.com"
    },
    {
        id: 4,
        name: "David Park",
        title: "Project Manager",
        filename: "david_park_resume.pdf",
        skills: ["Project Management", "Agile", "Scrum", "Risk Management", "Jira", "MS Project", "Team Leadership", "Budget Management"],
        experience: 7,
        summary: "PMP-certified project manager expert in agile methodologies and cross-functional team leadership.",
        email: "david.park@email.com"
    },
    {
        id: 5,
        name: "Jessica Liu",
        title: "UX Designer",
        filename: "jessica_liu_resume.pdf",
        skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Sketch", "Adobe XD", "HTML/CSS", "Design Systems"],
        experience: 5,
        summary: "Creative UX designer passionate about creating intuitive digital experiences.",
        email: "jessica.liu@email.com"
    }
];

const jobs = [
    {
        id: 1,
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        description: "We're looking for an experienced full stack developer to join our growing team and help build innovative web applications.",
        requirements: ["JavaScript", "React", "Node.js", "MongoDB", "AWS", "Git", "Agile", "Docker"],
        experience: 5
    },
    {
        id: 2,
        title: "Digital Marketing Specialist", 
        company: "Growth Marketing Inc.",
        description: "Seeking a creative digital marketing specialist to lead our online marketing campaigns and drive brand awareness.",
        requirements: ["Digital Marketing", "SEO", "Google Analytics", "Social Media", "Content Strategy", "Email Marketing", "HubSpot"],
        experience: 4
    },
    {
        id: 3,
        title: "Senior Data Scientist",
        company: "Analytics Pro",
        description: "Join our data science team to develop predictive models and derive insights from complex datasets.",
        requirements: ["Python", "Machine Learning", "SQL", "Statistical Analysis", "Data Visualization", "R", "Deep Learning", "Tableau"],
        experience: 6
    },
    {
        id: 4,
        title: "Technical Project Manager",
        company: "Innovation Labs",
        description: "We need an experienced project manager to lead software development projects and coordinate cross-functional teams.",
        requirements: ["Project Management", "Agile", "Scrum", "Technical Knowledge", "Risk Management", "Team Leadership", "Jira"],
        experience: 5
    },
    {
        id: 5,
        title: "UI/UX Designer",
        company: "Design Studios",
        description: "Looking for a talented UI/UX designer to create beautiful and functional user interfaces for our products.",
        requirements: ["User Research", "Wireframing", "Figma", "Prototyping", "Design Systems", "HTML/CSS", "User Testing"],
        experience: 3
    }
];

// Resume content data
const resumeContent = {
    1: `# Sarah Chen
**Senior Software Developer** | **8+ Years Experience**  
📧 sarah.chen@email.com | 📱 (555) 123-4567 | 📍 Seattle, WA  
💼 LinkedIn: linkedin.com/in/sarahchen | 🌐 GitHub: github.com/sarahchen

---

## Professional Summary
Experienced software developer with 8+ years building scalable web applications. Proven track record in full-stack development, cloud architecture, and agile methodologies. Expert in modern JavaScript frameworks and backend technologies with strong focus on performance optimization and user experience.

---

## Technical Skills
**Frontend:** JavaScript, React, HTML5, CSS3, TypeScript, Redux, Webpack  
**Backend:** Node.js, Python, Express.js, RESTful APIs, GraphQL  
**Databases:** MongoDB, PostgreSQL, Redis, DynamoDB  
**Cloud & DevOps:** AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, CI/CD  
**Tools & Methods:** Git, Agile/Scrum, Jest, Docker, Jenkins, Linux

---

## Professional Experience

### **Senior Software Developer** | TechFlow Solutions  
*March 2020 - Present (4+ years)*

- Lead development of microservices architecture serving 500K+ daily active users
- Architected and implemented React-based dashboard reducing customer onboarding time by 45%
- Optimized database queries and API performance, improving response times by 60%
- Mentored 3 junior developers and conducted code reviews for team of 8 engineers
- Collaborated with product managers to define technical requirements and delivery timelines

### **Full Stack Developer** | InnovateTech Inc.  
*June 2017 - February 2020 (2.5 years)*

- Developed and maintained 5 client-facing web applications using React and Node.js
- Implemented automated testing suite increasing code coverage from 40% to 85%
- Built RESTful APIs serving mobile and web clients with 99.9% uptime
- Migrated legacy PHP applications to modern Node.js stack
- Participated in agile ceremonies and sprint planning sessions

### **Software Developer** | StartupLab  
*August 2015 - May 2017 (1.5+ years)*

- Created responsive web applications using JavaScript, HTML5, and CSS3
- Integrated third-party APIs including payment processing and authentication services
- Collaborated with UX designers to implement pixel-perfect user interfaces
- Maintained and updated legacy codebases while implementing new features
- Participated in hackathons and contributed to open-source projects

---

## Education

### **Bachelor of Science in Computer Science**  
*University of Washington, Seattle* | *Graduated: May 2015*  
**GPA:** 3.7/4.0 | **Magna Cum Laude**

**Relevant Coursework:** Data Structures & Algorithms, Database Systems, Software Engineering, Web Development, Computer Networks, Operating Systems

**Senior Project:** Developed a real-time collaborative code editor using WebSockets and React

---

## Projects & Achievements

### **E-Commerce Platform Redesign** *(2023)*
- Led complete frontend overhaul using React and TypeScript
- Implemented responsive design supporting mobile-first approach
- Achieved 35% increase in conversion rates and 50% reduction in bounce rate

### **Open Source Contribution** *(2022-Present)*
- Active contributor to popular React component library (2,000+ GitHub stars)
- Maintained documentation and resolved 50+ community issues
- Implemented new accessibility features improving WCAG compliance

---

## Certifications & Awards
- **AWS Certified Solutions Architect - Associate** *(2022)*
- **Scrum Master Certification (CSM)** *(2021)*
- **Employee of the Year - TechFlow Solutions** *(2022)*
- **Best Innovation Award - InnovateTech Hackathon** *(2019)*`,

    2: `# Michael Rodriguez
**Marketing Manager** | **6+ Years Experience**  
📧 m.rodriguez@email.com | 📱 (555) 234-5678 | 📍 Austin, TX  
💼 LinkedIn: linkedin.com/in/mrodriguez | 🌐 Portfolio: michaelrodriguez.com

---

## Professional Summary
Results-driven marketing professional with proven track record in digital marketing and brand management. Expert in developing comprehensive marketing strategies that drive growth, increase brand awareness, and optimize customer acquisition. Skilled in data-driven decision making and cross-functional team leadership.

---

## Core Competencies
**Digital Marketing:** SEO/SEM, Content Strategy, Social Media Marketing, Email Campaigns  
**Analytics & Tools:** Google Analytics, HubSpot, Salesforce, Marketo, Adobe Creative Suite  
**Strategy:** Brand Management, Budget Management, Market Research, Campaign Planning  
**Leadership:** Team Management, Cross-functional Collaboration, Stakeholder Communication

---

## Professional Experience

### **Marketing Manager** | GrowthTech Solutions  
*January 2021 - Present (3+ years)*

- Manage $2M annual marketing budget across digital and traditional channels
- Led rebranding initiative that increased brand recognition by 40% in target demographics
- Developed content strategy resulting in 250% increase in organic website traffic
- Implemented marketing automation workflows improving lead conversion by 35%
- Managed team of 5 marketing specialists and coordinated with sales, product, and design teams
- Launched successful product campaigns generating $5M in new revenue

### **Digital Marketing Specialist** | TechStart Inc.  
*March 2019 - December 2020 (1.5+ years)*

- Executed multi-channel digital marketing campaigns reaching 500K+ monthly impressions
- Optimized SEO strategy improving organic search rankings for 50+ target keywords
- Managed social media presence across 4 platforms with 100K+ combined followers
- Created and A/B tested email campaigns achieving 25% open rates and 8% CTR
- Collaborated with design team to produce marketing collateral and web content
- Analyzed campaign performance using Google Analytics and prepared monthly reports

### **Marketing Coordinator** | BrandBoost Agency  
*June 2017 - February 2019 (1.5+ years)*

- Supported marketing campaigns for 15+ B2B and B2C clients across various industries
- Managed client social media accounts and created engaging content calendars
- Conducted market research and competitor analysis to inform campaign strategies
- Assisted in organizing trade shows and corporate events for key clients
- Maintained marketing databases and CRM systems with 95% data accuracy
- Prepared campaign performance reports and client presentations

---

## Education

### **Master of Business Administration (MBA)**  
*University of Texas at Austin - McCombs School of Business* | *Graduated: May 2017*  
**Concentration:** Marketing & Strategy | **GPA:** 3.8/4.0

### **Bachelor of Arts in Communications**  
*Texas State University* | *Graduated: May 2015*  
**Minor:** Business Administration | **GPA:** 3.6/4.0

**Relevant Coursework:** Digital Marketing, Consumer Behavior, Brand Management, Market Research, Statistical Analysis, Strategic Communication

---

## Certifications & Professional Development

- **Google Analytics Certified** *(2023)*
- **HubSpot Content Marketing Certification** *(2022)*
- **Google Ads Certified** *(2022)*
- **Facebook Blueprint Certification** *(2021)*
- **Salesforce Marketing Cloud Consultant** *(2020)*

---

## Key Achievements & Projects

### **Product Launch Campaign** *(2023)*
- Orchestrated go-to-market strategy for SaaS product launch
- Achieved 150% of lead generation targets in first quarter
- Coordinated PR, content marketing, and paid advertising efforts

### **Brand Repositioning Initiative** *(2022)*
- Led comprehensive brand audit and repositioning strategy
- Developed new brand messaging and visual identity guidelines
- Resulted in 45% increase in brand sentiment scores

### **Marketing Automation Implementation** *(2021)*
- Implemented HubSpot marketing automation platform
- Created lead scoring system and nurture workflows
- Improved marketing qualified leads by 60%

---

## Professional Associations & Awards
- **American Marketing Association (AMA)** - Active Member *(2018-Present)*
- **Austin Marketing Association** - Board Member *(2022-Present)*
- **Marketing Excellence Award** - GrowthTech Solutions *(2023)*
- **Rising Star Award** - TechStart Inc. *(2020)*`,

    3: `# Emily Johnson
**Data Analyst** | **4+ Years Experience**  
📧 emily.j@email.com | 📱 (555) 345-6789 | 📍 Denver, CO  
💼 LinkedIn: linkedin.com/in/emilyjohnson | 🌐 Portfolio: emilyjdata.com

---

## Professional Summary
Detail-oriented data analyst skilled in transforming complex data into actionable insights. Expertise in statistical analysis, data visualization, and machine learning with proven ability to drive business decisions through data-driven recommendations. Strong background in Python, R, and modern analytics tools.

---

## Technical Skills
**Programming:** Python, R, SQL, JavaScript, VBA  
**Analytics Tools:** Tableau, Excel, Power BI, Google Analytics, Jupyter Notebooks  
**Machine Learning:** Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn  
**Databases:** MySQL, PostgreSQL, MongoDB, SQLite  
**Statistics:** Regression Analysis, Hypothesis Testing, A/B Testing, Predictive Modeling

---

## Professional Experience

### **Senior Data Analyst** | DataInsights Corp  
*February 2022 - Present (2+ years)*

- Analyze complex datasets containing 1M+ records to identify trends and business opportunities
- Developed predictive models improving customer retention by 25% and reducing churn rate by 15%
- Created automated reporting dashboards in Tableau serving 50+ stakeholders across departments
- Led A/B testing initiatives for marketing campaigns resulting in 20% improvement in conversion rates
- Collaborated with product and engineering teams to implement data-driven feature recommendations
- Mentored 2 junior analysts and conducted training sessions on statistical methods

### **Data Analyst** | TechMetrics Solutions  
*August 2020 - January 2022 (1.5 years)*

- Performed statistical analysis on customer behavior data to optimize user experience
- Built predictive models using Python and scikit-learn to forecast sales trends with 85% accuracy
- Designed and maintained ETL pipelines processing 100GB+ of daily transaction data
- Created executive-level reports and presentations summarizing key business metrics
- Implemented data quality checks reducing data inconsistencies by 40%
- Supported cross-functional teams with ad-hoc analysis and insights

### **Junior Data Analyst** | Analytics Plus  
*June 2019 - July 2020 (1+ year)*

- Conducted exploratory data analysis using R and Python to support business intelligence initiatives
- Developed interactive dashboards and visualizations for marketing and sales teams
- Performed market research analysis to identify customer segments and targeting opportunities
- Assisted in data collection and validation processes ensuring 95% data accuracy
- Created documentation for analytical processes and maintained data dictionaries
- Supported senior analysts with statistical modeling and hypothesis testing

---

## Education

### **Master of Science in Data Science**  
*University of Colorado Boulder* | *Graduated: May 2019*  
**GPA:** 3.9/4.0 | **Summa Cum Laude**

**Thesis:** "Predictive Analytics for Customer Lifetime Value in E-commerce"  
**Relevant Coursework:** Machine Learning, Statistical Methods, Database Systems, Data Mining, Big Data Analytics

### **Bachelor of Science in Mathematics**  
*Colorado State University* | *Graduated: May 2017*  
**Minor:** Computer Science | **GPA:** 3.7/4.0

**Senior Project:** Statistical analysis of climate data trends using R and advanced statistical methods

---

## Certifications & Professional Development

- **Tableau Desktop Certified Associate** *(2023)*
- **Google Analytics Individual Qualification (IQ)** *(2022)*
- **Microsoft Power BI Data Analyst Associate** *(2022)*
- **Python for Data Science Certification - IBM** *(2021)*
- **SQL for Data Science - University of California, Davis** *(2020)*

---

## Key Projects & Achievements

### **Customer Segmentation Analysis** *(2023)*
- Developed RFM analysis model to segment customer base into 8 distinct groups
- Implemented K-means clustering algorithm to identify high-value customer segments
- Recommendations led to 30% increase in targeted marketing campaign effectiveness

### **Sales Forecasting Model** *(2022)*
- Built time series forecasting model using ARIMA and seasonal decomposition
- Achieved 90% accuracy in quarterly sales predictions
- Model insights helped optimize inventory management saving $500K annually

### **Churn Prediction System** *(2021)*
- Created machine learning model to predict customer churn with 82% precision
- Implemented early warning system for at-risk customers
- Enabled proactive retention strategies reducing churn by 18%

---

## Publications & Presentations
- **"Leveraging Machine Learning for Customer Analytics"** - Data Science Conference 2023
- **"Statistical Methods in Business Intelligence"** - Colorado Analytics Meetup 2022
- **Co-author:** "Predictive Modeling in E-commerce" - Journal of Business Analytics (2020)

---

## Professional Associations
- **American Statistical Association (ASA)** - Member *(2019-Present)*
- **Denver Data Science Meetup** - Regular Presenter *(2020-Present)*
- **Women in Data Science (WiDS)** - Ambassador *(2021-Present)*`,

    4: `# David Park
**Project Manager** | **7+ Years Experience**  
📧 david.park@email.com | 📱 (555) 456-7890 | 📍 San Francisco, CA  
💼 LinkedIn: linkedin.com/in/davidpark | 🌐 Portfolio: davidpark-pm.com

---

## Professional Summary
PMP-certified project manager expert in agile methodologies and cross-functional team leadership. Proven track record of delivering complex projects on time and within budget. Specializes in software development projects, risk management, and stakeholder coordination with experience across fintech, healthcare, and e-commerce industries.

---

## Core Competencies
**Project Management:** Agile, Scrum, Waterfall, Risk Management, Budget Management  
**Tools & Software:** Jira, MS Project, Confluence, Slack, Trello, Monday.com  
**Leadership:** Team Leadership, Stakeholder Management, Conflict Resolution, Mentoring  
**Methodologies:** Lean, Six Sigma, Change Management, Quality Assurance

---

## Professional Experience

### **Senior Project Manager** | InnovateTech Solutions  
*March 2021 - Present (3+ years)*

- Lead portfolio of 8 concurrent software development projects with combined budget of $12M
- Manage cross-functional teams of 40+ engineers, designers, and business analysts
- Implemented agile transformation reducing project delivery time by 30% across organization
- Established PMO standards and best practices adopted company-wide
- Maintained 95% on-time delivery rate while reducing project costs by 20%
- Facilitated stakeholder meetings and presented project status to C-level executives

### **Project Manager** | FinTech Dynamics  
*June 2019 - February 2021 (1.5+ years)*

- Managed end-to-end development of mobile banking application serving 500K+ users
- Coordinated with regulatory compliance teams ensuring adherence to financial industry standards
- Led risk assessment and mitigation strategies for high-stakes financial software projects
- Facilitated daily standups, sprint planning, and retrospectives for 3 development teams
- Implemented project tracking systems improving visibility and accountability by 40%
- Successfully delivered 12 major releases with zero critical post-launch issues

### **Associate Project Manager** | HealthTech Innovations  
*January 2018 - May 2019 (1.5 years)*

- Supported senior PMs in managing healthcare software implementation projects
- Coordinated with clinical teams and IT departments for EHR system deployments
- Managed project timelines, resources, and deliverables for 5 concurrent projects
- Facilitated training sessions for end-users on new healthcare software systems
- Maintained project documentation and status reports for stakeholder communication
- Assisted in budget planning and resource allocation for $2M project portfolio

### **Business Analyst** | TechConsulting Group  
*July 2016 - December 2017 (1.5 years)*

- Analyzed business requirements and translated them into technical specifications
- Collaborated with development teams to ensure project deliverables met client expectations
- Conducted user acceptance testing and quality assurance for software implementations
- Created process documentation and workflow diagrams for business stakeholders
- Supported project managers with scheduling, resource planning, and status reporting
- Led client meetings and gathered requirements for system improvements

---

## Education

### **Master of Business Administration (MBA)**  
*Stanford Graduate School of Business* | *Graduated: June 2016*  
**Concentration:** Technology Management & Operations | **GPA:** 3.8/4.0

### **Bachelor of Science in Industrial Engineering**  
*University of California, Berkeley* | *Graduated: May 2014*  
**Minor:** Computer Science | **GPA:** 3.6/4.0

**Senior Capstone:** Process optimization project for manufacturing company resulting in 25% efficiency improvement

---

## Certifications & Professional Development

- **Project Management Professional (PMP)** *(2020)*
- **Certified Scrum Master (CSM)** *(2019)*
- **Certified SAFe 5 Agilist** *(2022)*
- **ITIL Foundation Certificate** *(2021)*
- **Lean Six Sigma Green Belt** *(2020)*
- **Google Project Management Certificate** *(2019)*

---

## Key Projects & Achievements

### **Digital Transformation Initiative** *(2023)*
- Led enterprise-wide digital transformation affecting 2,000+ employees
- Managed $8M budget and coordinated with 15 different departments
- Delivered project 3 months ahead of schedule saving $1.2M in costs

### **Mobile Banking Platform Launch** *(2020)*
- Project manager for complete mobile banking platform redesign
- Coordinated 25-person development team across 3 time zones
- Achieved 99.9% uptime in first 6 months post-launch

### **EHR System Implementation** *(2018)*
- Led implementation of electronic health records system for 5 hospitals
- Managed change management for 800+ healthcare professionals
- Completed rollout with 98% user adoption rate within 3 months

---

## Professional Associations & Awards
- **Project Management Institute (PMI)** - Active Member *(2018-Present)*
- **Scrum Alliance** - Certified Member *(2019-Present)*
- **Silicon Valley Project Management Group** - Board Member *(2022-Present)*
- **Project Excellence Award** - InnovateTech Solutions *(2023)*
- **Leadership Recognition Award** - FinTech Dynamics *(2020)*

---

## Speaking & Publications
- **"Agile Transformation in Enterprise Environments"** - PMI Global Conference 2023
- **"Risk Management in Fintech Projects"** - San Francisco PM Meetup 2022
- **Contributing Author:** "Modern Project Management Practices" - PMI Publication 2021`,

    5: `# Jessica Liu
**UX Designer** | **5+ Years Experience**  
📧 jessica.liu@email.com | 📱 (555) 567-8901 | 📍 Portland, OR  
💼 LinkedIn: linkedin.com/in/jessicaliu | 🌐 Portfolio: jessicaliu.design

---

## Professional Summary
Creative UX designer passionate about creating intuitive digital experiences. Expert in user research, interaction design, and design systems with proven ability to translate complex user needs into elegant, functional interfaces. Strong advocate for accessibility and inclusive design practices.

---

## Design Skills
**UX/UI Design:** User Research, Wireframing, Prototyping, Information Architecture  
**Design Tools:** Figma, Sketch, Adobe XD, InVision, Principle, Framer  
**Development:** HTML5, CSS3, JavaScript (ES6), React basics, Design Systems  
**Research Methods:** User Interviews, A/B Testing, Usability Testing, Analytics

---

## Professional Experience

### **Senior UX Designer** | DesignForward Studio  
*April 2022 - Present (2+ years)*

- Lead UX design for 6 client projects including e-commerce, SaaS, and mobile applications
- Conduct user research sessions with 100+ participants to inform design decisions
- Created comprehensive design system reducing design-to-development handoff time by 40%
- Mentored 2 junior designers and established UX best practices for 15-person design team
- Collaborated with product managers and engineers to define product requirements and roadmaps
- Improved key user metrics by 35% through data-driven design iterations

### **UX Designer** | TechFlow Solutions  
*September 2020 - March 2022 (1.5+ years)*

- Designed user interfaces for B2B SaaS platform serving 10,000+ business users
- Conducted competitive analysis and user journey mapping for 3 major product features
- Created high-fidelity prototypes and interactive mockups using Figma and Principle
- Facilitated design workshops with stakeholders to align on product vision and requirements
- Implemented accessibility guidelines ensuring WCAG 2.1 AA compliance across all designs
- Led usability testing sessions resulting in 25% improvement in task completion rates

### **Junior UX Designer** | StartupLab  
*January 2020 - August 2020 (8 months)*

- Supported senior designers in creating wireframes and user flows for mobile applications
- Conducted user interviews and created personas for 2 consumer-facing products
- Designed responsive web interfaces ensuring consistent experience across devices
- Collaborated with development team to implement design specifications and maintain quality
- Participated in design critiques and contributed to design system documentation
- Assisted in rebranding initiative including logo design and brand guideline creation

### **UI/UX Design Intern** | CreativeWorks Agency  
*June 2019 - December 2019 (6 months)*

- Created wireframes and mockups for client websites and mobile applications
- Assisted in user testing sessions and compiled insights for design improvements
- Learned industry-standard design tools and methodologies under senior designer mentorship
- Contributed to agency design system and component library documentation
- Participated in client presentations and design concept development sessions

---

## Education

### **Bachelor of Fine Arts in Graphic Design**  
*Portland State University* | *Graduated: May 2019*  
**Concentration:** Digital Media & Interaction Design | **GPA:** 3.8/4.0

**Senior Portfolio Project:** Mobile app design for local food delivery service with complete UX research process

**Relevant Coursework:** Interaction Design, User Experience Design, Typography, Digital Illustration, Web Design

---

## Certifications & Professional Development

- **Google UX Design Professional Certificate** *(2023)*
- **Figma Advanced Certification** *(2022)*
- **Certified Usability Analyst (CUA)** *(2022)*
- **Adobe Certified Expert (ACE) - XD** *(2021)*
- **HFI Certified Usability Analyst** *(2020)*

---

## Featured Projects

### **E-Commerce Redesign** *(2023)*
- Led complete UX redesign for online retail platform with 500K+ monthly users
- Conducted extensive user research including 50+ interviews and usability tests
- Increased conversion rate by 45% and reduced cart abandonment by 30%
- Implemented responsive design improving mobile experience significantly

### **SaaS Dashboard Design** *(2022)*
- Designed complex data visualization dashboard for business analytics platform
- Created intuitive information architecture for 20+ different report types
- Improved user task completion rate from 60% to 85% through iterative design
- Developed comprehensive design system with 100+ reusable components

### **Mobile App for Social Impact** *(2021)*
- Pro-bono UX design for nonprofit organization serving underserved communities
- Conducted field research and interviews with target user group
- Designed accessible interface accommodating users with varying tech literacy
- App achieved 4.8-star rating with 95% user retention rate

---

## Design Philosophy & Approach
- **User-Centered Design:** Every design decision backed by user research and data
- **Accessibility First:** Ensuring inclusive experiences for users of all abilities
- **Collaborative Process:** Working closely with stakeholders and development teams
- **Iterative Improvement:** Continuous testing and refinement based on user feedback

---

## Professional Associations & Recognition
- **User Experience Professionals Association (UXPA)** - Member *(2020-Present)*
- **AIGA (American Institute of Graphic Arts)** - Member *(2019-Present)*
- **Women in UX Portland** - Active Participant *(2021-Present)*
- **UX Design Excellence Award** - DesignForward Studio *(2023)*
- **Rising Designer Award** - Portland Design Week *(2022)*

---

## Speaking & Community Involvement
- **"Designing for Accessibility in Complex Applications"** - UX Portland 2023
- **"From Research to Design: Building User Empathy"** - Design & Coffee Meetup 2022
- **Workshop Facilitator:** "Introduction to Design Thinking" - Portland State University 2023`
};

// Global variables
let selectedResume = null;
let currentComparison = null;

// DOM elements
const uploadBtn = document.getElementById('uploadBtn');
const changeResumeBtn = document.getElementById('changeResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const comparisonModal = document.getElementById('comparisonModal');
const confirmSendModal = document.getElementById('confirmSendModal');
const resumeList = document.getElementById('resumeList');
const selectedResumeDiv = document.getElementById('selectedResume');
const jobListings = document.getElementById('jobListings');
const sendBtn = document.getElementById('sendBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    uploadBtn.addEventListener('click', openResumeModal);
    
    if (changeResumeBtn) {
        changeResumeBtn.addEventListener('click', openResumeModal);
    }
    
    // Close buttons
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modal;
            if (modalId) {
                document.getElementById(modalId).classList.add('hidden');
            }
        });
    });
    
    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendToCandidate);
    }
    
    // Send email button
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', sendEmailToCandidate);
    }
    
    // Confirmation modal buttons
    const confirmSendBtn = document.getElementById('confirmSendBtn');
    const cancelSendBtn = document.getElementById('cancelSendBtn');
    
    if (confirmSendBtn) {
        confirmSendBtn.addEventListener('click', confirmEmailSend);
    }
    
    if (cancelSendBtn) {
        cancelSendBtn.addEventListener('click', cancelEmailSend);
    }
    
    // Generate letter button
    const generateLetterBtn = document.getElementById('generateLetterBtn');
    if (generateLetterBtn) {
        generateLetterBtn.addEventListener('click', generateOutreachLetterWithTyping);
    }
}

// Render jobs
function renderJobs() {
    jobListings.innerHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="company-name">${job.company}</p>
                </div>
            </div>
            <p class="job-description">${job.description}</p>
            <div class="job-requirements">
                ${job.requirements.map(req => `<span class="skill-tag">${req}</span>`).join('')}
            </div>
            <button class="compare-button" data-job-id="${job.id}" ${!selectedResume ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H1l6-6v4.5z"></path>
                    <path d="M15 13h8l-6 6v-4.5z"></path>
                </svg>
                Analyze Match
            </button>
        </div>
    `).join('');

    // Add click listeners to compare buttons
    document.querySelectorAll('.compare-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const jobId = parseInt(e.target.closest('.compare-button').dataset.jobId);
            compareWithJob(jobId);
        });
    });
}

// Resume modal functions
function openResumeModal() {
    resumeModal.classList.remove('hidden');
    renderResumes();
}

function renderResumes() {
    resumeList.innerHTML = resumes.map(resume => `
        <div class="resume-option" data-resume-id="${resume.id}">
            <h4>${resume.name} - ${resume.title}</h4>
            <p><strong>File:</strong> ${resume.filename}</p>
            <p><strong>Experience:</strong> ${resume.experience} years</p>
            <p>${resume.summary}</p>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.resume-option').forEach(option => {
        option.addEventListener('click', () => selectResume(option));
    });
}

// Select resume
function selectResume(option) {
    const resumeId = parseInt(option.dataset.resumeId);
    selectedResume = resumes.find(r => r.id === resumeId);
    
    // Show selected resume area with loading state
    selectedResumeDiv.classList.remove('hidden');
    document.querySelector('.resume-preview').innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <span>Summarizing resume...</span>
        </div>
    `;
    
    resumeModal.classList.add('hidden');
    
    // Show actual resume details after 2.5 seconds
    setTimeout(() => {
        document.querySelector('.resume-preview').innerHTML = `
            <strong>${selectedResume.name}</strong> - ${selectedResume.title}<br>
            <em>${selectedResume.filename}</em><br>
            <strong>Experience:</strong> ${selectedResume.experience} years<br>
            <strong>Key Skills:</strong> ${selectedResume.skills.slice(0, 5).join(', ')}...<br><br>
            <a href="#" class="view-resume-link" onclick="openFullResume(${selectedResume.id}); return false;">View Full Resume</a>
        `;
        
        // Enable compare buttons
        document.querySelectorAll('.compare-button').forEach(btn => {
            btn.disabled = false;
        });
        
        // Re-render jobs to update button states
        renderJobs();
    }, 2500);
}

// Compare with job
function compareWithJob(jobId) {
    if (!selectedResume) {
        alert('Please select a candidate resume first');
        return;
    }
    
    const selectedJob = jobs.find(j => j.id === jobId);
    
    // Show modal with loading state immediately
    showComparisonLoadingModal(selectedJob);
    
    // Calculate match and display results after 2.5 seconds
    setTimeout(() => {
        currentComparison = calculateMatch(selectedResume, selectedJob);
        displayComparisonResults(selectedJob, currentComparison);
    }, 2500);
}

// Calculate match
function calculateMatch(resume, job) {
    const requiredSkills = job.requirements;
    const candidateSkills = resume.skills;
    
    const skillMatches = requiredSkills.map(skill => {
        const hasSkill = candidateSkills.some(s => 
            s.toLowerCase().includes(skill.toLowerCase()) || 
            skill.toLowerCase().includes(s.toLowerCase())
        );
        
        let score = 0;
        if (hasSkill) {
            score = Math.floor(Math.random() * 30) + 70; // 70-100 for matched skills
        } else {
            score = Math.floor(Math.random() * 30); // 0-30 for missing skills
        }
        
        return { 
            skill, 
            hasSkill, 
            score,
            status: hasSkill ? 'matched' : 'missing'
        };
    });
    
    // Calculate overall match percentage
    const matchedSkillsCount = skillMatches.filter(s => s.hasSkill).length;
    const skillMatchPercentage = Math.round((matchedSkillsCount / requiredSkills.length) * 100);
    
    // Calculate experience match
    const experienceMatch = Math.min(100, Math.round((resume.experience / job.experience) * 100));
    
    // Overall match (weighted: 70% skills, 30% experience)
    const overallMatch = Math.round((skillMatchPercentage * 0.7) + (experienceMatch * 0.3));
    
    return {
        overallMatch,
        skillMatchPercentage,
        experienceMatch,
        skillMatches,
        matchedSkillsCount,
        missingSkillsCount: requiredSkills.length - matchedSkillsCount,
        recruitmentAdvice: generateRecruitmentAdvice(overallMatch, skillMatches, experienceMatch, job)
    };
}

// Generate recruitment advice
function generateRecruitmentAdvice(overallMatch, skillMatches, experienceMatch, job) {
    const advice = [];
    
    if (overallMatch >= 80) {
        advice.push({
            type: 'strong',
            title: 'Strong Candidate - Proceed with Interview',
            description: 'This candidate shows excellent alignment with the role requirements. Schedule an interview to discuss specific projects and cultural fit.'
        });
    } else if (overallMatch >= 60) {
        advice.push({
            type: 'moderate',
            title: 'Potential Candidate - Consider with Training',
            description: 'Good foundation but may need some skill development. Consider if your team can provide mentoring in missing areas.'
        });
    } else {
        advice.push({
            type: 'weak',
            title: 'Skills Gap Too Large',
            description: 'Significant training would be required. Consider only if candidate shows exceptional potential in other areas.'
        });
    }
    
    const missingSkills = skillMatches.filter(s => !s.hasSkill).map(s => s.skill);
    if (missingSkills.length > 0) {
        advice.push({
            type: overallMatch >= 70 ? 'moderate' : 'weak',
            title: 'Skills Development Required',
            description: `Candidate would need training in: ${missingSkills.slice(0, 3).join(', ')}. Assess if these can be learned on the job.`
        });
    }
    
    if (experienceMatch < 80) {
        advice.push({
            type: 'moderate',
            title: 'Experience Level Consideration',
            description: `Role typically requires ${job.experience}+ years. Evaluate if candidate's quality of experience compensates for the gap.`
        });
    }
    
    return advice;
}

// Show comparison modal with loading state
function showComparisonLoadingModal(job) {
    document.getElementById('comparisonTitle').textContent = `${selectedResume.name} → ${job.title} at ${job.company}`;
    
    // Show loading state, hide results
    document.getElementById('comparisonLoading').classList.remove('hidden');
    document.getElementById('comparisonResults').classList.add('hidden');
    
    // Show modal
    comparisonModal.classList.remove('hidden');
}

// Display comparison results (after loading)
function displayComparisonResults(job, comparison) {
    // Hide loading state, show results
    document.getElementById('comparisonLoading').classList.add('hidden');
    document.getElementById('comparisonResults').classList.remove('hidden');
    
    // Update match score
    updateMatchScore(comparison.overallMatch);
    
    // Update quick stats
    document.getElementById('matchedSkills').textContent = comparison.matchedSkillsCount;
    document.getElementById('missingSkills').textContent = comparison.missingSkillsCount;
    document.getElementById('experienceMatch').textContent = `${comparison.experienceMatch}%`;
    
    // Update skills chart
    updateSkillsChart(comparison.skillMatches);
    
    // Handle outreach email
    if (comparison.overallMatch >= 50) {
        generateAndShowOutreachLetter(job);
    } else {
        document.getElementById('outreachLetterSection').classList.add('hidden');
    }
    
    // Show recruitment advice
    updateRecruitmentAdvice(comparison.recruitmentAdvice);
}

// Display comparison modal (kept for compatibility - now just calls displayComparisonResults)
function displayComparisonModal(job, comparison) {
    document.getElementById('comparisonTitle').textContent = `${selectedResume.name} → ${job.title} at ${job.company}`;
    
    // Show results immediately (no loading)
    document.getElementById('comparisonLoading').classList.add('hidden');
    document.getElementById('comparisonResults').classList.remove('hidden');
    
    displayComparisonResults(job, comparison);
    
    // Show modal
    comparisonModal.classList.remove('hidden');
}

// Update match score
function updateMatchScore(percentage) {
    const scoreCircle = document.querySelector('.score-circle');
    const matchPercentageEl = document.getElementById('matchPercentage');
    const matchMessage = document.getElementById('matchMessage');
    
    scoreCircle.style.setProperty('--score', `${percentage}%`);
    matchPercentageEl.textContent = `${percentage}%`;
    
    let message = '';
    if (percentage >= 80) {
        message = 'Strong match - Recommend proceeding with interview';
    } else if (percentage >= 60) {
        message = 'Moderate match - Consider with additional training';
    } else if (percentage >= 40) {
        message = 'Weak match - Significant skill gaps present';
    } else {
        message = 'Poor match - Not recommended for this role';
    }
    matchMessage.textContent = message;
}

// Update skills chart
function updateSkillsChart(skillMatches) {
    const skillsChart = document.getElementById('skillsChart');
    
    skillsChart.innerHTML = skillMatches.map(match => `
        <div class="skill-item">
            <span class="skill-name ${match.status}">${match.skill}</span>
            <div class="skill-bar-container">
                <div class="skill-bar ${match.status}" style="width: ${match.score}%"></div>
            </div>
            <span class="skill-score">${match.score}%</span>
        </div>
    `).join('');
}

// Generate and show outreach email
// Show celebration message for good matches
function generateAndShowOutreachLetter(job) {
    const outreachLetterSection = document.getElementById('outreachLetterSection');
    outreachLetterSection.classList.remove('hidden');
    
    // Show celebration message, hide generated letter
    document.getElementById('celebrationMessage').classList.remove('hidden');
    document.getElementById('generatedLetterContainer').classList.add('hidden');
    
    // Store job data for later use
    window.currentJobForLetter = job;
}

// Generate outreach email with typing animation
function generateOutreachLetterWithTyping() {
    const job = window.currentJobForLetter;
    
    // Hide celebration message, show generated letter container
    document.getElementById('celebrationMessage').classList.add('hidden');
    document.getElementById('generatedLetterContainer').classList.remove('hidden');
    
    const missingSkills = currentComparison.skillMatches
        .filter(s => !s.hasSkill)
        .map(s => s.skill)
        .slice(0, 3);
    
    const matchedSkills = currentComparison.skillMatches
        .filter(s => s.hasSkill)
        .map(s => s.skill)
        .slice(0, 4);
    
    const outreachLetter = `Subject: Exciting ${job.title} Opportunity at ${job.company}

Dear ${selectedResume.name},

I hope this email finds you well. I'm reaching out regarding an exciting ${job.title} opportunity at ${job.company} that aligns well with your background as a ${selectedResume.title}.

    📄 "${job.description}"

Based on your resume, I can see you have strong experience in ${matchedSkills.join(', ')}, which are key requirements for this role. Your ${selectedResume.experience} years of experience would be valuable to their team.

To strengthen your application for this position, I recommend highlighting your experience with ${matchedSkills.slice(0, 2).join(' and ')} in your cover letter.${missingSkills.length > 0 ? ` Additionally, consider gaining some exposure to ${missingSkills.join(', ')} as these are also important for the role.` : ''}

The position offers excellent growth opportunities and the chance to work with cutting-edge technologies. The team values innovation and collaboration, which seems to align well with your professional background.

Would you be interested in learning more about this opportunity? I'd be happy to schedule a brief call to discuss the role in detail and answer any questions you might have.

Best regards,
[Your Name]
[Your Title]
[Contact Information]

P.S. Based on my analysis, you have a ${currentComparison.overallMatch}% compatibility with this role - a ${currentComparison.overallMatch >= 70 ? 'strong' : currentComparison.overallMatch >= 50 ? 'moderate' : 'developing'} match that shows great potential.`;
    
    // Start typing animation
    typeOutreachLetter(outreachLetter);
}

// Typing animation function for textarea
function typeOutreachLetter(text) {
    const letterElement = document.getElementById('outreachLetter');
    const sendBtn = document.getElementById('sendBtn');
    
    letterElement.value = '';
    letterElement.classList.add('typing-animation');
    letterElement.placeholder = 'Generating email content...';
    
    // Hide the download button during typing
    sendBtn.classList.add('hidden');
    
    let index = 0;
    const typingSpeed = 20; // milliseconds per character
    
    function typeNextCharacter() {
        if (index < text.length) {
            letterElement.value += text.charAt(index);
            index++;
            setTimeout(typeNextCharacter, typingSpeed);
        } else {
            // Remove typing cursor when done and show download button
            letterElement.classList.remove('typing-animation');
            letterElement.placeholder = 'Edit your outreach email here...';
            sendBtn.classList.remove('hidden');
            
            // Show send email button
            const sendEmailBtn = document.getElementById('sendEmailBtn');
            if (sendEmailBtn) {
                sendEmailBtn.classList.remove('hidden');
            }
            
            // Add instructional text at the end
            letterElement.value += '\n\n[Feel free to edit this email and add your personal contact information]';
        }
    }
    
    typeNextCharacter();
}

// Function to get the editable email content
function getEditableEmailContent() {
    const letterElement = document.getElementById('outreachLetter');
    return letterElement.value;
}

// Update recruitment advice
function updateRecruitmentAdvice(advice) {
    const recruitmentAdvice = document.getElementById('recruitmentAdvice');
    
    recruitmentAdvice.innerHTML = advice.map(item => `
        <div class="advice-item ${item.type}">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>
    `).join('');
}

// Send to candidate (downloads the letter for demo)
function sendToCandidate() {
    const outreachLetterText = document.getElementById('outreachLetter').value;
    const blob = new Blob([outreachLetterText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach_email_${selectedResume.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Visual feedback
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Email downloaded!';
    sendBtn.style.background = '#059669';
    
    setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.style.background = '#7c3aed';
    }, 2000);
}

// Send email to candidate with confirmation modal
function sendEmailToCandidate() {
    const confirmModal = document.getElementById('confirmSendModal');
    const candidateNameElement = document.getElementById('candidateName');
    
    // Set the candidate name in the confirmation message
    if (selectedResume) {
        candidateNameElement.textContent = selectedResume.name;
    }
    
    // Show the confirmation modal
    if (confirmModal) {
        confirmModal.classList.remove('hidden');
        confirmModal.style.display = 'flex'; // Force display
    }
}

// Actually send the email (called when user confirms)
function confirmEmailSend() {
    const letterElement = document.getElementById('outreachLetter');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const confirmModal = document.getElementById('confirmSendModal');
    
    // Hide the confirmation modal
    confirmModal.classList.add('hidden');
    confirmModal.style.display = 'none'; // Force hide
    
    // Make textarea read-only
    letterElement.readOnly = true;
    
    // Update button state
    sendEmailBtn.textContent = 'Email Sent';
    sendEmailBtn.disabled = true;
    
    // Visual feedback
    sendEmailBtn.style.background = '#9ca3af';
    
    // Optional: Show a success message
    setTimeout(() => {
        alert('Email has been sent successfully!');
    }, 500);
}

// Cancel email send
function cancelEmailSend() {
    const confirmModal = document.getElementById('confirmSendModal');
    if (confirmModal) {
        confirmModal.classList.add('hidden');
        confirmModal.style.display = 'none'; // Force hide
    }
}

// Full Resume Functions
function openFullResume(resumeId) {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;
    
    const modal = document.getElementById('fullResumeModal');
    const titleElement = document.getElementById('fullResumeTitle');
    const contentElement = document.getElementById('resumeContent');
    
    // Update modal title
    titleElement.textContent = `${resume.name} - Resume`;
    
    // Show loading state
    contentElement.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <span>Loading resume...</span>
        </div>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Load resume content
    loadResumeContent(resume, contentElement);
}

function loadResumeContent(resume, contentElement) {
    // Simulate loading time
    setTimeout(() => {
        try {
            // Get the resume content from embedded data
            const markdownText = resumeContent[resume.id];
            
            if (!markdownText) {
                throw new Error('Resume content not found');
            }
            
            // Convert markdown to HTML
            const htmlContent = convertMarkdownToHTML(markdownText);
            contentElement.innerHTML = htmlContent;
        } catch (error) {
            console.error('Error loading resume:', error);
            contentElement.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load the full resume at this time.</p>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }, 1000);
}

function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Remove any leading/trailing whitespace
    html = html.trim();
    
    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert horizontal rules
    html = html.replace(/^---+$/gm, '<hr>');
    
    // Convert bullet points (handle nested structure)
    const lines = html.split('\n');
    let inList = false;
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/^- (.+)/)) {
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
            }
            processedLines.push(`<li>${line.substring(2)}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            processedLines.push(line);
        }
    }
    
    if (inList) {
        processedLines.push('</ul>');
    }
    
    html = processedLines.join('\n');
    
    // Convert paragraphs (split by double newlines)
    const paragraphs = html.split('\n\n');
    const htmlParagraphs = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';
        
        // Don't wrap headers, lists, or hrs in p tags
        if (para.match(/^<(h[1-6]|ul|hr)/)) {
            return para;
        }
        
        // Split by single newlines and join with <br> for better formatting
        const lines = para.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length === 1) {
            return `<p>${lines[0]}</p>`;
        } else {
            return `<p>${lines.join('<br>')}</p>`;
        }
    });
    
    return htmlParagraphs.filter(p => p).join('\n');
}