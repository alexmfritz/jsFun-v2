#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function js(title, category, tags, description, instructions, starterCode, solution, testRunner, hint) {
  return { id: nextId++, title, type: 'js', tier: 2, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources: [] };
}
function html(title, category, tags, description, instructions, starterCode, solution, testCases, hint) {
  return { id: nextId++, title, type: 'html', tier: 2, category, tags, description, instructions, starterCode, solution, testRunner: '', testCases, hint, resources: [] };
}
function css(title, category, tags, description, instructions, starterCode, solution, providedHtml, testCases, hint) {
  return { id: nextId++, title, type: 'css', tier: 2, category, tags, description, instructions, starterCode, solution, testRunner: '', providedHtml, testCases, hint, resources: [] };
}

const exercises = [

  // ── IMPLEMENT NATIVE METHODS FROM SCRATCH ────────────────────────────────────

  js('Implement myForEach',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.forEach from scratch.',
    `Write a function called \`myForEach\` that accepts an array and a callback, and calls the callback once per element passing (element, index). It should not return anything.

Examples:
  const result = [];
  myForEach([1, 2, 3], (el, i) => result.push(el * i));
  result → [0, 2, 6]  (1×0, 2×1, 3×2)`,
    `function myForEach(arr, callback) {\n\n}`,
    `function myForEach(arr, callback) {\n  for (let i = 0; i < arr.length; i++) {\n    callback(arr[i], i);\n  }\n}`,
    `(code) => { const fn = new Function(code + '; return myForEach;')(); const r1 = []; fn([1,2,3], el => r1.push(el * 2)); const r2 = []; fn([10,20,30], (el,i) => r2.push(i)); return [ { pass: JSON.stringify(r1)==='[2,4,6]', description: 'doubles each element via callback', got: JSON.stringify(r1) }, { pass: JSON.stringify(r2)==='[0,1,2]', description: 'passes index as second argument', got: JSON.stringify(r2) }, { pass: fn([],(el)=>null)===undefined, description: 'returns undefined', got: fn([],(el)=>null) } ]; }`,
    'A loop that calls callback(arr[i], i) on each iteration is all forEach does. It never collects return values — just calls the function.'
  ),

  js('Implement myMap',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.map from scratch.',
    `Write a function called \`myMap\` that accepts an array and a callback, and returns a NEW array where each element is the result of calling the callback on the original element.

Examples:
  myMap([1,2,3], n => n * 2)           → [2, 4, 6]
  myMap(["a","b"], s => s.toUpperCase()) → ["A","B"]`,
    `function myMap(arr, callback) {\n\n}`,
    `function myMap(arr, callback) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    result.push(callback(arr[i], i));\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return myMap;')(); return [ { pass: JSON.stringify(fn([1,2,3],n=>n*2))==='[2,4,6]', description: 'myMap([1,2,3], double) → [2,4,6]', got: JSON.stringify(fn([1,2,3],n=>n*2)) }, { pass: JSON.stringify(fn(["a","b"],s=>s.toUpperCase()))==='["A","B"]', description: 'uppercase each string', got: JSON.stringify(fn(["a","b"],s=>s.toUpperCase())) }, { pass: JSON.stringify(fn([],n=>n))==='[]', description: 'empty → []', got: JSON.stringify(fn([],n=>n)) } ]; }`,
    'Unlike forEach, collect each callback return value into a result array, then return that array at the end.'
  ),

  js('Implement myFilter',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.filter from scratch.',
    `Write a function called \`myFilter\` that accepts an array and a callback (predicate), and returns a new array containing only the elements for which the callback returns truthy.

Examples:
  myFilter([1,2,3,4,5], n => n % 2 === 0)   → [2, 4]
  myFilter(["hi","hello","hey"], s => s.length > 2) → ["hello","hey"]`,
    `function myFilter(arr, callback) {\n\n}`,
    `function myFilter(arr, callback) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (callback(arr[i], i)) result.push(arr[i]);\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return myFilter;')(); return [ { pass: JSON.stringify(fn([1,2,3,4,5],n=>n%2===0))==='[2,4]', description: 'myFilter(evens) → [2,4]', got: JSON.stringify(fn([1,2,3,4,5],n=>n%2===0)) }, { pass: JSON.stringify(fn(["hi","hello","hey"],s=>s.length>2))==='["hello","hey"]', description: 'filter by string length', got: JSON.stringify(fn(["hi","hello","hey"],s=>s.length>2)) }, { pass: JSON.stringify(fn([],n=>n))==='[]', description: 'empty → []', got: JSON.stringify(fn([],n=>n)) } ]; }`,
    'Like myMap, but only push if the callback returns truthy. The callback acts as a gate.'
  ),

  js('Implement myFind',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.find from scratch.',
    `Write a function called \`myFind\` that accepts an array and a callback, and returns the FIRST element for which the callback returns truthy. Return \`undefined\` if nothing matches.

Examples:
  myFind([1,3,4,6], n => n % 2 === 0)  → 4
  myFind([1,3,5], n => n % 2 === 0)    → undefined`,
    `function myFind(arr, callback) {\n\n}`,
    `function myFind(arr, callback) {\n  for (let i = 0; i < arr.length; i++) {\n    if (callback(arr[i], i)) return arr[i];\n  }\n  return undefined;\n}`,
    `(code) => { const fn = new Function(code + '; return myFind;')(); return [ { pass: fn([1,3,4,6],n=>n%2===0)===4, description: 'myFind first even → 4', got: fn([1,3,4,6],n=>n%2===0) }, { pass: fn([1,3,5],n=>n%2===0)===undefined, description: 'no match → undefined', got: fn([1,3,5],n=>n%2===0) }, { pass: fn([5,10,15],n=>n>8)===10, description: 'returns first match only', got: fn([5,10,15],n=>n>8) } ]; }`,
    'The moment the callback returns truthy, return that element immediately. If the loop ends with no match, return undefined.'
  ),

  js('Implement myEvery',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.every from scratch.',
    `Write a function called \`myEvery\` that accepts an array and a callback, and returns \`true\` if the callback returns truthy for EVERY element. Returns true for an empty array.

Examples:
  myEvery([2,4,6], n => n % 2 === 0) → true
  myEvery([2,3,6], n => n % 2 === 0) → false`,
    `function myEvery(arr, callback) {\n\n}`,
    `function myEvery(arr, callback) {\n  for (let i = 0; i < arr.length; i++) {\n    if (!callback(arr[i], i)) return false;\n  }\n  return true;\n}`,
    `(code) => { const fn = new Function(code + '; return myEvery;')(); return [ { pass: fn([2,4,6],n=>n%2===0)===true, description: 'all even → true', got: fn([2,4,6],n=>n%2===0) }, { pass: fn([2,3,6],n=>n%2===0)===false, description: 'one odd → false', got: fn([2,3,6],n=>n%2===0) }, { pass: fn([],n=>false)===true, description: 'empty → true', got: fn([],n=>false) } ]; }`,
    'As soon as one element fails (callback returns falsy), return false immediately. If the loop completes without failing, return true.'
  ),

  js('Implement mySome',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins'],
    'Build your own version of Array.some from scratch.',
    `Write a function called \`mySome\` that accepts an array and a callback, and returns \`true\` if the callback returns truthy for AT LEAST ONE element. Returns false for an empty array.

Examples:
  mySome([1,3,4], n => n % 2 === 0) → true   (4 is even)
  mySome([1,3,5], n => n % 2 === 0) → false`,
    `function mySome(arr, callback) {\n\n}`,
    `function mySome(arr, callback) {\n  for (let i = 0; i < arr.length; i++) {\n    if (callback(arr[i], i)) return true;\n  }\n  return false;\n}`,
    `(code) => { const fn = new Function(code + '; return mySome;')(); return [ { pass: fn([1,3,4],n=>n%2===0)===true, description: '4 is even → true', got: fn([1,3,4],n=>n%2===0) }, { pass: fn([1,3,5],n=>n%2===0)===false, description: 'no evens → false', got: fn([1,3,5],n=>n%2===0) }, { pass: fn([],n=>true)===false, description: 'empty → false', got: fn([],n=>true) } ]; }`,
    'The mirror of myEvery — the moment the callback returns truthy, return true immediately. If the loop ends with no match, return false.'
  ),

  js('Implement myReduce',
    ['syntax-translation','refactoring'],
    ['higher-order','callbacks','no-built-ins','reduce'],
    'Build your own version of Array.reduce from scratch.',
    `Write a function called \`myReduce\` that accepts an array, a callback, and an initial value, and reduces the array to a single value by applying the callback to an accumulator and each element.

The callback receives (accumulator, currentValue, index).

Examples:
  myReduce([1,2,3,4], (acc, n) => acc + n, 0) → 10
  myReduce(["a","b","c"], (acc, s) => acc + s, "") → "abc"`,
    `function myReduce(arr, callback, initialValue) {\n\n}`,
    `function myReduce(arr, callback, initialValue) {\n  let acc = initialValue;\n  for (let i = 0; i < arr.length; i++) {\n    acc = callback(acc, arr[i], i);\n  }\n  return acc;\n}`,
    `(code) => { const fn = new Function(code + '; return myReduce;')(); return [ { pass: fn([1,2,3,4],(acc,n)=>acc+n,0)===10, description: 'myReduce sum → 10', got: fn([1,2,3,4],(acc,n)=>acc+n,0) }, { pass: fn(["a","b","c"],(acc,s)=>acc+s,"")==="abc", description: 'myReduce concat → "abc"', got: fn(["a","b","c"],(acc,s)=>acc+s,"") }, { pass: fn([],()=>0,42)===42, description: 'empty array → initialValue', got: fn([],()=>0,42) } ]; }`,
    'Start with acc = initialValue. On each iteration call callback(acc, arr[i], i) and reassign acc to the return value. Return acc after the loop.'
  ),

  // ── STRINGS — INTERMEDIATE ───────────────────────────────────────────────────

  js('Reverse a String',
    ['data-structures','strings'],
    ['strings','arrays'],
    'Return a string with its characters in reverse order.',
    `Write a function called \`reverseString\` that accepts a string and returns it reversed.

Examples:
  reverseString("hello")   → "olleh"
  reverseString("abcde")   → "edcba"
  reverseString("racecar") → "racecar"`,
    `function reverseString(str) {\n\n}`,
    `function reverseString(str) {\n  return str.split("").reverse().join("");\n}`,
    `(code) => { const fn = new Function(code + '; return reverseString;')(); return [ { pass: fn("hello")==="olleh", description: '"hello" → "olleh"', got: fn("hello") }, { pass: fn("abcde")==="edcba", description: '"abcde" → "edcba"', got: fn("abcde") }, { pass: fn("racecar")==="racecar", description: 'palindrome → itself', got: fn("racecar") }, { pass: fn("")==="", description: 'empty → ""', got: fn("") } ]; }`,
    "Strings don't have .reverse(), but arrays do. Split into characters, reverse the array, join back into a string."
  ),

  js('Count Vowels',
    ['data-structures','strings'],
    ['strings','loops','counting'],
    'Count the number of vowels in a string.',
    `Write a function called \`countVowels\` that accepts a string and returns the number of vowels (a, e, i, o, u — case-insensitive).

Examples:
  countVowels("hello")      → 2
  countVowels("JavaScript") → 3
  countVowels("rhythm")     → 0`,
    `function countVowels(str) {\n\n}`,
    `function countVowels(str) {\n  const vowels = "aeiouAEIOU";\n  let count = 0;\n  for (let i = 0; i < str.length; i++) {\n    if (vowels.includes(str[i])) count++;\n  }\n  return count;\n}`,
    `(code) => { const fn = new Function(code + '; return countVowels;')(); return [ { pass: fn("hello")===2, description: 'countVowels("hello") → 2', got: fn("hello") }, { pass: fn("JavaScript")===3, description: 'countVowels("JavaScript") → 3', got: fn("JavaScript") }, { pass: fn("rhythm")===0, description: 'no vowels → 0', got: fn("rhythm") }, { pass: fn("AEIOU")===5, description: 'uppercase vowels count too', got: fn("AEIOU") } ]; }`,
    'Define a vowel string with both cases. Loop through each character and check if it is in that string using .includes().'
  ),

  js('Truncate String',
    ['data-structures','strings'],
    ['strings','methods'],
    'Shorten a string to a max length, appending "..." if truncated.',
    `Write a function called \`truncate\` that accepts a string and a max length. If the string is longer than maxLength, return the first maxLength characters followed by "...". Otherwise return the original string unchanged.

Examples:
  truncate("Hello, World!", 5) → "Hello..."
  truncate("Hi", 10)            → "Hi"
  truncate("exact", 5)          → "exact"`,
    `function truncate(str, maxLength) {\n\n}`,
    `function truncate(str, maxLength) {\n  if (str.length > maxLength) return str.slice(0, maxLength) + "...";\n  return str;\n}`,
    `(code) => { const fn = new Function(code + '; return truncate;')(); return [ { pass: fn("Hello, World!",5)==="Hello...", description: 'truncated + "..."', got: fn("Hello, World!",5) }, { pass: fn("Hi",10)==="Hi", description: 'short string → unchanged', got: fn("Hi",10) }, { pass: fn("exact",5)==="exact", description: 'exactly at limit → no truncation', got: fn("exact",5) } ]; }`,
    'Check if str.length > maxLength. If so, use .slice(0, maxLength) and concatenate "...". Otherwise return as-is.'
  ),

  js('camelCase to snake_case',
    ['data-structures','strings'],
    ['strings','methods'],
    'Convert a camelCase string to snake_case.',
    `Write a function called \`toSnakeCase\` that accepts a camelCase string and returns it in snake_case.

Examples:
  toSnakeCase("helloWorld")     → "hello_world"
  toSnakeCase("myVariableName") → "my_variable_name"
  toSnakeCase("already")         → "already"`,
    `function toSnakeCase(str) {\n\n}`,
    `function toSnakeCase(str) {\n  let result = "";\n  for (let i = 0; i < str.length; i++) {\n    const char = str[i];\n    if (char === char.toUpperCase() && char !== char.toLowerCase()) {\n      result += "_" + char.toLowerCase();\n    } else {\n      result += char;\n    }\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return toSnakeCase;')(); return [ { pass: fn("helloWorld")==="hello_world", description: '"helloWorld" → "hello_world"', got: fn("helloWorld") }, { pass: fn("myVariableName")==="my_variable_name", description: 'multiple capitals', got: fn("myVariableName") }, { pass: fn("already")==="already", description: 'no capitals → unchanged', got: fn("already") } ]; }`,
    'A character is uppercase if char === char.toUpperCase() but char !== char.toLowerCase() (non-letter chars like "1" return themselves for both). When you find one, insert an underscore before its lowercase version.'
  ),

  js('Word Count',
    ['data-structures','strings'],
    ['strings','objects'],
    'Count how many times each word appears in a sentence.',
    `Write a function called \`wordCount\` that accepts a sentence string and returns an object where keys are words (lowercased) and values are their counts.

Examples:
  wordCount("the cat sat on the mat")
  → { the: 2, cat: 1, sat: 1, on: 1, mat: 1 }`,
    `function wordCount(str) {\n\n}`,
    `function wordCount(str) {\n  const words = str.split(" ");\n  const counts = {};\n  for (let i = 0; i < words.length; i++) {\n    const word = words[i].toLowerCase();\n    counts[word] = (counts[word] || 0) + 1;\n  }\n  return counts;\n}`,
    `(code) => { const fn = new Function(code + '; return wordCount;')(); const r = fn("the cat sat on the mat"); return [ { pass: r.the===2, description: '"the" appears twice', got: r.the }, { pass: r.cat===1&&r.sat===1&&r.on===1&&r.mat===1, description: 'other words appear once', got: JSON.stringify(r) }, { pass: fn("hi hi hi").hi===3, description: 'hi×3 → 3', got: fn("hi hi hi").hi } ]; }`,
    'Split on spaces to get words. Build a frequency object: for each word, increment its count or initialize to 1 using (counts[word] || 0) + 1.'
  ),

  js('snake_case to camelCase',
    ['data-structures','strings'],
    ['strings','methods','syntax-translation'],
    'Convert a snake_case string to camelCase.',
    `Write a function called \`toCamelCase\` that accepts a snake_case string and returns it converted to camelCase.

Examples:
  toCamelCase("hello_world")      → "helloWorld"
  toCamelCase("my_variable_name") → "myVariableName"
  toCamelCase("already")           → "already"`,
    `function toCamelCase(str) {\n\n}`,
    `function toCamelCase(str) {\n  const parts = str.split("_");\n  return parts[0] + parts.slice(1).map(p => p[0].toUpperCase() + p.slice(1)).join("");\n}`,
    `(code) => { const fn = new Function(code + '; return toCamelCase;')(); return [ { pass: fn("hello_world")==="helloWorld", description: '"hello_world" → "helloWorld"', got: fn("hello_world") }, { pass: fn("my_variable_name")==="myVariableName", description: 'three parts', got: fn("my_variable_name") }, { pass: fn("already")==="already", description: 'no underscores → unchanged', got: fn("already") } ]; }`,
    'Split on "_". The first part stays lowercase. For every other part, capitalize its first character and join the rest. Then concatenate all parts together.'
  ),

  // ── OBJECTS — INTERMEDIATE ───────────────────────────────────────────────────

  js('Merge Two Objects',
    ['data-structures','objects'],
    ['objects','spread'],
    'Combine two objects into one, second object wins on conflicts.',
    `Write a function called \`mergeObjects\` that accepts two objects and returns a new object with all properties from both. If both have the same key, the second object's value wins.

Examples:
  mergeObjects({a:1,b:2}, {b:3,c:4}) → {a:1,b:3,c:4}
  mergeObjects({x:10}, {})            → {x:10}`,
    `function mergeObjects(obj1, obj2) {\n\n}`,
    `function mergeObjects(obj1, obj2) {\n  return { ...obj1, ...obj2 };\n}`,
    `(code) => { const fn = new Function(code + '; return mergeObjects;')(); const r = fn({a:1,b:2},{b:3,c:4}); return [ { pass: r.a===1&&r.b===3&&r.c===4, description: '{a:1,b:2}+{b:3,c:4} → {a:1,b:3,c:4}', got: JSON.stringify(r) }, { pass: fn({x:10},{}).x===10, description: 'merge with empty', got: fn({x:10},{}).x }, { pass: fn({},{y:5}).y===5, description: 'merge empty with object', got: fn({},{y:5}).y } ]; }`,
    'Spread syntax in an object literal copies all properties. {...obj1, ...obj2} merges them — any key in both is overwritten by obj2.'
  ),

  js('Invert an Object',
    ['data-structures','objects'],
    ['objects','loops'],
    'Swap the keys and values of an object.',
    `Write a function called \`invertObject\` that accepts an object and returns a new object with keys and values swapped.

Examples:
  invertObject({a:1, b:2, c:3}) → {1:"a", 2:"b", 3:"c"}
  invertObject({hello:"world"})  → {world:"hello"}`,
    `function invertObject(obj) {\n\n}`,
    `function invertObject(obj) {\n  const result = {};\n  for (let key in obj) {\n    result[obj[key]] = key;\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return invertObject;')(); const r = fn({a:1,b:2,c:3}); return [ { pass: r[1]==="a"&&r[2]==="b"&&r[3]==="c", description: 'values become keys', got: JSON.stringify(r) }, { pass: fn({hello:"world"}).world==="hello", description: 'single pair swapped', got: fn({hello:"world"}).world } ]; }`,
    'Loop through with for...in. For each key-value pair: set result[value] = key — old value becomes new key, old key becomes new value.'
  ),

  js('Omit Keys from Object',
    ['data-structures','objects'],
    ['objects','filtering'],
    'Return a new object with specific keys excluded.',
    `Write a function called \`omit\` that accepts an object and an array of keys to remove, and returns a new object without those keys.

Examples:
  omit({a:1,b:2,c:3}, ["b"])      → {a:1,c:3}
  omit({x:1,y:2,z:3}, ["x","z"]) → {y:2}`,
    `function omit(obj, keysToRemove) {\n\n}`,
    `function omit(obj, keysToRemove) {\n  const result = {};\n  for (let key in obj) {\n    if (!keysToRemove.includes(key)) result[key] = obj[key];\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return omit;')(); return [ { pass: JSON.stringify(fn({a:1,b:2,c:3},["b"]))==='{"a":1,"c":3}', description: 'omit b → {a:1,c:3}', got: JSON.stringify(fn({a:1,b:2,c:3},["b"])) }, { pass: JSON.stringify(fn({x:1,y:2,z:3},["x","z"]))==='{"y":2}', description: 'omit x,z → {y:2}', got: JSON.stringify(fn({x:1,y:2,z:3},["x","z"])) }, { pass: JSON.stringify(fn({a:1},[]))==='{"a":1}', description: 'empty exclusion → unchanged', got: JSON.stringify(fn({a:1},[])) } ]; }`,
    'Loop over the object keys. Only copy a key to the result if it is NOT in the keysToRemove array. Use .includes() to check.'
  ),

  js('Pick Keys from Object',
    ['data-structures','objects'],
    ['objects','filtering'],
    'Return a new object with only specified keys.',
    `Write a function called \`pick\` that accepts an object and an array of keys to keep, and returns a new object with only those keys.

Examples:
  pick({a:1,b:2,c:3}, ["a","c"]) → {a:1,c:3}
  pick({x:1,y:2}, ["x"])          → {x:1}`,
    `function pick(obj, keysToPick) {\n\n}`,
    `function pick(obj, keysToPick) {\n  const result = {};\n  for (let i = 0; i < keysToPick.length; i++) {\n    if (keysToPick[i] in obj) result[keysToPick[i]] = obj[keysToPick[i]];\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return pick;')(); return [ { pass: JSON.stringify(fn({a:1,b:2,c:3},["a","c"]))==='{"a":1,"c":3}', description: 'pick a,c', got: JSON.stringify(fn({a:1,b:2,c:3},["a","c"])) }, { pass: JSON.stringify(fn({x:1,y:2},["x"]))==='{"x":1}', description: 'pick x only', got: JSON.stringify(fn({x:1,y:2},["x"])) }, { pass: JSON.stringify(fn({a:1},[]))==='{}', description: 'empty pick list → {}', got: JSON.stringify(fn({a:1},[])) } ]; }`,
    'Loop over the keysToPick array (not the object). For each desired key, check it exists in the object (use the in operator) and if so, copy it over.'
  ),

  js('Get Nested Property',
    ['data-structures','objects'],
    ['objects','nested'],
    'Safely access a deeply nested property via a dot-separated path string.',
    `Write a function called \`getNestedProp\` that accepts an object and a dot-separated path string, and returns the value at that path. Return \`undefined\` if any part of the path is missing.

Examples:
  getNestedProp({a:{b:{c:42}}}, "a.b.c") → 42
  getNestedProp({a:{b:1}}, "a.x.y")       → undefined
  getNestedProp({x:10}, "x")              → 10`,
    `function getNestedProp(obj, path) {\n\n}`,
    `function getNestedProp(obj, path) {\n  const keys = path.split(".");\n  let current = obj;\n  for (let i = 0; i < keys.length; i++) {\n    if (current == null) return undefined;\n    current = current[keys[i]];\n  }\n  return current;\n}`,
    `(code) => { const fn = new Function(code + '; return getNestedProp;')(); return [ { pass: fn({a:{b:{c:42}}},"a.b.c")===42, description: 'deep path → 42', got: fn({a:{b:{c:42}}},"a.b.c") }, { pass: fn({a:{b:1}},"a.x.y")===undefined, description: 'missing key → undefined', got: fn({a:{b:1}},"a.x.y") }, { pass: fn({x:10},"x")===10, description: 'shallow path → 10', got: fn({x:10},"x") } ]; }`,
    'Split the path on ".". Walk into the object one key at a time, checking at each step that the current value is not null or undefined before continuing.'
  ),

  // ── FUNCTIONS — CALLBACKS, CLOSURES, HIGHER-ORDER ────────────────────────────

  js('Apply to Each',
    ['functions','higher-order'],
    ['higher-order','callbacks','functions'],
    'Apply a callback to every element and return the results.',
    `Write a function called \`applyToEach\` that accepts an array and a callback, and returns a new array of the results of calling the callback on each element.

Examples:
  applyToEach([1,2,3], n => n + 10)      → [11,12,13]
  applyToEach(["hi","hey"], s => s + "!") → ["hi!","hey!"]`,
    `function applyToEach(arr, callback) {\n\n}`,
    `function applyToEach(arr, callback) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    result.push(callback(arr[i]));\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return applyToEach;')(); return [ { pass: JSON.stringify(fn([1,2,3],n=>n+10))==='[11,12,13]', description: 'adds 10 to each', got: JSON.stringify(fn([1,2,3],n=>n+10)) }, { pass: JSON.stringify(fn(["hi","hey"],s=>s+"!"))==='["hi!","hey!"]', description: 'appends "!" to each', got: JSON.stringify(fn(["hi","hey"],s=>s+"!")) } ]; }`,
    'A callback is just a function passed as an argument. Call it with callback(element) and collect each return value into your result array.'
  ),

  js('Make Counter',
    ['functions','scope'],
    ['closures','scope','functions'],
    'Return a function that returns incrementing integers each time it is called.',
    `Write a function called \`makeCounter\` that returns a new function. Each call to the returned function should return the next integer starting from 1.

Examples:
  const counter = makeCounter();
  counter() → 1
  counter() → 2
  counter() → 3

  const c2 = makeCounter();  // independent — starts over
  c2() → 1`,
    `function makeCounter() {\n\n}`,
    `function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}`,
    `(code) => { const fn = new Function(code + '; return makeCounter;')(); const c1 = fn(); const c2 = fn(); const r1 = c1(); const r2 = c1(); const r3 = c2(); return [ { pass: r1===1, description: 'first call → 1', got: r1 }, { pass: r2===2, description: 'second call → 2', got: r2 }, { pass: r3===1, description: 'new counter starts fresh → 1', got: r3 } ]; }`,
    'The key is closure: define count inside makeCounter, return a function that increments and returns it. Each call to makeCounter creates an independent count variable.'
  ),

  js('Once',
    ['functions','scope'],
    ['closures','scope','functions'],
    'Return a wrapper that calls the original function only once.',
    `Write a function called \`once\` that accepts a function and returns a new function. The new function calls the original only on the first invocation and caches the result. Subsequent calls return the cached result without calling the original again.

Examples:
  let count = 0;
  const addOnce = once(() => ++count);
  addOnce(); addOnce(); addOnce();
  count → 1  (original only ran once)`,
    `function once(fn) {\n\n}`,
    `function once(fn) {\n  let called = false;\n  let result;\n  return function() {\n    if (!called) {\n      called = true;\n      result = fn();\n    }\n    return result;\n  };\n}`,
    `(code) => { const fn = new Function(code + '; return once;')(); let callCount = 0; const wrapped = fn(()=>{ callCount++; return "done"; }); const r1=wrapped(); const r2=wrapped(); const r3=wrapped(); return [ { pass: r1==="done", description: 'first call returns fn result', got: r1 }, { pass: r2==="done"&&r3==="done", description: 'subsequent calls return same result', got: r2+","+r3 }, { pass: callCount===1, description: 'original fn only called once', got: "called "+callCount+" time(s)" } ]; }`,
    'Use a boolean flag and a cached result variable. On the first call set the flag and run the function. On all later calls skip the function and return the cache.'
  ),

  js('Partial Application',
    ['functions','higher-order'],
    ['higher-order','closures','functions'],
    'Pre-fill the first argument of a two-argument function.',
    `Write a function called \`partial\` that accepts a function and a first argument, and returns a new function that calls the original with that first argument pre-filled.

Examples:
  const add = (a, b) => a + b;
  const add5 = partial(add, 5);
  add5(3)  → 8
  add5(10) → 15

  const double = partial((a,b) => a * b, 2);
  double(7) → 14`,
    `function partial(fn, firstArg) {\n\n}`,
    `function partial(fn, firstArg) {\n  return function(secondArg) {\n    return fn(firstArg, secondArg);\n  };\n}`,
    `(code) => { const fn = new Function(code + '; return partial;')(); const add5 = fn((a,b)=>a+b,5); const double = fn((a,b)=>a*b,2); return [ { pass: add5(3)===8, description: 'add5(3) → 8', got: add5(3) }, { pass: add5(10)===15, description: 'add5(10) → 15', got: add5(10) }, { pass: double(7)===14, description: 'double(7) → 14', got: double(7) } ]; }`,
    'Return a new function. When called with a second argument, it calls the original fn with BOTH the pre-filled firstArg and the new secondArg.'
  ),

  // ── ES6+ — DESTRUCTURING, SPREAD, REST, DEFAULTS ─────────────────────────────

  js('Destructure an Array',
    ['es6-plus','destructuring'],
    ['destructuring','es6'],
    'Use array destructuring to extract first and last values.',
    `Write a function called \`firstAndLast\` that accepts an array and returns an object \`{ first, last }\` using array destructuring to get the first element.

Examples:
  firstAndLast([1,2,3,4,5]) → {first:1, last:5}
  firstAndLast(["a","b"])    → {first:"a", last:"b"}`,
    `function firstAndLast(arr) {\n  // Use array destructuring for the first element\n\n}`,
    `function firstAndLast(arr) {\n  const [first] = arr;\n  const last = arr[arr.length - 1];\n  return { first, last };\n}`,
    `(code) => { const fn = new Function(code + '; return firstAndLast;')(); const r1=fn([1,2,3,4,5]); const r2=fn(["a","b"]); return [ { pass: r1.first===1&&r1.last===5, description: '{first:1, last:5}', got: JSON.stringify(r1) }, { pass: r2.first==="a"&&r2.last==="b", description: '{first:"a", last:"b"}', got: JSON.stringify(r2) } ]; }`,
    'Array destructuring: const [first] = arr pulls the first element. Last element still uses arr[arr.length - 1]. The return uses shorthand property syntax.'
  ),

  js('Destructure an Object',
    ['es6-plus','destructuring'],
    ['destructuring','es6'],
    'Use object destructuring to format a person record.',
    `Write a function called \`formatPerson\` that accepts a person object with \`firstName\`, \`lastName\`, and \`age\`, uses destructuring, and returns "Name: FirstName LastName, Age: N".

Examples:
  formatPerson({firstName:"Ada",lastName:"Lovelace",age:36})
  → "Name: Ada Lovelace, Age: 36"`,
    `function formatPerson(person) {\n  // const { firstName, lastName, age } = person;\n\n}`,
    `function formatPerson(person) {\n  const { firstName, lastName, age } = person;\n  return \`Name: \${firstName} \${lastName}, Age: \${age}\`;\n}`,
    `(code) => { const fn = new Function(code + '; return formatPerson;')(); return [ { pass: fn({firstName:"Ada",lastName:"Lovelace",age:36})==="Name: Ada Lovelace, Age: 36", description: 'correct format', got: fn({firstName:"Ada",lastName:"Lovelace",age:36}) }, { pass: fn({firstName:"Alan",lastName:"Turing",age:41})==="Name: Alan Turing, Age: 41", description: 'works with different input', got: fn({firstName:"Alan",lastName:"Turing",age:41}) } ]; }`,
    'const { firstName, lastName, age } = person pulls those three properties into local variables. Then use them in a template literal.'
  ),

  js('Rest Parameters',
    ['es6-plus','destructuring'],
    ['rest','spread','es6'],
    'Use rest parameters to accept and sum any number of arguments.',
    `Write a function called \`sumAll\` that accepts any number of numeric arguments using rest parameters (...nums) and returns their sum.

Examples:
  sumAll(1, 2, 3) → 6
  sumAll(10, 20)  → 30
  sumAll(5)       → 5
  sumAll()        → 0`,
    `function sumAll(...nums) {\n\n}`,
    `function sumAll(...nums) {\n  return nums.reduce((acc, n) => acc + n, 0);\n}`,
    `(code) => { const fn = new Function(code + '; return sumAll;')(); return [ { pass: fn(1,2,3)===6, description: 'sumAll(1,2,3) → 6', got: fn(1,2,3) }, { pass: fn(10,20)===30, description: 'sumAll(10,20) → 30', got: fn(10,20) }, { pass: fn(5)===5, description: 'sumAll(5) → 5', got: fn(5) }, { pass: fn()===0, description: 'sumAll() → 0', got: fn() } ]; }`,
    '...nums in the function signature collects all arguments into an array. Then use .reduce() (or a loop) to sum them.'
  ),

  js('Default Parameters',
    ['es6-plus','destructuring'],
    ['default-params','es6'],
    'Use a default parameter to make an argument optional.',
    `Write a function called \`greetUser\` that accepts a name and an optional greeting (default: "Hello"). Return "\${greeting}, \${name}!".

Examples:
  greetUser("Alice")               → "Hello, Alice!"
  greetUser("Bob", "Hi")           → "Hi, Bob!"
  greetUser("Eve", "Good morning") → "Good morning, Eve!"`,
    `function greetUser(name, greeting = "Hello") {\n\n}`,
    `function greetUser(name, greeting = "Hello") {\n  return \`\${greeting}, \${name}!\`;\n}`,
    `(code) => { const fn = new Function(code + '; return greetUser;')(); return [ { pass: fn("Alice")==="Hello, Alice!", description: 'default greeting used', got: fn("Alice") }, { pass: fn("Bob","Hi")==="Hi, Bob!", description: 'custom greeting overrides default', got: fn("Bob","Hi") }, { pass: fn("Eve","Good morning")==="Good morning, Eve!", description: 'longer greeting works', got: fn("Eve","Good morning") } ]; }`,
    'Default parameters are set in the function signature with = . The signature is already filled in for you — just write the return statement.'
  ),

  js('Spread to Clone and Append',
    ['es6-plus','destructuring'],
    ['spread','es6','immutability'],
    'Use spread to append to an array without mutating the original.',
    `Write a function called \`appendItem\` that accepts an array and a value, and returns a NEW array with the value appended — without modifying the original.

Examples:
  appendItem([1, 2, 3], 4) → [1, 2, 3, 4]
  appendItem([], 5)         → [5]

The original array must NOT be modified.`,
    `function appendItem(arr, item) {\n\n}`,
    `function appendItem(arr, item) {\n  return [...arr, item];\n}`,
    `(code) => { const fn = new Function(code + '; return appendItem;')(); const orig=[1,2,3]; const result=fn(orig,4); return [ { pass: JSON.stringify(result)==='[1,2,3,4]', description: 'appendItem([1,2,3],4) → [1,2,3,4]', got: JSON.stringify(result) }, { pass: JSON.stringify(orig)==='[1,2,3]', description: 'original NOT mutated', got: JSON.stringify(orig) }, { pass: JSON.stringify(fn([],5))==='[5]', description: 'appendItem([],5) → [5]', got: JSON.stringify(fn([],5)) } ]; }`,
    '[...arr, item] creates a brand new array containing all elements of arr plus the new item at the end. The original is never touched.'
  ),

  // ── HTML — TIER II ────────────────────────────────────────────────────────────

  html('Navigation Menu',
    ['html','structure'],
    ['html','nav','links'],
    'Build a semantic navigation bar with three links.',
    `Create a \`<nav>\` element containing an unordered list with three navigation links:
  1. "Home"    → href="#home"
  2. "About"   → href="#about"
  3. "Contact" → href="#contact"`,
    `<!-- Build your nav here -->\n`,
    `<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>`,
    [
      { assertion: 'exists', selector: 'nav', description: 'A <nav> element exists' },
      { assertion: 'exists', selector: 'nav ul', description: 'A <ul> is inside the nav' },
      { assertion: 'countAtLeast', selector: 'nav a', value: 3, description: 'At least 3 links in the nav' },
      { assertion: 'exists', selector: 'a[href="#home"]', description: 'Link to "#home" exists' },
      { assertion: 'exists', selector: 'a[href="#about"]', description: 'Link to "#about" exists' },
      { assertion: 'exists', selector: 'a[href="#contact"]', description: 'Link to "#contact" exists' },
    ],
    '<nav> is the semantic element for navigation. Put each link in an <li> inside a <ul>. Use <a href="..."> with the destination in the href attribute.'
  ),

  html('Article with Header and Paragraph',
    ['html','semantics'],
    ['html','article','header','semantics'],
    'Build a semantic article with an h2 heading and body paragraph.',
    `Create an \`<article>\` element containing:
  1. An \`<h2>\` with any heading text
  2. A \`<p>\` with at least one sentence of body text`,
    `<!-- Build your article here -->\n`,
    `<article>\n  <h2>My Article Title</h2>\n  <p>This is the body text of the article.</p>\n</article>`,
    [
      { assertion: 'exists', selector: 'article', description: 'An <article> element exists' },
      { assertion: 'exists', selector: 'article h2', description: 'An <h2> is inside the article' },
      { assertion: 'exists', selector: 'article p', description: 'A <p> is inside the article' },
    ],
    '<article> is for self-contained content. Use <h2> for the heading (h1 is typically the page title). The paragraph goes between <p>...</p>.'
  ),

  html('Figure with Caption',
    ['html','semantics'],
    ['html','figure','figcaption','semantics'],
    'Wrap an image in a figure element with a caption.',
    `Create a \`<figure>\` element containing:
  1. An \`<img>\` with a src of "photo.jpg" and an alt attribute describing the image
  2. A \`<figcaption>\` with any descriptive caption text`,
    `<!-- Build your figure here -->\n`,
    `<figure>\n  <img src="photo.jpg" alt="A landscape photo">\n  <figcaption>A beautiful landscape scene.</figcaption>\n</figure>`,
    [
      { assertion: 'exists', selector: 'figure', description: 'A <figure> element exists' },
      { assertion: 'exists', selector: 'figure img', description: 'An <img> is inside the figure' },
      { assertion: 'exists', selector: 'figure img[alt]', description: 'The img has an alt attribute' },
      { assertion: 'exists', selector: 'figure figcaption', description: 'A <figcaption> is inside the figure' },
    ],
    '<figure> groups media with its caption. The <img> needs both src (the file path) and alt (text description for screen readers). <figcaption> provides the visible caption.'
  ),

  html('Contact Form',
    ['html','forms'],
    ['html','forms','inputs'],
    'Build a contact form with name, email, and message fields.',
    `Create a \`<form>\` containing:
  1. A \`<label>\` + \`<input type="text">\` for the user's name
  2. A \`<label>\` + \`<input type="email">\` for their email
  3. A \`<label>\` + \`<textarea>\` for a message
  4. A \`<button type="submit">\` with the text "Send"`,
    `<!-- Build your contact form here -->\n<form>\n\n</form>`,
    `<form>\n  <label>Name:</label>\n  <input type="text">\n  <label>Email:</label>\n  <input type="email">\n  <label>Message:</label>\n  <textarea></textarea>\n  <button type="submit">Send</button>\n</form>`,
    [
      { assertion: 'exists', selector: 'form', description: 'A <form> exists' },
      { assertion: 'exists', selector: 'form input[type="text"]', description: 'A text input for name' },
      { assertion: 'exists', selector: 'form input[type="email"]', description: 'An email input' },
      { assertion: 'exists', selector: 'form textarea', description: 'A textarea for the message' },
      { assertion: 'exists', selector: 'form button[type="submit"]', description: 'A submit button' },
      { assertion: 'textContains', selector: 'form button', value: 'Send', description: 'Button says "Send"' },
    ],
    'A form is a container. Use <label> to describe each field. Input type="email" gives browsers built-in email validation. <textarea> is for multi-line text. The submit button closes the form.'
  ),

  html('Definition List',
    ['html','semantics'],
    ['html','lists','semantics'],
    'Build a definition list with three term/definition pairs.',
    `Create a \`<dl>\` (definition list) with at least three term/definition pairs:
  - HTML → HyperText Markup Language
  - CSS  → Cascading Style Sheets
  - JS   → JavaScript`,
    `<!-- Build your definition list here -->\n`,
    `<dl>\n  <dt>HTML</dt>\n  <dd>HyperText Markup Language</dd>\n  <dt>CSS</dt>\n  <dd>Cascading Style Sheets</dd>\n  <dt>JS</dt>\n  <dd>JavaScript</dd>\n</dl>`,
    [
      { assertion: 'exists', selector: 'dl', description: 'A <dl> element exists' },
      { assertion: 'countAtLeast', selector: 'dl dt', value: 3, description: 'At least 3 <dt> terms' },
      { assertion: 'countAtLeast', selector: 'dl dd', value: 3, description: 'At least 3 <dd> definitions' },
      { assertion: 'sourceContains', value: 'HTML', description: 'Contains "HTML"' },
      { assertion: 'sourceContains', value: 'CSS', description: 'Contains "CSS"' },
    ],
    '<dl> is the definition list element. <dt> is the term being defined, <dd> is the definition. They pair up: dt then dd, dt then dd, etc.'
  ),

  // ── CSS — TIER II ─────────────────────────────────────────────────────────────

  css('Style a Link',
    ['css','selectors'],
    ['css','selectors','links'],
    'Style anchor tags to change their appearance.',
    `Write CSS to style the \`<a>\` element:
  1. Remove the underline (text-decoration: none)
  2. Set the color to navy
  3. Make the font weight bold`,
    `/* Style the anchor tag */\na {\n  /* Your code here */\n\n}`,
    `a {\n  text-decoration: none;\n  color: navy;\n  font-weight: bold;\n}`,
    `<a id="test-link" href="#">Click me</a>`,
    [
      { assertion: 'equals', selector: '#test-link', property: 'text-decoration', value: 'none solid rgb(0, 0, 128)', description: 'Underline removed' },
      { assertion: 'equals', selector: '#test-link', property: 'color', value: 'rgb(0, 0, 128)', description: 'Color is navy' },
      { assertion: 'equals', selector: '#test-link', property: 'font-weight', value: 'bold', description: 'Font weight is bold' },
    ],
    '"text-decoration: none" removes the default underline. "color: navy" is a named CSS color. "font-weight: bold" makes text heavier.'
  ),

  css('Card Box Model',
    ['css','box-model'],
    ['css','box-model','border','padding','margin'],
    'Style a card element with padding, border, and margin.',
    `Write CSS to style the \`.card\` class:
  1. padding: 20px
  2. border: 2px solid black
  3. margin: 10px`,
    `/* Style the .card class */\n.card {\n  /* Your code here */\n\n}`,
    `.card {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n}`,
    `<div class="card" id="test-card">Card content</div>`,
    [
      { assertion: 'equals', selector: '#test-card', property: 'padding-top', value: '20px', description: 'Padding is 20px' },
      { assertion: 'equals', selector: '#test-card', property: 'border-top-width', value: '2px', description: 'Border width is 2px' },
      { assertion: 'equals', selector: '#test-card', property: 'border-top-style', value: 'solid', description: 'Border style is solid' },
      { assertion: 'equals', selector: '#test-card', property: 'margin-top', value: '10px', description: 'Margin is 10px' },
    ],
    'The box model: padding is space inside the border, margin is space outside. "border: 2px solid black" is a shorthand for width, style, and color.'
  ),

  css('Flexbox Row',
    ['css','layout','flexbox'],
    ['css','flexbox','layout'],
    'Use flexbox to display items in a centered row.',
    `Write CSS to style the \`.flex-row\` class so that its children display in a horizontal row, centered both horizontally and vertically.
  1. display: flex
  2. justify-content: center
  3. align-items: center
  4. gap: 16px`,
    `/* Style .flex-row */\n.flex-row {\n  /* Your code here */\n\n}`,
    `.flex-row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}`,
    `<div class="flex-row" id="test-flex"><span>A</span><span>B</span><span>C</span></div>`,
    [
      { assertion: 'equals', selector: '#test-flex', property: 'display', value: 'flex', description: 'display is flex' },
      { assertion: 'equals', selector: '#test-flex', property: 'justify-content', value: 'center', description: 'justify-content is center' },
      { assertion: 'equals', selector: '#test-flex', property: 'align-items', value: 'center', description: 'align-items is center' },
      { assertion: 'equals', selector: '#test-flex', property: 'gap', value: '16px', description: 'gap is 16px' },
    ],
    '"display: flex" turns on flexbox. "justify-content: center" centers items along the main axis (horizontal by default). "align-items: center" centers on the cross axis. "gap" adds space between items.'
  ),

  css('Hover State',
    ['css','selectors'],
    ['css','selectors','pseudo-class','hover'],
    'Change the background color of a button when hovered.',
    `Write CSS to:
  1. Give \`.btn\` a background-color of steelblue and color of white
  2. On hover (\`.btn:hover\`), change the background-color to darkblue`,
    `/* Style .btn and its hover state */\n.btn {\n  /* Your code here */\n\n}\n\n.btn:hover {\n  /* Your code here */\n\n}`,
    `.btn {\n  background-color: steelblue;\n  color: white;\n}\n\n.btn:hover {\n  background-color: darkblue;\n}`,
    `<button class="btn" id="test-btn">Click me</button>`,
    [
      { assertion: 'equals', selector: '#test-btn', property: 'background-color', value: 'rgb(70, 130, 180)', description: 'Default background is steelblue' },
      { assertion: 'equals', selector: '#test-btn', property: 'color', value: 'rgb(255, 255, 255)', description: 'Text color is white' },
    ],
    'The :hover pseudo-class selector applies styles only when the mouse is over the element. Write two separate rule blocks: one for the default state, one for .btn:hover.'
  ),

  css('CSS Custom Properties (Variables)',
    ['css','selectors'],
    ['css','variables','custom-properties'],
    'Use CSS custom properties to define and use a color variable.',
    `Write CSS that:
  1. On \`:root\`, defines a custom property \`--main-color\` set to \`#3498db\`
  2. On \`.box\`, sets \`background-color\` to \`var(--main-color)\``,
    `/* Define the variable on :root and use it on .box */\n:root {\n  /* Your code here */\n\n}\n\n.box {\n  /* Your code here */\n\n}`,
    `:root {\n  --main-color: #3498db;\n}\n\n.box {\n  background-color: var(--main-color);\n}`,
    `<div class="box" id="test-box">Box</div>`,
    [
      { assertion: 'equals', selector: '#test-box', property: 'background-color', value: 'rgb(52, 152, 219)', description: 'Background uses the custom property value' },
    ],
    'CSS custom properties start with --. Define them on :root so they are available everywhere. Use var(--property-name) to reference them. The hex #3498db equals rgb(52, 152, 219).'
  ),

];

data.exercises.push(...exercises);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');

const tier2 = data.exercises.filter(e => e.tier === 2);
console.log(`✓ Part B: added ${exercises.length} exercises (IDs ${exercises[0].id}–${exercises[exercises.length-1].id})`);
console.log(`✓ Total Tier II exercises: ${tier2.length}`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
