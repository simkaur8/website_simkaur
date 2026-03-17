'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterBar } from '@/components/ui/FilterBar'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { filterProjects } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/sanity/lib/types'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'fashion-dance', label: 'Fashion & Dance' },
  { value: 'music-video', label: 'Music Videos' },
]

interface DirectionGridProps {
  projects: Project[]
}

export function DirectionGrid({ projects }: DirectionGridProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const filtered = filterProjects(projects, activeFilter)

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <FilterBar filters={filters} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project._id || project.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <RevealOnScroll>
                <Link
                  href={`/direction/${project.slug?.current || ''}`}
                  className="group block overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden bg-[var(--bg-surface)]">
                    {project.thumbnail ? (
                      <img
                        src={urlFor(project.thumbnail).width(800).url()}
                        alt={project.thumbnail.alt || project.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-[var(--bg-surface)]" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-[var(--text-base)] font-medium text-[var(--text-primary)]">
                      {project.title}
                    </span>
                    <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                      {project.category === 'fashion-dance' ? 'Fashion & Dance' : 'Music Video'}
                      {project.year ? `, ${project.year}` : ''}
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
