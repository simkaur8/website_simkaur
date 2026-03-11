import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { AboutPageClient } from '@/components/about/AboutPageClient'
import { Footer } from '@/components/Footer'
import type { SiteSettings } from '@/sanity/lib/types'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Sim Kaur — Creative Director, Filmmaker, and Photographer based in Sydney.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Sim Kaur',
    description: 'About Sim Kaur — Creative Director, Filmmaker, and Photographer based in Sydney.',
    url: 'https://simkaur.art/about',
  },
}

export const revalidate = 60

export default async function AboutPage() {
  const settings: SiteSettings | null = await client.fetch(siteSettingsQuery)

  return (
    <>
      <PersonJsonLd />
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-semibold tracking-[0.1em]"
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          About
        </h1>
        <AboutPageClient settings={settings} />
      </div>
      <Footer
        email={settings?.email || 'simtheaquarius@gmail.com'}
        footerCta={settings?.footerCta || 'contact me :-)'}
        socialLinks={settings?.socialLinks}
      />
    </>
  )
}
