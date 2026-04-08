// components/UserMenu.tsx
import { LogOut, Moon, User } from "lucide-react";

export default function UserMenu() {
  return (
    <div className="w-64 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* ENTÊTE DU MENU (Image + Nom) */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
            <User className="text-cyan-400" size={20} />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Utilisateur</p>
          <p className="text-[10px] text-cyan-400/70 uppercase font-black">Étudiant L2</p>
        </div>
      </div>

      {/* OPTIONS */}
      <div className="p-2 space-y-1">
        <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 rounded-2xl transition-colors">
          <div className="flex items-center gap-3">
            <Moon size={18} />
            <span>Mode Sombre</span>
          </div>
          <div className="w-8 h-4 bg-cyan-500/20 rounded-full relative">
            <div className="absolute right-1 top-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </div>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}