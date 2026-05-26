"use client";

// ============================================================
// components/tache/modal/blocks/DescriptionBlock.tsx
// Bloc description — textarea éditable avec sauvegarde auto
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "@/lib/tache/mutations";
import { useBoardStore } from "@/store/boardStore";
import { useLanguage } from "@/context/LanguageContext";
import type { CardWithRelations } from "@/types/tache.types";

type Props = {
  card: CardWithRelations;
};

export default function DescriptionBlock({ card }: Props) {
  const { t } = useLanguage() as any;
  const queryClient = useQueryClient();
  const { applyOptimistic } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(card.description ?? "");
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(card.description ?? "");
  }, [card.description]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value, isEditing]);

  const mutation = useMutation({
    mutationFn: (desc: string) =>
      updateCard(card.id, { description: desc || null }),
    onMutate: (desc) => {
      applyOptimistic({
        type: "UPDATE_CARD_DESCRIPTION",
        cardId: card.id,
        description: desc,
      });
      setHasUnsaved(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
    },
  });

  const handleSave = () => {
    setIsEditing(false);
    if (value !== (card.description ?? "")) {
      mutation.mutate(value);
    } else {
      setHasUnsaved(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setHasUnsaved(e.target.value !== (card.description ?? ""));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               className="text-zinc-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor" strokeWidth="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-sm font-semibold text-zinc-300">
            {t?.taskModal?.descriptionTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsaved && (
            <span className="text-[10px] text-amber-500 font-medium px-2 py-0.5
                             bg-amber-500/10 border border-amber-500/20 rounded-md">
              {t?.taskModal?.unsaved}
            </span>
          )}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => textareaRef.current?.focus(), 0);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 
                         px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {t?.taskModal?.editBtn}
            </button>
          )}
        </div>
      </div>

      {/* Zone de texte */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setValue(card.description ?? "");
                setIsEditing(false);
                setHasUnsaved(false);
              }
            }}
            placeholder={t?.taskModal?.descriptionPlaceholder}
            className="w-full min-h-[90px] resize-none bg-zinc-900/60
                       border border-zinc-700/60 rounded-xl px-3.5 py-3
                       text-sm text-zinc-200 placeholder:text-zinc-600
                       focus:outline-none focus:border-violet-500/60
                       transition-colors leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500
                         text-white text-xs font-medium rounded-lg transition-colors"
            >
              {t?.taskModal?.saveBtn}
            </button>
            <button
              onClick={() => {
                setValue(card.description ?? "");
                setIsEditing(false);
                setHasUnsaved(false);
              }}
              className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300
                         text-xs transition-colors"
            >
              {t?.taskModal?.cancelBtn}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full text-left min-h-[72px] px-3.5 py-3
                     bg-zinc-900/40 hover:bg-zinc-900/70
                     border border-zinc-800/60 rounded-xl
                     transition-colors"
        >
          {value ? (
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {value}
            </p>
          ) : (
            <p className="text-sm text-zinc-600">
              {t?.taskModal?.descriptionPlaceholder}
            </p>
          )}
        </button>
      )}
    </motion.div>
  );
}