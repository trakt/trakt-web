import { WatchedShowsMappedMock } from '$mocks/data/users/mapped/WatchedShowsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import {
  currentUserWatchedShowsQuery,
  mapWatchedShowResponse,
} from './currentUserWatchedShowsQuery.ts';

describe('currentUserWatchedShowsQuery', () => {
  it('should query for watched shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(currentUserWatchedShowsQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(WatchedShowsMappedMock);
  });
});

describe('mapWatchedShowResponse', () => {
  it('should include every rewatch date, not just the most recent play per episode', () => {
    const result = mapWatchedShowResponse([
      '147971',
      {
        '1|1': {
          '1': [
            '2024-01-05T20:00:00.000Z',
            '2024-02-20T20:00:00.000Z',
            '2024-03-15T20:00:00.000Z',
          ],
        },
      },
    ]);

    expect(result.watchedDates).to.deep.equal([
      new Date('2024-01-05T20:00:00.000Z'),
      new Date('2024-02-20T20:00:00.000Z'),
      new Date('2024-03-15T20:00:00.000Z'),
    ]);
  });

  it('should still expose only the most recent play as the episode watchedAt', () => {
    const result = mapWatchedShowResponse([
      '147971',
      {
        '1|1': {
          '1': [
            '2024-01-05T20:00:00.000Z',
            '2024-03-15T20:00:00.000Z',
          ],
        },
      },
    ]);

    expect(result.episodes).to.deep.equal([
      {
        season: 1,
        episodeId: 1,
        watchedAt: new Date('2024-03-15T20:00:00.000Z'),
        plays: 2,
      },
    ]);
  });

  it('should collect rewatch dates across every season and episode', () => {
    const result = mapWatchedShowResponse([
      '147971',
      {
        '1|1': {
          '1': ['2024-01-05T20:00:00.000Z'],
          '2': [
            '2024-01-06T20:00:00.000Z',
            '2024-02-20T20:00:00.000Z',
          ],
        },
        '2|2': {
          '1': [
            '2024-03-01T20:00:00.000Z',
            '2024-03-15T20:00:00.000Z',
          ],
        },
      },
    ]);

    expect(result.watchedDates).to.deep.equal([
      new Date('2024-01-05T20:00:00.000Z'),
      new Date('2024-01-06T20:00:00.000Z'),
      new Date('2024-02-20T20:00:00.000Z'),
      new Date('2024-03-01T20:00:00.000Z'),
      new Date('2024-03-15T20:00:00.000Z'),
    ]);
  });

  it('should count episodes per season regardless of rewatch count', () => {
    const result = mapWatchedShowResponse([
      '147971',
      {
        '1|1': {
          '1': [
            '2024-01-05T20:00:00.000Z',
            '2024-02-20T20:00:00.000Z',
            '2024-03-15T20:00:00.000Z',
          ],
          '2': ['2024-01-06T20:00:00.000Z'],
        },
        '2|2': {
          '1': ['2024-03-01T20:00:00.000Z'],
        },
      },
    ]);

    expect(result.playsPerSeason).to.deep.equal(new Map([[1, 2], [2, 1]]));
  });

  it('should expose the most recent play across all episodes as watchedAt', () => {
    const result = mapWatchedShowResponse([
      '147971',
      {
        '1|1': {
          '1': [
            '2024-03-15T20:00:00.000Z',
            '2024-01-05T20:00:00.000Z',
          ],
          '2': ['2024-02-20T20:00:00.000Z'],
        },
      },
    ]);

    expect(result.watchedAt).to.deep.equal(
      new Date('2024-03-15T20:00:00.000Z'),
    );
  });
});
