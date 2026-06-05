"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, Send, CheckCircle2, AlertCircle, Star } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStep1Valid = firstName.trim().length >= 2 && lastName.trim().length >= 2 && email.includes("@");
  const isStep2Valid = message.trim().length >= 10 && rating >= 1;

  const handleContinue = () => {
    if (isStep1Valid) setStep(2);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message, rating }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setIsSent(true);
    } catch {
      setError("Impossible de contacter le serveur. Vérifie ta connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    setRating(0);
    setHoveredStar(0);
    setError(null);
    setIsSent(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Modale */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Glow extérieur */}
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/20 via-slate-800/20 to-transparent rounded-2xl pointer-events-none" />

              <div className="relative rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">

                {/* Barre de progression */}
                <div className="h-[2px] bg-slate-800 w-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: "50%" }}
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800">
                        <Mail size={14} className="text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-slate-200">
                          Nous contacter
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          Étape {step} sur 2
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* État succès */}
                  {isSent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-3 py-10 text-center"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                        <CheckCircle2 size={24} className="text-emerald-400" />
                      </div>
                      <p className="text-base font-semibold text-slate-200">
                        Message envoyé !
                      </p>
                      <p className="text-xs text-slate-500 max-w-[240px]">
                        Merci {firstName}, on te répondra dans les plus brefs délais.
                      </p>
                      {/* Affichage des étoiles dans le succès */}
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleClose}
                        className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all duration-200"
                      >
                        Fermer
                      </button>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {/* ÉTAPE 1 — Identité */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-4"
                        >
                          <p className="text-xs text-slate-500 mb-1">
                            Dis-nous qui tu es avant de continuer.
                          </p>

                          {/* Nom + Prénom côte à côte */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-slate-400">Prénom</label>
                              <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Jean"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-slate-400">Nom</label>
                              <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Dupont"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400">Adresse e-mail</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jean@exemple.com"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200"
                            />
                          </div>

                          {/* Bouton Continuer */}
                          <button
                            onClick={handleContinue}
                            disabled={!isStep1Valid}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                          >
                            Continuer
                            <ArrowRight size={13} />
                          </button>
                        </motion.div>
                      )}

                      {/* ÉTAPE 2 — Message + Note */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-4"
                        >
                          <p className="text-xs text-slate-500 mb-1">
                            Ton message et ton avis nous aident à améliorer VIE+.
                          </p>

                          {/* Message */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-400">Ton message</label>
                            <textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Dis-nous ce que tu penses de VIE+..."
                              rows={4}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200 resize-none"
                            />
                          </div>

                          {/* Étoiles */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-slate-400">
                              Ton avis <span className="text-slate-600">(obligatoire)</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <motion.button
                                  key={s}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setRating(s)}
                                  onMouseEnter={() => setHoveredStar(s)}
                                  onMouseLeave={() => setHoveredStar(0)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    size={24}
                                    className={`transition-colors duration-150 ${
                                      s <= (hoveredStar || rating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-700 fill-slate-700"
                                    }`}
                                  />
                                </motion.button>
                              ))}
                              {rating > 0 && (
                                <span className="ml-2 text-xs text-slate-500">
                                  {["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent"][rating]}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Erreur */}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10"
                            >
                              <AlertCircle size={13} className="text-red-400 shrink-0" />
                              <p className="text-xs text-red-400">{error}</p>
                            </motion.div>
                          )}

                          {/* Boutons */}
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => setStep(1)}
                              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-xs font-medium hover:text-slate-200 hover:border-slate-700 transition-all duration-200"
                            >
                              Retour
                            </button>
                            <button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !isStep2Valid}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? (
                                <span className="animate-spin w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full" />
                              ) : (
                                <Send size={13} />
                              )}
                              {isSubmitting ? "Envoi..." : "Envoyer"}
                            </button>
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
    </AnimatePresence>
  );
}