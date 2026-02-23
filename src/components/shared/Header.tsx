import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { toggleTheme, setShowHelpModal } from '../../features/uiSlice';
import { selectCompletedCount } from '../../features/progressSlice';
import { calcPercent } from '../../utils';
import { Theme } from '../../types';

const THEME_LABELS: Record<Theme, { next: string; icon: 'sun' | 'moon' | 'eye' }> = {
  dark: { next: 'light', icon: 'sun' },
  light: { next: 'high-contrast', icon: 'eye' },
  'high-contrast': { next: 'dark', icon: 'moon' },
};

/**
 * Fixed top header with logo, navigation, global progress bar, and theme toggle.
 */
export default function Header() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useAppSelector((s) => s.ui.theme);
  const completedCount = useAppSelector(selectCompletedCount);
  const totalCount = useAppSelector((s) => s.exercises.exercises.length);
  const studentName = useAppSelector((s) => s.progress.studentName);
  const serverReachable = useAppSelector((s) => s.ui.serverReachable);
  const pct = calcPercent(completedCount, totalCount);

  const { next, icon } = THEME_LABELS[theme] ?? THEME_LABELS.dark;

  const navLinks = [
    { to: '/exercises', label: 'Exercises' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-5 relative"
      style={{
        height: '60px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-strong)',
      }}
    >
      {/* Logo */}
      <Link to="/exercises" className="flex items-center gap-2 no-underline" data-tutorial="logo" style={{ color: 'inherit' }}>
        <span
          className="font-heading font-bold text-xl"
          style={{ color: 'var(--accent)' }}
        >
          js
        </span>
        <span className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
          Fun
        </span>
        {studentName && (
          <span
            className="text-xs ml-2"
            style={{ color: 'var(--text-muted)', fontFamily: 'Source Code Pro, monospace' }}
          >
            {studentName}
          </span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1" aria-label="Main navigation" data-tutorial="nav">
        {navLinks.map(({ to, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{
                fontFamily: 'Lexend, sans-serif',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: active ? 'var(--bg-raised)' : 'transparent',
                textDecoration: 'none',
              }}
              aria-current={active ? 'page' : undefined}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right side: progress + theme toggle */}
      <div className="flex items-center gap-4">
        {/* Mini progress */}
        {totalCount > 0 && (
          <div className="flex items-center gap-2" data-tutorial="progress">
            <div
              className="w-24 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg-raised)' }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Overall progress: ${completedCount} of ${totalCount} exercises complete`}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }}
              />
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {completedCount}/{totalCount}
            </span>
          </div>
        )}

        {/* Network status */}
        {!serverReachable && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontFamily: 'Lexend, sans-serif',
            }}
            role="status"
            aria-live="polite"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#ef4444' }}
              aria-hidden="true"
            />
            Offline
          </div>
        )}

        {/* Help button */}
        <button
          onClick={() => dispatch(setShowHelpModal(true))}
          data-tutorial="help"
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{
            backgroundColor: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Lexend, sans-serif',
            fontWeight: 600,
          }}
          title="Help"
          aria-label="Open help"
        >
          ?
        </button>

        {/* Theme toggle — cycles: dark → light → high-contrast → dark */}
        <button
          onClick={() => dispatch(toggleTheme())}
          data-tutorial="theme"
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{
            backgroundColor: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '15px',
          }}
          title={`Switch to ${next} mode`}
          aria-label={`Switch to ${next} mode`}
        >
          {icon === 'sun' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          )}
          {icon === 'moon' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
          {icon === 'eye' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>

      {/* Bottom border progress bar (full width) */}
      {totalCount > 0 && pct > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: 'var(--accent)', opacity: 0.6 }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
