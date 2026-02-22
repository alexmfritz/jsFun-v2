#!/usr/bin/env node
/**
 * build-exercises.cjs — Merge per-collection exercise files into exercises.json
 *
 * Reads:
 *   exercises/categories.json          — category tree
 *   exercises/collections/<id>.json    — visible collections with exercises
 *   exercises/collections/_meta.json   — hidden collection metadata
 *   exercises/collections/_uncollected.json — exercises not in any collection
 *
 * Writes:
 *   exercises/exercises.json           — merged file the app reads at runtime
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXERCISES_DIR = path.join(ROOT, 'exercises');
const COLLECTIONS_DIR = path.join(EXERCISES_DIR, 'collections');
const OUTPUT = path.join(EXERCISES_DIR, 'exercises.json');

// ─── Read categories ────────────────────────────────────────────────────────
const categoriesFile = path.join(EXERCISES_DIR, 'categories.json');
if (!fs.existsSync(categoriesFile)) {
  console.error('Missing exercises/categories.json');
  process.exit(1);
}
const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'));

// ─── Read collection files ──────────────────────────────────────────────────
const allFiles = fs.readdirSync(COLLECTIONS_DIR).filter((f) => f.endsWith('.json'));
const collectionFiles = allFiles.filter((f) => !f.startsWith('_'));
const metaFile = path.join(COLLECTIONS_DIR, '_meta.json');
const uncollectedFile = path.join(COLLECTIONS_DIR, '_uncollected.json');

const collections = [];
const allExercises = [];
const seenIds = new Set();

// Process each visible collection file
for (const file of collectionFiles.sort()) {
  const filePath = path.join(COLLECTIONS_DIR, file);
  const colData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const { exercises, exerciseIds, ...colMeta } = colData;

  if (!exercises || !Array.isArray(exercises)) {
    console.error(`  ✗ ${file}: missing or invalid exercises array`);
    process.exit(1);
  }

  // Add exercises (deduplicate — first collection to define an exercise wins)
  for (const exercise of exercises) {
    if (seenIds.has(exercise.id)) {
      console.warn(`  ⚠ Duplicate exercise ID ${exercise.id} in ${file} (skipping)`);
      continue;
    }
    seenIds.add(exercise.id);
    allExercises.push(exercise);
  }

  // Use the stored exerciseIds (preserves cross-collection references)
  collections.push({ ...colMeta, exerciseIds: exerciseIds || exercises.map((e) => e.id) });
  console.log(`  ✓ ${file} (${exercises.length} exercises)`);
}

// Add uncollected exercises
if (fs.existsSync(uncollectedFile)) {
  const uncollected = JSON.parse(fs.readFileSync(uncollectedFile, 'utf-8'));
  let added = 0;
  for (const exercise of uncollected.exercises || []) {
    if (seenIds.has(exercise.id)) {
      console.warn(`  ⚠ Duplicate exercise ID ${exercise.id} in _uncollected.json (skipping)`);
      continue;
    }
    seenIds.add(exercise.id);
    allExercises.push(exercise);
    added++;
  }
  console.log(`  ✓ _uncollected.json (${added} exercises)`);
}

// Add hidden collection metadata
if (fs.existsSync(metaFile)) {
  const hiddenCollections = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
  for (const col of hiddenCollections) {
    collections.push(col);
  }
  console.log(`  ✓ _meta.json (${hiddenCollections.length} hidden collections)`);
}

// Sort exercises by ID for stable output
allExercises.sort((a, b) => a.id - b.id);

// ─── Write merged file ─────────────────────────────────────────────────────
const output = { categories, collections, exercises: allExercises };
fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');

console.log(`\n✓ Built exercises.json (${allExercises.length} exercises, ${collections.length} collections)`);