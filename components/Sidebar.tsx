"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ClipboardList, Target, Info, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase"; // ✅ Import unique sécurisé — jamais de clé en dur

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Mon Argent",      icon: Wallet,          href: "/depenses"  },
  { label: "Mes Tâches",      icon: ClipboardList,   href: "/taches"    },
  { label: "Objectifs",       icon: Target,          href: "/objectifs" },
  { label: "À propos",        icon: Info,            href: "/a-propos"  },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/depenses":  "Mon Argent",
  "/taches":    "Mes Tâches",
  "/objectifs": "Objectifs",
  "/a-propos":  "À propos",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname                      = usePathname();
  const [userEmail, setUserEmail]     = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string>("?");
  const [loggingOut, setLoggingOut]   = useState(false);

  // ── Récupère l'utilisateur connecté ──────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);
      setUserInitial(email ? email[0].toUpperCase() : "?");
    });
  }, []);

  // ── Déconnexion sécurisée ─────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // replace() = impossible de revenir en arrière avec la flèche navigateur
      window.location.replace("/login");
    }
  };

  const pageTitle = PAGE_TITLES[pathname] ?? "Menu";

  return (
    <aside className="hidden lg:flex w-72 flex-col sticky top-0 h-screen
      border-r border-white/[0.06]
      bg-slate-950/60 backdrop-blur-3xl
      overflow-hidden"
    >
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      {/* Subtle left glow strip */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-transparent to-violet-500/10" />

      {/* ── USER CARD ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] group">
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/20
            border border-cyan-500/20 flex items-center justify-center">
            <span className="text-sm font-black text-cyan-300">{userInitial}</span>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Connecté</p>
            <p className="text-xs text-slate-300 font-mono truncate">
              {userEmail ?? "Chargement…"}
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION LABEL ─────────────────────────────────────────────────── */}
      <div className="px-6 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-px h-4 bg-cyan-500 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
            Navigation
          </span>
        </div>
        <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white italic">
          {pageTitle}
        </h2>
      </div>

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5">
        {NAV_ITEMS.map((item, idx) => {
          const Icon   = item.icon;
          const active = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
            >
              <Link
                href={item.href}
                className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold
                  transition-all duration-200 group overflow-hidden
                  ${active
                    ? "text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-500"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border-l-2 border-transparent"
                  }`}
              >
                {/* Hover shimmer */}
                {!active && (
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-white/[0.02] to-transparent transition-opacity duration-300" />
                )}

                <Icon
                  size={19}
                  className={`flex-shrink-0 transition-colors duration-200
                    ${active ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-400"}`}
                />
                <span className="text-[14px]">{item.label}</span>

                {/* Active indicator dot */}
                {active && (
                  <motion.span
                    layoutId="active-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-6 border-t border-white/[0.05] space-y-3">

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold
            text-red-400/60 hover:text-red-400
            hover:bg-red-500/[0.07] border border-transparent hover:border-red-500/10
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          {loggingOut ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-[19px] h-[19px] border-2 border-red-400/30 border-t-red-400 rounded-full flex-shrink-0"
            />
          ) : (
            <LogOut size={19} className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
          <span className="text-[14px]">
            {loggingOut ? "Déconnexion…" : "Déconnexion"}
          </span>
        </button>

        {/* Status badge */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl
          bg-gradient-to-r from-cyan-500/[0.06] to-transparent
          border border-cyan-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
            Système Optimal
          </p>
        </div>
      </div>
    </aside>
  );
}