import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { Footer } from '@/components/Footer'
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

const socialLinks = [
  { label: 'Instagram', url: 'https://www.instagram.com/s1mkaur' },
  { label: 'Vimeo', url: 'https://vimeo.com/user197917349' },
  { label: 'Substack', url: '#' },
  { label: 'Letterboxd', url: '#' },
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/playlist/67qupizObYnZhGDmgVvNU8?si=4a3b691e67554153',
  },
]

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      <div
        className="flex flex-col items-start px-6 pb-16 pt-24 lg:px-12"
        style={{ maxWidth: 700 }}
      >
        {/* Portrait */}
        <div className="w-full">
          <picture>
            <source srcSet="/images/about/portrait.webp" type="image/webp" />
            <img
              src="/images/about/portrait.jpg"
              alt="Simrat Kaur"
              className="w-full object-cover"
              loading="eager"
            />
          </picture>
        </div>

        {/* Bio */}
        <div
          className="mt-10 space-y-6 leading-[1.8] text-[var(--text-secondary)]"
          style={{ fontSize: 'var(--text-base)' }}
        >
          <p>
            Sim Kaur is a Punjabi creative director, filmmaker and photographer based in North West
            Sydney, Australia.
          </p>
          <p>
            She started out as a spoken word poet before getting into fashion and event photography.
            After finishing a Bachelor of Creative Industries in film in 2023, she moved into
            directing and moving image work. Her practice is rooted in her South Asian heritage,
            drawing on the rhythms, textures and storytelling traditions of the Punjabi diaspora.
          </p>
          <p>
            She is obsessed with watching dance battles online, somatic practises, writing in her
            journal and spending time in nature.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-10" style={{ fontSize: 'var(--text-base)' }}>
          <p className="text-[var(--text-secondary)]">lets chat!</p>
          <a
            href="mailto:simtheaquarius@gmail.com"
            className="mt-1 inline-block text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            simtheaquarius@gmail.com
          </a>
        </div>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap gap-4" style={{ fontSize: 'var(--text-sm)' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
        </div>
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
