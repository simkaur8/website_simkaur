/**
 * POST /api/send-photo
 *
 * Accepts a captured photo (base64 data URL) and a visitor email address,
 * then sends the photo as an email attachment via Resend.
 *
 * Body (JSON):
 *   { to: string, image: string }
 *
 *   to    — visitor's email address
 *   image — full data URL, e.g. "data:image/jpeg;base64,/9j/4AAQ..."
 *
 * Responses:
 *   200 { ok: true }
 *   400 { error: string }   — bad input
 *   500 { error: string }   — send failed
 */

import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Resend client is initialised lazily (inside the handler) so the build
// succeeds even when RESEND_API_KEY is not present in the build environment.
// On Vercel, set this in Settings → Environment Variables.
const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Maximum base64 image size we'll accept (~4MB decoded ≈ ~5.3MB base64)
// A 640×480 JPEG at 88% quality is typically 100–300KB, well within this.
// A 4-photo strip composite is typically 300–700KB. Both are safe.
const MAX_IMAGE_BYTES = 5_500_000

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let to: string
  let image: string
  let fortune: string
  let note: string

  try {
    const body = await req.json()
    to = (body.to ?? '').toString().trim()
    image = (body.image ?? '').toString().trim()
    fortune = (body.fortune ?? '').toString().trim().slice(0, 300)
    note = (body.note ?? '').toString().trim().slice(0, 300)
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  console.log('[JHALAK API] send-photo to:', to.slice(0, 3) + '***')

  // ── 2. Validate email ──────────────────────────────────────────────────────
  // Minimal check — full RFC validation is overkill here and adds no
  // meaningful protection. Resend will reject truly bad addresses anyway.
  if (!to || !to.includes('@') || !to.includes('.')) {
    return NextResponse.json({ error: 'invalid email address' }, { status: 400 })
  }

  // ── 3. Validate image ─────────────────────────────────────────────────────
  if (!image || !image.startsWith('data:image/')) {
    return NextResponse.json({ error: 'invalid image data' }, { status: 400 })
  }

  if (image.length > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'image too large' }, { status: 400 })
  }

  // Strip the data URL prefix: "data:image/jpeg;base64,<data>"
  const base64Data = image.split(',')[1]
  if (!base64Data) {
    return NextResponse.json({ error: 'malformed image data' }, { status: 400 })
  }

  // ── 4. Send via Resend ────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[JHALAK] RESEND_API_KEY not set')
    return NextResponse.json({ error: 'email service not configured' }, { status: 503 })
  }
  const resend = new Resend(apiKey)
  console.log('[JHALAK API] sender:', fromAddress, '| key set: true')

  try {
    await resend.emails.send({
      // Sender: set RESEND_FROM_EMAIL env var for production (e.g. 'JHALAK <jhalak@simkaur.art>')
      // Falls back to sandbox sender if env var not set.
      from: fromAddress,
      to: [to],
      subject: 'your jhalak moment ✦',

      // Plain-text fallback for email clients that don't render HTML
      text: [
        'your jhalak moment',
        '',
        fortune || 'a glimpse. captured just for you.',
        '',
        'the photo is attached.',
        '',
        note || 'simkaur.art',
      ].join('\n'),

      // HTML email body — inline styles only (email clients strip <style> tags)
      // PLUG IN LOGO URL: replace the empty src below with your hosted logo URL.
      // e.g. src="https://simkaur.art/jhalak-assets/jhalak-logo.png"
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"></head>
        <body style="margin:0; padding:0; background-color:#1A1614;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background-color:#1A1614; padding:32px 16px;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0"
                       style="max-width:520px; width:100%;
                              background-color:#1A1614;
                              font-family:'Courier New', Courier, monospace;
                              color:#EDE8E2;">

                  <!-- LOGO / STAMP ROW -->
                  <!-- PLUG IN LOGO URL HERE: replace src="" below -->
                  <tr>
                    <td style="padding:20px 24px 12px 24px;">
                      <img src=""
                           alt="✦ JHALAK"
                           height="36"
                           style="display:block; max-height:36px;"
                           onerror="this.style.display='none'" />
                      <p style="margin:4px 0 0 0;
                                font-size:18px;
                                letter-spacing:0.20em;
                                color:rgba(237,232,226,0.55);">
                        ✦ JHALAK
                      </p>
                    </td>
                  </tr>

                  <!-- ATTACHMENT NOTICE — dark card feel -->
                  <tr>
                    <td style="padding:0 24px 16px 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0"
                             style="background-color:#2C2420;
                                    border-top:1px solid #3A3430;
                                    border-left:1px solid #3A3430;
                                    border-bottom:1px solid #111;
                                    border-right:1px solid #111;">
                        <tr>
                          <td style="padding:14px 16px;
                                     font-size:12px;
                                     color:#9A9088;
                                     letter-spacing:0.04em;">
                            your photo is attached as <strong style="color:#C8C0B8;">jhalak.jpg</strong>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- FORTUNE -->
                  ${
                    fortune
                      ? `
                  <tr>
                    <td style="padding:0 24px 20px 24px;">
                      <p style="margin:0;
                                font-size:15px;
                                font-style:italic;
                                color:#EDE8E2;
                                line-height:1.6;
                                opacity:0.85;">
                        ${fortune}
                      </p>
                    </td>
                  </tr>`
                      : ''
                  }

                  <!-- FOOTER NOTE -->
                  <tr>
                    <td style="padding:0 24px 24px 24px;
                               border-top:1px solid #2C2420;">
                      <p style="margin:12px 0 0 0;
                                font-size:11px;
                                color:#5A5048;
                                letter-spacing:0.10em;">
                        ${note || 'simkaur.art'}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,

      // The photo as a JPEG attachment
      attachments: [
        {
          filename: 'jhalak.jpg',
          content: base64Data,
          contentType: 'image/jpeg',
        },
      ],
    })

    console.log('[JHALAK API] Email sent successfully')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[JHALAK] Resend error:', err)
    return NextResponse.json({ error: 'send failed' }, { status: 500 })
  }
}
