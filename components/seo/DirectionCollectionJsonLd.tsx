import { staticProjects } from '@/lib/projects-data'

export function DirectionCollectionJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Direction — Sim Kaur',
    description:
      'Film direction portfolio by Sim Kaur — fashion films, dance films, and music videos.',
    url: 'https://simkaur.art/direction',
    author: {
      '@type': 'Person',
      name: 'Sim Kaur',
      url: 'https://simkaur.art',
    },
    hasPart: staticProjects.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      url: `https://simkaur.art/direction/${p.slug}`,
      genre: p.category === 'fashion-dance' ? 'Fashion & Dance Film' : 'Music Video',
      dateCreated: String(p.year),
      creator: { '@type': 'Person', name: 'Sim Kaur' },
    })),
  }

  // Safe: JSON.stringify of our own hardcoded data, not user-supplied HTML
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
