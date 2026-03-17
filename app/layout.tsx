import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'
import { SideNav } from '@/components/nav/SideNav'
import { MobileNav } from '@/components/nav/MobileNav'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const generalSans = localFont({
  src: '../public/fonts/GeneralSans-Variable.woff2',
  variable: '--font-general-sans',
  display: 'swap',
  weight: '200 700',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://simkaur.art'),
  title: {
    default: 'Sim Kaur | Creative Director',
    template: '%s | Sim Kaur',
  },
  description: 'Sim Kaur: Creative Director / Editor / Photographer',
  keywords: [
    'Sim Kaur',
    'creative director',
    'fashion film director',
    'music video director',
    'dance film director',
    'filmmaker Sydney',
    'creative director Sydney',
    'fashion filmmaker Australia',
    'music video production Sydney',
    'visual storytelling',
    'director showreel',
    'fashion film portfolio',
    'cinematic fashion film',
    'editorial video director',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Sim Kaur',
    url: 'https://simkaur.art',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={generalSans.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--bg-primary)] focus:px-4 focus:py-2 focus:text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent)]"
        >
          Skip to content
        </a>
        <Providers>
          <SideNav />
          <MobileNav />
          <div className="fixed left-4 top-5 z-40 lg:left-auto lg:right-4">
            <ThemeToggle />
          </div>
          <main id="main-content" className="lg:pl-[var(--nav-w)]">
            {children}
          </main>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
