'use client';

import { useState, useRef, useEffect } from 'react';
import MotherShell from '../components/MotherShell';
import { useLanguage } from '../components/LanguageContext';
import { fetusMilestones, maternalTimeline } from '../data';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  Legend,
} from 'recharts';
import {
  Brain,
  Eye,
  Ear,
  Shield,
  ChevronLeft,
  ChevronRight,
  ScanLine,
  FlaskConical,
  Stethoscope,
  Star,
  Syringe,
  Activity,
  Heart,
  Bone,
} from 'lucide-react';

// ── Percentile Reference Data ──
const growthChartData = (() => {
  const weeks = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
  const p50 =   [1, 4, 14, 43, 100, 190, 300, 430, 600, 800, 1005, 1300, 1700, 2150, 2600, 3000, 3400];
  const p10 =   [1, 3, 11, 35, 80, 155, 245, 355, 490, 660, 830, 1080, 1420, 1800, 2180, 2530, 2870];
  const p90 =   [1, 5, 17, 52, 125, 230, 365, 520, 730, 970, 1210, 1560, 2020, 2530, 3060, 3500, 3950];

  return weeks.map((w, i) => ({
    week: w,
    actual: p50[i],
    p10: p10[i],
    p50: p50[i],
    p90: p90[i],
  }));
})();

const upcomingWeeks = [
  {
    week: 29,
    highlights: 'Eyes can focus on large objects. Bones absorbing calcium.',
    tests: 'Continue kick count monitoring',
  },
  {
    week: 30,
    highlights: 'Brain growing rapidly. Can distinguish light from dark.',
    tests: 'Blood pressure monitoring',
  },
  {
    week: 31,
    highlights: 'Five senses fully developed. Practicing breathing.',
    tests: 'Fundal height measurement',
  },
  {
    week: 32,
    highlights: 'Growth scan recommended. Bones hardening except skull.',
    tests: 'Growth ultrasound, AFI assessment',
  },
];

const systemIconMap: Record<string, React.ElementType> = {
  Brain: Brain,
  'Brain (rapid growth)': Brain,
  'Brain (myelination)': Brain,
  Eye: Eye,
  'Eyes (open/close)': Eye,
  Ear: Ear,
  'Hearing (complete)': Ear,
  Shield: Shield,
  'Immune system': Shield,
  Heart: Heart,
  Bone: Bone,
  'Bones (hardening)': Bone,
};

function getSystemIcon(system: string) {
  for (const [key, Icon] of Object.entries(systemIconMap)) {
    if (system.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Activity;
}

const timelineIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  scan: { icon: ScanLine, color: '#C8877A' },
  test: { icon: FlaskConical, color: '#C4A8D4' },
  visit: { icon: Stethoscope, color: '#60A5FA' },
  milestone: { icon: Star, color: '#FBBF24' },
  vaccine: { icon: Syringe, color: '#34D399' },
};

// ── Minimal Scientific Fetal Visualizer ──
function FetalVisualizer({ week, crl, weight }: { week: number; crl: string; weight: string }) {
  const scale = Math.min(1.8, 0.4 + (week / 40) * 1.4);
  const sacRadius = 40 * scale;

  return (
    <div className="relative border border-white/[0.04] bg-[#0C0C14] rounded-xl p-4 flex flex-col items-center justify-center h-44 mb-5 overflow-hidden">
      {/* Grid background simulating ultrasound overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,135,122,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,135,122,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px',
        }}
      />

      <svg width="100%" height="100%" viewBox="0 0 200 120" className="relative z-10">
        {/* Gestational Sac Outline */}
        <circle
          cx="100"
          cy="60"
          r={Math.min(50, sacRadius)}
          fill="none"
          stroke="rgba(200, 135, 122, 0.25)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Fetal Positioning Schematic Curve */}
        <path
          d={
            week <= 12 
              ? "M85,55 C90,45 110,45 115,55 C120,65 110,75 100,75 C95,75 90,70 90,65"
              : week <= 28
              ? "M75,55 C85,35 115,35 125,55 C130,70 120,85 105,85 C95,85 85,75 85,60"
              : "M70,55 C80,25 120,25 130,55 C135,75 125,95 105,95 C90,95 75,80 75,60"
          }
          fill="none"
          stroke="#C8877A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Measurements dots */}
        <circle cx="85" cy="55" r="2" fill="#C4A8D4" />
        <circle cx="90" cy="65" r="2" fill="#C4A8D4" />

        {/* Projection guides */}
        <line x1="85" y1="55" x2="60" y2="55" stroke="rgba(196, 168, 212, 0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="90" y1="65" x2="60" y2="65" stroke="rgba(196, 168, 212, 0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="65" y1="55" x2="65" y2="65" stroke="#C4A8D4" strokeWidth="0.75" />

        <text x="52" y="62" fill="#C4A8D4" fontSize="7" fontFamily="monospace" textAnchor="end">
          CRL
        </text>

        {/* Info panel overlay */}
        <text x="142" y="90" fill="#8A7A92" fontSize="7" fontFamily="monospace">
          EST. W: {weight}
        </text>
        <text x="142" y="100" fill="#8A7A92" fontSize="7" fontFamily="monospace">
          CRL: {crl}
        </text>

        {/* Fetal Heart Rate trace */}
        <path
          d="M135,50 L140,50 L143,42 L146,58 L149,38 L152,62 L155,50 L165,50"
          fill="none"
          stroke="rgba(52, 211, 153, 0.6)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <text x="135" y="32" fill="rgb(52, 211, 153)" fontSize="6" fontFamily="monospace">
          FHR DETECTED
        </text>
      </svg>

      {/* Clinical Overlay Texts */}
      <div className="absolute top-2.5 left-2.5 text-[8px] font-mono text-[#8A7A82] uppercase tracking-wider">
        Mode: 2D / B-Mode
      </div>
      <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-[#8A7A82] uppercase tracking-wider">
        Freq: 5.0 MHz
      </div>
      <div className="absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#8A7A82] uppercase tracking-wider">
        MI &lt; 0.3 · TIS &lt; 0.2
      </div>
    </div>
  );
}

// ── Custom Chart Tooltip ──
function GrowthTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string | number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#12121A] border border-white/[0.08] rounded-xl p-3 shadow-xl">
      <p className="text-[#8A7A92] text-[10px] font-mono mb-1.5">Week {label}</p>
      <div className="space-y-1 text-xs">
        {payload.map((p, idx) => (
          <p key={idx} className="font-mono" style={{ color: p.color || '#C8877A' }}>
            {p.name === 'actual' ? 'Actual' : p.name.toUpperCase()}: {p.value} g
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Main Page Component ──
export default function BabyJourneyPage() {
  return (
    <MotherShell>
      <BabyJourneyContent />
    </MotherShell>
  );
}

function BabyJourneyContent() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [milestoneIndex, setMilestoneIndex] = useState(5); // Week 28
  const currentMilestone = fetusMilestones[milestoneIndex];
  const currentTimelineRef = useRef<HTMLDivElement>(null);

  // Simulate skeleton load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to current timeline event once loaded
  useEffect(() => {
    if (!loading && currentTimelineRef.current) {
      currentTimelineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading]);

  const totalWeeks = 40;
  const currentWeek = 28;
  const progressPercent = (currentWeek / totalWeeks) * 100;

  if (loading) {
    return <BabySkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ── SECTION 1: CURRENT WEEK HEADER ── */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl text-[#E8E4F0] tracking-tight">
              {t('weekOf')}
            </h1>
            <p className="text-[#8A7A92] text-xs mt-1 font-mono">
              EDD: {t('dueDate')} · 84 days remaining
            </p>
          </div>
          <span className="bg-[#C8877A]/15 text-[#C8877A] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-[#C8877A]/20 self-start sm:self-center">
            {t('thirdTrimester')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative mb-5">
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8877A] via-[#C4A8D4] to-[#60A5FA]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5 text-[9px] text-[#8A7A92] font-mono uppercase tracking-wider">
            <span>Week 1</span>
            <span>Week 13</span>
            <span>Week 28</span>
            <span>Week 40</span>
          </div>
        </div>

        {/* Week details grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.03]">
          <div className="text-center">
            <p className="text-[#8A7A92] text-[10px] uppercase tracking-wider mb-1">CRL Height</p>
            <p className="text-[#E8E4F0] font-mono text-sm font-semibold">{fetusMilestones[5].crownRumpLength}</p>
          </div>
          <div className="text-center border-x border-white/[0.04]">
            <p className="text-[#8A7A92] text-[10px] uppercase tracking-wider mb-1">Est. Weight</p>
            <p className="text-[#E8E4F0] font-mono text-sm font-semibold">{fetusMilestones[5].estimatedWeight}</p>
          </div>
          <div className="text-center">
            <p className="text-[#8A7A92] text-[10px] uppercase tracking-wider mb-1">Percentile</p>
            <p className="text-[#E8E4F0] font-mono text-sm font-semibold">{fetusMilestones[5].percentile}rd</p>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left Column: Weekly Development & Visualizer */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 flex flex-col h-full">
            <h2 className="font-serif text-[#E8E4F0] text-base mb-4">
              Week {currentMilestone.week} Development
            </h2>

            {/* Scientific Visualizer */}
            <FetalVisualizer
              week={currentMilestone.week}
              crl={currentMilestone.crownRumpLength}
              weight={currentMilestone.estimatedWeight}
            />

            {/* Developing systems list */}
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-[10px] text-[#8A7A92] uppercase tracking-wider mb-2">{t('developingSystems')}</p>
                <div className="flex flex-wrap gap-2">
                  {currentMilestone.developingSystems.map((system) => {
                    const Icon = getSystemIcon(system);
                    return (
                      <div
                        key={system}
                        className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-2.5 py-1.5 text-xs text-[#E8E4F0] flex items-center gap-2"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#8A7A92]" />
                        <span>{system}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-l-2 border-[#C8877A]/40 pl-3 py-1">
                <p className="text-[#8A7A92] text-[11px] leading-relaxed">
                  {currentMilestone.clinicalNote}
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3">
                <p className="text-[#E8E4F0] text-xs leading-relaxed">
                  {currentMilestone.milestone}
                </p>
              </div>
            </div>

            {/* Milestone Navigator */}
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-5">
              <button
                onClick={() => setMilestoneIndex((i) => Math.max(0, i - 1))}
                disabled={milestoneIndex === 0}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[#8A7A92] hover:bg-white/[0.04] hover:text-[#E8E4F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {fetusMilestones.map((m, i) => (
                  <button
                    key={m.week}
                    onClick={() => setMilestoneIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      i === milestoneIndex ? 'bg-[#C8877A] w-4' : 'bg-white/[0.1] hover:bg-white/[0.2]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setMilestoneIndex((i) => Math.min(fetusMilestones.length - 1, i + 1))}
                disabled={milestoneIndex === fetusMilestones.length - 1}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[#8A7A92] hover:bg-white/[0.04] hover:text-[#E8E4F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Maternal Timeline */}
        <div className="lg:col-span-3">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
            <h2 className="font-serif text-[#E8E4F0] text-base mb-5">{t('maternalTimeline')}</h2>

            <div className="relative space-y-4">
              {maternalTimeline.map((event, index) => {
                const isLast = index === maternalTimeline.length - 1;
                const isCurrent = event.status === 'current';
                const isCompleted = event.status === 'completed';
                const isUpcoming = event.status === 'upcoming';
                const iconConfig = timelineIconMap[event.type] || timelineIconMap.visit;
                const Icon = iconConfig.icon;

                return (
                  <div
                    key={`${event.week}-${event.type}`}
                    ref={isCurrent ? currentTimelineRef : undefined}
                    className="relative flex gap-4 pb-4 last:pb-0"
                  >
                    {/* Timeline Line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[15px] top-[30px] w-[1px] bottom-0 ${
                          isUpcoming ? 'border-l border-dashed border-white/[0.08]' : 'bg-white/[0.06]'
                        }`}
                      />
                    )}

                    {/* Timeline Icon Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                          isCurrent
                            ? 'bg-[#C8877A]/15 border-[#C8877A] text-[#C8877A]'
                            : isCompleted
                            ? 'bg-white/[0.04] border-white/[0.08] text-[#8A7A92]'
                            : 'bg-[#0A0A12] border-white/[0.04] text-[#8A7A92]/40'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className={`flex-1 p-3.5 rounded-xl border transition-colors ${
                      isCurrent
                        ? 'bg-white/[0.04] border-white/[0.08]'
                        : 'bg-white/[0.01] border-white/[0.03]'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                          isCurrent ? 'text-[#C8877A]' : 'text-[#8A7A92]'
                        }`}>
                          Week {event.week}
                        </span>
                        {event.date && (
                          <span className="text-[9px] font-mono text-[#8A7A92]/60">&middot; {event.date}</span>
                        )}
                      </div>
                      <h3 className={`text-xs font-semibold ${isUpcoming ? 'text-[#E8E4F0]/60' : 'text-[#E8E4F0]'}`}>
                        {event.title}
                      </h3>
                      <p className="text-[10px] text-[#8A7A92] mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: FETAL GROWTH CHART ── */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-[#E8E4F0] text-base">{t('fetalGrowthChart')}</h2>
          <span className="text-[9px] text-[#8A7A92] font-mono uppercase tracking-wider">
            {t('whoReference')}
          </span>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthChartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8877A" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#C8877A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A7A92', fontSize: 9, fontFamily: 'monospace' }}
                tickFormatter={(val) => `W${val}`}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A7A92', fontSize: 9, fontFamily: 'monospace' }}
                tickFormatter={(val) => `${val}g`}
              />
              <Tooltip content={<GrowthTooltip />} />
              <Area
                type="monotone"
                dataKey="p90"
                stroke="rgba(96,165,250,0.25)"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
                dot={false}
                name="p90"
              />
              <Area
                type="monotone"
                dataKey="p50"
                stroke="rgba(196,168,212,0.25)"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
                dot={false}
                name="p50"
              />
              <Area
                type="monotone"
                dataKey="p10"
                stroke="rgba(52,211,153,0.25)"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
                dot={false}
                name="p10"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#C8877A"
                strokeWidth={1.5}
                fill="url(#gradientActual)"
                dot={{ r: 2.5, fill: '#C8877A', stroke: '#0A0A12', strokeWidth: 1.5 }}
                name="actual"
              />
              <ReferenceLine x={28} stroke="rgba(200,135,122,0.3)" strokeDasharray="3 3" />
              <ReferenceDot x={28} y={1005} r={4.5} fill="#C8877A" stroke="#0A0A12" strokeWidth="2" />
              <Legend
                wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', marginTop: 10 }}
                formatter={(value) => <span className="text-[#8A7A92] uppercase">{value}</span>}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SECTION 4: UPCOMING MILESTONES ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[#E8E4F0] text-base">{t('upcomingMilestones')}</h2>
          <span className="text-[10px] text-[#8A7A92] font-mono">W29 &ndash; W32</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingWeeks.map((item) => (
            <div
              key={item.week}
              className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C8877A]/10 flex items-center justify-center">
                    <span className="text-[#C8877A] font-mono text-xs font-semibold">{item.week}</span>
                  </div>
                  <span className="text-[#E8E4F0] text-xs font-semibold">Week {item.week}</span>
                </div>
                <p className="text-[#8A7A92] text-xs leading-relaxed">{item.highlights}</p>
              </div>

              <div className="border-t border-white/[0.03] pt-2.5 flex items-center gap-2">
                <FlaskConical className="w-3.5 h-3.5 text-[#C4A8D4]/60" />
                <span className="text-[10px] text-[#8A7A92]/80 font-mono">{item.tests}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BabySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded" />
        <div className="h-2 w-full bg-white/5 rounded" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
        </div>
      </div>

      {/* Two columns skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 h-[400px] bg-white/5 rounded-2xl" />
        <div className="lg:col-span-3 h-[400px] bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}
