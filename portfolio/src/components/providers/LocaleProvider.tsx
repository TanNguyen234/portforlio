"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "portfolioLocale_v1";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const getStoredLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "en" || raw === "vi") {
    return raw;
  }
  return null;
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "vi" : "en");
  };

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
};
