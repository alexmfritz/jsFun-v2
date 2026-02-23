import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseCard from '../../src/components/browse/ExerciseCard';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('ExerciseCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const exercise = makeExercise({
    id: 42,
    title: 'Flatten Arrays',
    type: 'js',
    tier: 2,
    description: 'Flatten nested arrays into a single array.',
    tags: ['arrays', 'recursion', 'higher-order'],
  });

  it('renders exercise title', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    expect(screen.getByText('Flatten Arrays')).toBeTruthy();
  });

  it('renders exercise description', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    expect(screen.getByText('Flatten nested arrays into a single array.')).toBeTruthy();
  });

  it('renders tags (up to 4)', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    expect(screen.getByText('arrays')).toBeTruthy();
    expect(screen.getByText('recursion')).toBeTruthy();
    expect(screen.getByText('higher-order')).toBeTruthy();
  });

  it('limits tags to 4', () => {
    const ex = makeExercise({
      tags: ['a', 'b', 'c', 'd', 'e'],
    });
    renderWithProviders(<ExerciseCard exercise={ex} />);
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.getByText('d')).toBeTruthy();
    expect(screen.queryByText('e')).toBeNull();
  });

  it('navigates to exercise on click', async () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    const user = userEvent.setup();

    const card = screen.getByRole('button', { name: /Exercise: Flatten Arrays/ });
    await user.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/exercises/42');
  });

  it('navigates on Enter key press', async () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    const user = userEvent.setup();

    const card = screen.getByRole('button', { name: /Exercise: Flatten Arrays/ });
    card.focus();
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith('/exercises/42');
  });

  it('shows checkmark when exercise is completed', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />, {
      preloadedState: {
        progress: {
          completedExercises: {
            '42': { completedAt: '2025-01-01T00:00:00Z', attempts: 3 },
          },
        },
      },
    });
    // Checkmark SVG has title="Completed"
    expect(screen.getByTitle('Completed')).toBeTruthy();
  });

  it('shows attempt count when exercise has attempts but is not complete', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />, {
      preloadedState: {
        progress: {
          attempts: { '42': 5 },
        },
      },
    });
    expect(screen.getByTitle('5 attempts')).toBeTruthy();
  });

  it('shows no status indicator when exercise has no attempts and is not complete', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    expect(screen.queryByTitle('Completed')).toBeNull();
    expect(screen.queryByTitle(/attempt/)).toBeNull();
  });

  it('has accessible aria-label', () => {
    renderWithProviders(<ExerciseCard exercise={exercise} />);
    expect(screen.getByLabelText('Exercise: Flatten Arrays')).toBeTruthy();
  });
});
