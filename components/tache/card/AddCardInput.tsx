"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useBoard } from "@/hooks/useBoard";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  columnId: string;
  onClose: () => void;
};

export default function AddCardInput({ columnId, onClose }: Props) {
  const { createCard } = useBoard();
  const { t } = useLanguage() as any;
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) { onClose(); return; }
    createCard(columnId, trimmed);
    setValue("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === "Escape") onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="mt-2 space-y-2"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t?.card?.addInput?.placeholder}
        rows={2}
        className="w-full resize-none bg-[#1c1c27] border border-violet-500/50
                   rounded-xl px-3 py-2.5 text-sm text-zinc-100
                   placeholder:text-zinc-600 focus:outline-none
                   focus:border-violet-500 transition-colors"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500
                     text-white text-xs font-medium rounded-lg transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t?.card?.addInput?.submit}
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 
                     rounded-lg hover:bg-zinc-800 transition-colors"
          title={t?.card?.addInput?.cancel}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}