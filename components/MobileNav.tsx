"use client";
import { LayoutDashboard, Wallet, ClipboardList, Target } from 'lucide-react';

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-2xl border border-white/10 px-2 py-3 flex justify-around items-center z-50 rounded-3xl shadow-2xl">
      <button className="p-4 text-cyan-400"><LayoutDashboard size={24} /></button>
      <button className="p-4 text-slate-500"><Wallet size={24} /></button>
      <button className="p-4 text-slate-500"><ClipboardList size={24} /></button>
      <button className="p-4 text-slate-500"><Target size={24} /></button>
    </nav>
  );
}