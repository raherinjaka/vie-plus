import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vie+ | Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-white bg-[#050505]">

      {/* FOND ABSTRAIT */}
      <div className="fixed inset-0 pointer-events-none -z-10 h-full w-full">
        <div
          className="absolute right-[-20%] top-[-10%] h-[120%] w-[80%] opacity-40 blur-[80px]"
          style={{
            background: 'radial-gradient(ellipse at center, #252525 0%, transparent 70%)',
            transform: 'rotate(-15deg) skewX(-10deg)',
          }}
        />
        <div className="absolute right-[5%] top-[10%] h-[80%] w-[40%] opacity-30 border-r-[100px] border-white/5 blur-[100px] rounded-[100%]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      

      {/* ✅ Pas de max-w, pas de px, pas de mx-auto — chaque page gère son propre layout */}
      <div className="relative z-10 w-full">
        {children}
      </div>

    </div>
  );
}