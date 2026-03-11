import { Footer } from '@/components/Footer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibitions',
  description:
    'Art exhibitions and gallery installations by Sim Kaur — film screenings, video art, and multimedia installations in Sydney and internationally.',
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
      'Art exhibitions and gallery installations by Sim Kaur — film screenings, video art, and multimedia installations in Sydney and internationally.',
    url: 'https://simkaur.art/exhibitions',
  },
}

const exhibitions = [
  {
    title: '\u2018Pravaah\u2019 Installation at Pari Art Gallery',
    subtitle:
      'Sound and moving image installation with found objects. 1 min 30 sec. Exhibited as part of Pari (ARI)\u2019s group exhibition Weeds Crack Concrete, 2025.',
    description:
      'Pravaah is a short experimental Bharatanatyam film featuring Anjana Chandran. The dance traces the cycle of life and death. Anjana takes on the form of the divine feminine, expressing love for sky, water, wind, rain, and a leaping deer, before moving through destruction and grief. From a single teardrop, new life is born and a flower blooms. The film is installed on a CRT monitor surrounded by personal objects: worn books, family photographs, incense, quiet offerings from a bedside table. This altar traces the line between the personal and the eternal, the sacred and the everyday.',
    link: { text: 'Watch Pravaah on Vimeo \u2192', href: 'https://vimeo.com/1151462076' },
    media: [
      {
        type: 'image' as const,
        src: '/images/exhibitions/pravaah/installation-1.webp',
        alt: 'Pravaah Installation',
      },
      { type: 'video' as const, src: '/images/exhibitions/pravaah/installation-video.mp4' },
      {
        type: 'image' as const,
        src: '/images/exhibitions/pravaah/installation-2.jpg',
        alt: 'Pravaah Installation detail',
      },
    ],
  },
  {
    title: 'Homecoming',
    subtitle:
      'Collage installation using family photographs and found objects. Exhibited as part of Akshaya Bhutkar\u2019s group show at Studio Killa, Marrickville. 2025.',
    media: [
      {
        type: 'image' as const,
        src: '/images/exhibitions/homecoming/homecoming-1.webp',
        alt: 'Homecoming installation',
      },
      {
        type: 'image' as const,
        src: '/images/exhibitions/homecoming/homecoming-2.jpg',
        alt: 'Homecoming detail',
      },
      {
        type: 'image' as const,
        src: '/images/exhibitions/homecoming/homecoming-3.jpg',
        alt: 'Homecoming detail',
      },
    ],
  },
]

export default function ExhibitionsPage() {
  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-normal uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 2rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          Exhibitions
        </h1>

        <div className="mx-auto max-w-4xl space-y-24">
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
                    className="mt-2 uppercase tracking-[0.1em] text-[var(--text-muted)]"
                    style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
                  >
                    {exh.subtitle}
                  </p>
                </div>

                {/* Triptych grid */}
                <div
                  className="mb-8 grid grid-cols-3"
                  style={{ gap: 'clamp(0.5rem, 1vw, 0.8rem)' }}
                >
                  {exh.media.map((item, i) =>
                    item.type === 'video' ? (
                      <div key={i} className="overflow-hidden">
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div key={i} className="overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.alt || ''}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Description */}
                {'description' in exh && exh.description && (
                  <p
                    className="mb-6 max-w-2xl leading-relaxed text-[var(--text-secondary)]"
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
        footerCta="contact me :-)"
        socialLinks={[
          { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
          { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
        ]}
      />
    </>
  )
}
