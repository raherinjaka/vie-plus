"use client";

import { motion } from "framer-motion";
import { CATEGORY_LIST, CATEGORY_META, normKey, type Category } from "./types";

interface Props {
  active: Category | "all";
  onChange: (cat: Category | "all") => void;
  counts: Record<string, number>;
  t: any;
}

export default function ObjectifFilters({ active, onChange, counts, t }: Props) {
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* All */}
      <FilterPill
        active={active === "all"}
        onClick={() => onChange("all")}
        label={t?.objectifsPage?.filters?.all ?? "Tous"}
        count={allCount}
        color="text-slate-300"
        bg="bg-slate-700/50 border-slate-600/50"
        activeBg="bg-slate-100/10 border-slate-400/40"
      />

      {CATEGORY_LIST.map((cat) => {
        const meta = CATEGORY_META[cat];
        const key  = normKey(cat);
        return (
          <FilterPill
            key={cat}
            active={active === cat}
            onClick={() => onChange(cat)}
            label={`${meta.icon} ${t?.objectifsPage?.categories?.[key] ?? meta.label}`}
            count={counts[cat] ?? 0}
            color={meta.color}
            bg="bg-slate-800/60 border-slate-700/50"
            activeBg={meta.bg}
          />
        );
      })}
    </div>
  );
}

function FilterPill({
  active, onClick, label, count, color, bg, activeBg,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: string;
  bg: string;
  activeBg: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl
        text-xs font-semibold border transition-all duration-200
        ${active ? `${activeBg} ${color}` : `${bg} text-slate-500 hover:text-slate-300 hover:border-slate-600`}
      `}
    >
      {label}
      {count > 0 && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-md
          ${active ? "bg-white/10" : "bg-slate-700/60"}
        `}>
          {count}
        </span>
      )}
    </motion.button>
  );
}