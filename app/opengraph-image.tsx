import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sim Kaur — Creative Director'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
        }}
      >
        Sim Kaur
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.6)',
          marginTop: 16,
        }}
      >
        Creative Director
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.35)',
          marginTop: 40,
        }}
      >
        simkaur.art
      </div>
    </div>,
    { ...size }
  )
}
