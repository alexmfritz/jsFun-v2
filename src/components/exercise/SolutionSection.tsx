import LockProgress from './LockProgress';

interface SolutionSectionProps {
  solution: string;
  solutionUnlocked: boolean;
  expanded: boolean;
  onToggle: () => void;
  uniqueAttempts: number;
  gate: number;
}

/**
 * Gated solution reveal — unlocked after enough unique attempts or completion.
 */
export default function SolutionSection({
  solution,
  solutionUnlocked,
  expanded,
  onToggle,
  uniqueAttempts,
  gate,
}: SolutionSectionProps) {
  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => {
          if (solutionUnlocked) onToggle();
        }}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium"
        style={{
          backgroundColor: 'var(--bg-raised)',
          color: solutionUnlocked ? 'var(--text-secondary)' : 'var(--text-faint)',
          cursor: solutionUnlocked ? 'pointer' : 'not-allowed',
          border: 'none',
          fontFamily: 'Lexend, sans-serif',
        }}
        disabled={!solutionUnlocked}
        aria-expanded={solutionUnlocked ? expanded : undefined}
        aria-controls={solutionUnlocked ? 'solution-content' : undefined}
      >
        <span className="flex items-center gap-2">
          {solutionUnlocked ? '🔓' : '🔒'} Solution
          {!solutionUnlocked && (
            <LockProgress current={uniqueAttempts} needed={gate} />
          )}
        </span>
        {solutionUnlocked && (
          <span style={{ color: 'var(--text-faint)' }} aria-hidden="true">{expanded ? '▲' : '▼'}</span>
        )}
      </button>
      {solutionUnlocked && expanded && (
        <pre
          id="solution-content"
          className="px-3 py-2 text-xs overflow-x-auto font-code"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-editor)',
            margin: 0,
            borderTop: '1px solid var(--border)',
          }}
        >
          {solution}
        </pre>
      )}
    </div>
  );
}
