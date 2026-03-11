/**
 * Hardcoded project data from the prototype wireframes.
 * This will be replaced by Sanity CMS data once content is migrated.
 */

export interface StaticProject {
  slug: string
  title: string
  meta: string
  category: 'fashion-dance' | 'music-video'
  year: number
  description: string
  video?: { platform: 'vimeo' | 'youtube'; id: string; aspect?: string }
}

export const staticProjects: StaticProject[] = [
  {
    slug: 'crossfire',
    title: 'Crossfire',
    meta: 'Fashion Dance Film, 2025',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Direction, cinematography & edit. 2025, Sydney.\n\nDance fashion film starring Aaliyah Paea & Rome Champion. Premiered at Palace Cinemas as part of JD IN MOTION.\n\nInspired by the love and energy of dance battles and community in Sydney. A small crew hypes a casual battle between the couple. Their chemistry flips competition into conversation.',
    video: undefined, // No video embed yet — image only
  },
  {
    slug: 'padani-elle-india',
    title: 'Padani for ELLE India',
    meta: 'Fashion Film, 2025',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Direction, cinematography & edit. 2025, Paris.\n\nFrom Sri Lanka to Paris, model, stylist and podcaster Padani weaves her story into the fabric of the lungi, a garment she grew up with, worn by uncles in the rice fields and on the veranda.',
    video: { platform: 'vimeo', id: '1151520744', aspect: '9 / 16' },
  },
  {
    slug: 'swamp',
    title: 'SWAMP',
    meta: 'Dance Fashion Film, 2025',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Dance fashion film starring Amanda Va. Direction & edit. 2025, Sydney.\n\nProducer: Holly Peakman\nCinematography: Liam Viray\n1st AC: Gerard Cabellon\n2nd AC: Jeannry Marinas\nStyling: Hazel Sherritt',
    video: { platform: 'vimeo', id: '1092672509' },
  },
  {
    slug: 'jiggy-jaya-sftm',
    title: 'Jiggy Jaya x SFTM',
    meta: 'Dance Fashion Film, 2025',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Dance fashion film starring Jiggy Jaya, in collaboration with Sydney label Song for the Mute. Direction.',
    video: { platform: 'vimeo', id: '1092672296' },
  },
  {
    slug: 'pam-bali',
    title: 'PAM Bali',
    meta: 'Fashion Film, 2024',
    category: 'fashion-dance',
    year: 2024,
    description:
      'Direction, cinematography & edit. 2024, Kuta Beach Skatepark, Indonesia.\n\nDance fashion film starring Balinese street dancers Rory and Billy, in collaboration with fashion label Perks and Mini (P.A.M) x Nick Sethi.\nAssisted and styled by Hazel Sherritt.',
    video: { platform: 'vimeo', id: '1153113366' },
  },
  {
    slug: 'pravaah',
    title: 'Pravaah',
    meta: 'Experimental Dance Film, 2023',
    category: 'fashion-dance',
    year: 2023,
    description:
      'Direction, cinematography & edit. 2023, Sydney.\n\nShort experimental Bharatanatyam dance film featuring Anjana Chandran. The dance traces the cycle of life and death. Shot on VHS.\n\nExhibited at Pari (ARI) Art Gallery, 2025.',
    video: { platform: 'vimeo', id: '1151462076' },
  },
  {
    slug: 'paris-in-sydney',
    title: 'Paris in Sydney',
    meta: 'Dance Film',
    category: 'fashion-dance',
    year: 2024,
    description: 'Direction.',
    video: { platform: 'vimeo', id: '1153107275' },
  },
  {
    slug: 'velvet-skin',
    title: 'Velvet Skin',
    meta: 'Dylan Atlantis, 2024',
    category: 'music-video',
    year: 2024,
    description:
      'Direction. 2024, Sydney.\n\nMusic video for Dylan Atlantis.\n\nTalent: Cat Strat\nProducer: Jacinthe Lau\nCinematography: Jesse Campos\nEditor: Zion Garcia',
    video: { platform: 'youtube', id: 'dGxXAoKr_X4' },
  },
  {
    slug: 'shy-sol',
    title: 'Shy Sol',
    meta: 'JUPiTA, 2025',
    category: 'music-video',
    year: 2025,
    description:
      'Direction & edit. 2025, Melbourne.\n\nMusic video for JUPiTA.\n\nTalent: CD\nProducer: Holly Peakman\nCinematography: Alessia Chapman',
    video: { platform: 'youtube', id: 'lvyVS5K9u9c' },
  },
  {
    slug: 'in-the-mood-for-love',
    title: 'In The Mood for Love',
    meta: 'Church, 2025',
    category: 'music-video',
    year: 2025,
    description:
      'Direction & edit. 2025, Sydney.\n\nMusic video for New Zealand musician, Church. A black & white, movement-based film starring Iolanthe.\n\nCinematography: Lucca Bp\nSteadicam: Markus Sternecker\nGaffer: Will Bush\nMovement direction: Min Bin',
    video: { platform: 'youtube', id: 'YFQ3muHQf_Y' },
  },
  {
    slug: 'sabor-celestial',
    title: 'Sabor Celestial',
    meta: 'Cherry Chola, 2025',
    category: 'music-video',
    year: 2025,
    description:
      'Direction, cinematography & edit. 2025, Sydney & Colombia.\n\nMusic video for Cherry Chola. Shot across Colombia and Sydney on Mac Photobooth and digicam.',
    video: { platform: 'youtube', id: 'qOVkUAOt3XQ' },
  },
  {
    slug: 'pages',
    title: 'Pages',
    meta: 'Thandi',
    category: 'music-video',
    year: 2024,
    description: 'Direction.',
    video: { platform: 'youtube', id: 'CInFC1yk5t8' },
  },
]
