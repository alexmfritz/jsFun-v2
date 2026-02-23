import { useAppDispatch, useAppSelector } from '../../features/store';
import { setCategoryPath } from '../../features/uiSlice';
import { getCategoryColor } from '../../utils';

/** Subcategory navigation pills */
export default function SubcategoryNav() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.exercises.categories);
  const categoryPath = useAppSelector((s) => s.ui.browseFilter.categoryPath);

  // Navigate the category tree to find subcategories of the current path
  let current: Record<string, { label: string; icon?: string; color?: string; children?: Record<string, { label: string; icon?: string; color?: string; children?: Record<string, unknown> }> }> = categories;
  for (const seg of categoryPath) {
    current = (current[seg]?.children as typeof current) ?? {};
  }

  if (Object.keys(current).length === 0) return null;

  const catColor = getCategoryColor(categoryPath, categories);

  return (
    <div className="px-5 pt-4 pb-2 flex flex-wrap gap-2">
      {Object.entries(current).map(([key, cat]) => {
        const fullPath = [...categoryPath, key];
        return (
          <button
            key={key}
            onClick={() => dispatch(setCategoryPath(fullPath))}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'var(--bg-raised)',
              border: `1px solid var(--border)`,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'Lexend, sans-serif',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = catColor;
              (e.currentTarget as HTMLElement).style.color = catColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
