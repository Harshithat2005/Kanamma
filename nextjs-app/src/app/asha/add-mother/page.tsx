'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  X,
  FileCheck,
  UserPlus,
  Loader2
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { useLanguage } from '../components/LanguageContext';
import { useOffline } from '../components/OfflineContext';
import Waveform from '../components/Waveform';
import { voiceNLPSamples, Language } from '../data';

export default function AshaAddMother() {
  const { t, lang } = useLanguage();
  const { addMotherOffline, isOffline } = useOffline();

  // Wizard state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [riskResult, setRiskResult] = useState<{
    riskLevel: string;
    highRiskProbability: number;
    midRiskProbability: number;
    lowRiskProbability: number;
  } | null>(null);

  // Form Field State
  const [formData, setFormData] = useState({
  name: '',
  age: '',
  husbandName: '',
  phone: '',
  altPhone: '',
  address: '',
  village: '',
  district: 'Bengaluru Rural',
  aadhaar: '',
  week: '20',
  gravida: '1',
  prevHistory: 'None',
  lmp: '2025-01-10',
  nextANC: '2025-06-15',
  existingConditions: 'None',

  bloodGroup: 'O+',
  hbLevel: '11.5',
  bp: '120/80',
  weight: '60',

  bloodSugar: '8.5',
  bodyTemp: '98.6',
  heartRate: '90',

  diabetes: 'No',
  emergencyContact: '',
  nearestHospital: 'Hosur PHC',
  assignedDoctor: 'Dr. Lakshmi (OB-GYN)',
  transportAvailable: true,
  prescriptions: '',
});

  // Voice Interaction States
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);
  const [listeningState, setListeningState] = useState<'idle' | 'listening' | 'processing' | 'success'>('idle');
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [transcribedText, setTranscribedText] = useState('');

  const triggerVoiceInput = (fieldName: string) => {
    setActiveVoiceField(fieldName);
    setListeningState('listening');
    setTranscribedText('');
    setVoiceConfidence(null);

    // Timeline simulation:
    // 1. Listen for 2.5s (waveform animates)
    // 2. Process for 1.2s (loading spinner)
    // 3. Fill text & show confidence score (success state)
    setTimeout(() => {
      setListeningState('processing');
      
      setTimeout(() => {
        // Resolve field mappings based on selected regional language translations
        const samples = voiceNLPSamples[lang as Language] || voiceNLPSamples.en;
        let speechOutput = '';
        
        switch (fieldName) {
          case 'name':
            speechOutput = samples.name;
            break;
          case 'age':
            speechOutput = samples.age;
            break;
          case 'husbandName':
            speechOutput = samples.husband;
            break;
          case 'phone':
            speechOutput = samples.phone;
            break;
          case 'address':
            speechOutput = samples.address;
            break;
          case 'village':
            speechOutput = samples.village;
            break;
          default:
            speechOutput = 'Demo Input';
        }

        setTranscribedText(speechOutput);
        setListeningState('success');
        setVoiceConfidence(Math.round(88 + Math.random() * 11));

        setFormData((prev) => ({
          ...prev,
          [fieldName]: speechOutput,
        }));
      }, 1200);

    }, 2500);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDraft = () => {
    setIsSavedOffline(true);
    setTimeout(() => setIsSavedOffline(false), 3000);
  };

  const validateCurrentStep = () => {
    const requiredFieldsByStep: Record<number, string[]> = {
      1: ['name', 'age', 'husbandName', 'phone', 'aadhaar', 'village', 'address'],
      2: ['week', 'gravida', 'lmp', 'nextANC', 'existingConditions'],
      3: [
        'bloodGroup',
        'hbLevel',
        'bp',
        'weight',
        'bloodSugar',
        'bodyTemp',
        'heartRate',
        'prescriptions',
      ],
      4: ['emergencyContact', 'nearestHospital', 'assignedDoctor'],
    };

    const missing = requiredFieldsByStep[step]?.filter(
      (field) => String(formData[field as keyof typeof formData]).trim() === ''
    );

    if (missing && missing.length > 0) {
      setSubmitError('Please complete all required fields before continuing.');
      return false;
    }

    if (step === 1 && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setSubmitError('Please enter a valid 10-digit phone number.');
      return false;
    }

    if (step === 1 && !/^\d{4}-\d{4}-\d{4}$/.test(formData.aadhaar)) {
      setSubmitError('Please enter Aadhaar in the format XXXX-XXXX-XXXX.');
      return false;
    }

    if (step === 3) {
      const bpMatch = /^\s*\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\s*$/.test(formData.bp);

      if (!bpMatch) {
        setSubmitError('Please enter blood pressure in the format 120/80.');
        return false;
      }

      const numericFields = [
        ['Age', formData.age],
        ['Hb', formData.hbLevel],
        ['Weight', formData.weight],
        ['Blood Sugar', formData.bloodSugar],
        ['Body Temperature', formData.bodyTemp],
        ['Heart Rate', formData.heartRate],
      ];

      const invalidField = numericFields.find(
        ([, value]) => !Number.isFinite(Number(value))
      );

      if (invalidField) {
        setSubmitError(`${invalidField[0]} must be a valid number.`);
        return false;
      }
    }

    setSubmitError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setRiskResult(null);

    try {
      // Parse "120/80" into the two values required by the ML model.
      const [systolicBP, diastolicBP] = formData.bp
        .split('/')
        .map((value) => Number(value.trim()));

      const response = await fetch('/api/mothers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          phone: formData.phone,
          address: formData.address,
          village: formData.village,
          district: formData.district,
          bloodGroup: formData.bloodGroup,
          gravida: Number(formData.gravida),
          gestationalWeek: Number(formData.week),
          weight: Number(formData.weight),
          hbLevel: Number(formData.hbLevel),

          // Six inputs used by the Random Forest model.
          systolicBP,
          diastolicBP,
          bloodSugar: Number(formData.bloodSugar),
          bodyTemp: Number(formData.bodyTemp),
          heartRate: Number(formData.heartRate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register mother.');
      }

      if (result.riskAssessment) {
        setRiskResult({
          riskLevel: result.riskAssessment.riskLevel,
          highRiskProbability: Number(result.riskAssessment.highRiskProbability),
          midRiskProbability: Number(result.riskAssessment.midRiskProbability),
          lowRiskProbability: Number(result.riskAssessment.lowRiskProbability),
        });
      }

      // Keep the existing local ASHA state in sync.
      const apiRiskLevel = result.riskAssessment?.riskLevel || 'low risk';

      const uiRiskLevel =
        apiRiskLevel === 'high risk'
          ? 'red'
          : apiRiskLevel === 'mid risk'
            ? 'yellow'
            : 'green';

      const highProbability =
        Number(result.riskAssessment?.highRiskProbability || 0);

      addMotherOffline({
        name: result.mother.name,
        age: result.mother.age,
        week: Number(formData.week),
        husbandName: formData.husbandName,
        phone: formData.phone,
        altPhone: formData.altPhone,
        address: formData.address,
        village: formData.village,
        district: formData.district,
        aadhaar: formData.aadhaar,
        bloodGroup: formData.bloodGroup,
        hbLevel: Number(formData.hbLevel),
        riskLevel: uiRiskLevel,
        riskScore: Math.round(highProbability * 100),
        missedCheckins: 0,
        missedMedsCount: 0,
        nextANC: formData.nextANC,
        aiRiskExplanation: result.riskAssessment
          ? `Random Forest model classified this record as ${apiRiskLevel}.`
          : 'Mother record saved. AI risk assessment was unavailable.',
        emergencyContact: formData.emergencyContact,
        nearestHospital: formData.nearestHospital,
        assignedDoctor: formData.assignedDoctor,
        transportAvailable: formData.transportAvailable,
        prescriptions: formData.prescriptions
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      });

      setStep(5);
    } catch (error) {
      console.error('Mother registration error:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while registering the mother.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AshaShell>
      <div className="max-w-2xl mx-auto space-y-6 pb-12 relative">
        
        {/* ── STEP INDICATOR BAR ── */}
        {step <= 4 && (
          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center text-xs text-[#8A7A82] mb-3">
              <span className="font-semibold">ASHA Mother Onboarding Progress</span>
              <span className="font-mono font-bold text-[#C8877A]">Step {step} of 4</span>
            </div>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#C8877A]' : 'bg-[#F5E8E6]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── VOICE INPUT ACTIVE POPUP OVERLAY ── */}
        <AnimatePresence>
          {activeVoiceField && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2A1525]/45 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white border border-[#C8877A]/25 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
              >
                <div className="flex justify-between items-center border-b border-[#C8877A]/10 pb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C8877A]">
                    Multilingual Voice Recognition
                  </span>
                  <button
                    onClick={() => setActiveVoiceField(null)}
                    className="p-1 hover:bg-[#F5E8E6] rounded-full text-[#8A7A82]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {listeningState === 'listening' && (
                  <div className="space-y-4 py-3">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500 animate-pulse">
                      <Mic className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-[#2A1525]">{t('listening')}</p>
                    <p className="text-[10px] text-[#8A7A82]">ASHA/Mother can speak in regional languages</p>
                    <Waveform active={true} />
                  </div>
                )}

                {listeningState === 'processing' && (
                  <div className="space-y-3 py-4">
                    <Loader2 className="w-10 h-10 text-[#C8877A] mx-auto animate-spin" />
                    <p className="text-sm font-semibold text-[#2A1525]">{t('processingVoice')}</p>
                    <p className="text-[10px] text-[#8A7A82]">Translating regional dialects to medical fields...</p>
                  </div>
                )}

                {listeningState === 'success' && (
                  <div className="space-y-4 py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-[#4CAF9A]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#8A7A82]">Transcribed Input:</p>
                      <p className="text-lg font-serif font-bold text-[#2A1525]">&quot;{transcribedText}&quot;</p>
                    </div>
                    {voiceConfidence && (
                      <span className="text-[10px] bg-emerald-50 text-[#4CAF9A] font-semibold border border-emerald-100 px-2 py-1 rounded-full">
                        {t('confidence')}: {voiceConfidence}%
                      </span>
                    )}
                    <button
                      onClick={() => setActiveVoiceField(null)}
                      className="w-full bg-[#2A1525] hover:bg-[#C8877A] text-white py-2 rounded-xl text-xs font-semibold transition-all mt-2"
                    >
                      Confirm Entry
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SAVE DRAFT NOTIFICATION TOAST ── */}
        <AnimatePresence>
          {isSavedOffline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2A1525] text-white border border-[#C8877A]/20 px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Draft saved locally! Sync automatically triggers on connection.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FORM CONTAINER ── */}
        <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-6 shadow-sm">
          
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs">
                {submitError}
              </div>
            )}
            
            {/* ── SECTION 1: PERSONAL DETAILS ── */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-[#C8877A]/10 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#2A1525]">{t('secPersonal')}</h3>
                  <p className="text-xs text-[#8A7A82]">Core maternal identity and address descriptors</p>
                </div>

                <div className="space-y-4">
                  {/* Name field (with voice input) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter mother's full name"
                        className="w-full border border-[#C8877A]/20 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none focus:border-[#C8877A] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => triggerVoiceInput('name')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#C8877A]/10 hover:bg-[#C8877A]/25 text-[#C8877A] transition-all"
                        title={t('speakInput')}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Age and Husband */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Age (Years)</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="e.g. 26"
                          className="w-full border border-[#C8877A]/20 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => triggerVoiceInput('age')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#C8877A]/10 hover:bg-[#C8877A]/25 text-[#C8877A]"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Husband&apos;s Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.husbandName}
                          onChange={(e) => handleInputChange('husbandName', e.target.value)}
                          placeholder="Husband's name"
                          className="w-full border border-[#C8877A]/20 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => triggerVoiceInput('husbandName')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#C8877A]/10 hover:bg-[#C8877A]/25 text-[#C8877A]"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Primary mobile"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Aadhaar Card ID (Optional)</label>
                      <input
                        required
                        type="text"
                        value={formData.aadhaar}
                        onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Village / Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Village</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.village}
                          onChange={(e) => handleInputChange('village', e.target.value)}
                          placeholder="e.g. Hosur"
                          className="w-full border border-[#C8877A]/20 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => triggerVoiceInput('village')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#C8877A]/10 hover:bg-[#C8877A]/25 text-[#C8877A]"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Address</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Full local address"
                          className="w-full border border-[#C8877A]/20 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => triggerVoiceInput('address')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#C8877A]/10 hover:bg-[#C8877A]/25 text-[#C8877A]"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECTION 2: PREGNANCY INFORMATION ── */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-[#C8877A]/10 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#2A1525]">{t('secPregnancy')}</h3>
                  <p className="text-xs text-[#8A7A82]">Gestational metrics and previous history parameters</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Current Week</label>
                      <input
                        type="number"
                        required
                        value={formData.week}
                        onChange={(e) => handleInputChange('week', e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Gravida (Pregnancy count)</label>
                      <input
                        type="number"
                        required
                        value={formData.gravida}
                        onChange={(e) => handleInputChange('gravida', e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Last Menstrual Period (LMP)</label>
                      <input
                        type="date"
                        required
                        value={formData.lmp}
                        onChange={(e) => handleInputChange('lmp', e.target.value)}
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Estimated ANC Check-in Date</label>
                      <input
                        type="date"
                        required
                        value={formData.nextANC}
                        onChange={(e) => handleInputChange('nextANC', e.target.value)}
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Existing Obstetric Conditions / Complications</label>
                    <input
                      required
                      type="text"
                      value={formData.existingConditions}
                      onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                      placeholder="e.g. Hypertension, Hypothyroidism"
                      className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-2xl p-4">
                    <p className="text-xs font-bold text-[#2A1525]">AI Risk Assessment</p>
                    <p className="text-[10px] text-[#8A7A82] mt-1">
                      Risk level is calculated automatically from the six required
                      clinical inputs using the Kannamma Random Forest model.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECTION 3: MEDICAL INFORMATION ── */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-[#C8877A]/10 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#2A1525]">{t('secMedical')}</h3>
                  <p className="text-xs text-[#8A7A82]">Vital baselines and physiological lab values</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Blood Group</label>
                      <select
                        required
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm bg-white"
                      >
                        <option>A+</option><option>A-</option>
                        <option>B+</option><option>B-</option>
                        <option>O+</option><option>O-</option>
                        <option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Hemoglobin Level (Hb g/dL)</label>
                      <input
                        type="text"
                        required
                        value={formData.hbLevel}
                        onChange={(e) => handleInputChange('hbLevel', e.target.value)}
                        placeholder="e.g. 11.5"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Initial Blood Pressure (mmHg)</label>
                      <input
                        type="text"
                        required
                        value={formData.bp}
                        onChange={(e) => handleInputChange('bp', e.target.value)}
                        placeholder="e.g. 120/80"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Weight (Kg)</label>
                      <input
                        type="number"
                        required
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Blood Sugar (BS)</label>
                      <input type="number" step="0.1" required value={formData.bloodSugar}
                        onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                        placeholder="e.g. 8.5"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Body Temperature (°F)</label>
                      <input type="number" step="0.1" required value={formData.bodyTemp}
                        onChange={(e) => handleInputChange('bodyTemp', e.target.value)}
                        placeholder="e.g. 98.6"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Heart Rate (BPM)</label>
                      <input type="number" required value={formData.heartRate}
                        onChange={(e) => handleInputChange('heartRate', e.target.value)}
                        placeholder="e.g. 90"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Prescribed Medicines & Standard Dosage</label>
                    <textarea
                      required
                      value={formData.prescriptions}
                      onChange={(e) => handleInputChange('prescriptions', e.target.value)}
                      placeholder="e.g. Folic acid, Calcium carbonate (separate with comma)"
                      className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2 focus:outline-none text-sm h-16"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECTION 4: EMERGENCY & WARD SELECTIONS ── */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-[#C8877A]/10 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#2A1525]">{t('secEmergency')}</h3>
                  <p className="text-xs text-[#8A7A82]">ASHA mobilization and emergency response indicators</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Emergency Contact Name & Phone</label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="e.g. Rajesh Sharma (Husband) - +91-98450-11223"
                      className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Nearest Hospital/PHC Selected</label>
                      <input
                        type="text"
                        required
                        value={formData.nearestHospital}
                        onChange={(e) => handleInputChange('nearestHospital', e.target.value)}
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#2A1525] block">Assigned Doctor</label>
                      <input
                        type="text"
                        required
                        value={formData.assignedDoctor}
                        onChange={(e) => handleInputChange('assignedDoctor', e.target.value)}
                        className="w-full border border-[#C8877A]/20 rounded-xl px-4 py-2.5 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Transport switch */}
                  <div className="flex justify-between items-center bg-[#FEFAF8] border border-[#C8877A]/15 p-4 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-[#2A1525]">Emergency Transport Arrangements Pre-Verified</p>
                      <p className="text-[10px] text-[#8A7A82]">Confirm vehicle/ambulance has transport access to village sector</p>
                    </div>
                    <input
                      required
                      type="checkbox"
                      checked={formData.transportAvailable}
                      onChange={(e) => handleInputChange('transportAvailable', e.target.checked)}
                      className="w-5 h-5 accent-[#C8877A] cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── COMPLETION ROUTE (STEP 5) ── */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-[#4CAF9A] animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#2A1525]">Maternal Record Logged Successfully!</h3>
                  <p className="text-xs text-[#8A7A82] max-w-sm mx-auto">
                    {isOffline
                      ? 'The mother has been registered into the local offline database queue. Synced automatically once connection is restored.'
                      : 'The database record is live and available inside the mothers directory.'}
                  </p>
                </div>
                
                {riskResult && (
                  <div className="max-w-sm mx-auto bg-[#FEFAF8] border border-[#C8877A]/20 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#8A7A82]">AI Risk Assessment</span>
                      <span className="text-sm font-bold text-[#2A1525] capitalize">{riskResult.riskLevel}</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span>High Risk</span><span className="font-bold">{(riskResult.highRiskProbability * 100).toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span>Mid Risk</span><span className="font-bold">{(riskResult.midRiskProbability * 100).toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span>Low Risk</span><span className="font-bold">{(riskResult.lowRiskProbability * 100).toFixed(1)}%</span></div>
                    </div>
                    <p className="text-[10px] text-[#8A7A82] border-t border-[#C8877A]/10 pt-2">
                      Model output for research/demo purposes; not a clinical diagnosis.
                    </p>
                  </div>
                )}


                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                      name: '',
                      age: '',
                      husbandName: '',
                      phone: '',
                      altPhone: '',
                      address: '',
                      village: '',
                      district: 'Bengaluru Rural',
                      aadhaar: '',

                      week: '20',
                      gravida: '1',
                      prevHistory: 'None',
                      lmp: '2025-01-10',
                      nextANC: '2025-06-15',
                      existingConditions: 'None',

                      bloodGroup: 'O+',
                      hbLevel: '11.5',
                      bp: '120/80',
                      weight: '60',

                      bloodSugar: '8.5',
                      bodyTemp: '98.6',
                      heartRate: '90',

                      diabetes: 'No',
                      prescriptions: '',

                      emergencyContact: '',
                      nearestHospital: 'Hosur PHC',
                      assignedDoctor: 'Dr. Lakshmi (OB-GYN)',
                      transportAvailable: true,
                      });
                      setStep(1);
                    }}
                    className="border border-[#C8877A]/30 text-[#C8877A] px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#F5E8E6]/25 transition-all"
                  >
                    Register Another Mother
                  </button>
                  <Link
                    href="/asha/dashboard"
                    className="bg-[#2A1525] hover:bg-[#C8877A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── CONTROLS PANEL ── */}
            {step <= 4 && (
              <div className="border-t border-[#C8877A]/10 pt-4 flex justify-between items-center">
                {/* Back button */}
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    step === 1
                      ? 'text-[#8A7A82]/30 border-[#C8877A]/5'
                      : 'text-[#2A1525]/75 border-[#C8877A]/25 hover:bg-[#F5E8E6]/25'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('back')}</span>
                </button>

                {/* Save Draft Offline shortcut */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border border-dashed border-[#C8877A]/30 text-[#C8877A] hover:bg-[#F5E8E6]/10"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('saveOffline')}</span>
                </button>

                {/* Next / Submit */}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#2A1525] hover:bg-[#C8877A] text-[#FEFAF8] px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{t('next')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#C8877A] hover:bg-[#C8877A]/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#C8877A]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{t('submit')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </form>

        </div>

      </div>
    </AshaShell>
  );
}
