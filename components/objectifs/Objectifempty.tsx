"use client";

import { motion } from "framer-motion";

interface Props {
  hasFilter: boolean;
  onAdd: () => void;
  t: any;
}

export default function ObjectifEmpty({ hasFilter, onAdd, t }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Illustration — simple SVG rings */}
      <div className="relative mb-6 w-24 h-24">
        <svg viewBox="0 0 96 96" className="w-full h-full opacity-30">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="48" cy="48" r="28" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6"
            style={{ animation: "spin-slow 8s linear infinite", transformOrigin: "48px 48px" }} />
          <circle cx="48" cy="48" r="16" fill="none" stroke="#818cf8" strokeWidth="1" />
          <circle cx="48" cy="48" r="4" fill="#334155" />
        </svg>
        <style>{`@keyframes spin-slow { to { transform: rotate(360deg); }}`}</style>
      </div>

      <p className="text-slate-400 text-sm font-semibold mb-1">
        {hasFilter
          ? (t?.objectifsPage?.emptyFilter ?? "Aucun objectif dans cette catégorie.")
          : (t?.objectifsPage?.emptyActive ?? "Aucun objectif en cours.")}
      </p>
      <p className="text-slate-600 text-xs mb-6">
        {hasFilter
          ? (t?.objectifsPage?.emptyFilterSub ?? "Essayez un autre filtre ou créez-en un nouveau.")
          : (t?.objectifsPage?.emptyActiveSub ?? "Définissez votre premier cap et commencez à avancer.")}
      </p>

      {!hasFilter && (
        <button
          onClick={onAdd}
          className="px-5 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25
            text-sky-300 text-sm font-semibold hover:bg-sky-500/15 hover:border-sky-500/40
            transition-all duration-200 active:scale-95"
        >
          {t?.objectifsPage?.emptyAction ?? "+ Créer mon premier objectif"}
        </button>
      )}
    </motion.div>
  );
}