'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Pill,
  ShieldAlert,
  Mic,
  BarChart3,
  MessageSquare,
  Activity,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function DoctorSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    {
      name: t('dashboard'),
      path: '/doctor/dashboard',
      icon: LayoutDashboard
    },
    {
      name: t('queue'),
      path: '/doctor/queue',
      icon: Users
    },
    {
      name: t('reports'),
      path: '/doctor/reports',
      icon: FileText
    },
    {
      name: t('prescriptions'),
      path: '/doctor/prescriptions',
      icon: Pill
    },
    {
      name: t('emergency'),
      path: '/doctor/emergency',
      icon: ShieldAlert,
      badge: 'SOS'
    },
    {
      name: t('consultations'),
      path: '/doctor/consultations',
      icon: Mic
    },
    {
      name: t('analytics'),
      path: '/doctor/analytics',
      icon: BarChart3
    },
    {
      name: t('messages'),
      path: '/doctor/messages',
      icon: MessageSquare
    }
  ];

  // Helper to check if a route is active
  const isActive = (path: string) => {
    if (path === '/doctor/dashboard') {
      return pathname === '/doctor/dashboard';
    }
    return pathname.startsWith(path);
  };

  const isPatientDossierActive = pathname.startsWith('/doctor/patient');

  return (
    <aside className="w-64 bg-[#1C0B18] text-[#FEFAF8] flex flex-col h-full border-r border-[#C8877A]/20 shadow-xl">
      {/* Header / Logo */}
      <div className="p-6 border-b border-[#C8877A]/10 flex flex-col">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-[#C8877A]" />
          <span className="font-serif text-xl font-semibold tracking-wide text-white">
            Kannamma
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4A8D4] mt-1.5 font-medium">
          Clinical Doctor OS
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-plum-light">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 group ${
                active
                  ? 'bg-[#C8877A] text-[#1C0B18] font-semibold shadow-md shadow-[#C8877A]/15'
                  : 'text-[#FEFAF8]/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105 ${
                    active ? 'text-[#1C0B18]' : 'text-[#C4A8D4]'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  active ? 'bg-[#1C0B18] text-[#C8877A]' : 'bg-red-500/20 text-red-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Render a custom active item when viewing a patient dossier */}
        {isPatientDossierActive && (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold bg-[#2A1525] border border-[#C8877A]/30 text-[#C8877A] mt-4">
            <div className="flex items-center space-x-3">
              <Users className="h-4.5 w-4.5 text-[#C8877A]" />
              <span className="font-serif">Patient Dossier</span>
            </div>
            <ChevronRight className="h-4 w-4 animate-pulse" />
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#C8877A]/10 bg-black/10 flex items-center space-x-3 text-xs">
        <div className="h-8 w-8 rounded-full bg-[#C8877A]/20 border border-[#C8877A]/40 flex items-center justify-center font-bold text-[#C8877A]">
          SR
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white">Dr. Shreya Roy</span>
          <span className="text-[#C4A8D4]/70 text-[10px]">Senior OB-GYN</span>
        </div>
      </div>
    </aside>
  );
}
