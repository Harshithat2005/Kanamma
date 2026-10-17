'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Activity,
  ChevronRight,
  BarChart3,
  Zap,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AshaShell from '../components/AshaShell';
import { useOffline } from '../components/OfflineContext';

interface AIObservation {
  id: string;
  motherName: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  explanation: string;
  recommendation: string;
  metric: string;
  timestamp: string;
}

const aiObservations: AIObservation[] = [
  {
    id: 'ai1',
    motherName: 'Sujata Gowda',
    severity: 'critical',
    title: 'Severe Pre-eclampsia Indicators',
    explanation: 'Systolic blood pressure spiked to 162 mmHg (threshold: 140 mmHg). Diastolic trending upwards over 4 consecutive readings. Heart rate variability (HRV) dropped below 25ms, indicating acute physiological stress. No fetal movement reported in 6 hours.',
    recommendation: 'Immediate transport to District Hospital. Administer MgSO4 per emergency protocol. Continuous BP monitoring every 15 minutes until stabilized.',
    metric: 'BP: 162/104 mmHg',
    timestamp: '18 minutes ago',
  },
  {
    id: 'ai2',
    motherName: 'Radha Naik',
    severity: 'critical',
    title: 'Uncontrolled Gestational Diabetes',
    explanation: 'Fasting blood sugar recorded at 142 mg/dL (target: <95 mg/dL). Ring temperature and activity charts indicate metabolic instability. 3 missed Metformin doses this week detected via compliance tracker.',
    recommendation: 'Urgent endocrinology review. Consider switching to insulin therapy if oral medications continue to fail. Enforce strict dietary control and daily glucose logging.',
    metric: 'FBS: 142 mg/dL',
    timestamp: '45 minutes ago',
  },
  {
    id: 'ai3',
    motherName: 'Kavitha Raj',
    severity: 'warning',
    title: 'Moderate Anemia with Low Compliance',
    explanation: 'Hemoglobin level at 8.4 g/dL (threshold: 10 g/dL for pregnancy). Iron supplement compliance dropped to 43% over the past 7 days. Ring sync has been offline for 12 hours, limiting continuous monitoring.',
    recommendation: 'Schedule home visit to assess ring status and encourage iron supplement adherence. Consider IV iron infusion referral if Hb drops below 8.0 g/dL.',
    metric: 'Hb: 8.4 g/dL',
    timestamp: '2 hours ago',
  },
  {
    id: 'ai4',
    motherName: 'Priya Sharma',
    severity: 'warning',
    title: 'Mild Gestational Hypertension Trend',
    explanation: 'Systolic BP has increased from 122 to 134 mmHg over 4 days. Sleep quality metrics from ring show average 6.2 hours (below recommended 7-8 hours). Mild pedal edema reported at last ANC visit.',
    recommendation: 'Increase BP check frequency to twice weekly. Advise low-sodium diet and adequate rest. Monitor for proteinuria at next visit.',
    metric: 'BP: 134/86 mmHg',
    timestamp: '3 hours ago',
  },
  {
    id: 'ai5',
    motherName: 'Amanya Reddy',
    severity: 'info',
    title: 'All Vitals Within Normal Range',
    explanation: 'Continuous ring monitoring shows stable heart rate (70-75 BPM), normal temperature (36.6-36.8C), and healthy sleep patterns (7.5 hours average). Supplement compliance at 100% for the past 14 days.',
    recommendation: 'Continue standard prenatal care. No intervention required. Next routine ANC scheduled for June 2, 2025.',
    metric: 'Risk Score: 12%',
    timestamp: '1 hour ago',
  },
];

// Heatmap data for risk distribution
const riskHeatmapData = [
  { village: 'Ramapura', critical: 1, warning: 2, stable: 5 },
  { village: 'Hosur', critical: 1, warning: 1, stable: 4 },
  { village: 'Kanakapura', critical: 1, warning: 0, stable: 3 },
];

// Weekly trend data
const weeklyRiskTrend = [
  { week: 'W1', highRisk: 1, moderate: 2, low: 15 },
  { week: 'W2', highRisk: 2, moderate: 3, low: 13 },
  { week: 'W3', highRisk: 2, moderate: 2, low: 14 },
  { week: 'W4', highRisk: 2, moderate: 2, low: 14 },
];

export default function AshaInsights() {
  const { offlineMothers } = useOffline();
  const [expandedObs, setExpandedObs] = useState<string | null>(null);

  const criticalCount = offlineMothers.filter((m) => m.riskLevel === 'red').length;
  const warningCount = offlineMothers.filter((m) => m.riskLevel === 'yellow').length;
  const stableCount = offlineMothers.filter((m) => m.riskLevel === 'green').length;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50/40',
          badge: 'bg-red-500 text-white',
          icon: 'text-red-500',
        };
      case 'warning':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50/40',
          badge: 'bg-amber-500 text-white',
          icon: 'text-amber-500',
        };
      default:
        return {
          border: 'border-emerald-200',
          bg: 'bg-emerald-50/40',
          badge: 'bg-emerald-500 text-white',
          icon: 'text-emerald-500',
        };
    }
  };

  return (
    <AshaShell>
      <div className="space-y-6 pb-12">

        {/* ── RISK DISTRIBUTION SUMMARY CARDS ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="bg-red-50/50 border border-red-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-red-600">{criticalCount}</p>
              <p className="text-xs text-red-500 font-semibold">Critical Risk Mothers</p>
              <p className="text-[10px] text-[#8A7A82] mt-0.5">Requires immediate field intervention</p>
            </div>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-amber-600">{warningCount}</p>
              <p className="text-xs text-amber-500 font-semibold">Moderate Attention</p>
              <p className="text-[10px] text-[#8A7A82] mt-0.5">Trending indicators need monitoring</p>
            </div>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-emerald-600">{stableCount}</p>
              <p className="text-xs text-emerald-500 font-semibold">Stable & Healthy</p>
              <p className="text-[10px] text-[#8A7A82] mt-0.5">Vitals within nominal clinical ranges</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── AI OBSERVATIONS FEED ── */}
        <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#C8877A]" />
              <h3 className="font-serif text-lg font-bold text-[#2A1525]">Kannamma AI Observations</h3>
            </div>
            <span className="text-[10px] text-[#C8877A] font-mono font-semibold bg-[#C8877A]/10 px-2.5 py-1 rounded-full">
              {aiObservations.length} Active Alerts
            </span>
          </div>

          <div className="space-y-4">
            {aiObservations.map((obs) => {
              const styles = getSeverityStyles(obs.severity);
              const isExpanded = expandedObs === obs.id;

              return (
                <motion.div
                  key={obs.id}
                  layout
                  className={`${styles.bg} border ${styles.border} rounded-2xl overflow-hidden transition-all`}
                >
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedObs(isExpanded ? null : obs.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.bg}`}>
                        {obs.severity === 'critical' ? (
                          <Zap className={`w-5 h-5 ${styles.icon} animate-pulse`} />
                        ) : obs.severity === 'warning' ? (
                          <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
                        ) : (
                          <ShieldCheck className={`w-5 h-5 ${styles.icon}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                            {obs.severity}
                          </span>
                          <span className="text-[10px] font-semibold text-[#C8877A]">{obs.motherName}</span>
                          <span className="text-[10px] font-mono text-[#8A7A82]">{obs.metric}</span>
                        </div>
                        <p className="text-xs font-bold text-[#2A1525] mt-1">{obs.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] text-[#8A7A82] font-mono hidden md:block">{obs.timestamp}</span>
                      <ChevronRight className={`w-4 h-4 text-[#8A7A82] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <div className="bg-white/60 border border-white/80 rounded-xl p-3 space-y-2">
                        <h5 className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider">Clinical Analysis</h5>
                        <p className="text-xs text-[#8A7A82] leading-relaxed">{obs.explanation}</p>
                      </div>

                      <div className="bg-[#2A1525]/[0.03] border border-[#2A1525]/[0.06] rounded-xl p-3 space-y-2">
                        <h5 className="text-[10px] font-bold text-[#C8877A] uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Recommended Action
                        </h5>
                        <p className="text-xs text-[#2A1525] leading-relaxed font-medium">{obs.recommendation}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── ANALYTICS CHARTS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Village Risk Heatmap */}
          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-[#C8877A]" /> Village Risk Distribution
            </h4>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskHeatmapData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5E8E6" />
                  <XAxis dataKey="village" tick={{ fontSize: 10 }} stroke="#8A7A82" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#8A7A82" />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                  <Bar dataKey="critical" name="Critical" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="warning" name="Warning" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stable" name="Stable" fill="#4CAF9A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[10px] text-[#8A7A82]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Warning</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#4CAF9A]" /> Stable</span>
            </div>
          </div>

          {/* Weekly Risk Trends */}
          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-[#C8877A]" /> Weekly Risk Score Progression
            </h4>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRiskTrend} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5E8E6" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#8A7A82" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#8A7A82" />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                  <Bar dataKey="highRisk" name="High Risk" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="low" name="Low Risk" stackId="a" fill="#4CAF9A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-[#8A7A82] text-center italic">
              Kannamma AI analyses ring telemetry, ANC records, and compliance data across all registered mothers.
            </p>
          </div>
        </div>

        {/* ── SYSTEM CONFIDENCE FOOTER ── */}
        <div className="bg-[#2A1525] text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-[#D8A48F]" />
            <div>
              <p className="text-xs font-semibold">Kannamma AI Engine v2.4</p>
              <p className="text-[10px] text-[#FEFAF8]/60">Powered by maternal health intelligence models trained on 50,000+ Indian pregnancy records.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#FEFAF8]/40">
            <span>Last Analysis: 18 min ago</span>
            <span className="text-[#4CAF9A] font-semibold">Model Confidence: 94.2%</span>
          </div>
        </div>
      </div>
    </AshaShell>
  );
}
