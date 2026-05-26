"use client";

// ============================================================
// components/tache/column/ColumnMenu.tsx
// Dropdown menu : renommer / supprimer une colonne
// ============================================================

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  columnId: string;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function ColumnMenu({ onRename, onDelete, onClose }: Props) {
  const { t } = useLanguage() as any;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-8 z-50 w-44
                 bg-[#1e1e2a] border border-zinc-700/60
                 rounded-xl shadow-xl overflow-hidden"
    >
      {/* Renommer */}
      <button
        onClick={onRename}
        className="w-full px-4 py-2.5 text-left text-sm text-zinc-300
                   hover:bg-zinc-800 transition-colors flex items-center gap-2.5"
      >
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" className="shrink-0"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          />
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        {t?.column?.menuRename}
      </button>

      <div className="border-t border-zinc-800" />

      {/* Supprimer */}
      <button
        onClick={onDelete}
        className="w-full px-4 py-2.5 text-left text-sm text-red-400
                   hover:bg-red-900/20 transition-colors flex items-center gap-2.5"
      >
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" className="shrink-0"
        >
          <polyline
            points="3,6 5,6 21,6"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        {t?.column?.menuDelete}
      </button>
    </motion.div>
  );
}