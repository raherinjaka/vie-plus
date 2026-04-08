// components/MenuButton.tsx
"use client";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. L'OVERLAY : Prend TOUT l'écran derrière le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen bg-black/0 z-[998]" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <div className="relative z-[999]">
        {/* 2. LE BOUTON (Les 3 traits) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-3 hover:bg-white/5 rounded-xl transition-all group relative z-[1000]"
        >
          <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
          <div className={`h-0.5 bg-cyan-400 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4 ml-auto'}`} />
          <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
        </button>

        {/* 3. LE MENU USER */}
        {isOpen && (
          <div className="absolute right-0 mt-3 animate-in fade-in zoom-in duration-200 z-[1000]">
             <UserMenu />
          </div>
        )}
      </div>
    </>
  );
}