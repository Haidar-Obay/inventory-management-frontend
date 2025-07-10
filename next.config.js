const withNextIntl = require("next-intl/plugin")("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  skipTrailingSlashRedirect: true,
  output: "standalone",
  allowedDevOrigins: ["*"],
  // Optimize CSS preloading
  optimizeCss: true,
  // Configure webpack for better CSS handling
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize CSS extraction
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://hadishokor.app.localhost:8000/:path*",
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
