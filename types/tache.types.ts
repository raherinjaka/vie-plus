// ============================================================
// types/tache.types.ts
// Source unique de vérité pour toute la page Tâche
// ============================================================

// ------------------------------------------------------------
// ENTITÉS BASE DE DONNÉES (miroir exact du schéma Supabase)
// ------------------------------------------------------------

export type Board = {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Column = {
    id: string;
    board_id: string;
    title: string;
    position: number;
    created_at: string;
  };
  
  export type Card = {
    id: string;
    column_id: string;
    board_id: string;
    title: string;
    description: string | null;
    position: number;
    due_date: string | null;
    created_at: string;
    updated_at: string;
  };
  
  export type Checklist = {
    id: string;
    card_id: string;
    title: string;
    position: number;
    created_at: string;
  };
  
  export type ChecklistItem = {
    id: string;
    checklist_id: string;
    text: string;
    checked: boolean;
    position: number;
    created_at: string;
  };
  
  export type Label = {
    id: string;
    board_id: string;
    name: string;
    color: string;
    texture: string | null; // mode daltonien
  };
  
  export type CardLabel = {
    card_id: string;
    label_id: string;
  };
  
  // ------------------------------------------------------------
  // ENTITÉS ENRICHIES (avec jointures — utilisées dans l'UI)
  // ------------------------------------------------------------
  
  export type ChecklistWithItems = Checklist & {
    items: ChecklistItem[];
  };
  
  export type CardWithRelations = Card & {
    checklists: ChecklistWithItems[];
    labels: Label[];
  };
  
  export type ColumnWithCards = Column & {
    cards: CardWithRelations[];
  };
  
  export type BoardWithColumns = Board & {
    columns: ColumnWithCards[];
  };
  
  // ------------------------------------------------------------
  // ÉTAT UI — Zustand store (jamais persisté dans Supabase)
  // ------------------------------------------------------------
  
  export type ModalState =
    | { isOpen: false; cardId: null }
    | { isOpen: true; cardId: string };
  
  export type DragState = {
    isDragging: boolean;
    activeId: string | null;
    activeType: "card" | "column" | null;
    overId: string | null;
  };
  
  // Clé = id de l'entité en cours de mutation
  export type LoadingMap = Record<string, boolean>;
  
  // Clé = id de l'entité, valeur = message d'erreur
  export type ErrorMap = Record<string, string>;
  
  export type UIState = {
    modal: ModalState;
    drag: DragState;
    loading: LoadingMap;
    errors: ErrorMap;
  };
  
  // ------------------------------------------------------------
  // OPTIMISTIC UPDATES — actions appliquées avant confirmation DB
  // ------------------------------------------------------------
  
  export type OptimisticAction =
    | {
        type: "MOVE_CARD";
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
        newPosition: number;
      }
    | {
        type: "REORDER_CARD";
        columnId: string;
        cardId: string;
        newPosition: number;
      }
    | {
        type: "MOVE_COLUMN";
        columnId: string;
        newPosition: number;
      }
    | {
        type: "REORDER_COLUMNS";
        updates: Array<{ id: string; position: number }>;
      }
    | {
        type: "UPDATE_CARD_TITLE";
        cardId: string;
        title: string;
      }
    | {
        type: "UPDATE_CARD_DESCRIPTION";
        cardId: string;
        description: string;
      }
    | {
        type: "UPDATE_COLUMN_TITLE";
        columnId: string;
        title: string;
      }
    | {
        type: "UPDATE_BOARD_TITLE";
        title: string;
      }
    | {
        type: "TOGGLE_CHECKLIST_ITEM";
        itemId: string;
        checked: boolean;
      }
    | {
        type: "UPDATE_CARD_DUE_DATE";
        cardId: string;
        dueDate: string | null
      }
    | {
        type: "MOVE_CARD_TO_COLUMN";
        cardId: string;
        columnId: string;
      };
  
  // ------------------------------------------------------------
  // PAYLOADS — paramètres pour les fonctions de mutation
  // ------------------------------------------------------------
  
  export type CreateBoardPayload = {
    title: string;
  };
  
  export type CreateColumnPayload = {
    board_id: string;
    title: string;
    position: number;
  };
  
  export type CreateCardPayload = {
    column_id: string;
    board_id: string;
    title: string;
    position: number;
  };
  
  export type UpdateCardPayload = Partial<
    Pick<Card, "title" | "description" | "due_date" | "column_id" | "position">
  >;
  
  export type UpdateColumnPayload = Partial<Pick<Column, "title" | "position">>;
  
  export type CreateChecklistPayload = {
    card_id: string;
    title: string;
    position: number;
  };
  
  export type CreateChecklistItemPayload = {
    checklist_id: string;
    text: string;
    position: number;
  };
  
  export type CreateLabelPayload = {
    board_id: string;
    name: string;
    color: string;
    texture?: string;
  };
  
  // ------------------------------------------------------------
  // CONSTANTES DE COULEURS (labels)
  // ------------------------------------------------------------
  
  export const LABEL_COLORS = [
    { hex: "#22c55e", name: "Vert" },
    { hex: "#eab308", name: "Jaune" },
    { hex: "#f97316", name: "Orange" },
    { hex: "#ef4444", name: "Rouge" },
    { hex: "#a855f7", name: "Purple" },
    { hex: "#3b82f6", name: "Bleu" },
  ] as const;
  
  export type LabelColor = (typeof LABEL_COLORS)[number]["hex"];
  
  // Textures pour le mode daltonien
  export const LABEL_TEXTURES = [
    { id: "dots", label: "Pointillés" },
    { id: "stripes", label: "Rayures" },
    { id: "cross", label: "Quadrillage" },
    { id: "zigzag", label: "Zigzag" },
    { id: "solid", label: "Uni" },
    { id: "dashes", label: "Tirets" },
  ] as const;
  
  export type LabelTexture = (typeof LABEL_TEXTURES)[number]["id"];
  
  // ------------------------------------------------------------
  // HELPERS DE TYPE (type guards)
  // ------------------------------------------------------------
  
  export function isCard(item: Card | Column): item is Card {
    return "column_id" in item;
  }
  
  export function isColumn(item: Card | Column): item is Column {
    return "board_id" in item && !("column_id" in item);
  }
  
  // Calcul de progression d'une checklist
  export function calcChecklistProgress(items: ChecklistItem[]): number {
    if (items.length === 0) return 0;
    const checked = items.filter((i) => i.checked).length;
    return Math.round((checked / items.length) * 100);
  }
  
  // Calcul de progression globale d'une carte (toutes checklists)
  export function calcCardProgress(checklists: ChecklistWithItems[]): number {
    const allItems = checklists.flatMap((c) => c.items);
    return calcChecklistProgress(allItems);
  }
  
  // Calcul de progression globale du board
  export function calcBoardProgress(columns: ColumnWithCards[]): number {
    const allChecklists = columns
      .flatMap((col) => col.cards)
      .flatMap((card) => card.checklists);
    const allItems = allChecklists.flatMap((c) => c.items);
    return calcChecklistProgress(allItems);
  }