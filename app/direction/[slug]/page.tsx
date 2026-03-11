import { client } from '@/sanity/lib/client'
import { projectBySlugQuery, allProjectsQuery } from '@/sanity/lib/queries'
import { ProjectDetail } from '@/components/direction/ProjectDetail'
import { ProjectJsonLd } from '@/components/seo/ProjectJsonLd'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'
import type { Project } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const projects: Project[] = await client.fetch(allProjectsQuery)
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })
  if (!project) return { title: 'Not Found | Sim Kaur' }

  return {
    title: `${project.title} | Sim Kaur`,
    description: `${project.title} — ${project.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video'} by Sim Kaur`,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })

  if (!project) notFound()

  return (
    <>
      <ProjectJsonLd project={project} />
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
