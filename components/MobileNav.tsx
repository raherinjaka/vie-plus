"use client";

import { LayoutDashboard, Wallet, ClipboardList, Target } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from "@/context/LanguageContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Fonction pour vérifier si l'onglet est actif
  const isActive = (path: string) => pathname === path;

  /**
   * Utilisation des clés de ton dictionnaire :
   * - t.nav.items.dashboard -> "Tableau de bord" / "Dashboard"
   * - t.nav.items.budget    -> "Mon argent" / "My budget"
   * - t.nav.items.tasks     -> "Mes tâches" / "My tasks"
   * - t.nav.items.goals     -> "Objectifs" / "Goals"
   */
  const navItems = [
    { 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      label: t.nav.items.dashboard 
    },
    { 
      href: "/depenses",  
      icon: Wallet,          
      label: t.nav.items.budget 
    },
    { 
      href: "/taches",    
      icon: ClipboardList,   
      label: t.nav.items.tasks 
    },
    { 
      href: "/objectifs", 
      icon: Target,          
      label: t.nav.items.goals 
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-2xl border border-white/10 px-2 py-3 flex justify-around items-center z-50 rounded-3xl shadow-2xl">
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center gap-1 min-w-[70px] transition-all duration-300 relative ${
              active ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            {/* Taille 24 conservée */}
            <Icon 
              size={24} 
              strokeWidth={active ? 2.5 : 2} 
              className="transition-transform duration-300"
            />
            
            {/* Texte traduit dynamiquement */}
            <span className={`text-[9px] font-medium tracking-tight text-center leading-tight ${active ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>

            {/* Indicateur de position (petit point lumineux) */}
            {active && (
              <div className="absolute -bottom-1.5 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]" />
            )}
          </Link>
        );
      })}

    </nav>
  );
}