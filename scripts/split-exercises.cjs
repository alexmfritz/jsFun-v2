#!/usr/bin/env node
/**
 * split-exercises.cjs — One-time script to split exercises.json into per-collection files
 *
 * Creates:
 *   exercises/categories.json          — category tree
 *   exercises/collections/<id>.json    — each visible collection with its exercises
 *   exercises/collections/_meta.json   — hidden collection metadata (ID groupings only)
 *   exercises/collections/_uncollected.json — exercises not in any visible collection
 *
 * Each collection file contains:
 *   - Collection metadata (id, name, description, etc.)
 *   - exerciseIds: full list of IDs this collection references (may include cross-references)
 *   - exercises: the exercise objects this file "owns" (first visible collection wins)
 *
 * After running, use `node scripts/build-exercises.cjs` to re-merge.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'exercises', 'exercises.json');
const COLLECTIONS_DIR = path.join(ROOT, 'exercises', 'collections');

const data = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'));
const { categories, collections, exercises } = data;

// Create collections directory
if (!fs.existsSync(COLLECTIONS_DIR)) {
  fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });
}

// Index exercises by ID for fast lookup
const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

// Separate visible vs hidden collections
const visibleCollections = collections.filter((c) => !c.hidden);
const hiddenCollections = collections.filter((c) => c.hidden);

// Track which exercise IDs are "owned" by a visible collection
// An exercise is owned by the first visible collection that claims it
const ownedIds = new Set();

// Write each visible collection as its own file
for (const col of visibleCollections) {
  const colExercises = [];

  for (const id of col.exerciseIds) {
    if (!ownedIds.has(id)) {
      const exercise = exerciseMap.get(id);
      if (exercise) {
        colExercises.push(exercise);
        ownedIds.add(id);
      }
    }
  }

  // Collection file: metadata + full exerciseIds + owned exercises
  const colFile = {
    id: col.id,
    name: col.name,
    description: col.description,
    ...(col.isDefault ? { isDefault: true } : {}),
    ...(col.color ? { color: col.color } : {}),
    ...(col.source ? { source: col.source } : {}),
    ...(col.license ? { license: col.license } : {}),
    ...(col.attribution ? { attribution: col.attribution } : {}),
    exerciseIds: col.exerciseIds,
    exercises: colExercises,
  };

  const filePath = path.join(COLLECTIONS_DIR, `${col.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(colFile, null, 2), 'utf-8');
  console.log(`  ✓ ${col.id}.json (${colExercises.length} exercises owned, ${col.exerciseIds.length} total IDs)`);
}

// Gather uncollected exercises (not owned by any visible collection)
const uncollectedExercises = exercises.filter((e) => !ownedIds.has(e.id));
if (uncollectedExercises.length > 0) {
  const uncollectedFile = path.join(COLLECTIONS_DIR, '_uncollected.json');
  fs.writeFileSync(uncollectedFile, JSON.stringify({ exercises: uncollectedExercises }, null, 2), 'utf-8');
  console.log(`  ✓ _uncollected.json (${uncollectedExercises.length} exercises)`);
}

// Write hidden collection metadata (just the grouping info, no exercise data)
if (hiddenCollections.length > 0) {
  const metaFile = path.join(COLLECTIONS_DIR, '_meta.json');
  fs.writeFileSync(metaFile, JSON.stringify(hiddenCollections, null, 2), 'utf-8');
  console.log(`  ✓ _meta.json (${hiddenCollections.length} hidden collections)`);
}

// Write categories
const categoriesFile = path.join(ROOT, 'exercises', 'categories.json');
fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2), 'utf-8');
console.log(`  ✓ categories.json`);

console.log(`\nSplit complete. ${exercises.length} exercises across ${visibleCollections.length} collection files.`);
console.log('Run `node scripts/build-exercises.cjs` to re-merge into exercises.json.');
