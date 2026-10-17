'use client';

import React, { useState, useEffect } from 'react';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import { 
  PieChart as PieIcon, TrendingUp, Users, AlertTriangle 
} from 'lucide-react';

export default function AncAnalytics() {
  const { mothers } = useAncData();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center font-mono text-xs text-[#8A7A82]">
        Loading analytical telemetry streams...
      </div>
    );
  }

  // 1. Calculate Pregnancies by Village
  const villageData = ['Hosur', 'Ramapura', 'Kanakapura', 'Nelamangala'].map(v => {
    return {
      name: v,
      count: mothers.filter(m => m.village === v).length,
    };
  });

  // 2. Calculate Trimester Distribution
  const trim1 = mothers.filter(m => m.week >= 1 && m.week <= 13).length;
  const trim2 = mothers.filter(m => m.week >= 14 && m.week <= 26).length;
  const trim3 = mothers.filter(m => m.week >= 27).length;

  const trimesterData = [
    { name: 'Trimester 1 (Wk 1-13)', value: trim1, color: '#E8B4AC' },
    { name: 'Trimester 2 (Wk 14-26)', value: trim2, color: '#C8877A' },
    { name: 'Trimester 3 (Wk 27+)', value: trim3, color: '#2A1525' }
  ];

  // 3. Clinical Anomalies Trends (Simulated over months for clinical realism)
  const anomaliesTrendData = [
    { month: 'Jan', anemia: 4, hypertension: 1, diabetes: 2 },
    { month: 'Feb', anemia: 5, hypertension: 2, diabetes: 2 },
    { month: 'Mar', anemia: 6, hypertension: 1, diabetes: 3 },
    { month: 'Apr', anemia: 4, hypertension: 3, diabetes: 4 },
    { month: 'May', anemia: mothers.filter(m => m.hbLevel < 10.5).length, hypertension: mothers.filter(m => m.bp.split('/').map(Number)[0] > 130).length, diabetes: mothers.filter(m => m.glucoseLevel > 120).length }
  ];

  // 4. ANC Attendance Index (compliance rate trends)
  const complianceData = [
    { month: 'Jan', index: 78 },
    { month: 'Feb', index: 82 },
    { month: 'Mar', index: 85 },
    { month: 'Apr', index: 89 },
    { month: 'May', index: Math.round(mothers.reduce((acc, m) => acc + m.complianceRate, 0) / mothers.length) }
  ];

  const totalHighRisk = mothers.filter(m => m.riskLevel === 'red').length;
  const totalModerateRisk = mothers.filter(m => m.riskLevel === 'yellow').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
          {t('analytics')}
        </h2>
        <p className="text-xs text-[#8A7A82] font-mono">
          Consolidated clinical analytics, epidemiological risk trends, and field worker compliance performance indicators.
        </p>
      </div>

      {/* Top telemetry summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#C8877A]/10 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-[#8A7A82] uppercase tracking-wider block">Epidemiological Risk Index</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-[#2A1525] font-mono">
              {((totalHighRisk * 3 + totalModerateRisk * 1.5) / mothers.length).toFixed(1)}
            </span>
            <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-mono font-bold">Elevated Risk Vector</span>
          </div>
        </div>
        <div className="bg-white border border-[#C8877A]/10 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-[#8A7A82] uppercase tracking-wider block">Average Supplement Adherence</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-green-600 font-mono">
              {Math.round(mothers.reduce((acc, m) => acc + m.complianceRate, 0) / mothers.length)}%
            </span>
            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-mono font-bold">Liaison Optimal</span>
          </div>
        </div>
        <div className="bg-white border border-[#C8877A]/10 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] font-bold text-[#8A7A82] uppercase tracking-wider block">Referral Turnaround Time</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-[#2A1525] font-mono">18 mins</span>
            <span className="text-[10px] text-[#C8877A] font-mono">Target &lt; 25 mins</span>
          </div>
        </div>
      </div>

      {/* Graphs Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Caseload by Village */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-serif font-bold text-[#2A1525] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
            <Users className="w-4 h-4 text-[#C8877A]" />
            {t('villagepregnancy')}
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8A7A82" fontSize={10} tickLine={false} />
                <YAxis stroke="#8A7A82" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C0B18', color: '#FEFAF8', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="count" fill="#C8877A" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Trimester Distribution */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-serif font-bold text-[#2A1525] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
            <PieIcon className="w-4 h-4 text-[#C8877A]" />
            {t('trimesterdist')}
          </h3>
          <div className="h-60 w-full flex flex-col sm:flex-row items-center justify-around">
            <div className="h-44 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trimesterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trimesterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1C0B18', color: '#FEFAF8', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend indicators */}
            <div className="space-y-2 text-xs">
              {trimesterData.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-[#8A7A82]">{t.name}: <strong>{t.value} Mothers</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 3: Clinical Anomalies Trends */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-serif font-bold text-[#2A1525] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            {t('riskTrends')}
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomaliesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FEFAF8" />
                <XAxis dataKey="month" stroke="#8A7A82" fontSize={10} tickLine={false} />
                <YAxis stroke="#8A7A82" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C0B18', color: '#FEFAF8', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="anemia" name="Anemia Cases" stroke="#C8877A" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hypertension" name="BP Risks" stroke="#2A1525" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="diabetes" name="Diabetes (GDM)" stroke="#B8906A" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: ANC Attendance Index */}
        <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-serif font-bold text-[#2A1525] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
            <TrendingUp className="w-4 h-4 text-[#C8877A]" />
            {t('attendance')}
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8877A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C8877A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#8A7A82" fontSize={10} tickLine={false} />
                <YAxis stroke="#8A7A82" fontSize={10} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C0B18', color: '#FEFAF8', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                />
                <Area type="monotone" dataKey="index" name="Compliance Index" stroke="#C8877A" fillOpacity={1} fill="url(#colorCompliance)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
