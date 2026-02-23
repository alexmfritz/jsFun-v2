import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'jsfun-tutorial-seen';

export interface TutorialStep {
  target: string;
  title: string;
  body: string;
  placement: 'bottom' | 'top' | 'right' | 'left';
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: '[data-tutorial="logo"]',
    title: 'Welcome to jsFun!',
    body: 'This is your coding practice platform for learning JavaScript, HTML, and CSS. Let\u2019s take a quick tour.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="search"]',
    title: 'Search & Filters',
    body: 'Use the search bar to find exercises by name or tag. Click Filters to narrow by tier or tag.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="random"]',
    title: 'Feeling Lucky?',
    body: 'Click Random to jump to a random unsolved exercise. Great when you\u2019re not sure what to work on next.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="topics"]',
    title: 'Topics',
    body: 'Start here! Each card is a topic area. Click one to see exercises in that category.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="collections"]',
    title: 'Collections',
    body: 'Collections group exercises by theme or skill. The "In Progress" collection tracks exercises you\u2019ve started.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="cards"]',
    title: 'Exercise Cards',
    body: 'Each card is an exercise. The Roman numeral shows difficulty \u2014 Tier I (easiest) through Tier V (hardest). Click a card to start coding!',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="progress"]',
    title: 'Your Progress',
    body: 'This bar tracks how many exercises you\u2019ve completed. Check the Dashboard for detailed stats.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="help"]',
    title: 'Need Help?',
    body: 'Click this button anytime to open the help guide with shortcuts, tips, and tier info.',
    placement: 'bottom',
  },
  {
    target: '[data-tutorial="theme"]',
    title: 'Theme Toggle',
    body: 'Switch between dark, light, and high-contrast themes. Pick whichever is easiest on your eyes. You\u2019re all set \u2014 go pick a topic, choose an exercise, and press Ctrl+Enter to run tests. Good luck!',
    placement: 'bottom',
  },
];

function hasSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}

function clearSeen(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface UseTutorialResult {
  isActive: boolean;
  currentStep: number;
  step: TutorialStep | null;
  totalSteps: number;
  next: () => void;
  back: () => void;
  skip: () => void;
  restart: () => void;
}

export function useTutorial(): UseTutorialResult {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Show tutorial on first mount if not seen before
  useEffect(() => {
    if (!hasSeen()) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setIsActive(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const finish = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    markSeen();
  }, []);

  const next = useCallback(() => {
    if (currentStep >= TUTORIAL_STEPS.length - 1) {
      finish();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, finish]);

  const back = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const restart = useCallback(() => {
    clearSeen();
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  return {
    isActive,
    currentStep,
    step: isActive ? TUTORIAL_STEPS[currentStep] : null,
    totalSteps: TUTORIAL_STEPS.length,
    next,
    back,
    skip,
    restart,
  };
}
