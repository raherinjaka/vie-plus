"use client";

// ============================================================
// components/tache/modal/blocks/ChecklistBlock.tsx
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChecklist,
  createChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  deleteChecklist,
} from "@/lib/tache/mutations";
import { useBoardStore } from "@/store/boardStore";
import { useLanguage } from "@/context/LanguageContext";
import type { CardWithRelations, ChecklistWithItems } from "@/types/tache.types";

type Props = {
  card: CardWithRelations;
  onRemove: () => void;
};

// ─────────────────────────────────────────────────────────────

export default function ChecklistBlock({ card, onRemove }: Props) {
  const { t } = useLanguage() as any;
  const queryClient = useQueryClient();
  const { applyOptimistic } = useBoardStore();
  const [hideChecked, setHideChecked] = useState(false);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [showNewList, setShowNewList] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["card", card.id] });
    queryClient.invalidateQueries({ queryKey: ["board"] });
  };

  // ── Toggle item ──────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: ({ itemId, checked }: { itemId: string; checked: boolean }) =>
      toggleChecklistItem(itemId, checked),
    onMutate: ({ itemId, checked }) => {
      applyOptimistic({ type: "TOGGLE_CHECKLIST_ITEM", itemId, checked });
    },
    onSuccess: invalidate,
    onError: invalidate,
  });

  // ── Ajouter un item ──────────────────────────────────────
  const addItemMutation = useMutation({
    mutationFn: ({
      checklistId,
      text,
      position,
    }: {
      checklistId: string;
      text: string;
      position: number;
    }) => createChecklistItem({ checklist_id: checklistId, text, position }),
    onSuccess: () => {
      invalidate();
    },
  });

  // ── Supprimer un item ────────────────────────────────────
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteChecklistItem(itemId),
    onSuccess: invalidate,
  });

  // ── Supprimer une checklist ──────────────────────────────
  const deleteListMutation = useMutation({
    mutationFn: (checklistId: string) => deleteChecklist(checklistId),
    onSuccess: () => {
      invalidate();
      if (card.checklists.length <= 1) onRemove();
    },
  });

  // ── Créer une nouvelle checklist ─────────────────────────
  const createListMutation = useMutation({
    mutationFn: (title: string) =>
      createChecklist({
        card_id: card.id,
        title: title || (t?.checklistBlock?.defaultTitle ?? "Checklist"),
        position: card.checklists.length * 1000,
      }),
    onSuccess: () => {
      invalidate();
      setNewListTitle("");
      setShowNewList(false);
    },
  });

  const handleAddItem = (checklistId: string) => {
    const text = (newItemText[checklistId] ?? "").trim();
    if (!text) return;
    const checklist = card.checklists.find((cl) => cl.id === checklistId);
    const position = (checklist?.items.length ?? 0) * 1000;
    addItemMutation.mutate({ checklistId, text, position });
    setNewItemText((prev) => ({ ...prev, [checklistId]: "" }));
    setAddingTo(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="space-y-4"
    >
      {card.checklists.map((checklist) => (
        <ChecklistSection
          key={checklist.id}
          checklist={checklist}
          hideChecked={hideChecked}
          newItemText={newItemText[checklist.id] ?? ""}
          isAddingItem={addingTo === checklist.id}
          t={t}
          onToggleItem={(itemId, checked) =>
            toggleMutation.mutate({ itemId, checked })
          }
          onDeleteItem={(itemId) => deleteItemMutation.mutate(itemId)}
          onDeleteList={() => deleteListMutation.mutate(checklist.id)}
          onStartAdd={() => setAddingTo(checklist.id)}
          onCancelAdd={() => setAddingTo(null)}
          onChangeText={(text) =>
            setNewItemText((prev) => ({ ...prev, [checklist.id]: text }))
          }
          onConfirmAdd={() => handleAddItem(checklist.id)}
          onToggleHideChecked={() => setHideChecked((v) => !v)}
          hideCheckedActive={hideChecked}
        />
      ))}

      {/* ── Ajouter une nouvelle checklist ── */}
      <AnimatePresence>
        {showNewList ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createListMutation.mutate(newListTitle);
                  if (e.key === "Escape") setShowNewList(false);
                }}
                placeholder={t?.checklistBlock?.newListPlaceholder ?? "Titre de la checklist..."}
                className="flex-1 bg-zinc-900/60 border border-zinc-700/60 rounded-xl
                           px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600
                           focus:outline-none focus:border-violet-500/60 transition-colors"
              />
              <button
                onClick={() => createListMutation.mutate(newListTitle)}
                disabled={createListMutation.isPending}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white
                           text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {t?.checklistBlock?.create ?? "Créer"}
              </button>
              <button
                onClick={() => setShowNewList(false)}
                className="px-3 py-2 text-zinc-500 hover:text-zinc-300
                           text-xs transition-colors"
              >
                {t?.checklistBlock?.cancel ?? "Annuler"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowNewList(true)}
            className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300
                       hover:bg-zinc-800/60 rounded-xl transition-colors border
                       border-dashed border-zinc-800 hover:border-zinc-700"
          >
            {t?.checklistBlock?.addAnotherList ?? "+ Ajouter une autre checklist"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sous-composant : une checklist individuelle
// ─────────────────────────────────────────────────────────────

type SectionProps = {
  checklist: ChecklistWithItems;
  hideChecked: boolean;
  hideCheckedActive: boolean;
  newItemText: string;
  isAddingItem: boolean;
  t: any;
  onToggleItem: (itemId: string, checked: boolean) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteList: () => void;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onChangeText: (text: string) => void;
  onConfirmAdd: () => void;
  onToggleHideChecked: () => void;
};

function ChecklistSection({
  checklist,
  hideChecked,
  hideCheckedActive,
  newItemText,
  isAddingItem,
  t,
  onToggleItem,
  onDeleteItem,
  onDeleteList,
  onStartAdd,
  onCancelAdd,
  onChangeText,
  onConfirmAdd,
  onToggleHideChecked,
}: SectionProps) {
  const total = checklist.items.length;
  const checked = checklist.items.filter((i) => i.checked).length;
  const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
  const visibleItems = hideChecked
    ? checklist.items.filter((i) => !i.checked)
    : checklist.items;

  return (
    <div className="space-y-3">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               className="text-zinc-500 shrink-0">
            <polyline points="9,11 12,14 22,4" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-sm font-semibold text-zinc-300">{checklist.title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Masquer les éléments cochés */}
          {checked > 0 && (
            <button
              onClick={onToggleHideChecked}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors
                ${hideCheckedActive
                  ? "bg-violet-600/20 text-violet-400 border border-violet-600/30"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}`}
            >
              {hideCheckedActive
                ? (t?.checklistBlock?.showAll ?? "Tout afficher")
                : (t?.checklistBlock?.hideChecked ?? "Masquer cochés")}
            </button>
          )}
          {/* Supprimer la checklist */}
          <button
            onClick={onDeleteList}
            className="text-xs text-zinc-600 hover:text-red-400
                       px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {t?.checklistBlock?.deleteList ?? "Supprimer"}
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-mono w-8 shrink-0">
          {progress}%
        </span>
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: progress === 100
                ? "linear-gradient(90deg, #059669, #34d399)"
                : "linear-gradient(90deg, #7c3aed, #a78bfa)",
            }}
          />
        </div>
        <span className="text-xs text-zinc-600 w-10 text-right shrink-0">
          {checked}/{total}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {visibleItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="group flex items-center gap-3 px-2 py-1.5 rounded-xl
                         hover:bg-zinc-800/40 transition-colors"
            >
              {/* Checkbox custom */}
              <button
                onClick={() => onToggleItem(item.id, !item.checked)}
                className={`w-4 h-4 rounded shrink-0 border transition-all duration-150
                  flex items-center justify-center
                  ${item.checked
                    ? "bg-violet-600 border-violet-500"
                    : "border-zinc-600 hover:border-violet-500 bg-transparent"}`}
              >
                {item.checked && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="white"
                              strokeWidth="1.5" strokeLinecap="round"
                              strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Texte */}
              <span className={`flex-1 text-sm transition-all duration-150
                ${item.checked
                  ? "line-through text-zinc-600"
                  : "text-zinc-300"}`}
              >
                {item.text}
              </span>

              {/* Supprimer l'item */}
              <button
                onClick={() => onDeleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 shrink-0
                           flex items-center justify-center rounded
                           text-zinc-600 hover:text-red-400 transition-all"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ajouter un item */}
      <AnimatePresence>
        {isAddingItem ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              value={newItemText}
              onChange={(e) => onChangeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onConfirmAdd();
                if (e.key === "Escape") onCancelAdd();
              }}
              placeholder={t?.checklistBlock?.newItemPlaceholder ?? "Nouvel élément..."}
              className="w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl
                         px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600
                         focus:outline-none focus:border-violet-500/60 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={onConfirmAdd}
                disabled={!newItemText.trim()}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500
                           disabled:opacity-40 text-white text-xs font-medium
                           rounded-lg transition-colors"
              >
                {t?.checklistBlock?.addItem ?? "Ajouter"}
              </button>
              <button
                onClick={onCancelAdd}
                className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300
                           text-xs transition-colors"
              >
                {t?.checklistBlock?.cancel ?? "Annuler"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onStartAdd}
            className="flex items-center gap-2 text-xs text-zinc-500
                       hover:text-zinc-300 px-2 py-1.5 rounded-xl
                       hover:bg-zinc-800/40 transition-colors w-full"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t?.checklistBlock?.addItemBtn ?? "+ Ajouter un élément"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}