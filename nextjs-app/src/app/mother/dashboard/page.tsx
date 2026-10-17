'use client';

import { useState, useEffect } from 'react';
import {
  Heart, Calendar, CheckCircle, Clock,
  AlertTriangle, ShieldCheck, Activity, Moon, Footprints
} from 'lucide-react';
import MotherShell from '../components/MotherShell';
import { useLanguage } from '../components/LanguageContext';
import { alertsData, appointmentHistory } from '../data';

export default function DashboardPage() {
  return (
    <MotherShell>
      <DashboardContent />
    </MotherShell>
  );
}

function DashboardContent() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Simulate skeleton loading state for performance feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const latestAlert = alertsData[0]; // Folic acid/Iron or hydration alert
  const upcomingAppointment = appointmentHistory.find(apt => apt.status === 'upcoming') || appointmentHistory[3];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. GREETING & RING CONNECTION STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#E8E4F0] tracking-tight">
            {t('greeting')}
          </h1>
          <p className="text-[#8A7A92] text-xs mt-1 font-mono">
            {t('greetingSub')}
          </p>
        </div>

        {/* 2. RING CONNECTION STATUS */}
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 min-w-[240px]">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[#E8E4F0] text-xs font-medium">{t('ringConnected')}</span>
              <span className="text-[10px] text-emerald-400 font-mono">82%</span>
            </div>
            <p className="text-[10px] text-[#8A7A92] mt-0.5 font-mono">
              Synced 2m ago · Signal Strong
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 3. LATEST WELLNESS SUMMARY */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
              <h2 className="text-xs uppercase tracking-wider text-[#8A7A92] font-semibold flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#C8877A]" />
                Latest Wellness Summary
              </h2>
              <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">
                LOW RISK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Daily Sleep */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8A7A92] text-xs">
                  <Moon size={14} />
                  <span>Sleep Duration</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-mono text-[#E8E4F0]">6.5</span>
                  <span className="text-xs text-[#8A7A92]">hrs</span>
                </div>
                <p className="text-[10px] text-amber-400/80 mt-1.5 font-mono">Below 8h target</p>
              </div>

              {/* Steps/Activity */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8A7A92] text-xs">
                  <Footprints size={14} />
                  <span>Steps Today</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-mono text-[#E8E4F0]">4,643</span>
                  <span className="text-xs text-[#8A7A92]">steps</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-1.5 font-mono">Moderate activity</p>
              </div>

              {/* Heart Rate / Vitals */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#8A7A92] text-xs">
                  <Heart size={14} />
                  <span>Resting HR</span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-mono text-[#E8E4F0]">74</span>
                  <span className="text-xs text-[#8A7A92]">bpm</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-1.5 font-mono">Normal (Stable)</p>
              </div>
            </div>

            <div className="bg-[#C8877A]/[0.02] border border-[#C8877A]/10 rounded-xl p-4 flex items-start gap-3">
              <Activity size={16} className="text-[#C8877A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#E8E4F0] text-xs font-medium">Daily Clinical Insight</p>
                <p className="text-[#8A7A92] text-[11px] mt-1 leading-relaxed">
                  Your resting heart rate and blood pressure remain stable within your target baseline. Sleep duration is slightly low; prioritize 8 hours of rest to optimize recovery as you progress in the third trimester.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ALERTS & APPOINTMENTS */}
        <div className="space-y-5">
          {/* 4. LATEST ALERT */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-wider text-[#8A7A92] font-semibold flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#C8877A]" />
                Latest Alert
              </h2>
              <span className="text-[10px] text-[#8A7A92]/60 font-mono">2h ago</span>
            </div>

            {latestAlert ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 border-l-2 border-l-[#C8877A]">
                <p className="text-xs text-[#E8E4F0] font-medium">{latestAlert.title}</p>
                <p className="text-[11px] text-[#8A7A92] mt-1 leading-relaxed">
                  {latestAlert.description}
                </p>
                <div className="mt-3">
                  <button className="px-2.5 py-1 rounded bg-[#C8877A]/10 text-[#C8877A] text-[10px] font-semibold uppercase hover:bg-[#C8877A]/20 transition-all cursor-pointer">
                    Acknowledge
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8A7A92] py-2">No active alerts.</p>
            )}
          </div>

          {/* 5. UPCOMING APPOINTMENT */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs uppercase tracking-wider text-[#8A7A92] font-semibold flex items-center gap-2">
              <Calendar size={14} className="text-[#C8877A]" />
              Upcoming Appointment
            </h2>

            {upcomingAppointment ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[#E8E4F0] text-sm font-medium">{upcomingAppointment.type}</p>
                  <p className="text-xs text-[#8A7A92] mt-0.5">
                    {upcomingAppointment.doctor} · {upcomingAppointment.specialization}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#E8E4F0] bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5">
                  <Clock size={13} className="text-[#C8877A]" />
                  <span className="font-mono">{upcomingAppointment.date} @ {upcomingAppointment.time}</span>
                </div>

                <p className="text-[10px] text-[#8A7A92]">
                  📍 {upcomingAppointment.location}
                </p>

                {upcomingAppointment.checklist && upcomingAppointment.checklist.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.04]">
                    <p className="text-[10px] text-[#8A7A92] uppercase font-semibold mb-1.5">Preparation Checklist</p>
                    <div className="space-y-1.5">
                      {upcomingAppointment.checklist.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-[#8A7A92]">
                          <CheckCircle size={10} className="text-emerald-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#8A7A92]">No upcoming appointments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/10 rounded" />
          <div className="h-4 w-72 bg-white/5 rounded" />
        </div>
        <div className="h-14 w-60 bg-white/5 rounded-xl" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
            <div className="h-4 w-36 bg-white/10 rounded mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-white/5 rounded-xl" />
              <div className="h-24 bg-white/5 rounded-xl" />
              <div className="h-24 bg-white/5 rounded-xl" />
            </div>
            <div className="h-16 bg-white/5 rounded-xl" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-3">
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="h-20 bg-white/5 rounded-xl" />
          </div>
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-3">
            <div className="h-4 w-36 bg-white/10 rounded" />
            <div className="h-24 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
