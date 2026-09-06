import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/", destination: "/nl", permanent: false },
      // old site (pre-2026) URLs that Google still has indexed → their new home, permanent so the index follows
      { source: "/over-ons", destination: "/nl/over", permanent: true },
      { source: "/diensten", destination: "/nl/diensten", permanent: true },
      { source: "/diensten/:path*", destination: "/nl/diensten", permanent: true },
      { source: "/contact", destination: "/nl/contact", permanent: true },
      { source: "/portfolio", destination: "/nl", permanent: true },
      { source: "/blog/:path*", destination: "/nl", permanent: true },
    ];
  },
};

export default nextConfig;
