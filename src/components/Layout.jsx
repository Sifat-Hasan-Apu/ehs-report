import React from 'react';
import { Shield, FileText, Edit, Printer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isViewMode = location.pathname === '/';

    return (
        <div className="min-h-screen font-sans">
            {/* Top Navigation Bar with Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="text-brand-600 bg-brand-50 p-2 rounded-lg">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">EHS Report</h1>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Daily Monitor</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isViewMode ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>View Report</span>
                    </Link>
                    <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!isViewMode ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}`}
                    >
                        <Edit className="w-4 h-4" />
                        <span>Editor Panel</span>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
