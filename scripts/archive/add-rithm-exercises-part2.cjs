#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// IDs 49–63
const part2Ids = Array.from({ length: 15 }, (_, i) => i + 51);

data.collections.push({
  id: 'rithm-interview-prep-part2',
  name: 'Rithm Interview Prep — Part 2',
  description: 'Slightly more challenging Rithm School interview problems covering objects, arrays, matrices, and simulation',
  exerciseIds: part2Ids,
  color: '#a78bfa',
});

function ex(id, title, tier, category, tags, description, instructions, starterCode, solution, testRunner, hint) {
  return { id, title, type: 'js', tier, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources: [] };
}

const part2Exercises = [

  ex(51, 'calculateMonthlyOrders', 2,
    ['data-structures', 'objects'],
    ['objects', 'arrays', 'loops', 'accumulator', 'intermediate'],
    'Sum all numeric values across an array of month-keyed objects.',
    `Write a function called \`calculateMonthlyOrders\` that accepts an array of objects. Each object has one or more month-name properties, each with a numeric value. Return the sum of all values across all objects.

Examples:
  calculateMonthlyOrders([
    { February: 1, March: 2, April: 2 },
    { April: 1, May: 2, June: 2 }
  ]) // 10

  calculateMonthlyOrders([
    { January: 100, February: 200, ..., December: 1200 },
    { January: 200, February: 300, ..., December: 1300 }
  ]) // 16800`,
    `function calculateMonthlyOrders(orders) {
  // Your code here

}`,
    `function calculateMonthlyOrders(orders) {
  let total = 0;
  for (let i = 0; i < orders.length; i++) {
    for (let month in orders[i]) {
      total += orders[i][month];
    }
  }
  return total;
}`,
    `(code) => {
  const fn = new Function(code + '; return calculateMonthlyOrders;')();
  const orders1 = [{ February: 1, March: 2, April: 2 }, { April: 1, May: 2, June: 2 }];
  const orders2 = [
    { January: 100, February: 200, March: 300, April: 400, May: 500, June: 600, July: 700, August: 800, September: 900, October: 1000, November: 1100, December: 1200 },
    { January: 200, February: 300, March: 400, April: 500, May: 600, June: 700, July: 800, August: 900, September: 1000, October: 1100, November: 1200, December: 1300 }
  ];
  return [
    { pass: fn(orders1) === 10, description: 'small orders sum → 10', got: fn(orders1) },
    { pass: fn(orders2) === 16800, description: 'full year two objects → 16800', got: fn(orders2) },
    { pass: fn([{ Jan: 5 }]) === 5, description: 'single object single month → 5', got: fn([{ Jan: 5 }]) },
    { pass: fn([]) === 0, description: 'empty array → 0', got: fn([]) },
  ];
}`,
    'You need two nested loops: one to iterate over each order object, and one to iterate over each property in that object. Add every value to a running total.'
  ),

  ex(52, 'collectOddsAndEvens', 1,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'objects', 'loops', 'modulo', 'beginner'],
    'Count the odd and even numbers in an array and return an object.',
    `Write a function called \`collectOddsAndEvens\` that accepts an array of positive integers and returns an object with keys "odd" and "even" containing the respective counts.

Examples:
  collectOddsAndEvens([1, 2, 3, 4, 5, 6, 7, 8, 9])
  // { odd: 5, even: 4 }

  collectOddsAndEvens([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  // { odd: 5, even: 5 }`,
    `function collectOddsAndEvens(arr) {
  // Your code here

}`,
    `function collectOddsAndEvens(arr) {
  const result = { odd: 0, even: 0 };
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) result.even++;
    else result.odd++;
  }
  return result;
}`,
    `(code) => {
  const fn = new Function(code + '; return collectOddsAndEvens;')();
  const r1 = fn([1,2,3,4,5,6,7,8,9]);
  const r2 = fn([1,2,3,4,5,6,7,8,9,10]);
  const r3 = fn([2,4,6]);
  return [
    { pass: r1.odd === 5 && r1.even === 4, description: '[1..9] → { odd:5, even:4 }', got: JSON.stringify(r1) },
    { pass: r2.odd === 5 && r2.even === 5, description: '[1..10] → { odd:5, even:5 }', got: JSON.stringify(r2) },
    { pass: r3.odd === 0 && r3.even === 3, description: 'all evens → { odd:0, even:3 }', got: JSON.stringify(r3) },
    { pass: fn([]).odd === 0 && fn([]).even === 0, description: 'empty → { odd:0, even:0 }', got: JSON.stringify(fn([])) },
  ];
}`,
    'Start with an object that has odd and even both set to 0. Loop through the array and use the modulo operator (%) to decide which counter to increment.'
  ),

  ex(53, 'countIfHasValue', 3,
    ['data-structures', 'objects'],
    ['objects', 'arrays', 'loops', 'searching', 'intermediate'],
    'Count how many arrays in an object contain a given value.',
    `Write a function called \`countIfHasValue\` which accepts an object where all values are arrays, and a numeric value to search for. Return the number of arrays that contain that value.

Examples:
  let obj = { a: [1,10,3], b: [4,1,7], c: [7,7,7], d: [10,7,12] };
  countIfHasValue(obj, 1)  // 2
  countIfHasValue(obj, 7)  // 3
  countIfHasValue(obj, 10) // 1 (note: 10 appears in a and d, but 'd' has 10 too)
  countIfHasValue(obj, 13) // 0`,
    `function countIfHasValue(obj, value) {
  // Your code here

}`,
    `function countIfHasValue(obj, value) {
  let count = 0;
  for (let key in obj) {
    if (obj[key].includes(value)) count++;
  }
  return count;
}`,
    `(code) => {
  const fn = new Function(code + '; return countIfHasValue;')();
  const obj = { a: [1,10,3], b: [4,1,7], c: [7,7,7], d: [10,7,12] };
  return [
    { pass: fn(obj, 1) === 2, description: 'value 1 appears in 2 arrays', got: fn(obj, 1) },
    { pass: fn(obj, 7) === 3, description: 'value 7 appears in 3 arrays', got: fn(obj, 7) },
    { pass: fn(obj, 10) === 2, description: 'value 10 appears in 2 arrays', got: fn(obj, 10) },
    { pass: fn(obj, 13) === 0, description: 'value 13 not found → 0', got: fn(obj, 13) },
  ];
}`,
    'Loop over the keys of the object. For each key, check whether that array includes the target value. If it does, increment your counter.'
  ),

  ex(54, 'countValidNumsInString', 3,
    ['data-structures', 'strings'],
    ['strings', 'loops', 'type-conversion', 'intermediate'],
    'Count how many individual digit characters appear in a string.',
    `Write a function called \`countValidNumsInString\` which counts the number of valid numeric digit characters in a string.

Examples:
  countValidNumsInString("")           // 0
  countValidNumsInString("1")          // 1
  countValidNumsInString("12")         // 2
  countValidNumsInString("12abc3")     // 3
  countValidNumsInString("1s2d3dsadas4") // 4
  countValidNumsInString("512,3,4!?!") // 5
  countValidNumsInString("123456")     // 6`,
    `function countValidNumsInString(str) {
  // Your code here

}`,
    `function countValidNumsInString(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') count++;
  }
  return count;
}`,
    `(code) => {
  const fn = new Function(code + '; return countValidNumsInString;')();
  return [
    { pass: fn("") === 0, description: 'empty string → 0', got: fn("") },
    { pass: fn("1") === 1, description: '"1" → 1', got: fn("1") },
    { pass: fn("12") === 2, description: '"12" → 2', got: fn("12") },
    { pass: fn("12abc3") === 3, description: '"12abc3" → 3', got: fn("12abc3") },
    { pass: fn("512,3,4!?!") === 5, description: '"512,3,4!?!" → 5', got: fn("512,3,4!?!") },
    { pass: fn("123456") === 6, description: '"123456" → 6', got: fn("123456") },
  ];
}`,
    'Each character in a string can be compared to "0" and "9" using >= and <= — JavaScript compares characters by their character code, so this works just like comparing numbers. Count each character that falls in that range.'
  ),

  ex(55, 'divideObject', 3,
    ['data-structures', 'objects'],
    ['objects', 'arrays', 'type-checking', 'intermediate'],
    'Separate an object\'s numeric and string values into two sub-totals.',
    `Write a function called \`divideObject\` that accepts an object with string or number values. Return an array of two sub-arrays: the first contains the sum of all numbers, the second contains the total character count of all strings.

Examples:
  divideObject({
    first: "hi",    // 2 chars
    second: "hello", // 5 chars
    third: "hey",   // 3 chars
    fourth: 2,
    fifth: "fun",   // 3 chars
    sixth: 10,
  })
  // [ [12], [13] ]`,
    `function divideObject(obj) {
  // Return [ [sumOfNumbers], [totalStringLength] ]

}`,
    `function divideObject(obj) {
  let numSum = 0;
  let strLen = 0;
  for (let key in obj) {
    if (typeof obj[key] === 'number') numSum += obj[key];
    else strLen += obj[key].length;
  }
  return [[numSum], [strLen]];
}`,
    `(code) => {
  const fn = new Function(code + '; return divideObject;')();
  const r1 = fn({ first: "hi", second: "hello", third: "hey", fourth: 2, fifth: "fun", sixth: 10 });
  const r2 = fn({ a: 5, b: 10 });
  const r3 = fn({ x: "abc", y: "de" });
  return [
    { pass: JSON.stringify(r1) === '[[12],[13]]', description: 'mixed object → [[12],[13]]', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '[[15],[0]]', description: 'all numbers → [[15],[0]]', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[[0],[5]]', description: 'all strings → [[0],[5]]', got: JSON.stringify(r3) },
  ];
}`,
    'Use typeof to distinguish between number and string values. Accumulate two separate totals — a numeric sum and a string-length sum — then return them each wrapped in their own array.'
  ),

  ex(56, 'findFirstAndLastIndex', 3,
    ['data-structures', 'arrays', 'basics'],
    ['arrays', 'loops', 'searching', 'intermediate'],
    'Return the first and last index of a value, or -1 if it appears fewer than twice.',
    `Write a function called \`findFirstAndLastIndex\` that accepts an array and a number. Return \`[firstIndex, lastIndex]\` for that number. If the number doesn't appear at least twice, return \`-1\`.

Examples:
  findFirstAndLastIndex([1, 2, 3, 4, 5], 3)  // -1 (only once)
  findFirstAndLastIndex([1, 2, 2, 2, 5], 12) // -1 (not found)
  findFirstAndLastIndex([1, 2, 2, 2, 5], 2)  // [1, 3]`,
    `function findFirstAndLastIndex(arr, num) {
  // Your code here

}`,
    `function findFirstAndLastIndex(arr, num) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === num) {
      if (first === -1) first = i;
      last = i;
    }
  }
  if (first === last) return -1;
  return [first, last];
}`,
    `(code) => {
  const fn = new Function(code + '; return findFirstAndLastIndex;')();
  return [
    { pass: fn([1,2,3,4,5], 3) === -1, description: 'appears once → -1', got: fn([1,2,3,4,5], 3) },
    { pass: fn([1,2,2,2,5], 12) === -1, description: 'not found → -1', got: fn([1,2,2,2,5], 12) },
    { pass: JSON.stringify(fn([1,2,2,2,5], 2)) === '[1,3]', description: '[1,2,2,2,5] value 2 → [1,3]', got: JSON.stringify(fn([1,2,2,2,5], 2)) },
    { pass: JSON.stringify(fn([5,5], 5)) === '[0,1]', description: 'two-element match → [0,1]', got: JSON.stringify(fn([5,5], 5)) },
  ];
}`,
    'Track two things simultaneously: the first index where you see the value (set it once and never update it again) and the last index (update it every time you see the value). At the end, if they\'re the same, it only appeared once.'
  ),

  ex(57, 'findFirstMove', 3,
    ['data-structures', 'arrays'],
    ['arrays', 'nested-arrays', 'loops', 'searching', 'intermediate'],
    'Find the [row, col] of a move\'s first occurrence in an array of arrays.',
    `Write a function called \`findFirstMove\` that accepts an array of arrays (moves) and a single move string. Return \`[rowIndex, colIndex]\` of its first occurrence, or \`-1\` if not found.

Examples:
  let moves = [["a","b","c"], ["d","a","f"], ["g","h","h"]];
  findFirstMove(moves, "a") // [0, 0]
  findFirstMove(moves, "h") // [2, 1]
  findFirstMove(moves, "z") // -1`,
    `function findFirstMove(moves, move) {
  // Your code here

}`,
    `function findFirstMove(moves, move) {
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j] === move) return [i, j];
    }
  }
  return -1;
}`,
    `(code) => {
  const fn = new Function(code + '; return findFirstMove;')();
  const moves = [["a","b","c"],["d","a","f"],["g","h","h"]];
  return [
    { pass: JSON.stringify(fn(moves, "a")) === '[0,0]', description: '"a" first at [0,0]', got: JSON.stringify(fn(moves, "a")) },
    { pass: JSON.stringify(fn(moves, "h")) === '[2,1]', description: '"h" first at [2,1]', got: JSON.stringify(fn(moves, "h")) },
    { pass: fn(moves, "z") === -1, description: '"z" not found → -1', got: fn(moves, "z") },
    { pass: JSON.stringify(fn(moves, "d")) === '[1,0]', description: '"d" at [1,0]', got: JSON.stringify(fn(moves, "d")) },
  ];
}`,
    'This requires a nested loop — an outer loop for each row, an inner loop for each element in that row. As soon as you find a match, return the current [row, col] indices immediately.'
  ),

  ex(58, 'findHighestPriorityTodo', 3,
    ['data-structures', 'arrays'],
    ['arrays', 'objects', 'loops', 'comparison', 'intermediate'],
    'Find the todo with the highest priority value.',
    `Write a function called \`findHighestPriorityTodo\` which accepts an array of todo objects, each with a \`task\` and \`priority\` property. Return \`[taskName, priorityValue]\` for the highest-priority item.

Examples:
  findHighestPriorityTodo([
    { task: "Eat", priority: 18 },
    { task: "Sleep", priority: 22 },
    { task: "Solve problems", priority: 17 }
  ]) // ["Sleep", 22]

  findHighestPriorityTodo([
    { task: "Task 1", priority: 1 },
    { task: "Task 2", priority: 2 },
    { task: "Task 3", priority: 3 }
  ]) // ["Task 3", 3]`,
    `function findHighestPriorityTodo(todos) {
  // Your code here

}`,
    `function findHighestPriorityTodo(todos) {
  let best = todos[0];
  for (let i = 1; i < todos.length; i++) {
    if (todos[i].priority > best.priority) best = todos[i];
  }
  return [best.task, best.priority];
}`,
    `(code) => {
  const fn = new Function(code + '; return findHighestPriorityTodo;')();
  const t1 = [{ task:"Eat",priority:18},{ task:"Sleep",priority:22},{ task:"Solve problems",priority:17}];
  const t2 = [{ task:"Task 1",priority:1},{ task:"Task 2",priority:2},{ task:"Task 3",priority:3}];
  const t3 = [{ task:"Only",priority:5}];
  return [
    { pass: JSON.stringify(fn(t1)) === '["Sleep",22]', description: 'highest priority is Sleep at 22', got: JSON.stringify(fn(t1)) },
    { pass: JSON.stringify(fn(t2)) === '["Task 3",3]', description: 'highest priority is Task 3 at 3', got: JSON.stringify(fn(t2)) },
    { pass: JSON.stringify(fn(t3)) === '["Only",5]', description: 'single todo → itself', got: JSON.stringify(fn(t3)) },
  ];
}`,
    'Keep track of the "best so far" object, starting with the first element. Loop through the rest and whenever you find one with a higher priority, it becomes the new best. At the end, return the task name and priority of the winner.'
  ),

  ex(59, 'inMatrix', 2,
    ['data-structures', 'arrays'],
    ['arrays', 'nested-arrays', 'loops', 'searching', 'intermediate'],
    'Return true if a value exists anywhere in a 2D matrix.',
    `Write a function called \`inMatrix\` which accepts an array of arrays (a matrix) and a value. Return \`true\` if the value is anywhere in the matrix, \`false\` otherwise.

Examples:
  let matrix = [[1,2,3],[4,5,6],[7,8,9]];
  inMatrix(matrix, 5)  // true
  inMatrix(matrix, 8)  // true
  inMatrix(matrix, 10) // false`,
    `function inMatrix(matrix, value) {
  // Your code here

}`,
    `function inMatrix(matrix, value) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === value) return true;
    }
  }
  return false;
}`,
    `(code) => {
  const fn = new Function(code + '; return inMatrix;')();
  const m = [[1,2,3],[4,5,6],[7,8,9]];
  return [
    { pass: fn(m, 5) === true, description: '5 is in the matrix', got: fn(m, 5) },
    { pass: fn(m, 8) === true, description: '8 is in the matrix', got: fn(m, 8) },
    { pass: fn(m, 10) === false, description: '10 is not in the matrix', got: fn(m, 10) },
    { pass: fn([[1]], 1) === true, description: '1x1 matrix match', got: fn([[1]],1) },
    { pass: fn([[1]], 2) === false, description: '1x1 matrix no match', got: fn([[1]],2) },
  ];
}`,
    'A matrix is just an array of arrays. You need two nested loops to visit every cell. The moment you find a match, return true. If both loops complete without a match, return false.'
  ),

  ex(60, 'replaceAfter', 3,
    ['data-structures', 'arrays'],
    ['arrays', 'splice', 'mutation', 'intermediate'],
    'Replace two elements at a given index with "Hello" and "world".',
    `Write a function called \`replaceAfter\` that accepts an array and an index. Remove two elements starting at that index and insert the strings "Hello" and "world" in their place. Return the modified array.

Examples:
  replaceAfter(["1","2","a","b","3","4"], 2)
  // ["1","2","Hello","world","3","4"]

  replaceAfter(["a","b","c"], 0)
  // ["Hello","world","c"]`,
    `function replaceAfter(arr, idx) {
  // Your code here

}`,
    `function replaceAfter(arr, idx) {
  arr.splice(idx, 2, "Hello", "world");
  return arr;
}`,
    `(code) => {
  const fn = new Function(code + '; return replaceAfter;')();
  return [
    { pass: JSON.stringify(fn(["1","2","a","b","3","4"], 2)) === '["1","2","Hello","world","3","4"]', description: 'replaceAfter at index 2', got: JSON.stringify(fn(["1","2","a","b","3","4"], 2)) },
    { pass: JSON.stringify(fn(["a","b","c"], 0)) === '["Hello","world","c"]', description: 'replaceAfter at index 0', got: JSON.stringify(fn(["a","b","c"], 0)) },
    { pass: JSON.stringify(fn(["x","y"], 0)) === '["Hello","world"]', description: 'replaceAfter entire two-element array', got: JSON.stringify(fn(["x","y"], 0)) },
  ];
}`,
    'Array.splice(start, deleteCount, ...items) removes elements and inserts new ones in a single operation. Here you always remove 2 and insert exactly two specific strings.'
  ),

  ex(61, 'reverseValues', 4,
    ['data-structures', 'arrays'],
    ['arrays', 'loops', 'filtering', 'advanced'],
    'Collect non-skipped values in reverse, skipping 3 items whenever an even is encountered.',
    `Write a function called \`reverseValues\` that accepts an array of numbers. Iterate through it — whenever you encounter an even number, skip it and the next two numbers. Collect everything else into a new array, returned in reverse order of the original.

Examples:
  reverseValues([1, 1, 3, 3, 2])        // [3, 3, 1, 1]
  reverseValues([1, 3, 5, 7])            // [7, 5, 3, 1]
  reverseValues([1, 3, 4, 7])            // [3, 1]
  reverseValues([11, 13, 15, 20, 1, 1]) // [15, 13, 11]
  reverseValues([4, 5, 1, 1, 2, 1, 1]) // [1]
  reverseValues([2, 2, 2])               // []`,
    `function reverseValues(arr) {
  // Your code here

}`,
    `function reverseValues(arr) {
  const kept = [];
  let i = 0;
  while (i < arr.length) {
    if (arr[i] % 2 === 0) {
      i += 3; // skip even + next 2
    } else {
      kept.push(arr[i]);
      i++;
    }
  }
  return kept.reverse();
}`,
    `(code) => {
  const fn = new Function(code + '; return reverseValues;')();
  return [
    { pass: JSON.stringify(fn([1,1,3,3,2])) === '[3,3,1,1]', description: '[1,1,3,3,2] → [3,3,1,1]', got: JSON.stringify(fn([1,1,3,3,2])) },
    { pass: JSON.stringify(fn([1,3,5,7])) === '[7,5,3,1]', description: 'all odd → reversed', got: JSON.stringify(fn([1,3,5,7])) },
    { pass: JSON.stringify(fn([1,3,4,7])) === '[3,1]', description: '[1,3,4,7] → 4 skips itself and 7', got: JSON.stringify(fn([1,3,4,7])) },
    { pass: JSON.stringify(fn([11,13,15,20,1,1])) === '[15,13,11]', description: '20 skips 20,1,1 → [15,13,11]', got: JSON.stringify(fn([11,13,15,20,1,1])) },
    { pass: JSON.stringify(fn([4,5,1,1,2,1,1])) === '[1]', description: 'complex skip pattern → [1]', got: JSON.stringify(fn([4,5,1,1,2,1,1])) },
    { pass: JSON.stringify(fn([2,2,2])) === '[]', description: 'all evens → []', got: JSON.stringify(fn([2,2,2])) },
  ];
}`,
    'A while loop with manual index control (rather than a for loop) lets you jump the index forward by 3 when needed. Collect elements that aren\'t skipped, then reverse the collected array at the end.'
  ),

  ex(62, 'robotInstructions', 2,
    ['data-structures', 'arrays'],
    ['arrays', 'objects', 'frequency-counter', 'beginner'],
    'Count occurrences of each move direction in an array.',
    `Write a function called \`robotInstructions\` which accepts an array of moves ("U", "D", "L", "R") and returns an object with the total count of each move type.

Examples:
  robotInstructions(["U","D","L","R"])
  // { U:1, D:1, L:1, R:1 }

  robotInstructions(["U","D","L","R","U","D","L","R","U","D","L","R"])
  // { U:3, D:3, L:3, R:3 }`,
    `function robotInstructions(moves) {
  // Your code here

}`,
    `function robotInstructions(moves) {
  const counts = { U: 0, D: 0, L: 0, R: 0 };
  for (let i = 0; i < moves.length; i++) {
    counts[moves[i]]++;
  }
  return counts;
}`,
    `(code) => {
  const fn = new Function(code + '; return robotInstructions;')();
  const r1 = fn(["U","D","L","R"]);
  const r2 = fn(["U","D","L","R","U","D","L","R","U","D","L","R"]);
  const r3 = fn(["U","U","U"]);
  return [
    { pass: r1.U===1 && r1.D===1 && r1.L===1 && r1.R===1, description: 'one of each → all 1s', got: JSON.stringify(r1) },
    { pass: r2.U===3 && r2.D===3 && r2.L===3 && r2.R===3, description: 'three of each → all 3s', got: JSON.stringify(r2) },
    { pass: r3.U===3 && r3.D===0 && r3.L===0 && r3.R===0, description: 'only U → { U:3, D:0, L:0, R:0 }', got: JSON.stringify(r3) },
  ];
}`,
    'This is a frequency counter pattern. Start with an object where all four directions are initialized to 0. Loop through the moves and use bracket notation to increment the matching key.'
  ),

  ex(63, 'scheduleCheck', 2,
    ['data-structures', 'objects'],
    ['objects', 'loops', 'comparison', 'beginner'],
    'Count the number of days both schedules are free.',
    `Write a function called \`scheduleCheck\` which accepts two objects, each with day-of-week keys and boolean values. Return the count of days where both objects have a value of \`true\`.

Examples:
  scheduleCheck(
    { Monday:true, Tuesday:true, ...all true },
    { Monday:true, Tuesday:true, ...all true }
  ) // 7

  scheduleCheck(
    { Monday:true, ..., Sunday:true },
    { Monday:true, ..., Saturday:false, Sunday:true }
  ) // 6`,
    `function scheduleCheck(schedule1, schedule2) {
  // Your code here

}`,
    `function scheduleCheck(schedule1, schedule2) {
  let count = 0;
  for (let day in schedule1) {
    if (schedule1[day] === true && schedule2[day] === true) count++;
  }
  return count;
}`,
    `(code) => {
  const fn = new Function(code + '; return scheduleCheck;')();
  const days = { Monday:true, Tuesday:true, Wednesday:true, Thursday:true, Friday:true, Saturday:true, Sunday:true };
  const oneLess = { ...days, Saturday:false };
  const allFalse = { Monday:false, Tuesday:false, Wednesday:false, Thursday:false, Friday:false, Saturday:false, Sunday:false };
  return [
    { pass: fn(days, days) === 7, description: 'both all-true → 7', got: fn(days, days) },
    { pass: fn(days, oneLess) === 6, description: 'one false → 6', got: fn(days, oneLess) },
    { pass: fn(days, allFalse) === 0, description: 'second all-false → 0', got: fn(days, allFalse) },
  ];
}`,
    'Loop over the keys of the first schedule. For each day, check if both schedule1[day] AND schedule2[day] are true. Increment a counter when both are.'
  ),

  ex(64, 'separateLanguages', 3,
    ['data-structures', 'arrays'],
    ['arrays', 'objects', 'loops', 'categorization', 'intermediate'],
    'Partition a language array into python count, javascript count, and an "other" array.',
    `Write a function called \`separateLanguages\` which accepts an array of strings and returns an object with keys "python", "javascript", and "other". The first two are counts; "other" is an array of everything else.

Examples:
  separateLanguages(["python","python","python","javascript","c++"])
  // { python:3, javascript:1, other:["c++"] }

  separateLanguages(["greek","french","yoruba","python"])
  // { python:1, javascript:0, other:["greek","french","yoruba"] }`,
    `function separateLanguages(arr) {
  // Your code here

}`,
    `function separateLanguages(arr) {
  const result = { python: 0, javascript: 0, other: [] };
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'python') result.python++;
    else if (arr[i] === 'javascript') result.javascript++;
    else result.other.push(arr[i]);
  }
  return result;
}`,
    `(code) => {
  const fn = new Function(code + '; return separateLanguages;')();
  const r1 = fn(["python","python","python","javascript","c++"]);
  const r2 = fn(["python","python","spanish","javascript"]);
  const r3 = fn(["greek","french","yoruba","python"]);
  return [
    { pass: r1.python===3 && r1.javascript===1 && JSON.stringify(r1.other)==='["c++"]', description: 'python:3, js:1, other:["c++"]', got: JSON.stringify(r1) },
    { pass: r2.python===2 && r2.javascript===1 && JSON.stringify(r2.other)==='["spanish"]', description: 'python:2, js:1, other:["spanish"]', got: JSON.stringify(r2) },
    { pass: r3.python===1 && r3.javascript===0 && r3.other.length===3, description: 'python:1, js:0, other has 3 items', got: JSON.stringify(r3) },
    { pass: fn([]).javascript === 0, description: 'empty array → all zeros/empty', got: JSON.stringify(fn([])) },
  ];
}`,
    'Initialize the result object with python:0, javascript:0, and other:[] before looping. Use if/else if/else to route each item to the right bucket.'
  ),

  ex(65, 'skipVowels', 4,
    ['data-structures', 'strings'],
    ['strings', 'arrays', 'loops', 'advanced'],
    'Build an array from a string, skipping a character after each vowel encountered.',
    `Write a function called \`skipVowels\` that accepts a string and returns an array. Iterate through the string: if you encounter a vowel, skip that character AND the next one. Otherwise, add the character to the array.

Examples:
  skipVowels("hello")    // ["h", "l"]
  skipVowels("much fun") // ["m", "h", " ", "f"]
  skipVowels("aaaa")     // []`,
    `function skipVowels(str) {
  // Your code here

}`,
    `function skipVowels(str) {
  const vowels = 'aeiouAEIOU';
  const result = [];
  let i = 0;
  while (i < str.length) {
    if (vowels.includes(str[i])) {
      i += 2; // skip vowel + next char
    } else {
      result.push(str[i]);
      i++;
    }
  }
  return result;
}`,
    `(code) => {
  const fn = new Function(code + '; return skipVowels;')();
  return [
    { pass: JSON.stringify(fn("hello")) === '["h","l"]', description: 'skipVowels("hello") → ["h","l"]', got: JSON.stringify(fn("hello")) },
    { pass: JSON.stringify(fn("much fun")) === '["m","h"," ","f"]', description: 'skipVowels("much fun") → ["m","h"," ","f"]', got: JSON.stringify(fn("much fun")) },
    { pass: JSON.stringify(fn("aaaa")) === '[]', description: 'all vowels → []', got: JSON.stringify(fn("aaaa")) },
    { pass: JSON.stringify(fn("xyz")) === '["x","y","z"]', description: 'no vowels → all chars', got: JSON.stringify(fn("xyz")) },
  ];
}`,
    'Like reverseValues, this problem needs a while loop with manual index control. When you hit a vowel, jump the index by 2 (skip the vowel and the character after it). Otherwise collect the character and move forward by 1.'
  ),

];

data.exercises.push(...part2Exercises);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✓ Added ${part2Exercises.length} Rithm Part 2 exercises (IDs 49–63)`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
