"use client";

// ============================================================
// components/tache/modal/TaskModal.tsx
// Modal principal — overlay + conteneur de tous les blocs
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCardWithRelations } from "@/lib/tache/queries";
import { updateCard } from "@/lib/tache/mutations";
import { useBoardStore } from "@/store/boardStore";
import { useBoard } from "@/hooks/useBoard";
import { useLanguage } from "@/context/LanguageContext";
import AddBlockMenu from "./AddBlockMenu";
import DescriptionBlock from "./DescriptionBlock";
import ChecklistBlock from "./blocks/ChecklistBlock";
import LabelsBlock from "./blocks/LabelsBlock";
import DatesBlock from "./blocks/DatesBlock";
import type { CardWithRelations } from "@/types/tache.types";
import { Tag, CheckSquare, Clock, Calendar } from "lucide-react";

type ActiveBlocks = {
  labels: boolean;
  checklist: boolean;
  dates: boolean;
};

type Props = {
  cardId: string;
  onClose: () => void;
};

export default function TaskModal({ cardId, onClose }: Props) {
  const { t } = useLanguage() as any;
  const queryClient = useQueryClient();
  const { board, applyOptimistic } = useBoardStore();
  const { moveCard, deleteCard } = useBoard();
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: card, isLoading } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => fetchCardWithRelations(cardId),
    staleTime: 10_000,
  });

  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (card) setTitle(card.title);
  }, [card]);

  const [activeBlocks, setActiveBlocks] = useState<ActiveBlocks>({
    labels: false,
    checklist: false,
    dates: false,
  });

  useEffect(() => {
    if (card) {
      setActiveBlocks({
        labels: card.labels.length > 0,
        checklist: card.checklists.length > 0,
        dates: !!card.due_date,
      });
    }
  }, [card]);

  const renameMutation = useMutation({
    mutationFn: (newTitle: string) => updateCard(cardId, { title: newTitle }),
    onMutate: (newTitle) => {
      applyOptimistic({ type: "UPDATE_CARD_TITLE", cardId, title: newTitle });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
    },
  });

  const commitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = title.trim();
    if (!trimmed || trimmed === card?.title) return;
    renameMutation.mutate(trimmed);
  };

  const currentColumnId = card?.column_id ?? "";
  const columns = board?.columns ?? [];

  const handleMoveToColumn = (toColumnId: string) => {
    if (toColumnId === currentColumnId) return;
    const targetCol = columns.find((c) => c.id === toColumnId);
    const newPos = targetCol ? targetCol.cards.length * 1000 : 0;
    moveCard(cardId, currentColumnId, toColumnId, newPos);
    queryClient.setQueryData(
      ["card", cardId],
      (old: CardWithRelations | undefined) =>
        old ? { ...old, column_id: toColumnId } : old
    );
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAddBlock = (block: keyof ActiveBlocks) => {
    setActiveBlocks((prev) => ({ ...prev, [block]: true }));
  };

  const handleRemoveBlock = (block: keyof ActiveBlocks) => {
    setActiveBlocks((prev) => ({ ...prev, [block]: false }));
  };

  return (
    <AnimatePresence>
      {/* ── Overlay ── */}
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm
                   flex items-center justify-center p-4"
      >
        {/* ── Fenêtre modale ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-[560px] max-h-[88vh]
                     bg-[#16161e] border border-zinc-800/80 rounded-2xl
                     shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow décoratif */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px
                          bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {isLoading ? (
            <ModalSkeleton />
          ) : !card ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              {t?.taskModal?.notFound}
            </div>
          ) : (
            <>
              {/* ── HEADER ── */}
              <div className="px-5 pt-5 pb-3 space-y-3 flex-shrink-0">

                {/* Sélecteur de colonne + bouton fermer */}
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={currentColumnId}
                    onChange={(e) => handleMoveToColumn(e.target.value)}
                    className="text-xs text-zinc-400 bg-zinc-800/80 border border-zinc-700/60
                               rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500
                               transition-colors cursor-pointer hover:border-zinc-600
                               appearance-none pr-6"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371717a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                    }}
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}
                              className="bg-[#1e1e2a] text-zinc-300">
                        {col.title}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg flex items-center justify-center
                               text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800
                               transition-colors shrink-0"
                    aria-label={t?.taskModal?.closeBtn}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Titre éditable */}
                {isEditingTitle ? (
                  <textarea
                    ref={titleRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={commitTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        commitTitle();
                      }
                      if (e.key === "Escape") {
                        setTitle(card.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    rows={2}
                    className="w-full resize-none bg-transparent border-b border-violet-500
                               text-zinc-100 text-xl font-bold focus:outline-none
                               pb-1 leading-snug"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="group flex items-start gap-2 w-full text-left"
                  >
                    <h2 className="text-zinc-100 text-xl font-bold leading-snug
                                   group-hover:text-violet-200 transition-colors">
                      {card.title}
                    </h2>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                         className="shrink-0 mt-1.5 text-zinc-600 opacity-0
                                    group-hover:opacity-100 transition-opacity">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}

                {/* Boutons raccourcis */}
                <div className="flex flex-wrap gap-2">
                  <AddBlockMenu
                    activeBlocks={activeBlocks}
                    onAdd={handleAddBlock}
                  />
                  {!activeBlocks.labels && (
                      <QuickBtn
                        icon={<Tag size={16} className="text-zinc-400" />}
                        label={t?.taskModal?.blockLabels}
                        onClick={() => handleAddBlock("labels")}
                      />
                    )}
                  {!activeBlocks.dates && (
                      <QuickBtn
                        icon={<Clock size={16} className="text-zinc-400" />}
                        label={t?.taskModal?.blockDates}
                        onClick={() => handleAddBlock("dates")}
                      />
                    )}
                  {!activeBlocks.checklist && (
                      <QuickBtn
                        icon={<CheckSquare size={16} className="text-zinc-400" />}
                        label={t?.taskModal?.blockChecklist}
                        onClick={() => handleAddBlock("checklist")}
                      />
                    )}
                </div>
              </div>

              {/* Séparateur */}
              <div className="h-px bg-zinc-800/60 flex-shrink-0" />

              {/* ── CORPS — scrollable ── */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden
                              px-5 py-4 space-y-5
                              scrollbar-thin scrollbar-thumb-zinc-700
                              scrollbar-track-transparent">

                <DescriptionBlock card={card} />

                <AnimatePresence>
                  {activeBlocks.labels && (
                    <LabelsBlock
                      card={card}
                      boardId={card.board_id}
                      onRemove={() => handleRemoveBlock("labels")}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeBlocks.checklist && (
                    <ChecklistBlock
                      card={card}
                      onRemove={() => handleRemoveBlock("checklist")}
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeBlocks.dates && (
                    <DatesBlock
                      card={card}
                      onRemove={() => handleRemoveBlock("dates")}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* ── FOOTER ── */}
              <div className="flex-shrink-0 px-5 py-3 border-t border-zinc-800/60
                              flex items-center justify-end">
                <button
                  onClick={() => {
                    deleteCard(cardId);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs text-zinc-600
                             hover:text-red-400 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                          stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {t?.taskModal?.deleteCard}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Bouton raccourci ──────────────────────────────────────────
function QuickBtn({
  icon, label, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/40
                 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200
                 text-xs transition-all duration-150"
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ── Skeleton de chargement ────────────────────────────────────
function ModalSkeleton() {
  return (
    <div className="p-5 space-y-4 animate-pulse">
      <div className="h-4 w-24 bg-zinc-800 rounded-lg" />
      <div className="h-7 w-3/4 bg-zinc-800 rounded-lg" />
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
        <div className="h-7 w-16 bg-zinc-800 rounded-lg" />
      </div>
      <div className="h-px bg-zinc-800" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-zinc-800 rounded" />
        <div className="h-20 bg-zinc-800/60 rounded-xl" />
      </div>
    </div>
  );
}