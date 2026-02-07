import React, { useState } from 'react';
import { Users, Shield, Leaf, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const FireIncidentView = ({ incident }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    if (!incident) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return dateStr;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return 'N/A';
        return timeStr;
    };

    const getSeverityLabel = (severity) => {
        const labels = {
            'minor': 'Minor (Near Miss)',
            'moderate': 'Moderate (Property Damage)',
            'major': 'Major (Fatality/High Loss)'
        };
        return labels[severity] || 'N/A';
    };

    const getClassificationLabel = (classification) => {
        const labels = {
            'electrical': 'Electrical',
            'chemical': 'Chemical',
            'solid': 'Solid Material',
            'oil_gas': 'Oil/Gas'
        };
        return labels[classification] || 'N/A';
    };

    const sectionTitleClass = "text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2";

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Report Header */}
            <div className="border-b-4 border-red-500 bg-slate-50 px-8 py-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                            Incident Report (Fire)
                        </h2>
                        <p className="text-xs font-bold text-red-500 uppercase mt-1">
                            Severity: {getSeverityLabel(incident.severity)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-mono text-slate-500">ID: #{incident.id?.replace('ID-', '') || '0000'}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(incident.date)}</p>
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 space-y-8">
                {/* Section 1: Incident Details */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 1:</span> Incident Details
                    </h3>
                    <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Incident</p>
                            <p className="text-sm font-semibold text-slate-800">{formatDate(incident.date)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time of Incident</p>
                            <p className="text-sm font-semibold text-slate-800">{formatTime(incident.time)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.location || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reported By</p>
                            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                    {(incident.reportedBy || '?').charAt(0)}
                                </span>
                                {incident.reportedBy || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Severity Level</p>
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase ${incident.severity === 'major' ? 'bg-red-100 text-red-600' : incident.severity === 'moderate' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {getSeverityLabel(incident.severity)}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type of Fire</p>
                            <p className="text-sm font-semibold text-slate-800">{getClassificationLabel(incident.classification)}</p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Description of Incident */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 2:</span> Description of Incident
                    </h3>

                    {/* Timeline */}
                    {incident.events && incident.events.length > 0 && incident.events.some(e => e.time || e.description) && (
                        <div className="mb-4 pl-4 border-l-2 border-slate-200 space-y-4">
                            {incident.events.filter(e => e.time || e.description).map((event, idx) => (
                                <div key={idx} className="relative pl-4">
                                    <div className={`absolute -left-[9px] top-1 w-3 h-3 rounded-full border-2 border-white ${idx === 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                    <p className="text-xs font-mono text-slate-400 mb-0.5">{event.time || '--:--'}</p>
                                    <p className="text-sm text-slate-700">{event.description || 'Event description'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Narrative */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Narrative:</p>
                        <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed">
                            {incident.narrative || 'N/A'}
                        </div>
                    </div>
                </section>

                {/* Section 3: Immediate Action Taken */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 3:</span> Immediate Action Taken
                    </h3>
                    <div className="px-4 py-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed">
                        {incident.spottedBy && incident.incidentTime ? (
                            <>
                                The fire was first spotted by the <strong>{incident.spottedBy}</strong> at <strong>{incident.incidentTime}</strong>.
                                {incident.alertMethod && <> Immediate alert was raised via <strong>{incident.alertMethod}</strong> to warn nearby workers.</>}
                                {incident.sourceIsolated && incident.isolationMethod && <> The <strong>{incident.sourceIsolated}</strong> was promptly <strong>{incident.isolationMethod}</strong> to cut off the energy source.</>}
                                {incident.workerAction && <> All personnel <strong>{incident.workerAction}</strong>.</>}
                                {incident.extinguishingAgent && incident.responder && incident.fireOutTime && <> The fire was successfully extinguished using <strong>{incident.extinguishingAgent}</strong> by the <strong>{incident.responder}</strong> at <strong>{incident.fireOutTime}</strong>.</>}
                            </>
                        ) : 'N/A'}
                    </div>
                </section>

                {/* Section 4: Damage Assessment */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 4:</span> Damage Assessment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Human Injury</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.humanInjury || 'None'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Property Damage</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.propertyDamage || 'None'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Environmental Impact</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.environmentalImpact || 'None'}</p>
                        </div>
                    </div>
                </section>

                {/* Section 5: Root Cause Analysis (RCA) */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 5:</span> Root Cause Analysis (RCA)
                    </h3>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-5 mb-4">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-3">Method Used: 5-Why Analysis</p>
                        <div className="space-y-3">
                            {incident.whyAnalysis && incident.whyAnalysis.map((why, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-medium text-slate-700">{idx + 1}. {why.question}</p>
                                    <p className="text-sm text-slate-500 pl-4 mt-1 border-l-2 border-amber-200">
                                        Ans: {why.answer || 'Pending'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Direct Cause</p>
                            <p className="text-sm text-slate-700">{incident.directCause || 'Pending'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Root Cause</p>
                            <p className="text-sm text-slate-700">{incident.rootCause || 'Pending'}</p>
                        </div>
                    </div>
                </section>

                {/* Section 6: Corrective & Preventive Action (CAPA) */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section 6:</span> Corrective & Preventive Action (CAPA)
                    </h3>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action Item</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsibility</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Date</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incident.correctiveActions && incident.correctiveActions.length > 0 ? (
                                    incident.correctiveActions.map((capa, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 last:border-b-0">
                                            <td className="px-4 py-3 text-slate-700">{capa.action || 'N/A'}</td>
                                            <td className="px-4 py-3 text-slate-600">{capa.owner || 'N/A'}</td>
                                            <td className="px-4 py-3 text-slate-600">{capa.dueDate || 'N/A'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${capa.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {capa.status || 'OPEN'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-6 text-center text-slate-400 italic">No corrective actions recorded</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 7: Evidence & Attachments */}
                {incident.attachments && incident.attachments.length > 0 && (
                    <section className="break-inside-avoid">
                        <h3 className={sectionTitleClass}>
                            <span className="text-slate-400">Section 7:</span> Evidence & Attachments
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {incident.attachments.map((file, idx) => (
                                <figure key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div
                                        className="relative group aspect-video w-full overflow-hidden rounded-lg border border-slate-100 mb-3 bg-white shadow-sm flex items-center justify-center cursor-zoom-in group-hover:border-indigo-200 transition-colors"
                                        onClick={() => { setSelectedImage(file.url); setZoomLevel(1); }}
                                    >
                                        <img src={file.url} alt={`Evidence ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                        </div>
                                    </div>
                                    <figcaption className="text-center text-sm font-semibold text-slate-700 px-2 mt-2 border-t border-slate-200 pt-2">
                                        {file.caption || `Attachment #${idx + 1}`}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </section>
                )}

                {/* Lightbox / Image Viewer Overlay */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm placeholder:animate-in fade-in"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-auto no-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Full View"
                                className="transition-transform duration-300 ease-out object-contain max-h-full max-w-full"
                                style={{ transform: `scale(${zoomLevel})`, cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
                                onClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)}
                            />
                        </div>

                        {/* Zoom Controls */}
                        <div
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl z-[110]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.5))}
                                className="text-slate-300 hover:text-white transition-colors"
                                disabled={zoomLevel <= 1}
                            >
                                <ZoomOut size={20} />
                            </button>
                            <span className="text-white font-mono text-sm min-w-[3ch] text-center">{Math.round(zoomLevel * 100)}%</span>
                            <button
                                onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.5))}
                                className="text-slate-300 hover:text-white transition-colors"
                                disabled={zoomLevel >= 4}
                            >
                                <ZoomIn size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FireIncidentView;
