export type ExerciseType = 'js' | 'html' | 'css' | 'html-css';
export type Tier = 1 | 2 | 3 | 4 | 5;

// The ExerciseType union constrains exercises to four formats. Each format has a different execution strategy:
// js: Student code is executed in a Web Worker. The testRunner field contains an arrow function string that evaluates the student's code and returns test results. Web Workers provide sandboxing -- a student's infinite loop will not freeze the UI.
// html: Student code is injected into a sandboxed <iframe>. Test cases query the DOM inside the iframe.
// css: The platform provides fixed HTML (providedHtml), and the student writes CSS. Test cases check computed styles via getComputedStyle().
// html-css: Combined format -- students write both HTML and CSS. Both DOM assertions and style assertions apply.

// The Tier type is a numeric union, not an enum, because tiers are ordered (Tier 1 is easier than Tier 5) and we use them in numeric comparisons for filtering.

