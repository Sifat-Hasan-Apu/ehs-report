import React, { useState } from 'react';
import { ArrowDown, Maximize2, X, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';

const FFHIncidentView = ({ incident }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    if (!incident) return null;

    const sectionTitleClass = "text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2";

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b-4 border-orange-500 bg-slate-50 px-8 py-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                            Incident Report (Fall From Height)
                        </h2>
                        <p className="text-xs font-bold text-orange-500 uppercase mt-1">
                            Critical High Risk Incident
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-mono text-slate-500">ID: #{incident.id}</p>
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 space-y-8">
                {/* Section A: General Info */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section A:</span> General Information
                    </h3>
                    <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.dateTime || incident.date || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.location || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weather</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.weatherCondition || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exact Height</p>
                            <p className="text-sm font-bold text-orange-600">{incident.exactHeight || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Surface Landed</p>
                            <p className="text-sm font-semibold text-slate-800">{incident.surfaceLanded || 'N/A'}</p>
                        </div>
                    </div>
                </section>

                {/* Section B: Platform & Access Details */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section B:</span> Platform & Access Details
                    </h3>
                    <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nature of Working Platform</p>
                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                {incident.workingPlatform || 'N/A'}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Fall Protection System Used</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {incident.fallProtectionUsed ? (
                                    <>
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Harness Worn?</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${incident.fallProtectionUsed.harnessWorn === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {incident.fallProtectionUsed.harnessWorn}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Double Lanyard?</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${incident.fallProtectionUsed.doubleLanyard === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {incident.fallProtectionUsed.doubleLanyard}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Hooked / Anchored?</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${incident.fallProtectionUsed.hookedAnchored === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {incident.fallProtectionUsed.hookedAnchored}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Helmet Chin Strap?</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${incident.fallProtectionUsed.helmetChinStrap === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {incident.fallProtectionUsed.helmetChinStrap}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-slate-400 text-sm">No protection data recorded</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section C: Injury Assessment */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section C:</span> Injury Assessment (Trauma)
                    </h3>
                    <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consciousness Level:</p>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 shadow-sm">
                                {incident.consciousnessLevel || 'Unspecified'}
                            </span>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visible Injuries</p>
                            <div className="flex flex-wrap gap-2">
                                {incident.visibleInjuries && incident.visibleInjuries.length > 0 ? (
                                    incident.visibleInjuries.map((inj, i) => (
                                        <span key={i} className={`px-3 py-1 font-bold text-sm rounded-lg border flex items-center gap-2 ${inj.includes('Critical') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-700 border-slate-200'}`}>
                                            {inj.includes('Critical') && <AlertTriangle size={14} />}
                                            {inj}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 text-sm italic">None recorded</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section D: Description */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section D:</span> Incident Description
                    </h3>
                    <div className="px-5 py-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-slate-800 leading-relaxed italic">
                        "{incident.description || 'No description provided.'}"
                    </div>
                </section>

                {/* Section E: Causes */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className={sectionTitleClass}>
                            <span className="text-slate-400">Section E:</span> Root Cause Analysis
                        </h3>
                        <div className="mb-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Immediate Causes</h4>
                            <ul className="space-y-2">
                                {incident.immediateCauses?.map((c, i) => (
                                    <li key={i} className="text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {c}
                                    </li>
                                ))}
                                {!incident.immediateCauses?.length && <li className="text-slate-400 italic text-sm">None recorded</li>}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Root Causes (System Failures)</h4>
                            <ul className="space-y-2">
                                {incident.rootCauses?.map((c, i) => (
                                    <li key={i} className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> {c}
                                    </li>
                                ))}
                                {!incident.rootCauses?.length && <li className="text-slate-400 italic text-sm">None recorded</li>}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section F: Rescue & Medical */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section F:</span> Rescue & Medical Response
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-xl border border-slate-200 p-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">How was victim moved?</p>
                            <p className={`font-bold text-lg ${incident.movedBy?.includes('Manual') ? 'text-red-600' : 'text-slate-800'}`}>
                                {incident.movedBy || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">First Aid Given</p>
                            <div className="flex flex-wrap gap-2">
                                {incident.firstAidGiven && incident.firstAidGiven.length > 0 ? (
                                    incident.firstAidGiven.map((item, i) => (
                                        <span key={i} className="px-3 py-1 bg-white text-blue-600 border border-blue-100 text-xs font-bold rounded-full shadow-sm">
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-500 font-medium italic">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section G: CAPA */}
                <section>
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section G:</span> Corrective Action Plan (CAPA)
                    </h3>
                    <div className="space-y-3">
                        {incident.actions?.map((action, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex-1 mb-2 md:mb-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Action Item</span>
                                    <span className="font-bold text-slate-800 block text-sm">{action.item}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Responsibility</span>
                                        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">{action.responsibility}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Deadline</span>
                                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded border border-orange-100">{action.deadline}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!incident.actions?.length && <p className="text-slate-400 text-sm italic">No corrective actions recorded.</p>}
                    </div>
                </section>

                {/* Section H: Evidence */}
                <section className="break-inside-avoid">
                    <h3 className={sectionTitleClass}>
                        <span className="text-slate-400">Section H:</span> Evidence & Site Photos
                    </h3>
                    {incident.attachments && incident.attachments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {incident.attachments.map((file, idx) => (
                                <figure key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <div
                                        className="relative group aspect-video w-full overflow-hidden rounded-lg border border-slate-100 mb-2 bg-white flex items-center justify-center cursor-zoom-in"
                                        onClick={() => { setSelectedImage(file.url); setZoomLevel(1); }}
                                    >
                                        <img src={file.url} alt={`Evidence ${idx}`} className="max-w-full max-h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Maximize2 className="text-white drop-shadow-md w-8 h-8" />
                                        </div>
                                    </div>
                                    <figcaption className="text-center text-xs font-bold text-slate-600 mt-2">
                                        {file.caption || 'No caption'}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-center">
                            <p className="text-slate-400 text-sm italic">No evidence or site photos attached.</p>
                        </div>
                    )}
                </section>

                {/* Lightbox */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 z-[110] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
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
                                alt="Full "
                                className="transition-transform duration-300 ease-out object-contain max-h-full max-w-full"
                                style={{ transform: `scale(${zoomLevel})`, cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
                                onClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)}
                            />
                        </div>
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                            <button onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => Math.max(0.5, prev - 0.5)); }} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"><ZoomOut size={20} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setZoomLevel(prev => prev + 0.5); }} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"><ZoomIn size={20} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FFHIncidentView;
