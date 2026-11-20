import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer, loadConfigFromFile } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
after(() => server.close());

test('the public TESSERA package resolves its React, motion and standalone CSS exports', async () => {
  const ui = await import('@tessera-system/tessera');
  const button = createElement(ui.MotionProvider, { reducedMotion: 'always' }, createElement(ui.Button, null, 'Preview'));
  assert.match(renderToStaticMarkup(button), /type="button"[^>]*>Preview<\/button>/);
  const { default: motionTokens } = await import('@tessera-system/tessera/tokens.json', { with: { type: 'json' } });
  assert.equal(typeof motionTokens.durationMs.fast, 'number');
  for (const entry of ['theme.css', 'fonts.css', 'motion.css', 'styles.css']) {
    assert.ok((await readFile(new URL(import.meta.resolve(`@tessera-system/tessera/${entry}`)), 'utf8')).length > 0, entry);
  }
  const fontsUrl = new URL(import.meta.resolve('@tessera-system/tessera/fonts.css'));
  const fontsCss = await readFile(fontsUrl, 'utf8');
  const fontPaths = [...fontsCss.matchAll(/url\('([^']+)'\)/g)].map(match => match[1]);
  assert.equal(fontPaths.length, 2);
  for (const fontPath of fontPaths) {
    assert.match(fontPath, /^\.\/fonts\/.*\.woff2$/);
    const font = await readFile(new URL(fontPath, fontsUrl));
    assert.equal(font.subarray(0, 4).toString(), 'wOF2');
  }
});

test('public React components emit TESSERA classes and legacy classes together', async () => {
  const { Button, ActionLink, Badge, ProjectCard, ContentTransition, ActiveIndicator } = await import('@tessera-system/tessera');
  const cases = [
    [createElement(Button, { variant: 'secondary' }, 'Button'), ['btn', 'btn--secondary', 'motion-control']],
    [createElement(ActionLink, { href: '#example' }, 'Link'), ['btn', 'btn--primary', 'motion-control']],
    [createElement(Badge, null, 'Badge'), ['badge']],
    [createElement(ProjectCard, { href: '#project', title: 'Project', description: 'A card', tags: ['CSS'] }), ['card', 'card__visual', 'card__heading', 'card__arrow', 'card__tags', 'motion-control']],
    [createElement(ContentTransition, null, 'Content'), ['motion-content']],
    [createElement(ActiveIndicator, { id: 'preview' }), ['active-indicator']],
  ];
  for (const [element, expected] of cases) {
    const classes = new Set([...renderToStaticMarkup(element).matchAll(/class="([^"]+)"/g)].flatMap(match => match[1].split(' ')));
    for (const name of expected) {
      assert.ok(classes.has(`tessera-${name}`), `Missing tessera-${name}`);
      assert.ok(classes.has(`jl-${name}`), `Missing jl-${name}`);
    }
  }
});

test('distributed CSS retains the legacy theme, token, focus and motion contracts', async () => {
  const readExport = name => readFile(new URL(import.meta.resolve(`@tessera-system/tessera/${name}`)), 'utf8');
  const [theme, styles, motion] = await Promise.all(['theme.css', 'styles.css', 'motion.css'].map(readExport));
  for (const name of ['editorial', 'violet']) {
    assert.ok(theme.includes(`[data-tessera-theme='${name}']`));
    assert.ok(theme.includes(`[data-jl-theme='${name}']`));
  }
  for (const name of new Set([...theme.matchAll(/--tessera-([\w-]+):/g)].map(match => match[1]))) {
    assert.match(theme, new RegExp(`--jl-${name}\\s*:\\s*var\\(--tessera-${name}\\)`));
  }
  assert.match(styles, /:is\(\.tessera-btn, \.jl-btn\):focus-visible/);
  assert.match(styles, /var\(--jl-text, var\(--tessera-text\)\)/);
  assert.match(motion, /:is\(\.tessera-interactive, \.jl-interactive\):not\(:disabled\):hover/);
  assert.match(motion, /--jl-duration-base:\s*var\(--tessera-duration-base\)/);
  assert.match(motion, /prefers-reduced-motion: reduce[\s\S]*\.tessera-motion-content[\s\S]*\.jl-motion-content/);
});

test('only the consolidated TESSERA workspace is public and CSS installs have no runtime dependencies', async () => {
  const directories = await readdir('packages', { withFileTypes: true });
  const manifests = await Promise.all(directories.filter(entry => entry.isDirectory()).map(async entry =>
    JSON.parse(await readFile(`packages/${entry.name}/package.json`, 'utf8')),
  ));
  const publicManifests = manifests.filter(manifest => manifest.private !== true);
  assert.deepEqual(publicManifests.map(manifest => manifest.name), ['@tessera-system/tessera']);
  const [manifest] = publicManifests;
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.publishConfig.access, 'public');
  assert.equal(manifest.license, 'MIT');
  assert.deepEqual({ ...manifest.dependencies, ...manifest.optionalDependencies }, {});
  assert.deepEqual(Object.keys(manifest.peerDependencies).sort(), ['motion', 'react', 'react-dom']);
  for (const [peer, range] of Object.entries(manifest.peerDependencies)) {
    assert.equal(manifest.peerDependenciesMeta[peer].optional, true);
    assert.doesNotMatch(range, /^(file|link|workspace):/);
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

test('a static ProjectCard does not advertise navigation', async () => {
  const { ProjectCard } = await server.ssrLoadModule('/packages/ui/src/project-card.tsx');
  const html = renderToStaticMarkup(createElement(ProjectCard, {
    title: 'Static card', description: 'An example without a destination', tags: [],
  }));
  assert.match(html, /<article\b/);
  assert.doesNotMatch(html, /<a\b|jl-card__arrow/);
});

test('editorial cards keep a single accessible project link without rendering unrequested badges', async () => {
  const { ProjectCard } = await server.ssrLoadModule('/packages/ui/src/project-card.tsx');
  const html = renderToStaticMarkup(createElement(ProjectCard, {
    title: 'Featured project', description: 'A concise project description', tags: ['Unrequested badge'],
    href: '/projects/featured', variant: 'editorial', tone: 'sage',
  }));
  assert.equal((html.match(/<a\s/g) ?? []).length, 1);
  assert.match(html, /href="\/projects\/featured"/);
  assert.match(html, /Featured project/);
  assert.match(html, /A concise project description/);
  assert.doesNotMatch(html, /Unrequested badge/);
});

test('font stylesheet is exported with local variable-font dependencies', async () => {
  const manifest = JSON.parse(await readFile('packages/tokens/package.json', 'utf8'));
  const css = await readFile(`packages/tokens/${manifest.exports['./fonts.css']}`, 'utf8');
  assert.match(css, /@fontsource-variable\/geist\/files\/geist-latin-wght-normal\.woff2/);
  assert.match(css, /@fontsource-variable\/geist-mono\/files\/geist-mono-latin-wght-normal\.woff2/);
  assert.ok(manifest.dependencies['@fontsource-variable/geist']);
  assert.ok(manifest.files.includes('fonts.css'));
});
