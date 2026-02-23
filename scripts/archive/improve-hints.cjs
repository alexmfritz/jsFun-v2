/**
 * improve-hints.cjs
 *
 * Reads exercises.json, identifies exercises whose first hint is generic
 * (starts with "Consider using", "This exercise involves", "Look into",
 * or "Think about" and doesn't ask a guiding question), then rewrites
 * hints[0] to a contextual guiding question based on each exercise's
 * instructions, solution, and tags.
 *
 * Only modifies hints[0] — leaves hints[1] and hints[2] unchanged.
 */

const fs = require('fs');
const path = require('path');

const EXERCISES_PATH = path.join(__dirname, '..', 'exercises', 'exercises.json');

// ---------------------------------------------------------------------------
// 1. Detection: is hints[0] generic?
// ---------------------------------------------------------------------------

const GENERIC_PREFIXES = [
  /^Consider using\b/i,
  /^This exercise involves\b/i,
  /^Look into\b/i,
  /^Think about\b/i,
];

function isGenericHint(hint) {
  if (!hint) return false;
  // Already a question — skip
  if (hint.trim().endsWith('?')) return false;
  return GENERIC_PREFIXES.some(re => re.test(hint.trim()));
}

// ---------------------------------------------------------------------------
// 2. Helpers to extract info from exercises
// ---------------------------------------------------------------------------

/** Pull mentioned method/function names from instructions text */
function extractMentionedMethods(text) {
  if (!text) return [];
  const backtickMatches = text.match(/`([a-zA-Z_$][\w$.]*(?:\(\))?)`/g) || [];
  return backtickMatches.map(m => m.replace(/`/g, '').replace(/\(\)$/, ''));
}

/** Pull the function/class name the student needs to write */
function extractTargetName(instructions) {
  if (!instructions) return null;
  // "Write a function called `foo`"
  const fnMatch = instructions.match(/function\s+called\s+`(\w+)`/i);
  if (fnMatch) return fnMatch[1];
  // "Create a `Foo` class"
  const classMatch = instructions.match(/(?:Create|Build)\s+(?:a|an|two|three|four|five)\s+(?:classes?:?\s+)?(?:\*\*)?`?(\w+)`?(?:\*\*)?/i);
  if (classMatch) return classMatch[1];
  return null;
}

/** Check if solution uses a specific pattern */
function solutionUses(solution, pattern) {
  if (!solution) return false;
  return pattern.test(solution);
}

/** Check if instructions mention "Do not use" / "No Built-in" constraints */
function hasNoBuiltinConstraint(instructions) {
  if (!instructions) return false;
  return /do not use the built-in/i.test(instructions) || /no built-in/i.test(instructions);
}

/** Get what the function should return from examples */
function getReturnShape(instructions, solution) {
  if (!solution) return 'unknown';
  if (/return\s+\[/.test(solution) || /\[\s*\.\.\./.test(solution)) return 'array';
  if (/return\s+\{/.test(solution)) return 'object';
  if (/return\s+`/.test(solution) || /return\s+"/.test(solution) || /return\s+'/.test(solution)) return 'string';
  if (/return\s+true|return\s+false/.test(solution)) return 'boolean';
  if (/return\s+\d/.test(solution) || /return\s+sum|return\s+count|return\s+total/.test(solution)) return 'number';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// 3. Category-aware hint generators
// ---------------------------------------------------------------------------

/**
 * Generate a contextual guiding question for a given exercise.
 * Returns null if we can't generate a good one (shouldn't happen for matched exercises).
 */
function generateHint(exercise) {
  const { id, title, instructions, solution, tags, category } = exercise;
  const inst = instructions || '';
  const sol = solution || '';
  const tagSet = new Set(tags || []);
  const cat = (category || []).join('/');
  const methods = extractMentionedMethods(inst);
  const targetName = extractTargetName(inst);
  const returnShape = getReturnShape(inst, sol);
  const noBuiltin = hasNoBuiltinConstraint(inst);

  // -----------------------------------------------------------------------
  // HTML exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('html')) {
    if (tagSet.has('forms')) {
      return 'What elements does a form need to be both functional and accessible — and how do labels connect to their inputs?';
    }
    if (tagSet.has('semantics') || tagSet.has('structure')) {
      if (/article/i.test(inst)) return 'Which HTML element is designed specifically for self-contained content like a blog post or news story?';
      if (/figure/i.test(inst)) return 'How do you associate a caption with an image so that screen readers understand the relationship?';
      if (/blockquote/i.test(inst)) return 'What semantic elements exist for quotations, and how do you attribute the source?';
      if (/definition list/i.test(inst) || /<dl>/i.test(inst)) return 'What HTML element is purpose-built for term/definition pairs, and what child elements does it expect?';
      if (/<ol>/i.test(inst) || /ordered list/i.test(inst)) return 'What is the difference between an ordered and unordered list, and when would you use each?';
      if (/<ul>/i.test(inst) || /unordered list/i.test(inst)) return 'What HTML element represents a list where order does not matter, and what goes inside it?';
      if (/header|main|footer/i.test(inst)) return 'What are the three major landmark elements that define the top, body, and bottom of a page?';
      if (/<table>/i.test(inst) || /table/i.test(inst)) return 'What is the difference between `<thead>`, `<tbody>`, `<th>`, and `<td>` — and why does table structure matter for accessibility?';
      if (/<nav>/i.test(inst) || /navigation/i.test(inst)) return 'What semantic element wraps site navigation, and what list element typically goes inside it?';
      return 'Which semantic HTML element best describes this type of content, and why does choosing the right one matter?';
    }
    if (tagSet.has('tables')) {
      return 'What is the difference between `<thead>`, `<tbody>`, `<th>`, and `<td>` — and why does table structure matter for accessibility?';
    }
    if (tagSet.has('accessibility') || tagSet.has('a11y')) {
      return 'What attributes does an image need so that users who cannot see it still understand its purpose?';
    }
    return 'Which semantic HTML element best describes this type of content, and why does choosing the right one matter?';
  }

  // -----------------------------------------------------------------------
  // CSS exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('css')) {
    if (tagSet.has('pseudo-elements')) return 'How can you add decorative content before or after an element without changing the HTML?';
    if (tagSet.has('combinators') || tagSet.has('specificity')) return 'What is the difference between a descendant selector and a direct child selector — when would you pick one over the other?';
    if (tagSet.has('selectors')) return 'How do you target a specific element based on its position, relationship, or attributes in CSS?';
    if (tagSet.has('transitions')) return 'What CSS property lets you animate changes smoothly when a property value changes?';
    if (tagSet.has('flexbox')) return 'What does setting `display: flex` do to a container\'s children, and how do you control their alignment?';
    if (tagSet.has('grid')) return 'How does CSS Grid differ from Flexbox — when is a two-dimensional layout the right choice?';
    return 'What CSS property controls this visual behavior, and what values can it accept?';
  }

  // -----------------------------------------------------------------------
  // DOM Manipulation exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('dom-manipulation')) {
    if (tagSet.has('selection')) {
      if (/querySelectorAll/i.test(inst) || /count/i.test(inst)) return 'How do you select multiple elements matching a CSS selector, and what does the result look like — an array, or something else?';
      if (/recursion|walk/i.test(inst)) return 'How do you visit every node in a tree structure — and what types of nodes exist besides elements?';
      return 'What is the difference between `querySelector` and `querySelectorAll`, and when do you need each?';
    }
    if (tagSet.has('events')) {
      if (/delegation/i.test(inst)) return 'Instead of adding a listener to every child element, how can you use a single listener on the parent to handle events from its children?';
      if (/debounce/i.test(inst)) return 'How do you prevent a function from firing on every single keystroke — what timing technique limits how often it runs?';
      return 'How does event propagation (bubbling) work, and how can you use it to handle events efficiently?';
    }
    if (tagSet.has('manipulation')) {
      if (/tab/i.test(inst)) return 'How do you show one panel while hiding others — what needs to happen when a tab button is clicked?';
      if (/toggle/i.test(inst) || /classList/i.test(inst)) return 'How can you add or remove a CSS class from an element based on a condition?';
      if (/build.*list|createElement/i.test(inst)) return 'How do you create new DOM elements from data and attach them to the page?';
      if (/diff/i.test(inst) || /virtual/i.test(inst)) return 'How would you compare two tree structures node-by-node and describe the differences as a list of changes?';
      return 'How do you create, modify, or remove DOM elements using JavaScript?';
    }
    return 'What DOM API method lets you find or manipulate the element you need?';
  }

  // -----------------------------------------------------------------------
  // Algorithms exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('algorithms')) {
    if (tagSet.has('sorting')) {
      if (/bubble/i.test(inst)) return 'If you compare each pair of adjacent elements and swap when they are out of order, what happens after one full pass through the array?';
      if (/selection/i.test(inst)) return 'What if you found the smallest element first and placed it at position 0, then found the next smallest for position 1, and so on?';
      if (/merge/i.test(inst)) return 'What if you split the array in half, sorted each half separately, and then merged the two sorted halves back together?';
      if (/quick/i.test(inst)) return 'If you pick one element as a "pivot" and partition the rest into smaller-than and larger-than groups, what do you do with each group next?';
      if (/comparator/i.test(inst)) return 'How does a comparator function tell `sort` whether element A should come before or after element B?';
      return 'What strategy does this sorting algorithm use to put elements in order, and how many passes does it need?';
    }
    if (tagSet.has('searching') || tagSet.has('binary-search')) {
      if (/rotated/i.test(inst)) return 'In a rotated sorted array, one half is always still sorted — how can you figure out which half to search?';
      if (/first occurrence/i.test(inst)) return 'Standard binary search stops at any match — how do you modify it to keep searching for an earlier occurrence?';
      return 'If the array is sorted, do you need to check every element, or can you eliminate half the possibilities at each step?';
    }
    if (tagSet.has('recursion')) {
      if (/fibonacci/i.test(inst)) return 'What are the two simplest Fibonacci values you know without computing, and how does each subsequent value relate to the previous two?';
      if (/power|exponent/i.test(inst)) return 'What does raising a number to the power of 0 give you, and how can you express x^n in terms of x^(n-1)?';
      if (/permutation/i.test(inst)) return 'If you fix one element in position, how many arrangements exist for the remaining elements?';
      if (/parenthes/i.test(inst)) return 'At each step, you can add an open or close paren — but what rule must you follow to keep the string valid?';
      if (/nested|flatten/i.test(inst)) return 'When you encounter a nested array inside an array, what should you do with it before adding its contents to the result?';
      return 'What is the simplest case where you already know the answer (the base case), and how does each step get closer to it?';
    }
    if (tagSet.has('two-pointer')) {
      if (/container|water|area/i.test(inst)) return 'If you start with pointers at both ends, which pointer should you move inward — the taller line or the shorter one — and why?';
      if (/three.*sum/i.test(inst)) return 'If you sort the array first and fix one number, can you use two pointers to find the other two?';
      return 'What if you used two pointers — one at each end — and moved them toward each other based on a condition?';
    }
    if (tagSet.has('hash-map') || tagSet.has('frequency-counter')) {
      if (/two.*sum/i.test(inst)) return 'For each number, you need a specific complement to reach the target — is there a way to remember which numbers you have already seen?';
      if (/anagram/i.test(inst)) return 'Two strings are anagrams if they have exactly the same character counts — how would you compare the counts efficiently?';
      return 'How can you use an object or Map to remember what you have already seen as you iterate?';
    }
    if (tagSet.has('sliding-window')) return 'Instead of recalculating the sum from scratch for every subarray, what if you just added the new element and removed the old one?';
    if (/spiral/i.test(inst)) return 'If you trace the outside border first (top row, right column, bottom row, left column), how do you shrink the boundary and repeat?';
    if (/merge.*interval/i.test(inst)) return 'If you sort the intervals by start time first, when do two intervals overlap, and how do you combine them?';
    if (/rotate/i.test(inst)) return 'If you need to move the last k elements to the front, what happens if you slice the array at the right position?';
    if (/product.*except/i.test(inst)) return 'For each position, you need the product of everything to its left times everything to its right — can you precompute those separately?';
    return 'What is the brute-force approach, and where does it do repeated work that you could eliminate?';
  }

  // -----------------------------------------------------------------------
  // Regex exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('regex')) {
    if (/phone/i.test(inst)) return 'What characters can appear between the digit groups in a phone number, and how do you express "this character is optional" in a regex?';
    if (/email/i.test(inst)) return 'What are the key parts of an email address, and what characters are allowed in each part?';
    if (/tag/i.test(inst) || /html/i.test(inst)) return 'What pattern do all opening HTML tags share — what comes right after the `<` character?';
    if (/password/i.test(inst)) return 'How do you check that a string meets several rules at once — can lookaheads help you test multiple conditions independently?';
    if (/markdown/i.test(inst)) return 'How does the `replace` method let you wrap matched text in new delimiters using capture groups?';
    if (/interpolat|template/i.test(inst)) return 'How can you match the `{{key}}` pattern and use the captured key to look up a value in an object?';
    if (/tokeniz/i.test(inst)) return 'How do you try multiple patterns in order and advance through a string, consuming one token at a time?';
    if (/log.*pars/i.test(inst)) return 'If each log line has a consistent structure, how can you use named capture groups to pull out specific parts?';
    return 'What pattern do you need to match, and which regex method (`test`, `match`, `replace`, `matchAll`) fits best?';
  }

  // -----------------------------------------------------------------------
  // Syntax Translation exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('syntax-translation')) {
    if (/es5.*es6|for.*forEach|for.*map/i.test(title)) return 'What ES6 method replaces this manual loop, and what does it return differently?';
    if (/es6.*es5|arrow|destructur/i.test(title)) return 'How would you rewrite this using only `function` keywords and explicit variable assignments?';
    return 'What is the modern equivalent of this pattern, and how does it change what the code communicates?';
  }

  // -----------------------------------------------------------------------
  // Classes / OOP exercises
  // -----------------------------------------------------------------------
  if (cat.includes('classes') || (tagSet.has('class') && tagSet.has('oop'))) {
    // Multi-class / composition
    if (tagSet.has('multi-class') || tagSet.has('composition') || tagSet.has('two-class') || tagSet.has('three-class')) {
      if (/airport|plane/i.test(inst)) return 'When a plane lands at an airport, what data needs to change on each object — and what should happen if the plane is not at that airport?';
      if (/spotify|playlist|song/i.test(inst)) return 'A Spotify instance holds playlists, which hold songs — how does each class know about the others, and who owns what data?';
      if (/rpg|character|party/i.test(inst)) return 'When a character takes damage or levels up, what properties change — and how does the party know if everyone is still alive?';
      if (/classroom|student/i.test(inst)) return 'Each student tracks their own grades, but the classroom needs aggregate stats — which class should compute the average?';
      if (/spa|appointment/i.test(inst)) return 'How does the spa decide if a new appointment fits — what makes two appointments conflict?';
      if (/restaurant|order/i.test(inst)) return 'When an order is placed, what needs to happen to the menu item\'s availability and the order\'s total?';
      if (/barber|client/i.test(inst)) return 'How does the shop decide which barber handles a client, and what happens when the queue is full?';
      if (/library|book/i.test(inst)) return 'When a book is checked out, what changes on the book and on the library — and what should happen if it is already checked out?';
      if (/dj|song/i.test(inst)) return 'How does the DJ track which song is currently playing, and what happens when you skip to the next one?';
      if (/taco|stand/i.test(inst)) return 'How does the taco stand build a taco from its available ingredients, and what string format should describe it?';
      if (/vhs|movie/i.test(inst)) return 'When a customer rents a movie, what should change — and what prevents renting something that is already out?';
      if (/crafting|supply/i.test(inst)) return 'How does the store track supply quantities, and what happens when you try to use more than what is in stock?';
      if (/task.*management|board|column/i.test(inst)) return 'How does a task move between columns, and what rules prevent invalid state transitions?';
      if (/event.*schedul|calendar|venue/i.test(inst)) return 'How do you check whether two events overlap in time, and what should `book` return when there is a conflict?';
      if (/e-commerce|product|cart|discount/i.test(inst)) return 'When an item is added to the cart, what needs to change on the Product side and the Cart side?';
      return 'Which class is responsible for which data, and how do the classes communicate when one needs information from another?';
    }

    // Inheritance
    if (tagSet.has('extends') || tagSet.has('inheritance') || tagSet.has('super')) {
      if (/animal/i.test(inst)) return 'If Dog and Cat share a `speak` method but produce different sounds, where does the shared logic live, and how does each subclass customize it?';
      if (/vehicle/i.test(inst)) return 'What do all vehicles have in common, and what behavior is unique to a Car versus a Truck?';
      if (/shape/i.test(inst)) return 'Every shape has an area, but the formula is different — how does the base class define the interface while each shape provides its own calculation?';
      if (/person.*student/i.test(inst)) return 'A Student is a Person with extra capabilities — what does `super` do in the constructor, and why is it required?';
      if (/employee.*manager/i.test(inst)) return 'If a Manager is an Employee with direct reports, what shared behavior comes from the parent and what is new?';
      if (/eventEmitter/i.test(inst)) return 'How do you store multiple listener functions for the same event name, and what should `emit` do with all of them?';
      return 'What behavior is shared by all subclasses (belongs in the parent), and what behavior is unique to each child?';
    }

    // Mythical creatures
    if (tagSet.has('mythical-creatures')) {
      if (/unicorn/i.test(inst)) return 'What happens to the unicorn\'s sparkliness when it eats a rainbow, and how does sparkliness affect its description?';
      if (/dragon/i.test(inst)) return 'How does the dragon\'s eating history affect its happiness — what condition determines the `isHappy` state?';
      if (/vampire/i.test(inst)) return 'A vampire gains victims by biting — but what condition prevents it from biting, and how does the victim count affect its power?';
      if (/wizard/i.test(inst)) return 'The wizard stores spells and casts them by name — what should happen when the wizard tries to cast a spell they don\'t know?';
      if (/pirate/i.test(inst)) return 'How does the pirate\'s gold balance change, and what greeting does a rich pirate give versus a poor one?';
      if (/hobbit/i.test(inst)) return 'The hobbit tracks meals in an array — how does the number of meals determine whether the hobbit is full?';
      if (/medusa/i.test(inst)) return 'Medusa turns victims to stone — how does her statues collection grow, and what determines if she can petrify someone?';
      if (/werewolf/i.test(inst)) return 'The werewolf toggles between human and wolf form — how does the current form affect what `greet` returns?';
      if (/centaur/i.test(inst)) return 'The centaur has both speed and wisdom — how do those two properties interact when comparing or racing centaurs?';
      return 'What state does this creature track, and how do its methods change that state over time?';
    }

    // Real-world classes
    if (/ShoppingCart/i.test(title)) return 'When you add an item and then remove it by name, what data structure holds the items, and how do you find the right one to remove?';
    if (/TodoList/i.test(title)) return 'Each todo has a completed status — how do you toggle just one todo by its ID without affecting the others?';
    if (/Gradebook/i.test(title)) return 'To compute a student\'s average, you need all their scores — what data structure maps a student name to their list of grades?';
    if (/Playlist/i.test(title)) return 'The playlist has a "current" song — how do you track which index is playing and wrap around at the beginning and end?';
    if (/VendingMachine/i.test(title)) return 'What should happen when a customer inserts money but not enough for the selected item — and how do you handle change?';
    if (/Library/i.test(title)) return 'Books can be checked out or returned — how do you track whether a specific book is currently available?';
    if (/Timer/i.test(title)) return 'How do you convert a raw number of seconds into a formatted "MM:SS" or "HH:MM:SS" string?';
    if (/Garage/i.test(title)) return 'The garage has a capacity limit — how do you prevent adding a car when it is full, and how do you find a specific car to remove?';
    if (/Observable/i.test(title)) return 'When the value changes, every subscriber needs to be notified — how do you store and call all those callback functions?';
    if (/LinkedList/i.test(title)) return 'Unlike an array, a linked list connects nodes with pointers — how do you traverse from head to tail to find or insert a node?';

    // Generic class exercises
    if (/Stack/i.test(title)) return 'A stack is Last-In-First-Out — which end of an array behaves that way, and what two methods add and remove from that end?';
    if (/Temperature/i.test(title)) return 'What is the formula to convert between Celsius and Fahrenheit, and how do you decide which formula to use based on the current scale?';
    if (/BankAccount/i.test(title)) return 'What rules prevent invalid operations like withdrawing more than the balance or depositing a negative amount?';
    if (/Counter/i.test(title) && tagSet.has('class')) return 'How does the counter remember its initial value so that `reset` can return to it?';
    if (/Rectangle/i.test(title) && tagSet.has('class')) return 'If you store width and height, how do you compute area and perimeter from them — and what does `isSquare` check?';
    if (/Dog/i.test(title) && tagSet.has('class')) return 'What properties does a dog have when it is first created, and how do the methods change those properties?';

    // Advanced OOP patterns
    if (/EventEmitter/i.test(title)) return 'How do you store multiple listener functions for the same event name, and what should `emit` do with all of them?';
    if (/state.*machine/i.test(title.toLowerCase())) return 'How does the machine know which transitions are valid from the current state, and what happens if you attempt an invalid one?';

    return 'What properties does the constructor need to set up, and how does each method read or change those properties?';
  }

  // -----------------------------------------------------------------------
  // Functions / Higher-order / Scope / Closures
  // -----------------------------------------------------------------------
  if (cat.startsWith('functions')) {
    if (tagSet.has('closure') || tagSet.has('scope')) {
      if (/makeCounter/i.test(inst)) return 'How does the returned function "remember" the count between calls — where does that variable live?';
      if (/once/i.test(inst)) return 'How can the returned function know whether it has already been called — what variable tracks that, and where is it stored?';
      if (/createPerson|private/i.test(inst)) return 'How do you create variables that are accessible to the returned methods but hidden from outside code?';
      if (/createStateMachine/i.test(inst)) return 'How does the machine know which transitions are valid from the current state, and what happens if you attempt an invalid one?';
      return 'When a function returns another function, how does the inner function access variables from the outer function\'s scope?';
    }
    if (tagSet.has('higher-order')) {
      if (/makeMultiplier/i.test(inst)) return 'The outer function receives a factor — how does the inner function use that factor later when it is called with a number?';
      if (/makeAdder/i.test(inst)) return 'If `makeAdder(5)` returns a function, what does that returned function need to do with a new number it receives?';
      if (/applyTwice/i.test(inst)) return 'If you call `fn(x)` and get a result, what does calling `fn` on that result give you?';
      if (/compose/i.test(inst)) return 'In `compose(f, g)`, which function runs first — f or g — and what does the other one receive as input?';
      if (/memoize/i.test(inst)) return 'How do you store a function\'s previous results so you can skip recomputing when the same argument appears again?';
      if (/curry/i.test(inst)) return 'If a function normally takes two arguments at once, how do you let it accept them one at a time instead?';
      if (/partial/i.test(inst)) return 'How do you "lock in" one argument now and create a new function that only needs the remaining argument?';
      return 'What does it mean for a function to accept or return another function — and how does that help here?';
    }
    if (tagSet.has('callbacks')) {
      return 'A callback is just a function passed as an argument — how does the receiving function decide when and how to call it?';
    }
    return 'What does the function need to accept, and what should it return?';
  }

  // -----------------------------------------------------------------------
  // ES6+ exercises
  // -----------------------------------------------------------------------
  if (cat.startsWith('es6-plus')) {
    if (tagSet.has('destructuring')) {
      if (/formatUser/i.test(inst) || /formatPerson/i.test(inst)) return 'How do you pull specific properties out of an object directly in the function parameter list, and what happens if a property is missing?';
      if (/default/i.test(inst)) return 'When a function parameter might be undefined, how do you assign a fallback value right in the function signature?';
      if (/spread/i.test(inst)) return 'How do you create a copy of an array with an extra element at the end — without modifying the original?';
      if (/rest/i.test(inst)) return 'How do you collect "the rest" of the arguments into an array when you don\'t know how many there will be?';
      return 'How does destructuring let you name individual pieces of an object or array right where you declare them?';
    }
    if (tagSet.has('async') || tagSet.has('promises')) {
      if (/fetchData|fetch/i.test(inst)) return 'What does `await fetch(url)` give you — the data itself, or something you still need to parse?';
      if (/retry/i.test(inst)) return 'If the async function throws, how do you catch the error and try again — and how do you know when to stop retrying?';
      if (/promiseAll/i.test(inst)) return 'How do you wait for multiple promises to finish and collect all their results — and what should happen if one rejects?';
      return 'What does `async/await` do under the hood, and how does error handling work with it?';
    }
    if (tagSet.has('template-literals')) {
      if (/greet/i.test(inst)) return 'How do you embed a variable\'s value inside a string using backticks — what syntax wraps the variable name?';
      if (/describe/i.test(inst)) return 'Template literals let you embed expressions inside strings — what delimiters do you wrap the expression in?';
      return 'What is the syntax for embedding an expression inside a template literal string?';
    }
    return 'What ES6 feature simplifies this pattern compared to the ES5 way of doing it?';
  }

  // -----------------------------------------------------------------------
  // JS Fundamentals — Operators
  // -----------------------------------------------------------------------
  if (cat === 'js-fundamentals/operators') {
    if (/add|sum/i.test(inst) && tagSet.has('arithmetic')) return 'What operator combines two numbers into their sum?';
    if (/subtract/i.test(inst)) return 'What operator gives you the difference between two numbers?';
    if (/multiply|product/i.test(inst)) return 'What operator gives you the product of two numbers?';
    if (/celsius|fahrenheit|temperature/i.test(inst)) return 'The formula is given — how do you translate a math formula into a JavaScript expression using `*`, `/`, and `+`?';
    if (/perimeter/i.test(inst)) return 'The formula is given — how do you translate parentheses in a math formula into JavaScript?';
    if (/area/i.test(inst)) return 'If the formula involves multiplying length by width, how do you express that as a `return` statement?';
    if (/equal/i.test(inst)) return 'What is the difference between `==` and `===` — and which one avoids unexpected type coercion?';
    if (/greater/i.test(inst)) return 'Which comparison operator checks if the left side is larger than the right, and what does it return?';
    if (/divisible/i.test(inst)) return 'How do you check if one number divides evenly into another — what does the remainder operator (%) tell you?';
    if (/clamp/i.test(inst)) return 'If the number is below the minimum, you return the minimum; if above the max, the maximum — how do you structure those checks?';
    if (/discount/i.test(inst)) return 'If a 20% discount means you pay 80% of the price, how do you express "percentage of a number" in JavaScript?';
    if (/truthy|falsy/i.test(inst)) return 'What values does JavaScript treat as falsy, and how do logical operators (&&, ||) work with truthy and falsy values?';
    if (/power|exponent/i.test(inst)) return 'What built-in method or operator raises a number to a power?';
    if (/hypotenuse/i.test(inst)) return 'The Pythagorean theorem gives you c squared — how do you get c itself from that?';
    if (/odd/i.test(inst) || /even.*or.*odd|evenOrOdd/i.test(inst)) return 'What does the remainder operator (%) give you when you divide a number by 2, and how does that differ for odd vs. even?';
    return 'Which JavaScript operator performs this calculation, and what type does it return?';
  }

  // -----------------------------------------------------------------------
  // JS Fundamentals — Conditionals
  // -----------------------------------------------------------------------
  if (cat === 'js-fundamentals/conditionals') {
    if (/positive.*negative.*zero|signOf/i.test(inst)) return 'There are three possible outcomes — how do you chain comparisons to check each range in order?';
    if (/pass.*fail/i.test(inst)) return 'There is one threshold that divides the two outcomes — what comparison checks "is the grade at least 60"?';
    if (/max.*two|maximum/i.test(inst)) return 'To find the larger of two values, what single comparison do you need?';
    if (/min.*two|minimum/i.test(inst)) return 'To find the smaller of two values, what comparison do you need, and what do you return?';
    if (/leap.*year/i.test(inst)) return 'A leap year has three rules that interact — does it matter which order you check divisibility by 4, 100, and 400?';
    if (/grade|letter/i.test(inst)) return 'With multiple score ranges to check, how do you chain `if/else if` so each range is handled exactly once?';
    if (/traffic.*light/i.test(inst)) return 'Each color maps to exactly one next color — what structure checks "if red then green, if green then yellow"?';
    if (/bmi/i.test(inst)) return 'You have several numeric boundaries — how do you check which range the value falls into without overlapping conditions?';
    return 'What condition determines which branch to take, and how many branches do you need?';
  }

  // -----------------------------------------------------------------------
  // JS Fundamentals — Loops
  // -----------------------------------------------------------------------
  if (cat === 'js-fundamentals/loops') {
    if (/count.*up/i.test(inst)) return 'Starting from 1 and going up to n — what does each part of the `for` loop (start, condition, increment) look like?';
    if (/count.*down/i.test(inst)) return 'Starting from n and going down to 1 — how does the loop condition and increment change compared to counting up?';
    if (/sum.*1.*n|sumToN/i.test(inst)) return 'If you keep a running total and add each number from 1 to n, what variable do you need before the loop starts?';
    if (/even.*numbers|range/i.test(inst)) return 'How do you decide which numbers in the range to keep — do you check each one, or can you step by 2?';
    if (/fizz.*buzz/i.test(inst)) return 'The order of your conditions matters — why should you check "divisible by both 3 and 5" before checking each separately?';
    if (/multiples/i.test(inst)) return 'The first n multiples of x are x*1, x*2, ... x*n — how do you build that list with a loop?';
    if (/factorial/i.test(inst)) return 'Factorial means multiplying all integers from 1 to n — what initial value should the accumulator start at, and why?';
    if (/reverse|palindrome/i.test(inst)) return 'How do you build a new string character by character starting from the end of the original?';
    return 'What should your loop\'s starting value, condition, and increment look like for this problem?';
  }

  // -----------------------------------------------------------------------
  // JS Fundamentals — Variables
  // -----------------------------------------------------------------------
  if (cat === 'js-fundamentals/variables') {
    if (/greet/i.test(inst)) return 'How do you combine a fixed string like "Hello, " with a variable name to produce the final greeting?';
    return 'What value does the function need to build from its input, and how do you combine the pieces?';
  }

  // -----------------------------------------------------------------------
  // Data Structures — Arrays
  // -----------------------------------------------------------------------
  if (cat === 'data-structures/arrays') {
    // No-builtin exercises
    if (noBuiltin) {
      if (/indexOf/i.test(inst) && /last/i.test(inst)) return 'To find the last occurrence, which direction should you loop through the array — start to end, or end to start?';
      if (/indexOf/i.test(inst)) return 'How do you walk through each element and check if it matches — and what do you return as soon as you find it?';
      if (/includes/i.test(inst)) return 'How do you determine if a value exists in a collection when you can\'t use the built-in method — what kind of loop checks each element?';
      if (/slice/i.test(inst)) return 'To copy a portion of an array, you need a start and end index — how do you loop through just that range and collect elements?';
      if (/max/i.test(inst)) return 'If you assume the first element is the biggest, how do you walk through the rest and update your answer when you find something larger?';
      if (/min/i.test(inst)) return 'If you assume the first element is the smallest, how do you update your answer as you check each remaining element?';
      if (/twoHighest/i.test(inst)) return 'You need to track two values as you iterate — how do you update both when you find a new number that is bigger than either?';
      return 'Without built-in methods, what kind of loop would you use to examine each element one at a time?';
    }

    // Specific array problems
    if (/sum.*array|sumArray/i.test(inst)) return 'You need a single total from many numbers — do you reach for a loop with a running total, or is there a built-in method that accumulates values?';
    if (/getFirst|first element/i.test(inst)) return 'What index does the first element of an array always live at?';
    if (/getLast|last element/i.test(inst)) return 'If you don\'t know the array\'s length ahead of time, how do you calculate the index of its last element?';
    if (/arrayLength|number of elements/i.test(inst)) return 'What property on every array tells you how many elements it contains?';
    if (/arrayContains|contains.*value/i.test(inst)) return 'What built-in array method checks whether a specific value is present and returns true or false?';
    if (/addToEnd|push/i.test(inst)) return 'What array method adds a new element after the current last element?';
    if (/removeFromEnd|pop/i.test(inst)) return 'What array method removes and returns the last element from an array?';
    if (/doubleAll|getNames/i.test(inst)) return 'When you need a new array with each element transformed, which array method runs a function on every element and collects the results?';
    if (/filter.*even|evens/i.test(inst)) return 'Which array method creates a new array containing only the elements that pass a test?';
    if (/reduce.*total/i.test(inst)) return 'Which array method can collapse an entire array down to a single accumulated value?';
    if (/flatten/i.test(inst)) return 'When you encounter a nested array, what method can you use to combine inner arrays into one flat result?';
    if (/squareEvenNumbers/i.test(inst)) return 'You need to both filter (only evens) and accumulate (sum of squares) — can you do both in one pass through the array?';
    if (/countValues/i.test(inst)) return 'As you loop through the array, how do you keep a running count of matches?';
    if (/findTheDuplicate/i.test(inst)) return 'How can you remember which numbers you have already seen so that you recognize the duplicate instantly?';
    if (/totalCaps/i.test(inst)) return 'You need to check every character in every string — does that mean two nested loops, or is there a way to combine them?';
    if (/separate/i.test(inst)) return 'If you need cats first, then water, then dogs — could you build three groups and combine them?';
    if (/collectOddsAndEvens/i.test(inst)) return 'As you loop through the numbers, how do you sort each one into the "odd" or "even" bucket of your result object?';
    if (/reverseValues/i.test(inst)) return 'When you encounter an even number, you skip it and the next two — how do you control your loop index to jump ahead by 3?';
    if (/robotInstructions/i.test(inst)) return 'You need to count how many times each move appears — what data structure is a natural fit for tallying occurrences?';
    if (/findFirstMove/i.test(inst)) return 'The moves are in a 2D array (array of arrays) — how do you search row by row and column by column?';
    if (/findHighestPriority/i.test(inst)) return 'How do you track the "best so far" as you loop, updating it whenever you find a higher priority?';
    if (/findFirstAndLast/i.test(inst)) return 'You need both the first and last position of a value — how do you update each as you scan through the array?';
    if (/LinkedList/i.test(title)) return 'Unlike an array, a linked list connects nodes with pointers — how do you traverse from head to tail to find or insert a node?';
    if (/dataset|cakes|music|weather|park/i.test(title.toLowerCase())) {
      if (/map/i.test(sol)) return 'You need to transform each item into a different shape — which array method creates a new array by running a function on every element?';
      if (/reduce/i.test(sol)) return 'You need to combine many items into a single grouped result — which array method accumulates values using a callback and a starting object?';
      if (/filter/i.test(sol)) return 'You need to narrow down the list to items matching a condition — which array method returns a new array of only the matches?';
      return 'Look at the input array and the desired output — are you transforming each item, filtering some out, or combining them into a new shape?';
    }

    return 'What does the input array contain, and what shape should the output be — a new array, a single value, or something else?';
  }

  // -----------------------------------------------------------------------
  // Data Structures — Objects
  // -----------------------------------------------------------------------
  if (cat === 'data-structures/objects') {
    if (noBuiltin) {
      if (/keys/i.test(inst)) return 'How do you loop through an object\'s own properties and collect just the key names into an array?';
      if (/values/i.test(inst)) return 'If you loop through an object\'s keys, how do you access the value for each key?';
      if (/entries/i.test(inst)) return 'How do you turn each key-value pair into a small two-element array, and collect them all?';
      return 'Without built-in object methods, how do you visit each key-value pair using a `for...in` loop?';
    }
    if (/getProperty/i.test(inst)) return 'How do you access an object\'s property when the property name is stored in a variable — dot notation or bracket notation?';
    if (/setProperty/i.test(inst)) return 'How do you add or update a property on an object when the key name comes from a variable?';
    if (/hasProperty/i.test(inst)) return 'What method checks whether an object has a specific key as its own property (not inherited)?';
    if (/count.*properties/i.test(inst)) return 'If you can get all of an object\'s keys as an array, how do you count them?';
    if (/merge/i.test(inst)) return 'How does the spread operator let you combine two objects into one — and what happens when both objects share a key?';
    if (/invert/i.test(inst)) return 'Swapping keys and values means old values become new keys — how do you loop through and build the inverted object?';
    if (/omit/i.test(inst)) return 'You want to copy an object but skip certain keys — how do you check if each key is in the "skip" list?';
    if (/pick/i.test(inst)) return 'You only want specific keys from the object — how do you loop through the desired keys and pull their values?';
    if (/nested|getNestedProp/i.test(inst)) return 'If the path is "a.b.c", how do you walk one level deeper at each step until you reach the final value?';
    if (/stringFromObject/i.test(inst)) return 'How do you get both keys and values from an object and format each pair into a string?';
    if (/calculateMonthlyOrders/i.test(inst)) return 'Each object might have different month keys — how do you loop through all properties of each object and add up every value?';
    if (/scheduleCheck/i.test(inst)) return 'Two schedules overlap on days where both have `true` — how do you iterate through one object\'s keys and check the other?';
    if (/divideObject/i.test(inst)) return 'You need to sort values by type (number vs. string) — how does `typeof` help you decide where each value goes?';
    if (/MySet|implement.*set/i.test(inst)) return 'How can an object\'s keys serve as a collection of unique values, since each key can only appear once?';
    return 'What object property or method do you need to access, add, or check?';
  }

  // -----------------------------------------------------------------------
  // Data Structures — Strings
  // -----------------------------------------------------------------------
  if (cat === 'data-structures/strings') {
    if (noBuiltin) {
      if (/charAt/i.test(inst)) return 'How do you access a single character in a string by its position — what syntax uses the index directly?';
      if (/indexOf|stringIndexOf/i.test(inst) && /last/i.test(inst)) return 'To find the last match, should you start searching from the beginning or the end of the string?';
      if (/indexOf|stringIndexOf/i.test(inst)) return 'How do you walk through each character and check if it matches — and what do you return the moment you find it?';
      if (/repeat/i.test(inst)) return 'If you start with an empty string and add the original to it n times, what does the final result look like?';
      if (/includes|stringIncludes/i.test(inst)) return 'How do you check every possible starting position in the string to see if the substring begins there?';
      return 'Without the built-in method, how would you solve this character by character using a loop?';
    }
    if (/append.*string/i.test(inst)) return 'What operator joins two strings together end-to-end?';
    if (/prepend.*string/i.test(inst)) return 'If you want the second string to appear before the first, which order do you concatenate them?';
    if (/removeFromString/i.test(inst)) return 'How do you extract the part before the removal and the part after, then join them?';
    if (/stringLength|number of characters/i.test(inst)) return 'What property tells you how many characters are in a string?';
    if (/uppercase/i.test(inst) && !(/camel|snake/i.test(inst))) return 'What built-in string method converts all characters to uppercase?';
    if (/lowercase/i.test(inst) && !(/camel|snake/i.test(inst))) return 'What built-in string method converts all characters to lowercase?';
    if (/capitalize.*first/i.test(inst)) return 'How do you get just the first character, change its case, and attach the rest of the string?';
    if (/trim/i.test(inst)) return 'What built-in method removes whitespace from both ends of a string?';
    if (/contains|stringContains/i.test(inst)) return 'What string method checks if one string exists inside another and returns true or false?';
    if (/split.*words/i.test(inst)) return 'What method breaks a string into an array at every occurrence of a separator?';
    if (/join.*string/i.test(inst)) return 'What array method joins all elements into a single string with a separator between each one?';
    if (/camelCase.*snake|toSnakeCase/i.test(inst)) return 'How do you detect uppercase letters in a camelCase string and replace each one with an underscore followed by the lowercase version?';
    if (/snake.*camel|toCamelCase/i.test(inst)) return 'If you split on underscores, you get an array of words — how do you capitalize the first letter of each word except the first?';
    if (/compress/i.test(inst)) return 'As you walk through the string, how do you count consecutive identical characters and decide when to write the count?';
    if (/longest.*common.*prefix/i.test(inst)) return 'If you start with the first string as your guess and shorten it character by character, when do you stop?';
    if (/subsequence/i.test(inst)) return 'If you use one pointer for each string and only advance the subsequence pointer on a match, when have you confirmed it\'s a subsequence?';
    if (/countVowels/i.test(inst)) return 'How do you check each character against a set of vowels and keep a running count?';
    if (/truncate/i.test(inst)) return 'If the string is longer than the limit, how do you grab just the first N characters and add "..."?';
    if (/wordCount/i.test(inst)) return 'If you split the string by spaces, how many elements does the resulting array have?';
    if (/reverse/i.test(inst)) return 'What happens if you split a string into an array of characters, reverse the array, and join it back?';
    return 'What string method transforms or inspects the string in the way you need?';
  }

  // -----------------------------------------------------------------------
  // Catch-all for any remaining exercises
  // -----------------------------------------------------------------------
  if (tagSet.has('context') || /this keyword/i.test(inst)) return 'How does the value of `this` change depending on whether a function is called as a method, a standalone function, or an arrow function?';

  // Truly generic fallback — try to make it at least somewhat exercise-specific
  if (returnShape === 'array') return 'What should each element of the returned array look like, and how do you build that array step by step?';
  if (returnShape === 'object') return 'What keys should the returned object have, and how do you compute each value?';
  if (returnShape === 'boolean') return 'What single condition determines whether the answer is true or false?';
  if (returnShape === 'string') return 'What pieces of text do you need to combine, and in what order?';
  if (returnShape === 'number') return 'What operation on the input produces the single number you need to return?';

  return 'What does the input look like, and how does the output relate to it — can you describe the transformation in plain English before writing code?';
}

// ---------------------------------------------------------------------------
// 4. Main: read → identify → rewrite → write
// ---------------------------------------------------------------------------

const data = JSON.parse(fs.readFileSync(EXERCISES_PATH, 'utf8'));

let identified = 0;
let rewritten = 0;
const samples = [];

for (const exercise of data.exercises) {
  if (!exercise.hints || exercise.hints.length === 0) continue;

  const hint0 = exercise.hints[0];
  if (!isGenericHint(hint0)) continue;

  identified++;

  const newHint = generateHint(exercise);
  if (!newHint || newHint === hint0) continue;

  // Store sample for reporting
  if (samples.length < 30) {
    samples.push({
      id: exercise.id,
      title: exercise.title,
      category: (exercise.category || []).join('/'),
      before: hint0,
      after: newHint,
    });
  }

  exercise.hints[0] = newHint;
  rewritten++;
}

// Write the updated file
fs.writeFileSync(EXERCISES_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');

// ---------------------------------------------------------------------------
// 5. Report
// ---------------------------------------------------------------------------
console.log('=== Hint Improvement Report ===\n');
console.log(`Total exercises scanned: ${data.exercises.length}`);
console.log(`Generic hints identified: ${identified}`);
console.log(`Hints rewritten: ${rewritten}`);
console.log(`Hints left unchanged (no good rewrite): ${identified - rewritten}`);

console.log('\n=== 10 Sample Before/After Comparisons ===\n');
// Pick 10 diverse samples
const displayed = [];
const cats = new Set();
for (const s of samples) {
  if (displayed.length >= 10) break;
  if (!cats.has(s.category)) {
    displayed.push(s);
    cats.add(s.category);
  }
}
// Fill remaining slots with whatever is left
for (const s of samples) {
  if (displayed.length >= 10) break;
  if (!displayed.includes(s)) displayed.push(s);
}

displayed.forEach((s, i) => {
  console.log(`--- ${i + 1}. [${s.id}] ${s.title} (${s.category}) ---`);
  console.log(`  BEFORE: ${s.before}`);
  console.log(`  AFTER:  ${s.after}`);
  console.log();
});
