import { describe, it, expect } from 'vitest';
import { runJsTests } from '../../src/runners/jsRunner';
import { runHtmlTests } from '../../src/runners/htmlRunner';

// ─── JS Runner ─────────────────────────────────────────────────────────────────

describe('jsRunner', () => {
  it('returns passing results for correct code', async () => {
    const code = 'function greet(name) { return "Hello, " + name + "!"; }';
    const runner =
      '(code) => { const fn = new Function(code + "; return greet;")(); return [{ pass: fn("Alex") === "Hello, Alex!", description: \'greet("Alex")\', got: fn("Alex") }]; }';
    const results = await runJsTests(code, runner);
    expect(results).toHaveLength(1);
    expect(results[0].pass).toBe(true);
  });

  it('returns failing results for incorrect code', async () => {
    const code = 'function greet(name) { return name; }';
    const runner =
      '(code) => { const fn = new Function(code + "; return greet;")(); return [{ pass: fn("Alex") === "Hello, Alex!", description: "greeting", got: fn("Alex") }]; }';
    const results = await runJsTests(code, runner);
    expect(results[0].pass).toBe(false);
    expect(results[0].got).toBe('Alex');
  });

  it('catches runtime errors gracefully', async () => {
    const code = 'this is not valid javascript !!!';
    const runner = '(code) => { new Function(code)(); return []; }';
    const results = await runJsTests(code, runner);
    expect(results[0].pass).toBe(false);
    expect(results[0].description).toMatch(/error/i);
  });

  it('returns error for empty testRunner', async () => {
    const results = await runJsTests('const x = 1;', '');
    expect(results[0].pass).toBe(false);
    expect(results[0].description).toMatch(/no test runner/i);
  });

  it('handles multiple test cases', async () => {
    const code = 'function evenOrOdd(n) { return n % 2 === 0 ? "even" : "odd"; }';
    const runner =
      '(code) => { const fn = new Function(code + "; return evenOrOdd;")(); return [{ pass: fn(4) === "even", description: "4 is even", got: fn(4) }, { pass: fn(7) === "odd", description: "7 is odd", got: fn(7) }]; }';
    const results = await runJsTests(code, runner);
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.pass)).toBe(true);
  });
});

// ─── HTML Runner ───────────────────────────────────────────────────────────────

describe('htmlRunner', () => {
  const html = '<header><h1>My Page</h1></header><main><p>Content</p></main><footer><p>Footer</p></footer>';

  it('exists: finds elements that are present', () => {
    const results = runHtmlTests(html, [
      { query: 'header', assertion: 'exists', description: 'header exists' },
    ]);
    expect(results[0].pass).toBe(true);
  });

  it('exists: fails when element is missing', () => {
    const results = runHtmlTests(html, [
      { query: 'nav', assertion: 'exists', description: 'nav exists' },
    ]);
    expect(results[0].pass).toBe(false);
  });

  it('textContains: matches text content', () => {
    const results = runHtmlTests(html, [
      { query: 'h1', assertion: 'textContains', value: 'My Page', description: 'h1 text' },
    ]);
    expect(results[0].pass).toBe(true);
  });

  it('textContains: fails for wrong text', () => {
    const results = runHtmlTests(html, [
      { query: 'h1', assertion: 'textContains', value: 'Wrong', description: 'wrong text' },
    ]);
    expect(results[0].pass).toBe(false);
  });

  it('countAtLeast: counts elements', () => {
    const multiHtml = '<ul><li>A</li><li>B</li><li>C</li></ul>';
    const results = runHtmlTests(multiHtml, [
      { query: 'li', assertion: 'countAtLeast', value: 3, description: '3 list items' },
    ]);
    expect(results[0].pass).toBe(true);
  });

  it('countAtLeast: fails when count is too low', () => {
    const multiHtml = '<ul><li>A</li><li>B</li></ul>';
    const results = runHtmlTests(multiHtml, [
      { query: 'li', assertion: 'countAtLeast', value: 3, description: 'needs 3' },
    ]);
    expect(results[0].pass).toBe(false);
  });

  it('hasId: matches element id', () => {
    const formHtml = '<form id="login-form"><input id="username" /></form>';
    const results = runHtmlTests(formHtml, [
      { query: 'form', assertion: 'hasId', value: 'login-form', description: 'form has id' },
    ]);
    expect(results[0].pass).toBe(true);
  });

  it('sourceContains: finds text in source', () => {
    const results = runHtmlTests(html, [
      { query: 'html', assertion: 'sourceContains', value: '<header>', description: 'has header tag' },
    ]);
    expect(results[0].pass).toBe(true);
  });

  it('sourceMatch: regex matching', () => {
    const results = runHtmlTests(html, [
      { query: 'html', assertion: 'sourceMatch', value: '<h[1-6]', description: 'heading tag', flags: 'i' },
    ]);
    expect(results[0].pass).toBe(true);
  });
});
