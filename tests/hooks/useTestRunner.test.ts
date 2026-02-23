import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createElement } from 'react';
import { useTestRunner } from '../../src/components/exercise/hooks/useTestRunner';
import { createTestStore, makeExercise } from '../helpers/renderWithProviders';
import type { Exercise, TestResult } from '../../src/types';

// Mock all runners
vi.mock('../../src/runners/jsRunner', () => ({
  runJsTests: vi.fn(),
}));
vi.mock('../../src/runners/htmlRunner', () => ({
  runHtmlTests: vi.fn(),
}));
vi.mock('../../src/runners/cssRunner', () => ({
  runCssTests: vi.fn(),
}));
vi.mock('../../src/runners/htmlCssRunner', () => ({
  runHtmlCssTests: vi.fn(),
}));

// Mock fetch for async thunks (incrementAttempt, markComplete)
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { runJsTests } from '../../src/runners/jsRunner';
import { runHtmlTests } from '../../src/runners/htmlRunner';
import { runCssTests } from '../../src/runners/cssRunner';
import { runHtmlCssTests } from '../../src/runners/htmlCssRunner';

function renderTestRunnerHook(exercise: Exercise | undefined, code = '', cssCode = '') {
  const store = createTestStore({
    exercises: { exercises: exercise ? [exercise] : [] },
  });
  const onTestsStart = vi.fn();
  const result = renderHook(() => useTestRunner(exercise, code, cssCode, onTestsStart), {
    wrapper: ({ children }) => createElement(Provider, { store }, children),
  });
  return { ...result, store, onTestsStart };
}

describe('useTestRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  });

  it('starts with empty results and not running', () => {
    const exercise = makeExercise();
    const { result } = renderTestRunnerHook(exercise);
    expect(result.current.testResults).toEqual([]);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.duplicateWarning).toBe(false);
  });

  it('does nothing if exercise is undefined', async () => {
    const { result } = renderTestRunnerHook(undefined);
    await act(async () => {
      await result.current.runTests();
    });
    expect(result.current.testResults).toEqual([]);
    expect(result.current.isRunning).toBe(false);
  });

  it('runs JS tests for JS exercises', async () => {
    const exercise = makeExercise({ type: 'js' });
    const passing: TestResult[] = [{ pass: true, description: 'it works' }];
    vi.mocked(runJsTests).mockResolvedValue(passing);

    const { result, onTestsStart } = renderTestRunnerHook(exercise, 'const x = 1;');

    await act(async () => {
      await result.current.runTests();
    });

    expect(runJsTests).toHaveBeenCalledWith('const x = 1;', exercise.testRunner);
    expect(onTestsStart).toHaveBeenCalledOnce();
    expect(result.current.testResults).toEqual(passing);
    expect(result.current.isRunning).toBe(false);
  });

  it('runs HTML tests for HTML exercises', async () => {
    const exercise = makeExercise({
      type: 'html',
      testCases: [{ assertion: 'exists', query: 'h1', description: 'has h1' }],
    });
    const passing: TestResult[] = [{ pass: true, description: 'has h1' }];
    vi.mocked(runHtmlTests).mockReturnValue(passing);

    const { result } = renderTestRunnerHook(exercise, '<h1>Hello</h1>');

    await act(async () => {
      await result.current.runTests();
    });

    expect(runHtmlTests).toHaveBeenCalledWith('<h1>Hello</h1>', exercise.testCases);
    expect(result.current.testResults).toEqual(passing);
  });

  it('runs CSS tests for CSS exercises', async () => {
    const exercise = makeExercise({
      type: 'css',
      providedHtml: '<div class="box"></div>',
      testCases: [{ assertion: 'exists', query: '.box', description: 'has box' }],
    });
    const cleanup = vi.fn();
    const passing: TestResult[] = [{ pass: true, description: 'has box' }];
    vi.mocked(runCssTests).mockResolvedValue({ results: passing, cleanup });

    const { result } = renderTestRunnerHook(exercise, '.box { color: red; }');

    await act(async () => {
      await result.current.runTests();
    });

    expect(runCssTests).toHaveBeenCalledWith(
      '.box { color: red; }',
      '<div class="box"></div>',
      exercise.testCases,
    );
    expect(result.current.testResults).toEqual(passing);
  });

  it('runs HTML+CSS tests for html-css exercises', async () => {
    const exercise = makeExercise({
      type: 'html-css',
      testCases: [{ assertion: 'exists', query: '.card', description: 'has card' }],
    });
    const cleanup = vi.fn();
    const passing: TestResult[] = [{ pass: true, description: 'has card' }];
    vi.mocked(runHtmlCssTests).mockResolvedValue({ results: passing, cleanup });

    const { result } = renderTestRunnerHook(exercise, '<div class="card"></div>', '.card { padding: 8px; }');

    await act(async () => {
      await result.current.runTests();
    });

    expect(runHtmlCssTests).toHaveBeenCalledWith(
      '<div class="card"></div>',
      '.card { padding: 8px; }',
      exercise.testCases,
    );
  });

  it('handles test runner errors gracefully', async () => {
    const exercise = makeExercise({ type: 'js' });
    vi.mocked(runJsTests).mockRejectedValue(new Error('Syntax error'));

    const { result } = renderTestRunnerHook(exercise, 'bad code');

    await act(async () => {
      await result.current.runTests();
    });

    expect(result.current.testResults).toHaveLength(1);
    expect(result.current.testResults[0].pass).toBe(false);
    expect(result.current.testResults[0].description).toContain('Syntax error');
    expect(result.current.isRunning).toBe(false);
  });

  it('clearResults empties the test results', async () => {
    const exercise = makeExercise({ type: 'js' });
    const passing: TestResult[] = [{ pass: true, description: 'ok' }];
    vi.mocked(runJsTests).mockResolvedValue(passing);

    const { result } = renderTestRunnerHook(exercise, 'code');

    await act(async () => {
      await result.current.runTests();
    });
    expect(result.current.testResults).toHaveLength(1);

    act(() => {
      result.current.clearResults();
    });
    expect(result.current.testResults).toEqual([]);
  });

  it('calls onTestsStart when tests begin', async () => {
    const exercise = makeExercise({ type: 'js' });
    vi.mocked(runJsTests).mockResolvedValue([]);

    const { result, onTestsStart } = renderTestRunnerHook(exercise, 'code');

    await act(async () => {
      await result.current.runTests();
    });

    expect(onTestsStart).toHaveBeenCalledOnce();
  });
});
