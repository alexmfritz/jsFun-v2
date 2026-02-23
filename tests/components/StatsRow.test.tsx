import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsRow from '../../src/components/dashboard/StatsRow';

const tierStats = [
  { tier: 1 as const, total: 10, done: 5 },
  { tier: 2 as const, total: 8, done: 3 },
  { tier: 3 as const, total: 6, done: 0 },
  { tier: 4 as const, total: 4, done: 4 },
  { tier: 5 as const, total: 2, done: 1 },
];

const typeStats = [
  { type: 'js' as const, total: 20, done: 8 },
  { type: 'html' as const, total: 5, done: 2 },
  { type: 'css' as const, total: 3, done: 1 },
  { type: 'html-css' as const, total: 2, done: 0 },
];

/** Match element whose textContent equals the given string (ignoring child structure). */
function textContentMatcher(text: string) {
  return (_content: string, element: Element | null) =>
    element?.textContent === text;
}

describe('StatsRow', () => {
  it('shows "By Tier" heading', () => {
    render(<StatsRow tierStats={tierStats} typeStats={typeStats} />);
    expect(screen.getByText('By Tier')).toBeTruthy();
  });

  it('shows "By Type" heading', () => {
    render(<StatsRow tierStats={tierStats} typeStats={typeStats} />);
    expect(screen.getByText('By Type')).toBeTruthy();
  });

  it('shows tier names from TIER_META', () => {
    render(<StatsRow tierStats={tierStats} typeStats={typeStats} />);
    expect(screen.getByText('Spark')).toBeTruthy();
    expect(screen.getByText('Foundations')).toBeTruthy();
    expect(screen.getByText('Builder')).toBeTruthy();
    expect(screen.getByText('Architect')).toBeTruthy();
    expect(screen.getByText('Mastercraft')).toBeTruthy();
  });

  it('shows done/total counts for tiers', () => {
    const { container } = render(<StatsRow tierStats={tierStats} typeStats={typeStats} />);
    // Counts render as "{done}/{total}" across text nodes within a span
    const tierPanel = container.querySelector('.grid > div:first-child')!;
    const countSpans = tierPanel.querySelectorAll('span[style*="tabular-nums"]');
    const counts = Array.from(countSpans).map((el) => el.textContent);
    expect(counts).toEqual(['5/10', '3/8', '0/6', '4/4', '1/2']);
  });

  it('shows done/total counts for types', () => {
    const { container } = render(<StatsRow tierStats={tierStats} typeStats={typeStats} />);
    const typePanel = container.querySelector('.grid > div:last-child')!;
    const countSpans = typePanel.querySelectorAll('span[style*="tabular-nums"]');
    const counts = Array.from(countSpans).map((el) => el.textContent);
    expect(counts).toEqual(['8/20', '2/5', '1/3', '0/2']);
  });

  it('hides tiers with total of 0', () => {
    const stats = [
      { tier: 1 as const, total: 5, done: 2 },
      { tier: 2 as const, total: 0, done: 0 },
    ];
    render(<StatsRow tierStats={stats} typeStats={typeStats} />);
    expect(screen.getByText('Spark')).toBeTruthy();
    expect(screen.queryByText('Foundations')).toBeNull();
  });

  it('hides types with total of 0', () => {
    const stats = [
      { type: 'js' as const, total: 10, done: 5 },
      { type: 'html' as const, total: 0, done: 0 },
    ];
    const { container } = render(<StatsRow tierStats={tierStats} typeStats={stats} />);
    // Only JS type should render (html has total 0)
    const typePanel = container.querySelector('.grid > div:last-child')!;
    const countSpans = typePanel.querySelectorAll('span[style*="tabular-nums"]');
    expect(countSpans).toHaveLength(1);
    expect(countSpans[0].textContent).toBe('5/10');
  });
});
