import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['m.haishangjiayi.cn'],
  experimental: {
    serverComponentsExternalPackages: [],
  },
  async rewrites() {
    return [];
  },
  async headers() {
    return [];
  },
  devIndicators: {
    buildActivity: true,
  },
  // 配置开发服务器监听所有网络接口
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
};
export default nextConfig;
