/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL,
    EXCLUDED_TRANSACTIONS: process.env.EXCLUDED_TRANSACTIONS,
  },
};

module.exports = nextConfig;
