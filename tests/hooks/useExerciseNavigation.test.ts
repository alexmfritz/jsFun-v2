import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createElement } from 'react';
import { useExerciseNavigation } from '../../src/components/exercise/hooks/useExerciseNavigation';
import { createTestStore, makeExercise, makeCollection } from '../helpers/renderWithProviders';
import type { RootState } from '../../src/features/store';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function renderNavHook(exerciseId: number, preloadedState?: DeepPartial<RootState>) {
  const store = createTestStore(preloadedState);
  return renderHook(() => useExerciseNavigation(exerciseId), {
    wrapper: ({ children }) => createElement(Provider, { store }, children),
  });
}

const exercises = [
  makeExercise({ id: 1, title: 'Alpha', tier: 1, category: ['js-fundamentals'] }),
  makeExercise({ id: 2, title: 'Beta', tier: 1, category: ['js-fundamentals'] }),
  makeExercise({ id: 3, title: 'Gamma', tier: 2, category: ['css-basics'] }),
  makeExercise({ id: 4, title: 'Delta', tier: 2, category: ['css-basics'] }),
  makeExercise({ id: 5, title: 'Epsilon', tier: 3, category: ['js-fundamentals', 'advanced'] }),
];

describe('useExerciseNavigation', () => {
  it('returns sorted exercises by tier then title', () => {
    const { result } = renderNavHook(1, {
      exercises: { exercises },
    });
    const titles = result.current.sortedExercises.map((e) => e.title);
    expect(titles).toEqual(['Alpha', 'Beta', 'Delta', 'Gamma', 'Epsilon']);
  });

  it('finds current exercise index', () => {
    const { result } = renderNavHook(3, {
      exercises: { exercises },
    });
    // Gamma is tier 2, sorted after Alpha and Beta (tier 1)
    // Tier 2: Delta, Gamma (alphabetical) → Delta at idx 2, Gamma at idx 3
    expect(result.current.currentIndex).toBe(3);
  });

  it('provides prev and next exercises', () => {
    const { result } = renderNavHook(2, {
      exercises: { exercises },
    });
    // Beta is at index 1 (after Alpha)
    expect(result.current.prevExercise?.title).toBe('Alpha');
    expect(result.current.nextExercise?.title).toBe('Delta');
  });

  it('returns null prevExercise for the first exercise', () => {
    const { result } = renderNavHook(1, {
      exercises: { exercises },
    });
    expect(result.current.prevExercise).toBeNull();
  });

  it('returns null nextExercise for the last exercise', () => {
    const { result } = renderNavHook(5, {
      exercises: { exercises },
    });
    expect(result.current.nextExercise).toBeNull();
  });

  it('returns navContext=null when no filters are active', () => {
    const { result } = renderNavHook(1, {
      exercises: { exercises },
    });
    expect(result.current.navContext).toBeNull();
  });

  describe('with category filter', () => {
    it('filters exercises by category path', () => {
      const { result } = renderNavHook(1, {
        exercises: { exercises },
        ui: { browseFilter: { categoryPath: ['js-fundamentals'] } },
      });
      const ids = result.current.sortedExercises.map((e) => e.id);
      expect(ids).toEqual([1, 2, 5]);
    });

    it('shows category name as navContext', () => {
      const { result } = renderNavHook(1, {
        exercises: { exercises },
        ui: { browseFilter: { categoryPath: ['js-fundamentals'] } },
      });
      expect(result.current.navContext).toBe('Js Fundamentals');
    });
  });

  describe('with collection filter', () => {
    it('filters and orders exercises by collection', () => {
      const collection = makeCollection({
        id: 'my-col',
        name: 'My Collection',
        exerciseIds: [3, 1],
      });
      const { result } = renderNavHook(3, {
        exercises: { exercises, collections: [collection] },
        ui: { browseFilter: { collectionId: 'my-col' } },
      });
      const ids = result.current.sortedExercises.map((e) => e.id);
      // Preserves collection order
      expect(ids).toEqual([3, 1]);
    });

    it('shows collection name as navContext', () => {
      const collection = makeCollection({
        id: 'my-col',
        name: 'My Collection',
      });
      const { result } = renderNavHook(1, {
        exercises: { exercises, collections: [collection] },
        ui: { browseFilter: { collectionId: 'my-col' } },
      });
      expect(result.current.navContext).toBe('My Collection');
    });
  });

  describe('with tier filter', () => {
    it('filters exercises to the specified tier', () => {
      const { result } = renderNavHook(3, {
        exercises: { exercises },
        ui: { browseFilter: { tier: 2 } },
      });
      const ids = result.current.sortedExercises.map((e) => e.id);
      expect(ids).toEqual([4, 3]); // Delta, Gamma (alphabetical)
    });

    it('shows tier as navContext', () => {
      const { result } = renderNavHook(3, {
        exercises: { exercises },
        ui: { browseFilter: { tier: 2 } },
      });
      expect(result.current.navContext).toBe('Tier 2');
    });
  });

  it('handles exercise not found in list', () => {
    const { result } = renderNavHook(999, {
      exercises: { exercises },
    });
    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.prevExercise).toBeNull();
    expect(result.current.nextExercise).toBeNull();
  });
});
