/**
 * Consolidate duplicate tag forms in exercises.json
 * - "array" → "arrays" (16 exercises)
 * - "classes" → "class" (13 exercises)
 * - "closures" → "closure" (4 exercises)
 * - "string" → "strings" (2 exercises)
 * - "object" → "objects" (1 exercise)
 * - "semantic" → "semantics" (2 exercises)
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const REMAP = {
  'array': 'arrays',
  'classes': 'class',
  'closures': 'closure',
  'string': 'strings',
  'object': 'objects',
  'semantic': 'semantics',
};

let changed = 0;
for (const ex of data.exercises) {
  const newTags = [];
  const seen = new Set();
  for (const tag of ex.tags) {
    const mapped = REMAP[tag] || tag;
    if (!seen.has(mapped)) {
      seen.add(mapped);
      newTags.push(mapped);
      if (mapped !== tag) changed++;
    }
  }
  ex.tags = newTags;
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Consolidated ${changed} tag occurrences across ${data.exercises.length} exercises`);
