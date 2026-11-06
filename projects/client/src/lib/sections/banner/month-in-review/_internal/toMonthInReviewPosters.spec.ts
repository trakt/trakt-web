import type { ActivityHistory } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { EpisodeActivityHistoryMappedMock } from '$mocks/data/users/mapped/EpisodeActivityHistoryMappedMock.ts';
import { MovieActivityHistoryMappedMock } from '$mocks/data/users/mapped/MovieActivityHistoryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toMonthInReviewPosters } from './toMonthInReviewPosters.ts';

const [episode] = EpisodeActivityHistoryMappedMock;
const [movie] = MovieActivityHistoryMappedMock;

function movieEntry(key: string): ActivityHistory {
  if (!movie) throw new Error('missing movie mock');

  return {
    ...movie,
    key: `history-${key}`,
    movie: { ...movie.movie, key },
  };
}

describe('util: toMonthInReviewPosters', () => {
  it('should return an empty list for an empty history', () => {
    expect(toMonthInReviewPosters([])).toEqual([]);
  });

  it('should take the show poster for episodes and the movie poster for movies', () => {
    if (!episode || !movie) throw new Error('missing mocks');

    expect(toMonthInReviewPosters([episode, movie])).toEqual([
      { key: episode.show.key, src: episode.show.poster.url.thumb },
      { key: movie.movie.key, src: movie.movie.poster.url.thumb },
    ]);
  });

  it('should collapse repeated plays of the same title into one poster', () => {
    if (!episode) throw new Error('missing mocks');

    const rewatch = { ...episode, id: 2, key: 'episode-2' };

    expect(toMonthInReviewPosters([episode, rewatch])).toHaveLength(1);
  });

  it('should cap the fan at three posters in watch order', () => {
    const entries = ['a', 'b', 'c', 'd'].map(movieEntry);

    expect(toMonthInReviewPosters(entries).map((p) => p.key)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});
