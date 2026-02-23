import { TestResult, TestCase } from '../types';

/**
 * Run HTML exercise tests.
 * Creates a detached DOM from the student's HTML and runs assertions against it.
 */
export function runHtmlTests(htmlCode: string, testCases: TestCase[]): TestResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<!DOCTYPE html><html><body>${htmlCode}</body></html>`, 'text/html');

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

function evaluateHtmlAssertion(doc: Document, source: string, tc: TestCase): TestResult {
  const { assertion, value, description, flags } = tc;
  // Support both 'query' and 'selector' field names
  const query = tc.query ?? (tc as Record<string, unknown>).selector as string | undefined;

  switch (assertion) {
    case 'exists': {
      const el = query ? doc.querySelector(query) : null;
      return {
        pass: el !== null,
        description,
        got: el !== null ? 'found' : `no element matching "${query}"`,
      };
    }

    case 'textContains': {
      const el = query ? doc.querySelector(query) : null;
      const text = el?.textContent ?? '';
      const expected = String(value ?? '');
      return {
        pass: text.includes(expected),
        description,
        got: text.trim(),
      };
    }

    case 'countAtLeast': {
      const els = query ? doc.querySelectorAll(query) : [];
      const count = els.length;
      const min = Number(value ?? 1);
      return {
        pass: count >= min,
        description,
        got: `found ${count}`,
      };
    }

    case 'hasId': {
      const el = query ? doc.querySelector(query) : null;
      const actualId = el?.id ?? '';
      return {
        pass: actualId === String(value ?? ''),
        description,
        got: actualId || '(no id)',
      };
    }

    case 'hasClass': {
      const el = query ? doc.querySelector(query) : null;
      const hasIt = el?.classList.contains(String(value ?? '')) ?? false;
      return {
        pass: hasIt,
        description,
        got: hasIt ? 'has class' : `classes: ${el?.className ?? '(none)'}`,
      };
    }

    case 'sourceContains': {
      const needle = String(value ?? '');
      return {
        pass: source.includes(needle),
        description,
        got: source.includes(needle) ? 'found' : `"${needle}" not found in source`,
      };
    }

    case 'sourceMatch': {
      const pattern = String(value ?? '');
      let matched = false;
      try {
        const regex = new RegExp(pattern, flags ?? 'i');
        matched = regex.test(source);
      } catch {
        // Invalid regex — fall back to case-insensitive substring match
        matched = source.toLowerCase().includes(pattern.toLowerCase());
      }
      return {
        pass: matched,
        description,
        got: matched ? 'matched' : `pattern /${pattern}/${flags ?? 'i'} not found`,
      };
    }

    default:
      return { pass: false, description, got: `Unknown assertion: ${assertion}` };
  }
}
