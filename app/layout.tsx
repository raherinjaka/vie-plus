// ✅ PAS de "use client" ici
import './globals.css';
import { LanguageProvider } from "@/context/LanguageContext";
import ClientLoader from "@/components/ClientLoader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white">
      <body className="min-h-screen">
        <LanguageProvider>
          <ClientLoader>
            {children}
          </ClientLoader>
        </LanguageProvider>
      </body>
    </html>
  );
}