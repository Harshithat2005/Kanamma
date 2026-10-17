'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, AlertOctagon, Calendar, FileText,
  Activity, BarChart3, MessageSquare, X, Award
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

const navItems = [
  { href: '/anc/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/anc/mothers', icon: Users, labelKey: 'mothers' },
  { href: '/anc/high-risk', icon: AlertOctagon, labelKey: 'highRisk' },
  { href: '/anc/appointments', icon: Calendar, labelKey: 'appointments' },
  { href: '/anc/reports', icon: FileText, labelKey: 'reports' },
  { href: '/anc/referrals', icon: Activity, labelKey: 'referrals' },
  { href: '/anc/analytics', icon: BarChart3, labelKey: 'analytics' },
  { href: '/anc/messages', icon: MessageSquare, labelKey: 'messages' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AncSidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1C0B18] text-[#FEFAF8]">
      {/* Clinic Identity Header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8877A] to-[#E8B4AC] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-serif font-bold text-base">A</span>
          </div>
          <div>
            <h1 className="text-[#FEFAF8] font-serif text-lg font-bold leading-tight tracking-tight">Kannamma</h1>
            <p className="text-[#E8B4AC] text-[9px] font-medium tracking-[0.22em] uppercase mt-0.5 font-mono">ANC Clinic OS</p>
          </div>
        </div>
      </div>

      {/* Coordinator Profile Context */}
      <div className="mx-4 my-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8877A]/15 border border-[#C8877A]/30 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-[#C8877A]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#FEFAF8] text-xs font-bold truncate">Dr. Shreya Roy</p>
            <p className="text-[#8A7A82] text-[10px] font-mono mt-0.5">Nelamangala Hub (PHC)</p>
          </div>
        </div>
      </div>

      {/* Operational Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4 scrollbar-thin">
        <span className="px-3 text-[9px] font-bold text-[#8A7A82] uppercase tracking-[0.15em] block mb-2 mt-1">
          OPERATIONS
        </span>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const isHighRisk = item.href === '/anc/high-risk';
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 relative
                ${active
                  ? 'bg-[#C8877A]/15 text-[#C8877A] border-l-2 border-l-[#C8877A]'
                  : 'text-[#8A7A82] hover:text-[#FEFAF8] hover:bg-white/[0.02]'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="anc-sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C8877A]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-[17px] h-[17px] flex-shrink-0 ${
                active 
                  ? 'text-[#C8877A]' 
                  : isHighRisk 
                  ? 'text-red-400/75 group-hover:text-red-400' 
                  : 'text-[#8A7A82] group-hover:text-[#FEFAF8]'
              }`} />
              <span className="flex-1">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/[0.04] bg-[#140812] text-center">
        <p className="text-[10px] text-[#8A7A82]">System status: <span className="text-[#34D399] font-bold">● Active</span></p>
        <p className="text-[9px] text-[#8A7A82]/50 font-mono mt-0.5">Version 1.4.0 (clinical)</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] bg-[#1C0B18] border-r border-white/[0.04] flex-col z-40 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] bg-[#1C0B18] border-r border-white/[0.04] flex flex-col z-50"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#8A7A82] hover:text-[#FEFAF8] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
