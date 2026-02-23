import { describe, it, expect, vi } from 'vitest';
import { debounce, calcPercent, getTierColor, getTypeColor, getCategoryLabels } from '../../src/utils';

describe('debounce', () => {
  it('delays function invocation', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 60));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('calcPercent', () => {
  it('returns 0 for empty total', () => {
    expect(calcPercent(0, 0)).toBe(0);
  });
  it('calculates percentage correctly', () => {
    expect(calcPercent(1, 4)).toBe(25);
    expect(calcPercent(3, 4)).toBe(75);
    expect(calcPercent(4, 4)).toBe(100);
  });
  it('rounds to nearest integer', () => {
    expect(calcPercent(1, 3)).toBe(33);
  });
});

describe('getTierColor', () => {
  it('returns correct colors for each tier', () => {
    expect(getTierColor(1)).toBe('#34d399');
    expect(getTierColor(2)).toBe('#60a5fa');
    expect(getTierColor(3)).toBe('#818cf8');
    expect(getTierColor(4)).toBe('#c084fc');
    expect(getTierColor(5)).toBe('#f472b6');
  });
});

describe('getTypeColor', () => {
  it('returns correct colors for exercise types', () => {
    expect(getTypeColor('js')).toBe('#facc15');
    expect(getTypeColor('html')).toBe('#f472b6');
    expect(getTypeColor('css')).toBe('#22d3ee');
    expect(getTypeColor('html-css')).toBe('#a78bfa');
  });
});

describe('getCategoryLabels', () => {
  const categories = {
    'js-fundamentals': {
      label: 'JS Fundamentals',
      children: {
        operators: {
          label: 'Operators',
          children: {
            modulo: { label: 'Modulo' },
          },
        },
      },
    },
  };

  it('returns labels for full path', () => {
    const labels = getCategoryLabels(
      ['js-fundamentals', 'operators', 'modulo'],
      categories
    );
    expect(labels).toEqual(['JS Fundamentals', 'Operators', 'Modulo']);
  });

  it('returns partial labels if path is partial', () => {
    const labels = getCategoryLabels(['js-fundamentals', 'operators'], categories);
    expect(labels).toEqual(['JS Fundamentals', 'Operators']);
  });

  it('returns empty array for empty path', () => {
    expect(getCategoryLabels([], categories)).toEqual([]);
  });

  it('stops at unknown segment', () => {
    const labels = getCategoryLabels(['js-fundamentals', 'unknown'], categories);
    expect(labels).toEqual(['JS Fundamentals']);
  });
});
