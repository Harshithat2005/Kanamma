'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Volume2,
  Database,
  Sliders,
  Languages,
  CheckCircle
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { useLanguage } from '../components/LanguageContext';
import { ashaProfile, Language } from '../data';

export default function AshaSettings() {
  const { lang, setLang } = useLanguage();

  // Vitals Thresholds state
  const [systolic, setSystolic] = useState(140);
  const [diastolic, setDiastolic] = useState(90);
  const [heartRate, setHeartRate] = useState(160);
  const [temperature, setTemperature] = useState(38.0);

  // Field helper modes
  const [narratorEnabled, setNarratorEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [cacheClearSuccess, setCacheClearSuccess] = useState(false);

  const handleClearCache = () => {
    setCacheClearSuccess(true);
    setTimeout(() => setCacheClearSuccess(false), 2500);
  };

  return (
    <AshaShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        
        {/* ── TOP BANNER ── */}
        <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-[#2A1525] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#C8877A]" /> System Settings & Vitals Controls
          </h3>
          <p className="text-xs text-[#8A7A82] mt-0.5">
            Configure maternal telemetry limits, adjust field accessibility options, and manage local storage allocations.
          </p>
        </div>

        {/* ── CENTRAL SETTINGS CONTAINER ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT: ASHA WORKER CARD & ACCESS PREF */}
          <div className="md:col-span-1 space-y-6">
            {/* ASHA Profile Card */}
            <div className="bg-[#2A1525] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#C8877A]/10 rounded-full blur-xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center text-xs font-bold text-[#2A1525] shrink-0">
                  {ashaProfile.avatarText}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#FEFAF8]">{ashaProfile.name}</p>
                  <p className="text-[10px] text-[#D8A48F] font-mono">{ashaProfile.id}</p>
                </div>
              </div>
              
              <div className="border-t border-white/[0.06] pt-3.5 space-y-2 text-[11px] text-[#FEFAF8]/70">
                <div className="flex justify-between"><span>Region:</span> <span className="text-white font-semibold">{ashaProfile.region}</span></div>
                <div className="flex justify-between"><span>Sector Assigned:</span> <span className="text-white font-semibold">{ashaProfile.sector}</span></div>
                <div className="flex justify-between"><span>Mothers:</span> <span className="text-[#D8A48F] font-bold">{ashaProfile.mothersCount}</span></div>
                <div className="flex justify-between"><span>Net Status:</span> <span className="text-emerald-400 font-bold">ASHA-Net Online</span></div>
              </div>
            </div>

            {/* Language Preferences */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-3.5">
              <h4 className="font-serif text-sm font-bold text-[#2A1525] flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
                <Languages className="w-4 h-4 text-[#C8877A]" /> Language Dialect
              </h4>
              <div className="space-y-1.5">
                {[
                  { code: 'en', label: 'English (Default)' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                  { code: 'ta', label: 'தமிழ் (Tamil)' },
                  { code: 'te', label: 'తెలుగు (Telugu)' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code as Language)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      lang === l.code
                        ? 'bg-[#C8877A]/15 border border-[#C8877A]/40 text-[#C8877A]'
                        : 'bg-white border border-[#C8877A]/5 text-[#2A1525]/75 hover:bg-[#F5E8E6]/25'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CONFIGURATIONS SUITE (2 cols) */}
          <div className="md:col-span-2 space-y-6">

            {/* Feature 4 Expansion - Maternal Ring Vitals Telemetry Thresholds */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-5">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-1.5">
                  <Sliders className="w-4.5 h-4.5 text-[#C8877A]" /> Telemetry Alert Thresholds
                </h4>
                <p className="text-[10px] text-[#8A7A82] mt-0.5">
                  Adjust maternal ring telemetry boundaries to customize automatic SOS triggers for your sector.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Systolic BP slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2A1525]">Systolic Blood Pressure limit</span>
                    <span className="text-red-500 font-mono font-bold">&gt; {systolic} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="170"
                    value={systolic}
                    onChange={(e) => setSystolic(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#F5E8E6] rounded-lg appearance-none cursor-pointer accent-[#C8877A]"
                  />
                  <span className="text-[9px] text-[#8A7A82] block">National Health Mission guidelines flag pre-eclampsia risk at &gt; 140 mmHg.</span>
                </div>

                {/* Diastolic BP slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2A1525]">Diastolic Blood Pressure limit</span>
                    <span className="text-red-500 font-mono font-bold">&gt; {diastolic} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="115"
                    value={diastolic}
                    onChange={(e) => setDiastolic(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#F5E8E6] rounded-lg appearance-none cursor-pointer accent-[#C8877A]"
                  />
                  <span className="text-[9px] text-[#8A7A82] block">National guidelines flag diastolic pre-eclampsia risk at &gt; 90 mmHg.</span>
                </div>

                {/* Fetal Heart Rate limit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2A1525]">Maximum Fetal/Maternal Heart Rate</span>
                    <span className="text-red-500 font-mono font-bold">&gt; {heartRate} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="180"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#F5E8E6] rounded-lg appearance-none cursor-pointer accent-[#C8877A]"
                  />
                  <span className="text-[9px] text-[#8A7A82] block">Continuous heart rate monitor triggers warnings for maternal tachycardia if heart rate &gt; 160.</span>
                </div>

                {/* Temperature limit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2A1525]">Fever / Infection Temperature Limit</span>
                    <span className="text-red-500 font-mono font-bold">&gt; {temperature.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="37.0"
                    max="39.5"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#F5E8E6] rounded-lg appearance-none cursor-pointer accent-[#C8877A]"
                  />
                  <span className="text-[9px] text-[#8A7A82] block">Skin temperature deviations suggest early maternal infection or gestational distress.</span>
                </div>
              </div>
            </div>

            {/* Field Usability & Narrator Assist Tools */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#2A1525] flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
                <Volume2 className="w-4.5 h-4.5 text-[#C8877A]" /> Field Accessibility Tools
              </h4>
              
              <div className="space-y-4">
                {/* Low Literacy helper mode */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Voice Assist Narration Guide</label>
                    <p className="text-[10px] text-[#8A7A82] leading-relaxed mt-0.5">
                      ASHA Worker can listen to field explanations in regional languages by tapping help icons. Facilitates low-literacy usage.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={narratorEnabled}
                    onChange={(e) => setNarratorEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#C8877A] cursor-pointer mt-1 shrink-0"
                  />
                </div>

                {/* Auto sync preferences */}
                <div className="flex justify-between items-start gap-4 border-t border-[#C8877A]/5 pt-3">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-[#2A1525] block">Immediate Auto-Sync on Signal Recovery</label>
                    <p className="text-[10px] text-[#8A7A82] leading-relaxed mt-0.5">
                      Flushes queued offline mothers to primary clinical database seamlessly as soon as cellular signal (3G/4G/5G) returns.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#C8877A] cursor-pointer mt-1 shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Offline Database capacity manager */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#2A1525] flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
                <Database className="w-4.5 h-4.5 text-[#C8877A]" /> Offline Database Capacity
              </h4>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between text-[11px] text-[#8A7A82]">
                  <span>Local SQLite Cache Status:</span>
                  <span className="font-bold text-[#2A1525]">4.2 MB / 100 MB Allocated</span>
                </div>
                <div className="w-full bg-[#F5E8E6] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C8877A] h-full" style={{ width: '4.2%' }} />
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] text-[#8A7A82]">Stores up to 250 maternal records offline securely.</p>
                  <button
                    onClick={handleClearCache}
                    className="border border-[#C8877A]/25 text-[#C8877A] hover:bg-[#F5E8E6]/25 text-[10px] font-semibold px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    Flush Local Cache
                  </button>
                </div>

                <AnimatePresence>
                  {cacheClearSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2.5 rounded-xl text-[10px] font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Database cache cleared successfully. Core ASHA records synced.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AshaShell>
  );
}
