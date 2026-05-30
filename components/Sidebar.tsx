"use client";

// Sidebar.tsx
import { useEffect, useRef, useState, RefObject } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, Wallet, ClipboardList, Target, Info,
  LogOut, Settings, Globe, ChevronRight, Sun, Moon,
  Languages, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type SettingsPanel = "root" | "theme" | "language";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/depenses":  "Mon Argent",
  "/taches":    "Mes Tâches",
  "/objectifs": "Objectifs",
  "/a-propos":  "À propos",
};

const slideVariants = {
  enterFromRight: { x: 40,  opacity: 0 },
  enterFromLeft:  { x: -40, opacity: 0 },
  center:         { x: 0,   opacity: 1 },
  exitToRight:    { x: 40,  opacity: 0 },
  exitToLeft:     { x: -40, opacity: 0 },
};

// ─── SettingsCascade ──────────────────────────────────────────────────────────
function SettingsCascade({
  open, onClose, lang, setLang, theme, setTheme, t, anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  lang: string;
  setLang: (l: "fr" | "en" | "de" | "es") => void;
  theme: string;
  setTheme: (t: string) => void;
  t: any;
  anchorRef: RefObject<HTMLButtonElement | null>;
}) {
  const [panel, setPanel] = useState<SettingsPanel>("root");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.top, left: r.right + 12 });
      setPanel("root");
    }
  }, [open, anchorRef]);

  const navigate = (to: SettingsPanel) => {
    setDirection(to === "root" ? "back" : "forward");
    setPanel(to);
  };

  const enterVariant = direction === "forward" ? "enterFromRight" : "enterFromLeft";
  const exitVariant  = direction === "forward" ? "exitToLeft"     : "exitToRight";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1,    x: 0 }}
          exit={{    opacity: 0, scale: 0.95, x: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[9998] w-56 rounded-2xl overflow-hidden
            bg-slate-900/90 backdrop-blur-2xl
            border border-white/[0.08]
            shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {/* Gradient accent top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />

          <div className="relative overflow-hidden" style={{ minHeight: 112 }}>
            <AnimatePresence mode="wait" initial={false}>

              {/* ── LEVEL 1 : Root ── */}
              {panel === "root" && (
                <motion.div
                  key="root"
                  variants={slideVariants}
                  initial={enterVariant}
                  animate="center"
                  exit={exitVariant}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-2 space-y-0.5"
                >
                  <p className="px-3 pt-1.5 pb-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    {t.settings?.title ?? "Paramètres"}
                  </p>

                  <button
                    onClick={() => navigate("theme")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]
                      transition-all duration-150 group"
                  >
                    {theme === "dark"
                      ? <Moon size={15} className="text-violet-400 flex-shrink-0" />
                      : <Sun  size={15} className="text-amber-400  flex-shrink-0" />
                    }
                    <span className="flex-1 text-left text-[13px] font-semibold">
                      {t.settings?.theme ?? "Thème"}
                    </span>
                    <ChevronRight size={13} className="opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigate("language")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]
                      transition-all duration-150 group"
                  >
                    <Languages size={15} className="text-cyan-400 flex-shrink-0" />
                    <span className="flex-1 text-left text-[13px] font-semibold">
                      {t.settings?.language ?? "Langue"}
                    </span>
                    <ChevronRight size={13} className="opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* ── LEVEL 2 : Thème ── */}
              {panel === "theme" && (
                <motion.div
                  key="theme"
                  variants={slideVariants}
                  initial={enterVariant}
                  animate="center"
                  exit={exitVariant}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-2 space-y-0.5"
                >
                  <button
                    onClick={() => navigate("root")}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-1
                      text-slate-600 hover:text-slate-400 transition-colors rounded-lg"
                  >
                    <ArrowLeft size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {t.settings?.back ?? "Retour"}
                    </span>
                  </button>

                  {[
                    { key: "dark",  icon: Moon, label: t.settings?.dark  ?? "Sombre", color: "text-violet-400" },
                    { key: "light", icon: Sun,  label: t.settings?.light ?? "Clair",  color: "text-amber-400"  },
                  ].map(({ key, icon: Icon, label, color }) => (
                    <button
                      key={key}
                      onClick={() => { setTheme(key); onClose(); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        transition-all duration-150 font-semibold text-[13px]
                        ${theme === key
                          ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent"
                        }`}
                    >
                      <Icon size={15} className={`${color} flex-shrink-0`} />
                      {label}
                      {theme === key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* ── LEVEL 2 : Langue ── */}
              {panel === "language" && (
                <motion.div
                  key="language"
                  variants={slideVariants}
                  initial={enterVariant}
                  animate="center"
                  exit={exitVariant}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-2 space-y-0.5"
                >
                  <button
                    onClick={() => navigate("root")}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-1
                      text-slate-600 hover:text-slate-400 transition-colors rounded-lg"
                  >
                    <ArrowLeft size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {t.settings?.back ?? "Retour"}
                    </span>
                  </button>

                  {[
                    { key: "fr" as const, flag: "🇫🇷", label: "Français" },
                    { key: "en" as const, flag: "🇺🇸", label: "English"  },
                    { key: "de" as const, flag: "🇩🇪", label: "Deutsch"  },
                    { key: "es" as const, flag: "🇪🇸", label: "Español" },
                  ].map(({ key, flag, label }) => (
                    <button
                      key={key}
                      onClick={() => { setLang(key); onClose(); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        transition-all duration-150 font-semibold text-[13px]
                        ${lang === key
                          ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent"
                        }`}
                    >
                      <span className="text-base leading-none">{flag}</span>
                      {label}
                      {lang === key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const pathname   = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const translatedNav = [
    { label: t.nav.dashboard, icon: LayoutDashboard, href: "/dashboard" },
    { label: t.nav.money,     icon: Wallet,          href: "/depenses"  },
    { label: t.nav.tasks,     icon: ClipboardList,   href: "/taches"    },
    { label: t.nav.goals,     icon: Target,          href: "/objectifs" },
    { label: t.nav.about,     icon: Info,            href: "/a-propos"  },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await supabase.auth.signOut(); }
    catch (err) { console.error("Logout error:", err); }
    finally { window.location.replace("/login"); }
  };

  const pageTitle = PAGE_TITLES[pathname] ?? "Menu";

  return (
    <>
      {/* ── Overlay + Menu cascade (hors aside pour échapper au overflow-hidden) ── */}
      {settingsOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setSettingsOpen(false)}
          />
          <SettingsCascade
            theme={theme || "light"} // Ajout d'une valeur par défaut
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            lang={lang}
            setLang={setLang}
            setTheme={setTheme}
            t={t}
            anchorRef={settingsBtnRef}
          />
        </>
      )}

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-72 flex-col fixed top-[76px] left-0 h-[calc(100vh-76px)]
        border-r border-white/[0.06] bg-slate-950/60 backdrop-blur-3xl overflow-hidden z-[9997]"
      >
        {/* Decorative lines */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-transparent to-violet-500/10" />

        {/* ── SECTION LABEL ── */}
        <div className="px-6 mt-6 mb-3">
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

        {/* ── NAV ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5">
          {translatedNav.map((item, idx) => {
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

          {/* ── SETTINGS ── */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: translatedNav.length * 0.06, duration: 0.35 }}
          >
            <button
              ref={settingsBtnRef}
              onClick={() => setSettingsOpen(v => !v)}
              className={`relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold
                transition-all duration-200 group overflow-hidden border-l-2
                ${settingsOpen
                  ? "text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border-transparent"
                }`}
            >
              {!settingsOpen && (
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                  bg-gradient-to-r from-white/[0.02] to-transparent transition-opacity duration-300" />
              )}
              <Settings
                size={19}
                className={`flex-shrink-0 transition-all duration-500
                  ${settingsOpen ? "text-cyan-400 rotate-90" : "text-slate-600 group-hover:text-slate-400"}`}
              />
              <span className="text-[14px]">{t.settings?.title ?? "Paramètres"}</span>
              <Globe size={13} className="ml-auto opacity-30 group-hover:opacity-60 transition-opacity" />
            </button>
          </motion.div>
        </nav>

        {/* ── FOOTER ── */}
        <div className="px-4 pt-4 pb-6 border-t border-white/[0.05]">
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
              {loggingOut ? (t.nav?.logging_out ?? "Déconnexion…") : (t.nav?.logout ?? "Se déconnecter")}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}