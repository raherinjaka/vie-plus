"use client";
import { motion } from "framer-motion";

// --- DÉFINITION DU COMPOSANT (Ce qui manquait) ---
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
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className={`group relative overflow-hidden rounded-2xl bg-slate-950/80 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 transition-colors duration-500 ${className}`}
      style={{ "--x": "50%", "--y": "50%" } as any}
    >
      {/* Lumière Cyan */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ background: "radial-gradient(400px circle at var(--x) var(--y), rgba(34,211,238,0.1), transparent 40%)" }}
      />

      {/* Grille de fond (ton style) */}
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

// --- TON DASHBOARD ---
export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 pt-10">
      
      <header>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400/70 text-xs font-medium tracking-wider uppercase">Système Vie Plus</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter">
          Ma <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">Vie</span> Plus
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* LES 4 PILIERS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassBlock className="h-32 flex flex-col justify-center items-center">
              <span className="text-cyan-400/50 text-[9px] uppercase font-bold tracking-widest">Finances</span>
              <p className="text-xl font-bold text-white mt-1">1.2M Ar</p>
            </GlassBlock>
            <GlassBlock className="h-32 flex flex-col justify-center items-center">
              <span className="text-cyan-400/50 text-[9px] uppercase font-bold tracking-widest">Planning</span>
              <p className="text-xl font-bold text-white mt-1">3 Prévus</p>
            </GlassBlock>
            <GlassBlock className="h-32 flex flex-col justify-center items-center">
              <span className="text-cyan-400/50 text-[9px] uppercase font-bold tracking-widest">Énergie</span>
              <p className="text-xl font-bold text-white mt-1">Optimale</p>
            </GlassBlock>
            <GlassBlock className="h-32 flex flex-col justify-center items-center">
              <span className="text-cyan-400/50 text-[9px] uppercase font-bold tracking-widest">Objectif</span>
              <p className="text-xl font-bold text-white mt-1">75%</p>
            </GlassBlock>
          </div>

          {/* FOCUS */}
          <GlassBlock className="h-[400px]">
             <div className="h-px w-12 bg-gradient-to-r from-cyan-500/50 to-transparent mb-6" />
             <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">Action Prioritaire</h3>
             <p className="text-slate-400 mt-4">Prêt pour votre prochaine étape ?</p>
          </GlassBlock>
        </div>

        {/* TIMELINE */}
        <aside>
          <GlassBlock className="h-full min-h-[550px]">
             <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4 mb-6">Flux de Vie</h3>
             <div className="space-y-6 opacity-20">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="flex gap-4 items-center h-4 bg-white/5 rounded-full w-full" />
                ))}
             </div>
          </GlassBlock>
        </aside>
      </div>
    </div>
  );
}