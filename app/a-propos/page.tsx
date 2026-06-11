"use client";

import NavDrawer from "@/components/NavDrawer";
import MobileNav from "@/components/MobileNav";

// On commente les sections temporairement pour voir laquelle plante
// import FeaturesSection from "@/components/a-propos/FeaturesSection";
// import HowItWorksSection from "@/components/a-propos/HowitworksSection";
// import TechStackSection from "@/components/a-propos/TechstackSection";
import CreditsSection from "@/components/a-propos/CreditsSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080c12] text-slate-100">
      {/* Nav drawer desktop */}
      <div className="fixed top-4 right-4 z-[100]">
        <NavDrawer />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-32 pt-24 md:pt-16">
        {/* On affiche uniquement la section des crédits qu'on a corrigée */}
        <CreditsSection />
      </main>

      {/* Mobile nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}