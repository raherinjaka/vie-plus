"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NavDrawer from "@/components/NavDrawer";
import { useLanguage } from "@/context/LanguageContext";

import ObjectifStats    from "@/components/objectifs/ObjectifStats";
import ObjectifFilters  from "@/components/objectifs/ObjectifFilters";
import ObjectifCard     from "@/components/objectifs/ObjectifCard";
import ObjectifModal    from "@/components/objectifs/ObjectifModal";
import ObjectifTrophies from "@/components/objectifs/ObjectifTrophies";
import ObjectifSkeleton from "@/components/objectifs/Objectifskeleton";
import ObjectifEmpty    from "@/components/objectifs/Objectifempty";
import { type Objectif, type Category, CATEGORY_LIST } from "@/components/objectifs/types";
import MobileNav from "@/components/MobileNav";

// ─── Sort types ───────────────────────────────────────────────────────────────
type SortKey = "date" | "deadline" | "progression";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date",        label: "Date de création" },
  { key: "deadline",    label: "Deadline" },
  { key: "progression", label: "Progression" },
];

function sortObjectifs(list: Objectif[], key: SortKey): Objectif[] {
  return [...list].sort((a, b) => {
    if (key === "date") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (key === "deadline") {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (key === "progression") {
      return b.progression - a.progression;
    }
    return 0;
  });
}

// ─── Optimistic placeholder ID prefix ────────────────────────────────────────
const OPTIMISTIC_PREFIX = "__optimistic__";

export default function ObjectifsPage() {
  const router = useRouter();
  const { t }  = useLanguage() as any;
  const locale = t?.meta?.locale ?? "fr-FR";

  const [objectifs,  setObjectifs]  = useState<Objectif[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [userId,     setUserId]     = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);
  const [filter,     setFilter]     = useState<Category | "all">("all");
  const [sortKey,    setSortKey]    = useState<SortKey>("date");
  const [showSort,   setShowSort]   = useState(false);
  const [confettiId, setConfettiId] = useState<string | null>(null);

  // ── Auth + fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);
      await fetchObjectifs(session.user.id);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchObjectifs = async (uid: string) => {
    const { data } = await supabase
      .from("objectifs").select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setObjectifs(data);
  };

  // ── Update progression ────────────────────────────────────────────────────
  const updateProgression = useCallback(async (id: string, delta: number) => {
    if (id.startsWith(OPTIMISTIC_PREFIX)) return; // skip placeholders
    const obj = objectifs.find((o) => o.id === id);
    if (!obj) return;
    const newPct = Math.min(100, Math.max(0, obj.progression + delta));
    setObjectifs((prev) => prev.map((o) => (o.id === id ? { ...o, progression: newPct } : o)));
    if (newPct === 100) setConfettiId(id);
    await supabase.from("objectifs").update({ progression: newPct }).eq("id", id);
  }, [objectifs]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteObjectif = useCallback(async (id: string) => {
    setObjectifs((prev) => prev.filter((o) => o.id !== id));
    await supabase.from("objectifs").delete().eq("id", id);
  }, []);

  // ── Create — optimistic ───────────────────────────────────────────────────
  const createObjectif = async (form: { titre: string; categorie: Category; deadline: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id ?? userId;
    if (!uid) return { error: t?.objectifsPage?.modal?.sessionError ?? "Session expirée." };

    // Optimistic placeholder
    const tempId: string = `${OPTIMISTIC_PREFIX}${Date.now()}`;
    const placeholder: Objectif = {
      id:          tempId,
      user_id:     uid,
      titre:       form.titre.trim(),
      categorie:   form.categorie,
      progression: 0,
      deadline:    form.deadline || null,
      created_at:  new Date().toISOString(),
    };
    setObjectifs((prev) => [placeholder, ...prev]);

    const { data, error } = await supabase
      .from("objectifs")
      .insert({
        user_id:     uid,
        titre:       form.titre.trim(),
        categorie:   form.categorie,
        progression: 0,
        deadline:    form.deadline || null,
      })
      .select().single();

    if (error) {
      // Rollback
      setObjectifs((prev) => prev.filter((o) => o.id !== tempId));
      return { error: t?.objectifsPage?.modal?.createError?.replace("{msg}", error.message) ?? error.message };
    }

    // Replace placeholder with real row
    setObjectifs((prev) => prev.map((o) => (o.id === tempId ? data : o)));
    return { error: null };
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const active = useMemo(() => objectifs.filter((o) => o.progression < 100), [objectifs]);
  const done   = useMemo(() => objectifs.filter((o) => o.progression >= 100), [objectifs]);
  const avgScore = useMemo(() =>
    objectifs.length
      ? Math.round(objectifs.reduce((s, o) => s + o.progression, 0) / objectifs.length)
      : 0,
    [objectifs]
  );

  const counts = useMemo(() =>
    CATEGORY_LIST.reduce((acc, cat) => {
      acc[cat] = active.filter((o) => normKeyMatch(o.categorie, cat)).length;
      return acc;
    }, {} as Record<string, number>),
    [active]
  );

  const filtered = useMemo(() => {
    const list = filter === "all"
      ? active
      : active.filter((o) => normKeyMatch(o.categorie, filter));
    return sortObjectifs(list, sortKey);
  }, [active, filter, sortKey]);

  // ── Loading — skeleton grid ───────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden custom-scroll">
      <BgLayer />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Fake header */}
        <div className="mb-10 space-y-4 animate-pulse">
          <div className="h-12 w-56 rounded-2xl bg-slate-800" />
          <div className="h-px w-40 bg-slate-800" />
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {[1,2,3].map((i) => <div key={i} className="h-20 rounded-2xl bg-slate-800/60" />)}
          </div>
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map((i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
              <ObjectifSkeleton />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden custom-scroll">
      <BgLayer />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="fixed top-4 right-4 z-50">
          <NavDrawer />
        </div>

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10"
        >
          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight uppercase leading-none mb-1"
            style={{
              background:     "linear-gradient(100deg, #94a3b8 0%, #e2e8f0 35%, #38bdf8 55%, #94a3b8 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              animation: "shimmer 5s linear infinite",
            }}
          >
            {t?.objectifsPage?.title ?? "Objectifs"}
          </h1>
          <div className="h-px w-40 bg-gradient-to-r from-sky-500/50 via-violet-500/40 to-transparent mb-7" />
          <ObjectifStats activeCount={active.length} doneCount={done.length} avgScore={avgScore} t={t} />
        </motion.header>

        {/* ── TOOLBAR : filters + sort ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-3 mb-6 flex-wrap"
        >
          <ObjectifFilters active={filter} onChange={setFilter} counts={counts} t={t} />

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                border transition-all duration-200
                ${showSort
                  ? "bg-slate-700/60 border-slate-600/60 text-slate-200"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600"}`}
            >
              <ArrowUpDown size={11} />
              {SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1     }}
                  exit={{ opacity: 0,    y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-30 w-44
                    rounded-xl border border-slate-700/60 bg-slate-900/95
                    backdrop-blur-xl shadow-xl overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortKey(opt.key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold
                        transition-colors duration-150
                        ${sortKey === opt.key
                          ? "text-sky-300 bg-sky-500/10"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── ACTIVE GRID ── */}
        {filtered.length === 0 ? (
          <ObjectifEmpty hasFilter={filter !== "all"} onAdd={() => setShowModal(true)} t={t} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((obj, idx) => (
                <motion.div
                  key={obj.id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: obj.id.startsWith(OPTIMISTIC_PREFIX) ? 0.6 : 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: idx * 0.06, duration: 0.38, ease: "easeOut" }}
                >
                  <ObjectifCard
                    obj={obj}
                    onUpdate={updateProgression}
                    onDelete={deleteObjectif}
                    showConfetti={confettiId === obj.id}
                    onConfettiDone={() => setConfettiId(null)}
                    t={t}
                    locale={locale}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── TROPHIES ── */}
        <ObjectifTrophies objectifs={done} t={t} locale={locale} />
      </div>

      {/* ── FAB ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 240, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center
          rounded-2xl bg-sky-500 text-slate-950 shadow-xl"
        style={{ width: 52, height: 52, boxShadow: "0 0 24px rgba(56,189,248,0.4), 0 0 48px rgba(56,189,248,0.12)" }}
      >
        <motion.span animate={{ rotate: showModal ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={22} strokeWidth={3} />
        </motion.span>
      </motion.button>

      {/* FAB pulse */}
      <motion.div
        animate={{ scale: [1, 1.55, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-8 right-8 z-30 rounded-2xl bg-sky-500/20 pointer-events-none"
        style={{ width: 52, height: 52 }}
      />

      {/* ── MODAL ── */}
      <ObjectifModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={createObjectif}
        t={t}
      />
      
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .custom-scroll { scrollbar-width: thin; scrollbar-color: #1e293b transparent; }
        .custom-scroll::-webkit-scrollbar       { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: #1e293b; border-radius: 99px; }
      `}</style>
    </div>
   
  );
}

// ─── Background layer ─────────────────────────────────────────────────────────
function BgLayer() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize:  "52px 52px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 0% 0%, rgba(56,189,248,0.05) 0%, transparent 70%)" }}
      />
    </>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function normKeyMatch(raw: string, cat: string): boolean {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return norm(raw) === norm(cat);
}