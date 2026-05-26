// ============================================================
// lib/tache/mutations.ts
// Toutes les fonctions d'ÉCRITURE — typées, isolées, testables
// Chaque fonction : 1 responsabilité, 1 table, gestion d'erreur
// ============================================================

import { supabase } from "@/lib/supabase";
import type {
  Board,
  Card,
  CardLabel,
  Checklist,
  ChecklistItem,
  Column,
  CreateBoardPayload,
  CreateCardPayload,
  CreateChecklistItemPayload,
  CreateChecklistPayload,
  CreateColumnPayload,
  CreateLabelPayload,
  Label,
  UpdateCardPayload,
  UpdateColumnPayload,
} from "@/types/tache.types";

// ------------------------------------------------------------
// BOARD
// ------------------------------------------------------------

export async function createBoard(payload: CreateBoardPayload): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createBoard: ${error.message}`);
  return data;
}

export async function updateBoardTitle(
  boardId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .update({ title })
    .eq("id", boardId);

  if (error) throw new Error(`updateBoardTitle: ${error.message}`);
}

export async function deleteBoard(boardId: string): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId);

  if (error) throw new Error(`deleteBoard: ${error.message}`);
}

// ------------------------------------------------------------
// COLUMNS
// ------------------------------------------------------------

export async function createColumn(
  payload: CreateColumnPayload
): Promise<Column> {
  const { data, error } = await supabase
    .from("columns")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createColumn: ${error.message}`);
  return data;
}

export async function updateColumn(
  columnId: string,
  payload: UpdateColumnPayload
): Promise<void> {
  const { error } = await supabase
    .from("columns")
    .update(payload)
    .eq("id", columnId);

  if (error) throw new Error(`updateColumn: ${error.message}`);
}

export async function deleteColumn(columnId: string): Promise<void> {
  // Les cartes sont supprimées automatiquement (ON DELETE CASCADE)
  const { error } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnId);

  if (error) throw new Error(`deleteColumn: ${error.message}`);
}

/**
 * Met à jour les positions de plusieurs colonnes en une transaction.
 * Appelé après un drag & drop.
 */
export async function reorderColumns(
  updates: Array<{ id: string; position: number }>
): Promise<void> {
  const promises = updates.map(({ id, position }) =>
    supabase.from("columns").update({ position }).eq("id", id)
  );

  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`reorderColumns: ${failed.error.message}`);
}

// ------------------------------------------------------------
// CARDS
// ------------------------------------------------------------

export async function createCard(payload: CreateCardPayload): Promise<Card> {
  const { data, error } = await supabase
    .from("cards")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createCard: ${error.message}`);
  return data;
}

export async function updateCard(
  cardId: string,
  payload: UpdateCardPayload
): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update(payload)
    .eq("id", cardId);

  if (error) throw new Error(`updateCard: ${error.message}`);
}

export async function deleteCard(cardId: string): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", cardId);
  if (error) throw new Error(`deleteCard: ${error.message}`);
}

/**
 * Déplace une carte vers une autre colonne ET met à jour sa position.
 */
export async function moveCard(
  cardId: string,
  toColumnId: string,
  newPosition: number
): Promise<void> {
  const { error } = await supabase
    .from("cards")
    .update({ column_id: toColumnId, position: newPosition })
    .eq("id", cardId);

  if (error) throw new Error(`moveCard: ${error.message}`);
}

/**
 * Met à jour les positions de plusieurs cartes dans une colonne.
 */
export async function reorderCards(
  updates: Array<{ id: string; position: number; column_id: string }>
): Promise<void> {
  const promises = updates.map(({ id, position, column_id }) =>
    supabase.from("cards").update({ position, column_id }).eq("id", id)
  );

  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`reorderCards: ${failed.error.message}`);
}

// ------------------------------------------------------------
// CHECKLISTS
// ------------------------------------------------------------

export async function createChecklist(
  payload: CreateChecklistPayload
): Promise<Checklist> {
  const { data, error } = await supabase
    .from("checklists")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createChecklist: ${error.message}`);
  return data;
}

export async function updateChecklistTitle(
  checklistId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from("checklists")
    .update({ title })
    .eq("id", checklistId);

  if (error) throw new Error(`updateChecklistTitle: ${error.message}`);
}

export async function deleteChecklist(checklistId: string): Promise<void> {
  const { error } = await supabase
    .from("checklists")
    .delete()
    .eq("id", checklistId);

  if (error) throw new Error(`deleteChecklist: ${error.message}`);
}

// ------------------------------------------------------------
// CHECKLIST ITEMS
// ------------------------------------------------------------

export async function createChecklistItem(
  payload: CreateChecklistItemPayload
): Promise<ChecklistItem> {
  const { data, error } = await supabase
    .from("checklist_items")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createChecklistItem: ${error.message}`);
  return data;
}

export async function toggleChecklistItem(
  itemId: string,
  checked: boolean
): Promise<void> {
  const { error } = await supabase
    .from("checklist_items")
    .update({ checked })
    .eq("id", itemId);

  if (error) throw new Error(`toggleChecklistItem: ${error.message}`);
}

export async function updateChecklistItemText(
  itemId: string,
  text: string
): Promise<void> {
  const { error } = await supabase
    .from("checklist_items")
    .update({ text })
    .eq("id", itemId);

  if (error) throw new Error(`updateChecklistItemText: ${error.message}`);
}

export async function deleteChecklistItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(`deleteChecklistItem: ${error.message}`);
}

// ------------------------------------------------------------
// LABELS
// ------------------------------------------------------------

export async function createLabel(
  payload: CreateLabelPayload
): Promise<Label> {
  const { data, error } = await supabase
    .from("labels")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`createLabel: ${error.message}`);
  return data;
}

export async function updateLabel(
  labelId: string,
  updates: Partial<Pick<Label, "name" | "color" | "texture">>
): Promise<void> {
  const { error } = await supabase
    .from("labels")
    .update(updates)
    .eq("id", labelId);

  if (error) throw new Error(`updateLabel: ${error.message}`);
}

export async function deleteLabel(labelId: string): Promise<void> {
  const { error } = await supabase
    .from("labels")
    .delete()
    .eq("id", labelId);

  if (error) throw new Error(`deleteLabel: ${error.message}`);
}

// ------------------------------------------------------------
// CARD LABELS (associations)
// ------------------------------------------------------------

export async function addLabelToCard(
  cardId: string,
  labelId: string
): Promise<void> {
  const { error } = await supabase
    .from("card_labels")
    .insert({ card_id: cardId, label_id: labelId });

  // Ignore l'erreur "duplicate" (unique constraint) — idempotent
  if (error && !error.message.includes("duplicate")) {
    throw new Error(`addLabelToCard: ${error.message}`);
  }
}

export async function removeLabelFromCard(
  cardId: string,
  labelId: string
): Promise<void> {
  const { error } = await supabase
    .from("card_labels")
    .delete()
    .eq("card_id", cardId)
    .eq("label_id", labelId);

  if (error) throw new Error(`removeLabelFromCard: ${error.message}`);
}

export async function syncCardLabels(
  cardId: string,
  labelIds: string[]
): Promise<void> {
  // 1. Supprimer tous les labels actuels
  const { error: deleteError } = await supabase
    .from("card_labels")
    .delete()
    .eq("card_id", cardId);

  if (deleteError) throw new Error(`syncCardLabels (delete): ${deleteError.message}`);

  // 2. Réinsérer les nouveaux
  if (labelIds.length > 0) {
    const inserts: CardLabel[] = labelIds.map((labelId) => ({
      card_id: cardId,
      label_id: labelId,
    }));

    const { error: insertError } = await supabase
      .from("card_labels")
      .insert(inserts);

    if (insertError) throw new Error(`syncCardLabels (insert): ${insertError.message}`);
  }
}