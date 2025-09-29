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

// Global variables
let selectedResume = null;
let currentComparison = null;

// DOM elements
const uploadBtn = document.getElementById('uploadBtn');
const changeResumeBtn = document.getElementById('changeResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const comparisonModal = document.getElementById('comparisonModal');
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
    
    // Show selected resume
    selectedResumeDiv.classList.remove('hidden');
    document.querySelector('.resume-preview').innerHTML = `
        <strong>${selectedResume.name}</strong> - ${selectedResume.title}<br>
        <em>${selectedResume.filename}</em><br>
        <strong>Experience:</strong> ${selectedResume.experience} years<br>
        <strong>Key Skills:</strong> ${selectedResume.skills.slice(0, 5).join(', ')}...
    `;
    
    resumeModal.classList.add('hidden');
    
    // Enable compare buttons
    document.querySelectorAll('.compare-button').forEach(btn => {
        btn.disabled = false;
    });
    
    // Re-render jobs to update button states
    renderJobs();
}

// Compare with job
function compareWithJob(jobId) {
    if (!selectedResume) {
        alert('Please select a candidate resume first');
        return;
    }
    
    const selectedJob = jobs.find(j => j.id === jobId);
    currentComparison = calculateMatch(selectedResume, selectedJob);
    
    displayComparisonModal(selectedJob, currentComparison);
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

// Display comparison modal
function displayComparisonModal(job, comparison) {
    document.getElementById('comparisonTitle').textContent = `${selectedResume.name} → ${job.title} at ${job.company}`;
    
    // Update match score
    updateMatchScore(comparison.overallMatch);
    
    // Update quick stats
    document.getElementById('matchedSkills').textContent = comparison.matchedSkillsCount;
    document.getElementById('missingSkills').textContent = comparison.missingSkillsCount;
    document.getElementById('experienceMatch').textContent = `${comparison.experienceMatch}%`;
    
    // Update skills chart
    updateSkillsChart(comparison.skillMatches);
    
    // Handle outreach letter
    if (comparison.overallMatch >= 50) {
        generateAndShowOutreachLetter(job);
    } else {
        document.getElementById('outreachLetterSection').classList.add('hidden');
    }
    
    // Show recruitment advice
    updateRecruitmentAdvice(comparison.recruitmentAdvice);
    
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

// Generate and show outreach letter
function generateAndShowOutreachLetter(job) {
    const outreachLetterSection = document.getElementById('outreachLetterSection');
    outreachLetterSection.classList.remove('hidden');
    
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

${job.description}

Based on your resume, I can see you have strong experience in ${matchedSkills.join(', ')}, which are key requirements for this role. Your ${selectedResume.experience} years of experience would be valuable to their team.

To strengthen your application for this position, I recommend highlighting your experience with ${matchedSkills.slice(0, 2).join(' and ')} in your cover letter.${missingSkills.length > 0 ? ` Additionally, consider gaining some exposure to ${missingSkills.join(', ')} as these are also important for the role.` : ''}

The position offers excellent growth opportunities and the chance to work with cutting-edge technologies. The team values innovation and collaboration, which seems to align well with your professional background.

Would you be interested in learning more about this opportunity? I'd be happy to schedule a brief call to discuss the role in detail and answer any questions you might have.

Best regards,
[Your Name]
[Your Title]
[Contact Information]

P.S. Based on my analysis, you have a ${currentComparison.overallMatch}% compatibility with this role - a ${currentComparison.overallMatch >= 70 ? 'strong' : currentComparison.overallMatch >= 50 ? 'moderate' : 'developing'} match that shows great potential.`;
    
    document.getElementById('outreachLetter').textContent = outreachLetter;
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
    const outreachLetterText = document.getElementById('outreachLetter').textContent;
    const blob = new Blob([outreachLetterText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `outreach_letter_${selectedResume.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Visual feedback
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Letter Downloaded!';
    sendBtn.style.background = '#059669';
    
    setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.style.background = '#7c3aed';
    }, 2000);
}