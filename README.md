# Health Fit - Men's Health Assessment Platform

A comprehensive web application for men's reproductive health assessment with email collection, waitlist management, and admin dashboard.

## 🚀 Features

- **Health Assessment**: Interactive questionnaire for men's reproductive health
- **Email Collection**: Capture user emails for marketing and follow-up
- **Waitlist Management**: Users can join a waitlist for updates
- **Admin Dashboard**: Protected admin interface for managing data
- **Database Storage**: PostgreSQL backend with Supabase integration
- **Responsive Design**: Mobile-friendly user interface

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (migrated from SQLite)
- **Cloud Database**: Supabase
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Authentication**: Token-based admin authentication
- **Deployment**: Docker support included

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health_fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   SUPABASE_SECRET_KEY=your_supabase_service_role_key
   ADMIN_TOKEN=your_admin_secret_token
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=health_assessment
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb health_assessment
   
   # Run the setup script
   psql -U postgres -d health_assessment -f setup-db.sql
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
health_fit/
├── index.html              # Main landing page
├── admin.html             # Admin dashboard
├── server.js              # Express server and API routes
├── script.js              # Main frontend JavaScript
├── styles.css             # Application styles
├── supabaseClient.js      # Supabase client configuration
├── setup-db.sql           # Database schema
├── admin-protect.js       # Admin authentication middleware
├── Dockerfile             # Docker configuration
├── DATABASE_MIGRATION.md  # Migration documentation
├── test-*.js              # API test files
└── sthir/                 # Additional scripts
    └── script.js
```

## 🔐 Admin Access

The admin panel is protected by token authentication. Access it at `/admin.html` with the proper authorization header or token.

## 📊 API Endpoints

- `POST /api/collect-email` - Collect user emails
- `POST /api/submit-assessment` - Submit health assessment
- `POST /api/join-waitlist` - Join the waitlist
- `GET /api/admin/emails` - Get all emails (admin only)
- `GET /api/admin/assessments` - Get all assessments (admin only)
- `GET /api/admin/waitlist` - Get waitlist entries (admin only)

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t health-fit .

# Run the container
docker run -p 3000:3000 --env-file .env health-fit
```

## 🧪 Testing

The project includes several test files for API endpoints:

```bash
node test-server-api.js      # Test server endpoints
node test-assessment-api.js  # Test assessment functionality
node test-email-api.js       # Test email collection
node test-waitlist-api.js    # Test waitlist functionality
node test-supabase.js        # Test Supabase integration
```

## 📈 Database Migration

This project has been migrated from SQLite to PostgreSQL. See `DATABASE_MIGRATION.md` for detailed migration information and setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 🆘 Support

For support and questions, please refer to the project documentation or create an issue in the repository.