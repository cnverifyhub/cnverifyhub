/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ['gsap', 'three', '@react-three/fiber', '@react-three/drei', 'framer-motion'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeServerReact: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'cnverifyhub.com', pathname: '/images/**' },
      { protocol: 'https', hostname: '*.vercel.app', pathname: '/images/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://hm.baidu.com https://zz.bdstatic.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://images.unsplash.com https://api.dicebear.com https://play-lh.googleusercontent.com https://zz.bdstatic.com https://*.bdstatic.com https://www.google-analytics.com https://*.google-analytics.com https://cdn.simpleicons.org; connect-src 'self' https://otgewrynnrqmtsyvlzrj.supabase.co https://mybzjmhyyxamldklezngu.supabase.co https://hm.baidu.com https://zz.bdstatic.com https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com;"
          },
          // Preconnect to Supabase and Baidu Analytics for faster resolution
          {
            key: 'Link',
            value: [
              '<https://mybzjmhyyxamldklezngu.supabase.co>; rel=preconnect',
              '<https://hm.baidu.com>; rel=dns-prefetch',
            ].join(', ')
          },
        ],
      },
      // Long-lived cache for immutable static assets
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Cache blog pages for 1 hour (they're SSG so this is fine)
      {
        source: '/(blog|en/blog)/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
    ];
  },
};

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: true,
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
