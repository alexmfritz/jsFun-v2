import { useEffect, useRef } from 'react';
import { ExerciseType } from '../../types';
import CodeEditor from './CodeEditor';

interface CompareModalProps {
  isOpen: boolean;
  studentCode: string;
  referenceCode: string;
  language: ExerciseType;
  onClose: () => void;
}

/**
 * Side-by-side comparison modal showing student code and reference solution.
 * Both editors are read-only. Focus-trapped, closes on Escape or backdrop click.
 */
export default function CompareModal({
  isOpen,
  studentCode,
  referenceCode,
  language,
  onClose,
}: CompareModalProps) {
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
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        className="rounded-lg flex flex-col mx-4"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          width: '90vw',
          maxWidth: '1200px',
          height: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            id="compare-modal-title"
            className="font-heading font-semibold text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            Compare Solutions
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{
              color: 'var(--text-muted)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            aria-label="Close comparison"
          >
            &times;
          </button>
        </div>

        {/* Side-by-side editors */}
        <div className="flex flex-1 overflow-hidden">
          {/* Student code */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>
            <div
              className="px-4 py-2 text-xs font-heading font-medium flex-shrink-0"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-raised)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              Your Solution
            </div>
            <div className="flex-1 overflow-auto">
              <CodeEditor
                value={studentCode}
                onChange={() => {}}
                language={language}
                readOnly
                minHeight="100%"
              />
            </div>
          </div>

          {/* Reference code */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className="px-4 py-2 text-xs font-heading font-medium flex-shrink-0"
              style={{
                color: 'var(--accent)',
                backgroundColor: 'var(--bg-raised)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              Reference Solution
            </div>
            <div className="flex-1 overflow-auto">
              <CodeEditor
                value={referenceCode}
                onChange={() => {}}
                language={language}
                readOnly
                minHeight="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
