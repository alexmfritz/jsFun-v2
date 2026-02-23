interface ScoreCardProps {
  filteredPct: number;
  filteredCompleted: number;
  filteredCount: number;
  filterLabel: string;
}

/**
 * Big progress display — percentage, progress bar, and exercise count.
 */
export default function ScoreCard({
  filteredPct,
  filteredCompleted,
  filteredCount,
  filterLabel,
}: ScoreCardProps) {
  return (
    <div
      className="rounded-xl p-6 flex items-center gap-8"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <span
          className="font-heading font-bold"
          style={{ fontSize: '64px', lineHeight: 1, color: 'var(--accent)' }}
        >
          {filteredPct}
          <span style={{ fontSize: '32px', color: 'var(--text-muted)' }}>%</span>
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Lexend, sans-serif' }}>
          {filterLabel}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div
          className="h-4 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-raised)' }}
          role="progressbar"
          aria-valuenow={filteredPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${filterLabel}: ${filteredCompleted} of ${filteredCount} exercises complete`}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${filteredPct}%`, backgroundColor: 'var(--accent)' }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{filteredCompleted}</strong> of{' '}
            {filteredCount} exercises
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {filteredCount - filteredCompleted} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
