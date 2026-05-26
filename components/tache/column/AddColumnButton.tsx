"use client";

// ============================================================
// components/tache/column/AddColumnButton.tsx
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBoard } from "@/hooks/useBoard";
import { useLanguage } from "@/context/LanguageContext";

type Props = { boardId: string; columnsCount: number };

export default function AddColumnButton({ columnsCount }: Props) {
  const { t } = useLanguage() as any;
  const { createColumn } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setIsAdding(false);
      return;
    }
    createColumn(trimmed);
    setValue("");
    setIsAdding(false);
  };

  return (
    <div className="flex-shrink-0 w-[272px]">
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="bg-[#161620] border border-zinc-800/60 rounded-2xl p-3 space-y-2"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") {
                  setValue("");
                  setIsAdding(false);
                }
              }}
              autoFocus
              placeholder={t?.column?.addColumnPlaceholder}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg
                         px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600
                         focus:outline-none focus:border-violet-500 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500
                           text-white text-xs font-medium rounded-lg transition-colors"
              >
                {t?.column?.addColumnSubmit}
              </button>
              <button
                onClick={() => {
                  setValue("");
                  setIsAdding(false);
                }}
                className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 
                           text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl
                       bg-zinc-900/40 border border-dashed border-zinc-800/60
                       text-zinc-500 hover:text-zinc-300 hover:border-zinc-600
                       hover:bg-zinc-800/30 text-sm transition-all duration-200"
          >
            <span className="text-base leading-none">+</span>
            {columnsCount === 0
              ? t?.column?.createFirst
              : t?.column?.addAnother}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}