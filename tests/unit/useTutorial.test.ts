import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTutorial, TUTORIAL_STEPS } from '../../src/hooks/useTutorial';

describe('useTutorial', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('starts inactive when tutorial has been seen', () => {
    localStorage.setItem('jsfun-tutorial-seen', 'true');
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.isActive).toBe(false);
  });

  it('becomes active on first visit after delay', () => {
    const { result } = renderHook(() => useTutorial());
    expect(result.current.isActive).toBe(false);
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.isActive).toBe(true);
  });

  it('starts at step 0', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.currentStep).toBe(0);
    expect(result.current.step).toEqual(TUTORIAL_STEPS[0]);
  });

  it('advances to next step', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    act(() => { result.current.next(); });
    expect(result.current.currentStep).toBe(1);
    expect(result.current.step).toEqual(TUTORIAL_STEPS[1]);
  });

  it('goes back to previous step', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    act(() => { result.current.next(); });
    act(() => { result.current.back(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('does not go below step 0', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    act(() => { result.current.back(); });
    expect(result.current.currentStep).toBe(0);
  });

  it('finishes after last step and marks as seen', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    // Advance through all steps
    for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
      act(() => { result.current.next(); });
    }
    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem('jsfun-tutorial-seen')).toBe('true');
  });

  it('skip closes tutorial and marks as seen', () => {
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    act(() => { result.current.skip(); });
    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem('jsfun-tutorial-seen')).toBe('true');
  });

  it('restart re-activates tutorial', () => {
    localStorage.setItem('jsfun-tutorial-seen', 'true');
    const { result } = renderHook(() => useTutorial());
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.isActive).toBe(false);
    act(() => { result.current.restart(); });
    expect(result.current.isActive).toBe(true);
    expect(result.current.currentStep).toBe(0);
  });

  it('exposes totalSteps matching TUTORIAL_STEPS length', () => {
    const { result } = renderHook(() => useTutorial());
    expect(result.current.totalSteps).toBe(TUTORIAL_STEPS.length);
  });

  it('step is null when inactive', () => {
    localStorage.setItem('jsfun-tutorial-seen', 'true');
    const { result } = renderHook(() => useTutorial());
    expect(result.current.step).toBeNull();
  });
});
