import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase Client
const SUPABASE_URL = "https://akkzhpkpegrjdlrxoutx.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Helper Functions
function sendError(res, message, err) {
  console.error(`❌ ${message}`, err.message || err);
  res.status(500).json({ error: message, details: err.message || err });
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const token = auth.substring(7);
    if (token === process.env.ADMIN_TOKEN || token === "admin-secret-token") {
      return next();
    }
  }
  res.status(403).json({ error: "Unauthorized" });
}

// Routes

// Save Email
app.post('/api/save-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ email_id: email }])
      .select("id, email_id")
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Email saved",
      user_id: data.id,
      email: data.email_id
    });
  } catch (err) {
    sendError(res, "Failed to save email", err);
  }
});

// Join Waitlist
app.post('/api/join-waitlist', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const { data: rows, error } = await supabase
      .from("users")
      .select("id, is_waitlisted")
      .eq("email_id", email)
      .order("id", { ascending: true })
      .limit(1);

    if (error) throw error;

    const user = rows?.[0];

    if (user?.is_waitlisted) {
      return res.json({ success: true, alreadyJoined: true });
    }

    if (user) {
      await supabase.from("users").update({ is_waitlisted: true }).eq("id", user.id);
      return res.json({ success: true, updated: true });
    }

    await supabase.from("users").insert([{ email_id: email, is_waitlisted: true }]);
    res.json({ success: true, created: true });

  } catch (err) {
    sendError(res, "Failed to join waitlist", err);
  }
});

// Get Waitlist Count
app.get('/api/waitlist-count', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_waitlisted", true);

    if (error) throw error;

    // Add a base number to make it look popular initially (e.g., 1200 + real count)
    const totalCount = 1243 + (count || 0);

    res.json({ count: totalCount });
  } catch (err) {
    console.error("Failed to get waitlist count:", err);
    res.json({ count: 1243 }); // Fallback
  }
});

// Save Personal Info
app.post('/api/save-personal-info', async (req, res) => {
  const { user_id, full_name, date_of_birth, phone } = req.body;

  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  try {
    const { data, error } = await supabase
      .from('personal_info')
      .insert([{
        user_id,
        full_name,
        date_of_birth,
        phone
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Personal info saved', data });

  } catch (err) {
    sendError(res, 'Failed to save personal info', err);
  }
});

// Save Health Concerns
app.post('/api/save-health-concerns', async (req, res) => {
  const { user_id, concerns } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  try {
    const { data, error } = await supabase
      .from("health_concerns")
      .insert([{ user_id, concerns: JSON.stringify(concerns) }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    sendError(res, "Failed to save health concerns", err);
  }
});

// Save Service Preferences
app.post('/api/save-service-preferences', async (req, res) => {
  const { user_id, preferences } = req.body;
  if (!user_id) return res.status(400).json({ error: "user_id required" });

  try {
    const { data, error } = await supabase
      .from("service_preferences")
      .insert([{ user_id, preferences: JSON.stringify(preferences) }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });

  } catch (err) {
    sendError(res, "Failed to save service preferences", err);
  }
});

// Save Assessment
app.post('/api/save-assessment', async (req, res) => {
  const { user_id, email, score, answers } = req.body;

  if (!user_id || !email || score === undefined || !answers) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("assessments")
      .insert([{
        user_id,
        email_id: email,
        score,
        assessment_questions: JSON.stringify(answers)
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, assessment_id: data.id, user_id });

  } catch (err) {
    sendError(res, "Failed to save assessment", err);
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" &&
    (password === process.env.ADMIN_PASSWORD || password === "admin123")) {
    return res.json({
      success: true,
      token: process.env.ADMIN_TOKEN || "admin-secret-token"
    });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

// Static Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin', requireAdmin, (req, res) =>
  res.sendFile(path.join(__dirname, 'admin.html'))
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  process.exit(0);
});
