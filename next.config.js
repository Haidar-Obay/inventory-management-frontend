/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Enable hostname rewrites for subdomains
  skipTrailingSlashRedirect: true,
  // Allow cross-origin requests from hadishokor.localhost
  allowedDevOrigins: ['hadishokor.localhost'],
}

module.exports = nextConfig;
