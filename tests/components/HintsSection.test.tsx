import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HintsSection from '../../src/components/exercise/HintsSection';

// HINT_GATES = [3, 6, 9]

describe('HintsSection', () => {
  const hints = ['Use Array.prototype.map', 'Consider edge cases', 'Try recursion'];

  it('renders nothing when hints array is empty', () => {
    const { container } = render(
      <HintsSection hints={[]} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={0} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows locked hints when below attempt thresholds', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={0} />
    );
    // All three hints should be locked
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('unlocks hint 1 at 3 unique attempts', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={3} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });

  it('unlocks hint 2 at 6 unique attempts', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={6} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
    expect(buttons[2]).toBeDisabled();
  });

  it('unlocks all hints at 9 unique attempts', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={9} />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });

  it('calls onToggleHint with correct index when unlocked hint is clicked', () => {
    const onToggleHint = vi.fn();
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={onToggleHint} uniqueAttempts={3} />
    );
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onToggleHint).toHaveBeenCalledWith(0);
  });

  it('does not call onToggleHint when a locked hint button is clicked', () => {
    const onToggleHint = vi.fn();
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={onToggleHint} uniqueAttempts={0} />
    );
    // Locked buttons are disabled so click won't fire, but verify the handler isn't called
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onToggleHint).not.toHaveBeenCalled();
  });

  it('shows hint content when expanded', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set([0])} onToggleHint={vi.fn()} uniqueAttempts={3} />
    );
    expect(screen.getByText('Use Array.prototype.map')).toBeTruthy();
  });

  it('hides hint content when not in expandedHints set', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={3} />
    );
    expect(screen.queryByText('Use Array.prototype.map')).toBeNull();
  });

  it('shows LockProgress for locked hints', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={1} />
    );
    // Hint 1 needs 3 attempts, we have 1 → "2 more"
    expect(screen.getByText('2 more')).toBeTruthy();
  });

  it('sets aria-expanded on unlocked hints', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set([0])} onToggleHint={vi.fn()} uniqueAttempts={3} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('does not set aria-expanded on locked hints', () => {
    render(
      <HintsSection hints={hints} expandedHints={new Set()} onToggleHint={vi.fn()} uniqueAttempts={0} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].getAttribute('aria-expanded')).toBeNull();
  });
});
