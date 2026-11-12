import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { time } from '$lib/utils/timing/time.ts';
import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { hasNowPlayingEnded } from './hasNowPlayingEnded.ts';

const startedAt = new Date('2025-01-15T12:00:00.000Z');
const expiresAt = new Date(startedAt.getTime() + time.minutes(100));

const checkin: NowPlayingItem = {
  ...UserWatchingMappedMock,
  action: 'checkin',
  startedAt,
  expiresAt,
};

const scrobble: NowPlayingItem = { ...checkin, action: 'scrobble' };

const at = (minutes: number) => startedAt.getTime() + time.minutes(minutes);

describe('util: hasNowPlayingEnded', () => {
  describe('for check-ins', () => {
    it('should keep playing before 95% of the runtime', () => {
      expect(hasNowPlayingEnded(checkin, at(94))).toBe(false);
    });

    it('should end at 95% of the runtime', () => {
      expect(hasNowPlayingEnded(checkin, at(95))).toBe(true);
    });

    it('should end past the runtime', () => {
      expect(hasNowPlayingEnded(checkin, at(120))).toBe(true);
    });
  });

  describe('for scrobbles', () => {
    it('should keep playing until the runtime runs out', () => {
      expect(hasNowPlayingEnded(scrobble, at(99))).toBe(false);
    });

    it('should end once the runtime runs out', () => {
      expect(hasNowPlayingEnded(scrobble, at(100))).toBe(true);
    });
  });
});
