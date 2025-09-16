import { describe, expect, it } from 'vitest';
import { assertDefined } from '../../utils/assert/assertDefined.ts';
import { EpisodeComputedType } from '../models/EpisodeType.ts';
import type {
  EpisodeActivity,
  SocialActivity,
} from '../models/SocialActivity.ts';
import { coalesceBinges } from './coalesceBinges.ts';

describe('coalesceBinges', () => {
  const USER_SLUG_ALICE = 'alice';
  const USER_SLUG_BOB = 'bob';

  function makeUserProfile(slug: string, username?: string) {
    return {
      slug,
      username: username ?? slug,
      name: { full: slug, first: slug, last: '' },
      private: false,
      isVip: false,
      isDirector: false,
      isDeleted: false,
      avatar: { url: '' },
      location: null,
      about: null,
      cover: { url: null },
    };
  }

  function makeEpisodeActivity({
    id,
    showId,
    episodeId,
    userSlugs,
    activityAt,
  }: {
    id: number;
    showId: number;
    episodeId: number;
    userSlugs: string[];
    activityAt: Date;
    type?: string;
  }) {
    return {
      id,
      type: 'episode' as const,
      activityAt,
      users: userSlugs.map((slug) => makeUserProfile(slug)),
      episode: {
        id: episodeId,
        season: 1,
        number: episodeId,
        type: 'standard',
      },
      show: {
        id: showId,
      },
    } as EpisodeActivity;
  }

  function makeMovieActivity({
    id,
    movieId,
    userSlugs,
    activityAt,
  }: {
    id: number;
    movieId: number;
    userSlugs: string[];
    activityAt: Date;
  }) {
    return {
      id,
      type: 'movie' as const,
      activityAt,
      users: userSlugs.map((slug) => makeUserProfile(slug)),
      movie: {
        id: movieId,
      },
    } as SocialActivity;
  }

  it('should coalesce binge watches for episodes watched by the same users on the same day', () => {
    const activities = [
      makeEpisodeActivity({
        id: 1,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
      makeEpisodeActivity({
        id: 2,
        showId: 1,
        episodeId: 2,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
      makeEpisodeActivity({
        id: 3,
        showId: 1,
        episodeId: 3,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
    ];
    const result = coalesceBinges(activities);
    expect(result).toHaveLength(1);

    const activity = assertDefined(result[0]) as EpisodeActivity;
    expect(activity.type).toBe('episode');
    expect(activity.episode.type).toBe(EpisodeComputedType.multiple_episodes);
    expect(activity.episode.episodes).toHaveLength(3);
  });

  it('should not coalesce episodes watched by different users', () => {
    const activities = [
      makeEpisodeActivity({
        id: 1,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
      makeEpisodeActivity({
        id: 2,
        showId: 1,
        episodeId: 2,
        userSlugs: [USER_SLUG_BOB],
        activityAt: new Date('2024-01-01'),
      }),
    ];
    const result = coalesceBinges(activities);
    expect(result).toHaveLength(2);
  });

  it('should not coalesce episodes watched on different days', () => {
    const activities = [
      makeEpisodeActivity({
        id: 1,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
      makeEpisodeActivity({
        id: 2,
        showId: 1,
        episodeId: 2,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-02'),
      }),
    ];
    const result = coalesceBinges(activities);
    expect(result).toHaveLength(2);
  });

  it('should include movie activities and sort by activityAt descending', () => {
    const activities = [
      makeMovieActivity({
        id: 1,
        movieId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-02'),
      }),
      makeEpisodeActivity({
        id: 2,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
      makeEpisodeActivity({
        id: 3,
        showId: 1,
        episodeId: 2,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
    ];
    const result = coalesceBinges(activities);
    expect(assertDefined(result[0]).type).toBe('movie');
    expect(assertDefined(result[1]).type).toBe('episode');
  });

  it('should handle single episode activity', () => {
    const activities = [
      makeEpisodeActivity({
        id: 1,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01'),
      }),
    ];
    const result = coalesceBinges(activities);
    expect(result).toHaveLength(1);

    const activity = assertDefined(result[0]) as EpisodeActivity;
    expect(activity.type).toBe('episode');
    expect(activity.episode.id).toBe(1);
  });

  it('should sort coalesced binges', () => {
    const activities = [
      makeEpisodeActivity({
        id: 1,
        showId: 1,
        episodeId: 3,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01T05:00:00'),
      }),
      makeEpisodeActivity({
        id: 2,
        showId: 1,
        episodeId: 2,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01T04:00:00'),
      }),
      makeEpisodeActivity({
        id: 3,
        showId: 1,
        episodeId: 1,
        userSlugs: [USER_SLUG_ALICE],
        activityAt: new Date('2024-01-01T03:00:00'),
      }),
    ];

    const result = coalesceBinges(activities);
    const activity = assertDefined(result[0]) as EpisodeActivity;
    const coalescedEpisodes = assertDefined(activity.episode.episodes);

    const episodeNumbers = coalescedEpisodes.map((ep) => ep.number);
    expect(episodeNumbers).toEqual([1, 2, 3]);
  });
});
