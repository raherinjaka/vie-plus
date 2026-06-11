"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationType } from "@/lib/translations";

interface LanguageContextType {
  lang: "fr" | "en" | "de" | "es" | "mg";
  setLang: (lang: "fr" | "en" | "de" | "es" | "mg") => void;
  t: TranslationType;
  currency: string;
}

const CURRENCY: Record<"fr" | "en" | "de" | "es" | "mg", string> = {
  fr: "Ar",
  en: "$",
  de: "€",
  es: "€",
  mg: "Ar",
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"fr" | "en" | "de" | "es" | "mg">("fr");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as "fr" | "en";
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: "fr" | "en" | "de" | "es" | "mg") => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        t: translations[lang],
        currency: CURRENCY[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  // Sécurité serveur (Build)
  if (typeof window === "undefined") {
    return {
      lang: "fr",
      setLang: () => {},
      t: translations.fr,
      currency: "Ar",
    };
  }

  const context = useContext(LanguageContext);
  
  // ⚡ LA SÉCURITÉ ANTI-ÉCRAN NOIR : Si le context est null au démarrage sur Vercel,
  // on renvoie temporairement les valeurs par défaut au lieu de faire planter le site.
  if (!context) {
    return {
      lang: "fr",
      setLang: () => {},
      t: translations.fr,
      currency: "Ar",
    };
  }

  return context;
}