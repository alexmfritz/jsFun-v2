import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Toast from '../../src/components/shared/Toast';
import uiReducer from '../../src/features/uiSlice';
import exercisesReducer from '../../src/features/exercisesSlice';
import progressReducer from '../../src/features/progressSlice';
import adminReducer from '../../src/features/adminSlice';
import type { Toast as ToastType } from '../../src/types';

/** Create a test store with optional toast state */
function createTestStore(toast: ToastType | null = null) {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
      exercises: exercisesReducer,
      progress: progressReducer,
      admin: adminReducer,
    },
  });
  if (toast) {
    store.dispatch({ type: 'ui/showToast', payload: toast });
  }
  return store;
}

function renderWithStore(toast: ToastType | null = null) {
  const store = createTestStore(toast);
  const result = render(
    <Provider store={store}>
      <Toast />
    </Provider>
  );
  return { ...result, store };
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when toast is null', () => {
    const { container } = renderWithStore(null);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders error message with error icon', () => {
    renderWithStore({ message: 'Reset failed', type: 'error' });
    expect(screen.getByText('Reset failed')).toBeTruthy();
    // Error icon ✘
    expect(screen.getByText('✘')).toBeTruthy();
  });

  it('renders success message with success icon', () => {
    renderWithStore({ message: 'Exercise saved', type: 'success' });
    expect(screen.getByText('Exercise saved')).toBeTruthy();
    // Success icon ✔
    expect(screen.getByText('✔')).toBeTruthy();
  });

  it('renders warning message with warning icon', () => {
    renderWithStore({ message: 'Server slow', type: 'warning' });
    expect(screen.getByText('Server slow')).toBeTruthy();
    // Warning icon ⚠
    expect(screen.getByText('⚠')).toBeTruthy();
  });

  it('renders celebration message with star icon', () => {
    renderWithStore({ message: 'Nailed it!', type: 'celebration' });
    expect(screen.getByText('Nailed it!')).toBeTruthy();
    // Star icon ⭐
    expect(screen.getByText('\u2B50')).toBeTruthy();
  });

  it('uses accent color for celebration toast', () => {
    const { container } = renderWithStore({ message: 'Great job!', type: 'celebration' });
    const alertEl = container.querySelector('[role="alert"]') as HTMLElement;
    expect(alertEl.style.color).toBe('var(--accent)');
  });

  it('has role="alert" and aria-live="assertive" for accessibility', () => {
    const { container } = renderWithStore({ message: 'Error', type: 'error' });
    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).toBeTruthy();
    expect(alertEl?.getAttribute('aria-live')).toBe('assertive');
  });

  it('has a dismiss button with accessible label', () => {
    renderWithStore({ message: 'Error', type: 'error' });
    const dismissBtn = screen.getByLabelText('Dismiss notification');
    expect(dismissBtn).toBeTruthy();
  });

  it('dismiss button removes the toast when clicked', async () => {
    const { store, container } = renderWithStore({ message: 'Error', type: 'error' });
    expect(container.querySelector('[role="alert"]')).toBeTruthy();

    const dismissBtn = screen.getByLabelText('Dismiss notification');
    act(() => {
      dismissBtn.click();
    });

    // Toast should be removed from store
    expect(store.getState().ui.toast).toBeNull();
  });

  it('auto-dismisses after adaptive duration (short message)', () => {
    // "Short" = 5 chars → 3000 + 5*30 = 3150ms (clamped to 3000ms min)
    const { store } = renderWithStore({ message: 'Short', type: 'success' });
    expect(store.getState().ui.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(3150);
    });

    expect(store.getState().ui.toast).toBeNull();
  });

  it('does not auto-dismiss before adaptive duration', () => {
    // "Short" = 5 chars → 3150ms, so 3000ms should still be showing
    const { store } = renderWithStore({ message: 'Short', type: 'warning' });
    expect(store.getState().ui.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(store.getState().ui.toast).not.toBeNull();
  });

  it('longer messages get more display time', () => {
    // 100 chars → 3000 + 100*30 = 6000ms
    const longMsg = 'x'.repeat(100);
    const { store } = renderWithStore({ message: longMsg, type: 'error' });
    expect(store.getState().ui.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(5999);
    });
    expect(store.getState().ui.toast).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(store.getState().ui.toast).toBeNull();
  });
});
