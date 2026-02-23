/**
 * redistribute-html-css-tiers.cjs
 *
 * 1. Bumps 3 existing CSS exercises from Tier 2 → Tier 3
 * 2. Adds new CSS subcategories: typography, positioning, transitions
 * 3. Fixes category for exercise 188 (selectors → variables is more accurate but we'll add a proper subcategory)
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// ──────────────────────────────────────────────
// 1. Bump select Tier 2 exercises to Tier 3
// ──────────────────────────────────────────────
const BUMP_TO_T3 = [186, 187, 188]; // Flexbox Row, Hover State, CSS Custom Properties

let bumped = 0;
for (const ex of data.exercises) {
  if (BUMP_TO_T3.includes(ex.id)) {
    console.log(`  Bumping ID ${ex.id} "${ex.title}" from T${ex.tier} → T3`);
    ex.tier = 3;
    // Remove 'beginner' tag if present, add 'intermediate'
    ex.tags = ex.tags.filter(t => t !== 'beginner');
    if (!ex.tags.includes('intermediate')) ex.tags.push('intermediate');
    bumped++;
  }
}
console.log(`\nBumped ${bumped} exercises to Tier 3`);

// ──────────────────────────────────────────────
// 2. Add new CSS subcategories
// ──────────────────────────────────────────────
const cssCategory = data.categories.css;
if (cssCategory) {
  if (!cssCategory.children.typography) {
    cssCategory.children.typography = { label: 'Typography' };
    console.log('Added css > typography subcategory');
  }
  if (!cssCategory.children.positioning) {
    cssCategory.children.positioning = { label: 'Positioning' };
    console.log('Added css > positioning subcategory');
  }
  if (!cssCategory.children.transitions) {
    cssCategory.children.transitions = { label: 'Transitions & Animation' };
    console.log('Added css > transitions subcategory');
  }
}

// ──────────────────────────────────────────────
// 3. Fix category for exercise 188 (CSS Custom Properties)
//    Currently ["css", "selectors"] → ["css", "layout"] (it's more of a layout/theming concept)
// ──────────────────────────────────────────────
const ex188 = data.exercises.find(e => e.id === 188);
if (ex188) {
  ex188.category = ['css', 'layout'];
  console.log('Fixed category for ID 188 to ["css", "layout"]');
}

// ──────────────────────────────────────────────
// Write back
// ──────────────────────────────────────────────
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// Verify
const verify = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
const tierCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
let htmlCssCount = 0;
for (const ex of verify.exercises) {
  if (['html', 'css', 'html-css'].includes(ex.type)) {
    tierCounts[ex.tier]++;
    htmlCssCount++;
  }
}
console.log(`\nHTML/CSS exercises after redistribution (${htmlCssCount} total):`);
console.log(`  T1: ${tierCounts[1]}, T2: ${tierCounts[2]}, T3: ${tierCounts[3]}, T4: ${tierCounts[4]}, T5: ${tierCounts[5]}`);
console.log(`\nCSS subcategories: ${Object.keys(verify.categories.css.children).join(', ')}`);
console.log('Done ✓');
