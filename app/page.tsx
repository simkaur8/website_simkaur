import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { VortexGallery } from '@/components/home/VortexGallery'
import { Footer } from '@/components/Footer'
import { WebsiteJsonLd } from '@/components/seo/WebsiteJsonLd'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'

export const metadata: Metadata = {
  title: 'Sim Kaur | Photo & Film',
  description:
    'Sim Kaur: Photo and Film. Fashion Film Director, Music Video Director, and Photographer based in Sydney. Watch the showreel and explore fashion films, dance films, and music videos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Sim Kaur | Photo & Film',
    description: 'Sim Kaur | Photo & Film',
    url: 'https://simkaur.art',
  },
}

export default function HomePage() {
  return (
    <div className="lg:ml-[calc(var(--nav-w)*-1)]">
      <WebsiteJsonLd />
      <PersonJsonLd />
      <HeroSection
        showreelUrl="/videos/showreel.mp4"
        logoWebmUrl="/videos/logo.webm"
        logoMp4Url="/videos/logo.mp4"
      />
      <VortexGallery />
      <Footer
        email="sim@simkaur.art"
        footerCta="Get in touch"
        socialLinks={[
          { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
          { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
        ]}
      />
    </div>
  )
}
