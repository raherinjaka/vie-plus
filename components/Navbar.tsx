"use client";

import MenuButton from "./MenuButton";
import Link from 'next/link';

import './CreativeText.css'; 

export default function Navbar() {
  const navLinks = [
    { name: "Tableau de bord", href: "/dashboard" },
    { name: "Mon Argent", href: "/dashboard/budget" },
    { name: "Mes Tâches", href: "/dashboard/tasks" },
    { name: "Objectifs", href: "/dashboard/goals" },
    { name: "À propos", href: "/dashboard/about" },
  ];


  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center py-5 px-10 bg-black/80 backdrop-blur-md border-b border-white/10 text-white">
      
      {/* GAUCHE : Logo */}
      <div className="reveal-left flex items-center gap-2 group cursor-pointer" style={{ animationDelay: '0.1s' }}>
        <span className="text-xl uppercase font-mono font-bold tracking-tighter">
          VIE<span className="text-red-600">.</span>PLUS
        </span>
      </div>

      {/* CENTRE : Liens (Navigation) */}
      <div className="hidden md:flex gap-10 items-center">
        {navLinks.map((link, index) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="reveal-top relative text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 group"
            style={{ animationDelay: `${0.2 + index * 0.15}s` }}
          >
            {link.name}
            {/* Barre rouge au survol */}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <MenuButton />
      </div>

    </nav>
  );
}