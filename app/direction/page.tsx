import { client } from '@/sanity/lib/client'
import { allProjectsQuery } from '@/sanity/lib/queries'
import { DirectionGrid } from '@/components/direction/DirectionGrid'
import { StaticDirectionGrid } from '@/components/direction/StaticDirectionGrid'
import { Footer } from '@/components/Footer'
import { staticProjects } from '@/lib/projects-data'
import type { Project } from '@/sanity/lib/types'
import type { Metadata } from 'next'
import { DirectionCollectionJsonLd } from '@/components/seo/DirectionCollectionJsonLd'

export const metadata: Metadata = {
  title: 'Direction',
  description:
    'Film direction portfolio by Sim Kaur — fashion films, dance films, and music videos. Sydney-based creative director working with brands, artists, and labels.',
  keywords: [
    'fashion film direction',
    'music video direction',
    'dance film',
    'fashion filmmaker Sydney',
    'music video director Sydney',
    'director reel',
    'Sim Kaur direction',
  ],
  alternates: { canonical: '/direction' },
  openGraph: {
    title: 'Direction — Fashion Films & Music Videos | Sim Kaur',
    description:
      'Film direction portfolio by Sim Kaur — fashion films, dance films, and music videos. Sydney-based creative director working with brands, artists, and labels.',
    url: 'https://simkaur.art/direction',
  },
}

export const revalidate = 60

export default async function DirectionPage() {
  const projects: Project[] = await client.fetch(allProjectsQuery).catch(() => [])

  return (
    <>
      <DirectionCollectionJsonLd />
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-normal uppercase tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 2rem + 4vw, 5.5rem)', lineHeight: 1 }}
        >
          Direction
        </h1>
        {projects.length > 0 ? (
          <DirectionGrid projects={projects} />
        ) : (
          <StaticDirectionGrid projects={staticProjects} />
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
