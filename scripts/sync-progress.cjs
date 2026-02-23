#!/usr/bin/env node
/**
 * sync-progress.js — Writes student progress into README.md
 * Generates markdown tables between sentinel comments.
 * Teacher can review via Gitea web UI.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROGRESS_FILE = path.join(ROOT, 'user-data', 'progress.json');
const EXERCISES_FILE = path.join(ROOT, 'exercises', 'exercises.json');
const README_FILE = path.join(ROOT, 'README.md');

const SENTINEL_START = '<!-- PROGRESS_START -->';
const SENTINEL_END = '<!-- PROGRESS_END -->';

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

function calcPct(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function buildProgressBlock(progress, exercisesData) {
  const { studentName, completedExercises, attempts, createdAt, lastUpdated } = progress;
  const { exercises, collections, categories } = exercisesData;

  const totalCount = exercises.length;
  const completedCount = Object.keys(completedExercises).length;
  const overallPct = calcPct(completedCount, totalCount);

  const lines = [];
  lines.push(SENTINEL_START);
  lines.push('');
  lines.push('## 📊 Progress Report');
  lines.push('');
  lines.push(`**Student:** ${studentName || 'Unknown'}`);
  lines.push(`**Updated:** ${new Date(lastUpdated || Date.now()).toLocaleString()}`);
  lines.push(`**Started:** ${new Date(createdAt).toLocaleDateString()}`);
  lines.push('');
  lines.push('### Overall');
  lines.push('');
  lines.push(`**${completedCount} / ${totalCount} exercises complete (${overallPct}%)**`);
  lines.push('');

  // Progress bar (ASCII)
  const barLen = 30;
  const filled = Math.round((completedCount / totalCount) * barLen);
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
  lines.push(`\`[${bar}] ${overallPct}%\``);
  lines.push('');

  // By tier
  lines.push('### By Tier');
  lines.push('');
  lines.push('| Tier | Name | Done | Total | % |');
  lines.push('|------|------|-----:|------:|--:|');
  const TIER_NAMES = { 1: 'Spark', 2: 'Foundations', 3: 'Builder', 4: 'Architect', 5: 'Mastercraft' };
  for (let t = 1; t <= 5; t++) {
    const tierExs = exercises.filter((ex) => ex.tier === t);
    const done = tierExs.filter((ex) => !!completedExercises[String(ex.id)]).length;
    if (tierExs.length > 0) {
      lines.push(`| ${t} | ${TIER_NAMES[t]} | ${done} | ${tierExs.length} | ${calcPct(done, tierExs.length)}% |`);
    }
  }
  lines.push('');

  // By type
  lines.push('### By Type');
  lines.push('');
  lines.push('| Type | Done | Total | % |');
  lines.push('|------|-----:|------:|--:|');
  for (const type of ['js', 'html', 'css', 'html-css']) {
    const typeExs = exercises.filter((ex) => ex.type === type);
    const done = typeExs.filter((ex) => !!completedExercises[String(ex.id)]).length;
    if (typeExs.length > 0) {
      lines.push(`| ${type.toUpperCase()} | ${done} | ${typeExs.length} | ${calcPct(done, typeExs.length)}% |`);
    }
  }
  lines.push('');

  // By collection
  lines.push('### By Collection');
  lines.push('');
  lines.push('| Collection | Done | Total | % |');
  lines.push('|------------|-----:|------:|--:|');
  for (const col of collections.filter((c) => !c.hidden)) {
    const colExs = exercises.filter((ex) => col.exerciseIds.includes(ex.id));
    const done = colExs.filter((ex) => !!completedExercises[String(ex.id)]).length;
    lines.push(`| ${col.name} | ${done} | ${colExs.length} | ${calcPct(done, colExs.length)}% |`);
  }
  lines.push('');

  // By topic (top-level categories)
  lines.push('### By Topic');
  lines.push('');
  lines.push('| Topic | Done | Total | % |');
  lines.push('|-------|-----:|------:|--:|');
  for (const [key, cat] of Object.entries(categories)) {
    const topicExs = exercises.filter((ex) => ex.category && ex.category[0] === key);
    if (topicExs.length === 0) continue;
    const done = topicExs.filter((ex) => !!completedExercises[String(ex.id)]).length;
    lines.push(`| ${cat.label} | ${done} | ${topicExs.length} | ${calcPct(done, topicExs.length)}% |`);
  }
  lines.push('');
  lines.push(SENTINEL_END);

  return lines.join('\n');
}

// Main
const progress = readJson(PROGRESS_FILE);
const exercisesData = readJson(EXERCISES_FILE);

if (!progress) {
  console.error('No progress file found. Run npm run setup first.');
  process.exit(1);
}

if (!exercisesData) {
  console.error('No exercises file found.');
  process.exit(1);
}

const progressBlock = buildProgressBlock(progress, exercisesData);

// Read existing README or create one
let readme = '';
if (fs.existsSync(README_FILE)) {
  readme = fs.readFileSync(README_FILE, 'utf-8');
} else {
  readme = `# jsFun — ${progress.studentName || 'Student'}\n\nInteractive coding exercises.\n\n`;
}

// Replace or append the progress block
if (readme.includes(SENTINEL_START)) {
  readme = readme.replace(
    new RegExp(`${SENTINEL_START}[\\s\\S]*?${SENTINEL_END}`, 'm'),
    progressBlock
  );
} else {
  readme = readme.trimEnd() + '\n\n' + progressBlock + '\n';
}

fs.writeFileSync(README_FILE, readme, 'utf-8');
console.log(`✓ README.md updated with progress (${Object.keys(progress.completedExercises).length}/${exercisesData.exercises.length} complete)`);
