/**
 * Small pill showing progress toward unlocking a hint or solution.
 */
export default function LockProgress({ current, needed }: { current: number; needed: number }) {
  const remaining = Math.max(0, needed - current);
  const pct = Math.min(100, (current / needed) * 100);
  return (
    <span className="flex items-center gap-1.5">
      <span
        style={{
          display: 'inline-block',
          width: '36px',
          height: '4px',
          borderRadius: '2px',
          backgroundColor: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${pct}%`,
            backgroundColor: 'var(--accent)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </span>
      <span style={{ color: 'var(--text-faint)', fontWeight: 'normal', fontSize: '10px' }}>
        {remaining} more
      </span>
    </span>
  );
}
