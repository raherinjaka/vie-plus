"use client";

// ============================================================
// components/tache/column/Column.tsx
// Une colonne draggable avec ses cartes
// ============================================================

import { useState, useRef } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { useBoard } from "@/hooks/useBoard";
import { useLanguage } from "@/context/LanguageContext";
import Card from "../card/card";
import AddCardInput from "../card/AddCardInput";
import ColumnMenu from "./ColumnMenu";
import type { ColumnWithCards } from "@/types/tache.types";

type Props = {
  column: ColumnWithCards;
};

export default function Column({ column }: Props) {
  const { t } = useLanguage() as any;
  const { renameColumn, deleteColumn } = useBoard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const startEditTitle = () => {
    setIsEditingTitle(true);
    setTitleValue(column.title);
    setTimeout(() => titleInputRef.current?.select(), 0);
  };

  const commitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== column.title) {
      renameColumn(column.id, trimmed);
    } else {
      setTitleValue(column.title);
    }
  };

  const cardIds = column.cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-[272px] flex flex-col"
    >
      <div className="flex flex-col h-fit bg-[#13131a] border border-zinc-800/80
           rounded-2xl overflow-hidden shadow-xl shadow-black/30">

        {/* ── Header colonne ── */}
        <div
          className="flex items-center justify-between px-3 py-3
          cursor-grab active:cursor-grabbing
          border-b border-zinc-800/60"
          {...attributes}
          {...listeners}
        >
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") {
                  setTitleValue(column.title);
                  setIsEditingTitle(false);
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              autoFocus
              className="flex-1 bg-transparent text-zinc-100 text-sm font-semibold
                         border-b border-violet-500 focus:outline-none pb-0.5 mr-2"
            />
          ) : (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={startEditTitle}
              className="flex-1 text-left text-zinc-100 text-sm font-semibold 
                         hover:text-violet-300 transition-colors truncate"
            >
              {column.title}
            </button>
          )}

          {/* Compteur + menu */}
          <div
            className="flex items-center gap-1.5 ml-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {column.cards.length > 0 && (
              <span className="text-[11px] text-zinc-500 font-bold bg-zinc-800/80
                  px-1.5 py-0.5 rounded-md">
                {column.cards.length}
              </span>
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-6 h-6 rounded-md flex items-center justify-center
                           text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/50
                           transition-colors text-lg leading-none pb-0.5"
              >
                ···
              </button>

              <AnimatePresence>
                {showMenu && (
                  <ColumnMenu
                    columnId={column.id}
                    onRename={() => {
                      setShowMenu(false);
                      startEditTitle();
                    }}
                    onDelete={() => {
                      setShowMenu(false);
                      deleteColumn(column.id);
                    }}
                    onClose={() => setShowMenu(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Liste des cartes ── */}
        <div className="overflow-visible overflow-x-hidden px-2 pb-2
                        scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
                        min-h-[8px]">
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {column.cards.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </div>
          </SortableContext>

          <AnimatePresence>
            {showAddCard && (
              <AddCardInput
                columnId={column.id}
                onClose={() => setShowAddCard(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer — Ajouter une carte ── */}
        {!showAddCard && (
          <div className="px-2 py-2 border-t border-zinc-800/40">
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl
                text-zinc-600 hover:text-violet-300 hover:bg-violet-500/10
                text-sm transition-all duration-150 group border border-dashed
                border-transparent hover:border-violet-500/20"
            >
              <span className="text-base leading-none text-zinc-600 
                               group-hover:text-violet-400 transition-colors">
                +
              </span>
              {t?.column?.addCard}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}