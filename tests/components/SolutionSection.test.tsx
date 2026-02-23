import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SolutionSection from '../../src/components/exercise/SolutionSection';

const defaultProps = {
  solution: 'function solve() { return 42; }',
  solutionUnlocked: false,
  expanded: false,
  onToggle: vi.fn(),
  uniqueAttempts: 0,
  gate: 10,
};

describe('SolutionSection', () => {
  it('shows locked state when solution is not unlocked', () => {
    render(<SolutionSection {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/Solution/)).toBeTruthy();
  });

  it('shows LockProgress when locked', () => {
    render(<SolutionSection {...defaultProps} uniqueAttempts={4} gate={10} />);
    // 10 - 4 = 6 more
    expect(screen.getByText('6 more')).toBeTruthy();
  });

  it('enables button when solution is unlocked', () => {
    render(<SolutionSection {...defaultProps} solutionUnlocked={true} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('does not show solution code when collapsed', () => {
    render(<SolutionSection {...defaultProps} solutionUnlocked={true} expanded={false} />);
    expect(screen.queryByText('function solve() { return 42; }')).toBeNull();
  });

  it('shows solution code when expanded and unlocked', () => {
    render(
      <SolutionSection {...defaultProps} solutionUnlocked={true} expanded={true} />
    );
    expect(screen.getByText('function solve() { return 42; }')).toBeTruthy();
  });

  it('calls onToggle when unlocked button is clicked', () => {
    const onToggle = vi.fn();
    render(<SolutionSection {...defaultProps} solutionUnlocked={true} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('does not call onToggle when locked button is clicked', () => {
    const onToggle = vi.fn();
    render(<SolutionSection {...defaultProps} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('sets aria-expanded when unlocked', () => {
    const { rerender } = render(
      <SolutionSection {...defaultProps} solutionUnlocked={true} expanded={false} />
    );
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');

    rerender(
      <SolutionSection {...defaultProps} solutionUnlocked={true} expanded={true} />
    );
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('does not set aria-expanded when locked', () => {
    render(<SolutionSection {...defaultProps} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBeNull();
  });

  it('renders solution in a pre element for code formatting', () => {
    render(
      <SolutionSection {...defaultProps} solutionUnlocked={true} expanded={true} />
    );
    const pre = screen.getByText('function solve() { return 42; }').closest('pre');
    expect(pre).toBeTruthy();
  });
});
