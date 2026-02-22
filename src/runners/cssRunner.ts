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

// The CSS runner requires an iframe because getComputedStyle() only works on elements that are part of a rendered document. The flow:

// 1. Create a hidden iframe sized at 800x600 (a consistent viewport for layout-dependent assertions).
// 2. Write the providedHtml + student's CSS as a <style> block into the iframe.
// 3. Wait one requestAnimationFrame for the browser to compute styles.
// 4. Run each test case, using getComputedStyle() to read the actual rendered values.
// 5. Return results and a cleanup function to remove the iframe.
// 6. The cleanup function is returned (not called immediately) because the UI might want to display a preview of the rendered output briefly before tearing it down. The useTestRunner hook calls cleanup after a 2-second delay.

// The evaluateCssAssertion function handles CSS-specific assertion types:

// Assertion	What it checks
// equals	getComputedStyle(el).getPropertyValue(property) === value
// oneOf	Computed value matches any entry in an array of acceptable values
// contains	Computed value includes the substring
// exists	Element matching query is found
// countAtLeast	At least value elements match query
// sourceContains	Raw CSS source includes the string
// sourceMatch	Raw CSS source matches the regex pattern

