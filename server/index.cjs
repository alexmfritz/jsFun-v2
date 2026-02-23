'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// ─── Load .env (lightweight, no dependencies) ──────────────────────────────
const ROOT = path.join(__dirname, '..');
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const app = express();
const isDev = process.argv.includes('--dev');
const PORT = isDev
  ? Number(process.env.VITE_API_PORT || 3001)
  : Number(process.env.PORT || 3000);

// ─── Paths ──────────────────────────────────────────────────────────────────
const EXERCISES_FILE = path.join(ROOT, 'exercises', 'exercises.json');
const USER_DATA_DIR = path.join(ROOT, 'user-data');
const PROGRESS_FILE = path.join(USER_DATA_DIR, 'progress.json');
const SOLUTIONS_DIR = path.join(USER_DATA_DIR, 'solutions');
const ADMIN_CONFIG_FILE = path.join(ROOT, 'admin.config.json');

// ─── Rate Limiting ───────────────────────────────────────────────────────────
/** Simple in-memory rate limiter for admin endpoints (no extra dependencies) */
const loginAttempts = new Map(); // ip → { count, resetAt }
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // max attempts per window

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many attempts. Try again later.' });
    }
    entry.count++;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }
  next();
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

if (!isDev) {
  // Production: serve the Vite build
  app.use(express.static(path.join(ROOT, 'dist')));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function ensureUserData() {
  if (!fs.existsSync(USER_DATA_DIR)) fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  if (!fs.existsSync(SOLUTIONS_DIR)) fs.mkdirSync(SOLUTIONS_DIR, { recursive: true });
  if (!fs.existsSync(PROGRESS_FILE)) {
    writeJson(PROGRESS_FILE, {
      studentName: '',
      completedExercises: {},
      savedSolutions: {},
      attempts: {},
      createdAt: new Date().toISOString(),
    });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/** GET /api/exercises — return all exercise data */
app.get('/api/exercises', (req, res) => {
  const data = readJson(EXERCISES_FILE);
  if (!data) return res.status(500).json({ error: 'Failed to read exercises' });
  res.json(data);
});

/** GET /api/progress — return student progress */
app.get('/api/progress', (req, res) => {
  ensureUserData();
  const data = readJson(PROGRESS_FILE) || {
    studentName: '',
    completedExercises: {},
    savedSolutions: {},
    attempts: {},
    createdAt: new Date().toISOString(),
  };
  res.json(data);
});

/** POST /api/progress/solution — auto-save student code */
app.post('/api/progress/solution', (req, res) => {
  ensureUserData();
  const { exerciseId, code } = req.body;
  if (!exerciseId || typeof code !== 'string') {
    return res.status(400).json({ error: 'exerciseId and code required' });
  }

  const progress = readJson(PROGRESS_FILE) || {};
  if (!progress.savedSolutions) progress.savedSolutions = {};
  progress.savedSolutions[String(exerciseId)] = code;
  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  // Also write individual solution file
  const ext = getSolutionExt(exerciseId);
  const solutionFile = path.join(SOLUTIONS_DIR, `exercise-${exerciseId}${ext}`);
  fs.writeFileSync(solutionFile, code, 'utf-8');

  res.json({ success: true });
});

/** POST /api/progress/complete — mark exercise complete */
app.post('/api/progress/complete', (req, res) => {
  ensureUserData();
  const { exerciseId, attempts, completedAt } = req.body;
  if (!exerciseId) return res.status(400).json({ error: 'exerciseId required' });

  const progress = readJson(PROGRESS_FILE) || {};
  if (!progress.completedExercises) progress.completedExercises = {};
  progress.completedExercises[String(exerciseId)] = {
    completedAt: completedAt || new Date().toISOString(),
    attempts: attempts || 0,
  };
  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  res.json({ success: true });
});

/** POST /api/progress/attempt — increment attempt count */
app.post('/api/progress/attempt', (req, res) => {
  ensureUserData();
  const { exerciseId } = req.body;
  if (!exerciseId) return res.status(400).json({ error: 'exerciseId required' });

  const progress = readJson(PROGRESS_FILE) || {};
  if (!progress.attempts) progress.attempts = {};
  progress.attempts[String(exerciseId)] = (progress.attempts[String(exerciseId)] || 0) + 1;
  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  res.json({ success: true });
});

/** POST /api/progress/reset — reset exercise progress */
app.post('/api/progress/reset', (req, res) => {
  ensureUserData();
  const { exerciseId } = req.body;
  if (!exerciseId) return res.status(400).json({ error: 'exerciseId required' });

  const progress = readJson(PROGRESS_FILE) || {};
  const id = String(exerciseId);

  // Remove from all tracking maps
  if (progress.savedSolutions) delete progress.savedSolutions[id];
  if (progress.completedExercises) delete progress.completedExercises[id];
  if (progress.attempts) delete progress.attempts[id];

  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  // Remove individual solution file if it exists (check all extensions)
  for (const ext of [...new Set(Object.values(TYPE_TO_EXT))]) {
    const solutionFile = path.join(SOLUTIONS_DIR, `exercise-${exerciseId}${ext}`);
    if (fs.existsSync(solutionFile)) fs.unlinkSync(solutionFile);
  }

  res.json({ success: true });
});

/** POST /api/admin/login — verify admin password */
app.post('/api/admin/login', rateLimit, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const config = readJson(ADMIN_CONFIG_FILE);
  if (!config || !config.passwordHash) {
    return res.status(401).json({ error: 'Admin not configured. Run npm run setup-admin' });
  }

  const valid = await bcrypt.compare(password, config.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  res.json({ success: true });
});

/** POST /api/admin/exercises — add a new exercise */
app.post('/api/admin/exercises', rateLimit, async (req, res) => {
  const { adminPassword, ...exerciseData } = req.body;

  // Verify password
  const config = readJson(ADMIN_CONFIG_FILE);
  if (!config || !config.passwordHash) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const valid = await bcrypt.compare(adminPassword, config.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Unauthorized' });

  const data = readJson(EXERCISES_FILE);
  if (!data) return res.status(500).json({ error: 'Failed to read exercises' });

  const maxId = Math.max(0, ...data.exercises.map((e) => e.id));
  const newExercise = { id: maxId + 1, ...exerciseData };
  data.exercises.push(newExercise);
  writeJson(EXERCISES_FILE, data);

  res.json(newExercise);
});

// ─── SPA fallback ─────────────────────────────────────────────────────────────
if (!isDev) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(ROOT, 'dist', 'index.html'));
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`jsFun server running on http://localhost:${PORT} (${isDev ? 'dev' : 'production'})`);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Map exercise type to file extension for saved solution files */
const TYPE_TO_EXT = { js: '.js', html: '.html', css: '.css', 'html-css': '.html' };

function getSolutionExt(exerciseId) {
  const data = readJson(EXERCISES_FILE);
  if (!data) return '.js';
  const ex = data.exercises.find((e) => e.id === Number(exerciseId));
  return TYPE_TO_EXT[ex?.type] ?? '.js';
}

module.exports = app;
