"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── Animated Number ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1100;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [value]);
  return <span>{display}{suffix}</span>;
}

interface Props {
  activeCount: number;
  doneCount: number;
  avgScore: number;
  t: any;
}

export default function ObjectifStats({ activeCount, doneCount, avgScore, t }: Props) {
  const stats = [
    {
      label:  t?.objectifsPage?.stats?.active ?? "En cours",
      value:  activeCount,
      suffix: "",
      accent: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
      text:   "text-violet-300",
    },
    {
      label:  t?.objectifsPage?.stats?.score ?? "Score moyen",
      value:  avgScore,
      suffix: "%",
      accent: "from-sky-500/20 to-sky-500/5",
      border: "border-sky-500/20",
      text:   "text-sky-300",
    },
    {
      label:  t?.objectifsPage?.stats?.done ?? "Complétés",
      value:  doneCount,
      suffix: "",
      accent: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      text:   "text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-lg">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + idx * 0.1, duration: 0.45, ease: "easeOut" }}
          className={`
            relative overflow-hidden rounded-2xl border ${stat.border}
            bg-gradient-to-b ${stat.accent}
            backdrop-blur-sm px-4 py-4
          `}
        >
          {/* Subtle top line */}
          <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            {stat.label}
          </p>
          <p className={`text-3xl font-black tabular-nums ${stat.text}`}>
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </p>
        </motion.div>
      ))}
    </div>
  );
}