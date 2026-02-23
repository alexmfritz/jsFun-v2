import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import LoginForm from '../../src/components/admin/LoginForm';
import { renderWithProviders } from '../helpers/renderWithProviders';

describe('LoginForm', () => {
  it('renders the login heading', () => {
    renderWithProviders(<LoginForm error={null} onLogin={vi.fn()} />);
    expect(screen.getByText('Admin Login')).toBeTruthy();
  });

  it('renders a password input', () => {
    renderWithProviders(<LoginForm error={null} onLogin={vi.fn()} />);
    const input = screen.getByPlaceholderText('Admin password');
    expect(input).toBeTruthy();
    expect(input.getAttribute('type')).toBe('password');
  });

  it('renders a Login button', () => {
    renderWithProviders(<LoginForm error={null} onLogin={vi.fn()} />);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('calls onLogin with the password on form submit', () => {
    const onLogin = vi.fn();
    renderWithProviders(<LoginForm error={null} onLogin={onLogin} />);
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByText('Login').closest('form')!);
    expect(onLogin).toHaveBeenCalledWith('secret123');
  });

  it('does not call onLogin when password is empty', () => {
    const onLogin = vi.fn();
    renderWithProviders(<LoginForm error={null} onLogin={onLogin} />);
    fireEvent.submit(screen.getByText('Login').closest('form')!);
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('does not call onLogin when password is only whitespace', () => {
    const onLogin = vi.fn();
    renderWithProviders(<LoginForm error={null} onLogin={onLogin} />);
    const input = screen.getByPlaceholderText('Admin password');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(screen.getByText('Login').closest('form')!);
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('does not show an error when error is null', () => {
    renderWithProviders(<LoginForm error={null} onLogin={vi.fn()} />);
    expect(screen.queryByText(/Invalid/i)).toBeNull();
  });

  it('shows the error message when error prop is set', () => {
    renderWithProviders(<LoginForm error="Invalid password" onLogin={vi.fn()} />);
    expect(screen.getByText('Invalid password')).toBeTruthy();
  });
});
