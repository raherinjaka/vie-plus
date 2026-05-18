"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Clock, Calendar, Zap, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export type PeriodeType = "jours" | "semaines" | "mois";

export interface BudgetConfig {
  montant: number;
  periodeType: PeriodeType;
  periodeDuree: number;
  dateDebut: string;
  dateFin: string;
}

interface Props {
  onConfirm: (config: BudgetConfig) => void;
}

// ─── Période options ──────────────────────────────────────────────────────────
const PERIODES = [
  {
    type: "jours" as PeriodeType,
    labelKey: "jours",
    icon: Zap,
    descKey: "joursDesc",
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    glow: "rgba(34,211,238,0.15)",
    options: [1, 3, 5, 7],
  },
  {
    type: "semaines" as PeriodeType,
    labelKey: "semaines",
    icon: Calendar,
    descKey: "semainesDesc",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    glow: "rgba(167,139,250,0.15)",
    options: [1, 2, 3, 4],
  },
  {
    type: "mois" as PeriodeType,
    labelKey: "mois",
    icon: Clock,
    descKey: "moisDesc",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    glow: "rgba(52,211,153,0.15)",
    options: [1, 2, 3, 6],
  },
];

// ─── Compute dateFin ──────────────────────────────────────────────────────────
function computeDateFin(type: PeriodeType, duree: number): string {
  const d = new Date();
  if (type === "jours")    d.setDate(d.getDate() + duree);
  if (type === "semaines") d.setDate(d.getDate() + duree * 7);
  if (type === "mois")     d.setMonth(d.getMonth() + duree);
  return d.toISOString();
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDot({ active, done, n }: { active: boolean; done: boolean; n: number }) {
  return (
    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center
      text-xs font-black border transition-all duration-400
      ${done
        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
        : active
          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
          : "bg-white/[0.03] border-white/10 text-slate-600"
      }`}
    >
      {done ? <Check size={13} /> : n}
    </div>
  );
}

// ─── BudgetSetup ──────────────────────────────────────────────────────────────
export default function BudgetSetup({ onConfirm }: Props) {
  const { t } = useLanguage() as any;

  const [step, setStep]             = useState<1 | 2>(1);
  const [montant, setMontant]       = useState("");
  const [periodeType, setPeriode]   = useState<PeriodeType>("semaines");
  const [duree, setDuree]           = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const selectedPeriode = PERIODES.find((p) => p.type === periodeType)!;
  const montantNum      = Number(montant);
  const step1Valid      = montantNum > 0;
  const step2Valid      = duree > 0;

  const locale = t?.meta?.locale ?? "fr-FR";

  const handleConfirm = async () => {
    if (!step1Valid || !step2Valid) return;
    setSubmitting(true);
    const config: BudgetConfig = {
      montant:      montantNum,
      periodeType,
      periodeDuree: duree,
      dateDebut:    new Date().toISOString(),
      dateFin:      computeDateFin(periodeType, duree),
    };
    await onConfirm(config);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4
      bg-[#080c12]/95 backdrop-blur-xl">

      {/* Background ambiance */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full
          bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full
          bg-violet-500/5 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#22d3ee 1px,transparent 1px),linear-gradient(90deg,#22d3ee 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative w-full max-w-lg"
      >
        <div className="relative rounded-3xl border border-white/[0.08]
          bg-slate-950/95 backdrop-blur-3xl shadow-2xl overflow-hidden">

          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20
                  flex items-center justify-center">
                  <Wallet size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                    {t?.budgetSetup?.brand}
                  </p>
                  <p className="text-sm font-black text-white">
                    {t?.budgetSetup?.newCycle}
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-2">
                <StepDot n={1} active={step === 1} done={step > 1} />
                <div className="w-6 h-px bg-white/10" />
                <StepDot n={2} active={step === 2} done={false} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="title1"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {t?.budgetSetup?.step1?.title}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {t?.budgetSetup?.step1?.subtitle}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="title2"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {t?.budgetSetup?.step2?.title}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {t?.budgetSetup?.step2?.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            <AnimatePresence mode="wait">

              {/* ── STEP 1 : Montant ── */}
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="flex items-end gap-3 p-5 rounded-2xl
                      bg-white/[0.02] border border-white/[0.08]
                      focus-within:border-cyan-500/40 focus-within:bg-cyan-500/[0.03]
                      transition-all duration-300">
                      <input
                        type="number"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        placeholder="0"
                        autoFocus
                        min={1}
                        className="flex-1 bg-transparent text-5xl font-black text-white
                          outline-none placeholder:text-slate-700 font-mono
                          focus:text-cyan-300 transition-colors duration-300 w-full"
                      />
                      <span className="text-xl font-black text-slate-500 pb-1 font-mono">Ar</span>
                    </div>

                    {/* Quick amounts */}
                    <div className="flex gap-2 mt-3">
                      {[5000, 10000, 20000, 50000].map((v) => (
                        <button key={v} onClick={() => setMontant(String(v))}
                          className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all
                            ${montantNum === v
                              ? "bg-cyan-500/15 border-cyan-500/35 text-cyan-300"
                              : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/15"
                            }`}>
                          {v / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {montantNum > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-2xl
                        bg-emerald-500/[0.05] border border-emerald-500/15">
                      <Check size={15} className="text-emerald-400 flex-shrink-0" />
                      <p className="text-sm text-emerald-300 font-bold">
                        {t?.budgetSetup?.step1?.preview
                          ?.replace("{amount}", montantNum.toLocaleString())}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── STEP 2 : Période ── */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Période type */}
                  <div className="grid grid-cols-3 gap-3">
                    {PERIODES.map((p) => {
                      const Icon   = p.icon;
                      const active = periodeType === p.type;
                      return (
                        <button key={p.type}
                          onClick={() => { setPeriode(p.type); setDuree(p.options[0]); }}
                          className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl
                            border transition-all duration-200
                            ${active
                              ? `${p.bg} ${p.border} ${p.color}`
                              : "bg-white/[0.02] border-white/[0.07] text-slate-500 hover:border-white/15 hover:text-slate-300"
                            }`}
                          style={active ? { boxShadow: `0 0 20px ${p.glow}` } : undefined}
                        >
                          <Icon size={20} />
                          <span className="text-xs font-black uppercase tracking-wider">
                            {t?.budgetSetup?.periodes?.[p.labelKey]}
                          </span>
                          {active && (
                            <motion.div layoutId="periode-active"
                              className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-current" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Durée */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">
                      {t?.budgetSetup?.step2?.durationLabel
                        ?.replace("{periode}", t?.budgetSetup?.periodes?.[selectedPeriode.labelKey]?.toLowerCase())}
                    </p>
                    <div className="flex gap-2">
                      {selectedPeriode.options.map((opt) => (
                        <button key={opt} onClick={() => setDuree(opt)}
                          className={`flex-1 py-3 rounded-2xl text-sm font-black border transition-all
                            ${duree === opt
                              ? `${selectedPeriode.bg} ${selectedPeriode.border} ${selectedPeriode.color}`
                              : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:border-white/15 hover:text-slate-300"
                            }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                      {t?.budgetSetup?.summary?.title}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          {t?.budgetSetup?.summary?.lockedBudget}
                        </p>
                        <p className="text-lg font-black text-white font-mono">
                          {montantNum.toLocaleString()} Ar
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          {t?.budgetSetup?.summary?.duration}
                        </p>
                        <p className="text-lg font-black text-white">
                          {duree} {t?.budgetSetup?.periodes?.[selectedPeriode.labelKey]?.toLowerCase()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          {t?.budgetSetup?.summary?.endDate}
                        </p>
                        <p className="text-sm font-bold text-slate-300">
                          {new Date(computeDateFin(periodeType, duree)).toLocaleDateString(locale, {
                            weekday: "long", day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl border border-white/[0.08]
                  text-slate-400 font-bold text-sm hover:border-white/15 hover:text-slate-200
                  transition-all">
                {t?.budgetSetup?.back}
              </button>
            )}

            <button
              onClick={step === 1 ? () => setStep(2) : handleConfirm}
              disabled={step === 1 ? !step1Valid : (!step2Valid || submitting)}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
                font-black text-sm transition-all active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-gradient-to-r from-cyan-500/80 to-cyan-400/80
                hover:from-cyan-400/80 hover:to-cyan-300/80
                text-slate-950 shadow-lg shadow-cyan-500/20"
            >
              {submitting ? (
                <motion.span animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full" />
              ) : (
                <>
                  {step === 1 ? t?.budgetSetup?.next : t?.budgetSetup?.launch}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}