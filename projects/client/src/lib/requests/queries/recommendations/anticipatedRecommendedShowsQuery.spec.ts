import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { RecommendedShowsMappedMock } from '$mocks/data/recommendations/mapped/RecommendedShowsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { anticipatedRecommendedShowsQuery } from './anticipatedRecommendedShowsQuery.ts';

describe('anticipatedRecommendedShowsQuery', () => {
  it('should query anticipated recommended shows', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(anticipatedRecommendedShowsQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(
      RecommendedShowsMappedMock.map((show) =>
        Object.fromEntries(
          Object.entries(show).filter(
            ([key]) => key !== 'sources' && key !== 'people',
          ),
        ),
      ),
    );
  });

  it('should refetch after hiding a recommended show', () => {
    expect(anticipatedRecommendedShowsQuery().queryKey).toContain(
      InvalidateAction.HideRecommended('show'),
    );
  });
});
