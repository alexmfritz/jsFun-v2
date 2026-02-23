#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function patch(titleFragment, newRunner) {
  const ex = data.exercises.find(e => e.title.includes(titleFragment));
  if (!ex) { console.error('NOT FOUND:', titleFragment); return; }
  ex.testRunner = newRunner;
  console.log('patched:', ex.title);
}

// ─── 1. AIRPORT: fix O'Hare apostrophe ───────────────────────────────────────
patch('Airport', `(code) => {
  const { Plane, Airport } = new Function(code + '; return { Plane, Airport };')();

  const p1 = new Plane('UA101', 'United', 'Denver');
  const p2 = new Plane('DL202', 'Delta', 'Atlanta');
  const p3 = new Plane('UA303', 'United', 'Chicago');
  const airport = new Airport("O'Hare");

  const p1InitialLanded = p1.isLanded;          // capture before land()
  airport.land(p1);
  airport.land(p2);
  airport.land(p3);
  const p1LandedAfter = p1.isLanded;            // capture after land()

  const unitedFlights = airport.getFlightsByAirline('United');
  const hasAtlanta = airport.hasDestination('Atlanta');
  const hasMiami = airport.hasDestination('Miami');
  const beforeDeparture = airport.planes.length;

  const departed = airport.depart('DL202');
  const afterDeparture = airport.planes.length;
  const departedIsLanded = departed ? departed.isLanded : null;

  return [
    { pass: p1InitialLanded === false, description: 'Plane starts with isLanded = false', got: p1InitialLanded },
    { pass: beforeDeparture === 3, description: 'Airport has 3 planes after landing 3', got: beforeDeparture },
    { pass: p1LandedAfter === true, description: 'land() sets plane.isLanded to true', got: p1LandedAfter },
    { pass: unitedFlights.length === 2, description: 'getFlightsByAirline returns 2 United flights', got: unitedFlights.length },
    { pass: hasAtlanta === true, description: 'hasDestination("Atlanta") is true', got: hasAtlanta },
    { pass: hasMiami === false, description: 'hasDestination("Miami") is false', got: hasMiami },
    { pass: departed && departed.flightNumber === 'DL202', description: 'depart() returns the departed Plane', got: departed && departed.flightNumber },
    { pass: departedIsLanded === false, description: 'departed plane has isLanded set back to false', got: departedIsLanded },
    { pass: afterDeparture === 2, description: 'Airport has 2 planes after departure', got: afterDeparture },
  ];
}`);

// ─── 2. LIBRARY: complete replacement with correct two-class runner ───────────
patch('Library', `(code) => {
  const { Book, Library } = new Function(code + '; return { Book, Library };')();

  const b1 = new Book('Dune', 'Frank Herbert', 1965);
  const b2 = new Book('Foundation', 'Isaac Asimov', 1951);
  const b3 = new Book('Foundation and Empire', 'Isaac Asimov', 1952);

  const lib = new Library('City Library');
  lib.addBook(b1);
  lib.addBook(b2);
  lib.addBook(b3);

  const b1InitialState = b1.isCheckedOut;       // capture before checkout
  const checkedOut = lib.checkOut('Dune');
  const b1AfterCheckout = b1.isCheckedOut;      // capture after checkout
  const alreadyOut = lib.checkOut('Dune');
  const available = lib.getAvailableBooks();
  const asimov = lib.getBooksByAuthor('Isaac Asimov');

  lib.returnBook('Dune');
  const afterReturn = lib.getAvailableBooks();

  return [
    { pass: b1InitialState === false, description: 'Book starts with isCheckedOut = false', got: b1InitialState },
    { pass: lib.catalog.length === 3, description: 'Library has 3 books in catalog', got: lib.catalog.length },
    { pass: checkedOut === b1, description: 'checkOut returns the Book instance', got: checkedOut && checkedOut.title },
    { pass: b1AfterCheckout === true, description: 'checkOut sets isCheckedOut to true', got: b1AfterCheckout },
    { pass: alreadyOut === null, description: 'checkOut returns null if already checked out', got: alreadyOut },
    { pass: available.length === 2, description: 'getAvailableBooks returns 2 (Dune is out)', got: available.length },
    { pass: asimov.length === 2, description: 'getBooksByAuthor returns 2 Asimov books', got: asimov.length },
    { pass: afterReturn.length === 3, description: 'All 3 books available after returnBook', got: afterReturn.length },
  ];
}`);

// ─── 3. BARBER: capture initial state before serveNext mutates it ─────────────
patch('Barber', `(code) => {
  const { Client, BarberShop } = new Function(code + '; return { Client, BarberShop };')();

  const c1 = new Client('Marcus', 'haircut');
  const c2 = new Client('Jordan', 'shave');
  const c3 = new Client('Devon', 'haircut');
  const c4 = new Client('Sam', 'beard trim');

  const shop = new BarberShop('Prestige Cuts');
  shop.addClient(c1);
  shop.addClient(c2);
  shop.addClient(c3);
  shop.addClient(c4);

  const c1InitialIsServed = c1.isServed;        // capture before serveNext
  const initialWaitlistLen = shop.waitlist.length;
  const haircutQueue = shop.getWaitlistByService('haircut');

  const firstServed = shop.serveNext();
  const secondServed = shop.serveNext();
  const c1IsServedAfter = c1.isServed;          // capture after serveNext
  const waitlistAfter = shop.waitlist.length;
  const emptyResult = new BarberShop('Empty Shop').serveNext();

  return [
    { pass: c1InitialIsServed === false, description: 'Client starts with isServed = false', got: c1InitialIsServed },
    { pass: initialWaitlistLen === 4, description: 'Waitlist has 4 clients', got: initialWaitlistLen },
    { pass: haircutQueue.length === 2, description: 'getWaitlistByService returns 2 haircut clients', got: haircutQueue.length },
    { pass: firstServed === c1, description: 'serveNext returns first client in queue (FIFO)', got: firstServed && firstServed.name },
    { pass: c1IsServedAfter === true, description: 'serveNext marks client as isServed = true', got: c1IsServedAfter },
    { pass: waitlistAfter === 2, description: 'Waitlist has 2 clients after serving 2', got: waitlistAfter },
    { pass: shop.totalServed() === 2, description: 'totalServed returns 2', got: shop.totalServed() },
    { pass: emptyResult === null, description: 'serveNext returns null when waitlist is empty', got: emptyResult },
  ];
}`);

// ─── 4. RPG: capture health snapshots before levelUp resets them ─────────────
patch('RPG', `(code) => {
  const { Character, Party } = new Function(code + '; return { Character, Party };')();

  const warrior = new Character('Thorin', 'warrior');
  const mage = new Character('Elara', 'mage');
  const healer = new Character('Pip', 'healer');

  const party = new Party('The Fellowship');
  party.addMember(warrior);
  party.addMember(mage);
  party.addMember(healer);

  warrior.takeDamage(60);
  mage.takeDamage(110);                          // should die

  const warriorHealthAfterDamage = warrior.health;  // 40 — capture before levelUp
  const mageHealthAfterDamage = mage.health;        // 0
  const mageAlive = mage.isAlive;                   // false

  const living = party.getLivingMembers();
  const wiped = party.isWiped();

  const wipedParty = new Party('Empty');
  wipedParty.addMember(new Character('Ghost', 'warrior'));
  wipedParty.members[0].takeDamage(200);

  party.healAll(20);
  const warriorHealthAfterHeal = warrior.health;    // 60 (40+20)
  const mageHealthAfterHeal = mage.health;          // still 0 (dead)

  warrior.levelUp();
  const warriorLevelAfter = warrior.level;
  const warriorHealthAfterLevelUp = warrior.health; // 100 (restored)

  return [
    { pass: warriorHealthAfterDamage === 40, description: 'takeDamage reduces health (100-60=40)', got: warriorHealthAfterDamage },
    { pass: mageHealthAfterDamage === 0, description: 'Overkill damage sets health to 0, not negative', got: mageHealthAfterDamage },
    { pass: mageAlive === false, description: 'Character dies when health reaches 0', got: mageAlive },
    { pass: living.length === 2, description: 'getLivingMembers returns 2 living members', got: living.length },
    { pass: wiped === false, description: 'isWiped is false (2 members still alive)', got: wiped },
    { pass: wipedParty.isWiped() === true, description: 'isWiped returns true when all are dead', got: wipedParty.isWiped() },
    { pass: warriorHealthAfterHeal === 60, description: 'healAll heals living members (+20 → 60)', got: warriorHealthAfterHeal },
    { pass: mageHealthAfterHeal === 0, description: 'healAll does NOT heal dead members', got: mageHealthAfterHeal },
    { pass: warriorLevelAfter === 2, description: 'levelUp increments level to 2', got: warriorLevelAfter },
    { pass: warriorHealthAfterLevelUp === 100, description: 'levelUp restores health to 100', got: warriorHealthAfterLevelUp },
    { pass: party.averageLevel() === (2 + 1 + 1) / 3, description: 'averageLevel returns correct average', got: party.averageLevel() },
  ];
}`);

// ─── 5. VHS: capture isRented before store.return() resets it ────────────────
patch('VHS', `(code) => {
  const { Movie, VHSStore } = new Function(code + '; return { Movie, VHSStore };')();

  const m1 = new Movie('The Matrix', 'sci-fi', 3.99);
  const m2 = new Movie('Alien', 'sci-fi', 3.99);
  const m3 = new Movie('Home Alone', 'comedy', 2.99);

  const store = new VHSStore('Blockbuster');
  store.stock(m1);
  store.stock(m2);
  store.stock(m3);

  const m1InitialIsRented = m1.isRented;         // capture before rent()
  const rented = store.rent('The Matrix');
  const m1IsRentedAfter = m1.isRented;           // capture after rent()
  const revenueAfterRent = store.revenue;
  const alreadyRented = store.rent('The Matrix');
  const available = store.getAvailable();
  const scifi = store.getByGenre('sci-fi');

  store.return('The Matrix');
  const afterReturn = store.getAvailable();

  return [
    { pass: m1InitialIsRented === undefined || m1InitialIsRented === false, description: 'Movie starts not rented', got: m1InitialIsRented },
    { pass: rented === m1, description: 'rent() returns matching Movie', got: rented && rented.title },
    { pass: m1IsRentedAfter === true, description: 'rent() marks movie as isRented = true', got: m1IsRentedAfter },
    { pass: revenueAfterRent === 3.99, description: 'rent() adds rental price to revenue', got: revenueAfterRent },
    { pass: alreadyRented === null, description: 'rent() returns null if already rented', got: alreadyRented },
    { pass: available.length === 2, description: 'getAvailable returns 2 (Matrix is out)', got: available.length },
    { pass: scifi.length === 2, description: 'getByGenre("sci-fi") returns 2', got: scifi.length },
    { pass: afterReturn.length === 3, description: 'All 3 available after return()', got: afterReturn.length },
  ];
}`);

// ─── 6. CRAFTING: capture felt.quantity before restock changes it ─────────────
patch('Crafting', `(code) => {
  const { Supply, CraftingStore } = new Function(code + '; return { Supply, CraftingStore };')();

  const yarn  = new Supply('Yarn', 'fiber', 50, 2.00);
  const beads = new Supply('Beads', 'embellishment', 200, 0.10);
  const felt  = new Supply('Felt', 'fabric', 3, 1.50);

  const store = new CraftingStore('Stitch & Craft');
  store.addSupply(yarn);
  store.addSupply(beads);
  store.addSupply(felt);

  const usedYarn = store.use('Yarn', 10);
  const yarnQtyAfterUse = yarn.quantity;         // 40
  const overUseFelt = store.use('Felt', 10);     // insufficient
  const feltQtyAfterFailedUse = felt.quantity;   // still 3
  store.restock('Felt', 7);
  const feltQtyAfterRestock = felt.quantity;     // 10

  const fabric = store.getByCategory('fabric');
  const lowStock = store.getLowStock(5);
  const value = store.inventoryValue();

  return [
    { pass: yarn.isInStock() === true, description: 'Yarn isInStock is true (qty 40 after use)', got: yarn.isInStock() },
    { pass: beads.totalValue() === 20, description: 'Beads totalValue is 20 (200 * 0.10)', got: beads.totalValue() },
    { pass: usedYarn === true, description: 'use() returns true when sufficient stock', got: usedYarn },
    { pass: yarnQtyAfterUse === 40, description: 'use() decreases quantity (50 - 10 = 40)', got: yarnQtyAfterUse },
    { pass: overUseFelt === false, description: 'use() returns false when insufficient', got: overUseFelt },
    { pass: feltQtyAfterFailedUse === 3, description: 'use() does NOT deduct when insufficient', got: feltQtyAfterFailedUse },
    { pass: feltQtyAfterRestock === 10, description: 'restock() increases quantity (3 + 7 = 10)', got: feltQtyAfterRestock },
    { pass: fabric.length === 1 && fabric[0] === felt, description: 'getByCategory("fabric") returns felt', got: fabric.length },
    { pass: lowStock.every(s => s.quantity <= 5), description: 'getLowStock(5) only returns items with qty <= 5', got: lowStock.map(s => s.name + ':' + s.quantity).join(', ') },
    { pass: typeof value === 'number' && value > 0, description: 'inventoryValue() returns a positive number', got: value },
  ];
}`);

// ─── 7. SPA: capture initial status before completeNext() runs ───────────────
patch('Spa', `(code) => {
  const { Appointment, Spa } = new Function(code + '; return { Appointment, Spa };')();

  const a1 = new Appointment('Maria',  'massage',  60, 90);
  const a2 = new Appointment('Devon',  'facial',   45, 75);
  const a3 = new Appointment('Chris',  'manicure', 30, 40);
  const a4 = new Appointment('Maria',  'pedicure', 30, 40);

  const spa = new Spa('Serenity Spa');
  spa.book(a1); spa.book(a2); spa.book(a3); spa.book(a4);

  const a1InitialStatus = a1.status;             // capture before completeNext
  const a1InitialIsActive = a1.isActive();       // capture before completeNext

  const cancelled = spa.cancel('Devon');
  const schedule = spa.getSchedule();

  const completed = spa.completeNext();          // completes a1
  const a1StatusAfter = a1.status;               // completed
  const revenueAfter = spa.getRevenue();
  const scheduleAfter = spa.getSchedule().length;

  return [
    { pass: a1InitialStatus === 'booked', description: 'Appointment starts with status "booked"', got: a1InitialStatus },
    { pass: a1InitialIsActive === true, description: 'isActive() returns true for booked appointment', got: a1InitialIsActive },
    { pass: cancelled === a2, description: 'cancel() returns the cancelled Appointment', got: cancelled && cancelled.clientName },
    { pass: a2.status === 'cancelled', description: 'Cancelled appointment has status "cancelled"', got: a2.status },
    { pass: schedule.length === 3, description: 'getSchedule returns 3 (Devon cancelled)', got: schedule.length },
    { pass: completed === a1, description: 'completeNext() completes first booked appt (Maria/massage)', got: completed && completed.service },
    { pass: a1StatusAfter === 'completed', description: 'Completed appointment has status "completed"', got: a1StatusAfter },
    { pass: revenueAfter === 90, description: 'getRevenue returns 90 (only completed appts)', got: revenueAfter },
    { pass: scheduleAfter === 2, description: 'getSchedule shows 2 after Maria/massage completed', got: scheduleAfter },
  ];
}`);

// ─── WRITE ────────────────────────────────────────────────────────────────────
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('\n✓ All patches applied');
