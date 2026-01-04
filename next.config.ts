import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform.theverge.com",
      },
      {
        protocol: "https",
        hostname: "cdn.vox-cdn.com",
      },
      {
        protocol: "https",
        hostname: "a.espncdn.com",
      },
      {
        protocol: "https",
        hostname: "www.sciencedaily.com",
      },
      {
        protocol: "https",
        hostname: "techcrunch.com",
      },
      {
        protocol: "https",
        hostname: "*.arstechnica.net",
      },
      {
        protocol: "https",
        hostname: "www.cnet.com",
      },
      {
        protocol: "https",
        hostname: "s.yimg.com",
      },
      {
        protocol: "https",
        hostname: "i.kinja-img.com",
      },
      {
        protocol: "https",
        hostname: "media.wired.com",
      },
      {
        protocol: "https",
        hostname: "www.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "media.nature.com",
      },
      {
        protocol: "https",
        hostname: "scx2.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "ichef.bbci.co.uk",
      },
      {
        protocol: "http",
        hostname: "feeds.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "*.si.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
