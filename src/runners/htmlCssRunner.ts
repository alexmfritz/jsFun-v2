import { TestResult, TestCase } from '../types';
import { runHtmlTests } from './htmlRunner';
import { runCssTests } from './cssRunner';

export async function runHtmlCssTests(
  htmlCode: string,
  cssCode: string,
  testCases: TestCase[]
): Promise<{ results: TestResult[]; cleanup: () => void }> {
  // Split test cases by type
  const sourceTests = testCases.filter((tc) =>
    ['sourceContains', 'sourceMatch'].includes(tc.assertion)
  );
  const domTests = testCases.filter((tc) =>
    ['exists', 'textContains', 'countAtLeast', 'hasId', 'hasClass'].includes(tc.assertion)
  );
  const styleTests = testCases.filter(
    (tc) => ['equals', 'oneOf', 'contains'].includes(tc.assertion) && tc.property
  );

  // Source checks run against combined HTML + CSS
  const combinedSource = htmlCode + '\n' + cssCode;
  const sourceResults = runHtmlTests(combinedSource, sourceTests);

  // DOM checks run against HTML only
  const domResults = runHtmlTests(htmlCode, domTests);

  // Style checks run in iframe with computed styles
  const { results: cssResults, cleanup } = await runCssTests(cssCode, htmlCode, styleTests);

  return {
    results: [...sourceResults, ...domResults, ...cssResults],
    cleanup,
  };
}

// The HTML+CSS runner is a coordinator. It splits test cases into three categories based on assertion type:

// 1. Source-level (sourceContains, sourceMatch) -- checked against the combined HTML+CSS source so patterns from either editor are found.
// 2. DOM-level (exists, textContains, etc.) -- checked against the HTML only via the HTML runner.
// 3. Style-level (equals, oneOf, contains with a property) -- checked in an iframe via the CSS runner.
// Results from all three are merged into a single array.