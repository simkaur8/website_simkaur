/* ============================================================
   JHALAK — Memory Capture v1.0
   Main script

   Sections
   --------
    1.  Constants
    1b. Memory data            ← fortune/note arrays, archive, pickMemory()
    2.  State
    3.  DOM references
    4.  Offscreen canvases & animation state
    5.  Webcam initialisation  ← robust constraint fallback chain
    6.  Render loop
    7.  Filter helpers         ← cover-crop drawing (no stretching)
    8.  Filter: NONE           ← warm tint + vignette
    9.  Filter: PIXEL GHOST    ← drifting afterimage layers, animated offsets
   10.  Filter: SURVEILLANCE   ← FaceDetector API + jitter fallback
   11.  Filter: ILOVEYOU       ← dual banners, face-reactive hearts
   12.  Filter selection
   13.  Mode selection
   14.  Countdown
   15.  Capture (single + strip)
   16.  Email panel
   17.  Reset
   18.  Archive panel
   20.  Status helpers
   21.  Event listeners
   22.  Init

   Notes
   -----
   • Run in Chrome — Safari < 18 does not support
     CanvasRenderingContext2D.filter, so CSS-filter effects on
     canvas won't work there.
   • All animation state lives in `anim` — no per-frame allocations.
   • ctx.save() / ctx.restore() is used around every filter
     application so state never leaks between draw passes.
   • Cover-crop drawing: video is always scaled to fill the canvas
     (preserving aspect ratio) and center-cropped so faces look natural.
   • Face detection uses the browser FaceDetector API when available
     (Chrome / macOS). Falls back to a convincing static approximation.
============================================================ */

'use strict';

/* ============================================================
   PRODUCTION CHECKLIST
   ─────────────────────────────────────────────────────────────
   • HTTPS required — getUserMedia is blocked on plain HTTP.
   • Chrome recommended — Safari <18 blocks canvas.filter effects.
   • Webcam must be connected before page load (permission prompt on first visit).
   • Vercel env vars (Settings → Environment Variables):
       RESEND_API_KEY=re_...
       RESEND_FROM_EMAIL=JHALAK <jhalak@simkaur.art>  ← after DNS verification
   • Production URL: https://simkaur.art/jhalak.html
   ─────────────────────────────────────────────────────────────
   Admin helpers (browser console on live page):
     jhalak_adminClearArchive()    — wipe session archive from localStorage
     jhalak_adminDeleteEntry(n)    — remove entry at index n
============================================================ */

/* ============================================================
   1. CONSTANTS
============================================================ */

const CANVAS_W        = 320;  // preview canvas width  (px)
const CANVAS_H        = 240;  // preview canvas height (px)
const CAPTURE_W       = 640;  // still capture width
const CAPTURE_H       = 480;  // still capture height
const PIXEL_BLOCK     = 12;   // fine mosaic block (PIXEL GHOST base layer)
const PIXEL_BLOCK_CRS = 30;   // coarse block (PIXEL GHOST corruption patches)
const HEART_COUNT     = 13;   // floating hearts for ILOVEYOU
const SPARKLE_COUNT   = 8;    // ✦ sparkle particles for ILOVEYOU
const COUNTDOWN_S     = 3;    // countdown seconds
const GHOST_PATCHES   = 26;   // corruption patch count for PIXEL GHOST (max density)

// ─── ASSET URLS (plug in your final values here) ───────────────────────────
// Logo shown in both the email postcard and the popup preview.
// Set to '' to use the text fallback "✦ JHALAK" in the popup.
const JHALAK_LOGO_URL = '';   // e.g. '/jhalak-assets/jhalak-logo.png'

// Spiral loading GIF shown while the email is being sent.
// Set to a real GIF path once the asset exists; empty string hides the spinner.
const JHALAK_SPIRAL_URL = '';  // TODO: replace with '/jhalak-assets/spiral-loading.gif' once asset is ready

// Sim's logo composited into the bottom-left of every captured image.
// The image is 3840×2160 RGBA — we scale it down to ~80px wide when drawing.
const CAPTURE_LOGO_URL = '/jhalak-assets/sim-logo.png';

// Pre-load capture logo at startup so it's available synchronously when capturing.
const _captureLogoImg = new Image();
_captureLogoImg.src = CAPTURE_LOGO_URL;


/* ============================================================
   1c. AUDIO
   Synthesised click sound — no audio file needed.
   Uses Web Audio API oscillator burst: short sharp transient
   that reads as a mechanical click on CRT speakers.
============================================================ */

function playClick() {
  try {
    const ac  = new (window.AudioContext || window.webkitAudioContext)();
    // Soft 90s UI click — short envelope, lower pitch, no harsh square wave
    const bufLen = Math.ceil(ac.sampleRate * 0.04);  // 40ms
    const buf    = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      // Decaying transient: initial click body + fast exponential decay
      const t    = i / ac.sampleRate;
      const env  = Math.exp(-t * 80);          // fast decay ~40ms
      // Mix: soft 900Hz tone + noise for texture
      const tone = Math.sin(2 * Math.PI * 900 * t) * 0.55;
      const noise = (Math.random() * 2 - 1) * 0.45;
      data[i] = (tone + noise) * env * 0.09;
    }
    const src  = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.9, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.04);
    src.start(ac.currentTime);
    src.onended = () => { try { ac.close(); } catch (_) {} };
  } catch (_) { /* silent fallback */ }
}

function playCapture() {
  try {
    const ac     = new (window.AudioContext || window.webkitAudioContext)();
    const sr     = ac.sampleRate;
    const bufLen = Math.ceil(sr * 0.18);  // 180ms shutter
    const buf    = ac.createBuffer(1, bufLen, sr);
    const data   = buf.getChannelData(0);

    for (let i = 0; i < bufLen; i++) {
      const t = i / sr;
      // Layer 1: initial mechanical click transient (0-10ms)
      const clickEnv  = t < 0.010 ? Math.exp(-t * 300) : 0;
      const click     = (Math.random() * 2 - 1) * clickEnv * 0.7;

      // Layer 2: shutter body — low thump at ~160Hz (8-80ms)
      const thumpT    = t - 0.008;
      const thumpEnv  = (thumpT > 0 && thumpT < 0.072) ? Math.exp(-thumpT * 55) : 0;
      const thump     = Math.sin(2 * Math.PI * 160 * thumpT) * thumpEnv * 0.55;

      // Layer 3: brief high-freq mechanical rattle (50-130ms)
      const rattleT   = t - 0.050;
      const rattleEnv = (rattleT > 0 && rattleT < 0.080) ? Math.exp(-rattleT * 70) : 0;
      const rattle    = (Math.random() * 2 - 1) * rattleEnv * 0.20;

      // Layer 4: faint tail (120-180ms) — mirror close
      const tailT     = t - 0.120;
      const tailEnv   = (tailT > 0 && tailT < 0.060) ? Math.exp(-tailT * 120) * 0.3 : 0;
      const tail      = (Math.random() * 2 - 1) * tailEnv * 0.15;

      data[i] = click + thump + rattle + tail;
    }

    const src  = ac.createBufferSource();
    const gain = ac.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ac.destination);
    gain.gain.value = 1.0;
    src.start(ac.currentTime);
    src.onended = () => { try { ac.close(); } catch (_) {} };
  } catch (_) { /* silent fallback */ }
}


/* ============================================================
   1b. MEMORY DATA
   Fortune / note / ASCII arrays — one item is picked at each capture
   and shown in the email panel and embedded in the outgoing email.
============================================================ */

const FORTUNES = [
  'you were seen.',
  'this moment will outlive your worry.',
  'something follows you home tonight.',
  'the camera knows what the eye forgets.',
  'you leave traces.',
  'memory is made of light and error.',
  'you are being archived.',
  'a glimpse. already gone.',
  'a small memory for later.',
  "you'll remember this differently.",
  'somewhere, a copy of you persists.',
  'hold still. you are being saved.',
  'the shutter opens. the shutter closes. you remain.',
  'the face you make when no one is watching — photographed.',
  'light landed here and was kept.',
];

const NOTES = [
  'captured at 4A Centre for Contemporary Asian Art, Sydney.',
  'jhalak: a glimpse, a flash, a moment half-seen.',
  'every photograph is a certificate of presence.',
  'the machine remembers. do you?',
  'an impression made in light.',
  'you are already part of the archive.',
  'simkaur.art',
];

/* ── ARCHIVE PERSISTENCE ─────────────────────────────────────────────────────
   Captures are stored in localStorage under 'jhalak_archive'.
   Storage: additive only for users — photos accumulate across refreshes.
   Each entry: { dataURL, fortune, note, timestamp, filter }

   Browser quota: localStorage typically allows 5–10 MB. A 640×480 JPEG at
   88% quality is ~150–300 KB in base64. That fits ~20–40 captures before
   quota is reached. We catch QuotaExceededError and skip silently.

   Admin deletion (not surfaced in UI — artist/dev only):
     To clear the full archive: jhalak_adminClearArchive()
     To remove one entry by index: jhalak_adminDeleteEntry(index)
   Both functions are exposed on window for console access in production.
   ─────────────────────────────────────────────────────────────────────────── */

const ARCHIVE_KEY     = 'jhalak_archive';
const ARCHIVE_VER_KEY = 'jhalak_archive_ver';
const ARCHIVE_VERSION = 'v4';  // bump this to auto-wipe stale entries on next load

function loadArchiveFromStorage() {
  try {
    // Version gate — if the stored version doesn't match, wipe the old archive.
    // Bump ARCHIVE_VERSION above to clear all saved entries on the next page load.
    if (localStorage.getItem(ARCHIVE_VER_KEY) !== ARCHIVE_VERSION) {
      localStorage.removeItem(ARCHIVE_KEY);
      localStorage.setItem(ARCHIVE_VER_KEY, ARCHIVE_VERSION);
      return [];
    }
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

function saveArchiveToStorage(archive) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  } catch (e) {
    // QuotaExceededError: archive is too large. Silently skip — user keeps session copy.
    console.warn('[JHALAK] localStorage quota exceeded — capture not persisted:', e.name);
  }
}

// Load persisted captures from previous sessions
const memoryArchive = loadArchiveFromStorage();

function pickMemory() {
  return {
    fortune: FORTUNES[Math.floor(Math.random() * FORTUNES.length)],
    note:    NOTES   [Math.floor(Math.random() * NOTES.length)],
  };
}

function archiveCapture(dataURL, memory, name = '') {
  const entry = {
    dataURL,
    fortune:   memory.fortune,
    note:      memory.note,
    timestamp: Date.now(),
    filter:    state.selectedFilter,
    name,
  };
  memoryArchive.push(entry);
  saveArchiveToStorage(memoryArchive);
}

// ─── Admin deletion helpers (console-only, never surfaced in UI) ──────────────
// Usage (browser console on the live page):
//   jhalak_adminClearArchive()        — wipe everything
//   jhalak_adminDeleteEntry(2)        — remove entry at index 2 (0-based, oldest first)
window.jhalak_adminClearArchive = function () {
  memoryArchive.length = 0;
  localStorage.removeItem(ARCHIVE_KEY);
  console.log('[JHALAK admin] Archive cleared.');
};
window.jhalak_adminDeleteEntry = function (index) {
  if (index < 0 || index >= memoryArchive.length) {
    console.warn('[JHALAK admin] Index out of range:', index, '(length:', memoryArchive.length, ')');
    return;
  }
  memoryArchive.splice(index, 1);
  saveArchiveToStorage(memoryArchive);
  console.log('[JHALAK admin] Deleted entry at index', index, '— archive now has', memoryArchive.length, 'entries.');
};


/* ============================================================
   2. STATE
============================================================ */

const state = {
  stream:          null,
  selectedFilter:  'none',
  mode:            'single',   // 'single' | 'strip'
  capturing:       false,
  capturedDataURL: null,
  currentMemory:   null,       // fortune/note/ascii picked at last capture
  animFrame:       null,
  lastTimestamp:   0,
  debugMode:       false,      // D key — approx/native debug overlay
  mpDebugMode:     false,      // M key — MediaPipe landmark debug overlay
};

// Set to true the first time native FaceDetector returns actual landmark data.
// Stays false if API is present but only returns a bounding box.
let nativeLandmarksEverSeen = false;


/* ============================================================
   3. DOM REFERENCES
============================================================ */

const video     = document.getElementById('webcam-feed');
const capCanvas = document.getElementById('capture-canvas');
const capCtx    = capCanvas.getContext('2d');

const captureBtn   = document.getElementById('capture-btn');
const countdownEl  = document.getElementById('countdown');
const emailPanel   = document.getElementById('email-panel');
const emailInput   = document.getElementById('email-input');
const emailPreview = document.getElementById('email-preview-img');
const btnSend      = document.getElementById('btn-send');
const btnSkip      = document.getElementById('btn-skip');
const emailStatus  = document.getElementById('email-status');

const statusCamera = document.getElementById('status-camera');
const statusFilter = document.getElementById('status-filter');
const statusMode   = document.getElementById('status-mode');

const filterCells = document.querySelectorAll('.filter-cell');
const modeBtns    = document.querySelectorAll('.mode-btn');

capCanvas.width  = CAPTURE_W;
capCanvas.height = CAPTURE_H;


/* ============================================================
   4. OFFSCREEN CANVASES & ANIMATION STATE
   Offscreen canvases created once — reused every frame to
   avoid GC pressure from allocating inside the render loop.
============================================================ */

// PIXEL GHOST — fine mosaic canvas at preview resolution (block = PIXEL_BLOCK)
const pixelCanvas = document.createElement('canvas');
pixelCanvas.width  = Math.ceil(CANVAS_W / PIXEL_BLOCK);
pixelCanvas.height = Math.ceil(CANVAS_H / PIXEL_BLOCK);
const pixelCtx = pixelCanvas.getContext('2d');

// PIXEL GHOST — fine mosaic canvas at capture resolution
const pixelCapCanvas = document.createElement('canvas');
pixelCapCanvas.width  = Math.ceil(CAPTURE_W / PIXEL_BLOCK);
pixelCapCanvas.height = Math.ceil(CAPTURE_H / PIXEL_BLOCK);
const pixelCapCtx = pixelCapCanvas.getContext('2d');

// PIXEL GHOST — coarse mosaic canvas at preview resolution (block = PIXEL_BLOCK_CRS)
// Used for corruption patches — very large blocks, like a photomosaic torn apart
const pixelCrsCanvas = document.createElement('canvas');
pixelCrsCanvas.width  = Math.ceil(CANVAS_W / PIXEL_BLOCK_CRS);
pixelCrsCanvas.height = Math.ceil(CANVAS_H / PIXEL_BLOCK_CRS);
const pixelCrsCtx = pixelCrsCanvas.getContext('2d');

// PIXEL GHOST — coarse mosaic canvas at capture resolution
const pixelCrsCapCanvas = document.createElement('canvas');
pixelCrsCapCanvas.width  = Math.ceil(CAPTURE_W / PIXEL_BLOCK_CRS);
pixelCrsCapCanvas.height = Math.ceil(CAPTURE_H / PIXEL_BLOCK_CRS);
const pixelCrsCapCtx = pixelCrsCapCanvas.getContext('2d');

// PIXEL GHOST — external asset images preloaded for fragment mixing
// ─────────────────────────────────────────────────────────────────
// These are served from /jhalak-assets/. They load asynchronously;
// by the time the user takes a photo they'll be ready.
const GHOST_ASSET_URLS = [
  '/jhalak-assets/collage-textures.jpg',
  '/jhalak-assets/nature-img.jpg',
  '/jhalak-assets/natureimg2.jpg',
  '/jhalak-assets/stars.jpg',
];
const assetImages = GHOST_ASSET_URLS.map(url => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  return img;
});

// THERMAL — small canvas for pixel-map colour transform
const thermalCanvas = document.createElement('canvas');
thermalCanvas.width  = 320;   // higher res = sharper detail when enlarged
thermalCanvas.height = 240;
const thermalCtx = thermalCanvas.getContext('2d', { willReadFrequently: true });

const anim = {
  pixelGhost: {
    t:           0,    // time counter — increases by dt, drives drifting offsets
    densityT:    0,    // time elapsed on this filter — ramps patch count from 3→GHOST_PATCHES over ~35s
    patches:     [],   // corruption patch regions — populated by initGhostPatches()
    motionCanvas: null, motionCtx: null, prevMotion: null, // full-frame motion detection
    rightMotion:      0,    // compat alias for fullMotion
    fullMotion:       0,    // 0-1 normalised full-frame motion level
    motionCentroidX:  0.5,  // normalised [0..1] X of motion centroid (hand position)
    motionCentroidY:  0.5,  // normalised [0..1] Y of motion centroid
  },
  surveillance: {
    scanY:           0,
    jitterX:         0,
    jitterY:         0,
    jitterTimer:     0,
    confidence:      '---',
    confidenceTimer: 0,
    recBlink:        true,    // REC indicator blink state
    recTimer:        0,
    detectTimer:     0,       // milliseconds since last FaceDetector call

    // Gradual build — 0 when no face, ramps to 1 as scan locks on
    buildProgress:  0,
    buildFaceTimer: 0,        // ms face has been continuously detected

    // 30-second vertical glitch bar
    glitchTimer:    0,        // ms since last glitch (triggers at ~30 000ms)
    glitchActive:   false,
    glitchX:        0.4,      // normalised [0..1] horizontal strip position
    glitchW:        14,       // strip width in canvas px
    glitchElapsed:  0,        // ms the current glitch has been active
    glitchDuration: 300,      // ms how long this glitch will last

    // Top-to-bottom scrolling log buffer
    logLines:       [],       // array of strings, max ~18 shown
    logTimer:       0,        // ms since last new line was added
    logInterval:    500,      // ms between new lines (randomised for sparse/dense)

    // Landmark dot flicker state — independent per dot
    dotFlickers:    [1,1,1,1,1,1,1,1,1,1],   // 1=visible, randomised each flicker tick
    dotFlickerTimer: 0,

    // Motion grid for hand-tracking approximation
    motionCanvas:   null,
    motionCtx:      null,
    prevMotionData: null,
    motionCells:    [],       // [{nx,ny,level}] high-delta cells → drawn as hand dots
  },
  iloveyou: {
    bannerX:    0,
    bannerSubX: 0,
    t:          0,
    // Heart-gesture detection state
    motionCanvas:      null,
    motionCtx:         null,
    prevMotionData:    null,
    heartTimer:        0,     // ms bilateral hand gesture has been detected
    heartAlpha:        0,     // smoothed display alpha (0..1)
    leftRegionMotion:  0,     // smoothed motion in left half of frame
    rightRegionMotion: 0,     // smoothed motion in right half
    upperRegionMotion: 0,     // smoothed motion in upper 45% of frame
  },
  aura: {
    trailCanvas:    null,
    trailCtx:       null,
    t:              0,
    centreCanvas:   null,
    centreCtx:      null,
    // Motion tracking state
    motionCanvas:   null,
    motionCtx:      null,
    prevMotionData: null,
    motionLevel:    0,
    motionCentroidX: 0.5,
    motionCentroidY: 0.5,
    motionBlobs:    [],    // [{x,y,strength}] — multi-region blob list
  },
  thirdEye: {
    t: 0,
  },
  fallingStars: {
    particles: [],
    t:         0,
    motionCanvas: null, motionCtx: null, prevMotionData: null,
    motionLevel: 0, motionCentroidX: 0.5, motionCentroidY: 0.5,
    burstTimer: 0,
  },
  glitch: {
    t:          0,
    intensityT: 0,   // ms since filter activated — ramps chroma/strip intensity over 60s
    timer:      0,
    active:     false,
    elapsed:    0,
    duration:   300,
    strips:     [],
    blocks:     [],
    blockTimer: 0,
    motionCanvas: null, motionCtx: null, prevMotionData: null,
    motionLevel: 0, motionCentroidX: 0.5, motionCentroidY: 0.5,
    dataStripes: [], colorBlocks: [], dataTimer: 0,
  },
  thermal: {
    motionCanvas: null, motionCtx: null, prevMotionData: null,
    motionLevel: 0, motionCentroidX: 0.5, motionCentroidY: 0.5,
  },
};


/* ============================================================
   FACE DETECTION — three-tier strategy
   ─────────────────────────────────────────────────────────────
   Tier 1 — 'native':  FaceDetector API (Chrome/macOS, async).
            Returns real eye/nose/mouth landmark positions via
            the OS Vision framework. facePos.landmarks populated.

   Tier 2 — 'approx':  Skin-tone sampling on a 40×30 tiny canvas
            (sync, < 1ms). Uses YCbCr thresholds — tested against
            a broad range of skin tones. No external dependencies.
            facePos.landmarks stays null; geometry is inferred by
            getSurveyPoints() from the bounding box.

   Tier 3 — 'none':   Both APIs unavailable. facePos never marked
            detected — surveillance falls back to centred box.

   The facePos object is the single shared contract:
     { cx, cy, w, h, detected, landmarks }
   All normalised [0..1], already mirrored. Consumers never need
   to know which tier is active.
============================================================ */

// ── Shared contract ───────────────────────────────────────────────────────

const facePos = {
  cx:        0.50,   // face centre x [0..1]
  cy:        0.32,   // face centre y [0..1]
  w:         0.30,   // face width    [0..1]
  h:         0.42,   // face height   [0..1]
  detected:  false,
  landmarks: null,   // { leftEye, rightEye, nose, mouth } or null
                     // Each point: { x, y } normalised + mirrored.
                     // null when only bounding box is available.
  skinBounds: null,  // { minX, maxX, minY, maxY } normalised [0..1]
                     // Set by approx tier; null when using native API.
                     // minY ≈ eyebrow level, maxY ≈ chin level.
};

// Multi-face array — up to 3 face objects (facesArray[0] === facePos for backward compat)
const facesArray = [facePos];  // starts with just the primary face

// ── Strategy state ────────────────────────────────────────────────────────

let detectionStrategy = 'none';   // 'native' | 'approx' | 'none'
let nativeDetector    = null;
let nativeDetecting   = false;

// Tiny canvas for skin-tone sampling (approx tier).
// willReadFrequently keeps pixel data in CPU-accessible memory.
const skinCanvas = document.createElement('canvas');
skinCanvas.width  = 40;
skinCanvas.height = 30;
const skinCtx    = skinCanvas.getContext('2d', { willReadFrequently: true });

// Exponential-moving-average state for approx smoothing.
// Smoothing prevents jitter from frame-to-frame pixel noise.
const skinSmooth = {
  cx: 0.5, cy: 0.32, w: 0.30, h: 0.42,
  minX: 0.25, maxX: 0.75, minY: 0.10, maxY: 0.65,
  seeded: false,
};

// ── Initialisation ────────────────────────────────────────────────────────

function initFaceDetector() {
  const ua        = navigator.userAgent;
  const isChrome  = /Chrome\//.test(ua) && !/Chromium\//.test(ua) && !/Edg\//.test(ua);
  const isMac     = /Mac/.test(navigator.platform || navigator.userAgentData?.platform || '');

  console.group('[JHALAK] Face detection startup');
  console.log('Browser Chrome:', isChrome, '| Mac:', isMac);
  console.log('FaceDetector API in window:', typeof FaceDetector !== 'undefined');

  if (typeof FaceDetector !== 'undefined') {
    try {
      nativeDetector    = new FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
      detectionStrategy = 'native';
      console.log('[JHALAK] tracking: native FaceDetector API active');
      console.log('  Note: landmarks (eye/nose/mouth) may not be provided by all browsers.');
      console.log('  On Chrome+macOS via OS Vision they should appear. Watch for');
      console.log('  [JHALAK] LANDMARKS SEEN! in the console to confirm.');
      console.log('  Press D to toggle on-screen debug overlay.');
      console.groupEnd();
      return;
    } catch (e) {
      console.warn('[JHALAK] FaceDetector API present but failed to construct:', e.message);
    }
  }

  detectionStrategy = 'approx';
  console.log('[JHALAK] tracking: approx skin-tone (YCbCr) — native FaceDetector unavailable');
  console.log('  Press D to toggle on-screen debug overlay showing what is being detected.');
  console.groupEnd();
}

// ── Tier 1 — native FaceDetector ──────────────────────────────────────────

function runNativeDetection() {
  if (nativeDetecting || video.readyState < 2) return;
  nativeDetecting = true;

  nativeDetector.detect(video).then(faces => {
    // Reset facesArray to just primary
    facesArray.length = 1;

    if (faces.length > 0) {
      const f  = faces[0].boundingBox;
      const vw = video.videoWidth  || 640;
      const vh = video.videoHeight || 480;

      // Mirror x to match the mirrored canvas display
      facePos.cx       = 1.0 - (f.x + f.width  * 0.5) / vw;
      facePos.cy       = (f.y  + f.height * 0.5) / vh;
      facePos.w        = f.width  / vw;
      facePos.h        = f.height / vh;
      facePos.detected = true;

      // Harvest landmarks if the API provides them.
      // Chrome/macOS Vision returns: 'eye' (2 locations), 'nose', 'mouth'.
      const raw = faces[0].landmarks;
      if (raw && raw.length > 0) {
        const lm = {};
        raw.forEach(lmk => {
          if (!lmk.locations || lmk.locations.length === 0) return;
          if (lmk.type === 'eye' && lmk.locations.length >= 2) {
            // Sort by source-x: lower x = source-left = mirrored-right
            const sorted = [...lmk.locations].sort((a, b) => a.x - b.x);
            lm.rightEye = { x: 1.0 - sorted[0].x / vw, y: sorted[0].y / vh };
            lm.leftEye  = { x: 1.0 - sorted[1].x / vw, y: sorted[1].y / vh };
          } else {
            const loc = lmk.locations[0];
            lm[lmk.type] = { x: 1.0 - loc.x / vw, y: loc.y / vh };
          }
        });
        facePos.landmarks  = Object.keys(lm).length > 0 ? lm : null;
      if (facePos.landmarks && !nativeLandmarksEverSeen) {
        nativeLandmarksEverSeen = true;
        console.log('[JHALAK] LANDMARKS SEEN! Native OS Vision landmarks are active. Keys:', Object.keys(facePos.landmarks).join(', '));
      }
      } else {
        facePos.landmarks = null;
      }
      facePos.skinBounds = null;  // native uses API landmarks; no skin-bound data

      // Populate extra faces into facesArray
      for (let fi = 1; fi < Math.min(3, faces.length); fi++) {
        const ff = faces[fi].boundingBox;
        const extraFace = {
          cx: 1.0 - (ff.x + ff.width * 0.5) / vw,
          cy: (ff.y + ff.height * 0.5) / vh,
          w:  ff.width / vw,
          h:  ff.height / vh,
          detected: true,
          landmarks: null,
          skinBounds: null,
        };
        // Harvest landmarks for extra faces too if available
        const rawExtra = faces[fi].landmarks;
        if (rawExtra && rawExtra.length > 0) {
          const lmE = {};
          rawExtra.forEach(lmk => {
            if (!lmk.locations || !lmk.locations.length) return;
            if (lmk.type === 'eye' && lmk.locations.length >= 2) {
              const sorted = [...lmk.locations].sort((a, b) => a.x - b.x);
              lmE.rightEye = { x: 1.0 - sorted[0].x / vw, y: sorted[0].y / vh };
              lmE.leftEye  = { x: 1.0 - sorted[1].x / vw, y: sorted[1].y / vh };
            } else {
              const loc = lmk.locations[0];
              lmE[lmk.type] = { x: 1.0 - loc.x / vw, y: loc.y / vh };
            }
          });
          extraFace.landmarks = Object.keys(lmE).length > 0 ? lmE : null;
        }
        facesArray.push(extraFace);
      }
    } else {
      facePos.detected   = false;
      facePos.landmarks  = null;
      facePos.skinBounds = null;
      facesArray.length  = 1;
    }
    nativeDetecting = false;
  }).catch(() => { nativeDetecting = false; });
}

// ── Tier 2 — skin-tone approximation (YCbCr) ─────────────────────────────

/**
 * YCbCr skin-tone gate.
 * Thresholds from published skin-detection literature — covers a broad
 * range of skin tones (light through dark, various ethnicities).
 * No floating-point ops: integer arithmetic only.
 */
function isSkinTone(r, g, b) {
  // Cb = -0.169R - 0.331G + 0.500B + 128   (blue-difference chroma)
  // Cr =  0.500R - 0.419G - 0.081B + 128   (red-difference chroma)
  // Skin region: 77 < Cb < 127,  133 < Cr < 173
  const cb = (-169 * r - 331 * g + 500 * b + 128000) / 1000;
  const cr = ( 500 * r - 419 * g -  81 * b + 128000) / 1000;
  return cb > 77 && cb < 127 && cr > 133 && cr < 173;
}

function runApproxDetection() {
  if (video.readyState < 2) return;

  // Draw webcam into 40×30 canvas (mirrored to match display)
  skinCtx.save();
  skinCtx.scale(-1, 1);
  skinCtx.drawImage(video, -40, 0, 40, 30);
  skinCtx.restore();

  const data   = skinCtx.getImageData(0, 0, 40, 30).data;
  const W = 40, H = 30;

  let sumX = 0, sumY = 0, count = 0;
  let minX = W, maxX = 0, minY = H, maxY = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (isSkinTone(data[i], data[i + 1], data[i + 2])) {
        sumX += x; sumY += y; count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Need at least ~2% of pixels as skin to consider it a face
  if (count < 24) {
    facePos.detected  = false;
    facePos.landmarks = null;
    skinSmooth.seeded = false;
    return;
  }

  // Raw estimates in normalised [0..1] coords
  const rawCX   = sumX / count / W;
  const rawCY   = sumY / count / H;
  // Expand bounding box by 30% to contain the full head (hair, forehead)
  const rawW    = Math.max(0.15, (maxX - minX + 1) / W * 1.30);
  const rawH    = Math.max(0.20, (maxY - minY + 1) / H * 1.50);
  // Raw skin bounds — NOT expanded; these are the actual skin pixel extents.
  // minY ≈ eyebrow level, maxY ≈ chin — precise feature anchors.
  const rawMinX = minX / W;
  const rawMaxX = (maxX + 1) / W;
  const rawMinY = minY / H;
  const rawMaxY = (maxY + 1) / H;

  // Exponential moving average — α = 0.22 (responsive but not jittery)
  const α = 0.22;
  if (!skinSmooth.seeded) {
    // First valid detection — seed directly to avoid a slow drift-in
    skinSmooth.cx     = rawCX;
    skinSmooth.cy     = rawCY;
    skinSmooth.w      = rawW;
    skinSmooth.h      = rawH;
    skinSmooth.minX   = rawMinX;
    skinSmooth.maxX   = rawMaxX;
    skinSmooth.minY   = rawMinY;
    skinSmooth.maxY   = rawMaxY;
    skinSmooth.seeded = true;
  } else {
    skinSmooth.cx   += α * (rawCX   - skinSmooth.cx);
    skinSmooth.cy   += α * (rawCY   - skinSmooth.cy);
    skinSmooth.w    += α * (rawW    - skinSmooth.w);
    skinSmooth.h    += α * (rawH    - skinSmooth.h);
    skinSmooth.minX += α * (rawMinX - skinSmooth.minX);
    skinSmooth.maxX += α * (rawMaxX - skinSmooth.maxX);
    skinSmooth.minY += α * (rawMinY - skinSmooth.minY);
    skinSmooth.maxY += α * (rawMaxY - skinSmooth.maxY);
  }

  facePos.cx         = skinSmooth.cx;
  facePos.cy         = skinSmooth.cy;
  facePos.w          = skinSmooth.w;
  facePos.h          = skinSmooth.h;
  facePos.detected   = true;
  facePos.landmarks  = null;  // approx tier: bounding box only
  facePos.skinBounds = {
    minX: skinSmooth.minX,
    maxX: skinSmooth.maxX,
    minY: skinSmooth.minY,
    maxY: skinSmooth.maxY,
  };
}

// ── Public entry point (called from render loop) ──────────────────────────

function requestFaceDetection() {
  if (detectionStrategy === 'native') runNativeDetection();
  else if (detectionStrategy === 'approx') runApproxDetection();
  // 'none': do nothing — facePos.detected stays false
}


/* ============================================================
   4b. MEDIAPIPE FACE LANDMARKER  (experimental, parallel to approx)
   ─────────────────────────────────────────────────────────────
   Loaded asynchronously on startup. Does NOT replace the approx
   detector — runs in parallel. Toggle M key to see its output.

   Key landmark indices from the 478-point Face Mesh:
     468 = left iris centre   473 = right iris centre
     1   = nose tip            13  = inner upper lip
     14  = inner lower lip    168  = glabella (between brows)

   X coordinates are mirrored (1 - x) to match the flipped canvas.
============================================================ */

// ── State ─────────────────────────────────────────────────────────────────

let mpLandmarker  = null;     // FaceLandmarker instance, set after async load
let mpDetecting   = false;    // async guard — prevents overlapping calls
let mpDetectTimer = 0;        // ms accumulator for throttled calls
let mpLandmarks   = null;     // latest result: array of 478 {x,y,z} points, or null
let mpLoadFailed  = false;    // set if init failed — suppresses further attempts
let mpFaceLandmarksAll = [];   // all detected face landmarks (up to 3)

// FPS tracking
let mpFrameCount = 0;
let mpFPSBase    = 0;         // timestamp of FPS window start

// How often to run detection (ms). Start conservative for old hardware.
const MP_INTERVAL = 120;      // ~8 fps — raise to 60 for ~16fps if the Mac handles it

const MP_WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MP_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// ── Init (called from init(), non-blocking) ────────────────────────────────

async function initMediaPipe() {
  if (mpLoadFailed) return;
  console.log('[JHALAK] mediapipe: loading…');

  try {
    // Dynamic import works in Chrome even in non-module scripts
    const vision = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs'
    );
    const { FaceLandmarker, FilesetResolver } = vision;

    const wasm = await FilesetResolver.forVisionTasks(MP_WASM);

    mpLandmarker = await FaceLandmarker.createFromOptions(wasm, {
      baseOptions: {
        modelAssetPath: MP_MODEL,
        delegate: 'GPU',          // falls back to CPU automatically if GPU unavailable
      },
      runningMode:                      'VIDEO',
      numFaces:                          3,
      outputFaceBlendshapes:             false,   // not needed — saves compute
      outputFacialTransformationMatrices: false,
    });

    console.log('[JHALAK] mediapipe: loaded ✓  (press M to toggle landmark overlay)');
    mpFPSBase = performance.now();

  } catch (e) {
    mpLoadFailed = true;
    mpLandmarker = null;
    console.warn('[JHALAK] mediapipe: failed to load —', e.message);
    console.warn('  App continues with approx skin-tone detector as fallback.');
  }
}

// ── Per-frame detection call ───────────────────────────────────────────────

function runMediaPipeDetection(timestamp) {
  if (!mpLandmarker || mpDetecting || video.readyState < 2) return;
  mpDetecting = true;

  try {
    const result = mpLandmarker.detectForVideo(video, timestamp);

    if (result.faceLandmarks && result.faceLandmarks.length > 0) {
      mpLandmarks = result.faceLandmarks[0];   // 478 normalised {x,y,z} points
      mpFaceLandmarksAll = result.faceLandmarks.slice(0, 3);

      // Log "active" exactly once on first detection
      if (!runMediaPipeDetection._loggedActive) {
        runMediaPipeDetection._loggedActive = true;
        console.log(`[JHALAK] mediapipe: active — face detected, ${mpLandmarks.length} landmarks`);
        console.log('  Iris centres available:', mpLandmarks.length >= 478);
      }

      // FPS counter — log every 3 seconds
      mpFrameCount++;
      const elapsed = timestamp - mpFPSBase;
      if (elapsed >= 3000) {
        const fps = (mpFrameCount / (elapsed / 1000)).toFixed(1);
        console.log(`[JHALAK] mediapipe: detection FPS approx ${fps}`);
        mpFrameCount = 0;
        mpFPSBase    = timestamp;
      }

      // Sync extra faces into facesArray from MediaPipe results
      const vwMP = video.videoWidth || 640;
      const vhMP = video.videoHeight || 480;
      // Reset facesArray to just primary
      while (facesArray.length > 1) facesArray.pop();
      for (let fi = 1; fi < mpFaceLandmarksAll.length; fi++) {
        const lms = mpFaceLandmarksAll[fi];
        if (!lms || !lms.length) continue;
        // Derive bounding box from MediaPipe landmarks
        let minX = 1, maxX = 0, minY = 1, maxY = 0;
        lms.forEach(pt => {
          if (pt.x < minX) minX = pt.x; if (pt.x > maxX) maxX = pt.x;
          if (pt.y < minY) minY = pt.y; if (pt.y > maxY) maxY = pt.y;
        });
        facesArray.push({
          cx: 1.0 - (minX + maxX) * 0.5,
          cy: (minY + maxY) * 0.5,
          w:  maxX - minX,
          h:  maxY - minY,
          detected: true,
          landmarks: null,
          skinBounds: null,
          mpLandmarks: lms,  // store raw MP landmarks for this face
        });
      }
    } else {
      mpLandmarks = null;
      mpFaceLandmarksAll = [];
    }
  } catch (e) {
    console.warn('[JHALAK] mediapipe: detection error —', e.message);
    mpLandmarks = null;
  }

  mpDetecting = false;
}

// ── Helper: get the 5 key points in canvas coords ─────────────────────────
// Returns null if mpLandmarks is not set.
// All x are mirrored (1 - x) to match the flipped canvas.

function getMPKeyPoints(w, h) {
  if (!mpLandmarks) return null;
  const lm = mpLandmarks;

  const mirX = (idx) => (1 - lm[idx].x) * w;
  const normY = (idx) => lm[idx].y * h;

  // Average a list of indices (for eye centres when iris not in result)
  const avg = (idxs) => ({
    x: idxs.reduce((s, i) => s + (1 - lm[i].x), 0) / idxs.length * w,
    y: idxs.reduce((s, i) => s + lm[i].y,        0) / idxs.length * h,
  });

  // Use iris centres (468/473) when available; fall back to eye contour average
  const hasIris = lm.length >= 478;
  const leftEye  = hasIris ? { x: mirX(468), y: normY(468) }
                           : avg([263, 362, 385, 387, 373, 380]);
  const rightEye = hasIris ? { x: mirX(473), y: normY(473) }
                           : avg([33, 133, 160, 158, 144, 153]);

  const nose      = { x: mirX(1),   y: normY(1) };
  const mouth     = { x: (mirX(13) + mirX(14)) * 0.5,
                      y: (normY(13) + normY(14)) * 0.5 };
  const thirdEye  = { x: mirX(168), y: normY(168) };  // glabella

  // Boundary landmarks for face-box derivation
  const chin       = { x: mirX(152), y: normY(152) };
  const forehead   = { x: mirX(10),  y: normY(10)  };
  const leftEar    = { x: mirX(234), y: normY(234) };  // outer left jaw edge
  const rightEar   = { x: mirX(454), y: normY(454) };  // outer right jaw edge
  const mouthLeft  = { x: mirX(61),  y: normY(61)  };
  const mouthRight = { x: mirX(291), y: normY(291) };

  // Cheek centres: between ear edge and nose, at mid-face height
  const leftCheek  = { x: leftEar.x  * 0.55 + nose.x * 0.45, y: (leftEye.y  + mouth.y) * 0.50 };
  const rightCheek = { x: rightEar.x * 0.55 + nose.x * 0.45, y: (rightEye.y + mouth.y) * 0.50 };

  return { leftEye, rightEye, nose, mouth, thirdEye,
           chin, forehead, leftEar, rightEar, mouthLeft, mouthRight,
           leftCheek, rightCheek };
}

// ── Per-face landmark helper ───────────────────────────────────────────────
// Like getMPKeyPoints but accepts a landmark array directly (for extra faces)

function getMPKeyPointsForFace(lm, w, h) {
  if (!lm || !lm.length) return null;
  const mirX = (idx) => (1 - lm[idx].x) * w;
  const normY = (idx) => lm[idx].y * h;
  const avg = (idxs) => ({
    x: idxs.reduce((s, i) => s + (1 - lm[i].x), 0) / idxs.length * w,
    y: idxs.reduce((s, i) => s + lm[i].y, 0) / idxs.length * h,
  });
  const hasIris = lm.length >= 478;
  const leftEye  = hasIris ? { x: mirX(468), y: normY(468) } : avg([263,362,385,387,373,380]);
  const rightEye = hasIris ? { x: mirX(473), y: normY(473) } : avg([33,133,160,158,144,153]);
  const nose     = { x: mirX(1), y: normY(1) };
  const mouth    = { x: (mirX(13)+mirX(14))*0.5, y: (normY(13)+normY(14))*0.5 };
  const thirdEye = { x: mirX(168), y: normY(168) };
  const chin     = { x: mirX(152), y: normY(152) };
  const forehead = { x: mirX(10),  y: normY(10) };
  const leftEar  = { x: mirX(234), y: normY(234) };
  const rightEar = { x: mirX(454), y: normY(454) };
  const mouthLeft  = { x: mirX(61),  y: normY(61)  };
  const mouthRight = { x: mirX(291), y: normY(291) };
  const leftCheek  = { x: leftEar.x * 0.55 + nose.x * 0.45, y: (leftEye.y + mouth.y) * 0.50 };
  const rightCheek = { x: rightEar.x * 0.55 + nose.x * 0.45, y: (rightEye.y + mouth.y) * 0.50 };
  return { leftEye, rightEye, nose, mouth, thirdEye, chin, forehead, leftEar, rightEar, mouthLeft, mouthRight, leftCheek, rightCheek };
}

// ── Debug overlay (M key) ─────────────────────────────────────────────────

function drawMPDebugOverlay(ctx, w, h) {
  const pts = getMPKeyPoints(w, h);

  if (!pts) {
    // No face — show status
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(4, 4, 180, 18);
    ctx.fillStyle = mpLandmarker ? '#FF8800' : (mpLoadFailed ? '#FF4444' : '#AAAAAA');
    ctx.font      = '10px monospace';
    ctx.fillText(
      mpLandmarker ? 'MP: no face detected'
        : mpLoadFailed ? 'MP: failed to load'
        : 'MP: loading…',
      8, 16
    );
    ctx.restore();
    return;
  }

  const keyPts = [
    { pt: pts.leftEye,  label: 'L-eye',    col: '#00FFFF' },
    { pt: pts.rightEye, label: 'R-eye',    col: '#00FFFF' },
    { pt: pts.nose,     label: 'nose',     col: '#FF00FF' },
    { pt: pts.mouth,    label: 'mouth',    col: '#FF00FF' },
    { pt: pts.thirdEye, label: '3rd-eye',  col: '#FFFF00' },
  ];

  keyPts.forEach(({ pt, label, col }) => {
    ctx.save();
    // Outer ring
    ctx.strokeStyle = '#000000';
    ctx.lineWidth   = 3;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.stroke();
    // Coloured fill
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.fill();
    // Label
    ctx.fillStyle = col;
    ctx.font      = '9px monospace';
    ctx.fillText(label, pt.x + 7, pt.y + 3);
    ctx.restore();
  });

  // Eye line
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.50)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(pts.leftEye.x, pts.leftEye.y);
  ctx.lineTo(pts.rightEye.x, pts.rightEye.y);
  ctx.stroke();
  ctx.restore();

  // Status banner
  const hasIris = mpLandmarks && mpLandmarks.length >= 478;
  ctx.save();
  ctx.fillStyle   = 'rgba(0, 0, 0, 0.60)';
  ctx.fillRect(4, 4, 200, 18);
  ctx.fillStyle   = '#00FFFF';
  ctx.font        = '10px monospace';
  ctx.fillText(`MP active · ${mpLandmarks.length}pts · iris:${hasIris}`, 8, 16);
  ctx.restore();
}


/* ============================================================
   5. WEBCAM INITIALISATION

   Three-level constraint fallback chain:
     1. Preferred  — 640×480, 30fps cap, facingMode:user
     2. Basic      — 640×480 ideal only (drops facingMode & max fps)
     3. Minimal    — any video the browser offers

   This prevents OverconstrainedError on desktop cameras that
   don't report a facingMode, which was silently triggering
   the "access denied" status on some setups.

   Other fixes vs original:
   - Race condition: check readyState >= 1 before attaching
     loadedmetadata listener (event may already have fired)
   - Await video.play() explicitly — required on some browsers
     even when the <video> has the autoplay attribute
   - Wait for readyState >= 2 (HAVE_CURRENT_DATA) before
     starting the render loop so the first draw is never blank
   - Full error name + message shown in status bar + console
============================================================ */

async function initWebcam() {
  setStatus('camera', '○ requesting camera…');

  const constraintSets = [
    // 1. Full constraints
    {
      video: {
        width:      { ideal: 640 },
        height:     { ideal: 480 },
        frameRate:  { ideal: 30, max: 30 },
        facingMode: 'user',
      },
      audio: false,
    },
    // 2. Without facingMode / frameRate cap — avoids OverconstrainedError
    {
      video: {
        width:  { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    },
    // 3. Bare minimum — accept whatever the browser offers
    { video: true, audio: false },
  ];

  let stream  = null;
  let lastErr = null;

  for (const constraints of constraintSets) {
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      break; // success — stop trying
    } catch (err) {
      lastErr = err;
      // Permission denied or no device — pointless to retry
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') break;
      // OverconstrainedError / NotReadableError — try looser constraints
    }
  }

  if (!stream) {
    const e   = lastErr ?? {};
    const map = {
      NotAllowedError:      '✕ camera blocked — check System Preferences → Privacy → Camera',
      NotFoundError:        '✕ no camera found — connect webcam and reload',
      NotReadableError:     '✕ camera in use by another app — close it and reload',
      OverconstrainedError: '✕ camera rejected constraints — try reloading',
      AbortError:           '✕ camera init aborted — try reloading',
    };
    const msg = map[e.name] ?? `✕ camera error: ${e.name ?? 'unknown'}`;
    setStatus('camera', msg);
    console.error(
      `[JHALAK] camera error: ${e.name} — ${e.message}`,
      '\nFull error object:', e
    );
    return;
  }

  state.stream    = stream;
  video.srcObject = stream;

  // If the stream ends unexpectedly (sleep / cable unplug)
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    setStatus('camera', '✕ camera disconnected — reload page');
    cancelAnimationFrame(state.animFrame);
  });

  // ── Wait for metadata ────────────────────────────────────────
  await new Promise(resolve => {
    if (video.readyState >= 1) { resolve(); return; }
    video.addEventListener('loadedmetadata', resolve, { once: true });
    setTimeout(resolve, 6000);
  });

  // ── Explicit play() ──────────────────────────────────────────
  try {
    await video.play();
  } catch (err) {
    console.warn(`[JHALAK] video.play() warning: ${err.name} — ${err.message}`);
  }

  // ── Wait for first drawable frame ───────────────────────────
  await new Promise(resolve => {
    if (video.readyState >= 2) { resolve(); return; }
    video.addEventListener('canplay', resolve, { once: true });
    setTimeout(resolve, 4000);
  });

  // Size all grid canvases to their CSS layout dimensions
  sizeGridCanvases();

  // Initialise per-filter animation state
  const firstCanvas = document.querySelector('.filter-canvas');
  const cw = firstCanvas.width  || CANVAS_W;
  const ch = firstCanvas.height || CANVAS_H;
  initILoveYouAnim(cw, ch);
  initGhostPatches(cw, ch);
  initAuraAnim(cw, ch);
  initFallingStarsAnim(cw, ch);

  setStatus('camera', '● camera ready');
  startRenderLoop();
}

/** Match every grid canvas's pixel dimensions to its CSS display size. */
function sizeGridCanvases() {
  document.querySelectorAll('.filter-canvas').forEach(canvas => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w > 0) canvas.width  = w;
    if (h > 0) canvas.height = h;
    if (w === 0 || h === 0) {
      canvas.width  = CANVAS_W;
      canvas.height = CANVAS_H;
      console.warn('[JHALAK] canvas has zero layout size — using fallback dimensions');
    }
  });
}


/* ============================================================
   6. RENDER LOOP
   One rAF loop drives all active grid canvases.
   Locked cells are skipped completely (zero draw cost).
============================================================ */

function startRenderLoop() {
  cancelAnimationFrame(state.animFrame);
  state.lastTimestamp = performance.now();
  state.animFrame = requestAnimationFrame(renderLoop);
}

function renderLoop(timestamp) {
  const dt = timestamp - state.lastTimestamp;
  state.lastTimestamp = timestamp;

  // Skip frame entirely if video isn't ready yet
  if (!video.readyState || video.readyState < 2) {
    state.animFrame = requestAnimationFrame(renderLoop);
    return;
  }

  // Kick off existing face detection (approx / native) periodically.
  const detInterval = detectionStrategy === 'approx' ? 100 : 250;
  anim.surveillance.detectTimer += dt;
  if (anim.surveillance.detectTimer > detInterval) {
    anim.surveillance.detectTimer = 0;
    requestFaceDetection();
  }

  // MediaPipe — throttled independently; runs in parallel with approx
  if (mpLandmarker && !mpLoadFailed) {
    mpDetectTimer += dt;
    if (mpDetectTimer >= MP_INTERVAL) {
      mpDetectTimer = 0;
      runMediaPipeDetection(timestamp);
    }
  }

  // First pass: render all non-'none' cells
  filterCells.forEach(cell => {
    if (cell.classList.contains('filter-cell--locked')) return;
    const canvas    = cell.querySelector('.filter-canvas');
    const filterKey = cell.dataset.filter;
    if (!canvas || filterKey === 'none') return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      renderFilter(ctx, canvas.width, canvas.height, filterKey, false, dt);
    } catch (err) {
      console.error('[JHALAK] renderFilter error in', filterKey, err);
    }
  });

  // Second pass: ALL composite — draw 3×3 grid of all filter canvases into the 'none' cell
  {
    const noneCell = [...filterCells].find(c => c.dataset.filter === 'none' && !c.classList.contains('filter-cell--locked'));
    const ac = noneCell?.querySelector('.filter-canvas');
    if (ac) {
      const actx = ac.getContext('2d');
      actx.clearRect(0, 0, ac.width, ac.height);
      actx.fillStyle = '#0d0b0a';
      actx.fillRect(0, 0, ac.width, ac.height);
      const otherCells = [...filterCells].filter(c => c.dataset.filter !== 'none' && !c.classList.contains('filter-cell--locked'));
      const cols = 3, rows = 3;
      const cw = Math.floor(ac.width / cols);
      const ch = Math.floor(ac.height / rows);
      let cellIdx = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * cw, y = row * ch;
          if (row === 1 && col === 1) {
            // Centre slot: live mirrored video
            if (video.readyState >= 2) {
              const vw = video.videoWidth || 640, vh = video.videoHeight || 480;
              const scale = Math.max(cw / vw, ch / vh);
              const sw = cw / scale, sh = ch / scale;
              const sx = (vw - sw) * 0.5, sy = (vh - sh) * 0.5;
              actx.save();
              actx.translate(x + cw, y);
              actx.scale(-1, 1);
              actx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
              actx.restore();
            }
          } else {
            const oCanvas = otherCells[cellIdx++]?.querySelector('.filter-canvas');
            if (oCanvas && oCanvas.width > 0) actx.drawImage(oCanvas, x, y, cw, ch);
          }
        }
      }
      // Thin divider lines
      actx.strokeStyle = 'rgba(0,0,0,0.55)';
      actx.lineWidth = 1;
      for (let c = 1; c < cols; c++) { actx.beginPath(); actx.moveTo(c * cw, 0); actx.lineTo(c * cw, ac.height); actx.stroke(); }
      for (let r = 1; r < rows; r++) { actx.beginPath(); actx.moveTo(0, r * ch); actx.lineTo(ac.width, r * ch); actx.stroke(); }
    }
  }

  // Render to enlarged overlay canvas if present (Photo Booth overlay mode)
  const enlargeOverlay = document.querySelector('.filter-enlarge-overlay');
  if (enlargeOverlay) {
    const oc = enlargeOverlay.querySelector('canvas');
    if (oc) {
      const octx = oc.getContext('2d');
      octx.clearRect(0, 0, oc.width, oc.height);
      try {
        renderFilter(octx, oc.width, oc.height, enlargeOverlay.dataset.filterKey, false, dt);
      } catch (err) {
        console.error('[JHALAK] enlarged overlay render error (', enlargeOverlay.dataset.filterKey, '):', err);
      }
    }
  }

  state.animFrame = requestAnimationFrame(renderLoop);
}

/**
 * Central dispatch — same function used by the live loop and
 * the still-capture path.
 *
 * @param {boolean} isCapture  Skip animation state updates when true.
 */
function renderFilter(ctx, w, h, filterKey, isCapture, dt) {
  switch (filterKey) {
    case 'pixel-ghost':  drawPixelGhost(ctx, w, h, isCapture, dt);    break;
    case 'surveillance': drawSurveillance(ctx, w, h, isCapture, dt);  break;
    case 'iloveyou':     drawILoveYou(ctx, w, h, isCapture, dt);      break;
    case 'aura':          drawAura(ctx, w, h, isCapture, dt);         break;
    case '3rd-eye':       draw3rdEye(ctx, w, h, isCapture, dt);       break;
    case 'thermal':       drawThermal(ctx, w, h, isCapture, dt);      break;
    case 'falling-stars': drawFallingStars(ctx, w, h, isCapture, dt); break;
    case 'glitch':        drawGlitch(ctx, w, h, isCapture, dt);       break;
    default:             drawNone(ctx, w, h);                          break;
  }
  // Debug overlay: shown on all canvases when debug mode active (never on capture)
  if (state.debugMode  && !isCapture) drawDebugOverlay(ctx, w, h);
  if (state.mpDebugMode && !isCapture) drawMPDebugOverlay(ctx, w, h);
}


/* ============================================================
   7. FILTER HELPERS
============================================================ */

/**
 * Draw the webcam into a destination rectangle using "cover" semantics.
 *
 * The source video is scaled so it fills dw × dh completely — preserving
 * aspect ratio, cropping from the centre — so faces are never squashed or
 * stretched regardless of the canvas shape or webcam native resolution.
 *
 * Pass mirrored = true (default) for selfie / Photo Booth orientation.
 */
function drawVideoCover(ctx, dx, dy, dw, dh, mirrored = true) {
  const vw = video.videoWidth  || 640;
  const vh = video.videoHeight || 480;

  // Scale to fill — match whichever axis needs the larger factor
  const scale = Math.max(dw / vw, dh / vh);
  const sw    = dw / scale;          // source sample width
  const sh    = dh / scale;          // source sample height
  const sx    = (vw - sw) * 0.5;    // centre-crop: source x offset
  const sy    = (vh - sh) * 0.5;    // centre-crop: source y offset

  if (mirrored) {
    ctx.save();
    ctx.scale(-1, 1);
    // Under scale(-1,1) the destination [dx, dy, dw, dh] becomes [-(dx+dw), dy, dw, dh]
    ctx.drawImage(video, sx, sy, sw, sh, -(dx + dw), dy, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}

/**
 * Draw the webcam (cover-cropped, mirrored) into a separate small canvas.
 * Used by PIXEL GHOST to build its pixelated source.
 */
function drawVideoToPixelCanvas(pCtx, pCanvas) {
  const vw = video.videoWidth  || 640;
  const vh = video.videoHeight || 480;
  const pw = pCanvas.width;
  const ph = pCanvas.height;

  const scale = Math.max(pw / vw, ph / vh);
  const sw    = pw / scale;
  const sh    = ph / scale;
  const sx    = (vw - sw) * 0.5;
  const sy    = (vh - sh) * 0.5;

  pCtx.save();
  pCtx.scale(-1, 1);
  pCtx.drawImage(video, sx, sy, sw, sh, -pw, 0, pw, ph);
  pCtx.restore();
}

/** Draw a heart shape centred at (cx, cy). */
function drawHeartShape(ctx, cx, cy, size) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.35);
  ctx.bezierCurveTo(cx,     cy,            cx - s, cy,            cx - s, cy + s * 0.35);
  ctx.bezierCurveTo(cx - s, cy + s * 0.75, cx,     cy + s * 1.1,  cx,     cy + s * 1.4);
  ctx.bezierCurveTo(cx,     cy + s * 1.1,  cx + s, cy + s * 0.75, cx + s, cy + s * 0.35);
  ctx.bezierCurveTo(cx + s, cy,            cx,     cy,            cx,     cy + s * 0.35);
  ctx.closePath();
}

/** Surveillance-style L-shaped corner brackets around a rectangle. */
function drawCornerBrackets(ctx, x, y, w, h, arm, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(x,         y + arm);  ctx.lineTo(x,         y);     ctx.lineTo(x + arm,     y);
  ctx.moveTo(x + w - arm, y);      ctx.lineTo(x + w,     y);     ctx.lineTo(x + w,     y + arm);
  ctx.moveTo(x + w, y + h - arm);  ctx.lineTo(x + w, y + h);     ctx.lineTo(x + w - arm, y + h);
  ctx.moveTo(x + arm,     y + h);  ctx.lineTo(x,     y + h);     ctx.lineTo(x,     y + h - arm);
  ctx.stroke();
  ctx.restore();
}


/* ============================================================
   8. FILTER: NONE
   Not entirely plain — a warm amber tint and dark vignette
   make the feed feel analogue and intimate rather than raw
   webcam. Thinks of itself as a photograph.
============================================================ */

function drawNone(ctx, w, h) {
  // Clean webcam feed — no processing, no edge darkening
  drawVideoCover(ctx, 0, 0, w, h);
}


/* ============================================================
   9. FILTER: PIXEL GHOST
   A face half-dissolving into itself. The image fractures into
   large coarse blocks centred around where the face is — some
   blocks sample from shifted positions (showing "wrong" content),
   others are chromatic ghost doubles drifting on sine curves.

   Layer structure:
     1. Aged webcam base — desaturated, warm, slightly dark
     2. Fine pixelated overlay — the whole face quantised
     3. Two drifting full-frame ghost doubles (rose / violet)
     4. Coarse corruption patches — face-biased, large blocks,
        each sampling from a displaced position so unfamiliar
        content appears in the "holes"
     5. Dreaminess wash + vignette
============================================================ */

/* ─── Patch data helpers ─────────────────────────────────────────────────── */

/**
 * Face zone definitions for targeted pixel erosion.
 * Coordinates are relative to the face bounding box (relX/Y in fractions
 * of boxW/boxH, origin at box top-left).
 * weight controls how often this zone is selected — left eye is 4× more
 * likely than most zones, creating visible asymmetric facial dissolution.
 */
// Zones are relative to the skin bounding box (when skinBounds available)
// or to the inflated face box (fallback).
// Origin = top-left of box.  relY=0 ≈ eyebrow level, relY=1 ≈ chin level.
// Negative relY reaches above the eyebrow (forehead / hair).
const GHOST_ZONE_DEFS = [
  // Right-side facial zones — dominant; the right side dissolves first and most.
  { relX:  0.46, relY: -0.02, relW: 0.58, relH: 0.30, weight: 5 }, // right eye / brow ← dominant
  { relX:  0.52, relY:  0.28, relW: 0.54, relH: 0.46, weight: 4 }, // right cheek / jaw
  { relX:  0.48, relY: -0.30, relW: 0.64, relH: 0.28, weight: 3 }, // right forehead
  // Near background — immediately right of the face into open canvas space
  { relX:  0.92, relY: -0.30, relW: 0.80, relH: 0.70, weight: 4 }, // upper-right bg
  { relX:  0.85, relY:  0.35, relW: 0.80, relH: 0.75, weight: 3 }, // lower-right bg
  // Far background — extends well past the face (colonise the right third of frame)
  { relX:  1.25, relY: -0.40, relW: 1.10, relH: 1.10, weight: 4 }, // far-right upper
  { relX:  1.10, relY:  0.50, relW: 0.90, relH: 0.80, weight: 3 }, // far-right lower
  // Token chin / lower-left for grounding + foreground feel
  { relX:  0.18, relY:  0.70, relW: 0.64, relH: 0.28, weight: 1 }, // chin / lower face
];

const GHOST_ZONE_TOTAL_WEIGHT = GHOST_ZONE_DEFS.reduce((s, z) => s + z.weight, 0);

/**
 * Pick a zone by weight and return its canvas-pixel bounds.
 */
function pickGhostZone(fBoxX, fBoxY, fBoxW, fBoxH) {
  // Zones are already weighted to the right half + background spill on that side.
  // One light reroll if we accidentally land on the mouth/chin zone too often.
  let zone;
  for (let attempt = 0; attempt < 2; attempt++) {
    let r = Math.random() * GHOST_ZONE_TOTAL_WEIGHT;
    zone = GHOST_ZONE_DEFS[GHOST_ZONE_DEFS.length - 1];
    for (const z of GHOST_ZONE_DEFS) { r -= z.weight; if (r <= 0) { zone = z; break; } }
    if (zone === GHOST_ZONE_DEFS[GHOST_ZONE_DEFS.length - 1] && attempt === 0) continue;
    break;
  }
  return {
    zX: fBoxX + zone.relX * fBoxW,
    zY: fBoxY + zone.relY * fBoxH,
    zW: zone.relW * fBoxW,
    zH: zone.relH * fBoxH,
  };
}

/**
 * Create one corruption patch — targeted at a specific facial zone.
 * Each patch samples displaced content from the coarse mosaic canvas
 * so the "hole" shows foreign imagery from elsewhere on the face.
 */
function newGhostPatch(w, h) {
  // Resolve face bounding box in canvas pixels.
  // Prefer skinBounds (actual detected skin region) for zone targeting;
  // fall back to centroid+scale, then to a static placeholder.
  let fBoxX, fBoxY, fBoxW, fBoxH;
  const mpPts = getMPKeyPoints(w, h);
  if (mpPts) {
    // Tier 0: MediaPipe — boundary landmarks give the tightest accurate box.
    // Zones land on actual facial regions, not estimated relative positions.
    const fMinX = Math.min(mpPts.leftEar.x, mpPts.rightEar.x);
    const fMaxX = Math.max(mpPts.leftEar.x, mpPts.rightEar.x);
    fBoxX = fMinX;
    fBoxY = mpPts.forehead.y;
    fBoxW = fMaxX - fMinX;
    fBoxH = mpPts.chin.y - mpPts.forehead.y;
  } else if (facePos.skinBounds) {
    // Box aligned to actual detected skin: relY=0 = eyebrow, relY=1 = chin
    const sb = facePos.skinBounds;
    fBoxX = sb.minX * w;
    fBoxY = sb.minY * h;
    fBoxW = (sb.maxX - sb.minX) * w;
    fBoxH = (sb.maxY - sb.minY) * h;
  } else if (facePos.detected) {
    const fScaleW = facePos.w * 1.30;
    const fScaleH = facePos.h * 1.28;
    fBoxW = fScaleW * w;
    fBoxH = fScaleH * h;
    fBoxX = facePos.cx * w - fBoxW * 0.50;
    fBoxY = facePos.cy * h - fBoxH * 0.44;
  } else {
    fBoxW = 0.48 * w;
    fBoxH = 0.64 * h;
    fBoxX = w * 0.50 - fBoxW * 0.50;
    fBoxY = h * 0.28 - fBoxH * 0.44;
  }

  // Pick a zone (weighted — left eye heavily targeted)
  const { zX, zY, zW, zH } = pickGhostZone(fBoxX, fBoxY, fBoxW, fBoxH);

  // Fragment shape — mix of portrait strips and horizontal slices (collage feel)
  const isSlice = Math.random() < 0.40;
  const pw = isSlice
    ? Math.max(18, zW * (0.52 + Math.random() * 0.44))  // slightly smaller slices
    : Math.max(10, zW * (0.20 + Math.random() * 0.30)); // narrower portrait strips
  const ph = isSlice
    ? Math.max(7,  zH * (0.10 + Math.random() * 0.18))  // shallower slices
    : Math.max(14, zH * (0.36 + Math.random() * 0.36)); // shorter strips

  let px = Math.max(0, Math.min(w - pw, zX + (zW - pw) * Math.random()));
  let py = Math.max(0, Math.min(h - ph, zY + (zH - ph) * Math.random()));

  // 40% chance: force placement in right half regardless of zone
  if (Math.random() < 0.40) {
    const rw = facePos.detected ? facePos.w * w : w * 0.35;
    const rx0 = facePos.detected ? facePos.cx * w + rw * 0.3 : w * 0.5;
    px = rx0 + Math.random() * (w - rx0 - rw * 0.1);
    py = Math.random() * h;
  }

  // SMALL displacement — fragment shows content from nearby on the face (ghost / echo)
  // 2–10% of canvas dimension: close enough to feel like a copy, far enough to register
  const sign   = () => Math.random() < 0.5 ? 1 : -1;
  const srcDXn = sign() * (0.02 + Math.random() * 0.08);
  const srcDYn = sign() * (0.01 + Math.random() * 0.06);

  // Ensure minimum size so the fragment always has visible area
  const safePW = Math.max(10, pw);
  const safePH = Math.max(10, ph);
  // Re-clamp position after size enforcement
  const safePX = Math.max(0, Math.min(w - safePW, px));
  const safePY = Math.max(0, Math.min(h - safePH, py));

  // Fully opaque — fragments read as solid extracted photo pieces
  const opacity = 1.0;

  // 25% chance of using an external asset image — falls back to live webcam (never blank)
  const readyAssets = assetImages.filter(img => img.complete && img.naturalWidth > 0);
  const useAsset = readyAssets.length > 0 && Math.random() < 0.25;
  const assetIdx = useAsset ? Math.floor(Math.random() * readyAssets.length) : -1;
  const assetSrcX = Math.random() * 0.60;
  const assetSrcY = Math.random() * 0.60;

  return {
    nx: safePX / w,  ny: safePY / h,
    nw: safePW / w,  nh: safePH / h,
    srcDXn, srcDYn,
    opacity,
    assetIdx,
    assetSrcX,
    assetSrcY,
    life:    0,
    maxLife: 80 + Math.floor(Math.random() * 100),  // longer lifespan = denser overlap over time
  };
}

function initGhostPatches(w, h) {
  anim.pixelGhost.patches = [];
  for (let i = 0; i < GHOST_PATCHES; i++) {
    const p = newGhostPatch(w, h);
    p.life = Math.floor(Math.random() * p.maxLife);  // stagger starts
    anim.pixelGhost.patches.push(p);
  }
}

function updateGhostPatches(w, h) {
  anim.pixelGhost.patches.forEach((p, i) => {
    p.life++;
    if (p.life >= p.maxLife) {
      let np = newGhostPatch(w, h);
      // 40% chance: cluster near a live neighbour — creates connected glitch masses
      if (Math.random() < 0.40 && anim.pixelGhost.patches.length > 3) {
        const anchor = anim.pixelGhost.patches[Math.floor(Math.random() * anim.pixelGhost.patches.length)];
        if (anchor !== p && anchor.life < anchor.maxLife * 0.80) {
          const spread = 0.06 + Math.random() * 0.07;
          np.nx = Math.max(0, Math.min(1 - np.nw, anchor.nx + (Math.random() - 0.5) * spread));
          np.ny = Math.max(0, Math.min(1 - np.nh, anchor.ny + (Math.random() - 0.5) * spread * 0.7));
        }
      }
      anim.pixelGhost.patches[i] = np;
    }
  });
}

/**
 * Draw active fragment patches onto ctx.
 * activeCount limits how many patches render — used for the density ramp.
 * Each patch is a real crop of the live video, slightly displaced —
 * fragments feel like photo pieces being extracted from the face.
 */
function drawGhostPatches(ctx, w, h, activeCount) {
  const patches = activeCount != null
    ? anim.pixelGhost.patches.slice(0, activeCount)
    : anim.pixelGhost.patches;
  patches.forEach(patch => {
    const dx = patch.nx * w;
    const dy = patch.ny * h;
    const dw = patch.nw * w;
    const dh = patch.nh * h;
    // Skip degenerate patches (shouldn't happen with safePW/safePH, but be defensive)
    if (dw < 4 || dh < 4) return;

    // Lifecycle fade — crisp in, long hold, fade out
    const t    = patch.life / patch.maxLife;
    const fade = t < 0.07 ? t / 0.07 : t > 0.88 ? (1 - t) / 0.12 : 1.0;
    const a    = patch.opacity * fade;

    // Shift the entire video frame by a small offset — the clip then
    // exposes a slightly different part of the image at this position,
    // creating a ghost echo / displaced copy of nearby face content.
    const offsetX = patch.srcDXn * w;
    const offsetY = patch.srcDYn * h;

    // Draw fragment — either live webcam crop or external asset image
    ctx.save();
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.rect(dx, dy, dw, dh);
    ctx.clip();
    // Warm purple pre-fill — if video offset leaves a gap, show site-palette tone
    ctx.fillStyle = '#1A0828';  // deep warm purple, not stark black
    ctx.globalAlpha = 1.0;
    ctx.fillRect(dx, dy, dw, dh);
    ctx.globalAlpha = a;
    // No desaturation filter — fragments read as sharp photographic excerpts, not tinted overlays

    if (patch.assetIdx >= 0) {
      // Asset image fragment — "memory shard" feel
      const img = assetImages[patch.assetIdx];
      if (img && img.complete && img.naturalWidth > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const sx = Math.floor(patch.assetSrcX * iw);
        const sy = Math.floor(patch.assetSrcY * ih);
        const sw = Math.max(1, Math.min(iw - sx, Math.ceil(dw / w * iw * 1.3)));
        const sh = Math.max(1, Math.min(ih - sy, Math.ceil(dh / h * ih * 1.3)));
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        drawVideoCover(ctx, -offsetX, -offsetY, w, h);  // fallback if not loaded yet
      }
    } else {
      // Live webcam crop — slightly displaced echo of nearby face content
      drawVideoCover(ctx, -offsetX, -offsetY, w, h);
    }
    ctx.restore();

    // Thin photo-print border — makes it read as a cropped fragment, not a filter
    ctx.save();
    ctx.globalAlpha = a * 0.55;
    ctx.strokeStyle = 'rgba(255, 250, 235, 0.80)';
    ctx.lineWidth   = 1.0;
    ctx.strokeRect(dx + 0.5, dy + 0.5, dw - 1, dh - 1);
    ctx.restore();
  });
}

/* ─── Main draw function ─────────────────────────────────────────────────── */

function drawPixelGhost(ctx, w, h, isCapture, dt) {
  const pg = anim.pixelGhost;
  if (!isCapture) {
    pg.t        += dt;
    pg.densityT += dt;
  }

  // ── BASE: readable face — full clarity, slight cooling so fragments pop ─
  ctx.save();
  ctx.filter = 'brightness(0.97) saturate(0.90)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // ── DRIFTING GHOST DOUBLES — two tinted echoes offset on sine curves ────
  // Rose ghost drifts left/up; violet ghost drifts right/down. Screen blend
  // lets them layer over the base without darkening — gives a holographic feel.
  if (video.readyState >= 2) {
    const t = pg.t * 0.001;
    const roseOffX   =  Math.sin(t * 0.53) * w * 0.015;
    const roseOffY   =  Math.cos(t * 0.41) * h * 0.010;
    const violetOffX = -Math.sin(t * 0.47 + 1.2) * w * 0.018;
    const violetOffY =  Math.cos(t * 0.37 + 0.8) * h * 0.012;
    const ghostAlpha = isCapture ? 0.28 : 0.22 + Math.sin(t * 0.9) * 0.06;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    ctx.save();
    ctx.globalAlpha = ghostAlpha;
    ctx.filter = 'hue-rotate(330deg) saturate(3.5) brightness(0.85)';
    drawVideoCover(ctx, roseOffX, roseOffY, w, h);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = ghostAlpha * 0.85;
    ctx.filter = 'hue-rotate(260deg) saturate(3.0) brightness(0.80)';
    drawVideoCover(ctx, violetOffX, violetOffY, w, h);
    ctx.restore();

    ctx.restore();
  }

  // ── FULL-FRAME MOTION DETECTION ─────────────────────────────────────────
  // 32×24 tiny canvas covers the whole frame — tracks moving hands anywhere.
  // Computes per-pixel delta, motion total, and weighted centroid (hand position).
  if (!isCapture && video.readyState >= 2) {
    if (!pg.motionCanvas) {
      pg.motionCanvas = document.createElement('canvas');
      pg.motionCanvas.width  = 32;
      pg.motionCanvas.height = 24;
      pg.motionCtx = pg.motionCanvas.getContext('2d', { willReadFrequently: true });
      pg.fullMotion      = 0;
      pg.motionCentroidX = 0.5;
      pg.motionCentroidY = 0.5;
    }
    const mctx = pg.motionCtx;
    mctx.save();
    mctx.scale(-1, 1);
    mctx.drawImage(video, 0, 0, -32, 24);
    mctx.restore();
    const curr = mctx.getImageData(0, 0, 32, 24).data;
    if (pg.prevMotion && pg.prevMotion.length === curr.length) {
      let totalDelta = 0;
      let cx = 0, cy = 0, cw = 0;
      const NOISE = 18;  // ignore sub-threshold pixel noise
      for (let row = 0; row < 24; row++) {
        for (let col = 0; col < 32; col++) {
          const bi = (row * 32 + col) * 4;
          const d = Math.abs(curr[bi]   - pg.prevMotion[bi])
                  + Math.abs(curr[bi+1] - pg.prevMotion[bi+1])
                  + Math.abs(curr[bi+2] - pg.prevMotion[bi+2]);
          totalDelta += d;
          if (d > NOISE) { cx += col * d; cy += row * d; cw += d; }
        }
      }
      pg.fullMotion  = Math.min(1, totalDelta / (32 * 24 * 3 * 255));
      pg.rightMotion = pg.fullMotion;  // keep compat alias
      if (cw > 0) {
        pg.motionCentroidX = cx / cw / 32;   // normalised [0..1]
        pg.motionCentroidY = cy / cw / 24;
      }
    }
    pg.prevMotion = curr;
  }

  // ── DENSITY RAMP: start sparse (3 patches), grow to GHOST_PATCHES over ~35s ─
  const densityRamp      = Math.min(1, pg.densityT / 35000);
  // Motion bonus: up to +6 extra patches during active movement (full-frame)
  const motionBonus      = Math.round((pg.fullMotion || 0) * 6);
  const activePatchCount = Math.min(GHOST_PATCHES,
    Math.max(5, Math.round(5 + (GHOST_PATCHES - 5) * densityRamp) + motionBonus));

  // ── HAND-MOTION REFRACTION — chromatic glow at detected motion centroid ──
  // When hands are moving in frame, emit a soft chromatic-split ghost burst
  // at the detected motion position. Layers R+G+B channels with offsets → refracts.
  if (!isCapture && (pg.fullMotion || 0) > 0.04 && video.readyState >= 2) {
    const mx   = (1 - pg.motionCentroidX) * w;  // mirror X to match display
    const my   = pg.motionCentroidY * h;
    const mLvl = Math.min(1, pg.fullMotion * 2.5);
    const r    = Math.max(18, Math.min(w * 0.22, w * 0.12 * (1 + mLvl)));

    ctx.save();
    ctx.globalAlpha = mLvl * 0.50;
    ctx.globalCompositeOperation = 'screen';

    // Cyan channel — shifted left
    ctx.save();
    const shift = r * 0.22;
    ctx.filter = 'hue-rotate(175deg) saturate(6) brightness(1.8)';
    ctx.beginPath(); ctx.rect(mx - r - shift, my - r, r * 2 + shift, r * 2); ctx.clip();
    drawVideoCover(ctx, -shift * 0.6, 0, w, h);
    ctx.restore();

    // Red channel — shifted right
    ctx.save();
    ctx.filter = 'hue-rotate(355deg) saturate(6) brightness(1.8)';
    ctx.beginPath(); ctx.rect(mx - r + shift, my - r, r * 2 - shift, r * 2); ctx.clip();
    drawVideoCover(ctx, shift * 0.6, 0, w, h);
    ctx.restore();

    ctx.restore();
  }

  // ── FRAGMENT PATCHES: face-zone crops, slightly displaced ───────────────
  if (!isCapture) updateGhostPatches(w, h);
  drawGhostPatches(ctx, w, h, activePatchCount);

  // ── GLUE: thin connecting bars that stitch nearby fragments together ──────
  // Barcode-style horizontal slivers and short digital bridges link cluster
  // members so the ghost masses feel cohesive, not scattered.
  {
    const patches = anim.pixelGhost.patches;
    // Collect live patch centres, sorted by X so adjacent pairs are spatially close
    const livePts = patches
      .filter(p => p.life < p.maxLife * 0.85 && p.nw > 0)
      .map(p => ({
        cx: (p.nx + p.nw * 0.5) * w,
        cy: (p.ny + p.nh * 0.5) * h,
        fadeOp: (() => { const t = p.life / p.maxLife; return t < 0.07 ? t / 0.07 : t > 0.88 ? (1 - t) / 0.12 : 1; })()
      }))
      .sort((a, b) => a.cx - b.cx);

    ctx.save();
    // Thin pale-lavender bar connecting each spatially close pair
    for (let i = 0; i < livePts.length - 1; i++) {
      const A = livePts[i], B = livePts[i + 1];
      const dist = Math.hypot(B.cx - A.cx, B.cy - A.cy);
      if (dist > w * 0.18) continue;           // only connect close fragments
      const alpha = Math.min(A.fadeOp, B.fadeOp) * 0.14;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = 'rgba(230, 215, 255, 1)';
      const midY = (A.cy + B.cy) * 0.5;
      const x0   = Math.min(A.cx, B.cx) - 3;
      const x1   = Math.max(A.cx, B.cx) + 3;
      ctx.fillRect(x0, midY - 0.5, x1 - x0, 1);
      // Second thinner bridge 2px above — double barcode stripe
      if (Math.random() < 0.55) ctx.fillRect(x0, midY - 2.5, x1 - x0, 1);
    }

    // Sparse barcode overlay in the face region — gives the "digital glue" feel
    const fX  = facePos.detected ? facePos.cx * w : w * 0.5;
    const fY  = facePos.detected ? facePos.cy * h : h * 0.42;
    const fRW = facePos.detected ? facePos.w * w * 0.55 : w * 0.28;
    for (let k = 0; k < 5; k++) {
      const barY  = fY + (Math.random() - 0.5) * fRW * 2.2;
      const barX  = fX - fRW * 0.5 + Math.random() * fRW * 0.4;
      const barW  = fRW * (0.20 + Math.random() * 0.50);
      ctx.globalAlpha = 0.05 + Math.random() * 0.09;
      ctx.fillStyle   = 'rgba(210, 200, 255, 1)';
      ctx.fillRect(barX, barY, barW, 1);
    }
    ctx.restore();
  }

  // Additional face ghost patches — lightweight extra patches per extra face
  facesArray.slice(1).forEach(extraFace => {
    if (!extraFace.detected) return;
    const exCX = extraFace.cx * w;
    const exCY = extraFace.cy * h;
    const exFW = extraFace.w * w * 1.2;
    const exFH = extraFace.h * h * 1.2;
    // Draw 4 quick patches for extra faces — simple displaced video rects
    for (let pi = 0; pi < 4; pi++) {
      const pdx = exCX + (Math.random() - 0.5) * exFW;
      const pdy = exCY + (Math.random() - 0.5) * exFH;
      const pdw = exFW * (0.15 + Math.random() * 0.20);
      const pdh = exFH * (0.25 + Math.random() * 0.35);
      const pOffX = (Math.random() - 0.5) * 0.06 * w;
      const pOffY = (Math.random() - 0.5) * 0.04 * h;
      ctx.save();
      ctx.globalAlpha = 0.40 + Math.random() * 0.30;
      ctx.beginPath();
      ctx.rect(pdx - pdw*0.5, pdy - pdh*0.5, pdw, pdh);
      ctx.clip();
      ctx.fillStyle = '#1A0828';
      ctx.fillRect(pdx - pdw*0.5, pdy - pdh*0.5, pdw, pdh);
      drawVideoCover(ctx, pOffX, pOffY, w, h);
      ctx.restore();
    }
  });


}
// Presence glow removed — it added a milky haze over the left (clean) side.


/* ============================================================
  10. FILTER: SURVEILLANCE
   Machine-vision face scan. Gradually builds up landmark
   overlays as it locks onto a face — corner brackets first,
   then eye/nose/mouth markers, then connecting lines,
   then the full facial constellation.

   Uses real FaceDetector landmarks (eyes, nose, mouth) from
   the browser API when available on Chrome/macOS. Falls back
   to face-geometry approximations from the bounding box.
   All with zero external dependencies.

   A vertical glitch bar fires every ~30 seconds: a narrow
   strip of the canvas is briefly colour-inverted at a random
   horizontal position.
============================================================ */

/**
 * Blend factor for a feature that unlocks at `threshold` and fades in
 * over the next `range` units of buildProgress.
 */
function surveyAlpha(bp, threshold, range = 0.10) {
  return Math.max(0, Math.min(1, (bp - threshold) / range));
}

/**
 * Resolve facial landmark positions in canvas pixels.
 * Uses real API landmarks where available; estimates the rest
 * from the face bounding box so all points are always defined.
 */
function getSurveyPoints(boxX, boxY, boxW, boxH, w, h) {
  const cx = boxX + boxW * 0.50;
  const cy = boxY + boxH * 0.50;

  let leftEye, rightEye, nose, mouth;

  const mpPts = getMPKeyPoints(w, h);
  if (mpPts) {
    // ── Tier 0: MediaPipe — iris centres + precise nose/mouth ─────────────────
    leftEye  = mpPts.leftEye;
    rightEye = mpPts.rightEye;
    nose     = mpPts.nose;
    mouth    = mpPts.mouth;

  } else {
  const lm = facePos.landmarks;
  const cvt = pt => ({ x: pt.x * w, y: pt.y * h });

  if (lm?.leftEye && lm?.rightEye && lm?.nose && lm?.mouth) {
    // ── Tier 1: native API landmarks — use directly, most accurate ────────────
    leftEye  = cvt(lm.leftEye);
    rightEye = cvt(lm.rightEye);
    nose     = cvt(lm.nose);
    mouth    = cvt(lm.mouth);

  } else if (facePos.skinBounds) {
    // ── Tier 2: skin bounds — derived from where pixels were actually detected
    // skinBounds.minY ≈ eyebrow level; skinBounds.maxY ≈ chin level.
    // These are the actual detected skin extents, not inferred from a scaled box.
    const sb      = facePos.skinBounds;
    const sMinX   = sb.minX * w;
    const sMaxX   = sb.maxX * w;
    const sMinY   = sb.minY * h;
    const sMaxY   = sb.maxY * h;
    const sMidX   = (sMinX + sMaxX) * 0.5;
    const sSkinW  = sMaxX - sMinX;
    const sSkinH  = sMaxY - sMinY;
    // Eyes near the top of the detected skin patch; mouth near the bottom
    leftEye  = { x: sMidX - sSkinW * 0.28, y: sMinY + sSkinH * 0.08 };
    rightEye = { x: sMidX + sSkinW * 0.28, y: sMinY + sSkinH * 0.08 };
    nose     = { x: sMidX,                  y: sMinY + sSkinH * 0.52 };
    mouth    = { x: sMidX,                  y: sMinY + sSkinH * 0.82 };

  } else {
    // ── Tier 3: bounding-box geometry — least accurate, always defined ────────
    leftEye  = { x: cx - boxW * 0.24, y: boxY + boxH * 0.32 };
    rightEye = { x: cx + boxW * 0.24, y: boxY + boxH * 0.32 };
    nose     = { x: cx,               y: boxY + boxH * 0.54 };
    mouth    = { x: cx,               y: boxY + boxH * 0.72 };
  }
  } // end else (no MediaPipe)

  return {
    faceCX: cx, faceCY: cy,
    leftEye, rightEye, nose, mouth,
    topHead:     { x: cx,                    y: boxY + boxH * 0.03 },
    chin:        { x: cx,                    y: boxY + boxH * 0.96 },
    leftJaw:     { x: boxX + boxW * 0.08,    y: boxY + boxH * 0.72 },
    rightJaw:    { x: boxX + boxW * 0.92,    y: boxY + boxH * 0.72 },
    leftTemple:  { x: boxX + boxW * 0.04,    y: boxY + boxH * 0.22 },
    rightTemple: { x: boxX + boxW * 0.96,    y: boxY + boxH * 0.22 },
    leftCheek:   { x: boxX + boxW * 0.10,    y: boxY + boxH * 0.52 },
    rightCheek:  { x: boxX + boxW * 0.90,    y: boxY + boxH * 0.52 },
    mouthLeft:   { x: mouth.x - boxW * 0.14, y: mouth.y },
    mouthRight:  { x: mouth.x + boxW * 0.14, y: mouth.y },
    noseBridge:  { x: cx, y: (leftEye.y + nose.y) * 0.5 },
  };
}

/** Crosshair dot at a landmark position. */
function drawLandmarkDot(ctx, x, y, r, crossLen, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = 0.8;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - crossLen, y); ctx.lineTo(x + crossLen, y);
  ctx.moveTo(x, y - crossLen); ctx.lineTo(x, y + crossLen);
  ctx.stroke();
  ctx.restore();
}

/** Small diamond marker (used for nose). */
function drawDiamond(ctx, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth   = 0.9;
  ctx.beginPath();
  ctx.moveTo(x,     y - r);
  ctx.lineTo(x + r, y    );
  ctx.lineTo(x,     y + r);
  ctx.lineTo(x - r, y    );
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/** Thin line connecting two points. */
function drawConnector(ctx, ax, ay, bx, by, color, alpha) {
  ctx.save();
  ctx.globalAlpha  = alpha;
  ctx.strokeStyle  = color;
  ctx.lineWidth    = 0.6;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.restore();
}

/* ─── Main draw function ─────────────────────────────────────────────────── */

function drawSurveillance(ctx, w, h, isCapture, dt) {
  const s  = anim.surveillance;
  const G  = 'rgba(0, 210, 230,';   // tracking cyan
  const GH = 'rgba(255, 215, 0,';   // feature-point yellow
  const RD = 'rgba(220, 40,  30,';  // face-box red

  // ── BASE VIDEO ─────────────────────────────────────────────────────────────
  ctx.save();
  ctx.filter = 'grayscale(1) contrast(1.20) brightness(0.78)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();
  ctx.fillStyle = `${G} 0.04)`;
  ctx.fillRect(0, 0, w, h);

  // ── UPDATE STATE ───────────────────────────────────────────────────────────
  if (!isCapture) {
    // Slow build — ~35s to full lock. Creates suspense as system "finds" the face.
    // Decay is faster (10s) so switching away and back resets the tension.
    if (facePos.detected) {
      s.buildProgress = Math.min(1, s.buildProgress + dt * 0.000028);  // ~36s to full
    } else {
      s.buildFaceTimer = 0;
      s.buildProgress  = Math.max(0, s.buildProgress - dt * 0.00010);  // ~10s decay
    }

    s.jitterTimer += dt;
    if (s.jitterTimer > 280) {
      const jScale  = facePos.detected ? Math.max(0.2, 1.0 - s.buildProgress * 0.9) : 4;
      s.jitterX     = (Math.random() - 0.5) * jScale;
      s.jitterY     = (Math.random() - 0.5) * jScale;
      s.jitterTimer = 0;
    }

    s.confidenceTimer += dt;
    if (s.confidenceTimer > 650) {
      const base    = 56 + s.buildProgress * 40;
      s.confidence  = facePos.detected ? (base + Math.random() * 2).toFixed(1) : '---';
      s.confidenceTimer = 0;
    }

    s.recTimer += dt;
    if (s.recTimer > 500) { s.recBlink = !s.recBlink; s.recTimer = 0; }

    const scanSpeed = facePos.detected ? 1.0 + (1 - s.buildProgress) * 2.4 : 3.2;
    s.scanY = (s.scanY + scanSpeed) % h;

    s.glitchTimer += dt;
    if (!s.glitchActive && s.glitchTimer >= 30000) {
      s.glitchTimer = 0; s.glitchActive = true;
      s.glitchX = 0.08 + Math.random() * 0.78;
      s.glitchW = 10 + Math.floor(Math.random() * 24);
      s.glitchElapsed = 0;
      s.glitchDuration = 120 + Math.floor(Math.random() * 320);
    }
    if (s.glitchActive) {
      s.glitchElapsed += dt;
      if (s.glitchElapsed >= s.glitchDuration) s.glitchActive = false;
    }
  }

  const bp = s.buildProgress;

  // ── RESOLVE FACE BOX ───────────────────────────────────────────────────────
  let boxW, boxH, boxX, boxY;
  const mpPts = getMPKeyPoints(w, h);
  if (mpPts) {
    // Tier 0: MediaPipe — derive tight box from boundary landmarks.
    // leftEar/rightEar = outer jaw edges; forehead/chin = top/bottom.
    const fMinX = Math.min(mpPts.leftEar.x, mpPts.rightEar.x);
    const fMaxX = Math.max(mpPts.leftEar.x, mpPts.rightEar.x);
    const fW    = fMaxX - fMinX;
    const fH    = mpPts.chin.y - mpPts.forehead.y;
    boxW = fW * 1.06;
    boxH = fH * 1.04;
    boxX = (fMinX + fMaxX) * 0.5 - boxW * 0.5 + s.jitterX;
    boxY = mpPts.forehead.y - fH * 0.02 + s.jitterY;
  } else if (facePos.skinBounds) {
    // Tier 2: tight box directly on detected skin region.
    // minY ≈ eyebrow, maxY ≈ chin — keep box matched to actual face, not hair.
    const sb      = facePos.skinBounds;
    const sMinX   = sb.minX * w;
    const sMaxX   = sb.maxX * w;
    const sMinY   = sb.minY * h;
    const sMaxY   = sb.maxY * h;
    const sSkinW  = sMaxX - sMinX;
    const sSkinH  = sMaxY - sMinY;
    boxW = sSkinW * 1.12;
    boxH = sSkinH * 1.06;
    boxX = (sMinX + sMaxX) * 0.5 - boxW * 0.5 + s.jitterX;
    boxY = sMinY - sSkinH * 0.03 + s.jitterY;
  } else if (facePos.detected) {
    // Tier 1 (native API): centroid + normalised box dimensions
    boxW = facePos.w * w * 1.28;
    boxH = facePos.h * h * 1.22;
    boxX = facePos.cx * w - boxW * 0.5 + s.jitterX;
    boxY = facePos.cy * h - boxH * 0.50 + s.jitterY;
  } else {
    boxW = w * 0.40; boxH = h * 0.56;
    boxX = (w - boxW) * 0.5 + s.jitterX;
    boxY = h * 0.06 + s.jitterY;
  }
  boxX = Math.max(2, Math.min(w - boxW - 2, boxX));
  boxY = Math.max(2, Math.min(h - boxH - 2, boxY));

  // Resolve landmarks
  const pts = getSurveyPoints(boxX, boxY, boxW, boxH, w, h);

  // ── TERMINAL LOG STREAM — scrolling top-to-bottom like a real system feed ─
  // New lines are written at the bottom; old ones scroll up and out.
  // Sparse/dense variation: logInterval oscillates so lines arrive in bursts
  // then go quiet — mimics real async system output.
  {
    const now       = performance.now();
    const frameTick = Math.floor(now / 33);
    const LH        = 9;

    // Pool of log messages — live values baked in each time a line is born
    // (the logLines[] buffer stores the final string, not a live-computed one)
    const makeLogLine = () => {
      const LOG_POOL = [
        `[${(frameTick).toString().padStart(7,'0')}] scan_init()`,
        `[${(frameTick+1).toString().padStart(7,'0')}] cam.open(0) -> OK`,
        `[${(frameTick+2).toString().padStart(7,'0')}] frame_grab: ${(now/33|0)%9999}`,
        `[${(frameTick+3).toString().padStart(7,'0')}] detect_face(): ${facePos.detected?'FOUND':'SEARCHING'}`,
        `[${(frameTick+4).toString().padStart(7,'0')}] conf=${s.confidence}% thresh=45.0`,
        `[${(frameTick+5).toString().padStart(7,'0')}] kalman_predict: x=${(boxX).toFixed(0)} y=${(boxY).toFixed(0)}`,
        `[${(frameTick+6).toString().padStart(7,'0')}] lm_extract: ${mpLandmarks?'OK':'FALLBACK'}`,
        `[${(frameTick+7).toString().padStart(7,'0')}] triangulate: PENDING`,
        `PATTERN_MATCH  0x${Math.floor(now).toString(16).padStart(6,'0')}`,
        `STATUS         ACQUIRING_TARGET`,
        `PROC_UNIT      CPU_A`,
        `BUILD_PROG     ${(bp * 100).toFixed(1)}%`,
        `CAM_FEED       ACTIVE`,
        `RESOLUTION     640x480`,
        `SENS           HIGH`,
        `ISO            AUTO`,
        `BUFFER         OK`,
        `NET_LINK       LOCAL`,
        `SYS_VER        1.4.2`,
        `ENCRYPT        OFF`,
        `LOG_LEVEL      VERBOSE`,
        `MEM_AVAIL      94.2%`,
        `UPTIME         ${Math.floor(now/1000)}s`,
        // Occasional blank/spacer line for sparse feel
        '',
        '',
        // JHALAK name fragments — eerie repetition
        'JHALAKKHALKKJHALAK',
        'JHALALALALALALALALALAALALAA',
        'JHALAK_JHALAK_JHAL',
        'J H A L A K',
        // Decorative old-school emoji strings — sparse, eerie/playful
        '°❀⋆.ೃ࿔*:･𝜗𝜚*ੈ𑁍༘⋆❁✿❀',
        '-ˋˏ ༻❁✿❀༺ ˎˊ-',
        '-ˋˏ ༻❁༺ ˎˊ-',
        '₊˚✿𑁍.ೃ࿔*:･𑁍 ✿❀ ❀✿❀',
        '*ੈ✩‧₊˚༺☆༻*ੈ✩‧₊˚',
        '‧₊˚❀༉‧₊˚.',
        '❀。• *₊°。 ❀°。',
      ];
      return LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
    };

    // Advance log timer and add new lines
    if (!isCapture) {
      s.logTimer += dt;
      if (s.logTimer >= s.logInterval) {
        s.logTimer = 0;
        // Sparse/dense variation: next interval is 150–1400ms
        // Short intervals cluster → burst; long intervals give quiet gaps
        const roll = Math.random();
        s.logInterval = roll < 0.30
          ? 150 + Math.random() * 200    // burst cluster (short)
          : roll < 0.65
            ? 400 + Math.random() * 500  // normal rate
            : 700 + Math.random() * 700; // quiet pause (long)

        // Burst: sometimes add 2 lines at once for density
        const linesToAdd = Math.random() < 0.22 ? 2 : 1;
        for (let k = 0; k < linesToAdd; k++) {
          s.logLines.push(makeLogLine());
        }
        // Cap buffer — oldest lines are discarded (scroll up and off screen)
        const maxLines = Math.floor((h - 20) / LH);
        while (s.logLines.length > maxLines) s.logLines.shift();
      }
    }

    // Render the log from bottom of buffer downward (oldest at top, newest at bottom)
    // Kept lighter so the log stream doesn't overwhelm the face
    const logAlpha = Math.min(0.35, bp * 0.90 + 0.04);
    ctx.save();
    ctx.fillStyle   = `${G} 1)`;
    ctx.textAlign   = 'left';

    const startY = 14;
    s.logLines.forEach((line, i) => {
      if (!line) return;  // blank lines are sparse gaps — skip rendering
      // Subtle horizontal jitter per line for instability feel
      const xNoise = Math.sin(now * 0.0006 + i * 3.7) * 1.2;
      // Unicode/emoji lines need a different font — monospace won't render them
      const hasUnicode = /[^\x00-\x7F]/.test(line);
      if (hasUnicode) {
        ctx.font        = '7px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", monospace';
        ctx.globalAlpha = Math.min(0.72, logAlpha * 1.45);
      } else {
        ctx.font        = '7px monospace';
        ctx.globalAlpha = logAlpha;
      }
      ctx.fillText(line, 4 + xNoise, startY + i * LH);
    });

    ctx.restore();
  }

  // ── HAND / MOTION TRACKING DOTS (when hands are visible) ──────────────────
  // Motion-diff grid approximates hand/finger positions:
  //   yellow dots = detected motion cells (finger positions)
  //   green dots  = top-N highest-delta cells (fingertips)
  {
    if (!isCapture && video.readyState >= 2) {
      const MGW = 64, MGH = 48;   // high-res motion grid — 5×5px per cell at 320×240
      if (!s.motionCanvas || s.motionCanvas.width !== MGW) {
        s.motionCanvas = document.createElement('canvas');
        s.motionCanvas.width  = MGW;
        s.motionCanvas.height = MGH;
        s.motionCtx = s.motionCanvas.getContext('2d', { willReadFrequently: true });
        s.prevMotionData = null;
        s.trackedDots = [];  // temporally smoothed dot positions
      }
      const smctx = s.motionCtx;
      smctx.save();
      smctx.scale(-1, 1);
      smctx.drawImage(video, 0, 0, -MGW, MGH);
      smctx.restore();
      const sCurr = smctx.getImageData(0, 0, MGW, MGH).data;
      if (s.prevMotionData && s.prevMotionData.length === sCurr.length) {
        const cells = [];
        const SNOISE = 18;   // slightly higher threshold to reduce noise chatter
        for (let row = 0; row < MGH; row++) {
          for (let col = 0; col < MGW; col++) {
            const bi = (row * MGW + col) * 4;
            const d = Math.abs(sCurr[bi]   - s.prevMotionData[bi])
                    + Math.abs(sCurr[bi+1] - s.prevMotionData[bi+1])
                    + Math.abs(sCurr[bi+2] - s.prevMotionData[bi+2]);
            if (d > SNOISE) {
              cells.push({ nx: col / MGW, ny: row / MGH, level: d });
            }
          }
        }
        cells.sort((a, b) => b.level - a.level);
        // Cap dots by buildProgress: 0 dots at bp=0, up to 30 dots at bp=1
        const maxDots = Math.round(bp * 30);
        const raw = cells.slice(0, maxDots);

        // Temporal smoothing: lerp tracked dots toward detected cells each frame
        if (!s.trackedDots) s.trackedDots = [];
        const LERP = 0.28;
        raw.forEach((cell, i) => {
          if (i < s.trackedDots.length) {
            s.trackedDots[i].nx += (cell.nx - s.trackedDots[i].nx) * LERP;
            s.trackedDots[i].ny += (cell.ny - s.trackedDots[i].ny) * LERP;
            s.trackedDots[i].level = cell.level;
          } else {
            s.trackedDots.push({ nx: cell.nx, ny: cell.ny, level: cell.level });
          }
        });
        if (s.trackedDots.length > raw.length) {
          s.trackedDots.length = raw.length;
        }
        s.motionCells = s.trackedDots;
      }
      s.prevMotionData = sCurr;
    }

    // Draw motion-tracking dots — gated by buildProgress so they appear gradually
    const dotFade = surveyAlpha(bp, 0.30, 0.20);  // fade in: 30% → 50% build
    if (s.motionCells && s.motionCells.length > 0 && dotFade > 0) {
      const now2 = performance.now();
      ctx.save();
      s.motionCells.forEach((cell, i) => {
        const cx = cell.nx * w;
        const cy = cell.ny * h;
        const r  = 1.2;

        const flickPhase = (now2 * 0.003 + i * 0.71) % 1;
        const flick = flickPhase < 0.08 ? 0.3 : 1.0;
        ctx.globalAlpha = dotFade * 0.70 * flick;  // kept calm
        ctx.fillStyle = i < 5 ? '#32FF46' : '#FFD71E';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  // ── DOT FLICKER — landmark dots randomly blink for instability ────────────
  if (!isCapture) {
    s.dotFlickerTimer += dt;
    if (s.dotFlickerTimer > 80 + Math.random() * 180) {
      s.dotFlickerTimer = 0;
      // Randomly toggle a subset of flicker slots
      for (let k = 0; k < s.dotFlickers.length; k++) {
        if (Math.random() < 0.18) s.dotFlickers[k] = s.dotFlickers[k] > 0.5 ? 0.15 : 1.0;
      }
    }
  }

  // ── OUTER FRAME BRACKETS — always on ──────────────────────────────────────
  {
    ctx.save();
    ctx.strokeStyle = `${G} 0.28)`;
    ctx.lineWidth   = 0.8;
    const arm = 18, x = 5, y = 5, fw = w - 10, fh = h - 10;
    ctx.beginPath();
    ctx.moveTo(x, y + arm);           ctx.lineTo(x, y);             ctx.lineTo(x + arm, y);
    ctx.moveTo(x + fw - arm, y);      ctx.lineTo(x + fw, y);        ctx.lineTo(x + fw, y + arm);
    ctx.moveTo(x + fw, y + fh - arm); ctx.lineTo(x + fw, y + fh);   ctx.lineTo(x + fw - arm, y + fh);
    ctx.moveTo(x + arm, y + fh);      ctx.lineTo(x, y + fh);        ctx.lineTo(x, y + fh - arm);
    ctx.stroke();
    ctx.restore();
  }

  // ── REC + TIMESTAMP — always on ───────────────────────────────────────────
  {
    const fS = Math.max(8, w * 0.026);
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
    ctx.save();
    ctx.font      = `${fS}px "VT323", "Courier New", monospace`;
    ctx.textAlign = 'left';
    const recA = 0.45 + bp * 0.50;
    ctx.fillStyle = `rgba(0, 210, 230, ${s.recBlink ? recA : recA * 0.15})`;
    ctx.fillText(`REC \u25CF  ${ts}`, 8, fS + 3);
    ctx.restore();
  }

  // ── FACE OVAL — head outline, first element to appear (bp > 0) ──────────
  // Smooth ellipse approximating the head shape, derived from MediaPipe
  // boundary landmarks. Appears at very low buildProgress so it registers
  // as the first stage of analysis — before brackets, before dots.
  if (bp > 0 && facePos.detected) {
    const ovalA = Math.min(1, bp / 0.18) * 0.50;
    let ovalCX, ovalCY, ovalRX, ovalRY;
    if (mpPts) {
      ovalCX = (mpPts.leftEar.x + mpPts.rightEar.x) * 0.5 + s.jitterX * 0.5;
      ovalCY = (mpPts.forehead.y + mpPts.chin.y) * 0.5  + s.jitterY * 0.5;
      ovalRX = Math.abs(mpPts.rightEar.x - mpPts.leftEar.x) * 0.5 * 1.14;
      ovalRY = (mpPts.chin.y - mpPts.forehead.y) * 0.5 * 1.10;
    } else {
      ovalCX = boxX + boxW * 0.5;
      ovalCY = boxY + boxH * 0.5;
      ovalRX = boxW * 0.50;
      ovalRY = boxH * 0.55;
    }
    ctx.save();
    ctx.globalAlpha = ovalA;
    ctx.strokeStyle = `${G} 1)`;
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.ellipse(ovalCX, ovalCY, ovalRX, ovalRY, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ── FACE_01 LABEL (bp > 0) ────────────────────────────────────────────────
  // No full dashed rect — corner brackets carry the frame; label anchors identity.
  if (bp > 0 && facePos.detected) {
    const a = Math.min(1, bp / 0.12);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle   = `${RD} 1)`;
    ctx.font        = `${Math.max(7, w * 0.024)}px "VT323", monospace`;
    ctx.textAlign   = 'left';
    ctx.fillText('FACE_01', boxX + 3, boxY - 4);
    ctx.restore();
  }

  // ── FACE CORNER BRACKETS (bp > 0.10) ──────────────────────────────────────
  if (bp > 0.10) {
    const a   = Math.min(1, (bp - 0.10) / 0.12);
    const arm = Math.max(10, boxW * 0.13);
    ctx.save();
    ctx.strokeStyle = `${RD} ${a * 0.75})`;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + arm);             ctx.lineTo(boxX, boxY);         ctx.lineTo(boxX + arm, boxY);
    ctx.moveTo(boxX + boxW - arm, boxY);      ctx.lineTo(boxX + boxW, boxY);  ctx.lineTo(boxX + boxW, boxY + arm);
    ctx.moveTo(boxX + boxW, boxY + boxH - arm); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW - arm, boxY + boxH);
    ctx.moveTo(boxX + arm, boxY + boxH);      ctx.lineTo(boxX, boxY + boxH);  ctx.lineTo(boxX, boxY + boxH - arm);
    ctx.stroke();
    ctx.restore();
  }

  // ── LEVEL BARS (approx detection only: accurate Y, not precise XY) ─────────
  if (bp > 0.28 && facePos.skinBounds && !facePos.landmarks && !mpLandmarks) {
    const sb    = facePos.skinBounds;
    const sMinY = sb.minY * h;
    const sMaxY = sb.maxY * h;
    const sH    = sMaxY - sMinY;
    const eyeY  = sMinY + sH * 0.08;
    const noseY = sMinY + sH * 0.52;
    const mthY  = sMinY + sH * 0.82;
    const a     = Math.min(1, (bp - 0.28) / 0.16);

    const levels = [
      { y: eyeY,  w: boxW * 0.90, label: 'EYE_LVL'  },
      { y: noseY, w: boxW * 0.60, label: 'NOSE_LVL' },
      { y: mthY,  w: boxW * 0.72, label: 'MTH_LVL'  },
    ];

    levels.forEach(lv => {
      const lx = pts.faceCX - lv.w * 0.5;
      ctx.save();
      ctx.globalAlpha = a * 0.70;
      ctx.strokeStyle = `${G} 1)`;
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(lx, lv.y); ctx.lineTo(lx + lv.w, lv.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // tick marks at ends
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, lv.y - 5);           ctx.lineTo(lx, lv.y + 5);
      ctx.moveTo(lx + lv.w, lv.y - 5);   ctx.lineTo(lx + lv.w, lv.y + 5);
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── EYE MARKERS — tight scientific dots, short crosshairs (with flicker) ──
  if (bp > 0.28 && (facePos.landmarks || mpLandmarks)) {
    const baseA = Math.min(1, (bp - 0.28) / 0.18) * 0.80;
    const dotR  = Math.max(1.5, w * 0.006);
    const arm   = Math.max(5, boxW * 0.040);

    [pts.leftEye, pts.rightEye].forEach((eye, ei) => {
      const flicker = s.dotFlickers[ei] ?? 1.0;
      ctx.save();
      ctx.globalAlpha = baseA * flicker;
      ctx.fillStyle   = `${GH} 1)`;
      ctx.strokeStyle = `${GH} 1)`;
      ctx.lineWidth   = 1.5;
      ctx.beginPath(); ctx.arc(eye.x, eye.y, dotR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(eye.x - arm, eye.y); ctx.lineTo(eye.x + arm, eye.y);
      ctx.moveTo(eye.x, eye.y - arm * 0.60); ctx.lineTo(eye.x, eye.y + arm * 0.60);
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── NOSE DOT (bp > 0.40, with flicker) ───────────────────────────────────
  if (bp > 0.40 && facePos.detected) {
    const baseA  = Math.min(1, (bp - 0.40) / 0.14) * 0.72;
    const flicker = s.dotFlickers[2] ?? 1.0;
    const r = Math.max(1.2, w * 0.007);
    ctx.save();
    ctx.globalAlpha = baseA * flicker;
    ctx.fillStyle   = `${GH} 1)`;
    ctx.beginPath(); ctx.arc(pts.nose.x, pts.nose.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ── MOUTH CORNERS (bp > 0.50, with flicker) ──────────────────────────────
  if (bp > 0.50 && facePos.detected) {
    const baseA  = Math.min(1, (bp - 0.50) / 0.14) * 0.68;
    const flicker = s.dotFlickers[3] ?? 1.0;
    const r2 = Math.max(1.0, w * 0.005);
    const mL = mpPts ? mpPts.mouthLeft  : { x: pts.mouth.x - boxW * 0.14, y: pts.mouth.y };
    const mR = mpPts ? mpPts.mouthRight : { x: pts.mouth.x + boxW * 0.14, y: pts.mouth.y };
    ctx.save();
    ctx.globalAlpha = baseA * flicker;
    ctx.fillStyle   = `${GH} 1)`;
    [mL, mR].forEach(pt => {
      ctx.beginPath(); ctx.arc(pt.x, pt.y, r2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // ── TRIANGULATION — sparse face structure lines (bp > 0.55, MediaPipe) ────
  if (bp > 0.55 && mpPts) {
    const a = Math.min(1, (bp - 0.55) / 0.22) * 0.36;  // slightly more restrained
    const mL = mpPts.mouthLeft;
    const mR = mpPts.mouthRight;

    // Structural edges — selected for face topology, not decoration
    const edges = [
      [mpPts.leftEye,  mpPts.rightEye],   // eye baseline
      [mpPts.leftEye,  mpPts.nose],        // left orbital
      [mpPts.rightEye, mpPts.nose],        // right orbital
      [mpPts.nose,     mL],                // left nasolabial
      [mpPts.nose,     mR],                // right nasolabial
      [mL,             mR],                // mouth width
      [mpPts.leftEye,  mpPts.leftEar],    // left face plane
      [mpPts.rightEye, mpPts.rightEar],   // right face plane
      [mpPts.leftEar,  mpPts.chin],       // left jaw
      [mpPts.rightEar, mpPts.chin],       // right jaw
      [mpPts.nose,     mpPts.chin],       // vertical axis
    ];
    ctx.save();
    ctx.strokeStyle = `rgba(0, 210, 230, ${a * 0.55})`;
    ctx.lineWidth   = 0.45;  // hairline
    ctx.beginPath();
    edges.forEach(([pa, pb]) => { ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); });
    ctx.stroke();

    // Vertex dots — yellow feature points
    const verts = [
      mpPts.leftEye, mpPts.rightEye, mpPts.nose,
      mL, mR, mpPts.leftEar, mpPts.rightEar, mpPts.chin,
    ];
    ctx.fillStyle = `rgba(255, 215, 0, ${a * 1.3})`;
    verts.forEach(pt => {
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2); ctx.fill(); // small vertex dots
    });
    ctx.restore();
  }

  // ── PERIPHERAL STATUS — tiny log-format lines adjacent to face box ───────
  // These look like the log stream but positioned relative to the detected face,
  // so they feel like annotations appearing around the person over time.
  if (bp > 0.35 && facePos.detected) {
    const a = Math.min(1, (bp - 0.35) / 0.25) * 0.38;  // lighter peripheral annotations
    ctx.save();
    ctx.font        = '6px monospace';
    ctx.globalAlpha = a;

    // Adjacent to face box right edge
    const rightX   = Math.min(w - 60, boxX + boxW + 4);
    const midFaceY = boxY + boxH * 0.28;

    ctx.fillStyle = `${G} 1)`;
    ctx.textAlign = 'left';
    const adjLines = [
      `LOCK:${facePos.detected ? 'Y' : 'N'}`,
      `CONF:${s.confidence}%`,
      `W:${Math.round(boxW)}`,
      `H:${Math.round(boxH)}`,
      `CX:${Math.round(boxX + boxW * 0.5)}`,
      `CY:${Math.round(boxY + boxH * 0.5)}`,
    ];
    adjLines.forEach((ln, i) => {
      // Only draw if there's room to the right of the box
      if (rightX + 52 < w) ctx.fillText(ln, rightX, midFaceY + i * 9);
    });

    // Left of face box — yellow biometric tags
    const leftX = Math.max(2, boxX - 56);
    ctx.fillStyle = `${GH} 1)`;
    ctx.textAlign = 'left';
    if (bp > 0.55) {
      const bioLines = [
        `ID:${Math.floor(boxX + boxY).toString(16).toUpperCase().padStart(4,'0')}`,
        `IRIS:OK`,
        `NOSE:OK`,
        `MOUTH:OK`,
      ];
      bioLines.forEach((ln, i) => {
        if (leftX > 0) ctx.fillText(ln, leftX, midFaceY + i * 9);
      });
    }

    ctx.restore();
  }

  // ── SCAN LINE ──────────────────────────────────────────────────────────────
  {
    const sg = ctx.createLinearGradient(0, s.scanY - 14, 0, s.scanY + 8);
    sg.addColorStop(0,   'rgba(0, 210, 230, 0)');
    sg.addColorStop(0.5, `rgba(0, 210, 230, ${0.09 + bp * 0.07})`);
    sg.addColorStop(1,   'rgba(0, 210, 230, 0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, s.scanY - 14, w, 22);
  }

  // ── GLITCH BAR ─────────────────────────────────────────────────────────────
  if (s.glitchActive) {
    const gx   = Math.round(s.glitchX * w);
    const fade = s.glitchElapsed < 40
      ? s.glitchElapsed / 40
      : s.glitchElapsed > s.glitchDuration - 60
        ? (s.glitchDuration - s.glitchElapsed) / 60
        : 1;
    ctx.save();
    ctx.globalAlpha             = fade * 0.92;
    ctx.globalCompositeOperation = 'exclusion';
    ctx.fillStyle = 'rgb(0, 200, 220)';  // cyan glitch bar
    ctx.fillRect(gx, 0, s.glitchW, h);
    ctx.restore();
  }

  // Additional detected faces — lightweight tracking overlays
  facesArray.slice(1).forEach((extraFace, idx) => {
    if (!extraFace.detected) return;
    const label = `FACE_0${idx + 2}`;
    let exBoxW, exBoxH, exBoxX, exBoxY;
    const exLms = extraFace.mpLandmarks ? getMPKeyPointsForFace(extraFace.mpLandmarks, w, h) : null;
    if (exLms) {
      const fMinX = Math.min(exLms.leftEar.x, exLms.rightEar.x);
      const fMaxX = Math.max(exLms.leftEar.x, exLms.rightEar.x);
      exBoxW = (fMaxX - fMinX) * 1.06;
      exBoxH = (exLms.chin.y - exLms.forehead.y) * 1.04;
      exBoxX = (fMinX + fMaxX) * 0.5 - exBoxW * 0.5;
      exBoxY = exLms.forehead.y - exBoxH * 0.02;
    } else {
      exBoxW = extraFace.w * w * 1.28;
      exBoxH = extraFace.h * h * 1.22;
      exBoxX = extraFace.cx * w - exBoxW * 0.5;
      exBoxY = extraFace.cy * h - exBoxH * 0.50;
    }
    exBoxX = Math.max(2, Math.min(w - exBoxW - 2, exBoxX));
    exBoxY = Math.max(2, Math.min(h - exBoxH - 2, exBoxY));
    const exBP = s.buildProgress;
    // Oval
    ctx.save();
    ctx.globalAlpha = Math.min(0.60, exBP * 1.2);
    ctx.strokeStyle = `${G} 1)`;
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.ellipse(exBoxX + exBoxW*0.5, exBoxY + exBoxH*0.5, exBoxW*0.50, exBoxH*0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // Corner brackets
    const exArm = Math.max(10, exBoxW * 0.13);
    ctx.save();
    ctx.globalAlpha = Math.min(0.55, (exBP - 0.10) / 0.12);
    ctx.strokeStyle = `${RD} 0.70)`;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(exBoxX, exBoxY + exArm);      ctx.lineTo(exBoxX, exBoxY);             ctx.lineTo(exBoxX + exArm, exBoxY);
    ctx.moveTo(exBoxX + exBoxW - exArm, exBoxY); ctx.lineTo(exBoxX + exBoxW, exBoxY); ctx.lineTo(exBoxX + exBoxW, exBoxY + exArm);
    ctx.moveTo(exBoxX + exBoxW, exBoxY + exBoxH - exArm); ctx.lineTo(exBoxX + exBoxW, exBoxY + exBoxH); ctx.lineTo(exBoxX + exBoxW - exArm, exBoxY + exBoxH);
    ctx.moveTo(exBoxX + exArm, exBoxY + exBoxH); ctx.lineTo(exBoxX, exBoxY + exBoxH); ctx.lineTo(exBoxX, exBoxY + exBoxH - exArm);
    ctx.stroke();
    ctx.restore();
    // Label
    ctx.save();
    ctx.globalAlpha = Math.min(0.80, exBP / 0.12);
    ctx.fillStyle   = `${RD} 1)`;
    ctx.font        = `${Math.max(9, w * 0.028)}px "VT323", monospace`;
    ctx.textAlign   = 'left';
    ctx.fillText(label, exBoxX + 3, exBoxY - 4);
    ctx.restore();
  });
}


/* ============================================================
  11. FILTER: ILOVEYOU
   Floating hearts with a soft glow pass. ✦ sparkle particles
   that fade in and out. Scrolling ILOVEYOU banners top AND
   bottom — running in opposite directions like a ticker tape
   wrapping around you. Hearts cluster near the detected face.
   Named after the 2000 email virus. This one just gives
   you something to feel.
============================================================ */

function initILoveYouAnim(w, h) {
  anim.iloveyou.bannerX    = 0;
  anim.iloveyou.bannerSubX = 0;
  anim.iloveyou.t          = 0;
}

/**
 * Tile scrolling text across a horizontal strip.
 * x0: current scroll offset. textW: measured text width.
 */
function drawScrollingText(ctx, text, textW, y, x0) {
  // normalise so we always start at or before x=0
  let startX = x0 % textW;
  if (startX > 0) startX -= textW;
  for (let cx = startX; cx < ctx.canvas.width + textW; cx += textW) {
    ctx.fillText(text, cx, y);
  }
}

function drawILoveYou(ctx, w, h, isCapture, dt) {
  const il = anim.iloveyou;
  if (!isCapture) il.t += dt;

  // ── BACKGROUND LAYER — pink effects sit behind the face ───────────────────
  // Pink fill + halftone + edge gradient all drawn FIRST, then face on top.
  ctx.fillStyle = 'rgba(200, 0, 100, 0.22)';
  ctx.fillRect(0, 0, w, h);

  // Halftone dot pattern — hot pink, offset rows (graphic print feel)
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle   = '#FF1493';
  const dg = 10;
  for (let dyi = 0; dyi < h; dyi += dg) {
    const off = (Math.floor(dyi / dg) % 2) * (dg / 2);
    for (let dxi = off; dxi < w; dxi += dg) {
      ctx.beginPath(); ctx.arc(dxi, dyi, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();

  // Subtle edge gradient (behind face — just warms the border)
  const edgeVig = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.22, w * 0.5, h * 0.5, h * 0.72);
  edgeVig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  edgeVig.addColorStop(1, 'rgba(80, 0, 40, 0.28)');
  ctx.fillStyle = edgeVig;
  ctx.fillRect(0, 0, w, h);

  // ── FACE — drawn on top of the pink background ────────────────────────────
  ctx.save();
  ctx.filter = 'saturate(1.45) brightness(1.06) contrast(1.04)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // ── SCROLL OFFSETS ─────────────────────────────────────────────────────────
  if (!isCapture) {
    il.bannerX    -= 1.40;   // bottom main / top sub: scroll left
    il.bannerSubX += 0.90;   // top main / bottom sub: scroll right
  }

  // ── BANNERS ────────────────────────────────────────────────────────────────
  const bannerH    = Math.round(h * 0.19);   // 19% — readable height
  const bigFSize   = Math.max(18, w * 0.072);
  const smallFSize = Math.max(11, w * 0.044);
  const accentH    = 4;   // coloured accent stripe at banner edge

  const mainText = '\u00A0ILOVEYOU \u2665 ILOVEYOU \u2665 ILOVEYOU \u2665 ';
  const subText  = '\u00A0\u2756 I MISS YOU \u2756 I MISS YOU \u2756 I MISS YOU \u2756 ';

  ctx.font = `${bigFSize}px "VT323", monospace`;
  const mainW = ctx.measureText(mainText).width;
  ctx.font = `${smallFSize}px "VT323", monospace`;
  const subW = ctx.measureText(subText).width;

  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'left';

  // ─── BOTTOM BANNER ──────────────────────────────────────────────────────
  const botY = h - bannerH;
  ctx.fillStyle = '#BB0060';
  ctx.fillRect(0, botY, w, bannerH);
  // Accent stripes at top edge
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, botY, w, accentH);
  ctx.fillStyle = '#FFE600';
  ctx.fillRect(0, botY + accentH, w, accentH - 1);

  // Main line (large, cream) — scrolls left
  ctx.font      = `${bigFSize}px "VT323", monospace`;
  ctx.fillStyle = '#FFE8F2';
  drawScrollingText(ctx, mainText, mainW, botY + bannerH * 0.38, il.bannerX);

  // Sub line (small, gold) — scrolls right (opposite)
  ctx.font      = `${smallFSize}px "VT323", monospace`;
  ctx.fillStyle = '#FFE600';
  drawScrollingText(ctx, subText, subW, botY + bannerH * 0.76, -il.bannerSubX);

  // ─── TOP BANNER ─────────────────────────────────────────────────────────
  ctx.fillStyle = '#BB0060';
  ctx.fillRect(0, 0, w, bannerH);
  // Accent stripes at bottom edge
  ctx.fillStyle = '#FFE600';
  ctx.fillRect(0, bannerH - accentH * 2, w, accentH - 1);
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, bannerH - accentH, w, accentH);

  // Main line (large, yellow) — scrolls right
  ctx.font      = `${bigFSize}px "VT323", monospace`;
  ctx.fillStyle = '#FFE600';
  drawScrollingText(ctx, mainText, mainW, bannerH * 0.38, -il.bannerX);

  // Sub line (small, cream) — scrolls left
  ctx.font      = `${smallFSize}px "VT323", monospace`;
  ctx.fillStyle = '#FFE8F2';
  drawScrollingText(ctx, subText, subW, bannerH * 0.76, il.bannerSubX);

  ctx.textBaseline = 'alphabetic';
  ctx.textAlign    = 'left';

  // ── HEART GESTURE DETECTION + OVERLAY ────────────────────────────────────
  // Detects bilateral hand motion in the upper frame (both hands raised/close
  // together). When sustained for >500ms, overlays a hot pink heart.
  // Approximation only — not true hand landmark tracking.
  if (!isCapture && video.readyState >= 2) {
    if (!il.motionCanvas) {
      il.motionCanvas = document.createElement('canvas');
      il.motionCanvas.width  = 24;
      il.motionCanvas.height = 18;
      il.motionCtx = il.motionCanvas.getContext('2d', { willReadFrequently: true });
    }
    const imctx = il.motionCtx;
    imctx.save(); imctx.scale(-1, 1); imctx.drawImage(video, 0, 0, -24, 18); imctx.restore();
    const iCurr = imctx.getImageData(0, 0, 24, 18).data;
    if (il.prevMotionData && il.prevMotionData.length === iCurr.length) {
      let leftD = 0, rightD = 0, upperD = 0;
      const iNorm = 24 * 18 * 3 * 255;
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 24; col++) {
          const bi = (row * 24 + col) * 4;
          const d = Math.abs(iCurr[bi]   - il.prevMotionData[bi])
                  + Math.abs(iCurr[bi+1] - il.prevMotionData[bi+1])
                  + Math.abs(iCurr[bi+2] - il.prevMotionData[bi+2]);
          if (col < 12) leftD  += d;  else rightD += d;
          if (row < 9)  upperD += d;
        }
      }
      const lr = leftD  / (iNorm * 0.5);
      const rr = rightD / (iNorm * 0.5);
      const ur = upperD / (iNorm * 0.5);
      il.leftRegionMotion  = il.leftRegionMotion  * 0.72 + lr * 0.28;
      il.rightRegionMotion = il.rightRegionMotion * 0.72 + rr * 0.28;
      il.upperRegionMotion = il.upperRegionMotion * 0.72 + ur * 0.28;

      // Gesture: both hands active + in upper frame + roughly symmetric
      const L = il.leftRegionMotion, R = il.rightRegionMotion;
      const bothActive = Math.min(L, R) > 0.010;
      const handsUp    = il.upperRegionMotion > 0.012;
      const symmetric  = (L + R) > 0 && Math.abs(L - R) / (L + R) < 0.70;
      if (bothActive && handsUp && symmetric) {
        il.heartTimer = Math.min(il.heartTimer + dt, 3000);
      } else {
        il.heartTimer = Math.max(0, il.heartTimer - dt * 1.8);
      }
    }
    il.prevMotionData = iCurr;
  }
  // Smooth display alpha
  const heartTarget  = il.heartTimer > 500 ? 0.90 : 0;
  il.heartAlpha = (il.heartAlpha || 0) * 0.92 + heartTarget * 0.08;

  // Draw hot pink heart when gesture detected
  if ((il.heartAlpha || 0) > 0.02) {
    const hcx = w * 0.50;
    const hcy = h * 0.52;   // roughly centre of visible area between banners
    const hs  = Math.min(w, h) * 0.28;  // heart half-size
    const ha  = il.heartAlpha;

    ctx.save();
    ctx.globalAlpha = ha;
    ctx.beginPath();
    ctx.moveTo(hcx, hcy + hs * 0.38);
    ctx.bezierCurveTo(hcx - hs * 1.05, hcy - hs * 0.10, hcx - hs * 1.05, hcy - hs * 0.85, hcx, hcy - hs * 0.48);
    ctx.bezierCurveTo(hcx + hs * 1.05, hcy - hs * 0.85, hcx + hs * 1.05, hcy - hs * 0.10, hcx, hcy + hs * 0.38);
    ctx.closePath();

    const hGrd = ctx.createRadialGradient(hcx, hcy - hs * 0.1, 0, hcx, hcy, hs * 1.3);
    hGrd.addColorStop(0,    'rgba(255, 140, 200, 1.0)');   // bright pink core
    hGrd.addColorStop(0.45, 'rgba(255,  20, 147, 1.0)');   // deep hot pink
    hGrd.addColorStop(1,    'rgba(180,   0,  90, 0.85)');  // dark edge
    ctx.fillStyle   = hGrd;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth   = Math.max(1.5, hs * 0.05);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}


/* ============================================================
  12a. FILTER: AURA
   Movement paints the image — warm colour trails follow motion.
============================================================ */

function initAuraAnim(w, h) {
  const tc = document.createElement('canvas');
  tc.width  = w;
  tc.height = h;
  anim.aura.trailCanvas = tc;
  anim.aura.trailCtx    = tc.getContext('2d');
  anim.aura.trailCtx.fillStyle = '#000';
  anim.aura.trailCtx.fillRect(0, 0, w, h);
  anim.aura.t = 0;
}

function drawAura(ctx, w, h, isCapture, dt) {
  const au = anim.aura;
  if (!isCapture) au.t += dt;

  // Re-init if canvas size changed — but NEVER during capture.
  // During capture the canvas is 640×480 while the trail is 320×240.
  // We scale the existing trail via drawImage(tc, 0, 0, w, h) so the
  // accumulated aura effect appears in the captured photo.
  if (!au.trailCanvas) {
    initAuraAnim(w, h);
  } else if (!isCapture && (au.trailCanvas.width !== w || au.trailCanvas.height !== h)) {
    initAuraAnim(w, h);
  }
  const tc  = au.trailCanvas;
  const tcx = au.trailCtx;

  if (!isCapture) {
    // ── MOTION DETECTION for Aura ─────────────────────────────────────────
    // Track moving hands/objects → stamp pink-white energy at motion zones.
    if (video.readyState >= 2) {
      if (!au.motionCanvas) {
        au.motionCanvas = document.createElement('canvas');
        au.motionCanvas.width  = 24;
        au.motionCanvas.height = 18;
        au.motionCtx = au.motionCanvas.getContext('2d', { willReadFrequently: true });
        au.motionLevel = 0;
        au.motionCentroidX = 0.5;
        au.motionCentroidY = 0.5;
      }
      const amctx = au.motionCtx;
      amctx.save();
      amctx.scale(-1, 1);
      amctx.drawImage(video, 0, 0, -24, 18);
      amctx.restore();
      const aCurr = amctx.getImageData(0, 0, 24, 18).data;
      if (au.prevMotionData && au.prevMotionData.length === aCurr.length) {
        const ANOISE = 20;
        let aTotalDelta = 0;
        const aHotPts = [];
        for (let row = 0; row < 18; row++) {
          for (let col = 0; col < 24; col++) {
            const bi = (row * 24 + col) * 4;
            const d = Math.abs(aCurr[bi]   - au.prevMotionData[bi])
                    + Math.abs(aCurr[bi+1] - au.prevMotionData[bi+1])
                    + Math.abs(aCurr[bi+2] - au.prevMotionData[bi+2]);
            aTotalDelta += d;
            if (d > ANOISE) aHotPts.push({ x: col / 24, y: row / 18, d });
          }
        }
        const rawLevel = Math.min(1, aTotalDelta / (24 * 18 * 3 * 255));
        au.motionLevel = au.motionLevel * 0.75 + rawLevel * 0.25;

        // Group hot pixels into spatial blobs (greedy nearest-neighbour, 0-1 space)
        aHotPts.sort((a, b) => b.d - a.d);
        const aBlobs = [];
        const aUsed  = new Uint8Array(aHotPts.length);
        for (let i = 0; i < aHotPts.length && aBlobs.length < 5; i++) {
          if (aUsed[i]) continue;
          const p = aHotPts[i];
          let bx = p.x * p.d, by = p.y * p.d, bw = p.d;
          aUsed[i] = 1;
          for (let j = i + 1; j < aHotPts.length; j++) {
            if (aUsed[j]) continue;
            const q = aHotPts[j];
            if (Math.hypot(p.x - q.x, p.y - q.y) < 0.20) {
              bx += q.x * q.d; by += q.y * q.d; bw += q.d; aUsed[j] = 1;
            }
          }
          aBlobs.push({ x: bx / bw, y: by / bw, strength: Math.min(1, bw / (20 * 255)) });
        }
        au.motionBlobs = aBlobs;
        // Update legacy centroid from blob centroids
        if (aBlobs.length > 0) {
          let cx = 0, cy = 0, cw = 0;
          for (const b of aBlobs) { cx += b.x * b.strength; cy += b.y * b.strength; cw += b.strength; }
          if (cw > 0) {
            au.motionCentroidX = au.motionCentroidX * 0.6 + (cx / cw) * 0.4;
            au.motionCentroidY = au.motionCentroidY * 0.6 + (cy / cw) * 0.4;
          }
        }
      }
      au.prevMotionData = aCurr;
    }

    // Fade trail — dark violet base keeps warm colour memory in the trail.
    tcx.globalAlpha = 0.028;  // slower fade = richer colour buildup
    tcx.fillStyle   = '#080312';   // very dark violet — not pure black
    tcx.fillRect(0, 0, w, h);
    tcx.globalAlpha = 1;

    // Stamp 1: hot pink-rose — the body's primary warm glow (pinker/warmer)
    tcx.save();
    tcx.globalAlpha = 0.62;
    tcx.filter = 'blur(6px) saturate(18) hue-rotate(338deg) brightness(1.8)';
    drawVideoCover(tcx, 0, 0, w, h);
    tcx.restore();

    // Stamp 2: rose-purple — dominant body colour, shifted warmer
    tcx.save();
    tcx.globalAlpha = 0.48;
    tcx.filter = 'blur(10px) saturate(18) hue-rotate(300deg) brightness(1.5)';
    drawVideoCover(tcx, 3, -3, w, h);
    tcx.restore();

    // Stamp 3: violet-indigo — wide silhouette layer
    tcx.save();
    tcx.globalAlpha = 0.42;
    tcx.filter = 'blur(16px) saturate(16) hue-rotate(256deg) brightness(1.3)';
    drawVideoCover(tcx, -4, 4, w, h);
    tcx.restore();

    // Stamp 4: rich cyan — cool counterpoint to the purple body
    tcx.save();
    tcx.globalAlpha = 0.36;
    tcx.filter = 'blur(12px) saturate(17) hue-rotate(186deg) brightness(1.6)';
    drawVideoCover(tcx, -3, 5, w, h);
    tcx.restore();

    // Stamp 5: wider deep cyan — second cyan ring, extends further
    tcx.save();
    tcx.globalAlpha = 0.28;
    tcx.filter = 'blur(20px) saturate(16) hue-rotate(198deg) brightness(1.8)';
    drawVideoCover(tcx, 2, -2, w, h);
    tcx.restore();

    // Stamp 6: warm amber-gold edge — brighter outer warmth
    tcx.save();
    tcx.globalAlpha = 0.24;
    tcx.filter = 'blur(20px) saturate(11) hue-rotate(30deg) brightness(2.2)';
    drawVideoCover(tcx, -6, 6, w, h);
    tcx.restore();

    // Stamp 7: warm rose — replaces forest green, adds warmth at outer ring
    tcx.save();
    tcx.globalAlpha = 0.14;
    tcx.filter = 'blur(18px) saturate(10) hue-rotate(350deg) brightness(1.6)';
    drawVideoCover(tcx, 6, -6, w, h);
    tcx.restore();

    // Stamp 8: MOTION ENERGY — per-blob pink-white flares that follow hand/object shape.
    // Each motion blob gets its own smaller flare, so the energy follows the real
    // gesture region rather than a single smeared centroid.
    if (au.motionLevel > 0.022 && au.motionBlobs && au.motionBlobs.length > 0) {
      for (const blob of au.motionBlobs) {
        if (blob.strength < 0.022) continue;
        const bx    = (1 - blob.x) * w;   // mirror X to match display
        const by    = blob.y * h;
        const mLvl  = Math.min(1, blob.strength * 12.0);
        // Radius per blob — large, intentional bloom on strong motion
        const rFlare = Math.max(18, Math.min(w * 0.34, w * 0.16 * (0.5 + mLvl * 1.5)));

        const flare = tcx.createRadialGradient(bx, by, 0, bx, by, rFlare);
        flare.addColorStop(0,    `rgba(255, 225, 245, ${mLvl * 0.88})`);  // warm pink-white core
        flare.addColorStop(0.18, `rgba(255, 140, 220, ${mLvl * 0.72})`);  // hot pink
        flare.addColorStop(0.42, `rgba(220,  60, 200, ${mLvl * 0.40})`);  // vivid magenta
        flare.addColorStop(0.70, `rgba(160,  10, 140, ${mLvl * 0.15})`);  // deep magenta fade
        flare.addColorStop(1,    'rgba(0, 0, 0, 0)');

        tcx.save();
        tcx.globalAlpha              = mLvl * 0.68;
        tcx.globalCompositeOperation = 'screen';
        tcx.fillStyle = flare;
        tcx.fillRect(bx - rFlare, by - rFlare, rFlare * 2, rFlare * 2);
        tcx.restore();
      }
    }
  }

  // Base: heavily desaturated, high contrast — makes aura colours pop against dark flesh tones
  ctx.save();
  ctx.filter = 'saturate(0.30) brightness(0.60) contrast(1.55)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // Deep hot pink in shadows — multiply blend pushes dark areas toward magenta
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = 'rgba(220, 0, 110, 1)';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Trail composite — screen blend for luminous glow over desaturated base
  ctx.save();
  ctx.globalAlpha              = 0.95;
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(tc, 0, 0, w, h);
  ctx.restore();

  // ── FACE RADIANCE PULSE — soft breathing glow anchored to face ───────────
  // Replaces the heart shape. A smooth radial gradient that breathes and
  // tracks the face. No hard edges — pure atmospheric screen-blend energy.
  {
    if (!au.pulseT) au.pulseT = 0;
    if (!isCapture) au.pulseT += dt;
    const breathe = 0.72 + 0.28 * Math.sin(au.pulseT * 0.00090);
    const breathe2 = 0.60 + 0.40 * Math.sin(au.pulseT * 0.00055 + 1.3);  // slower second wave
    const fx = (facePos.detected ? facePos.cx : 0.50) * w;
    const fy = (facePos.detected ? facePos.cy : 0.42) * h;
    const fR = Math.min(w, h) * (0.30 + 0.08 * breathe);
    const pulseGrd = ctx.createRadialGradient(fx, fy, 0, fx, fy, fR);
    pulseGrd.addColorStop(0,    `rgba(255, 210, 235, ${0.28 * breathe})`);   // warm pink at centre
    pulseGrd.addColorStop(0.12, `rgba(255, 160, 215, ${0.22 * breathe})`);   // rose
    pulseGrd.addColorStop(0.28, `rgba(220, 100, 255, ${0.18 * breathe})`);   // violet
    pulseGrd.addColorStop(0.45, `rgba(160,  60, 220, ${0.13 * breathe2})`);  // deep violet
    pulseGrd.addColorStop(0.65, `rgba( 90,  30, 160, ${0.07 * breathe2})`);  // indigo
    pulseGrd.addColorStop(0.82, `rgba( 40,  10,  90, ${0.03 * breathe2})`);  // fade
    pulseGrd.addColorStop(1,    'rgba(0, 0, 0, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = pulseGrd;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // Centre clarity: softly overlay the live video at the face centre so the
  // person glows from within rather than being buried by the trail wash.
  {
    const fx = (facePos.detected ? facePos.cx : 0.50) * w;
    const fy = (facePos.detected ? facePos.cy : 0.46) * h;
    const r  = Math.min(w, h) * 0.34;
    const faceGrd = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
    faceGrd.addColorStop(0,    'rgba(0,0,0,1)');    // fully opaque at centre
    faceGrd.addColorStop(0.25, 'rgba(0,0,0,0.85)');
    faceGrd.addColorStop(0.48, 'rgba(0,0,0,0.55)');
    faceGrd.addColorStop(0.68, 'rgba(0,0,0,0.22)');
    faceGrd.addColorStop(0.85, 'rgba(0,0,0,0.06)');
    faceGrd.addColorStop(1,    'rgba(0,0,0,0)');
    // Use an offscreen canvas to alpha-mask the video to a radial shape
    if (!au.centreCanvas) {
      au.centreCanvas = document.createElement('canvas');
      au.centreCtx    = au.centreCanvas.getContext('2d');
    }
    const cc = au.centreCanvas;
    const cx2 = au.centreCtx;
    cc.width = w; cc.height = h;
    cx2.clearRect(0, 0, w, h);
    cx2.save();
    cx2.filter = 'saturate(0.90) brightness(1.10)';
    drawVideoCover(cx2, 0, 0, w, h);
    cx2.restore();
    // Mask: keep only the centre disc
    cx2.globalCompositeOperation = 'destination-in';
    cx2.fillStyle = faceGrd;
    cx2.fillRect(0, 0, w, h);
    cx2.globalCompositeOperation = 'source-over';
    // Composite the masked face over the trail at reduced opacity
    ctx.save();
    ctx.globalAlpha = 0.52;
    ctx.drawImage(cc, 0, 0, w, h);
    ctx.restore();
  }

  // Outer warm edge — replaces black vignette.
  // The edge glows warm yellow-orange, not dark. This removes the hard black border
  // and makes the outermost region feel like a warm sun halo beyond the purple body.
  const faceCX = (facePos.detected ? facePos.cx : 0.5) * w;
  const faceCY = (facePos.detected ? facePos.cy : 0.46) * h;
  const vig = ctx.createRadialGradient(faceCX, faceCY, h * 0.10, faceCX, faceCY, h * 0.88);
  vig.addColorStop(0,    'rgba(0, 0, 0, 0)');          // transparent at face centre
  vig.addColorStop(0.60, 'rgba(0, 0, 0, 0)');          // nothing through the mid zone
  vig.addColorStop(0.78, 'rgba(120, 60, 0, 0.12)');    // deep amber begins
  vig.addColorStop(0.90, 'rgba(200, 120, 10, 0.22)');  // warm gold
  vig.addColorStop(1,    'rgba(230, 160, 20, 0.30)');  // bright amber edge
  ctx.fillStyle = vig;
  ctx.globalCompositeOperation = 'screen';  // screen blend adds light, never darkens
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  // Soft movement wash — when strong motion, a brief painterly pale veil passes through
  // Feels like fabric brushing across, occasionally whitening/paling a region
  if (!isCapture && au.motionLevel > 0.04) {
    const washLvl = Math.min(1, (au.motionLevel - 0.04) / 0.18);
    const washX   = (1 - au.motionCentroidX) * w;
    const washY   = au.motionCentroidY * h;
    const washR   = Math.max(w * 0.20, Math.min(w * 0.55, w * 0.30 * (1 + washLvl)));
    const washGrd = ctx.createRadialGradient(washX, washY, 0, washX, washY, washR);
    const washAlpha = washLvl * 0.22;
    washGrd.addColorStop(0,    `rgba(255, 248, 255, ${washAlpha})`);
    washGrd.addColorStop(0.35, `rgba(220, 200, 255, ${washAlpha * 0.65})`);
    washGrd.addColorStop(0.70, `rgba(180, 140, 220, ${washAlpha * 0.28})`);
    washGrd.addColorStop(1,    'rgba(120, 80, 180, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = washGrd;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}


/* ============================================================
  12b. FILTER: 3RD EYE
   A devotional glow between the brows. Simple, pulsing light.
============================================================ */

// Helper: draw the orb at a specific position.
// Called for primary face and each extra detected face.
function draw3rdEyeOrb(ctx, w, h, gx, gy, faceH, pulse, pulse2) {
  const rOuter = Math.max(w * 0.52, 120) * pulse;   // bigger — reaches well past the face
  const rMid   = Math.max(w * 0.18, 42) * pulse;
  const rInner = Math.max(w * 0.006, 1.8) * pulse2;

  // Outer corona — radial base. Inner stops are kept lower so the face stays
  // readable; colour and opacity build up as the glow extends outward.
  ctx.save();
  const g1 = ctx.createRadialGradient(gx, gy, rInner * 3, gx, gy, rOuter);
  g1.addColorStop(0,    `rgba(255, 255, 255, ${0.30 * pulse})`);   // bright white near bindi
  g1.addColorStop(0.04, `rgba(255, 252, 100, ${0.32 * pulse})`);   // bright yellow
  g1.addColorStop(0.08, `rgba(255, 244, 0,   ${0.34 * pulse})`);   // pure yellow
  g1.addColorStop(0.12, `rgba(255, 140, 80,  ${0.38 * pulse})`);   // yellow → pink blend
  g1.addColorStop(0.16, `rgba(255, 20,  180, ${0.42 * pulse})`);   // hot pink builds
  g1.addColorStop(0.22, `rgba(200, 10,  220, ${0.44 * pulse})`);   // pink → purple blend
  g1.addColorStop(0.28, `rgba(160, 0,   255, ${0.46 * pulse})`);   // vivid purple peak
  g1.addColorStop(0.36, `rgba(80,  10,  240, ${0.38 * pulse})`);   // purple → violet blend
  g1.addColorStop(0.44, `rgba(50,  20,  220, ${0.28 * pulse})`);   // deep violet-blue
  g1.addColorStop(0.51, `rgba(30,  100, 238, ${0.26 * pulse})`);   // violet → cyan blend
  g1.addColorStop(0.58, `rgba(20,  200, 255, ${0.24 * pulse})`);   // rich cyan
  g1.addColorStop(0.61, `rgba(140, 200, 140, ${0.18 * pulse})`);   // cyan → orange blend
  g1.addColorStop(0.64, `rgba(255, 140, 20,  ${0.14 * pulse})`);   // orange warmth
  g1.addColorStop(0.68, `rgba(100, 180,  60, ${0.08 * pulse})`);   // orange → green blend
  g1.addColorStop(0.72, `rgba(0,   180, 100, ${0.06 * pulse})`);   // subtle green
  g1.addColorStop(0.77, `rgba(120, 220, 200, ${0.10 * pulse})`);   // green → white-cyan
  g1.addColorStop(0.82, `rgba(240, 255, 255, ${0.16 * pulse})`);   // white-cyan
  g1.addColorStop(0.88, `rgba(255, 255, 255, ${0.12 * pulse})`);   // white fade
  g1.addColorStop(0.94, `rgba(255, 255, 255, ${0.06 * pulse})`);   // soft white whisper
  g1.addColorStop(1.0,  'rgba(255, 255, 255, 0)');                  // transparent edge
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Sacred 8-point star — all 8 directions treated equally (N/NE/E/SE/S/SW/W/NW).
  // Cardinal rays (N/E/S/W) are slightly longer and wider; diagonal rays are a bit
  // shorter and narrower, giving the classic 8-point sacred geometry feel.
  // Each ray uses a gradient that starts WHITE at the source and shifts through
  // hot-pink → purple → transparent, matching the outer corona colour world.
  const rayDefs = [
    { angle: 0,                len: rOuter * 0.88, width: rOuter * 0.075 },  // N
    { angle: Math.PI * 0.25,   len: rOuter * 0.68, width: rOuter * 0.050 },  // NE
    { angle: Math.PI * 0.50,   len: rOuter * 0.88, width: rOuter * 0.075 },  // E
    { angle: Math.PI * 0.75,   len: rOuter * 0.68, width: rOuter * 0.050 },  // SE
    { angle: Math.PI,          len: rOuter * 0.88, width: rOuter * 0.075 },  // S
    { angle: Math.PI * 1.25,   len: rOuter * 0.68, width: rOuter * 0.050 },  // SW
    { angle: Math.PI * 1.50,   len: rOuter * 0.88, width: rOuter * 0.075 },  // W
    { angle: Math.PI * 1.75,   len: rOuter * 0.68, width: rOuter * 0.050 },  // NW
  ];
  rayDefs.forEach(({ angle, len, width }) => {
    const rLen = len * pulse;
    const gRay = ctx.createRadialGradient(gx, gy, rInner, gx, gy, rLen);
    gRay.addColorStop(0,    `rgba(255, 255, 240, ${0.48 * pulse})`);   // soft white near centre
    gRay.addColorStop(0.22, `rgba(255, 80,  200, ${0.32 * pulse})`);   // hot pink
    gRay.addColorStop(0.50, `rgba(140, 20,  255, ${0.16 * pulse})`);   // vivid purple
    gRay.addColorStop(0.75, `rgba(200, 240, 255, ${0.10 * pulse})`);   // white-cyan at outer
    gRay.addColorStop(1,    'rgba(255, 255, 255, 0)');                  // soft white edge
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(angle);
    ctx.translate(-gx, -gy);
    ctx.fillStyle = gRay;
    ctx.fillRect(gx - width, gy - rLen, width * 2, rLen * 1.05);
    ctx.restore();
  });

  // Upward flame extension
  const flameTopY = gy - rOuter * 0.30;
  const gFlame = ctx.createRadialGradient(gx, flameTopY, 0, gx, gy, rOuter * 0.65);
  gFlame.addColorStop(0,    `rgba(255, 255, 100, ${0.48 * pulse})`);  // brighter yellow-white
  gFlame.addColorStop(0.40, `rgba(255, 200,  0,  ${0.22 * pulse})`);  // yellow-orange
  gFlame.addColorStop(1,    'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gFlame;
  ctx.fillRect(0, 0, w, h);  // full rect — gradient fades to transparent, no hard edge

  // Inner halo — kept lighter so the face remains visible beneath
  const g1b = ctx.createRadialGradient(gx, gy, rInner * 2.5, gx, gy, rMid);
  g1b.addColorStop(0,    `rgba(255, 255, 230, ${0.45 * pulse})`);
  g1b.addColorStop(0.30, `rgba(255, 80,  200, ${0.32 * pulse})`);  // hot pink mid-ring
  g1b.addColorStop(0.65, `rgba(180, 20,  255, ${0.20 * pulse})`);  // purple outer
  g1b.addColorStop(1,    'rgba(80, 0, 180, 0)');
  ctx.fillStyle = g1b;
  ctx.fillRect(gx - rMid, gy - rMid, rMid * 2, rMid * 2);

  // Bindi core
  const coreR = rInner * 3.8;
  const g2 = ctx.createRadialGradient(gx, gy, 0, gx, gy, coreR);
  g2.addColorStop(0,    `rgba(255, 255, 255, ${0.98 * pulse2})`);
  g2.addColorStop(0.12, `rgba(255, 255, 140, ${0.96 * pulse2})`);  // yellow-white [new]
  g2.addColorStop(0.30, `rgba(255, 244, 0,   ${0.88 * pulse2})`);  // pure yellow [stronger]
  g2.addColorStop(0.58, `rgba(255, 180, 0,   ${0.55 * pulse2})`);  // amber
  g2.addColorStop(1,    'rgba(220, 80, 0, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(gx - coreR, gy - coreR, coreR * 2, coreR * 2);

  // Hairline crosshair
  ctx.save();
  ctx.globalAlpha = 0.40 * pulse2;
  ctx.strokeStyle = 'rgba(255, 255, 240, 0.80)';
  ctx.lineWidth   = 0.6;
  const cr = rInner * 3.5;
  ctx.beginPath();
  ctx.moveTo(gx - cr, gy); ctx.lineTo(gx + cr, gy);
  ctx.moveTo(gx, gy - cr); ctx.lineTo(gx, gy + cr);
  ctx.stroke();
  ctx.restore();
}

function draw3rdEye(ctx, w, h, isCapture, dt) {
  const te = anim.thirdEye;
  if (!isCapture) te.t += dt;

  // Clean video — slightly muted, more face visibility
  ctx.save();
  ctx.filter = 'saturate(0.88) brightness(0.96)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // Resolve third eye position — between the brows, not above the head.
  // Uses face data from best available tier; all positions are on the face itself.
  let gx = w * 0.50;
  let gy = h * 0.42;  // fallback: upper-centre of canvas, likely on a face
  let faceHVal = h * 0.40;

  const mpPts = getMPKeyPoints(w, h);
  const lm = facePos.landmarks;
  if (mpPts) {
    // Tier 0: MediaPipe — bindi position: just above the eye midpoint.
    const eyeMidY = (mpPts.leftEye.y + mpPts.rightEye.y) * 0.5;
    const faceH   = mpPts.chin.y - mpPts.forehead.y;
    faceHVal = faceH;
    gx = mpPts.thirdEye.x;
    gy = eyeMidY - faceH * 0.38;
  } else if (lm?.leftEye && lm?.rightEye) {
    gx = ((lm.leftEye.x + lm.rightEye.x) * 0.5) * w;
    gy = ((lm.leftEye.y + lm.rightEye.y) * 0.5) * h;
  } else if (facePos.skinBounds) {
    const sb = facePos.skinBounds;
    const sH = (sb.maxY - sb.minY) * h;
    faceHVal = sH;
    gx = (sb.minX + sb.maxX) * 0.5 * w;
    gy = sb.minY * h - sH * 0.04;
  } else if (facePos.detected) {
    gx = facePos.cx * w;
    gy = facePos.cy * h - facePos.h * h * 0.30;
  }

  // Gentle pulse — two overlapping sine waves for an organic, breathing feel
  const pulse  = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(te.t * 0.0006));   // very slow, deep
  const pulse2 = 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(te.t * 0.0010 + 1.2));

  // Draw primary orb
  draw3rdEyeOrb(ctx, w, h, gx, gy, faceHVal, pulse, pulse2);

  // Draw extra orbs for additional detected faces
  facesArray.slice(1).forEach(extraFace => {
    if (!extraFace.detected) return;
    let gx2, gy2, faceH2 = extraFace.h * h;
    const exLms = extraFace.mpLandmarks ? getMPKeyPointsForFace(extraFace.mpLandmarks, w, h) : null;
    if (exLms) {
      const eyeMidY2 = (exLms.leftEye.y + exLms.rightEye.y) * 0.5;
      faceH2 = exLms.chin.y - exLms.forehead.y;
      gx2 = exLms.thirdEye.x;
      gy2 = eyeMidY2 - faceH2 * 0.38;
    } else {
      gx2 = extraFace.cx * w;
      gy2 = extraFace.cy * h - extraFace.h * h * 0.30;
    }
    ctx.save();
    ctx.globalAlpha = 0.70;
    draw3rdEyeOrb(ctx, w, h, gx2, gy2, faceH2, pulse, pulse2);
    ctx.restore();
  });
}


/* ============================================================
  12c. FILTER: THERMAL
   False-colour heat map. Bright = hot (red/orange/yellow).
   Dark = cool (green). Vivid and readable on CRT.
============================================================ */

function drawThermal(ctx, w, h, isCapture, dt) {
  const TW = thermalCanvas.width;
  const TH = thermalCanvas.height;

  // Draw video into small thermal canvas (mirrored to match display)
  const vw = video.videoWidth  || 640;
  const vh = video.videoHeight || 480;
  const scale = Math.max(TW / vw, TH / vh);
  const sw = TW / scale, sh = TH / scale;
  const sx = (vw - sw) * 0.5, sy = (vh - sh) * 0.5;

  thermalCtx.save();
  thermalCtx.scale(-1, 1);
  thermalCtx.drawImage(video, sx, sy, sw, sh, -TW, 0, TW, TH);
  thermalCtx.restore();

  const imgData = thermalCtx.getImageData(0, 0, TW, TH);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    // Perceptual luminance
    const lum = (0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2]) / 255;
    let r, g, b;

    // 10-stop palette: black → cobalt → plum → cyan → green → yellow → orange → red → hot pink → white
    // Hot-pink band is now wider (0.65-0.90) and appears more prominently on bright areas.
    // All transitions use linear interpolation for smooth gradients.
    if (lum < 0.09) {
      // Deepest shadow → cobalt blue
      const t = lum / 0.09;
      r = Math.round(t * 15);
      g = Math.round(t * 15);
      b = Math.round(55 + t * 160);
    } else if (lum < 0.19) {
      // Cobalt → plum purple
      const t = (lum - 0.09) / 0.10;
      r = Math.round(15  + t * 100);
      g = Math.round(15  - t * 10);
      b = Math.round(215 - t * 90);
    } else if (lum < 0.30) {
      // Plum → cyan
      const t = (lum - 0.19) / 0.11;
      r = Math.round(115 - t * 115);
      g = Math.round(5   + t * 225);
      b = Math.round(125 + t * 125);
    } else if (lum < 0.44) {
      // Cyan → forest green
      const t = (lum - 0.30) / 0.14;
      r = Math.round(0   + t * 25);
      g = Math.round(230 - t * 75);
      b = Math.round(250 - t * 242);
    } else if (lum < 0.58) {
      // Forest green → yellow
      const t = (lum - 0.44) / 0.14;
      r = Math.round(25  + t * 230);
      g = Math.round(155 + t * 100);
      b = Math.round(8   - t * 8);
    } else if (lum < 0.66) {
      // Yellow → orange
      const t = (lum - 0.58) / 0.08;
      r = 255;
      g = Math.round(255 - t * 120);
      b = 0;
    } else if (lum < 0.72) {
      // Orange → red
      const t = (lum - 0.66) / 0.06;
      r = 255;
      g = Math.round(135 - t * 110);
      b = 0;
    } else if (lum < 0.88) {
      // Red → hot pink (wide band — most visible in practice)
      const t = (lum - 0.72) / 0.16;
      r = 255;
      g = Math.round(25  + t * 20);
      b = Math.round(t * 180);
    } else {
      // Hot pink → white (hottest highlight)
      const t = (lum - 0.88) / 0.12;
      r = 255;
      g = Math.round(45  + t * 210);
      b = Math.round(180 + t * 75);
    }

    d[i]   = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }

  thermalCtx.putImageData(imgData, 0, 0);

  // Motion detection for Thermal — agitates hot zones near moving regions
  const th = anim.thermal;
  if (!isCapture && video.readyState >= 2) {
    if (!th.motionCanvas) {
      th.motionCanvas = document.createElement('canvas');
      th.motionCanvas.width  = 24;
      th.motionCanvas.height = 18;
      th.motionCtx = th.motionCanvas.getContext('2d', { willReadFrequently: true });
    }
    const tmctx = th.motionCtx;
    tmctx.save(); tmctx.scale(-1, 1); tmctx.drawImage(video, 0, 0, -24, 18); tmctx.restore();
    const thCurr = tmctx.getImageData(0, 0, 24, 18).data;
    if (th.prevMotionData && th.prevMotionData.length === thCurr.length) {
      let thTotal = 0, thcx = 0, thcy = 0, thcw = 0;
      const THNOISE = 18;
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 24; col++) {
          const bi = (row * 24 + col) * 4;
          const d = Math.abs(thCurr[bi] - th.prevMotionData[bi])
                  + Math.abs(thCurr[bi+1] - th.prevMotionData[bi+1])
                  + Math.abs(thCurr[bi+2] - th.prevMotionData[bi+2]);
          thTotal += d;
          if (d > THNOISE) { thcx += col * d; thcy += row * d; thcw += d; }
        }
      }
      const rawTH = Math.min(1, thTotal / (24 * 18 * 3 * 255));
      th.motionLevel = th.motionLevel * 0.80 + rawTH * 0.20;
      if (thcw > 0) {
        th.motionCentroidX = thcx / thcw / 24;
        th.motionCentroidY = thcy / thcw / 18;
      }
    }
    th.prevMotionData = thCurr;
  }

  // Scale up to full canvas — cover-crop to match other filters (no stretch)
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const tScale = Math.max(w / TW, h / TH);
  const tdW    = Math.round(TW * tScale);
  const tdH    = Math.round(TH * tScale);
  const tdX    = Math.round((w - tdW) * 0.5);
  const tdY    = Math.round((h - tdH) * 0.5);
  ctx.drawImage(thermalCanvas, tdX, tdY, tdW, tdH);
  ctx.restore();

  // Motion-reactive thermal bloom — agitated hot zone at detected motion
  if (!isCapture && (th.motionLevel || 0) > 0.020) {
    const mLvl = Math.min(1, th.motionLevel * 4);
    const tmX  = (1 - th.motionCentroidX) * w;  // mirrored
    const tmY  = th.motionCentroidY * h;
    const rBloom = Math.max(20, Math.min(w * 0.28, w * 0.10 * (1 + mLvl)));
    const tBloom = ctx.createRadialGradient(tmX, tmY, 0, tmX, tmY, rBloom);
    tBloom.addColorStop(0,    `rgba(255, 255, 255, ${mLvl * 0.18})`);
    tBloom.addColorStop(0.25, `rgba(255, 200, 40,  ${mLvl * 0.14})`);
    tBloom.addColorStop(0.55, `rgba(255, 80,  0,   ${mLvl * 0.08})`);
    tBloom.addColorStop(1,    'rgba(0, 0, 0, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = tBloom;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // Light vignette — CRT lens falloff
  const vg = ctx.createRadialGradient(w*0.5, h*0.5, h*0.15, w*0.5, h*0.5, h*0.82);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}


/* ============================================================
  12d. FILTER: FALLING STARS
   Dreamy drifting sparkles layered over the face.
============================================================ */

// Star shapes: 1=5-point, 2=6-point, 3=8-point (no 4-point pixel stars)
// Palette: watercolour swatches — no orange. Bias toward warm yellows and whites.
const STAR_PALETTE = [
  '#FFFFFF',  // white                 — celestial
  '#F5F5DC',  // warm white/ivory      — soft
  '#FFE54C',  // bright yellow         — warm star
  '#FFD700',  // gold                  — classic star
  '#C832A0',  // vivid magenta/hot purple
  '#D040B8',  // hot pink-magenta
  '#9098C8',  // periwinkle/lavender
  '#88B8D8',  // pale sky blue
  '#60C088',  // mint green
  '#F0A098',  // pink/salmon
  '#FFFFFF',  // white again — triple weight for star-field feel
  '#FFE54C',  // yellow again — double weight
];
function newStar(w, h, scatter) {
  const roll = Math.random();
  return {
    x:           Math.random() * w,
    y:           scatter ? Math.random() * h : -6 - Math.random() * 30,
    vy:          0.08 + Math.random() * 0.58,   // wider speed range → stars fall at very different rates
    vx:          (Math.random() - 0.5) * 0.06,  // very slight lateral bias (corrected by sway)
    size:        0.6 + Math.pow(Math.random(), 1.5) * 3.8,   // smaller stars
    baseAlpha:   0.80 + Math.random() * 0.20,
    shape:       roll < 0.35 ? 1 : roll < 0.58 ? 2 : roll < 0.74 ? 3 : roll < 0.88 ? 5 : 6,  // no shape 4 (plus)
    color:       STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
    twinkle:     Math.random() < 0.60,
    twinkleT:    Math.random() * 4000,
    twinklePer:  1400 + Math.random() * 3000,   // slower, more atmospheric twinkle
    swayOffset:  Math.random() * Math.PI * 2,   // unique phase for per-star sway
    jitterFreq:  0.8 + Math.random() * 2.5,     // per-star vertical jitter frequency
    jitterPhase: Math.random() * Math.PI * 2,   // per-star jitter phase offset
  };
}

function initFallingStarsAnim(w, h) {
  anim.fallingStars.particles = [];
  anim.fallingStars._initW = w;
  anim.fallingStars._initH = h;
  // 380 stars scattered across the full canvas on first init
  for (let i = 0; i < 380; i++) {
    anim.fallingStars.particles.push(newStar(w, h, true));
  }
  anim.fallingStars.t = 0;
}

function drawFallingStars(ctx, w, h, isCapture, dt) {
  const fs = anim.fallingStars;
  if (!isCapture) fs.t += dt;

  // Proportional rescale when canvas size changes (enlarged overlay mode).
  // NEVER mutate positions during capture — instead apply a ctx scale transform
  // in the render passes so stars appear at the right proportional positions
  // without disturbing the live preview particles.
  const fsInitW = fs._initW || CANVAS_W;
  const fsInitH = fs._initH || CANVAS_H;
  const capScaleX = isCapture ? w / fsInitW : 1;
  const capScaleY = isCapture ? h / fsInitH : 1;
  if (!isCapture && (Math.abs(w - fsInitW) > 30 || Math.abs(h - fsInitH) > 30)) {
    const scaleX = w / fsInitW;
    const scaleY = h / fsInitH;
    fs.particles.forEach(p => { p.x *= scaleX; p.y *= scaleY; });
    fs._initW = w;
    fs._initH = h;
  }

  // Motion detection for Falling Stars
  if (!isCapture && video.readyState >= 2) {
    if (!fs.motionCanvas) {
      fs.motionCanvas = document.createElement('canvas');
      fs.motionCanvas.width  = 24;
      fs.motionCanvas.height = 18;
      fs.motionCtx = fs.motionCanvas.getContext('2d', { willReadFrequently: true });
    }
    const fmctx = fs.motionCtx;
    fmctx.save(); fmctx.scale(-1, 1); fmctx.drawImage(video, 0, 0, -24, 18); fmctx.restore();
    const fsCurr = fmctx.getImageData(0, 0, 24, 18).data;
    if (fs.prevMotionData && fs.prevMotionData.length === fsCurr.length) {
      let fsTotal = 0, fscx = 0, fscy = 0, fscw = 0;
      const FSNOISE = 22;
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 24; col++) {
          const bi = (row * 24 + col) * 4;
          const d = Math.abs(fsCurr[bi] - fs.prevMotionData[bi])
                  + Math.abs(fsCurr[bi+1] - fs.prevMotionData[bi+1])
                  + Math.abs(fsCurr[bi+2] - fs.prevMotionData[bi+2]);
          fsTotal += d;
          if (d > FSNOISE) { fscx += col * d; fscy += row * d; fscw += d; }
        }
      }
      const rawFS = Math.min(1, fsTotal / (24 * 18 * 3 * 255));
      fs.motionLevel = fs.motionLevel * 0.78 + rawFS * 0.22;
      if (fscw > 0) {
        fs.motionCentroidX = fscx / fscw / 24;
        fs.motionCentroidY = fscy / fscw / 18;
      }
    }
    fs.prevMotionData = fsCurr;
  }

  // Update particle positions — natural downward drift with gentle per-star sway
  if (!isCapture) {
    const dtN  = dt / 16;
    const tSec = fs.t / 1000;
    fs.particles.forEach((p, i) => {
      // Per-star sinusoidal sway — makes drift feel organic, not mechanical
      const sway = Math.sin(tSec * 0.35 + p.swayOffset) * 0.014;
      // Per-star vertical jitter — varies fall speed subtly so paths feel irregular
      const jitter = Math.sin(tSec * p.jitterFreq + p.jitterPhase) * 0.045;
      p.x += (p.vx + sway) * dtN;
      p.y += (p.vy + jitter) * dtN;
      if (p.twinkle) p.twinkleT += dt;
      // Respawn from top when star exits frame
      if (p.y > h + 12 || p.x < -40 || p.x > w + 40) {
        fs.particles[i] = newStar(w, h, false);
      }
    });

    // Motion reactivity — when hands move, burst extra fast stars at motion position
    if ((fs.motionLevel || 0) > 0.045) {
      const mLvl = Math.min(1, fs.motionLevel * 4.0);
      const burstCount = Math.round(mLvl * 3);
      const mx = (1 - (fs.motionCentroidX || 0.5)) * w;
      const my = (fs.motionCentroidY || 0.5) * h;
      for (let bi = 0; bi < burstCount; bi++) {
        const bs = newStar(w, h, false);
        bs.x  = mx + (Math.random() - 0.5) * w * 0.12;
        bs.y  = my + (Math.random() - 0.5) * h * 0.12;
        bs.vy = 0.30 + Math.random() * 1.2;   // faster on burst
        bs.size = 0.4 + Math.random() * 2.0;  // smaller burst stars
        // Replace a random existing star so particle count stays fixed
        const replaceIdx = Math.floor(Math.random() * fs.particles.length);
        fs.particles[replaceIdx] = bs;
      }
    }
  }

  // ── RENDER: stars behind face, seamless integration ─────────────────────
  //
  // Architecture: dark backdrop → stars → video at high opacity (covers
  // background stars in the face/body area) → foreground stars on top.
  //
  // The video at 0.90 opacity placed AFTER the stars naturally occludes
  // background stars wherever the webcam image is bright (face, skin, clothing).
  // Stars remain vivid at dark corners and edges (background behind subject).
  // Foreground pass renders ~14% of stars on top of everything (clearly in front).
  // No circular mask. No geometric cutout. No black circle.

  // Inline star-shape helper — used by both background and foreground passes
  const _drawStarShape = (p, alpha) => {
    // Glow halo for larger stars — soft radial bloom
    if (p.size > 3.5) {
      const gr = Math.max(1, p.size * 3.8);
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
      glow.addColorStop(0, p.color + 'cc');
      glow.addColorStop(0.45, p.color + '44');
      glow.addColorStop(1, p.color + '00');
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.7));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    const col = p.color;
    const drawStar = (pts, outerR, innerR) => {
      const verts = pts * 2;
      ctx.beginPath();
      for (let j = 0; j < verts; j++) {
        const ang = (j * Math.PI / pts) - Math.PI / 2;
        const rr  = j % 2 === 0 ? outerR : innerR;
        j === 0
          ? ctx.moveTo(p.x + rr * Math.cos(ang), p.y + rr * Math.sin(ang))
          : ctx.lineTo(p.x + rr * Math.cos(ang), p.y + rr * Math.sin(ang));
      }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    };
    if      (p.shape === 1) { drawStar(5, Math.max(1.8, p.size * 2.2), Math.max(0.8, p.size * 0.80)); }
    else if (p.shape === 2) { drawStar(6, Math.max(1.5, p.size * 2.0), Math.max(0.7, p.size * 0.65)); }
    else if (p.shape === 3) { drawStar(8, Math.max(1.4, p.size * 1.9), Math.max(0.6, p.size * 0.55)); }
    else if (p.shape === 4) {
      const armLen = p.size * 1.8;
      ctx.save();
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.8, p.size * 0.5);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.moveTo(p.x - armLen, p.y); ctx.lineTo(p.x + armLen, p.y);
      ctx.moveTo(p.x, p.y - armLen); ctx.lineTo(p.x, p.y + armLen);
      ctx.stroke(); ctx.restore();
    } else if (p.shape === 5) {
      const dr = p.size * 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - dr); ctx.lineTo(p.x + dr * 0.6, p.y);
      ctx.lineTo(p.x, p.y + dr); ctx.lineTo(p.x - dr * 0.6, p.y);
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * 0.60), 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    }
  };

  // ── Pre-compute face softening zone (no hard mask, just gentle alpha reduction)
  const faceSoftX = facePos.detected ? facePos.cx * w : w * 0.50;
  const faceSoftY = facePos.detected ? facePos.cy * h : h * 0.38;
  const faceSoftR = Math.min(w, h) * 0.30;  // soft zone radius

  // ── Twinkle helper ────────────────────────────────────────────────────────
  const _twinkleAlpha = (p, baseA) => {
    if (!p.twinkle) return baseA;
    const phase = (p.twinkleT % p.twinklePer) / p.twinklePer;
    return baseA * (0.35 + 0.65 * Math.abs(Math.sin(phase * Math.PI * 2.8)));
  };

  // ── 1. Dark space backdrop ────────────────────────────────────────────────
  ctx.fillStyle = '#03011A';
  ctx.fillRect(0, 0, w, h);

  // ── 2. Background stars (behind video) ───────────────────────────────────
  // Drawn before the video — video naturally covers them in the face/body area.
  // Stars near the face softly fade so they appear behind the user without a
  // geometric mask shape. The video occlusion handles the rest naturally.
  // During capture: ctx.scale(capScaleX, capScaleY) maps 320×240 particle
  // positions onto the 640×480 capture canvas without mutating live particles.
  ctx.save();
  if (capScaleX !== 1) ctx.scale(capScaleX, capScaleY);
  fs.particles.forEach((p, i) => {
    if (i % 6 === 0) return;  // reserve 1-in-6 for foreground
    let a = p.baseAlpha;
    // Soft face-area fade — no hard circle, just a smooth distance falloff
    const dxF = p.x - faceSoftX / capScaleX;
    const dyF = p.y - faceSoftY / capScaleY;
    const distN = Math.sqrt(dxF * dxF + dyF * dyF) / (faceSoftR / capScaleX);
    if (distN < 1.4) {
      a *= Math.min(1, 0.15 + 0.85 * ((distN - 0.3) / 1.1));
    }
    _drawStarShape(p, _twinkleAlpha(p, a));
  });
  ctx.restore();

  // ── 3. Video — covers background stars in face/body area ─────────────────
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.filter      = 'brightness(0.82) saturate(0.88) contrast(1.02)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // ── 4. Foreground stars — screen blend, softly through the video ─────────
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  if (capScaleX !== 1) ctx.scale(capScaleX, capScaleY);
  fs.particles.forEach((p, i) => {
    if (i % 6 !== 0) return;
    const a = _twinkleAlpha(p, p.baseAlpha * 0.90);
    _drawStarShape(p, a);
  });
  ctx.restore();
}


/* ============================================================
  12e. FILTER: GLITCH
   Intermittent signal distortion — horizontal strip offsets.
============================================================ */

function drawGlitch(ctx, w, h, isCapture, dt) {
  const gl = anim.glitch;
  if (!isCapture) {
    gl.t         += dt;
    gl.intensityT += dt;
  }

  // Motion detection for Glitch — adds extra strips near moving regions
  if (!isCapture && video.readyState >= 2) {
    if (!gl.motionCanvas) {
      gl.motionCanvas = document.createElement('canvas');
      gl.motionCanvas.width  = 24;
      gl.motionCanvas.height = 18;
      gl.motionCtx = gl.motionCanvas.getContext('2d', { willReadFrequently: true });
    }
    const gmctx = gl.motionCtx;
    gmctx.save(); gmctx.scale(-1, 1); gmctx.drawImage(video, 0, 0, -24, 18); gmctx.restore();
    const gCurr = gmctx.getImageData(0, 0, 24, 18).data;
    if (gl.prevMotionData && gl.prevMotionData.length === gCurr.length) {
      let gTotal = 0, gcx = 0, gcy = 0, gcw = 0;
      const GNOISE = 20;
      for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 24; col++) {
          const bi = (row * 24 + col) * 4;
          const d = Math.abs(gCurr[bi] - gl.prevMotionData[bi])
                  + Math.abs(gCurr[bi+1] - gl.prevMotionData[bi+1])
                  + Math.abs(gCurr[bi+2] - gl.prevMotionData[bi+2]);
          gTotal += d;
          if (d > GNOISE) { gcx += col * d; gcy += row * d; gcw += d; }
        }
      }
      const rawGL = Math.min(1, gTotal / (24 * 18 * 3 * 255));
      gl.motionLevel = gl.motionLevel * 0.75 + rawGL * 0.25;
      if (gcw > 0) {
        gl.motionCentroidX = gcx / gcw / 24;
        gl.motionCentroidY = gcy / gcw / 18;
      }
    }
    gl.prevMotionData = gCurr;
  }

  // Sinusoidal 3-minute intensity cycle: ebbs and flows, never fully off.
  // Ranges from ~0.08 (calm) to ~0.85 (active). Two overlapping cycles add organic variation.
  const cycle = Math.sin(gl.intensityT * Math.PI * 2 / 180000);
  const cycle2 = Math.sin(gl.intensityT * Math.PI * 2 / 113000 + 1.4);  // offset second wave
  const intensity = 0.08 + 0.62 * (0.5 + 0.5 * cycle) + 0.15 * (0.5 + 0.5 * cycle2);

  // ── LAYER 1: base video (slightly desaturated for VHS look) ─────────────
  ctx.save();
  ctx.filter = 'saturate(0.82) contrast(1.05) brightness(0.96)';
  drawVideoCover(ctx, 0, 0, w, h);
  ctx.restore();

  // ── LAYER 2: VHS chroma drift — luma/chroma separation ───────────────────
  // VHS records chroma (colour) at lower bandwidth than luma (brightness).
  // The chroma signal trails to the right and bleeds into adjacent lines.
  // Simulate with a horizontally-offset colour-only layer at low opacity.
  const chromaShift = Math.round(3 + intensity * 7);
  {
    // Chroma trail: saturated colour channel shifted right (delayed colour)
    ctx.save();
    ctx.globalAlpha = 0.09 + intensity * 0.11;
    ctx.filter = 'saturate(12) hue-rotate(5deg) brightness(0.65)';
    drawVideoCover(ctx, chromaShift, 0, w, h);
    ctx.restore();

    // Counter-phase: slight blue/cyan lead on left (chroma phase error)
    ctx.save();
    ctx.globalAlpha = 0.06 + intensity * 0.07;
    ctx.filter = 'saturate(10) hue-rotate(178deg) brightness(0.60)';
    drawVideoCover(ctx, -Math.round(chromaShift * 0.5), 0, w, h);
    ctx.restore();
  }

  // ── LAYER 2b: top-of-frame sync wobble ────────────────────────────────────
  // VHS tapes have a bent/unstable sync signal at the very top of the frame.
  // Simulate with a sinusoidal horizontal offset on the top rows.
  {
    const wobbleH = Math.round(h * (0.06 + intensity * 0.06));  // top 6-12% of frame
    const wobbleAmp = 2 + intensity * 4;
    const wobbleX = Math.round(Math.sin(gl.t * 0.0018) * wobbleAmp);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, wobbleH);
    ctx.clip();
    ctx.translate(wobbleX, 0);
    ctx.filter = 'saturate(0.78) brightness(0.90)';
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();
  }

  // ── LAYER 3: face region micro-displacement — multiple zones ────────────
  // Two permanent oscillating slice-shifts on face area: eye level + mouth level.
  // Gives believable local corruption without long spanning bars.
  {
    const glMP = getMPKeyPoints(w, h);
    // Eye-level displacement — main face distortion zone
    const eyeY = glMP
      ? glMP.leftEye.y
      : (facePos.detected ? (facePos.cy - facePos.h * 0.08) * h : h * 0.38);
    const eyeOff = Math.round(
      Math.sin(gl.t * 0.0021) * 9 + Math.sin(gl.t * 0.0041) * 5
    );  // wider oscillation range for stronger face corruption
    const eyeH  = Math.max(5, Math.round(h * 0.032));  // slightly narrower
    const eyeXL = glMP ? Math.max(0, glMP.leftEye.x - w * 0.18) : 0;
    const eyeXW = w * 0.50;
    ctx.save();
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.rect(eyeXL, eyeY - eyeH * 0.5, eyeXW, eyeH);
    ctx.clip();
    ctx.translate(eyeOff, 0);
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();

    // Secondary: mouth-level displacement — adds asymmetric face corruption
    const mouthY = glMP
      ? glMP.mouth.y
      : (facePos.detected ? (facePos.cy + facePos.h * 0.12) * h : h * 0.52);
    const mOff = Math.round(
      Math.sin(gl.t * 0.0031 + 2.1) * 6 + Math.sin(gl.t * 0.0057 + 0.7) * 3
    );
    const mH   = Math.max(3, Math.round(h * 0.022));
    const mXL  = glMP ? Math.max(0, glMP.rightEye.x - w * 0.12) : w * 0.20;
    const mXW  = w * 0.42;
    ctx.save();
    ctx.globalAlpha = 0.60;
    ctx.beginPath();
    ctx.rect(mXL, mouthY - mH * 0.5, mXW, mH);
    ctx.clip();
    ctx.translate(mOff, 0);
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();
  }

  // ── LAYER 4: intermittent strip glitches (horizontal + vertical) ──────────
  // Strip interval shrinks and count grows with intensity: early = rare+mild, late = frequent+aggressive
  if (!isCapture) {
    gl.timer += dt;
    const stripInterval = 600 - intensity * 400;  // 600ms at 0% → 200ms at 100%
    if (!gl.active && gl.timer > stripInterval + Math.random() * (800 - intensity * 500)) {
      gl.active   = true;
      gl.elapsed  = 0;
      gl.timer    = 0;
      gl.duration = 80 + Math.random() * (200 + intensity * 200);
      gl.strips   = [];
      const n = Math.round(1 + Math.random() * (2 + intensity * 2));  // 1-3 calm, up to 1-5 peak
      for (let i = 0; i < n; i++) {
        const isVert    = Math.random() < 0.06;
        // Narrower strips — 20-35% width max for partial glitches
        const isFullWide = Math.random() < 0.30;
        const stripW     = isFullWide ? w : Math.floor(w * (0.12 + Math.random() * 0.28));
        const stripX     = isFullWide ? 0 : Math.floor(Math.random() * (w - stripW));
        const typeRoll    = Math.random();
        const isTapeNoise = typeRoll < 0.22;
        const isBlackBar  = !isTapeNoise && typeRoll < 0.30;
        const isChroma    = !isTapeNoise && !isBlackBar;
        const hR = Math.random();
        const chromaHue = hR < 0.38 ? 125 : hR < 0.72 ? 182 : 258;
        gl.strips.push({
          y:        Math.floor(Math.random() * h),
          h:        isTapeNoise
            ? 1                                                         // tape noise: 1px only
            : isBlackBar
              ? 1                                                       // signal drop: 1px
              : 1 + Math.floor(Math.random() * (2 + intensity * 2)),   // chroma: 1-3px
          sx:       isVert ? 0      : stripX,
          sw:       isVert ? w      : stripW,
          offset:   (Math.random() - 0.5) * (10 + intensity * 12),
          chroma:   isChroma,
          blackBar: isBlackBar,
          tapeNoise: isTapeNoise,
          chromaHue,
          vertical: isVert,
          vx:       isVert ? Math.floor(Math.random() * w * 0.8) : 0,
          vw:       isVert ? 1 + Math.floor(Math.random() * 3) : w,
        });
      }
    }
    if (gl.active) {
      gl.elapsed += dt;
      if (gl.elapsed > gl.duration) gl.active = false;
    }
  }

  if (gl.active || isCapture) {
    (gl.strips || []).forEach(strip => {
      ctx.save();
      ctx.beginPath();
      if (strip.vertical) {
        // Vertical mode: clip to a column, offset vertically
        ctx.rect(strip.vx, 0, strip.vw, h);
        ctx.clip();
        if (strip.blackBar) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(strip.vx, 0, strip.vw, h);
        } else {
          ctx.translate(0, Math.round(strip.offset * 0.35));
          drawVideoCover(ctx, 0, 0, w, h);
        }
      } else {
        // Horizontal mode: clip to a sectional row (partial width)
        ctx.rect(strip.sx, strip.y, strip.sw, strip.h);
        ctx.clip();
        if (strip.tapeNoise) {
          // VHS tape noise — semi-transparent light band (not black, not digital)
          ctx.globalAlpha = 0.30 + Math.random() * 0.35;
          ctx.fillStyle = `rgba(${180 + Math.floor(Math.random()*60)}, ${160 + Math.floor(Math.random()*60)}, ${120 + Math.floor(Math.random()*60)}, 1)`;
          ctx.fillRect(strip.sx, strip.y, strip.sw, strip.h);
        } else if (strip.blackBar) {
          // Signal dropout — nearly black, slight colour noise at edge
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = '#0A0408';
          ctx.fillRect(strip.sx, strip.y, strip.sw, strip.h);
        } else {
          // Chroma tracking error — shifted, colour-distorted copy of the line
          ctx.globalAlpha = 0.70;
          ctx.filter = `saturate(6) hue-rotate(${strip.chromaHue || 180}deg) brightness(0.85)`;
          ctx.translate(Math.round(strip.offset), 0);
          drawVideoCover(ctx, 0, 0, w, h);
        }
      }
      ctx.restore();
    });

    // Occasional frame-level signal instability — whole frame shifts briefly
    // (VHS tape flutter: the entire image lurches sideways by 1-3 pixels)
    if (!isCapture && Math.random() < 0.08) {
      const flutterOff = Math.round((Math.random() - 0.5) * 4);
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.filter = 'saturate(0.70) brightness(0.88)';
      drawVideoCover(ctx, flutterOff, 0, w, h);
      ctx.restore();
    }
  }

  // ── LAYER 3: block-offset glitches ───────────────────────────────────────
  // Small rectangular regions that briefly shift sideways — adds tactile
  // compression-artefact feel, distinct from the full-width strip layer.
  if (!isCapture) {
    gl.blockTimer += dt;
    // Spawn a fresh cluster every 1.5–3 s
    if (gl.blockTimer > 1500 + Math.random() * 1500) {
      gl.blockTimer = 0;
      const n = 1 + Math.floor(Math.random() * 2);   // 1 or 2 blocks
      for (let i = 0; i < n; i++) {
        gl.blocks.push({
          x:        Math.floor(Math.random() * w * 0.75),
          y:        Math.floor(Math.random() * h * 0.90),
          bw:       Math.floor(w * (0.06 + Math.random() * 0.18)),  // 6–24% wide (was 15-45%)
          bh:       Math.floor(h * (0.008 + Math.random() * 0.022)), // 1–3% tall (was 3-9%)
          offset:   Math.round((Math.random() - 0.5) * 18),          // ±9 px (was ±16px)
          elapsed:  0,
          duration: 80 + Math.floor(Math.random() * 200),           // 80–280 ms
        });
      }
    }
    // Age out expired blocks
    gl.blocks = gl.blocks.filter(b => b.elapsed < b.duration);
    gl.blocks.forEach(b => { b.elapsed += dt; });
  }

  gl.blocks.forEach(b => {
    const fade = b.elapsed < 40
      ? b.elapsed / 40
      : b.elapsed > b.duration - 50
        ? (b.duration - b.elapsed) / 50
        : 1;
    ctx.save();
    ctx.globalAlpha = 0.82 * fade;
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.bw, b.bh);
    ctx.clip();
    ctx.translate(b.offset, 0);
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();
  });

  // Motion-reactive interference — VHS-style: horizontal tracking errors near motion
  if (!isCapture && gl.motionLevel > 0.030) {
    const mLvl = Math.min(1, gl.motionLevel * 3.0);
    const mY   = gl.motionCentroidY * h;
    const nStrips = Math.round(mLvl * 2);  // fewer, cleaner strips
    for (let mi = 0; mi < nStrips; mi++) {
      const sy2  = mY + (Math.random() - 0.5) * h * 0.20;
      const sh2  = 1 + Math.floor(Math.random() * (3 + mLvl * 4));  // thin VHS lines
      const off2 = (Math.random() - 0.5) * (12 + mLvl * 22);        // tighter offsets
      ctx.save();
      ctx.globalAlpha = 0.40 + mLvl * 0.25;
      ctx.beginPath();
      ctx.rect(0, sy2, w, sh2);  // full width for VHS feel
      ctx.clip();
      ctx.filter = 'saturate(4) hue-rotate(182deg) brightness(0.85)';  // VHS chroma tint
      ctx.translate(Math.round(off2), 0);
      drawVideoCover(ctx, 0, 0, w, h);
      ctx.restore();
    }
    // Occasional vertical column split near motion X
    const mX   = (1 - gl.motionCentroidX) * w;
    if (Math.random() < mLvl * 0.10) {
      const colX  = mX + (Math.random() - 0.5) * w * 0.12;
      const colW2 = 2 + Math.floor(Math.random() * (4 + mLvl * 6));  // thinner columns
      const colOff = (Math.random() - 0.5) * (mLvl * 12);
      ctx.save();
      ctx.globalAlpha = 0.45 * mLvl;
      ctx.beginPath();
      ctx.rect(colX, 0, colW2, h);
      ctx.clip();
      ctx.translate(0, Math.round(colOff));
      drawVideoCover(ctx, 0, 0, w, h);
      ctx.restore();
    }
  }

  // Extra distortion near additional detected faces
  facesArray.slice(1).forEach(extraFace => {
    if (!extraFace.detected || Math.random() > 0.4) return;
    const exCX = extraFace.cx * w;
    const exCY = extraFace.cy * h;
    const exFH = extraFace.h * h;
    const exY = exCY + (Math.random() - 0.5) * exFH * 0.8;
    const exH2 = 2 + Math.floor(Math.random() * 8);
    const exOff = (Math.random() - 0.5) * 30;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.rect(0, exY, w, exH2);
    ctx.clip();
    ctx.translate(Math.round(exOff), 0);
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();
  });

  // ── PER-ROW JITTER DISTORTION — rows of pixels shift sideways individually ─
  // Simulates digital compression failure: groups of rows slide left/right by
  // varying amounts, creating the classic "digital glitch" staircase look.
  if (gl.active || (intensity > 0.20 && !isCapture && Math.random() < 0.04)) {
    const jRows = 3 + Math.floor(Math.random() * (4 + intensity * 5));
    for (let ji = 0; ji < jRows; ji++) {
      const jY = Math.floor(Math.random() * h);
      const jH = 1 + Math.floor(Math.random() * 3);
      const jOff = Math.round((Math.random() - 0.5) * (8 + intensity * 14));
      ctx.save();
      ctx.globalAlpha = 0.55 + Math.random() * 0.35;
      ctx.beginPath(); ctx.rect(0, jY, w, jH); ctx.clip();
      ctx.translate(jOff, 0);
      drawVideoCover(ctx, 0, 0, w, h);
      ctx.restore();
    }
  }

  // ── DIGITAL DATA-SORT LAYER ───────────────────────────────────────────────
  // Thin vertical clip-strips of the video with extreme hue rotation → vivid
  // colour columns matching the reference image. Refreshed every ~2-3 seconds.
  const _GLITCH_HUES = [0, 45, 90, 135, 180, 225, 270, 315, 30, 75, 150, 200, 260, 320];
  if (!isCapture) {
    gl.dataTimer += dt;
    const refreshInterval = 2200 + Math.random() * 900;
    if (!gl.dataStripes.length || gl.dataTimer > refreshInterval) {
      gl.dataTimer = 0;
      // 20-30 thin vertical stripes — clipped video with strong hue rotation
      gl.dataStripes = [];
      const n = 20 + Math.floor(Math.random() * 12);
      for (let i = 0; i < n; i++) {
        gl.dataStripes.push({
          x:    Math.floor(Math.random() * w),
          sw:   1 + Math.floor(Math.random() * 4),   // 1-4 px wide
          sy:   Math.floor(Math.random() * h * 0.25),
          sh:   Math.floor(h * (0.3 + Math.random() * 0.65)),
          hue:  _GLITCH_HUES[Math.floor(Math.random() * _GLITCH_HUES.length)],
          sat:  5 + Math.random() * 6,
          alpha: 0.55 + Math.random() * 0.35,
        });
      }
      // 8-14 small colourful pixel-blocks (JPEG corruption style, compact)
      gl.colorBlocks = [];
      const nb = 8 + Math.floor(Math.random() * 7);
      const _BLOCK_COLS = ['#FF00FF','#00FFEE','#FFEE00','#FF2200','#00FF88',
                           '#FF6600','#0088FF','#FF0099','#CCFF00','#FFFFFF'];
      for (let i = 0; i < nb; i++) {
        gl.colorBlocks.push({
          x:     Math.floor(Math.random() * w * 0.90),
          y:     Math.floor(Math.random() * h * 0.90),
          bw:    Math.floor(3 + Math.random() * 14),   // 3-17px (was 8-63px)
          bh:    Math.floor(2 + Math.random() * 7),    // 2-9px  (was 6-48px)
          color: _BLOCK_COLS[Math.floor(Math.random() * _BLOCK_COLS.length)],
          alpha: 0.30 + Math.random() * 0.38,
        });
      }
    }
  }

  // Draw thin vertical video-strips (hue-rotated, high saturation)
  gl.dataStripes.forEach(s => {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.filter = `hue-rotate(${s.hue}deg) saturate(${s.sat.toFixed(1)}) brightness(1.15)`;
    ctx.beginPath();
    ctx.rect(s.x, s.sy, s.sw, s.sh);
    ctx.clip();
    drawVideoCover(ctx, 0, 0, w, h);
    ctx.restore();
  });

  // Draw coloured macro-blocks
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  gl.colorBlocks.forEach(b => {
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle   = b.color;
    ctx.fillRect(b.x, b.y, b.bw, b.bh);
  });
  ctx.restore();
}


/* ============================================================
  12f. DEBUG OVERLAY
   Press D to toggle. Draws raw detection data on every canvas.
   Development only — does not affect capture.
============================================================ */

function drawDebugOverlay(ctx, w, h) {
  const fp = facePos;
  const sb = fp.skinBounds;
  const lm = fp.landmarks;

  // ── FACE POS BOUNDING BOX — yellow ──────────────────────────────────────
  if (fp.detected) {
    const bx = (fp.cx - fp.w * 0.5) * w;
    const by = (fp.cy - fp.h * 0.5) * h;
    const bw = fp.w * w;
    const bh = fp.h * h;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 220, 0, 0.90)';
    ctx.lineWidth   = 2;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 220, 0, 0.80)';
    ctx.font = '9px monospace';
    ctx.fillText('facePos box', bx + 2, by - 2);
    ctx.restore();
  }

  // ── SKIN BOUNDS — cyan solid ─────────────────────────────────────────────
  if (sb) {
    const sx = sb.minX * w;
    const sy = sb.minY * h;
    const sw = (sb.maxX - sb.minX) * w;
    const sh = (sb.maxY - sb.minY) * h;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 230, 255, 0.95)';
    ctx.lineWidth   = 2;
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.fillStyle = 'rgba(0, 230, 255, 0.80)';
    ctx.font = '9px monospace';
    ctx.fillText('skinBounds', sx + 2, sy - 2);
    // Label each edge
    ctx.fillText(`minY=${sb.minY.toFixed(2)}`, sx + sw * 0.3, sy + 10);
    ctx.fillText(`maxY=${sb.maxY.toFixed(2)}`, sx + sw * 0.3, sy + sh - 3);
    ctx.restore();
  }

  // ── NATIVE LANDMARK DOTS — bright green ─────────────────────────────────
  if (lm) {
    const pairs = [
      ['leftEye',  lm.leftEye,  '#00FF44'],
      ['rightEye', lm.rightEye, '#00FF44'],
      ['nose',     lm.nose,     '#88FF00'],
      ['mouth',    lm.mouth,    '#FFFF00'],
    ];
    pairs.forEach(([name, pt, col]) => {
      if (!pt) return;
      const px = pt.x * w;
      const py = pt.y * h;
      ctx.save();
      ctx.fillStyle = col;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = col;
      ctx.font = '9px monospace';
      ctx.fillText(name, px + 6, py + 3);
      ctx.restore();
    });
  }

  // ── DERIVED SURVEY POINTS (what Surveillance actually uses) — orange ─────
  if (fp.detected) {
    // Replicate the same box logic Surveillance uses
    let boxX, boxY, boxW, boxH;
    if (sb) {
      const sMinX = sb.minX * w, sMaxX = sb.maxX * w;
      const sMinY = sb.minY * h, sMaxY = sb.maxY * h;
      const sSkinW = sMaxX - sMinX, sSkinH = sMaxY - sMinY;
      boxW = sSkinW * 1.12; boxH = sSkinH * 1.06;
      boxX = (sMinX + sMaxX) * 0.5 - boxW * 0.5;
      boxY = sMinY - sSkinH * 0.03;
    } else {
      boxW = fp.w * w * 1.28; boxH = fp.h * h * 1.22;
      boxX = fp.cx * w - boxW * 0.5;
      boxY = fp.cy * h - boxH * 0.5;
    }
    boxX = Math.max(2, Math.min(w - boxW - 2, boxX));
    boxY = Math.max(2, Math.min(h - boxH - 2, boxY));

    const pts = getSurveyPoints(boxX, boxY, boxW, boxH, w, h);
    const surveyPts = [
      { p: pts.leftEye,  label: 'L-eye' },
      { p: pts.rightEye, label: 'R-eye' },
      { p: pts.nose,     label: 'nose'  },
      { p: pts.mouth,    label: 'mouth' },
    ];
    surveyPts.forEach(({ p, label }) => {
      ctx.save();
      ctx.fillStyle   = 'rgba(255, 140, 0, 0.90)';
      ctx.strokeStyle = '#000';
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255, 180, 0, 1)';
      ctx.font = '9px monospace';
      ctx.fillText(label, p.x + 5, p.y + 3);
      ctx.restore();
    });

    // Surveillance box outline
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 140, 0, 0.70)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 140, 0, 0.70)';
    ctx.font = '9px monospace';
    ctx.fillText('surv box', boxX + 2, boxY + boxH + 10);
    ctx.restore();
  }

  // ── GHOST ZONE RECTS — purple ────────────────────────────────────────────
  if (fp.detected) {
    let fBoxX, fBoxY, fBoxW, fBoxH;
    if (sb) {
      fBoxX = sb.minX * w; fBoxY = sb.minY * h;
      fBoxW = (sb.maxX - sb.minX) * w; fBoxH = (sb.maxY - sb.minY) * h;
    } else {
      fBoxW = fp.w * w * 1.30; fBoxH = fp.h * h * 1.28;
      fBoxX = fp.cx * w - fBoxW * 0.5; fBoxY = fp.cy * h - fBoxH * 0.44;
    }
    GHOST_ZONE_DEFS.forEach((z, i) => {
      const zx = fBoxX + z.relX * fBoxW;
      const zy = fBoxY + z.relY * fBoxH;
      const zw = z.relW * fBoxW;
      const zh = z.relH * fBoxH;
      ctx.save();
      ctx.strokeStyle = `rgba(200, 100, 255, 0.75)`;
      ctx.fillStyle   = `rgba(200, 100, 255, 0.08)`;
      ctx.lineWidth   = 1;
      ctx.strokeRect(zx, zy, zw, zh);
      ctx.fillRect(zx, zy, zw, zh);
      ctx.fillStyle = 'rgba(220, 140, 255, 0.90)';
      ctx.font = '8px monospace';
      ctx.fillText(`z${i}(w${z.weight})`, zx + 2, zy + 9);
      ctx.restore();
    });
  }

  // ── 3RD EYE POSITION — red crosshair ────────────────────────────────────
  {
    let gx = w * 0.50, gy = h * 0.42;
    const lm2 = fp.landmarks;
    if (lm2?.leftEye && lm2?.rightEye) {
      gx = ((lm2.leftEye.x + lm2.rightEye.x) * 0.5) * w;
      gy = ((lm2.leftEye.y + lm2.rightEye.y) * 0.5) * h;
    } else if (sb) {
      const sH = (sb.maxY - sb.minY) * h;
      gx = (sb.minX + sb.maxX) * 0.5 * w;
      gy = sb.minY * h + sH * 0.06;
    } else if (fp.detected) {
      gx = fp.cx * w;
      gy = fp.cy * h - fp.h * h * 0.30;
    }
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 40, 40, 0.95)';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(gx - 10, gy); ctx.lineTo(gx + 10, gy);
    ctx.moveTo(gx, gy - 10); ctx.lineTo(gx, gy + 10);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 60, 60, 0.90)';
    ctx.font = '9px monospace';
    ctx.fillText('3rd-eye', gx + 7, gy - 6);
    ctx.restore();
  }

  // ── TEXT PANEL — top-right corner ────────────────────────────────────────
  {
    const lines = [
      `strategy: ${detectionStrategy}`,
      `detected: ${fp.detected}`,
      `cx:${fp.cx.toFixed(2)} cy:${fp.cy.toFixed(2)}`,
      `w:${fp.w.toFixed(2)}  h:${fp.h.toFixed(2)}`,
      `landmarks: ${lm ? Object.keys(lm).join(',') : 'none'}`,
      `skinBounds: ${sb ? `${sb.minX.toFixed(2)}-${sb.maxX.toFixed(2)} / ${sb.minY.toFixed(2)}-${sb.maxY.toFixed(2)}` : 'none'}`,
      `nativeLmSeen: ${nativeLandmarksEverSeen}`,
    ];
    const lh = 11;
    const panelW = 190;
    const panelH = lines.length * lh + 8;
    const px = w - panelW - 3;
    const py = 3;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.fillRect(px, py, panelW, panelH);
    ctx.font      = '9px monospace';
    ctx.textAlign = 'left';
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0
        ? (detectionStrategy === 'native' ? '#00FF88' : detectionStrategy === 'approx' ? '#FFCC00' : '#FF4444')
        : '#DDDDDD';
      ctx.fillText(line, px + 4, py + 10 + i * lh);
    });
    ctx.restore();
  }
}


/* ============================================================
  12. FILTER SELECTION
============================================================ */

function selectFilter(filterKey) {
  document.querySelector('.filter-cell--selected')
    ?.classList.remove('filter-cell--selected');

  const cell = document.querySelector(`[data-filter="${filterKey}"]`);
  cell?.classList.add('filter-cell--selected');

  const prev = state.selectedFilter;
  state.selectedFilter = filterKey;

  // Reset per-filter build timers when switching away from / into a filter
  if (filterKey !== prev) {
    // Pixel Ghost: restart density ramp so it "develops" fresh each time
    if (filterKey === 'pixel-ghost') anim.pixelGhost.densityT = 0;
    // Surveillance: reset build so it re-scans
    if (filterKey === 'surveillance') anim.surveillance.buildProgress = 0;
    // Glitch: reset intensity
    if (filterKey === 'glitch') { anim.glitch.t = 0; anim.glitch.intensityT = 0; }
  }

  const label = cell?.querySelector('.filter-name')?.textContent ?? filterKey;
  setStatus('filter', `filter: ${label.toLowerCase()}`);
}


/* ============================================================
  13. MODE SELECTION
============================================================ */

function selectMode(modeKey) {
  state.mode = modeKey;

  modeBtns.forEach(btn => {
    const active = btn.dataset.mode === modeKey;
    btn.classList.toggle('mode-btn--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  setStatus('mode', `mode: ${modeKey === 'strip' ? '4-photo strip' : 'single'}`);
}


/* ============================================================
  14. COUNTDOWN
  Returns a Promise so async capture functions can simply
  await runCountdown(3) without nested callbacks.
============================================================ */

function runCountdown(seconds) {
  return new Promise(resolve => {
    let remaining = seconds;
    showCountdown(remaining);

    const interval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        showCountdown(remaining);
      } else {
        clearInterval(interval);
        hideCountdown();
        resolve();
      }
    }, 1000);
  });
}

function showCountdown(n) {
  // Re-insert the element to re-trigger the CSS animation each time the number changes
  const span = document.createElement('span');
  span.className = 'countdown-number';
  span.textContent = n;
  countdownEl.innerHTML = '';
  countdownEl.appendChild(span);
  countdownEl.classList.add('visible');
}

function hideCountdown() {
  countdownEl.classList.remove('visible');
  countdownEl.innerHTML = '';
}


/* ============================================================
  15. CAPTURE
============================================================ */

function startCapture() {
  if (state.capturing) return;
  state.capturing     = true;
  captureBtn.disabled = true;
  hideEmailPanel();

  if (state.mode === 'strip') {
    captureStrip();
  } else {
    captureSingle();
  }
}

async function captureSingle() {
  try {
    await runCountdown(COUNTDOWN_S);
    flashShutter();
    const dataURL = renderToCapture(state.selectedFilter);
    finishCapture(dataURL);
  } catch (err) {
    console.error('[JHALAK] captureSingle error — resetting state:', err);
    state.capturing     = false;
    captureBtn.disabled = false;
    hideCountdown();
  }
}

async function captureStrip() {
  const frames = [];
  try {
    for (let i = 0; i < 4; i++) {
      await runCountdown(COUNTDOWN_S);
      flashShutter();
      frames.push(renderToCapture(state.selectedFilter));
      if (i < 3) await wait(750);  // brief pause so visitor can repose
    }
    const dataURL = await compositeStrip(frames);
    finishCapture(dataURL);
  } catch (err) {
    console.error('[JHALAK] captureStrip error — resetting state:', err);
    state.capturing     = false;
    captureBtn.disabled = false;
    hideCountdown();
  }
}

/** Render current video + chosen filter at full 640×480 onto the hidden canvas. */
function renderToCapture(filterKey) {
  capCanvas.width  = CAPTURE_W;
  capCanvas.height = CAPTURE_H;
  capCtx.clearRect(0, 0, CAPTURE_W, CAPTURE_H);
  renderFilter(capCtx, CAPTURE_W, CAPTURE_H, filterKey, /*isCapture=*/true, 0);
  _drawCaptureLogoOnCanvas(capCtx, CAPTURE_W, CAPTURE_H);
  return capCanvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Composite Sim's logo into the bottom-right corner of a capture canvas.
 * The logo PNG is 3840×2160 — we scale it to ~88px wide (≈5% of CAPTURE_W).
 * Drawn at 78% opacity so it's visible but not intrusive.
 * Safe to call even if the image hasn't loaded yet (no-op in that case).
 */
function _drawCaptureLogoOnCanvas(ctx, canvasW, canvasH) {
  if (!_captureLogoImg.complete || !_captureLogoImg.naturalWidth) return;
  const logoDisplayW = Math.round(canvasW * 0.138);         // ~88px at 640 wide
  const logoDisplayH = Math.round(
    logoDisplayW * (_captureLogoImg.naturalHeight / _captureLogoImg.naturalWidth)
  );
  const margin = Math.round(canvasW * 0.022);               // ~14px at 640 wide
  const lx = canvasW - logoDisplayW - margin;
  const ly = canvasH - logoDisplayH - margin;
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.drawImage(_captureLogoImg, lx, ly, logoDisplayW, logoDisplayH);
  ctx.restore();
}

/** Arrange 4 captured frames as a 2×2 grid on one canvas. */
async function compositeStrip(frames) {
  const cols = 2, rows = 2, gap = 10;
  const fw   = CAPTURE_W, fh = CAPTURE_H;
  const totalW = fw * cols + gap * (cols + 1);
  const totalH = fh * rows + gap * (rows + 1);

  capCanvas.width  = totalW;
  capCanvas.height = totalH;

  capCtx.fillStyle = '#1A1410';
  capCtx.fillRect(0, 0, totalW, totalH);

  await Promise.all(
    frames.map((dataURL, i) => new Promise(resolve => {
      const img    = new Image();
      img.onload   = () => {
        capCtx.drawImage(img,
          gap + (i % cols)           * (fw + gap),
          gap + Math.floor(i / cols) * (fh + gap),
          fw, fh
        );
        resolve();
      };
      img.onerror  = () => {
        console.error('[JHALAK] compositeStrip: frame', i, 'failed to decode — cell left blank');
        resolve(); // resolve anyway so the strip still completes
      };
      img.src = dataURL;
    }))
  );

  // Composite logo onto the assembled strip
  _drawCaptureLogoOnCanvas(capCtx, totalW, totalH);

  return capCanvas.toDataURL('image/jpeg', 0.88);
}

/** One-frame white flash over the window on capture. Self-removes on animationend. */
function flashShutter() {
  playCapture();
  const flash = document.createElement('div');
  flash.className = 'shutter-flash is-flashing';
  document.querySelector('.app-window').appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove(), { once: true });
}

function finishCapture(dataURL) {
  state.capturedDataURL = dataURL;
  state.capturing       = false;
  captureBtn.disabled   = false;
  const memory = pickMemory();
  state.currentMemory  = memory;
  archiveCapture(dataURL, memory, document.getElementById('name-input')?.value?.trim() || '');
  showEmailPanel(dataURL, memory);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ============================================================
  16. EMAIL PANEL + QR CODE
============================================================ */

/**
 * Upload the captured JPEG to Vercel Blob via /api/jhalak-upload.
 * On success, display the returned QR code (a data URL PNG) in the panel.
 * On failure, show an error and leave the email form as the fallback.
 */
async function uploadAndShowQR(dataURL) {
  const qrLoading = document.getElementById('qr-loading');
  const qrImg     = document.getElementById('qr-img');
  const qrHint    = document.getElementById('qr-hint');
  const qrError   = document.getElementById('qr-error');
  if (!qrLoading || !qrImg) return;

  // Reset to loading state
  qrLoading.hidden = false;
  qrLoading.textContent = 'generating link…';
  qrImg.hidden    = true;
  qrImg.src       = '';
  if (qrHint)  qrHint.hidden = true;
  if (qrError) { qrError.hidden = true; qrError.textContent = ''; }

  try {
    const res = await fetch('/api/jhalak-upload', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: dataURL }),
    });

    let data;
    try { data = await res.json(); } catch { data = {}; }

    if (!res.ok) {
      throw new Error(data.error || `upload failed (${res.status})`);
    }

    if (data.qr) {
      // QR code ready — show it
      qrLoading.hidden = true;
      qrImg.src        = data.qr;
      qrImg.hidden     = false;
      if (qrHint) qrHint.hidden = false;
      console.log('[JHALAK] QR generated. Blob URL:', data.url);
    } else if (data.url) {
      // Blob uploaded but QR generation failed — show text link
      qrLoading.textContent = '↗ ' + data.url;
    } else {
      throw new Error('no url returned');
    }

  } catch (err) {
    console.error('[JHALAK] QR upload error:', err);
    qrLoading.hidden = true;
    if (qrError) {
      qrError.textContent = 'link unavailable — send by email below';
      qrError.hidden = false;
    }
  }
}

function showEmailPanel(dataURL, memory) {
  // Large postcard image
  emailPreview.src = dataURL;

  emailPanel.hidden = false;
  emailPanel.setAttribute('aria-hidden', 'false');
  emailStatus.textContent = '';
  emailStatus.className   = 'email-status';
  btnSkip.disabled        = false;

  // Logo preview (shows if JHALAK_LOGO_URL is set)
  const logoEl = document.getElementById('email-logo-preview');
  if (logoEl && JHALAK_LOGO_URL) {
    logoEl.src   = JHALAK_LOGO_URL;
    logoEl.style.display = 'block';
  }

  // Butterfly stamp — same asset, bottom-right corner of the postcard
  const stampEl = document.getElementById('email-butterfly-stamp');
  if (stampEl) stampEl.src = JHALAK_LOGO_URL || '';

  // Reset archive row so Yes/No is interactive again for each capture
  const archiveRow = document.querySelector('.email-archive-row');
  if (archiveRow) { archiveRow.style.opacity = ''; archiveRow.style.pointerEvents = ''; }

  // Render archive filmstrip
  renderFilmstrip();

  // Kick off QR upload (non-blocking)
  uploadAndShowQR(dataURL);
}

function renderFilmstrip() {
  const strip = document.getElementById('email-filmstrip');
  if (!strip) return;
  strip.innerHTML = '';

  if (memoryArchive.length === 0) {
    const msg = document.createElement('span');
    msg.className   = 'filmstrip-empty';
    msg.textContent = 'no captures yet';
    strip.appendChild(msg);
    return;
  }

  memoryArchive.forEach((entry, idx) => {
    const item = document.createElement('div');
    item.className = 'filmstrip-item';
    // The newest (current) capture is the last entry
    if (idx === memoryArchive.length - 1) item.classList.add('filmstrip-item--selected');

    const img = document.createElement('img');
    img.src = entry.dataURL;
    img.alt = `capture ${idx + 1}`;
    item.appendChild(img);
    strip.appendChild(item);
  });

  // Scroll the strip so the selected (last) item is visible
  strip.scrollLeft = strip.scrollWidth;
}

function hideEmailPanel() {
  emailPanel.hidden = true;
  emailPanel.setAttribute('aria-hidden', 'true');
}

// ── EMAIL SEND ──────────────────────────────────────────────────────────────
// Sandbox behaviour (current): from = onboarding@resend.dev
//   → email only lands in the Resend account owner's inbox (sukhjeet.singh@gmail.com),
//     regardless of what address the visitor types. This is a Resend API restriction.
// Production behaviour: set RESEND_FROM_EMAIL=JHALAK <jhalak@simkaur.art> in Vercel
//   → once simkaur.art DNS is verified in Resend, email delivers to any recipient.
async function sendEmail(address, dataURL) {
  const memory = state.currentMemory;
  console.log('[JHALAK] Sending photo to:', address);

  let res;
  try {
    res = await fetch('/api/send-photo', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        to:      address,
        image:   dataURL,
        fortune: memory ? memory.fortune : '',
        note:    memory ? memory.note    : '',
      }),
    });
  } catch (networkErr) {
    // fetch itself failed — no internet, DNS failure, etc.
    console.error('[JHALAK] network error during send:', networkErr);
    throw new Error('network error — check your connection');
  }

  let data;
  try { data = await res.json(); } catch { data = {}; }
  console.log('[JHALAK] Send response status:', res.status, data);

  if (data?.warning) {
    // Sandbox fallback: API worked but email went to account owner, not visitor
    console.warn('[JHALAK] send warning:', data.warning);
  }
  if (!res.ok) {
    // Log the raw server response so it's visible in the browser console at the gallery
    console.error('[JHALAK] API error response:', res.status, data);
    const detail = data?.error ?? 'unknown error';
    throw new Error(`send failed (${res.status}): ${detail}`);
  }
}


btnSkip.addEventListener('click', () => { playClick(); reset(); });

function setEmailStatus(msg, cls) {
  emailStatus.textContent = msg;
  emailStatus.className   = `email-status ${cls}`.trim();
}


/* ============================================================
  17. RESET
  Clean slate for the next visitor.
============================================================ */

function reset() {
  state.capturedDataURL = null;
  state.currentMemory   = null;
  state.capturing       = false;

  hideEmailPanel();
  hideCountdown();

  captureBtn.disabled     = false;
  btnSkip.disabled        = false;
  emailStatus.textContent = '';
  emailStatus.className   = 'email-status';

  selectFilter('none');
  setStatus('camera', '\u25CF camera ready');
}


/* ============================================================
  18. ARCHIVE PANEL
  In-session capture history. Shows thumbnails + fortune per capture.
============================================================ */

function openArchive() {
  const panel = document.getElementById('archive-panel');
  if (!panel) return;
  renderArchive();
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
}

function closeArchive() {
  const panel = document.getElementById('archive-panel');
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
}

function renderArchive() {
  const grid = document.getElementById('archive-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (memoryArchive.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'archive-empty';
    empty.textContent = 'no captures yet this session.';
    grid.appendChild(empty);
    return;
  }
  // Most recent first
  [...memoryArchive].reverse().forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'archive-item';

    const img = document.createElement('img');
    img.src       = entry.dataURL;
    img.alt       = `capture ${memoryArchive.length - i}`;
    img.className = 'archive-thumb';
    item.appendChild(img);

    const meta = document.createElement('div');
    meta.className = 'archive-meta';

    const dt = new Date(entry.timestamp);
    const dateStr = dt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = dt.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    const dateMeta = document.createElement('p');
    dateMeta.className = 'archive-datetime';
    dateMeta.textContent = `${dateStr} ${timeStr}`;
    if (entry.name) {
      const nameEl = document.createElement('span');
      nameEl.className = 'archive-name';
      nameEl.textContent = entry.name;
      dateMeta.appendChild(nameEl);
    }
    meta.appendChild(dateMeta);

    const filter = document.createElement('p');
    filter.className   = 'archive-filter';
    filter.textContent = `filter: ${entry.filter}`;
    meta.appendChild(filter);

    item.appendChild(meta);
    grid.appendChild(item);
  });
}


/* ============================================================
  20. STATUS HELPERS
============================================================ */

function setStatus(key, text) {
  const targets = { camera: statusCamera, filter: statusFilter, mode: statusMode };
  if (targets[key]) targets[key].textContent = text;
}


/* ============================================================
  21. EVENT LISTENERS
============================================================ */

filterCells.forEach(cell => {
  if (cell.classList.contains('filter-cell--locked')) return;

  // Single click — select filter (existing behaviour)
  cell.addEventListener('click', () => {
    if (!state.capturing) { playClick(); selectFilter(cell.dataset.filter); }
  });

  // Double click — open Photo Booth-style overlay panel above the app-body
  cell.addEventListener('dblclick', e => {
    e.stopPropagation();
    if (state.capturing) return;
    const appBody = document.querySelector('.app-body');
    if (!appBody) return;

    // Check if this filter's overlay is already open (toggle to close)
    const existingOverlay = appBody.querySelector('.filter-enlarge-overlay');
    const existingKey     = existingOverlay ? existingOverlay.dataset.filterKey : null;
    if (existingOverlay) existingOverlay.remove();

    if (existingKey === cell.dataset.filter) {
      // Same cell double-clicked again — overlay removed above, we're done
      playClick();
      return;
    }

    // Create floating overlay panel — positioned over the filter-grid only
    // so the controls bar and status bar remain visible and usable.
    const overlay = document.createElement('div');
    overlay.className         = 'filter-enlarge-overlay';
    overlay.dataset.filterKey = cell.dataset.filter;

    // Size overlay to exactly cover the filter-grid area
    const gridEl  = appBody.querySelector('.filter-grid');
    const bodyRect = appBody.getBoundingClientRect();
    const gridRect = gridEl ? gridEl.getBoundingClientRect() : bodyRect;

    overlay.style.top    = (gridRect.top  - bodyRect.top)  + 'px';
    overlay.style.left   = (gridRect.left - bodyRect.left) + 'px';
    overlay.style.width  = gridRect.width  + 'px';
    overlay.style.height = gridRect.height + 'px';
    overlay.style.right  = 'auto';
    overlay.style.bottom = 'auto';

    // Canvas sized to the grid area
    const oc = document.createElement('canvas');
    const labelH = 22;
    oc.width  = Math.max(CANVAS_W, Math.round(gridRect.width));
    oc.height = Math.max(CANVAS_H, Math.round(gridRect.height) - labelH);
    overlay.appendChild(oc);

    // Filter name label strip
    const nameLabel = document.createElement('span');
    nameLabel.className   = 'filter-name';
    const srcLabel = cell.querySelector('.filter-name');
    nameLabel.textContent = srcLabel ? srcLabel.textContent : cell.dataset.filter.toUpperCase();
    overlay.appendChild(nameLabel);

    // Close button (white square, pixelated X)
    const closeBtn = document.createElement('button');
    closeBtn.className   = 'enlarge-close-btn';
    closeBtn.textContent = '×';
    closeBtn.title       = 'Back to grid';
    closeBtn.addEventListener('click', ev => {
      ev.stopPropagation();
      overlay.remove();
      playClick();
    });
    overlay.appendChild(closeBtn);

    // Double-click on overlay closes it (mirrors cell dblclick behaviour)
    overlay.addEventListener('dblclick', ev => {
      ev.stopPropagation();
      overlay.remove();
      playClick();
    });

    appBody.appendChild(overlay);
    playClick();
  });
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!state.capturing) { playClick(); selectMode(btn.dataset.mode); }
  });
});

captureBtn.addEventListener('click', () => { playClick(); startCapture(); });

// Escape — exit filter-enlarge overlay if active
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const appBody = document.querySelector('.app-body');
    const overlay = appBody && appBody.querySelector('.filter-enlarge-overlay');
    if (overlay) {
      overlay.remove();
      playClick();
    }
  }
});

// M key — toggle MediaPipe landmark overlay
window.addEventListener('keydown', e => {
  if (e.key === 'm' || e.key === 'M') {
    state.mpDebugMode = !state.mpDebugMode;
    console.log(`[JHALAK] MediaPipe debug overlay: ${state.mpDebugMode ? 'ON' : 'OFF'}`);
    if (state.mpDebugMode) {
      console.log(`  mpLandmarker ready: ${!!mpLandmarker} | loadFailed: ${mpLoadFailed}`);
      console.log(`  current mpLandmarks: ${mpLandmarks ? mpLandmarks.length + ' pts' : 'null'}`);
    }
  }
});

// D key — toggle debug overlay
window.addEventListener('keydown', e => {
  if (e.key === 'd' || e.key === 'D') {
    state.debugMode = !state.debugMode;
    console.log(`[JHALAK] debug overlay: ${state.debugMode ? 'ON' : 'OFF'}`);
    if (state.debugMode) {
      console.log('[JHALAK] Debug snapshot:', {
        strategy:           detectionStrategy,
        nativeLandmarksSeen: nativeLandmarksEverSeen,
        detected:           facePos.detected,
        cx: facePos.cx.toFixed(3), cy: facePos.cy.toFixed(3),
        w:  facePos.w.toFixed(3),  h:  facePos.h.toFixed(3),
        landmarks:  facePos.landmarks  ? Object.keys(facePos.landmarks) : null,
        skinBounds: facePos.skinBounds ? {
          minX: facePos.skinBounds.minX.toFixed(3),
          maxX: facePos.skinBounds.maxX.toFixed(3),
          minY: facePos.skinBounds.minY.toFixed(3),
          maxY: facePos.skinBounds.maxY.toFixed(3),
        } : null,
      });
    }
  }
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeGridCanvases();
    const fc = document.querySelector('.filter-canvas');
    if (fc) {
      const cw = fc.width  || CANVAS_W;
      const ch = fc.height || CANVAS_H;
      initILoveYouAnim(cw, ch);
      initGhostPatches(cw, ch);
      initAuraAnim(cw, ch);
      initFallingStarsAnim(cw, ch);
    }
  }, 200);
});

// Archive button + close button
document.addEventListener('click', e => {
  if (e.target.closest('#btn-archive'))       { playClick(); openArchive(); }
  if (e.target.closest('#btn-archive-close')) { playClick(); closeArchive(); }
});

// Email modal — X (close dot) closes the popup
document.querySelector('#email-panel .dot--close')
  ?.addEventListener('click', () => { playClick(); reset(); });

// Clicking the backdrop (outside the card) also closes the popup
emailPanel.addEventListener('click', e => {
  if (!e.target.closest('.email-modal-card')) { playClick(); reset(); }
});

// Archive YES / NO buttons
document.getElementById('btn-archive-yes')?.addEventListener('click', () => {
  // YES — photo already archived on capture; update name now that user has typed it
  playClick();
  if (memoryArchive.length > 0) {
    const nameVal = document.getElementById('name-input')?.value?.trim() || '';
    if (nameVal) {
      memoryArchive[memoryArchive.length - 1].name = nameVal;
      saveArchiveToStorage(memoryArchive);
    }
  }
  const row = document.querySelector('.email-archive-row');
  if (row) { row.style.opacity = '0.45'; row.style.pointerEvents = 'none'; }
  setEmailStatus('\u2756 saved to archive', 'is-success');
});

document.getElementById('btn-archive-no')?.addEventListener('click', () => {
  // NO — remove the most recent entry from the archive and persist the removal
  playClick();
  if (memoryArchive.length > 0) {
    memoryArchive.pop();
    saveArchiveToStorage(memoryArchive);  // persist the removal
  }
  const row = document.querySelector('.email-archive-row');
  if (row) { row.style.opacity = '0.45'; row.style.pointerEvents = 'none'; }
  setEmailStatus('not saved.', '');
});


/* ============================================================
  22. INIT
============================================================ */

function init() {
  selectFilter('none');
  selectMode('single');
  initFaceDetector();
  initWebcam();
  initMediaPipe();   // async, non-blocking — loads in background
}

init();

/* ============================================================
   DRAGGABLE WINDOW
   Drag the app window by its title bar.
============================================================ */
(function () {
  const win      = document.getElementById('app-window');
  const titleBar = win ? win.querySelector('.title-bar') : null;
  if (!win || !titleBar) return;

  let dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;

  titleBar.addEventListener('mousedown', e => {
    // Ignore clicks on buttons/dots
    if (e.target.closest('button, .dot, .title-bar-dots')) return;
    dragging = true;
    win.classList.add('is-dragging');

    // On first drag, convert from centered flex to absolute positioning
    if (!win.style.left) {
      const rect = win.getBoundingClientRect();
      win.style.position = 'fixed';
      win.style.left     = rect.left + 'px';
      win.style.top      = rect.top  + 'px';
      win.style.margin   = '0';
    }
    startX   = e.clientX;
    startY   = e.clientY;
    origLeft = parseFloat(win.style.left) || 0;
    origTop  = parseFloat(win.style.top)  || 0;
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    // Clamp so the title bar always stays on-screen (at least 48px from each edge)
    const MARGIN = 48;
    const newLeft = origLeft + e.clientX - startX;
    const newTop  = origTop  + e.clientY - startY;
    win.style.left = Math.min(window.innerWidth  - MARGIN, Math.max(MARGIN - win.offsetWidth,  newLeft)) + 'px';
    win.style.top  = Math.min(window.innerHeight - MARGIN, Math.max(0, newTop)) + 'px';
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    win.classList.remove('is-dragging');
  });
})();
