import { describe, expect, it } from 'vitest';
import { randomUUIDPolyfill } from './randomUUID.ts';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('crypto.randomUUID polyfill', () => {
  it('returns a v4-shaped UUID', () => {
    expect(randomUUIDPolyfill()).toMatch(UUID_V4);
  });

  it('returns unique values', () => {
    const ids = new Set(
      Array.from({ length: 1000 }, () => randomUUIDPolyfill()),
    );
    expect(ids.size).toBe(1000);
  });
});
