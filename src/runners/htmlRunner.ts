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

// The HTML runner is the simplest runner. 
// DOMParser parses the student's HTML into a Document object, and each test case is evaluated against it. 
// No iframe is needed -- DOMParser runs synchronously in the main thread.

// Assertion	What it checks
// exists	doc.querySelector(query) !== null
// textContains	element.textContent.includes(value)
// countAtLeast	doc.querySelectorAll(query).length >= value
// hasId	element.id === value
// hasClass	element.classList.contains(value)
// sourceContains	htmlSource.includes(value) -- checks raw source, not parsed DOM
// sourceMatch	new RegExp(value, flags).test(htmlSource)

// The sourceContains and sourceMatch assertions are important: 
// they check the raw HTML string, not the parsed DOM. 
// This lets you assert things like "the source code uses a <main> tag" even if the browser's parser would normalize the markup.


