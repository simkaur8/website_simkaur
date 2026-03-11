'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoBoothProps {
  isOpen: boolean
  onClose: () => void
}

const boothItems = [
  { id: 1, label: 'Reel 1', type: 'placeholder' },
  { id: 2, label: 'Reel 2', type: 'placeholder' },
  { id: 3, label: 'Reel 3', type: 'placeholder' },
]

export function PhotoBooth({ isOpen, onClose }: PhotoBoothProps) {
  const [activeIndex, setActiveIndex] = useState(0)

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
            className="w-full max-w-3xl overflow-hidden rounded-lg bg-[var(--bg-elevated)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="h-3 w-3 rounded-full bg-red-500"
                  aria-label="Close"
                />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="ml-4 flex-1 rounded bg-[var(--bg-surface)] px-3 py-1 text-center text-[var(--text-xs)] text-[var(--text-muted)]">
                simkaur.art/about
              </div>
            </div>

            {/* Viewer */}
            <div className="aspect-video bg-[var(--bg-primary)]">
              <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                Photo Booth Content
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 border-t border-[var(--border)] p-3">
              {boothItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(i)}
                  className={`h-16 w-24 overflow-hidden bg-[var(--bg-surface)] transition-opacity ${
                    i === activeIndex
                      ? 'opacity-100 ring-2 ring-[var(--accent)]'
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex h-full items-center justify-center text-[var(--text-xs)] text-[var(--text-muted)]">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
