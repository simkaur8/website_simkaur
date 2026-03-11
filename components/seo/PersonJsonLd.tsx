export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sim Kaur',
    url: 'https://simkaur.art',
    jobTitle: 'Creative Director',
    description: 'Creative Director, Filmmaker, and Photographer based in Sydney.',
    sameAs: ['https://www.instagram.com/s1mkaur/', 'https://vimeo.com/user197917349'],
  }

  // Safe: JSON.stringify of our own structured data object, not user-supplied HTML
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
