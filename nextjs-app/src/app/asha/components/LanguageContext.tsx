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

  // Load language preference from local storage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('asha-lang') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('asha-lang', newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] || translations.en[key] || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
