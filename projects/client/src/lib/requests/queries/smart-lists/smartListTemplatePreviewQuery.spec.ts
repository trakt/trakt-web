import { smartListTemplatePreviewQuery } from '$lib/requests/queries/smart-lists/smartListTemplatePreviewQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';

describe('smartListTemplatePreviewQuery', () => {
  it('should read the total from the pagination header', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          smartListTemplatePreviewQuery({
            source: 'trending',
            mediaType: 'movies',
            filters: { ignore_watched: 'true' },
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal({
      total: 81,
      posters: [
        ShowSiloMappedMock.poster.url.thumb,
        MovieHereticMappedMock.poster.url.thumb,
      ],
    });
  });
});
