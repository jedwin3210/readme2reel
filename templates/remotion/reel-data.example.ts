import type { CursorPoint } from "./components/Cursor";

export const FPS = 30;

export const reel = {
  repo: "github.com/owner/name",
  takeaway: "One sentence the viewer must remember",
  accent: "#1a56db",
  bg: "#0b1220",
  scenes: [
    {
      kind: "hook" as const,
      seconds: 3,
      text: "The takeaway over the product",
      shot: "shots/phone/home.png",
      source: "README.md:3",
    },
    {
      kind: "punch" as const,
      seconds: 3,
      text: "The pain, in eight words or fewer",
      source: "README.md:5",
    },
    {
      kind: "demo" as const,
      seconds: 7,
      shot: "shots/phone/home.png",
      caption: "What the click proves",
      cursor: [
        { at: 8, x: 0.5, y: 0.82 },
        { at: 36, x: 0.5, y: 0.62, click: true },
        { at: 70, x: 0.5, y: 0.55 },
      ] satisfies CursorPoint[],
      source: "README.md:7",
    },
    {
      kind: "demo" as const,
      seconds: 5,
      shot: "shots/phone/proof.png",
      caption: "One concrete proof from the docs",
      cursor: [
        { at: 6, x: 0.2, y: 0.7 },
        { at: 40, x: 0.55, y: 0.4, click: true },
      ] satisfies CursorPoint[],
      source: "README.md:12",
    },
    {
      kind: "cta" as const,
      seconds: 3,
      text: "example.com",
      sub: "github.com/owner/name",
      source: "README.md:20",
    },
  ],
} as const;
