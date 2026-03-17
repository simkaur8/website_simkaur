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
  { label: 'Letterboxd', url: 'https://letterboxd.com/s1mkaur/' },
  { label: 'Substack', url: 'https://substack.com/@s1mkaur' },
]

export function AboutWithDiary() {
  const [boothOpen, setBoothOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col px-6 pb-16 pt-24 sm:flex-row sm:items-stretch sm:px-12">
        {/* Portrait (left) */}
        <div className="sm:w-2/5">
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

        {/* Text side (right) */}
        <div className="mt-10 flex flex-col justify-between sm:mt-0 sm:w-3/5 sm:pl-10">
          {/* Bio — centred vertically */}
          <div
            className="flex flex-1 items-center leading-[1.8] text-[var(--text-secondary)]"
            style={{ fontSize: 'var(--text-base)' }}
          >
            <p>
              Sim Kaur is a creative director, filmmaker, and photographer based in North West
              Sydney. A Western Sydney University graduate (B.C.I., Screen Media), her work moves
              across direction, editing, and photography, where fashion meets narrative, street
              dance meets screen, and ideas find their way into physical form. A Punjabi creative,
              she is drawn to world building, installation &amp; the performing arts. She has
              collaborated with clients including Westfield Australia, Elle India, and Office
              Magazine.
            </p>
            <p className="mt-4 italic">
              She lives and creates on Darug Country, land that was never ceded.
            </p>
          </div>

          {/* Contact + Social links — pinned to bottom */}
          <div className="mt-6">
            <div style={{ fontSize: 'var(--text-base)' }}>
              <p className="text-[var(--text-secondary)]">Get in touch</p>
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
      </div>

      <PhotoBooth isOpen={boothOpen} onClose={() => setBoothOpen(false)} />
    </>
  )
}
