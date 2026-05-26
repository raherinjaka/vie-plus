"use client";

// ============================================================
// components/tache/modal/blocks/DatesBlock.tsx
// ============================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "@/lib/tache/mutations";
import { useBoardStore } from "@/store/boardStore";
import { useLanguage } from "@/context/LanguageContext";
import type { CardWithRelations } from "@/types/tache.types";

type Props = {
  card: CardWithRelations;
  onRemove: () => void;
};

// Formate une date ISO → "YYYY-MM-DD" pour l'input
function toInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// Formate une date pour l'affichage humain — locale injectée depuis le composant
function toDisplayDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatus(iso: string | null): "overdue" | "today" | "soon" | "ok" | null {
  if (!iso) return null;
  const now = new Date();
  const due = new Date(iso);
  const diffDays = Math.ceil(
    (due.getTime() - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "soon";
  return "ok";
}

const STATUS_STYLES = {
  overdue: "bg-red-900/40 border-red-700/40 text-red-400",
  today:   "bg-amber-900/40 border-amber-700/40 text-amber-400",
  soon:    "bg-orange-900/30 border-orange-700/30 text-orange-400",
  ok:      "bg-emerald-900/20 border-emerald-700/30 text-emerald-400",
};

export default function DatesBlock({ card, onRemove }: Props) {
  const { t } = useLanguage() as any;
  const queryClient = useQueryClient();
  const { applyOptimistic } = useBoardStore();
  const locale = t?.meta?.locale ?? "fr-FR";

  const [value, setValue] = useState(toInputValue(card.due_date));
  const [isDirty, setIsDirty] = useState(false);

  // Sync si la carte change depuis l'extérieur
  useEffect(() => {
    setValue(toInputValue(card.due_date));
    setIsDirty(false);
  }, [card.due_date]);

  const mutation = useMutation({
    mutationFn: (date: string | null) =>
      updateCard(card.id, { due_date: date }),
    onMutate: (date) => {
      applyOptimistic({
        type: "UPDATE_CARD_DUE_DATE",
        cardId: card.id,
        dueDate: date,
      });
      setIsDirty(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
    onError: () => {
      setValue(toInputValue(card.due_date));
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
    },
  });

  const handleSave = () => {
    if (!isDirty) return;
    mutation.mutate(value || null);
  };

  const handleClear = () => {
    setValue("");
    setIsDirty(false);
    mutation.mutate(null);
  };

  const status = getStatus(value || null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="space-y-3"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               className="text-zinc-500">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"
                  stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="10" x2="21" y2="10"
                  stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-sm font-semibold text-zinc-300">
            {t?.datesBlock?.title ?? "Date d'échéance"}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-zinc-600 hover:text-zinc-400 text-xs px-2 py-1
                     rounded-lg hover:bg-zinc-800 transition-colors"
        >
          {t?.datesBlock?.hide ?? "Masquer"}
        </button>
      </div>

      {/* Badge de statut */}
      {status && value && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
                         border text-xs font-medium ${STATUS_STYLES[status]}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{t?.datesBlock?.status?.[status] ?? status}</span>
          {value && (
            <span className="ml-auto opacity-70">{toDisplayDate(value, locale)}</span>
          )}
        </div>
      )}

      {/* Saisie de date */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsDirty(true);
          }}
          onBlur={handleSave}
          className="flex-1 bg-zinc-900/60 border border-zinc-700/60 rounded-xl
                     px-3 py-2 text-sm text-zinc-200
                     focus:outline-none focus:border-violet-500/60
                     transition-colors [color-scheme:dark]"
        />
        {value && (
          <button
            onClick={handleClear}
            title={t?.datesBlock?.clearTitle ?? "Supprimer la date"}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-zinc-600 hover:text-red-400 hover:bg-zinc-800
                       transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bouton enregistrer visible seulement si modifié */}
      {isDirty && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSave}
          disabled={mutation.isPending}
          className="w-full py-2 bg-violet-600 hover:bg-violet-500
                     disabled:opacity-50 text-white text-xs font-medium
                     rounded-xl transition-colors"
        >
          {mutation.isPending
            ? (t?.datesBlock?.saving ?? "Enregistrement...")
            : (t?.datesBlock?.save ?? "Enregistrer la date")}
        </motion.button>
      )}
    </motion.div>
  );
}