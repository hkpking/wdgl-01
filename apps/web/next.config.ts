import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 禁用 Strict Mode 以避免协作功能的双重连接问题
  // TODO: 后续优化 useCollaboration hook 后可重新启用
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vip.123pan.cn',
      },
    ],
  },
};

export default nextConfig;
