"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SectionLabel from "./SectionLabel";
import StepCard from "./StepCard";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HowItWorksSection() {
  const { t } = useLanguage() as any;

  // ✅ Les étapes viennent des traductions
  const steps = t?.aboutPage?.howItWorks?.steps ?? [];

  return (
    <section className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        {/* ✅ Remplacé */}
        <SectionLabel>
          {t?.aboutPage?.howItWorks?.sectionLabel ?? "En 3 étapes"}
        </SectionLabel>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
          {/* ✅ Remplacé */}
          {t?.aboutPage?.howItWorks?.title ?? "Comment ça marche ?"}
        </h2>
      </motion.div>

      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="flex flex-col gap-8"
        >
          {/* ✅ Remplacé — on ajoute le numéro automatiquement */}
          {steps.map((step: { title: string; description: string }, i: number) => (
            <StepCard
              key={i}
              number={String(i + 1)}
              title={step.title}
              description={step.description}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}