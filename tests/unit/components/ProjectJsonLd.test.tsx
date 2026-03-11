import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectJsonLd } from '@/components/seo/ProjectJsonLd'

describe('ProjectJsonLd', () => {
  it('renders script tag with structured data', () => {
    const project = {
      _id: '1',
      _type: 'project' as const,
      title: 'Crossfire',
      slug: { current: 'crossfire' },
      category: 'fashion-dance' as const,
      year: 2025,
      thumbnail: {
        _type: 'image' as const,
        asset: { _ref: 'img-1', _type: 'reference' as const },
        alt: 'Crossfire',
      },
      sortOrder: 0,
    }

    const { container } = render(<ProjectJsonLd project={project} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent || '')
    expect(data['@type']).toBe('CreativeWork')
    expect(data.name).toBe('Crossfire')
    expect(data.dateCreated).toBe('2025')
  })

  it('includes creator information', () => {
    const project = {
      _id: '1',
      _type: 'project' as const,
      title: 'Test',
      slug: { current: 'test' },
      category: 'music-video' as const,
      year: 2024,
      thumbnail: {
        _type: 'image' as const,
        asset: { _ref: 'img-1', _type: 'reference' as const },
        alt: 'Test',
      },
      sortOrder: 0,
    }

    const { container } = render(<ProjectJsonLd project={project} />)
    const data = JSON.parse(container.querySelector('script')!.textContent || '')
    expect(data.creator.name).toBe('Sim Kaur')
  })

  it('sets genre for fashion-dance category', () => {
    const project = {
      _id: '1',
      _type: 'project' as const,
      title: 'Dance Film',
      slug: { current: 'dance-film' },
      category: 'fashion-dance' as const,
      year: 2025,
      thumbnail: {
        _type: 'image' as const,
        asset: { _ref: 'img-1', _type: 'reference' as const },
        alt: 'Dance Film',
      },
      sortOrder: 0,
    }

    const { container } = render(<ProjectJsonLd project={project} />)
    const data = JSON.parse(container.querySelector('script')!.textContent || '')
    expect(data.genre).toBe('Fashion & Dance Film')
  })

  it('sets genre for music-video category', () => {
    const project = {
      _id: '1',
      _type: 'project' as const,
      title: 'Music Vid',
      slug: { current: 'music-vid' },
      category: 'music-video' as const,
      year: 2024,
      thumbnail: {
        _type: 'image' as const,
        asset: { _ref: 'img-1', _type: 'reference' as const },
        alt: 'Music Vid',
      },
      sortOrder: 0,
    }

    const { container } = render(<ProjectJsonLd project={project} />)
    const data = JSON.parse(container.querySelector('script')!.textContent || '')
    expect(data.genre).toBe('Music Video')
  })

  it('builds correct URL from slug', () => {
    const project = {
      _id: '1',
      _type: 'project' as const,
      title: 'Test',
      slug: { current: 'my-project' },
      category: 'fashion-dance' as const,
      year: 2025,
      thumbnail: {
        _type: 'image' as const,
        asset: { _ref: 'img-1', _type: 'reference' as const },
        alt: 'Test',
      },
      sortOrder: 0,
    }

    const { container } = render(<ProjectJsonLd project={project} />)
    const data = JSON.parse(container.querySelector('script')!.textContent || '')
    expect(data.url).toBe('https://simkaur.art/direction/my-project')
  })
})
