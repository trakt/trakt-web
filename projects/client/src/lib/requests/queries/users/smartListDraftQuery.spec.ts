import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { server } from '$mocks/server.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { SmartListDraftMappedMock } from '$mocks/data/users/mapped/SmartListDraftMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { smartListDraftQuery } from './smartListDraftQuery.ts';

const userId = assertDefined(UserProfileHarryMappedMock.slug);
const listId = assertDefined(SiloListsMappedMock.at(0)).slug;

describe('smartListDraftQuery', () => {
  it('should map the draft', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(smartListDraftQuery({ userId, listId })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SmartListDraftMappedMock);
  });

  it('should resolve to null when there is no good draft', async () => {
    server.use(
      http.get(
        `http://localhost/users/${userId}/lists/${listId}/smart-list-draft`,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(smartListDraftQuery({ userId, listId })),
      waitFor: (response) => response?.isSuccess === true,
    });

    expect(result?.data).to.equal(null);
  });
});
