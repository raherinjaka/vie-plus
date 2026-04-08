"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";

// 1. TON MOTEUR DE STYLE (ON NE TOUCHE PAS, IL EST TOP)
function GlassBlock({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-2xl bg-slate-950/80 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 transition-colors duration-500 ${className}`}
      style={{ "--x": "50%", "--y": "50%" } as any}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ background: "radial-gradient(400px circle at var(--x) var(--y), rgba(34,211,238,0.1), transparent 40%)" }}
      />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.8) 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
        }} />
      </div>
      <div className="relative z-10 h-full p-6">{children}</div>
    </motion.div>
  );
}

// 2. TA PAGE DASHBOARD NETTOYÉE (VUE D'ENSEMBLE VIDE)
export default function DashboardPage() {
  const [userName, setUserName] = useState("Utilisateur");
  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      
      <Sidebar />
      <Navbar />

      <div className="flex-1 h-full overflow-y-auto scroll-smooth no-scrollbar">
        <div className="space-y-10 max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-32">
            
            {/* HEADER : DATE + BIENVENUE */}
            <header className="mb-16 relative">
              <motion.div initial="hidden" animate="visible" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="text-slate-400 font-light italic">Bienvenue,</span>
                  <span className="text-white ml-2">{userName}</span>
                </h2>

                <div className="relative w-full max-w-2xl">
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1px] bg-gradient-to-r from-cyan-500 via-blue-500/30 to-transparent"
                  />
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.8 }}
                  className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-medium"
                >
                  {/* Date automatique en français */}
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </motion.p>
              </motion.div>
            </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* LES 4 PILIERS (VIDES) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassBlock className="h-32 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Finances</span>
                  <p className="text-xl font-bold text-slate-700 mt-1 italic">--- Ar</p>
                </GlassBlock>
                <GlassBlock className="h-32 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Tâches</span>
                  <p className="text-xl font-bold text-slate-700 mt-1 italic">-- / --</p>
                </GlassBlock>
                <GlassBlock className="h-32 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Statut</span>
                  <p className="text-xl font-bold text-slate-700 mt-1 italic">...</p>
                </GlassBlock>
                <GlassBlock className="h-32 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Objectif</span>
                  <p className="text-xl font-bold text-slate-700 mt-1 italic">-- %</p>
                </GlassBlock>
              </div>

              {/* MONITEUR DE BUDGET (VIDE) */}
              <GlassBlock className="h-[350px] flex flex-col justify-center items-center text-center">
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Vue d'ensemble du budget</h3>
                  <div className="w-16 h-1 w-full max-w-xs bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 w-[10%] animate-pulse" />
                  </div>
                  <p className="text-slate-600 text-xs mt-6 italic">En attente de configuration budgétaire...</p>
              </GlassBlock>
            </div>

            {/* FLUX DE VIE (VIDE) */}
            <aside className="h-full">
              <GlassBlock className="h-full min-h-[500px] flex flex-col">
                 <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-6">Flux de Vie</h3>
                 <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Aucune activité</p>
                 </div>
              </GlassBlock>
            </aside>
          </div>

        </div>
      </div>

      <MobileNav />
    </div>
  );
}