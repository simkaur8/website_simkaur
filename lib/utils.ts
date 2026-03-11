import { clsx, type ClassValue } from 'clsx'

/** Merge class names with clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Filter projects by category. "all" returns everything. */
export function filterProjects<T extends { category: string }>(projects: T[], filter: string): T[] {
  if (filter === 'all') return projects
  return projects.filter((p) => p.category === filter)
}

/** Get embeddable video URL from platform + ID */
export function getVideoEmbedUrl(platform: string, id: string): string {
  switch (platform) {
    case 'vimeo':
      return `https://player.vimeo.com/video/${id}`
    case 'youtube':
      return `https://www.youtube.com/watch?v=${id}`
    default:
      throw new Error(`Unsupported video platform: ${platform}`)
  }
}

/** Format credits array into readable string */
export function formatCredits(credits: { role: string; name: string }[]): string {
  return credits.map((c) => `${c.role}: ${c.name}`).join('\n')
}

/** Build page metadata with site name suffix */
export function buildPageTitle(pageTitle: string): string {
  return `${pageTitle} | Sim Kaur`
}

/** Ensure OG image URL is absolute */
export function ensureAbsoluteUrl(url: string, baseUrl = 'https://simkaur.art'): string {
  if (url.startsWith('http')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
