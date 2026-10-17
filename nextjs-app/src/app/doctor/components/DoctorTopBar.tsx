'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { useDoctorData } from './DoctorDataContext';
import { Language } from '../data';
import { Bell, ShieldAlert, Globe, Menu } from 'lucide-react';
import Link from 'next/link';

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function DoctorTopBar({ onMenuToggle }: TopBarProps) {
  const { language, setLanguage } = useLanguage();
  const { referrals, patients } = useDoctorData();

  // Active emergencies
  const activeSOS = referrals.filter((r) => r.status !== 'admitted');
  // Red flag patients
  const redAlerts = patients.filter((p) => p.riskLevel === 'red');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#C8877A]/10 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left side: Hamburger and Credentials */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[#2A1525] p-1.5 hover:bg-[#FEFAF8] rounded-md transition-colors border border-[#C8877A]/20"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-[#2A1525]">
              Dr. Shreya Roy
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8877A]" />
            <span className="text-xs text-[#2A1525]/70 font-medium">
              Senior OB-GYN & Maternal Specialist
            </span>
          </div>
          <span className="text-[10px] text-[#C4A8D4] font-semibold tracking-wider uppercase mt-0.5">
            Nelamangala Maternity Hub (DH-8)
          </span>
        </div>
      </div>

      {/* Right side: Language, Notifications, SOS */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="flex items-center space-x-2 bg-[#FEFAF8] border border-[#C8877A]/20 px-2.5 py-1.5 rounded-lg">
          <Globe className="h-3.5 w-3.5 text-[#C8877A]" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-transparent text-xs text-[#2A1525] font-medium focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* Critical SOS Alarm Indicator */}
        {activeSOS.length > 0 ? (
          <Link
            href="/doctor/emergency"
            className="flex items-center space-x-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-red-600 animate-pulse text-xs font-semibold hover:bg-red-100 transition-all"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{activeSOS.length} SOS Transit</span>
          </Link>
        ) : (
          <div className="flex items-center space-x-1 text-[#2A1525]/50 px-2 py-1.5 rounded text-xs font-medium">
            <ShieldAlert className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline">SOS Secure</span>
          </div>
        )}

        {/* Red Flag Patient Alert Indicator */}
        {redAlerts.length > 0 && (
          <div className="relative p-1.5 text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hidden sm:flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-orange-600" />
            <span className="text-[10px] font-bold">{redAlerts.length} Critical Cases</span>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 text-[#2A1525]/80 hover:text-[#2A1525] hover:bg-[#FEFAF8] rounded-full border border-[#C8877A]/10 transition-colors">
            <Bell className="h-4 w-4" />
            {activeSOS.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border border-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
