/**
 * Add 10 Tier 3 HTML & CSS exercises (IDs 360-369)
 *
 * Exercises:
 *   360 - Specificity Challenge         (css / selectors)
 *   361 - Flexbox Wrapping Layout       (css / flexbox)
 *   362 - CSS Grid Basics               (css / layout)
 *   363 - Nth-child Selectors           (css / selectors)
 *   364 - Sticky Header                 (css / positioning)
 *   365 - Keyframe Animation            (css / transitions)
 *   366 - Responsive Images             (html-css / layout) -- css/layout category
 *   367 - Accessible Table              (html / structure)
 *   368 - Gradient Backgrounds          (css / box-model)
 *   369 - Media Query Breakpoint        (css / layout)
 *
 * Also updates default-curriculum collection with all new IDs.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ── 360: Specificity Challenge ────────────────────────────────────────────
  {
    id: 360,
    title: 'Specificity Challenge',
    type: 'css',
    tier: 3,
    category: ['css', 'selectors'],
    tags: ['css', 'specificity', 'selectors', 'cascading', 'intermediate'],
    description: 'Write CSS rules that demonstrate specificity: element selectors, class selectors, and ID-qualified class selectors competing for the same elements.',
    instructions: 'Given the provided HTML, write CSS so that:\n- All `p` elements inside `#main` have `color: gray` (use `rgb(128, 128, 128)`)\n- Elements with class `.highlight` have `color: blue` (use `rgb(0, 0, 255)`) -- this should override the element selector\n- `#main .special` has `color: green` (use `rgb(0, 128, 0)`) -- this should override `.highlight`\n\nYour rules must rely on CSS specificity to produce the correct cascade.',
    starterCode: '/* Make plain p gray, .highlight blue, and #main .special green */\n/* Think about which selectors are more specific */\n',
    solution: '#main p {\n  color: rgb(128, 128, 128);\n}\n\n.highlight {\n  color: rgb(0, 0, 255);\n}\n\n#main .special {\n  color: rgb(0, 128, 0);\n}',
    testRunner: '',
    providedHtml: '<div id="main"><p class="highlight">Text 1</p><p>Text 2</p><p class="highlight special">Text 3</p></div>',
    testCases: [
      {
        query: '#main p.highlight:not(.special)',
        assertion: 'equals',
        property: 'color',
        value: 'rgb(0, 0, 255)',
        description: '.highlight paragraph is blue (class beats element)'
      },
      {
        query: '#main p:not(.highlight)',
        assertion: 'equals',
        property: 'color',
        value: 'rgb(128, 128, 128)',
        description: 'Plain paragraph is gray'
      },
      {
        query: '#main .special',
        assertion: 'equals',
        property: 'color',
        value: 'rgb(0, 128, 0)',
        description: '#main .special is green (ID+class beats class alone)'
      }
    ],
    hint: 'CSS specificity follows this order: inline styles > ID selectors > class selectors > element selectors. An ID selector (#main) combined with a class (.special) beats a class alone (.highlight). Write your rules so that the most specific selector wins for each element.',
    resources: []
  },

  // ── 361: Flexbox Wrapping Layout ──────────────────────────────────────────
  {
    id: 361,
    title: 'Flexbox Wrapping Layout',
    type: 'css',
    tier: 3,
    category: ['css', 'flexbox'],
    tags: ['css', 'flexbox', 'flex-wrap', 'layout', 'intermediate'],
    description: 'Create a flex container that wraps its items into multiple rows, with each item having a flexible base width and a gap between them.',
    instructions: 'Style the `.grid` container so that:\n- It uses `display: flex`\n- Items wrap to the next line with `flex-wrap: wrap`\n- There is a `gap` of `16px` between items\n\nAlso style each `.item` so it has:\n- `flex-basis: 200px`\n- `flex-grow: 1`\n\nThis creates a responsive card-like layout where items fill available space and wrap when needed.',
    starterCode: '/* Style .grid as a wrapping flex container */\n/* Style .item with flex-basis and flex-grow */\n',
    solution: '.grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.item {\n  flex-basis: 200px;\n  flex-grow: 1;\n}',
    testRunner: '',
    providedHtml: '<div class="grid" id="grid-el"><div class="item">1</div><div class="item">2</div><div class="item">3</div><div class="item">4</div><div class="item">5</div><div class="item">6</div></div>',
    testCases: [
      {
        query: '#grid-el',
        assertion: 'equals',
        property: 'display',
        value: 'flex',
        description: '.grid uses display: flex'
      },
      {
        query: '#grid-el',
        assertion: 'equals',
        property: 'flex-wrap',
        value: 'wrap',
        description: '.grid uses flex-wrap: wrap'
      },
      {
        query: '#grid-el',
        assertion: 'sourceMatch',
        value: 'flex-basis',
        description: 'CSS source contains flex-basis'
      },
      {
        query: '#grid-el',
        assertion: 'equals',
        property: 'gap',
        value: '16px',
        description: '.grid gap is 16px'
      }
    ],
    hint: 'flex-wrap: wrap tells the flex container to push items to the next line when they run out of room. flex-basis sets the ideal width of each item, while flex-grow: 1 lets them stretch to fill leftover space.',
    resources: []
  },

  // ── 362: CSS Grid Basics ──────────────────────────────────────────────────
  {
    id: 362,
    title: 'CSS Grid Basics',
    type: 'css',
    tier: 3,
    category: ['css', 'layout'],
    tags: ['css', 'grid', 'layout', 'fr-units', 'intermediate'],
    description: 'Create a 3-column CSS Grid layout using the fr unit for flexible column sizing and a gap between cells.',
    instructions: 'Style the `.container` element so that:\n- It uses `display: grid`\n- It has 3 equal-width columns using `grid-template-columns` with `1fr` units\n- There is a `gap` of `20px` between grid cells\n\nThe six child `.col` elements should automatically flow into a 3x2 grid.',
    starterCode: '/* Create a 3-column grid layout */\n/* Use fr units for equal columns */\n',
    solution: '.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 20px;\n}',
    testRunner: '',
    providedHtml: '<div class="container" id="container-el"><div class="col">A</div><div class="col">B</div><div class="col">C</div><div class="col">D</div><div class="col">E</div><div class="col">F</div></div>',
    testCases: [
      {
        query: '#container-el',
        assertion: 'equals',
        property: 'display',
        value: 'grid',
        description: '.container uses display: grid'
      },
      {
        query: '#container-el',
        assertion: 'sourceMatch',
        value: 'grid-template-columns',
        description: 'CSS source contains grid-template-columns'
      },
      {
        query: '#container-el',
        assertion: 'sourceMatch',
        value: '1fr',
        description: 'CSS source uses fr units'
      },
      {
        query: '#container-el',
        assertion: 'equals',
        property: 'gap',
        value: '20px',
        description: '.container gap is 20px'
      }
    ],
    hint: 'CSS Grid turns a container into a grid with display: grid. Use grid-template-columns to define how many columns and how wide each one is. The fr unit distributes available space proportionally -- 1fr 1fr 1fr creates three equal columns.',
    resources: []
  },

  // ── 363: Nth-child Selectors ──────────────────────────────────────────────
  {
    id: 363,
    title: 'Nth-child Selectors',
    type: 'css',
    tier: 3,
    category: ['css', 'selectors'],
    tags: ['css', 'selectors', 'nth-child', 'pseudo-class', 'intermediate'],
    description: 'Use :nth-child pseudo-class selectors to style alternating table rows with different backgrounds and make the first row bold.',
    instructions: 'Style the table rows so that:\n- `tr:nth-child(odd)` has `background-color: rgb(240, 240, 240)`\n- `tr:nth-child(even)` has `background-color: rgb(220, 220, 220)`\n- `tr:first-child` has `font-weight: bold` (or `700`)\n\nThis creates a classic "zebra-striped" table with a bold header row.',
    starterCode: '/* Style alternating rows with :nth-child */\n/* Make the first row bold */\n',
    solution: 'tr:nth-child(odd) {\n  background-color: rgb(240, 240, 240);\n}\n\ntr:nth-child(even) {\n  background-color: rgb(220, 220, 220);\n}\n\ntr:first-child {\n  font-weight: 700;\n}',
    testRunner: '',
    providedHtml: '<table id="data-table"><tr id="row-1"><td>Row 1</td></tr><tr id="row-2"><td>Row 2</td></tr><tr id="row-3"><td>Row 3</td></tr><tr id="row-4"><td>Row 4</td></tr></table>',
    testCases: [
      {
        query: '#data-table',
        assertion: 'sourceMatch',
        value: 'nth-child',
        description: 'CSS source uses :nth-child'
      },
      {
        query: '#row-1',
        assertion: 'equals',
        property: 'font-weight',
        value: '700',
        description: 'First row is bold (font-weight: 700)'
      },
      {
        query: '#row-1',
        assertion: 'equals',
        property: 'background-color',
        value: 'rgb(240, 240, 240)',
        description: 'Row 1 (odd) background is rgb(240, 240, 240)'
      },
      {
        query: '#row-2',
        assertion: 'equals',
        property: 'background-color',
        value: 'rgb(220, 220, 220)',
        description: 'Row 2 (even) background is rgb(220, 220, 220)'
      }
    ],
    hint: 'The :nth-child() pseudo-class matches elements based on their position among siblings. Use "odd" and "even" keywords for alternating styles. :first-child matches only the first element among its siblings.',
    resources: []
  },

  // ── 364: Sticky Header ────────────────────────────────────────────────────
  {
    id: 364,
    title: 'Sticky Header',
    type: 'css',
    tier: 3,
    category: ['css', 'positioning'],
    tags: ['css', 'positioning', 'sticky', 'z-index', 'intermediate'],
    description: 'Style a header element with position: sticky so it stays visible at the top of the viewport when the user scrolls.',
    instructions: 'Style the `.sticky-header` element so that:\n- It has `position: sticky`\n- It sticks to the top with `top: 0px`\n- It has a `z-index` of `100` to stay above other content\n- It has a `background-color` of `rgb(30, 41, 59)` so content does not show through\n\nThis is a common pattern for navigation bars that remain visible during scrolling.',
    starterCode: '/* Make the header sticky at the top */\n/* Add z-index and background so it layers properly */\n',
    solution: '.sticky-header {\n  position: sticky;\n  top: 0px;\n  z-index: 100;\n  background-color: rgb(30, 41, 59);\n}',
    testRunner: '',
    providedHtml: '<header class="sticky-header" id="header-el"><h1>My Site</h1></header><main id="content"><p>Content...</p></main>',
    testCases: [
      {
        query: '#header-el',
        assertion: 'equals',
        property: 'position',
        value: 'sticky',
        description: '.sticky-header has position: sticky'
      },
      {
        query: '#header-el',
        assertion: 'equals',
        property: 'top',
        value: '0px',
        description: '.sticky-header top is 0px'
      },
      {
        query: '#header-el',
        assertion: 'equals',
        property: 'z-index',
        value: '100',
        description: '.sticky-header z-index is 100'
      }
    ],
    hint: 'position: sticky makes an element act like position: relative until the user scrolls past a threshold (set by top, bottom, etc.), at which point it becomes fixed. z-index controls stacking order -- higher values sit on top.',
    resources: []
  },

  // ── 365: Keyframe Animation ───────────────────────────────────────────────
  {
    id: 365,
    title: 'Keyframe Animation',
    type: 'css',
    tier: 3,
    category: ['css', 'transitions'],
    tags: ['css', 'animation', 'keyframes', 'transitions', 'intermediate'],
    description: 'Create a @keyframes animation that moves an element horizontally and apply it to a target element.',
    instructions: 'Create a `@keyframes` animation called `slideIn` that:\n- At `from` (0%): `transform: translateX(-100px)`\n- At `to` (100%): `transform: translateX(0)`\n\nApply it to the `.animated` element with:\n- `animation-name: slideIn`\n- `animation-duration: 1s`\n- `animation-fill-mode: forwards`\n\nThe element should slide in from the left over 1 second.',
    starterCode: '/* Define a @keyframes animation called slideIn */\n/* Apply it to .animated with a duration */\n',
    solution: '@keyframes slideIn {\n  from {\n    transform: translateX(-100px);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n\n.animated {\n  animation-name: slideIn;\n  animation-duration: 1s;\n  animation-fill-mode: forwards;\n}',
    testRunner: '',
    providedHtml: '<div class="animated" id="anim-el">Animated</div>',
    testCases: [
      {
        query: '#anim-el',
        assertion: 'sourceMatch',
        value: '@keyframes',
        description: 'CSS source contains @keyframes'
      },
      {
        query: '#anim-el',
        assertion: 'sourceMatch',
        value: 'animation',
        description: 'CSS source contains animation property'
      },
      {
        query: '#anim-el',
        assertion: 'equals',
        property: 'animation-duration',
        value: '1s',
        description: '.animated animation-duration is 1s'
      }
    ],
    hint: '@keyframes defines the stages of an animation. The "from" and "to" keywords represent 0% and 100% of the animation timeline. Use the animation shorthand or individual properties (animation-name, animation-duration) to apply it.',
    resources: []
  },

  // ── 366: Responsive Images ────────────────────────────────────────────────
  {
    id: 366,
    title: 'Responsive Images',
    type: 'html-css',
    tier: 3,
    category: ['css', 'layout'],
    tags: ['html', 'css', 'responsive', 'images', 'layout', 'intermediate'],
    description: 'Build a responsive image gallery using flexbox wrapping and max-width to ensure images scale within their containers.',
    instructions: 'Build an image gallery:\n\nHTML:\n- A `<div>` with class `gallery`\n- At least 3 `<img>` elements inside the gallery (use any placeholder src and alt text)\n\nCSS:\n- `.gallery` uses `display: flex` and `flex-wrap: wrap`\n- Images have `max-width: 100%` so they scale down responsively\n\nThe gallery should wrap images into rows that adapt to the available width.',
    starterCode: '<!-- Build a .gallery with at least 3 images -->\n\n<!-- CSS is written in the second editor panel -->\n',
    solution: '<div class="gallery">\n  <img src="/placeholder1.jpg" alt="Image 1">\n  <img src="/placeholder2.jpg" alt="Image 2">\n  <img src="/placeholder3.jpg" alt="Image 3">\n</div>\n\n/* CSS */\n.gallery {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.gallery img {\n  max-width: 100%;\n}',
    testRunner: '',
    testCases: [
      {
        query: '.gallery',
        assertion: 'exists',
        description: '.gallery element exists'
      },
      {
        query: '.gallery',
        assertion: 'equals',
        property: 'display',
        value: 'flex',
        description: '.gallery uses display: flex'
      },
      {
        query: '.gallery',
        assertion: 'equals',
        property: 'flex-wrap',
        value: 'wrap',
        description: '.gallery uses flex-wrap: wrap'
      },
      {
        query: '.gallery img',
        assertion: 'countAtLeast',
        value: 3,
        description: 'Gallery contains at least 3 images'
      },
      {
        query: '.gallery',
        assertion: 'sourceMatch',
        value: 'max-width',
        description: 'CSS source contains max-width'
      }
    ],
    hint: 'Flexbox with flex-wrap creates a flowing layout where items move to the next line when space runs out. Setting max-width: 100% on images prevents them from overflowing their container, making them responsive.',
    resources: []
  },

  // ── 367: Accessible Table ─────────────────────────────────────────────────
  {
    id: 367,
    title: 'Accessible Table',
    type: 'html',
    tier: 3,
    category: ['html', 'structure'],
    tags: ['html', 'tables', 'accessibility', 'semantics', 'intermediate'],
    description: 'Build a properly structured data table with caption, thead, tbody, tfoot, and scope attributes on header cells for screen reader accessibility.',
    instructions: 'Create an accessible data table with:\n- A `<table>` element\n- A `<caption>` describing the table\n- A `<thead>` section with at least 2 `<th>` elements that have `scope="col"` attributes\n- A `<tbody>` section with data rows\n- A `<tfoot>` section with a summary row\n\nThe `scope` attribute on `<th>` elements tells screen readers whether the header applies to a column or row.',
    starterCode: '<!-- Build an accessible data table -->\n<!-- Include caption, thead, tbody, tfoot -->\n<!-- Add scope attributes to th elements -->\n',
    solution: '<table>\n  <caption>Monthly Sales</caption>\n  <thead>\n    <tr>\n      <th scope="col">Month</th>\n      <th scope="col">Revenue</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>January</td>\n      <td>$1,200</td>\n    </tr>\n    <tr>\n      <td>February</td>\n      <td>$1,500</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <td>Total</td>\n      <td>$2,700</td>\n    </tr>\n  </tfoot>\n</table>',
    testRunner: '',
    testCases: [
      {
        query: 'table',
        assertion: 'exists',
        description: '<table> element exists'
      },
      {
        query: 'caption',
        assertion: 'exists',
        description: '<caption> element exists'
      },
      {
        query: 'thead',
        assertion: 'exists',
        description: '<thead> element exists'
      },
      {
        query: 'tbody',
        assertion: 'exists',
        description: '<tbody> element exists'
      },
      {
        query: 'tfoot',
        assertion: 'exists',
        description: '<tfoot> element exists'
      },
      {
        query: 'th',
        assertion: 'countAtLeast',
        value: 2,
        description: 'At least 2 <th> elements exist'
      },
      {
        query: 'table',
        assertion: 'sourceMatch',
        value: 'scope=',
        description: 'HTML source contains scope attribute'
      }
    ],
    hint: 'A well-structured table uses <thead> for header rows, <tbody> for data rows, and <tfoot> for summary rows. The <caption> element provides a title. Adding scope="col" or scope="row" to <th> elements helps screen readers understand the table structure.',
    resources: []
  },

  // ── 368: Gradient Backgrounds ─────────────────────────────────────────────
  {
    id: 368,
    title: 'Gradient Backgrounds',
    type: 'css',
    tier: 3,
    category: ['css', 'box-model'],
    tags: ['css', 'gradients', 'backgrounds', 'intermediate'],
    description: 'Apply a linear-gradient background to one element and a radial-gradient to another to create visually rich backgrounds without images.',
    instructions: 'Style the elements so that:\n- `.hero` has a `background` using `linear-gradient` (choose any two colors, e.g., from `#1e3a5f` to `#4a90d9`)\n- `.badge` has a `background` using `radial-gradient` (choose any two colors, e.g., from `#f59e0b` to `#ef4444`)\n\nCSS gradients create smooth color transitions and are a powerful alternative to background images.',
    starterCode: '/* Apply a linear-gradient to .hero */\n/* Apply a radial-gradient to .badge */\n',
    solution: '.hero {\n  background: linear-gradient(to right, #1e3a5f, #4a90d9);\n}\n\n.badge {\n  background: radial-gradient(circle, #f59e0b, #ef4444);\n}',
    testRunner: '',
    providedHtml: '<div class="hero" id="hero-el"><span class="badge" id="badge-el">New</span></div>',
    testCases: [
      {
        query: '#hero-el',
        assertion: 'sourceMatch',
        value: 'linear-gradient',
        description: 'CSS source contains linear-gradient'
      },
      {
        query: '#badge-el',
        assertion: 'sourceMatch',
        value: 'radial-gradient',
        description: 'CSS source contains radial-gradient'
      }
    ],
    hint: 'linear-gradient() creates a gradient along a straight line (e.g., left to right). radial-gradient() creates a gradient radiating outward from a center point. Both are used as values for the background or background-image property.',
    resources: []
  },

  // ── 369: Media Query Breakpoint ───────────────────────────────────────────
  {
    id: 369,
    title: 'Media Query Breakpoint',
    type: 'css',
    tier: 3,
    category: ['css', 'layout'],
    tags: ['css', 'responsive', 'media-queries', 'layout', 'intermediate'],
    description: 'Use a @media query to change a layout from single-column (mobile) to side-by-side (desktop) at a 768px breakpoint.',
    instructions: 'Style the `.container` element with a mobile-first approach:\n\nDefault (mobile) styles:\n- `display: flex`\n- `flex-direction: column`\n\nAt `min-width: 768px` (desktop):\n- `flex-direction: row`\n\nThis is the standard responsive pattern: stack elements vertically on small screens and lay them out horizontally on wider screens.',
    starterCode: '/* Mobile-first: .container is flex column by default */\n/* Add a @media query at 768px to switch to row */\n',
    solution: '.container {\n  display: flex;\n  flex-direction: column;\n}\n\n@media (min-width: 768px) {\n  .container {\n    flex-direction: row;\n  }\n}',
    testRunner: '',
    providedHtml: '<div class="container" id="container-el"><aside class="sidebar" id="sidebar-el">Sidebar</aside><main class="content" id="content-el">Main</main></div>',
    testCases: [
      {
        query: '#container-el',
        assertion: 'equals',
        property: 'display',
        value: 'flex',
        description: '.container uses display: flex'
      },
      {
        query: '#container-el',
        assertion: 'equals',
        property: 'flex-direction',
        value: 'column',
        description: '.container default flex-direction is column (mobile-first)'
      },
      {
        query: '#container-el',
        assertion: 'sourceMatch',
        value: '@media',
        description: 'CSS source contains @media query'
      },
      {
        query: '#container-el',
        assertion: 'sourceMatch',
        value: '768px',
        description: 'CSS source references 768px breakpoint'
      }
    ],
    hint: 'Mobile-first design means writing your base CSS for small screens, then using @media (min-width: ...) to add styles that kick in on larger screens. flex-direction: column stacks items vertically; row places them side by side.',
    resources: []
  }

];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} HTML/CSS Tier 3 exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

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

const typeCounts = {};
for (const ex of newExercises) {
  typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
}

const categoryCounts = {};
for (const ex of newExercises) {
  const cat = ex.category[0] + '/' + ex.category[1];
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

console.log('\n=== Migration Complete ===');
console.log(`  New exercises: ${newExercises.length}`);
console.log(`  ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
console.log(`  By type: ${Object.entries(typeCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  By category: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
