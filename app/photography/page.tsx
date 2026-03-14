import { Footer } from '@/components/Footer'
import { PhotographyGrid } from '@/components/photography/PhotographyGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography',
  description:
    'Photography by Sim Kaur — fashion photography, editorial portraits, and event documentation. Sydney-based photographer and creative director.',
  keywords: [
    'fashion photography Sydney',
    'editorial photographer',
    'portrait photographer Sydney',
    'Sim Kaur photography',
    'creative director photography',
  ],
  alternates: { canonical: '/photography' },
  openGraph: {
    title: 'Photography | Sim Kaur',
    description:
      'Photography by Sim Kaur — fashion photography, editorial portraits, and event documentation. Sydney-based photographer and creative director.',
    url: 'https://simkaur.art/photography',
  },
}

export const revalidate = 60

export default async function PhotographyPage() {
  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-normal uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2rem, 1.5rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          Photography
        </h1>
        <PhotographyGrid />
      </div>
      <Footer
        email="simtheaquarius@gmail.com"
        footerCta="Get in touch"
        socialLinks={[
          { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
          { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
        ]}
      />
    </>
  )
}
