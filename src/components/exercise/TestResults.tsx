import { TestResult } from '../../types';

interface TestResultsProps {
  results: TestResult[];
  isRunning: boolean;
}

/**
 * Displays test results after running an exercise.
 * Shows pass/fail for each test with a summary.
 */
export default function TestResults({ results, isRunning }: TestResultsProps) {
  if (isRunning) {
    return (
      <div className="flex items-center justify-center h-24" style={{ color: 'var(--text-muted)' }}>
        <span className="text-sm font-code">Running tests…</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-24 gap-2"
        style={{ color: 'var(--text-muted)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span className="text-sm">Press Ctrl+Enter to run tests</span>
      </div>
    );
  }

  const passCount = results.filter((r) => r.pass).length;
  const allPass = passCount === results.length;

  return (
    <div className="flex flex-col gap-1 p-4" aria-live="polite" role="status">
      {/* Summary bar */}
      <div
        className="flex items-center gap-3 pb-3 mb-1"
        style={{ borderBottom: '1px solid var(--border)' }}
        aria-atomic="true"
      >
        <span
          className="font-heading font-bold text-base"
          style={{ color: allPass ? 'var(--success)' : 'var(--error)' }}
        >
          {allPass ? 'All Passing' : `${passCount} / ${results.length} Passing`}
        </span>
        {/* Mini progress bar */}
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-raised)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(passCount / results.length) * 100}%`,
              backgroundColor: allPass ? 'var(--success)' : 'var(--error)',
            }}
          />
        </div>
      </div>

      {/* Individual results */}
      {results.map((r, i) => (
        <div
          key={i}
          className="test-result flex items-start gap-2.5 py-1.5 px-2 rounded text-sm"
          style={{
            backgroundColor: r.pass ? 'rgba(52, 211, 153, 0.06)' : 'rgba(248, 113, 113, 0.06)',
            border: `1px solid ${r.pass ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}`,
          }}
        >
          <span
            className="flex-shrink-0 mt-0.5 font-bold text-xs"
            style={{ color: r.pass ? 'var(--success)' : 'var(--error)' }}
          >
            {r.pass ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <span style={{ color: r.pass ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
              {r.description}
            </span>
            {!r.pass && r.got !== undefined && (
              <div
                className="mt-1 text-xs px-2 py-0.5 rounded font-code"
                style={{
                  color: 'var(--error)',
                  backgroundColor: 'rgba(248,113,113,0.08)',
                }}
              >
                Got: {JSON.stringify(r.got)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
