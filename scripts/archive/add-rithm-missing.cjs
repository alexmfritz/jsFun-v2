#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// Add IDs 49 and 50 (shifting what was previously 49-63 is on a different branch)
// On THIS branch (main-v2-rithm-exercises) the last ID is 48, so we use 49 and 50
const missing = [
  {
    id: 49,
    title: 'separate',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'sorting', 'filtering', 'intermediate'],
    description: "Rearrange an array of 'dogs', 'cats', and 'water' so cats come first, water in the middle, dogs last.",
    instructions: `Write a function called \`separate\` that accepts an array containing the strings "dog", "cat", and "water".

Return a new array where all cats come first, then all the water, then all the dogs.

You can assume the array always has at least one of each.

Examples:
  separate(['dog','cat','water'])
  // ['cat','water','dog']

  separate(['dog','cat','water','cat'])
  // ['cat','cat','water','dog']

  separate(['cat','cat','water','dog','water','cat','water','dog'])
  // ['cat','cat','cat','water','water','water','dog','dog']`,
    starterCode: `function separate(arr) {
  // Your code here

}`,
    solution: `function separate(arr) {
  const cats = arr.filter(x => x === 'cat');
  const water = arr.filter(x => x === 'water');
  const dogs = arr.filter(x => x === 'dog');
  return [...cats, ...water, ...dogs];
}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return separate;')();
  return [
    { pass: JSON.stringify(fn(['dog','cat','water'])) === '["cat","water","dog"]', description: "['dog','cat','water'] → ['cat','water','dog']", got: JSON.stringify(fn(['dog','cat','water'])) },
    { pass: JSON.stringify(fn(['dog','cat','water','cat'])) === '["cat","cat","water","dog"]', description: "extra cat → cats first", got: JSON.stringify(fn(['dog','cat','water','cat'])) },
    { pass: JSON.stringify(fn(['cat','cat','water','dog','water','cat','water','dog'])) === '["cat","cat","cat","water","water","water","dog","dog"]', description: "multiple of each → correct groups", got: JSON.stringify(fn(['cat','cat','water','dog','water','cat','water','dog'])) },
    { pass: fn(['dog','cat','water']).indexOf('cat') < fn(['dog','cat','water']).indexOf('water'), description: "cats always before water", got: 'checked order' },
    { pass: fn(['dog','cat','water']).indexOf('water') < fn(['dog','cat','water']).indexOf('dog'), description: "water always before dogs", got: 'checked order' },
  ];
}`,
    hint: "One clean approach: make three separate passes through the array — one collecting only cats, one collecting only water, one collecting only dogs — then concatenate the three results in order.",
    resources: [],
  },
  {
    id: 50,
    title: 'isAlt',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'loops', 'vowels', 'pattern-checking', 'advanced'],
    description: "Return true if vowels and consonants strictly alternate throughout the string.",
    instructions: `Write a function called \`isAlt\` that accepts a string and returns \`true\` if the vowels (a, e, i, o, u) and consonants alternate throughout the string, \`false\` otherwise.

Examples:
  isAlt("amazon")  // true   (v-c-v-c-v-c)
  isAlt("apple")   // false  (v-c-c-l-e — two consonants in a row)
  isAlt("banana")  // true   (c-v-c-v-c-v)`,
    starterCode: `function isAlt(str) {
  // Your code here

}`,
    solution: `function isAlt(str) {
  const vowels = 'aeiouAEIOU';
  for (let i = 1; i < str.length; i++) {
    const prevIsVowel = vowels.includes(str[i - 1]);
    const currIsVowel = vowels.includes(str[i]);
    if (prevIsVowel === currIsVowel) return false;
  }
  return true;
}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return isAlt;')();
  return [
    { pass: fn("amazon") === true, description: '"amazon" alternates (v-c-v-c-v-c) → true', got: fn("amazon") },
    { pass: fn("apple") === false, description: '"apple" has two consonants in a row → false', got: fn("apple") },
    { pass: fn("banana") === true, description: '"banana" alternates (c-v-c-v-c-v) → true', got: fn("banana") },
    { pass: fn("a") === true, description: 'single character always alternates → true', got: fn("a") },
    { pass: fn("aa") === false, description: '"aa" two vowels in a row → false', got: fn("aa") },
    { pass: fn("ba") === true, description: '"ba" consonant-vowel → true', got: fn("ba") },
  ];
}`,
    hint: "Compare each character to the one before it. If two adjacent characters are both vowels, or both consonants, alternation is broken. You don't need to care about the full pattern — just check each neighboring pair.",
    resources: [],
  },
];

// Append to exercises
data.exercises.push(...missing);

// Also add these IDs to the rithm-interview-prep collection
const col = data.collections.find(c => c.id === 'rithm-interview-prep');
if (col) {
  col.exerciseIds.push(49, 50);
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✓ Added 2 missing Part 1 exercises: "separate" (49) and "isAlt" (50)`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
console.log(`✓ Rithm Interview Prep collection now has ${col.exerciseIds.length} exercises`);
