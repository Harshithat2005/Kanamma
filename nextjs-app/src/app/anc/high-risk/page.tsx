'use client';

import React, { useState } from 'react';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { mockAshaWorkers } from '../data';
import { 
  AlertOctagon, AlertTriangle, ShieldAlert, Heart, Activity, 
  Droplet, Check, Loader2, Hospital
} from 'lucide-react';

export default function AncHighRisk() {
  const { mothers, referrals, addReferral } = useAncData();
  const { t } = useLanguage();

  const [triageFilter, setTriageFilter] = useState<'all' | 'bp' | 'anemia' | 'gdm' | 'missed'>('all');
  const [escalatingMotherId, setEscalatingMotherId] = useState<string | null>(null);
  const [targetHospital, setTargetHospital] = useState('City Maternity & District Hospital');
  const [escalationReason, setEscalationReason] = useState('');
  const [escortAshaId, setEscortAshaId] = useState(mockAshaWorkers[0].id);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter high risk cases
  const highRiskMothers = mothers.filter(m => m.riskLevel === 'red' || m.riskLevel === 'yellow');

  // Filter by pathologies
  const triageMothers = highRiskMothers.filter(mother => {
    if (triageFilter === 'all') return true;
    if (triageFilter === 'bp') {
      // Systolic > 130 or Diastolic > 85 or listed in reasons
      const [sys, dia] = mother.bp.split('/').map(Number);
      return sys > 130 || dia > 85 || mother.riskReasons.some(r => r.toLowerCase().includes('hypertension') || r.toLowerCase().includes('eclampsia'));
    }
    if (triageFilter === 'anemia') {
      return mother.hbLevel < 10.5 || mother.riskReasons.some(r => r.toLowerCase().includes('anemia'));
    }
    if (triageFilter === 'gdm') {
      return mother.glucoseLevel > 120 || mother.riskReasons.some(r => r.toLowerCase().includes('diabetes') || r.toLowerCase().includes('gdm'));
    }
    if (triageFilter === 'missed') {
      return mother.complianceRate < 80;
    }
    return true;
  });

  const handleOpenEscalation = (motherId: string, name: string, reasons: string[]) => {
    setEscalatingMotherId(motherId);
    setEscalationReason(`Critical escalation required due to: ${reasons.join(', ') || 'Abnormal vitals profile'}.`);
  };

  const handleEscalateSubmit = (motherId: string, motherName: string) => {
    if (!escalationReason.trim()) return;

    addReferral({
      motherId,
      motherName,
      reason: escalationReason,
      sourcePHC: 'Nelamangala PHC Hub',
      targetHospital,
      doctorInCharge: 'Dr. Shreya Roy',
      escortAshaId,
      status: 'initiated',
      etaMinutes: 25
    });

    setEscalatingMotherId(null);
    setSuccessToast(`Emergency SOS referral initialized for ${motherName}`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight flex items-center gap-2">
          <AlertOctagon className="w-6 h-6 text-red-600" />
          {t('highRisk')}
        </h2>
        <p className="text-xs text-[#8A7A82] font-mono">
          Priority medical queue. Monitor clinical anomalies and initiate rapid ambulance/hospital transfer dispatch.
        </p>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C0B18] border border-[#C8877A]/30 text-[#FEFAF8] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-fade-in text-xs font-bold">
          <Check className="w-4 h-4 text-red-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Triage filters bar */}
      <div className="bg-white border border-[#C8877A]/10 p-3 rounded-2xl shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setTriageFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all ${
            triageFilter === 'all'
              ? 'bg-[#2A1525] text-white border-[#2A1525]'
              : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
          }`}
        >
          All High-Risk ({highRiskMothers.length})
        </button>
        <button
          onClick={() => setTriageFilter('bp')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all flex items-center gap-1.5 ${
            triageFilter === 'bp'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> BP / Eclampsia
        </button>
        <button
          onClick={() => setTriageFilter('anemia')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all flex items-center gap-1.5 ${
            triageFilter === 'anemia'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" /> Severe Anemia
        </button>
        <button
          onClick={() => setTriageFilter('gdm')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all flex items-center gap-1.5 ${
            triageFilter === 'gdm'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Gestational Diabetes (GDM)
        </button>
        <button
          onClick={() => setTriageFilter('missed')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all flex items-center gap-1.5 ${
            triageFilter === 'missed'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Low Compliance
        </button>
      </div>

      {/* Grid of triage cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {triageMothers.map((mother) => {
          const isRed = mother.riskLevel === 'red';
          const isCurrentlyEscalating = escalatingMotherId === mother.id;
          const isAlreadyReferred = referrals.some(r => r.motherId === mother.id && r.status !== 'admitted');

          return (
            <div 
              key={mother.id} 
              className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative ${
                isRed ? 'border-red-200 bg-red-500/02' : 'border-[#C8877A]/15'
              }`}
            >
              {/* Top Row: Name, Age, GA, Risk Level */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#2A1525] text-sm">{mother.name}</h3>
                  <p className="text-[10px] text-[#8A7A82] font-mono">
                    Age {mother.age} • Gestational Age: Wk {mother.week} (Trimester {Math.floor((mother.week - 1) / 13) + 1})
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                  isRed ? 'bg-red-100 text-red-700' : 'bg-[#B8906A]/10 text-[#B8906A]'
                }`}>
                  {mother.riskLevel.toUpperCase()}
                </span>
              </div>

              {/* Vitals breakdown */}
              <div className="grid grid-cols-4 gap-2 bg-[#FEFAF8] p-3 rounded-xl border border-[#C8877A]/10 font-mono text-center">
                <div>
                  <span className="block text-[8px] text-[#8A7A82] uppercase">BP</span>
                  <span className={`font-bold text-[11px] ${
                    mother.bp.split('/').map(Number)[0] > 140 || mother.bp.split('/').map(Number)[1] > 90
                      ? 'text-red-600'
                      : 'text-[#2A1525]'
                  }`}>{mother.bp}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#8A7A82] uppercase">Hb (HEMO)</span>
                  <span className={`font-bold text-[11px] ${mother.hbLevel < 10 ? 'text-red-600' : 'text-[#2A1525]'}`}>
                    {mother.hbLevel}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#8A7A82] uppercase">GLUCOSE</span>
                  <span className={`font-bold text-[11px] ${mother.glucoseLevel > 120 ? 'text-red-600' : 'text-[#2A1525]'}`}>
                    {mother.glucoseLevel}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-[#8A7A82] uppercase">ADHERENCE</span>
                  <span className={`font-bold text-[11px] ${mother.complianceRate < 80 ? 'text-red-600' : 'text-green-600'}`}>
                    {mother.complianceRate}%
                  </span>
                </div>
              </div>

              {/* Risk Reasons listed as warning tags */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-[#8A7A82] uppercase tracking-wider block">Pathologies Identified:</span>
                <div className="flex flex-wrap gap-1">
                  {mother.riskReasons.length === 0 ? (
                    <span className="text-[10px] text-green-600 font-bold">No registered risk pathologies.</span>
                  ) : (
                    mother.riskReasons.map((reason, idx) => (
                      <span key={idx} className="bg-red-50 text-red-700 border border-red-100/50 rounded-md px-2 py-0.5 text-[9px] font-medium leading-tight">
                        {reason}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Contact / ASHA Details */}
              <div className="flex justify-between items-center text-[10px] text-[#8A7A82] pt-2 border-t border-[#C8877A]/10">
                <div>
                  <span className="block text-[8px] uppercase">Assigned ASHA</span>
                  <span className="font-bold text-[#2A1525]">
                    {mockAshaWorkers.find(a => a.id === mother.assignedAshaId)?.name || 'None'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase">Village Hub</span>
                  <span className="font-bold text-[#2A1525]">{mother.village}</span>
                </div>
              </div>

              {/* Escalation SOS Controls */}
              <div className="pt-2">
                {isAlreadyReferred ? (
                  <div className="w-full text-center bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>EMERGENCY DISPATCH IN TRANSIT</span>
                  </div>
                ) : !isCurrentlyEscalating ? (
                  <button
                    onClick={() => handleOpenEscalation(mother.id, mother.name, mother.riskReasons)}
                    className="w-full text-center bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Escalate to Emergency SOS</span>
                  </button>
                ) : (
                  <div className="bg-[#FEFAF8] border border-red-200 rounded-xl p-4 space-y-3.5 animate-fade-in">
                    <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5" /> Configure SOS Transfer
                    </h4>

                    {/* Reason */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-[#8A7A82] uppercase">Referral Diagnosis</label>
                      <textarea
                        value={escalationReason}
                        onChange={(e) => setEscalationReason(e.target.value)}
                        className="w-full bg-white border border-[#C8877A]/15 text-[#2A1525] p-2 rounded-lg text-xs outline-none focus:border-red-500 h-16 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Target Hospital */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#8A7A82] uppercase">Target Facility</label>
                        <select
                          value={targetHospital}
                          onChange={(e) => setTargetHospital(e.target.value)}
                          className="w-full bg-white border border-[#C8877A]/15 text-[#2A1525] p-1.5 rounded-lg text-[10px] font-bold outline-none"
                        >
                          <option value="City Maternity & District Hospital">District Maternity Hospital</option>
                          <option value="Sri Jayadeva Emergency Medical Center">Jayadeva Emergency Hub</option>
                          <option value="Nelamangala Area Referral Hospital">Nelamangala Area Referral</option>
                        </select>
                      </div>

                      {/* Escort ASHA */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#8A7A82] uppercase">Escort Escort ASHA</label>
                        <select
                          value={escortAshaId}
                          onChange={(e) => setEscortAshaId(e.target.value)}
                          className="w-full bg-white border border-[#C8877A]/15 text-[#2A1525] p-1.5 rounded-lg text-[10px] font-bold outline-none"
                        >
                          {mockAshaWorkers.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setEscalatingMotherId(null)}
                        className="text-[10px] font-bold text-[#8A7A82] hover:text-[#2A1525] px-2.5 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEscalateSubmit(mother.id, mother.name)}
                        className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm"
                      >
                        Launch SOS Transfer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
