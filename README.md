# TESSERA

TESSERA is the shared design system for Jonas Lab and independent experiments. Version 0.2 provides self-hosted Geist fonts, semantic design tokens, reusable React components, accessible motion primitives and Storybook examples. Personal Website and Jonas Lab consume these packages independently.

## Local setup

Requires Node.js 22.12+ and npm. Keep the local TESSERA, Personal Website and Jonas Lab directories adjacent so both apps can resolve their local package dependencies.

```bash
cd tessera
npm ci
npm run build
npm run typecheck
npm test
npm run build-storybook
```

Start the component workshop with `npm run storybook` and open its reported local URL. To run either application after building TESSERA, open its directory and run `npm ci` and `npm run dev`.

## Packages

| Package | Responsibility |
|---|---|
| `@tessera/tokens` | Framework-neutral theme CSS and local variable Geist fonts through `fonts.css`. |
| `@tessera/motion` | Framework-neutral JSON motion values and generated CSS. |
| `@tessera/ui` | Typed React components, link composition and reduced-motion-aware Motion for React primitives. |

`npm run build` regenerates motion CSS and emits UI JavaScript and declarations. Keep motion JSON and generated CSS together. React components consume the same values. Both applications use sibling `file:` dependencies, and each repository keeps its own lockfile and Git history.

## Package migration

The TESSERA naming migration keeps the foundation at version 0.2.0. Update package dependencies and imports using this mapping.

| Previous identity | TESSERA identity |
|---|---|
| Repository/folder `jonas-design-system` | `tessera` |
| Workspace `jonas-design-system-workspace` | `tessera-workspace` |
| `@jonas-lab/tokens` | `@tessera/tokens` |
| `@jonas-lab/motion` | `@tessera/motion` |
| `@jonas-lab/ui` | `@tessera/ui` |

Keep the folders adjacent, then reinstall dependencies and rebuild TESSERA before installing either application. Public React component APIs, native button/link behavior, font exports and reduced-motion contracts retain their version 0.2 behavior. CSS custom properties `--jl-*`, classes `.jl-*` and the `data-jl-theme` attribute remain compatibility interfaces.

## Current limits

Packages remain private and publishing is a future step. Full `npm audit` currently reports 7 high tooling dependency entries propagated from the unpatched picomatch advisory. `npm audit --omit=dev` reports zero findings. Run both commands to refresh the results. Build patterns are repository-controlled, and the applications have no identified visitor-controlled glob input path.

Read the [architecture](docs/ARCHITECTURE.md) and [product/design specification](docs/PRODUCT_DESIGN_SPEC.md) before extending the system.
