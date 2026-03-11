'use client'

import Link from 'next/link'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { StaticProject } from '@/lib/projects-data'

interface StaticProjectDetailProps {
  project: StaticProject
}

export function StaticProjectDetail({ project }: StaticProjectDetailProps) {
  return (
    <article className="px-6 pb-16 pt-24 lg:px-12">
      {/* Back link */}
      <div className="mx-auto mb-8 max-w-5xl">
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
        <div className="mx-auto mb-8 max-w-5xl">
          <h1
            className="mb-2 font-medium uppercase tracking-[0.05em]"
            style={{ fontSize: 'clamp(1.953rem, 1.7rem + 1.25vw, 2.5rem)' }}
          >
            {project.title}
          </h1>
          <p className="text-[var(--text-sm)] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            {project.meta}
          </p>
        </div>
      </RevealOnScroll>

      {/* Video hero */}
      {project.video && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 max-w-5xl overflow-hidden">
            <VideoPlayer
              platform={project.video.platform}
              videoId={project.video.id}
              aspect={project.video.aspect || '16 / 9'}
            />
          </div>
        </RevealOnScroll>
      )}

      {/* Coming Soon hero (for projects without video) */}
      {!project.video && project.comingSoon && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 max-w-5xl overflow-hidden">
            <div
              className="relative flex items-center justify-center bg-[var(--bg-secondary)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <span
                className="uppercase tracking-[0.3em] text-[var(--text-muted)]"
                style={{ fontSize: 'var(--text-lg)' }}
              >
                Coming Soon
              </span>
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Gallery grid placeholder */}
      {project.galleryCount && project.galleryCount > 0 && (
        <RevealOnScroll>
          <div className="mx-auto mb-12 max-w-5xl">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.min(project.galleryCount, 4)}, 1fr)`,
              }}
            >
              {Array.from({ length: project.galleryCount }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center bg-[var(--bg-secondary)]"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <span
                    className="text-[var(--text-muted)] opacity-40"
                    style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
                  >
                    Still {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Two-column: Synopsis + Credits */}
      {(project.synopsis || project.credits) && (
        <RevealOnScroll>
          <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
            {/* Synopsis */}
            {project.synopsis && project.synopsis.length > 0 && (
              <div>
                <h3
                  className="mb-4 uppercase tracking-[0.15em] text-[var(--text-muted)]"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Synopsis
                </h3>
                <div
                  className="space-y-4 leading-relaxed text-[var(--text-secondary)]"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {project.synopsis.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Credits */}
            {project.credits && project.credits.length > 0 && (
              <div>
                <h3
                  className="mb-4 uppercase tracking-[0.15em] text-[var(--text-muted)]"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Credits
                </h3>
                <div className="space-y-2" style={{ fontSize: 'var(--text-sm)' }}>
                  {project.credits.map((credit, i) => (
                    <div key={i} className="flex gap-4">
                      <span
                        className="shrink-0 text-[var(--text-muted)]"
                        style={{ minWidth: '40%' }}
                      >
                        {credit.role}
                      </span>
                      <span className="text-[var(--text-secondary)]">{credit.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      )}
    </article>
  )
}
