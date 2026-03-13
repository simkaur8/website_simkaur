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
    const genre = project.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video'
    const desc = `${project.title} — ${genre} directed by Sim Kaur. Sydney-based creative director.`
    return {
      title: project.title,
      description: desc,
      keywords: [project.title, genre.toLowerCase(), 'Sim Kaur', 'direction', 'Sydney'],
      alternates: { canonical: `/direction/${slug}` },
      openGraph: {
        title: `${project.title} — ${genre} | Sim Kaur`,
        description: desc,
        url: `https://simkaur.art/direction/${slug}`,
        type: 'article',
      },
    }
  }

  // Fall back to static data
  const staticProject = staticProjects.find((p) => p.slug === slug)
  if (staticProject) {
    const genre =
      staticProject.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video'
    const desc = `${staticProject.title} — ${genre} directed by Sim Kaur. ${staticProject.description.split('\n')[0]}`
    return {
      title: staticProject.title,
      description: desc,
      keywords: [staticProject.title, genre.toLowerCase(), 'Sim Kaur', 'direction', 'Sydney'],
      alternates: { canonical: `/direction/${slug}` },
      openGraph: {
        title: `${staticProject.title} — ${genre} | Sim Kaur`,
        description: desc,
        url: `https://simkaur.art/direction/${slug}`,
        type: 'article',
      },
    }
  }

  return { title: 'Not Found' }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Use static data
  const staticProject = staticProjects.find((p) => p.slug === slug)
  if (!staticProject) notFound()

  return (
    <>
      <StaticProjectDetail project={staticProject} />
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
