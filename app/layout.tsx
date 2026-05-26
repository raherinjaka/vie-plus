// /app/layout.tsx
import './globals.css';
import { LanguageProvider } from "@/context/LanguageContext";
import ClientLoader from "@/components/ClientLoader";
import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080c12]">
        <ThemeProvider>
          <LanguageProvider>
            <ClientLoader>
              
              {/* 🚀 PETIT LOGO "VIE +" FLOTTANT INDÉPENDANT */}
              {/* Il est placé à droite (right-6). Modifie 'right-6' par 'left-6' si tu préfères à gauche ! */}
              <div className="fixed top-5 left-6 z-50 pointer-events-none select-none flex items-center">
                <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* VIE en italique serif */}
                  <text
                    x="0" y="28"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontSize="28"
                    fontWeight="700"
                    fontStyle="italic"
                    fill="white"
                    letterSpacing="-1"
                  >
                    VIE
                  </text>
                  {/* Séparateur discret */}
                  <line x1="82" y1="4" x2="82" y2="32" stroke="#ffffff18" strokeWidth="1"/>
                  {/* Cercle cyan */}
                  <circle cx="104" cy="18" r="14" stroke="#00E5FF" strokeWidth="1.5"/>
                  {/* Croix + à l'intérieur */}
                  <line x1="104" y1="10" x2="104" y2="26" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="96"  y1="18" x2="112" y2="18" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Le reste de tes pages s'affiche ici normalement */}
              {children}

            </ClientLoader>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}