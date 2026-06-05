// components/contact/FuturisticInput.tsx
"use client";

import { motion } from "framer-motion";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, type ReactNode } from "react";

// ── Input ──────────────────────────────────────────────────────────────────
interface FuturisticInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: ReactNode; // ex : bouton œil pour password
}

export const FuturisticInput = forwardRef<HTMLInputElement, FuturisticInputProps>(
  ({ label, suffix, className = "", ...props }, ref) => (
    <div className="relative group">
      <input
        ref={ref}
        {...props}
        className={[
          "w-full bg-transparent border-none outline-none py-2 pr-8 text-white text-base relative z-10 peer",
          className,
        ].join(" ")}
      />
      {/* Label flottant */}
      <span
        className="
          absolute left-0 top-2 text-slate-500 text-sm
          transition-all duration-500 pointer-events-none
          peer-focus:-translate-y-7 peer-focus:text-cyan-400 peer-focus:text-xs
          peer-valid:-translate-y-7 peer-valid:text-cyan-400 peer-valid:text-xs
        "
      >
        {label}
      </span>

      {/* Fond animé qui monte au focus */}
      <i
        className="
          absolute left-0 bottom-0 w-full h-[2px]
          bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg
          transition-all duration-500 pointer-events-none
          peer-focus:h-[44px] peer-valid:h-[44px]
          opacity-70 peer-focus:opacity-100
        "
      />

      {/* Suffix (ex : oeil password) */}
      {suffix && (
        <div className="absolute right-1 top-1.5 z-20">{suffix}</div>
      )}
    </div>
  )
);
FuturisticInput.displayName = "FuturisticInput";

// ── Textarea ───────────────────────────────────────────────────────────────
interface FuturisticTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FuturisticTextarea = forwardRef<HTMLTextAreaElement, FuturisticTextareaProps>(
  ({ label, className = "", ...props }, ref) => (
    <div className="relative group">
      <textarea
        ref={ref}
        {...props}
        className={[
          "w-full bg-transparent border-none outline-none py-2 text-white text-base relative z-10 peer resize-none",
          className,
        ].join(" ")}
      />
      <span
        className="
          absolute left-0 top-2 text-slate-500 text-sm
          transition-all duration-500 pointer-events-none
          peer-focus:-translate-y-7 peer-focus:text-cyan-400 peer-focus:text-xs
          peer-valid:-translate-y-7 peer-valid:text-cyan-400 peer-valid:text-xs
        "
      >
        {label}
      </span>
      <i
        className="
          absolute left-0 bottom-0 w-full h-[2px]
          bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg
          transition-all duration-500 pointer-events-none
          peer-focus:opacity-100 opacity-70
          peer-focus:h-auto peer-focus:bottom-0
        "
      />
      {/* Bordure complète pour textarea */}
      <div className="absolute inset-0 rounded-xl border border-cyan-500/0 pointer-events-none transition-colors duration-300 group-focus-within:border-cyan-500/25" />
    </div>
  )
);
FuturisticTextarea.displayName = "FuturisticTextarea";