"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu si on clique sur un lien
  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/")) {
      router.push(href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full px-6 py-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between items-center z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md border-b border-white/5 bg-black/60" : "backdrop-blur-md border-b border-white/5"
      }`}>
        {/* Logo */}
        <h1
          className="text-white text-2xl font-black italic tracking-tighter cursor-pointer"
          onClick={() => router.push("/")}
        >
          VIE<span className="text-cyan-400">+</span>
        </h1>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-3 items-center">
          <button
            onClick={() => router.push("/login")}
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors px-3 py-2"
          >
            Se connecter
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-black px-5 py-2 rounded-full transition-colors"
          >
            Commencer
          </button>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 focus:outline-none"
          aria-label="Menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-white origin-center"
          />
          <motion.span
            animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-white"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-white origin-center"
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {/* Nav links */}
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-slate-300 hover:text-white text-base font-medium py-3 border-b border-white/5 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 mt-5">
                <button
                  onClick={() => handleNavClick("/register")}
                  className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-2xl text-sm transition-colors tracking-tight"
                >
                  Commencer gratuitement
                </button>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="w-full py-3.5 border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl text-sm transition-colors"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}