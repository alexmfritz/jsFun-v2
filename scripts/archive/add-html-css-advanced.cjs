#!/usr/bin/env node
/**
 * Add 15 advanced HTML/CSS exercises (Tier 3-5) to exercises.json
 *
 * Tier 3: 3 HTML + 3 CSS + 2 HTML-CSS = 8
 * Tier 4: 3 CSS + 2 HTML-CSS = 5
 * Tier 5: 2 HTML-CSS = 2
 * Total: 15
 */

const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Find the current max ID
const maxId = Math.max(...data.exercises.map(e => e.id));
console.log(`Current max exercise ID: ${maxId}`);
console.log(`Current total exercises: ${data.exercises.length}`);

let nextId = maxId + 1;

const newExercises = [];

// =============================================================================
// TIER 3 HTML EXERCISES (3)
// =============================================================================

// 1. Accessible Form with Validation Attributes
newExercises.push({
  id: nextId++,
  title: "Accessible Form with Validation Attributes",
  type: "html",
  tier: 3,
  category: ["html", "forms"],
  tags: ["html", "forms", "validation", "accessibility", "intermediate"],
  description: "Build a registration form that uses native HTML5 validation attributes for client-side validation without JavaScript.",
  instructions: `Build a registration form with HTML5 validation attributes.

**Required structure:**
- A \`<form>\` element with \`id="registration-form"\`
- An email input with \`id="email"\`, \`type="email"\`, and \`required\` attribute
- A password input with \`id="password"\`, \`type="password"\`, \`required\`, and \`minlength="8"\`
- A username input with \`id="username"\`, \`type="text"\`, \`required\`, and a \`pattern\` attribute that allows only alphanumeric characters (e.g. \`pattern="[a-zA-Z0-9]+"\`)
- Each input must have an associated \`<label>\` using the \`for\` attribute
- A submit button with text "Register"

**Validation rules via HTML attributes:**
- Email: must be a valid email (handled by \`type="email"\`)
- Password: required, minimum 8 characters
- Username: required, alphanumeric only (via pattern)

No JavaScript needed — HTML5 validation attributes handle everything.`,
  starterCode: "<!-- Build your registration form with validation attributes -->\n",
  solution: `<form id="registration-form">
  <label for="username">Username</label>
  <input type="text" id="username" name="username" required pattern="[a-zA-Z0-9]+" title="Alphanumeric characters only">

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>

  <label for="password">Password</label>
  <input type="password" id="password" name="password" required minlength="8">

  <button type="submit">Register</button>
</form>`,
  testRunner: "",
  testCases: [
    {
      query: "form#registration-form",
      assertion: "exists",
      description: "form with id=\"registration-form\" exists"
    },
    {
      query: "input#email[type='email']",
      assertion: "exists",
      description: "email input with type=\"email\" exists"
    },
    {
      query: "input#email[required]",
      assertion: "exists",
      description: "email input has required attribute"
    },
    {
      query: "input#password[type='password']",
      assertion: "exists",
      description: "password input with type=\"password\" exists"
    },
    {
      query: "form",
      assertion: "sourceMatch",
      value: "minlength",
      description: "password input uses minlength attribute"
    },
    {
      query: "input#username[required]",
      assertion: "exists",
      description: "username input has required attribute"
    },
    {
      query: "form",
      assertion: "sourceMatch",
      value: "pattern=",
      description: "username uses a pattern attribute for validation"
    },
    {
      query: "label[for='email']",
      assertion: "exists",
      description: "label associated with email input"
    },
    {
      query: "label[for='password']",
      assertion: "exists",
      description: "label associated with password input"
    },
    {
      query: "label[for='username']",
      assertion: "exists",
      description: "label associated with username input"
    }
  ],
  hint: "HTML5 provides built-in validation attributes that work without JavaScript. The browser validates on form submission automatically.",
  resources: [
    {
      label: "MDN: Client-side form validation",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation",
      description: "Using HTML5 validation attributes"
    },
    {
      label: "MDN: <input> pattern attribute",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern",
      description: "Regex patterns for input validation"
    },
    {
      label: "MDN: <input> minlength",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/minlength",
      description: "Setting minimum character length"
    }
  ],
  hints: [
    "Which HTML attributes let the browser validate user input without writing any JavaScript?",
    "HTML5 provides built-in validation: `required` prevents empty fields, `type=\"email\"` checks email format, `minlength` enforces minimum length, and `pattern` accepts a regex. The browser validates on submit automatically.",
    "Key elements: `<form>`, `<label>`, `<input>`, `<button>`. Important attributes: `type`, `required`, `minlength`, `pattern`, `for`."
  ]
});

// 2. Semantic Article Layout
newExercises.push({
  id: nextId++,
  title: "Semantic Article Layout",
  type: "html",
  tier: 3,
  category: ["html", "semantics"],
  tags: ["html", "semantics", "article", "structure", "intermediate"],
  description: "Create a blog post layout using semantic HTML5 elements including article, header, footer, time, figure, and figcaption.",
  instructions: `Create a complete blog post using semantic HTML elements.

**Required structure:**
- An \`<article>\` element wrapping the entire post
- Inside the article, a \`<header>\` containing:
  - An \`<h1>\` with the post title
  - A \`<time>\` element with a \`datetime\` attribute (e.g. \`datetime="2024-01-15"\`)
  - A \`<p>\` with class \`author\` for the author name
- At least one \`<p>\` paragraph of post content (outside the header)
- A \`<figure>\` element containing:
  - An \`<img>\` (any src/alt)
  - A \`<figcaption>\` describing the image
- A \`<footer>\` inside the article containing a \`<p>\` with class \`tags\`

This structure gives screen readers and search engines clear information about the content's purpose and hierarchy.`,
  starterCode: "<!-- Build your semantic blog post layout -->\n",
  solution: `<article>
  <header>
    <h1>Understanding Semantic HTML</h1>
    <time datetime="2024-01-15">January 15, 2024</time>
    <p class="author">By Jane Developer</p>
  </header>

  <p>Semantic HTML uses elements that describe the meaning of their content, making web pages more accessible and better understood by search engines.</p>

  <figure>
    <img src="/placeholder.jpg" alt="Diagram of semantic elements">
    <figcaption>A visual overview of HTML5 semantic elements</figcaption>
  </figure>

  <footer>
    <p class="tags">Tags: HTML, Semantics, Accessibility</p>
  </footer>
</article>`,
  testRunner: "",
  testCases: [
    {
      query: "article",
      assertion: "exists",
      description: "<article> element exists"
    },
    {
      query: "article > header",
      assertion: "exists",
      description: "<header> is a direct child of <article>"
    },
    {
      query: "article header h1",
      assertion: "exists",
      description: "<h1> exists inside the article header"
    },
    {
      query: "time[datetime]",
      assertion: "exists",
      description: "<time> element has a datetime attribute"
    },
    {
      query: ".author",
      assertion: "exists",
      description: "element with class \"author\" exists"
    },
    {
      query: "figure",
      assertion: "exists",
      description: "<figure> element exists"
    },
    {
      query: "figure img",
      assertion: "exists",
      description: "<img> inside <figure>"
    },
    {
      query: "figcaption",
      assertion: "exists",
      description: "<figcaption> element exists"
    },
    {
      query: "article > footer",
      assertion: "exists",
      description: "<footer> is a direct child of <article>"
    },
    {
      query: "footer .tags",
      assertion: "exists",
      description: "element with class \"tags\" inside footer"
    }
  ],
  hint: "Think of an article as a self-contained piece of content that could be syndicated. The header provides metadata, figure wraps media with a caption, and footer closes it out.",
  resources: [
    {
      label: "MDN: <article>",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article",
      description: "Self-contained composition in a document"
    },
    {
      label: "MDN: <time>",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time",
      description: "Machine-readable dates and times"
    },
    {
      label: "MDN: <figure>",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure",
      description: "Self-contained content with optional caption"
    }
  ],
  hints: [
    "What HTML5 elements exist specifically for structuring a self-contained piece of content like a blog post?",
    "An `<article>` wraps the whole post. Inside, `<header>` holds the title/date/author, `<figure>` wraps an image with `<figcaption>`, and `<footer>` holds metadata like tags. The `<time>` element needs a `datetime` attribute for machine readability.",
    "Key elements: `<article>`, `<header>`, `<h1>`, `<time>`, `<figure>`, `<figcaption>`, `<footer>`. Important attributes: `datetime`, `src`, `alt`."
  ]
});

// 3. Data Table with Scope
newExercises.push({
  id: nextId++,
  title: "Data Table with Scope and Spanning",
  type: "html",
  tier: 3,
  category: ["html", "structure"],
  tags: ["html", "tables", "accessibility", "scope", "intermediate"],
  description: "Build a multi-section data table with proper accessibility: thead, tbody, th with scope attributes, caption, and column spanning.",
  instructions: `Build an accessible quarterly sales data table.

**Required structure:**
- A \`<table>\` element with \`id="sales-table"\`
- A \`<caption>\` element describing the table's purpose
- A \`<thead>\` with a header row containing at least 4 \`<th>\` elements, each with \`scope="col"\`
- At least two \`<tbody>\` sections (e.g., one for each product category) — each \`<tbody>\` should start with a \`<tr>\` that has a \`<th>\` with \`scope="row"\` and \`colspan\` spanning the full table width as a group header
- At least 2 data rows per \`<tbody>\` with \`<td>\` elements
- A \`<tfoot>\` section with a summary/totals row

**Example column headers:** Product, Q1, Q2, Q3

The \`scope\` attribute on \`<th>\` tells screen readers whether the heading applies to a column (\`scope="col"\`) or a row (\`scope="row"\`). Using multiple \`<tbody>\` elements groups related rows semantically.`,
  starterCode: "<!-- Build your accessible data table -->\n<!-- Use thead, multiple tbody, tfoot -->\n<!-- Add scope and colspan where appropriate -->\n",
  solution: `<table id="sales-table">
  <caption>Quarterly Sales Report 2024</caption>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" colspan="4">Electronics</th>
    </tr>
    <tr>
      <td>Laptops</td>
      <td>$12,000</td>
      <td>$15,000</td>
      <td>$18,000</td>
    </tr>
    <tr>
      <td>Phones</td>
      <td>$8,000</td>
      <td>$9,500</td>
      <td>$11,000</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="row" colspan="4">Accessories</th>
    </tr>
    <tr>
      <td>Cases</td>
      <td>$2,000</td>
      <td>$2,500</td>
      <td>$3,000</td>
    </tr>
    <tr>
      <td>Chargers</td>
      <td>$1,500</td>
      <td>$1,800</td>
      <td>$2,200</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$23,500</td>
      <td>$28,800</td>
      <td>$34,200</td>
    </tr>
  </tfoot>
</table>`,
  testRunner: "",
  testCases: [
    {
      query: "table#sales-table",
      assertion: "exists",
      description: "table with id=\"sales-table\" exists"
    },
    {
      query: "caption",
      assertion: "exists",
      description: "<caption> element exists"
    },
    {
      query: "thead",
      assertion: "exists",
      description: "<thead> element exists"
    },
    {
      query: "th[scope='col']",
      assertion: "countAtLeast",
      value: 4,
      description: "at least 4 <th> elements with scope=\"col\""
    },
    {
      query: "tbody",
      assertion: "countAtLeast",
      value: 2,
      description: "at least 2 <tbody> sections"
    },
    {
      query: "table",
      assertion: "sourceMatch",
      value: "colspan",
      description: "uses colspan attribute"
    },
    {
      query: "th[scope='row']",
      assertion: "countAtLeast",
      value: 1,
      description: "at least 1 <th> with scope=\"row\""
    },
    {
      query: "tfoot",
      assertion: "exists",
      description: "<tfoot> element exists"
    }
  ],
  hint: "Multiple <tbody> elements can group rows into logical sections. Use th[scope=\"col\"] for column headers and th[scope=\"row\"] for row headers. A colspan attribute lets a cell span multiple columns.",
  resources: [
    {
      label: "MDN: <table>",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table",
      description: "HTML table element and structure"
    },
    {
      label: "MDN: th scope attribute",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th",
      description: "Defining header cell scope for accessibility"
    },
    {
      label: "MDN: colspan attribute",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td",
      description: "Making cells span multiple columns"
    }
  ],
  hints: [
    "How can you group related rows in a table, and how does the scope attribute help screen readers understand the table?",
    "Use multiple `<tbody>` elements to group rows semantically. Each group can start with a `<th scope=\"row\" colspan=\"...\">` that spans all columns as a section header. Column headers in `<thead>` use `scope=\"col\"`.",
    "Key elements: `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th>`, `<td>`. Important attributes: `scope`, `colspan`, `id`."
  ]
});

// =============================================================================
// TIER 3 CSS EXERCISES (3)
// =============================================================================

// 4. Flexbox Card Grid
newExercises.push({
  id: nextId++,
  title: "Flexbox Card Grid",
  type: "css",
  tier: 3,
  category: ["css", "flexbox"],
  tags: ["css", "flexbox", "cards", "layout", "responsive", "intermediate"],
  description: "Style a set of cards into a responsive wrapping flex grid where all cards have equal height within each row.",
  instructions: `Style the provided cards into a responsive flex grid.

**Requirements:**
1. \`.card-grid\` uses \`display: flex\` with \`flex-wrap: wrap\`
2. \`.card-grid\` has a \`gap\` of \`16px\`
3. Each \`.card\` should have:
   - A \`flex\` value that makes it roughly 1/3 width minus gap (use \`flex: 1 1 280px\` or similar with a min-width)
   - \`padding\` of \`20px\`
   - A visible \`border\` (e.g. \`1px solid #334155\`)
   - \`border-radius\` of \`8px\`
4. Cards should stretch to equal height within each row (default flex behavior with \`align-items: stretch\`)

The cards should wrap to fewer columns as the container shrinks, without using any media queries.`,
  starterCode: "/* Style the .card-grid and .card elements */\n",
  providedHtml: `<div class="card-grid" id="card-grid-el"><div class="card"><h3>Card 1</h3><p>Short text.</p></div><div class="card"><h3>Card 2</h3><p>This card has more content to show equal height behavior across the row.</p></div><div class="card"><h3>Card 3</h3><p>Medium length text here.</p></div><div class="card"><h3>Card 4</h3><p>Another card.</p></div></div>`,
  solution: `.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 280px;
  padding: 20px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
}`,
  testRunner: "",
  testCases: [
    {
      query: "#card-grid-el",
      assertion: "equals",
      property: "display",
      value: "flex",
      description: ".card-grid uses display: flex"
    },
    {
      query: "#card-grid-el",
      assertion: "equals",
      property: "flex-wrap",
      value: "wrap",
      description: ".card-grid uses flex-wrap: wrap"
    },
    {
      query: ".card",
      assertion: "countAtLeast",
      value: 4,
      description: "at least 4 .card elements rendered"
    },
    {
      query: ".card",
      assertion: "equals",
      property: "padding",
      value: "20px",
      description: ".card has padding of 20px"
    },
    {
      query: ".card",
      assertion: "equals",
      property: "border-radius",
      value: "8px",
      description: ".card has border-radius of 8px"
    }
  ],
  hint: "Flexbox with flex-wrap: wrap creates a responsive grid without media queries. The flex shorthand (flex: grow shrink basis) controls how items size and wrap.",
  resources: [
    {
      label: "MDN: flex-wrap",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap",
      description: "Controlling whether flex items wrap to new lines"
    },
    {
      label: "MDN: flex shorthand",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex",
      description: "The flex grow, shrink, and basis shorthand"
    },
    {
      label: "MDN: gap",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gap",
      description: "Setting gutters between flex/grid items"
    }
  ],
  hints: [
    "How does flex-wrap combined with a flex-basis value create a naturally responsive layout?",
    "Set `display: flex` and `flex-wrap: wrap` on the container. Give each card a flex-basis (e.g. `flex: 1 1 280px`) so it has a minimum width but can grow. Cards will automatically wrap to a new row when the container is too narrow.",
    "Container: `display`, `flex-wrap`, `gap`. Cards: `flex`, `padding`, `border`, `border-radius`."
  ]
});

// 5. CSS Grid Dashboard
newExercises.push({
  id: nextId++,
  title: "CSS Grid Dashboard",
  type: "css",
  tier: 3,
  category: ["css", "layout"],
  tags: ["css", "grid", "layout", "dashboard", "named-areas", "intermediate"],
  description: "Arrange dashboard panels into a grid layout using CSS Grid with named template areas.",
  instructions: `Style the provided dashboard panels into a grid layout using named areas.

**Requirements:**
1. \`.dashboard\` uses \`display: grid\`
2. Use \`grid-template-areas\` to define named regions:
   - Row 1: \`"header header"\`
   - Row 2: \`"sidebar main"\`
   - Row 3: \`"sidebar footer"\`
3. Use \`grid-template-columns\` with two columns (e.g. \`240px 1fr\`)
4. Assign each child to its area using \`grid-area\`:
   - \`.panel-header\` → \`header\`
   - \`.panel-sidebar\` → \`sidebar\`
   - \`.panel-main\` → \`main\`
   - \`.panel-footer\` → \`footer\`
5. Add a \`gap\` of \`12px\`
6. Each panel should have \`padding\` of \`16px\`

The header spans the full width, the sidebar spans two rows on the left.`,
  starterCode: "/* Style the .dashboard grid with named areas */\n",
  providedHtml: `<div class="dashboard" id="dashboard-el"><div class="panel-header" id="panel-header-el">Header</div><div class="panel-sidebar" id="panel-sidebar-el">Sidebar</div><div class="panel-main" id="panel-main-el">Main Content</div><div class="panel-footer" id="panel-footer-el">Footer</div></div>`,
  solution: `.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "sidebar footer";
  grid-template-columns: 240px 1fr;
  gap: 12px;
  min-height: 100vh;
}

.panel-header {
  grid-area: header;
  padding: 16px;
  background: #1e293b;
}

.panel-sidebar {
  grid-area: sidebar;
  padding: 16px;
  background: #1e293b;
}

.panel-main {
  grid-area: main;
  padding: 16px;
  background: #0f172a;
}

.panel-footer {
  grid-area: footer;
  padding: 16px;
  background: #1e293b;
}`,
  testRunner: "",
  testCases: [
    {
      query: "#dashboard-el",
      assertion: "equals",
      property: "display",
      value: "grid",
      description: ".dashboard uses display: grid"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "grid-template-areas",
      description: "uses grid-template-areas"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "grid-template-columns",
      description: "uses grid-template-columns"
    },
    {
      query: "#panel-header-el",
      assertion: "equals",
      property: "padding",
      value: "16px",
      description: ".panel-header has padding of 16px"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "grid-area",
      description: "assigns children to grid areas"
    }
  ],
  hint: "grid-template-areas takes strings where each string represents a row. Repeat a name to make an element span multiple cells. Then assign each child with grid-area: name.",
  resources: [
    {
      label: "MDN: grid-template-areas",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas",
      description: "Naming grid regions for easy layout"
    },
    {
      label: "MDN: CSS Grid Layout",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      description: "Complete guide to CSS Grid"
    },
    {
      label: "MDN: grid-area",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area",
      description: "Assigning an element to a named grid area"
    }
  ],
  hints: [
    "How does grid-template-areas let you visually define a layout using strings of named regions?",
    "Define `grid-template-areas` as a series of strings — each string is one row, with space-separated area names. Repeating a name spans that area across cells. Assign each child with `grid-area: areaName`.",
    "Container: `display`, `grid-template-areas`, `grid-template-columns`, `gap`. Children: `grid-area`, `padding`."
  ]
});

// 6. Media Query Responsive Nav
newExercises.push({
  id: nextId++,
  title: "Media Query Responsive Nav",
  type: "css",
  tier: 3,
  category: ["css", "layout"],
  tags: ["css", "media-queries", "responsive", "navigation", "intermediate"],
  description: "Style a navigation bar that switches from a horizontal layout to a vertical stacked layout at a breakpoint using a media query.",
  instructions: `Style the provided navigation to be responsive using a media query.

**Desktop layout (default, min-width: 600px):**
1. \`.nav\` uses \`display: flex\` with \`flex-direction: row\`
2. \`.nav\` has \`justify-content: space-between\` and \`align-items: center\`
3. \`.nav\` has a \`background-color\` of \`#1e293b\`
4. Each \`.nav-link\` has \`padding\` of \`12px 16px\`

**Mobile layout (max-width: 599px):**
5. Add a \`@media (max-width: 599px)\` query that:
   - Changes \`.nav\` to \`flex-direction: column\`
   - Sets \`align-items: stretch\` so links fill the full width
   - Adds a visible bottom border on each \`.nav-link\` (e.g. \`1px solid #334155\`)

The nav should be horizontal on wider screens and stack vertically on narrow screens.`,
  starterCode: "/* Style the responsive nav */\n",
  providedHtml: `<nav class="nav" id="nav-el"><a class="nav-link" href="#">Home</a><a class="nav-link" href="#">About</a><a class="nav-link" href="#">Services</a><a class="nav-link" href="#">Contact</a></nav>`,
  solution: `.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  padding: 0;
}

.nav-link {
  padding: 12px 16px;
  color: #e2e8f0;
  text-decoration: none;
}

@media (max-width: 599px) {
  .nav {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-link {
    border-bottom: 1px solid #334155;
  }
}`,
  testRunner: "",
  testCases: [
    {
      query: "#nav-el",
      assertion: "equals",
      property: "display",
      value: "flex",
      description: ".nav uses display: flex"
    },
    {
      query: "#nav-el",
      assertion: "equals",
      property: "background-color",
      value: "rgb(30, 41, 59)",
      description: ".nav has background-color #1e293b"
    },
    {
      query: ".nav-link",
      assertion: "countAtLeast",
      value: 4,
      description: "at least 4 nav links rendered"
    },
    {
      query: ".nav",
      assertion: "sourceMatch",
      value: "@media",
      description: "uses a @media query"
    },
    {
      query: ".nav",
      assertion: "sourceMatch",
      value: "flex-direction",
      description: "uses flex-direction property"
    }
  ],
  hint: "@media queries let you apply different styles at different screen widths. Changing flex-direction from row to column converts a horizontal layout to vertical.",
  resources: [
    {
      label: "MDN: Using media queries",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries",
      description: "Responsive design with CSS media queries"
    },
    {
      label: "MDN: flex-direction",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction",
      description: "Controlling the direction of flex items"
    }
  ],
  hints: [
    "How do you change a layout based on screen width, and which flex property controls horizontal vs vertical stacking?",
    "Start with the desktop layout using `display: flex` and `flex-direction: row`. Then add `@media (max-width: 599px)` to switch to `flex-direction: column` and `align-items: stretch` for the mobile view.",
    "Desktop: `display`, `flex-direction`, `justify-content`, `align-items`. Mobile media query: `flex-direction`, `align-items`, `border-bottom`."
  ]
});

// =============================================================================
// TIER 3 HTML-CSS COMBINED (2)
// =============================================================================

// 7. Pricing Cards
newExercises.push({
  id: nextId++,
  title: "Pricing Cards",
  type: "html-css",
  tier: 3,
  category: ["css", "layout"],
  tags: ["html", "css", "flexbox", "cards", "layout", "intermediate"],
  description: "Build and style three pricing tier cards displayed side by side, with the middle card highlighted as the popular choice.",
  instructions: `Build three pricing tier cards displayed in a row.

**Required HTML:**
- A \`.pricing-container\` wrapping 3 \`.pricing-card\` elements
- Each card has:
  - An \`<h3>\` with the tier name (e.g. "Basic", "Pro", "Enterprise")
  - A \`.price\` element showing the price
  - A \`<ul>\` with at least 2 \`<li>\` feature items
  - A \`<button>\` with class \`btn\`
- The middle card should have an additional class \`.popular\`

**Required CSS:**
1. \`.pricing-container\` uses \`display: flex\` with a \`gap\`
2. Each \`.pricing-card\` has \`padding\`, \`border-radius\`, and a visible \`border\`
3. \`.pricing-card.popular\` should be visually distinct — use a different \`border-color\` (e.g. \`#6366f1\`) and \`transform: scale(1.05)\` to make it slightly larger
4. \`.btn\` has \`padding\`, a \`background-color\`, and \`border-radius\`

The popular card should stand out visually from the other two.`,
  starterCode: "<!-- Build your pricing cards -->\n\n/* Style your pricing cards below */\n",
  solution: `<div class="pricing-container">
  <div class="pricing-card">
    <h3>Basic</h3>
    <div class="price">$9/mo</div>
    <ul>
      <li>5 Projects</li>
      <li>Basic Support</li>
    </ul>
    <button class="btn">Choose Basic</button>
  </div>
  <div class="pricing-card popular">
    <h3>Pro</h3>
    <div class="price">$29/mo</div>
    <ul>
      <li>Unlimited Projects</li>
      <li>Priority Support</li>
      <li>API Access</li>
    </ul>
    <button class="btn">Choose Pro</button>
  </div>
  <div class="pricing-card">
    <h3>Enterprise</h3>
    <div class="price">$99/mo</div>
    <ul>
      <li>Everything in Pro</li>
      <li>Dedicated Manager</li>
    </ul>
    <button class="btn">Choose Enterprise</button>
  </div>
</div>

<style>
  .pricing-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
  }
  .pricing-card {
    flex: 1;
    max-width: 300px;
    padding: 24px;
    border: 1px solid #334155;
    border-radius: 12px;
    text-align: center;
    background: #1e293b;
  }
  .pricing-card.popular {
    border-color: #6366f1;
    transform: scale(1.05);
  }
  .price {
    font-size: 2rem;
    font-weight: bold;
    margin: 16px 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  li {
    padding: 8px 0;
    border-bottom: 1px solid #334155;
  }
  .btn {
    padding: 10px 24px;
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: ".pricing-container",
      assertion: "exists",
      description: ".pricing-container exists"
    },
    {
      query: ".pricing-container",
      assertion: "equals",
      property: "display",
      value: "flex",
      description: ".pricing-container uses display: flex"
    },
    {
      query: ".pricing-card",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 .pricing-card elements"
    },
    {
      query: ".pricing-card.popular",
      assertion: "exists",
      description: "a .pricing-card with .popular class exists"
    },
    {
      query: ".pricing-card h3",
      assertion: "countAtLeast",
      value: 3,
      description: "each card has an h3 heading"
    },
    {
      query: ".pricing-card .btn",
      assertion: "countAtLeast",
      value: 3,
      description: "each card has a .btn button"
    },
    {
      query: ".pricing-card.popular",
      assertion: "sourceMatch",
      value: "scale",
      description: ".popular card uses transform: scale"
    }
  ],
  hint: "Use Flexbox to lay out the three cards side by side. The .popular class gives the middle card a distinct look — a brighter border and a slight scale() transform make it pop.",
  resources: [
    {
      label: "MDN: transform",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
      description: "CSS transform for scale, rotate, translate"
    },
    {
      label: "MDN: Flexbox",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout",
      description: "Flexible box layout for card alignment"
    }
  ],
  hints: [
    "How can you make one card stand out from the others using CSS transforms and border styles?",
    "Place 3 `.pricing-card` elements in a flex container. Give `.pricing-card.popular` a different `border-color` and `transform: scale(1.05)` so it appears slightly larger and highlighted.",
    "HTML: Key elements: `<h3>`, `<ul>`, `<li>`, `<button>`. CSS: Key properties: `display`, `flex`, `gap`, `border`, `border-radius`, `transform`."
  ]
});

// 8. Breadcrumb Navigation
newExercises.push({
  id: nextId++,
  title: "Breadcrumb Navigation",
  type: "html-css",
  tier: 3,
  category: ["html", "structure"],
  tags: ["html", "css", "navigation", "breadcrumb", "pseudo-elements", "intermediate"],
  description: "Create and style a breadcrumb navigation with separator arrows generated by CSS pseudo-elements.",
  instructions: `Build a breadcrumb navigation with CSS-generated separators.

**Required HTML:**
- A \`<nav>\` with \`aria-label="Breadcrumb"\`
- Inside, an \`<ol>\` with class \`breadcrumb\`
- At least 3 \`<li>\` items, each containing an \`<a>\` link
- The last \`<li>\` should have class \`current\` and an \`aria-current="page"\` attribute on its link

**Required CSS:**
1. \`.breadcrumb\` uses \`display: flex\` and \`list-style: none\`
2. Use a CSS pseudo-element (\`.breadcrumb li + li::before\`) to insert a separator character (e.g. "/" or "\\203A" for a right chevron \`›\`)
3. The separator should have \`padding\` or \`margin\` on both sides
4. \`.current a\` should be styled differently (e.g. no underline, different color) to show it's the active page
5. Links should have \`text-decoration: none\`

CSS pseudo-elements generate the separators — no extra HTML needed between items.`,
  starterCode: "<!-- Build your breadcrumb nav -->\n\n/* Style with CSS pseudo-element separators */\n",
  solution: `<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li><a href="#">Products</a></li>
    <li class="current"><a href="#" aria-current="page">Widget Pro</a></li>
  </ol>
</nav>

<style>
  .breadcrumb {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .breadcrumb a {
    text-decoration: none;
    color: #818cf8;
  }

  .breadcrumb li + li::before {
    content: "\\203A";
    padding: 0 8px;
    color: #64748b;
  }

  .breadcrumb .current a {
    color: #94a3b8;
    text-decoration: none;
    pointer-events: none;
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: "nav[aria-label]",
      assertion: "exists",
      description: "<nav> has aria-label attribute"
    },
    {
      query: "ol.breadcrumb",
      assertion: "exists",
      description: "<ol> with class breadcrumb exists"
    },
    {
      query: ".breadcrumb",
      assertion: "equals",
      property: "display",
      value: "flex",
      description: ".breadcrumb uses display: flex"
    },
    {
      query: ".breadcrumb li",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 breadcrumb items"
    },
    {
      query: ".breadcrumb .current",
      assertion: "exists",
      description: "a breadcrumb item has .current class"
    },
    {
      query: ".breadcrumb",
      assertion: "sourceMatch",
      value: "::before",
      description: "uses ::before pseudo-element for separators"
    },
    {
      query: ".breadcrumb",
      assertion: "sourceMatch",
      value: "content",
      description: "CSS uses content property for separator"
    }
  ],
  hint: "The CSS selector `li + li::before` targets every list item that follows another, adding a separator before it. The `content` property inside the ::before pseudo-element inserts the visual separator.",
  resources: [
    {
      label: "MDN: ::before pseudo-element",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/::before",
      description: "Inserting content before an element"
    },
    {
      label: "MDN: Adjacent sibling combinator",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator",
      description: "The + combinator for targeting next siblings"
    },
    {
      label: "MDN: aria-current",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current",
      description: "Indicating the current item in a set"
    }
  ],
  hints: [
    "How can CSS generate visual separators between list items without adding extra HTML elements?",
    "Use `.breadcrumb li + li::before` with a `content` property to insert a separator (like `\\203A` for ›) before every item after the first. This targets adjacent siblings automatically.",
    "HTML: Key elements: `<nav>`, `<ol>`, `<li>`, `<a>`. Important attributes: `aria-label`, `aria-current`. CSS: Key properties: `display`, `list-style`, `content`, `padding`."
  ]
});

// =============================================================================
// TIER 4 CSS EXERCISES (3)
// =============================================================================

// 9. CSS Custom Properties Theme
newExercises.push({
  id: nextId++,
  title: "CSS Custom Properties Theme",
  type: "css",
  tier: 4,
  category: ["css", "layout"],
  tags: ["css", "custom-properties", "variables", "theming", "tier4"],
  description: "Use CSS custom properties to create a themeable button system with primary and secondary color variants.",
  instructions: `Create a theming system using CSS custom properties (variables) to style buttons.

**Requirements:**
1. Define custom properties on \`:root\`:
   - \`--primary\`: a primary color (e.g. \`#6366f1\`)
   - \`--primary-hover\`: a hover variant (e.g. \`#4f46e5\`)
   - \`--secondary\`: a secondary color (e.g. \`#10b981\`)
   - \`--secondary-hover\`: its hover variant (e.g. \`#059669\`)
   - \`--radius\`: a shared border-radius (e.g. \`6px\`)
2. Style \`.btn\` with shared base styles:
   - \`padding\` of \`10px 20px\`
   - \`border: none\`
   - \`border-radius\` using \`var(--radius)\`
   - \`color: white\`
   - \`cursor: pointer\`
3. \`.btn-primary\` uses \`background-color: var(--primary)\`
4. \`.btn-primary:hover\` uses \`var(--primary-hover)\`
5. \`.btn-secondary\` uses \`background-color: var(--secondary)\`
6. \`.btn-secondary:hover\` uses \`var(--secondary-hover)\`

The provided HTML has buttons with both classes. Changing the \`:root\` variables should update all buttons at once.`,
  starterCode: "/* Define your custom properties and button styles */\n",
  providedHtml: `<div class="btn-group" id="btn-group-el"><button class="btn btn-primary" id="btn-pri">Primary</button><button class="btn btn-secondary" id="btn-sec">Secondary</button><button class="btn btn-primary">Another Primary</button></div>`,
  solution: `:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --secondary: #10b981;
  --secondary-hover: #059669;
  --radius: 6px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: var(--primary);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--secondary);
}

.btn-secondary:hover {
  background-color: var(--secondary-hover);
}

.btn-group {
  display: flex;
  gap: 12px;
}`,
  testRunner: "",
  testCases: [
    {
      query: ":root",
      assertion: "sourceMatch",
      value: ":root",
      description: "defines custom properties on :root"
    },
    {
      query: ".btn",
      assertion: "sourceMatch",
      value: "var(--",
      description: "uses var() to reference custom properties"
    },
    {
      query: "#btn-pri",
      assertion: "equals",
      property: "padding",
      value: "10px 20px",
      description: ".btn has padding of 10px 20px"
    },
    {
      query: "#btn-pri",
      assertion: "equals",
      property: "border-radius",
      value: "6px",
      description: ".btn uses border-radius from --radius"
    },
    {
      query: ".btn",
      assertion: "sourceMatch",
      value: "--primary",
      description: "references --primary custom property"
    },
    {
      query: ".btn",
      assertion: "sourceMatch",
      value: "--secondary",
      description: "references --secondary custom property"
    }
  ],
  hint: "CSS custom properties are defined with --name: value in a selector (usually :root for global scope). Reference them with var(--name). Changing the value in one place updates every usage.",
  resources: [
    {
      label: "MDN: Using CSS custom properties",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
      description: "Creating and using CSS variables"
    },
    {
      label: "MDN: var() function",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/var",
      description: "Referencing custom property values"
    },
    {
      label: "MDN: :root pseudo-class",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:root",
      description: "The root element selector for global variables"
    }
  ],
  hints: [
    "Where should you define CSS variables so they are accessible throughout the entire document?",
    "Define all theme colors as custom properties in `:root` (e.g. `--primary: #6366f1`). Then reference them with `var(--primary)` in your button styles. This centralizes your color palette for easy theming.",
    "Key selectors: `:root`, `.btn`, `.btn-primary`, `.btn-secondary`, `:hover`. Key function: `var(--name)`. Key properties: `background-color`, `border-radius`, `padding`."
  ]
});

// 10. Animated Accordion (CSS transitions with max-height)
newExercises.push({
  id: nextId++,
  title: "Animated Expand/Collapse",
  type: "css",
  tier: 4,
  category: ["css", "transitions"],
  tags: ["css", "transitions", "animation", "max-height", "accordion", "tier4"],
  description: "Style accordion panels that expand and collapse with smooth CSS transitions using the max-height technique.",
  instructions: `Style accordion panels that transition open and closed smoothly.

**Provided HTML** uses checkboxes to toggle panels (CSS-only, no JS).

**Requirements:**
1. \`.accordion-item\` has a visible \`border\` and \`margin-bottom\`
2. \`.accordion-header\` (the label) has \`padding\`, \`cursor: pointer\`, and a \`background-color\` (e.g. \`#1e293b\`)
3. \`.accordion-body\` (the content panel):
   - Default state: \`max-height: 0\`, \`overflow: hidden\`
   - Must have a \`transition\` on max-height (e.g. \`transition: max-height 0.3s ease\`)
4. When the hidden checkbox is checked, expand the panel:
   - Use the selector \`.accordion-toggle:checked + .accordion-header + .accordion-body\`
   - Set \`max-height\` to a large value (e.g. \`200px\`)
5. Hide the actual checkbox: \`.accordion-toggle\` should have \`display: none\`
6. \`.accordion-body\` content should have \`padding\` (e.g. \`16px\`)

The \`max-height\` transition trick creates smooth expand/collapse animations.`,
  starterCode: "/* Style the animated accordion */\n",
  providedHtml: `<div class="accordion" id="accordion-el"><div class="accordion-item"><input type="checkbox" class="accordion-toggle" id="acc1"><label class="accordion-header" for="acc1">Section One</label><div class="accordion-body"><p>Content for section one. This panel expands smoothly.</p></div></div><div class="accordion-item"><input type="checkbox" class="accordion-toggle" id="acc2"><label class="accordion-header" for="acc2">Section Two</label><div class="accordion-body"><p>Content for section two with more text to demonstrate the expand.</p></div></div><div class="accordion-item"><input type="checkbox" class="accordion-toggle" id="acc3"><label class="accordion-header" for="acc3">Section Three</label><div class="accordion-body"><p>Content for the third section.</p></div></div></div>`,
  solution: `.accordion-toggle {
  display: none;
}

.accordion-item {
  border: 1px solid #334155;
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;
}

.accordion-header {
  display: block;
  padding: 14px 16px;
  cursor: pointer;
  background-color: #1e293b;
  font-weight: 600;
  user-select: none;
}

.accordion-header:hover {
  background-color: #334155;
}

.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-body p {
  padding: 16px;
  margin: 0;
}

.accordion-toggle:checked + .accordion-header + .accordion-body {
  max-height: 200px;
}`,
  testRunner: "",
  testCases: [
    {
      query: ".accordion-item",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 accordion items"
    },
    {
      query: ".accordion-body",
      assertion: "equals",
      property: "overflow",
      value: "hidden",
      description: ".accordion-body has overflow: hidden"
    },
    {
      query: ".accordion-body",
      assertion: "equals",
      property: "max-height",
      value: "0px",
      description: ".accordion-body default max-height is 0"
    },
    {
      query: ".accordion",
      assertion: "sourceMatch",
      value: "transition",
      description: "uses CSS transition property"
    },
    {
      query: ".accordion",
      assertion: "sourceMatch",
      value: ":checked",
      description: "uses :checked pseudo-class for toggle"
    },
    {
      query: ".accordion-header",
      assertion: "equals",
      property: "cursor",
      value: "pointer",
      description: ".accordion-header has cursor: pointer"
    }
  ],
  hint: "The max-height transition trick: set max-height: 0 and overflow: hidden to collapse. When :checked, set max-height to a large value. The transition animates between 0 and the max-height value smoothly.",
  resources: [
    {
      label: "MDN: CSS transitions",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions",
      description: "Animating property changes over time"
    },
    {
      label: "MDN: :checked pseudo-class",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:checked",
      description: "Styling based on checkbox/radio state"
    },
    {
      label: "MDN: max-height",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height",
      description: "Constraining an element's maximum height"
    }
  ],
  hints: [
    "How can you animate an element's height from 0 to open using CSS only, and what role does the :checked pseudo-class play?",
    "The trick: set `max-height: 0` and `overflow: hidden` to collapse a panel. Add `transition: max-height 0.3s ease`. When the hidden checkbox is `:checked`, use the adjacent sibling selector to set `max-height: 200px` — the transition animates the change.",
    "Key selectors: `.accordion-toggle:checked + .accordion-header + .accordion-body`. Key properties: `max-height`, `overflow`, `transition`, `display: none` (for the checkbox)."
  ]
});

// 11. Sticky Header with Shadow
newExercises.push({
  id: nextId++,
  title: "Sticky Header with Shadow",
  type: "css",
  tier: 4,
  category: ["css", "positioning"],
  tags: ["css", "sticky", "positioning", "box-shadow", "layout", "tier4"],
  description: "Style a page header that sticks to the top of the viewport using position: sticky, with a visible shadow for depth.",
  instructions: `Style a header that sticks to the top of the page as the user scrolls.

**Requirements:**
1. \`.sticky-header\`:
   - \`position: sticky\`
   - \`top: 0\` (sticks at the very top)
   - \`z-index: 100\` (stays above other content)
   - \`background-color\` of \`#0f172a\` (solid background so content doesn't show through)
   - A \`box-shadow\` for depth (e.g. \`0 2px 8px rgba(0, 0, 0, 0.3)\`)
   - \`padding\` of \`16px 24px\`
2. \`.sticky-header\` should use \`display: flex\` with \`justify-content: space-between\` and \`align-items: center\`
3. \`.content-section\` should have \`padding\` of \`24px\` to provide scrollable content

The shadow creates a visual separation between the fixed header and scrolling content below.`,
  starterCode: "/* Style the sticky header */\n",
  providedHtml: `<header class="sticky-header" id="sticky-header-el"><div class="logo">MySite</div><nav><a href="#">Home</a> <a href="#">About</a> <a href="#">Contact</a></nav></header><div class="content-section" id="content-el"><p>Scroll down to see the sticky header in action.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p><p>More content here to enable scrolling.</p><p>Keep scrolling...</p><p>The header should remain visible at the top.</p><p>Even more content to make the page scroll.</p><p>Almost there...</p><p>Final content section.</p></div>`,
  solution: `.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sticky-header a {
  color: #e2e8f0;
  text-decoration: none;
  margin-left: 16px;
}

.content-section {
  padding: 24px;
}`,
  testRunner: "",
  testCases: [
    {
      query: "#sticky-header-el",
      assertion: "equals",
      property: "position",
      value: "sticky",
      description: ".sticky-header uses position: sticky"
    },
    {
      query: "#sticky-header-el",
      assertion: "equals",
      property: "z-index",
      value: "100",
      description: ".sticky-header has z-index: 100"
    },
    {
      query: "#sticky-header-el",
      assertion: "equals",
      property: "display",
      value: "flex",
      description: ".sticky-header uses display: flex"
    },
    {
      query: ".sticky-header",
      assertion: "sourceMatch",
      value: "box-shadow",
      description: "uses box-shadow for depth"
    },
    {
      query: "#sticky-header-el",
      assertion: "equals",
      property: "background-color",
      value: "rgb(15, 23, 42)",
      description: ".sticky-header has solid background-color"
    },
    {
      query: "#content-el",
      assertion: "equals",
      property: "padding",
      value: "24px",
      description: ".content-section has padding of 24px"
    }
  ],
  hint: "position: sticky makes an element scroll with its container until it reaches the offset (top: 0), then it sticks. A solid background and z-index ensure it covers scrolling content. box-shadow adds visual depth.",
  resources: [
    {
      label: "MDN: position: sticky",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
      description: "How sticky positioning works"
    },
    {
      label: "MDN: box-shadow",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow",
      description: "Adding shadow effects to elements"
    },
    {
      label: "MDN: z-index",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/z-index",
      description: "Controlling stacking order of elements"
    }
  ],
  hints: [
    "What CSS position value makes an element scroll normally until a threshold, then stick in place?",
    "`position: sticky` with `top: 0` pins the header at the top once the user scrolls past it. Add `z-index` so it layers above content, a solid `background-color` so text doesn't bleed through, and `box-shadow` for visual separation.",
    "Key properties: `position`, `top`, `z-index`, `background-color`, `box-shadow`, `display`, `justify-content`, `align-items`."
  ]
});

// =============================================================================
// TIER 4 HTML-CSS COMBINED (2)
// =============================================================================

// 12. Login Form with Floating Labels
newExercises.push({
  id: nextId++,
  title: "Login Form with Floating Labels",
  type: "html-css",
  tier: 4,
  category: ["html", "forms"],
  tags: ["html", "css", "forms", "floating-labels", "transitions", "tier4"],
  description: "Build and style a login form where labels float above inputs when focused or filled, using CSS positioning and transitions.",
  instructions: `Build a login form with floating label animations.

**Required HTML:**
- A \`<form>\` with class \`login-form\`
- Two \`.form-group\` containers, each with:
  - An \`<input>\` (one \`type="email"\`, one \`type="password"\`) with \`id\`, \`required\`, and \`placeholder=" "\` (a space placeholder — this is the CSS trick)
  - A \`<label>\` with \`for\` attribute matching the input id
- A \`<button>\` with class \`submit-btn\` and text "Sign In"

**Required CSS:**
1. \`.form-group\` uses \`position: relative\` (so labels can be positioned absolutely)
2. \`label\` is positioned over the input using \`position: absolute\` with a starting \`top\` value (e.g. \`14px\`)
3. \`label\` has a \`transition\` on top and font-size
4. When the input is focused or has content, the label moves up:
   - Use \`.form-group input:focus + label\` and \`.form-group input:not(:placeholder-shown) + label\`
   - Move label up (e.g. \`top: -8px\`) and reduce \`font-size\`
5. Inputs should have visible \`border-bottom\` and no outline on focus (replace with border color change)
6. \`.submit-btn\` has \`padding\`, a \`background-color\`, and full width (\`width: 100%\`)

The \`placeholder=" "\` trick enables \`:not(:placeholder-shown)\` to detect when the input has content.`,
  starterCode: "<!-- Build your floating label form -->\n\n/* Style with floating label transitions */\n",
  solution: `<form class="login-form">
  <div class="form-group">
    <input type="email" id="email" required placeholder=" ">
    <label for="email">Email</label>
  </div>
  <div class="form-group">
    <input type="password" id="password" required placeholder=" ">
    <label for="password">Password</label>
  </div>
  <button type="submit" class="submit-btn">Sign In</button>
</form>

<style>
  .login-form {
    max-width: 360px;
    padding: 32px;
  }

  .form-group {
    position: relative;
    margin-bottom: 24px;
  }

  .form-group input {
    width: 100%;
    padding: 14px 0 8px;
    border: none;
    border-bottom: 2px solid #334155;
    background: transparent;
    color: #e2e8f0;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
  }

  .form-group input:focus {
    border-bottom-color: #6366f1;
  }

  .form-group label {
    position: absolute;
    top: 14px;
    left: 0;
    font-size: 16px;
    color: #64748b;
    pointer-events: none;
    transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  }

  .form-group input:focus + label,
  .form-group input:not(:placeholder-shown) + label {
    top: -8px;
    font-size: 12px;
    color: #6366f1;
  }

  .submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: ".login-form",
      assertion: "exists",
      description: ".login-form exists"
    },
    {
      query: ".form-group",
      assertion: "countAtLeast",
      value: 2,
      description: "at least 2 .form-group elements"
    },
    {
      query: ".form-group",
      assertion: "equals",
      property: "position",
      value: "relative",
      description: ".form-group uses position: relative"
    },
    {
      query: ".form-group label",
      assertion: "equals",
      property: "position",
      value: "absolute",
      description: "label uses position: absolute"
    },
    {
      query: ".login-form",
      assertion: "sourceMatch",
      value: "transition",
      description: "uses CSS transition for floating effect"
    },
    {
      query: ".login-form",
      assertion: "sourceMatch",
      value: ":focus",
      description: "styles the :focus state"
    },
    {
      query: ".login-form",
      assertion: "sourceMatch",
      value: ":placeholder-shown",
      description: "uses :placeholder-shown or :not(:placeholder-shown)"
    },
    {
      query: ".submit-btn",
      assertion: "exists",
      description: ".submit-btn button exists"
    },
    {
      query: "label[for='email']",
      assertion: "exists",
      description: "label for email exists"
    },
    {
      query: "label[for='password']",
      assertion: "exists",
      description: "label for password exists"
    }
  ],
  hint: "The floating label pattern: position labels absolutely over the input. Use placeholder=\" \" so :not(:placeholder-shown) detects content. On :focus or :not(:placeholder-shown), transition the label's top position upward and shrink its font-size.",
  resources: [
    {
      label: "MDN: :placeholder-shown",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown",
      description: "Detecting when an input shows its placeholder"
    },
    {
      label: "MDN: CSS transitions",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions",
      description: "Smooth property changes over time"
    },
    {
      label: "MDN: position",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
      description: "Controlling element positioning"
    }
  ],
  hints: [
    "How can you detect whether an input has content using pure CSS, and how does that help animate a label?",
    "The trick: give inputs `placeholder=\" \"` (a space). Then `:not(:placeholder-shown)` is true when the user has typed something. Combine with `:focus` to move the absolutely-positioned label upward with a `transition`.",
    "HTML: `<input>` with `placeholder=\" \"`, `<label>` after input (for `+` selector). CSS: `.form-group input:focus + label`, `.form-group input:not(:placeholder-shown) + label` to move label up."
  ]
});

// 13. Responsive Image Gallery
newExercises.push({
  id: nextId++,
  title: "Responsive Image Gallery",
  type: "html-css",
  tier: 4,
  category: ["css", "layout"],
  tags: ["html", "css", "grid", "responsive", "images", "gallery", "tier4"],
  description: "Build and style an image gallery grid that adapts from 1 column on mobile to 3 columns on desktop using CSS Grid and media queries.",
  instructions: `Build a responsive image gallery that adapts to different screen sizes.

**Required HTML:**
- A \`.gallery\` container
- At least 6 \`.gallery-item\` elements, each containing:
  - A \`<div>\` with class \`gallery-img\` (as image placeholder with a background color)
  - A \`<p>\` with class \`gallery-caption\`

**Required CSS:**
1. \`.gallery\` uses \`display: grid\`
2. Mobile (default): \`grid-template-columns: 1fr\` (single column)
3. Tablet (\`@media (min-width: 600px)\`): \`grid-template-columns: repeat(2, 1fr)\`
4. Desktop (\`@media (min-width: 900px)\`): \`grid-template-columns: repeat(3, 1fr)\`
5. \`.gallery\` has a \`gap\` of \`16px\`
6. \`.gallery-img\` should have \`aspect-ratio: 4/3\` (or a fixed height) and a \`background-color\`
7. \`.gallery-item\` has \`border-radius\` and \`overflow: hidden\`

The gallery should smoothly adapt from 1 column to 2 to 3 as the viewport widens.`,
  starterCode: "<!-- Build your responsive gallery -->\n\n/* Style with responsive grid */\n",
  solution: `<div class="gallery">
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">Mountain Vista</p>
  </div>
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">Ocean Sunset</p>
  </div>
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">Forest Path</p>
  </div>
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">City Lights</p>
  </div>
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">Desert Dunes</p>
  </div>
  <div class="gallery-item">
    <div class="gallery-img"></div>
    <p class="gallery-caption">Snowy Peaks</p>
  </div>
</div>

<style>
  .gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .gallery-item {
    border-radius: 8px;
    overflow: hidden;
    background: #1e293b;
  }

  .gallery-img {
    aspect-ratio: 4/3;
    background-color: #334155;
    background: linear-gradient(135deg, #334155, #1e293b);
  }

  .gallery-caption {
    padding: 12px;
    margin: 0;
    font-size: 14px;
    color: #e2e8f0;
  }

  @media (min-width: 600px) {
    .gallery {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 900px) {
    .gallery {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: ".gallery",
      assertion: "exists",
      description: ".gallery container exists"
    },
    {
      query: ".gallery",
      assertion: "equals",
      property: "display",
      value: "grid",
      description: ".gallery uses display: grid"
    },
    {
      query: ".gallery-item",
      assertion: "countAtLeast",
      value: 6,
      description: "at least 6 gallery items"
    },
    {
      query: ".gallery-img",
      assertion: "countAtLeast",
      value: 6,
      description: "each item has a .gallery-img"
    },
    {
      query: ".gallery-caption",
      assertion: "countAtLeast",
      value: 6,
      description: "each item has a .gallery-caption"
    },
    {
      query: ".gallery",
      assertion: "sourceMatch",
      value: "@media",
      description: "uses @media queries for responsiveness"
    },
    {
      query: ".gallery",
      assertion: "sourceMatch",
      value: "grid-template-columns",
      description: "uses grid-template-columns"
    },
    {
      query: ".gallery-item",
      assertion: "equals",
      property: "overflow",
      value: "hidden",
      description: ".gallery-item has overflow: hidden"
    }
  ],
  hint: "Start with a single-column grid (mobile-first). Add @media breakpoints at 600px and 900px to switch to 2 and 3 columns. aspect-ratio on the image placeholder keeps consistent proportions.",
  resources: [
    {
      label: "MDN: CSS Grid Layout",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      description: "Complete guide to CSS Grid"
    },
    {
      label: "MDN: aspect-ratio",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
      description: "Setting preferred aspect ratios for elements"
    },
    {
      label: "MDN: Media queries",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries",
      description: "Responsive design breakpoints"
    }
  ],
  hints: [
    "How does the mobile-first approach work with media queries — should you start with the largest or smallest layout?",
    "Mobile-first: start with `grid-template-columns: 1fr` (single column). Add `@media (min-width: 600px)` for 2 columns and `@media (min-width: 900px)` for 3 columns. Use `aspect-ratio` on image placeholders for consistent sizing.",
    "HTML: `.gallery-item` > `.gallery-img` + `.gallery-caption`. CSS: `display: grid`, `grid-template-columns`, `@media`, `aspect-ratio`, `overflow: hidden`, `border-radius`."
  ]
});

// =============================================================================
// TIER 5 HTML-CSS COMBINED (2)
// =============================================================================

// 14. CSS-Only Tabs
newExercises.push({
  id: nextId++,
  title: "CSS-Only Tabs",
  type: "html-css",
  tier: 5,
  category: ["css", "layout"],
  tags: ["html", "css", "tabs", "radio-inputs", "no-js", "tier5"],
  description: "Build a fully functional tabbed interface using only HTML radio inputs and CSS — no JavaScript required.",
  instructions: `Build a tabbed interface using radio inputs and CSS.

**Required HTML:**
- A \`.tabs-container\` wrapper
- At least 3 tabs, each consisting of:
  - A hidden \`<input type="radio">\` with \`name="tabs"\` (shared name groups them), a unique \`id\`, and class \`tab-radio\`. The first should have \`checked\`
  - A \`<label>\` with class \`tab-label\` and \`for\` matching the radio's id
- A \`.tab-panels\` container with at least 3 \`.tab-panel\` elements (one per tab)

**Required CSS:**
1. Hide the radio inputs: \`.tab-radio { display: none; }\`
2. \`.tab-label\` styled as clickable tabs: \`cursor: pointer\`, \`padding\`, visible bottom border
3. The active tab label must be highlighted. Use the selector:
   \`.tab-radio:checked + .tab-label\` to apply a different \`border-bottom-color\` or \`color\`
4. All \`.tab-panel\` elements default to \`display: none\`
5. Show the correct panel when its radio is checked. Use selectors like:
   \`#tab1:checked ~ .tab-panels .tab-panel:nth-child(1)\` with \`display: block\`
   (Repeat for each tab)
6. Tab labels should be arranged in a row (use flex on their container)

The key concept: radio inputs + \`~\` general sibling combinator control which panel is visible.`,
  starterCode: "<!-- Build your CSS-only tabs -->\n\n/* Style with radio-based tab switching */\n",
  solution: `<div class="tabs-container">
  <input type="radio" name="tabs" id="tab1" class="tab-radio" checked>
  <label for="tab1" class="tab-label">Overview</label>

  <input type="radio" name="tabs" id="tab2" class="tab-radio">
  <label for="tab2" class="tab-label">Features</label>

  <input type="radio" name="tabs" id="tab3" class="tab-radio">
  <label for="tab3" class="tab-label">Pricing</label>

  <div class="tab-panels">
    <div class="tab-panel">
      <h3>Overview</h3>
      <p>Welcome to our product overview. Here you will find everything you need to get started.</p>
    </div>
    <div class="tab-panel">
      <h3>Features</h3>
      <p>Our product includes powerful features for teams of all sizes.</p>
    </div>
    <div class="tab-panel">
      <h3>Pricing</h3>
      <p>Choose a plan that fits your needs. All plans include a 14-day free trial.</p>
    </div>
  </div>
</div>

<style>
  .tabs-container {
    max-width: 600px;
  }

  .tab-radio {
    display: none;
  }

  .tab-label {
    display: inline-block;
    padding: 12px 24px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: #94a3b8;
    font-weight: 600;
    transition: color 0.2s, border-color 0.2s;
  }

  .tab-label:hover {
    color: #e2e8f0;
  }

  .tab-radio:checked + .tab-label {
    color: #818cf8;
    border-bottom-color: #818cf8;
  }

  .tab-panels {
    border-top: 1px solid #334155;
    padding: 24px 0;
  }

  .tab-panel {
    display: none;
  }

  #tab1:checked ~ .tab-panels .tab-panel:nth-child(1) {
    display: block;
  }

  #tab2:checked ~ .tab-panels .tab-panel:nth-child(2) {
    display: block;
  }

  #tab3:checked ~ .tab-panels .tab-panel:nth-child(3) {
    display: block;
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: ".tabs-container",
      assertion: "exists",
      description: ".tabs-container exists"
    },
    {
      query: ".tab-radio",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 radio inputs for tabs"
    },
    {
      query: ".tab-label",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 tab labels"
    },
    {
      query: ".tab-panel",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 tab panels"
    },
    {
      query: "input[type='radio'][name='tabs']",
      assertion: "countAtLeast",
      value: 3,
      description: "radio inputs share name=\"tabs\""
    },
    {
      query: ".tabs-container",
      assertion: "sourceMatch",
      value: ":checked",
      description: "uses :checked pseudo-class for tab switching"
    },
    {
      query: ".tabs-container",
      assertion: "sourceMatch",
      value: "display:\\s*none",
      description: "hides inactive panels with display: none"
    },
    {
      query: ".tab-label",
      assertion: "equals",
      property: "cursor",
      value: "pointer",
      description: ".tab-label has cursor: pointer"
    },
    {
      query: ".tabs-container",
      assertion: "sourceMatch",
      value: "~",
      description: "uses ~ general sibling combinator"
    }
  ],
  hint: "Radio inputs with the same name attribute form a group — only one can be checked at a time. The :checked pseudo-class + the ~ general sibling combinator lets you show/hide panels based on which radio is selected.",
  resources: [
    {
      label: "MDN: General sibling combinator (~)",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator",
      description: "Selecting siblings further in the DOM"
    },
    {
      label: "MDN: :checked pseudo-class",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:checked",
      description: "Styling based on input checked state"
    },
    {
      label: "MDN: <input type=\"radio\">",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio",
      description: "Radio button grouping and behavior"
    }
  ],
  hints: [
    "How can radio inputs — which only allow one selection at a time — be used to control which content panel is visible?",
    "Radio inputs with `name=\"tabs\"` form a group where only one is checked at a time. Hide them with `display: none`. Use `:checked + .tab-label` to highlight the active tab, and `#tab1:checked ~ .tab-panels .tab-panel:nth-child(1)` to show the matching panel.",
    "HTML: radio inputs (same `name`), labels (with `for`), tab panels. CSS: `.tab-radio:checked + .tab-label` for active tab style, `#tabN:checked ~ .tab-panels .tab-panel:nth-child(N)` for showing panels."
  ]
});

// 15. Responsive Dashboard Layout (Tier 5)
newExercises.push({
  id: nextId++,
  title: "Full Dashboard with Sidebar and Grid",
  type: "html-css",
  tier: 5,
  category: ["css", "layout"],
  tags: ["html", "css", "grid", "flexbox", "responsive", "dashboard", "composition", "tier5"],
  description: "Build a complete dashboard layout with a collapsible sidebar nav, sticky header, main content grid area, and footer — all responsive from mobile to desktop.",
  instructions: `Build a complete, responsive dashboard layout from scratch.

**Required HTML structure:**
- A \`.dashboard\` wrapper
- A \`.dash-sidebar\` containing:
  - A \`.sidebar-brand\` element with text
  - A \`<nav>\` with at least 4 \`<a>\` links, one with class \`active\`
- A \`.dash-header\` with an \`<h1>\` title and a \`.user-info\` element
- A \`.dash-main\` area containing:
  - At least 3 \`.stat-card\` elements (e.g. metrics display)
  - A \`.content-area\` element for primary content
- A \`.dash-footer\` with footer text

**Required CSS:**
1. \`.dashboard\` uses CSS Grid with \`grid-template-areas\`:
   - Mobile (default): single column, all areas stacked vertically
   - Desktop (\`min-width: 768px\`): sidebar on left column, header/main/footer on right
2. \`.dash-sidebar\` uses Flexbox with \`flex-direction: column\`
3. \`.dash-header\` uses \`position: sticky\` with \`top: 0\`
4. \`.stat-card\` elements use a sub-grid or flex layout to display in a row
5. Use at least 2 CSS custom properties (e.g. \`--sidebar-width\`, \`--accent\`)
6. The \`.active\` nav link should be visually distinct (background or border)
7. All sections have visible borders or backgrounds for visual distinction

This exercise combines Grid, Flexbox, sticky positioning, custom properties, and media queries.`,
  starterCode: "<!-- Build your full dashboard layout -->\n\n/* Style your responsive dashboard */\n",
  solution: `<div class="dashboard">
  <aside class="dash-sidebar">
    <div class="sidebar-brand">Dashboard</div>
    <nav>
      <a href="#" class="active">Overview</a>
      <a href="#">Analytics</a>
      <a href="#">Reports</a>
      <a href="#">Settings</a>
    </nav>
  </aside>

  <header class="dash-header">
    <h1>Overview</h1>
    <div class="user-info">Welcome, Alex</div>
  </header>

  <main class="dash-main">
    <div class="stat-cards">
      <div class="stat-card">
        <h3>Revenue</h3>
        <p>$12,480</p>
      </div>
      <div class="stat-card">
        <h3>Users</h3>
        <p>1,284</p>
      </div>
      <div class="stat-card">
        <h3>Orders</h3>
        <p>342</p>
      </div>
    </div>
    <div class="content-area">
      <h2>Recent Activity</h2>
      <p>Dashboard main content area with reports and data visualizations.</p>
    </div>
  </main>

  <footer class="dash-footer">
    <p>Dashboard v1.0 — Built with CSS Grid</p>
  </footer>
</div>

<style>
  :root {
    --sidebar-width: 220px;
    --accent: #6366f1;
    --bg-dark: #0f172a;
    --bg-panel: #1e293b;
    --border: #334155;
    --text: #e2e8f0;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dashboard {
    display: grid;
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "footer";
    grid-template-rows: auto auto 1fr auto;
    min-height: 100vh;
    background: var(--bg-dark);
    color: var(--text);
  }

  .dash-sidebar {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    background: var(--bg-panel);
    padding: 16px;
    gap: 8px;
  }

  .sidebar-brand {
    font-size: 1.25rem;
    font-weight: bold;
    padding: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .dash-sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dash-sidebar nav a {
    color: var(--text);
    text-decoration: none;
    padding: 10px 12px;
    border-radius: 6px;
  }

  .dash-sidebar nav a.active {
    background: var(--accent);
    color: white;
  }

  .dash-header {
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--bg-panel);
    border-bottom: 1px solid var(--border);
  }

  .dash-main {
    grid-area: main;
    padding: 24px;
  }

  .stat-cards {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .stat-card {
    flex: 1 1 150px;
    background: var(--bg-panel);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .stat-card h3 {
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  .stat-card p {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .content-area {
    background: var(--bg-panel);
    padding: 24px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .dash-footer {
    grid-area: footer;
    padding: 16px 24px;
    text-align: center;
    border-top: 1px solid var(--border);
    font-size: 0.875rem;
    color: #64748b;
  }

  @media (min-width: 768px) {
    .dashboard {
      grid-template-columns: var(--sidebar-width) 1fr;
      grid-template-areas:
        "sidebar header"
        "sidebar main"
        "sidebar footer";
    }
  }
</style>`,
  testRunner: "",
  testCases: [
    {
      query: ".dashboard",
      assertion: "exists",
      description: ".dashboard wrapper exists"
    },
    {
      query: ".dashboard",
      assertion: "equals",
      property: "display",
      value: "grid",
      description: ".dashboard uses CSS Grid"
    },
    {
      query: ".dash-sidebar",
      assertion: "exists",
      description: ".dash-sidebar exists"
    },
    {
      query: ".dash-sidebar",
      assertion: "equals",
      property: "flex-direction",
      value: "column",
      description: ".dash-sidebar uses flex-direction: column"
    },
    {
      query: ".dash-sidebar nav a",
      assertion: "countAtLeast",
      value: 4,
      description: "sidebar has at least 4 nav links"
    },
    {
      query: ".dash-sidebar nav a.active",
      assertion: "exists",
      description: "one nav link has .active class"
    },
    {
      query: ".dash-header",
      assertion: "exists",
      description: ".dash-header exists"
    },
    {
      query: ".dash-header h1",
      assertion: "exists",
      description: ".dash-header contains an h1"
    },
    {
      query: ".stat-card",
      assertion: "countAtLeast",
      value: 3,
      description: "at least 3 stat cards"
    },
    {
      query: ".content-area",
      assertion: "exists",
      description: ".content-area exists"
    },
    {
      query: ".dash-footer",
      assertion: "exists",
      description: ".dash-footer exists"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "grid-template-areas",
      description: "uses grid-template-areas"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "@media",
      description: "uses @media query for responsive layout"
    },
    {
      query: ".dashboard",
      assertion: "sourceMatch",
      value: "--",
      description: "uses CSS custom properties"
    }
  ],
  hint: "This is a composition exercise. Plan the grid areas first: mobile stacks everything vertically, desktop puts sidebar on the left. Use Flexbox inside the sidebar for vertical nav, sticky positioning for the header, and a sub-flex layout for stat cards.",
  resources: [
    {
      label: "MDN: CSS Grid Layout",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
      description: "CSS Grid for page-level layouts"
    },
    {
      label: "MDN: position: sticky",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
      description: "Sticky positioning for headers"
    },
    {
      label: "MDN: Custom properties",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
      description: "CSS variables for theming and reuse"
    }
  ],
  hints: [
    "How do you combine CSS Grid for the page layout, Flexbox for component internals, and media queries for responsiveness?",
    "Use `grid-template-areas` for the page layout: mobile stacks vertically, desktop splits sidebar left. Sidebar uses `flex-direction: column` for vertical nav. Header uses `position: sticky`. Stat cards use `display: flex` with `flex-wrap`. Custom properties centralize values like `--sidebar-width`.",
    "HTML: `.dashboard` > `.dash-sidebar`, `.dash-header`, `.dash-main`, `.dash-footer`. CSS: Grid areas, Flexbox, sticky, custom properties, media queries. Key selectors: `.active`, `@media (min-width: 768px)`."
  ]
});

// =============================================================================
// Merge into exercises.json
// =============================================================================

// Validate all exercises
let valid = true;
newExercises.forEach((ex, i) => {
  const errors = [];
  if (!ex.id) errors.push("missing id");
  if (!ex.title) errors.push("missing title");
  if (!ex.type) errors.push("missing type");
  if (!ex.tier) errors.push("missing tier");
  if (!ex.category || !Array.isArray(ex.category)) errors.push("missing/invalid category");
  if (!ex.testCases || !Array.isArray(ex.testCases)) errors.push("missing testCases");
  if (ex.testCases && ex.testCases.length < 4) errors.push(`only ${ex.testCases.length} testCases (need 4+)`);
  if (ex.testRunner !== "") errors.push("testRunner should be empty string");
  if (!ex.hints || !Array.isArray(ex.hints) || ex.hints.length < 2) errors.push("need 2+ hints");
  if (!ex.resources || !Array.isArray(ex.resources)) errors.push("missing resources");
  if (ex.type === 'css' && !ex.providedHtml) errors.push("CSS exercise missing providedHtml");
  if (!ex.instructions) errors.push("missing instructions");
  if (!ex.solution) errors.push("missing solution");

  if (errors.length > 0) {
    console.error(`Exercise ${i + 1} (id ${ex.id}, "${ex.title}"): ${errors.join(", ")}`);
    valid = false;
  }
});

if (!valid) {
  console.error("\nValidation failed. Aborting.");
  process.exit(1);
}

// Check for duplicate IDs
const existingIds = new Set(data.exercises.map(e => e.id));
const newIds = newExercises.map(e => e.id);
const duplicates = newIds.filter(id => existingIds.has(id));
if (duplicates.length > 0) {
  console.error(`Duplicate IDs found: ${duplicates.join(", ")}`);
  process.exit(1);
}

// Check for duplicate titles
const existingTitles = new Set(data.exercises.map(e => e.title.toLowerCase()));
const dupTitles = newExercises.filter(e => existingTitles.has(e.title.toLowerCase()));
if (dupTitles.length > 0) {
  console.error(`Duplicate titles found: ${dupTitles.map(e => e.title).join(", ")}`);
  process.exit(1);
}

// Add to exercises
data.exercises.push(...newExercises);

// Write back
fs.writeFileSync(exercisesPath, JSON.stringify(data, null, 2) + '\n');

console.log(`\nSuccessfully added ${newExercises.length} exercises.`);
console.log(`New ID range: ${newExercises[0].id} - ${newExercises[newExercises.length - 1].id}`);
console.log(`New total exercises: ${data.exercises.length}`);

// Summary
console.log("\nExercise summary:");
newExercises.forEach(ex => {
  console.log(`  ID ${ex.id}: [Tier ${ex.tier}] [${ex.type}] "${ex.title}" — ${ex.testCases.length} test cases`);
});

// Breakdown by tier
const byTier = {};
newExercises.forEach(ex => {
  byTier[ex.tier] = (byTier[ex.tier] || 0) + 1;
});
console.log("\nBy tier:", byTier);

// Breakdown by type
const byType = {};
newExercises.forEach(ex => {
  byType[ex.type] = (byType[ex.type] || 0) + 1;
});
console.log("By type:", byType);
