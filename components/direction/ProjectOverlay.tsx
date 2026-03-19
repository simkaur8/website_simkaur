'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import type { StaticProject } from '@/lib/projects-data'

interface ProjectOverlayProps {
  project: StaticProject | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function ProjectOverlay({ project, onClose, onPrev, onNext }: ProjectOverlayProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!project) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [project, onClose, onPrev, onNext]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Left arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-1 top-1/2 z-30 -translate-y-1/2 p-3 text-4xl text-white/70 transition-colors hover:text-white sm:left-4 sm:p-4 sm:text-5xl"
            aria-label="Previous project"
          >
            &#8249;
          </button>

          {/* Right arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-1 top-1/2 z-30 -translate-y-1/2 p-3 text-4xl text-white/70 transition-colors hover:text-white sm:right-4 sm:p-4 sm:text-5xl"
            aria-label="Next project"
          >
            &#8250;
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white/90 transition-colors hover:bg-black/80 hover:text-white sm:right-5 sm:top-5 sm:h-10 sm:w-10 sm:text-xl"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Content — centered on page, responsive */}
          <motion.div
            key={project.slug}
            className="relative z-10 flex w-full flex-col items-center gap-6 overflow-y-auto px-10 sm:px-16 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:px-20"
            style={{ maxHeight: '85vh' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video */}
            {project.video && (
              <div
                className={`w-full shrink-0 ${
                  project.video.aspect === '9 / 16'
                    ? 'max-w-[280px] sm:max-w-[320px] lg:max-w-[35vh]'
                    : 'max-w-full lg:max-w-[55vw] xl:max-w-[50vw]'
                }`}
              >
                <VideoPlayer
                  platform={project.video.platform}
                  videoId={project.video.id}
                  hash={project.video.hash}
                  aspect={project.video.aspect || '16 / 9'}
                />
              </div>
            )}

            {/* Text */}
            <div className="flex max-w-md flex-col gap-4 py-2 text-white lg:max-w-sm xl:max-w-md">
              <h2
                className="font-medium uppercase tracking-[0.04em]"
                style={{ fontSize: 'clamp(1.4rem, 1.2rem + 1vw, 2rem)' }}
              >
                {project.title}
              </h2>
              <p
                className="uppercase tracking-[0.12em] text-white/70"
                style={{ fontSize: 'var(--text-xs, 0.75rem)' }}
              >
                {project.meta}
              </p>
              <div
                className="space-y-3 leading-relaxed text-white/90"
                style={{ fontSize: 'var(--text-sm, 0.875rem)' }}
              >
                {project.description
                  .split('\n')
                  .filter((line) => line.trim())
                  .slice(0, 3)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
              {!project.comingSoon && (
                <Link
                  href={`/direction/${project.slug}`}
                  className="mt-3 inline-block text-white/80 transition-colors hover:text-white"
                  style={{ fontSize: 'var(--text-sm, 0.875rem)' }}
                  onClick={onClose}
                >
                  View Project &rarr;
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
