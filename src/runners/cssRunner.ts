import { TestResult, TestCase } from '../types';

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
          return { pass: false, description: tc.description, got: `Error: ${err instanceof Error ? err.message : String(err)}` };
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

function evaluateCssAssertion(doc: Document, cssSource: string, tc: TestCase): TestResult {
  switch (tc.assertion) {
    case 'equals': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      const computed = doc.defaultView!.getComputedStyle(el).getPropertyValue(tc.property ?? '');
      const expected = String(tc.value);
      return {
        pass: computed === expected,
        description: tc.description,
        got: computed,
      };
    }

    case 'oneOf': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      const computed = doc.defaultView!.getComputedStyle(el).getPropertyValue(tc.property ?? '');
      const acceptable = Array.isArray(tc.value) ? tc.value : [String(tc.value)];
      return {
        pass: acceptable.includes(computed),
        description: tc.description,
        got: computed,
      };
    }

    case 'contains': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      if (!el) {
        return { pass: false, description: tc.description, got: `element "${tc.query}" not found` };
      }
      const computed = doc.defaultView!.getComputedStyle(el).getPropertyValue(tc.property ?? '');
      const value = String(tc.value);
      return {
        pass: computed.includes(value),
        description: tc.description,
        got: computed,
      };
    }

    case 'exists': {
      const el = tc.query ? doc.querySelector(tc.query) : null;
      return {
        pass: el !== null,
        description: tc.description,
        got: el !== null ? 'found' : 'not found',
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

    case 'sourceContains': {
      const value = String(tc.value);
      return {
        pass: cssSource.includes(value),
        description: tc.description,
        got: cssSource.includes(value) ? 'found in source' : 'not found in source',
      };
    }

    case 'sourceMatch': {
      const regex = new RegExp(String(tc.value), tc.flags ?? '');
      const match = regex.test(cssSource);
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
