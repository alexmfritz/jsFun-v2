import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstructionsPanel from '../../src/components/exercise/InstructionsPanel';
import { renderWithProviders, makeExercise } from '../helpers/renderWithProviders';

describe('InstructionsPanel', () => {
  const exercise = makeExercise({
    id: 42,
    title: 'Flatten Arrays',
    tier: 2,
    type: 'js',
    instructions: '## Task\n\nFlatten the array.',
    hint: 'Use recursion.',
    resources: [{ title: 'MDN', url: 'https://mdn.io' }],
    solution: 'function flatten(arr) { return arr.flat(Infinity); }',
  });

  const defaultProps = {
    exercise,
    activeTab: 'instructions' as const,
    onTabChange: vi.fn(),
    children: <div>Tab content</div>,
    testResultCount: 0,
    testPassCount: 0,
  };

  it('renders exercise title', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    expect(screen.getByText('Flatten Arrays')).toBeTruthy();
  });

  it('renders exercise ID', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    expect(screen.getByText('#42')).toBeTruthy();
  });

  it('renders Instructions and Results tabs', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    expect(screen.getByRole('tab', { name: 'Instructions' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Results' })).toBeTruthy();
  });

  it('renders tablist with aria-label', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    expect(screen.getByRole('tablist', { name: 'Exercise panels' })).toBeTruthy();
  });

  it('marks active tab with aria-selected', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    const instructionsTab = screen.getByRole('tab', { name: 'Instructions' });
    expect(instructionsTab.getAttribute('aria-selected')).toBe('true');
  });

  it('shows Preview tab for non-JS exercises', () => {
    const htmlExercise = makeExercise({ id: 43, type: 'html', title: 'HTML Ex' });
    renderWithProviders(
      <InstructionsPanel {...defaultProps} exercise={htmlExercise} />,
    );
    expect(screen.getByRole('tab', { name: 'Preview' })).toBeTruthy();
  });

  it('does not show Preview tab for JS exercises', () => {
    renderWithProviders(<InstructionsPanel {...defaultProps} />);
    expect(screen.queryByRole('tab', { name: 'Preview' })).toBeNull();
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    renderWithProviders(
      <InstructionsPanel {...defaultProps} onTabChange={onTabChange} />,
    );
    await user.click(screen.getByRole('tab', { name: 'Results' }));
    expect(onTabChange).toHaveBeenCalledWith('results');
  });

  it('shows test result count in Results tab label', () => {
    renderWithProviders(
      <InstructionsPanel {...defaultProps} testResultCount={5} testPassCount={3} />,
    );
    expect(screen.getByRole('tab', { name: 'Results (3/5)' })).toBeTruthy();
  });

  it('renders children when not on instructions tab', () => {
    renderWithProviders(
      <InstructionsPanel {...defaultProps} activeTab="results" />,
    );
    expect(screen.getByText('Tab content')).toBeTruthy();
  });
});
