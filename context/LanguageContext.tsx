"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationType } from "@/lib/translations";

interface LanguageContextType {
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as "fr" | "en";
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: "fr" | "en") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider 
      value={{ 
        lang, 
        setLang: handleSetLang, 
        t 
      } as any}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}