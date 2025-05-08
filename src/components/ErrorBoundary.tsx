import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Wrapper to access theme context in class component
const ErrorBoundaryWithTheme: React.FC<Props> = ({ children }) => {
  const { theme } = useTheme();
  return <ErrorBoundaryClass theme={theme}>{children}</ErrorBoundaryClass>;
};

class ErrorBoundaryClass extends Component<Props & { theme: 'professional' | 'personal' }, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isProfessional = this.props.theme === 'professional';

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
          isProfessional ? 'bg-gray-50' : 'bg-black'
        }`}>
          <div className={`max-w-md w-full p-8 rounded-lg shadow-xl ${
            isProfessional 
              ? 'bg-white border border-gray-200' 
              : 'bg-gray-900 border border-amber-900'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isProfessional ? 'text-gray-800' : 'text-amber-500 font-serif'
            }`}>
              {isProfessional ? 'Something went wrong' : 'A Dark Force Intervenes'}
            </h2>
            
            <p className={`mb-6 ${
              isProfessional ? 'text-gray-600' : 'text-amber-200'
            }`}>
              {isProfessional
                ? 'An error occurred while rendering this component.'
                : 'A mysterious force has disrupted the magic powering this realm.'}
            </p>

            {this.state.error && (
              <pre className={`p-4 rounded mb-6 text-sm overflow-auto ${
                isProfessional 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-gray-800 text-amber-200 border border-amber-900'
              }`}>
                {this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className={`w-full py-2 px-4 rounded transition-colors duration-300 ${
                isProfessional
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-amber-800 hover:bg-amber-900 text-amber-100 border border-amber-700 font-serif'
              }`}
            >
              {isProfessional ? 'Reload Page' : 'Restore the Realm'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithTheme;