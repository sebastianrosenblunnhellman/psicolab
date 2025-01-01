/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
