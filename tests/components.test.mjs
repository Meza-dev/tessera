import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer, loadConfigFromFile } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
after(() => server.close());

test('TESSERA packages resolve their published entry points', async () => {
  const ui = await import('@tessera/ui');
  assert.equal(typeof ui.Button, 'function');
  assert.equal(typeof ui.MotionProvider, 'function');
  const { default: motionTokens } = await import('@tessera/motion/tokens.json', { with: { type: 'json' } });
  assert.equal(typeof motionTokens.durationMs.fast, 'number');
  for (const entry of ['@tessera/tokens/theme.css', '@tessera/tokens/fonts.css', '@tessera/motion/motion.css']) {
    assert.ok((await readFile(new URL(import.meta.resolve(entry)), 'utf8')).length > 0, entry);
  }
});

test('preview React default imports receive browser CommonJS interop', async () => {
  const { config: storybookConfig } = await loadConfigFromFile(
    { command: 'serve', mode: 'development' }, '.storybook/main.ts',
  );
  const config = {
    configFile: false,
    cacheDir: 'node_modules/.vite/react-interop-test',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [{
      name: 'react-interop-probe',
      resolveId(id) { if (id === 'virtual:react-interop-probe') return id; },
      load(id) {
        if (id === 'virtual:react-interop-probe') return 'import React from "react"; export default React;';
      },
    }],
  };
  const previewConfig = await storybookConfig.viteFinal?.(config, { configType: 'DEVELOPMENT' }) ?? config;
  const previewServer = await createServer(previewConfig);
  try {
    const module = await previewServer.transformRequest('virtual:react-interop-probe');
    assert.ok(module?.code.includes('__vite__cjsImport'), 'React default import needs browser CommonJS interop');
    assert.ok(!module.code.includes('/node_modules/react/index.js'));
  } finally {
    await previewServer.close();
  }
});

test('shared source components render with the preview JSX runtime', async () => {
  const { Badge } = await server.ssrLoadModule('/packages/ui/src/badge.tsx');
  const { ProjectCard } = await server.ssrLoadModule('/packages/ui/src/project-card.tsx');
  assert.match(renderToStaticMarkup(createElement(Badge, null, 'Concept')), /Concept/);
  assert.match(renderToStaticMarkup(createElement(ProjectCard, {
    title: 'Example project', description: 'Fictional example', tags: ['Concept'],
  })), /Example project/);
});

test('Button defaults to a non-submitting control and preserves native types', async () => {
  const { Button } = await server.ssrLoadModule('/packages/ui/src/button.tsx');
  for (const type of [undefined, 'submit', 'reset']) {
    const html = renderToStaticMarkup(createElement(Button, { type }, 'Continue'));
    assert.match(html, new RegExp(`type="${type ?? 'button'}"`));
  }
  assert.match(renderToStaticMarkup(createElement(Button, { disabled: true }, 'Continue')), /disabled=""/);
});

test('shared motion keeps initial content visible with reduced motion', async () => {
  const { MotionProvider, ContentTransition, ActiveIndicator, canAnimate } = await server.ssrLoadModule('/packages/ui/src/motion.tsx');
  const content = createElement(MotionProvider, { reducedMotion: 'always' },
    createElement(ContentTransition, null, 'Visible content'),
    createElement(ActiveIndicator, { id: 'test-active' }));
  const html = renderToStaticMarkup(content);
  assert.ok(html.includes('Visible content'));
  assert.ok(!/opacity:\s*0|translate|scale\(/.test(html));
  assert.equal(canAnimate(null, 'user'), false);
  assert.equal(canAnimate(true, 'user'), false);
  assert.equal(canAnimate(false, 'always'), false);
  assert.equal(canAnimate(false, 'user'), true);
});

test('published motion CSS matches authoritative motion tokens', () => {
  execFileSync(process.execPath, ['packages/motion/generate.mjs', '--check']);
});

test('ProjectCard composes a custom link without nesting anchors', async () => {
  const { ProjectCard } = await server.ssrLoadModule('/packages/ui/src/project-card.tsx');
  const html = renderToStaticMarkup(createElement(ProjectCard, {
    title: 'Linked concept', description: 'Example', tags: [], href: '/experiments/example',
    renderLink: props => createElement('a', { ...props, 'data-router-link': true }),
  }));
  assert.equal((html.match(/<a\s/g) ?? []).length, 1);
  assert.match(html, /data-router-link="true"/);
  assert.match(html, /href="\/experiments\/example"/);
});

test('font stylesheet is exported with local variable-font dependencies', async () => {
  const manifest = JSON.parse(await readFile('packages/tokens/package.json', 'utf8'));
  const css = await readFile(`packages/tokens/${manifest.exports['./fonts.css']}`, 'utf8');
  assert.match(css, /@fontsource-variable\/geist\/files\/geist-latin-wght-normal\.woff2/);
  assert.match(css, /@fontsource-variable\/geist-mono\/files\/geist-mono-latin-wght-normal\.woff2/);
  assert.ok(manifest.dependencies['@fontsource-variable/geist']);
  assert.ok(manifest.files.includes('fonts.css'));
});
