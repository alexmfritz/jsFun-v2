import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import CollectionCards from '../../src/components/browse/CollectionCards';
import { renderWithProviders, makeExercise, makeCollection } from '../helpers/renderWithProviders';

describe('CollectionCards', () => {
  const exercises = [
    makeExercise({ id: 1, title: 'Ex 1' }),
    makeExercise({ id: 2, title: 'Ex 2' }),
    makeExercise({ id: 3, title: 'Ex 3' }),
  ];

  const collection = makeCollection({
    id: 'exercism',
    name: 'Exercism',
    exerciseIds: [1, 2],
    source: 'exercism.org',
  });

  it('renders "Collections" heading when collections exist', () => {
    renderWithProviders(<CollectionCards />, {
      preloadedState: {
        exercises: { exercises, collections: [collection] },
      },
    });
    expect(screen.getByText('Collections')).toBeTruthy();
  });

  it('renders collection name', () => {
    renderWithProviders(<CollectionCards />, {
      preloadedState: {
        exercises: { exercises, collections: [collection] },
      },
    });
    expect(screen.getByText('Exercism')).toBeTruthy();
  });

  it('shows completion count for collection', () => {
    renderWithProviders(<CollectionCards />, {
      preloadedState: {
        exercises: { exercises, collections: [collection] },
        progress: { completedExercises: { '1': true } },
      },
    });
    expect(screen.getByText('1/2')).toBeTruthy();
  });

  it('renders nothing when no collections and no in-progress exercises', () => {
    const { container } = renderWithProviders(<CollectionCards />, {
      preloadedState: { exercises: { exercises: [], collections: [] } },
    });
    expect(container.innerHTML).toBe('');
  });

  it('shows In Progress card when exercises have saved drafts', () => {
    renderWithProviders(<CollectionCards />, {
      preloadedState: {
        exercises: { exercises, collections: [] },
        progress: { savedSolutions: { '1': 'code' } },
      },
    });
    expect(screen.getByText('In Progress')).toBeTruthy();
  });

  it('does not show hidden collections', () => {
    const hiddenCollection = makeCollection({
      id: 'hidden',
      name: 'Hidden Collection',
      hidden: true,
    });
    renderWithProviders(<CollectionCards />, {
      preloadedState: {
        exercises: { exercises, collections: [hiddenCollection] },
      },
    });
    expect(screen.queryByText('Hidden Collection')).toBeNull();
  });
});
