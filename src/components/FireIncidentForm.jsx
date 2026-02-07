import React, { useState, useRef } from 'react';
import { X, Plus, Clock, Trash2, Upload } from 'lucide-react';

const SEVERITY_LEVELS = [
    { value: 'minor', label: 'MINOR (NEAR MISS)' },
    { value: 'moderate', label: 'MODERATE (PROPERTY DAMAGE)' },
    { value: 'major', label: 'MAJOR (FATALITY/HIGH LOSS)' }
];

const FIRE_CLASSIFICATIONS = [
    { value: 'electrical', label: 'ELECTRICAL' },
    { value: 'chemical', label: 'CHEMICAL' },
    { value: 'solid', label: 'SOLID MATERIAL' },
    { value: 'oil_gas', label: 'OIL/GAS' }
];

const ALERT_METHODS = ['Verbal Shouting ("Fire, Fire")', 'Whistle', 'Air Horn', 'Walkie-Talkie'];
const ISOLATION_METHODS = ['Manually Switched Off', 'Unplugged', 'Valve Closed', 'Cable Cut'];
const WORKER_ACTIONS = ['Moved to Safe Distance', 'Gathered at Assembly Point', 'Stopped Work Immediately'];
const EXTINGUISHING_AGENTS = ['ABC Powder Extinguisher', 'Sand Bucket', 'Water Hose', 'Fire Blanket', 'Fire Blanket & Sand'];
const RESPONDERS = ['Fire Watcher', 'Site Workers', 'Safety Officer'];
const SPOTTED_BY_OPTIONS = ['Site Supervisor', 'Fire Watcher', 'Area Workers', 'Security Guard'];

const FireIncidentForm = ({ incident, onChange, onClose }) => {
    const [data, setData] = useState(incident || {
        id: `ID-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        // Section 1
        date: '',
        time: '',
        location: '',
        reportedBy: '',
        severity: '',
        classification: '',
        // Section 2
        events: [{ time: '', description: '' }],
        narrative: '',
        // Section 3
        spottedBy: '',
        incidentTime: '',
        alertMethod: '',
        sourceIsolated: '',
        isolationMethod: '',
        workerAction: '',
        extinguishingAgent: '',
        responder: '',
        fireOutTime: '',
        // Section 4
        humanInjury: '',
        propertyDamage: '',
        environmentalImpact: '',
        // Section 5
        whyAnalysis: [{ question: 'Why did the fire start?', answer: '' }],
        directCause: '',
        rootCause: '',
        // Section 6
        correctiveActions: [{ action: '', owner: '', dueDate: '', status: 'OPEN' }],
        // Section 7
        attachments: []
    });


    const fileInputRef = useRef(null);

    const triggerFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), { url: reader.result, caption: '' }]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAttachment = (index) => {
        setData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const updateCaption = (index, caption) => {
        const newAttachments = [...(data.attachments || [])];
        newAttachments[index] = { ...newAttachments[index], caption };
        setData(prev => ({ ...prev, attachments: newAttachments }));
    };

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const addEvent = () => {
        setData(prev => ({
            ...prev,
            events: [...prev.events, { time: '', description: '' }]
        }));
    };

    const updateEvent = (index, field, value) => {
        const newEvents = [...data.events];
        newEvents[index][field] = value;
        setData(prev => ({ ...prev, events: newEvents }));
    };

    const removeEvent = (index) => {
        if (data.events.length > 1) {
            setData(prev => ({
                ...prev,
                events: prev.events.filter((_, i) => i !== index)
            }));
        }
    };

    const addWhyStep = () => {
        const whyCount = data.whyAnalysis.length;
        setData(prev => ({
            ...prev,
            whyAnalysis: [...prev.whyAnalysis, { question: `Why #${whyCount + 1}?`, answer: '' }]
        }));
    };

    const updateWhy = (index, value) => {
        const newWhys = [...data.whyAnalysis];
        newWhys[index].answer = value;
        setData(prev => ({ ...prev, whyAnalysis: newWhys }));
    };

    const removeWhy = (index) => {
        if (data.whyAnalysis.length > 1) {
            setData(prev => ({
                ...prev,
                whyAnalysis: prev.whyAnalysis.filter((_, i) => i !== index)
            }));
        }
    };

    const addCorrectiveAction = () => {
        setData(prev => ({
            ...prev,
            correctiveActions: [...prev.correctiveActions, { action: '', owner: '', dueDate: '', status: 'OPEN' }]
        }));
    };

    const updateCapa = (index, field, value) => {
        const newCapas = [...data.correctiveActions];
        newCapas[index][field] = value;
        setData(prev => ({ ...prev, correctiveActions: newCapas }));
    };

    const removeCapa = (index) => {
        setData(prev => ({
            ...prev,
            correctiveActions: prev.correctiveActions.filter((_, i) => i !== index)
        }));
    };

    const sectionHeaderClass = "flex items-center gap-4 mb-8 border-b border-indigo-50 pb-4";
    const sectionNumberClass = "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-200";
    const sectionTitleClass = "text-xl font-bold text-slate-800 tracking-tight";
    const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 block";
    const inputClass = "w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300 hover:border-indigo-200";
    const selectClass = "w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer hover:border-indigo-200";

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-start justify-center overflow-y-auto py-12 px-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-auto border border-white/50 relative overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Fire Incident
                        </div>
                        <span className="text-slate-400 font-mono text-sm tracking-widest border-l border-slate-200 pl-4">{data.id}</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-10 space-y-12 bg-slate-50/30">
                    {/* Section 01: Incident Details */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>01</span>
                            <h3 className={sectionTitleClass}>Incident Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>
                                        <Clock className="w-3 h-3 inline mr-1 -mt-0.5" /> Date
                                    </label>
                                    <input type="date" value={data.date} onChange={(e) => updateField('date', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Time</label>
                                    <input type="time" value={data.time} onChange={(e) => updateField('time', e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Severity Level</label>
                                <div className="space-y-3">
                                    {SEVERITY_LEVELS.map(s => (
                                        <label key={s.value} className={`relative flex items-center gap-4 p-3.5 rounded-xl border cursor-pointer transition-all hover:shadow-md ${data.severity === s.value ? 'bg-indigo-50/50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.severity === s.value ? 'border-indigo-500' : 'border-slate-300'}`}>
                                                {data.severity === s.value && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                                            </div>
                                            <input type="radio" name="severity" value={s.value} checked={data.severity === s.value} onChange={(e) => updateField('severity', e.target.value)} className="hidden" />
                                            <span className={`text-sm font-bold ${data.severity === s.value ? 'text-indigo-900' : 'text-slate-600'}`}>{s.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Exact Location</label>
                                <input type="text" value={data.location} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. Turbine Hall, Level 2" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Fire Classification</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {FIRE_CLASSIFICATIONS.map(c => (
                                        <label key={c.value} className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.classification === c.value ? 'bg-indigo-50/50 border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.classification === c.value ? 'border-indigo-500' : 'border-slate-300'}`}>
                                                {data.classification === c.value && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                            </div>
                                            <input type="radio" name="classification" value={c.value} checked={data.classification === c.value} onChange={(e) => updateField('classification', e.target.value)} className="hidden" />
                                            <span className="text-xs font-bold text-slate-700">{c.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Reported By</label>
                                <input type="text" value={data.reportedBy} onChange={(e) => updateField('reportedBy', e.target.value)} placeholder="Name & Designation" className={inputClass} />
                            </div>
                        </div>
                    </section>

                    {/* Section 02: Chronology & Narrative */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>02</span>
                            <h3 className={sectionTitleClass}>Chronology & Narrative</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className={labelClass}>Sequence of Events</label>
                                    <button onClick={addEvent} className="px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                        <Plus className="w-3 h-3" /> ADD EVENT
                                    </button>
                                </div>
                                <div className="space-y-4 pl-4 border-l-2 border-slate-100 ml-2">
                                    {data.events.map((event, idx) => (
                                        <div key={idx} className="relative flex items-center gap-4 group">
                                            <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-sm z-10" />
                                            <div className="flex-1 flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <input type="time" value={event.time} onChange={(e) => updateEvent(idx, 'time', e.target.value)} className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                                                <input type="text" value={event.description} onChange={(e) => updateEvent(idx, 'description', e.target.value)} placeholder="Describe what happened..." className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                                                <button onClick={() => removeEvent(idx)} className="w-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="Remove event">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Narrative (Detailed Account)</label>
                                <textarea value={data.narrative} onChange={(e) => updateField('narrative', e.target.value)} placeholder="Write a comprehensive narrative of the incident..." className={`${inputClass} h-32 resize-none leading-relaxed`} />
                            </div>
                        </div>
                    </section>

                    {/* Section 03: Immediate Actions */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>03</span>
                            <h3 className={sectionTitleClass}>Immediate Actions (Automated)</h3>
                        </div>

                        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-800 text-sm mb-8 flex gap-3 items-start">
                            <div className="p-1 bg-indigo-100 rounded-full mt-0.5"><span className="block w-1.5 h-1.5 rounded-full bg-indigo-600" /></div>
                            <p className="leading-relaxed opacity-80">Use the fields below to auto-generate a professional incident report narrative based on standard protocol.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Spotted By', field: 'spottedBy', options: SPOTTED_BY_OPTIONS },
                                { label: 'Incident Time', field: 'incidentTime', type: 'time' },
                                { label: 'Alert Method', field: 'alertMethod', options: ALERT_METHODS },
                                { label: 'Source Isolated', field: 'sourceIsolated', placeholder: 'e.g. Welding Machine' },
                                { label: 'Isolation Method', field: 'isolationMethod', options: ISOLATION_METHODS },
                                { label: 'Worker Action', field: 'workerAction', options: WORKER_ACTIONS },
                                { label: 'Extinguishing Agent', field: 'extinguishingAgent', options: EXTINGUISHING_AGENTS },
                                { label: 'Responder', field: 'responder', options: RESPONDERS },
                                { label: 'Fire Out Time', field: 'fireOutTime', type: 'time' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <label className={labelClass}>{item.label}</label>
                                    {item.options ? (
                                        <select value={data[item.field]} onChange={(e) => updateField(item.field, e.target.value)} className={selectClass}>
                                            <option value="">Select...</option>
                                            {item.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type={item.type || 'text'}
                                            value={data[item.field]}
                                            onChange={(e) => updateField(item.field, e.target.value)}
                                            placeholder={item.placeholder || ''}
                                            className={inputClass}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="relative p-6 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                                <div className="flex justify-between items-center border-b border-indigo-50 pb-4 mb-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Generated Output Preview
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${data.spottedBy && data.alertMethod && data.incidentTime ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {data.spottedBy && data.alertMethod && data.incidentTime ? 'READY' : 'INCOMPLETE'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-7 font-medium">
                                    {data.spottedBy && data.incidentTime
                                        ? <>
                                            The fire was first spotted by the <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.spottedBy}</span> at <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.incidentTime}</span>.
                                            {data.alertMethod ? <> Immediate alert was raised via <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.alertMethod}</span> to warn nearby workers.</> : ''}
                                            {data.sourceIsolated && data.isolationMethod ? <> The <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.sourceIsolated}</span> was promptly <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.isolationMethod}</span> to cut off the energy source.</> : ''}
                                            {data.workerAction ? <> All personnel <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.workerAction}</span>.</> : ''}
                                            {data.extinguishingAgent && data.responder && data.fireOutTime ? <> The fire was successfully extinguished using <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.extinguishingAgent}</span> by the <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.responder}</span> at <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{data.fireOutTime}</span>.</> : ''}
                                        </>
                                        : <span className="text-slate-400/70 italic flex items-center justify-center py-4">Fill in the details above to generate the automated report...</span>}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 04: Damage Assessment */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>04</span>
                            <h3 className={sectionTitleClass}>Damage Assessment</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Human Injury', value: data.humanInjury, key: 'humanInjury', color: 'from-orange-500 to-red-500' },
                                { title: 'Property Damage', value: data.propertyDamage, key: 'propertyDamage', color: 'from-blue-500 to-indigo-500' },
                                { title: 'Environmental Impact', value: data.environmentalImpact, key: 'environmentalImpact', color: 'from-emerald-500 to-teal-500' },
                            ].map((item, i) => (
                                <div key={i} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-all`} />

                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block relative z-10">{item.title}</label>
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => updateField(item.key, e.target.value)}
                                        placeholder="None"
                                        className="w-full bg-transparent border-b border-slate-700 text-white placeholder:text-slate-600 py-2 outline-none text-base font-medium relative z-10 focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 05: Root Cause Analysis */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>05</span>
                            <h3 className={sectionTitleClass}>Root Cause Analysis (5-Why)</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            {data.whyAnalysis.map((why, idx) => (
                                <div key={idx} className="flex gap-4 p-2 rounded-xl border border-transparent hover:border-amber-100 hover:bg-amber-50/30 transition-all group">
                                    <div className="pt-2">
                                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 text-sm font-bold flex items-center justify-center border border-amber-200 shadow-sm">{idx + 1}</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            {why.question}
                                        </div>
                                        <textarea
                                            value={why.answer}
                                            onChange={(e) => updateWhy(idx, e.target.value)}
                                            placeholder="Enter your answer..."
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-sm transition-all shadow-sm resize-none h-20"
                                        />
                                    </div>
                                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => removeWhy(idx)} className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center border-t border-slate-100 pt-6 mb-8">
                            <button onClick={addWhyStep} className="px-5 py-2 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-sm">
                                <Plus className="w-3 h-3" /> ADD WHY STEP
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div>
                                <label className={labelClass}>Direct Cause</label>
                                <input type="text" value={data.directCause} onChange={(e) => updateField('directCause', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Root Cause</label>
                                <input type="text" value={data.rootCause} onChange={(e) => updateField('rootCause', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    {/* Section 06: Corrective Actions */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8 border-b border-indigo-50 pb-4">
                            <div className="flex items-center gap-4">
                                <span className={sectionNumberClass}>06</span>
                                <h3 className={sectionTitleClass}>Corrective Actions (CAPA)</h3>
                            </div>
                            <button onClick={addCorrectiveAction} className="px-4 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2">
                                <Plus className="w-3 h-3" /> NEW ACTION
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.correctiveActions.map((capa, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:shadow-md transition-all group">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block px-1">Action Description</label>
                                        <input type="text" value={capa.action} onChange={(e) => updateCapa(idx, 'action', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none" />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block px-1">Owner</label>
                                        <input type="text" value={capa.owner} onChange={(e) => updateCapa(idx, 'owner', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none text-center" />
                                    </div>
                                    <div className="w-full md:w-40">
                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block px-1">Due Date</label>
                                        <input type="date" value={capa.dueDate} onChange={(e) => updateCapa(idx, 'dueDate', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none" />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="text-[10px] font-bold text-slate-400 mb-1 block px-1">Status</label>
                                        <select value={capa.status} onChange={(e) => updateCapa(idx, 'status', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:border-indigo-500 outline-none">
                                            <option value="OPEN">OPEN</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>
                                    <div className="w-10 flex items-center justify-center pt-5">
                                        <button onClick={() => removeCapa(idx)} className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 07: Evidence & Attachments */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>07</span>
                            <h3 className={sectionTitleClass}>Evidence & Attachments</h3>
                        </div>

                        {data.attachments && data.attachments.length > 0 ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.attachments.map((file, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                                            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                                                <img src={file.url} alt="Proof" className="w-full h-full object-cover" />
                                                <button onClick={() => removeAttachment(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <input
                                                    type="text"
                                                    value={file.caption}
                                                    onChange={(e) => updateCaption(idx, e.target.value)}
                                                    placeholder="Enter caption..."
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div onClick={triggerFileUpload} className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                                        <Plus className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Add More</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div onClick={triggerFileUpload} className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-300 hover:text-indigo-500 transition-all group">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <span className="text-sm font-bold tracking-wide">CLICK TO UPLOAD EVIDENCE</span>
                                <span className="text-xs text-slate-400 mt-2">Supports: JPG, PNG (Max 5MB)</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                    </section>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-10 py-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                    <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                        CANCEL
                    </button>
                    <button onClick={() => { onChange(data); onClose(); }} className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5">
                        SAVE INCIDENT REPORT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FireIncidentForm;
