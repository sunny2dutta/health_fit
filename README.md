# Men's Health Assessment & AI Companion Platform

This repository contains the source code for a privacy-focused men's health platform. It features a comprehensive health assessment tool, an AI-powered wellness companion ("Menvy"), and a waitlist management system. The application is built with a modern, type-safe Node.js backend and a vanilla JavaScript frontend.

## 📋 Project Overview

The platform is designed to guide users through a multi-step health assessment, collecting data on:
1.  **Personal Information:** Demographics and contact details.
2.  **Health Concerns:** Specific issues like energy levels, sleep quality, etc.
3.  **Service Preferences:** What kind of help the user is looking for (TRT, weight loss, etc.).
4.  **Assessment Score:** A calculated health score based on user responses.

Additionally, it provides an **AI Chat Interface** where users can ask health-related questions to "Menvy", a specialized AI agent.

## 🏗️ Technical Stack

### Backend
-   **Runtime:** Node.js (v18+)
-   **Language:** TypeScript (Strict Mode)
-   **Framework:** Express.js
-   **Validation:** Zod (Runtime schema validation for all inputs)
-   **Security:** Helmet (Headers), Express Rate Limit (DDoS protection)
-   **Testing:** Vitest (Unit testing), c8 (Coverage)
-   **Linting:** ESLint (Airbnb/Standard style), Prettier

### Frontend
-   **Core:** Vanilla JavaScript (ES6+)
-   **Styling:** Custom CSS (Responsive design)
-   **Structure:** Semantic HTML5

### External Services
-   **Database:** Supabase (PostgreSQL) - Stores user data, assessments, and waitlist.
-   **AI Inference:** Fireworks AI (Qwen 2.5 72B Model) - Powers the chat interface.

## 📂 Repository Structure

```
.
├── src/
│   ├── config/             # Configuration files (Supabase client, env vars)
│   ├── controllers/        # Request handlers (Input -> Service -> Response)
│   ├── repositories/       # Database access layer (Supabase interactions)
│   ├── services/           # Business logic & external API calls (AI, User flows)
│   ├── utils/              # Shared utilities (AppError, etc.)
│   ├── validators/         # Zod schemas for request validation
│   ├── routes/             # API route definitions
│   ├── app.ts              # Express application setup & middleware
│   └── server.ts           # Application entry point
├── dist/                   # Compiled JavaScript (Production build)
├── .github/workflows/      # CI/CD pipelines (GitHub Actions)
├── public/                 # Static assets (images, icons)
├── index.html              # Main application entry point
├── script.js               # Frontend logic (Form handling, Chat UI)
├── styles.css              # Global styles
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Test runner configuration
```

## 🔌 API Endpoints

The backend exposes a RESTful API under the `/api` prefix:

### User Management
-   `POST /api/save-email`: Registers a user's email.
-   `POST /api/join-waitlist`: Adds a user to the waitlist.
-   `GET  /api/waitlist-count`: Returns the current number of people on the waitlist.
-   `POST /api/save-personal-info`: Updates user demographics.
-   `POST /api/save-health-concerns`: Stores selected health issues.
-   `POST /api/save-service-preferences`: Stores desired services.
-   `POST /api/save-assessment`: Saves the final assessment score and answers.

### AI Chat
-   `POST /api/chat`: Sends a message history to the AI and returns the response.
    -   **Context:** Automatically injects the user's assessment context if available.
    -   **Guardrails:** Includes system prompts to restrict non-health topics.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm
-   Supabase Account (URL & Secret Key)
-   Fireworks AI Account (API Key)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone <repository-url>
    cd health_fit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    SUPABASE_SECRET_KEY=your_supabase_service_role_key
    FIREWORKS_API_KEY=your_fireworks_api_key
    ```

### Development
Start the development server with hot-reloading:
```bash
npm run dev
```

### Production Build
Compile TypeScript to JavaScript and run the production server:
```bash
npm run build
npm start
```

## 🧪 Testing & Quality Assurance

This repository enforces high code quality standards through automated tooling.

-   **Run Tests:** `npm test` (Runs Vitest suite)
-   **Coverage Report:** `npm run test:coverage` (Generates code coverage metrics)
-   **Lint Code:** `npm run lint` (Checks for style and potential errors)
-   **Format Code:** `npm run format` (Auto-formats code using Prettier)

## 🔄 CI/CD Pipeline

A GitHub Actions workflow (`.github/workflows/ci.yml`) is configured to automatically run on every push to `main`:
1.  Installs dependencies.
2.  Lints the codebase.
3.  Builds the project to check for type errors.
4.  Runs the test suite.
