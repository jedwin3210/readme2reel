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

## Check before showing

- Scrub each scene in Studio at full speed. If you cannot read it twice, lengthen it or cut words.
- Check the first frame of each scene. A blank or half-faded first frame looks broken as a thumbnail.
- Compare every on-screen string with `reel-data.ts` and its `source`. Nothing may appear that the data file does not hold.

## Render

Render only when the user explicitly asks for an export:

```bash
cd reel
npx remotion render Reel out/reel.mp4
npx remotion still Reel out/thumbnail.png --frame=45
```

Report the output path, duration, and size. Leave rendered files out of version control unless the user wants them committed.
