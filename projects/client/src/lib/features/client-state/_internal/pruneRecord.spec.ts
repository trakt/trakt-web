import { describe, expect, it } from 'vitest';
import { pruneRecord } from './pruneRecord.ts';

describe('pruneRecord', () => {
  it('should drop expired entries and keep the rest', () => {
    expect(
      pruneRecord({
        record: { old: 1, fresh: 90 },
        now: 100,
        isExpired: (seenAt, now) => now - seenAt > 50,
      }),
    ).to.deep.equal({ fresh: 90 });
  });
});
