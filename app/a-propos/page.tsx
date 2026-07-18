"use client";
//apropos/page.tsx
import NavDrawer from "@/components/NavDrawer";
import MobileNav from "@/components/MobileNav";

import FeaturesSection from "@/components/a-propos/FeaturesSection";
import HowItWorksSection from "@/components/a-propos/HowitworksSection";
import TechStackSection from "@/components/a-propos/TechstackSection";
import CreditsSection from "@/components/a-propos/CreditsSection";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-[#080c12] text-slate-100"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #94a3b8 0%,
            #22d3ee 30%,
            #ffffff 50%,
            #22d3ee 70%,
            #94a3b8 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>


      {/* Nav drawer desktop */}
      <div className="fixed top-4 right-4 z-[100]">
        <NavDrawer />
      </div>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-32 pt-24 md:pt-16">
        <FeaturesSection />
        <HowItWorksSection />
        <TechStackSection />
        <CreditsSection />
      </main>

      {/* Mobile nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}