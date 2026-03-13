'use client'

import { useState } from 'react'
import { PhotoBooth } from './PhotoBooth'

const socialLinks = [
  { label: 'Instagram', url: 'https://www.instagram.com/s1mkaur' },
  { label: 'Vimeo', url: 'https://vimeo.com/user197917349' },
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/playlist/67qupizObYnZhGDmgVvNU8?si=4a3b691e67554153',
  },
  { label: 'Letterboxd', url: '#' },
  { label: 'Substack', url: '#' },
]

export function AboutWithDiary() {
  const [boothOpen, setBoothOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col px-6 pb-16 pt-24 lg:flex-row lg:items-stretch lg:px-12">
        {/* Text side (left) */}
        <div className="flex flex-col justify-between lg:w-1/2 lg:pr-10">
          {/* Bio */}
          <div
            className="space-y-6 leading-[1.8] text-[var(--text-secondary)]"
            style={{ fontSize: 'var(--text-base)' }}
          >
            <p>
              Sim Kaur is a Punjabi creative director, filmmaker and photographer based in North
              West Sydney, Australia.
            </p>
            <p>
              Her creative journey started in high school as a spoken word poet before she launched
              a t-shirt brand, fell in love with fashion photography, and spent years shooting
              fashion and events. She went on to study at Western Sydney University, graduating with
              a Bachelor of Creative Industries majoring in Screen Media. Now working across
              direction, editing and photography, her practice is rooted in her South Asian
              heritage, drawing on the rhythms, textures and storytelling traditions of the Punjabi
              diaspora.
            </p>
            <p>
              Moving forward, she is focused on directing fashion campaigns and music videos, with
              an eye toward narrative work. She is constantly inspired by dance and the performing
              arts, and by nature.
            </p>
          </div>

          {/* Contact + Social links pinned to bottom */}
          <div className="mt-10 lg:mt-auto lg:pt-8">
            <div style={{ fontSize: 'var(--text-base)' }}>
              <p className="text-[var(--text-secondary)]">lets chat!</p>
              <a
                href="mailto:simtheaquarius@gmail.com"
                className="mt-1 inline-block text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                simtheaquarius@gmail.com
              </a>
            </div>

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
              className="mt-8 transition-transform hover:scale-105"
              style={{ width: 'clamp(100px, 20vw, 140px)' }}
            >
              <img
                src="/images/about/get-to-know-me.jpg"
                alt="Get to know me"
                className="w-full rounded"
              />
            </button>
          </div>
        </div>

        {/* Portrait (right) */}
        <div className="mt-10 lg:mt-0 lg:w-1/2">
          <picture className="block h-full">
            <source srcSet="/images/about/portrait.webp" type="image/webp" />
            <img
              src="/images/about/portrait.jpg"
              alt="Simrat Kaur"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </picture>
        </div>
      </div>

      <PhotoBooth isOpen={boothOpen} onClose={() => setBoothOpen(false)} />
    </>
  )
}
