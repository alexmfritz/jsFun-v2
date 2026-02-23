import { Component, ReactNode } from 'react';

interface Props {
  section: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err.message };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error in {this.props.section}: {this.state.error}</div>;
    }
    return this.props.children;
  }
}
