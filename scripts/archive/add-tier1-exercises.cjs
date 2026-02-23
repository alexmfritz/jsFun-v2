#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function ex(title, category, tags, description, instructions, starterCode, solution, testRunner, hint) {
  return {
    id: nextId++,
    title,
    type: 'js',
    tier: 1,
    category,
    tags,
    description,
    instructions,
    starterCode,
    solution,
    testRunner,
    hint,
    resources: [],
  };
}

const exercises = [

  // ─── ARITHMETIC OPERATORS ───────────────────────────────────────────────────

  ex(
    'Add Two Numbers',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'operators', 'beginner'],
    'Return the sum of two numbers.',
    'Write a function called `addTwoNumbers` that accepts two numbers and returns their sum.\n\nExamples:\n  addTwoNumbers(3, 4)    → 7\n  addTwoNumbers(10, -2)  → 8\n  addTwoNumbers(0, 0)    → 0',
    'function addTwoNumbers(a, b) {\n  // Your code here\n\n}',
    'function addTwoNumbers(a, b) {\n  return a + b;\n}',
    `(code) => { const fn = new Function(code + '; return addTwoNumbers;')(); return [ { pass: fn(3, 4) === 7, description: 'addTwoNumbers(3, 4) → 7', got: fn(3, 4) }, { pass: fn(10, -2) === 8, description: 'addTwoNumbers(10, -2) → 8', got: fn(10, -2) }, { pass: fn(0, 0) === 0, description: 'addTwoNumbers(0, 0) → 0', got: fn(0, 0) }, { pass: fn(-5, -3) === -8, description: 'addTwoNumbers(-5, -3) → -8', got: fn(-5, -3) } ]; }`,
    'The + operator works for both addition and string concatenation. Since both parameters are numbers here, + will add them numerically.'
  ),

  ex(
    'Subtract Two Numbers',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'operators', 'beginner'],
    'Return the difference of two numbers.',
    'Write a function called `subtractTwoNumbers` that accepts two numbers and returns the result of subtracting the second from the first.\n\nExamples:\n  subtractTwoNumbers(10, 3) → 7\n  subtractTwoNumbers(5, 8)  → -3\n  subtractTwoNumbers(0, 0)  → 0',
    'function subtractTwoNumbers(a, b) {\n  // Your code here\n\n}',
    'function subtractTwoNumbers(a, b) {\n  return a - b;\n}',
    `(code) => { const fn = new Function(code + '; return subtractTwoNumbers;')(); return [ { pass: fn(10, 3) === 7, description: 'subtractTwoNumbers(10, 3) → 7', got: fn(10, 3) }, { pass: fn(5, 8) === -3, description: 'subtractTwoNumbers(5, 8) → -3', got: fn(5, 8) }, { pass: fn(0, 0) === 0, description: 'subtractTwoNumbers(0, 0) → 0', got: fn(0, 0) } ]; }`,
    'Subtraction uses the - operator. Order matters: a - b is not the same as b - a.'
  ),

  ex(
    'Multiply Two Numbers',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'operators', 'beginner'],
    'Return the product of two numbers.',
    'Write a function called `multiplyTwoNumbers` that accepts two numbers and returns their product.\n\nExamples:\n  multiplyTwoNumbers(3, 4)  → 12\n  multiplyTwoNumbers(5, -2) → -10\n  multiplyTwoNumbers(7, 0)  → 0',
    'function multiplyTwoNumbers(a, b) {\n  // Your code here\n\n}',
    'function multiplyTwoNumbers(a, b) {\n  return a * b;\n}',
    `(code) => { const fn = new Function(code + '; return multiplyTwoNumbers;')(); return [ { pass: fn(3, 4) === 12, description: 'multiplyTwoNumbers(3, 4) → 12', got: fn(3, 4) }, { pass: fn(5, -2) === -10, description: 'multiplyTwoNumbers(5, -2) → -10', got: fn(5, -2) }, { pass: fn(7, 0) === 0, description: 'anything times zero is zero', got: fn(7, 0) } ]; }`,
    'Multiplication uses the * operator in JavaScript (not ×).'
  ),

  ex(
    'Area of a Rectangle',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'operators', 'math', 'beginner'],
    'Calculate the area of a rectangle given its length and width.',
    'Write a function called `areaOfRectangle` that accepts a length and a width and returns the area.\n\nArea = length × width\n\nExamples:\n  areaOfRectangle(4, 5)   → 20\n  areaOfRectangle(3, 3)   → 9\n  areaOfRectangle(10, 2)  → 20',
    'function areaOfRectangle(length, width) {\n  // Your code here\n\n}',
    'function areaOfRectangle(length, width) {\n  return length * width;\n}',
    `(code) => { const fn = new Function(code + '; return areaOfRectangle;')(); return [ { pass: fn(4, 5) === 20, description: 'areaOfRectangle(4, 5) → 20', got: fn(4, 5) }, { pass: fn(3, 3) === 9, description: 'areaOfRectangle(3, 3) → 9 (square)', got: fn(3, 3) }, { pass: fn(10, 2) === 20, description: 'areaOfRectangle(10, 2) → 20', got: fn(10, 2) }, { pass: fn(1, 1) === 1, description: 'areaOfRectangle(1, 1) → 1', got: fn(1, 1) } ]; }`,
    'Area of a rectangle is simply length multiplied by width. No special formula needed — just multiplication.'
  ),

  ex(
    'Celsius to Fahrenheit',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'math', 'conversion', 'beginner'],
    'Convert a temperature from Celsius to Fahrenheit.',
    'Write a function called `celsiusToFahrenheit` that accepts a temperature in Celsius and returns its Fahrenheit equivalent.\n\nFormula: F = (C × 9/5) + 32\n\nExamples:\n  celsiusToFahrenheit(0)   → 32\n  celsiusToFahrenheit(100) → 212\n  celsiusToFahrenheit(-40) → -40',
    'function celsiusToFahrenheit(celsius) {\n  // Formula: (celsius * 9/5) + 32\n\n}',
    'function celsiusToFahrenheit(celsius) {\n  return (celsius * 9 / 5) + 32;\n}',
    `(code) => { const fn = new Function(code + '; return celsiusToFahrenheit;')(); return [ { pass: fn(0) === 32, description: '0°C → 32°F (freezing point)', got: fn(0) }, { pass: fn(100) === 212, description: '100°C → 212°F (boiling point)', got: fn(100) }, { pass: fn(-40) === -40, description: '-40°C → -40°F (they meet here)', got: fn(-40) }, { pass: fn(37) === 98.6, description: '37°C → 98.6°F (body temp)', got: fn(37) } ]; }`,
    'The formula is already in the starter code comment. Parentheses control order of operations — make sure you multiply before adding 32.'
  ),

  ex(
    'Perimeter of a Rectangle',
    ['js-fundamentals', 'operators', 'arithmetic'],
    ['arithmetic', 'math', 'operators', 'beginner'],
    'Calculate the perimeter of a rectangle given its length and width.',
    'Write a function called `perimeterOfRectangle` that accepts a length and a width and returns the perimeter.\n\nPerimeter = 2 × (length + width)\n\nExamples:\n  perimeterOfRectangle(4, 5) → 18\n  perimeterOfRectangle(3, 3) → 12\n  perimeterOfRectangle(1, 8) → 18',
    'function perimeterOfRectangle(length, width) {\n  // Your code here\n\n}',
    'function perimeterOfRectangle(length, width) {\n  return 2 * (length + width);\n}',
    `(code) => { const fn = new Function(code + '; return perimeterOfRectangle;')(); return [ { pass: fn(4, 5) === 18, description: 'perimeterOfRectangle(4, 5) → 18', got: fn(4, 5) }, { pass: fn(3, 3) === 12, description: 'square side 3 → 12', got: fn(3, 3) }, { pass: fn(1, 8) === 18, description: 'perimeterOfRectangle(1, 8) → 18', got: fn(1, 8) }, { pass: fn(10, 10) === 40, description: 'square side 10 → 40', got: fn(10, 10) } ]; }`,
    'A rectangle has two pairs of equal sides. Add the length and width to get one pair, then double it. Parentheses ensure you add before multiplying.'
  ),

  // ─── COMPARISON OPERATORS ────────────────────────────────────────────────────

  ex(
    'Is Equal?',
    ['js-fundamentals', 'operators', 'comparison'],
    ['comparison', 'operators', 'boolean', 'beginner'],
    'Return true if two values are strictly equal.',
    'Write a function called `isEqual` that accepts two values and returns `true` if they are strictly equal, `false` otherwise.\n\nUse strict equality (===), not loose equality (==).\n\nExamples:\n  isEqual(3, 3)     → true\n  isEqual(3, "3")   → false\n  isEqual(null, null) → true\n  isEqual(0, false) → false',
    'function isEqual(a, b) {\n  // Use === not ==\n\n}',
    'function isEqual(a, b) {\n  return a === b;\n}',
    `(code) => { const fn = new Function(code + '; return isEqual;')(); return [ { pass: fn(3, 3) === true, description: 'isEqual(3, 3) → true', got: fn(3, 3) }, { pass: fn(3, "3") === false, description: 'isEqual(3, "3") → false (different types)', got: fn(3, "3") }, { pass: fn(null, null) === true, description: 'isEqual(null, null) → true', got: fn(null, null) }, { pass: fn(0, false) === false, description: 'isEqual(0, false) → false (=== checks type)', got: fn(0, false) } ]; }`,
    '=== checks both value AND type. 3 and "3" look the same but one is a number and one is a string, so === returns false. This is why we prefer === over == in JavaScript.'
  ),

  ex(
    'Is Greater Than?',
    ['js-fundamentals', 'operators', 'comparison'],
    ['comparison', 'operators', 'boolean', 'beginner'],
    'Return true if the first number is greater than the second.',
    'Write a function called `isGreaterThan` that accepts two numbers and returns `true` if the first is greater than the second, `false` otherwise.\n\nExamples:\n  isGreaterThan(5, 3)  → true\n  isGreaterThan(3, 5)  → false\n  isGreaterThan(4, 4)  → false',
    'function isGreaterThan(a, b) {\n  // Your code here\n\n}',
    'function isGreaterThan(a, b) {\n  return a > b;\n}',
    `(code) => { const fn = new Function(code + '; return isGreaterThan;')(); return [ { pass: fn(5, 3) === true, description: 'isGreaterThan(5, 3) → true', got: fn(5, 3) }, { pass: fn(3, 5) === false, description: 'isGreaterThan(3, 5) → false', got: fn(3, 5) }, { pass: fn(4, 4) === false, description: 'isGreaterThan(4, 4) → false (equal is not greater)', got: fn(4, 4) }, { pass: fn(-1, -5) === true, description: 'isGreaterThan(-1, -5) → true', got: fn(-1, -5) } ]; }`,
    'The > operator returns a boolean directly — you can return its result without wrapping it in an if statement.'
  ),

  ex(
    'Is Between?',
    ['js-fundamentals', 'operators', 'comparison'],
    ['comparison', 'operators', 'boolean', 'beginner'],
    'Return true if a number falls strictly between a min and max.',
    'Write a function called `isBetween` that accepts three numbers: `num`, `min`, and `max`. Return `true` if `num` is strictly between `min` and `max` (not equal to either).\n\nExamples:\n  isBetween(5, 1, 10) → true\n  isBetween(1, 1, 10) → false  (equal to min)\n  isBetween(10, 1, 10) → false (equal to max)\n  isBetween(0, 1, 10) → false',
    'function isBetween(num, min, max) {\n  // Your code here\n\n}',
    'function isBetween(num, min, max) {\n  return num > min && num < max;\n}',
    `(code) => { const fn = new Function(code + '; return isBetween;')(); return [ { pass: fn(5, 1, 10) === true, description: 'isBetween(5, 1, 10) → true', got: fn(5, 1, 10) }, { pass: fn(1, 1, 10) === false, description: 'equal to min → false', got: fn(1, 1, 10) }, { pass: fn(10, 1, 10) === false, description: 'equal to max → false', got: fn(10, 1, 10) }, { pass: fn(0, 1, 10) === false, description: 'below min → false', got: fn(0, 1, 10) }, { pass: fn(9, 1, 10) === true, description: 'isBetween(9, 1, 10) → true', got: fn(9, 1, 10) } ]; }`,
    'Two conditions both need to be true: num must be greater than min AND less than max. The && operator requires both sides to be true.'
  ),

  // ─── CONDITIONALS ────────────────────────────────────────────────────────────

  ex(
    'Positive, Negative, or Zero',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'if-else', 'beginner'],
    'Return "positive", "negative", or "zero" based on a number.',
    'Write a function called `signOf` that accepts a number and returns the string "positive", "negative", or "zero".\n\nExamples:\n  signOf(5)  → "positive"\n  signOf(-3) → "negative"\n  signOf(0)  → "zero"',
    'function signOf(num) {\n  if (num > 0) {\n    // Your code here\n  } else if (num < 0) {\n    // Your code here\n  } else {\n    // Your code here\n  }\n}',
    'function signOf(num) {\n  if (num > 0) {\n    return "positive";\n  } else if (num < 0) {\n    return "negative";\n  } else {\n    return "zero";\n  }\n}',
    `(code) => { const fn = new Function(code + '; return signOf;')(); return [ { pass: fn(5) === "positive", description: 'signOf(5) → "positive"', got: fn(5) }, { pass: fn(-3) === "negative", description: 'signOf(-3) → "negative"', got: fn(-3) }, { pass: fn(0) === "zero", description: 'signOf(0) → "zero"', got: fn(0) }, { pass: fn(100) === "positive", description: 'signOf(100) → "positive"', got: fn(100) }, { pass: fn(-0.1) === "negative", description: 'signOf(-0.1) → "negative"', got: fn(-0.1) } ]; }`,
    'The if/else if/else skeleton is already there — you just need to fill in each return value. Three possible states means three branches.'
  ),

  ex(
    'Pass or Fail',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'if-else', 'beginner'],
    'Return "pass" if a grade is 60 or above, "fail" otherwise.',
    'Write a function called `passOrFail` that accepts a numeric grade and returns "pass" if the grade is 60 or above, "fail" otherwise.\n\nExamples:\n  passOrFail(75) → "pass"\n  passOrFail(60) → "pass"\n  passOrFail(59) → "fail"\n  passOrFail(0)  → "fail"',
    'function passOrFail(grade) {\n  if (grade >= 60) {\n    // Your code here\n  } else {\n    // Your code here\n  }\n}',
    'function passOrFail(grade) {\n  if (grade >= 60) {\n    return "pass";\n  } else {\n    return "fail";\n  }\n}',
    `(code) => { const fn = new Function(code + '; return passOrFail;')(); return [ { pass: fn(75) === "pass", description: 'passOrFail(75) → "pass"', got: fn(75) }, { pass: fn(60) === "pass", description: 'passOrFail(60) → "pass" (boundary)', got: fn(60) }, { pass: fn(59) === "fail", description: 'passOrFail(59) → "fail" (boundary)', got: fn(59) }, { pass: fn(0) === "fail", description: 'passOrFail(0) → "fail"', got: fn(0) }, { pass: fn(100) === "pass", description: 'passOrFail(100) → "pass"', got: fn(100) } ]; }`,
    'The condition is already in the skeleton. Notice it uses >= (greater than OR equal to) so that exactly 60 passes. Fill in the two return statements.'
  ),

  ex(
    'Maximum of Two',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'comparison', 'beginner'],
    'Return the larger of two numbers.',
    'Write a function called `maxOfTwo` that accepts two numbers and returns whichever is larger. If they are equal, return either one.\n\nExamples:\n  maxOfTwo(3, 7)   → 7\n  maxOfTwo(10, 4)  → 10\n  maxOfTwo(5, 5)   → 5',
    'function maxOfTwo(a, b) {\n  if (a >= b) {\n    // Your code here\n  } else {\n    // Your code here\n  }\n}',
    'function maxOfTwo(a, b) {\n  if (a >= b) {\n    return a;\n  } else {\n    return b;\n  }\n}',
    `(code) => { const fn = new Function(code + '; return maxOfTwo;')(); return [ { pass: fn(3, 7) === 7, description: 'maxOfTwo(3, 7) → 7', got: fn(3, 7) }, { pass: fn(10, 4) === 10, description: 'maxOfTwo(10, 4) → 10', got: fn(10, 4) }, { pass: fn(5, 5) === 5, description: 'maxOfTwo(5, 5) → 5 (equal)', got: fn(5, 5) }, { pass: fn(-1, -3) === -1, description: 'maxOfTwo(-1, -3) → -1', got: fn(-1, -3) } ]; }`,
    'If a is greater than or equal to b, a is the max. Otherwise, b must be the max. The structure is already built for you.'
  ),

  ex(
    'Minimum of Two',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'comparison', 'beginner'],
    'Return the smaller of two numbers.',
    'Write a function called `minOfTwo` that accepts two numbers and returns whichever is smaller. If they are equal, return either one.\n\nExamples:\n  minOfTwo(3, 7)   → 3\n  minOfTwo(10, 4)  → 4\n  minOfTwo(5, 5)   → 5',
    'function minOfTwo(a, b) {\n  if (a <= b) {\n    // Your code here\n  } else {\n    // Your code here\n  }\n}',
    'function minOfTwo(a, b) {\n  if (a <= b) {\n    return a;\n  } else {\n    return b;\n  }\n}',
    `(code) => { const fn = new Function(code + '; return minOfTwo;')(); return [ { pass: fn(3, 7) === 3, description: 'minOfTwo(3, 7) → 3', got: fn(3, 7) }, { pass: fn(10, 4) === 4, description: 'minOfTwo(10, 4) → 4', got: fn(10, 4) }, { pass: fn(5, 5) === 5, description: 'minOfTwo(5, 5) → 5 (equal)', got: fn(5, 5) }, { pass: fn(-2, -8) === -8, description: 'minOfTwo(-2, -8) → -8', got: fn(-2, -8) } ]; }`,
    'This is the mirror of maxOfTwo — if a is less than or equal to b, a is the minimum. The skeleton uses <= to handle equal values cleanly.'
  ),

  ex(
    'Letter Grade',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'if-else', 'beginner'],
    'Convert a numeric score to a letter grade A–F.',
    'Write a function called `letterGrade` that accepts a numeric score (0–100) and returns the corresponding letter grade.\n\n  90–100 → "A"\n  80–89  → "B"\n  70–79  → "C"\n  60–69  → "D"\n  0–59   → "F"\n\nExamples:\n  letterGrade(95)  → "A"\n  letterGrade(82)  → "B"\n  letterGrade(55)  → "F"',
    'function letterGrade(score) {\n  if (score >= 90) {\n    // Your code here\n  } else if (score >= 80) {\n    // Your code here\n  } else if (score >= 70) {\n    // Your code here\n  } else if (score >= 60) {\n    // Your code here\n  } else {\n    // Your code here\n  }\n}',
    'function letterGrade(score) {\n  if (score >= 90) {\n    return "A";\n  } else if (score >= 80) {\n    return "B";\n  } else if (score >= 70) {\n    return "C";\n  } else if (score >= 60) {\n    return "D";\n  } else {\n    return "F";\n  }\n}',
    `(code) => { const fn = new Function(code + '; return letterGrade;')(); return [ { pass: fn(95) === "A", description: 'letterGrade(95) → "A"', got: fn(95) }, { pass: fn(90) === "A", description: 'letterGrade(90) → "A" (boundary)', got: fn(90) }, { pass: fn(82) === "B", description: 'letterGrade(82) → "B"', got: fn(82) }, { pass: fn(75) === "C", description: 'letterGrade(75) → "C"', got: fn(75) }, { pass: fn(62) === "D", description: 'letterGrade(62) → "D"', got: fn(62) }, { pass: fn(55) === "F", description: 'letterGrade(55) → "F"', got: fn(55) } ]; }`,
    'The entire if/else if structure is built — each branch handles a range. Because conditions are checked top to bottom, checking >= 80 is enough for B without also checking < 90.'
  ),

  ex(
    'Is Leap Year?',
    ['js-fundamentals', 'conditionals'],
    ['conditionals', 'modulo', 'beginner'],
    'Return true if a year is a leap year.',
    'Write a function called `isLeapYear` that accepts a year and returns `true` if it is a leap year, `false` otherwise.\n\nA leap year is:\n  - Divisible by 4\n  - EXCEPT centuries (divisible by 100), which must also be divisible by 400\n\nExamples:\n  isLeapYear(2000) → true   (divisible by 400)\n  isLeapYear(1900) → false  (divisible by 100 but not 400)\n  isLeapYear(2024) → true   (divisible by 4, not a century)\n  isLeapYear(2023) → false',
    'function isLeapYear(year) {\n  if (year % 400 === 0) {\n    // divisible by 400 → always a leap year\n\n  } else if (year % 100 === 0) {\n    // divisible by 100 but not 400 → not a leap year\n\n  } else if (year % 4 === 0) {\n    // divisible by 4 but not 100 → leap year\n\n  } else {\n    // not divisible by 4 → not a leap year\n\n  }\n}',
    'function isLeapYear(year) {\n  if (year % 400 === 0) {\n    return true;\n  } else if (year % 100 === 0) {\n    return false;\n  } else if (year % 4 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}',
    `(code) => { const fn = new Function(code + '; return isLeapYear;')(); return [ { pass: fn(2000) === true, description: 'isLeapYear(2000) → true (÷400)', got: fn(2000) }, { pass: fn(1900) === false, description: 'isLeapYear(1900) → false (÷100 not ÷400)', got: fn(1900) }, { pass: fn(2024) === true, description: 'isLeapYear(2024) → true (÷4, not century)', got: fn(2024) }, { pass: fn(2023) === false, description: 'isLeapYear(2023) → false', got: fn(2023) } ]; }`,
    'The skeleton comments explain every rule and the structure is built for you. Each branch just needs a return true or return false. Check the 400 rule first — order matters here.'
  ),

  // ─── LOOPS ───────────────────────────────────────────────────────────────────

  ex(
    'Count Up to N',
    ['js-fundamentals', 'loops'],
    ['loops', 'arrays', 'beginner'],
    'Return an array of integers from 1 up to n.',
    'Write a function called `countUpTo` that accepts a positive integer `n` and returns an array containing all integers from 1 to n (inclusive).\n\nExamples:\n  countUpTo(5) → [1, 2, 3, 4, 5]\n  countUpTo(1) → [1]\n  countUpTo(3) → [1, 2, 3]',
    'function countUpTo(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    // Your code here\n  }\n  return result;\n}',
    'function countUpTo(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    result.push(i);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return countUpTo;')(); return [ { pass: JSON.stringify(fn(5)) === '[1,2,3,4,5]', description: 'countUpTo(5) → [1,2,3,4,5]', got: JSON.stringify(fn(5)) }, { pass: JSON.stringify(fn(1)) === '[1]', description: 'countUpTo(1) → [1]', got: JSON.stringify(fn(1)) }, { pass: JSON.stringify(fn(3)) === '[1,2,3]', description: 'countUpTo(3) → [1,2,3]', got: JSON.stringify(fn(3)) } ]; }`,
    'The loop is already built — it starts at 1 and runs up to n. Inside the loop, i holds the current number. You just need to add i to the result array using .push().'
  ),

  ex(
    'Count Down from N',
    ['js-fundamentals', 'loops'],
    ['loops', 'arrays', 'beginner'],
    'Return an array counting down from n to 1.',
    'Write a function called `countDownFrom` that accepts a positive integer `n` and returns an array counting down from n to 1.\n\nExamples:\n  countDownFrom(5) → [5, 4, 3, 2, 1]\n  countDownFrom(1) → [1]\n  countDownFrom(3) → [3, 2, 1]',
    'function countDownFrom(n) {\n  const result = [];\n  for (let i = n; i >= 1; i--) {\n    // Your code here\n  }\n  return result;\n}',
    'function countDownFrom(n) {\n  const result = [];\n  for (let i = n; i >= 1; i--) {\n    result.push(i);\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return countDownFrom;')(); return [ { pass: JSON.stringify(fn(5)) === '[5,4,3,2,1]', description: 'countDownFrom(5) → [5,4,3,2,1]', got: JSON.stringify(fn(5)) }, { pass: JSON.stringify(fn(1)) === '[1]', description: 'countDownFrom(1) → [1]', got: JSON.stringify(fn(1)) }, { pass: JSON.stringify(fn(3)) === '[3,2,1]', description: 'countDownFrom(3) → [3,2,1]', got: JSON.stringify(fn(3)) } ]; }`,
    'The loop starts at n and counts down with i-- (decrement). The condition is i >= 1 so it stops at 1, not 0. Just push i into the result array each iteration.'
  ),

  ex(
    'Sum from 1 to N',
    ['js-fundamentals', 'loops'],
    ['loops', 'accumulator', 'math', 'beginner'],
    'Return the sum of all integers from 1 up to n.',
    'Write a function called `sumToN` that accepts a positive integer `n` and returns the sum of all integers from 1 to n.\n\nExamples:\n  sumToN(5)  → 15  (1+2+3+4+5)\n  sumToN(1)  → 1\n  sumToN(10) → 55',
    'function sumToN(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    // Your code here\n  }\n  return sum;\n}',
    'function sumToN(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}',
    `(code) => { const fn = new Function(code + '; return sumToN;')(); return [ { pass: fn(5) === 15, description: 'sumToN(5) → 15 (1+2+3+4+5)', got: fn(5) }, { pass: fn(1) === 1, description: 'sumToN(1) → 1', got: fn(1) }, { pass: fn(10) === 55, description: 'sumToN(10) → 55', got: fn(10) }, { pass: fn(100) === 5050, description: 'sumToN(100) → 5050', got: fn(100) } ]; }`,
    'The accumulator pattern: start sum at 0, then add i to it on each loop iteration. sum += i is shorthand for sum = sum + i.'
  ),

  ex(
    'Even Numbers in Range',
    ['js-fundamentals', 'loops'],
    ['loops', 'arrays', 'modulo', 'beginner'],
    'Return an array of all even numbers from 1 to n.',
    'Write a function called `evensUpTo` that accepts a positive integer `n` and returns an array of all even numbers from 1 to n.\n\nExamples:\n  evensUpTo(10) → [2, 4, 6, 8, 10]\n  evensUpTo(7)  → [2, 4, 6]\n  evensUpTo(2)  → [2]',
    'function evensUpTo(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) {\n      // Your code here\n    }\n  }\n  return result;\n}',
    'function evensUpTo(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 2 === 0) {\n      result.push(i);\n    }\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return evensUpTo;')(); return [ { pass: JSON.stringify(fn(10)) === '[2,4,6,8,10]', description: 'evensUpTo(10) → [2,4,6,8,10]', got: JSON.stringify(fn(10)) }, { pass: JSON.stringify(fn(7)) === '[2,4,6]', description: 'evensUpTo(7) → [2,4,6]', got: JSON.stringify(fn(7)) }, { pass: JSON.stringify(fn(2)) === '[2]', description: 'evensUpTo(2) → [2]', got: JSON.stringify(fn(2)) }, { pass: JSON.stringify(fn(1)) === '[]', description: 'evensUpTo(1) → []', got: JSON.stringify(fn(1)) } ]; }`,
    'The loop structure and the even-number check (% 2 === 0) are already in place. You just need to add the number to the result array inside the if block.'
  ),

  ex(
    'FizzBuzz',
    ['js-fundamentals', 'loops'],
    ['loops', 'conditionals', 'modulo', 'classic', 'beginner'],
    'Return an array with FizzBuzz substitutions from 1 to n.',
    'Write a function called `fizzBuzz` that accepts a number `n` and returns an array of values from 1 to n where:\n  - Multiples of both 3 and 5 → "FizzBuzz"\n  - Multiples of 3 only        → "Fizz"\n  - Multiples of 5 only        → "Buzz"\n  - Everything else             → the number itself\n\nExamples:\n  fizzBuzz(5)  → [1, 2, "Fizz", 4, "Buzz"]\n  fizzBuzz(15) → [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]',
    'function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) {\n      // Your code here — FizzBuzz\n    } else if (i % 3 === 0) {\n      // Your code here — Fizz\n    } else if (i % 5 === 0) {\n      // Your code here — Buzz\n    } else {\n      // Your code here — the number\n    }\n  }\n  return result;\n}',
    'function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) {\n      result.push("FizzBuzz");\n    } else if (i % 3 === 0) {\n      result.push("Fizz");\n    } else if (i % 5 === 0) {\n      result.push("Buzz");\n    } else {\n      result.push(i);\n    }\n  }\n  return result;\n}',
    `(code) => { const fn = new Function(code + '; return fizzBuzz;')(); const r5 = fn(5); const r15 = fn(15); return [ { pass: JSON.stringify(r5) === '[1,2,"Fizz",4,"Buzz"]', description: 'fizzBuzz(5) → [1,2,"Fizz",4,"Buzz"]', got: JSON.stringify(r5) }, { pass: r15[14] === "FizzBuzz", description: 'position 15 → "FizzBuzz"', got: r15[14] }, { pass: r15[2] === "Fizz", description: 'position 3 → "Fizz"', got: r15[2] }, { pass: r15[4] === "Buzz", description: 'position 5 → "Buzz"', got: r15[4] }, { pass: r15[0] === 1, description: 'position 1 → 1 (number)', got: r15[0] } ]; }`,
    'The entire structure is built — all four branches and the loop. Notice the FizzBuzz check (% 15) comes first. If you checked % 3 first, you\'d never reach the FizzBuzz branch for multiples of 15. Just fill in the four push() calls.'
  ),

  // ─── ARRAY BASICS ────────────────────────────────────────────────────────────

  ex(
    'Get First Element',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'indexing', 'beginner'],
    'Return the first element of an array.',
    'Write a function called `getFirst` that accepts an array and returns its first element.\n\nExamples:\n  getFirst([1, 2, 3]) → 1\n  getFirst(["a", "b"]) → "a"\n  getFirst([42])       → 42',
    'function getFirst(arr) {\n  // Your code here\n\n}',
    'function getFirst(arr) {\n  return arr[0];\n}',
    `(code) => { const fn = new Function(code + '; return getFirst;')(); return [ { pass: fn([1,2,3]) === 1, description: 'getFirst([1,2,3]) → 1', got: fn([1,2,3]) }, { pass: fn(["a","b"]) === "a", description: 'getFirst(["a","b"]) → "a"', got: fn(["a","b"]) }, { pass: fn([42]) === 42, description: 'single-element array → 42', got: fn([42]) } ]; }`,
    'Arrays are zero-indexed — the first element lives at index 0. Use bracket notation: arr[0].'
  ),

  ex(
    'Get Last Element',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'indexing', 'beginner'],
    'Return the last element of an array.',
    'Write a function called `getLast` that accepts an array and returns its last element.\n\nExamples:\n  getLast([1, 2, 3]) → 3\n  getLast(["a", "b"]) → "b"\n  getLast([42])       → 42',
    'function getLast(arr) {\n  // The last index is arr.length - 1\n\n}',
    'function getLast(arr) {\n  return arr[arr.length - 1];\n}',
    `(code) => { const fn = new Function(code + '; return getLast;')(); return [ { pass: fn([1,2,3]) === 3, description: 'getLast([1,2,3]) → 3', got: fn([1,2,3]) }, { pass: fn(["a","b"]) === "b", description: 'getLast(["a","b"]) → "b"', got: fn(["a","b"]) }, { pass: fn([42]) === 42, description: 'single-element array → 42', got: fn([42]) }, { pass: fn([10,20,30,40]) === 40, description: 'getLast([10,20,30,40]) → 40', got: fn([10,20,30,40]) } ]; }`,
    'If an array has 3 elements, their indices are 0, 1, 2. The last index is always length - 1. The hint is already in the starter code comment.'
  ),

  ex(
    'Array Length',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'beginner'],
    'Return the number of elements in an array.',
    'Write a function called `arrayLength` that accepts an array and returns the number of elements it contains.\n\nExamples:\n  arrayLength([1, 2, 3]) → 3\n  arrayLength([])         → 0\n  arrayLength(["a"])      → 1',
    'function arrayLength(arr) {\n  // Your code here\n\n}',
    'function arrayLength(arr) {\n  return arr.length;\n}',
    `(code) => { const fn = new Function(code + '; return arrayLength;')(); return [ { pass: fn([1,2,3]) === 3, description: 'arrayLength([1,2,3]) → 3', got: fn([1,2,3]) }, { pass: fn([]) === 0, description: 'arrayLength([]) → 0', got: fn([]) }, { pass: fn(["a"]) === 1, description: 'arrayLength(["a"]) → 1', got: fn(["a"]) } ]; }`,
    'Every array has a built-in .length property that tells you how many elements it contains. No loops or methods needed.'
  ),

  ex(
    'Array Contains Value',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'searching', 'beginner'],
    'Return true if an array contains a given value.',
    'Write a function called `arrayContains` that accepts an array and a value, and returns `true` if the value is in the array, `false` otherwise.\n\nExamples:\n  arrayContains([1, 2, 3], 2) → true\n  arrayContains([1, 2, 3], 5) → false\n  arrayContains([], 1)         → false',
    'function arrayContains(arr, value) {\n  // Your code here\n\n}',
    'function arrayContains(arr, value) {\n  return arr.includes(value);\n}',
    `(code) => { const fn = new Function(code + '; return arrayContains;')(); return [ { pass: fn([1,2,3], 2) === true, description: 'arrayContains([1,2,3], 2) → true', got: fn([1,2,3], 2) }, { pass: fn([1,2,3], 5) === false, description: 'arrayContains([1,2,3], 5) → false', got: fn([1,2,3], 5) }, { pass: fn([], 1) === false, description: 'empty array → false', got: fn([], 1) }, { pass: fn(["a","b","c"], "b") === true, description: 'works with strings too', got: fn(["a","b","c"], "b") } ]; }`,
    'Arrays have a built-in .includes() method that returns a boolean. It checks whether a value appears anywhere in the array.'
  ),

  ex(
    'Add to End of Array',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'mutation', 'beginner'],
    'Add a value to the end of an array and return the updated array.',
    'Write a function called `addToEnd` that accepts an array and a value, adds the value to the end of the array, and returns the updated array.\n\nExamples:\n  addToEnd([1, 2, 3], 4) → [1, 2, 3, 4]\n  addToEnd([], 5)         → [5]\n  addToEnd(["a"], "b")    → ["a", "b"]',
    'function addToEnd(arr, value) {\n  arr.push(value);\n  // Your code here — return the array\n\n}',
    'function addToEnd(arr, value) {\n  arr.push(value);\n  return arr;\n}',
    `(code) => { const fn = new Function(code + '; return addToEnd;')(); return [ { pass: JSON.stringify(fn([1,2,3], 4)) === '[1,2,3,4]', description: 'addToEnd([1,2,3], 4) → [1,2,3,4]', got: JSON.stringify(fn([1,2,3], 4)) }, { pass: JSON.stringify(fn([], 5)) === '[5]', description: 'addToEnd([], 5) → [5]', got: JSON.stringify(fn([], 5)) }, { pass: JSON.stringify(fn(["a"], "b")) === '["a","b"]', description: 'addToEnd(["a"], "b") → ["a","b"]', got: JSON.stringify(fn(["a"], "b")) } ]; }`,
    '.push() is already called for you — it adds the value and mutates the array in place. The last thing left is to return the array.'
  ),

  ex(
    'Remove Last Element',
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'mutation', 'beginner'],
    'Remove and return the last element of an array.',
    'Write a function called `removeFromEnd` that accepts an array, removes its last element, and returns that removed element.\n\nExamples:\n  removeFromEnd([1, 2, 3]) → 3  (array becomes [1, 2])\n  removeFromEnd([5])        → 5  (array becomes [])\n  removeFromEnd(["a","b"])  → "b"',
    'function removeFromEnd(arr) {\n  // .pop() removes and returns the last element\n\n}',
    'function removeFromEnd(arr) {\n  return arr.pop();\n}',
    `(code) => { const fn = new Function(code + '; return removeFromEnd;')(); return [ { pass: fn([1,2,3]) === 3, description: 'removeFromEnd([1,2,3]) → 3', got: fn([1,2,3]) }, { pass: fn([5]) === 5, description: 'single element → 5', got: fn([5]) }, { pass: fn(["a","b"]) === "b", description: 'removeFromEnd(["a","b"]) → "b"', got: fn(["a","b"]) } ]; }`,
    '.pop() does two things at once: it removes the last element from the array AND returns that element. You can return the result of .pop() directly.'
  ),

  // ─── STRINGS ─────────────────────────────────────────────────────────────────

  ex(
    'String Length',
    ['data-structures', 'strings'],
    ['strings', 'beginner'],
    'Return the number of characters in a string.',
    'Write a function called `stringLength` that accepts a string and returns the number of characters in it.\n\nExamples:\n  stringLength("hello") → 5\n  stringLength("")       → 0\n  stringLength("hi")     → 2',
    'function stringLength(str) {\n  // Your code here\n\n}',
    'function stringLength(str) {\n  return str.length;\n}',
    `(code) => { const fn = new Function(code + '; return stringLength;')(); return [ { pass: fn("hello") === 5, description: 'stringLength("hello") → 5', got: fn("hello") }, { pass: fn("") === 0, description: 'empty string → 0', got: fn("") }, { pass: fn("hi") === 2, description: 'stringLength("hi") → 2', got: fn("hi") }, { pass: fn("JavaScript") === 10, description: 'stringLength("JavaScript") → 10', got: fn("JavaScript") } ]; }`,
    'Just like arrays, strings have a built-in .length property. No method call needed — just str.length.'
  ),

  ex(
    'Uppercase a String',
    ['data-structures', 'strings'],
    ['strings', 'methods', 'beginner'],
    'Return a string converted to all uppercase letters.',
    'Write a function called `uppercaseString` that accepts a string and returns it with all letters converted to uppercase.\n\nExamples:\n  uppercaseString("hello")   → "HELLO"\n  uppercaseString("World")   → "WORLD"\n  uppercaseString("already") → "ALREADY"',
    'function uppercaseString(str) {\n  // Your code here\n\n}',
    'function uppercaseString(str) {\n  return str.toUpperCase();\n}',
    `(code) => { const fn = new Function(code + '; return uppercaseString;')(); return [ { pass: fn("hello") === "HELLO", description: 'uppercaseString("hello") → "HELLO"', got: fn("hello") }, { pass: fn("World") === "WORLD", description: 'uppercaseString("World") → "WORLD"', got: fn("World") }, { pass: fn("already") === "ALREADY", description: 'uppercaseString("already") → "ALREADY"', got: fn("already") } ]; }`,
    'Strings have a built-in .toUpperCase() method that returns a new string with all characters uppercased. The original string is not modified.'
  ),

  ex(
    'Lowercase a String',
    ['data-structures', 'strings'],
    ['strings', 'methods', 'beginner'],
    'Return a string converted to all lowercase letters.',
    'Write a function called `lowercaseString` that accepts a string and returns it with all letters converted to lowercase.\n\nExamples:\n  lowercaseString("HELLO")   → "hello"\n  lowercaseString("World")   → "world"\n  lowercaseString("MiXeD")   → "mixed"',
    'function lowercaseString(str) {\n  // Your code here\n\n}',
    'function lowercaseString(str) {\n  return str.toLowerCase();\n}',
    `(code) => { const fn = new Function(code + '; return lowercaseString;')(); return [ { pass: fn("HELLO") === "hello", description: 'lowercaseString("HELLO") → "hello"', got: fn("HELLO") }, { pass: fn("World") === "world", description: 'lowercaseString("World") → "world"', got: fn("World") }, { pass: fn("MiXeD") === "mixed", description: 'lowercaseString("MiXeD") → "mixed"', got: fn("MiXeD") } ]; }`,
    'The mirror of .toUpperCase() — strings have a .toLowerCase() method that returns all characters as lowercase.'
  ),

  ex(
    'Capitalize First Letter',
    ['data-structures', 'strings'],
    ['strings', 'methods', 'indexing', 'beginner'],
    'Return a string with its first letter capitalized.',
    'Write a function called `capitalizeFirst` that accepts a string and returns it with the first letter capitalized and the rest unchanged.\n\nExamples:\n  capitalizeFirst("hello") → "Hello"\n  capitalizeFirst("world") → "World"\n  capitalizeFirst("already") → "Already"',
    'function capitalizeFirst(str) {\n  // Hint: str[0].toUpperCase() gives you the first letter uppercased\n  // Hint: str.slice(1) gives you everything after the first character\n\n}',
    'function capitalizeFirst(str) {\n  return str[0].toUpperCase() + str.slice(1);\n}',
    `(code) => { const fn = new Function(code + '; return capitalizeFirst;')(); return [ { pass: fn("hello") === "Hello", description: 'capitalizeFirst("hello") → "Hello"', got: fn("hello") }, { pass: fn("world") === "World", description: 'capitalizeFirst("world") → "World"', got: fn("world") }, { pass: fn("already") === "Already", description: 'first letter caps, rest unchanged', got: fn("already") }, { pass: fn("javaScript") === "JavaScript", description: 'capitalizeFirst("javaScript") → "JavaScript"', got: fn("javaScript") } ]; }`,
    'Two pieces joined together: uppercase the first character (str[0].toUpperCase()), then concatenate everything else (str.slice(1)). Both hints are in the starter code.'
  ),

  ex(
    'Trim Whitespace',
    ['data-structures', 'strings'],
    ['strings', 'methods', 'beginner'],
    'Remove leading and trailing whitespace from a string.',
    'Write a function called `trimString` that accepts a string and returns it with leading and trailing whitespace removed.\n\nExamples:\n  trimString("  hello  ") → "hello"\n  trimString("  hi")      → "hi"\n  trimString("bye  ")     → "bye"',
    'function trimString(str) {\n  // Your code here\n\n}',
    'function trimString(str) {\n  return str.trim();\n}',
    `(code) => { const fn = new Function(code + '; return trimString;')(); return [ { pass: fn("  hello  ") === "hello", description: 'trimString("  hello  ") → "hello"', got: fn("  hello  ") }, { pass: fn("  hi") === "hi", description: 'leading spaces removed', got: fn("  hi") }, { pass: fn("bye  ") === "bye", description: 'trailing spaces removed', got: fn("bye  ") }, { pass: fn("no spaces") === "no spaces", description: 'no change when no whitespace', got: fn("no spaces") } ]; }`,
    'Strings have a built-in .trim() method that removes all whitespace (spaces, tabs, newlines) from both ends.'
  ),

  ex(
    'String Contains Substring',
    ['data-structures', 'strings'],
    ['strings', 'searching', 'beginner'],
    'Return true if a string contains a given substring.',
    'Write a function called `stringContains` that accepts two strings and returns `true` if the first string contains the second string, `false` otherwise.\n\nExamples:\n  stringContains("hello world", "world") → true\n  stringContains("hello world", "xyz")   → false\n  stringContains("JavaScript", "Script") → true',
    'function stringContains(str, substr) {\n  // Your code here\n\n}',
    'function stringContains(str, substr) {\n  return str.includes(substr);\n}',
    `(code) => { const fn = new Function(code + '; return stringContains;')(); return [ { pass: fn("hello world", "world") === true, description: '"hello world" contains "world" → true', got: fn("hello world", "world") }, { pass: fn("hello world", "xyz") === false, description: '"hello world" does not contain "xyz" → false', got: fn("hello world", "xyz") }, { pass: fn("JavaScript", "Script") === true, description: '"JavaScript" contains "Script" → true', got: fn("JavaScript", "Script") }, { pass: fn("abc", "") === true, description: 'empty string is always contained → true', got: fn("abc", "") } ]; }`,
    'Just like arrays, strings have a built-in .includes() method. Pass the substring you\'re searching for as the argument.'
  ),

  ex(
    'Split String into Words',
    ['data-structures', 'strings'],
    ['strings', 'arrays', 'methods', 'beginner'],
    'Split a sentence into an array of individual words.',
    'Write a function called `splitIntoWords` that accepts a string (a sentence) and returns an array of its individual words.\n\nExamples:\n  splitIntoWords("hello world")      → ["hello", "world"]\n  splitIntoWords("one two three")    → ["one", "two", "three"]\n  splitIntoWords("JavaScript is fun") → ["JavaScript", "is", "fun"]',
    'function splitIntoWords(str) {\n  // Your code here\n\n}',
    'function splitIntoWords(str) {\n  return str.split(" ");\n}',
    `(code) => { const fn = new Function(code + '; return splitIntoWords;')(); return [ { pass: JSON.stringify(fn("hello world")) === '["hello","world"]', description: 'splitIntoWords("hello world") → ["hello","world"]', got: JSON.stringify(fn("hello world")) }, { pass: JSON.stringify(fn("one two three")) === '["one","two","three"]', description: 'three words', got: JSON.stringify(fn("one two three")) }, { pass: fn("JavaScript is fun").length === 3, description: '"JavaScript is fun" → 3 words', got: fn("JavaScript is fun").length } ]; }`,
    'Strings have a .split(separator) method that breaks a string into an array at every occurrence of the separator. Splitting on a space " " divides a sentence into words.'
  ),

  ex(
    'Join Array into String',
    ['data-structures', 'strings'],
    ['strings', 'arrays', 'methods', 'beginner'],
    'Join an array of words into a single space-separated string.',
    'Write a function called `joinWords` that accepts an array of strings and returns them joined into a single string with spaces between each word.\n\nExamples:\n  joinWords(["hello", "world"])       → "hello world"\n  joinWords(["one", "two", "three"])  → "one two three"\n  joinWords(["JavaScript"])            → "JavaScript"',
    'function joinWords(arr) {\n  // Your code here\n\n}',
    'function joinWords(arr) {\n  return arr.join(" ");\n}',
    `(code) => { const fn = new Function(code + '; return joinWords;')(); return [ { pass: fn(["hello","world"]) === "hello world", description: 'joinWords(["hello","world"]) → "hello world"', got: fn(["hello","world"]) }, { pass: fn(["one","two","three"]) === "one two three", description: 'three words joined', got: fn(["one","two","three"]) }, { pass: fn(["JavaScript"]) === "JavaScript", description: 'single word unchanged', got: fn(["JavaScript"]) } ]; }`,
    'Arrays have a .join(separator) method that combines all elements into one string, placing the separator between each pair. Here the separator is a space " ".'
  ),

  // ─── OBJECTS ─────────────────────────────────────────────────────────────────

  ex(
    'Get Object Property',
    ['data-structures', 'objects'],
    ['objects', 'properties', 'beginner'],
    'Return the value of a given property from an object.',
    'Write a function called `getProperty` that accepts an object and a property name (string) and returns the value of that property.\n\nExamples:\n  getProperty({ name: "Alice", age: 30 }, "name") → "Alice"\n  getProperty({ name: "Alice", age: 30 }, "age")  → 30\n  getProperty({ x: 10 }, "x")                     → 10',
    'function getProperty(obj, key) {\n  // Your code here\n\n}',
    'function getProperty(obj, key) {\n  return obj[key];\n}',
    `(code) => { const fn = new Function(code + '; return getProperty;')(); return [ { pass: fn({ name: "Alice", age: 30 }, "name") === "Alice", description: 'getProperty({name:"Alice"}, "name") → "Alice"', got: fn({ name: "Alice", age: 30 }, "name") }, { pass: fn({ name: "Alice", age: 30 }, "age") === 30, description: 'getProperty({age:30}, "age") → 30', got: fn({ name: "Alice", age: 30 }, "age") }, { pass: fn({ x: 10 }, "x") === 10, description: 'getProperty({x:10}, "x") → 10', got: fn({ x: 10 }, "x") } ]; }`,
    'When the property name is stored in a variable, you must use bracket notation: obj[key]. Dot notation (obj.key) only works when you type the property name literally.'
  ),

  ex(
    'Set Object Property',
    ['data-structures', 'objects'],
    ['objects', 'properties', 'mutation', 'beginner'],
    'Add or update a property on an object and return it.',
    'Write a function called `setProperty` that accepts an object, a property name, and a value. Add or update that property on the object and return the updated object.\n\nExamples:\n  setProperty({ name: "Alice" }, "age", 30) → { name: "Alice", age: 30 }\n  setProperty({ x: 1 }, "x", 99)            → { x: 99 }\n  setProperty({}, "key", "val")              → { key: "val" }',
    'function setProperty(obj, key, value) {\n  // Your code here\n\n}',
    'function setProperty(obj, key, value) {\n  obj[key] = value;\n  return obj;\n}',
    `(code) => { const fn = new Function(code + '; return setProperty;')(); const r1 = fn({ name: "Alice" }, "age", 30); const r2 = fn({ x: 1 }, "x", 99); const r3 = fn({}, "key", "val"); return [ { pass: r1.age === 30 && r1.name === "Alice", description: 'adds new property', got: JSON.stringify(r1) }, { pass: r2.x === 99, description: 'updates existing property', got: JSON.stringify(r2) }, { pass: r3.key === "val", description: 'works on empty object', got: JSON.stringify(r3) } ]; }`,
    'Bracket notation works for both reading and writing: obj[key] = value assigns the value to that property. If the property exists, it updates it; if not, it creates it. Then return the object.'
  ),

  ex(
    'Object Has Property?',
    ['data-structures', 'objects'],
    ['objects', 'properties', 'boolean', 'beginner'],
    'Return true if an object has a given property.',
    'Write a function called `hasProperty` that accepts an object and a property name, and returns `true` if the object has that property, `false` otherwise.\n\nExamples:\n  hasProperty({ name: "Alice" }, "name")  → true\n  hasProperty({ name: "Alice" }, "age")   → false\n  hasProperty({}, "anything")              → false',
    'function hasProperty(obj, key) {\n  // Your code here\n\n}',
    'function hasProperty(obj, key) {\n  return Object.hasOwn(obj, key);\n}',
    `(code) => { const fn = new Function(code + '; return hasProperty;')(); return [ { pass: fn({ name: "Alice" }, "name") === true, description: 'hasProperty({name:"Alice"}, "name") → true', got: fn({ name: "Alice" }, "name") }, { pass: fn({ name: "Alice" }, "age") === false, description: 'missing property → false', got: fn({ name: "Alice" }, "age") }, { pass: fn({}, "anything") === false, description: 'empty object → false', got: fn({}, "anything") }, { pass: fn({ a: 1, b: 2 }, "b") === true, description: 'hasProperty({a:1,b:2}, "b") → true', got: fn({ a: 1, b: 2 }, "b") } ]; }`,
    'Object.hasOwn(obj, key) returns true if the object has the given property as its own (not inherited) property. You can also use the older obj.hasOwnProperty(key) — both work.'
  ),

  ex(
    'Count Object Properties',
    ['data-structures', 'objects'],
    ['objects', 'beginner'],
    'Return the number of properties an object has.',
    'Write a function called `countProperties` that accepts an object and returns the number of its own properties.\n\nExamples:\n  countProperties({ a: 1, b: 2, c: 3 }) → 3\n  countProperties({})                     → 0\n  countProperties({ x: 10 })              → 1',
    'function countProperties(obj) {\n  // Your code here\n\n}',
    'function countProperties(obj) {\n  return Object.keys(obj).length;\n}',
    `(code) => { const fn = new Function(code + '; return countProperties;')(); return [ { pass: fn({ a: 1, b: 2, c: 3 }) === 3, description: 'countProperties({a,b,c}) → 3', got: fn({ a: 1, b: 2, c: 3 }) }, { pass: fn({}) === 0, description: 'empty object → 0', got: fn({}) }, { pass: fn({ x: 10 }) === 1, description: 'single property → 1', got: fn({ x: 10 }) } ]; }`,
    'Object.keys(obj) returns an array of all property names. Once you have an array, .length tells you how many there are.'
  ),

  // ─── FUNCTIONS ───────────────────────────────────────────────────────────────

  ex(
    'Square a Number',
    ['functions'],
    ['functions', 'math', 'beginner'],
    'Return the square of a number.',
    'Write a function called `square` that accepts a number and returns its square (the number multiplied by itself).\n\nExamples:\n  square(4)  → 16\n  square(3)  → 9\n  square(-5) → 25\n  square(0)  → 0',
    'function square(n) {\n  // Your code here\n\n}',
    'function square(n) {\n  return n * n;\n}',
    `(code) => { const fn = new Function(code + '; return square;')(); return [ { pass: fn(4) === 16, description: 'square(4) → 16', got: fn(4) }, { pass: fn(3) === 9, description: 'square(3) → 9', got: fn(3) }, { pass: fn(-5) === 25, description: 'square(-5) → 25 (negatives square positive)', got: fn(-5) }, { pass: fn(0) === 0, description: 'square(0) → 0', got: fn(0) } ]; }`,
    'Squaring means multiplying a number by itself: n * n. You can also use the exponentiation operator n ** 2.'
  ),

  ex(
    'Absolute Value',
    ['functions'],
    ['functions', 'math', 'beginner'],
    'Return the absolute value of a number.',
    'Write a function called `absoluteValue` that accepts a number and returns its absolute value (distance from zero — always non-negative).\n\nExamples:\n  absoluteValue(5)  → 5\n  absoluteValue(-5) → 5\n  absoluteValue(0)  → 0\n  absoluteValue(-3.14) → 3.14',
    'function absoluteValue(n) {\n  // Your code here\n\n}',
    'function absoluteValue(n) {\n  return Math.abs(n);\n}',
    `(code) => { const fn = new Function(code + '; return absoluteValue;')(); return [ { pass: fn(5) === 5, description: 'absoluteValue(5) → 5', got: fn(5) }, { pass: fn(-5) === 5, description: 'absoluteValue(-5) → 5', got: fn(-5) }, { pass: fn(0) === 0, description: 'absoluteValue(0) → 0', got: fn(0) }, { pass: fn(-3.14) === 3.14, description: 'absoluteValue(-3.14) → 3.14', got: fn(-3.14) } ]; }`,
    'JavaScript\'s Math object has a built-in Math.abs() method. Pass the number in and it returns the non-negative version.'
  ),

  ex(
    'Round a Number',
    ['functions'],
    ['functions', 'math', 'beginner'],
    'Round a number to the nearest integer.',
    'Write a function called `roundNumber` that accepts a number and returns it rounded to the nearest whole number.\n\nExamples:\n  roundNumber(4.6) → 5\n  roundNumber(4.4) → 4\n  roundNumber(4.5) → 5\n  roundNumber(-1.6) → -2',
    'function roundNumber(n) {\n  // Your code here\n\n}',
    'function roundNumber(n) {\n  return Math.round(n);\n}',
    `(code) => { const fn = new Function(code + '; return roundNumber;')(); return [ { pass: fn(4.6) === 5, description: 'roundNumber(4.6) → 5', got: fn(4.6) }, { pass: fn(4.4) === 4, description: 'roundNumber(4.4) → 4', got: fn(4.4) }, { pass: fn(4.5) === 5, description: 'roundNumber(4.5) → 5 (.5 rounds up)', got: fn(4.5) }, { pass: fn(-1.6) === -2, description: 'roundNumber(-1.6) → -2', got: fn(-1.6) } ]; }`,
    'Math.round() rounds to the nearest integer — .5 and above rounds up, below .5 rounds down. Related methods: Math.floor() always rounds down, Math.ceil() always rounds up.'
  ),

  ex(
    'Power',
    ['functions'],
    ['functions', 'math', 'beginner'],
    'Return a number raised to a given exponent.',
    'Write a function called `power` that accepts a base and an exponent and returns the base raised to that power.\n\nExamples:\n  power(2, 3)  → 8\n  power(5, 2)  → 25\n  power(10, 0) → 1\n  power(3, 1)  → 3',
    'function power(base, exponent) {\n  // Your code here\n\n}',
    'function power(base, exponent) {\n  return Math.pow(base, exponent);\n}',
    `(code) => { const fn = new Function(code + '; return power;')(); return [ { pass: fn(2, 3) === 8, description: 'power(2, 3) → 8', got: fn(2, 3) }, { pass: fn(5, 2) === 25, description: 'power(5, 2) → 25', got: fn(5, 2) }, { pass: fn(10, 0) === 1, description: 'power(10, 0) → 1 (anything to the power 0)', got: fn(10, 0) }, { pass: fn(3, 1) === 3, description: 'power(3, 1) → 3', got: fn(3, 1) } ]; }`,
    'Math.pow(base, exponent) computes the result. You can also use the ** operator: base ** exponent.'
  ),

  // ─── TEMPLATE LITERALS ───────────────────────────────────────────────────────

  ex(
    'Greeting with Template Literal',
    ['es6-plus', 'template-literals'],
    ['template-literals', 'strings', 'es6', 'beginner'],
    'Use a template literal to build a greeting string.',
    'Write a function called `greet` that accepts a name and returns a greeting string using a template literal.\n\nExamples:\n  greet("Alice") → "Hello, Alice!"\n  greet("World") → "Hello, World!"\n  greet("Bob")   → "Hello, Bob!"',
    'function greet(name) {\n  // Use a template literal: `Hello, ${name}!`\n\n}',
    'function greet(name) {\n  return `Hello, ${name}!`;\n}',
    `(code) => { const fn = new Function(code + '; return greet;')(); return [ { pass: fn("Alice") === "Hello, Alice!", description: 'greet("Alice") → "Hello, Alice!"', got: fn("Alice") }, { pass: fn("World") === "Hello, World!", description: 'greet("World") → "Hello, World!"', got: fn("World") }, { pass: fn("Bob") === "Hello, Bob!", description: 'greet("Bob") → "Hello, Bob!"', got: fn("Bob") } ]; }`,
    'Template literals use backticks (`) instead of quotes. You embed variables using ${variableName}. The exact syntax is shown in the comment.'
  ),

  ex(
    'Full Name from Parts',
    ['es6-plus', 'template-literals'],
    ['template-literals', 'strings', 'es6', 'beginner'],
    'Combine a first and last name into a full name using a template literal.',
    'Write a function called `fullName` that accepts a first name and a last name and returns them combined as a full name.\n\nExamples:\n  fullName("John", "Doe")   → "John Doe"\n  fullName("Ada", "Lovelace") → "Ada Lovelace"\n  fullName("", "Smith")     → " Smith"',
    'function fullName(first, last) {\n  // Use a template literal\n\n}',
    'function fullName(first, last) {\n  return `${first} ${last}`;\n}',
    `(code) => { const fn = new Function(code + '; return fullName;')(); return [ { pass: fn("John", "Doe") === "John Doe", description: 'fullName("John","Doe") → "John Doe"', got: fn("John","Doe") }, { pass: fn("Ada","Lovelace") === "Ada Lovelace", description: 'fullName("Ada","Lovelace") → "Ada Lovelace"', got: fn("Ada","Lovelace") } ]; }`,
    'Template literals let you embed multiple variables in one string. Include a space character between the two name placeholders: `${first} ${last}`.'
  ),

  ex(
    'Describe a Number',
    ['es6-plus', 'template-literals'],
    ['template-literals', 'strings', 'es6', 'beginner'],
    'Use a template literal to describe a number in a sentence.',
    'Write a function called `describeNumber` that accepts a number and returns the string "The number is X." where X is the number.\n\nExamples:\n  describeNumber(5)   → "The number is 5."\n  describeNumber(100) → "The number is 100."\n  describeNumber(-3)  → "The number is -3."',
    'function describeNumber(n) {\n  // Your code here\n\n}',
    'function describeNumber(n) {\n  return `The number is ${n}.`;\n}',
    `(code) => { const fn = new Function(code + '; return describeNumber;')(); return [ { pass: fn(5) === "The number is 5.", description: 'describeNumber(5) → "The number is 5."', got: fn(5) }, { pass: fn(100) === "The number is 100.", description: 'describeNumber(100) → "The number is 100."', got: fn(100) }, { pass: fn(-3) === "The number is -3.", description: 'describeNumber(-3) → "The number is -3."', got: fn(-3) } ]; }`,
    'When you embed a number in a template literal using ${n}, JavaScript automatically converts it to a string for you.'
  ),

  // ─── HTML ─────────────────────────────────────────────────────────────────────

  {
    id: nextId++,
    title: 'Build a Simple Form',
    type: 'html',
    tier: 1,
    category: ['html', 'forms'],
    tags: ['html', 'forms', 'inputs', 'beginner'],
    description: 'Create a basic HTML form with a text input and a submit button.',
    instructions: 'Build an HTML form that contains:\n  1. A <label> with the text "Name:"\n  2. An <input> of type "text"\n  3. A <button> of type "submit" with the text "Submit"\n\nAll three elements should be inside a <form> element.',
    starterCode: '<!-- Build your form here -->\n<form>\n  <!-- Add a label, text input, and submit button -->\n\n</form>',
    solution: '<form>\n  <label>Name:</label>\n  <input type="text">\n  <button type="submit">Submit</button>\n</form>',
    testRunner: '',
    testCases: [
      { assertion: 'exists', selector: 'form', description: 'A <form> element exists' },
      { assertion: 'exists', selector: 'form label', description: 'A <label> is inside the form' },
      { assertion: 'textContains', selector: 'form label', value: 'Name', description: 'Label contains "Name"' },
      { assertion: 'exists', selector: 'form input[type="text"]', description: 'A text <input> is inside the form' },
      { assertion: 'exists', selector: 'form button[type="submit"]', description: 'A submit <button> is inside the form' },
      { assertion: 'textContains', selector: 'form button', value: 'Submit', description: 'Button says "Submit"' },
    ],
    hint: 'A form is a container. Put your label, input, and button inside the <form> tags. The input needs a type="text" attribute; the button needs type="submit".',
    resources: [],
  },

  {
    id: nextId++,
    title: 'Unordered List',
    type: 'html',
    tier: 1,
    category: ['html', 'structure'],
    tags: ['html', 'lists', 'beginner'],
    description: 'Create an unordered list with three items.',
    instructions: 'Build an HTML unordered list containing exactly three list items:\n  1. "Red"\n  2. "Green"\n  3. "Blue"\n\nUse the correct semantic elements.',
    starterCode: '<!-- Create an unordered list with three items: Red, Green, Blue -->\n',
    solution: '<ul>\n  <li>Red</li>\n  <li>Green</li>\n  <li>Blue</li>\n</ul>',
    testRunner: '',
    testCases: [
      { assertion: 'exists', selector: 'ul', description: 'A <ul> element exists' },
      { assertion: 'countAtLeast', selector: 'ul li', value: 3, description: 'At least 3 <li> items inside the <ul>' },
      { assertion: 'sourceContains', value: 'Red', description: 'Page contains "Red"' },
      { assertion: 'sourceContains', value: 'Green', description: 'Page contains "Green"' },
      { assertion: 'sourceContains', value: 'Blue', description: 'Page contains "Blue"' },
    ],
    hint: '<ul> creates an unordered (bulleted) list. Each item inside uses <li> (list item) tags. The text goes between the opening and closing <li> tags.',
    resources: [],
  },

  // ─── CSS ─────────────────────────────────────────────────────────────────────

  {
    id: nextId++,
    title: 'Color and Font Size',
    type: 'css',
    tier: 1,
    category: ['css', 'selectors'],
    tags: ['css', 'selectors', 'color', 'beginner'],
    description: 'Style a paragraph to have red text at 20px.',
    instructions: 'Write CSS that targets the `<p>` element and sets:\n  1. The text color to red\n  2. The font size to 20px',
    starterCode: '/* Style the p element */\np {\n  /* Your code here */\n\n}',
    solution: 'p {\n  color: red;\n  font-size: 20px;\n}',
    testRunner: '',
    providedHtml: '<p id="test-p">Sample paragraph text</p>',
    testCases: [
      { assertion: 'equals', selector: '#test-p', property: 'color', value: 'rgb(255, 0, 0)', description: 'Text color is red' },
      { assertion: 'equals', selector: '#test-p', property: 'font-size', value: '20px', description: 'Font size is 20px' },
    ],
    hint: 'CSS properties for text: "color" sets the text color, "font-size" sets the size. Values: color accepts names like "red", font-size needs a unit like "20px".',
    resources: [],
  },

  {
    id: nextId++,
    title: 'Background and Padding',
    type: 'css',
    tier: 1,
    category: ['css', 'box-model'],
    tags: ['css', 'box-model', 'padding', 'background', 'beginner'],
    description: 'Give a div a blue background and 16px of padding.',
    instructions: 'Write CSS that targets the `<div>` element and sets:\n  1. The background color to blue\n  2. The padding to 16px on all sides',
    starterCode: '/* Style the div element */\ndiv {\n  /* Your code here */\n\n}',
    solution: 'div {\n  background-color: blue;\n  padding: 16px;\n}',
    testRunner: '',
    providedHtml: '<div id="test-div">Content</div>',
    testCases: [
      { assertion: 'equals', selector: '#test-div', property: 'background-color', value: 'rgb(0, 0, 255)', description: 'Background color is blue' },
      { assertion: 'equals', selector: '#test-div', property: 'padding-top', value: '16px', description: 'Padding is 16px' },
    ],
    hint: '"background-color" sets the background fill color. "padding" adds space inside the element between its content and its border. "padding: 16px" applies 16px to all four sides at once.',
    resources: [],
  },

];

data.exercises.push(...exercises);

// Update Default Curriculum collection to include new exercises
const defaultCurriculum = data.collections.find(c => c.id === 'default-curriculum');

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');

const tier1Count = data.exercises.filter(e => e.tier === 1).length;
console.log(`✓ Added ${exercises.length} new Tier I exercises (IDs 66–${nextId - 1})`);
console.log(`✓ Total Tier I exercises: ${tier1Count}`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
