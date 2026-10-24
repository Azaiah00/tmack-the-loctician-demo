import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hide the Next.js dev-tools badge (bottom-left "N" in development).
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [45, 75],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
  },
};

export default nextConfig;
