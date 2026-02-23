import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import SaveIndicator from '../../src/components/exercise/SaveIndicator';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('SaveIndicator', () => {
  it('renders nothing when saveStatus is idle', () => {
    const { container } = renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { saveStatus: 'idle' } },
    });
    expect(container.textContent).toBe('');
  });

  it('renders "Saving..." when saveStatus is saving', () => {
    renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { saveStatus: 'saving' } },
    });
    expect(screen.getByText(/saving/i)).toBeTruthy();
  });

  it('renders "Saved" when saveStatus is saved', () => {
    renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { saveStatus: 'saved' } },
    });
    expect(screen.getByText(/saved/i)).toBeTruthy();
  });

  it('uses success color for saved state', () => {
    renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { saveStatus: 'saved' } },
    });
    const el = screen.getByText(/saved/i);
    expect(el.style.color).toBe('var(--success)');
  });

  it('uses muted color for saving state', () => {
    renderWithProviders(<SaveIndicator />, {
      preloadedState: { ui: { saveStatus: 'saving' } },
    });
    const el = screen.getByText(/saving/i);
    expect(el.style.color).toBe('var(--text-muted)');
  });
});
