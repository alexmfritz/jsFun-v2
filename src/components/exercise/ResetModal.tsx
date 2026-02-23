import { useEffect, useRef } from 'react';

interface ResetModalProps {
  isOpen: boolean;
  isComplete: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible reset confirmation dialog with keyboard focus trap.
 * Traps Tab/Shift+Tab within the modal and closes on Escape.
 */
export default function ResetModal({ isOpen, isComplete, onConfirm, onCancel }: ResetModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const modal = modalRef.current;
    if (!modal) return;

    const focusableEls = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    first?.focus();

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div
        className="rounded-lg p-6 max-w-sm mx-4 flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="reset-modal-title"
          className="font-heading font-semibold text-base"
          style={{ color: 'var(--text-primary)' }}
        >
          Reset Exercise?
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This will clear your saved code and reset to the starter template.
          {isComplete && ' Your completion status will also be removed.'}
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-1.5 rounded"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-1.5 rounded"
            style={{
              color: '#fff',
              backgroundColor: '#ef4444',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
