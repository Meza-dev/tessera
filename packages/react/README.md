# @tessera/react

TESSERA components and motion primitives for React 19 and ESM tooling. For server-side rendering use Node.js 22.12 or newer. Install `@tessera/tokens`, `@tessera/motion` and `@tessera/react`, then import the accompanying styles once at your application entry point.

```tsx
import '@tessera/tokens/fonts.css';
import '@tessera/tokens/theme.css';
import '@tessera/motion/motion.css';
import '@tessera/react/styles.css';
import { Button, MotionProvider } from '@tessera/react';

export function PrintButton() {
  return (
    <MotionProvider>
      <Button onClick={() => window.print()}>Print</Button>
    </MotionProvider>
  );
}
```

Use `ActionLink` for navigation, `Badge` for compact labels, and `ProjectCard` for project summaries. `MotionProvider` uses the system's motion preference by default. Use `reducedMotion="always"` to suppress shared transform and layout effects within its subtree.
