-- Health Assessment Database Setup
-- Run this SQL script in your PostgreSQL database to create the required schema

-- Create the database (run this as superuser)
-- CREATE DATABASE health_assessment;

-- Connect to the database
\c health_assessment;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    date_of_birth DATE,
    phone VARCHAR(20),
    health_concerns TEXT,
    service_preferences TEXT,
    is_waitlist BOOLEAN DEFAULT FALSE,
    waitlist_position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    assessment_questions TEXT NOT NULL,
    score INTEGER NOT NULL,
    answers TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_waitlist ON users(is_waitlist) WHERE is_waitlist = TRUE;
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);

-- Display table info
\d users;
\d assessments;