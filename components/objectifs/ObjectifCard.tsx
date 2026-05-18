"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from "framer-motion";
import { Trash2, ChevronDown, RotateCcw } from "lucide-react";
import { getCatMeta, daysLeft, normKey, type Objectif } from "./types";

// ─── Circular Progress ────────────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r    = 28;
  const circ = 2 * Math.PI * r;
  const off  = circ - (pct / 100) * circ;
  const done = pct >= 100;
  const stroke = done ? "#34d399" : pct > 60 ? "#38bdf8" : pct > 30 ? "#818cf8" : "#334155";

  return (
    <div className="relative w-[72px] h-[72px] flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none"
          stroke={stroke} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          className="transition-all duration-700 ease-out"
          style={done ? { filter: "drop-shadow(0 0 5px #34d399)" } : {}}
        />
      </svg>
      <span className={`absolute text-sm font-black tabular-nums ${done ? "text-emerald-300" : "text-slate-200"}`}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Sparkle ─────────────────────────────────────────────────────────────────
function Sparkle({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 650); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.span
      initial={{ scale: 0, opacity: 1, y: 0, x: 0 }}
      animate={{ scale: 1.4, opacity: 0, y: -20, x: (Math.random() - 0.5) * 28 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="pointer-events-none absolute text-sky-300 text-xs z-50 select-none"
    >✦</motion.span>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    color: ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"][i % 5],
  }));
  useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
      {particles.map((p, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos((p.angle * Math.PI) / 180) * 70, y: Math.sin((p.angle * Math.PI) / 180) * 70, opacity: 0, scale: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ─── Tilt Card wrapper ────────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx  = useMotionValue(0);
  const ry  = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sRy = useSpring(ry, { stiffness: 180, damping: 22 });
  const rotX = useTransform(sRx, [-1, 1], ["6deg", "-6deg"]);
  const rotY = useTransform(sRy, [-1, 1], ["-6deg", "6deg"]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rx.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
        ry.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      className="group relative rounded-2xl border border-slate-700/50
        bg-gradient-to-br from-slate-900/90 to-slate-800/50
        backdrop-blur-lg shadow-lg cursor-default
        hover:border-slate-600/70 transition-all duration-300"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 60%)" }}
      />
      {children}
    </motion.div>
  );
}

// ─── Delete confirmation avec countdown undo ──────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, t }: {
  onConfirm: () => void;
  onCancel: () => void;
  t: any;
}) {
  const DURATION = 4;
  const [countdown, setCountdown] = useState(DURATION);

  useEffect(() => {
    if (countdown <= 0) { onConfirm(); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, onConfirm]);

  const circumference = 2 * Math.PI * 12;
  const dashOffset    = circumference * (1 - countdown / DURATION);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl
        border border-rose-500/20 bg-rose-500/5">
        {/* Countdown ring */}
        <div className="relative w-8 h-8 flex-shrink-0">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="12" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="12" fill="none" stroke="#f87171" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-rose-400">
            {countdown}
          </span>
        </div>

        <p className="flex-1 text-[11px] text-slate-400 leading-snug">
          {t?.objectifsPage?.card?.deleteConfirmMsg ?? "Suppression automatique…"}
        </p>

        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
            text-xs font-semibold text-slate-300 border border-slate-600/60
            bg-slate-800 hover:border-slate-500 hover:text-white
            transition-all duration-200 active:scale-95"
        >
          <RotateCcw size={10} />
          {t?.objectifsPage?.card?.undo ?? "Annuler"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────
interface Props {
  obj: Objectif;
  onUpdate: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  showConfetti: boolean;
  onConfettiDone: () => void;
  t: any;
  locale: string;
}

export default function ObjectifCard({
  obj, onUpdate, onDelete, showConfetti, onConfettiDone, t, locale,
}: Props) {
  const [open,       setOpen]       = useState(false);
  const [sparkles,   setSparkles]   = useState<number[]>([]);
  const [confirming, setConfirming] = useState(false);

  const catMeta     = getCatMeta(obj.categorie);
  const catLabelKey = normKey(obj.categorie);
  const dl          = daysLeft(obj.deadline, t);

  const handleUpdate          = (delta: number) => {
    if (delta > 0) setSparkles((s) => [...s, Date.now()]);
    onUpdate(obj.id, delta);
  };
  const handleDeleteRequest   = () => { setConfirming(true); setOpen(true); };
  const handleDeleteCancel    = () => setConfirming(false);
  const handleDeleteConfirm   = () => onDelete(obj.id);

  const btnBase = "flex-1 py-2 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95";
  const btnPos  = "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-sky-500/15 hover:text-sky-300 hover:border-sky-500/40";
  const btnNeg  = "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30";

  return (
    <TiltCard>
      <div className="relative p-5 flex flex-col gap-4">
        {/* Sparkles anchor */}
        <div className="absolute top-4 right-16 pointer-events-none">
          {sparkles.map((ts) => (
            <Sparkle key={ts} onDone={() => setSparkles((s) => s.filter((x) => x !== ts))} />
          ))}
        </div>
        {showConfetti && <ConfettiBurst onDone={onConfettiDone} />}

        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider
              px-2 py-0.5 rounded-lg border ${catMeta.bg} ${catMeta.color}`}>
              {catMeta.icon} {t?.objectifsPage?.categories?.[catLabelKey] ?? catMeta.label}
            </span>
            <h3 className="text-slate-100 font-bold text-base leading-snug line-clamp-2">
              {obj.titre}
            </h3>
            {dl && (
              <span className={`inline-block text-[10px] font-mono font-semibold ${dl.color}`}>
                ⏱ {dl.text}
              </span>
            )}
          </div>
          <ProgressRing pct={obj.progression} />
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${obj.progression}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => handleUpdate(-10)} className={`${btnBase} ${btnNeg}`}>−10%</button>
          <button onClick={() => handleUpdate(-5)}  className={`${btnBase} ${btnNeg}`}>−5%</button>
          <button onClick={() => handleUpdate(5)}   className={`${btnBase} ${btnPos}`}>+5%</button>
          <button onClick={() => handleUpdate(10)}  className={`${btnBase} ${btnPos}`}>+10%</button>

          <button
            onClick={() => { setOpen((v) => !v); if (open) setConfirming(false); }}
            className={`px-2.5 py-2 rounded-xl border transition-all duration-200 active:scale-95
              ${open
                ? "bg-slate-700/60 border-slate-600/60 text-slate-200"
                : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:border-slate-600"}`}
          >
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="block">
              <ChevronDown size={13} />
            </motion.span>
          </button>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-700/40 pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t?.objectifsPage?.card?.deadlineLabel ?? "Deadline"}</span>
                  <span className="text-slate-300 font-medium">
                    {obj.deadline
                      ? new Date(obj.deadline).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
                      : <span className="text-slate-600 italic">{t?.objectifsPage?.card?.noDeadline ?? "Aucune"}</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t?.objectifsPage?.card?.createdAt ?? "Créé le"}</span>
                  <span className="text-slate-400">{new Date(obj.created_at).toLocaleDateString(locale)}</span>
                </div>

                {/* Delete zone */}
                <AnimatePresence mode="wait">
                  {confirming ? (
                    <DeleteConfirm
                      key="confirm"
                      onConfirm={handleDeleteConfirm}
                      onCancel={handleDeleteCancel}
                      t={t}
                    />
                  ) : (
                    <motion.button
                      key="delete-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleDeleteRequest}
                      className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
                        text-xs font-semibold text-rose-400 border border-rose-500/20
                        bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/30
                        transition-all duration-200 active:scale-[0.98]"
                    >
                      <Trash2 size={12} />
                      {t?.objectifsPage?.card?.delete ?? "Supprimer l'objectif"}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
}