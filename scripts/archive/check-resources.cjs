const d = require('../exercises/exercises.json');
const empty = d.exercises.filter(e => !e.resources || e.resources.length === 0);
console.log('Exercises with empty/missing resources:', empty.length);
console.log('With resources:', d.exercises.length - empty.length);

// Check what exercises DO have resources
const withRes = d.exercises.filter(e => e.resources && e.resources.length > 0);
console.log('\nSample exercises WITH resources:');
withRes.slice(0, 5).forEach(e => {
  console.log(`  #${e.id} "${e.title}" - ${e.resources.length} resources`);
});

// Range breakdown
const ranges = [
  [1, 20], [21, 65], [66, 110], [111, 200], [201, 300], [301, 406], [407, 451]
];
console.log('\nBreakdown by range:');
ranges.forEach(([lo, hi]) => {
  const inRange = d.exercises.filter(e => e.id >= lo && e.id <= hi);
  const withR = inRange.filter(e => e.resources && e.resources.length > 0);
  console.log(`  ${lo}-${hi}: ${withR.length}/${inRange.length} have resources`);
});
