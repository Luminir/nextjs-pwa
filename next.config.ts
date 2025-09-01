import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Other config options can go here
  // allowedDevOrigins: ["http://192.168.229.1"], // Include protocol for clarity
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
