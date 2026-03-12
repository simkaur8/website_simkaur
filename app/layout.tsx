import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'
import { CustomCursor } from '@/components/CustomCursor'
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
  description:
    'Portfolio of Sim Kaur — Creative Director, Fashion Film Director, and Music Video Director based in Sydney, Australia. Specialising in dance films, fashion films, and visual storytelling.',
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
    <html lang="en" data-theme="light" className={generalSans.variable}>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <Providers>
          <CustomCursor />
          <SideNav />
          <MobileNav />
          <div className="fixed right-4 top-4 z-40 hidden lg:block">
            <ThemeToggle />
          </div>
          <main className="lg:pl-[var(--nav-w)]">{children}</main>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
