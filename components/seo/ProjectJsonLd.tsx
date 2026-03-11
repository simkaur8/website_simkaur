import type { Project } from '@/sanity/lib/types'

interface ProjectJsonLdProps {
  project: Project
}

export function ProjectJsonLd({ project }: ProjectJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    dateCreated: project.year ? String(project.year) : undefined,
    genre: project.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video',
    url: `https://simkaur.art/direction/${project.slug.current}`,
    creator: {
      '@type': 'Person',
      name: 'Sim Kaur',
      url: 'https://simkaur.art',
    },
  }

  // Safe: JSON.stringify of our own structured data object, not user-supplied HTML
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
