// components/contact/ContactModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createPortal } from "react-dom";

import ProgressBar from "./ProgressBar";
import StarRating from "./StarRating";
import { FuturisticInput, FuturisticTextarea } from "./FuturisticInput";
import AnimatedEmoji from "./AnimatedEmoji";
import { useLanguage } from "@/context/LanguageContext";

// ── Types ──────────────────────────────────────────────────────────────────
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Constantes d'animation ─────────────────────────────────────────────────
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

// ── Composant principal ────────────────────────────────────────────────────
export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useLanguage() as { t: any };
  // Étapes
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1); // pour l'animation directionnelle

  // Champs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");
  const [rating, setRating]       = useState(0);

  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Validations
  const isStep1Valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStep2Valid = message.trim().length >= 10 && rating >= 1;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const goToStep2 = () => {
    if (!isStep1Valid) return;
    setDirection(1);
    setStep(2);
  };

  const goToStep1 = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
  
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          message: message.trim(),
          rating,                    // number ✅ (pas string)
        }),
      });
  
      // Statuts gérés : 200, 400, 422, 500, 502
      if (res.status === 200) {
        setIsSent(true);
        return;
      }
  
      // Pour tous les autres statuts, on lit le message d'erreur Zod/serveur
      const data = await res.json().catch(() => null);
      const msg =
        data?.error ??
        (res.status === 502
          ? t.contact.errors.badGateway
          : res.status === 500
          ? t.contact.errors.serverError
          : t.contact.errors.default);
  
      setError(msg);
    } catch {
      // Erreur réseau pure (pas de connexion, CORS, etc.)
      setError(t.contact.errors.network);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset complet
    setStep(1);
    setDirection(1);
    setFirstName(""); setLastName(""); setEmail("");
    setMessage(""); setRating(0);
    setError(null); setIsSent(false); setIsSubmitting(false);
    onClose();
  };

  if (typeof window === "undefined") return null;
  
  // ── Rendu ─────────────────────────────────────────────────────────────────
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md"
          />

          {/* ── Modale ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Halo extérieur animé */}
            <motion.div
              className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative w-full max-w-md">
              {/* Bordure gradient */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/30 via-blue-600/10 to-transparent rounded-2xl pointer-events-none" />

              <div className="relative rounded-2xl border border-slate-800/80 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.08)] overflow-hidden">

                {/* Barre de progression */}
                <ProgressBar step={step} />

                <div className="p-7">

                  {/* ── Header ── */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <Mail size={15} className="text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-100 tracking-wide">{t.contact.modal.title}</h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">{t.contact.modal.step.replace("{step}", step.toString())}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClose}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors duration-200"
                    >
                      <X size={15} />
                    </motion.button>
                  </div>

                  {/* ── État SUCCÈS ── */}
                  {isSent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="flex flex-col items-center gap-4 py-8 text-center"
                    >
                      <AnimatedEmoji type="love" size={80} />

                      <div>
                      < p className="text-base font-bold text-slate-100">{t.contact.success.title}</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto">
                          {t.contact.success.desc.replace("{name}", firstName)}
                        </p>
                      </div>

                      {/* Étoiles recap */}
                      <div className="flex gap-1.5 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} viewBox="0 0 24 24" width="18" height="18">
                            <polygon
                              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                              fill={s <= rating ? "#FFD93D" : "#1E293B"}
                              stroke={s <= rating ? "#FFD93D" : "#334155"}
                              strokeWidth="1.5"
                            />
                          </svg>
                        ))}
                      </div>

                      <button
                        onClick={handleClose}
                        className="mt-2 px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all duration-200"
                      >
                        {t.contact.buttons.close}
                      </button>
                    </motion.div>

                  ) : (
                    /* ── Étapes ── */
                    <AnimatePresence custom={direction} mode="wait">

                      {/* ÉTAPE 1 — Identité */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          custom={direction}
                          variants={SLIDE_VARIANTS}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="flex flex-col gap-8"
                        >
                          <p className="text-xs text-slate-500">
                            {t.contact.step1.desc}
                          </p>

                          {/* Prénom + Nom */}
                          <div className="grid grid-cols-2 gap-6">
                            <FuturisticInput
                              required
                              label={t.contact.fields.firstName}
                              type="text"
                              value={firstName}
                              onChange={e => setFirstName(e.target.value)}
                              autoComplete="given-name"
                            />
                            <FuturisticInput
                              required
                              label={t.contact.fields.lastName}
                              type="text"
                              value={lastName}
                              onChange={e => setLastName(e.target.value)}
                              autoComplete="family-name"
                            />
                          </div>

                          {/* Email */}
                          <FuturisticInput
                            required
                            label={t.contact.fields.email}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                          />

                          {/* Bouton Continuer */}
                          <motion.button
                            type="button"
                            onClick={goToStep2}
                            disabled={!isStep1Valid}
                            whileHover={isStep1Valid ? { scale: 1.02, boxShadow: "0 8px 30px rgba(6,182,212,0.25)" } : {}}
                            whileTap={isStep1Valid ? { scale: 0.97 } : {}}
                            className="
                              group relative w-full py-3 rounded-xl
                              bg-gradient-to-r from-cyan-500/15 to-blue-600/15
                              border border-cyan-500/25
                              text-cyan-400 text-sm font-semibold
                              hover:from-cyan-500/25 hover:to-blue-600/25
                              hover:border-cyan-400/40
                              disabled:opacity-35 disabled:cursor-not-allowed
                              transition-all duration-300
                              flex items-center justify-center gap-2
                              overflow-hidden
                            "
                          >
                            {/* Shimmer au hover */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            />
                            {t.contact.buttons.continue}
                            <ArrowRight size={14} className="relative z-10" />
                          </motion.button>
                        </motion.div>
                      )}

                      {/* ÉTAPE 2 — Message + Note */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          custom={direction}
                          variants={SLIDE_VARIANTS}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="flex flex-col gap-7"
                        >
                          <p className="text-xs text-slate-500">
                            {t.contact.step2.desc}
                          </p>

                          {/* Textarea futuriste */}
                          <FuturisticTextarea
                            required
                            label={t.contact.fields.message}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                          />

                          {/* Séparateur */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-800" />
                            <span className="text-[10px] text-slate-600 uppercase tracking-widest">{t.contact.fields.ratingLabel}</span>
                            <div className="flex-1 h-px bg-slate-800" />
                          </div>

                          {/* StarRating avec emojis */}
                          <StarRating value={rating} onChange={setRating} />

                          {/* Erreur */}
                          <AnimatePresence>
                            {error && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -6, height: 0 }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 overflow-hidden"
                              >
                                <AlertCircle size={13} className="text-red-400 shrink-0" />
                                <p className="text-xs text-red-400">{error}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Boutons Retour + Envoyer */}
                          <div className="flex gap-3">
                            <motion.button
                              type="button"
                              onClick={goToStep1}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 text-xs font-medium hover:text-slate-200 hover:border-slate-700 transition-all duration-200"
                            >
                              {t.contact.buttons.back}
                            </motion.button>

                            <motion.button
                              type="button"
                              onClick={handleSubmit}
                              disabled={isSubmitting || !isStep2Valid}
                              whileHover={isStep2Valid && !isSubmitting ? { scale: 1.02, boxShadow: "0 8px 30px rgba(6,182,212,0.25)" } : {}}
                              whileTap={isStep2Valid ? { scale: 0.97 } : {}}
                              className="
                                group relative flex-1 flex items-center justify-center gap-2
                                py-3 rounded-xl
                                bg-gradient-to-r from-cyan-500/15 to-blue-600/15
                                border border-cyan-500/25
                                text-cyan-400 text-xs font-semibold
                                hover:from-cyan-500/25 hover:to-blue-600/25
                                hover:border-cyan-400/40
                                disabled:opacity-35 disabled:cursor-not-allowed
                                transition-all duration-300
                                overflow-hidden
                              "
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                              />
                              {isSubmitting ? (
                                <motion.span
                                  className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                <Send size={13} className="relative z-10" />
                              )}
                              <span className="relative z-10">
                                {isSubmitting ? t.contact.buttons.sending : t.contact.buttons.send}
                              </span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}