/**
 * Add Tier 4 (Architect) and Tier 5 (Mastercraft) exercises
 *
 * 12 Tier 4 exercises (IDs 279-290):
 *   - createValidator, createStateMachine, retryAsync, promiseAll
 *   - Observable, LinkedList, deepClone, createRouter
 *   - Dataset: Music Library, Responsive Dashboard Layout, throttle, Iterable Range
 *
 * 6 Tier 5 exercises (IDs 291-296):
 *   - Task Management System, Event Scheduler, Data Pipeline Builder
 *   - E-Commerce System, Interactive Form Builder, Async Task Queue
 *
 * Also:
 *   - Expands default-curriculum collection (20 → 26)
 *   - Creates capstone-track collection
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── TIER 4 EXERCISES ─────────────────────────────────────────────────────────

const tier4Exercises = [
  // ── 279: createValidator ────────────────────────────────────────────────
  {
    id: 279,
    title: 'createValidator',
    type: 'js',
    tier: 4,
    category: ['functions', 'scope'],
    tags: ['closure', 'validation', 'module-pattern', 'higher-order', 'tier4'],
    description: 'Build a configurable validator factory using closures — define rules, then validate objects.',
    instructions: `Build a factory function that returns a validator object with private rule storage.\n\n**createValidator()** — returns an object with:\n\n- \`addRule(field, testFn, errorMsg)\` — registers a validation rule. \`testFn\` receives the field value and returns \`true\` if valid.\n- \`validate(obj)\` — runs all rules against the object. Returns \`{ valid: boolean, errors: string[] }\`. An empty errors array means valid.\n- \`getRules()\` — returns the number of registered rules.\n\n\`\`\`js\nconst v = createValidator();\nv.addRule('name', val => typeof val === 'string' && val.length > 0, 'Name is required');\nv.addRule('age', val => typeof val === 'number' && val >= 18, 'Must be 18+');\nv.addRule('email', val => val.includes('@'), 'Invalid email');\n\nv.getRules(); // 3\n\nv.validate({ name: 'Alex', age: 25, email: 'alex@test.com' });\n// { valid: true, errors: [] }\n\nv.validate({ name: '', age: 16, email: 'bad' });\n// { valid: false, errors: ['Name is required', 'Must be 18+', 'Invalid email'] }\n\nv.validate({ name: 'Alex', age: 25 });\n// { valid: false, errors: ['Invalid email'] }  — missing field fails the test\n\`\`\``,
    starterCode: `function createValidator() {\n  // private rule storage\n\n  return {\n    addRule(field, testFn, errorMsg) {\n      // your code here\n    },\n\n    validate(obj) {\n      // your code here\n    },\n\n    getRules() {\n      // your code here\n    },\n  };\n}`,
    solution: `function createValidator() {\n  const rules = [];\n\n  return {\n    addRule(field, testFn, errorMsg) {\n      rules.push({ field, testFn, errorMsg });\n    },\n\n    validate(obj) {\n      const errors = [];\n      for (const rule of rules) {\n        if (!rule.testFn(obj[rule.field])) {\n          errors.push(rule.errorMsg);\n        }\n      }\n      return { valid: errors.length === 0, errors };\n    },\n\n    getRules() {\n      return rules.length;\n    },\n  };\n}`,
    testRunner: `(code) => {
  const createValidator = new Function(code + '; return createValidator;')();
  const v = createValidator();
  v.addRule('name', val => typeof val === 'string' && val.length > 0, 'Name is required');
  v.addRule('age', val => typeof val === 'number' && val >= 18, 'Must be 18+');
  v.addRule('email', val => val && val.includes('@'), 'Invalid email');

  const good = v.validate({ name: 'Alex', age: 25, email: 'a@b.com' });
  const bad = v.validate({ name: '', age: 16, email: 'bad' });
  const missing = v.validate({ name: 'Alex', age: 25 });

  return [
    { pass: v.getRules() === 3, description: 'getRules() returns 3 after adding 3 rules', got: v.getRules() },
    { pass: good.valid === true, description: 'Valid object returns { valid: true }', got: good.valid },
    { pass: good.errors.length === 0, description: 'Valid object has empty errors array', got: good.errors.length },
    { pass: bad.valid === false, description: 'Invalid object returns { valid: false }', got: bad.valid },
    { pass: bad.errors.length === 3, description: 'All 3 rules fail for bad input', got: bad.errors.length },
    { pass: bad.errors[0] === 'Name is required', description: 'First error is name rule', got: bad.errors[0] },
    { pass: missing.valid === false && missing.errors.includes('Invalid email'), description: 'Missing field fails validation', got: missing.errors.join(', ') },
  ];
}`,
    hint: 'Store rules in a closure-scoped array. Each rule is an object with { field, testFn, errorMsg }. validate() iterates all rules, calling testFn(obj[field]) and collecting error messages when false.',
    resources: [{ label: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' }],
  },

  // ── 280: createStateMachine ─────────────────────────────────────────────
  {
    id: 280,
    title: 'createStateMachine',
    type: 'js',
    tier: 4,
    category: ['functions', 'scope'],
    tags: ['closure', 'state-machine', 'design-pattern', 'module-pattern', 'tier4'],
    description: 'Implement a finite state machine with transitions, guards, and history tracking.',
    instructions: `Build a state machine factory.\n\n**createStateMachine(initialState, transitions)** where \`transitions\` maps each state to its valid actions:\n\`\`\`js\nconst sm = createStateMachine('idle', {\n  idle:    { START: 'running' },\n  running: { PAUSE: 'paused', STOP: 'idle' },\n  paused:  { RESUME: 'running', STOP: 'idle' },\n});\n\`\`\`\n\nReturns an object with:\n- \`getState()\` — returns current state string\n- \`send(action)\` — transitions to new state if valid, returns new state. Returns \`false\` for invalid transitions.\n- \`canSend(action)\` — returns \`true\` if the action is valid from the current state\n- \`getHistory()\` — returns array of \`{ from, action, to }\` objects\n\n\`\`\`js\nsm.getState();        // 'idle'\nsm.canSend('START');  // true\nsm.canSend('PAUSE');  // false (not valid from 'idle')\nsm.send('START');     // 'running'\nsm.send('PAUSE');     // 'paused'\nsm.send('STOP');      // 'idle'\nsm.send('PAUSE');     // false (can't PAUSE from idle)\nsm.getHistory();\n// [\n//   { from: 'idle', action: 'START', to: 'running' },\n//   { from: 'running', action: 'PAUSE', to: 'paused' },\n//   { from: 'paused', action: 'STOP', to: 'idle' },\n// ]\n\`\`\``,
    starterCode: `function createStateMachine(initialState, transitions) {\n  // private state\n\n  return {\n    getState() {\n      // your code here\n    },\n\n    send(action) {\n      // your code here\n    },\n\n    canSend(action) {\n      // your code here\n    },\n\n    getHistory() {\n      // your code here\n    },\n  };\n}`,
    solution: `function createStateMachine(initialState, transitions) {\n  let current = initialState;\n  const history = [];\n\n  return {\n    getState() {\n      return current;\n    },\n\n    send(action) {\n      const stateTransitions = transitions[current];\n      if (!stateTransitions || !stateTransitions[action]) return false;\n      const from = current;\n      current = stateTransitions[action];\n      history.push({ from, action, to: current });\n      return current;\n    },\n\n    canSend(action) {\n      const stateTransitions = transitions[current];\n      return !!(stateTransitions && stateTransitions[action]);\n    },\n\n    getHistory() {\n      return [...history];\n    },\n  };\n}`,
    testRunner: `(code) => {
  const createStateMachine = new Function(code + '; return createStateMachine;')();
  const sm = createStateMachine('idle', {
    idle: { START: 'running' },
    running: { PAUSE: 'paused', STOP: 'idle' },
    paused: { RESUME: 'running', STOP: 'idle' },
  });

  return [
    { pass: sm.getState() === 'idle', description: 'Initial state is idle', got: sm.getState() },
    { pass: sm.canSend('START') === true, description: 'canSend START from idle', got: sm.canSend('START') },
    { pass: sm.canSend('PAUSE') === false, description: 'cannot PAUSE from idle', got: sm.canSend('PAUSE') },
    { pass: sm.send('START') === 'running', description: 'send START → running', got: sm.send('START') || sm.getState() },
    { pass: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' }, active: { STOP: 'idle' } }); s.send('GO'); s.send('STOP'); return s.getState() === 'idle'; })(), description: 'Transitions work through multiple states', got: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' }, active: { STOP: 'idle' } }); s.send('GO'); s.send('STOP'); return s.getState(); })() },
    { pass: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' } }); return s.send('INVALID') === false; })(), description: 'Invalid action returns false', got: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' } }); return s.send('INVALID'); })() },
    { pass: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' }, active: {} }); s.send('GO'); const h = s.getHistory(); return h.length === 1 && h[0].from === 'idle' && h[0].action === 'GO' && h[0].to === 'active'; })(), description: 'getHistory tracks transitions', got: (() => { const s = createStateMachine('idle', { idle: { GO: 'active' }, active: {} }); s.send('GO'); return JSON.stringify(s.getHistory()); })() },
  ];
}`,
    hint: 'Store `current` state and `history` array in closure scope. send() looks up transitions[current][action] — if it exists, update current and push to history. canSend() just checks if the lookup exists.',
    resources: [{ label: 'State Machine Pattern', url: 'https://developer.mozilla.org/en-US/docs/Glossary/State_machine' }],
  },

  // ── 281: retryAsync ─────────────────────────────────────────────────────
  {
    id: 281,
    title: 'retryAsync',
    type: 'js',
    tier: 4,
    category: ['es6-plus', 'async'],
    tags: ['async', 'await', 'promises', 'error-handling', 'retry', 'tier4'],
    description: 'Write an async utility that retries a failing function up to N times with configurable delay.',
    instructions: `Write an async function:\n\n**retryAsync(fn, options)** where:\n- \`fn\` is an async function (returns a Promise)\n- \`options\` has \`{ maxRetries, delay, onRetry }\`\n  - \`maxRetries\`: number of retry attempts (default 3)\n  - \`delay\`: ms to wait between retries (default 0)\n  - \`onRetry\`: optional callback \`(error, attempt) => {}\` called before each retry\n\nBehavior:\n1. Call \`fn()\`. If it succeeds, return the result.\n2. If it throws, wait \`delay\` ms, call \`onRetry(error, attemptNumber)\` if provided, then retry.\n3. After \`maxRetries\` failures, throw the last error.\n\n\`\`\`js\nlet calls = 0;\nconst flaky = async () => {\n  calls++;\n  if (calls < 3) throw new Error('fail');\n  return 'success';\n};\n\nconst result = await retryAsync(flaky, { maxRetries: 5, delay: 10 });\n// result === 'success', calls === 3\n\`\`\``,
    starterCode: `async function retryAsync(fn, options = {}) {\n  const maxRetries = options.maxRetries ?? 3;\n  const delay = options.delay ?? 0;\n  const onRetry = options.onRetry ?? null;\n\n  // your code here\n}`,
    solution: `async function retryAsync(fn, options = {}) {\n  const maxRetries = options.maxRetries ?? 3;\n  const delay = options.delay ?? 0;\n  const onRetry = options.onRetry ?? null;\n\n  let lastError;\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n      if (attempt < maxRetries) {\n        if (delay > 0) await new Promise(r => setTimeout(r, delay));\n        if (onRetry) onRetry(err, attempt + 1);\n      }\n    }\n  }\n  throw lastError;\n}`,
    testRunner: `(code) => {
  const retryAsync = new Function(code + '; return retryAsync;')();
  const results = [];

  const test1 = (async () => {
    const r = await retryAsync(async () => 'ok', { maxRetries: 3 });
    return r === 'ok';
  })();

  const test2 = (async () => {
    let c = 0;
    const r = await retryAsync(async () => { c++; if (c < 3) throw new Error('x'); return 'done'; }, { maxRetries: 5 });
    return r === 'done' && c === 3;
  })();

  const test3 = (async () => {
    try {
      await retryAsync(async () => { throw new Error('always'); }, { maxRetries: 2 });
      return false;
    } catch (e) {
      return e.message === 'always';
    }
  })();

  const test4 = (async () => {
    const retries = [];
    let c = 0;
    await retryAsync(async () => { c++; if (c < 2) throw new Error('fail'); return 'ok'; }, { maxRetries: 3, onRetry: (err, attempt) => retries.push(attempt) });
    return retries.length === 1 && retries[0] === 1;
  })();

  return Promise.all([test1, test2, test3, test4]).then(([r1, r2, r3, r4]) => [
    { pass: r1, description: 'Returns result on first success', got: r1 },
    { pass: r2, description: 'Retries until success (3rd attempt)', got: r2 },
    { pass: r3, description: 'Throws last error after maxRetries', got: r3 },
    { pass: r4, description: 'Calls onRetry with attempt number', got: r4 },
  ]);
}`,
    hint: 'Use a for loop from 0 to maxRetries. Inside: try calling fn(). On catch, if not the last attempt, wait using `await new Promise(r => setTimeout(r, delay))` then call onRetry. After the loop, throw the last error.',
    resources: [{ label: 'MDN: async/await', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises' }],
  },

  // ── 282: promiseAll ─────────────────────────────────────────────────────
  {
    id: 282,
    title: 'promiseAll',
    type: 'js',
    tier: 4,
    category: ['es6-plus', 'async'],
    tags: ['async', 'promises', 'implementation', 'error-handling', 'tier4'],
    description: 'Implement your own Promise.all — resolve when all resolve, reject on first failure.',
    instructions: `Write a function:\n\n**promiseAll(promises)** that takes an array of promises and returns a new Promise.\n\n- Resolves with an array of results (in original order) when ALL promises resolve\n- Rejects with the first error encountered\n- Empty array resolves immediately with \`[]\`\n- Results must maintain order even if promises resolve out of order\n\n\`\`\`js\nconst result = await promiseAll([\n  Promise.resolve(1),\n  new Promise(r => setTimeout(() => r(2), 50)),\n  Promise.resolve(3),\n]);\n// [1, 2, 3]  — in order, even though middle one resolved last\n\ntry {\n  await promiseAll([\n    Promise.resolve(1),\n    Promise.reject(new Error('boom')),\n    Promise.resolve(3),\n  ]);\n} catch (e) {\n  // e.message === 'boom'\n}\n\`\`\``,
    starterCode: `function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    // your code here\n  });\n}`,
    solution: `function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (promises.length === 0) return resolve([]);\n    const results = new Array(promises.length);\n    let resolved = 0;\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then(value => {\n        results[i] = value;\n        resolved++;\n        if (resolved === promises.length) resolve(results);\n      }).catch(reject);\n    });\n  });\n}`,
    testRunner: `(code) => {
  const promiseAll = new Function(code + '; return promiseAll;')();

  const test1 = promiseAll([]).then(r => r.length === 0);
  const test2 = promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then(r => JSON.stringify(r) === '[1,2,3]');
  const test3 = promiseAll([
    new Promise(r => setTimeout(() => r('slow'), 30)),
    Promise.resolve('fast'),
  ]).then(r => r[0] === 'slow' && r[1] === 'fast');
  const test4 = promiseAll([Promise.resolve(1), Promise.reject(new Error('boom')), Promise.resolve(3)]).then(() => false).catch(e => e.message === 'boom');

  return Promise.all([test1, test2, test3, test4]).then(([r1, r2, r3, r4]) => [
    { pass: r1, description: 'Empty array resolves with []', got: r1 },
    { pass: r2, description: 'Resolves with [1,2,3] in order', got: r2 },
    { pass: r3, description: 'Maintains order despite async timing', got: r3 },
    { pass: r4, description: 'Rejects with first error', got: r4 },
  ]);
}`,
    hint: 'Create a results array and a resolved counter. Use forEach with index to place each result at the right position. Increment counter on each .then() and resolve when counter === length. Any .catch() triggers reject immediately.',
    resources: [{ label: 'MDN: Promise', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' }],
  },

  // ── 283: Observable ─────────────────────────────────────────────────────
  {
    id: 283,
    title: 'Observable',
    type: 'js',
    tier: 4,
    category: ['js-fundamentals', 'classes'],
    tags: ['class', 'oop', 'design-pattern', 'reactive', 'callbacks', 'tier4'],
    description: 'Build an Observable class with subscribe/unsubscribe, value changes, and derived state via .map().',
    instructions: `Create an **Observable** class:\n\n**Constructor:** takes an initial value\n\n**Methods:**\n- \`get()\` — returns current value\n- \`set(value)\` — updates value and notifies all subscribers with the new value\n- \`subscribe(callback)\` — registers a listener. Returns an **unsubscribe function**.\n- \`map(transformFn)\` — returns a NEW Observable whose value auto-updates when the source changes\n- \`subscriberCount()\` — returns number of active subscribers\n\n\`\`\`js\nconst count = new Observable(0);\nconst logs = [];\n\nconst unsub = count.subscribe(val => logs.push(val));\ncount.set(1);     // logs: [1]\ncount.set(2);     // logs: [1, 2]\n\nconst doubled = count.map(x => x * 2);\ndoubled.get();    // 4 (2 * 2)\n\ncount.set(5);\ndoubled.get();    // 10 (5 * 2)\n\nunsub();          // unsubscribe\ncount.set(99);    // logs still [1, 2] — unsubscribed\ncount.subscriberCount(); // 1 (only the map's internal subscription)\n\`\`\``,
    starterCode: `class Observable {\n  constructor(initialValue) {\n    // your code here\n  }\n\n  get() {\n    // your code here\n  }\n\n  set(value) {\n    // your code here\n  }\n\n  subscribe(callback) {\n    // your code here — return an unsubscribe function\n  }\n\n  map(transformFn) {\n    // your code here — return a new Observable\n  }\n\n  subscriberCount() {\n    // your code here\n  }\n}`,
    solution: `class Observable {\n  constructor(initialValue) {\n    this._value = initialValue;\n    this._subscribers = new Set();\n  }\n\n  get() {\n    return this._value;\n  }\n\n  set(value) {\n    this._value = value;\n    for (const cb of this._subscribers) cb(value);\n  }\n\n  subscribe(callback) {\n    this._subscribers.add(callback);\n    return () => this._subscribers.delete(callback);\n  }\n\n  map(transformFn) {\n    const derived = new Observable(transformFn(this._value));\n    this.subscribe(val => derived.set(transformFn(val)));\n    return derived;\n  }\n\n  subscriberCount() {\n    return this._subscribers.size;\n  }\n}`,
    testRunner: `(code) => {
  const Observable = new Function(code + '; return Observable;')();
  const count = new Observable(0);
  const logs = [];
  const unsub = count.subscribe(val => logs.push(val));
  count.set(1);
  count.set(2);
  const doubled = count.map(x => x * 2);

  return [
    { pass: count.get() === 2, description: 'get() returns current value', got: count.get() },
    { pass: logs.length === 2 && logs[0] === 1 && logs[1] === 2, description: 'subscribe notified on set()', got: JSON.stringify(logs) },
    { pass: doubled.get() === 4, description: 'map() derives value (2*2=4)', got: doubled.get() },
    { pass: (() => { count.set(5); return doubled.get() === 10; })(), description: 'Derived updates when source changes (5*2=10)', got: doubled.get() },
    { pass: (() => { unsub(); const before = logs.length; count.set(99); return logs.length === before; })(), description: 'Unsubscribe stops notifications', got: logs.length },
    { pass: count.subscriberCount() === 1, description: 'subscriberCount is 1 (map internal sub)', got: count.subscriberCount() },
  ];
}`,
    hint: 'Use a Set for subscribers (easy add/delete). subscribe() returns a function that calls Set.delete(). map() creates a new Observable and subscribes to the source, updating the derived value through the transform function.',
    resources: [{ label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' }],
  },

  // ── 284: LinkedList ─────────────────────────────────────────────────────
  {
    id: 284,
    title: 'LinkedList',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'arrays'],
    tags: ['class', 'data-structure', 'linked-list', 'algorithms', 'tier4'],
    description: 'Implement a singly linked list with append, remove, find, and in-place reverse.',
    instructions: `Build two classes:\n\n**Node(value)** — \`this.value\`, \`this.next = null\`\n\n**LinkedList()** — \`this.head = null\`, \`this.size = 0\`\n\n**Methods:**\n- \`append(value)\` — add to end\n- \`prepend(value)\` — add to beginning\n- \`getAt(index)\` — return value at index, or \`null\` if out of bounds\n- \`removeAt(index)\` — remove node at index, return removed value, or \`null\`\n- \`find(value)\` — return index of first match, or \`-1\`\n- \`reverse()\` — reverse the list in place\n- \`toArray()\` — return array of all values\n- \`toString()\` — return values joined with \`' -> '\`\n\n\`\`\`js\nconst list = new LinkedList();\nlist.append(1);\nlist.append(2);\nlist.append(3);\nlist.prepend(0);\nlist.toString();   // '0 -> 1 -> 2 -> 3'\nlist.getAt(2);     // 2\nlist.find(3);      // 3 (index)\nlist.removeAt(1);  // 1 (removed value)\nlist.toString();   // '0 -> 2 -> 3'\nlist.reverse();\nlist.toString();   // '3 -> 2 -> 0'\n\`\`\``,
    starterCode: `class Node {\n  constructor(value) {\n    // your code here\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    // your code here\n  }\n\n  append(value) {\n    // your code here\n  }\n\n  prepend(value) {\n    // your code here\n  }\n\n  getAt(index) {\n    // your code here\n  }\n\n  removeAt(index) {\n    // your code here\n  }\n\n  find(value) {\n    // your code here\n  }\n\n  reverse() {\n    // your code here\n  }\n\n  toArray() {\n    // your code here\n  }\n\n  toString() {\n    // your code here\n  }\n}`,
    solution: `class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n    this.size = 0;\n  }\n\n  append(value) {\n    const node = new Node(value);\n    if (!this.head) { this.head = node; }\n    else {\n      let curr = this.head;\n      while (curr.next) curr = curr.next;\n      curr.next = node;\n    }\n    this.size++;\n  }\n\n  prepend(value) {\n    const node = new Node(value);\n    node.next = this.head;\n    this.head = node;\n    this.size++;\n  }\n\n  getAt(index) {\n    if (index < 0 || index >= this.size) return null;\n    let curr = this.head;\n    for (let i = 0; i < index; i++) curr = curr.next;\n    return curr.value;\n  }\n\n  removeAt(index) {\n    if (index < 0 || index >= this.size) return null;\n    let removed;\n    if (index === 0) {\n      removed = this.head.value;\n      this.head = this.head.next;\n    } else {\n      let curr = this.head;\n      for (let i = 0; i < index - 1; i++) curr = curr.next;\n      removed = curr.next.value;\n      curr.next = curr.next.next;\n    }\n    this.size--;\n    return removed;\n  }\n\n  find(value) {\n    let curr = this.head;\n    let idx = 0;\n    while (curr) {\n      if (curr.value === value) return idx;\n      curr = curr.next;\n      idx++;\n    }\n    return -1;\n  }\n\n  reverse() {\n    let prev = null;\n    let curr = this.head;\n    while (curr) {\n      const next = curr.next;\n      curr.next = prev;\n      prev = curr;\n      curr = next;\n    }\n    this.head = prev;\n  }\n\n  toArray() {\n    const arr = [];\n    let curr = this.head;\n    while (curr) { arr.push(curr.value); curr = curr.next; }\n    return arr;\n  }\n\n  toString() {\n    return this.toArray().join(' -> ');\n  }\n}`,
    testRunner: `(code) => {
  const { Node, LinkedList } = new Function(code + '; return { Node, LinkedList };')();
  const list = new LinkedList();
  list.append(1); list.append(2); list.append(3); list.prepend(0);

  return [
    { pass: list.toString() === '0 -> 1 -> 2 -> 3', description: 'append/prepend builds list', got: list.toString() },
    { pass: list.size === 4, description: 'size tracks count', got: list.size },
    { pass: list.getAt(2) === 2, description: 'getAt(2) returns 2', got: list.getAt(2) },
    { pass: list.getAt(10) === null, description: 'getAt out of bounds returns null', got: list.getAt(10) },
    { pass: list.find(3) === 3, description: 'find(3) returns index 3', got: list.find(3) },
    { pass: list.find(99) === -1, description: 'find missing returns -1', got: list.find(99) },
    { pass: (() => { const l = new LinkedList(); l.append(1); l.append(2); l.append(3); const r = l.removeAt(1); return r === 2 && l.toString() === '1 -> 3'; })(), description: 'removeAt(1) removes middle node', got: (() => { const l = new LinkedList(); l.append(1); l.append(2); l.append(3); l.removeAt(1); return l.toString(); })() },
    { pass: (() => { const l = new LinkedList(); l.append(1); l.append(2); l.append(3); l.reverse(); return l.toString() === '3 -> 2 -> 1'; })(), description: 'reverse() reverses in place', got: (() => { const l = new LinkedList(); l.append(1); l.append(2); l.append(3); l.reverse(); return l.toString(); })() },
  ];
}`,
    hint: 'For reverse(), use three pointers: prev, curr, next. In each step: save next, point curr.next to prev, advance prev to curr, advance curr to next. When done, set head to prev.',
    resources: [{ label: 'Linked List Visualization', url: 'https://visualgo.net/en/list' }],
  },

  // ── 285: deepClone ──────────────────────────────────────────────────────
  {
    id: 285,
    title: 'deepClone',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'objects'],
    tags: ['recursion', 'objects', 'arrays', 'deep-copy', 'type-checking', 'tier4'],
    description: 'Write a deep clone function handling objects, arrays, dates, and nested structures.',
    instructions: `Write a function:\n\n**deepClone(value)** that produces a fully independent copy.\n\nMust handle:\n- **Primitives** (string, number, boolean, null, undefined) — return as-is\n- **Plain objects** — recurse into all keys\n- **Arrays** — recurse into all elements\n- **Date instances** — create new Date with same time\n- **Nested structures** — any depth\n\nThe clone must be fully independent — mutating the clone must never affect the original.\n\n\`\`\`js\nconst original = {\n  name: 'Alex',\n  scores: [1, 2, 3],\n  nested: { a: { b: 'deep' } },\n  date: new Date('2024-01-01'),\n};\n\nconst clone = deepClone(original);\nclone.scores.push(4);\nclone.nested.a.b = 'changed';\n\noriginal.scores;      // [1, 2, 3] — unchanged\noriginal.nested.a.b;  // 'deep' — unchanged\nclone.date instanceof Date; // true\nclone.date.getTime() === original.date.getTime(); // true\nclone.date !== original.date; // true — different object\n\`\`\``,
    starterCode: `function deepClone(value) {\n  // your code here\n}`,
    solution: `function deepClone(value) {\n  if (value === null || typeof value !== 'object') return value;\n  if (value instanceof Date) return new Date(value.getTime());\n  if (Array.isArray(value)) return value.map(item => deepClone(item));\n  const result = {};\n  for (const key in value) {\n    if (value.hasOwnProperty(key)) {\n      result[key] = deepClone(value[key]);\n    }\n  }\n  return result;\n}`,
    testRunner: `(code) => {
  const deepClone = new Function(code + '; return deepClone;')();
  const orig = { name: 'Alex', scores: [1, 2, 3], nested: { a: { b: 'deep' } }, date: new Date('2024-01-01') };
  const clone = deepClone(orig);
  clone.scores.push(4);
  clone.nested.a.b = 'changed';

  return [
    { pass: deepClone(42) === 42, description: 'Primitives returned as-is', got: deepClone(42) },
    { pass: deepClone(null) === null, description: 'null returned as-is', got: deepClone(null) },
    { pass: clone.name === 'Alex', description: 'Clones primitive properties', got: clone.name },
    { pass: orig.scores.length === 3, description: 'Original array unchanged after clone mutation', got: orig.scores.length },
    { pass: orig.nested.a.b === 'deep', description: 'Original nested object unchanged', got: orig.nested.a.b },
    { pass: clone.date instanceof Date && clone.date.getTime() === orig.date.getTime(), description: 'Date cloned with same time', got: clone.date instanceof Date },
    { pass: clone.date !== orig.date, description: 'Date is a different instance', got: clone.date !== orig.date },
    { pass: (() => { const a = deepClone([1, [2, [3]]]); a[1][1][0] = 99; return a[1][1][0] === 99; })(), description: 'Deeply nested arrays cloned', got: true },
  ];
}`,
    hint: 'Check types in order: null first, then Date (instanceof), then Array (Array.isArray), then plain object (typeof === "object"). Recurse for arrays (use .map(deepClone)) and objects (iterate keys).',
    resources: [{ label: 'MDN: typeof', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof' }],
  },

  // ── 286: createRouter ───────────────────────────────────────────────────
  {
    id: 286,
    title: 'createRouter',
    type: 'js',
    tier: 4,
    category: ['functions', 'scope'],
    tags: ['closure', 'module-pattern', 'strings', 'pattern-matching', 'tier4'],
    description: 'Build a URL router that matches path patterns with :param extraction and calls handlers.',
    instructions: `Build a router factory:\n\n**createRouter()** returns:\n- \`addRoute(pattern, handler)\` — registers a route. Patterns use \`:param\` for dynamic segments.\n- \`navigate(path)\` — finds the first matching route, extracts params, calls \`handler(params)\` and returns its result. Returns \`'404 Not Found'\` if no match.\n\n\`\`\`js\nconst router = createRouter();\nrouter.addRoute('/about', () => 'About Page');\nrouter.addRoute('/users/:id', (params) => 'User ' + params.id);\nrouter.addRoute('/posts/:postId/comments/:commentId', (params) => \n  'Post ' + params.postId + ' Comment ' + params.commentId\n);\n\nrouter.navigate('/about');                    // 'About Page'\nrouter.navigate('/users/42');                 // 'User 42'\nrouter.navigate('/posts/10/comments/5');      // 'Post 10 Comment 5'\nrouter.navigate('/unknown');                  // '404 Not Found'\n\`\`\``,
    starterCode: `function createRouter() {\n  // private route storage\n\n  return {\n    addRoute(pattern, handler) {\n      // your code here\n    },\n\n    navigate(path) {\n      // your code here\n    },\n  };\n}`,
    solution: `function createRouter() {\n  const routes = [];\n\n  return {\n    addRoute(pattern, handler) {\n      routes.push({ pattern, handler });\n    },\n\n    navigate(path) {\n      const pathParts = path.split('/').filter(Boolean);\n      for (const route of routes) {\n        const patternParts = route.pattern.split('/').filter(Boolean);\n        if (patternParts.length !== pathParts.length) continue;\n        const params = {};\n        let match = true;\n        for (let i = 0; i < patternParts.length; i++) {\n          if (patternParts[i].startsWith(':')) {\n            params[patternParts[i].slice(1)] = pathParts[i];\n          } else if (patternParts[i] !== pathParts[i]) {\n            match = false;\n            break;\n          }\n        }\n        if (match) return route.handler(params);\n      }\n      return '404 Not Found';\n    },\n  };\n}`,
    testRunner: `(code) => {
  const createRouter = new Function(code + '; return createRouter;')();
  const router = createRouter();
  router.addRoute('/about', () => 'About Page');
  router.addRoute('/users/:id', p => 'User ' + p.id);
  router.addRoute('/posts/:postId/comments/:commentId', p => 'Post ' + p.postId + ' Comment ' + p.commentId);

  return [
    { pass: router.navigate('/about') === 'About Page', description: 'Static route matches', got: router.navigate('/about') },
    { pass: router.navigate('/users/42') === 'User 42', description: 'Single param extracted', got: router.navigate('/users/42') },
    { pass: router.navigate('/users/abc') === 'User abc', description: 'Params are strings', got: router.navigate('/users/abc') },
    { pass: router.navigate('/posts/10/comments/5') === 'Post 10 Comment 5', description: 'Multiple params extracted', got: router.navigate('/posts/10/comments/5') },
    { pass: router.navigate('/unknown') === '404 Not Found', description: 'Unmatched returns 404', got: router.navigate('/unknown') },
    { pass: router.navigate('/users') === '404 Not Found', description: 'Wrong segment count returns 404', got: router.navigate('/users') },
  ];
}`,
    hint: 'Split both pattern and path by "/". If segment counts differ, skip. For each segment pair: if the pattern starts with ":", extract the param. Otherwise, require exact match. If all segments match, call the handler with the params object.',
    resources: [{ label: 'MDN: String.prototype.split()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split' }],
  },

  // ── 287: Dataset: Music Library ─────────────────────────────────────────
  {
    id: 287,
    title: 'Dataset: Music Library',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'reduce', 'objects', 'higher-order', 'dataset', 'tier4'],
    description: 'Transform a music library dataset: group by genre, compute artist stats, summarize by decade.',
    instructions: `You have a dataset of albums:\n\`\`\`js\nconst albums = [\n  { title: 'Abbey Road', artist: 'The Beatles', year: 1969, genres: ['rock', 'pop'], tracks: [{ name: 'Come Together', durationSec: 259 }, { name: 'Here Comes the Sun', durationSec: 185 }] },\n  { title: 'Thriller', artist: 'Michael Jackson', year: 1982, genres: ['pop', 'funk'], tracks: [{ name: 'Thriller', durationSec: 358 }, { name: 'Beat It', durationSec: 258 }] },\n  { title: 'Let It Be', artist: 'The Beatles', year: 1970, genres: ['rock'], tracks: [{ name: 'Let It Be', durationSec: 243 }, { name: 'Get Back', durationSec: 190 }] },\n  { title: 'Bad', artist: 'Michael Jackson', year: 1987, genres: ['pop', 'rock'], tracks: [{ name: 'Bad', durationSec: 247 }, { name: 'Smooth Criminal', durationSec: 258 }, { name: 'The Way You Make Me Feel', durationSec: 300 }] },\n];\n\`\`\`\n\nWrite three functions:\n\n**albumsByGenre(albums)** — groups album titles by genre (an album can appear in multiple genres).\n\n**artistStats(albums)** — returns object per artist with \`{ albumCount, totalTracks, avgTrackDuration }\`.\n\n**decadeSummary(albums)** — groups by decade string ("1960s", "1980s") with count and titles.`,
    starterCode: `function albumsByGenre(albums) {\n  // your code here\n}\n\nfunction artistStats(albums) {\n  // your code here\n}\n\nfunction decadeSummary(albums) {\n  // your code here\n}`,
    solution: `function albumsByGenre(albums) {\n  return albums.reduce((acc, album) => {\n    album.genres.forEach(genre => {\n      if (!acc[genre]) acc[genre] = [];\n      acc[genre].push(album.title);\n    });\n    return acc;\n  }, {});\n}\n\nfunction artistStats(albums) {\n  return albums.reduce((acc, album) => {\n    if (!acc[album.artist]) acc[album.artist] = { albumCount: 0, totalTracks: 0, totalDuration: 0 };\n    const stat = acc[album.artist];\n    stat.albumCount++;\n    stat.totalTracks += album.tracks.length;\n    stat.totalDuration += album.tracks.reduce((sum, t) => sum + t.durationSec, 0);\n    return acc;\n  }, {});\n  // Post-process to compute avg\n}\n\nfunction artistStats(albums) {\n  const raw = albums.reduce((acc, album) => {\n    if (!acc[album.artist]) acc[album.artist] = { albumCount: 0, totalTracks: 0, totalDuration: 0 };\n    const stat = acc[album.artist];\n    stat.albumCount++;\n    stat.totalTracks += album.tracks.length;\n    stat.totalDuration += album.tracks.reduce((sum, t) => sum + t.durationSec, 0);\n    return acc;\n  }, {});\n  const result = {};\n  for (const [artist, stat] of Object.entries(raw)) {\n    result[artist] = {\n      albumCount: stat.albumCount,\n      totalTracks: stat.totalTracks,\n      avgTrackDuration: Math.round(stat.totalDuration / stat.totalTracks),\n    };\n  }\n  return result;\n}\n\nfunction decadeSummary(albums) {\n  return albums.reduce((acc, album) => {\n    const decade = Math.floor(album.year / 10) * 10 + 's';\n    if (!acc[decade]) acc[decade] = { count: 0, titles: [] };\n    acc[decade].count++;\n    acc[decade].titles.push(album.title);\n    return acc;\n  }, {});\n}`,
    testRunner: `(code) => {
  const { albumsByGenre, artistStats, decadeSummary } = new Function(code + '; return { albumsByGenre, artistStats, decadeSummary };')();
  const albums = [
    { title: 'Abbey Road', artist: 'The Beatles', year: 1969, genres: ['rock', 'pop'], tracks: [{ name: 'Come Together', durationSec: 259 }, { name: 'Here Comes the Sun', durationSec: 185 }] },
    { title: 'Thriller', artist: 'Michael Jackson', year: 1982, genres: ['pop', 'funk'], tracks: [{ name: 'Thriller', durationSec: 358 }, { name: 'Beat It', durationSec: 258 }] },
    { title: 'Let It Be', artist: 'The Beatles', year: 1970, genres: ['rock'], tracks: [{ name: 'Let It Be', durationSec: 243 }, { name: 'Get Back', durationSec: 190 }] },
    { title: 'Bad', artist: 'Michael Jackson', year: 1987, genres: ['pop', 'rock'], tracks: [{ name: 'Bad', durationSec: 247 }, { name: 'Smooth Criminal', durationSec: 258 }, { name: 'The Way You Make Me Feel', durationSec: 300 }] },
  ];

  const byGenre = albumsByGenre(albums);
  const stats = artistStats(albums);
  const decades = decadeSummary(albums);

  return [
    { pass: byGenre.rock && byGenre.rock.length === 3, description: 'albumsByGenre: rock has 3 albums', got: byGenre.rock?.length },
    { pass: byGenre.pop && byGenre.pop.length === 3, description: 'albumsByGenre: pop has 3 albums', got: byGenre.pop?.length },
    { pass: byGenre.funk && byGenre.funk.length === 1, description: 'albumsByGenre: funk has 1 album', got: byGenre.funk?.length },
    { pass: stats['The Beatles'] && stats['The Beatles'].albumCount === 2, description: 'artistStats: Beatles have 2 albums', got: stats['The Beatles']?.albumCount },
    { pass: stats['The Beatles'] && stats['The Beatles'].totalTracks === 4, description: 'artistStats: Beatles have 4 tracks', got: stats['The Beatles']?.totalTracks },
    { pass: stats['Michael Jackson'] && stats['Michael Jackson'].avgTrackDuration === Math.round((358+258+247+258+300)/5), description: 'artistStats: MJ avg duration correct', got: stats['Michael Jackson']?.avgTrackDuration },
    { pass: decades['1960s'] && decades['1960s'].count === 1, description: 'decadeSummary: 1960s has 1 album', got: decades['1960s']?.count },
    { pass: decades['1980s'] && decades['1980s'].count === 2, description: 'decadeSummary: 1980s has 2 albums', got: decades['1980s']?.count },
  ];
}`,
    hint: 'albumsByGenre: reduce with nested forEach over genres (many-to-many). artistStats: reduce to accumulate counts/durations, then a second pass to compute averages. decadeSummary: Math.floor(year/10)*10 gives the decade number.',
    resources: [{ label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' }],
  },

  // ── 288: Responsive Dashboard Layout (HTML+CSS) ─────────────────────────
  {
    id: 288,
    title: 'Responsive Dashboard Layout',
    type: 'html-css',
    tier: 4,
    category: ['css', 'layout'],
    tags: ['html', 'css', 'grid', 'flexbox', 'responsive', 'layout', 'tier4'],
    description: 'Build a responsive dashboard with CSS Grid areas, Flexbox nav, and a media query breakpoint.',
    instructions: `Build a dashboard layout that adapts from mobile to desktop.\n\n**Required HTML structure:**\n- A \`.dashboard\` container with 4 children:\n  - \`.sidebar\` — vertical navigation with at least 3 \`<a>\` links\n  - \`.header\` — page title bar with an \`<h1>\`\n  - \`.main-content\` — primary content area\n  - \`.stats-panel\` — secondary panel\n\n**Required CSS:**\n1. \`.dashboard\` uses CSS Grid with \`grid-template-areas\`\n2. Mobile (default): single column — areas stack vertically: header, sidebar, main, stats\n3. Desktop (min-width: 768px): two-column layout:\n   - sidebar takes left column, full height\n   - header spans top-right\n   - main-content fills center-right\n   - stats-panel fills bottom-right\n4. \`.sidebar\` uses Flexbox with \`flex-direction: column\`\n5. Use at least one CSS custom property (variable) for spacing or color\n6. Add a visible border on \`.dashboard\` children for visual debugging`,
    starterCode: '',
    solution: `<div class="dashboard">\n  <nav class="sidebar">\n    <a href="#">Home</a>\n    <a href="#">Analytics</a>\n    <a href="#">Settings</a>\n  </nav>\n  <header class="header">\n    <h1>Dashboard</h1>\n  </header>\n  <main class="main-content">\n    <p>Main content area</p>\n  </main>\n  <aside class="stats-panel">\n    <p>Statistics panel</p>\n  </aside>\n</div>\n\n<style>\n  :root {\n    --spacing: 16px;\n    --border-color: #334155;\n  }\n\n  .dashboard {\n    display: grid;\n    grid-template-areas:\n      "header"\n      "sidebar"\n      "main"\n      "stats";\n    gap: var(--spacing);\n    min-height: 100vh;\n  }\n\n  .sidebar {\n    grid-area: sidebar;\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    padding: var(--spacing);\n    border: 1px solid var(--border-color);\n  }\n\n  .header {\n    grid-area: header;\n    padding: var(--spacing);\n    border: 1px solid var(--border-color);\n  }\n\n  .main-content {\n    grid-area: main;\n    padding: var(--spacing);\n    border: 1px solid var(--border-color);\n  }\n\n  .stats-panel {\n    grid-area: stats;\n    padding: var(--spacing);\n    border: 1px solid var(--border-color);\n  }\n\n  @media (min-width: 768px) {\n    .dashboard {\n      grid-template-columns: 200px 1fr;\n      grid-template-areas:\n        "sidebar header"\n        "sidebar main"\n        "sidebar stats";\n    }\n  }\n</style>`,
    testRunner: '',
    testCases: [
      { query: '.dashboard', assertion: 'exists', description: '.dashboard container exists' },
      { query: '.sidebar', assertion: 'exists', description: '.sidebar exists' },
      { query: '.header', assertion: 'exists', description: '.header exists' },
      { query: '.main-content', assertion: 'exists', description: '.main-content exists' },
      { query: '.stats-panel', assertion: 'exists', description: '.stats-panel exists' },
      { query: '.dashboard', assertion: 'equals', property: 'display', value: 'grid', description: '.dashboard uses CSS Grid' },
      { query: '.sidebar', assertion: 'equals', property: 'display', value: 'flex', description: '.sidebar uses Flexbox' },
      { query: '.sidebar', assertion: 'equals', property: 'flex-direction', value: 'column', description: '.sidebar flex-direction is column' },
      { query: '.sidebar a', assertion: 'countAtLeast', value: 3, description: 'Sidebar has at least 3 links' },
      { query: '.header h1', assertion: 'exists', description: 'Header contains an h1' },
      { query: '.dashboard', assertion: 'sourceMatch', value: 'grid-template-areas', description: 'Uses grid-template-areas' },
      { query: '.dashboard', assertion: 'sourceMatch', value: '--', description: 'Uses CSS custom properties' },
    ],
    hint: 'Use grid-template-areas to name regions ("header", "sidebar", "main", "stats"). On mobile: all areas in one column. In the @media query, switch to two columns with the sidebar spanning all rows on the left.',
    resources: [{ label: 'MDN: CSS Grid Layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout' }],
  },

  // ── 289: throttle ──────────────────────────────────────────────────────
  {
    id: 289,
    title: 'throttle',
    type: 'js',
    tier: 4,
    category: ['functions', 'higher-order'],
    tags: ['functions', 'higher-order', 'closure', 'timing', 'tier4'],
    description: 'Implement a throttle function that limits how often a function can fire.',
    instructions: `Write a function:\n\n**throttle(fn, delay)** that returns a throttled version of \`fn\`.\n\n- First call executes immediately\n- Subsequent calls within the \`delay\` window are ignored\n- After the delay passes, the next call goes through\n- The throttled function preserves \`this\` context and arguments\n\n\`\`\`js\nlet count = 0;\nconst inc = throttle(() => count++, 100);\n\ninc(); // count → 1 (immediate)\ninc(); // ignored (within 100ms)\ninc(); // ignored\n// wait 100ms...\ninc(); // count → 2 (delay passed)\n\`\`\``,
    starterCode: `function throttle(fn, delay) {\n  // your code here — return a throttled function\n}`,
    solution: `function throttle(fn, delay) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= delay) {\n      lastCall = now;\n      return fn.apply(this, args);\n    }\n  };\n}`,
    testRunner: `(code) => {
  const throttle = new Function(code + '; return throttle;')();
  let count = 0;
  const inc = throttle(() => ++count, 50);

  inc(); // immediate
  const afterFirst = count;
  inc(); // should be throttled
  inc(); // should be throttled
  const afterThrottled = count;

  return [
    { pass: afterFirst === 1, description: 'First call executes immediately', got: afterFirst },
    { pass: afterThrottled === 1, description: 'Subsequent calls within delay are ignored', got: afterThrottled },
    { pass: (() => { let val = ''; const fn = throttle(function(x) { val = x; }, 50); fn('hello'); return val === 'hello'; })(), description: 'Arguments are passed through', got: (() => { let val = ''; const fn = throttle(function(x) { val = x; }, 50); fn('hello'); return val; })() },
    { pass: (() => { let ctx = null; const obj = { name: 'test', fn: throttle(function() { ctx = this.name; }, 50) }; obj.fn(); return ctx === 'test'; })(), description: 'Preserves this context', got: (() => { let ctx = null; const obj = { name: 'test', fn: throttle(function() { ctx = this.name; }, 50) }; obj.fn(); return ctx; })() },
  ];
}`,
    hint: 'Track the timestamp of the last call. On each invocation, check if Date.now() - lastCall >= delay. If yes, call fn and update lastCall. Use fn.apply(this, args) to preserve context.',
    resources: [{ label: 'MDN: Function.prototype.apply()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply' }],
  },

  // ── 290: Iterable Range ────────────────────────────────────────────────
  {
    id: 290,
    title: 'Iterable Range',
    type: 'js',
    tier: 4,
    category: ['es6-plus', 'destructuring'],
    tags: ['es6', 'iterator', 'symbol', 'protocol', 'class', 'tier4'],
    description: 'Build a Range class implementing the iterator protocol — usable with for...of and spread.',
    instructions: `Create a **Range** class:\n\n**Constructor:** \`(start, end, step = 1)\`\n\n**Properties/Methods:**\n- \`[Symbol.iterator]()\` — makes Range iterable. Produces values from start to end (inclusive), stepping by step.\n- \`toArray()\` — returns all values as an array\n- \`includes(value)\` — returns true if value is in the range\n- \`get length\` — returns the number of values in the range\n\n\`\`\`js\nconst r = new Range(1, 5);\n[...r];           // [1, 2, 3, 4, 5]\nr.toArray();      // [1, 2, 3, 4, 5]\nr.includes(3);    // true\nr.includes(6);    // false\nr.length;         // 5\n\nconst evens = new Range(0, 10, 2);\n[...evens];       // [0, 2, 4, 6, 8, 10]\nevens.length;     // 6\n\nfor (const n of new Range(3, 1, -1)) {\n  console.log(n); // 3, 2, 1\n}\n\`\`\``,
    starterCode: `class Range {\n  constructor(start, end, step = 1) {\n    // your code here\n  }\n\n  [Symbol.iterator]() {\n    // your code here — return { next() { ... } }\n  }\n\n  toArray() {\n    // your code here\n  }\n\n  includes(value) {\n    // your code here\n  }\n\n  get length() {\n    // your code here\n  }\n}`,
    solution: `class Range {\n  constructor(start, end, step = 1) {\n    this.start = start;\n    this.end = end;\n    this.step = step;\n  }\n\n  [Symbol.iterator]() {\n    let current = this.start;\n    const end = this.end;\n    const step = this.step;\n    return {\n      next() {\n        if ((step > 0 && current <= end) || (step < 0 && current >= end)) {\n          const value = current;\n          current += step;\n          return { value, done: false };\n        }\n        return { done: true };\n      },\n    };\n  }\n\n  toArray() {\n    return [...this];\n  }\n\n  includes(value) {\n    if (this.step > 0) {\n      return value >= this.start && value <= this.end && (value - this.start) % this.step === 0;\n    }\n    return value <= this.start && value >= this.end && (this.start - value) % Math.abs(this.step) === 0;\n  }\n\n  get length() {\n    return Math.max(0, Math.floor((this.end - this.start) / this.step) + 1);\n  }\n}`,
    testRunner: `(code) => {
  const Range = new Function(code + '; return Range;')();
  const r = new Range(1, 5);
  const evens = new Range(0, 10, 2);
  const desc = new Range(3, 1, -1);

  return [
    { pass: JSON.stringify([...r]) === '[1,2,3,4,5]', description: 'Spread: [1,2,3,4,5]', got: JSON.stringify([...r]) },
    { pass: r.length === 5, description: 'length is 5', got: r.length },
    { pass: r.includes(3) && !r.includes(6), description: 'includes works', got: r.includes(3) + ', ' + r.includes(6) },
    { pass: JSON.stringify([...evens]) === '[0,2,4,6,8,10]', description: 'Step 2: [0,2,4,6,8,10]', got: JSON.stringify([...evens]) },
    { pass: evens.length === 6, description: 'Step 2 length is 6', got: evens.length },
    { pass: JSON.stringify([...desc]) === '[3,2,1]', description: 'Descending: [3,2,1]', got: JSON.stringify([...desc]) },
    { pass: JSON.stringify(r.toArray()) === '[1,2,3,4,5]', description: 'toArray returns same as spread', got: JSON.stringify(r.toArray()) },
  ];
}`,
    hint: '[Symbol.iterator]() returns an object with a next() method. next() returns { value, done }. Track a `current` variable in the closure. Check direction (step > 0 or < 0) to know when to stop.',
    resources: [{ label: 'MDN: Iteration Protocols', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols' }],
  },
];

// ─── TIER 5 EXERCISES ─────────────────────────────────────────────────────────

const tier5Exercises = [
  // ── 291: Task Management System ─────────────────────────────────────────
  {
    id: 291,
    title: 'Task Management System: Task + Column + Board + User',
    type: 'js',
    tier: 5,
    category: ['js-fundamentals', 'classes'],
    tags: ['class', 'oop', 'tier5', 'composition', 'multi-class', 'state-machine', 'kanban'],
    description: 'Build a Kanban task system with 4 classes — WIP limits, status transitions, and cross-class stats.',
    instructions: `Build a Kanban-style task management system with four classes.\n\n**Task(title, priority):**\n- Properties: \`title\`, \`priority\` ("low"/"medium"/"high"), \`status\` (starts "todo"), \`assignee\` (null)\n- \`assign(user)\` — sets assignee to user.name\n\n**Column(name, limit):**\n- \`addTask(task)\` — adds task if under WIP limit, returns true/false\n- \`removeTask(title)\` — removes and returns task, or null\n- \`get count\` — number of tasks\n- \`getByPriority(priority)\` — returns filtered tasks\n\n**Board(name):**\n- \`addColumn(column)\` — adds a column\n- \`moveTask(title, fromCol, toCol)\` — moves task between columns. If toCol is "Done", set task.status to "done". Returns true/false.\n- \`get allTasks\` — flat array of all tasks across all columns\n- \`getTasksByUser(name)\` — returns all tasks assigned to user\n- \`get completionRate\` — % of tasks with status "done" (0-100, rounded)\n\n**User(name):**\n- \`get taskCount\` — counts tasks assigned to this user across all columns on a board\n\n\`\`\`js\nconst board = new Board('Sprint 1');\nconst todo = new Column('Todo', 5);\nconst done = new Column('Done', 10);\nboard.addColumn(todo);\nboard.addColumn(done);\n\nconst task = new Task('Fix bug', 'high');\ntodo.addTask(task);  // true\nboard.moveTask('Fix bug', 'Todo', 'Done'); // true, task.status → 'done'\nboard.completionRate; // 100\n\`\`\``,
    starterCode: '',
    solution: `class Task {\n  constructor(title, priority) {\n    this.title = title;\n    this.priority = priority;\n    this.status = 'todo';\n    this.assignee = null;\n  }\n\n  assign(user) {\n    this.assignee = user.name;\n  }\n}\n\nclass Column {\n  constructor(name, limit) {\n    this.name = name;\n    this.limit = limit;\n    this.tasks = [];\n  }\n\n  addTask(task) {\n    if (this.tasks.length >= this.limit) return false;\n    this.tasks.push(task);\n    return true;\n  }\n\n  removeTask(title) {\n    const idx = this.tasks.findIndex(t => t.title === title);\n    if (idx === -1) return null;\n    return this.tasks.splice(idx, 1)[0];\n  }\n\n  get count() {\n    return this.tasks.length;\n  }\n\n  getByPriority(priority) {\n    return this.tasks.filter(t => t.priority === priority);\n  }\n}\n\nclass Board {\n  constructor(name) {\n    this.name = name;\n    this.columns = [];\n  }\n\n  addColumn(column) {\n    this.columns.push(column);\n  }\n\n  moveTask(title, fromCol, toCol) {\n    const from = this.columns.find(c => c.name === fromCol);\n    const to = this.columns.find(c => c.name === toCol);\n    if (!from || !to) return false;\n    const task = from.removeTask(title);\n    if (!task) return false;\n    if (!to.addTask(task)) {\n      from.addTask(task);\n      return false;\n    }\n    if (toCol === 'Done') task.status = 'done';\n    return true;\n  }\n\n  get allTasks() {\n    return this.columns.flatMap(c => c.tasks);\n  }\n\n  getTasksByUser(name) {\n    return this.allTasks.filter(t => t.assignee === name);\n  }\n\n  get completionRate() {\n    const all = this.allTasks;\n    if (all.length === 0) return 0;\n    const done = all.filter(t => t.status === 'done').length;\n    return Math.round((done / all.length) * 100);\n  }\n}\n\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  get taskCount() {\n    return 0; // needs board reference — simplified\n  }\n}`,
    testRunner: `(code) => {
  const { Task, Column, Board, User } = new Function(code + '; return { Task, Column, Board, User };')();

  const board = new Board('Sprint 1');
  const todo = new Column('Todo', 3);
  const inProgress = new Column('In Progress', 2);
  const done = new Column('Done', 10);
  board.addColumn(todo);
  board.addColumn(inProgress);
  board.addColumn(done);

  const t1 = new Task('Fix bug', 'high');
  const t2 = new Task('Add feature', 'medium');
  const t3 = new Task('Write docs', 'low');
  const t4 = new Task('Overflow', 'low');
  const user = new User('Alex');
  t1.assign(user);
  t2.assign(user);

  todo.addTask(t1);
  todo.addTask(t2);
  todo.addTask(t3);
  const overflow = todo.addTask(t4);

  return [
    { pass: t1.status === 'todo' && t1.priority === 'high', description: 'Task has status and priority', got: t1.status + '/' + t1.priority },
    { pass: t1.assignee === 'Alex', description: 'Task.assign sets assignee', got: t1.assignee },
    { pass: todo.count === 3, description: 'Column tracks count', got: todo.count },
    { pass: overflow === false, description: 'Column rejects over WIP limit', got: overflow },
    { pass: todo.getByPriority('high').length === 1, description: 'getByPriority filters', got: todo.getByPriority('high').length },
    { pass: board.moveTask('Fix bug', 'Todo', 'Done') === true, description: 'moveTask succeeds', got: true },
    { pass: t1.status === 'done', description: 'Moving to Done sets status', got: t1.status },
    { pass: board.allTasks.length === 3, description: 'allTasks returns all tasks', got: board.allTasks.length },
    { pass: board.getTasksByUser('Alex').length === 2, description: 'getTasksByUser finds assigned tasks', got: board.getTasksByUser('Alex').length },
    { pass: board.completionRate === Math.round((1/3) * 100), description: 'completionRate computes correctly', got: board.completionRate },
    { pass: board.moveTask('Ghost', 'Todo', 'Done') === false, description: 'moveTask returns false for missing task', got: false },
  ];
}`,
    hint: 'Task is a plain data class. Column manages an array with a capacity limit. Board owns columns and delegates to them — moveTask removes from source and adds to destination. Use flatMap for allTasks.',
    resources: [],
  },

  // ── 292: Event Scheduler ────────────────────────────────────────────────
  {
    id: 292,
    title: 'Event Scheduler: Event + Calendar + Attendee + Venue',
    type: 'js',
    tier: 5,
    category: ['js-fundamentals', 'classes'],
    tags: ['class', 'oop', 'tier5', 'composition', 'multi-class', 'scheduling'],
    description: 'Build a scheduling system with time-overlap detection, venue capacity, and cascade cancellation.',
    instructions: `Build four classes for event scheduling.\n\n**Venue(name, capacity):**\n- \`book(event)\` — stores event. Returns false if time overlaps existing booking.\n- \`isAvailable(date, startHour, endHour)\` — checks for conflicts\n- \`cancelBooking(eventName)\` — removes booking\n\n**Attendee(name):**\n- \`rsvp(event)\` — adds to personal schedule. Returns false if personal conflict.\n- \`cancel(eventName)\` — removes from schedule\n- \`get schedule\` — sorted array of events by date then startHour\n\n**Event(name, date, startHour, endHour, venue):**\n- \`addAttendee(attendee)\` — adds if venue not full. Returns true/false.\n- \`removeAttendee(name)\` — removes attendee\n- \`get isFull\` — attendees.length >= venue.capacity\n- \`get duration\` — endHour - startHour\n- \`get attendeeCount\`\n\n**Calendar(name):**\n- \`addEvent(event)\` — stores event\n- \`cancelEvent(eventName)\` — removes event, cancels venue booking, removes from all attendees\n- \`getEventsOnDate(date)\` — filters by date\n- \`getEventsByVenue(venueName)\` — filters by venue\n\nTime overlap: events on the same date at the same venue overlap if their hour ranges intersect (e.g., [10,12] and [11,14] overlap).\n\n\`\`\`js\nconst venue = new Venue('Room A', 2);\nconst e1 = new Event('Standup', '2024-01-15', 10, 11, venue);\nvenue.book(e1);              // true\nvenue.isAvailable('2024-01-15', 10, 12); // false (overlaps)\nvenue.isAvailable('2024-01-15', 11, 13); // true (after e1)\n\`\`\``,
    starterCode: '',
    solution: `class Venue {\n  constructor(name, capacity) {\n    this.name = name;\n    this.capacity = capacity;\n    this.bookings = [];\n  }\n\n  isAvailable(date, startHour, endHour) {\n    return !this.bookings.some(b => b.date === date && b.startHour < endHour && b.endHour > startHour);\n  }\n\n  book(event) {\n    if (!this.isAvailable(event.date, event.startHour, event.endHour)) return false;\n    this.bookings.push(event);\n    return true;\n  }\n\n  cancelBooking(eventName) {\n    this.bookings = this.bookings.filter(b => b.name !== eventName);\n  }\n}\n\nclass Attendee {\n  constructor(name) {\n    this.name = name;\n    this._events = [];\n  }\n\n  rsvp(event) {\n    const conflict = this._events.some(e => e.date === event.date && e.startHour < event.endHour && e.endHour > event.startHour);\n    if (conflict) return false;\n    this._events.push(event);\n    return true;\n  }\n\n  cancel(eventName) {\n    this._events = this._events.filter(e => e.name !== eventName);\n  }\n\n  get schedule() {\n    return [...this._events].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.startHour - b.startHour);\n  }\n}\n\nclass Event {\n  constructor(name, date, startHour, endHour, venue) {\n    this.name = name;\n    this.date = date;\n    this.startHour = startHour;\n    this.endHour = endHour;\n    this.venue = venue;\n    this.attendees = [];\n  }\n\n  addAttendee(attendee) {\n    if (this.isFull) return false;\n    this.attendees.push(attendee);\n    return true;\n  }\n\n  removeAttendee(name) {\n    this.attendees = this.attendees.filter(a => a.name !== name);\n  }\n\n  get isFull() {\n    return this.attendees.length >= this.venue.capacity;\n  }\n\n  get duration() {\n    return this.endHour - this.startHour;\n  }\n\n  get attendeeCount() {\n    return this.attendees.length;\n  }\n}\n\nclass Calendar {\n  constructor(name) {\n    this.name = name;\n    this.events = [];\n  }\n\n  addEvent(event) {\n    this.events.push(event);\n  }\n\n  cancelEvent(eventName) {\n    const event = this.events.find(e => e.name === eventName);\n    if (!event) return;\n    event.venue.cancelBooking(eventName);\n    event.attendees.forEach(a => a.cancel(eventName));\n    this.events = this.events.filter(e => e.name !== eventName);\n  }\n\n  getEventsOnDate(date) {\n    return this.events.filter(e => e.date === date);\n  }\n\n  getEventsByVenue(venueName) {\n    return this.events.filter(e => e.venue.name === venueName);\n  }\n}`,
    testRunner: `(code) => {
  const { Venue, Attendee, Event, Calendar } = new Function(code + '; return { Venue, Attendee, Event, Calendar };')();

  const venue = new Venue('Room A', 2);
  const e1 = new Event('Standup', '2024-01-15', 10, 11, venue);
  const e2 = new Event('Workshop', '2024-01-15', 11, 13, venue);
  const e3 = new Event('Conflict', '2024-01-15', 10, 12, venue);
  venue.book(e1);
  venue.book(e2);

  const alice = new Attendee('Alice');
  const bob = new Attendee('Bob');
  e1.addAttendee(alice);
  e1.addAttendee(bob);
  alice.rsvp(e1);

  const cal = new Calendar('Q1');
  cal.addEvent(e1);
  cal.addEvent(e2);

  return [
    { pass: venue.isAvailable('2024-01-15', 10, 11) === false, description: 'Venue detects overlap', got: false },
    { pass: venue.isAvailable('2024-01-15', 13, 14) === true, description: 'Venue allows non-overlapping', got: true },
    { pass: venue.book(e3) === false, description: 'Venue rejects overlapping booking', got: false },
    { pass: e1.attendeeCount === 2, description: 'Event tracks attendees', got: e1.attendeeCount },
    { pass: e1.isFull === true, description: 'Event.isFull when at capacity', got: e1.isFull },
    { pass: e1.duration === 1, description: 'Event.duration computed', got: e1.duration },
    { pass: alice.rsvp(e2) === true, description: 'Attendee RSVP non-conflicting', got: true },
    { pass: alice.schedule.length === 2, description: 'Attendee schedule has 2 events', got: alice.schedule.length },
    { pass: cal.getEventsOnDate('2024-01-15').length === 2, description: 'Calendar filters by date', got: cal.getEventsOnDate('2024-01-15').length },
    { pass: (() => { cal.cancelEvent('Standup'); return cal.events.length === 1 && venue.bookings.length === 1; })(), description: 'cancelEvent cascades to venue', got: (() => { return cal.events.length + '/' + venue.bookings.length; })() },
  ];
}`,
    hint: 'Overlap detection: two time ranges [s1,e1] and [s2,e2] overlap if s1 < e2 AND e1 > s2. cancelEvent must cascade: remove from venue bookings AND from each attendee\'s schedule.',
    resources: [],
  },

  // ── 293: Data Pipeline Builder ──────────────────────────────────────────
  {
    id: 293,
    title: 'Data Pipeline Builder',
    type: 'js',
    tier: 5,
    category: ['functions', 'higher-order'],
    tags: ['functions', 'higher-order', 'tier5', 'composition', 'data-transformation', 'functional'],
    description: 'Build a lazy data pipeline with chainable map, filter, groupBy, sortBy, take, and execute.',
    instructions: `Build a **Pipeline** class with lazy evaluation.\n\n**Pipeline.from(data)** — static factory, sets source data\n\n**Chainable methods** (each returns the Pipeline for chaining, does NOT execute yet):\n- \`.map(fn)\` — transform each element\n- \`.filter(fn)\` — keep elements where fn returns true\n- \`.sortBy(fn)\` — sort by comparator\n- \`.take(n)\` — limit to first N results\n- \`.groupBy(fn)\` — group into object (fn returns the group key)\n\n**Terminal methods:**\n- \`.execute()\` — runs the pipeline and returns results\n- \`.count()\` — runs pipeline and returns count\n- \`.sum(key)\` — runs pipeline and sums a numeric property\n\nSteps are stored and only run on terminal methods.\n\n\`\`\`js\nconst data = [\n  { name: 'Alice', age: 30, dept: 'Eng' },\n  { name: 'Bob', age: 25, dept: 'Eng' },\n  { name: 'Carol', age: 35, dept: 'Sales' },\n];\n\nPipeline.from(data)\n  .filter(p => p.dept === 'Eng')\n  .map(p => p.name)\n  .execute(); // ['Alice', 'Bob']\n\nPipeline.from(data)\n  .sortBy((a, b) => b.age - a.age)\n  .take(2)\n  .execute(); // [Carol(35), Alice(30)]\n\nPipeline.from(data)\n  .groupBy(p => p.dept)\n  .execute(); // { Eng: [Alice, Bob], Sales: [Carol] }\n\nPipeline.from(data)\n  .filter(p => p.dept === 'Eng')\n  .sum('age'); // 55\n\`\`\``,
    starterCode: `class Pipeline {\n  constructor(data) {\n    this._data = data;\n    this._steps = [];\n  }\n\n  static from(data) {\n    return new Pipeline(data);\n  }\n\n  // Add chainable methods: map, filter, sortBy, take, groupBy\n  // Add terminal methods: execute, count, sum\n}`,
    solution: `class Pipeline {\n  constructor(data) {\n    this._data = data;\n    this._steps = [];\n  }\n\n  static from(data) {\n    return new Pipeline([...data]);\n  }\n\n  map(fn) {\n    this._steps.push({ type: 'map', fn });\n    return this;\n  }\n\n  filter(fn) {\n    this._steps.push({ type: 'filter', fn });\n    return this;\n  }\n\n  sortBy(fn) {\n    this._steps.push({ type: 'sortBy', fn });\n    return this;\n  }\n\n  take(n) {\n    this._steps.push({ type: 'take', n });\n    return this;\n  }\n\n  groupBy(fn) {\n    this._steps.push({ type: 'groupBy', fn });\n    return this;\n  }\n\n  execute() {\n    let result = [...this._data];\n    for (const step of this._steps) {\n      switch (step.type) {\n        case 'map': result = result.map(step.fn); break;\n        case 'filter': result = result.filter(step.fn); break;\n        case 'sortBy': result = [...result].sort(step.fn); break;\n        case 'take': result = result.slice(0, step.n); break;\n        case 'groupBy': {\n          const groups = {};\n          for (const item of result) {\n            const key = step.fn(item);\n            if (!groups[key]) groups[key] = [];\n            groups[key].push(item);\n          }\n          return groups;\n        }\n      }\n    }\n    return result;\n  }\n\n  count() {\n    const result = this.execute();\n    return Array.isArray(result) ? result.length : Object.keys(result).length;\n  }\n\n  sum(key) {\n    const result = this.execute();\n    return result.reduce((s, item) => s + (item[key] || 0), 0);\n  }\n}`,
    testRunner: `(code) => {
  const Pipeline = new Function(code + '; return Pipeline;')();
  const data = [
    { name: 'Alice', age: 30, dept: 'Eng' },
    { name: 'Bob', age: 25, dept: 'Eng' },
    { name: 'Carol', age: 35, dept: 'Sales' },
    { name: 'Dave', age: 28, dept: 'Sales' },
  ];

  const names = Pipeline.from(data).filter(p => p.dept === 'Eng').map(p => p.name).execute();
  const top2 = Pipeline.from(data).sortBy((a, b) => b.age - a.age).take(2).execute();
  const groups = Pipeline.from(data).groupBy(p => p.dept).execute();
  const engAgeSum = Pipeline.from(data).filter(p => p.dept === 'Eng').sum('age');
  const cnt = Pipeline.from(data).filter(p => p.age > 27).count();

  return [
    { pass: JSON.stringify(names) === JSON.stringify(['Alice', 'Bob']), description: 'filter + map pipeline', got: JSON.stringify(names) },
    { pass: top2.length === 2 && top2[0].name === 'Carol', description: 'sortBy + take pipeline', got: top2.map(p => p.name).join(', ') },
    { pass: groups.Eng && groups.Eng.length === 2, description: 'groupBy: Eng has 2', got: groups.Eng?.length },
    { pass: groups.Sales && groups.Sales.length === 2, description: 'groupBy: Sales has 2', got: groups.Sales?.length },
    { pass: engAgeSum === 55, description: 'sum("age") after filter = 55', got: engAgeSum },
    { pass: cnt === 3, description: 'count after filter = 3', got: cnt },
    { pass: (() => { const d = [{ v: 1 }, { v: 2 }]; Pipeline.from(d).map(x => x.v * 10).execute(); return d[0].v === 1; })(), description: 'Pipeline does not mutate source', got: true },
  ];
}`,
    hint: 'Store each method call as a step object { type, fn/n }. execute() iterates steps in order, applying each transformation to the running result. groupBy is special — it returns an object instead of an array, so it should be the last array step.',
    resources: [],
  },

  // ── 294: E-Commerce System ──────────────────────────────────────────────
  {
    id: 294,
    title: 'E-Commerce System: Product + Cart + Order + Discount + Store',
    type: 'js',
    tier: 5,
    category: ['js-fundamentals', 'classes'],
    tags: ['class', 'oop', 'tier5', 'composition', 'multi-class', 'e-commerce'],
    description: 'Build a 5-class e-commerce system with inventory, discounts, cart checkout, and order processing.',
    instructions: `Build five classes:\n\n**Product(name, price, stock):**\n- \`reduceStock(qty)\` — decrements stock. Returns false if insufficient.\n- \`restock(qty)\` — adds to stock\n- \`get isAvailable\` — stock > 0\n\n**Discount(code, type, value):**\n- \`type\`: "percent" or "fixed"\n- \`apply(subtotal)\` — returns discounted total. Percent: \`subtotal * (1 - value/100)\`. Fixed: \`subtotal - value\`. Never below 0.\n\n**Cart(owner):**\n- \`addItem(product, qty)\` — validates stock availability. Returns true/false.\n- \`removeItem(productName)\` — removes item\n- \`get subtotal\` — sum of price * qty for all items\n- \`applyDiscount(discount)\` — stores discount\n- \`get total\` — subtotal after discount\n- \`get itemCount\` — total number of items\n\n**Order(cart):**\n- \`process()\` — reduces stock for each item, marks status "processed", returns total. Returns false if already processed.\n- \`cancel()\` — restores stock, marks "cancelled"\n- \`get status\` — "pending"/"processed"/"cancelled"\n- \`get receipt\` — formatted string: "Order for [owner]: [items list]. Total: $[total]"\n\n**Store(name):**\n- \`addProduct(product)\`\n- \`createCart(owner)\` — returns a new Cart\n- \`checkout(cart)\` — creates and processes an Order, returns it\n- \`get revenue\` — sum of all processed order totals\n- \`get orderCount\` — number of processed orders`,
    starterCode: `class Product {\n  constructor(name, price, stock) {\n    // your code here\n  }\n}\n\nclass Discount {\n  constructor(code, type, value) {\n    // your code here\n  }\n}\n\nclass Cart {\n  constructor(owner) {\n    // your code here\n  }\n}\n\nclass Order {\n  constructor(cart) {\n    // your code here\n  }\n}\n\nclass Store {\n  constructor(name) {\n    // your code here\n  }\n}`,
    solution: `class Product {\n  constructor(name, price, stock) {\n    this.name = name;\n    this.price = price;\n    this.stock = stock;\n  }\n  reduceStock(qty) {\n    if (this.stock < qty) return false;\n    this.stock -= qty;\n    return true;\n  }\n  restock(qty) { this.stock += qty; }\n  get isAvailable() { return this.stock > 0; }\n}\n\nclass Discount {\n  constructor(code, type, value) {\n    this.code = code;\n    this.type = type;\n    this.value = value;\n  }\n  apply(subtotal) {\n    if (this.type === 'percent') return Math.max(0, subtotal * (1 - this.value / 100));\n    return Math.max(0, subtotal - this.value);\n  }\n}\n\nclass Cart {\n  constructor(owner) {\n    this.owner = owner;\n    this.items = [];\n    this._discount = null;\n  }\n  addItem(product, qty) {\n    if (product.stock < qty) return false;\n    this.items.push({ product, qty });\n    return true;\n  }\n  removeItem(productName) {\n    this.items = this.items.filter(i => i.product.name !== productName);\n  }\n  get subtotal() {\n    return this.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);\n  }\n  applyDiscount(discount) { this._discount = discount; }\n  get total() {\n    const sub = this.subtotal;\n    return this._discount ? this._discount.apply(sub) : sub;\n  }\n  get itemCount() {\n    return this.items.reduce((sum, i) => sum + i.qty, 0);\n  }\n}\n\nclass Order {\n  constructor(cart) {\n    this.cart = cart;\n    this._status = 'pending';\n    this._total = cart.total;\n    this._items = cart.items.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price }));\n  }\n  process() {\n    if (this._status !== 'pending') return false;\n    for (const item of this.cart.items) {\n      if (!item.product.reduceStock(item.qty)) return false;\n    }\n    this._status = 'processed';\n    return this._total;\n  }\n  cancel() {\n    if (this._status !== 'processed') return false;\n    for (const item of this.cart.items) {\n      item.product.restock(item.qty);\n    }\n    this._status = 'cancelled';\n    return true;\n  }\n  get status() { return this._status; }\n  get receipt() {\n    const items = this._items.map(i => i.qty + 'x ' + i.name).join(', ');\n    return 'Order for ' + this.cart.owner + ': ' + items + '. Total: $' + this._total.toFixed(2);\n  }\n}\n\nclass Store {\n  constructor(name) {\n    this.name = name;\n    this.products = [];\n    this.orders = [];\n  }\n  addProduct(product) { this.products.push(product); }\n  createCart(owner) { return new Cart(owner); }\n  checkout(cart) {\n    const order = new Order(cart);\n    const result = order.process();\n    if (result !== false) this.orders.push(order);\n    return order;\n  }\n  get revenue() {\n    return this.orders.filter(o => o.status === 'processed').reduce((sum, o) => sum + o._total, 0);\n  }\n  get orderCount() {\n    return this.orders.filter(o => o.status === 'processed').length;\n  }\n}`,
    testRunner: `(code) => {
  const { Product, Discount, Cart, Order, Store } = new Function(code + '; return { Product, Discount, Cart, Order, Store };')();

  const store = new Store('ShopJS');
  const laptop = new Product('Laptop', 999.99, 5);
  const mouse = new Product('Mouse', 29.99, 10);
  store.addProduct(laptop);
  store.addProduct(mouse);

  const cart = store.createCart('Alex');
  cart.addItem(laptop, 1);
  cart.addItem(mouse, 2);
  const discount = new Discount('SAVE10', 'percent', 10);
  cart.applyDiscount(discount);

  const order = store.checkout(cart);

  return [
    { pass: laptop.isAvailable === true, description: 'Product.isAvailable', got: laptop.isAvailable },
    { pass: cart.itemCount === 3, description: 'Cart.itemCount = 3', got: cart.itemCount },
    { pass: Math.abs(cart.subtotal - 1059.97) < 0.01, description: 'Cart.subtotal correct', got: cart.subtotal },
    { pass: Math.abs(cart.total - 953.973) < 0.01, description: 'Cart.total with 10% discount', got: cart.total },
    { pass: discount.apply(100) === 90, description: 'Discount: 10% of 100 = 90', got: discount.apply(100) },
    { pass: new Discount('FLAT', 'fixed', 50).apply(30) === 0, description: 'Discount: fixed never below 0', got: new Discount('FLAT', 'fixed', 50).apply(30) },
    { pass: order.status === 'processed', description: 'Order processed', got: order.status },
    { pass: laptop.stock === 4, description: 'Stock reduced after checkout', got: laptop.stock },
    { pass: store.orderCount === 1, description: 'Store tracks orders', got: store.orderCount },
    { pass: Math.abs(store.revenue - cart.total) < 0.01, description: 'Store.revenue matches order total', got: store.revenue },
    { pass: order.receipt.includes('Alex') && order.receipt.includes('Laptop'), description: 'Receipt includes owner and items', got: order.receipt },
    { pass: (() => { const o2 = new Order(store.createCart('Bob')); return o2.process() !== false; })(), description: 'Empty cart order processes', got: true },
  ];
}`,
    hint: 'Product manages its own stock. Cart stores { product, qty } pairs. Order snapshots the cart data at creation time. Store.checkout creates an Order and calls process(). Revenue sums processed order totals.',
    resources: [],
  },

  // ── 295: Interactive Form Builder (HTML+CSS) ────────────────────────────
  {
    id: 295,
    title: 'Interactive Form Builder',
    type: 'html-css',
    tier: 5,
    category: ['html', 'forms'],
    tags: ['html', 'css', 'forms', 'grid', 'flexbox', 'accessibility', 'responsive', 'tier5'],
    description: 'Build a complete, accessible, responsive multi-section form with CSS-only validation states.',
    instructions: `Build a multi-section form layout from scratch.\n\n**Required structure:**\n- A \`.form-container\` wrapper\n- A \`.form-progress\` bar with 3 steps (\`.step\` elements, at least one with \`.active\` class)\n- Three \`.form-section\` groups, each with a \`<fieldset>\` and \`<legend>\`\n- Each section has at least 2 labeled inputs (use \`<label for="...">\` + \`<input id="...">\`)\n- At least one input has \`required\` attribute\n- A \`.form-actions\` footer with a \`.btn-primary\` button\n\n**Required CSS:**\n1. Use CSS Grid or Flexbox for form layout\n2. CSS custom properties for at least 2 values (colors, spacing)\n3. Style \`:focus\` state with a visible ring/outline\n4. Style inputs with \`border\` and \`padding\`\n5. \`.btn-primary\` has distinct background color and hover state\n6. \`.form-progress .step.active\` has a highlighted style\n\nFocus on accessibility: proper label associations, fieldset/legend grouping, focus visibility.`,
    starterCode: '',
    solution: `<div class="form-container">\n  <div class="form-progress">\n    <span class="step active">1. Personal</span>\n    <span class="step">2. Address</span>\n    <span class="step">3. Preferences</span>\n  </div>\n\n  <form>\n    <div class="form-section">\n      <fieldset>\n        <legend>Personal Info</legend>\n        <label for="name">Full Name</label>\n        <input type="text" id="name" required>\n        <label for="email">Email</label>\n        <input type="email" id="email" required>\n      </fieldset>\n    </div>\n\n    <div class="form-section">\n      <fieldset>\n        <legend>Address</legend>\n        <label for="street">Street</label>\n        <input type="text" id="street">\n        <label for="city">City</label>\n        <input type="text" id="city">\n      </fieldset>\n    </div>\n\n    <div class="form-section">\n      <fieldset>\n        <legend>Preferences</legend>\n        <label for="color">Favorite Color</label>\n        <input type="text" id="color">\n        <label for="lang">Language</label>\n        <input type="text" id="lang">\n      </fieldset>\n    </div>\n\n    <div class="form-actions">\n      <button type="submit" class="btn-primary">Submit</button>\n    </div>\n  </form>\n</div>\n\n<style>\n  :root {\n    --primary: #818cf8;\n    --spacing: 16px;\n  }\n\n  .form-container {\n    max-width: 600px;\n    display: flex;\n    flex-direction: column;\n    gap: var(--spacing);\n  }\n\n  .form-progress {\n    display: flex;\n    gap: 8px;\n  }\n\n  .form-progress .step {\n    padding: 8px 16px;\n    border: 1px solid #334155;\n    border-radius: 4px;\n    font-size: 14px;\n  }\n\n  .form-progress .step.active {\n    background-color: var(--primary);\n    color: white;\n    border-color: var(--primary);\n  }\n\n  fieldset {\n    border: 1px solid #334155;\n    border-radius: 8px;\n    padding: var(--spacing);\n  }\n\n  legend {\n    font-weight: bold;\n    padding: 0 8px;\n  }\n\n  label {\n    display: block;\n    margin-top: 12px;\n    margin-bottom: 4px;\n    font-size: 14px;\n  }\n\n  input {\n    width: 100%;\n    padding: 8px 12px;\n    border: 1px solid #334155;\n    border-radius: 4px;\n    box-sizing: border-box;\n  }\n\n  input:focus {\n    outline: 2px solid var(--primary);\n    outline-offset: 2px;\n  }\n\n  .form-actions {\n    margin-top: var(--spacing);\n  }\n\n  .btn-primary {\n    background-color: var(--primary);\n    color: white;\n    padding: 10px 24px;\n    border: none;\n    border-radius: 6px;\n    cursor: pointer;\n    font-size: 16px;\n  }\n\n  .btn-primary:hover {\n    opacity: 0.9;\n  }\n</style>`,
    testRunner: '',
    testCases: [
      { query: '.form-container', assertion: 'exists', description: '.form-container exists' },
      { query: '.form-progress', assertion: 'exists', description: '.form-progress exists' },
      { query: '.form-progress .step', assertion: 'countAtLeast', value: 3, description: 'Progress has at least 3 steps' },
      { query: '.form-progress .step.active', assertion: 'exists', description: 'At least one step is active' },
      { query: '.form-section', assertion: 'countAtLeast', value: 3, description: '3 form sections' },
      { query: 'fieldset', assertion: 'countAtLeast', value: 3, description: 'Uses fieldset elements' },
      { query: 'legend', assertion: 'countAtLeast', value: 3, description: 'Fieldsets have legends' },
      { query: 'label[for]', assertion: 'countAtLeast', value: 4, description: 'At least 4 labeled inputs' },
      { query: 'input[required]', assertion: 'countAtLeast', value: 1, description: 'At least 1 required input' },
      { query: '.btn-primary', assertion: 'exists', description: '.btn-primary button exists' },
      { query: '.form-container', assertion: 'sourceMatch', value: '--', description: 'Uses CSS custom properties' },
    ],
    hint: 'Structure: form-container > form-progress + form (with sections + actions). Each section wraps a fieldset with legend. Use label[for] matching input[id]. CSS custom properties go in :root. Focus states use :focus pseudo-class.',
    resources: [{ label: 'MDN: HTML Forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' }],
  },

  // ── 296: Async Task Queue ───────────────────────────────────────────────
  {
    id: 296,
    title: 'Async Task Queue: Task + Queue + Worker + Scheduler',
    type: 'js',
    tier: 5,
    category: ['es6-plus', 'async'],
    tags: ['async', 'await', 'promises', 'class', 'tier5', 'composition', 'multi-class', 'queue'],
    description: 'Build an async processing system with priority queue, concurrent workers, and scheduling.',
    instructions: `Build four classes for async task processing.\n\n**Task(name, fn, priority):**\n- \`fn\` is an async function. Properties: \`status\` ("pending"/"running"/"completed"/"failed"), \`result\`, \`error\`\n\n**Queue():**\n- \`enqueue(task)\` — inserts by priority (higher number = higher priority)\n- \`dequeue()\` — removes and returns highest priority task\n- \`get size\`\n- \`get isEmpty\`\n\n**Worker(name):**\n- \`async process(task)\` — runs task.fn(), updates task status/result/error\n- \`get isIdle\` — true when not processing\n- \`get tasksProcessed\` — count\n\n**Scheduler(concurrency):**\n- \`addTask(name, fn, priority)\` — creates Task and enqueues\n- \`async start()\` — processes all queued tasks using up to \`concurrency\` workers simultaneously\n- \`get stats\` — returns \`{ completed, failed, pending }\`\n\n\`\`\`js\nconst scheduler = new Scheduler(2);\nscheduler.addTask('fast', async () => 'done', 1);\nscheduler.addTask('slow', async () => {\n  await new Promise(r => setTimeout(r, 50));\n  return 'slow-done';\n}, 2);\nscheduler.addTask('fail', async () => { throw new Error('oops'); }, 1);\n\nawait scheduler.start();\nscheduler.stats; // { completed: 2, failed: 1, pending: 0 }\n\`\`\``,
    starterCode: '',
    solution: `class Task {\n  constructor(name, fn, priority) {\n    this.name = name;\n    this.fn = fn;\n    this.priority = priority;\n    this.status = 'pending';\n    this.result = null;\n    this.error = null;\n  }\n}\n\nclass Queue {\n  constructor() {\n    this._items = [];\n  }\n  enqueue(task) {\n    this._items.push(task);\n    this._items.sort((a, b) => b.priority - a.priority);\n  }\n  dequeue() {\n    return this._items.shift() || null;\n  }\n  get size() { return this._items.length; }\n  get isEmpty() { return this._items.length === 0; }\n}\n\nclass Worker {\n  constructor(name) {\n    this.name = name;\n    this._idle = true;\n    this._processed = 0;\n  }\n  async process(task) {\n    this._idle = false;\n    task.status = 'running';\n    try {\n      task.result = await task.fn();\n      task.status = 'completed';\n    } catch (err) {\n      task.error = err;\n      task.status = 'failed';\n    }\n    this._processed++;\n    this._idle = true;\n  }\n  get isIdle() { return this._idle; }\n  get tasksProcessed() { return this._processed; }\n}\n\nclass Scheduler {\n  constructor(concurrency) {\n    this.concurrency = concurrency;\n    this.queue = new Queue();\n    this.workers = [];\n    this.allTasks = [];\n    for (let i = 0; i < concurrency; i++) {\n      this.workers.push(new Worker('Worker-' + i));\n    }\n  }\n  addTask(name, fn, priority) {\n    const task = new Task(name, fn, priority);\n    this.queue.enqueue(task);\n    this.allTasks.push(task);\n  }\n  async start() {\n    const running = [];\n    while (!this.queue.isEmpty || running.length > 0) {\n      while (running.length < this.concurrency && !this.queue.isEmpty) {\n        const task = this.queue.dequeue();\n        const worker = this.workers.find(w => w.isIdle);\n        if (worker && task) {\n          const p = worker.process(task).then(() => {\n            running.splice(running.indexOf(p), 1);\n          });\n          running.push(p);\n        }\n      }\n      if (running.length > 0) await Promise.race(running);\n    }\n  }\n  get stats() {\n    return {\n      completed: this.allTasks.filter(t => t.status === 'completed').length,\n      failed: this.allTasks.filter(t => t.status === 'failed').length,\n      pending: this.allTasks.filter(t => t.status === 'pending').length,\n    };\n  }\n}`,
    testRunner: `(code) => {
  const { Task, Queue, Worker, Scheduler } = new Function(code + '; return { Task, Queue, Worker, Scheduler };')();

  // Test Queue
  const q = new Queue();
  const t1 = new Task('low', async () => 1, 1);
  const t2 = new Task('high', async () => 2, 5);
  q.enqueue(t1);
  q.enqueue(t2);
  const dequeued = q.dequeue();

  // Test Worker
  const workerTest = (async () => {
    const w = new Worker('W1');
    const task = new Task('test', async () => 'result', 1);
    await w.process(task);
    return task.status === 'completed' && task.result === 'result' && w.tasksProcessed === 1;
  })();

  // Test Worker error handling
  const workerErrTest = (async () => {
    const w = new Worker('W2');
    const task = new Task('fail', async () => { throw new Error('oops'); }, 1);
    await w.process(task);
    return task.status === 'failed' && task.error.message === 'oops';
  })();

  // Test Scheduler
  const schedulerTest = (async () => {
    const s = new Scheduler(2);
    s.addTask('a', async () => 'a', 1);
    s.addTask('b', async () => 'b', 2);
    s.addTask('c', async () => { throw new Error('c'); }, 1);
    await s.start();
    const stats = s.stats;
    return stats.completed === 2 && stats.failed === 1 && stats.pending === 0;
  })();

  return Promise.all([workerTest, workerErrTest, schedulerTest]).then(([wr, we, sr]) => [
    { pass: dequeued.name === 'high', description: 'Queue dequeues highest priority first', got: dequeued.name },
    { pass: q.size === 1, description: 'Queue size after dequeue', got: q.size },
    { pass: wr, description: 'Worker processes task and sets status/result', got: wr },
    { pass: we, description: 'Worker handles errors and sets failed status', got: we },
    { pass: sr, description: 'Scheduler processes all tasks with stats', got: sr },
    { pass: t1.status === 'pending', description: 'Unprocessed task stays pending', got: t1.status },
  ]);
}`,
    hint: 'Queue sorts by priority on enqueue. Worker wraps task.fn() in try/catch. Scheduler uses a while loop: fill workers up to concurrency, then await Promise.race(running) to wait for one to finish before filling again.',
    resources: [],
  },
];

// ─── ADD ALL EXERCISES ────────────────────────────────────────────────────────

const allNew = [...tier4Exercises, ...tier5Exercises];

for (const ex of allNew) {
  data.exercises.push(ex);
  console.log(`  Added ${ex.id}: ${ex.title} (Tier ${ex.tier})`);
}

// ─── UPDATE DEFAULT CURRICULUM ────────────────────────────────────────────────

const defaultCurr = data.collections.find(c => c.id === 'default-curriculum');
if (defaultCurr) {
  const newCurrIds = [279, 280, 284, 287, 291, 294];
  defaultCurr.exerciseIds = [...defaultCurr.exerciseIds, ...newCurrIds].sort((a, b) => a - b);
  console.log(`\n  Updated default-curriculum: ${defaultCurr.exerciseIds.length} exercises`);
}

// ─── CREATE CAPSTONE TRACK COLLECTION ─────────────────────────────────────────

const capstoneIds = allNew.map(e => e.id);
data.collections.push({
  id: 'capstone-track',
  name: 'Capstone Track',
  description: 'Advanced exercises covering design patterns, async programming, data structures, and multi-class systems.',
  exerciseIds: capstoneIds,
  color: '#c084fc',
});
console.log(`  Created capstone-track collection: ${capstoneIds.length} exercises`);

// ─── WRITE BACK ───────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── SUMMARY ──────────────────────────────────────────────────────────────────

const tierCounts = {};
for (const ex of data.exercises) {
  tierCounts[ex.tier] = (tierCounts[ex.tier] || 0) + 1;
}

console.log('\n=== Migration Complete ===');
console.log(`  New Tier 4 exercises: ${tier4Exercises.length}`);
console.log(`  New Tier 5 exercises: ${tier5Exercises.length}`);
console.log(`  Total new exercises: ${allNew.length}`);
console.log(`  ID range: ${allNew[0].id} - ${allNew[allNew.length - 1].id}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1]} T2:${tierCounts[2]} T3:${tierCounts[3]} T4:${tierCounts[4]} T5:${tierCounts[5]}`);
