'use client';

import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  ShieldAlert,
  Clock,
  Send,
  Truck,
  Building,
  Navigation
} from 'lucide-react';

export default function EmergencyWard() {
  const { t } = useLanguage();
  const { referrals, updateReferralStatus } = useDoctorData();
  const [selectedReferralId, setSelectedReferralId] = useState<string>(
    referrals.length > 0 ? referrals[0].id : ''
  );
  const [newLogText, setNewLogText] = useState('');

  const selectedReferral = referrals.find((r) => r.id === selectedReferralId);

  const handleStatusChange = (status: 'initiated' | 'dispatched' | 'en_route' | 'admitted') => {
    if (!selectedReferral) return;
    let logMsg = '';
    if (status === 'dispatched') {
      logMsg = '108 Emergency ambulance dispatched with escort ASHA worker.';
    } else if (status === 'en_route') {
      logMsg = 'Ambulance transit active. GPS location tracking coordinates loaded.';
    } else if (status === 'admitted') {
      logMsg = 'Patient safely arrived at Target hospital. ICU check-in completed.';
    }
    updateReferralStatus(selectedReferral.id, status, logMsg);
  };

  const handlePostLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral || !newLogText.trim()) return;
    updateReferralStatus(selectedReferral.id, selectedReferral.status, newLogText.trim());
    setNewLogText('');
  };

  // Helper to determine status progress step
  const getStepIndex = (status: string) => {
    if (status === 'initiated') return 0;
    if (status === 'dispatched') return 1;
    if (status === 'en_route') return 2;
    if (status === 'admitted') return 3;
    return 0;
  };

  const activeSOS = referrals.filter((r) => r.status !== 'admitted');
  const pastSOS = referrals.filter((r) => r.status === 'admitted');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
          {t('emergency')}
        </h1>
        <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
          Coordinate transit logistics, ambulance telemetry logs, and hospital arrival confirmations for critical mothers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: SOS Referrals List */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Active List */}
          <div className="p-4 border-b border-[#C8877A]/10 bg-red-50/50">
            <h4 className="font-serif font-bold text-red-700 flex items-center space-x-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-red-600 animate-pulse" />
              <span>Active SOS Transits ({activeSOS.length})</span>
            </h4>
          </div>

          <div className="divide-y divide-[#C8877A]/5 max-h-[300px] overflow-y-auto">
            {activeSOS.length > 0 ? (
              activeSOS.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => setSelectedReferralId(ref.id)}
                  className={`w-full text-left p-4 transition flex flex-col space-y-1.5 ${
                    ref.id === selectedReferralId ? 'bg-red-50/40 border-l-4 border-red-600' : 'hover:bg-[#FEFAF8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#2A1525]">
                      {ref.patientName}
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                      {ref.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#2A1525]/60 font-medium">
                    <span>ETA: {ref.etaMinutes} mins</span>
                    <span>Started: {ref.timestamp}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[#2A1525]/45 italic">No active emergencies</div>
            )}
          </div>

          {/* Past Admissions List */}
          <div className="p-4 border-t border-b border-[#C8877A]/10 bg-[#FEFAF8]">
            <h4 className="font-serif font-bold text-[#2A1525]">Resolved / Admitted</h4>
          </div>

          <div className="divide-y divide-[#C8877A]/5 max-h-[250px] overflow-y-auto">
            {pastSOS.length > 0 ? (
              pastSOS.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => setSelectedReferralId(ref.id)}
                  className={`w-full text-left p-4 transition flex flex-col space-y-1 ${
                    ref.id === selectedReferralId ? 'bg-[#C8877A]/10 border-l-4 border-[#C8877A]' : 'hover:bg-[#FEFAF8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#2A1525]">
                      {ref.patientName}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Admitted
                    </span>
                  </div>
                  <div className="text-[10px] text-[#2A1525]/50 font-medium">
                    Target: {ref.targetHospital}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[#2A1525]/45 italic">No resolved emergencies yet</div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Telemetry & Controls */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {selectedReferral ? (
            <div className="flex-1 flex flex-col">
              {/* Header Info */}
              <div className="p-6 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-xl font-bold text-[#2A1525]">
                      SOS Transit Dossier: {selectedReferral.patientName}
                    </h3>
                  </div>
                  <p className="text-xs text-[#2A1525]/60 font-semibold italic">
                    Reason: {selectedReferral.reason}
                  </p>
                </div>
                <div className="text-xs bg-white border border-[#C8877A]/15 px-3 py-1.5 rounded-lg flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-[#C8877A]" />
                  <span>ETA: <strong className="text-red-600 font-bold">{selectedReferral.etaMinutes} min</strong></span>
                </div>
              </div>

              {/* Triage Progress Steps */}
              <div className="p-6 border-b border-[#C8877A]/10">
                <div className="relative flex justify-between">
                  {/* Progress Line Bar */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-10 rounded">
                    <div
                      className="h-full bg-red-600 rounded transition-all duration-300"
                      style={{ width: `${(getStepIndex(selectedReferral.status) / 3) * 100}%` }}
                    />
                  </div>

                  {/* Step 1: Initialized */}
                  <div className="flex flex-col items-center text-center max-w-[80px]">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      getStepIndex(selectedReferral.status) >= 0
                        ? 'bg-red-600 border-transparent text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <ShieldAlert className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider mt-2">
                      SOS Trigger
                    </span>
                  </div>

                  {/* Step 2: Dispatched */}
                  <div className="flex flex-col items-center text-center max-w-[80px]">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      getStepIndex(selectedReferral.status) >= 1
                        ? 'bg-red-600 border-transparent text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <Truck className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider mt-2">
                      Dispatched
                    </span>
                  </div>

                  {/* Step 3: En Route */}
                  <div className="flex flex-col items-center text-center max-w-[80px]">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      getStepIndex(selectedReferral.status) >= 2
                        ? 'bg-red-600 border-transparent text-white animate-pulse'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <Navigation className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider mt-2">
                      En Route
                    </span>
                  </div>

                  {/* Step 4: Admitted */}
                  <div className="flex flex-col items-center text-center max-w-[80px]">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      getStepIndex(selectedReferral.status) >= 3
                        ? 'bg-green-600 border-transparent text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <Building className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider mt-2">
                      Admitted
                    </span>
                  </div>
                </div>

                {/* Operations buttons to transition statuses */}
                {selectedReferral.status !== 'admitted' && (
                  <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
                    {selectedReferral.status === 'initiated' && (
                      <button
                        onClick={() => handleStatusChange('dispatched')}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Approve Ambulance Dispatch
                      </button>
                    )}
                    {selectedReferral.status === 'dispatched' && (
                      <button
                        onClick={() => handleStatusChange('en_route')}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Confirm Boarding & Start Route
                      </button>
                    )}
                    {selectedReferral.status === 'en_route' && (
                      <button
                        onClick={() => handleStatusChange('admitted')}
                        className="px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Confirm Hospital Admission (Resolve)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Transit Details Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#C8877A]/10">
                <div className="space-y-3.5 text-xs">
                  <h4 className="font-serif font-bold text-[#2A1525] text-sm">Transport Metadata</h4>
                  <div className="flex justify-between py-1.5 border-b border-[#C8877A]/5 font-medium">
                    <span className="text-[#2A1525]/60">Source Clinic</span>
                    <span className="text-[#2A1525]">{selectedReferral.sourcePHC}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#C8877A]/5 font-medium">
                    <span className="text-[#2A1525]/60">Target Destination</span>
                    <span className="text-[#2A1525]">{selectedReferral.targetHospital}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#C8877A]/5 font-medium">
                    <span className="text-[#2A1525]/60">Escort ASHA</span>
                    <span className="text-[#2A1525]">{selectedReferral.escortAshaName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#C8877A]/5 font-medium">
                    <span className="text-[#2A1525]/60">Lead Gynecologist</span>
                    <span className="text-[#2A1525]">{selectedReferral.doctorInCharge}</span>
                  </div>
                </div>

                {/* Telemetry Timeline logs */}
                <div className="space-y-4 flex flex-col h-[200px]">
                  <h4 className="font-serif font-bold text-[#2A1525] text-sm">Live Telemetry Timeline</h4>
                  <div className="flex-1 overflow-y-auto space-y-3 px-1">
                    {selectedReferral.timelineLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                        <div className="bg-[#FEFAF8] border border-[#C8877A]/15 font-mono text-[9px] px-1.5 py-0.5 rounded text-[#C8877A] mt-0.5">
                          {log.time}
                        </div>
                        <p className="text-[#2A1525]/85 font-medium">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Append Timeline Log Form */}
              {selectedReferral.status !== 'admitted' && (
                <form onSubmit={handlePostLog} className="p-4 bg-white flex space-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Post clinical telemetry update (e.g. BP stabilized, arriving in 5 mins)..."
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                    className="flex-1 bg-[#FEFAF8] text-xs p-3 border border-[#C8877A]/20 focus:outline-none focus:border-[#C8877A] rounded-lg"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-[#2A1525] hover:bg-[#2A1525]/90 text-white rounded-lg transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-[#2A1525]/40 italic">
              No referrals selected. Click an active referral on the left to track telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
