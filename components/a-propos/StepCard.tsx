"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

export default function StepCard({ number, title, description, index }: StepCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="relative flex flex-col sm:flex-row items-start gap-5"
    >
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
        <span className="text-cyan-300 font-bold text-lg">{number}</span>
      </div>

      <div className="pt-1">
        <h3 className="text-slate-100 font-semibold text-base mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      {index < 2 && (
        <div className="hidden sm:block absolute left-6 top-14 w-px h-10 bg-gradient-to-b from-cyan-500/30 to-transparent" />
      )}
    </motion.div>
  );
}