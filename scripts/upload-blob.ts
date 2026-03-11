/**
 * Upload large video files to Vercel Blob storage.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx npx tsx scripts/upload-blob.ts
 *
 * After upload, set the returned URL as NEXT_PUBLIC_SHOWREEL_URL in Vercel env vars.
 */
import { put } from '@vercel/blob'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
if (!BLOB_TOKEN) {
  console.error('ERROR: BLOB_READ_WRITE_TOKEN env var is required.')
  console.error('Get it from: Vercel Dashboard → Storage → Create Blob Store → Token')
  process.exit(1)
}

async function upload(filePath: string, pathname: string) {
  const absolutePath = resolve(filePath)
  console.log(`Uploading ${absolutePath} as ${pathname}...`)
  const file = readFileSync(absolutePath)
  const blob = await put(pathname, file, {
    access: 'public',
    token: BLOB_TOKEN,
  })
  console.log(`Uploaded: ${blob.url}`)
  return blob.url
}

async function main() {
  const showreelUrl = await upload('public/videos/showreel.mp4', 'videos/showreel.mp4')

  console.log('\n--- Set this in Vercel Environment Variables ---')
  console.log(`NEXT_PUBLIC_SHOWREEL_URL=${showreelUrl}`)
  console.log('\nVercel Dashboard → Settings → Environment Variables → Add')
}

main().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
