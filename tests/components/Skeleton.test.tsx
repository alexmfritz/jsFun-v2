import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from '../../src/components/shared/Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('1em');
    expect(el.style.borderRadius).toBe('4px');
  });

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width="200px" height="40px" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('40px');
  });

  it('applies custom borderRadius', () => {
    const { container } = render(<Skeleton borderRadius="50%" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.borderRadius).toBe('50%');
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('has the skeleton-pulse animation class', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains('skeleton-pulse')).toBe(true);
  });

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="mb-4" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains('skeleton-pulse')).toBe(true);
    expect(el.classList.contains('mb-4')).toBe(true);
  });

  it('renders as a span element', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('SPAN');
  });
});
