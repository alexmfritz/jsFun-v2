/**
 * Add Regex category and 10 new exercises (IDs 326-335)
 *
 * New category: regex
 *   - basics (326-328)
 *   - patterns (329-332)
 *   - extraction (333-335)
 *
 * Also:
 *   - Adds regex category to data.categories
 *   - Updates default-curriculum collection with all new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── ADD REGEX CATEGORY ──────────────────────────────────────────────────────

data.categories['regex'] = {
  label: 'Regex',
  color: '#a3e635',
  children: {
    basics: { label: 'Basics' },
    patterns: { label: 'Patterns' },
    extraction: { label: 'Extraction' },
  },
};

console.log('  Added regex category');

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ═══════════════════════════════════════════════════════════════════════════
  // regex/basics (326-328)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 326: Validate Email ──────────────────────────────────────────────────
  {
    id: 326,
    title: 'Validate Email',
    type: 'js',
    tier: 2,
    category: ['regex', 'basics'],
    tags: ['regex', 'validation', 'strings'],
    description: 'Write a function that validates whether a given string is a plausible email address using a regular expression.',
    instructions: `Write a function called \`validateEmail\` that takes a string and returns \`true\` if it looks like a valid email address, or \`false\` otherwise.\n\nA valid email has:\n- One or more non-whitespace, non-@ characters before the @\n- An @ symbol\n- One or more non-whitespace, non-@ characters for the domain\n- A dot\n- One or more non-whitespace, non-@ characters for the TLD\n\nExamples:\n  validateEmail("user@example.com")        \u2192 true\n  validateEmail("user.name+tag@domain.co") \u2192 true\n  validateEmail("invalid")                 \u2192 false\n  validateEmail("@domain.com")             \u2192 false\n  validateEmail("user@")                   \u2192 false\n  validateEmail("")                        \u2192 false`,
    starterCode: `function validateEmail(email) {\n\n}`,
    solution: `function validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return validateEmail;')();
  return [
    { pass: fn("user@example.com") === true, description: '"user@example.com" is valid', got: String(fn("user@example.com")) },
    { pass: fn("user.name+tag@domain.co") === true, description: '"user.name+tag@domain.co" is valid', got: String(fn("user.name+tag@domain.co")) },
    { pass: fn("invalid") === false, description: '"invalid" is not valid', got: String(fn("invalid")) },
    { pass: fn("@domain.com") === false, description: '"@domain.com" is not valid', got: String(fn("@domain.com")) },
    { pass: fn("user@") === false, description: '"user@" is not valid', got: String(fn("user@")) },
    { pass: fn("") === false, description: 'empty string is not valid', got: String(fn("")) },
  ];
}`,
    hint: 'Use the regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ and the .test() method. The character class [^\\s@] matches anything that is not whitespace or @.',
    resources: [
      { label: 'MDN: RegExp.prototype.test()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test' },
      { label: 'RegExr: Learn, Build & Test', url: 'https://regexr.com/' },
    ],
  },

  // ── 327: Validate Phone Number ───────────────────────────────────────────
  {
    id: 327,
    title: 'Validate Phone Number',
    type: 'js',
    tier: 2,
    category: ['regex', 'basics'],
    tags: ['regex', 'validation', 'strings'],
    description: 'Write a function that checks whether a string matches common US phone number formats.',
    instructions: `Write a function called \`validatePhone\` that takes a string and returns \`true\` if it matches a valid US phone number format.\n\nAccepted formats:\n- (123) 456-7890\n- (123)456-7890\n- 123-456-7890\n- 1234567890\n\nExamples:\n  validatePhone("(123) 456-7890")  \u2192 true\n  validatePhone("123-456-7890")    \u2192 true\n  validatePhone("1234567890")      \u2192 true\n  validatePhone("123-45-6789")     \u2192 false\n  validatePhone("abc")             \u2192 false\n  validatePhone("(123)456-7890")   \u2192 true`,
    starterCode: `function validatePhone(phone) {\n\n}`,
    solution: `function validatePhone(phone) {\n  return /^(\\(\\d{3}\\)\\s?|\\d{3}[-]?)\\d{3}[-]?\\d{4}$/.test(phone);\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return validatePhone;')();
  return [
    { pass: fn("(123) 456-7890") === true, description: '"(123) 456-7890" is valid', got: String(fn("(123) 456-7890")) },
    { pass: fn("123-456-7890") === true, description: '"123-456-7890" is valid', got: String(fn("123-456-7890")) },
    { pass: fn("1234567890") === true, description: '"1234567890" is valid', got: String(fn("1234567890")) },
    { pass: fn("123-45-6789") === false, description: '"123-45-6789" is not valid', got: String(fn("123-45-6789")) },
    { pass: fn("abc") === false, description: '"abc" is not valid', got: String(fn("abc")) },
    { pass: fn("(123)456-7890") === true, description: '"(123)456-7890" is valid', got: String(fn("(123)456-7890")) },
  ];
}`,
    hint: 'Break the pattern into parts: optional area code in parens with optional space OR digits with optional dash, then 3 digits, optional dash, then 4 digits. Use \\d{3} to match exactly 3 digits.',
    resources: [
      { label: 'MDN: Regular Expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions' },
    ],
  },

  // ── 328: Extract Numbers from String ─────────────────────────────────────
  {
    id: 328,
    title: 'Extract Numbers from String',
    type: 'js',
    tier: 2,
    category: ['regex', 'basics'],
    tags: ['regex', 'extraction', 'strings'],
    description: 'Use a regular expression to find all sequences of digits in a string and return them as an array of numbers.',
    instructions: `Write a function called \`extractNumbers\` that takes a string and returns an array of all the numbers found in it.\n\nEach contiguous sequence of digits counts as one number. Return them as actual numbers (not strings). If no numbers are found, return an empty array.\n\nExamples:\n  extractNumbers("abc123def456")              \u2192 [123, 456]\n  extractNumbers("no numbers")                \u2192 []\n  extractNumbers("42")                        \u2192 [42]\n  extractNumbers("price: $9.99 and $12.50")   \u2192 [9, 99, 12, 50]\n  extractNumbers("")                          \u2192 []`,
    starterCode: `function extractNumbers(str) {\n\n}`,
    solution: `function extractNumbers(str) {\n  return (str.match(/\\d+/g) || []).map(Number);\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return extractNumbers;')();
  return [
    { pass: JSON.stringify(fn("abc123def456")) === '[123,456]', description: '"abc123def456" yields [123, 456]', got: JSON.stringify(fn("abc123def456")) },
    { pass: JSON.stringify(fn("no numbers")) === '[]', description: '"no numbers" yields []', got: JSON.stringify(fn("no numbers")) },
    { pass: JSON.stringify(fn("42")) === '[42]', description: '"42" yields [42]', got: JSON.stringify(fn("42")) },
    { pass: JSON.stringify(fn("price: $9.99 and $12.50")) === '[9,99,12,50]', description: 'decimal prices yield individual number groups', got: JSON.stringify(fn("price: $9.99 and $12.50")) },
    { pass: JSON.stringify(fn("")) === '[]', description: 'empty string yields []', got: JSON.stringify(fn("")) },
  ];
}`,
    hint: 'Use str.match(/\\d+/g) to find all digit sequences. The g flag finds all matches. Handle the null case when no matches are found (match returns null, not []).',
    resources: [
      { label: 'MDN: String.prototype.match()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // regex/patterns (329-332)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 329: Match HTML Tags ─────────────────────────────────────────────────
  {
    id: 329,
    title: 'Match HTML Tags',
    type: 'js',
    tier: 3,
    category: ['regex', 'basics'],
    tags: ['regex', 'patterns', 'strings'],
    description: 'Extract all opening HTML tag names from a string using a regular expression.',
    instructions: `Write a function called \`extractTagNames\` that takes an HTML string and returns an array of all opening tag names found in it.\n\nOnly extract the tag name itself (e.g., "div", "p", "img"), not closing tags (those starting with </).\n\nExamples:\n  extractTagNames("<div><p>hello</p></div>")         \u2192 ["div", "p"]\n  extractTagNames("<img src='x'/><br/>")              \u2192 ["img", "br"]\n  extractTagNames("no tags")                         \u2192 []\n  extractTagNames("<h1 class='title'>Hi</h1>")       \u2192 ["h1"]\n  extractTagNames("<ul><li>A</li><li>B</li></ul>")   \u2192 ["ul", "li", "li"]`,
    starterCode: `function extractTagNames(html) {\n  // Extract all opening HTML tag names\n  // e.g. "<div><p>hello</p></div>" \u2192 ["div", "p"]\n}`,
    solution: `function extractTagNames(html) {\n  return [...html.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*\\/?>/g)].map(m => m[1]);\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return extractTagNames;')();
  return [
    { pass: JSON.stringify(fn("<div><p>hello</p></div>")) === '["div","p"]', description: '"<div><p>hello</p></div>" yields ["div","p"]', got: JSON.stringify(fn("<div><p>hello</p></div>")) },
    { pass: JSON.stringify(fn("<img src='x'/><br/>")) === '["img","br"]', description: 'self-closing tags extracted correctly', got: JSON.stringify(fn("<img src='x'/><br/>")) },
    { pass: JSON.stringify(fn("no tags")) === '[]', description: '"no tags" yields []', got: JSON.stringify(fn("no tags")) },
    { pass: JSON.stringify(fn("<h1 class='title'>Hi</h1>")) === '["h1"]', description: 'tag with attributes yields ["h1"]', got: JSON.stringify(fn("<h1 class='title'>Hi</h1>")) },
    { pass: JSON.stringify(fn("<ul><li>A</li><li>B</li></ul>")) === '["ul","li","li"]', description: 'repeated tags are each captured', got: JSON.stringify(fn("<ul><li>A</li><li>B</li></ul>")) },
  ];
}`,
    hint: 'Use matchAll with a regex that captures the tag name in a group. The pattern /<([a-zA-Z][a-zA-Z0-9]*)[^>]*\\/?>/g matches opening tags (including self-closing ones) while skipping closing tags that start with </.',
    resources: [
      { label: 'MDN: String.prototype.matchAll()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll' },
    ],
  },

  // ── 330: Password Strength Validator ──────────────────────────────────────
  {
    id: 330,
    title: 'Password Strength Validator',
    type: 'js',
    tier: 3,
    category: ['regex', 'patterns'],
    tags: ['regex', 'validation', 'strings'],
    description: 'Classify a password as "weak", "medium", or "strong" based on its length and character variety.',
    instructions: `Write a function called \`passwordStrength\` that takes a password string and returns one of three ratings:\n\n- **"weak"**: fewer than 8 characters, OR 8+ characters but only one type of character\n- **"medium"**: 8+ characters with both letters and numbers (but not all four groups)\n- **"strong"**: 8+ characters with all four: uppercase letter, lowercase letter, digit, and special character\n\nExamples:\n  passwordStrength("abc")        \u2192 "weak"\n  passwordStrength("abcd1234")   \u2192 "medium"\n  passwordStrength("Abcd123!")   \u2192 "strong"\n  passwordStrength("ABCD1234")   \u2192 "medium"\n  passwordStrength("Ab1!")       \u2192 "weak"\n  passwordStrength("abcdefgh")   \u2192 "weak"`,
    starterCode: `function passwordStrength(password) {\n  // Return "weak", "medium", or "strong"\n  // weak: < 8 chars\n  // medium: 8+ chars with both letters and numbers\n  // strong: 8+ chars with uppercase, lowercase, number, and special char\n}`,
    solution: `function passwordStrength(password) {\n  if (password.length < 8) return "weak";\n  const hasUpper = /[A-Z]/.test(password);\n  const hasLower = /[a-z]/.test(password);\n  const hasDigit = /\\d/.test(password);\n  const hasSpecial = /[^a-zA-Z0-9]/.test(password);\n  if (hasUpper && hasLower && hasDigit && hasSpecial) return "strong";\n  const hasLetters = hasUpper || hasLower;\n  if (hasLetters && hasDigit) return "medium";\n  return "weak";\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return passwordStrength;')();
  return [
    { pass: fn("abc") === "weak", description: '"abc" is weak (too short)', got: fn("abc") },
    { pass: fn("abcd1234") === "medium", description: '"abcd1234" is medium (letters + numbers)', got: fn("abcd1234") },
    { pass: fn("Abcd123!") === "strong", description: '"Abcd123!" is strong (all four groups)', got: fn("Abcd123!") },
    { pass: fn("ABCD1234") === "medium", description: '"ABCD1234" is medium (uppercase + digits)', got: fn("ABCD1234") },
    { pass: fn("Ab1!") === "weak", description: '"Ab1!" is weak (too short)', got: fn("Ab1!") },
    { pass: fn("abcdefgh") === "weak", description: '"abcdefgh" is weak (only lowercase)', got: fn("abcdefgh") },
  ];
}`,
    hint: 'First check length. Then test the password against separate regexes for uppercase (/[A-Z]/), lowercase (/[a-z]/), digits (/\\d/), and special characters (/[^a-zA-Z0-9]/). Count how many groups are present to determine the rating.',
    resources: [
      { label: 'MDN: Regular Expressions', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions' },
    ],
  },

  // ── 331: URL Parser ──────────────────────────────────────────────────────
  {
    id: 331,
    title: 'URL Parser',
    type: 'js',
    tier: 3,
    category: ['regex', 'patterns'],
    tags: ['regex', 'extraction', 'strings'],
    description: 'Parse a URL string into its component parts using regular expressions.',
    instructions: `Write a function called \`parseURL\` that takes a URL string and returns an object with the following properties:\n- \`protocol\`: the protocol (e.g., "https", "http", "ftp")\n- \`host\`: the hostname (e.g., "example.com")\n- \`path\`: the path portion (e.g., "/path/to/page"), or "" if none\n- \`query\`: the query string without the "?" (e.g., "key=val&a=b"), or "" if none\n\nExamples:\n  parseURL("https://example.com/path?key=val")\n  // { protocol: "https", host: "example.com", path: "/path", query: "key=val" }\n\n  parseURL("http://google.com")\n  // { protocol: "http", host: "google.com", path: "", query: "" }\n\n  parseURL("ftp://files.server.com/docs")\n  // { protocol: "ftp", host: "files.server.com", path: "/docs", query: "" }`,
    starterCode: `function parseURL(url) {\n  // Return { protocol, host, path, query }\n}`,
    solution: `function parseURL(url) {\n  const match = url.match(/^(https?|ftp):\\/\\/([^\\/\\?]+)(\\/[^\\?]*)?(?:\\?(.*))?$/);\n  if (!match) return { protocol: "", host: "", path: "", query: "" };\n  return {\n    protocol: match[1] || "",\n    host: match[2] || "",\n    path: match[3] || "",\n    query: match[4] || "",\n  };\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return parseURL;')();
  const r1 = fn("https://example.com/path?key=val");
  const r2 = fn("http://google.com");
  const r3 = fn("ftp://files.server.com/docs");
  return [
    { pass: r1.protocol === "https", description: 'protocol is "https"', got: r1.protocol },
    { pass: r1.host === "example.com", description: 'host is "example.com"', got: r1.host },
    { pass: r1.path === "/path", description: 'path is "/path"', got: r1.path },
    { pass: r1.query === "key=val", description: 'query is "key=val"', got: r1.query },
    { pass: r2.protocol === "http" && r2.host === "google.com", description: 'parses "http://google.com" correctly', got: JSON.stringify(r2) },
    { pass: r2.path === "" && r2.query === "", description: 'no path or query yields empty strings', got: JSON.stringify({ path: r2.path, query: r2.query }) },
    { pass: r3.protocol === "ftp" && r3.host === "files.server.com" && r3.path === "/docs", description: 'parses ftp URL correctly', got: JSON.stringify(r3) },
  ];
}`,
    hint: 'Build a regex with capture groups for each part: ^(https?|ftp):\\/\\/([^\\/\\?]+)(\\/[^\\?]*)?(?:\\?(.*))?$ — group 1 is protocol, group 2 is host, group 3 is path, group 4 is query.',
    resources: [
      { label: 'MDN: String.prototype.match()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match' },
    ],
  },

  // ── 332: Markdown Bold/Italic Converter ──────────────────────────────────
  {
    id: 332,
    title: 'Markdown Bold/Italic Converter',
    type: 'js',
    tier: 3,
    category: ['regex', 'patterns'],
    tags: ['regex', 'patterns', 'strings'],
    description: 'Convert Markdown bold and italic syntax to HTML using regular expression replacements.',
    instructions: `Write a function called \`markdownToHtml\` that converts basic Markdown formatting to HTML:\n- **bold**: \\*\\*text\\*\\* becomes <strong>text</strong>\n- *italic*: \\*text\\* becomes <em>text</em>\n\nImportant: process bold (\\*\\*) before italic (\\*) so that double-asterisk patterns are handled first.\n\nExamples:\n  markdownToHtml("**bold**")                       \u2192 "<strong>bold</strong>"\n  markdownToHtml("*italic*")                       \u2192 "<em>italic</em>"\n  markdownToHtml("**bold** and *italic*")           \u2192 "<strong>bold</strong> and <em>italic</em>"\n  markdownToHtml("no formatting")                  \u2192 "no formatting"`,
    starterCode: `function markdownToHtml(text) {\n  // Convert **bold** \u2192 <strong>bold</strong>\n  // Convert *italic* \u2192 <em>italic</em>\n}`,
    solution: `function markdownToHtml(text) {\n  return text\n    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')\n    .replace(/\\*(.+?)\\*/g, '<em>$1</em>');\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return markdownToHtml;')();
  return [
    { pass: fn("**bold**") === "<strong>bold</strong>", description: '**bold** becomes <strong>bold</strong>', got: fn("**bold**") },
    { pass: fn("*italic*") === "<em>italic</em>", description: '*italic* becomes <em>italic</em>', got: fn("*italic*") },
    { pass: fn("**bold** and *italic*") === "<strong>bold</strong> and <em>italic</em>", description: 'mixed bold and italic', got: fn("**bold** and *italic*") },
    { pass: fn("no formatting") === "no formatting", description: 'plain text unchanged', got: fn("no formatting") },
  ];
}`,
    hint: 'Use two .replace() calls chained together. Process bold first with /\\*\\*(.+?)\\*\\*/g, then italic with /\\*(.+?)\\*/g. The .+? is a non-greedy match.',
    resources: [
      { label: 'MDN: String.prototype.replace()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // regex/extraction (333-335)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 333: Log File Parser ─────────────────────────────────────────────────
  {
    id: 333,
    title: 'Log File Parser',
    type: 'js',
    tier: 4,
    category: ['regex', 'extraction'],
    tags: ['regex', 'extraction', 'strings'],
    description: 'Parse a multi-line log string into structured objects using regular expressions.',
    instructions: `Write a function called \`parseLogs\` that takes a log string (with entries separated by newlines) and returns an array of log entry objects.\n\nEach log line has the format:\n  [TIMESTAMP] LEVEL: message text\n\nFor example:\n  "[2024-01-15 10:30:00] ERROR: Connection timeout"\n\nReturn an array of objects with { timestamp, level, message } properties. Skip any lines that don't match the expected format. If the input is empty, return an empty array.\n\nExamples:\n  parseLogs("[2024-01-15 10:30:00] ERROR: Connection timeout")\n  // [{ timestamp: "2024-01-15 10:30:00", level: "ERROR", message: "Connection timeout" }]\n\n  parseLogs("[ts1] INFO: Started\\n[ts2] WARN: Low memory")\n  // [{ timestamp: "ts1", level: "INFO", message: "Started" },\n  //  { timestamp: "ts2", level: "WARN", message: "Low memory" }]\n\n  parseLogs("")  \u2192 []`,
    starterCode: `function parseLogs(logString) {\n  // your code here\n}`,
    solution: `function parseLogs(logString) {\n  if (!logString) return [];\n  const regex = /\\[(.+?)\\]\\s+(\\w+):\\s+(.+)/;\n  return logString.split('\\n')\n    .map(line => line.match(regex))\n    .filter(m => m !== null)\n    .map(m => ({ timestamp: m[1], level: m[2], message: m[3] }));\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return parseLogs;')();
  const single = fn("[2024-01-15 10:30:00] ERROR: Connection timeout");
  const multi = fn("[ts1] INFO: Started\\n[ts2] WARN: Low memory\\n[ts3] ERROR: Disk full");
  const empty = fn("");
  return [
    { pass: single.length === 1 && single[0].timestamp === "2024-01-15 10:30:00", description: 'single line: correct timestamp', got: single.length > 0 ? single[0].timestamp : 'none' },
    { pass: single.length === 1 && single[0].level === "ERROR", description: 'single line: correct level', got: single.length > 0 ? single[0].level : 'none' },
    { pass: single.length === 1 && single[0].message === "Connection timeout", description: 'single line: correct message', got: single.length > 0 ? single[0].message : 'none' },
    { pass: multi.length === 3, description: 'multi-line: returns 3 entries', got: multi.length },
    { pass: multi.length === 3 && multi[1].level === "WARN" && multi[2].level === "ERROR", description: 'multi-line: correct levels', got: multi.map(e => e.level).join(', ') },
    { pass: Array.isArray(empty) && empty.length === 0, description: 'empty string returns []', got: JSON.stringify(empty) },
  ];
}`,
    hint: 'Split the input by newlines. For each line, use a regex like /\\[(.+?)\\]\\s+(\\w+):\\s+(.+)/ which captures the timestamp (inside brackets), the level word, and the message. Filter out non-matching lines.',
    resources: [
      { label: 'MDN: String.prototype.split()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split' },
      { label: 'MDN: Capturing Groups', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences' },
    ],
  },

  // ── 334: Template String Interpolator ────────────────────────────────────
  {
    id: 334,
    title: 'Template String Interpolator',
    type: 'js',
    tier: 4,
    category: ['regex', 'extraction'],
    tags: ['regex', 'extraction', 'strings'],
    description: 'Build a template engine that replaces {{key}} placeholders with values from a data object, supporting nested keys.',
    instructions: `Write a function called \`interpolate\` that takes a template string and a data object, and replaces all \`{{key}}\` placeholders with the corresponding values from the data object.\n\nSupport dot-notation for nested keys (e.g., "{{user.name}}" looks up data.user.name). If a key is not found, keep the original placeholder unchanged.\n\nExamples:\n  interpolate("Hello {{name}}", { name: "World" })\n  // "Hello World"\n\n  interpolate("{{user.name}} is {{user.age}}", { user: { name: "Alice", age: 30 } })\n  // "Alice is 30"\n\n  interpolate("{{missing}} stays", { name: "X" })\n  // "{{missing}} stays"`,
    starterCode: `function interpolate(template, data) {\n  // your code here\n}`,
    solution: `function interpolate(template, data) {\n  return template.replace(/\\{\\{([\\w.]+)\\}\\}/g, (_, key) => {\n    const parts = key.split('.');\n    let val = data;\n    for (const p of parts) {\n      val = val != null ? val[p] : undefined;\n    }\n    return val !== undefined ? val : '{{' + key + '}}';\n  });\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return interpolate;')();
  const r1 = fn("Hello {{name}}", { name: "World" });
  const r2 = fn("{{user.name}} is {{user.age}}", { user: { name: "Alice", age: 30 } });
  const r3 = fn("{{missing}} stays", { name: "X" });
  const r4 = fn("{{a}} and {{b}}", { a: "1", b: "2" });
  const r5 = fn("no placeholders", { x: 1 });
  return [
    { pass: r1 === "Hello World", description: 'simple key replacement', got: r1 },
    { pass: r2 === "Alice is 30", description: 'nested key with dot notation', got: r2 },
    { pass: r3 === "{{missing}} stays", description: 'missing key keeps placeholder', got: r3 },
    { pass: r4 === "1 and 2", description: 'multiple replacements', got: r4 },
    { pass: r5 === "no placeholders", description: 'no placeholders returns unchanged', got: r5 },
  ];
}`,
    hint: 'Use .replace() with /\\{\\{([\\w.]+)\\}\\}/g. In the replacer function, split the captured key by "." and walk into the data object step by step. If any step yields undefined, return the original placeholder.',
    resources: [
      { label: 'MDN: String.prototype.replace()', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace' },
    ],
  },

  // ── 335: Regex-based Tokenizer ───────────────────────────────────────────
  {
    id: 335,
    title: 'Regex-based Tokenizer',
    type: 'js',
    tier: 5,
    category: ['regex', 'extraction'],
    tags: ['regex', 'extraction', 'strings', 'advanced'],
    description: 'Build a lexical tokenizer that converts an input string into an array of typed tokens using configurable regex rules.',
    instructions: `Write a function called \`tokenize\` that takes an input string and an array of token rules, and returns an array of token objects.\n\nEach rule is an object: \`{ type: string, pattern: RegExp }\`\n\nThe tokenizer should:\n1. Start at the beginning of the input string\n2. Skip any leading whitespace\n3. Try each rule's pattern at the current position (anchor with ^)\n4. If a rule matches, push \`{ type: rule.type, value: matchedText }\` and advance past the match\n5. If no rule matches, push \`{ type: "UNKNOWN", value: currentChar }\` and advance by 1\n6. Repeat until the end of the string\n\nExamples:\n  const rules = [\n    { type: 'NUMBER', pattern: /\\d+/ },\n    { type: 'OPERATOR', pattern: /[+\\-*/]/ },\n  ];\n  tokenize("42 + 3", rules)\n  // [{ type: "NUMBER", value: "42" }, { type: "OPERATOR", value: "+" }, { type: "NUMBER", value: "3" }]\n\n  const rules2 = [\n    { type: 'IDENT', pattern: /[a-zA-Z_]\\w*/ },\n    { type: 'ASSIGN', pattern: /=/ },\n    { type: 'NUMBER', pattern: /\\d+/ },\n  ];\n  tokenize("x = 10", rules2)\n  // [{ type: "IDENT", value: "x" }, { type: "ASSIGN", value: "=" }, { type: "NUMBER", value: "10" }]`,
    starterCode: `// Build a tokenizer: tokenize(input, rules) \u2192 [{type, value}]\n// rules: [{type: string, pattern: RegExp}]\n// Skip whitespace between tokens\n// Unknown chars \u2192 {type: "UNKNOWN", value: char}\nfunction tokenize(input, rules) {\n\n}`,
    solution: `function tokenize(input, rules) {\n  const tokens = [];\n  let pos = 0;\n  while (pos < input.length) {\n    // Skip whitespace\n    const wsMatch = input.slice(pos).match(/^\\s+/);\n    if (wsMatch) {\n      pos += wsMatch[0].length;\n      if (pos >= input.length) break;\n    }\n    let matched = false;\n    for (const rule of rules) {\n      const re = new RegExp('^(?:' + rule.pattern.source + ')');\n      const m = input.slice(pos).match(re);\n      if (m) {\n        tokens.push({ type: rule.type, value: m[0] });\n        pos += m[0].length;\n        matched = true;\n        break;\n      }\n    }\n    if (!matched) {\n      tokens.push({ type: 'UNKNOWN', value: input[pos] });\n      pos++;\n    }\n  }\n  return tokens;\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return tokenize;')();
  const mathRules = [
    { type: 'NUMBER', pattern: /\\d+/ },
    { type: 'OPERATOR', pattern: /[+\\-*/]/ },
  ];
  const r1 = fn("42 + 3", mathRules);

  const assignRules = [
    { type: 'IDENT', pattern: /[a-zA-Z_]\\w*/ },
    { type: 'ASSIGN', pattern: /=/ },
    { type: 'NUMBER', pattern: /\\d+/ },
  ];
  const r2 = fn("x = 10", assignRules);
  const r3 = fn("hello @ world", assignRules);

  return [
    { pass: r1.length === 3 && r1[0].type === 'NUMBER' && r1[0].value === '42', description: 'tokenizes "42" as NUMBER', got: JSON.stringify(r1[0]) },
    { pass: r1.length === 3 && r1[1].type === 'OPERATOR' && r1[1].value === '+', description: 'tokenizes "+" as OPERATOR', got: JSON.stringify(r1[1]) },
    { pass: r1.length === 3 && r1[2].type === 'NUMBER' && r1[2].value === '3', description: 'tokenizes "3" as NUMBER', got: JSON.stringify(r1[2]) },
    { pass: r2.length === 3 && r2[0].type === 'IDENT' && r2[0].value === 'x', description: 'tokenizes "x" as IDENT', got: JSON.stringify(r2[0]) },
    { pass: r2.length === 3 && r2[1].type === 'ASSIGN' && r2[1].value === '=', description: 'tokenizes "=" as ASSIGN', got: JSON.stringify(r2[1]) },
    { pass: r2.length === 3 && r2[2].type === 'NUMBER' && r2[2].value === '10', description: 'tokenizes "10" as NUMBER', got: JSON.stringify(r2[2]) },
    { pass: r3.some(t => t.type === 'UNKNOWN' && t.value === '@'), description: 'unknown char "@" produces UNKNOWN token', got: JSON.stringify(r3.find(t => t.type === 'UNKNOWN')) },
  ];
}`,
    hint: 'Iterate through the string with a position pointer. At each position, skip whitespace first, then try each rule by creating a new RegExp anchored to the start (^) of the remaining string. Use rule.pattern.source to get the pattern text.',
    resources: [
      { label: 'MDN: RegExp constructor', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp' },
      { label: 'Wikipedia: Lexical Analysis', url: 'https://en.wikipedia.org/wiki/Lexical_analysis' },
    ],
  },
];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} regex exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

// ─── UPDATE DEFAULT-CURRICULUM ───────────────────────────────────────────────

const dc = data.collections.find(c => c.id === 'default-curriculum');
if (dc) {
  const ids = new Set(dc.exerciseIds);
  for (const ex of newExercises) ids.add(ex.id);
  dc.exerciseIds = [...ids].sort((a, b) => a - b);
  console.log(`  Updated default-curriculum: ${dc.exerciseIds.length} exercises`);
}

// ─── WRITE BACK ──────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

const tierCounts = {};
for (const ex of data.exercises) {
  tierCounts[ex.tier] = (tierCounts[ex.tier] || 0) + 1;
}

const categoryCounts = {};
for (const ex of newExercises) {
  const cat = ex.category[0] + '/' + ex.category[1];
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

console.log('\n=== Migration Complete ===');
console.log(`  New exercises: ${newExercises.length}`);
console.log(`  ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`  Total exercises: ${data.exercises.length}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
console.log(`  By subcategory: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
