#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const EXERCISES_PATH = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf8'));

let nextId = 407;
const newExercises = [];

// ─── Helper ───
function ex(obj) {
  obj.id = nextId++;
  newExercises.push(obj);
  return obj.id;
}

// ═══════════════════════════════════════════════════════════════
// CURRICULUM 1: Performance / Big O  (8 exercises)
// ═══════════════════════════════════════════════════════════════
const perfIds = [];

perfIds.push(ex({
  title: "Linear Search",
  type: "js",
  tier: 2,
  category: ["algorithms", "performance"],
  tags: ["searching", "linear", "O(n)"],
  description: "Search an array by checking each element one at a time.",
  instructions: "Write a function `linearSearch(arr, target)` that returns the **index** of `target` in `arr`, or `-1` if not found. You must check each element from left to right.\n\n```js\nlinearSearch([10, 20, 30, 40], 30) // => 2\nlinearSearch([10, 20, 30, 40], 50) // => -1\nlinearSearch([], 1)                // => -1\n```\n\nThis is an O(n) algorithm — in the worst case you check every element.",
  starterCode: "function linearSearch(arr, target) {\n  // your code here\n}",
  solution: "function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return linearSearch;')();
  const r1 = fn([10,20,30,40], 30);
  const r2 = fn([10,20,30,40], 50);
  const r3 = fn([], 1);
  const r4 = fn([5,5,5], 5);
  return [
    { pass: r1 === 2, description: 'Finds element in middle', got: String(r1) },
    { pass: r2 === -1, description: 'Returns -1 when not found', got: String(r2) },
    { pass: r3 === -1, description: 'Handles empty array', got: String(r3) },
    { pass: r4 === 0, description: 'Returns first occurrence index', got: String(r4) }
  ];
}`,
  hints: [
    "How would you look through a list of names on paper to find a specific one?",
    "Use a for loop to iterate through each index. Compare each element to the target.",
    "Loop from i=0 to arr.length-1. If arr[i] === target, return i. After the loop, return -1."
  ],
  resources: [
    { label: "MDN: Array", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", description: "JavaScript Array reference" },
    { label: "MDN: for loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for", description: "The for statement" }
  ]
}));

perfIds.push(ex({
  title: "Count Pairs",
  type: "js",
  tier: 2,
  category: ["algorithms", "performance"],
  tags: ["nested-loops", "O(n²)"],
  description: "Count all pairs in an array that sum to a target value.",
  instructions: "Write a function `countPairs(arr, target)` that returns the number of **unique index pairs** (i, j) where i < j and `arr[i] + arr[j] === target`.\n\nUse a nested loop (brute-force O(n²) approach).\n\n```js\ncountPairs([1, 2, 3, 4, 5], 6)  // => 2  (1+5, 2+4)\ncountPairs([1, 1, 1], 2)         // => 3  (0+1, 0+2, 1+2)\ncountPairs([1, 2, 3], 10)        // => 0\n```",
  starterCode: "function countPairs(arr, target) {\n  // your code here\n}",
  solution: "function countPairs(arr, target) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] + arr[j] === target) count++;\n    }\n  }\n  return count;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return countPairs;')();
  const r1 = fn([1,2,3,4,5], 6);
  const r2 = fn([1,1,1], 2);
  const r3 = fn([1,2,3], 10);
  const r4 = fn([], 5);
  return [
    { pass: r1 === 2, description: 'Finds two pairs summing to 6', got: String(r1) },
    { pass: r2 === 3, description: 'Handles duplicate values', got: String(r2) },
    { pass: r3 === 0, description: 'Returns 0 when no pairs found', got: String(r3) },
    { pass: r4 === 0, description: 'Handles empty array', got: String(r4) }
  ];
}`,
  hints: [
    "If you compare every element with every other element, how many comparisons is that?",
    "Use two nested loops: outer loop i from 0 to length-1, inner loop j from i+1 to length-1.",
    "Inside the inner loop, check if arr[i] + arr[j] === target. If so, increment a counter."
  ],
  resources: [
    { label: "MDN: for loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for", description: "The for statement" },
    { label: "MDN: Arithmetic operators", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition", description: "Addition operator" }
  ]
}));

perfIds.push(ex({
  title: "Has Duplicates",
  type: "js",
  tier: 2,
  category: ["algorithms", "performance"],
  tags: ["sets", "hashing", "O(n)"],
  description: "Check if an array contains any duplicate values using a Set.",
  instructions: "Write a function `hasDuplicates(arr)` that returns `true` if any value appears more than once, `false` otherwise.\n\nUse a `Set` or object for an O(n) solution — do **not** use nested loops.\n\n```js\nhasDuplicates([1, 2, 3, 4])     // => false\nhasDuplicates([1, 2, 3, 1])     // => true\nhasDuplicates([])               // => false\nhasDuplicates(['a', 'b', 'a']) // => true\n```",
  starterCode: "function hasDuplicates(arr) {\n  // your code here\n}",
  solution: "function hasDuplicates(arr) {\n  const seen = new Set();\n  for (const val of arr) {\n    if (seen.has(val)) return true;\n    seen.add(val);\n  }\n  return false;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return hasDuplicates;')();
  const r1 = fn([1,2,3,4]);
  const r2 = fn([1,2,3,1]);
  const r3 = fn([]);
  const r4 = fn(['a','b','a']);
  return [
    { pass: r1 === false, description: 'No duplicates returns false', got: String(r1) },
    { pass: r2 === true, description: 'Detects numeric duplicates', got: String(r2) },
    { pass: r3 === false, description: 'Empty array returns false', got: String(r3) },
    { pass: r4 === true, description: 'Detects string duplicates', got: String(r4) }
  ];
}`,
  hints: [
    "What data structure lets you quickly check if you have seen a value before?",
    "A Set stores unique values. You can check .has() and .add() in O(1) time.",
    "Loop through the array. For each element, check if the Set has it — if yes return true, otherwise add it. After the loop return false."
  ],
  resources: [
    { label: "MDN: Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", description: "The Set object" },
    { label: "MDN: Set.prototype.has()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has", description: "Check if a value exists in a Set" }
  ]
}));

perfIds.push(ex({
  title: "Two Sum (Optimized)",
  type: "js",
  tier: 2,
  category: ["algorithms", "performance"],
  tags: ["hash-map", "optimization", "O(n)"],
  description: "Find two numbers that sum to a target using a hash map in O(n).",
  instructions: "Write a function `twoSum(arr, target)` that returns an array of the **two indices** whose values sum to `target`. Use an object or Map for O(n) lookup.\n\nReturn the first valid pair found (scanning left to right). If no pair exists, return `null`.\n\n```js\ntwoSum([2, 7, 11, 15], 9)  // => [0, 1]  (2+7=9)\ntwoSum([3, 2, 4], 6)       // => [1, 2]  (2+4=6)\ntwoSum([1, 2, 3], 10)      // => null\n```",
  starterCode: "function twoSum(arr, target) {\n  // your code here\n}",
  solution: "function twoSum(arr, target) {\n  const map = {};\n  for (let i = 0; i < arr.length; i++) {\n    const complement = target - arr[i];\n    if (map.hasOwnProperty(complement)) {\n      return [map[complement], i];\n    }\n    map[arr[i]] = i;\n  }\n  return null;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return twoSum;')();
  const r1 = fn([2,7,11,15], 9);
  const r2 = fn([3,2,4], 6);
  const r3 = fn([1,2,3], 10);
  const r4 = fn([1,1], 2);
  return [
    { pass: JSON.stringify(r1) === '[0,1]', description: 'Finds pair [0,1] for target 9', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[1,2]', description: 'Finds pair [1,2] for target 6', got: JSON.stringify(r2) },
    { pass: r3 === null, description: 'Returns null when no pair exists', got: String(r3) },
    { pass: JSON.stringify(r4) === '[0,1]', description: 'Handles duplicate values', got: JSON.stringify(r4) }
  ];
}`,
  hints: [
    "For each number, what other number would you need to reach the target?",
    "Store each number's index in an object as you go. Before storing, check if the complement (target - current) already exists.",
    "Create an object `map`. Loop with index i. Let complement = target - arr[i]. If map has complement, return [map[complement], i]. Otherwise set map[arr[i]] = i."
  ],
  resources: [
    { label: "MDN: Object", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object", description: "JavaScript Object reference" },
    { label: "MDN: hasOwnProperty", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty", description: "Check if object has a property" }
  ]
}));

perfIds.push(ex({
  title: "Binary Search",
  type: "js",
  tier: 3,
  category: ["algorithms", "performance"],
  tags: ["searching", "binary-search", "O(log-n)"],
  description: "Implement binary search on a sorted array for O(log n) lookup.",
  instructions: "Write a function `binarySearch(arr, target)` that returns the **index** of `target` in a **sorted** array, or `-1` if not found.\n\nYou must use the binary search algorithm (divide and conquer), not a linear scan.\n\n```js\nbinarySearch([1, 3, 5, 7, 9, 11], 7)   // => 3\nbinarySearch([1, 3, 5, 7, 9, 11], 4)   // => -1\nbinarySearch([2, 4, 6, 8, 10], 2)      // => 0\nbinarySearch([2, 4, 6, 8, 10], 10)     // => 4\n```",
  starterCode: "function binarySearch(arr, target) {\n  // your code here\n}",
  solution: "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return binarySearch;')();
  const r1 = fn([1,3,5,7,9,11], 7);
  const r2 = fn([1,3,5,7,9,11], 4);
  const r3 = fn([2,4,6,8,10], 2);
  const r4 = fn([2,4,6,8,10], 10);
  const r5 = fn([], 5);
  return [
    { pass: r1 === 3, description: 'Finds element in middle', got: String(r1) },
    { pass: r2 === -1, description: 'Returns -1 for missing element', got: String(r2) },
    { pass: r3 === 0, description: 'Finds first element', got: String(r3) },
    { pass: r4 === 4, description: 'Finds last element', got: String(r4) },
    { pass: r5 === -1, description: 'Handles empty array', got: String(r5) }
  ];
}`,
  hints: [
    "If you open a dictionary to the middle and your word comes after that page, which half do you search next?",
    "Maintain two pointers: left and right. Find the midpoint, compare arr[mid] to target, then narrow the search to the correct half.",
    "While left <= right: mid = Math.floor((left+right)/2). If arr[mid] === target return mid. If arr[mid] < target, left = mid+1. Else right = mid-1."
  ],
  resources: [
    { label: "MDN: Math.floor()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor", description: "Round down to nearest integer" },
    { label: "MDN: while loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while", description: "The while statement" }
  ]
}));

perfIds.push(ex({
  title: "Frequency Counter",
  type: "js",
  tier: 3,
  category: ["algorithms", "performance"],
  tags: ["frequency-counter", "optimization"],
  description: "Check if one array is the squared version of another using frequency counting.",
  instructions: "Write a function `isSquaredVersion(arr1, arr2)` that returns `true` if `arr2` contains the squares of all values in `arr1` (same frequency, any order).\n\nUse a frequency counter approach (O(n)) — do **not** use nested loops or sorting.\n\n```js\nisSquaredVersion([1, 2, 3], [1, 4, 9])     // => true\nisSquaredVersion([1, 2, 3], [1, 9])         // => false (different lengths)\nisSquaredVersion([2, 2, 3], [4, 9, 4])      // => true\nisSquaredVersion([2, 2, 3], [4, 9, 9])      // => false (wrong frequency)\n```",
  starterCode: "function isSquaredVersion(arr1, arr2) {\n  // your code here\n}",
  solution: "function isSquaredVersion(arr1, arr2) {\n  if (arr1.length !== arr2.length) return false;\n  const freq1 = {};\n  const freq2 = {};\n  for (const val of arr1) freq1[val] = (freq1[val] || 0) + 1;\n  for (const val of arr2) freq2[val] = (freq2[val] || 0) + 1;\n  for (const key in freq1) {\n    const squared = key * key;\n    if (freq2[squared] !== freq1[key]) return false;\n  }\n  return true;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return isSquaredVersion;')();
  const r1 = fn([1,2,3], [1,4,9]);
  const r2 = fn([1,2,3], [1,9]);
  const r3 = fn([2,2,3], [4,9,4]);
  const r4 = fn([2,2,3], [4,9,9]);
  return [
    { pass: r1 === true, description: 'Basic squared match', got: String(r1) },
    { pass: r2 === false, description: 'Different lengths returns false', got: String(r2) },
    { pass: r3 === true, description: 'Handles duplicate values', got: String(r3) },
    { pass: r4 === false, description: 'Wrong frequency returns false', got: String(r4) }
  ];
}`,
  hints: [
    "What if you counted how many times each value appears in both arrays?",
    "Build a frequency map for each array. Then check that for each value in arr1, its square appears the same number of times in arr2.",
    "Create freq1 and freq2 objects. Loop arr1: freq1[val] = (freq1[val]||0)+1. Same for arr2. Then for each key in freq1, check freq2[key*key] === freq1[key]."
  ],
  resources: [
    { label: "MDN: for...of", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of", description: "Iterate over iterable objects" },
    { label: "MDN: for...in", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in", description: "Iterate over object properties" }
  ]
}));

perfIds.push(ex({
  title: "Sliding Window Max Sum",
  type: "js",
  tier: 3,
  category: ["algorithms", "performance"],
  tags: ["sliding-window", "optimization"],
  description: "Find the maximum sum of k consecutive elements using a sliding window.",
  instructions: "Write a function `maxSubarraySum(arr, k)` that returns the maximum sum of `k` consecutive elements. If `arr.length < k`, return `null`.\n\nUse the sliding window technique (O(n)) — do **not** recalculate the full sum for each window.\n\n```js\nmaxSubarraySum([1, 2, 5, 2, 8, 1, 5], 2)  // => 10  (2+8)\nmaxSubarraySum([1, 2, 5, 2, 8, 1, 5], 4)  // => 17  (2+5+2+8)\nmaxSubarraySum([4, 2, 1, 6], 1)            // => 6\nmaxSubarraySum([1, 2], 3)                  // => null\n```",
  starterCode: "function maxSubarraySum(arr, k) {\n  // your code here\n}",
  solution: "function maxSubarraySum(arr, k) {\n  if (arr.length < k) return null;\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum = windowSum + arr[i] - arr[i - k];\n    if (windowSum > maxSum) maxSum = windowSum;\n  }\n  return maxSum;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return maxSubarraySum;')();
  const r1 = fn([1,2,5,2,8,1,5], 2);
  const r2 = fn([1,2,5,2,8,1,5], 4);
  const r3 = fn([4,2,1,6], 1);
  const r4 = fn([1,2], 3);
  return [
    { pass: r1 === 10, description: 'Max sum of 2 consecutive', got: String(r1) },
    { pass: r2 === 17, description: 'Max sum of 4 consecutive', got: String(r2) },
    { pass: r3 === 6, description: 'Window of size 1', got: String(r3) },
    { pass: r4 === null, description: 'Returns null when k > length', got: String(r4) }
  ];
}`,
  hints: [
    "If you already know the sum of elements 0-3, how can you get the sum of elements 1-4 without adding all four again?",
    "Calculate the first window sum. Then slide: add the next element and subtract the element leaving the window.",
    "Sum first k elements. Then loop from i=k: windowSum += arr[i] - arr[i-k]. Track maxSum throughout."
  ],
  resources: [
    { label: "MDN: Math.max()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max", description: "Returns the largest of given numbers" },
    { label: "MDN: Array", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", description: "JavaScript Array reference" }
  ]
}));

perfIds.push(ex({
  title: "Memoize",
  type: "js",
  tier: 4,
  category: ["algorithms", "performance"],
  tags: ["memoization", "closures", "caching"],
  description: "Write a generic memoize function that caches results of function calls.",
  instructions: "Write a function `memoize(fn)` that returns a new function which caches results. If called again with the same arguments, it returns the cached result instead of re-executing `fn`.\n\nFor simplicity, use `JSON.stringify(args)` as the cache key.\n\n```js\nlet callCount = 0;\nconst add = (a, b) => { callCount++; return a + b; };\nconst memoAdd = memoize(add);\n\nmemoAdd(1, 2)  // => 3 (callCount: 1)\nmemoAdd(1, 2)  // => 3 (callCount still 1 — cached!)\nmemoAdd(2, 3)  // => 5 (callCount: 2)\n```",
  starterCode: "function memoize(fn) {\n  // your code here\n}",
  solution: "function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.hasOwnProperty(key)) return cache[key];\n    cache[key] = fn(...args);\n    return cache[key];\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return memoize;')();
  let count = 0;
  const add = (a, b) => { count++; return a + b; };
  const m = fn(add);
  const r1 = m(1,2);
  const c1 = count;
  const r2 = m(1,2);
  const c2 = count;
  const r3 = m(2,3);
  const c3 = count;
  const r4 = m(2,3);
  const c4 = count;
  return [
    { pass: r1 === 3 && c1 === 1, description: 'First call computes result', got: r1 + ', calls: ' + c1 },
    { pass: r2 === 3 && c2 === 1, description: 'Second call with same args uses cache', got: r2 + ', calls: ' + c2 },
    { pass: r3 === 5 && c3 === 2, description: 'Different args triggers new computation', got: r3 + ', calls: ' + c3 },
    { pass: c4 === 2, description: 'Repeated different args also cached', got: 'calls: ' + c4 }
  ];
}`,
  hints: [
    "Where could you store previously computed results so the returned function can access them later?",
    "Use a closure! The returned function can access a `cache` object defined in memoize's scope. Use JSON.stringify on arguments as a key.",
    "Create cache = {}. Return function(...args) { const key = JSON.stringify(args); if key in cache return it; otherwise compute, store, and return. }"
  ],
  resources: [
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: JSON.stringify()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify", description: "Convert value to JSON string" },
    { label: "MDN: Rest parameters", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters", description: "Gather arguments into an array" }
  ]
}));

// ═══════════════════════════════════════════════════════════════
// CURRICULUM 2: Testing Practices  (8 exercises)
// ═══════════════════════════════════════════════════════════════
const testIds = [];

testIds.push(ex({
  title: "Write assertEqual",
  type: "js",
  tier: 2,
  category: ["testing", "assertions"],
  tags: ["assertions", "equality", "testing"],
  description: "Implement an assertEqual function that throws if two values differ.",
  instructions: "Write a function `assertEqual(actual, expected, message)` that:\n- Does nothing if `actual === expected`\n- Throws an `Error` with `message` (or a default message) if they are not equal\n\n```js\nassertEqual(1, 1, 'should be 1')        // does nothing\nassertEqual(1, 2, 'should be equal')    // throws Error: 'should be equal'\nassertEqual('a', 'a')                   // does nothing\nassertEqual(true, false)                // throws Error with default message\n```",
  starterCode: "function assertEqual(actual, expected, message) {\n  // your code here\n}",
  solution: "function assertEqual(actual, expected, message) {\n  if (actual !== expected) {\n    throw new Error(message || 'Expected ' + expected + ' but got ' + actual);\n  }\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return assertEqual;')();
  let r1 = false, r2 = false, r3 = false, r4 = false;
  try { fn(1, 1, 'ok'); r1 = true; } catch(e) { r1 = false; }
  try { fn(1, 2, 'fail'); r2 = false; } catch(e) { r2 = e.message === 'fail'; }
  try { fn('a', 'a'); r3 = true; } catch(e) { r3 = false; }
  try { fn(true, false); r4 = false; } catch(e) { r4 = e instanceof Error; }
  return [
    { pass: r1, description: 'Does not throw when values are equal', got: String(r1) },
    { pass: r2, description: 'Throws with custom message when not equal', got: String(r2) },
    { pass: r3, description: 'Works with string equality', got: String(r3) },
    { pass: r4, description: 'Throws an Error instance on mismatch', got: String(r4) }
  ];
}`,
  hints: [
    "What should happen when actual and expected are NOT the same?",
    "Use the strict equality operator (===) and throw new Error() when they differ.",
    "if (actual !== expected) throw new Error(message || 'Expected ' + expected + ' but got ' + actual);"
  ],
  resources: [
    { label: "MDN: throw", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw", description: "The throw statement" },
    { label: "MDN: Error", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error", description: "The Error constructor" }
  ]
}));

testIds.push(ex({
  title: "Write assertArrayEqual",
  type: "js",
  tier: 2,
  category: ["testing", "assertions"],
  tags: ["assertions", "arrays", "testing"],
  description: "Compare two arrays element-by-element and throw if they differ.",
  instructions: "Write a function `assertArrayEqual(actual, expected, message)` that:\n- Compares two arrays element by element using `===`\n- Does nothing if they match (same length, same values in order)\n- Throws an `Error` if they differ\n\n```js\nassertArrayEqual([1,2,3], [1,2,3])       // does nothing\nassertArrayEqual([1,2], [1,2,3])          // throws\nassertArrayEqual(['a','b'], ['a','c'])    // throws\n```",
  starterCode: "function assertArrayEqual(actual, expected, message) {\n  // your code here\n}",
  solution: "function assertArrayEqual(actual, expected, message) {\n  if (actual.length !== expected.length) {\n    throw new Error(message || 'Array lengths differ: ' + actual.length + ' vs ' + expected.length);\n  }\n  for (let i = 0; i < actual.length; i++) {\n    if (actual[i] !== expected[i]) {\n      throw new Error(message || 'Mismatch at index ' + i + ': ' + actual[i] + ' vs ' + expected[i]);\n    }\n  }\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return assertArrayEqual;')();
  let r1 = false, r2 = false, r3 = false, r4 = false;
  try { fn([1,2,3], [1,2,3]); r1 = true; } catch(e) { r1 = false; }
  try { fn([1,2], [1,2,3]); r2 = false; } catch(e) { r2 = true; }
  try { fn(['a','b'], ['a','c']); r3 = false; } catch(e) { r3 = true; }
  try { fn([], []); r4 = true; } catch(e) { r4 = false; }
  return [
    { pass: r1, description: 'Does not throw for matching arrays', got: String(r1) },
    { pass: r2, description: 'Throws for different lengths', got: String(r2) },
    { pass: r3, description: 'Throws for different values', got: String(r3) },
    { pass: r4, description: 'Empty arrays are equal', got: String(r4) }
  ];
}`,
  hints: [
    "What two things could make arrays different — their size or their contents?",
    "First check if lengths match. Then loop through each index comparing elements with ===.",
    "Check actual.length !== expected.length first. Then loop: if actual[i] !== expected[i], throw. If loop finishes, arrays match."
  ],
  resources: [
    { label: "MDN: Array.length", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length", description: "Array length property" },
    { label: "MDN: Strict equality", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality", description: "The === operator" }
  ]
}));

testIds.push(ex({
  title: "Write assertThrows",
  type: "js",
  tier: 2,
  category: ["testing", "assertions"],
  tags: ["assertions", "errors", "testing"],
  description: "Implement assertThrows to verify that a callback throws an error.",
  instructions: "Write a function `assertThrows(fn, message)` that:\n- Calls `fn()`\n- If `fn` throws, the assertion passes (do nothing)\n- If `fn` does NOT throw, throw an Error with `message` or a default\n\n```js\nassertThrows(() => { throw new Error('boom'); })  // passes\nassertThrows(() => 42)                             // throws!\nassertThrows(() => JSON.parse('invalid'))          // passes\n```",
  starterCode: "function assertThrows(fn, message) {\n  // your code here\n}",
  solution: "function assertThrows(fn, message) {\n  let threw = false;\n  try {\n    fn();\n  } catch (e) {\n    threw = true;\n  }\n  if (!threw) {\n    throw new Error(message || 'Expected function to throw');\n  }\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return assertThrows;')();
  let r1 = false, r2 = false, r3 = false, r4 = false;
  try { fn(() => { throw new Error('boom'); }); r1 = true; } catch(e) { r1 = false; }
  try { fn(() => 42); r2 = false; } catch(e) { r2 = true; }
  try { fn(() => JSON.parse('{')); r3 = true; } catch(e) { r3 = false; }
  try { fn(() => { throw 'string error'; }); r4 = true; } catch(e) { r4 = false; }
  return [
    { pass: r1, description: 'Passes when function throws Error', got: String(r1) },
    { pass: r2, description: 'Throws when function does not throw', got: String(r2) },
    { pass: r3, description: 'Passes for JSON.parse errors', got: String(r3) },
    { pass: r4, description: 'Passes for non-Error thrown values', got: String(r4) }
  ];
}`,
  hints: [
    "How can you run a function and detect whether it threw?",
    "Wrap fn() in a try/catch. Use a boolean flag to track if it threw.",
    "Set threw = false. try { fn() } catch(e) { threw = true }. After try/catch, if !threw, throw new Error(message)."
  ],
  resources: [
    { label: "MDN: try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", description: "Error handling with try/catch" },
    { label: "MDN: throw", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw", description: "The throw statement" }
  ]
}));

testIds.push(ex({
  title: "Write assertObjectEqual",
  type: "js",
  tier: 2,
  category: ["testing", "assertions"],
  tags: ["assertions", "objects", "testing"],
  description: "Deep equality check for flat objects (no nested objects).",
  instructions: "Write a function `assertObjectEqual(actual, expected, message)` that compares two **flat** objects (no nested objects/arrays). It should:\n- Check that both have the same keys\n- Check that all values match with `===`\n- Throw an Error if they differ\n\n```js\nassertObjectEqual({a:1, b:2}, {a:1, b:2})   // passes\nassertObjectEqual({a:1}, {a:1, b:2})         // throws (missing key)\nassertObjectEqual({a:1, b:3}, {a:1, b:2})    // throws (value differs)\n```",
  starterCode: "function assertObjectEqual(actual, expected, message) {\n  // your code here\n}",
  solution: "function assertObjectEqual(actual, expected, message) {\n  const aKeys = Object.keys(actual);\n  const eKeys = Object.keys(expected);\n  if (aKeys.length !== eKeys.length) {\n    throw new Error(message || 'Objects have different number of keys');\n  }\n  for (const key of eKeys) {\n    if (actual[key] !== expected[key]) {\n      throw new Error(message || 'Mismatch at key \"' + key + '\": ' + actual[key] + ' vs ' + expected[key]);\n    }\n  }\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return assertObjectEqual;')();
  let r1 = false, r2 = false, r3 = false, r4 = false;
  try { fn({a:1,b:2}, {a:1,b:2}); r1 = true; } catch(e) { r1 = false; }
  try { fn({a:1}, {a:1,b:2}); r2 = false; } catch(e) { r2 = true; }
  try { fn({a:1,b:3}, {a:1,b:2}); r3 = false; } catch(e) { r3 = true; }
  try { fn({}, {}); r4 = true; } catch(e) { r4 = false; }
  return [
    { pass: r1, description: 'Matching objects pass', got: String(r1) },
    { pass: r2, description: 'Missing key throws', got: String(r2) },
    { pass: r3, description: 'Different value throws', got: String(r3) },
    { pass: r4, description: 'Empty objects are equal', got: String(r4) }
  ];
}`,
  hints: [
    "How do you get all the keys from an object?",
    "Use Object.keys() to get arrays of keys from both objects. Check lengths match, then compare each value.",
    "Get keys with Object.keys(). If lengths differ, throw. Loop through expected keys: if actual[key] !== expected[key], throw."
  ],
  resources: [
    { label: "MDN: Object.keys()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys", description: "Get an array of object keys" },
    { label: "MDN: for...of", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of", description: "Iterate over iterable objects" }
  ]
}));

testIds.push(ex({
  title: "Test a Calculator",
  type: "js",
  tier: 3,
  category: ["testing", "fundamentals"],
  tags: ["test-suite", "test-runner"],
  description: "Write a test suite for a calculator module that returns pass/fail results.",
  instructions: "A calculator object is provided with methods: `add(a,b)`, `subtract(a,b)`, `multiply(a,b)`, `divide(a,b)`.\n\nWrite a function `testCalculator(calc)` that returns an array of test result objects:\n```js\n{ pass: true/false, description: 'string describing the test' }\n```\n\nYour tests **must** cover:\n- Addition with positive numbers\n- Subtraction resulting in negative\n- Multiplication by zero\n- Division returning a decimal\n\n```js\nconst calc = { add: (a,b) => a+b, subtract: (a,b) => a-b, multiply: (a,b) => a*b, divide: (a,b) => a/b };\ntestCalculator(calc)\n// => [{pass: true, description: 'adds...'}, ...]\n```",
  starterCode: "function testCalculator(calc) {\n  const results = [];\n  // Add test results to the array\n  // Each: { pass: boolean, description: string }\n  return results;\n}",
  solution: "function testCalculator(calc) {\n  const results = [];\n  results.push({ pass: calc.add(2, 3) === 5, description: 'add: 2 + 3 = 5' });\n  results.push({ pass: calc.subtract(3, 5) === -2, description: 'subtract: 3 - 5 = -2' });\n  results.push({ pass: calc.multiply(4, 0) === 0, description: 'multiply: 4 * 0 = 0' });\n  results.push({ pass: calc.divide(7, 2) === 3.5, description: 'divide: 7 / 2 = 3.5' });\n  return results;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return testCalculator;')();
  const goodCalc = { add: (a,b) => a+b, subtract: (a,b) => a-b, multiply: (a,b) => a*b, divide: (a,b) => a/b };
  const badCalc = { add: (a,b) => a-b, subtract: (a,b) => a+b, multiply: (a,b) => a+b, divide: (a,b) => Math.floor(a/b) };
  const goodResults = fn(goodCalc);
  const badResults = fn(badCalc);
  const allGoodPass = goodResults.length >= 4 && goodResults.every(r => r.pass === true);
  const someBadFail = badResults.some(r => r.pass === false);
  const hasDescs = goodResults.every(r => typeof r.description === 'string' && r.description.length > 0);
  const coversOps = goodResults.length >= 4;
  return [
    { pass: allGoodPass, description: 'All tests pass for correct calculator', got: String(allGoodPass) },
    { pass: someBadFail, description: 'Some tests fail for buggy calculator', got: String(someBadFail) },
    { pass: hasDescs, description: 'All results have description strings', got: String(hasDescs) },
    { pass: coversOps, description: 'At least 4 tests covering different operations', got: String(coversOps) }
  ];
}`,
  hints: [
    "What does each calculator method do, and how can you verify the result is correct?",
    "Call each method with known inputs and compare the result to the expected value. Push { pass: result === expected, description } to the array.",
    "results.push({ pass: calc.add(2,3) === 5, description: 'adds 2+3' }). Do similar for subtract (negative result), multiply (by zero), divide (decimal result)."
  ],
  resources: [
    { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Add elements to end of array" },
    { label: "MDN: Strict equality", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality", description: "The === operator" }
  ]
}));

testIds.push(ex({
  title: "Test Edge Cases",
  type: "js",
  tier: 3,
  category: ["testing", "fundamentals"],
  tags: ["edge-cases", "test-coverage"],
  description: "Write tests that cover edge cases for a capitalize function.",
  instructions: "A `capitalize(str)` function is provided that should capitalize the first character of a string.\n\nWrite `testCapitalize(capitalize)` that returns an array of `{ pass, description }` test results covering these edge cases:\n- Empty string input\n- Single character\n- Already capitalized\n- String starting with a number\n- `null` or `undefined` input (should not throw)\n\n```js\ntestCapitalize(str => str ? str[0].toUpperCase() + str.slice(1) : '')\n// Should test all the edge cases above\n```",
  starterCode: "function testCapitalize(capitalize) {\n  const results = [];\n  // Test edge cases and push results\n  return results;\n}",
  solution: "function testCapitalize(capitalize) {\n  const results = [];\n  results.push({ pass: capitalize('') === '', description: 'empty string returns empty' });\n  results.push({ pass: capitalize('a') === 'A', description: 'single char is capitalized' });\n  results.push({ pass: capitalize('Hello') === 'Hello', description: 'already capitalized stays same' });\n  results.push({ pass: capitalize('3abc') === '3abc', description: 'string starting with number unchanged' });\n  let noThrow = true;\n  try { capitalize(null); } catch(e) { noThrow = false; }\n  results.push({ pass: noThrow, description: 'null input does not throw' });\n  return results;\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return testCapitalize;')();
  const goodCap = function(s) { if (s == null) return ''; if (s === '') return ''; return s[0].toUpperCase() + s.slice(1); };
  const badCap = function(s) { return s.toUpperCase(); };
  const goodRes = fn(goodCap);
  const badRes = fn(badCap);
  const allGoodPass = goodRes.length >= 5 && goodRes.every(r => r.pass === true);
  const someBadFail = badRes.some(r => r.pass === false);
  const hasEdge = goodRes.length >= 5;
  const hasDescs = goodRes.every(r => typeof r.description === 'string');
  return [
    { pass: allGoodPass, description: 'All tests pass for correct capitalize', got: String(allGoodPass) },
    { pass: someBadFail, description: 'Some tests fail for buggy capitalize', got: String(someBadFail) },
    { pass: hasEdge, description: 'At least 5 edge case tests', got: 'count: ' + goodRes.length },
    { pass: hasDescs, description: 'All results have descriptions', got: String(hasDescs) }
  ];
}`,
  hints: [
    "What happens when you call a function with unexpected inputs like empty strings, null, or numbers?",
    "Test each edge case: empty string, single char, already capitalized, numeric start, null. For null, wrap in try/catch.",
    "Push a result for each case. For null: let noThrow = true; try { capitalize(null) } catch(e) { noThrow = false }; push { pass: noThrow, ... }."
  ],
  resources: [
    { label: "MDN: String.prototype.toUpperCase()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase", description: "Convert string to uppercase" },
    { label: "MDN: try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", description: "Error handling" }
  ]
}));

testIds.push(ex({
  title: "Spy Function",
  type: "js",
  tier: 3,
  category: ["testing", "fundamentals"],
  tags: ["spies", "mocking", "higher-order"],
  description: "Implement a createSpy that wraps a function and tracks calls.",
  instructions: "Write a function `createSpy(fn)` that returns an object with:\n- `fn`: a wrapper function that calls the original and records the call\n- `calls`: an array of argument arrays (one per call)\n- `callCount()`: returns how many times it was called\n- `lastArgs()`: returns the arguments of the most recent call, or `undefined` if never called\n\n```js\nconst spy = createSpy((a, b) => a + b);\nspy.fn(1, 2);       // => 3\nspy.fn(3, 4);       // => 7\nspy.callCount();    // => 2\nspy.calls;          // => [[1,2], [3,4]]\nspy.lastArgs();     // => [3, 4]\n```",
  starterCode: "function createSpy(fn) {\n  // your code here\n}",
  solution: "function createSpy(fn) {\n  const calls = [];\n  return {\n    fn: function(...args) {\n      calls.push(args);\n      return fn(...args);\n    },\n    calls: calls,\n    callCount: function() { return calls.length; },\n    lastArgs: function() { return calls.length ? calls[calls.length - 1] : undefined; }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createSpy;')();
  const spy = fn((a, b) => a + b);
  const r0 = spy.callCount() === 0;
  const v1 = spy.fn(1, 2);
  const v2 = spy.fn(3, 4);
  const r1 = v1 === 3;
  const r2 = spy.callCount() === 2;
  const r3 = JSON.stringify(spy.calls) === '[[1,2],[3,4]]';
  const r4 = JSON.stringify(spy.lastArgs()) === '[3,4]';
  return [
    { pass: r0, description: 'callCount is 0 before any calls', got: String(r0) },
    { pass: r1, description: 'Wrapper returns original function result', got: String(v1) },
    { pass: r2 && r3, description: 'Tracks all calls with arguments', got: JSON.stringify(spy.calls) },
    { pass: r4, description: 'lastArgs returns most recent arguments', got: JSON.stringify(spy.lastArgs()) }
  ];
}`,
  hints: [
    "How can the wrapper function record each call while still returning the original result?",
    "Use a closure: store a `calls` array. The wrapper pushes its args onto the array, then calls and returns fn(...args).",
    "Return { fn: function(...args) { calls.push(args); return fn(...args); }, calls, callCount: () => calls.length, lastArgs: () => calls[calls.length-1] }."
  ],
  resources: [
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: Rest parameters", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters", description: "Gather arguments" },
    { label: "MDN: Spread syntax", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax", description: "Spread arguments" }
  ]
}));

testIds.push(ex({
  title: "Mini Test Framework",
  type: "js",
  tier: 4,
  category: ["testing", "fundamentals"],
  tags: ["test-framework", "closures", "design-patterns"],
  description: "Build a simple describe/it test runner that collects results.",
  instructions: "Write a function `createTestRunner()` that returns an object with:\n- `describe(suiteName, callback)` — groups tests under a suite name\n- `it(testName, callback)` — defines a test; callback should throw on failure\n- `run()` — returns an array of results:\n  ```js\n  { suite: 'suiteName', test: 'testName', pass: true/false, error: null/string }\n  ```\n\n```js\nconst t = createTestRunner();\nt.describe('Math', () => {\n  t.it('adds', () => { if (1+1 !== 2) throw new Error('bad'); });\n  t.it('fails', () => { throw new Error('oops'); });\n});\nt.run();\n// => [\n//   { suite: 'Math', test: 'adds', pass: true, error: null },\n//   { suite: 'Math', test: 'fails', pass: false, error: 'oops' }\n// ]\n```",
  starterCode: "function createTestRunner() {\n  // your code here\n}",
  solution: "function createTestRunner() {\n  const suites = [];\n  let currentSuite = null;\n  return {\n    describe: function(name, cb) {\n      currentSuite = { name: name, tests: [] };\n      suites.push(currentSuite);\n      cb();\n      currentSuite = null;\n    },\n    it: function(name, cb) {\n      if (currentSuite) {\n        currentSuite.tests.push({ name: name, cb: cb });\n      }\n    },\n    run: function() {\n      const results = [];\n      for (const suite of suites) {\n        for (const test of suite.tests) {\n          try {\n            test.cb();\n            results.push({ suite: suite.name, test: test.name, pass: true, error: null });\n          } catch (e) {\n            results.push({ suite: suite.name, test: test.name, pass: false, error: e.message || String(e) });\n          }\n        }\n      }\n      return results;\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createTestRunner;')();
  const t = fn();
  t.describe('Math', function() {
    t.it('1+1=2', function() { if (1+1 !== 2) throw new Error('bad math'); });
    t.it('fails', function() { throw new Error('oops'); });
  });
  t.describe('Strings', function() {
    t.it('concat', function() { if ('a'+'b' !== 'ab') throw new Error('bad'); });
  });
  const results = t.run();
  const r1 = results.length === 3;
  const r2 = results[0] && results[0].pass === true && results[0].suite === 'Math';
  const r3 = results[1] && results[1].pass === false && results[1].error === 'oops';
  const r4 = results[2] && results[2].suite === 'Strings' && results[2].pass === true;
  return [
    { pass: r1, description: 'Collects 3 test results', got: 'count: ' + results.length },
    { pass: r2, description: 'Passing test has pass:true and suite name', got: JSON.stringify(results[0]) },
    { pass: r3, description: 'Failing test has pass:false and error message', got: JSON.stringify(results[1]) },
    { pass: r4, description: 'Multiple suites tracked separately', got: JSON.stringify(results[2]) }
  ];
}`,
  hints: [
    "How can describe() know which tests belong to it if it() is called inside a callback?",
    "Use a currentSuite variable. describe() sets it, calls the callback (which registers tests), then clears it. it() pushes tests onto currentSuite.",
    "Store suites = []. describe(name, cb): create suite object, push to suites, call cb(). it(name, cb): push {name, cb} to current suite. run(): loop suites/tests, try/catch each callback."
  ],
  resources: [
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", description: "Error handling" },
    { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Add elements to an array" }
  ]
}));

// ═══════════════════════════════════════════════════════════════
// CURRICULUM 3: Module Systems  (6 exercises)
// ═══════════════════════════════════════════════════════════════
const moduleIds = [];

moduleIds.push(ex({
  title: "Revealing Module Pattern",
  type: "js",
  tier: 2,
  category: ["es6-plus", "modules"],
  tags: ["modules", "closures", "encapsulation"],
  description: "Create a counter module using closures with public methods.",
  instructions: "Write a function `createCounter(initial)` that returns an object with:\n- `increment()` — increases count by 1\n- `decrement()` — decreases count by 1\n- `getCount()` — returns current count\n\nThe count variable must be **private** (not directly accessible).\n\n```js\nconst c = createCounter(0);\nc.increment();\nc.increment();\nc.getCount()   // => 2\nc.decrement();\nc.getCount()   // => 1\n```",
  starterCode: "function createCounter(initial) {\n  // your code here\n}",
  solution: "function createCounter(initial) {\n  let count = initial || 0;\n  return {\n    increment: function() { count++; },\n    decrement: function() { count--; },\n    getCount: function() { return count; }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createCounter;')();
  const c = fn(0);
  c.increment(); c.increment();
  const r1 = c.getCount() === 2;
  c.decrement();
  const r2 = c.getCount() === 1;
  const c2 = fn(10);
  const r3 = c2.getCount() === 10;
  const r4 = c.count === undefined;
  return [
    { pass: r1, description: 'increment increases count', got: String(c.getCount()) },
    { pass: r2, description: 'decrement decreases count', got: String(c.getCount()) },
    { pass: r3, description: 'accepts initial value', got: String(c2.getCount()) },
    { pass: r4, description: 'count is private (not on object)', got: String(c.count) }
  ];
}`,
  hints: [
    "How can a function remember a variable after it returns?",
    "Declare `let count` inside the function. The returned methods form closures over it.",
    "let count = initial; return { increment() { count++; }, decrement() { count--; }, getCount() { return count; } };"
  ],
  resources: [
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: Object initializer", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer", description: "Creating objects with methods" }
  ]
}));

moduleIds.push(ex({
  title: "Namespace Object",
  type: "js",
  tier: 2,
  category: ["es6-plus", "modules"],
  tags: ["modules", "namespaces", "objects"],
  description: "Organize related math functions into a namespace object.",
  instructions: "Create a function `createMathUtils()` that returns an object with these methods:\n- `add(a, b)` — returns a + b\n- `subtract(a, b)` — returns a - b\n- `multiply(a, b)` — returns a * b\n- `divide(a, b)` — returns a / b (return `null` if b is 0)\n\n```js\nconst math = createMathUtils();\nmath.add(2, 3)       // => 5\nmath.subtract(10, 4) // => 6\nmath.multiply(3, 4)  // => 12\nmath.divide(10, 0)   // => null\n```",
  starterCode: "function createMathUtils() {\n  // your code here\n}",
  solution: "function createMathUtils() {\n  return {\n    add: function(a, b) { return a + b; },\n    subtract: function(a, b) { return a - b; },\n    multiply: function(a, b) { return a * b; },\n    divide: function(a, b) { return b === 0 ? null : a / b; }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createMathUtils;')();
  const m = fn();
  const r1 = m.add(2, 3) === 5;
  const r2 = m.subtract(10, 4) === 6;
  const r3 = m.multiply(3, 4) === 12;
  const r4 = m.divide(10, 2) === 5;
  const r5 = m.divide(10, 0) === null;
  return [
    { pass: r1, description: 'add works', got: String(m.add(2,3)) },
    { pass: r2, description: 'subtract works', got: String(m.subtract(10,4)) },
    { pass: r3, description: 'multiply works', got: String(m.multiply(3,4)) },
    { pass: r4 && r5, description: 'divide works and handles zero', got: 'div(10,2)=' + m.divide(10,2) + ', div(10,0)=' + m.divide(10,0) }
  ];
}`,
  hints: [
    "How do you group related functions together into a single variable?",
    "Return an object where each key is a method name and each value is a function.",
    "return { add(a,b) { return a+b }, subtract(a,b) { return a-b }, ... }; For divide, check if b === 0 first."
  ],
  resources: [
    { label: "MDN: Object", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object", description: "Object reference" },
    { label: "MDN: Method definitions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions", description: "Shorthand method syntax" }
  ]
}));

moduleIds.push(ex({
  title: "Factory Function",
  type: "js",
  tier: 2,
  category: ["es6-plus", "modules"],
  tags: ["factory", "closures", "encapsulation"],
  description: "Write a factory that creates user objects with private state.",
  instructions: "Write a function `createUser(name, email)` that returns an object with:\n- `getName()` — returns the name\n- `getEmail()` — returns the current email\n- `setEmail(newEmail)` — updates the email\n- `toJSON()` — returns `{ name, email }` object\n\nThe `name` and `email` should be **private** — not accessible as properties.\n\n```js\nconst user = createUser('Alice', 'alice@test.com');\nuser.getName()   // => 'Alice'\nuser.getEmail()  // => 'alice@test.com'\nuser.setEmail('a@new.com');\nuser.getEmail()  // => 'a@new.com'\nuser.name        // => undefined (private!)\n```",
  starterCode: "function createUser(name, email) {\n  // your code here\n}",
  solution: "function createUser(name, email) {\n  let _email = email;\n  return {\n    getName: function() { return name; },\n    getEmail: function() { return _email; },\n    setEmail: function(newEmail) { _email = newEmail; },\n    toJSON: function() { return { name: name, email: _email }; }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createUser;')();
  const u = fn('Alice', 'alice@test.com');
  const r1 = u.getName() === 'Alice';
  const r2 = u.getEmail() === 'alice@test.com';
  u.setEmail('a@new.com');
  const r3 = u.getEmail() === 'a@new.com';
  const r4 = u.name === undefined && u.email === undefined;
  const j = u.toJSON();
  const r5 = j.name === 'Alice' && j.email === 'a@new.com';
  return [
    { pass: r1, description: 'getName returns name', got: u.getName() },
    { pass: r2, description: 'getEmail returns initial email', got: 'alice@test.com' },
    { pass: r3, description: 'setEmail updates email', got: u.getEmail() },
    { pass: r4 && r5, description: 'State is private, toJSON works', got: JSON.stringify(j) }
  ];
}`,
  hints: [
    "How can you keep data private while still allowing controlled access?",
    "Use closure variables for name and email. Return an object with getter/setter methods that access those variables.",
    "let _email = email; return { getName() { return name; }, getEmail() { return _email; }, setEmail(e) { _email = e; }, toJSON() { return {name, email: _email} } };"
  ],
  resources: [
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: Object initializer", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer", description: "Creating objects" }
  ]
}));

moduleIds.push(ex({
  title: "Dependency Injection",
  type: "js",
  tier: 3,
  category: ["es6-plus", "modules"],
  tags: ["dependency-injection", "testability", "design-patterns"],
  description: "Write a function that accepts its dependencies as parameters.",
  instructions: "Write a function `createGreeter(formatter, logger)` where:\n- `formatter(name)` — a function that formats a greeting string\n- `logger(message)` — a function that logs the message\n\nThe returned object has:\n- `greet(name)` — calls `formatter(name)` to get the message, then calls `logger(message)`, and returns the message\n- `greetAll(names)` — greets each name in the array, returns array of messages\n\nBy accepting dependencies, the greeter is testable with any formatter/logger.\n\n```js\nconst g = createGreeter(n => 'Hello ' + n, msg => console.log(msg));\ng.greet('Alice')         // logs and returns 'Hello Alice'\ng.greetAll(['A', 'B'])  // returns ['Hello A', 'Hello B']\n```",
  starterCode: "function createGreeter(formatter, logger) {\n  // your code here\n}",
  solution: "function createGreeter(formatter, logger) {\n  return {\n    greet: function(name) {\n      const message = formatter(name);\n      logger(message);\n      return message;\n    },\n    greetAll: function(names) {\n      return names.map(function(name) {\n        const message = formatter(name);\n        logger(message);\n        return message;\n      });\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createGreeter;')();
  const logs = [];
  const g = fn(function(n) { return 'Hi ' + n; }, function(m) { logs.push(m); });
  const r1 = g.greet('Alice') === 'Hi Alice';
  const r2 = logs[0] === 'Hi Alice';
  const r3arr = g.greetAll(['Bob', 'Eve']);
  const r3 = JSON.stringify(r3arr) === '["Hi Bob","Hi Eve"]';
  const r4 = logs.length === 3;
  return [
    { pass: r1, description: 'greet returns formatted message', got: g.greet('Test') },
    { pass: r2, description: 'greet calls logger with message', got: String(logs[0]) },
    { pass: r3, description: 'greetAll returns array of messages', got: JSON.stringify(r3arr) },
    { pass: r4, description: 'logger called for each greet', got: 'log count: ' + logs.length }
  ];
}`,
  hints: [
    "Instead of hardcoding how greetings are formatted, what if someone else provided that function?",
    "The greeter doesn't create its own formatter or logger — it receives them as parameters. Just call formatter(name) and logger(message).",
    "return { greet(name) { const msg = formatter(name); logger(msg); return msg; }, greetAll(names) { return names.map(name => this.greet(name)); } };"
  ],
  resources: [
    { label: "MDN: Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", description: "JavaScript functions guide" },
    { label: "MDN: Array.prototype.map()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map", description: "Transform array elements" }
  ]
}));

moduleIds.push(ex({
  title: "Plugin System",
  type: "js",
  tier: 3,
  category: ["es6-plus", "modules"],
  tags: ["plugins", "registry", "composition"],
  description: "Create a system where you can register and execute plugins in order.",
  instructions: "Write a function `createPluginSystem()` that returns an object with:\n- `register(name, fn)` — adds a plugin function with the given name\n- `execute(input)` — runs all registered plugins in order, piping the output of each into the next. Returns the final result.\n- `list()` — returns an array of registered plugin names\n- `remove(name)` — removes a plugin by name\n\n```js\nconst ps = createPluginSystem();\nps.register('double', x => x * 2);\nps.register('addOne', x => x + 1);\nps.execute(5)   // => 11  (5*2=10, 10+1=11)\nps.list()       // => ['double', 'addOne']\nps.remove('double');\nps.execute(5)   // => 6   (5+1=6)\n```",
  starterCode: "function createPluginSystem() {\n  // your code here\n}",
  solution: "function createPluginSystem() {\n  const plugins = [];\n  return {\n    register: function(name, fn) {\n      plugins.push({ name: name, fn: fn });\n    },\n    execute: function(input) {\n      let result = input;\n      for (const plugin of plugins) {\n        result = plugin.fn(result);\n      }\n      return result;\n    },\n    list: function() {\n      return plugins.map(function(p) { return p.name; });\n    },\n    remove: function(name) {\n      const idx = plugins.findIndex(function(p) { return p.name === name; });\n      if (idx !== -1) plugins.splice(idx, 1);\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createPluginSystem;')();
  const ps = fn();
  ps.register('double', function(x) { return x * 2; });
  ps.register('addOne', function(x) { return x + 1; });
  const r1 = ps.execute(5) === 11;
  const r2 = JSON.stringify(ps.list()) === '["double","addOne"]';
  ps.remove('double');
  const r3 = ps.execute(5) === 6;
  const r4 = ps.list().length === 1;
  return [
    { pass: r1, description: 'Executes plugins in order (pipe)', got: String(ps.execute(5)) },
    { pass: r2, description: 'list() returns plugin names', got: JSON.stringify(ps.list()) },
    { pass: r3, description: 'remove() removes plugin', got: String(ps.execute(5)) },
    { pass: r4, description: 'list reflects removal', got: 'count: ' + ps.list().length }
  ];
}`,
  hints: [
    "How do you run a series of functions where each one's output feeds into the next?",
    "Store plugins as [{name, fn}]. Execute by reducing: start with input, call each fn in sequence.",
    "Use an array of {name, fn}. execute(input): loop plugins, result = plugin.fn(result). list(): map to names. remove(name): findIndex + splice."
  ],
  resources: [
    { label: "MDN: Array.prototype.findIndex()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex", description: "Find index of element matching condition" },
    { label: "MDN: Array.prototype.splice()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice", description: "Remove elements from array" }
  ]
}));

moduleIds.push(ex({
  title: "Service Locator",
  type: "js",
  tier: 4,
  category: ["es6-plus", "modules"],
  tags: ["service-locator", "registry", "design-patterns"],
  description: "Build a mini service registry where modules register and look up services.",
  instructions: "Write a function `createServiceLocator()` that returns an object with:\n- `register(name, factory)` — registers a service factory function (called lazily)\n- `get(name)` — returns the service instance. Calls the factory **once** on first access, then caches the result.\n- `has(name)` — returns `true` if a service is registered\n- `getAll()` — returns an object mapping names to their instances (only instantiates those not yet created)\n\n```js\nconst sl = createServiceLocator();\nlet created = 0;\nsl.register('db', () => { created++; return { query: () => 'data' }; });\nsl.has('db')      // => true\nsl.get('db')      // => { query: fn }  (created: 1)\nsl.get('db')      // same object       (created still 1)\n```",
  starterCode: "function createServiceLocator() {\n  // your code here\n}",
  solution: "function createServiceLocator() {\n  const factories = {};\n  const instances = {};\n  return {\n    register: function(name, factory) {\n      factories[name] = factory;\n    },\n    get: function(name) {\n      if (!factories[name]) return undefined;\n      if (!instances.hasOwnProperty(name)) {\n        instances[name] = factories[name]();\n      }\n      return instances[name];\n    },\n    has: function(name) {\n      return factories.hasOwnProperty(name);\n    },\n    getAll: function() {\n      const all = {};\n      for (const name in factories) {\n        all[name] = this.get(name);\n      }\n      return all;\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createServiceLocator;')();
  const sl = fn();
  let created = 0;
  sl.register('db', function() { created++; return { query: function() { return 'data'; } }; });
  sl.register('logger', function() { return { log: function(m) { return m; } }; });
  const r1 = sl.has('db') === true && sl.has('nope') === false;
  const db1 = sl.get('db');
  const c1 = created;
  const db2 = sl.get('db');
  const c2 = created;
  const r2 = db1 === db2 && c1 === 1 && c2 === 1;
  const r3 = db1.query() === 'data';
  const all = sl.getAll();
  const r4 = all.db === db1 && typeof all.logger.log === 'function';
  return [
    { pass: r1, description: 'has() checks registration', got: 'db:' + sl.has('db') + ' nope:' + sl.has('nope') },
    { pass: r2, description: 'get() caches instance (singleton)', got: 'same: ' + (db1===db2) + ', created: ' + c2 },
    { pass: r3, description: 'Service instance works', got: db1.query() },
    { pass: r4, description: 'getAll() returns all instances', got: Object.keys(all).join(',') }
  ];
}`,
  hints: [
    "How do you delay creating something until it is actually needed, then reuse it?",
    "Store factories separately from instances. On first get(), call the factory and cache the result. On subsequent gets, return the cached instance.",
    "Use two objects: factories and instances. register stores factory. get checks instances first; if missing, calls factory and stores result. has checks factories."
  ],
  resources: [
    { label: "MDN: hasOwnProperty", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty", description: "Check if object has own property" },
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" },
    { label: "MDN: for...in", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in", description: "Iterate over object properties" }
  ]
}));

// ═══════════════════════════════════════════════════════════════
// CURRICULUM 4: Web APIs  (8 exercises)
// ═══════════════════════════════════════════════════════════════
const webIds = [];

webIds.push(ex({
  title: "Mock localStorage",
  type: "js",
  tier: 2,
  category: ["web-apis", "storage"],
  tags: ["localStorage", "storage", "classes"],
  description: "Implement a Storage class with getItem, setItem, removeItem, and clear.",
  instructions: "Write a class `MockStorage` that mimics the `localStorage` API:\n- `setItem(key, value)` — stores a value (convert to string)\n- `getItem(key)` — returns the value, or `null` if not found\n- `removeItem(key)` — removes the key\n- `clear()` — removes all items\n- `length` — a getter returning the number of stored items\n\n```js\nconst s = new MockStorage();\ns.setItem('name', 'Alice');\ns.getItem('name')    // => 'Alice'\ns.length             // => 1\ns.setItem('age', 30);\ns.getItem('age')     // => '30' (converted to string!)\ns.removeItem('name');\ns.length             // => 1\ns.clear();\ns.length             // => 0\n```",
  starterCode: "class MockStorage {\n  constructor() {\n    // your code here\n  }\n\n  setItem(key, value) {}\n  getItem(key) {}\n  removeItem(key) {}\n  clear() {}\n  get length() {}\n}",
  solution: "class MockStorage {\n  constructor() {\n    this._store = {};\n  }\n\n  setItem(key, value) {\n    this._store[String(key)] = String(value);\n  }\n\n  getItem(key) {\n    const k = String(key);\n    return this._store.hasOwnProperty(k) ? this._store[k] : null;\n  }\n\n  removeItem(key) {\n    delete this._store[String(key)];\n  }\n\n  clear() {\n    this._store = {};\n  }\n\n  get length() {\n    return Object.keys(this._store).length;\n  }\n}",
  testRunner: `(code) => {
  const MS = new Function(code + '; return MockStorage;')();
  const s = new MS();
  s.setItem('name', 'Alice');
  const r1 = s.getItem('name') === 'Alice';
  s.setItem('age', 30);
  const r2 = s.getItem('age') === '30';
  const r3 = s.length === 2;
  s.removeItem('name');
  const r4 = s.getItem('name') === null && s.length === 1;
  s.clear();
  const r5 = s.length === 0;
  return [
    { pass: r1, description: 'setItem/getItem stores and retrieves', got: s.getItem('name') },
    { pass: r2, description: 'Values are converted to strings', got: typeof s.getItem('age') + ': ' + s.getItem('age') },
    { pass: r4, description: 'removeItem deletes key, getItem returns null', got: 'null:' + (s.getItem('name')===null) + ' len:' + s.length },
    { pass: r5, description: 'clear removes all items', got: 'length: ' + s.length }
  ];
}`,
  hints: [
    "What simple data structure could you use internally to store key-value pairs?",
    "Use a plain object as the store. Remember that real localStorage converts all values to strings.",
    "Use this._store = {}. setItem: this._store[key] = String(value). getItem: return store[key] or null. length: Object.keys(store).length."
  ],
  resources: [
    { label: "MDN: Web Storage API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API", description: "Using the Web Storage API" },
    { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript classes" },
    { label: "MDN: getter", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get", description: "Getter syntax" }
  ]
}));

webIds.push(ex({
  title: "URL Parser",
  type: "js",
  tier: 2,
  category: ["web-apis", "data"],
  tags: ["URL", "parsing", "strings"],
  description: "Parse a URL string into its component parts.",
  instructions: "Write a function `parseURL(urlString)` that takes a URL and returns an object:\n```js\n{ protocol, host, path, query }\n```\n\n- `protocol` — e.g. `'https'` (without the `://`)\n- `host` — e.g. `'example.com'`\n- `path` — e.g. `'/products/123'` (or `'/'` if none)\n- `query` — an object of key-value pairs (or `{}` if no query string)\n\n```js\nparseURL('https://example.com/search?q=hello&page=2')\n// => { protocol: 'https', host: 'example.com', path: '/search', query: { q: 'hello', page: '2' } }\n\nparseURL('http://site.com')\n// => { protocol: 'http', host: 'site.com', path: '/', query: {} }\n```",
  starterCode: "function parseURL(urlString) {\n  // your code here\n}",
  solution: "function parseURL(urlString) {\n  const protoEnd = urlString.indexOf('://');\n  const protocol = urlString.substring(0, protoEnd);\n  const rest = urlString.substring(protoEnd + 3);\n  const pathStart = rest.indexOf('/');\n  let host, pathAndQuery;\n  if (pathStart === -1) {\n    host = rest;\n    pathAndQuery = '/';\n  } else {\n    host = rest.substring(0, pathStart);\n    pathAndQuery = rest.substring(pathStart);\n  }\n  const qIdx = pathAndQuery.indexOf('?');\n  let urlPath, query = {};\n  if (qIdx === -1) {\n    urlPath = pathAndQuery;\n  } else {\n    urlPath = pathAndQuery.substring(0, qIdx);\n    const qs = pathAndQuery.substring(qIdx + 1);\n    qs.split('&').forEach(function(pair) {\n      const parts = pair.split('=');\n      query[parts[0]] = parts[1] || '';\n    });\n  }\n  return { protocol: protocol, host: host, path: urlPath, query: query };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return parseURL;')();
  const r1 = fn('https://example.com/search?q=hello&page=2');
  const r2 = fn('http://site.com');
  const r3 = fn('https://api.test.com/v1/users?id=42');
  return [
    { pass: r1.protocol === 'https' && r1.host === 'example.com', description: 'Parses protocol and host', got: r1.protocol + '://' + r1.host },
    { pass: r1.path === '/search' && r1.query.q === 'hello' && r1.query.page === '2', description: 'Parses path and query params', got: r1.path + ' q=' + r1.query.q },
    { pass: r2.path === '/' && JSON.stringify(r2.query) === '{}', description: 'Handles URL with no path or query', got: r2.path + ' query:' + JSON.stringify(r2.query) },
    { pass: r3.host === 'api.test.com' && r3.path === '/v1/users' && r3.query.id === '42', description: 'Parses subdomain and deep path', got: r3.host + r3.path }
  ];
}`,
  hints: [
    "What characters separate the different parts of a URL?",
    "Split on '://' to get protocol and the rest. Find '/' to split host from path. Find '?' to separate path from query string.",
    "Use indexOf('://') for protocol. Then indexOf('/') for path start. indexOf('?') for query. Split query on '&' and each pair on '='."
  ],
  resources: [
    { label: "MDN: String.prototype.indexOf()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf", description: "Find position of substring" },
    { label: "MDN: String.prototype.split()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split", description: "Split string into array" },
    { label: "MDN: URL", url: "https://developer.mozilla.org/en-US/docs/Web/API/URL", description: "URL Web API reference" }
  ]
}));

webIds.push(ex({
  title: "Query String Builder",
  type: "js",
  tier: 2,
  category: ["web-apis", "data"],
  tags: ["URL", "query-string", "objects"],
  description: "Convert an object into a URL query string.",
  instructions: "Write a function `buildQueryString(params)` that converts an object into a query string.\n\n- Prefix with `?`\n- Join key-value pairs with `&`\n- Handle empty object (return empty string `''`)\n- Convert values to strings\n\n```js\nbuildQueryString({ q: 'hello', page: 2 })        // => '?q=hello&page=2'\nbuildQueryString({ name: 'Alice' })                // => '?name=Alice'\nbuildQueryString({})                               // => ''\nbuildQueryString({ a: 1, b: true, c: 'test' })    // => '?a=1&b=true&c=test'\n```",
  starterCode: "function buildQueryString(params) {\n  // your code here\n}",
  solution: "function buildQueryString(params) {\n  const keys = Object.keys(params);\n  if (keys.length === 0) return '';\n  const pairs = keys.map(function(key) {\n    return key + '=' + String(params[key]);\n  });\n  return '?' + pairs.join('&');\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return buildQueryString;')();
  const r1 = fn({ q: 'hello', page: 2 });
  const r2 = fn({ name: 'Alice' });
  const r3 = fn({});
  const r4 = fn({ a: 1, b: true });
  return [
    { pass: r1 === '?q=hello&page=2', description: 'Multiple params with ? prefix', got: r1 },
    { pass: r2 === '?name=Alice', description: 'Single param', got: r2 },
    { pass: r3 === '', description: 'Empty object returns empty string', got: JSON.stringify(r3) },
    { pass: r4 === '?a=1&b=true', description: 'Converts values to strings', got: r4 }
  ];
}`,
  hints: [
    "How do you get all the keys from an object and combine them into a string?",
    "Use Object.keys() to get keys, then map each to 'key=value', then join with '&'.",
    "const keys = Object.keys(params); if (!keys.length) return ''; return '?' + keys.map(k => k+'='+params[k]).join('&');"
  ],
  resources: [
    { label: "MDN: Object.keys()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys", description: "Get array of object keys" },
    { label: "MDN: Array.prototype.join()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join", description: "Join array elements into string" }
  ]
}));

webIds.push(ex({
  title: "JSON Safe Parse",
  type: "js",
  tier: 2,
  category: ["web-apis", "data"],
  tags: ["JSON", "error-handling", "try-catch"],
  description: "Wrap JSON.parse to return a default value instead of throwing.",
  instructions: "Write a function `safeParse(jsonString, defaultValue)` that:\n- Tries to parse `jsonString` with `JSON.parse`\n- If successful, returns the parsed value\n- If it throws (invalid JSON), returns `defaultValue`\n\n```js\nsafeParse('{\"a\":1}', {})      // => { a: 1 }\nsafeParse('invalid', {})       // => {}\nsafeParse('[1,2,3]', [])       // => [1, 2, 3]\nsafeParse('', null)            // => null\nsafeParse('42', 0)             // => 42\n```",
  starterCode: "function safeParse(jsonString, defaultValue) {\n  // your code here\n}",
  solution: "function safeParse(jsonString, defaultValue) {\n  try {\n    return JSON.parse(jsonString);\n  } catch (e) {\n    return defaultValue;\n  }\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return safeParse;')();
  const r1 = fn('{"a":1}', {});
  const r2 = fn('invalid', {});
  const r3 = fn('[1,2,3]', []);
  const r4 = fn('', null);
  return [
    { pass: r1.a === 1, description: 'Parses valid JSON object', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '{}', description: 'Returns default for invalid JSON', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[1,2,3]', description: 'Parses valid JSON array', got: JSON.stringify(r3) },
    { pass: r4 === null, description: 'Returns null default for empty string', got: String(r4) }
  ];
}`,
  hints: [
    "How can you attempt something that might fail and handle the failure gracefully?",
    "Wrap JSON.parse in a try/catch block. Return the parsed result or the default.",
    "try { return JSON.parse(jsonString); } catch(e) { return defaultValue; }"
  ],
  resources: [
    { label: "MDN: JSON.parse()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse", description: "Parse JSON string" },
    { label: "MDN: try...catch", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", description: "Error handling" }
  ]
}));

webIds.push(ex({
  title: "Event Emitter",
  type: "js",
  tier: 3,
  category: ["web-apis", "data"],
  tags: ["events", "pub-sub", "classes"],
  description: "Build a simple EventEmitter class with on, off, and emit methods.",
  instructions: "Write a class `EventEmitter` with:\n- `on(event, callback)` — registers a listener for an event\n- `off(event, callback)` — removes a specific listener\n- `emit(event, ...args)` — calls all listeners for that event with the given args\n\n```js\nconst ee = new EventEmitter();\nconst handler = (msg) => console.log(msg);\nee.on('greet', handler);\nee.emit('greet', 'hello')  // logs 'hello'\nee.off('greet', handler);\nee.emit('greet', 'hello')  // nothing happens\n```",
  starterCode: "class EventEmitter {\n  constructor() {\n    // your code here\n  }\n\n  on(event, callback) {}\n  off(event, callback) {}\n  emit(event, ...args) {}\n}",
  solution: "class EventEmitter {\n  constructor() {\n    this._events = {};\n  }\n\n  on(event, callback) {\n    if (!this._events[event]) this._events[event] = [];\n    this._events[event].push(callback);\n  }\n\n  off(event, callback) {\n    if (!this._events[event]) return;\n    this._events[event] = this._events[event].filter(function(cb) { return cb !== callback; });\n  }\n\n  emit(event, ...args) {\n    if (!this._events[event]) return;\n    this._events[event].forEach(function(cb) { cb.apply(null, args); });\n  }\n}",
  testRunner: `(code) => {
  const EE = new Function(code + '; return EventEmitter;')();
  const ee = new EE();
  const results = [];
  const h1 = function(v) { results.push('h1:' + v); };
  const h2 = function(v) { results.push('h2:' + v); };
  ee.on('test', h1);
  ee.on('test', h2);
  ee.emit('test', 'a');
  const r1 = results.length === 2 && results[0] === 'h1:a' && results[1] === 'h2:a';
  ee.off('test', h1);
  ee.emit('test', 'b');
  const r2 = results.length === 3 && results[2] === 'h2:b';
  ee.emit('nope', 'c');
  const r3 = results.length === 3;
  const multi = [];
  ee.on('multi', function(a, b) { multi.push(a + b); });
  ee.emit('multi', 1, 2);
  const r4 = multi[0] === 3;
  return [
    { pass: r1, description: 'Multiple listeners fire in order', got: results.slice(0,2).join(', ') },
    { pass: r2, description: 'off() removes specific listener', got: results.slice(2).join(', ') },
    { pass: r3, description: 'Emitting unknown event does nothing', got: 'length: ' + results.length },
    { pass: r4, description: 'emit passes multiple arguments', got: String(multi[0]) }
  ];
}`,
  hints: [
    "How would you store multiple functions for the same event name?",
    "Use an object where keys are event names and values are arrays of callback functions.",
    "this._events = {}. on: push callback to events[event] array. off: filter out the callback. emit: forEach callback, call with args."
  ],
  resources: [
    { label: "MDN: EventTarget", url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget", description: "Browser event target interface" },
    { label: "MDN: Array.prototype.filter()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter", description: "Filter array elements" },
    { label: "MDN: Function.prototype.apply()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply", description: "Call function with args array" }
  ]
}));

webIds.push(ex({
  title: "Throttle",
  type: "js",
  tier: 3,
  category: ["web-apis", "data"],
  tags: ["throttle", "timing", "closures"],
  description: "Implement a throttle function that limits how often a function fires.",
  instructions: "Write a function `throttle(fn, delay)` that returns a throttled version of `fn`. The throttled function:\n- Calls `fn` immediately on the first invocation\n- Ignores subsequent calls within the `delay` window (in ms)\n- After the delay passes, the next call goes through\n\nUse `Date.now()` for timing (avoid `setTimeout` for testability).\n\n```js\nconst throttled = throttle(console.log, 1000);\nthrottled('a')  // logs 'a' immediately\nthrottled('b')  // ignored (within 1000ms)\n// ...after 1000ms...\nthrottled('c')  // logs 'c'\n```",
  starterCode: "function throttle(fn, delay) {\n  // your code here\n}",
  solution: "function throttle(fn, delay) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= delay) {\n      lastCall = now;\n      return fn.apply(this, args);\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return throttle;')();
  const calls = [];
  const t = fn(function(v) { calls.push(v); }, 100);
  t('a');
  const r1 = calls.length === 1 && calls[0] === 'a';
  t('b');
  const r2 = calls.length === 1;
  const origNow = Date.now;
  let fakeTime = Date.now();
  Date.now = function() { return fakeTime; };
  const calls2 = [];
  const t2 = fn(function(v) { calls2.push(v); }, 100);
  t2('x');
  t2('y');
  fakeTime += 101;
  t2('z');
  Date.now = origNow;
  const r3 = calls2.length === 2 && calls2[0] === 'x' && calls2[1] === 'z';
  const calls3 = [];
  const t3 = fn(function(a, b) { calls3.push(a + b); }, 50);
  t3(1, 2);
  const r4 = calls3[0] === 3;
  return [
    { pass: r1, description: 'First call executes immediately', got: calls.join(',') },
    { pass: r2, description: 'Subsequent call within delay is ignored', got: 'calls: ' + calls.length },
    { pass: r3, description: 'Call after delay passes executes', got: calls2.join(',') },
    { pass: r4, description: 'Arguments are passed through', got: String(calls3[0]) }
  ];
}`,
  hints: [
    "How can you track when the function was last called?",
    "Store the timestamp of the last call in a closure variable. Before calling fn, check if enough time has passed.",
    "let lastCall = 0; return function(...args) { const now = Date.now(); if (now - lastCall >= delay) { lastCall = now; return fn(...args); } };"
  ],
  resources: [
    { label: "MDN: Date.now()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now", description: "Get current timestamp in milliseconds" },
    { label: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", description: "Understanding closures" }
  ]
}));

webIds.push(ex({
  title: "Simple Router",
  type: "js",
  tier: 3,
  category: ["web-apis", "data"],
  tags: ["routing", "patterns", "design"],
  description: "Build a URL router that maps path patterns to handler functions.",
  instructions: "Write a function `createRouter()` that returns an object with:\n- `addRoute(path, handler)` — registers a handler for a path string\n- `match(url)` — finds the matching route and calls its handler. Returns the handler's return value, or `null` if no match.\n\nPaths are exact strings (no pattern matching needed).\n\n```js\nconst router = createRouter();\nrouter.addRoute('/home', () => 'Home Page');\nrouter.addRoute('/about', () => 'About Page');\nrouter.addRoute('/users', (q) => 'Users: ' + q);\n\nrouter.match('/home')     // => 'Home Page'\nrouter.match('/about')    // => 'About Page'\nrouter.match('/nope')     // => null\n```",
  starterCode: "function createRouter() {\n  // your code here\n}",
  solution: "function createRouter() {\n  const routes = {};\n  return {\n    addRoute: function(path, handler) {\n      routes[path] = handler;\n    },\n    match: function(url) {\n      if (routes.hasOwnProperty(url)) {\n        return routes[url]();\n      }\n      return null;\n    }\n  };\n}",
  testRunner: `(code) => {
  const fn = new Function(code + '; return createRouter;')();
  const r = fn();
  r.addRoute('/home', function() { return 'Home'; });
  r.addRoute('/about', function() { return 'About'; });
  r.addRoute('/api/data', function() { return 'Data'; });
  const r1 = r.match('/home') === 'Home';
  const r2 = r.match('/about') === 'About';
  const r3 = r.match('/nope') === null;
  const r4 = r.match('/api/data') === 'Data';
  return [
    { pass: r1, description: 'Matches /home route', got: String(r.match('/home')) },
    { pass: r2, description: 'Matches /about route', got: String(r.match('/about')) },
    { pass: r3, description: 'Returns null for unknown route', got: String(r.match('/nope')) },
    { pass: r4, description: 'Handles nested paths', got: String(r.match('/api/data')) }
  ];
}`,
  hints: [
    "How could you store a mapping from path strings to handler functions?",
    "Use a plain object where keys are paths and values are handler functions.",
    "routes = {}. addRoute: routes[path] = handler. match: if routes[url] exists, call and return it; else return null."
  ],
  resources: [
    { label: "MDN: Object", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object", description: "Object reference" },
    { label: "MDN: hasOwnProperty", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty", description: "Check if object has own property" }
  ]
}));

webIds.push(ex({
  title: "Request Cache",
  type: "js",
  tier: 4,
  category: ["web-apis", "data"],
  tags: ["caching", "TTL", "classes"],
  description: "Build a cache that stores responses by URL with TTL expiration.",
  instructions: "Write a class `RequestCache` that caches values with a time-to-live (TTL):\n- `constructor(defaultTTL)` — sets default TTL in milliseconds\n- `set(url, data, ttl?)` — caches data for url. Optional custom ttl overrides default.\n- `get(url)` — returns cached data if not expired, otherwise `null`\n- `has(url)` — returns `true` if url is cached and not expired\n- `clear()` — removes all entries\n- `size` — getter returning count of non-expired entries\n\nUse `Date.now()` for timing.\n\n```js\nconst cache = new RequestCache(1000);\ncache.set('/api/users', [{name:'A'}]);\ncache.get('/api/users')  // => [{name:'A'}]\ncache.has('/api/users')  // => true\n// ...after 1000ms...\ncache.get('/api/users')  // => null (expired)\n```",
  starterCode: "class RequestCache {\n  constructor(defaultTTL) {\n    // your code here\n  }\n\n  set(url, data, ttl) {}\n  get(url) {}\n  has(url) {}\n  clear() {}\n  get size() {}\n}",
  solution: "class RequestCache {\n  constructor(defaultTTL) {\n    this._defaultTTL = defaultTTL;\n    this._cache = {};\n  }\n\n  set(url, data, ttl) {\n    this._cache[url] = {\n      data: data,\n      expiry: Date.now() + (ttl !== undefined ? ttl : this._defaultTTL)\n    };\n  }\n\n  get(url) {\n    const entry = this._cache[url];\n    if (!entry) return null;\n    if (Date.now() > entry.expiry) {\n      delete this._cache[url];\n      return null;\n    }\n    return entry.data;\n  }\n\n  has(url) {\n    return this.get(url) !== null;\n  }\n\n  clear() {\n    this._cache = {};\n  }\n\n  get size() {\n    const now = Date.now();\n    let count = 0;\n    for (const url in this._cache) {\n      if (this._cache[url].expiry > now) count++;\n    }\n    return count;\n  }\n}",
  testRunner: `(code) => {
  const RC = new Function(code + '; return RequestCache;')();
  const origNow = Date.now;
  let fakeTime = origNow.call(Date);
  Date.now = function() { return fakeTime; };
  try {
    const c = new RC(100);
    c.set('/a', 'dataA');
    const r1 = c.get('/a') === 'dataA' && c.has('/a') === true;
    fakeTime += 50;
    const r2 = c.get('/a') === 'dataA';
    fakeTime += 60;
    const r3 = c.get('/a') === null && c.has('/a') === false;
    fakeTime = origNow.call(Date);
    const c2 = new RC(1000);
    c2.set('/x', 'x1');
    c2.set('/y', 'y1');
    const r4sz = c2.size === 2;
    c2.clear();
    const r4 = c2.size === 0;
    Date.now = origNow;
    return [
      { pass: r1, description: 'set/get/has works for cached data', got: String(r1) },
      { pass: r2, description: 'Data available before TTL expires', got: String(r2) },
      { pass: r3, description: 'Data expires after TTL', got: String(r3) },
      { pass: r4sz && r4, description: 'size counts entries, clear removes all', got: 'size before:2 after:' + c2.size }
    ];
  } finally {
    Date.now = origNow;
  }
}`,
  hints: [
    "What information do you need to store alongside each cached value to know when it expires?",
    "Store each entry as { data, expiry: Date.now() + ttl }. On get(), check if Date.now() > expiry.",
    "set: store { data, expiry: Date.now() + (ttl || defaultTTL) }. get: if entry exists and not expired return data, else null. size: count entries where expiry > now."
  ],
  resources: [
    { label: "MDN: Date.now()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now", description: "Get current timestamp" },
    { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript classes" },
    { label: "MDN: getter", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get", description: "Getter property syntax" }
  ]
}));


// ═══════════════════════════════════════════════════════════════
// UPDATE DATA: categories, collections, exercises
// ═══════════════════════════════════════════════════════════════

// Add new category children
if (!data.categories.algorithms.children.performance) {
  data.categories.algorithms.children.performance = { label: "Performance & Big O" };
}
if (!data.categories['testing']) {
  data.categories['testing'] = {
    label: "Testing",
    color: "#06b6d4",
    children: {
      assertions: { label: "Assertions" },
      fundamentals: { label: "Test Fundamentals" }
    }
  };
}
if (!data.categories['es6-plus'].children.modules) {
  data.categories['es6-plus'].children.modules = { label: "Module Patterns" };
}
if (!data.categories['web-apis']) {
  data.categories['web-apis'] = {
    label: "Web APIs",
    color: "#8b5cf6",
    children: {
      storage: { label: "Storage" },
      data: { label: "Data & Patterns" }
    }
  };
}

// Add new collections
data.collections.push({
  id: "performance-big-o",
  name: "Performance & Big O",
  description: "Learn to analyze and optimize algorithm efficiency",
  exerciseIds: perfIds,
  color: "#f43f5e"
});
data.collections.push({
  id: "testing-practices",
  name: "Testing Practices",
  description: "Write assertions, test suites, spies, and a mini test framework",
  exerciseIds: testIds,
  color: "#06b6d4"
});
data.collections.push({
  id: "module-systems",
  name: "Module Patterns",
  description: "Closures, factories, dependency injection, and service registries",
  exerciseIds: moduleIds,
  color: "#fb923c"
});
data.collections.push({
  id: "web-apis",
  name: "Web APIs & Patterns",
  description: "Storage, events, routing, throttling, and caching patterns",
  exerciseIds: webIds,
  color: "#8b5cf6"
});

// Append exercises
data.exercises.push(...newExercises);

// ═══════════════════════════════════════════════════════════════
// VALIDATE: run every testRunner against its solution
// ═══════════════════════════════════════════════════════════════
console.log('\n=== Validating test runners against solutions ===\n');
let failures = 0;
let passes = 0;

async function validate() {
  for (const exercise of newExercises) {
    try {
      const testFn = new Function('return (' + exercise.testRunner + ')')();
      const result = testFn(exercise.solution);
      // Handle both sync and async test runners
      const results = result && typeof result.then === 'function' ? await result : result;
      const allPass = results.every(r => r.pass);
      if (!allPass) {
        failures++;
        console.log('FAIL: [' + exercise.id + '] ' + exercise.title);
        results.filter(r => !r.pass).forEach(r => {
          console.log('  - ' + r.description + ' (got: ' + r.got + ')');
        });
      } else {
        passes++;
        console.log('PASS: [' + exercise.id + '] ' + exercise.title + ' (' + results.length + ' tests)');
      }
    } catch (e) {
      failures++;
      console.log('ERROR: [' + exercise.id + '] ' + exercise.title + ': ' + e.message);
    }
  }

  console.log('\n=== Results: ' + passes + ' passed, ' + failures + ' failed ===\n');

  if (failures > 0) {
    console.log('FIX FAILURES BEFORE WRITING!');
    process.exit(1);
  }

  // Write the updated file
  fs.writeFileSync(EXERCISES_PATH, JSON.stringify(data, null, 2) + '\n');

  console.log('=== Summary ===');
  console.log('New exercises added: ' + newExercises.length);
  console.log('ID range: 407 - ' + (406 + newExercises.length));
  console.log('');
  console.log('Curricula:');
  console.log('  1. Performance & Big O: ' + perfIds.length + ' exercises (IDs ' + perfIds.join(', ') + ')');
  console.log('  2. Testing Practices:   ' + testIds.length + ' exercises (IDs ' + testIds.join(', ') + ')');
  console.log('  3. Module Patterns:     ' + moduleIds.length + ' exercises (IDs ' + moduleIds.join(', ') + ')');
  console.log('  4. Web APIs & Patterns: ' + webIds.length + ' exercises (IDs ' + webIds.join(', ') + ')');
  console.log('');
  console.log('New categories added: algorithms/performance, testing, es6-plus/modules, web-apis');
  console.log('New collections added: performance-big-o, testing-practices, module-systems, web-apis');
  console.log('\nTotal exercises now: ' + data.exercises.length);
}

validate();
