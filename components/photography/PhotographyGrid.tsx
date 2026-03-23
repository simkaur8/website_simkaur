'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterBar } from '@/components/ui/FilterBar'

const P = '/images/photography'

interface Photo {
  src: string
  title: string
  category: 'fashion' | 'portraits' | 'event' | 'life'
  curated?: boolean
  role?: string
  description?: string
  descriptionHtml?: string
  year?: string
  objectPosition?: string
}

const photos: Photo[] = [
  // ═══ CURATED ALL VIEW — Priority order ═══
  {
    src: `${P}/fashion/pam-nick-sethi.webp`,
    title: 'PAM x Nick Sethi',
    category: 'fashion',
    curated: true,
    role: 'Direction, Cinematography & Edit',
    description:
      'Featuring Balinese street dancers Rory and Billy for Perks and Mini (P.A.M) x Nick Sethi collaboration. Shot at Kuta Beach Skatepark, Bali.',
    year: '2024',
  },
  {
    src: `${P}/fashion/westfield-campaign.webp`,
    title: 'Westfield Australia Diwali Campaign',
    category: 'fashion',
    curated: true,
    role: 'Campaign Photography',
    description:
      "Diwali campaign, commissioned by Westfield Australia. Featuring Akshaya Bhutkar's 'Sweet Escape' fashion collection.",
    year: '2023',
  },
  {
    src: `${P}/fashion/modibodi.webp`,
    title: 'ModiBodi Campaign',
    category: 'fashion',
    curated: true,
    role: 'Campaign Photography',
    description: "I'm Dying Inside, TikTok content series directed by Arundati Thandur.",
    year: '2023',
  },
  {
    src: `${P}/fashion/donna-bertram.webp`,
    title: 'Donna Bertram',
    category: 'portraits',
    curated: true,
    description: 'Portrait of Donna Bertram.',
  },
  {
    src: `${P}/portraits/loyle-carner.webp`,
    title: 'Loyle Carner',
    category: 'portraits',
    curated: true,
    role: 'Photography',
    description: 'Photographed for Acclaim Magazine.',
    year: '2023',
  },
  {
    src: `${P}/event/office-aafw-great.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    curated: true,
    description: 'Event coverage for Office Magazine at Australian Aboriginal Fashion Week.',
  },
  {
    src: `${P}/fashion/aafw1.webp`,
    title: 'AAFW Erik Yvon Show',
    category: 'fashion',
    curated: true,
    role: 'Photography',
    description: 'Backstage and runway at the Erik Yvon show, Australian Aboriginal Fashion Week.',
    year: '2023',
  },
  {
    src: `${P}/life/3rd-eye4.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    curated: true,
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/fashion/flux1.webp`,
    title: 'FLUX',
    category: 'fashion',
    curated: true,
    role: 'Campaign Photography',
    year: '2022',
  },
  {
    src: `${P}/fashion/oats-b3.webp`,
    title: 'Oats the Label',
    category: 'fashion',
    curated: true,
    role: 'Campaign Photography, Casting',
    year: '2019',
    objectPosition: 'center',
  },
  // — Oats the Label (grouped together)
  {
    src: `${P}/fashion/oats1.webp`,
    title: 'Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography, Casting',
    year: '2019',
  },
  {
    src: `${P}/fashion/oats-b1.webp`,
    title: 'Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography, Casting',
    year: '2019',
  },
  {
    src: `${P}/fashion/oats-b2.webp`,
    title: 'Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography, Casting',
    year: '2019',
  },
  {
    src: `${P}/fashion/oats2.webp`,
    title: 'Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography, Casting',
    year: '2021',
  },
  {
    src: `${P}/fashion/oats-basjia1.webp`,
    title: 'Basjia for Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography',
    description: 'Basjia for Oats the Label.',
  },
  {
    src: `${P}/fashion/oats-basjia2.webp`,
    title: 'Basjia for Oats the Label',
    category: 'fashion',
    role: 'Campaign Photography',
    description: 'Basjia for Oats the Label.',
  },
  {
    src: `${P}/portraits/elle-ngo.webp`,
    title: 'Elle Ngo',
    category: 'portraits',
    curated: true,
    description: 'Portrait of Elle Ngo.',
  },
  {
    src: `${P}/portraits/jack-garcia.webp`,
    title: 'Jack Garcia',
    category: 'portraits',
    curated: true,
    description: 'Portrait of Jack Garcia.',
  },
  {
    src: `${P}/life/india-2019-2.webp`,
    title: 'India, 2019',
    category: 'life',
    curated: true,
    description: 'Travel photography from India.',
    year: '2019',
  },
  {
    src: `${P}/fashion/tiara-vella.webp`,
    title: 'Tiara Vella',
    category: 'portraits',
    curated: true,
    description: 'Portrait of Tiara Vella.',
  },
  {
    src: `${P}/fashion/culture-machine.webp`,
    title: 'Culture Machine',
    category: 'fashion',
    curated: true,
    description: 'Editorial for Culture Machine.',
  },
  {
    src: `${P}/portraits/brown-suga1.webp`,
    title: 'Brown Suga Princess',
    category: 'portraits',
    curated: true,
    description: 'Portrait of Brown Suga Princess.',
  },

  // ═══ FASHION ADDITIONAL (grouped by project) ═══
  // — Snakes and Shanti
  {
    src: `${P}/fashion/snakes-shanti2.webp`,
    title: 'Snakes and Shanti',
    category: 'fashion',
    role: 'Direction, Videography, Photography',
    description: 'Featuring the Eye sarong. Starring Gia-Tinh, Hazel, and Aziza.',
    year: '2024',
    objectPosition: 'top',
  },
  // — Purgatory
  {
    src: `${P}/fashion/purgatory1.webp`,
    title: 'Purgatory',
    category: 'fashion',
    role: 'Fashion Photography, Casting',
    description: 'Starring Mia Kidis from Stone Street Agency.',
    year: '2022',
  },
  {
    src: `${P}/fashion/purgatory2.webp`,
    title: 'Purgatory',
    category: 'fashion',
    role: 'Fashion Photography, Casting',
    description: 'Starring Mia Kidis from Stone Street Agency.',
    year: '2022',
  },
  // — Akshaya
  {
    src: `${P}/fashion/akshaya-honours.webp`,
    title: 'Akshaya Bhutkar Honours Collection',
    category: 'fashion',
    description: 'Lookbook for Akshaya Bhutkar\u2019s honours fashion collection.',
  },
  {
    src: `${P}/fashion/akshaya-westfields.webp`,
    title: 'Akshaya x Westfields',
    category: 'fashion',
    description: 'Campaign shoot for Akshaya Bhutkar x Westfield collaboration.',
  },
  // — Refinery29
  {
    src: `${P}/fashion/ref29-mtdruitt2.webp`,
    title: 'Refinery29',
    category: 'fashion',
    role: 'Photography, Casting',
    description:
      "Street View: Mount Druitt.\nA street style documentary for Refinery29's series celebrating the multicultural creative community of Western Sydney. Profiling 21 individuals blending coveted streetwear, thrifted finds, and culturally significant pieces.",
    year: '2023',
  },
  {
    src: `${P}/fashion/ref29-mtdruitt4.webp`,
    title: 'Refinery29',
    category: 'fashion',
    role: 'Photography, Casting',
    description:
      "Street View: Mount Druitt.\nA street style documentary for Refinery29's series celebrating the multicultural creative community of Western Sydney.",
    year: '2023',
  },
  {
    src: `${P}/fashion/ref29-parra2.webp`,
    title: 'Refinery29',
    category: 'fashion',
    role: 'Photography, Casting',
    description:
      "Street View: Parramatta.\nA street style documentary for Refinery29's series capturing the fashion identity of Sydney's western cultural hub.",
    year: '2022',
  },
  // — Lia x S
  {
    src: `${P}/fashion/liaxs1.webp`,
    title: 'Lia x S',
    category: 'fashion',
    description: 'Editorial for Lia x S.',
  },
  {
    src: `${P}/fashion/liaxs2.webp`,
    title: 'Lia x S',
    category: 'fashion',
    description: 'Editorial for Lia x S.',
  },
  // — FLUX
  {
    src: `${P}/fashion/flux-polaroid1.webp`,
    title: 'FLUX',
    category: 'fashion',
    role: 'Campaign Photography',
    year: '2022',
  },
  {
    src: `${P}/fashion/flux2.webp`,
    title: 'FLUX',
    category: 'fashion',
    role: 'Campaign Photography',
    year: '2022',
  },
  {
    src: `${P}/fashion/flux-polaroid2.webp`,
    title: 'FLUX',
    category: 'fashion',
    role: 'Campaign Photography',
    year: '2022',
  },
  // (aafw2 polaroid collage removed)

  // ═══ PORTRAITS ADDITIONAL ═══
  {
    src: `${P}/portraits/aretha-brown.webp`,
    title: 'Aretha Brown',
    category: 'portraits',
    descriptionHtml:
      '<a href="https://arethabrown.bigcartel.com/" target="_blank" rel="noopener noreferrer">Aretha Brown</a> painting a mural at The Bearded Tit, 2023.',
  },
  {
    src: `${P}/portraits/foushee-acclaim.webp`,
    title: 'Foushee for Acclaim Magazine',
    category: 'portraits',
    role: 'Photography',
    description: 'Polaroid portraits of Foushee, shot for Acclaim Magazine.',
  },
  {
    src: `${P}/portraits/anabel.webp`,
    title: 'Anabel',
    category: 'portraits',
    description: 'Portrait in the Swiss Alps.',
  },
  {
    src: `${P}/portraits/nimrit-kaur.webp`,
    title: 'Nimrit Kaur',
    category: 'portraits',
    description: 'Portrait of Nimrit Kaur.',
  },
  {
    src: `${P}/portraits/club-selects4.webp`,
    title: 'Club Selects',
    category: 'portraits',
    description: 'Club night portrait.',
  },
  {
    src: `${P}/portraits/cherry-chola2.webp`,
    title: 'Cherry Chola',
    category: 'portraits',
    description: 'Portrait of Cherry Chola.',
  },
  {
    src: `${P}/portraits/club-selects3.webp`,
    title: 'Club Selects',
    category: 'portraits',
    description: 'Mirror reflection, club night on 35mm film.',
  },
  {
    src: `${P}/portraits/mia-dennis1.webp`,
    title: 'Mia Dennis',
    category: 'portraits',
    description: 'Portrait of Mia Dennis.',
  },
  {
    src: `${P}/portraits/mia-dennis2.webp`,
    title: 'Mia Dennis',
    category: 'portraits',
    description: 'Portrait of Mia Dennis.',
  },
  {
    src: `${P}/portraits/celina.webp`,
    title: 'Celina',
    category: 'portraits',
    description: 'Portrait of Celina.',
  },
  {
    src: `${P}/portraits/brown-suga2.webp`,
    title: 'Brown Suga Princess',
    category: 'portraits',
    description: 'Portrait of Brown Suga Princess.',
  },
  {
    src: `${P}/portraits/brown-suga3.webp`,
    title: 'Brown Suga Princess',
    category: 'portraits',
    description: 'Portrait of Brown Suga Princess.',
  },
  {
    src: `${P}/portraits/yasmine.webp`,
    title: 'Yasmine for Pushmag',
    category: 'portraits',
    description: 'Portrait of Yasmine, shot for Pushmag.',
  },
  {
    src: `${P}/portraits/cherry-chola.webp`,
    title: 'Cherry Chola',
    category: 'portraits',
    description: 'Portrait of Cherry Chola.',
  },
  {
    src: `${P}/portraits/min-wong.webp`,
    title: 'Min Wong',
    category: 'portraits',
    description: 'Portrait of Min Wong.',
  },
  {
    src: `${P}/portraits/kuta-beach.webp`,
    title: 'Kuta Beach',
    category: 'portraits',
    description: 'Portrait shot at Kuta Beach, Bali.',
  },
  {
    src: `${P}/portraits/sara-gch.webp`,
    title: 'Sara for GCH Plant Dye Scarves',
    category: 'portraits',
    description: 'Portrait of Sara for GCH Plant Dye Scarves.',
  },
  {
    src: `${P}/portraits/thandi.webp`,
    title: 'Thandi',
    category: 'portraits',
    description: 'Portrait of Thandi.',
  },
  {
    src: `${P}/portraits/ruger.webp`,
    title: 'Ruger for Acclaim Magazine',
    category: 'portraits',
    description: 'Portrait of Ruger, shot for Acclaim Magazine.',
  },
  {
    src: `${P}/event/fragile-minds.webp`,
    title: 'Fragile Minds',
    category: 'portraits',
    description: 'Fragile Minds event portrait.',
  },
  {
    src: `${P}/event/club5.webp`,
    title: 'Club Selects',
    category: 'portraits',
    description: 'Club night portrait.',
  },

  // ═══ EVENT ═══
  // Note: 1 curated event (office-aafw-great) comes first in filter, so 3 items here complete row 1
  // Row 1 (cols 2-4, col 1 is curated): Planet Abundance + Office AAFW + Club
  {
    src: `${P}/event/planet-abundance.webp`,
    title: 'Planet Abundance',
    category: 'event',
    description: 'Event coverage at Planet Abundance.',
  },
  {
    src: `${P}/event/planet-abundance2.webp`,
    title: 'Planet Abundance',
    category: 'event',
    description: 'Event coverage at Planet Abundance.',
  },
  {
    src: `${P}/event/office-aafw.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    description: 'Event coverage for Office Magazine at AAFW.',
  },
  {
    src: `${P}/event/club5.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  // Club highlights
  {
    src: `${P}/event/club8.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/club15.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/genesis-owusu.webp`,
    title: 'Genesis Owusu',
    category: 'event',
    description: 'Genesis Owusu at the ARIA Awards after-party with Ourness.',
  },
  {
    src: `${P}/event/club11.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  // Diwali at Powerhouse (all 4 together)
  {
    src: `${P}/event/diwali83.webp`,
    title: 'Diwali at Powerhouse',
    category: 'event',
    role: 'Event Photography',
    description:
      'Commissioned by Powerhouse Museum for the official Diwali program at Powerhouse Castle Hill, October 2025. Delivered in collaboration with the Consulate General of India, Sydney and the Swami Vivekananda Cultural Centre.',
    year: '2025',
  },
  {
    src: `${P}/event/diwali-ph2.webp`,
    title: 'Diwali at Powerhouse',
    category: 'event',
    description: 'Diwali celebrations at Powerhouse Museum Castle Hill.',
  },
  {
    src: `${P}/event/diwali11.webp`,
    title: 'Diwali at Powerhouse',
    category: 'event',
    description: 'Diwali celebrations at Powerhouse Museum Castle Hill.',
  },
  {
    src: `${P}/event/diwali63.webp`,
    title: 'Diwali at Powerhouse',
    category: 'event',
    description: 'Diwali celebrations at Powerhouse Museum Castle Hill.',
  },
  // Remaining event + editorial
  {
    src: `${P}/event/office-aafw3.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    description: 'Event coverage for Office Magazine at AAFW.',
  },
  {
    src: `${P}/event/office-aafw6.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    description: 'Event coverage for Office Magazine at AAFW.',
  },
  {
    src: `${P}/event/club13.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/office-aafw5.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    description: 'Event coverage for Office Magazine at AAFW.',
  },
  {
    src: `${P}/event/club6.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/club9.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/office-aafw4.webp`,
    title: 'Office Magazine AAFW',
    category: 'event',
    description: 'Event coverage for Office Magazine at AAFW.',
  },
  {
    src: `${P}/event/club12.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/club-chrome.webp`,
    title: 'Club Chrome',
    category: 'event',
    description: 'Club Chrome event photography.',
  },
  {
    src: `${P}/event/mias-birthday.webp`,
    title: "Mia's Birthday",
    category: 'event',
    description: 'Birthday celebration for Mia.',
  },
  {
    src: `${P}/event/club16.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  {
    src: `${P}/event/club17.webp`,
    title: 'Club Selects',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  // Tamanna the Label
  {
    src: `${P}/event/tamanna-label1.webp`,
    title: 'Tamanna the Label',
    category: 'event',
    description: 'Tamanna the Label "Come As You Are" event.',
  },
  {
    src: `${P}/event/tamanna-label2.webp`,
    title: 'Tamanna the Label',
    category: 'event',
    description: 'Tamanna the Label "Come As You Are" event.',
  },
  // Swanky Array
  {
    src: `${P}/event/swanky-array.webp`,
    title: 'Swanky Array',
    category: 'event',
    description: 'Club night photography on 35mm film.',
  },
  // Blacktown Arts dance battle
  {
    src: `${P}/event/blacktown-arts-battle.webp`,
    title: 'Blacktown Arts Dance Battle',
    category: 'event',
    description: 'Dance battle at Blacktown Arts Centre.',
  },
  {
    src: `${P}/event/blacktown-arts2.webp`,
    title: 'Blacktown Arts Dance Battle',
    category: 'event',
    description: 'Dance battle at Blacktown Arts Centre.',
  },
  {
    src: `${P}/event/blacktown-arts3.webp`,
    title: 'Blacktown Arts Dance Battle',
    category: 'event',
    description: 'Dance battle at Blacktown Arts Centre.',
  },
  {
    src: `${P}/event/blacktown-arts-djs.webp`,
    title: 'Blacktown Arts',
    category: 'event',
    description: 'DJs at Blacktown Arts Centre.',
  },
  // Ayebatonye
  {
    src: `${P}/event/ayebatonye.webp`,
    title: 'Ayebatonye',
    category: 'event',
    descriptionHtml:
      '<a href="https://www.instagram.com/ayebatonye__/" target="_blank" rel="noopener noreferrer">Ayebatonye</a> at an ARIA Awards after-party.',
  },
  // Wedding (bottom rows)
  {
    src: `${P}/event/wedding87.webp`,
    title: 'Ricky Nicole Wedding',
    category: 'event',
    description: 'Wedding photography for Ricky and Nicole.',
  },
  {
    src: `${P}/event/wedding81.webp`,
    title: 'Ricky Nicole Wedding',
    category: 'event',
    description: 'Wedding photography for Ricky and Nicole.',
  },
  {
    src: `${P}/event/wedding83.webp`,
    title: 'Ricky Nicole Wedding',
    category: 'event',
    description: 'Wedding photography for Ricky and Nicole.',
  },
  {
    src: `${P}/event/wedding9.webp`,
    title: 'Ricky Nicole Wedding',
    category: 'event',
    description: 'Wedding photography for Ricky and Nicole.',
  },

  // ═══ LIFE ADDITIONAL ═══
  {
    src: `${P}/life/3rd-eye9.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye18.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-1.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-2.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-3.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-4.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-5.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/punjab-6.webp`,
    title: 'Punjab, 2024',
    category: 'life',
    description: 'Scenes from Punjab, India.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye1.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye3.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye5.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye7.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/paris-2025-3.webp`,
    title: 'Paris, 2025',
    category: 'life',
    description: 'Street photography from Paris.',
    year: '2025',
  },
  {
    src: `${P}/life/3rd-eye14.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye17.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/india-2019-1.webp`,
    title: 'India, 2019',
    category: 'life',
    description: 'Travel photography from India.',
    year: '2019',
  },
  {
    src: `${P}/life/india-2019-3.webp`,
    title: 'India, 2019',
    category: 'life',
    description: 'Travel photography from India.',
    year: '2019',
  },
  {
    src: `${P}/life/india-2019-4.webp`,
    title: 'India, 2019',
    category: 'life',
    description: 'Travel photography from India.',
    year: '2019',
  },
  {
    src: `${P}/life/india-2019-5.webp`,
    title: 'India, 2019',
    category: 'life',
    description: 'Travel photography from India.',
    year: '2019',
  },
  {
    src: `${P}/life/3rd-eye8.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye22.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye10.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye20.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/3rd-eye11.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
  {
    src: `${P}/life/paris-2025-4.webp`,
    title: 'Paris, 2025',
    category: 'life',
    description: 'Street photography from Paris.',
    year: '2025',
  },
  {
    src: `${P}/life/3rd-eye19.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    description: 'Travel photography from Colombia, Sri Lanka, and Bali.',
    year: '2024',
  },
]

const filters = [
  { value: 'all', label: 'All' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'portraits', label: 'Portraits' },
  { value: 'event', label: 'Event' },
  { value: 'life', label: 'Life' },
]

const categoryDescriptions: Partial<Record<string, string>> = {
  event:
    'Shooting predominantly on 35mm film with select digital work. Available for club nights, community events, live performances, dance showcases, and promotional imagery.',
}

export function PhotographyGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filterParam = searchParams.get('filter')
  const filter = filterParam && filters.some((f) => f.value === filterParam) ? filterParam : 'all'
  const [lightbox, setLightbox] = useState<number | null>(null)
  const lightboxOpenRef = useRef(false)

  // Reset lightbox when filter changes to prevent out-of-bounds access
  const handleFilterChange = useCallback(
    (value: string) => {
      if (lightboxOpenRef.current) {
        lightboxOpenRef.current = false
        window.history.back()
      }
      setLightbox(null)
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all') {
        params.delete('filter')
      } else {
        params.set('filter', value)
      }
      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  const filtered = (() => {
    if (filter === 'all') return photos.filter((p) => p.curated)
    const categoryPhotos = photos.filter((p) => p.category === filter)
    // Swap first 3 fashion images so the grid visually changes from All view
    if (filter === 'fashion' && categoryPhotos.length >= 3) {
      const [a, b, c, ...rest] = categoryPhotos
      return [b, c, a, ...rest]
    }
    return categoryPhotos
  })()

  const openLightbox = useCallback((idx: number) => {
    setLightbox(idx)
    lightboxOpenRef.current = true
    window.history.pushState({ lightbox: true }, '')
  }, [])

  const closeLightbox = useCallback(() => {
    if (lightboxOpenRef.current) {
      lightboxOpenRef.current = false
      window.history.back()
    }
    setLightbox(null)
  }, [])

  // Close lightbox on browser back
  useEffect(() => {
    const onPopState = () => {
      lightboxOpenRef.current = false
      setLightbox(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Keyboard: Escape to close, arrows to navigate
  useEffect(() => {
    if (lightbox === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft')
        setLightbox((prev) =>
          prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
        )
      if (e.key === 'ArrowRight')
        setLightbox((prev) => (prev !== null ? (prev + 1) % filtered.length : null))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, filtered.length, closeLightbox])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <>
      {/* Filter bar */}
      <div className="mb-10 flex justify-center">
        <FilterBar filters={filters} active={filter} onChange={handleFilterChange} />
      </div>

      {/* Category description */}
      <AnimatePresence mode="wait">
        {categoryDescriptions[filter] && (
          <motion.p
            key={filter}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-10 max-w-2xl text-center text-sm tracking-wide text-white/60"
          >
            {categoryDescriptions[filter]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Photo grid — uniform vertical ratio */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
              className="group cursor-pointer overflow-hidden"
              onClick={() => openLightbox(i)}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading={i < 6 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={
                    photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined
                  }
                />
                {/* Hover overlay with text */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[var(--text-base)] font-medium text-white">
                    {photo.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${filtered[lightbox].title}`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Left arrow */}
          <button
            className="absolute left-1 top-1/2 z-30 -translate-y-1/2 p-3 text-2xl text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:left-5 sm:p-4 sm:text-4xl"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox - 1 + filtered.length) % filtered.length)
            }}
          >
            &#8249;
          </button>

          {/* Right arrow */}
          <button
            className="absolute right-1 top-1/2 z-30 -translate-y-1/2 p-3 text-2xl text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:right-5 sm:p-4 sm:text-4xl"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox + 1) % filtered.length)
            }}
          >
            &#8250;
          </button>

          {/* Close */}
          <button
            className="absolute right-4 top-4 z-30 p-2 text-xl text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:top-6 sm:text-2xl"
            aria-label="Close lightbox"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
          >
            &times;
          </button>

          {/* Content */}
          {filtered[lightbox].role ||
          filtered[lightbox].description ||
          filtered[lightbox].descriptionHtml ? (
            /* Image left, text right — for photos with project info */
            <div
              className="pointer-events-none relative z-10 flex w-full flex-col items-center gap-6 overflow-y-auto px-6 sm:px-16 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:px-20"
              style={{ maxHeight: '85vh' }}
            >
              <div className="pointer-events-auto w-full shrink-0 lg:max-w-[55vw] xl:max-w-[50vw]">
                <img
                  src={filtered[lightbox].src}
                  alt={filtered[lightbox].title}
                  className="max-h-[80vh] w-full object-contain"
                />
              </div>
              <div className="pointer-events-auto flex max-w-md flex-col gap-4 py-2 text-white lg:max-w-sm xl:max-w-md">
                <h2
                  className="font-medium uppercase tracking-[0.04em]"
                  style={{ fontSize: 'clamp(1.4rem, 1.2rem + 1vw, 2rem)' }}
                >
                  {filtered[lightbox].title}
                </h2>
                {filtered[lightbox].year && (
                  <p
                    className="uppercase tracking-[0.12em] text-white/70"
                    style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
                  >
                    {filtered[lightbox].year}
                  </p>
                )}
                {filtered[lightbox].role && (
                  <p
                    className="uppercase tracking-[0.12em] text-white/70"
                    style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
                  >
                    {filtered[lightbox].role}
                  </p>
                )}
                {filtered[lightbox].descriptionHtml ? (
                  <div
                    className="space-y-3 leading-relaxed text-white/90 [&_a]:underline [&_a]:decoration-white/40 [&_a:hover]:decoration-white"
                    style={{ fontSize: 'var(--text-sm, 0.875rem)' }}
                    dangerouslySetInnerHTML={{ __html: filtered[lightbox].descriptionHtml }}
                  />
                ) : filtered[lightbox].description ? (
                  <div
                    className="space-y-3 leading-relaxed text-white/90"
                    style={{ fontSize: 'var(--text-sm, 0.875rem)' }}
                  >
                    {filtered[lightbox].description
                      .split('\n')
                      .filter((l) => l.trim())
                      .map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            /* Centred image only — no text panel */
            <div className="pointer-events-none relative z-10 flex items-center justify-center">
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
