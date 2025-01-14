import { MediaWatchingMappedMock } from '$mocks/data/summary/common/mapped/MediaWatchingMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloRatingsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRatingsMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { ShowSiloStatsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStatsMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useShowDetails } from './useShowDetails.ts';

describe('store: useShowDetails', () => {
  describe('show: Silo (2023)', () => {
    it('should return ratings', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).ratings,
      });

      expect(result).to.deep.equal(ShowSiloRatingsMappedMock);
    });

    it('should return crew', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).crew,
      });

      expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
    });

    it('should return seasons', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).seasons,
      });

      expect(result).to.deep.equal(ShowSiloSeasonsMappedMock);
    });

    it('should return studios', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).studios,
      });

      expect(result).to.deep.equal(ShowSiloStudiosMappedMock);
    });

    it('should return stats', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).stats,
      });

      expect(result).to.deep.equal(ShowSiloStatsMappedMock);
    });

    it('should return watching status', async () => {
      const result = await runQuery({
        factory: () => useShowDetails(ShowSiloMappedMock.slug).watchers,
      });

      expect(result).to.deep.equal(MediaWatchingMappedMock);
    });
  });
});
