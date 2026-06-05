"use client";
// /onboarding/OnboardingModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Wallet, Target, CheckSquare, FileText,
  ChevronRight, ChevronLeft, X, Sparkles, Globe,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency, CURRENCIES } from "@/context/CurrencyContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step {
  id:        number;
  icon:      React.ElementType;
  titleKey:  string;
  descKey:   string;
  color:     string;
  bg:        string;
  border:    string;
  glow:      string;
  imagePath: string;
  imageAlt:  string;
  hasImage:  boolean;
  isLang?:   boolean;
  isCurrency?: boolean;
}

interface Props {
  onComplete: () => void;
}

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  // ── Étape langue (pas numérotée, invisible dans le compteur) ──
  {
    id:        0,
    icon:      Globe,
    titleKey:  "",
    descKey:   "",
    color:     "text-cyan-300",
    bg:        "bg-cyan-500/10",
    border:    "border-cyan-500/25",
    glow:      "rgba(34,211,238,0.2)",
    imagePath: "",
    imageAlt:  "",
    hasImage:  false,
    isLang:    true,
  },
  {
    id:        -1,
    icon:      Globe,
    titleKey:  "",
    descKey:   "",
    color:     "text-emerald-300",
    bg:        "bg-emerald-500/10",
    border:    "border-emerald-500/25",
    glow:      "rgba(52,211,153,0.2)",
    imagePath: "",
    imageAlt:  "",
    hasImage:  false,
    isLang:    false,
    isCurrency: true,  // ← nouveau marqueur
  },
  // ── Étapes normales 1-4 (inchangées) ──
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
    hasImage:  false,
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

// Étapes normales uniquement (pour le compteur et les progress dots)
const NORMAL_STEPS = STEPS.filter((s) => !s.isLang && !s.isCurrency);

// ─── Language Picker ──────────────────────────────────────────────────────────
function FlagFR({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#1a1f2e"/>
      <rect x="3" y="6" width="6" height="12" rx="1" fill="#002395"/>
      <rect x="9" y="6" width="6" height="12" fill="#EDEDED"/>
      <rect x="15" y="6" width="6" height="12" rx="1" fill="#ED2939"/>
    </svg>
  );
}

function FlagUS({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#B22234"/>
      <rect y="6.5"  width="24" height="1.7" fill="#EDEDED"/>
      <rect y="9.9"  width="24" height="1.7" fill="#EDEDED"/>
      <rect y="13.3" width="24" height="1.7" fill="#EDEDED"/>
      <rect y="16.7" width="24" height="1.7" fill="#EDEDED"/>
      <rect x="0" y="4" width="11" height="10" rx="1" fill="#3C3B6E"/>
      {[0,1,2,3,4].map((row) =>
        [0,1,2].map((col) => (col === 2 && row % 2 === 1) ? null : (
          <circle
            key={`${row}-${col}`}
            cx={1.8 + col * 3.5 + (row % 2 === 1 ? 1.75 : 0)}
            cy={5.5 + row * 1.8}
            r="0.7"
            fill="#EDEDED"
          />
        ))
      )}
    </svg>
  );
}

function FlagDE({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#1a1f2e"/>
      <rect x="0" y="4"  width="24" height="5.5" rx="1" fill="#000000"/>
      <rect x="0" y="9.5" width="24" height="5"   fill="#DD0000"/>
      <rect x="0" y="14.5" width="24" height="5.5" rx="1" fill="#FFCE00"/>
    </svg>
  );
}

function FlagES({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#AA151B"/>
      <rect y="7" width="24" height="10" fill="#F1BF00"/>
      <rect y="7" width="24" height="2.5" fill="#AA151B"/>
      <rect y="14.5" width="24" height="2.5" fill="#AA151B"/>
    </svg>
  );
}

function FlagMG({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#1a1f2e"/>
      <path d="M3 6h6v12H3z" fill="#EDEDED"/>
      <path d="M9 6h12v6H9z" fill="#FC3D32"/>
      <path d="M9 12h12v6H9z" fill="#007E3A"/>
    </svg>
  );
}

function LanguagePicker({
  lang,
  setLang,
}: {
  lang: string;
  setLang: (l: "fr" | "en" | "de" | "es" | "mg") => void
}) {
  const LANGS = [
    { key: "fr" as const, Flag: FlagFR, label: "Français", sub: "Continuer en français", code: "FR" },
    { key: "en" as const, Flag: FlagUS, label: "English",  sub: "Continue in English",   code: "US" },
    { key: "de" as const, Flag: FlagDE, label: "Deutsch",  sub: "Auf Deutsch fortfahren", code: "DE" },
    { key: "es" as const, Flag: FlagES, label: "Español",  sub: "Continuar en español",     code: "ES" },
    { key: "mg" as const, Flag: FlagMG, label: "Malagasy", sub: "Hanohy amin'ny teny malagasy", code: "MG"},
  ];

  return (
    <div className="flex flex-col gap-3 w-full mt-2">
      {LANGS.map(({ key, Flag, label, sub, code }) => {
        const isSelected = lang === key;
        return (
          <motion.button
            key={key}
            onClick={() => setLang(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl
              border-2 transition-all duration-200 text-left overflow-hidden
              ${isSelected
                ? "border-cyan-500/70 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05]"
              }
            `}
          >
            {isSelected && (
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse at left center, rgba(34,211,238,0.08), transparent 70%)",
                }}
              />
            )}

            {/* Drapeau SVG */}
            <div className={`
              flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
              border transition-all duration-200
              ${isSelected
                ? "border-cyan-500/30 bg-cyan-500/10"
                : "border-white/[0.08] bg-white/[0.04]"
              }
            `}>
              <Flag size={26} />
            </div>

            {/* Code + texte */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black tracking-widest transition-colors
                  ${isSelected ? "text-cyan-400/70" : "text-slate-600"}`}>
                  {code}
                </span>
                <p className={`font-black text-base leading-tight transition-colors
                  ${isSelected ? "text-cyan-300" : "text-slate-200"}`}>
                  {label}
                </p>
              </div>
              <p className={`text-xs mt-0.5 transition-colors
                ${isSelected ? "text-cyan-400/50" : "text-slate-600"}`}>
                {sub}
              </p>
            </div>

            {/* Check */}
            <div className={`
              flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${isSelected ? "border-cyan-400 bg-cyan-400" : "border-white/20 bg-transparent"}
            `}>
              {isSelected && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"
                >
                  <path d="M1 4l2.5 2.5L9 1" stroke="#0f172a" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function CurrencyPicker({
  currency, setCurrency,
}: {
  currency: any;
  setCurrency: (c: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full mt-1">
      {CURRENCIES.map((c) => {
        const isSelected = currency.code === c.code;
        return (
          <motion.button
            key={c.code}
            onClick={() => setCurrency(c)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex items-center gap-3 px-4 py-3 rounded-2xl
              border-2 transition-all duration-200 text-left
              ${isSelected
                ? "border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_16px_rgba(52,211,153,0.12)]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
              }
            `}
          >
            {/* Symbole */}
            <span className={`text-base font-black font-mono w-8 text-center flex-shrink-0
              ${isSelected ? "text-emerald-300" : "text-slate-400"}`}>
              {c.symbol}
            </span>

            {/* Nom */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-black leading-tight truncate
                ${isSelected ? "text-emerald-300" : "text-slate-300"}`}>
                {c.name}
              </p>
              <p className={`text-[10px] mt-0.5
                ${isSelected ? "text-emerald-400/50" : "text-slate-600"}`}>
                {c.code}
              </p>
            </div>

            {/* Check */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0"
              >
                <svg viewBox="0 0 10 8" fill="none" className="w-2 h-2">
                  <path d="M1 4l2.5 2.5L9 1" stroke="#0f172a" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ step }: { step: Step }) {
  const Icon = step.icon;

  return (
    <div className="relative flex-shrink-0 w-[140px] sm:w-[160px]">
      <div
        className="relative rounded-[28px] border-[3px] overflow-hidden bg-slate-900 shadow-2xl"
        style={{
          borderColor: step.glow.replace("0.2", "0.5"),
          boxShadow: `0 0 30px ${step.glow}, 0 20px 40px rgba(0,0,0,0.5)`,
          aspectRatio: "9/19",
        }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10
          w-12 h-[5px] bg-slate-800 rounded-full" />

        {step.hasImage ? (
          <Image
            src={step.imagePath}
            alt={step.imageAlt}
            fill
            className="object-cover object-top"
            sizes="160px"
          />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center
            gap-3 ${step.bg} p-4`}>
            <div className="absolute top-6 left-0 right-0 px-3 flex justify-between">
              <div className="h-1.5 w-8 rounded-full bg-white/10" />
              <div className="h-1.5 w-6 rounded-full bg-white/10" />
            </div>
            <div className={`w-12 h-12 rounded-2xl ${step.bg} border ${step.border}
              flex items-center justify-center`}
              style={{ boxShadow: `0 0 20px ${step.glow}` }}
            >
              <Icon size={22} className={step.color} />
            </div>
            <div className="w-full space-y-1.5 px-1">
              {[80, 60, 90, 50, 70].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-white/[0.08]"
                  style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className={`mt-1 px-2 py-1 rounded-lg border ${step.border} ${step.bg} text-center`}>
              <p className={`text-[8px] font-bold ${step.color} opacity-60`}>Screenshot</p>
              <p className={`text-[7px] ${step.color} opacity-40`}>à venir</p>
            </div>
            <div className="absolute bottom-3 left-0 right-0 px-3 flex justify-around">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className={`h-1 rounded-full ${i === 0
                    ? step.color.replace("text-", "bg-") + " opacity-60"
                    : "bg-white/10"}`}
                  style={{ width: i === 0 ? "20px" : "12px" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2
        w-3/4 h-4 rounded-full blur-md opacity-30"
        style={{ backgroundColor: step.glow.replace("0.2", "1") }}
      />
    </div>
  );
}

// ─── Progress dots ───────────────────────────
function ProgressDots({ currentNormalIndex }: { currentNormalIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      {NORMAL_STEPS.map((step, i) => (
        <motion.div
          key={i}
          animate={{
            width:   i === currentNormalIndex ? 20 : 6,
            opacity: i <= currentNormalIndex ? 1 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
          style={{
            backgroundColor: i <= currentNormalIndex
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
  const { t, lang, setLang } = useLanguage() as any;
  const { currency, setCurrency } = useCurrency();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const step    = STEPS[current];
  const isLang  = !!step.isLang;
  const isCurrency = !!step.isCurrency;
  const isFirst = current === 0;
  const isLast  = current === STEPS.length - 1;

  // Index dans les étapes normales
  const normalIndex   = (isLang || isCurrency) ? -1 : current - 2;    
  const normalTotal     = NORMAL_STEPS.length;               
  const displayedStep = (isLang || isCurrency) ? null : normalIndex + 1;

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

  // Titres/descriptions pour les étapes normales
  const title = t?.onboarding?.steps?.[normalIndex]?.title
    ?? ["Mon Budget", "Mes Objectifs", "Mes Tâches", "Export PDF"][normalIndex];
  const desc = t?.onboarding?.steps?.[normalIndex]?.desc
    ?? [
      "Suis tes dépenses, configure ton budget et visualise ton évolution jour après jour.",
      "Crée tes objectifs personnels, suis ta progression et célèbre tes réussites.",
      "Organise tes tâches quotidiennes et reste productif chaque jour.",
      "Génère un relevé PDF complet de tes dépenses à partager avec tes parents.",
    ][normalIndex];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center px-4
        bg-slate-950/80 backdrop-blur-md"
      onMouseDown={(e) => e.stopPropagation()}
    >
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
        <div
          className={`relative rounded-3xl border ${step.border}
            bg-slate-950/98 backdrop-blur-3xl shadow-2xl overflow-hidden`}
          style={{ boxShadow: `0 0 60px ${step.glow}, 0 20px 60px rgba(0,0,0,0.6)` }}
        >
          {/* Barre de progression */}
          <motion.div
            key={`bar-${current}`}
            className="absolute top-0 left-0 h-[2px] rounded-full"
            style={{
              backgroundColor:
                step.color.includes("cyan")    ? "#22d3ee" :
                step.color.includes("violet")  ? "#a78bfa" :
                step.color.includes("emerald") ? "#34d399" : "#fb923c",
            }}
            initial={{ width: "0%" }}
            animate={{
              width: isLang
              ? "4%"
              : isCurrency
                ? "8%"  // petite barre sur l'étape langue
                : `${((normalIndex + 1) / normalTotal) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Bouton X (étape langue uniquement) */}
          {isLang && (
            <button
              onClick={skip}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                rounded-xl text-slate-600 hover:text-slate-300 hover:bg-white/5
                transition-all z-10"
            >
              <X size={16} />
            </button>
          )}

          {/* Contenu */}
          <div className="p-6 sm:p-8">

            {/* ── Header : icône + compteur (masqué sur étape langue) ── */}
            {!isLang && !isCurrency && (
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-7 h-7 rounded-xl ${step.bg} border ${step.border}
                  flex items-center justify-center flex-shrink-0`}>
                  <step.icon size={14} className={step.color} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {t?.onboarding?.stepLabel ?? "Étape"} {displayedStep} / {normalTotal}
                </span>
              </div>
            )}

            {/* ══ ÉTAPE LANGUE ══ */}
            {isLang && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="lang-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Titre */}
                  <div className="space-y-1.5 pr-8">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-7 h-7 rounded-xl ${step.bg} border ${step.border}
                        flex items-center justify-center`}>
                        <Globe size={14} className={step.color} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {lang === "fr" ? "Bienvenue" : lang === "mg" ? "Tongasoa" : "Welcome"}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-white leading-tight">
                      {lang === "fr" ? "Choisis ta langue"
                        : lang === "de" ? "Sprache wählen"
                        : lang === "es" ? "Elige tu idioma"
                        : lang === "mg" ? "Safidio ny teninao"
                        : "Choose your language"}
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {lang === "fr" ? "Sélectionne la langue dans laquelle tu veux utiliser l'application."
                        : lang === "de" ? "Wähle die Sprache, in der du die App nutzen möchtest."
                        : lang === "es" ? "Selecciona el idioma en el que quieres usar la aplicación."
                        : lang === "mg" ? "Safidio ny teny ho fampiasanao ny fampiharana."
                        : "Select the language you want to use in the app."}
                    </p>
                  </div>

                  {/* Boutons langue */}
                  <LanguagePicker lang={lang} setLang={setLang} />
                </motion.div>
              </AnimatePresence>
            )}

            {/* ══ ÉTAPE DEVISE ══ */}
            {isCurrency && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="currency-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-7 h-7 rounded-xl ${step.bg} border ${step.border}
                        flex items-center justify-center`}>
                        <step.icon size={14} className={step.color} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {lang === "fr" ? "Devise" : lang === "de" ? "Währung" : lang === "es" ? "Moneda" : "Currency"}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white leading-tight">
                      {lang === "fr" ? "Choisis ta devise"
                      : lang === "de" ? "Wähle deine Währung"
                      : lang === "es" ? "Elige tu moneda"
                      : "Choose your currency"}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {lang === "fr" ? "Les montants seront affichés dans cette devise."
                      : lang === "de" ? "Beträge werden in dieser Währung angezeigt."
                      : lang === "es" ? "Los importes se mostrarán en esta moneda."
                      : "Amounts will be displayed in this currency."}
                    </p>
                  </div>
                  <CurrencyPicker currency={currency} setCurrency={setCurrency} />
                </motion.div>
              </AnimatePresence>
            )}

            {/* ══ ÉTAPES NORMALES 1-4 (code original intact) ══ */}
            {!isLang && !isCurrency && (
              <div className="flex items-center gap-6 sm:gap-8">
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
                      <span className={`text-5xl font-black font-mono ${step.color} opacity-20`}>
                        0{displayedStep}
                      </span>
                      <h2 className="text-xl font-black text-white leading-tight -mt-2">
                        {title}
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-5
              border-t border-white/[0.06]">

              {/* Progress dots (cachés sur étape langue) */}
              {!isLang && !isCurrency
                ? <ProgressDots currentNormalIndex={normalIndex} />
                : <div />
              }

              {/* Boutons navigation */}
              <div className="flex items-center gap-2">
                {/* Retour : visible sur étapes normales sauf étape 1 */}
                {!isLang && !isCurrency && normalIndex > 0 && (
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl
                      bg-white/[0.04] border border-white/[0.08] text-slate-400
                      hover:text-slate-200 hover:border-white/15 font-bold text-sm
                      transition-all active:scale-95"
                  >
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
                      {isLang
                        ? (lang === "fr" ? "Continuer"
                        : lang === "de" ? "Weiter"
                        : lang === "es" ? "Continuar"
                        : lang === "mg" ? "Hanohy"
                        : "Continue")
                        : isCurrency
                          ? (lang === "fr" ? "Continuer" 
                            : lang === "de" ? "Weiter" 
                            : lang === "es" ? "Continuar"
                            : lang === "mg" ? "Hanohy"
                            : "Continue")
                          : (t?.onboarding?.next ?? "Suivant")
                      }
                      <ChevronRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Hint skip sous la card (étape langue uniquement) */}
        {(isLang || isCurrency) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
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