import { HeroSection } from '@/components/home/HeroSection'
import { VortexGallery } from '@/components/home/VortexGallery'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
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
