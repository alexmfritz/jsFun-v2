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

  // ...
}

const isDuplicate = selectIsDuplicateCode(exercise.id, fullCode)({
  progress: store.getState().progress,
});
if (isDuplicate) {
  setDuplicateWarning(true);
  setTimeout(() => setDuplicateWarning(false), 3000);
}