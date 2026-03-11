import { Footer } from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography | Sim Kaur',
  description: 'Photography by Sim Kaur — fashion, portraits, life, and events.',
}

export const revalidate = 60

const categories = [
  { slug: 'fashion', label: 'Fashion' },
  { slug: 'portraits', label: 'Portraits' },
  { slug: 'life', label: 'Life' },
  { slug: 'events', label: 'Events' },
]

export default async function PhotographyPage() {
  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-semibold tracking-[0.1em]"
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          Photography
        </h1>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/photography/${cat.slug}`}
              className="group relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <h2 className="text-[var(--text-xl)] font-semibold text-white transition-transform duration-300 group-hover:translate-y-[-4px]">
                  {cat.label}
                </h2>
              </div>
            </Link>
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
