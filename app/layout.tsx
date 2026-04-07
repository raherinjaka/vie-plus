import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-black text-white">
      <body className="min-h-screen flex flex-col lg:flex-row bg-black">
        
        {/* Navigation PC */}
        <Sidebar />

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </main>

        {/* Navigation Mobile */}
        <MobileNav />

      </body>
    </html>
  );
}