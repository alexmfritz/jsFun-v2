import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tutorial from '../../src/components/shared/Tutorial';
import { UseTutorialResult } from '../../src/hooks/useTutorial';

function makeTutorial(overrides: Partial<UseTutorialResult> = {}): UseTutorialResult {
  return {
    isActive: true,
    currentStep: 0,
    step: {
      target: '[data-tutorial="logo"]',
      title: 'Welcome!',
      body: 'This is a test step.',
      placement: 'bottom',
    },
    totalSteps: 3,
    next: vi.fn(),
    back: vi.fn(),
    skip: vi.fn(),
    restart: vi.fn(),
    ...overrides,
  };
}

describe('Tutorial', () => {
  beforeEach(() => {
    // Create a target element for the tutorial to highlight
    const el = document.createElement('div');
    el.setAttribute('data-tutorial', 'logo');
    el.style.width = '100px';
    el.style.height = '40px';
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  });

  it('renders nothing when isActive is false', () => {
    const tutorial = makeTutorial({ isActive: false, step: null });
    const { container } = render(<Tutorial tutorial={tutorial} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders step title and body when active', () => {
    const tutorial = makeTutorial();
    render(<Tutorial tutorial={tutorial} />);
    expect(screen.getByText('Welcome!')).toBeTruthy();
    expect(screen.getByText('This is a test step.')).toBeTruthy();
  });

  it('shows step counter', () => {
    const tutorial = makeTutorial();
    render(<Tutorial tutorial={tutorial} />);
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();
  });

  it('shows Skip tour button', () => {
    const tutorial = makeTutorial();
    render(<Tutorial tutorial={tutorial} />);
    expect(screen.getByText('Skip tour')).toBeTruthy();
  });

  it('calls skip when Skip tour clicked', async () => {
    const user = userEvent.setup();
    const tutorial = makeTutorial();
    render(<Tutorial tutorial={tutorial} />);
    await user.click(screen.getByText('Skip tour'));
    expect(tutorial.skip).toHaveBeenCalledOnce();
  });

  it('calls next when Next clicked', async () => {
    const user = userEvent.setup();
    const tutorial = makeTutorial();
    render(<Tutorial tutorial={tutorial} />);
    await user.click(screen.getByText('Next'));
    expect(tutorial.next).toHaveBeenCalledOnce();
  });

  it('calls back when Back clicked', async () => {
    const user = userEvent.setup();
    const tutorial = makeTutorial({ currentStep: 1 });
    render(<Tutorial tutorial={tutorial} />);
    await user.click(screen.getByText('Back'));
    expect(tutorial.back).toHaveBeenCalledOnce();
  });

  it('disables Back button on first step', () => {
    const tutorial = makeTutorial({ currentStep: 0 });
    render(<Tutorial tutorial={tutorial} />);
    const backBtn = screen.getByText('Back');
    expect(backBtn.hasAttribute('disabled')).toBe(true);
  });

  it('shows Finish on last step', () => {
    const tutorial = makeTutorial({
      currentStep: 2,
      step: {
        target: '[data-tutorial="main"]',
        title: 'Done!',
        body: 'All set.',
        placement: 'top',
      },
    });
    render(<Tutorial tutorial={tutorial} />);
    expect(screen.getByText('Finish')).toBeTruthy();
  });

  it('renders step dots matching totalSteps', () => {
    const tutorial = makeTutorial({ totalSteps: 4 });
    const { container } = render(<Tutorial tutorial={tutorial} />);
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(4);
  });
});
