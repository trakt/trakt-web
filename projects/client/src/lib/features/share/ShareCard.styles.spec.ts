import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SHARE_DIR = join(import.meta.dirname);

function listComponents(dir: string): ReadonlyArray<string> {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return listComponents(path);
    }

    return entry.name.endsWith('.svelte') ? [path] : [];
  });
}

function findNestedRules(source: string): ReadonlyArray<string> {
  const css = /<style[^>]*>([\s\S]*?)<\/style>/.exec(source)?.at(1) ?? '';

  return css.split('\n').reduce<{ depth: number; nested: string[] }>(
    ({ depth, nested }, line) => {
      const trimmed = line.trim();

      if (trimmed.endsWith('{')) {
        return {
          depth: depth + 1,
          nested: depth > 0 ? [...nested, trimmed.slice(0, -1).trim()] : nested,
        };
      }

      return { depth: trimmed === '}' ? depth - 1 : depth, nested };
    },
    { depth: 0, nested: [] },
  ).nested;
}

describe('component: ShareCard styles', () => {
  const components = listComponents(SHARE_DIR);

  it.each(components.map((path) => [path.replace(SHARE_DIR, ''), path]))(
    'should keep %s free of nested css, which takumi drops',
    (_, path) => {
      expect(findNestedRules(readFileSync(path, 'utf8'))).toEqual([]);
    },
  );
});
