/**
 * Full integrity check of exercises.json before committing.
 */
const data = require('../exercises/exercises.json');
let errors = 0;

// 1. Check for duplicate IDs
const ids = data.exercises.map(e => e.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  console.error('DUPLICATE IDS:', dupes);
  errors++;
} else {
  console.log('✓ No duplicate IDs (' + ids.length + ' exercises)');
}

// 2. Check required fields on every exercise
const required = ['id', 'title', 'type', 'tier', 'category', 'tags', 'description', 'instructions', 'solution', 'hints'];
data.exercises.forEach(ex => {
  required.forEach(field => {
    if (ex[field] === undefined || ex[field] === null) {
      console.error('MISSING FIELD:', field, 'on exercise #' + ex.id, ex.title);
      errors++;
    }
  });
  // JS exercises must have testRunner, HTML/CSS must have testCases
  if (ex.type === 'js' && !ex.testRunner) {
    console.error('MISSING testRunner on JS exercise #' + ex.id, ex.title);
    errors++;
  }
  if ((ex.type === 'html' || ex.type === 'css' || ex.type === 'html-css') && (!ex.testCases || ex.testCases.length === 0)) {
    console.error('MISSING testCases on', ex.type, 'exercise #' + ex.id, ex.title);
    errors++;
  }
  // CSS exercises need providedHtml
  if (ex.type === 'css' && !ex.providedHtml) {
    console.error('MISSING providedHtml on CSS exercise #' + ex.id, ex.title);
    errors++;
  }
  // Resources should exist
  if (!ex.resources || ex.resources.length === 0) {
    console.error('MISSING resources on exercise #' + ex.id, ex.title);
    errors++;
  }
  // Hints should have 1-3 entries
  if (ex.hints && (ex.hints.length === 0 || ex.hints.length > 3)) {
    console.error('BAD hints count (' + ex.hints.length + ') on exercise #' + ex.id, ex.title);
    errors++;
  }
  // Valid type
  if (!['js', 'html', 'css', 'html-css'].includes(ex.type)) {
    console.error('INVALID type:', ex.type, 'on exercise #' + ex.id);
    errors++;
  }
  // Valid tier
  if (![1,2,3,4,5].includes(ex.tier)) {
    console.error('INVALID tier:', ex.tier, 'on exercise #' + ex.id);
    errors++;
  }
});

// 3. Check collections reference valid exercise IDs
const idSet = new Set(ids);
data.collections.forEach(col => {
  col.exerciseIds.forEach(eid => {
    if (!idSet.has(eid)) {
      console.error('COLLECTION', col.name, 'references missing exercise ID:', eid);
      errors++;
    }
  });
});
console.log('✓ Checked', data.collections.length, 'collections');

// 4. Validate new JS exercises (407+) against solutions
const newJs = data.exercises.filter(e => e.id >= 407 && e.type === 'js');
let passed = 0, failed = 0;
newJs.forEach(ex => {
  try {
    const runner = eval('(' + ex.testRunner + ')');
    const results = runner(ex.solution);
    if (Array.isArray(results) && results.every(r => r.pass)) {
      passed++;
    } else {
      const failing = results.filter(r => !r.pass);
      console.error('FAILING TESTS on #' + ex.id, ex.title + ':');
      failing.forEach(r => console.error('  ✗', r.description, 'got:', r.got));
      failed++;
      errors++;
    }
  } catch (err) {
    console.error('ERROR running tests for #' + ex.id, ex.title + ':', err.message);
    failed++;
    errors++;
  }
});
console.log('✓ Validated', passed + '/' + (passed + failed), 'new JS exercises pass against solutions');

// Summary
console.log('\n' + (errors ? '✗ ' + errors + ' ERRORS FOUND' : '✓ ALL CHECKS PASSED'));
process.exit(errors ? 1 : 0);
