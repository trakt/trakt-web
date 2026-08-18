import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const supportedFormat = /\.(ttf|otf)$/i;

let cached: Buffer | undefined;

function queryFontconfig(): string {
  try {
    return execFileSync(
      'fc-match',
      ['sans-serif', '--format=%{file}'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
  } catch {
    throw new Error('fc-match not found. Install fontconfig.');
  }
}

export function loadSystemFont(): Buffer {
  if (cached) {
    return cached;
  }

  const path = queryFontconfig();

  if (!supportedFormat.test(path) || !existsSync(path)) {
    throw new Error(`fc-match returned an unusable font: ${path}`);
  }

  cached = readFileSync(path);

  return cached;
}
