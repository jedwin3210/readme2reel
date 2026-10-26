# Remotion templates for readme2reel

Copy these into `.readme2reel/src/` after scaffolding. Adapt props and `reel-data.ts`; do not invent slideshow scene kinds.

| File | Use |
|---|---|
| `components/PhoneFrame.tsx` | 9:16 product UI, `object-fit: contain`, large chrome (~960px) |
| `components/Cursor.tsx` | Pointer + click ring from waypoints in `reel-data` |
| `scenes/Hook.tsx` | Claim over product UI (not a logo splash) |
| `scenes/Demo.tsx` | Phone still + cursor path |
| `scenes/Punch.tsx` | One-line flash claim between UI beats |
| `scenes/Cta.tsx` | Single URL |
| `reel-data.example.ts` | Shape for copy, timings, cursor waypoints |

Capture UI with `scripts/capture-ui.mjs` from the skill repo.
