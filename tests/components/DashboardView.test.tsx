import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import DashboardView from '../../src/components/dashboard/DashboardView';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('DashboardView', () => {
  describe('loading state', () => {
    it('shows skeleton when exercises are loading', () => {
      const { container } = renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { loading: true } },
      });
      const skeletons = container.querySelectorAll('.skeleton-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not show the progress header while loading', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { loading: true } },
      });
      expect(screen.queryByText(/Progress/)).toBeNull();
    });
  });

  describe('empty welcome state', () => {
    const exercises = [
      makeExercise({ id: 1, title: 'Ex One', tier: 1 }),
      makeExercise({ id: 2, title: 'Ex Two', tier: 2 }),
      makeExercise({ id: 3, title: 'Ex Three', tier: 1 }),
    ];

    it('shows welcome message when no exercises completed', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { exercises } },
      });
      expect(screen.getByText('Welcome to jsFun!')).toBeTruthy();
    });

    it('shows personalized welcome with student name', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: {
          exercises: { exercises },
          progress: { studentName: 'Alex' },
        },
      });
      expect(screen.getByText('Welcome, Alex!')).toBeTruthy();
    });

    it('shows exercise count in welcome message', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { exercises } },
      });
      expect(screen.getByText(/Browse 3 exercises/)).toBeTruthy();
    });

    it('has Browse Exercises link', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { exercises } },
      });
      const link = screen.getByText('Browse Exercises');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/exercises');
    });

    it('does not show full dashboard when no completions', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: { exercises: { exercises } },
      });
      expect(screen.queryByText('My Progress')).toBeNull();
      expect(screen.queryByText('All Exercises')).toBeNull();
    });
  });

  describe('loaded state (with completions)', () => {
    const exercises = [
      makeExercise({ id: 1, title: 'Ex One', tier: 1, type: 'js' }),
      makeExercise({ id: 2, title: 'Ex Two', tier: 2, type: 'html' }),
      makeExercise({ id: 3, title: 'Ex Three', tier: 1, type: 'css' }),
    ];

    const withOneComplete = {
      exercises: { exercises },
      progress: {
        completedExercises: {
          '1': { completedAt: '2025-01-01T00:00:00Z', attempts: 2 },
        },
      },
    };

    it('shows default "My Progress" header when no student name', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      expect(screen.getByText('My Progress')).toBeTruthy();
    });

    it('shows personalized header with student name', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: {
          ...withOneComplete,
          progress: { ...withOneComplete.progress, studentName: 'Alex' },
        },
      });
      expect(screen.getByText("Alex's Progress")).toBeTruthy();
    });

    it('shows overall percentage', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      // 1 of 3 = 33%
      expect(screen.getByText('33')).toBeTruthy();
    });

    it('shows exercise count', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      expect(screen.getByText(/of 3 exercises/)).toBeTruthy();
    });

    it('has a progress bar with correct aria attributes', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeTruthy();
      expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
      expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    });

    it('shows "By Tier" and "By Type" sections', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      expect(screen.getByText('By Tier')).toBeTruthy();
      expect(screen.getByText('By Type')).toBeTruthy();
    });

    it('shows "All Exercises" heading', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      expect(screen.getByText('All Exercises')).toBeTruthy();
    });

    it('renders exercise buttons in the grid', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: withOneComplete,
      });
      expect(screen.getByText('Ex One')).toBeTruthy();
      expect(screen.getByText('Ex Two')).toBeTruthy();
      expect(screen.getByText('Ex Three')).toBeTruthy();
    });
  });

  describe('all-done celebration banner', () => {
    const exercises = [
      makeExercise({ id: 1, title: 'Ex One', tier: 1 }),
      makeExercise({ id: 2, title: 'Ex Two', tier: 2 }),
    ];

    it('shows celebration banner when all exercises completed', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: {
          exercises: { exercises },
          progress: {
            completedExercises: {
              '1': { completedAt: '2025-01-01T00:00:00Z', attempts: 2 },
              '2': { completedAt: '2025-01-02T00:00:00Z', attempts: 1 },
            },
          },
        },
      });
      expect(screen.getByText('All 2 exercises completed!')).toBeTruthy();
    });

    it('does not show celebration banner when not all completed', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: {
          exercises: { exercises },
          progress: {
            completedExercises: {
              '1': { completedAt: '2025-01-01T00:00:00Z', attempts: 2 },
            },
          },
        },
      });
      expect(screen.queryByText(/exercises completed!/)).toBeNull();
    });

    it('still shows full dashboard below the celebration banner', () => {
      renderWithProviders(<DashboardView />, {
        preloadedState: {
          exercises: { exercises },
          progress: {
            completedExercises: {
              '1': { completedAt: '2025-01-01T00:00:00Z', attempts: 2 },
              '2': { completedAt: '2025-01-02T00:00:00Z', attempts: 1 },
            },
          },
        },
      });
      expect(screen.getByText('My Progress')).toBeTruthy();
      expect(screen.getByText('All Exercises')).toBeTruthy();
    });
  });
});
