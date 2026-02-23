import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '../../src/components/shared/Header';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('Header', () => {
  const exercises = Array.from({ length: 10 }, (_, i) =>
    makeExercise({ id: i + 1, title: `Ex ${i + 1}` }),
  );

  it('renders the logo text "jsFun"', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('js')).toBeTruthy();
    expect(screen.getByText('Fun')).toBeTruthy();
  });

  it('renders student name when provided', () => {
    renderWithProviders(<Header />, {
      preloadedState: { progress: { studentName: 'Alice' } },
    });
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders navigation links (Exercises, Dashboard, Admin)', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Exercises' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeTruthy();
  });

  it('active link gets aria-current="page"', () => {
    renderWithProviders(<Header />, { route: '/exercises' });
    const exercisesLink = screen.getByRole('link', { name: 'Exercises' });
    expect(exercisesLink.getAttribute('aria-current')).toBe('page');

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink.getAttribute('aria-current')).toBeNull();
  });

  it('shows progress bar when exercises exist', () => {
    renderWithProviders(<Header />, {
      preloadedState: { exercises: { exercises } },
    });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('progress bar has correct aria attributes', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        progress: { completedExercises: { '1': true, '2': true, '3': true } },
      },
    });
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-valuenow')).toBe('30');
    expect(bar.getAttribute('aria-label')).toBe(
      'Overall progress: 3 of 10 exercises complete',
    );
  });

  it('theme toggle button has aria-label', () => {
    renderWithProviders(<Header />);
    const toggle = screen.getByRole('button', { name: /switch to/i });
    expect(toggle).toBeTruthy();
    expect(toggle.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('shows completion count (e.g. "3/10")', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        exercises: { exercises },
        progress: { completedExercises: { '1': true, '2': true, '3': true } },
      },
    });
    expect(screen.getByText('3/10')).toBeTruthy();
  });
});
