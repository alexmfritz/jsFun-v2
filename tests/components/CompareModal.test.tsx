import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareModal from '../../src/components/exercise/CompareModal';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('CompareModal', () => {
  const defaultProps = {
    isOpen: true,
    studentCode: 'function solve() { return 42; }',
    referenceCode: 'function solve() { return 21 * 2; }',
    language: 'js' as const,
    onClose: vi.fn(),
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = renderWithProviders(
      <CompareModal {...defaultProps} isOpen={false} />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(<CompareModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('shows "Compare Solutions" heading', () => {
    renderWithProviders(<CompareModal {...defaultProps} />);
    expect(screen.getByText('Compare Solutions')).toBeTruthy();
  });

  it('shows "Your Solution" and "Reference Solution" labels', () => {
    renderWithProviders(<CompareModal {...defaultProps} />);
    expect(screen.getByText('Your Solution')).toBeTruthy();
    expect(screen.getByText('Reference Solution')).toBeTruthy();
  });

  it('has close button with aria-label', () => {
    renderWithProviders(<CompareModal {...defaultProps} />);
    expect(screen.getByLabelText('Close comparison')).toBeTruthy();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<CompareModal {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByLabelText('Close comparison'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<CompareModal {...defaultProps} onClose={onClose} />);
    // Click the backdrop (the outer div with role="dialog")
    const dialog = screen.getByRole('dialog');
    await user.click(dialog);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has two code editors', () => {
    const { container } = renderWithProviders(<CompareModal {...defaultProps} />);
    const editors = container.querySelectorAll('[data-testid="code-editor"]');
    expect(editors.length).toBe(2);
  });

  it('has proper aria attributes', () => {
    renderWithProviders(<CompareModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('compare-modal-title');
  });
});
