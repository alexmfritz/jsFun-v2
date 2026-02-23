import { useState } from 'react';
import { Exercise, getHints, DEFAULT_SOLUTION_GATE } from '../../types';
import { useAppSelector } from '../../features/store';
import { selectUniqueAttempts } from '../../features/progressSlice';
import TierBadge from '../shared/TierBadge';
import TypeBadge from '../shared/TypeBadge';
import MarkdownLite from '../shared/MarkdownLite';
import ResourcesSection from './ResourcesSection';
import HintsSection from './HintsSection';
import SolutionSection from './SolutionSection';

interface InstructionsPanelProps {
  exercise: Exercise;
  activeTab: 'instructions' | 'results' | 'preview';
  onTabChange: (tab: 'instructions' | 'results' | 'preview') => void;
  children: React.ReactNode; // the tab content (results or preview)
  testResultCount: number;
  testPassCount: number;
}

/**
 * Left panel of the exercise view.
 * Shows instructions, progressive hints, resources, solution, test results,
 * and live preview tabs.
 */
export default function InstructionsPanel({
  exercise,
  activeTab,
  onTabChange,
  children,
  testResultCount,
  testPassCount,
}: InstructionsPanelProps) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());
  const [showResources, setShowResources] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const uniqueAttempts = useAppSelector(selectUniqueAttempts(exercise.id));
  const isComplete = useAppSelector((s) => !!s.progress.completedExercises[String(exercise.id)]);
  const gate = exercise.solutionGate ?? DEFAULT_SOLUTION_GATE;
  const solutionUnlocked = isComplete || uniqueAttempts >= gate;

  const hints = getHints(exercise);

  const toggleHint = (index: number) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const tabs: { id: 'instructions' | 'results' | 'preview'; label: string; show: boolean }[] = [
    { id: 'instructions', label: 'Instructions', show: true },
    {
      id: 'results',
      label: testResultCount > 0 ? `Results (${testPassCount}/${testResultCount})` : 'Results',
      show: true,
    },
    { id: 'preview', label: 'Preview', show: exercise.type !== 'js' },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Exercise header */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <TierBadge tier={exercise.tier} size="sm" showName />
          <TypeBadge type={exercise.type} />
          <span className="text-xs ml-auto" style={{ color: 'var(--text-faint)' }}>
            #{exercise.id}
          </span>
        </div>
        <h1
          className="font-heading font-semibold text-base"
          style={{ color: 'var(--text-primary)' }}
        >
          {exercise.title}
        </h1>
      </div>

      {/* Tabs */}
      <div
        className="flex-shrink-0 flex"
        style={{ borderBottom: '1px solid var(--border)' }}
        role="tablist"
        aria-label="Exercise panels"
      >
        {tabs
          .filter((t) => t.show)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className="px-4 py-2 text-xs font-medium relative"
              style={{
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Lexend, sans-serif',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Tab content */}
      <div
        className="flex-1 overflow-y-auto"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'instructions' ? (
          <div className="p-4 flex flex-col gap-4">
            <MarkdownLite text={exercise.instructions} />

            <ResourcesSection
              resources={exercise.resources}
              expanded={showResources}
              onToggle={() => setShowResources((v) => !v)}
            />

            <HintsSection
              hints={hints}
              expandedHints={expandedHints}
              onToggleHint={toggleHint}
              uniqueAttempts={uniqueAttempts}
            />

            <SolutionSection
              solution={exercise.solution}
              solutionUnlocked={solutionUnlocked}
              expanded={showSolution}
              onToggle={() => setShowSolution((v) => !v)}
              uniqueAttempts={uniqueAttempts}
              gate={gate}
            />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
