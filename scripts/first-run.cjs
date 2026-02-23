#!/usr/bin/env node
/**
 * first-run.js — Initial student setup
 * Prompts for student name, creates user-data directory and progress.json
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.join(__dirname, '..');
const USER_DATA_DIR = path.join(ROOT, 'user-data');
const PROGRESS_FILE = path.join(USER_DATA_DIR, 'progress.json');
const SOLUTIONS_DIR = path.join(USER_DATA_DIR, 'solutions');

function ensureDirs() {
  if (!fs.existsSync(USER_DATA_DIR)) fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  if (!fs.existsSync(SOLUTIONS_DIR)) fs.mkdirSync(SOLUTIONS_DIR, { recursive: true });
}

function writeProgress(studentName) {
  const progress = {
    studentName,
    completedExercises: {},
    savedSolutions: {},
    attempts: {},
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
  console.log(`✓ Progress file created for ${studentName}`);
}

// If progress already exists, skip
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    if (existing.studentName) {
      console.log(`✓ Already set up for ${existing.studentName}`);
      console.log('  Run npm start to begin!');
      process.exit(0);
    }
  } catch {
    // Continue to setup
  }
}

ensureDirs();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\n🎓 Welcome to jsFun! Let\'s get you set up.\n');

rl.question('What is your name? ', (name) => {
  const trimmed = name.trim();
  if (!trimmed) {
    console.log('Name cannot be empty. Please run npm run setup again.');
    rl.close();
    process.exit(1);
  }

  writeProgress(trimmed);
  console.log('\n✓ Setup complete!');
  console.log('  Run npm start to launch jsFun in production mode.');
  console.log('  Run npm run dev + npm run dev:server for development mode.\n');
  rl.close();
});
