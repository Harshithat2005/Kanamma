'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, translations } from '../data';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  // Load language preference from local storage if available (for production-ready persistency)
  useEffect(() => {
    const savedLang = localStorage.getItem('anc-pref-lang') as Language;
    if (savedLang && ['en', 'hi', 'kn', 'ta', 'te'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('anc-pref-lang', newLang);
  };

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] || translations.en[key] || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
