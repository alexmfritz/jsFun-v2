import { TestResult, TestCase } from '../types';

export function runHtmlTests(htmlCode: string, testCases: TestCase[]): TestResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<!DOCTYPE html><html><body>${htmlCode}</body></html>`, 'text/html'
  );

  return testCases.map((tc): TestResult => {
    try {
      return evaluateHtmlAssertion(doc, htmlCode, tc);
    } catch (err) {
      return {
        pass: false,
        description: tc.description,
        got: `Error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  });
}

function evaluateHtmlAssertion(doc: Document, htmlSource: string, tc: TestCase): TestResult {
  switch (tc.assertion) {
    case 'exists': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      return {
        pass: el !== null,
        description: tc.description,
        got: el !== null ? 'found' : 'not found',
      };
    }

    case 'textContains': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      const text = el.textContent ?? '';
      const value = String(tc.value);
      return {
        pass: text.includes(value),
        description: tc.description,
        got: text,
      };
    }

    case 'countAtLeast': {
      const els = tc.query ? doc.querySelectorAll(tc.query) : [];
      const expected = Number(tc.value);
      return {
        pass: els.length >= expected,
        description: tc.description,
        got: els.length,
      };
    }

    case 'hasId': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      return {
        pass: el.id === String(tc.value),
        description: tc.description,
        got: el.id || '(no id)',
      };
    }

    case 'hasClass': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      const value = String(tc.value);
      return {
        pass: el.classList.contains(value),
        description: tc.description,
        got: el.className || '(no classes)',
      };
    }

    case 'sourceContains': {
      const value = String(tc.value);
      return {
        pass: htmlSource.includes(value),
        description: tc.description,
        got: htmlSource.includes(value) ? 'found in source' : 'not found in source',
      };
    }

    case 'sourceMatch': {
      const regex = new RegExp(String(tc.value), tc.flags ?? '');
      const match = regex.test(htmlSource);
      return {
        pass: match,
        description: tc.description,
        got: match ? 'pattern matched' : 'pattern not matched',
      };
    }

    default:
      return { pass: false, description: tc.description, got: `Unknown assertion: ${tc.assertion}` };
  }
}
