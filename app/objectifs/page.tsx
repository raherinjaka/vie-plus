"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { supabase } from "@/lib/supabase";
import NavDrawer from "@/components/NavDrawer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "Projet" | "Santé" | "Argent" | "Études";

interface Objectif {
  id: string;
  user_id: string;
  titre: string;
  categorie: Category;
  progression: number; // 0–100
  deadline: string | null; // ISO date string
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function daysLeft(deadline: string | null): { text: string; color: string } | null {
  if (!deadline) return null;
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return { text: "Délai dépassé", color: "text-red-400" };
  if (diff === 0) return { text: "Aujourd'hui !", color: "text-orange-400" };
  if (diff <= 3) return { text: `${diff} jour${diff > 1 ? "s" : ""} restant${diff > 1 ? "s" : ""}`, color: "text-red-400" };
  if (diff <= 7) return { text: `${diff} jours restants`, color: "text-yellow-400" };
  return { text: `${diff} jours restants`, color: "text-emerald-400" };
}

const CATEGORY_META: Record<Category, { color: string; bg: string; icon: string }> = {
  Projet:  { color: "text-violet-300",  bg: "bg-violet-500/20 border-violet-500/40",  icon: "⚡" },
  Santé:   { color: "text-emerald-300", bg: "bg-emerald-500/20 border-emerald-500/40", icon: "💚" },
  Argent:  { color: "text-yellow-300",  bg: "bg-yellow-500/20 border-yellow-500/40",  icon: "💰" },
  Études:  { color: "text-cyan-300",    bg: "bg-cyan-500/20 border-cyan-500/40",      icon: "🧠" },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [value]);
  return <span className="font-mono">{display}{suffix}</span>;
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const isComplete = pct >= 100;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        {/* Track */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
        {/* Progress */}
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={isComplete ? "#22d3ee" : pct > 60 ? "#0ea5e9" : pct > 30 ? "#6366f1" : "#334155"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          style={isComplete ? { filter: "drop-shadow(0 0 6px #22d3ee) drop-shadow(0 0 14px #06b6d4)" } : {}}
        />
      </svg>
      <span
        className={`absolute text-lg font-mono font-bold transition-colors duration-500 ${
          isComplete ? "text-cyan-300" : "text-slate-200"
        }`}
      >
        {pct}%
      </span>
    </div>
  );
}

// ─── Sparkle Particle ─────────────────────────────────────────────────────────
function Sparkle({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.span
      initial={{ scale: 0, opacity: 1, y: 0, x: 0 }}
      animate={{ scale: 1.5, opacity: 0, y: -24, x: (Math.random() - 0.5) * 30 }}
      transition={{ duration: 0.7 }}
      className="pointer-events-none absolute text-cyan-300 text-sm z-50 select-none"
    >
      ✦
    </motion.span>
  );
}

// ─── Gyroscopic Card ──────────────────────────────────────────────────────────
function GyroCard({ children, completed }: { children: React.ReactNode; completed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 200, damping: 25 });
  const sRy = useSpring(ry, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(sRx, [-1, 1], ["8deg", "-8deg"]);
  const rotateY = useTransform(sRy, [-1, 1], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rx.set(ny);
    ry.set(nx);
  };
  const handleMouseLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 600 }}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-default
        ${completed
          ? "border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 to-slate-900/60"
          : "border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60"
        }
        backdrop-blur-xl shadow-xl
        hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-2xl
      `}
    >
      {/* Glow border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: "inset 0 0 20px rgba(34,211,238,0.08), 0 0 30px rgba(34,211,238,0.06)" }}
      />
      {children}
    </motion.div>
  );
}

// ─── Glass Block (stats) ──────────────────────────────────────────────────────
function GlassBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-xl px-6 py-5 shadow-inner">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
      <span className="text-3xl font-bold text-slate-100">{children}</span>
    </div>
  );
}

// ─── Confetti Burst ───────────────────────────────────────────────────────────
function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * 360,
    color: ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#f472b6"][i % 5],
  }));
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 80,
            y: Math.sin((p.angle * Math.PI) / 180) * 80,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ObjectifsPage() {
  const router = useRouter();
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: "", categorie: "Projet" as Category, deadline: "" });

  // Detail panel
  const [detailId, setDetailId] = useState<string | null>(null);

  // Sparkles per card
  const [sparkles, setSparkles] = useState<Record<string, number[]>>({});

  // Confetti
  const [confettiId, setConfettiId] = useState<string | null>(null);

  // Modal state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // ── Auth Check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);
      await fetchObjectifs(session.user.id);
      setLoading(false);
    })();
  }, []);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchObjectifs = async (uid: string) => {
    const { data } = await supabase
      .from("objectifs")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setObjectifs(data);
  };

  // ── Update Progression ──────────────────────────────────────────────────────
  const updateProgression = useCallback(async (id: string, delta: number) => {
    const obj = objectifs.find((o) => o.id === id);
    if (!obj) return;
    const newPct = Math.min(100, Math.max(0, obj.progression + delta));

    // Optimistic update
    setObjectifs((prev) =>
      prev.map((o) => o.id === id ? { ...o, progression: newPct } : o)
    );

    // Sparkle
    setSparkles((prev) => ({ ...prev, [id]: [...(prev[id] || []), Date.now()] }));

    // Confetti at 100
    if (newPct === 100) setConfettiId(id);

    await supabase.from("objectifs").update({ progression: newPct }).eq("id", id);
  }, [objectifs]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const createObjectif = async () => {
    if (!form.titre.trim()) return;
    setCreating(true);
    setCreateError(null);

    // Récupère la session en temps réel (évite le bug de race condition sur userId)
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id ?? userId;
    if (!uid) { setCreateError("Session expirée, reconnecte-toi."); setCreating(false); return; }

    const { data, error } = await supabase
      .from("objectifs")
      .insert({
        user_id: uid,
        titre: form.titre.trim(),
        categorie: form.categorie,
        progression: 0,
        deadline: form.deadline || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      setCreateError(`Erreur : ${error.message}`);
      setCreating(false);
      return;
    }

    if (data) {
      // Mise à jour optimiste directe
      setObjectifs((prev) => [data, ...prev]);
    } else {
      // Fallback : refetch complet si Supabase ne retourne pas data
      await fetchObjectifs(uid);
    }

    setShowModal(false);
    setForm({ titre: "", categorie: "Projet", deadline: "" });
    setCreating(false);
  };

  // ── Derived Stats ────────────────────────────────────────────────────────────
  const active   = objectifs.filter((o) => o.progression < 100);
  const done     = objectifs.filter((o) => o.progression >= 100);
  const avgScore = objectifs.length
    ? Math.round(objectifs.reduce((s, o) => s + o.progression, 0) / objectifs.length)
    : 0;

  // ── Loading / Gate ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-cyan-400"
        />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden custom-scroll">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
      {/* ── BARRE TOP DROITE ── */}
      <div className="fixed top-4 right-4 z-50">
        <NavDrawer />
      </div>

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10"
        >
          {/* Title with shimmer */}
          <div className="relative inline-block mb-8">
            <h1
              className="text-6xl sm:text-7xl font-black tracking-tight uppercase"
              style={{
                background: "linear-gradient(90deg, #94a3b8 0%, #e2e8f0 40%, #22d3ee 60%, #94a3b8 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
              }}
            >
              OBJECTIFS
            </h1>
            <div className="absolute -bottom-2 left-0 h-px w-full bg-gradient-to-r from-cyan-500/60 via-violet-500/60 to-transparent" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassBlock label="En cours">
                <AnimatedNumber value={active.length} />
              </GlassBlock>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <GlassBlock label="Score Global">
                <AnimatedNumber value={avgScore} suffix="%" />
              </GlassBlock>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <GlassBlock label="Succès">
                <AnimatedNumber value={done.length} />
              </GlassBlock>
            </motion.div>
          </div>
        </motion.div>

        {/* ── ACTIVE OBJECTIVES GRID ─────────────────────────────────────────── */}
        {active.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-slate-500 text-center py-20 text-lg"
          >
            Aucun objectif en cours. Lance-toi ! 🚀
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((obj, idx) => {
              const catMeta = CATEGORY_META[obj.categorie];
              const dl = daysLeft(obj.deadline);
              const isDetailOpen = detailId === obj.id;
              return (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.5, ease: "easeOut" }}
                >
                  <GyroCard completed={false}>
                    <div className="relative p-6 flex flex-col gap-4">
                      {/* Sparkles */}
                      <div className="absolute top-4 right-16 pointer-events-none">
                        {(sparkles[obj.id] || []).map((ts) => (
                          <Sparkle key={ts} onDone={() =>
                            setSparkles((prev) => ({
                              ...prev,
                              [obj.id]: (prev[obj.id] || []).filter((t) => t !== ts),
                            }))
                          } />
                        ))}
                      </div>

                      {/* Confetti */}
                      {confettiId === obj.id && (
                        <ConfettiBurst onDone={() => setConfettiId(null)} />
                      )}

                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${catMeta.bg} ${catMeta.color} mb-2`}>
                            {catMeta.icon} {obj.categorie}
                          </span>
                          <h3 className="text-slate-100 font-bold text-lg leading-tight line-clamp-2">
                            {obj.titre}
                          </h3>
                        </div>
                        <ProgressRing pct={obj.progression} />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProgression(obj.id, 5)}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 active:scale-95"
                        >
                          +5%
                        </button>
                        <button
                          onClick={() => updateProgression(obj.id, 10)}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 active:scale-95"
                        >
                          +10%
                        </button>
                        <button
                          onClick={() => setDetailId(isDetailOpen ? null : obj.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                            isDetailOpen
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          {isDetailOpen ? "Fermer" : "Détails"}
                        </button>
                      </div>

                      {/* Detail panel */}
                      <AnimatePresence>
                        {isDetailOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-slate-700/50 pt-3 mt-1 space-y-1 text-sm text-slate-400">
                              <p>
                                <span className="text-slate-500">Deadline : </span>
                                {obj.deadline
                                  ? new Date(obj.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                                  : "Non définie"}
                              </p>
                              <p>
                                <span className="text-slate-500">Créé le : </span>
                                {new Date(obj.created_at).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Time indicator */}
                      {dl && (
                        <p className={`text-xs font-mono font-semibold ${dl.color} -mt-1`}>
                          ⏱ {dl.text}
                        </p>
                      )}
                    </div>
                  </GyroCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── TROPHY WALL ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {done.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-black uppercase tracking-widest text-slate-300">
                  Objectifs Accomplis
                </h2>
                <span className="text-2xl">🏆</span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {done.map((obj, idx) => {
                  const catMeta = CATEGORY_META[obj.categorie];
                  return (
                    <motion.div
                      key={obj.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.07, duration: 0.4 }}
                    >
                      <GyroCard completed>
                        <div className="p-5 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg font-bold flex-shrink-0">
                            ✓
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-semibold ${catMeta.color}`}>
                              {catMeta.icon} {obj.categorie}
                            </span>
                            <p className="text-slate-200 font-semibold truncate">{obj.titre}</p>
                            <p className="text-xs text-cyan-400 font-mono">100% — Complété</p>
                          </div>
                        </div>
                      </GyroCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ── FAB ──────────────────────────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-cyan-500 text-slate-950 text-2xl font-bold shadow-lg flex items-center justify-center"
        style={{ boxShadow: "0 0 20px rgba(34,211,238,0.5), 0 0 40px rgba(34,211,238,0.2)" }}
      >
        <motion.span
          animate={{ rotate: showModal ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </motion.button>

      {/* Pulse ring on FAB */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-8 right-8 z-30 w-14 h-14 rounded-full bg-cyan-500/30 pointer-events-none"
        style={{ transform: "translate(0,0)" }}
      />

      {/* ── MODAL ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md"
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-md rounded-3xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-8 space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-wider text-slate-100">
                  Nouvel objectif
                </h2>

                {/* Title input */}
                <div className="relative">
                  <input
                    type="text"
                    value={form.titre}
                    onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
                    placeholder="Nom de l'objectif…"
                    className="w-full bg-transparent text-slate-100 text-lg font-medium pb-2 border-b border-slate-700 focus:border-cyan-500 outline-none transition-colors duration-300 placeholder:text-slate-600"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {(["Projet", "Santé", "Argent", "Études"] as Category[]).map((cat) => {
                    const m = CATEGORY_META[cat];
                    const selected = form.categorie === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setForm((f) => ({ ...f, categorie: cat }))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                          selected
                            ? `${m.bg} ${m.color} border-transparent scale-105`
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {m.icon} {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Date */}
                <div className="relative">
                  <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none transition-colors duration-300 [color-scheme:dark]"
                  />
                </div>

                {/* Error */}
                {createError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2"
                  >
                    {createError}
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setShowModal(false); setCreateError(null); }}
                    disabled={creating}
                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 font-semibold hover:border-slate-500 transition-colors disabled:opacity-40"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createObjectif}
                    disabled={!form.titre.trim() || creating}
                    className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full"
                        />
                        Création…
                      </>
                    ) : "Créer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── GLOBAL STYLES ────────────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
        .custom-scroll::-webkit-scrollbar       { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
}