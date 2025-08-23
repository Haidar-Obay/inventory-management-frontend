import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
    allowedDevOrigins: ["*"],
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  skipTrailingSlashRedirect: true,
  output: "standalone",
  
  // Configure webpack for better CSS handling and suppress scroll focus warnings
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

    // Suppress console warnings about scroll focus boundaries in development
    if (dev) {
      // Override console.warn to filter out scroll focus warnings
      config.plugins.push(
        new config.webpack.DefinePlugin({
          'process.env.SUPPRESS_SCROLL_FOCUS_WARNINGS': JSON.stringify('true'),
        })
      );

      // Add a custom plugin to suppress specific warnings
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('SuppressScrollFocusWarnings', () => {
            if (typeof window !== 'undefined') {
              const originalWarn = console.warn;
              console.warn = (...args) => {
                const message = args[0];
                if (typeof message === 'string' && 
                    message.includes('Skipping auto-scroll behavior due to `position: sticky` or `position: fixed`')) {
                  return; // Suppress this warning
                }
                originalWarn.apply(console, args);
              };
            }
          });
        }
      });
    }
    
    // Handle font loading issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
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
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : "https://binbothub.com/backend/:path*",
      },
    ];
  },
  eslint: {
    // ❌ Skip ESLint during builds
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
