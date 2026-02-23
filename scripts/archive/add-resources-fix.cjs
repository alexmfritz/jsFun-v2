/**
 * Add MDN resource links to all exercises that have empty resources arrays.
 * Uses exercise tags, category, type, and title/instructions to pick relevant MDN links.
 */
const fs = require('fs');
const path = require('path');

const EXERCISES_FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(EXERCISES_FILE, 'utf-8'));

// MDN resource library — maps keywords/tags to MDN resources
const MDN = {
  // Primitives & operators
  variables: { label: 'MDN: var, let, const', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations', description: 'Variable declarations in JavaScript' },
  datatypes: { label: 'MDN: Data types', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures', description: 'JavaScript data structures and types' },
  operators: { label: 'MDN: Expressions and operators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators', description: 'JavaScript expressions and operators' },
  modulo: { label: 'MDN: Remainder (%)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder', description: 'The remainder operator' },
  ternary: { label: 'MDN: Conditional (ternary) operator', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator', description: 'The conditional ternary operator' },
  typeof: { label: 'MDN: typeof', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof', description: 'The typeof operator' },

  // Control flow
  conditionals: { label: 'MDN: if...else', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else', description: 'The if...else statement' },
  switch: { label: 'MDN: switch', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch', description: 'The switch statement' },
  loops: { label: 'MDN: Loops and iteration', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration', description: 'JavaScript loops and iteration' },
  forLoop: { label: 'MDN: for', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for', description: 'The for statement' },
  whileLoop: { label: 'MDN: while', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while', description: 'The while statement' },

  // Strings
  string: { label: 'MDN: String', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String', description: 'JavaScript String reference' },
  charAt: { label: 'MDN: String.prototype.charAt()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt', description: 'The charAt method' },
  includes_str: { label: 'MDN: String.prototype.includes()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes', description: 'The String includes method' },
  indexOf_str: { label: 'MDN: String.prototype.indexOf()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf', description: 'The String indexOf method' },
  lastIndexOf_str: { label: 'MDN: String.prototype.lastIndexOf()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf', description: 'The String lastIndexOf method' },
  repeat_str: { label: 'MDN: String.prototype.repeat()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat', description: 'The String repeat method' },
  slice_str: { label: 'MDN: String.prototype.slice()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice', description: 'The String slice method' },
  split: { label: 'MDN: String.prototype.split()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split', description: 'The String split method' },
  replace: { label: 'MDN: String.prototype.replace()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace', description: 'The String replace method' },
  toLowerCase: { label: 'MDN: String.prototype.toLowerCase()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase', description: 'The toLowerCase method' },
  toUpperCase: { label: 'MDN: String.prototype.toUpperCase()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase', description: 'The toUpperCase method' },
  trim: { label: 'MDN: String.prototype.trim()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim', description: 'The trim method' },
  templateLiterals: { label: 'MDN: Template literals', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals', description: 'Template literal syntax' },
  regex: { label: 'MDN: Regular expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions', description: 'Regular expressions guide' },

  // Arrays
  array: { label: 'MDN: Array', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', description: 'JavaScript Array reference' },
  push: { label: 'MDN: Array.prototype.push()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push', description: 'The push method' },
  pop: { label: 'MDN: Array.prototype.pop()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop', description: 'The pop method' },
  map: { label: 'MDN: Array.prototype.map()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', description: 'The map method' },
  filter: { label: 'MDN: Array.prototype.filter()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter', description: 'The filter method' },
  reduce: { label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', description: 'The reduce method' },
  forEach: { label: 'MDN: Array.prototype.forEach()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach', description: 'The forEach method' },
  find: { label: 'MDN: Array.prototype.find()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find', description: 'The find method' },
  some: { label: 'MDN: Array.prototype.some()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some', description: 'The some method' },
  every: { label: 'MDN: Array.prototype.every()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every', description: 'The every method' },
  sort: { label: 'MDN: Array.prototype.sort()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort', description: 'The sort method' },
  flat: { label: 'MDN: Array.prototype.flat()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat', description: 'The flat method' },
  flatMap: { label: 'MDN: Array.prototype.flatMap()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap', description: 'The flatMap method' },
  includes_arr: { label: 'MDN: Array.prototype.includes()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes', description: 'The Array includes method' },
  indexOf_arr: { label: 'MDN: Array.prototype.indexOf()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf', description: 'The Array indexOf method' },
  join: { label: 'MDN: Array.prototype.join()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join', description: 'The join method' },
  slice_arr: { label: 'MDN: Array.prototype.slice()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice', description: 'The Array slice method' },
  splice: { label: 'MDN: Array.prototype.splice()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice', description: 'The splice method' },
  concat: { label: 'MDN: Array.prototype.concat()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat', description: 'The concat method' },
  spread: { label: 'MDN: Spread syntax', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax', description: 'The spread syntax (...)' },
  destructuring: { label: 'MDN: Destructuring assignment', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment', description: 'Destructuring assignment' },

  // Objects
  object: { label: 'MDN: Object', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object', description: 'JavaScript Object reference' },
  keys: { label: 'MDN: Object.keys()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys', description: 'The Object.keys method' },
  values: { label: 'MDN: Object.values()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values', description: 'The Object.values method' },
  entries: { label: 'MDN: Object.entries()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries', description: 'The Object.entries method' },
  hasOwnProperty: { label: 'MDN: Object.prototype.hasOwnProperty()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty', description: 'The hasOwnProperty method' },
  assign: { label: 'MDN: Object.assign()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign', description: 'The Object.assign method' },
  freeze: { label: 'MDN: Object.freeze()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze', description: 'The Object.freeze method' },

  // Functions
  functions: { label: 'MDN: Functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', description: 'JavaScript functions guide' },
  arrowFunctions: { label: 'MDN: Arrow functions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions', description: 'Arrow function expressions' },
  closures: { label: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', description: 'Understanding closures' },
  recursion: { label: 'MDN: Functions (recursion)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#recursion', description: 'Recursion in JavaScript' },
  defaultParams: { label: 'MDN: Default parameters', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters', description: 'Default parameter values' },
  restParams: { label: 'MDN: Rest parameters', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters', description: 'Rest parameters syntax' },
  callbacks: { label: 'MDN: Callback function', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function', description: 'Callback functions explained' },

  // OOP / Classes
  classes: { label: 'MDN: Classes', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes', description: 'JavaScript classes reference' },
  constructor: { label: 'MDN: constructor', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor', description: 'The constructor method' },
  extends: { label: 'MDN: extends', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends', description: 'Class inheritance with extends' },
  prototypes: { label: 'MDN: Prototypal inheritance', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain', description: 'Inheritance and the prototype chain' },
  gettersSetters: { label: 'MDN: get/set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get', description: 'Getter and setter methods' },
  staticMethods: { label: 'MDN: static', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static', description: 'Static methods and properties' },
  this: { label: 'MDN: this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this', description: 'The this keyword' },

  // Async
  promises: { label: 'MDN: Promise', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise', description: 'JavaScript Promise reference' },
  asyncAwait: { label: 'MDN: async function', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function', description: 'The async function declaration' },
  setTimeout: { label: 'MDN: setTimeout()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/setTimeout', description: 'The setTimeout function' },
  setInterval: { label: 'MDN: setInterval()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/setInterval', description: 'The setInterval function' },

  // Error handling
  tryCatch: { label: 'MDN: try...catch', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch', description: 'The try...catch statement' },
  errorTypes: { label: 'MDN: Error', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error', description: 'JavaScript Error reference' },

  // Data structures
  map_ds: { label: 'MDN: Map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map', description: 'JavaScript Map reference' },
  set_ds: { label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set', description: 'JavaScript Set reference' },
  json: { label: 'MDN: JSON', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON', description: 'JavaScript JSON reference' },
  weakMap: { label: 'MDN: WeakMap', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap', description: 'JavaScript WeakMap reference' },
  symbol: { label: 'MDN: Symbol', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol', description: 'JavaScript Symbol reference' },
  iterators: { label: 'MDN: Iteration protocols', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols', description: 'Iteration protocols in JavaScript' },
  generators: { label: 'MDN: function*', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*', description: 'Generator functions' },
  proxy: { label: 'MDN: Proxy', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy', description: 'JavaScript Proxy reference' },

  // Math
  math: { label: 'MDN: Math', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math', description: 'JavaScript Math reference' },
  mathFloor: { label: 'MDN: Math.floor()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor', description: 'The Math.floor method' },
  mathRound: { label: 'MDN: Math.round()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round', description: 'The Math.round method' },
  mathAbs: { label: 'MDN: Math.abs()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs', description: 'The Math.abs method' },
  mathPow: { label: 'MDN: Math.pow()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow', description: 'The Math.pow method' },
  mathMax: { label: 'MDN: Math.max()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max', description: 'The Math.max method' },
  mathMin: { label: 'MDN: Math.min()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min', description: 'The Math.min method' },
  mathSqrt: { label: 'MDN: Math.sqrt()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt', description: 'The Math.sqrt method' },

  // DOM
  dom: { label: 'MDN: DOM Introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction', description: 'Introduction to the DOM' },
  createElement: { label: 'MDN: Document.createElement()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement', description: 'The createElement method' },
  querySelector: { label: 'MDN: Document.querySelector()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector', description: 'The querySelector method' },
  events: { label: 'MDN: Events', url: 'https://developer.mozilla.org/en-US/docs/Web/Events', description: 'Event reference' },
  addEventListener: { label: 'MDN: addEventListener()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener', description: 'The addEventListener method' },

  // HTML
  html: { label: 'MDN: HTML elements reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', description: 'HTML elements reference' },
  forms: { label: 'MDN: HTML forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms', description: 'Web forms guide' },
  semanticHTML: { label: 'MDN: Semantics in HTML', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html', description: 'HTML semantic elements' },
  tables: { label: 'MDN: HTML table', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table', description: 'HTML table element' },
  images: { label: 'MDN: <img>', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img', description: 'HTML image element' },
  links: { label: 'MDN: <a>', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a', description: 'HTML anchor element' },
  lists: { label: 'MDN: <ul>, <ol>', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul', description: 'HTML list elements' },
  aria: { label: 'MDN: ARIA', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA', description: 'ARIA accessibility reference' },

  // CSS
  css: { label: 'MDN: CSS reference', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference', description: 'CSS reference' },
  cssSelectors: { label: 'MDN: CSS selectors', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors', description: 'CSS selectors reference' },
  flexbox: { label: 'MDN: Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout', description: 'CSS Flexbox layout' },
  grid: { label: 'MDN: CSS Grid', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout', description: 'CSS Grid layout' },
  positioning: { label: 'MDN: position', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position', description: 'CSS position property' },
  display: { label: 'MDN: display', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/display', description: 'CSS display property' },
  boxModel: { label: 'MDN: Box model', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model', description: 'CSS box model' },
  transitions: { label: 'MDN: CSS transitions', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions', description: 'CSS transitions' },
  animations: { label: 'MDN: CSS animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations', description: 'CSS animations' },
  mediaQueries: { label: 'MDN: Media queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries', description: 'CSS media queries' },
  customProperties: { label: 'MDN: Custom properties (CSS variables)', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties', description: 'CSS custom properties' },
  pseudoClasses: { label: 'MDN: Pseudo-classes', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes', description: 'CSS pseudo-classes' },
  pseudoElements: { label: 'MDN: Pseudo-elements', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements', description: 'CSS pseudo-elements' },
  specificity: { label: 'MDN: Specificity', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity', description: 'CSS specificity' },
  gradients: { label: 'MDN: CSS gradients', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_images/Using_CSS_gradients', description: 'Using CSS gradients' },
  shadows: { label: 'MDN: box-shadow', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow', description: 'CSS box-shadow property' },
  units: { label: 'MDN: CSS values and units', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units', description: 'CSS values and units' },
  typography: { label: 'MDN: Fundamental text and font styling', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals', description: 'CSS text and font styling' },
  combinators: { label: 'MDN: CSS combinators', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators', description: 'CSS combinators' },
  nthChild: { label: 'MDN: :nth-child()', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child', description: 'CSS :nth-child pseudo-class' },
};

/**
 * Given an exercise, determine 2-3 relevant MDN resource entries.
 */
function getResourcesForExercise(ex) {
  const resources = [];
  const title = (ex.title || '').toLowerCase();
  const desc = (ex.description || '').toLowerCase();
  const instr = (ex.instructions || '').toLowerCase();
  const tags = (ex.tags || []).map(t => t.toLowerCase());
  const catPath = (ex.category || []).map(c => c.toLowerCase());
  const all = title + ' ' + desc + ' ' + instr + ' ' + tags.join(' ') + ' ' + catPath.join(' ');

  // HTML exercises
  if (ex.type === 'html' || ex.type === 'html-css') {
    resources.push(MDN.html);
    if (all.includes('form') || all.includes('input') || all.includes('select') || all.includes('radio') || all.includes('checkbox')) resources.push(MDN.forms);
    if (all.includes('table')) resources.push(MDN.tables);
    if (all.includes('list') || all.includes('<ul') || all.includes('<ol')) resources.push(MDN.lists);
    if (all.includes('image') || all.includes('<img')) resources.push(MDN.images);
    if (all.includes('link') || all.includes('<a')) resources.push(MDN.links);
    if (all.includes('semantic') || all.includes('nav') || all.includes('article') || all.includes('section')) resources.push(MDN.semanticHTML);
    if (all.includes('aria') || all.includes('accessibility') || all.includes('accessible')) resources.push(MDN.aria);
    if (all.includes('blockquote') || all.includes('citation')) resources.push(MDN.semanticHTML);
  }

  // CSS exercises
  if (ex.type === 'css' || ex.type === 'html-css') {
    resources.push(MDN.css);
    if (all.includes('flex')) resources.push(MDN.flexbox);
    if (all.includes('grid')) resources.push(MDN.grid);
    if (all.includes('position')) resources.push(MDN.positioning);
    if (all.includes('display')) resources.push(MDN.display);
    if (all.includes('transition')) resources.push(MDN.transitions);
    if (all.includes('animation') || all.includes('keyframe')) resources.push(MDN.animations);
    if (all.includes('media quer')) resources.push(MDN.mediaQueries);
    if (all.includes('custom propert') || all.includes('css variable') || all.includes('dark mode')) resources.push(MDN.customProperties);
    if (all.includes('pseudo-element') || all.includes('::before') || all.includes('::after')) resources.push(MDN.pseudoElements);
    if (all.includes('pseudo-class') || all.includes(':hover') || all.includes(':focus')) resources.push(MDN.pseudoClasses);
    if (all.includes('specificity')) resources.push(MDN.specificity);
    if (all.includes('gradient')) resources.push(MDN.gradients);
    if (all.includes('shadow')) resources.push(MDN.shadows);
    if (all.includes('unit') || all.includes('rem') || all.includes('em')) resources.push(MDN.units);
    if (all.includes('typography') || all.includes('font')) resources.push(MDN.typography);
    if (all.includes('combinator')) resources.push(MDN.combinators);
    if (all.includes('nth-child') || all.includes('nth child')) resources.push(MDN.nthChild);
    if (all.includes('selector')) resources.push(MDN.cssSelectors);
    if (all.includes('box model') || all.includes('padding') || all.includes('margin') || all.includes('border')) resources.push(MDN.boxModel);
    if (all.includes('responsive') || all.includes('breakpoint')) resources.push(MDN.mediaQueries);
    if (all.includes('sticky')) resources.push(MDN.positioning);
    if (all.includes('accordion')) resources.push(MDN.cssSelectors);
  }

  // JS exercises — match by content
  if (ex.type === 'js') {
    // String-related
    if (all.includes('string') || all.includes('charat') || all.includes('substring') || all.includes('uppercase') || all.includes('lowercase') || all.includes('trim') || all.includes('vowel') || all.includes('capitalize') || all.includes('palindrome') || all.includes('reverse') || all.includes('anagram') || all.includes('cipher') || all.includes('titlecase') || all.includes('camelcase') || all.includes('snake_case')) {
      resources.push(MDN.string);
    }

    // Array-related
    if (all.includes('array') || all.includes('element') || all.includes('sort') || all.includes('flatten') || all.includes('chunk') || all.includes('unique') || all.includes('duplicate') || all.includes('zip') || all.includes('pluck') || all.includes('matrix')) {
      resources.push(MDN.array);
    }

    // Specific array methods
    if (all.includes('map') && (all.includes('array') || tags.includes('map') || tags.includes('array-methods'))) resources.push(MDN.map);
    if (all.includes('filter') && (all.includes('array') || tags.includes('filter'))) resources.push(MDN.filter);
    if (all.includes('reduce') || tags.includes('reduce')) resources.push(MDN.reduce);
    if (all.includes('foreach') || tags.includes('foreach')) resources.push(MDN.forEach);
    if (all.includes('find(') || tags.includes('find')) resources.push(MDN.find);
    if (all.includes('.some') || tags.includes('some')) resources.push(MDN.some);
    if (all.includes('.every') || tags.includes('every')) resources.push(MDN.every);
    if (all.includes('.sort') || tags.includes('sort')) resources.push(MDN.sort);
    if (all.includes('flatmap') || tags.includes('flatmap')) resources.push(MDN.flatMap);
    if (all.includes('.flat') || tags.includes('flat')) resources.push(MDN.flat);
    if (all.includes('.splice') || tags.includes('splice')) resources.push(MDN.splice);
    if (all.includes('.concat') || tags.includes('concat')) resources.push(MDN.concat);
    if (all.includes('spread') || tags.includes('spread') || all.includes('...')) resources.push(MDN.spread);
    if (all.includes('destructur') || tags.includes('destructuring')) resources.push(MDN.destructuring);
    if (all.includes('.join') || tags.includes('join')) resources.push(MDN.join);
    if (all.includes('.push') || tags.includes('push')) resources.push(MDN.push);
    if (all.includes('.pop') || tags.includes('pop')) resources.push(MDN.pop);

    // Object-related
    if (all.includes('object') || all.includes('property') || all.includes('propert') || tags.includes('objects')) {
      resources.push(MDN.object);
    }
    if (all.includes('object.keys') || (title.includes('keys') && all.includes('object'))) resources.push(MDN.keys);
    if (all.includes('object.values') || (title.includes('values') && all.includes('object'))) resources.push(MDN.values);
    if (all.includes('object.entries') || (title.includes('entries') && all.includes('object'))) resources.push(MDN.entries);
    if (all.includes('hasownproperty') || all.includes('has property')) resources.push(MDN.hasOwnProperty);

    // Functions & closures
    if (all.includes('closure') || tags.includes('closures')) resources.push(MDN.closures);
    if (all.includes('callback') || tags.includes('callbacks') || tags.includes('higher-order')) resources.push(MDN.callbacks);
    if (all.includes('arrow function') || tags.includes('arrow-functions')) resources.push(MDN.arrowFunctions);
    if (all.includes('recursive') || all.includes('recursion') || tags.includes('recursion')) resources.push(MDN.recursion);
    if (all.includes('default param') || tags.includes('default-parameters')) resources.push(MDN.defaultParams);
    if (all.includes('rest param') || tags.includes('rest-parameters')) resources.push(MDN.restParams);
    if (all.includes('higher-order') || all.includes('higher order') || tags.includes('higher-order-functions')) resources.push(MDN.functions);
    if (all.includes('compose') || all.includes('pipe') || tags.includes('composition')) resources.push(MDN.functions);
    if (all.includes('memoize') || all.includes('memoization')) resources.push(MDN.functions);
    if (all.includes('curry') || tags.includes('currying')) resources.push(MDN.functions);

    // Classes & OOP
    if (all.includes('class') || tags.includes('classes') || tags.includes('oop') || all.includes('constructor') || all.includes('inheritance') || all.includes('extends')) {
      resources.push(MDN.classes);
    }
    if (all.includes('extend') || all.includes('inherit')) resources.push(MDN.extends);
    if (all.includes('prototype') || tags.includes('prototypes')) resources.push(MDN.prototypes);
    if (all.includes('getter') || all.includes('setter') || all.includes('get ') || all.includes('set ')) {
      if (tags.includes('classes') || tags.includes('oop')) resources.push(MDN.gettersSetters);
    }
    if (all.includes('static') && (tags.includes('classes') || tags.includes('oop'))) resources.push(MDN.staticMethods);
    if (all.includes('this') && (tags.includes('classes') || tags.includes('oop') || tags.includes('this'))) resources.push(MDN.this);

    // Async
    if (all.includes('promise') || tags.includes('promises')) resources.push(MDN.promises);
    if (all.includes('async') || all.includes('await') || tags.includes('async-await')) resources.push(MDN.asyncAwait);
    if (all.includes('settimeout') || tags.includes('settimeout')) resources.push(MDN.setTimeout);
    if (all.includes('setinterval') || tags.includes('setinterval')) resources.push(MDN.setInterval);

    // Error handling
    if (all.includes('try') || all.includes('catch') || all.includes('throw') || all.includes('error handling') || tags.includes('error-handling')) {
      resources.push(MDN.tryCatch);
    }

    // Data structures
    if (all.includes('new map') || all.includes('map()') || (tags.includes('map') && all.includes('data structure'))) resources.push(MDN.map_ds);
    if (all.includes('new set') || all.includes('set()') || (tags.includes('set') && all.includes('data structure'))) resources.push(MDN.set_ds);
    if (all.includes('json') || tags.includes('json')) resources.push(MDN.json);
    if (all.includes('weakmap') || tags.includes('weakmap')) resources.push(MDN.weakMap);
    if (all.includes('symbol') || tags.includes('symbol')) resources.push(MDN.symbol);
    if (all.includes('iterator') || tags.includes('iterators')) resources.push(MDN.iterators);
    if (all.includes('generator') || tags.includes('generators')) resources.push(MDN.generators);
    if (all.includes('proxy') || tags.includes('proxy')) resources.push(MDN.proxy);

    // Math
    if (all.includes('math.') || all.includes('square root') || all.includes('hypotenuse') || all.includes('power') || all.includes('absolute') || all.includes('factorial') || all.includes('fibonacci') || all.includes('prime')) {
      resources.push(MDN.math);
    }

    // Control flow
    if (all.includes('loop') || all.includes('iterate') || all.includes('for (') || all.includes('while') || tags.includes('loops') || tags.includes('iteration')) {
      resources.push(MDN.loops);
    }
    if (all.includes('conditional') || all.includes('if/else') || all.includes('if (') || tags.includes('conditionals')) {
      resources.push(MDN.conditionals);
    }
    if (all.includes('switch') || tags.includes('switch')) resources.push(MDN.switch);
    if (all.includes('ternary') || tags.includes('ternary')) resources.push(MDN.ternary);
    if (all.includes('modulo') || all.includes('remainder') || all.includes('%')) resources.push(MDN.modulo);

    // Template literals
    if (all.includes('template literal') || all.includes('template string') || all.includes('`') || tags.includes('template-literals')) {
      resources.push(MDN.templateLiterals);
    }

    // Regex
    if (all.includes('regex') || all.includes('regular expression') || tags.includes('regex')) {
      resources.push(MDN.regex);
    }

    // DOM
    if (all.includes('dom') || all.includes('document') || all.includes('createelement') || tags.includes('dom')) {
      resources.push(MDN.dom);
    }
    if (all.includes('addeventlistener') || all.includes('event listener') || tags.includes('events')) {
      resources.push(MDN.addEventListener);
    }

    // Variables
    if (all.includes('variable') || all.includes('let ') || all.includes('const ') || all.includes('var ') || tags.includes('variables')) {
      resources.push(MDN.variables);
    }

    // Specific string methods
    if (title.includes('charat') || title.includes('charAt')) resources.push(MDN.charAt);
    if (title.includes('indexOf') || title.includes('indexof')) {
      if (all.includes('string')) resources.push(MDN.indexOf_str);
      else resources.push(MDN.indexOf_arr);
    }
    if (title.includes('lastIndexOf') || title.includes('lastindexof')) resources.push(MDN.lastIndexOf_str);
    if (title.includes('repeat') && all.includes('string')) resources.push(MDN.repeat_str);
    if (title.includes('includes') || title.includes('Includes')) {
      if (all.includes('string')) resources.push(MDN.includes_str);
      else resources.push(MDN.includes_arr);
    }
    if (all.includes('split') && (all.includes('string') || all.includes('word'))) resources.push(MDN.split);
    if (all.includes('replace') && all.includes('string')) resources.push(MDN.replace);
    if (title.includes('slice') || title.includes('Slice')) {
      if (all.includes('string')) resources.push(MDN.slice_str);
      else resources.push(MDN.slice_arr);
    }
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = [];
  for (const r of resources) {
    if (!seen.has(r.url)) {
      seen.add(r.url);
      unique.push(r);
    }
  }

  // If we still have none, add a generic fallback based on type
  if (unique.length === 0) {
    if (ex.type === 'js') {
      unique.push(MDN.functions);
      // Try to add something based on tier
      if (ex.tier <= 2) unique.push(MDN.variables);
      else if (ex.tier >= 4) unique.push(MDN.array);
    } else if (ex.type === 'html') {
      unique.push(MDN.html);
    } else if (ex.type === 'css') {
      unique.push(MDN.css);
    } else if (ex.type === 'html-css') {
      unique.push(MDN.html);
      unique.push(MDN.css);
    }
  }

  // Cap at 3 resources
  return unique.slice(0, 3);
}

// Process all exercises with empty resources
let updated = 0;
data.exercises.forEach(ex => {
  if (!ex.resources || ex.resources.length === 0) {
    ex.resources = getResourcesForExercise(ex);
    updated++;
  }
});

// Write back
fs.writeFileSync(EXERCISES_FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated ${updated} exercises with MDN resources.`);

// Verify none are left empty
const stillEmpty = data.exercises.filter(e => !e.resources || e.resources.length === 0);
if (stillEmpty.length > 0) {
  console.error(`WARNING: ${stillEmpty.length} exercises still have empty resources:`);
  stillEmpty.forEach(e => console.error(`  #${e.id} "${e.title}" (type: ${e.type}, tags: ${e.tags.join(', ')})`));
} else {
  console.log('All exercises now have resources.');
}
