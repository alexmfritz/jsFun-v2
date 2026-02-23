import { useMemo } from 'react';
import { useAppSelector } from '../../../features/store';
import { Exercise } from '../../../types';

interface UseExerciseNavigationResult {
  sortedExercises: Exercise[];
  currentIndex: number;
  prevExercise: Exercise | null;
  nextExercise: Exercise | null;
  navContext: string | null;
}

/**
 * Browse-context-aware exercise navigation.
 * Computes prev/next exercises and a navigation context label
 * that respects the user's active browse filter (category, collection, tier).
 */
export function useExerciseNavigation(exerciseId: number): UseExerciseNavigationResult {
  const exercises = useAppSelector((s) => s.exercises.exercises);
  const collections = useAppSelector((s) => s.exercises.collections);
  const browseFilter = useAppSelector((s) => s.ui.browseFilter);

  const sortedExercises = useMemo(() => {
    let result = exercises;

    // Respect active category path (e.g. "JS > Fundamentals")
    if (browseFilter.categoryPath.length > 0) {
      result = result.filter((ex) =>
        browseFilter.categoryPath.every((seg, i) => ex.category[i] === seg)
      );
    }

    // Respect collection filter (including in-progress pseudo-collection)
    if (browseFilter.collectionId && browseFilter.collectionId !== '__in-progress__') {
      const col = collections.find((c) => c.id === browseFilter.collectionId);
      if (col) {
        return col.exerciseIds
          .map((eid) => result.find((ex) => ex.id === eid))
          .filter(Boolean) as typeof exercises;
      }
    }

    // Respect tier filter
    if (browseFilter.tier) {
      result = result.filter((ex) => ex.tier === browseFilter.tier);
    }

    return [...result].sort((a, b) => a.tier - b.tier || a.title.localeCompare(b.title));
  }, [exercises, collections, browseFilter]);

  const currentIndex = sortedExercises.findIndex((ex) => ex.id === exerciseId);
  const prevExercise = currentIndex > 0 ? sortedExercises[currentIndex - 1] : null;
  const nextExercise =
    currentIndex >= 0 && currentIndex < sortedExercises.length - 1
      ? sortedExercises[currentIndex + 1]
      : null;

  // Navigation context label (shows what subset prev/next operates within)
  const navContext = useMemo(() => {
    if (browseFilter.collectionId && browseFilter.collectionId !== '__in-progress__') {
      const col = collections.find((c) => c.id === browseFilter.collectionId);
      return col?.name ?? null;
    }
    if (browseFilter.categoryPath.length > 0) {
      return browseFilter.categoryPath[browseFilter.categoryPath.length - 1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (browseFilter.tier) return `Tier ${browseFilter.tier}`;
    return null;
  }, [browseFilter, collections]);

  return { sortedExercises, currentIndex, prevExercise, nextExercise, navContext };
}
