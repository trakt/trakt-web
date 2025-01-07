import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloProgressMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloProgressMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useShowProgress } from './useShowProgress.ts';

describe('store: useShowProgress', () => {
  describe('show: Silo (2023)', () => {
    it('should return progress', async () => {
      render(QueryTestBed, {
        props: {
          queryFactory: () => useShowProgress(ShowSiloMappedMock.slug).progress,
        },
      });

      const result = await waitForQueryResult();
      expect(result).to.deep.equal(ShowSiloProgressMappedMock);
    });
  });
});
