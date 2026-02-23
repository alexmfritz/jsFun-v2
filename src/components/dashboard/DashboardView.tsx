import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../../features/store';
import { calcPercent, formatRelativeTime } from '../../utils';
import { Tier, TIER_META, ExerciseType } from '../../types';
import Skeleton from '../shared/Skeleton';
import TierBadge from '../shared/TierBadge';
import ScoreCard from './ScoreCard';
import StatsRow from './StatsRow';

/**
 * Student dashboard — big progress display, stats breakdowns, exercise grid.
 */
export default function DashboardView() {
  const navigate = useNavigate();
  const exercises = useAppSelector((s) => s.exercises.exercises);
  const exercisesLoading = useAppSelector((s) => s.exercises.loading);
  const collections = useAppSelector((s) => s.exercises.collections);
  const { completedExercises, attempts, studentName } = useAppSelector((s) => s.progress);

  const [filterTier, setFilterTier] = useState<Tier | null>(null);
  const [filterCollection, setFilterCollection] = useState<string | null>(null);

  const totalCount = exercises.length;
  const completedCount = Object.keys(completedExercises).length;

  // Filtered exercises list for the grid
  const displayedExercises = useMemo(() => {
    let result = exercises;
    if (filterTier) result = result.filter((ex) => ex.tier === filterTier);
    if (filterCollection) {
      const col = collections.find((c) => c.id === filterCollection);
      if (col) {
        const ids = new Set(col.exerciseIds);
        result = result.filter((ex) => ids.has(ex.id));
        // Preserve collection order
        result = col.exerciseIds.map((id) => result.find((ex) => ex.id === id)!).filter(Boolean);
      }
    }
    // Sort by tier → alpha (unless collection-ordered)
    if (!filterCollection) {
      result = [...result].sort((a, b) => a.tier - b.tier || a.title.localeCompare(b.title));
    }
    return result;
  }, [exercises, collections, filterTier, filterCollection]);

  // Dynamic score card — reflects filtered subset
  const { filteredCount, filteredCompleted, filteredPct, filterLabel } = useMemo(() => {
    const base = displayedExercises;
    const done = base.filter((ex) => !!completedExercises[String(ex.id)]).length;
    const label = filterTier
      ? `Tier ${TIER_META[filterTier].label} (${TIER_META[filterTier].name})`
      : filterCollection
      ? collections.find((c) => c.id === filterCollection)?.name ?? 'Collection'
      : 'Overall';
    return {
      filteredCount: base.length,
      filteredCompleted: done,
      filteredPct: calcPercent(done, base.length),
      filterLabel: label,
    };
  }, [displayedExercises, completedExercises, filterTier, filterCollection, collections]);

  // Stats by tier
  const tierStats = useMemo(() => {
    return ([1, 2, 3, 4, 5] as Tier[]).map((tier) => {
      const tierExercises = exercises.filter((ex) => ex.tier === tier);
      const done = tierExercises.filter((ex) => !!completedExercises[String(ex.id)]).length;
      return { tier, total: tierExercises.length, done };
    });
  }, [exercises, completedExercises]);

  // Stats by type
  const typeStats = useMemo(() => {
    return (['js', 'html', 'css', 'html-css'] as ExerciseType[]).map((type) => {
      const typeExercises = exercises.filter((ex) => ex.type === type);
      const done = typeExercises.filter((ex) => !!completedExercises[String(ex.id)]).length;
      return { type, total: typeExercises.length, done };
    });
  }, [exercises, completedExercises]);

  // Recent completions
  const recentCompletions = useMemo(() => {
    return Object.entries(completedExercises)
      .sort((a, b) => new Date(b[1].completedAt).getTime() - new Date(a[1].completedAt).getTime())
      .slice(0, 5)
      .map(([idStr, data]) => ({
        exercise: exercises.find((ex) => ex.id === Number(idStr)),
        data,
      }))
      .filter((item) => item.exercise);
  }, [completedExercises, exercises]);

  const lastUpdated = recentCompletions[0]?.data.completedAt;

  if (exercisesLoading) {
    return (
      <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--bg-root)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
          <Skeleton width="220px" height="28px" />
          <div
            className="rounded-xl p-6 flex items-center gap-8"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <Skeleton width="100px" height="80px" borderRadius="8px" />
            <div className="flex-1 flex flex-col gap-3">
              <Skeleton height="16px" borderRadius="8px" />
              <Skeleton height="14px" width="60%" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <Skeleton width="60px" height="16px" className="mb-3" />
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} height="12px" className="mb-2" />
              ))}
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <Skeleton width="60px" height="16px" className="mb-3" />
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} height="12px" className="mb-2" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton width="120px" height="20px" className="mb-4" />
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <Skeleton key={i} height="36px" borderRadius="6px" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state — no exercises completed yet
  if (completedCount === 0 && totalCount > 0) {
    return (
      <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--bg-root)' }}>
        <div className="max-w-md mx-auto px-6 py-16 flex flex-col items-center gap-6 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-bg, rgba(129,140,248,0.15))' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h1
            className="font-heading font-bold text-2xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {studentName ? `Welcome, ${studentName}!` : 'Welcome to jsFun!'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You haven't completed any exercises yet. Browse {totalCount} exercises across
            multiple topics and difficulty levels. Start with a Tier I exercise to get
            your first win!
          </p>
          <Link
            to="/exercises"
            className="px-6 py-2.5 rounded text-sm font-heading font-medium no-underline"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            Browse Exercises
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-root)' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
        {/* All-done celebration banner */}
        {completedCount === totalCount && totalCount > 0 && (
          <div
            className="rounded-lg p-4 flex items-center gap-3"
            style={{
              backgroundColor: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
            role="status"
          >
            <span className="text-2xl" aria-hidden="true">🎉</span>
            <div>
              <h2
                className="font-heading font-bold text-base"
                style={{ color: '#34d399' }}
              >
                All {totalCount} exercises completed!
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Incredible work — you've conquered every exercise. Keep sharpening your skills or help a classmate!
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-baseline gap-3">
          <h1
            className="font-heading font-bold text-2xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {studentName ? `${studentName}'s Progress` : 'My Progress'}
          </h1>
          {lastUpdated && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last active {formatRelativeTime(lastUpdated)}
            </span>
          )}
        </div>

        {/* Big score card */}
        <ScoreCard
          filteredPct={filteredPct}
          filteredCompleted={filteredCompleted}
          filteredCount={filteredCount}
          filterLabel={filterLabel}
        />

        {/* Stats row */}
        <StatsRow tierStats={tierStats} typeStats={typeStats} />

        {/* Exercise grid with filters */}
        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h2
              className="font-heading font-semibold text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              All Exercises
            </h2>

            {/* Tier filter */}
            <div className="flex items-center gap-1 ml-auto">
              {([1, 2, 3, 4, 5] as Tier[]).map((t) => {
                const meta = TIER_META[t];
                return (
                  <button
                    key={t}
                    onClick={() => setFilterTier(filterTier === t ? null : t)}
                    className="tier-badge"
                    style={{
                      width: 22,
                      height: 22,
                      fontSize: 9,
                      backgroundColor: filterTier === t ? meta.bgColor : 'var(--bg-raised)',
                      border: `1px solid ${filterTier === t ? meta.color : 'var(--border)'}`,
                      color: filterTier === t ? meta.color : 'var(--text-faint)',
                      cursor: 'pointer',
                    }}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Collection filter */}
            <select
              value={filterCollection ?? ''}
              onChange={(e) => setFilterCollection(e.target.value || null)}
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'Lexend, sans-serif',
              }}
            >
              <option value="">All Collections</option>
              {collections.filter((c) => !c.hidden).map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {displayedExercises.map((ex) => {
              const done = !!completedExercises[String(ex.id)];
              const att = attempts[String(ex.id)] ?? 0;
              return (
                <button
                  key={ex.id}
                  onClick={() => navigate(`/exercises/${ex.id}`)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-left text-xs"
                  style={{
                    backgroundColor: done ? 'rgba(52,211,153,0.06)' : 'var(--bg-surface)',
                    border: `1px solid ${done ? 'rgba(52,211,153,0.25)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  <TierBadge tier={ex.tier} size="sm" />
                  <span
                    className="flex-1 font-code truncate"
                    style={{ color: done ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                  >
                    {ex.title}
                  </span>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : att > 0 ? (
                    <span style={{ color: 'var(--text-faint)' }}>{att}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
