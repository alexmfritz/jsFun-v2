#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// ─── New Collection ──────────────────────────────────────────────────────────
const rithmIds = Array.from({ length: 28 }, (_, i) => i + 21); // 21-48

data.collections.push({
  id: 'rithm-interview-prep',
  name: 'Rithm Interview Prep',
  description: 'Classic interview-style exercises from Rithm School covering strings, arrays, and objects',
  exerciseIds: rithmIds,
  color: '#f97316',
});

// ─── Helper ──────────────────────────────────────────────────────────────────
function ex(id, title, tier, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources = []) {
  return { id, title, type: 'js', tier, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources };
}

// ─── 28 Rithm Exercises ─────────────────────────────────────────────────────
const rithmExercises = [

  ex(21, 'Append to String', 1,
    ['data-structures', 'strings'],
    ['strings', 'concatenation', 'beginner'],
    'Return a new string with the second string appended to the first.',
    'Write a function called `appendToString` that accepts two strings and returns a new string with the second appended to the first.\n\nExamples:\n  appendToString("Hello", " World!") → "Hello World!"\n  appendToString("Foo", "bar")       → "Foobar"\n  appendToString("", "test")         → "test"\n  appendToString("other test", "")   → "other test"',
    'function appendToString(str1, str2) {\n  // Your code here\n\n}',
    'function appendToString(str1, str2) {\n  return str1 + str2;\n}',
    `(code) => { const fn = new Function(code + '; return appendToString;')(); return [ { pass: fn('Hello',' World!') === 'Hello World!', description: 'appendToString("Hello", " World!") → "Hello World!"', got: fn('Hello',' World!') }, { pass: fn('Foo','bar') === 'Foobar', description: 'appendToString("Foo","bar") → "Foobar"', got: fn('Foo','bar') }, { pass: fn('bar','Foo') === 'barFoo', description: 'appendToString("bar","Foo") → "barFoo"', got: fn('bar','Foo') }, { pass: fn('','test') === 'test', description: 'empty first string → "test"', got: fn('','test') }, { pass: fn('other test','') === 'other test', description: 'empty second string → "other test"', got: fn('other test','') } ]; }`,
    'Combining two strings is called concatenation. The + operator joins strings together. Think about what order the strings need to appear in.',
  ),

  ex(22, 'Prepend to String', 1,
    ['data-structures', 'strings'],
    ['strings', 'concatenation', 'beginner'],
    'Return a new string with the second string prepended to the first.',
    'Write a function called `prependToString` that accepts two strings and returns a new string with the second prepended to the first.\n\nExamples:\n  prependToString("awesome", "very")    → "veryawesome"\n  prependToString("world", "hello ")    → "hello world"\n  prependToString("nothing", "")         → "nothing"',
    'function prependToString(str1, str2) {\n  // Your code here\n\n}',
    'function prependToString(str1, str2) {\n  return str2 + str1;\n}',
    `(code) => { const fn = new Function(code + '; return prependToString;')(); return [ { pass: fn('awesome','very') === 'veryawesome', description: 'prependToString("awesome","very") → "veryawesome"', got: fn('awesome','very') }, { pass: fn('world','hello ') === 'hello world', description: 'prependToString("world","hello ") → "hello world"', got: fn('world','hello ') }, { pass: fn('nothing','') === 'nothing', description: 'empty second string → "nothing"', got: fn('nothing','') } ]; }`,
    'Prepend means "put before". If the second string goes in front, what order do the operands need to be in when you concatenate?',
  ),

  ex(23, 'charAt (No Built-in)', 2,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'indexing', 'no-built-ins', 'intermediate'],
    'Return the character at a given index — without using the built-in charAt method.',
    'Write a function called `charAt` which accepts a string and an index (number) and returns the character at that index.\n\nReturn an empty string if the index is greater than or equal to the length of the string.\n\n**Do not use the built-in `String.prototype.charAt()` method.**\n\nExamples:\n  charAt("awesome", 2)  → "e"\n  charAt("awesome", 12) → ""',
    'function charAt(str, idx) {\n  // Do not use str.charAt() — use bracket notation or another approach\n\n}',
    'function charAt(str, idx) {\n  if (idx >= str.length) return "";\n  return str[idx];\n}',
    `(code) => { const fn = new Function(code + '; return charAt;')(); return [ { pass: fn('awesome',2) === 'e', description: 'charAt("awesome",2) → "e"', got: fn('awesome',2) }, { pass: fn('awesome',0) === 'a', description: 'charAt("awesome",0) → "a"', got: fn('awesome',0) }, { pass: fn('awesome',12) === '', description: 'out-of-bounds → ""', got: fn('awesome',12) }, { pass: fn('awesome',6) === 'e', description: 'charAt("awesome",6) → "e"', got: fn('awesome',6) } ]; }`,
    'Strings in JavaScript support bracket notation just like arrays — you can access individual characters with str[index]. What should happen when the index is larger than the last valid position?',
  ),

  ex(24, 'stringIncludes (No Built-in)', 2,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'searching', 'no-built-ins', 'intermediate'],
    'Return true if a string contains a character — without using String.includes().',
    'Write a function called `stringIncludes` which accepts two strings: a word and a single character.\n\nReturn `true` if the word contains the character, otherwise `false`.\n\n**Do not use the built-in `String.prototype.includes()` method.**\n\nExamples:\n  stringIncludes("awesome", "e") → true\n  stringIncludes("awesome", "z") → false',
    'function stringIncludes(word, char) {\n  // Do not use word.includes()\n\n}',
    'function stringIncludes(word, char) {\n  for (let i = 0; i < word.length; i++) {\n    if (word[i] === char) return true;\n  }\n  return false;\n}',
    `(code) => { const fn = new Function(code + '; return stringIncludes;')(); return [ { pass: fn('awesome','e') === true, description: 'stringIncludes("awesome","e") → true', got: fn('awesome','e') }, { pass: fn('awesome','z') === false, description: 'stringIncludes("awesome","z") → false', got: fn('awesome','z') }, { pass: fn('awesome','a') === true, description: '"a" is the first char', got: fn('awesome','a') }, { pass: fn('awesome','e') === true, description: '"e" appears at multiple positions', got: fn('awesome','e') } ]; }`,
    'You can walk through each character of a string with a loop and compare it to the target character. As soon as you find a match, what should you return? What if you finish the loop without finding one?',
  ),

  ex(25, 'stringIndexOf (No Built-in)', 2,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'searching', 'no-built-ins', 'intermediate'],
    'Return the first index of a character in a string — without String.indexOf().',
    'Write a function called `stringIndexOf` which accepts two strings: a word and a single character.\n\nReturn the first index where the character is found, or `-1` if not found.\n\n**Do not use the built-in `String.prototype.indexOf()` method.**\n\nExamples:\n  stringIndexOf("awesome", "e") → 2\n  stringIndexOf("awesome", "z") → -1',
    'function stringIndexOf(word, char) {\n  // Do not use word.indexOf()\n\n}',
    'function stringIndexOf(word, char) {\n  for (let i = 0; i < word.length; i++) {\n    if (word[i] === char) return i;\n  }\n  return -1;\n}',
    `(code) => { const fn = new Function(code + '; return stringIndexOf;')(); return [ { pass: fn('awesome','e') === 2, description: 'stringIndexOf("awesome","e") → 2', got: fn('awesome','e') }, { pass: fn('awesome','z') === -1, description: 'not found → -1', got: fn('awesome','z') }, { pass: fn('awesome','a') === 0, description: '"a" is at index 0', got: fn('awesome','a') }, { pass: fn('hello','l') === 2, description: 'returns first occurrence for "hello","l" → 2', got: fn('hello','l') } ]; }`,
    'Loop through the string with an index counter. The moment you find a matching character, return that index. If the loop ends without a match, -1 is the conventional "not found" sentinel value.',
  ),

  ex(26, 'stringLastIndexOf (No Built-in)', 3,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'searching', 'no-built-ins', 'intermediate'],
    'Return the last index of a character in a string — without String.lastIndexOf().',
    'Write a function called `stringLastIndexOf` which accepts two strings: a word and a single character.\n\nReturn the last index where the character appears, or `-1` if not found.\n\n**Do not use the built-in `String.prototype.lastIndexOf()` method.**\n\nExamples:\n  stringLastIndexOf("awesome", "e") → 6\n  stringLastIndexOf("awesome", "z") → -1',
    'function stringLastIndexOf(word, char) {\n  // Do not use word.lastIndexOf()\n\n}',
    'function stringLastIndexOf(word, char) {\n  for (let i = word.length - 1; i >= 0; i--) {\n    if (word[i] === char) return i;\n  }\n  return -1;\n}',
    `(code) => { const fn = new Function(code + '; return stringLastIndexOf;')(); return [ { pass: fn('awesome','e') === 6, description: 'stringLastIndexOf("awesome","e") → 6', got: fn('awesome','e') }, { pass: fn('awesome','z') === -1, description: 'not found → -1', got: fn('awesome','z') }, { pass: fn('hello','l') === 3, description: '"hello","l" → 3 (last l)', got: fn('hello','l') }, { pass: fn('awesome','a') === 0, description: '"a" only appears at 0', got: fn('awesome','a') } ]; }`,
    'Finding the last occurrence is like finding the first — except you should iterate in reverse, from the end of the string toward the beginning. The first match you find going backwards is the last match going forwards.',
  ),

  ex(27, 'repeat (No Built-in)', 2,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'no-built-ins', 'intermediate'],
    'Repeat a string n times — without String.repeat().',
    'Write a function called `repeat` which accepts a string and a number and returns the string repeated that many times.\n\n**Do not use the built-in `String.prototype.repeat()` method.**\n\nExamples:\n  repeat("Matt", 3)    → "MattMattMatt"\n  repeat("Elie", 2)    → "ElieElie"\n  repeat("Michael", 0) → ""',
    'function repeat(str, n) {\n  // Do not use str.repeat()\n\n}',
    'function repeat(str, n) {\n  let result = "";\n  for (let i = 0; i < n; i++) {\n    result += str;\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return repeat;')(); return [ { pass: fn('Matt',3) === 'MattMattMatt', description: 'repeat("Matt",3) → "MattMattMatt"', got: fn('Matt',3) }, { pass: fn('Elie',2) === 'ElieElie', description: 'repeat("Elie",2) → "ElieElie"', got: fn('Elie',2) }, { pass: fn('Michael',0) === '', description: 'repeat("Michael",0) → ""', got: fn('Michael',0) }, { pass: fn('a',1) === 'a', description: 'repeat("a",1) → "a"', got: fn('a',1) } ]; }`,
    'You need an accumulator that starts empty. Each time through a loop, add the string to it. How many times should the loop run? What should you return when n is 0?',
  ),

  ex(28, 'removeFromString', 2,
    ['data-structures', 'strings'],
    ['strings', 'slicing', 'intermediate'],
    'Remove a section of characters from a string given a start index and count.',
    'Write a function called `removeFromString` which accepts a string, a starting index, and a number of characters to remove.\n\nReturn the new string with those characters removed.\n\nExamples:\n  removeFromString("Elie", 2, 2)       → "El"\n  removeFromString("Elie", 0, 1)       → "lie"\n  removeFromString("Rithm School", 0, 6) → "School"\n  removeFromString("Rithm School", 2, 4) → "RiSchool"\n  removeFromString("Rithm School", 6, 400) → "Rithm "',
    'function removeFromString(str, startIdx, numChars) {\n  // Your code here\n\n}',
    'function removeFromString(str, startIdx, numChars) {\n  return str.slice(0, startIdx) + str.slice(startIdx + numChars);\n}',
    `(code) => { const fn = new Function(code + '; return removeFromString;')(); return [ { pass: fn('Elie',2,2) === 'El', description: 'removeFromString("Elie",2,2) → "El"', got: fn('Elie',2,2) }, { pass: fn('Elie',0,1) === 'lie', description: 'removeFromString("Elie",0,1) → "lie"', got: fn('Elie',0,1) }, { pass: fn('Rithm School',0,6) === 'School', description: 'remove first 6 chars', got: fn('Rithm School',0,6) }, { pass: fn('Rithm School',2,4) === 'RiSchool', description: 'remove from middle', got: fn('Rithm School',2,4) }, { pass: fn('Rithm School',6,400) === 'Rithm ', description: 'large count clips to end', got: fn('Rithm School',6,400) } ]; }`,
    'Think of the result as two parts joined together: everything before the removal point, and everything after the removal section ends. String.slice() takes a start and end index.',
  ),

  ex(29, 'includes (Universal)', 3,
    ['data-structures', 'arrays'],
    ['arrays', 'strings', 'objects', 'searching', 'intermediate'],
    'Check if a value exists in a string, array, or object.',
    'Write a function called `includes` which accepts a collection (string, array, or object), a value, and an optional starting index.\n\nReturn `true` if the value exists in the collection from that starting point, otherwise `false`.\n\n- For strings and arrays, the third parameter is the starting index.\n- For objects, search among values (index is ignored).\n\nExamples:\n  includes([1,2,3], 1)        → true\n  includes([1,2,3], 1, 2)     → false\n  includes({a:1,b:2}, 1)      → true\n  includes({a:1,b:2}, "a")   → false\n  includes("abcd", "b")       → true\n  includes("abcd", "a", 2)    → false',
    'function includes(collection, value, startIdx) {\n  // Handle string, array, and object cases\n\n}',
    `function includes(collection, value, startIdx) {
  if (typeof collection === 'string' || Array.isArray(collection)) {
    const start = startIdx !== undefined ? startIdx : 0;
    for (let i = start; i < collection.length; i++) {
      if (collection[i] === value) return true;
    }
    return false;
  }
  // object
  return Object.values(collection).some(v => v === value);
}`,
    `(code) => { const fn = new Function(code + '; return includes;')(); return [ { pass: fn([1,2,3],1) === true, description: 'includes([1,2,3],1) → true', got: fn([1,2,3],1) }, { pass: fn([1,2,3],1,2) === false, description: 'includes([1,2,3],1,2) → false (startIdx=2)', got: fn([1,2,3],1,2) }, { pass: fn([1,2,3],6) === false, description: 'value not in array → false', got: fn([1,2,3],6) }, { pass: fn({a:1,b:2},1) === true, description: 'includes({a:1,b:2},1) → true (value exists)', got: fn({a:1,b:2},1) }, { pass: fn({a:1,b:2},'a') === false, description: 'includes({a:1,b:2},"a") → false (keys not searched)', got: fn({a:1,b:2},'a') }, { pass: fn('abcd','b') === true, description: 'includes("abcd","b") → true', got: fn('abcd','b') }, { pass: fn('abcd','a',2) === false, description: 'includes("abcd","a",2) → false (startIdx=2)', got: fn('abcd','a',2) } ]; }`,
    'Three different collection types need three different strategies. For ordered collections (strings, arrays), you can use a loop that starts at the given index. For objects, you only care about values, not keys.',
  ),

  ex(30, 'indexOf (No Built-in)', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'searching', 'no-built-ins', 'intermediate'],
    'Return the first index of a value in an array — without Array.indexOf().',
    'Write a function called `indexOf` which accepts an array and a value.\n\nReturn the first index at which the value exists, or `-1` if not found.\n\n**Do not use the built-in `Array.prototype.indexOf()` method.**\n\nExamples:\n  indexOf([5,10,15,20], 20) → 3\n  indexOf([1,2,3,4,5], 2)  → 1\n  indexOf([1,2], 10)        → -1',
    'function indexOf(arr, value) {\n  // Do not use arr.indexOf()\n\n}',
    'function indexOf(arr, value) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === value) return i;\n  }\n  return -1;\n}',
    `(code) => { const fn = new Function(code + '; return indexOf;')(); return [ { pass: fn([5,10,15,20],20) === 3, description: 'indexOf([5,10,15,20],20) → 3', got: fn([5,10,15,20],20) }, { pass: fn([1,2,3,4,5],2) === 1, description: 'indexOf([1,2,3,4,5],2) → 1', got: fn([1,2,3,4,5],2) }, { pass: fn([1,2],10) === -1, description: 'not found → -1', got: fn([1,2],10) }, { pass: fn([1,2,3,1],1) === 0, description: 'returns first occurrence', got: fn([1,2,3,1],1) } ]; }`,
    'Loop through each element comparing it to the target value. When you find a match, return the current index. If the loop completes without a match, return -1.',
  ),

  ex(31, 'lastIndexOf (No Built-in)', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'searching', 'no-built-ins', 'intermediate'],
    'Return the last index of a value in an array — without Array.lastIndexOf().',
    'Write a function called `lastIndexOf` which accepts an array and a value.\n\nReturn the last index where the value exists, or `-1` if not found.\n\n**Do not use the built-in `Array.prototype.lastIndexOf()` method.**\n\nExamples:\n  lastIndexOf([1,2,3,4], 2)    → 1\n  lastIndexOf([1,2,3,4,2], 2)  → 4\n  lastIndexOf([1,2,3,4], 22)   → -1',
    'function lastIndexOf(arr, value) {\n  // Do not use arr.lastIndexOf()\n\n}',
    'function lastIndexOf(arr, value) {\n  for (let i = arr.length - 1; i >= 0; i--) {\n    if (arr[i] === value) return i;\n  }\n  return -1;\n}',
    `(code) => { const fn = new Function(code + '; return lastIndexOf;')(); return [ { pass: fn([1,2,3,4],2) === 1, description: 'lastIndexOf([1,2,3,4],2) → 1', got: fn([1,2,3,4],2) }, { pass: fn([1,2,3,4,2],2) === 4, description: 'lastIndexOf([1,2,3,4,2],2) → 4', got: fn([1,2,3,4,2],2) }, { pass: fn([1,2,3,4],22) === -1, description: 'not found → -1', got: fn([1,2,3,4],22) }, { pass: fn([5,5,5],5) === 2, description: 'all same: returns last index', got: fn([5,5,5],5) } ]; }`,
    'To find the last occurrence, iterate from the end of the array toward the beginning. The first match you encounter going backwards is the last match in the original order.',
  ),

  ex(32, 'max (No Built-in)', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'comparison', 'no-built-ins', 'intermediate'],
    'Find the highest value in an array — without Math.max().',
    'Write a function called `max` which accepts an array of numbers and returns the highest value.\n\n**Do not use the built-in `Math.max()` function.**\n\nExamples:\n  max([5,1,4,7,1,2])       → 7\n  max([3,4,12,1,8])        → 12\n  max([-1,6,3,2.2,-10,-4]) → 6',
    'function max(arr) {\n  // Do not use Math.max()\n\n}',
    'function max(arr) {\n  let highest = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > highest) highest = arr[i];\n  }\n  return highest;\n}',
    `(code) => { const fn = new Function(code + '; return max;')(); return [ { pass: fn([5,1,4,7,1,2]) === 7, description: 'max([5,1,4,7,1,2]) → 7', got: fn([5,1,4,7,1,2]) }, { pass: fn([3,4,12,1,8]) === 12, description: 'max([3,4,12,1,8]) → 12', got: fn([3,4,12,1,8]) }, { pass: fn([-1,6,3,2.2,-10,-4]) === 6, description: 'max with negatives → 6', got: fn([-1,6,3,2.2,-10,-4]) }, { pass: fn([42]) === 42, description: 'single element → itself', got: fn([42]) } ]; }`,
    'Keep a running "champion" — start with the first element and compare each subsequent element to it. Whenever you find something larger, it becomes the new champion. At the end, return whoever won.',
  ),

  ex(33, 'min (No Built-in)', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'comparison', 'no-built-ins', 'intermediate'],
    'Find the lowest value in an array — without Math.min().',
    'Write a function called `min` which accepts an array of numbers and returns the lowest value.\n\n**Do not use the built-in `Math.min()` function.**\n\nExamples:\n  min([5,1,4,7,1,2])       → 1\n  min([-1,6,3,2.2,-10,-4]) → -10',
    'function min(arr) {\n  // Do not use Math.min()\n\n}',
    'function min(arr) {\n  let lowest = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < lowest) lowest = arr[i];\n  }\n  return lowest;\n}',
    `(code) => { const fn = new Function(code + '; return min;')(); return [ { pass: fn([5,1,4,7,1,2]) === 1, description: 'min([5,1,4,7,1,2]) → 1', got: fn([5,1,4,7,1,2]) }, { pass: fn([-1,6,3,2.2,-10,-4]) === -10, description: 'min with negatives → -10', got: fn([-1,6,3,2.2,-10,-4]) }, { pass: fn([100,200,50]) === 50, description: 'min([100,200,50]) → 50', got: fn([100,200,50]) }, { pass: fn([-5]) === -5, description: 'single element → itself', got: fn([-5]) } ]; }`,
    'The same "running champion" pattern as max — but this time you update whenever you find something smaller, not larger.',
  ),

  ex(34, 'slice (No Built-in)', 3,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'slicing', 'no-built-ins', 'intermediate'],
    'Return a slice of an array from start to end — without Array.slice().',
    'Write a function called `slice` which accepts an array and two numbers (start, end).\n\nReturn a new array with elements from startIdx up to (but not including) endIdx.\n\nIf end is not provided, slice to the end of the array. If end exceeds the length, also slice to the end.\n\n**Do not use the built-in `Array.prototype.slice()` method.**\n\nExamples:\n  slice([1,2,3,4,5], 0, 2)  → [1,2]\n  slice([1,2,3,4,5], 2, 4)  → [3,4]\n  slice([1,2,3,4,5], 2)     → [3,4,5]\n  slice([1,2,3,4,5], 2, 10) → [3,4,5]',
    'function slice(arr, startIdx, endIdx) {\n  // Do not use arr.slice()\n\n}',
    `function slice(arr, startIdx, endIdx) {
  const end = endIdx === undefined ? arr.length : Math.min(endIdx, arr.length);
  const result = [];
  for (let i = startIdx; i < end; i++) {
    result.push(arr[i]);
  }
  return result;
}`,
    `(code) => { const fn = new Function(code + '; return slice;')(); return [ { pass: JSON.stringify(fn([1,2,3,4,5],0,2)) === '[1,2]', description: 'slice([1,2,3,4,5],0,2) → [1,2]', got: JSON.stringify(fn([1,2,3,4,5],0,2)) }, { pass: JSON.stringify(fn([1,2,3,4,5],2,4)) === '[3,4]', description: 'slice([1,2,3,4,5],2,4) → [3,4]', got: JSON.stringify(fn([1,2,3,4,5],2,4)) }, { pass: JSON.stringify(fn([1,2,3,4,5],2)) === '[3,4,5]', description: 'no end → slices to end', got: JSON.stringify(fn([1,2,3,4,5],2)) }, { pass: JSON.stringify(fn([1,2,3,4,5],2,10)) === '[3,4,5]', description: 'end > length → clips to end', got: JSON.stringify(fn([1,2,3,4,5],2,10)) } ]; }`,
    'Build a new array by looping from startIdx to endIdx. You need to handle two edge cases: when endIdx is not provided at all, and when it is larger than the array length.',
  ),

  ex(35, 'countValues', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'counting', 'beginner'],
    'Count how many times a value appears in an array.',
    'Write a function called `countValues` which accepts an array and a value and returns the number of times that value appears in the array.\n\nExamples:\n  countValues([4,1,4,2,3,4,4], 4)   → 4\n  countValues([4,1,4,2,3,4,4], 100) → 0\n  countValues([], 1)                  → 0',
    'function countValues(arr, value) {\n  // Your code here\n\n}',
    'function countValues(arr, value) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === value) count++;\n  }\n  return count;\n}',
    `(code) => { const fn = new Function(code + '; return countValues;')(); return [ { pass: fn([4,1,4,2,3,4,4],4) === 4, description: 'countValues([4,1,4,2,3,4,4],4) → 4', got: fn([4,1,4,2,3,4,4],4) }, { pass: fn([4,1,4,2,3,4,4],100) === 0, description: 'value not present → 0', got: fn([4,1,4,2,3,4,4],100) }, { pass: fn([],1) === 0, description: 'empty array → 0', got: fn([],1) }, { pass: fn([1,1,1],1) === 3, description: 'all matching → 3', got: fn([1,1,1],1) } ]; }`,
    'Use a counter variable that starts at 0 and increments every time you find a matching element while looping.',
  ),

  ex(36, 'keys (No Built-in)', 2,
    ['data-structures', 'objects'],
    ['objects', 'loops', 'no-built-ins', 'intermediate'],
    'Return an array of all property names in an object — without Object.keys().',
    'Write a function called `keys` which accepts an object and returns an array of all its keys.\n\n**Do not use the built-in `Object.keys()` function.**\n\nExamples:\n  keys({ a: 1, b: 2, c: 3 })          → ["a","b","c"]\n  keys({ first: "Matt", last: "Lane" }) → ["first","last"]\n  keys({})                              → []',
    'function keys(obj) {\n  // Do not use Object.keys()\n\n}',
    'function keys(obj) {\n  const result = [];\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) result.push(key);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return keys;')(); const r1 = fn({a:1,b:2,c:3}); const r2 = fn({}); return [ { pass: r1.includes('a') && r1.includes('b') && r1.includes('c') && r1.length === 3, description: 'keys({a:1,b:2,c:3}) → ["a","b","c"]', got: JSON.stringify(r1) }, { pass: JSON.stringify(r2) === '[]', description: 'keys({}) → []', got: JSON.stringify(r2) }, { pass: fn({x:10}).includes('x'), description: 'single key object', got: JSON.stringify(fn({x:10})) } ]; }`,
    'The for...in loop iterates over the enumerable property names of an object. You can collect them by pushing each key into an array.',
  ),

  ex(37, 'values (No Built-in)', 2,
    ['data-structures', 'objects'],
    ['objects', 'loops', 'no-built-ins', 'intermediate'],
    'Return an array of all property values in an object — without Object.values().',
    'Write a function called `values` which accepts an object and returns an array of all its values.\n\n**Do not use the built-in `Object.values()` function.**\n\nExamples:\n  values({ a: 1, b: 2, c: 3 })                         → [1,2,3]\n  values({ first: "Matt", last: "Lane", isDogOwner: true }) → ["Matt","Lane",true]\n  values({})                                             → []',
    'function values(obj) {\n  // Do not use Object.values()\n\n}',
    'function values(obj) {\n  const result = [];\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) result.push(obj[key]);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return values;')(); const r1 = fn({a:1,b:2,c:3}); const r2 = fn({}); return [ { pass: r1.includes(1) && r1.includes(2) && r1.includes(3) && r1.length === 3, description: 'values({a:1,b:2,c:3}) → [1,2,3]', got: JSON.stringify(r1) }, { pass: JSON.stringify(r2) === '[]', description: 'values({}) → []', got: JSON.stringify(r2) }, { pass: fn({isDogOwner:true})[0] === true, description: 'boolean value preserved', got: JSON.stringify(fn({isDogOwner:true})) } ]; }`,
    'Similar to keys, but instead of collecting the property name, collect the property value using bracket notation: obj[key].',
  ),

  ex(38, 'squareEvenNumbers', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'modulo', 'intermediate'],
    'Sum the squares of all even numbers in an array.',
    'Write a function called `squareEvenNumbers` which accepts an array of numbers and returns the sum of all even numbers squared.\n\nExamples:\n  squareEvenNumbers([1,2,3,4,5]) → 20\n  squareEvenNumbers([1,3,5,7])   → 0\n  squareEvenNumbers([5,6,7])     → 36',
    'function squareEvenNumbers(arr) {\n  // Your code here\n\n}',
    'function squareEvenNumbers(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] % 2 === 0) sum += arr[i] * arr[i];\n  }\n  return sum;\n}',
    `(code) => { const fn = new Function(code + '; return squareEvenNumbers;')(); return [ { pass: fn([1,2,3,4,5]) === 20, description: 'squareEvenNumbers([1,2,3,4,5]) → 20', got: fn([1,2,3,4,5]) }, { pass: fn([1,3,5,7]) === 0, description: 'no evens → 0', got: fn([1,3,5,7]) }, { pass: fn([5,6,7]) === 36, description: 'squareEvenNumbers([5,6,7]) → 36', got: fn([5,6,7]) }, { pass: fn([]) === 0, description: 'empty array → 0', got: fn([]) } ]; }`,
    'Combine two concepts: filtering for even numbers (modulo 2 equals 0) and accumulating a sum. For each even number, add its square to a running total.',
  ),

  ex(39, 'entries (No Built-in)', 3,
    ['data-structures', 'objects'],
    ['objects', 'arrays', 'loops', 'no-built-ins', 'intermediate'],
    'Return key-value pairs as an array of arrays — without Object.entries().',
    'Write a function called `entries` which accepts an object and returns an array of [key, value] pairs.\n\n**Do not use the built-in `Object.entries()` function.**\n\nExamples:\n  entries({ a: 1, b: 2, c: 3 })\n  → [["a",1],["b",2],["c",3]]\n\n  entries({})\n  → []',
    'function entries(obj) {\n  // Do not use Object.entries()\n\n}',
    'function entries(obj) {\n  const result = [];\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) result.push([key, obj[key]]);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return entries;')(); const r1 = fn({a:1,b:2,c:3}); const r2 = fn({}); const hasPair = (arr, k, v) => arr.some(pair => pair[0] === k && pair[1] === v); return [ { pass: hasPair(r1,'a',1) && hasPair(r1,'b',2) && hasPair(r1,'c',3) && r1.length === 3, description: 'entries({a:1,b:2,c:3}) → [["a",1],["b",2],["c",3]]', got: JSON.stringify(r1) }, { pass: JSON.stringify(r2) === '[]', description: 'entries({}) → []', got: JSON.stringify(r2) }, { pass: r1.every(p => Array.isArray(p) && p.length === 2), description: 'each entry is a 2-element array', got: 'checked structure' } ]; }`,
    'You need to produce pairs of [key, value]. Use a for...in loop: for each property, push a new two-element array containing the key and its corresponding value.',
  ),

  ex(40, 'multiples', 2,
    ['js-fundamentals', 'loops'],
    ['loops', 'arrays', 'math', 'beginner'],
    'Return the first n multiples of a number.',
    'Write a function called `multiples` that accepts two numbers `x` and `n`.\n\nReturn an array of the first `n` multiples of `x`.\n\nExamples:\n  multiples(3, 4) → [3,6,9,12]\n  multiples(2, 5) → [2,4,6,8,10]',
    'function multiples(x, n) {\n  // Your code here\n\n}',
    'function multiples(x, n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    result.push(x * i);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return multiples;')(); return [ { pass: JSON.stringify(fn(3,4)) === '[3,6,9,12]', description: 'multiples(3,4) → [3,6,9,12]', got: JSON.stringify(fn(3,4)) }, { pass: JSON.stringify(fn(2,5)) === '[2,4,6,8,10]', description: 'multiples(2,5) → [2,4,6,8,10]', got: JSON.stringify(fn(2,5)) }, { pass: JSON.stringify(fn(5,1)) === '[5]', description: 'multiples(5,1) → [5]', got: JSON.stringify(fn(5,1)) }, { pass: JSON.stringify(fn(10,3)) === '[10,20,30]', description: 'multiples(10,3) → [10,20,30]', got: JSON.stringify(fn(10,3)) } ]; }`,
    'The first multiple of x is x * 1, the second is x * 2, and so on. Loop from 1 to n, computing x * i each time and collecting the results.',
  ),

  ex(41, 'pluck', 3,
    ['data-structures', 'arrays', 'map'],
    ['arrays', 'objects', 'map', 'intermediate'],
    'Extract a specific property from each object in an array.',
    'Write a function called `pluck` which accepts an array of objects and a key name.\n\nReturn an array of the values for that key in each object (or `undefined` if the key is absent).\n\nExamples:\n  pluck([{name:"Tim"},{name:"Matt"},{name:"Elie"}], "name")\n  → ["Tim","Matt","Elie"]\n\n  pluck([{name:"Tim",isBoatOwner:true},{name:"Matt",isBoatOwner:false},{name:"Elie"}], "isBoatOwner")\n  → [true,false,undefined]',
    'function pluck(arr, key) {\n  // Your code here\n\n}',
    'function pluck(arr, key) {\n  return arr.map(obj => obj[key]);\n}',
    `(code) => { const fn = new Function(code + '; return pluck;')(); const r1 = fn([{name:'Tim'},{name:'Matt'},{name:'Elie'}],'name'); const r2 = fn([{name:'Tim',isBoatOwner:true},{name:'Matt',isBoatOwner:false},{name:'Elie'}],'isBoatOwner'); return [ { pass: JSON.stringify(r1) === '["Tim","Matt","Elie"]', description: 'pluck names → ["Tim","Matt","Elie"]', got: JSON.stringify(r1) }, { pass: r2[0] === true && r2[1] === false && r2[2] === undefined, description: 'pluck isBoatOwner → [true,false,undefined]', got: JSON.stringify(r2) }, { pass: JSON.stringify(fn([],'name')) === '[]', description: 'empty array → []', got: JSON.stringify(fn([],'name')) } ]; }`,
    'This is a classic use case for .map(). Transform each object in the array into just the value at the specified key. Bracket notation (obj[key]) lets you access a property dynamically.',
  ),

  ex(42, 'twoHighest', 4,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'comparison', 'no-built-ins', 'intermediate'],
    'Find the two highest numbers in an array — without Array.sort().',
    'Write a function called `twoHighest` that accepts an array of numbers and returns the two highest values as `[secondHighest, highest]`.\n\n**Do not use the built-in `Array.prototype.sort()` method.**\n\nExamples:\n  twoHighest([1,2,10,8])         → [8,10]\n  twoHighest([6,1,9,10,4])       → [9,10]\n  twoHighest([4,25,3,20,19,5])   → [20,25]\n  twoHighest([1,2,2])            → [2,2]',
    'function twoHighest(arr) {\n  // Do not use arr.sort()\n  // Return [secondHighest, highest]\n\n}',
    `function twoHighest(arr) {
  let highest = -Infinity;
  let second = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= highest) {
      second = highest;
      highest = arr[i];
    } else if (arr[i] > second) {
      second = arr[i];
    }
  }
  return [second, highest];
}`,
    `(code) => { const fn = new Function(code + '; return twoHighest;')(); return [ { pass: JSON.stringify(fn([1,2,10,8])) === '[8,10]', description: 'twoHighest([1,2,10,8]) → [8,10]', got: JSON.stringify(fn([1,2,10,8])) }, { pass: JSON.stringify(fn([6,1,9,10,4])) === '[9,10]', description: 'twoHighest([6,1,9,10,4]) → [9,10]', got: JSON.stringify(fn([6,1,9,10,4])) }, { pass: JSON.stringify(fn([4,25,3,20,19,5])) === '[20,25]', description: 'twoHighest([4,25,3,20,19,5]) → [20,25]', got: JSON.stringify(fn([4,25,3,20,19,5])) }, { pass: JSON.stringify(fn([1,2,2])) === '[2,2]', description: 'twoHighest([1,2,2]) → [2,2] (duplicates)', got: JSON.stringify(fn([1,2,2])) } ]; }`,
    'Track two variables simultaneously: the highest value seen so far, and the second highest. When a new number beats the current highest, the old highest becomes the new second. When it only beats the second, update just that.',
  ),

  ex(43, 'minMaxKeyInObject', 3,
    ['data-structures', 'objects'],
    ['objects', 'loops', 'comparison', 'intermediate'],
    'Find the minimum and maximum numeric keys in an object.',
    'Write a function called `minMaxKeyInObject` that accepts an object with numeric keys.\n\nReturn `[lowestKey, highestKey]`.\n\nExamples:\n  minMaxKeyInObject({ 2:"a", 7:"b", 1:"c", 10:"d", 4:"e" })\n  → [1,10]\n\n  minMaxKeyInObject({ 1:"Elie", 4:"Matt", 2:"Tim" })\n  → [1,4]',
    'function minMaxKeyInObject(obj) {\n  // Your code here\n\n}',
    `function minMaxKeyInObject(obj) {
  const numKeys = Object.keys(obj).map(Number);
  let min = numKeys[0];
  let max = numKeys[0];
  for (let i = 1; i < numKeys.length; i++) {
    if (numKeys[i] < min) min = numKeys[i];
    if (numKeys[i] > max) max = numKeys[i];
  }
  return [min, max];
}`,
    `(code) => { const fn = new Function(code + '; return minMaxKeyInObject;')(); return [ { pass: JSON.stringify(fn({2:'a',7:'b',1:'c',10:'d',4:'e'})) === '[1,10]', description: 'minMaxKeyInObject({2,7,1,10,4}) → [1,10]', got: JSON.stringify(fn({2:'a',7:'b',1:'c',10:'d',4:'e'})) }, { pass: JSON.stringify(fn({1:'Elie',4:'Matt',2:'Tim'})) === '[1,4]', description: 'minMaxKeyInObject({1,4,2}) → [1,4]', got: JSON.stringify(fn({1:'Elie',4:'Matt',2:'Tim'})) }, { pass: JSON.stringify(fn({5:'only'})) === '[5,5]', description: 'single key → [5,5]', got: JSON.stringify(fn({5:'only'})) } ]; }`,
    'Object keys are always strings, even when they look like numbers. Get the keys, convert them to numbers, then find both the minimum and maximum in a single pass.',
  ),

  ex(44, 'stringFromObject', 3,
    ['data-structures', 'objects'],
    ['objects', 'strings', 'loops', 'intermediate'],
    'Build a "key = value" string from an object\'s entries.',
    'Write a function called `stringFromObject` that generates a string from an object\'s key-value pairs in the format `"key = value, key = value"`.\n\nPairs are separated by ", " except the last one.\n\nExamples:\n  stringFromObject({ a: 1, b: "2" })\n  → "a = 1, b = 2"\n\n  stringFromObject({ name: "Elie", job: "Instructor", isCatOwner: false })\n  → "name = Elie, job = Instructor, isCatOwner = false"\n\n  stringFromObject({})\n  → ""',
    'function stringFromObject(obj) {\n  // Your code here\n\n}',
    `function stringFromObject(obj) {
  return Object.entries(obj)
    .map(([k, v]) => k + ' = ' + v)
    .join(', ');
}`,
    `(code) => { const fn = new Function(code + '; return stringFromObject;')(); return [ { pass: fn({a:1,b:'2'}) === 'a = 1, b = 2', description: 'stringFromObject({a:1,b:"2"}) → "a = 1, b = 2"', got: fn({a:1,b:'2'}) }, { pass: fn({name:'Elie',job:'Instructor',isCatOwner:false}) === 'name = Elie, job = Instructor, isCatOwner = false', description: 'multi-property object', got: fn({name:'Elie',job:'Instructor',isCatOwner:false}) }, { pass: fn({}) === '', description: 'empty object → ""', got: fn({}) } ]; }`,
    'Build an array of "key = value" strings, one per pair, then join them with ", ". The tricky part is that you need no separator after the last pair — which join() handles automatically.',
  ),

  ex(45, 'countNumbers', 2,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'strings', 'type-conversion', 'beginner'],
    'Count how many strings in an array can be converted to a valid number.',
    'Write a function called `countNumbers` which accepts an array of strings and returns a count of how many can be successfully converted to a number.\n\nExamples:\n  countNumbers(["a","b","3","awesome","4"])     → 2\n  countNumbers(["32","55","awesome","test","100"]) → 3\n  countNumbers(["4","1","0","NaN"])               → 3\n  countNumbers(["7","12","a","","6","8"," "])     → 4',
    'function countNumbers(arr) {\n  // Your code here\n\n}',
    `function countNumbers(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== '' && arr[i].trim() !== '' && !isNaN(Number(arr[i]))) count++;
  }
  return count;
}`,
    `(code) => { const fn = new Function(code + '; return countNumbers;')(); return [ { pass: fn(['a','b','3','awesome','4']) === 2, description: 'countNumbers(["a","b","3","awesome","4"]) → 2', got: fn(['a','b','3','awesome','4']) }, { pass: fn(['32','55','awesome','test','100']) === 3, description: 'countNumbers(["32","55","awesome","test","100"]) → 3', got: fn(['32','55','awesome','test','100']) }, { pass: fn(['4','1','0','NaN']) === 3, description: '"NaN" does not count as a number', got: fn(['4','1','0','NaN']) }, { pass: fn(['7','12','a','','6','8',' ']) === 4, description: 'empty string and whitespace do not count', got: fn(['7','12','a','','6','8',' ']) } ]; }`,
    'Number() converts a string to a number, and isNaN() tells you if the result is "Not a Number". Watch out for edge cases: empty strings and whitespace-only strings convert to 0, which is a valid number in one sense, but the problem excludes them.',
  ),

  ex(46, 'removeVowels', 2,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'filtering', 'beginner'],
    'Return a string with all vowels removed.',
    'Write a function called `removeVowels` which accepts a string and returns a new string with all vowels (a, e, i, o, u) removed. "y" is not a vowel.\n\nExamples:\n  removeVowels("Hello!")                         → "Hll!"\n  removeVowels("Tomatoes")                        → "Tmts"\n  removeVowels("aeiou")                           → ""\n  removeVowels("why try, shy fly?")               → "why try, shy fly?"',
    'function removeVowels(str) {\n  // Your code here\n\n}',
    `function removeVowels(str) {
  const vowels = 'aeiouAEIOU';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (!vowels.includes(str[i])) result += str[i];
  }
  return result;
}`,
    `(code) => { const fn = new Function(code + '; return removeVowels;')(); return [ { pass: fn('Hello!') === 'Hll!', description: 'removeVowels("Hello!") → "Hll!"', got: fn('Hello!') }, { pass: fn('Tomatoes') === 'Tmts', description: 'removeVowels("Tomatoes") → "Tmts"', got: fn('Tomatoes') }, { pass: fn('aeiou') === '', description: 'all vowels → ""', got: fn('aeiou') }, { pass: fn('why try, shy fly?') === 'why try, shy fly?', description: 'no vowels → unchanged', got: fn('why try, shy fly?') }, { pass: fn('Reverse Vowels In The String') === 'Rvrs Vwls n Th Strng', description: 'mixed case vowel removal', got: fn('Reverse Vowels In The String') } ]; }`,
    'Build a result by including only non-vowel characters. You need to handle both uppercase and lowercase vowels. One approach: define a string of all vowels and check if each character is in it.',
  ),

  ex(47, 'findTheDuplicate', 3,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'objects', 'frequency-counter', 'intermediate'],
    'Find the single duplicate number in an array.',
    'Write a function called `findTheDuplicate` which accepts an array of numbers containing exactly one duplicate. Return the duplicate number, or `undefined` if none exists.\n\nExamples:\n  findTheDuplicate([1,2,1,4,3,12]) → 1\n  findTheDuplicate([6,1,9,5,3,4,9]) → 9\n  findTheDuplicate([2,1,3,4])       → undefined',
    'function findTheDuplicate(arr) {\n  // Your code here\n\n}',
    `function findTheDuplicate(arr) {
  const seen = {};
  for (let i = 0; i < arr.length; i++) {
    if (seen[arr[i]]) return arr[i];
    seen[arr[i]] = true;
  }
  return undefined;
}`,
    `(code) => { const fn = new Function(code + '; return findTheDuplicate;')(); return [ { pass: fn([1,2,1,4,3,12]) === 1, description: 'findTheDuplicate([1,2,1,4,3,12]) → 1', got: fn([1,2,1,4,3,12]) }, { pass: fn([6,1,9,5,3,4,9]) === 9, description: 'findTheDuplicate([6,1,9,5,3,4,9]) → 9', got: fn([6,1,9,5,3,4,9]) }, { pass: fn([2,1,3,4]) === undefined, description: 'no duplicate → undefined', got: fn([2,1,3,4]) } ]; }`,
    'Track which numbers you have already seen using an object as a lookup table. The first time you see a number, record it. The second time you see it, you found your duplicate.',
  ),

  ex(48, 'totalCaps', 3,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'strings', 'loops', 'intermediate'],
    'Count the total number of uppercase letters across an array of strings.',
    'Write a function called `totalCaps` which accepts an array of strings and returns the total number of uppercase letters across all strings. Do not convert the array into a single string first.\n\nExamples:\n  totalCaps(["AwesomE","ThIngs","hAppEning","HerE"]) → 8\n  totalCaps(["Elie","Matt","Tim"])                    → 3\n  totalCaps(["hello","world"])                         → 0',
    'function totalCaps(arr) {\n  // Count uppercase letters across all strings\n\n}',
    `function totalCaps(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] >= 'A' && arr[i][j] <= 'Z') count++;
    }
  }
  return count;
}`,
    `(code) => { const fn = new Function(code + '; return totalCaps;')(); return [ { pass: fn(['AwesomE','ThIngs','hAppEning','HerE']) === 8, description: 'totalCaps(["AwesomE","ThIngs","hAppEning","HerE"]) → 8', got: fn(['AwesomE','ThIngs','hAppEning','HerE']) }, { pass: fn(['Elie','Matt','Tim']) === 3, description: 'totalCaps(["Elie","Matt","Tim"]) → 3', got: fn(['Elie','Matt','Tim']) }, { pass: fn(['hello','world']) === 0, description: 'all lowercase → 0', got: fn(['hello','world']) }, { pass: fn([]) === 0, description: 'empty array → 0', got: fn([]) } ]; }`,
    'This is a nested loop problem: for each string in the array, check each character in that string. A character is uppercase if it falls between "A" and "Z" — you can compare characters directly with < and > in JavaScript.',
  ),

];

// Append exercises
data.exercises.push(...rithmExercises);

// Write back
fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✓ Added ${rithmExercises.length} Rithm exercises (IDs 21–48)`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
