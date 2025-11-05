const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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

// Initialize SQLite database
const db = new sqlite3.Database('health_assessment.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables if they don't exist
function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            date_of_birth TEXT,
            phone TEXT,
            health_concerns TEXT,
            service_preferences TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createAssessmentsTable = `
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            answers TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        )
    `;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready');
        }
    });

    db.run(createAssessmentsTable, (err) => {
        if (err) {
            console.error('Error creating assessments table:', err.message);
        } else {
            console.log('Assessments table ready');
        }
    });
}

// API endpoint to save email (now saves to users table)
app.post('/api/save-email', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const query = 'INSERT OR IGNORE INTO users (email) VALUES (?)';
    db.run(query, [email], function(err) {
        if (err) {
            console.error('Error saving email:', err.message);
            return res.status(500).json({ error: 'Failed to save email' });
        }
        
        res.json({ 
            success: true, 
            message: 'Email saved successfully',
            isNew: this.changes > 0,
            user_id: this.lastID || null
        });
    });
});

// API endpoint to save assessment results
app.post('/api/save-assessment', (req, res) => {
    const { email, personalInfo, score, answers } = req.body;
    
    if (!email || score === undefined || !answers) {
        return res.status(400).json({ error: 'Email, score, and answers are required' });
    }

    // First, find or create user
    const findUserQuery = 'SELECT user_id FROM users WHERE email = ?';
    db.get(findUserQuery, [email], (err, row) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).json({ error: 'Failed to find user' });
        }
        
        let user_id = row?.user_id;
        
        if (!user_id) {
            // User doesn't exist, create new user
            const createUserQuery = `INSERT INTO users 
                (email, full_name, date_of_birth, phone, health_concerns, service_preferences) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            
            const userParams = [
                email,
                personalInfo?.name || null,
                personalInfo?.dateOfBirth || null,
                personalInfo?.phone || null,
                personalInfo?.healthConcerns ? JSON.stringify(personalInfo.healthConcerns) : null,
                personalInfo?.servicePreferences ? JSON.stringify(personalInfo.servicePreferences) : null
            ];
            
            db.run(createUserQuery, userParams, function(err) {
                if (err) {
                    console.error('Error creating user:', err.message);
                    return res.status(500).json({ error: 'Failed to create user' });
                }
                
                saveAssessment(this.lastID);
            });
        } else {
            // Update existing user with personal info
            const updateUserQuery = `UPDATE users SET 
                full_name = COALESCE(?, full_name),
                date_of_birth = COALESCE(?, date_of_birth),
                phone = COALESCE(?, phone),
                health_concerns = COALESCE(?, health_concerns),
                service_preferences = COALESCE(?, service_preferences)
                WHERE user_id = ?`;
            
            const updateParams = [
                personalInfo?.name || null,
                personalInfo?.dateOfBirth || null,
                personalInfo?.phone || null,
                personalInfo?.healthConcerns ? JSON.stringify(personalInfo.healthConcerns) : null,
                personalInfo?.servicePreferences ? JSON.stringify(personalInfo.servicePreferences) : null,
                user_id
            ];
            
            db.run(updateUserQuery, updateParams, (err) => {
                if (err) {
                    console.error('Error updating user:', err.message);
                    return res.status(500).json({ error: 'Failed to update user' });
                }
                
                saveAssessment(user_id);
            });
        }
        
        function saveAssessment(userId) {
            const assessmentQuery = 'INSERT INTO assessments (user_id, score, answers) VALUES (?, ?, ?)';
            const assessmentParams = [userId, score, JSON.stringify(answers)];
            
            db.run(assessmentQuery, assessmentParams, function(err) {
                if (err) {
                    console.error('Error saving assessment:', err.message);
                    return res.status(500).json({ error: 'Failed to save assessment' });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Assessment saved successfully',
                    assessment_id: this.lastID,
                    user_id: userId
                });
            });
        }
    });
});

// API endpoint to get all users (admin use)
app.get('/api/users', requireAdmin, (req, res) => {
    const query = 'SELECT user_id, email, full_name, date_of_birth, phone, health_concerns, service_preferences, created_at FROM users ORDER BY created_at DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        
        // Parse JSON fields
        const users = rows.map(row => ({
            ...row,
            health_concerns: row.health_concerns ? JSON.parse(row.health_concerns) : [],
            service_preferences: row.service_preferences ? JSON.parse(row.service_preferences) : []
        }));
        
        res.json({ users });
    });
});

// Keep backward compatibility for emails endpoint
app.get('/api/emails', requireAdmin, (req, res) => {
    const query = 'SELECT user_id, email, created_at FROM users ORDER BY created_at DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching emails:', err.message);
            return res.status(500).json({ error: 'Failed to fetch emails' });
        }
        
        res.json({ emails: rows });
    });
});

// API endpoint to get all assessment data (admin use)
app.get('/api/assessments', requireAdmin, (req, res) => {
    const query = `SELECT 
        a.id, a.user_id, a.score, a.answers, a.created_at,
        u.email, u.full_name, u.date_of_birth, u.phone, 
        u.health_concerns, u.service_preferences
        FROM assessments a
        JOIN users u ON a.user_id = u.user_id
        ORDER BY a.created_at DESC`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching assessments:', err.message);
            return res.status(500).json({ error: 'Failed to fetch assessments' });
        }
        
        // Parse JSON fields
        const assessments = rows.map(row => ({
            ...row,
            health_concerns: row.health_concerns ? JSON.parse(row.health_concerns) : [],
            service_preferences: row.service_preferences ? JSON.parse(row.service_preferences) : [],
            answers: JSON.parse(row.answers)
        }));
        
        res.json({ assessments });
    });
});

// API endpoint to get assessment statistics
app.get('/api/stats', requireAdmin, (req, res) => {
    const queries = {
        totalUsers: 'SELECT COUNT(*) as count FROM users',
        totalAssessments: 'SELECT COUNT(*) as count FROM assessments',
        averageScore: 'SELECT AVG(score) as average FROM assessments'
    };
    
    Promise.all([
        new Promise((resolve, reject) => {
            db.get(queries.totalUsers, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        }),
        new Promise((resolve, reject) => {
            db.get(queries.totalAssessments, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        }),
        new Promise((resolve, reject) => {
            db.get(queries.averageScore, [], (err, row) => {
                if (err) reject(err);
                else resolve(Math.round(row.average || 0));
            });
        })
    ]).then(([totalUsers, totalAssessments, averageScore]) => {
        res.json({
            totalUsers,
            totalAssessments,
            averageScore
        });
    }).catch(err => {
        console.error('Error fetching stats:', err.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    });
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
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});