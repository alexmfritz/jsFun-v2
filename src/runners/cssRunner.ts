import { TestResult, TestCase } from '../types';

/**
 * Run CSS exercise tests.
 * Injects provided HTML + student CSS into a hidden iframe, then checks computed styles.
 * Returns a cleanup function to remove the iframe.
 */
export function runCssTests(
  cssCode: string,
  providedHtml: string,
  testCases: TestCase[]
): Promise<{ results: TestResult[]; cleanup: () => void }> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:800px;height:600px;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${providedHtml}</body></html>`);
    doc.close();

    // Wait for styles to apply
    requestAnimationFrame(() => {
      const results = testCases.map((tc): TestResult => {
        try {
          return evaluateCssAssertion(doc, cssCode, tc);
        } catch (err) {
          return {
            pass: false,
            description: tc.description,
            got: `Error: ${err instanceof Error ? err.message : String(err)}`,
          };
        }
      });

      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      resolve({ results, cleanup });
    });
  });
}

function evaluateCssAssertion(doc: Document, source: string, tc: TestCase): TestResult {
  const { assertion, property, value, description } = tc;
  // Support both 'query' and 'selector' field names
  const query = tc.query ?? (tc as Record<string, unknown>).selector as string | undefined;

  // Source-level assertions don't need a DOM element
  if (assertion === 'sourceContains') {
    const needle = String(value ?? '');
    const found = source.includes(needle);
    return {
      pass: found,
      description,
      got: found ? 'found' : `"${needle}" not found in source`,
    };
  }

  if (assertion === 'sourceMatch') {
    const pattern = String(value ?? '');
    let matched = false;
    try {
      const regex = new RegExp(pattern, tc.flags ?? 'i');
      matched = regex.test(source);
    } catch {
      // Invalid regex — fall back to case-insensitive substring match
      matched = source.toLowerCase().includes(pattern.toLowerCase());
    }
    return {
      pass: matched,
      description,
      got: matched ? 'matched' : `pattern /${pattern}/${tc.flags ?? 'i'} not found`,
    };
  }

  const el = query ? doc.querySelector(query) : null;

  if (!el) {
    return { pass: false, description, got: `element "${query}" not found` };
  }

  const computed = doc.defaultView?.getComputedStyle(el);
  if (!computed) {
    return { pass: false, description, got: 'Could not compute styles' };
  }

  switch (assertion) {
    case 'equals': {
      const actual = computed.getPropertyValue(property ?? '').trim();
      const expected = String(value ?? '');
      return { pass: actual === expected, description, got: actual };
    }

    case 'oneOf': {
      const actual = computed.getPropertyValue(property ?? '').trim();
      const options = Array.isArray(value) ? value.map(String) : [String(value ?? '')];
      return {
        pass: options.includes(actual),
        description,
        got: actual,
      };
    }

    case 'contains': {
      const actual = computed.getPropertyValue(property ?? '').trim();
      const needle = String(value ?? '');
      return {
        pass: actual.includes(needle),
        description,
        got: actual,
      };
    }

    case 'exists':
      return { pass: el !== null, description, got: el !== null ? 'found' : 'not found' };

    case 'countAtLeast': {
      const els = query ? doc.querySelectorAll(query) : [];
      const count = els.length;
      const min = Number(value ?? 1);
      return { pass: count >= min, description, got: `found ${count}` };
    }

    default:
      return { pass: false, description, got: `Unknown CSS assertion: ${assertion}` };
  }
}
