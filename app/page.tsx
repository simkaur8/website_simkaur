import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { VortexGallery } from '@/components/home/VortexGallery'
import { Footer } from '@/components/Footer'
import { WebsiteJsonLd } from '@/components/seo/WebsiteJsonLd'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'

export const metadata: Metadata = {
  title: 'Sim Kaur | Creative Director',
  description:
    'Sim Kaur — Creative Director, Fashion Film Director, and Music Video Director based in Sydney. Watch the showreel and explore fashion films, dance films, and music videos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Sim Kaur | Creative Director — Fashion Films & Music Videos',
    description:
      'Sim Kaur — Creative Director, Fashion Film Director, and Music Video Director based in Sydney. Watch the showreel and explore fashion films, dance films, and music videos.',
    url: 'https://simkaur.art',
  },
}

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      <PersonJsonLd />
      <HeroSection
        showreelUrl={process.env.NEXT_PUBLIC_SHOWREEL_URL || '/videos/showreel.mp4'}
        logoWebmUrl="/videos/logo.webm"
        logoMp4Url="/videos/logo.mp4"
      />
      <VortexGallery />
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
