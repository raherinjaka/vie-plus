"use client";
import { LayoutDashboard, Wallet, ClipboardList, Target, Info } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl p-6 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
          <LayoutDashboard size={24} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black tracking-tighter italic">Vie<span className="text-cyan-400">+</span></span>
      </div>
      
      <nav className="space-y-2">
        <NavItem icon={<LayoutDashboard size={22} />} label="Tableau de bord" active />
        <NavItem icon={<Wallet size={22} />} label="Mon Argent" />
        <NavItem icon={<ClipboardList size={22} />} label="Mes Tâches" />
        <NavItem icon={<Target size={22} />} label="Objectifs" />
        <NavItem icon={<Info size={22} />} label="À propos" />
      </nav>

      <div className="mt-auto p-4 bg-gradient-to-b from-transparent to-cyan-500/5 border border-cyan-500/10 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">Système Optimal</p>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
      active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-200'
    }`}>
      {icon} <span className="text-[15px]">{label}</span>
    </button>
  );
}