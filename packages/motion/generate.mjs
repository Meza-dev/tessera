import { readFile, writeFile } from 'node:fs/promises';

const tokens = JSON.parse(await readFile(new URL('./tokens.json', import.meta.url), 'utf8'));
const properties = Object.entries({
  'duration-fast': `${tokens.durationMs.fast}ms`,
  'duration-base': `${tokens.durationMs.base}ms`,
  'duration-slow': `${tokens.durationMs.slow}ms`,
  'ease-out': `cubic-bezier(${tokens.easeOut.join(', ')})`,
  'ease-standard': `cubic-bezier(${tokens.easeStandard.join(', ')})`,
  'hover-lift': `${tokens.distancePx.hoverLift}px`,
  'entrance-distance': `${tokens.distancePx.entrance}px`,
  'press-scale': tokens.pressScale,
  'indicator-thickness': `${tokens.indicatorThicknessPx}px`,
});
const css = `/* Generated from tokens.json. Run npm run build to refresh. */
:root {
${properties.map(([name, value]) => `  --tessera-${name}: ${value};`).join('\n')}
}
:where(:root, [data-tessera-theme]) {
${properties.map(([name]) => `  --jl-${name}: var(--tessera-${name});`).join('\n')}
}
:is(.tessera-interactive, .jl-interactive) { transition: transform var(--jl-duration-base, var(--tessera-duration-base)) var(--jl-ease-out, var(--tessera-ease-out)), border-color var(--jl-duration-base, var(--tessera-duration-base)) ease, background var(--jl-duration-base, var(--tessera-duration-base)) ease; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  :is(.tessera-interactive, .jl-interactive):not(:disabled):hover { transform: translateY(var(--jl-hover-lift, var(--tessera-hover-lift))); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0ms !important; transition-duration: 0ms !important; scroll-behavior: auto !important; }
  .tessera-motion-content, .jl-motion-content, .tessera-motion-control, .jl-motion-control { transform: none !important; }
}
`;
const output = new URL('./motion.css', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== css) throw new Error('Motion CSS is stale. Run npm run build.');
} else {
  await writeFile(output, css);
}
