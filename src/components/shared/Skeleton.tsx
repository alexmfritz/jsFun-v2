interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

/**
 * Animated skeleton placeholder for loading states.
 * Uses CSS custom properties for theme-aware colors.
 */
export default function Skeleton({
  width = '100%',
  height = '1em',
  borderRadius = '4px',
  className = '',
}: SkeletonProps) {
  return (
    <span
      className={`skeleton-pulse ${className}`}
      style={{
        display: 'block',
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--bg-raised)',
      }}
      aria-hidden="true"
    />
  );
}
