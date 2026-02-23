import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { setCollectionFilter } from '../../features/uiSlice';
import { calcPercent } from '../../utils';

/** Source-based collection cards shown below Topics */
export default function CollectionCards() {
  const dispatch = useAppDispatch();
  const collections = useAppSelector((s) => s.exercises.collections);
  const exercises = useAppSelector((s) => s.exercises.exercises);
  const completedExercises = useAppSelector((s) => s.progress.completedExercises);
  const savedSolutions = useAppSelector((s) => s.progress.savedSolutions);

  const visibleCollections = collections.filter((c) => !c.hidden);

  // "In Progress" pseudo-collection: exercises with saved code but not yet passed
  const inProgressCount = useMemo(() => {
    return exercises.filter((ex) => {
      const hasSaved = !!savedSolutions[String(ex.id)];
      const isDone = !!completedExercises[String(ex.id)];
      return hasSaved && !isDone;
    }).length;
  }, [exercises, savedSolutions, completedExercises]);

  if (visibleCollections.length === 0 && inProgressCount === 0) return null;

  return (
    <div className="px-5 pt-2 pb-4" data-tutorial="collections">
      <h2
        className="font-heading font-semibold text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Collections
      </h2>
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {/* "In Progress" pseudo-collection card */}
        {inProgressCount > 0 && (
          <button
            onClick={() => dispatch(setCollectionFilter('__in-progress__'))}
            className="flex flex-col gap-2 p-4 rounded-lg text-left cursor-pointer transition-all duration-150"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed #f59e0b66',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b66';
            }}
          >
            <div className="flex flex-col gap-0.5">
              <span
                className="font-heading font-semibold text-sm flex items-center gap-1.5"
                style={{ color: '#f59e0b' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                In Progress
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Exercises with saved drafts
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{inProgressCount} exercise{inProgressCount !== 1 ? 's' : ''}</span>
            </div>
          </button>
        )}

        {visibleCollections.map((col) => {
          const colIds = new Set(col.exerciseIds);
          const colExercises = exercises.filter((ex) => colIds.has(ex.id));
          const colCompleted = colExercises.filter(
            (ex) => !!completedExercises[String(ex.id)]
          ).length;
          const pct = calcPercent(colCompleted, colExercises.length);

          return (
            <button
              key={col.id}
              onClick={() => dispatch(setCollectionFilter(col.id))}
              className="flex flex-col gap-2 p-4 rounded-lg text-left cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${col.color ?? 'var(--border)'}33`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${col.color ?? 'var(--accent)'}66`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${col.color ?? 'var(--border)'}33`;
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className="font-heading font-semibold text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {col.name}
                </span>
                {col.source && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {col.source}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>{colCompleted}/{colExercises.length}</span>
                <div
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: col.color ?? 'var(--accent)' }}
                  />
                </div>
                <span>{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
