// components/contact/AnimatedEmoji.tsx
"use client";

import { type JSX } from "react";
import { motion } from "framer-motion";

type EmojiType = "crying" | "sad" | "neutral" | "happy" | "excited" | "love";

interface AnimatedEmojiProps {
  type: EmojiType;
  size?: number;
  animate?: boolean;
}

const emojiData: Record<EmojiType, {
  label: string;
  face: string;       // couleur de base du visage
  eyes: JSX.Element;
  mouth: JSX.Element;
  extras?: JSX.Element;
  bounceY?: number[];
}> = {
  crying: {
    label: "Mauvais",
    face: "#FFD93D",
    bounceY: [0, -4, 0, -2, 0],
    eyes: (
      <>
        {/* Yeux fermés / plissés */}
        <path d="M9 10 Q10 8.5 11 10" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M17 10 Q18 8.5 19 10" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </>
    ),
    mouth: (
      <path d="M10 18 Q14 15 18 18" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    ),
    extras: (
      <>
        {/* Larmes qui tombent */}
        <motion.ellipse
          cx="9.5" cy="13"
          rx="1.2" ry="1.8"
          fill="#74B9FF"
          animate={{ cy: [13, 22], opacity: [1, 0], scaleY: [1, 1.3] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.3, ease: "easeIn" }}
        />
        <motion.ellipse
          cx="18.5" cy="13"
          rx="1.2" ry="1.8"
          fill="#74B9FF"
          animate={{ cy: [13, 22], opacity: [1, 0], scaleY: [1, 1.3] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6, ease: "easeIn" }}
        />
        {/* Sourcils froncés */}
        <path d="M8 7.5 Q10 6.5 11.5 7.8" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        <path d="M16.5 7.8 Q18 6.5 20 7.5" stroke="#333" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      </>
    ),
  },

  sad: {
    label: "Passable",
    face: "#FFD93D",
    bounceY: [0, -2, 0],
    eyes: (
      <>
        <circle cx="10" cy="10" r="1.8" fill="#333"/>
        <circle cx="18" cy="10" r="1.8" fill="#333"/>
        {/* Petite larme */}
        <ellipse cx="10" cy="13.5" rx="1" ry="1.5" fill="#74B9FF" opacity="0.7"/>
      </>
    ),
    mouth: (
      <path d="M10 18 Q14 15.5 18 18" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    ),
    extras: (
      <>
        <path d="M8 8 Q10 6.8 11.5 8" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M16.5 8 Q18 6.8 20 8" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </>
    ),
  },

  neutral: {
    label: "Moyen",
    face: "#FFD93D",
    bounceY: [0, -1, 0],
    eyes: (
      <>
        <circle cx="10" cy="10" r="1.8" fill="#333"/>
        <circle cx="18" cy="10" r="1.8" fill="#333"/>
      </>
    ),
    mouth: (
      <line x1="10" y1="17.5" x2="18" y2="17.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    ),
  },

  happy: {
    label: "Bien",
    face: "#FFD93D",
    bounceY: [0, -5, 0, -3, 0],
    eyes: (
      <>
        {/* Yeux en demi-lune souriants */}
        <path d="M8.5 9.5 Q10 7.5 11.5 9.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M16.5 9.5 Q18 7.5 19.5 9.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </>
    ),
    mouth: (
      <path d="M9 16 Q14 21 19 16" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    ),
    extras: (
      <>
        {/* Joues roses */}
        <ellipse cx="8" cy="15" rx="2.5" ry="1.5" fill="#FF6B8A" opacity="0.35"/>
        <ellipse cx="20" cy="15" rx="2.5" ry="1.5" fill="#FF6B8A" opacity="0.35"/>
      </>
    ),
  },

  excited: {
    label: "Très bien",
    face: "#FFD93D",
    bounceY: [0, -8, 2, -5, 0],
    eyes: (
      <>
        <path d="M8.5 9.5 Q10 7 11.5 9.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M16.5 9.5 Q18 7 19.5 9.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </>
    ),
    mouth: (
      <path d="M8 15.5 Q14 22.5 20 15.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    ),
    extras: (
      <>
        {/* Joues très roses */}
        <ellipse cx="7.5" cy="15.5" rx="3" ry="2" fill="#FF6B8A" opacity="0.45"/>
        <ellipse cx="20.5" cy="15.5" rx="3" ry="2" fill="#FF6B8A" opacity="0.45"/>
        {/* Étincelles */}
        <motion.g
          animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.3, 0.8, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: "3px 5px" }}
        >
          <text x="1" y="7" fontSize="4" fill="#FFE066">✦</text>
        </motion.g>
        <motion.g
          animate={{ rotate: [0, -20, 10, 0], scale: [1, 1.4, 0.7, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
          style={{ transformOrigin: "21px 4px" }}
        >
          <text x="20" y="6" fontSize="3.5" fill="#FFE066">✦</text>
        </motion.g>
      </>
    ),
  },

  love: {
    label: "Excellent",
    face: "#FFD93D",
    bounceY: [0, -10, 2, -6, 0],
    eyes: (
      <>
        {/* Yeux en cœur */}
        <motion.path
          d="M8 9 C8 7.5 10 6.5 10 8.5 C10 6.5 12 7.5 12 9 C12 10.5 10 12 10 12 C10 12 8 10.5 8 9Z"
          fill="#FF4757"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.path
          d="M16 9 C16 7.5 18 6.5 18 8.5 C18 6.5 20 7.5 20 9 C20 10.5 18 12 18 12 C18 12 16 10.5 16 9Z"
          fill="#FF4757"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
        />
      </>
    ),
    mouth: (
      <path d="M8 15.5 Q14 22.5 20 15.5" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    ),
    extras: (
      <>
        <ellipse cx="7.5" cy="15.5" rx="3" ry="2" fill="#FF6B8A" opacity="0.5"/>
        <ellipse cx="20.5" cy="15.5" rx="3" ry="2" fill="#FF6B8A" opacity="0.5"/>
        {/* Petits cœurs qui flottent */}
        <motion.text
          x="1" y="5" fontSize="4" fill="#FF6B8A"
          animate={{ y: [5, -2, 5], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >♥</motion.text>
        <motion.text
          x="21" y="4" fontSize="3" fill="#FF4757"
          animate={{ y: [4, -3, 4], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
        >♥</motion.text>
      </>
    ),
  },
};

export default function AnimatedEmoji({ type, size = 56, animate = true }: AnimatedEmojiProps) {
  const emoji = emojiData[type];

  return (
    <motion.div
      animate={animate ? { y: emoji.bounceY ?? [0, -4, 0] } : {}}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 28 28"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {/* Ombre douce */}
        <ellipse cx="14" cy="27" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />

        {/* Corps du visage */}
        <motion.circle
          cx="14" cy="14" r="13"
          fill={emoji.face}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Brillance */}
        <ellipse cx="9" cy="8" rx="3.5" ry="2" fill="rgba(255,255,255,0.35)" transform="rotate(-20, 9, 8)"/>

        {/* Extras (larmes, étincelles, joues...) */}
        {emoji.extras}

        {/* Yeux */}
        {emoji.eyes}

        {/* Bouche */}
        {emoji.mouth}
      </svg>
    </motion.div>
  );
}

export type { EmojiType };