import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { dismissToast } from '../../features/uiSlice';

/** Base 3s + 30ms per character, clamped to 3–8s */
function getToastDuration(message: string): number {
  return Math.min(8000, Math.max(3000, 3000 + message.length * 30));
}

const ICON: Record<string, string> = {
  error: '\u2718',       // ✘
  success: '\u2714',     // ✔
  warning: '\u26A0',     // ⚠
  celebration: '\u2B50', // ⭐
};

const COLOR: Record<string, { bg: string; border: string; text: string }> = {
  error: {
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.4)',
    text: 'var(--error)',
  },
  success: {
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.4)',
    text: 'var(--success)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.4)',
    text: 'var(--warning)',
  },
  celebration: {
    bg: 'rgba(129, 140, 248, 0.12)',
    border: 'rgba(129, 140, 248, 0.4)',
    text: 'var(--accent)',
  },
};

/**
 * Global toast notification — renders at bottom of screen.
 * Auto-dismisses after 3-8s (adaptive based on message length).
 */
export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(dismissToast()), getToastDuration(toast.message));
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const colors = COLOR[toast.type] ?? COLOR.error;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        backdropFilter: 'blur(8px)',
        fontFamily: 'Lexend, sans-serif',
        animation: 'slideIn 0.2s ease-out',
      }}
    >
      <span style={{ fontSize: '14px' }}>{ICON[toast.type]}</span>
      {toast.message}
      <button
        onClick={() => dispatch(dismissToast())}
        className="ml-2 flex items-center justify-center"
        style={{
          color: colors.text,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          padding: '0 2px',
          opacity: 0.7,
        }}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
