---
type: llm
focus: { source: file, path: .readme2reel/storyboard.md }
---

This fixture is a marketing website / notes app, not a CLI. Grade the storyboard as a short social reel someone would finish muted.

Pass when:
- It locks one takeaway from the README (clean three-pane desk for writers).
- The first beat is a hook on that takeaway or the product UI — not a logo-only splash.
- Most runtime is recognizable product UI (phone viewport or letterboxed desktop) for the three-pane desk, plus at most one proof beat and a single CTA to notedesk.example.
- Reveal/proof beats describe motion: cursor move + click, tap, typed action, punch panel, or a short recording — not “hold screenshot”.
- At most five scenes, roughly 15–30 seconds, with source lines and an action note per scene.
- Captions state ideas, not bare page titles.

Fail when:
- The arc is a CLI slideshow (install → typed terminal → feature bullets) with no product UI.
- Scene 1 is only a logo or wordmark card.
- It tours many nav-style pages with no spine, or is only static screenshots with captions (a slideshow, not a video).
- It invents features, metrics, or quotes the README does not contain.
- It proposes scaffolding under a visible `reel/` folder instead of `.readme2reel/`.
