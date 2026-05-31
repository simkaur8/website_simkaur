import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Exhibitions — Sim Kaur'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const [logoData, bgData] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/logo.png')),
    readFile(join(process.cwd(), 'public/images/og-background.jpg')),
  ])
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`
  const bgBase64 = `data:image/jpeg;base64,${bgData.toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <img
        src={bgBase64}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      />
      <img
        src={logoBase64}
        width={440}
        height={248}
        style={{ objectFit: 'contain', position: 'relative' }}
      />
      <p
        style={{
          position: 'relative',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 18,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: 24,
          fontFamily: 'system-ui',
        }}
      >
        Exhibitions
      </p>
    </div>,
    { ...size }
  )
}
