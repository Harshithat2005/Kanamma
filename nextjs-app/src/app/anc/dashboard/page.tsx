'use client';

import React from 'react';
import Link from 'next/link';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { 
  Users, AlertOctagon, Calendar, Activity, 
  ArrowRight, ShieldAlert, CheckCircle2, Clock
} from 'lucide-react';

export default function AncDashboard() {
  const { mothers, appointments, referrals, updateReferralStatus } = useAncData();
  const { t, lang } = useLanguage();

  // Dynamic calculations
  const totalMothersCount = mothers.length;
  const highRiskCount = mothers.filter(m => m.riskLevel === 'red').length;
  const yellowRiskCount = mothers.filter(m => m.riskLevel === 'yellow').length;
  
  // Todays Visits: Scheduled appointments for a mock "today" (May 24, 2026)
  const todaysVisitsCount = appointments.filter(
    apt => apt.date === '2026-05-24' && apt.status === 'scheduled'
  ).length;

  // Active Emergency Referrals (not yet admitted)
  const activeReferrals = referrals.filter(ref => ref.status !== 'admitted');

  // Quick Action Handler for Referral escalation demo
  const handleAdvanceReferral = (id: string, currentStatus: string) => {
    if (currentStatus === 'initiated') {
      updateReferralStatus(id, 'dispatched', 'Ambulance 108 dispatched from District Hub.');
    } else if (currentStatus === 'dispatched') {
      updateReferralStatus(id, 'en_route', 'Patient loaded into vehicle, vitals stable, moving to district hospital.');
    } else if (currentStatus === 'en_route') {
      updateReferralStatus(id, 'admitted', 'Patient successfully admitted at emergency OB-GYN wing.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
            {lang === 'en' ? 'Clinical Overview' : t('dashboard')}
          </h2>
          <p className="text-xs text-[#8A7A82] font-mono">
            {lang === 'en' ? 'Logged in as Coordinator' : ''} Dr. Shreya Roy • Nelamangala PHC Hub
          </p>
        </div>
        <div className="text-[11px] font-mono text-[#8A7A82] bg-white border border-[#C8877A]/15 px-3 py-1.5 rounded-xl shadow-sm self-start md:self-auto">
          System Date: <span className="font-bold text-[#2A1525]">2026-05-24 (Today)</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Mothers */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#8A7A82] uppercase tracking-wider">
              {t('totalMothers')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C8877A]/10 flex items-center justify-center text-[#C8877A]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">{totalMothersCount}</span>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md font-mono">+12% MoM</span>
          </div>
          <p className="text-[10px] text-[#8A7A82] mt-1">Active pregnancies in maternal database</p>
        </div>

        {/* Today's Scheduled Visits */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#8A7A82] uppercase tracking-wider">
              {t('todaysVisits')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C8877A]/10 flex items-center justify-center text-[#C8877A]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">{todaysVisitsCount}</span>
            <span className="text-[10px] font-mono text-[#8A7A82]">visits pending today</span>
          </div>
          <p className="text-[10px] text-[#8A7A82] mt-1">ASHA field check-ins in sector</p>
        </div>

        {/* High Risk Triage Cases */}
        <div className="bg-white border border-red-500/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
              {t('highRiskCases')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-red-600">{highRiskCount}</span>
            <span className="text-xs font-bold text-[#8A7A82] font-mono">/ {highRiskCount + yellowRiskCount} elevated</span>
          </div>
          <p className="text-[10px] text-red-500/80 mt-1">Requires immediate doctor consults</p>
        </div>

        {/* Emergency Referrals */}
        <div className="bg-[#1C0B18] border border-white/[0.04] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-[#FEFAF8]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#E8B4AC] uppercase tracking-wider">
              {t('emergencyReferrals')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#C8877A]/25 flex items-center justify-center text-[#E8B4AC] animate-pulse">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-white">{activeReferrals.length}</span>
            <span className="text-[10px] font-mono text-[#E8B4AC]/80">en-route escort</span>
          </div>
          <p className="text-[10px] text-[#8A7A82] mt-1">Active transit to District Hospital</p>
        </div>
      </div>

      {/* Main Grid: Active Emergency Dispatch & Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Referrals Timeline Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#C8877A]/10 flex justify-between items-center bg-[#FEFAF8]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h3 className="text-sm font-serif font-bold text-[#2A1525]">Active Emergency Dispatch Logs</h3>
              </div>
              <Link href="/anc/referrals" className="text-[11px] font-bold text-[#C8877A] hover:underline flex items-center gap-0.5">
                Manage Referrals <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="p-5 divide-y divide-[#C8877A]/10">
              {activeReferrals.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2 opacity-75" />
                  <p className="text-xs text-[#2A1525] font-bold">All transit dispatch cases completed</p>
                  <p className="text-[10px] text-[#8A7A82]">No mothers currently en-route to emergency units</p>
                </div>
              ) : (
                activeReferrals.map(ref => (
                  <div key={ref.id} className="py-4 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2A1525]">{ref.motherName}</span>
                          <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                            SOS Transit
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A7A82] mt-0.5 font-mono">
                          Source: {ref.sourcePHC} → Target: {ref.targetHospital}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {ref.status !== 'admitted' && (
                          <button
                            onClick={() => handleAdvanceReferral(ref.id, ref.status)}
                            className="text-[10px] font-bold bg-[#C8877A] hover:bg-[#B7776A] text-white px-3 py-1.5 rounded-xl transition-all shadow-sm"
                          >
                            {ref.status === 'initiated' && 'Confirm Dispatch'}
                            {ref.status === 'dispatched' && 'Set En Route'}
                            {ref.status === 'en_route' && 'Confirm Ward Admission'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#FEFAF8] border border-[#C8877A]/10 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] text-[#2A1525] font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#C8877A]" />
                        <span>Transit Timeline (Active Log)</span>
                      </div>
                      
                      {/* Timeline flow */}
                      <div className="relative border-l-2 border-[#C8877A]/20 pl-4 ml-1.5 space-y-2">
                        {ref.timelineLogs.map((log, index) => (
                          <div key={index} className="relative text-[10px]">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#C8877A] shadow-sm" />
                            <span className="font-mono text-[#8A7A82]">{log.time}</span>
                            <span className="text-[#2A1525] font-medium ml-2">— {log.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming scheduled visits table */}
          <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#C8877A]/10 flex justify-between items-center bg-[#FEFAF8]">
              <h3 className="text-sm font-serif font-bold text-[#2A1525]">Upcoming Scheduled ANC Appointments</h3>
              <Link href="/anc/appointments" className="text-[11px] font-bold text-[#C8877A] hover:underline flex items-center gap-0.5">
                View Planner <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FEFAF8] border-b border-[#C8877A]/10 text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider">
                    <th className="px-5 py-3">Mother Name</th>
                    <th className="px-5 py-3">Date / Time</th>
                    <th className="px-5 py-3">Appointment Type</th>
                    <th className="px-5 py-3">Doctor Assigned</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C8877A]/10 text-xs">
                  {appointments.slice(0, 4).map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#FEFAF8]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#2A1525]">{apt.motherName}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-[#2A1525]">{apt.date}</span>
                        <span className="text-[#8A7A82] block text-[10px] font-mono">{apt.time} hrs</span>
                      </td>
                      <td className="px-5 py-3.5 text-[#8A7A82] font-medium">{apt.type}</td>
                      <td className="px-5 py-3.5 text-[#2A1525] font-medium">{apt.assignedDoctor}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono border ${
                          apt.status === 'scheduled' 
                            ? 'bg-[#C8877A]/10 text-[#C8877A] border-[#C8877A]/20'
                            : 'bg-green-500/10 text-green-700 border-green-500/20'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: High Risk Alerts & Operations Desk */}
        <div className="space-y-6">
          {/* Clinical Alert Queue */}
          <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#2A1525] border-b border-[#C8877A]/10 pb-2">
              High-Risk Clinical Alerts
            </h3>
            <div className="space-y-3.5">
              {mothers.filter(m => m.riskLevel === 'red').map(mother => (
                <div key={mother.id} className="p-3 border border-red-200 bg-red-500/05 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-red-950">{mother.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      CRITICAL
                    </span>
                  </div>
                  
                  {/* Key vitals warnings */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-[#8A7A82]">
                    <div>
                      <span className="block text-[8px] uppercase">BP</span>
                      <span className="font-bold text-red-600">{mother.bp}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase">Hemoglobin</span>
                      <span className="font-bold text-[#2A1525]">{mother.hbLevel} g/dL</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase">Glucose</span>
                      <span className={`font-bold ${mother.glucoseLevel > 140 ? 'text-red-600' : 'text-green-600'}`}>
                        {mother.glucoseLevel} mg/dL
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-1 border-t border-red-500/10">
                    <Link 
                      href={`/anc/high-risk?search=${mother.name}`} 
                      className="text-[9px] font-bold text-red-700 hover:underline flex items-center gap-0.5"
                    >
                      View Patient File
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              href="/anc/high-risk" 
              className="text-[10px] font-bold text-[#C8877A] hover:underline block text-center pt-1"
            >
              Open High-Risk Priority Queue →
            </Link>
          </div>

          {/* Quick Operations Desk */}
          <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#2A1525] border-b border-[#C8877A]/10 pb-2">
              Clinical Workflows Desk
            </h3>
            
            <div className="space-y-2">
              <Link 
                href="/anc/appointments"
                className="w-full flex items-center justify-between p-3 border border-[#C8877A]/10 hover:border-[#C8877A]/40 rounded-xl hover:bg-[#FEFAF8] transition-all text-left text-xs font-bold text-[#2A1525]"
              >
                <div>
                  <span>Schedule ANC Appointment</span>
                  <p className="text-[10px] text-[#8A7A82] font-normal mt-0.5">Book field or clinical consults</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C8877A]" />
              </Link>

              <Link 
                href="/anc/referrals"
                className="w-full flex items-center justify-between p-3 border border-red-200/50 hover:border-red-300 rounded-xl hover:bg-red-500/05 transition-all text-left text-xs font-bold text-red-950"
              >
                <div>
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    Escalate Emergency SOS
                  </span>
                  <p className="text-[10px] text-red-700/60 font-normal mt-0.5">Initialize PHC-to-Hospital referral</p>
                </div>
                <ArrowRight className="w-4 h-4 text-red-600" />
              </Link>

              <Link 
                href="/anc/reports"
                className="w-full flex items-center justify-between p-3 border border-[#C8877A]/10 hover:border-[#C8877A]/40 rounded-xl hover:bg-[#FEFAF8] transition-all text-left text-xs font-bold text-[#2A1525]"
              >
                <div>
                  <span>Upload & Verify Labs</span>
                  <p className="text-[10px] text-[#8A7A82] font-normal mt-0.5">Verify blood works or scans</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C8877A]" />
              </Link>

              <Link 
                href="/anc/messages"
                className="w-full flex items-center justify-between p-3 border border-[#C8877A]/10 hover:border-[#C8877A]/40 rounded-xl hover:bg-[#FEFAF8] transition-all text-left text-xs font-bold text-[#2A1525]"
              >
                <div>
                  <span>ASHA Dispatcher</span>
                  <p className="text-[10px] text-[#8A7A82] font-normal mt-0.5">Broadcast SMS or review chat feed</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C8877A]" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
