/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Enable hostname rewrites for subdomains
 skipTrailingSlashRedirect: true,
  
}

module.exports = nextConfig
