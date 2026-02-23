import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HelpModal from '../../src/components/shared/HelpModal';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('HelpModal', () => {
  it('renders nothing when showHelpModal is false', () => {
    const { container } = renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: false } },
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders modal when showHelpModal is true', () => {
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Help')).toBeTruthy();
  });

  it('shows Getting Started tab by default', () => {
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    expect(screen.getByText('How it works')).toBeTruthy();
  });

  it('switches to Shortcuts tab on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByText('Shortcuts'));
    expect(screen.getByText('Ctrl + Enter')).toBeTruthy();
  });

  it('switches to Tier System tab on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByText('Tier System'));
    expect(screen.getByText('Spark')).toBeTruthy();
    expect(screen.getByText('Mastercraft')).toBeTruthy();
  });

  it('switches to Tips tab on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByText('Tips'));
    expect(screen.getByText('Read the tests')).toBeTruthy();
    expect(screen.getByText('Start small')).toBeTruthy();
  });

  it('has close button with correct aria-label', () => {
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    expect(screen.getByLabelText('Close help')).toBeTruthy();
  });

  it('closes modal when close button clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByLabelText('Close help'));
    expect((store.getState() as { ui: { showHelpModal: boolean } }).ui.showHelpModal).toBe(false);
  });

  it('shows Restart Tutorial button when onRestartTutorial is provided', () => {
    const onRestart = vi.fn();
    renderWithProviders(<HelpModal onRestartTutorial={onRestart} />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    expect(screen.getByText('Restart Tutorial')).toBeTruthy();
  });

  it('does not show Restart Tutorial button when onRestartTutorial is omitted', () => {
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    expect(screen.queryByText('Restart Tutorial')).toBeNull();
  });

  it('calls onRestartTutorial when Restart Tutorial clicked', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    renderWithProviders(<HelpModal onRestartTutorial={onRestart} />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByText('Restart Tutorial'));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('renders all 5 tiers in Tier System tab', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HelpModal />, {
      preloadedState: { ui: { showHelpModal: true } },
    });
    await user.click(screen.getByText('Tier System'));
    expect(screen.getByText('I')).toBeTruthy();
    expect(screen.getByText('II')).toBeTruthy();
    expect(screen.getByText('III')).toBeTruthy();
    expect(screen.getByText('IV')).toBeTruthy();
    expect(screen.getByText('V')).toBeTruthy();
  });
});
