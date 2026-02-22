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