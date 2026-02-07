import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PublicView from './pages/PublicView';
import AdminPanel from './pages/AdminPanel';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen font-mono text-red-900">
                    <h1 className="text-2xl font-bold mb-4">⚠️ Something went wrong</h1>
                    <p className="mb-4">The application crashed. Here are the details:</p>
                    <div className="bg-white p-4 rounded border border-red-200 overflow-auto whitespace-pre-wrap text-sm mb-4">
                        {this.state.error && this.state.error.toString()}
                    </div>
                    <details className="bg-white p-4 rounded border border-red-200 overflow-auto whitespace-pre-wrap text-xs">
                        <summary className="cursor-pointer font-bold mb-2">Stack Trace</summary>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => {
                            localStorage.removeItem('ehs_report_data');
                            window.location.reload();
                        }}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 active:scale-95 transition-transform"
                    >
                        Reset Data & Reload
                    </button>
                    <p className="mt-2 text-xs text-red-400 opacity-70">Warning: resetting data will clear any saved reports.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<PublicView />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </Layout>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
