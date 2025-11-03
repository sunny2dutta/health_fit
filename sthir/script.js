// Questions data
const questions = [
    {
        question: "How often do you exercise per week?",
        options: [
            { text: "5+ times per week", score: 10 },
            { text: "3-4 times per week", score: 8 },
            { text: "1-2 times per week", score: 6 },
            { text: "Occasionally", score: 4 },
            { text: "Rarely/Never", score: 2 }
        ]
    },
    {
        question: "How would you rate your stress levels?",
        options: [
            { text: "Very low", score: 10 },
            { text: "Low", score: 8 },
            { text: "Moderate", score: 6 },
            { text: "High", score: 4 },
            { text: "Very high", score: 2 }
        ]
    },
    {
        question: "How many hours of sleep do you get per night?",
        options: [
            { text: "8+ hours", score: 10 },
            { text: "7-8 hours", score: 8 },
            { text: "6-7 hours", score: 6 },
            { text: "5-6 hours", score: 4 },
            { text: "Less than 5 hours", score: 2 }
        ]
    },
    {
        question: "How would you describe your diet?",
        options: [
            { text: "Very healthy (lots of fruits, vegetables, lean protein)", score: 10 },
            { text: "Mostly healthy", score: 8 },
            { text: "Balanced", score: 6 },
            { text: "Somewhat unhealthy", score: 4 },
            { text: "Poor diet", score: 2 }
        ]
    },
    {
        question: "Do you smoke or use tobacco products?",
        options: [
            { text: "Never", score: 10 },
            { text: "Quit over a year ago", score: 8 },
            { text: "Recently quit", score: 6 },
            { text: "Occasionally", score: 4 },
            { text: "Regularly", score: 2 }
        ]
    },
    {
        question: "How often do you have regular health check-ups?",
        options: [
            { text: "Annually or more", score: 10 },
            { text: "Every 2 years", score: 8 },
            { text: "Every 3-4 years", score: 6 },
            { text: "Rarely", score: 4 },
            { text: "Never", score: 2 }
        ]
    },
    {
        question: "How would you rate your overall energy levels?",
        options: [
            { text: "Excellent", score: 10 },
            { text: "Good", score: 8 },
            { text: "Average", score: 6 },
            { text: "Below average", score: 4 },
            { text: "Poor", score: 2 }
        ]
    },
    {
        question: "Do you take any vitamins or supplements?",
        options: [
            { text: "Yes, regularly based on professional advice", score: 10 },
            { text: "Yes, regularly", score: 8 },
            { text: "Occasionally", score: 6 },
            { text: "Rarely", score: 4 },
            { text: "Never", score: 2 }
        ]
    },
    {
        question: "How often do you engage in activities that help you manage stress?",
        options: [
            { text: "Daily", score: 10 },
            { text: "Several times a week", score: 8 },
            { text: "Weekly", score: 6 },
            { text: "Occasionally", score: 4 },
            { text: "Never", score: 2 }
        ]
    },
    {
        question: "How confident do you feel about your current health status?",
        options: [
            { text: "Very confident", score: 10 },
            { text: "Confident", score: 8 },
            { text: "Somewhat confident", score: 6 },
            { text: "Not very confident", score: 4 },
            { text: "Not confident at all", score: 2 }
        ]
    }
];

let currentQuestion = 0;
let totalScore = 0;
let userEmail = '';

// DOM elements
const emailSection = document.getElementById('email-section');
const questionSection = document.getElementById('question-section');
const resultsSection = document.getElementById('results-section');
const emailForm = document.getElementById('email-form');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const restartBtn = document.getElementById('restart-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    emailForm.addEventListener('submit', handleEmailSubmit);
    nextBtn.addEventListener('click', handleNextQuestion);
    restartBtn.addEventListener('click', restartAssessment);
});

async function handleEmailSubmit(e) {
    e.preventDefault();
    userEmail = document.getElementById('email').value;
    
    // Save email to database
    try {
        const response = await fetch('/api/save-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to save email');
        }
        
        console.log('Email saved successfully:', result.message);
        
        // Hide email section and show question section
        emailSection.classList.remove('active');
        questionSection.classList.add('active');
        
        // Load first question
        loadQuestion();
        
    } catch (error) {
        console.error('Error saving email:', error);
        alert('There was an issue saving your email. Please try again.');
    }
}

function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    
    // Update progress
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        button.addEventListener('click', () => selectOption(button, option.score));
        optionsContainer.appendChild(button);
    });
    
    // Disable next button
    nextBtn.disabled = true;
}

function selectOption(selectedButton, score) {
    // Remove active class from all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add active class to selected option
    selectedButton.classList.add('selected');
    
    // Store the score for this question
    questions[currentQuestion].selectedScore = score;
    
    // Enable next button
    nextBtn.disabled = false;
}

function handleNextQuestion() {
    // Add score to total
    totalScore += questions[currentQuestion].selectedScore;
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        // Load next question
        loadQuestion();
    } else {
        // Show results
        showResults();
    }
}

async function showResults() {
    // Hide question section and show results
    questionSection.classList.remove('active');
    resultsSection.classList.add('active');
    
    // Calculate final score (out of 100)
    const finalScore = totalScore;
    
    // Collect answers for storage
    const answers = questions.map((q, index) => ({
        question: q.question,
        selectedAnswer: q.options.find(opt => opt.score === q.selectedScore)?.text,
        score: q.selectedScore
    }));
    
    // Save assessment to database
    try {
        await fetch('/api/save-assessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                score: finalScore,
                answers: answers
            })
        });
        
        console.log('Assessment saved successfully');
    } catch (error) {
        console.error('Error saving assessment:', error);
    }
    
    // Display score
    document.getElementById('score-number').textContent = finalScore;
    
    // Determine score category and recommendations
    let category, description, recommendations;
    
    if (finalScore >= 85) {
        category = "Excellent Health Profile";
        description = "Outstanding! You're demonstrating excellent health habits that contribute to optimal reproductive health and overall wellbeing.";
        recommendations = [
            "Maintain your current healthy lifestyle",
            "Consider sharing your wellness strategies with friends",
            "Stay up to date with annual health screenings"
        ];
    } else if (finalScore >= 70) {
        category = "Good Health Profile";
        description = "Great work! You have a solid foundation of healthy habits. With a few adjustments, you can achieve optimal health.";
        recommendations = [
            "Focus on areas where you scored lower",
            "Consider adding more stress management techniques",
            "Gradually increase physical activity if needed"
        ];
    } else if (finalScore >= 55) {
        category = "Moderate Health Profile";
        description = "You're on the right track! There are several areas where small improvements can make a big difference in your health and confidence.";
        recommendations = [
            "Start with one healthy habit change at a time",
            "Consider consulting a healthcare professional",
            "Focus on improving sleep quality and stress management"
        ];
    } else if (finalScore >= 40) {
        category = "Developing Health Profile";
        description = "You have opportunities to significantly improve your health and wellbeing. Small, consistent changes will build your confidence over time.";
        recommendations = [
            "Begin with basic lifestyle improvements",
            "Schedule a comprehensive health check-up",
            "Consider working with a health coach or nutritionist"
        ];
    } else {
        category = "Foundation Building Profile";
        description = "This is your starting point for building a healthier, more confident you. Every positive change you make is a step toward better health.";
        recommendations = [
            "Start with small, achievable goals",
            "Consult with healthcare professionals",
            "Focus on one area of improvement at a time"
        ];
    }
    
    document.getElementById('score-category').textContent = category;
    document.getElementById('score-description').textContent = description;
    
    const recommendationList = document.getElementById('recommendation-list');
    recommendationList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationList.appendChild(li);
    });
}

function restartAssessment() {
    // Reset variables
    currentQuestion = 0;
    totalScore = 0;
    userEmail = '';
    
    // Reset form
    document.getElementById('email').value = '';
    
    // Show email section, hide others
    resultsSection.classList.remove('active');
    questionSection.classList.remove('active');
    emailSection.classList.add('active');
    
    // Clear selected scores
    questions.forEach(q => delete q.selectedScore);
}