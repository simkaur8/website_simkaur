'use client'

import { useState } from 'react'
import { PhotoBooth } from './PhotoBooth'

const socialLinks = [
  { label: 'Instagram', url: 'https://www.instagram.com/s1mkaur' },
  { label: 'Vimeo', url: 'https://vimeo.com/user197917349' },
  { label: 'Substack', url: '#' },
  { label: 'Letterboxd', url: '#' },
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/playlist/67qupizObYnZhGDmgVvNU8?si=4a3b691e67554153',
  },
]

export function AboutWithDiary() {
  const [boothOpen, setBoothOpen] = useState(false)

  return (
    <>
      <div
        className="flex flex-col items-start px-6 pb-16 pt-24 lg:px-12"
        style={{ maxWidth: 700 }}
      >
        {/* Portrait */}
        <div className="w-full" style={{ maxWidth: 700 }}>
          <picture>
            <source srcSet="/images/about/portrait.webp" type="image/webp" />
            <img
              src="/images/about/portrait.jpg"
              alt="Simrat Kaur"
              className="w-full object-cover"
              loading="eager"
            />
          </picture>
        </div>

        {/* Bio */}
        <div
          className="mt-10 space-y-6 leading-[1.8] text-[var(--text-secondary)]"
          style={{ fontSize: 'var(--text-base)', maxWidth: 700 }}
        >
          <p>
            Sim Kaur is a Punjabi creative director, filmmaker and photographer based in North West
            Sydney, Australia.
          </p>
          <p>
            She started out as a spoken word poet before getting into fashion and event photography.
            After finishing a Bachelor of Creative Industries in film in 2023, she moved into
            directing and moving image work. Her practice is rooted in her South Asian heritage,
            drawing on the rhythms, textures and storytelling traditions of the Punjabi diaspora.
          </p>
          <p>
            She is obsessed with watching dance battles online, somatic practises, writing in her
            journal and spending time in nature.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-10" style={{ fontSize: 'var(--text-base)' }}>
          <p className="text-[var(--text-secondary)]">lets chat!</p>
          <a
            href="mailto:simtheaquarius@gmail.com"
            className="mt-1 inline-block text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            simtheaquarius@gmail.com
          </a>
        </div>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap gap-4" style={{ fontSize: 'var(--text-sm)' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Easter egg — opens video diary */}
        <button
          onClick={() => setBoothOpen(true)}
          className="mt-12 transition-transform hover:scale-105"
          style={{ width: 'clamp(100px, 30vw, 160px)' }}
        >
          <img
            src="/images/about/get-to-know-me.jpg"
            alt="Get to know me"
            className="w-full rounded"
          />
        </button>
      </div>

      <PhotoBooth isOpen={boothOpen} onClose={() => setBoothOpen(false)} />
    </>
  )
}
