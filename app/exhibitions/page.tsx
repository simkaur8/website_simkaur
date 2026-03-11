import { client } from '@/sanity/lib/client'
import { allExhibitionsQuery } from '@/sanity/lib/queries'
import { Footer } from '@/components/Footer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { PortableText } from '@portabletext/react'
import type { Exhibition } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibitions | Sim Kaur',
  description: 'Art exhibitions and installations by Sim Kaur.',
}

export const revalidate = 60

export default async function ExhibitionsPage() {
  const exhibitions: Exhibition[] = await client.fetch(allExhibitionsQuery)

  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-normal uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 2rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          Exhibitions
        </h1>

        {exhibitions.length > 0 ? (
          <div className="mx-auto max-w-4xl space-y-24">
            {exhibitions.map((exhibition) => (
              <RevealOnScroll key={exhibition._id}>
                <article className="space-y-6">
                  <div>
                    <h2 className="text-[var(--text-2xl)] font-semibold">{exhibition.title}</h2>
                    {exhibition.subtitle && (
                      <p className="mt-1 text-[var(--text-base)] text-[var(--text-secondary)]">
                        {exhibition.subtitle}
                      </p>
                    )}
                    {exhibition.year && (
                      <p className="mt-1 text-[var(--text-sm)] text-[var(--text-muted)]">
                        {exhibition.year}
                      </p>
                    )}
                  </div>
                  {exhibition.description && (
                    <div className="max-w-2xl text-[var(--text-base)] leading-relaxed text-[var(--text-secondary)]">
                      <PortableText value={exhibition.description} />
                    </div>
                  )}
                  {exhibition.externalLink && (
                    <a
                      href={exhibition.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[var(--text-sm)] text-[var(--accent)] hover:text-[var(--accent-hover)]"
                    >
                      View more →
                    </a>
                  )}
                </article>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-[var(--text-muted)]">No exhibitions yet.</p>
        )}
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
