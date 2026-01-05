import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // New York Times
      {
        protocol: "https",
        hostname: "static01.nyt.com",
      },
      // The Guardian
      {
        protocol: "https",
        hostname: "i.guim.co.uk",
      },
      {
        protocol: "https",
        hostname: "media.guim.co.uk",
      },
      // BBC News
      {
        protocol: "https",
        hostname: "ichef.bbci.co.uk",
      },
      {
        protocol: "http",
        hostname: "feeds.bbci.co.uk",
      },
      // Al Jazeera
      {
        protocol: "https",
        hostname: "www.aljazeera.com",
      },
      {
        protocol: "https",
        hostname: "al-jazeera-prod.cdn.arcpublishing.com",
      },
      // Fallback for all other sources
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
