import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import AdminView from '../../src/components/admin/AdminView';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('AdminView', () => {
  it('shows login form when not authenticated', () => {
    renderWithProviders(<AdminView />);
    expect(screen.getByRole('button', { name: /login|sign in/i })).toBeTruthy();
  });

  it('shows AddExerciseForm when authenticated', () => {
    renderWithProviders(<AdminView />, {
      preloadedState: { admin: { isAuthenticated: true, error: null } },
    });
    expect(screen.getByRole('heading', { name: 'Add Exercise' })).toBeTruthy();
  });

  it('shows login error when present', () => {
    renderWithProviders(<AdminView />, {
      preloadedState: { admin: { isAuthenticated: false, error: 'Invalid password' } },
    });
    expect(screen.getByText('Invalid password')).toBeTruthy();
  });
});
