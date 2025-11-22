/**
 * Health Assessment Application
 * Handles the multi-step health assessment form flow.
 */

const QUESTIONS = [
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

class HealthAssessment {
    constructor() {
        this.state = {
            currentQuestionIndex: 0,
            totalScore: 0,
            userEmail: "",
            userId: null,
            userData: {},
            answers: []
        };

        this.elements = {
            sections: {
                email: document.getElementById("email-section"),
                question: document.getElementById("question-section"),
                personalInfo: document.getElementById("personal-info-section"),
                healthConcerns: document.getElementById("health-concerns-section"),
                servicePreferences: document.getElementById("service-preferences-section"),
                results: document.getElementById("results-section")
            },
            forms: {
                email: document.getElementById("email-form"),
                personalInfo: document.getElementById("personal-info-form"),
                healthConcerns: document.getElementById("health-concerns-form"),
                servicePreferences: document.getElementById("service-preferences-form")
            },
            questionText: document.getElementById("question-text"),
            optionsContainer: document.getElementById("options-container"),
            nextBtn: document.getElementById("next-btn"),
            restartBtn: document.getElementById("restart-btn"),
            results: {
                scoreNumber: document.getElementById("score-number"),
                category: document.getElementById("score-category"),
                description: document.getElementById("score-description"),
                recommendationList: document.getElementById("recommendation-list")
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.elements.forms.email.addEventListener("submit", (e) => this.handleEmailSubmit(e));
        this.elements.forms.personalInfo.addEventListener("submit", (e) => this.handlePersonalInfoSubmit(e));
        this.elements.forms.healthConcerns.addEventListener("submit", (e) => this.handleHealthConcernsSubmit(e));
        this.elements.forms.servicePreferences.addEventListener("submit", (e) => this.handleServicePreferencesSubmit(e));
        this.elements.nextBtn.addEventListener("click", () => this.handleNextQuestion());
        this.elements.restartBtn.addEventListener("click", () => this.restartAssessment());
    }

    switchSection(fromSection, toSection) {
        if (fromSection) fromSection.classList.remove("active");
        if (toSection) toSection.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async postData(url, data) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${url}:`, error);
            throw error;
        }
    }

    // --- Step 1: Email ---

    async handleEmailSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim();

        if (!email) return;

        this.state.userEmail = email;

        const result = await this.postData("/api/save-email", { email });

        if (result && result.user_id) {
            this.state.userId = result.user_id;
            this.switchSection(this.elements.sections.email, this.elements.sections.question);
            this.loadQuestion();
        }
    }

    // --- Step 2: Questions ---

    loadQuestion() {
        const questionData = QUESTIONS[this.state.currentQuestionIndex];
        this.elements.questionText.textContent = questionData.question;
        this.elements.optionsContainer.innerHTML = "";

        questionData.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opt.text;
            btn.onclick = () => this.selectOption(btn, opt.score, opt.text);
            this.elements.optionsContainer.appendChild(btn);
        });

        this.elements.nextBtn.disabled = true;
    }

    selectOption(selectedBtn, score, text) {
        // Store temporary selection
        this.state.currentSelection = { score, text };

        // Update UI
        document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        selectedBtn.classList.add("selected");
        this.elements.nextBtn.disabled = false;
    }

    handleNextQuestion() {
        const { score, text } = this.state.currentSelection;

        // Save answer
        this.state.answers.push({
            question: QUESTIONS[this.state.currentQuestionIndex].question,
            selectedAnswer: text,
            score: score
        });

        this.state.totalScore += score;
        this.state.currentQuestionIndex++;

        if (this.state.currentQuestionIndex < QUESTIONS.length) {
            this.loadQuestion();
        } else {
            this.switchSection(this.elements.sections.question, this.elements.sections.personalInfo);
        }
    }

    // --- Step 3: Personal Info ---

    async handlePersonalInfoSubmit(e) {
        e.preventDefault();
        const name = document.getElementById("full-name").value.trim();
        const dateOfBirth = document.getElementById("dob").value;
        const phone = document.getElementById("phone").value.trim();

        this.state.userData = { ...this.state.userData, name, dateOfBirth, phone };

        await this.postData("/api/save-personal-info", {
            user_id: this.state.userId,
            full_name: name,
            date_of_birth: dateOfBirth,
            phone
        });

        this.switchSection(this.elements.sections.personalInfo, this.elements.sections.healthConcerns);
    }

    // --- Step 4: Health Concerns ---

    async handleHealthConcernsSubmit(e) {
        e.preventDefault();
        const concerns = Array.from(
            document.querySelectorAll('input[name="health-concerns"]:checked')
        ).map(cb => cb.value);

        this.state.userData.healthConcerns = concerns;

        await this.postData("/api/save-health-concerns", {
            user_id: this.state.userId,
            concerns
        });

        this.switchSection(this.elements.sections.healthConcerns, this.elements.sections.servicePreferences);
    }

    // --- Step 5: Service Preferences ---

    async handleServicePreferencesSubmit(e) {
        e.preventDefault();
        const preferences = Array.from(
            document.querySelectorAll('input[name="service-preferences"]:checked')
        ).map(cb => cb.value);

        this.state.userData.servicePreferences = preferences;

        await this.postData("/api/save-service-preferences", {
            user_id: this.state.userId,
            preferences
        });

        this.switchSection(this.elements.sections.servicePreferences, this.elements.sections.results);
        this.showResults();
    }

    // --- Step 6: Results ---

    async showResults() {
        const finalScore = this.state.totalScore;

        // Save Assessment
        await this.postData("/api/save-assessment", {
            user_id: this.state.userId,
            email: this.state.userEmail,
            score: finalScore,
            answers: this.state.answers
        });

        // Display Results
        this.elements.results.scoreNumber.textContent = finalScore;

        const profile = this.getHealthProfile(finalScore);
        this.elements.results.category.textContent = profile.category;
        this.elements.results.description.textContent = profile.description;

        this.elements.results.recommendationList.innerHTML = "";
        profile.recommendations.forEach(rec => {
            const li = document.createElement("li");
            li.textContent = rec;
            this.elements.results.recommendationList.appendChild(li);
        });
    }

    getHealthProfile(score) {
        if (score >= 85) {
            return {
                category: "Excellent Health Profile",
                description: "Outstanding! You're demonstrating excellent health habits.",
                recommendations: [
                    "Maintain your current healthy lifestyle",
                    "Share your wellness strategies with others",
                    "Stay up to date with annual checkups"
                ]
            };
        } else if (score >= 70) {
            return {
                category: "Good Health Profile",
                description: "Great work! Your health foundation is strong.",
                recommendations: [
                    "Improve stress management techniques",
                    "Increase physical activity slightly",
                    "Focus on your lowest scoring areas"
                ]
            };
        } else if (score >= 55) {
            return {
                category: "Moderate Health Profile",
                description: "You're doing well but can improve in key areas.",
                recommendations: [
                    "Start one new healthy habit this week",
                    "Improve sleep and stress balance",
                    "Consider a health professional consult"
                ]
            };
        } else if (score >= 40) {
            return {
                category: "Developing Health Profile",
                description: "You have many opportunities for meaningful improvements.",
                recommendations: [
                    "Begin with simple lifestyle changes",
                    "Schedule a health checkup",
                    "Try a health coach or nutritionist"
                ]
            };
        } else {
            return {
                category: "Foundation Building Profile",
                description: "This is your starting point toward better health.",
                recommendations: [
                    "Start with small achievable goals",
                    "Consult a healthcare professional",
                    "Focus on one improvement at a time"
                ]
            };
        }
    }

    restartAssessment() {
        // Reset State
        this.state = {
            currentQuestionIndex: 0,
            totalScore: 0,
            userEmail: "",
            userId: null,
            userData: {},
            answers: []
        };

        // Reset Forms
        Object.values(this.elements.forms).forEach(form => form.reset());

        // Reset UI
        this.switchSection(this.elements.sections.results, this.elements.sections.email);

        // Ensure other sections are hidden (in case of mid-flow restart)
        Object.values(this.elements.sections).forEach(section => {
            if (section !== this.elements.sections.email) {
                section.classList.remove("active");
            }
        });
    }
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    new HealthAssessment();
});





