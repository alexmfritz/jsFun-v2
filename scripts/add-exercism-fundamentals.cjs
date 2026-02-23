/**
 * Add 20 Exercism Fundamentals exercises (IDs 452-471) and the collection definition.
 * Exercises adapted from the Exercism JavaScript track (MIT License).
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

const exercises = [
  {
    id: 452,
    title: 'Two-Fer',
    type: 'js',
    tier: 1,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'conditionals', 'defaults'],
    description: 'Create a sentence using a name or a default value.',
    instructions: 'Write a function `twoFer(name)` that returns `"One for [name], one for me."`. If no name is given, use `"you"` as the default.\n\n```js\ntwoFer("Alice")  // => "One for Alice, one for me."\ntwoFer("Bob")    // => "One for Bob, one for me."\ntwoFer()         // => "One for you, one for me."\n```',
    starterCode: 'function twoFer(name) {\n  // your code here\n}',
    solution: 'function twoFer(name = "you") {\n  return `One for ${name}, one for me.`;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return twoFer;')();
  const r1 = fn('Alice');
  const r2 = fn('Bob');
  const r3 = fn();
  const r4 = fn('Zaphod');
  return [
    { pass: r1 === 'One for Alice, one for me.', description: 'Works with "Alice"', got: r1 },
    { pass: r2 === 'One for Bob, one for me.', description: 'Works with "Bob"', got: r2 },
    { pass: r3 === 'One for you, one for me.', description: 'Defaults to "you" when no name given', got: r3 },
    { pass: r4 === 'One for Zaphod, one for me.', description: 'Works with any name', got: r4 }
  ];
}`,
    hints: [
      'What happens when a function parameter is not provided? What value does it have?',
      'JavaScript supports default parameter values: `function greet(name = "world")`',
      'Use a default parameter `name = "you"` and template literals to build the string.'
    ],
    resources: [
      { label: 'MDN: Default parameters', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters', description: 'Default parameter values' },
      { label: 'MDN: Template literals', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals', description: 'Template literal syntax' }
    ]
  },
  {
    id: 453,
    title: 'Resistor Color',
    type: 'js',
    tier: 1,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'indexOf', 'beginner'],
    description: 'Look up the numeric value of a resistor band color.',
    instructions: 'Resistors have colored bands that encode their resistance value. The first 10 colors map to digits 0-9:\n\nBlack=0, Brown=1, Red=2, Orange=3, Yellow=4, Green=5, Blue=6, Violet=7, Grey=8, White=9\n\nWrite two functions:\n- `colorCode(color)` — returns the numeric value for a color name\n- `colors()` — returns an array of all color names in order\n\n```js\ncolorCode("black")  // => 0\ncolorCode("red")    // => 2\ncolorCode("white")  // => 9\ncolors() // => ["black","brown","red","orange","yellow","green","blue","violet","grey","white"]\n```',
    starterCode: 'function colorCode(color) {\n  // your code here\n}\n\nfunction colors() {\n  // your code here\n}',
    solution: 'const COLORS = ["black","brown","red","orange","yellow","green","blue","violet","grey","white"];\n\nfunction colorCode(color) {\n  return COLORS.indexOf(color);\n}\n\nfunction colors() {\n  return COLORS;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return { colorCode, colors };')();
  const cc = fn.colorCode;
  const cols = fn.colors;
  return [
    { pass: cc('black') === 0, description: 'Black is 0', got: String(cc('black')) },
    { pass: cc('brown') === 1, description: 'Brown is 1', got: String(cc('brown')) },
    { pass: cc('red') === 2, description: 'Red is 2', got: String(cc('red')) },
    { pass: cc('orange') === 3, description: 'Orange is 3', got: String(cc('orange')) },
    { pass: cc('white') === 9, description: 'White is 9', got: String(cc('white')) },
    { pass: Array.isArray(cols()) && cols().length === 10 && cols()[0] === 'black' && cols()[9] === 'white', description: 'colors() returns all 10 in order', got: JSON.stringify(cols()) }
  ];
}`,
    hints: [
      'How can you find the position of an item in an array?',
      'Store the color names in an array in order. The index of each color IS its numeric value.',
      'Use `Array.indexOf(color)` to look up the position. Return a copy of or reference to the colors array from `colors()`.'
    ],
    resources: [
      { label: 'MDN: Array.prototype.indexOf()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf', description: 'The indexOf method' },
      { label: 'MDN: Array', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array', description: 'JavaScript Array reference' }
    ]
  },
  {
    id: 454,
    title: 'Resistor Color Duo',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'math', 'composition'],
    description: 'Calculate a two-band resistor value from color names.',
    instructions: 'Each resistor has colored bands. The first two bands form a two-digit number: the first band is the tens digit, the second is the ones digit.\n\nColors: Black=0, Brown=1, Red=2, Orange=3, Yellow=4, Green=5, Blue=6, Violet=7, Grey=8, White=9\n\nWrite a function `decodedValue(colors)` that takes an array of color names and returns the two-digit number from the first two bands.\n\n```js\ndecodedValue(["brown", "black"])          // => 10\ndecodedValue(["blue", "grey"])            // => 68\ndecodedValue(["yellow", "violet", "red"]) // => 47 (ignore extra bands)\n```',
    starterCode: 'function decodedValue(colors) {\n  // your code here\n}',
    solution: 'function decodedValue(colors) {\n  const COLORS = ["black","brown","red","orange","yellow","green","blue","violet","grey","white"];\n  return COLORS.indexOf(colors[0]) * 10 + COLORS.indexOf(colors[1]);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return decodedValue;')();
  return [
    { pass: fn(["brown","black"]) === 10, description: 'Brown-Black = 10', got: String(fn(["brown","black"])) },
    { pass: fn(["blue","grey"]) === 68, description: 'Blue-Grey = 68', got: String(fn(["blue","grey"])) },
    { pass: fn(["yellow","violet","red"]) === 47, description: 'Yellow-Violet (ignore third) = 47', got: String(fn(["yellow","violet","red"])) },
    { pass: fn(["black","black"]) === 0, description: 'Black-Black = 0', got: String(fn(["black","black"])) },
    { pass: fn(["white","white"]) === 99, description: 'White-White = 99', got: String(fn(["white","white"])) }
  ];
}`,
    hints: [
      'How do you combine two single digits into a two-digit number?',
      'The first color gives the tens digit and the second gives the ones digit. Multiply the first by 10 and add the second.',
      'Look up each color in the color array to get its index (value), then compute `firstValue * 10 + secondValue`.'
    ],
    resources: [
      { label: 'MDN: Array.prototype.indexOf()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf', description: 'The indexOf method' }
    ]
  },
  {
    id: 455,
    title: 'Gigasecond',
    type: 'js',
    tier: 1,
    category: ['js-fundamentals', 'operators'],
    tags: ['math', 'numbers', 'operators'],
    description: 'Calculate the moment when someone has lived for 10^9 seconds.',
    instructions: 'A gigasecond is 10^9 (1,000,000,000) seconds.\n\nGiven a number representing a Unix timestamp in seconds, add a gigasecond to it and return the result.\n\n```js\ngigasecond(0)           // => 1000000000\ngigasecond(1000000000)  // => 2000000000\ngigasecond(1234567890)  // => 2234567890\n```',
    starterCode: 'function gigasecond(seconds) {\n  // your code here\n}',
    solution: 'function gigasecond(seconds) {\n  return seconds + 1e9;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return gigasecond;')();
  return [
    { pass: fn(0) === 1000000000, description: 'From 0', got: String(fn(0)) },
    { pass: fn(1000000000) === 2000000000, description: 'From 1 billion', got: String(fn(1000000000)) },
    { pass: fn(1234567890) === 2234567890, description: 'From arbitrary timestamp', got: String(fn(1234567890)) },
    { pass: fn(500) === 1000000500, description: 'From small number', got: String(fn(500)) }
  ];
}`,
    hints: [
      'What is 10 to the 9th power?',
      'A gigasecond is exactly 1,000,000,000 seconds. You can write this as `1e9` in JavaScript.',
      'Simply add 1e9 (or 1000000000) to the input and return the result.'
    ],
    resources: [
      { label: 'MDN: Arithmetic operators', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#arithmetic_operators', description: 'JavaScript arithmetic operators' }
    ]
  },
  {
    id: 456,
    title: 'Raindrops',
    type: 'js',
    tier: 1,
    category: ['js-fundamentals', 'conditionals'],
    tags: ['conditionals', 'modulo', 'strings'],
    description: 'Convert a number to raindrop sounds based on its factors.',
    instructions: 'Write a function `convert(number)` that converts a number to a string of raindrop sounds:\n\n- If the number has 3 as a factor, add "Pling"\n- If the number has 5 as a factor, add "Plang"\n- If the number has 7 as a factor, add "Plong"\n- If the number does not have 3, 5, or 7 as a factor, return the number as a string\n\n```js\nconvert(28)  // => "Plong" (divisible by 7)\nconvert(30)  // => "PlingPlang" (divisible by 3 and 5)\nconvert(34)  // => "34" (not divisible by 3, 5, or 7)\nconvert(105) // => "PlingPlangPlong" (divisible by 3, 5, and 7)\n```',
    starterCode: 'function convert(number) {\n  // your code here\n}',
    solution: 'function convert(number) {\n  let result = "";\n  if (number % 3 === 0) result += "Pling";\n  if (number % 5 === 0) result += "Plang";\n  if (number % 7 === 0) result += "Plong";\n  return result || String(number);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return convert;')();
  return [
    { pass: fn(1) === '1', description: '1 has no factors -> "1"', got: fn(1) },
    { pass: fn(3) === 'Pling', description: '3 -> "Pling"', got: fn(3) },
    { pass: fn(5) === 'Plang', description: '5 -> "Plang"', got: fn(5) },
    { pass: fn(7) === 'Plong', description: '7 -> "Plong"', got: fn(7) },
    { pass: fn(15) === 'PlingPlang', description: '15 -> "PlingPlang"', got: fn(15) },
    { pass: fn(21) === 'PlingPlong', description: '21 -> "PlingPlong"', got: fn(21) },
    { pass: fn(105) === 'PlingPlangPlong', description: '105 -> "PlingPlangPlong"', got: fn(105) },
    { pass: fn(34) === '34', description: '34 -> "34" (no factors)', got: fn(34) }
  ];
}`,
    hints: [
      'How do you check if a number is divisible by another number?',
      'Use the modulo operator (%) to check divisibility. Build up a string by appending sounds.',
      'Check `number % 3 === 0`, `number % 5 === 0`, `number % 7 === 0` and concatenate the corresponding sounds. If the result is empty, return the number as a string.'
    ],
    resources: [
      { label: 'MDN: Remainder (%)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder', description: 'The remainder operator' },
      { label: 'MDN: String', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String', description: 'JavaScript String reference' }
    ]
  },
  {
    id: 457,
    title: 'Darts',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'conditionals'],
    tags: ['conditionals', 'math', 'geometry'],
    description: 'Calculate the score for a dart landing at given coordinates.',
    instructions: 'Write a function `score(x, y)` that returns the points earned by a dart landing at coordinates (x, y) on a target:\n\n- Outside the target (distance > 10): 0 points\n- Outer ring (5 < distance <= 10): 1 point\n- Middle ring (1 < distance <= 5): 5 points\n- Bullseye (distance <= 1): 10 points\n\nThe distance from center is calculated as `sqrt(x² + y²)`.\n\n```js\nscore(0, 0)    // => 10 (bullseye)\nscore(0, 5)    // => 5  (middle ring)\nscore(-9, 0)   // => 1  (outer ring)\nscore(100, 0)  // => 0  (missed)\n```',
    starterCode: 'function score(x, y) {\n  // your code here\n}',
    solution: 'function score(x, y) {\n  const distance = Math.sqrt(x * x + y * y);\n  if (distance <= 1) return 10;\n  if (distance <= 5) return 5;\n  if (distance <= 10) return 1;\n  return 0;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return score;')();
  return [
    { pass: fn(0, 0) === 10, description: 'Bullseye at origin', got: String(fn(0, 0)) },
    { pass: fn(-0.1, -0.1) === 10, description: 'Near center is bullseye', got: String(fn(-0.1, -0.1)) },
    { pass: fn(0, 5) === 5, description: 'On middle ring boundary', got: String(fn(0, 5)) },
    { pass: fn(3, 4) === 5, description: 'Inside middle ring (distance 5)', got: String(fn(3, 4)) },
    { pass: fn(-9, 0) === 1, description: 'In outer ring', got: String(fn(-9, 0)) },
    { pass: fn(0, 10) === 1, description: 'On outer ring boundary', got: String(fn(0, 10)) },
    { pass: fn(11, 0) === 0, description: 'Outside the target', got: String(fn(11, 0)) },
    { pass: fn(-7, 7.1) === 0, description: 'Just outside target', got: String(fn(-7, 7.1)) }
  ];
}`,
    hints: [
      'How do you calculate the distance from a point to the origin?',
      'Use the Pythagorean theorem: distance = Math.sqrt(x*x + y*y). Then check which ring the distance falls into.',
      'Calculate distance, then use if/else: <= 1 gives 10 points, <= 5 gives 5, <= 10 gives 1, otherwise 0.'
    ],
    resources: [
      { label: 'MDN: Math.sqrt()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt', description: 'The Math.sqrt method' },
      { label: 'MDN: if...else', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else', description: 'The if...else statement' }
    ]
  },
  {
    id: 458,
    title: 'Space Age',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'operators'],
    tags: ['math', 'objects', 'operators'],
    description: 'Calculate how old someone is on different planets.',
    instructions: 'Given an age in seconds, calculate how old someone would be on various planets. An Earth year is 365.25 days (31,557,600 seconds). Each planet\'s orbital period relative to Earth:\n\n- Mercury: 0.2408467\n- Venus: 0.61519726\n- Earth: 1.0\n- Mars: 1.8808158\n- Jupiter: 11.862615\n- Saturn: 29.447498\n- Uranus: 84.016846\n- Neptune: 164.79132\n\nWrite a function `age(planet, seconds)` that returns the age rounded to 2 decimal places.\n\n```js\nage("earth", 1000000000)   // => 31.69\nage("mercury", 2134835688) // => 280.88\n```',
    starterCode: 'function age(planet, seconds) {\n  // your code here\n}',
    solution: 'function age(planet, seconds) {\n  const EARTH_YEAR = 31557600;\n  const orbits = {\n    mercury: 0.2408467, venus: 0.61519726, earth: 1.0,\n    mars: 1.8808158, jupiter: 11.862615, saturn: 29.447498,\n    uranus: 84.016846, neptune: 164.79132\n  };\n  return Math.round((seconds / (EARTH_YEAR * orbits[planet])) * 100) / 100;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return age;')();
  return [
    { pass: fn('earth', 1000000000) === 31.69, description: 'Age on Earth', got: String(fn('earth', 1000000000)) },
    { pass: fn('mercury', 2134835688) === 280.88, description: 'Age on Mercury', got: String(fn('mercury', 2134835688)) },
    { pass: fn('venus', 189839836) === 9.78, description: 'Age on Venus', got: String(fn('venus', 189839836)) },
    { pass: fn('mars', 2129871239) === 35.88, description: 'Age on Mars', got: String(fn('mars', 2129871239)) },
    { pass: fn('jupiter', 901876382) === 2.41, description: 'Age on Jupiter', got: String(fn('jupiter', 901876382)) },
    { pass: fn('saturn', 3000000000) === 3.23, description: 'Age on Saturn', got: String(fn('saturn', 3000000000)) }
  ];
}`,
    hints: [
      'How many seconds are in one Earth year?',
      'Divide the total seconds by the length of one Earth year to get Earth-years, then divide by the planet\'s orbital period.',
      'Earth year = 31,557,600 seconds. Planet age = seconds / (earthYear * orbitalPeriod). Round to 2 decimal places with `Math.round(x * 100) / 100`.'
    ],
    resources: [
      { label: 'MDN: Object', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object', description: 'JavaScript Object reference' },
      { label: 'MDN: Math.round()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round', description: 'The Math.round method' }
    ]
  },
  {
    id: 459,
    title: 'RNA Transcription',
    type: 'js',
    tier: 1,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'map', 'lookup'],
    description: 'Transcribe a DNA strand into its RNA complement.',
    instructions: 'Given a DNA strand, return its RNA complement by replacing each nucleotide:\n\n- G -> C\n- C -> G\n- T -> A\n- A -> U\n\n```js\ntoRna("G")    // => "C"\ntoRna("ACGTGGTCTTAA") // => "UGCACCAGAAUU"\ntoRna("")     // => ""\n```',
    starterCode: 'function toRna(dna) {\n  // your code here\n}',
    solution: 'function toRna(dna) {\n  const map = { G: "C", C: "G", T: "A", A: "U" };\n  return dna.split("").map(c => map[c]).join("");\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return toRna;')();
  return [
    { pass: fn('') === '', description: 'Empty string', got: fn('') },
    { pass: fn('G') === 'C', description: 'G -> C', got: fn('G') },
    { pass: fn('C') === 'G', description: 'C -> G', got: fn('C') },
    { pass: fn('T') === 'A', description: 'T -> A', got: fn('T') },
    { pass: fn('A') === 'U', description: 'A -> U', got: fn('A') },
    { pass: fn('ACGTGGTCTTAA') === 'UGCACCAGAAUU', description: 'Full strand transcription', got: fn('ACGTGGTCTTAA') }
  ];
}`,
    hints: [
      'Can you create a mapping from each DNA nucleotide to its RNA complement?',
      'Use an object as a lookup table: `{ G: "C", C: "G", T: "A", A: "U" }`. Then transform each character.',
      'Split the string into characters, map each through the lookup object, and join back together.'
    ],
    resources: [
      { label: 'MDN: String.prototype.split()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split', description: 'The split method' },
      { label: 'MDN: Array.prototype.map()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', description: 'The map method' }
    ]
  },
  {
    id: 460,
    title: 'Pangram',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'sets', 'iteration'],
    description: 'Determine if a sentence uses every letter of the alphabet.',
    instructions: 'A pangram is a sentence that uses every letter of the alphabet at least once (e.g., "The quick brown fox jumps over the lazy dog").\n\nWrite a function `isPangram(sentence)` that returns `true` if the sentence is a pangram, `false` otherwise. Case should be ignored.\n\n```js\nisPangram("The quick brown fox jumps over the lazy dog") // => true\nisPangram("a quick movement of the enemy")              // => false\nisPangram("")                                           // => false\n```',
    starterCode: 'function isPangram(sentence) {\n  // your code here\n}',
    solution: 'function isPangram(sentence) {\n  const letters = new Set(sentence.toLowerCase().replace(/[^a-z]/g, ""));\n  return letters.size === 26;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return isPangram;')();
  return [
    { pass: fn('The quick brown fox jumps over the lazy dog') === true, description: 'Classic pangram', got: String(fn('The quick brown fox jumps over the lazy dog')) },
    { pass: fn('a quick movement of the enemy') === false, description: 'Missing letters', got: String(fn('a quick movement of the enemy')) },
    { pass: fn('') === false, description: 'Empty string', got: String(fn('')) },
    { pass: fn('the quick brown fox jumps over with lazy FIG and target') === false, description: 'Almost pangram (still missing letters)', got: String(fn('the quick brown fox jumps over with lazy FIG and target')) },
    { pass: fn('ABCDEFGHIJKLMNOPQRSTUVWXYZ') === true, description: 'All uppercase', got: String(fn('ABCDEFGHIJKLMNOPQRSTUVWXYZ')) },
    { pass: fn('"Five quacking Zephyrs jolt my wax bed."') === true, description: 'Pangram with punctuation', got: String(fn('"Five quacking Zephyrs jolt my wax bed."')) }
  ];
}`,
    hints: [
      'How many unique letters does the English alphabet have?',
      'If you collect all unique lowercase letters from the sentence, a pangram will have exactly 26.',
      'Convert to lowercase, extract only a-z characters, put them in a Set, and check if the Set size is 26.'
    ],
    resources: [
      { label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set', description: 'JavaScript Set reference' },
      { label: 'MDN: String.prototype.toLowerCase()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase', description: 'The toLowerCase method' }
    ]
  },
  {
    id: 461,
    title: 'Isogram',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'sets', 'uniqueness'],
    description: 'Determine if a word has no repeating letters.',
    instructions: 'An isogram is a word with no repeating letters (case-insensitive). Spaces and hyphens are allowed to appear multiple times.\n\nWrite a function `isIsogram(word)` that returns `true` if the word is an isogram.\n\n```js\nisIsogram("lumberjacks")   // => true\nisIsogram("background")    // => true\nisIsogram("downstream")    // => true\nisIsogram("isograms")      // => false (s appears twice)\nisIsogram("eleven")        // => false (e appears three times)\nisIsogram("")              // => true\n```',
    starterCode: 'function isIsogram(word) {\n  // your code here\n}',
    solution: 'function isIsogram(word) {\n  const letters = word.toLowerCase().replace(/[^a-z]/g, "");\n  return new Set(letters).size === letters.length;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return isIsogram;')();
  return [
    { pass: fn('') === true, description: 'Empty string is an isogram', got: String(fn('')) },
    { pass: fn('lumberjacks') === true, description: '"lumberjacks" is an isogram', got: String(fn('lumberjacks')) },
    { pass: fn('isograms') === false, description: '"isograms" has repeating s', got: String(fn('isograms')) },
    { pass: fn('eleven') === false, description: '"eleven" has repeating e', got: String(fn('eleven')) },
    { pass: fn('subdermatoglyphic') === true, description: 'Longest known isogram', got: String(fn('subdermatoglyphic')) },
    { pass: fn('Alphabet') === false, description: 'Case-insensitive: "Alphabet" has two a\'s', got: String(fn('Alphabet')) },
    { pass: fn('six-year-old') === true, description: 'Hyphens are ignored', got: String(fn('six-year-old')) }
  ];
}`,
    hints: [
      'How can you check if all characters in a string are unique?',
      'A Set only stores unique values. If the Set of letters has the same size as the total letter count, there are no duplicates.',
      'Extract only letters (ignore spaces/hyphens), lowercase them, and compare Set size to string length.'
    ],
    resources: [
      { label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set', description: 'JavaScript Set reference' },
      { label: 'MDN: Regular expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions', description: 'Regular expressions guide' }
    ]
  },
  {
    id: 462,
    title: 'Hamming Distance',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'loops', 'comparison'],
    description: 'Count the differences between two DNA strands.',
    instructions: 'The Hamming distance between two strings of equal length is the number of positions where the corresponding characters are different.\n\nWrite a function `compute(strand1, strand2)` that returns the Hamming distance. If the strands have different lengths, throw an Error.\n\n```js\ncompute("GAGCCTACTAACGGGAT", "CATCGTAATGACGGCCT") // => 7\ncompute("GGACG", "GGTCG")                         // => 1\ncompute("", "")                                    // => 0\n```',
    starterCode: 'function compute(strand1, strand2) {\n  // your code here\n}',
    solution: 'function compute(strand1, strand2) {\n  if (strand1.length !== strand2.length) throw new Error("strands must be of equal length");\n  let count = 0;\n  for (let i = 0; i < strand1.length; i++) {\n    if (strand1[i] !== strand2[i]) count++;\n  }\n  return count;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return compute;')();
  let errorThrown = false;
  try { fn('AATG', 'AAA'); } catch(e) { errorThrown = true; }
  return [
    { pass: fn('', '') === 0, description: 'Empty strands', got: String(fn('', '')) },
    { pass: fn('GGACTGA', 'GGACTGA') === 0, description: 'Identical strands', got: String(fn('GGACTGA', 'GGACTGA')) },
    { pass: fn('GGACG', 'GGTCG') === 1, description: 'One difference', got: String(fn('GGACG', 'GGTCG')) },
    { pass: fn('GAGCCTACTAACGGGAT', 'CATCGTAATGACGGCCT') === 7, description: 'Long strands', got: String(fn('GAGCCTACTAACGGGAT', 'CATCGTAATGACGGCCT')) },
    { pass: errorThrown, description: 'Throws on unequal lengths', got: errorThrown ? 'Error thrown' : 'No error' }
  ];
}`,
    hints: [
      'How do you compare two strings character by character?',
      'Loop through both strings simultaneously and count positions where characters differ.',
      'First check that lengths match (throw Error if not). Then loop with a counter, incrementing when `strand1[i] !== strand2[i]`.'
    ],
    resources: [
      { label: 'MDN: String', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String', description: 'JavaScript String reference' },
      { label: 'MDN: Error', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error', description: 'JavaScript Error reference' }
    ]
  },
  {
    id: 463,
    title: 'Collatz Conjecture',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'patterns'],
    tags: ['loops', 'math', 'sequences'],
    description: 'Count the steps to reach 1 using the Collatz sequence.',
    instructions: 'The Collatz Conjecture states that for any positive integer n:\n- If n is even, divide it by 2\n- If n is odd, multiply by 3 and add 1\n\nRepeating this process will always eventually reach 1.\n\nWrite a function `steps(n)` that returns how many steps it takes to reach 1. Throw an Error for non-positive numbers.\n\n```js\nsteps(1)   // => 0\nsteps(16)  // => 4 (16 -> 8 -> 4 -> 2 -> 1)\nsteps(12)  // => 9\n```',
    starterCode: 'function steps(n) {\n  // your code here\n}',
    solution: 'function steps(n) {\n  if (n <= 0) throw new Error("Only positive integers are allowed");\n  let count = 0;\n  while (n !== 1) {\n    n = n % 2 === 0 ? n / 2 : 3 * n + 1;\n    count++;\n  }\n  return count;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return steps;')();
  let errorThrown = false;
  try { fn(0); } catch(e) { errorThrown = true; }
  return [
    { pass: fn(1) === 0, description: '1 is already at 1 (0 steps)', got: String(fn(1)) },
    { pass: fn(16) === 4, description: '16 takes 4 steps', got: String(fn(16)) },
    { pass: fn(12) === 9, description: '12 takes 9 steps', got: String(fn(12)) },
    { pass: fn(1000000) === 152, description: '1000000 takes 152 steps', got: String(fn(1000000)) },
    { pass: errorThrown, description: 'Throws on 0', got: errorThrown ? 'Error thrown' : 'No error' }
  ];
}`,
    hints: [
      'What are the two possible operations at each step?',
      'Use a while loop that runs until n equals 1. At each step, check if n is even or odd and apply the corresponding rule.',
      'Count steps with a counter variable. While n !== 1: if even, n = n/2; if odd, n = 3*n + 1. Increment counter each iteration.'
    ],
    resources: [
      { label: 'MDN: while', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while', description: 'The while statement' },
      { label: 'MDN: Remainder (%)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder', description: 'The remainder operator' }
    ]
  },
  {
    id: 464,
    title: 'Triangle',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'conditionals'],
    tags: ['conditionals', 'validation', 'math'],
    description: 'Determine if a triangle is equilateral, isosceles, or scalene.',
    instructions: 'Write a function `triangle(a, b, c)` that returns what kind of triangle is formed by three sides:\n\n- **"equilateral"**: all three sides are equal\n- **"isosceles"**: exactly two sides are equal\n- **"scalene"**: no sides are equal\n- **"invalid"**: sides cannot form a triangle (any side is 0, or any side is >= sum of other two)\n\n```js\ntriangle(2, 2, 2) // => "equilateral"\ntriangle(3, 4, 4) // => "isosceles"\ntriangle(3, 4, 5) // => "scalene"\ntriangle(0, 0, 0) // => "invalid"\ntriangle(1, 1, 3) // => "invalid"\n```',
    starterCode: 'function triangle(a, b, c) {\n  // your code here\n}',
    solution: 'function triangle(a, b, c) {\n  if (a <= 0 || b <= 0 || c <= 0) return "invalid";\n  if (a + b <= c || a + c <= b || b + c <= a) return "invalid";\n  if (a === b && b === c) return "equilateral";\n  if (a === b || b === c || a === c) return "isosceles";\n  return "scalene";\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return triangle;')();
  return [
    { pass: fn(2, 2, 2) === 'equilateral', description: 'Equilateral triangle', got: fn(2, 2, 2) },
    { pass: fn(3, 4, 4) === 'isosceles', description: 'Isosceles triangle', got: fn(3, 4, 4) },
    { pass: fn(3, 4, 5) === 'scalene', description: 'Scalene triangle', got: fn(3, 4, 5) },
    { pass: fn(0, 0, 0) === 'invalid', description: 'Zero sides are invalid', got: fn(0, 0, 0) },
    { pass: fn(1, 1, 3) === 'invalid', description: 'Violates triangle inequality', got: fn(1, 1, 3) },
    { pass: fn(5, 4, 6) === 'scalene', description: 'Another scalene', got: fn(5, 4, 6) },
    { pass: fn(10, 10, 2) === 'isosceles', description: 'Isosceles with first two equal', got: fn(10, 10, 2) }
  ];
}`,
    hints: [
      'What conditions must three sides satisfy to form a valid triangle?',
      'First validate: all sides must be positive, and each side must be less than the sum of the other two. Then classify.',
      'Check validity first (sides > 0 and triangle inequality). Then: all equal = equilateral, any two equal = isosceles, otherwise scalene.'
    ],
    resources: [
      { label: 'MDN: if...else', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else', description: 'The if...else statement' }
    ]
  },
  {
    id: 465,
    title: 'Difference of Squares',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'operators'],
    tags: ['math', 'loops', 'formulas'],
    description: 'Find the difference between the square of the sum and the sum of the squares.',
    instructions: 'Given a natural number n, compute:\n\n- **Square of the sum**: (1 + 2 + ... + n)²\n- **Sum of the squares**: 1² + 2² + ... + n²\n- **Difference**: square of the sum minus sum of the squares\n\nWrite three functions: `squareOfSum(n)`, `sumOfSquares(n)`, and `differenceOfSquares(n)`.\n\n```js\nsquareOfSum(10)         // => 3025\nsumOfSquares(10)        // => 385\ndifferenceOfSquares(10) // => 2640\n```',
    starterCode: 'function squareOfSum(n) {\n  // your code here\n}\n\nfunction sumOfSquares(n) {\n  // your code here\n}\n\nfunction differenceOfSquares(n) {\n  // your code here\n}',
    solution: 'function squareOfSum(n) {\n  const sum = n * (n + 1) / 2;\n  return sum * sum;\n}\n\nfunction sumOfSquares(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) total += i * i;\n  return total;\n}\n\nfunction differenceOfSquares(n) {\n  return squareOfSum(n) - sumOfSquares(n);\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return { squareOfSum, sumOfSquares, differenceOfSquares };')();
  return [
    { pass: fn.squareOfSum(5) === 225, description: 'Square of sum for 5', got: String(fn.squareOfSum(5)) },
    { pass: fn.squareOfSum(10) === 3025, description: 'Square of sum for 10', got: String(fn.squareOfSum(10)) },
    { pass: fn.sumOfSquares(5) === 55, description: 'Sum of squares for 5', got: String(fn.sumOfSquares(5)) },
    { pass: fn.sumOfSquares(10) === 385, description: 'Sum of squares for 10', got: String(fn.sumOfSquares(10)) },
    { pass: fn.differenceOfSquares(5) === 170, description: 'Difference for 5', got: String(fn.differenceOfSquares(5)) },
    { pass: fn.differenceOfSquares(100) === 25164150, description: 'Difference for 100', got: String(fn.differenceOfSquares(100)) }
  ];
}`,
    hints: [
      'Can you compute the sum 1+2+...+n without a loop?',
      'The sum of 1 to n is `n*(n+1)/2`. You can square that result. For sum of squares, loop and add i*i.',
      'squareOfSum: use the formula n*(n+1)/2, then square it. sumOfSquares: loop from 1 to n adding i*i. difference: subtract one from the other.'
    ],
    resources: [
      { label: 'MDN: Loops and iteration', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration', description: 'JavaScript loops and iteration' },
      { label: 'MDN: Math', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math', description: 'JavaScript Math reference' }
    ]
  },
  {
    id: 466,
    title: 'ETL',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'objects'],
    tags: ['objects', 'arrays', 'transform'],
    description: 'Transform data from one format to another.',
    instructions: 'In the old Scrabble scoring system, data was stored as score → letters:\n```js\n{ 1: ["A","E","I","O","U"], 10: ["Q","Z"] }\n```\n\nIn the new system, it should be letter → score (lowercase):\n```js\n{ a: 1, e: 1, i: 1, o: 1, u: 1, q: 10, z: 10 }\n```\n\nWrite a function `transform(old)` that converts from the old format to the new format.\n\n```js\ntransform({ 1: ["A","E"], 2: ["D","G"] })\n// => { a: 1, e: 1, d: 2, g: 2 }\n```',
    starterCode: 'function transform(old) {\n  // your code here\n}',
    solution: 'function transform(old) {\n  const result = {};\n  for (const [score, letters] of Object.entries(old)) {\n    for (const letter of letters) {\n      result[letter.toLowerCase()] = Number(score);\n    }\n  }\n  return result;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return transform;')();
  const r1 = fn({ 1: ['A','E','I','O','U'] });
  const r2 = fn({ 1: ['A'], 2: ['D','G'] });
  const r3 = fn({});
  return [
    { pass: r1.a === 1 && r1.e === 1 && r1.u === 1, description: 'Score 1 letters become lowercase with value 1', got: JSON.stringify(r1) },
    { pass: r2.a === 1 && r2.d === 2 && r2.g === 2, description: 'Multiple scores transformed correctly', got: JSON.stringify(r2) },
    { pass: Object.keys(r3).length === 0, description: 'Empty input produces empty output', got: JSON.stringify(r3) },
    { pass: r1.A === undefined, description: 'Keys are lowercase (no uppercase keys)', got: String(r1.A) }
  ];
}`,
    hints: [
      'How do you iterate over an object\'s key-value pairs?',
      'Use Object.entries() to get [score, letters] pairs. Then loop through each letter array.',
      'For each [score, letters] pair, loop through letters and set result[letter.toLowerCase()] = Number(score).'
    ],
    resources: [
      { label: 'MDN: Object.entries()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries', description: 'The Object.entries method' },
      { label: 'MDN: for...of', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of', description: 'The for...of statement' }
    ]
  },
  {
    id: 467,
    title: 'Armstrong Numbers',
    type: 'js',
    tier: 2,
    category: ['algorithms', 'patterns'],
    tags: ['math', 'loops', 'digits'],
    description: 'Determine if a number is an Armstrong number.',
    instructions: 'An Armstrong number is a number that equals the sum of its own digits each raised to the power of the number of digits.\n\nFor example:\n- 9 is Armstrong: 9¹ = 9\n- 153 is Armstrong: 1³ + 5³ + 3³ = 1 + 125 + 27 = 153\n- 154 is NOT Armstrong: 1³ + 5³ + 4³ = 1 + 125 + 64 = 190\n\nWrite a function `isArmstrong(n)` that returns `true` if n is an Armstrong number.\n\n```js\nisArmstrong(9)   // => true\nisArmstrong(153) // => true\nisArmstrong(154) // => false\n```',
    starterCode: 'function isArmstrong(n) {\n  // your code here\n}',
    solution: 'function isArmstrong(n) {\n  const digits = String(n).split("");\n  const power = digits.length;\n  const sum = digits.reduce((acc, d) => acc + Math.pow(Number(d), power), 0);\n  return sum === n;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return isArmstrong;')();
  return [
    { pass: fn(0) === true, description: '0 is Armstrong', got: String(fn(0)) },
    { pass: fn(5) === true, description: 'Single digit 5 is Armstrong', got: String(fn(5)) },
    { pass: fn(9) === true, description: 'Single digit 9 is Armstrong', got: String(fn(9)) },
    { pass: fn(10) === false, description: '10 is not Armstrong', got: String(fn(10)) },
    { pass: fn(153) === true, description: '153 is Armstrong', got: String(fn(153)) },
    { pass: fn(154) === false, description: '154 is not Armstrong', got: String(fn(154)) },
    { pass: fn(9474) === true, description: '9474 is Armstrong (4 digits)', got: String(fn(9474)) }
  ];
}`,
    hints: [
      'How many digits does the number have? How do you extract individual digits?',
      'Convert to string to get digit count and individual digits. Raise each digit to the power of the total digit count.',
      'Split the number into digits, raise each to the power of the digit count, sum them up, and compare to the original number.'
    ],
    resources: [
      { label: 'MDN: Math.pow()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow', description: 'The Math.pow method' },
      { label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce', description: 'The reduce method' }
    ]
  },
  {
    id: 468,
    title: 'Bob',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'conditionals'],
    tags: ['strings', 'conditionals', 'logic'],
    description: 'Respond differently based on what is said to Bob.',
    instructions: 'Bob is a lackadaisical teenager. He responds to messages according to these rules:\n\n- **"Whoa, chill out!"** if you YELL at him (all caps, with at least one letter)\n- **"Sure."** if you ask him a question (ends with "?")\n- **"Calm down, I know what I\'m doing!"** if you yell a question at him\n- **"Fine. Be that way!"** if you say nothing (empty or whitespace only)\n- **"Whatever."** for everything else\n\nNote: Yelling a question takes priority — check for that first.\n\n```js\nbob("WATCH OUT!")        // => "Whoa, chill out!"\nbob("Does this work?")   // => "Sure."\nbob("WHAT?!")            // => "Calm down, I know what I\'m doing!"\nbob("   ")               // => "Fine. Be that way!"\nbob("Hello there")       // => "Whatever."\n```',
    starterCode: 'function bob(message) {\n  // your code here\n}',
    solution: 'function bob(message) {\n  const trimmed = message.trim();\n  if (trimmed === "") return "Fine. Be that way!";\n  const isQuestion = trimmed.endsWith("?");\n  const hasLetters = /[a-zA-Z]/.test(trimmed);\n  const isYelling = hasLetters && trimmed === trimmed.toUpperCase();\n  if (isYelling && isQuestion) return "Calm down, I know what I\'m doing!";\n  if (isYelling) return "Whoa, chill out!";\n  if (isQuestion) return "Sure.";\n  return "Whatever.";\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return bob;')();
  return [
    { pass: fn('Tom-ay-to, tom-ah-to.') === 'Whatever.', description: 'Normal statement', got: fn('Tom-ay-to, tom-ah-to.') },
    { pass: fn('WATCH OUT!') === 'Whoa, chill out!', description: 'Yelling', got: fn('WATCH OUT!') },
    { pass: fn('Does this work?') === 'Sure.', description: 'Question', got: fn('Does this work?') },
    { pass: fn('WHAT?') === "Calm down, I know what I'm doing!", description: 'Yelling a question', got: fn('WHAT?') },
    { pass: fn('') === 'Fine. Be that way!', description: 'Silence (empty)', got: fn('') },
    { pass: fn('   ') === 'Fine. Be that way!', description: 'Silence (whitespace)', got: fn('   ') },
    { pass: fn('1, 2, 3') === 'Whatever.', description: 'Numbers only (not yelling)', got: fn('1, 2, 3') },
    { pass: fn('4?') === 'Sure.', description: 'Numeric question', got: fn('4?') }
  ];
}`,
    hints: [
      'What are the different conditions you need to check? In what order should you check them?',
      'Determine if the message is empty, a question (ends with ?), or yelling (all uppercase with at least one letter). Check yelling-question first since it combines two conditions.',
      'Trim the message. Check empty first. Then determine isQuestion (endsWith "?") and isYelling (has letters AND equals its uppercase version). Check yelling+question, then yelling, then question, then default.'
    ],
    resources: [
      { label: 'MDN: String.prototype.trim()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim', description: 'The trim method' },
      { label: 'MDN: String.prototype.endsWith()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith', description: 'The endsWith method' }
    ]
  },
  {
    id: 469,
    title: 'Nucleotide Count',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'objects'],
    tags: ['objects', 'strings', 'counting'],
    description: 'Count occurrences of each nucleotide in a DNA strand.',
    instructions: 'Given a DNA strand, count how many times each nucleotide (A, C, G, T) appears.\n\nWrite a function `nucleotideCounts(strand)` that returns an object with counts.\n\nThrow an Error if the strand contains invalid characters.\n\n```js\nnucleotideCounts("")          // => { A: 0, C: 0, G: 0, T: 0 }\nnucleotideCounts("GATTACA")   // => { A: 3, C: 1, G: 1, T: 2 }\n```',
    starterCode: 'function nucleotideCounts(strand) {\n  // your code here\n}',
    solution: 'function nucleotideCounts(strand) {\n  const counts = { A: 0, C: 0, G: 0, T: 0 };\n  for (const ch of strand) {\n    if (!(ch in counts)) throw new Error("Invalid nucleotide in strand");\n    counts[ch]++;\n  }\n  return counts;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return nucleotideCounts;')();
  const r1 = fn('');
  const r2 = fn('GATTACA');
  const r3 = fn('GGGG');
  let errorThrown = false;
  try { fn('INVALID'); } catch(e) { errorThrown = true; }
  return [
    { pass: r1.A === 0 && r1.C === 0 && r1.G === 0 && r1.T === 0, description: 'Empty strand', got: JSON.stringify(r1) },
    { pass: r2.A === 3 && r2.C === 1 && r2.G === 1 && r2.T === 2, description: 'GATTACA', got: JSON.stringify(r2) },
    { pass: r3.G === 4 && r3.A === 0, description: 'All same nucleotide', got: JSON.stringify(r3) },
    { pass: errorThrown, description: 'Throws on invalid characters', got: errorThrown ? 'Error thrown' : 'No error' }
  ];
}`,
    hints: [
      'How do you count occurrences of specific characters in a string?',
      'Start with an object { A: 0, C: 0, G: 0, T: 0 } and increment as you iterate through the string.',
      'Loop through each character. If it\'s a valid nucleotide, increment its count. If not, throw an Error.'
    ],
    resources: [
      { label: 'MDN: Object', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object', description: 'JavaScript Object reference' },
      { label: 'MDN: for...of', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of', description: 'The for...of statement' }
    ]
  },
  {
    id: 470,
    title: 'Run-Length Encoding',
    type: 'js',
    tier: 3,
    category: ['algorithms', 'patterns'],
    tags: ['strings', 'encoding', 'algorithms'],
    description: 'Encode and decode strings using run-length encoding.',
    instructions: 'Run-length encoding compresses consecutive identical characters by storing the count and the character.\n\nWrite two functions:\n- `encode(str)` — compress the string (omit count of 1)\n- `decode(str)` — decompress back to original\n\n```js\nencode("AABCCCDEEEE") // => "2AB3CD4E"\nencode("WWWWWWWWWWWW") // => "12W"\nencode("A")           // => "A"\ndecode("2AB3CD4E")    // => "AABCCCDEEEE"\ndecode("12W")         // => "WWWWWWWWWWWW"\n```',
    starterCode: 'function encode(str) {\n  // your code here\n}\n\nfunction decode(str) {\n  // your code here\n}',
    solution: 'function encode(str) {\n  return str.replace(/(.)\\1*/g, (match) => {\n    return (match.length > 1 ? match.length : "") + match[0];\n  });\n}\n\nfunction decode(str) {\n  return str.replace(/(\\d+)(.)/g, (_, count, char) => {\n    return char.repeat(Number(count));\n  });\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return { encode, decode };')();
  return [
    { pass: fn.encode('') === '', description: 'Encode empty string', got: fn.encode('') },
    { pass: fn.encode('AABCCCDEEEE') === '2AB3CD4E', description: 'Encode mixed runs', got: fn.encode('AABCCCDEEEE') },
    { pass: fn.encode('A') === 'A', description: 'Encode single char (no count)', got: fn.encode('A') },
    { pass: fn.encode('WWWWWWWWWWWWWW') === '14W', description: 'Encode long run', got: fn.encode('WWWWWWWWWWWWWW') },
    { pass: fn.decode('2AB3CD4E') === 'AABCCCDEEEE', description: 'Decode mixed runs', got: fn.decode('2AB3CD4E') },
    { pass: fn.decode('14W') === 'WWWWWWWWWWWWWW', description: 'Decode long run', got: fn.decode('14W') },
    { pass: fn.decode(fn.encode('zzz ZZ  zZ')) === 'zzz ZZ  zZ', description: 'Encode then decode roundtrip', got: fn.decode(fn.encode('zzz ZZ  zZ')) }
  ];
}`,
    hints: [
      'For encoding: how do you identify runs of consecutive identical characters?',
      'For encoding, you can use regex `/(.)\\1*/g` to match runs. For decoding, match `/(\\d+)(.)/g` to find count+char pairs.',
      'Encode: replace each run with count (omit if 1) + character. Decode: replace each count+char pair with char repeated count times.'
    ],
    resources: [
      { label: 'MDN: Regular expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions', description: 'Regular expressions guide' },
      { label: 'MDN: String.prototype.repeat()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat', description: 'The repeat method' }
    ]
  },
  {
    id: 471,
    title: 'Series',
    type: 'js',
    tier: 2,
    category: ['data-structures', 'strings'],
    tags: ['strings', 'sliding-window', 'arrays'],
    description: 'Extract all contiguous substrings of a given length.',
    instructions: 'Given a string of digits and a length, return all contiguous substrings of that length.\n\nThrow an Error if the requested length is larger than the string or is zero/negative.\n\n```js\nseries("01234", 1) // => ["0","1","2","3","4"]\nseries("01234", 2) // => ["01","12","23","34"]\nseries("01234", 5) // => ["01234"]\n```',
    starterCode: 'function series(digits, length) {\n  // your code here\n}',
    solution: 'function series(digits, length) {\n  if (length <= 0 || length > digits.length) throw new Error("Invalid length");\n  const result = [];\n  for (let i = 0; i <= digits.length - length; i++) {\n    result.push(digits.slice(i, i + length));\n  }\n  return result;\n}',
    testRunner: `(code) => {
  const fn = new Function(code + '; return series;')();
  const r1 = fn('01234', 1);
  const r2 = fn('01234', 2);
  const r3 = fn('01234', 5);
  const r4 = fn('49142', 3);
  let errorThrown = false;
  try { fn('01234', 6); } catch(e) { errorThrown = true; }
  return [
    { pass: JSON.stringify(r1) === '["0","1","2","3","4"]', description: 'Slices of length 1', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '["01","12","23","34"]', description: 'Slices of length 2', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '["01234"]', description: 'Slice of full length', got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === '["491","914","142"]', description: 'Slices of length 3', got: JSON.stringify(r4) },
    { pass: errorThrown, description: 'Throws when length > string length', got: errorThrown ? 'Error thrown' : 'No error' }
  ];
}`,
    hints: [
      'How would you extract all overlapping windows of a given size from a string?',
      'Use a sliding window: start at index 0 and slide forward, taking a substring of the desired length at each position.',
      'Loop from i = 0 to digits.length - length. At each position, slice out a substring of the given length and add it to the result array.'
    ],
    resources: [
      { label: 'MDN: String.prototype.slice()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice', description: 'The String slice method' },
      { label: 'MDN: Array.prototype.push()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push', description: 'The push method' }
    ]
  }
];

// Add exercises
data.exercises.push(...exercises);

// Add collection
data.collections.push({
  id: 'exercism-fundamentals',
  name: 'Exercism Fundamentals',
  description: 'Beginner and intermediate exercises from the Exercism JavaScript track. Start with basic string and number operations, then progress to pattern recognition and data transformation.',
  exerciseIds: exercises.map(e => e.id),
  color: '#c084fc',
  source: 'Exercism',
  license: 'MIT',
  attribution: 'Exercises adapted from the Exercism JavaScript track (exercism.org). Used under the MIT License. Copyright (c) 2021 Exercism.'
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Added ${exercises.length} Exercism Fundamentals exercises (IDs ${exercises[0].id}-${exercises[exercises.length-1].id})`);
console.log(`Total exercises: ${data.exercises.length}`);
console.log(`Total collections: ${data.collections.length}`);
