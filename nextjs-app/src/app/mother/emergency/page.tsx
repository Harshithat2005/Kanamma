'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Phone,
  Check,
  Loader2,
  Shield,
  Clock,
  Activity,
  ArrowRight,
  MessageSquare,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import MotherShell from '../components/MotherShell';
import { useLanguage } from '../components/LanguageContext';
import { emergencyContacts, warningSignsList } from '../data';

// ── SOS States ────────────────────────────────
type SOSState = 'idle' | 'holding' | 'alerting' | 'sent';

const SOS_HOLD_DURATION = 2000; // 2 seconds for responsive action
const RING_CIRCUMFERENCE = 2 * Math.PI * 44; // radius = 44

const dispatchSteps = [
  { title: "SOS Received by Command Center", detail: "GPS Handshake Complete · Lat 12.9716, Lng 77.5946" },
  { title: "PHC Clinic & OB-GYN Notified", detail: "Maternal Health Dossier shared securely with duty doctors" },
  { title: "ASHA Worker Dispatched", detail: "Meena dispatched on route · Contact established · ETA 12 mins" },
  { title: "Ambulance 108 Dispatched", detail: "Ambulance assigned and routed · ETA 15 mins" },
  { title: "Husband Rajesh Alerted", detail: "Emergency SMS delivered with live coordinate tracking link" },
];

// ── Main Page ─────────────────────────────────
function EmergencyPageContent() {
  const { t } = useLanguage();

  // SOS state machine
  const [sosState, setSosState] = useState<SOSState>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const [dispatchStep, setDispatchStep] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);

  // Dispatch Log progression
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sosState === 'sent') {
      setDispatchStep(0);
      interval = setInterval(() => {
        setDispatchStep((step) => {
          if (step < 4) {
            return step + 1;
          } else {
            clearInterval(interval);
            return step;
          }
        });
      }, 3000); // Move to next step every 3 seconds
    } else {
      setDispatchStep(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sosState]);

  const startHold = useCallback(() => {
    if (sosState === 'alerting' || sosState === 'sent') return;

    setSosState('holding');
    setHoldProgress(0);
    holdStartRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(1, elapsed / SOS_HOLD_DURATION);
      setHoldProgress(progress);

      if (progress >= 1) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setSosState('alerting');
        setHoldProgress(1);

        // Transition to sent status after 1.5s alerting state
        alertTimeoutRef.current = setTimeout(() => {
          setSosState('sent');
        }, 1500);
      }
    }, 30);
  }, [sosState]);

  const cancelHold = useCallback(() => {
    if (sosState !== 'holding') return;
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setSosState('idle');
    setHoldProgress(0);
  }, [sosState]);

  // Cancel/Deactivate SOS
  const handleClearSOS = () => {
    setSosState('idle');
    setHoldProgress(0);
    setDispatchStep(0);
    setShowCancelConfirm(false);
  };

  // SOS Card styling
  const sosBgClass =
    sosState === 'sent'
      ? 'bg-emerald-950/20 border-emerald-500/20'
      : sosState === 'alerting'
      ? 'bg-red-950/30 border-red-500/30'
      : sosState === 'holding'
      ? 'bg-[#1a0a0a] border-red-500/25'
      : 'bg-[#12121A] border-white/[0.04]';

  // Progress ring variables
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - holdProgress);

  // Group warning signs by severity
  const criticalSigns = warningSignsList.filter((s) => s.severity === 'critical');
  const warningSigns = warningSignsList.filter((s) => s.severity === 'warning');

  // Coordinates for the schematic live map
  const phcCoord = { x: 40, y: 30 };
  const motherCoord = { x: 160, y: 90 };
  
  // Calculate relative responder positions based on dispatch log step
  let ashaCoord = { x: phcCoord.x, y: phcCoord.y };
  let ambCoord = { x: phcCoord.x, y: phcCoord.y };

  if (dispatchStep >= 2) {
    const t = Math.min(1, (dispatchStep - 2) / 2); // Moves from step 2 to step 4
    ashaCoord = {
      x: phcCoord.x + (motherCoord.x - phcCoord.x) * t * 0.75,
      y: phcCoord.y + (motherCoord.y - phcCoord.y) * t * 0.75,
    };
  }
  if (dispatchStep >= 3) {
    const t = Math.min(1, (dispatchStep - 3) / 1); // Moves from step 3 to step 4
    ambCoord = {
      x: phcCoord.x + (motherCoord.x - phcCoord.x) * t * 0.45,
      y: phcCoord.y + (motherCoord.y - phcCoord.y) * t * 0.45,
    };
  }

  // Handle Mock Phone Call
  const triggerMockCall = (contactName: string) => {
    setActiveCallContact(contactName);
    setTimeout(() => setActiveCallContact(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Active Call Toast */}
      <AnimatePresence>
        {activeCallContact && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#C8877A] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-3 border border-white/10"
          >
            <PhoneCall className="w-4 h-4 animate-bounce text-white" />
            <span>Establishing secure line to <strong>{activeCallContact}</strong>...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-[#E8E4F0] font-semibold text-base">Deactivate SOS Signal?</h3>
                <p className="text-[#8A7A92] text-xs mt-1.5 leading-relaxed">
                  This will resolve the alert status, recall dispatched responders, and archive the emergency log.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] text-[#8A7A92] hover:text-[#E8E4F0] py-2 rounded-xl text-xs font-medium border border-white/[0.05] transition-colors"
                >
                  Keep Active
                </button>
                <button
                  onClick={handleClearSOS}
                  className="flex-1 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 py-2 rounded-xl text-xs font-medium transition-colors"
                >
                  Clear SOS Alert
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="font-serif text-xl text-[#E8E4F0]">{t('emergencySOS')}</h1>
          <p className="text-[#8A7A92] text-xs">Maternal Critical Response Operating System</p>
        </div>
      </motion.div>

      {/* ─── SECTION 1: SOS TRIGGER & LIVE OPERATIONAL PANELS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* SOS Button Panel */}
        <div className={`lg:col-span-2 overflow-hidden rounded-2xl border p-6 md:p-8 transition-all duration-300 ${sosBgClass}`}>
          <div className="relative z-10 flex flex-col items-center text-center justify-center h-full">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className={`w-4 h-4 ${sosState === 'sent' ? 'text-emerald-400' : 'text-red-400'}`} />
              <h2 className="font-serif text-xs text-[#E8E4F0] uppercase tracking-wider font-semibold">
                SYSTEM TELEMETRY
              </h2>
            </div>

            {/* Button */}
            <div className="relative mb-6">
              <div
                className="relative w-[100px] h-[100px] cursor-pointer select-none"
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 -rotate-90" width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={sosState === 'sent' ? '#34D399' : '#EF4444'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-[stroke] duration-300"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {sosState === 'alerting' ? (
                      <motion.div key="alerting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
                      </motion.div>
                    ) : sosState === 'sent' ? (
                      <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Check className="w-8 h-8 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="sos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-xl font-bold tracking-wider ${
                          sosState === 'holding' ? 'text-red-300' : 'text-red-400'
                        }`}
                      >
                        SOS
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Status text */}
            <p className={`text-xs max-w-[240px] font-medium leading-relaxed ${
              sosState === 'sent' ? 'text-emerald-400' : sosState === 'holding' ? 'text-red-300' : 'text-[#8A7A92]'
            }`}>
              {sosState === 'sent'
                ? "DISPATCH ACTIVE"
                : sosState === 'alerting'
                ? "BROADCASTING SIGNAL..."
                : sosState === 'holding'
                ? "HOLDING... KEEP PRESSING"
                : "HOLD FOR 2 SECONDS TO ALERT PHC + ASHA"}
            </p>
            
            {sosState === 'sent' && (
              <button 
                onClick={() => setShowCancelConfirm(true)}
                className="mt-5 px-4 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-400 rounded-xl text-[10px] font-semibold tracking-wider uppercase transition-colors"
              >
                Deactivate Alert
              </button>
            )}
          </div>
        </div>

        {/* Live Dispatch Tracker Dashboard */}
        <div className="lg:col-span-3 bg-[#12121A] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between min-h-[320px] shadow-[0_0_35px_rgba(200,135,122,0.02)]">
          <AnimatePresence mode="wait">
            {sosState === 'sent' ? (
              <motion.div
                key="dispatch-active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 h-full flex flex-col justify-between"
              >
                {/* Header Indicator */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <h3 className="text-xs font-mono font-bold text-[#E8E4F0] uppercase tracking-wider">
                      LIVE EMERGENCY RESPONSE DISPATCH
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                    PHASE 2: EN ROUTE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-stretch">
                  {/* Left: Dispatch Logs */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {dispatchSteps.map((step, idx) => {
                      const isActive = idx === dispatchStep;
                      const isCompleted = idx < dispatchStep;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-lg border transition-all duration-300 text-left ${
                            isActive 
                              ? 'bg-[#C8877A]/10 border-[#C8877A]/30 pl-3' 
                              : isCompleted 
                              ? 'bg-white/[0.02] border-white/[0.04] opacity-60' 
                              : 'border-transparent opacity-20'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            ) : isActive ? (
                              <Loader2 className="w-3.5 h-3.5 text-[#C8877A] animate-spin flex-shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-[#8A7A92] flex-shrink-0" />
                            )}
                            <h4 className="text-[11px] font-bold text-[#E8E4F0]">{step.title}</h4>
                          </div>
                          <p className="text-[9px] text-[#8A7A92] mt-0.5 font-mono">{step.detail}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: GPS Radar Schematic Visualizer */}
                  <div className="border border-white/[0.06] bg-[#0A0A10] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                    {/* Telemetry coordinate HUD */}
                    <div className="absolute top-2 left-2 text-[7px] font-mono text-[#8A7A92] leading-tight text-left z-10 uppercase">
                      <p>Sats: 9 (GLONASS)</p>
                      <p>Sig: Strong</p>
                      <p>Lock: Active</p>
                    </div>

                    <div className="absolute top-2 right-2 text-[7px] font-mono text-[#8A7A92] leading-tight text-right z-10 uppercase">
                      <p>Meena ASHA: {dispatchStep >= 2 ? 'En Route' : 'Alerted'}</p>
                      <p>Amb 108: {dispatchStep >= 3 ? 'En Route' : 'Standby'}</p>
                    </div>

                    {/* Radar SVG Grid Map */}
                    <div className="flex-1 flex items-center justify-center relative min-h-[120px]">
                      <svg width="100%" height="100" viewBox="0 0 200 100" className="opacity-90">
                        {/* Street routes */}
                        <path d="M10,20 L190,20" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <path d="M40,10 L40,90" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <path d="M160,10 L160,90" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <path d="M40,30 L160,90" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                        <path d="M10,80 L190,80" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />

                        {/* PHC Hub */}
                        <circle cx={phcCoord.x} cy={phcCoord.y} r="6" fill="#60A5FA" className="opacity-80" />
                        <text x={phcCoord.x} y={phcCoord.y + 2} fill="#0A0A10" fontSize="5" fontWeight="bold" textAnchor="middle">H</text>
                        <text x={phcCoord.x} y={phcCoord.y - 8} fill="#60A5FA" fontSize="6" fontFamily="monospace" textAnchor="middle">PHC CLINIC</text>

                        {/* Mother location */}
                        <circle cx={motherCoord.x} cy={motherCoord.y} r="5" fill="#EF4444" />
                        <circle cx={motherCoord.x} cy={motherCoord.y} r="10" fill="none" stroke="#EF4444" strokeWidth="0.5" className="animate-ping" />
                        <text x={motherCoord.x} y={motherCoord.y - 8} fill="#EF4444" fontSize="6" fontFamily="monospace" textAnchor="middle">PATIENT (YOU)</text>

                        {/* Responder lines */}
                        {dispatchStep >= 2 && (
                          <line x1={phcCoord.x} y1={phcCoord.y} x2={ashaCoord.x} y2={ashaCoord.y} stroke="#FBBF24" strokeWidth="1" strokeDasharray="2 2" />
                        )}
                        {dispatchStep >= 3 && (
                          <line x1={phcCoord.x} y1={phcCoord.y} x2={ambCoord.x} y2={ambCoord.y} stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
                        )}

                        {/* ASHA Worker Marker */}
                        {dispatchStep >= 2 && (
                          <g>
                            <circle cx={ashaCoord.x} cy={ashaCoord.y} r="4.5" fill="#FBBF24" />
                            <text x={ashaCoord.x + 7} y={ashaCoord.y + 2} fill="#FBBF24" fontSize="5.5" fontFamily="monospace" fontWeight="bold">ASHA</text>
                          </g>
                        )}

                        {/* Ambulance Marker */}
                        {dispatchStep >= 3 && (
                          <g>
                            <circle cx={ambCoord.x} cy={ambCoord.y} r="4.5" fill="#34D399" />
                            <text x={ambCoord.x + 7} y={ambCoord.y + 2} fill="#34D399" fontSize="5.5" fontFamily="monospace" fontWeight="bold">AMB</text>
                          </g>
                        )}
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[7px] font-mono text-gray-500 border-t border-white/[0.04] pt-1.5">
                      <span>Ref PHC Hub: OK</span>
                      <span>Target Lock: Priya S.</span>
                    </div>
                  </div>
                </div>

                {/* Shared Dossier & Active Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 bg-[#C8877A]/10 border border-[#C8877A]/20 px-3 py-1.5 rounded-xl self-stretch flex-1">
                    <Shield className="w-3.5 h-3.5 text-[#C8877A]" />
                    <span className="text-[10px] text-gray-300">
                      Medical Dossier Shared (CBC, scans, ANC card) with Responder EMTs
                    </span>
                  </div>
                  <div className="flex gap-2 self-stretch">
                    <button 
                      onClick={() => triggerMockCall("ASHA Worker Meena")}
                      className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-[#E8E4F0] px-3 py-1.5 rounded-xl text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Voice ASHA
                    </button>
                    <button 
                      onClick={() => triggerMockCall("PHC Duty Doctor")}
                      className="bg-[#C8877A]/10 border border-[#C8877A]/20 hover:bg-[#C8877A]/15 text-[#C8877A] px-3 py-1.5 rounded-xl text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Voice Clinic
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dispatch-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-10"
              >
                <Shield className="w-12 h-12 text-[#8A7A92]/20 mb-3" />
                <h3 className="text-sm font-semibold text-[#E8E4F0]">{t('warningSignsTitle')} Reference Active</h3>
                <p className="text-xs text-[#8A7A92] mt-1.5 max-w-sm leading-relaxed">
                  The active dispatch tracker is currently offline. Hold the SOS trigger panel to broadcast an emergency signal and engage responders.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-[#8A7A92]/50 border border-white/[0.03] px-3 py-1.5 rounded-xl bg-white/[0.01]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry Connection: STANDBY (Auto-access enabled)</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── SECTION 2: CONTACTS + WARNING SIGNS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Emergency Contacts */}
        <div className="bg-[#12121A] border border-white/[0.04] rounded-2xl p-5 shadow-[0_0_30px_rgba(200,135,122,0.03)]">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-[#C8877A]" />
            <h2 className="font-serif text-base text-[#E8E4F0]">
              {t('emergencyContacts')}
            </h2>
          </div>

          <div className="space-y-2">
            {emergencyContacts
              .sort((a, b) => a.priority - b.priority)
              .map((contact) => {
                const isHighPriority = contact.role === 'ASHA Worker' || contact.role === 'OB-GYN';
                const isEmergencyNumber = contact.phone === '108';

                return (
                  <div
                    key={contact.name}
                    className={`flex items-center gap-3 rounded-xl border transition-colors ${
                      isHighPriority
                        ? 'bg-white/[0.03] border-white/[0.08] p-3.5'
                        : 'bg-white/[0.01] border-white/[0.04] p-3'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 flex items-center justify-center rounded-full font-medium ${
                        isHighPriority
                          ? 'w-10 h-10 text-sm bg-[#C8877A]/15 text-[#C8877A]'
                          : 'w-8 h-8 text-xs bg-white/[0.04] text-[#8A7A92]'
                      }`}
                    >
                      {isEmergencyNumber ? (
                        <Activity className="w-4 h-4" />
                      ) : (
                        contact.name.charAt(0)
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-[#E8E4F0] truncate ${isHighPriority ? 'text-sm font-medium' : 'text-xs'}`}>
                        {contact.name}
                      </p>
                      <p className="text-[10px] text-[#8A7A92] mt-0.5">{contact.role}</p>
                    </div>

                    {/* Availability dot */}
                    <div className="flex items-center gap-1.5 mr-2">
                      {contact.available && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>

                    {/* Call button */}
                    <button
                      onClick={() => triggerMockCall(contact.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isEmergencyNumber
                          ? 'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25'
                          : 'bg-white/[0.04] border border-white/[0.08] text-[#E8E4F0] hover:bg-white/[0.08]'
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      {t('call')}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Warning Signs Reference */}
        <div className="bg-[#12121A] border border-white/[0.04] rounded-2xl p-5 shadow-[0_0_30px_rgba(200,135,122,0.03)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="font-serif text-base text-[#E8E4F0]">
              {t('warningSignsTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Critical signs */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-red-400 uppercase tracking-widest font-mono font-bold">
                  Critical — Go to hospital immediately
                </span>
              </div>
              <div className="space-y-1">
                {criticalSigns.map((sign) => (
                  <div
                    key={sign.symptom}
                    className="flex items-start gap-2.5 pl-3 py-1.5 border-l-2 border-red-500/40 rounded-r-lg bg-red-500/[0.02] text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-[#E8E4F0]/80 leading-normal">
                      {sign.symptom}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning signs */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] text-amber-400 uppercase tracking-widest font-mono font-bold">
                  Warning — Contact doctor or ASHA worker
                </span>
              </div>
              <div className="space-y-1">
                {warningSigns.map((sign) => (
                  <div
                    key={sign.symptom}
                    className="flex items-start gap-2.5 pl-3 py-1.5 border-l-2 border-amber-500/40 rounded-r-lg bg-amber-500/[0.02] text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-xs text-[#E8E4F0]/80 leading-normal">
                        {sign.symptom}
                      </span>
                      <span className="text-[9px] text-[#8A7A92] mt-0.5 flex items-center gap-1 font-mono">
                        <ArrowRight className="w-2.5 h-2.5 text-gray-600" />
                        {sign.action === 'doctor' ? 'Contact OB-GYN' : 'Contact ASHA worker'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: EMERGENCY HISTORY LOG ─── */}
      <div className="bg-[#12121A] border border-white/[0.04] rounded-2xl p-5 shadow-[0_0_30px_rgba(200,135,122,0.03)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#C8877A]" />
          <h2 className="font-serif text-base text-[#E8E4F0]">{t('emergencyHistory')}</h2>
        </div>

        {/* Header structure */}
        <div className="hidden sm:grid grid-cols-5 gap-3 px-3 py-2 text-[9px] text-[#8A7A92] uppercase tracking-wider font-mono border-b border-white/[0.04] mb-3 text-left">
          <span>Date</span>
          <span>Time</span>
          <span>Type</span>
          <span>Resolution</span>
          <span>Response Time</span>
        </div>

        {/* List content (conditional simulated list) */}
        {sosState === 'sent' && dispatchStep === 4 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 px-3 py-2.5 text-xs text-left font-mono border border-[#C8877A]/15 bg-[#C8877A]/5 rounded-xl">
            <span className="text-[#E8E4F0]">May 21, 2026</span>
            <span className="text-[#E8E4F0]">18:28 PM</span>
            <span className="text-red-400 font-bold">SOS ACTIVE</span>
            <span className="text-amber-400 font-medium">In Progress</span>
            <span className="text-[#8A7A92]">--</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <Shield className="w-8 h-8 text-[#8A7A92]/15 mb-2.5" />
            <p className="text-xs text-[#8A7A92]/45">No emergency alerts have been triggered</p>
            <p className="text-[10px] text-[#8A7A92]/25 mt-1 font-mono">
              Operational logs will compile here dynamically when the SOS broadcast begins
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <MotherShell>
      <EmergencyPageContent />
    </MotherShell>
  );
}
