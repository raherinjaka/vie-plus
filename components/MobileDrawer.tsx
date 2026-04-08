"use client";
import { LayoutDashboard, Wallet, ClipboardList, Target, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Dépenses", icon: Wallet, href: "/depenses" },
    { name: "Tâches", icon: ClipboardList, href: "/taches" },
    { name: "Objectifs", icon: Target, href: "/objectifs" },
  ];

  return (
    <>
      {/* Overlay qui assombrit le fond */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Le Tiroir qui slide depuis la droite */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-slate-950 border-l border-white/5 z-[999] shadow-2xl p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <span className="text-xl font-black text-white italic">VIE<span className="text-cyan-500">.</span>PLUS</span>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={onClose}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Icon size={22} />
                <span className="font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button className="mt-auto absolute bottom-10 left-6 right-6 flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={22} />
          <span className="font-bold">Déconnexion</span>
        </button>
      </div>
    </>
  );
}