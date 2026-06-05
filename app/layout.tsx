// /app/layout.tsx
import './globals.css';
import { LanguageProvider } from "@/context/LanguageContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ClientLoader from "@/components/ClientLoader";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c12]">
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <ClientLoader>
                {children}
                <Analytics />
              </ClientLoader>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}