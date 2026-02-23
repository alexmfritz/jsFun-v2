/**
 * Add DOM Manipulation exercises (IDs 336-344)
 *
 * 9 exercises across 3 subcategories:
 *   - selection (336-337): Query and Count Elements, Walk the DOM Tree
 *   - events (338-339): Event Delegation, Debounced Input
 *   - manipulation (340-344): Build a List, Toggle Classes, Tabbed Interface,
 *                             Drag-and-Drop Sort, Virtual DOM Diffing
 *
 * Also:
 *   - Adds "dom-manipulation" category to data.categories
 *   - Updates default-curriculum collection to include all 9 new IDs
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'exercises', 'exercises.json');
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// ─── ADD DOM-MANIPULATION CATEGORY ───────────────────────────────────────────

data.categories['dom-manipulation'] = {
  label: 'DOM Manipulation',
  color: '#e879f9',
  children: {
    selection: { label: 'Selection' },
    events: { label: 'Events' },
    manipulation: { label: 'Manipulation' },
  },
};

console.log('  Added dom-manipulation category');

// ─── NEW EXERCISES ───────────────────────────────────────────────────────────

const newExercises = [

  // ═══════════════════════════════════════════════════════════════════════════
  // dom-manipulation/selection (336-337)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 336: Query and Count Elements ────────────────────────────────────────
  {
    id: 336,
    title: 'Query and Count Elements',
    type: 'js',
    tier: 2,
    category: ['dom-manipulation', 'selection'],
    tags: ['dom', 'selection', 'querySelector'],
    description: 'Use querySelectorAll to count how many elements match a given CSS selector within a container.',
    instructions: `Write a function called \`countBySelector\` that takes a DOM element (the container) and a CSS selector string, and returns the number of elements inside the container that match the selector.\n\nExamples:\n  // Given: <div id="root"><p class="item">A</p><p class="item">B</p><span class="item">C</span><p>D</p></div>\n  countBySelector(root, '.item')   \u2192 3\n  countBySelector(root, 'p')       \u2192 3\n  countBySelector(root, 'span')    \u2192 1\n  countBySelector(root, '.none')   \u2192 0`,
    starterCode: `function countBySelector(container, selector) {\n\n}`,
    solution: `function countBySelector(container, selector) {\n  return container.querySelectorAll(selector).length;\n}`,
    testRunner: `(code) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<div id="root"><p class="item">A</p><p class="item">B</p><span class="item">C</span><p>D</p></div>', 'text/html');
  const root = doc.getElementById('root');
  const fn = new Function('container', 'selector', code + '; return countBySelector(container, selector);');
  return [
    { pass: fn(root, '.item') === 3, description: 'countBySelector(root, ".item") returns 3', got: String(fn(root, '.item')) },
    { pass: fn(root, 'p') === 3, description: 'countBySelector(root, "p") returns 3', got: String(fn(root, 'p')) },
    { pass: fn(root, 'span') === 1, description: 'countBySelector(root, "span") returns 1', got: String(fn(root, 'span')) },
    { pass: fn(root, '.none') === 0, description: 'countBySelector(root, ".none") returns 0', got: String(fn(root, '.none')) },
    { pass: fn(root, 'p.item') === 2, description: 'countBySelector(root, "p.item") returns 2', got: String(fn(root, 'p.item')) },
  ];
}`,
    hint: 'Use container.querySelectorAll(selector) to find all matching elements, then return the .length of the resulting NodeList.',
    resources: [
      { label: 'MDN: querySelectorAll', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll' },
    ],
  },

  // ── 337: Walk the DOM Tree ───────────────────────────────────────────────
  {
    id: 337,
    title: 'Walk the DOM Tree',
    type: 'js',
    tier: 3,
    category: ['dom-manipulation', 'selection'],
    tags: ['dom', 'recursion', 'traversal'],
    description: 'Recursively traverse a DOM tree and collect all text content from text nodes.',
    instructions: `Write a function called \`collectText\` that takes a DOM element and recursively walks the entire DOM tree, collecting text from text nodes (nodes where \`node.nodeType === 3\`).\n\nReturn an array of trimmed, non-empty text strings in the order they appear.\n\nExamples:\n  // Given: <div><p>Hello <strong>World</strong></p><p>Goodbye</p></div>\n  collectText(div) \u2192 ["Hello", "World", "Goodbye"]\n\n  // Given: <ul><li>A</li><li>B</li></ul>\n  collectText(ul) \u2192 ["A", "B"]`,
    starterCode: `function collectText(element) {\n  // Recursively walk the DOM tree\n  // Collect text from text nodes (node.nodeType === 3)\n  // Return array of trimmed, non-empty text\n}`,
    solution: `function collectText(element) {\n  const result = [];\n  for (const node of element.childNodes) {\n    if (node.nodeType === 3) {\n      const text = node.textContent.trim();\n      if (text) result.push(text);\n    } else if (node.nodeType === 1) {\n      result.push(...collectText(node));\n    }\n  }\n  return result;\n}`,
    testRunner: `(code) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString('<div><p>Hello <strong>World</strong></p><p>Goodbye</p></div>', 'text/html');
  const div1 = doc1.body.firstChild;
  const doc2 = parser.parseFromString('<ul><li>A</li><li>B</li><li>C</li></ul>', 'text/html');
  const ul = doc2.body.firstChild;
  const doc3 = parser.parseFromString('<div>  <span>  </span>  </div>', 'text/html');
  const emptyDiv = doc3.body.firstChild;
  const doc4 = parser.parseFromString('<div><div><div>Deep</div></div></div>', 'text/html');
  const deep = doc4.body.firstChild;

  const fn = new Function('element', code + '; return collectText(element);');
  const r1 = fn(div1);
  const r2 = fn(ul);
  const r3 = fn(emptyDiv);
  const r4 = fn(deep);
  return [
    { pass: JSON.stringify(r1) === '["Hello","World","Goodbye"]', description: 'collects text from nested elements', got: JSON.stringify(r1) },
    { pass: JSON.stringify(r2) === '["A","B","C"]', description: 'collects text from list items', got: JSON.stringify(r2) },
    { pass: JSON.stringify(r3) === '[]', description: 'whitespace-only nodes are excluded', got: JSON.stringify(r3) },
    { pass: JSON.stringify(r4) === '["Deep"]', description: 'deeply nested text is found', got: JSON.stringify(r4) },
  ];
}`,
    hint: 'Loop through element.childNodes. For each node, check nodeType: 3 means text node (grab its textContent), 1 means element node (recurse into it). Trim text and skip empty strings.',
    resources: [
      { label: 'MDN: Node.childNodes', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes' },
      { label: 'MDN: Node.nodeType', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // dom-manipulation/events (338-339)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 338: Event Delegation ────────────────────────────────────────────────
  {
    id: 338,
    title: 'Event Delegation',
    type: 'js',
    tier: 3,
    category: ['dom-manipulation', 'events'],
    tags: ['dom', 'events', 'delegation'],
    description: 'Implement event delegation by attaching a single click listener to a parent element that responds to clicks on child <li> elements.',
    instructions: `Write a function called \`setupDelegation\` that takes two DOM elements:\n- \`container\`: a parent element (e.g., a <ul>)\n- \`outputEl\`: an element where results will be displayed\n\nAdd a single click event listener to the container. When an <li> element (or anything inside an <li>) is clicked, set \`outputEl.textContent\` to the value of the clicked <li>'s \`data-id\` attribute.\n\nExamples:\n  // Given: <ul id="list"><li data-id="1">Item 1</li><li data-id="2">Item 2</li></ul>\n  //        <div id="output"></div>\n  setupDelegation(list, output);\n  // After clicking "Item 2": output.textContent === "2"`,
    starterCode: `function setupDelegation(container, outputEl) {\n  // Add a single click listener to the container\n  // When an <li> is clicked, set outputEl.textContent to its data-id\n}`,
    solution: `function setupDelegation(container, outputEl) {\n  container.addEventListener('click', (e) => {\n    const li = e.target.closest('li');\n    if (li && container.contains(li)) {\n      outputEl.textContent = li.getAttribute('data-id');\n    }\n  });\n}`,
    testRunner: `(code) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400px;height:300px;';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument;
    idoc.open();
    idoc.write('<ul id="list"><li data-id="1">Item 1</li><li data-id="2">Item 2</li><li data-id="3"><span>Nested</span></li></ul><div id="output"></div>');
    idoc.close();

    const iwin = iframe.contentWindow;
    try {
      iwin.eval(code);
      const list = idoc.getElementById('list');
      const output = idoc.getElementById('output');
      iwin.eval('setupDelegation(document.getElementById("list"), document.getElementById("output"))');

      const results = [];

      // Click li[data-id="1"]
      const li1 = list.querySelector('[data-id="1"]');
      li1.dispatchEvent(new iwin.MouseEvent('click', { bubbles: true }));
      results.push({ pass: output.textContent === '1', description: 'clicking first li sets output to "1"', got: output.textContent });

      // Click li[data-id="2"]
      const li2 = list.querySelector('[data-id="2"]');
      li2.dispatchEvent(new iwin.MouseEvent('click', { bubbles: true }));
      results.push({ pass: output.textContent === '2', description: 'clicking second li sets output to "2"', got: output.textContent });

      // Click nested span inside li[data-id="3"]
      const span = list.querySelector('[data-id="3"] span');
      span.dispatchEvent(new iwin.MouseEvent('click', { bubbles: true }));
      results.push({ pass: output.textContent === '3', description: 'clicking nested span delegates to parent li', got: output.textContent });

      // Click container itself (not an li)
      output.textContent = 'unchanged';
      list.dispatchEvent(new iwin.MouseEvent('click', { bubbles: false }));
      results.push({ pass: output.textContent === 'unchanged', description: 'clicking container directly does not change output', got: output.textContent });

      document.body.removeChild(iframe);
      resolve(results);
    } catch (err) {
      document.body.removeChild(iframe);
      resolve([{ pass: false, description: 'setup failed: ' + err.message, got: err.message }]);
    }
  });
}`,
    hint: 'Add one click listener to the container. Inside it, use e.target.closest("li") to find the nearest <li> ancestor of whatever was clicked. Then read its data-id attribute with getAttribute("data-id").',
    resources: [
      { label: 'MDN: Event Delegation', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation' },
      { label: 'MDN: Element.closest()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/closest' },
    ],
  },

  // ── 339: Debounced Input ─────────────────────────────────────────────────
  {
    id: 339,
    title: 'Debounced Input',
    type: 'js',
    tier: 3,
    category: ['dom-manipulation', 'events'],
    tags: ['dom', 'events', 'closure', 'timing'],
    description: 'Attach a debounced input listener that only fires a callback after the user stops typing for 300ms.',
    instructions: `Write a function called \`debounceInput\` that takes:\n- \`inputEl\`: an <input> DOM element\n- \`callback\`: a function to call with the input's value\n\nListen for "input" events on inputEl. Only call \`callback(inputEl.value)\` after 300ms of no new input events (debounce).\n\nIf the user types "a", then 100ms later types "b", only callback("ab") should fire (300ms after the "b").\n\nExample:\n  debounceInput(myInput, (val) => console.log(val));\n  // User types "hello" quickly\u2014callback fires once with "hello" after 300ms of silence`,
    starterCode: `function debounceInput(inputEl, callback) {\n  // Listen for 'input' events on inputEl\n  // Only call callback(inputEl.value) after 300ms of no input\n}`,
    solution: `function debounceInput(inputEl, callback) {\n  let timer;\n  inputEl.addEventListener('input', () => {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      callback(inputEl.value);\n    }, 300);\n  });\n}`,
    testRunner: `(code) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400px;height:300px;';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument;
    idoc.open();
    idoc.write('<input id="inp" type="text" />');
    idoc.close();

    const iwin = iframe.contentWindow;
    try {
      iwin.eval(code);
      const inp = idoc.getElementById('inp');
      const calls = [];
      iwin.eval('debounceInput(document.getElementById("inp"), function(val) { window.__calls.push(val); })');
      iwin.__calls = calls;

      // Simulate rapid typing: "a" then "ab" then "abc" with 100ms gaps
      inp.value = 'a';
      inp.dispatchEvent(new iwin.Event('input', { bubbles: true }));

      setTimeout(() => {
        inp.value = 'ab';
        inp.dispatchEvent(new iwin.Event('input', { bubbles: true }));
      }, 100);

      setTimeout(() => {
        inp.value = 'abc';
        inp.dispatchEvent(new iwin.Event('input', { bubbles: true }));
      }, 200);

      // At 350ms after last input (200 + 300 = 500ms + buffer), check
      setTimeout(() => {
        const results = [];
        results.push({ pass: calls.length === 0, description: 'callback not called during rapid typing (at 350ms)', got: 'calls: ' + calls.length });

        // Wait for debounce to fire (at ~550ms total)
        setTimeout(() => {
          results.push({ pass: calls.length === 1, description: 'callback called exactly once after debounce', got: 'calls: ' + calls.length });
          results.push({ pass: calls[0] === 'abc', description: 'callback received final value "abc"', got: calls[0] });

          // Fire another single input and check it fires
          inp.value = 'xyz';
          inp.dispatchEvent(new iwin.Event('input', { bubbles: true }));

          setTimeout(() => {
            results.push({ pass: calls.length === 2 && calls[1] === 'xyz', description: 'second debounced call fires with "xyz"', got: 'calls: ' + calls.length + ', last: ' + calls[calls.length - 1] });
            document.body.removeChild(iframe);
            resolve(results);
          }, 400);
        }, 250);
      }, 350);
    } catch (err) {
      document.body.removeChild(iframe);
      resolve([{ pass: false, description: 'setup failed: ' + err.message, got: err.message }]);
    }
  });
}`,
    hint: 'Store a timer variable in the closure. On each input event, clearTimeout(timer) to cancel the previous timer, then set a new setTimeout for 300ms. The callback only fires if no new input arrives within that window.',
    resources: [
      { label: 'MDN: setTimeout', url: 'https://developer.mozilla.org/en-US/docs/Web/API/setTimeout' },
      { label: 'MDN: clearTimeout', url: 'https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // dom-manipulation/manipulation (340-344)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 340: Build a List from Data ──────────────────────────────────────────
  {
    id: 340,
    title: 'Build a List from Data',
    type: 'js',
    tier: 2,
    category: ['dom-manipulation', 'manipulation'],
    tags: ['dom', 'manipulation', 'createElement'],
    description: 'Programmatically create DOM elements from an array of data and append them to a container.',
    instructions: `Write a function called \`buildList\` that takes three arguments:\n- \`doc\`: the document object (used to create elements)\n- \`container\`: a DOM element to append to\n- \`items\`: an array of strings\n\nCreate a \`<ul>\` element, and for each item in the array, create an \`<li>\` element with the item as its textContent. Append the \`<ul>\` to the container.\n\nExamples:\n  buildList(document, container, ["Apple", "Banana", "Cherry"]);\n  // container now contains: <ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>`,
    starterCode: `function buildList(doc, container, items) {\n\n}`,
    solution: `function buildList(doc, container, items) {\n  const ul = doc.createElement('ul');\n  for (const item of items) {\n    const li = doc.createElement('li');\n    li.textContent = item;\n    ul.appendChild(li);\n  }\n  container.appendChild(ul);\n}`,
    testRunner: `(code) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<div id="root"></div>', 'text/html');
  const root = doc.getElementById('root');
  const fn = new Function('doc', 'container', 'items', code + '; buildList(doc, container, items);');
  fn(doc, root, ['Apple', 'Banana', 'Cherry']);
  const ul = root.querySelector('ul');
  const lis = ul ? ul.querySelectorAll('li') : [];
  return [
    { pass: ul !== null, description: 'a <ul> element is created', got: ul ? 'found' : 'not found' },
    { pass: lis.length === 3, description: '3 <li> elements created', got: String(lis.length) },
    { pass: lis.length >= 1 && lis[0].textContent === 'Apple', description: 'first li contains "Apple"', got: lis.length >= 1 ? lis[0].textContent : 'none' },
    { pass: lis.length >= 2 && lis[1].textContent === 'Banana', description: 'second li contains "Banana"', got: lis.length >= 2 ? lis[1].textContent : 'none' },
    { pass: lis.length >= 3 && lis[2].textContent === 'Cherry', description: 'third li contains "Cherry"', got: lis.length >= 3 ? lis[2].textContent : 'none' },
  ];
}`,
    hint: 'Use doc.createElement("ul") and doc.createElement("li") to create elements. Set li.textContent for each item, then use ul.appendChild(li) and container.appendChild(ul).',
    resources: [
      { label: 'MDN: Document.createElement()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement' },
      { label: 'MDN: Node.appendChild()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild' },
    ],
  },

  // ── 341: Toggle Classes Conditionally ────────────────────────────────────
  {
    id: 341,
    title: 'Toggle Classes Conditionally',
    type: 'js',
    tier: 2,
    category: ['dom-manipulation', 'manipulation'],
    tags: ['dom', 'manipulation', 'classList'],
    description: 'Add or remove a CSS class on elements based on whether their numeric content exceeds a threshold.',
    instructions: `Write a function called \`toggleHighlight\` that takes:\n- \`elements\`: an array-like list of DOM elements (each contains a number as text)\n- \`threshold\`: a number\n\nFor each element, parse its textContent as a number. If the number is greater than or equal to the threshold, add the CSS class "highlight". Otherwise, remove it.\n\nExamples:\n  // Given: <span>10</span> <span>20</span> <span>30</span>\n  toggleHighlight(spans, 20);\n  // First span: no "highlight" class\n  // Second span: has "highlight" class\n  // Third span: has "highlight" class`,
    starterCode: `function toggleHighlight(elements, threshold) {\n\n}`,
    solution: `function toggleHighlight(elements, threshold) {\n  for (const el of elements) {\n    const num = Number(el.textContent);\n    if (num >= threshold) {\n      el.classList.add('highlight');\n    } else {\n      el.classList.remove('highlight');\n    }\n  }\n}`,
    testRunner: `(code) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<div><span>10</span><span>20</span><span>30</span><span>5</span></div>', 'text/html');
  const spans = doc.querySelectorAll('span');
  const fn = new Function('elements', 'threshold', code + '; toggleHighlight(elements, threshold);');
  fn(spans, 20);
  return [
    { pass: !spans[0].classList.contains('highlight'), description: '10 < 20: no highlight', got: spans[0].classList.contains('highlight') ? 'has highlight' : 'no highlight' },
    { pass: spans[1].classList.contains('highlight'), description: '20 >= 20: has highlight', got: spans[1].classList.contains('highlight') ? 'has highlight' : 'no highlight' },
    { pass: spans[2].classList.contains('highlight'), description: '30 >= 20: has highlight', got: spans[2].classList.contains('highlight') ? 'has highlight' : 'no highlight' },
    { pass: !spans[3].classList.contains('highlight'), description: '5 < 20: no highlight', got: spans[3].classList.contains('highlight') ? 'has highlight' : 'no highlight' },
    { pass: (() => { fn(spans, 10); return spans[0].classList.contains('highlight') && !spans[3].classList.contains('highlight'); })(), description: 'changing threshold to 10 updates classes correctly', got: 'checked' },
  ];
}`,
    hint: 'Loop through elements. Use Number(el.textContent) to parse the number. Then use el.classList.add("highlight") or el.classList.remove("highlight") based on the comparison.',
    resources: [
      { label: 'MDN: Element.classList', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/classList' },
    ],
  },

  // ── 342: Create a Tabbed Interface ───────────────────────────────────────
  {
    id: 342,
    title: 'Create a Tabbed Interface',
    type: 'js',
    tier: 3,
    category: ['dom-manipulation', 'manipulation'],
    tags: ['dom', 'manipulation', 'events'],
    description: 'Build a tabbed UI where clicking a tab button shows the corresponding panel and hides the others.',
    instructions: `Write a function called \`initTabs\` that takes a container element.\n\nInside the container, find all elements with a \`data-tab\` attribute (tab buttons) and all elements with a \`data-panel\` attribute (panels).\n\nWhen a tab button is clicked:\n1. Hide all panels (set \`style.display = "none"\`)\n2. Show the panel whose \`data-panel\` value matches the clicked tab's \`data-tab\` value (set \`style.display = "block"\`)\n\nInitially, hide all panels except the first one.\n\nExample HTML:\n  <div id="tabs">\n    <button data-tab="a">Tab A</button>\n    <button data-tab="b">Tab B</button>\n    <div data-panel="a">Panel A content</div>\n    <div data-panel="b">Panel B content</div>\n  </div>`,
    starterCode: `function initTabs(container) {\n  // Find [data-tab] buttons and [data-panel] panels\n  // Clicking a tab shows matching panel, hides others\n}`,
    solution: `function initTabs(container) {\n  const tabs = container.querySelectorAll('[data-tab]');\n  const panels = container.querySelectorAll('[data-panel]');\n\n  // Hide all panels except first\n  panels.forEach((p, i) => {\n    p.style.display = i === 0 ? 'block' : 'none';\n  });\n\n  tabs.forEach(tab => {\n    tab.addEventListener('click', () => {\n      const target = tab.getAttribute('data-tab');\n      panels.forEach(p => {\n        p.style.display = p.getAttribute('data-panel') === target ? 'block' : 'none';\n      });\n    });\n  });\n}`,
    testRunner: `(code) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400px;height:300px;';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument;
    idoc.open();
    idoc.write('<div id="tabs"><button data-tab="a">Tab A</button><button data-tab="b">Tab B</button><button data-tab="c">Tab C</button><div data-panel="a">Panel A</div><div data-panel="b">Panel B</div><div data-panel="c">Panel C</div></div>');
    idoc.close();

    const iwin = iframe.contentWindow;
    try {
      iwin.eval(code);
      iwin.eval('initTabs(document.getElementById("tabs"))');

      const panels = idoc.querySelectorAll('[data-panel]');
      const tabs = idoc.querySelectorAll('[data-tab]');
      const results = [];

      // Initial state: first panel visible, others hidden
      results.push({ pass: panels[0].style.display === 'block', description: 'initially panel A is visible', got: panels[0].style.display });
      results.push({ pass: panels[1].style.display === 'none', description: 'initially panel B is hidden', got: panels[1].style.display });

      // Click tab B
      tabs[1].dispatchEvent(new iwin.MouseEvent('click', { bubbles: true }));
      results.push({ pass: panels[0].style.display === 'none', description: 'after clicking tab B: panel A hidden', got: panels[0].style.display });
      results.push({ pass: panels[1].style.display === 'block', description: 'after clicking tab B: panel B visible', got: panels[1].style.display });

      // Click tab C
      tabs[2].dispatchEvent(new iwin.MouseEvent('click', { bubbles: true }));
      results.push({ pass: panels[2].style.display === 'block' && panels[1].style.display === 'none', description: 'clicking tab C shows panel C and hides B', got: 'C:' + panels[2].style.display + ' B:' + panels[1].style.display });

      document.body.removeChild(iframe);
      resolve(results);
    } catch (err) {
      document.body.removeChild(iframe);
      resolve([{ pass: false, description: 'setup failed: ' + err.message, got: err.message }]);
    }
  });
}`,
    hint: 'Use querySelectorAll("[data-tab]") and querySelectorAll("[data-panel]") to find tabs and panels. Set all panels to display:none initially (except the first). Add a click listener to each tab that shows the matching panel and hides the rest.',
    resources: [
      { label: 'MDN: HTMLElement.dataset', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset' },
      { label: 'MDN: getAttribute()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute' },
    ],
  },

  // ── 343: Drag-and-Drop Sort ──────────────────────────────────────────────
  {
    id: 343,
    title: 'Drag-and-Drop Sort',
    type: 'js',
    tier: 4,
    category: ['dom-manipulation', 'manipulation'],
    tags: ['dom', 'manipulation', 'events', 'advanced'],
    description: 'Make a list sortable via drag-and-drop by implementing dragstart, dragover, and drop event handlers.',
    instructions: `Write a function called \`makeSortable\` that takes a <ul> (or <ol>) element and makes its <li> children sortable via drag-and-drop.\n\nFor each <li> child:\n1. Set its \`draggable\` attribute to \`true\`\n2. On \`dragstart\`: store a reference to the dragged element\n3. On \`dragover\`: call \`e.preventDefault()\` to allow dropping\n4. On \`drop\`: insert the dragged element before the drop target\n\nAfter your function runs, the user (or automated events) should be able to reorder list items by dragging.\n\nExample:\n  // Given: <ul><li>A</li><li>B</li><li>C</li></ul>\n  makeSortable(ul);\n  // Dragging "C" onto "A" results in: C, A, B`,
    starterCode: `function makeSortable(list) {\n  // your code here\n  // Make each <li> draggable\n  // Handle dragstart, dragover, drop to reorder\n}`,
    solution: `function makeSortable(list) {\n  let dragged = null;\n  const items = list.querySelectorAll('li');\n  items.forEach(item => {\n    item.draggable = true;\n    item.addEventListener('dragstart', (e) => {\n      dragged = item;\n    });\n    item.addEventListener('dragover', (e) => {\n      e.preventDefault();\n    });\n    item.addEventListener('drop', (e) => {\n      e.preventDefault();\n      if (dragged && dragged !== item) {\n        list.insertBefore(dragged, item);\n      }\n    });\n  });\n}`,
    testRunner: `(code) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400px;height:300px;';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument;
    idoc.open();
    idoc.write('<ul id="sortable"><li>A</li><li>B</li><li>C</li></ul>');
    idoc.close();

    const iwin = iframe.contentWindow;
    try {
      iwin.eval(code);
      const ul = idoc.getElementById('sortable');
      iwin.eval('makeSortable(document.getElementById("sortable"))');

      const results = [];
      const lis = ul.querySelectorAll('li');

      // Check all items are draggable
      results.push({ pass: Array.from(lis).every(li => li.draggable === true), description: 'all items are draggable', got: Array.from(lis).map(li => li.draggable).join(', ') });

      // Simulate drag C (index 2) onto A (index 0)
      const liC = lis[2]; // C
      const liA = lis[0]; // A

      const dragStartEvent = new iwin.Event('dragstart', { bubbles: true });
      liC.dispatchEvent(dragStartEvent);

      const dragOverEvent = new iwin.Event('dragover', { bubbles: true, cancelable: true });
      liA.dispatchEvent(dragOverEvent);

      const dropEvent = new iwin.Event('drop', { bubbles: true, cancelable: true });
      liA.dispatchEvent(dropEvent);

      const newOrder = Array.from(ul.querySelectorAll('li')).map(li => li.textContent);
      results.push({ pass: newOrder[0] === 'C', description: 'after drag C onto A: first item is C', got: newOrder[0] });
      results.push({ pass: newOrder[1] === 'A', description: 'after drag C onto A: second item is A', got: newOrder[1] });
      results.push({ pass: newOrder[2] === 'B', description: 'after drag C onto A: third item is B', got: newOrder[2] });
      results.push({ pass: newOrder.join(',') === 'C,A,B', description: 'full order is C,A,B', got: newOrder.join(',') });

      document.body.removeChild(iframe);
      resolve(results);
    } catch (err) {
      document.body.removeChild(iframe);
      resolve([{ pass: false, description: 'setup failed: ' + err.message, got: err.message }]);
    }
  });
}`,
    hint: 'Store the dragged element in a closure variable. Set draggable=true on each <li>. On dragstart, save the element. On dragover, call e.preventDefault(). On drop, use list.insertBefore(dragged, dropTarget) to move the element.',
    resources: [
      { label: 'MDN: Drag and Drop API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API' },
      { label: 'MDN: Node.insertBefore()', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore' },
    ],
  },

  // ── 344: Virtual DOM Diffing ─────────────────────────────────────────────
  {
    id: 344,
    title: 'Virtual DOM Diffing',
    type: 'js',
    tier: 5,
    category: ['dom-manipulation', 'manipulation'],
    tags: ['dom', 'algorithms', 'recursion', 'advanced'],
    description: 'Implement a simplified virtual DOM diff algorithm that compares two virtual node trees and produces a list of patches.',
    instructions: `Implement a function called \`diff\` that compares two virtual DOM trees and returns an array of patch objects describing the differences.\n\nA virtual node (vnode) is a plain object:\n\`\`\`js\n{ tag: 'div', props: { id: 'app' }, children: [ ... ] }\n\`\`\`\n\nChildren can be either vnode objects or strings (text nodes).\n\nPatch types:\n- \`{ type: 'REPLACE', path, newNode }\` \u2014 node was replaced entirely (different tag or text vs element)\n- \`{ type: 'PROPS', path, props }\` \u2014 props changed (props object contains only changed/added/removed keys; removed keys have value null)\n- \`{ type: 'REMOVE', path }\` \u2014 child was removed\n- \`{ type: 'ADD', path, newNode }\` \u2014 child was added\n\n\`path\` is an array of child indices showing how to reach the node from the root (empty array = root node).\n\nExamples:\n  diff({ tag: 'div', props: {}, children: [] },\n       { tag: 'span', props: {}, children: [] })\n  // [{ type: 'REPLACE', path: [], newNode: { tag: 'span', props: {}, children: [] } }]\n\n  diff({ tag: 'div', props: { id: 'a' }, children: [] },\n       { tag: 'div', props: { id: 'b' }, children: [] })\n  // [{ type: 'PROPS', path: [], props: { id: 'b' } }]`,
    starterCode: `// Virtual node structure:\n// { tag: string, props: object, children: (vnode | string)[] }\n//\n// Patch types:\n// { type: 'REPLACE', path: number[], newNode: vnode | string }\n// { type: 'PROPS',   path: number[], props: object }\n// { type: 'REMOVE',  path: number[] }\n// { type: 'ADD',     path: number[], newNode: vnode | string }\n\nfunction diff(oldTree, newTree) {\n  // Compare two virtual DOM trees\n  // Return array of patch objects\n}`,
    solution: `function diff(oldTree, newTree, path) {\n  if (path === undefined) path = [];\n  const patches = [];\n\n  // Both are strings (text nodes)\n  if (typeof oldTree === 'string' && typeof newTree === 'string') {\n    if (oldTree !== newTree) {\n      patches.push({ type: 'REPLACE', path: [...path], newNode: newTree });\n    }\n    return patches;\n  }\n\n  // One is string, other is element (or vice versa)\n  if (typeof oldTree !== typeof newTree) {\n    patches.push({ type: 'REPLACE', path: [...path], newNode: newTree });\n    return patches;\n  }\n\n  // Different tags\n  if (oldTree.tag !== newTree.tag) {\n    patches.push({ type: 'REPLACE', path: [...path], newNode: newTree });\n    return patches;\n  }\n\n  // Same tag \u2014 check props\n  const propChanges = {};\n  let hasChanges = false;\n  const allKeys = new Set([...Object.keys(oldTree.props || {}), ...Object.keys(newTree.props || {})]);\n  for (const key of allKeys) {\n    const oldVal = (oldTree.props || {})[key];\n    const newVal = (newTree.props || {})[key];\n    if (oldVal !== newVal) {\n      propChanges[key] = newVal !== undefined ? newVal : null;\n      hasChanges = true;\n    }\n  }\n  if (hasChanges) {\n    patches.push({ type: 'PROPS', path: [...path], props: propChanges });\n  }\n\n  // Diff children\n  const oldChildren = oldTree.children || [];\n  const newChildren = newTree.children || [];\n  const maxLen = Math.max(oldChildren.length, newChildren.length);\n  for (let i = 0; i < maxLen; i++) {\n    const childPath = [...path, i];\n    if (i >= oldChildren.length) {\n      patches.push({ type: 'ADD', path: childPath, newNode: newChildren[i] });\n    } else if (i >= newChildren.length) {\n      patches.push({ type: 'REMOVE', path: childPath });\n    } else {\n      patches.push(...diff(oldChildren[i], newChildren[i], childPath));\n    }\n  }\n\n  return patches;\n}`,
    testRunner: `(code) => {
  const fn = new Function(code + '; return diff;')();

  // Test 1: Different tags at root
  const r1 = fn(
    { tag: 'div', props: {}, children: [] },
    { tag: 'span', props: {}, children: [] }
  );
  const t1 = r1.length === 1 && r1[0].type === 'REPLACE' && r1[0].newNode.tag === 'span';

  // Test 2: Prop change
  const r2 = fn(
    { tag: 'div', props: { id: 'a' }, children: [] },
    { tag: 'div', props: { id: 'b' }, children: [] }
  );
  const t2 = r2.length === 1 && r2[0].type === 'PROPS' && r2[0].props.id === 'b';

  // Test 3: Identical trees
  const r3 = fn(
    { tag: 'div', props: { x: 1 }, children: ['hello'] },
    { tag: 'div', props: { x: 1 }, children: ['hello'] }
  );
  const t3 = r3.length === 0;

  // Test 4: Child added
  const r4 = fn(
    { tag: 'ul', props: {}, children: [{ tag: 'li', props: {}, children: ['A'] }] },
    { tag: 'ul', props: {}, children: [{ tag: 'li', props: {}, children: ['A'] }, { tag: 'li', props: {}, children: ['B'] }] }
  );
  const t4 = r4.some(p => p.type === 'ADD' && p.path.length === 1 && p.path[0] === 1);

  // Test 5: Child removed
  const r5 = fn(
    { tag: 'ul', props: {}, children: [{ tag: 'li', props: {}, children: ['A'] }, { tag: 'li', props: {}, children: ['B'] }] },
    { tag: 'ul', props: {}, children: [{ tag: 'li', props: {}, children: ['A'] }] }
  );
  const t5 = r5.some(p => p.type === 'REMOVE' && p.path[0] === 1);

  // Test 6: Text node change
  const r6 = fn(
    { tag: 'p', props: {}, children: ['old'] },
    { tag: 'p', props: {}, children: ['new'] }
  );
  const t6 = r6.some(p => p.type === 'REPLACE' && p.newNode === 'new');

  // Test 7: Prop removal
  const r7 = fn(
    { tag: 'div', props: { class: 'foo', id: 'bar' }, children: [] },
    { tag: 'div', props: { class: 'foo' }, children: [] }
  );
  const t7 = r7.some(p => p.type === 'PROPS' && p.props.id === null);

  return [
    { pass: t1, description: 'different tags produce REPLACE patch', got: JSON.stringify(r1[0]) },
    { pass: t2, description: 'changed prop produces PROPS patch', got: JSON.stringify(r2[0]) },
    { pass: t3, description: 'identical trees produce no patches', got: 'patches: ' + r3.length },
    { pass: t4, description: 'added child produces ADD patch', got: JSON.stringify(r4.find(p => p.type === 'ADD')) },
    { pass: t5, description: 'removed child produces REMOVE patch', got: JSON.stringify(r5.find(p => p.type === 'REMOVE')) },
    { pass: t6, description: 'changed text node produces REPLACE patch', got: JSON.stringify(r6.find(p => p.type === 'REPLACE')) },
    { pass: t7, description: 'removed prop has null value in PROPS patch', got: JSON.stringify(r7.find(p => p.type === 'PROPS')) },
  ];
}`,
    hint: 'Build a recursive function that takes oldTree, newTree, and a path array. Handle base cases: both strings (compare), different types (REPLACE), different tags (REPLACE). For same tags, diff the props and then recursively diff children by index.',
    resources: [
      { label: 'Virtual DOM Explained', url: 'https://reactjs.org/docs/faq-internals.html' },
      { label: 'MDN: Recursion', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Recursion' },
    ],
  },
];

// ─── APPEND EXERCISES ────────────────────────────────────────────────────────

data.exercises.push(...newExercises);
console.log(`  Added ${newExercises.length} DOM manipulation exercises (IDs ${newExercises[0].id}-${newExercises[newExercises.length - 1].id})`);

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
