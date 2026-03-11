'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterBar } from '@/components/ui/FilterBar'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
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
  const filtered =
    activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <FilterBar filters={filters} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <RevealOnScroll>
                <Link href={`/direction/${project.slug}`} className="group block overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-[var(--bg-surface)]">
                    {project.video ? (
                      <VideoThumbnail
                        platform={project.video.platform}
                        videoId={project.video.id}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--bg-surface)] text-[var(--text-muted)]">
                        <PlayIcon />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-[var(--text-base)] font-medium text-[var(--text-primary)]">
                      {project.title}
                    </span>
                    <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                      {project.meta}
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function VideoThumbnail({ platform, videoId }: { platform: 'vimeo' | 'youtube'; videoId: string }) {
  const thumbnailUrl =
    platform === 'youtube' ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    )
  }

  // Vimeo thumbnails require API call — show placeholder with play icon
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--bg-elevated)] transition-colors duration-300 group-hover:bg-[var(--bg-surface)]">
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
