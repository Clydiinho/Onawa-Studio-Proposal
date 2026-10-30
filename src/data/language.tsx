/**
 * language.tsx — site-wide English / Afrikaans language switching.
 *
 * Provides:
 *   - LanguageProvider: mounts once in App, stores the choice in localStorage
 *     and keeps <html lang> in sync for accessibility.
 *   - useLanguage(): hook returning { lang, setLang, toggleLang, t }.
 *   - t(en, af): tiny inline-translation helper — every user-visible string on
 *     the site is written as t('English copy', 'Afrikaanse teks') so the
 *     switch flips instantly with no restructuring and no reload.
 *
 * Default language is English; the choice persists per browser.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Language = 'en' | 'af';

const STORAGE_KEY = 'onawa_lang';

const LANGUAGES: Record<Language, string> = {
  en: 'en',
  af: 'af',
};

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** Inline pair translate: t('English', 'Afrikaans') */
  t: (en: string, af: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'af' ? 'af' : 'en';
  } catch {
    return 'en';
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  // Keep <html lang> in sync for screen readers / accessibility.
  useEffect(() => {
    document.documentElement.lang = LANGUAGES[lang];
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — choice just won't persist */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'af' : 'en');
  }, [lang, setLang]);

  const t = useCallback((en: string, af: string) => (lang === 'af' ? af : en), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fail loud in dev if a page renders outside the provider.
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
