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

    setLoading(button, isLoading, loadingText = "Processing...") {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
        } else {
            button.textContent = button.dataset.originalText || "Continue";
            button.disabled = false;
        }
    }

    async postData(url, data) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error ${response.status}: ${errorText}`);
            }

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
        const submitBtn = this.elements.forms.email.querySelector("button");

        if (!email) return;

        // Optimistic UI: Switch immediately
        this.state.userEmail = email;
        this.switchSection(this.elements.sections.email, this.elements.sections.question);
        this.loadQuestion();

        // Save in background
        this.emailSavePromise = this.postData("/api/save-email", { email })
            .then(result => {
                if (result && result.user_id) {
                    this.state.userId = result.user_id;
                    console.log("Email saved successfully, User ID:", result.user_id);
                } else {
                    throw new Error("No user ID returned");
                }
            })
            .catch(error => {
                console.error("Email submission failed:", error);
                alert("Failed to save email. Please check your connection. Error: " + (error.message || error));
                // Optionally navigate back to email section on critical failure
                this.switchSection(this.elements.sections.question, this.elements.sections.email);
            });
    }

    // --- Step 2: Questions ---

    loadQuestion() {
        const questionData = QUESTIONS[this.state.currentQuestionIndex];
        this.elements.questionText.textContent = questionData.question;
        this.elements.optionsContainer.innerHTML = "";

        // Update progress bar
        const progressFill = document.getElementById("progress-fill");
        const progressText = document.getElementById("progress-text");
        const progress = ((this.state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Question ${this.state.currentQuestionIndex + 1} of ${QUESTIONS.length}`;

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
        const submitBtn = this.elements.forms.personalInfo.querySelector("button");

        this.setLoading(submitBtn, true);

        try {
            this.state.userData = { ...this.state.userData, name, dateOfBirth, phone };

            await this.postData("/api/save-personal-info", {
                user_id: this.state.userId,
                full_name: name,
                date_of_birth: dateOfBirth,
                phone
            });

            this.switchSection(this.elements.sections.personalInfo, this.elements.sections.healthConcerns);
        } catch (error) {
            console.error("Personal info submission failed:", error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // --- Step 4: Health Concerns ---

    async handleHealthConcernsSubmit(e) {
        e.preventDefault();
        const submitBtn = this.elements.forms.healthConcerns.querySelector("button");

        this.setLoading(submitBtn, true);

        try {
            const concerns = Array.from(
                document.querySelectorAll('input[name="health-concerns"]:checked')
            ).map(cb => cb.value);

            this.state.userData.healthConcerns = concerns;

            await this.postData("/api/save-health-concerns", {
                user_id: this.state.userId,
                concerns
            });

            this.switchSection(this.elements.sections.healthConcerns, this.elements.sections.servicePreferences);
        } catch (error) {
            console.error("Health concerns submission failed:", error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // --- Step 5: Service Preferences ---

    async handleServicePreferencesSubmit(e) {
        e.preventDefault();
        const submitBtn = this.elements.forms.servicePreferences.querySelector("button");

        this.setLoading(submitBtn, true);

        try {
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
        } catch (error) {
            console.error("Service preferences submission failed:", error);
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // --- Step 6: Results ---

    async showResults() {
        const finalScore = this.state.totalScore;

        // Save Assessment (fire and forget or await if critical)
        try {
            await this.postData("/api/save-assessment", {
                user_id: this.state.userId,
                email: this.state.userEmail,
                score: finalScore,
                answers: this.state.answers
            });
        } catch (error) {
            console.error("Assessment save failed:", error);
        }

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

    async updateWaitlistCount() {
        const countElement = document.getElementById("current-waitlist-count-results");
        if (!countElement) return;

        try {
            const response = await fetch("/api/waitlist-count");
            const data = await response.json();
            const targetCount = data.count || 1243;

            // Animate count
            let start = 0;
            const duration = 2000;
            const step = timestamp => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const current = Math.floor(progress * targetCount);
                countElement.textContent = current.toLocaleString();
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);

        } catch (error) {
            console.error("Failed to update waitlist count:", error);
            countElement.textContent = "1,243";
        }
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
// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    window.healthAssessment = new HealthAssessment();
    window.authManager = new AuthManager();
    window.menvyChat = new MenvyChat();
});

/**
 * Auth Manager - Handles Supabase Authentication
 */
class AuthManager {
    constructor() {
        // Initialize Supabase client
        this.initSupabase();

        // Note: You need to add the Supabase JS CDN to index.html first
        // For now, assuming window.supabase is available or we use fetch directly?
        // Actually, the user has supabase-js in node_modules, but for frontend vanilla JS,
        // we usually need a CDN script or a bundler. 
        // Since we are using vanilla JS without a bundler for frontend, we need the CDN.
        // I will add the CDN link to index.html in the next step.

        // Hardcoding keys for now as they are public in frontend
        this.supabaseUrl = 'https://<YOUR_SUPABASE_URL>.supabase.co';
        this.supabaseKey = '<YOUR_SUPABASE_KEY>';
        // WAIT: I don't have the keys here. I should read them from .env but I can't in browser.
        // I will assume the user will provide them or I need to inject them.
        // For this step, I will use placeholders and ask user to fill them or inject via server.

        // BETTER APPROACH: The server serves the HTML. We can inject config there.
        // But for now, let's build the UI logic.

        this.modal = document.getElementById('auth-modal');
        this.form = document.getElementById('auth-form');
        this.emailInput = document.getElementById('auth-email');
        this.passwordInput = document.getElementById('auth-password');
        this.submitBtn = document.getElementById('auth-submit-btn');
        this.errorDisplay = document.getElementById('auth-error');
        this.tabs = document.querySelectorAll('.auth-tab');
        this.closeBtn = document.getElementById('auth-close-btn');

        this.mode = 'signin'; // or 'signup'
        this.session = null;

        this.init();
    }

    async initSupabase() {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();

            if (window.supabase) {
                this.supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);

                // Check for existing session
                const { data: { session } } = await this.supabase.auth.getSession();
                this.session = session;

                // Listen for auth changes
                this.supabase.auth.onAuthStateChange((_event, session) => {
                    this.session = session;
                });
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
    }

    init() {
        // Event Listeners
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideModal());
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Check for existing session (if we had the client)
        // this.checkSession();
    }

    switchTab(mode) {
        this.mode = mode;
        this.tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`.auth-tab[data-tab="${mode}"]`).classList.add('active');
        this.submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
        this.errorDisplay.textContent = '';
    }

    showModal() {
        this.modal.style.display = 'flex';
    }

    hideModal() {
        this.modal.style.display = 'none';
        this.errorDisplay.textContent = '';
        this.form.reset();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Processing...';
        this.errorDisplay.textContent = '';

        try {
            if (!this.supabase) throw new Error('Auth service not initialized');

            const { data, error } = this.mode === 'signin'
                ? await this.supabase.auth.signInWithPassword({ email, password })
                : await this.supabase.auth.signUp({ email, password });

            if (error) throw error;

            // Success
            this.session = data.session;
            this.hideModal();

            // If chat was requested, open it
            if (window.menvyChat && window.menvyChat.pendingOpen) {
                window.menvyChat.openChat();
                window.menvyChat.pendingOpen = false;
            }

        } catch (error) {
            this.errorDisplay.textContent = error.message;
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.mode === 'signin' ? 'Sign In' : 'Sign Up';
        }
    }

    isAuthenticated() {
        return !!this.session;
    }

    getToken() {
        return this.session?.access_token;
    }
}

/**
 * Menvy Chat - AI-powered wellness chat companion
 */
class MenvyChat {
    constructor() {
        this.chatWindow = document.getElementById('chat-window');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSendBtn = document.getElementById('chat-send-btn');
        this.chatOpenBtn = document.getElementById('chat-with-menvy-btn');
        this.chatCloseBtn = document.getElementById('chat-close-btn');

        this.messages = [];
        this.isLoading = false;
        this.feedbackGiven = false;

        this.init();
    }

    init() {
        if (this.chatOpenBtn) {
            this.chatOpenBtn.addEventListener('click', () => this.openChat());
        }
        if (this.chatCloseBtn) {
            this.chatCloseBtn.addEventListener('click', () => this.closeChat());
        }
        if (this.chatSendBtn) {
            this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        }
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    openChat() {
        if (!window.authManager.isAuthenticated()) {
            this.pendingOpen = true;
            window.authManager.showModal();
            return;
        }

        if (this.chatWindow) {
            this.chatWindow.style.display = 'flex';
            this.chatInput.focus();
        }
    }

    closeChat() {
        if (this.chatWindow) {
            if (this.feedbackGiven || this.messages.length === 0) {
                this.chatWindow.style.display = 'none';
                // Reset for next time if needed, or keep history
            } else {
                this.showFeedbackPrompt();
            }
        }
    }

    showFeedbackPrompt() {
        const chatMessages = document.getElementById('chat-messages');
        const inputContainer = document.querySelector('.chat-input-container');

        if (inputContainer) inputContainer.style.display = 'none';

        chatMessages.innerHTML = `
            <div class="feedback-container">
                <div class="feedback-title">Would you be open to sharing feedback?</div>
                <div class="feedback-buttons">
                    <button class="feedback-btn yes" onclick="menvyChat.showFeedbackForm()">Yes</button>
                    <button class="feedback-btn no" onclick="menvyChat.skipFeedback()">No</button>
                </div>
            </div>
        `;
    }

    showFeedbackForm() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="feedback-container">
                <div class="feedback-title">We value your input!</div>
                <textarea class="feedback-textarea" id="feedback-text" placeholder="Tell us what you think..."></textarea>
                <button class="feedback-btn yes" style="width: 100%; max-width: none;" onclick="menvyChat.submitFeedback()">Submit Feedback</button>
                <button class="feedback-btn no" style="width: 100%; max-width: none; margin-top: 10px;" onclick="menvyChat.skipFeedback()">Cancel</button>
            </div>
        `;
    }

    skipFeedback() {
        this.feedbackGiven = true;
        this.closeChat();

        // Restore chat UI for next open (optional, or reset)
        setTimeout(() => {
            const inputContainer = document.querySelector('.chat-input-container');
            if (inputContainer) inputContainer.style.display = 'flex';
            // We might want to clear messages or keep them. For now, let's keep them but reset view if opened again?
            // Actually, simpler to just reset the flag and let the user open fresh or see history.
            // But the UI is now replaced. Let's reload messages if we wanted to preserve them.
            // For this MVP, closing resets the view state when reopened? 
            // The openChat method just shows the window. The content is now the feedback form.
            // Let's reset the content to initial state if they open it again.
            this.resetChatUI();
        }, 500);
    }

    async submitFeedback() {
        const feedbackText = document.getElementById('feedback-text').value;
        if (!feedbackText.trim()) return;

        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="feedback-container">
                <div class="feedback-title">Sending...</div>
            </div>
        `;

        const userId = window.healthAssessment?.state?.userId;
        const userEmail = window.healthAssessment?.state?.userEmail;

        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedback: feedbackText,
                    userId: userId,
                    email: userEmail
                })
            });

            chatMessages.innerHTML = `
                <div class="feedback-container">
                    <div class="feedback-title">Thank you!</div>
                    <p>Your feedback helps us improve.</p>
                </div>
            `;
        } catch (error) {
            console.error('Feedback error:', error);
            chatMessages.innerHTML = `
                <div class="feedback-container">
                    <div class="feedback-title">Thanks!</div>
                </div>
            `;
        }

        setTimeout(() => {
            this.skipFeedback();
        }, 2000);
    }

    resetChatUI() {
        const chatMessages = document.getElementById('chat-messages');
        const inputContainer = document.querySelector('.chat-input-container');

        if (inputContainer) inputContainer.style.display = 'flex';
        chatMessages.innerHTML = '';

        // Restore history
        this.messages.forEach(msg => {
            this.addMessage(msg.content, msg.role);
        });

        // If empty, show welcome
        if (this.messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="chat-message assistant">
                    <div class="message-content">
                        Hi! I'm Menvy, your AI wellness companion. Based on your assessment results, I'm here to help you understand your health better and provide personalized guidance. What would you like to know?
                    </div>
                </div>
            `;
        }
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(content)}</div>`;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        this.messages.push({ role, content });
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getAssessmentContext() {
        const scoreElement = document.getElementById('score-number');
        const categoryElement = document.getElementById('score-category');

        if (scoreElement && categoryElement) {
            const score = scoreElement.textContent;
            const category = categoryElement.textContent;
            return `User completed health assessment with score: ${score}/100 (${category})`;
        }
        return null;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isLoading) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.isLoading = true;
        this.chatSendBtn.disabled = true;
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                },
                body: JSON.stringify({
                    messages: this.messages.map(m => ({
                        role: m.role === 'assistant' ? 'assistant' : 'user',
                        content: m.content
                    })),
                    assessmentContext: this.getAssessmentContext()
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.success) {
                this.addMessage(data.message, 'assistant');
            } else {
                this.addMessage(data.message || 'Sorry, I encountered an error. Please try again.', 'assistant');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'assistant');
        } finally {
            this.isLoading = false;
            this.chatSendBtn.disabled = false;
            this.chatInput.focus();
        }
    }
}





