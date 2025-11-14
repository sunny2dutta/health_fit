# Database Migration to PostgreSQL

## Overview
Your application has been migrated from SQLite to PostgreSQL. All database queries and schema have been updated to work with PostgreSQL.

## Setup Instructions

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system:
- **macOS**: `brew install postgresql` and `brew services start postgresql`
- **Ubuntu/Debian**: `sudo apt install postgresql postgresql-contrib`
- **Windows**: Download from https://www.postgresql.org/download/

### 2. Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE health_assessment;

# Exit psql
\q
```

### 3. Set up Environment Variables
Copy the example environment file and update with your database credentials:
```bash
cp .env.example .env
```

Update `.env` with your database settings:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=health_assessment
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Run Database Schema
Execute the setup script to create tables:
```bash
psql -U postgres -d health_assessment -f setup-db.sql
```

### 5. Install Dependencies
Remove sqlite3 and ensure pg is installed:
```bash
npm install
```

### 6. Start the Application
```bash
npm start
# or for development
npm run dev
```

## Changes Made

### Schema Changes
- Changed `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY`
- Changed `TEXT` to `VARCHAR(255)` for email and name fields
- Changed `DATETIME` to `TIMESTAMP`
- Changed `TEXT` to `DATE` for date_of_birth

### Query Changes
- Updated parameter placeholders from `?` to `$1, $2, etc.`
- Changed `INSERT OR IGNORE` to `INSERT ... ON CONFLICT DO NOTHING`
- Updated all callbacks to async/await pattern
- Changed `db.run()`, `db.get()`, `db.all()` to `db.query()`

### Connection Changes
- Replaced SQLite connection with PostgreSQL Pool
- Updated connection initialization and error handling
- Modified graceful shutdown for PostgreSQL

## Data Migration (If Needed)
If you have existing SQLite data to migrate:

1. Export data from SQLite:
```bash
sqlite3 health_assessment.db ".dump" > data_export.sql
```

2. Convert SQLite dump to PostgreSQL format and import
3. Or manually export/import specific tables as needed

## Verification
Test the application by:
1. Submitting a new email
2. Completing a health assessment
3. Joining the waitlist
4. Accessing admin panel