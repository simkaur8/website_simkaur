# Deployment Guide

## Vercel Setup

1. Go to [vercel.com](https://vercel.com) and import the GitHub repository.
2. Vercel auto-detects Next.js -- no framework override needed.
3. Set environment variables in Vercel dashboard (Settings > Environment Variables):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` -- your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET` -- `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` -- `2024-01-01`
   - `SENTRY_DSN` -- Sentry DSN for server-side error tracking
   - `NEXT_PUBLIC_SENTRY_DSN` -- Sentry DSN for client-side error tracking
4. Deploy. Vercel builds on every push to `main` and creates preview deployments for PRs.

## DNS Configuration

In your domain registrar's DNS settings:

| Type  | Name | Value                |
| ----- | ---- | -------------------- |
| A     | @    | 76.76.21.21          |
| CNAME | www  | cname.vercel-dns.com |

After adding records, go to Vercel dashboard > Settings > Domains and add your custom domain. Vercel will verify and provision an SSL certificate automatically.

## Sanity Webhook (Auto-Rebuild)

1. Go to [sanity.io/manage](https://sanity.io/manage) > your project > API > Webhooks.
2. Create a new webhook:
   - **URL**: `https://api.vercel.com/v1/integrations/deploy/prj_<YOUR_PROJECT_ID>/<DEPLOY_HOOK_ID>`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave blank to rebuild on any content change
3. To get the deploy hook URL: Vercel dashboard > Settings > Git > Deploy Hooks > create one for `main`.

## Monitoring

Set up [UptimeRobot](https://uptimerobot.com):

1. Create a free account.
2. Add a new HTTP(s) monitor for your production URL.
3. Set check interval to 5 minutes.
4. Add email alert contacts.

## GitHub Actions Secrets

The CI workflow requires these secrets in GitHub (Settings > Secrets and variables > Actions):

- `SANITY_PROJECT_ID` -- used during CI builds for E2E and Lighthouse tests
