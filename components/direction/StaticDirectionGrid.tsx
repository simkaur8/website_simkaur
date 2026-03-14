'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterBar } from '@/components/ui/FilterBar'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ProjectOverlay } from './ProjectOverlay'
import type { StaticProject } from '@/lib/projects-data'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'fashion-dance', label: 'Fashion & Dance' },
  { value: 'music-video', label: 'Music Videos' },
]

interface StaticDirectionGridProps {
  projects: StaticProject[]
}

export function StaticDirectionGrid({ projects }: StaticDirectionGridProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  // Reset overlay when filter changes to prevent stale index
  const handleFilterChange = useCallback((value: string) => {
    setActiveIdx(null)
    setActiveFilter(value)
  }, [])

  const filtered =
    activeFilter === 'all'
      ? projects.filter((p) => !p.hideFromAll)
      : projects.filter((p) => p.category === activeFilter)

  const activeProject = activeIdx !== null ? filtered[activeIdx] : null

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null))
  }, [filtered.length])

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev !== null ? (prev + 1) % filtered.length : null))
  }, [filtered.length])

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <FilterBar filters={filters} active={activeFilter} onChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, idx) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <RevealOnScroll>
                <button
                  onClick={() => setActiveIdx(idx)}
                  className="group block w-full overflow-hidden text-left"
                >
                  <div
                    className="relative aspect-[5/4] overflow-hidden bg-[var(--bg-surface)]"
                    style={{ border: '1.5px solid transparent', transition: 'border-color 0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#E8C547')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : project.video ? (
                      <VideoThumbnail
                        platform={project.video.platform}
                        videoId={project.video.id}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--bg-surface)] text-[var(--text-muted)]">
                        <PlayIcon />
                      </div>
                    )}
                    {/* Hover overlay with text */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-[var(--text-base)] font-medium text-white">
                        {project.title}
                      </span>
                      <span className="text-[var(--text-xs)] text-white/70">{project.meta}</span>
                    </div>
                  </div>
                </button>
              </RevealOnScroll>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ProjectOverlay
        project={activeProject}
        onClose={() => setActiveIdx(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}

function VideoThumbnail({ platform, videoId }: { platform: 'vimeo' | 'youtube'; videoId: string }) {
  const thumbnailUrl =
    platform === 'youtube' ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined

  if (thumbnailUrl) {
    return <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--bg-elevated)]">
      <PlayIcon />
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-40">
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1" />
      <path d="M19 16L34 24L19 32V16Z" fill="currentColor" />
    </svg>
  )
}
