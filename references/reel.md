# Reels with Remotion

Read this in reel mode after the storyboard is approved. Remotion renders React components to video, so the reel is code you can regenerate when the docs change. If the repo already has video tooling, use that and keep the same craft rules.

Craft patterns here borrow from strong short-form and product-demo practice (hook in 3 s, beat sheet before motion, product fills the frame, **cursor clicks and punch cuts**). Truthfulness still wins: every on-screen claim needs a `source` line from the verified docs or code.

**This is a video.** If pausing any frame looks the same as the next half-second, you built a slideshow. Fix the motion before you polish captions.

## Hide the dump

Users do not want a Remotion monorepo in their tree. Scaffold **only** under `.readme2reel/`:

```bash
npx create-video@latest --yes --blank --no-tailwind .readme2reel
cd .readme2reel && npm i
npx remotion studio
```

Then ensure the project root `.gitignore` contains:

```
.readme2reel/
```

If an old visible `reel/` folder exists from a prior run, leave it alone unless the user asks to delete it; put new work in `.readme2reel/`.

`create-video` refuses a non-empty folder. If `.readme2reel/` already looks like Remotion (`remotion.config.ts` or `remotion` in package.json), reuse it. Open Studio as soon as the project runs and keep it open.

Deliverables the user cares about:

- Storyboard in chat + `.readme2reel/storyboard.md`
- Preview in Remotion Studio
- Optional export: `.readme2reel/out/reel.mp4` (copy elsewhere only if they ask)

Do not propose committing the scaffold, `node_modules`, lockfile, QA stills, or `out/`.

## Structure

```
.readme2reel/
  storyboard.md
  src/
    Root.tsx
    Reel.tsx
    reel-data.ts      every on-screen word + timing + source
    scenes/
  public/             logos, stills, short recordings (copied in)
  out/                renders, only when asked
```

Copy `templates/remotion/` from the skill into `.readme2reel/src/` before inventing components. Prefer those PhoneFrame, Cursor, Hook, Demo, Punch, and Cta scenes. Capture product UI with `scripts/capture-ui.mjs` (phone 390×844 @2x).

Keep all copy and motion cues in `reel-data.ts`. Scenes take props only:

```ts
export const FPS = 30;
export const reel = {
  repo: "github.com/owner/name",
  takeaway: "NoteDesk gives writers a three-pane desk in the browser",
  accent: "#4f8cff",
  scenes: [
    { kind: "hook", seconds: 3, text: "A clean desk for every draft", source: "README.md:3" },
    {
      kind: "demo",
      seconds: 8,
      shot: "shots/desk.png", // or recording.webm
      caption: "Folders · editor · preview",
      cursor: [
        { at: 0, x: 0.2, y: 0.75 },
        { at: 24, x: 0.55, y: 0.42, click: true },
        { at: 60, x: 0.72, y: 0.55, click: true },
      ],
      source: "README.md:7",
    },
    { kind: "cta", seconds: 3, text: "notedesk.example", source: "README.md:11" },
  ],
} as const;
```

`source` never renders. It is the review trail.

## Craft: make a video people finish

### One takeaway

Write `reel.takeaway` before any scene. Every beat serves that line. If a scene does not support it, cut the scene.

### Hook is not the logo

Viewers decide in ~3 seconds. Open on payoff, tension, or a verified claim over the product UI. Logo-as-scene-1 fails. A small mark in the corner is fine for the whole reel.

### Five beats, not a site tour

Hook → Problem → Reveal → Proof → CTA. For a homepage, **one** primary screen plus at most one proof screen beats five nav pages with captions like "Usage" and "Partner". If the README lists many features, pick the two that prove the takeaway.

### Pacing

| Scene type | Target | Notes |
|---|---|---|
| Hook | 2.5–3.5 s | Fastest cut |
| Text / problem | 2.5–4 s | ~2.5 words/sec reading time |
| UI / reveal | 5–8 s | Eye needs dwell time |
| Proof | 4–6 s | Hold; do not undercut with motion |
| CTA | 2.5–3.5 s | One URL, readable |

Ban flat identical durations. If the reel runs long, cut a scene — do not speed every beat up. Social ceiling: **30 s**. Prefer **15–25 s**.

### Captions

One short sentence per scene that states the idea. Fail captions that only name the page ("Home", "Materials", "Hubs").

## Motion: edit a video, do not slideshow PNGs

A static full-bleed screenshot held for four seconds is not a beat. Prefer, in order:

1. **Short screen recording** of the real product (a few seconds of the key action), then a synthetic cursor on top if the capture dropped the pointer.
2. **Still UI + animated cursor** that moves with easing and pulses a **click ring** on the control that matters.
3. **Typed / state-change demos** for CLIs: characters appear by frame; a flag highlights after.
4. **Punch panels** for claims: big type or a number slams in (~0.2–0.35 s overshoot then settle), holds, hard-cuts to the next beat.

### Cursor + click (required on app reveal beats)

Put an SVG pointer on the **top** layer. Waypoints use fractions of the frame so scale survives:

```tsx
const PATH = [
  { at: 0, x: 0.18, y: 0.82 },
  { at: 28, x: 0.62, y: 0.38 }, // arrives + clicks
];
const CLICK_AT = [28];
// interpolate x/y over PATH frames with Easing.inOut(Easing.cubic), clamp ends
// on click: ring scale 0.4→1.6 and opacity 1→0 over ~14 frames from tip
```

Details that read as real:

- Hotspot is the **tip** of the arrow, not the center of the SVG box.
- Ease in/out per segment; linear cursors look robotic.
- Hold on the target for several frames after the click so the UI change (or caption) can register.
- For touch/mobile sims, a finger **dot** variant is fine; still show the tap ripple.

Optional: install a maintained cursor helper (for example `@snapcn/cursor-track` via shadcn) if the project already uses that stack — props-only, do not invent component names. Hand-rolled SVG cursor above is always enough.

### Flash / punch panels

Use for hook tension, one proof number, or a hard claim between UI beats:

- Full-bleed or large card, brand accent, **one** line (≤8 words).
- Enter fast (spring or short overshoot), hold, **hard cut** out — no slow fade soup.
- Pair with the product: flash claim → cut to the click that proves it.

### Transitions

- Prefer `Series` hard cuts between beats. Short `@remotion/transitions` crossfades (≤8–10 frames) only when a hard cut would flash.
- Do not dissolve every scene equally — that is slideshow language.
- Never Ken Burns a landscape screenshot to fake energy; energy comes from cuts, clicks, and type.

### Recordings vs stills

- If the repo or local preview can produce a short `.webm`/`.mp4` of the real flow, prefer that for the reveal beat.
- Stills are plates for cursor demos, not the whole reel.
- Never invent UI chrome, labels, or fake dashboards. Capture what exists.

### Hard motion fails

- Three or more consecutive scenes that are only a screenshot + caption with no cursor, type, or panel motion
- Cursor that teleports or moves at constant linear speed with no ease
- Click with no ring / no hold
- "Energy" attempted only via Ken Burns or endless drift

## Scale: product must dominate

Vertical canvas is 1080×1920. Empty gutters kill credibility.

### Phone UI (preferred for 9:16)

- Capture at ~390×844 (or @2x 780×1688). Prefer a real mobile viewport, not a shrunk desktop.
- Device chrome width **900–1000 px** (about 83–93% of frame width).
- Keep caption as a short overlay in the safe area or a thin band that still leaves the phone ≥ ~70% of frame height. Do not stack a large title above a tiny phone.
- `object-fit: contain` + `object-position: top center` inside the phone screen. Never `cover`, never Ken Burns on the screenshot.
- Example shell:

```tsx
const PHONE_W = 740; // inside 1080
const BEZEL = 14;
const SCREEN_W = PHONE_W - BEZEL * 2;
const SCREEN_H = Math.round(SCREEN_W * (844 / 390));
```

### Desktop UI

- Use only when the product is clearly desktop-first and a phone capture would lie.
- Full-bleed width 1080, letterbox bars above/below, `object-fit: contain`. No floating Mac-window chrome card with huge side margins.
- If hero type truncates ("…Studen"), the capture is wrong — recapture wider or switch to phone.

### Hard scale fails

- Phone or browser card under ~700 px wide in a 1080 frame
- More than ~12% empty margin on both sides of the product
- UI type you cannot read without squinting
- Landscape screenshot force-filled with `object-fit: cover`

## Brand

1. Prefer what the live site or navbar actually loads.
2. Prefer newer mtimes and current paths over `old/`, `v1/`, `legacy/`.
3. Prefer SVG or high-res PNG over a favicon.
4. Copy into `.readme2reel/public/` and note the source path in the storyboard.

No invented wordmarks. No mark → set the name in type.

## Audio

Optional. Silent-first still wins.

- Real track from the repo → `<Audio>` + `staticFile()`.
- No track → stay silent. Never generate sine, noise, or placeholder hums.

## Remotion mechanics

Derive duration from data:

```tsx
const total = reel.scenes.reduce((s, x) => s + Math.round(x.seconds * FPS), 0);
<Composition id="Reel" component={Reel} durationInFrames={total} fps={FPS} width={1080} height={1920} />
```

Sequence with `Series`. Drive motion from `useCurrentFrame()` + clamped `interpolate()` — CSS transitions and `setTimeout` do not render.

```tsx
const enter = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

Type commands by slicing the string by frame; finish by mid-scene so the line can be read. Load fonts with `@remotion/google-fonts` or `staticFile()`, never a CSS URL at render time.

Play the composition in Studio at 1× while you build. Scrubbing stills alone will not catch a missing click.

## Check before showing

Answer out loud (or in the storyboard notes):

1. What is the one takeaway?
2. Does the first 3 s sell that takeaway without a logo splash?
3. Can I recognize the product UI at a glance, at full size?
4. Did something **move or get clicked** on the reveal beat?
5. Would I keep watching muted?

Then play the timeline and grab mid-beat stills. Fail the cut for: no cursor/click or other action on reveal, wrong logo, cover-crop, illegible UI, tiny floating device, screenshot slideshow, page-tour, invented claims, or captions that are only page titles.

## Render

Always after a reel build (the MP4 is the deliverable). Re-render when they ask for changes:

```bash
cd .readme2reel
npx remotion render Reel out/reel.mp4
npx remotion still Reel out/thumbnail.png --frame=45
```

Report path, duration, and size. Leave `.readme2reel/` out of version control.
