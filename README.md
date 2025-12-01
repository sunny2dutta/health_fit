# Men's Health Assessment & AI Companion Platform

This repository contains the source code for a privacy-focused men's health platform. It features a comprehensive health assessment tool, an AI-powered wellness companion ("Menvy"), and a waitlist management system. 

**Recently upgraded to an Enterprise-Grade Architecture:**
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + TypeScript (Express)

## 📋 Project Overview

The platform is designed to guide users through a multi-step health assessment, collecting data on:
1.  **Personal Information:** Demographics and contact details.
2.  **Health Concerns:** Specific issues like energy levels, sleep quality, etc.
3.  **Service Preferences:** What kind of help the user is looking for (TRT, weight loss, etc.).
4.  **Assessment Score:** A calculated health score based on user responses.

Additionally, it provides an **AI Chat Interface** where users can ask health-related questions to "Menvy", a specialized AI agent.

## 🏗️ Technical Stack

### Frontend (New!)
-   **Framework:** React 18
-   **Language:** TypeScript
-   **Build Tool:** Vite
-   **Styling:** CSS Modules / Global CSS
-   **State Management:** React Context API
-   **Animations:** Framer Motion
-   **Icons:** Lucide React

### Backend
-   **Runtime:** Node.js (v18+)
-   **Language:** TypeScript (Strict Mode)
-   **Framework:** Express.js
-   **Validation:** Zod (Runtime schema validation for all inputs)
-   **Security:** Helmet (Headers), Express Rate Limit (DDoS protection)
-   **Testing:** Vitest (Unit testing), c8 (Coverage)

### External Services
-   **Database:** Supabase (PostgreSQL) - Stores user data, assessments, and waitlist.
-   **AI Inference:** Fireworks AI (Qwen 2.5 72B Model) - Powers the chat interface.

## 📂 Repository Structure

```
.
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Steps, Chat, etc.)
│   │   ├── context/        # State Management (AssessmentContext)
│   │   ├── types/          # TypeScript Definitions
│   │   ├── App.tsx         # Main Application Component
│   │   └── main.tsx        # Entry Point
│   ├── vite.config.ts      # Vite Configuration
│   └── package.json        # Frontend Dependencies
├── src/                    # Express Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── repositories/       # Database access layer
│   ├── services/           # Business logic
│   ├── utils/              # Shared utilities
│   ├── validators/         # Zod schemas
│   ├── routes/             # API route definitions
│   ├── app.ts              # Express application setup
│   └── server.ts           # Application entry point
├── .github/workflows/      # CI/CD pipelines
├── package.json            # Backend Dependencies
└── tsconfig.json           # Backend TypeScript Config
```

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

2.  **Install Backend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    SUPABASE_SECRET_KEY=your_supabase_service_role_key
    FIREWORKS_API_KEY=your_fireworks_api_key
    ```

### Development

You can run the frontend and backend independently or concurrently.

**1. Start Backend (API):**
```bash
npm run dev
```
*(Runs on http://localhost:3000)*

**2. Start Frontend (UI):**
Open a new terminal:
```bash
cd client
npm run dev
```
*(Runs on http://localhost:5173)*

The frontend is configured to proxy API requests (`/api/...`) to the backend.

### Production Build

To build the entire application for production:

1.  **Build Frontend:**
    ```bash
    cd client
    npm run build
    cd ..
    ```

2.  **Build Backend:**
    ```bash
    npm run build
    ```

3.  **Start Server:**
    ```bash
    npm start
    ```
    *(The backend will serve the built React files from `client/dist`)*

## 🧪 Testing

-   **Backend Tests:** `npm test`
-   **Coverage:** `npm run test:coverage`
-   **Linting:** `npm run lint`

## 🔄 CI/CD Pipeline

A GitHub Actions workflow (`.github/workflows/ci.yml`) is configured to automatically run on every push to `main`:
1.  Installs dependencies.
2.  Lints the codebase.
3.  Builds the project to check for type errors.
4.  Runs the test suite.
