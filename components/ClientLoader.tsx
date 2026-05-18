"use client";

import { useState, useEffect } from "react";

export default function ClientLoader({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"in" | "spin" | "out" | "done">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("spin"), 400);
    const t2 = setTimeout(() => setPhase("out"),  2200);
    const t3 = setTimeout(() => setPhase("done"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const plusClass =
    phase === "in"   ? "animate-plus-in" :
    phase === "spin" ? "animate-spin-glitch" :
    phase === "out"  ? "animate-spin-glitch" : "";

  return (
    <>
      {phase !== "done" && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black
          ${phase === "out" ? "animate-fade-out" : ""}`}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-5xl font-extrabold tracking-tighter text-white"
              style={{ animation: "slideInLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              VIE
            </span>
            <div
              className={`w-10 h-[42px] ${plusClass}`}
              style={{ filter: "drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))" }}
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15V85M15 50H85" stroke="#00E5FF" strokeWidth="16" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <main
        className="bg-black min-h-screen"
        style={{ opacity: phase === "done" ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        {children}
      </main>
    </>
  );
}