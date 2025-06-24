import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,

  // config Content-Security-Policy (CSP)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value:
  //             "default-src 'self'; " +
  //             "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
  //             "style-src 'self' 'unsafe-inline'; " +
  //             "img-src 'self' data: blob:; " +
  //             "font-src 'self'; " +
  //             "connect-src 'self' https://localhost:3000; " +
  //             "frame-ancestors 'none'; " +
  //             "form-action 'self'; " +
  //             "base-uri 'self'; " +
  //             "object-src 'none';",
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  //         },
  //       ],
  //     },
  //   ];
  // },

  // // config API path
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://localhost:3000/:path*",
  //     },
  //   ];
  // },

  // config prevent iframe injection
  async redirects() {
    return [
      {
        source: '/:path*/iframe.html',
        destination: '/404',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
