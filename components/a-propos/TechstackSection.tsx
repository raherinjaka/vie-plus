"use client";

import { motion } from "framer-motion";
import { Layers, Code2, Wind, Database, Zap, BarChart2, FileDown, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SectionLabel from "./SectionLabel";
import TechBadge from "./TechBadge";

const techs = [
  { label: "Next.js 15",     icon: Layers   },
  { label: "TypeScript",     icon: Code2    },
  { label: "Tailwind CSS",   icon: Wind     },
  { label: "Supabase",       icon: Database },
  { label: "Framer Motion",  icon: Zap      },
  { label: "Recharts",       icon: BarChart2},
  { label: "jsPDF",          icon: FileDown },
  { label: "Turbopack",      icon: Shield   },
];

export default function TechStackSection() {
  const { t } = useLanguage() as any;

  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        
        <SectionLabel>
          {t?.aboutPage?.techStack?.sectionLabel ?? "Stack technique"}
        </SectionLabel>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
          {t?.aboutPage?.techStack?.title ?? "Construit avec soin"}
        </h2>

        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {t?.aboutPage?.techStack?.desc ?? "Des outils modernes et fiables."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {techs.map((tech) => (
          <TechBadge key={tech.label} {...tech} />
        ))}
      </motion.div>
    </section>
  );
}