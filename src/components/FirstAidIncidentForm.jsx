import React, { useState, useRef } from 'react';
import { X, Plus, Clock, Trash2, Activity, Save, User, MapPin, Calendar, HeartPulse, Upload } from 'lucide-react';

const FirstAidIncidentForm = ({ incident, onChange, onClose }) => {
    const fileInputRef = useRef(null);
    const [data, setData] = useState(incident || {
        id: `MED-202X-${String(Math.floor(Math.random() * 9000) + 1000).padStart(3, '0')}`,
        // Section A: Injured Person
        ipName: '',
        employeeId: '',
        designation: '',
        department: '',
        supervisor: '',
        // Section B: Timeline
        dateOfInjury: '',
        timeOfInjury: '',
        timeReported: '',
        location: '',
        // Section C: Injury Details
        natureOfInjury: '', // Cut, Incision, Puncture, Abrasion
        bodyPart: [], // Right Hand, Finger(Index), etc.
        severityDepth: '', // Superficial, Deep
        severityBleeding: '', // Minor, Moderate, Severe
        // Section D: Description
        description: '',
        // Section E: PPE
        glovesWorn: 'No',
        gloveType: '', // Cotton, Cut-Resistant, Rubber
        ppeAppropriate: 'No',
        // Section F: Treatment
        administeredBy: '',
        treatmentSteps: [], // Cleaned, Bandage, Medication
        atvGiven: 'No',
        atvDate: '',
        hospitalReferral: 'No',
        hospitalName: '',

        outcome: '', // Return to Work, Sent Home, Admitted
        attachments: []
    });

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field, item) => {
        setData(prev => {
            const current = prev[field] || [];
            if (current.includes(item)) {
                return { ...prev, [field]: current.filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...current, item] };
            }
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Optimization: Compress image before processing
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Max dimensions
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG at 70% quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    setData(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), { url: compressedDataUrl, caption: '' }]
                    }));
                };
                img.src = event.target.result;
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
        setData(prev => ({
            ...prev,
            attachments: prev.attachments.map((item, i) => i === index ? { ...item, caption } : item)
        }));
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const sectionHeaderClass = "flex items-center gap-4 border-b border-rose-100 pb-4 mb-6";
    const sectionNumberClass = "w-8 h-8 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center border border-rose-200 shadow-sm";
    const sectionTitleClass = "text-sm font-bold text-slate-700 uppercase tracking-wide";
    const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block";
    const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all";
    const checkboxClass = "w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">

                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-8 py-6 flex items-start justify-between z-10 sticky top-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-100">
                                Confidential Medical Record
                            </span>
                            <span className="text-slate-400 text-sm font-mono">#{data.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">INJURY / FIRST AID REPORT</h2>
                        <p className="text-slate-500 text-sm mt-1">Fill in the details for localized injuries (Cut, Wounds, First Aid).</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

                    {/* Section A: Injured Person Details */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>A</span>
                            <h3 className={sectionTitleClass}>Injured Person Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Name of IP</label>
                                <input type="text" value={data.ipName} onChange={(e) => updateField('ipName', e.target.value)} className={inputClass} placeholder="Full Name" />
                            </div>
                            <div>
                                <label className={labelClass}>Employee ID</label>
                                <input type="text" value={data.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} className={inputClass} placeholder="ID Number" />
                            </div>
                            <div>
                                <label className={labelClass}>Designation</label>
                                <input type="text" value={data.designation} onChange={(e) => updateField('designation', e.target.value)} className={inputClass} placeholder="e.g. Fitter" />
                            </div>
                            <div>
                                <label className={labelClass}>Department / Contractor</label>
                                <input type="text" value={data.department} onChange={(e) => updateField('department', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Supervisor Name</label>
                                <input type="text" value={data.supervisor} onChange={(e) => updateField('supervisor', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </section>

                    {/* Section B: Incident Timeline */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>B</span>
                            <h3 className={sectionTitleClass}>Incident Timeline</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>Date of Injury</label>
                                <input type="date" value={data.dateOfInjury} onChange={(e) => updateField('dateOfInjury', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Time of Injury</label>
                                <input type="time" value={data.timeOfInjury} onChange={(e) => updateField('timeOfInjury', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Time Reported</label>
                                <input type="time" value={data.timeReported} onChange={(e) => updateField('timeReported', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Exact Location</label>
                                <input type="text" value={data.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass} placeholder="e.g. Workshop" />
                            </div>
                        </div>
                    </section>

                    {/* Section C: Injury Details */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>C</span>
                            <h3 className={sectionTitleClass}>Injury Assessment Details</h3>
                        </div>

                        <div className="space-y-6">
                            {/* 1. Nature of Injury */}
                            <div>
                                <label className="text-xs font-bold text-slate-800 mb-3 block">1. Nature of Injury (Select One)</label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {['Cut / Laceration', 'Incision', 'Puncture', 'Abrasion'].map((type) => (
                                        <label key={type} className={`cursor-pointer px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${data.natureOfInjury === type ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                            <input
                                                type="radio"
                                                name="nature"
                                                value={type}
                                                checked={data.natureOfInjury === type}
                                                onChange={(e) => updateField('natureOfInjury', e.target.value)}
                                                className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                                            />
                                            <span className="text-sm font-semibold">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Affected Body Part */}
                            <div>
                                <label className="text-xs font-bold text-slate-800 mb-3 block">2. Affected Body Part</label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {['Right Hand', 'Left Hand', 'Finger (Thumb)', 'Finger (Index)', 'Finger (Middle)', 'Finger (Ring)', 'Finger (Little)', 'Arm', 'Leg', 'Head'].map((part) => (
                                        <label key={part} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all flex items-center gap-3 ${data.bodyPart?.includes(part) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                            <input
                                                type="checkbox"
                                                checked={data.bodyPart?.includes(part)}
                                                onChange={() => toggleArrayItem('bodyPart', part)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                            />
                                            <span className="text-xs font-semibold">{part}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Severity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div>
                                    <label className={labelClass}>Depth of Wound</label>
                                    <div className="flex gap-4 mt-2">
                                        {['Superficial', 'Deep'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="depth" value={opt} checked={data.severityDepth === opt} onChange={(e) => updateField('severityDepth', e.target.value)} className={checkboxClass} />
                                                <span className="text-sm text-slate-700 font-medium">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Bleeding Severity</label>
                                    <div className="flex gap-4 mt-2">
                                        {['Minor', 'Moderate', 'Severe'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="bleeding" value={opt} checked={data.severityBleeding === opt} onChange={(e) => updateField('severityBleeding', e.target.value)} className={checkboxClass} />
                                                <span className={`text-sm font-medium ${opt === 'Severe' ? 'text-red-600' : 'text-slate-700'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section D: Description */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>D</span>
                            <h3 className={sectionTitleClass}>Description of Occurrence</h3>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-100">
                            <p className="text-xs text-amber-700 font-medium">💡 Tip: Describe who was doing what, and how the cut happened. Ex: "Cutting gasket with utility knife, knife slipped."</p>
                        </div>
                        <textarea
                            value={data.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Enter detailed description here..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none text-sm transition-all shadow-sm h-32 resize-none leading-relaxed"
                        />
                    </section>

                    {/* Section E: PPE Checklist */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>E</span>
                            <h3 className={sectionTitleClass}>PPE Checklist</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Hand Gloves Worn?</label>
                                <select value={data.glovesWorn} onChange={(e) => updateField('glovesWorn', e.target.value)} className={inputClass}>
                                    <option value="Select">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Type of Gloves</label>
                                <select value={data.gloveType} onChange={(e) => updateField('gloveType', e.target.value)} className={inputClass} disabled={data.glovesWorn === 'No'}>
                                    <option value="">Select...</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Cut-Resistant">Cut-Resistant (Level 3/5)</option>
                                    <option value="Rubber">Rubber / Latex</option>
                                    <option value="Leather">Leather</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Was PPE Appropriate?</label>
                                <select value={data.ppeAppropriate} onChange={(e) => updateField('ppeAppropriate', e.target.value)} className={inputClass}>
                                    <option value="Select">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section F: Treatment Provided */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>F</span>
                            <h3 className={sectionTitleClass}>Medical Treatment Provided</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Administered By</label>
                                    <input type="text" value={data.administeredBy} onChange={(e) => updateField('administeredBy', e.target.value)} className={inputClass} placeholder="Name of First Aider / Nurse" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-800 mb-2 block">Treatment Steps Taken</label>
                                    <div className="space-y-2">
                                        {['Wound Cleaned (Antiseptic)', 'Bandage / Dressing Applied', 'Medication Given (Painkiller/Antibiotic)'].map((step) => (
                                            <label key={step} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={data.treatmentSteps?.includes(step)}
                                                    onChange={() => toggleArrayItem('treatmentSteps', step)}
                                                    className={checkboxClass}
                                                />
                                                <span className="text-sm text-slate-700">{step}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div>
                                    <label className={labelClass}>Anti-Tetanus Vaccine (ATV)?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2"><input type="radio" value="Yes" checked={data.atvGiven === 'Yes'} onChange={(e) => updateField('atvGiven', e.target.value)} /> Yes</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="No" checked={data.atvGiven === 'No'} onChange={(e) => updateField('atvGiven', e.target.value)} /> No</label>
                                    </div>
                                    {data.atvGiven === 'No' && (
                                        <input type="text" placeholder="Last taken date?" className={`mt-2 ${inputClass} text-xs`} />
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Referred to Hospital?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2"><input type="radio" value="Yes" checked={data.hospitalReferral === 'Yes'} onChange={(e) => updateField('hospitalReferral', e.target.value)} /> Yes</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="No" checked={data.hospitalReferral === 'No'} onChange={(e) => updateField('hospitalReferral', e.target.value)} /> No</label>
                                    </div>
                                    {data.hospitalReferral === 'Yes' && (
                                        <input type="text" value={data.hospitalName} onChange={(e) => updateField('hospitalName', e.target.value)} placeholder="Hospital Name" className={`mt-2 ${inputClass}`} />
                                    )}
                                </div>


                            </div>
                        </div>
                    </section>

                    {/* Section G: Evidence & Attachments */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>G</span>
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
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-rose-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div onClick={triggerFileUpload} className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-rose-50/30 hover:border-rose-300 hover:text-rose-500 transition-all">
                                        <Plus className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Add More</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div onClick={triggerFileUpload} className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-rose-50/30 hover:border-rose-300 hover:text-rose-500 transition-all group">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                </div>
                                <span className="text-sm font-bold tracking-wide">CLICK TO UPLOAD EVIDENCE</span>
                                <span className="text-xs text-slate-400 mt-2">Supports: JPG, PNG (Medical Records etc)</span>
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
                    <button onClick={() => { onChange(data); onClose(); }} className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5 flex items-center gap-2">
                        <Save className="w-4 h-4" /> SAVE REPORT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirstAidIncidentForm;
