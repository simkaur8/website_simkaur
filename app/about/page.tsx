import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { Footer } from '@/components/Footer'
import { AboutWithDiary } from '@/components/about/AboutWithDiary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Sim Kaur — Creative Director, Filmmaker, and Photographer based in Sydney, Australia. Directing fashion films, dance films, and music videos for brands and artists.',
  keywords: [
    'about Sim Kaur',
    'creative director bio',
    'filmmaker Sydney',
    'fashion film director Australia',
    'hire creative director Sydney',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Sim Kaur — Creative Director, Sydney',
    description:
      'About Sim Kaur — Creative Director, Filmmaker, and Photographer based in Sydney, Australia. Directing fashion films, dance films, and music videos for brands and artists.',
    url: 'https://simkaur.art/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      <AboutWithDiary />
      <Footer
        email="simtheaquarius@gmail.com"
        socialLinks={[
          { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
          { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
        ]}
      />
    </>
  )
}
