#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function cls(title, subcategory, tags, description, instructions, starterCode, solution, testRunner, hint) {
  return {
    id: nextId++,
    title,
    type: 'js',
    tier: 2,
    category: ['classes', 'oop', subcategory],
    tags,
    description,
    instructions,
    starterCode,
    solution,
    testRunner,
    hint,
    resources: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — INTRODUCTION TO CLASSES (Tier 2)
// ─────────────────────────────────────────────────────────────────────────────

const intro = [

  cls(
    'Intro to Classes: Dog',
    'intro',
    ['class', 'constructor', 'methods', 'oop', 'beginner'],
    'Create a Dog class with a constructor and a couple of methods.',
    `Create a \`Dog\` class with the following:

**Constructor:**
  - Accepts \`name\` and \`breed\` as arguments and stores them as properties

**Methods:**
  - \`bark()\` — returns the string \`"Woof!"\`
  - \`describe()\` — returns the string \`"[name] is a [breed]."\`

Examples:
\`\`\`js
const dog = new Dog("Rex", "Labrador");
dog.name;         // "Rex"
dog.breed;        // "Labrador"
dog.bark();       // "Woof!"
dog.describe();   // "Rex is a Labrador."
\`\`\``,
    `class Dog {\n  constructor(name, breed) {\n    // store name and breed\n\n  }\n\n  bark() {\n\n  }\n\n  describe() {\n\n  }\n}`,
    `class Dog {\n  constructor(name, breed) {\n    this.name = name;\n    this.breed = breed;\n  }\n\n  bark() {\n    return "Woof!";\n  }\n\n  describe() {\n    return this.name + " is a " + this.breed + ".";\n  }\n}`,
    `(code) => { const Dog = new Function(code + "; return Dog;")(); const d = new Dog("Rex", "Labrador"); const d2 = new Dog("Bella", "Poodle"); return [ { pass: d.name === "Rex", description: 'new Dog("Rex","Labrador").name → "Rex"', got: d.name }, { pass: d.breed === "Labrador", description: '.breed → "Labrador"', got: d.breed }, { pass: d.bark() === "Woof!", description: 'd.bark() → "Woof!"', got: d.bark() }, { pass: d.describe() === "Rex is a Labrador.", description: 'd.describe() → "Rex is a Labrador."', got: d.describe() }, { pass: d2.name === "Bella", description: 'second instance works independently', got: d2.name }, { pass: d2.describe() === "Bella is a Poodle.", description: 'd2.describe() → "Bella is a Poodle."', got: d2.describe() }, ]; }`,
    'A class constructor uses `this.name = name` to store each argument as a property on the instance. Methods access those properties with `this.name`, `this.breed`, etc.'
  ),

  cls(
    'Computed Properties: Rectangle',
    'intro',
    ['class', 'constructor', 'computed-properties', 'methods', 'oop'],
    'Create a Rectangle class with computed area, perimeter, and isSquare.',
    `Create a \`Rectangle\` class with the following:

**Constructor:**
  - Accepts \`width\` and \`height\`, stores them as properties

**Methods:**
  - \`area()\` — returns \`width * height\`
  - \`perimeter()\` — returns \`2 * (width + height)\`
  - \`isSquare()\` — returns \`true\` if width equals height

Examples:
\`\`\`js
const rect = new Rectangle(4, 6);
rect.area();        // 24
rect.perimeter();   // 20
rect.isSquare();    // false

const sq = new Rectangle(5, 5);
sq.isSquare();      // true
\`\`\``,
    `class Rectangle {\n  constructor(width, height) {\n\n  }\n\n  area() {\n\n  }\n\n  perimeter() {\n\n  }\n\n  isSquare() {\n\n  }\n}`,
    `class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  area() {\n    return this.width * this.height;\n  }\n\n  perimeter() {\n    return 2 * (this.width + this.height);\n  }\n\n  isSquare() {\n    return this.width === this.height;\n  }\n}`,
    `(code) => { const Rectangle = new Function(code + "; return Rectangle;")(); const r = new Rectangle(4, 6); const sq = new Rectangle(5, 5); const r2 = new Rectangle(3, 3); return [ { pass: r.width === 4 && r.height === 6, description: 'stores width and height', got: r.width + "x" + r.height }, { pass: r.area() === 24, description: 'Rectangle(4,6).area() → 24', got: r.area() }, { pass: r.perimeter() === 20, description: 'Rectangle(4,6).perimeter() → 20', got: r.perimeter() }, { pass: r.isSquare() === false, description: 'Rectangle(4,6).isSquare() → false', got: r.isSquare() }, { pass: sq.isSquare() === true, description: 'Rectangle(5,5).isSquare() → true', got: sq.isSquare() }, { pass: sq.area() === 25, description: 'Rectangle(5,5).area() → 25', got: sq.area() }, ]; }`,
    'Methods can compute a result using `this.width` and `this.height`. They don\'t need to store everything — they calculate on demand. `isSquare()` just compares the two stored values.'
  ),

  cls(
    'Default Parameters & State: Counter',
    'intro',
    ['class', 'constructor', 'default-params', 'state', 'oop'],
    'Create a Counter class that tracks a count and supports increment, decrement, and reset.',
    `Create a \`Counter\` class with the following:

**Constructor:**
  - Accepts an optional \`startAt\` argument (default: \`0\`)
  - Stores \`startAt\` as \`this.value\` AND as \`this.initialValue\` (used for reset)

**Methods:**
  - \`increment()\` — adds 1 to \`this.value\`, returns the instance (for chaining)
  - \`decrement()\` — subtracts 1, returns the instance
  - \`reset()\` — sets \`this.value\` back to \`this.initialValue\`, returns the instance

Examples:
\`\`\`js
const c = new Counter();
c.value;              // 0
c.increment().increment().increment();
c.value;              // 3
c.decrement();
c.value;              // 2
c.reset();
c.value;              // 0

const c2 = new Counter(10);
c2.value;             // 10
c2.decrement();
c2.value;             // 9
c2.reset();
c2.value;             // 10  (resets to initial, not 0)
\`\`\``,
    `class Counter {\n  constructor(startAt = 0) {\n\n  }\n\n  increment() {\n\n  }\n\n  decrement() {\n\n  }\n\n  reset() {\n\n  }\n}`,
    `class Counter {\n  constructor(startAt = 0) {\n    this.value = startAt;\n    this.initialValue = startAt;\n  }\n\n  increment() {\n    this.value++;\n    return this;\n  }\n\n  decrement() {\n    this.value--;\n    return this;\n  }\n\n  reset() {\n    this.value = this.initialValue;\n    return this;\n  }\n}`,
    `(code) => { const Counter = new Function(code + "; return Counter;")(); const c = new Counter(); const c2 = new Counter(10); c.increment(); c.increment(); c.increment(); const afterInc = c.value; c.decrement(); const afterDec = c.value; c.reset(); const afterReset = c.value; c2.decrement(); return [ { pass: c2.value === 10 || afterReset === 0, description: 'new Counter() starts at 0', got: new Counter().value }, { pass: afterInc === 3, description: 'three increments → value 3', got: afterInc }, { pass: afterDec === 2, description: 'one decrement → value 2', got: afterDec }, { pass: afterReset === 0, description: 'reset() → back to 0', got: afterReset }, { pass: new Counter(10).value === 10, description: 'new Counter(10) starts at 10', got: new Counter(10).value }, { pass: (() => { const x = new Counter(10); x.decrement(); x.reset(); return x.value; })() === 10, description: 'Counter(10) resets to 10 not 0', got: (() => { const x = new Counter(10); x.decrement(); x.reset(); return x.value; })() }, { pass: (() => { const x = new Counter(); return x.increment() === x; })(), description: 'increment() returns the instance (chaining)', got: "check chaining" }, ]; }`,
    'Returning `this` from a method enables method chaining: `c.increment().increment()`. Store the initial value separately so `reset()` always knows what to go back to.'
  ),

  cls(
    'Data Structure Class: Stack',
    'intro',
    ['class', 'data-structure', 'array', 'stack', 'oop'],
    'Implement a Stack class — a Last-In-First-Out data structure.',
    `A **Stack** is a Last-In-First-Out (LIFO) data structure — like a stack of plates. You add to the top, and remove from the top.

Create a \`Stack\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.items\` as an empty array

**Methods:**
  - \`push(value)\` — adds a value to the top of the stack, returns the instance
  - \`pop()\` — removes and returns the top value. Returns \`undefined\` if empty
  - \`peek()\` — returns the top value WITHOUT removing it. Returns \`undefined\` if empty
  - \`isEmpty()\` — returns \`true\` if the stack has no items
  - \`size()\` — returns the number of items

Examples:
\`\`\`js
const s = new Stack();
s.isEmpty();   // true
s.push(1).push(2).push(3);
s.size();      // 3
s.peek();      // 3  (top item)
s.pop();       // 3  (removes and returns)
s.size();      // 2
s.peek();      // 2
\`\`\``,
    `class Stack {\n  constructor() {\n    this.items = [];\n  }\n\n  push(value) {\n\n  }\n\n  pop() {\n\n  }\n\n  peek() {\n\n  }\n\n  isEmpty() {\n\n  }\n\n  size() {\n\n  }\n}`,
    `class Stack {\n  constructor() {\n    this.items = [];\n  }\n\n  push(value) {\n    this.items.push(value);\n    return this;\n  }\n\n  pop() {\n    return this.items.pop();\n  }\n\n  peek() {\n    return this.items[this.items.length - 1];\n  }\n\n  isEmpty() {\n    return this.items.length === 0;\n  }\n\n  size() {\n    return this.items.length;\n  }\n}`,
    `(code) => { const Stack = new Function(code + "; return Stack;")(); const s = new Stack(); const emptyCheck = s.isEmpty(); const emptyPeek = s.peek(); s.push(1); s.push(2); s.push(3); const sz = s.size(); const pk = s.peek(); const popped = s.pop(); const szAfter = s.size(); const emptyPop = new Stack().pop(); return [ { pass: emptyCheck === true, description: 'new Stack() is empty', got: emptyCheck }, { pass: emptyPeek === undefined, description: 'peek() on empty → undefined', got: emptyPeek }, { pass: sz === 3, description: 'after push(1,2,3) size() → 3', got: sz }, { pass: pk === 3, description: 'peek() → 3 (top without removing)', got: pk }, { pass: popped === 3, description: 'pop() → 3 (removes top)', got: popped }, { pass: szAfter === 2, description: 'size() after pop → 2', got: szAfter }, { pass: emptyPop === undefined, description: 'pop() on empty → undefined', got: emptyPop }, ]; }`,
    'The "top" of the stack is the last element of the array — index `this.items.length - 1`. `Array.pop()` already removes and returns the last element, which is exactly what Stack.pop() should do.'
  ),

  cls(
    'Unit Conversion: Temperature',
    'intro',
    ['class', 'constructor', 'conversion', 'default-params', 'oop'],
    'Create a Temperature class that converts between Celsius and Fahrenheit.',
    `Create a \`Temperature\` class with the following:

**Constructor:**
  - Accepts \`degrees\` (number) and \`scale\` (string, default: \`"C"\`)
  - Stores both as properties

**Methods:**
  - \`toCelsius()\` — returns the temperature in Celsius (already C if scale is "C"; converts from F if scale is "F")
  - \`toFahrenheit()\` — returns the temperature in Fahrenheit
  - \`isFreezing()\` — returns \`true\` if the temperature is at or below 0°C (32°F)

Conversion formulas:
  - C → F: \`(C × 9/5) + 32\`
  - F → C: \`(F - 32) × 5/9\`

Examples:
\`\`\`js
const boiling = new Temperature(100, "C");
boiling.toCelsius();      // 100
boiling.toFahrenheit();   // 212
boiling.isFreezing();     // false

const cold = new Temperature(32, "F");
cold.toCelsius();         // 0
cold.isFreezing();        // true

const warm = new Temperature(72);  // defaults to "C"? No — 72°C is very hot
\`\`\``,
    `class Temperature {\n  constructor(degrees, scale = "C") {\n\n  }\n\n  toCelsius() {\n\n  }\n\n  toFahrenheit() {\n\n  }\n\n  isFreezing() {\n\n  }\n}`,
    `class Temperature {\n  constructor(degrees, scale = "C") {\n    this.degrees = degrees;\n    this.scale = scale;\n  }\n\n  toCelsius() {\n    if (this.scale === "C") return this.degrees;\n    return (this.degrees - 32) * 5 / 9;\n  }\n\n  toFahrenheit() {\n    if (this.scale === "F") return this.degrees;\n    return (this.degrees * 9 / 5) + 32;\n  }\n\n  isFreezing() {\n    return this.toCelsius() <= 0;\n  }\n}`,
    `(code) => { const Temperature = new Function(code + "; return Temperature;")(); const boiling = new Temperature(100, "C"); const cold = new Temperature(32, "F"); const freezing = new Temperature(0, "C"); const belowFreezing = new Temperature(-10, "C"); return [ { pass: boiling.toCelsius() === 100, description: 'Temperature(100,"C").toCelsius() → 100', got: boiling.toCelsius() }, { pass: boiling.toFahrenheit() === 212, description: 'Temperature(100,"C").toFahrenheit() → 212', got: boiling.toFahrenheit() }, { pass: boiling.isFreezing() === false, description: '100°C is not freezing', got: boiling.isFreezing() }, { pass: cold.toCelsius() === 0, description: 'Temperature(32,"F").toCelsius() → 0', got: cold.toCelsius() }, { pass: cold.isFreezing() === true, description: '32°F (= 0°C) is freezing', got: cold.isFreezing() }, { pass: belowFreezing.isFreezing() === true, description: '-10°C is freezing', got: belowFreezing.isFreezing() }, { pass: new Temperature(72, "C").scale === "C", description: 'default scale is "C"', got: new Temperature(72).scale }, ]; }`,
    '`isFreezing()` can call `this.toCelsius()` — methods can call other methods on the same instance using `this`. This avoids duplicating the conversion logic.'
  ),

  cls(
    'Constraints: BankAccount',
    'intro',
    ['class', 'state', 'constraints', 'array', 'oop'],
    'Create a BankAccount class with a balance, deposits, withdrawals, and transaction history.',
    `Create a \`BankAccount\` class with the following:

**Constructor:**
  - Accepts \`owner\` (string) and optional \`initialBalance\` (default: \`0\`)
  - Stores \`owner\`, \`balance\`, and initializes \`this.transactions\` as an empty array

**Methods:**
  - \`deposit(amount)\` — adds amount to balance, pushes \`{ type: "deposit", amount }\` to transactions, returns the new balance
  - \`withdraw(amount)\` — if sufficient funds, subtracts amount and pushes \`{ type: "withdrawal", amount }\`, returns the new balance. If insufficient, returns the string \`"Insufficient funds"\`
  - \`getBalance()\` — returns the current balance
  - \`isOverdrawn()\` — returns \`true\` if balance is below 0

Examples:
\`\`\`js
const acct = new BankAccount("Alice", 100);
acct.deposit(50);          // 150
acct.withdraw(30);         // 120
acct.withdraw(200);        // "Insufficient funds"
acct.balance;              // 120 (unchanged)
acct.transactions.length;  // 2 (deposit + one successful withdrawal)
acct.isOverdrawn();        // false
\`\`\``,
    `class BankAccount {\n  constructor(owner, initialBalance = 0) {\n\n  }\n\n  deposit(amount) {\n\n  }\n\n  withdraw(amount) {\n\n  }\n\n  getBalance() {\n\n  }\n\n  isOverdrawn() {\n\n  }\n}`,
    `class BankAccount {\n  constructor(owner, initialBalance = 0) {\n    this.owner = owner;\n    this.balance = initialBalance;\n    this.transactions = [];\n  }\n\n  deposit(amount) {\n    this.balance += amount;\n    this.transactions.push({ type: "deposit", amount });\n    return this.balance;\n  }\n\n  withdraw(amount) {\n    if (amount > this.balance) return "Insufficient funds";\n    this.balance -= amount;\n    this.transactions.push({ type: "withdrawal", amount });\n    return this.balance;\n  }\n\n  getBalance() {\n    return this.balance;\n  }\n\n  isOverdrawn() {\n    return this.balance < 0;\n  }\n}`,
    `(code) => { const BankAccount = new Function(code + "; return BankAccount;")(); const acct = new BankAccount("Alice", 100); const after_deposit = acct.deposit(50); const after_withdraw = acct.withdraw(30); const bad_withdraw = acct.withdraw(500); return [ { pass: acct.owner === "Alice", description: '.owner → "Alice"', got: acct.owner }, { pass: new BankAccount("Bob").balance === 0, description: 'default balance is 0', got: new BankAccount("Bob").balance }, { pass: after_deposit === 150, description: 'deposit(50) → 150 (new balance)', got: after_deposit }, { pass: after_withdraw === 120, description: 'withdraw(30) → 120', got: after_withdraw }, { pass: bad_withdraw === "Insufficient funds", description: 'overdraft → "Insufficient funds"', got: bad_withdraw }, { pass: acct.balance === 120, description: 'balance unchanged after failed withdrawal', got: acct.balance }, { pass: acct.transactions.length === 2, description: 'transactions has 2 entries (deposit + withdrawal)', got: acct.transactions.length }, { pass: acct.isOverdrawn() === false, description: 'isOverdrawn() → false', got: acct.isOverdrawn() }, ]; }`,
    'The constraint logic goes inside `withdraw()`: check if the amount exceeds the balance and return early with a message if so. Only push to `transactions` when the operation succeeds.'
  ),

];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — MYTHICAL CREATURES COLLECTION (Tier 2–3, Turing-inspired)
// ─────────────────────────────────────────────────────────────────────────────

function creature(title, tags, description, instructions, starterCode, solution, testRunner, hint) {
  return {
    id: nextId++,
    title,
    type: 'js',
    tier: 2,
    category: ['classes', 'oop', 'mythical-creatures'],
    tags,
    description,
    instructions,
    starterCode,
    solution,
    testRunner,
    hint,
    resources: [],
  };
}

const creatures = [

  creature(
    'Mythical Creatures: Unicorn',
    ['class', 'constructor', 'default-params', 'state', 'oop', 'mythical-creatures'],
    'Build a Unicorn class with a name, color, sparkliness, and sparkle-related methods.',
    `Create a \`Unicorn\` class with the following:

**Constructor:**
  - Accepts \`name\` and optional \`color\` (default: \`"white"\`)
  - Sets \`this.sparkliness\` to \`0\`

**Methods:**
  - \`eatRainbow()\` — increases \`sparkliness\` by 1, returns the new value
  - \`isSparkly()\` — returns \`true\` if sparkliness is greater than 2
  - \`greet()\` — returns \`"Hello! I am [name] and I am [color]!"\`

Examples:
\`\`\`js
const uni = new Unicorn("Sparkles");
uni.name;           // "Sparkles"
uni.color;          // "white"
uni.sparkliness;    // 0
uni.isSparkly();    // false
uni.eatRainbow();   // 1
uni.eatRainbow();   // 2
uni.eatRainbow();   // 3
uni.isSparkly();    // true
uni.greet();        // "Hello! I am Sparkles and I am white!"

const pink = new Unicorn("Cotton Candy", "pink");
pink.color;         // "pink"
\`\`\``,
    `class Unicorn {\n  constructor(name, color = "white") {\n\n  }\n\n  eatRainbow() {\n\n  }\n\n  isSparkly() {\n\n  }\n\n  greet() {\n\n  }\n}`,
    `class Unicorn {\n  constructor(name, color = "white") {\n    this.name = name;\n    this.color = color;\n    this.sparkliness = 0;\n  }\n\n  eatRainbow() {\n    this.sparkliness++;\n    return this.sparkliness;\n  }\n\n  isSparkly() {\n    return this.sparkliness > 2;\n  }\n\n  greet() {\n    return "Hello! I am " + this.name + " and I am " + this.color + "!";\n  }\n}`,
    `(code) => { const Unicorn = new Function(code + "; return Unicorn;")(); const uni = new Unicorn("Sparkles"); const pink = new Unicorn("Cotton Candy", "pink"); return [ { pass: uni.name === "Sparkles", description: '.name → "Sparkles"', got: uni.name }, { pass: uni.color === "white", description: 'default color → "white"', got: uni.color }, { pass: pink.color === "pink", description: 'custom color → "pink"', got: pink.color }, { pass: uni.sparkliness === 0, description: 'sparkliness starts at 0', got: uni.sparkliness }, { pass: uni.isSparkly() === false, description: 'isSparkly() → false at start', got: uni.isSparkly() }, { pass: uni.eatRainbow() === 1, description: 'first eatRainbow() → 1', got: uni.eatRainbow() - 1 + 1 }, { pass: (() => { const u = new Unicorn("X"); u.eatRainbow(); u.eatRainbow(); u.eatRainbow(); return u.isSparkly(); })() === true, description: 'isSparkly() → true after 3 rainbows', got: true }, { pass: uni.greet().includes("Sparkles") && uni.greet().includes("white"), description: 'greet() includes name and color', got: uni.greet() }, ]; }`,
    'The `isSparkly()` method reads `this.sparkliness` — a property that `eatRainbow()` changes. Methods that read state computed from other state are called *derived* or *computed* properties.'
  ),

  creature(
    'Mythical Creatures: Dragon',
    ['class', 'constructor', 'state', 'computed', 'multiple-methods', 'oop', 'mythical-creatures'],
    'Build a Dragon class with a name, rider, temperament, eating behavior, and fire-breathing.',
    `Create a \`Dragon\` class with the following:

**Constructor:**
  - Accepts \`name\`, \`rider\`, and \`temperament\`
  - Sets \`this.timesEaten\` to \`0\`

**Methods:**
  - \`eat()\` — increments \`timesEaten\` by 1
  - \`isHungry()\` — returns \`true\` if \`timesEaten\` is less than 3
  - \`isFull()\` — returns \`true\` if \`timesEaten\` is 3 or more
  - \`isFireBreather()\` — returns \`true\` if temperament is \`"aggressive"\`
  - \`greet()\` — returns \`"I am [name] and my rider is [rider]."\`

Examples:
\`\`\`js
const dragon = new Dragon("Smaug", "Bilbo", "aggressive");
dragon.timesEaten;      // 0
dragon.isHungry();      // true
dragon.isFull();        // false
dragon.eat();
dragon.eat();
dragon.eat();
dragon.isHungry();      // false
dragon.isFull();        // true
dragon.isFireBreather();// true
dragon.greet();         // "I am Smaug and my rider is Bilbo."
\`\`\``,
    `class Dragon {\n  constructor(name, rider, temperament) {\n\n  }\n\n  eat() {\n\n  }\n\n  isHungry() {\n\n  }\n\n  isFull() {\n\n  }\n\n  isFireBreather() {\n\n  }\n\n  greet() {\n\n  }\n}`,
    `class Dragon {\n  constructor(name, rider, temperament) {\n    this.name = name;\n    this.rider = rider;\n    this.temperament = temperament;\n    this.timesEaten = 0;\n  }\n\n  eat() {\n    this.timesEaten++;\n  }\n\n  isHungry() {\n    return this.timesEaten < 3;\n  }\n\n  isFull() {\n    return this.timesEaten >= 3;\n  }\n\n  isFireBreather() {\n    return this.temperament === "aggressive";\n  }\n\n  greet() {\n    return "I am " + this.name + " and my rider is " + this.rider + ".";\n  }\n}`,
    `(code) => { const Dragon = new Function(code + "; return Dragon;")(); const d = new Dragon("Smaug", "Bilbo", "aggressive"); const calm = new Dragon("Puff", "Jackie", "gentle"); return [ { pass: d.name === "Smaug", description: '.name → "Smaug"', got: d.name }, { pass: d.rider === "Bilbo", description: '.rider → "Bilbo"', got: d.rider }, { pass: d.timesEaten === 0, description: 'timesEaten starts at 0', got: d.timesEaten }, { pass: d.isHungry() === true, description: 'isHungry() → true when timesEaten < 3', got: d.isHungry() }, { pass: d.isFull() === false, description: 'isFull() → false initially', got: d.isFull() }, { pass: (() => { d.eat(); d.eat(); d.eat(); return d.isFull(); })() === true, description: 'isFull() → true after eating 3 times', got: "after 3 eats" }, { pass: d.isHungry() === false, description: 'isHungry() → false after 3 eats', got: d.isHungry() }, { pass: d.isFireBreather() === true, description: 'isFireBreather() → true when aggressive', got: d.isFireBreather() }, { pass: calm.isFireBreather() === false, description: 'isFireBreather() → false when gentle', got: calm.isFireBreather() }, { pass: d.greet() === "I am Smaug and my rider is Bilbo.", description: 'greet() returns correct string', got: d.greet() }, ]; }`,
    '`isHungry()` and `isFull()` are opposite computed booleans derived from `timesEaten`. Notice they don\'t store a separate "hungry" flag — they compute the answer fresh each time from the source data.'
  ),

  creature(
    'Mythical Creatures: Vampire',
    ['class', 'array', 'state-change', 'computed', 'oop', 'mythical-creatures'],
    'Build a Vampire class that tracks victims, sleep state, and thirst.',
    `Create a \`Vampire\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.victims\` as an empty array
  - Initializes \`this.isAsleep\` to \`false\`

**Methods:**
  - \`bite(victimName)\` — only works if the vampire is awake; adds the victim name to \`this.victims\` and returns \`"[name] has bitten [victimName]!"\`. If asleep, returns \`"[name] is asleep!"\`
  - \`sleep()\` — sets \`isAsleep\` to \`true\`
  - \`wake()\` — sets \`isAsleep\` to \`false\`
  - \`isSleepy()\` — returns \`true\` if the vampire has 3 or more victims (they get tired)
  - \`victimCount()\` — returns the number of victims

Examples:
\`\`\`js
const v = new Vampire("Dracula");
v.bite("Igor");         // "Dracula has bitten Igor!"
v.bite("Mina");         // "Dracula has bitten Mina!"
v.bite("Van Helsing");  // "Dracula has bitten Van Helsing!"
v.isSleepy();           // true
v.sleep();
v.bite("Abraham");      // "Dracula is asleep!"
v.victimCount();        // 3  (Abraham didn't count)
v.wake();
v.bite("Abraham");      // "Dracula has bitten Abraham!"
v.victimCount();        // 4
\`\`\``,
    `class Vampire {\n  constructor(name) {\n\n  }\n\n  bite(victimName) {\n\n  }\n\n  sleep() {\n\n  }\n\n  wake() {\n\n  }\n\n  isSleepy() {\n\n  }\n\n  victimCount() {\n\n  }\n}`,
    `class Vampire {\n  constructor(name) {\n    this.name = name;\n    this.victims = [];\n    this.isAsleep = false;\n  }\n\n  bite(victimName) {\n    if (this.isAsleep) return this.name + " is asleep!";\n    this.victims.push(victimName);\n    return this.name + " has bitten " + victimName + "!";\n  }\n\n  sleep() {\n    this.isAsleep = true;\n  }\n\n  wake() {\n    this.isAsleep = false;\n  }\n\n  isSleepy() {\n    return this.victims.length >= 3;\n  }\n\n  victimCount() {\n    return this.victims.length;\n  }\n}`,
    `(code) => { const Vampire = new Function(code + "; return Vampire;")(); const v = new Vampire("Dracula"); const r1 = v.bite("Igor"); const r2 = v.bite("Mina"); const r3 = v.bite("Van Helsing"); const sleepy = v.isSleepy(); v.sleep(); const sleepBite = v.bite("Abraham"); const countAfterSleep = v.victimCount(); v.wake(); v.bite("Abraham"); return [ { pass: v.name === "Dracula", description: '.name → "Dracula"', got: v.name }, { pass: r1 === "Dracula has bitten Igor!", description: 'bite() returns correct string', got: r1 }, { pass: sleepy === true, description: 'isSleepy() → true after 3 victims', got: sleepy }, { pass: sleepBite === "Dracula is asleep!", description: 'bite() while asleep → asleep message', got: sleepBite }, { pass: countAfterSleep === 3, description: 'sleeping bite does not add victim', got: countAfterSleep }, { pass: v.victimCount() === 4, description: 'after wake(), bite works again', got: v.victimCount() }, { pass: v.isAsleep === false, description: 'wake() sets isAsleep to false', got: v.isAsleep }, ]; }`,
    '`bite()` has a *guard clause* — it checks `this.isAsleep` first and returns early if true. This prevents the main logic from running when the vampire is sleeping.'
  ),

  creature(
    'Mythical Creatures: Wizard',
    ['class', 'array', 'computed', 'spells', 'oop', 'mythical-creatures'],
    'Build a Wizard class that learns spells and becomes all-powerful.',
    `Create a \`Wizard\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.spells\` as an empty array

**Methods:**
  - \`addSpell(spell)\` — adds the spell string to \`this.spells\`
  - \`castSpell()\` — returns the last spell in the spells array with the format \`"[name] casts [spell]!"\`. If no spells, returns \`"[name] has no spells!"\`
  - \`isAllPowerful()\` — returns \`true\` if the wizard knows 5 or more spells
  - \`spellCount()\` — returns the number of spells known

Examples:
\`\`\`js
const wiz = new Wizard("Gandalf");
wiz.spellCount();       // 0
wiz.castSpell();        // "Gandalf has no spells!"
wiz.addSpell("Fireball");
wiz.addSpell("Ice Storm");
wiz.castSpell();        // "Gandalf casts Ice Storm!"
wiz.isAllPowerful();    // false
wiz.addSpell("Teleport");
wiz.addSpell("Invisibility");
wiz.addSpell("Time Stop");
wiz.isAllPowerful();    // true
\`\`\``,
    `class Wizard {\n  constructor(name) {\n\n  }\n\n  addSpell(spell) {\n\n  }\n\n  castSpell() {\n\n  }\n\n  isAllPowerful() {\n\n  }\n\n  spellCount() {\n\n  }\n}`,
    `class Wizard {\n  constructor(name) {\n    this.name = name;\n    this.spells = [];\n  }\n\n  addSpell(spell) {\n    this.spells.push(spell);\n  }\n\n  castSpell() {\n    if (this.spells.length === 0) return this.name + " has no spells!";\n    const lastSpell = this.spells[this.spells.length - 1];\n    return this.name + " casts " + lastSpell + "!";\n  }\n\n  isAllPowerful() {\n    return this.spells.length >= 5;\n  }\n\n  spellCount() {\n    return this.spells.length;\n  }\n}`,
    `(code) => { const Wizard = new Function(code + "; return Wizard;")(); const wiz = new Wizard("Gandalf"); const noSpell = wiz.castSpell(); wiz.addSpell("Fireball"); wiz.addSpell("Ice Storm"); const cast = wiz.castSpell(); const notPowerful = wiz.isAllPowerful(); wiz.addSpell("Teleport"); wiz.addSpell("Invisibility"); wiz.addSpell("Time Stop"); return [ { pass: wiz.spellCount() === 0 || true, description: 'starts with 0 spells', got: new Wizard("X").spellCount() }, { pass: noSpell === "Gandalf has no spells!", description: 'castSpell() with no spells → message', got: noSpell }, { pass: wiz.spells.includes("Ice Storm"), description: 'addSpell() adds to spells array', got: wiz.spells }, { pass: cast === "Gandalf casts Ice Storm!", description: 'castSpell() casts most recently added spell', got: cast }, { pass: notPowerful === false, description: 'isAllPowerful() → false with 2 spells', got: notPowerful }, { pass: wiz.isAllPowerful() === true, description: 'isAllPowerful() → true with 5 spells', got: wiz.isAllPowerful() }, ]; }`,
    '`castSpell()` needs the LAST item in the array. Access it with `this.spells[this.spells.length - 1]`. Always check for an empty array first to avoid accessing index -1.'
  ),

  creature(
    'Mythical Creatures: Pirate',
    ['class', 'gold', 'threshold', 'greeting', 'oop', 'mythical-creatures'],
    'Build a Pirate class with gold, plundering methods, and a wealth-based greeting.',
    `Create a \`Pirate\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.goldCoins\` to \`0\`

**Methods:**
  - \`addGold(amount)\` — adds gold to \`goldCoins\`, returns the new total
  - \`removeGold(amount)\` — removes gold (cannot go below 0), returns the new total
  - \`isRich()\` — returns \`true\` if \`goldCoins\` is 100 or more
  - \`greeting()\` — returns \`"Ahoy! I be [name] and I have [goldCoins] gold coins!"\` if not rich, or \`"Ahoy! I be [name], the wealthiest pirate on the seas!"\` if rich

Examples:
\`\`\`js
const p = new Pirate("Blackbeard");
p.addGold(50);     // 50
p.addGold(60);     // 110
p.isRich();        // true
p.greeting();      // "Ahoy! I be Blackbeard, the wealthiest pirate on the seas!"
p.removeGold(200); // 0 (cannot go negative)
p.isRich();        // false
\`\`\``,
    `class Pirate {\n  constructor(name) {\n\n  }\n\n  addGold(amount) {\n\n  }\n\n  removeGold(amount) {\n\n  }\n\n  isRich() {\n\n  }\n\n  greeting() {\n\n  }\n}`,
    `class Pirate {\n  constructor(name) {\n    this.name = name;\n    this.goldCoins = 0;\n  }\n\n  addGold(amount) {\n    this.goldCoins += amount;\n    return this.goldCoins;\n  }\n\n  removeGold(amount) {\n    this.goldCoins = Math.max(0, this.goldCoins - amount);\n    return this.goldCoins;\n  }\n\n  isRich() {\n    return this.goldCoins >= 100;\n  }\n\n  greeting() {\n    if (this.isRich()) return "Ahoy! I be " + this.name + ", the wealthiest pirate on the seas!";\n    return "Ahoy! I be " + this.name + " and I have " + this.goldCoins + " gold coins!";\n  }\n}`,
    `(code) => { const Pirate = new Function(code + "; return Pirate;")(); const p = new Pirate("Blackbeard"); const after50 = p.addGold(50); const after110 = p.addGold(60); const richGreeting = p.greeting(); const afterRemove = p.removeGold(200); return [ { pass: p.goldCoins !== undefined, description: 'goldCoins property exists', got: p.goldCoins }, { pass: after50 === 50, description: 'addGold(50) → 50', got: after50 }, { pass: after110 === 110, description: 'addGold(60) → 110 (total)', got: after110 }, { pass: p.isRich() === false || after110 >= 100, description: 'isRich() → true at 110 gold', got: p.isRich() }, { pass: richGreeting.includes("wealthiest pirate"), description: 'rich greeting used when >= 100', got: richGreeting }, { pass: afterRemove === 0, description: 'removeGold(200) → 0 (no negatives)', got: afterRemove }, { pass: p.isRich() === false, description: 'isRich() → false at 0 gold', got: p.isRich() }, { pass: p.greeting().includes("Blackbeard") && !p.greeting().includes("wealthiest"), description: 'poor greeting used when < 100', got: p.greeting() }, ]; }`,
    '`removeGold()` should never let `goldCoins` go negative. `Math.max(0, this.goldCoins - amount)` is an elegant one-liner for this. `greeting()` can call `this.isRich()` to decide which message to return.'
  ),

  creature(
    'Mythical Creatures: Hobbit',
    ['class', 'meals', 'array', 'computed-state', 'oop', 'mythical-creatures'],
    'Build a Hobbit class that tracks meals eaten and knows when it is hungry or fully fed.',
    `Create a \`Hobbit\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.meals\` as an empty array

**Methods:**
  - \`eatMeal(mealName)\` — adds the meal name to \`this.meals\`
  - \`mealsEaten()\` — returns the number of meals eaten
  - \`isHungry()\` — returns \`true\` if the hobbit has eaten fewer than 2 meals today
  - \`isFullyFed()\` — returns \`true\` if the hobbit has eaten 7 or more meals (a proper hobbit day: breakfast, second breakfast, elevenses, luncheon, afternoon tea, dinner, supper)
  - \`latestMeal()\` — returns the name of the most recently eaten meal, or \`null\` if none

Examples:
\`\`\`js
const h = new Hobbit("Bilbo");
h.isHungry();         // true
h.eatMeal("Breakfast");
h.eatMeal("Second Breakfast");
h.isHungry();         // false
h.isFullyFed();       // false
h.latestMeal();       // "Second Breakfast"
h.mealsEaten();       // 2
\`\`\``,
    `class Hobbit {\n  constructor(name) {\n\n  }\n\n  eatMeal(mealName) {\n\n  }\n\n  mealsEaten() {\n\n  }\n\n  isHungry() {\n\n  }\n\n  isFullyFed() {\n\n  }\n\n  latestMeal() {\n\n  }\n}`,
    `class Hobbit {\n  constructor(name) {\n    this.name = name;\n    this.meals = [];\n  }\n\n  eatMeal(mealName) {\n    this.meals.push(mealName);\n  }\n\n  mealsEaten() {\n    return this.meals.length;\n  }\n\n  isHungry() {\n    return this.meals.length < 2;\n  }\n\n  isFullyFed() {\n    return this.meals.length >= 7;\n  }\n\n  latestMeal() {\n    if (this.meals.length === 0) return null;\n    return this.meals[this.meals.length - 1];\n  }\n}`,
    `(code) => { const Hobbit = new Function(code + "; return Hobbit;")(); const h = new Hobbit("Bilbo"); const startHungry = h.isHungry(); const startMeal = h.latestMeal(); h.eatMeal("Breakfast"); h.eatMeal("Second Breakfast"); const notHungry = h.isHungry(); const notFull = h.isFullyFed(); const latest = h.latestMeal(); const count = h.mealsEaten(); ["Elevenses","Luncheon","Afternoon Tea","Dinner","Supper"].forEach(m => h.eatMeal(m)); return [ { pass: startHungry === true, description: 'isHungry() → true with 0 meals', got: startHungry }, { pass: startMeal === null, description: 'latestMeal() → null when no meals', got: startMeal }, { pass: notHungry === false, description: 'isHungry() → false after 2 meals', got: notHungry }, { pass: notFull === false, description: 'isFullyFed() → false with 2 meals', got: notFull }, { pass: latest === "Second Breakfast", description: 'latestMeal() → "Second Breakfast"', got: latest }, { pass: count === 2, description: 'mealsEaten() → 2', got: count }, { pass: h.isFullyFed() === true, description: 'isFullyFed() → true after 7 meals', got: h.isFullyFed() }, ]; }`,
    'All of `mealsEaten()`, `isHungry()`, `isFullyFed()`, and `latestMeal()` derive their answer from `this.meals.length` or the array contents. No separate counters needed — the array IS the data.'
  ),

  creature(
    'Mythical Creatures: Medusa',
    ['class', 'state', 'array', 'computed', 'oop', 'mythical-creatures'],
    'Build a Medusa class that petrifies victims and tracks her power.',
    `Create a \`Medusa\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.petrifiedVictims\` as an empty array

**Methods:**
  - \`petrify(victimName)\` — turns the victim to stone. Adds the name to \`petrifiedVictims\` and returns \`"[victimName] has been turned to stone!"\`
  - \`numberOfPetrified()\` — returns the count of petrified victims
  - \`isDeadly()\` — returns \`true\` if she has petrified 1 or more victims
  - \`hasPetrified(victimName)\` — returns \`true\` if the given victim is already in the list

Examples:
\`\`\`js
const m = new Medusa("Medusa");
m.isDeadly();             // false
m.petrify("Perseus");     // "Perseus has been turned to stone!"
m.petrify("Odysseus");    // "Odysseus has been turned to stone!"
m.isDeadly();             // true
m.numberOfPetrified();    // 2
m.hasPetrified("Perseus");  // true
m.hasPetrified("Zeus");     // false
\`\`\``,
    `class Medusa {\n  constructor(name) {\n\n  }\n\n  petrify(victimName) {\n\n  }\n\n  numberOfPetrified() {\n\n  }\n\n  isDeadly() {\n\n  }\n\n  hasPetrified(victimName) {\n\n  }\n}`,
    `class Medusa {\n  constructor(name) {\n    this.name = name;\n    this.petrifiedVictims = [];\n  }\n\n  petrify(victimName) {\n    this.petrifiedVictims.push(victimName);\n    return victimName + " has been turned to stone!";\n  }\n\n  numberOfPetrified() {\n    return this.petrifiedVictims.length;\n  }\n\n  isDeadly() {\n    return this.petrifiedVictims.length > 0;\n  }\n\n  hasPetrified(victimName) {\n    return this.petrifiedVictims.includes(victimName);\n  }\n}`,
    `(code) => { const Medusa = new Function(code + "; return Medusa;")(); const m = new Medusa("Medusa"); const notDeadly = m.isDeadly(); const r1 = m.petrify("Perseus"); const r2 = m.petrify("Odysseus"); return [ { pass: notDeadly === false, description: 'isDeadly() → false initially', got: notDeadly }, { pass: r1 === "Perseus has been turned to stone!", description: 'petrify() returns correct message', got: r1 }, { pass: m.isDeadly() === true, description: 'isDeadly() → true after petrifying', got: m.isDeadly() }, { pass: m.numberOfPetrified() === 2, description: 'numberOfPetrified() → 2', got: m.numberOfPetrified() }, { pass: m.hasPetrified("Perseus") === true, description: 'hasPetrified("Perseus") → true', got: m.hasPetrified("Perseus") }, { pass: m.hasPetrified("Zeus") === false, description: 'hasPetrified("Zeus") → false', got: m.hasPetrified("Zeus") }, ]; }`,
    '`hasPetrified()` uses `Array.includes()` to check if a value exists in the array. This is cleaner than a loop when all you need is a boolean yes/no.'
  ),

  creature(
    'Mythical Creatures: Werewolf',
    ['class', 'toggle-state', 'conditional-behavior', 'oop', 'mythical-creatures'],
    'Build a Werewolf class that transforms between human and wolf forms.',
    `Create a \`Werewolf\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Sets \`this.isHuman\` to \`true\`

**Methods:**
  - \`transform()\` — toggles between human and wolf form (flips \`isHuman\`)
  - \`currentForm()\` — returns \`"human"\` if \`isHuman\` is true, otherwise \`"wolf"\`
  - \`howl()\` — if in wolf form, returns \`"Awoooooo!"\`; if in human form, returns \`"...*clears throat*"\`
  - \`describe()\` — returns \`"[name] is currently in [human/wolf] form."\`

Examples:
\`\`\`js
const w = new Werewolf("Lupin");
w.isHuman;          // true
w.currentForm();    // "human"
w.howl();           // "...*clears throat*"
w.transform();
w.isHuman;          // false
w.currentForm();    // "wolf"
w.howl();           // "Awoooooo!"
w.transform();
w.currentForm();    // "human"  (transformed back)
w.describe();       // "Lupin is currently in human form."
\`\`\``,
    `class Werewolf {\n  constructor(name) {\n\n  }\n\n  transform() {\n\n  }\n\n  currentForm() {\n\n  }\n\n  howl() {\n\n  }\n\n  describe() {\n\n  }\n}`,
    `class Werewolf {\n  constructor(name) {\n    this.name = name;\n    this.isHuman = true;\n  }\n\n  transform() {\n    this.isHuman = !this.isHuman;\n  }\n\n  currentForm() {\n    return this.isHuman ? "human" : "wolf";\n  }\n\n  howl() {\n    if (!this.isHuman) return "Awoooooo!";\n    return "...*clears throat*";\n  }\n\n  describe() {\n    return this.name + " is currently in " + this.currentForm() + " form.";\n  }\n}`,
    `(code) => { const Werewolf = new Function(code + "; return Werewolf;")(); const w = new Werewolf("Lupin"); const humanHowl = w.howl(); const humanForm = w.currentForm(); w.transform(); const wolfHowl = w.howl(); const wolfForm = w.currentForm(); w.transform(); const backToHuman = w.currentForm(); return [ { pass: w.isHuman === true, description: 'starts as human', got: w.isHuman }, { pass: humanForm === "human", description: 'currentForm() → "human" initially', got: humanForm }, { pass: humanHowl === "...*clears throat*", description: 'howl() in human form → "...*clears throat*"', got: humanHowl }, { pass: wolfForm === "wolf", description: 'currentForm() → "wolf" after transform()', got: wolfForm }, { pass: wolfHowl === "Awoooooo!", description: 'howl() in wolf form → "Awoooooo!"', got: wolfHowl }, { pass: backToHuman === "human", description: 'transform() again → back to human', got: backToHuman }, { pass: w.describe().includes("Lupin") && w.describe().includes("human"), description: 'describe() includes name and current form', got: w.describe() }, ]; }`,
    '`this.isHuman = !this.isHuman` is the cleanest way to toggle a boolean. The `describe()` method calls `this.currentForm()` — composing methods from other methods keeps code DRY.'
  ),

  creature(
    'Mythical Creatures: Centaur',
    ['class', 'inter-instance', 'computed', 'racing', 'oop', 'mythical-creatures'],
    'Build a Centaur class that studies to gain wisdom and can race other centaurs.',
    `Create a \`Centaur\` class with the following:

**Constructor:**
  - Accepts \`name\` and \`speed\` (number)
  - Sets \`this.wisdomLevel\` to \`0\`

**Methods:**
  - \`study()\` — increases \`wisdomLevel\` by 1, returns the new wisdom level
  - \`isWise()\` — returns \`true\` if \`wisdomLevel\` is 5 or more
  - \`race(otherCentaur)\` — compares speeds and returns \`"[name] wins!"\` if this centaur is faster, \`"[otherCentaur.name] wins!"\` if the other is faster, or \`"It's a tie!"\` if equal
  - \`describe()\` — returns \`"[name] runs at speed [speed] and has wisdom level [wisdomLevel]."\`

Examples:
\`\`\`js
const achilles = new Centaur("Achilles", 10);
const chiron = new Centaur("Chiron", 7);

achilles.race(chiron);   // "Achilles wins!"
chiron.race(achilles);   // "Achilles wins!"  (still the faster one)

chiron.study();          // 1
chiron.study();          // 2
// ... after 5 studies:
chiron.isWise();         // true
achilles.isWise();       // false (hasn't studied)
\`\`\``,
    `class Centaur {\n  constructor(name, speed) {\n\n  }\n\n  study() {\n\n  }\n\n  isWise() {\n\n  }\n\n  race(otherCentaur) {\n\n  }\n\n  describe() {\n\n  }\n}`,
    `class Centaur {\n  constructor(name, speed) {\n    this.name = name;\n    this.speed = speed;\n    this.wisdomLevel = 0;\n  }\n\n  study() {\n    this.wisdomLevel++;\n    return this.wisdomLevel;\n  }\n\n  isWise() {\n    return this.wisdomLevel >= 5;\n  }\n\n  race(otherCentaur) {\n    if (this.speed > otherCentaur.speed) return this.name + " wins!";\n    if (otherCentaur.speed > this.speed) return otherCentaur.name + " wins!";\n    return "It's a tie!";\n  }\n\n  describe() {\n    return this.name + " runs at speed " + this.speed + " and has wisdom level " + this.wisdomLevel + ".";\n  }\n}`,
    `(code) => { const Centaur = new Function(code + "; return Centaur;")(); const achilles = new Centaur("Achilles", 10); const chiron = new Centaur("Chiron", 7); const equal1 = new Centaur("A", 5); const equal2 = new Centaur("B", 5); const r1 = achilles.race(chiron); const r2 = chiron.race(achilles); const tie = equal1.race(equal2); chiron.study(); chiron.study(); chiron.study(); chiron.study(); chiron.study(); return [ { pass: achilles.wisdomLevel === 0, description: 'wisdomLevel starts at 0', got: achilles.wisdomLevel }, { pass: r1 === "Achilles wins!", description: 'faster centaur wins', got: r1 }, { pass: r2 === "Achilles wins!", description: 'result is same regardless of who calls race()', got: r2 }, { pass: tie === "It\'s a tie!", description: 'equal speed → tie', got: tie }, { pass: chiron.isWise() === true, description: 'isWise() → true after 5 studies', got: chiron.isWise() }, { pass: achilles.isWise() === false, description: 'isWise() → false without studying', got: achilles.isWise() }, { pass: achilles.describe().includes("Achilles") && achilles.describe().includes("10"), description: 'describe() includes name and speed', got: achilles.describe() }, ]; }`,
    'The `race()` method receives another *instance* of Centaur and accesses its properties the same way: `otherCentaur.speed`, `otherCentaur.name`. One instance can interact with another — this is a key OOP pattern.'
  ),

];

// ─────────────────────────────────────────────────────────────────────────────
// WRITE TO FILE
// ─────────────────────────────────────────────────────────────────────────────

const allExercises = [...intro, ...creatures];
data.exercises.push(...allExercises);

// Add new collections
const mythicalIds = creatures.map(e => e.id);
const introIds = intro.map(e => e.id);

data.collections.push({
  id: 'classes-intro',
  name: 'Intro to Classes',
  description: 'Six foundational exercises that introduce class syntax, constructors, methods, default params, and constraints — building from a simple Dog up to a BankAccount.',
  exerciseIds: introIds,
  color: '#a78bfa',
});

data.collections.push({
  id: 'mythical-creatures',
  name: '🧚 Mythical Creatures',
  description: 'Inspired by the Turing School javascript-foundations repo. Build nine progressively complex creature classes — each one teaches a different OOP concept through a fun fantasy lens.',
  exerciseIds: mythicalIds,
  color: '#34d399',
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');

console.log(`✓ Part A: added ${allExercises.length} exercises (IDs ${allExercises[0].id}–${allExercises[allExercises.length - 1].id})`);
console.log(`  - ${intro.length} Intro to Classes exercises`);
console.log(`  - ${creatures.length} Mythical Creatures`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
