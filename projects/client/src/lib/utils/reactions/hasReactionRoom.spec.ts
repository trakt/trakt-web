import { describe, expect, it } from 'vitest';
import { hasReactionRoom } from './hasReactionRoom.ts';

describe('util: hasReactionRoom', () => {
  it('should have room while under the limit', () => {
    expect(hasReactionRoom({ count: 2, limit: 3 })).toBe(true);
  });

  it('should have no room once the limit is reached', () => {
    expect(hasReactionRoom({ count: 3, limit: 3 })).toBe(false);
  });

  it('should always have room without a limit', () => {
    expect(hasReactionRoom({ count: 100 })).toBe(true);
  });
});
