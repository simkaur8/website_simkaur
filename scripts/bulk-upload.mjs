#!/usr/bin/env node
/**
 * Bulk upload script — populates Sanity CMS with content
 * matching the exact order from simrat-portfolio-prototype.html
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { basename, extname } from 'path'

const client = createClient({
  projectId: '3sg6wuy5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const C = '/Users/sim/Documents/PORTFOLIO WEBSITE/WEBSITE CONTENT'

// ── Helpers ──────────────────────────────────────────────────────────────────

async function uploadImg(filePath) {
  if (!existsSync(filePath)) {
    console.log(`  ⚠ File not found: ${filePath}`)
    return null
  }
  console.log(`  📷 ${basename(filePath)}`)
  const buf = readFileSync(filePath)
  const asset = await client.assets.upload('image', buf, { filename: basename(filePath) })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

function key() { return Math.random().toString(36).slice(2, 10) }

function pt(text) {
  if (!text) return undefined
  return text.split('\n\n').filter(Boolean).map(p => ({
    _type: 'block', _key: key(), style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: key(), text: p.replace(/\n/g, ' '), marks: [] }],
  }))
}

// ── PROJECTS (exact order from prototype direction grid) ─────────────────────

const projects = [
  {
    slug: 'crossfire', title: 'Crossfire', category: 'fashion-dance', year: 2025,
    description: 'Direction, cinematography & edit. 2025, Sydney.\n\nDance fashion film starring Aaliyah Paea & Rome Champion. Premiered at Palace Cinemas as part of JD IN MOTION.\n\nInspired by the love and energy of dance battles and community in Sydney. A small crew hypes a casual battle between the couple. Their chemistry flips competition into conversation.',
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
      { role: 'Dancers', name: 'Angelique Van Jour, Jayde Albulario, Julie Thompson, Kailan Teneti, Marcya Fugawai, Roland Gomes, Samuel Chan, Yu Kato' },
      { role: 'Stylists', name: 'Hazel Sherritt, Jaidyn Bowden' },
      { role: 'Sound Design', name: 'Luke Fuller' },
      { role: 'Sound Mix', name: 'Issa Tejima' },
      { role: 'Music', name: "Dance Can't Dun (Ragz Originale ft John Glacier), Power (TellaX), Move (Dreamer Isioma), Trench Town (Gazthemad, SONNY)" },
      { role: 'Production Design', name: 'Renee Trinity Kypriotis' },
      { role: 'Production Design Assist', name: 'Alice Ly' },
      { role: 'Colourist', name: 'Liam Viray' },
      { role: 'On Set Medical', name: 'Paramjeet Dhillon' },
      { role: 'Runners', name: 'Nimrit Kaur, Bianca Chatterjee' },
      { role: 'Graffiti Artist', name: 'Misty' },
    ],
    thumb: `${C}/DIRECTION/GIFS/STATIC THUMBNAILS/CROSSFIRE_THUMBNAIL.png`,
    galleryFiles: [
      `${C}/DIRECTION/CROSSFIRE ASSETS/Film images/CROSSFIRE6.jpg`,
    ],
    videoEmbed: null,
  },
  {
    slug: 'padani-for-elle-india', title: 'Padani for ELLE India', category: 'fashion-dance', year: 2025,
    description: 'Direction, cinematography & edit. 2025, Paris.\n\nFrom Sri Lanka to Paris, model, stylist and podcaster Padani weaves her story into the fabric of the lungi, a garment she grew up with, worn by uncles in the rice fields and on the veranda.',
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
    thumb: `${C}/DIRECTION/GIFS/PADANI_ELLE_THUMB.jpg`,
    galleryFiles: [
      `${C}/DIRECTION/ELLE INDIA PADANI ASSETS/PADANI1.webp`,
      `${C}/DIRECTION/ELLE INDIA PADANI ASSETS/PADANI3.webp`,
      `${C}/DIRECTION/ELLE INDIA PADANI ASSETS/PADANI5.webp`,
    ],
    videoEmbed: { platform: 'vimeo', id: '1151520744' },
  },
  {
    slug: 'swamp', title: 'SWAMP', category: 'fashion-dance', year: 2025,
    description: 'Dance fashion film starring Amanda Va. Direction & edit. 2025, Sydney.',
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Amanda Va' },
      { role: 'Producer', name: 'Holly Peakman' },
      { role: 'Cinematography', name: 'Liam Viray' },
      { role: '1st AC', name: 'Gerard Cabellon' },
      { role: '2nd AC', name: 'Jeannry Marinas' },
      { role: 'Styling', name: 'Hazel Sherritt' },
    ],
    thumb: `${C}/DIRECTION/GIFS/STATIC THUMBNAILS/SWAMP_THUMB_SOURCE_1.png`,
    galleryFiles: [],
    videoEmbed: { platform: 'vimeo', id: '1092672509' },
  },
  {
    slug: 'jiggy-jaya-x-sftm', title: 'Jiggy Jaya x Song for the Mute', category: 'fashion-dance', year: 2025,
    description: 'Dance fashion film starring Jiggy Jaya, in collaboration with Sydney label Song for the Mute. Direction.',
    credits: [
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Cinematography', name: 'Max Dona' },
      { role: 'Sound Design', name: 'Jenny' },
      { role: 'Styling', name: 'Hazel Sherritt' },
      { role: 'Background Movement Direction', name: 'Tiara Vella' },
      { role: 'Background Dancers', name: 'Allie Graham, Francesca Garcia' },
      { role: 'Music', name: 'Stilts by J Dilla' },
    ],
    thumb: `${C}/DIRECTION/GIFS/JIGGYJAYA_SFTM.webp`,
    galleryFiles: [
      `${C}/DIRECTION/JIGGY JAYA X SFTM ASSETS/IMG_2857.webp`,
      `${C}/DIRECTION/JIGGY JAYA X SFTM ASSETS/IMG_2939.webp`,
      `${C}/DIRECTION/JIGGY JAYA X SFTM ASSETS/IMG_3098.webp`,
    ],
    videoEmbed: { platform: 'vimeo', id: '1092672296' },
  },
  {
    slug: 'pam-bali', title: 'PAM Bali', category: 'fashion-dance', year: 2024,
    description: 'Direction, cinematography & edit. 2024, Kuta Beach Skatepark, Indonesia.\n\nDance fashion film starring Balinese street dancers Rory and Billy, in collaboration with fashion label Perks and Mini (P.A.M) x Nick Sethi.',
    credits: [
      { role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Rory, Billy' },
      { role: 'Styling', name: 'Hazel Sherritt' },
    ],
    thumb: `${C}/DIRECTION/GIFS/PAM_BALI.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'vimeo', id: '1153113366' },
  },
  {
    slug: 'pravaah', title: 'Pravaah', category: 'fashion-dance', year: 2023,
    description: 'Direction, cinematography & edit. 2023, Sydney.\n\nShort experimental Bharatanatyam dance film featuring Anjana Chandran. The dance traces the cycle of life and death. Shot on VHS.\n\nExhibited at Pari (ARI) Art Gallery, 2025.',
    credits: [
      { role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' },
      { role: 'Featuring', name: 'Anjana Chandran' },
    ],
    thumb: `${C}/DIRECTION/GIFS/PRAVAAH_1.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'vimeo', id: '1151462076' },
  },
  {
    slug: 'paris-in-sydney', title: 'Paris in Sydney', category: 'fashion-dance', year: 2024,
    description: 'Direction.',
    credits: [{ role: 'Direction', name: 'Simrat Kaur' }],
    thumb: `${C}/DIRECTION/GIFS/PARIS_SYD.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'vimeo', id: '1153107275' },
  },
  {
    slug: 'velvet-skin', title: 'Velvet Skin', category: 'music-video', year: 2024,
    description: 'Direction. 2024, Sydney.\n\nMusic video for Dylan Atlantis.',
    credits: [
      { role: 'Direction', name: 'Simrat Kaur' },
      { role: 'Talent', name: 'Cat Strat' },
      { role: 'Producer', name: 'Jacinthe Lau' },
      { role: 'Cinematography', name: 'Jesse Campos' },
      { role: 'Editor', name: 'Zion Garcia' },
    ],
    thumb: `${C}/DIRECTION/GIFS/VS_1.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'youtube', id: 'dGxXAoKr_X4' },
  },
  {
    slug: 'shy-sol', title: 'Shy Sol', category: 'music-video', year: 2025,
    description: 'Direction & edit. 2025, Melbourne.\n\nMusic video for JUPiTA.',
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Talent', name: 'CD' },
      { role: 'Producer', name: 'Holly Peakman' },
      { role: 'Cinematography', name: 'Alessia Chapman' },
    ],
    thumb: `${C}/DIRECTION/GIFS/SHYSOL_1.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'youtube', id: 'lvyVS5K9u9c' },
  },
  {
    slug: 'in-the-mood-for-love', title: 'In The Mood for Love', category: 'music-video', year: 2025,
    description: 'Direction & edit. 2025, Sydney.\n\nMusic video for New Zealand musician, Church. A black & white, movement-based film starring Iolanthe.',
    credits: [
      { role: 'Direction & Edit', name: 'Simrat Kaur' },
      { role: 'Starring', name: 'Iolanthe' },
      { role: 'Cinematography', name: 'Lucca Bp' },
      { role: 'Steadicam', name: 'Markus Sternecker' },
      { role: 'Gaffer', name: 'Will Bush' },
      { role: 'Movement Direction', name: 'Min Bin' },
    ],
    thumb: `${C}/DIRECTION/GIFS/ITM4L_2.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'youtube', id: 'YFQ3muHQf_Y' },
  },
  {
    slug: 'sabor-celestial', title: 'Sabor Celestial', category: 'music-video', year: 2025,
    description: 'Direction, cinematography & edit. 2025, Sydney & Colombia.\n\nMusic video for Cherry Chola. Shot across Colombia and Sydney on Mac Photobooth and digicam.',
    credits: [{ role: 'Direction, Cinematography & Edit', name: 'Simrat Kaur' }],
    thumb: `${C}/DIRECTION/GIFS/SABOR CELESTIAL.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'youtube', id: 'qOVkUAOt3XQ' },
  },
  {
    slug: 'pages', title: 'Pages', category: 'music-video', year: 2024,
    description: 'Direction.',
    credits: [{ role: 'Direction', name: 'Simrat Kaur' }],
    thumb: `${C}/DIRECTION/GIFS/THANDI PAGES.webp`,
    galleryFiles: [],
    videoEmbed: { platform: 'youtube', id: 'CInFC1yk5t8' },
  },
]

async function uploadProjects() {
  console.log('\n═══ UPLOADING PROJECTS ═══\n')
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    console.log(`\n▶ [${i + 1}/${projects.length}] ${p.title}`)

    const thumbnail = await uploadImg(p.thumb)
    if (!thumbnail) { console.log('  ⚠ Skipping — no thumbnail'); continue }
    thumbnail.alt = p.title

    let gallery = []
    for (const f of p.galleryFiles) {
      const img = await uploadImg(f)
      if (img) { img._key = key(); img.alt = basename(f, extname(f)); gallery.push(img) }
    }

    const doc = {
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      year: p.year,
      thumbnail,
      description: pt(p.description),
      credits: p.credits.map(c => ({ _type: 'credit', _key: key(), role: c.role, name: c.name })),
      sortOrder: i + 1,
    }
    if (p.videoEmbed) {
      doc.videoEmbed = { _type: 'videoEmbed', platform: p.videoEmbed.platform, id: p.videoEmbed.id }
    }
    if (gallery.length) doc.gallery = gallery

    const result = await client.create(doc)
    console.log(`  ✓ ${result._id}`)
  }
}

// ── PHOTOGRAPHY (exact order from prototype) ─────────────────────────────────

// Each photo collection matches one Sanity photoCollection document
// Photos within each collection are in exact prototype order

const photoCollections = [
  {
    title: 'Fashion', slug: 'fashion', category: 'fashion',
    photos: [
      { file: `${C}/PHOTOGRAPHY/FASHION/Westfield Campaign.jpg`, caption: 'Westfield Australia Diwali Campaign', description: "Campaign photography for Westfield Australia's Diwali activation, featuring Akshaya Bhutkar's Sweet Escape fashion collection. 2023." },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/ModiBodi_Campaign.webp`, caption: 'ModiBodi Campaign', description: "Campaign photography for I'm Dying Inside, a five-part TikTok drama series for Modibodi, Australia's leading period underwear brand. Directed by Arundati Thandur via FINCH and Howatson+Company. The series clocked over 2 million TikTok views and won Greatest Creative Campaign at the TikTok Australia Ad Awards. 2023." },
      { file: `${C}/PHOTOGRAPHY/FASHION/PERKS AND MINI X NICK SETHI.webp`, caption: 'PAM x Nick Sethi' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_PARRAMATTA1.webp`, caption: 'Refinery29 Parramatta', description: 'Street style photography and casting for Refinery29 Australia. Published across two editorial features documenting fashion communities in Parramatta, Western Sydney. 2023.', link: 'https://www.refinery29.com/en-au/best-street-style-parramatta-sydney' },
      { file: `${C}/PHOTOGRAPHY/FASHION/DONNA BERTRAM.jpg`, caption: 'Donna Bertram' },
      { file: `${C}/PHOTOGRAPHY/FASHION/PURGATORY_VHS_STILLS_2.webp`, caption: 'Purgatory', description: 'Fashion photography and casting. Starring Mia Kidis, represented by Stone Street Agency. Sydney, 2022.' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_MTDRUITT1.webp`, caption: 'Refinery29 Mt Druitt', description: 'Street style photography and casting for Refinery29 Australia. Published across two editorial features documenting fashion communities in Mt Druitt, Western Sydney. 2023.', link: 'https://www.refinery29.com/en-au/best-street-style-mount-druitt-sydney' },
      { file: `${C}/PHOTOGRAPHY/FASHION/SNAKES AND SHANTI_BALI/Snakes and Shanti.jpg`, caption: 'Snakes and Shanti', description: 'Direction, videography & fashion photography. Bali, Indonesia. 2024. Featuring the Eye sarong. Starring Gia-Tinh, Hazel & Aziza. Sound: Space 7 by Nala Sinephro.' },
      { file: `${C}/PHOTOGRAPHY/FASHION/MAYA.webp`, caption: 'Maya' },
      // Additional fashion (non-curated, shown in Fashion filter)
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_MTDRUITT2.webp`, caption: 'Refinery29 Mt Druitt', description: 'Street style photography for Refinery29 Australia. Mt Druitt, Western Sydney. 2023.', link: 'https://www.refinery29.com/en-au/best-street-style-mount-druitt-sydney' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_PARRAMATTA2.webp`, caption: 'Refinery29 Parramatta', description: 'Street style photography for Refinery29 Australia. Parramatta, Western Sydney. 2023.', link: 'https://www.refinery29.com/en-au/best-street-style-parramatta-sydney' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_PARRAMATTA3.webp`, caption: 'Refinery29 Parramatta' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_MTDRUITT3.jpg`, caption: 'Refinery29 Mt Druitt' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_PARRAMATTA4.webp`, caption: 'Refinery29 Parramatta' },
      { file: `${C}/PHOTOGRAPHY/FASHION/OATSTHELABELB3.webp`, caption: 'Oats the Label', description: 'Campaign photography and casting for Oats the Label. 2019.' },
      { file: `${C}/PHOTOGRAPHY/FASHION/OATSTHELABEL2.webp`, caption: 'Oats the Label', description: 'Campaign photography and casting for Oats the Label. 2021.' },
      { file: `${C}/PHOTOGRAPHY/FASHION/FLUX HANDBAG BRAND 2.webp`, caption: 'FLUX', description: 'Fashion photography for independent Sydney designer, Dhilini. Sydney, 2022.' },
      { file: `${C}/PHOTOGRAPHY/FASHION/Akshaya Bhutkar Honours Collection.webp`, caption: 'Akshaya Bhutkar Honours Collection', description: "Photography and casting for designer Akshaya Bhutkar's graduate honours collection. 2021." },
      { file: `${C}/PHOTOGRAPHY/FASHION/LIAXS1.webp`, caption: 'Lia' },
      { file: `${C}/PHOTOGRAPHY/FASHION/TIARA VELLA.webp`, caption: 'Tiara Vella' },
      { file: `${C}/PHOTOGRAPHY/FASHION/AAFW ERIK YVON SHOW.webp`, caption: 'AAFW Erik Yvon Show' },
      { file: `${C}/PHOTOGRAPHY/FASHION/Culture Machine.jpg`, caption: 'Culture Machine' },
      { file: `${C}/PHOTOGRAPHY/FASHION/Akshaya x Westfields-10.webp`, caption: 'Akshaya x Westfield' },
      { file: `${C}/PHOTOGRAPHY/FASHION/SNAKES AND SHANTI_BALI/Snakes and Shanti 2.webp`, caption: 'Snakes and Shanti' },
      { file: `${C}/PHOTOGRAPHY/FASHION/AAFW ERIK VYON SHOW 2.webp`, caption: 'AAFW' },
      { file: `${C}/PHOTOGRAPHY/FASHION/REFINERY29/REFINERY29_PARRAMATTA5.webp`, caption: 'Refinery29 Parramatta' },
    ],
  },
  {
    title: 'Portraits', slug: 'portraits', category: 'portraits',
    photos: [
      // Curated portraits (shown in All view)
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Loyle Carner.webp`, caption: 'Loyle Carner' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Cherry Chola 2.webp`, caption: 'Cherry Chola' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Elle Ngo.webp`, caption: 'Elle Ngo' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Nancy Dennis.webp`, caption: 'Nancy Dennis' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Nimrit Kaur.jpg`, caption: 'Nimrit Kaur' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Jack Garcia.jpg`, caption: 'Jack Garcia' },
      // Additional portraits
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Celina.webp`, caption: 'Celina' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Sara for GCH plant dye scarves.webp`, caption: 'Sara for GCH' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Cherry Chola.jpg`, caption: 'Cherry Chola' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Yasmine for Pushmag.jpg`, caption: 'Yasmine for Pushmag' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Brown Suga Princess Press 3.webp`, caption: 'Brown Suga Princess' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Thandi.webp`, caption: 'Thandi' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Ruger Acclaim Magazine.webp`, caption: 'Ruger Acclaim Magazine' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Brown Suga Princess Press 2.jpg`, caption: 'Brown Suga Princess' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Mia Dennis 1.jpg`, caption: 'Mia Dennis' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Brown Suga Princess Press 1.jpg`, caption: 'Brown Suga Princess' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Min Wong.jpg`, caption: 'Min Wong' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/KUTA BEACH.webp`, caption: 'Kuta Beach' },
      { file: `${C}/PHOTOGRAPHY/PORTRAITS/Mia Dennis 2.jpg`, caption: 'Mia Dennis' },
    ],
  },
  {
    title: 'Life', slug: 'life', category: 'life',
    photos: [
      // Curated life (shown in All view)
      { file: `${C}/PHOTOGRAPHY/LIFE/PARIS 2025/PARIS_2025_1.webp`, caption: 'Paris, 2025' },
      { file: `${C}/PHOTOGRAPHY/LIFE/PARIS 2025/PARIS_2025_2.webp`, caption: 'Paris, 2025' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_6.webp`, caption: 'India, 2019' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE4.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_2.webp`, caption: 'India, 2019' },
      // Additional life — Paris 2025
      { file: `${C}/PHOTOGRAPHY/LIFE/PARIS 2025/PARIS_2025_3.jpg`, caption: 'Paris, 2025' },
      { file: `${C}/PHOTOGRAPHY/LIFE/PARIS 2025/PARIS_2025_4.jpg`, caption: 'Paris, 2025' },
      // Punjab 2024
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_1.jpg`, caption: 'Punjab, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_2.webp`, caption: 'Punjab, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_3.jpg`, caption: 'Punjab, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_4.jpg`, caption: 'Punjab, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_5.webp`, caption: 'Punjab, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2024/PUNJAB_6.webp`, caption: 'Punjab, 2024' },
      // Colombia, Sri Lanka, Bali 2024
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE1.jpg`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE3.jpg`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE5.jpg`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE7.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE9.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE11.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE14.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      { file: `${C}/PHOTOGRAPHY/LIFE/COLOMBIA, SRI LANKA, BALI 2024/1_WORLD_THRU_3RD_EYE17.webp`, caption: 'Colombia, Sri Lanka, Bali, 2024' },
      // India 2019
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_1.jpeg`, caption: 'India, 2019' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_3.jpeg`, caption: 'India, 2019' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_4.webp`, caption: 'India, 2019' },
      { file: `${C}/PHOTOGRAPHY/LIFE/INDIA 2019/INDIA_2019_5.jpeg`, caption: 'India, 2019' },
    ],
  },
  {
    title: 'Events', slug: 'events', category: 'events',
    photos: [
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Fragile minds.webp`, caption: 'Fragile Minds' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects 14.webp`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects 12.jpg`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/RickyNicoleWedding87.jpg`, caption: 'Ricky Nicole Wedding' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club Chrome.webp`, caption: 'Club Chrome' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects8.jpg`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects9.webp`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/DIWALIPOWERHOURSE_FINALIMGS_11.jpg`, caption: 'Diwali Powerhouse Museum' },
      { file: `${C}/PHOTOGRAPHY/EVENT/DIWALIPOWERHOURSE_FINALIMGS_63.jpg`, caption: 'Diwali Powerhouse Museum' },
      { file: `${C}/PHOTOGRAPHY/EVENT/DIWALIPOWERHOURSE_FINALIMGS_83.jpg`, caption: 'Diwali Powerhouse Museum' },
      { file: `${C}/PHOTOGRAPHY/EVENT/Powerhouse Museum Diwali2.jpg`, caption: 'Powerhouse Museum Diwali' },
      { file: `${C}/PHOTOGRAPHY/EVENT/Powerhouse Museum Diwali3.webp`, caption: 'Powerhouse Museum Diwali' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Office Magazine AAFW.jpg`, caption: 'Office Magazine AAFW' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Office Magazine AAWF_great.jpg`, caption: 'Office Magazine AAFW' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Office Magazine AAFW 3.webp`, caption: 'Office Magazine AAFW' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Office Magazine AAFW 5.webp`, caption: 'Office Magazine AAFW' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Office Magazine AAFW 6.webp`, caption: 'Office Magazine AAFW' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects5.webp`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects6.jpg`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club Selects13.webp`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects 15.jpg`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Club selects11.jpg`, caption: 'Club Selects' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Genesis Owusu.jpg`, caption: 'Genesis Owusu' },
      { file: `${C}/PHOTOGRAPHY/EVENT/CLUB:PARTY/Planet Abundance.webp`, caption: 'Planet Abundance' },
      { file: `${C}/PHOTOGRAPHY/EVENT/Powerhouse Museum Diwali4.webp`, caption: 'Powerhouse Museum Diwali' },
    ],
  },
]

async function uploadPhotoCollections() {
  console.log('\n═══ UPLOADING PHOTO COLLECTIONS ═══\n')

  for (let ci = 0; ci < photoCollections.length; ci++) {
    const col = photoCollections[ci]
    console.log(`\n▶ ${col.title} (${col.photos.length} photos)`)

    // Use first photo as cover
    const coverImg = await uploadImg(col.photos[0].file)
    if (!coverImg) { console.log('  ⚠ Skipping — no cover'); continue }
    coverImg.alt = col.title

    const photos = []
    for (let i = 0; i < col.photos.length; i++) {
      const p = col.photos[i]
      const img = await uploadImg(p.file)
      if (!img) continue
      const photoObj = {
        _type: 'object',
        _key: key(),
        image: { ...img, alt: p.caption || basename(p.file, extname(p.file)) },
        caption: p.caption || '',
      }
      if (p.description) photoObj.description = p.description
      if (p.link) photoObj.articleLink = p.link
      photos.push(photoObj)
    }

    const doc = {
      _type: 'photoCollection',
      title: col.title,
      slug: { _type: 'slug', current: col.slug },
      category: col.category,
      coverImage: coverImg,
      photos,
      sortOrder: ci + 1,
    }

    const result = await client.create(doc)
    console.log(`  ✓ ${result._id} (${photos.length} photos uploaded)`)
  }
}

// ── EXHIBITIONS (exact order from prototype) ─────────────────────────────────

async function uploadExhibitions() {
  console.log('\n═══ UPLOADING EXHIBITIONS ═══\n')

  // 1. Pravaah at Pari Art Gallery
  console.log('\n▶ Pravaah Installation at Pari Art Gallery')
  const pariMedia = []
  for (const f of [
    `${C}/EXHIBITIONS/PARI_ART_GALLERY/PRAVAAH Installation.webp`,
    `${C}/EXHIBITIONS/PARI_ART_GALLERY/PRAVAAH Installation 2.jpg`,
  ]) {
    const img = await uploadImg(f)
    if (img) { img._key = key(); img.alt = 'Pravaah Installation'; pariMedia.push(img) }
  }

  const pariDesc = "Pravaah is a short experimental Bharatanatyam film featuring Anjana Chandran. The dance traces the cycle of life and death. Anjana takes on the form of the divine feminine, expressing love for sky, water, wind, rain, and a leaping deer, before moving through destruction and grief. From a single teardrop, new life is born and a flower blooms.\n\nThe film is installed on a CRT monitor surrounded by personal objects: worn books, family photographs, incense, quiet offerings from a bedside table. This altar traces the line between the personal and the eternal, the sacred and the everyday."

  let r = await client.create({
    _type: 'exhibition',
    title: "'Pravaah' Installation at Pari Art Gallery",
    slug: { _type: 'slug', current: 'pravaah-pari-art-gallery' },
    subtitle: "Sound and moving image installation with found objects. 1 min 30 sec. Exhibited as part of Pari (ARI)'s group exhibition Weeds Crack Concrete, 2025.",
    year: 2025,
    description: pt(pariDesc),
    media: pariMedia,
    externalLink: 'https://vimeo.com/1151462076',
  })
  console.log(`  ✓ ${r._id}`)

  // 2. Homecoming
  console.log('\n▶ Homecoming')
  const homeMedia = []
  for (const f of [
    `${C}/EXHIBITIONS/HOMECOMING/IMG_0002.webp`,
    `${C}/EXHIBITIONS/HOMECOMING/IMG_0001.JPG`,
    `${C}/EXHIBITIONS/HOMECOMING/IMG_0016.JPG`,
  ]) {
    const img = await uploadImg(f)
    if (img) { img._key = key(); img.alt = 'Homecoming'; homeMedia.push(img) }
  }

  r = await client.create({
    _type: 'exhibition',
    title: 'Homecoming',
    slug: { _type: 'slug', current: 'homecoming' },
    subtitle: "Collage installation using family photographs and found objects. Exhibited as part of Akshaya Bhutkar's group show at Studio Killa, Marrickville. 2025.",
    year: 2025,
    description: pt("Collage installation using family photographs and found objects. Exhibited as part of Akshaya Bhutkar's group show at Studio Killa, Marrickville. 2025."),
    media: homeMedia,
  })
  console.log(`  ✓ ${r._id}`)
}

// ── SITE SETTINGS ────────────────────────────────────────────────────────────

async function uploadSiteSettings() {
  console.log('\n═══ UPLOADING SITE SETTINGS ═══\n')

  // Upload about image
  let aboutImg = null
  const aboutFile = `${C}/ABOUT/SIM_ABOUTME_IMGS_REAL.webp`
  if (existsSync(aboutFile)) {
    aboutImg = await uploadImg(aboutFile)
  }

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    bio: pt('Sim Kaur is a Punjabi creative director, filmmaker, and photographer based in Sydney.'),
    email: 'simtheaquarius@gmail.com',
    socialLinks: [
      { _type: 'object', _key: 'ig', platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
      { _type: 'object', _key: 'vim', platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
    ],
    footerCta: 'contact me :-)',
  }

  const result = await client.createOrReplace(doc)
  console.log(`  ✓ Site settings: ${result._id}`)
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting bulk upload to Sanity CMS...')
  console.log('   Matching exact order from simrat-portfolio-prototype.html\n')

  try {
    await uploadProjects()
    await uploadPhotoCollections()
    await uploadExhibitions()
    await uploadSiteSettings()
    console.log('\n\n✅ All done! Refresh localhost:3000 to see your content.')
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    if (err.statusCode === 401 || err.statusCode === 403) {
      console.error('Token issue — check your SANITY_TOKEN has Editor permissions.')
    }
    process.exit(1)
  }
}

main()
