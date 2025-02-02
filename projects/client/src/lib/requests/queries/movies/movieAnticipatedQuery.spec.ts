import { MoviesAnticipatedMappedMock } from '$mocks/data/movies/mapped/MoviesAnticipatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieAnticipatedQuery } from './movieAnticipatedQuery.ts';

describe('movieAnticipatedQuery', () => {
  it('should query for anticipated movies', async () => {
    const result = await runQuery({
      factory: () => createQuery(movieAnticipatedQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MoviesAnticipatedMappedMock);
  });
});
