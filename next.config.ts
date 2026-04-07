import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // <--- INDISPENSABLE : Génère le dossier /out pour Capacitor
  images: {
    unoptimized: true,   // <--- INDISPENSABLE : Pour que tes images s'affichent sur Android
  },
  /* tes autres options ici si besoin */
};

export default nextConfig;