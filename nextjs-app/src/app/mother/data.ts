// ═══════════════════════════════════════════
// KANNAMMA MOTHER — TYPES & CLINICAL DATA
// ═══════════════════════════════════════════

// ── TYPES ──────────────────────────────────

export type Language = "en" | "hi" | "kn" | "ta";

export type MoodLevel = "excellent" | "good" | "neutral" | "low" | "distressed";

export interface VitalReading {
  time: string;
  value: number;
}

export interface WeeklyReading {
  day: string;
  value: number;
}

export interface FetusMetrics {
  week: number;
  crownRumpLength: string;
  estimatedWeight: string;
  percentile: number;
  developingSystems: string[];
  milestone: string;
  clinicalNote: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  text: string;
  symptoms?: string[];
}

export interface AlertItem {
  id: string;
  type: "green" | "yellow" | "red";
  title: string;
  description: string;
  time: string;
  iconType: "pill" | "droplets" | "calendar" | "check" | "activity" | "alert-triangle" | "thermometer" | "heart";
}

export interface FamilyMember {
  name: string;
  relation: string;
  verified: boolean;
  canReceiveAlerts: boolean;
}

export interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  category: "blood" | "prescription" | "anc" | "scan";
  size: string;
}

export interface CheckInQuestion {
  id: number;
  question: string;
  options: { label: string; value: string; alert?: string }[];
}

export interface AppointmentRecord {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  location: string;
  type: string;
  status: "completed" | "upcoming" | "cancelled";
  notes?: string;
  checklist?: string[];
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  priority: number;
  available: boolean;
}

export interface TimelineEvent {
  week: number;
  type: "scan" | "test" | "visit" | "milestone" | "vaccine";
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  date?: string;
}

export interface SupplementItem {
  name: string;
  dosage: string;
  schedule: string;
  takenToday: boolean;
  nextDue?: string;
}

// ── CLINICAL REFERENCE RANGES ──────────────

export const vitalRanges = {
  heartRate: { min: 60, max: 100, unit: "BPM", label: "Heart Rate" },
  spo2: { min: 95, max: 100, unit: "%", label: "SpO₂" },
  temperature: { min: 36.1, max: 37.2, unit: "°C", label: "Temperature" },
  systolic: { min: 90, max: 140, unit: "mmHg", label: "Systolic BP" },
  diastolic: { min: 60, max: 90, unit: "mmHg", label: "Diastolic BP" },
};

// ── TRANSLATIONS ───────────────────────────

export const translations: Record<Language, Record<string, string>> = {
  en: {
    greeting: "Good morning, Priya",
    greetingSub: "Gravida 1 · Week 28 · EDD Sep 12, 2025",
    wellnessTitle: "Wellness Index",
    wellnessScore: "82",
    sleep: "Sleep",
    activity: "Activity",
    mood: "Mood",
    heartRate: "Heart Rate",
    spo2: "SpO₂",
    temperature: "Temperature",
    bloodPressure: "Blood Pressure",
    ringBattery: "Ring Battery",
    normal: "Normal",
    optimal: "Optimal",
    elevated: "Elevated",
    critical: "Critical",
    monitor: "Monitor",
    bpm: "BPM",
    daysRemaining: "~7 days remaining",
    lastSynced: "Last synced 2 min ago",
    weekOf: "Week 28 of 40",
    thirdTrimester: "Third Trimester",
    daysUntilDue: "84 days until estimated delivery",
    dueDate: "September 12, 2025",
    currentWeekDev: "Crown-rump length 37.6 cm · Estimated weight 1,005 g",
    fetalNote: "Brain developing rapidly. Eyes can open and close. Hearing fully developed.",
    dailyCheckIn: "Daily Check-In",
    checkInSub: "5 clinical questions — 30 seconds",
    checkInComplete: "Check-in complete. ASHA worker notified.",
    aiRisk: "AI Risk Assessment",
    lowRisk: "LOW RISK",
    riskReadings: "Based on 847 continuous readings today",
    bpTrend: "Blood Pressure Trend",
    bpStatus: "Stable",
    sleepQuality: "Sleep Quality",
    sleepStatus: "Below target",
    activityLevel: "Activity Level",
    activityStatus: "Moderate",
    nutritionStatus: "Nutritional Status",
    nutritionValue: "Adequate",
    lastAssessed: "Last assessed 15 minutes ago",
    poweredBy: "Powered by Kannamma AI",
    smartAlerts: "Smart Alerts",
    viewAll: "View all alerts",
    markRead: "Mark as read",
    dismiss: "Dismiss",
    nextANC: "Next ANC Visit",
    daysAway: "12 Days Away",
    appointmentDate: "June 15, 2025 · 10:30 AM",
    appointmentLocation: "City Maternity Hospital, Bengaluru",
    addCalendar: "Add to Calendar",
    getDirections: "Get Directions",
    whatToBring: "Pre-appointment checklist",
    healthTrends: "Health Trends",
    trendInsight: "Heart rate trending 3% higher than your baseline this week",
    timeRange7d: "7D",
    timeRange14d: "14D",
    timeRange30d: "30D",
    timeRangeTrimester: "Trimester",
    journal: "Maternal Journal",
    journalPlaceholder: "Document your experience today...",
    attachPhoto: "Attach Photo",
    saveEntry: "Save Entry",
    viewEntries: "View all entries",
    symptomTags: "Symptom Tags",
    moodTrends: "Mood Trends",
    weeklySummary: "Weekly Summary",
    smartRing: "Kannamma Smart Ring",
    connected: "Connected — Monitoring Active",
    disconnected: "Disconnected",
    syncNow: "Sync Now",
    deviceStatus: "Device Status",
    babyJourney: "Fetal Development",
    maternalTimeline: "Maternal Timeline",
    growthChart: "Growth Chart",
    upcomingMilestones: "Upcoming Milestones",
    supportCircle: "Support Circle",
    shareVitals: "Share vitals with family",
    addFamily: "Add family member",
    privacyNote: "Only emergency alerts and summaries are shared. Detailed records remain private.",
    emergencySOS: "Emergency",
    holdToAlert: "Hold for 3 seconds to alert ASHA Worker + Hospital",
    alerting: "Alerting ASHA Worker Meena...",
    alertSent: "Alert dispatched — Response incoming",
    keepHolding: "Keep holding...",
    call: "Call",
    warningSignsTitle: "Warning Signs Reference",
    emergencyHistory: "Alert History",
    myRecords: "Medical Records",
    uploadArea: "Drop files here or click to upload",
    accepted: "PDF, JPG, PNG, DICOM accepted · Max 25MB",
    shareDoctor: "Share with Doctor",
    emergencyAccess: "Records auto-shared during emergency",
    quickAccess: "Quick Access",
    ashaWorker: "ASHA Worker: Meena",
    ringConnected: "Ring Connected",
    dashboard: "Dashboard",
    myHealth: "My Health",
    babyJourneyNav: "Baby Journey",
    appointments: "Appointments",
    journalNav: "Journal",
    records: "Records",
    emergency: "Emergency",
    moderate: "Moderate",
    calm: "Calm",
    hrs: "hrs",
    q1: "Did you eat well today?",
    q2: "Any dizziness or headache?",
    q3: "Did you feel fetal movement?",
    q4: "Any bleeding or unusual discharge?",
    q5: "How is your stress level?",
    yes: "Yes",
    no: "No",
    lessUsual: "Less than usual",
    noMovement: "No movement",
    okay: "Okay",
    stressed: "Stressed",
    telASHA: "Report this to your ASHA worker",
    noMovementAlert: "No movement detected — contact your doctor immediately",
    sosAlert: "Requires immediate attention — use Emergency SOS",
    breatheTip: "Try 4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s",
    ppgSensor: "PPG Sensor",
    tempSensor: "Temperature",
    motionSensor: "Motion",
    bleSensor: "BLE",
    active: "Active",
    signalStrong: "Signal Strong",
    battery: "Battery",
    lastSync: "Last Sync",
    bloodReports: "Blood Work",
    prescriptions: "Prescriptions",
    ancCards: "ANC Reports",
    scanReports: "Scans",
    all: "All",
    uploadProgress: "Uploading...",
    uploadSuccess: "Upload complete",
    scheduleNew: "Schedule New",
    visitPrep: "Visit Preparation",
    appointmentTimeline: "Visit History",
    todayOverview: "Today's Overview",
    vitalSigns: "Vital Signs",
    dailyCheckInStatus: "Daily Check-in",
    nextAppointment: "Next Appointment",
    completed: "Completed",
    pending: "Pending",
    daysCountdown: "days",
    supplements: "Supplements & Medications",
    taken: "Taken",
    missed: "Missed",
    upcoming: "Upcoming",
    adherenceRate: "Weekly Adherence",
    moodExcellent: "Excellent",
    moodGood: "Good",
    moodNeutral: "Neutral",
    moodLow: "Low",
    moodDistressed: "Distressed",
    predominantMood: "Predominant mood this week",
    commonSymptoms: "Common symptoms",
    nausea: "Nausea",
    fatigue: "Fatigue",
    anxiety: "Anxiety",
    backPain: "Back Pain",
    insomnia: "Insomnia",
    swelling: "Swelling",
    heartburn: "Heartburn",
    cramps: "Cramps",
    emergencyContacts: "Emergency Contacts",
    warningSigns: "Warning Signs",
    heavyBleeding: "Heavy vaginal bleeding",
    severeHeadache: "Severe headache or vision changes",
    highFever: "High fever (above 38°C)",
    severeAbdominal: "Severe abdominal pain",
    reducedMovement: "Significantly reduced fetal movement",
    breathingDifficulty: "Difficulty breathing",
    suddenSwelling: "Sudden swelling of face or hands",
    callImmediately: "Call immediately if you experience any of these symptoms",
    goToHospital: "Go directly to hospital for",
    callASHA: "Contact ASHA worker for",
    estimatedWeight: "Est. Weight",
    crownRumpLength: "Crown-Rump Length",
    percentile: "Percentile",
    developingSystems: "Developing Systems",
    fetalGrowthChart: "Fetal Growth Curve",
    whoReference: "WHO Reference Percentiles",
  },
  hi: {
    greeting: "सुप्रभात, प्रिया",
    greetingSub: "ग्रेविडा 1 · सप्ताह 28 · अनुमानित डिलीवरी 12 सित. 2025",
    wellnessTitle: "स्वास्थ्य सूचकांक",
    wellnessScore: "82",
    sleep: "नींद",
    activity: "गतिविधि",
    mood: "मनोदशा",
    heartRate: "हृदय गति",
    spo2: "SpO₂",
    temperature: "तापमान",
    bloodPressure: "रक्तचाप",
    ringBattery: "रिंग बैटरी",
    normal: "सामान्य",
    optimal: "उत्तम",
    elevated: "बढ़ा हुआ",
    critical: "गंभीर",
    monitor: "निगरानी",
    bpm: "BPM",
    daysRemaining: "~7 दिन शेष",
    lastSynced: "2 मिनट पहले सिंक हुआ",
    weekOf: "सप्ताह 28 / 40",
    thirdTrimester: "तीसरी तिमाही",
    daysUntilDue: "अनुमानित डिलीवरी तक 84 दिन",
    dueDate: "12 सितम्बर, 2025",
    currentWeekDev: "शिशु लंबाई 37.6 सेमी · अनुमानित वज़न 1,005 ग्राम",
    fetalNote: "मस्तिष्क तेज़ी से विकसित हो रहा है। आँखें खुल और बंद हो सकती हैं। श्रवण पूर्ण विकसित।",
    dailyCheckIn: "दैनिक जाँच",
    checkInSub: "5 नैदानिक प्रश्न — 30 सेकंड",
    checkInComplete: "जाँच पूरी। आशा कार्यकर्ता को सूचित किया गया।",
    aiRisk: "AI जोखिम मूल्यांकन",
    lowRisk: "कम जोखिम",
    riskReadings: "आज 847 रीडिंग के आधार पर",
    bpTrend: "रक्तचाप प्रवृत्ति",
    bpStatus: "स्थिर",
    sleepQuality: "नींद की गुणवत्ता",
    sleepStatus: "लक्ष्य से नीचे",
    activityLevel: "गतिविधि स्तर",
    activityStatus: "मध्यम",
    nutritionStatus: "पोषण स्थिति",
    nutritionValue: "पर्याप्त",
    lastAssessed: "15 मिनट पहले मूल्यांकित",
    poweredBy: "कन्नम्मा AI द्वारा",
    smartAlerts: "स्मार्ट अलर्ट",
    viewAll: "सभी अलर्ट देखें",
    nextANC: "अगली ANC विज़िट",
    daysAway: "12 दिन बाकी",
    appointmentDate: "15 जून, 2025 · सुबह 10:30",
    appointmentLocation: "सिटी मैटरनिटी हॉस्पिटल, बेंगलुरु",
    addCalendar: "कैलेंडर में जोड़ें",
    getDirections: "दिशा-निर्देश",
    whatToBring: "विज़िट से पहले चेकलिस्ट",
    healthTrends: "स्वास्थ्य प्रवृत्ति",
    journal: "मातृ डायरी",
    journalPlaceholder: "आज का अनुभव दर्ज करें...",
    smartRing: "कन्नम्मा स्मार्ट रिंग",
    connected: "कनेक्टेड — निगरानी चालू",
    syncNow: "अभी सिंक करें",
    babyJourney: "शिशु विकास",
    supportCircle: "सहायता समूह",
    shareVitals: "परिवार के साथ स्वास्थ्य डेटा साझा करें",
    addFamily: "परिवार का सदस्य जोड़ें",
    privacyNote: "केवल आपातकालीन अलर्ट और सारांश साझा होता है। विस्तृत रिकॉर्ड निजी हैं।",
    emergencySOS: "आपातकालीन",
    holdToAlert: "ASHA + अस्पताल को सूचित करने के लिए 3 सेकंड दबाएं",
    alerting: "आशा कार्यकर्ता मीना को सूचित कर रही हैं...",
    alertSent: "अलर्ट भेजा — सहायता आ रही है",
    keepHolding: "दबाए रखें...",
    call: "कॉल",
    myRecords: "मेरे रिकॉर्ड",
    uploadArea: "फ़ाइलें अपलोड करने के लिए यहाँ छोड़ें या क्लिक करें",
    accepted: "PDF, JPG, PNG, DICOM स्वीकृत · अधिकतम 25MB",
    shareDoctor: "डॉक्टर के साथ साझा करें",
    emergencyAccess: "आपातकालीन स्थिति में रिकॉर्ड स्वतः साझा होते हैं",
    ashaWorker: "आशा कार्यकर्ता: मीना",
    ringConnected: "रिंग कनेक्टेड",
    dashboard: "डैशबोर्ड",
    myHealth: "मेरा स्वास्थ्य",
    babyJourneyNav: "शिशु यात्रा",
    appointments: "अपॉइंटमेंट",
    journalNav: "डायरी",
    records: "रिकॉर्ड",
    emergency: "आपातकालीन",
    moderate: "मध्यम",
    calm: "शांत",
    hrs: "घंटे",
    q1: "क्या आपने आज अच्छा खाना खाया?",
    q2: "चक्कर या सिरदर्द?",
    q3: "क्या आपने शिशु की हलचल महसूस की?",
    q4: "कोई रक्तस्राव या असामान्य स्राव?",
    q5: "आपका तनाव स्तर कैसा है?",
    yes: "हाँ",
    no: "नहीं",
    lessUsual: "सामान्य से कम",
    noMovement: "कोई हलचल नहीं",
    okay: "ठीक",
    stressed: "तनावपूर्ण",
    telASHA: "कृपया अपनी आशा कार्यकर्ता को बताएं",
    noMovementAlert: "हलचल नहीं — तुरंत डॉक्टर से संपर्क करें",
    sosAlert: "तुरंत ध्यान देने की ज़रूरत — आपातकालीन SOS दबाएं",
    breatheTip: "4-7-8 श्वास: 4s साँस लें, 7s रोकें, 8s छोड़ें",
    ppgSensor: "PPG सेंसर",
    tempSensor: "तापमान",
    motionSensor: "मोशन",
    bleSensor: "BLE",
    active: "सक्रिय",
    signalStrong: "सिग्नल मजबूत",
    battery: "बैटरी",
    lastSync: "अंतिम सिंक",
    bloodReports: "रक्त रिपोर्ट",
    prescriptions: "प्रिस्क्रिप्शन",
    ancCards: "ANC रिपोर्ट",
    scanReports: "स्कैन रिपोर्ट",
    all: "सभी",
    vitalSigns: "प्राणाधार चिह्न",
    todayOverview: "आज का सारांश",
    emergencyContacts: "आपातकालीन संपर्क",
    moodExcellent: "उत्कृष्ट",
    moodGood: "अच्छा",
    moodNeutral: "सामान्य",
    moodLow: "कम",
    moodDistressed: "व्यथित",
  },
  kn: {
    greeting: "ಶುಭೋದಯ, ಪ್ರಿಯಾ",
    greetingSub: "ಗ್ರಾವಿಡಾ 1 · ವಾರ 28 · ಅಂದಾಜು ಹೆರಿಗೆ ಸೆಪ್ 12, 2025",
    wellnessTitle: "ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ",
    sleep: "ನಿದ್ರೆ",
    activity: "ಚಟುವಟಿಕೆ",
    mood: "ಮನಸ್ಥಿತಿ",
    heartRate: "ಹೃದಯ ಬಡಿತ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    emergency: "ತುರ್ತು",
    emergencySOS: "ತುರ್ತು",
    normal: "ಸಾಮಾನ್ಯ",
    myHealth: "ನನ್ನ ಆರೋಗ್ಯ",
    babyJourneyNav: "ಶಿಶು ಪ್ರಯಾಣ",
    appointments: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್",
    journalNav: "ಡೈರಿ",
    records: "ದಾಖಲೆಗಳು",
  },
  ta: {
    greeting: "காலை வணக்கம், பிரியா",
    greetingSub: "கிராவிடா 1 · வாரம் 28 · மதிப்பிடப்பட்ட பிரசவம் செப் 12, 2025",
    wellnessTitle: "ஆரோக்கிய குறியீடு",
    sleep: "தூக்கம்",
    activity: "செயல்பாடு",
    mood: "மனநிலை",
    heartRate: "இதய துடிப்பு",
    dashboard: "டாஷ்போர்டு",
    emergency: "அவசரநிலை",
    emergencySOS: "அவசர",
    normal: "இயல்பான",
    myHealth: "என் ஆரோக்கியம்",
    babyJourneyNav: "குழந்தை பயணம்",
    appointments: "சந்திப்புகள்",
    journalNav: "டைரி",
    records: "பதிவுகள்",
  },
};

// Helper to get translated text with fallback to English
export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// ── MOCK DATA ──────────────────────────────

export const heartRateData: VitalReading[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  value: Math.round(72 + Math.sin(i * 0.5) * 3 + Math.random() * 2),
}));

export const weeklyHeartRate: WeeklyReading[] = [
  { day: "Mon", value: 74 }, { day: "Tue", value: 72 }, { day: "Wed", value: 76 },
  { day: "Thu", value: 73 }, { day: "Fri", value: 75 }, { day: "Sat", value: 74 },
  { day: "Sun", value: 73 },
];

export const weeklyWeight: WeeklyReading[] = [
  { day: "Mon", value: 62.1 }, { day: "Tue", value: 62.3 }, { day: "Wed", value: 62.2 },
  { day: "Thu", value: 62.5 }, { day: "Fri", value: 62.8 }, { day: "Sat", value: 63.0 },
  { day: "Sun", value: 63.2 },
];

export const weeklySleep: WeeklyReading[] = [
  { day: "Mon", value: 6.5 }, { day: "Tue", value: 7.0 }, { day: "Wed", value: 5.5 },
  { day: "Thu", value: 7.5 }, { day: "Fri", value: 6.0 }, { day: "Sat", value: 7.2 },
  { day: "Sun", value: 6.8 },
];

export const weeklyActivity: WeeklyReading[] = [
  { day: "Mon", value: 4200 }, { day: "Tue", value: 5100 }, { day: "Wed", value: 3800 },
  { day: "Thu", value: 4500 }, { day: "Fri", value: 5300 }, { day: "Sat", value: 6100 },
  { day: "Sun", value: 3500 },
];

export const fetusMilestones: FetusMetrics[] = [
  { week: 8, crownRumpLength: "1.6 cm", estimatedWeight: "1 g", percentile: 50, developingSystems: ["Heart", "Brain", "Spinal cord"], milestone: "All major organs beginning to form", clinicalNote: "Cardiac activity detectable via ultrasound" },
  { week: 12, crownRumpLength: "5.4 cm", estimatedWeight: "14 g", percentile: 52, developingSystems: ["Fingers", "Toes", "Reflexes", "Digestive system"], milestone: "Reflexes developing, can make fists", clinicalNote: "Nuchal translucency scan window" },
  { week: 16, crownRumpLength: "11.6 cm", estimatedWeight: "100 g", percentile: 48, developingSystems: ["Muscles", "Bones", "Skin", "Reproductive system"], milestone: "Facial expressions possible", clinicalNote: "Quadruple marker test window" },
  { week: 20, crownRumpLength: "16.5 cm", estimatedWeight: "300 g", percentile: 55, developingSystems: ["Hair", "Nails", "Nervous system", "Sensory organs"], milestone: "Mother can feel fetal movement", clinicalNote: "Anomaly scan recommended (18-22 weeks)" },
  { week: 24, crownRumpLength: "30 cm", estimatedWeight: "600 g", percentile: 50, developingSystems: ["Lungs", "Inner ear", "Taste buds", "Vestibular system"], milestone: "Lungs developing, responds to sound", clinicalNote: "Viability threshold. GDM screening recommended" },
  { week: 28, crownRumpLength: "37.6 cm", estimatedWeight: "1,005 g", percentile: 53, developingSystems: ["Brain (rapid growth)", "Hearing (complete)", "Eyes (open/close)", "Immune system"], milestone: "Brain developing rapidly. Eyes open and close.", clinicalNote: "Hearing fully developed. Anti-D if Rh-negative. Tdap vaccine window" },
  { week: 32, crownRumpLength: "42.4 cm", estimatedWeight: "1,700 g", percentile: 51, developingSystems: ["Lungs (surfactant)", "Bones (hardening)", "Fat layers", "Temperature regulation"], milestone: "Practicing breathing movements", clinicalNote: "Growth scan recommended. Head may engage" },
  { week: 36, crownRumpLength: "47.4 cm", estimatedWeight: "2,600 g", percentile: 49, developingSystems: ["Immune system", "Lungs (mature)", "Brain (myelination)", "Liver"], milestone: "Head may engage in pelvis", clinicalNote: "Weekly visits begin. GBS screening (35-37 weeks)" },
  { week: 40, crownRumpLength: "51.2 cm", estimatedWeight: "3,400 g", percentile: 50, developingSystems: ["All systems mature", "Ready for delivery"], milestone: "Full term — all systems ready", clinicalNote: "Full term. Induction discussed if no spontaneous labor by 41 weeks" },
];

export const journalEntries: JournalEntry[] = [
  { id: "j1", date: "May 18, 2025", mood: "excellent", text: "Felt strong fetal movement while listening to music. Partner was excited to feel it too. Very reassuring day.", symptoms: ["Back Pain"] },
  { id: "j2", date: "May 16, 2025", mood: "good", text: "Walked in the park. Good energy levels. Had a productive day and managed all supplement doses on time.", symptoms: [] },
  { id: "j3", date: "May 14, 2025", mood: "low", text: "Poor sleep quality. Persistent lower back pain. Need to discuss positioning options at next visit.", symptoms: ["Back Pain", "Insomnia", "Fatigue"] },
];

export const alertsData: AlertItem[] = [
  { id: "a1", type: "green", title: "Iron supplement reminder", description: "Take with your evening meal for better absorption", time: "2 hours ago", iconType: "pill" },
  { id: "a2", type: "yellow", title: "Hydration below target", description: "Current intake: 1.4L / 2.5L recommended", time: "4 hours ago", iconType: "droplets" },
  { id: "a3", type: "green", title: "ANC Visit in 12 days", description: "City Maternity Hospital, Bengaluru", time: "Scheduled", iconType: "calendar" },
  { id: "a4", type: "green", title: "Folic acid — taken", description: "Morning dose logged at 8:15 AM", time: "8 hours ago", iconType: "check" },
  { id: "a5", type: "yellow", title: "Reduced activity detected", description: "1,200 steps below your 7-day average", time: "1 day ago", iconType: "activity" },
];

export const familyMembers: FamilyMember[] = [
  { name: "Rajesh", relation: "Husband", verified: true, canReceiveAlerts: true },
  { name: "Savitha", relation: "Mother-in-law", verified: true, canReceiveAlerts: true },
];

export const mockRecords: MedicalRecord[] = [
  { id: "r1", name: "Complete Blood Count.pdf", date: "May 10, 2025", category: "blood", size: "1.2 MB" },
  { id: "r2", name: "Ultrasound Report W24.pdf", date: "Apr 28, 2025", category: "scan", size: "3.8 MB" },
  { id: "r3", name: "Iron Prescription.pdf", date: "May 5, 2025", category: "prescription", size: "0.4 MB" },
  { id: "r4", name: "ANC Card — Visit 6.jpg", date: "Mar 15, 2025", category: "anc", size: "2.1 MB" },
  { id: "r5", name: "GDM Screening Report.pdf", date: "Apr 15, 2025", category: "blood", size: "0.8 MB" },
  { id: "r6", name: "Thyroid Panel.pdf", date: "Feb 20, 2025", category: "blood", size: "0.6 MB" },
];

export const checkInQuestions: CheckInQuestion[] = [
  { id: 1, question: "q1", options: [{ label: "yes", value: "yes" }, { label: "no", value: "no" }] },
  { id: 2, question: "q2", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes", alert: "telASHA" }] },
  { id: 3, question: "q3", options: [{ label: "yes", value: "yes" }, { label: "lessUsual", value: "less" }, { label: "noMovement", value: "none", alert: "noMovementAlert" }] },
  { id: 4, question: "q4", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes", alert: "sosAlert" }] },
  { id: 5, question: "q5", options: [{ label: "calm", value: "calm" }, { label: "okay", value: "okay" }, { label: "stressed", value: "stressed", alert: "breatheTip" }] },
];

export const appointmentHistory: AppointmentRecord[] = [
  { id: "apt1", date: "Mar 15, 2025", time: "10:00 AM", doctor: "Dr. Lakshmi", specialization: "OB-GYN", location: "City Maternity Hospital", type: "ANC Visit 4", status: "completed", notes: "All vitals normal. Prescribed iron supplements." },
  { id: "apt2", date: "Apr 15, 2025", time: "11:00 AM", doctor: "Dr. Lakshmi", specialization: "OB-GYN", location: "City Maternity Hospital", type: "ANC Visit 5 + GDM Screening", status: "completed", notes: "GDM screening negative. Weight gain on track." },
  { id: "apt3", date: "May 5, 2025", time: "10:30 AM", doctor: "Dr. Lakshmi", specialization: "OB-GYN", location: "City Maternity Hospital", type: "ANC Visit 6", status: "completed", notes: "Growth scan done. Fetal weight 52nd percentile. Tdap administered." },
  { id: "apt4", date: "Jun 15, 2025", time: "10:30 AM", doctor: "Dr. Lakshmi", specialization: "OB-GYN", location: "City Maternity Hospital, Bengaluru", type: "ANC Visit 7", status: "upcoming", checklist: ["Previous ANC card", "Blood test reports", "Ultrasound reports", "Insurance card", "List of questions"] },
  { id: "apt5", date: "Jul 1, 2025", time: "9:00 AM", doctor: "Dr. Srinivas", specialization: "Radiologist", location: "City Maternity Hospital", type: "Growth Scan", status: "upcoming" },
];

export const emergencyContacts: EmergencyContact[] = [
  { name: "Meena", role: "ASHA Worker", phone: "+91-98XXX-XXXXX", priority: 1, available: true },
  { name: "Dr. Lakshmi", role: "OB-GYN", phone: "+91-97XXX-XXXXX", priority: 2, available: true },
  { name: "108", role: "Emergency Ambulance", phone: "108", priority: 3, available: true },
  { name: "Rajesh", role: "Husband", phone: "+91-96XXX-XXXXX", priority: 4, available: true },
  { name: "Savitha", role: "Mother-in-law", phone: "+91-95XXX-XXXXX", priority: 5, available: true },
];

export const maternalTimeline: TimelineEvent[] = [
  { week: 8, type: "scan", title: "Dating Scan", description: "Confirmed viable pregnancy. EDD established.", status: "completed", date: "Jan 20, 2025" },
  { week: 12, type: "test", title: "NT Scan + Dual Marker", description: "Nuchal translucency normal. Low risk for chromosomal abnormalities.", status: "completed", date: "Feb 17, 2025" },
  { week: 16, type: "visit", title: "ANC Visit 3", description: "Routine check. All parameters normal.", status: "completed", date: "Mar 3, 2025" },
  { week: 20, type: "scan", title: "Anomaly Scan", description: "Detailed anatomy survey — all normal.", status: "completed", date: "Mar 31, 2025" },
  { week: 24, type: "test", title: "GDM Screening", description: "Oral glucose tolerance test — negative.", status: "completed", date: "Apr 15, 2025" },
  { week: 28, type: "milestone", title: "Current Week", description: "Third trimester begins. Tdap vaccine administered. Anti-D given.", status: "current", date: "May 19, 2025" },
  { week: 32, type: "scan", title: "Growth Scan", description: "Estimated fetal weight, amniotic fluid index, placental position.", status: "upcoming", date: "Jun 16, 2025" },
  { week: 36, type: "test", title: "GBS Screening", description: "Group B Streptococcus test. Weekly visits begin.", status: "upcoming", date: "Jul 14, 2025" },
  { week: 38, type: "visit", title: "Pre-delivery Assessment", description: "Birth plan discussion. Hospital bag review.", status: "upcoming", date: "Jul 28, 2025" },
  { week: 40, type: "milestone", title: "Estimated Delivery Date", description: "Full term. Induction discussed if no spontaneous labor.", status: "upcoming", date: "Sep 12, 2025" },
];

export const supplements: SupplementItem[] = [
  { name: "Folic Acid", dosage: "5 mg", schedule: "Morning", takenToday: true },
  { name: "Iron + Vitamin C", dosage: "100 mg + 500 mg", schedule: "Evening with meal", takenToday: false, nextDue: "7:00 PM" },
  { name: "Calcium", dosage: "500 mg", schedule: "Afternoon", takenToday: true },
  { name: "Vitamin D3", dosage: "1000 IU", schedule: "Morning", takenToday: true },
  { name: "DHA Omega-3", dosage: "200 mg", schedule: "Evening", takenToday: false, nextDue: "7:00 PM" },
];

export const warningSignsList = [
  { symptom: "Heavy vaginal bleeding", severity: "critical" as const, action: "hospital" },
  { symptom: "Severe headache with vision changes", severity: "critical" as const, action: "hospital" },
  { symptom: "High fever (above 38°C)", severity: "critical" as const, action: "hospital" },
  { symptom: "Severe abdominal pain", severity: "critical" as const, action: "hospital" },
  { symptom: "Significantly reduced fetal movement", severity: "warning" as const, action: "doctor" },
  { symptom: "Sudden swelling of face or hands", severity: "warning" as const, action: "doctor" },
  { symptom: "Difficulty breathing", severity: "critical" as const, action: "hospital" },
  { symptom: "Persistent vomiting", severity: "warning" as const, action: "asha" },
  { symptom: "Painful urination or reduced output", severity: "warning" as const, action: "asha" },
  { symptom: "Leaking fluid from vagina", severity: "critical" as const, action: "hospital" },
];

export const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  kn: "ಕನ್ನಡ",
  ta: "தமிழ்",
};

export const moodLabels: Record<MoodLevel, { key: string; color: string }> = {
  excellent: { key: "moodExcellent", color: "#34D399" },
  good: { key: "moodGood", color: "#60A5FA" },
  neutral: { key: "moodNeutral", color: "#A78BFA" },
  low: { key: "moodLow", color: "#FBBF24" },
  distressed: { key: "moodDistressed", color: "#EF4444" },
};

export const symptomOptions = [
  "Nausea", "Fatigue", "Anxiety", "Back Pain",
  "Insomnia", "Swelling", "Heartburn", "Cramps",
];
