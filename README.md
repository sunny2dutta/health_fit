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

### Content Tables
-   `users`: waitlist and user records
-   `testimonials`: homepage testimonial content exposed via `GET /api/testimonials`

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
├── infra/terraform/        # Terraform scaffold for Cloud Run environments
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

5. **Create the testimonials table in Supabase:**
   Run [src/db/testimonials_setup.sql](/Users/debaryadutta/health_fit/src/db/testimonials_setup.sql) in your Supabase SQL editor to create and seed the homepage testimonials table.

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

A GitHub Actions workflow (`.github/workflows/ci.yml`) automatically runs on pushes and pull requests targeting `main` or `master`:
1.  Installs dependencies.
2.  Lints the codebase.
3.  Builds the project to check for type errors.
4.  Runs the test suite.

A deployment workflow (`.github/workflows/deploy.yml`) now runs automatically after CI succeeds on `main` or `master`, which covers both direct pushes and merges to `main`.

## 🏗️ Terraform Scaffold

This repo now includes an initial Terraform scaffold under `infra/terraform/` for teams that want real infrastructure-as-code instead of workflow-only deployment.

Included:
- reusable Cloud Run module
- `dev` environment entrypoint
- `prod` environment entrypoint
- support for plain env vars and Secret Manager-backed env vars

Not yet included:
- Artifact Registry repository provisioning
- image build/push pipeline integration
- Terraform backend/state configuration
- IAM and networking modules beyond the minimal Cloud Run scaffold

To start:

```bash
cd infra/terraform/envs/dev
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```

### Deployment Setup

The deploy workflow is configured for Google Cloud Run using GitHub Actions and Workload Identity Federation.

Add these GitHub Actions secrets in the repository settings:

- `GCP_PROJECT_ID`: Your Google Cloud project ID.
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: Full provider resource name, for example `projects/123456789/locations/global/workloadIdentityPools/github/providers/github`.
- `GCP_SERVICE_ACCOUNT`: Service account email used by GitHub Actions, for example `github-deployer@your-project-id.iam.gserviceaccount.com`.
- `TF_STATE_BUCKET_DEV`: GCS bucket name used for Terraform state in the dev workflow.

The workflow deploys this repo to:

- Cloud Run service: `healthfit`
- Region: `europe-west1`

The service account used above should have at least:

- `roles/run.admin`
- `roles/iam.serviceAccountUser`
- permissions required for source deployments via Cloud Build in your project

For Replit deployments, the `.replit` file is configured to use:

- Build command: `npm run build`
- Run command: `npm start`

### Terraform-backed deployment notes

The Terraform workflow expects:

- a pre-created GCS bucket for Terraform state
- Secret Manager secrets for runtime values such as `SUPABASE_SECRET_KEY` and `FIREWORKS_API_KEY`
- Workload Identity auth from GitHub Actions into GCP

The dev deployment workflow now:

1. runs tests and builds
2. initializes Terraform against the configured GCS backend
3. plans infra changes on pull requests
4. bootstraps Artifact Registry on apply runs
5. builds and pushes a tagged image
6. applies Terraform to update Cloud Run to that exact image
