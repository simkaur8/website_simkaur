import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: cdn.sanity.io",
      "font-src 'self'",
      'frame-src player.vimeo.com www.youtube.com youtube.com',
      "connect-src 'self' cdn.sanity.io *.sentry.io *.ingest.sentry.io vitals.vercel-insights.com",
      "media-src 'self' blob: https:",
      "worker-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // JHALAK — override the site-wide camera=() block so getUserMedia works.
      // Also widen CSP to allow MediaPipe CDN and model storage bucket.
      {
        source: '/jhalak.html',
        headers: [
          { key: 'Permissions-Policy', value: 'camera=(self)' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' cdn.jsdelivr.net storage.googleapis.com *.ingest.sentry.io",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: 'sim-kaur',
  project: 'simkaur-website',
  silent: !process.env.CI,
  widenClientFileUpload: false,
  disableLogger: true,
})
