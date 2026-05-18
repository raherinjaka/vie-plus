
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import NavDrawer from "@/components/NavDrawer";

import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

import DashboardHeader   from "@/components/dashboard/DashboardHeader";
import DashboardStats    from "@/components/dashboard/DashboardStats";
import DashboardBudget   from "@/components/dashboard/DashboardBudget";
import DashboardActivity, { type ActivityItem }  from "@/components/dashboard/DashboardActivity";
import DashboardObjectifs, { type ObjectifPreview } from "@/components/dashboard/DashboardObjectifs";


// ─── Raw data types ───────────────────────────────────────────────────────────
interface Mouvement {
  id: string; nom: string; montant: number;
  type: "ajout" | "depense"; categorie: string; created_at: string;
}
interface BudgetConfig {
  montant: number; date_fin: string;
}
interface Objectif {
  id: string; titre: string; categorie: string; progression: number;
}
interface Tache {
  id: string; completed: boolean;
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage() as { t: any, lang: any, setLang: any };
  const { showOnboarding, completeOnboarding } = useOnboarding();

  // ─── Category meta (pour les barres) ─────────────────────────────────────────
  const CATEGORIES_TRADUITES = useMemo(() => [
    { id: "general",      label: t.dashboard.categories.general,   icon: "⚡", color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/25" },
    { id: "alimentation", label: t.dashboard.categories.food,      icon: "🍱", color: "text-orange-300",  bg: "bg-orange-500/15",  border: "border-orange-500/25" },
    { id: "transport",    label: t.dashboard.categories.transport, icon: "🚗", color: "text-blue-300",    bg: "bg-blue-500/15",    border: "border-blue-500/25" },
    { id: "loisirs",      label: t.dashboard.categories.leisure,   icon: "🎮", color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-500/25" },
    { id: "sante",        label: t.dashboard.categories.health,    icon: "💊", color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
    { id: "education",    label: t.dashboard.categories.education, icon: "📚", color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-500/25" },
  ], [t]);
  const [userName,      setUserName]      = useState("Utilisateur");
  const [mouvements,    setMouvements]    = useState<Mouvement[]>([]);
  const [budgetConfig,  setBudgetConfig]  = useState<BudgetConfig | null>(null);
  const [objectifs,     setObjectifs]     = useState<Objectif[]>([]);
  const [taches,        setTaches]        = useState<Tache[] | null>(null);
  const [loading,       setLoading]       = useState(true);

  // ── Auth + fetch all data ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const uid = session.user.id;
      const email = session.user.email ?? "";
      const meta  = session.user.user_metadata;
      // Récupère le prénom depuis metadata Google/GitHub ou depuis l'email
      const name = meta?.full_name ?? meta?.name ?? email.split("@")[0] ?? "Utilisateur";
      setUserName(name);

      // Fetch en parallèle — taches peut échouer si table pas encore créée
      const [mvtRes, cfgRes, objRes, tachRes] = await Promise.allSettled([
        supabase.from("mouvements").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("budget_config").select("montant,date_fin").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("objectifs").select("id,titre,categorie,progression").eq("user_id", uid),
        supabase.from("taches").select("id,completed").eq("user_id", uid),
      ]);

      if (mvtRes.status === "fulfilled" && mvtRes.value.data)
        setMouvements(mvtRes.value.data);

      if (cfgRes.status === "fulfilled" && cfgRes.value.data)
        setBudgetConfig(cfgRes.value.data);

      if (objRes.status === "fulfilled" && objRes.value.data)
        setObjectifs(objRes.value.data);

      // Tâches : si la table n'existe pas encore, on laisse null (fallback propre)
      if (tachRes.status === "fulfilled" && tachRes.value.data && !tachRes.value.error)
        setTaches(tachRes.value.data);

      setLoading(false);
    })();
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const ajouts   = mouvements.filter((m) => m.type === "ajout").reduce((s, m) => s + m.montant, 0);
    const depenses = mouvements.filter((m) => m.type === "depense").reduce((s, m) => s + m.montant, 0);
    const total    = (budgetConfig?.montant ?? 0) + ajouts;
    const restant  = Math.max(0, total - depenses);
    const pct      = total > 0 ? (restant / total) * 100 : 0;

    const scoreObjectifs = objectifs.length > 0
      ? Math.round(objectifs.reduce((s, o) => s + o.progression, 0) / objectifs.length)
      : 0;

    const tachesRatio = taches
      ? { done: taches.filter((t) => t.completed).length, total: taches.length }
      : null;

    const topCats = CATEGORIES_TRADUITES.map((c) => ({
      ...c,
      total: mouvements.filter((m) => m.type === "depense" && m.categorie === c.id)
                       .reduce((s, m) => s + m.montant, 0),
    })).sort((a, b) => b.total - a.total);

    return { ajouts, depenses, total, restant, pct, scoreObjectifs, tachesRatio, topCats };
  }, [mouvements, budgetConfig, objectifs, taches]);

  // ── Activity feed (5 dernières opérations) ────────────────────────────────
  const activityItems: ActivityItem[] = useMemo(() => {
    const mvtItems: ActivityItem[] = mouvements.slice(0, 5).map((m) => ({
      id:     m.id,
      type:   m.type,
      label:  m.nom,
      sub:    m.categorie.charAt(0).toUpperCase() + m.categorie.slice(1),
      amount: m.montant,
      date:   m.created_at,
    }));
    return mvtItems;
  }, [mouvements]);

  // ── Objectifs preview ─────────────────────────────────────────────────────
  const objectifsPreview: ObjectifPreview[] = objectifs.slice(0, 5).map((o) => ({
    id: o.id, titre: o.titre, categorie: o.categorie, progression: o.progression,
  }));

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#080c12] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-cyan-400" />
      <p className="text-slate-500 font-medium text-sm animate-pulse">{t.dashboard.loading}</p>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-[#080c12] text-slate-100 overflow-x-hidden"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
    >
      {/* Sidebar — desktop uniquement */}
      <Sidebar />

      {/* Header fixe — mobile uniquement */}
      <MobileHeader />

      {/* Background ambiance */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#22d3ee 1px,transparent 1px),linear-gradient(90deg,#22d3ee 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-violet-500/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-emerald-500/[0.03] blur-[80px]" />
      </div>

      {/* NavDrawer — desktop seulement, mobile a déjà MobileHeader */}
      <div className="hidden lg:block fixed top-4 right-4 z-[100]">
        <NavDrawer />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 lg:px-12 pt-[96px] lg:ml-72 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* ── HEADER ── */}
          <DashboardHeader
            userName={userName}
            solde={stats.restant}
            budgetTotal={stats.total}
            pct={stats.pct}
          />

          {/* ── KPI CARDS ──
               Mobile  : 2 colonnes (2x2)
               Desktop : 4 colonnes en ligne
          */}
          <DashboardStats
            soldeRestant={stats.restant}
            totalDepenses={stats.depenses}
            scoreObjectifs={stats.scoreObjectifs}
            tachesRatio={stats.tachesRatio}
            budgetConfigured={budgetConfig !== null}
          />

          {/* ── MAIN GRID ──
               Mobile  : 1 colonne empilée (Budget → Objectifs → Activité)
               Desktop : 3 colonnes (Budget+Objectifs | Activité)
          */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Colonne gauche : Budget + Objectifs (2/3 desktop) */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <DashboardBudget
                montantTotal={stats.total}
                montantDepense={stats.depenses}
                montantRestant={stats.restant}
                pct={stats.pct}
                dateFin={budgetConfig?.date_fin ?? null}
                topCats={stats.topCats}
                configured={budgetConfig !== null}
              />
              <DashboardObjectifs
                objectifs={objectifsPreview}
                scoreGlobal={stats.scoreObjectifs}
                loading={loading}
              />
            </div>

            {/* Colonne droite : Activité (1/3 desktop, pleine largeur mobile) */}
            <div className="lg:col-span-1">
              {/* max-h sur mobile pour ne pas envahir l'écran */}
              <div className="max-h-[420px] lg:max-h-none lg:sticky lg:top-6 overflow-hidden rounded-3xl">
                <DashboardActivity
                  items={activityItems}
                  loading={loading}
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}
      <MobileNav />
    </div>
  );
}