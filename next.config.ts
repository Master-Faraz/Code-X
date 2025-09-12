import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // Increase from default 1mb to 5mb (use bytes package format)
      bodySizeLimit: '5mb'
    }
  }
};

export default nextConfig;
