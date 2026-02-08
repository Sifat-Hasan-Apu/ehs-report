import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Save, Upload, AlertTriangle, ArrowDown, Activity } from 'lucide-react';

const FFHIncidentForm = ({ incident, onChange, onClose }) => {
    const fileInputRef = useRef(null);
    const [data, setData] = useState(incident || {
        id: `FFH-202X-${String(Math.floor(Math.random() * 9000) + 1000).padStart(3, '0')}`,
        // Section A: General Info
        location: '',
        exactHeight: '', // e.g., 6.5 Meters
        surfaceLanded: '', // Concrete, Soil, etc.
        weatherCondition: '',

        // Section B: Platform & Access
        workingPlatform: '', // Scaffolding, Ladder, etc.
        fallProtectionUsed: {
            harnessWorn: 'No',
            doubleLanyard: 'No',
            hookedAnchored: 'No',
            helmetChinStrap: 'No'
        },

        // Section C: Injury Assessment
        visibleInjuries: [], // Head, Spinal, Fractures
        consciousnessLevel: '', // Conscious, Semi, Unconscious

        // Section D: Description
        description: '',

        // Section E: Root Cause Analysis
        immediateCauses: [],
        rootCauses: [],

        // Section F: Rescue & Medical
        movedBy: '', // Stretcher, Manual
        firstAidGiven: [], // Neck Collar, CPR

        // Section G: CAPA
        actions: [
            { item: 'Re-inspection of platform', responsibility: 'Scaffolding Inspector', deadline: 'Immediate' },
            { item: 'Toolbox Talk on 100% Tie-off', responsibility: 'Site Safety Lead', deadline: 'Tomorrow' }
        ],

        attachments: []
    });

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
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

    const handleActionChange = (index, field, value) => {
        const newActions = [...data.actions];
        newActions[index][field] = value;
        setData({ ...data, actions: newActions });
    };

    const addAction = () => {
        setData({ ...data, actions: [...data.actions, { item: '', responsibility: '', deadline: '' }] });
    };

    const removeAction = (index) => {
        setData({ ...data, actions: data.actions.filter((_, i) => i !== index) });
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
        setData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
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

    // Styling Constants
    const sectionHeaderClass = "flex items-center gap-4 border-b border-orange-100 pb-4 mb-6";
    const sectionNumberClass = "w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center border border-orange-200 shadow-sm";
    const sectionTitleClass = "text-sm font-bold text-slate-700 uppercase tracking-wide";
    const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block";
    const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all";
    const checkboxClass = "w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">

                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-8 py-6 flex items-start justify-between z-10 sticky top-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider border border-orange-100">
                                Fatal 4 Incident
                            </span>
                            <span className="text-slate-400 text-sm font-mono">#{data.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <ArrowDown className="text-orange-500" /> FALL FROM HEIGHT REPORT
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Specialized investigation form for height-related incidents.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

                    {/* Section A: General Information */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>A</span>
                            <h3 className={sectionTitleClass}>General Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Location / Area</label>
                                <input type="text" value={data.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass} placeholder="e.g. Boiler House, 15m Elevation" />
                            </div>
                            <div>
                                <label className={labelClass}>Exact Height of Fall</label>
                                <input type="text" value={data.exactHeight} onChange={(e) => updateField('exactHeight', e.target.value)} className={inputClass} placeholder="e.g. 6.5 Meters" />
                            </div>
                            <div>
                                <label className={labelClass}>Weather Condition</label>
                                <select value={data.weatherCondition} onChange={(e) => updateField('weatherCondition', e.target.value)} className={inputClass}>
                                    <option value="">Select...</option>
                                    <option value="Clear">Clear</option>
                                    <option value="Rainy/Wet">Rainy/Wet</option>
                                    <option value="Windy">Windy (&gt;25 kmph)</option>
                                </select>
                            </div>
                            <div className="md:col-span-4">
                                <label className={labelClass}>Surface Landed On</label>
                                <div className="flex gap-4 mt-2">
                                    {['Concrete', 'Soil', 'Steel Structure', 'Water'].map(surface => (
                                        <label key={surface} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="surface" value={surface} checked={data.surfaceLanded === surface} onChange={(e) => updateField('surfaceLanded', e.target.value)} className={checkboxClass} />
                                            <span className="text-sm font-medium text-slate-700">{surface}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section B: Platform & Access Details */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>B</span>
                            <h3 className={sectionTitleClass}>Platform & Access Details</h3>
                        </div>

                        <div className="mb-6">
                            <label className={labelClass}>1. Nature of Working Platform</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                {['Scaffolding (Green Tagged)', 'Portable Ladder', 'MEWP (Boom/Scissor Lift)', 'Roof / Beam', 'Fragile Surface', 'Uneven Ground'].map(opt => (
                                    <label key={opt} className={`cursor-pointer px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${data.workingPlatform === opt ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                        <input type="radio" name="platform" value={opt} checked={data.workingPlatform === opt} onChange={(e) => updateField('workingPlatform', e.target.value)} className={checkboxClass} />
                                        <span className="text-sm font-medium">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-xs font-bold text-slate-800 mb-4 block">2. Fall Protection System Used</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className={labelClass}>Full Body Harness Worn?</label>
                                    <select value={data.fallProtectionUsed.harnessWorn} onChange={(e) => updateNestedField('fallProtectionUsed', 'harnessWorn', e.target.value)} className={inputClass}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Double Lanyard?</label>
                                    <select value={data.fallProtectionUsed.doubleLanyard} onChange={(e) => updateNestedField('fallProtectionUsed', 'doubleLanyard', e.target.value)} className={inputClass}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Hooked / Anchored?</label>
                                    <select value={data.fallProtectionUsed.hookedAnchored} onChange={(e) => updateNestedField('fallProtectionUsed', 'hookedAnchored', e.target.value)} className={inputClass}>
                                        <option value="Yes (Failed)">Yes (Failed)</option>
                                        <option value="No (Unsafe Act)">No (Unsafe Act)</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Helmet Chin Strap?</label>
                                    <select value={data.fallProtectionUsed.helmetChinStrap} onChange={(e) => updateNestedField('fallProtectionUsed', 'helmetChinStrap', e.target.value)} className={inputClass}>
                                        <option value="Yes">Yes</option>
                                        <option value="No (Flew off)">No (Flew off)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section C: Injury Assessment */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>C</span>
                            <h3 className={sectionTitleClass}>Injury Assessment (Trauma)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs font-bold text-slate-800 mb-3 block">Visible Injuries</label>
                                <div className="space-y-2">
                                    {['Head Injury', 'Spinal / Back Injury (Critical)', 'Fractures (Limbs/Ribs)', 'Internal Bleeding Symptoms'].map(injury => (
                                        <label key={injury} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                                            <input type="checkbox" checked={data.visibleInjuries?.includes(injury)} onChange={() => toggleArrayItem('visibleInjuries', injury)} className={checkboxClass} />
                                            <span className={`text-sm font-medium ${injury.includes('Critical') ? 'text-red-600' : 'text-slate-700'}`}>{injury}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Consciousness Level</label>
                                <div className="space-y-2 mt-2">
                                    {['Conscious', 'Semi-Conscious', 'Unconscious'].map(level => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="consciousness" value={level} checked={data.consciousnessLevel === level} onChange={(e) => updateField('consciousnessLevel', e.target.value)} className={checkboxClass} />
                                            <span className="text-sm font-medium text-slate-700">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section D: Description */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>D</span>
                            <h3 className={sectionTitleClass}>Incident Description</h3>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-100">
                            <p className="text-xs text-amber-700 font-medium">💡 Answer 3 Questions: 1. What was he doing? 2. How did he lose balance? 3. Why did the harness fail/not work?</p>
                        </div>
                        <textarea
                            value={data.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Narrative: The victim was dismantling scaffolding..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none text-sm transition-all shadow-sm h-32 resize-none leading-relaxed"
                        />
                    </section>

                    {/* Section E: Root Cause Analysis */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>E</span>
                            <h3 className={sectionTitleClass}>Root Cause Analysis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Immediate Causes</h4>
                                <div className="space-y-2">
                                    {['Losing Balance / Slip', '100% Tie-off Violation', 'Collapse of Platform', 'Defective Safety Gear'].map(cause => (
                                        <label key={cause} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={data.immediateCauses?.includes(cause)} onChange={() => toggleArrayItem('immediateCauses', cause)} className={checkboxClass} />
                                            <span className="text-sm text-slate-700">{cause}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">System Failures (Root Causes)</h4>
                                <div className="space-y-2">
                                    {['Lack of Supervision', 'Inadequate Training (WAH)', 'No Anchor Point / Lifeline', 'Poor Planning'].map(cause => (
                                        <label key={cause} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={data.rootCauses?.includes(cause)} onChange={() => toggleArrayItem('rootCauses', cause)} className={checkboxClass} />
                                            <span className="text-sm text-slate-700">{cause}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section F: Rescue & Medical */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>F</span>
                            <h3 className={sectionTitleClass}>Rescue & Medical Response</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClass}>How was victim moved?</label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {['Stretcher (Spine Board)', 'Manually Lifted', 'Ambulance'].map(method => (
                                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="movedBy" value={method} checked={data.movedBy === method} onChange={(e) => updateField('movedBy', e.target.value)} className={checkboxClass} />
                                            <span className={`text-sm font-medium ${method.includes('Manual') ? 'text-red-500' : 'text-slate-700'}`}>{method}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>First Aid Given</label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {['Neck Collar Applied', 'Bleeding Control', 'CPR'].map(item => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={data.firstAidGiven?.includes(item)} onChange={() => toggleArrayItem('firstAidGiven', item)} className={checkboxClass} />
                                            <span className="text-sm font-medium text-slate-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section G: CAPA */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>G</span>
                            <h3 className={sectionTitleClass}>Corrective Action Plan (CAPA)</h3>
                        </div>
                        <div className="space-y-4">
                            {data.actions.map((action, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="md:col-span-6">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Action Item</label>
                                        <input type="text" value={action.item} onChange={(e) => handleActionChange(idx, 'item', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-orange-500" placeholder="e.g. Toolbox Talk" />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Responsibility</label>
                                        <input type="text" value={action.responsibility} onChange={(e) => handleActionChange(idx, 'responsibility', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-orange-500" placeholder="e.g. Safety Officer" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Deadline</label>
                                        <input type="text" value={action.deadline} onChange={(e) => handleActionChange(idx, 'deadline', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-orange-500" placeholder="YYYY-MM-DD" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <button onClick={() => removeAction(idx)} className="w-full py-2 bg-red-100 text-red-500 rounded hover:bg-red-200 transition-colors">
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addAction} className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100 transition-colors">
                                <Plus className="w-4 h-4" /> Add Action
                            </button>
                        </div>
                    </section>

                    {/* Section H: Attachments */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className={sectionHeaderClass}>
                            <span className={sectionNumberClass}>H</span>
                            <h3 className={sectionTitleClass}>Evidence & Site Photos</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.attachments?.map((file, idx) => (
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
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div onClick={triggerFileUpload} className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-orange-50/30 hover:border-orange-300 hover:text-orange-500 transition-all">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-wide">Upload Photo</span>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                    </section>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-10 py-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                    <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                        CANCEL
                    </button>
                    <button onClick={() => { onChange(data); onClose(); }} className="px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5 flex items-center gap-2">
                        <Save className="w-4 h-4" /> SAVE REPORT
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FFHIncidentForm;
