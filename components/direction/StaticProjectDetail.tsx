'use client'

import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { StaticProject } from '@/lib/projects-data'

interface StaticProjectDetailProps {
  project: StaticProject
}

export function StaticProjectDetail({ project }: StaticProjectDetailProps) {
  const descParagraphs = project.description.split('\n\n')

  return (
    <article className="px-6 pb-16 pt-24 lg:px-12">
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

      {/* Title + meta */}
      <RevealOnScroll>
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h1
            className="mb-2 font-semibold tracking-[0.05em]"
            style={{ fontSize: 'clamp(1.953rem, 1.7rem + 1.25vw, 2.5rem)' }}
          >
            {project.title}
          </h1>
          <p className="text-[var(--text-sm)] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {project.meta}
          </p>
        </div>
      </RevealOnScroll>

      {/* Description */}
      <RevealOnScroll>
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-[var(--text-base)] leading-relaxed text-[var(--text-secondary)]">
          {descParagraphs.map((p, i) => (
            <p key={i} style={{ whiteSpace: 'pre-line' }}>
              {p}
            </p>
          ))}
        </div>
      </RevealOnScroll>
    </article>
  )
}
