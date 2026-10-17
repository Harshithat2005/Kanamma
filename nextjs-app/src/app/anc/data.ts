// ═══════════════════════════════════════════
// KANNAMMA ANC CLINIC OPERATIONS - DATABASE
// ═══════════════════════════════════════════

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface AncMother {
  id: string;
  name: string;
  age: number;
  week: number;
  husbandName: string;
  phone: string;
  bloodGroup: string;
  hbLevel: number; // Hemoglobin (anemia marker)
  bp: string; // Blood Pressure e.g. "120/80"
  glucoseLevel: number; // blood glucose mg/dL
  riskLevel: RiskLevel;
  riskReasons: string[];
  assignedAshaId: string;
  nextVisitDate: string;
  lastCheckIn: string;
  complianceRate: number; // supplement adherence
  village: string;
  district: string;
  address: string;
  assignedDoctor: string;
}

export interface AncAshaWorker {
  id: string;
  name: string;
  phone: string;
  village: string;
  activeMothersCount: number;
  status: 'active' | 'offline';
  avatarText: string;
}

export interface AncAppointment {
  id: string;
  motherId: string;
  motherName: string;
  date: string;
  time: string;
  type: string;
  assignedDoctor: string;
  assignedAshaId: string;
  status: 'scheduled' | 'completed' | 'overdue';
}

export interface AncReport {
  id: string;
  motherId: string;
  motherName: string;
  category: 'blood' | 'scan' | 'prescription';
  fileName: string;
  fileSize: string;
  date: string;
  verified: boolean;
  verifiedBy?: string;
  notes?: string;
}

export interface AncReferral {
  id: string;
  motherId: string;
  motherName: string;
  reason: string;
  sourcePHC: string;
  targetHospital: string;
  doctorInCharge: string;
  escortAshaId: string;
  status: 'initiated' | 'dispatched' | 'en_route' | 'admitted';
  timestamp: string;
  etaMinutes?: number;
  timelineLogs: { time: string; text: string }[];
}

export interface AncMessage {
  id: string;
  ashaId: string;
  sender: 'clinic' | 'asha';
  content: string;
  timestamp: string;
  read: boolean;
}

// ── SEED DATA ──────────────────────────────────────────

export const mockAshaWorkers: AncAshaWorker[] = [
  { id: 'asha1', name: 'Meena R', phone: '+91-98450-99881', village: 'Hosur', activeMothersCount: 6, status: 'active', avatarText: 'MR' },
  { id: 'asha2', name: 'Sarala Devi', phone: '+91-99801-11223', village: 'Ramapura', activeMothersCount: 4, status: 'active', avatarText: 'SD' },
  { id: 'asha3', name: 'Radha Gowda', phone: '+91-97430-55661', village: 'Kanakapura', activeMothersCount: 3, status: 'offline', avatarText: 'RG' },
  { id: 'asha4', name: 'Lakshmamma K', phone: '+91-96541-77881', village: 'Nelamangala', activeMothersCount: 2, status: 'active', avatarText: 'LK' },
];

export const mockMothers: AncMother[] = [
  {
    id: 'm1',
    name: 'Priya Sharma',
    age: 26,
    week: 28,
    husbandName: 'Rajesh Sharma',
    phone: '+91-98450-11223',
    bloodGroup: 'O+',
    hbLevel: 10.4,
    bp: '134/86',
    glucoseLevel: 85,
    riskLevel: 'yellow',
    riskReasons: ['Mild Gestational Hypertension', 'Inadequate Sleep Pattern'],
    assignedAshaId: 'asha1',
    nextVisitDate: '2026-06-15',
    lastCheckIn: '2 hours ago',
    complianceRate: 88,
    village: 'Hosur',
    district: 'Bengaluru Rural',
    address: 'House 42, Cross 3, Gandhi Nagar',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)'
  },
  {
    id: 'm2',
    name: 'Sujata Gowda',
    age: 31,
    week: 32,
    husbandName: 'Kiran Gowda',
    phone: '+91-99801-77889',
    bloodGroup: 'B+',
    hbLevel: 9.1,
    bp: '162/104',
    glucoseLevel: 110,
    riskLevel: 'red',
    riskReasons: ['Severe Pre-Eclampsia', 'Critical Hypertension Spikes', 'Fetal Movement Warning'],
    assignedAshaId: 'asha2',
    nextVisitDate: '2026-05-24',
    lastCheckIn: '5 mins ago',
    complianceRate: 98,
    village: 'Ramapura',
    district: 'Bengaluru Rural',
    address: 'Near Temple, Ramapura Main Road',
    assignedDoctor: 'Dr. Srinivasan (OB-GYN)'
  },
  {
    id: 'm3',
    name: 'Amanya Reddy',
    age: 23,
    week: 16,
    husbandName: 'Venkat Reddy',
    phone: '+91-97430-88771',
    bloodGroup: 'A+',
    hbLevel: 12.1,
    bp: '110/70',
    glucoseLevel: 80,
    riskLevel: 'green',
    riskReasons: [],
    assignedAshaId: 'asha3',
    nextVisitDate: '2026-06-02',
    lastCheckIn: '1 day ago',
    complianceRate: 100,
    village: 'Kanakapura',
    district: 'Ramanagara',
    address: 'Agric Clinic Road, Ward 2',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)'
  },
  {
    id: 'm4',
    name: 'Kavitha Raj',
    age: 28,
    week: 24,
    husbandName: 'Raj Kumar',
    phone: '+91-96541-22998',
    bloodGroup: 'B-',
    hbLevel: 8.4,
    bp: '118/76',
    glucoseLevel: 95,
    riskLevel: 'yellow',
    riskReasons: ['Moderate Gestational Anemia', 'Missed Supplement Cycles'],
    assignedAshaId: 'asha1',
    nextVisitDate: '2026-06-08',
    lastCheckIn: '12 hours ago',
    complianceRate: 65,
    village: 'Hosur',
    district: 'Bengaluru Rural',
    address: 'Post Office Block, Near Water Tank',
    assignedDoctor: 'Dr. Lakshmi (OB-GYN)'
  },
  {
    id: 'm5',
    name: 'Radha Naik',
    age: 33,
    week: 20,
    husbandName: 'Prasad Naik',
    phone: '+91-91234-56789',
    bloodGroup: 'AB+',
    hbLevel: 11.0,
    bp: '135/88',
    glucoseLevel: 142,
    riskLevel: 'red',
    riskReasons: ['Uncontrolled Gestational Diabetes Mellitus', 'Metabolic Instability'],
    assignedAshaId: 'asha3',
    nextVisitDate: '2026-05-30',
    lastCheckIn: '10 mins ago',
    complianceRate: 72,
    village: 'Kanakapura',
    district: 'Ramanagara',
    address: 'Golla colony, Sector 4',
    assignedDoctor: 'Dr. Srinivasan (OB-GYN)'
  },
  {
    id: 'm6',
    name: 'Savitha Patel',
    age: 29,
    week: 12,
    husbandName: 'Amit Patel',
    phone: '+91-94560-11221',
    bloodGroup: 'O-',
    hbLevel: 9.8,
    bp: '115/72',
    glucoseLevel: 90,
    riskLevel: 'yellow',
    riskReasons: ['Rh Negative Incompatibility Risk', 'Mild Anemia'],
    assignedAshaId: 'asha4',
    nextVisitDate: '2026-06-20',
    lastCheckIn: '2 days ago',
    complianceRate: 85,
    village: 'Nelamangala',
    district: 'Bengaluru Rural',
    address: 'Circle Corner, Ward 1',
    assignedDoctor: 'Dr. Srinivasan (OB-GYN)'
  }
];

export const mockAppointments: AncAppointment[] = [
  { id: 'apt1', motherId: 'm2', motherName: 'Sujata Gowda', date: '2026-05-24', time: '10:00', type: 'Emergency ANC Follow-up', assignedDoctor: 'Dr. Srinivasan (OB-GYN)', assignedAshaId: 'asha2', status: 'scheduled' },
  { id: 'apt2', motherId: 'm5', motherName: 'Radha Naik', date: '2026-05-30', time: '11:30', type: 'GDM Review & Sugar Profiling', assignedDoctor: 'Dr. Srinivasan (OB-GYN)', assignedAshaId: 'asha3', status: 'scheduled' },
  { id: 'apt3', motherId: 'm3', motherName: 'Amanya Reddy', date: '2026-06-02', time: '09:30', type: 'Routine ANC Visit 2', assignedDoctor: 'Dr. Lakshmi (OB-GYN)', assignedAshaId: 'asha3', status: 'scheduled' },
  { id: 'apt4', motherId: 'm4', motherName: 'Kavitha Raj', date: '2026-06-08', time: '14:00', type: 'Anemia Hemoglobin Check', assignedDoctor: 'Dr. Lakshmi (OB-GYN)', assignedAshaId: 'asha1', status: 'scheduled' },
  { id: 'apt5', motherId: 'm1', motherName: 'Priya Sharma', date: '2026-06-15', time: '10:35', type: 'Routine ANC Visit 4', assignedDoctor: 'Dr. Lakshmi (OB-GYN)', assignedAshaId: 'asha1', status: 'scheduled' },
  { id: 'apt6', motherId: 'm6', motherName: 'Savitha Patel', date: '2026-06-20', time: '12:00', type: 'Trimester 1 Ultrasound Scan', assignedDoctor: 'Dr. Srinivasan (OB-GYN)', assignedAshaId: 'asha4', status: 'scheduled' },
  { id: 'apt7', motherId: 'm1', motherName: 'Priya Sharma', date: '2026-05-15', time: '10:00', type: 'Spot Proteinuria Screening', assignedDoctor: 'Dr. Lakshmi (OB-GYN)', assignedAshaId: 'asha1', status: 'completed' },
];

export const mockReports: AncReport[] = [
  { id: 'rep1', motherId: 'm1', motherName: 'Priya Sharma', category: 'blood', fileName: 'CBC_Hb_Report_Priya.pdf', fileSize: '480 KB', date: '2026-05-18', verified: true, verifiedBy: 'Dr. Lakshmi', notes: 'Hemoglobin stable at 10.4 g/dL. Mild platelets elevation noted.' },
  { id: 'rep2', motherId: 'm4', motherName: 'Kavitha Raj', category: 'blood', fileName: 'Iron_Profile_Kavitha.pdf', fileSize: '1.2 MB', date: '2026-05-20', verified: false, notes: 'Anemia screen: low serum ferritin levels. Pending clinical verification.' },
  { id: 'rep3', motherId: 'm2', motherName: 'Sujata Gowda', category: 'scan', fileName: 'Ultrasound_Scan_32W.jpg', fileSize: '2.4 MB', date: '2026-05-21', verified: true, verifiedBy: 'Dr. Srinivasan', notes: '32-Week scan: Fetal growth appropriate for GA. Standard Doppler flow indicates high resistance.' },
  { id: 'rep4', motherId: 'm5', motherName: 'Radha Naik', category: 'prescription', fileName: 'Rx_GDM_Metformin.pdf', fileSize: '340 KB', date: '2026-05-19', verified: true, verifiedBy: 'Dr. Srinivasan', notes: 'GDM oral hypoglycemics regimen. Metformin 500mg BD.' },
];

export const mockReferrals: AncReferral[] = [
  {
    id: 'ref1',
    motherId: 'm2',
    motherName: 'Sujata Gowda',
    reason: 'Severe Pre-Eclampsia, extreme hypertension (162/104 mmHg) with reported fetal movement decrease.',
    sourcePHC: 'Ramapura PHC',
    targetHospital: 'City Maternity & District Hospital',
    doctorInCharge: 'Dr. Srinivasan (OB-GYN)',
    escortAshaId: 'asha2',
    status: 'en_route',
    timestamp: '19:15 (28 mins ago)',
    etaMinutes: 12,
    timelineLogs: [
      { time: '19:15', text: 'ASHA worker triggered Emergency SOS from home.' },
      { time: '19:18', text: 'Referral request registered at Ramapura PHC. Hospital notified.' },
      { time: '19:22', text: 'Ambulance 108 dispatched from District Hub.' },
      { time: '19:35', text: 'Ambulance arrived at patient residence. Vitals stabilized. Patient en route.' }
    ]
  }
];

export const mockMessages: AncMessage[] = [
  { id: 'msg1', ashaId: 'asha1', sender: 'asha', content: 'Priya Sharma complained of slight headaches today. Checking her blood pressure now.', timestamp: '17:20', read: true },
  { id: 'msg2', ashaId: 'asha1', sender: 'clinic', content: 'Please log her BP immediately on the system. Advise her to rest.', timestamp: '17:25', read: true },
  { id: 'msg3', ashaId: 'asha1', sender: 'asha', content: 'Yes, logged it as 134/86. She is resting.', timestamp: '17:35', read: true },
  { id: 'msg4', ashaId: 'asha2', sender: 'asha', content: 'Sujatas husband reports zero fetal movement in several hours. I am rushing to their house now.', timestamp: '19:05', read: false },
  { id: 'msg5', ashaId: 'asha3', sender: 'asha', content: 'Metformin supply is running low in Kanakapura sector clinic. Can you check warehouse stocks?', timestamp: '14:30', read: true }
];

// ── TRANSLATIONS MAP ───────────────────────────────────

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'ANC Operational Dashboard',
    mothers: 'Mothers Registry',
    highRisk: 'High-Risk Queue',
    appointments: 'Appointments Planner',
    reports: 'Lab Report Verification',
    referrals: 'Emergency Referrals',
    analytics: 'Analytics HUD',
    messages: 'ASHA Communications',
    totalMothers: 'Total Registered Mothers',
    todaysVisits: 'ASHA Field Visits Today',
    highRiskCases: 'High-Risk Triage Cases',
    missedANC: 'Missed ANC Visits',
    emergencyReferrals: 'Active Escalate Referrals',
    registered: 'Registered',
    riskLevel: 'Risk Level',
    assignedAsha: 'Assigned ASHA Worker',
    nextVisitDate: 'Next Visit Date',
    bloodGroup: 'Blood Group',
    hbLevel: 'Hemoglobin (Hb)',
    bp: 'Blood Pressure',
    glucose: 'Glucose Level',
    actionRequired: 'Action Required',
    searchMothers: 'Search mothers by name or ASHA worker...',
    scheduleVisit: 'Schedule ANC Visit',
    reschedule: 'Reschedule',
    escalateEmergency: 'Escalate SOS Referral',
    all: 'All Categories',
    blood: 'Blood Work',
    scan: 'Ultrasound Scan',
    prescription: 'Prescriptions',
    verify: 'Verify Report',
    verified: 'Verified',
    unverified: 'Unverified',
    timeline: 'Referral Journey Timeline',
    reminders: 'Send Reminders',
    villagepregnancy: 'Pregnancies by Village',
    trimesterdist: 'Trimester Distribution',
    riskTrends: 'High-Risk Triage Trends',
    attendance: 'ANC Attendance Index',
    remindersent: 'Reminder sent to ASHA and mother successfully.',
    escort: 'Escort ASHA',
    target: 'Target Hospital',
    reason: 'Reason for Transfer',
  },
  hi: {
    dashboard: 'एएनसी क्लिनिक डैशबोर्ड',
    mothers: 'गर्भवती पंजीकरण',
    highRisk: 'उच्च जोखिम कतार',
    appointments: 'अपॉइंटमेंट योजनाकार',
    reports: 'लैब रिपोर्ट सत्यापन',
    referrals: 'आपातकालीन रेफरल',
    analytics: 'क्लिनिक विश्लेषण',
    messages: 'आशा संचार संदेश',
    totalMothers: 'कुल पंजीकृत माताएं',
    todaysVisits: 'आशा गृह दौरे आज',
    highRiskCases: 'उच्च जोखिम मामले',
    missedANC: 'छूटे हुए एएनसी दौरे',
    emergencyReferrals: 'सक्रिय आपातकालीन रेफरल',
    registered: 'पंजीकृत',
    riskLevel: 'जोखिम का स्तर',
    assignedAsha: 'सौंपी गई आशा कार्यकर्ता',
    nextVisitDate: 'अगली जांच तिथि',
    bloodGroup: 'रक्त समूह',
    hbLevel: 'हीमोग्लोबिन (Hb)',
    bp: 'रक्तचाप (BP)',
    glucose: 'ग्लूकोज स्तर',
    actionRequired: 'कार्रवाई आवश्यक',
    searchMothers: 'माता का नाम या आशा कार्यकर्ता से खोजें...',
    scheduleVisit: 'एएनसी अपॉइंटमेंट बुक करें',
    reschedule: 'तारीख बदलें',
    escalateEmergency: 'रेफरल आपातकाल भेजें',
    all: 'सभी श्रेणियां',
    blood: 'रक्त रिपोर्ट',
    scan: 'अल्ट्रासाउंड स्कैन',
    prescription: 'पर्चे (Rx)',
    verify: 'रिपोर्ट सत्यापित करें',
    verified: 'सत्यापित',
    unverified: 'असत्यापित',
    timeline: 'रेफरल यात्रा समयरेखा',
    reminders: 'अनुस्मारक भेजें',
    villagepregnancy: 'गांव के अनुसार गर्भावस्था',
    trimesterdist: 'तिमाही वितरण विवरण',
    riskTrends: 'उच्च जोखिम रुझान',
    attendance: 'एएनसी उपस्थिति सूचकांक',
    remindersent: 'आशा और माता को सफलतापूर्वक अनुस्मारक भेजा गया।',
    escort: 'एस्कॉर्ट आशा कार्यकर्ता',
    target: 'लक्षित अस्पताल',
    reason: 'स्थानांतरण का कारण',
  },
  kn: {
    dashboard: 'ಎಎನ್‌ಸಿ ಕ್ಲಿನಿಕ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    mothers: 'ಗರ್ಭಿಣಿಯರ ನೋಂದಣಿ',
    highRisk: 'ಅಪಾಯಕಾರಿ ಪ್ರಕರಣಗಳು',
    appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪ್ಲಾನರ್',
    reports: 'ವರದಿಗಳ ಪರಿಶೀಲನೆ',
    referrals: 'ತುರ್ತು ರೆಫರಲ್ ಸೇವೆ',
    analytics: 'ವಿಶ್ಲೇಷಣೆ ಮಾಹಿತಿ',
    messages: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರ ಸಂವಹನ',
    totalMothers: 'ಒಟ್ಟು ಗರ್ಭಿಣಿಯರು',
    todaysVisits: 'ಇಂದಿನ ಮನೆ ಭೇಟಿಗಳು',
    highRiskCases: 'ಹೆಚ್ಚು ಅಪಾಯದ ಪ್ರಕರಣಗಳು',
    missedANC: 'ತಪ್ಪಿದ ಎಎನ್‌ಸಿ ತಪಾಸಣೆಗಳು',
    emergencyReferrals: 'ಸಕ್ರಿಯ ತುರ್ತು ರೆಫರಲ್ಸ್',
    registered: 'ನೋಂದಾಯಿಸಲಾಗಿದೆ',
    riskLevel: 'ಅಪಾಯದ ಮಟ್ಟ',
    assignedAsha: 'ನಿಯೋಜಿತ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ',
    nextVisitDate: 'ಮುಂದಿನ ಭೇಟಿ ದಿನಾಂಕ',
    bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
    hbLevel: 'ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಟ್ಟ',
    bp: 'ರಕ್ತದೊತ್ತಡ (BP)',
    glucose: 'ಸಕ್ಕರೆ ಪ್ರಮಾಣ',
    actionRequired: 'ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕಿದೆ',
    searchMothers: 'ಗರ್ಭಿಣಿ ಅಥವಾ ಆಶಾ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...',
    scheduleVisit: 'ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ',
    reschedule: 'ದಿನಾಂಕ ಬದಲಾವಣೆ',
    escalateEmergency: 'ತುರ್ತು ರೆಫರಲ್ ಕಳುಹಿಸಿ',
    all: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
    blood: 'ರಕ್ತದ ವರದಿಗಳು',
    scan: 'ಸ್ಕ್ಯಾನಿಂಗ್ ವರದಿ',
    prescription: 'ಔಷಧ ಚೀಟಿ (Rx)',
    verify: 'ವರದಿ ದೃಢೀಕರಿಸಿ',
    verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    unverified: 'ದೃಢೀಕರಿಸಲಾಗಿಲ್ಲ',
    timeline: 'ರೆಫರಲ್ ಪ್ರಯಾಣದ ಸಮಯರೇಖೆ',
    reminders: 'ಜ್ಞಾಪನೆ ಕಳುಹಿಸಿ',
    villagepregnancy: 'ಗ್ರಾಮವಾರು ಗರ್ಭಿಣಿಯರು',
    trimesterdist: 'ತ್ರೈಮಾಸಿಕ ಹಂಚಿಕೆ',
    riskTrends: 'ಅಪಾಯದ ಪ್ರಮಾಣದ ಪ್ರವೃತ್ತಿ',
    attendance: 'ತಪಾಸಣೆ ಹಾಜರಾತಿ ಸೂಚ್ಯಂಕ',
    remindersent: 'ಆಶಾ ಮತ್ತು ತಾಯಿಗೆ ಜ್ಞಾಪನೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
    escort: 'ರಕ್ಷಕ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ',
    target: 'ಲಕ್ಷಿತ ಆಸ್ಪತ್ರೆ',
    reason: 'ವರ್ಗಾವಣೆಯ ಕಾರಣ',
  },
  ta: {
    dashboard: 'ANC மருத்துவமனை டாஷ்போர்டு',
    mothers: 'தாய்மார்கள் பதிவேடு',
    highRisk: 'அதிக ஆபத்து வரிசை',
    appointments: 'சந்திப்பு திட்டமிடுபவர்',
    reports: 'ஆய்வக அறிக்கை சரிபார்ப்பு',
    referrals: 'அவசர பரிந்துரைகள்',
    analytics: 'மருத்துவமனை பகுப்பாய்வு',
    messages: 'ஆஷா தொடர்பு செய்திகள்',
    totalMothers: 'மொத்த பதிவு செய்த தாய்மார்கள்',
    todaysVisits: 'இன்றைய ஆஷா வீட்டு வருகைகள்',
    highRiskCases: 'அதிக ஆபத்துள்ள வழக்குகள்',
    missedANC: 'தவறிய ANC சந்திப்புகள்',
    emergencyReferrals: 'செயலில் உள்ள அவசர பரிந்துரைகள்',
    registered: 'பதிவு செய்யப்பட்டது',
    riskLevel: 'ஆபத்து நிலை',
    assignedAsha: 'நியமிக்கப்பட்ட ஆஷா ஊழியர்',
    nextVisitDate: 'அடுத்த வருகை தேதி',
    bloodGroup: 'இரத்த வகை',
    hbLevel: 'ஹீமோகுளோபின் (Hb)',
    bp: 'இரத்த அழுத்தம் (BP)',
    glucose: 'சர்க்கரை அளவு',
    actionRequired: 'நடவடிக்கை தேவை',
    searchMothers: 'தாய் பெயர் அல்லது ஆஷா பெயர் கொண்டு தேடுக...',
    scheduleVisit: 'சந்திப்பு பதிவு செய்க',
    reschedule: 'தேதி மாற்றம் செய்க',
    escalateEmergency: 'பரிந்துரையை அவசரப்படுத்துக',
    all: 'அனைத்து பிரிவுகள்',
    blood: 'இரத்த பரிசோதனை',
    scan: 'ஸ்கேன் அறிக்கை',
    prescription: 'மருந்து சீட்டு (Rx)',
    verify: 'அறிக்கையை சரிபார்',
    verified: 'சரிபார்க்கப்பட்டது',
    unverified: 'சரிபார்க்கப்படாதது',
    timeline: 'பரிந்துரை பயண காலவரிசை',
    reminders: 'நினைவூட்டல் அனுப்புக',
    villagepregnancy: 'கிராம வாரியாக கர்ப்பிணிகள்',
    trimesterdist: 'கர்ப்ப கால பிரிவு பகிர்வு',
    riskTrends: 'அதிக ஆபத்து போக்குகள்',
    attendance: 'வருகை குறியீடு',
    remindersent: 'ஆஷா மற்றும் தாய்க்கு நினைவூட்டல் அனுப்பப்பட்டது.',
    escort: 'துணை ஆஷா ஊழியர்',
    target: 'இலக்கு மருத்துவமனை',
    reason: 'மாற்றத்திற்கான காரணம்',
  },
  te: {
    dashboard: 'ANC క్లినిక్ డాష్‌బోర్డ్',
    mothers: 'గర్భిణీల రిజిస్ట్రేషన్',
    highRisk: 'అధిక ప్రమాదాల విభాగం',
    appointments: 'అపాయింట్‌మెంట్ ప్లానర్',
    reports: 'ల్యాబ్ రిపోర్టుల వెరిఫికేషన్',
    referrals: 'అత్యవసర రెఫరల్స్',
    analytics: 'క్లినిక్ విశ్లేషణలు',
    messages: 'ఆశా కార్యకర్తల సందేశాలు',
    totalMothers: 'మొత్తం రిజిస్టర్డ్ గర్భిణీలు',
    todaysVisits: 'ఆశా ఇవాల్టి ఇంటి సందర్శనలు',
    highRiskCases: 'అధిక ప్రమాద కేసులు',
    missedANC: 'మిస్సయిన ఎఎన్సి సందర్శనలు',
    emergencyReferrals: 'సక్రియ అత్యవసర రెఫరల్స్',
    registered: 'రిజిస్టర్డ్',
    riskLevel: 'ప్రమాద స్థాయి',
    assignedAsha: 'నియమించబడిన ఆశా వర్కర్',
    nextVisitDate: 'తదుపరి తనిఖీ తేదీ',
    bloodGroup: 'రక్త రకం',
    hbLevel: 'హిమోగ్లోబిన్ లెవెల్',
    bp: 'రక్తపోటు (BP)',
    glucose: 'గ్లూకోజ్ స్థాయి',
    actionRequired: 'చర్య అవసరం',
    searchMothers: 'తల్లి పేరు లేదా ఆశా వర్కర్ తో వెతకండి...',
    scheduleVisit: 'ANC అపాయింట్‌మెంట్ బుక్ చేయి',
    reschedule: 'తేది మార్చు',
    escalateEmergency: 'అత్యవసర రెఫరల్ పంపు',
    all: 'అన్ని విభాగాలు',
    blood: 'బ్లడ్ రిపోర్ట్',
    scan: 'స్కాన్ రిపోర్ట్',
    prescription: 'ప్రిస్క్రిప్షన్లు (Rx)',
    verify: 'రిపోర్ట్ వెరిఫై చేయి',
    verified: 'వెరిఫైడ్',
    unverified: 'వెరిఫై కాలేదు',
    timeline: 'రెఫరల్ జర్నీ టైమ్‌లైన్',
    reminders: 'రిమైండర్లు పంపు',
    villagepregnancy: 'గ్రామాల వారీగా గర్భిణీలు',
    trimesterdist: 'త్రైమాసిక నిష్పత్తి',
    riskTrends: 'అధిక ప్రమాదాల ట్రెండ్స్',
    attendance: 'ఎఎన్సి హాజరు సూచిక',
    remindersent: 'ఆశా మరియు తల్లికి రిమైండర్ పంపబడింది.',
    escort: 'ఎస్కార్ట్ ఆశా వర్కర్',
    target: 'లక్షిత ఆసుపత్రి',
    reason: 'తరలింపు కారణం',
  }
};
