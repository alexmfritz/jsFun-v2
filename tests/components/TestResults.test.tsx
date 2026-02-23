import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TestResults from '../../src/components/exercise/TestResults';

const pass = (desc: string) => ({ description: desc, pass: true });
const fail = (desc: string, got?: unknown) => ({ description: desc, pass: false, got });

describe('TestResults', () => {
  it('shows "Running tests…" when isRunning is true', () => {
    render(<TestResults results={[]} isRunning={true} />);
    expect(screen.getByText('Running tests…')).toBeTruthy();
  });

  it('shows "Press Ctrl+Enter" prompt when results are empty and not running', () => {
    render(<TestResults results={[]} isRunning={false} />);
    expect(screen.getByText('Press Ctrl+Enter to run tests')).toBeTruthy();
  });

  it('shows "All Passing" when every test passes', () => {
    const results = [pass('adds numbers'), pass('handles zero')];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('All Passing')).toBeTruthy();
  });

  it('shows pass/fail count when some tests fail', () => {
    const results = [pass('adds numbers'), fail('subtracts numbers')];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('1 / 2 Passing')).toBeTruthy();
  });

  it('shows all tests failing correctly', () => {
    const results = [fail('test one'), fail('test two'), fail('test three')];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('0 / 3 Passing')).toBeTruthy();
  });

  it('renders each test description', () => {
    const results = [pass('adds numbers'), fail('handles negative')];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('adds numbers')).toBeTruthy();
    expect(screen.getByText('handles negative')).toBeTruthy();
  });

  it('shows "Got:" value for failing tests with a got field', () => {
    const results = [fail('returns correct sum', 42)];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('Got: 42')).toBeTruthy();
  });

  it('shows "Got:" value for string results', () => {
    const results = [fail('returns greeting', 'wrong')];
    render(<TestResults results={results} isRunning={false} />);
    expect(screen.getByText('Got: "wrong"')).toBeTruthy();
  });

  it('does not show "Got:" for passing tests', () => {
    const results = [pass('returns greeting')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    const gotElements = container.querySelectorAll('.font-code');
    expect(gotElements.length).toBe(0);
  });

  it('has aria-live attribute on the results container', () => {
    const results = [pass('test one')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });

  it('has role="status" on the results container', () => {
    const results = [pass('test one')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    const statusRegion = container.querySelector('[role="status"]');
    expect(statusRegion).toBeTruthy();
  });

  it('has aria-atomic on the summary bar', () => {
    const results = [pass('test one')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    const atomicRegion = container.querySelector('[aria-atomic="true"]');
    expect(atomicRegion).toBeTruthy();
  });

  it('renders progress bar with correct width for partial passing', () => {
    const results = [pass('one'), pass('two'), fail('three'), fail('four')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    // The inner progress bar should have width of 50%
    const bars = container.querySelectorAll('.rounded-full');
    // The inner bar (second rounded-full) should have width style
    const innerBar = bars[1] as HTMLElement;
    expect(innerBar).toBeTruthy();
    expect(innerBar.style.width).toBe('50%');
  });

  it('renders individual result items with correct CSS', () => {
    const results = [pass('passing test'), fail('failing test')];
    const { container } = render(<TestResults results={results} isRunning={false} />);
    const resultItems = container.querySelectorAll('.test-result');
    expect(resultItems.length).toBe(2);
  });
});
