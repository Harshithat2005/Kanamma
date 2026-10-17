'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { mockAshaWorkers } from '../data';
import { 
  Search, 
  Calendar, Check, Send, ChevronDown, ChevronUp, MapPin, Phone
} from 'lucide-react';

export default function AncMothers() {
  const { mothers, assignAsha } = useAncData();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [expandedMotherId, setExpandedMotherId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter mothers
  const filteredMothers = mothers.filter(mother => {
    const matchesSearch = 
      mother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mother.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockAshaWorkers.find(a => a.id === mother.assignedAshaId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || mother.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const toggleExpand = (id: string) => {
    setExpandedMotherId(prev => prev === id ? null : id);
  };

  const handleSendReminder = (motherName: string) => {
    setNotification(`${t('remindersent')} (${motherName})`);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
          {t('mothers')}
        </h2>
        <p className="text-xs text-[#8A7A82] font-mono">
          Search, monitor pregnancy milestones, re-assign health workers, and trigger field updates.
        </p>
      </div>

      {/* Notifications Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C0B18] border border-[#C8877A]/30 text-[#FEFAF8] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-fade-in text-xs font-bold">
          <Check className="w-4 h-4 text-green-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search and Filters toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[#C8877A]/10 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A82]" />
          <input
            type="text"
            placeholder={t('searchMothers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] placeholder-[#8A7A82]/60 pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-[#C8877A] transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto self-start sm:self-auto py-1">
          {(['all', 'green', 'yellow', 'red'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all ${
                riskFilter === r
                  ? r === 'red'
                    ? 'bg-red-500 text-white border-red-500'
                    : r === 'yellow'
                    ? 'bg-[#gold] text-[#2A1525] bg-[#B8906A] border-[#B8906A]'
                    : r === 'green'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-[#2A1525] text-white border-[#2A1525]'
                  : 'bg-white border-[#C8877A]/15 text-[#8A7A82] hover:text-[#2A1525] hover:bg-[#FEFAF8]'
              }`}
            >
              {r === 'all' ? t('all') : r}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FEFAF8] border-b border-[#C8877A]/10 text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider">
                <th className="px-5 py-3 w-8"></th>
                <th className="px-5 py-3">Mother Name & Age</th>
                <th className="px-5 py-3">GA (Weeks)</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Triage Risk</th>
                <th className="px-5 py-3">{t('assignedAsha')}</th>
                <th className="px-5 py-3">Next ANC Visit</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8877A]/10 text-xs">
              {filteredMothers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[#8A7A82]">
                    No mothers matching the query.
                  </td>
                </tr>
              ) : (
                filteredMothers.map((mother) => {
                  const isExpanded = expandedMotherId === mother.id;

                  return (
                    <React.Fragment key={mother.id}>
                      {/* Main Row */}
                      <tr className="hover:bg-[#FEFAF8]/50 transition-colors cursor-pointer" onClick={() => toggleExpand(mother.id)}>
                        <td className="px-5 py-4">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8A7A82]" /> : <ChevronDown className="w-4 h-4 text-[#8A7A82]" />}
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-bold text-[#2A1525] block">{mother.name}</span>
                            <span className="text-[10px] text-[#8A7A82]">{mother.age} Yrs • Hb: {mother.hbLevel} g/dL</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-[#2A1525]">
                          Wk {mother.week}
                          <span className="block text-[9px] font-normal text-[#8A7A82]">
                            Trimester {Math.floor((mother.week - 1) / 13) + 1}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#8A7A82]">
                          <span className="block font-medium text-[#2A1525]">{mother.village}</span>
                          <span className="text-[10px]">{mother.district}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono border ${
                            mother.riskLevel === 'red'
                              ? 'bg-red-500/10 text-red-600 border-red-500/20'
                              : mother.riskLevel === 'yellow'
                              ? 'bg-[#B8906A]/10 text-[#B8906A] border-[#B8906A]/20'
                              : 'bg-green-500/10 text-green-600 border-green-500/20'
                          }`}>
                            {mother.riskLevel.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <select
                              value={mother.assignedAshaId}
                              onChange={(e) => assignAsha(mother.id, e.target.value)}
                              className="bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-[10px] font-bold rounded-lg px-2 py-1 outline-none focus:border-[#C8877A]"
                            >
                              {mockAshaWorkers.map(a => (
                                <option key={a.id} value={a.id}>{a.name} ({a.village})</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-[#2A1525]">
                          {mother.nextVisitDate}
                        </td>
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleSendReminder(mother.name)}
                              title={t('reminders')}
                              className="w-8 h-8 rounded-lg bg-[#FEFAF8] border border-[#C8877A]/15 flex items-center justify-center text-[#2A1525] hover:bg-[#F5E8E6] transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/anc/appointments?motherId=${mother.id}&motherName=${encodeURIComponent(mother.name)}`}
                              title={t('scheduleVisit')}
                              className="w-8 h-8 rounded-lg bg-[#C8877A] text-white flex items-center justify-center hover:bg-[#B7776A] transition-colors shadow-sm"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <tr className="bg-[#FEFAF8]/40">
                          <td colSpan={8} className="px-5 py-4 border-t border-[#C8877A]/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#2A1525]">
                              {/* Vitals overview */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider block">Clinical Vitals</span>
                                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#C8877A]/10 font-mono">
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block">BLOOD PRESSURE</span>
                                    <span className="font-bold text-sm">{mother.bp} mmHg</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block">HEMOGLOBIN (Hb)</span>
                                    <span className="font-bold text-sm text-[#C8877A]">{mother.hbLevel} g/dL</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block">GLUCOSE LEVEL</span>
                                    <span className="font-bold text-sm">{mother.glucoseLevel} mg/dL</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block">COMPLIANCE RATE</span>
                                    <span className="font-bold text-sm text-green-600">{mother.complianceRate}% Adherence</span>
                                  </div>
                                </div>
                              </div>

                              {/* Demographic/Pregnancy info */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider block">Pregnancy Context</span>
                                <div className="bg-white p-3 rounded-xl border border-[#C8877A]/10 space-y-1.5">
                                  <p><span className="text-[#8A7A82]">Husband:</span> <span className="font-bold">{mother.husbandName}</span></p>
                                  <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#8A7A82]" /> <span>{mother.phone}</span></p>
                                  <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#8A7A82]" /> <span className="leading-tight">{mother.address}</span></p>
                                  <p><span className="text-[#8A7A82]">Blood Group:</span> <span className="font-mono font-bold">{mother.bloodGroup}</span></p>
                                </div>
                              </div>

                              {/* Risk Reasons and Doctor */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider block">Diagnostics & Oversight</span>
                                <div className="bg-white p-3 rounded-xl border border-[#C8877A]/10 space-y-2">
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block">DOCTOR IN CHARGE</span>
                                    <span className="font-bold">{mother.assignedDoctor}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-[#8A7A82] block mb-1">RISK PATHOLOGIES</span>
                                    {mother.riskReasons.length === 0 ? (
                                      <span className="text-green-600 font-bold block">No warning flags. Normal physiological progression.</span>
                                    ) : (
                                      <div className="flex flex-wrap gap-1">
                                        {mother.riskReasons.map((reason, idx) => (
                                          <span key={idx} className="bg-red-50 text-red-700 border border-red-100 rounded px-1.5 py-0.5 text-[9px] font-medium leading-tight">
                                            {reason}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
