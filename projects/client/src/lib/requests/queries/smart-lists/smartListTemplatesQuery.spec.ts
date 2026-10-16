import type { SmartListTemplate } from '$lib/requests/models/SmartListTemplate.ts';
import { smartListTemplatesQuery } from '$lib/requests/queries/smart-lists/smartListTemplatesQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';

const toTemplates = (result: unknown) => (result ?? []) as SmartListTemplate[];

describe('smartListTemplatesQuery', () => {
  it('should map a template with its preview posters', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(smartListTemplatesQuery()),
      mapper: (response) => response?.data,
    });

    expect(toTemplates(result).at(0)).to.deep.equal({
      key: 'smart-list-template-hidden-gems',
      id: 'hidden-gems',
      source: 'discover',
      mediaType: 'movies',
      filters: { ratings: [78], votes: [300, 3000] },
      personal: false,
      total: 315,
      posters: [
        ShowSiloMappedMock.poster.url.thumb,
        MovieHereticMappedMock.poster.url.thumb,
      ],
    });
  });

  it('should keep a personal template without a total or posters', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(smartListTemplatesQuery()),
      mapper: (response) => response?.data,
    });

    expect(toTemplates(result).at(1)).toMatchObject({
      id: 'havent-seen-it',
      personal: true,
      total: null,
      posters: [],
    });
  });
});
