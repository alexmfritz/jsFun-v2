#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function js(title, category, tags, tier, description, instructions, starterCode, solution, testRunner, hint) {
  return { id: nextId++, title, type: 'js', tier, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources: [] };
}

const exercises = [];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION C: data-structures/strings
//
// T2 ceiling: camelCase↔snake_case, word count, reverse, count vowels
// Cushion steps:
//   C1 — titleCase (split + capitalize — combining two T2 skills)
//   C2 — reverseWords (split + reverse + join)
//   C3 — longestWord (split + loop/reduce)
//   C4 — countChar (iterate and tally)
//   C5 — Caesar cipher [upper T3]
//   C6 — run-length encode [upper T3]
// ═══════════════════════════════════════════════════════════════════════════

exercises.push(js(
  'titleCase',
  ['data-structures', 'strings'],
  ['strings', 'split', 'map', 'capitalize', 'tier3'],
  3,
  'Capitalize the first letter of every word in a string.',
  `Write a function \`titleCase(str)\` that returns the string with the first letter of each word capitalized and the rest lowercased.

\`\`\`js
titleCase('hello world');         // 'Hello World'
titleCase('the quick brown fox'); // 'The Quick Brown Fox'
titleCase('already CAPS');        // 'Already Caps'
titleCase('');                    // ''
\`\`\`

Split on spaces, capitalize each word, rejoin. This combines skills you already have: \`split\`, string indexing, \`toUpperCase\`/\`toLowerCase\`, and \`join\`.`,
  `function titleCase(str) {
  // split, transform each word, rejoin
}`,
  `function titleCase(str) {
  if (str === '') return '';
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}`,
  `(code) => {
  const titleCase = new Function(code + '; return titleCase;')();
  return [
    { pass: titleCase('hello world') === 'Hello World',             description: 'titleCase("hello world")',          got: titleCase('hello world') },
    { pass: titleCase('the quick brown fox') === 'The Quick Brown Fox', description: 'multi-word sentence',           got: titleCase('the quick brown fox') },
    { pass: titleCase('already CAPS') === 'Already Caps',           description: 'lowercases rest of word',           got: titleCase('already CAPS') },
    { pass: titleCase('') === '',                                   description: 'empty string returns empty',        got: titleCase('') },
    { pass: titleCase('one') === 'One',                             description: 'single word',                      got: titleCase('one') },
    { pass: titleCase('a b c') === 'A B C',                        description: 'single letter words',              got: titleCase('a b c') },
  ];
}`,
  `Split on ' ' to get an array of words. Map each word: take the first character with charAt(0) or [0], uppercase it, then append slice(1).toLowerCase(). Join back with ' '. The key insight: you're transforming each word independently, which is exactly what map is for.`
));

exercises.push(js(
  'reverseWords',
  ['data-structures', 'strings'],
  ['strings', 'split', 'reverse', 'join', 'tier3'],
  3,
  'Reverse the order of words in a sentence.',
  `Write a function \`reverseWords(str)\` that returns the string with the words in reversed order.

\`\`\`js
reverseWords('hello world');       // 'world hello'
reverseWords('one two three four'); // 'four three two one'
reverseWords('single');            // 'single'
\`\`\`

The letters within each word stay in their original order — only the word positions are reversed.`,
  `function reverseWords(str) {
  // split, reverse the array, rejoin
}`,
  `function reverseWords(str) {
  return str.split(' ').reverse().join(' ');
}`,
  `(code) => {
  const reverseWords = new Function(code + '; return reverseWords;')();
  return [
    { pass: reverseWords('hello world') === 'world hello',           description: 'two words reversed',        got: reverseWords('hello world') },
    { pass: reverseWords('one two three four') === 'four three two one', description: 'four words reversed',   got: reverseWords('one two three four') },
    { pass: reverseWords('single') === 'single',                     description: 'single word unchanged',     got: reverseWords('single') },
    { pass: reverseWords('a b c') === 'c b a',                      description: 'single-char words',         got: reverseWords('a b c') },
    { pass: reverseWords('the cat sat') === 'sat cat the',           description: 'three words reversed',      got: reverseWords('the cat sat') },
  ];
}`,
  `Three chained methods: split(' ') turns the string into an array of words, .reverse() reverses the array in place and returns it, .join(' ') turns it back into a string. This is the clearest example of method chaining — each step flows into the next.`
));

exercises.push(js(
  'longestWord',
  ['data-structures', 'strings'],
  ['strings', 'split', 'reduce', 'tier3'],
  3,
  'Find the longest word in a string.',
  `Write a function \`longestWord(str)\` that returns the longest word in the string.
If there is a tie, return the first one that appears.

\`\`\`js
longestWord('the quick brown fox');  // 'quick'
longestWord('I love JS');            // 'love'
longestWord('tie for longest');      // 'longest'
\`\`\``,
  `function longestWord(str) {
  // split into words, then find the longest one
}`,
  `function longestWord(str) {
  return str.split(' ').reduce((longest, word) => {
    return word.length > longest.length ? word : longest;
  });
}`,
  `(code) => {
  const longestWord = new Function(code + '; return longestWord;')();
  return [
    { pass: longestWord('the quick brown fox') === 'quick',   description: '"quick" is longest (5 chars)',     got: longestWord('the quick brown fox') },
    { pass: longestWord('I love JS') === 'love',              description: '"love" is longest (4 chars)',      got: longestWord('I love JS') },
    { pass: longestWord('tie for longest') === 'longest',     description: '"longest" wins at end',           got: longestWord('tie for longest') },
    { pass: longestWord('one') === 'one',                     description: 'single word returns it',          got: longestWord('one') },
    { pass: longestWord('aa bb cc') === 'aa',                 description: 'tie: returns first occurrence',   got: longestWord('aa bb cc') },
  ];
}`,
  `Split into words, then reduce. The accumulator starts as the first word. Each iteration: if the current word is longer than the accumulator, it becomes the new accumulator. Otherwise keep the existing longest. Using > (not >=) ensures the first of any ties wins.`
));

exercises.push(js(
  'countChar',
  ['data-structures', 'strings'],
  ['strings', 'loops', 'counting', 'tier3'],
  3,
  'Count how many times a specific character appears in a string.',
  `Write a function \`countChar(str, char)\` that returns the number of times \`char\` appears in \`str\`.

\`\`\`js
countChar('hello world', 'l');  // 3
countChar('mississippi', 's');  // 4
countChar('hello', 'z');        // 0
countChar('', 'a');             // 0
\`\`\`

The comparison should be case-sensitive: \`'A'\` and \`'a'\` are different characters.`,
  `function countChar(str, char) {
  // loop through str, count matches
}`,
  `function countChar(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
}`,
  `(code) => {
  const countChar = new Function(code + '; return countChar;')();
  return [
    { pass: countChar('hello world', 'l') === 3,  description: 'countChar("hello world", "l") === 3',  got: countChar('hello world', 'l') },
    { pass: countChar('mississippi', 's') === 4,  description: 'countChar("mississippi", "s") === 4',  got: countChar('mississippi', 's') },
    { pass: countChar('hello', 'z') === 0,        description: 'char not present returns 0',           got: countChar('hello', 'z') },
    { pass: countChar('', 'a') === 0,             description: 'empty string returns 0',               got: countChar('', 'a') },
    { pass: countChar('AaAa', 'a') === 2,         description: 'case-sensitive: only lowercase a',     got: countChar('AaAa', 'a') },
    { pass: countChar('aaa', 'a') === 3,          description: 'all chars match',                      got: countChar('aaa', 'a') },
  ];
}`,
  `Initialize count = 0. Loop through every index of str. Compare str[i] to char using ===. If they match, count++. Return count at the end. This is the same counting pattern you used in countVowels, but generalized to any character.`
));

exercises.push(js(
  'caesarCipher',
  ['data-structures', 'strings'],
  ['strings', 'charCode', 'cipher', 'tier3'],
  3,
  'Encode a string by shifting each letter forward in the alphabet by a given amount.',
  `Write a function \`caesarCipher(str, shift)\` that shifts every letter in \`str\` forward by \`shift\` positions in the alphabet. Non-letter characters are unchanged.

- Wraps around: shifting 'z' by 1 gives 'a', shifting 'Z' by 2 gives 'B'
- Preserves case: uppercase stays uppercase, lowercase stays lowercase

\`\`\`js
caesarCipher('abc', 1);    // 'bcd'
caesarCipher('xyz', 3);    // 'abc'  (wraps around)
caesarCipher('Hello!', 1); // 'Ifmmp!'  (! unchanged)
caesarCipher('ABC', 25);   // 'ZAB'
\`\`\`

Hint: \`String.fromCharCode()\` and \`str.charCodeAt(i)\` convert between characters and their numeric codes. Lowercase 'a' is 97, 'z' is 122. Uppercase 'A' is 65, 'Z' is 90.`,
  `function caesarCipher(str, shift) {
  // loop through each character
  // if it's a letter, shift it (wrapping with modulo)
  // otherwise leave it unchanged
}`,
  `function caesarCipher(str, shift) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
    } else {
      result += str[i];
    }
  }
  return result;
}`,
  `(code) => {
  const caesarCipher = new Function(code + '; return caesarCipher;')();
  return [
    { pass: caesarCipher('abc', 1) === 'bcd',    description: 'caesarCipher("abc", 1) === "bcd"',       got: caesarCipher('abc', 1) },
    { pass: caesarCipher('xyz', 3) === 'abc',    description: 'wrap-around: "xyz" shift 3 === "abc"',   got: caesarCipher('xyz', 3) },
    { pass: caesarCipher('Hello!', 1) === 'Ifmmp!', description: 'preserves case and non-letters',      got: caesarCipher('Hello!', 1) },
    { pass: caesarCipher('ABC', 25) === 'ZAB',   description: 'uppercase wrap: "ABC" shift 25 === "ZAB"', got: caesarCipher('ABC', 25) },
    { pass: caesarCipher('a', 26) === 'a',       description: 'shift 26 returns to same letter',        got: caesarCipher('a', 26) },
    { pass: caesarCipher('Hello World', 13) === 'Uryyb Jbeyq', description: 'ROT13 test',               got: caesarCipher('Hello World', 13) },
    { pass: caesarCipher('123!', 5) === '123!',  description: 'non-letters unchanged',                  got: caesarCipher('123!', 5) },
  ];
}`,
  `The key is charCodeAt(i) to get the numeric value of each character. For lowercase: subtract 97 (so 'a' becomes 0), add shift, mod 26 to wrap, add 97 back. For uppercase: same but with 65. Modulo (%) is the wrap-around mechanism — (25 + 3) % 26 = 2, which maps 'z'+3 to 'c'.`
));

// ═══════════════════════════════════════════════════════════════════════════
// SECTION D: data-structures/objects
//
// T2 ceiling: merge, invert, pick/omit, nested get
// Cushion steps:
//   D1 — transformValues (map over an object's values)
//   D2 — countByProperty (array of objects → tally grouped by key)
//   D3 — groupBy (array of objects → object of arrays)
//   D4 — deepGet by dot-notation path string
//   D5 — deepMerge [upper T3/T4]
// ═══════════════════════════════════════════════════════════════════════════

exercises.push(js(
  'transformValues',
  ['data-structures', 'objects'],
  ['objects', 'map', 'transform', 'tier3'],
  3,
  'Apply a function to every value in an object, returning a new object.',
  `Write a function \`transformValues(obj, fn)\` that returns a **new object** with the same keys but each value replaced by \`fn(value)\`.

\`\`\`js
transformValues({ a: 1, b: 2, c: 3 }, x => x * 2);
// { a: 2, b: 4, c: 6 }

transformValues({ x: 'hello', y: 'world' }, s => s.toUpperCase());
// { x: 'HELLO', y: 'WORLD' }
\`\`\`

Do not mutate the original object — return a new one.`,
  `function transformValues(obj, fn) {
  // create a new object with the same keys, values passed through fn
}`,
  `function transformValues(obj, fn) {
  const result = {};
  for (const key in obj) {
    result[key] = fn(obj[key]);
  }
  return result;
}`,
  `(code) => {
  const transformValues = new Function(code + '; return transformValues;')();
  const orig = { a: 1, b: 2, c: 3 };
  const doubled = transformValues(orig, x => x * 2);
  const strs = transformValues({ x: 'hello', y: 'world' }, s => s.toUpperCase());
  return [
    { pass: doubled.a === 2 && doubled.b === 4 && doubled.c === 6, description: 'doubles each value', got: JSON.stringify(doubled) },
    { pass: strs.x === 'HELLO' && strs.y === 'WORLD',             description: 'uppercases each value', got: JSON.stringify(strs) },
    { pass: orig.a === 1,                                          description: 'original object not mutated', got: orig.a },
    { pass: Object.keys(doubled).length === 3,                    description: 'result has same number of keys', got: Object.keys(doubled).length },
    { pass: transformValues({}, x => x).constructor === Object,   description: 'empty object returns empty object', got: JSON.stringify(transformValues({}, x => x)) },
  ];
}`,
  `Loop through the object's keys with for...in (or Object.keys). For each key, set result[key] = fn(obj[key]). You're doing the same thing as Array.map but for object values — applying a transformation to every value while keeping the keys the same.`
));

exercises.push(js(
  'countByProperty',
  ['data-structures', 'objects'],
  ['objects', 'arrays', 'reduce', 'grouping', 'tier3'],
  3,
  'Count how many objects in an array have each value of a given property.',
  `Write a function \`countByProperty(arr, prop)\` that takes an array of objects and returns an object where each key is a unique value of \`prop\`, and the value is how many times it appears.

\`\`\`js
const people = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob',   role: 'user' },
  { name: 'Carol', role: 'admin' },
  { name: 'Dave',  role: 'user' },
  { name: 'Eve',   role: 'user' },
];

countByProperty(people, 'role');
// { admin: 2, user: 3 }
\`\`\``,
  `function countByProperty(arr, prop) {
  // build an object counting occurrences of each value of prop
}`,
  `function countByProperty(arr, prop) {
  const counts = {};
  arr.forEach(item => {
    const key = item[prop];
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}`,
  `(code) => {
  const countByProperty = new Function(code + '; return countByProperty;')();
  const people = [
    { name: 'Alice', role: 'admin' },
    { name: 'Bob',   role: 'user' },
    { name: 'Carol', role: 'admin' },
    { name: 'Dave',  role: 'user' },
    { name: 'Eve',   role: 'user' },
  ];
  const pets = [
    { type: 'cat' }, { type: 'dog' }, { type: 'cat' }, { type: 'fish' }, { type: 'dog' }, { type: 'dog' },
  ];
  const byRole = countByProperty(people, 'role');
  const byType = countByProperty(pets, 'type');
  return [
    { pass: byRole.admin === 2,   description: 'admin count is 2',    got: byRole.admin },
    { pass: byRole.user === 3,    description: 'user count is 3',     got: byRole.user },
    { pass: byType.cat === 2,     description: 'cat count is 2',      got: byType.cat },
    { pass: byType.dog === 3,     description: 'dog count is 3',      got: byType.dog },
    { pass: byType.fish === 1,    description: 'fish count is 1',     got: byType.fish },
    { pass: countByProperty([], 'x').constructor === Object, description: 'empty array returns empty object', got: JSON.stringify(countByProperty([], 'x')) },
  ];
}`,
  `The pattern is: result[key] = (result[key] || 0) + 1. If the key doesn't exist yet, result[key] is undefined, so (undefined || 0) gives 0, and you add 1. If it already exists, you add 1 to the current count. This "set if absent, then increment" is a very common object-building idiom.`
));

exercises.push(js(
  'groupBy',
  ['data-structures', 'objects'],
  ['objects', 'arrays', 'reduce', 'grouping', 'tier3'],
  3,
  'Group an array of objects by the value of a given property.',
  `Write a function \`groupBy(arr, prop)\` that takes an array of objects and returns an object where each key is a unique value of \`prop\`, and each value is an **array of all objects** with that property value.

\`\`\`js
const animals = [
  { name: 'Lion',   type: 'mammal' },
  { name: 'Eagle',  type: 'bird' },
  { name: 'Whale',  type: 'mammal' },
  { name: 'Parrot', type: 'bird' },
];

groupBy(animals, 'type');
// {
//   mammal: [{ name: 'Lion', ... }, { name: 'Whale', ... }],
//   bird:   [{ name: 'Eagle', ... }, { name: 'Parrot', ... }]
// }
\`\`\``,
  `function groupBy(arr, prop) {
  // similar to countByProperty but store the whole object, not just a count
}`,
  `function groupBy(arr, prop) {
  const groups = {};
  arr.forEach(item => {
    const key = item[prop];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}`,
  `(code) => {
  const groupBy = new Function(code + '; return groupBy;')();
  const animals = [
    { name: 'Lion',   type: 'mammal' },
    { name: 'Eagle',  type: 'bird' },
    { name: 'Whale',  type: 'mammal' },
    { name: 'Parrot', type: 'bird' },
  ];
  const items = [
    { id: 1, status: 'active' },
    { id: 2, status: 'inactive' },
    { id: 3, status: 'active' },
  ];
  const byType = groupBy(animals, 'type');
  const byStatus = groupBy(items, 'status');
  return [
    { pass: Array.isArray(byType.mammal) && byType.mammal.length === 2,   description: 'mammals group has 2 items',      got: byType.mammal && byType.mammal.length },
    { pass: Array.isArray(byType.bird) && byType.bird.length === 2,       description: 'birds group has 2 items',        got: byType.bird && byType.bird.length },
    { pass: byType.mammal[0].name === 'Lion',                             description: 'first mammal is Lion',           got: byType.mammal[0] && byType.mammal[0].name },
    { pass: byType.mammal[1].name === 'Whale',                            description: 'second mammal is Whale',         got: byType.mammal[1] && byType.mammal[1].name },
    { pass: byStatus.active.length === 2,                                 description: 'active group has 2 items',       got: byStatus.active && byStatus.active.length },
    { pass: byStatus.inactive.length === 1,                               description: 'inactive group has 1 item',      got: byStatus.inactive && byStatus.inactive.length },
    { pass: groupBy([], 'x').constructor === Object,                      description: 'empty array returns empty object', got: JSON.stringify(groupBy([], 'x')) },
  ];
}`,
  `Similar structure to countByProperty, but instead of incrementing a number, you push the whole item into an array. The initialization check changes: if (!groups[key]) groups[key] = [] creates an empty array the first time a key is seen. Then groups[key].push(item) adds the item to whichever array it belongs to.`
));

exercises.push(js(
  'deepGet',
  ['data-structures', 'objects'],
  ['objects', 'nested', 'path', 'reduce', 'tier3'],
  3,
  'Access a deeply nested object property using a dot-notation path string.',
  `Write a function \`deepGet(obj, path)\` that takes an object and a dot-separated path string, and returns the value at that path. Return \`undefined\` if any part of the path doesn't exist.

\`\`\`js
const user = {
  name: 'Alice',
  address: {
    city: 'Seattle',
    zip: { code: '98101' }
  }
};

deepGet(user, 'name');                   // 'Alice'
deepGet(user, 'address.city');           // 'Seattle'
deepGet(user, 'address.zip.code');       // '98101'
deepGet(user, 'address.country');        // undefined
deepGet(user, 'address.zip.code.extra'); // undefined
\`\`\``,
  `function deepGet(obj, path) {
  // split path on '.', then traverse the object step by step
}`,
  `function deepGet(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current !== undefined && current !== null ? current[key] : undefined;
  }, obj);
}`,
  `(code) => {
  const deepGet = new Function(code + '; return deepGet;')();
  const user = { name: 'Alice', address: { city: 'Seattle', zip: { code: '98101' } } };
  return [
    { pass: deepGet(user, 'name') === 'Alice',            description: 'top-level key',                   got: deepGet(user, 'name') },
    { pass: deepGet(user, 'address.city') === 'Seattle',  description: 'one level deep',                  got: deepGet(user, 'address.city') },
    { pass: deepGet(user, 'address.zip.code') === '98101', description: 'two levels deep',                got: deepGet(user, 'address.zip.code') },
    { pass: deepGet(user, 'address.country') === undefined, description: 'missing key returns undefined', got: deepGet(user, 'address.country') },
    { pass: deepGet(user, 'address.zip.code.extra') === undefined, description: 'path too deep returns undefined', got: deepGet(user, 'address.zip.code.extra') },
    { pass: deepGet(user, 'missing.path') === undefined,  description: 'missing nested path returns undefined', got: deepGet(user, 'missing.path') },
  ];
}`,
  `Split the path on '.' to get an array of keys. Then reduce over that array, starting with obj as the accumulator. Each step: if current is not null/undefined, return current[key]. Otherwise return undefined. The guard prevents "cannot read property of undefined" errors when a key doesn't exist.`
));

exercises.push(js(
  'deepMerge',
  ['data-structures', 'objects'],
  ['objects', 'nested', 'recursion', 'merge', 'tier4'],
  4,
  'Merge two objects deeply, combining nested objects instead of overwriting them.',
  `Write a function \`deepMerge(obj1, obj2)\` that merges two objects. When both objects have a key whose value is also an object, merge those nested objects recursively. Otherwise, \`obj2\`'s value wins.

\`\`\`js
deepMerge(
  { a: 1, b: { x: 10, y: 20 } },
  { b: { y: 99, z: 30 }, c: 3 }
);
// { a: 1, b: { x: 10, y: 99, z: 30 }, c: 3 }
\`\`\`

Plain \`Object.assign\` would overwrite \`b\` entirely. \`deepMerge\` goes inside nested objects and merges them too.`,
  `function deepMerge(obj1, obj2) {
  // for each key in obj2:
  //   if both values are plain objects, recurse
  //   otherwise, obj2's value wins
}`,
  `function deepMerge(obj1, obj2) {
  const result = Object.assign({}, obj1);
  for (const key in obj2) {
    const v1 = result[key];
    const v2 = obj2[key];
    if (v1 && v2 && typeof v1 === 'object' && typeof v2 === 'object' && !Array.isArray(v1) && !Array.isArray(v2)) {
      result[key] = deepMerge(v1, v2);
    } else {
      result[key] = v2;
    }
  }
  return result;
}`,
  `(code) => {
  const deepMerge = new Function(code + '; return deepMerge;')();
  const r1 = deepMerge({ a: 1, b: { x: 10, y: 20 } }, { b: { y: 99, z: 30 }, c: 3 });
  const r2 = deepMerge({ a: 1 }, { b: 2 });
  const r3 = deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } });
  const orig1 = { a: 1, b: { x: 10 } };
  const orig2 = { b: { y: 20 } };
  deepMerge(orig1, orig2);
  return [
    { pass: r1.a === 1,            description: 'keeps obj1 key not in obj2',       got: r1.a },
    { pass: r1.c === 3,            description: 'adds obj2 key not in obj1',        got: r1.c },
    { pass: r1.b.x === 10,        description: 'nested: keeps obj1 sub-key',       got: r1.b.x },
    { pass: r1.b.y === 99,        description: 'nested: obj2 wins on conflict',     got: r1.b.y },
    { pass: r1.b.z === 30,        description: 'nested: adds new obj2 sub-key',    got: r1.b.z },
    { pass: r2.a === 1 && r2.b === 2, description: 'flat merge works correctly',   got: JSON.stringify(r2) },
    { pass: r3.a.b.c === 1 && r3.a.b.d === 2, description: 'three levels deep merge', got: JSON.stringify(r3.a) },
    { pass: orig1.b.x === 10 && !orig1.b.y, description: 'originals not mutated',  got: JSON.stringify(orig1.b) },
  ];
}`,
  `Start by shallow-copying obj1 with Object.assign({}, obj1). Then loop through obj2's keys. For each key: if both values are plain objects (not arrays), call deepMerge recursively on them — this is what makes it "deep". Otherwise, simply assign obj2's value. The recursion bottoms out when it reaches non-object values.`
));

// ═══════════════════════════════════════════════════════════════════════════
// SECTION E: syntax-translation
//
// T2 ceiling: implement myMap, myFilter, myReduce from scratch
// Cushion steps:
//   E1 — myFlatMap (map then flatten — extend myMap)
//   E2 — myZip (pair two arrays — new but concrete)
//   E3 — myGroupBy (uses reduce in a new way)
// ═══════════════════════════════════════════════════════════════════════════

exercises.push(js(
  'Implement myFlatMap',
  ['syntax-translation', 'refactoring'],
  ['higher-order', 'flatMap', 'map', 'flatten', 'tier3'],
  3,
  'Implement flatMap from scratch — map each element, then flatten one level.',
  `Write a function \`myFlatMap(arr, fn)\` that works like \`Array.flatMap\`: it maps each element through \`fn\`, then flattens the result by one level.

\`\`\`js
myFlatMap([1, 2, 3], x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6]

myFlatMap(['hello world', 'foo bar'], s => s.split(' '));
// ['hello', 'world', 'foo', 'bar']

myFlatMap([1, 2, 3], x => x % 2 === 0 ? [x] : []);
// [2]  — odd numbers mapped to empty arrays, then flattened away
\`\`\`

Do not use the built-in \`.flatMap()\` or \`.flat()\`. Use your \`myMap\` and \`myReduce\` knowledge.`,
  `function myFlatMap(arr, fn) {
  // map each element through fn, then flatten the results one level
}`,
  `function myFlatMap(arr, fn) {
  const mapped = [];
  for (let i = 0; i < arr.length; i++) {
    mapped.push(fn(arr[i], i, arr));
  }
  const result = [];
  for (let i = 0; i < mapped.length; i++) {
    if (Array.isArray(mapped[i])) {
      for (let j = 0; j < mapped[i].length; j++) {
        result.push(mapped[i][j]);
      }
    } else {
      result.push(mapped[i]);
    }
  }
  return result;
}`,
  `(code) => {
  const myFlatMap = new Function(code + '; return myFlatMap;')();
  const r1 = myFlatMap([1, 2, 3], x => [x, x * 2]);
  const r2 = myFlatMap(['hello world', 'foo bar'], s => s.split(' '));
  const r3 = myFlatMap([1, 2, 3], x => x % 2 === 0 ? [x] : []);
  const r4 = myFlatMap([1, 2, 3], x => x * 10);
  return [
    { pass: JSON.stringify(r1) === '[1,2,2,4,3,6]',              description: 'each element mapped to pair, flattened',    got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '["hello","world","foo","bar"]', description: 'strings split and flattened',             got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[2]',                         description: 'empty arrays flatten away (filter-like)',   got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === '[10,20,30]',                  description: 'non-array results work too',               got: JSON.stringify(r4) },
    { pass: myFlatMap([], x => [x]).length === 0,                 description: 'empty array returns empty',                got: myFlatMap([], x => [x]).length },
  ];
}`,
  `Two steps: first map every element through fn to get an array of results. Then flatten — loop through each result; if it's an array, push each element individually; if not, push it as-is. This "flatten one level" behavior is the difference between map (keeps nesting) and flatMap (removes one level).`
));

exercises.push(js(
  'Implement myZip',
  ['syntax-translation', 'refactoring'],
  ['arrays', 'zip', 'pair', 'tier3'],
  3,
  'Implement zip — combine two arrays element by element into pairs.',
  `Write a function \`myZip(arr1, arr2)\` that takes two arrays and returns an array of pairs, where each pair contains the elements at the same index from each array.

Stop at the length of the shorter array.

\`\`\`js
myZip([1, 2, 3], ['a', 'b', 'c']);
// [[1, 'a'], [2, 'b'], [3, 'c']]

myZip([1, 2], ['a', 'b', 'c', 'd']);
// [[1, 'a'], [2, 'b']]  — stops at shorter array

myZip([], [1, 2, 3]);
// []
\`\`\``,
  `function myZip(arr1, arr2) {
  // loop up to the shorter array's length, building pairs
}`,
  `function myZip(arr1, arr2) {
  const result = [];
  const len = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < len; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  return result;
}`,
  `(code) => {
  const myZip = new Function(code + '; return myZip;')();
  const r1 = myZip([1, 2, 3], ['a', 'b', 'c']);
  const r2 = myZip([1, 2], ['a', 'b', 'c', 'd']);
  const r3 = myZip([], [1, 2, 3]);
  const r4 = myZip([10, 20, 30], [1, 2, 3]);
  return [
    { pass: JSON.stringify(r1) === '[[1,"a"],[2,"b"],[3,"c"]]', description: 'equal length arrays zipped correctly',   got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[[1,"a"],[2,"b"]]',         description: 'stops at shorter array length',         got: JSON.stringify(r2) },
    { pass: r3.length === 0,                                    description: 'empty first array returns []',          got: r3.length },
    { pass: JSON.stringify(r4[0]) === '[10,1]',                 description: 'first pair correct',                   got: JSON.stringify(r4[0]) },
    { pass: Array.isArray(r1[0]),                               description: 'each element is an array (pair)',      got: Array.isArray(r1[0]) },
    { pass: r1[0].length === 2,                                 description: 'each pair has exactly 2 elements',    got: r1[0].length },
  ];
}`,
  `Use Math.min(arr1.length, arr2.length) to find the stopping point. Loop from 0 to that length. Each iteration: push [arr1[i], arr2[i]] — a two-element array — into result. That inner array is the "pair" for that index position.`
));

exercises.push(js(
  'Implement myGroupBy',
  ['syntax-translation', 'refactoring'],
  ['arrays', 'reduce', 'groupBy', 'tier3'],
  3,
  'Implement groupBy from scratch using a loop or reduce.',
  `Write a function \`myGroupBy(arr, fn)\` that groups the elements of \`arr\` into an object. The key for each element is determined by calling \`fn(element)\`.

\`\`\`js
myGroupBy([1, 2, 3, 4, 5, 6], x => x % 2 === 0 ? 'even' : 'odd');
// { odd: [1, 3, 5], even: [2, 4, 6] }

myGroupBy(['one', 'two', 'three', 'four'], s => s.length);
// { 3: ['one', 'two'], 4: ['four'], 5: ['three'] }
\`\`\`

This is similar to the \`groupBy\` exercise on objects, but here the grouping key comes from a **function** rather than a property name.`,
  `function myGroupBy(arr, fn) {
  // use a loop or reduce to build the groups object
}`,
  `function myGroupBy(arr, fn) {
  const groups = {};
  arr.forEach(item => {
    const key = fn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}`,
  `(code) => {
  const myGroupBy = new Function(code + '; return myGroupBy;')();
  const r1 = myGroupBy([1, 2, 3, 4, 5, 6], x => x % 2 === 0 ? 'even' : 'odd');
  const r2 = myGroupBy(['one', 'two', 'three', 'four'], s => s.length);
  return [
    { pass: JSON.stringify(r1.odd) === '[1,3,5]',           description: 'odd group is [1,3,5]',             got: JSON.stringify(r1.odd) },
    { pass: JSON.stringify(r1.even) === '[2,4,6]',          description: 'even group is [2,4,6]',            got: JSON.stringify(r1.even) },
    { pass: JSON.stringify(r2[3]) === '["one","two"]',      description: 'length-3 words group correctly',   got: JSON.stringify(r2[3]) },
    { pass: JSON.stringify(r2[5]) === '["three"]',          description: 'length-5 words group correctly',   got: JSON.stringify(r2[5]) },
    { pass: myGroupBy([], x => x).constructor === Object,   description: 'empty array returns empty object', got: JSON.stringify(myGroupBy([], x => x)) },
  ];
}`,
  `Same structure as the groupBy object exercise, but instead of item[prop] to get the key, you call fn(item). That one change makes it much more flexible — the grouping logic can be anything: remainder, string length, a condition, etc.`
));

// ═══════════════════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════════════════
console.log('Self-validating...');
let totalTests = 0;
let failed = false;

exercises.forEach(e => {
  try {
    const fn = new Function('code', 'return (' + e.testRunner + ')(code)');
    const results = fn(e.solution);
    const bad = results.filter(r => !r.pass);
    totalTests += results.length;
    if (bad.length) {
      failed = true;
      bad.forEach(r => console.error('  ✗', e.title, '—', r.description, '— got:', r.got));
    } else {
      console.log('  ✓', e.title, '(' + results.length + ')');
    }
  } catch (err) {
    failed = true;
    console.error('  ✗ CRASH', e.title, err.message);
  }
});

if (failed) { console.error('\nAborting.'); process.exit(1); }
console.log('\n✓ All ' + totalTests + ' tests pass across ' + exercises.length + ' exercises\n');

data.exercises.push(...exercises);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Written. Next ID:', nextId);
console.log('Total exercises:', data.exercises.length);
