import { describe, expect, it } from 'vitest';
import { buildTargetPrefixes } from './buildTargetPrefixes.ts';

describe('util: buildTargetPrefixes', () => {
  it('should cover every share type and media type combination', () => {
    expect(buildTargetPrefixes()).toEqual([
      'images/share/og/movie/',
      'images/share/og/show/',
      'images/share/feed/movie/',
      'images/share/feed/show/',
      'images/share/story/movie/',
      'images/share/story/show/',
    ]);
  });

  it('should scope every prefix under the share root', () => {
    const prefixes = buildTargetPrefixes();

    expect(prefixes.every((prefix) => prefix.startsWith('images/share/')))
      .toBe(true);
  });

  it('should end every prefix with a separator so it cannot match sibling keys', () => {
    const prefixes = buildTargetPrefixes();

    expect(prefixes.every((prefix) => prefix.endsWith('/'))).toBe(true);
  });
});
