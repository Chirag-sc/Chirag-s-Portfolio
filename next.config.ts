import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_SITE_BASE: process.env.GITHUB_PAGES === 'true' ? '/Chirag-s-Portfolio' : '',
  },
};

export default nextConfig;
