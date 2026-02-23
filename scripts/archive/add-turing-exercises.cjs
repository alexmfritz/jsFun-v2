/**
 * Add Turing-sourced exercises from three repos:
 *   1. turingschool-examples/javascript-foundations — function/object composition exercises
 *   2. alexmfritz/jsFun — scope & context exercises
 *   3. turingschool-examples/jsFunk — prototype/dataset exercises
 *
 * Also fixes:
 *   - Emoji prefixes still in exercise titles 218-230
 *   - null tags in exercise 195
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── 1. Fix emoji prefixes in titles 218-230 ────────────────────────────────

const emojiPattern = /^[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}\u{1F900}-\u{1F9FF}\u{2702}-\u{27B0}✈️📚🌮🎵✂️🐉🍜📼🏫🧶🧖⚔️🎧]+\s*/u;

let emojiFixCount = 0;
for (const ex of data.exercises) {
  if (ex.id >= 218 && ex.id <= 230) {
    const cleaned = ex.title.replace(emojiPattern, '').trim();
    if (cleaned !== ex.title) {
      console.log(`  Fixed title ${ex.id}: "${ex.title}" → "${cleaned}"`);
      ex.title = cleaned;
      emojiFixCount++;
    }
  }
}

// ─── 2. Fix null tags ─────────────────────────────────────────────────────────

let nullTagFixes = 0;
for (const ex of data.exercises) {
  const before = ex.tags.length;
  ex.tags = ex.tags.filter(t => t != null && t !== '');
  if (ex.tags.length !== before) {
    nullTagFixes++;
    console.log(`  Removed null/empty tags from exercise ${ex.id}`);
  }
}

// ─── 3. New exercises from javascript-foundations ──────────────────────────────

const newExercises = [
  // ── Birthdays (functions + objects) ──────────────────────────────────────
  {
    id: 266,
    title: 'Birthdays',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'strings', 'arrays', 'counting'],
    description: 'Create birthday objects, format celebration messages, and count birthdays by month.',
    instructions: `Write three functions:\n\n**createBirthday(name, month, day)** — returns an object with \`name\`, \`month\`, and \`day\` properties.\n\`\`\`js\ncreateBirthday('Leah', 2, 10)\n// { name: 'Leah', month: 2, day: 10 }\n\`\`\`\n\n**celebrateBirthday(birthday)** — takes a birthday object and returns a formatted string.\n\`\`\`js\ncelebrateBirthday({ name: 'Alex', month: 5, day: 19 })\n// "Today is 5/19! Happy birthday, Alex!"\n\`\`\`\n\n**countBirthdays(birthdays, month)** — takes an array of birthday objects and a month number, returns the count of birthdays in that month.\n\`\`\`js\nconst bdays = [\n  { name: 'Leah', month: 2, day: 10 },\n  { name: 'Alex', month: 5, day: 19 },\n  { name: 'Noah', month: 2, day: 28 },\n  { name: 'Heather', month: 6, day: 29 },\n];\ncountBirthdays(bdays, 2); // 2\ncountBirthdays(bdays, 5); // 1\ncountBirthdays(bdays, 12); // 0\n\`\`\``,
    starterCode: `function createBirthday(name, month, day) {\n  // your code here\n}\n\nfunction celebrateBirthday(birthday) {\n  // your code here\n}\n\nfunction countBirthdays(birthdays, month) {\n  // your code here\n}`,
    solution: `function createBirthday(name, month, day) {\n  return { name, month, day };\n}\n\nfunction celebrateBirthday(birthday) {\n  return \`Today is \${birthday.month}/\${birthday.day}! Happy birthday, \${birthday.name}!\`;\n}\n\nfunction countBirthdays(birthdays, month) {\n  return birthdays.filter(b => b.month === month).length;\n}`,
    testRunner: `(code) => {
  const { createBirthday, celebrateBirthday, countBirthdays } = new Function(code + '; return { createBirthday, celebrateBirthday, countBirthdays };')();

  const leah = createBirthday('Leah', 2, 10);
  const christy = createBirthday('Christy', 3, 8);
  const bdays = [
    createBirthday('Leah', 2, 10),
    createBirthday('Alex', 5, 19),
    createBirthday('Noah', 2, 28),
    createBirthday('Heather', 6, 29),
  ];

  return [
    { pass: leah.name === 'Leah', description: 'createBirthday sets name', got: leah.name },
    { pass: leah.month === 2 && leah.day === 10, description: 'createBirthday sets month and day', got: leah.month + '/' + leah.day },
    { pass: christy.name === 'Christy' && christy.month === 3, description: 'createBirthday works for different inputs', got: christy.name },
    { pass: celebrateBirthday({ name: 'Alex', month: 5, day: 19 }) === 'Today is 5/19! Happy birthday, Alex!', description: 'celebrateBirthday formats correctly', got: celebrateBirthday({ name: 'Alex', month: 5, day: 19 }) },
    { pass: celebrateBirthday({ name: 'Heather', month: 6, day: 29 }) === 'Today is 6/29! Happy birthday, Heather!', description: 'celebrateBirthday works for different inputs', got: celebrateBirthday({ name: 'Heather', month: 6, day: 29 }) },
    { pass: countBirthdays(bdays, 2) === 2, description: 'countBirthdays returns 2 for February', got: countBirthdays(bdays, 2) },
    { pass: countBirthdays(bdays, 5) === 1, description: 'countBirthdays returns 1 for May', got: countBirthdays(bdays, 5) },
    { pass: countBirthdays(bdays, 12) === 0, description: 'countBirthdays returns 0 for December', got: countBirthdays(bdays, 12) },
  ];
}`,
    hint: 'createBirthday is a factory function that returns a plain object. celebrateBirthday uses template literals. countBirthdays uses .filter() then .length.',
    resources: [{ label: 'MDN: Template Literals', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals' }],
  },

  // ── Calendar (validation + filtering) ───────────────────────────────────
  {
    id: 267,
    title: 'Calendar',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'arrays', 'conditionals', 'filter'],
    description: 'Build a calendar system with event creation, validation, and monthly filtering.',
    instructions: `Write three functions:\n\n**createEvent(title, month, day)** — returns an event object. If day < 1 or day > 31, return the string \`"Error: [day] is not a valid day"\`.\n\`\`\`js\ncreateEvent('Dinner', 'July', 15)\n// { title: 'Dinner', month: 'July', day: 15 }\ncreateEvent('Party', 'June', 35)\n// "Error: 35 is not a valid day"\n\`\`\`\n\n**createCalendar(owner, events)** — returns a calendar object with owner and events array.\n\`\`\`js\ncreateCalendar('Amy', [event1, event2])\n// { owner: 'Amy', events: [event1, event2] }\n\`\`\`\n\n**reportMonthlyEvents(calendar, month)** — returns only the events matching the given month.\n\`\`\`js\nreportMonthlyEvents(cal, 'July')\n// [{ title: 'Dinner', month: 'July', day: 15 }, ...]\n\`\`\``,
    starterCode: `function createEvent(title, month, day) {\n  // your code here\n}\n\nfunction createCalendar(owner, events) {\n  // your code here\n}\n\nfunction reportMonthlyEvents(calendar, month) {\n  // your code here\n}`,
    solution: `function createEvent(title, month, day) {\n  if (day < 1 || day > 31) {\n    return \`Error: \${day} is not a valid day\`;\n  }\n  return { title, month, day };\n}\n\nfunction createCalendar(owner, events) {\n  return { owner, events };\n}\n\nfunction reportMonthlyEvents(calendar, month) {\n  return calendar.events.filter(e => e.month === month);\n}`,
    testRunner: `(code) => {
  const { createEvent, createCalendar, reportMonthlyEvents } = new Function(code + '; return { createEvent, createCalendar, reportMonthlyEvents };')();

  const e1 = createEvent('Dinner', 'July', 15);
  const e2 = createEvent('Meeting', 'July', 22);
  const e3 = createEvent('Party', 'August', 5);
  const bad1 = createEvent('Bad', 'June', 35);
  const bad2 = createEvent('Bad', 'June', 0);
  const cal = createCalendar('Amy', [e1, e2, e3]);
  const julyEvents = reportMonthlyEvents(cal, 'July');

  return [
    { pass: e1.title === 'Dinner' && e1.month === 'July' && e1.day === 15, description: 'createEvent returns correct object', got: JSON.stringify(e1) },
    { pass: bad1 === 'Error: 35 is not a valid day', description: 'createEvent rejects day > 31', got: bad1 },
    { pass: bad2 === 'Error: 0 is not a valid day', description: 'createEvent rejects day < 1', got: bad2 },
    { pass: cal.owner === 'Amy', description: 'createCalendar sets owner', got: cal.owner },
    { pass: cal.events.length === 3, description: 'createCalendar stores events array', got: cal.events.length },
    { pass: julyEvents.length === 2, description: 'reportMonthlyEvents returns 2 July events', got: julyEvents.length },
    { pass: julyEvents.every(e => e.month === 'July'), description: 'reportMonthlyEvents only returns matching month', got: julyEvents.map(e => e.month).join(', ') },
  ];
}`,
    hint: 'createEvent needs a guard clause checking day validity before returning the object. reportMonthlyEvents uses .filter() on the calendar\'s events array.',
    resources: [{ label: 'MDN: Array.prototype.filter()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter' }],
  },

  // ── Elevator (state management) ─────────────────────────────────────────
  {
    id: 268,
    title: 'Elevator',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'state', 'conditionals', 'arrays'],
    description: 'Build an elevator system with floor navigation, validation, and passenger management.',
    instructions: `Write three functions:\n\n**createElevator(building, totalFloors, currentFloor, passengers)** — returns an elevator object.\n\`\`\`js\ncreateElevator('Hilton', 10, 2, ['Scott', 'Mark'])\n// { building: 'Hilton', totalFloors: 10, currentFloor: 2, passengers: ['Scott', 'Mark'] }\n\`\`\`\n\n**changeFloors(elevator, newFloor)** — returns a message:\n- If newFloor === currentFloor: \`"You're already on floor [n]!"\`\n- If newFloor > totalFloors: \`"Floor [n] does not exist!"\`\n- Otherwise: \`"Taking you to floor [n]!"\` and update currentFloor.\n\`\`\`js\nchangeFloors(elev, 10)  // "Taking you to floor 10!"\nchangeFloors(elev, 10)  // "You're already on floor 10!"\nchangeFloors(elev, 100) // "Floor 100 does not exist!"\n\`\`\`\n\n**dropOffPassenger(elevator, name)** — removes the named passenger from the array.\n\`\`\`js\ndropOffPassenger(elev, 'Mark')\nelev.passengers // ['Scott', 'Joey']\n\`\`\``,
    starterCode: `function createElevator(building, totalFloors, currentFloor, passengers) {\n  // your code here\n}\n\nfunction changeFloors(elevator, newFloor) {\n  // your code here\n}\n\nfunction dropOffPassenger(elevator, name) {\n  // your code here\n}`,
    solution: `function createElevator(building, totalFloors, currentFloor, passengers) {\n  return { building, totalFloors, currentFloor, passengers };\n}\n\nfunction changeFloors(elevator, newFloor) {\n  if (newFloor === elevator.currentFloor) {\n    return \`You're already on floor \${newFloor}!\`;\n  }\n  if (newFloor > elevator.totalFloors) {\n    return \`Floor \${newFloor} does not exist!\`;\n  }\n  elevator.currentFloor = newFloor;\n  return \`Taking you to floor \${newFloor}!\`;\n}\n\nfunction dropOffPassenger(elevator, name) {\n  elevator.passengers = elevator.passengers.filter(p => p !== name);\n}`,
    testRunner: `(code) => {
  const { createElevator, changeFloors, dropOffPassenger } = new Function(code + '; return { createElevator, changeFloors, dropOffPassenger };')();

  const elev = createElevator('Hilton', 10, 2, ['Scott', 'Mark', 'Joey']);

  return [
    { pass: elev.building === 'Hilton', description: 'createElevator sets building name', got: elev.building },
    { pass: elev.totalFloors === 10 && elev.currentFloor === 2, description: 'createElevator sets floors correctly', got: elev.currentFloor + '/' + elev.totalFloors },
    { pass: elev.passengers.length === 3, description: 'createElevator stores passengers', got: elev.passengers.length },
    { pass: changeFloors(elev, 10) === 'Taking you to floor 10!', description: 'changeFloors moves to valid floor', got: changeFloors(createElevator('X', 10, 2, []), 10) },
    { pass: (() => { const e = createElevator('X', 3, 2, []); return changeFloors(e, 2); })() === "You're already on floor 2!", description: 'changeFloors rejects same floor', got: (() => { const e = createElevator('X', 3, 2, []); return changeFloors(e, 2); })() },
    { pass: (() => { const e = createElevator('X', 3, 1, []); return changeFloors(e, 100); })() === 'Floor 100 does not exist!', description: 'changeFloors rejects invalid floor', got: (() => { const e = createElevator('X', 3, 1, []); return changeFloors(e, 100); })() },
    { pass: (() => { const e = createElevator('X', 10, 1, ['Scott', 'Mark', 'Joey']); dropOffPassenger(e, 'Mark'); return e.passengers.length === 2 && !e.passengers.includes('Mark'); })(), description: 'dropOffPassenger removes passenger', got: (() => { const e = createElevator('X', 10, 1, ['Scott', 'Mark', 'Joey']); dropOffPassenger(e, 'Mark'); return e.passengers.join(', '); })() },
  ];
}`,
    hint: 'changeFloors needs three branches: same floor, nonexistent floor, or valid move. dropOffPassenger uses .filter() to remove the named person.',
    resources: [{ label: 'MDN: Array.prototype.filter()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter' }],
  },

  // ── Favorite Foods (factory + composition) ──────────────────────────────
  {
    id: 269,
    title: 'Favorite Foods',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'state', 'arrays', 'strings'],
    description: 'Create dish objects with ingredients and spiciness, track orders, and build shopping lists.',
    instructions: `Write four functions:\n\n**createDish(name, ingredients, isSpicy)** — returns a dish object with \`name\`, \`ingredients\` (array), \`isSpicy\` (boolean), and \`timesOrdered: 0\`.\n\`\`\`js\ncreateDish('Tacos', ['tortilla', 'cheese'], true)\n// { name: 'Tacos', ingredients: ['tortilla', 'cheese'], isSpicy: true, timesOrdered: 0 }\n\`\`\`\n\n**commentOnSpiciness(dish)** — returns:\n- Spicy: \`"Wow, this Tacos is so spicy!"\`\n- Not spicy: \`"Phew, this Pasta is not very spicy."\`\n\n**orderFood(dish)** — increments \`dish.timesOrdered\` by 1.\n\n**createShoppingList(dishes)** — returns a single flat array of all ingredients from all dishes.\n\`\`\`js\ncreateShoppingList([dish1, dish2])\n// ['tortilla', 'cheese', 'noodles', 'butter']\n\`\`\``,
    starterCode: `function createDish(name, ingredients, isSpicy) {\n  // your code here\n}\n\nfunction commentOnSpiciness(dish) {\n  // your code here\n}\n\nfunction orderFood(dish) {\n  // your code here\n}\n\nfunction createShoppingList(dishes) {\n  // your code here\n}`,
    solution: `function createDish(name, ingredients, isSpicy) {\n  return { name, ingredients, isSpicy, timesOrdered: 0 };\n}\n\nfunction commentOnSpiciness(dish) {\n  if (dish.isSpicy) {\n    return \`Wow, this \${dish.name} is so spicy!\`;\n  }\n  return \`Phew, this \${dish.name} is not very spicy.\`;\n}\n\nfunction orderFood(dish) {\n  dish.timesOrdered++;\n}\n\nfunction createShoppingList(dishes) {\n  return dishes.flatMap(d => d.ingredients);\n}`,
    testRunner: `(code) => {
  const { createDish, commentOnSpiciness, orderFood, createShoppingList } = new Function(code + '; return { createDish, commentOnSpiciness, orderFood, createShoppingList };')();

  const tacos = createDish('Tacos', ['tortilla', 'cheese', 'salsa'], true);
  const pasta = createDish('Pasta', ['noodles', 'butter'], false);

  return [
    { pass: tacos.name === 'Tacos', description: 'createDish sets name', got: tacos.name },
    { pass: tacos.ingredients.length === 3, description: 'createDish stores ingredients array', got: tacos.ingredients.length },
    { pass: tacos.isSpicy === true, description: 'createDish stores isSpicy', got: tacos.isSpicy },
    { pass: tacos.timesOrdered === 0, description: 'createDish initializes timesOrdered to 0', got: tacos.timesOrdered },
    { pass: commentOnSpiciness(tacos) === 'Wow, this Tacos is so spicy!', description: 'commentOnSpiciness handles spicy dish', got: commentOnSpiciness(tacos) },
    { pass: commentOnSpiciness(pasta) === 'Phew, this Pasta is not very spicy.', description: 'commentOnSpiciness handles non-spicy dish', got: commentOnSpiciness(pasta) },
    { pass: (() => { const d = createDish('X', [], true); orderFood(d); orderFood(d); return d.timesOrdered === 2; })(), description: 'orderFood increments timesOrdered', got: (() => { const d = createDish('X', [], true); orderFood(d); orderFood(d); return d.timesOrdered; })() },
    { pass: (() => { const list = createShoppingList([tacos, pasta]); return list.length === 5 && list.includes('tortilla') && list.includes('noodles'); })(), description: 'createShoppingList flattens all ingredients', got: createShoppingList([tacos, pasta]).join(', ') },
  ];
}`,
    hint: 'createDish is a factory function. commentOnSpiciness checks the isSpicy property. createShoppingList can use .flatMap() or .reduce() with .concat().',
    resources: [{ label: 'MDN: Array.prototype.flatMap()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap' }],
  },

  // ── Meal Planning (state + validation) ──────────────────────────────────
  {
    id: 270,
    title: 'Meal Planning',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'state', 'conditionals', 'reduce'],
    description: 'Plan meals with calorie budgets, add dishes within limits, and calculate totals.',
    instructions: `Write three functions:\n\n**createMeal(type, calorieGoal)** — returns a meal object with \`type\`, \`calorieGoal\`, and \`dishes: []\`.\n\n**addDish(meal, dish)** — adds a dish object \`{ name, calories }\` to the meal only if the total calories (including the new dish) would not exceed \`calorieGoal\`. Updates the remaining goal.\n\`\`\`js\nconst brunch = createMeal('brunch', 600);\naddDish(brunch, { name: 'Eggs', calories: 450 });\n// brunch.dishes → [{ name: 'Eggs', calories: 450 }]\n// brunch.calorieGoal → 150  (600 - 450)\naddDish(brunch, { name: 'Pancakes', calories: 200 });\n// Rejected! 200 > remaining 150\n// brunch.dishes still has only Eggs\naddDish(brunch, { name: 'Toast', calories: 100 });\n// brunch.dishes → [{ name: 'Eggs', calories: 450 }, { name: 'Toast', calories: 100 }]\n\`\`\`\n\n**calculateCalories(meal)** — returns \`"[type] has a total of [sum] calories."\`\n\`\`\`js\ncalculateCalories(brunch); // "brunch has a total of 550 calories."\n\`\`\``,
    starterCode: `function createMeal(type, calorieGoal) {\n  // your code here\n}\n\nfunction addDish(meal, dish) {\n  // your code here\n}\n\nfunction calculateCalories(meal) {\n  // your code here\n}`,
    solution: `function createMeal(type, calorieGoal) {\n  return { type, calorieGoal, dishes: [] };\n}\n\nfunction addDish(meal, dish) {\n  if (dish.calories <= meal.calorieGoal) {\n    meal.dishes.push(dish);\n    meal.calorieGoal -= dish.calories;\n  }\n}\n\nfunction calculateCalories(meal) {\n  const total = meal.dishes.reduce((sum, d) => sum + d.calories, 0);\n  return \`\${meal.type} has a total of \${total} calories.\`;\n}`,
    testRunner: `(code) => {
  const { createMeal, addDish, calculateCalories } = new Function(code + '; return { createMeal, addDish, calculateCalories };')();

  const brunch = createMeal('brunch', 600);

  return [
    { pass: brunch.type === 'brunch' && brunch.calorieGoal === 600, description: 'createMeal sets type and calorieGoal', got: brunch.type + ': ' + brunch.calorieGoal },
    { pass: Array.isArray(brunch.dishes) && brunch.dishes.length === 0, description: 'createMeal initializes empty dishes', got: brunch.dishes.length },
    { pass: (() => { const m = createMeal('lunch', 500); addDish(m, { name: 'Salad', calories: 250 }); return m.dishes.length === 1; })(), description: 'addDish adds dish within budget', got: (() => { const m = createMeal('lunch', 500); addDish(m, { name: 'Salad', calories: 250 }); return m.dishes.length; })() },
    { pass: (() => { const m = createMeal('lunch', 500); addDish(m, { name: 'Salad', calories: 250 }); return m.calorieGoal === 250; })(), description: 'addDish updates remaining calorieGoal', got: (() => { const m = createMeal('lunch', 500); addDish(m, { name: 'Salad', calories: 250 }); return m.calorieGoal; })() },
    { pass: (() => { const m = createMeal('lunch', 300); addDish(m, { name: 'Burger', calories: 500 }); return m.dishes.length === 0; })(), description: 'addDish rejects dish exceeding budget', got: (() => { const m = createMeal('lunch', 300); addDish(m, { name: 'Burger', calories: 500 }); return m.dishes.length; })() },
    { pass: (() => { const m = createMeal('brunch', 600); addDish(m, { name: 'Eggs', calories: 450 }); addDish(m, { name: 'Toast', calories: 100 }); return calculateCalories(m); })() === 'brunch has a total of 550 calories.', description: 'calculateCalories returns formatted total', got: (() => { const m = createMeal('brunch', 600); addDish(m, { name: 'Eggs', calories: 450 }); addDish(m, { name: 'Toast', calories: 100 }); return calculateCalories(m); })() },
    { pass: (() => { const m = createMeal('dinner', 900); addDish(m, { name: 'Steak', calories: 250 }); addDish(m, { name: 'Potatoes', calories: 200 }); addDish(m, { name: 'Dessert', calories: 400 }); return calculateCalories(m); })() === 'dinner has a total of 850 calories.', description: 'calculateCalories works with multiple dishes', got: (() => { const m = createMeal('dinner', 900); addDish(m, { name: 'Steak', calories: 250 }); addDish(m, { name: 'Potatoes', calories: 200 }); addDish(m, { name: 'Dessert', calories: 400 }); return calculateCalories(m); })() },
  ];
}`,
    hint: 'addDish checks if dish.calories <= meal.calorieGoal before pushing. It also subtracts from the remaining budget. calculateCalories uses .reduce() to sum all dish calories.',
    resources: [{ label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' }],
  },

  // ── Video Games (multi-function state) ──────────────────────────────────
  {
    id: 271,
    title: 'Video Games',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'state', 'arrays', 'conditionals'],
    description: 'Create players and levels, collect coins for bonus lives, and handle game-over logic.',
    instructions: `Write four functions:\n\n**createPlayer(name, age, moveset)** — returns \`{ name, age, moveset }\`.\n\n**createLevel(name, players)** — returns \`{ name, players, lives: 3, coins: 0 }\`.\n\n**findCoins(level, amount)** — adds \`amount\` to \`level.coins\`. If coins reach 100, increment lives by 1 and reset coins to 0.\n\n**defeatPlayer(level)** — decrements lives by 1. If lives reach 0, return \`"GAME OVER"\`.\n\n\`\`\`js\nconst player = createPlayer('Mario', 30, ['fireball', 'jump', 'stomp']);\nconst level = createLevel('World 1-1', [player]);\nfindCoins(level, 5);    // level.coins → 5\nfindCoins(level, 95);   // level.coins → 0, level.lives → 4\ndefeatPlayer(level);    // level.lives → 3\ndefeatPlayer(level);    // level.lives → 2\ndefeatPlayer(level);    // level.lives → 1\ndefeatPlayer(level);    // returns "GAME OVER"\n\`\`\``,
    starterCode: `function createPlayer(name, age, moveset) {\n  // your code here\n}\n\nfunction createLevel(name, players) {\n  // your code here\n}\n\nfunction findCoins(level, amount) {\n  // your code here\n}\n\nfunction defeatPlayer(level) {\n  // your code here\n}`,
    solution: `function createPlayer(name, age, moveset) {\n  return { name, age, moveset };\n}\n\nfunction createLevel(name, players) {\n  return { name, players, lives: 3, coins: 0 };\n}\n\nfunction findCoins(level, amount) {\n  level.coins += amount;\n  if (level.coins >= 100) {\n    level.lives++;\n    level.coins = 0;\n  }\n}\n\nfunction defeatPlayer(level) {\n  level.lives--;\n  if (level.lives <= 0) {\n    return 'GAME OVER';\n  }\n}`,
    testRunner: `(code) => {
  const { createPlayer, createLevel, findCoins, defeatPlayer } = new Function(code + '; return { createPlayer, createLevel, findCoins, defeatPlayer };')();

  const player = createPlayer('Mario', 30, ['fireball', 'jump', 'stomp']);
  const level = createLevel('World 1-1', [player]);

  return [
    { pass: player.name === 'Mario' && player.age === 30, description: 'createPlayer sets name and age', got: player.name },
    { pass: Array.isArray(player.moveset) && player.moveset.length === 3, description: 'createPlayer stores moveset', got: player.moveset.length },
    { pass: level.lives === 3 && level.coins === 0, description: 'createLevel starts with 3 lives and 0 coins', got: 'lives: ' + level.lives + ', coins: ' + level.coins },
    { pass: (() => { const l = createLevel('X', []); findCoins(l, 5); return l.coins === 5; })(), description: 'findCoins adds to coin count', got: (() => { const l = createLevel('X', []); findCoins(l, 5); return l.coins; })() },
    { pass: (() => { const l = createLevel('X', []); findCoins(l, 100); return l.lives === 4 && l.coins === 0; })(), description: 'findCoins grants bonus life at 100 coins', got: (() => { const l = createLevel('X', []); findCoins(l, 100); return 'lives: ' + l.lives + ', coins: ' + l.coins; })() },
    { pass: (() => { const l = createLevel('X', []); defeatPlayer(l); return l.lives === 2; })(), description: 'defeatPlayer decrements lives', got: (() => { const l = createLevel('X', []); defeatPlayer(l); return l.lives; })() },
    { pass: (() => { const l = createLevel('X', []); defeatPlayer(l); defeatPlayer(l); const r = defeatPlayer(l); return r === 'GAME OVER'; })(), description: 'defeatPlayer returns GAME OVER at 0 lives', got: (() => { const l = createLevel('X', []); defeatPlayer(l); defeatPlayer(l); return defeatPlayer(l); })() },
  ];
}`,
    hint: 'findCoins mutates the level object. Check if coins >= 100 to trigger a bonus life. defeatPlayer returns "GAME OVER" only when lives hit 0.',
    resources: [],
  },

  // ── Vending Machine (validation + state) ────────────────────────────────
  {
    id: 272,
    title: 'Vending Machine',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'objects'],
    tags: ['objects', 'functions', 'state', 'conditionals', 'reduce'],
    description: 'Build a vending machine with stock management, purchase validation, and coin collection.',
    instructions: `Write three functions:\n\n**createItemStock(name, quantity, price)** — returns a stock object. If called with no arguments, defaults to \`{ name: 'unknown', quantity: 0, price: 1.00 }\`.\n\n**makePurchase(item, funds)** — if funds < price, return \`"Not enough funds"\`. If quantity === 0, return \`"Item out of stock"\`. Otherwise, decrement quantity and return \`"Here are your [name]"\`.\n\n**collectChange(coins)** — takes an array of coin values and returns the total.\n\`\`\`js\nconst chips = createItemStock('Chips', 5, 2.00);\nmakePurchase(chips, 0.35); // "Not enough funds"\nmakePurchase(chips, 2.00); // "Here are your Chips"\n// chips.quantity → 4\n\ncollectChange([0.25, 0.10, 0.25, 0.05, 1.00]); // 1.65\n\`\`\``,
    starterCode: `function createItemStock(name, quantity, price) {\n  // your code here\n}\n\nfunction makePurchase(item, funds) {\n  // your code here\n}\n\nfunction collectChange(coins) {\n  // your code here\n}`,
    solution: `function createItemStock(name = 'unknown', quantity = 0, price = 1.00) {\n  return { name, quantity, price };\n}\n\nfunction makePurchase(item, funds) {\n  if (funds < item.price) return 'Not enough funds';\n  if (item.quantity === 0) return 'Item out of stock';\n  item.quantity--;\n  return \`Here are your \${item.name}\`;\n}\n\nfunction collectChange(coins) {\n  return coins.reduce((sum, c) => sum + c, 0);\n}`,
    testRunner: `(code) => {
  const { createItemStock, makePurchase, collectChange } = new Function(code + '; return { createItemStock, makePurchase, collectChange };')();

  const chips = createItemStock('Chips', 5, 2.00);
  const empty = createItemStock();

  return [
    { pass: chips.name === 'Chips' && chips.quantity === 5 && chips.price === 2.00, description: 'createItemStock stores name, quantity, price', got: chips.name + ': ' + chips.quantity + ' @ $' + chips.price },
    { pass: empty.name === 'unknown' && empty.quantity === 0 && empty.price === 1.00, description: 'createItemStock defaults to unknown/0/1.00', got: empty.name + ': ' + empty.quantity + ' @ $' + empty.price },
    { pass: makePurchase(createItemStock('X', 5, 2.00), 0.35) === 'Not enough funds', description: 'makePurchase rejects insufficient funds', got: makePurchase(createItemStock('X', 5, 2.00), 0.35) },
    { pass: makePurchase(createItemStock('X', 0, 1.00), 5.00) === 'Item out of stock', description: 'makePurchase rejects out of stock', got: makePurchase(createItemStock('X', 0, 1.00), 5.00) },
    { pass: (() => { const item = createItemStock('Soda', 3, 1.50); const r = makePurchase(item, 1.50); return r === 'Here are your Soda' && item.quantity === 2; })(), description: 'makePurchase succeeds and decrements quantity', got: (() => { const item = createItemStock('Soda', 3, 1.50); return makePurchase(item, 1.50); })() },
    { pass: collectChange([0.25]) === 0.25, description: 'collectChange sums single coin', got: collectChange([0.25]) },
    { pass: Math.abs(collectChange([0.25, 0.10, 0.25, 0.05, 1.00]) - 1.65) < 0.001, description: 'collectChange sums multiple coins', got: collectChange([0.25, 0.10, 0.25, 0.05, 1.00]) },
  ];
}`,
    hint: 'createItemStock uses default parameters. makePurchase checks funds first, then stock, then processes. collectChange is a simple .reduce() sum.',
    resources: [{ label: 'MDN: Default Parameters', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters' }],
  },

  // ── Scope: Variable Declarations (from alexmfritz/jsFun) ────────────────
  {
    id: 273,
    title: 'Scope: Variable Declarations',
    type: 'js',
    tier: 2,
    category: ['js-fundamentals', 'variables'],
    tags: ['scope', 'variables', 'hoisting', 'es6'],
    description: 'Predict values at different points by tracing var, let, and const through nested scopes.',
    instructions: `JavaScript has three ways to declare variables — \`var\`, \`let\`, and \`const\` — each with different scoping rules.\n\nWrite a function **traceScope()** that returns an array of values showing what each variable equals at marked points.\n\n\`\`\`js\nfunction traceScope() {\n  var a = 'outer-a';\n  let b = 'outer-b';\n\n  if (true) {\n    var a = 'inner-a';  // var is function-scoped, overwrites!\n    let b = 'inner-b';  // let is block-scoped, new variable\n    // Point 1: [a, b] inside block\n  }\n  // Point 2: [a, b] outside block\n\n  function nested() {\n    var c = 'nested-c';\n    // Point 3: [a, b, c] inside function\n  }\n  nested();\n  // Point 4: typeof c\n\n  return [/* Point 1 */, /* Point 2 */, /* Point 3 */, /* Point 4 */];\n}\n\`\`\`\n\nReturn an array of 4 sub-arrays, one per point:\n- Point 1: \`['inner-a', 'inner-b']\`\n- Point 2: \`['inner-a', 'outer-b']\`  (var leaked, let didn't)\n- Point 3: \`['inner-a', 'outer-b', 'nested-c']\`\n- Point 4: \`'undefined'\` (typeof c — c is function-scoped to nested)`,
    starterCode: `function traceScope() {\n  var a = 'outer-a';\n  let b = 'outer-b';\n  const results = [];\n\n  if (true) {\n    var a = 'inner-a';\n    let b = 'inner-b';\n    results.push([a, b]); // Point 1\n  }\n  results.push([a, b]); // Point 2\n\n  function nested() {\n    var c = 'nested-c';\n    results.push([a, b, c]); // Point 3\n  }\n  nested();\n  results.push(typeof c); // Point 4\n\n  return results;\n}`,
    solution: `function traceScope() {\n  var a = 'outer-a';\n  let b = 'outer-b';\n  const results = [];\n\n  if (true) {\n    var a = 'inner-a';\n    let b = 'inner-b';\n    results.push([a, b]); // Point 1\n  }\n  results.push([a, b]); // Point 2\n\n  function nested() {\n    var c = 'nested-c';\n    results.push([a, b, c]); // Point 3\n  }\n  nested();\n  results.push(typeof c); // Point 4\n\n  return results;\n}`,
    testRunner: `(code) => {
  const traceScope = new Function(code + '; return traceScope;')();
  const result = traceScope();

  return [
    { pass: JSON.stringify(result[0]) === JSON.stringify(['inner-a', 'inner-b']), description: 'Point 1: inside block [a, b]', got: JSON.stringify(result[0]) },
    { pass: JSON.stringify(result[1]) === JSON.stringify(['inner-a', 'outer-b']), description: 'Point 2: var leaked, let did not', got: JSON.stringify(result[1]) },
    { pass: JSON.stringify(result[2]) === JSON.stringify(['inner-a', 'outer-b', 'nested-c']), description: 'Point 3: nested function sees outer a and b', got: JSON.stringify(result[2]) },
    { pass: result[3] === 'undefined', description: 'Point 4: c is function-scoped (typeof c is "undefined")', got: result[3] },
  ];
}`,
    hint: 'var is function-scoped: re-declaring var a inside an if block overwrites the outer a. let is block-scoped: the inner b only exists inside the if block. Variables declared with var inside a function are not accessible outside it.',
    resources: [{ label: 'MDN: var', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var' }, { label: 'MDN: let', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let' }],
  },

  // ── Scope: Closures & Hoisting ──────────────────────────────────────────
  {
    id: 274,
    title: 'Scope: Closures & Hoisting',
    type: 'js',
    tier: 3,
    category: ['js-fundamentals', 'variables'],
    tags: ['scope', 'closure', 'hoisting', 'functions', 'es6'],
    description: 'Trace variable values through hoisting, temporal dead zones, and closure captures.',
    instructions: `Complete four functions that test your understanding of advanced scoping:\n\n**hoistingTrace()** — demonstrates var hoisting:\n\`\`\`js\nfunction hoistingTrace() {\n  console.log(x); // What is x here?\n  var x = 10;\n  console.log(x); // And here?\n  return [/* first log */, /* second log */];\n}\n// Returns: [undefined, 10]\n\`\`\`\n\n**closureCapture()** — demonstrates closure over a loop variable:\n\`\`\`js\nfunction closureCapture() {\n  const fns = [];\n  for (let i = 0; i < 3; i++) {\n    fns.push(() => i);\n  }\n  return fns.map(fn => fn());\n}\n// Returns: [0, 1, 2] (let creates new binding per iteration)\n\`\`\`\n\n**shadowTrace()** — demonstrates variable shadowing:\n\`\`\`js\nfunction shadowTrace() {\n  let x = 'outer';\n  function inner() {\n    let x = 'inner';\n    return x;\n  }\n  return [inner(), x];\n}\n// Returns: ['inner', 'outer']\n\`\`\`\n\n**closureCounter()** — a closure that remembers state:\n\`\`\`js\nfunction closureCounter(start) {\n  let count = start;\n  return {\n    increment: () => ++count,\n    getCount: () => count,\n  };\n}\n\`\`\``,
    starterCode: `function hoistingTrace() {\n  // What does x equal before the declaration?\n  // What does x equal after?\n  var x = 10;\n  return [/* before */, /* after */];\n}\n\nfunction closureCapture() {\n  const fns = [];\n  for (let i = 0; i < 3; i++) {\n    fns.push(() => i);\n  }\n  return fns.map(fn => fn());\n}\n\nfunction shadowTrace() {\n  let x = 'outer';\n  function inner() {\n    let x = 'inner';\n    return x;\n  }\n  return [inner(), x];\n}\n\nfunction closureCounter(start) {\n  // create a closure that tracks count\n  // return { increment, getCount }\n}`,
    solution: `function hoistingTrace() {\n  const beforeDecl = typeof x === 'undefined' ? undefined : x;\n  var x = 10;\n  return [undefined, x];\n}\n\nfunction closureCapture() {\n  const fns = [];\n  for (let i = 0; i < 3; i++) {\n    fns.push(() => i);\n  }\n  return fns.map(fn => fn());\n}\n\nfunction shadowTrace() {\n  let x = 'outer';\n  function inner() {\n    let x = 'inner';\n    return x;\n  }\n  return [inner(), x];\n}\n\nfunction closureCounter(start) {\n  let count = start;\n  return {\n    increment: () => ++count,\n    getCount: () => count,\n  };\n}`,
    testRunner: `(code) => {
  const { hoistingTrace, closureCapture, shadowTrace, closureCounter } = new Function(code + '; return { hoistingTrace, closureCapture, shadowTrace, closureCounter };')();

  const hoist = hoistingTrace();
  const closure = closureCapture();
  const shadow = shadowTrace();
  const counter = closureCounter(5);

  return [
    { pass: hoist[0] === undefined, description: 'hoistingTrace: var x is undefined before declaration', got: hoist[0] },
    { pass: hoist[1] === 10, description: 'hoistingTrace: var x is 10 after declaration', got: hoist[1] },
    { pass: JSON.stringify(closure) === '[0,1,2]', description: 'closureCapture: let captures [0,1,2]', got: JSON.stringify(closure) },
    { pass: shadow[0] === 'inner' && shadow[1] === 'outer', description: 'shadowTrace: inner shadows outer', got: JSON.stringify(shadow) },
    { pass: counter.getCount() === 5, description: 'closureCounter: starts at 5', got: counter.getCount() },
    { pass: counter.increment() === 6, description: 'closureCounter: increment returns 6', got: counter.increment() - 1 + 1 },
    { pass: (() => { const c = closureCounter(0); c.increment(); c.increment(); c.increment(); return c.getCount() === 3; })(), description: 'closureCounter: tracks state across calls', got: (() => { const c = closureCounter(0); c.increment(); c.increment(); c.increment(); return c.getCount(); })() },
  ];
}`,
    hint: 'var declarations are hoisted to the top of their function but their values are not — the variable exists but is undefined. let in a for-loop creates a new binding per iteration, so closures capture the right value. Closures "close over" the variable binding, not the value at the time of creation.',
    resources: [{ label: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' }, { label: 'MDN: Hoisting', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting' }],
  },

  // ── Context: this Keyword ───────────────────────────────────────────────
  {
    id: 275,
    title: 'Context: The this Keyword',
    type: 'js',
    tier: 3,
    category: ['js-fundamentals', 'functions'],
    tags: ['context', 'scope', 'functions', 'class', 'methods'],
    description: 'Predict what `this` refers to in method calls, arrow functions, and explicit binding.',
    instructions: `JavaScript's \`this\` keyword changes based on how a function is called. Write functions that demonstrate each binding rule:\n\n**methodContext()** — When called as an object method, \`this\` is the object:\n\`\`\`js\nfunction methodContext() {\n  const obj = {\n    name: 'obj',\n    getName() { return this.name; },\n  };\n  return obj.getName(); // 'obj'\n}\n\`\`\`\n\n**arrowContext()** — Arrow functions inherit \`this\` from enclosing scope:\n\`\`\`js\nfunction arrowContext() {\n  const obj = {\n    name: 'obj',\n    getNameArrow: () => this.name, // 'this' is outer scope, not obj\n    getNameMethod() {\n      const inner = () => this.name;\n      return inner(); // arrow inherits from getNameMethod's this\n    },\n  };\n  return [typeof obj.getNameArrow(), obj.getNameMethod()];\n  // [undefined (or '' in browser), 'obj']\n}\n\`\`\`\n\n**explicitBinding()** — .call() and .bind() set \`this\`:\n\`\`\`js\nfunction explicitBinding() {\n  function greet() { return 'Hello, ' + this.name; }\n  const person = { name: 'Alice' };\n  const dog = { name: 'Rex' };\n  const bound = greet.bind(person);\n  return [greet.call(dog), bound()];\n  // ['Hello, Rex', 'Hello, Alice']\n}\n\`\`\`\n\n**classContext()** — In a class, \`this\` is the instance:\n\`\`\`js\nfunction classContext() {\n  class Hero {\n    constructor(name) { this.name = name; }\n    announce() { return this.name + ' is here!'; }\n  }\n  const h = new Hero('Batman');\n  return h.announce(); // 'Batman is here!'\n}\n\`\`\``,
    starterCode: `function methodContext() {\n  const obj = {\n    name: 'obj',\n    getName() { /* return this.name */ },\n  };\n  return obj.getName();\n}\n\nfunction arrowContext() {\n  const obj = {\n    name: 'obj',\n    getNameArrow: () => { /* what is this? */ },\n    getNameMethod() {\n      const inner = () => { /* what is this? */ };\n      return inner();\n    },\n  };\n  return [typeof obj.getNameArrow(), obj.getNameMethod()];\n}\n\nfunction explicitBinding() {\n  function greet() { return 'Hello, ' + this.name; }\n  const person = { name: 'Alice' };\n  const dog = { name: 'Rex' };\n  // use .call() and .bind()\n  return [/* call on dog */, /* bind to person then call */];\n}\n\nfunction classContext() {\n  class Hero {\n    constructor(name) { /* set this.name */ }\n    announce() { /* return name + ' is here!' */ }\n  }\n  const h = new Hero('Batman');\n  return h.announce();\n}`,
    solution: `function methodContext() {\n  const obj = {\n    name: 'obj',\n    getName() { return this.name; },\n  };\n  return obj.getName();\n}\n\nfunction arrowContext() {\n  const obj = {\n    name: 'obj',\n    getNameArrow: () => this.name,\n    getNameMethod() {\n      const inner = () => this.name;\n      return inner();\n    },\n  };\n  return [typeof obj.getNameArrow(), obj.getNameMethod()];\n}\n\nfunction explicitBinding() {\n  function greet() { return 'Hello, ' + this.name; }\n  const person = { name: 'Alice' };\n  const dog = { name: 'Rex' };\n  const bound = greet.bind(person);\n  return [greet.call(dog), bound()];\n}\n\nfunction classContext() {\n  class Hero {\n    constructor(name) { this.name = name; }\n    announce() { return this.name + ' is here!'; }\n  }\n  const h = new Hero('Batman');\n  return h.announce();\n}`,
    testRunner: `(code) => {
  const { methodContext, arrowContext, explicitBinding, classContext } = new Function(code + '; return { methodContext, arrowContext, explicitBinding, classContext };')();

  const mc = methodContext();
  const ac = arrowContext();
  const eb = explicitBinding();
  const cc = classContext();

  return [
    { pass: mc === 'obj', description: 'methodContext: this.name is "obj"', got: mc },
    { pass: ac[0] === 'undefined', description: 'arrowContext: arrow this.name is undefined', got: ac[0] },
    { pass: ac[1] === 'obj', description: 'arrowContext: nested arrow inherits method this', got: ac[1] },
    { pass: eb[0] === 'Hello, Rex', description: 'explicitBinding: .call(dog) binds to dog', got: eb[0] },
    { pass: eb[1] === 'Hello, Alice', description: 'explicitBinding: .bind(person) binds to person', got: eb[1] },
    { pass: cc === 'Batman is here!', description: 'classContext: this is the instance', got: cc },
  ];
}`,
    hint: 'Regular function methods: this = the object before the dot. Arrow functions: this = whatever this was in the enclosing scope. .call() sets this for one invocation. .bind() creates a new function with this permanently set.',
    resources: [{ label: 'MDN: this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' }, { label: 'MDN: Function.prototype.bind()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind' }],
  },

  // ── Prototypes: Filter & Map with Datasets ──────────────────────────────
  {
    id: 276,
    title: 'Dataset: Kitties & Puppers',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'filter', 'map', 'higher-order', 'objects'],
    description: 'Filter, sort, and transform arrays of animal objects using higher-order functions.',
    instructions: `You have two datasets:\n\`\`\`js\nconst kitties = [\n  { name: 'Felicia', age: 2, color: 'grey' },\n  { name: 'Tiger', age: 5, color: 'orange' },\n  { name: 'Snickers', age: 8, color: 'orange' },\n  { name: 'Max', age: 1, color: 'tuxedo' },\n];\n\nconst puppers = [\n  { name: 'Buddy', age: 3, color: 'golden' },\n  { name: 'Luna', age: 7, color: 'black' },\n  { name: 'Duke', age: 4, color: 'golden' },\n  { name: 'Bella', age: 2, color: 'brown' },\n];\n\`\`\`\n\nWrite three functions that work with **either** dataset:\n\n**findByColor(animals, color)** — returns an array of names of animals with that color.\n\`\`\`js\nfindByColor(kitties, 'orange'); // ['Tiger', 'Snickers']\nfindByColor(puppers, 'golden'); // ['Buddy', 'Duke']\n\`\`\`\n\n**sortByAge(animals)** — returns a new array of animal objects sorted oldest to youngest.\n\n**growUp(animals, years)** — returns a new array of animal objects with each age increased by \`years\`. Do NOT mutate the originals.`,
    starterCode: `function findByColor(animals, color) {\n  // your code here\n}\n\nfunction sortByAge(animals) {\n  // your code here\n}\n\nfunction growUp(animals, years) {\n  // your code here\n}`,
    solution: `function findByColor(animals, color) {\n  return animals.filter(a => a.color === color).map(a => a.name);\n}\n\nfunction sortByAge(animals) {\n  return [...animals].sort((a, b) => b.age - a.age);\n}\n\nfunction growUp(animals, years) {\n  return animals.map(a => ({ ...a, age: a.age + years }));\n}`,
    testRunner: `(code) => {
  const { findByColor, sortByAge, growUp } = new Function(code + '; return { findByColor, sortByAge, growUp };')();

  const kitties = [
    { name: 'Felicia', age: 2, color: 'grey' },
    { name: 'Tiger', age: 5, color: 'orange' },
    { name: 'Snickers', age: 8, color: 'orange' },
    { name: 'Max', age: 1, color: 'tuxedo' },
  ];
  const puppers = [
    { name: 'Buddy', age: 3, color: 'golden' },
    { name: 'Luna', age: 7, color: 'black' },
    { name: 'Duke', age: 4, color: 'golden' },
    { name: 'Bella', age: 2, color: 'brown' },
  ];

  const orangeKitties = findByColor(kitties, 'orange');
  const goldenPuppers = findByColor(puppers, 'golden');
  const sortedKitties = sortByAge(kitties);
  const grownKitties = growUp(kitties, 2);

  return [
    { pass: JSON.stringify(orangeKitties) === JSON.stringify(['Tiger', 'Snickers']), description: 'findByColor: orange kitties', got: JSON.stringify(orangeKitties) },
    { pass: JSON.stringify(goldenPuppers) === JSON.stringify(['Buddy', 'Duke']), description: 'findByColor: golden puppers', got: JSON.stringify(goldenPuppers) },
    { pass: sortedKitties[0].name === 'Snickers' && sortedKitties[3].name === 'Max', description: 'sortByAge: oldest first', got: sortedKitties.map(a => a.name + '(' + a.age + ')').join(', ') },
    { pass: kitties[0].age === 2, description: 'sortByAge: does not mutate original', got: kitties[0].age },
    { pass: grownKitties[0].age === 4 && grownKitties[2].age === 10, description: 'growUp: increases ages by 2', got: grownKitties.map(a => a.name + '(' + a.age + ')').join(', ') },
    { pass: kitties[0].age === 2, description: 'growUp: does not mutate original', got: kitties[0].age },
  ];
}`,
    hint: 'findByColor chains .filter() then .map(). sortByAge uses spread [...animals] to avoid mutation, then .sort(). growUp uses .map() with spread { ...a } to create new objects.',
    resources: [{ label: 'MDN: Array.prototype.sort()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort' }],
  },

  // ── Prototypes: Reduce with Datasets ────────────────────────────────────
  {
    id: 277,
    title: 'Dataset: Cake Inventory',
    type: 'js',
    tier: 3,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'reduce', 'map', 'filter', 'higher-order', 'objects'],
    description: 'Use reduce, map, and filter to analyze a cake inventory dataset.',
    instructions: `You have a dataset of cakes:\n\`\`\`js\nconst cakes = [\n  { type: 'chocolate', inStock: 15, toppings: ['sprinkles', 'fudge', 'whipped cream'] },\n  { type: 'vanilla', inStock: 0, toppings: ['sprinkles', 'caramel'] },\n  { type: 'red velvet', inStock: 20, toppings: ['cream cheese', 'sprinkles'] },\n  { type: 'carrot', inStock: 24, toppings: ['cream cheese', 'walnuts'] },\n];\n\`\`\`\n\nWrite four functions:\n\n**getStockCounts(cakes)** — returns an array of \`{ type, inStock }\` objects.\n\n**getInStock(cakes)** — returns only cakes where \`inStock > 0\`.\n\n**doInventory(cakes)** — returns the total number of cakes in stock.\n\n**getToppings(cakes)** — returns a flat, unique array of all toppings.\n\`\`\`js\ngetToppings(cakes)\n// ['sprinkles', 'fudge', 'whipped cream', 'caramel', 'cream cheese', 'walnuts']\n\`\`\``,
    starterCode: `function getStockCounts(cakes) {\n  // your code here\n}\n\nfunction getInStock(cakes) {\n  // your code here\n}\n\nfunction doInventory(cakes) {\n  // your code here\n}\n\nfunction getToppings(cakes) {\n  // your code here\n}`,
    solution: `function getStockCounts(cakes) {\n  return cakes.map(c => ({ type: c.type, inStock: c.inStock }));\n}\n\nfunction getInStock(cakes) {\n  return cakes.filter(c => c.inStock > 0);\n}\n\nfunction doInventory(cakes) {\n  return cakes.reduce((sum, c) => sum + c.inStock, 0);\n}\n\nfunction getToppings(cakes) {\n  return [...new Set(cakes.flatMap(c => c.toppings))];\n}`,
    testRunner: `(code) => {
  const { getStockCounts, getInStock, doInventory, getToppings } = new Function(code + '; return { getStockCounts, getInStock, doInventory, getToppings };')();

  const cakes = [
    { type: 'chocolate', inStock: 15, toppings: ['sprinkles', 'fudge', 'whipped cream'] },
    { type: 'vanilla', inStock: 0, toppings: ['sprinkles', 'caramel'] },
    { type: 'red velvet', inStock: 20, toppings: ['cream cheese', 'sprinkles'] },
    { type: 'carrot', inStock: 24, toppings: ['cream cheese', 'walnuts'] },
  ];

  const stockCounts = getStockCounts(cakes);
  const inStock = getInStock(cakes);
  const total = doInventory(cakes);
  const toppings = getToppings(cakes);

  return [
    { pass: stockCounts.length === 4 && stockCounts[0].type === 'chocolate' && stockCounts[0].inStock === 15, description: 'getStockCounts returns {type, inStock} objects', got: JSON.stringify(stockCounts[0]) },
    { pass: !stockCounts[0].toppings, description: 'getStockCounts omits toppings', got: stockCounts[0].toppings === undefined ? 'no toppings key' : 'has toppings' },
    { pass: inStock.length === 3 && inStock.every(c => c.inStock > 0), description: 'getInStock returns only cakes in stock', got: inStock.map(c => c.type).join(', ') },
    { pass: total === 59, description: 'doInventory returns total: 59', got: total },
    { pass: toppings.length === 6, description: 'getToppings returns 6 unique toppings', got: toppings.length },
    { pass: toppings.filter(t => t === 'sprinkles').length === 1, description: 'getToppings has no duplicates', got: toppings.filter(t => t === 'sprinkles').length },
  ];
}`,
    hint: 'getStockCounts uses .map() to pick just type and inStock. doInventory uses .reduce() to sum. getToppings can use .flatMap() to get all toppings then new Set() to deduplicate.',
    resources: [{ label: 'MDN: Set', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set' }, { label: 'MDN: Array.prototype.flatMap()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap' }],
  },

  // ── Prototypes: Complex Reduce ──────────────────────────────────────────
  {
    id: 278,
    title: 'Dataset: National Parks',
    type: 'js',
    tier: 4,
    category: ['data-structures', 'arrays'],
    tags: ['arrays', 'reduce', 'objects', 'higher-order', 'accumulator'],
    description: 'Use reduce to build complex objects from a national parks dataset.',
    instructions: `You have a dataset of national parks:\n\`\`\`js\nconst parks = [\n  { name: 'Yellowstone', state: 'Wyoming', visitors: 4860242, activities: ['hiking', 'camping', 'fishing'] },\n  { name: 'Yosemite', state: 'California', visitors: 3287595, activities: ['hiking', 'climbing', 'camping'] },\n  { name: 'Zion', state: 'Utah', visitors: 4320033, activities: ['hiking', 'canyoneering'] },\n  { name: 'Grand Canyon', state: 'Arizona', visitors: 5974411, activities: ['hiking', 'rafting', 'camping'] },\n  { name: 'Joshua Tree', state: 'California', visitors: 2988547, activities: ['hiking', 'climbing', 'stargazing'] },\n];\n\`\`\`\n\nWrite three functions:\n\n**parksByState(parks)** — returns an object grouping park names by state:\n\`\`\`js\n{ Wyoming: ['Yellowstone'], California: ['Yosemite', 'Joshua Tree'], Utah: ['Zion'], Arizona: ['Grand Canyon'] }\n\`\`\`\n\n**totalVisitors(parks)** — returns the total visitor count across all parks.\n\n**activityParks(parks)** — returns an object where each activity maps to the parks that offer it:\n\`\`\`js\n{ hiking: ['Yellowstone', 'Yosemite', 'Zion', 'Grand Canyon', 'Joshua Tree'], camping: ['Yellowstone', 'Yosemite', 'Grand Canyon'], ... }\n\`\`\``,
    starterCode: `function parksByState(parks) {\n  // your code here\n}\n\nfunction totalVisitors(parks) {\n  // your code here\n}\n\nfunction activityParks(parks) {\n  // your code here\n}`,
    solution: `function parksByState(parks) {\n  return parks.reduce((acc, park) => {\n    if (!acc[park.state]) acc[park.state] = [];\n    acc[park.state].push(park.name);\n    return acc;\n  }, {});\n}\n\nfunction totalVisitors(parks) {\n  return parks.reduce((sum, p) => sum + p.visitors, 0);\n}\n\nfunction activityParks(parks) {\n  return parks.reduce((acc, park) => {\n    park.activities.forEach(activity => {\n      if (!acc[activity]) acc[activity] = [];\n      acc[activity].push(park.name);\n    });\n    return acc;\n  }, {});\n}`,
    testRunner: `(code) => {
  const { parksByState, totalVisitors, activityParks } = new Function(code + '; return { parksByState, totalVisitors, activityParks };')();

  const parks = [
    { name: 'Yellowstone', state: 'Wyoming', visitors: 4860242, activities: ['hiking', 'camping', 'fishing'] },
    { name: 'Yosemite', state: 'California', visitors: 3287595, activities: ['hiking', 'climbing', 'camping'] },
    { name: 'Zion', state: 'Utah', visitors: 4320033, activities: ['hiking', 'canyoneering'] },
    { name: 'Grand Canyon', state: 'Arizona', visitors: 5974411, activities: ['hiking', 'rafting', 'camping'] },
    { name: 'Joshua Tree', state: 'California', visitors: 2988547, activities: ['hiking', 'climbing', 'stargazing'] },
  ];

  const byState = parksByState(parks);
  const total = totalVisitors(parks);
  const byActivity = activityParks(parks);

  return [
    { pass: byState['California'].length === 2 && byState['California'].includes('Yosemite'), description: 'parksByState: California has 2 parks', got: JSON.stringify(byState['California']) },
    { pass: byState['Wyoming'].length === 1 && byState['Wyoming'][0] === 'Yellowstone', description: 'parksByState: Wyoming has Yellowstone', got: JSON.stringify(byState['Wyoming']) },
    { pass: total === 21430828, description: 'totalVisitors: sums to 21,430,828', got: total },
    { pass: byActivity['hiking'].length === 5, description: 'activityParks: hiking has 5 parks', got: byActivity['hiking'].length },
    { pass: byActivity['camping'].length === 3, description: 'activityParks: camping has 3 parks', got: byActivity['camping'].length },
    { pass: byActivity['stargazing'].length === 1 && byActivity['stargazing'][0] === 'Joshua Tree', description: 'activityParks: stargazing has Joshua Tree', got: JSON.stringify(byActivity['stargazing']) },
  ];
}`,
    hint: 'All three functions use .reduce() with an accumulator. parksByState and activityParks build objects where keys are group names and values are arrays. activityParks needs a nested loop over each park\'s activities array.',
    resources: [{ label: 'MDN: Array.prototype.reduce()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' }],
  },
];

// ─── 4. Add exercises to data ─────────────────────────────────────────────────

for (const ex of newExercises) {
  data.exercises.push(ex);
  console.log(`  Added exercise ${ex.id}: ${ex.title} (Tier ${ex.tier})`);
}

// ─── 5. Update Turing collection ──────────────────────────────────────────────

const turingCol = data.collections.find(c => c.id === 'turing-foundations');
if (turingCol) {
  const newIds = newExercises.map(e => e.id);
  turingCol.exerciseIds = [...turingCol.exerciseIds, ...newIds].sort((a, b) => a - b);
  turingCol.description =
    'Exercises sourced from Turing School repositories: Mythical Creatures, two-class and multi-class composition, scope, context, and dataset manipulation. Repos: alexmfritz/jsFun, turingschool-examples/javascript-foundations, turingschool-examples/jsFunk.';
  console.log(`\n  Updated Turing Foundations: ${turingCol.exerciseIds.length} exercises`);
  console.log(`  New description: ${turingCol.description}`);
}

// ─── 6. Write back ────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── 7. Summary ───────────────────────────────────────────────────────────────

console.log('\n=== Migration Complete ===');
console.log(`  Fixed emoji titles: ${emojiFixCount}`);
console.log(`  Fixed null/empty tags: ${nullTagFixes}`);
console.log(`  New exercises added: ${newExercises.length}`);
console.log(`  ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`  Total exercises: ${data.exercises.length}`);
