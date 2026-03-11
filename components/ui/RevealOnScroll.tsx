'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function RevealOnScroll({ children, className, delay = 0 }: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
