/**
 * add-resources.cjs
 *
 * Reads exercises.json and adds MDN Web Docs resource links to exercises
 * that have empty or missing `resources` arrays.
 *
 * Matching strategy (in priority order):
 *   1. Direct tag matches — specific tags map to specific MDN pages
 *   2. Category-based matches — category path maps to topic-level MDN pages
 *   3. Instruction keyword scanning — mentioned concepts map to MDN pages
 *   4. Type-based fallbacks — exercise type (html, css, js) maps to guide pages
 */

const fs = require('fs');
const path = require('path');

const MDN = 'https://developer.mozilla.org/en-US';

// ---------------------------------------------------------------------------
// Comprehensive tag → MDN resource mapping
// Each entry: { label, url, description }
// ---------------------------------------------------------------------------
const TAG_MAP = {
  // --- JS Fundamentals: Variables & Types ---
  variables: {
    label: 'MDN: Variables',
    url: `${MDN}/docs/Web/JavaScript/Guide/Grammar_and_types#declarations`,
    description: 'Variable declarations with var, let, and const',
  },
  let: {
    label: 'MDN: let',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/let`,
    description: 'Block-scoped variable declaration',
  },
  const: {
    label: 'MDN: const',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/const`,
    description: 'Block-scoped constant declaration',
  },
  'type-conversion': {
    label: 'MDN: Type Conversions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Grammar_and_types#type_coercion`,
    description: 'How JavaScript converts between types',
  },
  'type-checking': {
    label: 'MDN: typeof',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/typeof`,
    description: 'Check the type of a value with typeof',
  },
  boolean: {
    label: 'MDN: Boolean',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Boolean`,
    description: 'Boolean values and truthy/falsy',
  },
  truthy: {
    label: 'MDN: Truthy',
    url: `${MDN}/docs/Glossary/Truthy`,
    description: 'Values that evaluate to true in boolean context',
  },

  // --- Operators ---
  operators: {
    label: 'MDN: Expressions and Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators`,
    description: 'All JavaScript operators explained',
  },
  modulo: {
    label: 'MDN: Remainder (%)',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Remainder`,
    description: 'The modulo/remainder operator',
  },
  arithmetic: {
    label: 'MDN: Arithmetic Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators#arithmetic_operators`,
    description: 'Addition, subtraction, multiplication, division, and more',
  },
  comparison: {
    label: 'MDN: Comparison Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators#comparison_operators`,
    description: 'Equality, inequality, and relational operators',
  },
  logic: {
    label: 'MDN: Logical Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators#logical_operators`,
    description: 'AND, OR, NOT logical operators',
  },

  // --- Conditionals ---
  conditionals: {
    label: 'MDN: if...else',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/if...else`,
    description: 'Conditional branching with if and else',
  },
  'if-else': {
    label: 'MDN: if...else',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/if...else`,
    description: 'Conditional branching with if and else',
  },
  'multiple-conditions': {
    label: 'MDN: Logical Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators#logical_operators`,
    description: 'Combine conditions with AND, OR, NOT',
  },
  switch: {
    label: 'MDN: switch',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/switch`,
    description: 'Multi-branch conditional using switch/case',
  },
  ternary: {
    label: 'MDN: Conditional (ternary) Operator',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Conditional_operator`,
    description: 'A shorthand for if/else expressions',
  },

  // --- Loops ---
  loops: {
    label: 'MDN: Loops and Iteration',
    url: `${MDN}/docs/Web/JavaScript/Guide/Loops_and_iteration`,
    description: 'for, while, do...while, and other loop constructs',
  },
  'nested-loops': {
    label: 'MDN: Loops and Iteration',
    url: `${MDN}/docs/Web/JavaScript/Guide/Loops_and_iteration`,
    description: 'Using nested loops for multi-dimensional problems',
  },

  // --- Arrays ---
  arrays: {
    label: 'MDN: Array',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array`,
    description: 'JavaScript Array — methods, properties, and usage',
  },
  map: {
    label: 'MDN: Array.prototype.map()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/map`,
    description: 'Create a new array by transforming each element',
  },
  filter: {
    label: 'MDN: Array.prototype.filter()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/filter`,
    description: 'Create a new array with elements that pass a test',
  },
  filtering: {
    label: 'MDN: Array.prototype.filter()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/filter`,
    description: 'Create a new array with elements that pass a test',
  },
  reduce: {
    label: 'MDN: Array.prototype.reduce()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce`,
    description: 'Reduce an array to a single value with an accumulator',
  },
  forEach: {
    label: 'MDN: Array.prototype.forEach()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach`,
    description: 'Execute a function for each array element',
  },
  find: {
    label: 'MDN: Array.prototype.find()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/find`,
    description: 'Return the first element that satisfies a condition',
  },
  includes: {
    label: 'MDN: Array.prototype.includes()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/includes`,
    description: 'Check if an array contains a specific value',
  },
  sort: {
    label: 'MDN: Array.prototype.sort()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/sort`,
    description: 'Sort the elements of an array in place',
  },
  sorting: {
    label: 'MDN: Array.prototype.sort()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/sort`,
    description: 'Sort the elements of an array in place',
  },
  splice: {
    label: 'MDN: Array.prototype.splice()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/splice`,
    description: 'Add or remove elements from an array',
  },
  slice: {
    label: 'MDN: Array.prototype.slice()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/slice`,
    description: 'Return a shallow copy of a portion of an array',
  },
  slicing: {
    label: 'MDN: Array.prototype.slice()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/slice`,
    description: 'Return a shallow copy of a portion of an array',
  },
  every: {
    label: 'MDN: Array.prototype.every()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/every`,
    description: 'Test whether all elements pass a condition',
  },
  some: {
    label: 'MDN: Array.prototype.some()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/some`,
    description: 'Test whether at least one element passes a condition',
  },
  flatMap: {
    label: 'MDN: Array.prototype.flatMap()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap`,
    description: 'Map each element then flatten the result by one level',
  },
  flatten: {
    label: 'MDN: Array.prototype.flat()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/flat`,
    description: 'Flatten nested arrays to a specified depth',
  },
  'nested-arrays': {
    label: 'MDN: Array.prototype.flat()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/flat`,
    description: 'Flatten nested arrays to a specified depth',
  },
  '2d-array': {
    label: 'MDN: Array',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array`,
    description: 'Working with multi-dimensional arrays',
  },
  accumulator: {
    label: 'MDN: Array.prototype.reduce()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce`,
    description: 'Accumulate values with reduce',
  },
  mutation: {
    label: 'MDN: Array — Mutating Methods',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods`,
    description: 'Methods that modify the original array vs. those that return a new one',
  },
  immutability: {
    label: 'MDN: Array — Copying Methods',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods`,
    description: 'Non-mutating array methods that return new arrays',
  },
  deduplication: {
    label: 'MDN: Set',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Set`,
    description: 'Use Set to remove duplicate values',
  },
  index: {
    label: 'MDN: Array.prototype.indexOf()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf`,
    description: 'Find the index of an element in an array',
  },
  'index-tracking': {
    label: 'MDN: Array.prototype.indexOf()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf`,
    description: 'Find the index of an element in an array',
  },

  // --- Objects ---
  objects: {
    label: 'MDN: Working with Objects',
    url: `${MDN}/docs/Web/JavaScript/Guide/Working_with_objects`,
    description: 'Creating and manipulating JavaScript objects',
  },
  properties: {
    label: 'MDN: Property Accessors',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Property_accessors`,
    description: 'Dot notation and bracket notation for object properties',
  },
  computed: {
    label: 'MDN: Computed Property Names',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names`,
    description: 'Use expressions as object property names',
  },
  'computed-properties': {
    label: 'MDN: Computed Property Names',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names`,
    description: 'Use expressions as object property names',
  },
  nested: {
    label: 'MDN: Working with Objects',
    url: `${MDN}/docs/Web/JavaScript/Guide/Working_with_objects`,
    description: 'Accessing nested object properties',
  },
  grouping: {
    label: 'MDN: Object.groupBy()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy`,
    description: 'Group array elements by a key',
  },
  groupBy: {
    label: 'MDN: Object.groupBy()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy`,
    description: 'Group array elements by a key',
  },
  'frequency-counter': {
    label: 'MDN: Map',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Map`,
    description: 'Use Map or objects to count occurrences',
  },

  // --- Strings ---
  strings: {
    label: 'MDN: String',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String`,
    description: 'JavaScript String — methods, properties, and usage',
  },
  concatenation: {
    label: 'MDN: String Concatenation',
    url: `${MDN}/docs/Web/JavaScript/Guide/Text_formatting`,
    description: 'Combining strings with + or template literals',
  },
  split: {
    label: 'MDN: String.prototype.split()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/split`,
    description: 'Split a string into an array of substrings',
  },
  join: {
    label: 'MDN: Array.prototype.join()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/join`,
    description: 'Join array elements into a string',
  },
  replace: {
    label: 'MDN: String.prototype.replace()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/replace`,
    description: 'Replace occurrences in a string',
  },
  substring: {
    label: 'MDN: String.prototype.substring()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/substring`,
    description: 'Extract part of a string between two indices',
  },
  trim: {
    label: 'MDN: String.prototype.trim()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/trim`,
    description: 'Remove whitespace from both ends of a string',
  },
  toLowerCase: {
    label: 'MDN: String.prototype.toLowerCase()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase`,
    description: 'Convert a string to lowercase',
  },
  toUpperCase: {
    label: 'MDN: String.prototype.toUpperCase()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase`,
    description: 'Convert a string to uppercase',
  },
  capitalize: {
    label: 'MDN: String.prototype.toUpperCase()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase`,
    description: 'Capitalize letters using toUpperCase()',
  },
  charAt: {
    label: 'MDN: String.prototype.charAt()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/charAt`,
    description: 'Get the character at a specific index',
  },
  indexing: {
    label: 'MDN: String.prototype.charAt()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/charAt`,
    description: 'Access characters by index with charAt or bracket notation',
  },
  indexOf: {
    label: 'MDN: String.prototype.indexOf()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf`,
    description: 'Find the first occurrence of a substring',
  },
  reverse: {
    label: 'MDN: Array.prototype.reverse()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse`,
    description: 'Reverse the order of elements in an array',
  },
  charCode: {
    label: 'MDN: String.prototype.charCodeAt()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt`,
    description: 'Get the Unicode value of a character',
  },
  cipher: {
    label: 'MDN: String.fromCharCode()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode`,
    description: 'Create a string from Unicode values',
  },
  vowels: {
    label: 'MDN: String.prototype.includes()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/includes`,
    description: 'Check if a string contains a specific substring',
  },

  // --- Functions ---
  functions: {
    label: 'MDN: Functions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Functions`,
    description: 'Defining and calling functions in JavaScript',
  },
  scope: {
    label: 'MDN: Variable Scope',
    url: `${MDN}/docs/Web/JavaScript/Guide/Grammar_and_types#variable_scope`,
    description: 'How variable scope works in JavaScript',
  },
  closure: {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Functions that retain access to their outer scope',
  },
  closures: {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Functions that retain access to their outer scope',
  },
  callbacks: {
    label: 'MDN: Callback Function',
    url: `${MDN}/docs/Glossary/Callback_function`,
    description: 'Functions passed as arguments to other functions',
  },
  'higher-order': {
    label: 'MDN: First-class Functions',
    url: `${MDN}/docs/Glossary/First-class_Function`,
    description: 'Functions as values — passing and returning functions',
  },
  'arrow-functions': {
    label: 'MDN: Arrow Functions',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/Arrow_functions`,
    description: 'Concise function syntax with =>',
  },
  'default-params': {
    label: 'MDN: Default Parameters',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/Default_parameters`,
    description: 'Set default values for function parameters',
  },
  'rest-parameters': {
    label: 'MDN: Rest Parameters',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/rest_parameters`,
    description: 'Collect remaining arguments into an array',
  },
  rest: {
    label: 'MDN: Rest Parameters',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/rest_parameters`,
    description: 'Collect remaining arguments into an array',
  },
  recursion: {
    label: 'MDN: Recursion',
    url: `${MDN}/docs/Glossary/Recursion`,
    description: 'Functions that call themselves',
  },
  composition: {
    label: 'MDN: Functions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Functions`,
    description: 'Combining functions to build complex behavior',
  },
  pipe: {
    label: 'MDN: Array.prototype.reduce()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce`,
    description: 'Chain function calls using reduce',
  },
  compose: {
    label: 'MDN: Functions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Functions`,
    description: 'Compose multiple functions into one',
  },
  memoize: {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Use closures to cache function results',
  },
  cache: {
    label: 'MDN: Map',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Map`,
    description: 'Use Map for caching key-value pairs',
  },
  curry: {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Transform functions using closures (currying)',
  },
  'partial-application': {
    label: 'MDN: Function.prototype.bind()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Function/bind`,
    description: 'Pre-fill function arguments with bind()',
  },
  'module-pattern': {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Use closures to create private state (module pattern)',
  },
  functional: {
    label: 'MDN: First-class Functions',
    url: `${MDN}/docs/Glossary/First-class_Function`,
    description: 'Functional programming concepts in JavaScript',
  },

  // --- Classes & OOP ---
  class: {
    label: 'MDN: Classes',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes`,
    description: 'JavaScript class syntax for object-oriented programming',
  },
  oop: {
    label: 'MDN: Object-oriented Programming',
    url: `${MDN}/docs/Learn/JavaScript/Objects/Object-oriented_programming`,
    description: 'OOP concepts in JavaScript',
  },
  constructor: {
    label: 'MDN: constructor',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes/constructor`,
    description: 'The constructor method for initializing class instances',
  },
  methods: {
    label: 'MDN: Method Definitions',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/Method_definitions`,
    description: 'Defining methods on classes and objects',
  },
  extends: {
    label: 'MDN: extends',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes/extends`,
    description: 'Class inheritance with extends',
  },
  inheritance: {
    label: 'MDN: extends',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes/extends`,
    description: 'Class inheritance with extends',
  },
  super: {
    label: 'MDN: super',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/super`,
    description: 'Call the parent class constructor or methods',
  },
  static: {
    label: 'MDN: static',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes/static`,
    description: 'Static methods and properties on classes',
  },
  getter: {
    label: 'MDN: get',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/get`,
    description: 'Define a getter on an object or class',
  },
  setter: {
    label: 'MDN: set',
    url: `${MDN}/docs/Web/JavaScript/Reference/Functions/set`,
    description: 'Define a setter on an object or class',
  },
  polymorphism: {
    label: 'MDN: Inheritance and the Prototype Chain',
    url: `${MDN}/docs/Web/JavaScript/Inheritance_and_the_prototype_chain`,
    description: 'Polymorphism through prototype-based inheritance',
  },
  factory: {
    label: 'MDN: Working with Objects',
    url: `${MDN}/docs/Web/JavaScript/Guide/Working_with_objects`,
    description: 'Factory functions for creating objects',
  },
  'state-machine': {
    label: 'MDN: Classes',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes`,
    description: 'Model state machines with classes',
  },

  // --- ES6+ ---
  destructuring: {
    label: 'MDN: Destructuring Assignment',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment`,
    description: 'Unpack values from arrays or properties from objects',
  },
  spread: {
    label: 'MDN: Spread Syntax',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Spread_syntax`,
    description: 'Expand arrays and objects with ...',
  },
  'template-literals': {
    label: 'MDN: Template Literals',
    url: `${MDN}/docs/Web/JavaScript/Reference/Template_literals`,
    description: 'String interpolation with backticks and ${}',
  },
  es6: {
    label: 'MDN: JavaScript Reference',
    url: `${MDN}/docs/Web/JavaScript/Reference`,
    description: 'Modern JavaScript (ES6+) features reference',
  },
  async: {
    label: 'MDN: async function',
    url: `${MDN}/docs/Web/JavaScript/Reference/Statements/async_function`,
    description: 'Declare asynchronous functions with async/await',
  },
  await: {
    label: 'MDN: await',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/await`,
    description: 'Pause async function execution until a Promise settles',
  },
  promises: {
    label: 'MDN: Promise',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Promise`,
    description: 'Handle asynchronous operations with Promises',
  },
  'syntax-translation': {
    label: 'MDN: JavaScript Reference',
    url: `${MDN}/docs/Web/JavaScript/Reference`,
    description: 'JavaScript language reference for syntax translation',
  },

  // --- Math ---
  math: {
    label: 'MDN: Math',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Math`,
    description: 'Built-in Math object for mathematical operations',
  },

  // --- Regex ---
  regex: {
    label: 'MDN: Regular Expressions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Regular_expressions`,
    description: 'Pattern matching with regular expressions',
  },
  test: {
    label: 'MDN: RegExp.prototype.test()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test`,
    description: 'Test if a string matches a pattern',
  },
  match: {
    label: 'MDN: String.prototype.match()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/match`,
    description: 'Retrieve matches of a string against a regex',
  },

  // --- Data Structures ---
  stack: {
    label: 'MDN: Array — push/pop',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/push`,
    description: 'Use push() and pop() for stack (LIFO) behavior',
  },
  queue: {
    label: 'MDN: Array — push/shift',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/shift`,
    description: 'Use push() and shift() for queue (FIFO) behavior',
  },
  'data-structure': {
    label: 'MDN: JavaScript Data Structures',
    url: `${MDN}/docs/Web/JavaScript/Data_structures`,
    description: 'Overview of JavaScript data types and structures',
  },
  'data-transformation': {
    label: 'MDN: Array — Iterative Methods',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods`,
    description: 'Transform data with map, filter, reduce, and more',
  },

  // --- DOM ---
  querySelector: {
    label: 'MDN: Document.querySelector()',
    url: `${MDN}/docs/Web/API/Document/querySelector`,
    description: 'Select the first element matching a CSS selector',
  },
  addEventListener: {
    label: 'MDN: EventTarget.addEventListener()',
    url: `${MDN}/docs/Web/API/EventTarget/addEventListener`,
    description: 'Attach event handlers to elements',
  },
  createElement: {
    label: 'MDN: Document.createElement()',
    url: `${MDN}/docs/Web/API/Document/createElement`,
    description: 'Create a new HTML element',
  },
  classList: {
    label: 'MDN: Element.classList',
    url: `${MDN}/docs/Web/API/Element/classList`,
    description: 'Add, remove, and toggle CSS classes',
  },
  events: {
    label: 'MDN: Introduction to Events',
    url: `${MDN}/docs/Learn/JavaScript/Building_blocks/Events`,
    description: 'Understanding and handling DOM events',
  },

  // --- HTML tags ---
  html: {
    label: 'MDN: HTML Elements Reference',
    url: `${MDN}/docs/Web/HTML/Element`,
    description: 'Complete reference of HTML elements',
  },
  semantics: {
    label: 'MDN: Semantic HTML',
    url: `${MDN}/docs/Web/HTML/Element`,
    description: 'Using meaningful HTML elements for structure',
  },
  forms: {
    label: 'MDN: Web Forms',
    url: `${MDN}/docs/Learn/Forms`,
    description: 'Building and styling web forms',
  },
  inputs: {
    label: 'MDN: <input>',
    url: `${MDN}/docs/Web/HTML/Element/input`,
    description: 'The input element and its many types',
  },
  headings: {
    label: 'MDN: Heading Elements',
    url: `${MDN}/docs/Web/HTML/Element/Heading_Elements`,
    description: 'HTML heading elements h1 through h6',
  },
  lists: {
    label: 'MDN: <ul>',
    url: `${MDN}/docs/Web/HTML/Element/ul`,
    description: 'Unordered and ordered list elements',
  },
  links: {
    label: 'MDN: <a>',
    url: `${MDN}/docs/Web/HTML/Element/a`,
    description: 'The anchor element for hyperlinks',
  },
  images: {
    label: 'MDN: <img>',
    url: `${MDN}/docs/Web/HTML/Element/img`,
    description: 'Embedding images in HTML',
  },
  tables: {
    label: 'MDN: <table>',
    url: `${MDN}/docs/Web/HTML/Element/table`,
    description: 'HTML table structure and elements',
  },
  nav: {
    label: 'MDN: <nav>',
    url: `${MDN}/docs/Web/HTML/Element/nav`,
    description: 'The navigation section element',
  },
  article: {
    label: 'MDN: <article>',
    url: `${MDN}/docs/Web/HTML/Element/article`,
    description: 'Self-contained content in a document',
  },
  header: {
    label: 'MDN: <header>',
    url: `${MDN}/docs/Web/HTML/Element/header`,
    description: 'Introductory content or navigational aids',
  },
  figure: {
    label: 'MDN: <figure>',
    url: `${MDN}/docs/Web/HTML/Element/figure`,
    description: 'Self-contained figure with optional caption',
  },
  figcaption: {
    label: 'MDN: <figcaption>',
    url: `${MDN}/docs/Web/HTML/Element/figcaption`,
    description: 'Caption for a figure element',
  },
  blockquote: {
    label: 'MDN: <blockquote>',
    url: `${MDN}/docs/Web/HTML/Element/blockquote`,
    description: 'Block-level quotation element',
  },
  select: {
    label: 'MDN: <select>',
    url: `${MDN}/docs/Web/HTML/Element/select`,
    description: 'Dropdown select control',
  },
  radio: {
    label: 'MDN: <input type="radio">',
    url: `${MDN}/docs/Web/HTML/Element/input/radio`,
    description: 'Radio button input for selecting one option',
  },
  checkbox: {
    label: 'MDN: <input type="checkbox">',
    url: `${MDN}/docs/Web/HTML/Element/input/checkbox`,
    description: 'Checkbox input for toggling options',
  },
  accessibility: {
    label: 'MDN: ARIA',
    url: `${MDN}/docs/Web/Accessibility/ARIA`,
    description: 'Accessible Rich Internet Applications overview',
  },
  aria: {
    label: 'MDN: ARIA',
    url: `${MDN}/docs/Web/Accessibility/ARIA`,
    description: 'ARIA roles, states, and properties',
  },
  details: {
    label: 'MDN: <details>',
    url: `${MDN}/docs/Web/HTML/Element/details`,
    description: 'A disclosure widget for showing/hiding content',
  },
  summary: {
    label: 'MDN: <summary>',
    url: `${MDN}/docs/Web/HTML/Element/summary`,
    description: 'Summary heading for a details element',
  },
  navigation: {
    label: 'MDN: <nav>',
    url: `${MDN}/docs/Web/HTML/Element/nav`,
    description: 'Navigation section element',
  },

  // --- CSS tags ---
  css: {
    label: 'MDN: CSS Reference',
    url: `${MDN}/docs/Web/CSS/Reference`,
    description: 'Complete CSS property reference',
  },
  selectors: {
    label: 'MDN: CSS Selectors',
    url: `${MDN}/docs/Web/CSS/CSS_selectors`,
    description: 'Selecting elements with CSS selectors',
  },
  'box-model': {
    label: 'MDN: CSS Box Model',
    url: `${MDN}/docs/Web/CSS/CSS_box_model`,
    description: 'Understanding margin, border, padding, and content',
  },
  flexbox: {
    label: 'MDN: Flexbox',
    url: `${MDN}/docs/Web/CSS/CSS_flexible_box_layout`,
    description: 'Flexible box layout for one-dimensional layouts',
  },
  'flex-wrap': {
    label: 'MDN: flex-wrap',
    url: `${MDN}/docs/Web/CSS/flex-wrap`,
    description: 'Control whether flex items wrap to new lines',
  },
  grid: {
    label: 'MDN: CSS Grid Layout',
    url: `${MDN}/docs/Web/CSS/CSS_grid_layout`,
    description: 'Two-dimensional grid layout system',
  },
  'fr-units': {
    label: 'MDN: CSS Grid — fr unit',
    url: `${MDN}/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout`,
    description: 'Flexible grid tracks with the fr unit',
  },
  'auto-fit': {
    label: 'MDN: CSS Grid — auto-fit',
    url: `${MDN}/docs/Web/CSS/repeat`,
    description: 'Auto-fit and minmax for responsive grids',
  },
  minmax: {
    label: 'MDN: minmax()',
    url: `${MDN}/docs/Web/CSS/minmax`,
    description: 'Define minimum and maximum track sizes in grid',
  },
  positioning: {
    label: 'MDN: position',
    url: `${MDN}/docs/Web/CSS/position`,
    description: 'CSS positioning — static, relative, absolute, fixed, sticky',
  },
  relative: {
    label: 'MDN: position',
    url: `${MDN}/docs/Web/CSS/position`,
    description: 'Position elements relative to their normal flow',
  },
  absolute: {
    label: 'MDN: position',
    url: `${MDN}/docs/Web/CSS/position`,
    description: 'Position elements relative to a positioned ancestor',
  },
  sticky: {
    label: 'MDN: position: sticky',
    url: `${MDN}/docs/Web/CSS/position`,
    description: 'Elements that toggle between relative and fixed',
  },
  'z-index': {
    label: 'MDN: z-index',
    url: `${MDN}/docs/Web/CSS/z-index`,
    description: 'Control stacking order of positioned elements',
  },
  typography: {
    label: 'MDN: Fundamental Text and Font Styling',
    url: `${MDN}/docs/Learn/CSS/Styling_text/Fundamentals`,
    description: 'Font family, size, weight, line-height, and text styling',
  },
  fonts: {
    label: 'MDN: font',
    url: `${MDN}/docs/Web/CSS/font`,
    description: 'The font shorthand property',
  },
  color: {
    label: 'MDN: color',
    url: `${MDN}/docs/Web/CSS/color`,
    description: 'Setting text color',
  },
  colors: {
    label: 'MDN: color',
    url: `${MDN}/docs/Web/CSS/color`,
    description: 'Setting text color',
  },
  background: {
    label: 'MDN: background',
    url: `${MDN}/docs/Web/CSS/background`,
    description: 'Background color, images, and gradients',
  },
  backgrounds: {
    label: 'MDN: background',
    url: `${MDN}/docs/Web/CSS/background`,
    description: 'Background color, images, and gradients',
  },
  gradients: {
    label: 'MDN: CSS Gradients',
    url: `${MDN}/docs/Web/CSS/gradient`,
    description: 'Linear, radial, and conic gradients',
  },
  border: {
    label: 'MDN: border',
    url: `${MDN}/docs/Web/CSS/border`,
    description: 'Setting border width, style, and color',
  },
  borders: {
    label: 'MDN: border',
    url: `${MDN}/docs/Web/CSS/border`,
    description: 'Setting border width, style, and color',
  },
  shadows: {
    label: 'MDN: box-shadow',
    url: `${MDN}/docs/Web/CSS/box-shadow`,
    description: 'Add shadow effects to elements',
  },
  margin: {
    label: 'MDN: margin',
    url: `${MDN}/docs/Web/CSS/margin`,
    description: 'Set outer spacing around elements',
  },
  padding: {
    label: 'MDN: padding',
    url: `${MDN}/docs/Web/CSS/padding`,
    description: 'Set inner spacing within elements',
  },
  display: {
    label: 'MDN: display',
    url: `${MDN}/docs/Web/CSS/display`,
    description: 'Control the display type of an element',
  },
  transitions: {
    label: 'MDN: CSS Transitions',
    url: `${MDN}/docs/Web/CSS/CSS_transitions`,
    description: 'Animate property changes over time',
  },
  animation: {
    label: 'MDN: CSS Animations',
    url: `${MDN}/docs/Web/CSS/CSS_animations`,
    description: 'Create complex animations with keyframes',
  },
  keyframes: {
    label: 'MDN: @keyframes',
    url: `${MDN}/docs/Web/CSS/@keyframes`,
    description: 'Define animation keyframe sequences',
  },
  transforms: {
    label: 'MDN: transform',
    url: `${MDN}/docs/Web/CSS/transform`,
    description: 'Rotate, scale, skew, and translate elements',
  },
  responsive: {
    label: 'MDN: Media Queries',
    url: `${MDN}/docs/Web/CSS/CSS_media_queries`,
    description: 'Apply styles based on viewport size and device features',
  },
  'media-queries': {
    label: 'MDN: Media Queries',
    url: `${MDN}/docs/Web/CSS/CSS_media_queries`,
    description: 'Apply styles based on viewport size and device features',
  },
  'pseudo-class': {
    label: 'MDN: Pseudo-classes',
    url: `${MDN}/docs/Web/CSS/Pseudo-classes`,
    description: 'Style elements based on state (:hover, :focus, etc.)',
  },
  hover: {
    label: 'MDN: :hover',
    url: `${MDN}/docs/Web/CSS/:hover`,
    description: 'Style elements when the mouse is over them',
  },
  'nth-child': {
    label: 'MDN: :nth-child()',
    url: `${MDN}/docs/Web/CSS/:nth-child`,
    description: 'Select elements by their position in a parent',
  },
  'pseudo-elements': {
    label: 'MDN: Pseudo-elements',
    url: `${MDN}/docs/Web/CSS/Pseudo-elements`,
    description: 'Style specific parts of an element (::before, ::after)',
  },
  before: {
    label: 'MDN: ::before',
    url: `${MDN}/docs/Web/CSS/::before`,
    description: 'Insert content before an element',
  },
  after: {
    label: 'MDN: ::after',
    url: `${MDN}/docs/Web/CSS/::after`,
    description: 'Insert content after an element',
  },
  combinators: {
    label: 'MDN: CSS Combinators',
    url: `${MDN}/docs/Web/CSS/CSS_selectors/Selectors_and_combinators`,
    description: 'Descendant, child, sibling, and adjacent selectors',
  },
  specificity: {
    label: 'MDN: Specificity',
    url: `${MDN}/docs/Web/CSS/Specificity`,
    description: 'How CSS determines which rules apply',
  },
  cascading: {
    label: 'MDN: Cascade',
    url: `${MDN}/docs/Web/CSS/Cascade`,
    description: 'How the CSS cascade resolves conflicting rules',
  },
  'custom-properties': {
    label: 'MDN: CSS Custom Properties (Variables)',
    url: `${MDN}/docs/Web/CSS/Using_CSS_custom_properties`,
    description: 'Define reusable values with --custom-properties',
  },
  'dark-mode': {
    label: 'MDN: prefers-color-scheme',
    url: `${MDN}/docs/Web/CSS/@media/prefers-color-scheme`,
    description: 'Detect and respond to user color scheme preference',
  },
  theming: {
    label: 'MDN: CSS Custom Properties',
    url: `${MDN}/docs/Web/CSS/Using_CSS_custom_properties`,
    description: 'Use CSS variables for themeable designs',
  },
  layout: {
    label: 'MDN: CSS Layout',
    url: `${MDN}/docs/Learn/CSS/CSS_layout`,
    description: 'Overview of CSS layout techniques',
  },
  sizing: {
    label: 'MDN: Sizing Items in CSS',
    url: `${MDN}/docs/Learn/CSS/Building_blocks/Sizing_items_in_CSS`,
    description: 'Width, height, min/max sizing, and box-sizing',
  },
  units: {
    label: 'MDN: CSS Values and Units',
    url: `${MDN}/docs/Learn/CSS/Building_blocks/Values_and_units`,
    description: 'px, em, rem, %, vh, vw and other CSS units',
  },
  rem: {
    label: 'MDN: CSS Values and Units',
    url: `${MDN}/docs/Learn/CSS/Building_blocks/Values_and_units`,
    description: 'Understanding rem, em, and other relative units',
  },
  viewport: {
    label: 'MDN: Viewport Concepts',
    url: `${MDN}/docs/Web/CSS/Viewport_concepts`,
    description: 'Understanding the viewport and viewport units',
  },
  text: {
    label: 'MDN: Fundamental Text and Font Styling',
    url: `${MDN}/docs/Learn/CSS/Styling_text/Fundamentals`,
    description: 'Styling text with CSS',
  },
  'holy-grail': {
    label: 'MDN: CSS Grid Layout',
    url: `${MDN}/docs/Web/CSS/CSS_grid_layout`,
    description: 'Build classic layouts with CSS Grid',
  },
};

// ---------------------------------------------------------------------------
// Category path → MDN resource mapping (fallback for tags that don't match)
// ---------------------------------------------------------------------------
const CATEGORY_MAP = {
  'js-fundamentals/variables': {
    label: 'MDN: Grammar and Types',
    url: `${MDN}/docs/Web/JavaScript/Guide/Grammar_and_types`,
    description: 'Variables, data types, and literals',
  },
  'js-fundamentals/operators': {
    label: 'MDN: Expressions and Operators',
    url: `${MDN}/docs/Web/JavaScript/Guide/Expressions_and_operators`,
    description: 'All JavaScript operators explained',
  },
  'js-fundamentals/conditionals': {
    label: 'MDN: Control Flow',
    url: `${MDN}/docs/Web/JavaScript/Guide/Control_flow_and_error_handling`,
    description: 'if/else, switch, and error handling',
  },
  'js-fundamentals/loops': {
    label: 'MDN: Loops and Iteration',
    url: `${MDN}/docs/Web/JavaScript/Guide/Loops_and_iteration`,
    description: 'for, while, do...while, for...of, for...in',
  },
  'js-fundamentals/classes': {
    label: 'MDN: Classes',
    url: `${MDN}/docs/Web/JavaScript/Reference/Classes`,
    description: 'JavaScript classes for object-oriented programming',
  },
  'js-fundamentals/objects': {
    label: 'MDN: Working with Objects',
    url: `${MDN}/docs/Web/JavaScript/Guide/Working_with_objects`,
    description: 'Creating and manipulating JavaScript objects',
  },
  'data-structures/arrays': {
    label: 'MDN: Array',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array`,
    description: 'Array methods, properties, and usage',
  },
  'data-structures/objects': {
    label: 'MDN: Working with Objects',
    url: `${MDN}/docs/Web/JavaScript/Guide/Working_with_objects`,
    description: 'Creating and manipulating JavaScript objects',
  },
  'data-structures/strings': {
    label: 'MDN: String',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String`,
    description: 'String methods, properties, and usage',
  },
  'functions/scope': {
    label: 'MDN: Closures',
    url: `${MDN}/docs/Web/JavaScript/Closures`,
    description: 'Scope, closures, and lexical environments',
  },
  'functions/higher-order': {
    label: 'MDN: First-class Functions',
    url: `${MDN}/docs/Glossary/First-class_Function`,
    description: 'Functions as values — passing and returning functions',
  },
  'functions/callbacks': {
    label: 'MDN: Callback Function',
    url: `${MDN}/docs/Glossary/Callback_function`,
    description: 'Functions passed as arguments to other functions',
  },
  functions: {
    label: 'MDN: Functions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Functions`,
    description: 'Defining and using functions in JavaScript',
  },
  'es6-plus/destructuring': {
    label: 'MDN: Destructuring Assignment',
    url: `${MDN}/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment`,
    description: 'Unpack values from arrays or properties from objects',
  },
  'es6-plus/async': {
    label: 'MDN: Asynchronous JavaScript',
    url: `${MDN}/docs/Learn/JavaScript/Asynchronous`,
    description: 'Promises, async/await, and asynchronous programming',
  },
  'es6-plus/template-literals': {
    label: 'MDN: Template Literals',
    url: `${MDN}/docs/Web/JavaScript/Reference/Template_literals`,
    description: 'String interpolation with backticks',
  },
  'html/structure': {
    label: 'MDN: HTML Basics',
    url: `${MDN}/docs/Learn/HTML/Introduction_to_HTML`,
    description: 'Introduction to HTML document structure',
  },
  'html/semantics': {
    label: 'MDN: HTML Elements Reference',
    url: `${MDN}/docs/Web/HTML/Element`,
    description: 'Semantic HTML elements for meaningful structure',
  },
  'html/forms': {
    label: 'MDN: Web Forms',
    url: `${MDN}/docs/Learn/Forms`,
    description: 'Building accessible web forms',
  },
  'css/selectors': {
    label: 'MDN: CSS Selectors',
    url: `${MDN}/docs/Web/CSS/CSS_selectors`,
    description: 'Selecting elements with CSS selectors',
  },
  'css/box-model': {
    label: 'MDN: CSS Box Model',
    url: `${MDN}/docs/Web/CSS/CSS_box_model`,
    description: 'Understanding margin, border, padding, and content',
  },
  'css/layout': {
    label: 'MDN: CSS Layout',
    url: `${MDN}/docs/Learn/CSS/CSS_layout`,
    description: 'Layout techniques: flexbox, grid, float, positioning',
  },
  'css/flexbox': {
    label: 'MDN: Flexbox',
    url: `${MDN}/docs/Web/CSS/CSS_flexible_box_layout`,
    description: 'Flexible box layout for responsive design',
  },
  'css/typography': {
    label: 'MDN: Styling Text',
    url: `${MDN}/docs/Learn/CSS/Styling_text/Fundamentals`,
    description: 'Font, text alignment, spacing, and decoration',
  },
  'css/positioning': {
    label: 'MDN: position',
    url: `${MDN}/docs/Web/CSS/position`,
    description: 'Positioning elements — static, relative, absolute, fixed, sticky',
  },
  'css/transitions': {
    label: 'MDN: CSS Transitions',
    url: `${MDN}/docs/Web/CSS/CSS_transitions`,
    description: 'Animate property changes smoothly',
  },
  'syntax-translation/es5-to-es6': {
    label: 'MDN: JavaScript Reference',
    url: `${MDN}/docs/Web/JavaScript/Reference`,
    description: 'Modern JavaScript features reference',
  },
  'syntax-translation/es6-to-es5': {
    label: 'MDN: JavaScript Reference',
    url: `${MDN}/docs/Web/JavaScript/Reference`,
    description: 'JavaScript language reference',
  },
  'syntax-translation/refactoring': {
    label: 'MDN: Functions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Functions`,
    description: 'JavaScript functions guide for refactoring',
  },
  'algorithms/sorting': {
    label: 'MDN: Array.prototype.sort()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/sort`,
    description: 'Sorting arrays in JavaScript',
  },
  'algorithms/searching': {
    label: 'MDN: Array.prototype.find()',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/find`,
    description: 'Searching for elements in arrays',
  },
  'algorithms/recursion': {
    label: 'MDN: Recursion',
    url: `${MDN}/docs/Glossary/Recursion`,
    description: 'Understanding recursive algorithms',
  },
  'algorithms/patterns': {
    label: 'MDN: Array — Iterative Methods',
    url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods`,
    description: 'Common algorithmic patterns with array methods',
  },
  'regex/basics': {
    label: 'MDN: Regular Expressions',
    url: `${MDN}/docs/Web/JavaScript/Guide/Regular_expressions`,
    description: 'Getting started with regular expressions',
  },
  'regex/patterns': {
    label: 'MDN: Regular Expressions — Character Classes',
    url: `${MDN}/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes`,
    description: 'Pattern matching with character classes',
  },
  'regex/extraction': {
    label: 'MDN: Regular Expressions — Groups',
    url: `${MDN}/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences`,
    description: 'Capture groups for extracting matched text',
  },
  'dom-manipulation/selection': {
    label: 'MDN: Document.querySelector()',
    url: `${MDN}/docs/Web/API/Document/querySelector`,
    description: 'Select elements from the DOM',
  },
  'dom-manipulation/events': {
    label: 'MDN: Introduction to Events',
    url: `${MDN}/docs/Learn/JavaScript/Building_blocks/Events`,
    description: 'Handling user interactions with event listeners',
  },
  'dom-manipulation/manipulation': {
    label: 'MDN: Manipulating Documents',
    url: `${MDN}/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents`,
    description: 'Creating, modifying, and removing DOM elements',
  },
};

// ---------------------------------------------------------------------------
// Instruction keyword → MDN resource (scanned from instructions text)
// ---------------------------------------------------------------------------
const INSTRUCTION_KEYWORDS = [
  { pattern: /\bfor\s*\(|for loop|for\.\.\.of|for\.\.\.in/i, resource: { label: 'MDN: for loop', url: `${MDN}/docs/Web/JavaScript/Reference/Statements/for`, description: 'The for loop statement' } },
  { pattern: /\bwhile\s*\(/i, resource: { label: 'MDN: while', url: `${MDN}/docs/Web/JavaScript/Reference/Statements/while`, description: 'The while loop statement' } },
  { pattern: /\.map\s*\(/i, resource: { label: 'MDN: Array.prototype.map()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/map`, description: 'Transform each element in an array' } },
  { pattern: /\.filter\s*\(/i, resource: { label: 'MDN: Array.prototype.filter()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/filter`, description: 'Filter elements that match a condition' } },
  { pattern: /\.reduce\s*\(/i, resource: { label: 'MDN: Array.prototype.reduce()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce`, description: 'Reduce an array to a single value' } },
  { pattern: /\.forEach\s*\(/i, resource: { label: 'MDN: Array.prototype.forEach()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach`, description: 'Execute a function for each element' } },
  { pattern: /\.find\s*\(/i, resource: { label: 'MDN: Array.prototype.find()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/find`, description: 'Find the first matching element' } },
  { pattern: /\.includes\s*\(/i, resource: { label: 'MDN: Array.prototype.includes()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/includes`, description: 'Check if an array contains a value' } },
  { pattern: /\.sort\s*\(/i, resource: { label: 'MDN: Array.prototype.sort()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/sort`, description: 'Sort array elements' } },
  { pattern: /\.splice\s*\(/i, resource: { label: 'MDN: Array.prototype.splice()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/splice`, description: 'Add or remove elements from an array' } },
  { pattern: /\.slice\s*\(/i, resource: { label: 'MDN: Array.prototype.slice()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/slice`, description: 'Extract a section of an array' } },
  { pattern: /\.split\s*\(/i, resource: { label: 'MDN: String.prototype.split()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/split`, description: 'Split a string into an array' } },
  { pattern: /\.join\s*\(/i, resource: { label: 'MDN: Array.prototype.join()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Array/join`, description: 'Join array elements into a string' } },
  { pattern: /\.replace\s*\(/i, resource: { label: 'MDN: String.prototype.replace()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/replace`, description: 'Replace text in a string' } },
  { pattern: /\.trim\s*\(/i, resource: { label: 'MDN: String.prototype.trim()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/trim`, description: 'Remove whitespace from both ends' } },
  { pattern: /\.toLowerCase\s*\(/i, resource: { label: 'MDN: String.prototype.toLowerCase()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase`, description: 'Convert to lowercase' } },
  { pattern: /\.toUpperCase\s*\(/i, resource: { label: 'MDN: String.prototype.toUpperCase()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase`, description: 'Convert to uppercase' } },
  { pattern: /Object\.keys\s*\(/i, resource: { label: 'MDN: Object.keys()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/keys`, description: 'Get an array of an object\'s keys' } },
  { pattern: /Object\.values\s*\(/i, resource: { label: 'MDN: Object.values()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/values`, description: 'Get an array of an object\'s values' } },
  { pattern: /Object\.entries\s*\(/i, resource: { label: 'MDN: Object.entries()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/entries`, description: 'Get an array of an object\'s key-value pairs' } },
  { pattern: /Object\.assign\s*\(/i, resource: { label: 'MDN: Object.assign()', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Object/assign`, description: 'Copy properties from one object to another' } },
  { pattern: /template\s*literal|`\$\{/i, resource: { label: 'MDN: Template Literals', url: `${MDN}/docs/Web/JavaScript/Reference/Template_literals`, description: 'String interpolation with backticks' } },
  { pattern: /\bclass\s+\w+/i, resource: { label: 'MDN: Classes', url: `${MDN}/docs/Web/JavaScript/Reference/Classes`, description: 'ES6 class syntax' } },
  { pattern: /\bextends\s+/i, resource: { label: 'MDN: extends', url: `${MDN}/docs/Web/JavaScript/Reference/Classes/extends`, description: 'Inherit from a parent class' } },
  { pattern: /\bsuper\s*\(/i, resource: { label: 'MDN: super', url: `${MDN}/docs/Web/JavaScript/Reference/Operators/super`, description: 'Call the parent constructor or methods' } },
  { pattern: /\bconstructor\s*\(/i, resource: { label: 'MDN: constructor', url: `${MDN}/docs/Web/JavaScript/Reference/Classes/constructor`, description: 'Initialize class instances' } },
  { pattern: /\bstatic\s+/i, resource: { label: 'MDN: static', url: `${MDN}/docs/Web/JavaScript/Reference/Classes/static`, description: 'Static class members' } },
  { pattern: /\bget\s+\w+\s*\(/i, resource: { label: 'MDN: getter', url: `${MDN}/docs/Web/JavaScript/Reference/Functions/get`, description: 'Define a getter on a class or object' } },
  { pattern: /\bset\s+\w+\s*\(/i, resource: { label: 'MDN: setter', url: `${MDN}/docs/Web/JavaScript/Reference/Functions/set`, description: 'Define a setter on a class or object' } },
  { pattern: /\basync\s+function|\bawait\s+/i, resource: { label: 'MDN: async/await', url: `${MDN}/docs/Web/JavaScript/Reference/Statements/async_function`, description: 'Asynchronous functions with async/await' } },
  { pattern: /\bPromise\b/i, resource: { label: 'MDN: Promise', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Promise`, description: 'Handle asynchronous operations' } },
  { pattern: /\bMath\.\w+/i, resource: { label: 'MDN: Math', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/Math`, description: 'Mathematical functions and constants' } },
  { pattern: /\bJSON\.parse|JSON\.stringify/i, resource: { label: 'MDN: JSON', url: `${MDN}/docs/Web/JavaScript/Reference/Global_Objects/JSON`, description: 'Parse and stringify JSON data' } },
  { pattern: /\bRegExp|\/.*\/[gimsuy]/i, resource: { label: 'MDN: Regular Expressions', url: `${MDN}/docs/Web/JavaScript/Guide/Regular_expressions`, description: 'Pattern matching with regex' } },
  { pattern: /flexbox|display:\s*flex/i, resource: { label: 'MDN: Flexbox', url: `${MDN}/docs/Web/CSS/CSS_flexible_box_layout`, description: 'Flexible box layout' } },
  { pattern: /\bgrid\b|display:\s*grid/i, resource: { label: 'MDN: CSS Grid', url: `${MDN}/docs/Web/CSS/CSS_grid_layout`, description: 'CSS Grid layout system' } },
  { pattern: /media\s*quer/i, resource: { label: 'MDN: Media Queries', url: `${MDN}/docs/Web/CSS/CSS_media_queries`, description: 'Responsive design with media queries' } },
];

// ---------------------------------------------------------------------------
// Type-based fallback resources
// ---------------------------------------------------------------------------
const TYPE_FALLBACKS = {
  js: {
    label: 'MDN: JavaScript Guide',
    url: `${MDN}/docs/Web/JavaScript/Guide`,
    description: 'Comprehensive JavaScript guide',
  },
  html: {
    label: 'MDN: HTML Elements Reference',
    url: `${MDN}/docs/Web/HTML/Element`,
    description: 'Complete reference of HTML elements',
  },
  css: {
    label: 'MDN: CSS Reference',
    url: `${MDN}/docs/Web/CSS/Reference`,
    description: 'Complete CSS property reference',
  },
  'html-css': {
    label: 'MDN: Learn Web Development',
    url: `${MDN}/docs/Learn`,
    description: 'HTML, CSS, and JavaScript learning resources',
  },
};

// ---------------------------------------------------------------------------
// Helper: deduplicate resources by URL
// ---------------------------------------------------------------------------
function dedup(resources) {
  const seen = new Set();
  return resources.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Main: determine resources for a single exercise
// ---------------------------------------------------------------------------
function getResources(exercise) {
  const candidates = [];

  const tags = exercise.tags || [];
  const categoryPath = (exercise.category || []).join('/');
  const instructions = exercise.instructions || '';
  const type = exercise.type || 'js';

  // 1) Direct tag matches (highest priority — specific method/concept)
  //    Exclude generic difficulty tags
  const skipTags = new Set([
    'beginner', 'intermediate', 'advanced',
    'tier2', 'tier3', 'tier4', 'tier5',
    'no-built-ins', 'classic',
    // Thematic / domain tags (not concept-oriented)
    'mythical-creatures', 'rpg', 'e-commerce', 'taco',
    'airport', 'library', 'barber', 'restaurant', 'vhs',
    'classroom', 'crafting', 'spa', 'quest', 'spotify',
    'dj', 'racing', 'greeting', 'meals',
    'inventory', 'scheduling', 'money', 'time',
    'gold', 'threshold', 'spells', 'total', 'statistics',
    'pixel-perfect', 'component', 'complex', 'interactive',
    'accordion', 'pattern', 'path',
  ]);

  for (const tag of tags) {
    if (skipTags.has(tag)) continue;
    if (TAG_MAP[tag]) {
      candidates.push({ ...TAG_MAP[tag], priority: 1 });
    }
  }

  // 2) Category-based match
  if (CATEGORY_MAP[categoryPath]) {
    candidates.push({ ...CATEGORY_MAP[categoryPath], priority: 2 });
  }

  // 3) Instruction keyword scanning
  for (const { pattern, resource } of INSTRUCTION_KEYWORDS) {
    if (pattern.test(instructions)) {
      candidates.push({ ...resource, priority: 3 });
    }
  }

  // 4) Type-based fallback
  if (TYPE_FALLBACKS[type]) {
    candidates.push({ ...TYPE_FALLBACKS[type], priority: 4 });
  }

  // --- Select the best 1-3, preferring variety ---
  // Sort by priority (lower = better), then deduplicate
  candidates.sort((a, b) => a.priority - b.priority);
  const unique = dedup(candidates);

  // Remove priority field before returning
  const result = unique.slice(0, 3).map(({ label, url, description }) => ({
    label,
    url,
    description,
  }));

  // If we have more than 2 and the 3rd is a low-priority fallback identical
  // to one of the first two in concept, trim to 2
  return result.length > 0 ? result : [];
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const exercisesPath = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

let modified = 0;
let skipped = 0;
const summary = [];

for (const exercise of data.exercises) {
  // Only modify exercises with empty or missing resources
  if (exercise.resources && exercise.resources.length > 0) {
    skipped++;
    continue;
  }

  const resources = getResources(exercise);

  if (resources.length === 0) {
    console.log(`  [WARN] No resources found for exercise ${exercise.id}: ${exercise.title}`);
    skipped++;
    continue;
  }

  exercise.resources = resources;
  modified++;
  summary.push({
    id: exercise.id,
    title: exercise.title,
    count: resources.length,
    labels: resources.map((r) => r.label),
  });
}

// Write back
fs.writeFileSync(exercisesPath, JSON.stringify(data, null, 2) + '\n', 'utf8');

// Print summary
console.log('=== Add MDN Resources — Summary ===\n');
console.log(`Total exercises: ${data.exercises.length}`);
console.log(`Already had resources (skipped): ${skipped}`);
console.log(`Updated with new resources: ${modified}\n`);

console.log('--- Updated exercises ---');
for (const s of summary) {
  console.log(`  #${s.id} "${s.title}" → ${s.count} resource(s)`);
  for (const label of s.labels) {
    console.log(`      - ${label}`);
  }
}

console.log('\nDone.');
