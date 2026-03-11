import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  /* config options here */
}

export default withSentryConfig(nextConfig, {
  org: 'sim-kaur',
  project: 'simkaur-website',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
})
