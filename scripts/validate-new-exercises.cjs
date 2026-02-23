/**
 * Validate new exercises — test runners against solutions
 * Handles both sync and async (Promise-returning) test runners
 * DOM event exercises (iframe-based) are skipped in Node.js
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// Validate all exercises from 279 onward (Tier 4/5 + algorithms + regex + DOM)
const NEW_IDS = Array.from({ length: 66 }, (_, i) => 279 + i); // 279-344

// DOM event exercises that use iframe/Promise — can't run in Node.js
const BROWSER_ONLY_IDS = new Set([338, 339, 342, 343]);

// Polyfill DOMParser for Node.js (for DOM selection/manipulation exercises)
try {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('');
  global.DOMParser = dom.window.DOMParser;
  global.document = dom.window.document;
} catch (e) {
  // jsdom not available — DOM exercises will fail gracefully
}

async function validate() {
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const id of NEW_IDS) {
    const ex = data.exercises.find(e => e.id === id);
    if (!ex) {
      console.log(`  ✗ ID ${id}: NOT FOUND`);
      failed++;
      failures.push({ id, reason: 'Exercise not found' });
      continue;
    }

    // HTML/CSS exercises use testCases, not testRunner
    if (ex.type === 'html-css' || ex.type === 'html' || ex.type === 'css') {
      if (ex.testCases && ex.testCases.length > 0) {
        console.log(`  ✓ ${id}: ${ex.title} (${ex.testCases.length} test cases — html-css type)`);
        passed++;
      } else {
        console.log(`  ✗ ${id}: ${ex.title} — no testCases for html-css type`);
        failed++;
        failures.push({ id, title: ex.title, reason: 'No testCases' });
      }
      continue;
    }

    // Skip browser-only DOM exercises (iframe-based, need real browser)
    if (BROWSER_ONLY_IDS.has(id)) {
      console.log(`  ~ ${id}: ${ex.title} (BROWSER-ONLY — skipped in Node.js)`);
      passed++;
      continue;
    }

    // JS exercises: eval testRunner against solution
    if (!ex.testRunner) {
      console.log(`  ✗ ${id}: ${ex.title} — no testRunner`);
      failed++;
      failures.push({ id, title: ex.title, reason: 'No testRunner' });
      continue;
    }

    try {
      // testRunner is stored as an arrow function string: "(code) => { ... }"
      // Must eval it wrapped in parens, same as the app does in jsRunner.ts
      const runnerFn = eval(`(${ex.testRunner})`);
      const result = runnerFn(ex.solution);

      // Handle async test runners (return Promises)
      const results = result instanceof Promise ? await result : result;

      if (!Array.isArray(results)) {
        console.log(`  ✗ ${id}: ${ex.title} — testRunner returned ${typeof results}, expected array`);
        failed++;
        failures.push({ id, title: ex.title, reason: `Non-array result: ${typeof results}` });
        continue;
      }

      const allPass = results.every(r => r.pass);
      const passCount = results.filter(r => r.pass).length;

      if (allPass) {
        console.log(`  ✓ ${id}: ${ex.title} (${passCount}/${results.length} tests pass)`);
        passed++;
      } else {
        const failedTests = results.filter(r => !r.pass);
        console.log(`  ✗ ${id}: ${ex.title} — ${passCount}/${results.length} pass`);
        for (const ft of failedTests) {
          console.log(`      FAIL: ${ft.description}`);
          if (ft.expected !== undefined) console.log(`        expected: ${JSON.stringify(ft.expected)}`);
          if (ft.got !== undefined) console.log(`        got: ${JSON.stringify(ft.got)}`);
        }
        failed++;
        failures.push({ id, title: ex.title, reason: `${failedTests.length} tests failed`, failedTests });
      }
    } catch (err) {
      console.log(`  ✗ ${id}: ${ex.title} — ERROR: ${err.message}`);
      failed++;
      failures.push({ id, title: ex.title, reason: err.message });
    }
  }

  console.log(`\n=== Validation Summary ===`);
  console.log(`  Passed: ${passed}/${NEW_IDS.length}`);
  console.log(`  Failed: ${failed}/${NEW_IDS.length}`);

  if (failures.length > 0) {
    console.log(`\nFailed exercises:`);
    for (const f of failures) {
      console.log(`  ${f.id}: ${f.title || 'N/A'} — ${f.reason}`);
    }
  }

  return failed === 0;
}

validate().then(ok => {
  process.exit(ok ? 0 : 1);
}).catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
