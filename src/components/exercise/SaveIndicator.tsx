import { useAppSelector } from '../../features/store';

/**
 * Small inline indicator showing auto-save status in the toolbar.
 */
export default function SaveIndicator() {
  const saveStatus = useAppSelector((s) => s.ui.saveStatus);

  if (saveStatus === 'idle') return null;

  return (
    <span
      className="text-xs transition-opacity duration-300"
      style={{
        color: saveStatus === 'saved' ? 'var(--success)' : 'var(--text-muted)',
        fontFamily: 'Lexend, sans-serif',
        animation: saveStatus === 'saved' ? 'fadeOut 2s ease-out forwards' : undefined,
      }}
    >
      {saveStatus === 'saving' ? 'Saving\u2026' : 'Saved \u2714'}
    </span>
  );
}
