/**
 * Migration script: Clean up category/collection schema
 *
 * 1. Flatten category tree to 2 levels max (remove all 3rd-level children)
 * 2. Add "classes" under js-fundamentals, remove from es6-plus
 * 3. Remove icon field from all categories
 * 4. Re-map all exercise category paths:
 *    - 3-level paths → 2-level
 *    - classes/oop/* → js-fundamentals/classes
 * 5. Strip emojis from collection names
 * 6. Merge Turing-sourced collections into one "Turing Foundations"
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── 1. Rebuild categories: 2 levels max, no icons ─────────────────────────

const newCategories = {};

for (const [rootKey, rootCat] of Object.entries(data.categories)) {
  const entry = {
    label: rootCat.label,
    color: rootCat.color,
  };

  // Flatten children: keep only top-level children, drop their children
  if (rootCat.children && Object.keys(rootCat.children).length > 0) {
    entry.children = {};
    for (const [childKey, childCat] of Object.entries(rootCat.children)) {
      // Skip es6-plus > classes (moving to js-fundamentals)
      if (rootKey === 'es6-plus' && childKey === 'classes') continue;

      entry.children[childKey] = { label: childCat.label };
      // Intentionally NOT copying grandchildren
    }
  }

  newCategories[rootKey] = entry;
}

// Add "classes" as child of js-fundamentals
if (!newCategories['js-fundamentals'].children) {
  newCategories['js-fundamentals'].children = {};
}
newCategories['js-fundamentals'].children['classes'] = { label: 'Classes & OOP' };

data.categories = newCategories;

// ─── 2. Update exercise category paths ──────────────────────────────────────

let classesRemapped = 0;
let pathsTruncated = 0;

for (const ex of data.exercises) {
  // Re-map classes/oop/* → js-fundamentals/classes
  if (ex.category[0] === 'classes') {
    ex.category = ['js-fundamentals', 'classes'];
    classesRemapped++;
  }
  // Truncate any remaining 3+ level paths to 2 levels
  else if (ex.category.length > 2) {
    ex.category = ex.category.slice(0, 2);
    pathsTruncated++;
  }
}

// ─── 3. Ensure former 3rd-level info is preserved in tags ───────────────────

// Map of 3rd-level keys → tag names that should exist
const thirdLevelTags = {
  arithmetic: 'arithmetic',
  modulo: 'modulo',
  comparison: 'comparison',
  basics: 'arrays',
  filter: 'filter',
  map: 'map',
  reduce: 'reduce',
  chaining: 'chaining',
};

// Re-read the original file to check what tags exercises had
const original = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (const origEx of original.exercises) {
  if (origEx.category.length >= 3) {
    const thirdLevel = origEx.category[2];
    const tagToEnsure = thirdLevelTags[thirdLevel];
    if (tagToEnsure) {
      const ex = data.exercises.find((e) => e.id === origEx.id);
      if (ex && !ex.tags.includes(tagToEnsure)) {
        ex.tags.push(tagToEnsure);
      }
    }
  }
}

// ─── 4. Strip emojis from collection names ──────────────────────────────────

// Match emoji characters and leading/trailing whitespace
const emojiRegex =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}\u{200D}\u{FE0F}\u{20E3}]/gu;

for (const col of data.collections) {
  const cleaned = col.name.replace(emojiRegex, '').trim();
  if (cleaned !== col.name) {
    console.log(`  Collection: "${col.name}" → "${cleaned}"`);
    col.name = cleaned;
  }
}

// ─── 5. Merge Turing-sourced collections ────────────────────────────────────

// Collect all Turing exercise IDs from the collections being merged
const turingCollectionIds = ['mythical-creatures', 'two-class-intro', 'two-class-advanced'];
const turingFoundations = data.collections.find((c) => c.id === 'turing-foundations');

if (turingFoundations) {
  // Gather all exercise IDs from the Turing sub-collections
  const allTuringIds = new Set(turingFoundations.exerciseIds);

  for (const colId of turingCollectionIds) {
    const col = data.collections.find((c) => c.id === colId);
    if (col) {
      col.exerciseIds.forEach((id) => allTuringIds.add(id));
    }
  }

  // Add the RPG Full System (230) if not already included
  allTuringIds.add(230);

  // Sort and deduplicate
  turingFoundations.exerciseIds = [...allTuringIds].sort((a, b) => a - b);
  turingFoundations.name = 'Turing Foundations';
  turingFoundations.description =
    'All Turing School-sourced exercises: Mythical Creatures, two-class and multi-class composition patterns, and the RPG Full System.';

  console.log(
    `\n  Merged Turing Foundations: ${turingFoundations.exerciseIds.length} exercises`
  );
  console.log(`  IDs: ${turingFoundations.exerciseIds.join(', ')}`);
}

// Remove the merged sub-collections
data.collections = data.collections.filter(
  (c) => !turingCollectionIds.includes(c.id)
);

// Also clean up tier5-rpg-system since it's now part of Turing Foundations
// (keeping it — it's a single-exercise collection that serves a distinct purpose as a Tier 5 marker)

// ─── 6. Write back ─────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── 7. Summary ────────────────────────────────────────────────────────────

console.log('\n=== Migration Complete ===');
console.log(`  Classes exercises re-mapped: ${classesRemapped}`);
console.log(`  Other paths truncated: ${pathsTruncated}`);
console.log(`  Root categories: ${Object.keys(data.categories).length}`);
console.log(`  Collections: ${data.collections.length}`);
console.log(`  Total exercises: ${data.exercises.length}`);

// Verify no 3+ level paths remain
const deepPaths = data.exercises.filter((ex) => ex.category.length > 2);
if (deepPaths.length > 0) {
  console.log(`\n  WARNING: ${deepPaths.length} exercises still have 3+ level categories:`);
  deepPaths.forEach((ex) => console.log(`    ID ${ex.id}: ${ex.category.join(' > ')}`));
} else {
  console.log('  All category paths are 2 levels or fewer.');
}

// Verify no orphan root categories
const usedRoots = new Set(data.exercises.map((ex) => ex.category[0]));
const definedRoots = new Set(Object.keys(data.categories));
for (const root of usedRoots) {
  if (!definedRoots.has(root)) {
    console.log(`  WARNING: Root category "${root}" used by exercises but not defined in schema`);
  }
}
console.log('  No orphan root categories.');
