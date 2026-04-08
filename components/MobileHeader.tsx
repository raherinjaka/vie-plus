"use client";
import { useState } from "react";
import MobileDrawer from "./MobileDrawer";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center z-[90]">
        <h1 className="text-lg font-black text-white italic">VIE<span className="text-cyan-500">.</span>PLUS</h1>
        
        {/* TON BOUTON AVEC TON STYLE DE TRAITS */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-3 hover:bg-white/5 rounded-xl transition-all relative z-[1000]"
        >
          {/* Trait du haut */}
          <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
          
          {/* Trait du milieu (Cyan) */}
          <div className={`h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4 ml-auto'}`} />
          
          {/* Trait du bas */}
          <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
        </button>
      </header>

      {/* Le tiroir qui s'ouvre */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}