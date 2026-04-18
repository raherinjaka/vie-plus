"use client";
import { useState, useEffect, useMemo } from "react";
import { PlusCircle, MinusCircle, Trash2, AlertTriangle, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { supabase } from "@/lib/supabase";

type Mouvement = {
  id: string;
  nom: string;
  montant: number;
  type: "ajout" | "depense";
  created_at: string;
  user_id: string;
};

// ── TOAST ──────────────────────────────────────────────
function Toast({ notif, onClose }: { notif: { msg: string; type: "error" | "success" } | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {notif && (
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-5 py-3.5 rounded-lg border shadow-lg backdrop-blur-sm min-w-[320px] max-w-md
            ${notif.type === "error" ? "bg-[#0f0f0f]/95 border-red-500/30" : "bg-[#0f0f0f]/95 border-emerald-500/30"}`}
        >
          <div className={`absolute left-0 top-0 h-full w-[3px] rounded-l-lg ${notif.type === "error" ? "bg-red-500" : "bg-emerald-500"}`} />
          <div className="flex flex-col flex-1 min-w-0">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${notif.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {notif.type === "error" ? "Erreur" : "Succès"}
            </span>
            <span className="text-sm text-slate-300 truncate">{notif.msg}</span>
          </div>
          <button onClick={onClose} className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-md transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SkeletonItem() {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="space-y-2">
          <div className="w-28 h-3 bg-white/5 rounded-full" />
          <div className="w-16 h-2 bg-white/5 rounded-full" />
        </div>
      </div>
      <div className="w-20 h-3 bg-white/5 rounded-full" />
    </div>
  );
}

// ── MODAL CONFIRMATION ─────────────────────────────────
function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-white font-bold">Supprimer cette opération ?</p>
            <p className="text-white/30 text-sm mt-0.5">Cette action est irréversible.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-semibold transition-all border border-red-500/20">
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DepensePage() {
  const [budgetInitial, setBudgetInitial] = useState(0);
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [nomSaisie, setNomSaisie] = useState("");
  const [montantSaisie, setMontantSaisie] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notif, setNotif] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => setNotif(null), 4000);
    return () => clearTimeout(t);
  }, [notif]);

  useEffect(() => {
    const fetchData = async () => {
      const saved = localStorage.getItem("budget_fixe");
      if (saved) setBudgetInitial(Number(saved));
  
      const { data: { user } } = await supabase.auth.getUser();
      
      // Si pas d'utilisateur, on arrête le chargement immédiatement
      if (!user) {
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from("mouvements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
  
      if (data) setMouvements(data);
      setLoading(false); // On arrête le chargement après avoir reçu les données
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("budget_fixe", String(budgetInitial));
  }, [budgetInitial]);

  const ajouterAction = async (type: "ajout" | "depense") => {
    if (!nomSaisie.trim()) return setNotif({ msg: "Le nom de l'opération est requis.", type: "error" });
    if (!montantSaisie || Number(montantSaisie) <= 0) return setNotif({ msg: "Le montant doit être supérieur à 0.", type: "error" });
    setActionLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setNotif({ msg: "Session expirée. Reconnecte-toi.", type: "error" }); setActionLoading(false); return; }
    const { data, error } = await supabase.from("mouvements").insert([{ user_id: user.id, nom: nomSaisie.trim(), montant: Number(montantSaisie), type }]).select();
    if (error) setNotif({ msg: "Erreur : " + error.message, type: "error" });
    else if (data) {
      setMouvements([data[0], ...mouvements]);
      setNomSaisie(""); setMontantSaisie("");
      setNotif({ msg: `${type === "depense" ? "Dépense" : "Ajout"} enregistré avec succès.`, type: "success" });
    }
    setActionLoading(false);
  };

  const supprimerAction = async () => {
    if (!confirmDeleteId) return;
    const { error } = await supabase.from("mouvements").delete().eq("id", confirmDeleteId);
    if (error) setNotif({ msg: "Impossible de supprimer.", type: "error" });
    else { setMouvements(mouvements.filter((m) => m.id !== confirmDeleteId)); setNotif({ msg: "Opération supprimée.", type: "success" }); }
    setConfirmDeleteId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") ajouterAction("depense"); };

  const stats = useMemo(() => {
    const totalAjouts = mouvements.filter((m) => m.type === "ajout").reduce((acc, m) => acc + m.montant, 0);
    const totalDepenses = mouvements.filter((m) => m.type === "depense").reduce((acc, m) => acc + m.montant, 0);
    
    const budgetTotal = budgetInitial + totalAjouts;
    const reelRestant = budgetTotal - totalDepenses;
  
    // Ici on force le résultat à ne pas descendre sous 0
    const argentRestant = Math.max(0, reelRestant); 
    const pourcentage = budgetTotal > 0 ? (argentRestant / budgetTotal) * 100 : 0;
  
    return { argentRestant, pourcentage, totalDepenses, totalAjouts };
  }, [mouvements, budgetInitial]);

  const getProgressColor = (pct: number) => {
    if (pct <= 0) return "bg-purple-500";
    if (pct < 20) return "bg-red-500";
    if (pct < 50) return "bg-orange-400";
    return "bg-cyan-400";
  };

  const getGlowColor = (pct: number) => {
    if (pct <= 0) return "shadow-[0_0_20px_rgba(168,85,247,0.4)]";
    if (pct < 20) return "shadow-[0_0_20px_rgba(239,68,68,0.4)]";
    if (pct < 50) return "shadow-[0_0_20px_rgba(249,115,22,0.4)]";
    return "shadow-[0_0_20px_rgba(34,211,238,0.4)]";
  };

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f] overflow-y-auto">
      <Sidebar />
      <MobileHeader />
      <Toast notif={notif} onClose={() => setNotif(null)} />
      <AnimatePresence>
        {confirmDeleteId && <ConfirmModal onConfirm={supprimerAction} onCancel={() => setConfirmDeleteId(null)} />}
      </AnimatePresence>

      <div className="flex-1 min-h-screen px-6 lg:px-12 pt-24 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── HEADER ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
            <h1 className="text-white text-2xl font-bold tracking-tight">Mes dépenses</h1>
            <p className="text-white/30 text-sm mt-1">Suivi de budget en temps réel</p>
          </motion.div>

          {/* ── CARDS STATS ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Budget fixe */}
            <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden group hover:border-white/15 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={14} className="text-white/30" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Budget Fixe</span>
              </div>
              <input
                type="number"
                value={budgetInitial}
                onChange={(e) => setBudgetInitial(Number(e.target.value))}
                className="bg-transparent text-2xl font-black text-white outline-none w-full focus:text-cyan-400 transition-colors"
              />
              <span className="text-white/20 text-sm">Ar</span>
            </div>

            {/* Total dépensé */}
            <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown size={14} className="text-red-400/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Dépensé</span>
              </div>
              <p className="text-2xl font-black text-red-400">-{stats.totalDepenses.toLocaleString()}</p>
              <span className="text-white/20 text-sm">Ar</span>
            </div>

            {/* Total ajouté */}
            <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-emerald-400/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ajouté</span>
              </div>
              <p className="text-2xl font-black text-emerald-400">+{stats.totalAjouts.toLocaleString()}</p>
              <span className="text-white/20 text-sm">Ar</span>
            </div>
          </motion.div>

          {/* ── BARRE DE PROGRESSION ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Solde restant</span>
              <span className={`text-xl font-black tabular-nums ${stats.argentRestant < 0 ? "text-red-400" : "text-white"}`}>
                {stats.argentRestant < 0 ? "" : ""}{stats.argentRestant.toLocaleString()} Ar
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getProgressColor(stats.pourcentage)} ${getGlowColor(stats.pourcentage)}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, stats.pourcentage))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/20">0 Ar</span>
              <span className="text-[10px] text-white/20">{Math.round(stats.pourcentage)}% restant</span>
            </div>
          </motion.div>

          {/* ── SAISIE ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/8">
            <h3 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              Nouvelle opération
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Ex: Cantine"
                value={nomSaisie}
                onChange={(e) => setNomSaisie(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
              />
              <input
                type="number"
                placeholder="Montant (Ar)"
                value={montantSaisie}
                onChange={(e) => setMontantSaisie(e.target.value)}
                onKeyDown={handleKeyDown}
                min={1}
                className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => ajouterAction("depense")}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 hover:border-red-500/30 text-red-400 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                >
                  {actionLoading ? "…" : "Dépense"}
                </button>
                <button
                  onClick={() => ajouterAction("ajout")}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15 hover:border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                >
                  {actionLoading ? "…" : "Ajout"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── LISTE ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                Historique · {mouvements.length} opération{mouvements.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <SkeletonItem key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && mouvements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                  <Wallet size={22} className="text-white/20" />
                </div>
                <p className="text-white/40 text-sm font-semibold">Aucune opération</p>
                <p className="text-white/20 text-xs mt-1">Ajoute ta première dépense ci-dessus.</p>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <AnimatePresence>
                {!loading && mouvements.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2, delay: i < 5 ? i * 0.04 : 0 }}
                    className="group flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.type === "depense" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                        {m.type === "depense" ? <MinusCircle size={16} /> : <PlusCircle size={16} />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-none">{m.nom}</p>
                        <p className="text-white/25 text-[10px] mt-1 uppercase tracking-wide">
                          {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-black tabular-nums ${m.type === "depense" ? "text-red-400" : "text-emerald-400"}`}>
                        {m.type === "depense" ? "-" : "+"}{m.montant.toLocaleString()} Ar
                      </p>
                      <button
                        onClick={() => setConfirmDeleteId(m.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}