# Reels with Remotion

Read this in reel mode, after the storyboard is approved. Remotion renders React components to video, so the reel is code: reviewable, diffable, and easy to regenerate when the docs change. If the repo already has its own video tooling, use that instead and keep the same storyboard and design rules.

## Set up

Scaffold into `reel/` so the video project never mixes with the project's own build or dependencies:

```bash
npx create-video@latest --yes --blank --no-tailwind reel
cd reel && npm i
npx remotion studio
```

`create-video` refuses a non-empty folder. If `reel/` exists, check whether it is already a Remotion project (a `remotion.config.ts` file or `remotion` in package.json) and reuse it. Open Studio as soon as the project runs and keep it open, so the user can watch scenes appear and steer.

Add `reel/node_modules` and `reel/out` to the project's `.gitignore` if they are not already covered.

## Structure

```
reel/
  src/
    Root.tsx          registers the composition
    Reel.tsx          sequences the scenes
    reel-data.ts      every word and timing on screen, generated from the storyboard
    scenes/           one component per scene type
  out/                renders, only when asked
```

Keep all text in `reel-data.ts`. Scenes take props and hold no copy of their own, so a docs re-sync only touches the data file:

```ts
export const FPS = 30;
export const reel = {
  repo: "github.com/owner/name",
  accent: "#4f8cff",
  scenes: [
    { kind: "title", seconds: 3, text: "Sync your README with your code", source: "README.md:3" },
    { kind: "command", seconds: 4, text: "pip install repotool", source: "pyproject.toml:2" },
    { kind: "code", seconds: 10, lines: ["repotool sync --dry-run"], source: "README.md:31" },
    { kind: "bullets", seconds: 8, items: ["Fixes stale flags", "Finds missing env vars"], source: "README.md:12-18" },
    { kind: "cta", seconds: 3, text: "github.com/owner/name", source: "package metadata" },
  ],
} as const;
```

The `source` field never renders. It lets a reviewer trace every on-screen claim back to a doc or code line.

## Register the composition

Derive the duration from the data so it can never drift from the scenes:

```tsx
import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, reel } from "./reel-data";

const total = reel.scenes.reduce((s, x) => s + Math.round(x.seconds * FPS), 0);

export const RemotionRoot = () => (
  <Composition id="Reel" component={Reel} durationInFrames={total} fps={FPS} width={1080} height={1920} />
);
```

Register a second composition at 1920 by 1080 only when the user asks for landscape. Lay out scenes with flexbox so both formats share the same components. Subtract transition overlaps from the total if you add transitions.

## Sequence the scenes

Use `Series` for back-to-back scenes, or `TransitionSeries` from `@remotion/transitions` for crossfades. Each scene starts at its own frame 0, which keeps animations local:

```tsx
import { AbsoluteFill, Series } from "remotion";

export const Reel = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b0d12" }}>
    <Series>
      {reel.scenes.map((s, i) => (
        <Series.Sequence key={i} durationInFrames={Math.round(s.seconds * FPS)}>
          <Scene scene={s} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
```

## Animate

Drive every motion from `useCurrentFrame()` with `interpolate()`, and clamp it. CSS transitions and `setTimeout` do not render, because Remotion captures each frame independently.

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const enter = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
// style={{ opacity: enter, translate: `0px ${(1 - enter) * 40}px` }}
```

Type a command by slicing the string by frame, and finish typing by the middle of the scene so the viewer can read the whole line:

```tsx
const chars = Math.floor(interpolate(frame, [0.2 * fps, 1.6 * fps], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
const shown = text.slice(0, chars);
```

Highlight a changed flag or env var with a background that grows in after the line is typed. That is the reel's version of a diff.

## Text and code

- Load fonts with `@remotion/google-fonts` or `staticFile()` plus a local font, never from a CSS URL at render time.
- Use a monospace font for commands and code, 36 px or larger. Wrap nothing: if a line does not fit, shorten the example or split the scene.
- Keep code to 8 lines per scene. Syntax colors are optional. A single accent color on the part that matters reads better on a phone.
- Put images, such as a logo, in `reel/public/` and load them with `staticFile()` and `<Img>`.

## Brand

Prefer the newest logo or mark in the repo. When several candidates exist:

1. Prefer what the live site or shared navbar and header actually render (import path, `public/` asset referenced from layout components).
2. Prefer newer file mtimes and paths that look current (`logo.svg`, `brand/`, `assets/mark`) over archives (`old/`, `v1/`, `legacy/`, dated folders).
3. Prefer SVG or high-resolution PNG over a tiny favicon when both exist.
4. Copy the chosen file into `reel/public/` and reference it with `staticFile()`. Note the source path in the storyboard so a reviewer can check it.

Do not invent a wordmark. If the repo has no mark, use the project name in type.

## Product UI

When the repo is a website or app, the reel's job is to show the product, not a terminal theme about the product.

- Capture or compose real screens: existing screenshots in the repo, Storybook stills, or a local preview you open only for the reel (this is the reel-mode tooling exception). Prefer the primary surface the README demos.
- Fit each screen into a **phone viewport** about 390 by 844 centered in the 1080 by 1920 frame, or show a **letterboxed full-width desktop** shot with letterbox bars above and below. The whole UI stays visible.
- **Ban** `object-fit: cover` and Ken Burns (slow pan/zoom) on landscape screenshots inside a 9:16 frame. Those crop chrome and type until the product is unrecognizable.
- Use `object-fit: contain` (or an explicit phone/desktop frame) so aspect ratio is preserved. Soft background behind letterboxing is fine; cropping the screenshot to fill the frame is not.
- Docs or CLI beats are allowed only as a short aside when the README's product is still the UI. If install and typed commands are the whole arc, you picked the wrong form.

## Audio

Audio is optional. Silent-first still wins: every beat must land with the sound off.

- If the user asks for music or the repo already ships a licensed track, wire that real file with Remotion's `<Audio>` and `staticFile()`.
- If there is no real track, ship the reel silent. Do not generate sine tones, noise pads, or placeholder hums to fill the timeline.

## Check before showing

- Scrub each scene in Studio at full speed. If you cannot read it twice, lengthen it or cut words.
- Check the first frame of each scene. A blank or half-faded first frame looks broken as a thumbnail.
- Compare every on-screen string with `reel-data.ts` and its `source`. Nothing may appear that the data file does not hold.
- Export or scrub mid-scene stills and fail the cut when any of these are true: the wrong or outdated logo, a cropped landscape screenshot that hides the product, or UI type and chrome you cannot recognize at a glance. For app reels, "Can I recognize the product UI?" is a hard fail, even when captions and source lines are correct.

## Render

Render only when the user explicitly asks for an export:

```bash
cd reel
npx remotion render Reel out/reel.mp4
npx remotion still Reel out/thumbnail.png --frame=45
```

Report the output path, duration, and size. Leave rendered files out of version control unless the user wants them committed.
