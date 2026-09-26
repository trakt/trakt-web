import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { SiloListsResponseMock } from '$mocks/data/summary/shows/silo/response/SiloListsResponseMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { listCollaboratorsQuery } from './listCollaboratorsQuery.ts';

describe('listCollaboratorsQuery', () => {
  const listId = assertDefined(SiloListsResponseMock.at(0)).ids.trakt;

  it('should query for a list\'s collaborators', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(listCollaboratorsQuery({ listId })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([UserProfileHarryMappedMock]);
  });

  it('should invalidate when the list\'s collaborators change', () => {
    const query = listCollaboratorsQuery({ listId });

    expect(query.queryKey).toContain(InvalidateAction.List.Collaborators);
  });
});
