import { Tier, TIER_META } from '../../types';

interface TierBadgeProps {
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

/**
 * Circular tier badge with Roman numeral label and tier color.
 */
export default function TierBadge({ tier, size = 'md', showName = false }: TierBadgeProps) {
  const meta = TIER_META[tier];
  const sizeMap = { sm: 18, md: 24, lg: 32 };
  const fontSizeMap = { sm: 9, md: 11, lg: 14 };
  const px = sizeMap[size];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="tier-badge flex-shrink-0"
        style={{
          width: px,
          height: px,
          fontSize: fontSizeMap[size],
          backgroundColor: meta.bgColor,
          border: `1px solid ${meta.borderColor}`,
          color: meta.color,
        }}
        title={`Tier ${meta.label}: ${meta.name}`}
      >
        {meta.label}
      </span>
      {showName && (
        <span className="text-xs" style={{ color: meta.color, fontFamily: 'Lexend, sans-serif' }}>
          {meta.name}
        </span>
      )}
    </span>
  );
}
