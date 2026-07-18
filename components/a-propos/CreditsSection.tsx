//components/apropos/creditSection.tsx
"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ContactButton from "@/components/contact/ContactButton";

interface TranslationStructure {
  aboutPage?: {
    credits?: {
      title?: string;
      desc?: string;
      version?: string;
    };
  };
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export default function CreditsSection() {
  const context = useLanguage();
  const t = context?.t as TranslationStructure | undefined;

  const title = t?.aboutPage?.credits?.title ?? "Fait avec passion";
  const desc = t?.aboutPage?.credits?.desc ?? "VIE+ est un projet scolaire.";
  const versionText = t?.aboutPage?.credits?.version ?? "VIE+ · v1.0.0 · 2026";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-[2rem] border border-slate-800 bg-slate-950/40 backdrop-blur-sm p-8 sm:p-12 overflow-hidden text-center group"
    >
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/[0.03] blur-3xl rounded-full pointer-events-none transition-all duration-700 group-hover:bg-cyan-500/[0.05]" aria-hidden="true" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-slate-500/[0.02] blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-rose-500/80 mb-4 transition-colors duration-300 group-hover:text-rose-500">
          <Heart size={16} className="fill-current animate-pulse [animation-duration:3s]" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-slate-200 mb-2">{title}</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">{desc}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {/* Contact */}
          <ContactButton />

          {/* GitHub */}
          <motion.a
            href="https://github.com/raherinjaka"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir le profil GitHub"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            whileHover={{ scale: 1.15, rotate: 8 }}
            whileTap={{ scale: 0.92, rotate: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <GitHubIcon className="w-5 h-5" />
          </motion.a>

          {/* Facebook */}
          <motion.a
            href="https://www.facebook.com/profile.php?id=100074319544947"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir le profil Facebook"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-[#1877F2] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20"
            whileHover={{ scale: 1.15, rotate: -8 }}
            whileTap={{ scale: 0.92, rotate: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <FacebookIcon className="w-5 h-5" />
          </motion.a>
        </div>

        <span className="mt-8 text-[11px] font-medium tracking-wider text-slate-600 uppercase">
          {versionText}
        </span>
      </div>
    </motion.section>
  );
}