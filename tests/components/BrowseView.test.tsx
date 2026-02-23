import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrowseView from '../../src/components/browse/BrowseView';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('BrowseView', () => {
  const categories = {
    'js-fundamentals': { label: 'JS Fundamentals', color: '#facc15' },
  };

  const exercises = [
    makeExercise({ id: 1, title: 'Alpha Exercise', tier: 1, category: ['js-fundamentals'], tags: ['arrays'] }),
    makeExercise({ id: 2, title: 'Beta Exercise', tier: 2, category: ['js-fundamentals'], tags: ['strings'] }),
  ];

  it('renders search input', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByPlaceholderText(/search exercises/i)).toBeTruthy();
  });

  it('renders exercise cards', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText('Alpha Exercise')).toBeTruthy();
    expect(screen.getByText('Beta Exercise')).toBeTruthy();
  });

  it('shows exercise count', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText(/2 exercises/)).toBeTruthy();
  });

  it('renders loading skeleton when loading', () => {
    const { container } = renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises: [], categories: {}, loading: true } },
    });
    // Skeleton elements use the skeleton class
    const skeletons = container.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows "No exercises match" when filters exclude everything', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: {
        exercises: { exercises, categories },
        ui: { browseFilter: { search: 'zzzznonexistent' } },
      },
    });
    expect(screen.getByText(/no exercises match/i)).toBeTruthy();
  });

  it('renders Random button', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText('Random')).toBeTruthy();
  });

  it('renders Filters button', () => {
    renderWithProviders(<BrowseView />, {
      preloadedState: { exercises: { exercises, categories } },
    });
    expect(screen.getByText('Filters')).toBeTruthy();
  });
});
