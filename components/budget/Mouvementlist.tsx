"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, MinusCircle, Trash2, AlertTriangle, Filter, ArrowUpDown, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Mouvement {
  id: string;
  user_id: string;
  nom: string;
  montant: number;
  type: "ajout" | "depense";
  categorie: string;
  created_at: string;
}

type SortKey    = "date" | "montant" | "nom";
type FilterType = "all" | "ajout" | "depense";

interface Props {
  mouvements: Mouvement[];
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

// ─── Categories meta ──────────────────────────────────────────────────────────
const CAT_META: Record<string, { icon: string; labelKey: string; color: string; bg: string; border: string }> = {
  general:      { icon: "⚡", labelKey: "general",      color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/20"  },
  alimentation: { icon: "🍱", labelKey: "alimentation", color: "text-orange-300",  bg: "bg-orange-500/15",  border: "border-orange-500/20" },
  transport:    { icon: "🚗", labelKey: "transport",    color: "text-blue-300",    bg: "bg-blue-500/15",    border: "border-blue-500/20"   },
  loisirs:      { icon: "🎮", labelKey: "loisirs",      color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-500/20" },
  sante:        { icon: "💊", labelKey: "sante",        color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/20"},
  education:    { icon: "📚", labelKey: "education",    color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/20"   },
};
const getCat = (id: string) => CAT_META[id] ?? CAT_META["general"];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl
      bg-white/[0.02] border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5" />
        <div className="space-y-2">
          <div className="w-28 h-3 bg-white/5 rounded-full" />
          <div className="w-16 h-2 bg-white/5 rounded-full" />
        </div>
      </div>
      <div className="w-20 h-3 bg-white/5 rounded-full" />
    </div>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
function ConfirmModal({ name, onConfirm, onCancel }: {
  name: string; onConfirm: () => void; onCancel: () => void;
}) {
  const { t } = useLanguage() as any;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center px-4
        bg-black/70 backdrop-blur-md"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/10
          bg-slate-950/98 p-8 shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20
            flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-black">
              {t?.mouvementList?.confirmModal?.title}
            </p>
            <p className="text-slate-500 text-sm mt-0.5 font-mono">« {name} »</p>
            <p className="text-slate-700 text-xs mt-1">
              {t?.mouvementList?.confirmModal?.warning}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10
              text-slate-300 text-sm font-bold transition-all">
            {t?.mouvementList?.confirmModal?.cancel}
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25
              border border-red-500/20 text-red-400 text-sm font-black transition-all">
            {t?.mouvementList?.confirmModal?.confirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MouvementList ────────────────────────────────────────────────────────────
export default function MouvementList({ mouvements, onDelete, loading }: Props) {
  const { t } = useLanguage() as any;

  const [sortKey,    setSortKey]    = useState<SortKey>("date");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCat,  setFilterCat]  = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [confirmDel, setConfirmDel] = useState<{ id: string; name: string } | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  const locale = t?.meta?.locale ?? "fr-FR";

  // ── Filter + sort ─────────────────────────────────────────────────────────────
  const filtered = mouvements
    .filter((m) => filterType === "all" || m.type === filterType)
    .filter((m) => filterCat  === "all" || m.categorie === filterCat)
    .sort((a, b) => {
      if (sortKey === "montant") return b.montant - a.montant;
      if (sortKey === "nom")     return a.nom.localeCompare(b.nom);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(confirmDel.id);
    await onDelete(confirmDel.id);
    setDeleting(null);
    setConfirmDel(null);
  };

  const sortLabel = sortKey === "date"
    ? t?.mouvementList?.sort?.date
    : sortKey === "montant"
      ? t?.mouvementList?.sort?.amount
      : t?.mouvementList?.sort?.name;

  return (
    <>
      <AnimatePresence>
        {confirmDel && (
          <ConfirmModal
            name={confirmDel.name}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDel(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4 }}
      >
        {/* List header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            {t?.mouvementList?.historyLabel
              ?.replace("{n}", filtered.length)
              ?.replace("{s}", filtered.length > 1 ? "s" : "")}
          </span>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <button
              onClick={() => setSortKey((k) =>
                k === "date" ? "montant" : k === "montant" ? "nom" : "date"
              )}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-white/[0.03] border border-white/[0.07] hover:border-white/12
                text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-wider
                transition-all"
            >
              <ArrowUpDown size={11} />
              {sortLabel}
            </button>

            {/* Filter */}
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                text-[10px] font-bold uppercase tracking-wider border transition-all
                ${showFilter
                  ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-400"
                  : "bg-white/[0.03] border-white/[0.07] hover:border-white/12 text-slate-500 hover:text-slate-300"
                }`}
            >
              <Filter size={11} />
              {t?.mouvementList?.filterBtn}
              {(filterType !== "all" || filterCat !== "all") && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-3">
                {/* Type filter */}
                <div className="flex gap-2">
                  {(["all", "depense", "ajout"] as FilterType[]).map((f) => (
                    <button key={f} onClick={() => setFilterType(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                        ${filterType === f
                          ? f === "all"     ? "bg-white/10 border-white/20 text-white"
                          : f === "depense" ? "bg-red-500/15 border-red-500/25 text-red-400"
                          :                   "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                          : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      {f === "all"
                        ? t?.mouvementList?.filter?.all
                        : f === "depense"
                          ? t?.mouvementList?.filter?.expenses
                          : t?.mouvementList?.filter?.incomes}
                    </button>
                  ))}
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilterCat("all")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all
                      ${filterCat === "all"
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    {t?.mouvementList?.filter?.allCats}
                  </button>
                  {Object.entries(CAT_META).map(([id, c]) => (
                    <button key={id} onClick={() => setFilterCat(id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border transition-all
                        ${filterCat === id
                          ? `${c.bg} ${c.color} ${c.border}`
                          : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      <span>{c.icon}</span>
                      <span>{t?.mouvementForm?.categories?.[c.labelKey]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton */}
        {loading && (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/[0.07]
              flex items-center justify-center mb-4">
              <Wallet size={24} className="text-slate-700" />
            </div>
            <p className="text-slate-500 font-bold">
              {t?.mouvementList?.empty?.title}
            </p>
            <p className="text-slate-700 text-xs mt-1">
              {filterType !== "all" || filterCat !== "all"
                ? t?.mouvementList?.empty?.filtered
                : t?.mouvementList?.empty?.default}
            </p>
          </motion.div>
        )}

        {/* Items */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {!loading && filtered.map((m, i) => {
              const cat = getCat(m.categorie);
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i < 6 ? i * 0.03 : 0 }}
                  className={`group flex items-center justify-between px-4 py-4 rounded-2xl
                    border transition-all duration-200 cursor-default
                    ${deleting === m.id
                      ? "opacity-40 scale-95"
                      : "bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0
                      border ${m.type === "depense"
                        ? "bg-red-500/10 text-red-400 border-red-500/15"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                      }`}
                    >
                      {m.type === "depense"
                        ? <MinusCircle size={17} />
                        : <PlusCircle size={17} />
                      }
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-bold leading-none">{m.nom}</p>
                        <span className={`hidden sm:inline-flex items-center gap-1
                          px-1.5 py-0.5 rounded-md text-[9px] font-black
                          ${cat.bg} ${cat.color} border ${cat.border}`}
                        >
                          {cat.icon} {t?.mouvementForm?.categories?.[cat.labelKey]}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[10px] font-mono mt-1 uppercase tracking-wide">
                        {new Date(m.created_at).toLocaleDateString(locale, {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className={`text-sm font-black font-mono tabular-nums
                      ${m.type === "depense" ? "text-red-400" : "text-emerald-400"}`}
                    >
                      {m.type === "depense" ? "-" : "+"}{m.montant.toLocaleString()} Ar
                    </p>
                    <button
                      onClick={() => setConfirmDel({ id: m.id, name: m.nom })}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center
                        justify-center rounded-xl text-slate-600 hover:text-red-400
                        hover:bg-red-500/10 transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}