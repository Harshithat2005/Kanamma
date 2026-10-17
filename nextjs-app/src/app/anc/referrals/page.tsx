'use client';

import React, { useState } from 'react';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { mockAshaWorkers } from '../data';
import { 
  Activity, ShieldAlert, Check, Clock, Phone, 
  Hospital, Navigation, AlertOctagon
} from 'lucide-react';

export default function AncReferrals() {
  const { referrals, mothers, addReferral, updateReferralStatus } = useAncData();
  const { t } = useLanguage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMotherId, setSelectedMotherId] = useState('');
  const [reason, setReason] = useState('');
  const [targetHospital, setTargetHospital] = useState('City Maternity & District Hospital');
  const [escortAshaId, setEscortAshaId] = useState(mockAshaWorkers[0].id);

  // Custom log text state for manual telemetry updates
  const [customLogs, setCustomLogs] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const activeReferrals = referrals.filter(ref => ref.status !== 'admitted');
  const historicalReferrals = referrals.filter(ref => ref.status === 'admitted');

  const handleInitiateSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMotherId || !reason) return;

    const mother = mothers.find(m => m.id === selectedMotherId);
    if (!mother) return;

    addReferral({
      motherId: selectedMotherId,
      motherName: mother.name,
      reason,
      sourcePHC: 'Nelamangala PHC Hub',
      targetHospital,
      doctorInCharge: 'Dr. Shreya Roy',
      escortAshaId,
      status: 'initiated',
      etaMinutes: 30
    });

    setReason('');
    setShowAddForm(false);
    setToast(`Emergency SOS Dispatch initialized for ${mother.name}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAdvanceStatus = (id: string, currentStatus: string) => {
    let nextStatus: typeof referrals[0]['status'] = 'initiated';
    let defaultLog = '';

    if (currentStatus === 'initiated') {
      nextStatus = 'dispatched';
      defaultLog = '108 Ambulance dispatch confirmed. Siren operational. Escort ASHA en-route to patient residence.';
    } else if (currentStatus === 'dispatched') {
      nextStatus = 'en_route';
      defaultLog = 'Patient picked up. Vitals checked and stabilized. Transit to referral facility initiated.';
    } else if (currentStatus === 'en_route') {
      nextStatus = 'admitted';
      defaultLog = 'Patient safely admitted at OB-GYN emergency ward. Handover to district medical team completed.';
    }

    updateReferralStatus(id, nextStatus, defaultLog);
    setToast(`Referral status advanced to ${nextStatus}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddCustomLog = (id: string, currentStatus: typeof referrals[0]['status']) => {
    const logText = customLogs[id];
    if (!logText || !logText.trim()) return;

    updateReferralStatus(id, currentStatus, `Telemetry Log: ${logText.trim()}`);
    setCustomLogs(prev => ({ ...prev, [id]: '' }));
    setToast("Telemetry update appended to transit timeline.");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C0B18] border border-[#C8877A]/30 text-[#FEFAF8] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <Check className="w-4 h-4 text-red-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-600 animate-pulse" />
            {t('referrals')}
          </h2>
          <p className="text-xs text-[#8A7A82] font-mono">
            Coordinate ambulance dispatches, real-time vehicle GPS timelines, and PHC-to-Hospital handovers.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Initialize Emergency SOS</span>
        </button>
      </div>

      {/* SOS Escalation Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleInitiateSOS} className="bg-white border border-red-200 p-5 rounded-2xl shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-serif font-bold text-red-800 flex items-center gap-1.5 border-b border-red-100 pb-2">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            Initialize Emergency SOS Transit Referral
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Select Mother */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Select Mother</label>
              <select
                required
                value={selectedMotherId}
                onChange={(e) => setSelectedMotherId(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-red-200 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-red-500"
              >
                <option value="">-- Choose Patient --</option>
                {mothers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.village} - risk: {m.riskLevel.toUpperCase()})</option>
                ))}
              </select>
            </div>

            {/* Target Hospital */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Target Hospital</label>
              <select
                value={targetHospital}
                onChange={(e) => setTargetHospital(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                <option value="City Maternity & District Hospital">District Maternity Hospital</option>
                <option value="Sri Jayadeva Emergency Medical Center">Jayadeva Emergency Hub</option>
                <option value="Nelamangala Area Referral Hospital">Nelamangala Area Referral</option>
              </select>
            </div>

            {/* Escort ASHA */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Escort ASHA (Ambulance Companion)</label>
              <select
                value={escortAshaId}
                onChange={(e) => setEscortAshaId(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                {mockAshaWorkers.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.village})</option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Reason for Emergency Transfer</label>
              <textarea
                required
                placeholder="Specify clinical pathologies (e.g., BP spike 170/110, severe labor pain at week 34, acute antepartum hemorrhage...)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-red-200 text-[#2A1525] p-2.5 rounded-xl text-xs outline-none focus:border-red-500 h-20 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#C8877A]/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold text-[#8A7A82] hover:text-[#2A1525] px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Launch SOS Ambulance Dispatch
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Active Transit list & Archives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Transit trackers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-[#2A1525] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#C8877A]" />
                Active SOS Ambulance Transits
              </h3>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {activeReferrals.length} TRANSITS
              </span>
            </div>

            <div className="p-5 divide-y divide-[#C8877A]/10 space-y-6">
              {activeReferrals.length === 0 ? (
                <div className="py-8 text-center text-[#8A7A82]">
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#2A1525]">No active emergency transits</p>
                  <p className="text-[10px]">All referred cases successfully delivered and admitted</p>
                </div>
              ) : (
                activeReferrals.map((ref, idx) => {
                  const escort = mockAshaWorkers.find(a => a.id === ref.escortAshaId);
                  const currentCustomLog = customLogs[ref.id] || '';

                  return (
                    <div key={ref.id} className={`space-y-4 ${idx > 0 ? 'pt-6' : ''}`}>
                      {/* Patient details & stages header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#2A1525]">{ref.motherName}</span>
                            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20">
                              SOS DISPATCH
                            </span>
                          </div>
                          <p className="text-[10px] text-[#8A7A82] mt-0.5 font-mono">
                            PHC: {ref.sourcePHC} → MD: {ref.doctorInCharge}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => handleAdvanceStatus(ref.id, ref.status)}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all"
                          >
                            {ref.status === 'initiated' && 'Confirm Ambulance Dispatch'}
                            {ref.status === 'dispatched' && 'Set En Route Vitals'}
                            {ref.status === 'en_route' && 'Confirm Emergency Admission'}
                          </button>
                        </div>
                      </div>

                      {/* Visual Transit Progression Bar */}
                      <div className="bg-[#FEFAF8] p-3 rounded-xl border border-[#C8877A]/10 grid grid-cols-4 gap-2 text-center text-[9px] font-mono font-bold tracking-wider relative overflow-hidden">
                        {[
                          { id: 'initiated', label: 'INITIALIZED' },
                          { id: 'dispatched', label: 'DISPATCHED' },
                          { id: 'en_route', label: 'EN ROUTE' },
                          { id: 'admitted', label: 'ADMITTED' }
                        ].map((stage, sIdx) => {
                          const isPast = ['initiated', 'dispatched', 'en_route', 'admitted'].indexOf(ref.status) >= sIdx;
                          return (
                            <div key={stage.id} className="relative z-10">
                              <span className={`block px-1 py-1 rounded ${
                                isPast ? 'bg-red-600 text-white' : 'bg-white text-[#8A7A82] border border-[#C8877A]/15'
                              }`}>{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Patient destination, escort details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-[#FEFAF8] p-3 rounded-xl border border-[#C8877A]/10">
                          <span className="text-[9px] text-[#8A7A82] uppercase font-bold tracking-wider block">Transfer Diagnosis & Goal</span>
                          <p className="font-medium text-[#2A1525] leading-relaxed">&quot;{ref.reason}&quot;</p>
                        </div>
                        <div className="space-y-2 bg-[#FEFAF8] p-3 rounded-xl border border-[#C8877A]/10 font-mono text-[10px]">
                          <div className="flex items-center gap-1"><Hospital className="w-3.5 h-3.5 text-[#C8877A]" /> <span>Target: <strong>{ref.targetHospital}</strong></span></div>
                          <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#8A7A82]" /> <span>ASHA: <strong>{escort?.name} ({escort?.phone})</strong></span></div>
                          <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#8A7A82]" /> <span>Initiated: <strong>{ref.timestamp}</strong></span></div>
                        </div>
                      </div>

                      {/* Timeline journey log */}
                      <div className="border border-[#C8877A]/15 rounded-xl overflow-hidden bg-[#FEFAF8]/30">
                        <div className="bg-[#FEFAF8] px-4 py-2 border-b border-[#C8877A]/10 text-[10px] font-bold text-[#2A1525] uppercase font-mono tracking-wider flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C8877A]" />
                          <span>Journey logs / Telemetry Timeline</span>
                        </div>
                        <div className="p-4 relative space-y-3.5 pl-8 border-l-2 border-[#C8877A]/20 ml-4 mt-2">
                          {ref.timelineLogs.map((log, lIdx) => (
                            <div key={lIdx} className="relative text-xs">
                              <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-sm" />
                              <span className="font-mono text-[10px] text-[#8A7A82]">{log.time}</span>
                              <span className="text-[#2A1525] ml-2 font-medium">— {log.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Add custom log field */}
                        <div className="p-3 bg-white border-t border-[#C8877A]/10 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add manual ambulance telemetry note (e.g. Vitals: BP stable 130/80...)"
                            value={currentCustomLog}
                            onChange={(e) => setCustomLogs(prev => ({ ...prev, [ref.id]: e.target.value }))}
                            className="flex-1 bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs px-3 py-1.5 rounded-lg outline-none focus:border-red-500"
                          />
                          <button
                            onClick={() => handleAddCustomLog(ref.id, ref.status)}
                            className="bg-[#2A1525] hover:bg-[#1E0E1B] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Historical Referral Logs */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#2A1525] border-b border-[#C8877A]/10 pb-2">
            Referral Handover Logs (Historical)
          </h3>
          
          <div className="space-y-4 divide-y divide-[#C8877A]/10">
            {historicalReferrals.length === 0 ? (
              <p className="text-xs text-[#8A7A82] text-center py-4">No historical referrals resolved in current session.</p>
            ) : (
              historicalReferrals.map((ref, idx) => (
                <div key={ref.id} className={`space-y-2 text-xs ${idx > 0 ? 'pt-4' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2A1525]">{ref.motherName}</span>
                    <span className="text-[8px] font-mono font-bold bg-green-100 text-green-700 border border-green-200 rounded px-1.5 py-0.5">
                      HANDOVER COMPLETE
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A7A82] leading-tight">
                    Facility: {ref.targetHospital}
                  </p>
                  <p className="text-[10px] text-[#2A1525] italic bg-[#FEFAF8] p-2 rounded border border-[#C8877A]/05">
                    &quot;{ref.reason}&quot;
                  </p>
                  <div className="text-[9px] text-[#8A7A82] font-mono flex items-center justify-between">
                    <span>MD: {ref.doctorInCharge}</span>
                    <span>Admitted: {ref.timelineLogs[ref.timelineLogs.length - 1]?.time || ref.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
