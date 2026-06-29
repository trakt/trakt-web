import { ConnectedAppsMappedMock } from '$mocks/data/apps/mapped/ConnectedAppsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { connectedAppsQuery } from './connectedAppsQuery.ts';

describe('connectedAppsQuery', () => {
  it('should map connected apps to the domain model', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(connectedAppsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(ConnectedAppsMappedMock);
  });
});
