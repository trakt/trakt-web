import { LibraryMappedMock } from '$mocks/data/sync/mapped/LibraryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { libraryQuery } from './libraryQuery.ts';

describe('libraryQuery', () => {
  it('should query library', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          libraryQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(LibraryMappedMock);
  });
});
