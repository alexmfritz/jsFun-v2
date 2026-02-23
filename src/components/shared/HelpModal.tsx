import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { setShowHelpModal } from '../../features/uiSlice';
import { TIER_META, Tier } from '../../types';

type Tab = 'start' | 'shortcuts' | 'tiers' | 'tips';

const TABS: { key: Tab; label: string }[] = [
  { key: 'start', label: 'Getting Started' },
  { key: 'shortcuts', label: 'Shortcuts' },
  { key: 'tiers', label: 'Tier System' },
  { key: 'tips', label: 'Tips' },
];

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  1: 'Starter code provided with clear guidance. Great for your first exercises.',
  2: 'Some structure given but you fill in the logic. Builds core skills.',
  3: 'Minimal scaffolding — you write most of the solution yourself.',
  4: 'Just the function signature. You design the approach and implementation.',
  5: 'Empty editor. You build everything from scratch.',
};

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: 'Ctrl + Enter', action: 'Run tests' },
  { keys: 'Ctrl + S', action: 'Save (auto-saves too)' },
  { keys: 'Tab', action: 'Indent code' },
  { keys: 'Shift + Tab', action: 'Unindent code' },
  { keys: 'Ctrl + Z', action: 'Undo' },
  { keys: 'Ctrl + Shift + Z', action: 'Redo' },
  { keys: 'Ctrl + /', action: 'Toggle comment' },
  { keys: 'Escape', action: 'Close modals' },
];

interface RestartTutorialProps {
  onRestart: (() => void) | undefined;
}

function GettingStartedTab({ onRestart }: RestartTutorialProps) {
  return (
    <div className="flex flex-col gap-3">
      <p style={{ color: 'var(--text-secondary)' }}>
        jsFun is your coding practice platform. Work through exercises at your own pace to build
        JavaScript, HTML, and CSS skills.
      </p>
      <h4 className="font-heading font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
        How it works
      </h4>
      <ol className="flex flex-col gap-1.5 pl-5 text-sm" style={{ color: 'var(--text-secondary)', listStyleType: 'decimal' }}>
        <li>Browse exercises by topic or use the search bar</li>
        <li>Read the instructions on the left panel</li>
        <li>Write your solution in the code editor</li>
        <li>Press <strong>Ctrl+Enter</strong> to run tests</li>
        <li>Keep going until all tests pass!</li>
      </ol>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Your code saves automatically as you type. Progress is tracked on the Dashboard.
      </p>
      {onRestart && (
        <button
          onClick={onRestart}
          className="text-xs self-start px-3 py-1.5 rounded mt-1"
          style={{
            color: 'var(--accent)',
            backgroundColor: 'transparent',
            border: '1px solid var(--accent)',
            cursor: 'pointer',
            fontFamily: 'Lexend, sans-serif',
          }}
        >
          Restart Tutorial
        </button>
      )}
    </div>
  );
}

function ShortcutsTab() {
  return (
    <div className="flex flex-col gap-2">
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th className="text-left py-1.5 font-heading font-medium" style={{ color: 'var(--text-muted)' }}>Shortcut</th>
            <th className="text-left py-1.5 font-heading font-medium" style={{ color: 'var(--text-muted)' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {SHORTCUTS.map(({ keys, action }) => (
            <tr key={keys} style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="py-1.5">
                <kbd
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--bg-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Source Code Pro, monospace',
                  }}
                >
                  {keys}
                </kbd>
              </td>
              <td className="py-1.5" style={{ color: 'var(--text-secondary)' }}>{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TierSystemTab() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Exercises are organized into 5 difficulty tiers. Start with Tier I and work your way up.
      </p>
      <div className="flex flex-col gap-2">
        {([1, 2, 3, 4, 5] as Tier[]).map((tier) => {
          const meta = TIER_META[tier];
          return (
            <div
              key={tier}
              className="flex items-start gap-3 p-2.5 rounded"
              style={{ backgroundColor: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
            >
              <span
                className="tier-badge flex-shrink-0"
                style={{ backgroundColor: meta.bgColor, color: meta.color, border: `1.5px solid ${meta.color}` }}
              >
                {meta.label}
              </span>
              <div>
                <span className="text-sm font-heading font-medium" style={{ color: meta.color }}>
                  {meta.name}
                </span>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {TIER_DESCRIPTIONS[tier]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TipsTab() {
  const tips = [
    { title: 'Read the tests', body: 'The test descriptions tell you exactly what your code needs to do. Use them as a checklist.' },
    { title: 'Start small', body: 'Get one test passing at a time. Don\'t try to solve everything at once.' },
    { title: 'Use console.log', body: 'Add console.log() statements to see what your variables contain. It\'s the best debugging tool.' },
    { title: 'Check your types', body: 'Many bugs come from unexpected types. Is it a string when you expect a number? An array when you expect an object?' },
    { title: 'Don\'t fear errors', body: 'Error messages are helpful! Read them carefully — they usually tell you exactly what went wrong and where.' },
    { title: 'Reset and retry', body: 'Stuck? Use the Reset button to start fresh. Sometimes a clean slate helps you see the problem differently.' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {tips.map(({ title, body }) => (
        <div key={title}>
          <h4 className="text-sm font-heading font-medium" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

interface HelpModalProps {
  onRestartTutorial?: () => void;
}

/**
 * Tabbed help modal accessible via the ? button in the header.
 * Focus-trapped, closes on Escape or backdrop click.
 */
export default function HelpModal({ onRestartTutorial }: HelpModalProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.showHelpModal);
  const [activeTab, setActiveTab] = useState<Tab>('start');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = () => dispatch(setShowHelpModal(false));

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
        close();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="rounded-lg flex flex-col mx-4"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          width: '520px',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2
            id="help-modal-title"
            className="font-heading font-semibold text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            Help
          </h2>
          <button
            onClick={close}
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{
              color: 'var(--text-muted)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            aria-label="Close help"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-3 py-2 text-xs font-heading font-medium"
              style={{
                color: activeTab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === key ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto text-sm" style={{ maxHeight: '60vh' }}>
          {activeTab === 'start' && <GettingStartedTab onRestart={onRestartTutorial} />}
          {activeTab === 'shortcuts' && <ShortcutsTab />}
          {activeTab === 'tiers' && <TierSystemTab />}
          {activeTab === 'tips' && <TipsTab />}
        </div>
      </div>
    </div>
  );
}
