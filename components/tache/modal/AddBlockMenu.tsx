"use client";

// ============================================================
// components/tache/modal/AddBlockMenu.tsx
// Menu déroulant "+ Ajouter" — affiche seulement les blocs inactifs
// ============================================================

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Tag, CheckSquare, Clock } from "lucide-react";

type ActiveBlocks = {
  labels: boolean;
  checklist: boolean;
  dates: boolean;
};

type Props = {
  activeBlocks: ActiveBlocks;
  onAdd: (block: keyof ActiveBlocks) => void;
};

export default function AddBlockMenu({ activeBlocks, onAdd }: Props) {
  const { t } = useLanguage() as any;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Options disponibles = blocs pas encore activés
  // Les labels/desc viennent des traductions, les clés restent stables
  const BLOCK_OPTIONS = [
    {
      key: "labels" as const,
      icon: <Tag size={16} className="text-slate-400" />,
      label: t?.taskModal?.blockLabels,
      desc: t?.taskModal?.blockLabelsDesc,
    },
    {
      key: "checklist" as const,
      icon: <CheckSquare size={16} className="text-slate-400" />,
      label: t?.taskModal?.blockChecklist,
      desc: t?.taskModal?.blockChecklistDesc,
    },
    {
      key: "dates" as const,
      icon: <Clock size={16} className="text-slate-400" />,
      label: t?.taskModal?.blockDates,
      desc: t?.taskModal?.blockDatesDesc,
    },
  ];

  const available = BLOCK_OPTIONS.filter((opt) => !activeBlocks[opt.key]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (available.length === 0) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-violet-600/20 hover:bg-violet-600/30
                   border border-violet-500/30 hover:border-violet-500/50
                   text-violet-300 hover:text-violet-200
                   text-xs font-medium transition-all duration-150"
      >
        <span className="text-sm leading-none">+</span>
        {t?.taskModal?.addBlockBtn}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6,9 12,15 18,9"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-10 z-50 w-52
                       bg-[#1e1e2a] border border-zinc-700/60
                       rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                {t?.taskModal?.addBlockTitle}
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              {available.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    onAdd(opt.key);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                             text-left hover:bg-zinc-800/70 transition-colors group"
                >
                  <span className="text-base leading-none">{opt.icon}</span>
                  <div>
                    <p className="text-sm text-zinc-300 font-medium
                                  group-hover:text-zinc-100 transition-colors">
                      {opt.label}
                    </p>
                    <p className="text-xs text-zinc-600 group-hover:text-zinc-500
                                  transition-colors">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}