# TESSERA package boundaries

TESSERA uses npm workspaces to build one public package, `@tessera-system/tessera`. CSS-only consumers can import the styles directly. React consumers use the same package with the React, React DOM and Motion versions supplied by their application.

| Workspace | Responsibility |
|---|---|
| `packages/tokens` | Private workspace for semantic CSS and the Fontsource Geist build inputs. |
| `packages/motion` | Private workspace for timing and easing tokens. `generate.mjs` emits CSS from `tokens.json`. |
| `packages/react` | The public workspace. Builds ESM and declarations from `packages/ui/src` and stages the theme, motion CSS and licensed Geist assets. |
| `packages/ui` | Canonical component and stylesheet source plus Storybook examples. Its private `@tessera/ui` package keeps existing sibling applications working during the transition. |

The public package declares React, React DOM and Motion as optional peers so installing only CSS does not install them. Both React builds use the same source and a private `#motion-tokens` import. The public manifest resolves it to the JSON inside the tarball, and the private UI manifest resolves it to its existing motion workspace. Font URLs in the tarball are relative to `fonts.css`.

## Interface contracts

- The `--jl-*` CSS properties, `.jl-*` classes and `data-jl-theme` attribute retain their established names.
- `ActionLink` and `ProjectCard` have a typed `renderLink` prop so applications can compose router links with anchor semantics. A card without a destination renders as an article.
- `MotionProvider` follows the system setting by default and accepts `reducedMotion="always"`. An unknown initial setting also suppresses React transform and layout effects while leaving content visible.
- Both build and Storybook use the automatic JSX runtime. Storybook prebundles React and React DOM for browser-compatible CommonJS interop.

## Application adoption

For an application that links to the sibling TESSERA workspace, build TESSERA before running `npm ci` in the application. The local React imports are `@tessera/ui` and `@tessera/ui/styles.css`.

Once the registry version is verified, replace the three local dependency specifiers with `@tessera-system/tessera` and regenerate the application's lockfile. Switch React imports to `@tessera-system/tessera` and use `@tessera-system/tessera/styles.css` in place of the four legacy CSS imports. Keep the theme attribute and update any motion JSON import to `@tessera-system/tessera/tokens.json`. Update resolution tests to target the installed exports and remove Vite path exceptions used only for TESSERA's sibling font directories. Check all local consumers before retiring the private workspaces.
