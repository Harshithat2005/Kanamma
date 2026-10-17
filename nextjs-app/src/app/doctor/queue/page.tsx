'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  Search,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

export default function PatientQueue() {
  const { t } = useLanguage();
  const { patients, triggerEmergencySOS } = useDoctorData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [showSOSModal, setShowSOSModal] = useState<string | null>(null);
  const [sosReason, setSosReason] = useState('');
  const [sosHospital, setSosHospital] = useState('City Maternity & District Hospital');

  // Filter patients based on tab and search query
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.riskReasons.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === 'all' || patient.riskLevel === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleSOSSubmit = (patientId: string) => {
    if (!sosReason.trim()) return;
    triggerEmergencySOS(patientId, sosReason, sosHospital);
    setShowSOSModal(null);
    setSosReason('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-4 border-b border-[#C8877A]/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
            {t('queue')}
          </h1>
          <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
            Sort and review active pregnancies, prioritize risks, and coordinate ASHA check-ins
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#2A1525]/45" />
          <input
            type="text"
            placeholder="Search patient, village or risk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#C8877A]/20 rounded-lg pl-9 pr-4 py-2 text-sm text-[#2A1525] placeholder-[#2A1525]/45 focus:outline-none focus:border-[#C8877A] focus:ring-1 focus:ring-[#C8877A]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#C8877A]/10 space-x-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-[#C8877A] text-[#2A1525] font-extrabold'
              : 'border-transparent text-[#2A1525]/60 hover:text-[#2A1525]'
          }`}
        >
          All Patients ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab('red')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'red'
              ? 'border-red-600 text-red-600 font-extrabold'
              : 'border-transparent text-red-500/70 hover:text-red-600'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>Critical Red ({patients.filter((p) => p.riskLevel === 'red').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('yellow')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'yellow'
              ? 'border-yellow-500 text-yellow-600 font-extrabold'
              : 'border-transparent text-yellow-600/70 hover:text-yellow-600'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
          <span>Moderate Yellow ({patients.filter((p) => p.riskLevel === 'yellow').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('green')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'green'
              ? 'border-green-500 text-green-700 font-extrabold'
              : 'border-transparent text-green-600/70 hover:text-green-700'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span>Normal Green ({patients.filter((p) => p.riskLevel === 'green').length})</span>
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FEFAF8] border-b border-[#C8877A]/10 text-[#2A1525]/60 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Mothers Registry Name</th>
                <th className="py-4 px-6">GA & Trimester</th>
                <th className="py-4 px-6">Vitals (Latest)</th>
                <th className="py-4 px-6">Maternal Risk State</th>
                <th className="py-4 px-6">ASHA Liaison</th>
                <th className="py-4 px-6 text-right">Actions Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8877A]/5 text-sm">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const latestVitals = patient.vitalsHistory[patient.vitalsHistory.length - 1];

                  return (
                    <tr key={patient.id} className="hover:bg-[#FEFAF8]/50 transition-colors">
                      {/* Name & Basic details */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <Link
                            href={`/doctor/patient/${patient.id}`}
                            className="font-serif font-bold text-base text-[#2A1525] hover:text-[#C8877A] hover:underline"
                          >
                            {patient.name}
                          </Link>
                          <span className="text-xs text-[#2A1525]/50 mt-0.5">
                            Age: {patient.age} yrs • Blood: {patient.bloodGroup} • {patient.village}
                          </span>
                        </div>
                      </td>

                      {/* GA & Trimester */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#2A1525]">
                            Week {patient.week}
                          </span>
                          <span className="text-[11px] text-[#2A1525]/60">
                            Trimester {patient.trimester}
                          </span>
                        </div>
                      </td>

                      {/* Vitals */}
                      <td className="py-4 px-6">
                        {latestVitals ? (
                          <div className="flex flex-col space-y-0.5 text-xs">
                            <span className="font-medium text-[#2A1525]">
                              BP:{' '}
                              <strong
                                className={
                                  latestVitals.systolic >= 140 || latestVitals.diastolic >= 90
                                    ? 'text-red-500 font-bold'
                                    : 'text-[#2A1525]'
                                }
                              >
                                {latestVitals.systolic}/{latestVitals.diastolic}
                              </strong>{' '}
                              mmHg
                            </span>
                            <span className="text-[#2A1525]/70">
                              SpO₂:{' '}
                              <strong
                                className={
                                  latestVitals.spo2 < 95 ? 'text-red-500 font-bold' : 'text-[#2A1525]'
                                }
                              >
                                {latestVitals.spo2}%
                              </strong>{' '}
                              • FHR:{' '}
                              <strong
                                className={
                                  latestVitals.fhr > 160 || latestVitals.fhr < 110
                                    ? 'text-red-500 font-bold'
                                    : 'text-[#2A1525]'
                                }
                              >
                                {latestVitals.fhr}
                              </strong>{' '}
                              bpm
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#2A1525]/40 italic">No Vitals Logged</span>
                        )}
                      </td>

                      {/* Risk Indicators */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`w-fit text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              patient.riskLevel === 'red'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : patient.riskLevel === 'yellow'
                                ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                : 'bg-green-50 text-green-600 border border-green-100'
                            }`}
                          >
                            {patient.riskLevel === 'red'
                              ? 'Severe Risk'
                              : patient.riskLevel === 'yellow'
                              ? 'Moderate Risk'
                              : 'Normal'}
                          </span>
                          <span className="text-[10px] text-[#2A1525]/60 line-clamp-1 max-w-[150px]">
                            {patient.riskReasons.join(', ') || 'No anomalies'}
                          </span>
                        </div>
                      </td>

                      {/* ASHA */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-[#2A1525]">
                              {patient.assignedAshaName}
                            </span>
                            <span className="text-[10px] text-[#2A1525]/50">
                              Adherence: <strong className={patient.complianceRate < 70 ? 'text-red-500' : 'text-green-600'}>{patient.complianceRate}%</strong>
                            </span>
                          </div>
                          <Link
                            href={`/doctor/messages?recipient=${patient.assignedAshaName}`}
                            className="p-1 text-[#C8877A] hover:bg-[#FEFAF8] border border-[#C8877A]/10 rounded"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/doctor/patient/${patient.id}`}
                            className="px-2.5 py-1.5 bg-[#FEFAF8] text-[#2A1525] border border-[#C8877A]/20 hover:border-[#C8877A] hover:bg-[#C8877A]/10 transition text-xs font-bold rounded-lg"
                          >
                            Open File
                          </Link>
                          {patient.riskLevel === 'red' && (
                            <button
                              onClick={() => setShowSOSModal(patient.id)}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white transition text-xs font-bold rounded-lg flex items-center space-x-1"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>Escalate SOS</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[#2A1525]/40 italic">
                    No matching mothers found in registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                  onClick={() => setShowSOSModal(null)}
                  className="px-4 py-2 border border-[#C8877A]/20 text-xs font-bold text-[#2A1525]/70 rounded-lg hover:bg-[#FEFAF8] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSOSSubmit(showSOSModal)}
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
