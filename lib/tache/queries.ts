// ============================================================
// lib/tache/queries.ts
// Toutes les fonctions de LECTURE — typées, isolées, testables
// ============================================================

import { supabase } from "@/lib/supabase";
import type {
  Board,
  BoardWithColumns,
  Card,
  CardWithRelations,
  Column,
  ColumnWithCards,
  Label,
} from "@/types/tache.types";

// ------------------------------------------------------------
// BOARD
// ------------------------------------------------------------

/**
 * Récupère le board de l'utilisateur connecté.
 * Un utilisateur = un board (architecture actuelle).
 * Retourne null si aucun board n'existe encore.
 */
export async function fetchUserBoard(): Promise<Board | null> {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`fetchUserBoard: ${error.message}`);
  return data;
}

/**
 * Charge le board complet avec toutes ses relations imbriquées.
 * C'est le fetch principal — appelé une seule fois au chargement.
 */
export async function fetchFullBoard(
  boardId: string
): Promise<BoardWithColumns> {
  // 1. Board + colonnes ordonnées
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .single();

  if (boardError) throw new Error(`fetchFullBoard (board): ${boardError.message}`);

  // 2. Colonnes
  const { data: columns, error: colError } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  if (colError) throw new Error(`fetchFullBoard (columns): ${colError.message}`);

  if (!columns || columns.length === 0) {
    return { ...board, columns: [] };
  }

  const columnIds = columns.map((c: Column) => c.id);

  // 3. Cartes de toutes les colonnes
  const { data: cards, error: cardError } = await supabase
    .from("cards")
    .select("*")
    .in("column_id", columnIds)
    .order("position", { ascending: true });

  if (cardError) throw new Error(`fetchFullBoard (cards): ${cardError.message}`);

  if (!cards || cards.length === 0) {
    const columnsWithCards: ColumnWithCards[] = columns.map((col: Column) => ({
      ...col,
      cards: [],
    }));
    return { ...board, columns: columnsWithCards };
  }

  const cardIds = cards.map((c: Card) => c.id);

  // 4. Checklists
  const { data: checklists, error: clError } = await supabase
    .from("checklists")
    .select("*")
    .in("card_id", cardIds)
    .order("position", { ascending: true });

  if (clError) throw new Error(`fetchFullBoard (checklists): ${clError.message}`);

  // 5. Items de checklist
  const checklistIds = (checklists || []).map((cl: { id: string }) => cl.id);
  let checklistItems: any[] = [];

  if (checklistIds.length > 0) {
    const { data: items, error: itemError } = await supabase
      .from("checklist_items")
      .select("*")
      .in("checklist_id", checklistIds)
      .order("position", { ascending: true });

    if (itemError) throw new Error(`fetchFullBoard (items): ${itemError.message}`);
    checklistItems = items || [];
  }

  // 6. Labels du board
  const { data: labels, error: labelError } = await supabase
    .from("labels")
    .select("*")
    .eq("board_id", boardId);

  if (labelError) throw new Error(`fetchFullBoard (labels): ${labelError.message}`);

  // 7. Card-labels associations
  const { data: cardLabels, error: clabelError } = await supabase
    .from("card_labels")
    .select("*")
    .in("card_id", cardIds);

  if (clabelError) throw new Error(`fetchFullBoard (card_labels): ${clabelError.message}`);

  // ------------------------------------------------------------
  // ASSEMBLAGE — construire la structure imbriquée
  // ------------------------------------------------------------
  const labelsMap = new Map<string, Label>(
    (labels || []).map((l: Label) => [l.id, l])
  );

  // Map checklist_id → items
  const itemsByChecklist = new Map<string, any[]>();
  for (const item of checklistItems) {
    const list = itemsByChecklist.get(item.checklist_id) || [];
    list.push(item);
    itemsByChecklist.set(item.checklist_id, list);
  }

  // Map card_id → checklists (avec items)
  const checklistsByCard = new Map<string, any[]>();
  for (const cl of checklists || []) {
    const list = checklistsByCard.get(cl.card_id) || [];
    list.push({ ...cl, items: itemsByChecklist.get(cl.id) || [] });
    checklistsByCard.set(cl.card_id, list);
  }

  // Map card_id → labels
  const labelsByCard = new Map<string, Label[]>();
  for (const cl of cardLabels || []) {
    const list = labelsByCard.get(cl.card_id) || [];
    const label = labelsMap.get(cl.label_id);
    if (label) list.push(label);
    labelsByCard.set(cl.card_id, list);
  }

  // Map column_id → cards (avec relations)
  const cardsByColumn = new Map<string, CardWithRelations[]>();
  for (const card of cards) {
    const list = cardsByColumn.get(card.column_id) || [];
    list.push({
      ...card,
      checklists: checklistsByCard.get(card.id) || [],
      labels: labelsByCard.get(card.id) || [],
    });
    cardsByColumn.set(card.column_id, list);
  }

  // Colonnes finales
  const columnsWithCards: ColumnWithCards[] = columns.map((col: Column) => ({
    ...col,
    cards: cardsByColumn.get(col.id) || [],
  }));

  return { ...board, columns: columnsWithCards };
}

/**
 * Charge une seule carte avec toutes ses relations.
 * Utilisé à l'ouverture du modal.
 */
export async function fetchCardWithRelations(
  cardId: string
): Promise<CardWithRelations> {
  const { data: card, error: cardError } = await supabase
    .from("cards")
    .select("*")
    .eq("id", cardId)
    .single();

  if (cardError) throw new Error(`fetchCardWithRelations: ${cardError.message}`);

  const { data: checklists, error: clError } = await supabase
    .from("checklists")
    .select("*")
    .eq("card_id", cardId)
    .order("position", { ascending: true });

  if (clError) throw new Error(`fetchCardWithRelations (cl): ${clError.message}`);

  const checklistIds = (checklists || []).map((c: { id: string }) => c.id);
  let items: any[] = [];

  if (checklistIds.length > 0) {
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .in("checklist_id", checklistIds)
      .order("position", { ascending: true });

    if (error) throw new Error(`fetchCardWithRelations (items): ${error.message}`);
    items = data || [];
  }

  const { data: cardLabels, error: clabelError } = await supabase
    .from("card_labels")
    .select("label_id")
    .eq("card_id", cardId);

  if (clabelError) throw new Error(`fetchCardWithRelations (labels): ${clabelError.message}`);

  let labels: Label[] = [];
  if (cardLabels && cardLabels.length > 0) {
    const labelIds = cardLabels.map((cl: { label_id: string }) => cl.label_id);
    const { data: labelData, error: lError } = await supabase
      .from("labels")
      .select("*")
      .in("id", labelIds);

    if (lError) throw new Error(`fetchCardWithRelations (label data): ${lError.message}`);
    labels = labelData || [];
  }

  const itemsByChecklist = new Map<string, any[]>();
  for (const item of items) {
    const list = itemsByChecklist.get(item.checklist_id) || [];
    list.push(item);
    itemsByChecklist.set(item.checklist_id, list);
  }

  return {
    ...card,
    checklists: (checklists || []).map((cl: any) => ({
      ...cl,
      items: itemsByChecklist.get(cl.id) || [],
    })),
    labels,
  };
}

/**
 * Récupère tous les labels d'un board.
 */
export async function fetchBoardLabels(boardId: string): Promise<Label[]> {
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .eq("board_id", boardId);

  if (error) throw new Error(`fetchBoardLabels: ${error.message}`);
  return data || [];
}