import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import TierBadge from '../../src/components/shared/TierBadge';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('TierBadge', () => {
  it('renders Roman numeral label for tier 1', () => {
    renderWithProviders(<TierBadge tier={1} />);
    expect(screen.getByText('I')).toBeTruthy();
  });

  it('renders Roman numeral label for tier 3', () => {
    renderWithProviders(<TierBadge tier={3} />);
    expect(screen.getByText('III')).toBeTruthy();
  });

  it('has a title with tier info', () => {
    renderWithProviders(<TierBadge tier={2} />);
    expect(screen.getByTitle('Tier II: Foundations')).toBeTruthy();
  });

  it('shows tier name when showName is true', () => {
    renderWithProviders(<TierBadge tier={1} showName />);
    expect(screen.getByText('Spark')).toBeTruthy();
  });

  it('does not show tier name by default', () => {
    renderWithProviders(<TierBadge tier={1} />);
    expect(screen.queryByText('Spark')).toBeNull();
  });

  it('renders all five tiers correctly', () => {
    const tiers = [
      { tier: 1 as const, label: 'I', name: 'Spark' },
      { tier: 2 as const, label: 'II', name: 'Foundations' },
      { tier: 3 as const, label: 'III', name: 'Builder' },
      { tier: 4 as const, label: 'IV', name: 'Architect' },
      { tier: 5 as const, label: 'V', name: 'Mastercraft' },
    ];
    for (const { tier, label, name } of tiers) {
      const { unmount } = renderWithProviders(<TierBadge tier={tier} showName />);
      expect(screen.getByText(label)).toBeTruthy();
      expect(screen.getByText(name)).toBeTruthy();
      unmount();
    }
  });
});
