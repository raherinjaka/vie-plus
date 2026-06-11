"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ThemeProvider from "@/components/ThemeProvider";
import ClientLoader from "@/components/ClientLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <ClientLoader>
            {children}
          </ClientLoader>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}