import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { VortexGallery } from '@/components/home/VortexGallery'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sim Kaur | Creative Director',
  description:
    'Portfolio of Sim Kaur — Creative Director and Filmmaker crafting compelling visual narratives.',
  openGraph: {
    title: 'Sim Kaur | Creative Director',
    description:
      'Portfolio of Sim Kaur — Creative Director and Filmmaker crafting compelling visual narratives.',
    url: 'https://simkaur.art',
    siteName: 'Sim Kaur',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection
        showreelUrl="/videos/showreel.mp4"
        logoWebmUrl="/videos/logo.webm"
        logoMovUrl="/videos/logo.mov"
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
