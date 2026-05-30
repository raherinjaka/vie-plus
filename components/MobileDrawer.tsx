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

const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard",  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20"   },
  { key: "budget",    icon: Wallet,          href: "/depenses",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20"},
  { key: "tasks",     icon: ClipboardList,   href: "/taches",     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  { key: "goals",     icon: Target,          href: "/objectifs",  color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
  { key: "about",     icon: Info,            href: "/a-propos",   color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/20"  },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t, lang, setLang } = useLanguage() as any;
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", avatar: "", initial: "?" });
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => { onClose(); }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* ── OVERLAY ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ── DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[999] w-[300px] flex flex-col
              bg-slate-950 border-l border-white/[0.06] shadow-2xl overflow-hidden"
          >
            {/* Header Profil */}
            <div className="px-6 pt-10 pb-6 border-b border-white/[0.05]
              bg-gradient-to-b from-white/[0.02] to-transparent">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/30
                    to-violet-500/20 border border-cyan-500/20 flex items-center
                    justify-center overflow-hidden shadow-xl">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-cyan-300">{userData.initial}</span>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full
                    bg-emerald-400 border-4 border-slate-950" />
                </div>

                <div className="mt-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-0.5">
                    {t?.nav?.connectedAs}
                  </p>
                  <p className="text-lg font-black text-white capitalize">
                    {userData.name || t?.nav?.defaultUser}
                  </p>
                  <p className="text-xs text-slate-500 font-mono truncate max-w-[200px]">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-4">
                {t?.nav?.pagesLabel}
              </p>
              {NAV_ITEMS.map((item, idx) => {
                const Icon   = item.icon;
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold
                        transition-all
                        ${active
                          ? `${item.bg} ${item.color} border ${item.border}`
                          : "text-slate-400 hover:bg-white/5"
                        }`}
                    >
                      <Icon size={20} />
                      <span>{t?.nav?.items?.[item.key]}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* ── LANGUE ── */}
            <div className="px-4 pb-4">
              <p className="px-1 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 mb-2">
                {t?.settings?.language}
              </p>
              <div className="flex gap-2">
                {[
                  { key: "fr" as const, flag: "🇫🇷", label: "FR" },
                  { key: "en" as const, flag: "🇺🇸", label: "EN" },
                  { key: "de" as const, flag: "🇩🇪", label: "DE" },
                  { key: "es" as const, flag: "🇪🇸", label: "ES" },
                ].map(({ key, flag, label }) => (
                  <button
                    key={key}
                    onClick={() => setLang(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5
                      rounded-xl border font-bold text-xs transition-all duration-200
                      ${lang === key
                        ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-300"
                        : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/15"
                      }`}
                  >
                    <span>{flag}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer / Déconnexion */}
            <div className="p-4 border-t border-white/[0.05]">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold
                  text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
              >
                {loggingOut ? (
                  <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400
                    rounded-full animate-spin" />
                ) : (
                  <LogOut size={20} />
                )}
                <span>{loggingOut ? t?.nav?.loggingOut : t?.nav?.logout}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}