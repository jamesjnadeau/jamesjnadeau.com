// Runs Lighthouse CI with Chrome resolved automatically.
//
// lhci looks for a system Chrome and gives up with "Chrome installation not
// found" if there isn't one — even though Puppeteer has almost certainly already
// downloaded a copy. This resolves that copy and passes it through, so
// `npm run test:lighthouse` works on a fresh clone with no manual setup.
//
// CI sets CHROME_PATH explicitly (to the runner's preinstalled Chrome, with
// PUPPETEER_SKIP_DOWNLOAD=1), and that always wins.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

async function resolveChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  try {
    const puppeteer = await import('puppeteer');
    // executablePath() is a promise in Puppeteer 25+, a string before that.
    const path = await puppeteer.default.executablePath();
    if (path && existsSync(path)) return path;
  } catch {
    // Puppeteer missing or no browser downloaded — fall through and let lhci
    // search for a system Chrome itself.
  }
  return undefined;
}

const chromePath = await resolveChrome();
if (chromePath) process.env.CHROME_PATH = chromePath;

const child = spawn('lhci', ['autorun', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
