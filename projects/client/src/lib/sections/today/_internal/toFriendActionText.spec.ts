import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toFriendActionText } from './toFriendActionText.ts';

const now = new Date(2026, 8, 28, 14, 0);

function action(activityAt: Date, episode = EpisodeSiloMappedMock) {
  return buildFriendAction({
    target: 'episode',
    activityAt,
    episode,
    episodeCount: 1,
  });
}

describe('util: toFriendActionText', () => {
  it('should show only the time for activity from today', () => {
    expect(toFriendActionText(action(new Date(2026, 8, 28, 9, 30)), now))
      .toBe(
        `Watched Season ${EpisodeSiloMappedMock.season} • Episode ${EpisodeSiloMappedMock.number} · 9:30 AM`,
      );
  });

  it('should say yesterday for activity from the day before', () => {
    expect(
      toFriendActionText(
        {
          ...action(new Date(2026, 8, 27, 21, 15)),
          target: 'movie',
          episode: null,
          episodeCount: 0,
        },
        now,
      ),
    ).toBe('Watched · yesterday, 9:15 PM');
  });

  it('should count the episodes of a binge', () => {
    expect(
      toFriendActionText(
        { ...action(new Date(2026, 8, 28, 9, 30)), episodeCount: 3 },
        now,
      ),
    ).toBe('Watched 3 episodes · 9:30 AM');
  });

  it('should name the season of a season rating', () => {
    expect(
      toFriendActionText(
        buildFriendAction({
          kind: 'rating',
          target: 'season',
          rating: 8,
          season: assertDefined(ShowSiloSeasonsMappedMock.at(0)),
          activityAt: new Date(2026, 8, 28, 11, 51),
        }),
        now,
      ),
    ).toBe('Rated Season 1 · 11:51 AM');
  });

  it('should say reviewed for a review', () => {
    expect(
      toFriendActionText(
        buildFriendAction({
          kind: 'comment',
          comment: {
            id: 1,
            text: 'A long review',
            gif: null,
            isSpoiler: false,
            isReview: true,
            likeCount: 0,
            replyCount: 0,
          },
          activityAt: new Date(2026, 8, 28, 8, 5),
        }),
        now,
      ),
    ).toBe('Reviewed · 8:05 AM');
  });
});
