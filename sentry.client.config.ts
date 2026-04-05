import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  beforeSend(event) {
    // Strip query strings that may contain sensitive data
    if (event.request?.url) {
      try {
        const url = new URL(event.request.url)
        url.search = ''
        event.request.url = url.toString()
      } catch {}
    }
    return event
  },
})
