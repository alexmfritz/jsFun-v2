/**
 * Add 10 Tier 2 HTML & CSS exercises (IDs 350-359)
 *
 * HTML exercises (350-352):
 *   - Select, Radio, and Checkbox (forms)
 *   - Image and Link (structure)
 *   - Blockquote and Citation (semantics)
 *
 * CSS exercises (353-359):
 *   - Position Relative and Absolute (positioning)
 *   - Typography Basics (typography)
 *   - CSS Units (box-model)
 *   - Pseudo-elements (selectors)
 *   - CSS Combinators (selectors)
 *   - Transitions (transitions)
 *   - Shadows and Borders (box-model)
 *
 * Also:
 *   - Updates default-curriculum collection to include all 10 new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ═══════════════════════════════════════════════════════════════════════════
  // HTML exercises (350-352)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 350: Select, Radio, and Checkbox ───────────────────────────────────────
  {
    id: 350,
    title: 'Select, Radio, and Checkbox',
    type: 'html',
    tier: 2,
    category: ['html', 'forms'],
    tags: ['html', 'forms', 'inputs', 'select', 'radio', 'checkbox'],
    description: 'Build a form that uses a dropdown select, radio buttons, and a checkbox.',
    instructions: 'Create a `<form>` containing:\n  1. A `<select>` dropdown with at least 3 `<option>` elements\n  2. Two `<input type="radio">` buttons that share the same `name` attribute\n  3. An `<input type="checkbox">`\n\nThe select might list favourite colours, the radios could be a yes/no choice, and the checkbox could be an "I agree" toggle.',
    starterCode: '<!-- Build a form with select, radio, and checkbox inputs -->\n<form>\n  <!-- Add a <select> with 3+ options -->\n\n  <!-- Add 2 radio buttons with the same name -->\n\n  <!-- Add a checkbox -->\n\n</form>',
    solution: '<form>\n  <label for="color">Favourite colour:</label>\n  <select id="color" name="color">\n    <option value="red">Red</option>\n    <option value="green">Green</option>\n    <option value="blue">Blue</option>\n  </select>\n\n  <p>Do you like coding?</p>\n  <label><input type="radio" name="coding" value="yes"> Yes</label>\n  <label><input type="radio" name="coding" value="no"> No</label>\n\n  <label><input type="checkbox" name="agree"> I agree to the terms</label>\n</form>',
    testRunner: '',
    testCases: [
      {
        query: 'select',
        assertion: 'exists',
        description: 'A <select> element exists',
      },
      {
        query: 'option',
        assertion: 'countAtLeast',
        value: 3,
        description: 'At least 3 <option> elements exist',
      },
      {
        query: 'input[type="radio"]',
        assertion: 'countAtLeast',
        value: 2,
        description: 'At least 2 radio buttons exist',
      },
      {
        query: 'input[type="checkbox"]',
        assertion: 'exists',
        description: 'A checkbox input exists',
      },
    ],
    hint: '<select> creates a dropdown; each <option> is a choice. Radio buttons with the same "name" attribute form a group where only one can be selected. A checkbox is an independent on/off toggle.',
    resources: [],
  },

  // ── 351: Image and Link ────────────────────────────────────────────────────
  {
    id: 351,
    title: 'Image and Link',
    type: 'html',
    tier: 2,
    category: ['html', 'structure'],
    tags: ['html', 'images', 'links', 'accessibility'],
    description: 'Create an image with alt text wrapped inside a link.',
    instructions: 'Create an `<a>` element with an `href` attribute (any URL is fine) that contains an `<img>` element. The image must have:\n  - A `src` attribute (e.g., "photo.jpg")\n  - An `alt` attribute describing the image\n\nThis makes the image clickable as a link.',
    starterCode: '<!-- Create a link that wraps an image -->\n<!-- The <a> needs an href and the <img> needs src and alt -->\n',
    solution: '<a href="https://example.com">\n  <img src="photo.jpg" alt="A descriptive photo">\n</a>',
    testRunner: '',
    testCases: [
      {
        query: 'a',
        assertion: 'exists',
        description: 'An <a> element exists',
      },
      {
        query: 'a',
        assertion: 'sourceMatch',
        value: 'href=',
        description: 'The link has an href attribute',
      },
      {
        query: 'img',
        assertion: 'exists',
        description: 'An <img> element exists',
      },
      {
        query: 'img',
        assertion: 'sourceMatch',
        value: 'alt=',
        description: 'The image has an alt attribute',
      },
    ],
    hint: 'Wrap the <img> inside an <a> tag. The <a> needs href="..." to set the destination. The <img> needs both src (image file path) and alt (accessible text description).',
    resources: [],
  },

  // ── 352: Blockquote and Citation ───────────────────────────────────────────
  {
    id: 352,
    title: 'Blockquote and Citation',
    type: 'html',
    tier: 2,
    category: ['html', 'semantics'],
    tags: ['html', 'semantics', 'text', 'blockquote'],
    description: 'Use blockquote, cite, mark, and small elements for rich text semantics.',
    instructions: 'Create two sections:\n  1. A `<blockquote>` element containing a quote, with a `<cite>` element for the source\n  2. A `<p>` paragraph that uses `<mark>` to highlight a word and `<small>` for fine print\n\nExample structure:\n  <blockquote>To be or not to be.<cite>Shakespeare</cite></blockquote>\n  <p>This is <mark>important</mark> text. <small>Terms apply.</small></p>',
    starterCode: '<!-- Create a blockquote with a citation -->\n\n<!-- Create a paragraph with mark and small elements -->\n',
    solution: '<blockquote>\n  To be or not to be, that is the question.\n  <cite>William Shakespeare</cite>\n</blockquote>\n<p>This is <mark>important</mark> information. <small>Terms and conditions apply.</small></p>',
    testRunner: '',
    testCases: [
      {
        query: 'blockquote',
        assertion: 'exists',
        description: 'A <blockquote> element exists',
      },
      {
        query: 'cite',
        assertion: 'exists',
        description: 'A <cite> element exists',
      },
      {
        query: 'mark',
        assertion: 'exists',
        description: 'A <mark> element exists',
      },
      {
        query: 'small',
        assertion: 'exists',
        description: 'A <small> element exists',
      },
    ],
    hint: '<blockquote> wraps a quoted block of text. <cite> identifies the source of the quote. <mark> highlights text (like a highlighter pen). <small> is for fine print or side comments.',
    resources: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CSS exercises (353-359)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 353: Position Relative and Absolute ────────────────────────────────────
  {
    id: 353,
    title: 'Position Relative and Absolute',
    type: 'css',
    tier: 2,
    category: ['css', 'positioning'],
    tags: ['css', 'positioning', 'relative', 'absolute'],
    description: 'Use position relative and absolute to place a child element within its parent.',
    instructions: 'Style the two elements:\n  1. `.parent` should have `position: relative`\n  2. `.child` should have `position: absolute`, `top: 10px`, and `left: 20px`\n\nThis anchors the child to the parent rather than the page.',
    starterCode: '/* Position the parent and child */\n.parent {\n  /* Make this a positioning context */\n\n}\n\n.child {\n  /* Position absolutely within the parent */\n\n}',
    solution: '.parent {\n  position: relative;\n}\n\n.child {\n  position: absolute;\n  top: 10px;\n  left: 20px;\n}',
    testRunner: '',
    providedHtml: '<div class="parent" id="parent-el"><div class="child" id="child-el">Positioned</div></div>',
    testCases: [
      {
        query: '#parent-el',
        assertion: 'equals',
        property: 'position',
        value: 'relative',
        description: 'Parent has position: relative',
      },
      {
        query: '#child-el',
        assertion: 'equals',
        property: 'position',
        value: 'absolute',
        description: 'Child has position: absolute',
      },
      {
        query: '#child-el',
        assertion: 'equals',
        property: 'top',
        value: '10px',
        description: 'Child has top: 10px',
      },
      {
        query: '#child-el',
        assertion: 'equals',
        property: 'left',
        value: '20px',
        description: 'Child has left: 20px',
      },
    ],
    hint: 'Setting position: relative on the parent makes it the reference point for any absolutely-positioned children. The child with position: absolute is then placed using top/left offsets relative to that parent.',
    resources: [],
  },

  // ── 354: Typography Basics ─────────────────────────────────────────────────
  {
    id: 354,
    title: 'Typography Basics',
    type: 'css',
    tier: 2,
    category: ['css', 'typography'],
    tags: ['css', 'typography', 'fonts', 'text'],
    description: 'Style heading and body text with font-family, text-transform, letter-spacing, line-height, and text-align.',
    instructions: 'Style the two elements:\n  1. `.heading` should have:\n     - `font-family: Georgia, serif`\n     - `text-transform: uppercase`\n     - `letter-spacing: 2px`\n  2. `.body-text` should have:\n     - `line-height: 1.6`\n     - `text-align: justify`',
    starterCode: '/* Style the heading */\n.heading {\n  /* font-family, text-transform, letter-spacing */\n\n}\n\n/* Style the body text */\n.body-text {\n  /* line-height, text-align */\n\n}',
    solution: '.heading {\n  font-family: Georgia, serif;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n}\n\n.body-text {\n  line-height: 1.6;\n  text-align: justify;\n}',
    testRunner: '',
    providedHtml: '<h1 class="heading" id="heading-el">Title</h1><p class="body-text" id="body-el">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    testCases: [
      {
        query: '#heading-el',
        assertion: 'contains',
        property: 'font-family',
        value: 'Georgia',
        description: 'Heading font-family contains Georgia',
      },
      {
        query: '#heading-el',
        assertion: 'equals',
        property: 'text-transform',
        value: 'uppercase',
        description: 'Heading text-transform is uppercase',
      },
      {
        query: '#heading-el',
        assertion: 'equals',
        property: 'letter-spacing',
        value: '2px',
        description: 'Heading letter-spacing is 2px',
      },
      {
        query: '#body-el',
        assertion: 'notEquals',
        property: 'line-height',
        value: 'normal',
        description: 'Body text line-height is not "normal"',
      },
      {
        query: '#body-el',
        assertion: 'equals',
        property: 'text-align',
        value: 'justify',
        description: 'Body text text-align is justify',
      },
    ],
    hint: 'font-family sets the typeface (with fallbacks after commas). text-transform: uppercase makes all letters caps. letter-spacing adds space between characters. line-height controls vertical space between lines. text-align: justify stretches lines to fill the full width.',
    resources: [],
  },

  // ── 355: CSS Units ─────────────────────────────────────────────────────────
  {
    id: 355,
    title: 'CSS Units',
    type: 'css',
    tier: 2,
    category: ['css', 'box-model'],
    tags: ['css', 'units', 'rem', 'viewport', 'sizing'],
    description: 'Practice using rem, percentage, and viewport units.',
    instructions: 'Style three elements using different CSS units:\n  1. `.rem-box` should have `font-size: 2rem`\n  2. `.percent-box` should have `width: 50%`\n  3. `.vh-box` should have `height: 50vh`',
    starterCode: '/* Use different CSS units */\n.rem-box {\n  /* font-size in rem */\n\n}\n\n.percent-box {\n  /* width in percent */\n\n}\n\n.vh-box {\n  /* height in viewport units */\n\n}',
    solution: '.rem-box {\n  font-size: 2rem;\n}\n\n.percent-box {\n  width: 50%;\n}\n\n.vh-box {\n  height: 50vh;\n}',
    testRunner: '',
    providedHtml: '<div class="rem-box" id="rem-el">Rem</div><div class="percent-box" id="pct-el">Percent</div><div class="vh-box" id="vh-el">Viewport</div>',
    testCases: [
      {
        query: '#rem-el',
        assertion: 'sourceMatch',
        value: '2rem',
        description: 'rem-box uses 2rem for font-size',
      },
      {
        query: '#pct-el',
        assertion: 'sourceMatch',
        value: '50%',
        description: 'percent-box uses 50% for width',
      },
      {
        query: '#vh-el',
        assertion: 'sourceMatch',
        value: '50vh',
        description: 'vh-box uses 50vh for height',
      },
    ],
    hint: 'rem is relative to the root element font size (usually 16px, so 2rem = 32px). Percentage is relative to the parent element. vh (viewport height) is a percentage of the browser window height.',
    resources: [],
  },

  // ── 356: Pseudo-elements ───────────────────────────────────────────────────
  {
    id: 356,
    title: 'Pseudo-elements',
    type: 'css',
    tier: 2,
    category: ['css', 'selectors'],
    tags: ['css', 'pseudo-elements', 'before', 'after', 'selectors'],
    description: 'Use ::before and ::after pseudo-elements to add decorative content around text.',
    instructions: 'Add opening and closing quote marks around `.quote` using pseudo-elements:\n  1. `.quote::before` should use the `content` property to insert an opening quote mark (e.g., `"\\201C"` which is a left double quotation mark)\n  2. `.quote::after` should use `content` to insert a closing quote mark (e.g., `"\\201D"`)\n\nThe content property is required for pseudo-elements to appear.',
    starterCode: '/* Add quote marks using pseudo-elements */\n.quote::before {\n  /* Insert opening quote using content */\n\n}\n\n.quote::after {\n  /* Insert closing quote using content */\n\n}',
    solution: '.quote::before {\n  content: "\\201C";\n}\n\n.quote::after {\n  content: "\\201D";\n}',
    testRunner: '',
    providedHtml: '<p class="quote" id="quote-el">To be or not to be</p>',
    testCases: [
      {
        query: '.quote',
        assertion: 'sourceMatch',
        value: '::before',
        description: 'CSS uses ::before pseudo-element',
      },
      {
        query: '.quote',
        assertion: 'sourceMatch',
        value: '::after',
        description: 'CSS uses ::after pseudo-element',
      },
      {
        query: '.quote',
        assertion: 'sourceMatch',
        value: 'content',
        description: 'CSS uses the content property',
      },
    ],
    hint: '::before and ::after create virtual elements as the first/last child of the selected element. They MUST have the content property set (even if it is just content: "") or they will not appear. Use content: "\\201C" for a left curly quote and "\\201D" for a right curly quote.',
    resources: [],
  },

  // ── 357: CSS Combinators ───────────────────────────────────────────────────
  {
    id: 357,
    title: 'CSS Combinators',
    type: 'css',
    tier: 2,
    category: ['css', 'selectors'],
    tags: ['css', 'selectors', 'combinators', 'specificity'],
    description: 'Practice descendant, child, and adjacent sibling CSS combinators.',
    instructions: 'Write CSS rules using three different combinators:\n  1. **Descendant**: `.list li` \u2014 set `color` to `#1e40af` (rgb(30, 64, 175))\n  2. **Child**: `.list > li` \u2014 set `font-weight` to `bold`\n  3. **Adjacent sibling**: `.title + p` \u2014 set `margin-top` to `8px`\n\nThe descendant selector targets all nested `<li>` elements. The child selector targets only direct children. The adjacent sibling selector targets the `<p>` immediately after `.title`.',
    starterCode: '/* Descendant combinator */\n.list li {\n  /* color */\n\n}\n\n/* Child combinator */\n.list > li {\n  /* font-weight */\n\n}\n\n/* Adjacent sibling combinator */\n.title + p {\n  /* margin-top */\n\n}',
    solution: '.list li {\n  color: #1e40af;\n}\n\n.list > li {\n  font-weight: bold;\n}\n\n.title + p {\n  margin-top: 8px;\n}',
    testRunner: '',
    providedHtml: '<h2 class="title" id="title-el">Title</h2><p id="sibling-el">First paragraph</p><ul class="list" id="list-el"><li id="direct-li">Item<ul><li id="nested-li">Nested</li></ul></li></ul>',
    testCases: [
      {
        query: '.list',
        assertion: 'sourceMatch',
        value: '.list li',
        description: 'Uses descendant combinator .list li',
      },
      {
        query: '.list',
        assertion: 'sourceMatch',
        value: '.list > li',
        description: 'Uses child combinator .list > li',
      },
      {
        query: '.title',
        assertion: 'sourceMatch',
        value: '.title',
        description: 'Uses adjacent sibling combinator with .title',
      },
    ],
    hint: 'A space between selectors is the descendant combinator (matches all nested elements). The > is the child combinator (direct children only). The + is the adjacent sibling combinator (the very next sibling element).',
    resources: [],
  },

  // ── 358: Transitions ──────────────────────────────────────────────────────
  {
    id: 358,
    title: 'Transitions',
    type: 'css',
    tier: 2,
    category: ['css', 'transitions'],
    tags: ['css', 'transitions', 'hover', 'animation'],
    description: 'Add a smooth colour transition to a button on hover.',
    instructions: 'Style the `.btn` element:\n  1. Default state: `background-color: #3b82f6` and a `transition` on `background-color` lasting `0.3s`\n  2. Hover state (`.btn:hover`): `background-color: #1d4ed8`\n\nThe transition property makes the colour change animate smoothly instead of snapping instantly.',
    starterCode: '/* Style the button with a transition */\n.btn {\n  /* background-color and transition */\n\n}\n\n.btn:hover {\n  /* background-color on hover */\n\n}',
    solution: '.btn {\n  background-color: #3b82f6;\n  transition: background-color 0.3s;\n}\n\n.btn:hover {\n  background-color: #1d4ed8;\n}',
    testRunner: '',
    providedHtml: '<button class="btn" id="btn-el">Click Me</button>',
    testCases: [
      {
        query: '#btn-el',
        assertion: 'equals',
        property: 'background-color',
        value: 'rgb(59, 130, 246)',
        description: 'Button background-color is #3b82f6',
      },
      {
        query: '.btn',
        assertion: 'sourceMatch',
        value: 'transition',
        description: 'CSS uses the transition property',
      },
      {
        query: '.btn',
        assertion: 'sourceMatch',
        value: ':hover',
        description: 'CSS defines a :hover state',
      },
    ],
    hint: 'The transition shorthand is: transition: <property> <duration>. Put it on the default state (not the hover). The browser will then animate between the default and hover background-color values over 0.3 seconds.',
    resources: [],
  },

  // ── 359: Shadows and Borders ──────────────────────────────────────────────
  {
    id: 359,
    title: 'Shadows and Borders',
    type: 'css',
    tier: 2,
    category: ['css', 'box-model'],
    tags: ['css', 'shadows', 'borders', 'box-model'],
    description: 'Style a card with box-shadow, border-radius, border, and a text-shadow on its content.',
    instructions: 'Style two elements:\n  1. `.card` should have:\n     - `box-shadow` (any visible shadow, e.g., `0 4px 6px rgba(0,0,0,0.3)`)\n     - `border-radius: 12px`\n     - `border: 2px solid #334155`\n  2. `.text` should have a `text-shadow` (any visible shadow, e.g., `1px 1px 2px rgba(0,0,0,0.5)`)',
    starterCode: '/* Style the card */\n.card {\n  /* box-shadow, border-radius, border */\n\n}\n\n/* Style the text */\n.text {\n  /* text-shadow */\n\n}',
    solution: '.card {\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);\n  border-radius: 12px;\n  border: 2px solid #334155;\n}\n\n.text {\n  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);\n}',
    testRunner: '',
    providedHtml: '<div class="card" id="card-el"><p class="text" id="text-el">Shadow Box</p></div>',
    testCases: [
      {
        query: '#card-el',
        assertion: 'equals',
        property: 'border-radius',
        value: '12px',
        description: 'Card border-radius is 12px',
      },
      {
        query: '.card',
        assertion: 'sourceMatch',
        value: 'box-shadow',
        description: 'CSS uses box-shadow on the card',
      },
      {
        query: '.text',
        assertion: 'sourceMatch',
        value: 'text-shadow',
        description: 'CSS uses text-shadow on the text',
      },
    ],
    hint: 'box-shadow syntax: x-offset y-offset blur-radius color (e.g., 0 4px 6px rgba(0,0,0,0.3)). border-radius rounds the corners. text-shadow uses the same offset/blur/color pattern but applies to text instead of the box.',
    resources: [],
  },
];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} HTML & CSS Tier 2 exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

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
console.log(`  By type: ${Object.entries(typeCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  By subcategory: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
