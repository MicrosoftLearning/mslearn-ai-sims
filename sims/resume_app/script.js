// Sample data
const resumes = [
    {
        id: 1,
        name: "Sarah Chen",
        title: "Senior Software Developer",
        filename: "sarah_chen_resume.pdf",
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Git", "Agile"],
        experience: 8,
        summary: "Experienced software developer with 8+ years building scalable web applications."
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        title: "Marketing Manager", 
        filename: "michael_rodriguez_resume.pdf",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Google Analytics", "HubSpot", "Brand Management", "Budget Management"],
        experience: 6,
        summary: "Results-driven marketing professional with proven track record in digital marketing and brand management."
    },
    {
        id: 3,
        name: "Emily Johnson",
        title: "Data Analyst",
        filename: "emily_johnson_resume.pdf",
        skills: ["Python", "R", "SQL", "Tableau", "Excel", "Statistical Analysis", "Machine Learning", "Data Visualization"],
        experience: 4,
        summary: "Detail-oriented data analyst skilled in transforming complex data into actionable insights."
    },
    {
        id: 4,
        name: "David Park",
        title: "Project Manager",
        filename: "david_park_resume.pdf",
        skills: ["Project Management", "Agile", "Scrum", "Risk Management", "Jira", "MS Project", "Team Leadership", "Budget Management"],
        experience: 7,
        summary: "PMP-certified project manager expert in agile methodologies and cross-functional team leadership."
    },
    {
        id: 5,
        name: "Jessica Liu",
        title: "UX Designer",
        filename: "jessica_liu_resume.pdf",
        skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Sketch", "Adobe XD", "HTML/CSS", "Design Systems"],
        experience: 5,
        summary: "Creative UX designer passionate about creating intuitive digital experiences."
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
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

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
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCoverLetter);
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCoverLetter);
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
                Compare with Resume
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
        alert('Please select a resume first');
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
        suggestions: generateSuggestions(skillMatches, experienceMatch, job)
    };
}

// Generate improvement suggestions
function generateSuggestions(skillMatches, experienceMatch, job) {
    const suggestions = [];
    
    const missingSkills = skillMatches.filter(s => !s.hasSkill);
    
    if (missingSkills.length > 0) {
        suggestions.push({
            title: "Skill Development",
            description: `Consider learning: ${missingSkills.slice(0, 3).map(s => s.skill).join(', ')}. These are key requirements for this role.`
        });
    }
    
    if (experienceMatch < 80) {
        suggestions.push({
            title: "Experience Building",
            description: `This role typically requires ${job.experience}+ years of experience. Consider highlighting relevant project work or taking on additional responsibilities.`
        });
    }
    
    if (skillMatches.filter(s => s.hasSkill).length > 0) {
        suggestions.push({
            title: "Highlight Strengths",
            description: `Make sure to emphasize your expertise in ${skillMatches.filter(s => s.hasSkill).slice(0, 2).map(s => s.skill).join(' and ')} in your application.`
        });
    }
    
    return suggestions;
}

// Display comparison modal
function displayComparisonModal(job, comparison) {
    document.getElementById('comparisonTitle').textContent = `${job.title} at ${job.company}`;
    
    // Update match score
    updateMatchScore(comparison.overallMatch);
    
    // Update quick stats
    document.getElementById('matchedSkills').textContent = comparison.matchedSkillsCount;
    document.getElementById('missingSkills').textContent = comparison.missingSkillsCount;
    document.getElementById('experienceMatch').textContent = `${comparison.experienceMatch}%`;
    
    // Update skills chart
    updateSkillsChart(comparison.skillMatches);
    
    // Handle cover letter
    if (comparison.overallMatch >= 70) {
        generateAndShowCoverLetter(job);
    } else {
        document.getElementById('coverLetterSection').classList.add('hidden');
    }
    
    // Show suggestions
    updateSuggestions(comparison.suggestions);
    
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
    if (percentage >= 90) {
        message = 'Excellent match! You\'re highly qualified for this position.';
    } else if (percentage >= 70) {
        message = 'Good match! You meet most of the requirements.';
    } else if (percentage >= 50) {
        message = 'Moderate match. Consider highlighting transferable skills.';
    } else {
        message = 'Low match. You may need additional skills for this role.';
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

// Generate and show cover letter
function generateAndShowCoverLetter(job) {
    const coverLetterSection = document.getElementById('coverLetterSection');
    coverLetterSection.classList.remove('hidden');
    
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With ${selectedResume.experience} years of experience as a ${selectedResume.title}, I am confident that my skills and background make me an ideal candidate for this role.

${job.description}

Throughout my career, I have developed strong expertise in ${selectedResume.skills.slice(0, 5).join(', ')}, which directly align with your requirements. I am particularly excited about the opportunity to leverage my experience in ${selectedResume.skills[0]} and ${selectedResume.skills[1]} to contribute to your team's success.

What sets me apart is my proven track record of delivering results and my passion for continuous learning. I am eager to bring my technical skills and collaborative approach to ${job.company}.

I would welcome the opportunity to discuss how my background and skills would benefit your team. Thank you for considering my application. I look forward to speaking with you about how I can contribute to ${job.company}'s continued success.

Sincerely,
${selectedResume.name}`;
    
    document.getElementById('coverLetter').textContent = coverLetter;
}

// Update suggestions
function updateSuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestionsList');
    
    suggestionsList.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <h4>${suggestion.title}</h4>
            <p>${suggestion.description}</p>
        </div>
    `).join('');
}

// Download cover letter
function downloadCoverLetter() {
    const coverLetterText = document.getElementById('coverLetter').textContent;
    const blob = new Blob([coverLetterText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letter_${selectedResume.name.replace(/\s+/g, '_')}_${currentComparison ? 'job' : 'generic'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Copy cover letter to clipboard
function copyCoverLetter() {
    const coverLetterText = document.getElementById('coverLetter').textContent;
    navigator.clipboard.writeText(coverLetterText).then(() => {
        // Temporary feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#38a169';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#667eea';
        }, 2000);
    });
}