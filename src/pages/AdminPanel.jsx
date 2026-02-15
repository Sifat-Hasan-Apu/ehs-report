import React, { useState, useEffect } from 'react';
import { Shield, Save, Upload, Plus, Flame, Trash2, Activity, ArrowDown, ClipboardCheck, XCircle, CheckCircle, UploadCloud, Calendar, FileText, Target, Check, BookOpen, UserCheck, Leaf, Droplet, Info, Minus, AlertTriangle, AlertCircle, Construction, X, Cloud } from 'lucide-react';
import { useReportData, getCurrentPeriod, MONTH_NAMES } from '../hooks/useReportData';
import FireIncidentForm from '../components/FireIncidentForm';
import FirstAidIncidentForm from '../components/FirstAidIncidentForm';
import FFHIncidentForm from '../components/FFHIncidentForm';

const SECTIONS = [
    "Basic Information", "Policy & Objectives", "KPIs",
    "Site Inspections", "Incidents", "Programs",
    "High Risk Controls", "Environment",
    "Challenges", "Improvement Plan"
];

const AdminPanel = () => {
    const currentPeriod = getCurrentPeriod();
    const [selectedYear, setSelectedYear] = useState(currentPeriod.year);
    const [selectedMonth, setSelectedMonth] = useState(currentPeriod.month);

    const [activeSection, setActiveSection] = useState(0);
    const { reportData, updateSection, setReportData } = useReportData(selectedYear, selectedMonth);
    const [showFireIncidentForm, setShowFireIncidentForm] = useState(false);
    const [showFirstAidIncidentForm, setShowFirstAidIncidentForm] = useState(false);
    const [showFFHIncidentForm, setShowFFHIncidentForm] = useState(false);
    const [editingIncident, setEditingIncident] = useState(null);

    // Derive incident lists directly from reportData to avoid state desync
    // Safety check: reportData might be partial if loading, so default to empty arrays
    const fireIncidents = reportData?.incidents?.fireIncidents || [];
    const firstAidIncidents = reportData?.incidents?.firstAidIncidents || [];
    const ffhIncidents = reportData?.incidents?.ffhIncidents || [];

    // Local state for the current section form (Basic Info, Policy, etc.)
    const [formData, setFormData] = useState({});
    const [newObjective, setNewObjective] = useState('');
    const [newChallenge, setNewChallenge] = useState('');
    const [newSupport, setNewSupport] = useState('');

    const handleAddObjective = () => {
        if (!newObjective.trim()) return;
        setFormData(prev => ({
            ...prev,
            objectives: [...(prev.objectives || []), newObjective.trim()]
        }));
        setNewObjective('');
    };

    const handleRemoveObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    const handleAddChallenge = () => {
        if (!newChallenge.trim()) return;
        setFormData(prev => ({
            ...prev,
            challenges: [...(prev.challenges || []), newChallenge.trim()]
        }));
        setNewChallenge('');
    };

    const handleRemoveChallenge = (index) => {
        setFormData(prev => ({
            ...prev,
            challenges: (prev.challenges || []).filter((_, i) => i !== index)
        }));
    };

    const handleAddSupport = () => {
        if (!newSupport.trim()) return;
        setFormData(prev => ({
            ...prev,
            supportNeeded: [...(prev.supportNeeded || []), newSupport.trim()]
        }));
        setNewSupport('');
    };

    const handleRemoveSupport = (index) => {
        setFormData(prev => ({
            ...prev,
            supportNeeded: (prev.supportNeeded || []).filter((_, i) => i !== index)
        }));
    };


    // Auto-Save State & Logic
    const [saveStatus, setSaveStatus] = useState('saved'); // saved, saving, error
    const [lastSaved, setLastSaved] = useState(null);
    const isFirstRun = React.useRef(true);

    const SECTION_KEYS = [
        'basicInfo', 'policyObjectives', 'kpis',
        'siteInspections', 'incidents', 'programs',
        'highRiskWork', 'environment',
        'issues', 'improvementPlan'
    ];

    // Reset save status when form data changes so user can save again immediately
    useEffect(() => {
        if (saveStatus === 'saved' || saveStatus === 'error') {
            setSaveStatus('idle');
        }
    }, [formData]);

    // Manual Save Logic
    const handleManualSave = async () => {
        setSaveStatus('saving');
        const currentSectionKey = SECTION_KEYS[activeSection];
        const currentFormData = { ...formData }; // Capture current state

        try {
            await updateSection(currentSectionKey, currentFormData);
            setSaveStatus('saved');
            setLastSaved(new Date());

            // Show success feedback briefly then revert to Save button
            setTimeout(() => {
                setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
            }, 2000);
        } catch (error) {
            console.error('Manual save failed:', error);
            setSaveStatus('error');
        }
    };

    // Toggle Publish/Draft status
    const handleTogglePublish = () => {
        const newStatus = reportData.status === 'published' ? 'draft' : 'published';
        setReportData(prev => ({
            ...prev,
            status: newStatus
        }));
        alert(`Report ${newStatus === 'published' ? 'Published' : 'Unpublished'} successfully!`);
    };

    // Manual Save - Removed as per user request (Auto-save is sufficient)

    // Sync form data when switching sections
    useEffect(() => {
        const sectionKeys = [
            'basicInfo', 'policyObjectives', 'kpis',
            'siteInspections', 'incidents', 'programs',
            'highRiskWork', 'environment',
            'issues', 'improvementPlan'
        ];
        const currentKey = sectionKeys[activeSection];
        // Only set form data if it exists
        if (reportData && reportData[currentKey]) {
            setFormData(reportData[currentKey]);
        } else {
            setFormData({});
        }
    }, [activeSection, reportData]);

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleManpowerChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            manpower: {
                ...prev.manpower,
                [name]: value
            }
        }));
    };

    const handlePreparedByChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            preparedBy: {
                ...prev.preparedBy,
                [name]: value
            }
        }));
    };

    // Helper to update incidents
    const handleUpdateIncidents = (type, updatedList) => {
        updateSection('incidents', {
            ...(reportData?.incidents || {}),
            [type]: updatedList
        });
    };

    return (
        <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-500">
            {/* Mobile: Dropdown Section Selector */}
            <div className="md:hidden sticky top-14 z-30 bg-slate-200 -mx-3 px-3 pb-3 pt-2">
                {/* Period Selector - Compact */}
                <div className="flex items-center gap-2 mb-3 bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                    <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg p-2 outline-none"
                    >
                        {MONTH_NAMES.map((name, idx) => (
                            <option key={idx + 1} value={idx + 1}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-20 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg p-2 outline-none"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                {/* Section Dropdown Selector */}
                <div className="relative">
                    <select
                        value={activeSection}
                        onChange={(e) => setActiveSection(parseInt(e.target.value))}
                        className="w-full appearance-none bg-brand-600 text-white text-sm font-bold rounded-xl p-3 pr-10 shadow-md focus:ring-2 focus:ring-brand-400 outline-none cursor-pointer"
                    >
                        {SECTIONS.map((item, idx) => (
                            <option key={idx} value={idx} className="bg-white text-slate-800">
                                {idx + 1}. {item}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Mobile Status Bar */}
                <div className="mt-3 bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${reportData.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            <span className={`text-xs font-bold ${reportData.status === 'published' ? 'text-green-700' : 'text-amber-700'}`}>
                                {reportData.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                        </div>
                        {/* Save Status / Manual Save Button */}
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={handleManualSave}
                                disabled={saveStatus === 'saving'}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${saveStatus === 'saved'
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40 border-t border-white/20 border-b border-black/10'
                                    : 'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-white shadow-brand-500/40 hover:shadow-brand-500/60 hover:-translate-y-0.5 active:scale-95 border-t border-white/20 border-b-2 border-brand-800/20'
                                    }`}
                            >
                                {saveStatus === 'saving' ? (
                                    <><Cloud className="w-3 h-3 animate-bounce" /> Saving...</>
                                ) : saveStatus === 'saved' ? (
                                    <><Check className="w-3 h-3" /> Saved!</>
                                ) : (
                                    <><Save className="w-3 h-3" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleTogglePublish}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${reportData.status === 'published'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-green-600 text-white shadow-md shadow-green-200'
                            }`}
                    >
                        {reportData.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Desktop: Sidebar Navigation */}
            <div className="hidden md:block md:col-span-1 space-y-4">
                {/* Year/Month Selector */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <h3 className="font-bold text-slate-800 text-sm">Report Period</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 p-2.5 transition-all outline-none"
                            >
                                {[2024, 2025, 2026, 2027, 2028].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Month</label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 p-2.5 transition-all outline-none"
                            >
                                {MONTH_NAMES.map((name, idx) => (
                                    <option key={idx + 1} value={idx + 1}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 text-center">
                        Editing: <span className="font-bold text-brand-600">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 text-sm">Report Status</h3>
                        <div className={`w-2 h-2 rounded-full ${reportData.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    </div>
                    <div className={`p-3 rounded-xl mb-4 text-center ${reportData.status === 'published'
                        ? 'bg-green-50 border border-green-100'
                        : 'bg-amber-50 border border-amber-100'
                        }`}>
                        <span className={`block text-xs font-bold mb-1 ${reportData.status === 'published' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                            CURRENTLY
                        </span>
                        <span className={`text-lg font-black ${reportData.status === 'published' ? 'text-green-700' : 'text-amber-700'
                            }`}>
                            {reportData.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                    </div>
                    <button
                        onClick={handleTogglePublish}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${reportData.status === 'published'
                            ? 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-200 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {reportData.status === 'published' ? (
                            <>
                                <X className="w-4 h-4" /> Unpublish
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" /> Publish Now
                            </>
                        )}
                    </button>
                </div>
                <nav className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {SECTIONS.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSection(idx)}
                            className={`w-full text-left px-5 py-4 text-sm font-medium border-b border-slate-50 last:border-0 transition-all flex items-center gap-3 ${activeSection === idx
                                ? 'bg-brand-50 text-brand-700 border-l-4 border-l-brand-500'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-colors ${activeSection === idx ? 'bg-brand-200 text-brand-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {idx + 1}
                            </span>
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Editor Area */}
            <div className="md:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm md:text-xl font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none tracking-tighter md:tracking-normal">{SECTIONS[activeSection]}</h2>
                                <span className="md:hidden text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                    #{activeSection + 1}
                                </span>
                                {/* Status Badge */}
                                <span className={`hidden md:inline text-xs font-bold px-2 py-1 rounded ${reportData.status === 'published'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}>
                                    {reportData.status === 'published' ? '✓ PUBLISHED' : '● DRAFT'}
                                </span>
                            </div>
                            <p className="text-xs md:text-sm text-slate-500 hidden md:block">Section {activeSection + 1}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Manual Save Button for Desktop */}
                            <button
                                onClick={handleManualSave}
                                disabled={saveStatus === 'saving'}
                                className={`group relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg ${saveStatus === 'saved'
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40 border-t border-white/20 border-b border-black/10 scale-105'
                                    : 'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-white shadow-brand-500/40 hover:shadow-brand-500/60 hover:-translate-y-0.5 hover:scale-105 active:scale-95 border-t border-white/20 border-b-2 border-brand-800/20'
                                    }`}
                            >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                                <div className="relative z-10 flex items-center gap-2">
                                    {saveStatus === 'saving' ? (
                                        <>
                                            <Cloud className="w-4 h-4 animate-bounce" />
                                            Saving...
                                        </>
                                    ) : saveStatus === 'saved' ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Saved Successfully
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        {activeSection === 0 && (
                            <div className="space-y-6 max-w-2xl">
                                {/* Company Branding Section */}
                                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-brand-600" />
                                        Company Branding (for PDF)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName || ''}
                                                onChange={handleBasicInfoChange}
                                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. United Chattogram Power Limited"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                                                {/* Placeholder for fixed logo - user should place logo.png in public folder */}
                                                <img src="/logo.png" alt="Company Logo" className="w-full h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=U+C&background=random'; }} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">United Chattogram Power Limited</h3>
                                                <p className="text-xs text-slate-500">590MW CCPP</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Project Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Project Name</label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formData.projectName || ''}
                                            onChange={handleBasicInfoChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            placeholder="e.g. UCPL 590 MW CCPP"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location || ''}
                                            onChange={handleBasicInfoChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            placeholder="e.g. Chattogram"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Client Name</label>
                                        <input
                                            type="text"
                                            name="client"
                                            value={formData.client || ''}
                                            onChange={handleBasicInfoChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            placeholder="e.g. United Power"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">EPC Contractor</label>
                                        <input
                                            type="text"
                                            name="contractor"
                                            value={formData.contractor || ''}
                                            onChange={handleBasicInfoChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            placeholder="e.g. Consortium"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Manpower Statistics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Total Manpower</label>
                                            <input
                                                type="number"
                                                name="total"
                                                value={formData.manpower?.total || ''}
                                                onChange={handleManpowerChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Avg. Daily Manpower</label>
                                            <input
                                                type="number"
                                                name="avgDaily"
                                                value={formData.manpower?.avgDaily || ''}
                                                onChange={handleManpowerChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Report Prepared By</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.preparedBy?.name || ''}
                                                onChange={handlePreparedByChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Designation</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={formData.preparedBy?.designation || ''}
                                                onChange={handlePreparedByChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. EHS Officer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">

                                {/* Left Column: Policy Statement */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">EHS Policy Statement</h3>
                                                <p className="text-xs text-slate-500">Define your organization's commitment to safety.</p>
                                            </div>
                                        </div>

                                        <div className="relative group h-full pb-8">
                                            <textarea
                                                name="policy"
                                                value={formData.policy || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, policy: e.target.value }))}
                                                className="w-full px-5 py-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-slate-700 leading-relaxed min-h-[400px]"
                                                placeholder="e.g. We are committed to providing a safe and healthy working environment for all employees..."
                                            />
                                            <div className="absolute bottom-10 right-4 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                                                {(formData.policy || '').length} characters
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Key Objectives */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Key Objectives</h3>
                                                <p className="text-xs text-slate-500">Set measurable goals for the current period.</p>
                                            </div>
                                        </div>

                                        {/* Add New Objective Input */}
                                        <div className="flex gap-2 mb-6">
                                            <input
                                                type="text"
                                                value={newObjective}
                                                onChange={(e) => setNewObjective(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
                                                placeholder="Type a new objective and press Enter..."
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                                            />
                                            <button
                                                onClick={handleAddObjective}
                                                disabled={!newObjective.trim()}
                                                className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        {/* Objectives List */}
                                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2">
                                            {formData.objectives && formData.objectives.length > 0 ? (
                                                formData.objectives.map((obj, idx) => (
                                                    <div key={idx} className="group flex items-start gap-3 p-4 bg-slate-50 hover:bg-emerald-50/30 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
                                                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                            <Check size={12} strokeWidth={3} />
                                                        </div>
                                                        <p className="flex-1 text-sm text-slate-700 leading-relaxed font-medium pt-0.5">{obj}</p>
                                                        <button
                                                            onClick={() => handleRemoveObjective(idx)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 opacity-70">
                                                    <Target size={48} strokeWidth={1} className="mb-4 text-slate-300" />
                                                    <p className="text-sm font-medium">No objectives set yet</p>
                                                    <p className="text-xs">Add your first safety objective above</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Footer */}
                                        {formData.objectives && formData.objectives.length > 0 && (
                                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                                <span>Total Objectives: <span className="font-bold text-slate-800">{formData.objectives.length}</span></span>
                                                {formData.objectives.length < 3 && (
                                                    <span className="text-amber-500 flex items-center gap-1"><Activity size={12} /> Recommended: 3-5 items</span>
                                                )}
                                                {formData.objectives.length >= 3 && (
                                                    <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={12} /> Good balance</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">KPIs & Statistics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Monthly Man-Hours</label>
                                        <input
                                            type="number"
                                            value={formData.manHours?.current || ''}
                                            onChange={(e) => setFormData(p => ({
                                                ...p,
                                                manHours: { ...p.manHours, current: Number(e.target.value) }
                                            }))}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Cumulative Man-Hours</label>
                                        <input
                                            type="number"
                                            value={formData.manHours?.cumulative || ''}
                                            onChange={(e) => setFormData(p => ({
                                                ...p,
                                                manHours: { ...p.manHours, cumulative: Number(e.target.value) }
                                            }))}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">LTI Free Days</label>
                                        <input
                                            type="number"
                                            value={formData.laggingIndicators?.ltiFreeDays || ''}
                                            onChange={(e) => setFormData(p => ({
                                                ...p,
                                                laggingIndicators: { ...p.laggingIndicators, ltiFreeDays: Number(e.target.value) }
                                            }))}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            placeholder="e.g. 1240"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Compliance Score (%)</label>
                                        <input
                                            type="number"
                                            value={formData.complianceScore || ''}
                                            onChange={(e) => setFormData(p => ({
                                                ...p,
                                                complianceScore: Number(e.target.value)
                                            }))}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                            placeholder="e.g. 98"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Lagging Indicators</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500">LTI (Lost Time Injury)</label>
                                            <input
                                                type="number"
                                                value={formData.laggingIndicators?.lti || 0}
                                                onChange={(e) => setFormData(p => ({
                                                    ...p,
                                                    laggingIndicators: { ...p.laggingIndicators, lti: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500">First Aid</label>
                                            <input
                                                type="number"
                                                value={formData.laggingIndicators?.firstAid || 0}
                                                onChange={(e) => setFormData(p => ({
                                                    ...p,
                                                    laggingIndicators: { ...p.laggingIndicators, firstAid: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500">Near Miss</label>
                                            <input
                                                type="number"
                                                value={formData.laggingIndicators?.nearMiss || 0}
                                                onChange={(e) => setFormData(p => ({
                                                    ...p,
                                                    laggingIndicators: { ...p.laggingIndicators, nearMiss: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500">Property Damage</label>
                                            <input
                                                type="number"
                                                value={formData.laggingIndicators?.propertyDamage || 0}
                                                onChange={(e) => setFormData(p => ({
                                                    ...p,
                                                    laggingIndicators: { ...p.laggingIndicators, propertyDamage: Number(e.target.value) }
                                                }))}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 6 && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">High-Risk Controls</h4>

                                    {/* High-Risk Controls Logic Fix */}
                                    {(() => {
                                        const DEFAULT_PERMITS = [
                                            { type: "Work at Height", opened: 0, closed: 0, violations: 0 },
                                            { type: "Hot Work", opened: 0, closed: 0, violations: 0 },
                                            { type: "Confined Space", opened: 0, closed: 0, violations: 0 },
                                            { type: "Lifting", opened: 0, closed: 0, violations: 0 },
                                            { type: "LOTO", opened: 0, closed: 0, violations: 0 }
                                        ];

                                        const currentPermits = (formData.permits && formData.permits.length > 0)
                                            ? formData.permits
                                            : DEFAULT_PERMITS;

                                        return (
                                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        <tr>
                                                            <th className="px-6 py-3 border-b border-slate-200">Permit Type</th>
                                                            <th className="px-6 py-3 border-b border-slate-200 w-32 text-center">Opened</th>
                                                            <th className="px-6 py-3 border-b border-slate-200 w-32 text-center">Closed</th>
                                                            <th className="px-6 py-3 border-b border-slate-200 w-32 text-center">Violations</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {currentPermits.map((permit, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-6 py-3 font-medium text-slate-700">{permit.type}</td>
                                                                <td className="px-6 py-3">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={permit.opened}
                                                                        onChange={(e) => {
                                                                            const newPermits = [...currentPermits];
                                                                            newPermits[idx] = { ...newPermits[idx], opened: Number(e.target.value) };
                                                                            setFormData(prev => ({ ...prev, permits: newPermits }));
                                                                        }}
                                                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center font-bold text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={permit.closed}
                                                                        onChange={(e) => {
                                                                            const newPermits = [...currentPermits];
                                                                            newPermits[idx] = { ...newPermits[idx], closed: Number(e.target.value) };
                                                                            setFormData(prev => ({ ...prev, permits: newPermits }));
                                                                        }}
                                                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center font-bold text-emerald-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={permit.violations}
                                                                        onChange={(e) => {
                                                                            const newPermits = [...currentPermits];
                                                                            newPermits[idx] = { ...newPermits[idx], violations: Number(e.target.value) };
                                                                            setFormData(prev => ({ ...prev, permits: newPermits }));
                                                                        }}
                                                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-center font-bold text-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })()}
                                    <div className="mt-6">
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Highlights</label>
                                        <textarea
                                            value={formData.highRiskHighlights || ''}
                                            onChange={(e) => setFormData(p => ({ ...p, highRiskHighlights: e.target.value }))}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all h-24 resize-none"
                                            placeholder="e.g. Critical lift of Gas Turbine auxiliary skid completed successfully."
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Mention any significant achievements or notes.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 4: Site Inspections (index 3) */}
                        {
                            activeSection === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Site Inspection / Observation Report</h3>
                                            <p className="text-sm text-slate-500">Document observations with complete details including observer info, risk level, and follow-up actions.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newFinding = {
                                                    id: `OBS-${Date.now()}`,
                                                    // Header Info
                                                    date: new Date().toISOString().split('T')[0],
                                                    time: new Date().toTimeString().slice(0, 5),
                                                    location: '',
                                                    observerName: '',
                                                    activityType: '',
                                                    // Category
                                                    category: '',
                                                    subCategory: '',
                                                    observationType: '', // safeAct, unsafeAct, unsafeCondition
                                                    riskLevel: '', // high, medium, low
                                                    // Observation & Action
                                                    nonCompliance: { image: '', description: '' },
                                                    correctiveAction: { image: '', description: '' },
                                                    // Follow-up
                                                    recommendation: '',
                                                    responsiblePerson: '',
                                                    deadline: '',
                                                    status: 'open' // open, closed
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    findings: [...(prev.findings || []), newFinding]
                                                }));
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Observation
                                        </button>
                                    </div>

                                    {(formData.findings?.length > 0) ? (
                                        <div className="space-y-6">
                                            {formData.findings.map((finding, idx) => (
                                                <div key={finding.id || idx} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                                                    {/* ক. Header Information Section */}
                                                    <div className="bg-gradient-to-br from-rose-900 via-red-900 to-rose-950 px-6 py-5 relative overflow-hidden">
                                                        {/* Decorative background elements */}
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>

                                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                                    <FileText className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Observation Report</h4>
                                                                    <span className="text-[10px] text-rose-100 font-medium tracking-wider">#{finding.id || `OBS-${idx + 1}`}</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const updated = formData.findings.filter((_, i) => i !== idx);
                                                                    setFormData(prev => ({ ...prev, findings: updated }));
                                                                }}
                                                                className="p-2 text-rose-100 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        {/* Header Info Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-rose-100 uppercase tracking-wider mb-1 block">Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={finding.date || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], date: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium focus:ring-2 focus:ring-white/30 focus:bg-white/20 outline-none transition-all placeholder-rose-200"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-rose-100 uppercase tracking-wider mb-1 block">Time</label>
                                                                <input
                                                                    type="time"
                                                                    value={finding.time || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], time: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium focus:ring-2 focus:ring-white/30 focus:bg-white/20 outline-none transition-all placeholder-rose-200"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-rose-100 uppercase tracking-wider mb-1 block">Location / Area</label>
                                                                <input
                                                                    type="text"
                                                                    value={finding.location || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], location: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    placeholder="e.g., Boiler Floor"
                                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium focus:ring-2 focus:ring-white/30 focus:bg-white/20 outline-none transition-all placeholder-rose-300/50"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-rose-100 uppercase tracking-wider mb-1 block">Observer Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={finding.observerName || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], observerName: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    placeholder="e.g., Mr. Hasan"
                                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium focus:ring-2 focus:ring-white/30 focus:bg-white/20 outline-none transition-all placeholder-rose-300/50"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-rose-100 uppercase tracking-wider mb-1 block">Activity Type</label>
                                                                <input
                                                                    type="text"
                                                                    value={finding.activityType || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], activityType: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    placeholder="e.g., Welding"
                                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium focus:ring-2 focus:ring-white/30 focus:bg-white/20 outline-none transition-all placeholder-rose-300/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* খ. Observation Category & Risk Section */}
                                                    <div className="px-6 py-6 bg-white border-b border-slate-100">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                            <div className="group">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Category</label>
                                                                <input
                                                                    type="text"
                                                                    value={finding.category || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], category: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    placeholder="e.g., Housekeeping"
                                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
                                                                />
                                                            </div>
                                                            <div className="group">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Sub-Category</label>
                                                                <input
                                                                    type="text"
                                                                    value={finding.subCategory || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...formData.findings];
                                                                        updated[idx] = { ...updated[idx], subCategory: e.target.value };
                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                    }}
                                                                    placeholder="e.g., Material Storage"
                                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
                                                                />
                                                            </div>
                                                            <div className="group">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Observation Type</label>
                                                                <div className="relative">
                                                                    <select
                                                                        value={finding.observationType || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.findings];
                                                                            updated[idx] = { ...updated[idx], observationType: e.target.value };
                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                        }}
                                                                        className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                                                    >
                                                                        <option value="">Select Type</option>
                                                                        <option value="safeAct">✅ Safe Act (Positive)</option>
                                                                        <option value="unsafeAct">⚠️ Unsafe Act (Behavior)</option>
                                                                        <option value="unsafeCondition">❌ Unsafe Condition (Environment)</option>
                                                                    </select>
                                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="group">
                                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1 block group-focus-within:text-indigo-600 transition-colors">Risk Level</label>
                                                                <div className="relative">
                                                                    <select
                                                                        value={finding.riskLevel || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.findings];
                                                                            updated[idx] = { ...updated[idx], riskLevel: e.target.value };
                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                        }}
                                                                        className={`w-full px-4 py-2.5 border-transparent rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer ${finding.riskLevel === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                                                                            finding.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                                finding.riskLevel === 'low' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                                    'bg-slate-50 text-slate-600'
                                                                            }`}
                                                                    >
                                                                        <option value="">Select Risk</option>
                                                                        <option value="high">🔴 High Risk</option>
                                                                        <option value="medium">🟡 Medium Risk</option>
                                                                        <option value="low">🟢 Low Risk</option>
                                                                    </select>
                                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* গ. Observation & Corrective Action */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                                        {/* Condition to render based on Observation Type */}
                                                        {finding.observationType === 'safeAct' ? (
                                                            <div className="md:col-span-2 p-8 space-y-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                                                        <CheckCircle size={18} />
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider">Positive Observation</span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Photo Evidence</label>
                                                                        <div className="group relative">
                                                                            {finding.nonCompliance?.image ? (
                                                                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                                                                    <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-50" alt="Positive Observation" />
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const updated = [...formData.findings];
                                                                                            updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: '' } };
                                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                                        }}
                                                                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                                    >
                                                                                        <XCircle size={16} />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-200 transition-all group-hover:shadow-sm">
                                                                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                                                        <UploadCloud className="w-5 h-5 text-emerald-500" />
                                                                                    </div>
                                                                                    <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">Upload Evidence</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        className="hidden"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                const reader = new FileReader();
                                                                                                reader.onload = (event) => {
                                                                                                    const updated = [...formData.findings];
                                                                                                    updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: event.target.result } };
                                                                                                    setFormData(prev => ({ ...prev, findings: updated }));
                                                                                                };
                                                                                                reader.readAsDataURL(file);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </label>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description of Good Practice</label>
                                                                        <textarea
                                                                            value={finding.nonCompliance?.description || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, description: e.target.value } };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            placeholder="Describe the safe act or positive observation..."
                                                                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none resize-none h-[calc(100%-2rem)] min-h-[160px] placeholder-slate-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : finding.observationType === 'unsafeCondition' ? (
                                                            <div className="md:col-span-2 p-8 space-y-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                                                                        <XCircle size={18} />
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-xs font-bold uppercase tracking-wider">Unsafe Condition</span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Photo Evidence</label>
                                                                        <div className="group relative">
                                                                            {finding.nonCompliance?.image ? (
                                                                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                                                                    <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-50" alt="Unsafe Condition" />
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const updated = [...formData.findings];
                                                                                            updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: '' } };
                                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                                        }}
                                                                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                                    >
                                                                                        <XCircle size={16} />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-rose-50/30 hover:border-rose-200 transition-all group-hover:shadow-sm">
                                                                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                                                        <UploadCloud className="w-5 h-5 text-rose-500" />
                                                                                    </div>
                                                                                    <span className="text-xs font-medium text-slate-500 group-hover:text-rose-600 transition-colors">Upload Evidence</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        className="hidden"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                const reader = new FileReader();
                                                                                                reader.onload = (event) => {
                                                                                                    const updated = [...formData.findings];
                                                                                                    updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: event.target.result } };
                                                                                                    setFormData(prev => ({ ...prev, findings: updated }));
                                                                                                };
                                                                                                reader.readAsDataURL(file);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </label>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description of Unsafe Condition</label>
                                                                        <textarea
                                                                            value={finding.nonCompliance?.description || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, description: e.target.value } };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            placeholder="Describe the unsafe condition..."
                                                                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none resize-none h-[calc(100%-2rem)] min-h-[160px] placeholder-slate-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Non-Compliance / Observation */}
                                                                <div className="p-8 space-y-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                                                                            <XCircle size={18} />
                                                                        </div>
                                                                        <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-xs font-bold uppercase tracking-wider">Unsafe Act (Before)</span>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Photo Evidence</label>
                                                                        <div className="group relative">
                                                                            {finding.nonCompliance?.image ? (
                                                                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                                                                    <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-50" alt="Before" />
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const updated = [...formData.findings];
                                                                                            updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: '' } };
                                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                                        }}
                                                                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                                    >
                                                                                        <XCircle size={16} />
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-rose-50/30 hover:border-rose-200 transition-all group-hover:shadow-sm">
                                                                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                                                        <UploadCloud className="w-5 h-5 text-rose-500" />
                                                                                    </div>
                                                                                    <span className="text-xs font-medium text-slate-500 group-hover:text-rose-600 transition-colors">Upload Before Image</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        className="hidden"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0];
                                                                                            if (file) {
                                                                                                const reader = new FileReader();
                                                                                                reader.onload = (event) => {
                                                                                                    const updated = [...formData.findings];
                                                                                                    updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, image: event.target.result } };
                                                                                                    setFormData(prev => ({ ...prev, findings: updated }));
                                                                                                };
                                                                                                reader.readAsDataURL(file);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </label>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                                                                        <textarea
                                                                            value={finding.nonCompliance?.description || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], nonCompliance: { ...updated[idx].nonCompliance, description: e.target.value } };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            placeholder="Describe what you observed..."
                                                                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none resize-none h-32 placeholder-slate-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* Corrective Action (Only for Unsafe Acts) */}
                                                        {finding.observationType === 'unsafeAct' && (
                                                            <div className="p-8 space-y-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                                                        <CheckCircle size={18} />
                                                                    </div>
                                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider">Corrective Action (After)</span>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Photo Evidence</label>
                                                                    <div className="group relative">
                                                                        {finding.correctiveAction?.image ? (
                                                                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                                                                                <img src={finding.correctiveAction.image} className="w-full h-full object-contain bg-slate-50" alt="After" />
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const updated = [...formData.findings];
                                                                                        updated[idx] = { ...updated[idx], correctiveAction: { ...updated[idx].correctiveAction, image: '' } };
                                                                                        setFormData(prev => ({ ...prev, findings: updated }));
                                                                                    }}
                                                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                                >
                                                                                    <XCircle size={16} />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <label className="flex flex-col items-center justify-center aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-200 transition-all group-hover:shadow-sm">
                                                                                <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                                                    <UploadCloud className="w-5 h-5 text-emerald-500" />
                                                                                </div>
                                                                                <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">Upload After Image</span>
                                                                                <input
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="hidden"
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files?.[0];
                                                                                        if (file) {
                                                                                            const reader = new FileReader();
                                                                                            reader.onload = (event) => {
                                                                                                const updated = [...formData.findings];
                                                                                                updated[idx] = { ...updated[idx], correctiveAction: { ...updated[idx].correctiveAction, image: event.target.result } };
                                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                                            };
                                                                                            reader.readAsDataURL(file);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </label>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Immediate Action Taken</label>
                                                                    <textarea
                                                                        value={finding.correctiveAction?.description || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.findings];
                                                                            updated[idx] = { ...updated[idx], correctiveAction: { ...updated[idx].correctiveAction, description: e.target.value } };
                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                        }}
                                                                        placeholder="What immediate action was taken..."
                                                                        className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none resize-none h-32 placeholder-slate-400"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* ঘ. Action & Follow-up Section */}
                                                    {/* gHA. Action & Follow-up Section - Hidden for Safe Acts and Unsafe Conditions */}
                                                    {/* ঘ. Action & Follow-up Section */}
                                                    {(finding.observationType !== 'safeAct' && finding.observationType !== 'unsafeCondition') && (
                                                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                                    <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                                                                </div>
                                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Follow-up & Accountability</h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <div className="md:col-span-3">
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Recommendation / Permanent Solution</label>
                                                                    <textarea
                                                                        value={finding.recommendation || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formData.findings];
                                                                            updated[idx] = { ...updated[idx], recommendation: e.target.value };
                                                                            setFormData(prev => ({ ...prev, findings: updated }));
                                                                        }}
                                                                        placeholder="Suggest a permanent solution to prevent recurrence..."
                                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none h-24 placeholder-slate-400"
                                                                    />
                                                                </div>
                                                                <div className="group">
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-600 transition-colors">Responsible Person</label>
                                                                    <div className="relative">
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                                            <UserCheck size={16} />
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={finding.responsiblePerson || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], responsiblePerson: e.target.value };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            placeholder="e.g., Site Supervisor"
                                                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="group">
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-600 transition-colors">Deadline</label>
                                                                    <div className="relative">
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                                            <Calendar size={16} />
                                                                        </div>
                                                                        <input
                                                                            type="date"
                                                                            value={finding.deadline || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], deadline: e.target.value };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="group">
                                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-600 transition-colors">Status</label>
                                                                    <div className="relative">
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                                            <Activity size={16} />
                                                                        </div>
                                                                        <select
                                                                            value={finding.status || 'open'}
                                                                            onChange={(e) => {
                                                                                const updated = [...formData.findings];
                                                                                updated[idx] = { ...updated[idx], status: e.target.value };
                                                                                setFormData(prev => ({ ...prev, findings: updated }));
                                                                            }}
                                                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                                                        >
                                                                            <option value="open">🔓 Open</option>
                                                                            <option value="closed">🔒 Closed</option>
                                                                        </select>
                                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                            <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                            <p className="text-sm">No observation reports recorded yet.</p>
                                            <p className="text-xs text-slate-300 mt-1">Click "Add Observation" to document site inspections.</p>
                                        </div>
                                    )}
                                </div>
                            )
                        }



                        {/* Section 5: Incidents (index 4) */}
                        {
                            activeSection === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Header & Actions */}
                                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">Incident Management</h3>
                                                <p className="text-slate-400 text-sm max-w-md">Log and manage worksite incidents. Select a category below to create a new report.</p>
                                            </div>
                                        </div>

                                        {/* Action Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                            <button
                                                onClick={() => {
                                                    setEditingIncident(null);
                                                    setShowFirstAidIncidentForm(true);
                                                }}
                                                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-rose-500/50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                                                    <Activity className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-white group-hover:text-rose-400 transition-colors">Injury Report</span>
                                                    <span className="text-xs text-slate-400">First Aid & Medical</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingIncident(null);
                                                    setShowFireIncidentForm(true);
                                                }}
                                                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-red-500/50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                                                    <Flame className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-white group-hover:text-red-400 transition-colors">Fire Incident</span>
                                                    <span className="text-xs text-slate-400">Fire & Explosion</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingIncident(null);
                                                    setShowFFHIncidentForm(true);
                                                }}
                                                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-orange-500/50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                                    <ArrowDown className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-white group-hover:text-orange-400 transition-colors">Fall Report</span>
                                                    <span className="text-xs text-slate-400">Work at Height</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lists Container */}
                                    <div className="space-y-6">
                                        {/* List of First Aid Incidents */}
                                        {firstAidIncidents.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Injury Reports</h5>
                                                </div>
                                                {firstAidIncidents.map((inc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setEditingIncident(inc);
                                                            setShowFirstAidIncidentForm(true);
                                                        }}
                                                        className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                                                <Activity className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-black text-slate-800">{inc.id}</span>
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">{inc.dateOfInjury}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-600 font-medium group-hover:text-rose-600 transition-colors">{inc.natureOfInjury || 'Unspecified Injury'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Delete this injury report?')) {
                                                                    const updated = firstAidIncidents.filter(i => i.id !== inc.id);
                                                                    handleUpdateIncidents('firstAidIncidents', updated);
                                                                }
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* List of Fire Incidents */}
                                        {fireIncidents.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fire Incidents</h5>
                                                </div>
                                                {fireIncidents.map((inc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setEditingIncident(inc);
                                                            setShowFireIncidentForm(true);
                                                        }}
                                                        className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-red-200 transition-all cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                                                <Flame className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-black text-slate-800">{inc.id}</span>
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${inc.severity === 'major' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                                        {inc.severity || 'Unclassified'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-slate-600 font-medium group-hover:text-red-600 transition-colors">{inc.location || 'Location not specified'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Delete this report?')) {
                                                                    const updated = fireIncidents.filter(i => i.id !== inc.id);
                                                                    handleUpdateIncidents('fireIncidents', updated);
                                                                }
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* List of FFH Incidents (Adding this section if missing or just for completeness) */}
                                        {ffhIncidents.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fall From Height</h5>
                                                </div>
                                                {ffhIncidents.map((inc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setEditingIncident(inc);
                                                            setShowFFHIncidentForm(true);
                                                        }}
                                                        className="group p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                                                <ArrowDown className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm font-black text-slate-800">{inc.id}</span>
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">{inc.date}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-600 font-medium group-hover:text-orange-600 transition-colors">{inc.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Delete this report?')) {
                                                                    const updated = ffhIncidents.filter(i => i.id !== inc.id);
                                                                    handleUpdateIncidents('ffhIncidents', updated);
                                                                }
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(!firstAidIncidents.length && !fireIncidents.length && !ffhIncidents.length) && (
                                            <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                                <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                <p className="text-sm">No incidents recorded yet.</p>
                                                <p className="text-xs text-slate-300 mt-1">Add a Fire, Injury, or Fall From Height report.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }

                        {/* Section 7: High Risk Controls (Permits) - Placeholder or Implementation */}
                        {
                            activeSection === 6 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <Shield className="w-16 h-16 mb-4 text-slate-200" />
                                    <p className="text-lg font-medium">High Risk Work Controls Editor</p>
                                    <p className="text-sm">Coming in next update...</p>
                                </div>
                            )
                        }

                        {/* Section 8: Environment (index 7) */}
                        {
                            activeSection === 7 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-xl">
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                                            <Leaf className="w-6 h-6" /> Environmental Performance
                                        </h3>
                                        <p className="text-emerald-100 text-sm">Track waste generation, resource consumption, and environmental incidents.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Waste Management */}
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Trash2 className="w-4 h-4 text-emerald-600" /> Waste Generated
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hazardous Waste (kg)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 50 kg"
                                                        value={formData.waste?.hazardous || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            waste: { ...(prev.waste || {}), hazardous: e.target.value }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Non-Hazardous Waste (kg)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 1200 kg"
                                                        value={formData.waste?.nonHazardous || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            waste: { ...(prev.waste || {}), nonHazardous: e.target.value }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Recycled Waste (kg)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 300 kg"
                                                        value={formData.waste?.recycled || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            waste: { ...(prev.waste || {}), recycled: e.target.value }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Resource Consumption */}
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Droplet className="w-4 h-4 text-blue-500" /> Resource Consumption
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Water Consumption (Liters)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 5000 L"
                                                        value={formData.consumption?.water || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            consumption: { ...(prev.consumption || {}), water: e.target.value }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fuel Consumption (Liters)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 450 L"
                                                        value={formData.consumption?.fuel || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            consumption: { ...(prev.consumption || {}), fuel: e.target.value }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spills & Incidents */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Environmental Incidents
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number of Spills / Incidents</label>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            spills: Math.max(0, (prev.spills || 0) - 1)
                                                        }))}
                                                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className="text-2xl font-bold text-slate-700 w-12 text-center">{formData.spills || 0}</span>
                                                    <button
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            spills: (prev.spills || 0) + 1
                                                        }))}
                                                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-[2] p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                                                <p className="flex items-start gap-2">
                                                    <Info size={16} className="mt-0.5 shrink-0" />
                                                    Record any chemical spills, oil leaks, or other environmental incidents that occurred during this month.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* Section 9: Issues & Challenges (index 8) */}
                        {
                            activeSection === 8 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                                            <AlertTriangle className="w-6 h-6" /> Issues & Challenges
                                        </h3>
                                        <p className="text-rose-100 text-sm">Document key challenges faced and support required from management.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Key Challenges */}
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-rose-500" /> Key Challenges
                                            </h4>
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={newChallenge}
                                                    onChange={(e) => setNewChallenge(e.target.value)}
                                                    placeholder="Add a new challenge..."
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddChallenge()}
                                                />
                                                <button
                                                    onClick={handleAddChallenge}
                                                    className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <ul className="space-y-2">
                                                {(formData.challenges?.length > 0) ? (
                                                    formData.challenges.map((challenge, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg group">
                                                            <span className="flex-1">{challenge}</span>
                                                            <button
                                                                onClick={() => handleRemoveChallenge(idx)}
                                                                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-slate-400 text-sm italic text-center py-4">No challenges recorded</li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Support Needed */}
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Construction className="w-4 h-4 text-amber-500" /> Support & Resources Needed
                                            </h4>
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={newSupport}
                                                    onChange={(e) => setNewSupport(e.target.value)}
                                                    placeholder="Add support/resource needed..."
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSupport()}
                                                />
                                                <button
                                                    onClick={handleAddSupport}
                                                    className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <ul className="space-y-2">
                                                {(formData.supportNeeded?.length > 0) ? (
                                                    formData.supportNeeded.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg group">
                                                            <span className="flex-1">{item}</span>
                                                            <button
                                                                onClick={() => handleRemoveSupport(idx)}
                                                                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-slate-400 text-sm italic text-center py-4">No support items recorded</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeSection === 5 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold mb-1">EHS Programs & Activities</h3>
                                            <p className="text-teal-100 text-sm max-w-lg">Track training, emergency preparedness drills, and awareness campaigns. Add photo evidence with captions.</p>
                                        </div>
                                    </div>

                                    {/* Sub-section 1: Training & Awareness */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <BookOpen size={16} /> Training & Awareness
                                            </h4>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Induction Training */}
                                            <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 rounded-xl">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.training?.inductionConducted || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            training: { ...prev.training, inductionConducted: e.target.checked }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Safety Induction Conducted?</span>
                                                </label>
                                                {formData.training?.inductionConducted && (
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs font-medium text-slate-500">Participants:</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={formData.training?.inductionParticipants || ''}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                training: { ...prev.training, inductionParticipants: parseInt(e.target.value) || 0 }
                                                            }))}
                                                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Toolbox Talks */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">Toolbox Talks (TBT)</span>
                                                    <button
                                                        onClick={() => {
                                                            const newTBT = { id: Date.now(), date: '', topic: '', participants: 0 };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                training: {
                                                                    ...prev.training,
                                                                    toolboxTalks: [...(prev.training?.toolboxTalks || []), newTBT]
                                                                }
                                                            }));
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Plus size={14} /> Add TBT
                                                    </button>
                                                </div>
                                                {(formData.training?.toolboxTalks || []).map((tbt, idx) => (
                                                    <div key={tbt.id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                                        <input type="date" value={tbt.date || ''} onChange={(e) => {
                                                            const updated = [...(formData.training?.toolboxTalks || [])];
                                                            updated[idx] = { ...updated[idx], date: e.target.value };
                                                            setFormData(prev => ({ ...prev, training: { ...prev.training, toolboxTalks: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                                        <input type="text" placeholder="Topic" value={tbt.topic || ''} onChange={(e) => {
                                                            const updated = [...(formData.training?.toolboxTalks || [])];
                                                            updated[idx] = { ...updated[idx], topic: e.target.value };
                                                            setFormData(prev => ({ ...prev, training: { ...prev.training, toolboxTalks: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm md:col-span-2" />
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" placeholder="Pax" value={tbt.participants || ''} onChange={(e) => {
                                                                const updated = [...(formData.training?.toolboxTalks || [])];
                                                                updated[idx] = { ...updated[idx], participants: parseInt(e.target.value) || 0 };
                                                                setFormData(prev => ({ ...prev, training: { ...prev.training, toolboxTalks: updated } }));
                                                            }} className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                                            <button onClick={() => {
                                                                const updated = (formData.training?.toolboxTalks || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, training: { ...prev.training, toolboxTalks: updated } }));
                                                            }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Specific Training */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">Specific Trainings</span>
                                                    <button
                                                        onClick={() => {
                                                            const newTraining = { id: Date.now(), date: '', topic: '', type: '', participants: 0 };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                training: {
                                                                    ...prev.training,
                                                                    specificTrainings: [...(prev.training?.specificTrainings || []), newTraining]
                                                                }
                                                            }));
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Plus size={14} /> Add Training
                                                    </button>
                                                </div>
                                                {(formData.training?.specificTrainings || []).map((tr, idx) => (
                                                    <div key={tr.id || idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                                        <input type="date" value={tr.date || ''} onChange={(e) => {
                                                            const updated = [...(formData.training?.specificTrainings || [])];
                                                            updated[idx] = { ...updated[idx], date: e.target.value };
                                                            setFormData(prev => ({ ...prev, training: { ...prev.training, specificTrainings: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                                        <input type="text" placeholder="Topic" value={tr.topic || ''} onChange={(e) => {
                                                            const updated = [...(formData.training?.specificTrainings || [])];
                                                            updated[idx] = { ...updated[idx], topic: e.target.value };
                                                            setFormData(prev => ({ ...prev, training: { ...prev.training, specificTrainings: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm md:col-span-2" />
                                                        <select value={tr.type || ''} onChange={(e) => {
                                                            const updated = [...(formData.training?.specificTrainings || [])];
                                                            updated[idx] = { ...updated[idx], type: e.target.value };
                                                            setFormData(prev => ({ ...prev, training: { ...prev.training, specificTrainings: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                                            <option value="">Type...</option>
                                                            <option value="Fire Safety">Fire Safety</option>
                                                            <option value="First Aid">First Aid</option>
                                                            <option value="Work at Height">Work at Height</option>
                                                            <option value="Chemical Safety">Chemical Safety</option>
                                                            <option value="Electrical Safety">Electrical Safety</option>
                                                            <option value="PPE Usage">PPE Usage</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" placeholder="Pax" value={tr.participants || ''} onChange={(e) => {
                                                                const updated = [...(formData.training?.specificTrainings || [])];
                                                                updated[idx] = { ...updated[idx], participants: parseInt(e.target.value) || 0 };
                                                                setFormData(prev => ({ ...prev, training: { ...prev.training, specificTrainings: updated } }));
                                                            }} className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                                            <button onClick={() => {
                                                                const updated = (formData.training?.specificTrainings || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, training: { ...prev.training, specificTrainings: updated } }));
                                                            }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Total Man-Hours */}
                                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                                <label className="font-medium text-slate-700">Total Training Man-Hours:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.training?.totalManHours || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        training: { ...prev.training, totalManHours: parseFloat(e.target.value) || 0 }
                                                    }))}
                                                    className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                />
                                            </div>

                                            {/* Training Evidence Gallery */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">📸 Photo Evidence</span>
                                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                                                        <UploadCloud size={14} /> Add Photo
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (event) => {
                                                                    const newEvidence = { id: Date.now(), imageUrl: event.target?.result, caption: '' };
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        training: {
                                                                            ...prev.training,
                                                                            evidence: [...(prev.training?.evidence || []), newEvidence]
                                                                        }
                                                                    }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                            e.target.value = '';
                                                        }} />
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {(formData.training?.evidence || []).map((ev, idx) => (
                                                        <div key={ev.id || idx} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                            <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-32 object-contain bg-slate-50" />
                                                            <div className="p-2">
                                                                <input type="text" placeholder="Caption..." value={ev.caption || ''} onChange={(e) => {
                                                                    const updated = [...(formData.training?.evidence || [])];
                                                                    updated[idx] = { ...updated[idx], caption: e.target.value };
                                                                    setFormData(prev => ({ ...prev, training: { ...prev.training, evidence: updated } }));
                                                                }} className="w-full px-2 py-1 text-xs border border-slate-200 rounded" />
                                                            </div>
                                                            <button onClick={() => {
                                                                const updated = (formData.training?.evidence || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, training: { ...prev.training, evidence: updated } }));
                                                            }} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-section 2: Emergency Preparedness */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Flame size={16} /> Emergency Preparedness
                                            </h4>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Mock Drill */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.emergencyPreparedness?.mockDrillConducted || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            emergencyPreparedness: { ...prev.emergencyPreparedness, mockDrillConducted: e.target.checked }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Mock Drill Conducted?</span>
                                                </label>
                                                {formData.emergencyPreparedness?.mockDrillConducted && (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                                                        <div>
                                                            <label className="text-xs font-medium text-slate-500 block mb-1">Type</label>
                                                            <select
                                                                value={formData.emergencyPreparedness?.mockDrillDetails?.type || ''}
                                                                onChange={(e) => setFormData(prev => ({
                                                                    ...prev,
                                                                    emergencyPreparedness: {
                                                                        ...prev.emergencyPreparedness,
                                                                        mockDrillDetails: { ...prev.emergencyPreparedness?.mockDrillDetails, type: e.target.value }
                                                                    }
                                                                }))}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                                                            >
                                                                <option value="">Select...</option>
                                                                <option value="Fire Drill">Fire Drill</option>
                                                                <option value="Earthquake Drill">Earthquake Drill</option>
                                                                <option value="Evacuation Drill">Evacuation Drill</option>
                                                                <option value="Chemical Spill">Chemical Spill</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
                                                            <input
                                                                type="date"
                                                                value={formData.emergencyPreparedness?.mockDrillDetails?.date || ''}
                                                                onChange={(e) => setFormData(prev => ({
                                                                    ...prev,
                                                                    emergencyPreparedness: {
                                                                        ...prev.emergencyPreparedness,
                                                                        mockDrillDetails: { ...prev.emergencyPreparedness?.mockDrillDetails, date: e.target.value }
                                                                    }
                                                                }))}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-medium text-slate-500 block mb-1">Participants</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={formData.emergencyPreparedness?.mockDrillDetails?.participants || ''}
                                                                onChange={(e) => setFormData(prev => ({
                                                                    ...prev,
                                                                    emergencyPreparedness: {
                                                                        ...prev.emergencyPreparedness,
                                                                        mockDrillDetails: { ...prev.emergencyPreparedness?.mockDrillDetails, participants: parseInt(e.target.value) || 0 }
                                                                    }
                                                                }))}
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Fire Equipment Inspection */}
                                            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.emergencyPreparedness?.fireEquipmentInspection || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            emergencyPreparedness: { ...prev.emergencyPreparedness, fireEquipmentInspection: e.target.checked }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Fire Equipment Inspection Done?</span>
                                                </label>
                                            </div>

                                            {/* Emergency Evidence Gallery */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">📸 Photo Evidence</span>
                                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                                                        <UploadCloud size={14} /> Add Photo
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (event) => {
                                                                    const newEvidence = { id: Date.now(), imageUrl: event.target?.result, caption: '' };
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        emergencyPreparedness: {
                                                                            ...prev.emergencyPreparedness,
                                                                            evidence: [...(prev.emergencyPreparedness?.evidence || []), newEvidence]
                                                                        }
                                                                    }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                            e.target.value = '';
                                                        }} />
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {(formData.emergencyPreparedness?.evidence || []).map((ev, idx) => (
                                                        <div key={ev.id || idx} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                            <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-32 object-contain bg-slate-50" />
                                                            <div className="p-2">
                                                                <input type="text" placeholder="Caption..." value={ev.caption || ''} onChange={(e) => {
                                                                    const updated = [...(formData.emergencyPreparedness?.evidence || [])];
                                                                    updated[idx] = { ...updated[idx], caption: e.target.value };
                                                                    setFormData(prev => ({ ...prev, emergencyPreparedness: { ...prev.emergencyPreparedness, evidence: updated } }));
                                                                }} className="w-full px-2 py-1 text-xs border border-slate-200 rounded" />
                                                            </div>
                                                            <button onClick={() => {
                                                                const updated = (formData.emergencyPreparedness?.evidence || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, emergencyPreparedness: { ...prev.emergencyPreparedness, evidence: updated } }));
                                                            }} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-section 3: Campaigns & Motivation */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Target size={16} /> Campaigns & Motivation
                                            </h4>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Safety Committee Meeting */}
                                            <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 rounded-xl">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.campaigns?.safetyCommitteeMeeting?.held || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            campaigns: {
                                                                ...prev.campaigns,
                                                                safetyCommitteeMeeting: { ...prev.campaigns?.safetyCommitteeMeeting, held: e.target.checked }
                                                            }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Safety Committee Meeting Held?</span>
                                                </label>
                                                {formData.campaigns?.safetyCommitteeMeeting?.held && (
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs font-medium text-slate-500">Date:</label>
                                                        <input
                                                            type="date"
                                                            value={formData.campaigns?.safetyCommitteeMeeting?.date || ''}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                campaigns: {
                                                                    ...prev.campaigns,
                                                                    safetyCommitteeMeeting: { ...prev.campaigns?.safetyCommitteeMeeting, date: e.target.value }
                                                                }
                                                            }))}
                                                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Health & Hygiene */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.campaigns?.healthHygiene?.conducted || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            campaigns: {
                                                                ...prev.campaigns,
                                                                healthHygiene: { ...prev.campaigns?.healthHygiene, conducted: e.target.checked }
                                                            }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Health & Hygiene Activity Conducted?</span>
                                                </label>
                                                {formData.campaigns?.healthHygiene?.conducted && (
                                                    <textarea
                                                        placeholder="Details (e.g., Medical checkup, Canteen inspection)..."
                                                        value={formData.campaigns?.healthHygiene?.details || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            campaigns: {
                                                                ...prev.campaigns,
                                                                healthHygiene: { ...prev.campaigns?.healthHygiene, details: e.target.value }
                                                            }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20 ml-8"
                                                    />
                                                )}
                                            </div>

                                            {/* Rewards & Recognition */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.campaigns?.rewardsRecognition?.given || false}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            campaigns: {
                                                                ...prev.campaigns,
                                                                rewardsRecognition: { ...prev.campaigns?.rewardsRecognition, given: e.target.checked }
                                                            }
                                                        }))}
                                                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="font-medium text-slate-700">Rewards / Recognition Given?</span>
                                                </label>
                                                {formData.campaigns?.rewardsRecognition?.given && (
                                                    <textarea
                                                        placeholder="Details (e.g., Best Safety Worker of the Month)..."
                                                        value={formData.campaigns?.rewardsRecognition?.details || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            campaigns: {
                                                                ...prev.campaigns,
                                                                rewardsRecognition: { ...prev.campaigns?.rewardsRecognition, details: e.target.value }
                                                            }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20 ml-8"
                                                    />
                                                )}
                                            </div>

                                            {/* Special Days */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">Special Days Observed</span>
                                                    <button
                                                        onClick={() => {
                                                            const newDay = { id: Date.now(), name: '', date: '' };
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                campaigns: {
                                                                    ...prev.campaigns,
                                                                    specialDays: [...(prev.campaigns?.specialDays || []), newDay]
                                                                }
                                                            }));
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        <Plus size={14} /> Add Day
                                                    </button>
                                                </div>
                                                {(formData.campaigns?.specialDays || []).map((day, idx) => (
                                                    <div key={day.id || idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                                        <input type="text" placeholder="Day Name (e.g., National Safety Day)" value={day.name || ''} onChange={(e) => {
                                                            const updated = [...(formData.campaigns?.specialDays || [])];
                                                            updated[idx] = { ...updated[idx], name: e.target.value };
                                                            setFormData(prev => ({ ...prev, campaigns: { ...prev.campaigns, specialDays: updated } }));
                                                        }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm md:col-span-2" />
                                                        <div className="flex items-center gap-2">
                                                            <input type="date" value={day.date || ''} onChange={(e) => {
                                                                const updated = [...(formData.campaigns?.specialDays || [])];
                                                                updated[idx] = { ...updated[idx], date: e.target.value };
                                                                setFormData(prev => ({ ...prev, campaigns: { ...prev.campaigns, specialDays: updated } }));
                                                            }} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                                                            <button onClick={() => {
                                                                const updated = (formData.campaigns?.specialDays || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, campaigns: { ...prev.campaigns, specialDays: updated } }));
                                                            }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Campaign Evidence Gallery */}
                                            <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-700">📸 Photo Evidence</span>
                                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                                                        <UploadCloud size={14} /> Add Photo
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (event) => {
                                                                    const newEvidence = { id: Date.now(), imageUrl: event.target?.result, caption: '' };
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        campaigns: {
                                                                            ...prev.campaigns,
                                                                            evidence: [...(prev.campaigns?.evidence || []), newEvidence]
                                                                        }
                                                                    }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                            e.target.value = '';
                                                        }} />
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {(formData.campaigns?.evidence || []).map((ev, idx) => (
                                                        <div key={ev.id || idx} className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                            <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-32 object-contain bg-slate-50" />
                                                            <div className="p-2">
                                                                <input type="text" placeholder="Caption..." value={ev.caption || ''} onChange={(e) => {
                                                                    const updated = [...(formData.campaigns?.evidence || [])];
                                                                    updated[idx] = { ...updated[idx], caption: e.target.value };
                                                                    setFormData(prev => ({ ...prev, campaigns: { ...prev.campaigns, evidence: updated } }));
                                                                }} className="w-full px-2 py-1 text-xs border border-slate-200 rounded" />
                                                            </div>
                                                            <button onClick={() => {
                                                                const updated = (formData.campaigns?.evidence || []).filter((_, i) => i !== idx);
                                                                setFormData(prev => ({ ...prev, campaigns: { ...prev.campaigns, evidence: updated } }));
                                                            }} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* Placeholder for Sections 7+ */}
                        {
                            activeSection > 5 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p>Editor for Section {activeSection + 1} coming soon...</p>
                                </div>
                            )
                        }

                        {
                            showFireIncidentForm && (
                                <FireIncidentForm
                                    incident={editingIncident}
                                    onChange={(incidentData) => {
                                        let updatedIncidents;
                                        if (editingIncident) {
                                            updatedIncidents = fireIncidents.map(inc =>
                                                inc.id === editingIncident.id ? incidentData : inc
                                            );
                                        } else {
                                            updatedIncidents = [...fireIncidents, incidentData];
                                        }
                                        handleUpdateIncidents('fireIncidents', updatedIncidents);
                                    }}
                                    onClose={() => {
                                        setShowFireIncidentForm(false);
                                        setEditingIncident(null);
                                    }}
                                />
                            )
                        }

                        {
                            showFirstAidIncidentForm && (
                                <FirstAidIncidentForm
                                    incident={editingIncident}
                                    onChange={(incidentData) => {
                                        let updatedIncidents;
                                        if (editingIncident) {
                                            updatedIncidents = firstAidIncidents.map(inc =>
                                                inc.id === editingIncident.id ? incidentData : inc
                                            );
                                        } else {
                                            updatedIncidents = [...firstAidIncidents, incidentData];
                                        }
                                        handleUpdateIncidents('firstAidIncidents', updatedIncidents);
                                    }}
                                    onClose={() => {
                                        setShowFirstAidIncidentForm(false);
                                        setEditingIncident(null);
                                    }}
                                />
                            )
                        }

                        {
                            showFFHIncidentForm && (
                                <FFHIncidentForm
                                    incident={editingIncident}
                                    onChange={(incidentData) => {
                                        let updatedIncidents;
                                        if (editingIncident) {
                                            updatedIncidents = ffhIncidents.map(inc =>
                                                inc.id === editingIncident.id ? incidentData : inc
                                            );
                                        } else {
                                            updatedIncidents = [...ffhIncidents, incidentData];
                                        }
                                        handleUpdateIncidents('ffhIncidents', updatedIncidents);
                                    }}
                                    onClose={() => {
                                        setShowFFHIncidentForm(false);
                                        setEditingIncident(null);
                                    }}
                                />
                            )
                        }
                    </div >
                </div >
            </div >

            {/* Developer Credit */}
            < div className="md:col-span-4 mt-4 pb-4 text-center" >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100">
                    <svg className="w-4 h-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-xs text-slate-400">Developed by</span>
                    <span className="text-sm font-semibold text-slate-700">Sifat Hasan Apu</span>
                </div>
            </div >
        </div >
    );
};

export default AdminPanel;
