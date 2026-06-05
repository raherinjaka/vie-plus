"use client";
//DashboardObjetifs.tsx
import { motion } from "framer-motion";
import { Target, ArrowRight, Trophy, Plus } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface ObjectifPreview {
  id: string;
  titre: string;
  categorie: string;
  progression: number;
}

interface Props {
  objectifs: ObjectifPreview[];
  scoreGlobal: number;
  loading: boolean;
}

// ─── Category colors ──────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  Projet: { color: "text-violet-300",  bg: "bg-violet-500/15",  icon: "⚡" },
  Santé:  { color: "text-emerald-300", bg: "bg-emerald-500/15", icon: "💚" },
  Argent: { color: "text-yellow-300",  bg: "bg-yellow-500/15",  icon: "💰" },
  Études: { color: "text-cyan-300",    bg: "bg-cyan-500/15",    icon: "🧠" },
};
const getCat = (c: string) =>
  CAT_COLORS[c] ?? { color: "text-slate-300", bg: "bg-slate-500/15", icon: "⚡" };

// ─── Mini progress ring ───────────────────────────────────────────────────────
function MiniRing({ pct }: { pct: number }) {
  const r    = 14;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct / 100) * circ;
  const done = pct >= 100;
  return (
    <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
      <svg className="w-9 h-9 -rotate-90 absolute" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#1e293b" strokeWidth="3.5" />
        <circle cx="18" cy="18" r={r} fill="none"
          stroke={done ? "#22d3ee" : pct > 60 ? "#0ea5e9" : pct > 30 ? "#8b5cf6" : "#334155"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          className="transition-all duration-700"
          style={done ? { filter: "drop-shadow(0 0 4px #22d3ee)" } : undefined}
        />
      </svg>
      <span className="text-[8px] font-black font-mono z-10"
        style={{ color: done ? "#22d3ee" : "#94a3b8" }}>
        {pct}
      </span>
    </div>
  );
}

// ─── DashboardObjectifs ───────────────────────────────────────────────────────
export default function DashboardObjectifs({ objectifs, scoreGlobal, loading }: Props) {
  const { t } = useLanguage() as any;

  const active = objectifs.filter((o) => o.progression < 100);
  const done   = objectifs.filter((o) => o.progression >= 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.43 }}
      className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-yellow-400 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {t?.objectives?.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {done.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl
              bg-cyan-500/10 border border-cyan-500/20">
              <Trophy size={10} className="text-cyan-400" />
              <span className="text-[9px] font-black text-cyan-400">{done.length}</span>
            </div>
          )}
          <Link href="/objectifs"
            className="text-[10px] font-bold text-slate-500 hover:text-cyan-300
              transition-colors flex items-center gap-1">
            {t?.objectives?.seeAll} <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Global score */}
      {objectifs.length > 0 && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl
          bg-white/[0.025] border border-white/[0.07] mb-4">
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {t?.objectives?.globalScore}
            </p>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${scoreGlobal}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                style={{ boxShadow: "0 0 8px rgba(34,211,238,0.4)" }}
              />
            </div>
          </div>
          <span className="text-xl font-black font-mono text-cyan-300 flex-shrink-0">
            {scoreGlobal}%
          </span>
        </div>
      )}

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
              <div className="w-9 h-9 rounded-full bg-white/5" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-28 bg-white/5 rounded-full" />
                <div className="h-1.5 w-full bg-white/5 rounded-full" />
              </div>
              <div className="h-2 w-8 bg-white/5 rounded-full" />
            </div>
          ))
        ) : active.length === 0 && done.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-3xl bg-white/[0.02] border border-white/[0.06]
              flex items-center justify-center mb-3">
              <Target size={20} className="text-slate-700" />
            </div>
            <p className="text-slate-600 text-xs font-bold">{t?.objectives?.empty}</p>
            <Link href="/objectifs"
              className="flex items-center gap-1 mt-3 text-[10px] font-bold
                text-cyan-400 hover:text-cyan-300 transition-colors">
              <Plus size={11} /> {t?.objectives?.add}
            </Link>
          </div>
        ) : (
          <>
            {active.slice(0, 4).map((obj, i) => {
              const cat = getCat(obj.categorie);
              return (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl
                    hover:bg-white/[0.03] transition-colors group"
                >
                  <MiniRing pct={obj.progression} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-bold truncate">{obj.titre}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5
                      rounded-md ${cat.bg} ${cat.color} mt-0.5`}>
                      {cat.icon} {obj.categorie}
                    </span>
                  </div>
                  <span className="text-[10px] font-black font-mono text-slate-500 flex-shrink-0">
                    {obj.progression}%
                  </span>
                </motion.div>
              );
            })}

            {/* Trophées */}
            {done.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl
                bg-cyan-500/[0.05] border border-cyan-500/10 mt-1">
                <Trophy size={12} className="text-cyan-400 flex-shrink-0" />
                <p className="text-[10px] font-bold text-cyan-400/80">
                  {done.length > 1
                    ? t?.objectives?.completedPlural?.replace("{n}", done.length)
                    : t?.objectives?.completedSingular}
                  {" "}🏆
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}