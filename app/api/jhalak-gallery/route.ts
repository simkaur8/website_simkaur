/**
 * GET  /api/jhalak-gallery?secret=<JHALAK_ADMIN_SECRET>
 *   Returns JSON list of all captured photos in Vercel Blob.
 *   { blobs: [{ url, pathname, uploadedAt, size }] }
 *
 * DELETE /api/jhalak-gallery?secret=<JHALAK_ADMIN_SECRET>
 *   Body: { url: string }
 *   Deletes one blob. Returns { ok: true }
 *
 * Requires JHALAK_ADMIN_SECRET in Vercel environment variables.
 */

import { list, del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

function isAuthorized(req: NextRequest): boolean {
  const secret = req.nextUrl.searchParams.get('secret')
  const expected = process.env.JHALAK_ADMIN_SECRET
  if (!expected || !secret) return false
  return secret === expected
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const { blobs } = await list({ prefix: 'jhalak/', limit: 1000 })
    const photos = blobs
      .filter((b) => b.pathname.endsWith('.jpg'))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    return NextResponse.json({ blobs: photos })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const url = (body?.url ?? '').toString().trim()
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })
    await del(url)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
