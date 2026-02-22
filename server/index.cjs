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



