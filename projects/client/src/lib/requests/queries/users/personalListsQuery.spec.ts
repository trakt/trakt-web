import { PersonalListsMappedMock } from '$mocks/data/users/mapped/PersonalListsMappedMock.ts';
import { PersonalListsResponseMock } from '$mocks/data/users/response/PersonalListsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { personalListsQuery } from './personalListsQuery.ts';

describe('personalListsQuery', () => {
  it('should query user lists', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          personalListsQuery({ slug: 'me', limit: 10 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(PersonalListsMappedMock);
  });

  it('should query user lists with sort params', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get('http://localhost/users/me/lists*', ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json(PersonalListsResponseMock);
      }),
    );

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          personalListsQuery({
            slug: 'me',
            limit: 10,
            sortBy: 'updated_at',
            sortHow: 'desc',
          }),
        ),
      mapper: mapToEntries,
    });

    expect(requestedUrl?.searchParams.get('sort_by')).to.equal('updated_at');
    expect(requestedUrl?.searchParams.get('sort_how')).to.equal('desc');
  });
});
