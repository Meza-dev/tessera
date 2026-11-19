# TESSERA

TESSERA is an MIT-licensed design system for building websites with a consistent look and feel. Use its CSS for shared colors, spacing and Geist typography, or add React components such as buttons, links, badges and project cards. Dark, violet and light editorial themes share the same foundation. Interactive components include keyboard focus styles and respect reduced-motion preferences.

## Try it locally

From the repository root, use Node.js 24 and npm 10.9 or newer.

```sh
npm ci
npm run storybook
```

Open the local address printed in your terminal. Start with **Design tokens** to compare themes, then try **Button** and **Shared primitives** to see component states and motion.

## Packages

| Package | Use it for |
|---|---|
| `@tessera/tokens` | Colors, typography, spacing and shape in `theme.css`, plus Geist Sans and Geist Mono in `fonts.css`. Works with any framework. |
| `@tessera/motion` | Transition values in `tokens.json` and CSS interactions in `motion.css`. Works with any framework. |
| `@tessera/react` | `Button`, `ActionLink`, `Badge`, `ProjectCard`, `MotionProvider`, `ContentTransition`, `ActiveIndicator`, TypeScript types and `styles.css`. |

## Install from npm

The first npm release, `0.1.0`, is pending. Once it's available, use these commands in a project with React and React DOM 19 and ESM tooling.

```sh
npm install @tessera/tokens@0.1.0 @tessera/motion@0.1.0 @tessera/react@0.1.0
```

```tsx
import '@tessera/tokens/fonts.css';
import '@tessera/tokens/theme.css';
import '@tessera/motion/motion.css';
import '@tessera/react/styles.css';
import { ActionLink, Button, MotionProvider } from '@tessera/react';

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

Install `@tessera/tokens` and optionally `@tessera/motion`. Import the CSS from any bundler that resolves npm packages and font URLs. `theme.css` and `motion.css` can also be copied and served as CSS assets.

```css
@import '@tessera/tokens/fonts.css';
@import '@tessera/tokens/theme.css';
@import '@tessera/motion/motion.css';

body {
  background: var(--jl-bg);
  color: var(--jl-text);
  font-family: var(--jl-font-sans);
}
```

## Develop and contribute

After installing dependencies, run the project checks.

```sh
npm run build
npm run typecheck
npm test
npm run build-storybook
```

See the [contribution guide](CONTRIBUTING.md), [architecture](docs/ARCHITECTURE.md) and [MIT license](LICENSE). The Geist fonts are [distributed under OFL-1.1](https://github.com/vercel/geist-font/blob/main/OFL.txt).
