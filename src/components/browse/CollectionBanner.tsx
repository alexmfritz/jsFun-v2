import { useAppSelector } from '../../features/store';

/** Banner shown above the exercise grid when browsing a collection */
export default function CollectionBanner() {
  const collections = useAppSelector((s) => s.exercises.collections);
  const collectionId = useAppSelector((s) => s.ui.browseFilter.collectionId);
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return null;

  const attributionText = col.attribution
    ? col.attribution
    : [col.source && `Source: ${col.source}`, col.license && `License: ${col.license}`]
          .filter(Boolean)
          .join(' · ') || null;

  return (
    <div
      className="mx-5 mt-4 mb-0 p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderLeftWidth: '3px',
        borderLeftColor: col.color ?? 'var(--accent)',
      }}
    >
      <h2
        className="font-heading font-semibold text-base"
        style={{ color: 'var(--text-primary)' }}
      >
        {col.name}
      </h2>
      {col.description && (
        <p
          className="text-xs leading-relaxed mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {col.description}
        </p>
      )}
      {attributionText && (
        <p
          className="text-xs mt-2"
          style={{ color: 'var(--text-muted)' }}
          dangerouslySetInnerHTML={{
            __html: attributionText.replace(
              /\[([^\]]+)\]\(([^)]+)\)/g,
              '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:underline">$1</a>',
            ),
          }}
        />
      )}
    </div>
  );
}
