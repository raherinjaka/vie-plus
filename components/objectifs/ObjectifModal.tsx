"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { CATEGORY_LIST, CATEGORY_META, getCatMeta, normKey, type Category } from "./types";

interface FormState {
  titre:     string;
  categorie: Category;
  deadline:  string;
}

interface Props {
  open:       boolean;
  onClose:    () => void;
  onCreate:   (form: FormState) => Promise<{ error?: string | null }>;
  t:          any;
}

export default function ObjectifModal({ open, onClose, onCreate, t }: Props) {
  const [form, setForm] = useState<FormState>({
    titre:     "",
    categorie: "Projet",
    deadline:  "",
  });
  const [creating, setCreating] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.titre.trim()) return;
    setCreating(true);
    setError(null);
    const res = await onCreate(form);
    if (res.error) {
      setError(res.error);
      setCreating(false);
    } else {
      setForm({ titre: "", categorie: "Projet", deadline: "" });
      setCreating(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (creating) return;
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0,   scale: 0.94,  y: 24 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md rounded-3xl border border-slate-700/50
              bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-950/60 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-800/60">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-100">
                    {t?.objectifsPage?.modal?.title ?? "Nouvel objectif"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t?.objectifsPage?.modal?.subtitle ?? "Définissez votre prochain cap."}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={creating}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800
                    transition-all duration-200 disabled:opacity-30"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-7 py-6 space-y-6">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {t?.objectifsPage?.modal?.titleLabel ?? "Intitulé"}
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={form.titre}
                    onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={t?.objectifsPage?.modal?.placeholder ?? "Ex : Courir 10km par semaine…"}
                    className="w-full bg-transparent text-slate-100 text-base font-medium pb-2.5
                      border-b border-slate-700 focus:border-sky-500/70 outline-none
                      transition-colors duration-300 placeholder:text-slate-700"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {t?.objectifsPage?.modal?.categoryLabel ?? "Catégorie"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_LIST.map((cat) => {
                      const m        = getCatMeta(cat);
                      const selected = form.categorie === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setForm((f) => ({ ...f, categorie: cat }))}
                          className={`
                            flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold
                            border transition-all duration-200 active:scale-[0.97]
                            ${selected
                              ? `${m.bg} ${m.color} shadow-sm`
                              : "bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-slate-300 hover:border-slate-600"
                            }
                          `}
                        >
                          <span><m.icon size={18} /></span>
                          <span>{t?.objectifsPage?.categories?.[normKey(cat)] ?? m.label}</span>
                          {selected && (
                            <motion.span
                              layoutId="cat-check"
                              className={`ml-auto w-1.5 h-1.5 rounded-full ${m.dot}`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {t?.objectifsPage?.modal?.deadlineLabel ?? "Deadline (optionnel)"}
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3
                      text-slate-300 text-sm focus:border-sky-500/60 outline-none
                      transition-colors duration-200 [color-scheme:dark]"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs font-medium bg-red-500/8
                        border border-red-500/20 rounded-xl px-4 py-3"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-7 pb-7">
                <button
                  onClick={handleClose}
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl border border-slate-700/60 text-slate-400
                    text-sm font-semibold hover:border-slate-600 hover:text-slate-300
                    transition-all duration-200 disabled:opacity-40"
                >
                  {t?.objectifsPage?.modal?.cancel ?? "Annuler"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.titre.trim() || creating}
                  className="flex-1 py-3 rounded-xl bg-sky-500 text-slate-950 text-sm font-bold
                    hover:bg-sky-400 transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {creating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {t?.objectifsPage?.modal?.creating ?? "Création…"}
                    </>
                  ) : (
                    t?.objectifsPage?.modal?.create ?? "Créer"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}