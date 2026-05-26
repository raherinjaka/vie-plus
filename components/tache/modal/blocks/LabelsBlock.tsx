"use client";

// ============================================================
// components/tache/modal/blocks/LabelsBlock.tsx
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBoardLabels } from "@/lib/tache/queries";
import {
  createLabel,
  addLabelToCard,
  removeLabelFromCard,
  deleteLabel,
} from "@/lib/tache/mutations";
import { LABEL_COLORS } from "@/types/tache.types";
import { useLanguage } from "@/context/LanguageContext";
import type { CardWithRelations, Label } from "@/types/tache.types";

// ─────────────────────────────────────────────────────────────

type Props = {
  card: CardWithRelations;
  boardId: string;
  onRemove: () => void;
};

export default function LabelsBlock({ card, boardId, onRemove }: Props) {
  const { t } = useLanguage() as any;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showList, setShowList] = useState(false);
  const [newColor, setNewColor] = useState<string>(LABEL_COLORS[0].hex);

  // ── 1. Charger TOUS les labels du board ──────────────────
  const { data: boardLabels = [], isLoading } = useQuery({
    queryKey: ["boardLabels", boardId],
    queryFn: () => fetchBoardLabels(boardId),
    staleTime: 60_000,
  });

  // ── 2. IDs des labels déjà sur la carte ─────────────────
  const selectedIds = new Set(card.labels.map((l) => l.id));

  // ── 3. Toggle : ajouter ou retirer un label ──────────────
  const toggleMutation = useMutation({
    mutationFn: ({ labelId, add }: { labelId: string; add: boolean }) =>
      add
        ? addLabelToCard(card.id, labelId)
        : removeLabelFromCard(card.id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });

  const handleToggle = (label: Label) => {
    const add = !selectedIds.has(label.id);
    toggleMutation.mutate({ labelId: label.id, add });
  };

  // ── 4. Créer un nouveau label ────────────────────────────
  const createMutation = useMutation({
    mutationFn: () =>
      createLabel({ board_id: boardId, name: newName.trim(), color: newColor }),
    onSuccess: (newLabel) => {
      addLabelToCard(card.id, newLabel.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["boardLabels", boardId] });
        queryClient.invalidateQueries({ queryKey: ["card", card.id] });
        queryClient.invalidateQueries({ queryKey: ["board"] });
      });
      setNewName("");
      setNewColor(LABEL_COLORS[0].hex);
      setShowCreate(false);
    },
  });

  // ── 5. Supprimer un label du board ───────────────────────
  const deleteMutation = useMutation({
    mutationFn: (labelId: string) => deleteLabel(labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardLabels", boardId] });
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });

  // ── Filtrage par recherche ───────────────────────────────
  const filtered = boardLabels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="space-y-3"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               className="text-zinc-500">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-sm font-semibold text-zinc-300">
            {t?.labelsBlock?.title ?? "Étiquettes"}
          </span>
        </div>
        <button
          onClick={() => setShowList(v => !v)}
          className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs px-2 py-1
                    rounded-lg hover:bg-zinc-800"
        >
          {showList
            ? (t?.labelsBlock?.hide ?? "Masquer")
            : (t?.labelsBlock?.edit ?? "Modifier")}
        </button>
      </div>

      {/* Étiquettes actives sur la carte */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Recherche */}
      {showList && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t?.labelsBlock?.searchPlaceholder ?? "Rechercher une étiquette..."}
          className="w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl
                    px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600
                    focus:outline-none focus:border-violet-500/60 transition-colors"
        />
      )}

      {/* Liste des labels du board */}
      {showList && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-900/40">
          {isLoading && (
            <p className="text-xs text-zinc-600 py-2 text-center">
              {t?.labelsBlock?.loading ?? "Chargement..."}
            </p>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-xs text-zinc-600 py-2 text-center">
              {search
                ? (t?.labelsBlock?.noResult ?? "Aucun résultat")
                : (t?.labelsBlock?.noLabels ?? "Aucune étiquette créée")}
            </p>
          )}

          {filtered.map((label) => {
            const isSelected = selectedIds.has(label.id);
            return (
              <div key={label.id} className="flex items-center gap-2">
                {/* Bouton principal — toggle */}
                <button
                  onClick={() => handleToggle(label)}
                  disabled={toggleMutation.isPending}
                  className="flex-1 flex items-center justify-between px-3 py-2
                            rounded-xl text-xs font-medium text-white
                            transition-all duration-150 hover:opacity-90
                            disabled:opacity-50"
                  style={{
                    backgroundColor: label.color,
                    outline: isSelected ? "2px solid white" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <span>{label.name}</span>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <polyline points="20,6 9,17 4,12" stroke="white"
                                strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>

                {/* Bouton suppression label du board */}
                <button
                  onClick={() => deleteMutation.mutate(label.id)}
                  disabled={deleteMutation.isPending}
                  title={t?.labelsBlock?.deleteLabel ?? "Supprimer ce label"}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                            text-zinc-600 hover:text-red-400 hover:bg-zinc-800
                            transition-colors disabled:opacity-50"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Créer une nouvelle étiquette ── */}
      {showList && (
        <div className="pt-2 border-t border-zinc-800/60">
          <AnimatePresence>
            {showCreate ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Aperçu */}
                <div
                  className="w-full h-8 rounded-xl flex items-center px-3
                            text-xs font-medium text-white transition-colors"
                  style={{ backgroundColor: newColor }}
                >
                  {newName || (t?.labelsBlock?.preview ?? "Aperçu de l'étiquette")}
                </div>

                {/* Nom */}
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t?.labelsBlock?.namePlaceholder ?? "Nom de l'étiquette"}
                  autoFocus
                  className="w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl
                            px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600
                            focus:outline-none focus:border-violet-500/60 transition-colors"
                />

                {/* Palette de couleurs */}
                <div className="flex flex-wrap gap-2">
                  {LABEL_COLORS.map(({ hex, name }) => (
                    <button
                      key={hex}
                      title={name}
                      onClick={() => setNewColor(hex)}
                      className="w-7 h-7 rounded-lg transition-all"
                      style={{
                        backgroundColor: hex,
                        outline: newColor === hex ? "2px solid white" : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => createMutation.mutate()}
                    disabled={!newName.trim() || createMutation.isPending}
                    className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40
                              text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {createMutation.isPending
                      ? (t?.labelsBlock?.creating ?? "Création...")
                      : (t?.labelsBlock?.createAndAdd ?? "Créer et ajouter")}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setNewName("");
                      setNewColor(LABEL_COLORS[0].hex);
                    }}
                    className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300
                              text-xs transition-colors"
                  >
                    {t?.labelsBlock?.cancel ?? "Annuler"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowCreate(true)}
                className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300
                          hover:bg-zinc-800/60 rounded-xl transition-colors"
              >
                {t?.labelsBlock?.createNew ?? "+ Créer une nouvelle étiquette"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}