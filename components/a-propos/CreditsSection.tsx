"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CreditsSection() {
  const { t } = useLanguage() as any;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10 overflow-hidden text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-transparent pointer-events-none rounded-3xl" />

      <div className="relative">
        <div className="text-3xl mb-4">❤️</div>

        <h2 className="text-xl font-bold text-slate-100 mb-2">{t?.aboutPage?.credits?.title ?? "Fait avec passion"}</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          {t?.aboutPage?.credits?.desc ?? "VIE+ est un projet scolaire."}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:contact@vieplus.app"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-300 text-sm hover:border-cyan-500/25 hover:text-cyan-300 transition-all duration-200"
          >
            <Mail size={14} />
            {t?.aboutPage?.credits?.email ?? "contact@vieplus.app"}
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-300 text-sm hover:border-cyan-500/25 hover:text-cyan-300 transition-all duration-200"
          >
            <ExternalLink size={14} />
              {t?.aboutPage?.credits?.github ?? "GitHub"}
            <ChevronRight size={12} className="text-slate-500" />
          </a>
        </div>

        <p className="mt-6 text-slate-600 text-xs">
          {t?.aboutPage?.credits?.version ?? "VIE+ · v1.0.0 · 2025"}
        </p>

      </div>
    </motion.section>
  );
}