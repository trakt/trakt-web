import { describe, expect, it } from 'vitest';
import { toContentHash } from './toContentHash.ts';

describe('util: toContentHash', () => {
  it('should return a short hex hash', async () => {
    expect(await toContentHash({ name: 'Sean' })).toMatch(/^[0-9a-f]{12}$/);
  });

  it('should be stable for the same content', async () => {
    expect(await toContentHash({ name: 'Sean' })).toBe(
      await toContentHash({ name: 'Sean' }),
    );
  });

  it('should change when the content changes', async () => {
    expect(await toContentHash({ name: 'Sean' })).not.toBe(
      await toContentHash({ name: 'Justin' }),
    );
  });
});
