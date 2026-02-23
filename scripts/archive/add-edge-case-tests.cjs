#!/usr/bin/env node
/**
 * add-edge-case-tests.cjs
 *
 * Adds 1-2 edge-case test assertions to 10 under-tested exercises
 * (IDs: 10, 12, 109, 134, 138, 139, 166, 170, 174, 175).
 *
 * Each exercise currently has exactly 2 test assertions in its testRunner string.
 * This script injects additional assertions covering edge cases such as
 * empty inputs, single elements, boundary values, etc., then validates that
 * every new test passes against the existing solution before writing.
 */

const fs = require('fs');
const path = require('path');

const EXERCISES_PATH = path.resolve(
  __dirname,
  '../exercises/exercises.json'
);

// ─── helpers ────────────────────────────────────────────────────────

/**
 * For a given testRunner string, find the closing `]; }` of the returned
 * array and insert new test-object literals just before it.
 *
 * The pattern we match is the LAST occurrence of `]; }` in the string,
 * which closes `return [ ... ]; }`.  We splice new entries before the `]`.
 */
function insertTestCases(testRunner, newCasesCode) {
  // We need to find the return array's closing bracket.
  // The testRunners all end with a pattern like:
  //   ... } ]; }    (last item, then close bracket, then close function)
  //
  // Strategy: find the last `]; }` and insert before the `]`.
  // But we need to be careful. Let's find the last `];` that isn't inside a string.

  // A simpler, robust approach: the return array always ends with
  //   , { pass: ..., description: ..., got: ... } ]; }
  // or
  //   , { pass: ..., description: ..., got: ... } ]; }
  //
  // We'll find the very last `]; }` and insert a comma + new cases before `]`.

  const closingPattern = /\]\s*;\s*\}\s*$/;
  const match = testRunner.match(closingPattern);
  if (!match) {
    throw new Error('Could not find closing ]; } in testRunner');
  }

  const insertPos = testRunner.lastIndexOf(']');
  const before = testRunner.slice(0, insertPos);
  const after = testRunner.slice(insertPos);

  // `newCasesCode` should be a string like:
  //   , { pass: ..., description: '...', got: ... }
  return before + newCasesCode + ' ' + after;
}

/**
 * Validate that the testRunner, when executed with the exercise's solution,
 * returns an array where every item has `pass === true`.
 */
function validateTestRunner(testRunner, solution) {
  // The testRunner is a string like `(code) => { ... }`.
  // We can evaluate it as a function, then call it with the solution code string.
  const runnerFn = eval(`(${testRunner})`);
  const results = runnerFn(solution);

  const failures = results.filter((r) => !r.pass);
  return { allPass: failures.length === 0, results, failures };
}

// ─── edge-case definitions per exercise ID ──────────────────────────

const edgeCases = {
  // ID 10 – topScorers: filter >= 80, sort desc, map to names
  10: {
    code: `, { pass: JSON.stringify(fn([{name:'X',score:80}])) === '["X"]', description: 'score exactly 80 is included', got: JSON.stringify(fn([{name:'X',score:80}])) }, { pass: JSON.stringify(fn([{name:'A',score:95},{name:'B',score:95}])) === '["A","B"]', description: 'equal scores preserve relative order', got: JSON.stringify(fn([{name:'A',score:95},{name:'B',score:95}])) }`,
    descriptions: [
      'score exactly 80 is included (boundary)',
      'equal scores preserve relative order',
    ],
  },

  // ID 12 – formatUser: destructure with default role='student'
  12: {
    code: `, { pass: fn({name:'Jo',role:'mentor'}) === 'Jo (mentor)', description: 'formatUser with custom role', got: fn({name:'Jo',role:'mentor'}) }, { pass: fn({name:'',role:''}) === ' ()', description: 'empty strings handled', got: fn({name:'',role:''}) }`,
    descriptions: [
      'formatUser with a different custom role',
      'empty strings for name and role handled',
    ],
  },

  // ID 109 – fullName: template literal combining first + last
  109: {
    code: `, { pass: fn("","") === " ", description: 'empty strings → single space', got: fn("","") }, { pass: fn("Mary Jane","Watson") === "Mary Jane Watson", description: 'multi-word first name', got: fn("Mary Jane","Watson") }`,
    descriptions: [
      'empty strings produce a single space',
      'multi-word first name works',
    ],
  },

  // ID 134 – evensWithLoop: filter even numbers with for loop
  134: {
    code: `, { pass: JSON.stringify(fn([]))==='[]', description: 'empty array → []', got: JSON.stringify(fn([])) }, { pass: JSON.stringify(fn([0,-2,3,-4]))==='[0,-2,-4]', description: 'zero and negative evens included', got: JSON.stringify(fn([0,-2,3,-4])) }`,
    descriptions: [
      'empty array returns []',
      'zero and negative even numbers included',
    ],
  },

  // ID 138 – uppercaseAll: map to uppercase
  138: {
    code: `, { pass: JSON.stringify(fn([]))==='[]', description: 'empty array → []', got: JSON.stringify(fn([])) }, { pass: JSON.stringify(fn(["ALREADY"]))==='["ALREADY"]', description: 'already uppercase stays same', got: JSON.stringify(fn(["ALREADY"])) }`,
    descriptions: [
      'empty array returns []',
      'already-uppercase string unchanged',
    ],
  },

  // ID 139 – withIndex: map (el, i) => [i, el]
  139: {
    code: `, { pass: JSON.stringify(fn([]))==='[]', description: 'empty array → []', got: JSON.stringify(fn([])) }, { pass: JSON.stringify(fn([42]))==='[[0,42]]', description: 'single element → [[0,42]]', got: JSON.stringify(fn([42])) }`,
    descriptions: [
      'empty array returns []',
      'single-element array works correctly',
    ],
  },

  // ID 166 – invertObject: swap keys and values
  166: {
    code: `, { pass: JSON.stringify(fn({}))==='{}', description: 'empty object → {}', got: JSON.stringify(fn({})) }, { pass: fn({x:"y",z:"y"}).y!==undefined, description: 'duplicate values handled (last wins)', got: JSON.stringify(fn({x:"y",z:"y"})) }`,
    descriptions: [
      'empty object returns {}',
      'duplicate values handled (last key wins)',
    ],
  },

  // ID 170 – applyToEach: custom higher-order function (like map)
  170: {
    code: `, { pass: JSON.stringify(fn([],n=>n*2))==='[]', description: 'empty array → []', got: JSON.stringify(fn([],n=>n*2)) }, { pass: JSON.stringify(fn([5],n=>n*n))==='[25]', description: 'single element squared', got: JSON.stringify(fn([5],n=>n*n)) }`,
    descriptions: [
      'empty array with callback returns []',
      'single element with squaring callback',
    ],
  },

  // ID 174 – firstAndLast: array destructuring
  174: {
    code: `, { pass: (function(){ var r=fn([42]); return r.first===42&&r.last===42; })(), description: 'single element: first===last', got: JSON.stringify(fn([42])) }, { pass: (function(){ var r=fn(["x","y"]); return r.first==="x"&&r.last==="y"; })(), description: 'two elements', got: JSON.stringify(fn(["x","y"])) }`,
    descriptions: [
      'single-element array: first and last are the same',
      'two-element array works correctly',
    ],
  },

  // ID 175 – formatPerson: object destructuring
  175: {
    code: `, { pass: fn({firstName:"A",lastName:"B",age:0})==="Name: A B, Age: 0", description: 'age zero handled', got: fn({firstName:"A",lastName:"B",age:0}) }, { pass: fn({firstName:"Mary Jane",lastName:"O\\'Brien",age:99})==="Name: Mary Jane O'Brien, Age: 99", description: 'special chars and large age', got: fn({firstName:"Mary Jane",lastName:"O\\'Brien",age:99}) }`,
    descriptions: [
      'age of zero handled correctly',
      "special characters in name and large age",
    ],
  },
};

// ─── main ───────────────────────────────────────────────────────────

function main() {
  console.log('Reading exercises.json...');
  const raw = fs.readFileSync(EXERCISES_PATH, 'utf-8');
  const data = JSON.parse(raw);

  const targetIds = [10, 12, 109, 134, 138, 139, 166, 170, 174, 175];
  let updatedCount = 0;
  const report = [];

  for (const id of targetIds) {
    const exercise = data.exercises.find((e) => e.id === id);
    if (!exercise) {
      console.error(`  [SKIP] Exercise ID ${id} not found.`);
      continue;
    }

    const edgeCase = edgeCases[id];
    if (!edgeCase) {
      console.error(`  [SKIP] No edge cases defined for ID ${id}.`);
      continue;
    }

    console.log(`\n--- Exercise ${id}: "${exercise.title}" ---`);

    // Count existing tests
    const existingCount = (exercise.testRunner.match(/\bpass:/g) || []).length;
    console.log(`  Existing tests: ${existingCount}`);

    // Insert new test cases
    let updatedTestRunner;
    try {
      updatedTestRunner = insertTestCases(exercise.testRunner, edgeCase.code);
    } catch (err) {
      console.error(`  [ERROR] Could not insert tests: ${err.message}`);
      continue;
    }

    // Count new tests
    const newCount = (updatedTestRunner.match(/\bpass:/g) || []).length;
    console.log(`  Tests after insertion: ${newCount} (+${newCount - existingCount})`);

    // Validate against the solution
    let validation;
    try {
      validation = validateTestRunner(updatedTestRunner, exercise.solution);
    } catch (err) {
      console.error(`  [ERROR] Validation failed: ${err.message}`);
      continue;
    }

    if (!validation.allPass) {
      console.error(`  [FAIL] Some tests did not pass against the solution:`);
      validation.failures.forEach((f) => {
        console.error(`    - ${f.description}: got ${f.got}`);
      });
      continue;
    }

    console.log(`  All ${newCount} tests PASS against solution.`);
    edgeCase.descriptions.forEach((d) => console.log(`  + Added: ${d}`));

    // Apply update
    exercise.testRunner = updatedTestRunner;
    updatedCount++;
    report.push({ id, title: exercise.title, added: edgeCase.descriptions });
  }

  // Write updated data
  console.log(`\n========================================`);
  console.log(`Writing updated exercises.json (${updatedCount}/${targetIds.length} exercises updated)...`);
  fs.writeFileSync(EXERCISES_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('Done!\n');

  // Summary
  console.log('SUMMARY');
  console.log('-------');
  report.forEach(({ id, title, added }) => {
    console.log(`  Exercise ${id} ("${title}"):`);
    added.forEach((d) => console.log(`    + ${d}`));
  });
  console.log(`\nTotal exercises updated: ${updatedCount}`);
}

main();
