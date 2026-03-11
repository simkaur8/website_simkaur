'use client'

import { motion } from 'framer-motion'
import { LogoVideo } from '@/components/nav/LogoVideo'

interface HeroSectionProps {
  logoWebmUrl?: string
  logoMp4Url?: string
  showreelUrl?: string
}

export function HeroSection({ logoWebmUrl, logoMp4Url, showreelUrl }: HeroSectionProps) {
  function scrollToGallery() {
    const gallery = document.getElementById('gallerySection')
    gallery?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex h-dvh flex-col items-center justify-center overflow-hidden">
      {/* Background showreel */}
      <div className="absolute inset-0 z-0">
        {showreelUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(0.9) brightness(0.85)' }}
          >
            <source src={showreelUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-[var(--bg-primary)]" />
        )}
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <LogoVideo
          webmSrc={logoWebmUrl}
          mp4Src={logoMp4Url}
          className="cursor-pointer"
          style={{ width: 'clamp(240px, 38vw, 480px)' }}
        />
        <h1
          className="text-center font-medium uppercase tracking-[0.18em] text-[var(--text-primary)]"
          style={{ fontSize: 'var(--text-base)' }}
        >
          SIM KAUR
        </h1>
        <p
          className="uppercase tracking-[0.15em]"
          style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}
        >
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
        <span className="text-[var(--text-xs)] tracking-[0.2em] lowercase">scroll</span>
        <span className="text-lg">&#8964;</span>
      </motion.button>
    </section>
  )
}
