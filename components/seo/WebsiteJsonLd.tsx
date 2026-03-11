export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sim Kaur',
    url: 'https://simkaur.art',
    description:
      'Portfolio of Sim Kaur — Creative Director, Fashion Film Director, Music Video Director, and Photographer based in Sydney, Australia.',
    author: {
      '@type': 'Person',
      name: 'Sim Kaur',
      url: 'https://simkaur.art',
      jobTitle: 'Creative Director',
      sameAs: ['https://www.instagram.com/s1mkaur/', 'https://vimeo.com/user197917349'],
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
