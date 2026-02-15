import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PublicView from './pages/PublicView';
import AdminPanel from './pages/AdminPanel';

// --- COMPONENTS: Protected Route ---
const ProtectedAdminRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
        return sessionStorage.getItem('ehs_admin_auth') === 'true';
    });
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === '0harm') {
            sessionStorage.setItem('ehs_admin_auth', 'true');
            setIsAuthenticated(true);
        } else {
            setError('Incorrect password');
            setPassword('');
        }
    };

    if (isAuthenticated) {
        return children;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
                    <p className="text-slate-500 text-sm mt-2">Please enter the password to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-center tracking-widest text-lg"
                            placeholder="••••••"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
                    >
                        Unlock Panel
                    </button>

                    <div className="text-center mt-6">
                        <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">← Back to Report View</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- ERROR BOUNDARY ---
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
                        <Route path="/admin" element={
                            <ProtectedAdminRoute>
                                <AdminPanel />
                            </ProtectedAdminRoute>
                        } />
                    </Routes>
                </Layout>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
