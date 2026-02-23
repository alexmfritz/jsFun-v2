/**
 * Add 8 Odin Project exercises (IDs 506-513) and the collection definition.
 * Exercises adapted from The Odin Project curriculum (MIT License).
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

const exercises = [
  {
    id: 506,
    title: 'Remove From Array',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'rest-params', 'filter'],
    description: 'Remove specified values from an array and return a new array without them.',
    instructions: 'Write a function `removeFromArray(arr, ...items)` that takes an array and one or more additional arguments, then returns a new array with all matching items removed.\n\n```js\nremoveFromArray([1, 2, 3, 4], 3)       // => [1, 2, 4]\nremoveFromArray([1, 2, 3, 4], 3, 2)    // => [1, 4]\nremoveFromArray([1, 2, 3, 4], 7)       // => [1, 2, 3, 4]\nremoveFromArray([\"a\", \"b\", \"c\"], \"b\") // => [\"a\", \"c\"]\n```',
    starterCode: 'function removeFromArray(arr, ...items) {\n  // your code here\n}',
    solution: 'function removeFromArray(arr, ...items) {\n  return arr.filter(el => !items.includes(el));\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return removeFromArray;')();
  const r1 = fn([1, 2, 3, 4], 3);
  const r2 = fn([1, 2, 3, 4], 3, 2);
  const r3 = fn([1, 2, 3, 4], 7);
  const r4 = fn(["a", "b", "c"], "b");
  const r5 = fn([1, 2, 3, 4, 5], 1, 5);
  const orig = [1, 2, 3];
  const r6 = fn(orig, 2);
  return [
    { pass: JSON.stringify(r1) === '[1,2,4]', description: 'Removes a single item from the array', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[1,4]', description: 'Removes multiple items from the array', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[1,2,3,4]', description: 'Returns original elements when no match is found', got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === '["a","c"]', description: 'Works with string values', got: JSON.stringify(r4) },
    { pass: JSON.stringify(r5) === '[2,3,4]', description: 'Removes first and last items', got: JSON.stringify(r5) },
    { pass: JSON.stringify(orig) === '[1,2,3]', description: 'Does not mutate the original array', got: JSON.stringify(orig) }
  ];
}`,
    hints: [
      'How can you collect an unknown number of arguments after the first one?',
      'Use rest parameters (...items) to gather extra arguments, then filter the array to exclude those items.',
      'Use `arr.filter(el => !items.includes(el))` to return only elements not found in the items list.'
    ],
    resources: [
      { label: 'MDN: Rest parameters', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters', description: 'How rest parameters collect arguments into an array' },
      { label: 'MDN: Array.prototype.filter()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter', description: 'The filter method creates a new array with matching elements' }
    ]
  },
  {
    id: 507,
    title: 'Sum a Range',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'loops'],
    tags: ['loops', 'math', 'error-handling'],
    description: 'Sum all integers between two numbers, handling reversed arguments and invalid input.',
    instructions: 'Write a function `sumAll(range)` that takes a two-element array of numbers and returns the sum of all integers between them (inclusive). The arguments can be in any order. Return the string `"ERROR"` if either argument is negative or not a number.\n\n```js\nsumAll([1, 4])    // => 10 (1+2+3+4)\nsumAll([4, 1])    // => 10 (works reversed)\nsumAll([1, 1])    // => 1\nsumAll([-1, 4])   // => \"ERROR\"\nsumAll([1, \"a\"])  // => \"ERROR\"\n```',
    starterCode: 'function sumAll(range) {\n  // your code here\n}',
    solution: 'function sumAll(range) {\n  const [a, b] = range;\n  if (typeof a !== "number" || typeof b !== "number" || a < 0 || b < 0) return "ERROR";\n  const lo = Math.min(a, b);\n  const hi = Math.max(a, b);\n  let sum = 0;\n  for (let i = lo; i <= hi; i++) sum += i;\n  return sum;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return sumAll;')();
  const r1 = fn([1, 4]);
  const r2 = fn([4, 1]);
  const r3 = fn([1, 1]);
  const r4 = fn([5, 10]);
  const r5 = fn([-1, 4]);
  const r6 = fn([1, "a"]);
  return [
    { pass: r1 === 10, description: 'Sums 1 through 4 to get 10', got: String(r1) },
    { pass: r2 === 10, description: 'Works when arguments are reversed', got: String(r2) },
    { pass: r3 === 1, description: 'Returns the number itself when both values are equal', got: String(r3) },
    { pass: r4 === 45, description: 'Sums 5 through 10 to get 45', got: String(r4) },
    { pass: r5 === "ERROR", description: 'Returns ERROR for negative numbers', got: String(r5) },
    { pass: r6 === "ERROR", description: 'Returns ERROR for non-number inputs', got: String(r6) }
  ];
}`,
    hints: [
      'What should you check before starting the summation loop?',
      'Validate inputs first (typeof check and negative check). Then find the lower and upper bounds with Math.min/Math.max and loop between them.',
      'Destructure the array, return "ERROR" if either is not a number or is negative. Use a for loop from Math.min to Math.max, accumulating the sum.'
    ],
    resources: [
      { label: 'MDN: Math.min()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min', description: 'Returns the smallest of the given numbers' },
      { label: 'MDN: typeof', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof', description: 'The typeof operator returns a string indicating the type' }
    ]
  },
  {
    id: 508,
    title: 'Temperature Conversion',
    type: 'js',
    tier: 2,
    category: ['es6-plus', 'modules'],
    tags: ['objects', 'functions', 'module-pattern'],
    description: 'Convert temperatures between Fahrenheit and Celsius, rounded to one decimal place.',
    instructions: 'Write two functions:\n\n- `ftoc(f)` converts Fahrenheit to Celsius\n- `ctof(c)` converts Celsius to Fahrenheit\n\nRound results to 1 decimal place.\n\nFormulas:\n- C = (F - 32) * 5/9\n- F = C * 9/5 + 32\n\n```js\nftoc(32)   // => 0\nftoc(212)  // => 100\nftoc(-40)  // => -40\nctof(0)    // => 32\nctof(100)  // => 212\nctof(-40)  // => -40\n```',
    starterCode: 'function ftoc(f) {\n  // your code here\n}\n\nfunction ctof(c) {\n  // your code here\n}',
    solution: 'function ftoc(f) {\n  return Math.round(((f - 32) * 5 / 9) * 10) / 10;\n}\n\nfunction ctof(c) {\n  return Math.round((c * 9 / 5 + 32) * 10) / 10;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return { ftoc, ctof };')();
  const r1 = fn.ftoc(32);
  const r2 = fn.ftoc(212);
  const r3 = fn.ftoc(-40);
  const r4 = fn.ctof(0);
  const r5 = fn.ctof(100);
  const r6 = fn.ctof(-40);
  const r7 = fn.ftoc(77);
  return [
    { pass: r1 === 0, description: 'ftoc: 32F equals 0C', got: String(r1) },
    { pass: r2 === 100, description: 'ftoc: 212F equals 100C', got: String(r2) },
    { pass: r3 === -40, description: 'ftoc: -40F equals -40C', got: String(r3) },
    { pass: r4 === 32, description: 'ctof: 0C equals 32F', got: String(r4) },
    { pass: r5 === 212, description: 'ctof: 100C equals 212F', got: String(r5) },
    { pass: r6 === -40, description: 'ctof: -40C equals -40F', got: String(r6) },
    { pass: r7 === 25, description: 'ftoc: 77F equals 25C', got: String(r7) }
  ];
}`,
    hints: [
      'What are the formulas for converting between Fahrenheit and Celsius?',
      'C = (F - 32) * 5/9 and F = C * 9/5 + 32. Use Math.round() with a multiplier to round to 1 decimal.',
      'Compute the conversion, multiply by 10, round with Math.round(), then divide by 10 to get 1 decimal place.'
    ],
    resources: [
      { label: 'MDN: Math.round()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round', description: 'Rounds a number to the nearest integer' },
      { label: 'MDN: Arithmetic operators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#arithmetic_operators', description: 'JavaScript arithmetic operators for math operations' }
    ]
  },
  {
    id: 509,
    title: 'Get the Titles',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'objects'],
    tags: ['objects', 'arrays', 'map'],
    description: 'Extract an array of title strings from an array of book objects.',
    instructions: 'Write a function `getTheTitles(books)` that takes an array of book objects (each with a `title` property) and returns an array of just the title strings.\n\n```js\ngetTheTitles([\n  { title: "1984", author: "George Orwell" },\n  { title: "Dune", author: "Frank Herbert" }\n])\n// => ["1984", "Dune"]\n\ngetTheTitles([]) // => []\n```',
    starterCode: 'function getTheTitles(books) {\n  // your code here\n}',
    solution: 'function getTheTitles(books) {\n  return books.map(book => book.title);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return getTheTitles;')();
  const r1 = fn([{ title: "1984" }, { title: "Dune" }]);
  const r2 = fn([]);
  const r3 = fn([{ title: "The Hobbit", author: "Tolkien" }]);
  const r4 = fn([{ title: "A" }, { title: "B" }, { title: "C" }]);
  return [
    { pass: JSON.stringify(r1) === '["1984","Dune"]', description: 'Extracts titles from two books', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[]', description: 'Returns empty array for empty input', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '["The Hobbit"]', description: 'Works with a single book', got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === '["A","B","C"]', description: 'Works with three books', got: JSON.stringify(r4) },
    { pass: Array.isArray(r1), description: 'Returns an array', got: typeof r1 }
  ];
}`,
    hints: [
      'What array method lets you transform each element into something else?',
      'Array.map() creates a new array by applying a function to each element. You want to extract just the title property.',
      'Use `books.map(book => book.title)` to pluck out the title from each book object.'
    ],
    resources: [
      { label: 'MDN: Array.prototype.map()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', description: 'Creates a new array by transforming each element' },
      { label: 'MDN: Property accessors', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors', description: 'How to access object properties with dot or bracket notation' }
    ]
  },
  {
    id: 510,
    title: 'Find the Oldest',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'objects'],
    tags: ['objects', 'reduce', 'derived-values'],
    description: 'Find the person who has lived the longest from an array of people objects.',
    instructions: 'Write a function `findTheOldest(people)` that takes an array of person objects. Each person has `name`, `yearOfBirth`, and an optional `yearOfDeath`. If `yearOfDeath` is missing, the person is still alive -- use the current year.\n\nReturn the person object who has lived (or has been living) the longest.\n\n```js\nfindTheOldest([\n  { name: "Carly", yearOfBirth: 1942, yearOfDeath: 1970 },\n  { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 },\n  { name: "Jane", yearOfBirth: 1912, yearOfDeath: 1941 }\n])\n// => { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 }\n// Ray lived 49 years, Carly 28, Jane 29\n```',
    starterCode: 'function findTheOldest(people) {\n  // your code here\n}',
    solution: 'function findTheOldest(people) {\n  return people.reduce((oldest, person) => {\n    const currentYear = new Date().getFullYear();\n    const age = (person.yearOfDeath || currentYear) - person.yearOfBirth;\n    const oldestAge = (oldest.yearOfDeath || currentYear) - oldest.yearOfBirth;\n    return age > oldestAge ? person : oldest;\n  });\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return findTheOldest;')();
  const r1 = fn([
    { name: "Carly", yearOfBirth: 1942, yearOfDeath: 1970 },
    { name: "Ray", yearOfBirth: 1962, yearOfDeath: 2011 },
    { name: "Jane", yearOfBirth: 1912, yearOfDeath: 1941 }
  ]);
  const r2 = fn([
    { name: "Alpha", yearOfBirth: 2000, yearOfDeath: 2050 },
    { name: "Beta", yearOfBirth: 1990, yearOfDeath: 2060 }
  ]);
  const r3 = fn([
    { name: "Solo", yearOfBirth: 1980, yearOfDeath: 2020 }
  ]);
  const r4 = fn([
    { name: "Old", yearOfBirth: 1900, yearOfDeath: 2000 },
    { name: "Young", yearOfBirth: 1990, yearOfDeath: 2010 }
  ]);
  const r5 = fn([
    { name: "Deceased", yearOfBirth: 2000, yearOfDeath: 2020 },
    { name: "Alive", yearOfBirth: 1920 }
  ]);
  return [
    { pass: r1.name === "Ray", description: 'Finds Ray who lived 49 years (the longest)', got: r1.name },
    { pass: r2.name === "Beta", description: 'Finds Beta who lived 70 years over Alpha at 50', got: r2.name },
    { pass: r3.name === "Solo", description: 'Works with a single person', got: r3.name },
    { pass: r4.name === "Old", description: 'Finds Old who lived 100 years over Young at 20', got: r4.name },
    { pass: r5.name === "Alive", description: 'Treats missing yearOfDeath as still alive (uses current year)', got: r5.name }
  ];
}`,
    hints: [
      'How do you calculate someone\'s age if they might still be alive?',
      'If yearOfDeath is missing, use the current year from new Date().getFullYear(). Then subtract yearOfBirth to get total years lived.',
      'Use reduce to compare each person. For each, compute age = (yearOfDeath || currentYear) - yearOfBirth, and keep the one with the highest age.'
    ],
    resources: [
      { label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', description: 'Reduces an array to a single value by accumulating results' },
      { label: 'MDN: Date.prototype.getFullYear()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear', description: 'Returns the year of a Date object' }
    ]
  },
  {
    id: 511,
    title: 'Recursive Contains',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'arrays', 'searching'],
    description: 'Recursively search a nested array structure to find if it contains a given value.',
    instructions: 'Write a function `contains(arr, target)` that recursively searches through a nested array to determine if it contains the given target value. No loops allowed -- use only recursion.\n\nThe array can contain numbers, strings, or other arrays (nested arbitrarily deep).\n\n```js\ncontains([1, [2, [3]]], 3)        // => true\ncontains([1, [2, [3]]], 4)        // => false\ncontains([], 1)                   // => false\ncontains([[[[5]]]], 5)            // => true\ncontains([1, "hello", [2]], "hello") // => true\n```',
    starterCode: 'function contains(arr, target) {\n  // your code here — no loops!\n}',
    solution: 'function contains(arr, target) {\n  if (arr.length === 0) return false;\n  const [first, ...rest] = arr;\n  if (Array.isArray(first)) {\n    return contains(first, target) || contains(rest, target);\n  }\n  if (first === target) return true;\n  return contains(rest, target);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return contains;')();
  const r1 = fn([1, [2, [3]]], 3);
  const r2 = fn([1, [2, [3]]], 4);
  const r3 = fn([], 1);
  const r4 = fn([[[[5]]]], 5);
  const r5 = fn([1, "hello", [2]], "hello");
  const r6 = fn([1, 2, 3], 2);
  const fnStr = fn.toString();
  const usesLoop = /\\b(for|while|do)\\b/.test(fnStr);
  return [
    { pass: r1 === true, description: 'Finds 3 nested two levels deep', got: String(r1) },
    { pass: r2 === false, description: 'Returns false when value is not present', got: String(r2) },
    { pass: r3 === false, description: 'Returns false for empty array', got: String(r3) },
    { pass: r4 === true, description: 'Finds value nested four levels deep', got: String(r4) },
    { pass: r5 === true, description: 'Works with string values', got: String(r5) },
    { pass: r6 === true, description: 'Finds value in a flat array', got: String(r6) },
    { pass: !usesLoop, description: 'Does not use for/while/do loops', got: usesLoop ? 'Uses loops' : 'Recursion only' }
  ];
}`,
    hints: [
      'What are the base cases for a recursive search through a nested array?',
      'Base cases: empty array returns false, matching element returns true. Recursive case: if the element is an array, recurse into it; otherwise check the rest.',
      'Destructure [first, ...rest]. If first is an array, return contains(first, target) || contains(rest, target). If first === target, return true. Otherwise return contains(rest, target).'
    ],
    resources: [
      { label: 'MDN: Array.isArray()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray', description: 'Determines whether a value is an array' },
      { label: 'MDN: Destructuring assignment', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment', description: 'Unpack values from arrays into variables' }
    ]
  },
  {
    id: 512,
    title: 'Total Integers (Recursive)',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'arrays', 'counting'],
    description: 'Recursively count how many integers exist in a nested array structure.',
    instructions: 'Write a function `totalIntegers(arr)` that recursively counts how many integers appear in a nested array. Only count whole integers (not floats or other types). No loops allowed.\n\n```js\ntotalIntegers([1, [2], 3])          // => 3\ntotalIntegers([[1, [2, 3]], [4]])    // => 4\ntotalIntegers([])                    // => 0\ntotalIntegers([1.5, \"hello\", 3])    // => 1 (only 3 is a whole integer)\ntotalIntegers([[[[7]]]])             // => 1\n```',
    starterCode: 'function totalIntegers(arr) {\n  // your code here — no loops!\n}',
    solution: 'function totalIntegers(arr) {\n  if (arr.length === 0) return 0;\n  const [first, ...rest] = arr;\n  if (Array.isArray(first)) {\n    return totalIntegers(first) + totalIntegers(rest);\n  }\n  const isInt = Number.isInteger(first) ? 1 : 0;\n  return isInt + totalIntegers(rest);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return totalIntegers;')();
  const r1 = fn([1, [2], 3]);
  const r2 = fn([[1, [2, 3]], [4]]);
  const r3 = fn([]);
  const r4 = fn([1.5, "hello", 3]);
  const r5 = fn([[[[7]]]]);
  const r6 = fn([0, -1, 2.5, true, null, 4]);
  const fnStr = fn.toString();
  const usesLoop = /\\b(for|while|do)\\b/.test(fnStr);
  return [
    { pass: r1 === 3, description: 'Counts 3 integers in [1, [2], 3]', got: String(r1) },
    { pass: r2 === 4, description: 'Counts 4 integers in deeply nested structure', got: String(r2) },
    { pass: r3 === 0, description: 'Returns 0 for empty array', got: String(r3) },
    { pass: r4 === 1, description: 'Only counts whole integers, not floats or strings', got: String(r4) },
    { pass: r5 === 1, description: 'Finds integer nested four levels deep', got: String(r5) },
    { pass: r6 === 3, description: 'Counts 0, -1, and 4 but not 2.5, true, or null', got: String(r6) },
    { pass: !usesLoop, description: 'Does not use for/while/do loops', got: usesLoop ? 'Uses loops' : 'Recursion only' }
  ];
}`,
    hints: [
      'How do you determine if a value is a whole integer versus a float or other type?',
      'Use Number.isInteger() to check for whole integers. Recurse into sub-arrays and add up counts from each branch.',
      'Destructure [first, ...rest]. If first is an array, return totalIntegers(first) + totalIntegers(rest). If Number.isInteger(first), add 1 + totalIntegers(rest). Otherwise 0 + totalIntegers(rest).'
    ],
    resources: [
      { label: 'MDN: Number.isInteger()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger', description: 'Determines whether a value is an integer' },
      { label: 'MDN: Array.isArray()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray', description: 'Determines whether a value is an array' }
    ]
  },
  {
    id: 513,
    title: 'Permutations',
    type: 'js',
    tier: 4,
    category: ['algorithms', 'recursion'],
    tags: ['recursion', 'arrays', 'backtracking'],
    description: 'Generate all permutations of a given string using recursion.',
    instructions: 'Write a function `permutations(str)` that returns an array of all permutations of the given string. The order of permutations in the result does not matter.\n\n```js\npermutations("")     // => [\"\"]\npermutations("a")    // => [\"a\"]\npermutations("ab")   // => [\"ab\", \"ba\"]\npermutations("abc")  // => [\"abc\",\"acb\",\"bac\",\"bca\",\"cab\",\"cba\"]\n```\n\nHint: For each character in the string, fix it in the first position and recursively permute the remaining characters.',
    starterCode: 'function permutations(str) {\n  // your code here\n}',
    solution: 'function permutations(str) {\n  if (str.length <= 1) return [str];\n  const result = [];\n  for (let i = 0; i < str.length; i++) {\n    const char = str[i];\n    const remaining = str.slice(0, i) + str.slice(i + 1);\n    const perms = permutations(remaining);\n    for (const perm of perms) {\n      result.push(char + perm);\n    }\n  }\n  return result;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return permutations;')();
  const r1 = fn("");
  const r2 = fn("a");
  const r3 = fn("ab");
  const r4 = fn("abc");
  const sorted3 = r3.slice().sort();
  const sorted4 = r4.slice().sort();
  const expected3 = ["ab","ba"];
  const expected4 = ["abc","acb","bac","bca","cab","cba"];
  return [
    { pass: JSON.stringify(r1) === '[""]', description: 'Empty string returns array with empty string', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '["a"]', description: 'Single character returns array with that character', got: JSON.stringify(r2) },
    { pass: JSON.stringify(sorted3) === JSON.stringify(expected3), description: 'Two characters produce 2 permutations', got: JSON.stringify(sorted3) },
    { pass: JSON.stringify(sorted4) === JSON.stringify(expected4), description: 'Three characters produce 6 permutations', got: JSON.stringify(sorted4) },
    { pass: r4.length === 6, description: 'abc produces exactly 6 results', got: String(r4.length) },
    { pass: fn("abcd").length === 24, description: 'Four characters produce 24 permutations', got: String(fn("abcd").length) }
  ];
}`,
    hints: [
      'What is the base case for generating permutations of a string?',
      'For each character, remove it from the string and recursively find all permutations of the remaining characters. Prepend the removed character to each result.',
      'Base case: strings of length 0 or 1 return [str]. Loop through each index i, take str[i] as the first char, recursively permute the rest, and prepend str[i] to each sub-permutation.'
    ],
    resources: [
      { label: 'MDN: String.prototype.slice()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice', description: 'Extracts a section of a string' },
      { label: 'MDN: Array.prototype.push()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push', description: 'Adds elements to the end of an array' }
    ]
  }
];

// Add exercises
data.exercises.push(...exercises);

// Add collection
data.collections.push({
  id: 'odin-project',
  name: 'The Odin Project',
  description: 'Practical JavaScript exercises from The Odin Project curriculum. Each exercise targets a specific real-world skill like filtering arrays, working with objects, and recursive problem-solving.',
  exerciseIds: [506, 507, 508, 509, 510, 511, 512, 513],
  color: '#f59e0b',
  source: 'The Odin Project',
  license: 'MIT',
  attribution: 'Exercises adapted from The Odin Project (theodinproject.com). Used under the MIT License.'
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Added ${exercises.length} Odin Project exercises (IDs ${exercises[0].id}-${exercises[exercises.length - 1].id})`);
console.log(`Total exercises: ${data.exercises.length}`);
console.log(`Total collections: ${data.collections.length}`);
