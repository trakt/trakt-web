import { describe, expect, it } from 'vitest';
import { MAX_STORED_RECENT_LISTS, pushRecentList } from './pushRecentList.ts';

describe('util: pushRecentList', () => {
  it('should put the newest list first', () => {
    expect(pushRecentList([1], 2)).toEqual([2, 1]);
  });

  it('should move a repeated list to the front without duplicating it', () => {
    expect(pushRecentList([1, 2], 2)).toEqual([2, 1]);
  });

  it('should drop the oldest entries past the cap', () => {
    const full = Array.from({ length: MAX_STORED_RECENT_LISTS }, (_, i) => i);

    const result = pushRecentList(full, 100);

    expect(result).toHaveLength(MAX_STORED_RECENT_LISTS);
    expect(result.at(0)).toBe(100);
    expect(result).not.toContain(MAX_STORED_RECENT_LISTS - 1);
  });
});
