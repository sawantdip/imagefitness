import { spawnSync } from 'node:child_process';
import './build-static-snapshot.mjs';
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, STATIC_SNAPSHOT: '1' },
  shell: process.platform === 'win32',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
