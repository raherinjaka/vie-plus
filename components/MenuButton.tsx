"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import {
  LogOut, Settings, ChevronRight,
  Sun, Moon, Languages, ArrowLeft, User, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";

type SettingsPanel = "root" | "theme" | "language";

const slideVariants = {
  enterFromRight: { x: 40,  opacity: 0 },
  enterFromLeft:  { x: -40, opacity: 0 },
  center:         { x: 0,   opacity: 1 },
  exitToRight:    { x: 40,  opacity: 0 },
  exitToLeft:     { x: -40, opacity: 0 },
};

// ─── SettingsCascade (desktop uniquement) ────────────────────────────────────
function SettingsCascade({
  open, onClose, lang, setLang, theme, setTheme, t, anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
  theme: string;
  setTheme: (v: string) => void;
  t: any;
  anchorRef: RefObject<HTMLButtonElement | null>;
}) {
  const [panel, setPanel]         = useState<SettingsPanel>("root");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [pos, setPos]             = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.top, left: r.left - 232 - 8 });
      setPanel("root");
    }
  }, [open, anchorRef]);

  const navigate = (to: SettingsPanel) => {
    setDirection(to === "root" ? "back" : "forward");
    setPanel(to);
  };

  const enter = direction === "forward" ? "enterFromRight" : "enterFromLeft";
  const exit  = direction === "forward" ? "exitToLeft"     : "exitToRight";

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[10001]" onClick={handleBackdropClick} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 8 }}
            animate={{ opacity: 1, scale: 1,    x: 0 }}
            exit={{    opacity: 0, scale: 0.95, x: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[10002] w-56 rounded-2xl overflow-hidden
              bg-[#1e2535]/98 backdrop-blur-2xl
              border border-white/[0.08]
              shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
            <div className="relative overflow-hidden" style={{ minHeight: 112 }}>
              <AnimatePresence mode="wait" initial={false}>

                {panel === "root" && (
                  <motion.div key="root" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.2 }} className="p-2 space-y-0.5">
                    <p className="px-3 pt-1.5 pb-2 text-[9px] font-black uppercase tracking-widest text-slate-600">{t.settings?.title ?? "Paramètres"}</p>
                    <button onClick={() => navigate("theme")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all group">
                      {theme === "dark" ? <Moon size={15} className="text-violet-400 flex-shrink-0" /> : <Sun size={15} className="text-amber-400 flex-shrink-0" />}
                      <span className="flex-1 text-left text-[13px] font-semibold">{t.settings?.theme ?? "Thème"}</span>
                      <ChevronRight size={13} className="opacity-40 group-hover:opacity-80 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button onClick={() => navigate("language")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all group">
                      <Languages size={15} className="text-cyan-400 flex-shrink-0" />
                      <span className="flex-1 text-left text-[13px] font-semibold">{t.settings?.language ?? "Langue"}</span>
                      <ChevronRight size={13} className="opacity-40 group-hover:opacity-80 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>
                )}

                {panel === "theme" && (
                  <motion.div key="theme" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.2 }} className="p-2 space-y-0.5">
                    <button onClick={() => navigate("root")} className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-1 text-slate-600 hover:text-slate-400 rounded-lg">
                      <ArrowLeft size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{t.settings?.back ?? "Retour"}</span>
                    </button>
                    {([
                      { key: "dark"  as const, icon: Moon, label: t.settings?.dark  ?? "Sombre", color: "text-violet-400" },
                      { key: "light" as const, icon: Sun,  label: t.settings?.light ?? "Clair",  color: "text-amber-400"  },
                    ]).map(({ key, icon: Icon, label, color }) => (
                      <button key={key} onClick={() => { setTheme(key); onClose(); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all
                          ${theme === key ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent"}`}>
                        <Icon size={15} className={`${color} flex-shrink-0`} />{label}
                        {theme === key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}

                {panel === "language" && (
                  <motion.div key="language" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.2 }} className="p-2 space-y-0.5">
                    <button onClick={() => navigate("root")} className="w-full flex items-center gap-1.5 px-3 py-1.5 mb-1 text-slate-600 hover:text-slate-400 rounded-lg">
                      <ArrowLeft size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{t.settings?.back ?? "Retour"}</span>
                    </button>
                    {([
                      { key: "fr" as const, flag: "🇫🇷", label: "Français" },
                      { key: "en" as const, flag: "🇺🇸", label: "English"  },
                    ]).map(({ key, flag, label }) => (
                      <button key={key} onClick={() => { setLang(key); onClose(); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all
                          ${lang === key ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent"}`}>
                        <span className="text-base leading-none">{flag}</span>{label}
                        {lang === key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── MobileSettingsPage ───────────────────────────────────────────────────────
function MobileSettingsPage({
  open, onClose, lang, setLang, theme, setTheme, t,
}: {
  open: boolean;
  onClose: () => void;
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
  theme: string;
  setTheme: (v: string) => void;
  t: any;
}) {
  const [panel, setPanel]         = useState<SettingsPanel>("root");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  useEffect(() => { if (open) setPanel("root"); }, [open]);

  const navigate = (to: SettingsPanel) => {
    setDirection(to === "root" ? "back" : "forward");
    setPanel(to);
  };

  const enter = direction === "forward" ? "enterFromRight" : "enterFromLeft";
  const exit  = direction === "forward" ? "exitToLeft"     : "exitToRight";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{    x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="absolute inset-0 bg-[#141a26] z-10 flex flex-col"
        >
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-white">{t.settings?.title ?? "Paramètres"}</h2>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>

              {panel === "root" && (
                <motion.div key="root" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.22 }} className="absolute inset-0 p-4 space-y-1">
                  <button onClick={() => navigate("theme")} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-white/[0.04] transition-all group">
                    {theme === "dark" ? <Moon size={20} className="text-violet-400 flex-shrink-0" /> : <Sun size={20} className="text-amber-400 flex-shrink-0" />}
                    <span className="flex-1 text-left text-[15px] font-medium">{t.settings?.theme ?? "Thème"}</span>
                    <ChevronRight size={16} className="opacity-30 group-hover:opacity-70" />
                  </button>
                  <button onClick={() => navigate("language")} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-white/[0.04] transition-all group">
                    <Languages size={20} className="text-cyan-400 flex-shrink-0" />
                    <span className="flex-1 text-left text-[15px] font-medium">{t.settings?.language ?? "Langue"}</span>
                    <ChevronRight size={16} className="opacity-30 group-hover:opacity-70" />
                  </button>
                </motion.div>
              )}

              {panel === "theme" && (
                <motion.div key="theme" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.22 }} className="absolute inset-0 p-4 space-y-1">
                  <p className="px-5 pt-2 pb-3 text-[10px] font-black uppercase tracking-widest text-slate-600">{t.settings?.theme ?? "Thème"}</p>
                  {([
                    { key: "dark"  as const, icon: Moon, label: t.settings?.dark  ?? "Sombre", color: "text-violet-400" },
                    { key: "light" as const, icon: Sun,  label: t.settings?.light ?? "Clair",  color: "text-amber-400"  },
                  ]).map(({ key, icon: Icon, label, color }) => (
                    <button key={key} onClick={() => { setTheme(key); navigate("root"); }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all
                        ${theme === key ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20" : "text-slate-300 hover:bg-white/[0.04] border border-transparent"}`}>
                      <Icon size={20} className={`${color} flex-shrink-0`} />{label}
                      {theme === key && <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}

              {panel === "language" && (
                <motion.div key="language" variants={slideVariants} initial={enter} animate="center" exit={exit} transition={{ duration: 0.22 }} className="absolute inset-0 p-4 space-y-1">
                  <p className="px-5 pt-2 pb-3 text-[10px] font-black uppercase tracking-widest text-slate-600">{t.settings?.language ?? "Langue"}</p>
                  {([
                    { key: "fr" as const, flag: "🇫🇷", label: "Français" },
                    { key: "en" as const, flag: "🇺🇸", label: "English"  },
                  ]).map(({ key, flag, label }) => (
                    <button key={key} onClick={() => { setLang(key); navigate("root"); }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all
                        ${lang === key ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20" : "text-slate-300 hover:bg-white/[0.04] border border-transparent"}`}>
                      <span className="text-2xl leading-none">{flag}</span>{label}
                      {lang === key && <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400" />}
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

// ─── MobileFullScreen ────────────────────────────────────────────────────────
function MobileFullScreen({
  onClose, userData, t, lang, setLang, theme, setTheme,
}: {
  onClose: () => void;
  userData: { name: string; email: string; avatar: string };
  t: any;
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
  theme: string;
  setTheme: (v: string) => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-[#0d1117] flex flex-col w-full h-screen overflow-y-auto"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      <div className="sticky top-0 z-20 bg-[#0d1117] flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/[0.06]">
        <p className="text-[12px] text-slate-500 font-medium">{userData.email}</p>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 py-6">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-cyan-500/40 ring-offset-4 ring-offset-[#0d1117] mb-4">
          {userData.avatar ? (
            <img src={userData.avatar} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500/40 to-violet-500/30 flex items-center justify-center">
              <User size={36} className="text-cyan-300" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white capitalize mb-1">
          {t.dashboard?.welcome ?? "Bonjour,"} {userData.name} !
        </h2>
        <button className="mt-4 px-8 py-2.5 rounded-full border border-white/[0.15] text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition-all w-full max-w-xs">
          Gérer votre compte Vie+
        </button>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1 relative">
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-white/[0.04] transition-all group"
        >
          <Settings size={20} className="text-slate-500 flex-shrink-0 group-hover:text-slate-300 transition-colors" />
          <span className="flex-1 text-left text-[15px] font-medium">{t.settings?.title ?? "Paramètres"}</span>
          <ChevronRight size={16} className="opacity-30 group-hover:opacity-60" />
        </button>

        <div className="mx-5 h-px bg-white/[0.05]" />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-all group"
        >
          <LogOut size={20} className="flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors" />
          <span className="text-[15px] font-medium">{t.nav?.logout ?? "Se déconnecter"}</span>
        </button>

        <MobileSettingsPage
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          lang={lang} setLang={setLang}
          theme={theme} setTheme={setTheme}
          t={t}
        />
      </div>

      <div className="flex justify-center gap-6 py-6 border-t border-white/[0.05]">
        <span className="text-[11px] text-slate-700 hover:text-slate-500 cursor-pointer transition-colors">Confidentialité</span>
        <span className="text-[11px] text-slate-700 hover:text-slate-500 cursor-pointer transition-colors">Conditions</span>
      </div>
    </motion.div>
  );
}

// ─── DesktopDropdown ─────────────────────────────────────────────────────────
function DesktopDropdown({
  onClose, userData, t, lang, setLang, theme, setTheme,
}: {
  onClose: () => void;
  userData: { name: string; email: string; avatar: string };
  t: any;
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
  theme: string;
  setTheme: (v: string) => void;
}) {
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{    opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-80 rounded-3xl overflow-hidden
          bg-[#1a2030]/98 backdrop-blur-2xl
          border border-white/[0.08]
          shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

        <div className="px-6 pt-6 pb-5 flex flex-col items-center border-b border-white/[0.06] relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            <X size={14} />
          </button>
          <p className="text-[11px] text-slate-500 mb-4 font-medium">{userData.email}</p>
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-[#1a2030] mb-3">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/40 to-violet-500/30 flex items-center justify-center">
                <User size={28} className="text-cyan-300" />
              </div>
            )}
          </div>
          <h3 className="text-[17px] font-bold text-white capitalize mb-4">
            {t.dashboard?.welcome ?? "Bonjour,"} {userData.name} !
          </h3>
          <button className="px-5 py-1.5 rounded-full border border-white/[0.12] text-[12px] font-semibold text-slate-300 hover:bg-white/[0.05] transition-all">
            Gérer votre compte Vie+
          </button>
        </div>

        <div className="p-2">
          <button
            ref={settingsBtnRef}
            onClick={() => setSettingsOpen(v => !v)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all group
              ${settingsOpen ? "text-cyan-400 bg-cyan-500/[0.08]" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}
          >
            <Settings size={18} className={`flex-shrink-0 transition-all duration-500 ${settingsOpen ? "rotate-90 text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
            <span className="flex-1 text-left font-medium">{t.settings?.title ?? "Paramètres"}</span>
            <ChevronRight size={13} className="opacity-30" />
          </button>
          <div className="my-1 h-px bg-white/[0.05]" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] rounded-2xl transition-all group"
          >
            <LogOut size={18} className="flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors" />
            <span className="font-medium">{t.nav?.logout ?? "Se déconnecter"}</span>
          </button>
        </div>

        <div className="px-4 pb-4 pt-1 flex justify-center gap-5">
          <span className="text-[10px] text-slate-700 hover:text-slate-500 cursor-pointer transition-colors">Confidentialité</span>
          <span className="text-[10px] text-slate-700 hover:text-slate-500 cursor-pointer transition-colors">Conditions</span>
        </div>
      </motion.div>

      <SettingsCascade
        open={settingsOpen}
        onClose={handleSettingsClose}
        lang={lang} setLang={setLang}
        theme={theme} setTheme={setTheme}
        t={t} anchorRef={settingsBtnRef}
      />
    </>
  );
}

// ─── MenuButton ───────────────────────────────────────────────────────────────
export default function MenuButton() {
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme]       = useState<string>("dark");
  const [isOpen, setIsOpen]     = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [userData, setUserData] = useState({ name: "", email: "", avatar: "" });
  const [mounted, setMounted]   = useState(false);

  // ── Ref sur le bouton avatar pour calculer la position du dropdown ──────────
  const buttonRef   = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  // ── Tous les hooks AVANT tout return conditionnel ───────────────────────────
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserData({
          name:   (user.user_metadata?.full_name || user.email?.split("@")[0] || "").split(" ")[0],
          email:  user.email || "",
          avatar: user.user_metadata?.avatar_url || "",
        });
      }
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isOpen && isMobile) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, isMobile]);

  // ── Calcule la position du dropdown depuis le bouton ────────────────────────
  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top:   rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(v => !v);
  };

  // ── Évite le flash SSR ──────────────────────────────────────────────────────
  if (isMobile === null) return null;

  const sharedProps = { onClose: () => setIsOpen(false), userData, t, lang, setLang, theme, setTheme };

  return (
    <>
      {/* ── BACKDROP portalisé dans body — bloque la page SOUS le dropdown ── */}
      {mounted && isOpen && !isMobile && createPortal(
        <div
          className="fixed inset-0 bg-black/40"
          style={{ zIndex: 9997 }}
          onClick={() => setIsOpen(false)}
        />,
        document.body
      )}

      {/* ── DROPDOWN portalisé dans body — totalement libre du Header ── */}
      {mounted && isOpen && !isMobile && createPortal(
        <div
          className="fixed"
          style={{ top: dropdownPos.top, right: dropdownPos.right, zIndex: 9999 }}
        >
          <AnimatePresence>
            <DesktopDropdown {...sharedProps} />
          </AnimatePresence>
        </div>,
        document.body
      )}

      {/* ── BOUTON AVATAR — simple, sans z-index ── */}
      <div ref={buttonRef}>
        <button
          onClick={handleOpen}
          className={`w-9 h-9 rounded-full overflow-hidden flex-shrink-0
            transition-all duration-200
            ring-2 ring-offset-2 ring-offset-slate-950
            ${isOpen ? "ring-cyan-400" : "ring-white/20 hover:ring-cyan-400/60"}`}
        >
          {userData.avatar ? (
            <img src={userData.avatar} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500/50 to-violet-500/40 flex items-center justify-center">
              <User size={16} className="text-cyan-200" />
            </div>
          )}
        </button>
      </div>

      {/* ── MENU MOBILE — inchangé ── */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[1000000] bg-[#0d1117]">
              <MobileFullScreen {...sharedProps} />
            </div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}