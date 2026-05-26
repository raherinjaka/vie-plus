"use client";

// ============================================================
// components/tache/providers/QueryProvider.tsx
// Wrapper React Query — doit entourer tous les composants client
// ============================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState pour que chaque session ait son propre QueryClient
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,       // 30s avant re-fetch
            retry: 2,                // 2 tentatives en cas d'erreur
            refetchOnWindowFocus: false, // Pas de re-fetch au focus
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}