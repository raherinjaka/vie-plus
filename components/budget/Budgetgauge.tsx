"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, TrendingDown } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  montantTotal: number;  // budget fixe + ajouts
  montantDepense: number;
  montantRestant: number;
  pct: number; // % restant (0-100)
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimCount({ value, suffix = "Ar" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const dur  = 900;
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
  return <span className="font-mono tabular-nums">{display.toLocaleString()} {suffix}</span>;
}

// ─── BudgetGauge ──────────────────────────────────────────────────────────────
export default function BudgetGauge({ montantTotal, montantDepense, montantRestant, pct }: Props) {
  const r       = 56;
  const circ    = 2 * Math.PI * r;
  const offset  = circ - Math.max(0, Math.min(100, pct)) / 100 * circ;
  const isEmpty = pct <= 0;
  const isDanger  = pct < 20;
  const isWarning = pct < 50;

  const strokeColor = isEmpty   ? "#a78bfa"
    : isDanger   ? "#f87171"
    : isWarning  ? "#fb923c"
    : "#22d3ee";

  const glowColor = isEmpty   ? "rgba(167,139,250,0.6)"
    : isDanger   ? "rgba(248,113,113,0.6)"
    : isWarning  ? "rgba(251,146,60,0.5)"
    : "rgba(34,211,238,0.5)";

  const textColor = isEmpty   ? "text-violet-300"
    : isDanger   ? "text-red-300"
    : isWarning  ? "text-orange-300"
    : "text-cyan-300";

  const bgColor = isEmpty   ? "bg-violet-500/5 border-violet-500/15"
    : isDanger   ? "bg-red-500/5 border-red-500/15"
    : isWarning  ? "bg-orange-500/5 border-orange-500/15"
    : "bg-cyan-500/5 border-cyan-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative p-6 rounded-3xl border ${bgColor}
        flex flex-col sm:flex-row items-center gap-8`}
    >
      {/* SVG Ring */}
      <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: strokeColor }} />

        <svg className="w-40 h-40 -rotate-90 absolute" viewBox="0 0 136 136">
          {/* Background track */}
          <circle cx="68" cy="68" r={r} fill="none"
            stroke="#1e293b" strokeWidth="10" />
          {/* Secondary softer track */}
          <circle cx="68" cy="68" r={r} fill="none"
            stroke={strokeColor} strokeWidth="10"
            opacity="0.08" />
          {/* Progress arc */}
          <motion.circle
            cx="68" cy="68" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 20px ${glowColor})` }}
          />
          {/* Dot at the end */}
          {pct > 2 && (
            <circle
              cx="68" cy={68 - r}
              r="5"
              fill={strokeColor}
              style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="flex flex-col items-center z-10">
          <motion.div
            animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isEmpty || isDanger
              ? <Flame size={18} className={textColor} />
              : isWarning
                ? <TrendingDown size={18} className={textColor} />
                : <Sparkles size={18} className={textColor} />
            }
          </motion.div>
          <span className={`text-3xl font-black font-mono mt-1 ${textColor}`}>
            {Math.round(pct)}%
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-0.5">
            restant
          </span>
        </div>
      </div>

      {/* Right: breakdown */}
      <div className="flex-1 w-full space-y-4">

        {/* Total bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Solde restant
            </span>
            <span className={`text-sm font-black font-mono ${textColor}`}>
              <AnimCount value={montantRestant} />
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: strokeColor, boxShadow: `0 0 8px ${glowColor}` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
              Budget total
            </p>
            <p className="text-sm font-black text-white font-mono">
              <AnimCount value={montantTotal} />
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-red-500/[0.05] border border-red-500/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-red-400/60 mb-1">
              Dépensé
            </p>
            <p className="text-sm font-black text-red-400 font-mono">
              -<AnimCount value={montantDepense} />
            </p>
          </div>
        </div>

        {/* Danger alert */}
        {isDanger && !isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl
              bg-red-500/[0.08] border border-red-500/15"
          >
            <Flame size={13} className="text-red-400 flex-shrink-0 animate-pulse" />
            <p className="text-[11px] font-bold text-red-300">
              {isEmpty
                ? "Budget épuisé ! Il est temps de faire un bilan."
                : "Attention, il te reste moins de 20% de ton budget !"}
            </p>
          </motion.div>
        )}

        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl
              bg-violet-500/[0.08] border border-violet-500/15"
          >
            <Flame size={13} className="text-violet-400 flex-shrink-0" />
            <p className="text-[11px] font-bold text-violet-300">
              Budget épuisé ! Lance un nouveau cycle pour continuer.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}