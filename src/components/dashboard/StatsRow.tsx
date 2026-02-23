import { Tier, ExerciseType, TIER_META, TYPE_META } from '../../types';
import { calcPercent } from '../../utils';
import TierBadge from '../shared/TierBadge';
import TypeBadge from '../shared/TypeBadge';

interface TierStat {
  tier: Tier;
  total: number;
  done: number;
}

interface TypeStat {
  type: ExerciseType;
  total: number;
  done: number;
}

interface StatsRowProps {
  tierStats: TierStat[];
  typeStats: TypeStat[];
}

/**
 * Side-by-side "By Tier" and "By Type" stat panels with progress bars.
 */
export default function StatsRow({ tierStats, typeStats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* By Tier */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <h2
          className="font-heading font-semibold text-sm mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          By Tier
        </h2>
        <div className="flex flex-col gap-2">
          {tierStats.map(({ tier, done, total }) => {
            if (total === 0) return null;
            const meta = TIER_META[tier];
            const pct = calcPercent(done, total);
            return (
              <div key={tier} className="flex items-center gap-2 text-xs">
                <TierBadge tier={tier} size="sm" />
                <span style={{ color: 'var(--text-muted)', width: '80px', fontFamily: 'Lexend, sans-serif' }}>
                  {meta.name}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: meta.color }}
                  />
                </div>
                <span style={{ color: 'var(--text-faint)', width: '40px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {done}/{total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Type */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <h2
          className="font-heading font-semibold text-sm mb-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          By Type
        </h2>
        <div className="flex flex-col gap-2">
          {typeStats.map(({ type, done, total }) => {
            if (total === 0) return null;
            const meta = TYPE_META[type];
            const pct = calcPercent(done, total);
            return (
              <div key={type} className="flex items-center gap-2 text-xs">
                <TypeBadge type={type} />
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: meta.color }}
                  />
                </div>
                <span style={{ color: 'var(--text-faint)', width: '40px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {done}/{total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
