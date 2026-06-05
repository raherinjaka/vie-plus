"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import ContactModal from "./ContactModal";

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-medium hover:border-slate-700 hover:text-slate-100 hover:bg-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      >
        <Mail size={13} className="text-slate-400" />
        <span>Nous contacter</span>
      </button>

      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}