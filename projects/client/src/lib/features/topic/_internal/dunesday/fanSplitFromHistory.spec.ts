import { MovieActivityHistoryMappedMock } from '$mocks/data/users/mapped/MovieActivityHistoryMappedMock.ts';
import { ShowActivityHistoryMappedMock } from '$mocks/data/users/mapped/ShowActivityHistoryMappedMock.ts';
import { describe, expect, it } from 'vitest';
import type { ActivityHistory } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { fanSplitFromHistory } from './fanSplitFromHistory.ts';

const movies = (genreLists: ReadonlyArray<ReadonlyArray<string>>) =>
  genreLists.flatMap((genres) =>
    MovieActivityHistoryMappedMock.map(
      (entry): ActivityHistory => ({
        ...entry,
        movie: { ...entry.movie, genres: [...genres] },
      }),
    ),
  );

const episodes = (genreLists: ReadonlyArray<ReadonlyArray<string>>) =>
  genreLists.flatMap((genres) =>
    ShowActivityHistoryMappedMock.map(
      (entry): ActivityHistory => ({
        ...entry,
        show: { ...entry.show, genres: [...genres] },
      }),
    ),
  );

describe('util: fanSplitFromHistory', () => {
  it('should stay cosmetic without any history', () => {
    expect(fanSplitFromHistory([])).toEqual({
      dune: 0,
      doom: 0,
      plays: 0,
      source: 'cosmetic',
    });
  });

  it('should count science fiction toward dune and superhero toward doom', () => {
    const result = fanSplitFromHistory(
      movies([
        ['science-fiction'],
        ['superhero', 'action'],
        ['science-fiction', 'superhero'],
        ['horror'],
      ]),
    );

    expect(result).toEqual({ dune: 2, doom: 2, plays: 4, source: 'history' });
  });

  it('should read the genres of the show for episode entries', () => {
    const result = fanSplitFromHistory(
      episodes([['science-fiction'], ['drama']]),
    );

    expect(result).toEqual({ dune: 1, doom: 0, plays: 2, source: 'history' });
  });

  it('should count every play, including those with no matching genre', () => {
    expect(fanSplitFromHistory(movies([['horror']])).plays).toBe(1);
  });
});
