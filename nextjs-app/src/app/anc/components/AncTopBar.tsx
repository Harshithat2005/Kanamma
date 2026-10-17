'use client';

import { Bell, Menu, ChevronRight, Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Language } from '../data';
import { useAncData } from './AncDataContext';

const languageLabels: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்',
  te: 'తెలుగు',
};

const routeLabels: Record<string, string> = {
  '/anc/dashboard': 'dashboard',
  '/anc/mothers': 'mothers',
  '/anc/high-risk': 'highRisk',
  '/anc/appointments': 'appointments',
  '/anc/reports': 'reports',
  '/anc/referrals': 'referrals',
  '/anc/analytics': 'analytics',
  '/anc/messages': 'messages',
};

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function AncTopBar({ onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { referrals, mothers } = useAncData();

  const currentRouteKey = routeLabels[pathname] || 'dashboard';

  // Calculate active triage alerts
  const criticalCount = mothers.filter(m => m.riskLevel === 'red').length;
  const activeReferralsCount = referrals.filter(r => r.status !== 'admitted').length;

  return (
    <header className="sticky top-0 z-30 bg-[#FEFAF8]/90 backdrop-blur-md border-b border-[#C8877A]/10">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left Section: Mobile Menu Trigger + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#2A1525]/05 border border-[#2A1525]/10 flex items-center justify-center text-[#2A1525] hover:bg-[#2A1525]/10 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A7A82]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">ANC Operations</span>
            <ChevronRight className="w-3 h-3 text-[#C8877A]/60" />
            <span className="text-[#2A1525] font-bold">{t(currentRouteKey)}</span>
          </div>

          <span className="sm:hidden text-xs text-[#2A1525] font-bold">{t(currentRouteKey)}</span>
        </div>

        {/* Center Section: Operational Telemetry (Triage Overview) */}
        <div className="hidden md:flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span>{criticalCount} Critical Triage</span>
          </div>
          
          {activeReferralsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C8877A]/10 border border-[#C8877A]/20 text-[#C8877A] rounded-lg">
              <Activity className="w-3.5 h-3.5" />
              <span>{activeReferralsCount} Dispatch Escort</span>
            </div>
          )}
        </div>

        {/* Right Section: Language Selection & Notifications Button */}
        <div className="flex items-center gap-2">
          {/* Clinical Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-white border border-[#C8877A]/15 text-[#2A1525] text-[11px] font-bold rounded-xl px-2.5 py-1.5 outline-none focus:border-[#C8877A] transition-colors cursor-pointer appearance-none shadow-sm"
            style={{ minWidth: '85px' }}
          >
            {Object.keys(languageLabels).map((l) => (
              <option key={l} value={l} className="bg-[#FEFAF8] text-[#2A1525]">
                {languageLabels[l as Language]}
              </option>
            ))}
          </select>

          {/* Alert Notifications Trigger */}
          <button className="relative w-9 h-9 rounded-xl bg-white border border-[#C8877A]/15 flex items-center justify-center text-[#2A1525] hover:bg-[#F5E8E6] transition-all shadow-sm">
            <Bell className="w-4 h-4" />
            {(criticalCount > 0 || activeReferralsCount > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
