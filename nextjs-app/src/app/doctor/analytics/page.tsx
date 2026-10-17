'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';

export default function AnalyticsHud() {
  const { t } = useLanguage();
  const { patients } = useDoctorData();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Risk Distribution data
  const redCount = patients.filter((p) => p.riskLevel === 'red').length;
  const yellowCount = patients.filter((p) => p.riskLevel === 'yellow').length;
  const greenCount = patients.filter((p) => p.riskLevel === 'green').length;

  const riskData = [
    { name: 'Critical Red', value: redCount, color: '#EF4444' },
    { name: 'Moderate Yellow', value: yellowCount, color: '#F59E0B' },
    { name: 'Normal Green', value: greenCount, color: '#10B981' }
  ];

  // 2. Village Density data
  const villageCounts: Record<string, number> = {};
  patients.forEach((p) => {
    villageCounts[p.village] = (villageCounts[p.village] || 0) + 1;
  });
  const villageData = Object.keys(villageCounts).map((key) => ({
    village: key,
    mothers: villageCounts[key]
  }));

  // 3. Blood Pressure Scatter data
  const bpScatterData = patients.flatMap((p) =>
    p.vitalsHistory.map((v) => ({
      systolic: v.systolic,
      diastolic: v.diastolic,
      name: p.name
    }))
  );

  // 4. Anemia / Hemoglobin index trend data (Grouped by gestational weeks range)
  // Let's create a mockup of Hb averages over gestational age ranges
  const hbTrendData = [
    { weekRange: 'W1-12', Hb: 11.5, Normal: 11.0 },
    { weekRange: 'W13-20', Hb: 10.8, Normal: 11.0 },
    { weekRange: 'W21-28', Hb: 10.1, Normal: 11.0 },
    { weekRange: 'W29-36', Hb: 9.8, Normal: 11.0 },
    { weekRange: 'W37-40', Hb: 10.4, Normal: 11.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
            {t('analytics')}
          </h1>
          <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
            Clinical maternal demographics, risk profiles, anemia trends and blood pressure distributions
          </p>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Anemia Prevalence */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#C8877A]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#2A1525] text-base">
              Average Maternal Hemoglobin (Hb) Index
            </h3>
            <span className="text-[10px] text-[#C8877A] font-bold uppercase tracking-wider bg-[#C8877A]/10 px-2 py-0.5 rounded">
              GA Trimester Trends
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hbTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C8877A/10" vertical={false} />
                  <XAxis dataKey="weekRange" stroke="#2A1525" style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <YAxis stroke="#2A1525" domain={[8, 13]} style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="Hb" stroke="#C8877A" strokeWidth={2.5} name="Observed Hb (g/dL)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Normal" stroke="#C4A8D4" strokeWidth={1.5} name="Target Threshold" strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#2A1525]/40 italic">Loading Hb analytics...</span>
            )}
          </div>
        </div>

        {/* Chart 2: Risk Distribution Donut */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#C8877A]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#2A1525] text-base">
              {t('riskDistribution')}
            </h3>
            <span className="text-[10px] text-[#2A1525]/50 font-bold uppercase tracking-wider">
              Triage Division
            </span>
          </div>

          <div className="h-64 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {isMounted ? (
              <div className="h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <span className="text-xs text-[#2A1525]/40 italic">Loading risk levels...</span>
            )}

            {/* Legend info */}
            <div className="space-y-3 text-xs">
              {riskData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#C8877A]/5 pb-2 font-medium">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#2A1525]/80">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#2A1525]">{item.value} Mothers</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Village Pregnancy Density */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#C8877A]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#2A1525] text-base">
              Pregnancy Density by Village Sector
            </h3>
            <span className="text-[10px] text-[#2A1525]/50 font-bold uppercase tracking-wider">
              Regional Caseload
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={villageData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C8877A/10" horizontal={false} />
                  <XAxis type="number" stroke="#2A1525" style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <YAxis dataKey="village" type="category" stroke="#2A1525" style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="mothers" fill="#C8877A" name="Active Pregnancies" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#2A1525]/40 italic">Loading density charts...</span>
            )}
          </div>
        </div>

        {/* Chart 4: Blood Pressure Scatter Plot */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-[#C8877A]/10 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#2A1525] text-base">
              BP Distribution Cluster Map
            </h3>
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider bg-red-50 border border-red-100 px-2 py-0.5 rounded">
              Hypertensive Thresholds
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C8877A/10" />
                  <XAxis type="number" dataKey="systolic" name="Systolic BP" unit=" mmHg" stroke="#2A1525" domain={[100, 180]} style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <YAxis type="number" dataKey="diastolic" name="Diastolic BP" unit=" mmHg" stroke="#2A1525" domain={[60, 115]} style={{ fontSize: '10px', fontFamily: 'var(--font-dm-sans)' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Scatter name="Mothers BP Index" data={bpScatterData} fill="#C4A8D4" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#2A1525]/40 italic">Loading BP scatter...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
