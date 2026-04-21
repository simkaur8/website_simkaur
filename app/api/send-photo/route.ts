/**
 * POST /api/send-photo
 *
 * Accepts a captured photo (base64 data URL) and a visitor email address,
 * then sends the photo as an email attachment via Resend.
 *
 * Body (JSON):
 *   { to: string, image: string, fortune?: string, note?: string }
 *
 * Responses:
 *   200 { ok: true }
 *   400 { error: string }   — bad input
 *   500 { error: string }   — send failed
 *   503 { error: string }   — API key not configured
 *
 * IMPORTANT — Resend SDK v2+ (this project uses v6):
 *   resend.emails.send() does NOT throw on failure.
 *   It returns { data, error } where error is non-null on failure.
 *   The old try/catch pattern silently swallows API rejections.
 *   This file uses the correct { data, error } destructuring.
 */

import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Maximum base64 image size we'll accept (~4 MB decoded ≈ ~5.3 MB base64).
// A 640×480 JPEG at 88% quality is typically 100–300 KB; a 4-photo strip
// composite is typically 300–700 KB. Both are well within this limit.
const MAX_IMAGE_BYTES = 5_500_000

// Resend sandbox sender — works without domain verification but only
// delivers to the Resend account owner's inbox (sukhjeet.singh@gmail.com).
const SANDBOX_FROM = 'onboarding@resend.dev'

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
  const base64Data = image.split(',')[1]
  if (!base64Data) {
    return NextResponse.json({ error: 'malformed image data' }, { status: 400 })
  }

  // ── 4. Initialise Resend ──────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[JHALAK] RESEND_API_KEY not set — set it in Vercel Environment Variables')
    return NextResponse.json({ error: 'email service not configured' }, { status: 503 })
  }
  const resend = new Resend(apiKey)

  const customFrom = (process.env.RESEND_FROM_EMAIL ?? '').trim()
  const primaryFrom = customFrom || SANDBOX_FROM
  console.log('[JHALAK API] primary sender:', primaryFrom)

  // ── 5. Build email payload ────────────────────────────────────────────────
  const emailPayload = {
    from: primaryFrom,
    to: [to],
    subject: 'your jhalak moment ✦',

    // Plain-text fallback
    text: [
      'your jhalak moment',
      '',
      fortune || 'a glimpse. captured just for you.',
      '',
      'the photo is attached.',
      '',
      note || 'simkaur.art',
    ].join('\n'),

    // HTML body — inline styles only (email clients strip <style> tags)
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
                <tr>
                  <td style="padding:20px 24px 12px 24px;">
                    <p style="margin:0;
                              font-size:18px;
                              letter-spacing:0.20em;
                              color:rgba(237,232,226,0.55);">
                      ✦ JHALAK
                    </p>
                  </td>
                </tr>

                <!-- ATTACHMENT NOTICE -->
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

    attachments: [
      {
        filename: 'jhalak.jpg',
        content: base64Data,
        contentType: 'image/jpeg',
      },
    ],
  }

  // ── 6. Send — Resend v2+ returns { data, error }, does NOT throw ──────────
  //
  // The old try/catch pattern was broken: resend.emails.send() in SDK v2+
  // never throws for API-level errors; it returns error in the result object.
  // Callers must check `error` explicitly.

  const { data, error } = await resend.emails.send(emailPayload)

  if (error) {
    // Log the full Resend error for Vercel function logs
    console.error('[JHALAK] Resend rejected (primary sender):', {
      sender: primaryFrom,
      name: (error as { name?: string }).name,
      message: error.message,
      full: JSON.stringify(error),
    })

    // If a custom sender was configured and failed, retry with the sandbox
    // sender as a last resort.  Sandbox delivery goes only to the Resend
    // account owner's inbox (sukhjeet.singh@gmail.com) — not to the visitor
    // — but it confirms the API key is valid and the route is working.
    if (customFrom) {
      console.log('[JHALAK] Retrying with sandbox sender (onboarding@resend.dev)…')
      const { data: fallbackData, error: fallbackError } = await resend.emails.send({
        ...emailPayload,
        from: SANDBOX_FROM,
      })

      if (fallbackError) {
        console.error('[JHALAK] Sandbox fallback also failed:', {
          name: (fallbackError as { name?: string }).name,
          message: fallbackError.message,
          full: JSON.stringify(fallbackError),
        })
        const msg = error.message
          ? `send failed: ${error.message} (sandbox fallback also failed: ${fallbackError.message})`
          : 'send failed'
        return NextResponse.json({ error: msg }, { status: 500 })
      }

      // Sandbox succeeded — visitor won't receive it, but API is confirmed working
      console.log(
        '[JHALAK API] Sent via sandbox fallback (domain not verified). id:',
        fallbackData?.id
      )
      console.warn('[JHALAK] Domain not verified — email delivered to account owner, not visitor.')
      return NextResponse.json({
        ok: true,
        warning: 'sent via sandbox — verify simkaur.art domain in Resend for visitor delivery',
      })
    }

    // No custom sender configured — sandbox itself failed
    const errMsg = error.message ? `send failed: ${error.message}` : 'send failed'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }

  console.log('[JHALAK API] Email sent successfully. id:', data?.id)
  return NextResponse.json({ ok: true })
}
