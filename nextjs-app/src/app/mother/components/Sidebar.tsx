'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Heart, Sprout, FolderOpen, AlertTriangle, Phone, X, Radio
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

const navItems = [
  { href: '/mother/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/mother/health', icon: Heart, labelKey: 'myHealth' },
  { href: '/mother/baby', icon: Sprout, labelKey: 'babyJourneyNav' },
  { href: '/mother/records', icon: FolderOpen, labelKey: 'records' },
];

const emergencyItem = { href: '/mother/emergency', icon: AlertTriangle, labelKey: 'emergency' };

const mobileTabItems = [
  { href: '/mother/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/mother/health', icon: Heart, labelKey: 'myHealth' },
  { href: '/mother/baby', icon: Sprout, labelKey: 'babyJourneyNav' },
  { href: '/mother/records', icon: FolderOpen, labelKey: 'records' },
  { href: '/mother/emergency', icon: AlertTriangle, labelKey: 'emergency' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8877A] to-[#C4A8D4] flex items-center justify-center">
            <span className="text-white font-serif font-semibold text-sm">K</span>
          </div>
          <div>
            <h1 className="text-[#E8E4F0] font-serif text-lg font-semibold leading-none">Kannamma</h1>
            <p className="text-[#8A7A92] text-[10px] tracking-[0.2em] uppercase mt-0.5">Mother</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8877A] to-[#C4A8D4] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">PS</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#E8E4F0] text-sm font-medium truncate">Priya Sharma</p>
            <p className="text-[#8A7A92] text-[11px]">Week 28 · G1P0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${active
                  ? 'bg-[#C8877A]/10 text-[#C8877A]'
                  : 'text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.03]'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C8877A]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* Emergency — distinct styling */}
        <div className="pt-2 mt-2 border-t border-white/[0.04]">
          <Link
            href={emergencyItem.href}
            onClick={onMobileClose}
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
              ${isActive(emergencyItem.href)
                ? 'bg-red-500/10 text-red-400'
                : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06]'
              }
            `}
          >
            {isActive(emergencyItem.href) && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-red-400"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <AlertTriangle className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{t(emergencyItem.labelKey)}</span>
          </Link>
        </div>
      </nav>

      {/* ASHA Worker */}
      <div className="mx-4 mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[#E8E4F0] text-xs font-medium">{t('ashaWorker')}</p>
            <p className="text-emerald-400 text-[10px]">Available</p>
          </div>
        </div>
      </div>

      {/* Ring Status */}
      <div className="mx-4 mb-4 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] text-emerald-400 font-medium">{t('ringConnected')}</span>
        <span className="ml-auto flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-[#07070D]/95 backdrop-blur-xl border-r border-white/[0.04] flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-[#07070D] border-r border-white/[0.04] flex flex-col z-50"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#07070D]/95 backdrop-blur-xl border-t border-white/[0.06] z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {mobileTabItems.map((item) => {
            const active = isActive(item.href);
            const isEmergency = item.labelKey === 'emergency';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[56px]
                  ${active
                    ? isEmergency ? 'text-red-400' : 'text-[#C8877A]'
                    : isEmergency ? 'text-red-400/40' : 'text-[#8A7A92]'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-tab-active"
                    className={`w-1 h-1 rounded-full ${isEmergency ? 'bg-red-400' : 'bg-[#C8877A]'}`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
