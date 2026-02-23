/**
 * Create the "Interview Classics" collection
 * 55 exercises: 25 existing + 30 new algorithm/data-structure exercises
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// 25 existing exercises that fit interview prep
const EXISTING_IDS = [
  4,    // Reverse a String
  11,   // Flatten Nested Array
  42,   // twoHighest
  47,   // findTheDuplicate
  127,  // Reverse an Array (no .reverse())
  128,  // Is Palindrome?
  146,  // Frequency Counter
  147,  // Group By Property
  152,  // Implement myForEach
  153,  // Implement myMap
  154,  // Implement myFilter
  155,  // Implement myFind
  156,  // Implement myEvery
  157,  // Implement mySome
  158,  // Implement myReduce
  192,  // Data Structure Class: Stack
  237,  // memoize
  238,  // curry
  248,  // findPairs
  257,  // caesarCipher
  263,  // Implement myFlatMap
  264,  // Implement myZip
  265,  // Implement myGroupBy
  284,  // LinkedList
  285,  // deepClone
  289,  // throttle
];

// 30 new exercises from algorithms + data-structures additions (IDs 297-325 + select)
const NEW_IDS = Array.from({ length: 29 }, (_, i) => 297 + i); // 297-325

const allIds = [...EXISTING_IDS, ...NEW_IDS].sort((a, b) => a - b);

// Verify all IDs exist
const exerciseIds = new Set(data.exercises.map(e => e.id));
const missing = allIds.filter(id => !exerciseIds.has(id));
if (missing.length > 0) {
  console.error(`ERROR: Missing exercise IDs: ${missing.join(', ')}`);
  console.error('Run the algorithm/regex/dom migration scripts first.');
  process.exit(1);
}

// Create the collection
data.collections.push({
  id: 'interview-classics',
  name: 'Interview Classics',
  description: 'The most commonly asked JavaScript interview problems: data structures, algorithms, and pattern recognition. Spanning Tiers 2-4.',
  exerciseIds: allIds,
  color: '#fbbf24',
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

console.log(`Created interview-classics collection: ${allIds.length} exercises`);
console.log(`  Existing: ${EXISTING_IDS.length}`);
console.log(`  New: ${NEW_IDS.length}`);
console.log(`  Total collections: ${data.collections.length}`);
