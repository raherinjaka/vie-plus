import { Brain, HeartPulse, LucideIcon, Wallet, Zap } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Category = "Projet" | "Sante" | "Argent" | "Etudes";

export interface Objectif {
  id: string;
  user_id: string;
  titre: string;
  categorie: string;
  progression: number;
  deadline: string | null;
  created_at: string;
}

// ─── Normalisation ────────────────────────────────────────────────────────────
export function normKey(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function toCanonicalCategory(raw: string): Category {
  const map: Record<string, Category> = {
    projet: "Projet",
    sante:  "Sante",
    argent: "Argent",
    etudes: "Etudes",
  };
  return map[normKey(raw)] ?? "Projet";
}

// ─── Category metadata ───────────────────────────────────────────────────────
export const CATEGORY_META: Record<Category, { color: string; bg: string; dot: string; icon: LucideIcon; label: string }> = {
  Projet: {
    color: "text-violet-300",
    bg:    "bg-violet-500/10 border-violet-500/30",
    dot:   "bg-violet-400",
    icon:  Zap,
    label: "Projet",
  },
  Sante: {
    color: "text-emerald-300",
    bg:    "bg-emerald-500/10 border-emerald-500/30",
    dot:   "bg-emerald-400",
    icon:  HeartPulse,
    label: "Santé",
  },
  Argent: {
    color: "text-amber-300",
    bg:    "bg-amber-500/10 border-amber-500/30",
    dot:   "bg-amber-400",
    icon:  Wallet,
    label: "Argent",
  },
  Etudes: {
    color: "text-sky-300",
    bg:    "bg-sky-500/10 border-sky-500/30",
    dot:   "bg-sky-400",
    icon:  Brain,
    label: "Études",
  },
};

export const CATEGORY_LIST: Category[] = ["Projet", "Sante", "Argent", "Etudes"];

export function getCatMeta(raw: string) {
  return CATEGORY_META[toCanonicalCategory(raw)];
}

// ─── Deadline helper ──────────────────────────────────────────────────────────
export function daysLeft(
  deadline: string | null,
  t: any
): { text: string; color: string } | null {
  if (!deadline) return null;
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const fill = (template: string | undefined, n: number) =>
    (template ?? "").replace(/\{n\}/g, String(n)).replace(/\{s\}/g, n > 1 ? "s" : "");

  if (diff < 0)   return { text: t?.objectifsPage?.deadline?.overdue, color: "text-red-400" };
  if (diff === 0) return { text: t?.objectifsPage?.deadline?.today,   color: "text-orange-400" };
  return { text: fill(t?.objectifsPage?.deadline?.daysLeft, diff), color: diff <= 3 ? "text-red-400" : diff <= 7 ? "text-yellow-400" : "text-emerald-400" };
}