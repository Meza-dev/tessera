import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import '../packages/motion/generate.mjs';

const pack = new URL('../packages/react/', import.meta.url);
const dist = new URL('dist/', pack);
const fonts = new URL('fonts/', dist);

await mkdir(fonts, { recursive: true });

let fontCss = await readFile(new URL('../packages/tokens/fonts.css', import.meta.url), 'utf8');
for (const family of ['geist', 'geist-mono']) {
  const name = `${family}-latin-wght-normal.woff2`;
  const specifier = `@fontsource-variable/${family}/files/${name}`;
  const source = new URL(import.meta.resolve(specifier));
  await copyFile(source, new URL(name, fonts));
  await copyFile(new URL('../LICENSE', source), new URL(`${family}-OFL.txt`, fonts));
  fontCss = fontCss.replace(specifier, `./fonts/${name}`);
}

const componentCss = await readFile(new URL('../packages/ui/styles.css', import.meta.url), 'utf8');
const styleImports = "@import './fonts.css';\n@import './theme.css';\n@import './motion.css';\n\n";

await Promise.all([
  copyFile(new URL('../LICENSE', import.meta.url), new URL('LICENSE', pack)),
  copyFile(new URL('../packages/tokens/theme.css', import.meta.url), new URL('theme.css', dist)),
  copyFile(new URL('../packages/motion/motion.css', import.meta.url), new URL('motion.css', dist)),
  copyFile(new URL('../packages/motion/tokens.json', import.meta.url), new URL('tokens.json', dist)),
  writeFile(new URL('fonts.css', dist), fontCss),
  writeFile(new URL('styles.css', dist), styleImports + componentCss),
]);
