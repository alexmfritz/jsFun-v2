import { ExerciseType, TYPE_META } from '../../types';

interface TypeBadgeProps {
  type: ExerciseType;
}

/**
 * Small pill badge showing exercise type (JS, HTML, CSS, HTML+CSS).
 */
export default function TypeBadge({ type }: TypeBadgeProps) {
  const meta = TYPE_META[type];
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold"
      style={{
        color: meta.color,
        backgroundColor: `${meta.color}22`,
        border: `1px solid ${meta.color}44`,
        fontFamily: 'Lexend, sans-serif',
        letterSpacing: '0.03em',
      }}
    >
      {meta.label}
    </span>
  );
}
