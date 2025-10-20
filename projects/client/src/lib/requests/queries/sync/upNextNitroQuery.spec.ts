import { UpNextMappedMock } from '$mocks/data/sync/mapped/UpNextMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { upNextNitroQuery } from './upNextNitroQuery.ts';

describe('upNextNitroQuery', () => {
  it('should query up next', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          upNextNitroQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(UpNextMappedMock);
  });
});
