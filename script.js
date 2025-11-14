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
            { text: "Very healthy", score: 10 },
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
    }
];

// Global state
let currentQuestion = 0;
let totalScore = 0;
let userEmail = "";
let userId = null;   // ← CRITICAL
let userData = {};

// DOM elements
const emailSection = document.getElementById("email-section");
const questionSection = document.getElementById("question-section");
const personalInfoSection = document.getElementById("personal-info-section");
const healthConcernsSection = document.getElementById("health-concerns-section");
const servicePreferencesSection = document.getElementById("service-preferences-section");
const resultsSection = document.getElementById("results-section");

document.getElementById("email-form").addEventListener("submit", handleEmailSubmit);
document.getElementById("personal-info-form").addEventListener("submit", handlePersonalInfoSubmit);
document.getElementById("health-concerns-form").addEventListener("submit", handleHealthConcernsSubmit);
document.getElementById("service-preferences-form").addEventListener("submit", handleServicePreferencesSubmit);
document.getElementById("restart-btn").addEventListener("click", restartAssessment);

/* ----------------------------------------------------------
   SAVE EMAIL → get user_id
---------------------------------------------------------- */
async function handleEmailSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    userEmail = email;

    const res = await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const result = await res.json();
    userId = result.user_id; // ← IMPORTANT

    emailSection.classList.remove("active");
    questionSection.classList.add("active");
    loadQuestion();
}

/* ----------------------------------------------------------
   Load Questions
---------------------------------------------------------- */
function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question-text").textContent = q.question;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.text;
        btn.onclick = () => {
            questions[currentQuestion].selectedScore = opt.score;
            document.getElementById("next-btn").disabled = false;
            document.querySelectorAll(".option-btn").forEach(b =>
                b.classList.remove("selected")
            );
            btn.classList.add("selected");
        };
        optionsContainer.appendChild(btn);
    });

    document.getElementById("next-btn").disabled = true;
}

/* ----------------------------------------------------------
   Next question or personal info
---------------------------------------------------------- */
document.getElementById("next-btn").onclick = () => {
    totalScore += questions[currentQuestion].selectedScore;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        questionSection.classList.remove("active");
        personalInfoSection.classList.add("active");
    }
};

/* ----------------------------------------------------------
   SAVE PERSONAL INFO
---------------------------------------------------------- */
async function handlePersonalInfoSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("full-name").value.trim();
    const dateOfBirth = document.getElementById("dob").value;
    const phone = document.getElementById("phone").value.trim();

    userData.name = name;
    userData.dateOfBirth = dateOfBirth;
    userData.phone = phone;

    await fetch("/api/save-personal-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,          // ← FIXED
            full_name: name,
            date_of_birth: dateOfBirth,
            phone
        })
    });

    personalInfoSection.classList.remove("active");
    healthConcernsSection.classList.add("active");
}

/* ----------------------------------------------------------
   SAVE HEALTH CONCERNS
---------------------------------------------------------- */
async function handleHealthConcernsSubmit(e) {
    e.preventDefault();

    const concerns = Array.from(
        document.querySelectorAll('input[name="health-concerns"]:checked')
    ).map(cb => cb.value);

    userData.healthConcerns = concerns;

    await fetch("/api/save-health-concerns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,         // ← FIXED
            concerns
        })
    });

    healthConcernsSection.classList.remove("active");
    servicePreferencesSection.classList.add("active");
}

/* ----------------------------------------------------------
   SAVE SERVICE PREFERENCES
---------------------------------------------------------- */
async function handleServicePreferencesSubmit(e) {
    e.preventDefault();

    const preferences = Array.from(
        document.querySelectorAll('input[name="service-preferences"]:checked')
    ).map(cb => cb.value);

    userData.servicePreferences = preferences;

    await fetch("/api/save-service-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,         // ← FIXED
            preferences
        })
    });

    servicePreferencesSection.classList.remove("active");
    showResults();
}

/* ----------------------------------------------------------
   SAVE FINAL ASSESSMENT + Show results
---------------------------------------------------------- */
/* ----------------------------------------------------------
   SHOW RESULTS + SAVE ASSESSMENT
---------------------------------------------------------- */
async function showResults() {
    // Reveal the results section
    resultsSection.classList.add("active");

    // Compute final score
    const finalScore = totalScore;

    // Build answers array correctly
    const answers = questions.map(q => ({
        question: q.question,
        selectedAnswer: q.options.find(o => o.score === q.selectedScore)?.text || null,
        score: q.selectedScore || 0
    }));

    // Save to backend
    try {
        await fetch("/api/save-assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                email: userEmail,
                score: finalScore,
                answers
            })
        });

        console.log("Assessment saved");
    } catch (err) {
        console.error("❌ Failed to save assessment", err);
    }

    // Update score on screen
    document.getElementById("score-number").textContent = finalScore;

    // Select category + recommendations
    let category, description, recommendations;

    if (finalScore >= 85) {
        category = "Excellent Health Profile";
        description = "Outstanding! You're demonstrating excellent health habits.";
        recommendations = [
            "Maintain your current healthy lifestyle",
            "Share your wellness strategies with others",
            "Stay up to date with annual checkups"
        ];
    } else if (finalScore >= 70) {
        category = "Good Health Profile";
        description = "Great work! Your health foundation is strong.";
        recommendations = [
            "Improve stress management techniques",
            "Increase physical activity slightly",
            "Focus on your lowest scoring areas"
        ];
    } else if (finalScore >= 55) {
        category = "Moderate Health Profile";
        description = "You're doing well but can improve in key areas.";
        recommendations = [
            "Start one new healthy habit this week",
            "Improve sleep and stress balance",
            "Consider a health professional consult"
        ];
    } else if (finalScore >= 40) {
        category = "Developing Health Profile";
        description = "You have many opportunities for meaningful improvements.";
        recommendations = [
            "Begin with simple lifestyle changes",
            "Schedule a health checkup",
            "Try a health coach or nutritionist"
        ];
    } else {
        category = "Foundation Building Profile";
        description = "This is your starting point toward better health.";
        recommendations = [
            "Start with small achievable goals",
            "Consult a healthcare professional",
            "Focus on one improvement at a time"
        ];
    }

    // Update UI
    document.getElementById("score-category").textContent = category;
    document.getElementById("score-description").textContent = description;

    const recommendationList = document.getElementById("recommendation-list");
    recommendationList.innerHTML = "";
    recommendations.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        recommendationList.appendChild(li);
    });

    // Update waitlist counter
    updateWaitlistCounterDisplay();
}

/* ----------------------------------------------------------
   Restart Assessment
---------------------------------------------------------- */
/* ----------------------------------------------------------
   RESTART ASSESSMENT
---------------------------------------------------------- */
function restartAssessment() {
    // Reset state
    currentQuestion = 0;
    totalScore = 0;
    userEmail = "";
    userId = null;
    userData = {};

    // Reset form fields
    document.getElementById("email").value = "";
    document.getElementById("full-name").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("phone").value = "";

    // Reset checkboxes
    document.querySelectorAll("input[name='health-concerns']").forEach(cb => cb.checked = false);
    document.querySelectorAll("input[name='service-preferences']").forEach(cb => cb.checked = false);

    // Reset question scores
    questions.forEach(q => delete q.selectedScore);

    // Reset UI visibility
    resultsSection.classList.remove("active");
    questionSection.classList.remove("active");
    personalInfoSection.classList.remove("active");
    healthConcernsSection.classList.remove("active");
    servicePreferencesSection.classList.remove("active");

    emailSection.classList.add("active");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}





