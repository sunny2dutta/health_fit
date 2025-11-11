const DUMMY_START = 1007;
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const requireAdmin = require('./admin-protect');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Simple session middleware for admin authentication
app.use((req, res, next) => {
    // Check for admin token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // Simple token validation - in production, use proper JWT validation
        if (token === process.env.ADMIN_TOKEN || token === 'admin-secret-token') {
            req.user = { isAdmin: true };
        }
    }
    next();
});

// Initialize PostgreSQL database
const db = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://patient_contact_user:tKii6Pxue9uEzaNa9OuvK1mmJngugfGT@dpg-d443semuk2gs739mdhh0-a.oregon-postgres.render.com/patient_contact',
    ssl: { rejectUnauthorized: false },
});

// Test the connection
db.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err.message);
    } else {
        console.log('Connected to PostgreSQL database');
        release();
        initializeDatabase();
    }
});

// Create tables if they don't exist
async function initializeDatabase() {
    const createUsersTable = `
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
        )
    `;
    
    const createAssessmentsTable = `
        CREATE TABLE IF NOT EXISTS assessments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            email VARCHAR(255) NOT NULL,
            assessment_questions TEXT NOT NULL,
            score INTEGER NOT NULL,
            answers TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    `;

    try {
        await db.query(createUsersTable);
        console.log('Users table ready');
        
        await db.query(createAssessmentsTable);
        console.log('Assessments table ready');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
}

// API endpoint to save email (now saves to users table)
app.post('/api/save-email', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const query = 'INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING user_id';
    try {
        const result = await db.query(query, [email]);
        
        res.json({ 
            success: true, 
            message: 'Email saved successfully',
            isNew: result.rows.length > 0,
            user_id: result.rows[0]?.user_id || null
        });
    } catch (err) {
        console.error('Error saving email:', err.message);
        return res.status(500).json({ error: 'Failed to save email' });
    }
});

// API endpoint to save assessment results
app.post('/api/save-assessment', async (req, res) => {
    const { email, personalInfo, score, answers } = req.body;
    
    if (!email || score === undefined || !answers) {
        return res.status(400).json({ error: 'Email, score, and answers are required' });
    }

    try {
        // First, find or create user
        const findUserQuery = 'SELECT user_id FROM users WHERE email = $1';
        const userResult = await db.query(findUserQuery, [email]);
        
        let user_id = userResult.rows[0]?.user_id;
        
        if (!user_id) {
            // User doesn't exist, create new user
            const createUserQuery = `INSERT INTO users 
                (email, full_name, date_of_birth, phone, health_concerns, service_preferences) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`;
            
            const userParams = [
                email,
                personalInfo?.name || null,
                personalInfo?.dateOfBirth || null,
                personalInfo?.phone || null,
                personalInfo?.healthConcerns ? JSON.stringify(personalInfo.healthConcerns) : null,
                personalInfo?.servicePreferences ? JSON.stringify(personalInfo.servicePreferences) : null
            ];
            
            const createResult = await db.query(createUserQuery, userParams);
            user_id = createResult.rows[0].user_id;
        } else {
            // Update existing user with personal info
            const updateUserQuery = `UPDATE users SET 
                full_name = COALESCE($1, full_name),
                date_of_birth = COALESCE($2, date_of_birth),
                phone = COALESCE($3, phone),
                health_concerns = COALESCE($4, health_concerns),
                service_preferences = COALESCE($5, service_preferences)
                WHERE user_id = $6`;
            
            const updateParams = [
                personalInfo?.name || null,
                personalInfo?.dateOfBirth || null,
                personalInfo?.phone || null,
                personalInfo?.healthConcerns ? JSON.stringify(personalInfo.healthConcerns) : null,
                personalInfo?.servicePreferences ? JSON.stringify(personalInfo.servicePreferences) : null,
                user_id
            ];
            
            await db.query(updateUserQuery, updateParams);
        }
        
        // Save assessment
        const assessmentQuery = 'INSERT INTO assessments (user_id, email, assessment_questions, score, answers) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const assessmentParams = [user_id, email, JSON.stringify(req.body.assessmentQuestions || []), score, JSON.stringify(answers)];
        
        const assessmentResult = await db.query(assessmentQuery, assessmentParams);
        
        res.json({ 
            success: true, 
            message: 'Assessment saved successfully',
            assessment_id: assessmentResult.rows[0].id,
            user_id: user_id
        });
    } catch (err) {
        console.error('Error saving assessment:', err.message);
        return res.status(500).json({ error: 'Failed to save assessment' });
    }
});

// API endpoint to get all users (admin use)
app.get('/api/users', requireAdmin, async (req, res) => {
    const query = 'SELECT user_id, email, full_name, date_of_birth, phone, health_concerns, service_preferences, created_at FROM users ORDER BY created_at DESC';
    try {
        const result = await db.query(query);
        
        // Parse JSON fields
        const users = result.rows.map(row => ({
            ...row,
            health_concerns: row.health_concerns ? JSON.parse(row.health_concerns) : [],
            service_preferences: row.service_preferences ? JSON.parse(row.service_preferences) : []
        }));
        
        res.json({ users });
    } catch (err) {
        console.error('Error fetching users:', err.message);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Keep backward compatibility for emails endpoint
app.get('/api/emails', requireAdmin, async (req, res) => {
    const query = 'SELECT user_id, email, created_at FROM users ORDER BY created_at DESC';
    try {
        const result = await db.query(query);
        res.json({ emails: result.rows });
    } catch (err) {
        console.error('Error fetching emails:', err.message);
        return res.status(500).json({ error: 'Failed to fetch emails' });
    }
});

// API endpoint to get all assessment data (admin use)
app.get('/api/assessments', requireAdmin, async (req, res) => {
    const query = `SELECT 
        a.id, a.user_id, a.score, a.answers, a.created_at,
        u.email, u.full_name, u.date_of_birth, u.phone, 
        u.health_concerns, u.service_preferences
        FROM assessments a
        JOIN users u ON a.user_id = u.user_id
        ORDER BY a.created_at DESC`;
    
    try {
        const result = await db.query(query);
        
        // Parse JSON fields
        const assessments = result.rows.map(row => ({
            ...row,
            health_concerns: row.health_concerns ? JSON.parse(row.health_concerns) : [],
            service_preferences: row.service_preferences ? JSON.parse(row.service_preferences) : [],
            answers: JSON.parse(row.answers)
        }));
        
        res.json({ assessments });
    } catch (err) {
        console.error('Error fetching assessments:', err.message);
        return res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});

// API endpoint to get assessment statistics
app.get('/api/stats', requireAdmin, async (req, res) => {
    const queries = {
        totalUsers: 'SELECT COUNT(*) as count FROM users',
        totalAssessments: 'SELECT COUNT(*) as count FROM assessments',
        averageScore: 'SELECT AVG(score) as average FROM assessments'
    };
    
    try {
        const [usersResult, assessmentsResult, avgScoreResult] = await Promise.all([
            db.query(queries.totalUsers),
            db.query(queries.totalAssessments),
            db.query(queries.averageScore)
        ]);
        
        res.json({
            totalUsers: parseInt(usersResult.rows[0].count),
            totalAssessments: parseInt(assessmentsResult.rows[0].count),
            averageScore: Math.round(parseFloat(avgScoreResult.rows[0].average) || 0)
        });
    } catch (err) {
        console.error('Error fetching stats:', err.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// API endpoint to join Menvy waitlist
app.post('/api/join-waitlist', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Check if user is already on waitlist
        const checkQuery = 'SELECT user_id, is_waitlist, waitlist_position FROM users WHERE email = $1';
        const userResult = await db.query(checkQuery, [email]);
        const row = userResult.rows[0];

        if (row && row.is_waitlist) {
            return res.json({
                success: true,
                message: 'Already on waitlist',
                position: row.waitlist_position,
                alreadyJoined: true
            });
        }

        // Get current waitlist count to determine next position
        const countQuery = 'SELECT COUNT(*) as count FROM users WHERE is_waitlist = TRUE';
        const countResult = await db.query(countQuery);
        const nextPosition = 1007 + parseInt(countResult.rows[0].count);

        if (row) {
            // Update existing user
            const updateQuery = 'UPDATE users SET is_waitlist = TRUE, waitlist_position = $1 WHERE email = $2';
            await db.query(updateQuery, [nextPosition, email]);
        } else {
            // Create new user on waitlist
            const insertQuery = 'INSERT INTO users (email, is_waitlist, waitlist_position) VALUES ($1, TRUE, $2)';
            await db.query(insertQuery, [email, nextPosition]);
        }

        res.json({
            success: true,
            message: 'Successfully joined Menvy waitlist!',
            position: nextPosition
        });
    } catch (err) {
        console.error('Error joining waitlist:', err.message);
        return res.status(500).json({ error: 'Failed to join waitlist' });
    }
});

// API endpoint to get waitlist stats
app.get('/api/waitlist-stats', async (req, res) => {
    const query = 'SELECT COUNT(*) as count FROM users WHERE is_waitlist = TRUE';
    
    try {
        const result = await db.query(query);
        const actualCount = parseInt(result.rows[0]?.count) || 0;

        res.json({
            totalWaitlist: DUMMY_START + actualCount,
            nextPosition: DUMMY_START + actualCount   // next user will get this position
        });
    } catch (err) {
        console.error('Error getting waitlist stats:', err.message);
        return res.status(500).json({ error: 'Failed to get waitlist stats' });
    }
});

// Simple admin login endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple hardcoded credentials - in production, use proper authentication
    if (username === 'admin' && password === process.env.ADMIN_PASSWORD || password === 'admin123') {
        res.json({ 
            success: true, 
            token: process.env.ADMIN_TOKEN || 'admin-secret-token',
            message: 'Login successful'
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin dashboard
app.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    try {
        await db.end();
        console.log('Database connection closed');
    } catch (err) {
        console.error('Error closing database:', err.message);
    }
    process.exit(0);
});