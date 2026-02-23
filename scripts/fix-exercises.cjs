const fs = require('fs');
const file = './exercises/exercises.json';
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

// Fix #457 Darts: (-7, 7.1) has distance ~9.97 which is inside target
// Change to (-8, 8) which has distance ~11.3 (outside)
const darts = data.exercises.find(e => e.id === 457);
darts.testRunner = darts.testRunner
  .replace("fn(-7, 7.1) === 0, description: 'Just outside target', got: String(fn(-7, 7.1))",
           "fn(-8, 8) === 0, description: 'Outside the target (far)', got: String(fn(-8, 8))");

// Fix #460 Pangram: test string was actually a pangram. Use clearer non-pangram
const pangram = data.exercises.find(e => e.id === 460);
pangram.testRunner = pangram.testRunner
  .replace(
    "fn('the quick brown fox jumps over with lazy FIG and target') === false, description: 'Almost pangram (still missing letters)', got: String(fn('the quick brown fox jumps over with lazy FIG and target'))",
    "fn('the quick brown fox jumps over the lazy do') === false, description: 'Almost pangram (missing g)', got: String(fn('the quick brown fox jumps over the lazy do'))"
  );

// Fix #461 Isogram: apostrophe in description broke eval. Remove apostrophes.
const isogram = data.exercises.find(e => e.id === 461);
isogram.testRunner = `(code) => {
  const fn = new Function(code + '; return isIsogram;')();
  return [
    { pass: fn('') === true, description: 'Empty string is an isogram', got: String(fn('')) },
    { pass: fn('lumberjacks') === true, description: 'lumberjacks is an isogram', got: String(fn('lumberjacks')) },
    { pass: fn('isograms') === false, description: 'isograms has repeating s', got: String(fn('isograms')) },
    { pass: fn('eleven') === false, description: 'eleven has repeating e', got: String(fn('eleven')) },
    { pass: fn('subdermatoglyphic') === true, description: 'Longest known isogram', got: String(fn('subdermatoglyphic')) },
    { pass: fn('Alphabet') === false, description: 'Case-insensitive check', got: String(fn('Alphabet')) },
    { pass: fn('six-year-old') === true, description: 'Hyphens are ignored', got: String(fn('six-year-old')) }
  ];
}`;

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Fixed exercises 457, 460, 461');
