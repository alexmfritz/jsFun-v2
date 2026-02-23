#!/usr/bin/env node
'use strict';
/**
 * Tier 5: RPG Full System — 5 interacting classes
 *
 * Class hierarchy:
 *   Item         — base data: name, type, power, value
 *   Inventory    — owns Item[], has capacity, equip slot
 *   Character    — owns an Inventory, has stats, can equip/use items
 *   Quest        — has a reward Item, required level, completion state
 *   Party        — owns Character[], manages quests, aggregates across 3 layers
 *
 * What makes this Tier 5:
 *   - Composition within composition (Party → Character → Inventory → Item)
 *   - Inventory capacity constraint that cascades through Character methods
 *   - Quest.complete() distributes reward Items to every eligible Character
 *   - Party power requires traversing 3 class boundaries
 *   - Getters that compute from nested state (character.power, party.averagePower)
 *   - Guard clauses that interact across class boundaries
 *   - Dead characters can't receive rewards, full inventories reject items
 */
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
const nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

// ─── The Exercise ─────────────────────────────────────────────────────────────
const exercise = {
  id: nextId,
  title: '⚔️ RPG Full System: Item + Inventory + Character + Quest + Party',
  type: 'js',
  tier: 5,
  category: ['classes', 'oop', 'multi-class'],
  tags: ['classes', 'oop', 'tier5', 'composition', 'multi-class', 'rpg', 'inventory', 'quest'],
  description: 'Build a complete RPG system with 5 interacting classes. Characters own Inventories that hold Items. Parties manage Characters and run Quests that reward everyone on completion.',

  instructions: `Build five classes that all interact with each other.

---

### \`Item\`
Constructor: \`(name, type, power, value)\`
- \`this.name\`, \`this.type\` (\`"weapon"\`, \`"armor"\`, \`"potion"\`), \`this.power\`, \`this.value\`

---

### \`Inventory\`
Constructor: \`(capacity)\`
- \`this.capacity\` (max number of items), \`this.items = []\`, \`this.equipped = null\`
- \`add(item)\` — adds item if not at capacity. Returns \`true\` if added, \`false\` if full
- \`remove(itemName)\` — removes first item with that name, returns it (or \`null\`)
- \`equip(itemName)\` — sets \`this.equipped\` to the item with that name (must already be in items). Returns \`true\` or \`false\`
- \`getByType(type)\` — returns all items of that type
- \`totalValue()\` — sum of all item values
- \`isFull()\` — returns \`true\` if at capacity

---

### \`Character\`
Constructor: \`(name, role)\`
- \`this.name\`, \`this.role\` (\`"warrior"\`, \`"mage"\`, \`"rogue"\`), \`this.level = 1\`
- \`this.health = 100\`, \`this.maxHealth = 100\`, \`this.isAlive = true\`
- \`this.inventory = new Inventory(6)\` — every character starts with a 6-slot inventory
- \`get power()\` — **getter** — returns: base power \`(this.level * 10)\` + equipped item's power if any, else 0
- \`takeDamage(amount)\` — reduce health, floor at 0, set \`isAlive = false\` if dead
- \`heal(amount)\` — add to health, cap at \`maxHealth\`. Only if alive.
- \`levelUp()\` — increment level, restore health to maxHealth
- \`pickUp(item)\` — calls \`this.inventory.add(item)\`, returns what add() returns
- \`usePotion()\` — finds first \`"potion"\` in inventory, removes it, heals by its \`power\`. Returns \`true\` if used, \`false\` if no potions.

---

### \`Quest\`
Constructor: \`(name, requiredLevel, reward)\`
- \`this.name\`, \`this.requiredLevel\`, \`this.reward\` (an Item instance)
- \`this.isCompleted = false\`
- \`canAttempt(character)\` — returns \`true\` if character is alive and level >= requiredLevel
- \`complete(party)\` — marks \`isCompleted = true\`, then calls \`party.distributeReward(this.reward)\`. Returns count of characters who received the reward.

---

### \`Party\`
Constructor: \`(name)\`
- \`this.name\`, \`this.members = []\`, \`this.completedQuests = []\`
- \`addMember(character)\` — adds to members
- \`getLivingMembers()\` — members where \`isAlive === true\`
- \`get averagePower()\` — **getter** — average \`power\` of all living members (0 if none)
- \`get strongestMember()\` — **getter** — living member with highest \`power\`
- \`distributeReward(item)\` — gives a **copy** of the item to every living member whose inventory is not full. Returns count of members who received it. (Create new Item instances: \`new Item(item.name, item.type, item.power, item.value)\`)
- \`healAll(amount)\` — calls \`heal(amount)\` on every living member
- \`runQuest(quest)\` — if quest is not completed and at least one member can attempt it, call \`quest.complete(this)\`, push quest to \`completedQuests\`, return \`true\`. Otherwise return \`false\`.`,

  starterCode: `class Item {
  constructor(name, type, power, value) {
    // your code here
  }
}

class Inventory {
  constructor(capacity) {
    // your code here
  }

  add(item) {
    // your code here
  }

  remove(itemName) {
    // your code here
  }

  equip(itemName) {
    // your code here
  }

  getByType(type) {
    // your code here
  }

  totalValue() {
    // your code here
  }

  isFull() {
    // your code here
  }
}

class Character {
  constructor(name, role) {
    // your code here
  }

  get power() {
    // your code here
  }

  takeDamage(amount) {
    // your code here
  }

  heal(amount) {
    // your code here
  }

  levelUp() {
    // your code here
  }

  pickUp(item) {
    // your code here
  }

  usePotion() {
    // your code here
  }
}

class Quest {
  constructor(name, requiredLevel, reward) {
    // your code here
  }

  canAttempt(character) {
    // your code here
  }

  complete(party) {
    // your code here
  }
}

class Party {
  constructor(name) {
    // your code here
  }

  addMember(character) {
    // your code here
  }

  getLivingMembers() {
    // your code here
  }

  get averagePower() {
    // your code here
  }

  get strongestMember() {
    // your code here
  }

  distributeReward(item) {
    // your code here
  }

  healAll(amount) {
    // your code here
  }

  runQuest(quest) {
    // your code here
  }
}`,

  solution: `class Item {
  constructor(name, type, power, value) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.value = value;
  }
}

class Inventory {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
    this.equipped = null;
  }

  add(item) {
    if (this.isFull()) return false;
    this.items.push(item);
    return true;
  }

  remove(itemName) {
    const idx = this.items.findIndex(i => i.name === itemName);
    if (idx === -1) return null;
    const [item] = this.items.splice(idx, 1);
    if (this.equipped && this.equipped.name === itemName) this.equipped = null;
    return item;
  }

  equip(itemName) {
    const item = this.items.find(i => i.name === itemName);
    if (!item) return false;
    this.equipped = item;
    return true;
  }

  getByType(type) {
    return this.items.filter(i => i.type === type);
  }

  totalValue() {
    return this.items.reduce((sum, i) => sum + i.value, 0);
  }

  isFull() {
    return this.items.length >= this.capacity;
  }
}

class Character {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.level = 1;
    this.health = 100;
    this.maxHealth = 100;
    this.isAlive = true;
    this.inventory = new Inventory(6);
  }

  get power() {
    const equipped = this.inventory.equipped;
    return this.level * 10 + (equipped ? equipped.power : 0);
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) this.isAlive = false;
  }

  heal(amount) {
    if (!this.isAlive) return;
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  levelUp() {
    this.level += 1;
    this.health = this.maxHealth;
  }

  pickUp(item) {
    return this.inventory.add(item);
  }

  usePotion() {
    const potion = this.inventory.items.find(i => i.type === 'potion');
    if (!potion) return false;
    this.inventory.remove(potion.name);
    this.heal(potion.power);
    return true;
  }
}

class Quest {
  constructor(name, requiredLevel, reward) {
    this.name = name;
    this.requiredLevel = requiredLevel;
    this.reward = reward;
    this.isCompleted = false;
  }

  canAttempt(character) {
    return character.isAlive && character.level >= this.requiredLevel;
  }

  complete(party) {
    this.isCompleted = true;
    return party.distributeReward(this.reward);
  }
}

class Party {
  constructor(name) {
    this.name = name;
    this.members = [];
    this.completedQuests = [];
  }

  addMember(character) {
    this.members.push(character);
  }

  getLivingMembers() {
    return this.members.filter(m => m.isAlive);
  }

  get averagePower() {
    const living = this.getLivingMembers();
    if (living.length === 0) return 0;
    return living.reduce((sum, m) => sum + m.power, 0) / living.length;
  }

  get strongestMember() {
    const living = this.getLivingMembers();
    if (living.length === 0) return null;
    return living.reduce((strongest, m) => m.power > strongest.power ? m : strongest, living[0]);
  }

  distributeReward(item) {
    const living = this.getLivingMembers();
    let count = 0;
    living.forEach(member => {
      if (!member.inventory.isFull()) {
        member.inventory.add(new Item(item.name, item.type, item.power, item.value));
        count++;
      }
    });
    return count;
  }

  healAll(amount) {
    this.getLivingMembers().forEach(m => m.heal(amount));
  }

  runQuest(quest) {
    if (quest.isCompleted) return false;
    const canRun = this.members.some(m => quest.canAttempt(m));
    if (!canRun) return false;
    quest.complete(this);
    this.completedQuests.push(quest);
    return true;
  }
}`,

  testRunner: `(code) => {
  const { Item, Inventory, Character, Quest, Party } =
    new Function(code + '; return { Item, Inventory, Character, Quest, Party };')();

  // ── Item ──────────────────────────────────────────────────────────────
  const sword    = new Item('Iron Sword', 'weapon', 25, 100);
  const potion   = new Item('Health Potion', 'potion', 50, 30);
  const shield   = new Item('Oak Shield', 'armor', 15, 80);

  // ── Inventory ─────────────────────────────────────────────────────────
  const inv = new Inventory(2);
  const addResult1 = inv.add(sword);
  const addResult2 = inv.add(potion);
  const addResult3 = inv.add(shield);      // should fail — full
  const invFull = inv.isFull();
  const equipResult = inv.equip('Iron Sword');
  const equipBad    = inv.equip('Nonexistent');
  const removedItem = inv.remove('Iron Sword');
  const equipAfterRemove = inv.equipped;   // should be null (equipped item was removed)
  const totalVal = new Inventory(5);
  [sword, potion, shield].forEach(i => totalVal.add(i));

  // ── Character ─────────────────────────────────────────────────────────
  const warrior = new Character('Thorin', 'warrior');
  const mage    = new Character('Elara', 'mage');
  const rogue   = new Character('Shade', 'rogue');

  const basePower = warrior.power;         // level 1, no equip = 10
  warrior.pickUp(new Item('Iron Sword', 'weapon', 25, 100));
  warrior.inventory.equip('Iron Sword');
  const powWithSword = warrior.power;      // 10 + 25 = 35

  warrior.takeDamage(40);
  const warriorHealthAfterDmg = warrior.health; // 60

  warrior.pickUp(new Item('Health Potion', 'potion', 50, 30));
  const potionUsed = warrior.usePotion();
  const warriorHealthAfterPotion = warrior.health; // min(100, 60+50) = 100
  const noPotionResult = warrior.usePotion();      // no more potions

  mage.takeDamage(200);                    // kill mage
  const mageAlive = mage.isAlive;
  const mageHealAttempt = mage.health;
  mage.heal(50);                           // should NOT heal (dead)
  const mageHealthAfterDeadHeal = mage.health;

  warrior.levelUp();
  const warriorLevelAfter = warrior.level; // 2
  const powAfterLevelUp = warrior.power;   // 2*10 + 25 (sword still equipped) = 45

  rogue.levelUp(); rogue.levelUp();        // rogue is level 3

  // ── Quest ─────────────────────────────────────────────────────────────
  const gemReward = new Item('Ruby Gem', 'armor', 20, 150);
  const quest = new Quest('Cave of Trials', 2, gemReward);

  const questCanAttemptWarrior = quest.canAttempt(warrior); // true — alive, level 2
  const questCanAttemptMage    = quest.canAttempt(mage);    // false — dead
  const questCanAttemptRogue   = quest.canAttempt(rogue);   // true — level 3 >= 2

  // ── Party ─────────────────────────────────────────────────────────────
  const party = new Party('The Ironclads');
  party.addMember(warrior);
  party.addMember(mage);    // dead
  party.addMember(rogue);

  const livingBefore = party.getLivingMembers().length; // 2

  const rogueInitialPower = rogue.power;   // level 3 * 10 = 30, no equip
  const avgPowerBefore = party.averagePower; // (45 + 30) / 2 = 37.5
  const strongest = party.strongestMember;  // warrior (45 > 30)

  const questRan = party.runQuest(quest);
  const questCompletedFlag = quest.isCompleted;
  const questRanAgain = party.runQuest(quest); // already completed -> false

  // After quest: warrior and rogue each got a Ruby Gem (mage dead)
  const warriorGems = warrior.inventory.getByType('armor').filter(i => i.name === 'Ruby Gem');
  const rogueGems   = rogue.inventory.getByType('armor').filter(i => i.name === 'Ruby Gem');
  const mageGems    = mage.inventory.getByType('armor').filter(i => i.name === 'Ruby Gem');

  party.healAll(30);
  const rogueHealthAfterHealAll = rogue.health; // 100 (was 100)
  // mage is dead — healAll should NOT heal her
  const mageHealthAfterHealAll = mage.health;   // still 0

  // Full inventory test: fill rogue to capacity
  const tinyPack = new Character('Packer', 'warrior');
  const smallInv = new Inventory(1);
  smallInv.add(new Item('Junk', 'armor', 1, 1));
  tinyPack.inventory = smallInv;
  const blockedAdd = tinyPack.pickUp(new Item('Extra', 'weapon', 5, 5));

  return [
    // ── Item ──
    { pass: sword.name === 'Iron Sword',   description: 'Item: name stored correctly',  got: sword.name },
    { pass: sword.type === 'weapon',       description: 'Item: type stored correctly',  got: sword.type },
    { pass: sword.power === 25,            description: 'Item: power stored correctly', got: sword.power },
    { pass: sword.value === 100,           description: 'Item: value stored correctly', got: sword.value },

    // ── Inventory ──
    { pass: addResult1 === true,           description: 'Inventory.add() returns true when space available', got: addResult1 },
    { pass: addResult3 === false,          description: 'Inventory.add() returns false when full',           got: addResult3 },
    { pass: invFull === true,              description: 'Inventory.isFull() returns true at capacity',       got: invFull },
    { pass: equipResult === true,          description: 'Inventory.equip() returns true for valid item',     got: equipResult },
    { pass: equipBad === false,            description: 'Inventory.equip() returns false for unknown item',  got: equipBad },
    { pass: removedItem === sword,         description: 'Inventory.remove() returns the removed item',       got: removedItem && removedItem.name },
    { pass: equipAfterRemove === null,     description: 'Inventory.remove() clears equipped if that item removed', got: equipAfterRemove },
    { pass: totalVal.totalValue() === 210, description: 'Inventory.totalValue() sums all item values (100+30+80)', got: totalVal.totalValue() },

    // ── Character ──
    { pass: basePower === 10,              description: 'Character.power getter: level 1, no equip = 10',    got: basePower },
    { pass: powWithSword === 35,           description: 'Character.power getter: level 1 + sword 25 = 35',   got: powWithSword },
    { pass: warriorHealthAfterDmg === 60,  description: 'Character.takeDamage() reduces health correctly',   got: warriorHealthAfterDmg },
    { pass: potionUsed === true,           description: 'Character.usePotion() returns true and heals',      got: potionUsed },
    { pass: warriorHealthAfterPotion === 100, description: 'Character.usePotion() heals up (capped at maxHealth)', got: warriorHealthAfterPotion },
    { pass: noPotionResult === false,      description: 'Character.usePotion() returns false with no potions', got: noPotionResult },
    { pass: mageAlive === false,           description: 'Character dies when health reaches 0',              got: mageAlive },
    { pass: mageHealthAfterDeadHeal === mageHealAttempt, description: 'Character.heal() does nothing when dead', got: mageHealthAfterDeadHeal },
    { pass: warriorLevelAfter === 2,       description: 'Character.levelUp() increments level',              got: warriorLevelAfter },
    { pass: powAfterLevelUp === 45,        description: 'Character.power after levelUp: 2*10 + sword 25 = 45', got: powAfterLevelUp },
    { pass: blockedAdd === false,          description: 'Character.pickUp() returns false when inventory full', got: blockedAdd },

    // ── Quest ──
    { pass: questCanAttemptWarrior === true,  description: 'Quest.canAttempt() true: alive & level >= required', got: questCanAttemptWarrior },
    { pass: questCanAttemptMage === false,    description: 'Quest.canAttempt() false: dead character',           got: questCanAttemptMage },
    { pass: questCanAttemptRogue === true,    description: 'Quest.canAttempt() true: rogue level 3 >= 2',        got: questCanAttemptRogue },

    // ── Party ──
    { pass: livingBefore === 2,            description: 'Party.getLivingMembers() returns 2 (mage is dead)',  got: livingBefore },
    { pass: Math.abs(avgPowerBefore - 37.5) < 0.01, description: 'Party.averagePower getter: (45+30)/2 = 37.5', got: avgPowerBefore },
    { pass: strongest === warrior,         description: 'Party.strongestMember getter: warrior (45 > 30)',    got: strongest && strongest.name },
    { pass: questRan === true,             description: 'Party.runQuest() returns true on success',           got: questRan },
    { pass: questCompletedFlag === true,   description: 'runQuest() marks quest.isCompleted = true',         got: questCompletedFlag },
    { pass: questRanAgain === false,       description: 'Party.runQuest() returns false if already completed', got: questRanAgain },
    { pass: party.completedQuests.length === 1, description: 'completedQuests has 1 entry after quest run',  got: party.completedQuests.length },
    { pass: warriorGems.length === 1,      description: 'Warrior received Ruby Gem reward',                  got: warriorGems.length },
    { pass: rogueGems.length === 1,        description: 'Rogue received Ruby Gem reward',                    got: rogueGems.length },
    { pass: mageGems.length === 0,         description: 'Dead mage did NOT receive reward',                  got: mageGems.length },
    { pass: mageHealthAfterHealAll === 0,  description: 'Party.healAll() skips dead members',                got: mageHealthAfterHealAll },
  ];
}`,

  hint: `This exercise chains across five classes. Start small — get Item working, then Inventory, then Character (which uses Inventory internally), then Quest, then Party last.

Key patterns:
- \`get power()\` is a getter — use \`get power() { ... }\` syntax, accessed as \`character.power\` (no parentheses)
- \`distributeReward\` must create NEW Item instances for each member — don't share the same object or removing it from one inventory removes it from all
- \`remove()\` should also clear \`this.equipped\` if the removed item was the one equipped
- \`runQuest()\` checks both: quest not already completed AND at least one member can attempt it
- \`usePotion()\` removes the potion FIRST, then heals — so the potion is consumed even if at full health`,

  resources: [],
};

// ─── Add collection ──────────────────────────────────────────────────────────
const collection = {
  id: 'tier5-rpg-system',
  name: '⚔️ Tier 5: RPG Full System',
  description: 'Five interacting classes — Item, Inventory, Character, Quest, Party. Composition within composition: Party methods traverse three class boundaries to compute aggregated stats.',
  color: '#dc2626',
  exerciseIds: [exercise.id],
};

// ─── Self-validate before writing ────────────────────────────────────────────
console.log('Self-validating solution against test runner...');
try {
  const fn = new Function('code', 'return (' + exercise.testRunner + ')(code)');
  const results = fn(exercise.solution);
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass);

  if (failed.length > 0) {
    console.error('\n✗ VALIDATION FAILED:');
    failed.forEach(r => console.error('  ✗', r.description, '— got:', r.got));
    process.exit(1);
  }

  console.log(`✓ All ${passed}/${results.length} test cases pass\n`);
} catch (err) {
  console.error('✗ CRASH during validation:', err.message);
  process.exit(1);
}

// ─── Write ────────────────────────────────────────────────────────────────────
data.exercises.push(exercise);
data.collections.push(collection);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

console.log(`✓ Added: "${exercise.title}" (ID ${exercise.id})`);
console.log(`✓ Tier: ${exercise.tier}`);
console.log(`✓ Classes: Item, Inventory, Character, Quest, Party`);
console.log(`✓ Total exercises: ${data.exercises.length}`);
