import React from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { DoctorDataProvider } from './components/DoctorDataContext';
import DoctorShell from './components/DoctorShell';

export const metadata = {
  title: 'Kannamma Doctor OS — Maternal Health Portal',
  description: 'Clinical obstetric workspace, patient vitals monitoring, digital prescribing, and emergency SOS routing.',
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DoctorDataProvider>
        <DoctorShell>{children}</DoctorShell>
      </DoctorDataProvider>
    </LanguageProvider>
  );
}
