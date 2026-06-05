"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Devises disponibles ──────────────────────────────────────────────────────
export interface Currency {
  code:     string;
  symbol:   string;
  name:     string;
  position: "before" | "after"; // $ 100 vs 100 Ar
}

export const CURRENCIES: Currency[] = [
  { code: "AR",   symbol: "Ar",   name: "Ariary malgache",  position: "after"  },
  { code: "EUR",  symbol: "€",    name: "Euro",             position: "after"  },
  { code: "USD",  symbol: "$",    name: "Dollar américain", position: "before" },
  { code: "GBP",  symbol: "£",    name: "Livre sterling",   position: "before" },
  { code: "CHF",  symbol: "CHF",  name: "Franc suisse",     position: "after"  },
  { code: "CAD",  symbol: "CA$",  name: "Dollar canadien",  position: "before" },
  { code: "MXN",  symbol: "MX$",  name: "Peso mexicain",    position: "before" },
  { code: "FCFA", symbol: "FCFA", name: "Franc CFA",        position: "after"  },
  { code: "MAD",  symbol: "DH",   name: "Dirham marocain",  position: "after"  },
  { code: "TND",  symbol: "DT",   name: "Dinar tunisien",   position: "after"  },
];

// ─── Helper : formate un montant avec la devise ───────────────────────────────
export function formatAmount(value: number, currency: Currency): string {
  const formatted = value.toLocaleString();
  return currency.position === "before"
    ? `${currency.symbol} ${formatted}`
    : `${formatted} ${currency.symbol}`;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface CurrencyContextType {
  currency:    Currency;
  setCurrency: (c: Currency) => void;
  format:      (value: number) => string; // raccourci pratique
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]); // Ar par défaut

  // Charge depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("app_currency");
    if (saved) {
      const found = CURRENCIES.find((c) => c.code === saved);
      if (found) setCurrencyState(found);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("app_currency", c.code);
  };

  const format = (value: number) => formatAmount(value, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency doit être utilisé dans un CurrencyProvider");
  return context;
}