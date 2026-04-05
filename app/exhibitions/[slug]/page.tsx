import { client } from '@/sanity/lib/client'
import { exhibitionBySlugQuery, allExhibitionsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Footer } from '@/components/Footer'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import type { Exhibition } from '@/sanity/lib/types'

type ExhibitionMediaItem = { _type: string; alt?: string; asset?: { _ref: string; _type: string } }
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const exhibitions: Exhibition[] = await client.fetch(allExhibitionsQuery).catch(() => [])
  return exhibitions.map((e) => ({ slug: e.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const exhibition: Exhibition | null = await client
    .fetch(exhibitionBySlugQuery, { slug })
    .catch(() => null)
  if (!exhibition) return { title: 'Not Found | Sim Kaur' }
  return {
    title: `${exhibition.title} | Sim Kaur`,
    description: exhibition.subtitle || `Exhibition by Sim Kaur`,
  }
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exhibition: Exhibition | null = await client
    .fetch(exhibitionBySlugQuery, { slug })
    .catch(() => null)
  if (!exhibition) notFound()

  return (
    <>
      <article className="px-6 pb-16 pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h1
            className="mb-2 text-center font-semibold tracking-[0.05em]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            {exhibition.title}
          </h1>
          {exhibition.subtitle && (
            <p className="mb-8 text-center text-[var(--text-base)] text-[var(--text-secondary)]">
              {exhibition.subtitle}
            </p>
          )}
          {exhibition.description && (
            <div className="mx-auto mb-12 max-w-2xl text-[var(--text-base)] leading-relaxed text-[var(--text-secondary)]">
              <PortableText value={exhibition.description} />
            </div>
          )}
          {exhibition.media && exhibition.media.length > 0 && (
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {(exhibition.media as ExhibitionMediaItem[]).map((item, i) =>
                  item._type === 'image' ? (
                    <div key={i} className="aspect-[4/3] overflow-hidden">
                      <img // eslint-disable-line @next/next/no-img-element
                        src={urlFor(item).width(600).url()}
                        alt={item.alt || `Exhibition image ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </article>
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
