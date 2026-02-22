export type ExerciseType = 'js' | 'html' | 'css' | 'html-css';
export type Tier = 1 | 2 | 3 | 4 | 5;

// The ExerciseType union constrains exercises to four formats. Each format has a different execution strategy:
// js: Student code is executed in a Web Worker. The testRunner field contains an arrow function string that evaluates the student's code and returns test results. 
// Web Workers provide sandboxing -- a student's infinite loop will not freeze the UI.
// html: Student code is injected into a sandboxed <iframe>. Test cases query the DOM inside the iframe.
// css: The platform provides fixed HTML (providedHtml), and the student writes CSS. Test cases check computed styles via getComputedStyle().
// html-css: Combined format -- students write both HTML and CSS. Both DOM assertions and style assertions apply.

// The Tier type is a numeric union, not an enum, because tiers are ordered (Tier 1 is easier than Tier 5) and we use them in numeric comparisons for filtering.

export interface TestCase {
  /** CSS selector for DOM queries */
  query?: string;
  /** Assertion type */
  assertion:
    | 'exists'
    | 'textContains'
    | 'countAtLeast'
    | 'equals'
    | 'oneOf'
    | 'sourceContains'
    | 'sourceMatch'
    | 'hasId'
    | 'hasClass';
  /** CSS property name for computed style assertions */
  property?: string;
  /** Expected value */
  value?: string | number | string[];
  /** Human-readable test description shown to student */
  description: string;
  /** Regex flags for sourceMatch */
  flags?: string;
}

// Test cases are JSON-serializable assertion objects, not executable code. 
// This is a deliberate design choice: test logic for HTML/CSS exercises lives in structured data rather than JavaScript strings, 
// which makes them easier to author, validate, and display.

// The assertion field determines how the test runner evaluates the result:

// Assertion	What it checks
// exists	Element matching query exists in the DOM
// textContains	Element's textContent includes value
// countAtLeast	At least value elements match query
// equals	Computed style property equals value
// oneOf	Computed style property matches any item in value array
// sourceContains	Raw HTML source includes value string
// sourceMatch	Raw HTML source matches regex value with flags
// hasId	Element with the given ID exists
// hasClass	Element matching query has class value

export interface Resource {
  label: string;
  url: string;
  description?: string;
}

export interface Exercise {
  id: number;
  title: string;
  type: ExerciseType;
  tier: Tier;
  /** Hierarchical path: ["js-fundamentals", "operators", "arithmetic"] */
  category: string[];
  tags: string[];
  /** One-liner shown on browse cards */
  description: string;
  /** Full problem statement shown in exercise panel */
  instructions: string;
  /** Template code (empty string for Tier V) */
  starterCode: string;
  /** Reference solution */
  solution: string;
  /** JS exercises: function-as-string. HTML/CSS: empty string (use testCases) */
  testRunner: string;
  /** HTML/CSS assertion objects */
  testCases?: TestCase[];
  /** CSS exercises: the HTML structure to apply styles to */
  providedHtml?: string;
  /** @deprecated Use `hints` array instead. Kept for backward compatibility. */
  hint?: string;
  /** Progressive hints -- up to 3, unlocked incrementally */
  hints?: string[];
  resources: Resource[];
  /** Override default attempt threshold before solution unlocks */
  solutionGate?: number;
}

// Each exercise is a self-contained JSON object. There is no separate "test file" or "solution file" -- everything lives in one structure. This simplifies the authoring workflow for teachers who may not be comfortable with complex file hierarchies.

// The category field is an array representing a hierarchical path. ["js-fundamentals", "operators", "arithmetic"] means this exercise lives under JS Fundamentals > Operators > Arithmetic. The browse UI uses this for drill-down navigation.

// The starterCode field varies by tier:

// Tier	starterCode Example
// 1 (Spark)	Full function body with // YOUR CODE HERE markers
// 2 (Foundations)	function add(a, b) {\n  \n} -- signature only
// 3 (Builder)	Partial implementation with structural hints
// 4 (Architect)	// Step 1: Parse the input\n// Step 2: Transform\n// Step 3: Return
// 5 (Mastercraft)	"" (empty string -- blank editor)

export interface Category {
  label: string;
  icon?: string;
  color?: string;
  children?: Record<string, Category>;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  exerciseIds: number[];
  isDefault?: boolean;
  color?: string;
  /** Hide from student-facing browse UI */
  hidden?: boolean;
  /** Source attribution */
  source?: string;
  /** SPDX license identifier */
  license?: string;
  /** Full attribution text shown in the collection banner */
  attribution?: string;
}

export interface ExercisesData {
  categories: Record<string, Category>;
  collections: Collection[];
  exercises: Exercise[];
}

// ExercisesData is the shape of the /api/exercises response. 
// It contains everything the frontend needs in a single request -- no pagination, no lazy loading. 
// With a few hundred exercises totaling a few hundred KB of JSON, there is no performance reason to complicate the data fetching.

export interface CompletedExercise {
  completedAt: string;
  attempts: number;
}

export interface Progress {
  studentName: string;
  completedExercises: Record<string, CompletedExercise>;
  savedSolutions: Record<string, string>;
  attempts: Record<string, number>;
  createdAt: string;
  lastUpdated?: string;
}

// Progress is stored as a flat JSON file. Keys are exercise IDs (as strings, since JSON object keys must be strings). 
// savedSolutions maps exercise IDs to the student's last saved code, enabling auto-save that persists across browser sessions.

export interface TestResult {
  pass: boolean;
  description: string;
  got?: unknown;
}

// Every test runner (JS Worker, HTML/CSS iframe) returns an array of TestResult objects. 
// The got field is optional -- when a test fails, it shows the student what their code actually produced versus what was expected. 
// The description is the human-readable assertion ("should return 42 when given 6 and 7").

