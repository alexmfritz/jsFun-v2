import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreCard from '../../src/components/dashboard/ScoreCard';

describe('ScoreCard', () => {
  const defaultProps = {
    filteredPct: 75,
    filteredCompleted: 15,
    filteredCount: 20,
    filterLabel: 'Overall',
  };

  it('displays the percentage', () => {
    render(<ScoreCard {...defaultProps} />);
    expect(screen.getByText('75')).toBeTruthy();
  });

  it('displays the percent symbol', () => {
    render(<ScoreCard {...defaultProps} />);
    expect(screen.getByText('%')).toBeTruthy();
  });

  it('displays the filter label', () => {
    render(<ScoreCard {...defaultProps} />);
    expect(screen.getByText('Overall')).toBeTruthy();
  });

  it('displays completed/total exercise count', () => {
    render(<ScoreCard {...defaultProps} />);
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText(/of 20 exercises/)).toBeTruthy();
  });

  it('displays remaining count', () => {
    render(<ScoreCard {...defaultProps} />);
    expect(screen.getByText('5 remaining')).toBeTruthy();
  });

  it('renders a progress bar with correct aria attributes', () => {
    render(<ScoreCard {...defaultProps} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('75');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('includes filter label in progressbar aria-label', () => {
    render(<ScoreCard {...defaultProps} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-label')).toContain('Overall');
    expect(progressbar.getAttribute('aria-label')).toContain('15 of 20');
  });

  it('handles 0% correctly', () => {
    render(<ScoreCard {...defaultProps} filteredPct={0} filteredCompleted={0} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0');
    expect(screen.getByText('20 remaining')).toBeTruthy();
  });

  it('handles 100% correctly', () => {
    render(<ScoreCard {...defaultProps} filteredPct={100} filteredCompleted={20} />);
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('0 remaining')).toBeTruthy();
  });
});
