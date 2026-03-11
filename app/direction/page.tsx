import { client } from '@/sanity/lib/client'
import { allProjectsQuery } from '@/sanity/lib/queries'
import { DirectionGrid } from '@/components/direction/DirectionGrid'
import { Footer } from '@/components/Footer'
import type { Project } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Direction | Sim Kaur',
  description: 'Film direction work by Sim Kaur — fashion films, dance films, and music videos.',
}

export const revalidate = 60

export default async function DirectionPage() {
  const projects: Project[] = await client.fetch(allProjectsQuery)

  return (
    <>
      <div className="px-6 pb-16 pt-24 lg:px-12">
        <h1
          className="mb-12 text-center font-light uppercase tracking-[0.08em]"
          style={{ fontSize: 'var(--text-display)', lineHeight: 1 }}
        >
          DIRECTION
        </h1>
        <DirectionGrid projects={projects} />
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
