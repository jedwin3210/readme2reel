# Changelog

## 0.3.0

- Reel deliverable is the **MP4**: after storyboard approval (or when the user already asked to make the reel), render `.readme2reel/out/reel.mp4` in the same turn — do not stop at Studio.
- Ship copyable Remotion templates under `templates/remotion/` (PhoneFrame, Cursor + click ring, Hook, Demo, Punch, Cta) plus `scripts/capture-ui.mjs` for phone/desktop captures.
- Agents must copy those templates instead of inventing screenshot slideshows.

## 0.2.0

- Reel craft: lock one takeaway; hook is not the logo; five-beat spine (hook → problem → reveal → proof → CTA); cap social reels at 15–30s and five scenes; ban flat page-tour slideshows and page-title captions.
- Motion is mandatory: cursor paths + click rings, typed demos, punch/flash panels, hard cuts — a screenshot+caption slideshow is a hard fail. Prefer short screen recordings when available.
- Scale rules: phone chrome ~900–1000px wide in 1080; product must fill the frame; ban tiny floating device cards, `object-fit: cover`, and Ken Burns on landscape shots in 9:16.
- Hide Remotion scaffolding under gitignored `.readme2reel/` instead of a visible `reel/` dump; storyboard + optional mp4 are the user-facing deliverables.
- Eval paths and graders updated for `.readme2reel/`, hook/tour quality, and motion.

## 0.1.1

- Reel storyboards follow the product surface: websites and apps lead with real UI; CLI install slideshows only when the product is a CLI or library.
- Brand picks the newest logo or mark (path, mtime, live site or navbar).
- App reels must show recognizable UI in a phone viewport or letterboxed desktop; ban `object-fit: cover` and Ken Burns on landscape shots in 9:16.
- Audio stays optional and silent-first; no generated sine or noise pads.
- Pre-show QA scrubs stills for crop, wrong logo, and illegible UI.

## 0.1.0

- First release. Audit, sync, embedded, and reel modes.
- References for Python packages, Node packages, web apps, Jupyter courses, and Remotion reels.
- Eval suite for `claude plugin eval`: install drift, renamed flag, missing env var, an already-correct README, and a reel storyboard.
