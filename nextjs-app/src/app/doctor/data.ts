// ═══════════════════════════════════════════
// KANNAMMA CLINICAL DOCTOR OS - DATABASE
// ═══════════════════════════════════════════

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';
export type RiskLevel = 'green' | 'yellow' | 'red';

export interface DoctorVitalsLog {
  date: string;
  systolic: number;
  diastolic: number;
  spo2: number;
  fhr: number; // Fetal Heart Rate (bpm)
  weight: number; // kg
}

export interface DoctorPrescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  medicines: { name: string; dosage: string; duration: string; instructions: string }[];
  dietNotes?: string;
  doctorSignature: string;
}

export interface DoctorReport {
  id: string;
  patientId: string;
  patientName: string;
  category: 'blood' | 'scan' | 'prescription';
  fileName: string;
  fileSize: string;
  date: string;
  verified: boolean;
  verifiedBy?: string;
  reviewerNotes?: string;
  status: 'approved' | 'rejected' | 'pending';
}

export interface DoctorReferral {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  sourcePHC: string;
  targetHospital: string;
  doctorInCharge: string;
  escortAshaName: string;
  status: 'initiated' | 'dispatched' | 'en_route' | 'admitted';
  timestamp: string;
  etaMinutes?: number;
  timelineLogs: { time: string; text: string }[];
}

export interface DoctorConsultation {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  notes: string;
  language: string;
  voiceDictated: boolean;
  recommendations: string;
  followUpWeeks: number;
}

export interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  week: number; // Gestational Age in weeks
  trimester: number;
  husbandName: string;
  phone: string;
  bloodGroup: string;
  village: string;
  district: string;
  address: string;
  riskLevel: RiskLevel;
  riskReasons: string[];
  assignedAshaName: string;
  assignedAshaPhone: string;
  nextVisitDate: string;
  lastCheckIn: string;
  complianceRate: number; // e.g. 85%
  vitalsHistory: DoctorVitalsLog[];
  observations: string[];
  emergencyHistory: string[];
}

export interface DoctorMessage {
  id: string;
  recipientId: string; // e.g. "asha1", "anc1"
  recipientName: string;
  recipientType: 'asha' | 'anc';
  sender: 'doctor' | 'other';
  content: string;
  timestamp: string;
  read: boolean;
}

// ── SEED DATA ──────────────────────────────────────────

export const mockPatients: DoctorPatient[] = [
  {
    id: 'dp1',
    name: 'Priyanka Gowda',
    age: 28,
    week: 32,
    trimester: 3,
    husbandName: 'Manjunath Gowda',
    phone: '+91-98440-12345',
    bloodGroup: 'B+',
    village: 'Hosur',
    district: 'Bengaluru Rural',
    address: 'House No. 12, Main Road, Hosur Village',
    riskLevel: 'red',
    riskReasons: ['Severe Gestational Hypertension', 'Sudden Weight Gain', 'Low Supplement Adherence'],
    assignedAshaName: 'Meena R',
    assignedAshaPhone: '+91-98450-99881',
    nextVisitDate: '2026-05-24',
    lastCheckIn: '1 hour ago',
    complianceRate: 65,
    vitalsHistory: [
      { date: '2026-05-01', systolic: 135, diastolic: 88, spo2: 98, fhr: 140, weight: 68 },
      { date: '2026-05-08', systolic: 142, diastolic: 92, spo2: 97, fhr: 142, weight: 69.5 },
      { date: '2026-05-15', systolic: 150, diastolic: 98, spo2: 96, fhr: 145, weight: 71 },
      { date: '2026-05-21', systolic: 160, diastolic: 105, spo2: 96, fhr: 148, weight: 73 }
    ],
    observations: [
      'Preeclampsia monitoring protocol initialized. Patient complained of mild headaches and pedal edema.',
      'ASHA worker instructed to take daily BP checkups at home and restrict dietary sodium.'
    ],
    emergencyHistory: []
  },
  {
    id: 'dp2',
    name: 'Kavitha Ramasamy',
    age: 24,
    week: 22,
    trimester: 2,
    husbandName: 'Karthik Ramasamy',
    phone: '+91-99800-54321',
    bloodGroup: 'O+',
    village: 'Ramapura',
    district: 'Bengaluru Rural',
    address: 'Venkateshwara Temple St, Ramapura Rural',
    riskLevel: 'yellow',
    riskReasons: ['Moderate Maternal Anemia', 'Low Hemoglobin Index'],
    assignedAshaName: 'Sarala Devi',
    assignedAshaPhone: '+91-99801-11223',
    nextVisitDate: '2026-05-28',
    lastCheckIn: '4 hours ago',
    complianceRate: 88,
    vitalsHistory: [
      { date: '2026-04-10', systolic: 110, diastolic: 70, spo2: 99, fhr: 136, weight: 52 },
      { date: '2026-04-24', systolic: 112, diastolic: 72, spo2: 99, fhr: 138, weight: 53.5 },
      { date: '2026-05-08', systolic: 115, diastolic: 74, spo2: 98, fhr: 140, weight: 54.8 },
      { date: '2026-05-20', systolic: 114, diastolic: 75, spo2: 98, fhr: 139, weight: 55.4 }
    ],
    observations: [
      'Iron deficiency anemia detected. Hemoglobin at 9.2 g/dL. Commenced high-dose double iron supplements.',
      'Patient reports good compliance with nutritional instructions and green leafy vegetables.'
    ],
    emergencyHistory: []
  },
  {
    id: 'dp3',
    name: 'Anjali Sharma',
    age: 26,
    week: 12,
    trimester: 1,
    husbandName: 'Amit Sharma',
    phone: '+91-97430-88991',
    bloodGroup: 'A+',
    village: 'Kanakapura',
    district: 'Ramanagara',
    address: 'BGS School Rd, Kanakapura Town',
    riskLevel: 'green',
    riskReasons: [],
    assignedAshaName: 'Radha Gowda',
    assignedAshaPhone: '+91-97430-55661',
    nextVisitDate: '2026-06-10',
    lastCheckIn: '1 day ago',
    complianceRate: 95,
    vitalsHistory: [
      { date: '2026-04-15', systolic: 118, diastolic: 76, spo2: 99, fhr: 155, weight: 58 },
      { date: '2026-05-15', systolic: 120, diastolic: 78, spo2: 99, fhr: 152, weight: 59.2 }
    ],
    observations: [
      'First trimester dating scan completed successfully. Gestational age and CRL indicators correspond to dates.',
      'Routine folic acid regimen prescribed. Physiological checks normal.'
    ],
    emergencyHistory: []
  },
  {
    id: 'dp4',
    name: 'Meera Krishnan',
    age: 31,
    week: 28,
    trimester: 3,
    husbandName: 'Krishnan Nair',
    phone: '+91-96540-11221',
    bloodGroup: 'AB+',
    village: 'Nelamangala',
    district: 'Bengaluru Rural',
    address: 'Near Old Post Office, Ward 4, Nelamangala',
    riskLevel: 'red',
    riskReasons: ['Gestational Diabetes Mellitus (GDM)', 'Elevated OGTT Index', 'Advanced Maternal Age'],
    assignedAshaName: 'Lakshmamma K',
    assignedAshaPhone: '+91-96541-77881',
    nextVisitDate: '2026-05-25',
    lastCheckIn: '2 hours ago',
    complianceRate: 80,
    vitalsHistory: [
      { date: '2026-04-05', systolic: 120, diastolic: 80, spo2: 98, fhr: 140, weight: 64 },
      { date: '2026-04-26', systolic: 122, diastolic: 82, spo2: 98, fhr: 142, weight: 65.5 },
      { date: '2026-05-17', systolic: 125, diastolic: 84, spo2: 97, fhr: 141, weight: 67 }
    ],
    observations: [
      'Gestational diabetes diagnosed post 75g oral glucose tolerance test. Glucose level at 152 mg/dL.',
      'Placed on diabetic diet plan and daily home glucose monitoring before and after meals.'
    ],
    emergencyHistory: []
  },
  {
    id: 'dp5',
    name: 'Savitha Patil',
    age: 29,
    week: 36,
    trimester: 3,
    husbandName: 'Vijay Patil',
    phone: '+91-95330-88771',
    bloodGroup: 'O-',
    village: 'Hosur',
    district: 'Bengaluru Rural',
    address: 'Basaveshwara Layout, Sector 2, Hosur',
    riskLevel: 'yellow',
    riskReasons: ['Twin Pregnancy', 'Mild Fetal Growth Restriction (FGR)', 'Negative Blood Group Alert'],
    assignedAshaName: 'Meena R',
    assignedAshaPhone: '+91-98450-99881',
    nextVisitDate: '2026-05-26',
    lastCheckIn: '3 hours ago',
    complianceRate: 90,
    vitalsHistory: [
      { date: '2026-04-20', systolic: 122, diastolic: 78, spo2: 98, fhr: 142, weight: 70 },
      { date: '2026-05-04', systolic: 125, diastolic: 80, spo2: 98, fhr: 144, weight: 72.3 },
      { date: '2026-05-18', systolic: 128, diastolic: 82, spo2: 97, fhr: 140, weight: 74 }
    ],
    observations: [
      'Twin pregnancy monitored. Growth Doppler scans show mild umbilical artery blood flow resistance in Twin B.',
      'Anti-D immunoglobulin administered during week 28. Plan delivery at 37-38 weeks at referral hospital.'
    ],
    emergencyHistory: []
  }
];

export const mockReports: DoctorReport[] = [
  {
    id: 'drp1',
    patientId: 'dp1',
    patientName: 'Priyanka Gowda',
    category: 'blood',
    fileName: 'CBC_Hemogram_Priyanka.pdf',
    fileSize: '420 KB',
    date: '2026-05-20',
    verified: false,
    status: 'pending'
  },
  {
    id: 'drp2',
    patientId: 'dp1',
    patientName: 'Priyanka Gowda',
    category: 'scan',
    fileName: 'Growth_Doppler_Q3_Hosur.jpg',
    fileSize: '1.8 MB',
    date: '2026-05-19',
    verified: false,
    status: 'pending'
  },
  {
    id: 'drp3',
    patientId: 'dp2',
    patientName: 'Kavitha Ramasamy',
    category: 'blood',
    fileName: 'Hemoglobin_Ferritin_Panel.pdf',
    fileSize: '280 KB',
    date: '2026-05-18',
    verified: true,
    verifiedBy: 'Dr. Shreya Roy',
    reviewerNotes: 'Severe iron stores depletion (Ferritin: 8ng/mL). Double dose iron supplementation approved.',
    status: 'approved'
  },
  {
    id: 'drp4',
    patientId: 'dp4',
    patientName: 'Meera Krishnan',
    category: 'prescription',
    fileName: 'GDM_Diet_Prescription.jpg',
    fileSize: '650 KB',
    date: '2026-05-17',
    verified: true,
    verifiedBy: 'Dr. Shreya Roy',
    reviewerNotes: 'Diet recommendation verified. Retest fasting blood sugar in 1 week.',
    status: 'approved'
  }
];

export const mockPrescriptions: DoctorPrescription[] = [
  {
    id: 'dpr1',
    patientId: 'dp1',
    patientName: 'Priyanka Gowda',
    date: '2026-05-15',
    medicines: [
      { name: 'Labetalol 100mg', dosage: '1-0-1', duration: '30 Days', instructions: 'After food. Monitor BP daily.' },
      { name: 'Calcium Carbonate 500mg', dosage: '0-0-1', duration: '30 Days', instructions: 'Night, after food.' },
      { name: 'Iron Ascorbate 100mg', dosage: '1-0-0', duration: '30 Days', instructions: 'Morning, empty stomach.' }
    ],
    dietNotes: 'Strict low sodium diet. Avoid processed foods. Drink 3.5 liters of water daily.',
    doctorSignature: 'Dr. Shreya Roy'
  },
  {
    id: 'dpr2',
    patientId: 'dp2',
    patientName: 'Kavitha Ramasamy',
    date: '2026-05-10',
    medicines: [
      { name: 'Carbonyl Iron 100mg + Folic Acid', dosage: '1-0-1', duration: '60 Days', instructions: 'Double dose iron therapy. Post meal.' },
      { name: 'Vitamin C 500mg', dosage: '1-0-0', duration: '60 Days', instructions: 'Along with morning iron tablet for absorption.' }
    ],
    dietNotes: 'Consume iron-rich foods: pomegranate, spinach, jaggery, beetroot. Avoid drinking tea/coffee within 2 hours of iron tablets.',
    doctorSignature: 'Dr. Shreya Roy'
  }
];

export const mockReferrals: DoctorReferral[] = [
  {
    id: 'dref1',
    patientId: 'dp1',
    patientName: 'Priyanka Gowda',
    reason: 'Critical Blood Pressure Spike (160/105 mmHg) and visual disturbances indicating imminent preeclampsia complications.',
    sourcePHC: 'Nelamangala PHC Hub',
    targetHospital: 'City Maternity & District Hospital',
    doctorInCharge: 'Dr. Shreya Roy',
    escortAshaName: 'Meena R',
    status: 'en_route',
    timestamp: '18:15',
    etaMinutes: 12,
    timelineLogs: [
      { time: '18:15', text: 'SOS referral ticket launched by Dr. Shreya Roy from PHC OS.' },
      { time: '18:22', text: '108 Ambulance dispatched and siren operational. Escort ASHA boarded.' },
      { time: '18:30', text: 'Patient pick-up completed. Vitals stable: BP 155/100, SpO2 96%, FHR 145 bpm.' }
    ]
  }
];

export const mockMessages: DoctorMessage[] = [
  {
    id: 'dmsg1',
    recipientId: 'asha1',
    recipientName: 'Meena R',
    recipientType: 'asha',
    sender: 'doctor',
    content: 'Meena, please visit Priyanka Gowda first thing tomorrow morning and verify if she is taking the Labetalol tablets regularly.',
    timestamp: '17:05',
    read: true
  },
  {
    id: 'dmsg2',
    recipientId: 'asha1',
    recipientName: 'Meena R',
    recipientType: 'asha',
    sender: 'other',
    content: 'Yes Doctor, I will check on her and update her BP reading in the app by 10 AM.',
    timestamp: '17:22',
    read: false
  },
  {
    id: 'dmsg3',
    recipientId: 'anc1',
    recipientName: 'Nelamangala Hub Admin',
    recipientType: 'anc',
    sender: 'doctor',
    content: 'Requesting repeat hemoglobin test slots for Kavitha Ramasamy on her next visit date (May 28).',
    timestamp: '16:40',
    read: true
  }
];

export const translationMap: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Clinical Dashboard',
    queue: 'Patient Triage Queue',
    reports: 'Lab Reports Review',
    prescriptions: 'Digital Prescriptions',
    emergency: 'Emergency SOS Ward',
    consultations: 'Consultations Desk',
    analytics: 'Maternal Risk Analytics',
    messages: 'Liaison Communications',
    activePatients: 'Active Patients',
    todayConsultations: 'Today\'s Consultations',
    highRiskAlerts: 'High-Risk Alerts',
    pendingReports: 'Pending Reports Review',
    activeReferrals: 'SOS Referrals In Transit',
    clinicalOverview: 'Clinical Operations Overview',
    systolic: 'Systolic BP',
    diastolic: 'Diastolic BP',
    spo2: 'SpO₂ Level',
    fhr: 'Fetal Heart Rate',
    age: 'Age',
    gestationalAge: 'Gestational Age',
    trimester: 'Trimester',
    compliance: 'Adherence',
    assignedAsha: 'Assigned ASHA',
    village: 'Village Sector',
    observations: 'Clinical Observations',
    dictation: 'Voice Notes Dictation',
    startRecording: 'Start Recording Dictation',
    stopRecording: 'Stop Recording & Transcribe',
    transcribing: 'Processing voice transcription...',
    transcriptionResult: 'Simulated Clinical Transcription Result',
    medicines: 'Medications List',
    savePrescription: 'Save and Generate Prescription Card',
    emergencyEscalation: 'Escalate to Emergency SOS Transfer',
    referralHospital: 'Target Referral Hospital',
    referralReason: 'Referral Reason / Diagnostic Note',
    transitTimeline: 'Transit Timeline Log',
    postLog: 'Post Telemetry Update',
    verifyDocument: 'Approve & Verify Document',
    rejectDocument: 'Reject & Request Re-upload',
    reviewerNotes: 'Reviewer Vitals/Stamps',
    anemiaRate: 'Anemia Prevalence Rate',
    riskDistribution: 'Maternal Risk Distribution',
    complianceRate: 'Supplement Adherence Rate'
  },
  hi: {
    dashboard: 'नैदानिक डैशबोर्ड',
    queue: 'रोगी समीक्षा कतार',
    reports: 'लैब रिपोर्ट समीक्षा',
    prescriptions: 'डिजिटल नुस्खा',
    emergency: 'आपातकालीन एसओएस वार्ड',
    consultations: 'परामर्श डेस्क',
    analytics: 'मातृ जोखिम विश्लेषिकी',
    messages: 'संपर्क संचार',
    activePatients: 'सक्रिय मरीज',
    todayConsultations: 'आज के परामर्श',
    highRiskAlerts: 'उच्च जोखिम अलर्ट',
    pendingReports: 'लंबित रिपोर्ट समीक्षा',
    activeReferrals: 'पारगमन में एसओएस रेफरल',
    clinicalOverview: 'नैदानिक संचालन अवलोकन',
    systolic: 'सिस्टोलिक बीपी',
    diastolic: 'डायस्टोलिक बीपी',
    spo2: 'एसपीओ₂ स्तर',
    fhr: 'भ्रूण हृदय गति',
    age: 'उम्र',
    gestationalAge: 'गर्भावस्था की अवधि',
    trimester: 'त्रैमासिक',
    compliance: 'अनुपालन',
    assignedAsha: 'असाइन की गई आशा',
    village: 'ग्राम क्षेत्र',
    observations: 'नैदानिक अवलोकन',
    dictation: 'आवाज नोट डिक्टेशन',
    startRecording: 'डिक्टेशन रिकॉर्ड करना शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें और ट्रांसक्राइब करें',
    transcribing: 'आवाज ट्रांसक्रिप्शन संसाधित किया जा रहा है...',
    transcriptionResult: 'सिम्युलेटेड नैदानिक ट्रांसक्रिप्शन परिणाम',
    medicines: 'दवाओं की सूची',
    savePrescription: 'सहेजें और प्रिस्क्रिप्शन कार्ड जनरेट करें',
    emergencyEscalation: 'आपातकालीन एसओएस स्थानांतरण में वृद्धि करें',
    referralHospital: 'लक्ष्य रेफरल अस्पताल',
    referralReason: 'रेफरल कारण / नैदानिक नोट',
    transitTimeline: 'पारगमन समयरेखा लॉग',
    postLog: 'टेलीमेट्री अपडेट पोस्ट करें',
    verifyDocument: 'दस्तावेज़ स्वीकृत और सत्यापित करें',
    rejectDocument: 'अस्वीकार करें और पुनः अपलोड का अनुरोध करें',
    reviewerNotes: 'समीक्षक नोट्स / टिकट',
    anemiaRate: 'एनीमिया प्रसार दर',
    riskDistribution: 'मातृ जोखिम वितरण',
    complianceRate: 'पूरक अनुपालन दर'
  },
  kn: {
    dashboard: 'ಕ್ಲಿನಿಕಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    queue: 'ರೋಗಿ ಪರಿಶೀಲನಾ ಸರತಿ',
    reports: 'ಲ್ಯಾಬ್ ವರದಿಗಳ ವಿಮರ್ಶೆ',
    prescriptions: 'ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್',
    emergency: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ವಿಭಾಗ',
    consultations: 'ಸಮಾಲೋಚನಾ ಡೆಸ್ಕ್',
    analytics: 'ತಾಯಿಯ ಆರೋಗ್ಯದ ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ',
    messages: 'ಸಂಪರ್ಕ ಸಂವಹನ',
    activePatients: 'ಸಕ್ರಿಯ ರೋಗಿಗಳು',
    todayConsultations: 'ಇಂದಿನ ಸಮಾಲೋಚನೆಗಳು',
    highRiskAlerts: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳು',
    pendingReports: 'ಬಾಕಿ ಇರುವ ವರದಿಗಳು',
    activeReferrals: 'ತುರ್ತು ರೆಫರಲ್‌ಗಳು',
    clinicalOverview: 'ಕ್ಲಿನಿಕಲ್ ಕಾರ್ಯಾಚರಣೆಗಳ ಅವಲೋಕನ',
    systolic: 'ಸಿಸ್ಟೋಲಿಕ್ ಬಿಪಿ',
    diastolic: 'ಡಯಾಸ್ಟೋಲಿಕ್ ಬಿಪಿ',
    spo2: 'ಆಮ್ಲಜನಕದ ಮಟ್ಟ (SpO₂)',
    fhr: 'ಭ್ರೂಣದ ಹೃದಯ ಬಡಿತ',
    age: 'ವಯಸ್ಸು',
    gestationalAge: 'ಗರ್ಭಾವಸ್ಥೆಯ ವಾರ',
    trimester: 'ತ್ರೈಮಾಸಿಕ',
    compliance: 'ಔಷಧಿ ಪಾಲನೆ',
    assignedAsha: 'ನಿಯೋಜಿತ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ',
    village: 'ಗ್ರಾಮ ವಲಯ',
    observations: 'ವೈದ್ಯಕೀಯ ಅವಲೋಕನಗಳು',
    dictation: 'ಧ್ವನಿ ಮೂಲಕ ಟಿಪ್ಪಣಿ ಬರೆಯುವಿಕೆ',
    startRecording: 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    stopRecording: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    transcribing: 'ಧ್ವನಿಯನ್ನು ಪಠ್ಯಕ್ಕೆ ಪರಿವರ್ತಿಸಲಾಗುತ್ತಿದೆ...',
    transcriptionResult: 'ಪರಿವರ್ತಿತ ವೈದ್ಯಕೀಯ ಟಿಪ್ಪಣಿ',
    medicines: 'ಔಷಧಿಗಳ ಪಟ್ಟಿ',
    savePrescription: 'ಉಳಿಸಿ ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಕಾರ್ಡ್ ರಚಿಸಿ',
    emergencyEscalation: 'ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ವರ್ಗಾಯಿಸಿ (SOS)',
    referralHospital: 'ರೆಫರಲ್ ಆಸ್ಪತ್ರೆ',
    referralReason: 'ವರ್ಗಾವಣೆಯ ಕಾರಣ',
    transitTimeline: 'ಪ್ರಯಾಣದ ಸಮಯದ ಲಾಗ್',
    postLog: 'ಮಾಹಿತಿ ದಾಖಲಿಸಿ',
    verifyDocument: 'ದಾಖಲೆಯನ್ನು ಅನುಮೋದಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ',
    rejectDocument: 'ತಿರಸ್ಕರಿಸಿ ಮತ್ತು ಮರು-ಅಪ್ಲೋಡ್ ಮಾಡಲು ವಿನಂತಿಸಿ',
    reviewerNotes: 'ಪರಿಶೀಲಕರ ಟಿಪ್ಪಣಿಗಳು',
    anemiaRate: 'ರಕ್ತಹೀನತೆಯ ಪ್ರಮಾಣ',
    riskDistribution: 'ಅಪಾಯದ ಮಟ್ಟಗಳ ಹಂಚಿಕೆ',
    complianceRate: 'ಪೂರಕ ಔಷಧಿಗಳ ಸೇವನೆಯ ಪ್ರಮಾಣ'
  },
  ta: {
    dashboard: 'மருத்துவ டேஷ்போர்டு',
    queue: 'நோயாளி சரிபார்ப்பு வரிசை',
    reports: 'ஆய்வக அறிக்கைகள் மதிப்பாய்வு',
    prescriptions: 'டிஜிட்டல் மருந்துச்சீட்டு',
    emergency: 'அவசர சிகிச்சை பிரிவு',
    consultations: 'ஆலோசனை மேசை',
    analytics: 'மகப்பேறு அபாய பகுப்பாய்வு',
    messages: 'தொடர்பு வழித்தடம்',
    activePatients: 'செயலில் உள்ள நோயாளிகள்',
    todayConsultations: 'இன்றைய ஆலோசனைகள்',
    highRiskAlerts: 'உயர் அபாய எச்சரிக்கைகள்',
    pendingReports: 'மதிப்பாய்வு செய்ய வேண்டிய அறிக்கைகள்',
    activeReferrals: 'பயணத்தில் உள்ள அவசர பரிந்துரைகள்',
    clinicalOverview: 'மருத்துவ செயல்பாடுகள் மேலாண்மை',
    systolic: 'சிஸ்டாலிக் பிபி',
    diastolic: 'டயஸ்டாலிக் பிபி',
    spo2: 'ஆக்ஸிஜன் அளவு (SpO₂)',
    fhr: 'கருவின் இதய துடிப்பு',
    age: 'வயது',
    gestationalAge: 'கர்ப்ப காலம் (வாரங்கள்)',
    trimester: 'கர்ப்ப கால பகுதி',
    compliance: 'மருந்து உட்கொள்ளும் அளவு',
    assignedAsha: 'நியமிக்கப்பட்ட ஆஷா பணியாளர்',
    village: 'கிராமப்புற பகுதி',
    observations: 'மருத்துவ அவதானிப்புகள்',
    dictation: 'குரல் வழி குறிப்பு',
    startRecording: 'பதிவைத் தொடங்கவும்',
    stopRecording: 'பதிவை நிறுத்தி உரையாக மாற்றவும்',
    transcribing: 'குரல் உரை மாற்றப்படுகிறது...',
    transcriptionResult: 'மாற்றப்பட்ட மருத்துவ குறிப்பு',
    medicines: 'மருந்துகள் பட்டியல்',
    savePrescription: 'சேமித்து மருந்துச்சீட்டை உருவாக்கு',
    emergencyEscalation: 'அவசர சிகிச்சைக்கு பரிந்துரை செய்',
    referralHospital: 'பரிந்துரைக்கப்படும் மருத்துவமனை',
    referralReason: 'பரிந்துரைக்கான காரணம்',
    transitTimeline: 'பயண காலவரிசை பதிவு',
    postLog: 'தகவலைப் பதிவேற்று',
    verifyDocument: 'ஆவணத்தை அங்கீகரித்து சரிபார்',
    rejectDocument: 'நிராகரித்து மீண்டும் பதிவேற்றக் கோரு',
    reviewerNotes: 'மதிப்பாய்வாளர் குறிப்புகள்',
    anemiaRate: 'இரத்த சோகை பாதிப்பு விகிதம்',
    riskDistribution: 'மகப்பேறு அபாயப் பகிர்வு',
    complianceRate: 'மருந்து உட்கொள்ளும் விகிதம்'
  },
  te: {
    dashboard: 'క్లినికల్ డాష్‌బోర్డ్',
    queue: 'రోగుల పరిశీలన క్యూ',
    reports: 'ల్యాబ్ రిపోర్టుల సమీక్ష',
    prescriptions: 'డిజిటల్ ప్రిస్క్రిప్షన్',
    emergency: 'అత్యవసర చికిత్స విభాగం',
    consultations: 'సంప్రదింపుల డెస్క్',
    analytics: 'గర్భిణీల ఆరోగ్య విశ్లేషణ',
    messages: 'సమాచార మార్పిడి',
    activePatients: 'క్రియాశీల రోగులు',
    todayConsultations: 'నేటి సంప్రదింపులు',
    highRiskAlerts: 'అధిక ప్రమాద హెచ్చరికలు',
    pendingReports: 'పెండింగ్ రిపోర్టులు',
    activeReferrals: 'ప్రయాణంలో ఉన్న అత్యవసర కేసులు',
    clinicalOverview: 'క్లినికల్ ఆపరేషన్స్ అవలోకనం',
    systolic: 'సిస్టోలిక్ బీపీ',
    diastolic: 'డయాస్టోలిక్ బీపీ',
    spo2: 'ఆక్సిజన్ స్థాయి (SpO₂)',
    fhr: 'పిండం గుండె కొట్టుకునే వేగం',
    age: 'వయస్సు',
    gestationalAge: 'గర్భధారణ వారం',
    trimester: 'త్రైమాసికం',
    compliance: 'మందులు వాడే విధానం',
    assignedAsha: 'కేటాయించిన ఆశా కార్యకర్త',
    village: 'గ్రామ పరిధి',
    observations: 'వైద్యుని పరిశీలనలు',
    dictation: 'వాయిస్ నోట్స్ డిక్టేషన్',
    startRecording: 'రికార్డింగ్ ప్రారంభించండి',
    stopRecording: 'రికార్డింగ్ ఆపి టెక్స్ట్‌గా మార్చండి',
    transcribing: 'వాయిస్ టెక్స్ట్‌గా మారుతోంది...',
    transcriptionResult: 'మార్చబడిన వైద్య నివేదిక',
    medicines: 'మందుల జాబితా',
    savePrescription: 'సేవ్ చేసి ప్రిస్క్రిప్షన్ కార్డ్ సృష్టించండి',
    emergencyEscalation: 'అత్యవసర చికిత్సకు సిఫార్సు చేయండి (SOS)',
    referralHospital: 'రెఫరల్ ఆసుపత్రి',
    referralReason: 'సిఫార్సు కారణం',
    transitTimeline: 'ప్రయాణ సమయపట్టిక లాగ్',
    postLog: 'అప్‌డేట్ పోస్ట్ చేయండి',
    verifyDocument: 'పత్రాన్ని ఆమోదించి ధృవీకరించండి',
    rejectDocument: 'తిరస్కరించి మళ్లీ అప్‌లోడ్ చేయమని కోరండి',
    reviewerNotes: 'సమీక్షకుని అభిప్రాయాలు',
    anemiaRate: 'రక్తహీనత వ్యాప్తి రేటు',
    riskDistribution: 'గర్భిణీల ఆరోగ్య ముప్పుల వర్గీకరణ',
    complianceRate: 'మందుల వాడకం శాతం'
  }
};
