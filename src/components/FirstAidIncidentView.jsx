import React, { useState } from 'react';
import { Activity, Calendar, MapPin, User, Clock, Shield, AlertCircle, HeartPulse, CheckCircle2, XCircle, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

const FirstAidIncidentView = ({ incident }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    if (!incident) return null;

    const LabelValue = ({ label, value, icon: Icon, className = "" }) => (
        <div className={`space-y-1 ${className}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                {Icon && <Icon size={10} />}
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-800">{value || '-'}</p>
        </div>
    );

    const SectionHeader = ({ number, title }) => (
        <div className="flex items-center gap-3 border-b border-rose-100 pb-2 mb-4 mt-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center border border-rose-200">
                {number}
            </span>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">{title}</h4>
        </div>
    );

    const CheckItem = ({ label, checked }) => (
        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${checked ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${checked ? 'bg-rose-500 border-rose-500' : 'bg-white border-slate-300'}`}>
                {checked && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <span className={`text-xs font-bold ${checked ? 'text-rose-900' : 'text-slate-500'}`}>{label}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden break-inside-avoid mb-8 relative">
            {/* Header / Banner */}
            <div className="bg-rose-50/50 border-b border-rose-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500 border border-rose-100">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">INJURY / FIRST AID REPORT</h3>
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 uppercase tracking-wide">
                                Medical Confidential
                            </span>
                        </div>
                        <p className="text-xs text-rose-600/80 font-mono font-medium">Ref: {incident.id}</p>
                    </div>
                </div>
                <div className="flex gap-6 pr-4">
                    <LabelValue label="Date" value={incident.dateOfInjury} icon={Calendar} />
                    <LabelValue label="Time" value={incident.timeOfInjury} icon={Clock} />
                    <LabelValue label="Reported" value={incident.timeReported} />
                    <LabelValue label="Location" value={incident.location} icon={MapPin} />
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 gap-8">

                {/* Section A: IP Details */}
                <section>
                    <SectionHeader number="A" title="Injured Person Details" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <LabelValue label="Name" value={incident.ipName} icon={User} />
                        <LabelValue label="ID No." value={incident.employeeId} />
                        <LabelValue label="Designation" value={incident.designation} />
                        <LabelValue label="Dept / Contractor" value={incident.department} />
                        <LabelValue label="Supervisor" value={incident.supervisor} className="md:col-span-2" />
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section C: Injury Details */}
                    <section>
                        <SectionHeader number="C" title="Injury Assessment" />
                        <div className="space-y-4">
                            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                <p className="text-[10px] font-bold text-rose-400 uppercase mb-2">Nature of Injury</p>
                                <p className="text-lg font-bold text-rose-700">{incident.natureOfInjury || 'Unspecified'}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Body Parts Affected</p>
                                <div className="flex flex-wrap gap-2">
                                    {incident.bodyPart?.map((part, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                                            {part}
                                        </span>
                                    )) || <span className="text-xs text-slate-400">None specified</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelValue label="Depth" value={incident.severityDepth} />
                                <LabelValue label="Bleeding" value={incident.severityBleeding} />
                            </div>
                        </div>
                    </section>

                    {/* Section D: Description */}
                    <section>
                        <SectionHeader number="D" title="Description of Occurrence" />
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 h-full">
                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                "{incident.description || 'No description provided.'}"
                            </p>
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section E: PPE */}
                    <section>
                        <SectionHeader number="E" title="PPE Verification" />
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white">
                                <span className="text-xs font-medium text-slate-600">Hand Gloves Worn?</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${incident.glovesWorn === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{incident.glovesWorn}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white">
                                <span className="text-xs font-medium text-slate-600">Check Type</span>
                                <span className="text-xs font-bold text-slate-700">{incident.gloveType || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white">
                                <span className="text-xs font-medium text-slate-600">Appropriate for Job?</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${incident.ppeAppropriate === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{incident.ppeAppropriate}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Section F: Treatment (Full Width now) */}
                <section>
                    <SectionHeader number="F" title="Treatment Provided" />
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Administered By Card */}
                                <div className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                                    <LabelValue label="Administered By" value={incident.administeredBy} icon={User} />
                                </div>
                                {/* ATV / Referral */}
                                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ATV Given?</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${incident.atvGiven === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{incident.atvGiven}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Referral?</p>
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold px-2 py-1 rounded w-max ${incident.hospitalReferral === 'Yes' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {incident.hospitalReferral === 'Yes' ? 'YES' : 'NO'}
                                            </span>
                                            {incident.hospitalReferral === 'Yes' && (
                                                <span className="text-[10px] font-bold text-slate-500 mt-1">{incident.hospitalName}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Procedures Right Column */}
                            <div className="p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Procedures Performed</p>
                                <div className="space-y-2">
                                    {['Wound Cleaned (Antiseptic)', 'Bandage / Dressing Applied', 'Medication Given (Painkiller/Antibiotic)'].map(step => (
                                        <CheckItem key={step} label={step} checked={incident.treatmentSteps?.includes(step)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section G: Evidence & Attachments */}
                {incident.attachments && incident.attachments.length > 0 && (
                    <section>
                        <SectionHeader number="G" title="Medical Evidence" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {incident.attachments.map((file, idx) => (
                                <figure key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                                    <div
                                        className="relative group aspect-square w-full overflow-hidden rounded-lg border border-slate-100 mb-2 bg-white shadow-sm flex items-center justify-center cursor-zoom-in"
                                        onClick={() => { setSelectedImage(file.url); setZoomLevel(1); }}
                                    >
                                        <img src={file.url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Maximize2 className="text-white drop-shadow-md w-6 h-6" />
                                        </div>
                                    </div>
                                    <figcaption className="text-center text-xs font-semibold text-slate-600 truncate px-1">
                                        {file.caption || `Record #${idx + 1}`}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </section>
                )}



            </div>

            {/* Lightbox / Image Viewer Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full View"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${zoomLevel})` }}
                        />
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur rounded-full px-6 py-3 border border-slate-700 shadow-xl z-[110]" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <span className="text-slate-300 font-mono text-xs font-bold w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ZoomIn size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstAidIncidentView;
