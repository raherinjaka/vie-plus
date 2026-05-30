"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BoardShell from "@/components/tache/board/BoardShell";
import { QueryProvider } from "@/components/tache/providers/QueryProvider";
import MobileNav from "@/components/MobileNav";
import NavDrawer from "@/components/NavDrawer";
import { useLanguage } from "@/context/LanguageContext";

export default function TachePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage() as any;

  useEffect(() => {
    document.title = t?.tachePage?.pageTitle;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Erreur auth:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, t]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-sky-600 dark:bg-slate-900 text-slate-200 transition-colors duration-300">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-cyan-500/20 blur-xl" />
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-800 border-t-cyan-400" />
        </div>
        <p className="mt-6 text-xs font-medium tracking-widest text-slate-500 uppercase animate-pulse">
          {t?.tachePage?.loading}
        </p>
      </div>
    );
  }
  return (
    <QueryProvider>
      {/* Fond avec quadrillage uniforme (Plus de bandes noires sous le header/footer) */}
      <div className="flex min-h-screen w-full bg-sky-600 dark:bg-slate-900 text-slate-100 overflow-x-hidden transition-colors duration-300">
        
        <div className="fixed top-4 right-4 z-[100]">
          <NavDrawer />
        </div>
  
        <main className="relative z-10 flex-1 w-full pt-20 pb-24 px-6 md:px-10 max-w-[1600px] mx-auto">

          <div className="mb-8 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-cyan-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {t.category} {/* Affiche "ORGANISATION" ou "ORGANIZATION" */}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              {t.titleMain}
              <span className="text-cyan-400">{t.titleHighlight}</span> 
              {/* Affiche "MES TÂCHES" (avec Tâches en cyan) ou "MY TASKS" */}
            </h1>
          </div>
  
          {/* Ton tableau de type Trello (Kanban) */}
          <BoardShell />
          
        </main>
  
        <MobileNav />
      </div>
    </QueryProvider>
  );
}