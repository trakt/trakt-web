import { describe, expect, it } from 'vitest';
import { toFriendActionTime } from './toFriendActionTime.ts';

const now = new Date(2026, 8, 28, 14, 0);

describe('util: toFriendActionTime', () => {
  it('should show only the clock time for today', () => {
    expect(toFriendActionTime(new Date(2026, 8, 28, 9, 30), now)).toBe(
      '9:30 AM',
    );
  });

  it('should add the day for earlier activity', () => {
    expect(toFriendActionTime(new Date(2026, 8, 27, 21, 15), now)).toBe(
      'yesterday, 9:15 PM',
    );
  });
});
