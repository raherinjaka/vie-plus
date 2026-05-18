"use client";

import MenuButton from "./MenuButton";
import './CreativeText.css';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center py-5 px-10 bg-black/80 backdrop-blur-md border-b border-white/10 text-white">

      {/* LOGO — Variation B */}
      <div className="flex items-center cursor-pointer select-none">
        <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* VIE en italique serif */}
          <text
            x="0" y="28"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="28"
            fontWeight="700"
            fontStyle="italic"
            fill="white"
            letterSpacing="-1"
          >
            VIE
          </text>

          {/* Séparateur discret */}
          <line x1="82" y1="4" x2="82" y2="32" stroke="#ffffff18" strokeWidth="1"/>

          {/* Cercle cyan */}
          <circle cx="104" cy="18" r="14" stroke="#00E5FF" strokeWidth="1.5"/>

          {/* Croix + à l'intérieur */}
          <line x1="104" y1="10" x2="104" y2="26" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="96"  y1="18" x2="112" y2="18" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* MENU */}
      <MenuButton />

    </nav>
  );
}