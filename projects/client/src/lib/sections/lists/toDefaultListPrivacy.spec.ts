import { describe, expect, it } from 'vitest';
import { toDefaultListPrivacy } from './toDefaultListPrivacy.ts';

describe('util: toDefaultListPrivacy', () => {
  it('should default to private for private accounts', () => {
    expect(toDefaultListPrivacy({ isPrivate: true })).toBe('private');
  });

  it('should default to public otherwise', () => {
    expect(toDefaultListPrivacy({ isPrivate: false })).toBe('public');
    expect(toDefaultListPrivacy(undefined)).toBe('public');
  });
});
