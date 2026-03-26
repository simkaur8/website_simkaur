'use client'

import { useState } from 'react'
import { AboutBio } from './AboutBio'
import { PhotoBooth } from './PhotoBooth'
import { ContactForm } from '@/components/forms/ContactForm'
import type { SiteSettings } from '@/sanity/lib/types'

interface AboutPageClientProps {
  settings: SiteSettings | null
}

export function AboutPageClient({ settings }: AboutPageClientProps) {
  const [boothOpen, setBoothOpen] = useState(false)

  return (
    <>
      {/* Clickable portrait triggers photo booth */}
      <div className="mb-12 cursor-pointer" onClick={() => setBoothOpen(true)}>
        <AboutBio
          bio={settings?.bio}
          email={settings?.email || 'simtheaquarius@gmail.com'}
          socialLinks={settings?.socialLinks}
        />
      </div>

      <div className="mx-auto max-w-xl">
        <h2 className="mb-6 text-center text-[var(--text-lg)] font-medium">Get in touch</h2>
        <ContactForm />
      </div>

      <PhotoBooth isOpen={boothOpen} onClose={() => setBoothOpen(false)} />
    </>
  )
}
