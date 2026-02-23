import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import CollectionBanner from '../../src/components/browse/CollectionBanner';
import { renderWithProviders, makeCollection } from '../helpers/renderWithProviders';

describe('CollectionBanner', () => {
  const collection = makeCollection({
    id: 'exercism',
    name: 'Exercism',
    description: 'Practice exercises from Exercism.',
  });

  it('renders nothing when no collection is selected', () => {
    const { container } = renderWithProviders(<CollectionBanner />, {
      preloadedState: { exercises: { collections: [collection] } },
    });
    expect(container.innerHTML).toBe('');
  });

  it('renders collection name when collection is selected', () => {
    renderWithProviders(<CollectionBanner />, {
      preloadedState: {
        exercises: { collections: [collection] },
        ui: { browseFilter: { collectionId: 'exercism' } },
      },
    });
    expect(screen.getByText('Exercism')).toBeTruthy();
  });

  it('renders collection description', () => {
    renderWithProviders(<CollectionBanner />, {
      preloadedState: {
        exercises: { collections: [collection] },
        ui: { browseFilter: { collectionId: 'exercism' } },
      },
    });
    expect(screen.getByText('Practice exercises from Exercism.')).toBeTruthy();
  });

  it('renders nothing when selected collection ID does not match any collection', () => {
    const { container } = renderWithProviders(<CollectionBanner />, {
      preloadedState: {
        exercises: { collections: [collection] },
        ui: { browseFilter: { collectionId: 'nonexistent' } },
      },
    });
    expect(container.innerHTML).toBe('');
  });
});
