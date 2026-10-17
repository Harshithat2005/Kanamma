'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Brain,
  PhoneCall,
  MessageSquare,
  Settings,
  PlusCircle,
  Wifi,
  WifiOff,
  BatteryCharging,
  LogOut,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useOffline } from './OfflineContext';
import { ashaProfile, Language } from '../data';

interface AshaShellProps {
  children: React.ReactNode;
}

export default function AshaShell({ children }: AshaShellProps) {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { isOffline, toggleOffline, isSyncing, syncProgress } = useOffline();
  const [langOpen, setLangOpen] = useState(false);

  const menuItems = [
    { name: t('dashboard'), path: '/asha/dashboard', icon: LayoutDashboard },
    { name: t('mothers'), path: '/asha/mothers', icon: Users },
    { name: t('visits'), path: '/asha/visits', icon: Calendar },
    { name: t('insights'), path: '/asha/insights', icon: Brain },
    { name: t('emergency'), path: '/asha/emergency', icon: PhoneCall },
    { name: t('messages'), path: '/asha/messages', icon: MessageSquare },
    { name: t('settings'), path: '/asha/settings', icon: Settings },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  // Derive title from current path
  const currentItem = menuItems.find((item) => pathname.startsWith(item.path));
  const pageTitle = currentItem ? currentItem.name : t('dashboard');

  return (
    <div className="min-h-screen bg-[#FEFAF8] text-[#2A1525] font-sans flex flex-col lg:flex-row relative">
      
      {/* ── BACKGROUND GLOW DECORATIONS ── */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#DCC9F2]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F5E8E6]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* ── SYNCING OVERLAY BANNER ── */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2A1525]/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#FEFAF8] border border-[#C8877A]/25 rounded-3xl p-6 w-full max-w-sm shadow-[0_20px_50px_rgba(42,21,37,0.15)] text-center"
            >
              <RefreshCw className="w-10 h-10 text-[#C8877A] mx-auto mb-4 animate-spin" />
              <h3 className="font-serif text-xl text-[#2A1525] mb-2">{t('syncing')}</h3>
              <p className="text-xs text-[#8A7A82] mb-5">Uploading offline logs to clinic servers...</p>
              <div className="w-full bg-[#F5E8E6] h-1.5 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="bg-[#C8877A] h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${syncProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#C8877A] font-semibold">{syncProgress}% Complete</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP FIXED SIDEBAR ── */}
      <aside className="hidden lg:flex w-72 bg-[#2A1525] text-[#FEFAF8] flex-col shrink-0 p-6 border-r border-white/[0.05] relative z-20">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center font-serif text-lg font-bold text-white shadow-[0_4px_15px_rgba(200,135,122,0.3)]">
            K
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-wider bg-gradient-to-r from-[#FEFAF8] to-[#D8A48F] bg-clip-text text-transparent">
              KANNAMMA
            </h1>
            <p className="text-[10px] tracking-widest text-[#D8A48F] uppercase font-medium">ASHA Command Center</p>
          </div>
        </div>

        {/* ASHA Profile Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center text-xs font-bold text-[#2A1525]">
              {ashaProfile.avatarText}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{ashaProfile.name}</p>
              <p className="text-[10px] text-[#D8A48F] font-mono">{ashaProfile.id}</p>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-2 mt-2 flex flex-col gap-1 text-[11px] text-[#FEFAF8]/60">
            <div className="flex justify-between">
              <span>Region:</span>
              <span className="font-medium text-white">{ashaProfile.region}</span>
            </div>
            <div className="flex justify-between">
              <span>Mothers:</span>
              <span className="font-medium text-[#D8A48F]">{ashaProfile.mothersCount}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C8877A] text-white shadow-[0_4px_12px_rgba(200,135,122,0.25)]'
                    : 'text-[#FEFAF8]/70 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Telemetry Controls */}
        <div className="border-t border-white/[0.06] pt-4 space-y-3">
          {/* Connection Status Button */}
          <button
            onClick={toggleOffline}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
              isOffline
                ? 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="font-semibold">{isOffline ? t('offline') : t('online')}</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">ASHA-Net</span>
          </button>

          {/* Telemetry stats */}
          <div className="flex justify-between items-center text-[10px] text-[#FEFAF8]/40 px-1 font-mono">
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-400" /> 84%
            </span>
            <span>Signal: 4/5G</span>
          </div>

          {/* Logout mock */}
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-[#FEFAF8]/60 hover:text-white hover:bg-white/[0.03] transition-all">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="flex-1 flex flex-col relative z-10 overflow-x-hidden min-h-screen pb-24 lg:pb-0">
        
        {/* ── TOP OPERATIONAL HEADER ── */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#C8877A]/10 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu logo hook */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] lg:hidden flex items-center justify-center font-serif text-sm font-bold text-white shadow-md">
              K
            </div>
            <div>
              <h2 className="font-serif text-lg lg:text-xl font-bold text-[#2A1525]">
                {pageTitle}
              </h2>
              {isOffline && (
                <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full inline-block mt-0.5 animate-pulse">
                  {t('offline')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Sync Progress in Header (if online but syncing) */}
            <button
              onClick={toggleOffline}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                isOffline
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'bg-emerald-500/5 text-emerald-600 border border-emerald-500/10'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isOffline ? 'Go Online' : 'Sync Active'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-10 h-10 rounded-full border border-[#C8877A]/25 bg-white flex items-center justify-center text-[#2A1525] hover:bg-[#FEFAF8] transition-all shadow-sm"
              >
                <Globe className="w-4 h-4 text-[#C8877A]" />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-[#C8877A]/15 rounded-2xl shadow-xl p-2 z-50"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setLang(language.code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs rounded-xl transition-all ${
                            lang === language.code
                              ? 'bg-[#C8877A]/10 text-[#C8877A] font-semibold'
                              : 'text-[#2A1525] hover:bg-[#F5E8E6]/40'
                          }`}
                        >
                          {language.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Global floating Add Mother shortcut */}
            <Link
              href="/asha/add-mother"
              className="bg-[#C8877A] hover:bg-[#C8877A]/95 text-white shadow-md shadow-[#C8877A]/20 px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('addMother')}</span>
            </Link>
          </div>
        </header>

        {/* ── SCROLLABLE DASHBOARD CONTENT AREA ── */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── MOBILE STICKY EMERGENCY ACTION FLOAT ── */}
      <div className="fixed bottom-18 left-0 right-0 z-30 pointer-events-none lg:hidden flex justify-center p-3">
        <Link
          href="/asha/emergency"
          className="bg-red-500 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 pointer-events-auto shadow-lg shadow-red-500/30 text-xs animate-bounce"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>🚨 ASSISTANCE SOS ACTIVATED</span>
        </Link>
      </div>

      {/* ── MOBILE BOTTOM TABS NAVIGATION ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#2A1525]/95 backdrop-blur-md border-t border-white/[0.05] z-40 lg:hidden flex justify-around py-2 px-1">
        {menuItems.slice(0, 5).map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-[#C8877A]' : 'text-[#FEFAF8]/60 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
        {/* Additional mobile tab icon for messages */}
        <Link
          href="/asha/messages"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            pathname.startsWith('/asha/messages') ? 'text-[#C8877A]' : 'text-[#FEFAF8]/60'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-medium tracking-wide">{t('messages')}</span>
        </Link>
      </nav>
      
    </div>
  );
}
