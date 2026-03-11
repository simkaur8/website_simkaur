'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { Lightbox } from '@/components/ui/Lightbox'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Project } from '@/sanity/lib/types'

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const galleryImages =
    project.gallery?.map((img) => ({
      src: '/placeholder.svg',
      alt: img.alt || '',
    })) || []

  return (
    <article className="px-6 pb-16 pt-24 lg:px-12">
      {/* Video hero */}
      {project.videoEmbed && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 aspect-video max-w-5xl overflow-hidden">
            <VideoPlayer platform={project.videoEmbed.platform} videoId={project.videoEmbed.id} />
          </div>
        </RevealOnScroll>
      )}

      {/* Title + meta */}
      <RevealOnScroll>
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h1
            className="mb-2 font-semibold tracking-[0.05em]"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            {project.title}
          </h1>
          <p className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {project.category === 'fashion-dance' ? 'Fashion & Dance' : 'Music Video'}
            {project.year ? ` — ${project.year}` : ''}
          </p>
        </div>
      </RevealOnScroll>

      {/* Description */}
      {project.description && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 max-w-2xl text-[var(--text-base)] leading-relaxed text-[var(--text-secondary)]">
            <PortableText value={project.description} />
          </div>
        </RevealOnScroll>
      )}

      {/* Credits */}
      {project.credits && project.credits.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 max-w-2xl">
            <h2 className="mb-4 text-[var(--text-sm)] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Credits
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[var(--text-sm)]">
              {project.credits.map((credit, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span className="text-[var(--text-muted)]">{credit.role}</span>
                  <span className="text-[var(--text-secondary)]">{credit.name}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLightboxIndex(i)
                    setLightboxOpen(true)
                  }}
                  className="aspect-[3/4] overflow-hidden bg-[var(--bg-surface)]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      <Lightbox
        images={galleryImages}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </article>
  )
}
