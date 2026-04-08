"use client";
import { useState } from "react";
import { LayoutDashboard, Wallet, ClipboardList, Target, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Dépenses", icon: Wallet, href: "/depenses" },
    { name: "Tâches", icon: ClipboardList, href: "/taches" },
    { name: "Objectifs", icon: Target, href: "/objectifs" },
  ];

  return (
    <>
      {/* 1. L'OVERLAY invisible pour fermer en cliquant ailleurs */}
      {isOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen bg-black/20 backdrop-blur-[2px] z-[998]" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* 2. LE HEADER FIXE EN HAUT */}
      <header className="lg:hidden fixed top-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-[999]">
        <h1 className="text-lg font-black text-white italic">VIE<span className="text-cyan-500">.</span>PLUS</h1>
        
        <div className="relative">
          {/* LE BOUTON (Ton style exact) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 p-3 bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-xl transition-all relative z-[1001]"
          >
            <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <div className={`h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4 ml-auto'}`} />
            <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
          </button>

          {/* 3. LA LISTE FLOTTANTE (Style MenuButton) */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 backdrop-blur-2xl p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 z-[1000]">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        active 
                          ? 'bg-cyan-500/10 text-cyan-400' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-bold">{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="h-px bg-white/5 my-1" />
                
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                  <LogOut size={18} />
                  <span className="text-sm font-bold">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}