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
};

module.exports = withNextIntl(nextConfig);
