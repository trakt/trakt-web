import { describe, expect, it } from 'vitest';
import { contentTypeFor } from './content-type.ts';

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

  it('falls back to octet-stream for keys without an extension', () => {
    expect(contentTypeFor('no-extension')).toBe('application/octet-stream');
  });

  it('is case-insensitive on the extension', () => {
    expect(contentTypeFor('X.PNG')).toBe('image/png');
  });
});
