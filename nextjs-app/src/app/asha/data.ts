// ═══════════════════════════════════════════
// KANNAMMA ASHA COMMAND CENTER - DATABASE
// ═══════════════════════════════════════════

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface VitalReading {
  time: string;
  value: number;
}

export interface BPReading {
  time: string;
  systolic: number;
  diastolic: number;
}

export interface ANCVisit {
  visitNum: number;
  date: string;
  status: 'completed' | 'upcoming';
  facility: string;
  notes?: string;
  weight?: number;
  bp?: string;
}

export interface Mother {
  id: string;
  name: string;
  age: number;
  week: number;
  husbandName: string;
  phone: string;
  altPhone: string;
  address: string;
  village: string;
  district: string;
  aadhaar?: string;
  bloodGroup: string;
  hbLevel: number; // Hemoglobin
  riskLevel: RiskLevel;
  riskScore: number; // percentage
  missedCheckins: number;
  missedMedsCount: number;
  lastSync: string;
  ringConnected: boolean;
  ringBattery: number;
  ringSignal: 'strong' | 'weak' | 'none';
  nextANC: string;
  aiRiskExplanation: string;
  doctorNotes?: string;
  emergencyContact: string;
  nearestHospital: string;
  assignedDoctor: string;
  transportAvailable: boolean;
  bp?: string; // Raw BP string from form input (e.g. "120/80"), parsed into bpHistory
  heartRateHistory: VitalReading[];
  bpHistory: BPReading[];
  ancHistory: ANCVisit[];
  prescriptions: string[];
}

export interface AshaProfile {
  name: string;
  id: string;
  region: string;
  sector: string;
  mothersCount: number;
  online: boolean;
  avatarText: string;
}

export interface VillageCluster {
  id: string;
  name: string;
  totalMothers: number;
  highRiskMothers: number;
  emergencies: number;
  x: number; // coord for SVG mapping
  y: number;
  phcName: string;
}

export interface DailyTask {
  id: string;
  motherId: string;
  motherName: string;
  type: 'visit' | 'vitals' | 'meds' | 'ring-sync' | 'lab';
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface EmergencyLog {
  id: string;
  motherId: string;
  motherName: string;
  village: string;
  trigger: string;
  timestamp: string;
  status: 'dispatched' | 'contacted' | 'resolved';
  ambulanceETA?: string;
  doctorName: string;
}

// ── MOCK DATA INSTANCES ─────────────────────

export const ashaProfile: AshaProfile = {
  name: 'Meena R',
  id: 'ASHA-560082',
  region: 'Ramapura Rural Sector',
  sector: 'Sector A-3',
  mothersCount: 18,
  online: true,
  avatarText: 'MR',
};

export const mockMothers: Mother[] = [
  {
    id: 'm1',
    name: 'Priya Sharma',
    age: 26,
    week: 28,
    husbandName: 'Rajesh Sharma',
    phone: '+91-98450-11223',
    altPhone: '+91-98450-44556',
    address: 'House 42, Cross 3, Gandhi Nagar',
    village: 'Hosur',
    district: 'Bengaluru Rural',
    aadhaar: '5420-1192-3841',
    bloodGroup: 'O+',
    hbLevel: 10.4,
    riskLevel: 'yellow',
    riskScore: 42,
    missedCheckins: 2,
    missedMedsCount: 1,
    lastSync: '5 mins ago',
    ringConnected: true,
    ringBattery: 82,
    ringSignal: 'strong',
    nextANC: 'June 15, 2025',
    aiRiskExplanation: 'Mild gestational hypertension flagged. Systolic BP trending upwards (134/86 mmHg over 48 hours). Sleep patterns show mild disturbance, averages 6.2 hours.',
    doctorNotes: 'BP checks twice weekly. Advise low sodium diet. Iron and folic acid adherence is critical.',
    emergencyContact: 'Rajesh Sharma (Husband) - +91-98450-11223',
    nearestHospital: 'Hosur Primary Health Centre (PHC)',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)',
    transportAvailable: true,
    heartRateHistory: [
      { time: '08:00', value: 72 },
      { time: '10:00', value: 76 },
      { time: '12:00', value: 85 },
      { time: '14:00', value: 82 },
      { time: '16:00', value: 89 },
      { time: '18:00', value: 80 },
    ],
    bpHistory: [
      { time: 'Mon', systolic: 122, diastolic: 80 },
      { time: 'Tue', systolic: 126, diastolic: 82 },
      { time: 'Wed', systolic: 130, diastolic: 84 },
      { time: 'Thu', systolic: 134, diastolic: 86 },
    ],
    ancHistory: [
      { visitNum: 1, date: 'Jan 15, 2025', status: 'completed', facility: 'Hosur PHC', weight: 58, bp: '110/70', notes: 'Dating scan complete. Normal pregnancy.' },
      { visitNum: 2, date: 'Feb 17, 2025', status: 'completed', facility: 'Hosur PHC', weight: 60, bp: '114/72', notes: 'NT scan clear.' },
      { visitNum: 3, date: 'Mar 15, 2025', status: 'completed', facility: 'Hosur PHC', weight: 61, bp: '118/76', notes: 'Regular check.' },
      { visitNum: 4, date: 'Apr 18, 2025', status: 'completed', facility: 'Hosur PHC', weight: 62.5, bp: '120/78', notes: 'Anomaly scan completed. Fetal growth on track.' },
      { visitNum: 5, date: 'May 19, 2025', status: 'completed', facility: 'City Maternity Hospital', weight: 64, bp: '128/82', notes: 'Blood sugar normal. Mild swelling reported in feet.' },
      { visitNum: 6, date: 'June 15, 2025', status: 'upcoming', facility: 'Hosur PHC' },
    ],
    prescriptions: ['Folic Acid (5mg) - 1x Daily (Morning)', 'Iron + Vit C - 1x Daily (Night)', 'Calcium - 1x Daily (Afternoon)'],
  },
  {
    id: 'm2',
    name: 'Sujata Gowda',
    age: 31,
    week: 32,
    husbandName: 'Kiran Gowda',
    phone: '+91-99801-77889',
    altPhone: '+91-99801-44332',
    address: 'Near Temple, Ramapura Main Road',
    village: 'Ramapura',
    district: 'Bengaluru Rural',
    aadhaar: '8910-4451-2230',
    bloodGroup: 'B+',
    hbLevel: 9.1,
    riskLevel: 'red',
    riskScore: 88,
    missedCheckins: 0,
    missedMedsCount: 0,
    lastSync: '2 mins ago',
    ringConnected: true,
    ringBattery: 91,
    ringSignal: 'strong',
    nextANC: 'May 28, 2025',
    aiRiskExplanation: 'CRITICAL WARNING: Severe pre-eclampsia indicators. BP spiked to 162/104 mmHg. Heart rate variability (HRV) shows severe physiological stress. Patient reported zero baby movement in the last 6 hours.',
    doctorNotes: 'EMERGENCY: Immediate transport to District Hospital required if BP > 160/100 or fetal distress. Administer MgSO4 as per protocol.',
    emergencyContact: 'Kiran Gowda (Husband) - +91-99801-77889',
    nearestHospital: 'City Maternity & District Hospital',
    assignedDoctor: 'Dr. Srinivasan (Radiologist & OB Care)',
    transportAvailable: false, // ambulance requested
    heartRateHistory: [
      { time: '08:00', value: 92 },
      { time: '10:00', value: 98 },
      { time: '12:00', value: 104 },
      { time: '14:00', value: 112 },
      { time: '16:00', value: 108 },
      { time: '18:00', value: 115 },
    ],
    bpHistory: [
      { time: 'Mon', systolic: 140, diastolic: 92 },
      { time: 'Tue', systolic: 145, diastolic: 96 },
      { time: 'Wed', systolic: 154, diastolic: 100 },
      { time: 'Thu', systolic: 162, diastolic: 104 },
    ],
    ancHistory: [
      { visitNum: 1, date: 'Jan 10, 2025', status: 'completed', facility: 'Ramapura PHC', weight: 64, bp: '120/80' },
      { visitNum: 2, date: 'Feb 12, 2025', status: 'completed', facility: 'Ramapura PHC', weight: 66, bp: '128/84' },
      { visitNum: 3, date: 'Mar 18, 2025', status: 'completed', facility: 'Ramapura PHC', weight: 67, bp: '135/88' },
      { visitNum: 4, date: 'Apr 20, 2025', status: 'completed', facility: 'City District Hospital', weight: 69, bp: '142/92', notes: 'Identified as pre-eclampsia risk.' },
      { visitNum: 5, date: 'May 28, 2025', status: 'upcoming', facility: 'City District Hospital' },
    ],
    prescriptions: ['Labetalol (100mg) - 2x Daily', 'Calcium Supplements - 1x Daily', 'Iron Supplements - 1x Daily'],
  },
  {
    id: 'm3',
    name: 'Amanya Reddy',
    age: 23,
    week: 16,
    husbandName: 'Venkat Reddy',
    phone: '+91-97430-88771',
    altPhone: '+91-97430-44331',
    address: 'Agric Clinic Road, Ward 2',
    village: 'Kanakapura',
    district: 'Ramanagara',
    aadhaar: '1290-3841-8972',
    bloodGroup: 'A+',
    hbLevel: 12.1,
    riskLevel: 'green',
    riskScore: 12,
    missedCheckins: 0,
    missedMedsCount: 0,
    lastSync: '1 hour ago',
    ringConnected: true,
    ringBattery: 76,
    ringSignal: 'strong',
    nextANC: 'June 2, 2025',
    aiRiskExplanation: 'Vitals stable. Continuous temperature, heart rate, and sleep indicators are all within nominal clinical reference ranges. High medicine adherence logged.',
    doctorNotes: 'Normal pregnancy progression. Continue routine prenatal care and standard vitamins.',
    emergencyContact: 'Venkat Reddy (Husband) - +91-97430-88771',
    nearestHospital: 'Kanakapura Taluk Hospital',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)',
    transportAvailable: true,
    heartRateHistory: [
      { time: '08:00', value: 70 },
      { time: '10:00', value: 72 },
      { time: '12:00', value: 74 },
      { time: '14:00', value: 73 },
      { time: '16:00', value: 75 },
      { time: '18:00', value: 71 },
    ],
    bpHistory: [
      { time: 'Mon', systolic: 110, diastolic: 70 },
      { time: 'Tue', systolic: 112, diastolic: 72 },
      { time: 'Wed', systolic: 114, diastolic: 74 },
      { time: 'Thu', systolic: 115, diastolic: 75 },
    ],
    ancHistory: [
      { visitNum: 1, date: 'Feb 15, 2025', status: 'completed', facility: 'Kanakapura PHC', weight: 51, bp: '110/70' },
      { visitNum: 2, date: 'Mar 20, 2025', status: 'completed', facility: 'Kanakapura PHC', weight: 53, bp: '112/72' },
      { visitNum: 3, date: 'June 2, 2025', status: 'upcoming', facility: 'Kanakapura PHC' },
    ],
    prescriptions: ['Folic Acid (5mg) - 1x Daily', 'Calcium - 1x Daily'],
  },
  {
    id: 'm4',
    name: 'Kavitha Raj',
    age: 28,
    week: 24,
    husbandName: 'Raj Kumar',
    phone: '+91-96541-22998',
    altPhone: '+91-96541-11887',
    address: 'Post Office Block, Near Water Tank',
    village: 'Hosur',
    district: 'Bengaluru Rural',
    aadhaar: '3812-7729-1092',
    bloodGroup: 'B-',
    hbLevel: 8.4,
    riskLevel: 'yellow',
    riskScore: 54,
    missedCheckins: 3,
    missedMedsCount: 4,
    lastSync: '12 hours ago (Sync Warning)',
    ringConnected: false,
    ringBattery: 0,
    ringSignal: 'none',
    nextANC: 'June 8, 2025',
    aiRiskExplanation: 'Moderate anemia detected (Hb: 8.4 g/dL). Compliance metrics indicate 4 missed iron supplements in the last 7 days. Ring has not synced for 12 hours (possible battery depleted).',
    doctorNotes: 'Urge patient to take double dose of iron if tolerated or schedule IV iron infusion. Investigate ring sync status.',
    emergencyContact: 'Raj Kumar (Husband) - +91-96541-22998',
    nearestHospital: 'Hosur PHC',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)',
    transportAvailable: true,
    heartRateHistory: [
      { time: '08:00', value: 80 },
      { time: '10:00', value: 82 },
      { time: '12:00', value: 85 },
      { time: '14:00', value: 92 },
      { time: '16:00', value: 90 },
      { time: '18:00', value: 87 },
    ],
    bpHistory: [
      { time: 'Mon', systolic: 118, diastolic: 76 },
      { time: 'Tue', systolic: 120, diastolic: 78 },
      { time: 'Wed', systolic: 116, diastolic: 74 },
      { time: 'Thu', systolic: 118, diastolic: 76 },
    ],
    ancHistory: [
      { visitNum: 1, date: 'Dec 12, 2024', status: 'completed', facility: 'Hosur PHC', weight: 62, bp: '110/70' },
      { visitNum: 2, date: 'Jan 15, 2025', status: 'completed', facility: 'Hosur PHC', weight: 63.5, bp: '112/72' },
      { visitNum: 3, date: 'Feb 20, 2025', status: 'completed', facility: 'Hosur PHC', weight: 65, bp: '116/74' },
      { visitNum: 4, date: 'Mar 24, 2025', status: 'completed', facility: 'Hosur PHC', weight: 66.2, bp: '118/76', notes: 'Diagnosed with moderate nutritional anemia.' },
      { visitNum: 5, date: 'June 8, 2025', status: 'upcoming', facility: 'Hosur PHC' },
    ],
    prescriptions: ['Iron (100mg) - 2x Daily', 'Calcium - 1x Daily', 'Vitamin C - 1x Daily'],
  },
  {
    id: 'm5',
    name: 'Radha Naik',
    age: 33,
    week: 20,
    husbandName: 'Prasad Naik',
    phone: '+91-91234-56789',
    altPhone: '+91-91234-98765',
    address: 'Golla colony, Sector 4',
    village: 'Kanakapura',
    district: 'Ramanagara',
    aadhaar: '4560-8912-3401',
    bloodGroup: 'AB+',
    hbLevel: 11.0,
    riskLevel: 'red',
    riskScore: 78,
    missedCheckins: 1,
    missedMedsCount: 3,
    lastSync: '10 mins ago',
    ringConnected: true,
    ringBattery: 64,
    ringSignal: 'strong',
    nextANC: 'May 30, 2025',
    aiRiskExplanation: 'Uncontrolled Gestational Diabetes Mellitus (GDM). Ring temperature and activity charts indicate metabolic instability. Fasting blood sugar log shows 142 mg/dL. 3 missed Metformin doses this week.',
    doctorNotes: 'Urgent endocrinology review. Switch to insulin if oral meds fail. strict diet control.',
    emergencyContact: 'Prasad Naik (Husband) - +91-91234-56789',
    nearestHospital: 'Kanakapura Taluk Hospital',
    assignedDoctor: 'Dr. Srinivasan (OB-GYN)',
    transportAvailable: true,
    heartRateHistory: [
      { time: '08:00', value: 85 },
      { time: '10:00', value: 88 },
      { time: '12:00', value: 92 },
      { time: '14:00', value: 95 },
      { time: '16:00', value: 91 },
      { time: '18:00', value: 89 },
    ],
    bpHistory: [
      { time: 'Mon', systolic: 128, diastolic: 82 },
      { time: 'Tue', systolic: 132, diastolic: 84 },
      { time: 'Wed', systolic: 130, diastolic: 82 },
      { time: 'Thu', systolic: 135, diastolic: 88 },
    ],
    ancHistory: [
      { visitNum: 1, date: 'Jan 8, 2025', status: 'completed', facility: 'Kanakapura PHC', weight: 70, bp: '120/80' },
      { visitNum: 2, date: 'Feb 12, 2025', status: 'completed', facility: 'Kanakapura PHC', weight: 71.5, bp: '124/82' },
      { visitNum: 3, date: 'Mar 15, 2025', status: 'completed', facility: 'Kanakapura Taluk Hospital', weight: 73, bp: '128/82', notes: 'GDM diagnosed.' },
      { visitNum: 4, date: 'May 30, 2025', status: 'upcoming', facility: 'Kanakapura Taluk Hospital' },
    ],
    prescriptions: ['Metformin (500mg) - 2x Daily', 'Folic Acid - 1x Daily', 'Iron - 1x Daily'],
  },
];

export const villageClusters: VillageCluster[] = [
  { id: 'vc1', name: 'Ramapura', totalMothers: 8, highRiskMothers: 2, emergencies: 1, x: 25, y: 35, phcName: 'Ramapura PHC' },
  { id: 'vc2', name: 'Hosur', totalMothers: 6, highRiskMothers: 2, emergencies: 0, x: 65, y: 25, phcName: 'Hosur PHC' },
  { id: 'vc3', name: 'Kanakapura', totalMothers: 4, highRiskMothers: 1, emergencies: 0, x: 45, y: 70, phcName: 'Kanakapura Taluk Hospital' },
];

export const initialTasks: DailyTask[] = [
  { id: 't1', motherId: 'm2', motherName: 'Sujata Gowda', type: 'visit', title: 'Critical Home Visit', description: 'Urgent pre-eclampsia home visit, check BP manually and administer MgSO4 if ordered.', completed: false, priority: 'high' },
  { id: 't2', motherId: 'm4', motherName: 'Kavitha Raj', type: 'ring-sync', title: 'Check Ring Connectivity', description: 'Ring has not synced in 12 hours. Visit home and inspect charger/ring status.', completed: false, priority: 'medium' },
  { id: 't3', motherId: 'm1', motherName: 'Priya Sharma', type: 'lab', title: 'Deliver Urine Report Strip', description: 'Collect spot urine test for proteinuria and report findings to doctor.', completed: false, priority: 'high' },
  { id: 't4', motherId: 'm3', motherName: 'Amanya Reddy', type: 'meds', title: 'Routine Supplement Verification', description: 'Verify folic acid and calcium compliance. Standard check.', completed: true, priority: 'low' },
  { id: 't5', motherId: 'm5', motherName: 'Radha Naik', type: 'vitals', title: 'Log Blood Glucose Level', description: 'Log fasting and postprandial glucose levels after lunch.', completed: false, priority: 'high' },
];

export const initialEmergencies: EmergencyLog[] = [
  {
    id: 'e1',
    motherId: 'm2',
    motherName: 'Sujata Gowda',
    village: 'Ramapura',
    trigger: 'Extreme Hypertension (162/104 mmHg) + No Fetal Movement (6h)',
    timestamp: '19:15 (18 mins ago)',
    status: 'dispatched',
    ambulanceETA: '8 mins (ETA)',
    doctorName: 'Dr. Srinivasan',
  },
];

// ── TRANSLATIONS FOR 5 REGIONAL LANGUAGES ──

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'ASHA Dashboard',
    mothers: 'Mothers',
    highRisk: 'High Risk',
    visits: 'Home Visits',
    insights: 'AI Risk Analytics',
    emergency: 'Emergency Center',
    appointments: 'Appointments',
    records: 'Health Records',
    analytics: 'Visual Analytics',
    messages: 'Reminders & Audio',
    settings: 'System Settings',
    addMother: 'Add Mother',
    online: 'Online',
    offline: 'Offline Mode',
    syncing: 'Syncing...',
    synced: 'Database Synced',
    saveDraft: 'Save Draft',
    saveOffline: 'Save Offline',
    submit: 'Register Mother',
    back: 'Back',
    next: 'Next',
    priorityQueue: 'Priority Queue',
    immediateAttention: 'Needs Immediate Attention',
    reviewToday: 'Review Today',
    stable: 'Stable Vitals',
    taskEngine: 'Daily Tasks',
    geoCluster: 'Village Clusters',
    voiceAssistant: 'Voice Onboarding',
    listening: 'Listening to speech...',
    processingVoice: 'Analyzing audio (NLP)...',
    confidence: 'Confidence Score',
    totalMothers: 'Total Mothers',
    missedANC: 'Missed ANC Visits',
    emergencies: 'Emergency Alerts',
    followups: 'Pending Followups',
    todayVisits: 'Today Visits',
    secPersonal: '1. Personal Details',
    secPregnancy: '2. Pregnancy Details',
    secMedical: '3. Medical Information',
    secEmergency: '4. Emergency Details',
    speakInput: 'Click microphone to dictate in regional language',
  },
  hi: {
    dashboard: 'आशा डैशबोर्ड',
    mothers: 'गर्भवती माताएं',
    highRisk: 'उच्च जोखिम',
    visits: 'गृह दौरा',
    insights: 'एआई जोखिम विश्लेषण',
    emergency: 'आपातकालीन केंद्र',
    appointments: 'अपॉइंटमेंट',
    records: 'स्वास्थ्य रिकॉर्ड',
    analytics: 'दृश्य विश्लेषण',
    messages: 'अनुस्मारक और ऑडियो',
    settings: 'सिस्टम सेटिंग्स',
    addMother: 'नई पंजीकरण',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन मोड',
    syncing: 'सिंक हो रहा है...',
    synced: 'डेटाबेस सिंक हो गया',
    saveDraft: 'ड्राफ्ट सहेजें',
    saveOffline: 'ऑफ़लाइन सहेजें',
    submit: 'माता का पंजीकरण करें',
    back: 'पीछे',
    next: 'आगे',
    priorityQueue: 'प्राथमिकता कतार',
    immediateAttention: 'तुरंत ध्यान देने की आवश्यकता',
    reviewToday: 'आज समीक्षा करें',
    stable: 'स्थिर स्थिति',
    taskEngine: 'दैनिक कार्य',
    geoCluster: 'ग्राम क्लस्टर',
    voiceAssistant: 'आवाज इनपुट सहायक',
    listening: 'आवाज सुन रहे हैं...',
    processingVoice: 'भाषण का विश्लेषण (NLP)...',
    confidence: 'आत्मविश्वास स्कोर',
    totalMothers: 'कुल माताएं',
    missedANC: 'छूटे हुए एएनसी',
    emergencies: 'आपातकालीन अलर्ट',
    followups: 'लंबित अनुवर्ती',
    todayVisits: 'आज के दौरे',
    secPersonal: '1. व्यक्तिगत विवरण',
    secPregnancy: '2. गर्भावस्था विवरण',
    secMedical: '3. चिकित्सा जानकारी',
    secEmergency: '4. आपातकालीन विवरण',
    speakInput: 'अपनी भाषा में बोलने के लिए माइक पर क्लिक करें',
  },
  kn: {
    dashboard: 'ಆಶಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    mothers: 'ಗರ್ಭಿಣಿಯರು',
    highRisk: 'ಹೆಚ್ಚು ಅಪಾಯ',
    visits: 'ಮನೆ ಭೇಟಿ',
    insights: 'ಎಐ ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ',
    emergency: 'ತುರ್ತು ಕೇಂದ್ರ',
    appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
    records: 'ಆರೋಗ್ಯ ದಾಖಲೆಗಳು',
    analytics: 'ವಿಷುಯಲ್ ಅನಾಲಿಟಿಕ್ಸ್',
    messages: 'ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಆಡಿಯೋ',
    settings: 'ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್ಸ್',
    addMother: 'ಹೊಸ ನೋಂದಣಿ',
    online: 'ಆನ್‌ಲೈನ್',
    offline: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
    syncing: 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...',
    synced: 'ಡೇಟಾಬೇಸ್ ಸಿಂಕ್ ಆಗಿದೆ',
    saveDraft: 'ಕರಡು ಉಳಿಸಿ',
    saveOffline: 'ಆಫ್‌ಲೈನ್ ಉಳಿಸಿ',
    submit: 'ನೋಂದಣಿ ಮಾಡಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    priorityQueue: 'ಆದ್ಯತಾ ಪಟ್ಟಿ',
    immediateAttention: 'ತಕ್ಷಣದ ಗಮನ ಬೇಕು',
    reviewToday: 'ಇಂದು ಪರಿಶೀಲಿಸಿ',
    stable: 'ಸ್ಥಿರ ಸ್ಥಿತಿ',
    taskEngine: 'ದೈನಂದಿನ ಕೆಲಸಗಳು',
    geoCluster: 'ಗ್ರಾಮ ನಕ್ಷೆ',
    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕಿ',
    listening: 'ಮಾತು ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    processingVoice: 'ಧ್ವನಿ ವಿಶ್ಲೇಷಣೆ (NLP)...',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್',
    totalMothers: 'ಒಟ್ಟು ತಾಯಂದಿರು',
    missedANC: 'ತಪ್ಪಿದ ಎಎನ್‌ಸಿ',
    emergencies: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ',
    followups: 'ಬಾಕಿ ಇರುವ ಕೆಲಸ',
    todayVisits: 'ಇಂದಿನ ಭೇಟಿಗಳು',
    secPersonal: '1. ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
    secPregnancy: '2. ಗರ್ಭಧಾರಣೆ ವಿವರಗಳು',
    secMedical: '3. ವೈದ್ಯಕೀಯ ಮಾಹಿತಿ',
    secEmergency: '4. ತುರ್ತು ವಿವರಗಳು',
    speakInput: 'ಪ್ರಾದೇಶಿಕ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ',
  },
  ta: {
    dashboard: 'ஆஷா டாஷ்போர்டு',
    mothers: 'கர்ப்பிணி தாய்மார்கள்',
    highRisk: 'அதிக ஆபத்து',
    visits: 'வீட்டு வருகை',
    insights: 'AI ஆபத்து பகுப்பாய்வு',
    emergency: 'அவசர சிகிச்சை மையம்',
    appointments: 'சந்திப்புகள்',
    records: 'ஆரோக்கிய பதிவுகள்',
    analytics: 'வரைபட பகுப்பாய்வு',
    messages: 'நினைவூட்டல் & ஆடியோ',
    settings: 'அமைப்புகள்',
    addMother: 'புதிய பதிவு',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன் பயன்முறை',
    syncing: 'ஒத்திசைக்கப்படுகிறது...',
    synced: 'தரவுத்தளம் ஒத்திசைக்கப்பட்டது',
    saveDraft: 'வரைவை சேமி',
    saveOffline: 'ஆஃப்லைனில் சேமி',
    submit: 'தாயை பதிவு செய்',
    back: 'பின்னால்',
    next: 'அடுத்து',
    priorityQueue: 'முன்னுரிமை வரிசை',
    immediateAttention: 'உடனடி கவனம் தேவை',
    reviewToday: 'இன்று மதிப்பாய்வு செய்',
    stable: 'நிலையான நிலை',
    taskEngine: 'தினசரி பணிகள்',
    geoCluster: 'கிராமப்புற வரைபடம்',
    voiceAssistant: 'குரல் உள்ளீடு',
    listening: 'பேச்சை கேட்கிறது...',
    processingVoice: 'குரல் பகுப்பாய்வு (NLP)...',
    confidence: 'நம்பிக்கை மதிப்பெண்',
    totalMothers: 'மொத்த தாய்மார்கள்',
    missedANC: 'தவறிய ANC வருகைகள்',
    emergencies: 'அவசர எச்சரிக்கைகள்',
    followups: 'நிலுவையில் உள்ளவை',
    todayVisits: 'இன்றைய வருகைகள்',
    secPersonal: '1. தனிப்பட்ட விவரங்கள்',
    secPregnancy: '2. கர்ப்ப விவரங்கள்',
    secMedical: '3. மருத்துவ விவரங்கள்',
    secEmergency: '4. அவசர கால விவரங்கள்',
    speakInput: 'உங்கள் மொழியில் பேச மைக் பொத்தானை அழுத்தவும்',
  },
  te: {
    dashboard: 'ఆశా డాష్‌బోర్డ్',
    mothers: 'గర్భిణీలు',
    highRisk: 'అధిక ప్రమాదం',
    visits: 'ఇంటి సందర్శన',
    insights: 'AI రిస్క్ అనలిటిక్స్',
    emergency: 'అత్యవసర కేంద్రం',
    appointments: 'అపాయింట్‌మెంట్లు',
    records: 'ఆరోగ్య రికార్డులు',
    analytics: 'విజువల్ అనలిటిక్స్',
    messages: 'రిమైండర్లు & ఆడియో',
    settings: 'సిస్టమ్ సెట్టింగులు',
    addMother: 'కొత్త రిజిస్ట్రేషన్',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్ మోడ్',
    syncing: 'సింక్ అవుతోంది...',
    synced: 'డేటాబేస్ సింక్ అయింది',
    saveDraft: 'డ్రాఫ్ట్ సేవ్ చేయి',
    saveOffline: 'ఆఫ్‌లైన్ సేవ్ చేయి',
    submit: 'రిజిస్టర్ చేయి',
    back: 'వెనుకకు',
    next: 'ముందుకు',
    priorityQueue: 'ప్రాధాన్యత క్యూ',
    immediateAttention: 'తక్షణ శ్రద్ధ అవసరం',
    reviewToday: 'ఈరోజు సమీక్షించు',
    stable: 'స్థిరమైన పరిస్థితి',
    taskEngine: 'దినసరి పనులు',
    geoCluster: 'గ్రామ మ్యాప్',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    listening: 'వాయిస్ వింటోంది...',
    processingVoice: 'వాయిస్ అనలిసిస్ (NLP)...',
    confidence: 'విశ్వసనీయత స్కోర్',
    totalMothers: 'మొత్తం తల్లులు',
    missedANC: 'మిస్సయిన ANC సందర్శనలు',
    emergencies: 'అత్యవసర హెచ్చరికలు',
    followups: 'బకాయి ఉన్న సందర్శనలు',
    todayVisits: 'ఇవాల్టి సందర్శనలు',
    secPersonal: '1. వ్యక్తిగత వివరాలు',
    secPregnancy: '2. గర్భధారణ వివరాలు',
    secMedical: '3. వైద్య సమాచారం',
    secEmergency: '4. అత్యవసర వివరాలు',
    speakInput: 'మీ భాషలో మాట్లాడటానికి మైక్ క్లిక్ చేయండి',
  },
};

// NLP speech simulation target database
export const voiceNLPSamples: Record<Language, Record<string, string>> = {
  en: {
    name: 'Priya Sharma',
    age: '26',
    husband: 'Rajesh Sharma',
    phone: '9845011223',
    address: 'Gandhi Nagar, Hosur',
    village: 'Hosur',
  },
  hi: {
    name: 'प्रिया शर्मा',
    age: '26',
    husband: 'राजेश शर्मा',
    phone: '9845011223',
    address: 'गांधी नगर, होसुर',
    village: 'होसुर',
  },
  kn: {
    name: 'ಪ್ರಿಯಾ ಶರ್ಮಾ',
    age: '26',
    husband: 'ರಾಜೇಶ್ ಶರ್ಮಾ',
    phone: '9845011223',
    address: 'ಗಾಂಧಿ ನಗರ, ಹೊಸೂರು',
    village: 'ಹೊಸೂರು',
  },
  ta: {
    name: 'பிரியா சர்மா',
    age: '26',
    husband: 'ராஜேஷ் சர்மா',
    phone: '9845011223',
    address: 'காந்தி நகர், ஓசூர்',
    village: 'ஓசூர்',
  },
  te: {
    name: 'ప్రియా శర్మ',
    age: '26',
    husband: 'రాజేష్ శర్మ',
    phone: '9845011223',
    address: 'గాంధీ నగర్, హోసూర్',
    village: 'హోసూర్',
  },
};
