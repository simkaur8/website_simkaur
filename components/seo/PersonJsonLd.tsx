export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sim Kaur',
    url: 'https://simkaur.art',
    jobTitle: 'Creative Director',
    description:
      'Creative Director, Fashion Film Director, Music Video Director, and Photographer based in Sydney, Australia. Specialising in dance films, fashion films, and visual storytelling.',
    knowsAbout: [
      'Fashion Film Direction',
      'Music Video Direction',
      'Dance Film',
      'Cinematography',
      'Creative Direction',
      'Photography',
      'Visual Storytelling',
    ],
    workLocation: {
      '@type': 'Place',
      name: 'Sydney',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
    },
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
