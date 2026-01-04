
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    marginTop: '50px',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>Something went wrong.</h1>
                    <p style={{ marginTop: '16px' }}>We're sorry, but the application encountered an error.</p>
                    <details open style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: 'red', maxWidth: '600px', textAlign: 'left', padding: '20px', background: '#FEE2E2', borderRadius: '8px' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '24px',
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--primary-color)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9999px',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
