import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {},
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
