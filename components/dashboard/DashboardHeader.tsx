"use client";
//DashboardHeader.tsx
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

interface Props {
  userName: string;
  solde: number;
  budgetTotal: number;
  pct: number;
}

function getGreeting(t: any): string {
  const h = new Date().getHours();
  if (h < 5)  return t?.dashboard?.greetings?.night;
  if (h < 12) return t?.dashboard?.greetings?.morning;
  if (h < 18) return t?.dashboard?.greetings?.afternoon;
  return t?.dashboard?.greetings?.evening;
}

function getMoodConfig(pct: number, t: any) {
  if (pct <= 0)  return { label: t?.dashboard?.mood?.empty,    color: "text-violet-400", bg: "bg-violet-500/10",  border: "border-violet-500/20",  Icon: Minus,        glow: "rgba(167,139,250,0.3)" };
  if (pct < 20)  return { label: t?.dashboard?.mood?.critical,  color: "text-red-400",    bg: "bg-red-500/10",     border: "border-red-500/20",     Icon: TrendingDown, glow: "rgba(248,113,113,0.3)" };
  if (pct < 50)  return { label: t?.dashboard?.mood?.warning,   color: "text-orange-400", bg: "bg-orange-500/10",  border: "border-orange-500/20",  Icon: TrendingDown, glow: "rgba(251,146,60,0.3)" };
  return           { label: t?.dashboard?.mood?.good,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", Icon: TrendingUp,   glow: "rgba(52,211,153,0.3)"  };
}

export default function DashboardHeader({ userName, solde, budgetTotal, pct }: Props) {
  const { t } = useLanguage() as any;
  const { format } = useCurrency();

  const greeting = getGreeting(t);
  const mood     = getMoodConfig(pct, t);
  const MoodIcon = mood.Icon;

  const locale = t?.meta?.locale ?? "fr-FR";

  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).replace(/,/g, "");

  const firstName = userName.split(" ")[0];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-6 relative"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-80 h-40 rounded-full
        opacity-20 blur-3xl"
        style={{ backgroundColor: mood.glow }}
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        {/* Left: greeting */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-px h-4 bg-cyan-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              {dateStr}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            <span className="text-slate-500 font-light italic">{greeting},</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #e2e8f0 0%, #ffffff 40%, #22d3ee 70%, #94a3b8 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 6s linear infinite",
              }}
            >
              {firstName}
            </span>
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 h-px max-w-sm bg-gradient-to-r from-cyan-500/50 via-violet-500/20 to-transparent"
          />
        </div>

        {/* Right: mood badge + solde */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-col items-end gap-3"
        >
          {/* Mood badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border
            ${mood.bg} ${mood.border}`}
            style={{ boxShadow: `0 0 20px ${mood.glow}` }}
          >
            <MoodIcon size={14} className={mood.color} />
            <span className={`text-xs font-black ${mood.color}`}>{mood.label}</span>
          </div>

          {/* Solde rapide */}
          {budgetTotal > 0 && (
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-0.5">
                {t?.dashboard?.balance}
              </p>
              <p className={`text-2xl font-black font-mono ${mood.color}`}>
                {format(solde)}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </motion.header>
  );
}