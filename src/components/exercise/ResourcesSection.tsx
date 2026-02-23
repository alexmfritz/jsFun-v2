import { Resource } from '../../types';

interface ResourcesSectionProps {
  resources: Resource[];
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Collapsible "Learn More" section showing exercise resources/links.
 */
export default function ResourcesSection({ resources, expanded, onToggle }: ResourcesSectionProps) {
  if (resources.length === 0) return null;

  return (
    <div
      className="rounded overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium"
        style={{
          backgroundColor: 'var(--bg-raised)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          border: 'none',
          fontFamily: 'Lexend, sans-serif',
        }}
        aria-expanded={expanded}
        aria-controls="resources-content"
      >
        <span>📚 Learn More</span>
        <span style={{ color: 'var(--text-faint)' }} aria-hidden="true">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div id="resources-content" className="flex flex-col gap-0.5 p-2" style={{ backgroundColor: 'var(--bg-surface)' }}>
          {resources.map((r: Resource, i: number) => (
            <a
              key={i}
              href={r.url}
              className="flex flex-col px-2 py-1.5 rounded text-xs hover:bg-raised"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
                backgroundColor: 'transparent',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-medium">{r.label}</span>
              {r.description && (
                <span style={{ color: 'var(--text-muted)' }}>{r.description}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
