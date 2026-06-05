"use client";
//Budgetstats.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Sparkles, Flame, BarChart3, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CatStat {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  total: number;
}

interface Props {
  budgetFixe: number;
  totalAjouts: number;
  totalDepenses: number;
  soldeRestant: number;
  pct: number;
  catStats: CatStat[];
}

// ─── Animated number ──────────────────────────────────────────────────────────
function AnimNum({ value, prefix = "", className = "" }: {
  value: number; prefix?: string; className?: string;
}) {
  const { format } = useCurrency();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    const dur  = 800;
    const t0   = performance.now();
    const from = display;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}{format(display)}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, icon: Icon, value, prefix = "", color, bg, border, delay, iconColor,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  prefix?: string;
  color: string;
  bg: string;
  border: string;
  delay: number;
  iconColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-5 rounded-3xl border ${bg} ${border}
        hover:scale-[1.02] transition-transform duration-200 cursor-default`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className={iconColor} />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          {label}
        </span>
      </div>
      <AnimNum value={value} prefix={prefix} className={`text-2xl font-black ${color}`} />
    </motion.div>
  );
}

// ─── Stats panel ──────────────────────────────────────────────────────────────
function StatsPanel({ catStats, totalDepenses, onClose }: {
  catStats: CatStat[];
  totalDepenses: number;
  onClose: () => void;
}) {
  const { t } = useLanguage() as any;
  const { format } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.07] mt-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-px h-4 bg-emerald-400 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
              {t?.budgetStats?.panel?.title}
            </h3>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl
              text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all">
            <X size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {catStats.map((c, i) => {
            const pct = totalDepenses > 0 ? (c.total / totalDepenses) * 100 : 0;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-2xl ${c.bg} border ${c.border} flex items-center gap-3`}
              >
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${c.color}`}>
                    {c.label}
                  </p>
                  <p className="text-white font-black text-sm font-mono truncate">
                    {format(c.total)}
                  </p>
                  <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${c.color.replace("text-", "bg-")}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05 + 0.1 }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-600 font-mono mt-0.5">
                    {t?.budgetStats?.panel?.pctLabel
                      ?.replace("{pct}", Math.round(pct))}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top category highlight */}
        {catStats.length > 0 && catStats[0].total > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-4 flex items-center gap-3 p-3 rounded-2xl
              bg-yellow-500/[0.05] border border-yellow-500/10"
          >
            <span className="text-lg">{catStats[0].icon}</span>
            <p className="text-xs text-slate-400">
              <span className="font-black text-yellow-300">{catStats[0].label}</span>
              {" "}{t?.budgetStats?.panel?.topCategory
                ?.replace("{amount}", format(catStats[0].total))} {/* ← format() */}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── BudgetStats ──────────────────────────────────────────────────────────────
export default function BudgetStats({
  budgetFixe, totalAjouts, totalDepenses, soldeRestant, pct, catStats,
}: Props) {
  const { t } = useLanguage() as any;
  const [showPanel, setShowPanel] = useState(false);
  const isDanger = pct < 20;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      {/* Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard
          label={t?.budgetStats?.cards?.fixed}
          icon={Wallet}
          value={budgetFixe}
          color="text-white"
          bg="bg-white/[0.025]"
          border="border-white/[0.07]"
          delay={0.05}
          iconColor="text-slate-500"
        />
        <StatCard
          label={t?.budgetStats?.cards?.added}
          icon={TrendingUp}
          value={totalAjouts}
          prefix="+"
          color="text-emerald-300"
          bg="bg-emerald-500/[0.05]"
          border="border-emerald-500/[0.12]"
          delay={0.1}
          iconColor="text-emerald-400/60"
        />
        <StatCard
          label={t?.budgetStats?.cards?.spent}
          icon={TrendingDown}
          value={totalDepenses}
          prefix="-"
          color="text-red-300"
          bg="bg-red-500/[0.05]"
          border="border-red-500/[0.12]"
          delay={0.15}
          iconColor="text-red-400/60"
        />
        <StatCard
          label={t?.budgetStats?.cards?.balance}
          icon={isDanger ? Flame : Sparkles}
          value={soldeRestant}
          color={isDanger ? "text-red-300" : "text-cyan-300"}
          bg={isDanger ? "bg-red-500/[0.07]" : "bg-cyan-500/[0.05]"}
          border={isDanger ? "border-red-500/20" : "border-cyan-500/[0.12]"}
          delay={0.2}
          iconColor={isDanger ? "text-red-400 animate-pulse" : "text-cyan-400/60"}
        />
      </div>

      {/* Stats toggle button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowPanel((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl
            text-[11px] font-black uppercase tracking-wider border transition-all
            ${showPanel
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-white/[0.02] border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/12"
            }`}
        >
          <BarChart3 size={13} />
          {t?.budgetStats?.toggleBtn}
        </button>
      </div>

      {/* Category breakdown panel */}
      <AnimatePresence>
        {showPanel && (
          <StatsPanel
            catStats={catStats}
            totalDepenses={totalDepenses}
            onClose={() => setShowPanel(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}