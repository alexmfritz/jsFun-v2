import { useState, useCallback, useRef } from 'react';
import { store, useAppDispatch } from '../../../features/store';
import {
  incrementAttempt,
  markComplete,
  recordFailedAttempt,
  recordPassedAttempt,
  selectIsDuplicateCode,
} from '../../../features/progressSlice';
import { runJsTests } from '../../../runners/jsRunner';
import { runHtmlTests } from '../../../runners/htmlRunner';
import { runCssTests } from '../../../runners/cssRunner';
import { runHtmlCssTests } from '../../../runners/htmlCssRunner';
import { showToast } from '../../../features/uiSlice';
import { getRandomCelebration } from '../../../utils/celebrationMessages';
import { Exercise, TestResult } from '../../../types';

interface UseTestRunnerResult {
  testResults: TestResult[];
  isRunning: boolean;
  duplicateWarning: boolean;
  runTests: () => Promise<void>;
  clearResults: () => void;
}

/**
 * Manages test execution for an exercise.
 * Handles duplicate detection, dispatching the correct runner by exercise type,
 * recording results, and marking completion.
 */
export function useTestRunner(
  exercise: Exercise | undefined,
  code: string,
  cssCode: string,
  onTestsStart: () => void,
): UseTestRunnerResult {
  const dispatch = useAppDispatch();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  const runTests = useCallback(async () => {
    if (!exercise) return;

    // Build the full code string for hashing (combine for HTML+CSS)
    const fullCode = exercise.type === 'html-css' ? code + '\n' + cssCode : code;

    // Check for duplicate submission — don't count as a new attempt
    const isDuplicate = selectIsDuplicateCode(exercise.id, fullCode)({
      progress: store.getState().progress,
    });
    if (isDuplicate) {
      setDuplicateWarning(true);
      setTimeout(() => setDuplicateWarning(false), 3000);
    } else {
      setDuplicateWarning(false);
    }

    // Clean up previous iframe if any
    cleanupRef.current?.();

    setIsRunning(true);
    onTestsStart();

    // Always increment server-side attempt (for analytics), but unique attempt
    // tracking is separate (client-side, used for hint gating)
    await dispatch(incrementAttempt(exercise.id));

    let results: TestResult[] = [];

    try {
      if (exercise.type === 'js') {
        results = await runJsTests(code, exercise.testRunner);
      } else if (exercise.type === 'html') {
        results = runHtmlTests(code, exercise.testCases ?? []);
      } else if (exercise.type === 'css') {
        const { results: r, cleanup } = await runCssTests(
          code,
          exercise.providedHtml ?? '',
          exercise.testCases ?? []
        );
        results = r;
        cleanupRef.current = cleanup;
        setTimeout(() => cleanup(), 2000);
      } else if (exercise.type === 'html-css') {
        const { results: r, cleanup } = await runHtmlCssTests(
          code,
          cssCode,
          exercise.testCases ?? []
        );
        results = r;
        cleanupRef.current = cleanup;
        setTimeout(() => cleanup(), 2000);
      }
    } catch (err) {
      results = [
        {
          pass: false,
          description: `Test error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ];
    }

    setTestResults(results);
    setIsRunning(false);

    const allPass = results.length > 0 && results.every((r) => r.pass);
    if (allPass) {
      const wasAlreadyComplete = !!store.getState().progress.completedExercises[String(exercise.id)];
      dispatch(recordPassedAttempt({ exerciseId: exercise.id }));
      void dispatch(markComplete({ exerciseId: exercise.id, attempts: 0 }));
      if (!wasAlreadyComplete) {
        dispatch(showToast({ message: getRandomCelebration(), type: 'celebration' }));
      }
    } else if (!isDuplicate) {
      // Only record as a unique failed attempt if code is new
      dispatch(recordFailedAttempt({ exerciseId: exercise.id, code: fullCode }));
    }
  }, [exercise, code, cssCode, dispatch, onTestsStart]);

  return { testResults, isRunning, duplicateWarning, runTests, clearResults };
}
