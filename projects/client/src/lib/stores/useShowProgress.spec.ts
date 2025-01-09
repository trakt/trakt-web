import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloProgressMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloProgressMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useShowProgress } from './useShowProgress.ts';

describe('store: useShowProgress', () => {
  describe('show: Silo (2023)', () => {
    it('should return progress', async () => {
      const result = await runQuery({
        factory: () => useShowProgress(ShowSiloMappedMock.slug).progress,
      });

      expect(result).to.deep.equal(ShowSiloProgressMappedMock);
    });
  });
});
