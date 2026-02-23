import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LockProgress from '../../src/components/exercise/LockProgress';

describe('LockProgress', () => {
  it('shows remaining count when below threshold', () => {
    render(<LockProgress current={1} needed={3} />);
    expect(screen.getByText('2 more')).toBeTruthy();
  });

  it('shows 0 more when current equals needed', () => {
    render(<LockProgress current={3} needed={3} />);
    expect(screen.getByText('0 more')).toBeTruthy();
  });

  it('clamps remaining to 0 when current exceeds needed', () => {
    render(<LockProgress current={5} needed={3} />);
    expect(screen.getByText('0 more')).toBeTruthy();
  });

  it('renders a progress bar that fills proportionally', () => {
    const { container } = render(<LockProgress current={1} needed={4} />);
    const bar = container.querySelectorAll('span > span > span');
    // Inner bar width should be 25%
    expect((bar[0] as HTMLElement).style.width).toBe('25%');
  });

  it('caps progress bar at 100%', () => {
    const { container } = render(<LockProgress current={10} needed={3} />);
    const bar = container.querySelectorAll('span > span > span');
    expect((bar[0] as HTMLElement).style.width).toBe('100%');
  });
});
