#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function cls(title, subcategory, tags, tier, description, instructions, starterCode, solution, testRunner, hint) {
  return { id: nextId++, title, type: 'js', tier, category: ['classes', 'oop', subcategory], tags, description, instructions, starterCode, solution, testRunner, hint, resources: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — REAL WORLD CLASSES COLLECTION (Tier 3)
// ─────────────────────────────────────────────────────────────────────────────

const realWorld = [

  cls(
    'Real World: ShoppingCart',
    'real-world',
    ['class', 'array', 'objects', 'total', 'oop'],
    3,
    'Create a ShoppingCart class with items, totals, and add/remove functionality.',
    `Create a \`ShoppingCart\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.items\` as an empty array

Each item is an object with \`{ name, price }\`.

**Methods:**
  - \`addItem(name, price)\` — adds \`{ name, price }\` to items
  - \`removeItem(name)\` — removes the first item with the matching name from items
  - \`getTotal()\` — returns the sum of all item prices (round to 2 decimal places)
  - \`isEmpty()\` — returns \`true\` if no items
  - \`itemCount()\` — returns the number of items
  - \`getItems()\` — returns a copy of the items array

Examples:
\`\`\`js
const cart = new ShoppingCart();
cart.isEmpty();           // true
cart.addItem("Apple", 1.50);
cart.addItem("Bread", 2.99);
cart.addItem("Milk", 3.49);
cart.getTotal();          // 7.98
cart.itemCount();         // 3
cart.removeItem("Bread");
cart.getTotal();          // 4.99
cart.itemCount();         // 2
\`\`\``,
    `class ShoppingCart {\n  constructor() {\n    this.items = [];\n  }\n\n  addItem(name, price) {\n\n  }\n\n  removeItem(name) {\n\n  }\n\n  getTotal() {\n\n  }\n\n  isEmpty() {\n\n  }\n\n  itemCount() {\n\n  }\n\n  getItems() {\n\n  }\n}`,
    `class ShoppingCart {\n  constructor() {\n    this.items = [];\n  }\n\n  addItem(name, price) {\n    this.items.push({ name, price });\n  }\n\n  removeItem(name) {\n    const index = this.items.findIndex(item => item.name === name);\n    if (index !== -1) this.items.splice(index, 1);\n  }\n\n  getTotal() {\n    const sum = this.items.reduce((acc, item) => acc + item.price, 0);\n    return Math.round(sum * 100) / 100;\n  }\n\n  isEmpty() {\n    return this.items.length === 0;\n  }\n\n  itemCount() {\n    return this.items.length;\n  }\n\n  getItems() {\n    return [...this.items];\n  }\n}`,
    `(code) => { const ShoppingCart = new Function(code + "; return ShoppingCart;")(); const cart = new ShoppingCart(); const emptyCheck = cart.isEmpty(); cart.addItem("Apple", 1.50); cart.addItem("Bread", 2.99); cart.addItem("Milk", 3.49); const total = cart.getTotal(); const count = cart.itemCount(); cart.removeItem("Bread"); const totalAfter = cart.getTotal(); const countAfter = cart.itemCount(); return [ { pass: emptyCheck === true, description: 'new cart is empty', got: emptyCheck }, { pass: count === 3, description: 'itemCount() → 3 after adding 3 items', got: count }, { pass: total === 7.98, description: 'getTotal() → 7.98', got: total }, { pass: countAfter === 2, description: 'itemCount() → 2 after removeItem', got: countAfter }, { pass: Math.abs(totalAfter - 4.99) < 0.01, description: 'getTotal() → 4.99 after removing Bread', got: totalAfter }, { pass: cart.isEmpty() === false, description: 'isEmpty() → false with items', got: cart.isEmpty() }, ]; }`,
    '`getTotal()` is a perfect case for `.reduce()`. `removeItem()` needs to find the item by name — `findIndex()` gives you the position, then `splice(index, 1)` removes exactly one item at that position.'
  ),

  cls(
    'Real World: TodoList',
    'real-world',
    ['class', 'array', 'filter', 'state', 'oop'],
    3,
    'Create a TodoList class that manages tasks with completion tracking.',
    `Create a \`TodoList\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.todos\` as an empty array

Each todo is an object \`{ task, completed }\` where \`completed\` starts as \`false\`.

**Methods:**
  - \`add(task)\` — creates a new todo object and adds it to the list
  - \`complete(task)\` — marks the first todo with the matching task name as \`completed: true\`
  - \`remove(task)\` — removes the first todo with the matching task name
  - \`getPending()\` — returns an array of todo objects where \`completed\` is \`false\`
  - \`getCompleted()\` — returns an array of todo objects where \`completed\` is \`true\`
  - \`pendingCount()\` — returns the number of incomplete todos

Examples:
\`\`\`js
const list = new TodoList();
list.add("Buy groceries");
list.add("Write tests");
list.add("Fix bug");
list.complete("Write tests");
list.getPending().length;    // 2
list.getCompleted().length;  // 1
list.pendingCount();         // 2
list.remove("Fix bug");
list.pendingCount();         // 1
\`\`\``,
    `class TodoList {\n  constructor() {\n    this.todos = [];\n  }\n\n  add(task) {\n\n  }\n\n  complete(task) {\n\n  }\n\n  remove(task) {\n\n  }\n\n  getPending() {\n\n  }\n\n  getCompleted() {\n\n  }\n\n  pendingCount() {\n\n  }\n}`,
    `class TodoList {\n  constructor() {\n    this.todos = [];\n  }\n\n  add(task) {\n    this.todos.push({ task, completed: false });\n  }\n\n  complete(task) {\n    const todo = this.todos.find(t => t.task === task);\n    if (todo) todo.completed = true;\n  }\n\n  remove(task) {\n    const index = this.todos.findIndex(t => t.task === task);\n    if (index !== -1) this.todos.splice(index, 1);\n  }\n\n  getPending() {\n    return this.todos.filter(t => !t.completed);\n  }\n\n  getCompleted() {\n    return this.todos.filter(t => t.completed);\n  }\n\n  pendingCount() {\n    return this.getPending().length;\n  }\n}`,
    `(code) => { const TodoList = new Function(code + "; return TodoList;")(); const list = new TodoList(); list.add("Buy groceries"); list.add("Write tests"); list.add("Fix bug"); list.complete("Write tests"); const pending = list.getPending(); const completed = list.getCompleted(); const pCount = list.pendingCount(); list.remove("Fix bug"); return [ { pass: list.todos.length > 0, description: 'todos array populated after adds', got: list.todos.length }, { pass: pending.length === 2, description: 'getPending() → 2 items', got: pending.length }, { pass: completed.length === 1, description: 'getCompleted() → 1 item', got: completed.length }, { pass: completed[0].task === "Write tests", description: 'completed item is "Write tests"', got: completed[0] && completed[0].task }, { pass: pCount === 2, description: 'pendingCount() → 2', got: pCount }, { pass: list.pendingCount() === 1, description: 'pendingCount() → 1 after remove', got: list.pendingCount() }, ]; }`,
    '`complete()` mutates an existing object in the array — `.find()` returns a reference, so setting `todo.completed = true` changes the actual item in the array. `pendingCount()` can simply call `this.getPending().length` — reuse your own methods.'
  ),

  cls(
    'Real World: Gradebook',
    'real-world',
    ['class', 'array', 'statistics', 'reduce', 'oop'],
    3,
    'Create a Gradebook class that tracks scores and computes statistics.',
    `Create a \`Gradebook\` class with the following:

**Constructor:**
  - Accepts \`studentName\`
  - Initializes \`this.scores\` as an empty array

**Methods:**
  - \`addScore(score)\` — adds a number to scores
  - \`getAverage()\` — returns the average score, rounded to 1 decimal place. Returns \`0\` if no scores
  - \`getHighScore()\` — returns the highest score. Returns \`null\` if no scores
  - \`getLowScore()\` — returns the lowest score. Returns \`null\` if no scores
  - \`getLetterGrade()\` — returns the letter grade based on average: A (90+), B (80–89), C (70–79), D (60–69), F (below 60). Returns \`"N/A"\` if no scores

Examples:
\`\`\`js
const gb = new Gradebook("Alice");
gb.addScore(85);
gb.addScore(92);
gb.addScore(78);
gb.getAverage();       // 85.0
gb.getHighScore();     // 92
gb.getLowScore();      // 78
gb.getLetterGrade();   // "B"
\`\`\``,
    `class Gradebook {\n  constructor(studentName) {\n    this.studentName = studentName;\n    this.scores = [];\n  }\n\n  addScore(score) {\n\n  }\n\n  getAverage() {\n\n  }\n\n  getHighScore() {\n\n  }\n\n  getLowScore() {\n\n  }\n\n  getLetterGrade() {\n\n  }\n}`,
    `class Gradebook {\n  constructor(studentName) {\n    this.studentName = studentName;\n    this.scores = [];\n  }\n\n  addScore(score) {\n    this.scores.push(score);\n  }\n\n  getAverage() {\n    if (this.scores.length === 0) return 0;\n    const sum = this.scores.reduce((a, b) => a + b, 0);\n    return Math.round((sum / this.scores.length) * 10) / 10;\n  }\n\n  getHighScore() {\n    if (this.scores.length === 0) return null;\n    return Math.max(...this.scores);\n  }\n\n  getLowScore() {\n    if (this.scores.length === 0) return null;\n    return Math.min(...this.scores);\n  }\n\n  getLetterGrade() {\n    if (this.scores.length === 0) return "N/A";\n    const avg = this.getAverage();\n    if (avg >= 90) return "A";\n    if (avg >= 80) return "B";\n    if (avg >= 70) return "C";\n    if (avg >= 60) return "D";\n    return "F";\n  }\n}`,
    `(code) => { const Gradebook = new Function(code + "; return Gradebook;")(); const gb = new Gradebook("Alice"); const empty = new Gradebook("Empty"); gb.addScore(85); gb.addScore(92); gb.addScore(78); return [ { pass: gb.studentName === "Alice", description: '.studentName → "Alice"', got: gb.studentName }, { pass: gb.getAverage() === 85.0, description: 'getAverage() → 85.0', got: gb.getAverage() }, { pass: gb.getHighScore() === 92, description: 'getHighScore() → 92', got: gb.getHighScore() }, { pass: gb.getLowScore() === 78, description: 'getLowScore() → 78', got: gb.getLowScore() }, { pass: gb.getLetterGrade() === "B", description: 'getLetterGrade() → "B" (avg 85)', got: gb.getLetterGrade() }, { pass: empty.getAverage() === 0, description: 'getAverage() → 0 with no scores', got: empty.getAverage() }, { pass: empty.getHighScore() === null, description: 'getHighScore() → null with no scores', got: empty.getHighScore() }, { pass: empty.getLetterGrade() === "N/A", description: 'getLetterGrade() → "N/A" with no scores', got: empty.getLetterGrade() }, ]; }`,
    '`getLetterGrade()` calls `this.getAverage()` — composing methods. `Math.max(...this.scores)` uses spread to pass array elements as individual arguments to Math.max, which expects separate numbers, not an array.'
  ),

  cls(
    'Real World: Playlist',
    'real-world',
    ['class', 'array', 'index-tracking', 'navigation', 'oop'],
    3,
    'Create a Playlist class with song navigation, play, and skip.',
    `Create a \`Playlist\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.songs\` as an empty array
  - Initializes \`this.currentIndex\` to \`-1\` (nothing playing)

**Methods:**
  - \`addSong(title, artist)\` — adds \`{ title, artist }\` to songs
  - \`removeSong(title)\` — removes the song with the matching title
  - \`play()\` — sets \`currentIndex\` to 0 (beginning) and returns the current song object. Returns \`null\` if no songs
  - \`skip()\` — advances to the next song and returns it. If at the last song, wraps around to the first. Returns \`null\` if no songs
  - \`nowPlaying()\` — returns the current song object, or \`null\` if nothing is playing
  - \`songCount()\` — returns the number of songs

Examples:
\`\`\`js
const p = new Playlist("Road Trip");
p.addSong("Bohemian Rhapsody", "Queen");
p.addSong("Hotel California", "Eagles");
p.addSong("Stairway to Heaven", "Led Zeppelin");
p.play();            // { title: "Bohemian Rhapsody", artist: "Queen" }
p.skip();            // { title: "Hotel California", artist: "Eagles" }
p.skip();            // { title: "Stairway to Heaven", artist: "Led Zeppelin" }
p.skip();            // { title: "Bohemian Rhapsody", artist: "Queen" }  (wraps!)
\`\`\``,
    `class Playlist {\n  constructor(name) {\n    this.name = name;\n    this.songs = [];\n    this.currentIndex = -1;\n  }\n\n  addSong(title, artist) {\n\n  }\n\n  removeSong(title) {\n\n  }\n\n  play() {\n\n  }\n\n  skip() {\n\n  }\n\n  nowPlaying() {\n\n  }\n\n  songCount() {\n\n  }\n}`,
    `class Playlist {\n  constructor(name) {\n    this.name = name;\n    this.songs = [];\n    this.currentIndex = -1;\n  }\n\n  addSong(title, artist) {\n    this.songs.push({ title, artist });\n  }\n\n  removeSong(title) {\n    const index = this.songs.findIndex(s => s.title === title);\n    if (index !== -1) this.songs.splice(index, 1);\n  }\n\n  play() {\n    if (this.songs.length === 0) return null;\n    this.currentIndex = 0;\n    return this.songs[0];\n  }\n\n  skip() {\n    if (this.songs.length === 0) return null;\n    this.currentIndex = (this.currentIndex + 1) % this.songs.length;\n    return this.songs[this.currentIndex];\n  }\n\n  nowPlaying() {\n    if (this.currentIndex === -1 || this.songs.length === 0) return null;\n    return this.songs[this.currentIndex];\n  }\n\n  songCount() {\n    return this.songs.length;\n  }\n}`,
    `(code) => { const Playlist = new Function(code + "; return Playlist;")(); const p = new Playlist("Road Trip"); p.addSong("Bohemian Rhapsody", "Queen"); p.addSong("Hotel California", "Eagles"); p.addSong("Stairway to Heaven", "Led Zeppelin"); const first = p.play(); const second = p.skip(); const third = p.skip(); const wrapped = p.skip(); return [ { pass: first && first.title === "Bohemian Rhapsody", description: 'play() → first song', got: first && first.title }, { pass: second && second.title === "Hotel California", description: 'skip() → second song', got: second && second.title }, { pass: third && third.title === "Stairway to Heaven", description: 'skip() again → third song', got: third && third.title }, { pass: wrapped && wrapped.title === "Bohemian Rhapsody", description: 'skip() at end wraps to beginning', got: wrapped && wrapped.title }, { pass: p.nowPlaying() && p.nowPlaying().title === "Bohemian Rhapsody", description: 'nowPlaying() matches current song', got: p.nowPlaying() && p.nowPlaying().title }, { pass: p.songCount() === 3, description: 'songCount() → 3', got: p.songCount() }, { pass: new Playlist("Empty").play() === null, description: 'play() on empty → null', got: new Playlist("Empty").play() }, ]; }`,
    'The wrap-around on `skip()` is the key algorithm: `(currentIndex + 1) % songs.length`. When you are at the last index, adding 1 gives you `songs.length`, and modulo wraps it back to 0.'
  ),

  cls(
    'Real World: VendingMachine',
    'real-world',
    ['class', 'objects', 'inventory', 'money', 'oop'],
    3,
    'Create a VendingMachine class with inventory management and money handling.',
    `Create a \`VendingMachine\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.balance\` to \`0\`
  - Initializes \`this.inventory\` as an empty object

**Methods:**
  - \`addItem(name, price, quantity)\` — adds or updates an item in inventory: \`{ price, quantity }\`
  - \`insertMoney(amount)\` — adds to balance, returns the new balance
  - \`selectItem(name)\` — if the item exists, has quantity > 0, and balance >= price: deducts price from balance, decrements quantity, returns \`"Dispensing [name]. Change: $[change]"\`. If out of stock returns \`"[name] is out of stock"\`. If not enough money returns \`"Insufficient funds"\`
  - \`getChange()\` — returns current balance and resets it to 0
  - \`getInventory()\` — returns the inventory object

Examples:
\`\`\`js
const vm = new VendingMachine();
vm.addItem("Chips", 1.50, 5);
vm.insertMoney(2.00);   // 2
vm.selectItem("Chips"); // "Dispensing Chips. Change: $0.50"
vm.balance;             // 0.50  (leftover from purchase)
\`\`\``,
    `class VendingMachine {\n  constructor() {\n    this.balance = 0;\n    this.inventory = {};\n  }\n\n  addItem(name, price, quantity) {\n\n  }\n\n  insertMoney(amount) {\n\n  }\n\n  selectItem(name) {\n\n  }\n\n  getChange() {\n\n  }\n\n  getInventory() {\n\n  }\n}`,
    `class VendingMachine {\n  constructor() {\n    this.balance = 0;\n    this.inventory = {};\n  }\n\n  addItem(name, price, quantity) {\n    this.inventory[name] = { price, quantity };\n  }\n\n  insertMoney(amount) {\n    this.balance += amount;\n    return this.balance;\n  }\n\n  selectItem(name) {\n    const item = this.inventory[name];\n    if (!item || item.quantity === 0) return name + " is out of stock";\n    if (this.balance < item.price) return "Insufficient funds";\n    this.balance -= item.price;\n    item.quantity--;\n    const change = Math.round(this.balance * 100) / 100;\n    return "Dispensing " + name + ". Change: $" + change.toFixed(2);\n  }\n\n  getChange() {\n    const change = this.balance;\n    this.balance = 0;\n    return change;\n  }\n\n  getInventory() {\n    return this.inventory;\n  }\n}`,
    `(code) => { const VendingMachine = new Function(code + "; return VendingMachine;")(); const vm = new VendingMachine(); vm.addItem("Chips", 1.50, 2); vm.addItem("Water", 1.00, 0); const bal = vm.insertMoney(2.00); const dispense = vm.selectItem("Chips"); const outOfStock = vm.selectItem("Water"); vm.insertMoney(0.25); const noFunds = vm.selectItem("Chips"); return [ { pass: bal === 2, description: 'insertMoney(2.00) → 2', got: bal }, { pass: dispense === "Dispensing Chips. Change: $0.50", description: 'selectItem() returns correct message', got: dispense }, { pass: vm.balance === 0.5, description: 'balance is $0.50 after purchase', got: vm.balance }, { pass: outOfStock === "Water is out of stock", description: 'out of stock message', got: outOfStock }, { pass: noFunds === "Insufficient funds", description: 'insufficient funds message', got: noFunds }, { pass: vm.inventory["Chips"].quantity === 1, description: 'quantity decremented after purchase', got: vm.inventory["Chips"].quantity }, ]; }`,
    'Use an object for inventory with item names as keys — `this.inventory[name]` gives you direct access. The `selectItem()` method has three guard clauses (missing/out-of-stock, insufficient funds) before the happy path.'
  ),

  cls(
    'Real World: Library',
    'real-world',
    ['class', 'objects', 'inventory', 'boolean-state', 'oop'],
    3,
    'Create a Library class that manages a book collection with checkout/return.',
    `Create a \`Library\` class with the following:

**Constructor:**
  - Accepts \`name\`
  - Initializes \`this.catalog\` as an empty object

Each catalog entry: \`{ copies, checkedOut }\`

**Methods:**
  - \`addBook(title, copies = 1)\` — adds a book with the given number of copies (checkedOut starts at 0)
  - \`checkout(title)\` — if book exists and has available copies, increments checkedOut and returns \`"Enjoy [title]!"\`. Otherwise returns \`"Sorry, [title] is not available"\`
  - \`returnBook(title)\` — decrements checkedOut (minimum 0). Returns \`"Thank you for returning [title]!"\`
  - \`isAvailable(title)\` — returns \`true\` if the book exists and has at least one available copy
  - \`availableCopies(title)\` — returns the number of available (not checked out) copies, or \`0\` if not found

Examples:
\`\`\`js
const lib = new Library("City Library");
lib.addBook("Dune", 3);
lib.isAvailable("Dune");       // true
lib.availableCopies("Dune");   // 3
lib.checkout("Dune");          // "Enjoy Dune!"
lib.availableCopies("Dune");   // 2
lib.checkout("Dune");
lib.checkout("Dune");
lib.isAvailable("Dune");       // false (all checked out)
lib.returnBook("Dune");
lib.isAvailable("Dune");       // true
\`\`\``,
    `class Library {\n  constructor(name) {\n    this.name = name;\n    this.catalog = {};\n  }\n\n  addBook(title, copies = 1) {\n\n  }\n\n  checkout(title) {\n\n  }\n\n  returnBook(title) {\n\n  }\n\n  isAvailable(title) {\n\n  }\n\n  availableCopies(title) {\n\n  }\n}`,
    `class Library {\n  constructor(name) {\n    this.name = name;\n    this.catalog = {};\n  }\n\n  addBook(title, copies = 1) {\n    this.catalog[title] = { copies, checkedOut: 0 };\n  }\n\n  checkout(title) {\n    if (!this.isAvailable(title)) return "Sorry, " + title + " is not available";\n    this.catalog[title].checkedOut++;\n    return "Enjoy " + title + "!";\n  }\n\n  returnBook(title) {\n    if (this.catalog[title] && this.catalog[title].checkedOut > 0) {\n      this.catalog[title].checkedOut--;\n    }\n    return "Thank you for returning " + title + "!";\n  }\n\n  isAvailable(title) {\n    return this.availableCopies(title) > 0;\n  }\n\n  availableCopies(title) {\n    if (!this.catalog[title]) return 0;\n    return this.catalog[title].copies - this.catalog[title].checkedOut;\n  }\n}`,
    `(code) => { const Library = new Function(code + "; return Library;")(); const lib = new Library("City Library"); lib.addBook("Dune", 3); const avail = lib.availableCopies("Dune"); const r1 = lib.checkout("Dune"); lib.checkout("Dune"); lib.checkout("Dune"); const r2 = lib.checkout("Dune"); const r3 = lib.returnBook("Dune"); return [ { pass: avail === 3, description: 'availableCopies("Dune") → 3 initially', got: avail }, { pass: r1 === "Enjoy Dune!", description: 'checkout() → "Enjoy Dune!"', got: r1 }, { pass: lib.availableCopies("Dune") === 0, description: 'all copies checked out → 0 available', got: lib.availableCopies("Dune") }, { pass: lib.isAvailable("Dune") === false, description: 'isAvailable() → false when all out', got: lib.isAvailable("Dune") }, { pass: r2 === "Sorry, Dune is not available", description: 'checkout when unavailable → sorry message', got: r2 }, { pass: r3.includes("Thank you"), description: 'returnBook() → thank you message', got: r3 }, { pass: lib.isAvailable("Dune") === true, description: 'isAvailable() → true after return', got: lib.isAvailable("Dune") }, { pass: lib.availableCopies("Unknown") === 0, description: 'unknown title → 0 copies', got: lib.availableCopies("Unknown") }, ]; }`,
    '`availableCopies()` is `copies - checkedOut`. `isAvailable()` calls `this.availableCopies() > 0` — never duplicate logic. `checkout()` can call `this.isAvailable()` as its guard clause.'
  ),

  cls(
    'Real World: Timer',
    'real-world',
    ['class', 'state', 'formatting', 'time', 'oop'],
    3,
    'Create a Timer class with start/stop/reset and formatted time display.',
    `Create a \`Timer\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.seconds\` to \`0\` and \`this.isRunning\` to \`false\`

**Methods:**
  - \`start()\` — sets \`isRunning\` to \`true\`. Returns \`"Timer started"\` if not already running, or \`"Timer already running"\` if it is
  - \`stop()\` — sets \`isRunning\` to \`false\`. Returns \`"Timer stopped"\`
  - \`tick()\` — if running, increments \`seconds\` by 1. If not running, does nothing. Returns the current seconds
  - \`reset()\` — sets seconds back to 0 and stops the timer
  - \`getFormatted()\` — returns the time as \`"MM:SS"\` (e.g., 90 seconds → \`"01:30"\`, 5 seconds → \`"00:05"\`)

Examples:
\`\`\`js
const t = new Timer();
t.start();        // "Timer started"
t.tick(); t.tick(); t.tick();
t.seconds;        // 3
t.stop();
t.tick();
t.seconds;        // 3  (not running, didn't tick)
t.getFormatted(); // "00:03"
t.reset();
t.seconds;        // 0

const t2 = new Timer();
t2.start();
for (let i = 0; i < 90; i++) t2.tick();
t2.getFormatted(); // "01:30"
\`\`\``,
    `class Timer {\n  constructor() {\n    this.seconds = 0;\n    this.isRunning = false;\n  }\n\n  start() {\n\n  }\n\n  stop() {\n\n  }\n\n  tick() {\n\n  }\n\n  reset() {\n\n  }\n\n  getFormatted() {\n\n  }\n}`,
    `class Timer {\n  constructor() {\n    this.seconds = 0;\n    this.isRunning = false;\n  }\n\n  start() {\n    if (this.isRunning) return "Timer already running";\n    this.isRunning = true;\n    return "Timer started";\n  }\n\n  stop() {\n    this.isRunning = false;\n    return "Timer stopped";\n  }\n\n  tick() {\n    if (this.isRunning) this.seconds++;\n    return this.seconds;\n  }\n\n  reset() {\n    this.seconds = 0;\n    this.isRunning = false;\n  }\n\n  getFormatted() {\n    const mins = Math.floor(this.seconds / 60);\n    const secs = this.seconds % 60;\n    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");\n  }\n}`,
    `(code) => { const Timer = new Function(code + "; return Timer;")(); const t = new Timer(); const msg1 = t.start(); const msg2 = t.start(); t.tick(); t.tick(); t.tick(); const afterTicks = t.seconds; t.stop(); t.tick(); const afterStop = t.seconds; const fmt3 = t.getFormatted(); t.reset(); const t2 = new Timer(); t2.start(); for (let i = 0; i < 90; i++) t2.tick(); return [ { pass: msg1 === "Timer started", description: 'start() → "Timer started"', got: msg1 }, { pass: msg2 === "Timer already running", description: 'start() when running → "Timer already running"', got: msg2 }, { pass: afterTicks === 3, description: '3 ticks → seconds = 3', got: afterTicks }, { pass: afterStop === 3, description: 'tick() when stopped does nothing', got: afterStop }, { pass: fmt3 === "00:03", description: 'getFormatted() → "00:03"', got: fmt3 }, { pass: t.seconds === 0, description: 'reset() → seconds back to 0', got: t.seconds }, { pass: t2.getFormatted() === "01:30", description: '90 seconds → "01:30"', got: t2.getFormatted() }, ]; }`,
    'For `getFormatted()`: minutes = `Math.floor(seconds / 60)`, remaining seconds = `seconds % 60`. `String(n).padStart(2, "0")` left-pads with zeros to ensure two-digit display: 5 → "05".'
  ),

  cls(
    'Real World: Garage',
    'real-world',
    ['class', 'array', 'capacity-constraint', 'oop'],
    3,
    'Create a Garage class with a capacity limit, car tracking, and spot availability.',
    `Create a \`Garage\` class with the following:

**Constructor:**
  - Accepts \`capacity\` (number of available spots)
  - Initializes \`this.cars\` as an empty array

**Methods:**
  - \`addCar(licensePlate)\` — if garage is not full, adds the plate to cars and returns \`"[plate] parked successfully"\`. If full, returns \`"Garage is full"\`
  - \`removeCar(licensePlate)\` — removes the car with the given plate and returns \`"[plate] has left the garage"\`. If not found, returns \`"[plate] not found"\`
  - \`isFull()\` — returns \`true\` if cars.length >= capacity
  - \`availableSpots()\` — returns the number of open spots
  - \`hasPlate(licensePlate)\` — returns \`true\` if the plate is currently in the garage

Examples:
\`\`\`js
const g = new Garage(2);
g.availableSpots();    // 2
g.addCar("ABC-123");   // "ABC-123 parked successfully"
g.addCar("XYZ-789");   // "XYZ-789 parked successfully"
g.isFull();            // true
g.addCar("DEF-456");   // "Garage is full"
g.removeCar("ABC-123"); // "ABC-123 has left the garage"
g.availableSpots();    // 1
\`\`\``,
    `class Garage {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cars = [];\n  }\n\n  addCar(licensePlate) {\n\n  }\n\n  removeCar(licensePlate) {\n\n  }\n\n  isFull() {\n\n  }\n\n  availableSpots() {\n\n  }\n\n  hasPlate(licensePlate) {\n\n  }\n}`,
    `class Garage {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cars = [];\n  }\n\n  addCar(licensePlate) {\n    if (this.isFull()) return "Garage is full";\n    this.cars.push(licensePlate);\n    return licensePlate + " parked successfully";\n  }\n\n  removeCar(licensePlate) {\n    const index = this.cars.indexOf(licensePlate);\n    if (index === -1) return licensePlate + " not found";\n    this.cars.splice(index, 1);\n    return licensePlate + " has left the garage";\n  }\n\n  isFull() {\n    return this.cars.length >= this.capacity;\n  }\n\n  availableSpots() {\n    return this.capacity - this.cars.length;\n  }\n\n  hasPlate(licensePlate) {\n    return this.cars.includes(licensePlate);\n  }\n}`,
    `(code) => { const Garage = new Function(code + "; return Garage;")(); const g = new Garage(2); const spots = g.availableSpots(); const r1 = g.addCar("ABC-123"); const r2 = g.addCar("XYZ-789"); const full = g.isFull(); const r3 = g.addCar("DEF-456"); const r4 = g.removeCar("ABC-123"); const r5 = g.removeCar("GHOST"); return [ { pass: spots === 2, description: 'availableSpots() → 2 initially', got: spots }, { pass: r1 === "ABC-123 parked successfully", description: 'addCar() → success message', got: r1 }, { pass: full === true, description: 'isFull() → true when at capacity', got: full }, { pass: r3 === "Garage is full", description: 'addCar() → "Garage is full" when full', got: r3 }, { pass: r4 === "ABC-123 has left the garage", description: 'removeCar() → departure message', got: r4 }, { pass: g.availableSpots() === 1, description: 'availableSpots() → 1 after removal', got: g.availableSpots() }, { pass: r5 === "GHOST not found", description: 'removeCar() → not found message', got: r5 }, ]; }`,
    '`availableSpots()` is simply `this.capacity - this.cars.length`. `addCar()` calls `this.isFull()` as a guard — composing your own methods keeps things clean and readable.'
  ),

];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — INHERITANCE & OOP PATTERNS (Tier 3–4)
// ─────────────────────────────────────────────────────────────────────────────

const inheritance = [

  cls(
    'Inheritance: Animal → Dog & Cat',
    'inheritance',
    ['class', 'extends', 'super', 'override', 'inheritance', 'oop'],
    3,
    'Create an Animal base class and Dog and Cat subclasses that override speak().',
    `Create three classes:

**\`Animal\`** (base class)
  - Constructor accepts \`name\` and \`sound\`
  - \`speak()\` — returns \`"[name] says [sound]!"\`
  - \`describe()\` — returns \`"I am [name], an animal."\`

**\`Dog\` extends Animal**
  - Constructor accepts \`name\`
  - Calls \`super\` with name and \`"Woof"\`
  - \`fetch(item)\` — returns \`"[name] fetches the [item]!"\`

**\`Cat\` extends Animal**
  - Constructor accepts \`name\`
  - Calls \`super\` with name and \`"Meow"\`
  - \`purr()\` — returns \`"Purrrrrr..."\`

Examples:
\`\`\`js
const dog = new Dog("Rex");
const cat = new Cat("Whiskers");

dog instanceof Animal;   // true  (Dog IS an Animal)
dog.speak();             // "Rex says Woof!"
dog.fetch("ball");       // "Rex fetches the ball!"
cat.speak();             // "Whiskers says Meow!"
cat.purr();              // "Purrrrrr..."
cat instanceof Dog;      // false
\`\`\``,
    `class Animal {\n  constructor(name, sound) {\n\n  }\n\n  speak() {\n\n  }\n\n  describe() {\n\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, "Woof");\n  }\n\n  fetch(item) {\n\n  }\n}\n\nclass Cat extends Animal {\n  constructor(name) {\n    super(name, "Meow");\n  }\n\n  purr() {\n\n  }\n}`,
    `class Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n\n  speak() {\n    return this.name + " says " + this.sound + "!";\n  }\n\n  describe() {\n    return "I am " + this.name + ", an animal.";\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, "Woof");\n  }\n\n  fetch(item) {\n    return this.name + " fetches the " + item + "!";\n  }\n}\n\nclass Cat extends Animal {\n  constructor(name) {\n    super(name, "Meow");\n  }\n\n  purr() {\n    return "Purrrrrr...";\n  }\n}`,
    `(code) => { const { Animal, Dog, Cat } = new Function(code + "; return { Animal, Dog, Cat };")(); const dog = new Dog("Rex"); const cat = new Cat("Whiskers"); const generic = new Animal("Bob", "Moo"); return [ { pass: dog instanceof Animal, description: 'Dog instance is also an Animal (inheritance chain)', got: dog instanceof Animal }, { pass: dog instanceof Dog, description: 'Dog instance is a Dog', got: dog instanceof Dog }, { pass: dog.speak() === "Rex says Woof!", description: 'dog.speak() → "Rex says Woof!"', got: dog.speak() }, { pass: dog.fetch("ball") === "Rex fetches the ball!", description: 'dog.fetch("ball") → "Rex fetches the ball!"', got: dog.fetch("ball") }, { pass: cat.speak() === "Whiskers says Meow!", description: 'cat.speak() → "Whiskers says Meow!"', got: cat.speak() }, { pass: cat.purr() === "Purrrrrr...", description: 'cat.purr() → "Purrrrrr..."', got: cat.purr() }, { pass: cat instanceof Animal, description: 'Cat is also an Animal', got: cat instanceof Animal }, { pass: !(cat instanceof Dog), description: 'Cat is NOT a Dog', got: cat instanceof Dog }, { pass: generic.speak() === "Bob says Moo!", description: 'Animal base class works independently', got: generic.speak() }, { pass: typeof cat.fetch === "undefined", description: 'Cat does not have fetch() method', got: typeof cat.fetch }, ]; }`,
    '`extends` creates the inheritance relationship. `super()` in the constructor calls the parent\'s constructor — it MUST be called before you access `this`. Dog and Cat inherit `speak()` and `describe()` from Animal automatically.'
  ),

  cls(
    'Inheritance: Vehicle → Car & Truck',
    'inheritance',
    ['class', 'extends', 'super', 'override', 'inheritance', 'oop'],
    3,
    'Create a Vehicle base class and Car and Truck subclasses with their own properties.',
    `Create three classes:

**\`Vehicle\`** (base class)
  - Constructor accepts \`make\`, \`model\`, \`year\`
  - \`describe()\` — returns \`"[year] [make] [model]"\`
  - \`age()\` — returns how old the vehicle is (2025 - year). Use 2025 as the current year.

**\`Car\` extends Vehicle**
  - Constructor accepts \`make\`, \`model\`, \`year\`, \`numDoors\` (default 4)
  - \`honk()\` — returns \`"Beep beep!"\`
  - \`describe()\` — overrides parent, returns \`"[year] [make] [model] ([numDoors]-door)"\`

**\`Truck\` extends Vehicle**
  - Constructor accepts \`make\`, \`model\`, \`year\`, \`payloadTons\`
  - \`haul(cargo)\` — returns \`"Hauling [cargo] in the [make] [model]"\`

Examples:
\`\`\`js
const car = new Car("Toyota", "Camry", 2020);
const truck = new Truck("Ford", "F-150", 2019, 1.5);
const coupe = new Car("Honda", "Civic", 2022, 2);

car.describe();     // "2020 Toyota Camry (4-door)"
car.honk();         // "Beep beep!"
car.age();          // 5
truck.haul("lumber"); // "Hauling lumber in the Ford F-150"
truck instanceof Vehicle; // true
coupe.describe();   // "2022 Honda Civic (2-door)"
\`\`\``,
    `class Vehicle {\n  constructor(make, model, year) {\n\n  }\n\n  describe() {\n\n  }\n\n  age() {\n\n  }\n}\n\nclass Car extends Vehicle {\n  constructor(make, model, year, numDoors = 4) {\n    super(make, model, year);\n\n  }\n\n  honk() {\n\n  }\n\n  describe() {\n    // Override the parent describe()\n\n  }\n}\n\nclass Truck extends Vehicle {\n  constructor(make, model, year, payloadTons) {\n    super(make, model, year);\n\n  }\n\n  haul(cargo) {\n\n  }\n}`,
    `class Vehicle {\n  constructor(make, model, year) {\n    this.make = make;\n    this.model = model;\n    this.year = year;\n  }\n\n  describe() {\n    return this.year + " " + this.make + " " + this.model;\n  }\n\n  age() {\n    return 2025 - this.year;\n  }\n}\n\nclass Car extends Vehicle {\n  constructor(make, model, year, numDoors = 4) {\n    super(make, model, year);\n    this.numDoors = numDoors;\n  }\n\n  honk() {\n    return "Beep beep!";\n  }\n\n  describe() {\n    return this.year + " " + this.make + " " + this.model + " (" + this.numDoors + "-door)";\n  }\n}\n\nclass Truck extends Vehicle {\n  constructor(make, model, year, payloadTons) {\n    super(make, model, year);\n    this.payloadTons = payloadTons;\n  }\n\n  haul(cargo) {\n    return "Hauling " + cargo + " in the " + this.make + " " + this.model;\n  }\n}`,
    `(code) => { const { Vehicle, Car, Truck } = new Function(code + "; return { Vehicle, Car, Truck };")(); const car = new Car("Toyota", "Camry", 2020); const coupe = new Car("Honda", "Civic", 2022, 2); const truck = new Truck("Ford", "F-150", 2019, 1.5); return [ { pass: car.describe() === "2020 Toyota Camry (4-door)", description: 'Car.describe() uses overridden version', got: car.describe() }, { pass: coupe.describe() === "2022 Honda Civic (2-door)", description: 'Car with 2 doors describes correctly', got: coupe.describe() }, { pass: car.honk() === "Beep beep!", description: 'car.honk() → "Beep beep!"', got: car.honk() }, { pass: car.age() === 5, description: 'car.age() → 5 (inherited from Vehicle)', got: car.age() }, { pass: truck instanceof Vehicle, description: 'Truck is a Vehicle', got: truck instanceof Vehicle }, { pass: truck.haul("lumber") === "Hauling lumber in the Ford F-150", description: 'truck.haul() correct', got: truck.haul("lumber") }, { pass: truck.age() === 6, description: 'truck.age() → 6 (inherited)', got: truck.age() }, { pass: new Car("X","Y",2020).numDoors === 4, description: 'Car default numDoors is 4', got: new Car("X","Y",2020).numDoors }, ]; }`,
    'When a subclass *overrides* a method (Car has its own `describe()`), the subclass version runs instead of the parent\'s. The parent version is still accessible via `super.describe()` if you need it. Subclasses get all inherited methods for free — Truck automatically has `age()` from Vehicle.'
  ),

  cls(
    'Inheritance: Shape → Circle & Rectangle',
    'inheritance',
    ['class', 'extends', 'polymorphism', 'override', 'inheritance', 'oop'],
    3,
    'Practice polymorphism: different shapes implement the same getArea() interface differently.',
    `This exercise introduces **polymorphism** — different classes that share the same method names but implement them differently.

**\`Shape\`** (base class)
  - Constructor accepts \`color\` (default \`"black"\`)
  - \`getArea()\` — returns \`0\` (subclasses should override this)
  - \`describe()\` — returns \`"A [color] shape with area [getArea()]."\`

**\`Circle\` extends Shape**
  - Constructor accepts \`radius\`, \`color\` (default \`"black"\`)
  - \`getArea()\` — returns \`Math.PI * radius * radius\` (no rounding needed)
  - \`getCircumference()\` — returns \`2 * Math.PI * radius\`

**\`Rectangle\` extends Shape**
  - Constructor accepts \`width\`, \`height\`, \`color\`
  - \`getArea()\` — returns \`width * height\`
  - \`getPerimeter()\` — returns \`2 * (width + height)\`

Examples:
\`\`\`js
const c = new Circle(5);
const r = new Rectangle(4, 6, "blue");

c.getArea();          // ~78.54 (Math.PI * 25)
c instanceof Shape;   // true
r.getArea();          // 24
r.getPerimeter();     // 20
r.describe();         // "A blue shape with area 24."
\`\`\``,
    `class Shape {\n  constructor(color = "black") {\n\n  }\n\n  getArea() {\n    return 0;\n  }\n\n  describe() {\n\n  }\n}\n\nclass Circle extends Shape {\n  constructor(radius, color = "black") {\n    super(color);\n\n  }\n\n  getArea() {\n\n  }\n\n  getCircumference() {\n\n  }\n}\n\nclass Rectangle extends Shape {\n  constructor(width, height, color = "black") {\n    super(color);\n\n  }\n\n  getArea() {\n\n  }\n\n  getPerimeter() {\n\n  }\n}`,
    `class Shape {\n  constructor(color = "black") {\n    this.color = color;\n  }\n\n  getArea() {\n    return 0;\n  }\n\n  describe() {\n    return "A " + this.color + " shape with area " + this.getArea() + ".";\n  }\n}\n\nclass Circle extends Shape {\n  constructor(radius, color = "black") {\n    super(color);\n    this.radius = radius;\n  }\n\n  getArea() {\n    return Math.PI * this.radius * this.radius;\n  }\n\n  getCircumference() {\n    return 2 * Math.PI * this.radius;\n  }\n}\n\nclass Rectangle extends Shape {\n  constructor(width, height, color = "black") {\n    super(color);\n    this.width = width;\n    this.height = height;\n  }\n\n  getArea() {\n    return this.width * this.height;\n  }\n\n  getPerimeter() {\n    return 2 * (this.width + this.height);\n  }\n}`,
    `(code) => { const { Shape, Circle, Rectangle } = new Function(code + "; return { Shape, Circle, Rectangle };")(); const c = new Circle(5); const r = new Rectangle(4, 6, "blue"); const s = new Shape("red"); return [ { pass: c instanceof Shape, description: 'Circle is a Shape', got: c instanceof Shape }, { pass: Math.abs(c.getArea() - Math.PI * 25) < 0.001, description: 'Circle.getArea() ≈ 78.54', got: c.getArea() }, { pass: Math.abs(c.getCircumference() - 2 * Math.PI * 5) < 0.001, description: 'Circle.getCircumference() correct', got: c.getCircumference() }, { pass: r instanceof Shape, description: 'Rectangle is a Shape', got: r instanceof Shape }, { pass: r.getArea() === 24, description: 'Rectangle.getArea() → 24', got: r.getArea() }, { pass: r.getPerimeter() === 20, description: 'Rectangle.getPerimeter() → 20', got: r.getPerimeter() }, { pass: r.describe() === "A blue shape with area 24.", description: 'r.describe() uses overridden getArea()', got: r.describe() }, { pass: s.getArea() === 0, description: 'base Shape.getArea() → 0', got: s.getArea() }, ]; }`,
    '`describe()` in the base Shape calls `this.getArea()` — but when called on a Rectangle instance, JavaScript looks up `getArea()` on the Rectangle first. This is *polymorphism*: the same method call (`getArea()`) does different things depending on which object runs it.'
  ),

  cls(
    'Inheritance: Person → Student',
    'inheritance',
    ['class', 'extends', 'super', 'array', 'computed', 'inheritance', 'oop'],
    3,
    'Extend a Person class into a Student class with courses and GPA computation.',
    `**\`Person\`** (base class)
  - Constructor accepts \`name\` and \`age\`
  - \`greet()\` — returns \`"Hi, I'm [name] and I'm [age] years old."\`
  - \`birthday()\` — increments age by 1, returns the new age

**\`Student\` extends Person**
  - Constructor accepts \`name\`, \`age\`, \`studentId\`
  - Initializes \`this.courses\` as an empty array (each course: \`{ name, grade }\`)
  - \`addCourse(name, grade)\` — adds a course object to courses
  - \`getGPA()\` — returns the average grade rounded to 2 decimal places. Returns \`0\` if no courses
  - \`isHonorRoll()\` — returns \`true\` if GPA is 90 or above
  - \`greet()\` — overrides parent: returns \`"Hi, I'm [name] and I'm a student (ID: [studentId])."\`

Examples:
\`\`\`js
const s = new Student("Alice", 20, "S001");
s.greet();           // "Hi, I'm Alice and I'm a student (ID: S001)."
s.birthday();        // 21
s.addCourse("Math", 95);
s.addCourse("History", 87);
s.addCourse("CS", 92);
s.getGPA();          // 91.33
s.isHonorRoll();     // true
s instanceof Person; // true
\`\`\``,
    `class Person {\n  constructor(name, age) {\n\n  }\n\n  greet() {\n\n  }\n\n  birthday() {\n\n  }\n}\n\nclass Student extends Person {\n  constructor(name, age, studentId) {\n    super(name, age);\n\n  }\n\n  addCourse(name, grade) {\n\n  }\n\n  getGPA() {\n\n  }\n\n  isHonorRoll() {\n\n  }\n\n  greet() {\n    // Override Person's greet()\n\n  }\n}`,
    `class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    return "Hi, I'm " + this.name + " and I'm " + this.age + " years old.";\n  }\n\n  birthday() {\n    this.age++;\n    return this.age;\n  }\n}\n\nclass Student extends Person {\n  constructor(name, age, studentId) {\n    super(name, age);\n    this.studentId = studentId;\n    this.courses = [];\n  }\n\n  addCourse(name, grade) {\n    this.courses.push({ name, grade });\n  }\n\n  getGPA() {\n    if (this.courses.length === 0) return 0;\n    const sum = this.courses.reduce((acc, c) => acc + c.grade, 0);\n    return Math.round((sum / this.courses.length) * 100) / 100;\n  }\n\n  isHonorRoll() {\n    return this.getGPA() >= 90;\n  }\n\n  greet() {\n    return "Hi, I'm " + this.name + " and I'm a student (ID: " + this.studentId + ").";\n  }\n}`,
    `(code) => { const { Person, Student } = new Function(code + "; return { Person, Student };")(); const p = new Person("Bob", 30); const s = new Student("Alice", 20, "S001"); s.addCourse("Math", 95); s.addCourse("History", 87); s.addCourse("CS", 92); return [ { pass: s instanceof Person, description: 'Student instanceof Person → true', got: s instanceof Person }, { pass: s.greet() === "Hi, I'm Alice and I'm a student (ID: S001).", description: 'Student.greet() uses overridden version', got: s.greet() }, { pass: p.greet() === "Hi, I'm Bob and I'm 30 years old.", description: 'Person.greet() still works normally', got: p.greet() }, { pass: s.birthday() === 21, description: 'birthday() (inherited) → 21', got: s.birthday() }, { pass: s.age === 21, description: 'age incremented after birthday()', got: s.age }, { pass: s.getGPA() === 91.33, description: 'getGPA() → 91.33', got: s.getGPA() }, { pass: s.isHonorRoll() === true, description: 'isHonorRoll() → true at 91.33', got: s.isHonorRoll() }, { pass: new Student("X", 18, "S002").getGPA() === 0, description: 'getGPA() → 0 with no courses', got: new Student("X", 18, "S002").getGPA() }, ]; }`,
    'Student has its own `greet()` which *shadows* Person\'s version. But Student still inherits `birthday()` without writing any code for it. `super(name, age)` is required in the Student constructor to initialize the name and age that `birthday()` and the inherited properties depend on.'
  ),

  cls(
    'Inheritance: Employee → Manager',
    'inheritance',
    ['class', 'extends', 'super', 'array', 'inter-instance', 'inheritance', 'oop'],
    3,
    'Extend an Employee class into a Manager who can manage a team of other employees.',
    `**\`Employee\`** (base class)
  - Constructor accepts \`name\`, \`role\`, \`salary\`
  - \`getInfo()\` — returns \`"[name] — [role] ($[salary])"\`
  - \`getRaise(amount)\` — increases salary by amount, returns the new salary

**\`Manager\` extends Employee**
  - Constructor accepts \`name\`, \`salary\` (role is always \`"Manager"\`)
  - Initializes \`this.reports\` as an empty array
  - \`addReport(employee)\` — adds an Employee (or Manager) instance to reports
  - \`getTeamSize()\` — returns the number of direct reports
  - \`getTeamPayroll()\` — returns the total salary of all direct reports (not including the manager)
  - \`listTeam()\` — returns an array of report names

Examples:
\`\`\`js
const alice = new Employee("Alice", "Engineer", 90000);
const bob   = new Employee("Bob", "Designer", 85000);
const mgr   = new Manager("Carol", 120000);

mgr.addReport(alice);
mgr.addReport(bob);
mgr.getTeamSize();      // 2
mgr.getTeamPayroll();   // 175000
mgr.listTeam();         // ["Alice", "Bob"]
mgr.getInfo();          // "Carol — Manager ($120000)"
alice.getRaise(5000);   // 95000
mgr instanceof Employee; // true
\`\`\``,
    `class Employee {\n  constructor(name, role, salary) {\n\n  }\n\n  getInfo() {\n\n  }\n\n  getRaise(amount) {\n\n  }\n}\n\nclass Manager extends Employee {\n  constructor(name, salary) {\n    super(name, "Manager", salary);\n\n  }\n\n  addReport(employee) {\n\n  }\n\n  getTeamSize() {\n\n  }\n\n  getTeamPayroll() {\n\n  }\n\n  listTeam() {\n\n  }\n}`,
    `class Employee {\n  constructor(name, role, salary) {\n    this.name = name;\n    this.role = role;\n    this.salary = salary;\n  }\n\n  getInfo() {\n    return this.name + " \u2014 " + this.role + " ($" + this.salary + ")";\n  }\n\n  getRaise(amount) {\n    this.salary += amount;\n    return this.salary;\n  }\n}\n\nclass Manager extends Employee {\n  constructor(name, salary) {\n    super(name, "Manager", salary);\n    this.reports = [];\n  }\n\n  addReport(employee) {\n    this.reports.push(employee);\n  }\n\n  getTeamSize() {\n    return this.reports.length;\n  }\n\n  getTeamPayroll() {\n    return this.reports.reduce((acc, emp) => acc + emp.salary, 0);\n  }\n\n  listTeam() {\n    return this.reports.map(emp => emp.name);\n  }\n}`,
    `(code) => { const { Employee, Manager } = new Function(code + "; return { Employee, Manager };")(); const alice = new Employee("Alice", "Engineer", 90000); const bob = new Employee("Bob", "Designer", 85000); const mgr = new Manager("Carol", 120000); mgr.addReport(alice); mgr.addReport(bob); const team = mgr.listTeam(); const payroll = mgr.getTeamPayroll(); return [ { pass: mgr instanceof Employee, description: 'Manager instanceof Employee → true', got: mgr instanceof Employee }, { pass: mgr.role === "Manager", description: 'Manager.role is always "Manager"', got: mgr.role }, { pass: mgr.getTeamSize() === 2, description: 'getTeamSize() → 2', got: mgr.getTeamSize() }, { pass: payroll === 175000, description: 'getTeamPayroll() → 175000', got: payroll }, { pass: JSON.stringify(team) === JSON.stringify(["Alice","Bob"]), description: 'listTeam() → ["Alice","Bob"]', got: JSON.stringify(team) }, { pass: mgr.getInfo().includes("Carol") && mgr.getInfo().includes("Manager"), description: 'Manager.getInfo() shows name and role', got: mgr.getInfo() }, { pass: alice.getRaise(5000) === 95000, description: 'Employee.getRaise() works', got: alice.getRaise(5000) }, ]; }`,
    '`getTeamPayroll()` uses `.reduce()` on the reports array, accessing `emp.salary` on each employee instance. `listTeam()` uses `.map()` on instances to extract names. The Manager stores references to actual Employee objects — it can access all their properties and methods.'
  ),

  cls(
    'Advanced OOP: EventEmitter',
    'inheritance',
    ['class', 'events', 'callbacks', 'advanced', 'oop', 'node-pattern'],
    4,
    'Implement a simplified EventEmitter class — the pattern behind Node.js and browser events.',
    `The **EventEmitter** pattern is the backbone of Node.js, browser DOM events, and many JavaScript frameworks. An emitter lets you register listeners for named events and trigger (emit) them later.

Create an \`EventEmitter\` class with the following:

**Constructor:**
  - No parameters
  - Initializes \`this.events\` as an empty object (keys are event names, values are arrays of listener functions)

**Methods:**
  - \`on(eventName, listener)\` — registers a listener function for the event. If the event doesn't exist yet, create it
  - \`emit(eventName, ...args)\` — calls all listeners registered for the event, passing \`...args\` to each. Returns \`true\` if the event had listeners, \`false\` if not
  - \`off(eventName, listener)\` — removes a specific listener from the event
  - \`listenerCount(eventName)\` — returns the number of listeners for an event

Examples:
\`\`\`js
const emitter = new EventEmitter();
const greet = (name) => "Hello " + name;

emitter.on("greet", (name) => console.log("Hello, " + name));
emitter.emit("greet", "Alice");  // triggers the listener
emitter.listenerCount("greet");  // 1
emitter.off("greet", greet);
emitter.emit("unknownEvent");    // false (no listeners)
\`\`\``,
    `class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n\n  on(eventName, listener) {\n\n  }\n\n  emit(eventName, ...args) {\n\n  }\n\n  off(eventName, listener) {\n\n  }\n\n  listenerCount(eventName) {\n\n  }\n}`,
    `class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n\n  on(eventName, listener) {\n    if (!this.events[eventName]) this.events[eventName] = [];\n    this.events[eventName].push(listener);\n  }\n\n  emit(eventName, ...args) {\n    if (!this.events[eventName] || this.events[eventName].length === 0) return false;\n    this.events[eventName].forEach(listener => listener(...args));\n    return true;\n  }\n\n  off(eventName, listener) {\n    if (!this.events[eventName]) return;\n    this.events[eventName] = this.events[eventName].filter(l => l !== listener);\n  }\n\n  listenerCount(eventName) {\n    if (!this.events[eventName]) return 0;\n    return this.events[eventName].length;\n  }\n}`,
    `(code) => { const EventEmitter = new Function(code + "; return EventEmitter;")(); const emitter = new EventEmitter(); const results = []; const listener1 = (x) => results.push("listener1:" + x); const listener2 = (x) => results.push("listener2:" + x); emitter.on("data", listener1); emitter.on("data", listener2); const hadListeners = emitter.emit("data", "hello"); const noListeners = emitter.emit("unknown"); const count = emitter.listenerCount("data"); emitter.off("data", listener1); emitter.emit("data", "world"); return [ { pass: results[0] === "listener1:hello", description: 'emit() calls listener1 with arg', got: results[0] }, { pass: results[1] === "listener2:hello", description: 'emit() calls all listeners', got: results[1] }, { pass: hadListeners === true, description: 'emit() returns true when listeners exist', got: hadListeners }, { pass: noListeners === false, description: 'emit() returns false for unknown event', got: noListeners }, { pass: count === 2, description: 'listenerCount("data") → 2', got: count }, { pass: emitter.listenerCount("data") === 1, description: 'listenerCount → 1 after off()', got: emitter.listenerCount("data") }, { pass: results[2] === "listener2:world", description: 'after off(), only remaining listener fires', got: results[2] }, ]; }`,
    '`this.events` is an object where each key is an event name and the value is an array of functions. `emit()` loops through that array and calls each function. `off()` uses `.filter()` to remove a specific function reference — only the exact same function object will match (reference equality).'
  ),

];

// ─────────────────────────────────────────────────────────────────────────────
// WRITE TO FILE
// ─────────────────────────────────────────────────────────────────────────────

const allNew = [...realWorld, ...inheritance];
data.exercises.push(...allNew);

const realWorldIds = realWorld.map(e => e.id);
const inheritanceIds = inheritance.map(e => e.id);

data.collections.push({
  id: 'real-world-classes',
  name: '🏗️ Real World Classes',
  description: 'Eight practical class exercises — ShoppingCart, TodoList, Gradebook, Playlist, VendingMachine, Library, Timer, and Garage. Each one mirrors a real-world object with meaningful state and constraints.',
  exerciseIds: realWorldIds,
  color: '#f59e0b',
});

data.collections.push({
  id: 'inheritance-oop',
  name: '🧬 Inheritance & OOP Patterns',
  description: 'Six exercises covering extends, super, method overriding, polymorphism, and the EventEmitter pattern — the full inheritance toolkit used in professional JavaScript.',
  exerciseIds: inheritanceIds,
  color: '#f87171',
});

// Master OOP collection spanning all four sections
const allIntroIds   = data.exercises.filter(e => JSON.stringify(e.category) === JSON.stringify(['classes','oop','intro'])).map(e => e.id);
const allCreatureIds = data.exercises.filter(e => JSON.stringify(e.category) === JSON.stringify(['classes','oop','mythical-creatures'])).map(e => e.id);

data.collections.push({
  id: 'oop-complete',
  name: '⚙️ OOP Complete Track',
  description: 'The full 30-exercise object-oriented programming arc: from basic class syntax through Turing-style mythical creatures, real-world applications, and professional inheritance patterns.',
  exerciseIds: [...allIntroIds, ...allCreatureIds, ...realWorldIds, ...inheritanceIds],
  color: '#8b5cf6',
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');

const allClasses = data.exercises.filter(e => e.category[0] === 'classes');
console.log(`✓ Part B: added ${allNew.length} exercises (IDs ${allNew[0].id}–${allNew[allNew.length - 1].id})`);
console.log(`  - ${realWorld.length} Real World Classes`);
console.log(`  - ${inheritance.length} Inheritance exercises`);
console.log(`\n✓ Total class exercises: ${allClasses.length}`);
console.log(`  Breakdown:`);
['intro','mythical-creatures','real-world','inheritance'].forEach(sub => {
  const n = allClasses.filter(e => e.category[2] === sub).length;
  console.log(`    ${sub}: ${n}`);
});
console.log(`\n✓ Total exercises across all tiers: ${data.exercises.length}`);
console.log(`\n✓ Collections added:`);
['classes-intro','mythical-creatures','real-world-classes','inheritance-oop','oop-complete'].forEach(id => {
  const c = data.collections.find(c => c.id === id);
  if (c) console.log(`    ${c.name} (${c.exerciseIds.length} exercises)`);
});
