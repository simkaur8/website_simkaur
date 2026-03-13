'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { StaticProject } from '@/lib/projects-data'

interface StaticProjectDetailProps {
  project: StaticProject
}

export function StaticProjectDetail({ project }: StaticProjectDetailProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const hasVignettes = project.postcardVideos && project.postcardVideos.length > 0
  const hasGallery = project.galleryImages && project.galleryImages.length > 0

  // For vignette carousel: videos + optional reel as last slide
  const vignetteCount = hasVignettes ? project.postcardVideos!.length + (project.video ? 1 : 0) : 0

  const prevCarousel = useCallback(() => {
    setCarouselIdx((i) => (i - 1 + vignetteCount) % vignetteCount)
  }, [vignetteCount])

  const nextCarousel = useCallback(() => {
    setCarouselIdx((i) => (i + 1) % vignetteCount)
  }, [vignetteCount])

  // Gallery horizontal scroll
  const allGalleryItems = [
    ...(project.btsThumbnail ? [{ type: 'bts' as const, src: project.btsThumbnail }] : []),
    ...(project.galleryImages || []).map((src) => ({ type: 'image' as const, src })),
  ]
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollGallery = useCallback((dir: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' })
  }, [])

  return (
    <article className="px-4 pb-20 pt-24 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Back link */}
      <div className="mx-auto mb-10 max-w-7xl">
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
        <div className="mx-auto mb-12 max-w-7xl">
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

      {/* Vignette carousel (Elle India style) */}
      {hasVignettes ? (
        <RevealOnScroll>
          <div className="mx-auto mb-16 max-w-7xl">
            <div className="relative">
              {/* Current slide */}
              <div className="aspect-[5/4] w-full overflow-hidden bg-black">
                {carouselIdx < project.postcardVideos!.length ? (
                  <video
                    key={carouselIdx}
                    src={project.postcardVideos![carouselIdx]}
                    autoPlay
                    loop
                    playsInline
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  project.video && (
                    <div className="h-full w-full">
                      <VideoPlayer
                        platform={project.video.platform}
                        videoId={project.video.id}
                        hash={project.video.hash}
                        aspect="5 / 4"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Arrows */}
              <button
                onClick={prevCarousel}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-3xl text-white/80 transition-colors hover:bg-black/60 hover:text-white"
                aria-label="Previous"
              >
                &#8249;
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-3xl text-white/80 transition-colors hover:bg-black/60 hover:text-white"
                aria-label="Next"
              >
                &#8250;
              </button>

              {/* Dots */}
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: vignetteCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === carouselIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      ) : (
        /* Standard video (Crossfire, Velvet Skin, etc.) */
        project.video && (
          <RevealOnScroll>
            <div className="mx-auto mb-16 max-w-7xl overflow-hidden">
              <VideoPlayer
                platform={project.video.platform}
                videoId={project.video.id}
                hash={project.video.hash}
                aspect={project.video.aspect || '16 / 9'}
              />
            </div>
          </RevealOnScroll>
        )
      )}

      {/* Gallery — horizontal scrolling row, same width as video */}
      {allGalleryItems.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-14 max-w-7xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Gallery
            </h3>
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {allGalleryItems.map((item, i) => (
                  <div
                    key={i}
                    className="shrink-0"
                    style={{ width: `${100 / Math.min(allGalleryItems.length, 4)}%` }}
                  >
                    {item.type === 'bts' ? (
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={item.src}
                          alt={`${project.title} BTS`}
                          loading="lazy"
                          className="h-full w-full object-cover opacity-50"
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
                    ) : (
                      <button
                        onClick={() => setLightboxIdx(project.btsThumbnail ? i - 1 : i)}
                        className="w-full overflow-hidden transition-opacity hover:opacity-80"
                      >
                        <img
                          src={item.src}
                          alt={`${project.title} still ${i + 1}`}
                          loading="lazy"
                          className="aspect-[3/4] w-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Scroll arrows */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollGallery(-1)}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-2xl text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  aria-label="Scroll left"
                >
                  &#8249;
                </button>
              )}
              {canScrollRight && (
                <button
                  onClick={() => scrollGallery(1)}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-1 text-2xl text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  aria-label="Scroll right"
                >
                  &#8250;
                </button>
              )}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Synopsis */}
      {project.synopsis && project.synopsis.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-14 max-w-7xl">
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

      {/* Credits — 2 columns */}
      {project.credits && project.credits.length > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-16 max-w-7xl">
            <h3
              className="mb-5 uppercase tracking-[0.15em] text-[var(--text-muted)]"
              style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
            >
              Credits
            </h3>
            <div
              className="grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {project.credits.map((credit, i) => (
                <div key={i} className="flex gap-3">
                  <span
                    className="shrink-0 font-medium text-[var(--text-primary)]"
                    style={{ minWidth: '200px' }}
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
