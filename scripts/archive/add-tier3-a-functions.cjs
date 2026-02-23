#!/usr/bin/env node
'use strict';
/**
 * Tier 3 Curriculum — Section A: functions/higher-order + functions/scope
 *
 * Scaffolding approach per category:
 *   Step 1 — same concept as Tier 2, slightly wider problem
 *   Step 2 — one new idea on top of familiar ground
 *   Step 3 — combine two Tier 2 skills
 *   Step 4+ — harder (marked Tier 4 in this file)
 *
 * Tier 2 ceiling for higher-order:
 *   - applyToEach: takes fn + array, returns transformed array
 *   - partialApplication: fix first argument, return new function
 *
 * Tier 2 ceiling for scope:
 *   - makeCounter: closure tracking a count
 *   - once: closure preventing repeat calls
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function js(title, category, tags, tier, description, instructions, starterCode, solution, testRunner, hint) {
  return { id: nextId++, title, type: 'js', tier, category, tags, description, instructions, starterCode, solution, testRunner, hint, resources: [] };
}

const exercises = [];

// ═══════════════════════════════════════════════════════════════════════════
// SECTION A: functions/higher-order
// ═══════════════════════════════════════════════════════════════════════════

// A1 — Step 1: Factory returning a function (tiny step from partialApplication)
exercises.push(js(
  'makeMultiplier',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'factory', 'closure', 'tier3'],
  3,
  'Write a factory function that returns a customized multiplier function.',
  `Write a function \`makeMultiplier(factor)\` that returns a **new function**.
The returned function takes a number and multiplies it by \`factor\`.

\`\`\`js
const double = makeMultiplier(2);
double(5);   // 10
double(9);   // 18

const triple = makeMultiplier(3);
triple(4);   // 12
\`\`\`

Each call to \`makeMultiplier\` should create an independent function — \`double\` and \`triple\` should not interfere with each other.`,
  `function makeMultiplier(factor) {
  // return a function here
}`,
  `function makeMultiplier(factor) {
  return function(n) {
    return n * factor;
  };
}`,
  `(code) => {
  const makeMultiplier = new Function(code + '; return makeMultiplier;')();
  const double = makeMultiplier(2);
  const triple = makeMultiplier(3);
  const byTen  = makeMultiplier(10);
  return [
    { pass: double(5) === 10,   description: 'double(5) === 10',   got: double(5) },
    { pass: double(9) === 18,   description: 'double(9) === 18',   got: double(9) },
    { pass: triple(4) === 12,   description: 'triple(4) === 12',   got: triple(4) },
    { pass: triple(0) === 0,    description: 'triple(0) === 0',    got: triple(0) },
    { pass: byTen(7) === 70,    description: 'byTen(7) === 70',    got: byTen(7) },
    { pass: double(3) !== triple(3), description: 'double and triple are independent', got: double(3) + ' vs ' + triple(3) },
  ];
}`,
  `This is a factory function — a function that builds and returns other functions. The returned function "closes over" the \`factor\` variable, remembering it even after \`makeMultiplier\` has finished running. The pattern is: outer function receives config, returns inner function that uses that config.`
));

// A2 — Step 1b: Same pattern, slightly different flavor
exercises.push(js(
  'makeAdder',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'factory', 'closure', 'tier3'],
  3,
  'Write a factory function that returns a customized adder function.',
  `Write a function \`makeAdder(n)\` that returns a **new function**.
The returned function takes a number and adds \`n\` to it.

\`\`\`js
const add5  = makeAdder(5);
add5(3);    // 8
add5(10);   // 15

const add100 = makeAdder(100);
add100(1);  // 101
\`\`\`

The same pattern as \`makeMultiplier\` — but now reinforcing: any value can be "baked in" to a returned function.`,
  `function makeAdder(n) {
  // return a function here
}`,
  `function makeAdder(n) {
  return function(x) {
    return x + n;
  };
}`,
  `(code) => {
  const makeAdder = new Function(code + '; return makeAdder;')();
  const add5   = makeAdder(5);
  const add10  = makeAdder(10);
  const add0   = makeAdder(0);
  const addNeg = makeAdder(-3);
  return [
    { pass: add5(3) === 8,    description: 'add5(3) === 8',    got: add5(3) },
    { pass: add5(10) === 15,  description: 'add5(10) === 15',  got: add5(10) },
    { pass: add10(7) === 17,  description: 'add10(7) === 17',  got: add10(7) },
    { pass: add0(99) === 99,  description: 'add0(99) === 99 (adding zero)', got: add0(99) },
    { pass: addNeg(10) === 7, description: 'addNeg(10) === 7 (negative n)', got: addNeg(10) },
    { pass: add5(0) === 5,    description: 'add5(0) === 5',    got: add5(0) },
  ];
}`,
  `Exact same structure as makeMultiplier. The outer function captures \`n\` in its closure. The inner function uses \`n\` every time it's called. Notice that \`add5\` and \`add10\` are completely separate — each has its own \`n\`.`
));

// A3 — Step 2: Apply a function twice — bridge to composition
exercises.push(js(
  'applyTwice',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'composition', 'tier3'],
  3,
  'Write a function that applies a function to a value twice in a row.',
  `Write a function \`applyTwice(fn, x)\` that calls \`fn\` on \`x\`, then calls \`fn\` again on the result.

In other words: \`fn(fn(x))\`

\`\`\`js
applyTwice(x => x + 3, 7);     // 13  (7+3=10, 10+3=13)
applyTwice(x => x * 2, 5);     // 20  (5*2=10, 10*2=20)
applyTwice(s => s.trim(), '  hi  ');  // 'hi'
\`\`\`

This is a small step toward function composition — the idea that you can feed the output of a function back in as input.`,
  `function applyTwice(fn, x) {
  // your code here
}`,
  `function applyTwice(fn, x) {
  return fn(fn(x));
}`,
  `(code) => {
  const applyTwice = new Function(code + '; return applyTwice;')();
  return [
    { pass: applyTwice(x => x + 3, 7) === 13,        description: 'applyTwice(x => x+3, 7) === 13',    got: applyTwice(x => x + 3, 7) },
    { pass: applyTwice(x => x * 2, 5) === 20,        description: 'applyTwice(x => x*2, 5) === 20',    got: applyTwice(x => x * 2, 5) },
    { pass: applyTwice(x => x - 1, 10) === 8,        description: 'applyTwice(x => x-1, 10) === 8',   got: applyTwice(x => x - 1, 10) },
    { pass: applyTwice(s => s.toUpperCase(), 'hi') === 'HI', description: 'works with string functions', got: applyTwice(s => s.toUpperCase(), 'hi') },
    { pass: applyTwice(x => x, 42) === 42,           description: 'identity function returns original', got: applyTwice(x => x, 42) },
  ];
}`,
  `The solution is one line: return fn(fn(x)). The inner call fn(x) runs first, producing a result. That result becomes the argument to the outer fn(). You're calling the same function twice, chaining the output into the input.`
));

// A4 — Step 2b: applyN — generalization of applyTwice
exercises.push(js(
  'applyN',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'loops', 'tier3'],
  3,
  'Generalize applyTwice — apply a function to a value N times.',
  `Write a function \`applyN(fn, x, n)\` that applies \`fn\` to \`x\` a total of \`n\` times.

\`\`\`js
applyN(x => x + 1, 0, 5);    // 5   (0+1+1+1+1+1)
applyN(x => x * 2, 1, 4);    // 16  (1→2→4→8→16)
applyN(x => x, 99, 0);       // 99  (applied zero times — return original)
\`\`\`

This is \`applyTwice\` generalized with a loop. When \`n === 0\`, return \`x\` unchanged.`,
  `function applyN(fn, x, n) {
  // your code here
}`,
  `function applyN(fn, x, n) {
  let result = x;
  for (let i = 0; i < n; i++) {
    result = fn(result);
  }
  return result;
}`,
  `(code) => {
  const applyN = new Function(code + '; return applyN;')();
  return [
    { pass: applyN(x => x + 1, 0, 5) === 5,    description: 'applyN(x=>x+1, 0, 5) === 5',   got: applyN(x => x + 1, 0, 5) },
    { pass: applyN(x => x * 2, 1, 4) === 16,   description: 'applyN(x=>x*2, 1, 4) === 16',  got: applyN(x => x * 2, 1, 4) },
    { pass: applyN(x => x, 99, 0) === 99,       description: 'n=0 returns x unchanged',       got: applyN(x => x, 99, 0) },
    { pass: applyN(x => x + 1, 0, 1) === 1,    description: 'n=1 applies once',              got: applyN(x => x + 1, 0, 1) },
    { pass: applyN(x => x - 10, 100, 3) === 70, description: 'applyN(x=>x-10, 100, 3) === 70', got: applyN(x => x - 10, 100, 3) },
  ];
}`,
  `Use a loop that runs n times. Each iteration: result = fn(result). When n is 0 the loop never runs and you return the original x. This is the same pattern as applyTwice but flexible.`
));

// A5 — Step 3: pipe — combine applyToEach + factory knowledge
exercises.push(js(
  'pipe',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'pipe', 'composition', 'tier3'],
  3,
  'Write a pipe function that chains an array of functions left to right.',
  `Write a function \`pipe(fns)\` that takes an **array of functions** and returns a **new function**.
When the returned function is called with a value, it passes that value through each function in order — the output of each becomes the input of the next.

\`\`\`js
const process = pipe([
  x => x + 1,
  x => x * 2,
  x => x - 3
]);

process(5);   // ((5+1)*2)-3 = 9
process(10);  // ((10+1)*2)-3 = 19
\`\`\`

If \`fns\` is empty, return a function that returns its input unchanged.

This combines two things you already know: returning a function from a function, and using \`reduce\` (or a loop) to apply functions one after another.`,
  `function pipe(fns) {
  // return a new function that passes a value through each fn in fns
}`,
  `function pipe(fns) {
  return function(x) {
    return fns.reduce(function(val, fn) {
      return fn(val);
    }, x);
  };
}`,
  `(code) => {
  const pipe = new Function(code + '; return pipe;')();
  const addOne  = x => x + 1;
  const double  = x => x * 2;
  const minusThree = x => x - 3;
  const upper   = s => s.toUpperCase();
  const trim    = s => s.trim();
  const exclaim = s => s + '!';

  const mathPipe   = pipe([addOne, double, minusThree]);
  const stringPipe = pipe([trim, upper, exclaim]);
  const empty      = pipe([]);
  const single     = pipe([addOne]);

  return [
    { pass: mathPipe(5) === 9,                description: 'pipe([+1, *2, -3])(5) === 9',  got: mathPipe(5) },
    { pass: mathPipe(10) === 19,              description: 'pipe([+1, *2, -3])(10) === 19', got: mathPipe(10) },
    { pass: stringPipe(' hello ') === 'HELLO!', description: 'pipe([trim, upper, exclaim])(" hello ") === "HELLO!"', got: stringPipe(' hello ') },
    { pass: empty(42) === 42,                 description: 'empty pipe returns value unchanged', got: empty(42) },
    { pass: single(7) === 8,                  description: 'single function pipe works', got: single(7) },
    { pass: pipe([x => x * 3])(4) === 12,    description: 'inline pipe works', got: pipe([x => x * 3])(4) },
  ];
}`,
  `pipe returns a function (outer pattern from makeMultiplier/makeAdder). That returned function uses reduce — start with x as the accumulator, and for each function in fns, apply it to the current value. Order matters: functions run left to right.`
));

// A6 — Tier 4: compose (right to left — new concept, harder to reason about)
exercises.push(js(
  'compose',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'compose', 'tier4'],
  4,
  'Write a compose function that chains two functions right to left.',
  `Write a function \`compose(f, g)\` that returns a new function.
When called with a value \`x\`, the returned function runs \`g(x)\` first, then passes the result to \`f\`.

In math notation: \`compose(f, g)(x) = f(g(x))\`

\`\`\`js
const addOneThenDouble = compose(x => x * 2, x => x + 1);
addOneThenDouble(5);  // 12  — first (5+1)=6, then 6*2=12

const shout = compose(s => s + '!', s => s.toUpperCase());
shout('hello');  // 'HELLO!'
\`\`\`

Notice the order is **reversed** from pipe — the rightmost function runs first.
If you have \`pipe\`, compare: \`pipe([g, f])(x)\` gives the same result as \`compose(f, g)(x)\`.`,
  `function compose(f, g) {
  // return a function that runs g first, then f
}`,
  `function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}`,
  `(code) => {
  const compose = new Function(code + '; return compose;')();
  const double = x => x * 2;
  const addOne = x => x + 1;
  const upper  = s => s.toUpperCase();
  const exclaim = s => s + '!';

  const addThenDouble  = compose(double, addOne);   // g=addOne, f=double
  const doubleThenAdd  = compose(addOne, double);   // g=double, f=addOne
  const shout          = compose(exclaim, upper);

  return [
    { pass: addThenDouble(5) === 12,   description: 'compose(double, addOne)(5): addOne first → 6, then double → 12', got: addThenDouble(5) },
    { pass: doubleThenAdd(5) === 11,   description: 'compose(addOne, double)(5): double first → 10, then addOne → 11', got: doubleThenAdd(5) },
    { pass: addThenDouble(5) !== doubleThenAdd(5), description: 'order matters — results differ', got: addThenDouble(5) + ' vs ' + doubleThenAdd(5) },
    { pass: shout('hello') === 'HELLO!', description: 'compose(exclaim, upper)("hello") === "HELLO!"', got: shout('hello') },
    { pass: compose(x => x, x => x)(7) === 7, description: 'identity compose works', got: compose(x => x, x => x)(7) },
  ];
}`,
  `compose(f, g) returns a function. That function calls g(x) first, then passes the result to f. One line: return function(x) { return f(g(x)); }. The hardest part is keeping the order straight — "compose(f, g) means f after g", so g runs first.`
));

// A7 — Tier 4: memoize
exercises.push(js(
  'memoize',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'memoize', 'cache', 'map', 'tier4'],
  4,
  'Write a memoize function that caches the results of expensive function calls.',
  `Write a function \`memoize(fn)\` that returns a **new version of \`fn\`** that remembers its results.

The first time the returned function is called with a given argument, it runs \`fn\` and **stores the result**.
Every subsequent call with that same argument **returns the cached result** without calling \`fn\` again.

\`\`\`js
let callCount = 0;
const expensiveDouble = memoize(n => {
  callCount++;
  return n * 2;
});

expensiveDouble(5);  // 10, callCount is now 1
expensiveDouble(5);  // 10, callCount is still 1 (used cache)
expensiveDouble(6);  // 12, callCount is now 2
expensiveDouble(6);  // 12, callCount is still 2
\`\`\`

Use a \`Map\` to store results. The key is the argument, the value is the result.`,
  `function memoize(fn) {
  // create a Map to store cached results
  // return a new function that checks the cache before calling fn
}`,
  `function memoize(fn) {
  const cache = new Map();
  return function(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}`,
  `(code) => {
  const memoize = new Function(code + '; return memoize;')();

  let calls = 0;
  const tracked = memoize(n => { calls++; return n * n; });

  const r1 = tracked(4);
  const callsAfterFirst = calls;
  const r2 = tracked(4);
  const callsAfterSecond = calls;
  const r3 = tracked(5);
  const callsAfterThird = calls;
  const r4 = tracked(5);
  const callsAfterFourth = calls;

  const pure = memoize(x => x + 10);

  return [
    { pass: r1 === 16,              description: 'First call returns correct result (4*4=16)', got: r1 },
    { pass: r2 === 16,              description: 'Second call with same arg returns 16', got: r2 },
    { pass: callsAfterFirst === 1,  description: 'fn called once after first call', got: callsAfterFirst },
    { pass: callsAfterSecond === 1, description: 'fn NOT called again on cache hit', got: callsAfterSecond },
    { pass: r3 === 25,              description: 'New arg (5) returns correct result (25)', got: r3 },
    { pass: callsAfterThird === 2,  description: 'fn called again for new arg', got: callsAfterThird },
    { pass: callsAfterFourth === 2, description: 'fn NOT called again on second cache hit for 5', got: callsAfterFourth },
    { pass: pure(7) === 17,         description: 'Works for basic addition too', got: pure(7) },
  ];
}`,
  `The cache lives inside the closure — it's created once when memoize(fn) is called, and every call to the returned function shares the same Map. Check cache.has(arg) first. If cached, return cache.get(arg). Otherwise call fn(arg), store it with cache.set(arg, result), and return it.`
));

// A8 — Tier 4: curry (two-argument)
exercises.push(js(
  'curry',
  ['functions', 'higher-order'],
  ['functions', 'higher-order', 'curry', 'partial-application', 'tier4'],
  4,
  'Write a curry function that converts a two-argument function into a chain of single-argument functions.',
  `Write a function \`curry(fn)\` that takes a **two-argument function** and returns a **curried version** of it.

The curried version can be called in two ways:
1. Both args at once: \`curriedFn(a, b)\` → same as \`fn(a, b)\`
2. One arg at a time: \`curriedFn(a)(b)\` → same as \`fn(a, b)\`

\`\`\`js
const add = curry((a, b) => a + b);
add(3, 4);     // 7
add(3)(4);     // 7

const multiply = curry((a, b) => a * b);
const triple = multiply(3);  // returns a function waiting for b
triple(5);     // 15
triple(10);    // 30
\`\`\`

This is how libraries like Ramda and lodash work. A curried function lets you partially apply arguments and reuse the result.`,
  `function curry(fn) {
  // return a function that works both ways:
  // called with 2 args → run fn immediately
  // called with 1 arg  → return a function waiting for the second
}`,
  `function curry(fn) {
  return function(a, b) {
    if (b !== undefined) {
      return fn(a, b);
    }
    return function(b) {
      return fn(a, b);
    };
  };
}`,
  `(code) => {
  const curry = new Function(code + '; return curry;')();
  const add      = curry((a, b) => a + b);
  const multiply = curry((a, b) => a * b);
  const greet    = curry((greeting, name) => greeting + ', ' + name + '!');

  const triple  = multiply(3);
  const add10   = add(10);
  const sayHi   = greet('Hi');

  return [
    { pass: add(3, 4) === 7,           description: 'add(3, 4) === 7 (both args at once)', got: add(3, 4) },
    { pass: add(3)(4) === 7,           description: 'add(3)(4) === 7 (one at a time)',     got: add(3)(4) },
    { pass: triple(5) === 15,          description: 'multiply(3)(5) === 15',               got: triple(5) },
    { pass: triple(10) === 30,         description: 'multiply(3)(10) === 30',              got: triple(10) },
    { pass: add10(7) === 17,           description: 'add(10)(7) === 17',                   got: add10(7) },
    { pass: multiply(4, 5) === 20,     description: 'multiply(4, 5) === 20 (both args)',   got: multiply(4, 5) },
    { pass: sayHi('Alex') === 'Hi, Alex!', description: 'greet("Hi")("Alex") === "Hi, Alex!"', got: sayHi('Alex') },
  ];
}`,
  `Inside the returned function, check if b was provided. If arguments.length >= 2 (or b !== undefined), call fn(a, b) immediately. Otherwise return a new function that remembers a and waits for b. This is partial application — you're "locking in" the first argument.`
));

// ═══════════════════════════════════════════════════════════════════════════
// SECTION B: functions/scope
// ═══════════════════════════════════════════════════════════════════════════

// B1 — Step 1: makeCounter with configurable start and step
exercises.push(js(
  'makeCounter (configurable)',
  ['functions', 'scope'],
  ['functions', 'scope', 'closure', 'factory', 'tier3'],
  3,
  'Build a configurable counter using closures.',
  `You already built a basic \`makeCounter\` in Tier 2. Now make it configurable.

Write a function \`makeCounter(start = 0, step = 1)\` that returns an object with three methods:
- \`increment()\` — adds \`step\` to the count, returns the new count
- \`decrement()\` — subtracts \`step\` from the count, returns the new count
- \`reset()\` — resets to \`start\`, returns \`start\`

\`\`\`js
const c = makeCounter(10, 5);
c.increment();  // 15
c.increment();  // 20
c.decrement();  // 15
c.reset();      // 10
c.increment();  // 15

const basic = makeCounter();
basic.increment();  // 1
basic.increment();  // 2
\`\`\``,
  `function makeCounter(start = 0, step = 1) {
  // your code here
}`,
  `function makeCounter(start = 0, step = 1) {
  let count = start;
  return {
    increment() { count += step; return count; },
    decrement() { count -= step; return count; },
    reset()     { count = start; return count; },
  };
}`,
  `(code) => {
  const makeCounter = new Function(code + '; return makeCounter;')();
  const c = makeCounter(10, 5);
  const basic = makeCounter();

  const r1 = c.increment();
  const r2 = c.increment();
  const r3 = c.decrement();
  const r4 = c.reset();
  const r5 = c.increment();
  const b1 = basic.increment();
  const b2 = basic.increment();
  const b3 = basic.reset();

  return [
    { pass: r1 === 15,  description: 'increment from 10 by 5 → 15',   got: r1 },
    { pass: r2 === 20,  description: 'increment again → 20',           got: r2 },
    { pass: r3 === 15,  description: 'decrement → 15',                 got: r3 },
    { pass: r4 === 10,  description: 'reset → back to start (10)',     got: r4 },
    { pass: r5 === 15,  description: 'increment after reset → 15',     got: r5 },
    { pass: b1 === 1,   description: 'basic counter: first increment → 1', got: b1 },
    { pass: b2 === 2,   description: 'basic counter: second increment → 2', got: b2 },
    { pass: b3 === 0,   description: 'basic counter: reset → 0',       got: b3 },
  ];
}`,
  `The counter value lives in the closure as \`let count = start\`. Return an object with methods — each method closes over both \`count\` and \`step\`. reset() restores count to start, which is also in the closure. Default parameters (start = 0, step = 1) make the function flexible without requiring arguments.`
));

// B2 — Step 2: Factory that returns object with methods (createPerson)
exercises.push(js(
  'createPerson',
  ['functions', 'scope'],
  ['functions', 'scope', 'closure', 'factory', 'object', 'tier3'],
  3,
  'Write a factory function that creates person objects with encapsulated state.',
  `Write a function \`createPerson(name, age)\` that returns an object with:
- \`getName()\` — returns name
- \`getAge()\` — returns age
- \`greet()\` — returns \`"Hi, I'm <name> and I'm <age> years old."\`
- \`birthday()\` — increments age by 1, returns new age
- \`isAdult()\` — returns \`true\` if age >= 18

\`\`\`js
const alex = createPerson('Alex', 17);
alex.getName();    // 'Alex'
alex.getAge();     // 17
alex.isAdult();    // false
alex.birthday();   // 18
alex.isAdult();    // true
alex.greet();      // "Hi, I'm Alex and I'm 18 years old."
\`\`\`

The name and age are **private** — accessible only through the methods, not directly on the object.`,
  `function createPerson(name, age) {
  // return an object with methods
  // name and age should only be accessible through the methods
}`,
  `function createPerson(name, age) {
  return {
    getName()  { return name; },
    getAge()   { return age; },
    greet()    { return \`Hi, I'm \${name} and I'm \${age} years old.\`; },
    birthday() { age += 1; return age; },
    isAdult()  { return age >= 18; },
  };
}`,
  `(code) => {
  const createPerson = new Function(code + '; return createPerson;')();
  const alex = createPerson('Alex', 17);
  const sam  = createPerson('Sam', 30);

  const name0    = alex.getName();
  const age0     = alex.getAge();
  const adult0   = alex.isAdult();
  const bdayAge  = alex.birthday();
  const adult1   = alex.isAdult();
  const greet1   = alex.greet();
  const samAge   = sam.getAge();
  const directAccess = alex.name;

  return [
    { pass: name0 === 'Alex',    description: 'getName() returns name',             got: name0 },
    { pass: age0 === 17,         description: 'getAge() returns initial age',       got: age0 },
    { pass: adult0 === false,    description: 'isAdult() false at 17',              got: adult0 },
    { pass: bdayAge === 18,      description: 'birthday() increments age to 18',   got: bdayAge },
    { pass: adult1 === true,     description: 'isAdult() true after birthday',      got: adult1 },
    { pass: greet1 === "Hi, I'm Alex and I'm 18 years old.", description: 'greet() uses current age', got: greet1 },
    { pass: samAge === 30,       description: 'sam is independent from alex',       got: samAge },
    { pass: directAccess === undefined, description: 'name not directly accessible', got: directAccess },
  ];
}`,
  `This is the factory pattern — createPerson returns an object, and the methods inside it close over \`name\` and \`age\`. Because age is a plain variable in the closure (not a property on the returned object), it can't be accessed as alex.age — only through getAge() and birthday().`
));

// B3 — Step 3: makeAccumulator — combines closure + running total
exercises.push(js(
  'makeAccumulator',
  ['functions', 'scope'],
  ['functions', 'scope', 'closure', 'tier3'],
  3,
  'Write a factory that returns a function keeping a running total.',
  `Write a function \`makeAccumulator(initialValue = 0)\` that returns a **function**.

Each time the returned function is called with a number, it adds that number to an internal running total and **returns the new total**.

\`\`\`js
const acc = makeAccumulator(0);
acc(10);   // 10
acc(5);    // 15
acc(-3);   // 12
acc(100);  // 112

const startAt50 = makeAccumulator(50);
startAt50(10);  // 60
startAt50(10);  // 70
\`\`\`

Two accumulators should be **completely independent** — adding to one doesn't affect the other.`,
  `function makeAccumulator(initialValue = 0) {
  // return a function that adds its argument to a running total
}`,
  `function makeAccumulator(initialValue = 0) {
  let total = initialValue;
  return function(n) {
    total += n;
    return total;
  };
}`,
  `(code) => {
  const makeAccumulator = new Function(code + '; return makeAccumulator;')();
  const acc  = makeAccumulator(0);
  const acc2 = makeAccumulator(50);

  const r1 = acc(10);
  const r2 = acc(5);
  const r3 = acc(-3);
  const r4 = acc(100);
  const r5 = acc(0);
  const s1 = acc2(10);
  const s2 = acc2(10);

  return [
    { pass: r1 === 10,   description: 'acc(10) → 10',                       got: r1 },
    { pass: r2 === 15,   description: 'acc(5) → 15 (running total)',        got: r2 },
    { pass: r3 === 12,   description: 'acc(-3) → 12 (negative works)',      got: r3 },
    { pass: r4 === 112,  description: 'acc(100) → 112',                     got: r4 },
    { pass: r5 === 112,  description: 'acc(0) → 112 unchanged',             got: r5 },
    { pass: s1 === 60,   description: 'acc2 starting at 50: +10 → 60',      got: s1 },
    { pass: s2 === 70,   description: 'acc2(10) → 70 (independent from acc)', got: s2 },
  ];
}`,
  `The total lives in the closure as \`let total = initialValue\`. The returned function adds its argument to total and returns total. Each call to makeAccumulator creates a brand new total variable — that's why two accumulators are independent.`
));

// B4 — Tier 4: module pattern with private state
exercises.push(js(
  'createWallet',
  ['functions', 'scope'],
  ['functions', 'scope', 'closure', 'module-pattern', 'tier4'],
  4,
  'Build a wallet using the module pattern — private state, controlled access.',
  `Write a function \`createWallet(initialBalance)\` that returns an object representing a wallet.

The **balance is private** — it cannot be read or written directly. It can only be accessed through methods.

Return an object with:
- \`deposit(amount)\` — adds amount (if positive), returns new balance
- \`withdraw(amount)\` — subtracts amount if sufficient funds exist; returns new balance. If amount > balance OR amount <= 0, return \`"Insufficient funds"\`
- \`getBalance()\` — returns current balance
- \`getHistory()\` — returns array of transaction strings like \`"+50"\`, \`"-30"\`

\`\`\`js
const w = createWallet(100);
w.getBalance();     // 100
w.deposit(50);      // 150
w.withdraw(30);     // 120
w.withdraw(200);    // "Insufficient funds"
w.getHistory();     // ["+50", "-30"]
w.balance;          // undefined (private)
\`\`\``,
  `function createWallet(initialBalance) {
  // balance and history are private (closure variables)
  // return an object with deposit, withdraw, getBalance, getHistory
}`,
  `function createWallet(initialBalance) {
  let balance = initialBalance;
  const history = [];
  return {
    deposit(amount) {
      if (amount <= 0) return balance;
      balance += amount;
      history.push('+' + amount);
      return balance;
    },
    withdraw(amount) {
      if (amount <= 0 || amount > balance) return 'Insufficient funds';
      balance -= amount;
      history.push('-' + amount);
      return balance;
    },
    getBalance() { return balance; },
    getHistory() { return [...history]; },
  };
}`,
  `(code) => {
  const createWallet = new Function(code + '; return createWallet;')();
  const w = createWallet(100);

  const b0  = w.getBalance();
  const d1  = w.deposit(50);
  const w1  = w.withdraw(30);
  const wBad = w.withdraw(500);
  const hist = w.getHistory();

  return [
    { pass: b0 === 100,               description: 'Initial balance is 100', got: b0 },
    { pass: d1 === 150,               description: 'deposit(50) → 150',      got: d1 },
    { pass: w1 === 120,               description: 'withdraw(30) → 120',     got: w1 },
    { pass: wBad === 'Insufficient funds', description: 'withdraw too much → "Insufficient funds"', got: wBad },
    { pass: w.getBalance() === 120,   description: 'balance unchanged after failed withdrawal', got: w.getBalance() },
    { pass: Array.isArray(hist),      description: 'getHistory returns an array', got: typeof hist },
    { pass: hist.includes('+50'),     description: 'history includes "+50"',  got: hist.join(', ') },
    { pass: hist.includes('-30'),     description: 'history includes "-30"',  got: hist.join(', ') },
    { pass: hist.length === 2,        description: 'history has 2 entries (failed withdrawal not recorded)', got: hist.length },
    { pass: w.balance === undefined,  description: 'balance is private (w.balance === undefined)', got: w.balance },
  ];
}`,
  `Both balance and history are closure variables — they exist only inside createWallet, invisible from outside. The returned object's methods can access them because they close over the same scope. getHistory returns [...history] (a copy) so the caller can't mutate the private history array directly.`
));

// ═══════════════════════════════════════════════════════════════════════════
// WRITE
// ═══════════════════════════════════════════════════════════════════════════
console.log('Self-validating all exercises...');
let totalTests = 0;
let failed = false;

exercises.forEach(e => {
  try {
    const fn = new Function('code', 'return (' + e.testRunner + ')(code)');
    const results = fn(e.solution);
    const bad = results.filter(r => !r.pass);
    totalTests += results.length;
    if (bad.length) {
      failed = true;
      bad.forEach(r => console.error('  ✗', e.title, '—', r.description, '— got:', r.got));
    } else {
      console.log('  ✓', e.title, '(' + results.length + ')');
    }
  } catch(err) {
    failed = true;
    console.error('  ✗ CRASH', e.title, err.message);
  }
});

if (failed) { console.error('\nAborting — fix failures above'); process.exit(1); }
console.log('\n✓ All ' + totalTests + ' test cases pass across ' + exercises.length + ' exercises\n');

data.exercises.push(...exercises);
require('fs').writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Written. Next ID:', nextId);
console.log('Total exercises:', data.exercises.length);
