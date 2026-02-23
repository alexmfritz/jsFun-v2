/**
 * Add Algorithms category and 29 new exercises (IDs 297-325)
 *
 * New category: algorithms
 *   - sorting (297-301)
 *   - searching (302-304)
 *   - recursion (305-309)
 *   - patterns (310-317)
 *
 * Additional data-structures exercises:
 *   - arrays (318-320)
 *   - strings (321-323)
 *   - objects (324-325)
 *
 * Also:
 *   - Adds algorithms category to data.categories
 *   - Updates default-curriculum collection with all new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── ADD ALGORITHMS CATEGORY ──────────────────────────────────────────────────

data.categories['algorithms'] = {
  label: 'Algorithms',
  color: '#f43f5e',
  children: {
    sorting: { label: 'Sorting' },
    searching: { label: 'Searching' },
    recursion: { label: 'Recursion' },
    patterns: { label: 'Patterns' },
  },
};

console.log('  Added algorithms category');

// ─── EXERCISES ────────────────────────────────────────────────────────────────

const newExercises = [

  // ═══════════════════════════════════════════════════════════════════════════
  // algorithms/sorting (297-301)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 297: Bubble Sort ────────────────────────────────────────────────────
  {
    id: 297,
    title: 'Bubble Sort',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'sorting'],
    tags: ['sorting', 'algorithms', 'nested-loops', 'tier2'],
    description: 'Implement the bubble sort algorithm to sort an array of numbers in ascending order.',
    instructions: `Write a function called \`bubbleSort\` that takes an array of numbers and returns a new sorted array in ascending order using the bubble sort algorithm.\n\nBubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. This pass through the list is repeated until the list is sorted.\n\nExamples:\n  bubbleSort([3, 1, 2])        → [1, 2, 3]\n  bubbleSort([5, 3, 8, 4, 2])  → [2, 3, 4, 5, 8]\n  bubbleSort([])               → []\n  bubbleSort([1])              → [1]`,
    starterCode: `function bubbleSort(arr) {\n\n}`,
    solution: `function bubbleSort(arr) {\n  const result = [...arr];\n  for (let i = 0; i < result.length; i++) {\n    for (let j = 0; j < result.length - 1 - i; j++) {\n      if (result[j] > result[j + 1]) {\n        const temp = result[j];\n        result[j] = result[j + 1];\n        result[j + 1] = temp;\n      }\n    }\n  }\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return bubbleSort;')();\n  return [\n    { pass: JSON.stringify(fn([3, 1, 2])) === '[1,2,3]', description: 'bubbleSort([3,1,2]) → [1,2,3]', got: JSON.stringify(fn([3, 1, 2])) },\n    { pass: JSON.stringify(fn([5, 3, 8, 4, 2])) === '[2,3,4,5,8]', description: 'bubbleSort([5,3,8,4,2]) → [2,3,4,5,8]', got: JSON.stringify(fn([5, 3, 8, 4, 2])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'bubbleSort([]) → []', got: JSON.stringify(fn([])) },\n    { pass: JSON.stringify(fn([1])) === '[1]', description: 'bubbleSort([1]) → [1]', got: JSON.stringify(fn([1])) },\n    { pass: JSON.stringify(fn([1, 2, 3])) === '[1,2,3]', description: 'already sorted [1,2,3] → [1,2,3]', got: JSON.stringify(fn([1, 2, 3])) },\n    { pass: (() => { const orig = [3,1,2]; fn(orig); return JSON.stringify(orig) === '[3,1,2]'; })(), description: 'does not mutate the original array', got: 'checked' },\n  ];\n}`,
    hint: 'Make a copy of the array first. Use two nested loops: the outer loop runs n times, the inner loop compares adjacent elements and swaps them if out of order. After each outer pass, the largest unsorted element "bubbles" to the end.',
    resources: [
      { label: 'Visualgo: Sorting', url: 'https://visualgo.net/en/sorting' },
      { label: 'Wikipedia: Bubble Sort', url: 'https://en.wikipedia.org/wiki/Bubble_sort' },
    ],
  },

  // ── 298: Selection Sort ─────────────────────────────────────────────────
  {
    id: 298,
    title: 'Selection Sort',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'sorting'],
    tags: ['sorting', 'algorithms', 'nested-loops', 'tier2'],
    description: 'Implement the selection sort algorithm to sort an array of numbers in ascending order.',
    instructions: `Write a function called \`selectionSort\` that takes an array of numbers and returns a new sorted array in ascending order using the selection sort algorithm.\n\nSelection sort works by finding the minimum element from the unsorted part and placing it at the beginning. It maintains two sub-arrays: the sorted portion (left) and the unsorted portion (right).\n\nExamples:\n  selectionSort([64, 25, 12, 22, 11]) → [11, 12, 22, 25, 64]\n  selectionSort([3, 1, 2])             → [1, 2, 3]\n  selectionSort([])                    → []\n  selectionSort([1])                   → [1]`,
    starterCode: `function selectionSort(arr) {\n\n}`,
    solution: `function selectionSort(arr) {\n  const result = [...arr];\n  for (let i = 0; i < result.length; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < result.length; j++) {\n      if (result[j] < result[minIdx]) {\n        minIdx = j;\n      }\n    }\n    if (minIdx !== i) {\n      const temp = result[i];\n      result[i] = result[minIdx];\n      result[minIdx] = temp;\n    }\n  }\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return selectionSort;')();\n  return [\n    { pass: JSON.stringify(fn([64, 25, 12, 22, 11])) === '[11,12,22,25,64]', description: 'selectionSort([64,25,12,22,11]) → [11,12,22,25,64]', got: JSON.stringify(fn([64, 25, 12, 22, 11])) },\n    { pass: JSON.stringify(fn([3, 1, 2])) === '[1,2,3]', description: 'selectionSort([3,1,2]) → [1,2,3]', got: JSON.stringify(fn([3, 1, 2])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'selectionSort([]) → []', got: JSON.stringify(fn([])) },\n    { pass: JSON.stringify(fn([1])) === '[1]', description: 'selectionSort([1]) → [1]', got: JSON.stringify(fn([1])) },\n    { pass: JSON.stringify(fn([5, 5, 5])) === '[5,5,5]', description: 'handles duplicates [5,5,5] → [5,5,5]', got: JSON.stringify(fn([5, 5, 5])) },\n  ];\n}`,
    hint: 'Copy the array. For each position i, scan the rest of the array to find the minimum value. Swap it into position i. Repeat for the next position.',
    resources: [
      { label: 'Visualgo: Sorting', url: 'https://visualgo.net/en/sorting' },
      { label: 'Wikipedia: Selection Sort', url: 'https://en.wikipedia.org/wiki/Selection_sort' },
    ],
  },

  // ── 299: Sort by Custom Comparator ──────────────────────────────────────
  {
    id: 299,
    title: 'Sort by Custom Comparator',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'sorting'],
    tags: ['sorting', 'callbacks', 'higher-order', 'tier2'],
    description: 'Sort an array using a custom comparison function, without mutating the original.',
    instructions: `Write a function called \`sortBy\` that takes an array and a comparator function, and returns a new sorted array.\n\nThe comparator function works like Array.sort's compare function: it receives two elements (a, b) and returns a negative number if a should come first, positive if b should come first, or 0 if equal.\n\nExamples:\n  sortBy([3, 1, 2], (a, b) => a - b)  → [1, 2, 3]  (ascending)\n  sortBy(['hello', 'hi', 'hey'], (a, b) => a.length - b.length) → ['hi', 'hey', 'hello']\n  sortBy([{ age: 30 }, { age: 20 }], (a, b) => a.age - b.age) → [{ age: 20 }, { age: 30 }]\n  sortBy([], (a, b) => a - b) → []`,
    starterCode: `function sortBy(arr, compareFn) {\n\n}`,
    solution: `function sortBy(arr, compareFn) {\n  return arr.slice().sort(compareFn);\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return sortBy;')();\n  return [\n    { pass: JSON.stringify(fn([3, 1, 2], (a, b) => a - b)) === '[1,2,3]', description: 'sort numbers ascending', got: JSON.stringify(fn([3, 1, 2], (a, b) => a - b)) },\n    { pass: JSON.stringify(fn(['hello', 'hi', 'hey'], (a, b) => a.length - b.length)) === '["hi","hey","hello"]', description: 'sort strings by length', got: JSON.stringify(fn(['hello', 'hi', 'hey'], (a, b) => a.length - b.length)) },\n    { pass: JSON.stringify(fn([{ age: 30 }, { age: 20 }], (a, b) => a.age - b.age)) === '[{"age":20},{"age":30}]', description: 'sort objects by property', got: JSON.stringify(fn([{ age: 30 }, { age: 20 }], (a, b) => a.age - b.age)) },\n    { pass: JSON.stringify(fn([], (a, b) => a - b)) === '[]', description: 'empty array → []', got: JSON.stringify(fn([], (a, b) => a - b)) },\n    { pass: (() => { const orig = [3,1,2]; fn(orig, (a,b) => a-b); return JSON.stringify(orig) === '[3,1,2]'; })(), description: 'does not mutate original array', got: 'checked' },\n  ];\n}`,
    hint: 'Use arr.slice() to create a copy of the array, then call .sort() on the copy with the provided comparator function.',
    resources: [
      { label: 'MDN: Array.prototype.sort()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort' },
    ],
  },

  // ── 300: Merge Sort ─────────────────────────────────────────────────────
  {
    id: 300,
    title: 'Merge Sort',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'sorting'],
    tags: ['sorting', 'algorithms', 'recursion', 'divide-and-conquer', 'tier3'],
    description: 'Implement the merge sort algorithm — a divide-and-conquer approach to sorting.',
    instructions: `Write a function called \`mergeSort\` that takes an array of numbers and returns a new sorted array in ascending order using the merge sort algorithm.\n\nMerge sort works by:\n1. Splitting the array in half recursively until you have single-element arrays\n2. Merging the sorted halves back together\n\nYou may want to write a helper function \`merge(left, right)\` that merges two sorted arrays into one sorted array.\n\nExamples:\n  mergeSort([38, 27, 43, 3, 9, 82, 10]) → [3, 9, 10, 27, 38, 43, 82]\n  mergeSort([5, 3, 8, 4, 2])             → [2, 3, 4, 5, 8]\n  mergeSort([])                          → []\n  mergeSort([1])                         → [1]\n  mergeSort([2, 1])                      → [1, 2]`,
    starterCode: `function mergeSort(arr) {\n  // Base case: arrays of length 0 or 1 are already sorted\n\n  // Split the array in half\n\n  // Recursively sort each half\n\n  // Merge the two sorted halves\n}`,
    solution: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0;\n  let j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) {\n      result.push(left[i]);\n      i++;\n    } else {\n      result.push(right[j]);\n      j++;\n    }\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return mergeSort;')();\n  return [\n    { pass: JSON.stringify(fn([38, 27, 43, 3, 9, 82, 10])) === '[3,9,10,27,38,43,82]', description: 'mergeSort([38,27,43,3,9,82,10]) → sorted', got: JSON.stringify(fn([38, 27, 43, 3, 9, 82, 10])) },\n    { pass: JSON.stringify(fn([5, 3, 8, 4, 2])) === '[2,3,4,5,8]', description: 'mergeSort([5,3,8,4,2]) → [2,3,4,5,8]', got: JSON.stringify(fn([5, 3, 8, 4, 2])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'mergeSort([]) → []', got: JSON.stringify(fn([])) },\n    { pass: JSON.stringify(fn([1])) === '[1]', description: 'mergeSort([1]) → [1]', got: JSON.stringify(fn([1])) },\n    { pass: JSON.stringify(fn([2, 1])) === '[1,2]', description: 'mergeSort([2,1]) → [1,2]', got: JSON.stringify(fn([2, 1])) },\n    { pass: JSON.stringify(fn([5, 5, 3, 3, 1])) === '[1,3,3,5,5]', description: 'handles duplicates', got: JSON.stringify(fn([5, 5, 3, 3, 1])) },\n  ];\n}`,
    hint: 'Split the problem into two parts: (1) a mergeSort function that recursively splits, and (2) a merge helper that combines two sorted arrays element by element using two pointers.',
    resources: [
      { label: 'Visualgo: Sorting', url: 'https://visualgo.net/en/sorting' },
      { label: 'Wikipedia: Merge Sort', url: 'https://en.wikipedia.org/wiki/Merge_sort' },
    ],
  },

  // ── 301: Quick Sort ─────────────────────────────────────────────────────
  {
    id: 301,
    title: 'Quick Sort',
    type: 'js',
    tier: 4,
    category: ['algorithms', 'sorting'],
    tags: ['sorting', 'algorithms', 'recursion', 'divide-and-conquer', 'tier4'],
    description: 'Implement the quick sort algorithm — pick a pivot, partition, and recursively sort.',
    instructions: `Write a function called \`quickSort\` that takes an array of numbers and returns a new sorted array in ascending order using the quick sort algorithm.\n\nQuick sort works by:\n1. Choosing a pivot element (e.g., the last element)\n2. Partitioning the array into elements less than the pivot and elements greater than the pivot\n3. Recursively sorting the partitions\n4. Combining: [...left, pivot, ...right]\n\nExamples:\n  quickSort([10, 7, 8, 9, 1, 5]) → [1, 5, 7, 8, 9, 10]\n  quickSort([3, 1, 2])            → [1, 2, 3]\n  quickSort([])                   → []\n  quickSort([1])                  → [1]`,
    starterCode: `function quickSort(arr) {\n  // your code here\n}`,
    solution: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n\n  const pivot = arr[arr.length - 1];\n  const left = [];\n  const right = [];\n\n  for (let i = 0; i < arr.length - 1; i++) {\n    if (arr[i] < pivot) {\n      left.push(arr[i]);\n    } else {\n      right.push(arr[i]);\n    }\n  }\n\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return quickSort;')();\n  return [\n    { pass: JSON.stringify(fn([10, 7, 8, 9, 1, 5])) === '[1,5,7,8,9,10]', description: 'quickSort([10,7,8,9,1,5]) → sorted', got: JSON.stringify(fn([10, 7, 8, 9, 1, 5])) },\n    { pass: JSON.stringify(fn([3, 1, 2])) === '[1,2,3]', description: 'quickSort([3,1,2]) → [1,2,3]', got: JSON.stringify(fn([3, 1, 2])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'quickSort([]) → []', got: JSON.stringify(fn([])) },\n    { pass: JSON.stringify(fn([1])) === '[1]', description: 'quickSort([1]) → [1]', got: JSON.stringify(fn([1])) },\n    { pass: JSON.stringify(fn([4, 2, 7, 1, 9, 3, 6, 5, 8])) === '[1,2,3,4,5,6,7,8,9]', description: 'sorts a larger array correctly', got: JSON.stringify(fn([4, 2, 7, 1, 9, 3, 6, 5, 8])) },\n    { pass: JSON.stringify(fn([3, 3, 3, 1, 1])) === '[1,1,3,3,3]', description: 'handles duplicates', got: JSON.stringify(fn([3, 3, 3, 1, 1])) },\n  ];\n}`,
    hint: 'Base case: arrays with 0 or 1 elements are sorted. Pick the last element as pivot. Loop through the rest, pushing elements less than pivot into a left array and the rest into a right array. Return [...quickSort(left), pivot, ...quickSort(right)].',
    resources: [
      { label: 'Visualgo: Sorting', url: 'https://visualgo.net/en/sorting' },
      { label: 'Wikipedia: Quick Sort', url: 'https://en.wikipedia.org/wiki/Quicksort' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // algorithms/searching (302-304)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 302: Binary Search ──────────────────────────────────────────────────
  {
    id: 302,
    title: 'Binary Search',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'searching'],
    tags: ['searching', 'algorithms', 'binary-search', 'tier2'],
    description: 'Implement binary search on a sorted array — return the index of the target or -1 if not found.',
    instructions: `Write a function called \`binarySearch\` that takes a sorted array of numbers and a target value, and returns the index of the target in the array. If the target is not found, return -1.\n\nBinary search works by repeatedly dividing the search interval in half:\n1. Compare the target with the middle element\n2. If the target matches, return the index\n3. If the target is less, search the left half\n4. If the target is greater, search the right half\n\nExamples:\n  binarySearch([1, 3, 5, 7, 9, 11], 7)   → 3\n  binarySearch([1, 3, 5, 7, 9, 11], 4)   → -1\n  binarySearch([1, 3, 5, 7, 9, 11], 1)   → 0\n  binarySearch([1, 3, 5, 7, 9, 11], 11)  → 5\n  binarySearch([], 5)                    → -1`,
    starterCode: `function binarySearch(arr, target) {\n\n}`,
    solution: `function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return binarySearch;')();\n  return [\n    { pass: fn([1, 3, 5, 7, 9, 11], 7) === 3, description: 'finds 7 at index 3', got: fn([1, 3, 5, 7, 9, 11], 7) },\n    { pass: fn([1, 3, 5, 7, 9, 11], 4) === -1, description: 'returns -1 when not found', got: fn([1, 3, 5, 7, 9, 11], 4) },\n    { pass: fn([1, 3, 5, 7, 9, 11], 1) === 0, description: 'finds first element at index 0', got: fn([1, 3, 5, 7, 9, 11], 1) },\n    { pass: fn([1, 3, 5, 7, 9, 11], 11) === 5, description: 'finds last element at index 5', got: fn([1, 3, 5, 7, 9, 11], 11) },\n    { pass: fn([], 5) === -1, description: 'empty array returns -1', got: fn([], 5) },\n    { pass: fn([42], 42) === 0, description: 'single element found', got: fn([42], 42) },\n  ];\n}`,
    hint: 'Use two pointers (left and right). While left <= right, find the middle index. Compare arr[mid] to target: if equal, return mid. If target is larger, move left to mid + 1. If smaller, move right to mid - 1.',
    resources: [
      { label: 'Wikipedia: Binary Search', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' },
      { label: 'MDN: Math.floor()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor' },
    ],
  },

  // ── 303: Binary Search — First Occurrence ───────────────────────────────
  {
    id: 303,
    title: 'Binary Search — First Occurrence',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'searching'],
    tags: ['searching', 'algorithms', 'binary-search', 'tier3'],
    description: 'Find the first occurrence of a target in a sorted array with duplicates.',
    instructions: `Write a function called \`firstOccurrence\` that takes a sorted array (which may contain duplicates) and a target value. Return the index of the FIRST occurrence of the target, or -1 if not found.\n\nThis is a modification of binary search: when you find the target, instead of returning immediately, continue searching left to see if there is an earlier occurrence.\n\nExamples:\n  firstOccurrence([1, 2, 2, 2, 3, 4], 2) → 1\n  firstOccurrence([1, 1, 1, 1], 1)        → 0\n  firstOccurrence([1, 2, 3, 4, 5], 3)     → 2\n  firstOccurrence([1, 2, 3, 4, 5], 6)     → -1\n  firstOccurrence([], 1)                  → -1`,
    starterCode: `function firstOccurrence(arr, target) {\n  // Modified binary search: when you find target,\n  // keep searching left for an earlier occurrence\n}`,
    solution: `function firstOccurrence(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  let result = -1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      result = mid;\n      right = mid - 1;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return firstOccurrence;')();\n  return [\n    { pass: fn([1, 2, 2, 2, 3, 4], 2) === 1, description: 'first of [1,2,2,2,3,4] target 2 → index 1', got: fn([1, 2, 2, 2, 3, 4], 2) },\n    { pass: fn([1, 1, 1, 1], 1) === 0, description: 'all same [1,1,1,1] target 1 → index 0', got: fn([1, 1, 1, 1], 1) },\n    { pass: fn([1, 2, 3, 4, 5], 3) === 2, description: 'no duplicates, target 3 → index 2', got: fn([1, 2, 3, 4, 5], 3) },\n    { pass: fn([1, 2, 3, 4, 5], 6) === -1, description: 'not found → -1', got: fn([1, 2, 3, 4, 5], 6) },\n    { pass: fn([], 1) === -1, description: 'empty array → -1', got: fn([], 1) },\n    { pass: fn([2, 2, 2, 2, 2], 2) === 0, description: 'all duplicates → index 0', got: fn([2, 2, 2, 2, 2], 2) },\n  ];\n}`,
    hint: 'Use a standard binary search, but instead of returning immediately when you find the target, save the index in a result variable and continue searching left (set right = mid - 1) to find an earlier occurrence.',
    resources: [
      { label: 'Wikipedia: Binary Search', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' },
    ],
  },

  // ── 304: Search in Rotated Sorted Array ─────────────────────────────────
  {
    id: 304,
    title: 'Search in Rotated Sorted Array',
    type: 'js',
    tier: 4,
    category: ['algorithms', 'searching'],
    tags: ['searching', 'algorithms', 'binary-search', 'tier4'],
    description: 'Search for a target in a sorted array that has been rotated at some pivot.',
    instructions: `Write a function called \`searchRotated\` that takes a rotated sorted array and a target value, and returns the index of the target or -1 if not found.\n\nA rotated sorted array is a sorted array that has been shifted: e.g., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2].\n\nYou must solve this in O(log n) time using a modified binary search.\n\nKey insight: at any mid point, at least one half of the array is still sorted. Determine which half is sorted, then check if the target falls within that sorted half.\n\nExamples:\n  searchRotated([4, 5, 6, 7, 0, 1, 2], 0) → 4\n  searchRotated([4, 5, 6, 7, 0, 1, 2], 3) → -1\n  searchRotated([1], 1)                    → 0\n  searchRotated([2, 1], 1)                 → 1`,
    starterCode: `function searchRotated(nums, target) {\n  // your code here\n}`,
    solution: `function searchRotated(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n\n    if (nums[left] <= nums[mid]) {\n      if (target >= nums[left] && target < nums[mid]) {\n        right = mid - 1;\n      } else {\n        left = mid + 1;\n      }\n    } else {\n      if (target > nums[mid] && target <= nums[right]) {\n        left = mid + 1;\n      } else {\n        right = mid - 1;\n      }\n    }\n  }\n\n  return -1;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return searchRotated;')();\n  return [\n    { pass: fn([4, 5, 6, 7, 0, 1, 2], 0) === 4, description: 'find 0 in [4,5,6,7,0,1,2] → index 4', got: fn([4, 5, 6, 7, 0, 1, 2], 0) },\n    { pass: fn([4, 5, 6, 7, 0, 1, 2], 3) === -1, description: '3 not found → -1', got: fn([4, 5, 6, 7, 0, 1, 2], 3) },\n    { pass: fn([1], 1) === 0, description: 'single element found → 0', got: fn([1], 1) },\n    { pass: fn([2, 1], 1) === 1, description: '[2,1] find 1 → index 1', got: fn([2, 1], 1) },\n    { pass: fn([4, 5, 6, 7, 0, 1, 2], 5) === 1, description: 'find 5 in left sorted half → index 1', got: fn([4, 5, 6, 7, 0, 1, 2], 5) },\n    { pass: fn([], 1) === -1, description: 'empty array → -1', got: fn([], 1) },\n  ];\n}`,
    hint: 'At each step, check which half is sorted by comparing nums[left] to nums[mid]. If the left half is sorted and target is within [left, mid), search left. Otherwise search right. Same logic applies if the right half is sorted.',
    resources: [
      { label: 'LeetCode: Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // algorithms/recursion (305-309)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 305: Sum of Nested Array ────────────────────────────────────────────
  {
    id: 305,
    title: 'Sum of Nested Array',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'arrays', 'tier2'],
    description: 'Recursively sum all numbers in a deeply nested array structure.',
    instructions: `Write a function called \`sumNested\` that takes an array which may contain numbers and/or nested arrays, and returns the sum of all numbers at any depth.\n\nExamples:\n  sumNested([1, [2, [3]], 4])  → 10\n  sumNested([1, 2, 3])         → 6\n  sumNested([[[[5]]]])         → 5\n  sumNested([])                → 0\n  sumNested([1, [2, 3], [4, [5, 6]]]) → 21`,
    starterCode: `function sumNested(arr) {\n\n}`,
    solution: `function sumNested(arr) {\n  let sum = 0;\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      sum += sumNested(item);\n    } else {\n      sum += item;\n    }\n  }\n  return sum;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return sumNested;')();\n  return [\n    { pass: fn([1, [2, [3]], 4]) === 10, description: 'sumNested([1,[2,[3]],4]) → 10', got: fn([1, [2, [3]], 4]) },\n    { pass: fn([1, 2, 3]) === 6, description: 'flat array [1,2,3] → 6', got: fn([1, 2, 3]) },\n    { pass: fn([[[[5]]]]) === 5, description: 'deeply nested [[[[5]]]] → 5', got: fn([[[[5]]]]) },\n    { pass: fn([]) === 0, description: 'empty array → 0', got: fn([]) },\n    { pass: fn([1, [2, 3], [4, [5, 6]]]) === 21, description: 'mixed nesting → 21', got: fn([1, [2, 3], [4, [5, 6]]]) },\n  ];\n}`,
    hint: 'Loop through each element. If it is an array (Array.isArray), recursively call sumNested on it and add the result. If it is a number, add it directly to the sum.',
    resources: [
      { label: 'MDN: Array.isArray()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray' },
      { label: 'MDN: Recursion', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Recursion' },
    ],
  },

  // ── 306: Fibonacci ──────────────────────────────────────────────────────
  {
    id: 306,
    title: 'Fibonacci',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'math', 'dynamic-programming', 'tier2'],
    description: 'Return the nth Fibonacci number (0-indexed).',
    instructions: `Write a function called \`fibonacci\` that takes a non-negative integer n and returns the nth Fibonacci number.\n\nThe Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...\n- fib(0) = 0\n- fib(1) = 1\n- fib(n) = fib(n-1) + fib(n-2)\n\nYou can use either a recursive or iterative approach.\n\nExamples:\n  fibonacci(0)  → 0\n  fibonacci(1)  → 1\n  fibonacci(6)  → 8\n  fibonacci(10) → 55`,
    starterCode: `function fibonacci(n) {\n\n}`,
    solution: `function fibonacci(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  let prev = 0;\n  let curr = 1;\n  for (let i = 2; i <= n; i++) {\n    const next = prev + curr;\n    prev = curr;\n    curr = next;\n  }\n  return curr;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return fibonacci;')();\n  return [\n    { pass: fn(0) === 0, description: 'fibonacci(0) → 0', got: fn(0) },\n    { pass: fn(1) === 1, description: 'fibonacci(1) → 1', got: fn(1) },\n    { pass: fn(6) === 8, description: 'fibonacci(6) → 8', got: fn(6) },\n    { pass: fn(10) === 55, description: 'fibonacci(10) → 55', got: fn(10) },\n    { pass: fn(2) === 1, description: 'fibonacci(2) → 1', got: fn(2) },\n    { pass: fn(7) === 13, description: 'fibonacci(7) → 13', got: fn(7) },\n  ];\n}`,
    hint: 'Iterative approach: start with prev=0, curr=1. Loop from 2 to n, each time computing next = prev + curr, then shift prev=curr and curr=next. Return curr.',
    resources: [
      { label: 'Wikipedia: Fibonacci Number', url: 'https://en.wikipedia.org/wiki/Fibonacci_number' },
    ],
  },

  // ── 307: Power (Recursive) ──────────────────────────────────────────────
  {
    id: 307,
    title: 'Power (Recursive)',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'math', 'tier3'],
    description: 'Calculate base raised to an exponent using recursion.',
    instructions: `Write a function called \`power\` that takes a base and an exponent (non-negative integer) and returns the result using recursion.\n\nBase case: any number to the power of 0 is 1.\nRecursive case: base * power(base, exp - 1)\n\nExamples:\n  power(2, 3)  → 8\n  power(5, 0)  → 1\n  power(3, 4)  → 81\n  power(10, 1) → 10`,
    starterCode: `function power(base, exp) {\n  // Base case: any number to the power of 0 is 1\n  // Recursive case: base * power(base, exp - 1)\n}`,
    solution: `function power(base, exp) {\n  if (exp === 0) return 1;\n  return base * power(base, exp - 1);\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return power;')();\n  return [\n    { pass: fn(2, 3) === 8, description: 'power(2, 3) → 8', got: fn(2, 3) },\n    { pass: fn(5, 0) === 1, description: 'power(5, 0) → 1', got: fn(5, 0) },\n    { pass: fn(3, 4) === 81, description: 'power(3, 4) → 81', got: fn(3, 4) },\n    { pass: fn(10, 1) === 10, description: 'power(10, 1) → 10', got: fn(10, 1) },\n    { pass: fn(1, 100) === 1, description: 'power(1, 100) → 1', got: fn(1, 100) },\n    { pass: fn(2, 10) === 1024, description: 'power(2, 10) → 1024', got: fn(2, 10) },\n  ];\n}`,
    hint: 'Base case: if exp is 0, return 1. Otherwise, return base multiplied by the result of power(base, exp - 1). This reduces the exponent by 1 each time until it reaches 0.',
    resources: [
      { label: 'MDN: Recursion', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Recursion' },
    ],
  },

  // ── 308: Permutations ───────────────────────────────────────────────────
  {
    id: 308,
    title: 'Permutations',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'backtracking', 'arrays', 'tier3'],
    description: 'Generate all possible orderings (permutations) of an array.',
    instructions: `Write a function called \`permutations\` that takes an array of distinct elements and returns an array of all possible orderings (permutations).\n\nFor each element, combine it with all permutations of the remaining elements.\n\nExamples:\n  permutations([1, 2, 3]) → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]  (6 permutations)\n  permutations([1, 2])    → [[1,2],[2,1]]\n  permutations([1])       → [[1]]\n  permutations([])        → [[]]`,
    starterCode: `function permutations(arr) {\n  // Build all orderings of the input array\n  // Hint: for each element, combine it with permutations of the rest\n}`,
    solution: `function permutations(arr) {\n  if (arr.length === 0) return [[]];\n  if (arr.length === 1) return [[arr[0]]];\n\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    const current = arr[i];\n    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];\n    const perms = permutations(rest);\n    for (const perm of perms) {\n      result.push([current, ...perm]);\n    }\n  }\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return permutations;')();\n  const r3 = fn([1, 2, 3]);\n  const r2 = fn([1, 2]);\n  const r1 = fn([1]);\n  const r0 = fn([]);\n  return [\n    { pass: r3.length === 6, description: 'permutations([1,2,3]) has 6 results', got: r3.length },\n    { pass: r3.some(p => JSON.stringify(p) === '[1,2,3]') && r3.some(p => JSON.stringify(p) === '[3,2,1]'), description: 'includes [1,2,3] and [3,2,1]', got: 'checked' },\n    { pass: JSON.stringify(r2.sort()) === '[[1,2],[2,1]]', description: 'permutations([1,2]) → [[1,2],[2,1]]', got: JSON.stringify(r2.sort()) },\n    { pass: JSON.stringify(r1) === '[[1]]', description: 'permutations([1]) → [[1]]', got: JSON.stringify(r1) },\n    { pass: JSON.stringify(r0) === '[[]]', description: 'permutations([]) → [[]]', got: JSON.stringify(r0) },\n  ];\n}`,
    hint: 'Base case: empty array returns [[]]. For each element at index i, take it out of the array, recursively find all permutations of the remaining elements, then prepend the current element to each of those permutations.',
    resources: [
      { label: 'Wikipedia: Permutation', url: 'https://en.wikipedia.org/wiki/Permutation' },
    ],
  },

  // ── 309: Generate Parentheses ───────────────────────────────────────────
  {
    id: 309,
    title: 'Generate Parentheses',
    type: 'js',
    tier: 4,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'backtracking', 'strings', 'tier4'],
    description: 'Generate all valid combinations of n pairs of parentheses.',
    instructions: `Write a function called \`generateParens\` that takes a number n and returns an array of all valid combinations of n pairs of parentheses.\n\nUse backtracking: track how many open and close parentheses have been used. You can add an open paren if open < n, and a close paren if close < open.\n\nExamples:\n  generateParens(1) → ["()"]\n  generateParens(2) → ["(())", "()()"]\n  generateParens(3) → ["((()))", "(()())", "(())()", "()(())", "()()()"]\n  generateParens(0) → [""]`,
    starterCode: `function generateParens(n) {\n  // your code here\n}`,
    solution: `function generateParens(n) {\n  const result = [];\n\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + '(', open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ')', open, close + 1);\n    }\n  }\n\n  backtrack('', 0, 0);\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return generateParens;')();\n  const r1 = fn(1);\n  const r2 = fn(2);\n  const r3 = fn(3);\n  const r0 = fn(0);\n  return [\n    { pass: JSON.stringify(r1) === '["()"]', description: 'generateParens(1) → ["()"]', got: JSON.stringify(r1) },\n    { pass: r2.length === 2 && r2.includes('(())') && r2.includes('()()'), description: 'generateParens(2) → ["(())", "()()"]', got: JSON.stringify(r2) },\n    { pass: r3.length === 5, description: 'generateParens(3) has 5 combinations', got: r3.length },\n    { pass: r3.includes('((()))') && r3.includes('()()()'), description: 'generateParens(3) includes ((()))" and "()()()"', got: JSON.stringify(r3) },\n    { pass: JSON.stringify(r0) === '[""]', description: 'generateParens(0) → [""]', got: JSON.stringify(r0) },\n  ];\n}`,
    hint: 'Use a recursive helper function backtrack(current, openCount, closeCount). Base case: when current.length === 2*n, push to result. You can add "(" if openCount < n. You can add ")" if closeCount < openCount.',
    resources: [
      { label: 'LeetCode: Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // algorithms/patterns (310-317)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 310: Two Sum ────────────────────────────────────────────────────────
  {
    id: 310,
    title: 'Two Sum',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'patterns'],
    tags: ['hash-map', 'algorithms', 'arrays', 'tier2'],
    description: 'Find two numbers in an array that add up to a target and return their indices.',
    instructions: `Write a function called \`twoSum\` that takes an array of numbers and a target sum. Return an array of the two indices whose values add up to the target.\n\nAssume exactly one solution exists. Use a hash map (object or Map) for O(n) time complexity.\n\nExamples:\n  twoSum([2, 7, 11, 15], 9)  → [0, 1]  (2 + 7 = 9)\n  twoSum([3, 2, 4], 6)       → [1, 2]  (2 + 4 = 6)\n  twoSum([3, 3], 6)          → [0, 1]  (3 + 3 = 6)`,
    starterCode: `function twoSum(nums, target) {\n\n}`,
    solution: `function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.hasOwnProperty(complement)) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return twoSum;')();\n  return [\n    { pass: JSON.stringify(fn([2, 7, 11, 15], 9)) === '[0,1]', description: 'twoSum([2,7,11,15], 9) → [0,1]', got: JSON.stringify(fn([2, 7, 11, 15], 9)) },\n    { pass: JSON.stringify(fn([3, 2, 4], 6)) === '[1,2]', description: 'twoSum([3,2,4], 6) → [1,2]', got: JSON.stringify(fn([3, 2, 4], 6)) },\n    { pass: JSON.stringify(fn([3, 3], 6)) === '[0,1]', description: 'twoSum([3,3], 6) → [0,1]', got: JSON.stringify(fn([3, 3], 6)) },\n    { pass: JSON.stringify(fn([1, 5, 3, 7], 8)) === '[1,2]' || JSON.stringify(fn([1, 5, 3, 7], 8)) === '[0,3]', description: 'twoSum([1,5,3,7], 8) → valid pair', got: JSON.stringify(fn([1, 5, 3, 7], 8)) },\n  ];\n}`,
    hint: 'As you iterate, for each number compute the complement (target - num). Check if the complement is already in your map. If yes, return [map[complement], currentIndex]. If not, store the current number and its index in the map.',
    resources: [
      { label: 'LeetCode: Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
    ],
  },

  // ── 311: Valid Anagram ──────────────────────────────────────────────────
  {
    id: 311,
    title: 'Valid Anagram',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'patterns'],
    tags: ['hash-map', 'strings', 'frequency-counter', 'tier2'],
    description: 'Determine if two strings are anagrams of each other.',
    instructions: `Write a function called \`isAnagram\` that takes two strings and returns \`true\` if they are anagrams (contain the same characters with the same frequencies), \`false\` otherwise.\n\nExamples:\n  isAnagram("anagram", "nagaram") → true\n  isAnagram("rat", "car")         → false\n  isAnagram("", "")               → true\n  isAnagram("a", "ab")            → false`,
    starterCode: `function isAnagram(s, t) {\n\n}`,
    solution: `function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const freq = {};\n  for (const ch of s) {\n    freq[ch] = (freq[ch] || 0) + 1;\n  }\n  for (const ch of t) {\n    if (!freq[ch]) return false;\n    freq[ch]--;\n  }\n  return true;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return isAnagram;')();\n  return [\n    { pass: fn('anagram', 'nagaram') === true, description: '"anagram" / "nagaram" → true', got: fn('anagram', 'nagaram') },\n    { pass: fn('rat', 'car') === false, description: '"rat" / "car" → false', got: fn('rat', 'car') },\n    { pass: fn('', '') === true, description: 'empty strings → true', got: fn('', '') },\n    { pass: fn('a', 'ab') === false, description: 'different lengths → false', got: fn('a', 'ab') },\n    { pass: fn('listen', 'silent') === true, description: '"listen" / "silent" → true', got: fn('listen', 'silent') },\n  ];\n}`,
    hint: 'First check if lengths differ — if so, return false. Build a frequency map from the first string. Then iterate over the second string, decrementing counts. If any character is missing or count goes below zero, they are not anagrams.',
    resources: [
      { label: 'LeetCode: Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/' },
    ],
  },

  // ── 312: Move Zeroes ────────────────────────────────────────────────────
  {
    id: 312,
    title: 'Move Zeroes',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'patterns'],
    tags: ['two-pointer', 'arrays', 'tier2'],
    description: 'Move all zeroes to the end of an array while maintaining the relative order of non-zero elements.',
    instructions: `Write a function called \`moveZeroes\` that takes an array of numbers and returns a new array with all zeroes moved to the end, while maintaining the relative order of the non-zero elements.\n\nExamples:\n  moveZeroes([0, 1, 0, 3, 12]) → [1, 3, 12, 0, 0]\n  moveZeroes([0])              → [0]\n  moveZeroes([1, 2, 3])        → [1, 2, 3]\n  moveZeroes([0, 0, 1])        → [1, 0, 0]`,
    starterCode: `function moveZeroes(arr) {\n\n}`,
    solution: `function moveZeroes(arr) {\n  const nonZeroes = arr.filter(x => x !== 0);\n  const zeroes = new Array(arr.length - nonZeroes.length).fill(0);\n  return [...nonZeroes, ...zeroes];\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return moveZeroes;')();\n  return [\n    { pass: JSON.stringify(fn([0, 1, 0, 3, 12])) === '[1,3,12,0,0]', description: 'moveZeroes([0,1,0,3,12]) → [1,3,12,0,0]', got: JSON.stringify(fn([0, 1, 0, 3, 12])) },\n    { pass: JSON.stringify(fn([0])) === '[0]', description: 'moveZeroes([0]) → [0]', got: JSON.stringify(fn([0])) },\n    { pass: JSON.stringify(fn([1, 2, 3])) === '[1,2,3]', description: 'no zeroes → unchanged', got: JSON.stringify(fn([1, 2, 3])) },\n    { pass: JSON.stringify(fn([0, 0, 1])) === '[1,0,0]', description: 'moveZeroes([0,0,1]) → [1,0,0]', got: JSON.stringify(fn([0, 0, 1])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'empty array → []', got: JSON.stringify(fn([])) },\n  ];\n}`,
    hint: 'One approach: filter out all non-zero elements, then pad the result with zeroes to match the original length. Or use a two-pointer technique: one pointer for the next non-zero position.',
    resources: [
      { label: 'LeetCode: Move Zeroes', url: 'https://leetcode.com/problems/move-zeroes/' },
    ],
  },

  // ── 313: Three Sum ──────────────────────────────────────────────────────
  {
    id: 313,
    title: 'Three Sum',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'patterns'],
    tags: ['two-pointer', 'sorting', 'arrays', 'tier3'],
    description: 'Find all unique triplets in an array that sum to zero.',
    instructions: `Write a function called \`threeSum\` that takes an array of numbers and returns an array of all unique triplets [a, b, c] where a + b + c = 0.\n\nThe solution should not contain duplicate triplets. Sort each triplet in ascending order.\n\nHint: Sort the array first, then for each element, use a two-pointer approach on the remaining elements.\n\nExamples:\n  threeSum([-1, 0, 1, 2, -1, -4]) → [[-1, -1, 2], [-1, 0, 1]]\n  threeSum([0, 0, 0])              → [[0, 0, 0]]\n  threeSum([1, 2, -3])             → [[-3, 1, 2]]\n  threeSum([])                     → []`,
    starterCode: `function threeSum(nums) {\n  // Find all unique triplets that sum to zero\n  // Hint: sort first, then use two-pointer for each element\n}`,
    solution: `function threeSum(nums) {\n  const result = [];\n  nums.sort((a, b) => a - b);\n\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n    let left = i + 1;\n    let right = nums.length - 1;\n\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return threeSum;')();\n  const r1 = fn([-1, 0, 1, 2, -1, -4]);\n  const r2 = fn([0, 0, 0]);\n  const r3 = fn([1, 2, -3]);\n  const r4 = fn([]);\n  return [\n    { pass: r1.length === 2 && JSON.stringify(r1).includes('[-1,-1,2]') && JSON.stringify(r1).includes('[-1,0,1]'), description: 'threeSum([-1,0,1,2,-1,-4]) → [[-1,-1,2],[-1,0,1]]', got: JSON.stringify(r1) },\n    { pass: JSON.stringify(r2) === '[[0,0,0]]', description: 'threeSum([0,0,0]) → [[0,0,0]]', got: JSON.stringify(r2) },\n    { pass: r3.length === 1 && JSON.stringify(r3[0]) === '[-3,1,2]', description: 'threeSum([1,2,-3]) → [[-3,1,2]]', got: JSON.stringify(r3) },\n    { pass: JSON.stringify(r4) === '[]', description: 'threeSum([]) → []', got: JSON.stringify(r4) },\n    { pass: fn([1, 2, 3]).length === 0, description: 'no valid triplets → []', got: JSON.stringify(fn([1, 2, 3])) },\n  ];\n}`,
    hint: 'Sort the array. Loop through each element as the first number. Skip duplicates. For the remaining elements, use two pointers (left and right). If the sum is 0, add the triplet and skip duplicates. If sum < 0, move left pointer right. If sum > 0, move right pointer left.',
    resources: [
      { label: 'LeetCode: 3Sum', url: 'https://leetcode.com/problems/3sum/' },
    ],
  },

  // ── 314: Sliding Window Maximum Sum ─────────────────────────────────────
  {
    id: 314,
    title: 'Sliding Window Maximum Sum',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'patterns'],
    tags: ['sliding-window', 'arrays', 'tier3'],
    description: 'Find the maximum sum of k consecutive elements in an array.',
    instructions: `Write a function called \`maxSubarraySum\` that takes an array of numbers and a window size k, and returns the maximum sum of any k consecutive elements.\n\nUse the sliding window technique: compute the sum of the first k elements, then slide the window by subtracting the element that leaves and adding the element that enters.\n\nReturn 0 if the array is empty or k is larger than the array.\n\nExamples:\n  maxSubarraySum([2, 1, 5, 1, 3, 2], 3) → 9  (5 + 1 + 3)\n  maxSubarraySum([1, 2, 3, 4, 5], 2)    → 9  (4 + 5)\n  maxSubarraySum([4], 1)                → 4\n  maxSubarraySum([], 3)                 → 0`,
    starterCode: `function maxSubarraySum(arr, k) {\n  // Find the maximum sum of k consecutive elements\n  // Hint: compute first window, then slide\n}`,
    solution: `function maxSubarraySum(arr, k) {\n  if (arr.length === 0 || k > arr.length) return 0;\n\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) {\n    windowSum += arr[i];\n  }\n\n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum = windowSum + arr[i] - arr[i - k];\n    if (windowSum > maxSum) maxSum = windowSum;\n  }\n\n  return maxSum;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return maxSubarraySum;')();\n  return [\n    { pass: fn([2, 1, 5, 1, 3, 2], 3) === 9, description: 'maxSubarraySum([2,1,5,1,3,2], 3) → 9', got: fn([2, 1, 5, 1, 3, 2], 3) },\n    { pass: fn([1, 2, 3, 4, 5], 2) === 9, description: 'maxSubarraySum([1,2,3,4,5], 2) → 9', got: fn([1, 2, 3, 4, 5], 2) },\n    { pass: fn([4], 1) === 4, description: 'single element window → 4', got: fn([4], 1) },\n    { pass: fn([], 3) === 0, description: 'empty array → 0', got: fn([], 3) },\n    { pass: fn([1, 2], 5) === 0, description: 'k > array length → 0', got: fn([1, 2], 5) },\n    { pass: fn([3, 3, 3, 3], 2) === 6, description: 'all same values → 6', got: fn([3, 3, 3, 3], 2) },\n  ];\n}`,
    hint: 'First compute the sum of the first k elements. Then slide the window: for each new position, add the new element entering the window and subtract the element leaving. Track the maximum sum seen.',
    resources: [
      { label: 'Sliding Window Technique', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' },
    ],
  },

  // ── 315: Longest Substring Without Repeating Characters ─────────────────
  {
    id: 315,
    title: 'Longest Substring Without Repeating Characters',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'patterns'],
    tags: ['sliding-window', 'hash-map', 'strings', 'tier3'],
    description: 'Find the length of the longest substring without any repeating characters.',
    instructions: `Write a function called \`lengthOfLongestSubstring\` that takes a string and returns the length of the longest substring without repeating characters.\n\nUse a sliding window with a Set to track characters in the current window.\n\nExamples:\n  lengthOfLongestSubstring("abcabcbb") → 3  ("abc")\n  lengthOfLongestSubstring("bbbbb")    → 1  ("b")\n  lengthOfLongestSubstring("pwwkew")   → 3  ("wke")\n  lengthOfLongestSubstring("")         → 0\n  lengthOfLongestSubstring("abcdef")   → 6`,
    starterCode: `function lengthOfLongestSubstring(s) {\n  // Use a sliding window with a Set to track characters\n}`,
    solution: `function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0;\n  let maxLen = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[left]);\n      left++;\n    }\n    seen.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n\n  return maxLen;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return lengthOfLongestSubstring;')();\n  return [\n    { pass: fn('abcabcbb') === 3, description: '"abcabcbb" → 3', got: fn('abcabcbb') },\n    { pass: fn('bbbbb') === 1, description: '"bbbbb" → 1', got: fn('bbbbb') },\n    { pass: fn('pwwkew') === 3, description: '"pwwkew" → 3', got: fn('pwwkew') },\n    { pass: fn('') === 0, description: 'empty string → 0', got: fn('') },\n    { pass: fn('abcdef') === 6, description: '"abcdef" → 6 (all unique)', got: fn('abcdef') },\n    { pass: fn('aab') === 2, description: '"aab" → 2', got: fn('aab') },\n  ];\n}`,
    hint: 'Use two pointers (left and right) and a Set. Expand right pointer. If the character at right is already in the Set, shrink from the left until it is removed. Add the right character to the Set and update max length.',
    resources: [
      { label: 'LeetCode: Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    ],
  },

  // ── 316: Product of Array Except Self ───────────────────────────────────
  {
    id: 316,
    title: 'Product of Array Except Self',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'patterns'],
    tags: ['arrays', 'prefix-product', 'tier3'],
    description: 'Return an array where each element is the product of all other elements, without using division.',
    instructions: `Write a function called \`productExceptSelf\` that takes an array of numbers and returns an array where each element at index i is the product of all numbers in the original array except the one at index i.\n\nYou must solve this WITHOUT using division.\n\nHint: Use two passes — one for prefix products (left to right) and one for suffix products (right to left).\n\nExamples:\n  productExceptSelf([1, 2, 3, 4])       → [24, 12, 8, 6]\n  productExceptSelf([2, 3])             → [3, 2]\n  productExceptSelf([-1, 1, 0, -3, 3]) → [0, 0, 9, 0, 0]`,
    starterCode: `function productExceptSelf(nums) {\n  // Build result without using division\n  // Hint: use prefix and suffix products\n}`,
    solution: `function productExceptSelf(nums) {\n  const n = nums.length;\n  const result = new Array(n).fill(1);\n\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    result[i] = prefix;\n    prefix *= nums[i];\n  }\n\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    result[i] *= suffix;\n    suffix *= nums[i];\n  }\n\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return productExceptSelf;')();\n  return [\n    { pass: JSON.stringify(fn([1, 2, 3, 4])) === '[24,12,8,6]', description: 'productExceptSelf([1,2,3,4]) → [24,12,8,6]', got: JSON.stringify(fn([1, 2, 3, 4])) },\n    { pass: JSON.stringify(fn([2, 3])) === '[3,2]', description: 'productExceptSelf([2,3]) → [3,2]', got: JSON.stringify(fn([2, 3])) },\n    { pass: JSON.stringify(fn([-1, 1, 0, -3, 3])) === '[0,0,9,0,0]', description: 'handles zeroes and negatives', got: JSON.stringify(fn([-1, 1, 0, -3, 3])) },\n    { pass: JSON.stringify(fn([5])) === '[1]', description: 'single element → [1]', got: JSON.stringify(fn([5])) },\n  ];\n}`,
    hint: 'Two passes: First, left-to-right, store the running product of everything BEFORE each index. Second, right-to-left, multiply each position by the running product of everything AFTER it.',
    resources: [
      { label: 'LeetCode: Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    ],
  },

  // ── 317: Container With Most Water ──────────────────────────────────────
  {
    id: 317,
    title: 'Container With Most Water',
    type: 'js',
    tier: 4,
    category: ['algorithms', 'patterns'],
    tags: ['two-pointer', 'arrays', 'greedy', 'tier4'],
    description: 'Find two lines that together with the x-axis form a container that holds the most water.',
    instructions: `Write a function called \`maxArea\` that takes an array of non-negative integers representing heights of vertical lines. Find two lines that, together with the x-axis, form a container that holds the most water.\n\nThe area is calculated as: min(height[left], height[right]) * (right - left)\n\nUse the two-pointer technique: start with the widest container, then move the shorter wall inward.\n\nExamples:\n  maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) → 49\n  maxArea([1, 1])                       → 1\n  maxArea([4, 3, 2, 1, 4])              → 16\n  maxArea([1, 2, 1])                    → 2`,
    starterCode: `function maxArea(height) {\n  // your code here\n}`,
    solution: `function maxArea(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let max = 0;\n\n  while (left < right) {\n    const area = Math.min(height[left], height[right]) * (right - left);\n    if (area > max) max = area;\n\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n\n  return max;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return maxArea;')();\n  return [\n    { pass: fn([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49, description: 'maxArea([1,8,6,2,5,4,8,3,7]) → 49', got: fn([1, 8, 6, 2, 5, 4, 8, 3, 7]) },\n    { pass: fn([1, 1]) === 1, description: 'maxArea([1,1]) → 1', got: fn([1, 1]) },\n    { pass: fn([4, 3, 2, 1, 4]) === 16, description: 'maxArea([4,3,2,1,4]) → 16', got: fn([4, 3, 2, 1, 4]) },\n    { pass: fn([1, 2, 1]) === 2, description: 'maxArea([1,2,1]) → 2', got: fn([1, 2, 1]) },\n    { pass: fn([2, 3, 4, 5, 18, 17, 6]) === 17, description: 'maxArea([2,3,4,5,18,17,6]) → 17', got: fn([2, 3, 4, 5, 18, 17, 6]) },\n  ];\n}`,
    hint: 'Use two pointers starting at the edges. Calculate the area (min height * width). Move the pointer with the shorter height inward, since keeping the shorter one cannot improve the result. Track the maximum area.',
    resources: [
      { label: 'LeetCode: Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // data-structures/arrays — new (318-320)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 318: Rotate Array ───────────────────────────────────────────────────
  {
    id: 318,
    title: 'Rotate Array',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'rotation', 'tier2'],
    description: 'Rotate an array to the right by k positions, returning a new array.',
    instructions: `Write a function called \`rotateArray\` that takes an array and a number k, and returns a new array rotated to the right by k positions.\n\nRotating right by 1 means the last element becomes the first. Handle cases where k is larger than the array length.\n\nExamples:\n  rotateArray([1, 2, 3, 4, 5], 2) → [4, 5, 1, 2, 3]\n  rotateArray([1, 2, 3], 1)        → [3, 1, 2]\n  rotateArray([1], 5)              → [1]\n  rotateArray([], 3)               → []`,
    starterCode: `function rotateArray(arr, k) {\n\n}`,
    solution: `function rotateArray(arr, k) {\n  if (arr.length === 0) return [];\n  const n = arr.length;\n  const shift = k % n;\n  return [...arr.slice(n - shift), ...arr.slice(0, n - shift)];\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return rotateArray;')();\n  return [\n    { pass: JSON.stringify(fn([1, 2, 3, 4, 5], 2)) === '[4,5,1,2,3]', description: 'rotateArray([1,2,3,4,5], 2) → [4,5,1,2,3]', got: JSON.stringify(fn([1, 2, 3, 4, 5], 2)) },\n    { pass: JSON.stringify(fn([1, 2, 3], 1)) === '[3,1,2]', description: 'rotateArray([1,2,3], 1) → [3,1,2]', got: JSON.stringify(fn([1, 2, 3], 1)) },\n    { pass: JSON.stringify(fn([1], 5)) === '[1]', description: 'single element → [1]', got: JSON.stringify(fn([1], 5)) },\n    { pass: JSON.stringify(fn([], 3)) === '[]', description: 'empty array → []', got: JSON.stringify(fn([], 3)) },\n    { pass: JSON.stringify(fn([1, 2, 3], 3)) === '[1,2,3]', description: 'k equals length → same array', got: JSON.stringify(fn([1, 2, 3], 3)) },\n    { pass: JSON.stringify(fn([1, 2, 3], 4)) === '[3,1,2]', description: 'k > length wraps around', got: JSON.stringify(fn([1, 2, 3], 4)) },\n  ];\n}`,
    hint: 'Use k % arr.length to handle k larger than the array. Then slice the array into two parts: the last k elements and the first (length - k) elements. Concatenate them in reverse order.',
    resources: [
      { label: 'LeetCode: Rotate Array', url: 'https://leetcode.com/problems/rotate-array/' },
    ],
  },

  // ── 319: Spiral Matrix ──────────────────────────────────────────────────
  {
    id: 319,
    title: 'Spiral Matrix',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'matrix', 'tier3'],
    description: 'Traverse a 2D matrix in spiral order (clockwise) and return the elements as a flat array.',
    instructions: `Write a function called \`spiralOrder\` that takes a 2D matrix (array of arrays) and returns the elements in spiral (clockwise) order.\n\nTraverse: right across the top row, down the right column, left across the bottom row, up the left column, then repeat inward.\n\nUse boundary variables (top, bottom, left, right) to track the current spiral layer.\n\nExamples:\n  spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) → [1,2,3,6,9,8,7,4,5]\n  spiralOrder([[1,2],[3,4]])              → [1,2,4,3]\n  spiralOrder([[1]])                     → [1]\n  spiralOrder([])                        → []`,
    starterCode: `function spiralOrder(matrix) {\n  // Traverse the matrix in spiral order (clockwise)\n  // Hint: track top, bottom, left, right boundaries\n}`,
    solution: `function spiralOrder(matrix) {\n  if (matrix.length === 0) return [];\n  const result = [];\n  let top = 0;\n  let bottom = matrix.length - 1;\n  let left = 0;\n  let right = matrix[0].length - 1;\n\n  while (top <= bottom && left <= right) {\n    for (let i = left; i <= right; i++) result.push(matrix[top][i]);\n    top++;\n\n    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);\n    right--;\n\n    if (top <= bottom) {\n      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);\n      bottom--;\n    }\n\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);\n      left++;\n    }\n  }\n\n  return result;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return spiralOrder;')();\n  return [\n    { pass: JSON.stringify(fn([[1,2,3],[4,5,6],[7,8,9]])) === '[1,2,3,6,9,8,7,4,5]', description: '3x3 matrix spiral', got: JSON.stringify(fn([[1,2,3],[4,5,6],[7,8,9]])) },\n    { pass: JSON.stringify(fn([[1,2],[3,4]])) === '[1,2,4,3]', description: '2x2 matrix spiral', got: JSON.stringify(fn([[1,2],[3,4]])) },\n    { pass: JSON.stringify(fn([[1]])) === '[1]', description: '1x1 matrix → [1]', got: JSON.stringify(fn([[1]])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'empty matrix → []', got: JSON.stringify(fn([])) },\n    { pass: JSON.stringify(fn([[1,2,3,4]])) === '[1,2,3,4]', description: 'single row → [1,2,3,4]', got: JSON.stringify(fn([[1,2,3,4]])) },\n    { pass: JSON.stringify(fn([[1],[2],[3]])) === '[1,2,3]', description: 'single column → [1,2,3]', got: JSON.stringify(fn([[1],[2],[3]])) },\n  ];\n}`,
    hint: 'Use four boundary variables: top, bottom, left, right. In a loop: traverse right along top row (then top++), down along right column (then right--), left along bottom row if top <= bottom (then bottom--), up along left column if left <= right (then left++).',
    resources: [
      { label: 'LeetCode: Spiral Matrix', url: 'https://leetcode.com/problems/spiral-matrix/' },
    ],
  },

  // ── 320: Merge Intervals ────────────────────────────────────────────────
  {
    id: 320,
    title: 'Merge Intervals',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'sorting', 'intervals', 'tier3'],
    description: 'Merge all overlapping intervals in a collection.',
    instructions: `Write a function called \`mergeIntervals\` that takes an array of intervals (each an array [start, end]) and merges all overlapping intervals.\n\nReturn a new array of merged intervals sorted by start time.\n\nApproach: Sort by start time, then iterate. If the current interval overlaps with the previous one (current start <= previous end), merge them. Otherwise, start a new interval.\n\nExamples:\n  mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]\n  mergeIntervals([[1,4],[4,5]])                → [[1,5]]\n  mergeIntervals([[1,4],[0,4]])                → [[0,4]]`,
    starterCode: `function mergeIntervals(intervals) {\n  // Sort by start, then merge overlapping intervals\n}`,
    solution: `function mergeIntervals(intervals) {\n  if (intervals.length === 0) return [];\n\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const last = merged[merged.length - 1];\n    const current = intervals[i];\n\n    if (current[0] <= last[1]) {\n      last[1] = Math.max(last[1], current[1]);\n    } else {\n      merged.push(current);\n    }\n  }\n\n  return merged;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return mergeIntervals;')();\n  return [\n    { pass: JSON.stringify(fn([[1,3],[2,6],[8,10],[15,18]])) === '[[1,6],[8,10],[15,18]]', description: 'merges overlapping intervals', got: JSON.stringify(fn([[1,3],[2,6],[8,10],[15,18]])) },\n    { pass: JSON.stringify(fn([[1,4],[4,5]])) === '[[1,5]]', description: 'touching intervals merge [[1,4],[4,5]] → [[1,5]]', got: JSON.stringify(fn([[1,4],[4,5]])) },\n    { pass: JSON.stringify(fn([[1,4],[0,4]])) === '[[0,4]]', description: 'unsorted input [[1,4],[0,4]] → [[0,4]]', got: JSON.stringify(fn([[1,4],[0,4]])) },\n    { pass: JSON.stringify(fn([[1,4],[2,3]])) === '[[1,4]]', description: 'fully contained interval [[1,4],[2,3]] → [[1,4]]', got: JSON.stringify(fn([[1,4],[2,3]])) },\n    { pass: JSON.stringify(fn([])) === '[]', description: 'empty input → []', got: JSON.stringify(fn([])) },\n  ];\n}`,
    hint: 'Sort intervals by start time. Initialize result with the first interval. For each subsequent interval, check if it overlaps with the last merged interval (current start <= last end). If yes, extend the end. If no, push a new interval.',
    resources: [
      { label: 'LeetCode: Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // data-structures/strings — new (321-323)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 321: String Compression ─────────────────────────────────────────────
  {
    id: 321,
    title: 'String Compression',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'compression', 'tier2'],
    description: 'Compress a string by counting consecutive repeated characters. Only return compressed version if shorter.',
    instructions: `Write a function called \`compress\` that takes a string and returns a compressed version where consecutive duplicate characters are replaced by the character followed by the count.\n\nOnly return the compressed string if it is shorter than the original. Otherwise, return the original string.\n\nExamples:\n  compress("aabcccccaaa") → "a2b1c5a3"\n  compress("abc")         → "abc" (compressed "a1b1c1" is not shorter)\n  compress("aabb")        → "aabb" (compressed "a2b2" is same length)\n  compress("")            → ""`,
    starterCode: `function compress(str) {\n\n}`,
    solution: `function compress(str) {\n  if (str.length === 0) return '';\n\n  let compressed = '';\n  let count = 1;\n\n  for (let i = 1; i <= str.length; i++) {\n    if (i < str.length && str[i] === str[i - 1]) {\n      count++;\n    } else {\n      compressed += str[i - 1] + count;\n      count = 1;\n    }\n  }\n\n  return compressed.length < str.length ? compressed : str;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return compress;')();\n  return [\n    { pass: fn('aabcccccaaa') === 'a2b1c5a3', description: '"aabcccccaaa" → "a2b1c5a3"', got: fn('aabcccccaaa') },\n    { pass: fn('abc') === 'abc', description: '"abc" → "abc" (not shorter)', got: fn('abc') },\n    { pass: fn('aabb') === 'aabb', description: '"aabb" → "aabb" (same length)', got: fn('aabb') },\n    { pass: fn('') === '', description: 'empty string → ""', got: fn('') },\n    { pass: fn('aaa') === 'a3', description: '"aaa" → "a3"', got: fn('aaa') },\n    { pass: fn('a') === 'a', description: 'single char → "a"', got: fn('a') },\n  ];\n}`,
    hint: 'Iterate through the string, counting consecutive characters. When the character changes (or you reach the end), append the character and its count to a result string. At the end, return the shorter of the two strings.',
    resources: [
      { label: 'Cracking the Coding Interview: String Compression', url: 'https://www.geeksforgeeks.org/run-length-encoding/' },
    ],
  },

  // ── 322: Longest Common Prefix ──────────────────────────────────────────
  {
    id: 322,
    title: 'Longest Common Prefix',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'comparison', 'tier2'],
    description: 'Find the longest common prefix string amongst an array of strings.',
    instructions: `Write a function called \`longestCommonPrefix\` that takes an array of strings and returns the longest common prefix.\n\nIf there is no common prefix, return an empty string.\n\nExamples:\n  longestCommonPrefix(["flower", "flow", "flight"]) → "fl"\n  longestCommonPrefix(["dog", "racecar", "car"])     → ""\n  longestCommonPrefix(["a"])                         → "a"\n  longestCommonPrefix([])                            → ""`,
    starterCode: `function longestCommonPrefix(strs) {\n\n}`,
    solution: `function longestCommonPrefix(strs) {\n  if (strs.length === 0) return '';\n\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.slice(0, -1);\n      if (prefix === '') return '';\n    }\n  }\n\n  return prefix;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return longestCommonPrefix;')();\n  return [\n    { pass: fn(['flower', 'flow', 'flight']) === 'fl', description: '["flower","flow","flight"] → "fl"', got: fn(['flower', 'flow', 'flight']) },\n    { pass: fn(['dog', 'racecar', 'car']) === '', description: '["dog","racecar","car"] → ""', got: fn(['dog', 'racecar', 'car']) },\n    { pass: fn(['a']) === 'a', description: '["a"] → "a"', got: fn(['a']) },\n    { pass: fn([]) === '', description: '[] → ""', got: fn([]) },\n    { pass: fn(['abc', 'abc', 'abc']) === 'abc', description: 'all same → "abc"', got: fn(['abc', 'abc', 'abc']) },\n    { pass: fn(['', 'abc']) === '', description: 'empty string in array → ""', got: fn(['', 'abc']) },\n  ];\n}`,
    hint: 'Start with the first string as the prefix. For each subsequent string, shorten the prefix from the end until it matches the beginning of that string. If the prefix becomes empty, return "".',
    resources: [
      { label: 'LeetCode: Longest Common Prefix', url: 'https://leetcode.com/problems/longest-common-prefix/' },
    ],
  },

  // ── 323: Is Subsequence ─────────────────────────────────────────────────
  {
    id: 323,
    title: 'Is Subsequence',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'two-pointer', 'tier2'],
    description: 'Check if a string is a subsequence of another string.',
    instructions: `Write a function called \`isSubsequence\` that takes two strings s and t, and returns \`true\` if s is a subsequence of t.\n\nA subsequence means the characters of s appear in t in the same order, but not necessarily consecutively.\n\nUse a two-pointer approach: one pointer for each string.\n\nExamples:\n  isSubsequence("ace", "abcde")      → true  (a_c_e)\n  isSubsequence("aec", "abcde")      → false\n  isSubsequence("", "anything")      → true\n  isSubsequence("a", "a")            → true\n  isSubsequence("abc", "ab")         → false`,
    starterCode: `function isSubsequence(s, t) {\n\n}`,
    solution: `function isSubsequence(s, t) {\n  let si = 0;\n  let ti = 0;\n\n  while (si < s.length && ti < t.length) {\n    if (s[si] === t[ti]) {\n      si++;\n    }\n    ti++;\n  }\n\n  return si === s.length;\n}`,
    testRunner: `(code) => {\n  const fn = new Function(code + '; return isSubsequence;')();\n  return [\n    { pass: fn('ace', 'abcde') === true, description: '"ace" is subsequence of "abcde" → true', got: fn('ace', 'abcde') },\n    { pass: fn('aec', 'abcde') === false, description: '"aec" is NOT subsequence of "abcde" → false', got: fn('aec', 'abcde') },\n    { pass: fn('', 'anything') === true, description: 'empty string is always a subsequence → true', got: fn('', 'anything') },\n    { pass: fn('a', 'a') === true, description: '"a" is subsequence of "a" → true', got: fn('a', 'a') },\n    { pass: fn('abc', 'ab') === false, description: '"abc" longer than "ab" → false', got: fn('abc', 'ab') },\n    { pass: fn('b', 'abc') === true, description: '"b" is subsequence of "abc" → true', got: fn('b', 'abc') },\n  ];\n}`,
    hint: 'Use two pointers: one for s (si) and one for t (ti). Walk through t. Whenever t[ti] matches s[si], advance si. Always advance ti. After the loop, check if si reached the end of s.',
    resources: [
      { label: 'LeetCode: Is Subsequence', url: 'https://leetcode.com/problems/is-subsequence/' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // data-structures/objects — new (324-325)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 324: Implement a Set ────────────────────────────────────────────────
  {
    id: 324,
    title: 'Implement a Set',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'objects'],
    tags: ['class', 'data-structures', 'set', 'tier3'],
    description: 'Build your own Set data structure with add, has, delete, size, and values methods.',
    instructions: `Create a class called \`MySet\` that implements a basic Set data structure (without using the built-in Set).\n\nMethods:\n- \`add(value)\` — adds a value to the set (no duplicates)\n- \`has(value)\` — returns true if the value exists in the set\n- \`delete(value)\` — removes a value from the set, returns true if it existed\n- \`size()\` — returns the number of elements in the set\n- \`values()\` — returns an array of all values in the set\n\n\`\`\`js\nconst s = new MySet();\ns.add(1);\ns.add(2);\ns.add(1);         // duplicate, ignored\ns.size();         // 2\ns.has(1);         // true\ns.has(3);         // false\ns.delete(1);      // true\ns.has(1);         // false\ns.size();         // 1\ns.values();       // [2]\n\`\`\``,
    starterCode: `class MySet {\n  constructor() {\n    // your code here\n  }\n\n  add(value) {\n    // your code here\n  }\n\n  has(value) {\n    // your code here\n  }\n\n  delete(value) {\n    // your code here\n  }\n\n  size() {\n    // your code here\n  }\n\n  values() {\n    // your code here\n  }\n}`,
    solution: `class MySet {\n  constructor() {\n    this._items = {};\n  }\n\n  add(value) {\n    this._items[value] = true;\n  }\n\n  has(value) {\n    return this._items.hasOwnProperty(value);\n  }\n\n  delete(value) {\n    if (this.has(value)) {\n      delete this._items[value];\n      return true;\n    }\n    return false;\n  }\n\n  size() {\n    return Object.keys(this._items).length;\n  }\n\n  values() {\n    return Object.keys(this._items);\n  }\n}`,
    testRunner: `(code) => {\n  const MySet = new Function(code + '; return MySet;')();\n  const s = new MySet();\n  s.add(1);\n  s.add(2);\n  s.add(1);\n  const sizeAfterAdd = s.size();\n  const has1 = s.has(1);\n  const has3 = s.has(3);\n  const del1 = s.delete(1);\n  const has1After = s.has(1);\n  const sizeAfterDel = s.size();\n  const del3 = s.delete(3);\n  return [\n    { pass: sizeAfterAdd === 2, description: 'size is 2 after adding 1, 2, 1 (duplicate ignored)', got: sizeAfterAdd },\n    { pass: has1 === true, description: 'has(1) → true', got: has1 },\n    { pass: has3 === false, description: 'has(3) → false', got: has3 },\n    { pass: del1 === true, description: 'delete(1) returns true', got: del1 },\n    { pass: has1After === false, description: 'has(1) → false after delete', got: has1After },\n    { pass: sizeAfterDel === 1, description: 'size is 1 after deleting 1', got: sizeAfterDel },\n    { pass: del3 === false, description: 'delete(3) returns false (not found)', got: del3 },\n  ];\n}`,
    hint: 'Use an object internally where keys represent the set values. add() sets obj[value] = true. has() checks hasOwnProperty. delete() uses the delete operator. size() uses Object.keys().length.',
    resources: [
      { label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' },
    ],
  },

  // ── 325: LRU Cache ──────────────────────────────────────────────────────
  {
    id: 325,
    title: 'LRU Cache',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'objects'],
    tags: ['class', 'data-structures', 'cache', 'design-pattern', 'tier4'],
    description: 'Implement a Least Recently Used (LRU) cache with O(1) get and put operations.',
    instructions: `Create a class called \`LRUCache\` that implements a least recently used cache.\n\n**Constructor:** takes a capacity (positive integer)\n\n**Methods:**\n- \`get(key)\` — returns the value associated with the key, or -1 if not found. Marks the key as recently used.\n- \`put(key, value)\` — adds or updates a key-value pair. If adding would exceed capacity, evict the least recently used item first.\n\nA key becomes "most recently used" whenever it is accessed via get() or updated via put().\n\n\`\`\`js\nconst cache = new LRUCache(2);  // capacity 2\ncache.put(1, 1);\ncache.put(2, 2);\ncache.get(1);       // 1 (marks key 1 as recently used)\ncache.put(3, 3);    // evicts key 2 (least recently used)\ncache.get(2);       // -1 (was evicted)\ncache.get(3);       // 3\n\`\`\``,
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n\n  get(key) {\n    // Returns value or -1 if not found\n  }\n\n  put(key, value) {\n    // Evicts least recently used if at capacity\n  }\n}`,
    solution: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
    testRunner: `(code) => {\n  const LRUCache = new Function(code + '; return LRUCache;')();\n  const cache = new LRUCache(2);\n  cache.put(1, 1);\n  cache.put(2, 2);\n  const get1 = cache.get(1);\n  cache.put(3, 3);\n  const get2 = cache.get(2);\n  const get3 = cache.get(3);\n  cache.put(4, 4);\n  const get1b = cache.get(1);\n  const get3b = cache.get(3);\n  const get4 = cache.get(4);\n  return [\n    { pass: get1 === 1, description: 'get(1) → 1 (exists)', got: get1 },\n    { pass: get2 === -1, description: 'get(2) → -1 (evicted by put(3,3))', got: get2 },\n    { pass: get3 === 3, description: 'get(3) → 3', got: get3 },\n    { pass: get1b === -1, description: 'get(1) → -1 (evicted by put(4,4))', got: get1b },\n    { pass: get3b === 3, description: 'get(3) → 3 (still in cache)', got: get3b },\n    { pass: get4 === 4, description: 'get(4) → 4', got: get4 },\n    { pass: (() => { const c = new LRUCache(1); c.put(1, 10); c.put(1, 20); return c.get(1) === 20; })(), description: 'put overwrites existing key', got: (() => { const c = new LRUCache(1); c.put(1, 10); c.put(1, 20); return c.get(1); })() },\n  ];\n}`,
    hint: 'Use a Map, which maintains insertion order. On get(): delete and re-insert the key to move it to the end (most recent). On put(): if key exists, delete it first. If at capacity, delete the first key (Map.keys().next().value). Then set the new key.',
    resources: [
      { label: 'LeetCode: LRU Cache', url: 'https://leetcode.com/problems/lru-cache/' },
      { label: 'MDN: Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map' },
    ],
  },
];

// ─── ADD ALL EXERCISES ────────────────────────────────────────────────────────

for (const ex of newExercises) {
  data.exercises.push(ex);
  console.log(`  Added ${ex.id}: ${ex.title} (Tier ${ex.tier})`);
}

// ─── UPDATE DEFAULT CURRICULUM ────────────────────────────────────────────────

const defaultCurr = data.collections.find(c => c.id === 'default-curriculum');
if (defaultCurr) {
  const newIds = newExercises.map(e => e.id);
  defaultCurr.exerciseIds = [...defaultCurr.exerciseIds, ...newIds].sort((a, b) => a - b);
  console.log(`\n  Updated default-curriculum: ${defaultCurr.exerciseIds.length} exercises`);
}

// ─── WRITE BACK ───────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── SUMMARY ──────────────────────────────────────────────────────────────────

const tierCounts = {};
for (const ex of data.exercises) {
  tierCounts[ex.tier] = (tierCounts[ex.tier] || 0) + 1;
}

const categoryCounts = {};
for (const ex of newExercises) {
  const cat = ex.category[0];
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

console.log('\n=== Migration Complete ===');
console.log(`  New exercises: ${newExercises.length}`);
console.log(`  ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
console.log(`  By category: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
