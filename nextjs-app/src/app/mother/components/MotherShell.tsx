'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { LanguageProvider } from './LanguageContext';

export default function MotherShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A12] relative">
        {/* Subtle grid background */}
        <div
          className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,135,122,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,135,122,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <div className="lg:ml-[260px] relative z-10 min-h-screen flex flex-col">
          <TopBar onMenuToggle={() => setMobileOpen(prev => !prev)} />

          <main className="flex-1 p-4 lg:p-6 xl:p-8 pb-24 lg:pb-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
