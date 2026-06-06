"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState<{msg: string, type: 'error' | 'success'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setNotif({ msg: error.message, type: 'error' });
    } else {
      setNotif({ msg: "Connexion réussie !", type: 'success' });
      // Redirection ou action après succès
    }
    setIsLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setNotif(null);
    try {
      // Ligne 34 environ
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/dashboard` 
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setNotif({
        msg: err.message || `Erreur lors de la connexion avec ${provider}`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex bg-[#0f0f0f]">

      {/* ── TOAST ── */}
      <AnimatePresence>
        {notif && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-5 py-3.5 rounded-lg border shadow-lg backdrop-blur-sm min-w-[320px] max-w-md
              ${notif.type === 'error' ? 'bg-[#0f0f0f]/95 border-red-500/30' : 'bg-[#0f0f0f]/95 border-emerald-500/30'}`}
          >
            <div className={`absolute left-0 top-0 h-full w-[3px] rounded-l-lg ${notif.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <div className="flex flex-col flex-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${notif.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                {notif.type === 'error' ? 'Erreur' : 'Succès'}
              </span>
              <span className="text-sm text-slate-300 truncate">{notif.msg}</span>
            </div>
            <button
              onClick={() => setNotif(null)}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COLONNE GAUCHE : FORMULAIRE ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 lg:max-w-[52%]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[360px]"
        >
          {/* Logo */}
          <div className="mb-10">
            <span className="text-white text-3xl font-black tracking-tighter">
              VIE<span className="text-cyan-400">+</span>
            </span>
          </div>

          {/* Titre + sous-titre */}
          <div className="mb-10">
            <h1 className="text-white text-3xl font-bold leading-tight mb-1">
              Content de vous revoir
            </h1>
            <p className="text-white/30 text-sm">Connectez-vous pour continuer</p>
          </div>

          <div className="flex flex-col gap-3">
            
            {/* Bouton Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-[#0f0f0f] text-sm font-semibold py-3.5 px-5 rounded-full transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading
                ? <Loader2 size={18} className="animate-spin" />
                : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.26-2.08 2.95v3h3.36c1.97-1.82 3.1-4.48 3.1-7.21z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.36-2.61c-.93.63-2.12 1-3.92 1-3.01 0-5.58-2.03-6.5-4.76H2.18v2.99C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M6.5 14.58c-.45-1.34-.45-2.8 0-4.14V7.45H2.18C1.43 8.93 1 10.92 1 13c0 2.08.43 4.07 1.18 5.55l3.32-2.97z" fill="#FBBC05"/>
                    <path d="M12 4.95c1.64 0 3.11.57 4.28 1.68l3.2-3.2C17.46 1.72 14.9.99 12 .99 7.7.99 3.99 3.47 2.18 7.45L5.5 10.4c.92-2.73 3.49-4.76 6.5-4.76z" fill="#EA4335"/>
                  </svg>
                )
              }
              Entrer avec Google
            </button>

            {/* Bouton GitHub */}
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full bg-transparent hover:bg-white/5 text-white text-sm font-semibold py-3.5 px-5 rounded-full border border-white/20 hover:border-white/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading
                ? <Loader2 size={18} className="animate-spin" />
                : <GithubIcon size={18} />
              }
              Entrer avec GitHub
            </button>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-white/10" />
            <div className="my-3 h-px w-full bg-white/10" />
            <div className="flex-1 h-px bg-white/10" />
          </div>
          
          {/* ── FORMULAIRE CLASSIQUE ── */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative w-full overflow-hidden group flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-40
                bg-transparent border border-cyan-500/40 text-cyan-400
                hover:border-cyan-500/70 hover:text-white hover:bg-cyan-500/10"
            >
              {/* Shimmer au hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Se connecter</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </motion.button>
          </form><br />
            
          <p className="text-sm text-white/40 text-center">
            Pas encore de profil ?{" "}
            <Link href="/register" className="text-white hover:text-cyan-400 font-semibold transition-colors underline underline-offset-4">
              S'inscrire
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── COLONNE DROITE : DÉCORATION ── */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-[#0f0f0f] border-l border-white/5">

        {/* Glow de fond — respiration */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
        />

        <div className="relative z-10 flex flex-col items-center justify-center select-none">

          {/* Anneaux orbitaux — explosion + rotation */}
          {[
            { size: 360, duration: 28, delay: 0.1, reverse: false, border: "border-cyan-500/15" },
            { size: 280, duration: 20, delay: 0.2, reverse: true,  border: "border-white/[0.06]" },
            { size: 440, duration: 45, delay: 0.0, reverse: false, border: "border-cyan-500/5"  },
          ].map((ring, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: ring.reverse ? -360 : 360 }}
              transition={{
                scale:   { duration: 0.9, delay: ring.delay, ease: [0.34, 1.56, 0.64, 1] },
                opacity: { duration: 0.6, delay: ring.delay },
                rotate:  { duration: ring.duration, repeat: Infinity, ease: "linear", delay: ring.delay },
              }}
              className={`absolute rounded-full border ${ring.border}`}
              style={{ width: ring.size, height: ring.size }}
            />
          ))}

          {/* Particules orbitales */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                scale:   { duration: 0.6, delay: 0.4 + i * 0.06, ease: "backOut" },
                opacity: { duration: 0.4, delay: 0.4 + i * 0.06 },
                rotate:  { duration: 25, repeat: Infinity, ease: "linear" },
              }}
              className="absolute w-[320px] h-[320px]"
              style={{ rotate: deg }}
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
              />
            </motion.div>
          ))}

          {/* Orbe central — explosion + respiration */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-36 h-36 flex items-center justify-center"
          >
            {/* Halo externe */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl"
            />
            {/* Halo interne décalé */}
            <motion.div
              animate={{ scale: [1.1, 1.35, 1.1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-cyan-400/15 blur-lg"
            />
            {/* Border pulsante */}
            <motion.div
              animate={{ boxShadow: [
                "0 0 0px 0px rgba(6,182,212,0)",
                "0 0 30px 8px rgba(6,182,212,0.15)",
                "0 0 0px 0px rgba(6,182,212,0)",
              ]}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-cyan-500/40 bg-cyan-500/5 backdrop-blur-sm"
            />

            {/* Icône cadenas — respiration */}
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.4}
                stroke="currentColor"
                className="w-12 h-12 text-cyan-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </motion.div>
          </motion.div>

        </div>

        {/* Watermark discret */}
        <span className="absolute bottom-10 right-10 text-[80px] font-black italic tracking-tighter leading-none text-white/[0.025] select-none pointer-events-none">
          VIE<span className="text-cyan-400/5">+</span>
        </span>

      </div>
      
    </section>
  );
}