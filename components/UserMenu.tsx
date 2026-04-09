"use client";

import { useEffect, useState } from "react";
import { LogOut, Moon, User } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

export default function UserMenu() {
  const [userData, setUserData] = useState({
    name: "Utilisateur",
    email: "",
    avatar: ""
  });

  const supabase = createClient(
    'https://ykwcledsxlnqkkczcemt.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd2NsZWRzeGxucWtrY3pjZW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDcwOTgsImV4cCI6MjA5MTIyMzA5OH0.Q1H_DSVr_OSKepBPdnA8r9qk0rkLEqY0S5k5KsBmnTc'
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          // Récupère le prénom ou le pseudo avant le @
          name: (user.user_metadata?.full_name || user.email?.split('@')[0]).split(' ')[0],
          email: user.email || "",
          // Récupère l'image Google/GitHub
          avatar: user.user_metadata?.avatar_url || ""
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-72 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* ENTÊTE DU MENU (Design comme ton image) */}
      <div className="p-6 flex flex-col items-center border-b border-white/5 bg-white/5">
        <p className="text-[11px] text-slate-400 mb-4 font-medium tracking-tight">{userData.email}</p>
        
        {/* Conteneur de l'image de profil */}
        <div className="relative group mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[3px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="Profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-cyan-400" size={32} />
              )}
            </div>
          </div>
          {/* Petit bouton appareil photo comme sur ton image */}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white capitalize">Bonjour, {userData.name} !</h3>
        
        <button className="mt-4 px-6 py-2 rounded-full border border-white/20 text-xs font-bold text-slate-300 hover:bg-white/5 transition-all">
          Gérer votre compte Vie+
        </button>
      </div>

      {/* OPTIONS DU MENU */}
      <div className="p-3 space-y-1 bg-slate-950/50">
        <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 rounded-2xl transition-all group">
          <div className="flex items-center gap-3">
            <Moon size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Mode Sombre</span>
          </div>
          <div className="w-8 h-4 bg-cyan-500/20 rounded-full relative">
            <div className="absolute right-1 top-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <LogOut size={18} />
          <span>Se déconnecter de Vie+</span>
        </button>
      </div>
      
      <div className="p-3 text-[10px] text-center text-slate-600 border-t border-white/5 flex justify-center gap-4">
        <span className="hover:text-slate-400 cursor-pointer">Confidentialité</span>
        <span className="hover:text-slate-400 cursor-pointer">Conditions</span>
      </div>
    </div>
  );
}