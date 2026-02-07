import { useState, useEffect } from 'react';
import { ref, onValue, set } from "firebase/database";
import { db } from '../firebase';

const INITIAL_DATA = {
    // ... (keep all initial data structure as is)
    // Section 1: Basic Info (Expanded)
    basicInfo: {
        projectName: "UCPL 590 MW CCPP",
        location: "Chattogram, Bangladesh",
        client: "United Chattogram Power Ltd.",
        contractor: "EPC Consortium",
        manpower: {
            total: 0,
            avgDaily: 0,
            byTrade: [
                { trade: "Civil", count: 0 },
                { trade: "Mechanical", count: 0 },
                { trade: "Electrical", count: 0 },
                { trade: "Safety", count: 0 },
                { trade: "Others", count: 0 }
            ]
        },
        keyContacts: {
            ehsManager: "",
            ehsExecutive: "",
            siteDoctor: ""
        }
    },

    // Section 2: Policy & Objectives
    policyObjectives: {
        policy: "To provide a safe and healthy working environment for all employees and stakeholders.",
        objectives: [
            "Zero Fatality",
            "Zero LTI",
            "100% Induction Compliance",
            "95% Action Close-out (7 days)"
        ]
    },

    // Section 3: KPIs
    kpis: {
        manHours: {
            current: 0,
            cumulative: 0
        },
        laggingIndicators: {
            trir: 0.0,
            ltifr: 0.0,
            lti: 0,
            firstAid: 0,
            nearMiss: 0,
            propertyDamage: 0
        },
        leadingIndicators: {
            uaUc: 0, // Unsafe Acts/Conditions reported
            walkthroughs: 0 // Management Walkthroughs
        }
    },

    // Section 4: Site Inspections & Observations
    siteInspections: [],

    // Section 5: Incidents (Combined)
    incidents: {
        total: 0,
        fireIncidents: [], // Array of fire incident objects
        firstAidIncidents: [], // Array of first aid incident objects
        ffhIncidents: [] // Array of Work at Height incident objects
    },

    // Section 6: Programs (Training, Emergency, Campaigns)
    programs: {
        training: {
            inductionConducted: false,
            inductionParticipants: 0,
            toolboxTalks: [],
            specificTraining: [],
            totalManHours: 0
        },
        emergencyPreparedness: {
            mockDrillConducted: false,
            mockDrillDetails: { type: "", date: "", participants: 0 },
            fireEquipmentInspected: false
        },
        campaigns: {
            safetyCommitteeMeeting: { conducted: false, date: "" },
            healthHygiene: { conducted: false, topic: "", beneficiaries: 0 },
            rewardsRecognition: { conducted: false, recipients: [] },
            specialDays: []
        }
    },

    // Section 7: High Risk Controls
    highRiskWork: {
        permits: [], // { type: "Hot Work", count: 5 }
        audits: [] // { area: "Scaffolding", findings: 2 }
    },

    // Section 8: Environment
    environment: {
        waste: {
            hazardous: "", // e.g. "50 kg"
            nonHazardous: "", // e.g. "1200 kg"
            recycled: "" // e.g. "300 kg"
        },
        spills: 0,
        consumption: {
            water: "",
            fuel: ""
        }
    },

    // Section 10: Compliance
    compliance: {
        externalAudits: [],
        legalNotices: 0
    },

    // Section 11: Issues & Support
    issues: {
        challenges: [],
        supportNeeded: []
    },

    // Section 12: Improvement Plan
    improvementPlan: {
        priorities: [],
        targets: ""
    }
};

// Helper to get storage key for a specific year/month
const getStorageKey = (year, month) => `ehs_report_${year}_${String(month).padStart(2, '0')}`;

// Helper to get current year and month
export const getCurrentPeriod = () => {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.toLocaleString('default', { month: 'long' })
    };
};

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Helper to check for available reports (Hybrid: checks LocalStorage for now)
// In a full Firebase app, we would query the DB for available keys
export const getAvailableReports = () => {
    const reports = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('ehs_report_')) {
            const parts = key.split('_'); // ehs, report, year, month
            if (parts.length === 4) {
                reports.push({
                    year: parseInt(parts[2]),
                    month: parseInt(parts[3]),
                    timestamp: new Date().getTime() // Mock timestamp
                });
            }
        }
    }
    // Sort by Date Descending
    return reports.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
    });
};


export const useReportData = (year, month) => {
    const [reportData, setReportData] = useState(INITIAL_DATA);
    const storageKey = getStorageKey(year, month);

    // Load data from Firebase when year/month changes
    useEffect(() => {
        const reportRef = ref(db, storageKey);

        // Subscribe to real-time updates
        const unsubscribe = onValue(reportRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                // Apply migration logic to ensure new fields exist
                const migrated = { ...INITIAL_DATA, ...data };

                // Deep Merge for Incidents
                if (data.incidents) {
                    migrated.incidents = {
                        ...INITIAL_DATA.incidents,
                        ...data.incidents,
                        fireIncidents: data.incidents.fireIncidents || [],
                        firstAidIncidents: data.incidents.firstAidIncidents || [],
                        ffhIncidents: data.incidents.ffhIncidents || []
                    };
                }

                // Deep Merge for Programs
                if (data.programs) {
                    migrated.programs = {
                        training: {
                            ...INITIAL_DATA.programs.training,
                            ...(data.programs.training || {})
                        },
                        emergencyPreparedness: {
                            ...INITIAL_DATA.programs.emergencyPreparedness,
                            ...(data.programs.emergencyPreparedness || {}),
                            mockDrillDetails: {
                                ...INITIAL_DATA.programs.emergencyPreparedness.mockDrillDetails,
                                ...(data.programs.emergencyPreparedness?.mockDrillDetails || {})
                            }
                        },
                        campaigns: {
                            ...INITIAL_DATA.programs.campaigns,
                            ...(data.programs.campaigns || {}),
                            safetyCommitteeMeeting: {
                                ...INITIAL_DATA.programs.campaigns.safetyCommitteeMeeting,
                                ...(data.programs.campaigns?.safetyCommitteeMeeting || {})
                            },
                            healthHygiene: {
                                ...INITIAL_DATA.programs.campaigns.healthHygiene,
                                ...(data.programs.campaigns?.healthHygiene || {})
                            },
                            rewardsRecognition: {
                                ...INITIAL_DATA.programs.campaigns.rewardsRecognition,
                                ...(data.programs.campaigns?.rewardsRecognition || {})
                            }
                        }
                    };
                }

                // Deep Merge for Environment
                if (data.environment || !migrated.environment?.waste) {
                    migrated.environment = {
                        ...INITIAL_DATA.environment,
                        ...(data.environment || {}),
                        waste: {
                            ...INITIAL_DATA.environment.waste,
                            ...(data.environment?.waste || {})
                        },
                        consumption: {
                            ...INITIAL_DATA.environment.consumption,
                            ...(data.environment?.consumption || {})
                        }
                    };
                }

                // Deep Merge for Issues
                if (data.issues || !migrated.issues?.challenges) {
                    migrated.issues = {
                        ...INITIAL_DATA.issues,
                        ...(data.issues || {}),
                        challenges: data.issues?.challenges || [],
                        supportNeeded: data.issues?.supportNeeded || []
                    };
                }

                setReportData(migrated);
            } else {
                // If no data exists in Firebase, fall back to Initial Data
                setReportData(INITIAL_DATA);
            }
        });

        return () => unsubscribe();
    }, [storageKey]);

    // Update function to write to Firebase
    const updateSection = (section, data) => {
        // Optimistic update for UI responsiveness
        setReportData(prev => {
            const newData = {
                ...prev,
                [section]: { ...prev[section], ...data }
            };

            // Write to Firebase
            // We write the ENTIRE report data to ensure consistency, 
            // or we could write just the section if we structure the DB path deeper
            const reportRef = ref(db, storageKey);
            set(reportRef, newData).catch(error => {
                console.error("Firebase write failed:", error);
                // Ideally revert logic here if needed
            });

            return newData;
        });
    };

    // New helper to overwrite entire data (useful for migration/reset)
    const setFullReportData = (newDataOrFunc) => {
        setReportData(prev => {
            const newData = typeof newDataOrFunc === 'function' ? newDataOrFunc(prev) : newDataOrFunc;

            // Sync to Firebase
            const reportRef = ref(db, storageKey);
            set(reportRef, newData).catch(err => console.error("Firebase set failed:", err));

            return newData;
        });
    };

    return { reportData, updateSection, setReportData: setFullReportData };
};
