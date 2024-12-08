/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shambu/shared'],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig; 