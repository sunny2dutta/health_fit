# Health Fit - Men's Health Assessment Platform

## Overview
Health Fit is a comprehensive web application for men's reproductive health assessment. It features an interactive multi-step questionnaire, email collection, waitlist management, and integrates with Supabase for data storage.

**Current State**: Fully functional and running on Replit with proper configuration for development and deployment.

## Recent Changes
- **2025-11-27**: Migrated project to Replit environment
  - Added ES module support to package.json
  - Fixed missing imports in src/app.js
  - Configured server to bind to 0.0.0.0:5000 for Replit webview
  - Set up workflow for automatic server restart
  - Configured deployment settings for autoscale deployment

## Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL via Supabase
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Environment**: Replit (NixOS)
- **Deployment**: Autoscale (serverless)

## Project Architecture

### Directory Structure
```
/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── config/
│   │   └── supabase.js          # Supabase client setup
│   ├── controllers/
│   │   └── UserController.js    # Request handlers
│   ├── repositories/
│   │   └── UserRepository.js    # Database operations
│   ├── routes/
│   │   └── apiRoutes.js         # API route definitions
│   ├── services/
│   │   └── UserService.js       # Business logic
│   └── utils/
│       └── AppError.js          # Error handling
├── server.js                     # Main server entry point
├── index.html                    # Main frontend page
├── admin.html                    # Admin dashboard
├── script.js                     # Frontend JavaScript
├── styles.css                    # Styling
└── package.json                  # Dependencies and config
```

### Architecture Pattern
The application follows a layered architecture:
1. **Routes** → Define API endpoints
2. **Controllers** → Handle HTTP requests/responses
3. **Services** → Business logic and validation
4. **Repositories** → Database operations
5. **Config** → External service configurations

## Environment Variables
Required environment variables (stored in Replit Secrets):
- `PORT`: Server port (default: 5000)
- `SUPABASE_SECRET_KEY`: Supabase service role key
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `ADMIN_TOKEN`: Admin authentication token

## API Endpoints
- `POST /api/save-email` - Save user email
- `POST /api/join-waitlist` - Join waitlist
- `GET /api/waitlist-count` - Get waitlist count
- `POST /api/save-personal-info` - Save personal information
- `POST /api/save-health-concerns` - Save health concerns
- `POST /api/save-service-preferences` - Save service preferences
- `POST /api/save-assessment` - Save assessment results

## Development
The application runs automatically via the "Start Server" workflow, which:
- Starts the Node.js server on port 5000
- Binds to 0.0.0.0 to be accessible via Replit's webview
- Auto-restarts on code changes (when using nodemon in dev mode)

## Deployment
Configured for autoscale deployment on Replit:
- **Deployment Type**: Autoscale (serverless, scales automatically)
- **Run Command**: `node server.js`
- **Port**: 5000 (automatically mapped by Replit)
- Environment variables are managed through Replit's Secrets panel

## Database
Uses PostgreSQL via Supabase for data persistence. The database schema includes tables for:
- User emails
- Personal information
- Health concerns
- Service preferences
- Assessment results
- Waitlist entries

## User Preferences
- Clean, modern UI following the existing design patterns
- Responsive design for mobile and desktop
- Simple, accessible navigation
- Professional health-focused branding

## Notes
- The application uses ES modules (type: "module" in package.json)
- All static files are served from the root directory
- CORS is enabled for API requests
- Error handling is centralized through AppError utility
