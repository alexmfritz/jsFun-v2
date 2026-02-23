import { useState, useCallback, useEffect } from 'react';

export interface TutorialState {
  active: boolean;
  step: number;
  totalSteps: number;
  start: () => void;
  restart: () => void;
  next: () => void;
  prev: () => void;
  dismiss: () => void;
}

const STORAGE_KEY = 'jsfun-tutorial-complete';
const TOTAL_STEPS = 9;

export function useTutorial(): TutorialState {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  // Auto-show on first visit after a short delay
  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done) {
        const timer = setTimeout(() => setActive(true), 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const restart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    setStep((s) => {
      if (s >= TOTAL_STEPS - 1) {
        setActive(false);
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // ignore
        }
        return 0;
      }
      return s + 1;
    });
  }, []);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  return { active, step, totalSteps: TOTAL_STEPS, start, restart, next, prev, dismiss };
}
