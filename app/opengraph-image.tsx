import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Sim Kaur: Creative Director / Editor / Photographer'
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
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <img
        src={bgBase64}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
        }}
      />
      <img
        src={logoBase64}
        width={600}
        height={338}
        style={{ objectFit: 'contain', position: 'relative' }}
      />
    </div>,
    { ...size }
  )
}
