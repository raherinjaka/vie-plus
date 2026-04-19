"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Wallet, ClipboardList, Target, Info, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // ✅ Import unique sécurisé

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Mon Argent",      icon: Wallet,          href: "/depenses"  },
  { label: "Mes Tâches",      icon: ClipboardList,   href: "/taches"    },
  { label: "Objectifs",       icon: Target,          href: "/objectifs" },
  { label: "À propos",        icon: Info,            href: "/a-propos"  },
];

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/depenses":  "Mon Argent",
  "/taches":    "Mes Tâches",
  "/objectifs": "Objectifs",
  "/a-propos":  "À propos",
};

export default function MobileHeader() {
  const [isOpen, setIsOpen]           = useState(false);
  const [userEmail, setUserEmail]     = useState<string | null>(null);
  const [loggingOut, setLoggingOut]   = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const menuRef   = useRef<HTMLDivElement>(null);

  // ── Récupère l'email de l'utilisateur connecté ──────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  // ── Ferme le menu sur changement de route ───────────────────────────────────
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // ── Ferme le menu sur touche Échap ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Déconnexion sécurisée ────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Redirection dure — vide le cache des pages protégées
      window.location.replace("/login");
    }
  };

  const pageTitle = PAGE_TITLES[pathname] ?? "Menu";

  return (
    <>
      {/* ── OVERLAY ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[998] bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── HEADER BAR ────────────────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[999] px-5 py-3.5
        flex items-center justify-between
        bg-slate-950/70 backdrop-blur-2xl
        border-b border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 bg-cyan-500 rounded-full" />
          <span className="text-base font-black tracking-tight text-white">
            VIE<span className="text-cyan-400">.</span>PLUS
          </span>
        </div>

        {/* Page title — centre */}
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 pointer-events-none">
          {pageTitle}
        </span>

        {/* Burger */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          className="relative flex flex-col justify-center gap-1.5 w-10 h-10
            rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md
            items-center transition-colors hover:border-cyan-500/30 hover:bg-slate-800/60"
        >
          <span className={`block h-[1.5px] w-5 bg-white rounded-full origin-center transition-all duration-300
            ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[1.5px] w-3.5 ml-auto mr-[7px] bg-cyan-400 rounded-full transition-all duration-300
            ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-white rounded-full origin-center transition-all duration-300
            ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </header>

      {/* ── DRAWER (slide-in depuis la droite) ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            key="drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="lg:hidden fixed top-0 right-0 bottom-0 z-[1000]
              w-72 flex flex-col
              bg-slate-950/95 border-l border-white/5 backdrop-blur-3xl
              shadow-2xl shadow-black/60"
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                  Navigation
                </p>
                {userEmail && (
                  <p className="text-xs text-cyan-400/70 font-mono truncate max-w-[180px]">
                    {userEmail}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl
                  text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item, idx) => {
                const Icon   = item.icon;
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold
                        transition-all duration-200 group
                        ${active
                          ? "bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border-l-2 border-cyan-500"
                          : "text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent"
                        }`}
                    >
                      <Icon size={19} className="flex-shrink-0" />
                      <span className="text-[14px]">{item.label}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer : déconnexion */}
            <div className="px-4 pb-6 pt-3 border-t border-white/5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                    font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/8
                    border border-transparent hover:border-red-500/10
                    transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loggingOut ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-[19px] h-[19px] border-2 border-red-400/30 border-t-red-400 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <LogOut size={19} className="flex-shrink-0" />
                  )}
                  <span className="text-[14px]">
                    {loggingOut ? "Déconnexion…" : "Déconnexion"}
                  </span>
                </button>
              </motion.div>

              {/* Status dot */}
              <div className="mt-4 px-4 py-3 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/70">
                  Système Optimal
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPACER pour éviter que le contenu se cache sous le header ─────────── */}
      <div className="lg:hidden h-[57px]" />
    </>
  );
}