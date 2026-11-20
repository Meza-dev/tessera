import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this check with npm run smoke:package');
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const tempDirectory = await realpath(tmpdir());
const scratch = await mkdtemp(join(tempDirectory, 'tessera-package-'));
const npm = (args, cwd) => execFileSync(process.execPath, [npmCli, ...args], { cwd, encoding: 'utf8' });

try {
  const [packed] = JSON.parse(npm([
    'pack', '--workspace', '@tessera-system/tessera', '--ignore-scripts', '--json', '--pack-destination', scratch,
  ], root));
  console.log(`Packed ${packed.name}@${packed.version} (${packed.integrity})`);

  const archive = join(scratch, packed.filename);
  const probe = new URL('../tests/fixtures/package-smoke.mjs', import.meta.url);
  for (const consumer of ['css', 'react']) {
    const directory = join(scratch, consumer);
    await mkdir(directory);
    const peers = consumer === 'react' ? ['react', 'react-dom', 'motion'] : [];
    const dependencies = peers.map(peer => `${peer}@${require(`${peer}/package.json`).version}`);
    await writeFile(join(directory, 'package.json'), JSON.stringify({ private: true }));
    await copyFile(probe, join(directory, 'smoke.mjs'));
    const options = process.argv.includes('--offline') ? ['--offline'] : [];
    npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', ...options, archive, ...dependencies], directory);
    process.stdout.write(execFileSync(process.execPath, ['smoke.mjs', consumer], { cwd: directory, encoding: 'utf8' }));
  }
} finally {
  assert.equal(dirname(scratch), tempDirectory);
  await rm(scratch, { recursive: true, force: true });
}
