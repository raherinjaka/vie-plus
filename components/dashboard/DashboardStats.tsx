"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingDown, Target, CheckSquare, Flame, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  soldeRestant: number;
  totalDepenses: number;
  scoreObjectifs: number;
  tachesRatio: { done: number; total: number } | null;
  budgetConfigured: boolean;
}

// ─── Animated number ──────────────────────────────────────────────────────────
function AnimNum({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const dur = 1000;
    const t0  = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="font-mono tabular-nums">{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── Single KPI card ──────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, color, bg, border, glow, delay, shimmer = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  glow: string;
  delay: number;
  shimmer?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden p-5 rounded-3xl border ${bg} ${border}
        cursor-default transition-colors duration-300 group`}
      style={{ boxShadow: shimmer ? `0 0 30px ${glow}` : undefined }}
    >
      {/* Hover radial glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 70%)` }}
      />

      {/* Icon */}
      <div className={`w-9 h-9 rounded-2xl ${bg} border ${border}
        flex items-center justify-center mb-4`}>
        <Icon size={17} className={color} />
      </div>

      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
        {label}
      </p>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      {sub && <p className="text-[10px] text-slate-600 font-mono mt-1">{sub}</p>}
    </motion.div>
  );
}

// ─── DashboardStats ───────────────────────────────────────────────────────────
export default function DashboardStats({
  soldeRestant, totalDepenses, scoreObjectifs, tachesRatio, budgetConfigured,
}: Props) {
  const { t } = useLanguage() as any;

  const soldeDanger = soldeRestant < (soldeRestant * 0.2);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {/* Solde */}
      <KpiCard
        label={t?.stats?.balance?.label}
        value={budgetConfigured
          ? <AnimNum to={soldeRestant} suffix=" Ar" />
          : <span className="text-slate-600 text-lg italic">{t?.stats?.notConfigured}</span>
        }
        sub={budgetConfigured ? t?.stats?.balance?.sub : undefined}
        icon={soldeDanger && budgetConfigured ? Flame : Wallet}
        color={soldeDanger && budgetConfigured ? "text-red-300" : "text-cyan-300"}
        bg={soldeDanger && budgetConfigured ? "bg-red-500/[0.06]" : "bg-cyan-500/[0.06]"}
        border={soldeDanger && budgetConfigured ? "border-red-500/15" : "border-cyan-500/15"}
        glow={soldeDanger && budgetConfigured ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.15)"}
        delay={0.05}
        shimmer={soldeDanger && budgetConfigured}
      />

      {/* Dépenses */}
      <KpiCard
        label={t?.stats?.expenses?.label}
        value={budgetConfigured
          ? <AnimNum to={totalDepenses} suffix=" Ar" />
          : <span className="text-slate-600 text-lg italic">—</span>
        }
        sub={budgetConfigured ? t?.stats?.expenses?.sub : undefined}
        icon={TrendingDown}
        color="text-red-300"
        bg="bg-red-500/[0.05]"
        border="border-red-500/[0.12]"
        glow="rgba(248,113,113,0.12)"
        delay={0.1}
      />

      {/* Objectifs */}
      <KpiCard
        label={t?.stats?.objectives?.label}
        value={<AnimNum to={scoreObjectifs} suffix="%" />}
        sub={t?.stats?.objectives?.sub}
        icon={scoreObjectifs >= 80 ? Sparkles : Target}
        color={scoreObjectifs >= 80 ? "text-emerald-300" : scoreObjectifs >= 50 ? "text-yellow-300" : "text-violet-300"}
        bg={scoreObjectifs >= 80 ? "bg-emerald-500/[0.06]" : scoreObjectifs >= 50 ? "bg-yellow-500/[0.06]" : "bg-violet-500/[0.06]"}
        border={scoreObjectifs >= 80 ? "border-emerald-500/15" : scoreObjectifs >= 50 ? "border-yellow-500/15" : "border-violet-500/15"}
        glow={scoreObjectifs >= 80 ? "rgba(52,211,153,0.15)" : scoreObjectifs >= 50 ? "rgba(234,179,8,0.15)" : "rgba(167,139,250,0.15)"}
        delay={0.15}
        shimmer={scoreObjectifs >= 80}
      />

      {/* Tâches */}
      <KpiCard
        label={t?.stats?.tasks?.label}
        value={tachesRatio
          ? <><AnimNum to={tachesRatio.done} /> / {tachesRatio.total}</>
          : <span className="text-slate-600 text-lg italic">—</span>
        }
        sub={tachesRatio
          ? t?.stats?.tasks?.subPct?.replace("{pct}",
              Math.round((tachesRatio.done / Math.max(tachesRatio.total, 1)) * 100))
          : t?.stats?.tasks?.subEmpty
        }
        icon={CheckSquare}
        color="text-blue-300"
        bg="bg-blue-500/[0.06]"
        border="border-blue-500/[0.12]"
        glow="rgba(59,130,246,0.12)"
        delay={0.2}
      />
    </div>
  );
}