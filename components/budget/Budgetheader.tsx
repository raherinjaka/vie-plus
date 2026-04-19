"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, RotateCcw, Clock, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import type { BudgetConfig } from "./Budgetsetup.tsx";

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  config: BudgetConfig;
  onReset: () => void;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────
function useCountdown(dateFin: string) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0, secs: 0, pct: 100, expired: false });

  useEffect(() => {
    const dateDebut = new Date(dateFin).getTime() - (new Date(dateFin).getTime() - Date.now());
    const update = () => {
      const now     = Date.now();
      const end     = new Date(dateFin).getTime();
      const diff    = end - now;
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, mins: 0, secs: 0, pct: 0, expired: true });
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      // pct = temps restant / durée totale
      const total   = end - (new Date(dateFin).getTime() - diff - 86400000); // approx
      const pct     = Math.max(0, Math.min(100, (diff / (end - Date.now() + diff)) * 100));
      setRemaining({ days, hours, mins, secs, pct, expired: false });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [dateFin]);

  return remaining;
}

// ─── Confirm Reset Modal ──────────────────────────────────────────────────────
function ResetModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4
        bg-black/80 backdrop-blur-md"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/10
          bg-slate-950/98 backdrop-blur-3xl p-8 shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20
            flex items-center justify-center flex-shrink-0">
            <RotateCcw size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="text-white font-black text-base">Réinitialiser le cycle ?</p>
            <p className="text-slate-500 text-sm mt-1">
              Toutes les opérations seront supprimées et tu pourras démarrer un nouveau cycle.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-500/[0.05] border border-orange-500/15 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />
            <p className="text-orange-300/80 text-xs font-bold">
              Cette action est irréversible. Les données du cycle actuel seront perdues.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-white/10
              text-slate-400 font-bold text-sm hover:border-white/20 hover:text-slate-200 transition-all">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25
              border border-orange-500/25 text-orange-300 font-black text-sm transition-all">
            Réinitialiser
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Flip digit ───────────────────────────────────────────────────────────────
function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08]
        flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-black text-white font-mono tabular-nums absolute"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
        {label}
      </span>
    </div>
  );
}

// ─── BudgetHeader ─────────────────────────────────────────────────────────────
export default function BudgetHeader({ config, onReset }: Props) {
  const [showReset, setShowReset] = useState(false);
  const countdown = useCountdown(config.dateFin);

  const periodeLabel = {
    jours: `${config.periodeDuree} jour${config.periodeDuree > 1 ? "s" : ""}`,
    semaines: `${config.periodeDuree} semaine${config.periodeDuree > 1 ? "s" : ""}`,
    mois: `${config.periodeDuree} mois`,
  }[config.periodeType];

  const dateFin = new Date(config.dateFin).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const urgency = countdown.days === 0 && !countdown.expired;

  return (
    <>
      <AnimatePresence>
        {showReset && (
          <ResetModal
            onConfirm={() => { setShowReset(false); onReset(); }}
            onCancel={() => setShowReset(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        {/* Main header card */}
        <div className={`relative rounded-3xl border overflow-hidden
          ${countdown.expired
            ? "border-orange-500/20 bg-orange-500/[0.04]"
            : urgency
              ? "border-red-500/20 bg-red-500/[0.04]"
              : "border-white/[0.07] bg-white/[0.02]"
          }`}
        >
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r
            from-transparent
            ${countdown.expired ? "via-orange-500/60" : urgency ? "via-red-500/60" : "via-cyan-500/40"}
            to-transparent`}
          />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              {/* Left: budget info */}
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700
                    flex items-center justify-center">
                    <Lock size={12} className="text-slate-400" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">
                    Budget verrouillé · {periodeLabel}
                  </span>
                </div>

                <div className="flex items-end gap-3 mb-3">
                  <p className="text-4xl font-black text-white font-mono tracking-tight">
                    {config.montant.toLocaleString()}
                  </p>
                  <p className="text-lg font-black text-slate-500 mb-1 font-mono">Ar</p>
                </div>

                <div className="flex items-center gap-2">
                  {countdown.expired ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      bg-orange-500/10 border border-orange-500/20">
                      <CheckCircle size={11} className="text-orange-400" />
                      <span className="text-[10px] font-black text-orange-300">Cycle terminé !</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-300">
                        Fin le {dateFin}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: countdown */}
              <div className="flex flex-col items-center gap-3">
                {countdown.expired ? (
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl
                      bg-orange-500/10 border border-orange-500/20"
                  >
                    <Flame size={18} className="text-orange-400" />
                    <span className="text-orange-300 font-black text-sm">Cycle terminé</span>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Digit value={countdown.days} label="Jours" />
                      <span className="text-slate-600 font-black text-xl mb-5">:</span>
                      <Digit value={countdown.hours} label="Heures" />
                      <span className="text-slate-600 font-black text-xl mb-5">:</span>
                      <Digit value={countdown.mins} label="Mins" />
                      <span className="text-slate-600 font-black text-xl mb-5">:</span>
                      <Digit value={countdown.secs} label="Secs" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} className={urgency ? "text-red-400" : "text-slate-600"} />
                      <span className={`text-[9px] font-bold uppercase tracking-widest
                        ${urgency ? "text-red-400" : "text-slate-600"}`}>
                        {urgency ? "Dernières heures !" : "Temps restant"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Right: reset button */}
              <div className="flex sm:flex-col items-center gap-2 sm:self-start">
                <button
                  onClick={() => setShowReset(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
                    border border-white/[0.08] bg-white/[0.02]
                    text-slate-500 hover:text-orange-300 hover:border-orange-500/20
                    hover:bg-orange-500/[0.05] font-bold text-xs
                    transition-all duration-200 group"
                >
                  <RotateCcw size={13} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                  <span>Nouveau cycle</span>
                </button>
              </div>
            </div>

            {/* Progress bar time */}
            {!countdown.expired && (
              <div className="mt-5">
                <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full transition-colors duration-1000
                      ${urgency ? "bg-red-500" : "bg-cyan-400"}`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${countdown.pct}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      boxShadow: urgency
                        ? "0 0 8px rgba(248,113,113,0.5)"
                        : "0 0 8px rgba(34,211,238,0.4)",
                    }}
                  />
                </div>
                <p className="text-right text-[9px] font-mono text-slate-600 mt-1">
                  {Math.round(countdown.pct)}% du temps restant
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}