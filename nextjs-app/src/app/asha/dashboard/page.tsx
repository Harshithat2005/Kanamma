'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  AlertOctagon,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Map,
  ChevronRight,
  UserCheck,
  Info
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { useLanguage } from '../components/LanguageContext';
import { villageClusters, initialTasks, initialEmergencies } from '../data';
type ApiMother = {
  id: string;
  name: string;
  age: number;
  phone: string | null;
  address: string | null;
  village: string | null;
  district: string | null;
  bloodGroup: string | null;
  gestationalWeek: number | null;
  hbLevel: number | null;
  systolicBP: number | null;
  diastolicBP: number | null;
  bloodSugar: number | null;
  bodyTemp: number | null;
  heartRate: number | null;
  riskAssessments: {
    id: string;
    riskLevel: string;
    highRiskProbability: number | null;
    midRiskProbability: number | null;
    lowRiskProbability: number | null;
    modelVersion: string;
    createdAt: string;
  }[];
};
export default function AshaDashboard() {
  const { t } = useLanguage();

  // ── REAL DATABASE DATA ──
  const [apiMothers, setApiMothers] = useState<ApiMother[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Local state for interactive tasks
  const [tasks, setTasks] = useState(initialTasks);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
};
  // ── FETCH MOTHERS FROM POSTGRESQL ──
  useEffect(() => {
    const fetchMothers = async () => {
      try {
        setLoading(true);
        setApiError('');

        const response = await fetch('/api/mothers');

        if (!response.ok) {
          throw new Error('Failed to fetch mothers');
        }

        const data = await response.json();

        setApiMothers(data.mothers || []);
      } catch (error) {
        console.error('Failed to load dashboard mothers:', error);
        setApiError('Unable to load mothers from the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchMothers();
  }, []);

  // ── REAL RISK CLASSIFICATION ──
  const getRiskLevel = (
    mother: ApiMother
  ): 'red' | 'yellow' | 'green' => {
    const latestRisk = mother.riskAssessments?.[0];

    if (latestRisk?.riskLevel === 'high risk') {
      return 'red';
    }

    if (latestRisk?.riskLevel === 'mid risk') {
      return 'yellow';
    }

    return 'green';
  };

  // ── DASHBOARD STATISTICS ──
  const totalMothers = apiMothers.length;

  const highRiskCount = apiMothers.filter(
    (mother) => getRiskLevel(mother) === 'red'
  ).length;

  // ANC tracking is not yet stored in PostgreSQL.
  // Keep this at zero until the Visit/ANC database is implemented.
  const missedAncCount = 0;

  const emergencyCount = initialEmergencies.filter(
    (e) => e.status !== 'resolved'
  ).length;

  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const todayVisits = tasks.filter(
    (task) => task.type === 'visit' && !task.completed
  ).length;

  const completedTasksCount = tasks.filter(
    (task) => task.completed
  ).length;

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasksCount / tasks.length) * 100)
      : 0;

  // ── PRIORITY QUEUE FROM REAL DATABASE DATA ──
  const immediateAttention = apiMothers.filter(
    (mother) => getRiskLevel(mother) === 'red'
  );

  const reviewToday = apiMothers.filter(
    (mother) => getRiskLevel(mother) === 'yellow'
  );

  const stableMothers = apiMothers.filter(
    (mother) => getRiskLevel(mother) === 'green'
  );

  // SVG Geographic Cluster visual scaling
  const maxMothersInCluster = Math.max(...villageClusters.map((v) => v.totalMothers));

  return (
    <AshaShell>
      {loading && (
        <div className="mb-4 bg-white border border-[#C8877A]/15 rounded-2xl p-4 text-sm text-[#8A7A82]">
          Loading live maternal data...
        </div>
      )}

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
          {apiError}
        </div>
      )}
      <div className="space-y-6">
        
        {/* ── TOP OPERATIONAL SUMMARY CARDS (STAGGERED ANIMATIONS) ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {/* Card 1: Total Mothers */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('totalMothers')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#C8877A]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#C8877A]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-[#2A1525]">{totalMothers}</p>
              <p className="text-[10px] text-[#4CAF9A] font-semibold mt-1">100% Registered</p>
            </div>
          </motion.div>

          {/* Card 2: High Risk */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('highRisk')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4 text-red-500" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-red-600">{highRiskCount}</p>
              <p className="text-[10px] text-red-500 font-semibold mt-1">Immediate Protocol</p>
            </div>
          </motion.div>

          {/* Card 3: Missed ANC */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('missedANC')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-amber-600">{missedAncCount}</p>
              <p className="text-[10px] text-amber-500 font-semibold mt-1">Requires Scheduling</p>
            </div>
          </motion.div>

          {/* Card 4: Emergencies */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-all ${
              emergencyCount > 0
                ? 'bg-red-50 border-red-200 animate-pulse'
                : 'bg-white border-[#C8877A]/15'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('emergencies')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-red-600">{emergencyCount}</p>
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {emergencyCount > 0 ? 'AMBULANCE DISPATCHED' : 'All Clear'}
              </p>
            </div>
          </motion.div>

          {/* Card 5: Followups */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('followups')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-[#C8877A]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-[#2A1525]">{pendingTasks}</p>
              <p className="text-[10px] text-[#8A7A82] mt-1">In-Field Tasks</p>
            </div>
          </motion.div>

          {/* Card 6: Today's Visits */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider">
                {t('todayVisits')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-teal-600">{todayVisits}</p>
              <p className="text-[10px] text-teal-500 font-semibold mt-1">Mapped in village</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── CENTRAL LAYOUT GRID (PRIORITY QUEUE & MAP) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: PRIORITY QUEUE SYSTEM (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A1525]">{t('priorityQueue')}</h3>
                  <p className="text-xs text-[#8A7A82]">Auto-prioritized based on maternal ring signals and vitals telemetry</p>
                </div>
                <div className="bg-[#C8877A]/10 text-[#C8877A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Real-time Sorting
                </div>
              </div>

              <div className="space-y-6">
                
                {/* 🚨 Needs Immediate Attention (Red Risk) */}
                {immediateAttention.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-red-500 tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      {t('immediateAttention')} ({immediateAttention.length})
                    </h4>
                    <div className="space-y-3">
                      {immediateAttention.map((mother) => (
                        <div
                          key={mother.id}
                          className="bg-red-50/50 border border-red-200/60 hover:bg-red-50 hover:border-red-300 transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-serif text-sm font-bold text-red-600">
                              {mother.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#2A1525]">{mother.name}</p>
                              <p className="text-xs text-[#8A7A82]">
                               Week {mother.gestationalWeek ?? '—'} · {mother.village ?? 'Unknown'} · Database Sync
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-red-600 bg-red-100/50 px-2 py-0.5 rounded-md max-w-xs truncate font-mono">
                              BP: {mother.systolicBP ?? '—'}/{mother.diastolicBP ?? '—'}</span>
                            <span className="text-[11px] font-semibold text-red-700 bg-red-200/50 px-2.5 py-1 rounded-full text-center">
                              Critical Alert
                            </span>
                            <Link
                              href="/asha/mothers"
                              className="p-1 hover:bg-red-100 rounded-lg text-red-500 transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ⚠️ Review Today (Yellow Risk) */}
                {reviewToday.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-amber-500 tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      {t('reviewToday')} ({reviewToday.length})
                    </h4>
                    <div className="space-y-3">
                      {reviewToday.map((mother) => (
                        <div
                          key={mother.id}
                          className="bg-white border border-[#C8877A]/15 hover:bg-[#FEFAF8] transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-serif text-sm font-bold text-amber-600">
                              {mother.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#2A1525]">{mother.name}</p>
                              <p className="text-xs text-[#8A7A82]">
                                Week {mother.gestationalWeek ?? '—'} · {mother.village ?? 'Unknown'} · Database Sync
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-md font-mono">
                              Hb: {mother.hbLevel} g/dL
                            </span>
                            <span className="text-[10px] text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-md">
                              AI Risk: {(
                                (mother.riskAssessments?.[0]?.midRiskProbability ?? 0) * 100
                              ).toFixed(1)}%
                            </span>
                            <Link
                              href="/asha/mothers"
                              className="p-1 hover:bg-[#F5E8E6] rounded-lg text-[#C8877A] transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ Stable Vitals (Green Risk) */}
                {stableMothers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-emerald-600 tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {t('stable')} ({stableMothers.length})
                    </h4>
                    <div className="space-y-3">
                      {stableMothers.map((mother) => (
                        <div
                          key={mother.id}
                          className="bg-emerald-50/10 border border-emerald-100 hover:bg-emerald-50/30 transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-80 hover:opacity-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-serif text-sm font-bold text-emerald-600">
                              {mother.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#2A1525]">{mother.name}</p>
                              <p className="text-xs text-[#8A7A82]">
                                Week {mother.gestationalWeek ?? '—'} · {mother.village ?? 'Unknown'} · Vitals stable
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-md">
                              Perfect Compliance
                            </span>
                            <Link
                              href="/asha/mothers"
                              className="p-1 hover:bg-emerald-100/50 rounded-lg text-emerald-500 transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: GEOGRAPHIC CLUSTER MAP VIEW & EMERGENCY QUICK ACTION (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Village Hotspots SVG map */}
            <div className="bg-[#2A1525] text-white border border-white/[0.08] rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8877A]/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-4.5 h-4.5 text-[#D8A48F]" />
                <h3 className="font-serif text-base font-bold text-[#FEFAF8]">{t('geoCluster')}</h3>
              </div>
              <p className="text-[11px] text-[#FEFAF8]/60 mb-4">
                Interactive mapping of village clinics and maternal hotspots.
              </p>

              {/* SVG Map Container */}
              <div className="relative w-full h-48 bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Nodes & Connections */}
                  <path d="M 60 70 L 150 50 M 150 50 L 110 130 M 110 130 L 60 70" stroke="rgba(200,135,122,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {villageClusters.map((cluster) => {
                    const radius = 10 + (cluster.totalMothers / maxMothersInCluster) * 12;
                    const scaleX = 2.4; // scale coordinates slightly for SVG
                    const scaleY = 1.3;
                    const cx = cluster.x * scaleX;
                    const cy = cluster.y * scaleY;
                    const isAlert = cluster.emergencies > 0;
                    
                    return (
                      <g
                        key={cluster.id}
                        className="cursor-pointer group"
                        onClick={() => setActiveCluster(cluster.id)}
                      >
                        {/* Glow ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius + 8}
                          className={isAlert ? 'fill-red-500/10 animate-pulse' : 'fill-[#C8877A]/5 group-hover:fill-[#C8877A]/10 transition-all'}
                        />
                        {/* Outer pulsing ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius}
                          className={isAlert ? 'fill-red-500/20 stroke-red-500 stroke-[1.5]' : 'fill-[#C8877A]/10 stroke-[#C8877A]/40 stroke-1 group-hover:stroke-[#C8877A] transition-all'}
                        />
                        {/* Inner node dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          className={isAlert ? 'fill-red-500 animate-ping' : 'fill-[#D8A48F]'}
                        />
                        {/* Text Label */}
                        <text
                          x={cx}
                          y={cy - radius - 4}
                          textAnchor="middle"
                          fill="#FEFAF8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          {cluster.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Cluster Detail Panel */}
              <div className="mt-4 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 min-h-[70px]">
                {activeCluster ? (
                  (() => {
                    const cluster = villageClusters.find((v) => v.id === activeCluster);
                    if (!cluster) return null;
                    return (
                      <div className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[#D8A48F]">{cluster.name} Cluster</span>
                          <span className="text-[10px] text-[#FEFAF8]/50 font-mono">{cluster.phcName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[10px]">
                          <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">
                            <p className="text-white font-bold text-sm">{cluster.totalMothers}</p>
                            <p className="text-[#FEFAF8]/60 uppercase tracking-widest text-[8px]">Mothers</p>
                          </div>
                          <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">
                            <p className="text-amber-400 font-bold text-sm">{cluster.highRiskMothers}</p>
                            <p className="text-[#FEFAF8]/60 uppercase tracking-widest text-[8px]">High Risk</p>
                          </div>
                          <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">
                            <p className={`font-bold text-sm ${cluster.emergencies > 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                              {cluster.emergencies}
                            </p>
                            <p className="text-[#FEFAF8]/60 uppercase tracking-widest text-[8px]">SOS Logs</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-12 text-[11px] text-[#FEFAF8]/40 gap-2">
                    <Info className="w-3.5 h-3.5" />
                    <span>Click nodes on map to load metrics</span>
                  </div>
                )}
              </div>
            </div>

            {/* Daily tasks checklists */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-serif text-base font-bold text-[#2A1525]">{t('taskEngine')}</h3>
                <span className="text-xs font-mono text-[#C8877A] font-semibold">{taskProgress}% Done</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-[#F5E8E6] h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-[#C8877A] h-full transition-all duration-300"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-[#FEFAF8]/60 border-[#C8877A]/10 opacity-60'
                        : 'bg-white border-[#C8877A]/15 hover:bg-[#F5E8E6]/25'
                    }`}
                  >
                    <button className="mt-0.5 text-[#C8877A] focus:outline-none">
                      {task.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold leading-tight ${task.completed ? 'line-through text-[#8A7A82]' : 'text-[#2A1525]'}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-[#8A7A82] mt-0.5 leading-snug">
                        {task.motherName} ({task.description})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AshaShell>
  );
}
