import { groq } from 'next-sanity'

// Projects (Direction)
export const allProjectsQuery = groq`
  *[_type == "project"] | order(sortOrder asc) {
    _id,
    title,
    slug,
    category,
    year,
    thumbnail,
    videoEmbed,
    sortOrder
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    year,
    thumbnail,
    heroMedia,
    videoEmbed,
    description,
    credits,
    gallery,
    sortOrder
  }
`

// Photo Collections
export const allPhotoCollectionsQuery = groq`
  *[_type == "photoCollection"] | order(sortOrder asc) {
    _id,
    title,
    slug,
    category,
    coverImage,
    sortOrder
  }
`

export const photoCollectionByCategoryQuery = groq`
  *[_type == "photoCollection" && category == $category] | order(sortOrder asc) {
    _id,
    title,
    slug,
    category,
    coverImage,
    photos,
    sortOrder
  }
`

// Exhibitions
export const allExhibitionsQuery = groq`
  *[_type == "exhibition"] | order(year desc) {
    _id,
    title,
    slug,
    subtitle,
    year,
    description,
    media,
    externalLink
  }
`

export const exhibitionBySlugQuery = groq`
  *[_type == "exhibition" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    subtitle,
    year,
    description,
    media,
    externalLink
  }
`

// Site Settings (singleton)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    heroShowreel,
    "logoVideoWebmUrl": logoVideoWebm.asset->url,
    "logoVideoMovUrl": logoVideoMov.asset->url,
    bio,
    email,
    socialLinks,
    footerCta
  }
`

// Link in Bio (singleton)
export const linkInBioQuery = groq`
  *[_type == "linkInBio"][0] {
    _id,
    links
  }
`
