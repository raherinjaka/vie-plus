// components/StatCard.tsx
import { ReactNode } from "react";

export default function StatCard({ title, value, icon }: { title: string, value: string, icon: ReactNode }) {
  return (
    <div className="p-5 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">{icon}</div>
      </div>
      <div>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{title}</p>
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
    </div>
  );
}