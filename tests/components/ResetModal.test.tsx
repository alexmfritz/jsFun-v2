import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetModal from '../../src/components/exercise/ResetModal';

function renderModal(overrides: Partial<Parameters<typeof ResetModal>[0]> = {}) {
  const defaults = {
    isOpen: true,
    isComplete: false,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
  return { ...render(<ResetModal {...defaults} />), ...defaults };
}

describe('ResetModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ResetModal isOpen={false} isComplete={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the dialog when isOpen is true', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Reset Exercise?')).toBeTruthy();
  });

  it('has proper ARIA attributes', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('reset-modal-title');
  });

  it('shows completion warning when isComplete is true', () => {
    renderModal({ isComplete: true });
    expect(screen.getByText(/Your completion status will also be removed/)).toBeTruthy();
  });

  it('does not show completion warning when isComplete is false', () => {
    renderModal({ isComplete: false });
    expect(screen.queryByText(/Your completion status will also be removed/)).toBeNull();
  });

  it('calls onConfirm when Reset button is clicked', async () => {
    const onConfirm = vi.fn();
    renderModal({ onConfirm });
    const user = userEvent.setup();

    await user.click(screen.getByText('Reset'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn();
    renderModal({ onCancel });
    const user = userEvent.setup();

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onCancel when overlay is clicked', async () => {
    const onCancel = vi.fn();
    renderModal({ onCancel });
    const user = userEvent.setup();

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not call onCancel when inner content is clicked', async () => {
    const onCancel = vi.fn();
    renderModal({ onCancel });
    const user = userEvent.setup();

    // Click on the title text inside the dialog content (not the overlay)
    await user.click(screen.getByText('Reset Exercise?'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when Escape key is pressed', async () => {
    const onCancel = vi.fn();
    renderModal({ onCancel });
    const user = userEvent.setup();

    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('focuses the first focusable element on open', () => {
    renderModal();
    // The first focusable element is the Cancel button
    expect(document.activeElement?.textContent).toBe('Cancel');
  });
});
