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

export function useTestRunner(
  exercise: Exercise | undefined,
  code: string,
  cssCode: string,
  onTestsStart: () => void,
): {
  testResults: TestResult[];
  isRunning: boolean;
  duplicateWarning: boolean;
  runTests: () => Promise<void>;
  clearResults: () => void;
} {
  const dispatch = useAppDispatch();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  const runTests = useCallback(async () => {
    if (!exercise || isRunning) return;

    onTestsStart();
    setIsRunning(true);
    setTestResults([]);

    // Build the full code string for duplicate detection
    const fullCode = exercise.type === 'html-css' ? code + '\n' + cssCode : code;

    // Check for duplicate submission
    const isDuplicate = selectIsDuplicateCode(exercise.id, fullCode)({
      progress: store.getState().progress,
    });
    if (isDuplicate) {
      setDuplicateWarning(true);
      setTimeout(() => setDuplicateWarning(false), 3000);
    }

    // Clean up any previous iframe from CSS/HTML-CSS tests
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Increment server attempt counter (analytics)
    dispatch(incrementAttempt(exercise.id));

    let results: TestResult[] = [];

    try {
      // Route to correct runner by exercise type
      switch (exercise.type) {
        case 'js':
          results = await runJsTests(code, exercise.testRunner);
          break;

        case 'html':
          results = runHtmlTests(code, exercise.testCases ?? []);
          break;

        case 'css': {
          const cssResult = await runCssTests(cssCode, exercise.providedHtml ?? '', exercise.testCases ?? []);
          results = cssResult.results;
          cleanupRef.current = cssResult.cleanup;
          break;
        }

        case 'html-css': {
          const htmlCssResult = await runHtmlCssTests(code, cssCode, exercise.testCases ?? []);
          results = htmlCssResult.results;
          cleanupRef.current = htmlCssResult.cleanup;
          break;
        }
      }
    } catch (err) {
      results = [{
        pass: false,
        description: `Runner error: ${err instanceof Error ? err.message : String(err)}`,
        got: undefined,
      }];
    }

    setTestResults(results);
    setIsRunning(false);

    // Handle results
    const allPass = results.length > 0 && results.every((r) => r.pass);

    if (allPass) {
      const attempts = store.getState().progress.attempts[String(exercise.id)] ?? 0;
      const alreadyComplete = !!store.getState().progress.completedExercises[String(exercise.id)];

      dispatch(recordPassedAttempt({ exerciseId: exercise.id }));
      dispatch(markComplete({ exerciseId: exercise.id, attempts }));

      if (!alreadyComplete) {
        dispatch(showToast({ message: getRandomCelebration(), type: 'celebration' }));
      }
    } else if (!isDuplicate) {
      dispatch(recordFailedAttempt({ exerciseId: exercise.id, code: fullCode }));
    }

    // Delayed iframe cleanup for CSS/HTML-CSS tests
    if (cleanupRef.current) {
      const cleanup = cleanupRef.current;
      setTimeout(() => {
        cleanup();
        if (cleanupRef.current === cleanup) {
          cleanupRef.current = null;
        }
      }, 2000);
    }
  }, [exercise, code, cssCode, isRunning, dispatch, onTestsStart]);

  return { testResults, isRunning, duplicateWarning, runTests, clearResults };
}
