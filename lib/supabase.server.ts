// ============================================================
// lib/supabase.server.ts
// Client Supabase pour le côté serveur (Server Components, Route Handlers)
// ============================================================

import { createServerClient as createSupabaseSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  // Dans Next.js 16, cookies() est une Promesse, il faut obligatoirement l'attendre
  const cookieStore = await cookies();

  return createSupabaseSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Le catch évite les crashs quand on tente d'écrire des cookies 
            // depuis un Server Component (RSC) qui fait uniquement de la lecture
          }
        },
      },
    }
  );
}