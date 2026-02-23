import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Label shown in the error UI so the user knows which section crashed */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render errors in child components and displays a recovery UI
 * instead of white-screening the entire app.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center h-full gap-4 p-8"
          role="alert"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm font-heading" style={{ color: 'var(--text-primary)' }}>
            Something went wrong{this.props.section ? ` in ${this.props.section}` : ''}.
          </p>
          {this.state.error && (
            <pre
              className="text-xs max-w-md overflow-auto p-3 rounded"
              style={{
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-raised)',
                border: '1px solid var(--border)',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="text-sm px-4 py-2 rounded font-heading"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
