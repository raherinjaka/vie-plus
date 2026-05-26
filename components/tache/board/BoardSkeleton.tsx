// ============================================================
// components/tache/board/BoardSkeleton.tsx
// Skeleton affiché pendant le chargement initial
// ============================================================

export default function BoardSkeleton() {
    return (
      <div className="flex flex-col h-screen bg-[#0f0f13] overflow-hidden">
        {/* Header skeleton */}
        <div className="px-6 pt-5 pb-3 space-y-3">
          <div className="h-8 w-48 bg-zinc-800/60 rounded-lg animate-pulse" />
          <div className="h-0.5 w-full bg-zinc-800/40 rounded-full" />
        </div>
  
        {/* Colonnes skeleton */}
        <div className="flex gap-4 px-6 pt-2 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[272px] space-y-3"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Titre colonne */}
              <div className="h-9 bg-zinc-800/60 rounded-xl animate-pulse" />
  
              {/* Cartes */}
              {Array.from({ length: i + 1 }).map((_, j) => (
                <div
                  key={j}
                  className="h-16 bg-zinc-900/80 border border-zinc-800/50 
                             rounded-xl animate-pulse"
                  style={{ animationDelay: `${(i + j) * 80}ms` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }