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
// SECTION B: js-fundamentals/loops
//
// T2 ceiling: single loop, palindrome, reverse array in-place
// Cushion steps:
//   B1 — loop building a string (new output shape, same mechanics)
//   B2 — loop tracking two variables (small step up)
//   B3 — build a number row, then a triangle (loop count as value)
//   B4 — nested loop: multiplication table row first
//   B5 — nested loop: full multiplication table
//   B6 — find all pairs summing to N (nested + condition)  [upper T3]
// ═══════════════════════════════════════════════════════════════════════════

// B1 — Loop building a string
exercises.push(js(
  'repeatChar',
  ['js-fundamentals', 'loops'],
  ['loops', 'string', 'tier3'],
  3,
  'Use a loop to build a string by repeating a character N times.',
  `Write a function \`repeatChar(char, n)\` that returns a string containing \`char\` repeated \`n\` times.

\`\`\`js
repeatChar('*', 5);   // '*****'
repeatChar('ab', 3);  // 'ababab'
repeatChar('x', 0);   // ''
\`\`\`

Do not use the built-in \`String.repeat()\` method — use a loop to build the string character by character.`,
  `function repeatChar(char, n) {
  // build the string with a loop
}`,
  `function repeatChar(char, n) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += char;
  }
  return result;
}`,
  `(code) => {
  const repeatChar = new Function(code + '; return repeatChar;')();
  return [
    { pass: repeatChar('*', 5) === '*****',    description: 'repeatChar("*", 5) === "*****"',    got: repeatChar('*', 5) },
    { pass: repeatChar('ab', 3) === 'ababab',  description: 'repeatChar("ab", 3) === "ababab"',  got: repeatChar('ab', 3) },
    { pass: repeatChar('x', 0) === '',         description: 'repeatChar("x", 0) === ""',         got: repeatChar('x', 0) },
    { pass: repeatChar('!', 1) === '!',        description: 'repeatChar("!", 1) === "!"',        got: repeatChar('!', 1) },
    { pass: repeatChar('-', 4) === '----',     description: 'repeatChar("-", 4) === "----"',     got: repeatChar('-', 4) },
  ];
}`,
  `Start with result = "". Each iteration of the loop adds char to result. After n iterations, result has been built up one piece at a time. This pattern — start with empty, build by appending — is the loop equivalent of how array methods accumulate values.`
));

// B2 — Loop tracking two variables simultaneously
exercises.push(js(
  'runningMinMax',
  ['js-fundamentals', 'loops'],
  ['loops', 'multiple-variables', 'tier3'],
  3,
  'Loop through an array tracking both the minimum and maximum values simultaneously.',
  `Write a function \`runningMinMax(nums)\` that returns an object \`{ min, max }\` with the smallest and largest values in the array.

\`\`\`js
runningMinMax([3, 1, 7, 2, 9, 4]);  // { min: 1, max: 9 }
runningMinMax([5]);                  // { min: 5, max: 5 }
runningMinMax([-3, -1, -7]);         // { min: -7, max: -1 }
\`\`\`

Use a single loop — track both \`min\` and \`max\` inside the same iteration.
Do not use \`Math.min\` or \`Math.max\`.`,
  `function runningMinMax(nums) {
  // initialize min and max, then loop and update both
}`,
  `function runningMinMax(nums) {
  let min = nums[0];
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < min) min = nums[i];
    if (nums[i] > max) max = nums[i];
  }
  return { min, max };
}`,
  `(code) => {
  const runningMinMax = new Function(code + '; return runningMinMax;')();
  const r1 = runningMinMax([3, 1, 7, 2, 9, 4]);
  const r2 = runningMinMax([5]);
  const r3 = runningMinMax([-3, -1, -7]);
  const r4 = runningMinMax([0, 0, 0]);
  return [
    { pass: r1.min === 1 && r1.max === 9,    description: '[3,1,7,2,9,4] → min:1, max:9',   got: JSON.stringify(r1) },
    { pass: r2.min === 5 && r2.max === 5,    description: '[5] → min:5, max:5',             got: JSON.stringify(r2) },
    { pass: r3.min === -7 && r3.max === -1,  description: '[-3,-1,-7] → min:-7, max:-1',   got: JSON.stringify(r3) },
    { pass: r4.min === 0 && r4.max === 0,    description: '[0,0,0] → min:0, max:0',        got: JSON.stringify(r4) },
  ];
}`,
  `Initialize both min and max to nums[0] (the first element). Then start the loop at index 1. Each iteration checks: is this number smaller than current min? Is it larger than current max? Update whichever applies. At the end, return { min, max }.`
));

// B3 — Loop where the count itself is the value
exercises.push(js(
  'numberRow',
  ['js-fundamentals', 'loops'],
  ['loops', 'string', 'pattern', 'tier3'],
  3,
  'Build a number row string using a loop where the index itself is the output.',
  `Write a function \`numberRow(n)\` that returns a string of numbers from 1 to \`n\` separated by spaces.

\`\`\`js
numberRow(5);   // '1 2 3 4 5'
numberRow(1);   // '1'
numberRow(0);   // ''
\`\`\`

The key here is that the loop counter \`i\` is not just controlling the loop — it *is* the value you want to output. Build the string as you go.`,
  `function numberRow(n) {
  // your code here
}`,
  `function numberRow(n) {
  let result = '';
  for (let i = 1; i <= n; i++) {
    if (i > 1) result += ' ';
    result += i;
  }
  return result;
}`,
  `(code) => {
  const numberRow = new Function(code + '; return numberRow;')();
  return [
    { pass: numberRow(5) === '1 2 3 4 5', description: 'numberRow(5) === "1 2 3 4 5"', got: numberRow(5) },
    { pass: numberRow(1) === '1',         description: 'numberRow(1) === "1"',         got: numberRow(1) },
    { pass: numberRow(0) === '',          description: 'numberRow(0) === ""',           got: numberRow(0) },
    { pass: numberRow(3) === '1 2 3',     description: 'numberRow(3) === "1 2 3"',     got: numberRow(3) },
    { pass: !numberRow(4).startsWith(' ') && !numberRow(4).endsWith(' '), description: 'no leading or trailing spaces', got: '"' + numberRow(4) + '"' },
  ];
}`,
  `The tricky part is spacing: you want spaces between numbers but not at the start or end. One approach: add a space before every number except the first (if i > 1, add a space, then add i). Another: build an array of numbers and join with " ".`
));

// B4 — Nested loop: multiplication table row (stepping stone to full table)
exercises.push(js(
  'multiplicationRow',
  ['js-fundamentals', 'loops'],
  ['loops', 'nested-loops', 'array', 'tier3'],
  3,
  'Build one row of a multiplication table as an array.',
  `Write a function \`multiplicationRow(n, size)\` that returns an array of \`n\` multiplied by 1 through \`size\`.

\`\`\`js
multiplicationRow(3, 5);  // [3, 6, 9, 12, 15]
multiplicationRow(7, 4);  // [7, 14, 21, 28]
multiplicationRow(1, 3);  // [1, 2, 3]
\`\`\`

This is the building block for a full multiplication table — understand this well before moving on.`,
  `function multiplicationRow(n, size) {
  // your code here
}`,
  `function multiplicationRow(n, size) {
  const row = [];
  for (let i = 1; i <= size; i++) {
    row.push(n * i);
  }
  return row;
}`,
  `(code) => {
  const multiplicationRow = new Function(code + '; return multiplicationRow;')();
  const r1 = multiplicationRow(3, 5);
  const r2 = multiplicationRow(7, 4);
  const r3 = multiplicationRow(1, 3);
  return [
    { pass: JSON.stringify(r1) === '[3,6,9,12,15]', description: 'multiplicationRow(3,5) → [3,6,9,12,15]', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[7,14,21,28]',  description: 'multiplicationRow(7,4) → [7,14,21,28]',  got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[1,2,3]',       description: 'multiplicationRow(1,3) → [1,2,3]',       got: JSON.stringify(r3) },
    { pass: multiplicationRow(5, 1).length === 1,   description: 'size=1 returns array of length 1',       got: multiplicationRow(5, 1).length },
    { pass: multiplicationRow(2, 3)[2] === 6,       description: 'last element of (2,3) is 6',            got: multiplicationRow(2, 3)[2] },
  ];
}`,
  `Loop from 1 to size (inclusive). Each iteration pushes n * i into the result array. The loop variable i is the multiplier — on i=1 you get n*1, on i=2 you get n*2, and so on.`
));

// B6 — Full multiplication table (nested loops, outer builds rows, inner builds cells)
exercises.push(js(
  'multiplicationTable',
  ['js-fundamentals', 'loops'],
  ['loops', 'nested-loops', 'array', '2d-array', 'tier3'],
  3,
  'Build a full multiplication table as a 2D array using nested loops.',
  `Write a function \`multiplicationTable(size)\` that returns a 2D array (array of arrays) representing a multiplication table.

Row \`i\` (0-indexed) contains the multiples of \`i+1\` from 1 through \`size\`.

\`\`\`js
multiplicationTable(3);
// [
//   [1, 2, 3],   // 1×1, 1×2, 1×3
//   [2, 4, 6],   // 2×1, 2×2, 2×3
//   [3, 6, 9],   // 3×1, 3×2, 3×3
// ]
\`\`\`

So \`table[row][col]\` gives \`(row+1) * (col+1)\`.`,
  `function multiplicationTable(size) {
  // outer loop: each row (1 through size)
  // inner loop: each column (1 through size)
}`,
  `function multiplicationTable(size) {
  const table = [];
  for (let row = 1; row <= size; row++) {
    const currentRow = [];
    for (let col = 1; col <= size; col++) {
      currentRow.push(row * col);
    }
    table.push(currentRow);
  }
  return table;
}`,
  `(code) => {
  const multiplicationTable = new Function(code + '; return multiplicationTable;')();
  const t3 = multiplicationTable(3);
  const t1 = multiplicationTable(1);
  const t4 = multiplicationTable(4);
  return [
    { pass: t3.length === 3,                        description: 'table(3) has 3 rows',             got: t3.length },
    { pass: t3[0].length === 3,                     description: 'each row has 3 columns',          got: t3[0].length },
    { pass: JSON.stringify(t3[0]) === '[1,2,3]',    description: 'row 0 is [1,2,3]',                got: JSON.stringify(t3[0]) },
    { pass: JSON.stringify(t3[1]) === '[2,4,6]',    description: 'row 1 is [2,4,6]',                got: JSON.stringify(t3[1]) },
    { pass: JSON.stringify(t3[2]) === '[3,6,9]',    description: 'row 2 is [3,6,9]',                got: JSON.stringify(t3[2]) },
    { pass: JSON.stringify(t1) === '[[1]]',         description: 'table(1) is [[1]]',               got: JSON.stringify(t1) },
    { pass: t4[3][3] === 16,                        description: 'table(4)[3][3] === 16 (4×4)',     got: t4[3][3] },
    { pass: t4[1][2] === 6,                         description: 'table(4)[1][2] === 6 (2×3)',      got: t4[1][2] },
  ];
}`,
  `The outer loop controls the row number (the first multiplier). The inner loop controls the column (the second multiplier). Each iteration of the inner loop pushes row*col into currentRow. When the inner loop finishes, push currentRow into table. Think of it as: outer loop = "which row am I building?", inner loop = "fill in all the cells for this row".`
));

// B7 — Upper T3: find all pairs summing to N
exercises.push(js(
  'findPairs',
  ['js-fundamentals', 'loops'],
  ['loops', 'nested-loops', 'array', 'tier3'],
  3,
  'Find all pairs of numbers in an array that sum to a target value.',
  `Write a function \`findPairs(nums, target)\` that returns an array of all pairs \`[a, b]\` where \`a + b === target\` and \`a\` comes before \`b\` in the array.

\`\`\`js
findPairs([1, 2, 3, 4, 5], 6);
// [[1,5], [2,4]]

findPairs([1, 2, 3], 10);
// []

findPairs([2, 2, 3], 4);
// [[2,2]]
\`\`\`

Each pair should be in order [\`smaller index\`, \`larger index\`]. Don't include the same element paired with itself unless there are two separate elements with that value.`,
  `function findPairs(nums, target) {
  // use nested loops: outer picks first element, inner picks second
}`,
  `function findPairs(nums, target) {
  const pairs = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        pairs.push([nums[i], nums[j]]);
      }
    }
  }
  return pairs;
}`,
  `(code) => {
  const findPairs = new Function(code + '; return findPairs;')();
  const r1 = findPairs([1, 2, 3, 4, 5], 6);
  const r2 = findPairs([1, 2, 3], 10);
  const r3 = findPairs([2, 2, 3], 4);
  const r4 = findPairs([1, 1, 1], 2);
  return [
    { pass: JSON.stringify(r1) === '[[1,5],[2,4]]', description: '[1,2,3,4,5] target 6 → [[1,5],[2,4]]', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[]',            description: '[1,2,3] target 10 → []',               got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[[2,2]]',       description: '[2,2,3] target 4 → [[2,2]]',           got: JSON.stringify(r3) },
    { pass: r4.length === 3,                        description: '[1,1,1] target 2 → 3 pairs',           got: JSON.stringify(r4) },
    { pass: findPairs([], 5).length === 0,          description: 'empty array → []',                     got: JSON.stringify(findPairs([], 5)) },
  ];
}`,
  `The outer loop picks the first element (index i). The inner loop starts at i+1 — this ensures you never pair an element with itself, and never repeat a pair in reversed order. If nums[i] + nums[j] equals the target, push [nums[i], nums[j]] to pairs.`
));

// ═══════════════════════════════════════════════════════════════════════════
// SECTION C: js-fundamentals/conditionals
//
// T2 ceiling: BMI (3-range branching), traffic light, get day name
// Cushion steps:
//   C1 — two conditions combined (shipping rate)
//   C2 — three-variable discount (layered conditions)
//   C3 — guard clause style (same result, different structure)
//   C4 — state machine (upper T3)
// ═══════════════════════════════════════════════════════════════════════════

// C1 — Two conditions combined
exercises.push(js(
  'shippingCost',
  ['js-fundamentals', 'conditionals'],
  ['conditionals', 'multiple-conditions', 'tier3'],
  3,
  'Calculate shipping cost based on two variables: weight and membership.',
  `Write a function \`shippingCost(weight, isMember)\` that returns the shipping cost in dollars.

Rules:
- Members always get free shipping (return \`0\`)
- Non-members: under 5 lbs → \`5.99\`, 5–20 lbs → \`12.99\`, over 20 lbs → \`24.99\`

\`\`\`js
shippingCost(3, true);    // 0      (member, always free)
shippingCost(3, false);   // 5.99   (non-member, light)
shippingCost(10, false);  // 12.99  (non-member, medium)
shippingCost(25, false);  // 24.99  (non-member, heavy)
\`\`\``,
  `function shippingCost(weight, isMember) {
  // check membership first, then weight ranges
}`,
  `function shippingCost(weight, isMember) {
  if (isMember) return 0;
  if (weight < 5) return 5.99;
  if (weight <= 20) return 12.99;
  return 24.99;
}`,
  `(code) => {
  const shippingCost = new Function(code + '; return shippingCost;')();
  return [
    { pass: shippingCost(3, true) === 0,      description: 'member always free',                  got: shippingCost(3, true) },
    { pass: shippingCost(25, true) === 0,     description: 'heavy member still free',             got: shippingCost(25, true) },
    { pass: shippingCost(3, false) === 5.99,  description: 'non-member under 5 lbs → 5.99',      got: shippingCost(3, false) },
    { pass: shippingCost(5, false) === 12.99, description: 'non-member exactly 5 lbs → 12.99',   got: shippingCost(5, false) },
    { pass: shippingCost(10, false) === 12.99, description: 'non-member 10 lbs → 12.99',         got: shippingCost(10, false) },
    { pass: shippingCost(20, false) === 12.99, description: 'non-member exactly 20 lbs → 12.99', got: shippingCost(20, false) },
    { pass: shippingCost(21, false) === 24.99, description: 'non-member over 20 lbs → 24.99',    got: shippingCost(21, false) },
  ];
}`,
  `Check the most decisive condition first — membership overrides everything, so put that first and return early. After that, the weight conditions apply only to non-members. Use "early return" style: once you know the answer, return it immediately rather than storing it in a variable.`
));

// C2 — Three variables, layered conditions
exercises.push(js(
  'getDiscount',
  ['js-fundamentals', 'conditionals'],
  ['conditionals', 'multiple-conditions', 'tier3'],
  3,
  'Calculate a discount percentage based on three overlapping conditions.',
  `Write a function \`getDiscount(isMember, totalSpent, isHoliday)\` that returns a discount percentage (a number).

Rules (apply the highest eligible discount — they don't stack):
- Holiday AND member AND spent over $200 → **25%**
- Member AND spent over $200 → **20%**
- Holiday AND spent over $100 → **15%**
- Member only → **10%**
- Holiday only → **5%**
- None of the above → **0%**

\`\`\`js
getDiscount(true, 250, true);   // 25
getDiscount(true, 250, false);  // 20
getDiscount(false, 150, true);  // 15
getDiscount(true, 50, false);   // 10
getDiscount(false, 50, true);   // 5
getDiscount(false, 50, false);  // 0
\`\`\``,
  `function getDiscount(isMember, totalSpent, isHoliday) {
  // check most specific/highest conditions first
}`,
  `function getDiscount(isMember, totalSpent, isHoliday) {
  if (isMember && totalSpent > 200 && isHoliday) return 25;
  if (isMember && totalSpent > 200) return 20;
  if (isHoliday && totalSpent > 100) return 15;
  if (isMember) return 10;
  if (isHoliday) return 5;
  return 0;
}`,
  `(code) => {
  const getDiscount = new Function(code + '; return getDiscount;')();
  return [
    { pass: getDiscount(true, 250, true) === 25,   description: 'member + $250 + holiday → 25%',   got: getDiscount(true, 250, true) },
    { pass: getDiscount(true, 250, false) === 20,  description: 'member + $250 → 20%',             got: getDiscount(true, 250, false) },
    { pass: getDiscount(false, 150, true) === 15,  description: 'holiday + $150 → 15%',            got: getDiscount(false, 150, true) },
    { pass: getDiscount(true, 50, false) === 10,   description: 'member only → 10%',               got: getDiscount(true, 50, false) },
    { pass: getDiscount(false, 50, true) === 5,    description: 'holiday only → 5%',               got: getDiscount(false, 50, true) },
    { pass: getDiscount(false, 50, false) === 0,   description: 'nothing → 0%',                    got: getDiscount(false, 50, false) },
    { pass: getDiscount(false, 100, true) === 5,    description: 'holiday + exactly $100 (not over $100) → still 5% holiday discount', got: getDiscount(false, 100, true) },
    { pass: getDiscount(true, 200, false) === 10,  description: 'member + exactly $200 (not over) → 10%', got: getDiscount(true, 200, false) },
  ];
}`,
  `Order your conditions from most specific to least specific. The most specific condition is the three-way combination — check it first. If you checked "isMember" before "isMember && totalSpent > 200 && isHoliday", you'd return 10 for the best case and never reach 25. Check the most demanding conditions first.`
));

// C3 — Guard clause refactoring (same logic, different structure — teaches readability)
exercises.push(js(
  'getLetterGradeGuarded',
  ['js-fundamentals', 'conditionals'],
  ['conditionals', 'guard-clause', 'tier3'],
  3,
  'Rewrite a grade function using guard clauses instead of if-else chains.',
  `Write a function \`getLetterGrade(score)\` that returns a letter grade, but this time use **guard clauses** — early returns for invalid or edge-case inputs.

Rules:
- If score is not a number (use \`typeof\`), return \`"invalid"\`
- If score < 0 or score > 100, return \`"out of range"\`
- 90–100 → \`"A"\`
- 80–89 → \`"B"\`
- 70–79 → \`"C"\`
- 60–69 → \`"D"\`
- below 60 → \`"F"\`

\`\`\`js
getLetterGrade(95);       // 'A'
getLetterGrade(72);       // 'C'
getLetterGrade(-5);       // 'out of range'
getLetterGrade('hello');  // 'invalid'
\`\`\`

The point is the **structure**: handle the "bail out" cases at the top with early returns, so the main logic at the bottom stays clean.`,
  `function getLetterGrade(score) {
  // guard clauses first (invalid, out of range)
  // then the main logic
}`,
  `function getLetterGrade(score) {
  if (typeof score !== 'number') return 'invalid';
  if (score < 0 || score > 100) return 'out of range';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}`,
  `(code) => {
  const getLetterGrade = new Function(code + '; return getLetterGrade;')();
  return [
    { pass: getLetterGrade(95) === 'A',            description: '95 → "A"',              got: getLetterGrade(95) },
    { pass: getLetterGrade(85) === 'B',            description: '85 → "B"',              got: getLetterGrade(85) },
    { pass: getLetterGrade(72) === 'C',            description: '72 → "C"',              got: getLetterGrade(72) },
    { pass: getLetterGrade(65) === 'D',            description: '65 → "D"',              got: getLetterGrade(65) },
    { pass: getLetterGrade(50) === 'F',            description: '50 → "F"',              got: getLetterGrade(50) },
    { pass: getLetterGrade(-5) === 'out of range', description: '-5 → "out of range"',  got: getLetterGrade(-5) },
    { pass: getLetterGrade(101) === 'out of range', description: '101 → "out of range"', got: getLetterGrade(101) },
    { pass: getLetterGrade('A') === 'invalid',     description: '"A" → "invalid"',       got: getLetterGrade('A') },
    { pass: getLetterGrade(null) === 'invalid',    description: 'null → "invalid"',      got: getLetterGrade(null) },
    { pass: getLetterGrade(90) === 'A',            description: '90 exactly → "A"',      got: getLetterGrade(90) },
  ];
}`,
  `Guard clauses are if statements at the top of a function that handle "invalid" or "edge case" inputs by returning early. After the guards, you can write the main logic without worrying about those cases — they already exited. typeof score !== "number" catches strings, null, undefined, booleans.`
));

// C4 — Upper T3: Vending machine state (combines conditionals + state tracking)
exercises.push(js(
  'vendingMachineState',
  ['js-fundamentals', 'conditionals'],
  ['conditionals', 'state', 'tier3'],
  3,
  'Model a vending machine transaction using conditionals and state.',
  `Write a function \`vendingMachine(balance, itemCost, amountInserted)\` that simulates a vending machine transaction.

Return an object describing the outcome:

- If \`amountInserted + balance < itemCost\`: return \`{ success: false, message: "Need $X.XX more", change: 0 }\`
- If \`amountInserted + balance >= itemCost\`: return \`{ success: true, message: "Enjoy your item!", change: <amount back> }\`

Where \`balance\` is money already in the machine, \`amountInserted\` is money just added.

\`\`\`js
vendingMachine(0, 1.50, 1.00);
// { success: false, message: "Need $0.50 more", change: 0 }

vendingMachine(0, 1.50, 2.00);
// { success: true, message: "Enjoy your item!", change: 0.50 }

vendingMachine(1.00, 1.50, 0.50);
// { success: true, message: "Enjoy your item!", change: 0 }
\`\`\`

Dollar amounts should be rounded to 2 decimal places.`,
  `function vendingMachine(balance, itemCost, amountInserted) {
  // calculate total, compare to cost, return appropriate object
}`,
  `function vendingMachine(balance, itemCost, amountInserted) {
  const total = balance + amountInserted;
  if (total < itemCost) {
    const needed = Math.round((itemCost - total) * 100) / 100;
    return { success: false, message: 'Need $' + needed.toFixed(2) + ' more', change: 0 };
  }
  const change = Math.round((total - itemCost) * 100) / 100;
  return { success: true, message: 'Enjoy your item!', change };
}`,
  `(code) => {
  const vendingMachine = new Function(code + '; return vendingMachine;')();
  const r1 = vendingMachine(0, 1.50, 1.00);
  const r2 = vendingMachine(0, 1.50, 2.00);
  const r3 = vendingMachine(1.00, 1.50, 0.50);
  const r4 = vendingMachine(0, 1.00, 1.00);
  return [
    { pass: r1.success === false,                    description: 'insufficient: success is false',         got: r1.success },
    { pass: r1.message === 'Need $0.50 more',        description: 'insufficient: message "Need $0.50 more"', got: r1.message },
    { pass: r1.change === 0,                         description: 'insufficient: change is 0',             got: r1.change },
    { pass: r2.success === true,                     description: 'sufficient: success is true',           got: r2.success },
    { pass: r2.message === 'Enjoy your item!',       description: 'sufficient: message correct',           got: r2.message },
    { pass: r2.change === 0.50,                      description: 'sufficient: change is 0.50',            got: r2.change },
    { pass: r3.success === true && r3.change === 0,  description: 'exact amount: success, no change',      got: JSON.stringify(r3) },
    { pass: r4.change === 0,                         description: 'exact price: change is 0',              got: r4.change },
  ];
}`,
  `Calculate total = balance + amountInserted first. Then one condition: total < itemCost means failure. In the failure case, compute how much more is needed (itemCost - total). In the success case, compute change (total - itemCost). Use .toFixed(2) for the message string, but return a number for the change field.`
));

// ═══════════════════════════════════════════════════════════════════════════
// SELF-VALIDATE AND WRITE
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
