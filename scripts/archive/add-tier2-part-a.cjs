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

const exercises = [

  // ── ARITHMETIC ──────────────────────────────────────────────────────────────

  js('Is Divisible By?',
    ['js-fundamentals','operators','arithmetic'],
    ['modulo','arithmetic','boolean'],
    'Return true if a number is evenly divisible by a divisor.',
    `Write a function called \`isDivisibleBy\` that accepts two numbers and returns \`true\` if the first is evenly divisible by the second, \`false\` otherwise.

Examples:
  isDivisibleBy(10, 2) → true
  isDivisibleBy(10, 3) → false
  isDivisibleBy(9, 3)  → true
  isDivisibleBy(0, 5)  → true`,
    `function isDivisibleBy(num, divisor) {\n\n}`,
    `function isDivisibleBy(num, divisor) {\n  return num % divisor === 0;\n}`,
    `(code) => { const fn = new Function(code + '; return isDivisibleBy;')(); return [ { pass: fn(10,2)===true, description: 'isDivisibleBy(10,2) → true', got: fn(10,2) }, { pass: fn(10,3)===false, description: 'isDivisibleBy(10,3) → false', got: fn(10,3) }, { pass: fn(9,3)===true, description: 'isDivisibleBy(9,3) → true', got: fn(9,3) }, { pass: fn(0,5)===true, description: 'isDivisibleBy(0,5) → true', got: fn(0,5) } ]; }`,
    'The modulo operator (%) returns the remainder of division. If the remainder is 0, the number divides evenly.'
  ),

  js('Hypotenuse',
    ['js-fundamentals','operators','arithmetic'],
    ['math','arithmetic'],
    'Calculate the hypotenuse of a right triangle given its two legs.',
    `Write a function called \`hypotenuse\` that accepts the lengths of two legs of a right triangle and returns the hypotenuse length.

Formula: c = √(a² + b²)

Examples:
  hypotenuse(3, 4)  → 5
  hypotenuse(5, 12) → 13
  hypotenuse(1, 1)  → ~1.414`,
    `function hypotenuse(a, b) {\n\n}`,
    `function hypotenuse(a, b) {\n  return Math.sqrt(a * a + b * b);\n}`,
    `(code) => { const fn = new Function(code + '; return hypotenuse;')(); return [ { pass: fn(3,4)===5, description: 'hypotenuse(3,4) → 5', got: fn(3,4) }, { pass: fn(5,12)===13, description: 'hypotenuse(5,12) → 13', got: fn(5,12) }, { pass: Math.abs(fn(1,1)-Math.sqrt(2))<0.001, description: 'hypotenuse(1,1) ≈ 1.414', got: fn(1,1) } ]; }`,
    'Math.sqrt() computes the square root. Square each leg (a * a), add them together, then pass that sum to Math.sqrt().'
  ),

  js('Clamp a Number',
    ['js-fundamentals','operators','arithmetic'],
    ['math','conditionals'],
    'Constrain a value to stay within a min/max range.',
    `Write a function called \`clamp\` that accepts a number, a min, and a max. If the number is below min return min; if above max return max; otherwise return the number unchanged.

Examples:
  clamp(5, 1, 10)  → 5   (in range)
  clamp(-3, 1, 10) → 1   (below min)
  clamp(15, 1, 10) → 10  (above max)
  clamp(1, 1, 10)  → 1   (at boundary)`,
    `function clamp(num, min, max) {\n\n}`,
    `function clamp(num, min, max) {\n  if (num < min) return min;\n  if (num > max) return max;\n  return num;\n}`,
    `(code) => { const fn = new Function(code + '; return clamp;')(); return [ { pass: fn(5,1,10)===5, description: 'in range → 5', got: fn(5,1,10) }, { pass: fn(-3,1,10)===1, description: 'below min → 1', got: fn(-3,1,10) }, { pass: fn(15,1,10)===10, description: 'above max → 10', got: fn(15,1,10) }, { pass: fn(1,1,10)===1, description: 'at boundary → 1', got: fn(1,1,10) } ]; }`,
    'Three cases: below min → return min, above max → return max, otherwise → return num. Two early-return if statements plus a final return covers it.'
  ),

  js('Discount Price',
    ['js-fundamentals','operators','arithmetic'],
    ['math','arithmetic'],
    'Calculate the price after applying a percentage discount.',
    `Write a function called \`discountPrice\` that accepts an original price and a discount percentage (0–100) and returns the final price.

Examples:
  discountPrice(100, 20) → 80    (20% off $100)
  discountPrice(50, 10)  → 45    (10% off $50)
  discountPrice(200, 0)  → 200   (no discount)
  discountPrice(80, 100) → 0     (100% off)`,
    `function discountPrice(price, discountPercent) {\n\n}`,
    `function discountPrice(price, discountPercent) {\n  return price * (1 - discountPercent / 100);\n}`,
    `(code) => { const fn = new Function(code + '; return discountPrice;')(); return [ { pass: fn(100,20)===80, description: 'discountPrice(100,20) → 80', got: fn(100,20) }, { pass: fn(50,10)===45, description: 'discountPrice(50,10) → 45', got: fn(50,10) }, { pass: fn(200,0)===200, description: 'no discount → 200', got: fn(200,0) }, { pass: fn(80,100)===0, description: '100% off → 0', got: fn(80,100) } ]; }`,
    'A 20% discount means you pay 80%. Convert the percent to a decimal (divide by 100), subtract from 1, multiply by price: price * (1 - discountPercent / 100).'
  ),

  // ── COMPARISON / LOGIC ──────────────────────────────────────────────────────

  js('Is Odd?',
    ['js-fundamentals','operators','modulo'],
    ['modulo','boolean'],
    'Return true if a number is odd.',
    `Write a function called \`isOdd\` that accepts a number and returns \`true\` if it is odd, \`false\` if even.

Examples:
  isOdd(3)  → true
  isOdd(4)  → false
  isOdd(-7) → true
  isOdd(0)  → false`,
    `function isOdd(num) {\n\n}`,
    `function isOdd(num) {\n  return num % 2 !== 0;\n}`,
    `(code) => { const fn = new Function(code + '; return isOdd;')(); return [ { pass: fn(3)===true, description: 'isOdd(3) → true', got: fn(3) }, { pass: fn(4)===false, description: 'isOdd(4) → false', got: fn(4) }, { pass: fn(-7)===true, description: 'isOdd(-7) → true', got: fn(-7) }, { pass: fn(0)===false, description: 'isOdd(0) → false', got: fn(0) } ]; }`,
    'A number is odd if it has a remainder when divided by 2. Use % 2 and check it is NOT equal to 0.'
  ),

  js('Both Truthy?',
    ['js-fundamentals','operators','comparison'],
    ['boolean','logic'],
    'Return true only if both values are truthy.',
    `Write a function called \`bothTruthy\` that accepts two values and returns \`true\` only if both are truthy.

Examples:
  bothTruthy(1, "hello") → true
  bothTruthy(1, 0)       → false
  bothTruthy(0, 0)       → false
  bothTruthy(null, 1)    → false`,
    `function bothTruthy(a, b) {\n\n}`,
    `function bothTruthy(a, b) {\n  return !!a && !!b;\n}`,
    `(code) => { const fn = new Function(code + '; return bothTruthy;')(); return [ { pass: fn(1,"hello")===true, description: 'bothTruthy(1,"hello") → true', got: fn(1,"hello") }, { pass: fn(1,0)===false, description: 'bothTruthy(1,0) → false', got: fn(1,0) }, { pass: fn(0,0)===false, description: 'bothTruthy(0,0) → false', got: fn(0,0) }, { pass: fn(null,1)===false, description: 'bothTruthy(null,1) → false', got: fn(null,1) } ]; }`,
    'The && operator returns true only when both sides are truthy. !!value converts any value to a boolean.'
  ),

  js('Either Truthy?',
    ['js-fundamentals','operators','comparison'],
    ['boolean','logic'],
    'Return true if at least one value is truthy.',
    `Write a function called \`eitherTruthy\` that accepts two values and returns \`true\` if at least one is truthy.

Examples:
  eitherTruthy(0, 1)            → true
  eitherTruthy(0, 0)            → false
  eitherTruthy("", "hi")        → true
  eitherTruthy(null, undefined) → false`,
    `function eitherTruthy(a, b) {\n\n}`,
    `function eitherTruthy(a, b) {\n  return !!a || !!b;\n}`,
    `(code) => { const fn = new Function(code + '; return eitherTruthy;')(); return [ { pass: fn(0,1)===true, description: 'eitherTruthy(0,1) → true', got: fn(0,1) }, { pass: fn(0,0)===false, description: 'eitherTruthy(0,0) → false', got: fn(0,0) }, { pass: fn("","hi")===true, description: 'eitherTruthy("","hi") → true', got: fn("","hi") }, { pass: fn(null,undefined)===false, description: 'both falsy → false', got: fn(null,undefined) } ]; }`,
    'The || (OR) operator returns true when at least one side is truthy. It only returns false when both sides are falsy.'
  ),

  // ── CONDITIONALS ────────────────────────────────────────────────────────────

  js('BMI Category',
    ['js-fundamentals','conditionals'],
    ['conditionals','math'],
    'Return a BMI category label given a numeric BMI.',
    `Write a function called \`bmiCategory\` that accepts a BMI value and returns:
  - Below 18.5  → "Underweight"
  - 18.5–24.9   → "Normal"
  - 25–29.9     → "Overweight"
  - 30 or above → "Obese"

Examples:
  bmiCategory(17)   → "Underweight"
  bmiCategory(22)   → "Normal"
  bmiCategory(27)   → "Overweight"
  bmiCategory(35)   → "Obese"
  bmiCategory(18.5) → "Normal"  (boundary)`,
    `function bmiCategory(bmi) {\n\n}`,
    `function bmiCategory(bmi) {\n  if (bmi < 18.5) return "Underweight";\n  if (bmi < 25)   return "Normal";\n  if (bmi < 30)   return "Overweight";\n  return "Obese";\n}`,
    `(code) => { const fn = new Function(code + '; return bmiCategory;')(); return [ { pass: fn(17)==="Underweight", description: 'bmiCategory(17) → "Underweight"', got: fn(17) }, { pass: fn(22)==="Normal", description: 'bmiCategory(22) → "Normal"', got: fn(22) }, { pass: fn(27)==="Overweight", description: 'bmiCategory(27) → "Overweight"', got: fn(27) }, { pass: fn(35)==="Obese", description: 'bmiCategory(35) → "Obese"', got: fn(35) }, { pass: fn(18.5)==="Normal", description: '18.5 → "Normal" (boundary)', got: fn(18.5) } ]; }`,
    'A chain of early-return if statements works cleanly here — once you return from a branch, you never reach the ones below it, so you only need to check the upper boundary of each range.'
  ),

  js('Traffic Light',
    ['js-fundamentals','conditionals'],
    ['conditionals','strings'],
    'Return the next traffic light color in the cycle.',
    `Write a function called \`nextLight\` that accepts the current traffic light color and returns the next one: red → green → yellow → red.

Examples:
  nextLight("red")    → "green"
  nextLight("green")  → "yellow"
  nextLight("yellow") → "red"`,
    `function nextLight(color) {\n\n}`,
    `function nextLight(color) {\n  if (color === "red")   return "green";\n  if (color === "green") return "yellow";\n  return "red";\n}`,
    `(code) => { const fn = new Function(code + '; return nextLight;')(); return [ { pass: fn("red")==="green", description: 'nextLight("red") → "green"', got: fn("red") }, { pass: fn("green")==="yellow", description: 'nextLight("green") → "yellow"', got: fn("green") }, { pass: fn("yellow")==="red", description: 'nextLight("yellow") → "red"', got: fn("yellow") } ]; }`,
    'Three states, three return values. if/else if/else, a switch, or three early-return ifs all work.'
  ),

  js('Get Day Name',
    ['js-fundamentals','conditionals'],
    ['conditionals','arrays','strings'],
    'Return the name of the day given a number 1–7.',
    `Write a function called \`getDayName\` that accepts a number 1–7 (1 = Monday) and returns the day name. Return "Invalid" for anything outside 1–7.

Examples:
  getDayName(1) → "Monday"
  getDayName(5) → "Friday"
  getDayName(7) → "Sunday"
  getDayName(0) → "Invalid"`,
    `function getDayName(num) {\n\n}`,
    `function getDayName(num) {\n  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];\n  if (num < 1 || num > 7) return "Invalid";\n  return days[num - 1];\n}`,
    `(code) => { const fn = new Function(code + '; return getDayName;')(); return [ { pass: fn(1)==="Monday", description: 'getDayName(1) → "Monday"', got: fn(1) }, { pass: fn(5)==="Friday", description: 'getDayName(5) → "Friday"', got: fn(5) }, { pass: fn(7)==="Sunday", description: 'getDayName(7) → "Sunday"', got: fn(7) }, { pass: fn(0)==="Invalid", description: 'getDayName(0) → "Invalid"', got: fn(0) }, { pass: fn(8)==="Invalid", description: 'getDayName(8) → "Invalid"', got: fn(8) } ]; }`,
    'An array of day names (indices 0–6) is cleaner than 7 separate if statements. Input is 1-based, arrays are 0-based — access days[num - 1]. Validate the range first.'
  ),

  // ── LOOPS ───────────────────────────────────────────────────────────────────

  js('Sum of Squares',
    ['js-fundamentals','loops'],
    ['loops','math','accumulator'],
    'Return the sum of the squares of all integers from 1 to n.',
    `Write a function called \`sumOfSquares\` that accepts a positive integer n and returns the sum of 1² + 2² + ... + n².

Examples:
  sumOfSquares(3) → 14   (1 + 4 + 9)
  sumOfSquares(4) → 30   (1 + 4 + 9 + 16)
  sumOfSquares(1) → 1`,
    `function sumOfSquares(n) {\n\n}`,
    `function sumOfSquares(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i * i;\n  }\n  return sum;\n}`,
    `(code) => { const fn = new Function(code + '; return sumOfSquares;')(); return [ { pass: fn(3)===14, description: 'sumOfSquares(3) → 14', got: fn(3) }, { pass: fn(4)===30, description: 'sumOfSquares(4) → 30', got: fn(4) }, { pass: fn(1)===1, description: 'sumOfSquares(1) → 1', got: fn(1) }, { pass: fn(5)===55, description: 'sumOfSquares(5) → 55', got: fn(5) } ]; }`,
    'Classic accumulator loop — on each iteration add i * i to the running total.'
  ),

  js('Count Occurrences in Array',
    ['js-fundamentals','loops'],
    ['loops','arrays','counting'],
    'Count how many times a target value appears in an array.',
    `Write a function called \`countOccurrences\` that accepts an array and a target value and returns how many times the target appears.

Examples:
  countOccurrences([1,2,3,2,2], 2)         → 3
  countOccurrences(["a","b","a","c"], "a")  → 2
  countOccurrences([1,2,3], 5)              → 0`,
    `function countOccurrences(arr, target) {\n\n}`,
    `function countOccurrences(arr, target) {\n  let count = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) count++;\n  }\n  return count;\n}`,
    `(code) => { const fn = new Function(code + '; return countOccurrences;')(); return [ { pass: fn([1,2,3,2,2],2)===3, description: 'countOccurrences([1,2,3,2,2],2) → 3', got: fn([1,2,3,2,2],2) }, { pass: fn(["a","b","a","c"],"a")===2, description: 'works with strings', got: fn(["a","b","a","c"],"a") }, { pass: fn([1,2,3],5)===0, description: 'not found → 0', got: fn([1,2,3],5) }, { pass: fn([],1)===0, description: 'empty array → 0', got: fn([],1) } ]; }`,
    'Loop through the array and increment a counter every time an element strictly equals the target (use ===).'
  ),

  js('Reverse an Array (no .reverse())',
    ['js-fundamentals','loops'],
    ['loops','arrays','no-built-ins'],
    'Return a reversed copy of an array without using Array.reverse().',
    `Write a function called \`reverseArray\` that accepts an array and returns a NEW array with the elements in reverse order. Do not use the built-in .reverse().

Examples:
  reverseArray([1, 2, 3])     → [3, 2, 1]
  reverseArray(["a","b","c"]) → ["c","b","a"]
  reverseArray([1])            → [1]

The original array must not be modified.`,
    `function reverseArray(arr) {\n\n}`,
    `function reverseArray(arr) {\n  const result = [];\n  for (let i = arr.length - 1; i >= 0; i--) {\n    result.push(arr[i]);\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return reverseArray;')(); const orig = [1,2,3]; const r = fn(orig); return [ { pass: JSON.stringify(r)==='[3,2,1]', description: 'reverseArray([1,2,3]) → [3,2,1]', got: JSON.stringify(r) }, { pass: JSON.stringify(orig)==='[1,2,3]', description: 'original array NOT mutated', got: JSON.stringify(orig) }, { pass: JSON.stringify(fn(["a","b","c"]))==='["c","b","a"]', description: 'works with strings', got: JSON.stringify(fn(["a","b","c"])) } ]; }`,
    'Iterate from the last index down to 0, pushing each element into a new result array. Return the result — do not touch the original.'
  ),

  js('Is Palindrome?',
    ['js-fundamentals','loops'],
    ['loops','strings'],
    'Return true if a string reads the same forwards and backwards.',
    `Write a function called \`isPalindrome\` that accepts a string and returns \`true\` if it is a palindrome, ignoring case.

Examples:
  isPalindrome("racecar") → true
  isPalindrome("Racecar") → true   (case-insensitive)
  isPalindrome("hello")   → false
  isPalindrome("a")       → true`,
    `function isPalindrome(str) {\n\n}`,
    `function isPalindrome(str) {\n  const s = str.toLowerCase();\n  for (let i = 0; i < Math.floor(s.length / 2); i++) {\n    if (s[i] !== s[s.length - 1 - i]) return false;\n  }\n  return true;\n}`,
    `(code) => { const fn = new Function(code + '; return isPalindrome;')(); return [ { pass: fn("racecar")===true, description: '"racecar" → true', got: fn("racecar") }, { pass: fn("Racecar")===true, description: '"Racecar" → true (case-insensitive)', got: fn("Racecar") }, { pass: fn("hello")===false, description: '"hello" → false', got: fn("hello") }, { pass: fn("a")===true, description: 'single char → true', got: fn("a") }, { pass: fn("madam")===true, description: '"madam" → true', got: fn("madam") } ]; }`,
    'Compare characters from the outside in: index 0 vs last, index 1 vs second-to-last. Only go halfway. Lowercase first.'
  ),

  js('Largest in Array (no Math.max)',
    ['js-fundamentals','loops'],
    ['loops','arrays','comparison'],
    'Return the largest number in an array without using Math.max().',
    `Write a function called \`largestInArray\` that accepts an array of numbers and returns the largest value. Do not use Math.max().

Examples:
  largestInArray([3, 1, 4, 1, 5, 9]) → 9
  largestInArray([-1, -5, -2])        → -1
  largestInArray([42])                 → 42`,
    `function largestInArray(arr) {\n\n}`,
    `function largestInArray(arr) {\n  let largest = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > largest) largest = arr[i];\n  }\n  return largest;\n}`,
    `(code) => { const fn = new Function(code + '; return largestInArray;')(); return [ { pass: fn([3,1,4,1,5,9])===9, description: 'largestInArray([3,1,4,1,5,9]) → 9', got: fn([3,1,4,1,5,9]) }, { pass: fn([-1,-5,-2])===-1, description: 'all negatives → -1', got: fn([-1,-5,-2]) }, { pass: fn([42])===42, description: 'single element → 42', got: fn([42]) } ]; }`,
    'Start by assuming the first element is the largest. Loop from index 1 onward and update your champion whenever you find something bigger.'
  ),

  // ── SYNTAX TRANSLATION: LOOP ↔ ITERATOR ─────────────────────────────────────

  js('Rewrite: for loop → forEach',
    ['syntax-translation','es5-to-es6'],
    ['forEach','loops','syntax-translation'],
    'Rewrite a for loop that builds an array using .forEach().',
    `The following for loop doubles each number in an array:
\`\`\`js
const result = [];
for (let i = 0; i < arr.length; i++) {
  result.push(arr[i] * 2);
}
\`\`\`

Write a function called \`doubleWithForEach\` that produces the same result using \`.forEach()\` instead.

Examples:
  doubleWithForEach([1, 2, 3]) → [2, 4, 6]
  doubleWithForEach([5, 10])   → [10, 20]`,
    `function doubleWithForEach(arr) {\n  const result = [];\n  // Replace the for loop with .forEach()\n\n  return result;\n}`,
    `function doubleWithForEach(arr) {\n  const result = [];\n  arr.forEach(num => result.push(num * 2));\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return doubleWithForEach;')(); return [ { pass: JSON.stringify(fn([1,2,3]))==='[2,4,6]', description: 'doubleWithForEach([1,2,3]) → [2,4,6]', got: JSON.stringify(fn([1,2,3])) }, { pass: JSON.stringify(fn([5,10]))==='[10,20]', description: 'doubleWithForEach([5,10]) → [10,20]', got: JSON.stringify(fn([5,10])) }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    '.forEach(callback) calls your callback once per element. You still push manually — forEach itself returns nothing.'
  ),

  js('Rewrite: for loop → .map()',
    ['syntax-translation','es5-to-es6'],
    ['map','loops','syntax-translation'],
    'Rewrite a for loop that transforms values using .map().',
    `This for loop squares each number:
\`\`\`js
const result = [];
for (let i = 0; i < arr.length; i++) {
  result.push(arr[i] * arr[i]);
}
\`\`\`

Write a function called \`squareWithMap\` that produces the same result using \`.map()\`.

Examples:
  squareWithMap([1, 2, 3, 4]) → [1, 4, 9, 16]
  squareWithMap([5, 10])       → [25, 100]`,
    `function squareWithMap(arr) {\n\n}`,
    `function squareWithMap(arr) {\n  return arr.map(n => n * n);\n}`,
    `(code) => { const fn = new Function(code + '; return squareWithMap;')(); return [ { pass: JSON.stringify(fn([1,2,3,4]))==='[1,4,9,16]', description: 'squareWithMap([1,2,3,4]) → [1,4,9,16]', got: JSON.stringify(fn([1,2,3,4])) }, { pass: JSON.stringify(fn([5,10]))==='[25,100]', description: 'squareWithMap([5,10]) → [25,100]', got: JSON.stringify(fn([5,10])) }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    '.map(callback) creates a new array from the return values of your callback. No result array or .push() needed — map handles that for you.'
  ),

  js('Rewrite: for loop → .filter()',
    ['syntax-translation','es5-to-es6'],
    ['filter','loops','syntax-translation'],
    'Rewrite a for loop that conditionally keeps values using .filter().',
    `This for loop keeps only positive numbers:
\`\`\`js
const result = [];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] > 0) result.push(arr[i]);
}
\`\`\`

Write a function called \`positiveWithFilter\` that produces the same result using \`.filter()\`.

Examples:
  positiveWithFilter([1, -2, 3, -4, 5]) → [1, 3, 5]
  positiveWithFilter([-1, -2, -3])        → []`,
    `function positiveWithFilter(arr) {\n\n}`,
    `function positiveWithFilter(arr) {\n  return arr.filter(n => n > 0);\n}`,
    `(code) => { const fn = new Function(code + '; return positiveWithFilter;')(); return [ { pass: JSON.stringify(fn([1,-2,3,-4,5]))==='[1,3,5]', description: 'keeps only positives', got: JSON.stringify(fn([1,-2,3,-4,5])) }, { pass: JSON.stringify(fn([-1,-2,-3]))==='[]', description: 'none positive → []', got: JSON.stringify(fn([-1,-2,-3])) }, { pass: JSON.stringify(fn([1,2,3]))==='[1,2,3]', description: 'all positive → unchanged', got: JSON.stringify(fn([1,2,3])) } ]; }`,
    '.filter(callback) keeps elements where the callback returns true. Return your condition directly — no push needed.'
  ),

  js('Rewrite: .map() → for loop',
    ['syntax-translation','es6-to-es5'],
    ['map','loops','syntax-translation'],
    'Rewrite a .map() call as an explicit for loop.',
    `This .map() call adds a prefix to each name:
\`\`\`js
const result = arr.map(s => "Mr. " + s);
\`\`\`

Write a function called \`addPrefixWithLoop\` that produces the same result using a for loop instead of .map().

Examples:
  addPrefixWithLoop(["Smith","Jones"]) → ["Mr. Smith","Mr. Jones"]
  addPrefixWithLoop(["T"])              → ["Mr. T"]`,
    `function addPrefixWithLoop(arr) {\n  const result = [];\n  // Use a for loop — no .map()\n\n  return result;\n}`,
    `function addPrefixWithLoop(arr) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    result.push("Mr. " + arr[i]);\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return addPrefixWithLoop;')(); return [ { pass: JSON.stringify(fn(["Smith","Jones"]))==='["Mr. Smith","Mr. Jones"]', description: 'prefix added to each', got: JSON.stringify(fn(["Smith","Jones"])) }, { pass: JSON.stringify(fn(["T"]))==='["Mr. T"]', description: 'single element', got: JSON.stringify(fn(["T"])) }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    'A for loop with a result array and .push() is the manual equivalent of .map(). Loop through, transform each element, push the transformed value.'
  ),

  js('Rewrite: .filter() → for loop',
    ['syntax-translation','es6-to-es5'],
    ['filter','loops','syntax-translation'],
    'Rewrite a .filter() call as an explicit for loop.',
    `This .filter() call keeps only even numbers:
\`\`\`js
const result = arr.filter(n => n % 2 === 0);
\`\`\`

Write a function called \`evensWithLoop\` that produces the same result using a for loop instead of .filter().

Examples:
  evensWithLoop([1, 2, 3, 4, 5, 6]) → [2, 4, 6]
  evensWithLoop([1, 3, 5])            → []`,
    `function evensWithLoop(arr) {\n  const result = [];\n  // Use a for loop — no .filter()\n\n  return result;\n}`,
    `function evensWithLoop(arr) {\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] % 2 === 0) result.push(arr[i]);\n  }\n  return result;\n}`,
    `(code) => { const fn = new Function(code + '; return evensWithLoop;')(); return [ { pass: JSON.stringify(fn([1,2,3,4,5,6]))==='[2,4,6]', description: 'evensWithLoop([1..6]) → [2,4,6]', got: JSON.stringify(fn([1,2,3,4,5,6])) }, { pass: JSON.stringify(fn([1,3,5]))==='[]', description: 'no evens → []', got: JSON.stringify(fn([1,3,5])) } ]; }`,
    'A filter loop adds a conditional inside: only push if the element passes the test. This is the manual version of what .filter() does automatically.'
  ),

  js('Rewrite: .reduce() → for loop',
    ['syntax-translation','es6-to-es5'],
    ['reduce','loops','syntax-translation'],
    'Rewrite a .reduce() call as an explicit for loop.',
    `This .reduce() call sums an array:
\`\`\`js
const total = arr.reduce((acc, n) => acc + n, 0);
\`\`\`

Write a function called \`sumWithLoop\` that produces the same result using a for loop instead of .reduce().

Examples:
  sumWithLoop([1, 2, 3, 4, 5]) → 15
  sumWithLoop([10, 20])         → 30
  sumWithLoop([])               → 0`,
    `function sumWithLoop(arr) {\n  let total = 0;\n  // Use a for loop — no .reduce()\n\n  return total;\n}`,
    `function sumWithLoop(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}`,
    `(code) => { const fn = new Function(code + '; return sumWithLoop;')(); return [ { pass: fn([1,2,3,4,5])===15, description: 'sumWithLoop([1..5]) → 15', got: fn([1,2,3,4,5]) }, { pass: fn([10,20])===30, description: 'sumWithLoop([10,20]) → 30', got: fn([10,20]) }, { pass: fn([])===0, description: 'empty → 0', got: fn([]) } ]; }`,
    'The accumulator in .reduce() is just a variable in a for loop. Initialize total before the loop and add each element to it inside the loop.'
  ),

  // ── ARRAYS — .map() ──────────────────────────────────────────────────────────

  js('Double All Numbers',
    ['data-structures','arrays','map'],
    ['map','arrays'],
    'Return a new array with every number doubled using .map().',
    `Write a function called \`doubleAll\` that accepts an array of numbers and returns a new array with each value doubled.

Examples:
  doubleAll([1, 2, 3])    → [2, 4, 6]
  doubleAll([10, -5, 0])  → [20, -10, 0]`,
    `function doubleAll(arr) {\n\n}`,
    `function doubleAll(arr) {\n  return arr.map(n => n * 2);\n}`,
    `(code) => { const fn = new Function(code + '; return doubleAll;')(); return [ { pass: JSON.stringify(fn([1,2,3]))==='[2,4,6]', description: 'doubleAll([1,2,3]) → [2,4,6]', got: JSON.stringify(fn([1,2,3])) }, { pass: JSON.stringify(fn([10,-5,0]))==='[20,-10,0]', description: 'handles negatives and zero', got: JSON.stringify(fn([10,-5,0])) }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    '.map(n => n * 2) transforms each element. The callback receives one element and returns what it should become in the new array.'
  ),

  js('Extract Property from Objects',
    ['data-structures','arrays','map'],
    ['map','arrays','objects'],
    'Pull a single property out of each object in an array.',
    `Write a function called \`extractNames\` that accepts an array of person objects (each with a \`name\` property) and returns an array of just the name strings.

Examples:
  extractNames([{name:"Alice",age:30},{name:"Bob",age:25}]) → ["Alice","Bob"]
  extractNames([{name:"Eve"}]) → ["Eve"]`,
    `function extractNames(people) {\n\n}`,
    `function extractNames(people) {\n  return people.map(person => person.name);\n}`,
    `(code) => { const fn = new Function(code + '; return extractNames;')(); return [ { pass: JSON.stringify(fn([{name:"Alice",age:30},{name:"Bob",age:25}]))==='["Alice","Bob"]', description: 'extracts names', got: JSON.stringify(fn([{name:"Alice",age:30},{name:"Bob",age:25}])) }, { pass: JSON.stringify(fn([{name:"Eve"}]))==='["Eve"]', description: 'single object', got: JSON.stringify(fn([{name:"Eve"}])) }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    'In the .map() callback each element is one object. Return the property you want using dot notation: person.name.'
  ),

  js('Uppercase All Strings',
    ['data-structures','arrays','map'],
    ['map','arrays','strings'],
    'Return a new array with every string converted to uppercase.',
    `Write a function called \`uppercaseAll\` that accepts an array of strings and returns a new array with each string uppercased.

Examples:
  uppercaseAll(["hello", "world"]) → ["HELLO", "WORLD"]
  uppercaseAll(["a", "B", "c"])    → ["A", "B", "C"]`,
    `function uppercaseAll(arr) {\n\n}`,
    `function uppercaseAll(arr) {\n  return arr.map(s => s.toUpperCase());\n}`,
    `(code) => { const fn = new Function(code + '; return uppercaseAll;')(); return [ { pass: JSON.stringify(fn(["hello","world"]))==='["HELLO","WORLD"]', description: 'uppercaseAll(["hello","world"]) → ["HELLO","WORLD"]', got: JSON.stringify(fn(["hello","world"])) }, { pass: JSON.stringify(fn(["a","B","c"]))==='["A","B","C"]', description: 'mixed case → all upper', got: JSON.stringify(fn(["a","B","c"])) } ]; }`,
    'The callback receives each string — call .toUpperCase() on it and return the result.'
  ),

  js('Add Index to Each Element',
    ['data-structures','arrays','map'],
    ['map','arrays','index'],
    'Return an array of [index, value] pairs using .map().',
    `Write a function called \`withIndex\` that accepts an array and returns a new array where each element is replaced with a two-element array \`[index, element]\`.

Examples:
  withIndex(["a","b","c"]) → [[0,"a"],[1,"b"],[2,"c"]]
  withIndex([10, 20])       → [[0,10],[1,20]]`,
    `function withIndex(arr) {\n\n}`,
    `function withIndex(arr) {\n  return arr.map((el, i) => [i, el]);\n}`,
    `(code) => { const fn = new Function(code + '; return withIndex;')(); return [ { pass: JSON.stringify(fn(["a","b","c"]))==='[[0,"a"],[1,"b"],[2,"c"]]', description: 'withIndex(["a","b","c"]) → [[0,"a"],[1,"b"],[2,"c"]]', got: JSON.stringify(fn(["a","b","c"])) }, { pass: JSON.stringify(fn([10,20]))==='[[0,10],[1,20]]', description: 'withIndex([10,20]) → [[0,10],[1,20]]', got: JSON.stringify(fn([10,20])) } ]; }`,
    ".map()'s callback receives two arguments: the element and its index. Use (el, i) as the parameters to access both."
  ),

  // ── ARRAYS — .filter() ───────────────────────────────────────────────────────

  js('Remove Falsy Values (compact)',
    ['data-structures','arrays','filter'],
    ['filter','arrays','truthy'],
    'Remove all falsy values from an array.',
    `Write a function called \`compact\` that accepts an array and returns a new array with all falsy values removed. Falsy values: false, 0, "", null, undefined, NaN.

Examples:
  compact([0, 1, false, 2, "", 3]) → [1, 2, 3]
  compact([null, "a", undefined])  → ["a"]
  compact([1, 2, 3])               → [1, 2, 3]`,
    `function compact(arr) {\n\n}`,
    `function compact(arr) {\n  return arr.filter(Boolean);\n}`,
    `(code) => { const fn = new Function(code + '; return compact;')(); return [ { pass: JSON.stringify(fn([0,1,false,2,"",3]))==='[1,2,3]', description: 'compact([0,1,false,2,"",3]) → [1,2,3]', got: JSON.stringify(fn([0,1,false,2,"",3])) }, { pass: JSON.stringify(fn([null,"a",undefined]))==='["a"]', description: 'removes null and undefined', got: JSON.stringify(fn([null,"a",undefined])) }, { pass: JSON.stringify(fn([1,2,3]))==='[1,2,3]', description: 'all truthy → unchanged', got: JSON.stringify(fn([1,2,3])) } ]; }`,
    'Boolean is a function that converts any value to true or false. Passing it directly to .filter() keeps only truthy values: arr.filter(Boolean).'
  ),

  js('Filter Strings by Minimum Length',
    ['data-structures','arrays','filter'],
    ['filter','arrays','strings'],
    'Keep only strings that are at least a minimum length.',
    `Write a function called \`filterByLength\` that accepts an array of strings and a minimum length, and returns only the strings with length >= minLength.

Examples:
  filterByLength(["hi","hello","hey","howdy"], 4) → ["hello","howdy"]
  filterByLength(["a","bb","ccc"], 2)              → ["bb","ccc"]`,
    `function filterByLength(arr, minLength) {\n\n}`,
    `function filterByLength(arr, minLength) {\n  return arr.filter(s => s.length >= minLength);\n}`,
    `(code) => { const fn = new Function(code + '; return filterByLength;')(); return [ { pass: JSON.stringify(fn(["hi","hello","hey","howdy"],4))==='["hello","howdy"]', description: 'min 4 → ["hello","howdy"]', got: JSON.stringify(fn(["hi","hello","hey","howdy"],4)) }, { pass: JSON.stringify(fn(["a","bb","ccc"],2))==='["bb","ccc"]', description: 'min 2 → ["bb","ccc"]', got: JSON.stringify(fn(["a","bb","ccc"],2)) }, { pass: JSON.stringify(fn([],3))==='[]', description: 'empty → []', got: JSON.stringify(fn([],3)) } ]; }`,
    'The filter callback receives each string. Check s.length >= minLength. The minLength parameter is available inside via closure.'
  ),

  js('Filter Active Objects',
    ['data-structures','arrays','filter'],
    ['filter','arrays','objects'],
    'Keep only objects where the active property is true.',
    `Write a function called \`filterActive\` that accepts an array of objects (each with an \`active\` boolean) and returns only the active ones.

Examples:
  filterActive([{name:"Alice",active:true},{name:"Bob",active:false},{name:"Eve",active:true}])
  → [{name:"Alice",active:true},{name:"Eve",active:true}]`,
    `function filterActive(arr) {\n\n}`,
    `function filterActive(arr) {\n  return arr.filter(item => item.active);\n}`,
    `(code) => { const fn = new Function(code + '; return filterActive;')(); const data = [{name:"Alice",active:true},{name:"Bob",active:false},{name:"Eve",active:true}]; const r = fn(data); return [ { pass: r.length===2, description: 'returns 2 active items', got: r.length }, { pass: r[0].name==="Alice"&&r[1].name==="Eve", description: 'Alice and Eve are active', got: r.map(x=>x.name).join(",") }, { pass: JSON.stringify(fn([]))==='[]', description: 'empty → []', got: JSON.stringify(fn([])) } ]; }`,
    'The callback receives each object — return item.active directly (it is already a boolean).'
  ),

  js('Get Unique Values',
    ['data-structures','arrays','filter'],
    ['filter','arrays','deduplication'],
    'Remove duplicate values from an array using .filter().',
    `Write a function called \`unique\` that accepts an array and returns a new array with duplicates removed, preserving the first occurrence of each value.

Examples:
  unique([1, 2, 2, 3, 3, 3]) → [1, 2, 3]
  unique(["a","b","a","c"])   → ["a","b","c"]
  unique([1, 2, 3])            → [1, 2, 3]`,
    `function unique(arr) {\n\n}`,
    `function unique(arr) {\n  return arr.filter((val, i) => arr.indexOf(val) === i);\n}`,
    `(code) => { const fn = new Function(code + '; return unique;')(); return [ { pass: JSON.stringify(fn([1,2,2,3,3,3]))==='[1,2,3]', description: 'unique([1,2,2,3,3,3]) → [1,2,3]', got: JSON.stringify(fn([1,2,2,3,3,3])) }, { pass: JSON.stringify(fn(["a","b","a","c"]))==='["a","b","c"]', description: 'removes string duplicates', got: JSON.stringify(fn(["a","b","a","c"])) }, { pass: JSON.stringify(fn([1,2,3]))==='[1,2,3]', description: 'no duplicates → unchanged', got: JSON.stringify(fn([1,2,3])) } ]; }`,
    'Keep an element only if its index matches the FIRST time it appears. The filter callback receives (value, index) — compare current index against arr.indexOf(val).'
  ),

  // ── ARRAYS — .reduce() ───────────────────────────────────────────────────────

  js('Sum an Array',
    ['data-structures','arrays','reduce'],
    ['reduce','arrays','accumulator'],
    'Sum all numbers in an array using .reduce().',
    `Write a function called \`sumArray\` that accepts an array of numbers and returns their sum using \`.reduce()\`.

Examples:
  sumArray([1, 2, 3, 4, 5]) → 15
  sumArray([10, -3, 7])      → 14
  sumArray([])               → 0`,
    `function sumArray(arr) {\n\n}`,
    `function sumArray(arr) {\n  return arr.reduce((acc, n) => acc + n, 0);\n}`,
    `(code) => { const fn = new Function(code + '; return sumArray;')(); return [ { pass: fn([1,2,3,4,5])===15, description: 'sumArray([1..5]) → 15', got: fn([1,2,3,4,5]) }, { pass: fn([10,-3,7])===14, description: 'sumArray([10,-3,7]) → 14', got: fn([10,-3,7]) }, { pass: fn([])===0, description: 'empty → 0', got: fn([]) } ]; }`,
    '.reduce(callback, initialValue) — the callback receives (accumulator, currentValue). Start at 0 and add each element.'
  ),

  js('Product of Array',
    ['data-structures','arrays','reduce'],
    ['reduce','arrays','math'],
    'Return the product of all numbers in an array.',
    `Write a function called \`productArray\` that accepts an array of numbers and returns their product (all multiplied together).

Examples:
  productArray([1, 2, 3, 4]) → 24
  productArray([5, 5])        → 25
  productArray([2, 0, 100])   → 0`,
    `function productArray(arr) {\n\n}`,
    `function productArray(arr) {\n  return arr.reduce((acc, n) => acc * n, 1);\n}`,
    `(code) => { const fn = new Function(code + '; return productArray;')(); return [ { pass: fn([1,2,3,4])===24, description: 'productArray([1,2,3,4]) → 24', got: fn([1,2,3,4]) }, { pass: fn([5,5])===25, description: 'productArray([5,5]) → 25', got: fn([5,5]) }, { pass: fn([2,0,100])===0, description: 'any zero → 0', got: fn([2,0,100]) } ]; }`,
    'Like summing, but multiply instead of add. The initial value must be 1 (not 0) — multiplying by 0 would zero everything out.'
  ),

  js('Frequency Counter',
    ['data-structures','arrays','reduce'],
    ['reduce','objects','frequency-counter'],
    'Build a frequency map of values in an array using .reduce().',
    `Write a function called \`frequencyCounter\` that accepts an array and returns an object where each key is a unique value from the array and its value is the count of occurrences.

Examples:
  frequencyCounter(["a","b","a","c","b","a"]) → { a: 3, b: 2, c: 1 }
  frequencyCounter([1, 1, 2, 3])              → { 1: 2, 2: 1, 3: 1 }`,
    `function frequencyCounter(arr) {\n\n}`,
    `function frequencyCounter(arr) {\n  return arr.reduce((acc, val) => {\n    acc[val] = (acc[val] || 0) + 1;\n    return acc;\n  }, {});\n}`,
    `(code) => { const fn = new Function(code + '; return frequencyCounter;')(); const r1 = fn(["a","b","a","c","b","a"]); const r2 = fn([1,1,2,3]); return [ { pass: r1.a===3&&r1.b===2&&r1.c===1, description: 'a:3, b:2, c:1', got: JSON.stringify(r1) }, { pass: r2[1]===2&&r2[2]===1&&r2[3]===1, description: '1:2, 2:1, 3:1', got: JSON.stringify(r2) }, { pass: JSON.stringify(fn([]))==='{}', description: 'empty → {}', got: JSON.stringify(fn([])) } ]; }`,
    'Accumulator starts as {}. For each value, increment acc[val] — use (acc[val] || 0) + 1 so missing keys start at 0. Always return acc.'
  ),

  js('Group By Property',
    ['data-structures','arrays','reduce'],
    ['reduce','objects','grouping'],
    'Group an array of objects by a given property using .reduce().',
    `Write a function called \`groupBy\` that accepts an array of objects and a property name, and returns an object grouping items by that property's value.

Examples:
  groupBy([
    {name:"Alice",dept:"Eng"},
    {name:"Bob",dept:"HR"},
    {name:"Eve",dept:"Eng"}
  ], "dept")
  → { Eng: [{name:"Alice",...},{name:"Eve",...}], HR: [{name:"Bob",...}] }`,
    `function groupBy(arr, key) {\n\n}`,
    `function groupBy(arr, key) {\n  return arr.reduce((acc, item) => {\n    const group = item[key];\n    if (!acc[group]) acc[group] = [];\n    acc[group].push(item);\n    return acc;\n  }, {});\n}`,
    `(code) => { const fn = new Function(code + '; return groupBy;')(); const data = [{name:"Alice",dept:"Eng"},{name:"Bob",dept:"HR"},{name:"Eve",dept:"Eng"}]; const r = fn(data,"dept"); return [ { pass: r.Eng&&r.Eng.length===2, description: 'Eng group has 2 items', got: r.Eng&&r.Eng.length }, { pass: r.HR&&r.HR.length===1, description: 'HR group has 1 item', got: r.HR&&r.HR.length }, { pass: r.Eng[0].name==="Alice"&&r.Eng[1].name==="Eve", description: 'Eng contains Alice and Eve', got: r.Eng.map(x=>x.name).join(",") } ]; }`,
    'Accumulator starts as {}. For each item get the group key value, create that array if it doesn\'t exist, then push the item. Always return acc.'
  ),

  // ── ARRAYS — find / every / some ─────────────────────────────────────────────

  js('Find First Even',
    ['data-structures','arrays','basics'],
    ['find','arrays'],
    'Return the first even number in an array using .find().',
    `Write a function called \`firstEven\` that accepts an array of numbers and returns the first even number. Return \`undefined\` if none exists.

Examples:
  firstEven([1, 3, 4, 6]) → 4
  firstEven([1, 3, 5])    → undefined
  firstEven([2, 4, 6])    → 2`,
    `function firstEven(arr) {\n\n}`,
    `function firstEven(arr) {\n  return arr.find(n => n % 2 === 0);\n}`,
    `(code) => { const fn = new Function(code + '; return firstEven;')(); return [ { pass: fn([1,3,4,6])===4, description: 'firstEven([1,3,4,6]) → 4', got: fn([1,3,4,6]) }, { pass: fn([1,3,5])===undefined, description: 'no evens → undefined', got: fn([1,3,5]) }, { pass: fn([2,4,6])===2, description: 'returns FIRST match', got: fn([2,4,6]) } ]; }`,
    '.find() returns the first element for which the callback is true. Returns undefined automatically if nothing matches.'
  ),

  js('Find Object by ID',
    ['data-structures','arrays','basics'],
    ['find','arrays','objects'],
    'Find and return an object from an array by its id property.',
    `Write a function called \`findById\` that accepts an array of objects (each with an \`id\` property) and a target id, and returns the matching object (or undefined).

Examples:
  findById([{id:1,name:"Alice"},{id:2,name:"Bob"}], 2) → {id:2,name:"Bob"}
  findById([{id:1,name:"Alice"}], 99)                   → undefined`,
    `function findById(arr, id) {\n\n}`,
    `function findById(arr, id) {\n  return arr.find(item => item.id === id);\n}`,
    `(code) => { const fn = new Function(code + '; return findById;')(); const data = [{id:1,name:"Alice"},{id:2,name:"Bob"},{id:3,name:"Eve"}]; return [ { pass: fn(data,2)&&fn(data,2).name==="Bob", description: 'findById(data,2) → Bob', got: fn(data,2)&&fn(data,2).name }, { pass: fn(data,99)===undefined, description: 'no match → undefined', got: fn(data,99) }, { pass: fn(data,1)&&fn(data,1).name==="Alice", description: 'findById(data,1) → Alice', got: fn(data,1)&&fn(data,1).name } ]; }`,
    '.find() works perfectly here — the callback receives each item, return true when item.id matches the target.'
  ),

  js('Are All Positive?',
    ['data-structures','arrays','basics'],
    ['every','arrays'],
    'Return true only if every number in an array is positive.',
    `Write a function called \`allPositive\` that accepts an array of numbers and returns \`true\` only if every value is greater than zero.

Examples:
  allPositive([1, 2, 3])  → true
  allPositive([1, -1, 3]) → false
  allPositive([0, 1, 2])  → false  (0 is not positive)
  allPositive([])          → true   (vacuously true)`,
    `function allPositive(arr) {\n\n}`,
    `function allPositive(arr) {\n  return arr.every(n => n > 0);\n}`,
    `(code) => { const fn = new Function(code + '; return allPositive;')(); return [ { pass: fn([1,2,3])===true, description: 'allPositive([1,2,3]) → true', got: fn([1,2,3]) }, { pass: fn([1,-1,3])===false, description: 'contains negative → false', got: fn([1,-1,3]) }, { pass: fn([0,1,2])===false, description: '0 is not positive → false', got: fn([0,1,2]) }, { pass: fn([])===true, description: 'empty → true', got: fn([]) } ]; }`,
    '.every() returns true only if the callback returns true for every element. One false short-circuits the whole thing.'
  ),

  js('Does Any Value Exceed Threshold?',
    ['data-structures','arrays','basics'],
    ['some','arrays'],
    'Return true if any number in an array exceeds a threshold.',
    `Write a function called \`anyExceeds\` that accepts an array of numbers and a threshold, and returns \`true\` if at least one number is strictly greater than the threshold.

Examples:
  anyExceeds([1, 5, 3], 4)  → true   (5 > 4)
  anyExceeds([1, 2, 3], 10) → false
  anyExceeds([10], 10)       → false  (equal is not exceeding)`,
    `function anyExceeds(arr, threshold) {\n\n}`,
    `function anyExceeds(arr, threshold) {\n  return arr.some(n => n > threshold);\n}`,
    `(code) => { const fn = new Function(code + '; return anyExceeds;')(); return [ { pass: fn([1,5,3],4)===true, description: 'anyExceeds([1,5,3],4) → true', got: fn([1,5,3],4) }, { pass: fn([1,2,3],10)===false, description: 'none exceed 10 → false', got: fn([1,2,3],10) }, { pass: fn([10],10)===false, description: 'equal is not exceeding → false', got: fn([10],10) } ]; }`,
    '.some() returns true the moment one element passes. It stops checking as soon as it finds a match.'
  ),

];

data.exercises.push(...exercises);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✓ Part A: added ${exercises.length} exercises (IDs ${exercises[0].id}–${exercises[exercises.length-1].id})`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
