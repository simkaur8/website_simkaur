import { Footer } from '@/components/Footer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibitions',
  description:
    'Art exhibitions and gallery installations by Sim Kaur. Film screenings, video art, and multimedia installations in Sydney and internationally.',
  keywords: [
    'art exhibitions Sydney',
    'video art installation',
    'film screening gallery',
    'Sim Kaur exhibitions',
    'multimedia installation',
  ],
  alternates: { canonical: '/exhibitions' },
  openGraph: {
    title: 'Exhibitions | Sim Kaur',
    description:
      'Art exhibitions and gallery installations by Sim Kaur. Film screenings, video art, and multimedia installations in Sydney and internationally.',
    url: 'https://simkaur.art/exhibitions',
  },
}

const exhibitions = [
  {
    title: 'Transmedia Worldbuilding Residency',
    subtitle:
      '4A Centre for Contemporary Asian Art x Antariksha Studio. October 2025 to June 2026, Sydney.',
    description:
      'Completed as part of the Transmedia Worldbuilding Residency at 4A Centre for Contemporary Asian Art. A six-month collaborative program exploring worldbuilding across game design, performance, sound and digital art. The residency included mentored development, an intensive in-person workshop, and public showcases across Sydney, digital platforms, and Mumbai’s Eyemyth Festival.',
    link: {
      text: 'More info at 4A →',
      href: 'https://4a.com.au/events/transmedia-worldbuilding-residency',
    },
    media: [
      {
        src: '/images/exhibitions/transmedia/transmedia-1.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/transmedia-2.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9358.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9372.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9472.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9583.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9584.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9588.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: true,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9592.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: true,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9604.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: false,
      },
      {
        src: '/images/exhibitions/transmedia/20260501_Transmedia_photo_GarryTrinh-9638.jpg',
        alt: 'Transmedia Worldbuilding Residency',
        portrait: true,
      },
    ],
    scrollGallery: true,
  },
  {
    title: '‘Pravaah’ Installation at Pari Art Gallery',
    subtitle:
      'Sound and moving image installation with found objects. 1 min 30 sec. Exhibited as part of Pari (ARI)’s group exhibition Weeds Crack Concrete, 2025.',
    description:
      'Pravaah is a short experimental Bharatanatyam film featuring Anjana Chandran. The dance traces the cycle of life and death. Anjana takes on the form of the divine feminine, expressing love for sky, water, wind, rain, and a leaping deer, before moving through destruction and grief. From a single teardrop, new life is born and a flower blooms. The film is installed on a CRT monitor surrounded by personal objects: worn books, family photographs, incense, quiet offerings from a bedside table. This altar traces the line between the personal and the eternal, the sacred and the everyday.',
    link: { text: 'Watch Pravaah on Vimeo →', href: 'https://vimeo.com/1151462076' },
    media: [
      {
        src: '/images/exhibitions/pravaah/installation-1.webp',
        alt: 'Pravaah Installation',
        portrait: false,
      },
      {
        src: '/images/exhibitions/pravaah/pravaah-install.gif',
        alt: 'Pravaah Installation video',
        portrait: false,
      },
      {
        src: '/images/exhibitions/pravaah/installation-2.jpg',
        alt: 'Pravaah Installation detail',
        portrait: false,
      },
    ],
  },
  {
    title: 'Homecoming',
    subtitle:
      'Collage installation using family photographs and found objects. Exhibited as part of Akshaya Bhutkar’s group show at Studio Killa, Marrickville. 2025.',
    media: [
      {
        src: '/images/exhibitions/homecoming/homecoming-1.webp',
        alt: 'Homecoming installation',
        portrait: false,
      },
      {
        src: '/images/exhibitions/homecoming/homecoming-vid.gif',
        alt: 'Homecoming detail',
        portrait: false,
      },
      {
        src: '/images/exhibitions/homecoming/homecoming-3.jpg',
        alt: 'Homecoming detail',
        portrait: false,
      },
    ],
  },
]

function renderSubtitle(subtitle: string) {
  const target = '4A Centre for Contemporary Asian Art'
  const idx = subtitle.indexOf(target)
  if (idx === -1) return <>{subtitle}</>
  return (
    <>
      {subtitle.slice(0, idx)}
      <a
        href="https://4a.com.au/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'underline',
          textDecorationColor: '#22d3ee',
          textUnderlineOffset: '3px',
        }}
      >
        {target}
      </a>
      {subtitle.slice(idx + target.length)}
    </>
  )
}

export default function ExhibitionsPage() {
  return (
    <>
      <div className="px-8 pb-16 pt-24 lg:px-16 xl:px-24">
        <h1
          className="mb-12 text-center font-normal uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 2rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          Exhibitions
        </h1>

        <div className="mx-auto max-w-6xl space-y-24">
          {exhibitions.map((exh) => (
            <RevealOnScroll key={exh.title}>
              <article>
                {/* Header */}
                <div className="mb-8">
                  <h2
                    className="font-medium tracking-[0.04em] text-[var(--text-primary)]"
                    style={{ fontSize: 'var(--text-xl)', lineHeight: 1.3 }}
                  >
                    {exh.title}
                  </h2>
                  <p
                    className="mt-2 uppercase tracking-[0.1em] text-[var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
                  >
                    {renderSubtitle(exh.subtitle ?? '')}
                  </p>
                </div>

                {/* Scroll gallery (Transmedia) */}
                {'scrollGallery' in exh && exh.scrollGallery && exh.media && (
                  <div
                    className="mb-8 flex overflow-x-auto"
                    style={{
                      gap: 'clamp(0.5rem, 1vw, 0.8rem)',
                      height: 'clamp(150px, calc(min(100vw - 4rem, 72rem) / 3 * 0.8), 310px)',
                    }}
                  >
                    {exh.media.map((item, i) => (
                      <div
                        key={i}
                        className="h-full flex-shrink-0 overflow-hidden"
                        style={{ aspectRatio: item.portrait ? '2/3' : '5/4' }}
                      >
                        <img
                          src={item.src}
                          alt={item.alt || ''}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Triptych grid */}
                {!('scrollGallery' in exh && exh.scrollGallery) && 'media' in exh && exh.media && (
                  <div
                    className="mb-8 grid grid-cols-1 sm:grid-cols-3"
                    style={{ gap: 'clamp(0.5rem, 1vw, 0.8rem)' }}
                  >
                    {exh.media.map((item, i) => (
                      <div key={i} className="aspect-[5/4] overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.alt || ''}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {'description' in exh && exh.description && (
                  <p
                    className="mb-6 max-w-6xl leading-relaxed text-[var(--text-secondary)]"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    {exh.description}
                  </p>
                )}

                {/* Link */}
                {'link' in exh && exh.link && (
                  <a
                    href={exh.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {exh.link.text}
                  </a>
                )}
              </article>
            </RevealOnScroll>
          ))}
        </div>
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
