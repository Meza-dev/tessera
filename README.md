# Jonas Design System

Shared visual identity for Jonas Lab and independent experiments. Version 0.2 provides self-hosted Geist fonts, semantic design tokens, reusable React components, accessible motion primitives and Storybook examples.

## Local setup

Requires Node.js 22.12+ and npm, with access to both private GitHub repositories. Clone the projects into adjacent directories so the website's local package dependencies resolve.

```bash
git clone https://github.com/Meza-dev/jonas-design-system.git
git clone https://github.com/Meza-dev/jonas-lab.git
cd jonas-design-system
npm ci
npm run build
npm run typecheck
npm test
npm run build-storybook
```

Start the component workshop with `npm run storybook` and open its reported local URL. To run the website after building this project, use `cd ../jonas-lab`, then `npm ci` and `npm run dev`.

## Packages

| Package | Responsibility |
|---|---|
| `@jonas-lab/tokens` | Framework-neutral theme CSS and local variable Geist fonts through `fonts.css`. |
| `@jonas-lab/motion` | Framework-neutral JSON motion values and generated CSS. |
| `@jonas-lab/ui` | Typed React components, link composition and reduced-motion-aware Motion for React primitives. |

`npm run build` regenerates motion CSS and emits UI JavaScript and declarations. Keep motion JSON and generated CSS together. React components consume the same values. The website uses sibling `file:` dependencies, and each repository keeps its own lockfile and Git history.

## Current limits

Packages remain private and publishing is a future step. Full `npm audit` currently reports 7 high tooling dependency entries propagated from the unpatched picomatch advisory. `npm audit --omit=dev` reports zero findings. Run both commands to refresh the results. Build patterns are repository-controlled, and the current website has no identified visitor-controlled glob input path.

Read the [architecture](docs/ARCHITECTURE.md) and [product/design specification](docs/PRODUCT_DESIGN_SPEC.md) before extending the system.
