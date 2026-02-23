/**
 * Move all 18 new exercises (279-296) into default-curriculum
 * and remove the capstone-track collection entirely.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const NEW_IDS = Array.from({ length: 18 }, (_, i) => 279 + i);

// Update default-curriculum to include all 18 new exercises
const dc = data.collections.find(c => c.id === 'default-curriculum');
const existing = new Set(dc.exerciseIds);
for (const id of NEW_IDS) {
  if (!existing.has(id)) {
    dc.exerciseIds.push(id);
    existing.add(id);
  }
}
dc.exerciseIds.sort((a, b) => a - b);

// Remove capstone-track collection
const ctIndex = data.collections.findIndex(c => c.id === 'capstone-track');
if (ctIndex !== -1) {
  data.collections.splice(ctIndex, 1);
  console.log('Removed capstone-track collection');
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`default-curriculum now has ${dc.exerciseIds.length} exercises`);
console.log(`Total collections: ${data.collections.length}`);
