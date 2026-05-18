"use client";

import { motion } from "framer-motion";
import { Wallet, Clock, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CatBar {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  total: number;
}

interface Props {
  montantTotal: number;
  montantDepense: number;
  montantRestant: number;
  pct: number;
  dateFin: string | null;
  topCats: CatBar[];
  configured: boolean;
}

// ─── Mini ring ────────────────────────────────────────────────────────────────
function MiniRing({ pct }: { pct: number }) {
  const r     = 42;
  const circ  = 2 * Math.PI * r;
  const off   = circ - Math.max(0, Math.min(100, pct)) / 100 * circ;
  const color = pct < 20 ? "#f87171" : pct < 50 ? "#fb923c" : "#22d3ee";
  const glow  = pct < 20 ? "rgba(248,113,113,0.5)" : pct < 50 ? "rgba(251,146,60,0.4)" : "rgba(34,211,238,0.4)";

  return (
    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
      <svg className="w-28 h-28 -rotate-90 absolute" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-xl font-black font-mono" style={{ color }}>
          {Math.round(pct)}%
        </span>
        <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
          restant
        </span>
      </div>
    </div>
  );
}

// ─── DashboardBudget ──────────────────────────────────────────────────────────
export default function DashboardBudget({
  montantTotal, montantDepense, montantRestant, pct, dateFin, topCats, configured,
}: Props) {
  const { t, lang } = useLanguage() as any;

  if (!configured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="h-full min-h-[300px] rounded-3xl border border-dashed border-white/10
          flex flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/[0.07]
          flex items-center justify-center">
          <Wallet size={24} className="text-slate-600" />
        </div>
        <div>
          <p className="text-slate-400 font-bold text-sm">{t.budget.unconfigured.title}</p>
          <p className="text-slate-700 text-xs mt-1">{t.budget.unconfigured.sub}</p>
        </div>

        <Link href="/depenses"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
            bg-cyan-500/10 border border-cyan-500/20 text-cyan-300
            font-bold text-xs hover:bg-cyan-500/15 transition-all">
          {t.budget.unconfigured.button} <ArrowRight size={13} />
        </Link>
      </motion.div>
    );
  }

  const dateFinStr = useMemo(() => {
    if (!dateFin) return null;
    const d = new Date(dateFin);
    if (isNaN(d.getTime())) return null; // Sécurité si la date est invalide
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { 
      day: "numeric", 
      month: "long" 
    });
  }, [dateFin, lang]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full rounded-3xl border border-white/[0.07] bg-white/[0.02]
        p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-emerald-400 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {t.budget.title}
          </span>
        </div>
        <Link href="/depenses"
          className="text-[10px] font-bold text-slate-500 hover:text-cyan-300
            transition-colors flex items-center gap-1">
          {t.budget.view_all} <ArrowRight size={11} />
        </Link>
      </div>

      {/* Ring + numbers */}
      <div className="flex items-center gap-5">
        <MiniRing pct={pct} />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{t.budget.remaining}</p>
            <p className="text-xl font-black font-mono text-white">
              {montantRestant.toLocaleString()} Ar
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-0.5">{t.budget.total}</p>
              <p className="text-xs font-black font-mono text-slate-300">
                {montantTotal.toLocaleString()} Ar
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-500/[0.05] border border-red-500/10">
              <p className="text-[8px] font-black uppercase tracking-widest text-red-400/50 mb-0.5">{t.budget.spent}</p>
              <p className="text-xs font-black font-mono text-red-400">
                -{montantDepense.toLocaleString()} Ar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              pct < 20 ? "bg-red-500" : pct < 50 ? "bg-orange-400" : "bg-cyan-400"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{
              boxShadow: pct < 20
                ? "0 0 8px rgba(248,113,113,0.5)"
                : pct < 50
                  ? "0 0 8px rgba(251,146,60,0.4)"
                  : "0 0 8px rgba(34,211,238,0.4)",
            }}
          />
        </div>
        {dateFinStr && (
          <div className="flex items-center gap-1.5 mt-2">
            <Clock size={10} className="text-slate-600" />
            <p className="text-[9px] font-mono text-slate-600">{t.budget.cycle_until.replace("{date}", dateFinStr)}</p>
          </div>
        )}
      </div>

      {/* Top categories */}
      {topCats.filter((c) => c.total > 0).length > 0 && (
        <div className="space-y-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
            {t.budget.top_categories}
          </p>
          {topCats.filter((c) => c.total > 0).slice(0, 3).map((c, i) => {
            const pctCat = montantDepense > 0 ? (c.total / montantDepense) * 100 : 0;
            return (
              <motion.div key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-2.5"
              >
                <span className="text-sm flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] font-bold ${c.color}`}>{c.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {c.total.toLocaleString()} Ar
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${c.color.replace("text-", "bg-")}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pctCat}%` }}
                      transition={{ duration: 0.8, delay: 0.45 + i * 0.07 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lock badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl
        bg-white/[0.02] border border-white/[0.05] mt-auto">
        <Lock size={10} className="text-slate-600" />
        <p className="text-[9px] font-bold text-slate-600">
        {t.budget.locked} · {montantTotal.toLocaleString()} Ar
        </p>
      </div>
    </motion.div>
  );
}