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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#030712] text-slate-200">
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
      <div className="flex min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden">
        <div className="fixed top-4 right-4 z-[100]">
          <NavDrawer />
        </div>
        <main className="relative z-10 flex-1 w-full pt-16 pb-24">
          <BoardShell />
        </main>
        <MobileNav />
      </div>
    </QueryProvider>
  );
}