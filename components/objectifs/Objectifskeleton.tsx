"use client";

export default function ObjectifSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 flex flex-col gap-4 animate-pulse">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          {/* Badge */}
          <div className="h-4 w-16 rounded-lg bg-slate-800" />
          {/* Title */}
          <div className="h-5 w-3/4 rounded-lg bg-slate-800" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-800/60" />
        </div>
        {/* Ring placeholder */}
        <div className="w-[72px] h-[72px] rounded-full bg-slate-800 flex-shrink-0" />
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-slate-800" />

      {/* Buttons row */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-8 rounded-xl bg-slate-800" />
        ))}
        <div className="w-9 h-8 rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}