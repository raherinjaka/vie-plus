"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getCatMeta, normKey, type Objectif } from "./types";
import { Trophy } from "lucide-react";

interface Props {
  objectifs: Objectif[];
  t: any;
  locale: string;
}

export default function ObjectifTrophies({ objectifs, t, locale }: Props) {
  if (objectifs.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mt-16"
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-[1.125rem] h-[1.125rem]" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            {t?.objectifsPage?.trophyWall?.title ?? "Objectifs accomplis"}
          </h2>
          <span className="text-xs font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
            {objectifs.length}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-700/60 to-transparent" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {objectifs.map((obj, idx) => {
            const catMeta     = getCatMeta(obj.categorie);
            const catLabelKey = normKey(obj.categorie);
            return (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06, duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                  border border-emerald-500/15 bg-emerald-950/20
                  hover:border-emerald-500/25 hover:bg-emerald-950/30
                  transition-all duration-200 group">

                  {/* Check icon */}
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25
                    flex items-center justify-center text-emerald-400 text-sm flex-shrink-0
                    group-hover:bg-emerald-500/15 transition-colors duration-200">
                    ✓
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${catMeta.color}`}>
                      <catMeta.icon size={11} /> {t?.objectifsPage?.categories?.[catLabelKey] ?? catMeta.label}
                    </span>
                    </div>
                    <p className="text-slate-300 text-sm font-semibold truncate leading-snug">
                      {obj.titre}
                    </p>
                    {obj.deadline && (
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {new Date(obj.deadline).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>

                  {/* 100% badge */}
                  <span className="text-[10px] font-black text-emerald-400/80 font-mono flex-shrink-0">
                    100%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}