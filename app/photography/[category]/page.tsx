import { client } from '@/sanity/lib/client'
import { photoCollectionByCategoryQuery } from '@/sanity/lib/queries'
import { PhotoGallery } from '@/components/photography/PhotoGallery'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'
import type { PhotoCollection } from '@/sanity/lib/types'
import type { Metadata } from 'next'

const validCategories = ['fashion', 'portraits', 'life', 'events']
const categoryLabels: Record<string, string> = {
  fashion: 'Fashion',
  portraits: 'Portraits',
  life: 'Life',
  events: 'Events',
}

export const revalidate = 60

export async function generateStaticParams() {
  return validCategories.map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const label = categoryLabels[category] || category
  return {
    title: `${label} Photography | Sim Kaur`,
    description: `${label} photography by Sim Kaur.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params

  if (!validCategories.includes(category)) notFound()

  const collections: PhotoCollection[] = await client.fetch(photoCollectionByCategoryQuery, {
    category,
  })

  const label = categoryLabels[category] || category

  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-semibold tracking-[0.1em]"
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          {label}
        </h1>

        {collections.length > 0 ? (
          <div className="space-y-16">
            {collections.map((collection) => (
              <div key={collection._id}>
                <h2 className="mb-6 text-[var(--text-lg)] font-medium text-[var(--text-secondary)]">
                  {collection.title}
                </h2>
                <PhotoGallery collection={collection} />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-[var(--text-muted)]">
            No collections in this category yet.
          </p>
        )}
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
