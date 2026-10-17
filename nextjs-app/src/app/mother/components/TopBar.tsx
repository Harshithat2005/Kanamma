'use client';

import { Bell, Menu, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Language, languageLabels } from '../data';

const routeLabels: Record<string, string> = {
  '/mother/dashboard': 'dashboard',
  '/mother/health': 'myHealth',
  '/mother/baby': 'babyJourneyNav',
  '/mother/records': 'records',
  '/mother/emergency': 'emergency',
};

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const currentRouteKey = routeLabels[pathname] || 'dashboard';

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A12]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-[#8A7A92]">Mother</span>
            <ChevronRight className="w-3 h-3 text-[#8A7A92]/50" />
            <span className="text-[#E8E4F0] font-medium">{t(currentRouteKey)}</span>
          </div>

          {/* Mobile: Page title */}
          <span className="sm:hidden text-sm text-[#E8E4F0] font-medium">{t(currentRouteKey)}</span>
        </div>

        {/* Center: Patient context (desktop) */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8A7A92]">
          <span className="text-[#E8E4F0] font-medium">Priya Sharma</span>
          <span className="text-white/[0.15]">·</span>
          <span>{t('greetingSub')}</span>
        </div>

        {/* Right: Language + Notifications */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-white/[0.04] border border-white/[0.06] text-[#E8E4F0] text-[11px] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#C8877A]/30 transition-colors cursor-pointer appearance-none"
            style={{ minWidth: '72px' }}
          >
            {(Object.keys(languageLabels) as Language[]).map((l) => (
              <option key={l} value={l} className="bg-[#0A0A12] text-[#E8E4F0]">
                {languageLabels[l]}
              </option>
            ))}
          </select>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.06] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8877A] border border-[#0A0A12]" />
          </button>
        </div>
      </div>
    </header>
  );
}
