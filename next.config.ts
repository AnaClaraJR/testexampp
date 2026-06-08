import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ACEITA QUALQUER DOMÍNIO DA INTERNET
      },
      {
        protocol: "http",
        hostname: "**", // Aceita também links HTTP antigos se necessário
      },
    ],
  },
};

export default nextConfig;