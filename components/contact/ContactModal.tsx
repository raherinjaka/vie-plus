"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Réinitialisation de l'état d'erreur avant chaque tentative
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        // On affiche le message d'erreur renvoyé par la route API
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setIsSent(true);
      setEmail("");
      setMessage("");
    } catch {
      setError("Impossible de contacter le serveur. Vérifie ta connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Réinitialisation complète à la fermeture
    setEmail("");
    setMessage("");
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modale */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800">
                    <Mail size={14} className="text-cyan-400" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    Nous contacter
                  </h2>
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
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <CheckCircle2 size={32} className="text-emerald-400" />
                  <p className="text-sm font-medium text-slate-200">
                    Message envoyé !
                  </p>
                  <p className="text-xs text-slate-500">
                    On te répondra dans les plus brefs délais.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all duration-200"
                  >
                    Fermer
                  </button>
                </motion.div>
              ) : (
                /* Formulaire */
                <div className="flex flex-col gap-4">
                  {/* Champ email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">
                      Ton adresse e-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="toi@exemple.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200"
                    />
                  </div>

                  {/* Champ message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">
                      Ton message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Dis-nous ce que tu penses de VIE+..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/30 transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Affichage erreur */}
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

                  {/* Bouton submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email || !message}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full" />
                    ) : (
                      <Send size={13} />
                    )}
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}