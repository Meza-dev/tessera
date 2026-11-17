import { readFile, writeFile } from 'node:fs/promises';

const tokens = JSON.parse(await readFile(new URL('./tokens.json', import.meta.url), 'utf8'));
const css = `/* Generated from tokens.json. Run npm run build to refresh. */
:root {
  --jl-duration-fast: ${tokens.durationMs.fast}ms;
  --jl-duration-base: ${tokens.durationMs.base}ms;
  --jl-duration-slow: ${tokens.durationMs.slow}ms;
  --jl-ease-out: cubic-bezier(${tokens.easeOut.join(', ')});
  --jl-ease-standard: cubic-bezier(${tokens.easeStandard.join(', ')});
  --jl-hover-lift: ${tokens.distancePx.hoverLift}px;
  --jl-entrance-distance: ${tokens.distancePx.entrance}px;
  --jl-press-scale: ${tokens.pressScale};
  --jl-indicator-thickness: ${tokens.indicatorThicknessPx}px;
}
.jl-interactive { transition: transform var(--jl-duration-base) var(--jl-ease-out), border-color var(--jl-duration-base) ease, background var(--jl-duration-base) ease; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .jl-interactive:not(:disabled):hover { transform: translateY(var(--jl-hover-lift)); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0ms !important; transition-duration: 0ms !important; scroll-behavior: auto !important; }
  .jl-motion-content, .jl-motion-control { transform: none !important; }
}
`;
const output = new URL('./motion.css', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== css) throw new Error('Motion CSS is stale. Run npm run build.');
} else {
  await writeFile(output, css);
}
