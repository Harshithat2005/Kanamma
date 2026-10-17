'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  Users,
  ShieldAlert,
  FileSpreadsheet,
  PhoneCall,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const { patients, reports, referrals } = useDoctorData();

  // Metrics calculations
  const totalPatients = patients.length;
  const redRiskCount = patients.filter((p) => p.riskLevel === 'red').length;
  const yellowRiskCount = patients.filter((p) => p.riskLevel === 'yellow').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const activeSOSReferrals = referrals.filter((r) => r.status !== 'admitted');

  // Hardcode schedule slots for a clinical feel
  const scheduleSlots = [
    { time: '09:00', patientName: 'Priyanka Gowda', type: 'High BP Review', status: 'missed' },
    { time: '10:15', patientName: 'Kavitha Ramasamy', type: 'Anemia Hb Follow-up', status: 'completed' },
    { time: '11:30', patientName: 'Anjali Sharma', type: 'Routine Prenatal Scan', status: 'completed' },
    { time: '14:00', patientName: 'Meera Krishnan', type: 'GDM Glucose Log Review', status: 'pending' },
    { time: '15:30', patientName: 'Savitha Patil', type: 'Twins Doppler Check', status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
            {t('clinicalOverview')}
          </h1>
          <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
            Real-time maternal monitoring, clinic workflow and emergency triage control
          </p>
        </div>
        <div className="text-xs text-[#2A1525]/50 font-medium bg-[#FFFFFF] border border-[#C8877A]/15 px-3 py-1.5 rounded-lg shadow-sm">
          System Clock: <span className="text-[#2A1525] font-semibold">2026-05-21 19:00</span>
        </div>
      </div>

      {/* Critical SOS Alarm Banner */}
      {activeSOSReferrals.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl shadow-sm animate-pulse flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-red-800 text-base">
                CRITICAL: Emergency SOS Transit Active
              </h4>
              <p className="text-xs text-red-700 font-sans font-medium mt-0.5">
                {activeSOSReferrals[0].patientName} is being transferred to {activeSOSReferrals[0].targetHospital} due to: {activeSOSReferrals[0].reason}
              </p>
            </div>
          </div>
          <Link
            href="/doctor/emergency"
            className="flex items-center space-x-1.5 text-xs font-bold text-red-800 hover:text-red-950 transition bg-red-100 hover:bg-red-200 px-3.5 py-1.5 rounded-lg border border-red-300 w-fit"
          >
            <span>Open Emergency Cockpit</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 5 Core Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Active Patients */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#C8877A]/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2A1525]/60 uppercase tracking-wider">
              {t('activePatients')}
            </span>
            <div className="p-2 bg-[#FEFAF8] rounded-lg border border-[#C8877A]/10">
              <Users className="h-4.5 w-4.5 text-[#C8877A]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">{totalPatients}</span>
            <div className="text-[10px] text-green-600 font-semibold flex items-center space-x-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>2 Registered today</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Consultations */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#C8877A]/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2A1525]/60 uppercase tracking-wider">
              {t('todayConsultations')}
            </span>
            <div className="p-2 bg-[#EDE4F5] rounded-lg border border-[#C4A8D4]/10">
              <Clock className="h-4.5 w-4.5 text-[#C4A8D4]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">5</span>
            <div className="text-[10px] text-[#2A1525]/50 font-medium mt-1">
              2 completed • 3 pending
            </div>
          </div>
        </div>

        {/* Metric 3: High-Risk Alerts */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#C8877A]/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2A1525]/60 uppercase tracking-wider">
              {t('highRiskAlerts')}
            </span>
            <div className="p-2 bg-red-50 rounded-lg border border-red-100">
              <ShieldAlert className="h-4.5 w-4.5 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-red-600">{redRiskCount}</span>
            <div className="text-[10px] text-[#2A1525]/60 font-semibold flex items-center space-x-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              <span>{yellowRiskCount} moderate cases</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Reports */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#C8877A]/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2A1525]/60 uppercase tracking-wider">
              {t('pendingReports')}
            </span>
            <div className="p-2 bg-[#FEFAF8] rounded-lg border border-[#C8877A]/10">
              <FileSpreadsheet className="h-4.5 w-4.5 text-[#C8877A]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">{pendingReportsCount}</span>
            <div className="text-[10px] text-[#C4A8D4] font-semibold mt-1">
              Needs critical review
            </div>
          </div>
        </div>

        {/* Metric 5: SOS Referrals */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#C8877A]/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2A1525]/60 uppercase tracking-wider">
              {t('activeReferrals')}
            </span>
            <div className="p-2 bg-red-50 rounded-lg border border-red-100">
              <PhoneCall className="h-4.5 w-4.5 text-red-600 animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-[#2A1525]">{activeSOSReferrals.length}</span>
            <div className="text-[10px] text-[#2A1525]/50 font-medium mt-1">
              Transit tracked live
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: High-Risk Roster & Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: High-Risk Cases (Span 2) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A1525]">
                Critical Maternal Watchlist
              </h3>
              <p className="text-xs text-[#2A1525]/60 font-medium mt-0.5">
                Priority monitoring roster for pregnancy anomalies, hypertension, or low compliance
              </p>
            </div>
            <Link
              href="/doctor/queue"
              className="text-xs font-bold text-[#C8877A] hover:underline flex items-center space-x-1"
            >
              <span>View Full Queue</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#C8877A]/5">
            {patients
              .filter((p) => p.riskLevel === 'red' || p.riskLevel === 'yellow')
              .map((patient) => (
                <div
                  key={patient.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#2A1525] hover:text-[#C8877A] transition text-base">
                        {patient.name}
                      </span>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        patient.riskLevel === 'red'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                      }`}>
                        {patient.riskLevel === 'red' ? 'Severe Risk' : 'Moderate'}
                      </span>
                      <span className="text-xs text-[#2A1525]/60 font-medium">
                        Week {patient.week} (T{patient.trimester})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {patient.riskReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="bg-[#FEFAF8] border border-[#C8877A]/10 text-[#2A1525]/80 text-[10px] px-2 py-0.5 rounded font-medium"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-[11px] text-[#2A1525]/60">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-[#C8877A]" />
                        <span>{patient.village}</span>
                      </div>
                      <div>
                        <span>Adherence: <strong className={patient.complianceRate < 70 ? 'text-red-500' : 'text-green-600'}>{patient.complianceRate}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/doctor/patient/${patient.id}`}
                      className="px-3 py-1.5 text-xs font-bold bg-[#FEFAF8] border border-[#C8877A]/20 rounded-lg hover:bg-[#C8877A]/10 hover:border-[#C8877A] transition text-[#2A1525]"
                    >
                      Open Dossier
                    </Link>
                    <Link
                      href={`/doctor/prescriptions?patientId=${patient.id}`}
                      className="px-3 py-1.5 text-xs font-bold bg-[#C8877A] hover:bg-[#C8877A]/90 text-white rounded-lg transition"
                    >
                      Prescribe
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Column: Daily Clinical Schedule */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#C8877A]/10 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2A1525]">
              Today&apos;s Schedule
            </h3>
            <p className="text-xs text-[#2A1525]/60 font-medium mt-0.5">
              Scheduled clinical check-ins, report review logs and consultations
            </p>
          </div>

          <div className="space-y-3">
            {scheduleSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  slot.status === 'completed'
                    ? 'bg-green-50/30 border-green-100'
                    : slot.status === 'missed'
                    ? 'bg-red-50/30 border-red-100'
                    : 'bg-[#FEFAF8] border-[#C8877A]/15'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-xs font-bold text-[#2A1525]/70 bg-[#FFFFFF] border border-[#C8877A]/10 px-2 py-1 rounded">
                    {slot.time}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#2A1525]">{slot.patientName}</h5>
                    <p className="text-[10px] text-[#2A1525]/60 font-medium mt-0.5">{slot.type}</p>
                  </div>
                </div>

                <div>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    slot.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : slot.status === 'missed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
