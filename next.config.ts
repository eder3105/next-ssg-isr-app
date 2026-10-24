import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes se cargan directo desde su origen (evita 429 del optimizador)
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "rickandmortyapi.com" },
    ],
  },
  experimental: {
    // Menos paralelismo al generar páginas estáticas, para no saturar la API
    cpus: 1,
    staticGenerationMaxConcurrency: 2,
  },
};

export default nextConfig;
