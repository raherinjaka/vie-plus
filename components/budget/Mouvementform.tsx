"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, MinusCircle, X, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type MvtType = "ajout" | "depense";

export interface NewMouvement {
  nom: string;
  montant: number;
  type: MvtType;
  categorie: string;
}

interface Props {
  onAdd: (m: NewMouvement) => Promise<void>;
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "general",      label: "Général",      icon: "⚡", color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/25"  },
  { id: "alimentation", label: "Alimentation", icon: "🍱", color: "text-orange-300",  bg: "bg-orange-500/15",  border: "border-orange-500/25" },
  { id: "transport",    label: "Transport",    icon: "🚗", color: "text-blue-300",    bg: "bg-blue-500/15",    border: "border-blue-500/25"   },
  { id: "loisirs",      label: "Loisirs",      icon: "🎮", color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-500/25" },
  { id: "sante",        label: "Santé",        icon: "💊", color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25"},
  { id: "education",    label: "Éducation",    icon: "📚", color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/25"   },
];

// ─── MouvementForm ────────────────────────────────────────────────────────────
export default function MouvementForm({ onAdd }: Props) {
  const [open, setOpen]       = useState(false);
  const [type, setType]       = useState<MvtType>("depense");
  const [nom, setNom]         = useState("");
  const [montant, setMontant] = useState("");
  const [catId, setCatId]     = useState("general");
  const [loading, setLoading] = useState(false);

  const isValid = nom.trim().length > 0 && Number(montant) > 0;
  const isDepense = type === "depense";

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    await onAdd({ nom: nom.trim(), montant: Number(montant), type, categorie: catId });
    setNom(""); setMontant(""); setCatId("general");
    setOpen(false);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="mb-4"
    >
      <AnimatePresence mode="wait">
        {!open ? (
          /* ── TRIGGER BUTTONS ── */
          <motion.div
            key="triggers"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-3"
          >
            <button
              onClick={() => { setType("depense"); setOpen(true); }}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-3xl
                bg-red-500/[0.07] border border-red-500/[0.15] hover:border-red-500/30
                text-red-400 font-black text-sm hover:bg-red-500/10
                transition-all duration-200 active:scale-[0.98] group"
            >
              <MinusCircle size={18} className="group-hover:scale-110 transition-transform" />
              Nouvelle dépense
            </button>
            <button
              onClick={() => { setType("ajout"); setOpen(true); }}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-3xl
                bg-emerald-500/[0.07] border border-emerald-500/[0.15] hover:border-emerald-500/30
                text-emerald-400 font-black text-sm hover:bg-emerald-500/10
                transition-all duration-200 active:scale-[0.98] group"
            >
              <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
              Ajouter de l&apos;argent
            </button>
          </motion.div>
        ) : (
          /* ── FORM ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`rounded-3xl border overflow-hidden
              ${isDepense
                ? "bg-red-500/[0.04] border-red-500/[0.18]"
                : "bg-emerald-500/[0.04] border-emerald-500/[0.18]"
              }`}
          >
            {/* Form header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b
              ${isDepense ? "border-red-500/10" : "border-emerald-500/10"}`}
            >
              {/* Type switcher */}
              <div className="flex gap-2">
                <button
                  onClick={() => setType("depense")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all
                    ${isDepense
                      ? "bg-red-500/15 border-red-500/25 text-red-300"
                      : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
                    }`}
                >
                  <MinusCircle size={12} />
                  Dépense
                </button>
                <button
                  onClick={() => setType("ajout")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all
                    ${!isDepense
                      ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-300"
                      : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300"
                    }`}
                >
                  <PlusCircle size={12} />
                  Ajout
                </button>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-xl
                  text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-5">

              {/* Name input */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">
                  Nom de l&apos;opération
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder={isDepense ? "Ex: Cantine, Transport…" : "Ex: Argent de poche…"}
                  autoFocus
                  className={`w-full bg-transparent border-b pb-2 outline-none
                    text-white font-bold text-base placeholder:text-slate-700
                    transition-colors duration-300
                    ${nom
                      ? isDepense ? "border-red-500/40" : "border-emerald-500/40"
                      : "border-white/10 focus:border-white/25"
                    }`}
                />
              </div>

              {/* Amount input */}
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">
                  Montant
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="0"
                    min={1}
                    className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-2xl
                      px-4 py-3 text-white font-mono font-black text-lg outline-none
                      focus:border-white/20 focus:bg-white/[0.06]
                      placeholder:text-slate-700 transition-all"
                  />
                  <span className="text-slate-500 font-black font-mono">Ar</span>
                </div>
              </div>

              {/* Category picker — only for depenses */}
              {isDepense && (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 block">
                    Catégorie
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCatId(c.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                          text-xs font-bold border transition-all duration-150
                          ${catId === c.id
                            ? `${c.bg} ${c.color} ${c.border} scale-105`
                            : "bg-white/[0.03] text-slate-500 border-white/[0.07] hover:border-white/15 hover:text-slate-300"
                          }`}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
                  font-black text-sm transition-all active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${isDepense
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/25"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/25"
                  }`}
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                  />
                ) : (
                  <Check size={16} />
                )}
                {loading ? "Enregistrement…" : isDepense ? "Enregistrer la dépense" : "Confirmer l'ajout"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}