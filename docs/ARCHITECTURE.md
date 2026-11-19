# TESSERA package boundaries

TESSERA is an npm workspace shared by independent products. CSS-only consumers can use its foundation packages. React consumers opt in to the component package and a single React runtime supplied by their application.

| Workspace | Responsibility |
|---|---|
| `packages/tokens` | Semantic CSS for dark, violet and editorial themes. Fontsource supplies the Geist assets used by `fonts.css`. |
| `packages/motion` | Framework-neutral timing and easing tokens. `generate.mjs` emits CSS from `tokens.json`. |
| `packages/react` | The published ESM, declarations and styles for shared React components. Build output is compiled from `packages/ui/src` and copies the shared stylesheet. |
| `packages/ui` | Canonical component and stylesheet source plus Storybook examples. Its private `@tessera/ui` package keeps existing sibling applications working during the transition. |

The npm tarballs declare React and React DOM as peers and resolve their other dependencies from the registry. The artifact uses the same CSS and TypeScript sources as the private workspace, so fixes benefit both paths. Tokens and motion CSS remain independently importable.

## Interface contracts

- The `--jl-*` CSS properties, `.jl-*` classes and `data-jl-theme` attribute retain their established names.
- `ActionLink` and `ProjectCard` have a typed `renderLink` prop so applications can compose router links with anchor semantics. A card without a destination renders as an article.
- `MotionProvider` follows the system setting by default and accepts `reducedMotion="always"`. An unknown initial setting also suppresses React transform and layout effects while leaving content visible.
- Both build and Storybook use the automatic JSX runtime. Storybook prebundles React and React DOM for browser-compatible CommonJS interop.

## Application adoption

For an application that links to the sibling TESSERA workspace, build TESSERA before running `npm ci` in the application. The local React imports are `@tessera/ui` and `@tessera/ui/styles.css`.

Once the registry versions are verified, switch those imports to `@tessera/react` and `@tessera/react/styles.css`, replace the three local dependency specifiers with the published versions and regenerate the application's lockfile. Keep the token and motion imports and the theme attribute. Update resolution tests to target the installed exports, and remove Vite path exceptions used only for TESSERA's sibling font directories. Check all local consumers before retiring the private workspace.
