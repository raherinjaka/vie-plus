"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Wallet, ClipboardList, Target,
  Info, LogOut, X, Menu,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard",  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20"   },
  { key: "budget",    icon: Wallet,          href: "/depenses",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20"},
  { key: "tasks",     icon: ClipboardList,   href: "/taches",     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  { key: "goals",     icon: Target,          href: "/objectifs",  color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
  { key: "about",     icon: Info,            href: "/a-propos",   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/20"  },
];

// ─── NavDrawer ────────────────────────────────────────────────────────────────
export default function NavDrawer() {
  const { t } = useLanguage() as any;
  const [isOpen,     setIsOpen]     = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData,   setUserData]   = useState({ name: "", email: "", avatar: "", initial: "?" });
  const pathname  = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // ── Fetch user ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const email   = user.email ?? "";
      const name    = (user.user_metadata?.full_name ?? email.split("@")[0]).split(" ")[0];
      const avatar  = user.user_metadata?.avatar_url ?? "";
      const initial = email ? email[0].toUpperCase() : "?";
      setUserData({ name, email, avatar, initial });
    });
  }, []);

  // ── Ferme sur Échap ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Ferme sur changement de route ───────────────────────────────────────────
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // ── Déconnexion ─────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try { await supabase.auth.signOut(); }
    catch (err) { console.error("Logout error:", err); }
    finally { window.location.replace("/login"); }
  };

  const currentNav = NAV_ITEMS.find((n) => n.href === pathname);

  return (
    <>
      {/* ── TRIGGER ── */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        aria-label={t?.nav?.open}
        className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
          bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl
          text-slate-400 hover:text-slate-200 hover:border-white/15
          transition-all duration-200 shadow-lg shadow-black/20 group"
      >
        {currentNav && (
          <currentNav.icon size={16} className={`flex-shrink-0 ${currentNav.color}`} />
        )}
        <Menu size={16} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
        <span className="text-[13px] font-bold hidden sm:block">{t?.nav?.menu}</span>
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-500">
          <span className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-60" />
        </span>
      </motion.button>

      {/* ── OVERLAY ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[998] bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            key="drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-[999] w-80 flex flex-col
              bg-slate-950/98 border-l border-white/[0.06] backdrop-blur-3xl
              shadow-2xl shadow-black/70 overflow-hidden"
          >
            {/* Glow top */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px
              bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* ── USER HEADER ── */}
            <div className="relative px-6 pt-6 pb-5 border-b border-white/[0.05]
              bg-gradient-to-b from-white/[0.02] to-transparent">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center
                  rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]
                  transition-all duration-200"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30
                    to-violet-500/20 border border-cyan-500/20 flex items-center
                    justify-center overflow-hidden shadow-lg">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-cyan-300">{userData.initial}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                    bg-emerald-400 border-2 border-slate-950" />
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-0.5">
                    {t?.nav?.connectedAs}
                  </p>
                  <p className="text-base font-black text-white capitalize truncate">
                    {userData.name || t?.nav?.defaultUser}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* ── SECTION LABEL ── */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-px h-3.5 bg-cyan-500 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                  {t?.nav?.pagesLabel}
                </span>
              </div>
            </div>

            {/* ── NAV LINKS ── */}
            <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
              {NAV_ITEMS.map((item, idx) => {
                const Icon   = item.icon;
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + idx * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                        font-bold transition-all duration-200 group overflow-hidden
                        ${active
                          ? `${item.bg} ${item.color} border ${item.border}`
                          : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                        flex-shrink-0 transition-all duration-200
                        ${active
                          ? `${item.bg} ${item.color} border ${item.border}`
                          : "bg-slate-800/60 text-slate-500 group-hover:text-slate-300 group-hover:bg-slate-800"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <span className="text-[14px]">
                        {t?.nav?.items?.[item.key]}
                      </span>

                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          className={`ml-auto text-[10px] font-black uppercase tracking-widest
                            px-2 py-0.5 rounded-full ${item.bg} ${item.color} border ${item.border}`}
                        >
                          {t?.nav?.active}
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* ── FOOTER ── */}
            <div className="px-4 pb-6 pt-3 border-t border-white/[0.05] space-y-2">
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold
                  text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.07]
                  border border-transparent hover:border-red-500/10
                  transition-all duration-200 disabled:opacity-40
                  disabled:cursor-not-allowed group"
              >
                {loggingOut ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20
                    flex items-center justify-center flex-shrink-0
                    group-hover:bg-red-500/15 transition-colors">
                    <LogOut size={15} className="text-red-400" />
                  </div>
                )}
                <span className="text-[14px]">
                  {loggingOut ? t?.nav?.loggingOut : t?.nav?.logout}
                </span>
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
                  bg-cyan-500/[0.05] border border-cyan-500/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                  {t?.nav?.status}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}