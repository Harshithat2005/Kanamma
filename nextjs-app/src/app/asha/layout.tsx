import { Metadata } from 'next';
import { LanguageProvider } from './components/LanguageContext';
import { OfflineProvider } from './components/OfflineContext';

export const metadata: Metadata = {
  title: 'Kannamma ASHA Command Center',
  description: 'Futuristic maternal healthcare command center for Indian ASHA workers.',
};

export default function AshaLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <OfflineProvider>
        {children}
      </OfflineProvider>
    </LanguageProvider>
  );
}
