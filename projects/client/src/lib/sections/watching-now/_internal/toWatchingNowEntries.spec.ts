import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toWatchingNowEntries } from './toWatchingNowEntries.ts';

const now = new Date('2026-11-05T20:30:00Z').getTime();

function user(slug: string): UserProfile {
  return { ...UserProfileHarryMappedMock, key: `user-${slug}`, slug };
}

function watching(startedAt: string, expiresAt: string): NowPlayingItem {
  return {
    ...UserWatchingMappedMock,
    startedAt: new Date(startedAt),
    expiresAt: new Date(expiresAt),
  };
}

describe('util: toWatchingNowEntries', () => {
  it('should pair each user with what they are watching, newest start first', () => {
    const entries = toWatchingNowEntries({
      users: [user('kim'), user('harry')],
      watching: [
        watching('2026-11-05T20:00:00Z', '2026-11-05T21:00:00Z'),
        watching('2026-11-05T20:20:00Z', '2026-11-05T21:20:00Z'),
      ],
      now,
    });

    expect(entries.map((entry) => entry.user.slug)).toEqual(['harry', 'kim']);
  });

  it('should leave out users who are not watching', () => {
    const entries = toWatchingNowEntries({
      users: [user('kim'), user('harry')],
      watching: [
        null,
        watching('2026-11-05T20:20:00Z', '2026-11-05T21:20:00Z'),
      ],
      now,
    });

    expect(entries.map((entry) => entry.key)).toEqual(['user-harry']);
  });

  it('should drop a watch that has already ended', () => {
    const entries = toWatchingNowEntries({
      users: [user('kim')],
      watching: [watching('2026-11-05T19:00:00Z', '2026-11-05T20:00:00Z')],
      now,
    });

    expect(entries).toEqual([]);
  });
});
