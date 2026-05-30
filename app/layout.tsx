// /app/layout.tsx
import './globals.css';
import { LanguageProvider } from "@/context/LanguageContext";
import ClientLoader from "@/components/ClientLoader";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c12]">
        <ThemeProvider>
          <LanguageProvider>
            <ClientLoader>

              {/* Le reste de tes pages s'affiche ici normalement */}
              {children}

              {/* le composant Analytics*/}
              <Analytics />
              
            </ClientLoader>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}