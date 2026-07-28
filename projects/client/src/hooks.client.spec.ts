import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Sentry's replay integration persists a replay id in sessionStorage. That is
// the non-essential device storage the cookie banner used to exist for, so
// turning it back on silently makes the privacy policy false and the banner
// necessary again. This guard is a test rather than a lint rule because no CI
// workflow runs the linter.
const REPLAY_ENABLEMENT_TOKENS = [
  'replayIntegration',
  'replaysSessionSampleRate',
  'replaysOnErrorSampleRate',
];

const IGNORED = ['paraglide', 'node_modules', 'hooks.client.spec.ts'];

function sourceFiles(directory: string): ReadonlyArray<string> {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !IGNORED.some((ignored) => entry.name.includes(ignored)))
    .flatMap((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return sourceFiles(path);
      }

      return /\.(ts|svelte)$/.test(entry.name) ? [path] : [];
    });
}

describe('hooks.client', () => {
  it('should not enable Sentry session replay anywhere in src', () => {
    const offenders = sourceFiles(join(process.cwd(), 'src'))
      .filter((file) => {
        const contents = readFileSync(file, 'utf8');
        return REPLAY_ENABLEMENT_TOKENS.some((token) =>
          contents.includes(token)
        );
      })
      .map((file) => file.replace(process.cwd(), ''));

    expect(offenders).toEqual([]);
  });
});
