import { describe, expect, it } from 'vitest';
import { xmlEscape, xmlUnescape } from './xml.ts';

describe('xmlEscape', () => {
  it('escapes all five predefined XML entities', () => {
    expect(xmlEscape(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('escapes & once, not recursively (no double-encoding)', () => {
    expect(xmlEscape('a & b')).toBe('a &amp; b');
    expect(xmlEscape('a &amp; b')).toBe('a &amp;amp; b');
  });

  it('leaves untouched strings without special characters', () => {
    expect(xmlEscape('plain key/path/file.js')).toBe('plain key/path/file.js');
  });
});

describe('xmlUnescape', () => {
  it('decodes all five predefined XML entities', () => {
    expect(xmlUnescape('&amp;&lt;&gt;&quot;&apos;')).toBe(`&<>"'`);
  });

  it('decodes &amp; last so &amp;lt; survives the &lt; pass', () => {
    expect(xmlUnescape('&amp;lt;')).toBe('&lt;');
  });
});

describe('xmlEscape ↔ xmlUnescape round trip', () => {
  it.each([
    'simple',
    'key with & ampersand',
    'angle <brackets>',
    `mixed " ' & < > all`,
    '_app/immutable/chunks/abc.js',
    '',
  ])('round-trips %j', (input) => {
    expect(xmlUnescape(xmlEscape(input))).toBe(input);
  });
});
