import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../../src/components/shared/ErrorBoundary';
import { renderWithProviders } from '../helpers/renderWithProviders';

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error noise from React error boundaries during tests
  const originalError = console.error;
  beforeAll(() => { console.error = vi.fn(); });
  afterAll(() => { console.error = originalError; });

  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('renders error UI when child throws', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(/something went wrong/i)).toBeTruthy();
  });

  it('displays error message', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Test error')).toBeTruthy();
  });

  it('shows section name in error message when provided', () => {
    renderWithProviders(
      <ErrorBoundary section="Editor">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/something went wrong in editor/i)).toBeTruthy();
  });

  it('renders Try Again button', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeTruthy();
  });

  it('recovers after clicking Try Again when error is resolved', async () => {
    const user = userEvent.setup();
    // We need a stateful wrapper to control whether the child throws
    let shouldThrow = true;
    function Wrapper() {
      // Re-renders will use current value of shouldThrow
      if (shouldThrow) throw new Error('Boom');
      return <div>Recovered</div>;
    }

    renderWithProviders(
      <ErrorBoundary>
        <Wrapper />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();

    // Fix the error before clicking Try Again
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Recovered')).toBeTruthy();
  });
});
