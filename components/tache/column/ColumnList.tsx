"use client";

// ============================================================
// components/tache/column/ColumnList.tsx
// ============================================================

import { useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useBoard } from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import Card from "../card/card";
import type { ColumnWithCards, CardWithRelations } from "@/types/tache.types";

type Props = {
  columns: ColumnWithCards[]; // prop initiale (fallback SSR)
  boardId: string;
};

// ─────────────────────────────────────────────────────────────
// CORRECTION #1 — calcul de position "midpoint"
// Ancien code : overCardIndex * 1000  → collision garantie
// Nouveau code : (prev.position + curr.position) / 2
// ─────────────────────────────────────────────────────────────
function calcInsertPosition(
  cards: CardWithRelations[],
  overId: string,
  activeId: string
): number {
  // On retire la carte active pour avoir l'ordre réel des voisins
  const rest = cards.filter((c) => c.id !== activeId);

  if (rest.length === 0) return 1000;

  const overIdx = rest.findIndex((c) => c.id === overId);

  // Drop sur colonne vide ou directement sur la colonne (pas sur une carte)
  if (overIdx === -1) {
    return (rest[rest.length - 1]?.position ?? 0) + 1000;
  }

  const prev = rest[overIdx - 1];
  const curr = rest[overIdx];

  // Insérer avant la première carte
  if (!prev) return curr.position / 2;

  // Insérer entre deux cartes (midpoint)
  return (prev.position + curr.position) / 2;
}

// ─────────────────────────────────────────────────────────────

export default function ColumnList({ columns: columnsProp, boardId }: Props) {
  const { reorderColumns, moveCard } = useBoard();

  // CORRECTION #2 — lire `board` depuis Zustand (pas depuis la prop)
  // La prop `columnsProp` vient de React Query (données serveur, figées
  // jusqu'au prochain fetch). Le store Zustand lui est mis à jour
  // IMMÉDIATEMENT par applyOptimistic → c'est lui qu'on rend.
  const { setDragActive, setDragOver, resetDrag, drag, board } = useBoardStore();

  // ⬇ CHANGEMENT CLÉ : on rend toujours depuis Zustand
  const columns = board?.columns ?? columnsProp;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );
  
  const getItemType = useCallback(
    (id: string): "card" | "column" | null => {
      if (!board) return null;
      if (board.columns.some((col) => col.id === id)) return "column";
      if (board.columns.flatMap((col) => col.cards).some((c) => c.id === id))
        return "card";
      return null;
    },
    [board]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const type = getItemType(String(event.active.id));
    if (type) setDragActive(String(event.active.id), type);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setDragOver(event.over ? String(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    resetDrag();
    if (!over || active.id === over.id || !board) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeType = getItemType(activeId);

    // ── Réordonner les colonnes ──
    if (activeType === "column") {
      const oldIndex = board.columns.findIndex((c) => c.id === activeId);
      const newIndex = board.columns.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(board.columns, oldIndex, newIndex);
      const updates = reordered.map((col, idx) => ({
        id: col.id,
        position: idx * 1000,
      }));
      reorderColumns(updates);
      return;
    }

    // ── Déplacer une carte ──
    if (activeType === "card") {
      const sourceCol = board.columns.find((col) =>
        col.cards.some((c) => c.id === activeId)
      );
      // La cible peut être une colonne (drop sur zone vide)
      // ou une carte (on calcule l'insertion entre ses voisins)
      const targetCol =
        board.columns.find((col) => col.id === overId) ??
        board.columns.find((col) => col.cards.some((c) => c.id === overId));

      if (!sourceCol || !targetCol) return;

      // CORRECTION #1 en action
      const newPosition = calcInsertPosition(
        targetCol.cards,
        overId,
        activeId
      );

      moveCard(activeId, sourceCol.id, targetCol.id, newPosition);
    }
  };

  const activeCard =
    drag.activeType === "card" && drag.activeId
      ? board?.columns
          .flatMap((col) => col.cards)
          .find((c) => c.id === drag.activeId)
      : null;

  const columnIds = columns.map((c) => c.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-4 h-full px-6 pb-6 pt-2
                   overflow-x-auto overflow-y-hidden
                   scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          {/* CORRECTION #2 : `columns` vient maintenant du store Zustand */}
          {columns.map((col) => (
            <Column key={col.id} column={col} />
          ))}
        </SortableContext>

        <AddColumnButton boardId={boardId} columnsCount={columns.length} />
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeCard && (
          <div className="rotate-2 opacity-90 scale-105">
            <Card card={activeCard} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}