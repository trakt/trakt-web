import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { describe, expect, it } from 'vitest';
import { hasEnded } from './hasEnded.ts';

describe('util: hasEnded', () => {
  it('should return true for shows that wrapped up', () => {
    expect(hasEnded('ended')).toBe(true);
  });

  it('should return true for shows that were canceled', () => {
    expect(hasEnded('canceled')).toBe(true);
  });

  it('should return false for shows that are still airing', () => {
    const airingStatuses: MediaStatus[] = [
      'returning series',
      'continuing',
      'in production',
      'planned',
      'post production',
      'rumored',
      'upcoming',
      'released',
      'pilot',
    ];

    airingStatuses.forEach((status) => {
      expect(hasEnded(status)).toBe(false);
    });
  });

  it('should treat an unknown status as still airing', () => {
    expect(hasEnded('unknown')).toBe(false);
  });
});
