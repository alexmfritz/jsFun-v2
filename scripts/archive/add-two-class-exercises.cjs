#!/usr/bin/env node
'use strict';
/**
 * Two-class interaction exercises
 * Inspired by Turing School javascript-foundations:
 *   DJ, Spotify, Airport, Library, RPG, TacoStand, Barber, Classroom, VHS, Restaurant
 *
 * The core pattern: Class A owns a collection of Class B instances.
 * Methods traverse/filter/aggregate across that collection.
 * This is the key OOP concept Turing emphasizes beyond basic class syntax.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../exercises/exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
let nextId = Math.max(...data.exercises.map(e => e.id)) + 1;

function ex(title, subcategory, tags, tier, description, instructions, starterCode, solution, testRunner, hint) {
  return {
    id: nextId++,
    title,
    type: 'js',
    tier,
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

// ─── Two-class test runner template ──────────────────────────────────────────
// All exercises: student writes BOTH classes in one code block.
// We extract them via new Function() and run assertions.

const exercises = [];

// ─────────────────────────────────────────────────────────────────────────────
// 1. 🎧 DJ + Song  (Tier 2)
//    The foundational Turing two-class pattern.
//    Song has title, artist, duration.
//    DJ has name, songs[]. addSong(), playSong(), totalDuration(), getSongsByArtist().
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🎧 DJ + Song',
  'two-class',
  ['classes', 'oop', 'two-class', 'dj', 'composition', 'tier2'],
  2,
  'Build a Song class and a DJ class. A DJ has a collection of Songs and methods to manage their set list.',
  `Create two classes: **Song** and **DJ**.

**Song** constructor takes \`(title, artist, duration)\`:
- \`this.title\`, \`this.artist\`, \`this.duration\` (number of seconds)

**DJ** constructor takes \`(name)\`:
- \`this.name\`, \`this.songs = []\`
- \`addSong(song)\` — adds a Song instance to \`this.songs\`
- \`playSong(title)\` — returns the song whose title matches, or \`null\` if not found
- \`totalDuration()\` — returns the sum of all song durations
- \`getSongsByArtist(artist)\` — returns an array of songs by that artist`,

  `class Song {
  constructor(title, artist, duration) {
    // your code here
  }
}

class DJ {
  constructor(name) {
    // your code here
  }

  addSong(song) {
    // your code here
  }

  playSong(title) {
    // your code here
  }

  totalDuration() {
    // your code here
  }

  getSongsByArtist(artist) {
    // your code here
  }
}`,

  `class Song {
  constructor(title, artist, duration) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
  }
}

class DJ {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }

  playSong(title) {
    return this.songs.find(s => s.title === title) || null;
  }

  totalDuration() {
    return this.songs.reduce((sum, s) => sum + s.duration, 0);
  }

  getSongsByArtist(artist) {
    return this.songs.filter(s => s.artist === artist);
  }
}`,

  `(code) => {
  const { Song, DJ } = new Function(code + '; return { Song, DJ };')();

  const song1 = new Song('Blinding Lights', 'The Weeknd', 200);
  const song2 = new Song('Save Your Tears', 'The Weeknd', 215);
  const song3 = new Song('Levitating', 'Dua Lipa', 203);

  const dj = new DJ('DJ Alex');
  dj.addSong(song1);
  dj.addSong(song2);
  dj.addSong(song3);

  const found = dj.playSong('Levitating');
  const notFound = dj.playSong('Ghost');
  const weekndSongs = dj.getSongsByArtist('The Weeknd');

  return [
    { pass: song1.title === 'Blinding Lights', description: 'Song has correct title', got: song1.title },
    { pass: song1.artist === 'The Weeknd', description: 'Song has correct artist', got: song1.artist },
    { pass: song1.duration === 200, description: 'Song has correct duration', got: song1.duration },
    { pass: dj.name === 'DJ Alex', description: 'DJ has correct name', got: dj.name },
    { pass: dj.songs.length === 3, description: 'DJ has 3 songs after addSong x3', got: dj.songs.length },
    { pass: found === song3, description: 'playSong returns matching Song instance', got: found?.title },
    { pass: notFound === null, description: 'playSong returns null when not found', got: notFound },
    { pass: dj.totalDuration() === 618, description: 'totalDuration sums all durations (618)', got: dj.totalDuration() },
    { pass: weekndSongs.length === 2, description: 'getSongsByArtist returns 2 Weeknd songs', got: weekndSongs.length },
    { pass: weekndSongs.every(s => s.artist === 'The Weeknd'), description: 'getSongsByArtist only returns correct artist', got: weekndSongs.map(s => s.artist).join(', ') },
  ];
}`,

  `Song is a plain data class — title, artist, duration in the constructor. DJ owns an array of Song instances. playSong uses Array.find(), getSongsByArtist uses Array.filter(), totalDuration uses Array.reduce(). Both classes go in the same code block.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 2. ✈️ Airport + Plane  (Tier 2)
//    Airport has a gates[] and methods to land, depart, findBy.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '✈️ Airport + Plane',
  'two-class',
  ['classes', 'oop', 'two-class', 'airport', 'composition', 'tier2'],
  2,
  'Build a Plane class and an Airport class. The Airport tracks which planes have landed and manages gate assignments.',
  `Create two classes: **Plane** and **Airport**.

**Plane** constructor takes \`(flightNumber, airline, destination)\`:
- \`this.flightNumber\`, \`this.airline\`, \`this.destination\`
- \`this.isLanded = false\`

**Airport** constructor takes \`(name)\`:
- \`this.name\`, \`this.planes = []\`
- \`land(plane)\` — sets \`plane.isLanded = true\`, adds it to \`this.planes\`
- \`depart(flightNumber)\` — removes the plane with that flight number from \`this.planes\`, sets its \`isLanded = false\`. Returns the departed plane.
- \`getFlightsByAirline(airline)\` — returns an array of landed planes for that airline
- \`hasDestination(destination)\` — returns \`true\` if any landed plane is going to that destination`,

  `class Plane {
  constructor(flightNumber, airline, destination) {
    // your code here
  }
}

class Airport {
  constructor(name) {
    // your code here
  }

  land(plane) {
    // your code here
  }

  depart(flightNumber) {
    // your code here
  }

  getFlightsByAirline(airline) {
    // your code here
  }

  hasDestination(destination) {
    // your code here
  }
}`,

  `class Plane {
  constructor(flightNumber, airline, destination) {
    this.flightNumber = flightNumber;
    this.airline = airline;
    this.destination = destination;
    this.isLanded = false;
  }
}

class Airport {
  constructor(name) {
    this.name = name;
    this.planes = [];
  }

  land(plane) {
    plane.isLanded = true;
    this.planes.push(plane);
  }

  depart(flightNumber) {
    const idx = this.planes.findIndex(p => p.flightNumber === flightNumber);
    if (idx === -1) return null;
    const [plane] = this.planes.splice(idx, 1);
    plane.isLanded = false;
    return plane;
  }

  getFlightsByAirline(airline) {
    return this.planes.filter(p => p.airline === airline);
  }

  hasDestination(destination) {
    return this.planes.some(p => p.destination === destination);
  }
}`,

  `(code) => {
  const { Plane, Airport } = new Function(code + '; return { Plane, Airport };')();

  const p1 = new Plane('UA101', 'United', 'Denver');
  const p2 = new Plane('DL202', 'Delta', 'Atlanta');
  const p3 = new Plane('UA303', 'United', 'Chicago');
  const airport = new Airport('O\'Hare');

  airport.land(p1);
  airport.land(p2);
  airport.land(p3);

  const unitedFlights = airport.getFlightsByAirline('United');
  const hasAtlanta = airport.hasDestination('Atlanta');
  const hasMiami = airport.hasDestination('Miami');

  const departed = airport.depart('DL202');

  return [
    { pass: p1.isLanded === false, description: 'Plane starts with isLanded = false', got: p1.isLanded },
    { pass: airport.planes.length === 3, description: 'Airport has 3 planes after landing 3', got: airport.planes.length },
    { pass: p1.isLanded === true, description: 'land() sets plane.isLanded to true', got: p1.isLanded },
    { pass: unitedFlights.length === 2, description: 'getFlightsByAirline returns 2 United flights', got: unitedFlights.length },
    { pass: hasAtlanta === true, description: 'hasDestination("Atlanta") is true', got: hasAtlanta },
    { pass: hasMiami === false, description: 'hasDestination("Miami") is false', got: hasMiami },
    { pass: departed === p2, description: 'depart() returns the departed Plane instance', got: departed?.flightNumber },
    { pass: departed.isLanded === false, description: 'departed plane has isLanded set back to false', got: departed?.isLanded },
    { pass: airport.planes.length === 2, description: 'Airport has 2 planes after departure', got: airport.planes.length },
  ];
}`,

  `Plane starts with isLanded = false — land() flips it to true and adds to the array. depart() uses findIndex + splice to remove from the array, then resets isLanded. hasDestination uses Array.some() — it returns true as soon as ONE match is found.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 3. 📚 Library + Book  (Tier 2)
//    Library tracks a catalog. Books can be checked out and returned.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '📚 Library + Book',
  'two-class',
  ['classes', 'oop', 'two-class', 'library', 'composition', 'tier2'],
  2,
  'Build a Book class and a Library class. The Library manages a catalog and tracks which books are checked out.',
  `Create two classes: **Book** and **Library**.

**Book** constructor takes \`(title, author, year)\`:
- \`this.title\`, \`this.author\`, \`this.year\`
- \`this.isCheckedOut = false\`

**Library** constructor takes \`(name)\`:
- \`this.name\`, \`this.catalog = []\`
- \`addBook(book)\` — adds a Book to the catalog
- \`checkOut(title)\` — finds the book by title, sets \`isCheckedOut = true\`, returns the book (or \`null\` if not found or already checked out)
- \`returnBook(title)\` — finds the book, sets \`isCheckedOut = false\`
- \`getAvailableBooks()\` — returns all books where \`isCheckedOut === false\`
- \`getBooksByAuthor(author)\` — returns all books by that author (regardless of availability)`,

  `class Book {
  constructor(title, author, year) {
    // your code here
  }
}

class Library {
  constructor(name) {
    // your code here
  }

  addBook(book) {
    // your code here
  }

  checkOut(title) {
    // your code here
  }

  returnBook(title) {
    // your code here
  }

  getAvailableBooks() {
    // your code here
  }

  getBooksByAuthor(author) {
    // your code here
  }
}`,

  `class Book {
  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isCheckedOut = false;
  }
}

class Library {
  constructor(name) {
    this.name = name;
    this.catalog = [];
  }

  addBook(book) {
    this.catalog.push(book);
  }

  checkOut(title) {
    const book = this.catalog.find(b => b.title === title);
    if (!book || book.isCheckedOut) return null;
    book.isCheckedOut = true;
    return book;
  }

  returnBook(title) {
    const book = this.catalog.find(b => b.title === title);
    if (book) book.isCheckedOut = false;
  }

  getAvailableBooks() {
    return this.catalog.filter(b => !b.isCheckedOut);
  }

  getBooksByAuthor(author) {
    return this.catalog.filter(b => b.author === author);
  }
}`,

  `(code) => {
  const { Book, Library } = new Function(code + '; return { Book, Library };')();

  const b1 = new Book('Dune', 'Frank Herbert', 1965);
  const b2 = new Book('Foundation', 'Isaac Asimov', 1951);
  const b3 = new Book('Foundation and Empire', 'Isaac Asimov', 1952);

  const lib = new Library('City Library');
  lib.addBook(b1);
  lib.addBook(b2);
  lib.addBook(b3);

  const checkedOut = lib.checkOut('Dune');
  const alreadyOut = lib.checkOut('Dune');
  const available = lib.getAvailableBooks();
  const asimov = lib.getBooksByAuthor('Isaac Asimov');

  lib.returnBook('Dune');
  const afterReturn = lib.getAvailableBooks();

  return [
    { pass: b1.isCheckedOut === false, description: 'Book starts with isCheckedOut = false', got: b1.isCheckedOut },
    { pass: lib.catalog.length === 3, description: 'Library has 3 books in catalog', got: lib.catalog.length },
    { pass: checkedOut === b1, description: 'checkOut returns the Book instance', got: checkedOut?.title },
    { pass: b1.isCheckedOut === true, description: 'checkOut sets isCheckedOut to true', got: b1.isCheckedOut },
    { pass: alreadyOut === null, description: 'checkOut returns null if already checked out', got: alreadyOut },
    { pass: available.length === 2, description: 'getAvailableBooks returns 2 (Dune is out)', got: available.length },
    { pass: asimov.length === 2, description: 'getBooksByAuthor returns 2 Asimov books', got: asimov.length },
    { pass: afterReturn.length === 3, description: 'All 3 books available after returnBook', got: afterReturn.length },
  ];
}`,

  `checkOut should guard against two cases: book not in catalog, and book already checked out — both return null. Use Array.find() to locate books by title. The key insight: mutating book.isCheckedOut directly modifies the object in the catalog array, because it's a reference.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 4. 🌮 Taco Stand + Taco  (Tier 2)
//    TacoStand tracks an order queue. Tacos have ingredients.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🌮 Taco Stand + Taco',
  'two-class',
  ['classes', 'oop', 'two-class', 'taco', 'composition', 'tier2'],
  2,
  'Build a Taco class and a TacoStand class. The stand manages orders and can query its menu.',
  `Create two classes: **Taco** and **TacoStand**.

**Taco** constructor takes \`(protein, toppings, price)\`:
- \`this.protein\` (string, e.g. \`"chicken"\`)
- \`this.toppings\` (array of strings, e.g. \`["salsa", "cheese"]\`)
- \`this.price\` (number)
- \`describe()\` — returns a string: \`"<protein> taco with <topping1>, <topping2>"\` (join toppings with \`", "\`)

**TacoStand** constructor takes \`(name)\`:
- \`this.name\`, \`this.menu = []\`, \`this.totalSales = 0\`
- \`addToMenu(taco)\` — adds a Taco to the menu
- \`sell(protein)\` — finds first taco on menu with that protein, adds its price to totalSales, returns the taco (or \`null\` if not found)
- \`getTacosByTopping(topping)\` — returns all tacos that include that topping
- \`mostExpensive()\` — returns the most expensive taco on the menu`,

  `class Taco {
  constructor(protein, toppings, price) {
    // your code here
  }

  describe() {
    // your code here
  }
}

class TacoStand {
  constructor(name) {
    // your code here
  }

  addToMenu(taco) {
    // your code here
  }

  sell(protein) {
    // your code here
  }

  getTacosByTopping(topping) {
    // your code here
  }

  mostExpensive() {
    // your code here
  }
}`,

  `class Taco {
  constructor(protein, toppings, price) {
    this.protein = protein;
    this.toppings = toppings;
    this.price = price;
  }

  describe() {
    return \`\${this.protein} taco with \${this.toppings.join(', ')}\`;
  }
}

class TacoStand {
  constructor(name) {
    this.name = name;
    this.menu = [];
    this.totalSales = 0;
  }

  addToMenu(taco) {
    this.menu.push(taco);
  }

  sell(protein) {
    const taco = this.menu.find(t => t.protein === protein);
    if (!taco) return null;
    this.totalSales += taco.price;
    return taco;
  }

  getTacosByTopping(topping) {
    return this.menu.filter(t => t.toppings.includes(topping));
  }

  mostExpensive() {
    return this.menu.reduce((max, t) => t.price > max.price ? t : max, this.menu[0]);
  }
}`,

  `(code) => {
  const { Taco, TacoStand } = new Function(code + '; return { Taco, TacoStand };')();

  const t1 = new Taco('chicken', ['salsa', 'cheese', 'cilantro'], 3.50);
  const t2 = new Taco('beef', ['salsa', 'sour cream'], 4.00);
  const t3 = new Taco('fish', ['cabbage', 'chipotle', 'cilantro'], 5.00);

  const stand = new TacoStand('El Fuego');
  stand.addToMenu(t1);
  stand.addToMenu(t2);
  stand.addToMenu(t3);

  const sold = stand.sell('beef');
  const notFound = stand.sell('tofu');
  const cilantroTacos = stand.getTacosByTopping('cilantro');
  const priciest = stand.mostExpensive();

  return [
    { pass: t1.describe() === 'chicken taco with salsa, cheese, cilantro', description: 'Taco describe() formats correctly', got: t1.describe() },
    { pass: stand.menu.length === 3, description: 'Stand has 3 tacos on menu', got: stand.menu.length },
    { pass: sold === t2, description: 'sell() returns the matching Taco', got: sold?.protein },
    { pass: stand.totalSales === 4.00, description: 'sell() adds price to totalSales', got: stand.totalSales },
    { pass: notFound === null, description: 'sell() returns null for unknown protein', got: notFound },
    { pass: cilantroTacos.length === 2, description: 'getTacosByTopping returns 2 cilantro tacos', got: cilantroTacos.length },
    { pass: priciest === t3, description: 'mostExpensive() returns the fish taco at $5', got: priciest?.protein },
  ];
}`,

  `describe() joins this.toppings with ", " using Array.join(). getTacosByTopping uses filter + includes — toppings.includes(topping) checks if the topping is in that taco's array. mostExpensive uses reduce to find the taco with the highest price.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 5. 🎵 Spotify + Song + Playlist  (Tier 3)
//    Three interacting classes — Song, Playlist, Spotify.
//    This is the flagship multi-class pattern.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🎵 Spotify: Song + Playlist + Spotify',
  'two-class',
  ['classes', 'oop', 'three-class', 'spotify', 'composition', 'tier3'],
  3,
  'Model a simplified Spotify with three classes: Song, Playlist, and Spotify. Each class owns a collection of the next.',
  `Create three classes: **Song**, **Playlist**, and **Spotify**.

**Song** constructor takes \`(title, artist, duration)\`:
- \`this.title\`, \`this.artist\`, \`this.duration\` (seconds)

**Playlist** constructor takes \`(name)\`:
- \`this.name\`, \`this.songs = []\`
- \`addSong(song)\` — adds a Song to the playlist
- \`totalDuration()\` — total seconds of all songs
- \`getSongsByArtist(artist)\` — returns songs by that artist
- \`longestSong()\` — returns the Song with the highest duration

**Spotify** constructor takes \`(user)\`:
- \`this.user\`, \`this.playlists = []\`
- \`createPlaylist(name)\` — creates a new Playlist, adds it to \`this.playlists\`, returns it
- \`getPlaylist(name)\` — returns the Playlist with that name, or \`null\`
- \`getAllSongs()\` — returns a flat array of ALL songs across ALL playlists (may include duplicates)
- \`searchByArtist(artist)\` — returns all unique Song instances across all playlists by that artist`,

  `class Song {
  constructor(title, artist, duration) {
    // your code here
  }
}

class Playlist {
  constructor(name) {
    // your code here
  }

  addSong(song) {
    // your code here
  }

  totalDuration() {
    // your code here
  }

  getSongsByArtist(artist) {
    // your code here
  }

  longestSong() {
    // your code here
  }
}

class Spotify {
  constructor(user) {
    // your code here
  }

  createPlaylist(name) {
    // your code here
  }

  getPlaylist(name) {
    // your code here
  }

  getAllSongs() {
    // your code here
  }

  searchByArtist(artist) {
    // your code here
  }
}`,

  `class Song {
  constructor(title, artist, duration) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
  }
}

class Playlist {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }

  totalDuration() {
    return this.songs.reduce((sum, s) => sum + s.duration, 0);
  }

  getSongsByArtist(artist) {
    return this.songs.filter(s => s.artist === artist);
  }

  longestSong() {
    return this.songs.reduce((max, s) => s.duration > max.duration ? s : max, this.songs[0]);
  }
}

class Spotify {
  constructor(user) {
    this.user = user;
    this.playlists = [];
  }

  createPlaylist(name) {
    const playlist = new Playlist(name);
    this.playlists.push(playlist);
    return playlist;
  }

  getPlaylist(name) {
    return this.playlists.find(p => p.name === name) || null;
  }

  getAllSongs() {
    return this.playlists.flatMap(p => p.songs);
  }

  searchByArtist(artist) {
    const all = this.getAllSongs();
    return all.filter((song, idx) => all.indexOf(song) === idx && song.artist === artist);
  }
}`,

  `(code) => {
  const { Song, Playlist, Spotify } = new Function(code + '; return { Song, Playlist, Spotify };')();

  const s1 = new Song('Blinding Lights', 'The Weeknd', 200);
  const s2 = new Song('Save Your Tears', 'The Weeknd', 215);
  const s3 = new Song('Levitating', 'Dua Lipa', 203);
  const s4 = new Song('Starboy', 'The Weeknd', 230);

  const spotify = new Spotify('Alex');
  const pl1 = spotify.createPlaylist('Workout');
  const pl2 = spotify.createPlaylist('Chill');

  pl1.addSong(s1);
  pl1.addSong(s2);
  pl1.addSong(s3);
  pl2.addSong(s1); // duplicate across playlists
  pl2.addSong(s4);

  const found = spotify.getPlaylist('Workout');
  const notFound = spotify.getPlaylist('Missing');
  const allSongs = spotify.getAllSongs();
  const weekndUnique = spotify.searchByArtist('The Weeknd');
  const longest = pl1.longestSong();

  return [
    { pass: spotify.user === 'Alex', description: 'Spotify has correct user', got: spotify.user },
    { pass: spotify.playlists.length === 2, description: 'Spotify has 2 playlists', got: spotify.playlists.length },
    { pass: found === pl1, description: 'getPlaylist returns matching Playlist', got: found?.name },
    { pass: notFound === null, description: 'getPlaylist returns null when not found', got: notFound },
    { pass: pl1.totalDuration() === 618, description: 'Playlist totalDuration is 618', got: pl1.totalDuration() },
    { pass: longest === s2, description: 'longestSong returns Save Your Tears (215s)', got: longest?.title },
    { pass: allSongs.length === 5, description: 'getAllSongs returns all 5 (with duplicate s1)', got: allSongs.length },
    { pass: weekndUnique.length === 3, description: 'searchByArtist returns 3 unique Weeknd songs', got: weekndUnique.length },
    { pass: weekndUnique.every(s => s.artist === 'The Weeknd'), description: 'All results are by The Weeknd', got: weekndUnique.map(s => s.artist).join(',') },
  ];
}`,

  `createPlaylist builds a new Playlist instance internally using new Playlist(name). getAllSongs uses flatMap to flatten all playlist.songs arrays into one. searchByArtist deduplicates using indexOf — indexOf returns the FIRST index, so if a song appears at a later index, it was already seen.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 6. ✂️ Barber Shop + Client  (Tier 2)
//    BarberShop tracks a waitlist and completed appointments.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '✂️ Barber Shop + Client',
  'two-class',
  ['classes', 'oop', 'two-class', 'barber', 'composition', 'tier2'],
  2,
  'Build a Client class and a BarberShop class. The shop manages a queue of waiting clients.',
  `Create two classes: **Client** and **BarberShop**.

**Client** constructor takes \`(name, service)\`:
- \`this.name\`, \`this.service\` (e.g. \`"haircut"\`, \`"shave"\`, \`"beard trim"\`)
- \`this.isServed = false\`

**BarberShop** constructor takes \`(name)\`:
- \`this.name\`, \`this.waitlist = []\`, \`this.served = []\`
- \`addClient(client)\` — adds client to the waitlist
- \`serveNext()\` — removes the first client from waitlist, marks \`isServed = true\`, moves them to \`served\`. Returns the client, or \`null\` if waitlist is empty.
- \`getWaitlistByService(service)\` — returns all waiting clients requesting that service
- \`totalServed()\` — returns count of clients in \`served\``,

  `class Client {
  constructor(name, service) {
    // your code here
  }
}

class BarberShop {
  constructor(name) {
    // your code here
  }

  addClient(client) {
    // your code here
  }

  serveNext() {
    // your code here
  }

  getWaitlistByService(service) {
    // your code here
  }

  totalServed() {
    // your code here
  }
}`,

  `class Client {
  constructor(name, service) {
    this.name = name;
    this.service = service;
    this.isServed = false;
  }
}

class BarberShop {
  constructor(name) {
    this.name = name;
    this.waitlist = [];
    this.served = [];
  }

  addClient(client) {
    this.waitlist.push(client);
  }

  serveNext() {
    if (this.waitlist.length === 0) return null;
    const client = this.waitlist.shift();
    client.isServed = true;
    this.served.push(client);
    return client;
  }

  getWaitlistByService(service) {
    return this.waitlist.filter(c => c.service === service);
  }

  totalServed() {
    return this.served.length;
  }
}`,

  `(code) => {
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

  const haircutQueue = shop.getWaitlistByService('haircut');
  const firstServed = shop.serveNext();
  const secondServed = shop.serveNext();
  const emptyResult = new BarberShop('Empty Shop').serveNext();

  return [
    { pass: c1.isServed === false, description: 'Client starts with isServed = false', got: c1.isServed },
    { pass: shop.waitlist.length === 4, description: 'Waitlist has 4 clients', got: shop.waitlist.length },
    { pass: haircutQueue.length === 2, description: 'getWaitlistByService returns 2 haircut clients', got: haircutQueue.length },
    { pass: firstServed === c1, description: 'serveNext returns first client in queue (FIFO)', got: firstServed?.name },
    { pass: c1.isServed === true, description: 'serveNext marks client as isServed = true', got: c1.isServed },
    { pass: shop.waitlist.length === 2, description: 'Waitlist has 2 clients after serving 2', got: shop.waitlist.length },
    { pass: shop.totalServed() === 2, description: 'totalServed returns 2', got: shop.totalServed() },
    { pass: emptyResult === null, description: 'serveNext returns null when waitlist is empty', got: emptyResult },
  ];
}`,

  `serveNext uses Array.shift() — removes and returns the FIRST element (FIFO queue). This is different from pop() which takes from the end. When the waitlist is empty, shift() returns undefined, so guard with a length check first.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 7. 🐉 RPG: Character + Party  (Tier 3)
//    Characters fight, heal, level up. Party tracks members and status.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🐉 RPG: Character + Party',
  'two-class',
  ['classes', 'oop', 'two-class', 'rpg', 'composition', 'tier3'],
  3,
  'Build an RPG system with a Character class and a Party class. Characters can fight and level up; the Party tracks group health and status.',
  `Create two classes: **Character** and **Party**.

**Character** constructor takes \`(name, role)\`:
- \`this.name\`, \`this.role\` (e.g. \`"warrior"\`, \`"mage"\`, \`"healer"\`)
- \`this.health = 100\`, \`this.level = 1\`, \`this.isAlive = true\`
- \`takeDamage(amount)\` — subtracts amount from health. If health drops to 0 or below, set \`health = 0\` and \`isAlive = false\`
- \`heal(amount)\` — adds amount to health, capped at 100. Only works if \`isAlive\`
- \`levelUp()\` — increments level by 1, restores health to 100

**Party** constructor takes \`(name)\`:
- \`this.name\`, \`this.members = []\`
- \`addMember(character)\` — adds to members
- \`isWiped()\` — returns \`true\` if ALL members are dead (\`isAlive === false\`)
- \`getLivingMembers()\` — returns array of members where \`isAlive === true\`
- \`healAll(amount)\` — calls \`heal(amount)\` on every living member
- \`averageLevel()\` — returns the average level of all members (living and dead)`,

  `class Character {
  constructor(name, role) {
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
}

class Party {
  constructor(name) {
    // your code here
  }

  addMember(character) {
    // your code here
  }

  isWiped() {
    // your code here
  }

  getLivingMembers() {
    // your code here
  }

  healAll(amount) {
    // your code here
  }

  averageLevel() {
    // your code here
  }
}`,

  `class Character {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.health = 100;
    this.level = 1;
    this.isAlive = true;
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) this.isAlive = false;
  }

  heal(amount) {
    if (!this.isAlive) return;
    this.health = Math.min(100, this.health + amount);
  }

  levelUp() {
    this.level += 1;
    this.health = 100;
  }
}

class Party {
  constructor(name) {
    this.name = name;
    this.members = [];
  }

  addMember(character) {
    this.members.push(character);
  }

  isWiped() {
    return this.members.every(c => !c.isAlive);
  }

  getLivingMembers() {
    return this.members.filter(c => c.isAlive);
  }

  healAll(amount) {
    this.getLivingMembers().forEach(c => c.heal(amount));
  }

  averageLevel() {
    if (this.members.length === 0) return 0;
    const total = this.members.reduce((sum, c) => sum + c.level, 0);
    return total / this.members.length;
  }
}`,

  `(code) => {
  const { Character, Party } = new Function(code + '; return { Character, Party };')();

  const warrior = new Character('Thorin', 'warrior');
  const mage = new Character('Elara', 'mage');
  const healer = new Character('Pip', 'healer');

  const party = new Party('The Fellowship');
  party.addMember(warrior);
  party.addMember(mage);
  party.addMember(healer);

  warrior.takeDamage(60);
  mage.takeDamage(110); // should die

  const living = party.getLivingMembers();
  const wiped = party.isWiped();
  const wipedParty = new Party('Empty');
  wipedParty.addMember(new Character('Ghost', 'warrior'));
  wipedParty.members[0].takeDamage(200);

  party.healAll(20);
  warrior.levelUp();

  return [
    { pass: warrior.health === 40, description: 'takeDamage reduces health correctly (100-60=40)', got: warrior.health },
    { pass: mage.health === 0, description: 'Overkill damage sets health to 0 (not negative)', got: mage.health },
    { pass: mage.isAlive === false, description: 'Character dies when health reaches 0', got: mage.isAlive },
    { pass: living.length === 2, description: 'getLivingMembers returns 2 living members', got: living.length },
    { pass: wiped === false, description: 'isWiped is false (2 members still alive)', got: wiped },
    { pass: wipedParty.isWiped() === true, description: 'isWiped returns true when all are dead', got: wipedParty.isWiped() },
    { pass: warrior.health === 60, description: 'healAll heals living members (+20 from 40 = 60)', got: warrior.health },
    { pass: mage.health === 0, description: 'healAll does NOT heal dead members', got: mage.health },
    { pass: warrior.level === 2, description: 'levelUp increments level to 2', got: warrior.level },
    { pass: warrior.health === 100, description: 'levelUp restores health to 100', got: warrior.health },
    { pass: party.averageLevel() === (2 + 1 + 1) / 3, description: 'averageLevel returns correct average', got: party.averageLevel() },
  ];
}`,

  `takeDamage: use Math.max(0, health - amount) to floor at zero. heal: use Math.min(100, health + amount) to cap at 100, and guard against healing dead characters. isWiped uses Array.every() — returns true only if ALL elements match. healAll calls getLivingMembers() first, then heals each one.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 8. 🍜 Restaurant + Order  (Tier 2)
//    Restaurant manages a menu and processes orders.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🍜 Restaurant + Order',
  'two-class',
  ['classes', 'oop', 'two-class', 'restaurant', 'composition', 'tier2'],
  2,
  'Build a MenuItem class and a Restaurant class. The restaurant manages a menu and tracks active orders.',
  `Create two classes: **MenuItem** and **Restaurant**.

**MenuItem** constructor takes \`(name, category, price)\`:
- \`this.name\`, \`this.category\` (e.g. \`"entree"\`, \`"appetizer"\`, \`"dessert"\`), \`this.price\`

**Restaurant** constructor takes \`(name)\`:
- \`this.name\`, \`this.menu = []\`, \`this.orders = []\`
- \`addMenuItem(item)\` — adds item to menu
- \`placeOrder(itemNames)\` — takes an array of item name strings, finds each in the menu, pushes the matched MenuItems to \`this.orders\`, returns the total price of the order
- \`getMenu(category)\` — returns all menu items in that category
- \`totalRevenue()\` — returns the sum of prices of all items in \`this.orders\``,

  `class MenuItem {
  constructor(name, category, price) {
    // your code here
  }
}

class Restaurant {
  constructor(name) {
    // your code here
  }

  addMenuItem(item) {
    // your code here
  }

  placeOrder(itemNames) {
    // your code here
  }

  getMenu(category) {
    // your code here
  }

  totalRevenue() {
    // your code here
  }
}`,

  `class MenuItem {
  constructor(name, category, price) {
    this.name = name;
    this.category = category;
    this.price = price;
  }
}

class Restaurant {
  constructor(name) {
    this.name = name;
    this.menu = [];
    this.orders = [];
  }

  addMenuItem(item) {
    this.menu.push(item);
  }

  placeOrder(itemNames) {
    const items = itemNames
      .map(name => this.menu.find(item => item.name === name))
      .filter(Boolean);
    this.orders.push(...items);
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  getMenu(category) {
    return this.menu.filter(item => item.category === category);
  }

  totalRevenue() {
    return this.orders.reduce((sum, item) => sum + item.price, 0);
  }
}`,

  `(code) => {
  const { MenuItem, Restaurant } = new Function(code + '; return { MenuItem, Restaurant };')();

  const burger = new MenuItem('Burger', 'entree', 12.00);
  const salad  = new MenuItem('Salad', 'appetizer', 8.00);
  const tacos  = new MenuItem('Tacos', 'entree', 10.00);
  const cake   = new MenuItem('Cake', 'dessert', 6.00);

  const resto = new Restaurant('The Corner Diner');
  resto.addMenuItem(burger);
  resto.addMenuItem(salad);
  resto.addMenuItem(tacos);
  resto.addMenuItem(cake);

  const order1Total = resto.placeOrder(['Burger', 'Salad']);
  const order2Total = resto.placeOrder(['Tacos', 'Cake']);
  const entrees = resto.getMenu('entree');
  const revenue = resto.totalRevenue();

  return [
    { pass: burger.name === 'Burger', description: 'MenuItem has correct name', got: burger.name },
    { pass: resto.menu.length === 4, description: 'Restaurant has 4 menu items', got: resto.menu.length },
    { pass: order1Total === 20, description: 'placeOrder returns correct total (12 + 8 = 20)', got: order1Total },
    { pass: order2Total === 16, description: 'placeOrder returns correct total (10 + 6 = 16)', got: order2Total },
    { pass: resto.orders.length === 4, description: 'orders array has 4 items after 2 orders', got: resto.orders.length },
    { pass: entrees.length === 2, description: 'getMenu("entree") returns 2 items', got: entrees.length },
    { pass: entrees.every(i => i.category === 'entree'), description: 'getMenu only returns entrees', got: entrees.map(i => i.category).join(', ') },
    { pass: revenue === 36, description: 'totalRevenue returns 36 (20 + 16)', got: revenue },
  ];
}`,

  `placeOrder takes an ARRAY of strings, not a single item. Use map to find each item in the menu, then filter(Boolean) to remove any nulls (items not on menu). Use spread (...items) to push multiple items into the orders array at once.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 9. 📼 VHS Store + Movie  (Tier 2)
//    VHS Store rents movies. Classic stateful checkout pattern.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '📼 VHS Store + Movie',
  'two-class',
  ['classes', 'oop', 'two-class', 'vhs', 'composition', 'tier2'],
  2,
  'Build a Movie class and a VHSStore class. The store manages inventory and tracks rentals.',
  `Create two classes: **Movie** and **VHSStore**.

**Movie** constructor takes \`(title, genre, rentalPrice)\`:
- \`this.title\`, \`this.genre\`, \`this.rentalPrice\`
- \`this.isRented = false\`

**VHSStore** constructor takes \`(name)\`:
- \`this.name\`, \`this.inventory = []\`, \`this.revenue = 0\`
- \`stock(movie)\` — adds movie to inventory
- \`rent(title)\` — finds the movie, marks \`isRented = true\`, adds rental price to revenue, returns the movie. Returns \`null\` if not found or already rented.
- \`return(title)\` — finds movie by title, sets \`isRented = false\`
- \`getAvailable()\` — returns all movies not currently rented
- \`getByGenre(genre)\` — returns all movies of that genre (regardless of availability)`,

  `class Movie {
  constructor(title, genre, rentalPrice) {
    // your code here
  }
}

class VHSStore {
  constructor(name) {
    // your code here
  }

  stock(movie) {
    // your code here
  }

  rent(title) {
    // your code here
  }

  return(title) {
    // your code here
  }

  getAvailable() {
    // your code here
  }

  getByGenre(genre) {
    // your code here
  }
}`,

  `class Movie {
  constructor(title, genre, rentalPrice) {
    this.title = title;
    this.genre = genre;
    this.rentalPrice = rentalPrice;
  }
}

class VHSStore {
  constructor(name) {
    this.name = name;
    this.inventory = [];
    this.revenue = 0;
  }

  stock(movie) {
    this.inventory.push(movie);
  }

  rent(title) {
    const movie = this.inventory.find(m => m.title === title);
    if (!movie || movie.isRented) return null;
    movie.isRented = true;
    this.revenue += movie.rentalPrice;
    return movie;
  }

  return(title) {
    const movie = this.inventory.find(m => m.title === title);
    if (movie) movie.isRented = false;
  }

  getAvailable() {
    return this.inventory.filter(m => !m.isRented);
  }

  getByGenre(genre) {
    return this.inventory.filter(m => m.genre === genre);
  }
}`,

  `(code) => {
  const { Movie, VHSStore } = new Function(code + '; return { Movie, VHSStore };')();

  const m1 = new Movie('The Matrix', 'sci-fi', 3.99);
  const m2 = new Movie('Alien', 'sci-fi', 3.99);
  const m3 = new Movie('Home Alone', 'comedy', 2.99);

  const store = new VHSStore('Blockbuster');
  store.stock(m1);
  store.stock(m2);
  store.stock(m3);

  const rented = store.rent('The Matrix');
  const alreadyRented = store.rent('The Matrix');
  const available = store.getAvailable();
  const scifi = store.getByGenre('sci-fi');

  store.return('The Matrix');
  const afterReturn = store.getAvailable();

  return [
    { pass: m1.isRented === undefined || m1.isRented === false, description: 'Movie starts not rented', got: m1.isRented },
    { pass: rented === m1, description: 'rent() returns matching Movie', got: rented?.title },
    { pass: m1.isRented === true, description: 'rent() marks movie as rented', got: m1.isRented },
    { pass: store.revenue === 3.99, description: 'rent() adds to revenue', got: store.revenue },
    { pass: alreadyRented === null, description: 'rent() returns null if already rented', got: alreadyRented },
    { pass: available.length === 2, description: 'getAvailable returns 2 (Matrix is out)', got: available.length },
    { pass: scifi.length === 2, description: 'getByGenre("sci-fi") returns 2', got: scifi.length },
    { pass: afterReturn.length === 3, description: 'All 3 available after return', got: afterReturn.length },
  ];
}`,

  `Notice that Movie doesn't set isRented in the constructor — the store sets it when the movie is rented. The rent() guard checks !movie (not found) OR movie.isRented (already out). return is a valid method name in a class (it's only reserved as a statement keyword outside of property names).`
));


// ─────────────────────────────────────────────────────────────────────────────
// 10. 🏫 Classroom + Student  (Tier 3)
//     Classroom manages students. Students have grade records.
//     Touches averages, highest/lowest, honor roll — more computation.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🏫 Classroom + Student',
  'two-class',
  ['classes', 'oop', 'two-class', 'classroom', 'composition', 'tier3'],
  3,
  'Build a Student class and a Classroom class with richer data computation: averages, honor roll, and grade distributions.',
  `Create two classes: **Student** and **Classroom**.

**Student** constructor takes \`(name, id)\`:
- \`this.name\`, \`this.id\`, \`this.grades = []\`
- \`addGrade(score)\` — adds score to grades (0–100)
- \`getAverage()\` — returns average of grades, or \`0\` if no grades
- \`getLetterGrade()\` — returns \`"A"\` (90+), \`"B"\` (80-89), \`"C"\` (70-79), \`"D"\` (60-69), or \`"F"\` based on average
- \`isHonorRoll()\` — returns \`true\` if average is 90 or above

**Classroom** constructor takes \`(subject)\`:
- \`this.subject\`, \`this.students = []\`
- \`enroll(student)\` — adds student to class
- \`getHonorRoll()\` — returns students with average ≥ 90
- \`classAverage()\` — returns the average of all student averages, or \`0\` if no students
- \`getTopStudent()\` — returns the student with the highest average
- \`gradeDistribution()\` — returns an object like \`{ A: 2, B: 1, C: 0, D: 0, F: 0 }\``,

  `class Student {
  constructor(name, id) {
    // your code here
  }

  addGrade(score) {
    // your code here
  }

  getAverage() {
    // your code here
  }

  getLetterGrade() {
    // your code here
  }

  isHonorRoll() {
    // your code here
  }
}

class Classroom {
  constructor(subject) {
    // your code here
  }

  enroll(student) {
    // your code here
  }

  getHonorRoll() {
    // your code here
  }

  classAverage() {
    // your code here
  }

  getTopStudent() {
    // your code here
  }

  gradeDistribution() {
    // your code here
  }
}`,

  `class Student {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.grades = [];
  }

  addGrade(score) {
    this.grades.push(score);
  }

  getAverage() {
    if (this.grades.length === 0) return 0;
    return this.grades.reduce((sum, g) => sum + g, 0) / this.grades.length;
  }

  getLetterGrade() {
    const avg = this.getAverage();
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }

  isHonorRoll() {
    return this.getAverage() >= 90;
  }
}

class Classroom {
  constructor(subject) {
    this.subject = subject;
    this.students = [];
  }

  enroll(student) {
    this.students.push(student);
  }

  getHonorRoll() {
    return this.students.filter(s => s.isHonorRoll());
  }

  classAverage() {
    if (this.students.length === 0) return 0;
    const total = this.students.reduce((sum, s) => sum + s.getAverage(), 0);
    return total / this.students.length;
  }

  getTopStudent() {
    return this.students.reduce((top, s) => s.getAverage() > top.getAverage() ? s : top, this.students[0]);
  }

  gradeDistribution() {
    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    this.students.forEach(s => {
      dist[s.getLetterGrade()]++;
    });
    return dist;
  }
}`,

  `(code) => {
  const { Student, Classroom } = new Function(code + '; return { Student, Classroom };')();

  const s1 = new Student('Alex', 1);
  const s2 = new Student('Jordan', 2);
  const s3 = new Student('Sam', 3);

  s1.addGrade(92); s1.addGrade(95); s1.addGrade(88);  // avg 91.67 -> A
  s2.addGrade(78); s2.addGrade(82); s2.addGrade(80);  // avg 80 -> B
  s3.addGrade(65); s3.addGrade(70); s3.addGrade(68);  // avg 67.67 -> D

  const room = new Classroom('JavaScript');
  room.enroll(s1); room.enroll(s2); room.enroll(s3);

  const honorRoll = room.getHonorRoll();
  const top = room.getTopStudent();
  const dist = room.gradeDistribution();
  const avg = room.classAverage();

  return [
    { pass: Math.abs(s1.getAverage() - 91.67) < 0.1, description: 'Student getAverage() is ~91.67', got: s1.getAverage().toFixed(2) },
    { pass: s1.getLetterGrade() === 'A', description: 's1 gets letter grade A', got: s1.getLetterGrade() },
    { pass: s2.getLetterGrade() === 'B', description: 's2 gets letter grade B', got: s2.getLetterGrade() },
    { pass: s3.getLetterGrade() === 'D', description: 's3 gets letter grade D', got: s3.getLetterGrade() },
    { pass: s1.isHonorRoll() === true, description: 's1 is on honor roll (avg >= 90)', got: s1.isHonorRoll() },
    { pass: s2.isHonorRoll() === false, description: 's2 is NOT on honor roll', got: s2.isHonorRoll() },
    { pass: honorRoll.length === 1 && honorRoll[0] === s1, description: 'getHonorRoll returns only s1', got: honorRoll.length },
    { pass: top === s1, description: 'getTopStudent returns s1 (highest avg)', got: top?.name },
    { pass: dist.A === 1 && dist.B === 1 && dist.D === 1, description: 'gradeDistribution: A=1, B=1, D=1', got: JSON.stringify(dist) },
    { pass: dist.C === 0 && dist.F === 0, description: 'gradeDistribution: C=0, F=0', got: \`C:\${dist.C} F:\${dist.F}\` },
    { pass: Math.abs(avg - (s1.getAverage() + s2.getAverage() + s3.getAverage()) / 3) < 0.01, description: 'classAverage is average of student averages', got: avg.toFixed(2) },
  ];
}`,

  `gradeDistribution builds a result object { A:0, B:0, C:0, D:0, F:0 } then uses forEach to call each student's getLetterGrade() and increment the matching key. classAverage averages the AVERAGES — it calls s.getAverage() on each student, not raw grades.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 11. 🧶 Crafting Store + Supply  (Tier 3)
//     Complex inventory: restock, use supplies, check availability.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🧶 Crafting Store + Supply',
  'two-class',
  ['classes', 'oop', 'two-class', 'crafting', 'composition', 'tier3'],
  3,
  'Build a Supply class and a CraftingStore class. The store tracks inventory quantities and can fulfill crafting recipes.',
  `Create two classes: **Supply** and **CraftingStore**.

**Supply** constructor takes \`(name, category, quantity, unitPrice)\`:
- \`this.name\`, \`this.category\`, \`this.quantity\`, \`this.unitPrice\`
- \`isInStock()\` — returns \`true\` if quantity > 0
- \`totalValue()\` — returns \`quantity * unitPrice\`

**CraftingStore** constructor takes \`(name)\`:
- \`this.name\`, \`this.supplies = []\`
- \`addSupply(supply)\` — adds to supplies
- \`restock(name, amount)\` — finds supply by name, increases its quantity by amount
- \`use(name, amount)\` — finds supply by name, decreases quantity by amount (minimum 0). Returns \`true\` if there was enough stock, \`false\` if not (and does NOT deduct if insufficient)
- \`getByCategory(category)\` — returns all supplies in that category
- \`getLowStock(threshold)\` — returns supplies where quantity is ≤ threshold
- \`inventoryValue()\` — returns sum of totalValue() for all supplies`,

  `class Supply {
  constructor(name, category, quantity, unitPrice) {
    // your code here
  }

  isInStock() {
    // your code here
  }

  totalValue() {
    // your code here
  }
}

class CraftingStore {
  constructor(name) {
    // your code here
  }

  addSupply(supply) {
    // your code here
  }

  restock(name, amount) {
    // your code here
  }

  use(name, amount) {
    // your code here
  }

  getByCategory(category) {
    // your code here
  }

  getLowStock(threshold) {
    // your code here
  }

  inventoryValue() {
    // your code here
  }
}`,

  `class Supply {
  constructor(name, category, quantity, unitPrice) {
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  isInStock() {
    return this.quantity > 0;
  }

  totalValue() {
    return this.quantity * this.unitPrice;
  }
}

class CraftingStore {
  constructor(name) {
    this.name = name;
    this.supplies = [];
  }

  addSupply(supply) {
    this.supplies.push(supply);
  }

  restock(name, amount) {
    const supply = this.supplies.find(s => s.name === name);
    if (supply) supply.quantity += amount;
  }

  use(name, amount) {
    const supply = this.supplies.find(s => s.name === name);
    if (!supply || supply.quantity < amount) return false;
    supply.quantity -= amount;
    return true;
  }

  getByCategory(category) {
    return this.supplies.filter(s => s.category === category);
  }

  getLowStock(threshold) {
    return this.supplies.filter(s => s.quantity <= threshold);
  }

  inventoryValue() {
    return this.supplies.reduce((sum, s) => sum + s.totalValue(), 0);
  }
}`,

  `(code) => {
  const { Supply, CraftingStore } = new Function(code + '; return { Supply, CraftingStore };')();

  const yarn  = new Supply('Yarn', 'fiber', 50, 2.00);
  const beads = new Supply('Beads', 'embellishment', 200, 0.10);
  const felt  = new Supply('Felt', 'fabric', 3, 1.50);

  const store = new CraftingStore('Stitch & Craft');
  store.addSupply(yarn);
  store.addSupply(beads);
  store.addSupply(felt);

  const usedYarn    = store.use('Yarn', 10);
  const overUseFelt = store.use('Felt', 10);  // insufficient
  store.restock('Felt', 7);

  const fabric = store.getByCategory('fabric');
  const lowStock = store.getLowStock(5);
  const value = store.inventoryValue();

  return [
    { pass: yarn.isInStock() === true, description: 'Yarn isInStock is true (qty 50)', got: yarn.isInStock() },
    { pass: beads.totalValue() === 20, description: 'Beads totalValue is 20 (200 * 0.10)', got: beads.totalValue() },
    { pass: usedYarn === true, description: 'use() returns true when sufficient stock', got: usedYarn },
    { pass: yarn.quantity === 40, description: 'use() decreases quantity (50 - 10 = 40)', got: yarn.quantity },
    { pass: overUseFelt === false, description: 'use() returns false when insufficient', got: overUseFelt },
    { pass: felt.quantity === 3, description: 'use() does NOT deduct when insufficient', got: felt.quantity },
    { pass: felt.quantity === 10, description: 'restock() increases quantity (3 + 7 = 10)', got: felt.quantity },
    { pass: fabric.length === 1 && fabric[0] === felt, description: 'getByCategory("fabric") returns felt', got: fabric.length },
    { pass: lowStock.every(s => s.quantity <= 5), description: 'getLowStock(5) only returns items with qty ≤ 5', got: lowStock.map(s => s.name + ':' + s.quantity).join(', ') },
    { pass: typeof value === 'number' && value > 0, description: 'inventoryValue() returns a positive number', got: value },
  ];
}`,

  `use() has a critical guard: check BEFORE deducting — if quantity < amount, return false without changing anything. restock just adds to quantity with no upper bound. getLowStock uses <= threshold (not <), so supplies AT the threshold count as low stock.`
));


// ─────────────────────────────────────────────────────────────────────────────
// 12. 💵 Spa + Appointment  (Tier 3)
//     Spa manages a schedule. Appointments can be booked, cancelled, completed.
// ─────────────────────────────────────────────────────────────────────────────
exercises.push(ex(
  '🧖 Spa + Appointment',
  'two-class',
  ['classes', 'oop', 'two-class', 'spa', 'scheduling', 'tier3'],
  3,
  'Build an Appointment class and a Spa class. The spa manages a booking system with scheduling, cancellations, and revenue tracking.',
  `Create two classes: **Appointment** and **Spa**.

**Appointment** constructor takes \`(clientName, service, duration, price)\`:
- \`this.clientName\`, \`this.service\`, \`this.duration\` (minutes), \`this.price\`
- \`this.status = "booked"\` (can be \`"booked"\`, \`"completed"\`, or \`"cancelled"\`)
- \`complete()\` — sets status to \`"completed"\`
- \`cancel()\` — sets status to \`"cancelled"\`
- \`isActive()\` — returns \`true\` if status is \`"booked"\`

**Spa** constructor takes \`(name)\`:
- \`this.name\`, \`this.appointments = []\`
- \`book(appointment)\` — adds appointment to list
- \`cancel(clientName)\` — finds first booked appointment for that client, calls \`cancel()\` on it, returns it (or \`null\` if not found)
- \`completeNext()\` — completes the first \`"booked"\` appointment in the list, returns it (or \`null\`)
- \`getRevenue()\` — returns sum of prices of \`"completed"\` appointments only
- \`getSchedule()\` — returns only \`"booked"\` appointments`,

  `class Appointment {
  constructor(clientName, service, duration, price) {
    // your code here
  }

  complete() {
    // your code here
  }

  cancel() {
    // your code here
  }

  isActive() {
    // your code here
  }
}

class Spa {
  constructor(name) {
    // your code here
  }

  book(appointment) {
    // your code here
  }

  cancel(clientName) {
    // your code here
  }

  completeNext() {
    // your code here
  }

  getRevenue() {
    // your code here
  }

  getSchedule() {
    // your code here
  }
}`,

  `class Appointment {
  constructor(clientName, service, duration, price) {
    this.clientName = clientName;
    this.service = service;
    this.duration = duration;
    this.price = price;
    this.status = 'booked';
  }

  complete() {
    this.status = 'completed';
  }

  cancel() {
    this.status = 'cancelled';
  }

  isActive() {
    return this.status === 'booked';
  }
}

class Spa {
  constructor(name) {
    this.name = name;
    this.appointments = [];
  }

  book(appointment) {
    this.appointments.push(appointment);
  }

  cancel(clientName) {
    const appt = this.appointments.find(a => a.clientName === clientName && a.isActive());
    if (!appt) return null;
    appt.cancel();
    return appt;
  }

  completeNext() {
    const appt = this.appointments.find(a => a.isActive());
    if (!appt) return null;
    appt.complete();
    return appt;
  }

  getRevenue() {
    return this.appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.price, 0);
  }

  getSchedule() {
    return this.appointments.filter(a => a.isActive());
  }
}`,

  `(code) => {
  const { Appointment, Spa } = new Function(code + '; return { Appointment, Spa };')();

  const a1 = new Appointment('Maria',   'massage',   60, 90);
  const a2 = new Appointment('Devon',   'facial',    45, 75);
  const a3 = new Appointment('Chris',   'manicure',  30, 40);
  const a4 = new Appointment('Maria',   'pedicure',  30, 40);

  const spa = new Spa('Serenity Spa');
  spa.book(a1); spa.book(a2); spa.book(a3); spa.book(a4);

  const cancelled = spa.cancel('Devon');
  const schedule = spa.getSchedule();
  const completed = spa.completeNext();

  return [
    { pass: a1.status === 'booked', description: 'Appointment starts with status "booked"', got: a1.status },
    { pass: a1.isActive() === true, description: 'isActive() returns true for booked appointment', got: a1.isActive() },
    { pass: cancelled === a2, description: 'cancel() returns the cancelled Appointment', got: cancelled?.clientName },
    { pass: a2.status === 'cancelled', description: 'Cancelled appointment has status "cancelled"', got: a2.status },
    { pass: schedule.length === 3, description: 'getSchedule returns 3 (Devon cancelled)', got: schedule.length },
    { pass: completed === a1, description: 'completeNext() completes first booked appt (Maria/massage)', got: completed?.service },
    { pass: a1.status === 'completed', description: 'Completed appointment has status "completed"', got: a1.status },
    { pass: spa.getRevenue() === 90, description: 'getRevenue returns 90 (only completed appts)', got: spa.getRevenue() },
    { pass: spa.getSchedule().length === 2, description: 'getSchedule now shows 2 (Maria massage completed)', got: spa.getSchedule().length },
  ];
}`,

  `cancel(clientName) finds by BOTH client name AND isActive() — a cancelled appointment shouldn't be cancelled again. completeNext uses find() to get the FIRST active appointment, then calls complete() on it. getRevenue filters for status === "completed" before reducing.`
));


// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────
const newIds = exercises.map(e => e.id);

const newCollections = [
  {
    id: 'two-class-intro',
    name: '🔗 Two-Class Interaction',
    description: 'Exercises where two classes interact — one owns a collection of the other. The core OOP pattern from Turing\'s javascript-foundations.',
    color: '#06b6d4',
    exerciseIds: exercises.filter(e => e.tier === 2).map(e => e.id),
  },
  {
    id: 'two-class-advanced',
    name: '🔗 Multi-Class: Advanced',
    description: 'Three-class systems and exercises with richer state: RPG parties, Spotify playlists, classroom analytics.',
    color: '#8b5cf6',
    exerciseIds: exercises.filter(e => e.tier === 3).map(e => e.id),
  },
  {
    id: 'turing-foundations',
    name: '🏫 Turing Foundations Track',
    description: 'All two- and three-class exercises inspired by Turing School\'s javascript-foundations repo: DJ, Airport, Library, Taco Stand, Spotify, VHS, Restaurant, Barber Shop, RPG, Classroom, Crafting, Spa.',
    color: '#f59e0b',
    exerciseIds: newIds,
  },
];

// ─── WRITE ────────────────────────────────────────────────────────────────────
data.exercises.push(...exercises);
data.collections.push(...newCollections);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

console.log(`✓ Added ${exercises.length} two-class exercises (IDs ${exercises[0].id}–${exercises[exercises.length - 1].id})`);
console.log(`✓ Added ${newCollections.length} new collections`);
console.log(`\nExercises by tier:`);
const t2 = exercises.filter(e => e.tier === 2);
const t3 = exercises.filter(e => e.tier === 3);
console.log(`  Tier 2: ${t2.length} — ${t2.map(e => e.title).join(', ')}`);
console.log(`  Tier 3: ${t3.length} — ${t3.map(e => e.title).join(', ')}`);
console.log(`\n✓ Total exercises: ${data.exercises.length}`);
