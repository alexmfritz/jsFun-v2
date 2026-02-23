/**
 * Migration script: Restructure collections
 *
 * 1. Merge Rithm Interview Prep Part 1 + Part 2 into one collection
 * 2. Add `hidden: true` to internal sub-groupings
 * 3. Add `source` field to visible collections
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── 1. Merge Rithm Part 1 + Part 2 ────────────────────────────────────────

const rithm1 = data.collections.find((c) => c.id === 'rithm-interview-prep');
const rithm2 = data.collections.find((c) => c.id === 'rithm-interview-prep-part2');

if (rithm1 && rithm2) {
  const allIds = new Set([...rithm1.exerciseIds, ...rithm2.exerciseIds]);
  rithm1.exerciseIds = [...allIds].sort((a, b) => a - b);
  rithm1.description =
    'Interview-style exercises from Rithm School covering strings, arrays, objects, matrices, and simulation';
  console.log(`  Merged Rithm: ${rithm1.exerciseIds.length} exercises (was ${rithm1.exerciseIds.length - rithm2.exerciseIds.length} + ${rithm2.exerciseIds.length})`);
}

// ─── 2. Mark internal collections as hidden ─────────────────────────────────

const hiddenIds = [
  'rhythm-interview-prep',      // misspelled 7-exercise duplicate
  'rithm-interview-prep-part2', // merged into main
  'array-bootcamp',
  'html-css-foundations',
  'classes-intro',
  'real-world-classes',
  'inheritance-oop',
  'oop-complete',
  'tier5-rpg-system',
  'tier3-functions',
  'tier3-loops',
  'tier3-conditionals',
  'tier3-strings',
  'tier3-objects',
  'tier3-implementations',
];

let hiddenCount = 0;
for (const col of data.collections) {
  if (hiddenIds.includes(col.id)) {
    col.hidden = true;
    hiddenCount++;
    console.log(`  Hidden: ${col.id} (${col.name})`);
  }
}

// ─── 3. Add source attribution to visible collections ───────────────────────

const sourceMap = {
  'rithm-interview-prep': 'Rithm School',
  'turing-foundations': 'Turing School',
};

for (const [id, source] of Object.entries(sourceMap)) {
  const col = data.collections.find((c) => c.id === id);
  if (col) {
    col.source = source;
    console.log(`  Source: ${col.name} → "${source}"`);
  }
}

// ─── 4. Write back ─────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── 5. Summary ────────────────────────────────────────────────────────────

const visible = data.collections.filter((c) => !c.hidden);
const hidden = data.collections.filter((c) => c.hidden);

console.log('\n=== Migration Complete ===');
console.log(`  Total collections: ${data.collections.length}`);
console.log(`  Visible: ${visible.length} — ${visible.map((c) => c.name).join(', ')}`);
console.log(`  Hidden: ${hidden.length}`);
