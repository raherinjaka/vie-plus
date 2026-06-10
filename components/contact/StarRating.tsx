// components/contact/StarRating.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedEmoji, { EmojiType } from "./AnimatedEmoji";
import { useLanguage } from "@/context/LanguageContext";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

const ratingToEmoji: Record<number, EmojiType> = {
  1: "crying",
  2: "sad",
  3: "neutral",
  4: "happy",
  5: "excited",  // ou "love" si tu préfères
};

const { t } = useLanguage() as { t: any };
const ratingLabels: Record<number, string> = {
  1: t.contact.emojis.crying,
  2: t.contact.emojis.sad,
  3: t.contact.emojis.neutral,
  4: t.contact.emojis.happy,
  5: t.contact.emojis.excited,
};

const ratingColors: Record<number, string> = {
  1: "#FF4757",
  2: "#FF6348",
  3: "#FFA502",
  4: "#2ED573",
  5: "#00D2FF",
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Emoji animé */}
      <AnimatePresence mode="wait">
        {active > 0 ? (
          <motion.div
            key={active}
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <AnimatedEmoji type={ratingToEmoji[active]} size={72} />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center"
          >
            <span className="text-slate-600 text-xs text-center leading-tight px-1">ton<br/>{t.contact.rating.placeholder}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      <AnimatePresence mode="wait">
        {active > 0 && (
          <motion.p
            key={active + "-label"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-semibold tracking-wide"
            style={{ color: ratingColors[active] }}
          >
            {ratingLabels[active]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Étoiles */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <motion.button
            key={s}
            type="button"
            whileHover={{ scale: 1.3, rotate: 15 }}
            whileTap={{ scale: 0.85, rotate: -10 }}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
            className="focus:outline-none"
          >
            <motion.svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              animate={{
                fill: s <= active ? ratingColors[active] ?? "#FFD93D" : "transparent",
                stroke: s <= active ? ratingColors[active] ?? "#FFD93D" : "#374151",
                scale: s === active ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}