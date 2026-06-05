"use client";

import { motion } from "framer-motion";
import { ExternalLink, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ContactButton from "@/components/contact/ContactButton";

// Typage structurel pour sécuriser l'accès aux traductions
interface TranslationStructure {
  aboutPage?: {
    credits?: {
      title?: string;
      desc?: string;
      github?: string;
      version?: string;
    };
  };
}

export default function CreditsSection() {
  const context = useLanguage();
  const t = context?.t as TranslationStructure | undefined;

  const title = t?.aboutPage?.credits?.title ?? "Fait avec passion";
  const desc = t?.aboutPage?.credits?.desc ?? "VIE+ est un projet scolaire.";
  const githubText = t?.aboutPage?.credits?.github ?? "GitHub";
  const versionText = t?.aboutPage?.credits?.version ?? "VIE+ · v1.0.0 · 2026";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-[2rem] border border-slate-800 bg-slate-950/40 backdrop-blur-sm p-8 sm:p-12 overflow-hidden text-center group"
    >
      {/* Lueur d'ambiance asymétrique en arrière-plan */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/[0.03] blur-3xl rounded-full pointer-events-none transition-all duration-700 group-hover:bg-cyan-500/[0.05]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -right-12 w-48 h-48 bg-slate-500/[0.02] blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Conteneur d'icône épuré */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-rose-500/80 mb-4 transition-colors duration-300 group-hover:text-rose-500">
          <Heart size={16} className="fill-current animate-pulse [animation-duration:3s]" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-slate-200 mb-2">
          {title}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
          {desc}
        </p>

        {/* Liens d'action */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-xs sm:max-w-none">
          <ContactButton />

          <a
            href="https://github.com/raherinjaka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-medium hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900 transition-all duration-200 group/link focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <span>{githubText}</span>
            <ExternalLink
              size={13}
              className="text-slate-400 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-cyan-400"
            />
          </a>
        </div>

        {/* Versioning discret */}
        <span className="mt-8 text-[11px] font-medium tracking-wider text-slate-600 uppercase">
          {versionText}
        </span>
      </div>
    </motion.section>
  );
}