/**
 * Add HTML & CSS Tier 1 (beginner) exercises (IDs 345-349)
 *
 * 5 exercises:
 *   345 - Ordered List           (html, structure)
 *   346 - HTML Table             (html, structure)
 *   347 - Text Formatting        (html, semantics)
 *   348 - Display Property       (css, layout)
 *   349 - Width and Height       (css, box-model)
 *
 * Also:
 *   - Updates default-curriculum collection to include all 5 new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ── 345: Ordered List ──────────────────────────────────────────────────────
  {
    id: 345,
    title: 'Ordered List',
    type: 'html',
    tier: 1,
    category: ['html', 'structure'],
    tags: ['html', 'lists', 'beginner'],
    description: 'Create an ordered (numbered) list using the <ol> and <li> elements.',
    instructions:
      'Create an ordered list with exactly three items:\n' +
      '  1. "First"\n' +
      '  2. "Second"\n' +
      '  3. "Third"\n\n' +
      'Use the `<ol>` element for the list and `<li>` elements for each item.',
    starterCode:
      '<!-- Create an ordered list with three items: First, Second, Third -->\n' +
      '<ol>\n' +
      '  <!-- Add your list items here -->\n' +
      '\n' +
      '</ol>',
    solution:
      '<ol>\n' +
      '  <li>First</li>\n' +
      '  <li>Second</li>\n' +
      '  <li>Third</li>\n' +
      '</ol>',
    testRunner: '',
    testCases: [
      {
        query: 'ol',
        assertion: 'exists',
        description: 'An <ol> element exists',
      },
      {
        query: 'ol li',
        assertion: 'countAtLeast',
        value: 3,
        description: 'At least 3 <li> items inside the <ol>',
      },
      {
        query: 'ol',
        assertion: 'sourceContains',
        value: 'First',
        description: 'Page contains "First"',
      },
      {
        query: 'ol',
        assertion: 'sourceContains',
        value: 'Second',
        description: 'Page contains "Second"',
      },
      {
        query: 'ol',
        assertion: 'sourceContains',
        value: 'Third',
        description: 'Page contains "Third"',
      },
    ],
    hint:
      'An ordered list uses <ol> instead of <ul>. The browser automatically numbers each <li> item. ' +
      'The structure is the same as an unordered list, just with a different parent tag.',
    resources: [],
  },

  // ── 346: HTML Table ────────────────────────────────────────────────────────
  {
    id: 346,
    title: 'HTML Table',
    type: 'html',
    tier: 1,
    category: ['html', 'structure'],
    tags: ['html', 'tables', 'beginner'],
    description: 'Build a basic HTML table with a header row and data rows.',
    instructions:
      'Create an HTML table with:\n' +
      '  - A `<thead>` containing one row with two header cells (`<th>`): "Name" and "Age"\n' +
      '  - A `<tbody>` containing two data rows, each with two cells (`<td>`)\n\n' +
      'Example data rows:\n' +
      '  - Alice, 25\n' +
      '  - Bob, 30\n\n' +
      'Use the `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements.',
    starterCode:
      '<!-- Build a table with a header row and two data rows -->\n' +
      '<table>\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <!-- Add header cells (th) for Name and Age -->\n' +
      '\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n' +
      '    <!-- Add two data rows (tr) with cells (td) -->\n' +
      '\n' +
      '  </tbody>\n' +
      '</table>',
    solution:
      '<table>\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th>Name</th>\n' +
      '      <th>Age</th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n' +
      '    <tr>\n' +
      '      <td>Alice</td>\n' +
      '      <td>25</td>\n' +
      '    </tr>\n' +
      '    <tr>\n' +
      '      <td>Bob</td>\n' +
      '      <td>30</td>\n' +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>',
    testRunner: '',
    testCases: [
      {
        query: 'table',
        assertion: 'exists',
        description: 'A <table> element exists',
      },
      {
        query: 'thead',
        assertion: 'exists',
        description: 'A <thead> element exists',
      },
      {
        query: 'th',
        assertion: 'countAtLeast',
        value: 2,
        description: 'At least 2 <th> header cells',
      },
      {
        query: 'tbody',
        assertion: 'exists',
        description: 'A <tbody> element exists',
      },
      {
        query: 'tr',
        assertion: 'countAtLeast',
        value: 3,
        description: 'At least 3 <tr> rows (1 header + 2 data)',
      },
    ],
    hint:
      'Tables are built with nested elements: <table> wraps everything, <thead> holds the header, ' +
      '<tbody> holds the data. Each row uses <tr>. Header cells use <th>, data cells use <td>.',
    resources: [],
  },

  // ── 347: Text Formatting ───────────────────────────────────────────────────
  {
    id: 347,
    title: 'Text Formatting',
    type: 'html',
    tier: 1,
    category: ['html', 'semantics'],
    tags: ['html', 'text', 'semantics', 'formatting', 'beginner'],
    description: 'Use semantic inline elements to format text within a paragraph.',
    instructions:
      'Create a `<p>` element that contains text using all three of these formatting elements:\n' +
      '  - `<strong>` to mark important text (bold)\n' +
      '  - `<em>` to mark emphasized text (italic)\n' +
      '  - `<code>` to mark inline code\n\n' +
      'For example: "JavaScript has a <strong>powerful</strong> ' +
      '<em>event loop</em> that runs <code>setTimeout</code> callbacks."\n\n' +
      'You may use any text you like, as long as all three elements appear inside the paragraph.',
    starterCode:
      '<!-- Create a paragraph with strong, em, and code elements -->\n' +
      '<p>\n' +
      '  <!-- Use <strong> for important text -->\n' +
      '  <!-- Use <em> for emphasized text -->\n' +
      '  <!-- Use <code> for inline code -->\n' +
      '\n' +
      '</p>',
    solution:
      '<p>\n' +
      '  JavaScript has a <strong>powerful</strong>\n' +
      '  <em>event loop</em> that runs\n' +
      '  <code>setTimeout</code> callbacks.\n' +
      '</p>',
    testRunner: '',
    testCases: [
      {
        query: 'p',
        assertion: 'exists',
        description: 'A <p> element exists',
      },
      {
        query: 'strong',
        assertion: 'exists',
        description: 'A <strong> element exists',
      },
      {
        query: 'em',
        assertion: 'exists',
        description: 'An <em> element exists',
      },
      {
        query: 'code',
        assertion: 'exists',
        description: 'A <code> element exists',
      },
    ],
    hint:
      '<strong> is for text with strong importance (browsers show it bold). ' +
      '<em> is for stress emphasis (browsers show it italic). ' +
      '<code> is for short code snippets (browsers show it in a monospace font). ' +
      'All three can be placed inside a <p> alongside regular text.',
    resources: [],
  },

  // ── 348: Display Property ──────────────────────────────────────────────────
  {
    id: 348,
    title: 'Display Property',
    type: 'css',
    tier: 1,
    category: ['css', 'layout'],
    tags: ['css', 'display', 'layout', 'beginner'],
    description: 'Control element visibility and flow using the CSS display property.',
    instructions:
      'Write CSS to set the `display` property for three elements:\n' +
      '  1. `.block` should have `display: block`\n' +
      '  2. `.inline` should have `display: inline`\n' +
      '  3. `.hidden` should have `display: none`\n\n' +
      'The `display` property controls whether an element is treated as a block-level box, ' +
      'an inline box, or is removed from the page flow entirely.',
    starterCode:
      '/* Set the display property for each class */\n' +
      '.block {\n' +
      '  /* Make this a block element */\n' +
      '\n' +
      '}\n' +
      '\n' +
      '.inline {\n' +
      '  /* Make this an inline element */\n' +
      '\n' +
      '}\n' +
      '\n' +
      '.hidden {\n' +
      '  /* Hide this element completely */\n' +
      '\n' +
      '}',
    solution:
      '.block {\n' +
      '  display: block;\n' +
      '}\n' +
      '\n' +
      '.inline {\n' +
      '  display: inline;\n' +
      '}\n' +
      '\n' +
      '.hidden {\n' +
      '  display: none;\n' +
      '}',
    testRunner: '',
    providedHtml:
      '<div class="block" id="block-el">Block</div>' +
      '<span class="inline" id="inline-el">Inline</span>' +
      '<div class="hidden" id="hidden-el">Hidden</div>',
    testCases: [
      {
        assertion: 'equals',
        selector: '#block-el',
        property: 'display',
        value: 'block',
        description: '.block has display: block',
      },
      {
        assertion: 'equals',
        selector: '#inline-el',
        property: 'display',
        value: 'inline',
        description: '.inline has display: inline',
      },
      {
        assertion: 'equals',
        selector: '#hidden-el',
        property: 'display',
        value: 'none',
        description: '.hidden has display: none',
      },
    ],
    hint:
      'The display property accepts several values: "block" makes an element take the full width ' +
      'and start on a new line, "inline" makes it flow with text, and "none" removes it from the ' +
      'page completely (it takes up no space).',
    resources: [],
  },

  // ── 349: Width and Height ──────────────────────────────────────────────────
  {
    id: 349,
    title: 'Width and Height',
    type: 'css',
    tier: 1,
    category: ['css', 'box-model'],
    tags: ['css', 'box-model', 'sizing', 'beginner'],
    description: 'Set explicit dimensions on an element and use border-box sizing.',
    instructions:
      'Write CSS that targets the `.box` class and sets:\n' +
      '  1. `width` to `200px`\n' +
      '  2. `height` to `150px`\n' +
      '  3. `box-sizing` to `border-box`\n\n' +
      'The `box-sizing: border-box` property ensures that padding and borders are included ' +
      'within the specified width and height, instead of being added on top of them.',
    starterCode:
      '/* Set the width, height, and box-sizing for .box */\n' +
      '.box {\n' +
      '  /* Set width to 200px */\n' +
      '\n' +
      '  /* Set height to 150px */\n' +
      '\n' +
      '  /* Set box-sizing to border-box */\n' +
      '\n' +
      '}',
    solution:
      '.box {\n' +
      '  width: 200px;\n' +
      '  height: 150px;\n' +
      '  box-sizing: border-box;\n' +
      '}',
    testRunner: '',
    providedHtml: '<div class="box" id="test-box">Content</div>',
    testCases: [
      {
        assertion: 'equals',
        selector: '#test-box',
        property: 'width',
        value: '200px',
        description: 'Width is 200px',
      },
      {
        assertion: 'equals',
        selector: '#test-box',
        property: 'height',
        value: '150px',
        description: 'Height is 150px',
      },
      {
        assertion: 'equals',
        selector: '#test-box',
        property: 'box-sizing',
        value: 'border-box',
        description: 'Box-sizing is border-box',
      },
    ],
    hint:
      'The "width" and "height" properties set the dimensions of an element. ' +
      'By default, CSS uses "content-box" sizing where padding and borders are added outside ' +
      'the specified dimensions. Setting "box-sizing: border-box" changes this so that ' +
      'padding and borders are included within the width and height you set.',
    resources: [],
  },
];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} HTML/CSS Tier 1 exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

// ─── UPDATE DEFAULT-CURRICULUM ───────────────────────────────────────────────

const dc = data.collections.find(c => c.id === 'default-curriculum');
if (dc) {
  const ids = new Set(dc.exerciseIds);
  for (const ex of newExercises) ids.add(ex.id);
  dc.exerciseIds = [...ids].sort((a, b) => a - b);
  console.log(`  Updated default-curriculum: ${dc.exerciseIds.length} exercises`);
}

// ─── WRITE BACK ──────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

const tierCounts = {};
for (const ex of data.exercises) {
  tierCounts[ex.tier] = (tierCounts[ex.tier] || 0) + 1;
}

const categoryCounts = {};
for (const ex of newExercises) {
  const cat = ex.category[0] + '/' + ex.category[1];
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

const typeCounts = {};
for (const ex of newExercises) {
  typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
}

console.log('\n=== Migration Complete ===');
console.log(`  New exercises: ${newExercises.length}`);
console.log(`  ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`  Types: ${Object.entries(typeCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
console.log(`  By subcategory: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
