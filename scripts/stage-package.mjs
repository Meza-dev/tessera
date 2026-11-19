import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../LICENSE', import.meta.url), 'LICENSE');

if (process.argv.includes('--react-styles')) {
  await copyFile(new URL('../packages/ui/styles.css', import.meta.url), 'dist/styles.css');
}
