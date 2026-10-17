import { Metadata } from 'next';
import { LanguageProvider } from './components/LanguageContext';
import { AncDataProvider } from './components/AncDataContext';
import AncShell from './components/AncShell';

export const metadata: Metadata = {
  title: 'Kannamma ANC Command Center',
  description: 'Antenatal Care Center Clinical Operations Workspace.',
};

export default function AncLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AncDataProvider>
        <AncShell>
          {children}
        </AncShell>
      </AncDataProvider>
    </LanguageProvider>
  );
}
