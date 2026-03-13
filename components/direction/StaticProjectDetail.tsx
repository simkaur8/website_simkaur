'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { StaticProject } from '@/lib/projects-data'

interface StaticProjectDetailProps {
  project: StaticProject
}

export function StaticProjectDetail({ project }: StaticProjectDetailProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  return (
    <article className="px-6 pb-20 pt-24 sm:px-10 lg:px-20">
      {/* Back link */}
      <div className="mx-auto mb-10 max-w-5xl">
        <Link
          href="/direction"
          className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          &larr; Back
        </Link>
      </div>

      {/* Title + meta */}
      <RevealOnScroll>
        <div className="mx-auto mb-12 max-w-5xl">
          <h1
            className="mb-2 font-medium uppercase tracking-[0.04em]"
            style={{ fontSize: 'clamp(2.4rem, 2rem + 2vw, 4rem)' }}
          >
            {project.title}
          </h1>
          <p
            className="uppercase tracking-[0.15em] text-[var(--text-muted)]"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {project.meta}
          </p>
        </div>
      </RevealOnScroll>

      {/* Video */}
      {project.video && (
        <RevealOnScroll>
          <div className="mx-auto mb-16 max-w-5xl overflow-hidden">
            <VideoPlayer
              platform={project.video.platform}
              videoId={project.video.id}
              hash={project.video.hash}
              aspect={project.video.aspect || '16 / 9'}
            />
          </div>
        </RevealOnScroll>
      )}

      {/* Gallery */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-14 max-w-5xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Gallery
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* BTS Coming Soon tile */}
              {project.btsThumbnail && (
                <div className="relative overflow-hidden">
                  <img
                    src={project.btsThumbnail}
                    alt={`${project.title} BTS`}
                    loading="lazy"
                    className="aspect-video w-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-center font-medium uppercase tracking-[0.15em] text-white"
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      BTS Video
                      <br />
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
              {project.galleryImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  className="overflow-hidden transition-opacity hover:opacity-80"
                >
                  <img
                    src={src}
                    alt={`${project.title} still ${i + 1}`}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Synopsis */}
      {project.synopsis && project.synopsis.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-14 max-w-5xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Synopsis
            </h3>
            <div
              className="max-w-3xl space-y-5 leading-relaxed text-[var(--text-secondary)]"
              style={{ fontSize: 'var(--text-base)' }}
            >
              {project.synopsis.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Credits */}
      {project.credits && project.credits.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-16 max-w-5xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Credits
            </h3>
            <div className="max-w-3xl space-y-2" style={{ fontSize: 'var(--text-sm)' }}>
              {project.credits.map((credit, i) => (
                <div key={i} className="flex gap-3">
                  <span
                    className="shrink-0 font-medium text-[var(--text-primary)]"
                    style={{ minWidth: '220px' }}
                  >
                    {credit.role}
                  </span>
                  <span className="text-[var(--text-secondary)]">{credit.name}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Postcards / Vignettes */}
      {project.postcardVideos && project.postcardVideos.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-14 max-w-5xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Vignettes
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {project.postcardVideos.map((src, i) => (
                <div key={i} className="overflow-hidden">
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="aspect-[9/16] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && project.galleryImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx(
                (lightboxIdx - 1 + project.galleryImages!.length) % project.galleryImages!.length
              )
            }}
          >
            &#8249;
          </button>
          <img
            src={project.galleryImages[lightboxIdx]}
            alt={`${project.title} still ${lightboxIdx + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx((lightboxIdx + 1) % project.galleryImages!.length)
            }}
          >
            &#8250;
          </button>
          <button
            className="absolute right-6 top-6 text-2xl text-white/70 hover:text-white"
            onClick={() => setLightboxIdx(null)}
          >
            &times;
          </button>
        </div>
      )}
    </article>
  )
}
