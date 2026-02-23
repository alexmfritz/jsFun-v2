import { useEffect, useState, useRef } from 'react';
import { UseTutorialResult } from '../../hooks/useTutorial';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TutorialProps {
  tutorial: UseTutorialResult;
}

/**
 * Full-screen tutorial overlay with spotlight cutout over target elements.
 * Uses box-shadow to darken everything except the highlighted element.
 */
export default function Tutorial({ tutorial }: TutorialProps) {
  const { isActive, step, currentStep, totalSteps, next, back, skip } = tutorial;
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Find and measure the target element
  useEffect(() => {
    if (!isActive || !step) {
      setRect(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(step.target);
      if (el) {
        // Scroll element into view if not visible
        const elRect = el.getBoundingClientRect();
        if (elRect.top < 0 || elRect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Re-measure after scroll settles
          setTimeout(() => {
            const r = el.getBoundingClientRect();
            const pad = 6;
            setRect({
              top: r.top - pad,
              left: r.left - pad,
              width: r.width + pad * 2,
              height: r.height + pad * 2,
            });
          }, 400);
          return;
        }
        const pad = 6;
        setRect({
          top: elRect.top - pad,
          left: elRect.left - pad,
          width: elRect.width + pad * 2,
          height: elRect.height + pad * 2,
        });
      } else {
        // Fallback: center of screen if target not found
        setRect({ top: window.innerHeight / 2 - 30, left: window.innerWidth / 2 - 60, width: 120, height: 60 });
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isActive, step]);

  if (!isActive || !step || !rect) return null;

  // Calculate tooltip position
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10001,
    maxWidth: '320px',
    width: '320px',
  };

  // Estimated tooltip height for clamping
  const tooltipHeight = 180;
  const clampLeft = (left: number) => Math.max(12, Math.min(left, window.innerWidth - 332));
  const clampTop = (top: number) => Math.max(12, Math.min(top, window.innerHeight - tooltipHeight - 12));

  switch (step.placement) {
    case 'bottom': {
      let top = rect.top + rect.height + 12;
      // If tooltip would go below viewport, flip to above
      if (top + tooltipHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - tooltipHeight - 12);
      }
      tooltipStyle.top = top;
      tooltipStyle.left = clampLeft(rect.left);
      break;
    }
    case 'top': {
      let top = rect.top - tooltipHeight - 12;
      // If tooltip would go above viewport, flip to below
      if (top < 12) {
        top = rect.top + rect.height + 12;
      }
      tooltipStyle.top = clampTop(top);
      tooltipStyle.left = clampLeft(rect.left);
      break;
    }
    case 'right':
      tooltipStyle.top = clampTop(rect.top);
      tooltipStyle.left = rect.left + rect.width + 12;
      break;
    case 'left':
      tooltipStyle.top = clampTop(rect.top);
      tooltipStyle.right = window.innerWidth - rect.left + 12;
      break;
  }

  return (
    <>
      {/* Backdrop click to skip */}
      <div
        className="fixed inset-0 z-[10000]"
        style={{ cursor: 'pointer' }}
        onClick={skip}
        aria-hidden="true"
      />

      {/* Spotlight cutout */}
      <div
        className="fixed z-[10000] rounded-lg"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none',
          animation: 'spotlightPulse 2s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="rounded-lg p-4 flex flex-col gap-2"
        style={{
          ...tooltipStyle,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--accent)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-heading font-medium"
            style={{ color: 'var(--accent)' }}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
          <button
            onClick={skip}
            className="text-xs"
            style={{
              color: 'var(--text-muted)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            Skip tour
          </button>
        </div>

        <h3
          className="font-heading font-semibold text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          {step.title}
        </h3>

        <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {step.body}
        </p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="text-xs px-3 py-1.5 rounded"
            style={{
              color: currentStep === 0 ? 'var(--text-faint)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              cursor: currentStep === 0 ? 'default' : 'pointer',
              fontFamily: 'Lexend, sans-serif',
              opacity: currentStep === 0 ? 0.4 : 1,
            }}
          >
            Back
          </button>

          {/* Step dots */}
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: i === currentStep ? 'var(--accent)' : 'var(--text-ghost)',
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="text-xs px-3 py-1.5 rounded"
            style={{
              color: '#fff',
              backgroundColor: 'var(--accent)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Lexend, sans-serif',
            }}
          >
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
}
