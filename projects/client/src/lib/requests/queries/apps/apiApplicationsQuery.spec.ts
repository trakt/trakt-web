import { ApiApplicationsMappedMock } from '$mocks/data/apps/mapped/ApiApplicationsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { apiApplicationsQuery } from './apiApplicationsQuery.ts';

describe('apiApplicationsQuery', () => {
  it('should map API applications to the domain model', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(apiApplicationsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(ApiApplicationsMappedMock);
  });
});
