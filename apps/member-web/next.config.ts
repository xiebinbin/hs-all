import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['m.haishangjiayi.cn'],
  serverExternalPackages: [],
  async rewrites() {
    return [];
  },
  async headers() {
    return [];
  },
};
export default nextConfig;
