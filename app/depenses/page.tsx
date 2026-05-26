"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { supabase } from "@/lib/supabase";
import NavDrawer from "@/components/NavDrawer";
import MobileNav from "@/components/MobileNav";

import { useLanguage } from "@/context/LanguageContext";
import ExportPDF from "@/components/budget/ExportPDF";

import BudgetSetup, { type BudgetConfig } from "@/components/budget/Budgetsetup";
import BudgetHeader from "@/components/budget/Budgetheader";
import BudgetGauge  from "@/components/budget/Budgetgauge";
import BudgetStats  from "@/components/budget/Budgetstats";
import DashboardChart from "@/components/budget/DashboardChart";
import MouvementForm, { type NewMouvement } from "@/components/budget/Mouvementform";
import MouvementList, { type Mouvement }   from "@/components/budget/Mouvementlist";


// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ notif, onClose }: {
  notif: { msg: string; type: "error" | "success" } | null;
  onClose: () => void;
}) {
  const { t } = useLanguage() as any;

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
              {notif.type === "error" ? t?.toast?.error : t?.toast?.success}
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
  const { t } = useLanguage() as any;

  const [userId,      setUserId]      = useState<string | null>(null);
  const [config,      setConfig]      = useState<BudgetConfig | null>(null);
  const [mouvements,  setMouvements]  = useState<Mouvement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [configLoad,  setConfigLoad]  = useState(true);
  const [userName, setUserName] = useState("");
  const [notif,       setNotif]       = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const [showList, setShowList] = useState(false);

  // ─── Categories for stats ─────────────────────────────────────────────────────
  const CATEGORIES = useMemo(() => [
    { id: "general",      label: t?.mouvementForm?.categories?.general,      icon: "⚡", color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/25"  },
    { id: "alimentation", label: t?.mouvementForm?.categories?.alimentation, icon: "🍱", color: "text-orange-300",  bg: "bg-orange-500/15",  border: "border-orange-500/25" },
    { id: "transport",    label: t?.mouvementForm?.categories?.transport,    icon: "🚗", color: "text-blue-300",    bg: "bg-blue-500/15",    border: "border-blue-500/25"   },
    { id: "loisirs",      label: t?.mouvementForm?.categories?.loisirs,      icon: "🎮", color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-500/25" },
    { id: "sante",        label: t?.mouvementForm?.categories?.sante,        icon: "💊", color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25"},
    { id: "education",    label: t?.mouvementForm?.categories?.education,    icon: "📚", color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/25"   },
  ], [t]);

  // ── Auto-dismiss toast ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!notif) return;
    const timer = setTimeout(() => setNotif(null), 4000);
    return () => clearTimeout(timer);
  }, [notif]);

  // ── Auth guard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => { 
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const uid = session.user.id;
      setUserId(uid);
  
      const meta = session.user.user_metadata;
      setUserName(meta?.full_name ?? meta?.name ?? session.user.email?.split("@")[0] ?? "");
  
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

    if (error) {
      setNotif({ msg: t?.depensePage?.errors?.loadFail, type: "error" });
      return;
    }
    if (data) setMouvements(data);
  };

  // ── Save budget config ────────────────────────────────────────────────────────
  const handleSetupConfirm = async (cfg: BudgetConfig) => {
    if (!userId) return;
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
      setNotif({ msg: t?.depensePage?.errors?.saveFail?.replace("{msg}", error.message), type: "error" });
      return;
    }
    setConfig(cfg);
    setNotif({ msg: t?.depensePage?.success?.cycleStarted, type: "success" });
  };

  // ── Reset cycle ────────────────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!userId) return;
    await supabase.from("mouvements").delete().eq("user_id", userId);
    await supabase.from("budget_config").delete().eq("user_id", userId);
    setMouvements([]);
    setConfig(null);
    setNotif({ msg: t?.depensePage?.success?.cycleReset, type: "success" });
  };

  // ── Add mouvement ──────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (m: NewMouvement) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("mouvements")
      .insert([{ user_id: userId, ...m }])
      .select()
      .single();

    if (error) {
      setNotif({ msg: t?.depensePage?.errors?.saveFail?.replace("{msg}", error.message), type: "error" });
      return;
    }
    if (data) {
      setMouvements((prev) => [data, ...prev]);
      setNotif({
        msg: m.type === "depense"
          ? t?.depensePage?.success?.expenseAdded
          : t?.depensePage?.success?.incomeAdded,
        type: "success",
      });
    }
  }, [userId, t]);

  // ── Delete mouvement ───────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from("mouvements").delete().eq("id", id);
    if (error) {
      setNotif({ msg: t?.depensePage?.errors?.deleteFail, type: "error" });
      return;
    }
    setMouvements((prev) => prev.filter((m) => m.id !== id));
    setNotif({ msg: t?.depensePage?.success?.deleted, type: "success" });
  }, [t]);

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
  // ── Loading screen ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#080c12] text-slate-100 px-4 sm:px-8 lg:px-14 pt-20 pb-32 max-w-5xl mx-auto">
      <style>{`
        @keyframes sk-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sk-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sk-block {
          animation: sk-fade-up 0.4s ease both;
        }
        .sk {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
        }
        .sk::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.07) 50%,
            transparent 100%
          );
          animation: sk-shimmer 1.8s infinite;
        }
      `}</style>

      {/* Titre */}
      <div className="sk-block mb-8 space-y-3" style={{ animationDelay: "0ms" }}>
        <div className="sk h-3 w-28 rounded-full" />
        <div className="sk h-12 w-64 rounded-2xl" />
        <div className="sk h-px w-48 rounded-full" />
      </div>

      {/* BudgetHeader */}
      <div className="sk-block rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6"
        style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="sk h-3 w-36 rounded-full" />
            <div className="sk h-10 w-48 rounded-2xl" />
            <div className="sk h-6 w-32 rounded-full" />
          </div>
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="sk w-12 h-12 rounded-xl" />
                <div className="sk h-2 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 sk h-1.5 w-full rounded-full" />
      </div>

      {/* BudgetGauge */}
      <div className="sk-block rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 mb-4
        flex flex-col sm:flex-row items-center gap-6"
        style={{ animationDelay: "160ms" }}>
        <div className="sk w-40 h-40 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <div className="sk h-2.5 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="sk h-16 rounded-2xl" />
            <div className="sk h-16 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="sk-block grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        style={{ animationDelay: "240ms" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-3xl border border-white/[0.05] bg-white/[0.02] space-y-3">
            <div className="sk h-2.5 w-16 rounded-full" />
            <div className="sk h-7 w-28 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Liste — opacité dégressive pour effet de fondu vers le bas */}
      <div className="sk-block space-y-2 mt-6" style={{ animationDelay: "320ms" }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4 rounded-2xl
              bg-white/[0.02] border border-white/[0.05]"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="sk w-10 h-10 rounded-2xl flex-shrink-0" />
              <div className="space-y-2">
                <div className="sk h-3 w-28 rounded-full" />
                <div className="sk h-2 w-16 rounded-full" />
              </div>
            </div>
            <div className="sk h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-[#080c12] text-slate-100 overflow-x-hidden"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
    >
      <Toast notif={notif} onClose={() => setNotif(null)} />

      {/* Setup modal */}
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
              {t?.depensePage?.subtitle}
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
            {t?.depensePage?.title}
          </h1>
          <div className="mt-2 h-px w-48 bg-gradient-to-r from-emerald-500/50 via-cyan-500/30 to-transparent" />
        </motion.div>

        {config ? (
          <>
            <BudgetHeader config={config} onReset={handleReset} montantRestant={stats.restant} />
            <div className="mb-4">
              <BudgetGauge
                montantTotal={stats.total}
                montantDepense={stats.depenses}
                montantRestant={stats.restant}
                pct={stats.pct}
              />
            </div>
            <DashboardChart
              mouvements={mouvements}
              budgetTotal={config.montant}
              dateDebut={config.dateDebut}
              dateFin={config.dateFin}
            />
            <BudgetStats
              budgetFixe={config.montant}
              totalAjouts={stats.ajouts}
              totalDepenses={stats.depenses}
              soldeRestant={stats.restant}
              pct={stats.pct}
              catStats={stats.catStats}
            />
            <div className="flex justify-end mb-4">
              <ExportPDF
                config={config}
                mouvements={mouvements}
                stats={stats}
                userName={userName} 
              />
            </div>
            <MouvementForm onAdd={handleAdd} />
              {/* ── TOGGLE LISTE ── */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowList((v) => !v)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl
                  border font-bold text-sm transition-all duration-200 mb-3
                  ${showList
                    ? "bg-slate-800/60 border-slate-600/50 text-slate-200"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-500 hover:text-slate-300 hover:border-white/15"
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📋</span>
                  <span>
                    {showList
                      ? (t?.mouvementList?.hideHistory ?? "Masquer l'historique")
                      : (t?.mouvementList?.showHistory ?? "Voir l'historique")}
                  </span>
                  {/* Badge nombre d'opérations */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black
                    ${showList
                      ? "bg-slate-700 text-slate-300"
                      : "bg-white/[0.06] text-slate-500"
                    }`}>
                    {mouvements.length}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: showList ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-slate-500"
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {showList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <MouvementList
                      mouvements={mouvements}
                      onDelete={handleDelete}
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
          </>
        ) : (
          !configLoad && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <p className="text-slate-600 text-sm">
                {t?.depensePage?.emptyState}
              </p>
            </motion.div>
          )
        )}
      </main>
      <MobileNav />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}