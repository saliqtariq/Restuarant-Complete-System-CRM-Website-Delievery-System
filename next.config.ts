import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 86400, // 24 hours cache
    dangerouslyAllowSVG: false,
  },
  compress: true,
};

export default nextConfig;
