import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const packageName = '@tessera-system/tessera';
const file = name => new URL(import.meta.resolve(`${packageName}/${name}`));
const read = name => readFile(file(name), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../package.json', file('theme.css')), 'utf8'));
assert.equal(manifest.name, packageName);
assert.deepEqual({ ...manifest.dependencies, ...manifest.optionalDependencies }, {});
assert.match(await read('theme.css'), /--tessera-bg[\s\S]*--jl-bg/);
assert.match(await read('motion.css'), /--tessera-duration-base[\s\S]*--jl-duration-base/);
assert.match(await read('styles.css'), /tessera-btn[\s\S]*jl-btn/);

const fontUrls = [...(await read('fonts.css')).matchAll(/url\('([^']+)'\)/g)];
assert.equal(fontUrls.length, 2);
for (const [, path] of fontUrls) {
  const font = await readFile(new URL(path, file('fonts.css')));
  assert.equal(font.subarray(0, 4).toString(), 'wOF2');
}
const { default: tokens } = await import(`${packageName}/tokens.json`, { with: { type: 'json' } });
assert.equal(typeof tokens.durationMs.base, 'number');

if (process.argv[2] === 'css') {
  for (const peer of ['react', 'react-dom', 'motion']) {
    await assert.rejects(access(new URL(`./node_modules/${peer}`, import.meta.url)), { code: 'ENOENT' },
      `CSS-only installation unexpectedly added ${peer}`);
  }
  console.log('CSS-only installation resolved all CSS, JSON and font assets without optional peers.');
} else {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const ui = await import(packageName);
  const markup = renderToStaticMarkup(createElement(ui.MotionProvider, { reducedMotion: 'always' },
    createElement(ui.Button, null, 'Preview')));
  assert.match(markup, /class="[^"]*\bjl-btn\b[^"]*\btessera-btn\b/);
  assert.match(markup, />Preview<\/button>/);
  assert.match(await readFile(new URL(manifest.exports['.'].types, new URL('../', file('theme.css'))), 'utf8'), /ButtonProps/);
  console.log('React installation resolved ESM and types and rendered both class families in SSR.');
}
