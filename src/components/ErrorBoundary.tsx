import { Component, ErrorInfo, ReactNode } from 'react';
import { useThemeStore } from '../auth/authstore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }: { error?: Error }) => {
  const { darkMode } = useThemeStore();
  
  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'}`}>
      <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
      <p className="mb-2">{error?.message || 'Unknown error occurred'}</p>
      <button 
        onClick={() => window.location.reload()}
        className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorBoundary;