'use client';

import React, { useState } from 'react';
import DoctorSidebar from './DoctorSidebar';
import DoctorTopBar from './DoctorTopBar';

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FEFAF8] text-[#2A1525] overflow-hidden font-sans">
      {/* Desktop Sidebar Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-full">
        <DoctorSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-45 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs bg-[#1C0B18] shadow-xl z-50 animate-in slide-in-from-left duration-300">
            <DoctorSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Primary Workstation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-[#FEFAF8] p-4 md:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
