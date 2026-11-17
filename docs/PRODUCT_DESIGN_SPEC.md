# Jonas Lab — Product & Design Specification
Version 0.2 | Established design direction | English-first

## Vision
An independent creative developer lab and portfolio for interactive experiments, software projects, AI exploration, technical learning and developer tools. More interactive and personal than a conventional project gallery. All showcase examples are fictional during initial implementation.

## Brand
**Name:** Jonas Lab (approved). **Visual direction:** FORM / LAB (approved). **Tagline:** Build. Experiment. Explore. (provisional).

## Design
Inspired by Vercel Geist's clarity, but not a copy of its interface. Dark graphite foundation, refined white text, subtle borders, generous whitespace, expressive typography and restrained generative artwork. Cyan and violet accents with **reduced saturation**. Precise values are **provisional**.

### Initial tokens
- Background `#0C0D10`, surface `#15171B`, raised surface `#1D2026`, border `#303238`.
- Text `#F5F5F7`, secondary `#A1A4AD`.
- Cyan `#45B7C9`, violet `#987DBB`.
- Self-hosted Latin variable Geist Sans + Geist Mono through the shared `fonts.css` entry, with system fallbacks. Fontsource distributes both under OFL-1.1.

## Motion language
Purposeful, not decorative. Reusable hover/focus/press affordances, quick control feedback and gentle navigation/layout transitions. Use CSS timing tokens. Honor `prefers-reduced-motion`, keyboard navigation and visible focus.

Motion tokens are authored in framework-neutral JSON and generate the CSS values. React primitives consume the same tokens. Feedback uses a 120 ms ease-out, navigation settles within 220 ms, and visible content enters over 360 ms with an 8 px offset. Reduced-motion mode and an unknown initial preference keep transforms and layout feedback disabled. Content remains visible before JavaScript effects run.

## Product sections
Home, Experiments, Projects and About. Optional future Notes. An experiment should be directly playable when technically feasible; a project may instead link to a demonstration/repository.

## Global rules
Shared visual identity across repositories, without forcing React onto every project. English is default; prepare English/Spanish localization keys. Responsive and accessible layouts. Avoid overbright glow, excessive 3D, heavy gradients and large empty decorative effects.

## Status
Approved: brand, English-first, independent repositories, dark minimal visual direction, restrained cyan/violet, motion and reusable design system.
Provisional: actual accent hex values, logo details, tagline, animation curves, packaging/deployment strategy.
