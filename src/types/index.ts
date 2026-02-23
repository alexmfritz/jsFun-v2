/**
 * Core type definitions for jsFun
 */

// ─── Exercise Types ────────────────────────────────────────────────────────────

export type ExerciseType = 'js' | 'html' | 'css' | 'html-css';
export type Tier = 1 | 2 | 3 | 4 | 5;

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
  /** Progressive hints — up to 3, unlocked incrementally as unique attempts increase */
  hints?: string[];
  resources: Resource[];
  /** Override default attempt threshold before solution unlocks */
  solutionGate?: number;
}

// ─── Category / Collection ──────────────────────────────────────────────────

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
  /** Hide from student-facing browse UI (internal/instructor groupings) */
  hidden?: boolean;
  /** Source attribution (e.g. "Rithm School", "Turing School") */
  source?: string;
  /** SPDX license identifier (e.g. "MIT") */
  license?: string;
  /** Full attribution text shown in the collection banner */
  attribution?: string;
}

export interface ExercisesData {
  categories: Record<string, Category>;
  collections: Collection[];
  exercises: Exercise[];
}

// ─── Progress ──────────────────────────────────────────────────────────────────

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

// ─── Test Results ──────────────────────────────────────────────────────────────

export interface TestResult {
  pass: boolean;
  description: string;
  got?: unknown;
}

// ─── Redux State ───────────────────────────────────────────────────────────────

export interface ExercisesState {
  exercises: Exercise[];
  categories: Record<string, Category>;
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  studentName: string;
  completedExercises: Record<string, CompletedExercise>;
  savedSolutions: Record<string, string>;
  attempts: Record<string, number>;
  /** Client-side only: count of unique (non-duplicate) code submissions per exercise */
  uniqueAttempts: Record<string, number>;
  /** Client-side only: set of hashed code strings that failed tests, per exercise */
  failedCodeHashes: Record<string, string[]>;
  createdAt: string;
  lastUpdated?: string;
  loading: boolean;
  error: string | null;
}

export type Theme = 'dark' | 'light' | 'high-contrast';

export type StatusSort = 'default' | 'in-progress-first' | 'not-started-first' | 'completed-first';

export interface Toast {
  message: string;
  type: 'error' | 'success' | 'warning' | 'celebration';
}

export interface UiState {
  theme: Theme;
  browseFilter: {
    search: string;
    tags: string[];
    tier: Tier | null;
    collectionId: string | null;
    categoryPath: string[];
  };
  activeView: 'browse' | 'exercise' | 'dashboard' | 'admin';
  toast: Toast | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  showHelpModal: boolean;
  statusSort: StatusSort;
  serverReachable: boolean;
}

export interface AdminState {
  isAuthenticated: boolean;
  error: string | null;
}

// ─── API Response Types ─────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Tier Metadata ──────────────────────────────────────────────────────────────

export const TIER_META: Record<
  Tier,
  { name: string; label: string; color: string; bgColor: string; borderColor: string }
> = {
  1: {
    name: 'Spark',
    label: 'I',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
  },
  2: {
    name: 'Foundations',
    label: 'II',
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.15)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
  },
  3: {
    name: 'Builder',
    label: 'III',
    color: '#818cf8',
    bgColor: 'rgba(129, 140, 248, 0.15)',
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
  4: {
    name: 'Architect',
    label: 'IV',
    color: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.15)',
    borderColor: 'rgba(192, 132, 252, 0.4)',
  },
  5: {
    name: 'Mastercraft',
    label: 'V',
    color: '#f472b6',
    bgColor: 'rgba(244, 114, 182, 0.15)',
    borderColor: 'rgba(244, 114, 182, 0.4)',
  },
};

export const TYPE_META: Record<ExerciseType, { label: string; color: string }> = {
  js: { label: 'JS', color: '#facc15' },
  html: { label: 'HTML', color: '#f472b6' },
  css: { label: 'CSS', color: '#22d3ee' },
  'html-css': { label: 'HTML+CSS', color: '#a78bfa' },
};

/** Unique attempts needed to unlock each progressive hint */
export const HINT_GATES = [3, 6, 9] as const;

/**
 * Resolve progressive hints from an exercise, supporting both legacy `hint`
 * (single string) and new `hints` (array) formats.
 * Returns an array of 0-3 hint strings.
 */
export function getHints(exercise: Exercise): string[] {
  if (exercise.hints && exercise.hints.length > 0) {
    return exercise.hints.slice(0, 3);
  }
  if (exercise.hint) {
    return [exercise.hint];
  }
  return [];
}
/** Unique attempts needed to unlock the solution */
export const DEFAULT_SOLUTION_GATE = 10;
