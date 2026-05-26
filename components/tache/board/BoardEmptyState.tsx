"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBoard } from "@/hooks/useBoard";
import { useLanguage } from "@/context/LanguageContext";

export default function BoardEmptyState() {
  const { createBoard, isCreatingBoard } = useBoard();
  const { t } = useLanguage() as any;
  const [showDialog, setShowDialog] = useState(false);
  const [boardName, setBoardName] = useState("");

  const handleCreate = () => {
    const name = boardName.trim();
    if (!name) return;
    createBoard(name);
    setShowDialog(false);
    setBoardName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") setShowDialog(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f13] select-none">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[600px] h-[600px] rounded-full opacity-[0.04]
                        bg-gradient-radial from-violet-500 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 
                        flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               className="text-zinc-500">
            <rect x="3" y="3" width="7" height="7" rx="1.5"
                  stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"
                  stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"
                  stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"
                  stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-zinc-200 text-xl font-semibold tracking-tight">
            {t?.board?.emptyState?.title}
          </h1>
          <p className="text-zinc-600 text-sm max-w-xs">
            {t?.board?.emptyState?.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-2.5 
                     bg-violet-600 hover:bg-violet-500 
                     text-white text-sm font-medium rounded-xl
                     transition-all duration-200 shadow-lg shadow-violet-900/40
                     hover:shadow-violet-800/50 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="text-lg leading-none">+</span>
          {t?.board?.emptyState?.createBtn}
        </button>
      </motion.div>

      <AnimatePresence>
        {showDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDialog(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                         w-[340px] bg-[#1a1a22] border border-zinc-800 rounded-2xl 
                         shadow-2xl p-6 space-y-4"
            >
              <div className="space-y-1">
                <h2 className="text-zinc-100 font-semibold">
                  {t?.board?.emptyState?.dialog?.title}
                </h2>
                <p className="text-zinc-500 text-xs">
                  {t?.board?.emptyState?.dialog?.subtitle}
                </p>
              </div>

              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t?.board?.emptyState?.dialog?.placeholder}
                autoFocus
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 
                           rounded-lg text-zinc-100 text-sm placeholder:text-zinc-600
                           focus:outline-none focus:border-violet-500 
                           transition-colors"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 py-2 rounded-lg border border-zinc-700 
                             text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
                >
                  {t?.board?.emptyState?.dialog?.cancel}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!boardName.trim() || isCreatingBoard}
                  className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500
                             text-white text-sm font-medium transition-colors
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCreatingBoard
                    ? t?.board?.emptyState?.dialog?.creating
                    : t?.board?.emptyState?.dialog?.create}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}