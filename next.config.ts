//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images: {
    unoptimized: true,   // <--- INDISPENSABLE : Pour que tes images s'affichent sur Android
  },
  /* tes autres options ici si besoin */
};

export default nextConfig;