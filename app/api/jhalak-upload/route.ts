/**
 * POST /api/jhalak-upload
 *
 * Receives a captured photo (base64 data URL), stores it in Vercel Blob
 * as a public JPEG, and returns:
 *   { url: string, qr: string }
 *
 *   url — public Vercel Blob URL for the image (phone opens this to view/save)
 *   qr  — QR code as a data URL (PNG), rendered server-side via the qrcode package
 *
 * The QR code encodes the blob URL so a phone camera can open the image
 * directly without the visitor typing anything.
 *
 * Requires:
 *   BLOB_READ_WRITE_TOKEN — set in Vercel Settings → Environment Variables
 *
 * Graceful degradation:
 *   503 if BLOB_READ_WRITE_TOKEN is not set (client falls back to email)
 *   500 if Vercel Blob rejects the upload (client falls back to email)
 */

import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import QRCode from 'qrcode'

// Same limit as /api/send-photo — ~4 MB decoded
const MAX_IMAGE_BYTES = 5_500_000

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let image: string
  try {
    const body = await req.json()
    image = (body.image ?? '').toString().trim()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  // ── 2. Validate image ─────────────────────────────────────────────────────
  if (!image || !image.startsWith('data:image/')) {
    return NextResponse.json({ error: 'invalid image data' }, { status: 400 })
  }
  if (image.length > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'image too large' }, { status: 400 })
  }
  const base64Data = image.split(',')[1]
  if (!base64Data) {
    return NextResponse.json({ error: 'malformed image data' }, { status: 400 })
  }

  // ── 3. Check Blob token ───────────────────────────────────────────────────
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[JHALAK] BLOB_READ_WRITE_TOKEN not set — QR flow unavailable')
    return NextResponse.json({ error: 'upload service not configured' }, { status: 503 })
  }

  // ── 4. Upload to Vercel Blob ──────────────────────────────────────────────
  const id = randomBytes(10).toString('hex')
  const pathname = `jhalak/${id}.jpg`
  const buffer = Buffer.from(base64Data, 'base64')

  let blobUrl: string
  try {
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    })
    blobUrl = blob.url
    console.log('[JHALAK API] Blob uploaded. id:', id, 'url:', blobUrl)
  } catch (err) {
    console.error('[JHALAK] Vercel Blob upload failed:', err)
    return NextResponse.json({ error: 'upload failed' }, { status: 500 })
  }

  // ── 5. Generate QR code server-side ──────────────────────────────────────
  // QR encodes a branded simkaur.art landing page rather than the raw blob URL
  // so phones see "simkaur.art" in their camera app instead of vercel-storage.com.
  const siteBase = (process.env.JHALAK_SITE_URL || 'https://simkaur.art').replace(/\/$/, '')
  const viewUrl = `${siteBase}/jhalak-photo.html?url=${encodeURIComponent(blobUrl)}`

  let qrDataURL: string
  try {
    qrDataURL = await QRCode.toDataURL(viewUrl, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1A1614', // matches JHALAK dark background
        light: '#F2EDE6', // matches --oat / cream
      },
    })
  } catch (err) {
    console.error('[JHALAK] QR generation failed:', err)
    return NextResponse.json({ url: blobUrl, qr: null })
  }

  return NextResponse.json({ url: blobUrl, viewUrl, qr: qrDataURL })
}
