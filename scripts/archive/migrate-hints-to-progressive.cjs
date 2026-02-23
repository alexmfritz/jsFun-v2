/**
 * migrate-hints-to-progressive.cjs
 *
 * Converts the single `hint` string on each exercise into a progressive
 * `hints` array of up to 3 strings:
 *
 *   hints[0] = Nudge      — light conceptual pointer (what tool/concept)
 *   hints[1] = Approach    — the existing hint (strategy, not code)
 *   hints[2] = Near-solution — specific structure/method guidance
 *
 * The existing `hint` field is preserved for backward compatibility but
 * marked deprecated in the type system.
 *
 * Strategy:
 *   - Hint 1 is auto-generated from exercise metadata (type, tags, title,
 *     solution keywords). It should feel like a nudge: "Think about…" or
 *     "Consider using…"
 *   - Hint 2 is the existing hint text (already at the right level).
 *   - Hint 3 is auto-generated from the solution, naming specific methods
 *     and describing the structure without giving the code.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract method/keyword calls from JS code.
 * Returns unique method names found in the solution.
 */
function extractJsMethods(code) {
  const methods = new Set();
  // .method() calls
  const dotCalls = code.match(/\.([a-zA-Z_$][\w$]*)\s*\(/g) || [];
  dotCalls.forEach(m => {
    const name = m.replace(/^\./, '').replace(/\s*\($/, '');
    if (!['log', 'error', 'warn', 'toString', 'valueOf'].includes(name)) {
      methods.add(name);
    }
  });
  // Standalone function calls
  const standaloneCalls = code.match(/\b(Math\.\w+|Object\.\w+|Array\.\w+|String\.\w+|JSON\.\w+|parseInt|parseFloat|isNaN|typeof|instanceof|new\s+\w+)\b/g) || [];
  standaloneCalls.forEach(m => methods.add(m.trim()));
  // Keywords
  const keywords = [];
  if (/\bfor\s*\(/.test(code)) keywords.push('for loop');
  if (/\bwhile\s*\(/.test(code)) keywords.push('while loop');
  if (/\bfor\s*\(\s*(?:const|let|var)\s+\w+\s+of\b/.test(code)) keywords.push('for...of');
  if (/\bfor\s*\(\s*(?:const|let|var)\s+\w+\s+in\b/.test(code)) keywords.push('for...in');
  if (/=>\s*[{(]?/.test(code)) keywords.push('arrow function');
  if (/\bclass\b/.test(code)) keywords.push('class');
  if (/\bextends\b/.test(code)) keywords.push('extends');
  if (/\bsuper\b/.test(code)) keywords.push('super');
  if (/\bthis\b/.test(code)) keywords.push('this');
  if (/\breturn\b/.test(code)) keywords.push('return');
  if (/\.prototype\b/.test(code)) keywords.push('prototype');
  if (/\bspread\b|\.\.\./.test(code)) keywords.push('spread operator');
  if (/\bdestructur|const\s*\{/.test(code)) keywords.push('destructuring');
  if (/\bnew\s+RegExp|\/[^/]+\/[gimsuy]*/.test(code)) keywords.push('regex');
  if (/\btry\s*{/.test(code)) keywords.push('try/catch');
  if (/\bPromise\b|\basync\b|\bawait\b/.test(code)) keywords.push('async/await');
  if (/\bSet\b/.test(code)) keywords.push('Set');
  if (/\bMap\b/.test(code)) keywords.push('Map');
  if (/\brecurs|function\s+\w+[^}]*\b\1\s*\(/.test(code)) keywords.push('recursion');

  return { methods: [...methods], keywords };
}

/**
 * Extract CSS properties/selectors from CSS code.
 */
function extractCssDetails(code) {
  const properties = new Set();
  const propMatches = code.match(/[\w-]+\s*:/g) || [];
  propMatches.forEach(p => properties.add(p.replace(/\s*:$/, '').trim()));

  const selectors = new Set();
  const selectorMatches = code.match(/[^{}]+(?=\s*\{)/g) || [];
  selectorMatches.forEach(s => {
    const cleaned = s.trim();
    if (cleaned && !cleaned.startsWith('@') && cleaned.length < 60) {
      selectors.add(cleaned);
    }
  });

  return { properties: [...properties], selectors: [...selectors] };
}

/**
 * Extract HTML elements/attributes from HTML code.
 */
function extractHtmlDetails(code) {
  const elements = new Set();
  const elMatches = code.match(/<(\w+)[\s>]/g) || [];
  elMatches.forEach(m => {
    const tag = m.replace(/^</, '').replace(/[\s>]$/, '');
    if (!['div', 'span', 'br', 'p'].includes(tag)) {
      elements.add(tag);
    }
  });

  const attributes = new Set();
  const attrMatches = code.match(/\s(\w+)="/g) || [];
  attrMatches.forEach(m => {
    const attr = m.trim().replace(/="$/, '');
    if (!['class', 'id'].includes(attr)) {
      attributes.add(attr);
    }
  });

  return { elements: [...elements], attributes: [...attributes] };
}

// ─── Tag-based concept mapping ───────────────────────────────────────────────

const TAG_CONCEPTS = {
  'arrays': 'array methods',
  'strings': 'string methods',
  'objects': 'object manipulation',
  'loops': 'loops and iteration',
  'conditionals': 'conditional logic',
  'functions': 'function composition',
  'oop': 'object-oriented patterns',
  'class': 'ES6 class syntax',
  'higher-order': 'higher-order functions',
  'reduce': 'the reduce method',
  'map': 'the map method',
  'filter': 'the filter method',
  'scope': 'scope and closures',
  'context': 'execution context (this)',
  'callbacks': 'callback functions',
  'closure': 'closures',
  'inheritance': 'prototype inheritance',
  'composition': 'function composition',
  'accumulator': 'the accumulator pattern',
  'recursion': 'recursive thinking',
  'sorting': 'sorting algorithms',
  'searching': 'search algorithms',
  'two-pointer': 'the two-pointer technique',
  'sliding-window': 'the sliding window pattern',
  'frequency-counter': 'the frequency counter pattern',
  'backtracking': 'backtracking',
  'regex': 'regular expressions',
  'validation': 'input validation',
  'extraction': 'pattern extraction',
  'dom': 'DOM manipulation',
  'events': 'event handling',
  'selection': 'DOM selection',
  'manipulation': 'DOM manipulation',
  'traversal': 'DOM traversal',
  'delegation': 'event delegation',
  'flexbox': 'CSS Flexbox',
  'grid': 'CSS Grid',
  'positioning': 'CSS positioning',
  'typography': 'CSS typography',
  'animation': 'CSS transitions/animations',
  'responsive': 'responsive design',
  'semantics': 'semantic HTML',
  'forms': 'HTML forms',
  'tables': 'HTML tables',
  'accessibility': 'accessibility (a11y)',
  'selectors': 'CSS selectors',
  'layout': 'CSS layout',
  'variables': 'variables and data types',
  'operators': 'JavaScript operators',
  'math': 'mathematical operations',
  'es6': 'ES6+ features',
  'methods': 'built-in methods',
  'spread': 'spread/rest operators',
  'destructuring': 'destructuring',
  'template-literals': 'template literals',
  'no-built-ins': 'manual implementation (no built-in methods)',
};

// ─── Generate Hint 1 (Nudge) ────────────────────────────────────────────────

function generateNudge(exercise) {
  const { type, tags, title, solution } = exercise;
  const prefixes = [
    'Think about',
    'Consider using',
    'This exercise involves',
    'Look into',
    'Start by thinking about',
  ];

  // Find the two most relevant concepts from tags (skip generic ones)
  const skipTags = new Set(['beginner', 'intermediate', 'advanced', 'no-built-ins', 'nested-loops']);
  const concepts = [];
  for (const tag of tags) {
    if (skipTags.has(tag)) continue;
    if (TAG_CONCEPTS[tag]) {
      concepts.push(TAG_CONCEPTS[tag]);
      if (concepts.length >= 2) break;
    }
  }

  // Fallback: derive from type
  if (concepts.length === 0) {
    if (type === 'js') concepts.push('JavaScript fundamentals');
    else if (type === 'css') concepts.push('CSS properties and values');
    else if (type === 'html') concepts.push('HTML elements and structure');
    else if (type === 'html-css') concepts.push('HTML structure and CSS styling');
  }

  // For JS exercises, try to extract a key method from the solution for a more specific nudge
  if (type === 'js') {
    const { methods } = extractJsMethods(solution);
    const keyMethod = methods.find(m =>
      ['reduce', 'map', 'filter', 'sort', 'find', 'every', 'some', 'forEach',
       'split', 'join', 'slice', 'splice', 'indexOf', 'includes', 'replace',
       'match', 'test', 'assign', 'keys', 'values', 'entries', 'flat',
       'flatMap', 'from', 'isArray', 'charAt', 'charCodeAt', 'repeat',
       'padStart', 'padEnd', 'trim', 'startsWith', 'endsWith',
       'Math.floor', 'Math.ceil', 'Math.max', 'Math.min', 'Math.abs',
       'Math.pow', 'Math.sqrt', 'Math.round', 'Math.random',
       'parseInt', 'parseFloat', 'JSON.stringify', 'JSON.parse',
       'Object.keys', 'Object.values', 'Object.entries', 'Object.assign',
       'Array.from', 'Array.isArray'
      ].includes(m)
    );
    if (keyMethod) {
      // Vary the phrasing
      const methodPhrases = [
        `The \`${keyMethod}\` method will be helpful here.`,
        `Consider how \`${keyMethod}\` works.`,
        `Look into \`${keyMethod}\` for this problem.`,
        `\`${keyMethod}\` is a key tool for this exercise.`,
        `Think about what \`${keyMethod}\` returns.`,
      ];
      return methodPhrases[exercise.id % methodPhrases.length];
    }
  }

  // For CSS, try to name a key property
  if (type === 'css' || type === 'html-css') {
    const { properties } = extractCssDetails(solution);
    const keyProp = properties.find(p =>
      ['display', 'flex-direction', 'justify-content', 'align-items', 'grid-template-columns',
       'grid-template-rows', 'grid-template-areas', 'position', 'transform', 'transition',
       'animation', 'font-family', 'font-size', 'line-height', 'text-align', 'text-decoration',
       'background', 'background-color', 'border', 'border-radius', 'box-shadow',
       'opacity', 'overflow', 'z-index', 'gap', 'flex-wrap', 'grid-area',
       'media', 'hover', 'nth-child', 'var(--', 'custom-property'
      ].includes(p)
    );
    if (keyProp) {
      return `The \`${keyProp}\` property is central to this exercise.`;
    }
  }

  // Pick a prefix based on exercise id for variety
  const prefix = prefixes[exercise.id % prefixes.length];
  const concept = concepts.length > 1 ? `${concepts[0]} and ${concepts[1]}` : concepts[0];
  return `${prefix} ${concept}.`;
}

// ─── Generate Hint 3 (Near-solution) ─────────────────────────────────────────

function generateNearSolution(exercise) {
  const { type, solution, hint } = exercise;

  if (type === 'js') {
    return generateJsNearSolution(exercise);
  } else if (type === 'css') {
    return generateCssNearSolution(exercise);
  } else if (type === 'html') {
    return generateHtmlNearSolution(exercise);
  } else if (type === 'html-css') {
    return generateHtmlCssNearSolution(exercise);
  }

  // Fallback
  return `Review the structure of your ${type} code carefully. The solution follows directly from the approach described in Hint 2.`;
}

function generateJsNearSolution(exercise) {
  const { solution, tags } = exercise;
  const { methods, keywords } = extractJsMethods(solution);

  const parts = [];

  // Describe key methods used
  const importantMethods = methods
    .filter(m => !['length', 'push', 'pop', 'constructor'].includes(m))
    .slice(0, 3);

  if (importantMethods.length > 0) {
    const formatted = importantMethods.map(m => `\`${m}\``).join(', ');
    parts.push(`Key method(s): ${formatted}`);
  }

  // Describe structure
  if (keywords.includes('recursion') || /function\s+\w+[\s\S]*\b\w+\(/.test(solution)) {
    if (solution.match(/function\s+(\w+)/)?.[1] && new RegExp(solution.match(/function\s+(\w+)/)[1] + '\\s*\\(').test(solution.replace(/function\s+\w+/, ''))) {
      parts.push('The function calls itself recursively');
    }
  }

  if (keywords.includes('for loop') && keywords.includes('return')) {
    parts.push('Use a loop to iterate, then return the accumulated result');
  } else if (importantMethods.includes('reduce')) {
    parts.push('The accumulator should track the running result through each iteration');
  } else if (importantMethods.includes('filter') && importantMethods.includes('map')) {
    parts.push('Chain filter first to narrow down elements, then map to transform');
  } else if (importantMethods.includes('map')) {
    parts.push('Map each element to its transformed value');
  } else if (importantMethods.includes('filter')) {
    parts.push('Filter elements that match your condition');
  }

  // Return type hint — be careful with methods like every/some that return booleans
  const returnsBool = /return\s+(true|false)\b/.test(solution) ||
    /\.every\(/.test(solution) || /\.some\(/.test(solution) ||
    /\.includes\(/.test(solution) || /\.has\(/.test(solution) ||
    /return\s+!/.test(solution);
  const returnsString = /return\s+['"`]/.test(solution) || /\.join\(/.test(solution);
  // Check if any returned variable is initialized as an array
  const returnedVar = solution.match(/return\s+(\w+)\s*;/)?.[1];
  const varIsArray = returnedVar && new RegExp(`(const|let|var)\\s+${returnedVar}\\s*=\\s*\\[`).test(solution);
  const returnsArray = /return\s+\[/.test(solution) || varIsArray ||
    (/\.map\(/.test(solution) && !/\.map\([\s\S]*\.join\(/.test(solution));
  const returnsNumber = !returnsArray && (/return\s+\d/.test(solution) ||
    /return\s+(count|sum|total|max|min|index|length)\b/.test(solution));
  const returnsObject = /return\s+\{/.test(solution);

  if (returnsBool) {
    parts.push('The function should return a boolean');
  } else if (returnsArray) {
    parts.push('The function should return an array');
  } else if (returnsObject) {
    parts.push('The function should return an object');
  } else if (returnsString) {
    parts.push('The function should return a string');
  } else if (returnsNumber) {
    parts.push('The function should return a number');
  }

  if (parts.length === 0) {
    // Generic fallback based on tags
    if (tags.includes('no-built-ins')) {
      parts.push('Build the logic step by step without relying on built-in methods');
    } else {
      parts.push('Break the problem into smaller steps and handle edge cases');
    }
  }

  return parts.join('. ') + '.';
}

function generateCssNearSolution(exercise) {
  const { solution } = exercise;
  const { properties, selectors } = extractCssDetails(solution);

  const parts = [];

  // Name key CSS properties
  const importantProps = properties
    .filter(p => !['color', 'margin', 'padding'].includes(p))
    .slice(0, 4);

  if (importantProps.length > 0) {
    const formatted = importantProps.map(p => `\`${p}\``).join(', ');
    parts.push(`Key properties: ${formatted}`);
  }

  // Name key selectors if interesting
  const interestingSelectors = selectors.filter(s =>
    s.includes(':') || s.includes('>') || s.includes('+') || s.includes('~') || s.includes('[')
  ).slice(0, 2);

  if (interestingSelectors.length > 0) {
    const formatted = interestingSelectors.map(s => `\`${s.trim()}\``).join(', ');
    parts.push(`Consider selectors like ${formatted}`);
  }

  if (parts.length === 0) {
    parts.push('Focus on the specific CSS properties that control the visual effect described in the instructions');
  }

  return parts.join('. ') + '.';
}

function generateHtmlNearSolution(exercise) {
  const { solution } = exercise;
  const { elements, attributes } = extractHtmlDetails(solution);

  const parts = [];

  const importantElements = elements.slice(0, 4);
  if (importantElements.length > 0) {
    const formatted = importantElements.map(e => `\`<${e}>\``).join(', ');
    parts.push(`Key elements: ${formatted}`);
  }

  const importantAttrs = attributes.slice(0, 3);
  if (importantAttrs.length > 0) {
    const formatted = importantAttrs.map(a => `\`${a}\``).join(', ');
    parts.push(`Important attributes: ${formatted}`);
  }

  if (parts.length === 0) {
    parts.push('Focus on using the correct semantic HTML elements and their required attributes');
  }

  return parts.join('. ') + '.';
}

function generateHtmlCssNearSolution(exercise) {
  const { solution } = exercise;
  // HTML+CSS solutions have both HTML and CSS
  const htmlPart = generateHtmlNearSolution(exercise);
  const cssPart = generateCssNearSolution(exercise);

  // Combine, keeping it concise
  if (htmlPart.length + cssPart.length < 200) {
    return `HTML: ${htmlPart} CSS: ${cssPart}`;
  }
  // Just use whichever is more informative
  return htmlPart.length > cssPart.length ? htmlPart : cssPart;
}

// ─── Main Migration ──────────────────────────────────────────────────────────

let migrated = 0;
let skipped = 0;

for (const exercise of data.exercises) {
  if (!exercise.hint || !exercise.hint.trim()) {
    // No hint to migrate — set empty hints array
    exercise.hints = [];
    skipped++;
    continue;
  }

  const nudge = generateNudge(exercise);
  const approach = exercise.hint.trim();
  const nearSolution = generateNearSolution(exercise);

  exercise.hints = [nudge, approach, nearSolution];
  migrated++;
}

// ─── Write back ──────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`\nMigrated ${migrated} exercises to progressive hints`);
console.log(`Skipped ${skipped} exercises (no hint)`);

// ─── Verification ────────────────────────────────────────────────────────────

const verify = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let withHints = 0;
let hint1Lengths = [];
let hint2Lengths = [];
let hint3Lengths = [];

for (const ex of verify.exercises) {
  if (ex.hints && ex.hints.length === 3) {
    withHints++;
    hint1Lengths.push(ex.hints[0].length);
    hint2Lengths.push(ex.hints[1].length);
    hint3Lengths.push(ex.hints[2].length);
  }
}

const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

console.log(`\nVerification:`);
console.log(`  Exercises with 3 hints: ${withHints}`);
console.log(`  Hint 1 (nudge) avg length: ${avg(hint1Lengths)} chars`);
console.log(`  Hint 2 (approach) avg length: ${avg(hint2Lengths)} chars`);
console.log(`  Hint 3 (near-solution) avg length: ${avg(hint3Lengths)} chars`);

// Show a few examples
console.log(`\nSample outputs:`);
[1, 50, 150, 297, 345].forEach(id => {
  const ex = verify.exercises.find(e => e.id === id);
  if (!ex || !ex.hints) return;
  console.log(`\n  ID ${id} (${ex.title}):`);
  console.log(`    Hint 1: ${ex.hints[0]}`);
  console.log(`    Hint 2: ${ex.hints[1]}`);
  console.log(`    Hint 3: ${ex.hints[2]}`);
});

console.log('\nDone.');
