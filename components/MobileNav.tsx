"use client";
import { LayoutDashboard, Wallet, ClipboardList, Target } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  // Fonction pour vérifier si l'onglet est actif
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-red-600 backdrop-blur-2xl border border-white/10 px-2 py-3 flex justify-around items-center z-50 rounded-3xl shadow-2xl">
      
      {/* Dashboard */}
      <Link href="/dashboard" className={`p-4 transition-colors ${isActive('/dashboard') ? 'text-cyan-400' : 'text-slate-500'}`}>
        <LayoutDashboard size={24} />
      </Link>

      {/* Dépenses (Portefeuille) */}
      <Link href="/depenses" className={`p-4 transition-colors ${isActive('/depenses') ? 'text-cyan-400' : 'text-slate-500'}`}>
        <Wallet size={24} />
      </Link>

      {/* Tâches */}
      <Link href="/taches" className={`p-4 transition-colors ${isActive('/taches') ? 'text-cyan-400' : 'text-slate-500'}`}>
        <ClipboardList size={24} />
      </Link>

      {/* Objectifs */}
      <Link href="/objectifs" className={`p-4 transition-colors ${isActive('/objectifs') ? 'text-cyan-400' : 'text-slate-500'}`}>
        <Target size={24} />
      </Link>

    </nav>
  );
}