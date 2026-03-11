import { Footer } from '@/components/Footer'
import { PhotographyGrid } from '@/components/photography/PhotographyGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography | Sim Kaur',
  description: 'Photography by Sim Kaur — fashion, portraits, life, and events.',
}

export const revalidate = 60

export default async function PhotographyPage() {
  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-light uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 2rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          PHOTOGRAPHY
        </h1>
        <PhotographyGrid />
      </div>
      <Footer
        email="simtheaquarius@gmail.com"
        footerCta="contact me :-)"
        socialLinks={[
          { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
          { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
        ]}
      />
    </>
  )
}
