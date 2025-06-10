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
  // Enable standalone output mode for Docker deployment
  output: "standalone",
  // Disable problematic experimental features
  experimental: {
    // Empty to avoid errors but keep the structure for future use
  }
}

module.exports = nextConfig;


                                                