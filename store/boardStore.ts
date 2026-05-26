// ============================================================
// store/boardStore.ts
// ============================================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  BoardWithColumns,
  CardWithRelations,
  ColumnWithCards,
  DragState,
  ErrorMap,
  LoadingMap,
  ModalState,
  OptimisticAction,
} from "@/types/tache.types";

type BoardStore = {
  board: BoardWithColumns | null;
  setBoard: (board: BoardWithColumns | null) => void;

  modal: ModalState;
  openModal: (cardId: string) => void;
  closeModal: () => void;

  drag: DragState;
  setDragActive: (id: string, type: "card" | "column") => void;
  setDragOver: (overId: string | null) => void;
  resetDrag: () => void;

  loading: LoadingMap;
  setLoading: (key: string, value: boolean) => void;

  errors: ErrorMap;
  setError: (key: string, message: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;

  applyOptimistic: (action: OptimisticAction) => void;
};

const initialDrag: DragState = {
  isDragging: false,
  activeId: null,
  activeType: null,
  overId: null,
};

const initialModal: ModalState = {
  isOpen: false,
  cardId: null,
};

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set, get) => ({
      board: null,

      setBoard: (board) => set({ board }, false, "setBoard"),

      modal: initialModal,
      openModal: (cardId) =>
        set({ modal: { isOpen: true, cardId } }, false, "openModal"),
      closeModal: () =>
        set({ modal: initialModal }, false, "closeModal"),

      drag: initialDrag,
      setDragActive: (id, type) =>
        set(
          { drag: { isDragging: true, activeId: id, activeType: type, overId: null } },
          false,
          "setDragActive"
        ),
      setDragOver: (overId) =>
        set((s) => ({ drag: { ...s.drag, overId } }), false, "setDragOver"),
      resetDrag: () => set({ drag: initialDrag }, false, "resetDrag"),

      loading: {},
      setLoading: (key, value) =>
        set((s) => ({ loading: { ...s.loading, [key]: value } }), false, "setLoading"),

      errors: {},
      setError: (key, message) =>
        set((s) => ({ errors: { ...s.errors, [key]: message } }), false, "setError"),
      clearError: (key) =>
        set((s) => {
          const next = { ...s.errors };
          delete next[key];
          return { errors: next };
        }, false, "clearError"),
      clearAllErrors: () => set({ errors: {} }, false, "clearAllErrors"),

      // ──────────────────────────────────────────────────────
      // OPTIMISTIC UPDATES
      // ──────────────────────────────────────────────────────
      applyOptimistic: (action) => {
        const { board } = get();
        if (!board) return;

        switch (action.type) {

          // ── Déplacer une carte ──
          case "MOVE_CARD": {
            const columns = board.columns.map((col) => {
              if (col.id === action.fromColumnId) {
                return {
                  ...col,
                  cards: col.cards.filter((c) => c.id !== action.cardId),
                };
              }
              if (col.id === action.toColumnId) {
                const movedCard = board.columns
                  .flatMap((c) => c.cards)
                  .find((c) => c.id === action.cardId);
                if (!movedCard) return col;

                const updatedCard = {
                  ...movedCard,
                  column_id: action.toColumnId,
                  position: action.newPosition,
                };
                const newCards = [...col.cards, updatedCard].sort(
                  (a, b) => a.position - b.position
                );
                return { ...col, cards: newCards };
              }
              return col;
            });
            set({ board: { ...board, columns } }, false, "optimistic/MOVE_CARD");
            break;
          }

          // ── Réordonner les colonnes ──
          // CORRECTION #3 — ce cas était ABSENT : les colonnes ne se
          // mettaient pas à jour visuellement avant le prochain refetch.
          case "REORDER_COLUMNS": {
            const updatesMap = new Map(
              action.updates.map((u) => [u.id, u.position])
            );
            const columns = board.columns
              .map((col) => ({
                ...col,
                position: updatesMap.get(col.id) ?? col.position,
              }))
              .sort((a, b) => a.position - b.position);

            set(
              { board: { ...board, columns } },
              false,
              "optimistic/REORDER_COLUMNS"
            );
            break;
          }

          // ── Changer le titre d'une carte ──
          case "UPDATE_CARD_TITLE": {
            const columns = board.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === action.cardId
                  ? { ...card, title: action.title }
                  : card
              ),
            }));
            set({ board: { ...board, columns } }, false, "optimistic/UPDATE_CARD_TITLE");
            break;
          }

          // ── Changer la description d'une carte ──
          case "UPDATE_CARD_DESCRIPTION": {
            const columns = board.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === action.cardId
                  ? { ...card, description: action.description }
                  : card
              ),
            }));
            set({ board: { ...board, columns } }, false, "optimistic/UPDATE_CARD_DESCRIPTION");
            break;
          }

          // ── Changer le titre d'une colonne ──
          case "UPDATE_COLUMN_TITLE": {
            const columns = board.columns.map((col) =>
              col.id === action.columnId
                ? { ...col, title: action.title }
                : col
            );
            set({ board: { ...board, columns } }, false, "optimistic/UPDATE_COLUMN_TITLE");
            break;
          }

          case "UPDATE_CARD_DUE_DATE": {
            const columns = board.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) =>
                card.id === action.cardId
                  ? { ...card, due_date: action.dueDate }
                  : card
              ),
            }));
            set({ board: { ...board, columns } }, false, "optimistic/UPDATE_CARD_DUE_DATE");
            break;
          }

          // ── Changer le titre du board ──
          case "UPDATE_BOARD_TITLE": {
            set({ board: { ...board, title: action.title } }, false, "optimistic/UPDATE_BOARD_TITLE");
            break;
          }

          // ── Cocher/décocher un item de checklist ──
          case "TOGGLE_CHECKLIST_ITEM": {
            const columns = board.columns.map((col) => ({
              ...col,
              cards: col.cards.map((card) => ({
                ...card,
                checklists: card.checklists.map((cl) => ({
                  ...cl,
                  items: cl.items.map((item) =>
                    item.id === action.itemId
                      ? { ...item, checked: action.checked }
                      : item
                  ),
                })),
              })),
            }));
            set({ board: { ...board, columns } }, false, "optimistic/TOGGLE_CHECKLIST_ITEM");
            break;
          }

          // ── Déplacer une carte via modal selector ──
          case "MOVE_CARD_TO_COLUMN": {
            const movedCard = board.columns
              .flatMap((c) => c.cards)
              .find((c) => c.id === action.cardId);
            if (!movedCard) break;

            const columns = board.columns.map((col) => {
              if (col.cards.some((c) => c.id === action.cardId)) {
                return {
                  ...col,
                  cards: col.cards.filter((c) => c.id !== action.cardId),
                };
              }
              if (col.id === action.columnId) {
                return {
                  ...col,
                  cards: [
                    ...col.cards,
                    { ...movedCard, column_id: action.columnId },
                  ],
                };
              }
              return col;
            });
            set({ board: { ...board, columns } }, false, "optimistic/MOVE_CARD_TO_COLUMN");
            break;
          }
        }
      },
    }),
    { name: "BoardStore" }
  )
);

// ──────────────────────────────────────────────────────────────
// SÉLECTEURS
// ──────────────────────────────────────────────────────────────

export function selectActiveCard(store: BoardStore): CardWithRelations | null {
  if (!store.modal.isOpen || !store.board) return null;
  return (
    store.board.columns
      .flatMap((col) => col.cards)
      .find((card) => card.id === store.modal.cardId) ?? null
  );
}

export function selectColumn(
  store: BoardStore,
  columnId: string
): ColumnWithCards | null {
  return store.board?.columns.find((col) => col.id === columnId) ?? null;
}

export function selectIsLoading(store: BoardStore, key: string): boolean {
  return store.loading[key] ?? false;
}

export function selectError(store: BoardStore, key: string): string | undefined {
  return store.errors[key];
}