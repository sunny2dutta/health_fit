const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

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
    const createEmailsTable = `
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createAssessmentsTable = `
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            score INTEGER NOT NULL,
            answers TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (email) REFERENCES emails (email)
        )
    `;

    db.run(createEmailsTable, (err) => {
        if (err) {
            console.error('Error creating emails table:', err.message);
        } else {
            console.log('Emails table ready');
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

// API endpoint to save email
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

    const query = 'INSERT OR IGNORE INTO emails (email) VALUES (?)';
    db.run(query, [email], function(err) {
        if (err) {
            console.error('Error saving email:', err.message);
            return res.status(500).json({ error: 'Failed to save email' });
        }
        
        res.json({ 
            success: true, 
            message: 'Email saved successfully',
            isNew: this.changes > 0
        });
    });
});

// API endpoint to save assessment results
app.post('/api/save-assessment', (req, res) => {
    const { email, score, answers } = req.body;
    
    if (!email || score === undefined || !answers) {
        return res.status(400).json({ error: 'Email, score, and answers are required' });
    }

    const query = 'INSERT INTO assessments (email, score, answers) VALUES (?, ?, ?)';
    db.run(query, [email, score, JSON.stringify(answers)], function(err) {
        if (err) {
            console.error('Error saving assessment:', err.message);
            return res.status(500).json({ error: 'Failed to save assessment' });
        }
        
        res.json({ 
            success: true, 
            message: 'Assessment saved successfully',
            id: this.lastID
        });
    });
});

// API endpoint to get all emails (admin use)
app.get('/api/emails', (req, res) => {
    const query = 'SELECT email, created_at FROM emails ORDER BY created_at DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching emails:', err.message);
            return res.status(500).json({ error: 'Failed to fetch emails' });
        }
        
        res.json({ emails: rows });
    });
});

// API endpoint to get assessment statistics
app.get('/api/stats', (req, res) => {
    const queries = {
        totalEmails: 'SELECT COUNT(*) as count FROM emails',
        totalAssessments: 'SELECT COUNT(*) as count FROM assessments',
        averageScore: 'SELECT AVG(score) as average FROM assessments'
    };
    
    Promise.all([
        new Promise((resolve, reject) => {
            db.get(queries.totalEmails, [], (err, row) => {
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
    ]).then(([totalEmails, totalAssessments, averageScore]) => {
        res.json({
            totalEmails,
            totalAssessments,
            averageScore
        });
    }).catch(err => {
        console.error('Error fetching stats:', err.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
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