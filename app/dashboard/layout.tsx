import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Vie+ | Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    /* On force le fond noir ici sur le conteneur principal */
    <div className="relative min-h-screen text-white bg-[#050505] overflow-hidden">
      
      {/* --- LE FOND ABSTRAIT (Wavy) --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 h-full w-full">
        
        {/* 1. La grande courbe grise à droite (comme ton image) */}
        <div 
          className="absolute right-[-20%] top-[-10%] h-[120%] w-[80%] opacity-40 blur-[80px]"
          style={{
            background: 'radial-gradient(ellipse at center, #252525 0%, transparent 70%)',
            transform: 'rotate(-15deg) skewX(-10deg)',
          }}
        ></div>

        {/* 2. La courbe plus sombre qui donne du relief */}
        <div 
          className="absolute right-[5%] top-[10%] h-[80%] w-[40%] opacity-30 border-r-[100px] border-white/5 blur-[100px] rounded-[100%]"
        ></div>

        {/* 3. Ton accent rouge (Glow en haut) */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full"></div>
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 pt-32 pb-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-white/5 text-center text-[10px] text-gray-500 uppercase tracking-widest">
        Vie+ | Système de gestion L2 - 2026
      </footer>

    </div>
  );
}