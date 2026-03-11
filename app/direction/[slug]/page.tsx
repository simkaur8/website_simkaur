import { client } from '@/sanity/lib/client'
import { projectBySlugQuery, allProjectsQuery } from '@/sanity/lib/queries'
import { ProjectDetail } from '@/components/direction/ProjectDetail'
import { StaticProjectDetail } from '@/components/direction/StaticProjectDetail'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'
import { staticProjects } from '@/lib/projects-data'
import type { Project } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  // Use both Sanity + static data for params
  const sanityProjects: Project[] = await client.fetch(allProjectsQuery).catch(() => [])
  const sanityParams = sanityProjects.map((p) => ({ slug: p.slug.current }))
  const staticParams = staticProjects.map((p) => ({ slug: p.slug }))
  return [...sanityParams, ...staticParams]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  // Try Sanity first
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug }).catch(() => null)
  if (project) {
    return {
      title: `${project.title} | Sim Kaur`,
      description: `${project.title} — ${project.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video'} by Sim Kaur`,
    }
  }

  // Fall back to static data
  const staticProject = staticProjects.find((p) => p.slug === slug)
  if (staticProject) {
    return {
      title: `${staticProject.title} | Sim Kaur`,
      description: staticProject.description.split('\n')[0],
    }
  }

  return { title: 'Not Found | Sim Kaur' }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Try Sanity first
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug }).catch(() => null)

  if (project) {
    return (
      <>
        <ProjectDetail project={project} />
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

  // Fall back to static data
  const staticProject = staticProjects.find((p) => p.slug === slug)
  if (!staticProject) notFound()

  return (
    <>
      <StaticProjectDetail project={staticProject} />
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
