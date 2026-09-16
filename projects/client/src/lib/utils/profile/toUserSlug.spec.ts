import { describe, expect, it } from 'vitest';
import { toUserSlug } from './toUserSlug.ts';

describe('toUserSlug', () => {
  it('should return the slug when it exists', () => {
    expect(toUserSlug({ slug: 'harry-potter', username: 'harry' })).toBe(
      'harry-potter',
    );
  });

  it('should fall back to the username when the slug is nullish', () => {
    expect(toUserSlug({ slug: null, username: 'harry' })).toBe('harry');
    expect(toUserSlug({ username: 'harry' })).toBe('harry');
  });
});
