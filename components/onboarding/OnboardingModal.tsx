"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Wallet, Target, CheckSquare, FileText,
  ChevronRight, ChevronLeft, X, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step {
  id:          number;
  icon:        React.ElementType;
  titleKey:    string;
  descKey:     string;
  color:       string;
  bg:          string;
  border:      string;
  glow:        string;
  imagePath:   string; // ← remplace par ton screenshot plus tard
  imageAlt:    string;
  hasImage:    boolean; // ← passe à true quand tu as le screenshot
}

interface Props {
  onComplete: () => void;
}

// ─── Steps config ─────────────────────────────────────────────────────────────
// 🖼️ Pour ajouter un screenshot :
//    1. Mets ton image dans public/onboarding/step-X.png
//    2. Passe hasImage: true pour cette étape
//    3. L'image s'affichera automatiquement dans le cadre téléphone

const STEPS: Step[] = [
  {
    id:        1,
    icon:      Wallet,
    titleKey:  "onboarding.step1.title",
    descKey:   "onboarding.step1.desc",
    color:     "text-cyan-300",
    bg:        "bg-cyan-500/10",
    border:    "border-cyan-500/25",
    glow:      "rgba(34,211,238,0.2)",
    imagePath: "/onboarding/step-1.png",
    imageAlt:  "Page budget",
    hasImage:  false, // ← passe à true quand tu as le screenshot
  },
  {
    id:        2,
    icon:      Target,
    titleKey:  "onboarding.step2.title",
    descKey:   "onboarding.step2.desc",
    color:     "text-violet-300",
    bg:        "bg-violet-500/10",
    border:    "border-violet-500/25",
    glow:      "rgba(167,139,250,0.2)",
    imagePath: "/onboarding/step-2.png",
    imageAlt:  "Page objectifs",
    hasImage:  false,
  },
  {
    id:        3,
    icon:      CheckSquare,
    titleKey:  "onboarding.step3.title",
    descKey:   "onboarding.step3.desc",
    color:     "text-emerald-300",
    bg:        "bg-emerald-500/10",
    border:    "border-emerald-500/25",
    glow:      "rgba(52,211,153,0.2)",
    imagePath: "/onboarding/step-3.png",
    imageAlt:  "Page tâches",
    hasImage:  false,
  },
  {
    id:        4,
    icon:      FileText,
    titleKey:  "onboarding.step4.title",
    descKey:   "onboarding.step4.desc",
    color:     "text-orange-300",
    bg:        "bg-orange-500/10",
    border:    "border-orange-500/25",
    glow:      "rgba(251,146,60,0.2)",
    imagePath: "/onboarding/step-4.png",
    imageAlt:  "Export PDF",
    hasImage:  false,
  },
];

// ─── Phone Frame ──────────────────────────────────────────────────────────────
// Le cadre téléphone qui affiche soit le screenshot, soit un placeholder
function PhoneFrame({ step }: { step: Step }) {
  const Icon = step.icon;

  return (
    <div className="relative flex-shrink-0 w-[140px] sm:w-[160px]">
      {/* Cadre téléphone SVG */}
      <div
        className="relative rounded-[28px] border-[3px] overflow-hidden
          bg-slate-900 shadow-2xl"
        style={{
          borderColor: step.glow.replace("0.2", "0.5"),
          boxShadow: `0 0 30px ${step.glow}, 0 20px 40px rgba(0,0,0,0.5)`,
          aspectRatio: "9/19",
        }}
      >
        {/* Encoche haut */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10
          w-12 h-[5px] bg-slate-800 rounded-full" />

        {/* Screenshot ou placeholder */}
        {step.hasImage ? (
          <Image
            src={step.imagePath}
            alt={step.imageAlt}
            fill
            className="object-cover object-top"
            sizes="160px"
          />
        ) : (
          /* Placeholder stylé en attendant le vrai screenshot */
          <div className={`absolute inset-0 flex flex-col items-center justify-center
            gap-3 ${step.bg} p-4`}>

            {/* Barre de statut simulée */}
            <div className="absolute top-6 left-0 right-0 px-3 flex justify-between">
              <div className="h-1.5 w-8 rounded-full bg-white/10" />
              <div className="h-1.5 w-6 rounded-full bg-white/10" />
            </div>

            {/* Icône centrale */}
            <div className={`w-12 h-12 rounded-2xl ${step.bg} border ${step.border}
              flex items-center justify-center`}
              style={{ boxShadow: `0 0 20px ${step.glow}` }}
            >
              <Icon size={22} className={step.color} />
            </div>

            {/* Lignes simulant du contenu */}
            <div className="w-full space-y-1.5 px-1">
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i}
                  className="h-1.5 rounded-full bg-white/[0.08]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            {/* Badge "Screenshot à venir" */}
            <div className={`mt-1 px-2 py-1 rounded-lg border ${step.border}
              ${step.bg} text-center`}>
              <p className={`text-[8px] font-bold ${step.color} opacity-60`}>
                Screenshot
              </p>
              <p className={`text-[7px] ${step.color} opacity-40`}>
                à venir
              </p>
            </div>

            {/* Bottom nav simulée */}
            <div className="absolute bottom-3 left-0 right-0 px-3
              flex justify-around">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className={`h-1 rounded-full ${i === 0 ? step.color.replace("text-", "bg-") + " opacity-60" : "bg-white/10"}`}
                  style={{ width: i === 0 ? "20px" : "12px" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reflet sous le téléphone */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2
        w-3/4 h-4 rounded-full blur-md opacity-30"
        style={{ backgroundColor: step.glow.replace("0.2", "1") }}
      />
    </div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ current, total, steps }: {
  current: number; total: number; steps: Step[];
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          animate={{
            width:   i === current ? 20 : 6,
            opacity: i <= current ? 1 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
          style={{
            backgroundColor: i <= current
              ? step.color.replace("text-", "#").replace("-300", "")
              : "#334155",
          }}
        />
      ))}
    </div>
  );
}

// ─── OnboardingModal ──────────────────────────────────────────────────────────
export default function OnboardingModal({ onComplete }: Props) {
  const { t } = useLanguage() as any;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const step      = STEPS[current];
  const Icon      = step.icon;
  const isFirst   = current === 0;
  const isLast    = current === STEPS.length - 1;

  const goNext = () => {
    if (isLast) { onComplete(); return; }
    setDirection(1);
    setCurrent((v) => v + 1);
  };

  const goPrev = () => {
    if (isFirst) return;
    setDirection(-1);
    setCurrent((v) => v - 1);
  };

  const skip = () => onComplete();

  // Clés de traduction avec fallback
  const title = t?.onboarding?.steps?.[current]?.title
    ?? ["Mon Budget", "Mes Objectifs", "Mes Tâches", "Export PDF"][current];
  const desc = t?.onboarding?.steps?.[current]?.desc
    ?? [
      "Suis tes dépenses, configure ton budget et visualise ton évolution jour après jour.",
      "Crée tes objectifs personnels, suis ta progression et célèbre tes réussites.",
      "Organise tes tâches quotidiennes et reste productif chaque jour.",
      "Génère un relevé PDF complet de tes dépenses à partager avec tes parents.",
    ][current];

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4
      bg-slate-950/80 backdrop-blur-md">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${step.glow.replace("0.2", "0.3")}, transparent 70%)`,
          }}
        />
      </div>

      {/* Card principale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative w-full max-w-lg z-10"
      >
        <div className={`relative rounded-3xl border ${step.border}
          bg-slate-950/98 backdrop-blur-3xl shadow-2xl overflow-hidden`}
          style={{ boxShadow: `0 0 60px ${step.glow}, 0 20px 60px rgba(0,0,0,0.6)` }}
        >
          {/* Ligne colorée en haut */}
          <motion.div
            key={`bar-${current}`}
            className="absolute top-0 left-0 h-[2px] rounded-full"
            style={{ backgroundColor: step.color.includes("cyan") ? "#22d3ee"
              : step.color.includes("violet") ? "#a78bfa"
              : step.color.includes("emerald") ? "#34d399"
              : "#fb923c"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Bouton skip (étape 1 uniquement) */}
          {isFirst && (
            <button onClick={skip}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                rounded-xl text-slate-600 hover:text-slate-300 hover:bg-white/5
                transition-all z-10">
              <X size={16} />
            </button>
          )}

          {/* Contenu */}
          <div className="p-6 sm:p-8">

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-7 h-7 rounded-xl ${step.bg} border ${step.border}
                flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={step.color} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                {t?.onboarding?.stepLabel ?? "Étape"} {current + 1} / {STEPS.length}
              </span>
            </div>

            {/* Layout : image + texte */}
            <div className="flex items-center gap-6 sm:gap-8">

              {/* Phone frame */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`phone-${current}`}
                  initial={{ opacity: 0, x: direction * 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -direction * 30, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhoneFrame step={step} />
                </motion.div>
              </AnimatePresence>

              {/* Texte */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${current}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="space-y-3"
                  >
                    {/* Numéro stylé */}
                    <span className={`text-5xl font-black font-mono ${step.color} opacity-20`}>
                      0{current + 1}
                    </span>

                    {/* Titre */}
                    <h2 className="text-xl font-black text-white leading-tight -mt-2">
                      {title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer : dots + boutons */}
            <div className="flex items-center justify-between mt-6 pt-5
              border-t border-white/[0.06]">

              {/* Progress dots */}
              <ProgressDots current={current} total={STEPS.length} steps={STEPS} />

              {/* Boutons navigation */}
              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button onClick={goPrev}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl
                      bg-white/[0.04] border border-white/[0.08] text-slate-400
                      hover:text-slate-200 hover:border-white/15 font-bold text-sm
                      transition-all active:scale-95">
                    <ChevronLeft size={15} />
                    {t?.onboarding?.back ?? "Retour"}
                  </button>
                )}

                <motion.button
                  onClick={goNext}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl
                    font-bold text-sm transition-all
                    ${isLast
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : `${step.bg} border ${step.border} ${step.color}`
                    }`}
                >
                  {isLast ? (
                    <>
                      <Sparkles size={14} />
                      {t?.onboarding?.start ?? "C'est parti !"}
                    </>
                  ) : (
                    <>
                      {t?.onboarding?.next ?? "Suivant"}
                      <ChevronRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Hint skip sous la card */}
        {isFirst && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-center mt-3 text-[11px] text-slate-700 cursor-pointer
              hover:text-slate-500 transition-colors"
            onClick={skip}
          >
            {t?.onboarding?.skipHint ?? "Passer l'introduction"}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}