// components/contact/ProgressBar.tsx
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  step: 1 | 2;
  total?: number;
}

export default function ProgressBar({ step, total = 2 }: ProgressBarProps) {
  const pct = (step / total) * 100;

  return (
    <div className="relative h-[3px] bg-slate-800/80 w-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 rounded-r-full"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Lueur qui se déplace */}
      <motion.div
        className="absolute top-0 h-full w-12 bg-white/20 blur-sm"
        animate={{ x: [`-3rem`, `${pct * 5}px`] }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Points d'étape */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full border"
            animate={{
              backgroundColor: i < step ? "#22D3EE" : "#1E293B",
              borderColor: i < step ? "#22D3EE" : "#334155",
              scale: i === step - 1 ? 1.4 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}