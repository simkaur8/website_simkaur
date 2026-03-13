'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoBoothProps {
  isOpen: boolean
  onClose: () => void
}

interface DiaryClip {
  id: string
  label: string
  type: 'youtube' | 'local'
  src: string
  thumb: string
}

const diaryClips: DiaryClip[] = [
  {
    id: 'paradise',
    label: 'Paradise Pool Birthday Hike 2025',
    type: 'youtube',
    src: 'PKQp0146e0g',
    thumb: 'https://img.youtube.com/vi/PKQp0146e0g/hqdefault.jpg',
  },
  {
    id: 'girlhood',
    label: 'Girlhood — HSC Major Work 2018',
    type: 'youtube',
    src: 'p2EMqBIaSpY',
    thumb: 'https://img.youtube.com/vi/p2EMqBIaSpY/hqdefault.jpg',
  },
  {
    id: 'reem',
    label: 'Reem & Roshan',
    type: 'local',
    src: '/videos/diary-reem-roshan.mp4',
    thumb: '/images/about/diary/nani-thumb.jpg',
  },
  {
    id: 'vhs',
    label: 'VHS Work',
    type: 'local',
    src: '/videos/diary-vhs-work.mp4',
    thumb: '/images/about/portrait.jpg',
  },
]

export function PhotoBooth({ isOpen, onClose }: PhotoBoothProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const clip = diaryClips[activeIndex]

  const selectClip = useCallback((i: number) => {
    setActiveIndex(i)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-[#1a1a1a] shadow-2xl"
            style={{ maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
                  aria-label="Close"
                />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-center text-xs text-white/40">
                photobooth://simkaur.local
              </div>
            </div>

            {/* Viewer */}
            <div className="relative bg-black" style={{ aspectRatio: '16 / 9' }}>
              {clip.type === 'youtube' ? (
                <iframe
                  key={clip.src}
                  src={`https://www.youtube.com/embed/${clip.src}?autoplay=1&rel=0`}
                  title="Video diary"
                  className="absolute inset-0 h-full w-full border-none"
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={clip.src}
                  src={clip.src}
                  className="absolute inset-0 h-full w-full object-contain"
                  controls
                  autoPlay
                />
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">
              {diaryClips.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => selectClip(i)}
                  className={`group relative h-16 w-24 shrink-0 overflow-hidden rounded transition-all ${
                    i === activeIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={item.thumb} alt={item.label} className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-[0.55rem] leading-tight text-white/80">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2 border-t border-white/10 px-4 py-2">
              <span className="rounded-md bg-white/10 px-3 py-1 text-xs text-white/70">
                All Clips
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
