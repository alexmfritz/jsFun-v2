const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "exercises", "exercises.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const newExercises = [
  {
    id: 472,
    title: "Roman Numerals",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["numbers", "conversion", "mapping"],
    description: "Convert a number to its Roman numeral representation.",
    instructions: "Write a function `toRoman(number)` that converts a positive integer to a Roman numeral string.\n\nRoman numerals use subtractive notation for 4, 9, 40, 90, 400, and 900.\n\n```js\ntoRoman(1) // => \"I\"\ntoRoman(4) // => \"IV\"\ntoRoman(1990) // => \"MCMXC\"\ntoRoman(2024) // => \"MMXXIV\"\n```",
    starterCode: "function toRoman(number) {\n  // your code here\n}",
    solution: "function toRoman(number) {\n  const values = [\n    [1000, \"M\"], [900, \"CM\"], [500, \"D\"], [400, \"CD\"],\n    [100, \"C\"], [90, \"XC\"], [50, \"L\"], [40, \"XL\"],\n    [10, \"X\"], [9, \"IX\"], [5, \"V\"], [4, \"IV\"], [1, \"I\"]\n  ];\n  let result = \"\";\n  for (const [value, numeral] of values) {\n    while (number >= value) {\n      result += numeral;\n      number -= value;\n    }\n  }\n  return result;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return toRoman;")();
  const tests = [
    [1, "I"], [4, "IV"], [9, "IX"], [14, "XIV"],
    [40, "XL"], [90, "XC"], [400, "CD"], [900, "CM"],
    [1990, "MCMXC"], [2024, "MMXXIV"], [3999, "MMMCMXCIX"]
  ];
  return tests.map(([input, expected]) => {
    const got = fn(input);
    return { pass: got === expected, description: "toRoman(" + input + ") should return " + JSON.stringify(expected), got: JSON.stringify(got) };
  });
}`,
    hints: [
      "Can you build the result by repeatedly subtracting the largest possible Roman value?",
      "Create a lookup table of values and numerals in descending order, including subtractive pairs like 900, 400, 90, 40, 9, and 4.",
      "Loop through the lookup table. While the number is >= the current value, append the numeral and subtract the value."
    ],
    resources: [
      { label: "MDN: while", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while", description: "The while loop statement" },
      { label: "MDN: for...of", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of", description: "Iterating over arrays with for...of" }
    ]
  },
  {
    id: 473,
    title: "Matching Brackets",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["stacks", "strings", "validation"],
    description: "Check if brackets, braces, and parentheses are properly matched and nested.",
    instructions: "Write a function `isPaired(input)` that returns `true` if all brackets are correctly matched and nested, `false` otherwise.\n\nOnly `()`, `[]`, and `{}` matter. Other characters should be ignored.\n\n```js\nisPaired(\"()\") // => true\nisPaired(\"([{}])\") // => true\nisPaired(\"([)\") // => false\nisPaired(\"{what is (4 + 5) * 2}\") // => true\n```",
    starterCode: "function isPaired(input) {\n  // your code here\n}",
    solution: "function isPaired(input) {\n  const stack = [];\n  const pairs = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\n  for (const ch of input) {\n    if (\"([{\".includes(ch)) {\n      stack.push(ch);\n    } else if (\")]}\".includes(ch)) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return isPaired;")();
  return [
    { pass: fn("()") === true, description: "Simple parens", got: String(fn("()")) },
    { pass: fn("([{}])") === true, description: "Nested mixed brackets", got: String(fn("([{}])")) },
    { pass: fn("([)") === false, description: "Mismatched brackets", got: String(fn("([)")) },
    { pass: fn("{what is (4 + 5) * 2}") === true, description: "With other characters", got: String(fn("{what is (4 + 5) * 2}")) },
    { pass: fn("") === true, description: "Empty string", got: String(fn("")) },
    { pass: fn("(") === false, description: "Unclosed bracket", got: String(fn("(")) },
    { pass: fn("([{}()])") === true, description: "Complex nesting", got: String(fn("([{}()])")) }
  ];
}`,
    hints: [
      "What data structure lets you match the most recent opening bracket with the current closing bracket?",
      "Use a stack: push opening brackets and pop when you see a closing bracket. Check that the popped bracket matches.",
      "Loop through each character. Push openers onto a stack. For closers, pop the stack and verify it matches. At the end, the stack should be empty."
    ],
    resources: [
      { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Push elements onto an array (stack)" },
      { label: "MDN: Array.prototype.pop()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop", description: "Pop elements from an array (stack)" }
    ]
  },
  {
    id: 474,
    title: "Luhn Algorithm",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["numbers", "validation", "strings"],
    description: "Validate a number string using the Luhn algorithm.",
    instructions: "Write a function `valid(input)` that checks if a string is valid per the Luhn algorithm.\n\nRules:\n- Strip spaces; reject if any non-digit remains or length < 2\n- Starting from the rightmost digit, double every second digit\n- If doubling produces a value > 9, subtract 9\n- Sum all digits; valid if sum % 10 === 0\n\n```js\nvalid(\"4539 3195 0343 6467\") // => true\nvalid(\"8273 1232 7352 0569\") // => false\nvalid(\"059a\") // => false\nvalid(\"0\") // => false\n```",
    starterCode: "function valid(input) {\n  // your code here\n}",
    solution: "function valid(input) {\n  const stripped = input.replace(/ /g, \"\");\n  if (stripped.length <= 1 || /[^0-9]/.test(stripped)) return false;\n  let sum = 0;\n  let double = false;\n  for (let i = stripped.length - 1; i >= 0; i--) {\n    let digit = Number(stripped[i]);\n    if (double) {\n      digit *= 2;\n      if (digit > 9) digit -= 9;\n    }\n    sum += digit;\n    double = !double;\n  }\n  return sum % 10 === 0;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return valid;")();
  return [
    { pass: fn("4539 3195 0343 6467") === true, description: "Valid number with spaces", got: String(fn("4539 3195 0343 6467")) },
    { pass: fn("8273 1232 7352 0569") === false, description: "Invalid number", got: String(fn("8273 1232 7352 0569")) },
    { pass: fn("059a") === false, description: "Non-digit character", got: String(fn("059a")) },
    { pass: fn("0") === false, description: "Single zero", got: String(fn("0")) },
    { pass: fn("00") === true, description: "Two zeros", got: String(fn("00")) },
    { pass: fn(" 0") === false, description: "Single zero with space", got: String(fn(" 0")) },
    { pass: fn("091") === true, description: "091 is valid", got: String(fn("091")) }
  ];
}`,
    hints: [
      "How do you process digits from right to left and apply different logic to every other digit?",
      "Strip spaces, reject non-digits, then iterate from the right. Double every second digit and subtract 9 if the result exceeds 9.",
      "After processing, sum all digits. The number is valid if the total is divisible by 10."
    ],
    resources: [
      { label: "MDN: String.prototype.replace()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace", description: "Replace characters in strings" },
      { label: "MDN: RegExp", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp", description: "Regular expressions for pattern matching" }
    ]
  },
  {
    id: 475,
    title: "Scrabble Score",
    type: "js",
    tier: 3,
    category: ["data-structures", "strings"],
    tags: ["strings", "mapping", "objects"],
    description: "Calculate the Scrabble score for a given word.",
    instructions: "Write a function `score(word)` that calculates the Scrabble score.\n\nLetter values:\n- 1: A, E, I, O, U, L, N, R, S, T\n- 2: D, G\n- 3: B, C, M, P\n- 4: F, H, V, W, Y\n- 5: K\n- 8: J, X\n- 10: Q, Z\n\n```js\nscore(\"cabbage\") // => 14\nscore(\"\") // => 0\nscore(\"quirky\") // => 22\n```",
    starterCode: "function score(word) {\n  // your code here\n}",
    solution: "function score(word) {\n  const values = { A:1,E:1,I:1,O:1,U:1,L:1,N:1,R:1,S:1,T:1,D:2,G:2,B:3,C:3,M:3,P:3,F:4,H:4,V:4,W:4,Y:4,K:5,J:8,X:8,Q:10,Z:10 };\n  return (word || \"\").toUpperCase().split(\"\").reduce((sum, ch) => sum + (values[ch] || 0), 0);\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return score;")();
  return [
    { pass: fn("cabbage") === 14, description: "Score of cabbage", got: String(fn("cabbage")) },
    { pass: fn("") === 0, description: "Empty string scores 0", got: String(fn("")) },
    { pass: fn("quirky") === 22, description: "Score of quirky", got: String(fn("quirky")) },
    { pass: fn("a") === 1, description: "Single low-value letter", got: String(fn("a")) },
    { pass: fn("zoo") === 12, description: "Score of zoo", got: String(fn("zoo")) },
    { pass: fn(null) === 0, description: "Null input scores 0", got: String(fn(null)) }
  ];
}`,
    hints: [
      "How can you map each letter to its point value and sum them up?",
      "Create an object mapping each uppercase letter to its score. Convert the word to uppercase and look up each letter.",
      "Use split and reduce to sum up the score for each character in the word."
    ],
    resources: [
      { label: "MDN: Array.prototype.reduce()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce", description: "Reduce an array to a single value" },
      { label: "MDN: String.prototype.toUpperCase()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase", description: "Convert a string to uppercase" }
    ]
  },
  {
    id: 476,
    title: "Pig Latin",
    type: "js",
    tier: 3,
    category: ["data-structures", "strings"],
    tags: ["strings", "regex", "transformation"],
    description: "Translate a sentence into Pig Latin.",
    instructions: "Write a function `translate(sentence)` that converts English to Pig Latin.\n\nRules:\n1. Words starting with a vowel sound (a, e, i, o, u) or \"xr\"/\"yt\": add \"ay\" to the end\n2. Words starting with consonant(s): move consonant cluster to end, then add \"ay\"\n3. If \"qu\" appears in the consonant cluster, move both to end (e.g., \"square\" -> \"aresqu\" + \"ay\")\n\n```js\ntranslate(\"apple\") // => \"appleay\"\ntranslate(\"chair\") // => \"airchay\"\ntranslate(\"square\") // => \"aresquay\"\ntranslate(\"yellow\") // => \"ellowyay\"\n```",
    starterCode: "function translate(sentence) {\n  // your code here\n}",
    solution: "function translate(sentence) {\n  return sentence.split(\" \").map(word => {\n    if (/^([aeiou]|xr|yt)/i.test(word)) return word + \"ay\";\n    const match = word.match(/^([^aeiou]*qu|[^aeiou]+)/i);\n    if (match) return word.slice(match[1].length) + match[1] + \"ay\";\n    return word + \"ay\";\n  }).join(\" \");\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return translate;")();
  return [
    { pass: fn("apple") === "appleay", description: "Word starting with vowel", got: fn("apple") },
    { pass: fn("chair") === "airchay", description: "Word starting with ch", got: fn("chair") },
    { pass: fn("square") === "aresquay", description: "Word with qu cluster", got: fn("square") },
    { pass: fn("yellow") === "ellowyay", description: "Word starting with y consonant", got: fn("yellow") },
    { pass: fn("xray") === "xrayay", description: "Word starting with xr", got: fn("xray") },
    { pass: fn("pig") === "igpay", description: "Simple consonant start", got: fn("pig") },
    { pass: fn("three") === "eethray", description: "Word starting with thr", got: fn("three") }
  ];
}`,
    hints: [
      "How do you identify whether a word starts with a vowel sound vs. a consonant cluster?",
      "Check for vowel-start words first (including xr, yt). Otherwise, match the leading consonant cluster (including qu if present).",
      "Use a regex like /^([^aeiou]*qu|[^aeiou]+)/ to capture the consonant prefix, then move it to the end and add \"ay\"."
    ],
    resources: [
      { label: "MDN: String.prototype.match()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match", description: "Match a string against a regex" },
      { label: "MDN: RegExp", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp", description: "Regular expressions" }
    ]
  },
  {
    id: 477,
    title: "Pascal's Triangle",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["arrays", "math", "recursion"],
    description: "Generate the specified number of rows of Pascal's Triangle.",
    instructions: "Write a function `rows(count)` that returns the first `count` rows of Pascal's Triangle.\n\nEach row starts and ends with 1. Interior values are the sum of the two values above.\n\n```js\nrows(1) // => [[1]]\nrows(4) // => [[1],[1,1],[1,2,1],[1,3,3,1]]\n```",
    starterCode: "function rows(count) {\n  // your code here\n}",
    solution: "function rows(count) {\n  const result = [];\n  for (let i = 0; i < count; i++) {\n    const row = [1];\n    for (let j = 1; j < i; j++) {\n      row.push(result[i - 1][j - 1] + result[i - 1][j]);\n    }\n    if (i > 0) row.push(1);\n    result.push(row);\n  }\n  return result;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return rows;")();
  const r1 = fn(1);
  const r4 = fn(4);
  const r6 = fn(6);
  const r0 = fn(0);
  return [
    { pass: JSON.stringify(r1) === "[[1]]", description: "One row", got: JSON.stringify(r1) },
    { pass: JSON.stringify(r4) === "[[1],[1,1],[1,2,1],[1,3,3,1]]", description: "Four rows", got: JSON.stringify(r4) },
    { pass: JSON.stringify(r6[5]) === "[1,5,10,10,5,1]", description: "Sixth row values", got: JSON.stringify(r6[5]) },
    { pass: JSON.stringify(r0) === "[]", description: "Zero rows", got: JSON.stringify(r0) },
    { pass: r4.length === 4, description: "Correct number of rows", got: String(r4.length) }
  ];
}`,
    hints: [
      "How does each row relate to the row above it?",
      "Each interior element is the sum of the two elements directly above it. Start and end each row with 1.",
      "Build each row by iterating: row[j] = previousRow[j-1] + previousRow[j] for interior positions."
    ],
    resources: [
      { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Push elements to an array" },
      { label: "MDN: Nested loops", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration", description: "Loops and iteration in JavaScript" }
    ]
  },
  {
    id: 478,
    title: "Sieve of Eratosthenes",
    type: "js",
    tier: 3,
    category: ["algorithms", "performance"],
    tags: ["math", "primes", "algorithms"],
    description: "Find all prime numbers up to a given limit using the Sieve of Eratosthenes.",
    instructions: "Write a function `primes(limit)` that returns an array of all primes up to and including `limit`.\n\nUse the Sieve of Eratosthenes algorithm: mark composites by iterating through multiples.\n\n```js\nprimes(10) // => [2, 3, 5, 7]\nprimes(1)  // => []\n```",
    starterCode: "function primes(limit) {\n  // your code here\n}",
    solution: "function primes(limit) {\n  const sieve = new Array(limit + 1).fill(true);\n  sieve[0] = sieve[1] = false;\n  for (let i = 2; i * i <= limit; i++) {\n    if (sieve[i]) {\n      for (let j = i * i; j <= limit; j += i) {\n        sieve[j] = false;\n      }\n    }\n  }\n  return sieve.reduce((acc, val, idx) => val ? [...acc, idx] : acc, []);\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return primes;")();
  const r10 = fn(10);
  const r1 = fn(1);
  const r30 = fn(30);
  const r2 = fn(2);
  return [
    { pass: JSON.stringify(r10) === "[2,3,5,7]", description: "Primes up to 10", got: JSON.stringify(r10) },
    { pass: JSON.stringify(r1) === "[]", description: "Primes up to 1 is empty", got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === "[2]", description: "Primes up to 2", got: JSON.stringify(r2) },
    { pass: JSON.stringify(r30) === "[2,3,5,7,11,13,17,19,23,29]", description: "Primes up to 30", got: JSON.stringify(r30) },
    { pass: r10.length === 4, description: "Correct count for limit 10", got: String(r10.length) }
  ];
}`,
    hints: [
      "How does the Sieve of Eratosthenes eliminate composite numbers?",
      "Create a boolean array. For each prime found, mark all its multiples as composite starting from its square.",
      "Initialize an array of true values. For each index i starting at 2, if it is still true, mark all multiples i*i, i*i+i, ... as false. Collect the true indices."
    ],
    resources: [
      { label: "MDN: Array.prototype.fill()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill", description: "Fill an array with a static value" },
      { label: "MDN: Array.prototype.reduce()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce", description: "Reduce an array to collect results" }
    ]
  },
  {
    id: 479,
    title: "Grade School",
    type: "js",
    tier: 3,
    category: ["data-structures", "objects"],
    tags: ["objects", "arrays", "sorting"],
    description: "Manage a school roster: add students to grades and retrieve sorted rosters.",
    instructions: "Write a class `GradeSchool` with the following methods:\n\n- `add(name, grade)` - add a student to a grade\n- `grade(gradeNum)` - return sorted list of students in that grade\n- `roster()` - return an object with grade keys and sorted student arrays\n\nStudents within a grade should be sorted alphabetically. If a student is added to a new grade, remove them from the old one.\n\n```js\nconst school = new GradeSchool();\nschool.add(\"Jim\", 2);\nschool.add(\"Anna\", 2);\nschool.grade(2) // => [\"Anna\", \"Jim\"]\n```",
    starterCode: "class GradeSchool {\n  constructor() {\n    // your code here\n  }\n\n  add(name, grade) {\n    // your code here\n  }\n\n  grade(gradeNum) {\n    // your code here\n  }\n\n  roster() {\n    // your code here\n  }\n}",
    solution: "class GradeSchool {\n  constructor() {\n    this._roster = {};\n  }\n\n  add(name, grade) {\n    for (const g in this._roster) {\n      this._roster[g] = this._roster[g].filter(s => s !== name);\n    }\n    if (!this._roster[grade]) this._roster[grade] = [];\n    this._roster[grade].push(name);\n    this._roster[grade].sort();\n  }\n\n  grade(gradeNum) {\n    return [...(this._roster[gradeNum] || [])];\n  }\n\n  roster() {\n    const result = {};\n    for (const g of Object.keys(this._roster).sort((a, b) => a - b)) {\n      result[g] = [...this._roster[g]];\n    }\n    return result;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return GradeSchool;")();
  const s = new Cls();
  s.add("Jim", 2);
  s.add("Anna", 2);
  s.add("Barb", 1);
  const g2 = s.grade(2);
  const g1 = s.grade(1);
  const r = s.roster();
  const empty = s.grade(5);
  s.add("Jim", 3);
  const g2after = s.grade(2);
  return [
    { pass: JSON.stringify(g2) === '["Anna","Jim"]', description: "Grade 2 sorted alphabetically", got: JSON.stringify(g2) },
    { pass: JSON.stringify(g1) === '["Barb"]', description: "Grade 1 has Barb", got: JSON.stringify(g1) },
    { pass: JSON.stringify(r["1"]) === '["Barb"]' && JSON.stringify(r["2"]) === '["Anna","Jim"]', description: "Roster returns all grades", got: JSON.stringify(r) },
    { pass: JSON.stringify(empty) === "[]", description: "Empty grade returns empty array", got: JSON.stringify(empty) },
    { pass: JSON.stringify(g2after) === '["Anna"]', description: "Moving student removes from old grade", got: JSON.stringify(g2after) }
  ];
}`,
    hints: [
      "How would you store students organized by grade and keep them sorted?",
      "Use an object with grade numbers as keys and sorted arrays as values. When adding, remove the student from any existing grade first.",
      "In add(), filter the student from all grades, then push to the new grade and sort. Return copies from grade() and roster() to prevent mutation."
    ],
    resources: [
      { label: "MDN: Array.prototype.sort()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort", description: "Sort array elements" },
      { label: "MDN: Array.prototype.filter()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter", description: "Filter array elements" }
    ]
  }
];

// --- Exercises 480-489 ---
const exercises480 = [
  {
    id: 480,
    title: "Allergies",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["bitwise", "arrays", "mapping"],
    description: "Determine allergies from a score using bitwise operations.",
    instructions: "Write a class `Allergies` that takes a score and provides:\n\n- `list()` - returns array of allergen names the person is allergic to\n- `allergicTo(item)` - returns true if allergic to that item\n\nAllergen scores (powers of 2):\n- eggs: 1, peanuts: 2, shellfish: 4, strawberries: 8\n- tomatoes: 16, chocolate: 32, pollen: 64, cats: 128\n\n```js\nconst a = new Allergies(34);\na.list()           // => [\"peanuts\", \"chocolate\"]\na.allergicTo(\"peanuts\") // => true\na.allergicTo(\"eggs\")   // => false\n```",
    starterCode: "class Allergies {\n  constructor(score) {\n    // your code here\n  }\n\n  list() {\n    // your code here\n  }\n\n  allergicTo(item) {\n    // your code here\n  }\n}",
    solution: "class Allergies {\n  constructor(score) {\n    this.score = score;\n    this.allergens = [\n      \"eggs\", \"peanuts\", \"shellfish\", \"strawberries\",\n      \"tomatoes\", \"chocolate\", \"pollen\", \"cats\"\n    ];\n  }\n\n  list() {\n    return this.allergens.filter((_, i) => this.score & (1 << i));\n  }\n\n  allergicTo(item) {\n    const idx = this.allergens.indexOf(item);\n    return idx !== -1 && (this.score & (1 << idx)) !== 0;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return Allergies;")();
  const a34 = new Cls(34);
  const a0 = new Cls(0);
  const a255 = new Cls(255);
  const a257 = new Cls(257);
  return [
    { pass: JSON.stringify(a34.list()) === '["peanuts","chocolate"]', description: "Score 34 lists peanuts and chocolate", got: JSON.stringify(a34.list()) },
    { pass: a34.allergicTo("peanuts") === true, description: "Score 34 is allergic to peanuts", got: String(a34.allergicTo("peanuts")) },
    { pass: a34.allergicTo("eggs") === false, description: "Score 34 is not allergic to eggs", got: String(a34.allergicTo("eggs")) },
    { pass: a0.list().length === 0, description: "Score 0 has no allergies", got: String(a0.list().length) },
    { pass: a255.list().length === 8, description: "Score 255 is allergic to everything", got: String(a255.list().length) },
    { pass: a257.allergicTo("eggs") === true, description: "Score 257 with extra bits still detects eggs", got: String(a257.allergicTo("eggs")) }
  ];
}`,
    hints: [
      "How can bitwise AND help determine if a specific bit is set in the score?",
      "Each allergen maps to a power of 2. Use score & (1 << index) to check if that bit is set.",
      "Store allergens in order by their bit position. Filter the list using bitwise AND to find active allergies."
    ],
    resources: [
      { label: "MDN: Bitwise AND (&)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND", description: "Bitwise AND operator" },
      { label: "MDN: Left shift (<<)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Left_shift", description: "Left shift operator" }
    ]
  },
  {
    id: 481,
    title: "Secret Handshake",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["bitwise", "arrays", "binary"],
    description: "Convert a number to a sequence of actions using binary representation.",
    instructions: "Write a function `commands(number)` that converts a number (1-31) to a secret handshake sequence.\n\nBit meanings:\n- 1 (00001): \"wink\"\n- 2 (00010): \"double blink\"\n- 4 (00100): \"close your eyes\"\n- 8 (01000): \"jump\"\n- 16 (10000): reverse the order\n\n```js\ncommands(9)  // => [\"wink\", \"jump\"]\ncommands(19) // => [\"jump\", \"wink\"] (reversed)\n```",
    starterCode: "function commands(number) {\n  // your code here\n}",
    solution: "function commands(number) {\n  const actions = [\"wink\", \"double blink\", \"close your eyes\", \"jump\"];\n  const result = actions.filter((_, i) => number & (1 << i));\n  return number & 16 ? result.reverse() : result;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return commands;")();
  return [
    { pass: JSON.stringify(fn(9)) === '["wink","jump"]', description: "9 gives wink and jump", got: JSON.stringify(fn(9)) },
    { pass: JSON.stringify(fn(19)) === '["double blink","wink"]', description: "19 reverses the result", got: JSON.stringify(fn(19)) },
    { pass: JSON.stringify(fn(0)) === '[]', description: "0 gives empty array", got: JSON.stringify(fn(0)) },
    { pass: JSON.stringify(fn(31)) === '["jump","close your eyes","double blink","wink"]', description: "31 gives all reversed", got: JSON.stringify(fn(31)) },
    { pass: JSON.stringify(fn(2)) === '["double blink"]', description: "2 gives double blink", got: JSON.stringify(fn(2)) }
  ];
}`,
    hints: [
      "How do you test individual bits of a number to determine which actions apply?",
      "Use bitwise AND with each power of 2 to check which actions are active. Check bit 16 to decide if the result should be reversed.",
      "Filter actions by checking number & (1 << i). If number & 16 is set, reverse the result before returning."
    ],
    resources: [
      { label: "MDN: Bitwise AND (&)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND", description: "Bitwise AND operator" },
      { label: "MDN: Array.prototype.reverse()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse", description: "Reverse an array in place" }
    ]
  },
  {
    id: 482,
    title: "Clock",
    type: "js",
    tier: 3,
    category: ["js-fundamentals", "classes"],
    tags: ["classes", "time", "math"],
    description: "Represent time without dates, supporting add/subtract minutes and equality.",
    instructions: "Write a class `Clock` that represents time as hours and minutes (no date).\n\n- `new Clock(hour, minute)` - handles overflow/underflow (e.g., 25:00 -> 01:00, -1:00 -> 23:00)\n- `toString()` - returns \"HH:MM\" format\n- `plus(minutes)` - returns a new Clock with added minutes\n- `minus(minutes)` - returns a new Clock with subtracted minutes\n- `equals(other)` - returns true if same time\n\n```js\nnew Clock(25, 0).toString()  // => \"01:00\"\nnew Clock(10, 0).plus(3).toString()  // => \"10:03\"\n```",
    starterCode: "class Clock {\n  constructor(hour, minute) {\n    // your code here\n  }\n\n  toString() {\n    // your code here\n  }\n\n  plus(minutes) {\n    // your code here\n  }\n\n  minus(minutes) {\n    // your code here\n  }\n\n  equals(other) {\n    // your code here\n  }\n}",
    solution: "class Clock {\n  constructor(hour, minute) {\n    let totalMinutes = (hour * 60 + (minute || 0)) % 1440;\n    if (totalMinutes < 0) totalMinutes += 1440;\n    this.hours = Math.floor(totalMinutes / 60);\n    this.minutes = totalMinutes % 60;\n  }\n\n  toString() {\n    return String(this.hours).padStart(2, \"0\") + \":\" + String(this.minutes).padStart(2, \"0\");\n  }\n\n  plus(minutes) {\n    return new Clock(this.hours, this.minutes + minutes);\n  }\n\n  minus(minutes) {\n    return new Clock(this.hours, this.minutes - minutes);\n  }\n\n  equals(other) {\n    return this.hours === other.hours && this.minutes === other.minutes;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return Clock;")();
  const c1 = new Cls(25, 0);
  const c2 = new Cls(10, 0).plus(3);
  const c3 = new Cls(0, -1);
  const c4 = new Cls(10, 0);
  const c5 = new Cls(10, 0);
  const c6 = new Cls(10, 0).minus(90);
  return [
    { pass: c1.toString() === "01:00", description: "25:00 wraps to 01:00", got: c1.toString() },
    { pass: c2.toString() === "10:03", description: "10:00 plus 3 minutes", got: c2.toString() },
    { pass: c3.toString() === "23:59", description: "0:-1 wraps to 23:59", got: c3.toString() },
    { pass: c4.equals(c5) === true, description: "Equal clocks", got: String(c4.equals(c5)) },
    { pass: c6.toString() === "08:30", description: "10:00 minus 90 minutes", got: c6.toString() },
    { pass: new Cls(-1, 0).toString() === "23:00", description: "Negative hour wraps", got: new Cls(-1, 0).toString() }
  ];
}`,
    hints: [
      "How can you normalize hours and minutes to always stay within 0-23 and 0-59?",
      "Convert everything to total minutes, use modulo 1440 (24*60), and handle negative values by adding 1440.",
      "In the constructor, compute totalMinutes = hour*60 + minute, mod 1440. If negative, add 1440. Extract hours and minutes from the normalized total."
    ],
    resources: [
      { label: "MDN: String.prototype.padStart()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart", description: "Pad a string to a given length" },
      { label: "MDN: Remainder (%)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder", description: "Remainder (modulo) operator" }
    ]
  },
  {
    id: 483,
    title: "Robot Name",
    type: "js",
    tier: 3,
    category: ["js-fundamentals", "classes"],
    tags: ["classes", "random", "state"],
    description: "Generate unique robot names in the format XX### (2 letters + 3 digits).",
    instructions: "Write a class `Robot` where each instance gets a unique name in the format of two uppercase letters followed by three digits (e.g., \"AB123\").\n\n- `name` - property that returns the robot name\n- `reset()` - generates a new unique name\n\nAll names must be unique across all Robot instances.\n\n```js\nconst r = new Robot();\nr.name // => e.g. \"RX837\"\nr.reset();\nr.name // => a new name like \"AB123\"\n```",
    starterCode: "class Robot {\n  constructor() {\n    // your code here\n  }\n\n  get name() {\n    // your code here\n  }\n\n  reset() {\n    // your code here\n  }\n}",
    solution: "class Robot {\n  static usedNames = new Set();\n\n  constructor() {\n    this._name = Robot._generateName();\n  }\n\n  get name() {\n    return this._name;\n  }\n\n  reset() {\n    Robot.usedNames.delete(this._name);\n    this._name = Robot._generateName();\n  }\n\n  static _generateName() {\n    let name;\n    do {\n      const letters = String.fromCharCode(\n        65 + Math.floor(Math.random() * 26),\n        65 + Math.floor(Math.random() * 26)\n      );\n      const digits = String(Math.floor(Math.random() * 1000)).padStart(3, \"0\");\n      name = letters + digits;\n    } while (Robot.usedNames.has(name));\n    Robot.usedNames.add(name);\n    return name;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return Robot;")();
  const r1 = new Cls();
  const r2 = new Cls();
  const name1 = r1.name;
  const name2 = r2.name;
  const pattern = /^[A-Z]{2}[0-9]{3}$/;
  r1.reset();
  const name3 = r1.name;
  return [
    { pass: pattern.test(name1), description: "Name matches XX### format", got: name1 },
    { pass: pattern.test(name2), description: "Second robot also matches format", got: name2 },
    { pass: name1 !== name2, description: "Two robots have different names", got: name1 + " vs " + name2 },
    { pass: name1 !== name3, description: "Reset generates a new name", got: name1 + " vs " + name3 },
    { pass: pattern.test(name3), description: "Reset name still matches format", got: name3 }
  ];
}`,
    hints: [
      "How do you ensure every robot name is unique, even after resets?",
      "Use a static Set to track all used names. Generate random names until you find one not in the set.",
      "Use String.fromCharCode(65 + random) for letters and padStart for digits. Store used names in a class-level Set."
    ],
    resources: [
      { label: "MDN: String.fromCharCode()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode", description: "Create a string from character codes" },
      { label: "MDN: Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", description: "Set data structure for unique values" }
    ]
  },
  {
    id: 484,
    title: "Strain",
    type: "js",
    tier: 3,
    category: ["functions", "higher-order"],
    tags: ["functions", "higher-order", "arrays"],
    description: "Implement keep and discard operations without using built-in filter.",
    instructions: "Write two functions:\n\n- `keep(collection, predicate)` - returns elements where predicate returns true\n- `discard(collection, predicate)` - returns elements where predicate returns false\n\nDo NOT use `Array.prototype.filter`.\n\n```js\nkeep([1, 2, 3, 4], x => x % 2 === 0) // => [2, 4]\ndiscard([1, 2, 3, 4], x => x % 2 === 0) // => [1, 3]\n```",
    starterCode: "function keep(collection, predicate) {\n  // your code here - do NOT use filter\n}\n\nfunction discard(collection, predicate) {\n  // your code here - do NOT use filter\n}",
    solution: "function keep(collection, predicate) {\n  const result = [];\n  for (const item of collection) {\n    if (predicate(item)) result.push(item);\n  }\n  return result;\n}\n\nfunction discard(collection, predicate) {\n  return keep(collection, item => !predicate(item));\n}",
    testRunner: `(code) => {
  const fns = new Function(code + "; return { keep, discard };")();
  const k1 = fns.keep([1, 2, 3, 4], function(x) { return x % 2 === 0; });
  const d1 = fns.discard([1, 2, 3, 4], function(x) { return x % 2 === 0; });
  const k2 = fns.keep([], function(x) { return true; });
  const k3 = fns.keep(["a", "bb", "ccc"], function(x) { return x.length > 1; });
  const d2 = fns.discard(["a", "bb", "ccc"], function(x) { return x.length > 1; });
  return [
    { pass: JSON.stringify(k1) === "[2,4]", description: "Keep even numbers", got: JSON.stringify(k1) },
    { pass: JSON.stringify(d1) === "[1,3]", description: "Discard even numbers", got: JSON.stringify(d1) },
    { pass: JSON.stringify(k2) === "[]", description: "Keep from empty array", got: JSON.stringify(k2) },
    { pass: JSON.stringify(k3) === '["bb","ccc"]', description: "Keep strings longer than 1", got: JSON.stringify(k3) },
    { pass: JSON.stringify(d2) === '["a"]', description: "Discard strings longer than 1", got: JSON.stringify(d2) }
  ];
}`,
    hints: [
      "How would you implement filtering without using the built-in filter method?",
      "Use a for loop to iterate and push matching elements into a new array. Discard is the inverse of keep.",
      "For keep, loop through and push items where predicate(item) is true. For discard, call keep with a negated predicate."
    ],
    resources: [
      { label: "MDN: for...of", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of", description: "Iterate over iterable objects" },
      { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Add elements to an array" }
    ]
  },
  {
    id: 485,
    title: "Perfect Numbers",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["math", "numbers", "classification"],
    description: "Classify numbers as perfect, abundant, or deficient based on their aliquot sum.",
    instructions: "Write a function `classify(number)` that determines if a number is perfect, abundant, or deficient.\n\nThe aliquot sum is the sum of all proper divisors (excluding the number itself).\n\n- Perfect: aliquot sum equals the number (e.g., 6 = 1+2+3)\n- Abundant: aliquot sum is greater than the number\n- Deficient: aliquot sum is less than the number\n\nThrow an error for numbers less than 1.\n\n```js\nclassify(6)  // => \"perfect\"\nclassify(12) // => \"abundant\"\nclassify(7)  // => \"deficient\"\n```",
    starterCode: "function classify(number) {\n  // your code here\n}",
    solution: "function classify(number) {\n  if (number < 1) throw new Error(\"Classification is only possible for positive integers\");\n  let sum = 0;\n  for (let i = 1; i <= Math.floor(number / 2); i++) {\n    if (number % i === 0) sum += i;\n  }\n  if (sum === number) return \"perfect\";\n  if (sum > number) return \"abundant\";\n  return \"deficient\";\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return classify;")();
  let errorThrown = false;
  try { fn(-1); } catch(e) { errorThrown = true; }
  return [
    { pass: fn(6) === "perfect", description: "6 is perfect", got: fn(6) },
    { pass: fn(28) === "perfect", description: "28 is perfect", got: fn(28) },
    { pass: fn(12) === "abundant", description: "12 is abundant", got: fn(12) },
    { pass: fn(7) === "deficient", description: "7 is deficient", got: fn(7) },
    { pass: fn(1) === "deficient", description: "1 is deficient", got: fn(1) },
    { pass: errorThrown, description: "Throws for negative numbers", got: errorThrown ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How do you find all proper divisors of a number?",
      "Loop from 1 to number/2 and collect divisors where number % i === 0. Sum them up.",
      "Compare the sum of divisors to the original number: equal means perfect, greater means abundant, less means deficient."
    ],
    resources: [
      { label: "MDN: Remainder (%)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder", description: "Remainder operator for divisibility checks" },
      { label: "MDN: Math.floor()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor", description: "Round down to integer" }
    ]
  },
  {
    id: 486,
    title: "Sum of Multiples",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["math", "sets", "numbers"],
    description: "Find the sum of all unique multiples of given factors below a limit.",
    instructions: "Write a function `sum(factors, limit)` that returns the sum of all unique multiples of the given factors that are less than the limit.\n\n```js\nsum([3, 5], 20)  // => 78 (3+5+6+9+10+12+15+18)\nsum([7, 13], 10) // => 7\nsum([], 10)      // => 0\n```",
    starterCode: "function sum(factors, limit) {\n  // your code here\n}",
    solution: "function sum(factors, limit) {\n  const multiples = new Set();\n  for (const f of factors) {\n    if (f === 0) continue;\n    for (let m = f; m < limit; m += f) {\n      multiples.add(m);\n    }\n  }\n  let total = 0;\n  for (const m of multiples) total += m;\n  return total;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return sum;")();
  return [
    { pass: fn([3, 5], 20) === 78, description: "Multiples of 3 and 5 below 20", got: String(fn([3, 5], 20)) },
    { pass: fn([7, 13], 10) === 7, description: "Multiples of 7 and 13 below 10", got: String(fn([7, 13], 10)) },
    { pass: fn([], 10) === 0, description: "No factors", got: String(fn([], 10)) },
    { pass: fn([3, 5], 1) === 0, description: "Limit of 1", got: String(fn([3, 5], 1)) },
    { pass: fn([2, 3], 7) === 15, description: "Multiples of 2 and 3 below 7", got: String(fn([2, 3], 7)) }
  ];
}`,
    hints: [
      "How do you collect all multiples of several factors while avoiding duplicates?",
      "Use a Set to store multiples. For each factor, generate its multiples below the limit.",
      "Loop through each factor, add all its multiples below the limit to a Set (for uniqueness), then sum the Set values."
    ],
    resources: [
      { label: "MDN: Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set", description: "Set for unique values" },
      { label: "MDN: for...of", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of", description: "Iterate over iterables" }
    ]
  },
  {
    id: 487,
    title: "All Your Base",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["math", "numbers", "conversion"],
    description: "Convert a number from one base to another.",
    instructions: "Write a function `convert(digits, inputBase, outputBase)` that converts a number represented as an array of digits in `inputBase` to an array of digits in `outputBase`.\n\nThrow an error for invalid inputs (base < 2, invalid digits, empty input).\n\n```js\nconvert([1, 0], 2, 10)   // => [2]     (binary 10 = decimal 2)\nconvert([1, 0, 1], 2, 8) // => [5]     (binary 101 = octal 5)\nconvert([7], 10, 2)      // => [1, 1, 1] (decimal 7 = binary 111)\n```",
    starterCode: "function convert(digits, inputBase, outputBase) {\n  // your code here\n}",
    solution: "function convert(digits, inputBase, outputBase) {\n  if (inputBase < 2 || Math.floor(inputBase) !== inputBase) throw new Error(\"Wrong input base\");\n  if (outputBase < 2 || Math.floor(outputBase) !== outputBase) throw new Error(\"Wrong output base\");\n  if (digits.length === 0) throw new Error(\"Input has wrong format\");\n  if (digits.length > 1 && digits[0] === 0) throw new Error(\"Input has wrong format\");\n  for (const d of digits) {\n    if (d < 0 || d >= inputBase || Math.floor(d) !== d) throw new Error(\"Input has wrong format\");\n  }\n  let value = digits.reduce((acc, d) => acc * inputBase + d, 0);\n  if (value === 0) return [0];\n  const result = [];\n  while (value > 0) {\n    result.unshift(value % outputBase);\n    value = Math.floor(value / outputBase);\n  }\n  return result;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return convert;")();
  let err1 = false;
  try { fn([1], 1, 10); } catch(e) { err1 = true; }
  let err2 = false;
  try { fn([], 2, 10); } catch(e) { err2 = true; }
  return [
    { pass: JSON.stringify(fn([1, 0], 2, 10)) === "[2]", description: "Binary 10 to decimal", got: JSON.stringify(fn([1, 0], 2, 10)) },
    { pass: JSON.stringify(fn([1, 0, 1], 2, 8)) === "[5]", description: "Binary 101 to octal", got: JSON.stringify(fn([1, 0, 1], 2, 8)) },
    { pass: JSON.stringify(fn([7], 10, 2)) === "[1,1,1]", description: "Decimal 7 to binary", got: JSON.stringify(fn([7], 10, 2)) },
    { pass: JSON.stringify(fn([0], 10, 2)) === "[0]", description: "Zero converts to zero", got: JSON.stringify(fn([0], 10, 2)) },
    { pass: err1, description: "Throws for base < 2", got: err1 ? "Error thrown" : "No error" },
    { pass: err2, description: "Throws for empty input", got: err2 ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How do you convert between arbitrary bases?",
      "First convert the input digits to a base-10 integer, then convert that integer to the output base.",
      "Use reduce to compute the decimal value: acc * inputBase + digit. Then repeatedly divide by outputBase, collecting remainders."
    ],
    resources: [
      { label: "MDN: Array.prototype.reduce()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce", description: "Reduce array to single value" },
      { label: "MDN: Array.prototype.unshift()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift", description: "Add elements to the beginning of an array" }
    ]
  },
  {
    id: 488,
    title: "Rotational Cipher",
    type: "js",
    tier: 3,
    category: ["data-structures", "strings"],
    tags: ["strings", "cipher", "charCodes"],
    description: "Rotate letters by N positions in the alphabet.",
    instructions: "Write a function `rotate(text, shift)` that applies a rotational cipher (like ROT13 but with a configurable shift).\n\nOnly rotate letters. Preserve case and leave non-letter characters unchanged.\n\n```js\nrotate(\"a\", 1)       // => \"b\"\nrotate(\"OMG\", 5)     // => \"TRL\"\nrotate(\"a1b2\", 13)   // => \"n1o2\"\n```",
    starterCode: "function rotate(text, shift) {\n  // your code here\n}",
    solution: "function rotate(text, shift) {\n  return text.split(\"\").map(ch => {\n    const code = ch.charCodeAt(0);\n    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);\n    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);\n    return ch;\n  }).join(\"\");\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return rotate;")();
  return [
    { pass: fn("a", 1) === "b", description: "Rotate a by 1", got: fn("a", 1) },
    { pass: fn("OMG", 5) === "TRL", description: "Rotate OMG by 5", got: fn("OMG", 5) },
    { pass: fn("a1b2", 13) === "n1o2", description: "Non-letters unchanged", got: fn("a1b2", 13) },
    { pass: fn("z", 1) === "a", description: "z wraps to a", got: fn("z", 1) },
    { pass: fn("Hello, World!", 13) === "Uryyb, Jbeyq!", description: "ROT13 preserves case and punctuation", got: fn("Hello, World!", 13) },
    { pass: fn("abc", 0) === "abc", description: "Shift of 0 changes nothing", got: fn("abc", 0) }
  ];
}`,
    hints: [
      "How do you shift a letter by N positions while wrapping around the alphabet?",
      "Use charCodeAt to get the character code, add the shift with modulo 26 to wrap around, then convert back.",
      "For each letter, subtract the base (65 for uppercase, 97 for lowercase), add shift, mod 26, add base back. Use String.fromCharCode."
    ],
    resources: [
      { label: "MDN: String.prototype.charCodeAt()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt", description: "Get the character code at a position" },
      { label: "MDN: String.fromCharCode()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode", description: "Create a string from character codes" }
    ]
  },
  {
    id: 489,
    title: "Atbash Cipher",
    type: "js",
    tier: 3,
    category: ["data-structures", "strings"],
    tags: ["strings", "cipher", "encoding"],
    description: "Encode and decode text using the Atbash cipher (a=z, b=y, c=x, ...).",
    instructions: "Write two functions:\n\n- `encode(text)` - encode plain text to Atbash cipher, grouped in 5-letter chunks\n- `decode(text)` - decode Atbash cipher back to plain text\n\nThe Atbash cipher maps a->z, b->y, c->x, etc. Only letters and digits are kept. Letters are lowercased.\n\n```js\nencode(\"test\")     // => \"gvhg\"\nencode(\"Testing 1 2 3\") // => \"gvhgr mt123\"\ndecode(\"gvhg\")     // => \"test\"\n```",
    starterCode: "function encode(text) {\n  // your code here\n}\n\nfunction decode(text) {\n  // your code here\n}",
    solution: "function encode(text) {\n  const transformed = text.toLowerCase().replace(/[^a-z0-9]/g, \"\").split(\"\").map(ch => {\n    if (ch >= \"a\" && ch <= \"z\") return String.fromCharCode(219 - ch.charCodeAt(0));\n    return ch;\n  }).join(\"\");\n  return transformed.match(/.{1,5}/g).join(\" \");\n}\n\nfunction decode(text) {\n  return text.replace(/ /g, \"\").split(\"\").map(ch => {\n    if (ch >= \"a\" && ch <= \"z\") return String.fromCharCode(219 - ch.charCodeAt(0));\n    return ch;\n  }).join(\"\");\n}",
    testRunner: `(code) => {
  const fns = new Function(code + "; return { encode, decode };")();
  return [
    { pass: fns.encode("test") === "gvhg", description: "Encode test", got: fns.encode("test") },
    { pass: fns.encode("Testing 1 2 3") === "gvhgr mt123", description: "Encode with digits and spaces", got: fns.encode("Testing 1 2 3") },
    { pass: fns.decode("gvhg") === "test", description: "Decode gvhg", got: fns.decode("gvhg") },
    { pass: fns.encode("yes") === "bvh", description: "Encode yes", got: fns.encode("yes") },
    { pass: fns.decode("bvh") === "yes", description: "Decode bvh", got: fns.decode("bvh") },
    { pass: fns.encode("mindblowingly") === "nrmwy oldrm tob", description: "Encode long word with grouping", got: fns.encode("mindblowingly") }
  ];
}`,
    hints: [
      "How does the Atbash cipher relate each letter to its mirror in the alphabet?",
      "a (97) maps to z (122), b (98) maps to y (121). The formula is: 219 - charCode. Only transform letters.",
      "For encoding: lowercase, strip non-alphanumeric, apply the cipher, then group into 5-character chunks. For decoding: strip spaces, apply the same cipher."
    ],
    resources: [
      { label: "MDN: String.prototype.replace()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace", description: "Replace characters using regex" },
      { label: "MDN: String.prototype.match()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match", description: "Match patterns in strings" }
    ]
  }
];

newExercises.push(...exercises480);

// --- Exercises 490-499 ---
const exercises490 = [
  {
    id: 490,
    title: "Diamond",
    type: "js",
    tier: 3,
    category: ["algorithms", "patterns"],
    tags: ["strings", "patterns", "symmetry"],
    description: "Generate a diamond shape from a given letter.",
    instructions: "Write a function `makeDiamond(letter)` that returns a diamond string for the given letter.\n\nThe diamond starts with 'A' at the top and bottom, and widens to the given letter in the middle.\n\n```js\nmakeDiamond(\"C\")\n// =>  \"  A  \\n B B \\n\" +\n//     \"C   C\\n\" +\n//     \" B B \\n  A  \\n\"\n```\n\nEach line should have the same width (2*n - 1 where n = letter position).",
    starterCode: "function makeDiamond(letter) {\n  // your code here\n}",
    solution: "function makeDiamond(letter) {\n  const idx = letter.charCodeAt(0) - 65;\n  const width = 2 * idx + 1;\n  const lines = [];\n  for (let i = 0; i <= idx; i++) {\n    const ch = String.fromCharCode(65 + i);\n    let line;\n    if (i === 0) {\n      line = \" \".repeat(idx) + ch + \" \".repeat(idx);\n    } else {\n      line = \" \".repeat(idx - i) + ch + \" \".repeat(2 * i - 1) + ch + \" \".repeat(idx - i);\n    }\n    lines.push(line);\n  }\n  const full = [...lines, ...lines.slice(0, -1).reverse()];\n  return full.join(\"\\n\") + \"\\n\";\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return makeDiamond;")();
  const dA = fn("A");
  const dB = fn("B");
  const dC = fn("C");
  const cLines = dC.trim().split("\\n");
  return [
    { pass: dA === "A\\n", description: "Diamond A is just A", got: JSON.stringify(dA) },
    { pass: dB.trim().split("\\n").length === 3, description: "Diamond B has 3 lines", got: String(dB.trim().split("\\n").length) },
    { pass: cLines.length === 5, description: "Diamond C has 5 lines", got: String(cLines.length) },
    { pass: cLines[0].trim() === "A", description: "Diamond C starts with A", got: JSON.stringify(cLines[0].trim()) },
    { pass: cLines[2].indexOf("C") === 0, description: "Diamond C middle line starts with C", got: JSON.stringify(cLines[2]) }
  ];
}`,
    hints: [
      "How do you compute the spacing for each row of the diamond?",
      "The width is 2*n - 1 where n is the letter position. Row i has the letter at positions (n-1-i) and (n-1+i).",
      "Build the top half including the middle, then mirror it (excluding the middle row) for the bottom half."
    ],
    resources: [
      { label: "MDN: String.prototype.repeat()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat", description: "Repeat a string N times" },
      { label: "MDN: String.fromCharCode()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode", description: "Create characters from codes" }
    ]
  },
  {
    id: 491,
    title: "Bowling",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["algorithms", "state-machine", "validation"],
    description: "Score a complete bowling game with strikes, spares, and 10th frame bonuses.",
    instructions: "Write a class `Bowling` with:\n\n- `roll(pins)` - record a roll (0-10 pins)\n- `score()` - return the total score after the game is complete\n\nRules:\n- 10 frames. A strike (10 on first roll) adds next 2 rolls as bonus.\n- A spare (10 total in a frame) adds next 1 roll as bonus.\n- 10th frame: if strike or spare, get fill balls (up to 3 rolls total in frame 10).\n\n```js\nconst game = new Bowling();\n// Perfect game: 12 strikes = 300\n```",
    starterCode: "class Bowling {\n  constructor() {\n    // your code here\n  }\n\n  roll(pins) {\n    // your code here\n  }\n\n  score() {\n    // your code here\n  }\n}",
    solution: "class Bowling {\n  constructor() {\n    this.rolls = [];\n  }\n\n  roll(pins) {\n    if (pins < 0 || pins > 10) throw new Error(\"Invalid roll\");\n    this.rolls.push(pins);\n  }\n\n  score() {\n    let total = 0;\n    let rollIdx = 0;\n    for (let frame = 0; frame < 10; frame++) {\n      if (rollIdx >= this.rolls.length) throw new Error(\"Game is not complete\");\n      if (this.rolls[rollIdx] === 10) {\n        total += 10 + (this.rolls[rollIdx + 1] || 0) + (this.rolls[rollIdx + 2] || 0);\n        rollIdx++;\n      } else {\n        const first = this.rolls[rollIdx];\n        const second = this.rolls[rollIdx + 1];\n        if (second === undefined) throw new Error(\"Game is not complete\");\n        if (first + second > 10) throw new Error(\"Invalid frame\");\n        if (first + second === 10) {\n          total += 10 + (this.rolls[rollIdx + 2] || 0);\n        } else {\n          total += first + second;\n        }\n        rollIdx += 2;\n      }\n    }\n    return total;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return Bowling;")();
  function rollMany(game, n, pins) { for (let i = 0; i < n; i++) game.roll(pins); }
  const perfect = new Cls();
  rollMany(perfect, 12, 10);
  const gutter = new Cls();
  rollMany(gutter, 20, 0);
  const allFives = new Cls();
  for (let i = 0; i < 10; i++) { allFives.roll(5); allFives.roll(5); }
  allFives.roll(5);
  const simple = new Cls();
  rollMany(simple, 20, 1);
  return [
    { pass: perfect.score() === 300, description: "Perfect game scores 300", got: String(perfect.score()) },
    { pass: gutter.score() === 0, description: "Gutter game scores 0", got: String(gutter.score()) },
    { pass: allFives.score() === 150, description: "All spares with 5s scores 150", got: String(allFives.score()) },
    { pass: simple.score() === 20, description: "All ones scores 20", got: String(simple.score()) }
  ];
}`,
    hints: [
      "How do strikes and spares affect scoring differently from regular frames?",
      "Walk through rolls frame-by-frame. A strike uses one roll plus the next two as bonus. A spare uses two rolls plus the next one as bonus.",
      "Use a roll index that advances by 1 for strikes and 2 for non-strikes. Add bonus rolls from future positions in the array."
    ],
    resources: [
      { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript class syntax" },
      { label: "MDN: throw", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw", description: "Throwing errors" }
    ]
  },
  {
    id: 492,
    title: "Simple Linked List",
    type: "js",
    tier: 4,
    category: ["data-structures", "objects"],
    tags: ["linked-list", "classes", "data-structures"],
    description: "Implement a singly linked list with push, pop, size, and toArray.",
    instructions: "Write a class `LinkedList` with:\n\n- `push(value)` - add value to the head of the list\n- `pop()` - remove and return the value at the head\n- `size()` - return the number of elements\n- `toArray()` - return elements as an array (head first)\n- `reverse()` - reverse the list in place\n\n```js\nconst list = new LinkedList();\nlist.push(1);\nlist.push(2);\nlist.toArray() // => [2, 1]\nlist.pop()     // => 2\n```",
    starterCode: "class LinkedList {\n  constructor() {\n    // your code here\n  }\n\n  push(value) {\n    // your code here\n  }\n\n  pop() {\n    // your code here\n  }\n\n  size() {\n    // your code here\n  }\n\n  toArray() {\n    // your code here\n  }\n\n  reverse() {\n    // your code here\n  }\n}",
    solution: "class LinkedList {\n  constructor() {\n    this.head = null;\n    this._size = 0;\n  }\n\n  push(value) {\n    this.head = { value, next: this.head };\n    this._size++;\n  }\n\n  pop() {\n    if (!this.head) throw new Error(\"Empty list\");\n    const val = this.head.value;\n    this.head = this.head.next;\n    this._size--;\n    return val;\n  }\n\n  size() {\n    return this._size;\n  }\n\n  toArray() {\n    const arr = [];\n    let node = this.head;\n    while (node) {\n      arr.push(node.value);\n      node = node.next;\n    }\n    return arr;\n  }\n\n  reverse() {\n    let prev = null;\n    let current = this.head;\n    while (current) {\n      const next = current.next;\n      current.next = prev;\n      prev = current;\n      current = next;\n    }\n    this.head = prev;\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return LinkedList;")();
  const list = new Cls();
  list.push(1);
  list.push(2);
  list.push(3);
  const arr = list.toArray();
  const sz = list.size();
  const popped = list.pop();
  list.reverse();
  const reversed = list.toArray();
  return [
    { pass: JSON.stringify(arr) === "[3,2,1]", description: "toArray returns head-first order", got: JSON.stringify(arr) },
    { pass: sz === 3, description: "Size is 3 after 3 pushes", got: String(sz) },
    { pass: popped === 3, description: "Pop returns head value", got: String(popped) },
    { pass: list.size() === 2, description: "Size decreases after pop", got: String(list.size()) },
    { pass: JSON.stringify(reversed) === "[1,2]", description: "Reverse reverses the list", got: JSON.stringify(reversed) }
  ];
}`,
    hints: [
      "What does a singly linked list node look like, and how do you add to the front?",
      "Each node has a value and a next pointer. Push creates a new head pointing to the old head.",
      "For reverse: walk the list, changing each next pointer to the previous node. Track prev, current, and next."
    ],
    resources: [
      { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript class syntax" },
      { label: "MDN: while", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while", description: "While loops for traversal" }
    ]
  },
  {
    id: 493,
    title: "Custom Set",
    type: "js",
    tier: 4,
    category: ["data-structures", "objects"],
    tags: ["sets", "classes", "data-structures"],
    description: "Implement a custom set with union, intersection, difference, subset, and disjoint.",
    instructions: "Write a class `CustomSet` that takes an optional array of initial values:\n\n- `contains(value)` - true if value is in set\n- `add(value)` - add value, return this\n- `empty()` - true if set is empty\n- `size()` - number of elements\n- `isSubset(other)` - true if this is a subset of other\n- `isDisjoint(other)` - true if no common elements\n- `isEqual(other)` - true if same elements\n- `union(other)` - returns new set with all elements from both\n- `intersection(other)` - returns new set with common elements\n- `difference(other)` - returns new set with elements in this but not other\n\n```js\nnew CustomSet([1, 2]).union(new CustomSet([2, 3]))\n// => CustomSet with [1, 2, 3]\n```",
    starterCode: "class CustomSet {\n  constructor(values = []) {\n    // your code here\n  }\n\n  // implement methods\n}",
    solution: "class CustomSet {\n  constructor(values = []) {\n    this.data = [];\n    for (const v of values) this.add(v);\n  }\n\n  contains(value) {\n    return this.data.includes(value);\n  }\n\n  add(value) {\n    if (!this.contains(value)) this.data.push(value);\n    return this;\n  }\n\n  empty() {\n    return this.data.length === 0;\n  }\n\n  size() {\n    return this.data.length;\n  }\n\n  isSubset(other) {\n    return this.data.every(v => other.contains(v));\n  }\n\n  isDisjoint(other) {\n    return this.data.every(v => !other.contains(v));\n  }\n\n  isEqual(other) {\n    return this.isSubset(other) && other.isSubset(this);\n  }\n\n  union(other) {\n    const result = new CustomSet(this.data);\n    for (const v of other.data) result.add(v);\n    return result;\n  }\n\n  intersection(other) {\n    return new CustomSet(this.data.filter(v => other.contains(v)));\n  }\n\n  difference(other) {\n    return new CustomSet(this.data.filter(v => !other.contains(v)));\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return CustomSet;")();
  const s1 = new Cls([1, 2, 3]);
  const s2 = new Cls([2, 3, 4]);
  const empty = new Cls();
  const union = s1.union(s2);
  const inter = s1.intersection(s2);
  const diff = s1.difference(s2);
  return [
    { pass: s1.contains(2) === true, description: "Contains existing element", got: String(s1.contains(2)) },
    { pass: s1.contains(5) === false, description: "Does not contain missing element", got: String(s1.contains(5)) },
    { pass: empty.empty() === true, description: "Empty set is empty", got: String(empty.empty()) },
    { pass: union.size() === 4, description: "Union has 4 elements", got: String(union.size()) },
    { pass: inter.size() === 2 && inter.contains(2) && inter.contains(3), description: "Intersection has common elements", got: String(inter.size()) },
    { pass: diff.size() === 1 && diff.contains(1), description: "Difference has elements only in first", got: String(diff.size()) },
    { pass: new Cls([1, 2]).isSubset(s1), description: "[1,2] is subset of [1,2,3]", got: String(new Cls([1, 2]).isSubset(s1)) }
  ];
}`,
    hints: [
      "How do you implement set operations like union and intersection using arrays?",
      "Use an internal array and check for duplicates on add. Union combines both, intersection filters to common elements.",
      "For subset, check every element of this is in other. For disjoint, check no element of this is in other. Union adds all from both, deduped."
    ],
    resources: [
      { label: "MDN: Array.prototype.every()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every", description: "Test if all elements pass a test" },
      { label: "MDN: Array.prototype.includes()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes", description: "Check if array includes a value" }
    ]
  },
  {
    id: 494,
    title: "Binary Search Tree",
    type: "js",
    tier: 4,
    category: ["algorithms", "searching"],
    tags: ["trees", "classes", "recursion"],
    description: "Implement a BST with insert and in-order, pre-order, post-order traversals.",
    instructions: "Write a class `BinarySearchTree` with:\n\n- `constructor(value)` - creates a node with that value\n- `insert(value)` - inserts a value (<=  goes left, > goes right)\n- `inOrder()` - returns in-order traversal array\n- `preOrder()` - returns pre-order traversal array\n- `postOrder()` - returns post-order traversal array\n\n```js\nconst tree = new BinarySearchTree(4);\ntree.insert(2); tree.insert(6); tree.insert(1);\ntree.inOrder() // => [1, 2, 4, 6]\n```",
    starterCode: "class BinarySearchTree {\n  constructor(value) {\n    // your code here\n  }\n\n  insert(value) {\n    // your code here\n  }\n\n  inOrder() {\n    // your code here\n  }\n\n  preOrder() {\n    // your code here\n  }\n\n  postOrder() {\n    // your code here\n  }\n}",
    solution: "class BinarySearchTree {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n\n  insert(val) {\n    if (val <= this.value) {\n      if (this.left) this.left.insert(val);\n      else this.left = new BinarySearchTree(val);\n    } else {\n      if (this.right) this.right.insert(val);\n      else this.right = new BinarySearchTree(val);\n    }\n  }\n\n  inOrder() {\n    const left = this.left ? this.left.inOrder() : [];\n    const right = this.right ? this.right.inOrder() : [];\n    return [...left, this.value, ...right];\n  }\n\n  preOrder() {\n    const left = this.left ? this.left.preOrder() : [];\n    const right = this.right ? this.right.preOrder() : [];\n    return [this.value, ...left, ...right];\n  }\n\n  postOrder() {\n    const left = this.left ? this.left.postOrder() : [];\n    const right = this.right ? this.right.postOrder() : [];\n    return [...left, ...right, this.value];\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return BinarySearchTree;")();
  const tree = new Cls(4);
  tree.insert(2);
  tree.insert(6);
  tree.insert(1);
  tree.insert(3);
  tree.insert(5);
  tree.insert(7);
  return [
    { pass: JSON.stringify(tree.inOrder()) === "[1,2,3,4,5,6,7]", description: "In-order traversal", got: JSON.stringify(tree.inOrder()) },
    { pass: JSON.stringify(tree.preOrder()) === "[4,2,1,3,6,5,7]", description: "Pre-order traversal", got: JSON.stringify(tree.preOrder()) },
    { pass: JSON.stringify(tree.postOrder()) === "[1,3,2,5,7,6,4]", description: "Post-order traversal", got: JSON.stringify(tree.postOrder()) },
    { pass: tree.value === 4, description: "Root value is 4", got: String(tree.value) },
    { pass: tree.left.value === 2, description: "Left child is 2", got: String(tree.left.value) }
  ];
}`,
    hints: [
      "How does a binary search tree decide where to place a new value?",
      "Values <= current go left, > go right. Recursively insert into the appropriate subtree.",
      "For in-order: visit left, then root, then right. For pre-order: root, left, right. For post-order: left, right, root."
    ],
    resources: [
      { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript class syntax" },
      { label: "MDN: Spread syntax (...)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax", description: "Spread arrays" }
    ]
  },
  {
    id: 495,
    title: "Circular Buffer",
    type: "js",
    tier: 4,
    category: ["data-structures", "objects"],
    tags: ["data-structures", "classes", "buffer"],
    description: "Implement a fixed-size circular buffer with read, write, and overwrite.",
    instructions: "Write a class `CircularBuffer` with:\n\n- `constructor(capacity)` - creates a buffer of the given size\n- `read()` - read and remove the oldest value; throw if empty\n- `write(value)` - write a value; throw if full\n- `overwrite(value)` - write a value, overwriting the oldest if full\n- `clear()` - empty the buffer\n\n```js\nconst buf = new CircularBuffer(3);\nbuf.write(1); buf.write(2); buf.write(3);\nbuf.read() // => 1\nbuf.write(4);\nbuf.read() // => 2\n```",
    starterCode: "class CircularBuffer {\n  constructor(capacity) {\n    // your code here\n  }\n\n  read() {\n    // your code here\n  }\n\n  write(value) {\n    // your code here\n  }\n\n  overwrite(value) {\n    // your code here\n  }\n\n  clear() {\n    // your code here\n  }\n}",
    solution: "class CircularBuffer {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.buffer = [];\n  }\n\n  read() {\n    if (this.buffer.length === 0) throw new Error(\"Buffer is empty\");\n    return this.buffer.shift();\n  }\n\n  write(value) {\n    if (this.buffer.length >= this.capacity) throw new Error(\"Buffer is full\");\n    this.buffer.push(value);\n  }\n\n  overwrite(value) {\n    if (this.buffer.length >= this.capacity) {\n      this.buffer.shift();\n    }\n    this.buffer.push(value);\n  }\n\n  clear() {\n    this.buffer = [];\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return CircularBuffer;")();
  const buf = new Cls(3);
  buf.write(1); buf.write(2); buf.write(3);
  const r1 = buf.read();
  buf.write(4);
  const r2 = buf.read();
  const buf2 = new Cls(2);
  buf2.write(1); buf2.write(2);
  buf2.overwrite(3);
  const r3 = buf2.read();
  let err = false;
  try { const b3 = new Cls(1); b3.read(); } catch(e) { err = true; }
  let fullErr = false;
  try { const b4 = new Cls(1); b4.write(1); b4.write(2); } catch(e) { fullErr = true; }
  return [
    { pass: r1 === 1, description: "Read returns oldest value", got: String(r1) },
    { pass: r2 === 2, description: "Read after write returns next oldest", got: String(r2) },
    { pass: r3 === 2, description: "Overwrite replaces oldest when full", got: String(r3) },
    { pass: err, description: "Read from empty throws", got: err ? "Error thrown" : "No error" },
    { pass: fullErr, description: "Write to full throws", got: fullErr ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How does a circular buffer differ from a regular queue?",
      "A circular buffer has a fixed capacity. Write appends, read removes from the front. Overwrite replaces the oldest when full.",
      "Use an array with push and shift. For write, check capacity. For overwrite, shift first if at capacity, then push."
    ],
    resources: [
      { label: "MDN: Array.prototype.shift()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift", description: "Remove the first element from an array" },
      { label: "MDN: Array.prototype.push()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push", description: "Add to the end of an array" }
    ]
  },
  {
    id: 496,
    title: "Crypto Square",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["strings", "cipher", "matrix"],
    description: "Encode a message using the square code cipher.",
    instructions: "Write a function `ciphertext(text)` that encodes a message:\n\n1. Normalize: remove spaces/punctuation, lowercase\n2. Arrange into a rectangle (r rows, c columns where c >= r, c - r <= 1, r*c >= length)\n3. Read columns top-to-bottom, separated by spaces\n\n```js\nciphertext(\"If man was meant to stay on the ground god would have given us roots\")\n// => \"imtgdvs fearwer mayoogo anouuio ntnnlvt wttddes aede ss\"\n```",
    starterCode: "function ciphertext(text) {\n  // your code here\n}",
    solution: "function ciphertext(text) {\n  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  if (normalized.length === 0) return \"\";\n  const c = Math.ceil(Math.sqrt(normalized.length));\n  const r = Math.ceil(normalized.length / c);\n  const padded = normalized.padEnd(r * c, \" \");\n  const chunks = [];\n  for (let col = 0; col < c; col++) {\n    let segment = \"\";\n    for (let row = 0; row < r; row++) {\n      segment += padded[row * c + col];\n    }\n    chunks.push(segment);\n  }\n  return chunks.join(\" \");\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return ciphertext;")();
  const r1 = fn("If man was meant to stay on the ground god would have given us roots");
  const r2 = fn("");
  const r3 = fn("have a nice day");
  return [
    { pass: r1 === "imtgdvs fearwer mayoogo anouuio ntnnlvt wttddes aohghn  sseoau ", description: "Full sentence encoding", got: r1 },
    { pass: r2 === "", description: "Empty string", got: JSON.stringify(r2) },
    { pass: r3 === "hae and via ecy", description: "Have a nice day", got: r3 },
    { pass: fn("a") === "a", description: "Single character", got: fn("a") }
  ];
}`,
    hints: [
      "How do you determine the dimensions of the rectangle for the square code?",
      "Columns = ceil(sqrt(length)). Rows = ceil(length / columns). Pad with spaces if needed.",
      "Normalize the text, compute rectangle dimensions, pad to fill, then read column by column."
    ],
    resources: [
      { label: "MDN: Math.ceil()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil", description: "Round up to nearest integer" },
      { label: "MDN: Math.sqrt()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt", description: "Square root function" }
    ]
  },
  {
    id: 497,
    title: "Saddle Points",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["matrix", "arrays", "searching"],
    description: "Find saddle points in a matrix (max in row, min in column).",
    instructions: "Write a function `saddlePoints(matrix)` that returns all saddle points.\n\nA saddle point is an element that is >= all elements in its row and <= all elements in its column.\n\nReturn an array of `{row, column}` objects (1-indexed).\n\n```js\nsaddlePoints([[9, 8, 7], [5, 3, 2], [6, 6, 7]])\n// => [{row: 1, column: 3}]  (value 7 at row 1, col 3 -- but wait let me reconsider)\n```",
    starterCode: "function saddlePoints(matrix) {\n  // your code here\n}",
    solution: "function saddlePoints(matrix) {\n  if (matrix.length === 0) return [];\n  const results = [];\n  for (let r = 0; r < matrix.length; r++) {\n    for (let c = 0; c < matrix[0].length; c++) {\n      const val = matrix[r][c];\n      const isRowMax = matrix[r].every(v => val >= v);\n      const isColMin = matrix.every(row => val <= row[c]);\n      if (isRowMax && isColMin) {\n        results.push({ row: r + 1, column: c + 1 });\n      }\n    }\n  }\n  return results;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return saddlePoints;")();
  const r1 = fn([[9, 8, 7], [5, 3, 2], [6, 6, 7]]);
  const r2 = fn([[2, 1], [1, 2]]);
  const r3 = fn([[5, 5], [5, 5]]);
  const r4 = fn([]);
  return [
    { pass: r1.length === 1 && r1[0].row === 2 && r1[0].column === 1, description: "Matrix with one saddle point", got: JSON.stringify(r1) },
    { pass: r2.length === 0, description: "Matrix with no saddle points", got: JSON.stringify(r2) },
    { pass: r3.length === 4, description: "All equal matrix has 4 saddle points", got: JSON.stringify(r3) },
    { pass: r4.length === 0, description: "Empty matrix", got: JSON.stringify(r4) }
  ];
}`,
    hints: [
      "What two conditions must be true for a saddle point?",
      "A saddle point is the maximum in its row AND the minimum in its column.",
      "For each element, check if it is >= all values in its row and <= all values in its column. Use every() for both checks."
    ],
    resources: [
      { label: "MDN: Array.prototype.every()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every", description: "Test if all elements pass a condition" },
      { label: "MDN: Array.prototype.map()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map", description: "Transform array elements" }
    ]
  },
  {
    id: 498,
    title: "Queen Attack",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["chess", "math", "validation"],
    description: "Determine if two queens on a chessboard can attack each other.",
    instructions: "Write a class `QueenAttack` with:\n\n- `constructor({ white, black })` - positions as [row, col] (0-7). Default white=[0,3], black=[7,3]\n- `canAttack()` - returns true if queens can attack (same row, column, or diagonal)\n\nThrow an error if positions are the same or out of bounds.\n\n```js\nconst q = new QueenAttack({ white: [2, 2], black: [0, 4] });\nq.canAttack() // => true (same diagonal)\n```",
    starterCode: "class QueenAttack {\n  constructor({ white, black } = {}) {\n    // your code here\n  }\n\n  canAttack() {\n    // your code here\n  }\n}",
    solution: "class QueenAttack {\n  constructor({ white = [0, 3], black = [7, 3] } = {}) {\n    if (white[0] === black[0] && white[1] === black[1]) throw new Error(\"Queens cannot share the same space\");\n    this.white = white;\n    this.black = black;\n  }\n\n  canAttack() {\n    const [wr, wc] = this.white;\n    const [br, bc] = this.black;\n    return wr === br || wc === bc || Math.abs(wr - br) === Math.abs(wc - bc);\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return QueenAttack;")();
  const q1 = new Cls({ white: [2, 2], black: [0, 4] });
  const q2 = new Cls({ white: [2, 2], black: [5, 5] });
  const q3 = new Cls({ white: [4, 2], black: [4, 6] });
  const q4 = new Cls({ white: [2, 4], black: [6, 6] });
  let err = false;
  try { new Cls({ white: [3, 3], black: [3, 3] }); } catch(e) { err = true; }
  return [
    { pass: q1.canAttack() === true, description: "Queens on same diagonal can attack", got: String(q1.canAttack()) },
    { pass: q2.canAttack() === true, description: "Queens on other diagonal can attack", got: String(q2.canAttack()) },
    { pass: q3.canAttack() === true, description: "Queens on same row can attack", got: String(q3.canAttack()) },
    { pass: q4.canAttack() === false, description: "Queens that cannot attack", got: String(q4.canAttack()) },
    { pass: err, description: "Throws for same position", got: err ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "When can a queen attack another piece on the board?",
      "Queens attack on the same row, same column, or same diagonal. Diagonals have equal absolute row and column differences.",
      "Check: same row (wr === br), same column (wc === bc), or diagonal (|wr-br| === |wc-bc|)."
    ],
    resources: [
      { label: "MDN: Math.abs()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs", description: "Absolute value function" },
      { label: "MDN: Destructuring assignment", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", description: "Destructure arrays and objects" }
    ]
  },
  {
    id: 499,
    title: "Tournament",
    type: "js",
    tier: 4,
    category: ["data-structures", "objects"],
    tags: ["strings", "parsing", "sorting"],
    description: "Parse tournament results and produce a formatted standings table.",
    instructions: "Write a function `tournamentTally(input)` that takes match results and returns a formatted table.\n\nInput format: one match per line as \"Team1;Team2;result\" where result is \"win\", \"loss\", or \"draw\" (from Team1 perspective).\n\nOutput: A header + rows sorted by points (desc), then name (asc). Columns: Team | MP | W | D | L | P\n\nWin = 3pts, Draw = 1pt, Loss = 0pts.\n\n```js\ntournamentTally(\"A;B;win\")\n// => \"Team                           | MP |  W |  D |  L |  P\\nA                              |  1 |  1 |  0 |  0 |  3\\nB                              |  1 |  0 |  0 |  1 |  0\"\n```",
    starterCode: "function tournamentTally(input) {\n  // your code here\n}",
    solution: "function tournamentTally(input) {\n  const teams = {};\n  function ensure(name) {\n    if (!teams[name]) teams[name] = { mp: 0, w: 0, d: 0, l: 0, p: 0 };\n  }\n  if (input.trim() === \"\") {\n    return \"Team                           | MP |  W |  D |  L |  P\";\n  }\n  input.split(\"\\n\").forEach(line => {\n    const [t1, t2, result] = line.split(\";\");\n    ensure(t1); ensure(t2);\n    teams[t1].mp++; teams[t2].mp++;\n    if (result === \"win\") {\n      teams[t1].w++; teams[t1].p += 3;\n      teams[t2].l++;\n    } else if (result === \"loss\") {\n      teams[t2].w++; teams[t2].p += 3;\n      teams[t1].l++;\n    } else {\n      teams[t1].d++; teams[t1].p += 1;\n      teams[t2].d++; teams[t2].p += 1;\n    }\n  });\n  const sorted = Object.keys(teams).sort((a, b) => teams[b].p - teams[a].p || a.localeCompare(b));\n  const header = \"Team                           | MP |  W |  D |  L |  P\";\n  const rows = sorted.map(name => {\n    const t = teams[name];\n    return name.padEnd(31) + \"|\" + String(t.mp).padStart(3) + \" |\" + String(t.w).padStart(3) + \" |\" + String(t.d).padStart(3) + \" |\" + String(t.l).padStart(3) + \" |\" + String(t.p).padStart(3);\n  });\n  return [header, ...rows].join(\"\\n\");\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return tournamentTally;")();
  const r1 = fn("A;B;win");
  const lines = r1.split("\\n");
  const r2 = fn("A;B;draw");
  const dLines = r2.split("\\n");
  const r3 = fn("");
  return [
    { pass: lines.length === 3, description: "One match produces header + 2 team lines", got: String(lines.length) },
    { pass: lines[0].startsWith("Team"), description: "First line is header", got: lines[0].substring(0, 10) },
    { pass: lines[1].trim().startsWith("A"), description: "Winner listed first", got: lines[1].trim().substring(0, 5) },
    { pass: dLines[1].indexOf("1") > 0, description: "Draw gives 1 point", got: dLines[1] },
    { pass: r3.split("\\n").length === 1, description: "Empty input gives header only", got: String(r3.split("\\n").length) }
  ];
}`,
    hints: [
      "How do you parse match results and aggregate team statistics?",
      "Split input by newlines, parse each match, and maintain a stats object per team. Sort by points then name.",
      "Track MP, W, D, L, P for each team. Format output with padEnd for team names and padStart for numbers."
    ],
    resources: [
      { label: "MDN: String.prototype.padEnd()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd", description: "Pad a string to a given length" },
      { label: "MDN: Array.prototype.sort()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort", description: "Sort array elements" }
    ]
  }
];

newExercises.push(...exercises490);

// --- Exercises 500-505 ---
const exercises500 = [
  {
    id: 500,
    title: "State of Tic-Tac-Toe",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["arrays", "validation", "games"],
    description: "Determine the state of a tic-tac-toe board: win, draw, or ongoing.",
    instructions: "Write a function `gamestate(board)` that takes a 3x3 board (array of 3 strings like \"X O\", \"OXX\", etc.) and returns the game state.\n\nReturn:\n- `\"win\"` if X or O has won\n- `\"draw\"` if the board is full with no winner\n- `\"ongoing\"` if the game is still in progress\n\nThrow an error for invalid states (e.g., both players won, or wrong turn count).\n\n```js\ngamestate([\"XXX\", \"OO.\", \"...\"])  // => \"win\"\ngamestate([\"XOX\", \"XOX\", \"OXO\"])  // => \"draw\"\ngamestate([\"X..\", \"...\", \"...\"])  // => \"ongoing\"\n```",
    starterCode: "function gamestate(board) {\n  // your code here\n}",
    solution: "function gamestate(board) {\n  const lines = [\n    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],\n    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],\n    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]\n  ];\n  function at(r, c) { return board[r][c]; }\n  function wins(ch) {\n    return lines.some(line => line.every(([r, c]) => at(r, c) === ch));\n  }\n  const xCount = board.join(\"\").split(\"\").filter(c => c === \"X\").length;\n  const oCount = board.join(\"\").split(\"\").filter(c => c === \"O\").length;\n  const xWins = wins(\"X\");\n  const oWins = wins(\"O\");\n  if (xWins && oWins) throw new Error(\"Invalid board\");\n  if (xCount < oCount || xCount > oCount + 1) throw new Error(\"Invalid board\");\n  if (xWins && oCount === xCount) throw new Error(\"Invalid board\");\n  if (oWins && xCount > oCount) throw new Error(\"Invalid board\");\n  if (xWins || oWins) return \"win\";\n  if (xCount + oCount === 9) return \"draw\";\n  return \"ongoing\";\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return gamestate;")();
  const r1 = fn(["XXX", "OO.", "..."]);
  const r2 = fn(["XOX", "XOX", "OXO"]);
  const r3 = fn(["X..", "...", "..."]);
  const r4 = fn(["XOX", "OOX", "XXO"]);
  let err = false;
  try { fn(["XXX", "OOO", "..."]); } catch(e) { err = true; }
  return [
    { pass: r1 === "win", description: "X wins with top row", got: r1 },
    { pass: r2 === "draw", description: "Full board draw", got: r2 },
    { pass: r3 === "ongoing", description: "Game in progress", got: r3 },
    { pass: r4 === "draw", description: "Another draw board", got: r4 },
    { pass: err, description: "Both winners throws error", got: err ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "What are all the possible winning lines on a tic-tac-toe board?",
      "Check 3 rows, 3 columns, and 2 diagonals. Also validate turn counts and reject impossible states.",
      "Enumerate all 8 winning lines. Check if X or O wins. Validate that X count is equal to or one more than O count, and reject boards where play continued after a win."
    ],
    resources: [
      { label: "MDN: Array.prototype.some()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some", description: "Test if any element passes a test" },
      { label: "MDN: Array.prototype.every()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every", description: "Test if all elements pass a test" }
    ]
  },
  {
    id: 501,
    title: "Robot Simulator",
    type: "js",
    tier: 4,
    category: ["js-fundamentals", "classes"],
    tags: ["classes", "simulation", "state"],
    description: "Simulate a robot on a grid with position, direction, and instruction sequence.",
    instructions: "Write a class `Robot` with:\n\n- `constructor()` - starts at (0,0) facing north\n- `orient(direction)` - set direction: \"north\", \"east\", \"south\", \"west\"\n- `turnRight()` / `turnLeft()` - rotate 90 degrees\n- `advance()` - move one step in the current direction\n- `at(x, y)` - set position\n- `instructions(str)` - execute a string of L/R/A commands\n- Properties: `bearing`, `coordinates`\n\n```js\nconst r = new Robot();\nr.at(0, 0); r.orient(\"north\");\nr.instructions(\"RAALAL\");\nr.coordinates // => [2, 1]\nr.bearing     // => \"west\"\n```",
    starterCode: "class Robot {\n  constructor() {\n    // your code here\n  }\n\n  // implement methods\n}",
    solution: "class Robot {\n  constructor() {\n    this.x = 0;\n    this.y = 0;\n    this.dir = \"north\";\n  }\n\n  get bearing() { return this.dir; }\n  get coordinates() { return [this.x, this.y]; }\n\n  orient(direction) {\n    this.dir = direction;\n  }\n\n  at(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  turnRight() {\n    const dirs = [\"north\", \"east\", \"south\", \"west\"];\n    this.dir = dirs[(dirs.indexOf(this.dir) + 1) % 4];\n  }\n\n  turnLeft() {\n    const dirs = [\"north\", \"east\", \"south\", \"west\"];\n    this.dir = dirs[(dirs.indexOf(this.dir) + 3) % 4];\n  }\n\n  advance() {\n    if (this.dir === \"north\") this.y++;\n    else if (this.dir === \"south\") this.y--;\n    else if (this.dir === \"east\") this.x++;\n    else if (this.dir === \"west\") this.x--;\n  }\n\n  instructions(str) {\n    for (const ch of str) {\n      if (ch === \"L\") this.turnLeft();\n      else if (ch === \"R\") this.turnRight();\n      else if (ch === \"A\") this.advance();\n    }\n  }\n}",
    testRunner: `(code) => {
  const Cls = new Function(code + "; return Robot;")();
  const r1 = new Cls();
  r1.at(0, 0);
  r1.orient("north");
  r1.instructions("RAALAL");
  const r2 = new Cls();
  r2.at(0, 0);
  r2.orient("north");
  r2.advance();
  const r3 = new Cls();
  r3.orient("east");
  r3.turnLeft();
  return [
    { pass: JSON.stringify(r1.coordinates) === "[2,1]", description: "RAALAL from north at origin", got: JSON.stringify(r1.coordinates) },
    { pass: r1.bearing === "west", description: "Bearing after RAALAL is west", got: r1.bearing },
    { pass: JSON.stringify(r2.coordinates) === "[0,1]", description: "Advance north from origin", got: JSON.stringify(r2.coordinates) },
    { pass: r3.bearing === "north", description: "Turn left from east gives north", got: r3.bearing }
  ];
}`,
    hints: [
      "How do you represent direction changes as rotations?",
      "Store directions in order: north, east, south, west. Turning right adds 1 (mod 4), turning left adds 3 (mod 4).",
      "For advance, change x or y based on current direction. For instructions, loop through each character and call the appropriate method."
    ],
    resources: [
      { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", description: "JavaScript class syntax" },
      { label: "MDN: get", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get", description: "Getter properties" }
    ]
  },
  {
    id: 502,
    title: "Say (Number to Words)",
    type: "js",
    tier: 4,
    category: ["algorithms", "recursion"],
    tags: ["numbers", "strings", "recursion"],
    description: "Convert a number into its English word representation.",
    instructions: "Write a function `say(number)` that converts a non-negative integer to English words.\n\nHandle numbers from 0 to 999,999,999,999 (up to billions).\n\nThrow an error for negative numbers or numbers >= 1 trillion.\n\n```js\nsay(0)      // => \"zero\"\nsay(14)     // => \"fourteen\"\nsay(1002345) // => \"one million two thousand three hundred forty-five\"\n```",
    starterCode: "function say(number) {\n  // your code here\n}",
    solution: "function say(number) {\n  if (number < 0 || number >= 1e12) throw new Error(\"Number must be between 0 and 999,999,999,999\");\n  if (number === 0) return \"zero\";\n  const ones = [\"\", \"one\", \"two\", \"three\", \"four\", \"five\", \"six\", \"seven\", \"eight\", \"nine\",\n    \"ten\", \"eleven\", \"twelve\", \"thirteen\", \"fourteen\", \"fifteen\", \"sixteen\", \"seventeen\", \"eighteen\", \"nineteen\"];\n  const tens = [\"\", \"\", \"twenty\", \"thirty\", \"forty\", \"fifty\", \"sixty\", \"seventy\", \"eighty\", \"ninety\"];\n  function chunk(n) {\n    if (n === 0) return \"\";\n    if (n < 20) return ones[n];\n    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? \"-\" + ones[n % 10] : \"\");\n    return ones[Math.floor(n / 100)] + \" hundred\" + (n % 100 ? \" \" + chunk(n % 100) : \"\");\n  }\n  const scales = [\"\", \" thousand\", \" million\", \" billion\"];\n  const parts = [];\n  let scaleIdx = 0;\n  while (number > 0) {\n    const rem = number % 1000;\n    if (rem > 0) parts.unshift(chunk(rem) + scales[scaleIdx]);\n    number = Math.floor(number / 1000);\n    scaleIdx++;\n  }\n  return parts.join(\" \");\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return say;")();
  let err = false;
  try { fn(-1); } catch(e) { err = true; }
  return [
    { pass: fn(0) === "zero", description: "Zero", got: fn(0) },
    { pass: fn(14) === "fourteen", description: "Fourteen", got: fn(14) },
    { pass: fn(100) === "one hundred", description: "One hundred", got: fn(100) },
    { pass: fn(1002345) === "one million two thousand three hundred forty-five", description: "1,002,345 in words", got: fn(1002345) },
    { pass: fn(1000000000) === "one billion", description: "One billion", got: fn(1000000000) },
    { pass: fn(21) === "twenty-one", description: "Twenty-one with hyphen", got: fn(21) },
    { pass: err, description: "Throws for negative numbers", got: err ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How do you break a large number into chunks of three digits?",
      "Process the number in groups of 1000. Each group maps to ones/tens/hundreds words plus a scale (thousand, million, billion).",
      "Use recursion or a helper to convert 0-999 to words. Process from right to left in groups of 3, prepending the scale word."
    ],
    resources: [
      { label: "MDN: Math.floor()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor", description: "Round down to integer" },
      { label: "MDN: Array.prototype.unshift()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift", description: "Add elements to the beginning of an array" }
    ]
  },
  {
    id: 503,
    title: "Wordy",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["parsing", "strings", "math"],
    description: "Parse and evaluate simple math word problems.",
    instructions: "Write a function `answer(question)` that parses math questions in English.\n\nSupported operations: plus, minus, multiplied by, divided by.\n\nOperations are evaluated left-to-right (no precedence).\n\n```js\nanswer(\"What is 5 plus 13?\")            // => 18\nanswer(\"What is 7 minus 5 plus 1?\")     // => 3\nanswer(\"What is 3 multiplied by 2?\")    // => 6\n```\n\nThrow an error for unsupported operations or invalid format.",
    starterCode: "function answer(question) {\n  // your code here\n}",
    solution: "function answer(question) {\n  const cleaned = question.replace(\"What is\", \"\").replace(\"?\", \"\").trim();\n  if (!cleaned) throw new Error(\"Invalid question\");\n  const tokens = cleaned.split(/\\s+/);\n  let result = Number(tokens[0]);\n  if (isNaN(result)) throw new Error(\"Invalid question\");\n  let i = 1;\n  while (i < tokens.length) {\n    let op;\n    if (tokens[i] === \"plus\") { op = \"+\"; i++; }\n    else if (tokens[i] === \"minus\") { op = \"-\"; i++; }\n    else if (tokens[i] === \"multiplied\" && tokens[i + 1] === \"by\") { op = \"*\"; i += 2; }\n    else if (tokens[i] === \"divided\" && tokens[i + 1] === \"by\") { op = \"/\"; i += 2; }\n    else throw new Error(\"Unknown operation\");\n    const num = Number(tokens[i]);\n    if (isNaN(num)) throw new Error(\"Invalid question\");\n    if (op === \"+\") result += num;\n    else if (op === \"-\") result -= num;\n    else if (op === \"*\") result *= num;\n    else if (op === \"/\") result /= num;\n    i++;\n  }\n  return result;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return answer;")();
  let err = false;
  try { fn("What is 1 cubed?"); } catch(e) { err = true; }
  return [
    { pass: fn("What is 5 plus 13?") === 18, description: "5 plus 13", got: String(fn("What is 5 plus 13?")) },
    { pass: fn("What is 7 minus 5 plus 1?") === 3, description: "Chained operations", got: String(fn("What is 7 minus 5 plus 1?")) },
    { pass: fn("What is 3 multiplied by 2?") === 6, description: "Multiplication", got: String(fn("What is 3 multiplied by 2?")) },
    { pass: fn("What is 10 divided by 2?") === 5, description: "Division", got: String(fn("What is 10 divided by 2?")) },
    { pass: fn("What is -3 plus 7?") === 4, description: "Negative numbers", got: String(fn("What is -3 plus 7?")) },
    { pass: err, description: "Throws for unknown operation", got: err ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How do you parse a sentence into numbers and operations?",
      "Strip the question format, split into tokens, then process pairs of (operation, number) left-to-right.",
      "Remove 'What is' and '?'. Split by whitespace. Read the first number, then loop: read an operator word, read the next number, apply."
    ],
    resources: [
      { label: "MDN: String.prototype.split()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split", description: "Split strings into arrays" },
      { label: "MDN: Number()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number", description: "Convert to number" }
    ]
  },
  {
    id: 504,
    title: "Largest Series Product",
    type: "js",
    tier: 4,
    category: ["algorithms", "patterns"],
    tags: ["numbers", "strings", "sliding-window"],
    description: "Find the largest product of N consecutive digits in a number string.",
    instructions: "Write a function `largestProduct(digits, span)` that finds the largest product of `span` consecutive digits.\n\nThrow an error if span is negative, larger than the string length, or if the string contains non-digits.\n\n```js\nlargestProduct(\"63915\", 3) // => 135 (3*9*5 or 6*3*9=162... wait, 9*1*5=45, 6*3*9=162, 3*9*1=27, 9*1*5=45 => 162)\nlargestProduct(\"0000\", 2)  // => 0\n```",
    starterCode: "function largestProduct(digits, span) {\n  // your code here\n}",
    solution: "function largestProduct(digits, span) {\n  if (span < 0) throw new Error(\"Span must not be negative\");\n  if (span > digits.length) throw new Error(\"Span must be smaller than string length\");\n  if (/[^0-9]/.test(digits)) throw new Error(\"Digits input must only contain digits\");\n  if (span === 0) return 1;\n  let maxProduct = 0;\n  for (let i = 0; i <= digits.length - span; i++) {\n    let product = 1;\n    for (let j = i; j < i + span; j++) {\n      product *= Number(digits[j]);\n    }\n    if (product > maxProduct) maxProduct = product;\n  }\n  return maxProduct;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return largestProduct;")();
  let err1 = false;
  try { fn("123", -1); } catch(e) { err1 = true; }
  let err2 = false;
  try { fn("12a4", 2); } catch(e) { err2 = true; }
  return [
    { pass: fn("63915", 3) === 162, description: "Largest product of 3 in 63915", got: String(fn("63915", 3)) },
    { pass: fn("0000", 2) === 0, description: "All zeros", got: String(fn("0000", 2)) },
    { pass: fn("99", 1) === 9, description: "Span of 1", got: String(fn("99", 1)) },
    { pass: fn("123", 0) === 1, description: "Span of 0 returns 1", got: String(fn("123", 0)) },
    { pass: err1, description: "Negative span throws", got: err1 ? "Error thrown" : "No error" },
    { pass: err2, description: "Non-digit character throws", got: err2 ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How do you check every window of N consecutive digits?",
      "Use a sliding window of the given span. For each window, compute the product of its digits.",
      "Loop from index 0 to length - span. At each position, multiply the span digits together. Track the maximum product."
    ],
    resources: [
      { label: "MDN: Number()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number", description: "Convert to number" },
      { label: "MDN: String.prototype.slice()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice", description: "Extract part of a string" }
    ]
  },
  {
    id: 505,
    title: "Forth Interpreter",
    type: "js",
    tier: 5,
    category: ["algorithms", "patterns"],
    tags: ["stacks", "parsing", "interpreters"],
    description: "Implement a basic Forth stack-based language interpreter.",
    instructions: "Write a function `evaluate(instructions)` that implements a basic Forth interpreter.\n\nBuilt-in operations:\n- Numbers: push onto stack\n- `+`, `-`, `*`, `/`: pop two, compute, push result (integer division)\n- `DUP`: duplicate top of stack\n- `DROP`: remove top of stack\n- `SWAP`: swap top two elements\n- `OVER`: copy second element to top\n- `: word definition ;` - define a custom word\n\nReturn the stack as an array. Operations and definitions are case-insensitive.\n\n```js\nevaluate([\"1 2 +\"])        // => [3]\nevaluate([\"1 2 3\", \"DROP\"]) // => [1, 2]\nevaluate([\": double 2 * ;\", \"5 double\"]) // => [10]\n```",
    starterCode: "function evaluate(instructions) {\n  // your code here\n}",
    solution: "function evaluate(instructions) {\n  const stack = [];\n  const defs = {};\n  function exec(tokens) {\n    let i = 0;\n    while (i < tokens.length) {\n      const token = tokens[i].toUpperCase();\n      if (token === \":\") {\n        i++;\n        const name = tokens[i].toUpperCase();\n        if (!isNaN(Number(name))) throw new Error(\"Cannot redefine numbers\");\n        i++;\n        const body = [];\n        while (tokens[i] !== \";\" && i < tokens.length) {\n          body.push(tokens[i]);\n          i++;\n        }\n        defs[name] = expandDef(body);\n        i++;\n        continue;\n      }\n      if (defs[token]) {\n        exec(defs[token]);\n      } else if (!isNaN(Number(token))) {\n        stack.push(Number(token));\n      } else if (token === \"+\" || token === \"-\" || token === \"*\" || token === \"/\") {\n        if (stack.length < 2) throw new Error(\"Stack underflow\");\n        const b = stack.pop();\n        const a = stack.pop();\n        if (token === \"+\") stack.push(a + b);\n        else if (token === \"-\") stack.push(a - b);\n        else if (token === \"*\") stack.push(a * b);\n        else { if (b === 0) throw new Error(\"Division by zero\"); stack.push(Math.trunc(a / b)); }\n      } else if (token === \"DUP\") {\n        if (stack.length < 1) throw new Error(\"Stack underflow\");\n        stack.push(stack[stack.length - 1]);\n      } else if (token === \"DROP\") {\n        if (stack.length < 1) throw new Error(\"Stack underflow\");\n        stack.pop();\n      } else if (token === \"SWAP\") {\n        if (stack.length < 2) throw new Error(\"Stack underflow\");\n        const b = stack.pop();\n        const a = stack.pop();\n        stack.push(b);\n        stack.push(a);\n      } else if (token === \"OVER\") {\n        if (stack.length < 2) throw new Error(\"Stack underflow\");\n        stack.push(stack[stack.length - 2]);\n      } else {\n        throw new Error(\"Unknown word: \" + token);\n      }\n      i++;\n    }\n  }\n  function expandDef(body) {\n    const expanded = [];\n    for (const t of body) {\n      const upper = t.toUpperCase();\n      if (defs[upper]) {\n        expanded.push(...defs[upper]);\n      } else {\n        expanded.push(t);\n      }\n    }\n    return expanded;\n  }\n  for (const line of instructions) {\n    const tokens = line.split(/\\s+/).filter(t => t.length > 0);\n    exec(tokens);\n  }\n  return stack;\n}",
    testRunner: `(code) => {
  const fn = new Function(code + "; return evaluate;")();
  const r1 = fn(["1 2 +"]);
  const r2 = fn(["1 2 3", "DROP"]);
  const r3 = fn([": double 2 * ;", "5 double"]);
  const r4 = fn(["1 2 SWAP"]);
  const r5 = fn(["1 DUP"]);
  const r6 = fn([": dup-twice dup dup ;", "1 dup-twice"]);
  let err = false;
  try { fn(["1 +"]); } catch(e) { err = true; }
  return [
    { pass: JSON.stringify(r1) === "[3]", description: "1 2 + equals 3", got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === "[1,2]", description: "DROP removes top", got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === "[10]", description: "Custom word double", got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === "[2,1]", description: "SWAP reverses top two", got: JSON.stringify(r4) },
    { pass: JSON.stringify(r5) === "[1,1]", description: "DUP duplicates top", got: JSON.stringify(r5) },
    { pass: JSON.stringify(r6) === "[1,1,1]", description: "Custom word using dup", got: JSON.stringify(r6) },
    { pass: err, description: "Stack underflow throws error", got: err ? "Error thrown" : "No error" }
  ];
}`,
    hints: [
      "How does a stack-based language process tokens?",
      "Process tokens left to right. Numbers go on the stack. Operators pop values, compute, and push results. Use a dictionary for custom definitions.",
      "Maintain a stack array and a definitions object. For ':' definitions, capture the body tokens and expand any already-defined words. Execute tokens by checking if they are numbers, built-in ops, or custom words."
    ],
    resources: [
      { label: "MDN: Array.prototype.pop()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop", description: "Pop from stack" },
      { label: "MDN: Math.trunc()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc", description: "Truncate to integer" }
    ]
  }
];

newExercises.push(...exercises500);

data.exercises.push(...newExercises);

// Collection
data.collections.push({
  id: "exercism-challenges",
  name: "Exercism Challenges",
  description: "Advanced exercises from the Exercism JavaScript track covering algorithms, data structures, ciphers, and complex logic. These build on fundamentals and require creative problem-solving.",
  exerciseIds: Array.from({ length: 34 }, (_, i) => 472 + i),
  color: "#818cf8",
  source: "Exercism",
  license: "MIT",
  attribution: "Exercises adapted from the Exercism JavaScript track (exercism.org). Used under the MIT License. Copyright (c) 2021 Exercism."
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
console.log("Added " + newExercises.length + " exercises and 1 collection.");
