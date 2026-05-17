import { describe, expect, it } from 'vitest';
import { contentTypeFor, manifestKeyFor } from './r2.ts';

describe('manifestKeyFor', () => {
  it('builds an ISO-prefixed key sortable lexicographically by time', () => {
    const a = manifestKeyFor('abc1234', new Date('2026-01-01T00:00:00Z'));
    const b = manifestKeyFor('def5678', new Date('2026-01-02T00:00:00Z'));
    expect(a < b).toBe(true);
    expect(a).toMatch(/^releases\/2026-01-01T00-00-00-000Z_abc1234\.json$/);
  });
});

describe('contentTypeFor', () => {
  it.each([
    ['x.js', 'text/javascript; charset=utf-8'],
    ['x.mjs', 'text/javascript; charset=utf-8'],
    ['x.css', 'text/css; charset=utf-8'],
    ['x.map', 'application/json; charset=utf-8'],
    ['x.svg', 'image/svg+xml'],
    ['x.woff2', 'font/woff2'],
    ['x.png', 'image/png'],
    ['x.unknown', 'application/octet-stream'],
  ])('maps %s → %s', (input, expected) => {
    expect(contentTypeFor(input)).toBe(expected);
  });
});
