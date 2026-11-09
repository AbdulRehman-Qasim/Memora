import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcrypt', 'pino', 'thread-stream', 'pino-pretty'],
};

export default nextConfig;
