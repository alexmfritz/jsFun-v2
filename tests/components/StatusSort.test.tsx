import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrowseView from '../../src/components/browse/BrowseView';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('Status Sort', () => {
  const exercises = [
    makeExercise({ id: 1, title: 'Alpha', tier: 1 }),
    makeExercise({ id: 2, title: 'Beta', tier: 1 }),
    makeExercise({ id: 3, title: 'Gamma', tier: 1 }),
  ];

  it('shows status sort dropdown', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises } },
    });
    expect(screen.getByLabelText('Sort by status')).toBeTruthy();
  });

  it('default value is "Sort: Default"', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises } },
    });
    const select = screen.getByLabelText('Sort by status') as HTMLSelectElement;
    expect(select.value).toBe('default');
  });

  it('has four sort options', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises } },
    });
    const select = screen.getByLabelText('Sort by status') as HTMLSelectElement;
    expect(select.options.length).toBe(4);
  });

  it('changes sort option when selected', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises } },
    });
    await user.selectOptions(screen.getByLabelText('Sort by status'), 'in-progress-first');
    const state = store.getState() as { ui: { statusSort: string } };
    expect(state.ui.statusSort).toBe('in-progress-first');
  });

  it('includes statusSort in hasActiveFilters (shows Clear button)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises } },
    });
    // Initially no Clear button visible
    expect(screen.queryByText('Clear')).toBeNull();
    // Change sort
    await user.selectOptions(screen.getByLabelText('Sort by status'), 'completed-first');
    // Clear button should appear
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('resets statusSort when Clear is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<BrowseView />, {
      preloadedState: {
        exercises: { exercises },
        ui: { statusSort: 'completed-first' },
      },
    });
    await user.click(screen.getByText('Clear'));
    const state = store.getState() as { ui: { statusSort: string } };
    expect(state.ui.statusSort).toBe('default');
  });
});
