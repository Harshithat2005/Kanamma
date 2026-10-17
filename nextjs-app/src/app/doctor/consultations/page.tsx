'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  Mic,
  MicOff,
  Save,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Language } from '../data';

export default function ConsultationsDesk() {
  const { t, language } = useLanguage();
  const { patients, consultations, addConsultationNote } = useDoctorData();

  const [selectedPatientId, setSelectedPatientId] = useState(
    patients.length > 0 ? patients[0].id : ''
  );
  const [noteText, setNoteText] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [followUpWeeks, setFollowUpWeeks] = useState(2);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [dictationLanguage, setDictationLanguage] = useState(language);
  const [successMsg, setSuccessMsg] = useState(false);

  // Filter consultations for selected patient
  const patientConsultations = consultations.filter((c) => c.patientId === selectedPatientId);
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Dictation timer
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

  const mockConsultationTranscriptions: Record<string, string> = {
    en: 'Review of gestational hypertension. Patient reports compliant Labetalol use. BP measured at 138/86 mmHg. FHR active at 142 bpm. Recommend double dose calcium supplements and returning for follow-up in two weeks.',
    hi: 'गर्भावधि उच्च रक्तचाप की समीक्षा। मरीज ने लॅबेटालॉल का नियमित उपयोग बताया है। रक्तचाप 138/86 एमएमएचजी दर्ज किया गया। भ्रूण हृदय गति 142 बीपीएम। दो सप्ताह में अनुवर्ती परामर्श के लिए आने की सलाह।',
    kn: 'ಗರ್ಭಾವಸ್ಥೆಯ ಅಧಿಕ ರಕ್ತದೊತ್ತಡದ ವಿಮರ್ಶೆ. ರೋಗಿಯು ಲ್ಯಾಬೆಟಾಲೋಲ್ ಅನ್ನು ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ. ಬಿಪಿ 138/86 mmHg ಆಗಿದೆ. ಭ್ರೂಣದ ಹೃದಯ ಬಡಿತ 142 ಬಿಪಿಎಂ ಆಗಿದೆ. ಎರಡು ವಾರಗಳಲ್ಲಿ ಮರು ಪರೀಕ್ಷೆಗೆ ಬರುವಂತೆ ಸೂಚಿಸಲಾಗಿದೆ.',
    ta: 'கர்ப்பகால உயர் இரத்த அழுத்தத்தின் மதிப்பாய்வு. நோயாளி லேபெட்டாலால் மாத்திரையைத் தவறாமல் உட்கொள்கிறார். பிபி அளவு 138/86 mmHg ஆக உள்ளது. கருவின் இதயத் துடிப்பு 142 bpm. இரண்டு வாரங்களில் மீண்டும் வர அறிவுறுத்தப்பட்டது.',
    te: 'గర్భధారణ అధిక రక్తపోటు సమీక్ష. రోగి లాబెటాలాల్ క్రమం తప్పకుండా వాడుతున్నారు. బీపీ 138/86 mmHg గా నమోదైంది. పిండం గుండె వేగం 142 bpm. రెండు వారాల తర్వాత తదుపరి పరీక్షకు రావాలని సూచించబడింది.'
  };

  const handleStartDictation = () => {
    setIsRecording(true);
  };

  const handleStopDictation = () => {
    setIsRecording(false);
    const transText = mockConsultationTranscriptions[dictationLanguage] || mockConsultationTranscriptions['en'];
    setNoteText(transText);
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !noteText.trim()) return;

    addConsultationNote(
      selectedPatientId,
      noteText.trim(),
      dictationLanguage,
      true, // voice Dictated
      recommendations.trim(),
      Number(followUpWeeks)
    );

    setSuccessMsg(true);
    setNoteText('');
    setRecommendations('');
    setFollowUpWeeks(2);

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
          {t('consultations')}
        </h1>
        <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
          Perform clinical checkups, use multilingual voice dictation, and schedule automatic ASHA follow-up routines
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="text-xs">
            <strong className="font-bold">Consultation Log Saved!</strong>
            <p className="mt-0.5 font-medium">
              The check-up details have been logged in the dossier and scheduled visit dates updated automatically.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: Form (Span 2) */}
        <form
          onSubmit={handleSubmitConsultation}
          className="lg:col-span-2 bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm p-6 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
                Select Active Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (GA: {p.week} wks) - {p.village}
                  </option>
                ))}
              </select>
            </div>

            {/* Follow-up intervals */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
                Follow-up Interval Routine
              </label>
              <select
                value={followUpWeeks}
                onChange={(e) => setFollowUpWeeks(Number(e.target.value))}
                className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
              >
                <option value={1}>1 Week (High Risk)</option>
                <option value={2}>2 Weeks (Routine Checkup)</option>
                <option value={4}>4 Weeks (First/Second Trimester)</option>
                <option value={6}>6 Weeks (Low Risk Follow-up)</option>
              </select>
            </div>
          </div>

          {/* Voice Dictation Block */}
          <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-xl p-4.5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 border-b border-[#C8877A]/10 pb-3">
              <div className="flex items-center space-x-2">
                <Mic className="h-4.5 w-4.5 text-[#C8877A]" />
                <span className="text-xs font-bold text-[#2A1525] uppercase tracking-wider">
                  Voice Dictation Transcriber
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[#2A1525]/50 uppercase">Language:</span>
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

            <div className="flex items-center space-x-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartDictation}
                  className="px-4 py-2.5 bg-[#C8877A] hover:bg-[#C8877A]/95 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Start Dictation</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopDictation}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition animate-pulse"
                >
                  <MicOff className="h-3.5 w-3.5" />
                  <span>Stop & Transcribe ({recordingTimer}s)</span>
                </button>
              )}

              {isRecording && (
                <span className="text-xs text-red-500 font-semibold animate-pulse">
                  Listening... Speaks details about BP, fetal movements and regimen compliance.
                </span>
              )}
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
              Consultation Notes Summary
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Clinical logs summary... Or click dictation to record notes automatically"
              className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
              required
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
              Specific Recommendations / Referrals
            </label>
            <textarea
              rows={2}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="e.g. Schedule double-iron dose supplement, routine CBC, restriction of dietary salt..."
              className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2A1525] text-white hover:bg-[#2A1525]/90 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save Consultation Log</span>
          </button>
        </form>

        {/* Right Column: History for selected Patient */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2A1525]">Check-up Records</h3>
            {activePatient && (
              <span className="text-[10px] text-[#2A1525]/60 font-semibold uppercase tracking-wider block mt-0.5">
                Past consults for {activePatient.name}
              </span>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {patientConsultations.length > 0 ? (
              patientConsultations.map((consult) => (
                <div
                  key={consult.id}
                  className="p-4 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#C8877A]/5 pb-1.5 text-[10px] text-[#C8877A] font-bold">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{consult.date}</span>
                    </span>
                    <span className="uppercase font-mono bg-[#C8877A]/10 px-1.5 rounded">
                      Lang: {consult.language.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#2A1525]/90 leading-relaxed font-medium">
                    {consult.notes}
                  </p>
                  {consult.recommendations && (
                    <div className="pt-2 border-t border-[#C8877A]/5 text-[11px] text-[#2A1525]/75">
                      <strong>Recs:</strong> {consult.recommendations}
                    </div>
                  )}
                  <div className="text-[9px] text-[#2A1525]/50 flex justify-between">
                    <span>Follow-up: {consult.followUpWeeks} Wks</span>
                    <span>{consult.voiceDictated ? '• Voice Dictated' : '• Type Log'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#2A1525]/40 italic">
                No past consultations recorded for this mother.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
