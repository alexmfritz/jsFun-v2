import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('Collapsible Instructions Panel', () => {
  const exercise = makeExercise({
    id: 1,
    title: 'Test Exercise',
    instructions: '## Test Instructions',
  });

  it('shows panel toggle button', () => {
    renderWithProviders(<ExerciseView />, {
      preloadedState: { exercises: { exercises: [exercise] } },
    });
    expect(screen.getByLabelText('Hide instructions panel')).toBeTruthy();
  });

  it('hides instructions panel when toggle clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExerciseView />, {
      preloadedState: { exercises: { exercises: [exercise] } },
    });
    // Panel is visible initially — instructions tab exists
    expect(screen.getByText('Instructions')).toBeTruthy();

    // Click toggle to collapse
    await user.click(screen.getByLabelText('Hide instructions panel'));

    // Panel should be hidden
    expect(screen.queryByText('Instructions')).toBeNull();
    // Toggle label changes
    expect(screen.getByLabelText('Show instructions panel')).toBeTruthy();
  });

  it('restores instructions panel when toggle clicked again', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExerciseView />, {
      preloadedState: { exercises: { exercises: [exercise] } },
    });

    // Collapse
    await user.click(screen.getByLabelText('Hide instructions panel'));
    expect(screen.queryByText('Instructions')).toBeNull();

    // Expand
    await user.click(screen.getByLabelText('Show instructions panel'));
    expect(screen.getByText('Instructions')).toBeTruthy();
  });

  it('still shows the editor when panel is collapsed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExerciseView />, {
      preloadedState: { exercises: { exercises: [exercise] } },
    });

    // Collapse panel
    await user.click(screen.getByLabelText('Hide instructions panel'));

    // Editor should still be visible
    expect(screen.getByTestId('editor-js')).toBeTruthy();
    // Run Tests button should still be visible
    expect(screen.getByText('▶ Run Tests')).toBeTruthy();
  });
});
