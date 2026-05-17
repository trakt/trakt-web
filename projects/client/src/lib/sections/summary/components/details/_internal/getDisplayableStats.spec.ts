import type { MediaStats } from '$lib/requests/models/MediaStats.ts';
import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import type { EpisodeEntry } from '../../../../../requests/models/EpisodeEntry.ts';
import type { MovieEntry } from '../../../../../requests/models/MovieEntry.ts';
import type { EpisodeStats } from '../../../../../requests/models/EpisodeStats.ts';
import {
  EMPTY_EPISODE_STATS,
  EMPTY_MEDIA_STATS,
  getDisplayableStats,
} from './getDisplayableStats.ts';

describe('getDisplayableStats', () => {
  const mediaStats: MediaStats = {
    watchers: 100,
    plays: 200,
    collectors: 50,
    comments: 10,
    lists: 25,
    favorited: 15,
    votes: 80,
  };

  const episodeStats: EpisodeStats = {
    watchers: 100,
    plays: 200,
    collectors: 50,
    comments: 10,
    lists: 25,
  };

  it('should return stats for aired media entries', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() - time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableStats({ stats: mediaStats, entry })).to.deep.equal(
      mediaStats,
    );
  });

  it('should return empty media stats preserving list count for unaired media entries', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() + time.years(1)),
      type: 'movie',
    } as unknown as MovieEntry;

    expect(getDisplayableStats({ stats: mediaStats, entry })).to.deep.equal({
      ...EMPTY_MEDIA_STATS,
      lists: mediaStats.lists,
    });
  });

  it('should return empty episode stats preserving list count for unaired episode entries', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() + time.years(1)),
      type: 'episode',
    } as unknown as EpisodeEntry;

    expect(getDisplayableStats({ stats: episodeStats, entry })).to.deep.equal({
      ...EMPTY_EPISODE_STATS,
      lists: episodeStats.lists,
    });
  });

  it('should return stats for a movie released before its air date', () => {
    const entry = {
      effectiveReleaseDate: new Date(Date.now() + time.days(7)),
      type: 'movie',
      status: 'released',
    } as unknown as MovieEntry;

    expect(getDisplayableStats({ stats: mediaStats, entry })).to.deep.equal(
      mediaStats,
    );
  });
});
