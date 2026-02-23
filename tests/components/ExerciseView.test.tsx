import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ExerciseView from '../../src/components/exercise/ExerciseView';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

// Mock CodeEditor since it requires CodeMirror DOM APIs
vi.mock('../../src/components/exercise/CodeEditor', () => ({
  default: ({ value, language }: { value: string; language: string }) => (
    <div data-testid={`editor-${language}`} data-value={value}>
      CodeEditor({language})
    </div>
  ),
}));

// Mock useParams to provide the exercise ID
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

describe('ExerciseView', () => {
  const exercise = makeExercise({
    id: 1,
    title: 'Sum Array',
    type: 'js',
    tier: 1,
    instructions: '## Sum Array\n\nWrite a function that sums an array.',
    starterCode: 'function sum(arr) {}',
  });

  describe('loading state', () => {
    it('shows skeleton when exercises are loading', () => {
      const { container } = renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { loading: true } },
      });
      const skeletons = container.querySelectorAll('.skeleton-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not show exercise title while loading', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { loading: true } },
      });
      expect(screen.queryByText('Sum Array')).toBeNull();
    });
  });

  describe('exercise not found', () => {
    it('shows "Exercise not found" when ID does not match any exercise', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [], loading: false } },
      });
      expect(screen.getByText('Exercise not found.')).toBeTruthy();
    });

    it('shows a "Back to Exercises" button', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [], loading: false } },
      });
      expect(screen.getByText('Back to Exercises')).toBeTruthy();
    });
  });

  describe('loaded state', () => {
    it('renders the exercise title', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [exercise] } },
      });
      // Title appears in both InstructionsPanel header and ExerciseToolbar
      expect(screen.getAllByText('Sum Array').length).toBeGreaterThanOrEqual(1);
    });

    it('renders the code editor', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [exercise] } },
      });
      expect(screen.getByTestId('editor-js')).toBeTruthy();
    });

    it('shows the Run Tests button', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [exercise] } },
      });
      expect(screen.getByText('▶ Run Tests')).toBeTruthy();
    });

    it('shows the Back button', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [exercise] } },
      });
      expect(screen.getByText('← Back')).toBeTruthy();
    });

    it('loads saved solution if available', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: {
          exercises: { exercises: [exercise] },
          progress: { savedSolutions: { '1': 'function sum(arr) { return arr.reduce((a, b) => a + b, 0); }' } },
        },
      });
      const editor = screen.getByTestId('editor-js');
      expect(editor.getAttribute('data-value')).toBe(
        'function sum(arr) { return arr.reduce((a, b) => a + b, 0); }'
      );
    });

    it('loads starter code when no saved solution exists', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: {
          exercises: { exercises: [exercise] },
        },
      });
      const editor = screen.getByTestId('editor-js');
      expect(editor.getAttribute('data-value')).toBe('function sum(arr) {}');
    });

    it('shows Reset button when exercise has saved solution', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: {
          exercises: { exercises: [exercise] },
          progress: { savedSolutions: { '1': 'saved code' } },
        },
      });
      expect(screen.getByText('Reset')).toBeTruthy();
    });

    it('hides Reset button when no saved solution and not complete', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [exercise] } },
      });
      expect(screen.queryByText('Reset')).toBeNull();
    });
  });

  describe('html-css exercise', () => {
    const htmlCssExercise = makeExercise({
      id: 1,
      title: 'Card Component',
      type: 'html-css',
      starterCode: '<div class="card"></div>',
    });

    it('renders dual editors for html-css type', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [htmlCssExercise] } },
      });
      expect(screen.getByTestId('editor-html')).toBeTruthy();
      expect(screen.getByTestId('editor-css-only')).toBeTruthy();
    });

    it('shows HTML and CSS labels', () => {
      renderWithProviders(<ExerciseView />, {
        preloadedState: { exercises: { exercises: [htmlCssExercise] } },
      });
      expect(screen.getByText('HTML')).toBeTruthy();
      expect(screen.getByText('CSS')).toBeTruthy();
    });
  });
});
