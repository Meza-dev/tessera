# @tessera-system/tessera

TESSERA bundles semantic CSS tokens, Geist fonts, motion styles and typed React components. For CSS-only projects, import `theme.css`, `fonts.css` or `motion.css` directly under the package name. The stylesheets and font assets also work when served together as static files.

## React usage

Use React and React DOM 19, Motion 14.14 or newer on the 14.x line, and ESM tooling. The peers are optional for CSS consumers. For server-side rendering use Node.js 22.12 or newer.

```sh
npm install @tessera-system/tessera react@^19 react-dom@^19 motion@^14.14.0
```

```tsx
import '@tessera-system/tessera/styles.css';
import { Button, MotionProvider } from '@tessera-system/tessera';

export function PrintButton() {
  return (
    <MotionProvider>
      <Button onClick={() => window.print()}>Print</Button>
    </MotionProvider>
  );
}
```

Use `ActionLink` for navigation, `Badge` for compact labels, and `ProjectCard` for project summaries. `MotionProvider` uses the system's motion preference by default. Use `reducedMotion="always"` to suppress shared transform and layout effects within its subtree.

Use `--tessera-*` tokens, `.tessera-*` classes and `data-tessera-theme` for new styles. For example, `data-tessera-theme="editorial"` enables the light palette and `--tessera-font-sans` selects Geist Sans. Existing `--jl-*`, `.jl-*` and `data-jl-theme` names remain supported.

TESSERA is MIT-licensed. Included Geist font files are available under OFL-1.1 with notices next to the font assets.
