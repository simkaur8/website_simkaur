'use client'

import { motion } from 'framer-motion'
import { LogoVideo } from '@/components/nav/LogoVideo'

interface HeroSectionProps {
  logoWebmUrl?: string
  logoMovUrl?: string
}

export function HeroSection({ logoWebmUrl, logoMovUrl }: HeroSectionProps) {
  function scrollToGallery() {
    const gallery = document.getElementById('gallerySection')
    gallery?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex h-dvh flex-col items-center justify-center overflow-hidden">
      {/* Background showreel — poster first, video lazy */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[var(--bg-primary)]" />
        {/* Video will be added when Sanity content is populated */}
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <LogoVideo
          webmSrc={logoWebmUrl}
          movSrc={logoMovUrl}
          className="h-24 w-24 cursor-pointer md:h-32 md:w-32"
        />
        <h1
          className="text-center font-semibold tracking-[0.15em] text-[var(--text-primary)]"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          SIM KAUR
        </h1>
        <p className="text-[var(--text-sm)] tracking-[0.3em] uppercase text-[var(--text-secondary)]">
          Creative Director
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToGallery}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-1 text-[var(--text-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Scroll to gallery"
      >
        <span className="text-[var(--text-xs)] tracking-[0.2em] uppercase">scroll</span>
        <span className="text-lg">&#8964;</span>
      </motion.button>
    </section>
  )
}
