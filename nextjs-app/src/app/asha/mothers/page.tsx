'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Activity,
  ShieldAlert,
  X,
  TrendingUp,
  Battery,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AshaShell from '../components/AshaShell';
import { useOffline } from '../components/OfflineContext';
import { Mother, RiskLevel } from '../data';

type ApiMother = {
  id: string;
  name: string;
  age: number;
  phone: string | null;
  address: string | null;
  village: string | null;
  district: string | null;
  bloodGroup: string | null;
  gravida: number | null;
  gestationalWeek: number | null;
  weight: number | null;
  height: number | null;
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

export default function AshaMothers() {
  const { offlineMothers } = useOffline();

  // ── API / DATABASE STATE ──
  const [apiMothers, setApiMothers] = useState<ApiMother[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // ── FETCH REAL MOTHERS FROM DATABASE ──
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
        console.error('Failed to load mothers:', error);
        setApiError('Unable to load mothers from the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchMothers();
  }, []);

  // ── CONVERT API DATA TO EXISTING UI FORMAT ──
  const databaseMothers: Mother[] = apiMothers.map((mother) => {
    const latestRisk = mother.riskAssessments?.[0];

    let riskLevel: RiskLevel = 'green';

    if (latestRisk?.riskLevel === 'high risk') {
      riskLevel = 'red';
    } else if (latestRisk?.riskLevel === 'mid risk') {
      riskLevel = 'yellow';
    }

    return {
      id: mother.id,
      name: mother.name,
      age: mother.age,
      week: mother.gestationalWeek ?? 0,

      husbandName: 'Not recorded',

      phone: mother.phone ?? '',
      altPhone: '',

      address: mother.address ?? '',
      village: mother.village ?? 'Unknown',
      district: mother.district ?? 'Unknown',

      aadhaar: '',

      bloodGroup: mother.bloodGroup ?? 'Not recorded',
      hbLevel: mother.hbLevel ?? 0,

      riskLevel,

      riskScore: latestRisk
        ? Math.round((latestRisk.highRiskProbability ?? 0) * 100)
        : 0,

      aiRiskExplanation: latestRisk
        ? `AI model classified this mother as ${
            latestRisk.riskLevel
          }. High-risk probability: ${(
            (latestRisk.highRiskProbability ?? 0) * 100
          ).toFixed(1)}%.`
        : 'No AI risk assessment available.',

      emergencyContact: 'Not recorded',
      nearestHospital: 'Not recorded',
      assignedDoctor: 'Not assigned',
      transportAvailable: false,

      ringConnected: false,
      ringBattery: 0,

      // Mother type expects: 'strong' | 'weak' | 'none'
      ringSignal: 'none',

      lastSync: 'No ring data',

      missedCheckins: 0,
      missedMedsCount: 0,

      nextANC: 'Not scheduled',

      heartRateHistory:
        mother.heartRate !== null
          ? [
              {
                time: 'Current',
                value: mother.heartRate,
              },
            ]
          : [],

      bpHistory:
        mother.systolicBP !== null && mother.diastolicBP !== null
          ? [
              {
                time: 'Current',
                systolic: mother.systolicBP,
                diastolic: mother.diastolicBP,
              },
            ]
          : [],

      prescriptions: [],
      ancHistory: [],
    } as Mother;
  });

  // ── SEARCH & FILTER STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [selectedMother, setSelectedMother] = useState<Mother | null>(null);

  // ── FILTERED MOTHERS LIST ──
  const filteredMothers = databaseMothers.filter((mother) => {
    const matchesSearch =
      mother.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mother.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      riskFilter === 'all' || mother.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // ── RISK COLORS ──
  const getRiskPillColors = (risk: RiskLevel) => {
    switch (risk) {
      case 'red':
        return 'bg-red-500/10 text-red-500 border-red-500/20';

      case 'yellow':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';

      case 'green':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <AshaShell>
      <div className="space-y-6 relative min-h-screen pb-12">

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8A7A82]" />

            <input
              type="text"
              placeholder="Search mothers by name, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#C8877A]/20 focus:outline-none focus:border-[#C8877A] text-sm bg-[#FEFAF8]/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <span className="text-xs text-[#8A7A82] flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5" />
              Filter by:
            </span>

            <button
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                riskFilter === 'all'
                  ? 'bg-[#C8877A] text-white border-[#C8877A]'
                  : 'bg-white text-[#2A1525]/75 border-[#C8877A]/20 hover:bg-[#F5E8E6]/25'
              }`}
            >
              All Mothers
            </button>

            <button
              onClick={() => setRiskFilter('red')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                riskFilter === 'red'
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : 'bg-white text-red-500 border-red-500/25 hover:bg-red-50'
              }`}
            >
              Critical (Red)
            </button>

            <button
              onClick={() => setRiskFilter('yellow')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                riskFilter === 'yellow'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-amber-500 border-amber-500/25 hover:bg-amber-50'
              }`}
            >
              Attention (Yellow)
            </button>

            <button
              onClick={() => setRiskFilter('green')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                riskFilter === 'green'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                  : 'bg-white text-emerald-500 border-emerald-500/20 hover:bg-emerald-50'
              }`}
            >
              Stable (Green)
            </button>

          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="bg-white border border-[#C8877A]/10 rounded-3xl p-12 text-center">
            <Activity className="w-8 h-8 text-[#C8877A] mx-auto mb-3 animate-pulse" />

            <p className="text-sm text-[#8A7A82]">
              Loading mothers from database...
            </p>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
            {apiError}
          </div>
        )}

        {/* ── MOTHER CARDS GRID ── */}
        {!loading && !apiError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredMothers.map((mother) => (
              <motion.div
                key={mother.id}
                whileHover={{ y: -3 }}
                className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center font-serif text-lg font-bold text-white shadow-sm">
                        {mother.name.charAt(0)}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#2A1525]">
                          {mother.name}
                        </h4>

                        <p className="text-[11px] text-[#8A7A82]">
                          Week {mother.week} · {mother.village}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold border px-2 py-0.5 rounded-full ${getRiskPillColors(
                        mother.riskLevel
                      )}`}
                    >
                      {mother.riskLevel}
                    </span>

                  </div>

                  {/* Ring Status */}
                  <div className="bg-[#FEFAF8] border border-[#C8877A]/10 rounded-2xl p-3 space-y-2 mb-4">

                    <div className="flex justify-between items-center text-[10px] text-[#8A7A82]">
                      <span>Smart Ring Status</span>

                      <span className="font-mono">
                        {mother.lastSync}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">

                      <div className="flex items-center gap-1">

                        {mother.ringConnected ? (
                          <>
                            <Wifi className="w-3.5 h-3.5 text-[#4CAF9A]" />

                            <span className="font-semibold text-[#4CAF9A]">
                              Connected
                            </span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3.5 h-3.5 text-red-400" />

                            <span className="font-semibold text-red-400">
                              Sync Warning
                            </span>
                          </>
                        )}

                      </div>

                      {mother.ringConnected && (
                        <div className="flex items-center gap-1 font-mono text-[10px] text-[#8A7A82]">
                          <Battery className="w-3.5 h-3.5 text-emerald-500" />
                          {mother.ringBattery}%
                        </div>
                      )}

                    </div>
                  </div>

                  {/* AI Warning */}
                  <p className="text-[11px] text-[#8A7A82] line-clamp-2 italic mb-4 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">

                    <span className="font-semibold text-[#2A1525] not-italic block mb-0.5">
                      Kannamma AI Risk Observation:
                    </span>

                    &quot;{mother.aiRiskExplanation}&quot;

                  </p>

                </div>

                {/* Action Buttons */}
                <div className="border-t border-[#C8877A]/10 pt-4 flex justify-between items-center mt-2">

                  <span className="text-[10px] text-[#8A7A82] font-semibold">
                    Next ANC:{' '}
                    <span className="text-[#2A1525] font-mono">
                      {mother.nextANC}
                    </span>
                  </span>

                  <button
                    onClick={() => setSelectedMother(mother)}
                    className="bg-[#2A1525] hover:bg-[#C8877A] hover:text-white text-[#FEFAF8] text-[11px] font-semibold px-4 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    View Full Profile
                  </button>

                </div>

              </motion.div>
            ))}

            {filteredMothers.length === 0 && (
              <div className="col-span-full bg-white border border-[#C8877A]/10 rounded-3xl p-12 text-center">

                <Search className="w-10 h-10 text-[#8A7A82]/30 mx-auto mb-3" />

                <p className="text-sm text-[#8A7A82]">
                  No registered mothers matched the selection filters.
                </p>

              </div>
            )}

          </div>
        )}

        {/* ── SLIDE-OVER PATIENT DETAILS ── */}
        <AnimatePresence>

          {selectedMother && (
            <>
              {/* Dim backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setSelectedMother(null)}
              />

              {/* Slide-over */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#FEFAF8] border-l border-[#C8877A]/20 shadow-2xl z-50 overflow-y-auto flex flex-col"
              >

                {/* Header */}
                <div className="bg-[#2A1525] text-white p-6 sticky top-0 z-10 flex justify-between items-start">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center font-serif text-2xl font-bold text-white shadow-md">
                      {selectedMother.name.charAt(0)}
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="font-serif text-xl font-bold text-[#FEFAF8]">
                          {selectedMother.name}
                        </h3>

                        <span
                          className={`text-[9px] uppercase font-bold border px-2 py-0.5 rounded-full ${getRiskPillColors(
                            selectedMother.riskLevel
                          )}`}
                        >
                          {selectedMother.riskLevel}
                        </span>

                      </div>

                      <p className="text-xs text-[#FEFAF8]/60 mt-1">
                        Age: {selectedMother.age} · Week{' '}
                        {selectedMother.week} of Pregnancy ·{' '}
                        {selectedMother.village} Village
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() => setSelectedMother(null)}
                    className="p-2 hover:bg-white/10 rounded-full text-white transition-all focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>

                </div>

                {/* Content */}
                <div className="p-6 space-y-6 flex-1">

                  {/* AI Risk Observation */}
                  <div className="bg-purple-50/70 border border-purple-200/50 rounded-2xl p-4 space-y-2">

                    <div className="flex items-center gap-2 text-[#2A1525] font-bold text-xs uppercase tracking-wider">

                      <TrendingUp className="w-4 h-4 text-purple-600 animate-pulse" />

                      Kannamma AI Risk Observation

                    </div>

                    <p className="text-xs text-[#8A7A82] leading-relaxed italic">
                      &quot;{selectedMother.aiRiskExplanation}&quot;
                    </p>

                    <p className="text-[10px] text-[#8A7A82] not-italic">
                      Model output for research/demo purposes; not a clinical
                      diagnosis.
                    </p>

                  </div>

                  {/* Two Column Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Personal Info */}
                    <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 space-y-3">

                      <h4 className="font-serif text-sm font-bold text-[#2A1525] border-b border-[#C8877A]/10 pb-1.5">
                        Personal Details
                      </h4>

                      <div className="text-xs space-y-2 text-[#8A7A82]">

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Husband Name:
                          </span>

                          <span>{selectedMother.husbandName}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Phone:
                          </span>

                          <span className="font-mono">
                            {selectedMother.phone}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Alt Phone:
                          </span>

                          <span className="font-mono">
                            {selectedMother.altPhone}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Aadhaar:
                          </span>

                          <span className="font-mono">
                            {selectedMother.aadhaar || 'Not Linked'}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Blood Group:
                          </span>

                          <span className="font-bold text-[#C8877A]">
                            {selectedMother.bloodGroup}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Hemoglobin (Hb):
                          </span>

                          <span className="font-mono">
                            {selectedMother.hbLevel} g/dL
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Emergency Circle */}
                    <div className="bg-red-50/30 border border-red-100 rounded-2xl p-4 space-y-3">

                      <h4 className="font-serif text-sm font-bold text-red-700 border-b border-red-100 pb-1.5 flex items-center gap-1.5">

                        <ShieldAlert className="w-4 h-4" />

                        Emergency Circle

                      </h4>

                      <div className="text-xs space-y-2 text-[#8A7A82]">

                        <div>
                          <span className="font-semibold text-[#2A1525] block">
                            Emergency Contact:
                          </span>

                          <span>
                            {selectedMother.emergencyContact}
                          </span>
                        </div>

                        <div>
                          <span className="font-semibold text-[#2A1525] block">
                            Hospital:
                          </span>

                          <span>
                            {selectedMother.nearestHospital}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="font-semibold text-[#2A1525]">
                            Assigned Doctor:
                          </span>

                          <span>
                            {selectedMother.assignedDoctor}
                          </span>
                        </div>

                        <div className="flex justify-between">

                          <span className="font-semibold text-[#2A1525]">
                            Transport Arranged:
                          </span>

                          <span
                            className={
                              selectedMother.transportAvailable
                                ? 'text-[#4CAF9A] font-bold'
                                : 'text-red-500 font-bold'
                            }
                          >
                            {selectedMother.transportAvailable
                              ? 'Yes'
                              : 'No (Requires Dispatch)'}
                          </span>

                        </div>

                      </div>
                    </div>

                  </div>

                  {/* TELEMETRY */}
                  <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 space-y-4">

                    <h4 className="font-serif text-sm font-bold text-[#2A1525] flex items-center gap-1.5">

                      <Activity className="w-4 h-4 text-[#C8877A]" />

                      Telemetry Trends (Last Sync)

                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Heart Rate */}
                      <div className="space-y-1">

                        <p className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider text-center">
                          Fetal/Maternal Heart Rate (BPM)
                        </p>

                        <div className="h-36 bg-[#FEFAF8] rounded-xl border border-[#C8877A]/10 p-2">

                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <LineChart
                              data={selectedMother.heartRateHistory}
                            >

                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#F5E8E6"
                              />

                              <XAxis
                                dataKey="time"
                                tick={{ fontSize: 9 }}
                                stroke="#8A7A82"
                              />

                              <YAxis
                                domain={[60, 130]}
                                tick={{ fontSize: 9 }}
                                stroke="#8A7A82"
                              />

                              <Tooltip
                                contentStyle={{
                                  fontSize: '10px',
                                }}
                              />

                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#C8877A"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 4 }}
                              />

                            </LineChart>
                          </ResponsiveContainer>

                        </div>
                      </div>

                      {/* Blood Pressure */}
                      <div className="space-y-1">

                        <p className="text-[11px] font-semibold text-[#8A7A82] uppercase tracking-wider text-center">
                          Blood Pressure Trend (mmHg)
                        </p>

                        <div className="h-36 bg-[#FEFAF8] rounded-xl border border-[#C8877A]/10 p-2">

                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <LineChart
                              data={selectedMother.bpHistory}
                            >

                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#F5E8E6"
                              />

                              <XAxis
                                dataKey="time"
                                tick={{ fontSize: 9 }}
                                stroke="#8A7A82"
                              />

                              <YAxis
                                domain={[60, 170]}
                                tick={{ fontSize: 9 }}
                                stroke="#8A7A82"
                              />

                              <Tooltip
                                contentStyle={{
                                  fontSize: '10px',
                                }}
                              />

                              <Line
                                type="monotone"
                                dataKey="systolic"
                                stroke="#EF4444"
                                strokeWidth={1.5}
                                name="Systolic"
                                dot={{ r: 2 }}
                              />

                              <Line
                                type="monotone"
                                dataKey="diastolic"
                                stroke="#B8906A"
                                strokeWidth={1.5}
                                name="Diastolic"
                                dot={{ r: 2 }}
                              />

                            </LineChart>
                          </ResponsiveContainer>

                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Prescriptions */}
                  <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 space-y-2">

                    <h4 className="font-serif text-sm font-bold text-[#2A1525]">
                      Active Prescriptions
                    </h4>

                    <div className="flex flex-wrap gap-2 pt-1">

                      {selectedMother.prescriptions.length > 0 ? (
                        selectedMother.prescriptions.map((pill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-indigo-50/60 border border-indigo-100/50 text-[#C8877A] px-3 py-1.5 rounded-xl font-medium"
                          >
                            {pill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#8A7A82]">
                          No prescriptions recorded.
                        </span>
                      )}

                    </div>
                  </div>

                  {/* ANC HISTORY */}
                  <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4 space-y-4">

                    <h4 className="font-serif text-sm font-bold text-[#2A1525]">
                      Maternal ANC Check-in Timeline
                    </h4>

                    {selectedMother.ancHistory.length > 0 ? (
                      <div className="relative border-l border-[#C8877A]/25 pl-4 ml-2 space-y-4">

                        {selectedMother.ancHistory.map((visit) => (
                          <div
                            key={visit.visitNum}
                            className="relative"
                          >

                            <span
                              className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                                visit.status === 'completed'
                                  ? 'bg-[#4CAF9A] border-white'
                                  : 'bg-white border-[#C8877A] animate-pulse'
                              }`}
                            />

                            <div className="text-xs">

                              <div className="flex justify-between items-center">

                                <span className="font-bold text-[#2A1525]">
                                  Visit #{visit.visitNum}
                                </span>

                                <span className="font-mono text-[#8A7A82] text-[10px]">
                                  {visit.date}
                                </span>

                              </div>

                              <p className="text-[10px] text-[#8A7A82] mt-0.5">
                                Facility: {visit.facility}
                              </p>

                              {visit.notes && (
                                <p className="bg-[#FEFAF8] border border-[#C8877A]/5 p-2 rounded-lg text-[#8A7A82] italic mt-1 leading-snug">
                                  &quot;{visit.notes}&quot;
                                </p>
                              )}

                              {visit.status === 'completed' && (
                                <div className="flex gap-4 mt-1 font-mono text-[9px] text-[#8A7A82]">

                                  <span>
                                    Weight: {visit.weight} kg
                                  </span>

                                  <span>
                                    BP Logged: {visit.bp}
                                  </span>

                                </div>
                              )}

                            </div>
                          </div>
                        ))}

                      </div>
                    ) : (
                      <p className="text-xs text-[#8A7A82]">
                        No ANC visit history recorded yet.
                      </p>
                    )}

                  </div>

                </div>
              </motion.div>
            </>
          )}

        </AnimatePresence>

      </div>
    </AshaShell>
  );
}