'use client';

import React, { useState } from 'react';
import AncSidebar from './AncSidebar';
import AncTopBar from './AncTopBar';

export default function AncShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEFAF8] text-[#2A1525] font-sans antialiased flex">
      {/* Sidebar Navigation */}
      <AncSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[240px] flex flex-col min-h-screen min-w-0">
        {/* Top telemetry bar */}
        <AncTopBar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        
        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
