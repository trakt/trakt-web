import { ShowsAnticipatedMappedMock } from '$mocks/data/shows/mapped/ShowsAnticipatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showAnticipatedQuery } from './showAnticipatedQuery.ts';

describe('showAnticipatedQuery', () => {
  it('should query for anticipated shows', async () => {
    const result = await runQuery({
      factory: () => createQuery(showAnticipatedQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowsAnticipatedMappedMock);
  });
});
