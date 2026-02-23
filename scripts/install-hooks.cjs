#!/usr/bin/env node
/**
 * install-hooks.js — Cross-platform git hook installer
 * Writes pre-commit hook that runs sync-progress before commits
 * Works on Windows (no bash required — uses Node.js shebang workaround)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GIT_DIR = path.join(ROOT, '.git');
const HOOKS_DIR = path.join(GIT_DIR, 'hooks');

// Only install if we're in a git repo
if (!fs.existsSync(GIT_DIR)) {
  console.log('  (No .git directory found — skipping hook installation)');
  process.exit(0);
}

if (!fs.existsSync(HOOKS_DIR)) {
  fs.mkdirSync(HOOKS_DIR, { recursive: true });
}

// Pre-commit hook: sync progress to README before committing
// Uses a shell script to avoid CJS/ESM issues across Node versions
const PRE_COMMIT_HOOK = `#!/bin/sh
# jsFun pre-commit hook — syncs progress to README.md
node scripts/sync-progress.cjs || { echo "sync-progress failed"; exit 1; }
`;

const hookPath = path.join(HOOKS_DIR, 'pre-commit');
fs.writeFileSync(hookPath, PRE_COMMIT_HOOK, { encoding: 'utf-8', mode: 0o755 });

console.log('  ✓ Git pre-commit hook installed (sync-progress)');
