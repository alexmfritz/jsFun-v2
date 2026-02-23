import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '../../src/components/shared/Header';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('Network Status Indicator', () => {
  const exercises = [makeExercise({ id: 1 })];

  it('does not show Offline badge when server is reachable', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        ui: { serverReachable: true },
      },
    });
    expect(screen.queryByText('Offline')).toBeNull();
  });

  it('shows Offline badge when server is unreachable', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        ui: { serverReachable: false },
      },
    });
    expect(screen.getByText('Offline')).toBeTruthy();
  });

  it('Offline badge has role="status" for accessibility', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        ui: { serverReachable: false },
      },
    });
    const badge = screen.getByRole('status');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain('Offline');
  });

  it('Offline badge has aria-live="polite"', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        ui: { serverReachable: false },
      },
    });
    const badge = screen.getByRole('status');
    expect(badge.getAttribute('aria-live')).toBe('polite');
  });
});
