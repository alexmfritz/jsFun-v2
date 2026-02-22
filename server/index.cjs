// The server file is server/index.cjs, not server/index.ts or server/index.mjs. There are three reasons:

// 1. No build step required. The server runs directly with node server/index.cjs. 
// There is no TypeScript compilation, no bundling, no source maps to manage. 
// For a proof-of-concept deployed on constrained machines, simplicity wins.
// 2. The package.json has "type": "module". 
// This makes all .js files ESM by default. 
// The .cjs extension explicitly opts this file out of ESM, allowing require() syntax.
// 3. Express and bcryptjs have mature CommonJS support. 
// While they work with ESM too, CommonJS avoids edge cases with named exports and default imports that can vary between versions.

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// The 'use strict' directive enables strict mode for the entire file. 
// In strict mode, assigning to undeclared variables throws an error instead of creating a global. 
// This catches typos early.

// --- Load .env (lightweight, no dependencies) ---
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

// Why not use the dotenv package? One fewer dependency. 
// The .env format is trivial to parse -- split on newlines, skip comments and blanks, split on the first =, set the environment variable if it is not already set. 
// The if (!process.env[key]) check ensures that real environment variables (set by the OS or deployment script) take precedence over .env defaults. 
// This is the same behavior as dotenv but in 10 lines of code with zero external dependencies.

const app = express();
const isDev = process.argv.includes('--dev');
const PORT = isDev ? Number(process.env.VITE_API_PORT || 3001) : Number(process.env.PORT || 3000);

// The --dev flag switches the server into API-only mode on port 3001. 
// Without it, the server serves the built frontend from dist/ on port 3000. 
// This single file handles both development and production.

const EXERCISES_FILE = path.join(ROOT, 'exercises', 'exercises.json');
const USER_DATA_DIR = path.join(ROOT, 'user-data');
const PROGRESS_FILE = path.join(USER_DATA_DIR, 'progress.json');
const SOLUTIONS_DIR = path.join(USER_DATA_DIR, 'solutions');
const ADMIN_CONFIG_FILE = path.join(ROOT, 'admin.config.json');

// All paths are relative to the project root (ROOT), not the server file's directory. The critical separation:

// exercises/ is git-tracked. The teacher manages it. Students receive updates via git pull.
// user-data/ is gitignored. Student progress, saved code, and individual solution files live here. 
// They survive git pull because Git ignores them entirely.
// This separation is the foundation of the deployment model. 
// A teacher can push new exercises to the Gitea server. Students pull the update. 
// Their progress is untouched because it lives in a gitignored directory.

const loginAttempts = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // max attempts per window

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: 'Too many attempts. Try again later.',
      });
    }
    entry.count++;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  }
  next();
}

// An in-memory rate limiter using a Map. No Redis, no external dependency. 
// Each IP address gets 10 login attempts per 15-minute window. 
// This is only applied to admin endpoints.

// Why in-memory? The server is single-process and the rate limit state does not need to survive restarts. 
// If the server restarts, the rate limit resets -- which is fine for a classroom deployment where the admin is the teacher sitting in the same room.

app.use(express.json({ limit: '1mb' }));

if (!isDev) {
  app.use(express.static(path.join(ROOT, 'dist')));
}

// express.json({ limit: '1mb' }) parses JSON request bodies up to 1MB. 
// The limit prevents a malicious or buggy client from sending a multi-gigabyte payload that exhausts server memory.

// In production mode, express.static serves the Vite build output. 
// In dev mode, Vite handles frontend serving -- Express only needs to handle API routes.

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
  if (!fs.existsSync(USER_DATA_DIR))
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  if (!fs.existsSync(SOLUTIONS_DIR))
    fs.mkdirSync(SOLUTIONS_DIR, { recursive: true });
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

// readJson returns null on any error (file missing, invalid JSON, permission denied). 
// Callers check for null and return a 500 error. 
// This avoids try/catch boilerplate in every route handler.

// writeJson creates parent directories if they do not exist (recursive: true). 
// The JSON.stringify with 2-space indentation produces human-readable files -- 
// students and teachers can inspect user-data/progress.json directly.

// ensureUserData is called before every progress-related route. 
// It is idempotent -- calling it multiple times has no effect if the directories and files already exist. 
// On first run, it creates the entire user-data/ structure.

app.get('/api/exercises', (req, res) => {
  const data = readJson(EXERCISES_FILE);
  if (!data) return res.status(500).json({ error: 'Failed to read exercises' });
  res.json(data);
});

// No transformation, no filtering. The entire exercises.json is sent as-is. 
// At a few hundred exercises this is under 500KB -- small enough that caching and pagination would add complexity without meaningful benefit.

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

// The fallback object after || handles the edge case where readJson returns null even after ensureUserData created the file 
// (e.g., a race condition or permission issue).

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
  const solutionFile = path.join(
    SOLUTIONS_DIR,
    `exercise-${exerciseId}${ext}`
  );
  fs.writeFileSync(solutionFile, code, 'utf-8');

  res.json({ success: true });
});

// Solutions are saved in two places:

// 1. Inside progress.json -- For the frontend to restore the editor state on page load.
// 2. As individual files in user-data/solutions/ -- For the teacher to review via Gitea's web UI or by browsing the filesystem directly. 
// A file named exercise-42.js is far easier to review than a JSON blob.

const TYPE_TO_EXT = {
  js: '.js',
  html: '.html',
  css: '.css',
  'html-css': '.html',
};

function getSolutionExt(exerciseId) {
  const data = readJson(EXERCISES_FILE);
  if (!data) return '.js';
  const ex = data.exercises.find((e) => e.id === Number(exerciseId));
  return TYPE_TO_EXT[ex?.type] ?? '.js';
}

app.post('/api/progress/complete', (req, res) => {
  ensureUserData();
  const { exerciseId, attempts, completedAt } = req.body;
  if (!exerciseId)
    return res.status(400).json({ error: 'exerciseId required' });

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

app.post('/api/progress/attempt', (req, res) => {
  ensureUserData();
  const { exerciseId } = req.body;
  if (!exerciseId)
    return res.status(400).json({ error: 'exerciseId required' });

  const progress = readJson(PROGRESS_FILE) || {};
  if (!progress.attempts) progress.attempts = {};
  progress.attempts[String(exerciseId)] =
    (progress.attempts[String(exerciseId)] || 0) + 1;
  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  res.json({ success: true });
});

app.post('/api/progress/reset', (req, res) => {
  ensureUserData();
  const { exerciseId } = req.body;
  if (!exerciseId)
    return res.status(400).json({ error: 'exerciseId required' });

  const progress = readJson(PROGRESS_FILE) || {};
  const id = String(exerciseId);

  if (progress.savedSolutions) delete progress.savedSolutions[id];
  if (progress.completedExercises) delete progress.completedExercises[id];
  if (progress.attempts) delete progress.attempts[id];

  progress.lastUpdated = new Date().toISOString();
  writeJson(PROGRESS_FILE, progress);

  // Remove individual solution file if it exists
  for (const ext of [...new Set(Object.values(TYPE_TO_EXT))]) {
    const solutionFile = path.join(
      SOLUTIONS_DIR,
      `exercise-${exerciseId}${ext}`
    );
    if (fs.existsSync(solutionFile)) fs.unlinkSync(solutionFile);
  }

  res.json({ success: true });
});

// The reset endpoint checks all possible file extensions because the exercise type might have changed since the solution was saved. 
// Better to clean up all possible files than leave orphans.

app.post('/api/admin/login', rateLimit, async (req, res) => {
  const { password } = req.body;
  if (!password)
    return res.status(400).json({ error: 'Password required' });

  const config = readJson(ADMIN_CONFIG_FILE);
  if (!config || !config.passwordHash) {
    return res.status(401).json({
      error: 'Admin not configured. Run npm run setup-admin',
    });
  }

  const valid = await bcrypt.compare(password, config.passwordHash);
  if (!valid)
    return res.status(401).json({ error: 'Invalid password' });

  res.json({ success: true });
});

app.post('/api/admin/exercises', rateLimit, async (req, res) => {
  const { adminPassword, ...exerciseData } = req.body;

  const config = readJson(ADMIN_CONFIG_FILE);
  if (!config || !config.passwordHash) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const valid = await bcrypt.compare(adminPassword, config.passwordHash);
  if (!valid)
    return res.status(401).json({ error: 'Unauthorized' });

  const data = readJson(EXERCISES_FILE);
  if (!data)
    return res.status(500).json({ error: 'Failed to read exercises' });

  const maxId = Math.max(0, ...data.exercises.map((e) => e.id));
  const newExercise = { id: maxId + 1, ...exerciseData };
  data.exercises.push(newExercise);
  writeJson(EXERCISES_FILE, data);

  res.json(newExercise);
});

// Both admin endpoints use the rateLimit middleware. 
// The login endpoint checks the password against the bcrypt hash stored in admin.config.json. 
// The add-exercise endpoint re-verifies the password on every request (no session token) -- 
// simpler than managing tokens, acceptable for a single-user admin.

// New exercise IDs are auto-incremented from the current maximum. 
// Math.max(0, ...ids) handles the empty-array edge case (returns 0, so the first exercise gets ID 1).