import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourcesSection from '../../src/components/exercise/ResourcesSection';
import type { Resource } from '../../src/types';

const resources: Resource[] = [
  { label: 'MDN Array docs', url: 'https://mdn.io/array', description: 'Reference for Array methods' },
  { label: 'JS Tutorial', url: 'https://example.com/tutorial' },
];

describe('ResourcesSection', () => {
  it('renders nothing when resources array is empty', () => {
    const { container } = render(
      <ResourcesSection resources={[]} expanded={false} onToggle={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows the "Learn More" button', () => {
    render(<ResourcesSection resources={resources} expanded={false} onToggle={vi.fn()} />);
    expect(screen.getByText(/Learn More/)).toBeTruthy();
  });

  it('does not show resource links when collapsed', () => {
    render(<ResourcesSection resources={resources} expanded={false} onToggle={vi.fn()} />);
    expect(screen.queryByText('MDN Array docs')).toBeNull();
  });

  it('shows resource links when expanded', () => {
    render(<ResourcesSection resources={resources} expanded={true} onToggle={vi.fn()} />);
    expect(screen.getByText('MDN Array docs')).toBeTruthy();
    expect(screen.getByText('JS Tutorial')).toBeTruthy();
  });

  it('shows resource descriptions when provided', () => {
    render(<ResourcesSection resources={resources} expanded={true} onToggle={vi.fn()} />);
    expect(screen.getByText('Reference for Array methods')).toBeTruthy();
  });

  it('calls onToggle when the button is clicked', () => {
    const onToggle = vi.fn();
    render(<ResourcesSection resources={resources} expanded={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByText(/Learn More/));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('sets aria-expanded correctly', () => {
    const { rerender } = render(
      <ResourcesSection resources={resources} expanded={false} onToggle={vi.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    rerender(<ResourcesSection resources={resources} expanded={true} onToggle={vi.fn()} />);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders links with target="_blank" and rel="noopener noreferrer"', () => {
    render(<ResourcesSection resources={resources} expanded={true} onToggle={vi.fn()} />);
    const link = screen.getByText('MDN Array docs').closest('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toBe('https://mdn.io/array');
  });
});
