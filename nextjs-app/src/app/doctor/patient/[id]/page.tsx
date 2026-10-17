'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageContext';
import { useDoctorData } from '../../components/DoctorDataContext';
import {
  ArrowLeft,
  ShieldAlert,
  User,
  Heart,
  Calendar,
  Activity,
  Mic,
  MicOff,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { Language } from '../../data';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function PatientDossier({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  const {
    patients,
    reports,
    prescriptions,
    addObservation,
    triggerEmergencySOS
  } = useDoctorData();

  const [isMounted, setIsMounted] = useState(false);
  const [observationText, setObservationText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [dictationLanguage, setDictationLanguage] = useState<Language>(language);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosReason, setSosReason] = useState('');
  const [sosHospital, setSosHospital] = useState('City Maternity & District Hospital');

  // Load mount guard for Recharts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer simulation for dictation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const patient = patients.find((p) => p.id === params.id);
  if (!patient) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2A1525]">Patient Not Found</h2>
        <p className="text-sm text-[#2A1525]/60">The dossier ID does not match any registered mother.</p>
        <Link
          href="/doctor/queue"
          className="inline-flex items-center space-x-2 text-sm text-[#C8877A] font-bold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Triage Queue</span>
        </Link>
      </div>
    );
  }

  const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];
  const patientReports = reports.filter((r) => r.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);

  // Form submit for observation
  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) return;
    addObservation(patient.id, observationText.trim());
    setObservationText('');
  };

  // Mock voice transcription presets
  const mockTranscriptions: Record<string, string> = {
    en: 'Patient demonstrates moderate pedal edema. Urinalysis shows trace proteins (+1). Advised to continue daily BP tracking and double check lab report CBC indices. Schedule Doppler scan next week.',
    hi: 'मरीज में मध्यम पैर की सूजन देखी गई है। मूत्र विश्लेषण में प्रोटीन का स्तर (+1) पाया गया। दैनिक बीपी निगरानी जारी रखने और सीबीसी लैब रिपोर्ट की समीक्षा करने की सलाह दी। अगले सप्ताह डॉपलर स्कैन निर्धारित करें।',
    kn: 'ರೋಗಿಯಲ್ಲಿ ಸಾಧಾರಣ ಪಾದದ ಊತ ಕಂಡುಬಂದಿದೆ. ಮೂತ್ರ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪ್ರೋಟೀನ್ ಪತ್ತೆಯಾಗಿದೆ (+1). ದೈನಂದಿನ ಬಿಪಿ ಮೇಲ್ವಿಚಾರಣೆಯನ್ನು ಮುಂದುವರಿಸಲು ಮತ್ತು ಮುಂದಿನ ವಾರ ಡಾಪ್ಲರ್ ಸ್ಕ್ಯಾನ್ ನಿಗದಿಪಡಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.',
    ta: 'நோயாளிக்கு மிதமான கால் வீக்கம் உள்ளது. சிறுநீர் பரிசோதனையில் புரதம் (+1) கண்டறியப்பட்டுள்ளது. தினசரி பிபி கண்காணிப்பைத் தொடரவும், அடுத்த வாரம் டாப்ளர் ஸகேன் செய்யுமாறும் அறிவுறுத்தப்பட்டுள்ளது.',
    te: 'రోగిలో సాధారణ పాదాల వాపు ఉంది. మూత్ర విశ్లేషణలో ప్రొటీన్ (+1) కనుగొనబడింది. రోజువారీ బీపీ పర్యవేక్షణను కొనసాగించాలని మరియు వచ్చే వారం డాప్లర్ స్కాన్ షెడ్యూల్ చేయాలని సూచించబడింది.'
  };

  const handleStartDictation = () => {
    setIsRecording(true);
  };

  const handleStopDictation = () => {
    setIsRecording(false);
    // Grab corresponding translation text, fallback to english
    const transText = mockTranscriptions[dictationLanguage] || mockTranscriptions['en'];
    addObservation(patient.id, `[Voice Dictated - ${dictationLanguage.toUpperCase()}] ${transText}`);
  };

  const handleSOSSubmit = () => {
    if (!sosReason.trim()) return;
    triggerEmergencySOS(patient.id, sosReason, sosHospital);
    setShowSOSModal(false);
    setSosReason('');
  };

  return (
    <div className="space-y-6">
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-4 border-b border-[#C8877A]/10">
        <div className="flex items-center space-x-4">
          <Link
            href="/doctor/queue"
            className="p-2 border border-[#C8877A]/20 bg-[#FFFFFF] hover:bg-[#FEFAF8] text-[#2A1525] transition rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
                {patient.name}
              </h1>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  patient.riskLevel === 'red'
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : patient.riskLevel === 'yellow'
                    ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                    : 'bg-green-50 text-green-600 border border-green-100'
                }`}
              >
                {patient.riskLevel === 'red' ? 'Severe Risk' : patient.riskLevel === 'yellow' ? 'Moderate' : 'Normal'}
              </span>
            </div>
            <p className="text-xs text-[#2A1525]/60 font-medium mt-1">
              Mother Dossier ID: <span className="font-mono text-[#2A1525]">{patient.id}</span> • Registered Village: {patient.village}
            </p>
          </div>
        </div>

        {/* SOS Escalation Shortcut */}
        <button
          onClick={() => setShowSOSModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition text-xs font-bold rounded-lg flex items-center justify-center space-x-2 shadow-sm"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Escalate to Emergency SOS</span>
        </button>
      </div>

      {/* Maternal Profile grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Pregnancy Stage */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#C8877A]/10 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-[#FEFAF8] border border-[#C8877A]/10 text-[#C8877A] rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#2A1525]/50 font-bold tracking-wider block">Pregnancy Stage</span>
            <span className="text-lg font-serif font-bold text-[#2A1525]">Week {patient.week}</span>
            <span className="text-xs text-[#2A1525]/60 font-medium block">Trimester {patient.trimester}</span>
          </div>
        </div>

        {/* Card 2: Adherence */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#C8877A]/10 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-[#EDE4F5] border border-[#C4A8D4]/10 text-[#C4A8D4] rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#2A1525]/50 font-bold tracking-wider block">Supplement Adherence</span>
            <span className={`text-lg font-serif font-bold ${patient.complianceRate < 70 ? 'text-red-500' : 'text-green-600'}`}>
              {patient.complianceRate}%
            </span>
            <span className="text-xs text-[#2A1525]/60 font-medium block">Pill count compliance</span>
          </div>
        </div>

        {/* Card 3: Blood Group */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#C8877A]/10 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-lg">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#2A1525]/50 font-bold tracking-wider block">Blood Group Profile</span>
            <span className="text-lg font-serif font-bold text-[#2A1525]">{patient.bloodGroup}</span>
            <span className="text-xs text-[#2A1525]/60 font-medium block">Age: {patient.age} years</span>
          </div>
        </div>

        {/* Card 4: ASHA Liaison */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#C8877A]/10 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-[#FEFAF8] border border-[#C8877A]/10 text-[#C8877A] rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#2A1525]/50 font-bold tracking-wider block">Assigned ASHA Worker</span>
            <span className="text-sm font-bold text-[#2A1525] block truncate max-w-[130px]">{patient.assignedAshaName}</span>
            <span className="text-[10px] text-[#2A1525]/60 font-mono block">{patient.assignedAshaPhone}</span>
          </div>
        </div>
      </div>

      {/* Maternal Logistics & Clinical Vitals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Vitals Charting (Span 2) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A1525]">Clinical Vitals Monitoring</h3>
              <p className="text-xs text-[#2A1525]/60 font-medium mt-0.5">Chronological vitals logs recorded by ASHA and ANC centers</p>
            </div>
            {latestVitals && (
              <div className="flex items-center space-x-3 text-xs bg-[#FEFAF8] border border-[#C8877A]/15 px-3 py-1.5 rounded-lg">
                <span className="text-[#2A1525]/70">Latest Log:</span>
                <span className="font-bold text-[#2A1525]">{latestVitals.systolic}/{latestVitals.diastolic} mmHg</span>
                <span className="h-2 w-px bg-[#C8877A]/30" />
                <span className="font-bold text-[#2A1525]">{latestVitals.fhr} bpm FHR</span>
              </div>
            )}
          </div>

          {/* Vitals Cards */}
          {latestVitals && (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#FEFAF8] border border-[#C8877A]/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase text-[#2A1525]/60 font-semibold block">Blood Pressure</span>
                <span className={`text-sm font-bold ${latestVitals.systolic >= 140 ? 'text-red-600' : 'text-[#2A1525]'}`}>
                  {latestVitals.systolic}/{latestVitals.diastolic}
                </span>
                <span className="text-[9px] text-[#2A1525]/50 block mt-0.5">mmHg</span>
              </div>
              <div className="bg-[#FEFAF8] border border-[#C8877A]/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase text-[#2A1525]/60 font-semibold block">Oxygen SpO₂</span>
                <span className={`text-sm font-bold ${latestVitals.spo2 < 95 ? 'text-red-600' : 'text-[#2A1525]'}`}>
                  {latestVitals.spo2}%
                </span>
                <span className="text-[9px] text-[#2A1525]/50 block mt-0.5">Saturated O2</span>
              </div>
              <div className="bg-[#FEFAF8] border border-[#C8877A]/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase text-[#2A1525]/60 font-semibold block">Fetal Heart Rate</span>
                <span className={`text-sm font-bold ${latestVitals.fhr > 160 || latestVitals.fhr < 110 ? 'text-red-600' : 'text-[#2A1525]'}`}>
                  {latestVitals.fhr}
                </span>
                <span className="text-[9px] text-[#2A1525]/50 block mt-0.5">beats/min</span>
              </div>
              <div className="bg-[#FEFAF8] border border-[#C8877A]/10 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase text-[#2A1525]/60 font-semibold block">Maternal Weight</span>
                <span className="text-sm font-bold text-[#2A1525]">{latestVitals.weight}</span>
                <span className="text-[9px] text-[#2A1525]/50 block mt-0.5">kilograms</span>
              </div>
            </div>
          )}

          {/* Line Chart */}
          <div className="h-64 bg-[#FEFAF8]/50 border border-[#C8877A]/10 p-4 rounded-xl">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patient.vitalsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C8877A/10" vertical={false} />
                  <XAxis dataKey="date" stroke="#2A1525" style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <YAxis stroke="#2A1525" style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #C8877A/30', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="systolic" stroke="#C8877A" name="Systolic BP" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#C4A8D4" name="Diastolic BP" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="fhr" stroke="#C8385A" name="Fetal Heart Rate" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#2A1525]/40 italic">
                Loading clinical charting dashboard...
              </div>
            )}
          </div>
        </div>

        {/* Right: Maternal Details Summary */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2A1525]">Maternal Profile Dossier</h3>
            <p className="text-xs text-[#2A1525]/60 font-medium mt-0.5">Demographics and emergency contact registries</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-2 border-b border-[#C8877A]/5">
              <span className="text-[#2A1525]/60 font-medium">Husband/Partner</span>
              <span className="font-bold text-[#2A1525]">{patient.husbandName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C8877A]/5">
              <span className="text-[#2A1525]/60 font-medium">Phone Number</span>
              <span className="font-bold font-mono text-[#2A1525]">{patient.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C8877A]/5">
              <span className="text-[#2A1525]/60 font-medium">District Center</span>
              <span className="font-bold text-[#2A1525]">{patient.district}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C8877A]/5">
              <span className="text-[#2A1525]/60 font-medium">Next Scheduled Visit</span>
              <span className="font-bold text-[#C8877A]">{patient.nextVisitDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C8877A]/5">
              <span className="text-[#2A1525]/60 font-medium">Last App Check-in</span>
              <span className="font-bold text-[#2A1525]">{patient.lastCheckIn}</span>
            </div>
            <div>
              <span className="text-[#2A1525]/60 font-medium block mb-1">Maternal Address</span>
              <p className="p-2.5 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-lg text-[#2A1525]/80 font-medium italic leading-relaxed">
                {patient.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observations Log & Dictation Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Observations Feed & Voice dictation */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A1525]">{t('observations')}</h3>
              <p className="text-xs text-[#2A1525]/60 font-medium mt-0.5">Clinical notes, diagnostics log, and dictation outputs</p>
            </div>
          </div>

          {/* Voice Dictation Simulator */}
          <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-xl p-4.5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Mic className="h-4.5 w-4.5 text-[#C8877A]" />
                <span className="text-xs font-bold text-[#2A1525] uppercase tracking-wider">{t('dictation')}</span>
              </div>

              {/* Dictation Language Select */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#2A1525]/50 uppercase">Dictation Lang:</span>
                <select
                  value={dictationLanguage}
                  onChange={(e) => setDictationLanguage(e.target.value as Language)}
                  className="bg-white border border-[#C8877A]/20 px-2 py-1 rounded text-xs text-[#2A1525] focus:outline-none"
                  disabled={isRecording}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="kn">Kannada</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartDictation}
                  className="px-4 py-2.5 bg-[#C8877A] hover:bg-[#C8877A]/95 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition shadow-sm"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>{t('startRecording')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopDictation}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition shadow-sm animate-pulse"
                >
                  <MicOff className="h-3.5 w-3.5" />
                  <span>{t('stopRecording')} ({recordingTimer}s)</span>
                </button>
              )}

              {isRecording && (
                <div className="flex items-center space-x-2 text-xs text-red-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span>Dictating... Speak clearly near mic.</span>
                </div>
              )}
            </div>
          </div>

          {/* Observations Form */}
          <form onSubmit={handleAddObservation} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type clinical observation note or scan remarks..."
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              className="flex-1 bg-[#FEFAF8] text-xs p-3 border border-[#C8877A]/20 focus:outline-none focus:border-[#C8877A] rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#2A1525] text-white hover:bg-[#2A1525]/90 text-xs font-bold rounded-lg transition"
            >
              Add Note
            </button>
          </form>

          {/* Observations Feed list */}
          <div className="space-y-3.5">
            {patient.observations.map((obs, index) => (
              <div
                key={index}
                className="p-4 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-lg text-xs leading-relaxed text-[#2A1525]/90"
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-[#C8877A] font-bold uppercase tracking-wider mb-1.5">
                  <Clock className="h-3 w-3" />
                  <span>Observation log #{patient.observations.length - index}</span>
                </div>
                <p className="font-medium">{obs}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Prescriptions & Lab Checklist */}
        <div className="space-y-6">
          {/* Prescriptions */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2A1525]">Prescribed Regimen</h3>
              <Link
                href={`/doctor/prescriptions?patientId=${patient.id}`}
                className="text-xs font-bold text-[#C8877A] hover:underline"
              >
                Write New
              </Link>
            </div>

            {patientPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {patientPrescriptions.map((pr) => (
                  <div key={pr.id} className="text-xs space-y-2 p-3 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-lg">
                    <div className="flex items-center justify-between font-bold text-[#2A1525]">
                      <span>Prescription Date:</span>
                      <span className="font-mono text-[#2A1525]/70">{pr.date}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#2A1525]/80 font-medium">
                      {pr.medicines.map((m, idx) => (
                        <li key={idx} className="truncate">
                          {m.name} ({m.dosage}) - {m.duration}
                        </li>
                      ))}
                    </ul>
                    {pr.dietNotes && (
                      <p className="text-[10px] text-[#2A1525]/60 italic mt-1 border-t border-[#C8877A]/5 pt-1.5">
                        Diet: {pr.dietNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#2A1525]/40 italic">
                No prescriptions on record.
              </div>
            )}
          </div>

          {/* Reports checklist */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2A1525]">Diagnostics Registry</h3>
              <Link
                href="/doctor/reports"
                className="text-xs font-bold text-[#C8877A] hover:underline"
              >
                Review Desk
              </Link>
            </div>

            {patientReports.length > 0 ? (
              <div className="space-y-3">
                {patientReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4 text-[#C8877A]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#2A1525] truncate max-w-[120px]">{rep.fileName}</span>
                        <span className="text-[10px] text-[#2A1525]/50">{rep.date} • {rep.fileSize}</span>
                      </div>
                    </div>

                    <div>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : rep.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#2A1525]/40 italic">
                No diagnostics uploaded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#C8877A]/30 w-full max-w-md rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-bold text-red-600 flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
              <span>Confirm Critical SOS Escalation</span>
            </h3>
            <p className="text-xs text-[#2A1525]/60 font-medium mt-1">
              This initiates a medical emergency alert, dispatching a 108 ambulance escort and coordinates hospital arrival telemetry.
            </p>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider mb-1.5">
                  Emergency Referral Reason
                </label>
                <textarea
                  value={sosReason}
                  onChange={(e) => setSosReason(e.target.value)}
                  placeholder="e.g. Critical Blood Pressure Spike (160/105 mmHg) and visual disturbances indicating preeclampsia..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider mb-1.5">
                  Target Referral Destination
                </label>
                <input
                  type="text"
                  value={sosHospital}
                  onChange={(e) => setSosHospital(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="px-4 py-2 border border-[#C8877A]/20 text-xs font-bold text-[#2A1525]/70 rounded-lg hover:bg-[#FEFAF8] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSOSSubmit}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                >
                  Trigger SOS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
