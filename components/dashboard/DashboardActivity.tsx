"use client";
//DashboardActivity.tsx

import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, MinusCircle, Target, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

export interface ActivityItem {
  id: string;
  type: "ajout" | "depense" | "objectif";
  label: string;
  sub: string;
  amount?: number;
  pct?: number;
  date: string;
}

interface Props {
  items: ActivityItem[];
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "À l'instant";
  if (mins < 60)  return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

export default function DashboardActivity({ items, loading }: Props) {
  const { t } = useLanguage() as any;
  const { format } = useCurrency();

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    
    if (mins < 1)   return t.activity.time.now;
    if (mins < 60)  return t.activity.time.mins.replace("{n}", mins);
    if (hours < 24) return t.activity.time.hours.replace("{n}", hours);
    if (days === 1) return t.activity.time.yesterday;
    return t.activity.time.days.replace("{n}", days);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 }}
      className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-violet-400 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {t.activity.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-400/70">
          {t.activity.live}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}>
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-32 bg-white/5 rounded-full" />
                <div className="h-2 w-20 bg-white/5 rounded-full" />
              </div>
              <div className="h-2.5 w-16 bg-white/5 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-3xl bg-white/[0.02] border border-white/[0.06]
              flex items-center justify-center mb-3">
              <Clock size={20} className="text-slate-700" />
            </div>
            <p className="text-slate-600 text-xs font-bold">{t.activity.empty_title}</p>
            <p className="text-slate-700 text-[10px] mt-1">{t.activity.empty_sub}</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl
                  hover:bg-white/[0.03] transition-colors duration-200 group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 border
                  ${item.type === "depense"
                    ? "bg-red-500/10 border-red-500/15 text-red-400"
                    : item.type === "ajout"
                      ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400"
                      : "bg-violet-500/10 border-violet-500/15 text-violet-400"
                  }`}
                >
                  {item.type === "depense" && <MinusCircle size={15} />}
                  {item.type === "ajout"   && <PlusCircle  size={15} />}
                  {item.type === "objectif" && <Target size={15} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs font-bold truncate">{item.label}</p>
                  <p className="text-slate-600 text-[10px] font-mono">{item.sub}</p>
                </div>

                {/* Value */}
                <div className="flex-shrink-0 text-right">
                  {item.amount !== undefined && (
                    <p className={`text-xs font-black font-mono
                      ${item.type === "depense" ? "text-red-400" : "text-emerald-400"}`}>
                      {item.type === "depense" ? "-" : "+"}{format(item.amount)}
                    </p>
                  )}
                  {item.pct !== undefined && (
                    <p className="text-xs font-black font-mono text-violet-400">
                      {item.pct}%
                    </p>
                  )}
                  <p className="text-[9px] text-slate-700 font-mono mt-0.5">
                    {timeAgo(item.date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer link */}
      {items.length > 0 && (
        <Link href="/depenses"
          className="flex items-center justify-center gap-1.5 pt-4 mt-2
            border-t border-white/[0.05] text-[10px] font-bold text-slate-600
            hover:text-cyan-300 transition-colors">
          {t.activity.view_all} <ArrowRight size={10} />
        </Link>
      )}
    </motion.div>
  );
}