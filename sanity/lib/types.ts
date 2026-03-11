import type { PortableTextBlock } from '@portabletext/types'

export interface VideoEmbed {
  platform: 'vimeo' | 'youtube'
  id: string
}

export interface Credit {
  role: string
  name: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Project {
  _id: string
  _type: 'project'
  title: string
  slug: { current: string }
  category: 'fashion-dance' | 'music-video'
  year: number
  thumbnail: SanityImage & { alt: string }
  heroMedia?: SanityImage
  videoEmbed?: VideoEmbed
  description?: PortableTextBlock[]
  credits?: Credit[]
  gallery?: (SanityImage & { alt: string })[]
  sortOrder: number
}

export interface PhotoItem {
  image: SanityImage & { alt: string }
  caption?: string
  description?: string
  articleLink?: string
}

export interface PhotoCollection {
  _id: string
  _type: 'photoCollection'
  title: string
  slug: { current: string }
  category: 'fashion' | 'portraits' | 'life' | 'events'
  coverImage: SanityImage & { alt: string }
  photos?: PhotoItem[]
  sortOrder: number
}

export interface Exhibition {
  _id: string
  _type: 'exhibition'
  title: string
  slug: { current: string }
  subtitle?: string
  year?: number
  description?: PortableTextBlock[]
  media?: (SanityImage | VideoEmbed)[]
  externalLink?: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  heroShowreel?: VideoEmbed
  logoVideoWebm?: { asset: { _ref: string; url: string } }
  logoVideoMov?: { asset: { _ref: string; url: string } }
  bio?: PortableTextBlock[]
  email: string
  socialLinks?: SocialLink[]
  footerCta: string
}

export interface LinkInBioItem {
  label: string
  url: string
  icon?: string
}

export interface LinkInBio {
  _id: string
  _type: 'linkInBio'
  links?: LinkInBioItem[]
}
