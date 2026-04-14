/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to enable Netlify Next.js Runtime
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ['gsap'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Production domain — icons served via Cloudflare CDN
        protocol: 'https',
        hostname: 'cnwepro.com',
        pathname: '/images/**',
      },
      {
        // Netlify preview deployments
        protocol: 'https',
        hostname: '*.netlify.app',
        pathname: '/images/**',
      },
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
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/(.*)\\.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
