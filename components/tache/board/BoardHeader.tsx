"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useBoard } from "@/hooks/useBoard";
import { calcBoardProgress } from "@/types/tache.types";
import type { BoardWithColumns } from "@/types/tache.types";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  board: BoardWithColumns;
};

export default function BoardHeader({ board }: Props) {
  const { renameBoard } = useBoard();
  const { t } = useLanguage() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = calcBoardProgress(board.columns);

  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setIsEditing(false);
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(board.title);
      return;
    }
    if (trimmed !== board.title) {
      renameBoard(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setTitle(board.title);
      setIsEditing(false);
    }
  };

  return (
    <header className="flex-shrink-0 px-6 pt-5 pb-3 space-y-3">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-2xl font-bold bg-transparent border-b-2 border-violet-500 
                       text-zinc-100 focus:outline-none w-full max-w-md
                       pb-0.5 tracking-tight"
          />
        ) : (
          <button
            onClick={startEditing}
            title={t?.board?.header?.renameTooltip}
            className="group flex items-center gap-2"
          >
            <h1 className="text-3xl font-black tracking-tight text-zinc-100
                group-hover:text-violet-200 transition-colors duration-200">
              {title}
            </h1>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              className="text-zinc-600 opacity-0 group-hover:opacity-100 
                         transition-opacity shrink-0 mt-0.5"
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
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            {t?.board?.header?.progress}
          </span>
          <span className="text-xs font-bold text-zinc-400 font-mono">{progress}%</span>
        </div>
        <div className="h-1 w-full bg-zinc-800/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-violet-500"
          />
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mt-1" />
    </header>
  );
}