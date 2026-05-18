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

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  index: number;
}

export default function FeatureCard({
  icon: Icon, title, description, color, index,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="group relative rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}18 0%, transparent 70%)` }}
      />
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <h3 className="text-slate-100 font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}