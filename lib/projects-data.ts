/**
 * Hardcoded project data from the prototype wireframes.
 * This will be replaced by Sanity CMS data once content is migrated.
 */

export interface Credit {
  role: string
  name: string
}

export interface StaticProject {
  slug: string
  title: string
  meta: string
  category: 'fashion-dance' | 'music-video'
  year: number
  description: string
  synopsis?: string[]
  credits?: Credit[]
  galleryCount?: number
  galleryImages?: string[]
  postcardVideos?: string[]
  thumbnail?: string
  video?: { platform: 'vimeo' | 'youtube'; id: string; hash?: string; aspect?: string }
  btsThumbnail?: string
  btsImages?: string[]
  comingSoon?: boolean
  contactSheet?: boolean
}

export const staticProjects: StaticProject[] = [
  {
    slug: 'crossfire',
    title: 'CROSSFIRE',
    meta: 'Fashion & Dance, 2026, Sydney',
    thumbnail: '/images/vortex/crossfire-thumb.webp',
    category: 'fashion-dance',
    year: 2026,
    description:
      'Direction & edit. 2026, Sydney.\n\nDance fashion film starring Aaliyah Paea & Rome Champion. Premiered at Palace Cinemas as part of JD IN MOTION.\n\nThis film is inspired by my obsession with watching battles between friends, siblings, partners, members of the same crew. Despite it being a competition, the love is so palpable.\n\nA small crew hypes a casual battle between the couple. Rome throws the first call, Aaliyah answers, each round an energetic exchange that escalates from playful competition, to charged battle, to confession. Their chemistry flips competition into conversation: receiving, reimagining, returning, then dancing together.\n\nPaying homage to Aaliyah & Rome\u2019s talent, their love, and the energy of dance battles + community here in Syd through fashion and film.',
    synopsis: [
      'Direction & edit. 2026, Sydney. Dance fashion film starring Aaliyah Paea & Rome Champion. Premiered at Palace Cinemas as part of JD IN MOTION.',
      'This film is inspired by my obsession with watching battles between friends, siblings, partners, members of the same crew. Despite it being a competition, the love is so palpable.',
      'A small crew hypes a casual battle between the couple. Rome throws the first call, Aaliyah answers, each round an energetic exchange that escalates from playful competition, to charged battle, to confession. Their chemistry flips competition into conversation: receiving, reimagining, returning, then dancing together. Paying homage to Aaliyah & Rome\u2019s talent, their love, and the energy of dance battles + community here in Syd through fashion and film.',
    ],
    credits: [
      { role: 'Choreographed by & Starring', name: 'Aaliyah Paea, Rome Champion' },
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Producers', name: 'Molly Kyriakidis-Costello, Holly Peakman' },
      { role: 'Movement Direction', name: 'Jamane Virdo' },
      { role: 'Cinematography', name: 'Cameron Johnson' },
      { role: 'Steadicam', name: 'Matthew Shanks' },
      { role: 'Gaffer', name: 'Will Bush' },
      { role: 'Camera', name: 'Nicholas Severino' },
      { role: 'Assistant Camera', name: 'John Carlo Acierda' },
      {
        role: 'Dancers',
        name: 'Angelique Van Jour, Jayde Albulario, Julie Thompson, Kailan Teneti, Marcya Fugawai, Roland Gomes, Samuel Chan, Yu Kato',
      },
      { role: 'Stylists', name: 'Hazel Sherritt, Jaidyn Bowden' },
      { role: 'Sound Design', name: 'Luke Fuller' },
      { role: 'Sound Mix', name: 'Issa Tejima' },
      {
        role: 'Music',
        name: 'Dance Can\u2019t Dun (Ragz Originale ft John Glacier), Power (TellaX), Move (Dreamer Isioma), Trench Town (Gazthemad, SONNY)',
      },
      { role: 'Production Design', name: 'Renee Trinity Kypriotis' },
      { role: 'Production Design Assist', name: 'Alice Ly' },
      { role: 'Colourist', name: 'Liam Viray' },
      { role: 'On Set Medical', name: 'Paramjeet Dhillon' },
      { role: 'Runners', name: 'Nimrit Kaur, Bianca Chatterjee' },
      { role: 'Graffiti Artist', name: 'Misty' },
    ],
    galleryCount: 7,
    galleryImages: [
      '/images/direction/crossfire/crossfire6.webp',
      '/images/direction/crossfire/crossfire1.webp',
      '/images/direction/crossfire/crossfire10.webp',
      '/images/direction/crossfire/crossfire4.webp',
      '/images/direction/crossfire/crossfire12.webp',
      '/images/direction/crossfire/crossfire3.webp',
      '/images/direction/crossfire/crossfire7.webp',
    ],
    btsThumbnail: '/images/direction/crossfire/crossfire-bts.webp',
    video: { platform: 'vimeo', id: '1172757704', hash: 'b2deaf9daf' },
  },
  {
    slug: 'padani-elle-india',
    title: 'Padani for ELLE India',
    meta: 'Fashion Reel & Vignettes, 2025, Paris',
    thumbnail: '/images/vortex/elle-thumb.webp',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Direction, cinematography & edit. 2025, Paris.\n\nFrom Sri Lanka to Paris, model, stylist and podcaster Padani weaves her story into the fabric of the lungi, a garment she grew up with, worn by uncles in the rice fields and on the veranda.',
    synopsis: [
      'Direction, cinematography & edit. 2025, Paris. From Sri Lanka to Paris, model, stylist and podcaster Padani weaves her story into the fabric of the lungi, a garment she grew up with, worn by uncles in the rice fields and on the veranda.',
      'Now, in the bustling streets of Paris, she reimagines it exclusively for ELLE, with a mix of tradition and modern edge, pairing the Madras check with sharp blazers and effortlessly transforming it into tops and skirts. For her, the lungi is more than just clothing; it\u2019s a link to her past, a nod to her heritage, and a canvas for her personal evolution.',
    ],
    credits: [
      { role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' },
      { role: 'Styling', name: 'Padani' },
      { role: 'VHS & Photography', name: 'Anabel Burrows' },
      { role: 'Makeup', name: 'Reina Kim' },
      { role: 'Hair', name: 'Hazel Sherritt' },
      { role: 'Sound Design', name: 'Maanav Singh & Saie' },
      { role: 'Colour Grade', name: 'Liam Viray' },
      { role: 'Graphic Design', name: 'Laz Arroz' },
    ],
    galleryCount: 5,
    galleryImages: [
      '/images/direction/elle-india/padani1.webp',
      '/images/direction/elle-india/padani2.webp',
      '/images/direction/elle-india/padani3.webp',
      '/images/direction/elle-india/padani4.webp',
      '/images/direction/elle-india/padani5.webp',
    ],
    postcardVideos: [
      '/images/direction/elle-india/postcards/padani_postcard_1.mp4',
      '/images/direction/elle-india/postcards/padani_postcard_2.mp4',
      '/images/direction/elle-india/postcards/padani_postcard_3.mp4',
      '/images/direction/elle-india/postcards/padani_postcard_4.mp4',
      '/images/direction/elle-india/postcards/padani_postcard_5.mp4',
    ],
    video: { platform: 'vimeo', id: '1151520744', aspect: '9 / 16' },
  },
  {
    slug: 'swamp',
    title: 'SWAMP',
    meta: 'Dance Fashion Film, 2025',
    thumbnail: '/images/vortex/swamp.webp',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Dance fashion film starring Amanda Va. Direction & edit. 2025, Sydney.\n\nProducer: Holly Peakman\nCinematography: Liam Viray\n1st AC: Gerard Cabellon\n2nd AC: Jeannry Marinas\nStyling: Hazel Sherritt',
    synopsis: ['Dance fashion film starring Amanda Va. Direction & edit. 2025, Sydney.'],
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Amanda Va' },
      { role: 'Producer', name: 'Holly Peakman' },
      { role: 'Cinematography', name: 'Liam Viray' },
      { role: '1st AC', name: 'Gerard Cabellon' },
      { role: '2nd AC', name: 'Jeannry Marinas' },
      { role: 'Styling', name: 'Hazel Sherritt' },
    ],
    comingSoon: true,
    video: { platform: 'vimeo', id: '1092672509' },
  },
  {
    slug: 'jiggy-jaya-sftm',
    title: 'Jiggy Jaya x Song for the Mute',
    meta: 'Dance Fashion Film, 2025, Sydney',
    thumbnail: '/images/direction/thumbnails/jiggy.gif',
    category: 'fashion-dance',
    year: 2025,
    description:
      'Dance fashion film starring Jiggy Jaya, in collaboration with Sydney label Song for the Mute. Direction.',
    synopsis: [
      'Direction. 2025, Sydney. Dance fashion film starring Jiggy Jaya, in collaboration with Sydney label Song for the Mute.',
      'Inspired by the chaos of a circus, the film captures Jaya wearing Song for the Mute\u2019s Jester-inspired collection, blending playful energy with sharp choreography.',
    ],
    credits: [
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Cinematography', name: 'Max Dona' },
      { role: 'Sound Design', name: 'Jenny' },
      { role: 'Photography', name: 'Hameed' },
      { role: 'Styling', name: 'Hazel Sherritt' },
      { role: 'BG Movement Direction', name: 'Tiara Vella' },
      { role: 'Background Dancers', name: 'Allie Graham, Francesca Garcia' },
      { role: 'Music', name: 'Stilts by J Dilla' },
    ],
    galleryCount: 7,
    galleryImages: [
      '/images/direction/jiggy-jaya/img_2857.webp',
      '/images/direction/jiggy-jaya/img_2882.webp',
      '/images/direction/jiggy-jaya/img_2917.webp',
      '/images/direction/jiggy-jaya/img_2939.webp',
      '/images/direction/jiggy-jaya/img_2999.webp',
      '/images/direction/jiggy-jaya/img_3038.webp',
      '/images/direction/jiggy-jaya/img_3098.webp',
    ],
    video: { platform: 'vimeo', id: '1092672296' },
  },
  {
    slug: 'pam-bali',
    title: 'PAM x Nick Sethi',
    meta: 'Dance Fashion Film, 2024',
    thumbnail: '/images/direction/thumbnails/pam-bali.gif',
    category: 'fashion-dance',
    year: 2024,
    description:
      'Direction, cinematography & edit. 2024, Kuta Beach Skatepark, Indonesia.\n\nDance fashion film starring Balinese street dancers Rory and Billy, in collaboration with fashion label Perks and Mini (P.A.M) x Nick Sethi.\nAssisted and styled by Hazel Sherritt.',
    synopsis: [
      'Direction, cinematography & edit. 2024, Kuta Beach Skatepark, Indonesia. Dance fashion film starring Balinese street dancers Rory and Billy, in collaboration with fashion label Perks and Mini (P.A.M) x Nick Sethi.',
    ],
    credits: [
      { role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Rory, Billy' },
      { role: 'Styling', name: 'Hazel Sherritt' },
    ],
    comingSoon: true,
    video: { platform: 'vimeo', id: '1153113366' },
  },
  {
    slug: 'pravaah',
    title: 'Pravaah',
    meta: 'Experimental Dance Film, 2023',
    thumbnail: '/images/vortex/pravaah2.webp',
    category: 'fashion-dance',
    year: 2023,
    description:
      'Direction, cinematography & edit. 2023, Sydney.\n\nShort experimental Bharatanatyam dance film featuring Anjana Chandran. The dance traces the cycle of life and death. Shot on VHS.\n\nExhibited at Pari (ARI) Art Gallery, 2025.',
    synopsis: [
      'Direction, cinematography & edit. 2023, Sydney. Short experimental Bharatanatyam dance film featuring Anjana Chandran. The dance traces the cycle of life and death. Shot on VHS.',
      'This was my experimental media video project for uni. Exhibited at Pari (ARI) Art Gallery, 2025.',
    ],
    credits: [
      { role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' },
      { role: 'Featuring', name: 'Anjana Chandran' },
    ],
    comingSoon: true,
    video: { platform: 'vimeo', id: '1151462076' },
  },
  {
    slug: 'paris-in-sydney',
    title: 'Paris in Sydney',
    meta: 'Dance Film',
    thumbnail: '/images/direction/thumbnails/paris-in-sydney.webp',
    category: 'fashion-dance',
    year: 2024,
    description:
      'Direction. Starring Paris Crossley, a London-based movement artist and popper known for her work with Fiya House crew and performances for Rita Ora, Dua Lipa, and Little Mix. Cinematography by Max Dona.',
    synopsis: [
      'Direction. Starring Paris Crossley, a London-based movement artist and popper known for her work with Fiya House crew and performances for Rita Ora, Dua Lipa, and Little Mix. Cinematography by Max Dona.',
    ],
    credits: [
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Paris Crossley' },
      { role: 'Cinematography', name: 'Max Dona' },
    ],
    comingSoon: true,
    video: { platform: 'vimeo', id: '1153107275' },
  },
  {
    slug: 'velvet-skin',
    title: 'Velvet Skin',
    meta: 'Dylan Atlantis, 2024',
    thumbnail: '/images/vortex/velvet-skin.webp',
    category: 'music-video',
    year: 2024,
    description: 'Creative direction.\n\nMusic video for Dylan Atlantis, featuring Cat Strat.',
    credits: [
      { role: 'Artist', name: 'Dylan Atlantis' },
      { role: 'Talent', name: 'Cat Strat' },
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Producer', name: 'Jacinthe Lau' },
      { role: 'DOP', name: 'Jesse Campos' },
      { role: 'Editor', name: 'Zion Garcia' },
      { role: 'Assistant Camera', name: 'Natasha Vincent' },
      { role: 'Gaffer', name: 'Deniz Celik' },
      { role: 'Lighting Assistant', name: 'Abigail Wu' },
      { role: 'Stylist', name: 'Hazel Sherritt' },
      { role: 'Nail Artist', name: 'Lillian Robillo' },
      { role: 'Production Design Director', name: 'Annika Kumar' },
      { role: 'Art Director', name: 'Alice Ly' },
      {
        role: 'Production Design Assistants',
        name: 'Taj Chowdhury, Pamela Manos, Emily Sutcliffe',
      },
      { role: 'Sword Choreographer', name: 'Ray Anthony' },
      { role: 'Pole Dance Choreographer', name: 'Basjia Almaan' },
      { role: 'Duet Dance Choreographers', name: 'Amy Zhang, Jack Garcia' },
      { role: 'Movement Directors', name: 'Tiara Vella, Rylee Lister' },
      { role: 'Title Design', name: 'Lazaro' },
      { role: 'VFX', name: 'Kyla Bosque' },
      { role: 'Colour Grade', name: 'Jesse Campos' },
      { role: 'Runners', name: 'Nimrit Kaur, Josh Robillo' },
      { role: 'Photographer', name: 'Anne Thu Pham' },
      {
        role: 'BTS Media',
        name: 'Jane Inyang, Jack Rockcliffe, Feker Yibeltal, Joyce Fidel, Jade D\u2019Amico, Elle Ngo',
      },
      {
        role: 'Venues',
        name: 'Red Rattler Theater, Sydney Vintage Dance Studio, Camber Studios',
      },
    ],
    galleryImages: [
      '/images/direction/velvet-skin/vs_0.webp',
      '/images/direction/velvet-skin/vs_1.webp',
      '/images/direction/velvet-skin/vs_3.webp',
      '/images/direction/velvet-skin/vs_4.5.webp',
      '/images/direction/velvet-skin/vs_car.webp',
      '/images/direction/velvet-skin/vs_7.webp',
      '/images/direction/velvet-skin/vs_10.webp',
      '/images/direction/velvet-skin/vs_11.webp',
      '/images/direction/velvet-skin/vs_12.webp',
      '/images/direction/velvet-skin/vs_12.5.webp',
      '/images/direction/velvet-skin/vs_15.webp',
      '/images/direction/velvet-skin/vs_16.webp',
      '/images/direction/velvet-skin/vs_2.webp',
      '/images/direction/velvet-skin/vs_18.webp',
      '/images/direction/velvet-skin/vs_20.webp',
      '/images/direction/velvet-skin/vs_21.webp',
    ],
    contactSheet: true,
    btsImages: [
      '/images/direction/velvet-skin/bts/pole6.webp',
      '/images/direction/velvet-skin/bts/velvetskin32.webp',
      '/images/direction/velvet-skin/bts/pole32.webp',
      '/images/direction/velvet-skin/bts/pole11.webp',
      '/images/direction/velvet-skin/bts/02-000040.webp',
      '/images/direction/velvet-skin/bts/000031.webp',
      '/images/direction/velvet-skin/bts/000035.webp',
      '/images/direction/velvet-skin/bts/03-000029.webp',
      '/images/direction/velvet-skin/bts/dsc00235.webp',
      '/images/direction/velvet-skin/bts/img_0123.webp',
      '/images/direction/velvet-skin/bts/img_9857.webp',
      '/images/direction/velvet-skin/bts/img_9881.webp',
      '/images/direction/velvet-skin/bts/jpoycef2781-r1-22-14.webp',
    ],
    video: { platform: 'youtube', id: 'dGxXAoKr_X4' },
  },
  {
    slug: 'shy-sol',
    title: 'Shy Sol',
    meta: 'JUPiTA, 2025',
    thumbnail: '/images/vortex/shysol.webp',
    category: 'music-video',
    year: 2025,
    description:
      'Direction & edit. 2025, Melbourne.\n\nMusic video for JUPiTA.\n\nTalent: CD\nProducer: Holly Peakman\nCinematography: Alessia Chapman',
    synopsis: ['Direction & edit. 2025, Melbourne. Music video for JUPiTA.'],
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Talent', name: 'CD' },
      { role: 'Producer', name: 'Holly Peakman' },
      { role: 'Cinematography', name: 'Alessia Chapman' },
    ],
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
    synopsis: [
      'Direction & edit. 2025, Sydney. Music video for New Zealand musician, Church. A black & white, movement-based film starring Iolanthe.',
    ],
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Iolanthe' },
      { role: 'Cinematography', name: 'Lucca Bp' },
      { role: 'Steadicam', name: 'Markus Sternecker' },
      { role: 'Gaffer', name: 'Will Bush' },
      { role: 'Movement Direction', name: 'Min Bin' },
    ],
    video: { platform: 'youtube', id: 'YFQ3muHQf_Y' },
  },
  {
    slug: 'sabor-celestial',
    title: 'Sabor Celestial',
    meta: 'Cherry Chola, 2025',
    thumbnail: '/images/direction/thumbnails/sabor-celestial.gif',
    category: 'music-video',
    year: 2025,
    description:
      'Direction, cinematography & edit. 2025, Sydney & Colombia.\n\nMusic video for Cherry Chola. Shot across Colombia and Sydney on Mac Photobooth and digicam.',
    synopsis: [
      'Direction, cinematography & edit. 2025, Sydney & Colombia. Music video for Cherry Chola. Shot across Colombia and Sydney on Mac Photobooth and digicam.',
    ],
    credits: [{ role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' }],
    video: { platform: 'youtube', id: 'qOVkUAOt3XQ' },
  },
  {
    slug: 'pages',
    title: 'Pages',
    meta: 'Thandi',
    category: 'music-video',
    year: 2024,
    description: 'Direction.',
    synopsis: ['Direction.'],
    credits: [{ role: 'Direction', name: 'Simrat Kaur' }],
    video: { platform: 'youtube', id: 'CInFC1yk5t8' },
  },
]
