import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { FollowingActivityMappedMock } from '$mocks/data/users/mapped/FollowingActivityMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { buildFollowingActivity } from '$test/beds/today/buildFollowingActivity.ts';
import { describe, expect, it } from 'vitest';
import { toTitleStories } from './toTitleStories.ts';

const ron = { ...UserProfileHarryMappedMock, key: 'user-2', username: 'ron' };

const at = (hour: number) =>
  new Date(`2026-09-28T${String(hour).padStart(2, '0')}:00:00.000Z`);

function episodeWatch(
  key: string,
  hour: number,
  episode = EpisodeSiloMappedMock,
): FollowingActivity {
  return buildFollowingActivity({
    key,
    activityAt: at(hour),
    target: { type: 'episode', show: ShowSiloMappedMock, episode },
  });
}

function movieRating(
  key: string,
  rating: number,
  user = UserProfileHarryMappedMock,
) {
  return buildFollowingActivity({
    key,
    user,
    detail: { action: 'rating', rating },
  });
}

describe('util: toTitleStories', () => {
  it('should return no stories for no activity', () => {
    expect(toTitleStories([])).toEqual([]);
  });

  it('should group seasons, episodes and shows under their show', () => {
    const stories = toTitleStories(FollowingActivityMappedMock);

    expect(stories.map((story) => story.key)).toEqual([
      `show-${ShowSiloMappedMock.id}`,
      `movie-${MovieHereticMappedMock.id}`,
    ]);
    expect(stories.at(0)?.actions.map((action) => action.kind)).toEqual([
      'watch',
      'rating',
    ]);
  });

  it('should keep the season on a season rating', () => {
    const [show] = toTitleStories(FollowingActivityMappedMock);
    const rating = show?.actions.find((action) => action.kind === 'rating');

    expect(rating?.season).toEqual(
      assertDefined(ShowSiloSeasonsMappedMock.at(0)),
    );
    expect(rating?.rating).toBe(8);
  });

  it('should keep the comment and its gif', () => {
    const movie = toTitleStories(FollowingActivityMappedMock).at(1);
    const comment = movie?.actions.at(0)?.comment;

    expect(comment?.text).toBe('That ending though.');
    expect(comment?.gif?.url).toBe('https://static.klipy.com/ii/heretic.gif');
  });

  it('should merge a friend binge into one watch, newest episode first', () => {
    const latest = { ...EpisodeSiloMappedMock, id: 99, number: 3 };
    const [story] = toTitleStories([
      episodeWatch('watch:1', 9),
      episodeWatch('watch:2', 11, latest),
    ]);

    expect(story?.actions).toHaveLength(1);
    expect(story?.actions.at(0)?.episodeCount).toBe(2);
    expect(story?.actions.at(0)?.episode).toEqual(latest);
  });

  it('should dedupe activity with the same key', () => {
    const [story] = toTitleStories([
      episodeWatch('watch:1', 9),
      episodeWatch('watch:1', 9),
    ]);

    expect(story?.actions.at(0)?.episodeCount).toBe(1);
  });

  it('should average the latest title rating of each friend', () => {
    const [story] = toTitleStories([
      movieRating('rating:1', 10),
      movieRating('rating:2', 7, ron),
    ]);

    expect(story?.averageRating).toBe(8.5);
  });

  it('should fold a friend rating into their watch of the same movie', () => {
    const [story] = toTitleStories([
      buildFollowingActivity({ key: 'watch:1', activityAt: at(9) }),
      buildFollowingActivity({
        key: 'rating:1',
        activityAt: at(10),
        detail: { action: 'rating', rating: 9 },
      }),
    ]);

    expect(story?.actions).toHaveLength(1);
    expect(story?.actions.at(0)?.kind).toBe('watch');
    expect(story?.actions.at(0)?.rating).toBe(9);
    expect(story?.averageRating).toBe(9);
  });

  it('should fold an episode rating into the watch of that episode', () => {
    const [story] = toTitleStories([
      episodeWatch('watch:1', 9),
      buildFollowingActivity({
        key: 'rating:1',
        activityAt: at(10),
        target: {
          type: 'episode',
          show: ShowSiloMappedMock,
          episode: EpisodeSiloMappedMock,
        },
        detail: { action: 'rating', rating: 7 },
      }),
    ]);

    expect(story?.actions).toHaveLength(1);
    expect(story?.actions.at(0)?.rating).toBe(7);
  });

  it('should fold a rating into one watch when a movie was watched twice', () => {
    const [story] = toTitleStories([
      buildFollowingActivity({ key: 'watch:1', activityAt: at(8) }),
      buildFollowingActivity({ key: 'watch:2', activityAt: at(9) }),
      buildFollowingActivity({
        key: 'rating:1',
        activityAt: at(10),
        detail: { action: 'rating', rating: 9 },
      }),
    ]);

    expect(
      story?.actions.map(({ key, kind, rating }) => ({ key, kind, rating })),
    ).toEqual([
      { key: 'watch:2', kind: 'watch', rating: 9 },
      { key: 'watch:1', kind: 'watch', rating: null },
    ]);
  });

  it('should keep a rating apart from another friend watch', () => {
    const [story] = toTitleStories([
      buildFollowingActivity({ key: 'watch:1', activityAt: at(9) }),
      movieRating('rating:1', 9, ron),
    ]);

    expect(story?.actions.map((action) => action.kind).toSorted()).toEqual([
      'rating',
      'watch',
    ]);
  });

  it('should leave season ratings out of the title average', () => {
    const [show] = toTitleStories(FollowingActivityMappedMock);

    expect(show?.averageRating).toBeNull();
  });
});
