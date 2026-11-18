# Agent Rules — TESSERA

1. Read `docs/PRODUCT_DESIGN_SPEC.md` and `docs/ARCHITECTURE.md` before changing UI.
2. Keep all colors, spacing, and timing values centralized in tokens/motion. Do not hardcode new visual values inside components unless a documented exception is necessary.
3. Preserve restrained dark + muted cyan/violet identity, Geist typography, and focus-visible styling.
4. Every component needs keyboard and reduced-motion consideration and a Storybook example.
5. React UI must not depend on Three.js, WebGPU, or website-specific logic.
6. All public component APIs must have TypeScript types; mark breaking changes and version packages accordingly.
7. English is the default language; no non-translatable application copy inside reusable components.
8. Keep framework-neutral CSS packages independently importable.
9. Don't publish packages or modify remote repositories without explicit approval.
