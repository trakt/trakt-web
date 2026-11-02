import { describe, expect, it } from 'vitest';
import { isShareSlug } from './isShareSlug.ts';

describe('util: isShareSlug', () => {
  it.each(['sean', 'mike-d', 'mike.d', 'j_doe.2'])(
    'should accept %s',
    (slug) => {
      expect(isShareSlug(slug)).toBe(true);
    },
  );

  it.each(['', '.', '..', '.sean', 'sean.', 'se..an', 'se/an', '%2e%2e'])(
    'should reject %s',
    (slug) => {
      expect(isShareSlug(slug)).toBe(false);
    },
  );
});
