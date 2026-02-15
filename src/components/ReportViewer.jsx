import React, { useState } from 'react';
import {
    Calendar, Users, Clock, AlertTriangle, CheckCircle, Shield,
    TrendingUp, Activity, FileText, Anchor, Zap, Droplet,
    ClipboardCheck, AlertCircle, BarChart3, Target, CheckCircle2, XCircle,
    Flame, ArrowDown, MapPin, Leaf, Construction, Maximize2, ZoomIn, ZoomOut, X,
    BookOpen
} from 'lucide-react';
import FireIncidentView from './FireIncidentView';
import FirstAidIncidentView from './FirstAidIncidentView';
import FFHIncidentView from './FFHIncidentView';

// --- UTILITY: SECTION HEADER (Matches Screenshot Style) ---
// Used for "Key Performance Indicators", "Incidents", etc.
const SectionHeader = ({ icon: Icon, title, sectionNum, colorClass, bgClass }) => (
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className={`p-1.5 md:p-2 rounded-lg ${bgClass} ${colorClass} shadow-sm flex-shrink-0`}>
            <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <h3 className="text-sm md:text-lg font-bold text-slate-700 uppercase tracking-tighter md:tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
        </h3>
        <div className="flex-1 h-px bg-slate-200 ml-2 md:ml-4"></div>

        {/* PC View: As requested, same style */}
        <span className="hidden md:inline text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
            Section {sectionNum}
        </span>

        {/* Mobile View: Smart Badge */}
        <span className="md:hidden text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap">
            SEC {sectionNum}
        </span>
    </div>
);

// --- COMPONENT: WEB LAYOUT (Matches User's Screenshots) ---
const WebLayout = ({ data, month }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-16 md:pb-20 p-0 md:p-6">

            {/* 1. Header Card (Minimal & Formal Redesign) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                {/* Decorative Top Accent (Minimal) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>

                <div className="p-5 md:p-12 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                        Monthly EHS Performance Report
                    </div>

                    {/* Main Title (Clean Typography) */}
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-2 md:mb-3">
                        {month.split(' ')[0]} <span className="text-slate-400 font-light">{month.split(' ')[1]}</span>
                    </h1>

                    {/* Subtitle / Context */}
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs md:text-sm font-medium mb-6 md:mb-12">
                        <span>{data?.basicInfo?.projectName || 'Project Site'}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{data?.basicInfo?.location || 'Location'}</span>
                    </div>

                    {/* Key Stats Grid (Formal Layout) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-slate-100 pt-5 md:pt-8">
                        <div className="text-center group hover:-translate-y-0.5 transition-transform duration-300">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2 group-hover:text-brand-500 transition-colors">Total Manpower</p>
                            <p className="text-2xl md:text-3xl font-black text-slate-800 tabular-nums">{data?.basicInfo?.manpower?.total || '0'}</p>
                        </div>
                        <div className="text-center group hover:-translate-y-0.5 transition-transform duration-300">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2 group-hover:text-emerald-500 transition-colors">Safe Man-Hours</p>
                            <p className="text-2xl md:text-3xl font-black text-emerald-600 tabular-nums">{data?.kpis?.manHours?.current ? (data.kpis.manHours.current / 1000).toFixed(1) + 'k' : '0'}</p>
                        </div>
                        <div className="text-center group hover:-translate-y-0.5 transition-transform duration-300">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2 group-hover:text-blue-500 transition-colors">LTI Free Days</p>
                            <p className="text-lg md:text-3xl font-black text-blue-600 tabular-nums">{data?.kpis?.laggingIndicators?.ltiFreeDays?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="text-center group hover:-translate-y-0.5 transition-transform duration-300">
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2 group-hover:text-purple-500 transition-colors">Compliance Score</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-lg md:text-3xl font-black text-slate-800 tabular-nums">{data?.kpis?.complianceScore || '0'}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Project Overview & Workforce Dynamics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={16} className="md:w-[20px] md:h-[20px]" />
                        </div>
                        <h3 className="text-sm md:text-lg font-bold text-slate-800">Project Overview</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CLIENT</p>
                            <p className="font-semibold text-slate-800">{data?.basicInfo?.client || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CONTRACTOR</p>
                            <p className="font-semibold text-slate-800">{data?.basicInfo?.contractor || 'EPC Consortium'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                            <Users size={16} className="md:w-[20px] md:h-[20px]" />
                        </div>
                        <h3 className="text-sm md:text-lg font-bold text-slate-800">Workforce Dynamics</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-slate-500 text-xs md:text-sm">No workforce data.</p>
                    </div>
                </div>
            </div>

            {/* 3. Policy Statement */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield size={12} /> Policy Statement
                    </p>
                    <blockquote className="text-xl font-serif italic text-slate-800 mb-6">
                        "{data?.policyObjectives?.policy || 'Safety is our core value.'}"
                    </blockquote>
                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Commitment</p>
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm md:text-base font-bold text-slate-700 uppercase tracking-wide">Monthly Objectives</h4>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{month}</span>
                    </div>
                    <ul className="space-y-3">
                        {data?.policyObjectives?.objectives?.map((obj, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {obj}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Section 3: KPIs */}
            <div className="pt-4">
                <SectionHeader icon={Clock} title="Key Performance Indicators" sectionNum="3" bgClass="bg-purple-50" colorClass="text-purple-600" />
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-8">
                    {/* 1. Man Hours */}
                    <div className="mb-6 md:mb-8">
                        <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4 border-b border-slate-100 pb-2">Man-Hours Statistics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="p-3 md:p-4 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center group">
                                <span className="text-xs md:text-sm font-semibold text-slate-600">Current Month</span>
                                <span className="text-lg md:text-2xl font-black text-slate-800 tabular-nums group-hover:text-purple-600 transition-colors">
                                    {data?.kpis?.manHours?.current?.toLocaleString() || '0'}
                                </span>
                            </div>
                            <div className="p-3 md:p-4 bg-slate-50/50 rounded-lg border border-slate-100 flex justify-between items-center group">
                                <span className="text-xs md:text-sm font-semibold text-slate-600">Cumulative (Project)</span>
                                <span className="text-lg md:text-2xl font-black text-slate-800 tabular-nums group-hover:text-purple-600 transition-colors">
                                    {data?.kpis?.manHours?.cumulative?.toLocaleString() || '0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Lagging Indicators */}
                    <div className="mb-6 md:mb-8">
                        <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4 border-b border-slate-100 pb-2">Lagging Indicators</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">FATALITY</div>
                                <div className="text-base md:text-xl font-black text-slate-800">0</div>
                            </div>
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">LTI</div>
                                <div className={`text-base md:text-xl font-black ${data?.kpis?.laggingIndicators?.lti > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                                    {data?.kpis?.laggingIndicators?.lti || 0}
                                </div>
                            </div>
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">LTIFR</div>
                                <div className="text-base md:text-xl font-black text-slate-800">{data?.kpis?.laggingIndicators?.ltifr || '0.0'}</div>
                            </div>
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">TRIR</div>
                                <div className="text-base md:text-xl font-black text-slate-800">{data?.kpis?.laggingIndicators?.trir || '0.0'}</div>
                            </div>
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">FIRST AID</div>
                                <div className="text-base md:text-xl font-black text-slate-800">{data?.kpis?.laggingIndicators?.firstAid || 0}</div>
                            </div>
                            <div className="text-center p-2 md:p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">NEAR MISS</div>
                                <div className="text-base md:text-xl font-black text-slate-800">{data?.kpis?.laggingIndicators?.nearMiss || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Training Stats */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Training & Competency</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                    {data?.programs?.training?.inductionParticipants || 0}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Safety Inductions</p>
                                    <p className="text-xs text-slate-400">New workmen inducted</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                                    {data?.programs?.training?.toolboxTalks?.length || 0}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Toolbox Talks</p>
                                    <p className="text-xs text-slate-400">Sessions conducted</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                                    {data?.programs?.training?.specificTrainings?.length || 0}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Specific Trainings</p>
                                    <p className="text-xs text-slate-400">Specialized sessions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Site Inspections / Observation Report */}
            <div className="pt-4">
                <SectionHeader icon={ClipboardCheck} title="Site Inspection / Observation Report" sectionNum="4" bgClass="bg-purple-50" colorClass="text-purple-600" />
                <div className="space-y-6">
                    {data?.siteInspections?.findings?.length > 0 ? (
                        data.siteInspections.findings.map((finding, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* ক. Header Information (Formal) */}
                                {/* ক. Header Information (Formal) */}
                                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Observation Report</span>
                                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded">#{finding.id || `OBS-${i + 1}`}</span>
                                        </div>
                                        {/* খ. Observation Category Badge */}
                                        <div className="flex gap-2">
                                            {finding.observationType === 'safeAct' && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
                                                    <CheckCircle size={12} /> Safe Act
                                                </span>
                                            )}
                                            {finding.observationType === 'unsafeAct' && (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1.5">
                                                    <AlertTriangle size={12} /> Unsafe Act
                                                </span>
                                            )}
                                            {finding.observationType === 'unsafeCondition' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1.5">
                                                    <XCircle size={12} /> Unsafe Condition
                                                </span>
                                            )}
                                            {!finding.observationType && (
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                                                    General Observation
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Header Info Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date & Time</p>
                                            <p className="text-slate-800 font-bold">{finding.date || '-'} {finding.time && `• ${finding.time}`}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                                            <p className="text-slate-800 font-bold flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{finding.location || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Observer</p>
                                            <p className="text-slate-800 font-bold">{finding.observerName || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Activity / Work</p>
                                            <p className="text-slate-800 font-bold">{finding.activityType || finding.category || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Category</p>
                                            <p className="text-slate-800 font-bold">{finding.subCategory || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* গ. Description & Risk with Photo Evidence */}
                                {finding.observationType === 'safeAct' ? (
                                    /* Safe Act / Positive Observation Layout */
                                    <div className="p-0">
                                        <div className="relative">
                                            <div className="aspect-video bg-emerald-50 relative overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(finding.nonCompliance.image); setZoomLevel(1); }}>
                                                {finding.nonCompliance?.image ? (
                                                    <>
                                                        <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-100 transition-transform duration-500 group-hover:scale-105" alt="Positive Observation" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                                                        <CheckCircle className="w-8 h-8 mb-2 text-emerald-300" />
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-emerald-500">
                                                        <CheckCircle size={18} className="text-emerald-500 stroke-[3]" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 w-full bg-emerald-600 py-1.5 flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">GOOD PRACTICE / POSITIVE OBSERVATION</span>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-gradient-to-b from-emerald-50/50 to-white border-t border-emerald-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">OBSERVATION DETAILS</p>
                                                    <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wide bg-emerald-100 text-emerald-600 border border-emerald-200">
                                                        Positive
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{finding.nonCompliance?.description || 'No details provided.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : finding.observationType === 'unsafeCondition' ? (
                                    /* Unsafe Condition Layout (Single Card / Red) */
                                    <div className="p-0">
                                        <div className="relative">
                                            <div className="aspect-video bg-red-50 relative overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(finding.nonCompliance.image); setZoomLevel(1); }}>
                                                {finding.nonCompliance?.image ? (
                                                    <>
                                                        <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-100 transition-transform duration-500 group-hover:scale-105" alt="Unsafe Condition" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                                                        <XCircle className="w-8 h-8 mb-2 text-red-300" />
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-red-500">
                                                        <XCircle size={18} className="text-red-500 stroke-[3]" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 w-full bg-red-600 py-1.5 flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">UNSAFE CONDITION / RISK</span>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-gradient-to-b from-red-50/50 to-white border-t border-red-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest">OBSERVATION DETAILS</p>
                                                    {finding.riskLevel && (
                                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wide ${finding.riskLevel === 'high' ? 'bg-red-100 text-red-600 border border-red-200' :
                                                            finding.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                                                'bg-red-100 text-red-600 border border-red-200'
                                                            }`}>
                                                            {finding.riskLevel} Risk
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{finding.nonCompliance?.description || 'No details provided.'}</p>
                                            </div>
                                        </div>
                                    </div>

                                ) : (
                                    /* Standard Non-Compliance Layout */
                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                        {/* Left: Observation / Non-Compliance */}
                                        <div className="p-0">
                                            <div className="relative">
                                                <div className="aspect-video bg-slate-100 relative overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(finding.nonCompliance.image); setZoomLevel(1); }}>
                                                    {finding.nonCompliance?.image ? (
                                                        <>
                                                            <img src={finding.nonCompliance.image} className="w-full h-full object-contain bg-slate-100 transition-transform duration-500 group-hover:scale-105" alt="Before / Observation" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                                                            <ClipboardCheck className="w-8 h-8 mb-2 text-slate-300" />
                                                            No Image
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-red-500">
                                                            <X size={18} className="text-red-500 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full bg-red-600 py-1.5 flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">NON-COMPLIANCE</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 bg-gradient-to-b from-red-50/50 to-white border-t border-red-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-xs font-bold text-red-600 uppercase tracking-widest">OBSERVATION</p>
                                                        {/* Risk Level Badge */}
                                                        {finding.riskLevel && (
                                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wide ${finding.riskLevel === 'high' ? 'bg-red-100 text-red-600 border border-red-200' :
                                                                finding.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                                                    'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                                                }`}>
                                                                {finding.riskLevel} Risk
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{finding.nonCompliance?.description || 'No observation details provided.'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Corrective Action / After */}
                                        <div className="p-0">
                                            <div className="relative">
                                                <div className="aspect-video bg-slate-100 relative overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(finding.correctiveAction.image); setZoomLevel(1); }}>
                                                    {finding.correctiveAction?.image ? (
                                                        <>
                                                            <img src={finding.correctiveAction.image} className="w-full h-full object-contain bg-slate-100 transition-transform duration-500 group-hover:scale-105" alt="After / Corrected" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                                                            <CheckCircle className="w-8 h-8 mb-2 text-slate-300" />
                                                            No Image
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-emerald-500">
                                                            <CheckCircle size={18} className="text-emerald-500 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full bg-emerald-600 py-1.5 flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">CORRECTIVE ACTION</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 bg-gradient-to-b from-emerald-50/50 to-white border-t border-emerald-100">
                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">ACTION TAKEN</p>
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{finding.correctiveAction?.description || 'No corrective action details provided.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ঘ. Action & Follow-up Section (Formal Footer) */}
                                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommendation / Permanent Solution</p>
                                            <p className="text-sm text-slate-700 font-medium">{finding.recommendation || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Responsible Person</p>
                                            <p className="text-sm text-slate-800 font-semibold">{finding.responsiblePerson || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</p>
                                            <p className={`text-sm font-semibold ${finding.deadline ? 'text-slate-800' : 'text-slate-400'}`}>{finding.deadline || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge (if closed/open) */}
                                {finding.status && (
                                    <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${finding.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {finding.status === 'closed' ? 'Closed' : 'Open'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-12 text-center">
                            <ClipboardCheck className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-slate-200" />
                            <p className="text-sm md:text-base text-slate-500 font-medium">No site inspections recorded for this reporting period.</p>
                            <p className="text-xs md:text-sm text-slate-400 mt-1">Observations will appear here once documented.</p>
                        </div>
                    )}
                </div>
            </div >

            {/* Section 5: Incidents (Renumbered from 4) */}
            < div className="pt-4" >
                <SectionHeader icon={CheckCircle} title="Incidents & Learning" sectionNum="5" bgClass="bg-emerald-50" colorClass="text-emerald-600" />
                <div className="space-y-8">
                    {/* Fire Incidents */}
                    {data?.incidents?.fireIncidents?.map((inc, i) => (
                        <div key={`fire-web-${i}`}><FireIncidentView incident={inc} /></div>
                    ))}
                    {/* Injury Incidents */}
                    {data?.incidents?.firstAidIncidents?.map((inc, i) => (
                        <div key={`inj-web-${i}`}><FirstAidIncidentView incident={inc} /></div>
                    ))}
                    {/* FFH Incidents */}
                    {data?.incidents?.ffhIncidents?.map((inc, i) => (
                        <div key={`ffh-web-${i}`}><FFHIncidentView incident={inc} /></div>
                    ))}
                    {(!data?.incidents?.fireIncidents?.length && !data?.incidents?.firstAidIncidents?.length && !data?.incidents?.ffhIncidents?.length) && (
                        <div className="bg-white p-8 md:p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-200 mx-auto mb-3 md:mb-4" />
                            <p className="text-sm md:text-base text-slate-500 font-medium">No incidents recorded for this month.</p>
                        </div>
                    )}
                </div>
            </div >

            {/* Section 6: Programs & Activities */}
            < div className="pt-4" >
                <SectionHeader icon={CheckCircle2} title="EHS Programs & Activities" sectionNum="6" bgClass="bg-teal-50" colorClass="text-teal-600" />

                {/* Training & Awareness Sub-section */}
                {(data?.programs?.training?.inductionConducted || data?.programs?.training?.toolboxTalks?.length > 0 || data?.programs?.training?.specificTrainings?.length > 0 || data?.programs?.training?.evidence?.length > 0) && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-blue-700">
                                <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
                            </div>
                            <h4 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider">Training & Awareness</h4>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Induction */}
                            {data?.programs?.training?.inductionConducted && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <CheckCircle2 size={16} className="text-blue-600 md:w-[18px] md:h-[18px]" />
                                    <span className="text-xs md:text-sm text-slate-700 font-medium">Safety Induction Conducted</span>
                                    <span className="ml-auto text-xs md:text-sm font-bold text-blue-700 bg-white px-2 py-1 rounded">{data?.programs?.training?.inductionParticipants || 0} Participants</span>
                                </div>
                            )}

                            {/* Toolbox Talks */}
                            {data?.programs?.training?.toolboxTalks?.length > 0 && (
                                <div>
                                    <h5 className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Toolbox Talks (TBT)</h5>
                                    <div className="overflow-hidden border border-slate-200 rounded-lg">
                                        <table className="w-full text-xs md:text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Topic</th>
                                                    <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Participants</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {data.programs.training.toolboxTalks.map((tbt, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-2 text-slate-700">{tbt.date || '-'}</td>
                                                        <td className="px-4 py-2 text-slate-700 font-medium">{tbt.topic || '-'}</td>
                                                        <td className="px-4 py-2 text-center font-bold text-slate-800">{tbt.participants || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Specific Trainings */}
                            {data?.programs?.training?.specificTrainings?.length > 0 && (
                                <div>
                                    <h5 className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Specific Trainings</h5>
                                    <div className="overflow-hidden border border-slate-200 rounded-lg">
                                        <table className="w-full text-xs md:text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Topic</th>
                                                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                                    <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Participants</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {data.programs.training.specificTrainings.map((tr, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-2 text-slate-700">{tr.date || '-'}</td>
                                                        <td className="px-4 py-2 text-slate-700 font-medium">{tr.topic || '-'}</td>
                                                        <td className="px-4 py-2"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">{tr.type || '-'}</span></td>
                                                        <td className="px-4 py-2 text-center font-bold text-slate-800">{tr.participants || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Total Man-Hours */}
                            {data?.programs?.training?.totalManHours > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <Clock size={18} className="text-emerald-600" />
                                    <span className="text-sm text-slate-700 font-medium">Total Training Man-Hours:</span>
                                    <span className="ml-auto text-lg font-black text-emerald-700">{data?.programs?.training?.totalManHours}</span>
                                </div>
                            )}

                            {/* Evidence Gallery */}
                            {data?.programs?.training?.evidence?.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📸 Photo Evidence</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.programs.training.evidence.map((ev, idx) => (
                                            <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(ev.imageUrl); setZoomLevel(1); }}>
                                                <div className="aspect-square bg-slate-100 relative">
                                                    <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-full object-contain duration-300" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Maximize2 className="text-white drop-shadow-md w-6 h-6" />
                                                    </div>
                                                </div>
                                                {ev.caption && <p className="p-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-100 truncate">{ev.caption}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Emergency Preparedness Sub-section */}
                {(data?.programs?.emergencyPreparedness?.mockDrillConducted || data?.programs?.emergencyPreparedness?.fireEquipmentInspection || data?.programs?.emergencyPreparedness?.evidence?.length > 0) && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-red-700">
                                <Shield size={18} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Emergency Preparedness</h4>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Mock Drill */}
                            {data?.programs?.emergencyPreparedness?.mockDrillConducted && (
                                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle2 size={18} className="text-red-600" />
                                        <span className="text-sm text-slate-700 font-bold">Mock Drill Conducted</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-3 pl-7">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Type</p>
                                            <p className="text-sm text-slate-700 font-medium">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.type || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                                            <p className="text-sm text-slate-700 font-medium">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.date || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Participants</p>
                                            <p className="text-sm text-slate-800 font-bold">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.participants || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fire Equipment Inspection */}
                            {data?.programs?.emergencyPreparedness?.fireEquipmentInspection && (
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <CheckCircle2 size={18} className="text-orange-600" />
                                    <span className="text-sm text-slate-700 font-medium">Fire Equipment Inspection Completed</span>
                                </div>
                            )}

                            {/* Evidence Gallery */}
                            {data?.programs?.emergencyPreparedness?.evidence?.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📸 Photo Evidence</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.programs.emergencyPreparedness.evidence.map((ev, idx) => (
                                            <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(ev.imageUrl); setZoomLevel(1); }}>
                                                <div className="aspect-square bg-slate-100 relative">
                                                    <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-full object-contain duration-300" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Maximize2 className="text-white drop-shadow-md w-6 h-6" />
                                                    </div>
                                                </div>
                                                {ev.caption && <p className="p-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-100 truncate">{ev.caption}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Campaigns & Motivation Sub-section */}
                {(data?.programs?.campaigns?.safetyCommitteeMeeting?.held || data?.programs?.campaigns?.healthHygiene?.conducted || data?.programs?.campaigns?.rewardsRecognition?.given || data?.programs?.campaigns?.specialDays?.length > 0 || data?.programs?.campaigns?.evidence?.length > 0) && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-purple-700">
                                <Activity size={18} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Campaigns & Motivation</h4>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Safety Committee Meeting */}
                            {data?.programs?.campaigns?.safetyCommitteeMeeting?.held && (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <CheckCircle2 size={18} className="text-purple-600" />
                                    <span className="text-sm text-slate-700 font-medium">Safety Committee Meeting Held</span>
                                    <span className="ml-auto text-sm font-bold text-purple-700 bg-white px-2 py-1 rounded">{data?.programs?.campaigns?.safetyCommitteeMeeting?.date || '-'}</span>
                                </div>
                            )}

                            {/* Health & Hygiene */}
                            {data?.programs?.campaigns?.healthHygiene?.conducted && (
                                <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle2 size={18} className="text-pink-600" />
                                        <span className="text-sm text-slate-700 font-medium">Health & Hygiene Activity Conducted</span>
                                    </div>
                                    {data?.programs?.campaigns?.healthHygiene?.details && (
                                        <p className="text-sm text-slate-600 pl-7">{data.programs.campaigns.healthHygiene.details}</p>
                                    )}
                                </div>
                            )}

                            {/* Rewards & Recognition */}
                            {data?.programs?.campaigns?.rewardsRecognition?.given && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Target size={18} className="text-amber-600" />
                                        <span className="text-sm text-slate-700 font-medium">Rewards / Recognition Given</span>
                                    </div>
                                    {data?.programs?.campaigns?.rewardsRecognition?.details && (
                                        <p className="text-sm text-slate-600 pl-7">{data.programs.campaigns.rewardsRecognition.details}</p>
                                    )}
                                </div>
                            )}

                            {/* Special Days */}
                            {data?.programs?.campaigns?.specialDays?.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Special Days Observed</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {data.programs.campaigns.specialDays.map((day, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-700 font-medium">
                                                {day.name} <span className="text-slate-400 text-xs">({day.date})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evidence Gallery */}
                            {data?.programs?.campaigns?.evidence?.length > 0 && (
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">📸 Photo Evidence</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.programs.campaigns.evidence.map((ev, idx) => (
                                            <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden group cursor-zoom-in" onClick={() => { setSelectedImage(ev.imageUrl); setZoomLevel(1); }}>
                                                <div className="aspect-square bg-slate-100 relative">
                                                    <img src={ev.imageUrl} alt={ev.caption || 'Evidence'} className="w-full h-full object-contain duration-300" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Maximize2 className="text-white drop-shadow-md w-6 h-6" />
                                                    </div>
                                                </div>
                                                {ev.caption && <p className="p-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-100 truncate">{ev.caption}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Fallback if no data */}
                {(!data?.programs?.training && !data?.programs?.emergencyPreparedness && !data?.programs?.campaigns) && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                        <p className="text-slate-400 italic text-sm">No EHS programs or activities reported for this period.</p>
                    </div>
                )}
            </div >

            {/* Section 8: High-Risk Work Controls (Renumbered from 7) */}
            < div className="pt-4" >
                <SectionHeader icon={CheckCircle2} title="High-Risk Work Controls" sectionNum="8" bgClass="bg-purple-50" colorClass="text-purple-600" />
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    {data?.highRiskWork?.permits?.length > 0 ? (
                        <div className="space-y-6">
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-slate-200">Permit Type</th>
                                            <th className="px-6 py-4 border-b border-slate-200 text-center">Opened</th>
                                            <th className="px-6 py-4 border-b border-slate-200 text-center">Closed</th>
                                            <th className="px-6 py-4 border-b border-slate-200 text-center">Violations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                                        {data.highRiskWork.permits.map((p, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-700">{p.type}</td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{p.opened}</td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{p.closed}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-black ${p.violations > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                                                        {p.violations}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {data?.highRiskWork?.highlights && (
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-2">Highlights:</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{data.highRiskWork.highlights}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic text-sm">No specific updates reported for this period.</p>
                    )}
                </div>
            </div >

            {/* Section 9: Environmental Performance (Renumbered from 8) */}
            < div className="pt-4" >
                <SectionHeader icon={CheckCircle2} title="Environmental Performance" sectionNum="9" bgClass="bg-emerald-50" colorClass="text-emerald-600" />
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Waste Generated</p>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-700 flex justify-between"><span>Hazardous:</span> <strong>{data?.environment?.waste?.hazardous || '-'}</strong></p>
                                <p className="text-sm text-slate-700 flex justify-between"><span>Non-Haz:</span> <strong>{data?.environment?.waste?.nonHazardous || '-'}</strong></p>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Consumption</p>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-700 flex justify-between"><span>Water:</span> <strong>{data?.environment?.consumption?.water || '-'}</strong></p>
                                <p className="text-sm text-slate-700 flex justify-between"><span>Fuel:</span> <strong>{data?.environment?.consumption?.fuel || '-'}</strong></p>
                            </div>
                        </div>
                        <div className="p-4 bg-rose-50/50 rounded-lg border border-rose-100">
                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Spills</p>
                            <p className="text-lg md:text-2xl font-black text-rose-600">{data?.environment?.spills || 0}</p>
                        </div>
                    </div>
                </div>
            </div >

            {/* Section 10: Issues & Challenges (Unchanged) */}
            < div className="pt-4" >
                <SectionHeader icon={CheckCircle2} title="Issues & Challenges" sectionNum="10" bgClass="bg-emerald-50" colorClass="text-emerald-600" />
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-slate-700 uppercase tracking-wide text-xs mb-4 flex items-center gap-2">
                                <AlertCircle size={14} className="text-rose-500" /> Key Challenges
                            </h4>
                            <ul className="space-y-2">
                                {data?.issues?.challenges?.map((c, i) => (
                                    <li key={i} className="text-sm text-slate-700 pl-3 border-l-2 border-rose-200">{c}</li>
                                ))}
                                {!data?.issues?.challenges?.length && <li className="text-slate-400 italic text-sm">None recorded.</li>}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 uppercase tracking-wide text-xs mb-4 flex items-center gap-2">
                                <Construction size={14} className="text-amber-500" /> Support & Resources Needed
                            </h4>
                            <ul className="space-y-2">
                                {data?.issues?.supportNeeded?.map((s, i) => (
                                    <li key={i} className="text-sm text-slate-700 pl-3 border-l-2 border-amber-200">{s}</li>
                                ))}
                                {!data?.issues?.supportNeeded?.length && <li className="text-slate-400 italic text-sm">None recorded.</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div >

            {/* Report Prepared By Footer */}
            {
                (data?.basicInfo?.preparedBy?.name || data?.basicInfo?.preparedBy?.designation) && (
                    <div className="pt-8 pb-4 mt-8 border-t border-slate-200">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Prepared by</p>
                            <p className="text-sm font-bold text-slate-800">{data.basicInfo.preparedBy.name}</p>
                            <p className="text-xs text-slate-500">{data.basicInfo.preparedBy.designation}</p>
                        </div>
                    </div>
                )
            }

            {/* Lightbox / Image Zoom Modal */}
            {
                selectedImage && (
                    <div
                        className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 z-[10000] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </button>
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-auto no-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Full Screen View"
                                className="transition-transform duration-300 ease-out object-contain max-h-full max-w-full shadow-2xl rounded-sm"
                                style={{ transform: `scale(${zoomLevel})`, cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
                                onClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)}
                            />
                        </div>
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-[10000]">
                            <button
                                onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(0.5, prev - 0.5)); }}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <span className="px-3 py-2 rounded-full bg-black/50 text-white text-xs font-mono border border-white/10 backdrop-blur-md flex items-center">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.min(3, prev + 0.5)); }}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// --- COMPONENT: PRINT LAYOUT (Corporate PDF Version) ---
const PrintLayout = ({ data, month }) => {
    // Use company info from form data, fallback to defaults
    const COMPANY_NAME = data?.basicInfo?.companyName || "United Chattogram Power Limited";
    const COMPANY_LOGO = "/ucpl_logo_v2.png";

    return (
        <div className="report-container">
            {/* Fixed Footer with Page Numbers (appears on all pages via CSS) */}
            {/* Fixed Footer removed - handled in PublicView.jsx via jsPDF */}

            {/* ==================== PAGE 1: COVER PAGE ==================== */}
            <div className="pdf-cover-page">
                <div className="pdf-cover-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <img src={COMPANY_LOGO} alt="Company Logo" className="logo-large" style={{ margin: '0 auto 15px auto', display: 'block' }} />
                    <p className="company-name-large">{COMPANY_NAME}</p>
                </div>

                <div className="pdf-cover-title">
                    <h1>Monthly EHS Performance Report</h1>
                    <p className="period">{month}</p>
                </div>

                {/* Project Info */}
                <div className="pdf-info-grid" style={{ marginTop: '40px' }}>
                    <div className="pdf-info-box">
                        <div className="label">Project Name</div>
                        <div className="value">{data?.basicInfo?.projectName || '-'}</div>
                    </div>
                    <div className="pdf-info-box">
                        <div className="label">Location</div>
                        <div className="value">{data?.basicInfo?.location || '-'}</div>
                    </div>
                    <div className="pdf-info-box">
                        <div className="label">Client</div>
                        <div className="value">{data?.basicInfo?.client || '-'}</div>
                    </div>
                    <div className="pdf-info-box">
                        <div className="label">Contractor</div>
                        <div className="value">{data?.basicInfo?.contractor || 'EPC Consortium'}</div>
                    </div>
                </div>

            </div>

            {/* ==================== PAGE 2: EXECUTIVE SUMMARY & POLICY ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 1: Executive Summary & Policy</h2>

                {/* Key Stats Summary */}
                <div style={{ marginBottom: '40px' }}>
                    <h3 className="pdf-subsection-header">Executive Summary</h3>
                    <table className="pdf-table">
                        <thead>
                            <tr>
                                <th>Total Manpower</th>
                                <th>Man-Hours (Month)</th>
                                <th>Man-Hours (Cumulative)</th>
                                <th>LTI Free Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{data?.basicInfo?.manpower?.total || '0'}+</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{data?.kpis?.manHours?.current?.toLocaleString() || '0'}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{data?.kpis?.manHours?.cumulative?.toLocaleString() || '0'}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{data?.kpis?.laggingIndicators?.ltiFreeDays?.toLocaleString() || '0'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Policy Statement & Objectives (Smart Layout) */}
                <div style={{ display: 'flex', gap: '25px', alignItems: 'stretch', marginTop: '30px' }} className="pdf-keep-together">
                    {/* Left: Policy */}
                    <div style={{ flex: '1', padding: '30px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#0f766e' }}></div>
                        <div>
                            <h3 style={{ fontSize: '9pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '20px', letterSpacing: '1px' }}>Policy Statement</h3>
                            <blockquote style={{ fontSize: '14pt', fontFamily: 'serif', fontStyle: 'italic', color: '#1e293b', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                                "{data?.policyObjectives?.policy || data?.policyObjectives?.policyStatement || 'Prioritizing safety, health, and environment in every action we take.'}"
                            </blockquote>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                            <span style={{ fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Project Commitment</span>
                        </div>
                    </div>

                    {/* Right: Objectives */}
                    <div style={{ flex: '1', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                            <h3 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#334155', margin: 0, letterSpacing: '0.5px' }}>Monthly Objectives</h3>
                            <span style={{
                                fontSize: '8pt',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '0 14px',
                                borderRadius: '14px',
                                fontWeight: 'bold',
                                border: '1px solid #dbeafe',
                                display: 'inline-block',
                                lineHeight: '26px', // Height - 2px border
                                height: '28px',
                                verticalAlign: 'middle',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                            }}>{month}</span>
                        </div>
                        <div className="pdf-objectives-list">
                            {data?.policyObjectives?.objectives?.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {data.policyObjectives.objectives.map((obj, i) => (
                                            <tr key={i}>
                                                <td style={{ width: '20px', verticalAlign: 'top', paddingBottom: '15px', paddingTop: '6px' }}>
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#3b82f6',
                                                        display: 'block'
                                                    }}></span>
                                                </td>
                                                <td style={{
                                                    verticalAlign: 'top',
                                                    paddingBottom: '15px',
                                                    color: '#475569',
                                                    fontSize: '10pt',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {obj}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="pdf-objectives-empty" style={{ fontSize: '10pt', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No specific objectives set for this month.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== PAGE 3: KEY PERFORMANCE INDICATORS ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 2: Key Performance Indicators</h2>

                {/* Man-Hours */}
                <h3 className="pdf-subsection-header">Man-Hours Statistics</h3>
                <div className="pdf-info-grid">
                    <div className="pdf-info-box">
                        <div className="label">Current Month</div>
                        <div className="value" style={{ fontSize: '18pt', color: '#1e3a5f' }}>
                            {data?.kpis?.manHours?.current?.toLocaleString() || '0'}
                        </div>
                    </div>
                    <div className="pdf-info-box">
                        <div className="label">Cumulative (Project)</div>
                        <div className="value" style={{ fontSize: '18pt', color: '#1e3a5f' }}>
                            {data?.kpis?.manHours?.cumulative?.toLocaleString() || '0'}
                        </div>
                    </div>
                </div>

                {/* Lagging Indicators */}
                <h3 className="pdf-subsection-header">Lagging Indicators</h3>
                <div className="pdf-kpi-grid">
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">Fatality</div>
                        <div className="kpi-value">0</div>
                    </div>
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">LTI</div>
                        <div className={`kpi-value ${data?.kpis?.laggingIndicators?.lti > 0 ? 'danger' : ''}`}>
                            {data?.kpis?.laggingIndicators?.lti || 0}
                        </div>
                    </div>
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">LTIFR</div>
                        <div className="kpi-value">{data?.kpis?.laggingIndicators?.ltifr || '0.00'}</div>
                    </div>
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">TRIR</div>
                        <div className="kpi-value">{data?.kpis?.laggingIndicators?.trir || '0.00'}</div>
                    </div>
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">First Aid</div>
                        <div className="kpi-value">{data?.kpis?.laggingIndicators?.firstAid || 0}</div>
                    </div>
                    <div className="pdf-kpi-card">
                        <div className="kpi-label">Near Miss</div>
                        <div className="kpi-value">{data?.kpis?.laggingIndicators?.nearMiss || 0}</div>
                    </div>
                </div>

                {/* Training Statistics */}
                <h3 className="pdf-subsection-header">Training Statistics</h3>
                <table className="pdf-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th style={{ textAlign: 'center' }}>Sessions</th>
                            <th style={{ textAlign: 'center' }}>Participants</th>
                            <th style={{ textAlign: 'center' }}>Man-Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Safety Induction</td>
                            <td style={{ textAlign: 'center' }}>{data?.programs?.training?.inductionConducted ? '1' : '0'}</td>
                            <td style={{ textAlign: 'center' }}>{data?.programs?.training?.inductionParticipants || 0}</td>
                            <td style={{ textAlign: 'center' }}>-</td>
                        </tr>
                        <tr>
                            <td>Toolbox Talks (TBT)</td>
                            <td style={{ textAlign: 'center' }}>{data?.programs?.training?.toolboxTalks?.length || 0}</td>
                            <td style={{ textAlign: 'center' }}>
                                {data?.programs?.training?.toolboxTalks?.reduce((sum, t) => sum + (t.participants || 0), 0) || 0}
                            </td>
                            <td style={{ textAlign: 'center' }}>-</td>
                        </tr>
                        <tr>
                            <td>Specific Trainings</td>
                            <td style={{ textAlign: 'center' }}>{data?.programs?.training?.specificTrainings?.length || 0}</td>
                            <td style={{ textAlign: 'center' }}>
                                {data?.programs?.training?.specificTrainings?.reduce((sum, t) => sum + (t.participants || 0), 0) || 0}
                            </td>
                            <td style={{ textAlign: 'center' }}>{data?.programs?.training?.totalManHours || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ==================== PAGE 4: SITE INSPECTIONS ==================== */}
            {data?.siteInspections?.findings?.length > 0 && (
                <div className="pdf-page-break">
                    <h2 className="pdf-section-header">Section 3: Site Inspection / Observation Report</h2>
                    <p style={{ fontSize: '9pt', color: '#64748b', marginBottom: '15px' }}>
                        Total Observations: <strong>{data.siteInspections.findings.length}</strong> |
                        Open: <strong style={{ color: '#dc2626' }}>{data.siteInspections.findings.filter(f => f.status !== 'closed').length}</strong> |
                        Closed: <strong style={{ color: '#16a34a' }}>{data.siteInspections.findings.filter(f => f.status === 'closed').length}</strong>
                    </p>

                    {data.siteInspections.findings.map((finding, i) => (
                        <div key={i} className="pdf-inspection-card-v2">
                            <div className="insp-header">
                                <span className="insp-title">#{i + 1} — {finding.category || 'General'} / {finding.subCategory || '-'}</span>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span className={`pdf-badge ${finding.observationType === 'Safe Act' ? 'safe-act' : finding.observationType === 'Unsafe Act' ? 'unsafe-act' : 'unsafe-condition'}`}>
                                        {finding.observationType || 'Observation'}
                                    </span>
                                    <span className={`pdf-badge risk-${(finding.riskLevel || 'low').toLowerCase()}`}>
                                        {finding.riskLevel || 'N/A'} Risk
                                    </span>
                                    <span className={`pdf-badge ${finding.status === 'closed' ? 'closed' : 'open'}`}>
                                        {finding.status === 'closed' ? 'CLOSED' : 'OPEN'}
                                    </span>
                                </div>
                            </div>

                            <div className="insp-meta-grid">
                                <div className="insp-meta-item">
                                    <div className="meta-label">Date</div>
                                    <div className="meta-value">{finding.date || '-'}</div>
                                </div>
                                <div className="insp-meta-item">
                                    <div className="meta-label">Time</div>
                                    <div className="meta-value">{finding.time || '-'}</div>
                                </div>
                                <div className="insp-meta-item">
                                    <div className="meta-label">Location</div>
                                    <div className="meta-value">{finding.location || '-'}</div>
                                </div>
                                <div className="insp-meta-item">
                                    <div className="meta-label">Observer</div>
                                    <div className="meta-value">{finding.observerName || '-'}</div>
                                </div>
                                <div className="insp-meta-item">
                                    <div className="meta-label">Activity</div>
                                    <div className="meta-value">{finding.activityType || '-'}</div>
                                </div>
                            </div>

                            <div className="insp-images">
                                <div className="insp-img-col">
                                    <div className="img-label nc-label">Non-Compliance / Observation</div>
                                    <div className="insp-img-container">
                                        {finding.nonCompliance?.image ? (
                                            <img src={finding.nonCompliance.image} alt="Observation" />
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '9pt' }}>No Image</span>
                                        )}
                                    </div>
                                    <div className="img-desc">{finding.nonCompliance?.description || '-'}</div>
                                </div>
                                <div className="insp-img-col">
                                    <div className="img-label ca-label">Corrective Action</div>
                                    <div className="insp-img-container">
                                        {finding.correctiveAction?.image ? (
                                            <img src={finding.correctiveAction.image} alt="Corrective" />
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '9pt' }}>No Image</span>
                                        )}
                                    </div>
                                    <div className="img-desc">{finding.correctiveAction?.description || '-'}</div>
                                </div>
                            </div>

                            <div className="insp-footer">
                                <div>
                                    <div className="footer-label">Recommendation</div>
                                    <div className="footer-value">{finding.recommendation || '-'}</div>
                                </div>
                                <div>
                                    <div className="footer-label">Responsible Person</div>
                                    <div className="footer-value">{finding.responsiblePerson || '-'}</div>
                                </div>
                                <div>
                                    <div className="footer-label">Deadline</div>
                                    <div className="footer-value">{finding.deadline || '-'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ==================== PAGE 5: INCIDENTS - DETAILED REPORTS ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 4: Incidents & Learning</h2>

                {(data?.incidents?.fireIncidents?.length > 0 || data?.incidents?.firstAidIncidents?.length > 0 || data?.incidents?.ffhIncidents?.length > 0) ? (
                    <>
                        {/* ---- FIRE INCIDENTS ---- */}
                        {data?.incidents?.fireIncidents?.map((inc, i) => (
                            <div key={`fire-${i}`} className="pdf-incident-report allow-break" style={{ marginBottom: '20px' }}>
                                <div className="pdf-incident-banner fire">
                                    <div>
                                        <div className="inc-title">🔥 Fire Incident Report #{i + 1}</div>
                                        <div style={{ fontSize: '8pt', color: '#ef4444', fontWeight: 700, marginTop: '2px' }}>
                                            Severity: {inc.severity === 'major' ? 'Major (Fatality/High Loss)' : inc.severity === 'moderate' ? 'Moderate (Property Damage)' : 'Minor (Near Miss)'}
                                        </div>
                                    </div>
                                    <div className="inc-meta">
                                        <div>ID: #{inc.id?.replace('ID-', '') || '0000'}</div>
                                        <div>{inc.date || '-'}</div>
                                    </div>
                                </div>
                                <div className="pdf-incident-body">
                                    <div className="inc-section-title">Incident Details</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Date</div><div className="d-value">{inc.date || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Time</div><div className="d-value">{inc.time || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Location</div><div className="d-value">{inc.location || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Reported By</div><div className="d-value">{inc.reportedBy || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Severity</div><div className="d-value" style={{ color: inc.severity === 'major' ? '#dc2626' : inc.severity === 'moderate' ? '#d97706' : '#16a34a' }}>{inc.severity === 'major' ? 'Major' : inc.severity === 'moderate' ? 'Moderate' : 'Minor'}</div></div>
                                        <div className="detail-item"><div className="d-label">Type of Fire</div><div className="d-value">{inc.classification === 'electrical' ? 'Electrical' : inc.classification === 'chemical' ? 'Chemical' : inc.classification === 'solid' ? 'Solid Material' : inc.classification === 'oil_gas' ? 'Oil/Gas' : '-'}</div></div>
                                    </div>

                                    {inc.narrative && (<>
                                        <div className="inc-section-title">Description / Narrative</div>
                                        <div className="pdf-incident-narrative">{inc.narrative}</div>
                                    </>)}

                                    {(inc.spottedBy || inc.incidentTime) && (<>
                                        <div className="inc-section-title">Immediate Action Taken</div>
                                        <div className="pdf-incident-narrative">
                                            {inc.spottedBy && inc.incidentTime && <>The fire was first spotted by <strong>{inc.spottedBy}</strong> at <strong>{inc.incidentTime}</strong>. </>}
                                            {inc.alertMethod && <>Alert raised via <strong>{inc.alertMethod}</strong>. </>}
                                            {inc.sourceIsolated && inc.isolationMethod && <>The <strong>{inc.sourceIsolated}</strong> was <strong>{inc.isolationMethod}</strong>. </>}
                                            {inc.workerAction && <>All personnel <strong>{inc.workerAction}</strong>. </>}
                                            {inc.extinguishingAgent && inc.responder && inc.fireOutTime && <>Fire extinguished using <strong>{inc.extinguishingAgent}</strong> by <strong>{inc.responder}</strong> at <strong>{inc.fireOutTime}</strong>.</>}
                                        </div>
                                    </>)}

                                    <div className="inc-section-title">Damage Assessment</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Human Injury</div><div className="d-value">{inc.humanInjury || 'None'}</div></div>
                                        <div className="detail-item"><div className="d-label">Property Damage</div><div className="d-value">{inc.propertyDamage || 'None'}</div></div>
                                        <div className="detail-item"><div className="d-label">Environmental Impact</div><div className="d-value">{inc.environmentalImpact || 'None'}</div></div>
                                    </div>

                                    {(inc.whyAnalysis?.length > 0 || inc.directCause || inc.rootCause) && (
                                        <div className="pdf-keep-together">
                                            <div className="inc-section-title">Root Cause Analysis (5-Why)</div>
                                            {inc.whyAnalysis?.map((why, idx) => (
                                                <div key={idx} style={{ marginBottom: '4px', fontSize: '9pt' }}>
                                                    <strong style={{ color: '#475569' }}>{idx + 1}. {why.question}</strong>
                                                    <div style={{ paddingLeft: '12px', color: '#64748b', borderLeft: '2px solid #fde68a', marginLeft: '4px', marginTop: '2px' }}>Ans: {why.answer || 'Pending'}</div>
                                                </div>
                                            ))}
                                            <div className="pdf-incident-detail-grid" style={{ marginTop: '8px' }}>
                                                <div className="detail-item"><div className="d-label" style={{ color: '#dc2626' }}>Direct Cause</div><div className="d-value">{inc.directCause || 'Pending'}</div></div>
                                                <div className="detail-item"><div className="d-label" style={{ color: '#dc2626' }}>Root Cause</div><div className="d-value">{inc.rootCause || 'Pending'}</div></div>
                                            </div>
                                        </div>
                                    )}

                                    {inc.correctiveActions?.length > 0 && (
                                        <div className="pdf-keep-together">
                                            <div className="inc-section-title">Corrective & Preventive Actions (CAPA)</div>
                                            <table className="pdf-capa-table">
                                                <thead><tr><th>Action Item</th><th>Responsibility</th><th>Target Date</th><th>Status</th></tr></thead>
                                                <tbody>
                                                    {inc.correctiveActions.map((capa, idx) => (
                                                        <tr key={idx}>
                                                            <td>{capa.action || '-'}</td>
                                                            <td>{capa.owner || '-'}</td>
                                                            <td>{capa.dueDate || '-'}</td>
                                                            <td><span className={`pdf-badge ${capa.status === 'CLOSED' ? 'closed' : 'open'}`}>{capa.status || 'OPEN'}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {inc.attachments?.length > 0 && (<>
                                        <div className="inc-section-title">Evidence & Attachments</div>
                                        <div className="pdf-evidence-grid">
                                            {inc.attachments.map((file, idx) => (
                                                <div key={idx} className="pdf-evidence-item">
                                                    <div className="evidence-img"><img src={file.url} alt={`Evidence ${idx + 1}`} /></div>
                                                    <div className="evidence-caption">{file.caption || `Attachment #${idx + 1}`}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>)}
                                </div>
                            </div>
                        ))}

                        {/* ---- FIRST AID / INJURY INCIDENTS ---- */}
                        {data?.incidents?.firstAidIncidents?.map((inc, i) => (
                            <div key={`fa-${i}`} className="pdf-incident-report allow-break" style={{ marginBottom: '20px' }}>
                                <div className="pdf-incident-banner firstaid">
                                    <div>
                                        <div className="inc-title">🩹 Injury / First Aid Report #{i + 1}</div>
                                        <div style={{ fontSize: '8pt', color: '#f43f5e', fontWeight: 700, marginTop: '2px' }}>Medical Confidential</div>
                                    </div>
                                    <div className="inc-meta">
                                        <div>Ref: {inc.id || '-'}</div>
                                        <div>{inc.dateOfInjury || '-'}</div>
                                    </div>
                                </div>
                                <div className="pdf-incident-body">
                                    <div className="inc-section-title">A — Injured Person Details</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Name</div><div className="d-value">{inc.ipName || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Employee ID</div><div className="d-value">{inc.employeeId || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Designation</div><div className="d-value">{inc.designation || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Dept / Contractor</div><div className="d-value">{inc.department || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Supervisor</div><div className="d-value">{inc.supervisor || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Date / Time</div><div className="d-value">{inc.dateOfInjury || '-'} {inc.timeOfInjury || ''}</div></div>
                                    </div>

                                    <div className="inc-section-title">C — Injury Assessment</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Nature of Injury</div><div className="d-value" style={{ color: '#e11d48', fontWeight: 700 }}>{inc.natureOfInjury || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Body Parts</div><div className="d-value">{inc.bodyPart?.join(', ') || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Location</div><div className="d-value">{inc.location || '-'}</div></div>
                                    </div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Depth</div><div className="d-value">{inc.severityDepth || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Bleeding</div><div className="d-value">{inc.severityBleeding || '-'}</div></div>
                                    </div>

                                    {inc.description && (<>
                                        <div className="inc-section-title">D — Description</div>
                                        <div className="pdf-incident-narrative">"{inc.description}"</div>
                                    </>)}

                                    <div className="inc-section-title">E — PPE Verification</div>
                                    <div className="pdf-check-grid">
                                        <div className="pdf-check-item"><span className="check-label">Hand Gloves</span><span className={`check-value ${inc.glovesWorn === 'Yes' ? 'yes' : 'no'}`}>{inc.glovesWorn || '-'}</span></div>
                                        <div className="pdf-check-item"><span className="check-label">Glove Type</span><span className="check-value">{inc.gloveType || '-'}</span></div>
                                        <div className="pdf-check-item"><span className="check-label">PPE Appropriate</span><span className={`check-value ${inc.ppeAppropriate === 'Yes' ? 'yes' : 'no'}`}>{inc.ppeAppropriate || '-'}</span></div>
                                    </div>

                                    <div className="inc-section-title">F — Treatment</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Administered By</div><div className="d-value">{inc.administeredBy || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">ATV Given</div><div className="d-value">{inc.atvGiven || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Hospital Referral</div><div className="d-value">{inc.hospitalReferral || 'No'}{inc.hospitalReferral === 'Yes' && inc.hospitalName ? ` — ${inc.hospitalName}` : ''}</div></div>
                                    </div>
                                    {inc.treatmentSteps?.length > 0 && (
                                        <div style={{ marginTop: '6px', fontSize: '8pt', color: '#475569' }}>
                                            <strong>Procedures:</strong> {inc.treatmentSteps.join(' • ')}
                                        </div>
                                    )}

                                    {inc.attachments?.length > 0 && (<>
                                        <div className="inc-section-title">G — Medical Evidence</div>
                                        <div className="pdf-evidence-grid">
                                            {inc.attachments.map((file, idx) => (
                                                <div key={idx} className="pdf-evidence-item">
                                                    <div className="evidence-img"><img src={file.url} alt={`Evidence ${idx + 1}`} /></div>
                                                    <div className="evidence-caption">{file.caption || `Record #${idx + 1}`}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>)}
                                </div>
                            </div>
                        ))}

                        {/* ---- FALL FROM HEIGHT INCIDENTS ---- */}
                        {data?.incidents?.ffhIncidents?.map((inc, i) => (
                            <div key={`ffh-${i}`} className="pdf-incident-report allow-break" style={{ marginBottom: '20px' }}>
                                <div className="pdf-incident-banner ffh">
                                    <div>
                                        <div className="inc-title">⚠️ Fall From Height Report #{i + 1}</div>
                                        <div style={{ fontSize: '8pt', color: '#f97316', fontWeight: 700, marginTop: '2px' }}>Critical High Risk Incident</div>
                                    </div>
                                    <div className="inc-meta"><div>ID: #{inc.id || '-'}</div></div>
                                </div>
                                <div className="pdf-incident-body">
                                    <div className="inc-section-title">A — General Information</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Date & Time</div><div className="d-value">{inc.dateTime || inc.date || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Location</div><div className="d-value">{inc.location || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Weather</div><div className="d-value">{inc.weatherCondition || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Exact Height</div><div className="d-value" style={{ color: '#ea580c', fontWeight: 700 }}>{inc.exactHeight || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Surface Landed</div><div className="d-value">{inc.surfaceLanded || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Working Platform</div><div className="d-value">{inc.workingPlatform || '-'}</div></div>
                                    </div>

                                    {inc.fallProtectionUsed && (<>
                                        <div className="inc-section-title">B — Fall Protection</div>
                                        <div className="pdf-check-grid">
                                            <div className="pdf-check-item"><span className="check-label">Harness Worn</span><span className={`check-value ${inc.fallProtectionUsed.harnessWorn === 'Yes' ? 'yes' : 'no'}`}>{inc.fallProtectionUsed.harnessWorn || '-'}</span></div>
                                            <div className="pdf-check-item"><span className="check-label">Double Lanyard</span><span className={`check-value ${inc.fallProtectionUsed.doubleLanyard === 'Yes' ? 'yes' : 'no'}`}>{inc.fallProtectionUsed.doubleLanyard || '-'}</span></div>
                                            <div className="pdf-check-item"><span className="check-label">Hooked/Anchored</span><span className={`check-value ${inc.fallProtectionUsed.hookedAnchored === 'Yes' ? 'yes' : 'no'}`}>{inc.fallProtectionUsed.hookedAnchored || '-'}</span></div>
                                        </div>
                                    </>)}

                                    <div className="inc-section-title">C — Injury Assessment</div>
                                    <div className="pdf-incident-detail-grid">
                                        <div className="detail-item"><div className="d-label">Consciousness</div><div className="d-value">{inc.consciousnessLevel || '-'}</div></div>
                                        <div className="detail-item"><div className="d-label">Visible Injuries</div><div className="d-value">{inc.visibleInjuries?.join(', ') || 'None recorded'}</div></div>
                                    </div>

                                    {inc.description && (<>
                                        <div className="inc-section-title">D — Incident Description</div>
                                        <div className="pdf-incident-narrative">"{inc.description}"</div>
                                    </>)}

                                    {(inc.immediateCauses?.length > 0 || inc.rootCauses?.length > 0) && (<>
                                        <div className="inc-section-title">E — Root Cause Analysis</div>
                                        {inc.immediateCauses?.length > 0 && (
                                            <div style={{ marginBottom: '6px' }}>
                                                <div style={{ fontSize: '7pt', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: '3px' }}>Immediate Causes</div>
                                                {inc.immediateCauses.map((c, idx) => <div key={idx} style={{ fontSize: '9pt', color: '#475569', paddingLeft: '8px' }}>• {c}</div>)}
                                            </div>
                                        )}
                                        {inc.rootCauses?.length > 0 && (
                                            <div>
                                                <div style={{ fontSize: '7pt', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', marginBottom: '3px' }}>Root Causes</div>
                                                {inc.rootCauses.map((c, idx) => <div key={idx} style={{ fontSize: '9pt', color: '#475569', paddingLeft: '8px' }}>• {c}</div>)}
                                            </div>
                                        )}
                                    </>)}

                                    {(inc.movedBy || inc.firstAidGiven?.length > 0) && (<>
                                        <div className="inc-section-title">F — Rescue & Medical</div>
                                        <div className="pdf-incident-detail-grid">
                                            <div className="detail-item"><div className="d-label">How Victim Was Moved</div><div className="d-value">{inc.movedBy || '-'}</div></div>
                                            <div className="detail-item"><div className="d-label">First Aid Given</div><div className="d-value">{inc.firstAidGiven?.join(', ') || 'None'}</div></div>
                                        </div>
                                    </>)}

                                    {inc.actions?.length > 0 && (<>
                                        <div className="inc-section-title">G — Corrective Action Plan</div>
                                        <table className="pdf-capa-table">
                                            <thead><tr><th>Action Item</th><th>Responsibility</th><th>Deadline</th></tr></thead>
                                            <tbody>
                                                {inc.actions.map((action, idx) => (
                                                    <tr key={idx}>
                                                        <td>{action.item || '-'}</td>
                                                        <td>{action.responsibility || '-'}</td>
                                                        <td>{action.deadline || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>)}

                                    {inc.attachments?.length > 0 && (<>
                                        <div className="inc-section-title">H — Evidence & Site Photos</div>
                                        <div className="pdf-evidence-grid cols-3">
                                            {inc.attachments.map((file, idx) => (
                                                <div key={idx} className="pdf-evidence-item">
                                                    <div className="evidence-img"><img src={file.url} alt={`Evidence ${idx + 1}`} /></div>
                                                    <div className="evidence-caption">{file.caption || 'No caption'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>)}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px', color: '#666' }}>
                        ✓ No incidents recorded for this reporting period.
                    </div>
                )}
            </div>

            {/* ==================== PAGE 6: PROGRAMS & ACTIVITIES ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 5: Health & Safety Programs & Activities</h2>

                {/* Training Summary */}
                <div className="pdf-keep-together">
                    <h3 className="pdf-subsection-header">5.1 Training & Development</h3>
                    <div className="pdf-info-grid" style={{ marginBottom: '12px' }}>
                        <div className="pdf-info-box">
                            <div className="label">Induction Conducted</div>
                            <div className="value">{data?.programs?.training?.inductionConducted ? '✓ Yes' : '✗ No'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Induction Participants</div>
                            <div className="value">{data?.programs?.training?.inductionParticipants || 0}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Total Training Man-Hours</div>
                            <div className="value" style={{ fontWeight: 'bold', color: '#1e3a5f' }}>{data?.programs?.training?.totalManHours || '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Toolbox Talks */}
                {data?.programs?.training?.toolboxTalks?.length > 0 && (
                    <div className="pdf-keep-together">
                        <h4 style={{ fontSize: '10pt', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Toolbox Talks (TBT)</h4>
                        <table className="pdf-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Topic</th>
                                    <th style={{ textAlign: 'center' }}>Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.programs.training.toolboxTalks.map((tbt, i) => (
                                    <tr key={i}>
                                        <td>{tbt.date || '-'}</td>
                                        <td>{tbt.topic || '-'}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{tbt.participants || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Specific Trainings */}
                {data?.programs?.training?.specificTrainings?.length > 0 && (
                    <div className="pdf-keep-together" style={{ marginTop: '12px' }}>
                        <h4 style={{ fontSize: '10pt', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Specific Trainings</h4>
                        <table className="pdf-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Topic</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.programs.training.specificTrainings.map((st, i) => (
                                    <tr key={i}>
                                        <td>{st.date || '-'}</td>
                                        <td>{st.topic || '-'}</td>
                                        <td>{st.type || '-'}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{st.participants || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Training Evidence Photos */}
                {data?.programs?.training?.evidence?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                        <h4 style={{ fontSize: '9pt', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Training Evidence</h4>
                        <div className="pdf-evidence-grid">
                            {data.programs.training.evidence.map((ev, idx) => (
                                <div key={idx} className="pdf-evidence-item">
                                    <div className="evidence-img"><img src={ev.imageUrl} alt={`Training ${idx + 1}`} /></div>
                                    <div className="evidence-caption">{ev.caption || `Training Photo #${idx + 1}`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Emergency Preparedness */}
                <div className="pdf-keep-together" style={{ marginTop: '20px' }}>
                    <h3 className="pdf-subsection-header">5.2 Emergency Preparedness</h3>
                    <div className="pdf-info-grid">
                        <div className="pdf-info-box">
                            <div className="label">Mock Drill Conducted</div>
                            <div className="value">{data?.programs?.emergencyPreparedness?.mockDrillConducted ? '✓ Yes' : '✗ No'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Mock Drill Type</div>
                            <div className="value">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.type || '-'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Date</div>
                            <div className="value">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.date || '-'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Participants</div>
                            <div className="value">{data?.programs?.emergencyPreparedness?.mockDrillDetails?.participants || 0}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Fire Equipment Inspection</div>
                            <div className="value">{data?.programs?.emergencyPreparedness?.fireEquipmentInspection ? '✓ Completed' : '-'}</div>
                        </div>
                    </div>
                </div>

                {/* Emergency Preparedness Evidence */}
                {data?.programs?.emergencyPreparedness?.evidence?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                        <h4 style={{ fontSize: '9pt', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Emergency Drill Evidence</h4>
                        <div className="pdf-evidence-grid">
                            {data.programs.emergencyPreparedness.evidence.map((ev, idx) => (
                                <div key={idx} className="pdf-evidence-item">
                                    <div className="evidence-img"><img src={ev.imageUrl} alt={`Drill ${idx + 1}`} /></div>
                                    <div className="evidence-caption">{ev.caption || `Drill Photo #${idx + 1}`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Campaigns & Motivation */}
                <div className="pdf-keep-together" style={{ marginTop: '20px' }}>
                    <h3 className="pdf-subsection-header">5.3 Campaigns & Motivation</h3>
                    <ul className="pdf-list">
                        {data?.programs?.campaigns?.safetyCommitteeMeeting?.held && (
                            <li>Safety Committee Meeting: {data.programs.campaigns.safetyCommitteeMeeting.date || '-'}</li>
                        )}
                        {data?.programs?.campaigns?.healthHygiene?.conducted && (
                            <li>Health & Hygiene Activity: {data.programs.campaigns.healthHygiene.details || 'Conducted'}</li>
                        )}
                        {data?.programs?.campaigns?.rewardsRecognition?.given && (
                            <li>Rewards & Recognition: {data.programs.campaigns.rewardsRecognition.details || 'Given'}</li>
                        )}
                        {data?.programs?.campaigns?.specialDays?.map((day, i) => (
                            <li key={i}>Special Day: {day.name} ({day.date})</li>
                        ))}
                        {!data?.programs?.campaigns?.safetyCommitteeMeeting?.held && !data?.programs?.campaigns?.healthHygiene?.conducted && !data?.programs?.campaigns?.rewardsRecognition?.given && !data?.programs?.campaigns?.specialDays?.length && (
                            <li style={{ color: '#94a3b8', fontStyle: 'italic' }}>No campaigns recorded this period.</li>
                        )}
                    </ul>
                </div>

                {/* Campaign Evidence */}
                {data?.programs?.campaigns?.evidence?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                        <h4 style={{ fontSize: '9pt', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Campaign Evidence</h4>
                        <div className="pdf-evidence-grid">
                            {data.programs.campaigns.evidence.map((ev, idx) => (
                                <div key={idx} className="pdf-evidence-item">
                                    <div className="evidence-img"><img src={ev.imageUrl} alt={`Campaign ${idx + 1}`} /></div>
                                    <div className="evidence-caption">{ev.caption || `Campaign Photo #${idx + 1}`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== PAGE 7: HIGH RISK WORK CONTROLS ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 6: High Risk Work Controls</h2>

                {/* Permit to Work */}
                {data?.highRiskWork?.permits?.length > 0 && (
                    <div className="pdf-keep-together">
                        <h3 className="pdf-subsection-header">Permit to Work Summary</h3>
                        <table className="pdf-table">
                            <thead>
                                <tr>
                                    <th>Permit Type</th>
                                    <th style={{ textAlign: 'center' }}>Opened</th>
                                    <th style={{ textAlign: 'center' }}>Closed</th>
                                    <th style={{ textAlign: 'center' }}>Violations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.highRiskWork.permits.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.type}</td>
                                        <td style={{ textAlign: 'center' }}>{p.opened}</td>
                                        <td style={{ textAlign: 'center' }}>{p.closed}</td>
                                        <td style={{ textAlign: 'center', color: p.violations > 0 ? '#dc2626' : 'inherit', fontWeight: p.violations > 0 ? 'bold' : 'normal' }}>
                                            {p.violations}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Safety Controls  */}
                {data?.highRiskWork?.safetyControls?.length > 0 && (
                    <div className="pdf-keep-together" style={{ marginTop: '16px' }}>
                        <h3 className="pdf-subsection-header">Safety Controls & Measures</h3>
                        <ul className="pdf-list">
                            {data.highRiskWork.safetyControls.map((ctrl, i) => (
                                <li key={i}>{ctrl}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {!data?.highRiskWork?.permits?.length && !data?.highRiskWork?.safetyControls?.length && (
                    <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px', color: '#666' }}>
                        No high-risk work activities reported this period.
                    </div>
                )}
            </div>

            {/* ==================== PAGE 8: ENVIRONMENTAL PERFORMANCE ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 7: Environmental Performance</h2>

                <div className="pdf-keep-together">
                    <h3 className="pdf-subsection-header">Waste Management</h3>
                    <div className="pdf-info-grid">
                        <div className="pdf-info-box">
                            <div className="label">Hazardous Waste</div>
                            <div className="value">{data?.environment?.waste?.hazardous || '-'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Non-Hazardous Waste</div>
                            <div className="value">{data?.environment?.waste?.nonHazardous || '-'}</div>
                        </div>
                    </div>
                </div>

                <div className="pdf-keep-together" style={{ marginTop: '16px' }}>
                    <h3 className="pdf-subsection-header">Resource Consumption</h3>
                    <div className="pdf-info-grid">
                        <div className="pdf-info-box">
                            <div className="label">Water Consumption</div>
                            <div className="value">{data?.environment?.consumption?.water || '-'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Fuel Consumption</div>
                            <div className="value">{data?.environment?.consumption?.fuel || '-'}</div>
                        </div>
                        <div className="pdf-info-box">
                            <div className="label">Electricity Usage</div>
                            <div className="value">{data?.environment?.consumption?.electricity || '-'}</div>
                        </div>
                    </div>
                </div>

                <div className="pdf-keep-together" style={{ marginTop: '16px' }}>
                    <h3 className="pdf-subsection-header">Environmental Incidents</h3>
                    <div className="pdf-info-box" style={{ textAlign: 'center', padding: '16px' }}>
                        <div className="label">Spills Reported</div>
                        <div className="value" style={{ fontSize: '28pt', color: data?.environment?.spills > 0 ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
                            {data?.environment?.spills || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== PAGE 9: CHALLENGES & IMPROVEMENT PLAN ==================== */}
            <div className="pdf-page-break">
                <h2 className="pdf-section-header">Section 8: Challenges & Improvement Plan</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* Challenges */}
                    <div className="pdf-keep-together">
                        <h3 className="pdf-subsection-header">Key Challenges</h3>
                        {data?.issues?.challenges?.length > 0 ? (
                            <ul className="pdf-list">
                                {data.issues.challenges.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        ) : (
                            <p style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>No significant challenges reported.</p>
                        )}
                    </div>

                    {/* Support Needed */}
                    <div className="pdf-keep-together">
                        <h3 className="pdf-subsection-header">Support & Resources Needed</h3>
                        {data?.issues?.supportNeeded?.length > 0 ? (
                            <ul className="pdf-list">
                                {data.issues.supportNeeded.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        ) : (
                            <p style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>No additional support required.</p>
                        )}
                    </div>
                </div>

                {/* Improvement Plan */}
                <div className="pdf-keep-together" style={{ marginTop: '30px' }}>
                    <h3 className="pdf-subsection-header">Improvement Plan for Next Month</h3>
                    {data?.improvementPlan?.actions?.length > 0 ? (
                        <ul className="pdf-list">
                            {data.improvementPlan.actions.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                    ) : (
                        <p style={{ fontSize: '10pt', color: '#666', fontStyle: 'italic' }}>Improvement plan to be determined.</p>
                    )}
                </div>

                {/* Signature Section */}
                <div className="pdf-signature-section" style={{ marginTop: '60px' }}>
                    <div className="pdf-signature-box">
                        <div className="line"></div>
                        <div className="role">EHS Officer</div>
                        <div className="name-date">Name: _________________ Date: _________</div>
                    </div>
                    <div className="pdf-signature-box">
                        <div className="line"></div>
                        <div className="role">Project Manager</div>
                        <div className="name-date">Name: _________________ Date: _________</div>
                    </div>
                </div>

                {/* Report Generation Info */}
                <div style={{ marginTop: '60px', textAlign: 'center', fontSize: '8pt', color: '#999' }}>
                    <p>Report Generated: {new Date().toLocaleString()}</p>
                    <p style={{ marginTop: '5px' }}>Developed by Sifat Hasan Apu</p>
                </div>
            </div>
        </div>
    );
};

const ReportViewer = ({ data, month, isPrintPreview = false }) => {
    // If in print preview mode (modal), only show the print layout
    if (isPrintPreview) {
        return (
            <div className="report-container-wrapper">
                <PrintLayout data={data} month={month} />
            </div>
        );
    }

    // Normal mode: show web view by default, print view toggled via CSS
    return (
        <div className="report-container-wrapper">
            <div className="web-view"><WebLayout data={data} month={month} /></div>
            <div className="print-view"><PrintLayout data={data} month={month} /></div>
        </div>
    );
};

export default ReportViewer;
