import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import SubcategoryNav from '../../src/components/browse/SubcategoryNav';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('SubcategoryNav', () => {
  const categories = {
    'js-fundamentals': {
      label: 'JS Fundamentals',
      color: '#facc15',
      children: {
        variables: { label: 'Variables' },
        functions: { label: 'Functions' },
      },
    },
  };

  it('renders top-level categories when no category path is set', () => {
    renderWithProviders(<SubcategoryNav />, {
      preloadedState: { exercises: { categories } },
    });
    // With empty path, it shows root-level keys as buttons
    expect(screen.getByText('JS Fundamentals')).toBeTruthy();
  });

  it('renders subcategory buttons when category path is set', () => {
    renderWithProviders(<SubcategoryNav />, {
      preloadedState: {
        exercises: { categories },
        ui: { browseFilter: { categoryPath: ['js-fundamentals'] } },
      },
    });
    expect(screen.getByText('Variables')).toBeTruthy();
    expect(screen.getByText('Functions')).toBeTruthy();
  });

  it('renders nothing when category has no children', () => {
    const flatCategories = {
      'js-fundamentals': { label: 'JS Fundamentals' },
    };
    const { container } = renderWithProviders(<SubcategoryNav />, {
      preloadedState: {
        exercises: { categories: flatCategories },
        ui: { browseFilter: { categoryPath: ['js-fundamentals'] } },
      },
    });
    expect(container.innerHTML).toBe('');
  });
});
