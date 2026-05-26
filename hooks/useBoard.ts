// ============================================================
// hooks/useBoard.ts
// ============================================================

"use client";

import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFullBoard, fetchUserBoard } from "@/lib/tache/queries";
import {
  createBoard,
  updateBoardTitle,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards,
} from "@/lib/tache/mutations";
import { useBoardStore } from "@/store/boardStore";
import type {
  BoardWithColumns,
  CreateCardPayload,
  CreateColumnPayload,
} from "@/types/tache.types";

export const QUERY_KEYS = {
  board: (boardId: string) => ["board", boardId] as const,
  userBoard: () => ["userBoard"] as const,
};

export function useBoard() {
  const queryClient = useQueryClient();
  const { setBoard, applyOptimistic, setLoading, setError, clearError } =
    useBoardStore();

  // 1. Trouver le board de l'utilisateur
  const {
    data: userBoard,
    isLoading: isFindingBoard,
    error: findBoardError,
  } = useQuery({
    queryKey: QUERY_KEYS.userBoard(),
    queryFn: fetchUserBoard,
    staleTime: Infinity,
    retry: 2,
  });

  const boardId = userBoard?.id ?? null;

  // 2. Charger le board complet
  const {
    data: boardData,
    isLoading: isLoadingBoard,
    error: boardError,
    refetch: refetchBoard,
  } = useQuery({
    queryKey: QUERY_KEYS.board(boardId ?? ""),
    queryFn: () => fetchFullBoard(boardId!),
    enabled: !!boardId,
    staleTime: 30_000,
    retry: 2,
  });

  // Sync React Query → Zustand
  // Important : on met à jour le store SEULEMENT quand boardData change
  // (pas à chaque render). Le store reste la source de vérité pour le rendu.
  useEffect(() => {
    if (boardData) setBoard(boardData);
  }, [boardData, setBoard]);

  // 3. Créer un board
  const createBoardMutation = useMutation({
    mutationFn: (title: string) => createBoard({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userBoard() });
    },
    onError: (err: Error) => setError("createBoard", err.message),
  });

  // 4. Renommer le board
  const renameBoardMutation = useMutation({
    mutationFn: (title: string) => updateBoardTitle(boardId!, title),
    onMutate: (title) => {
      applyOptimistic({ type: "UPDATE_BOARD_TITLE", title });
    },
    onError: (err: Error) => {
      setError("renameBoard", err.message);
      refetchBoard();
    },
    onSuccess: () => clearError("renameBoard"),
  });

  // 5. Colonnes — Créer
  const createColumnMutation = useMutation({
    mutationFn: (payload: CreateColumnPayload) => createColumn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.board(boardId!) });
    },
    onError: (err: Error) => setError("createColumn", err.message),
  });

  // 6. Colonnes — Renommer
  const renameColumnMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateColumn(id, { title }),
    onMutate: ({ id, title }) => {
      applyOptimistic({ type: "UPDATE_COLUMN_TITLE", columnId: id, title });
    },
    onError: (err: Error) => {
      setError("renameColumn", err.message);
      refetchBoard();
    },
    onSuccess: () => clearError("renameColumn"),
  });

  // 7. Colonnes — Supprimer
  const deleteColumnMutation = useMutation({
    mutationFn: (columnId: string) => deleteColumn(columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.board(boardId!) });
    },
    onError: (err: Error) => setError("deleteColumn", err.message),
  });

  // 8. Colonnes — Réordonner (drag & drop)
  // CORRECTION #3 — onMutate manquant : les colonnes revenaient à leur
  // position initiale jusqu'au prochain refetch, exactement comme les cartes.
  const reorderColumnsMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; position: number }>) =>
      reorderColumns(updates),
    onMutate: (updates) => {
      // Mise à jour optimiste immédiate dans Zustand
      applyOptimistic({ type: "REORDER_COLUMNS", updates });
    },
    onError: (err: Error) => {
      setError("reorderColumns", err.message);
      refetchBoard(); // Rollback : recharge l'ordre serveur
    },
    onSuccess: () => clearError("reorderColumns"),
  });

  // 9. Cartes — Créer
  const createCardMutation = useMutation({
    mutationFn: (payload: CreateCardPayload) => createCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.board(boardId!) });
    },
    onError: (err: Error) => setError("createCard", err.message),
  });

  // 10. Cartes — Renommer
  const renameCardMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateCard(id, { title }),
    onMutate: ({ id, title }) => {
      applyOptimistic({ type: "UPDATE_CARD_TITLE", cardId: id, title });
    },
    onError: (err: Error) => {
      setError("renameCard", err.message);
      refetchBoard();
    },
  });

  // 11. Cartes — Supprimer
  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.board(boardId!) });
    },
    onError: (err: Error) => setError("deleteCard", err.message),
  });

  // 12. Cartes — Déplacer (drag & drop ou modal)
  const moveCardMutation = useMutation({
    mutationFn: ({
      cardId,
      toColumnId,
      position,
    }: {
      cardId: string;
      toColumnId: string;
      fromColumnId: string;
      position: number;
    }) => moveCard(cardId, toColumnId, position),
    onMutate: ({ cardId, toColumnId, fromColumnId, position }) => {
      // Mise à jour optimiste immédiate dans Zustand
      applyOptimistic({
        type: "MOVE_CARD",
        cardId,
        fromColumnId,
        toColumnId,
        newPosition: position,
      });
    },
    onError: (err: Error) => {
      setError("moveCard", err.message);
      refetchBoard(); // Rollback
    },
    onSuccess: () => clearError("moveCard"),
  });

  // ──────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────

  const getNextColumnPosition = useCallback(() => {
    const board = useBoardStore.getState().board;
    if (!board || board.columns.length === 0) return 0;
    return Math.max(...board.columns.map((c) => c.position)) + 1000;
  }, []);

  const getNextCardPosition = useCallback((columnId: string) => {
    const board = useBoardStore.getState().board;
    if (!board) return 0;
    const col = board.columns.find((c) => c.id === columnId);
    if (!col || col.cards.length === 0) return 0;
    return Math.max(...col.cards.map((c) => c.position)) + 1000;
  }, []);

  return {
    // État
    board: boardData ?? null,
    boardId,
    isLoading: isFindingBoard || isLoadingBoard,
    error: findBoardError || boardError,
    hasBoard: !!boardId,

    // Actions Board
    createBoard: (title: string) => createBoardMutation.mutate(title),
    renameBoard: (title: string) => renameBoardMutation.mutate(title),
    isCreatingBoard: createBoardMutation.isPending,

    // Actions Colonnes
    createColumn: (title: string) => {
      if (!boardId) return;
      createColumnMutation.mutate({
        board_id: boardId,
        title,
        position: getNextColumnPosition(),
      });
    },
    renameColumn: (id: string, title: string) =>
      renameColumnMutation.mutate({ id, title }),
    deleteColumn: (id: string) => deleteColumnMutation.mutate(id),
    reorderColumns: (updates: Array<{ id: string; position: number }>) =>
      reorderColumnsMutation.mutate(updates),

    // Actions Cartes
    createCard: (columnId: string, title: string) => {
      if (!boardId) return;
      createCardMutation.mutate({
        column_id: columnId,
        board_id: boardId,
        title,
        position: getNextCardPosition(columnId),
      });
    },
    renameCard: (id: string, title: string) =>
      renameCardMutation.mutate({ id, title }),
    deleteCard: (id: string) => deleteCardMutation.mutate(id),
    moveCard: (
      cardId: string,
      fromColumnId: string,
      toColumnId: string,
      position: number
    ) =>
      moveCardMutation.mutate({ cardId, toColumnId, fromColumnId, position }),

    refetchBoard,
  };
}