/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shambu/shared'],
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig; 