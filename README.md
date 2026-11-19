# TESSERA

TESSERA is an MIT-licensed design system for building websites with a consistent look and feel. Use its CSS for shared colors, spacing and Geist typography, or add React components such as buttons, links, badges and project cards. Dark, violet and light editorial themes share the same foundation. Interactive components include keyboard focus styles and respect reduced-motion preferences.

## Try it locally

From the repository root, use Node.js 24 and npm 10.9 or newer.

```sh
npm ci
npm run storybook
```

Open the local address printed in your terminal. Start with **Design tokens** to compare themes, then try **Button** and **Shared primitives** to see component states and motion.

## Install from npm

TESSERA is available on npm as [`@tessera-system/tessera`](https://www.npmjs.com/package/@tessera-system/tessera). Install version `0.1.0` with the command below.

```sh
npm install @tessera-system/tessera@0.1.0
```

### React

Use React and React DOM 19, Motion 14.14 or newer on the 14.x line, and ESM tooling. Install any missing peers with `npm install react@^19 react-dom@^19 motion@^14.14.0`. For Node.js SSR, use Node.js 22.12 or newer.

```tsx
import '@tessera-system/tessera/styles.css';
import { ActionLink, Button, MotionProvider } from '@tessera-system/tessera';

export function App() {
  return (
    <MotionProvider>
      <Button onClick={() => window.print()}>Print</Button>
      <ActionLink href="/projects" variant="secondary">Projects</ActionLink>
    </MotionProvider>
  );
}
```

Apply `font-family: var(--jl-font-sans)` to your page and use `var(--jl-font-mono)` for code. The dark theme is the default. Add `data-jl-theme="violet"` or `data-jl-theme="editorial"` to a containing element to opt in to a different palette.

### CSS outside React

The CSS exports work with any framework and install without the React peers. Use these imports with an npm-aware bundler. To host CSS as static assets, serve the stylesheets with their relative `fonts/` directory intact.

```css
@import '@tessera-system/tessera/fonts.css';
@import '@tessera-system/tessera/theme.css';
@import '@tessera-system/tessera/motion.css';

body {
  background: var(--jl-bg);
  color: var(--jl-text);
  font-family: var(--jl-font-sans);
}
```

| Export | Use it for |
|---|---|
| `@tessera-system/tessera` | Typed React controls, cards and motion primitives. |
| `styles.css` | A single import for typography, theme, motion and component styles. |
| `theme.css` and `fonts.css` | Color, spacing and shape tokens, plus self-hosted Geist Sans and Geist Mono. |
| `motion.css` and `tokens.json` | CSS interactions and framework-neutral timing and easing values. |

## Develop and contribute

After installing dependencies, run the project checks.

```sh
npm run build
npm run typecheck
npm test
npm run build-storybook
```

See the [contribution guide](CONTRIBUTING.md), [architecture](docs/ARCHITECTURE.md) and [MIT license](LICENSE). The Geist fonts are [distributed under OFL-1.1](https://github.com/vercel/geist-font/blob/main/OFL.txt).
