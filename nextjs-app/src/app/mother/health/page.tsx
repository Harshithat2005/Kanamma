'use client';

import { useState, useMemo, useEffect } from 'react';
import MotherShell from '../components/MotherShell';
import { useLanguage } from '../components/LanguageContext';
import {
  heartRateData,
  weeklyHeartRate,
  weeklyWeight,
  weeklySleep,
  weeklyActivity,
  checkInQuestions,
  supplements,
  vitalRanges,
} from '../data';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Heart,
  Thermometer,
  Droplets,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  Pill,
  Moon,
  Footprints,
  Weight,
  Wifi,
  Battery,
  RefreshCw,
  Check,
} from 'lucide-react';

// ── Custom Tooltip ──────────────────────────
function ChartTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#12121A] border border-white/[0.08] rounded-lg p-2.5 shadow-xl">
      <p className="text-[#8A7A92] text-[10px] font-mono mb-0.5">{label}</p>
      <p className="text-[#E8E4F0] text-xs font-mono font-semibold">
        {payload[0].value} <span className="text-[#8A7A92] font-normal">{unit}</span>
      </p>
    </div>
  );
}

// ── Main Page ───────────────────────────────
function HealthPageContent() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Vital signs tab state
  const [activeVitalTab, setActiveVitalTab] = useState<'heartRate' | 'spo2' | 'temperature' | 'bloodPressure'>('heartRate');

  // Check-in state
  const [checkInStep, setCheckInStep] = useState(0);
  const [checkInAnswers, setCheckInAnswers] = useState<Record<number, string>>({});
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Time range state
  const [timeRange, setTimeRange] = useState('7D');

  // Simulate skeleton load for snappy UI feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Vital tabs config
  const vitalTabs = [
    { key: 'heartRate' as const, label: t('heartRate'), icon: Heart },
    { key: 'spo2' as const, label: t('spo2'), icon: Droplets },
    { key: 'temperature' as const, label: t('temperature'), icon: Thermometer },
    { key: 'bloodPressure' as const, label: t('bloodPressure'), icon: Activity },
  ];

  // Vital chart data per tab
  const vitalChartConfig = useMemo(() => {
    const configs = {
      heartRate: {
        data: heartRateData,
        color: '#C8877A', // Rose gold
        unit: 'BPM',
        range: `${vitalRanges.heartRate.min}-${vitalRanges.heartRate.max} ${vitalRanges.heartRate.unit}`,
        currentValue: 74,
      },
      spo2: {
        data: heartRateData.map(d => ({ ...d, value: Math.round(97 + Math.sin(parseInt(d.time) || 0) * 0.5 + 1.2) })),
        color: '#818CF8', // Indigo
        unit: '%',
        range: `${vitalRanges.spo2.min}-${vitalRanges.spo2.max} ${vitalRanges.spo2.unit}`,
        currentValue: 98,
      },
      temperature: {
        data: heartRateData.map(d => ({ ...d, value: +(36.4 + Math.sin(parseInt(d.time) || 0) * 0.15).toFixed(1) })),
        color: '#FBBF24', // Amber
        unit: '°C',
        range: `${vitalRanges.temperature.min}-${vitalRanges.temperature.max} ${vitalRanges.temperature.unit}`,
        currentValue: 36.6,
      },
      bloodPressure: {
        data: heartRateData.map(d => ({ ...d, value: Math.round(116 + Math.sin(parseInt(d.time) || 0) * 4) })),
        color: '#C4A8D4', // Lavender
        unit: 'mmHg',
        range: `${vitalRanges.systolic.min}-${vitalRanges.systolic.max} / ${vitalRanges.diastolic.min}-${vitalRanges.diastolic.max} mmHg`,
        currentValue: 118,
      },
    };
    return configs[activeVitalTab];
  }, [activeVitalTab]);

  const chartStats = useMemo(() => {
    const values = vitalChartConfig.data.map(d => d.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    };
  }, [vitalChartConfig]);

  // Trend charts config
  const trendCards = [
    {
      title: t('heartRate'),
      data: weeklyHeartRate,
      value: '74',
      unit: 'BPM',
      color: '#C8877A',
      type: 'line' as const,
      icon: Heart,
      insight: t('trendInsight'),
      trend: 'up' as const,
    },
    {
      title: 'Weight',
      data: weeklyWeight,
      value: '63.2',
      unit: 'kg',
      color: '#C4A8D4',
      type: 'line' as const,
      icon: Weight,
      insight: 'Gained 1.1 kg this week — within healthy range',
      trend: 'up' as const,
    },
    {
      title: t('sleep'),
      data: weeklySleep,
      value: '6.6',
      unit: t('hrs'),
      color: '#60A5FA',
      type: 'bar' as const,
      icon: Moon,
      insight: 'Average 6.6 hrs — below 8 hr target',
      trend: 'down' as const,
    },
    {
      title: t('activity'),
      data: weeklyActivity,
      value: '4,643',
      unit: 'steps',
      color: '#34D399',
      type: 'bar' as const,
      icon: Footprints,
      insight: 'Daily average 4,643 steps — moderate activity level',
      trend: 'neutral' as const,
    },
  ];

  // Supplement adherence
  const overallAdherence = 86;

  // Check-in handlers
  const handleCheckInAnswer = (questionId: number, value: string, alert?: string) => {
    setCheckInAnswers(prev => ({ ...prev, [questionId]: value }));
    setActiveAlert(alert || null);
  };

  const handleCheckInNext = () => {
    setActiveAlert(null);
    if (checkInStep < checkInQuestions.length - 1) {
      setCheckInStep(prev => prev + 1);
    } else {
      setCheckInComplete(true);
    }
  };

  if (loading) {
    return <HealthSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ── SECTION 1 — VITAL SIGNS DETAIL ── */}
      <section className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="font-serif text-[#E8E4F0] text-lg">{t('vitalSigns')}</h2>
            <p className="text-[#8A7A92] text-xs">Real-time physiological tracking from Smart Ring</p>
          </div>
          <span className="text-[#8A7A92] text-[10px] font-mono bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.04] self-start sm:self-center">
            {t('lastSynced')}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {vitalTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeVitalTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveVitalTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-[#C8877A]/10 border-[#C8877A]/30 text-[#C8877A]'
                    : 'bg-white/[0.02] border-white/[0.04] text-[#8A7A92] hover:bg-white/[0.04] hover:text-[#E8E4F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Chart View */}
        <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalChartConfig.data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id={`vital-gradient-${activeVitalTab}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={vitalChartConfig.color} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={vitalChartConfig.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#8A7A92"
                  tick={{ fontSize: 9, fill: '#8A7A92' }}
                  axisLine={false}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  stroke="#8A7A92"
                  tick={{ fontSize: 9, fill: '#8A7A92' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip content={<ChartTooltip unit={vitalChartConfig.unit} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={vitalChartConfig.color}
                  strokeWidth={1.5}
                  fill={`url(#vital-gradient-${activeVitalTab})`}
                  dot={false}
                  activeDot={{ r: 4, fill: vitalChartConfig.color, stroke: '#0A0A12', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.04]">
            {[
              { label: 'Minimum', value: chartStats.min },
              { label: 'Average', value: chartStats.avg },
              { label: 'Maximum', value: chartStats.max },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-[#8A7A92] text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-[#E8E4F0] font-mono text-sm font-semibold">
                  {stat.value} <span className="text-[#8A7A92] text-[10px] font-normal">{vitalChartConfig.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-[#8A7A92] font-mono">
          <span>Reference Range: {vitalChartConfig.range}</span>
          <span className="text-emerald-400">● Optimal</span>
        </div>
      </section>

      {/* ── SECTION 2 — HEALTH TRENDS ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[#E8E4F0] text-lg">{t('healthTrends')}</h2>
            <p className="text-[#8A7A92] text-xs">7-day retrospective clinical indicators</p>
          </div>
          <div className="flex gap-1.5 bg-white/[0.03] border border-white/[0.04] p-1 rounded-xl">
            {['7D', '14D', '30D'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#C8877A]/15 text-[#C8877A] font-semibold'
                    : 'text-[#8A7A92] hover:text-[#E8E4F0]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendCards.map(card => {
            const Icon = card.icon;
            const TrendIcon = card.trend === 'up' ? TrendingUp : card.trend === 'down' ? TrendingDown : Minus;
            const trendColor = card.trend === 'up' ? 'text-[#C8877A]' : card.trend === 'down' ? 'text-amber-400' : 'text-[#8A7A92]';

            return (
              <div
                key={card.title}
                className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between gap-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#8A7A92]" />
                    </div>
                    <span className="text-[#E8E4F0] text-xs font-semibold">{card.title}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-mono ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{card.trend.toUpperCase()}</span>
                  </div>
                </div>

                {/* Values & Chart */}
                <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                  <div>
                    <p className="text-2xl font-mono text-[#E8E4F0] font-bold">{card.value}</p>
                    <p className="text-[10px] text-[#8A7A92] uppercase mt-0.5">{card.unit}</p>
                  </div>
                  <div className="h-[55px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {card.type === 'line' ? (
                        <LineChart data={card.data} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
                          <XAxis dataKey="day" hide />
                          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                          <Tooltip content={<ChartTooltip unit={card.unit} />} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={card.color}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={card.data} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
                          <XAxis dataKey="day" hide />
                          <YAxis hide />
                          <Tooltip content={<ChartTooltip unit={card.unit} />} />
                          <Bar dataKey="value" fill={card.color} radius={[2, 2, 0, 0]} opacity={0.85} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insight */}
                <div className="border-t border-white/[0.03] pt-2">
                  <p className="text-[#8A7A92] text-[10px] leading-relaxed font-sans">{card.insight}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3 — DAILY CHECK-IN ── */}
      <section className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-[#E8E4F0] text-lg">{t('dailyCheckIn')}</h2>
            <p className="text-[#8A7A92] text-xs">{t('checkInSub')}</p>
          </div>
          {!checkInComplete && (
            <span className="text-[#8A7A92] text-[10px] font-mono bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.04]">
              {checkInStep + 1} / {checkInQuestions.length}
            </span>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="w-full h-1 bg-white/[0.04] rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#C8877A] rounded-full transition-all duration-300"
            style={{ width: checkInComplete ? '100%' : `${((checkInStep + 1) / checkInQuestions.length) * 100}%` }}
          />
        </div>

        {checkInComplete ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[#E8E4F0] text-sm font-medium">{t('checkInComplete')}</p>
            <p className="text-[#8A7A92] text-[11px] mt-1">Updates have been logged in your ANC digital profile.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[#E8E4F0] text-sm font-medium">
              {t(checkInQuestions[checkInStep].question)}
            </p>

            <div className="flex flex-wrap gap-2">
              {checkInQuestions[checkInStep].options.map(option => {
                const isSelected = checkInAnswers[checkInQuestions[checkInStep].id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleCheckInAnswer(checkInQuestions[checkInStep].id, option.value, option.alert)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#C8877A]/10 border-[#C8877A]/30 text-[#C8877A]'
                        : 'bg-white/[0.02] border-white/[0.04] text-[#8A7A92] hover:bg-white/[0.04] hover:text-[#E8E4F0]'
                    }`}
                  >
                    {t(option.label)}
                  </button>
                );
              })}
            </div>

            {/* Alert banner */}
            {activeAlert && (
              <div className="mt-2.5">
                {activeAlert === 'sosAlert' ? (
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/15 rounded-xl p-3">
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-[11px] leading-relaxed">{t(activeAlert)}</p>
                  </div>
                ) : activeAlert === 'noMovementAlert' || activeAlert === 'telASHA' ? (
                  <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/15 rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-amber-400 text-[11px] leading-relaxed">{t(activeAlert)}</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 bg-purple-500/10 border border-purple-500/15 rounded-xl p-3">
                    <Lightbulb className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <p className="text-purple-400 text-[11px] leading-relaxed">{t(activeAlert)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleCheckInNext}
                disabled={!checkInAnswers[checkInQuestions[checkInStep].id]}
                className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  checkInAnswers[checkInQuestions[checkInStep].id]
                    ? 'bg-[#C8877A] text-white hover:bg-[#C8877A]/95'
                    : 'bg-white/[0.02] text-[#8A7A92]/40 border border-white/[0.04] cursor-not-allowed'
                }`}
              >
                {checkInStep < checkInQuestions.length - 1 ? 'Next' : 'Complete'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION 4 — SUPPLEMENTS & DEVICE STATUS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Supplements */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[#E8E4F0] text-sm font-semibold">{t('supplements')}</h2>
            <span className="text-[10px] text-[#8A7A92] font-mono">Adherence: {overallAdherence}%</span>
          </div>

          <div className="space-y-2">
            {supplements.map(supp => (
              <div
                key={supp.name}
                className="flex items-center justify-between bg-white/[0.01] border border-white/[0.04] rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    supp.takenToday ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[#E8E4F0] text-xs font-medium">{supp.name}</p>
                    <p className="text-[#8A7A92] text-[10px] font-mono">{supp.dosage} &middot; {supp.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {supp.takenToday ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-medium">{t('taken')}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-[#8A7A92]" />
                      <span className="text-[#8A7A92] text-[10px] font-mono">{supp.nextDue}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ring Sensor Status */}
        <div className="bg-[#2A1525]/10 border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-[#E8E4F0] text-sm font-semibold">{t('smartRing')}</h2>
              <button className="bg-white/[0.04] hover:bg-white/[0.08] text-[#E8E4F0] rounded-xl px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer">
                <RefreshCw className="w-3 h-3" />
                {t('syncNow')}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-medium">Monitoring Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-[#8A7A92] text-[10px]">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Signal Strength</span>
              </div>
              <p className="text-[#E8E4F0] text-xs font-semibold mt-1">Excellent</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-[#8A7A92] text-[10px]">
                <Battery className="w-3 h-3 text-emerald-400" />
                <span>Battery Level</span>
              </div>
              <p className="text-[#E8E4F0] text-xs font-semibold mt-1">82%</p>
            </div>
          </div>

          <p className="text-[#8A7A92] text-[10px] font-mono">
            Clinical sensors active: PPG, Temperature, Motion, BLE.
          </p>
        </div>
      </div>
    </div>
  );
}

function HealthSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Vitals chart card */}
      <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-4">
        <div className="h-5 w-40 bg-white/10 rounded" />
        <div className="h-4 w-60 bg-white/5 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-white/5 rounded-lg" />
          <div className="h-8 w-24 bg-white/5 rounded-lg" />
          <div className="h-8 w-24 bg-white/5 rounded-lg" />
        </div>
        <div className="h-[220px] bg-white/5 rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="h-12 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Grid of trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-white/5 rounded-2xl" />
        <div className="h-40 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

// ── Page Export ──────────────────────────────
export default function HealthPage() {
  return (
    <MotherShell>
      <HealthPageContent />
    </MotherShell>
  );
}
