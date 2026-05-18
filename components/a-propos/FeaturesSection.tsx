"use client";

import { motion } from "framer-motion";
import { Wallet, Target, CheckSquare, FileDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SectionLabel from "./SectionLabel";
import FeatureCard from "./FeatureCard";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ✅ Les icônes restent en dur car elles ne se traduisent pas
const ICONS = [Wallet, Target, CheckSquare, FileDown];
const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fb923c"];

export default function FeaturesSection() {
  const { t } = useLanguage() as any;

  // ✅ Les textes viennent des traductions
  const items = t?.aboutPage?.features?.items ?? [];

  return (
    <section id="fonctionnalites" className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        {/* ✅ Remplacé */}
        <SectionLabel>{t?.aboutPage?.features?.sectionLabel ?? "Fonctionnalités"}</SectionLabel>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
          {/* ✅ Remplacé */}
          {t?.aboutPage?.features?.title ?? "Ce que fait VIE+"}
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* ✅ Remplacé — on combine icônes (fixes) + textes (traduits) */}
        {items.map((item: { title: string; description: string }, i: number) => (
          <FeatureCard
            key={i}
            icon={ICONS[i]}
            color={COLORS[i]}
            title={item.title}
            description={item.description}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}