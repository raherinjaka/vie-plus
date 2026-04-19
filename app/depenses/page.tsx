"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { supabase } from "@/lib/supabase";
import NavDrawer from "@/components/NavDrawer";


import BudgetSetup, { type BudgetConfig } from "@/components/budget/Budgetsetup";
import BudgetHeader from "@/components/budget/Budgetheader";
import BudgetGauge  from "@/components/budget/Budgetgauge";
import BudgetStats  from "@/components/budget/Budgetstats";
import MouvementForm, { type NewMouvement } from "@/components/budget/Mouvementform";
import MouvementList, { type Mouvement }   from "@/components/budget/Mouvementlist";

// ─── Categories for stats ────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "general",      label: "Général",      icon: "⚡", color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/25"  },
  { id: "alimentation", label: "Alimentation", icon: "🍱", color: "text-orange-300",  bg: "bg-orange-500/15",  border: "border-orange-500/25" },
  { id: "transport",    label: "Transport",    icon: "🚗", color: "text-blue-300",    bg: "bg-blue-500/15",    border: "border-blue-500/25"   },
  { id: "loisirs",      label: "Loisirs",      icon: "🎮", color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-500/25" },
  { id: "sante",        label: "Santé",        icon: "💊", color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25"},
  { id: "education",    label: "Éducation",    icon: "📚", color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/25"   },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ notif, onClose }: {
  notif: { msg: string; type: "error" | "success" } | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {notif && (
        <motion.div
          initial={{ y: -28, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -28, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22 }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[500]
            flex items-center gap-4 px-5 py-3.5 rounded-2xl border shadow-2xl
            backdrop-blur-xl min-w-[300px] max-w-md
            ${notif.type === "error"
              ? "bg-slate-950/95 border-red-500/30"
              : "bg-slate-950/95 border-emerald-500/30"}`}
        >
          <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full
            ${notif.type === "error" ? "bg-red-500" : "bg-emerald-500"}`} />
          <div className="flex flex-col flex-1 min-w-0 pl-1">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em]
              ${notif.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {notif.type === "error" ? "Erreur" : "Succès"}
            </span>
            <span className="text-sm text-slate-300 truncate">{notif.msg}</span>
          </div>
          <button onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg
              text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all flex-shrink-0">
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DepensePage() {
  const router = useRouter();

  const [userId,      setUserId]      = useState<string | null>(null);
  const [config,      setConfig]      = useState<BudgetConfig | null>(null);
  const [mouvements,  setMouvements]  = useState<Mouvement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [configLoad,  setConfigLoad]  = useState(true);
  const [notif,       setNotif]       = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // ── Auto-dismiss toast ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => setNotif(null), 4000);
    return () => clearTimeout(t);
  }, [notif]);

  // ── Auth guard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const uid = session.user.id;
      setUserId(uid);
      await Promise.all([fetchConfig(uid), fetchMouvements(uid)]);
      setLoading(false);
    })();
  }, []);

  // ── Fetch budget config ───────────────────────────────────────────────────────
  const fetchConfig = async (uid: string) => {
    const { data } = await supabase
      .from("budget_config")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setConfig({
        montant:      data.montant,
        periodeType:  data.periode_type,
        periodeDuree: data.periode_duree,
        dateDebut:    data.date_debut,
        dateFin:      data.date_fin,
      });
    }
    setConfigLoad(false);
  };

  // ── Fetch mouvements ──────────────────────────────────────────────────────────
  const fetchMouvements = async (uid: string) => {
    const { data, error } = await supabase
      .from("mouvements")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) { setNotif({ msg: "Erreur de chargement.", type: "error" }); return; }
    if (data) setMouvements(data);
  };

  // ── Save budget config (called from BudgetSetup) ──────────────────────────────
  const handleSetupConfirm = async (cfg: BudgetConfig) => {
    if (!userId) return;

    // Delete old config
    await supabase.from("budget_config").delete().eq("user_id", userId);

    const { error } = await supabase.from("budget_config").insert({
      user_id:       userId,
      montant:       cfg.montant,
      periode_type:  cfg.periodeType,
      periode_duree: cfg.periodeDuree,
      date_debut:    cfg.dateDebut,
      date_fin:      cfg.dateFin,
    });

    if (error) {
      setNotif({ msg: "Erreur : " + error.message, type: "error" });
      return;
    }
    setConfig(cfg);
    setNotif({ msg: "Cycle démarré avec succès !", type: "success" });
  };

  // ── Reset cycle ────────────────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!userId) return;
    // Delete all mouvements + config
    await supabase.from("mouvements").delete().eq("user_id", userId);
    await supabase.from("budget_config").delete().eq("user_id", userId);
    setMouvements([]);
    setConfig(null);
    setNotif({ msg: "Cycle réinitialisé. Prêt pour un nouveau départ !", type: "success" });
  };

  // ── Add mouvement ──────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (m: NewMouvement) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("mouvements")
      .insert([{ user_id: userId, ...m }])
      .select()
      .single();

    if (error) { setNotif({ msg: "Erreur : " + error.message, type: "error" }); return; }
    if (data) {
      setMouvements((prev) => [data, ...prev]);
      setNotif({ msg: `${m.type === "depense" ? "Dépense" : "Ajout"} enregistré ✓`, type: "success" });
    }
  }, [userId]);

  // ── Delete mouvement ───────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from("mouvements").delete().eq("id", id);
    if (error) { setNotif({ msg: "Suppression impossible.", type: "error" }); return; }
    setMouvements((prev) => prev.filter((m) => m.id !== id));
    setNotif({ msg: "Opération supprimée.", type: "success" });
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const ajouts   = mouvements.filter((m) => m.type === "ajout").reduce((s, m) => s + m.montant, 0);
    const depenses = mouvements.filter((m) => m.type === "depense").reduce((s, m) => s + m.montant, 0);
    const total    = (config?.montant ?? 0) + ajouts;
    const restant  = Math.max(0, total - depenses);
    const pct      = total > 0 ? (restant / total) * 100 : 0;

    const catStats = CATEGORIES.map((c) => ({
      ...c,
      total: mouvements
        .filter((m) => m.type === "depense" && m.categorie === c.id)
        .reduce((s, m) => s + m.montant, 0),
    })).sort((a, b) => b.total - a.total);

    return { ajouts, depenses, total, restant, pct, catStats };
  }, [mouvements, config]);

  // ── Loading screen ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#080c12] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-cyan-400" />
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-[#080c12] text-slate-100 overflow-x-hidden"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
    >
      {/*<MobileHeader />*/}
      <Toast notif={notif} onClose={() => setNotif(null)} />

      {/* Setup modal — shown if no config */}
      {!configLoad && !config && (
        <BudgetSetup onConfirm={handleSetupConfirm} />
      )}

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#22d3ee 1px,transparent 1px),linear-gradient(90deg,#22d3ee 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* NavDrawer */}
      <div className="fixed top-4 right-4 z-[100]">
        <NavDrawer />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 px-4 sm:px-8 lg:px-14 pt-20 pb-32 max-w-5xl mx-auto w-full">

        {/* ── PAGE TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-px h-5 bg-emerald-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              Budget tracker
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight uppercase"
            style={{
              background: "linear-gradient(120deg,#94a3b8 0%,#e2e8f0 35%,#34d399 60%,#94a3b8 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 5s linear infinite",
            }}
          >
            MON ARGENT
          </h1>
          <div className="mt-2 h-px w-48 bg-gradient-to-r from-emerald-500/50 via-cyan-500/30 to-transparent" />
        </motion.div>

        {config ? (
          <>
            {/* Budget header (locked budget + countdown + reset) */}
            <BudgetHeader config={config} onReset={handleReset} />

            {/* Gauge */}
            <div className="mb-4">
              <BudgetGauge
                montantTotal={stats.total}
                montantDepense={stats.depenses}
                montantRestant={stats.restant}
                pct={stats.pct}
              />
            </div>

            {/* Stats cards */}
            <BudgetStats
              budgetFixe={config.montant}
              totalAjouts={stats.ajouts}
              totalDepenses={stats.depenses}
              soldeRestant={stats.restant}
              pct={stats.pct}
              catStats={stats.catStats}
            />

            {/* Form */}
            <MouvementForm onAdd={handleAdd} />

            {/* List */}
            <MouvementList
              mouvements={mouvements}
              onDelete={handleDelete}
              loading={loading}
            />
          </>
        ) : (
          !configLoad && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <p className="text-slate-600 text-sm">
                Configure ton budget pour commencer…
              </p>
            </motion.div>
          )
        )}
      </main>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}