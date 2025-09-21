import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'as1.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'as2.ftcdn.net',
      },
    ],
  },
};

export default nextConfig;
