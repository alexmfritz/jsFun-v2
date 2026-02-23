import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseToolbar from '../../src/components/exercise/ExerciseToolbar';
import { makeExercise, renderWithProviders } from '../helpers/renderWithProviders';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderToolbar(overrides: Partial<Parameters<typeof ExerciseToolbar>[0]> = {}) {
  const defaults = {
    exercise: makeExercise({ id: 5, title: 'Sum Array' }),
    prevExercise: makeExercise({ id: 4, title: 'Prev Ex' }),
    nextExercise: makeExercise({ id: 6, title: 'Next Ex' }),
    currentIndex: 2,
    totalCount: 10,
    navContext: null,
    isRunning: false,
    duplicateWarning: false,
    canReset: false,
    onReset: vi.fn(),
    onRunTests: vi.fn(),
    ...overrides,
  };

  return renderWithProviders(<ExerciseToolbar {...defaults} />);
}

describe('ExerciseToolbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the exercise title', () => {
    renderToolbar();
    expect(screen.getByText('Sum Array')).toBeTruthy();
  });

  it('shows current position in exercise list', () => {
    renderToolbar({ currentIndex: 2, totalCount: 10 });
    expect(screen.getByText('3/10')).toBeTruthy();
  });

  it('navigates to previous exercise when Prev is clicked', async () => {
    const prev = makeExercise({ id: 4, title: 'Prev Ex' });
    renderToolbar({ prevExercise: prev });
    const user = userEvent.setup();

    const prevBtn = screen.getByText('‹ Prev');
    await user.click(prevBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/exercises/4');
  });

  it('navigates to next exercise when Next is clicked', async () => {
    const next = makeExercise({ id: 6, title: 'Next Ex' });
    renderToolbar({ nextExercise: next });
    const user = userEvent.setup();

    const nextBtn = screen.getByText('Next ›');
    await user.click(nextBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/exercises/6');
  });

  it('disables Prev button when no previous exercise', () => {
    renderToolbar({ prevExercise: null });
    const prevBtn = screen.getByText('‹ Prev');
    expect(prevBtn).toBeDisabled();
  });

  it('disables Next button when no next exercise', () => {
    renderToolbar({ nextExercise: null });
    const nextBtn = screen.getByText('Next ›');
    expect(nextBtn).toBeDisabled();
  });

  it('navigates back to browse on Back click', async () => {
    renderToolbar();
    const user = userEvent.setup();
    const backBtn = screen.getByText('← Back');
    await user.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
  });

  it('shows navContext badge when provided', () => {
    renderToolbar({ navContext: 'Fundamentals' });
    expect(screen.getByText('Fundamentals')).toBeTruthy();
  });

  it('does not show navContext badge when null', () => {
    renderToolbar({ navContext: null });
    expect(screen.queryByText('Fundamentals')).toBeNull();
  });

  it('shows Run Tests button', () => {
    renderToolbar();
    expect(screen.getByText('▶ Run Tests')).toBeTruthy();
  });

  it('calls onRunTests when Run Tests button is clicked', async () => {
    const onRunTests = vi.fn();
    renderToolbar({ onRunTests });
    const user = userEvent.setup();

    await user.click(screen.getByText('▶ Run Tests'));
    expect(onRunTests).toHaveBeenCalledOnce();
  });

  it('shows "Running…" and disables button when isRunning is true', () => {
    renderToolbar({ isRunning: true });
    const btn = screen.getByText('Running…');
    expect(btn).toBeTruthy();
    expect(btn.closest('button')).toBeDisabled();
  });

  it('shows duplicate warning when duplicateWarning is true', () => {
    renderToolbar({ duplicateWarning: true });
    expect(screen.getByText('Same code — try a different approach')).toBeTruthy();
  });

  it('does not show duplicate warning when false', () => {
    renderToolbar({ duplicateWarning: false });
    expect(screen.queryByText('Same code — try a different approach')).toBeNull();
  });

  it('shows Reset button when canReset is true', () => {
    renderToolbar({ canReset: true });
    expect(screen.getByText('Reset')).toBeTruthy();
  });

  it('hides Reset button when canReset is false', () => {
    renderToolbar({ canReset: false });
    expect(screen.queryByText('Reset')).toBeNull();
  });

  it('calls onReset when Reset button is clicked', async () => {
    const onReset = vi.fn();
    renderToolbar({ canReset: true, onReset });
    const user = userEvent.setup();

    await user.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('shows keyboard hint text', () => {
    renderToolbar();
    expect(screen.getByText('Ctrl+Enter to run')).toBeTruthy();
  });

  describe('Compare button', () => {
    it('shows Compare button when exercise is complete', () => {
      const onCompare = vi.fn();
      renderToolbar({ isComplete: true, onCompare });
      expect(screen.getByText('Compare')).toBeTruthy();
    });

    it('does not show Compare button when exercise is not complete', () => {
      const onCompare = vi.fn();
      renderToolbar({ isComplete: false, onCompare });
      expect(screen.queryByText('Compare')).toBeNull();
    });

    it('does not show Compare button when onCompare is not provided', () => {
      renderToolbar({ isComplete: true });
      expect(screen.queryByText('Compare')).toBeNull();
    });

    it('calls onCompare when Compare button clicked', async () => {
      const user = userEvent.setup();
      const onCompare = vi.fn();
      renderToolbar({ isComplete: true, onCompare });
      await user.click(screen.getByText('Compare'));
      expect(onCompare).toHaveBeenCalledOnce();
    });
  });
});
