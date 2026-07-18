"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ThemeProvider from "@/components/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          {/* On a retiré ClientLoader qui causait le blocage sur écran noir */}
          {children}
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}