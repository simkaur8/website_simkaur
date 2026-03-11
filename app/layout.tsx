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
  title: 'Sim Kaur | Creative Director',
  description:
    'Portfolio of Sim Kaur — Creative Director and Filmmaker crafting compelling visual narratives.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" className={generalSans.variable}>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
        <Providers>
          <CustomCursor />
          <SideNav />
          <MobileNav />
          <div className="fixed right-4 top-4 z-40 hidden lg:block">
            <ThemeToggle />
          </div>
          <main className="lg:ml-20">{children}</main>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
