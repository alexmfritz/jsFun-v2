import { Category, Tier, ExerciseType } from '../types';

/**
 * Debounce a function call — returns a new function that delays invocation.
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Get the color for a category by looking up the category tree.
 * Returns the root category color or a fallback.
 */
export function getCategoryColor(
  categoryPath: string[],
  categories: Record<string, Category>
): string {
  if (!categoryPath.length) return '#818cf8';
  const rootKey = categoryPath[0];
  return categories[rootKey]?.color ?? '#818cf8';
}

/**
 * Build human-readable label breadcrumbs from a category path.
 * @example ["js-fundamentals", "operators", "modulo"] → ["JS Fundamentals", "Operators", "Modulo"]
 */
export function getCategoryLabels(
  categoryPath: string[],
  categories: Record<string, Category>
): string[] {
  const labels: string[] = [];
  let current: Record<string, Category> = categories;

  for (const key of categoryPath) {
    const cat = current[key];
    if (!cat) break;
    labels.push(cat.label);
    current = cat.children ?? {};
  }

  return labels;
}

/** Get the display color for a tier */
export function getTierColor(tier: Tier): string {
  const colors: Record<Tier, string> = {
    1: '#34d399',
    2: '#60a5fa',
    3: '#818cf8',
    4: '#c084fc',
    5: '#f472b6',
  };
  return colors[tier];
}

/** Get the display color for an exercise type */
export function getTypeColor(type: ExerciseType): string {
  const colors: Record<ExerciseType, string> = {
    js: '#facc15',
    html: '#f472b6',
    css: '#22d3ee',
    'html-css': '#a78bfa',
  };
  return colors[type];
}

/** Format a timestamp into a human-readable relative string */
export function formatRelativeTime(isoString: string): string {
  const then = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return then.toLocaleDateString();
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Calculate completion percentage */
export function calcPercent(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
