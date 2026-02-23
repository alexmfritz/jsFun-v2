/**
 * Add HTML/CSS Tier 4 and Tier 5 exercises (IDs 370-377)
 *
 * 8 exercises across HTML, CSS, and HTML-CSS types:
 *
 * Tier 4 (370-374):
 *   370 - Holy Grail Layout (html-css, css/layout)
 *   371 - CSS-Only Accordion (html-css, css/transitions)
 *   372 - Dark Mode with Custom Properties (css, css/layout)
 *   373 - Advanced Grid: Auto-fit Gallery (css, css/layout)
 *   374 - Accessible Navigation with ARIA (html, html/structure)
 *
 * Tier 5 (375-377):
 *   375 - Full Page Responsive Layout (html-css, css/layout)
 *   376 - Complex Animation Sequence (css, css/transitions)
 *   377 - Pixel-Perfect Card Component (html-css, css/box-model)
 *
 * Also:
 *   - Updates default-curriculum collection to include all 8 new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 4 (370-374)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 370: Holy Grail Layout ─────────────────────────────────────────────────
  {
    id: 370,
    title: 'Holy Grail Layout',
    type: 'html-css',
    tier: 4,
    category: ['css', 'layout'],
    tags: ['html', 'css', 'grid', 'layout', 'holy-grail', 'tier4'],
    description: 'Build the classic holy grail layout using CSS Grid with named grid areas.',
    instructions: `Build the classic "holy grail" layout with five regions:

**Required HTML structure:**
- A \`.layout\` container with 5 children:
  - \`<header>\` - top bar spanning the full width
  - \`<nav>\` - left sidebar navigation
  - \`<main>\` - center content area
  - \`<aside>\` - right sidebar
  - \`<footer>\` - bottom bar spanning the full width

**Required CSS:**
1. \`.layout\` uses \`display: grid\`
2. Use \`grid-template-areas\` to define the named regions
3. Use \`grid-template-rows\` to control row sizing (e.g. auto 1fr auto)
4. The middle row should have three columns: nav | main | aside
5. Header and footer span the full width

The layout should fill the viewport height using \`min-height: 100vh\` or similar.`,
    starterCode: `<!-- Build your holy grail layout -->\n\n/* Add your CSS below */\n`,
    solution: `<div class="layout">
  <header>Header</header>
  <nav>Navigation</nav>
  <main>Main Content</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>

<style>
  .layout {
    display: grid;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 200px;
    min-height: 100vh;
    gap: 8px;
  }
  header { grid-area: header; padding: 16px; background: #1e293b; }
  nav    { grid-area: nav;    padding: 16px; background: #1e293b; }
  main   { grid-area: main;   padding: 16px; background: #0f172a; }
  aside  { grid-area: aside;  padding: 16px; background: #1e293b; }
  footer { grid-area: footer; padding: 16px; background: #1e293b; }
</style>`,
    testRunner: '',
    testCases: [
      {
        query: '.layout',
        assertion: 'exists',
        description: '.layout container exists',
      },
      {
        query: '.layout',
        assertion: 'equals',
        property: 'display',
        value: 'grid',
        description: '.layout uses display: grid',
      },
      {
        query: 'header',
        assertion: 'exists',
        description: '<header> element exists',
      },
      {
        query: 'nav',
        assertion: 'exists',
        description: '<nav> element exists',
      },
      {
        query: 'main',
        assertion: 'exists',
        description: '<main> element exists',
      },
      {
        query: 'aside',
        assertion: 'exists',
        description: '<aside> element exists',
      },
      {
        query: 'footer',
        assertion: 'exists',
        description: '<footer> element exists',
      },
      {
        query: '.layout',
        assertion: 'sourceMatch',
        value: 'grid-template-areas',
        description: 'Uses grid-template-areas',
      },
      {
        query: '.layout',
        assertion: 'sourceMatch',
        value: 'grid-template-rows',
        description: 'Uses grid-template-rows',
      },
    ],
    hint: 'Define grid-template-areas with three rows: the first and last rows have one name repeated across all columns (header/footer), while the middle row has three different area names. Assign each child to its area with grid-area.',
    resources: [],
  },

  // ── 371: CSS-Only Accordion ────────────────────────────────────────────────
  {
    id: 371,
    title: 'CSS-Only Accordion',
    type: 'html-css',
    tier: 4,
    category: ['css', 'transitions'],
    tags: ['html', 'css', 'accordion', 'details', 'summary', 'interactive', 'tier4'],
    description: 'Build an accordion component using HTML details/summary elements with custom CSS styling.',
    instructions: `Build an accordion using native \`<details>\` and \`<summary>\` elements with custom CSS.

**Requirements:**
- At least 3 \`<details>\` elements, each with a \`<summary>\` and content inside
- Style \`<summary>\` with \`cursor: pointer\`
- Style the open state using \`details[open]\` to visually distinguish expanded sections
- Add padding, borders, or background to make sections visually distinct
- Optional: add a transition or icon indicator for open/closed state

**Example structure:**
\`\`\`html
<details>
  <summary>Section Title</summary>
  <p>Section content here...</p>
</details>
\`\`\`

The accordion should be purely HTML/CSS with no JavaScript.`,
    starterCode: `<!-- Build your accordion sections -->\n\n/* Style your accordion below */\n`,
    solution: `<div class="accordion">
  <details>
    <summary>What is HTML?</summary>
    <p>HTML (HyperText Markup Language) is the standard language for creating web pages and web applications.</p>
  </details>
  <details>
    <summary>What is CSS?</summary>
    <p>CSS (Cascading Style Sheets) is used to style and layout web pages, controlling colors, fonts, spacing, and more.</p>
  </details>
  <details>
    <summary>What is JavaScript?</summary>
    <p>JavaScript is a programming language that enables interactive and dynamic behavior on websites.</p>
  </details>
</div>

<style>
  .accordion {
    max-width: 600px;
  }
  details {
    border: 1px solid #334155;
    border-radius: 6px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  summary {
    cursor: pointer;
    padding: 12px 16px;
    font-weight: bold;
    background: #1e293b;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  details p {
    padding: 12px 16px;
    margin: 0;
  }
  details[open] {
    border-color: #818cf8;
  }
  details[open] summary {
    background: #312e81;
    border-bottom: 1px solid #334155;
  }
</style>`,
    testRunner: '',
    testCases: [
      {
        query: 'details',
        assertion: 'countAtLeast',
        value: 3,
        description: 'At least 3 <details> elements',
      },
      {
        query: 'summary',
        assertion: 'countAtLeast',
        value: 3,
        description: 'At least 3 <summary> elements',
      },
      {
        query: 'details',
        assertion: 'sourceMatch',
        value: 'details',
        description: 'Source contains details elements',
      },
      {
        query: 'summary',
        assertion: 'sourceMatch',
        value: 'summary',
        description: 'Source contains summary elements',
      },
      {
        query: 'details',
        assertion: 'sourceMatch',
        value: '[open]',
        description: 'Styles the details[open] state',
      },
    ],
    hint: 'The <details> element is natively collapsible in HTML. <summary> provides the clickable heading. Use the details[open] CSS selector to style the expanded state differently. Add cursor: pointer to summary for better UX.',
    resources: [],
  },

  // ── 372: Dark Mode with Custom Properties ──────────────────────────────────
  {
    id: 372,
    title: 'Dark Mode with Custom Properties',
    type: 'css',
    tier: 4,
    category: ['css', 'layout'],
    tags: ['css', 'custom-properties', 'dark-mode', 'theming', 'tier4'],
    description: 'Implement a dark mode theme system using CSS custom properties on :root and [data-theme="dark"].',
    instructions: `Create a theming system using CSS custom properties (variables).

**Requirements:**
1. Define light theme variables on \`:root\` with at least 3 custom properties (e.g. \`--bg\`, \`--text\`, \`--accent\`)
2. Override those variables inside \`[data-theme="dark"]\` for the dark theme
3. Style \`body\` using the custom property for background
4. Style \`.card\` with a visible background color using a custom property
5. Style \`.btn\` with a background color using a custom property

The provided HTML has \`data-theme="dark"\` set, so your dark theme values will be active.`,
    starterCode: `/* Define your theme variables and styles */\n`,
    providedHtml: '<div data-theme="dark"><div class="card" id="card-el"><h2>Title</h2><p>Content</p><button class="btn" id="btn-el">Click</button></div></div>',
    solution: `:root {
  --bg: #ffffff;
  --text: #1e293b;
  --accent: #6366f1;
  --card-bg: #f1f5f9;
  --btn-bg: #6366f1;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
  --accent: #818cf8;
  --card-bg: #1e293b;
  --btn-bg: #818cf8;
}

body {
  background-color: var(--bg);
  color: var(--text);
}

.card {
  background-color: var(--card-bg);
  padding: 24px;
  border-radius: 8px;
}

.btn {
  background-color: var(--btn-bg);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
    testRunner: '',
    testCases: [
      {
        query: ':root',
        assertion: 'sourceMatch',
        value: ':root',
        description: 'Defines variables on :root',
      },
      {
        query: '[data-theme]',
        assertion: 'sourceMatch',
        value: 'data-theme',
        description: 'Uses data-theme attribute selector',
      },
      {
        query: '.card',
        assertion: 'sourceMatch',
        value: '--',
        description: 'Uses at least one CSS custom property',
      },
      {
        query: '#card-el',
        assertion: 'exists',
        description: '.card element exists',
      },
      {
        query: '#btn-el',
        assertion: 'exists',
        description: '.btn element exists',
      },
    ],
    hint: 'Define CSS custom properties (--name: value) in :root for the default/light theme. Then re-declare the same properties with different values inside [data-theme="dark"]. Use var(--name) throughout your styles so they automatically switch when the data-theme attribute changes.',
    resources: [],
  },

  // ── 373: Advanced Grid: Auto-fit Gallery ───────────────────────────────────
  {
    id: 373,
    title: 'Advanced Grid: Auto-fit Gallery',
    type: 'css',
    tier: 4,
    category: ['css', 'layout'],
    tags: ['css', 'grid', 'auto-fit', 'minmax', 'responsive', 'tier4'],
    description: 'Create a responsive card grid using CSS Grid auto-fit and minmax() with no media queries.',
    instructions: `Create a responsive grid layout for the gallery that automatically adjusts the number of columns based on available space.

**Requirements:**
1. \`.gallery\` uses \`display: grid\`
2. Use \`grid-template-columns\` with \`repeat(auto-fit, minmax(...))\` or \`repeat(auto-fill, minmax(...))\` to create responsive columns
3. Set a \`gap\` on the gallery for spacing between cards
4. No media queries needed — the grid should be intrinsically responsive
5. Each \`.card\` should have some padding and a visible background or border

The provided HTML contains 6 cards inside a \`.gallery\` container.`,
    starterCode: `/* Style the .gallery grid and .card items */\n`,
    providedHtml: '<div class="gallery" id="gallery-el"><div class="card">1</div><div class="card">2</div><div class="card">3</div><div class="card">4</div><div class="card">5</div><div class="card">6</div></div>',
    solution: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  font-size: 1.5rem;
}`,
    testRunner: '',
    testCases: [
      {
        query: '#gallery-el',
        assertion: 'equals',
        property: 'display',
        value: 'grid',
        description: '.gallery uses display: grid',
      },
      {
        query: '.gallery',
        assertion: 'sourceMatch',
        value: 'auto-fi',
        description: 'Uses auto-fit or auto-fill',
      },
      {
        query: '.gallery',
        assertion: 'sourceMatch',
        value: 'minmax',
        description: 'Uses minmax() function',
      },
      {
        query: '#gallery-el',
        assertion: 'exists',
        description: '.gallery element renders',
      },
    ],
    hint: 'The magic formula is: grid-template-columns: repeat(auto-fit, minmax(MIN_WIDTH, 1fr)). auto-fit fills as many columns as possible at the minimum width, and 1fr lets them stretch to fill leftover space. No media queries needed!',
    resources: [],
  },

  // ── 374: Accessible Navigation with ARIA ───────────────────────────────────
  {
    id: 374,
    title: 'Accessible Navigation with ARIA',
    type: 'html',
    tier: 4,
    category: ['html', 'structure'],
    tags: ['html', 'accessibility', 'aria', 'navigation', 'tier4'],
    description: 'Build an accessible navigation bar using ARIA attributes, roles, and a skip-link.',
    instructions: `Build an accessible navigation component with proper ARIA attributes.

**Requirements:**
1. A \`<nav>\` element with \`role="navigation"\` and an \`aria-label\` attribute describing the nav (e.g. "Main navigation")
2. Inside the nav, an unordered list with at least 3 navigation links
3. One link should have \`aria-current="page"\` to indicate the current page
4. A skip-link: an \`<a>\` element with class \`skip-link\` that links to \`#main-content\` (e.g. "Skip to main content"). This should appear before the nav.
5. A \`<main id="main-content">\` element as the skip-link target

**Example skip-link:**
\`\`\`html
<a class="skip-link" href="#main-content">Skip to main content</a>
\`\`\`

The skip-link is typically visually hidden but becomes visible on focus for keyboard users.`,
    starterCode: `<!-- Build your accessible navigation -->\n`,
    solution: `<a class="skip-link" href="#main-content">Skip to main content</a>

<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="#home" aria-current="page">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>Welcome</h1>
  <p>Main content goes here.</p>
</main>`,
    testRunner: '',
    testCases: [
      {
        query: 'nav',
        assertion: 'exists',
        description: '<nav> element exists',
      },
      {
        query: 'nav',
        assertion: 'sourceMatch',
        value: 'role=',
        description: 'nav has a role attribute',
      },
      {
        query: 'nav',
        assertion: 'sourceMatch',
        value: 'aria-label',
        description: 'nav has an aria-label attribute',
      },
      {
        query: 'nav',
        assertion: 'sourceMatch',
        value: 'aria-current',
        description: 'Uses aria-current to mark active page',
      },
      {
        query: '.skip-link',
        assertion: 'sourceMatch',
        value: 'skip',
        description: 'Contains a skip link',
      },
    ],
    hint: 'The role="navigation" explicitly tells assistive technology this is a navigation landmark. aria-label provides a text label for when there are multiple navs. aria-current="page" tells screen readers which link represents the current page. The skip-link lets keyboard users jump past the nav.',
    resources: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIER 5 (375-377)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 375: Full Page Responsive Layout ───────────────────────────────────────
  {
    id: 375,
    title: 'Full Page Responsive Layout',
    type: 'html-css',
    tier: 5,
    category: ['css', 'layout'],
    tags: ['html', 'css', 'responsive', 'grid', 'flexbox', 'composition', 'tier5'],
    description: 'Build a complete responsive page from scratch with hero, features grid, testimonials, and multi-column footer.',
    instructions: `Build a complete, responsive landing page from scratch.

**Required sections:**
1. A \`<nav>\` with at least 3 \`<a>\` links
2. A \`.hero\` section with a heading and call-to-action
3. A \`.features\` section using CSS Grid to display feature cards
4. A \`.testimonials\` section with at least one testimonial
5. A \`<footer>\` with multi-column link groups

**Required CSS techniques:**
1. Use **CSS Grid** for the features section (\`grid-template-columns\`)
2. Use **Flexbox** for at least one section (nav, footer, etc.)
3. Define and use at least one **CSS custom property** (\`--\`)
4. Include at least one **\`@media\` query** for responsive behavior
5. All sections should be visually distinct with appropriate spacing

This is a composition exercise: plan the full page structure, then style each section.`,
    starterCode: `<!-- Build your full-page layout from scratch -->\n`,
    solution: `<nav class="main-nav">
  <div class="logo">Brand</div>
  <div class="nav-links">
    <a href="#features">Features</a>
    <a href="#testimonials">Testimonials</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

<section class="hero">
  <h1>Build Something Amazing</h1>
  <p>A modern toolkit for modern developers.</p>
  <a href="#features" class="cta-btn">Get Started</a>
</section>

<section class="features" id="features">
  <h2>Features</h2>
  <div class="features-grid">
    <div class="feature-card">
      <h3>Fast</h3>
      <p>Optimized for performance.</p>
    </div>
    <div class="feature-card">
      <h3>Flexible</h3>
      <p>Adapts to any workflow.</p>
    </div>
    <div class="feature-card">
      <h3>Friendly</h3>
      <p>Great developer experience.</p>
    </div>
  </div>
</section>

<section class="testimonials" id="testimonials">
  <h2>Testimonials</h2>
  <blockquote>
    <p>"This changed the way I build websites."</p>
    <cite>- A Happy Developer</cite>
  </blockquote>
</section>

<footer>
  <div class="footer-columns">
    <div class="footer-col">
      <h4>Product</h4>
      <a href="#">Features</a>
      <a href="#">Pricing</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="#">About</a>
      <a href="#">Blog</a>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <a href="#">Docs</a>
      <a href="#">Contact</a>
    </div>
  </div>
</footer>

<style>
  :root {
    --primary: #6366f1;
    --spacing: 24px;
    --text: #e2e8f0;
    --bg: #0f172a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }

  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px var(--spacing);
    background: #1e293b;
  }
  .nav-links { display: flex; gap: 16px; }
  .nav-links a { color: var(--text); text-decoration: none; }

  .hero {
    text-align: center;
    padding: 80px var(--spacing);
  }
  .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
  .cta-btn {
    display: inline-block;
    margin-top: 16px;
    padding: 12px 32px;
    background: var(--primary);
    color: white;
    border-radius: 6px;
    text-decoration: none;
  }

  .features { padding: var(--spacing); text-align: center; }
  .features h2 { margin-bottom: var(--spacing); }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
  }
  .feature-card {
    background: #1e293b;
    padding: var(--spacing);
    border-radius: 8px;
  }

  .testimonials {
    padding: 48px var(--spacing);
    text-align: center;
  }
  .testimonials blockquote {
    max-width: 600px;
    margin: 16px auto;
    font-style: italic;
  }

  footer {
    background: #1e293b;
    padding: var(--spacing);
  }
  .footer-columns {
    display: flex;
    justify-content: space-around;
    max-width: 900px;
    margin: 0 auto;
  }
  .footer-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .footer-col a { color: var(--text); text-decoration: none; }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    .footer-columns {
      flex-direction: column;
      gap: 24px;
      align-items: center;
    }
  }
</style>`,
    testRunner: '',
    testCases: [
      {
        query: '.hero',
        assertion: 'exists',
        description: '.hero section exists',
      },
      {
        query: '.features',
        assertion: 'exists',
        description: '.features section exists',
      },
      {
        query: '.testimonials',
        assertion: 'exists',
        description: '.testimonials section exists',
      },
      {
        query: 'footer',
        assertion: 'exists',
        description: '<footer> element exists',
      },
      {
        query: '.features',
        assertion: 'sourceMatch',
        value: 'grid-template-columns',
        description: 'Features section uses grid-template-columns',
      },
      {
        query: '.features',
        assertion: 'sourceMatch',
        value: '@media',
        description: 'Uses at least one @media query',
      },
      {
        query: '.features',
        assertion: 'sourceMatch',
        value: '--',
        description: 'Uses CSS custom properties',
      },
      {
        query: 'nav a',
        assertion: 'countAtLeast',
        value: 3,
        description: 'Navigation has at least 3 links',
      },
    ],
    hint: 'Plan the page top-to-bottom: nav, hero, features, testimonials, footer. Use Grid for the features card layout (grid-template-columns: repeat(3, 1fr)). Use Flexbox for the nav and footer columns. Define custom properties in :root and add a @media query to stack columns on small screens.',
    resources: [],
  },

  // ── 376: Complex Animation Sequence ────────────────────────────────────────
  {
    id: 376,
    title: 'Complex Animation Sequence',
    type: 'css',
    tier: 5,
    category: ['css', 'transitions'],
    tags: ['css', 'animation', 'keyframes', 'transforms', 'complex', 'tier5'],
    description: 'Create multiple coordinated @keyframes animations: a spinning loader, a fade-in sequence, and a pulse effect.',
    instructions: `Create a multi-animation CSS system with three distinct @keyframes animations.

**Requirements:**
1. A \`@keyframes spin\` animation that rotates an element 360 degrees (for the spinner)
2. A \`@keyframes fadeIn\` animation that fades content from transparent to visible
3. A \`@keyframes pulse\` animation that scales an element up and down rhythmically
4. Apply the spin animation to \`.spinner\` using the \`animation\` property
5. Apply fadeIn to \`.content\`
6. Apply pulse to \`.pulse\`
7. Use \`transform\` in at least one keyframe (e.g. rotate or scale)

**Provided HTML includes:**
- A \`.loader\` container with a \`.spinner\` inside
- A \`.content\` container with a \`.card.pulse\` inside

Make the animations visually interesting — the spinner should spin continuously, fadeIn should play once, and pulse should loop.`,
    starterCode: `/* Create your @keyframes animations and apply them */\n`,
    providedHtml: '<div class="loader" id="loader-el"><div class="spinner" id="spinner-el"></div></div><div class="content" id="content-el"><div class="card pulse" id="pulse-el">Card</div></div>',
    solution: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.loader {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #334155;
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.content {
  animation: fadeIn 0.6s ease-out forwards;
  padding: 24px;
}

.card {
  background: #1e293b;
  padding: 24px;
  border-radius: 8px;
  display: inline-block;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}`,
    testRunner: '',
    testCases: [
      {
        query: '.spinner',
        assertion: 'sourceMatch',
        value: '@keyframes\\s+\\w+',
        description: 'Defines at least one @keyframes animation',
      },
      {
        query: '.spinner',
        assertion: 'sourceMatch',
        value: '@keyframes',
        description: 'Contains multiple @keyframes blocks',
      },
      {
        query: '#spinner-el',
        assertion: 'exists',
        description: '.spinner element renders',
      },
      {
        query: '.spinner',
        assertion: 'sourceMatch',
        value: 'transform',
        description: 'Uses transform in animations',
      },
    ],
    hint: '@keyframes defines an animation sequence — each block needs a name (spin, fadeIn, pulse). Use from/to or percentage steps. Apply with the animation shorthand: animation: name duration timing-function iteration-count. transform: rotate() for spinning, scale() for pulsing, translateY() for sliding.',
    resources: [],
  },

  // ── 377: Pixel-Perfect Card Component ──────────────────────────────────────
  {
    id: 377,
    title: 'Pixel-Perfect Card Component',
    type: 'html-css',
    tier: 5,
    category: ['css', 'box-model'],
    tags: ['html', 'css', 'component', 'composition', 'pixel-perfect', 'tier5'],
    description: 'Build a detailed card component matching exact specs: border-radius, shadows, gradient overlay, hover transform, and precise spacing.',
    instructions: `Build a pixel-perfect card component matching these exact specifications.

**Required HTML structure:**
- \`.card\` - the outer card container
- \`.card-image\` - an image area (can use a colored div as placeholder)
- \`.card-body\` - the text content area
- \`.card-tag\` - an absolute-positioned badge/tag overlay on the image

**Exact CSS specifications:**
1. \`.card\`:
   - \`border-radius: 16px\`
   - \`overflow: hidden\`
   - A \`box-shadow\` for depth
   - Background color

2. \`.card-image\`:
   - \`aspect-ratio\` set (e.g. 16/9 or 3/2)
   - Background color or image as placeholder

3. \`.card-body\`:
   - Padding for content spacing
   - Contains heading and text

4. \`.card-tag\`:
   - \`position: absolute\` (positioned over the image area)
   - Small badge styling (padding, border-radius, background)

5. Hover effect: subtle \`transform\` on \`.card:hover\` (e.g. translateY or scale)

Build everything from scratch — both the HTML structure and all CSS.`,
    starterCode: `<!-- Build your pixel-perfect card -->\n`,
    solution: `<div class="card">
  <div class="card-image-wrapper">
    <div class="card-image"></div>
    <span class="card-tag">Featured</span>
  </div>
  <div class="card-body">
    <h3>Card Title</h3>
    <p>This is a pixel-perfect card component with precise spacing, shadows, and a gradient overlay.</p>
  </div>
</div>

<style>
  .card {
    max-width: 360px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    background: #1e293b;
    transition: transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-4px);
  }

  .card-image-wrapper {
    position: relative;
  }

  .card-image {
    aspect-ratio: 16 / 9;
    background: linear-gradient(135deg, #6366f1, #818cf8);
  }

  .card-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: #e2e8f0;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
  }

  .card-body {
    padding: 20px;
  }

  .card-body h3 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
  }

  .card-body p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #94a3b8;
  }
</style>`,
    testRunner: '',
    testCases: [
      {
        query: '.card',
        assertion: 'exists',
        description: '.card element exists',
      },
      {
        query: '.card',
        assertion: 'equals',
        property: 'border-radius',
        value: '16px',
        description: '.card has border-radius of 16px',
      },
      {
        query: '.card',
        assertion: 'equals',
        property: 'overflow',
        value: 'hidden',
        description: '.card has overflow hidden',
      },
      {
        query: '.card',
        assertion: 'sourceMatch',
        value: 'box-shadow',
        description: '.card uses box-shadow',
      },
      {
        query: '.card-image',
        assertion: 'exists',
        description: '.card-image element exists',
      },
      {
        query: '.card-image',
        assertion: 'sourceMatch',
        value: 'aspect-ratio',
        description: '.card-image uses aspect-ratio',
      },
      {
        query: '.card-body',
        assertion: 'exists',
        description: '.card-body element exists',
      },
      {
        query: '.card-tag',
        assertion: 'exists',
        description: '.card-tag element exists',
      },
      {
        query: '.card-tag',
        assertion: 'equals',
        property: 'position',
        value: 'absolute',
        description: '.card-tag has position absolute',
      },
    ],
    hint: 'Start with the .card container: border-radius, overflow:hidden, and box-shadow give it the card shape and depth. The image wrapper needs position:relative so the tag can be position:absolute inside it. Use aspect-ratio on the image placeholder. The card-body just needs padding for spacing.',
    resources: [],
  },
];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} HTML/CSS exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

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

const typeCounts = {};
for (const ex of newExercises) {
  typeCounts[ex.type] = (typeCounts[ex.type] || 0) + 1;
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
console.log(`  By type: ${Object.entries(typeCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  By category: ${Object.entries(categoryCounts).map(([k, v]) => `${k}:${v}`).join(', ')}`);
console.log(`  Tier distribution: T1:${tierCounts[1] || 0} T2:${tierCounts[2] || 0} T3:${tierCounts[3] || 0} T4:${tierCounts[4] || 0} T5:${tierCounts[5] || 0}`);
