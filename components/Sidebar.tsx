// components/Sidebar.tsx
"use client";
import { usePathname } from 'next/navigation'; // Pour savoir sur quelle page on est
import { LayoutDashboard, Wallet, ClipboardList, Target, Info } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
    const pathname = usePathname();

    // Fonction pour définir le titre dynamique
    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Dashboard';
        if (pathname === '/argent') return 'Mon Argent';
        if (pathname === '/taches') return 'Mes Tâches';
        if (pathname === '/objectifs') return 'Objectifs';
        if (pathname === '/a-propos') return 'À Propos';
        return 'Menu';
    };

    return (
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl p-6 sticky top-0 h-screen overflow-y-auto">
          
          {/* TITRE DYNAMIQUE AU LIEU DU LOGO */}
          <div className="mb-12 px-2">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-cyan-500 rounded-full" /> {/* Barre déco "Premium" */}
                <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Navigation</h1>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic">
                {getPageTitle()}
            </h2>
          </div>
          
          {/* LIENS DE NAVIGATION */}
          <nav className="space-y-2">
            <NavItem 
                href="/dashboard" 
                icon={<LayoutDashboard size={22} />} 
                label="Tableau de bord" 
                active={pathname === '/dashboard'} 
            />
            <NavItem 
                href="/argent" 
                icon={<Wallet size={22} />} 
                label="Mon Argent" 
                active={pathname === '/argent'} 
            />
            <NavItem 
                href="/taches" 
                icon={<ClipboardList size={22} />} 
                label="Mes Tâches" 
                active={pathname === '/taches'} 
            />
            <NavItem 
                href="/objectifs" 
                icon={<Target size={22} />} 
                label="Objectifs" 
                active={pathname === '/objectifs'} 
            />
            <NavItem 
                href="/a-propos" 
                icon={<Info size={22} />} 
                label="À propos" 
                active={pathname === '/a-propos'} 
            />
          </nav>
      
          {/* STATUT SYSTÈME */}
          <div className="mt-auto pt-10">
            <div className="p-4 bg-gradient-to-b from-transparent to-cyan-500/5 border border-cyan-500/10 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">
                  Système Optimal
                </p>
              </div>
            </div>
          </div>
        </aside>
    );
}

// Mise à jour du NavItem pour utiliser des vrais liens
function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
      active 
      ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border-l-2 border-cyan-500 shadow-[20px_0_20px_-15px_rgba(34,211,238,0.1)]' 
      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}>
      {icon} <span className="text-[15px]">{label}</span>
    </Link>
  );
}